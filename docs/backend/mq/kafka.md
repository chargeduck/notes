:::info
[笔记来源 进度 13/65](https://www.bilibili.com/video/BV1Gp421m7UN/?p=13)
:::

# 1. Kafka简介

## 1. MQ对比

| 特性                    | ActiveMQ                                 | RabbitMQ                 | RocketMq                       | Kafka                                            |
| ----------------------- | ---------------------------------------- | ------------------------ | ------------------------------ | ------------------------------------------------ |
| 单机吞吐量              | 万级，<br/>比RocketMq和Kafka低一个数量级 | 同左                     | 10万级<br/>支出高吞吐          | 10万级<br/>支持高吞吐                            |
| Topic数量对吞吐量的影响 |                                          |                          | Topic可以达到几百几千          | Topic可以达到几百量级，如果更多吞吐量会大幅下降  |
| 时效性                  | ms级                                     | 微秒级别，延迟最低       | ms                             | ms                                               |
| 可用性                  | 高，基于主从架构实现高可用               | 同左                     | 非常高，分布式架构             | 同左                                             |
| 消息可靠性              | 有较低概率丢失数据                       | 基本不丢                 | 参数调优后可以0丢失            | 同左                                             |
| 功能支持                | MQ功能完善                               | 并发性抢，性能好，延时低 | Mq功能相对晚上，分布式扩展性好 | 功能简单，支持简单的MQ功能，在大数据领域广泛使用 |
| 其他                    | 开发较早，不是很活跃                     | 开源稳定，社区活跃度高   | 阿里开发                       | 开源，高吞吐，社区活跃度高                       |

通过上面各种消息中间件的对比，大概可以了解，不在大数据场景中我们主要采用 kaka作为消息中间件，而在 JaveEE开发中我们主要采用 ActiveMO、RabbitMO、RocketMQ作为消息中间件。如果将 JavaEE和大数据在项目中进行融合的话，那么 Katka 其实是一个不错的选择。

## 2. Windows下安装

> [官网下载地址  Kafka3.7.0](https://downloads.apache.org/kafka/3.7.0/kafka_2.13-3.7.0.tgz)， 从kafka2.8.0以后就已经移除来 对Zookeeper的依赖，使用了Kraft协议来支持选举，但是3.x之后需要JDK11或者是JDK17。
>
> 不过Kafka还是同时支持Zookeeper和KRaft的，下边会以两种不同的方式来启动
>
> 具体的细节可以参考[帅呆了！Kafka移除了Zookeeper](https://juejin.cn/post/6956145788238069796?searchId=20240628115132EE0B8512726D89626678)

### 1. KRaft

1. 解压缩

```shell
cd bin/windows
```

2. 执行命令

```shell
#生成UUID
kafka-storage.bat random-uuid
# Cvp9YKkdTWWEA_MI_zbrPQ
kafka-storage.bat format -t Cvp9YKkdTWWEA_MI_zbrPQ -c ../../config/kraft/server.properties
# 启动Kafka
kafka-server-start.bat ../../config/kraft/server.properties
```

3. 如果重新启动提示一下错误，就把第二部重新执行一下

```shell
No readable meta.properties files found.
```

### 2. Zookeeper

1. 修改`config/zookeeper.properties`

```shell
# 修改dataDir的配置及，路径不存在会自动创建
dataDir=G:/ide/kafka_2.13.-3.7.0/data/zk
```

2. 启动zookeeper

```shell
cd bin/windows
zookeeper-server-start.bat ../../config/zookeeper/properties
```

> 为了操作方便，也可以在kafka解压缩后的目录中，创建zk.cmd

```shell
call bin/windows/zookeeper-server-start.bat config/zookeeper.properties
```

3. 启动kafka

> 如果想要变更kafka默认端口，可以修改`config/server.properties`,不更改的直接启动就行

```shell
#advertised.listeners=PLAINTEXT://your.host.name:9092
```

```shell
kafka-server-start.bat ../../config/server.properties
```

4. 查看是否启动成功

```shell
jps -l
```

## 3.  Topic操作

1. 创建topic

```shell
# g:\ide\kafka_2.13-3.7.0\bin\windows>
kafka-topics.bat --bootstrap-server localhost:9092 --topic test --create
```

2. 查看Topic

```shell
kafka-topics.bat --bootstrap-server localhost:9092 --list
```

3. 查看topic详细信息

```shell
kafka-topics.bat --bootstrap-server localhost:9092 --topic test --describe
```

4. 删除topic

```shell
kafka-topics.bat --bootstrap-server localhost:9092 --topic test123 --delete
```

5. 如果出现很多报错信息的话，可能是JDK的版本太低了

> 修改本机的JAVA_HOME为JDK 11或者是JDK17
>
> 或者修改`kafka-run-class.bat`,在对上边添加

```shell
SET JAVA_HOME=c:/program files/Java/Jdk-11.0.7
```

6. 生产数据

```shell
 kafka-console-producer.bat --bootstrap-server localhost:9092 --topic test
 # 等待出现> 输入消息然后回车
 hello kafka 
```

7. 消费消息

```shell
 kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic test
```



## 4. 使用Java代码生产消费

1. 引入依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.kafka</groupId>
        <artifactId>kafka-clients</artifactId>
        <version>3.7.0</version>
    </dependency>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13.2</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

2. 创建消息生产者

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;

public class KafkaProducerTest {
    public static void main(String[] args) {
        // 1. 创建生产者对象
        // 1.1 创建配置对象
        Properties properties = new Properties();
        properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        // 服务地址
        StringSerializer stringSerializer = new StringSerializer();
        KafkaProducer<String, String> producer = new KafkaProducer<>(properties,
                stringSerializer,
                stringSerializer);
        // 2. 创建数据
        /**
         * 1. topic名称： 主题不存在则会自动创建
         * 2. 数据的KEy
         * 3. 数据的value
         */
        for (int i = 0; i < 10; i++) {
            ProducerRecord<String, String> record = new ProducerRecord<>(
                    "test",
                    "key" + i,
                    "value" + i
            );
            // 3. 通过生产者将数据发送到Kafka
            producer.send(record);
        }

        // 4. 关闭生产者对象
        producer.close();
    }
}
```

3. 创建消费者

```java
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.time.Duration;
import java.util.Collections;
import java.util.Properties;

public class KafkaConsumerTest {
    public static void main(String[] args) {
        // 1. 创建消费者对象
        Properties properties = new Properties();
        properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        properties.put(ConsumerConfig.GROUP_ID_CONFIG, "test");
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(properties);
        // 2. 订阅主题
        consumer.subscribe(Collections.singletonList("test"));
        // 3. 从Kafka中拉取数据
        while (true) {
            ConsumerRecords<String, String> pollDataList = consumer.poll(Duration.ofMillis(100));
            for (ConsumerRecord<String, String> data : pollDataList) {
                System.out.println(data);
            }
        }
        // 3. 关闭消费者对象
        //consumer.close();

    }
}
```

## 5. Kafka-Tool

> [下载地址](https://www.kafkatool.com/download3/offsetexplorer_64bit.exe)
