:::info

本文的代码已经上传到[mdProject](https://gitee.com/chargeduck/mq-project)，笔记来源于[B站黑马RocketMq](https://www.bilibili.com/video/BV1L4411y7mn?p=41)，因为视频上传于2019年，所以对部分代码做出了适当的变更。

1. Dubbo 变更为 OpenFeign
2. ZooKeeper 变更为 Nacos
3. 

:::

# 1. SpringBoot整合RocketMq

## 1. 创建生产者

1. 添加相关的以来

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.3.3.RELEASE</version>
</parent>
<properties>
    <maven.compiler.source>11</maven.compiler.source>
    <maven.compiler.target>11</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <lombok.version>1.18.30</lombok.version>
    <rocketmq-starter.version>2.3.0</rocketmq-starter.version>
    <junit.version>4.13.2</junit.version>
    <boot-test.version>2.6.4</boot-test.version>
</properties>
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <version>${boot-test.version}</version>
    </dependency>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>${junit.version}</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.apache.rocketmq</groupId>
        <artifactId>rocketmq-spring-boot-starter</artifactId>
        <version>${rocketmq-starter.version}</version>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>${lombok.version}</version>
    </dependency>
</dependencies>
```

2. 创建启动类

```java
package net.lesscoding.shop.boot.rocketmq;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author eleven
 * @date 2024/6/4 20:22
 * @apiNote
 */
@SpringBootApplication
public class ProducerApp {
    public static void main(String[] args) {
        SpringApplication.run(ProducerApp.class, args);
    }
}
```

3. 添加配置文件

```yaml
rocketmq:
  name-server: 192.168.242.130:9876;192.168.242.131.9876
  producer:
    group: my-group
```

4. 创建测试类测试发送简单消息

```java
package net.lesscoding.shop.test;

import net.lesscoding.shop.boot.rocketmq.ProducerApp;
import org.apache.rocketmq.spring.core.RocketMQTemplate;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * @author eleven
 * @date 2024/6/4 20:23
 * @apiNote
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes =  ProducerApp.class)
public class ProducerTest {

    @Autowired
    private RocketMQTemplate rocketMQTemplate;

    @Test
    public void sendMsg() {
        // 发送简单的消息
        rocketMQTemplate.convertAndSend("spring-boot-rocketMq", "Hello Spring boot RocketMq");
    }
}
```

5. 打开`rockermq-console`查看是否有消息发送成功

## 2. 创建消费者

1. 添加依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.apache.rocketmq</groupId>
        <artifactId>rocketmq-spring-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
    </dependency>
</dependencies>
```

2. 添加配置文件

```yml
rocketmq:
  name-server: 192.168.242.130:9876;192.168.242.131.9876
  consumer:
    group: my-group
```

3. 创建消息监听器

```java
package net.lesscoding.shop.boot.rocketmq.listener;

import lombok.extern.slf4j.Slf4j;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.springframework.stereotype.Component;

/**
 * @author eleven
 * @date 2024/6/4 20:58
 * @apiNote
 */

@RocketMQMessageListener(topic = "spring-boot-rocketMq", consumerGroup = "${rocketmq.consumer.group}")
@Slf4j
@Component
public class ConsumerListener implements RocketMQListener<String> {
    @Override
    public void onMessage(String str) {
        log.info("接收到的消息是: {}", str);
    }
}
```

