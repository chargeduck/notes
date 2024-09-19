::: tip
记录一下SpringBoot跨域配置，今天整个SpringCloudGateway的时候跨域出现了一些问题，特地记录一下
:::

# 1. 单体应用跨域配置
> SpringBoot应用配置跨域有两种方式，我知道的有两种。
> 我平时用的是第二种

1. 自定义一个CorsConfig
```java 
 package net.lesscoding.cila.config;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.HashMap;

/**
 * @author eleven
 * @date 2022/11/12 14:42
 * @apiNote 跨域配置 通过gateway代理的不需要此配置
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter(){
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedMethod("*");
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        HashMap<String,CorsConfiguration> corsMap = new HashMap<>();
        corsMap.put("/**",config);
        source.setCorsConfigurations(corsMap);
        return new CorsFilter(source);
    }
}

```
2. 实现`WebMvcConfigurer`接口
```java 
package net.lesscoding.cila.config;

import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.router.SaRouter;
import cn.dev33.satoken.stp.StpUtil;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author eleven
 * @date 2022/11/12 16:28
 * @apiNote
 */
@Configuration
public class MyWebMvcConfig implements WebMvcConfigurer {

    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedHeaders("*")
                .allowedMethods("*")
                .maxAge(1800)
                .allowedOrigins("*");
   }
}     
```
# 2. Gateway跨域配置
> 今天想把代码改成gateway代理的，但是在跨域配置上再了个跟头。
> 主要就是**<font color=red>在`gateway`配置了跨域之后，就不许要在后续的代码中配置跨域了</font>**
> 这个以前还真是不知道，小地方没怎么用过gateway，上次用还是四年前，现在已经完全忘了。
## 1. 添加依赖
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>net.lesscoding</groupId>
    <artifactId>gateway-app</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>gateway-app</name>
    <packaging>jar</packaging>

    <properties>
        <java.version>11</java.version>
        <spring-boot.version>2.3.3.RELEASE</spring-boot.version>
        <spring-cloud.version>Hoxton.SR11</spring-cloud.version>
        <nacos.version>2.2.0.RELEASE</nacos.version>
        <reactor-netty.version>0.9.15.RELEASE</reactor-netty.version>
    </properties>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.3.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-gateway</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-loadbalancer</artifactId>
        </dependency>
        <dependency>
            <groupId>io.projectreactor.netty</groupId>
            <artifactId>reactor-netty</artifactId>
            <version>${reactor-netty.version}</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
            <version>${nacos.version}</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
            <version>${nacos.version}</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

    <repositories>
        <repository>
            <id>aliyun</id>
            <name>aliyun</name>
            <url>https://maven.aliyun.com/repository/public</url>
        </repository>
    </repositories>

</project>
```
## 2. 配置
1. 通过yaml配置
```yaml
 server:
   port: 9999
 spring:
   application:
     name: gateway-app
   cloud:
     nacos:
       config:
         server-addr: 127.0.0.1:8848
         namespace: public
         file-extension: yaml
       discovery:
         server-addr: 127.0.0.1:8848
         # 可以设置在nacos注册服务的ip地址
         #ip: 192.168.1.111
     gateway:
       routes:
         - id: cila_baking_route
           # 调用nacos的服务，不能有_-否则会调用失败
           uri: lb://cilaBaking
           predicates:
             - Path=/cilaBaking/**
         - id: chargeduck_route
           uri: lb://chargeDuck/**
           predicates:
             - Path=/chargeDuck/**
         - id: dld_route
           uri: lb://dld
           predicates:
             - Path=/dld/**
       # 全局的跨域处理
       globalcors:
         # 解决options请求被拦截问题
         add-to-simple-url-handler-mapping: true
         corsConfigurations:
           '[/**]':
             # 允许哪些网站的跨域请求
             allowedOrigins:
               - "*"
             allowedMethods: # 允许的跨域ajax的请求方式
               - "GET"
               - "POST"
               - "DELETE"
               - "PUT"
               - "OPTIONS"
               - "*"
             # 允许在请求中携带的头信息
             allowedHeaders: "*"
             # 是否允许携带cookie
             allowCredentials: true
             # 这次跨域检测的有效期
             maxAge: 360000
```
2. 通过代码设置
```java 
 package net.lesscoding.gateway.config;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.reactive.CorsUtils;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

/**
 * 跨域 Filter
 *
 * @author z.h.z
 */
@Component
public class CorsFilter implements WebFilter {

    private static final String ALL = "*";
    private static final String MAX_AGE = "3600L";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // 非跨域请求，直接放行
        ServerHttpRequest request = exchange.getRequest();
        if (!CorsUtils.isCorsRequest(request)) {
            return chain.filter(exchange);
        }

        // 设置跨域响应头
        ServerHttpResponse response = exchange.getResponse();
        HttpHeaders headers = response.getHeaders();
        headers.add("Access-Control-Allow-Origin", ALL);
        headers.add("Access-Control-Allow-Methods", ALL);
        headers.add("Access-Control-Allow-Headers", ALL);
        headers.add("Access-Control-Max-Age", MAX_AGE);
        if (request.getMethod() == HttpMethod.OPTIONS) {
            response.setStatusCode(HttpStatus.OK);
            return Mono.empty();
        }
        return chain.filter(exchange);
    }

}

```

# 3. [前端Vue配置proxyTable](/frontend/utils/corsConfig)
