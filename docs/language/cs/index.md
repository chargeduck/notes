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

## 6. 类
### 0. get set
> 创建 get set方法的时候有所不同

```cs 
public class Customer{
    public int Id { get; set; }
    public string Name { get; set; }
    private string address;

    public string Address {
        get => address;
        set => address = value;
    }
}
```

```cs 
Customer customer = new Customer();
customer.Id = 1;
customer.Name = "John Doe";
customer.Address = "QingDao, ShanDong";
Console.WriteLine($"Id: {customer.Id}, Name: {customer.Name}, Address: {customer.Address}");
```

### 1. 继承

> 使用 `:` 来继承父类，这一点有点类似于 kotlin

```cs 
class BaseClass{}
class ChildClass: BaseClass{}
```
> 可以使用 base() 来使用父类的构造方法，简化代码
```cs 
public class Animal
{
    public string Name;

    public Animal(string name) => Name = name;

    public Animal()
    {
    }
}
```
```cs 
public class Cat: Animal
{
    public int Legs;

    public Cat(string name, int legs) : base(name)
    {
        this.Legs = legs;
    }

    public Cat() : base()
    {
        
    }
}
```

### 2. 方法重写
> 有一点需要注意的是，在c#中 子类如果想要重写父类的方法的话， 父类的方法必须是 `虚方法` 或者是 `抽象方法` 才行

| 类型   | 关键字      | 示例                           | 特点              |
|------|----------|------------------------------|-----------------|
| 虚方法  | virtual  | public virtual void Eat() {} | 必须有方法体，子类按需重写方法 |
| 抽象方法 | abstract | public abstract void Eat();  | 不需要有方法体，子类必须重写  |

```cs 
public class Animal{
    public virtual void Eat(){ Console.WriteLine("Eating"); }
}
public class Eat: Animal {
    public override void Eat() { Console.WriteLine("Cat eat fish"); }
}
Animal cat = new Cat();
cat.Eat();
```
> 还有一种如果子类想要覆盖父类的方法的时候，可以使用 `new` 关键字来隐藏父类的方法
```cs 
public class Animal{
    public void Eat(){ Console.WriteLine("Eating"); }
}
public class Eat: Animal {
    public new void Eat() { Console.WriteLine("Cat eat fish"); }
}
Animal cat = new Cat();
cat.Eat();
```
**注意，虚方法和隐藏方法的区别**

1. 虚方法
> 虚方法实现了多态性，当通过父类引用指向子类对象时，调用该虚方法会执行子类中重写后的方法，具体调用哪个方法在运行时根据对象的实际类型来确定。

2. 隐藏方法
> 隐藏方法没有实现多态性，当通过父类引用指向子类对象时，调用该方法会执行父类的方法；只有通过子类引用调用时，才会执行子类中隐藏的方法，调用哪个方法在编译时根据引用类型来确定。

> 如果想要给父类的属性赋值的话， 需要使用 `base` 关键字， 在 java 中使用 `super`

### 3. 密封类和密封方法
> 相当于是这个类是 final 的，此类不可被继承， 其内部的方法也不允许被重写， 使用 `sealed`关键字来修饰。

```cs 
sealed FinalClass{
    void Eat(){}
}

class Boss: Enemy{
    sealed override double Attack(){}
}
```
## 7. 索引器
```cs 
public class Test
{
    private string[] name = new string[100];

    public string this[int index]
    {
        get => name[index];
        set => name[index] = value;
    }
}
```
```cs 
Test test = new Test();
test[1] = "index1";
test[0] = "index2";
Console.WriteLine(test[1]);
```
## 8. 运算符重载
> 使用 `operator` 关键字来重载预算符， 具体哪些可以重载哪些不可以可以[看这里](https://www.runoob.com/csharp/csharp-operator-overloading.html)

```cs 
public class Student
{
    private string name;
    private int age;

    public Student(string name, int age)
    {
        this.name = name;
        this.age = age;
    }

    public static bool operator ==(Student prev, Student next)
    {
        return prev.age == next.age && prev.name == next.name;
    }

    public static bool operator !=(Student prev, Student next)
    {
        return !(prev == next);
    }
}
```
## 9. 多线程
```cs 
static void ChildThreadMethod()
{
    Console.WriteLine("Child Thread do something");
}

ThreadStart start = new ThreadStart(ChildThreadMethod);
new Thread(start).Start();
Thread childThread = new Thread(strat);
// 开始任务
childThread.Start();
// 强制中断任务 部分平台可能不支持
childThread.Abort();
```
# 2. 绘制图片
> 如果添加资源的时候一不小心选择成了 byte[] 需要转换成Image之后才能够使用Graphics绘制

```cs 
private void button2_Click(object sender, EventArgs e)
{
    MessageBox.Show("Wtf?");
    Graphics g = this.CreateGraphics();
    Pen pen = new Pen(Color.Black);
    g.DrawLine(pen, new Point(100, 100), new Point(500, 600));
    byte[] imageBytes = Resources.Boss;
    Bitmap bitmap = byteArr2Bitmap(imageBytes);
    // 让黑色变成透明的
    bitmap.MakeTransparent(Color.Black);
    g.DrawImage(byteArr2Image(imageBytes), 100, 100);
    g.DrawImage(bitmap, 200, 200);
    
}
/**
 * byte[] ==> Image
 */
private Image byteArr2Image(byte[] bytes)
{
    return Image.FromStream(new MemoryStream(bytes));
}

private Bitmap byteArr2Bitmap(byte[] bytes)
{
    return (Bitmap)Bitmap.FromStream(new MemoryStream(bytes));
}
```
