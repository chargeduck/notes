:::tip
Sentinel

| 维度      | Sentinel                          | Hystrix                      |
|---------|-----------------------------------|------------------------------|
| 隔离策略    | 信号量隔离                             | 线程池隔离/信号量隔离                  |
| 熔断策略    | 慢调用比例或异常比例                        | 失败比例                         |
| 实时指标实现  | 滑动窗口                              | 滑动窗口（基于RxJava)               |
| 规则配置    | 支持多种数据源                           | 支持多种数据源                      |
| 扩展性     | 多个扩展点                             | 插件的形式                        |
| 基于注解的支持 | 支持                                | 支持                           |
| 限流      | 基于 QPS，支持基于调用关系的限流                | 有限的支持                        |
| 流量整形    | 支持慢启动、匀速排队模式                      | 不支持                          |
| 系统自适应保护 | 支持                                | 不支持                          |
| 控制台     | 开箱即用，可配置规则、查看秒级监控、机器发现等           | 不完善                          |
| 常见框架的适配 | Servlet、Spring Cloud、Dubbo、gRPC 等 | Servlet、Spring Cloud Netflix |

:::

# 0. 简介

1. 什么是雪崩问题?

> 微服务之间相互调用，因为调用链中的一个服务故障，引起整个链路都无法访问的情况。

2. 如何避免因瞬间高并发流量而导致服务故障?

> 流量控制

3. 如何避免因服务故障引起的雪崩问题?

> 超时处理 、 线程隔离、熔断机制

## 1. 安装

> [地址](https://github.com/alibaba/Sentinel/releases)
> `使用 java -jar sentinel-dashboard-1.8.8.jar 启动`, 默认的账号密码都是sentinel

## 2. 引入依赖

1. 在想要被监控的服务中引入依赖

> 不知道是不是我写代码的问题，除了这个版本之外，其他的在dashboard都监控不了

```xml

<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
    <version>2.2.2.RELEASE</version>
</dependency>
```

2. 在配置文件中配置

```yaml
spring:
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8080 
```

## 3. 父pom如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>net.lesscoding</groupId>
    <artifactId>sentinel_demo</artifactId>
    <version>1.0</version>
    <modules>
        <module>user-service</module>
        <module>order-service</module>
        <module>eureka-server</module>
        <module>feign-api</module>
        <module>gateway</module>
    </modules>

    <packaging>pom</packaging>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.9.RELEASE</version>
        <relativePath/>
    </parent>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>11</java.version>
        <spring-cloud.version>Hoxton.SR8</spring-cloud.version>
        <mysql.version>5.1.47</mysql.version>
        <mybatis.version>2.1.1</mybatis.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <!-- springCloud -->
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <!--nacos的管理依赖-->
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                <artifactId>spring-cloud-alibaba-dependencies</artifactId>
                <version>2.2.5.RELEASE</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <!-- mysql驱动 -->
            <dependency>
                <groupId>mysql</groupId>
                <artifactId>mysql-connector-java</artifactId>
                <version>${mysql.version}</version>
            </dependency>
            <!--mybatis-->
            <dependency>
                <groupId>org.mybatis.spring.boot</groupId>
                <artifactId>mybatis-spring-boot-starter</artifactId>
                <version>${mybatis.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
    </dependencies>
</project>
```

## x. 报错

1. 启动项目失败

```plantext
Description:

The Bean Validation API is on the classpath but no implementation could be found

Action:

Add an implementation, such as Hibernate Validator, to the classpath
```

> 因为没有指定 @Valid注解的以来项目，所以报错了，不知道为啥。引入下边的依赖就行了

```xml
 <!-- 其他依赖 -->
<dependency>
    <groupId>org.hibernate.validator</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>6.2.5.Final</version>
</dependency> 
```

# 1. 限流

## 1. 簇点链路

> 簇点链路:就是项目内的调用链路，链路中被监控的每个接口就是一个资源。默认情况下sentinel会监控SpringMVC的每一个端点(
> Endpoint)，因此SpringMVC的每一个端点(Endpoint)就是调用链路中的一个资源。
>
>   流控、熔断等都是针对簇点链路中的资源来设置的，因此我们可以点击对应资源后面的按钮来设置规则:

## 2. 流控模式

> 在 `Sentinel` 中,有三种流控模式，分别是:

### 1. 直接模式

> 统计当前资源的请求，触发阈值时对当前资源直接限流，也是默认的模式

### 2. 关联模式

> 统计与当前资源相关的另一个资源，触发阈值时，对当前资源限流
>
> 使用场景: 比如用户支付时需要修改订单状态，同时用户要查询订单。查询和修改操作会争抢数据库锁，产生竞争。

**<font color=red>配置规则: 当前这个规则是对 `/read` 接口进行限流，当`/write` 接口的请求达到阈值时，对 `/read`
接口限流。</font>**

|  维度  |   值    |
|:----:|:------:|
| 资源名  | /read  |
| 流控模式 |   关联   |
| 关联资源 | /write |
| 流控效果 |  快速失败  |

**当满足下列条件时，可以考虑使用关联模式**

1. 两个资源争抢同一个资源，
2. 一个优先级较高，一个优先级较低。

此时优先级高的触发阈值之后，对优先级低的进行限流。

### 3. 链路模式

> 统计从指定链路访问到本资源的请求，触发阈值时，对指定链路限流

下例中 创建了两个接口分别为 `order/query` 和 `order/save`, 两个接口都会调用 `orderService.queryOrder()` 方法，
<font color=red>但是因为 Sentinel 只会监听 Controller的请求，</font>
因此 OrderService.queryOrder() 方法不会被监控。所以需要给需要监控的方法添加 `@SentinelResource` 注解。

1. 创建`OrderController`代码

```java
@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/query")
    public Result queryOrder() {
        orderService.queryOrder();
        System.out.println("查询订单");
        return Result.success("查询订单成功");
    }

    @GetMapping("/save")
    public Result saveOrder() {
        orderService.queryOrder();
        System.out.println("保存订单");
        return Result.success("保存订单成功");
    }
}
```

2. 创建`OrderService`代码

```java
@Service
public class OrderService {
    public void queryOrder() {
        System.out.println("查询订单");
    }
}
```

3. 修改配置文件

> <font color=red> Sentinel默认会将Controller方法做context整合，导致链路模式的流控失效，需要修改application.yml，添加配置</font>

```yaml
spring:
  cloud:
    sentinel:
      web-context-unify: false
```

### 4. 流控效果

> 流控效果: 当触发阈值时，对资源的处理方式

|   效果    |                             描述                             |
|:-------:|:----------------------------------------------------------:|
|  快速失败   |        达到阈值后，新的请求会被立即拒绝并抛出FlowException异常。是默认的处理方式         |
| Warm Up | 预热模式，对超出阈值的请求同样是拒绝并抛出异常。<br/>但这种模式阈值会动态变化，从一个较小值逐渐增加到最大阈值。 |
|  排队等待   |              让所有的请求按照先后次序排队执行，两个请求的间隔不能小于指定时长              |

**Warm Up**

warm up也叫预热模式，是应对服务冷启动的一种方案。
请求阈值初始值是threshold/coldFactor，持续指定时长后，逐渐提高到threshold值。而coldFactor的默认值是3.

例如，我设置QPs的threshold为10，预热时间为5秒，那么初始闽值就是 10/3，也就是3，然后在5秒后逐渐增长到10

**排队等待**

当请求超过QPS阈值时，快速失败和warmup会拒绝新的请求并抛出异常。
而排队等待则是让所有请求进入一个队列中然后按照阈值允许的时间间隔依次执行。
后来的请求必须等待前面执行完成，如果请求预期的等待时间超出最大时长则会被拒绝。

> 不管请求有多大，每秒钟放过的请求数都是固定的。

### 5. 热点参数限流

> 热点参数限流: 针对某个资源的某个参数进行限流，例如针对 `/goods/{id}` 这个资源的 `id` 参数进行限流。
>
> 从左侧的菜单中选择 `热点参数限流` ，然后点击 `添加` 按钮，添加规则。这个比较全面
>
> **<font color=red>需要注意的是，热点参数限流对于默认的SpringMvc资源无效，需要使用@SentinelResource标注才行</font>**

```java
@GetMapping("/goods/{id}")
@SentinelResource("hotGoods")
public Result getGoods(@PathVariable("id") Long id) {
    return Result.success(id);
}
```

# 2. 隔离和降级

## 1. Feign整合Sentinel

>
虽然限流可以尽量避免因高并发而引起的服务故障，但服务还会因为其它原因而故障。而要将这些故障控制在一定范围避免雪崩，就要靠线程隔离(
舱壁模式)和熔断降级手段了。
>
> 不管是线程隔离还是熔断降级，都是对客户端(调用方)
> 的保护。在SpringCloud中，微服务的调用都是通过Feign来实现的，因此客户端保护**<font color=blue>
> 必须要整合Feign和Sentinel</font>**

1. 修改Feign的配置

```yml
feign:
  sentinel:
    enabled: true 
```

2. 给FeignClient编写失败后的降级逻辑
    - FallbackClass: 无法对远程调用的异常处理
    - FallbackFactory: 可以对远程调用的异常处理

> UserClientFallbackFactory 实现了 FallbackFactory 接口，并重写了 create 方法。

``` java
@Slf4j
@Component
public class UserClientFallbackFactory implements FallbackFactory<UserClient> {
    @Override
    public UserClient create(Throwable throwable) {
        return new UserClient() {
            @Override
            public Result<User> getUserById(Long id) {
                log.error("调用用户服务失败", throwable);
                return Result.success(new User());
            }
        };
    }
}
```

> UserClient 接口定义了 getUserById 方法，用于根据用户ID获取用户信息。

```java
@FeignClient(name = "userService",url = "http://localhost:8081", fallbackFactory = UserClientFallbackFactory.class)
public interface UserClient {

    @GetMapping("/user/{id}")
    Result<User> getUserById(@PathVariable Long id);
}
```

> OrderApp 类是一个Spring Boot应用程序的入口点，它使用 @EnableDiscoveryClient 注解启用服务发现功能。

```java
@SpringBootApplication
@EnableFeignClients(clients = { UserClient.class })
@ComponentScan(basePackages = { "net.lesscoding.order", "net.lesscoding.feign" })
public class OrderServiceApp {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApp.class, args);
    }
}
```

## 2. 线程隔离

| 方式                | 优点                | 缺点                  | 适用场景     |
|-------------------|-------------------|---------------------|----------|
| 信号量隔离(Sentinel默认) | 轻量级，无额外开销         | 不支持主动超时<br/>不支持异步调用 | 高频调用，高扇出 |
| 线程池隔离             | 支持主动超时<br/>支持异步调用 | 线程的额外开销较大           | 低扇出      |

### 1. 线程池隔离

```mermaid
graph TD
    clientReq[用户请求]
    subgraph A服务线程池 10
        ReqA[访问A的线程]
    end
    subgraph B服务线程池 5
        ReqB[访问B的线程]
    end
    clientReq --> ReqA
    ReqA --> AFeignClient
    AFeignClient --> ServiceA
    clientReq --> ReqB
    ReqB --> BFeignClient
    BFeignClient --> ServiceB
```

### 2. 信号量隔离

```mermaid
graph TD
    clientReq[用户请求]

    subgraph 信号量计数器 15
        CFeignClient
    end
    clientReq --> CFeignClient
    CFeignClient --> ServiceC
```

## 3. 熔断降级

> 熔断降级是解决雪崩问题的重要手段。其思路是由<font color=red>断路器</font>统计服务调用的异常比例、慢请求比例，
> 如果超出阈值则会<font color=red>熔断</font>该服务。即拦截访问该服务的一切请求;而当服务恢复时，断路器会放行访问该服务的请求。

| 状态          | 描述                                  |
|:------------|:------------------------------------|
| 关闭 Closed   | 默认状态，断路器关闭，所有请求都可以访问                |
| 打开 Open     | 当服务调用异常比例、慢请求比例超出阈值时，断路器打开，所有请求都被拦截 |
| 半开 HalfOpen | 当断路器打开一段时间后，会进入半开状态，此时会放行一部分请求访问服务  |

```mermaid
sequenceDiagram
   participant ClosedState as Closed
   participant OpenState as Open
   participant HalfOpenState as Half - Open
   ClosedState->>ClosedState: Success
   ClosedState->>OpenState: 达到失败阈值
   OpenState->>OpenState: 快速失败
   OpenState->>HalfOpenState: 熔断时间结束,尝试放行一次请求
   HalfOpenState->>OpenState: 请求失败，打开断路器
   HalfOpenState->>ClosedState: 请求成功，关闭断路器
```
### 1. 熔断策略
> 断路器熔断策略有三种: 慢调用，异常比例，异常数

1. 慢调用
> 业务的响应时长(RT)大于指定时长的请求，被认为是慢请求。
> 在指定时间内，如果请求数量超过设定的最小数量，慢调用比例大于设定的阈值，则触发熔断。
> 
> 下方的这个降级规则解释如下：<br/>
> <font color=red>RT超过500ms的调用是慢调用，
> 统计最近10000ms内的请求，如果请求量超过10次，
> 并且慢调用比例不低于0.5则触发熔断，熔断时长为5秒。
> 然后进入half-open状态，放行一次请求做测试。</font>

| 维度   | 值      | 维度    | 值     |
|:-----|:-------|:------|:------|
| 资源名  | /test  | 熔断策略  | 慢调用比例 |
| 最大RT | 500ms  | 比例阈值  | 0.5   |
| 熔断时长 | 5s     | 最小请求数 | 10    |
| 统计时长 | 1000ms |       |       |

2. 异常比例 异常数
> 如果调用次数超过指定请求数，并且出现异常的比例达到设定的比例闽值(或超过指定异常数)，则触发熔断。

# 3. 授权规则
> Sentinel提供了两种授权规则: 白名单和黑名单。
1. 白名单: 来源在白名单中的请求可以访问
2. 黑名单: 来源在黑名单中的请求不可以访问
## 1. 自定义网关授权
> Sentinel 通过 RequestOriginParser 接口来解析请求来源。通过自定义的 origin 来区分Sentinel中的流控应用

```java
public interface RequestOriginParser {
    // 从请求对象中获取origin
    String parseOrigin(HttpServletRequest request);
}
````
> 因此我们可以自定义一个 `RequestOriginParser` 实现类，来解析请求来源。获取请求头中的origin的值

```java
@Component
public class OriginParser implements RequestOriginParser {
    @Override
    public String parseOrigin(HttpServletRequest request) {
        String origin = request.getHeader("origin");
        return StrUtil.isBlank(origin) ? "blank" : origin;
    }
} 
```
> <font color=red>在Gateway可以通过配置，给所有经过网关的请求添加上请求头信息</font>
```yaml
spring:
  cloud:
    gateway:
      default-filters:
        # 添加名为 origin的请求头，值为 gateway
        - AddRequestHeader=origin, gateway
```
## 2. 自定义异常结果
> 默认情况下，发生限流，降级，授权拦截时，都会抛出异常到调用方。<br/>
> 如果要自定义异常返回结果，需要实现 `BlockExceptionHandler` 接口，并重写 handleRequest 方法。

| 异常                   | 描述                 |
|:---------------------|:-------------------|
| BlockException       | 所有的限流，降级，授权拦截异常的父类 |
| FlowException        | 限流异常               |
| DegradeException     | 降级异常               |
| AuthorityException   | 授权异常               |
| ParamFlowException   | 热点参数限流异常           |
| SystemBlockException | 系统规则不满足要求，被流控      |

```java
@Component
public class SentinelBlockHandler implements BlockExceptionHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, BlockException e) throws Exception {

        int status = HttpStatus.TOO_MANY_REQUESTS.value();
        String msg = "未知异常";
        if (e instanceof FlowException) {
            msg = "请求被限流";
        }
        if (e instanceof DegradeException) {
            msg = "请求被降级";
        }

        if (e instanceof ParamFlowException) {
            msg = "热点参数限流";
        }

        if (e instanceof AuthorityException) {
            msg = "授权规则不通过";
            status = 401;
        }

        if (e instanceof SystemBlockException) {
            msg = "系统规则不通过";
        }
        response.setContentType("application/json;charset=utf-8");
        response.setStatus(status);
        Map<String, String> jsonMap = new HashMap<>();
        jsonMap.put("code", String.valueOf(status));
        jsonMap.put("message", msg);
        response.getWriter().println(JSON.toJSONString(jsonMap));
    }
}
```
# 4. 规则持久化
> 规则持久化: 将Sentinel的规则保存到外部存储中，以便在Sentinel重启后可以恢复规则。
## 1. 规则管理模式
> Sentinel提供了三种规则管理模式: 原始模式，pull模式，push模式

| 模式         | 描述                 |
|:-----------|:-------------------|
| 原始模式       | 默认模式，规则保存在内存中，重启后会丢失 |
| pull模式       | 从外部存储中拉取规则，重启后会丢失       |
| push模式       | 将规则推送到外部存储中，重启后会恢复规则   |
 
## 2. pull模式
> 控制台将配置的规则推送到 `Sentinel`客户端，而客户端会将配置规则保存在本地文件或数据库中。
> 以后会定时去本地文件或数据库中查询，更新本地规则。

```mermaid
graph LR 
SD[Sentinel Dashboard]
subgraph App 
    SC[SentinelClient]
    SC--2.内存更新规则-->RM[规则缓存]
    SC--3.持久化-->DB[本地文件或数据库]
end
SD--1.推送规则-->SC
```
## 3. push模式
> 控制台将配置规则推送到远程配置中心，例如Nacos。Sentinel客户端监听Nacos，获取配置变更的推送消息，完成本地配置更新。
```mermaid
graph LR
SD[Sentinel Dashboard] --1.推送规则--> NC[Nacos]
subgraph application
    subgraph Host1 
        sc1[SentinelClient]
    end
   subgraph Host2
      sc2[SentinelClient]
   end
   subgraph Host3
      sc3[SentinelClient]
   end
end
NC--2-->sc1
NC--2-->sc2
NC--2-->sc3
```
# 5. 实现 Push 模式

## 1. 客户端修改
1. 引入依赖
```xml
<dependency>
    <groupId>com.alibaba.csp</groupId>
    <artifactId>sentinel-datasource-nacos</artifactId>
</dependency>
```
2. 修改配置文件
```yaml
spring:
   application:
      name: user_service
   cloud:
      sentinel:
         web-context-unify: true
         transport:
            dashboard: localhost:8080
            port: 8719
         datasource:
            flow:
               nacos:
                  server-addr: localhost:8848
                  dataId: ${spring.application.name}-flow-rules
                  groupId: DEFAULT_GROUP
                  rule-type: flow # 还可以选 degrade,param-flow,system,authority
                  data-type: json
            degrade:
               nacos:
                  server-addr: localhost:8848
                  dataId: ${spring.application.name}-degrade-rules
                  groupId: DEFAULT_GROUP
                  rule-type: degrade # 还可以选 degrade,param-flow,system,authority
                  data-type: json      
```
## 2. 控制台修改

1. 下载 `Sentinel Dashboard` 源码，使用 IDEA 打开
```shell
git clone https://github.com/alibaba/Sentinel.git
```
2. 修改 `sentinel-dashboard` 模块的 `pom.xml` 文件，修改`nacos`依赖
```xml
<dependency>
    <groupId>com.alibaba.csp</groupId>
    <artifactId>sentinel-datasource-nacos</artifactId>
    <!-- 默认这个 scope 是test 只在测试的时候能用，需要注释掉 -->
    <!-- <scope>test</scope> -->
</dependency>
```
3. 在 `sentinel-dashboard` 的 `test`包下，把 `rules/nacos`的代码复制到 `main`下
4. 修改`Sentinel-Dashboard`的`application.properties`及`NacosConfig`类
```properties
nacos.addr=localhost:8848
```
```java
@Configuration
// 只有配置文件有 nacos 前缀才启用配置
@ConfigurationProperties(prefix = "nacos")
public class NacosConfig {

    // 新增 nacos 地址属性
    private String addr;
    public String getAddr() {
        return addr;
    }

    public void setAddr(String addr) {
        this.addr = addr;
    }

    @Bean
    public Converter<List<FlowRuleEntity>, String> flowRuleEntityEncoder() {
        return JSON::toJSONString;
    }

    @Bean
    public Converter<String, List<FlowRuleEntity>> flowRuleEntityDecoder() {
        return s -> JSON.parseArray(s, FlowRuleEntity.class);
    }

    @Bean
    public ConfigService nacosConfigService() throws Exception {
        //return ConfigFactory.createConfigService("localhost");
        return ConfigFactory.createConfigService(addr);
    }
}
```
5. 修改`com.alibaba.csp.sentinel.dashboard.controller.v2.FlowControllerV2`默认的数据源
```java
@RestController
@RequestMapping(value = "/v2/flow")
public class FlowControllerV2 {

    @Autowired
    //@Qualifier("flowRuleDefaultProvider")
    @Qualifier("flowRuleNacosProvider")
    private DynamicRuleProvider<List<FlowRuleEntity>> ruleProvider;
    
    @Autowired
    //@Qualifier("flowRuleDefaultPublisher")
    @Qualifier("flowRuleNacosPublisher")
    private DynamicRulePublisher<List<FlowRuleEntity>> rulePublisher;
}
```
6. 修改 `src/main/webapp/resources/app/scripts/directives/sidebar/sidebar.html`, 放开下边的注释
```html
<!--<li ui-sref-active="active" ng-if="entry.appType==0">-->
  <!--<a ui-sref="dashboard.flow({app: entry.app})">-->
  <!--<i class="glyphicon glyphicon-filter"></i>&nbsp;&nbsp;流控规则 V1</a>-->
<!--</li>-->
```
改成下边的文字
```html
<li ui-sref-active="active" ng-if="entry.appType==0">
  <a ui-sref="dashboard.flow({app: entry.app})">
    <i class="glyphicon glyphicon-filter"/>&nbsp;&nbsp;流控规则 Nacos
  </a>
</li>
```
7. 打包 `sentinel-dashboard` 模块跳过测试，
8. 清空 8080 页面缓存并重新加载，可以看到 `流控规则 Nacos` 选项
9. 在 `流控规则 Nacos` 页面，点击 `新增` 按钮，添加规则
10. 每一个规则都需要修改一个 Nacos的页面 ，十分麻烦
