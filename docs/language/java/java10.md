::: tip
记录一些java10的新特性
:::

# 1. 局部类型推断
> 局部变量的类型可以由编译器推断出来，而不需要显式地声明类型。

有以下几种类型不可以推算
1. 初始化变量未赋值
2. lambda表达式
3. 方法引用
4. 数组的静态初始化中 `var arr = {1,2,3,4};`
5. 方法的返回类型和参数类型
6. 构造方法的参数类型
7. 类属性


```java
var num = 10;
var list = new ArrayList<Integer>();
Collections.addAll(list, 1, 2, 3);
for (var i : list) {
    System.out.println(i);
}
```
# 2. copyOf
> 集合中新增的`copyof()`方法，用于创建一个只读集合.

```java
var list = new ArrayList<Integer>();
Collections.addAll(list, 1, 2, 3);
List<Integer> result = List.copyOf(list);
// java.util.ImmutableCollections$ListN
System.out.println(result.getClass().getName());
```
> 如果copyOf的参数是一个可变集合，那么返回的是一个不可变集合。
> 如果本来就是不可变集合，则返回当前的不可变集合
```java
var list1 = new ArrayList<Integer>();
list1.add(1);
var list2 = List.copyOf(list1);
System.out.println(list1 == list2); // false

var list3 = List.of(1, 2, 3);
var list4 = List.copyOf(list3);
System.out.println(list3 == list4); // true
```
# 3. 复制文件 transferTo
> 复制文件的方法，`transferTo()`方法，用于将一个文件的内容复制到另一个文件中。
> 相较于之前的while循环，更加简洁。实际上进入到方法内部，也是通过while循环实现的。

```java
try (var fr = new FileReader("a.txt");
     var fw = new FileWriter("b.txt")) {
    fr.transferTo(fw);
} catch (Exception e) {
    e.printStackTrace();
}
```
> 当然了也可以使用NIO的方式实现。底层用零拷贝实现。
```java 
try (var fic = new FileInputStream("test.txt").getChannel();
     var foc = new FileOutputStream("test.txt").getChannel()) {
    fic.transferTo(0, fic.size(), foc);
} catch (Exception e) {
    e.printStackTrace();
}
```
