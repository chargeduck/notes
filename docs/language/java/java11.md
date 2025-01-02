:::tip
记录一些java11的新特性
:::

# 1. String新增方法

|       方法        |       描述        |
|:---------------:|:---------------:|
|    isBlank()    | 判断字符串是否为空或者只有空格 |
|     strip()     |   去除字符串前后的空格    |
| stripLeading()  |   去除字符串前面的空格    |
| stripTrailing() |   去除字符串后面的空格    |
|     lines()     |    将字符串分割成多行    |
|    repeat()     |      重复字符串      |

```java
System.out.println("\n\n\r\n".isBlank()); // true
String str = "\n\r\tabc\t\t\t";
// 这两个都会输出abc 但是strip能够出去全角空格，更符合国际化的要求
System.out.println(str.strip());
System.out.println(str.trim());
System.out.println(str.stripTrailing());
System.out.println(str.stripLeading());
System.out.println("hello".repeat(2)); // "hellohello"
var str2 = "hello\nworld\r\n!";
System.out.println(str2.lines().count());//3 hello world !
```

# 2. Optional增强

|                                 方法                                 |                       描述                       | 版本 |
|:------------------------------------------------------------------:|:----------------------------------------------:|:--:|
|                         `boolean isEmpty()`                          |                  判断value是否为空                   | 11 |
| `ifPresentOrElse(Consumer<? super T> action, Runnable emptyAction)`  |      如果value不为空，则执行action，否则执行emptyAction      | 9  |
| `Optional<T> or(Supplier<? extends Optional<? extends T>> supplier)` |     如果value不为空，则返回value，否则返回supplier.get()     | 9  |
|                         `Stream<T> stream()`                         | 如果value不为空，则返回一个只包含value的stream，否则返回一个空stream  | 9  |
|                          `T orElseThrow()`                           | 如果value不为空，则返回value，否则抛出NoSuchElementException | 10 |

# 3. 简化编译运行程序
> 在JDK11中，可以直接通过 java Test.java来编译运行程序，不需要先编译再运行 `javac xxx.java && java xxx`
