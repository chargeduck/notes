# 0. 简介
> 当前项目笔记来源于 [工作流大合集](https://www.bilibili.com/video/BV1PY411F7ir)
# 1. 创建项目
就是创建一个普通的maven项目
1. 添加下列依赖
```xml
<dependencies>
    <dependency>
      <groupId>org.flowable</groupId>
      <artifactId>flowable-engine</artifactId>
      <version>6.3.0</version>
    </dependency>
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>8.0.33</version>
    </dependency>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.13.2</version>
      <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>1.7.36</version>
    </dependency>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-log4j12</artifactId>
        <version>1.7.36</version>
    </dependency>
  </dependencies>
```
2. 创建日志文件
> 在`resource`文件夹下创建`log4j.properties`
```properties
log4j.rootLogger=DEBUG, CA
log4j.appender.CA=org.apache.log4j.ConsoleAppender
log4j.appender.CA.layout=org.apache.log4j.PatternLayout
log4j.appender.CA.layout.ConversionPattern= %d{hh:mm:ss,SSS} [%t] %-5p %c %x - %m%n
```
3. 创建测试类
> 启动这个代码之后，会自动在数据库当中创建34张表
```java
package net.lesscoding;

import org.flowable.engine.ProcessEngine;
import org.flowable.engine.ProcessEngineConfiguration;
import org.flowable.engine.impl.cfg.StandaloneProcessEngineConfiguration;
import org.junit.Test;

/**
 * @author eleven
 * @date 2023/12/24 20:01
 * @apiNote
 */
public class EngineTest {

    @Test
    public void testProcessEngine() {
        //
        ProcessEngineConfiguration configuration = new StandaloneProcessEngineConfiguration();
        // 配置 相关数据库配置
        configuration.setJdbcDriver("com.mysql.cj.jdbc.Driver");
        configuration.setJdbcPassword("dream");
        configuration.setJdbcUsername("root");
        configuration.setJdbcUrl("jdbc:mysql:///flowable_test?serverTimezone=UTC");
        // 如果数据库没有表结构就自动创建
        configuration.setDatabaseSchemaUpdate(ProcessEngineConfiguration.DB_SCHEMA_UPDATE_TRUE);
        // 通过ProcessEngineConfiguration构建ProcessEngine对象
        ProcessEngine processEngine = configuration.buildProcessEngine();

    }
}
```
这个代码在`mysql8.0`当中可能会出现下列错误
```text
Caused by: java.sql.SQLSyntaxErrorException (create breakpoint : Table 'flowable_test.act_ge_property' doesn't exist
    at com.mysql.cj.jdbc.exceptions.SOLError.createSQLException(SQLError.java:120)
    at com.mysql.cj.jdbc.exceptions.SQLError.createSQLException(SQLError.java:97)
    at com.mysql.cj.jdbc.exceptions.SQLExceptionsMapping.translateException(SQLExceptionsMapping.java:122)
    at com.mysql.cj.jdbc.ClientPreparedStatement,executeInternal(ClientPreparedStatement.java:953)
    at com.mysql.cj.jdbc.ClientPreparedStatement,execute(ClientPreparedStatement,java:370) <4 internal lines>
```
出现这种情况只需要在mysql的连接字符串中添加上nullCatalogMeansCurrent=true，设置为只查当前连接的schema库即可

```java
ProcessEngineConfiguration configuration = new StandaloneProcessEngineConfiguration();
        // 配置 相关数据库配置
        configuration.setJdbcDriver("com.mysql.cj.jdbc.Driver")
                .setJdbcPassword("dream")
                .setJdbcUsername("root")
                .setJdbcUrl("jdbc:mysql:///flowable_test?serverTimezone=UTC&nullCatalogMeansCurrent=true");
```
