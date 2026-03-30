>
golang,还没开始学，等我看完php的 [it营golang视频教程](https://www.bilibili.com/video/BV1Rm421N7Jy?spm_id_from=333.788.player.switch&vd_source=d9d3eb78433e98d94cd75ddf5ac0382b&p=6)

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

| 类型     | 占用字节 | 范围                                         | 范围                                  |
|--------|------|--------------------------------------------|-------------------------------------|
| int8   | 1    | [-128,127]                                 | [-2<sup>7</sup>,2<sup>7</sup> -1]   |
| int16  | 2    | [-32768,32767]                             | [-2<sup>15</sup>,2<sup>15</sup> -1] |
| int32  | 4    | [-2147483648,2147483647]                   | [-2<sup>31</sup>,2<sup>31</sup> -1] |
| int64  | 8    | [-9223372036854775808,9223372036854775807] | [-2<sup>63</sup>,2<sup>63</sup> -1] |
| uint8  | 1    | [0,255]                                    | [0,2<sup>8</sup> -1]                |
| uint16 | 2    | [0,65535]                                  | [0,2<sup>16</sup> -1]               |
| uint32 | 4    | [0,4294967295]                             | [0,2<sup>32</sup> -1]               |
| uint64 | 8    | [0,18446744073709551615]                   | [0,2<sup>64</sup> -1]               |

```go
// int 类型
var num = 10
fmt.Printf("num = %v, %T\n", num, num)
// int8 类型
var b int8 = 100
// uint8(0-255)
// int8 int 16 ...
// int不同长度直接转换
// int格式化输出
```
