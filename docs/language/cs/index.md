# 1. 差异
1. 方法名采用大驼峰命名，首字母也要大写
2. 常量用小写，跟 java 反着来的

## 1. String
> 与 Java 中类似，但是可以通过在字符串的前边添加上`@`来使字符串里边的转义字符不生效,同样的也可以使String支持多行
```cs
String str = @"123\n345";
// 等价于
String str = "123\\n345";
String str3 = @"123
456";
```

## 2. 输入输出
1. 输出
```cs
Console.WriteLine("123"); 
// 格式化输出, 通过下标(从0开始)取数,可以取多次
Console.WriteLine("{0} + {1} = {2}", 0, 1, 2);
Console.WriteLine("{1} + {1} = {2}", 0, 1, 2);
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
> 
