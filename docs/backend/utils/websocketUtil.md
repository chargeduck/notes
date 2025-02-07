:::tip
之前一直没玩明白怎么在Springboot项目里使用websocket，现在写了一次工具类，记录一下
:::

# 1. SpringBoot项目中使用Websocket
> 引入依赖之后，直接写一个类添加上`@Component`注解，然后写一个`@ServerEndpoint`注解，就可以使用了
1. 引入依赖
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```
2. 实现类
> `@ServerEndpoint` 注解是用来指定一个URI，客户端可以通过这个URI来连接到WebSocket。
> 
> 虽然加了一个`@Component`注解，但是直接使用`@Autowired`注解时对象为空，所以才用了hutool的工具类，不知道怎么解决

```http request
# 连接websocket
ws://localhost:8080/collect/wsChat/{groupId}/{senderId}
```
**消息体**
```java
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * @author eleven
 * @date 2025/1/22 8:31
 * @apiNote
 */
@Data
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class WsChatMsg {
    private MsgType type;
    private Object data;
    private String groupId;
    private String senderId;
    private String supplierName;
    public enum MsgType {
        /**
         * 心跳数据包
         */
        HEART_BEAT,
        /**
         * 历史消息
         */
        HISTORY_MSG,
        /**
         * 聊天数据包
         */
        CHAT,
        /**
         * 新的聊天组
         */
        NEW_GROUP,
        /**
         * 上线消息
         */
        ONLINE_STATE,
        /**
         * 所有在线
         */
        ALL_ONLINE,
        /**
         * 下线消息
         */
        OFFLINE_STATE,
        /**
         * 错误信息
         */
        ERROR_RESULT,
        /**
         * 新消息
         */
        NEW_CHAT,
        /**
         * 已读
         */
        READ,
        ;
    }
}
```

**Websocket服务**
```java

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.extra.spring.SpringUtil;
import com.cotte.srm.buy.collect.model.WsChatMsg;
import com.cotte.srm.buy.collect.utils.WsChatMsgUtil;
import com.cotte.srm.common.core.dao.collect.CCollectChatGroupMapper;
import com.cotte.srm.common.core.domain.collect.CollectChatMsg;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import static com.cotte.srm.buy.collect.model.WsChatMsg.MsgType.CHAT;
import static com.cotte.srm.buy.collect.model.WsChatMsg.MsgType.HEART_BEAT;

/**
 * @author eleven
 * @date 2025/1/21 8:43
 * @apiNote
 */
@Component
@Slf4j
@ServerEndpoint("/collect/wsChat/{groupId}/{senderId}")
public class WebSocketChatGroupServer {
    private static final ConcurrentHashMap<String, Map<String, Session>> webSocketMap = new ConcurrentHashMap<>();
    private static final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
    private static final Map<Session, LocalDateTime> lastMessageTime = new HashMap<>();
    /**
     * 心跳间隔时间 5分钟 没有发消息断开连接
     */
    private static final long HEART_BEAT_INTERVAL = 1000L * 60 * 5;

    private CCollectChatMsgService chatMsgService;
    private CCollectChatGroupMapper groupMapper;
    private WsChatMsgUtil wsChatMsgUtil;

    private final Gson gson = new Gson();

    /**
     * 打开连接时将当前的session放入到map当中。
     * key为 groupId ，value为当前组下边的session集合
     * 连接成功后发送在线消息，并发送历史消息
     *
     * @param session  客户端连接
     * @param groupId  聊天组id
     * @param senderId 发送者id
     * @throws IOException 发送消息失败
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("groupId") String groupId, @PathParam("senderId") String senderId) throws IOException {
        autowiredSpringBean();
        if (webSocketMap.containsKey(groupId)) {
            webSocketMap.get(groupId).put(senderId, session);
        } else {
            Map<String, Session> map = new ConcurrentHashMap<>();
            map.put(senderId, session);
            webSocketMap.put(groupId, map);
            pushNewGroup(groupId, senderId);
        }
        lastMessageTime.put(session, LocalDateTime.now());
        // 广播当前询价下所有在线sender消息
        broadcastAllOnline(session, groupId, senderId);
        // 广播上线消息
        if (webSocketMap.containsKey(groupId)) {
            Map<String, Session> sessionMap = webSocketMap.get(groupId);
            sessionMap.forEach((k, v) -> {
                v.getAsyncRemote().sendText(wsChatMsgUtil.onlineMessage(groupId, senderId));
            });
        }
        // 开启定时器防止资源占用
        startTimeoutCheck();
        // 发送历史消息
        List<CollectChatMsg> history = chatMsgService.history(new CollectChatMsg().setChatGroupId(groupId));
        session.getAsyncRemote().sendText(wsChatMsgUtil.historyMsg(groupId, senderId, history));
    }

    /**
     * 新的询价留言
     * @param groupId
     * @param senderId
     */
    private void pushNewGroup(String groupId, String senderId) {
        // 根据groupId查询当前询价的发起人账号，推送新的聊天组消息
        String inquireUserId = groupMapper.selectGroupInquireUser(groupId);
        if (StrUtil.isNotBlank(inquireUserId)) {
            for (Map<String, Session> sessionMap : webSocketMap.values()) {
                if (sessionMap.containsKey(inquireUserId)) {
                    sessionMap.get(inquireUserId)
                            .getAsyncRemote()
                            .sendText(wsChatMsgUtil.newGroupMessage(groupId, senderId));
                    break;
                }
            }
        }
    }

    /**
     * 新的询价消息，推送新消息
     * @param groupId   当前组id
     * @param senderId  当前发送者id
     */
    private void changeLastMessage(String groupId, String senderId) {
        List<CollectChatMsg> history = chatMsgService.history(new CollectChatMsg().setChatGroupId(groupId));
        CollectChatMsg chatMsg = history.get(history.size() - 1);
        webSocketMap.get(groupId).values()
                .forEach(session -> session.getAsyncRemote().sendText(wsChatMsgUtil.changeLastMessage(groupId, senderId, chatMsg)));
    }

    /**
     * 广播所有在线人的消息
     * @param session   当前session
     * @param groupId   当前组id
     * @param senderId  当前发送者id
     */
    private void broadcastAllOnline(Session session, String groupId, String senderId) {
        List<String> allGroup = groupMapper.selectInquireAllGroup(groupId);
        Map<String, Session> tempMap = new HashMap<>();
        webSocketMap.forEach((groupIdKey, sessionMap) -> {
            if (allGroup.contains(groupIdKey)) {
                sessionMap.forEach((k,v) -> {
                    if (v != null && v != session) {
                        tempMap.put(k,v);
                    }
                });
            }
        });
        tempMap.forEach((k,v) -> {
            v.getAsyncRemote().sendText(wsChatMsgUtil.allOnlineMessage(groupId, senderId, tempMap.keySet()));
        });
    }

    /**
     * 注入spring bean
     */
    private void autowiredSpringBean() {
        // 获取 CCollectChatMsgService 的实例
        if (chatMsgService == null) {
            chatMsgService = SpringUtil.getBean(CCollectChatMsgService.class);
        }
        if (wsChatMsgUtil == null) {
            wsChatMsgUtil = SpringUtil.getBean(WsChatMsgUtil.class);
        }
        if (groupMapper == null) {
            groupMapper = SpringUtil.getBean(CCollectChatGroupMapper.class);
        }
    }

    @OnError
    public void onError(Throwable throwable, Session session,
                        @PathParam("groupId") String groupId, @PathParam("senderId") String senderId) throws IOException {
        log.error("WebSocket发生错误 {}", throwable.getMessage());
        if (throwable instanceof IllegalStateException) {
            session.getAsyncRemote().sendText(wsChatMsgUtil.errorMsg(groupId, senderId, "type类型不合法"));
            return;
        }
        if (throwable instanceof JsonSyntaxException) {
            session.getAsyncRemote().sendText(wsChatMsgUtil.errorMsg(groupId, senderId, "CHAT聊天消息体不合法"));
            return;
        }
        session.getAsyncRemote().sendText(wsChatMsgUtil.errorMsg(groupId, senderId, throwable.getMessage()));
    }

    @OnClose
    public void onClose(@PathParam("groupId") String groupId, @PathParam("senderId") String senderId) {
        if (webSocketMap.containsKey(groupId)) {
            Map<String, Session> sessionMap = webSocketMap.get(groupId);
            sessionMap.forEach((k, v) -> {
                if (v.isOpen()) {
                    v.getAsyncRemote().sendText(wsChatMsgUtil.offlineMessage(groupId, senderId));
                }
            });
            sessionMap.remove(senderId);
            // 双方都下线则将当前组从缓存中删除
            if (sessionMap.isEmpty()) {
                webSocketMap.remove(groupId);
            }
        }
    }

    @OnMessage
    public void onMessage(String message, Session session, @PathParam("groupId") String groupId, @PathParam("senderId") String senderId) throws IOException {
        WsChatMsg wsMsg = gson.fromJson(message, WsChatMsg.class);
        WsChatMsg.MsgType type = wsMsg.getType();
        if (type == null) {
            session.getAsyncRemote().sendText(wsChatMsgUtil.errorMsg(groupId, senderId, "type类型不合法"));
            return;
        }
        if (type == HEART_BEAT) {
            lastMessageTime.put(session, LocalDateTime.now());
            session.getAsyncRemote().sendText(wsChatMsgUtil.heartBeatMsg(groupId, senderId));
            return;
        }
        Map<String, Session> sessionMap = webSocketMap.get(groupId);
        if (sessionMap == null) {
            session.getAsyncRemote().sendText(wsChatMsgUtil.errorMsg(groupId, senderId, "聊天组不存在"));
        }
        if (type == CHAT) {
            // 插入消息
            CollectChatMsg chatMsg = BeanUtil.mapToBean((Map<?, ?>) wsMsg.getData(), CollectChatMsg.class, true, null);
            chatMsg.setChatGroupId(groupId).setSenderId(senderId);
            chatMsgService.chat(chatMsg);
            // 将消息同步给另外一个客户端session
            sessionMap.forEach((k, v) -> {
                if (!k.equals(senderId)) {
                    v.getAsyncRemote().sendText(wsChatMsgUtil.chatMsg(groupId, senderId, chatMsg));
                }
            });
            changeLastMessage(groupId, senderId);
        }
    }

    /**
     * 首次延迟 0 秒开始执行，之后每 10 秒执行一次任务
     * 判断如果session超过30s没有发送消息就关闭连接，防止连接被占用
     */
    private void startTimeoutCheck() {
        // 使用定时任务调度器，以固定的频率执行任务
        scheduler.scheduleAtFixedRate(() -> {
            // 获取当前时间
            LocalDateTime currentTime = LocalDateTime.now();
            lastMessageTime.forEach((k, v) -> {
                // 计算当前时间与该会话最后消息接收时间的时间差
                if (Math.abs(Duration.between(currentTime, v).toMillis()) > HEART_BEAT_INTERVAL) {
                    try {
                        // 如果时间差超过 30 秒，则关闭该会话
                        k.close();
                        // 从映射中移除该会话
                        lastMessageTime.remove(k);
                    } catch (IOException e) {
                        log.error("关闭超时连接失败 {}", e.getMessage());
                    }
                }
            });
        }, 0, 10, TimeUnit.SECONDS);

    }
}
```
# 2. Netty开启Websocket
> 有机会试一下
