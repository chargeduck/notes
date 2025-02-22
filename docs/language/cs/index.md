:::tip
众所周知，想要使用Unity就要会C#, 没办法学吧。<br/>
Unreal Engine的话是C++, Cocos creator倒是可以用Typescript
:::
# 1. 差异
1. 方法名采用大驼峰命名，首字母也要大写
2. 常量用小写，跟 java 反着来的

## 1. String
> 与 Java 中类似，但是可以通过在字符串的前边添加上`@`来使字符串里边的转义字符不生效,同样的也可以使String支持多行
```cs
String str = @"123\n345";
// 等价于
String str = "123\\n345";
// 多行字符串
String str3 = @"123
456";
```

## 2. 输入输出
1. 输出
```cs
Console.WriteLine("123"); 
// 格式化输出, 通过下标(从0开始)取数,
Console.WriteLine("{0} + {1} = {2}", 0, 1, 2);
// 可以取多次这个参数
Console.WriteLine("{1} + {1} = {2}", 0, 1, 2);
// 在高版本的C#中，还可以这样取
Console.WriteLine(
    $"姓名: {xiaoming.name}, 年龄: {xiaoming.age}, 性别: {xiaoming.gender}, 年级: {xiaoming.grade} 班: {xiaoming.clazz}");
```
2. 输入
```cs 
String str = Console.ReadLine();
Console.WriteLine(str);
```

## 3. 常量
> 和 js 等一样，用`const`来表示常量，初始化之后这个常量的值就不允许修改了

```cs
const double pi = 3.1415926535;
```

## 4. 结构体 struct
> 定义一个结构体，来存储一组特定的数据

```cs
// See https://aka.ms/new-console-template for more information

Student xiaoming;
xiaoming.name = "Xiaoming";
xiaoming.age = 19;
xiaoming.gender = "M";
xiaoming.grade = 9;
xiaoming.clazz = 2;
Console.WriteLine($"姓名: {xiaoming.name}, 年龄: {xiaoming.age}, 性别: {xiaoming.gender}, 年级: {xiaoming.grade} 班: {xiaoming.clazz}");
struct Student
{
    public int age;
    public string name;
    public string gender;
    public int grade;
    public int clazz;
}
```
## 5. 委托
> 委托类似于回调函数，可以创建一个委托对象，然后将这个委托对象作为参数传递给另一个函数，当这个函数执行完毕之后，会调用这个委托对象，从而实现回调函数的效果
> 
> 与 java 中的匿名方法或者是 @FunctionalInterface 类似, 或者说是 lambda 表达式

```cs
// 通过关键字 delegate 来定义一个委托
delegate void MyDelegate(int a, int b);
double add(int a, int b){
    return a + b;
}
double sub(int a, int b){
    return a - b;
}
// 这里的委托对象就是一个函数指针
MyDelegate myDelegate = add;
Console.WriteLine(myDelegate(1, 2));
myDelegate = sub;
Console.WriteLine(myDelegate(1, 2));
```
