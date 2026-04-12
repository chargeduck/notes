>
golang,还没开始学，等我看完php的 [it营golang视频教程 28/84](https://www.bilibili.com/video/BV1Rm421N7Jy?p=28)
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
// 第四种，通过下标创建好值
arr := [...]int{0:1, 1:10, 2: 20, 5:50}
```

> 多维数组的时候只有最外层可以自动推导长度

```go
arr1 := [1][2]string {
    {"北京", "上海"}
}
arr2 := [...][2]string {
    {"北京", "上海"},
    {"广州", "深圳"},
    {"....", "...."}
}
```

## 2. slice

> 切片相当于是Java中的List，但是实现逻辑有些微的不同。当做list用就行了，<font color=red>切片声明之后，默认值是nil</font>
>
> **<font color=red>切片的扩容策略，如果就切片的长度小于1024新的就是旧的2倍，如果超过1024则是增加原来的1/4</font>**

```go
// 定义切片
var arr2 []string
fmt.Printf("arr2: %v\n %T\n", arr2, arr2)
fmt.Printf(arr2 == nil) //true
// 使用 append方法往切片中添加值
var arr2 []string
str := "Hello"
str2 := "World"
arr2 = append(arr2, str, str2)
```

> 基于数组定义切片，这里的`a[:]`值得注意一下，它其实`:`前后是有两个`index`可以选择的，范围是`[formIndex, toIndex)`

```go
a := [3]int{0,1,2,3,4,5,6}
// a[:] 表示获取数组里的所有值
b := a[:]
// 从下标1-3
c := a[1:4]
// 从下标2到所有的
d := a[2:]
// 下标3之前的
f := a[:3]
```
> 使用make来定义一个切片，`make([]T,初始化长度，容量)`

```go
// 创建一个字符串数组，长度为3，容量为5
arr1 := make([]string, 3, 5)
arr1[0] = "hello"
arr1[1] = "world"
arr1[2] = "!"

println(arr1[0])
// 长度3 容量5
fmt.Printf("len: %v cap: %v", len(arr1), cap(arr1))
str := "Hello"
str2 := "World"
arr1 = append(arr1, str, str2)
arr2 := []string{"nodeJs", "java"}
// 还可以用append合并两个切片
arr1 = append(arr1, arr2...)
```

> 复制切片的值

```go
sliceA := []int{1, 2, 3, 4}
sliceB := make([]int, 4)
copy(sliceB, sliceA)
```

> 从切片中删除元素,<font color=red>由于go中没有原生的删除切片元素的方法，可以用切片本省的特性来删除元素</font>

```go
sliceC := []int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
// 删除下标为2 的元素  就是用数组分割加上apeend方法
sliceC = append(sliceC[:2], sliceC[3:]...)
// 使用slices类库 删除下标为2-3的元素 左闭右开
slices.Delete(sliceC, 2, 3)
```

## 3. 排序

> 除了常规的冒泡排序等，也有工具类可以使用

```go
func main() {
	// 生成 int float64 string 类型的随机数每个数组15个元素
	intList := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 0, 12, 3, 45}
	float64List := []float64{1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 1.0, 0.0, 12.0, 3.0, 45.0}
	strList := []string{"a", "A", "c", "m", "C", "t", "y"}
	sort.Ints(intList)
	sort.Float64s(float64List)
	sort.Strings(strList)
	// 打印排序后的数组
	fmt.Printf("%v\n", intList)
	fmt.Printf("%v\n", float64List)
	fmt.Printf("%v\n", strList)
    // 倒序 其他的也是类似
    sort.Sort(sort.Reverse(sort.IntSlice(intList)))
	sort.Sort(sort.Reverse(sort.Float64Slice(float64List)))
	sort.Sort(sort.Reverse(sort.StringSlice(strList)))
}
```

# 7. map

1. 通过`var mapName = make(map[keyType]valType)`定义map

```go
var userinfo = make(map[string]string)
userinfo["name"] = "张三"
userinfo["age"] = "18"
fmt.Printf("%v\n", userinfo)
```

2. 声明map的时候填充元素

```go
// 声明的时候填充元素
var userinfo2 = map[string]any{
    "username": "张三",
    "age":      18,
    "sex":      "male",
    "email":    "zhangsan@example.com",
    "phone":    "13800000000",
}
// 简化写法 
user := map[string]any{}
fmt.Printf("%v\n", userinfo2)
```

3. 修改map的元素数据直接按照key赋值就完事了

```go
userinfo2["age"] = 28
```

4. 根据key获取value

> 如果有这个key的话，ok的值就是true 第一个变量就是value的值，不包含这个key返回nil

```go

age, ok := userinfo2["age"]
fmt.Printf("age: %v, hasKey: %v\n", age, ok)
```

5. 删除map里边的key

```go
delete(userinfo2, "age")
fmt.Printf("%v\n", userinfo2)
```

6. 循环遍历map

```go
for k, v := range userinfo2 {
    fmt.Printf("key: %v, value: %v\n", k, v)
}
```

7. 统计单词出现的次数

> 这个相较于java还是简单了一点的

```go
str := "how do you do it"
strSlice := strings.Split(str, "")
letterMap := make(map[string]int)
for _, v := range strSlice {
    letterMap[v]++
}
fmt.Printf("%v\n", letterMap)
```

# 8. 函数

## 1. 定义函数

```go
func name(param type)(resultType) {
    // method implements
}
// 如果两个参数的类型一样，可以简写
func addNum(a, b int) int {
	return a + b
}
```

## 2. 可变参数

> 也是通过`...`表示，只不是加在了类型前边

```go
func numsSum(nums ...int) int {
	sum := 0
	for _, v := range nums {
		sum += v
	}
	return sum
}
```

## 3. 同时返回多个类型

```go
func calc(x,y int)(int,int,int,int) {
    sum := x + y
    sub := x - y 
    multi := x * y
    div := x / y
    return sum, sub, multi, div
}
```

## 4. 函数类型

> 可以通过type关键字定义一个函数类型，具体格式如下。这个语句定义了一个`calculation`类型,它是一种函数类型，接收两个int参数，返回一个int类型，<font color=red>有点类似于java的FunctionalInterface或者是接口</font>
>
> ```go
> type calculation func (int, int) int
> ```

```go
// 定义一个calc类型函数
type calc func(int, int) int

func add(a, b int) int {
	return a + b
}

func sub(a, b int) int {
	return a - b
}


func main() {
	var c calc = add
	fmt.Printf("c的类型是: %T\n", c)
}
```

> 可以用来做回调函数，这样比较方便

```go
/**
 * 计算两个数的结果
 * @param a 第一个数
 * @param b 第二个数
 * @param cb 计算函数
 */
func calcR(a, b int, cb calc) int {
	return cb(a, b)
}
func main() {
    sum := calcR(1 , 2, add)
	sub := calcR(1 , 2, sub)
	fmt.Println(sum)
	fmt.Println(sub)
}
```

> 当然也可以写一个匿名函数

```go
mul := calcR(3, 4, func(x, y int) int {
    return x * y
})
fmt.Println(mul)
```

## 5. 函数作为返回值

```go
func do(str string) calc {
	switch str {
		case "+":
			return add
		case "-":
			return sub
		case "*":
			return func(x, y int) int {
				return x * y
			}
		case "/":
			return func(x, y int) int {
				return x / y
			}
		case "%":
			return func(x, y int) int {
				return x % y
			}
		default:
			return nil
	}
}
```

## 6. 匿名函数

```go
// 匿名自执行函数 通过后边的括号传值
fun (x,y int) {
    return x +y
}(10,20)

// 递归
func factorial(n int) int {
	if n <= 1 {
		return 1 // 递归终止条件
	}
	return n * factorial(n-1) // 核心公式：n! = n * (n-1)!
}
```

## 7. 闭包

> 全局变量：常驻内存，污染全局
>
> 局部变量，不常驻内存，不污染全局，但是其他方法访问不到
>
> 闭包：常驻内存，其他函数能访问到还不会被污染
>
> 1、闭包是指有权访问另一个函数作用域中的变量的函数。
> 2、创建闭包的常见的方式就是在一个函数内部创建另一个函数，通过另一个函数访问这个函数的局部变量
>
> **注意：由于闭包里作用域返回的局部变量资源不会被立刻销毁回收，所以可能会占用更多的内存。过度使用闭包会导致性能下降，建议在非常有必要的时候才使用闭包。**

```go
// 闭包的写法就是函数里嵌套另外一个函数 这个不管怎么调用都是返回11
func adder1() func() int {
    var i = 10
    return func () int {
        retutn i + 1
    }
}
func adder2() func(y int) int {
    var i = 10
    return func () int {
        i += y
        retutn i
    }
}

func main() {
    var fn = adder1()
    fmt.Println(fn()) //11
    fmt.Println(fn()) //11
    fmt.Println(fn()) //11
    var fn2 = adder2()
    fmt.Println(fn2(1)) //11
    fmt.Println(fn2(2)) //13
    fmt.Println(fn2(3)) //16  
}
```

