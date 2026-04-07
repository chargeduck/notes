>
golang,还没开始学，等我看完php的 [it营golang视频教程](https://www.bilibili.com/video/BV1Rm421N7Jy?spm_id_from=333.788.player.switch&vd_source=d9d3eb78433e98d94cd75ddf5ac0382b&p=17)
# 1. 下载安装及简单示例

> [下载地址](https://go.dev/dl/go1.24.6.windows-amd64.msi), 安装完成之后可以通过`go version` 查看环境是否安装成功，也可以通过
`go env`查看当前的go 环境
> 配置完环境之后可以写下列的示例代码看看是否能够运转成功

## 1. 测试代码

> 使用 GoLand 编译运行代码，查看输出结果，当然Vscode或者是 `go run main.go`也可以

```go
package main

import (
	"fmt"
)

func main() {
	fmt.Println("hello world")
	// 多个参数换行输出
	fmt.Print("A","b","C")
	// 输出格式符
	a := 10
	b := true
	fmt.Print("a = %v b = %v",a,b)
}
```

# 2. 变量定义

> 在 go语言中 定义变量有两种方式，一种是使用`var` 关键字，另一种是使用:= 操作符
>
> <font color=red>注意, 在 go语言中 定义变量必须要使用，否则会报错</font>

| 序号 | 方式        | 示例              |
|----|-----------|-----------------|
| 1  | `var` 关键字 | `var a = "aaa"` |
| 2  | := 操作符    | `a := "aaa"`    |

1. 常规变量定义

```go
func main() {
	var a = "aaa"
	var b int = 3
	c := false
	// 定义了一个变量d，值为true，但是不使用，运行就会报错
	d := true
	fmt.Println(a,b,c)
}
```

2. 同时定义多个变量

```go
func main() {
	var (
		username string
		age  int
		sex  string
	)
	username = "张三"
	age = 18
	sex = "男"
	fmt.Printf("username = %v, age = %v, sex = %v\n", username, age, sex)
	
	// 直接赋值可以不用写类型
	var (
		mail = "2496290990@qq.com"
		domain = "qq.com"
	)
	fmt.Println(mail, domain)
}
```

3. 短变量定义 `:=`操作符

> 短变量声明只能在函数内部使用，只能用来做局部变量，不能用来定义全局变量

```go
func main() {
	a := "aaa"
	fmt.Println(a)
	// 同时定义多个变量
	d, e, f := 10, 20, 30
	fmt.Printf("%v * %v - %v = %v\n", d, e, f, d*e-f)·
}
```

4. 通过 `%T` 查看变量类型

```go
func main() {
	a := 10
	fmt.Printf("%T\n", a)
}
`````

5. 匿名变量

> 匿名变量可以用下划线 `_` 来表示，表示不使用这个变量

```go
func main() {
	_, a := 10
	fmt.Println(a)
}
```

6. 方法定义及返回值

```go
/**
 * 通过第二个括号里定义返回值类型 
 * @Description: 获取用户信息
 * @return: string, int, string
 */
func getUserInfo() (string, int, string) {
	return "张三", 10, "男"
}
func main() {
    var username, age, sex  = getUserInfo()
}
```

7. 常量的定义

```go
const  PI = 3.1415926
// 同时声明多个常量，如果省略了值则表示和上边一行一样
const (
    n1 = 100
    n2
    n3
)

```

> 当常量 const 和 iota同时使用时，iota 会自动递增，

```go 
const (
    a = iota //0
    b  //1
    c  //2
    // 可以使用 `_`跳过当前的 iota 值，继续下一个 iota
    _
    d  //4
)
```

# 3. 基本数据类型

## 1. 整型

> 在go中整型分为两大类
>
> 有符号整型 `int8 int16 int32 int64`
>
> 无符号整型 `uint8 uint16 uint32 uint64 `

| 类型     | 占用字节 | 对比Java | 范围                                         | 范围                                  |
|--------|------|--------|--------------------------------------------|-------------------------------------|
| int8   | 1    | byte   | [-128,127]                                 | [-2<sup>7</sup>,2<sup>7</sup> -1]   |
| int16  | 2    | short  | [-32768,32767]                             | [-2<sup>15</sup>,2<sup>15</sup> -1] |
| int32  | 4    | int    | [-2147483648,2147483647]                   | [-2<sup>31</sup>,2<sup>31</sup> -1] |
| int64  | 8    | long   | [-9223372036854775808,9223372036854775807] | [-2<sup>63</sup>,2<sup>63</sup> -1] |
| uint8  | 1    |        | [0,255]                                    | [0,2<sup>8</sup> -1]                |
| uint16 | 2    |        | [0,65535]                                  | [0,2<sup>16</sup> -1]               |
| uint32 | 4    |        | [0,4294967295]                             | [0,2<sup>32</sup> -1]               |
| uint64 | 8    |        | [0,18446744073709551615]                   | [0,2<sup>64</sup> -1]               |

```go
// int 类型
var num = 10
fmt.Printf("num = %v, %T\n", num, num)
// int8 类型
var b int8 = 100
// 通过 unsafe.Sizeof 查看变量占用的字节数
fmt.Printf("b = %v, %T\n", b, unsafe.Sizeof(b))
// uint8(0-255)
// int8 int 16 ...
var a1 int16 = 100
var a2 int32 = 200
// int不同长度直接转换
fmt.Printf("a1 = %v, a2 = %v\n", a1, int16(a2))
```

格式化输出

| 序号 | 格式化符 | 说明        |
|----|------|-----------|
| 1  | %v   | 默认格式化输出   |
| 2  | %T   | 输出变量类型    |
| 3  | %d   | 输出整数      |
| 4  | %f   | 输出浮点数     |
| 5  | %s   | 输出字符串     |
| 6  | %c   | 输出字符      |
| 7  | %d   | 输出十进制整数   |
| 8  | %b   | 输出二进制数    |
| 9  | %o   | 输出八进制数    |
| 10 | %x   | 输出十六进制数   |
| 11 | %X   | 输出十六进制数大写 |

## 2. 浮点型

> 跟Java中的 double float应该是一样的，<font color=red>在Golang中默认的是float64</font>

| 类型      | 占用字节 | 对比Java | 范围 | 范围 |
|---------|------|--------|----|----|
| float32 | 4    | float  |    |    |
| float64 | 8    | double |    |    |

```go
func main() {
	var a float32 = 3.1415926
	fmt.Printf("val: %v --%f, type: %T, size: %v\n", a, a, a, unsafe.Sizeof(a))
    var a2 float64 = 3.1415926
	fmt.Printf("val: %v --%f, type: %T, size: %v\n", a2, a2, a2,unsafe.Sizeof(a2))
}
```

> golang中科学计数法表示浮点类型

```go
// 这一点还是比较不错的
a3 := 1e-3
fmt.Printf("val: %v --%f, type: %T, size: %v\n", a3, a3, a3,unsafe.Sizeof(a3))
// val: 0.001 --0.001000, type: float64, size: 8
```

> 解决golang中的float精度丢失问题，需要使用到第三方库，从go 1.6之后需要有两步操作
>
> ```shell
> # 初始化项目目录
> go mod init golang_demo
> # 下载对应的包
> go get github.com/shopspring/decimal
> ```
>

```go
package main

import (
	"fmt"
	"github.com/shopspring/decimal"
)

func main() {
	m1 := 8.2
	m2 := 3.8
	// 原始运算：8.2 - 3.8 = 4.3999999999999995
	fmt.Printf("原始运算：%v - %v = %v\n", m1, m2, m1-m2)
	m3 := decimal.NewFromFloat(m2).Sub(decimal.NewFromFloat(m1))
	// decimal运算：-4.4
	fmt.Printf("decimal运算：%v\n", m3.String())
}
```

## 3. bool

1. 只有true和false两个值,默认是false
2. bool不能参与任何数值运算
3. bool不能直接和int等数字类型强制转换

```go
var flag bool = true
if flag {
    fmt.Print("false")
}
```

## 4. string

> 就是一个字符串没什么好说的,<font color=red>unsafe.SizeOf无法查看string类型的长度，需要用len方法</font>

| 方法     | 示例                                  | 描述                  |
|--------|-------------------------------------|---------------------|
| 字符串长度  | len(str)                            | 获取字符串的字节长度，中文占用三个字节 |
| 拼接字符串  | + <br/>fmt.Sprintf                  |                     |
| 分割字符串  | strings.Split(str6)                 | 返回的是一个切片，跟数组还有一些不一样 |
| 是否包含   | strings.contains                    |                     |
| 前缀判断   | strings.HasPrefix                   |                     |
| 后缀判断   | strings.HasSuffix                   |                     |
| 判断子串位置 | strings.Index()                     |                     |
|        | strings.LastIndex()                 |                     |
| join操作 | strings.Join([]string , sep string) | 把切片变成数组             |

```go
package main

import (
	"fmt"
	"strings"
)

func main() {
	str1 := "Hello"
	str2 := "世界"
	// 字节长度 5 6
	fmt.Printf("%s 长度 %v %s 长度 %v\n", str1, len(str1), str2, len(str2))
	// 拼接字符串
	str3 := str1 + str2
	fmt.Println(str3)
	// 通过格式化输出拼接字符串
	str4 := fmt.Sprintf("%v %v", str1, str2)
	fmt.Println(str4)
	// 反引号换行 所有的转移字符无效
	str5 := `123
			\n4567`
	fmt.Println(str5)
	// 字符串分割，string.Split 需要引入包
	str6 := "123-456-789"
	arr := strings.Split(str6, "-")
	// [123-456-789] 类型是 []string 切片是可以动态扩容的 数组是写死长度的 如果是[3]string 就是固定长度的数组
	fmt.Printf("%s 类型是 %T\n", arr, arr)
	str7 := strings.Join(arr, "::")
	fmt.Println(str7)
    // 剩下的方法自己看就行了，跟java一样的
}

```

## 5. byte和rune 字符类型

> golang中的字符有两种情况。
>
> 1. uint8类型或者是 byte类型 代表了ASCII中的一个字符
> 2. rune类型，代表一个UTF8字符，实际上是一个int32类型
>
> 在处理中文，日文或者其他服了字符的时候需要用到rune类型，

```go
func main() {
	a := 'a'
	b := 'b'
	// 97 int32
	fmt.Printf("val: %v, type: %T\n", a, a)
	fmt.Printf("val: %v, type: %T\n", b, b)
	var char rune = '中'
	fmt.Printf("val: %v, type: %T\n", char, char)
	str := "this"
	fmt.Printf("值:%v 原样输出%c 类型:%T", str[2], str[2], str[2])
	s := "hello 世界！golang不好玩"
	for _, v := range s {
		fmt.Printf("%v(%c)\n", v, v)
	}
}
```

> 修改字符串需要先把字符串转换成切片在更改，全是英文可以用`[]byte`,有特殊字符可以用`[]rune`直接用后边的更通用一些。

```go
arr := []rune(s)
for i := 0; i < len(arr); i++ {
    arr[i] = arr[i] - 0x0A
}
fmt.Println(string(arr))
```

## 6. 基本数据类型转换

> 数字类型之间的转换，低位转换成高位，否则可能会溢出

```go
func main() {
	var a int8 = 20
	var b int16 = 40
	print(int16(a) + b)
}
```

> 其他类型转换成string类型有两种方式

1. 使用fmt.Sprintf转换

```go
i := 20
f := 3.141592653589793
// 1. 使用 fmt.Sprintf 转换为字符串
str := fmt.Sprintf("%d", i)
fmt.Printf("val: %v, type: %T\n", str, str)
```

2. 通过 strconv进行转换

> 有`FomatInt`、`FormatFloat`、`FormatBool`等方法

```go
/**
 * param1: int64 类型的整数
 * param2: 转换之后的进制
 */
str1 := strconv.FormatInt(int64(i), 16)
fmt.Printf("val: %v, type: %T\n", str1, str1)
```

```go
/**
* param1: float64 类型的浮点数
* param2: 格式化类型
* 'f' (-ddd.ddd)
* 'b' (-dddp±dd) 指数为2进制
* 'e' (-ddde±dd) 指数为10进制
* 'E' (-dddE±ddd) 指数为10进制
* 'g'(指数很大时用'e'否则'f')
* 'G'(指数很大时用'E'否则'F')
* param3: 小数位数
* param4: 转换之后的进制
*/
str2 := strconv.FormatFloat(f, 'f', 2, 64)
```

3. 字符类型转其他类型

> `strconv.ParseInt `、`strconv.ParseFloat`等方法

```go
// 第二个是error不需要的话可以用匿名变量
numI, _ := strconv.ParseInt(str1, 10, 64)
fmt.Printf("val: %v, type: %T\n", numI, numI)
```

# 4. 运算符

## 1. 算数运算符

> <font color=red>在go中++和--这种自增自减的属于独立的语句，并不是运算符，而且++ --只能用在后边，不能放在变量前边</font>

```go
i := 0
// 这两种都是会错误的
a = i++
a = i--
// 这两种会直接提示找不到符号
++a
--a
// 这种是可以的
i++
// 1
print(i)
```

| 运算符 | 描述    |
|-----|-------|
| +   | 加     |
| -   | 减     |
| *   | 乘     |
| /   | 除 取整数 |
| %   | 取余    |

## 2. 关系运算符

| 符号 | 描述   |
|----|------|
| == | 等于   |
| != | 不等于  |
| >  | 大于   |
| >= | 大于等于 |
| <  | 小于   |
| <= | 小于等于 |

## 3. 逻辑运算符

| 符号   | 描述 |
|------|----|
| &&   | 与  |
| \|\| | 或  |
| !    | 非  |

## 4. 位运算符

| 符号  | 描述   |
|-----|------|
| &   | 按位与  |
| \|  | 按位或  |
| ^   | 按位异或 |
| ~   | 按位取反 |
| \>> | 按位右移 |
| <<  | 按位左移 |

## 5. 赋值运算符

| 符号  | 描述      |
|-----|---------|
| =   | 直接赋值    |
| +=  | 相加后赋值   |
| -=  | 相减后赋值   |
| *=  | 相乘后赋值   |
| /=  | 相除后赋值   |
| %=  | 取余后赋值   |
| ^=  | 按位异或后赋值 |
| \|= | 按位或后赋值  |
| &=  | 按位与后赋值  |
| <<= | 按位左移后赋值 |
| >>= | 按位右移后赋值 |
| ~=  | 按位取反后赋值 |

# 5. 流程控制

## 1. if else

> 这玩意都是一样的没啥好说的，就是表达式带不带括号都可以

```go
age := 18
if age < 14 {
    
} else if age >=14 && age <= 18 {
    
} else {
    
}
```

## 2. for

> 普通for循环

```go
for i := 1; i<= 10; i++ {
    
}
```

> for range循环遍历数组，切片，字符串，map channel等

```go
str3 := "Hello 青岛"
for index, val := range str3 {
    fmt.Printf("index: %d, val: %c, type: %T\n", index, val, val)
}
```

> 在for循环中可以用break跳出循环体，用continue跳过当前循环，没有while和do...while

## 3. switch case

```go
extra := ".html"
switch extra {
    case ".html":
    	fmt.Println("html")
    case ".css":
    	fmt.Println("css")
    default:
    	fmt.Println("default")
}
```

# 6. Array和切片

> 数组定义之后长度是不可变的，切片的长度是可变的。

## 1. Array

```go
// 第一种初始化方法
var a [3]int
a[0] = 1
a[1] = 2
a[3] = 3
// 第二种初始化方法
var v  = [2]int{0,1}
// 第三种，根据初始化的个数推断数组长度
var arr3 = [...]int{1,2,3,4,5,6,7}
```

## 2. slice

> 切片相当于是Java中的List，但是实现逻辑有些微的不同。当做list用就行了
>
> 
