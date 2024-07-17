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

### 3. UI页面查看

1. [OffsetExplorer](https://www.kafkatool.com/download3/offsetexplorer_64bit.exe)

> 直接新建连接就行

1. [Kraft-UI](https://github.com/provectus/kafka-ui/releases/download/v0.7.2/kafka-ui-api-v0.7.2.jar)

> 启动之后访问`localhost:8080`，应该是仅支持Kraft模式启动的

可以使用`360压缩`或者是`jd-gui`打开下载的jar包，进入到`BOOT_INF\classes`下，将`application-local.yml`内容修改以下保存重新打包即可

```yaml
logging:
  level:
    root: INFO
    com.provectus: DEBUG
    #org.springframework.http.codec.json.Jackson2JsonEncoder: DEBUG
    #org.springframework.http.codec.json.Jackson2JsonDecoder: DEBUG
    reactor.netty.http.server.AccessLog: INFO

#server:
#  port: 8080 #- Port in which kafka-ui will run.

kafka:
  clusters:
    - name: local
      bootstrapServers: 192.168.242.130:9092
      # zookeeper: localhost:2181
      schemaRegistry: http://localhost:8085
      ksqldbServer: http://localhost:8088
      kafkaConnect:
        - name: first
          address: http://localhost:8083
      metrics:
        port: 9997
        type: JMX
    - name: 192.168.242.130    
      bootstrapServers:  192.168.242.130:9092
      metrics:
        port: 9997
        type: JMX
spring:
  jmx:
    enabled: true

auth:
  type: DISABLED
```

```shell
java -jar --add-opens java.rmi/javax.rmi.ssl=ALL-UNNAMED g:\ide\kafka-ui\kafka-ui-api-v0.7.1.jar --spring.profiles.active=localhost
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

## 5. 集群搭建

### 1. ~~Windows下搭建集群~~

> ~~试了一上午没成功，下边的内容不可靠~~

1. 创建一个文件夹`kafka_cluster`
2. 复制刚才的`kafka`文件夹到`kafka_cluster`中，分别命名为`kafka`,`kafka_1`,`kafka_2`,`kafka_3`

3. 修改配置文件

```shell
# kafka/config/kraft/server.properties
# The node id associated with this instance's roles
node.id=1
log.dirs=G:/ide/kafka_cluster/kafka/data/log
```

```shell
# kafka/config/kraft_1/server.properties
# The node id associated with this instance's roles
node.id=2
controller.quorum.voters=1@localhost:9093,2@localhost:9193,3@localhost:9293,4@localhost:9393
advertised.listeners=PLAINTEXT://localhost:9192
listeners=PLAINTEXT://:9192,CONTROLLER://:9193
advertised.listeners=PLAINTEXT://localhost:9192
log.dirs=G:/ide/kafka_cluster/kafka_1/data/log
```

```shell
# kafka/config/kraft_2/server.properties
# The node id associated with this instance's roles
node.id=3
controller.quorum.voters=1@localhost:9093,2@localhost:9193,3@localhost:9293,4@localhost:9393
advertised.listeners=PLAINTEXT://localhost:9292
listeners=PLAINTEXT://:9292,CONTROLLER://:9293
advertised.listeners=PLAINTEXT://localhost:9292
log.dirs=G:/ide/kafka_cluster/kafka_2/data/log
```

```shell
# kafka/config/kraft_3/server.properties
# The node id associated with this instance's roles
node.id=4
controller.quorum.voters=1@localhost:9093,2@localhost:9193,3@localhost:9293,4@localhost:9393
listeners=PLAINTEXT://:9392,CONTROLLER://:9393
advertised.listeners=PLAINTEXT://localhost:9392
log.dirs=G:/ide/kafka_cluster/kafka_3/data/log
```

4. 在`kafka`文件夹下创建`kraft.cmd`,双击启动，复制到其他三个文件夹下

```shell
call bin/windows/kafka-server-start.bat config/kraft/server.properties
```

5. 在`kafka_cluster`下创建`cluster.cmd`用于批量启动

```shell
cd kafka
start kraft.cmd
cd ../kafka_1
start kraft.cmd
cd ../kafka_2
start kraft.cmd
cd ../kafka_3
start kraft.cmd
```

6. 在`kafka_cluster`下创建`cluster_clear.cmd`用于批量清空

```shell
cd kafka
rd /s /q data
cd ../kafka_1
rd /s /q data
cd ../kafka_2
rd /s /q data
cd ../kafka_3
rd /s /q data
```

7. 如果提示了` No readable meta.properties files found.`那就生成一下节点的uuid，这个问题是调用了`cluster_clear.cmd`清除了`data/log`目录导致的,修改所有的`kraft.cmd`

- `kafka/kraft.cmd`

> 这里生成的uuid需要再其他节点的 -t 参数中填上，但是我的就是执行不了。就会报错命令语法不对

```shell
@echo off
for /f "delims=" %%a in ('call bin/windows/kafka-storage.bat random-uuid') do set uuid=%%a
echo %uuid%
call bin/windows/kafka-storage.bat format -t %uuid% -c config/kraft/server.properties
call bin/windows/kafka-server-start.bat config/kraft/server.properties
```

- `kafka_1/kraft.cmd`,其他两个按照`node.id`填写

### 2. [Centos下搭建集群](/backend/mq/kafka/centos_cluster.html)

### X. 遇到的问题

1.  No readable meta.properties files found.

> 执行了`cluster_clear.cmd`之后把`data`目录删除了导致了

2. 命令语法不正确。

> 能正常启动一个，但是另外三个启动不起来，批处理命令改成

```shell
@echo off
# -t 后边的改为 node.id
call bin/windows/kafka-storage.bat format -t 2 -c config/kraft/server.properties
call bin/windows/kafka-server-start.bat config/kraft/server.properties
```

3. 请求的操作无法在使用用户映射区域打开的文件上执行。

> `Windows`下需要将`config/kraft/server.properties`配置的`log.dirs`值中的`/`改成`/`

4. Address already in use: bind

> 端口占用的问题，把9093啥的改成自己的端口

5. Unexpected error INCONSISTENT_CLUSTER_ID in VOTE response: InboundResponse。

> 启动意识刷屏报错，这是因为没有个给设置集群id

