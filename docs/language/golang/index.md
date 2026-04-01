>
golang,还没开始学，等我看完php的 [it营golang视频教程](https://www.bilibili.com/video/BV1Rm421N7Jy?spm_id_from=333.788.player.switch&vd_source=d9d3eb78433e98d94cd75ddf5ac0382b&p=9)

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

## 2. 变量定义

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

## 3. go中的数据类型

### 1. 整型

> 在go中整型分为两大类
>
> 有符号整型 `int8 int16 int32 int64`
>
> 无符号整型 `uint8 uint16 uint32 uint64 `

| 类型   | 占用字节 | 对比Java | 范围                                       | 范围                                |
| ------ | -------- | -------- | ------------------------------------------ | ----------------------------------- |
| int8   | 1        | byte     | [-128,127]                                 | [-2<sup>7</sup>,2<sup>7</sup> -1]   |
| int16  | 2        | short    | [-32768,32767]                             | [-2<sup>15</sup>,2<sup>15</sup> -1] |
| int32  | 4        | int      | [-2147483648,2147483647]                   | [-2<sup>31</sup>,2<sup>31</sup> -1] |
| int64  | 8        | long     | [-9223372036854775808,9223372036854775807] | [-2<sup>63</sup>,2<sup>63</sup> -1] |
| uint8  | 1        |          | [0,255]                                    | [0,2<sup>8</sup> -1]                |
| uint16 | 2        |          | [0,65535]                                  | [0,2<sup>16</sup> -1]               |
| uint32 | 4        |          | [0,4294967295]                             | [0,2<sup>32</sup> -1]               |
| uint64 | 8        |          | [0,18446744073709551615]                   | [0,2<sup>64</sup> -1]               |

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

### 2. 浮点型
> 跟Java中的 double float应该是一样的，<font color=red>在Golang中默认的是float64</font>

| 类型    | 占用字节 | 对比Java | 范围 | 范围 |
| ------- | -------- | -------- | ---- | ---- |
| float32 | 4        | float    |      |      |
| float64 | 8        | double   |      |      |

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

### 3. bool

1. 只有true和false两个值,默认是false
2. bool不能参与任何数值运算
3. bool不能直接和int等数字类型强制转换

```go
var flag bool = true
if flag {
    fmt.Print("false")
}
```



### 4. string

> 就是一个字符串没什么好说的

| 方法         | 示例                                | 描述                                   |
| ------------ | ----------------------------------- | -------------------------------------- |
| 字符串长度   | len(str)                            | 获取字符串的字节长度，中文占用三个字节 |
| 拼接字符串   | + <br/>fmt.Sprintf                  |                                        |
| 分割字符串   | strings.Split(str6)                 | 返回的是一个切片，跟数组还有一些不一样 |
| 是否包含     | strings.contains                    |                                        |
| 前缀判断     | strings.HasPrefix                   |                                        |
| 后缀判断     | strings.HasSuffix                   |                                        |
| 判断子串位置 | strings.Index()                     |                                        |
|              | strings.LastIndex()                 |                                        |
| join操作     | strings.Join([]string , sep string) | 把切片变成数组                         |



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

### 5. byte和rune
