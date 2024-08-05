::: tip
多数据源的配置
:::

# 1. 新增多数据源依赖
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>dynamic_test</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>dynamic_test</name>
    <url>http://maven.apache.org</url>

    <properties>
        <java.version>11</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <spring-boot.version>2.3.3.RELEASE</spring-boot.version>
        <spring-cloud.version>Hoxton.SR11</spring-cloud.version>
        <nacos.version>2.2.0.RELEASE</nacos.version>
        <dynamic.version>4.3.1</dynamic.version>
        <durid.version>1.2.20</durid.version>
        <mysql.version>8.0.33</mysql.version>
        <mybatis-plus.version>3.5.3.1</mybatis-plus.version>
        <hutool.version>5.8.27</hutool.version>
        <junit.version>4.13.2</junit.version>
    </properties>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.3.RELEASE</version>
    </parent>
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
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
        </dependency>
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>${mybatis-plus.version}</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>${mysql.version}</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>${durid.version}</version>
        </dependency>
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>dynamic-datasource-spring-boot-starter</artifactId>
            <version>${dynamic.version}</version>
        </dependency>
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>${hutool.version}</version>
        </dependency>
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <mainClass>net.lesscoding.MainApp</mainClass>
                </configuration>
                <executions>
                    <execution>
                        <goals>
                            <goal>build-info</goal>
                        </goals>
                    </execution>
                </executions>
                <version>1.4.2.RELEASE</version>
            </plugin>
            <plugin>
                <groupId>org.sonarsource.scanner.maven</groupId>
                <artifactId>sonar-maven-plugin</artifactId>
                <version>3.2</version>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-resources-plugin</artifactId>
                <configuration>
                    <nonFilteredFileExtensions>
                        <!-- 避免 https 证书文件被修改 -->
                        <nonFilteredFileExtension>jks</nonFilteredFileExtension>
                    </nonFilteredFileExtensions>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                </configuration>
            </plugin>
        </plugins>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
            </resource>
        </resources>
    </build>
</project>

```

# 2. 添加多数据源配置
> 我记得以前整合连接池随便看的，结果今天一点要收费29.9果断放弃！
```yaml
spring:
  application:
    name: dynamicDatasourceTest
  datasource:
    dynamic:
      primary: primary # 默认数据源
      datasource:
        primary: # 这的kingbase是自定义的数据源名称，不是指数据库的类型
          url: jdbc:mysql://127.0.0.1:3306/cila_baking?serverTimezone=UTC
          username: root
          password: dream
          driverClassName: com.mysql.cj.jdbc.Driver
        slave:
          url: jdbc:mysql://127.0.0.1:3306/cila_handmade?serverTimezone=UTC
          username: root
          password: dream
          driverClassName: com.mysql.cj.jdbc.Driver
    # durid的配置，我记的以前的官网文档不用花钱来着，现在需要花钱了，随便写了写     
    druid:
      min-idle: 10
      max-active: 20
      max-wait: 10000

```
# 3. 代码

## 1. 启动类
```java
package net.lesscoding;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author eleven
 * @date 2024/8/5 14:55
 * @apiNote
 */
@SpringBootApplication
@MapperScan("net.lesscoding.dao")
public class MainApp {
    public static void main(String[] args) {
        SpringApplication.run(MainApp.class, args);
    }

}

```
## 2. Mapper
```java
package net.lesscoding.dao;

import com.baomidou.dynamic.datasource.annotation.DS;
import net.lesscoding.entity.SysCategory;
import net.lesscoding.entity.SysDict;
import net.lesscoding.entity.SysUser;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @author eleven
 * @date 2024/8/5 15:15
 * @apiNote
 */
public interface DictMapper {
    @DS("slave")
    @Select("select * from sys_category")
    public List<SysCategory> categoryList();

    @DS("primary")
    @Select("select * from sys_dict")
    public List<SysDict> dictList();

    @Select("select * from sys_user")
    public List<SysUser> userList();
}

```

## 3. 测试接口

```java
package net.lesscoding.controller;

import lombok.extern.slf4j.Slf4j;
import net.lesscoding.dao.DictMapper;
import net.lesscoding.entity.SysCategory;
import net.lesscoding.entity.SysDict;
import net.lesscoding.entity.SysUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author eleven
 * @date 2024/8/5 15:21
 * @apiNote
 */
@RestController
@Slf4j
public class TestController {

    @Autowired
    private DictMapper dictMapper;

    @GetMapping("/test")
    public void test() {
        List<SysDict> dictList = dictMapper.dictList();
        log.info("primary Dict: {}", dictList);
        List<SysCategory> categoryList = dictMapper.categoryList();
        log.info("salve Category: {}", categoryList);
        List<SysUser> userList = dictMapper.userList();
        log.info("primary User: {}", userList);
    }
}

```
