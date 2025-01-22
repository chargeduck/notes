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

```java

import cn.hutool.extra.spring.SpringUtil;
import com.alibaba.fastjson.JSON;
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

    private ChatMsgService chatMsgService;
    private WsChatMsgUtil wsChatMsgUtil;

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
        }
        lastMessageTime.put(session, LocalDateTime.now());
        session.getBasicRemote().sendText(wsChatMsgUtil.onlineMessage(senderId));
        startTimeoutCheck();
        List<CollectChatMsg> history = chatMsgService.history(new CollectChatMsg().setChatGroupId(groupId));
        session.getBasicRemote().sendText(wsChatMsgUtil.historyMsg(history));
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
    }

    @OnError
    public void onError(Throwable throwable, Session session) throws IOException {
        log.error("WebSocket发生错误 {}", throwable.getMessage());
        session.getBasicRemote().sendText(wsChatMsgUtil.errorMsg(throwable.getMessage()));
        throw new GlobalException(throwable.getMessage());
    }

    @OnClose
    public void onClose(@PathParam("groupId") String groupId, @PathParam("senderId") String senderId) {
        if (webSocketMap.containsKey(groupId)) {
            Map<String, Session> sessionMap = webSocketMap.get(groupId);
            sessionMap.forEach((k, v) -> {
                v.getAsyncRemote().sendText(wsChatMsgUtil.offlineMessage(senderId));
            });
            sessionMap.remove(senderId);
        }
    }

    @OnMessage
    public void onMessage(String message, Session session, @PathParam("groupId") String groupId, @PathParam("senderId") String senderId) throws IOException {
        WsChatMsg wsMsg = JSON.parseObject(message, WsChatMsg.class);
        WsChatMsg.MsgType type = wsMsg.getType();
        if (type == HEART_BEAT) {
            lastMessageTime.put(session, LocalDateTime.now());
            session.getBasicRemote().sendText(wsChatMsgUtil.heartBeatMsg());
            return;
        }
        Map<String, Session> sessionMap = webSocketMap.get(groupId);
        if (sessionMap == null) {
            session.getBasicRemote().sendText(wsChatMsgUtil.errorMsg("聊天组不存在"));
        }
        if (type == CHAT) {
            Object data = wsMsg.getData();
            // 插入消息
            chatMsgService.chat((CollectChatMsg) data);
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
                        // 打印异常信息
                        e.printStackTrace();
                    }
                }
            });
        }, 0, 10, TimeUnit.SECONDS);

    }
}
```
# 2. Netty开启Websocket
> 有机会试一下
