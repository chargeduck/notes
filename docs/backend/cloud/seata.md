:::tip
Seata 是一款开源的分布式事务解决方案，支持 TCC、XA 和 AT 模式。<br/>
事务的ACID原则如下

| 属性     | 含义                                |
|:-------|:----------------------------------|
| 原子性  A | 事务是不可分割的最小工作单元，要么全部提交成功，要么全部失败回滚。 |
| 一致性  C | 数据库总是从一个一致性的状态转换到另一个一致性的状态。       |
| 隔离性  I | 一个事务的执行不能被其他事务干扰。                 |
| 持久性  D | 一旦事务提交，则其所做的修改就会永久保存到数据库中。        |
:::
# 1. 分布式事务简介
> 在分布式系统下，一个业务跨越多个服务或数据源，每个服务都是一个分支事务，要保证所有分支事务最终状态一致，这样的事务就是分布式事务。

## 1. CAP原理
> CAP原理是分布式系统设计中的一个重要理论，它描述了在分布式系统中，只能同时满足一致性（Consistency）、可用性（Availability）和分区容错性（Partition Tolerance）中的两个。

| 特性     | 含义                                |
|:-------|:----------------------------------|
| 一致性  C | 分布式系统中的所有节点在同一时间具有相同的数据状态。 |
| 可用性  A | 分布式系统在面对故障时，能够继续提供服务，即系统始终可用。 |
| 分区容错性  P | 分布式系统在遇到网络分区（网络断开）时，仍然能够继续提供服务。 |

## 2. BASE理论
> BASE 理论是对CAP的一种解决思路，它认为分布式系统中，一致性和可用性是不可兼得的，因此可以通过牺牲一致性来换取可用性。

| 特性     | 含义                                |
|:-------|:----------------------------------|
| 基本可用  Basically Available | 分布式系统在出现故障时，允许损失部分可用性，保证核心可用。 |
| 软状态  Soft State | 分布式系统中的数据存在中间状态，允许数据在不同节点之间存在不一致。 |
| 最终一致性  Eventually Consistent | 分布式系统中的数据最终会达到一致状态，但中间过程可能存在延迟。 |

## 3. 如何选择CP和AP
> 分布式事务最大的问题就是各个子事务之间的一致性问题，因此可以借鉴CAP和BASE理论，通过牺牲一致性来换取可用性，从而实现分布式事务的最终一致性。

| 模式   | 含义 |
|:-----|:---|
| AP模式| 各子事务分别执行和提交，允许出现结果不一致，然后采用弥补措施恢复数据即可，实现最终一致。   |
| CP模式| 各个子事务执行后互相等待，同时提交，同时回滚，达成强一致。但事务等待过程中，处于弱可用状态，   |

# 2. Seata
## 1. 简介
> 在Seata中有三个重要的概念

| 概念                                | 含义                                |
|:----------------------------------|:----------------------------------|
| TC 事务协调器(Transaction Coordinator) | 管理全局事务的状态，协调各个分支事务的提交或回滚。 |
| TM 事务管理器(Transaction Manager)     | 管理本地事务，负责开启、提交、回滚本地事务。 |
| RM 资源管理器(Resource Manager)        | 管理分支事务的资源，负责提交、回滚分支事务。 |

> Seata提供了四种不同的分布式事务解决方案

| 模式            | 描述                       |
|:--------------|:-------------------------|
| AT模式(Seata默认） | 最终一致的分阶段事务模式，无业务侵入       |
| XA模式          | 强一致性分阶段事务，牺牲一定的可用性，无业务侵入 |
| TCC模式         | 最终一致的分阶段事务内模式，有业务侵入      |
| SAGA模式        | 长事务，有业务侵入                |

## 2. 部署TC
1. [下载 Seata的 TcServer 服务](https://seata.apache.org/zh-cn/download/seata-server)
2. 修改配置文件`seata-server\conf\application.yml`, 完整配置在 `application.example.yml`
```yaml
server:
  port: 7091

spring:
  application:
    name: seata-server

logging:
  config: classpath:logback-spring.xml
  file:
    path: ${log.home:${user.home}/logs/seata}
  extend:
    logstash-appender:
      destination: 127.0.0.1:4560
    kafka-appender:
      bootstrap-servers: 127.0.0.1:9092
      topic: logback_to_logstash

console:
  user:
    username: seata
    password: seata
seata:
  config:
    # support: nacos, consul, apollo, zk, etcd3
    type: nacos
    nacos:
      server-addr: localhost:8848
      namespace: ""
      group: SEATA_GROUP
      username: nacos
      password: nacos
      data-id: "seataTcServer.yaml"
  registry:
    # support: nacos, eureka, redis, zk, consul, etcd3, sofa
    type: nacos
    nacos:
      server-addr: localhost:8848
      namespace: ""
      group: SEATA_GROUP
      application: seata-tc-server
      username: nacos
      password: nacos
    #store:
    # support: file 、 db 、 redis 、 raft
    #mode: file
  #  server:
  #    service-port: 8091 #If not configured, the default is '${server.port} + 1000'
  security:
    secretKey: SeataSecretKey0c382ef121d778043159209298fd40bf3850a017
    tokenValidityInMilliseconds: 1800000
    csrf-ignore-urls: /metadata/v1/**
    ignore:
      urls: /,/**/*.css,/**/*.js,/**/*.html,/**/*.map,/**/*.svg,/**/*.png,/**/*.jpeg,/**/*.ico,/api/v1/auth/login,/version.json,/health,/error,/vgroup/v1/** 
```
3. 在Nacos创建配置 `seataTcServer.yaml`
```yaml
seata:
  mode: db
  db:
    datasource: druid
    db-type: mysql
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://127.0.0.1:3306/seata?rewriteBatchedStatements=true
    user: mysql
    password: mysql
    min-conn: 10
    max-conn: 100
    global-table: global_table
    branch-table: branch_table
    lock-table: lock_table
    distributed-lock-table: distributed_lock
    vgroup-table: vgroup_table
    query-limit: 1000
    max-wait: 5000
server:
  recovery:
    committingRetryPeriod: 1000
    asyncCommittingRetryPeriod: 1000
    rollbackingRetryPeriod: 1000
    timeoutRetryPeriod: 1000
  maxCommitRetryTimeout: -1
  maxRollbackRetryTimeout: -1
  rollbackRetryTimeoutUnlockEnable: false
  undo:
    logSaveDays: 7
    logDeletePeriod: 86400000
```
4. 将`\seata-server\script\server\mysql.sql`导入到自己的数据库中
5. 启动`seata-server\bin\seata-server.bat`
6. 访问 [管理页面 http://127.0.0.1:7091](http://127.0.0.1:7091)
7. 默认账号密码 seata / seata


## 3. 微服务集成Seata
1. 引入依赖
```xml
<dependency>
    <groupId>org.apache.seata</groupId>
    <artifactId>seata-spring-boot-starter</artifactId>
    <version>2.3.0</version>
</dependency>
```
2. 添加配置，<font color=red>这种公用的直接放到 shared共享的配置中即可</font>
```yaml
seata:
  registry:
    type: nacos
    nacos:
      server-addr: localhost:8848
      namespace: ""
      group: SEATA_GROUP
      # seata TC 在 nacos中的名字
      application: seata-tc-server
  # 事务组，根据这个获取 TC 服务的 cluster 名称
  tx-service-group: seata-demo
  service:
    vgroup-mapping:
      # TC 的 cluster 名称
      seata-demo: default 
```
3. 查看TC服务器日志, 出现如下信息`RM register success`表示注册成功
```text
RM register success,message:RegisterRMRequest{resourceIds='jdbc:mysql:///seata_demo', version='2.3.0', applicationId='storage-service', transactionServiceGroup='seata-demo', extraData='null'},channel:[id: 0x358177c9, L:/192.168.159.1:8091 - R:/192.168.159.1:57047],client version:2.3.0
```

### x. 错误排查
1. Caused by: java.lang.IllegalStateException: in AT mode, undo_log table not exist
> 在 AT 模式下，undo_log 表不存在。
```sql
CREATE TABLE undo_log (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  branch_id bigint(20) NOT NULL,
  xid varchar(100) NOT NULL,
  context varchar(128) NOT NULL,
  rollback_info longblob NOT NULL,
  log_status int(11) NOT NULL,
  log_created datetime NOT NULL,
  log_modified datetime NOT NULL,
  ext varchar(100) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY ux_undo_log (xid,branch_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```
# 3. 四种模式
## 1. XA模式
> XA规范是X/Open组织定义的分布式事务处理(DTP，Distributed Transaction processing)标准，XA规范 描述了全局的TM与局部的RM之间的接口，几乎所有主流的数据库都对XA规范 提供了支持<br/>

|| 描述                                                        |
|:---|:----------------------------------------------------------|
|优点| **<font color=red>强一致性，满足ACID原则，常见数据库都支持，且没有代码侵入</font>** |
|缺点| 一阶段要锁定数据库资源，等待二阶段结束才能能够释放，性能较差。<br/>依赖关系型数据库实现事务          |

当前模式下，将事务分为两个阶段

1. 第一阶段：准备阶段
   - 事务管理器(TC)向所有资源管理器(RM)发送准备请求(prepare)，资源管理器执行本地事务，并记录本地事务的状态。
   - 如果所有资源管理器都准备成功(ready)，则事务管理器向所有资源管理器发送提交请求，资源管理器提交(Commit)本地事务。
   - 如果任何一个资源管理器准备失败(fail)，则事务管理器向所有资源管理器发送回滚请求，资源管理器回滚(Fallback)本地事务。

**Seat做出了一些调整**
- RM 一阶段
  1. 注册分支事务到TC
  2. 执行分支业务Sql但不提交
  3. 报告执行状态到TC
- TC 二阶段
  1. 检查各个分支的事务执行状态
  2. 如果都成功，则通知所有的RM提交
  3. 如果有失败，则通知所有的RM回滚
- RM 二阶段
  1. 提交或回滚本地事务
![image-20250418170035454](http://upyuncdn.lesscoding.net/image-20250418170035454.png)
