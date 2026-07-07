:::tip
Neo4j 整合 SpringBoot
:::
# 1. 创建项目安装依赖
1. pom.xml
```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.17</version>
  </parent>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.13.2</version>
      <scope>test</scope>
    </dependency>
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-web</artifactId>
      </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-neo4j</artifactId>
    </dependency>
  </dependencies>
```
2. application.yml
```yaml
server:
  port: 8888
spring:
  neo4j:
    uri: bolt://localhost:7687
    authentication:
      username: neo4j
      password: neo4j123
```
# 2.  相关配置
## 1. 创建节点 @Node

```java
@Data
@Node(labels = "Person")
public class Person implements Serializable {
    // Neo4j节点的主键
    @Id
    @GeneratedValue
    private Long id;
    // Neo4j节点的属性
    @Property
    private String name;
}
```

# # 2.创建Repository

```java
@Repository
public interface PersonRepository extends Neo4jRepository<Person, Long> {
}
```

