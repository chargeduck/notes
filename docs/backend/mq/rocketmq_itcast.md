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

# 2. 项目变更

## 0. 技术变更

> 1. 原有项目的Dubbo变更为OpenFeign
> 2. 原有项目的ZooKeeper变更为Nacos

## 1. Nacos简介

> 如果不会SpringCloud和Nacos的可以先看我的博文,以及当时我学的视频
>
> 1. [spring-cloud-alibaba学习记录及Nacos采坑指南](https://blog.csdn.net/qq_42059717/article/details/122434659)
> 2. [Nacos启动报错Unable to start embedded Tomcat](https://blog.csdn.net/qq_42059717/article/details/110728414)
> 3. [尚硅谷SpringCloud](https://www.bilibili.com/video/BV18E411x7eT)

[官方下载地址](https://github.com/alibaba/nacos/releases)，现在最新版的是`2.3.2`,这个我没用过，所以我上了2.2.0。

~~**2024年6月4日21:59:09 更新， 直接上最新版的，不能怂！冲**~~

### 1. 下载安装

1. 执行下载[最新版](https://objects.githubusercontent.com/github-production-release-asset-2e65be/137451403/beab875b-ec0b-4240-9397-37ae3bf2caea?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=releaseassetproduction%2F20240604%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240604T140052Z&X-Amz-Expires=300&X-Amz-Signature=0c7e2b9dcdc5224ee70562a9b60b119fba190d7ab629baa030a88ded9492c479&X-Amz-SignedHeaders=host&actor_id=42894761&key_id=0&repo_id=137451403&response-content-disposition=attachment%3B%20filename%3Dnacos-server-2.3.2.tar.gz&response-content-type=application%2Foctet-stream)的代码，或者[联系我](http://mail.qq.copm/2496290990@qq.com)
2. 上传到服务器

```shell
# 通过scp命令或者是xftp上传都可以
scp nacos-server-2.3.2.tar.gz root@192.168.242.130:/opt/software
# 解压缩
tar -zxvf nacos-server-2.3.2.tar.gz
# 修改目录名
mv nacos nacos-2.3.2
```

3. 切换nacos默认数据库(<font color=blue>不重要，改不改都行</font>)

> nacos启动的时候默认用的是java自带的一个`derby`数据库好像，单机模式下可以切换成Mysql，[文档地址](https://nacos.io/docs/latest/guide/admin/deployment/#%E5%8D%95%E6%9C%BA%E6%A8%A1%E5%BC%8F%E6%94%AF%E6%8C%81mysql)

```shell
# 按照https://nacos.io/docs/latest/guide/admin/deployment/#单机模式支持mysql 变更
cd nacos-2.3.2/conf 
vim application.properties
# 使用?mysql或者/mysql查询
?mysql
# 或者 :set nu展示行号 把 36 40 43 44 45行注释放开
# 将下列
spring.datasource.platform=mysql

db.num=1
db.url.0=jdbc:mysql://11.162.196.16:3306/nacos_devtest?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.user=nacos_devtest
db.password=youdontknow
# 保存
:wq!
# 将conf下的mysql-schema.sql放到自己的mysql中
```

4. 单机模式启动

```shell
nohup sh bin/startup.sh -m standalone > /opt/logs/nacos.log &
# 查看是否启动成功
jps -l
# 查看日志
tail -500f /opt/logs/nacos.log
# 出现这个就成功了
         ,--.
       ,--.'|
   ,--,:  : |                                           Nacos 2.3.2
,`--.'`|  ' :                       ,---.               Running in stand alone mode, All function modules
|   :  :  | |                      '   ,'\   .--.--.    Port: 8848
:   |   \ | :  ,--.--.     ,---.  /   /   | /  /    '   Pid: 8925
|   : '  '; | /       \   /     \.   ; ,. :|  :  /`./   Console: http://192.168.242.130:8848/nacos/index.html
'   ' ;.    ;.--.  .-. | /    / ''   | |: :|  :  ;_
|   | | \   | \__\/: . ..    ' / '   | .; : \  \    `.      https://nacos.io
'   : |  ; .' ," .--.; |'   ; :__|   :    |  `----.   \
|   | '`--'  /  /  ,.  |'   | '.'|\   \  /  /  /`--'  /
'   : |     ;  :   .'   \   :    : `----'  '--'.     /
;   |.'     |  ,     .-./\   \  /            `--'---'
'---'        `--`---'     `----'

2024-06-04 22:47:18,310 INFO Tomcat initialized with port(s): 8848 (http)

2024-06-04 22:47:20,229 INFO Root WebApplicationContext: initialization completed in 17288 ms、
```

5. 开放端口

> 这个新版的Nacos其实还有一些其他的端口，但是我没学，所以我也不会，我只知道这一个
>
> 新增了9848,9849两个端口

```shell
# 开放nacos的默认端口8848
firewall-cmd --zone=public --add-port=8848/tcp --permanent
firewall-cmd --zone=public --add-port=9848/tcp --permanent
firewall-cmd --zone=public --add-port=9849/tcp --permanent
# 重启firewall-cmd
systemctl restart firewalld
```

6. 访问nacos页面 [192.168.242.130:8848/nacos](http://192.168.242.130:8848/nacos),账号密码默认都是 `nacos`

## 2. 新增Nacos

1. 父Pom变更

```xml
<parent>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-parent</artifactId>
    <version>Hoxton.SR4</version>
</parent>
<properties>
    <alibaba-cloud.version>2.2.0.RELEASE</alibaba-cloud.version>
    <nacos-config.version>2.2.0.RELEASE</nacos-config.version>
    <nacos-discovery.version>2.2.0.RELEASE</nacos-discovery.version>
    <openfeign.version>2.2.6.RELEASE</openfeign.version>
</properties>
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>${alibaba-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
            <version>${nacos-config.version}</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
            <version>${nacos-discovery.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
            <version>${openfeign.version}</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

2. 配置文件从`application.yaml`变更为`bootstrap.yml`

```yml
spring:
  profiles:
    active: dev
  cloud:
    nacos:
      config:
        server-addr: 192.168.242.130:8848
        prefix: rocketmqConsumer
        file-extension: yaml
        group: DEFAULT_GROUP
      discovery:
        server-addr: 192.168.242.130:8848
        group: DEFAULT_GROUP
```

3. 在nacos上新增一个配置文件`rocketmqConsumer-dev.yaml`

```java
rocketmq:
  name-server: 192.168.242.130:9876;192.168.242.131:9876
  consumer:
    group: my-group
```

4. 启动类上新增注解`@EnableDiscoveryClient`

## 3. 新增OpenFeign

> 使用`OpenFeign`代替`Dubbo`
>
> No service to register for nacos client...

### 1. 创建Provider

1. 新创建一个module名称叫`feign-provider`
2. 添加相关依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    </dependency>
</dependencies>
```

3. 新增一个启动类

```java
@SpringBootApplication
// 启动服务发现
@EnableDiscoveryClient
public class FeignProviderApp {
    public static void main(String[] args) {
        SpringApplication.run(FeignProviderApp.class, args);
    }
}
```

4. 创建一个接口

```java
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/{name}")
    public String username(@PathVariable String name) {
        String str = "Hello," + name;
        System.out.println(str);
        return str;
    }
}
```

5. 创建一个`bootstrap.yml`

```java
server:
  port: 8082
spring:
  application:
	# 记得写这个应用名，不然会导致服务不往Nacos注册
    name: feign-provider
  profiles:
    active: dev
  cloud:
    nacos:
      config:
        server-addr: 192.168.242.130:8848
        prefix: feignProvider
        file-extension: yaml
        group: DEFAULT_GROUP
      discovery:
        server-addr: 192.168.242.130:8848
        group: DEFAULT_GROUP
logging:
  level:
    # feign日志以什么级别监控哪个接口
    net.lesscoding.shop.boot.feign.config.FeignConfig: debug
feign:
  client:
    config:
      default:
        connect-timeout: 5000
        read-timeout: 5000
```



### 2. 创建Consumer

1. 新增一个子模块`feign-consumer`
2. 新增依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-openfeign</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    </dependency>
</dependencies>
```

3. 创建`bootstrap.yml`

```yaml
server:
  port: 8081
spring:
  profiles:
    active: dev
  cloud:
    nacos:
      config:
        server-addr: 192.168.242.130:8848
        prefix: feignConsumer
        file-extension: yaml
        group: DEFAULT_GROUP
      discovery:
        server-addr: 192.168.242.130:8848
        group: DEFAULT_GROUP
  application:
    name: feign-consumer
feign:
  client:
    config:
      default:
        connect-timeout: 5000
        read-timeout: 5000
ribbon:
  ConnectTimeout: 60000 #连接超时时间
  ReadTimeout: 60000 #读超时时间
  MaxAutoRetries: 0 #重试次数
  MaxAutoRetriesNextServer: 1 #切换实例的重试次数
  eureka:
   enabled: false
```

4. 创建启动类

```java
@SpringBootApplication
// 启动Feign
@EnableFeignClients
@EnableDiscoveryClient
public class FeignConsumerApp {
    public static void main(String[] args) {
        SpringApplication.run(FeignConsumerApp.class, args);
    }
}
```

5. 创建一个`FeignClient`

```java
// 这个value就是服务提供者在Nacos注册的id，也就是另外一个module的spring.application.name
// 注意一定要一样，否则会找不到服务
@FeignClient(value = "feign-provider")
public interface FeignRemoterService {
    
    @PostMapping("/user/{name}")
    public String username(@PathVariable String name);
}
```

6. 创建一个接口,使用postman进行测试

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private FeignRemoterService feignRemoterService;

    @PostMapping("/{name}")
    public String username(@PathVariable String name) {
        return feignRemoterService.username(name);
    }
}
```

### 3. 遇到的问题

1. Nacos 2.3.2 及以下版本提示 `No Message available`

> 暂未解决，登录页面有两个404的资源，不知道怎么解决

2. 项目正常启动，但是Nacos 服务管理，服务列表没有注册上

3. 日志提示`No service to register for nacos client...`,服务列表查询不到服务

> 这两个问题呢，有两种可能性。
>
> 1. 项目只添加了`spring-cloud-starter-alibaba-nacos-discovery`依赖，没有添加`spring-boot-starter-web`依赖
>
> ```yaml
> <dependency>
> 	<groupId>org.springframework.boot</groupId>
> 	<artifactId>spring-boot-starter-web</artifactId>
> </dependency>
> ```
>
> 2. 配置文件忘记配置`spring.application.name`
>
> ```yaml
> spring:
>   application:
>     name: feign-provider
> ```
