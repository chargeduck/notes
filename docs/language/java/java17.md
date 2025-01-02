::: tip
JDK 17特性,好像都大差不差的
:::
# 1. switch改动(JDK14)
> 这个特性在12 13都是预览版本，直到14才算是正是支持，<br/>
> 支持返回数据，且支持case多个条件 
```java
var name = "泗水亭长";
String alias = switch (name) {
    case "周瑜" -> "公瑾";
    case "徐庶" -> "元直";
    case "项羽" -> "楚霸王";
    case "刘邦", "泗水亭长" -> " 汉高祖 ";
    default -> "未知";
};
System.out.println(alias);
```
# 2. 多行字符串处理(JDK15)

```java
String str = """
<html>
    <body>
        <h1>java17中对于多行字符串的处理</h1>
    </body>
<html>
""";
System.out.println(str);        
```

# 3. instanceof 改进（JDK16）
> 如果属于后边的类的划，可以直接创建一个该类的临时变量
```java 
Object obj = 10;
if (obj instanceof Integer num) {
    System.out.println(num);
}
if (obj instanceof String str) {
    System.out.println(str.charAt(0));
}
```
# 4. 密封类 (Sealed class)
> 密封类必须通过 permits 指定可以继承它的子类，且子类只能是 final(不可继承) 或者 non-sealed(可继承)两种类型<br>
> 这样做的好处是可以让类层次结构更加清晰、可预测，同时也有助于在设计框架等场景下对继承体系进行严格的控制，避免随意的扩展破坏原有的设计逻辑。
- Animal
```java
public abstract sealed class Animal permits Dog, Cat{}
```
- Dog
```java 
public final class Dog extends Animal{}
```
- Cat
```java 
public non-sealed class Cat extends Animal{}
```
# 5. Record 类
> 只读对象，只有get方法，没有set方法. 且如果参数都一样的话，返回的就是一个对象。

```java 
public record User(String name, Integer age) {}
// 只能获取不能修改
User user = new User("eleven", 18);
User user2 = new User("eleven", 18);
System.out.println(user.age());
System.out.println(user.name());
System.out.println(user.equals(user2)); // true
```
# 6. 优化空指针异常
> 能够知道具体哪里出现了空指针异常
