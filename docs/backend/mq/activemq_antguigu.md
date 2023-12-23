#  1. 入门概述

> 资料笔记来源 [尚硅谷ActiveMq](https://www.bilibili.com/video/BV164411G7aB) ，
>
> [下载地址](https://activemq.apache.org/)

## 1. 前言

Mq能够做到的事情有 `解耦` 、`削峰` 、`异步`

- 要做到系统接口，当新模块接入进来的时候，原来的代码改动最小（解耦）
- 设置流量缓冲池，可以让后端系统按照自身的吞吐量进行消费不至于宕机（削峰）
- 强弱依赖梳理能力将非关键调用链路异步提升整体吞吐量（异步）

## 2. 定义

> 消息生产者将消息发送到消息服务器，消息服务器将消息存放在MQ中，在合适的时候消息服务器会把消息转发给消费者，在这个过程中，<font color=red>发送和消费都是异步的</font>，也就是生产者无需等待，而且消费者和生产者之间的生命周期没有必然的 关系，尤其是在 pub / sub 模式下，也可以完成一对多的通信。

### 1. 特点

1. 采用异步处理模式

   > 生产者可以发送一个消息而无须等待响应。生产者将消息发送到一条虚拟的通道(主题或队列)上;
   > 消费者则订阅或监听该通道。一条信息可能最终转发给一个或多个消费者，这些消费者都无需对消息生产者做出同步回应。整个过程都是异步的。

2. 应用系统之间解耦

   > 生产者和消费者不必了解对方只需要确认消息
   >
   > 生产者和消费者不必同时在线

# 2. 下载安装

## 1. 下载

| Windows                   | [apache-activemq-5.16.3-bin.zip](https://www.apache.org/dyn/closer.cgi?filename=/activemq/5.16.3/apache-activemq-5.16.3-bin.zip&action=download) | [SHA512](https://downloads.apache.org/activemq/5.16.3/apache-activemq-5.16.3-bin.zip.sha512) | [GPG Signature](https://downloads.apache.org/activemq/5.16.3/apache-activemq-5.16.3-bin.zip.asc) |
| ------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Unix/Linux/Cygwin         | [apache-activemq-5.16.3-bin.tar.gz](https://www.apache.org/dyn/closer.cgi?filename=/activemq/5.16.3/apache-activemq-5.16.3-bin.tar.gz&action=download) | [SHA512](https://downloads.apache.org/activemq/5.16.3/apache-activemq-5.16.3-bin.tar.gz.sha512) | [GPG Signature](https://downloads.apache.org/activemq/5.16.3/apache-activemq-5.16.3-bin.tar.gz.asc) |
| Source Code Distribution: | [activemq-parent-5.16.3-source-release.zip](https://www.apache.org/dyn/closer.cgi?filename=/activemq/5.16.3/activemq-parent-5.16.3-source-release.zip&action=download) | [SHA512](https://downloads.apache.org/activemq/5.16.3/activemq-parent-5.16.3-source-release.zip.sha512) | [GPG Signature](https://downloads.apache.org/activemq/5.16.3/activemq-parent-5.16.3-source-release.zip.asc) |

## 2. windows下安装

- 将下载好的压缩包解压
- 进入解压之后的 `bin`目录
- 双击 `activemq.bat` 即可
- 如果出现闪退的话，可以进入 `win64`或者`win32`,启动里边的`activemq.bat`
- 浏览器访问`localhost:8161/admin` 账号密码`admin  admin`

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-wCX4MLh2-1631866082032)(D:\Study\笔记\Mq\img\activeMq_admin.png)\]](https://img-blog.csdnimg.cn/6894761b71524b72a2bae8c7fc5fc351.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5piv6LW15pWi5pWi5ZWK,size_20,color_FFFFFF,t_70,g_se,x_16)


## 3. Linux下安装

- 将压缩包上传到虚拟机

  ```shell
  scp apache-activemq-5.16.3-bin.tar.gz root@192.168.153.130:/opt
  ```

- 解压缩

  ```shell
  tar -zxvf apache-activemq-5.16.3-bin.tar.gz
  ```

- 启动activeMq

  ```shell
  # 进入activeMq目录
  cd apache-activemq-5.16.3/bin
  # 普通启动
  ./activemq start
  # 展示下列信息就是启动成功了
  INFO: Loading '/opt/apache-activemq-5.16.3//bin/env'
  INFO: Using java '/usr/local/java/jdk1.8.0_201/bin/java'
  INFO: Starting - inspect logfiles specified in logging.properties and log4j.properties to get details
  INFO: pidfile created : '/opt/apache-activemq-5.16.3//data/activemq.pid' (pid '3780')
  #查询是否启动成功 grep -v grep去除包含grep的进程
  ps -ef|grep activemq|grep -v grep
  # 查看端口
  netstat -anp|grep 61616
  #重启
  ./actviemq restart
  # 关闭
  ./activemq stop
  # 查看是否结束 如果不打印东西就是结束成功了
  lsof -i:61616
  ```

## 4. 带日志的启动方式

```shell
# 进入安装目录
cd /opt/apache-activemq-5.6.13/bin
# 带日志启动
./activemq start > activemq_run.log
```

# 3. JMS

JMS（Java Message Service）是javaEE的规范之一，这个规范指出消息的传递必须是异步的、非阻塞的，可以实现系统解耦增加系统的灵活性

## 1 核心API

1. ConnectionFactory：连接工场，用于创建Connection；
2. Connection：客户端与JMS的一次连接
3. Session：客户端与JMS的一次会话，由Connection创建，可以用来创建消息的生产者和消费者，也可以创建消息的目的地和消息；
4. Destination：生产者生产消息的目的地，消费者消费消息的来源，由Session创建；
    - Queue：队列
    - Topic：主题
5. MessageProducer：消息的生产者，由Session创建，用于发送MQ消息；
6. MessageConsumer：消息的消费者，由Session创建，用于消费消息；
7. Message：消息，由Session创建
    - **TextMessage**
    - **MapMessage**
    - **ObjectMessage**
    - BytesMessage
    - StreamMessage
8. MessageListener：消息监听器

## 2 JMS消息类型

1. 点对点 （P2P）

一条消息只能被一个消费者消费，被消费之后自动从消息队列剔除

2. 发布/订阅（Pub/Sub）

一条消息可以被多个消费者同时消费，生产者和消费者有时间上的依赖性，也就是生产者在发送消息时，应该至少有一个消费者处于在线状态

# 4. java实现ActiveMQ通讯

## 1. 新建maven工程

```xml
<dependencies>
  <!--  activemq  所需要的jar 包-->
  <dependency>
    <groupId>org.apache.activemq</groupId>
    <artifactId>activemq-all</artifactId>
    <version>5.15.9</version>
  </dependency>
  <!--  activemq 和 spring 整合的基础包 -->
  <dependency>
    <groupId>org.apache.xbean</groupId>
    <artifactId>xbean-spring</artifactId>
    <version>3.16</version>
  </dependency>
</dependencies>
```

## 2. ActiveMq的通用套路

### 1创建消息生产者

1. 创建连接工厂[ConnectionFactory]

```java 
//前两个工作的时候应该会给账号密码，和最后一个是activemq的连接地址
ConnectionFactory factory  = new ActiveMQConnectionFactory(
    null, null, "tcp://localhost:61616");
```

2. 创建连接对象 **<font color=red>并调用 start 方法</font>**

```java
//创建完成之后必调用start方法！！！
Connection connection = factory.createConnection();
connection.start();
```

3. **<font color=red>创建session，最重要的就是session</font>**

> 创建队列消息和创建生产者都是由session创建
>
> - 第一个参数： 是否开启事务
> - 第二个参数：手动签收还是自动签收
>
> | 常量                       | 数值 | 签收方式       |
> | -------------------------- | ---- | -------------- |
> | Session.AUTO_ACKNOWLEDGE   | 1    | 自动签收       |
> | Session.CLIENT_ACKNOWLEDGE | 2    | 客户端手动签收 |

```java
Session session = connection.createSession(false,Session.AUTO_ACKNOWLEDGE)
```

4. 创建Destination，如果队列不存在则自动创建

```java
//1.创建Queue
Queue queue = session.createQueue("hello");
//2.创建Topic队列
Topic topic = session.createTopic("topic");
```

5. 创建生产者

```java
//消息发布者
MessageProduce producer = session.createProdecer(queue);
MessageProduce producer = session.createProdecer(topic);
```

6. 创建消息

> 消息类型一共有五种，分别是**<font color=red>TextMessage[文本消息]、MapMessage[Map消息，键值对类型]、ObjectMessage</font>**
>
> 剩下的两种不是很常用 <font color=blue>BytesMessage、StreamMessage</font>

```java
//文本类型消息
TextMessage msg = session.createTextMessage("这是文本类型的消息");
//Map类型消息
MapMessage mapMsg = session.createMapMessage();
mapMsg.setString("name","mapMsg");
mapMsg.setInt("id",1);
...
//ObjectMessage   
```

7. 发送消息

```java
producer.send(msg);
```

8. 关闭连接

```java
producer.close();
session.close();
connection.close();
```

### 2 创建消息消费者

1. 创建ConnectionFactory

```java
ConnectionFactory factory = new ActiveMQConnectionFactory(null,null,"tcp://localhost:61616");
```

2. 创建Connection**<font color=red>并调用start方法</font>**

```java
Connection connection = factory.createConnection();
connection.start();
```

3. 创建session

```java
//参数1，是否开启事务
//参数2.客户端签收消息的方式
Session session = connection.ceateSession(false,Session.AUTO_ACKNOWLEDGE);
```

4. 创建Destination 获取队列上的消息

```java
//如果消息队列没有名字为queue的队列，则会自动创建一个queue消息
//这里的参数名称对应上边生产者填写的参数一致
Queue queue = session.createQueue("queue");
Topic topic = session.createTopic("topic");
```

5. 创建消费者

```java
MessageConsumer consumer = session.createConsumer(queue);
MessageConsumer csm = session.createConsumer(topic);
```

6. 消费消息

> 当创建session的时候设置为手动签收的情况下，在消费完消息之后可以选择性的手动签收消息
>
> ```java
> msg.acknowledge();
> ```

```java
//此处的消息可以是其他的版本
//如MapMessage等·
Message message = consumer.receive();
if(message instanceof TextMessage){
    TextMessage msg = (TextMessage)message;
    System.out.println("消息是："+ msg.getText());
    //客户端手动签收消息
    //msg'.acknowledge();
}

```

==如果是Topic的话==

> 如果是topic 的话，就要创建一个消息监听器，来消费消息

```java
//普通版本
consumer.setMessageListener(new MessageListener() {
    @Override
    public void onMessage(Message message) {
		//todo
    }
});
//lambda表达式
consumer.setMessageListener(message -> {
    if(message instanceof MapMessage){
        MapMessage msg = (MapMessage) message;
        try {
            System.out.println(msg.getInt("id") + msg.getString("topic"));
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
});
```

7. 关闭连接

```java
consumer.close();
session.close();
connection.close();
```

## 3. Queue[点对点 p2p]

### 1. 创建消息生产者

```java
import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.*;

/**
 * @author eleven
 * @date 2021/9/12 15:22
 * @apiNote
 */
public class JmsProduce {
    /** activeMq连接地址*/
    private static final String ACTIVEMQ_URL = "tcp://127.0.0.1:61616";
    private static final String QUEUE_NAME = "test_queue";
    public static void main(String[] args) {
        // 1. 创建连接工厂
        ActiveMQConnectionFactory factory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        try {
            // 2. 创建连接并启动
            Connection connection = factory.createConnection();
            connection.start();
            /**
             *  3. 创建session 不开启事务，自动签收
             *  两个参数 第一个是否开启事务
             *  第二个签收参数
             */
            Session session = connection.createSession(false,Session.AUTO_ACKNOWLEDGE);
            // 4. 创建目的地 具体是 队列(Queue) 还是 主题 (Topic)
            Queue queue = session.createQueue(QUEUE_NAME);
            // 5. 创建消息生产者
            MessageProducer producer = session.createProducer(queue);
            // 6. 通过使用生产者发送消息
            for (int i = 0; i < 3; i++) {
                // 7. 创建消息
                TextMessage textMessage = session.createTextMessage("msg----" + i);
                // 8. 发送消息
                producer.send(textMessage);
            }
            // 9. 关闭资源
            producer.close();
            session.close();
            connection.close();
            System.out.println("****ActiveMq发送消息完成***");
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}

```

> 运行成功之后在前端管理页面即可看到刚才发送的消息

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-stQ7w93d-1631866082036)(D:\Study\笔记\Mq\img\activemq_queue.png)\]](https://img-blog.csdnimg.cn/6c899d6dc3f341d2a0ea50dfc7e376c1.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5piv6LW15pWi5pWi5ZWK,size_20,color_FFFFFF,t_70,g_se,x_16)


### 2. 创建消息消费者

```java
package com.eleven;

import cn.hutool.core.util.StrUtil;
import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.*;

/**
 * @author eleven
 * @date 2021/9/12 15:49
 * @apiNote
 */
public class JmsConsumer {
    /** activeMq连接地址*/
    private static final String ACTIVEMQ_URL = "tcp://127.0.0.1:61616";
    private static final String QUEUE_NAME = "test_queue";
    public static void main(String[] args) {
        // 1. 创建连接工厂
        ActiveMQConnectionFactory factory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        try {
            // 2. 创建连接并启动
            Connection connection = factory.createConnection();
            connection.start();
            /**
             *  3. 创建session 不开启事务，自动签收
             *  两个参数 第一个是否开启事务
             *  第二个签收参数
             */
            Session session = connection.createSession(false,Session.AUTO_ACKNOWLEDGE);
            // 4. 创建目的地 具体是 队列(Queue) 还是 主题 (Topic)
            Queue queue = session.createQueue(QUEUE_NAME);
            // 5. 创建消息消费者
            MessageConsumer consumer = session.createConsumer(queue);
            // 6. 通过使用生产者发送消息
            while (true){
                //生产者发送的什么消息类型，消费者就必须消费什么消息
                TextMessage textMessage = (TextMessage) consumer.receive(60);
                if(null != textMessage){
                    System.out.println("获得的消息是：" + textMessage.getText());
                }else{
                    break;
                }
            }
            // 7. 关闭资源
            consumer.close();
            session.close();
            connection.close();
            System.out.println("****ActiveMq消费消息完成***");
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}

```

> 运行之后再次查看 activeMq控制台，可以看到 test_queue的队列消息数量已经变成0了

## 4. Topic [发布/订阅]

**<font color=red>发布此类消息的时候必须要有一个消费者在线，否则是网页端是显示不了订阅消息的</font>**

### 1. 创建消息生产者

```java
package com.yanyuyu.topic;

import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.*;

public class TopicProducer {

    public static void main(String[] args) throws JMSException {
        // 1.创建ConnectionFactory
        ConnectionFactory factory =
                new ActiveMQConnectionFactory(null, null, "tcp://localhost:61616");
        // 2.创建Connection
        Connection connection = factory.createConnection();
        connection.start();

        // 3.创建session
        Session session = connection.createSession(false,Session.AUTO_ACKNOWLEDGE);

        // 4.创建队列
        Topic firstTopic = session.createTopic("firstTopic");
        // 5.创建消息
        MapMessage mapMessage = session.createMapMessage();
        mapMessage.setString("topic","firstTopic");
        mapMessage.setInt("id",1);

        // 6.创建生产者
        MessageProducer producer = session.createProducer(firstTopic);

        // 7.发送消息
        producer.send(mapMessage);

        // 8.关闭连接
        producer.close();
        session.close();
        connection.close();
    }
}
```

### 2. 创建消息消费者

```java
package com.yanyuyu.topic;

import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.*;

public class TopicConsumer {

    public static void main(String[] args) throws JMSException {
        //1.创建ConnectionFactory
        ConnectionFactory factory = new ActiveMQConnectionFactory(null, null, "tcp://localhost:61616");
        //2.创建connection 并调用start方法
        Connection connection = factory.createConnection();
        connection.start();
        //3.创建session
        Session session = connection.createSession(false, Session.CLIENT_ACKNOWLEDGE);
        //4.创建destination ，获得消息队列
        Topic firstTopic = session.createTopic("firstTopic");
        //5.创建消费者
        MessageConsumer consumer = session.createConsumer(firstTopic);

        //6.创建消息监听器
        consumer.setMessageListener(message -> {
            if(message instanceof MapMessage){
                MapMessage msg = (MapMessage) message;
                try {
                    System.out.println(msg.getInt("id") + msg.getString("topic"));
                } catch (JMSException e) {
                    e.printStackTrace();
                }
            }
        });

    }
}

```

## 5. selector选择器[也是queue]

### 1. 创建生产者

```java
import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.DeliveryMode;
import javax.jms.JMSException;
import javax.jms.MessageProducer;
import javax.jms.Queue;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnectionFactory;

public class SelectorProducer {
	public static void main(String[] args) throws JMSException {
		ConnectionFactory factory = new ActiveMQConnectionFactory(//
				null, null, "tcp://localhost:61616");
		Connection conn = factory.createConnection();
		conn.start();

		// 修改客户端消息签收方式为手动签收
		Session session = conn.createSession(false, Session.CLIENT_ACKNOWLEDGE);

		Queue queue = session.createQueue("selector");
		MessageProducer producer = session.createProducer(queue);
		// 设置消息持久化
		producer.setDeliveryMode(DeliveryMode.PERSISTENT);

		// 创建两条消息
		TextMessage msg = session.createTextMessage();
		msg.setText("趵突泉北路6号");

		// 设置选择器
		msg.setIntProperty("age", 11);
		msg.setStringProperty("name", "etoak");

		TextMessage msg2 = session.createTextMessage();
		msg2.setText("山大路数码港大厦");

		// 设置选择器
		msg2.setIntProperty("age", 2);
		msg2.setStringProperty("name", "etoak");

		producer.send(msg);
		producer.send(msg2);

		producer.close();
		session.close();
		conn.close();
		System.out.println("发送完成");

	}
}
```

### 2. 创建消费者

```java
import java.util.concurrent.TimeUnit;

import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageListener;
import javax.jms.Queue;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnectionFactory;

public class SelectorConsumer {
	public static void main(String[] args) throws JMSException {

		// 1. 创建ConnectionFactory
		ConnectionFactory factory = new ActiveMQConnectionFactory(//
				null, null, "tcp://localhost:61616");

		// 2. 创建Connection, 并且调用start()方法
		Connection connection = factory.createConnection();
		connection.start();

		// 3. 创建Session
		// 参数一：是否开启事务
		// 参数二：客户端签收消息的方式
		Session session = connection.createSession(false, //
				Session.CLIENT_ACKNOWLEDGE);

		// 4. 创建Destination, 是为了获取队列上的消息
		Queue helloQueue = session.createQueue("selector");

		// 5. 创建消费者
		MessageConsumer consumer = session.createConsumer(helloQueue, //
				"age = 11 and name = 'etoak' ");

		consumer.setMessageListener(message -> {

			if (message instanceof TextMessage) {
				TextMessage text = (TextMessage) message;
				try {
					System.out.println(text.getText().toString());
					
					// 手动签收消息，通知队列删除消息
					text.acknowledge();
				} catch (JMSException e) {
					e.printStackTrace();
				}
			}
		});

	}
}
```

## 6. messageListener

>  `receive()` 是同步阻塞方法，订阅者或者消费者调用`MessageConsumer`的 `receive()`方法接受消息时，`receive()`在能接收到消息之前或者是超时之前将一直阻塞

```java
package com.eleven;

import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.*;

/**
 * @author eleven
 * @date 2021/9/12 16:45
 * @apiNote
 */
public class JmsMessageListener {
    /** activeMq连接地址*/
    private static final String ACTIVEMQ_URL = "tcp://127.0.0.1:61616";
    private static final String QUEUE_NAME = "test_queue";
    public static void main(String[] args) {
        // 1. 创建连接工厂
        ActiveMQConnectionFactory factory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        try {
            // 2. 创建连接并启动
            Connection connection = factory.createConnection();
            connection.start();
            /**
             *  3. 创建session 不开启事务，自动签收
             *  两个参数 第一个是否开启事务
             *  第二个签收参数
             */
            Session session = connection.createSession(false,Session.AUTO_ACKNOWLEDGE);
            // 4. 创建目的地 具体是 队列(Queue) 还是 主题 (Topic)
            Queue queue = session.createQueue(QUEUE_NAME);
            // 5. 创建消息消费者
            MessageConsumer consumer = session.createConsumer(queue);
            consumer.setMessageListener(new MessageListener() {
                @Override
                public void onMessage(Message message) {
                    if(null != message && message instanceof  TextMessage){
                        TextMessage textMessage = (TextMessage) message;
                        try {
                            System.out.println("messageListener接受到的消息"  + textMessage.getText());
                        } catch (JMSException e) {
                            e.printStackTrace();
                        }
                    }
                }
            });

            System.out.println("****ActiveMq消费消息完成***");
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}

```

- 上边的匿名内部类可以替换成为下边这种形式

```java
consumer.setMessageListener(message -> {
    if(null != message && message instanceof  TextMessage){
        TextMessage textMessage = (TextMessage) message;
        try {
            System.out.println("messageListener接受到的消息"  + textMessage.getText());
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
});
```

## 7. 多个消费者时启动顺序

> 假设现在有一个生产者发送了六条消息，有1号和2号两个消费者

- 情况一：先生产消息，只启动一号消费者，

  一号肯定是可以消费到消息的

- 情况二：先生产消息，依次启动消费者，

  一号可以消费消息，二号消费不到

- 情况三：先启动消费者，在启动生产者

  消费者按照轮询规则来消费消息

## 8. Topic 和 Queue对比

| 比较对象   | Topic                                                        | Queue                                                        |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 工作模式   | `订阅-发布`模式，如果当前没有订阅者， 消息将会被丢弃，如果有多个订阅者，那么这些订阅者都会受到消息，类似于群聊 | `负载聚恒`模式，如果当前没有消费者，消息也不会呗丢弃，如果有多个消费者的话，那么一条消息只能发送给其中一个消费者，并且会要求消费者ack信息 |
| 有无状态   | 无状态                                                       | Queue数据默认会在mq服务器上以文件形式保存，ActiveMq一般保存在`$AMQ_HOME\data\kr-store\data`下面，也可以配置成db存储 |
| 传递完整性 | 如果没有订阅者，消息会被丢弃                                 | 消息不会被丢弃                                               |
| 处理效率   | 由于消息要按照订阅者的数量进行复制，所以处理性能会随着订阅者的增加而明显降低，并且还要结合不同消息协议自身的性能差异 | 由于一条消息指挥发送给一个消费者，所以就算消费者很多，性能也不会有哦明显的降低，当然不同消息协议的具体性能有些许的差异 |

# 5. JMS message

> message 主要包含 `消息头`、`消息体`、`消息属性`

## 1. 消息头

### 1.JMSDestination

> 消息发送的目的地，主要指的是`Queue` 和 `Topic`
>
> 针对某一条特定的消息也可以设置响应的目的地
>
> ```java
> TextMessage msg = session.createTextMessage("msg");
> msg.setJMSDestination();
> ```

### 2. JMSDeliveryMode

> 持久或非持久模式
>
> 一条持久性的消息:应该被传送“一次仅仅一次”，这就意味者如果JMS提供者出现故障，该消息并不会丢失，它会在服务器恢复之后再次传递。
>
> 一条非持久的消息:最多会传送一次，这意味这服务器出现故障，该消息将永远丢失。
>
> ```java
> TextMessage msg = session.createTextMessage("msg");
> //有两个可选的值 DeliveryMode.NON_PERSISTENT 非持久 和 DeliveryMode.PERSISTENT 持久
> msg.setJMSDeliveryMode();
> ```
>
>

### 3. JMSExpiration

> 消息的过期时间,
>
> 可以设置消息在一定时间后过期，<font color=red>默认永不过期</font>
>
> 等同于在`Destination中的send`方法中的`timeToLive`值上机上发送时刻的GMT时间值
>
> 如果timeToLive值等于零，则JMSExpiration被设为零，表示该消息永不过期。
>
> 如果发送后，在消息过期时间之后消息还没有被发送到目的地，则该消息被清除

### 4. JMSPriority

> 消息优先级
>
> 从0-9是各级别 0-4普通消息 5-9加急消息，默认为4
>
> <font color=red>JMS不要求MQ严格按照这是个优先级发送消息但是必须保证加急消息比普通消息先到达</font>

### 5. JMSMessageID:warning:**<font color=red>重要</font>**

> 唯一识别每个消息的标识，由MQ产生

## 2. 消息体

> 负责封装具体的消息数据，<font color=red>发送和接受的消息体类型必须一致对应</font>

### 1. <font color=red>TextMessage:warning:</font>

> 普通字符串消息，包含一个String

### 2. <font color=red>MapMessage:warning:</font>

> 一个Map类型的消息，key为String类型 值为Java的基本类型
>
> 有setString setInt等一堆包装类的方法

```java
MapMessage mapMessage = session.createMapMessage();
mapMessage.setString("k",v);
```

### 3. BytesMessage

> 二进制数组消息，包含一个byte[]

### 4. StreamMessage

> java数据流消息，用标准流操作来顺序的填充和读取

### 5. ObjectMessage

> 对象消息，包含一个可序列化的java对象

## 3. 消息属性

> 如果有需要除了消息头字段以外的值，就可以使用消息属性
>
> 识别、去重、重点标注等常用方法
>
> 他们是以属性名和属性值对的形式制定的。可以将属性是为消息头得扩、，属性指定一些消息头没有包括的附加信息，比如可以在属性里指定消息选择器。
>
> 消息的属性就像可以分配给一条消息的附加消息头一样。它们允许开发者添加有关消息的不透明附加信息。它们还用于暴露消息选择器在消息过滤时使用的数据。

```java
TextMessage textMessage = session.createTextMessage();
textMessage.setText("text");
textMessage.setStringProperty("isVip","true");
```

# 6.  JMS 的可靠性

## 1. PERSISTENT 持久性

### 1. Queue

> - 非持久化，当前服务器宕机消息不存在
    >
    >   ```java
>   messageProducer.setDeliveryMode(DeliveryMode.NON_PERSISTENT)
>   ```
>
> - 持久化，当前服务宕机消息依然存在
    >
    >   ```java
>   messageProducer.setDeliveryMode(DeliveryMode.PERSISTENT)
>   ```
    >
    >   <font color=red>这是队列的默认传递模式</font>，可以保证这些消息只被传递一次，对于这些消息，可靠性是优先考虑的因素
    >
    >   可靠性的另一个重要方面是确保持久性消息传送至目标后，消息服务在向消费者传送它们之前不会丢失这些消息。

### 2. Topic

> <font color=red>应该先启动订阅者在启动生产者</font>

- 创建持久化的topic生产者

```java
package com.eleven;

import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.*;

/**
 * @author eleven
 * @date 2021/9/13 14:46
 * @apiNote
 */
public class JmsTopicProduce {
    /** activeMq连接地址*/
    private static final String ACTIVEMQ_URL = "tcp://127.0.0.1:61616";
    private static final String TOPIC_NAME = "test_topic";
    public static void main(String[] args) {
        // 1. 创建连接工厂
        ActiveMQConnectionFactory factory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        try {
            // 2. 创建连接
            Connection connection = factory.createConnection();
            /**
             *  3. 创建session 不开启事务，自动签收
             *  两个参数 第一个是否开启事务
             *  第二个签收参数
             */
            Session session = connection.createSession(false,Session.AUTO_ACKNOWLEDGE);
            // 4. 创建目的地 具体是 队列(Queue) 还是 主题 (Topic)
            Topic topic = session.createTopic(TOPIC_NAME);
            // 5. 创建消息生产者
            MessageProducer producer = session.createProducer(topic);
            producer.setDeliveryMode(DeliveryMode.PERSISTENT);
            // 6.将连接放在后边
            connection.start();
            // 7. 通过使用生产者发送消息
            for (int i = 0; i < 3; i++) {
                // 8. 创建消息
                TextMessage textMessage = session.createTextMessage("msg----" + i);
                // 9. 发送消息
                producer.send(textMessage);
                textMessage.setBooleanProperty("isVip", i == 2);
                MapMessage mapMessage = session.createMapMessage();
            }
            // 10. 关闭资源
            producer.close();
            session.close();
            connection.close();
            System.out.println("****ActiveMq发送消息完成***");
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}

```

- 创建持久化的topic消费者

```java
package com.eleven;

import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.*;

/**
 * @author eleven
 * @date 2021/9/13 14:50
 * @apiNote
 */
public class JmsTopicConsumer {
    /** activeMq连接地址*/
    private static final String ACTIVEMQ_URL = "tcp://127.0.0.1:61616";
    private static final String TOPIC_NAME = "test_topic";
    public static void main(String[] args) {
        System.out.println("********消费者1");
        // 1. 创建连接工厂
        ActiveMQConnectionFactory factory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        try {
            // 2. 创建连接
            Connection connection = factory.createConnection();
            connection.setClientID("consumer1");
            /**
             *  3. 创建session 不开启事务，自动签收
             *  两个参数 第一个是否开启事务
             *  第二个签收参数
             */
            Session session = connection.createSession(false,Session.AUTO_ACKNOWLEDGE);
            // 4. 创建目的地 具体是 队列(Queue) 还是 主题 (Topic)
            Topic topic = session.createTopic(TOPIC_NAME);
            TopicSubscriber topicSubscriber = session.createDurableSubscriber(topic,"zs");
            connection.start();
            Message message = topicSubscriber.receive();
            while (null != message){
                TextMessage msg = (TextMessage)message;
                System.out.println("消费者接收到的消息:" + msg.getText());
                //不设置时间的话就一直等待
                message = topicSubscriber.receive();
            }
            session.close();
            connection.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```

## 2. 事务

> 事务偏生产者，签收偏消费者。
>
> 事务如果设置为false,直接send就会被发送到队列列
>
> 如果是ture则需要`send`然后在`session.close()`之前使用`session.commit()`提交
>
> ```java
> MessageProducer producer = session.createProducer(queue);
> TextMessage msg = session.createTextMessage("test");
> producer.send(msg);
> producer.close();
> //提交事务
> session.commit();
> session.close();
> ```

**<font color=red>Queue模式下如果开启了事务，但是没有执行`session.commit()`,会导致消费者获取到了消息，但是消费掉消息(重复消费)。切忌切忌！！！</font>**

## 3. Acknowledge 签收

- Session.AUTO_ACKNOWLEDGE 自动签收
- Session.CLIENT_ACKNOWLEDGE 手动签收，需要调用acknowledge方法手动签收

# 7. 小结

## 1. 点对点

> 点对点模型是基于队列的，生产者发消息到队列，消费者从队列接收消息，队列的存在使得消息的异步传输成为可能。和我们平时给朋友发送短信类似。
>
> 如果在Session关闭时有部分消息已被收到但还没有被签收(acknowledged)，那当消费者下次连接到相同的队列时，这些消息还会被再次接收
>
> 队列可以长久地保存消息直到消费者收到消息。消费者不需要因为担心消息会丢失而时刻和队列保持激活的连接状态，充分体现了异步传输模式的优势

## 2 订阅发布

> JMS PublSub模型定义了如何向一个内容节点发布和订阅消息，这些节点被称作topic
> 主题可以被认为是消息的传输中介，发布者(publisher)发布消息到主题，订阅者(subscribe)从主题订阅消息。主题使得消息订阅者和消息发布者保持互相独立，不需要接触即可保证消息的传送。

### 1. 非持久订阅

> 非持久订阅只有当客户端处于激活状态，也就是和MQ保持连接状态才能收到发送到某个主题的消息。
> 如果消费者处于离线状态，生产者发送的主题消息将会丢失作废，消费者永远不会收到。
>
> 一句话:先要订阅注册才能接受到发布，只给订阅者发布消息。

### 2. 持久订阅

> 客户端首先向MQ注册一个自己的身份ID识别号，当这个客户端处于离线时，生产者会为这个ID保存所有发送到主题的消息，当客户再次连接到MQ时会根据消费者的ID得到所有当自己处于离线时发送到主题的消息。
>
> 非持久订阅状态下，不能恢复或重新派送一个未签收的消息。持久订阅才能恢复或重新派送一个未签收的消息。

**<font color=red>当消息必须被接收就用持久订阅，允许丢失消息就用非持久订阅</font>**

# 8. ActiveMq的Broker

> 相当于一个ActiveMq的实例，实现了用代码的形式启动ActiveMq将Mq嵌入到java代码中，以便随时可以启动保证了可靠性。

## 1. 不同conf文件启动

- windows下复制一个`bin/activemq.xml`

  ```shell
  cd E:\mq\active\activemq-5.16.3\bin
  E:
  activqmq.bat start xbean:file:../conf/activemq01.xml
  ```



- linux执行

  ```shell
  #进入配置文件目录
  cd /opt/apache-activemq-5.16.3/conf
  # 复制
  cp activemq.xml activemq01.xml
  # 启动
  cd ../bin
  ./activqmq start xbean:file:../conf/activemq01.xml
  ```


## 2. Broker启动ActiveMq

> 解决一个broker的错误 `Caused by:java.lang.ClassNotFoundException:com.fasterxml.jackson.databind.ObjectMapper`

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

- Broker代码(启动成功之后可以使用`jps -l` 在控制台查看进程)

```java
package com.eleven.embed;

import org.apache.activemq.broker.BrokerService;

/**
 * @author eleven
 * @date 2021/9/15 8:08
 * @apiNote 嵌入式mq
 */
public class EmbedBroker {
    public static void main(String[] args) {
        // ActiveMq 也支持在vm中通信基于嵌入式的broker
        BrokerService brokerService = new BrokerService();
        brokerService.setUseJmx(true);
        try {
            brokerService.addConnector("tcp://localhost:61616");
            brokerService.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```

> 启动成功之后就可以看到下边的这些信息，可以测试消费者和生产者是否可用

```shell
 INFO | Using Persistence Adapter: KahaDBPersistenceAdapter[D:\javacode\mq\activemq\activemq_java\activemq-data\localhost\KahaDB]
 INFO | JMX consoles can connect to service:jmx:rmi:///jndi/rmi://localhost:1099/jmxrmi
 INFO | PListStore:[D:\javacode\mq\activemq\activemq_java\activemq-data\localhost\tmp_storage] started
 INFO | Apache ActiveMQ 5.15.9 (localhost, ID:eleven-23092-1631664748174-0:1) is starting
 INFO | Listening for connections at: tcp://127.0.0.1:61616
 INFO | Connector tcp://127.0.0.1:61616 started
 INFO | Apache ActiveMQ 5.15.9 (localhost, ID:eleven-23092-1631664748174-0:1) started
 INFO | For help or more information please see: http://activemq.apache.org
```

# 9. Spring整合ActiveMq

## 1. 新建maven工程

- 创建pom.xml并添加相关依赖

```xml
<dependencies>
    <!-- activemq核心依赖包 必须 -->
    <dependency>
        <groupId>org.apache.activemq</groupId>
        <artifactId>activemq-all</artifactId>
        <version>5.10.0</version>
    </dependency>
    <!--  嵌入式activemq的broker所需要的依赖包   -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.10.1</version>
    </dependency>
    <!-- activemq连接池 必须 -->
    <dependency>
        <groupId>org.apache.activemq</groupId>
        <artifactId>activemq-pool</artifactId>
        <version>5.15.10</version>
    </dependency>
    <!-- spring支持jms的包 必须-->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jms</artifactId>
        <version>5.2.1.RELEASE</version>
    </dependency>
    <!--spring相关依赖包-->
    <dependency>
        <groupId>org.apache.xbean</groupId>
        <artifactId>xbean-spring</artifactId>
        <version>4.15</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-aop</artifactId>
        <version>5.2.1.RELEASE</version>
    </dependency>
    <!-- Spring核心依赖 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-core</artifactId>
        <version>4.3.23.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>4.3.23.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-aop</artifactId>
        <version>4.3.23.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-orm</artifactId>
        <version>4.3.23.RELEASE</version>
    </dependency>
</dependencies>
```

- 创建`spring-activemq.xml`配置文件，放在 `resources`下即可

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">

    <!--  开启包的自动扫描  -->
    <context:component-scan base-package="com.activemq.demo"/>
    <!--  配置生产者  -->
    <bean id="connectionFactory" class="org.apache.activemq.pool.PooledConnectionFactory" destroy-method="stop">
        <property name="connectionFactory">
            <!--      正真可以生产Connection的ConnectionFactory,由对应的JMS服务商提供      -->
            <bean class="org.apache.activemq.spring.ActiveMQConnectionFactory">
                <property name="brokerURL" value="tcp://192.168.10.130:61616"/>
            </bean>
        </property>
        <property name="maxConnections" value="100"/>
    </bean>

    <!--  这个是队列目的地,点对点的Queue  -->
    <bean id="destinationQueue" class="org.apache.activemq.command.ActiveMQQueue">
        <!--    通过构造注入Queue名    -->
        <constructor-arg index="0" value="spring-active-queue"/>
    </bean>

    <!--  这个是队列目的地,  发布订阅的主题Topic-->
    <bean id="destinationTopic" class="org.apache.activemq.command.ActiveMQTopic">
        <constructor-arg index="0" value="spring-active-topic"/>
    </bean>

    <!--  Spring提供的JMS工具类,他可以进行消息发送,接收等  -->
    <bean id="jmsTemplate" class="org.springframework.jms.core.JmsTemplate">
        <!--    传入连接工厂    -->
        <property name="connectionFactory" ref="connectionFactory"/>
        <!--    传入目的地    -->
        <property name="defaultDestination" ref="destinationQueue"/>
        <!--    消息自动转换器    -->
        <property name="messageConverter">
            <bean class="org.springframework.jms.support.converter.SimpleMessageConverter"/>
        </property>
    </bean>
</beans>
```

## 2. Queue

### 1. 创建生产者

```java
package com.eleven.queue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

/**
 * @author eleven
 * @date 2021/9/15 14:25
 * @apiNote
 */
@Service
public class SpringQueueProducer {
    @Autowired
    private JmsTemplate jmsTemplate;

    public static void main(String[] args) {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");
        SpringQueueProducer producer = ctx.getBean(SpringQueueProducer.class);
        producer.jmsTemplate.send(session -> session.createTextMessage("spring整合activeMq发送的数据。。。"));
        System.out.println("*********ActiveMq消息生产成功");
    }
}

```

### 2. 创建消费者

```java
package com.eleven.queue;

import org.apache.xbean.spring.context.ClassPathXmlApplicationContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

/**
 * @author eleven
 * @date 2021/9/15 14:25
 * @apiNote
 */
@Service
public class SpringQueueConsumer {

    @Autowired
    private JmsTemplate jmsTemplate;

    public static void main(String[] args) {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");
        SpringQueueConsumer consumer = ctx.getBean(SpringQueueConsumer.class);
        String msg = String.valueOf(consumer.jmsTemplate.receiveAndConvert());
        System.out.println("消费者接收到的消息为：" + msg);
    }

}

```

## 3. Topic

> 修改`xml`配置文件，先启动消费者后启动生产者即可

```xml
<bean id="jmsTemplate" class="org.springframework.jms.core.JmsTemplate">
    <property name="connectionFactory" ref="connectionFactory"/>
    <!--    传入目的地  此处修改为 topic的id即可  -->
    <property name="defaultDestination" ref="destinationTopic"/>
    <property name="messageConverter">
        <bean class="org.springframework.jms.support.converter.SimpleMessageConverter"/>
    </property>
</bean>
```

## 4. 不启动消费者监听订阅

> 修改 xml 配置文件，新增内容

```java
<bean id="jmsContainer" class="org.springframework.jms.listener.DefaultMessageListenerContainer">
    <property name="connectionFactory" ref="jmsFactory" />
    <property name="destination" ref="destinationQueue" />
    <property name="messageListener" ref="myMessageListener" />
</bean>
```

> 新增消息监听类

```java
package com.eleven.listener;

import org.springframework.stereotype.Component;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;

/**
 * @author eleven
 * @date 2021/9/15 15:08
 * @apiNote
 */
@Component
public class MyMessageListener implements MessageListener {
    @Override
    public void onMessage(Message message) {
        if(message != null){
            if(message instanceof TextMessage){
                TextMessage msg = (TextMessage)message;
                try {
                    String text = msg.getText();
                } catch (JMSException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

```

==只需要启动生产者就行了==

# 10. SpringBoot 整合ActiveMq

## 1. 创建maven工程

> `pom.xml` 添加相关的依赖

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
</properties>
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.1.5.RELEASE</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
    <!--spring boot整合activemq的jar包-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-activemq</artifactId>
        <version>2.1.5.RELEASE</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

> 创建配置文件 `application.yml`

```yaml
server:
  port: 9527
spring:
  activemq:
    # activeMq 地址
    broker-url: tcp://localhost:61616
    # 在 conf/users.properties 里边可以修改
    user: admin
    password: admin
  jms:
    # false为Queue模式 true为Topic模式 默认为false
    pub-sub-domain: false
# 自定义队列名称
myQueue: boot-activemq-queue
# 自定义主题名称
myTopic: boot-activemq-topic
```

> 创建配置类

```java
package com.eleven.config;

import org.apache.activemq.command.ActiveMQQueue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.annotation.EnableJms;

import javax.jms.Queue;


/**
 * @author eleven
 * @date 2021/9/15 15:31
 * @apiNote
 */
@Configuration
@EnableJms
public class BeanConfiguration {

    @Value("${myQueue}")
    private String queue;

    @Bean
    public Queue queue(){
        return new ActiveMQQueue(queue);
    }

}
```

> 启动类

```java
package com.eleven;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * @author eleven
 * @date 2021/9/15 15:38
 * @apiNote
 */
@SpringBootApplication
@EnableScheduling
public class MainApp {
    public static void main(String[] args) {
        SpringApplication.run(MainApp.class, args);
    }
}
```

## 2. Queue

### 1. 创建生产者

```java
package com.eleven.producer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsMessagingTemplate;
import org.springframework.stereotype.Component;

import javax.jms.Queue;

/**
 * @author eleven
 * @date 2021/9/15 15:36
 * @apiNote
 */
@Component
public class QueueProducer {

    @Autowired
    private JmsMessagingTemplate template;

    @Autowired
    private Queue queue;

    public void produceMessage(String msg){
        template.convertAndSend(queue, msg);
    }
    
    @Scheduled(fixedDelay = 3000)
    public void produceMessageScheduled(){
        template.convertAndSend(queue, "Scheduled:定时投送" + UUID.randomUUID().toString());
        System.out.println("定时投送成功");
    }
}

```

> 在`test`文件夹创建单元测试

```java
package com.eleven.test;

import com.eleven.MainApp;
import com.eleven.producer.QueueProducer;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;

/**
 * @author eleven
 * @date 2021/9/15 15:41
 * @apiNote
 */
@WebAppConfiguration
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MainApp.class)
public class TestActiveMq {
    @Autowired
    private QueueProducer queueProducer;

    @Test
    public void testSendQueue(){
        queueProducer.produceMessage("***SpringBoot整合ActiveMq***");
    }
}
```

### 2. 创建消费者

```java
package com.eleven.consumer;

import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import javax.jms.JMSException;
import javax.jms.TextMessage;

/**
 * @author eleven
 * @date 2021/9/15 16:05
 * @apiNote
 */
@Component
public class QueueConsumer {

    @JmsListener(destination = "${myQueue}")
    public void receive(TextMessage message) throws JMSException {
        System.out.println("消费者消费到的消息:" + message.getText());
    }
}

```

## 3. Topic

### 1. 修改配置

> 修改配置文件

```yaml
server:
  port: 9527
spring:
  activemq:
    # activeMq 地址
    broker-url: tcp://localhost:61616
    # 在 conf/users.properties 里边可以修改
    user: admin
    password: admin
  jms:
    # false为Queue模式 true为Topic模式 默认为false
    pub-sub-domain: true
# 自定义主题名称
myTopic: boot-activemq-topic
```

> 修改`Config`

```java
package com.eleven.config;

import org.apache.activemq.command.ActiveMQTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.annotation.EnableJms;

import javax.jms.Topic;


/**
 * @author eleven
 * @date 2021/9/15 15:31
 * @apiNote
 */
@Configuration
@EnableJms
public class BeanConfiguration {
    @Value("${myTopic}")
    private String topicName;

    @Bean
    public Topic topic(){
        return new ActiveMQTopic(topicName);
    }

}

```

### 2. 创建生产者

```java
package com.eleven.producer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsMessagingTemplate;
import org.springframework.stereotype.Component;

import javax.jms.Topic;

/**
 * @author eleven
 * @date 2021/9/15 16:33
 * @apiNote
 */
@Component
public class TopicProducer {
    @Autowired
    private JmsMessagingTemplate template;
    @Autowired
    private Topic topic;

    public void produceTopic(String msg){
        template.convertAndSend(topic,msg);
    }
}

```

### 3. 创建消费者

```java
package com.eleven.consumer;

import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import javax.jms.JMSException;
import javax.jms.TextMessage;

/**
 * @author eleven
 * @date 2021/9/15 16:38
 * @apiNote
 */
@Component
public class TopicConsumer {

    @JmsListener(destination = "${myTopic}")
    public void receive(TextMessage message) throws JMSException{
        System.out.println("消费者收到的订阅消息：" + message.getText());
    }
}

```

# 11. ActiveMq传输协议

> ActiveMq支持的 client-broker 通讯协议有 **TCP NIO UDP SSL HTTP(S) VM**,在安装目录的`conf/activemq.xml`中的`<transportConnectors>`标签中

## 1. TCP :warning:

1. <font color=red>这个是默认的Broker配置，TCP的client监听端口是61616</font>
2. 在网络传输数据时，必须要序列化数据，消息是通过一个叫wire protocol的来序列化成<font color=blue>字节流</font>。默认情况下ActiveMQ把wire protocol叫做OpenWire,它的目的是促使网络上的效率和数据快速交互。
3. TCP连接的URI形式如`tcp://hostname.:port?key=value&key=value`,后面的参数是可选
4. TCP传输的优点:

    - TCP协议传输可靠性高，稳定性强

    - 高效性:字节流方式传递，效率很高

    - 有效性、可用性:应用广泛，支持任何平台
5. 关于Transport协议的可配置参数可以参考[官网](http:lactivemq.apache.org/configuring-version-5-transports.html)

## 2. NIO:warning:

1. NlIO协议和TCP协议类似但NlIO更侧重于底层的访问操作。它允许开发人员对同一资源可有更多的client调用和服务端有更多的负载。
2. 适合使用NIO协议的场景:
    - 可能有大量的Client去连接到Broker 上，一般情况下，大量的Client去连接Broker是被操作系统的线程所限制的。因此，
      NIO的实现比TCP需要更少的线程去运行，所以建议使用NIO协议
    - 可能对于Broker有一个很迟钝的网络传输，NIO比TCP提供更好的性能。
3. NIO连接的URI形式:`nio//hostname:port?key=value`
4. Transport Connector配置示例，参考[官网](http:/lactivemq.apache.org/configuring-version-5-transports.html)

## 3. 其他不重要的协议

1. AMQP

> 即Advanced Message Queuing Protocol,一个提供统一消息服务的应用层标准高级消息队列协议,是应用层协议的一个开放标准为面向消息的中间件设计。基于此协议的客户端与消息中间件可传递消息，并不受客户端/中间件不同产品，不同开发语言等条件的限制。

2. STOMP

> STOMP，`Streaming Text Orientated Message Protocol`，是流文本定向消息协议，是一种为`MOM(Message Oriented Middleware)`，面向消息的中间件)设计的简单文本协议。

3. MQTT

> MOTT (Message Queuing Telemetry Transport，消息队列遥测传输）是IBM开发的一个即时通讯协议，有可能成为物联网的重要组成部分。该协议支持所有平台，几乎可以把所有联网物品和外部连接起来，被用来当做传感器和驱动器（比如通过Twitteri让:房屋联网）的通信协议。

## 4. NIO案例

```shell
# 查询activemq
whereis activemq
# 进入安装目录
cd /opt/apache-activemq-5.16.3/
# 进入bin目录杀掉进程并且返回当前目录 或者用 ps -ef|grep activemq|grep -v grep 然后 kill -9 [pid]
cd bin && ./activemq stop && cd -
# 备份一个配置文件
cd conf 
cp activemq.xml activemq_bak.xml 
# 编辑配置文件 按i/I/a进入编辑模式 :set nu 可以显示行号
vim activemq.xml
# 搜索 transport 使用? 或者 /
?transport
# 添加下列内容 shift insert 粘贴 或者使用yyp复制其中一行进行修改
<transportConnector name="nio" uri="nio://0.0.0.0:61618?trace=true" />
# 如果不指定网络监听端口的话，name这些端口都想使用BIO模型，提高单节点网络吞吐性能是，需要明确指定IO模型
#保存退出
:wq!
# 重新启动
cd ../bin && ./activemq start
```

访问[http://localhost:8161/admin/connections.jsp](http://localhost:8161/admin/connections.jsp)看看是否出现了nio协议

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-TRI7T2Ow-1631866082040)(D:\Study\笔记\Mq\img\activemq_nio.png)\]](https://img-blog.csdnimg.cn/46b6465d71e8452ea4164435a0d3789b.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5piv6LW15pWi5pWi5ZWK,size_20,color_FFFFFF,t_70,g_se,x_16)


> 修改代码中Mq的连接地址为 `nio://localhost:61618`

## 5. 优化NIO

```shell
# 关闭activemq修改配置文件
cd /opt/apache-activemq-5.16.3/bin
./activemq stop
cd ../conf
vim activemq.xml
/transport
# 添加下列内容并保存退出
```

```xml
<transportConnector name="auto+nio" uri="auto+nio://0.0.0.0:61608?maximumConnections=1000&amp;wireFormat.maxFrameSize=104857600&amp;org.apache.activemq.transport.nio.SelectorManager.corePoolSize=20&amp;org.apache.activemq.transport.nio.Se1ectorManager.maximumPoo1Size=50"/>
```

```shell
cd ../bin && ./activemq start
```

> 修改生产者 mq连接地址为 `nio://localhost:61608`

# 12. ActiveMq消息存储与持久化

## 1. AMQ[不重要]

> AMQ是一种文件存储形式，它具有写入速度快和容易恢复的特点。消息存储在一个个文件中，文件的默认大小为32M，当一个存储文件中的消息已经全部被消费，那么这个文件将被标识为可删除，在下一个清除阶段，这个文件被删除。<font color=red>AMQ适用于ActiveMQ5.3之前的版本</font>

## 2. KahaDB

> 基于日志文件，<font color=red>从 ActiveMQ5.4开始默认的持久化插件</font>

```shell
# 查询activemq默认存储策略
whereis activemq
cd /opt/apache-activemq-5.6.13/conf
vim activemq.xml
?kaha
```

```xml
<!--
    Configure message persistence for the broker. The default persistence
    mechanism is the KahaDB store (identified by the kahaDB tag).
    For more information, see:
    http://activemq.apache.org/persistence.html
-->
<persistenceAdapter>
    <kahaDB directory="${activemq.data}/kahadb"/>
</persistenceAdapter>
```

## 3. LevelDB

> 这种文件系统是从ActiveMQ5.8之后引进的，它和KahaDB非常相似，也是基于文件的本地数据库储存形式，但是它提供比KahaDB更快的持队性。
>
> 但它不使用自定义B-Tree实现来索引预写日志，而是使用基于LeveIDB的索引

```xml
<persistenceAdapter>
	<levelDBdirectory = "activemq-data" />
</persistenceAdapter>
```

## 3. JDBC 持久化

### 1. activeMq配置

- 需要将mysql的驱动包拷贝到`activemq/lib`下

```shell
scp mysql-connector-java-8.0.26.jar root@192.168.153.130:/opt/apache-activemq-5.16.3/lib
```

- 配置JDBC存储

```shell
vim /opt/apache-activemq-5.16.3/conf/activemq/xml
?kahaDB
```

- 添加下列内容

```xml
<persistenceAdapter>
    <!--
		createTablesOnStartup默认为true,启动时创建数据库，第一次启动为true后续设置为false就可以了
	-->
	<jdbcPersistenceAdapter dataSource="#mysql-ds"createTablesOnStartup="true"/>
</persistenceAdapter>

<!--bean 需要配置在 <broker> 和 <import> 标签之间-->
<bean id="mysql-ds" class="org.apache.commons.dbcp2.BasicDataSource" destroy-method="close">
	<property name="driverClassName" value="com.mysql.jdbc.Driver" />
	<property name="url" 
              value="jdbc:mysql://自己的数据库IP:3306/activemq?relaxAutoCommit=true&serverTimezone=UTC"/>		
    <property name="username" value="自己的数据库用户名"/>
	<property name="password" value="自己的数据库密码"/>
	<property name="maxTotal" value="200" />
	<property name="poolPreparedStatements" value="true" />
</bean>
```

- 创建activemq数据库

```shell
mysql -u root -p
create database activemq;
use activemq;
# 创建完成之后再次启动会自动创建三张表
show tables;
activemq_msgs activemq_lock activemq_acks
```

### 2. 代码验证

>  **<font color=red>一定要开始持久化</font>**
>
>  ```java
>  messageProducer.setDeliveryMode(DeliveryMode.PERSISTENT)
>  ```
>
>  ==如果是springboot的话可以修改配置文件==
>
>  ```yaml
>  spring:
>  jms:
>  	template:
>  	  # 消息持久化	
>  	  delivery-mode: persistent
>  ```
>
>  执行生产者之后即可在`activemq_msgs`中查看到数据
>
>  消费者消费之后`activemq_msgs`中就没有数据了

### 3. 小总结

> - <font color=blue>Queue</font>：在没有消费者消费的情况下会将消息保存到`activemq_msgs`表中，只要有任意一个消费者已经消费过了，消费之后这些消息将会立即被删除。
>
> - <font color=blue>Topic</font>：一般是先启动消费订阅然后再生产的情况下会将消息保存到`activemq_acks`。

## 4.  JDBC & Journal

> JDBC 频繁的读取数据库可能会导致性能变慢，使用`Apache journal`可以克服JDBC的不足。当消费者的消费速度能够及时跟上生产者消息的生产速度时，`journal`文件能够大大减少需要写入到DB中的消息。
>
> **<font color=blue>举个栗子</font>**
>
> 生产者生产了1000条消息，这1000条消息会保存到journal文件，如果消费者的消费速度很快的情况下，在journal文件还没有同步到DB之前，消费者已经消费了90%的以上的消息，那么这个时候只需要同步剩余的10%的消息到DB。
>
> 如果消费者的消费速度很慢，这个时候journal文件可以使消息以批量方式写到DB。

```xml
<!--将<persistenceAdapter>都注释掉并替换成下列内容-->
<persistenceFactory>
    <journalPersistenceAdapterFactory
        journalLogFiles="4"
        journalLogFileSize="32768"
        useJournal="true"
        useQuickJournal="true"
        dataSource="#mysql-ds"
        dataDirectory="activemq-data" />
</persistenceFactory>
```

## 5. 总结

> <font color=blue>持久化消息指的是：</font>MQ服务器当机了消息不会丢失
>
> jdbc效率低，kahaDB效率高，jdbc+Journal效率较高。
>
> <font color=blue>持久化机制演变的过程:</font>从最初的AMQ Message Store方案到ActiveMQ V4版本退出的High Performance Journal（高性能事务支持）附件，并且同步推出了关于关系型数据库的存储方案。ActiveMQ5.3版本又推出了对KahaDB的支持（5.4版本后被作为默认的持久化方案），后来ActiveMQ 5.8版本开始支持LevelDB，到现在5.9提供了标准的Zookeeper+LevelDB集群化方案。

| AMQ                      | 基于日志文件                                                 |
| ------------------------ | ------------------------------------------------------------ |
| KahaDB                   | 基于日志文件，从ActiveMQ5.4开始默认使用                      |
| JDBC                     | 基于第三方数据库                                             |
| Replicated LevelDB Store | 从5.9开始提供了LevelDB和Zookeeper的数据复制方法，用于Master-slave方式的首选数据复制方案。 |

# 13. ActiveMq 集群

> 基于 Zookeeper 和 LevelDB 搭建 ActiveMq集群，集群仅提供主备方式的高可用集群功能，避免单点故障
>
> - 基于sharedFileSystem共享文件系统 + KahaDB
> - 基于JDBC
> - 基于可复制的LevelDB

## 1. 使用Zookeeper & LevelDB

> 使用Zookeeper集群注册所有的ActiveMQ Broker但只有其中的一个Broker可以提供服务它将被视为Master，其他的Broker处于待机状态被视为Slave。
>
> 如果Master因故障而不能提供服务ZooKeeper会从Slave中选举出一个Broker充当Master。
> Slave连接Master并同步他们的存储状态，Slave不接受客户端连接。所有的存储操作都将被复制到连接至Master的Slaves。如果Master宕机得到了最新更新的Slave会成为Master。故障节点在恢复后会重新加入到集群中并连接Master进入$lave模式。
>
> 所有需要同步的消息操作都将等待存储状态被复制到其他法定节点的操作完成才能完成。
> 所以，如果你配置了replicas=3，那么法定大小是(3/2)+1=2。Master将会存储并更新然后等待(2-1)=1个Slave存储和更新完成，才汇报success。
>
> 有一个node要作为观擦者存在。当一个新的Master被选中，你需要至少保障一个法定node在线以能够找到拥有最新状态的node。这个node才可以成为新的Master。
>
> 因此，推荐运行至少3个replica nodes以防止一个node失败后服务中断。

**<font color=red>首先需要保证有能够正常访问的Zookeeper集群</font>**

| 主机            | zk端口 | mq端口                     | MQ tcp端口 | 控制台端口 | Mq目录                |
| --------------- | ------ | -------------------------- | ---------- | ---------- | --------------------- |
| 192.168.153.130 | 2191   | bind="tcp://0.0.0.0:63631" | 61616      | 8161       | /mq_cluster/mq_node01 |
| 192.168.153.130 | 2192   | bind="tcp://0.0.0.0:63632" | 61617      | 8162       | /mq_cluster/mq_node02 |
| 192.168.153.130 | 2193   | bind="tcp://0.0.0.0:63633" | 61618      | 8163       | /mq_cluster/mq_node03 |

1. 创建三个ActiveMq的实例

   ```shell
   # 创建目录
   mkdir /mq_cluster
   cd mq_cluster
   cp -r /opt/apache-activemq-5.16.3 mq_node01
   cp -r mq_node01 mq_mode02
   cp -r mq_node01 mq_mode03
   ```

2. 修改 node2/3的配置，如果是三台不同的机器就不用改了

   ```shell
   cd mq_node02/conf
   vim jetty.xml
   ?jettyPort
   # 将port修改为8162
   <property name=port value="8162"/>
   ```

3. 修改hosts映射防止单机模拟集群时都是用localhost出现错误

   <font color=red>实际上**整个127网段(127.0.0.1 ~ 127.255.255.254)**都是回环地址</font>

   ```shell
   vim /etc/hosts
   127.0.0.1 localhost
   127.0.0.1 localhost1
   127.0.0.1 localhost2
   # 可以替换成127.0.0.1 ~ 127.255.255.254之间的任意一个
   ```

4. 所有节点的brokerName需要一致

   ```shell
   vim /conf/activemq.xml
   ?brokerName
   brokerName=zk_activemq
   # 修改tcp福安口
   ?openwire
   uri="tcp://0.0.0.0:61616"
   ```

5. 持久化配置

   ```shell
   # 参考 https://activemq.apache.org/replicated-leveldb-store
   <persistenceAdapter>
       <replicatedLevelDB
         directory="${activemq.data}/leveldb"
         replicas="3"
         bind="tcp://0.0.0.0:0"
         zkAddress="192.168.153.130:2191,192.168.153.130:2192,192.168.153.130:2193"
         zkPassword="password"
         zkPath="/activemq/leveldb-stores"
         hostname="zk_activemq"
         />
     </persistenceAdapter>
   ```

   | 属性               | 默认值           | 注释                                                         |
      | ------------------ | ---------------- | ------------------------------------------------------------ |
   | `replicas`         | `3`              | 集群中将存在的节点数。至少 (replicas/2)+1 个节点必须在线以避免服务中断。 |
   | `securityToken`    |                  | 必须在所有复制节点上匹配的安全令牌，以便它们接受彼此的复制请求。 |
   | `zkAddress`        | `127.0.0.1:2181` | ZooKeeper 服务器的逗号分隔列表。                             |
   | `zkPassword`       |                  | 连接到 ZooKeeper 服务器时使用的密码。                        |
   | `zkPath`           | `/default`       | 将交换 Master/Slave 选举信息的 ZooKeeper 目录的路径。        |
   | `zkSessionTimeout` | `2s`             | ZooKeeper 检测到节点故障的速度有多快。（在 5.11 之前 - 这有一个错字 zkSessionTmeout） |
   | `sync`             | `quorum_mem`     | 控制更新在被视为完成之前驻留的位置。此设置是以下选项的逗号分隔列表：`local_mem`, `local_disk`, `remote_mem`, `remote_disk`, `quorum_mem`, `quorum_disk`。如果您为一个目标组合两个设置，则使用更强的保证。例如，配置`local_mem, local_disk`与仅使用`local_disk`. quorum_mem 与`local_mem, remote_mem`和`quorum_disk`相同`local_disk, remote_disk` |

6. 修改不同的端口

   ```shell
   vim activemq.xml
   ?openwire
   uri 修改为上边的表格中的端口23改为 61617 61618
   ```

7. 编写批处理命令

   ```shell
   # zookeeper批量启动
   vim zk_batch_start.sh
   #! /bin/sh
   cd /myzk/zk01/bin
   ./zkServer.sh start
   cd /myzk/zk02/bin
   ./zkServer.sh start
   cd /myzk/zk02/bin
   ./zkServer.sh start
   # 保存退出
   :wq!
   # zookeeper批量关闭
   vim zk_batch_stop.sh
   #! /bin/sh
   cd /myzk/zk01/bin
   ./zkServer.sh stop
   cd /myzk/zk02/bin
   ./zkServer.sh stop
   cd /myzk/zk02/bin
   ./zkServer.sh stop
   # 保存退出
   :wq!
   # 仿照上边的写一个activemq批量启动和批量关闭
   ```

8. 启动集群

   ```shell
   ./zk_batch_start.sh
   #查看是否启动成功
   ps -ef|grep zookeeper|grep -v grep|wc -l
   # 启动 activemq
   ./activemq_batch_start.sh
   ```

9. 登陆其中一个zk查看

   ```shell
   cd /myzk/zk01/bin
   ./zkCli.sh -server 127.0.0.1:2191
   # 查看zk节点
   ls /
   ls /activemq/leveldb-stores
   ```

## 2. 故障迁移

> ActiveMQ的客户端只能访问Master的Broker,其他处于Slave的Broker不能访问，所以客户端连接的Broker应该使用failover协议(失败转移)
>
> 当一个ActiveMQ节点挂掉或者一个Zookeeper节点挂掉，ActiveMQ服务依然正常运转，如果仅剩一个ActiveMQ节点,由于不能选举Master，所以ActiveMQ不能正常运行;
>
> 同样的，如果Zookeeper仅剩一个节点活动，不管ActiveMQ各节点存活，ActiveMQ也不能正常提供服务。(ActiveMQ集群的高可用，依赖于Zookeeper集群的高可用)

```shell
ps -ef|grep activemq|grep -v grep
lsof -i:[pid] 
# 能展示出来的就是主节点
```

**<font color=blue>代码中的Mq地址需要修改</font>**

```java
public static final String ACTIVEMQ_URL = 
    "failover:(tcp://192.168.153.130:61616,tcp://192.168.153.130:61617,tcp://192.168.153.130:61618)?randomize=false";
```

手动关闭其中一个

```shell
kill -9 8993
# 会自动选举出来一个master
```

# 14 高级特性

> ActiveMQ支持同步、异步两种发送的模式将消息发送到broker，模式的选择对发送延时有巨大的影响。producer能达到怎样的产出率(产出率=发送数据总量/时间)主要受发送延时的影响，使用异步发送可以显著的提高发送的性能。
>
> <font color=red>ActiveMQ默认使用异步发送的模式</font>，除非明确指定使用同步发送的方式或者在未使用事务的前提下发送持久化的消息，这两种情况都是同步发送的。
>
> 如果<font color=blue>没有使用事务且发送的是持久化的消息</font>，每一次发送都是同步发送的且会阻塞producer直到broker返回一个确认，表示消息已经被安全的持久化到磁盘。确认机制提供了消息安全的保障，但同时会阻塞客户端带来了很大的延时。
>
> 很多高性能的应用，<font color=red>允许在失败的情况下有少量的数据丢失</font>。如果你的应用满足这个特点，你可以使用异步发送来提高生产率，即使发送的是持久化的消息

## 1. 异步投送

> 它可以最大化produer端的发送效率。<font color=blue>我们通常在发送消息量比较密集的情况下使用异步发送</font>，它可以很大的提升Producer性能;不过这也带来了额外的问题，
> 就是需要消耗较多的Client端内存同时也会导致broker端性能消耗增加;
>
> 此外它不能有效的确保消息的发送成功。在`useAsyncSend=true`的情况下客户端需要容忍消息丢失的可能。

1. java版本开启

   ```java
   //第一种 连接地址添加参数
   new ActiveMQConnectionFactory("tcp://127.0.0.1:61616?jms.useAsyncSned=true");
   //第二种
   ActivveMQConnectionFactory factory = new ActivveMQConnectionFactory(URL);
   factory.setUserAsyncSend(true);
   ```

==如何确认异步发送成功？==

> 异步发送丢失消息的场景是:生产者设置UseAsyncSend=true，使用producer.send(msg)持续发送消息。由于消息不阻塞，生产者会认为所有send的消息均被成功发送至MQ。
>
> 如果MQ突然宕机，此时生产者端内存中尚未被发送至MQ的消息都会丢失。
>
> 所以，正确的异步发送方法是需要接收回调的。
>
> 同步发送和异步发送的区别就在此，
>
> 同步发送等send不阻塞了就表示一定发送成功了，
>
> 异步发送需要接收回执并由客户端再判断一次是否发送成功。

```java
package com.eleven;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.ActiveMQMessageProducer;
import org.apache.activemq.AsyncCallback;

import javax.jms.*;
import java.util.UUID;

/**
 * @author eleven
 * @date 2021/9/17 14:38
 * @apiNote 异步投送生产者
 */
public class AsyncJmsProducer {/** activeMq连接地址*/
private static final String ACTIVEMQ_URL = "nio://127.0.0.1:61618";
    private static final String QUEUE_NAME = "activemq_jdbc";
    public static void main(String[] args) {
        ActiveMQConnectionFactory factory = new ActiveMQConnectionFactory(ACTIVEMQ_URL);
        try {
            Connection connection = factory.createConnection();
            connection.start();
            Session session = connection.createSession(false,Session.AUTO_ACKNOWLEDGE);
            Queue queue = session.createQueue(QUEUE_NAME);
            //创建子类activemq生产者
            ActiveMQMessageProducer activeMQMessageProducer = (ActiveMQMessageProducer) session.createProducer(queue);
            activeMQMessageProducer.setDeliveryMode(DeliveryMode.PERSISTENT);
            for (int i = 0; i < 3; i++) {
                TextMessage textMessage = session.createTextMessage("msg----" + i);
                textMessage.setJMSMessageID(UUID.randomUUID().toString() + "----moduleName");
                String msgID = textMessage.getJMSMessageID();
                activeMQMessageProducer.send(textMessage, new AsyncCallback() {
                    @Override
                    public void onSuccess() {
                        System.out.println("成功的id：" + msgID);
                    }

                    @Override
                    public void onException(JMSException e) {
                        // TODO: 2021/9/17 人工重发 
                        System.out.println("失败的id：" + msgID);
                    }
                });
            }
            // 9. 关闭资源
            activeMQMessageProducer.close();
            session.close();
            connection.close();
            System.out.println("****ActiveMq发送消息完成***");
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
```

## 2. 延迟投递和定时投递

> [官网文档地址](http://activemq.apache.org/delay-and-schedule-message-delivery.html)
>
> 修改`activemq.xml` 添加 `scheduledSupport="true"`
>
> ```xml
> <broker xmlns="http://activemq.apache.org/schema/core" brokerName="localhost" dataDirectory="${activemq.data}"  schedulerSupport="true" >
> ```

| 参数                 | 类型   | 描述               |
| -------------------- | ------ | ------------------ |
| AMQ_SCHEDULED_DELAY  | long   | 延迟投递的时间     |
| AMQ_SCHEDULED_PERIOD | long   | 重复投递的时间间隔 |
| AMQ_SCHEDULED_REPEAT | int    | 重复投递的次数     |
| AMQ_SCHEDULED_CRON   | String | cron表达式         |

**<font color=red>懒得写了，用springtask的@Scheduled注解吧，详细参数如下</font>**

| 参数               | 参数说明                                                     | 示例          |
| ------------------ | ------------------------------------------------------------ | ------------- |
| cron               | 任务执行的cron表达式                                         | 0/1 * * * * ? |
| zone               | cron表达时解析使用的时区,默认为服务器的本地时区,使用java.util.TimeZone#getTimeZone(String)方法解析 | GMT-8:00      |
| fixedDelay         | <font color=red>上一次任务执行结束到下一次执行开始的间隔时间,</font>单位为ms | 1000          |
| fixedDelayString   | 上一次任务执行结束到下一次执行开始的间隔时间,使用java.time.Duration#parse解析 | PT15M         |
| fixedRate          | <font color=red>以固定间隔执行任务，即上一次任务执行开始到下一次执行开始的间隔时间,</font>单位为ms,若在调度任务执行时,上一次任务还未执行完毕,会加入worker队列,等待上一次执行完成后立即执行下一次任务 | 2000          |
| fixedRateString    | 与fixedRate逻辑一致,只是使用java.time.Duration#parse解析     | PT15M         |
| initialDelay       | 首次任务执行的延迟时间                                       | 1000          |
| initialDelayString | 首次任务执行的延迟时间,使用java.time.Duration#parse解析      | PT15M         |

## 3. 重试机制

> [官方文档](http://activemq.apache.org/redelivery-policy)
>
> 默认的是 <font color=red>每秒钟重发六次</font>
>
> 一个消息被redelivedred超过默认的最大重发次数（默认6次）时，消费的回个MQ发一个“poison ack”表示这个消息有毒，告诉broker不要再发了。这个时候broker会把这个消息放到DLQ（死信队列）。

### 1. 引发消息重发的情况

1. Client用了transactions且再session中调用了rollback
2. Client用了transactions且再调用commit之前关闭或者没有commit
3. Client再CLIENT_ACKNOWLEDGE的传递模式下，session中调用了recover

### 2. 参数介绍

| 参数                                              | 描述                                                         | 默认值                           |
| ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------- |
| collisionAvoidanceFactor                          | 设置防止冲突范围的正负百分比，只有启用useCollisionAvoidance参数时才生效。也就是在延迟时间上再加一个时间波动范围 | 0.15                             |
| **<font color=red>maximumRedeliveries</font>**    | **<font color=red>最大重传次数，达到最大重连次数后抛出异常。<br>为-1时不限制次数，为0时表示不进行重传</font>** | **<font color=red>6</font>**     |
| maximumRedeliveryDelay                            | 最大传送延迟，只在useExponentialBackOff为true时有效(V5.5)，假设首<br/>次重连间隔为10ms，倍数为2，那么第二次重连时间间隔为20ms，第三次重连时间间隔为40ms，当重连时间间隔大的最大重连时间间隔时，以后每次重连时间间隔都为最大重连时间间隔 | -1                               |
| **<font color=red>initialRedeliveryDelay</font>** | **<font color=red>初始重发延迟时间(ms)</font>**              | **<font color=red>1000L</font>** |
| redeliveryDelay                                   | 重发延迟时间，当initialRedeliveryDelay=0时生效               | 1000L                            |
| useCollisionAvoidance                             | 启用防止冲突功能                                             | false                            |
| useExponentialBackOff                             | 启用指数倍数递增的方式增加延迟时间                           | false                            |
| backOffMultiplier                                 | 重连时间间隔递增倍数，只有值大于1和启用useExponentialBackOff参数时才生效 |                                  |

### 3. Springboot配置

```java
package com.eleven.config;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.RedeliveryPolicy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.core.JmsMessagingTemplate;
import org.springframework.jms.core.JmsTemplate;

import javax.jms.DeliveryMode;
import javax.jms.Session;

/**
 * @author eleven
 * @date 2021/9/17 15:31
 * @apiNote ActiveMq 配置类
 */
@Configuration
@EnableJms
public class ActiveMqConfig {
    @Value("${spring.activemq.broker-url}")
    private String activemqUrl;

    @Bean
    public RedeliveryPolicy redeliveryPolicy(){
        RedeliveryPolicy redeliveryPolicy = new RedeliveryPolicy();
        //是否在每次重发失败之后增加等待时间
        redeliveryPolicy.setUseExponentialBackOff(true);
        //重发次数默认为6
        redeliveryPolicy.setMaximumRedeliveries(6);
        //重发间隔默认为1s 这个我也不确定单位是不是ms
        redeliveryPolicy.setInitialRedeliveryDelay(1L);
        //重发间隔每次增加 500ms * 2 = 1000ms
        redeliveryPolicy.setBackOffMultiplier(2);
        //是否避免消息碰撞
        redeliveryPolicy.setUseCollisionAvoidance(false);
        //重发的最大拖延时间 -1表示没有拖延 只有 useExponentialBackOff = true 有效
        redeliveryPolicy.setMaximumRedeliveryDelay(-1);
        return redeliveryPolicy;
    }

    @Bean
    public ActiveMQConnectionFactory activeMQConnectionFactory(){
        ActiveMQConnectionFactory activeMQConnectionFactory =
                new ActiveMQConnectionFactory("admin","admin",activemqUrl);
        activeMQConnectionFactory.setRedeliveryPolicy(redeliveryPolicy());
        return activeMQConnectionFactory;
    }

    @Bean
    public JmsTemplate jmsTemplate(){
        JmsTemplate jmsTemplate=new JmsTemplate();
        //进行持久化配置 1表示非持久化，2表示持久化
        jmsTemplate.setDeliveryMode(DeliveryMode.PERSISTENT);
        jmsTemplate.setConnectionFactory(activeMQConnectionFactory());
        //客户端签收模式
        jmsTemplate.setSessionAcknowledgeMode(Session.AUTO_ACKNOWLEDGE);
        return jmsTemplate;
    }

    @Bean
    public JmsMessagingTemplate jmsMessagingTemplate(){
        JmsMessagingTemplate template = new JmsMessagingTemplate();
        template.setConnectionFactory(activeMQConnectionFactory());
        return template;
    }
}
```

## 4. 死信队列 DLQ

### 1. 基础概念

> ActiveMQ中引入了“死信队列”(Dead Letter Queue〉的概念。即一条消息再被重发了多次后（默认为重发6次`redeliveryCounter=6`)，将会被ActiveMQ移入“死信队列”。开发人员可以在这个Queue中查看处理出错的消息，进行人工干预。

![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-muwxanaa-1631866082044)(D:\Study\笔记\Mq\img\activemq_dlq.png)\]](https://img-blog.csdnimg.cn/f6565c63c45645d18d2eedbcebfb76f7.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5piv6LW15pWi5pWi5ZWK,size_20,color_FFFFFF,t_70,g_se,x_16)


- 一般生产环境中在使用MQ的时候设计两个队列:一个是核心业务队列，一个是死信队列。
- 核心业务队列，就是比如上图专门用来让订单系统发送订单消息的，然后另外一个死信队列就是用来处理异常1况的。
- 假如第三方物流系统故障了此时无法请求，那么仓储系统每次消费到一条订单消息，尝试通知发货和配送都会遇到对方的接口报错。此时仓储系统就可以把这条消息拒绝访问或者标志位处理失败。一旦标志这条消息处理失败了之后，MQ就会把这条消息转入提前设置好的一个死信队列中。

### 2. 配置死信队列

> 将所有的DeadLetter保存在一个共享的队列中，这是ActiveMQ broker端默认的策略。共享队列默认“ActiveMQ.DLQ”，可以通过“deadLetterQueue”属性来设定。

```xml
<deadLetterStrategy>
	<sharerDeadLetterStrategy 
         deadLetterQueue="DLQ-QUEUE"/>
</deadLetterStrategy>

```

> 保存到各自的队列中,`useQueueForQueueMessages` 是否将 topic的DeadLetter保存在Queue中，默认为 true

```xml
<policyEntry queue="yourname">
	<deadLetterStrategy>
        <individualDeadLetterStrategy 
             queuePrefix="DLQ."
             useQueueForQueueMessages="false" />                         
    </deadLetterStrategy>
</policyEntry>
```

> 自动删除过期消息,`processExpired`是否将过期消息放到死信队列，默认为true

```xml
<policyEntry queue= ">">
    <deadLetterStrategy>
	<sharedDeadLetterStrategy 
        processExpired="false" />
    </deadLetterStrategy>
</policyEntry>
```

> 把非持久的消息放置到死信队列中， `processNonPersistent`默认为false

```xml
<policyEntry queue= ">">
	<deadLetterStrategy>
		<sharedDeadLetterStrategy 		        
            processNonPersistent="true" />
        </deadLetterStrategy>
</policyEntry>

```

## 5. 防止重复消费

> 网络延迟传输中，会造成进行MQ重试中，在重试过程中，可能会造成重复消费。
>
> 如果消息是做数据库的插入操作，给这个消息做一个唯一主键，那么就算出现重复消费的情况，就会导致主键冲实，避免数据库出现脏数据。
>
> 如果上面两种情况还不行，准备一个第三服务方来做消费记录。以redis为例，给消息分配一个全局id
> 只要消费过该消息，将<id,message>以K-V形式写入redis。那消费者开始消费前，先去redis中查询有没消费记录即可。

# 15. 错误集锦

>  Failure details: Cannot execute statement: impossible to write to >binary log since BINLOG_FORMAT = STATEMENT and at least one table uses >a storage engine limited to row-based logging. InnoDB is limited to >row-loggng when transaction isolation level is READ COMMITTED or READ >UNCOMMITTED.
>  java.sql.SQLException: Cannot execute statement: impossible to write >to binary log since BINLOG_FORMAT = STATEMENT and at least one table >uses a storage engine limited to row-based logging. InnoDB is limited >to row-logging when transaction isolation level is READ COMMITTED or >READ UNCOMMITTED.

**<font color=red>参考自：[ActiveMq使用Mysql持久化报错](https://blog.csdn.net/l1028386804/article/details/69041255)</font>**

1. 单机直接修改mysql的binlog级别

   ```sql
   SET GLOBAL binlog_format = 'ROW';
   ```

2. 修改activemq.xml

   ```shell
   vim /opt/apache-activemq-5.16.3/conf/activemq.xml
   ?jdbcPersistenceAdapter
   #修改为下边这个
   <jdbcPersistenceAdapter dataSource="#mysql-ds"createTablesOnStartup="true" transactionIsolation=“4”/>
   # 即TRANSACTION_REPEATABLE_READ，此时事务更严格，会影响性能，建议在集群、强实时一致、不强调单机性能的情况下使用。
   ```



> Loading message broker from: xbean:activemq.xml
>
> Refreshing org.apache.activemq.xbean.XBeanBrokerFactory$1@7986668c: startup date [Thu Sep 16 20:44:21 CST 2021]; root of context hierarchy
>
> Using Persistence Adapter: JDBCPersistenceAdapter(org.apache.commons.dbcp2.BasicDataSource@4266381c)
>
> Database adapter driver override recognized for : [mysql_connector_java] - adapter: class 	org.apache.activemq.store.jdbc.adapter.MySqlJDBCAdapter
>
> Database lock driver override not found for : [mysql_connector_java].  Will use default implementation.
> Attempting to acquire the exclusive lock to become the Master broker

<font color=red>**错误原因activemq锁表了**</font>

**<font color=blue>解决办法</font>**

```shell
vim /opt/apache-activemq-5.16.3/conf/activemq.xml
# 如果是jdbc模式的话
?jdbcPersistenceAdapter
# 在这个标签添加 useDatabaseLock="false"
<jdbcPersistenceAdapter dataSource="#mysql-ds" createTablesOnStartup="false" useDatabaseLock="false"/>
# 如果是 jdbc + journal的话
?journalPersistenceAdapterFactory
# 同样添加 useDatabaseLock="false"
<journalPersistenceAdapterFactory
     journalLogFiles="4"
     journalLogFileSize="32768"
     useJournal="true"
     useQuickJournal="true"
     useDatabaseLock="false"
     dataSource="#mysql-ds"
     dataDirectory="activemq-data" />
```

# 16 写在最后

> **<font color=red>感谢汪经理指出的错别字</font>** :dog2:

