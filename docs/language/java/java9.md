::: tip
记录一些java9的新特性
:::
# 1. 模块化
> 在包的基础上，多了一个`module-info.java`，可以导出和引入包

```java
module net.lesscoding {
    exports net.lesscoding.entity;
}
```

```java
module net.lesscoding {
    requires net.lesscoding.entity;
}
```
# 2. REPL
> 交互式命令行（Read-Eval-Print Loop），可以直接运行java代码 ，直接运行jshell

# 3. 多版本兼容Jar包
> 多版本兼容jar 功能能让你创建仅在特定版本的 Java 环境中运行库程序选择使用的 class 版本。
> 
> 好像是需要再MAINFEST.MF文件中添加`Multi-Release`属性

# 4. 语法改进
## 1. 接口私有方法
> 接口中可以定义私有方法，可以把接口的一些通用逻辑封装起来，避免重复代码
```java
public interface TestInterface {
    private static void method() {
        System.out.println("method");
    }
}
```
## 2. try-catch 改善
> 在java8中，可以使用try-with-resources 来简化资源的关闭，
> 
> 但是在java9中，try-catch 可以直接使用已经实例化的资源对象，没感觉有啥好的啊。
- java8
```java
try (InputStream in = new FileInputStream("test.txt")) {
    // do something
} catch (IOException e) {
    e.printStackTrace();
}
```
- java 9
```java
InputStream in = new FileInputStream("test.txt")
try (in) {
    // 此时in是 final 的, 不可更改
    // do something
} catch (IOException e) {
    e.printStackTrace();
}
```
## 3. UnderScore 下划线使用限制
> 在java8中，下划线可以独立使用给变量命令，但是在java9中，下划线只能用于数字的分隔，不能用于变量名的分隔

- java8
```java
String _ = "Hello";
System.out.println(_);
```
- java9
```java
// 这个在java8也可以的
int num = 1_000_000;
```
## 4. String 存储结构变更
> 在java8中，String 是由char数组来存储的，但是在java9中，String 是由byte数组来存储的，这样可以减少内存占用
## 5. 只读集合
```java
Set.of(1,2,3);
List.of(1,2,3);
// 奇数为key，偶数为value
Map.of(1,2,3，4);
Map.ofEntries(Map.entry(1,2),Map.entry(3,4));
```
## 6. 增强Stream API
> 在 java9 中, Stream 接口中添加了4个新的方法:dropWhile,takeWhile,ofNullable，
> 
> 还有个 iterate 方法的新重载方法，可以让你提供一个 Predicate(判断条件)来指定什么时候结束迭代。
> 
> 除了对 Stream 本身的扩展，Optional 和 Stream 之间的结合也得到了改进。现在可以通过 Optional 的新方法 stream()将一个Optional 对象转换为一个(可能是空的) stream 对象。

1. dropWhile
> 过滤掉前面的元素，直到第一个不满足条件的元素出现时开始
```java
List<Integer> list = Arrays.asList(45, 67, 123, 456, 7, 12, 344, 6, 78);
// 123, 456, 7, 12, 344, 6, 78
list.stream()
        .dropWhile(item -> item < 100)
        .forEach(System.out::println);
```
2. takeWhile
> 与filter 类似，但是会在第一个不满足条件的元素时停止遍历，而filter 会遍历所有元素
>
> 与dropWhile 相反
```java
List<Integer> list = Arrays.asList(45, 67, 123, 456, 7, 12, 344, 6, 78);
// 45 , 67
list.stream()
        .takeWhile(item -> item < 100)
        .forEach(System.out::println);
```
3. ofNullable
```java
Stream.of(1, 2, 3, null).forEach(System.out::println);
// 空流
Stream.ofNullable(null).forEach(System.out::println);
// 只有单个元素不能为null
Stream.of( null).forEach(System.out::println);
```
4. iterate
> 可以不使用limit 来限制流的大小，直接指定一个判断条件来指定什么时候结束迭代
```java
// 原来的写法
Stream.iterate(0, x -> x + 2)
        .limit(100)
        .forEach(System.out::println);
// 新的写法, 可以指定范围
Stream.iterate(0, range -> range < 100, range -> range + 2)
       .forEach(System.out::println);
```
5. Optional
> 相当与是把list扁平化处理，每个元素都变成一个stream，然后再合并成一个stream
```java 
// 没有flatMap就是 [1,2,3] 有flatMap就是 1,2,3
List<Integer> list = new ArrayList<>();
Collections.addAll(list, 1,2,3);
Optional.ofNullable(list)
        .stream()
        .flatMap(Collection::stream)
        .forEach(System.out::println);
```

