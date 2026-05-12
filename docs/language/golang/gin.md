:::tip

Golang中Web开发框架对比

当前进度 https://www.bilibili.com/video/BV1Rm421N7Jy?spm_id_from=333.788.player.switch&vd_source=d9d3eb78433e98d94cd75ddf5ac0382b&p=55

| 场景                       | 框架      |
| -------------------------- |---------|
| 简单快速,类似与Express  | [Gin](/language/golang/gin)    |
| 企业级一站式类似SpringBoot | [GoFrame](/language/golang/goframe)    |
|                            | [GoZero](/language/golang/go-zero)    |
| 微服务云原生               | [Kratos](/language/golang/kratos)    |
|                            | [Hertz](/language/golang/hertz)    |

:::

# 1. 简介

Gin是一个Go编写的轻量级Http Web框架，运行速度非常快，如果追求性能的话可以使用Gin框架。

**<font color=red>Gin擅长Api接口的高并发，如果项目规模不大且业务相对简单，推荐使用哦Gin</font>**

[Gin教程](https://www.bilibili.com/video/BV1Rm421N7Jy?spm_id_from=333.788.player.switch&vd_source=d9d3eb78433e98d94cd75ddf5ac0382b&p=52)，[官网文档地址](https://gin-gonic.com/zh-cn/)

# 2. 环境搭建

## 1.项目搭建

> Gin是依赖于Go环境的，需要先安装Go并且设置好，也可以用Mise来统一管理go版本。

1. 初始化项目

```shell
go mod init gin_demo
```

2. 获取gin

```shell
go get -u github.com/gin-gonic/gin
```

3. 写一个简单的服务

```go
package main

import "github.com/gin-gonic/gin"

func main() {
	// 创建一个默认的路由引擎
	r := gin.Default()
	// 定义一个路由
	r.GET("/", func(c *gin.Context) {
		// @Summary 获取Hello World
		// @Description 获取Hello World
		// @Tags Hello
		// @Success 200 {string} string "Hello World"
		c.String(200, "Hello World")
	})
	// 启动服务器 默认的是8080端口
	r.Run(":8080")

}
```

## 2. golang程序热加载

> 可以省去重新编译的时间，在`beego`框架中可以使用官方提供的bee工具进行热加载，但是gin中并没有官方提供的热加载工具，就需要用到第三方工具
>
> 1. https://github.com/gravityblast/fresh
>
> ```shell
> go install github.com/gravityblast/fresh@latest
> # 安装好直接在项目目录执行
> fresh
> ```

## 3. 小测试

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	// 加载HTML模板 返回html的话需要用到
	r.LoadHTMLGlob("templates/*")
	r.GET("/", func(c *gin.Context) {
		// 返回字符串
		c.String(http.StatusOK, "HelloWorld!")
	})
	r.GET("/json", func(c *gin.Context) {
		// 返回JSON
		c.JSON(http.StatusOK, gin.H{
			"message": "HelloWorld!",
			"data":    "result Json",
		})
	})
	r.GET("/struct", func(c *gin.Context) {
		// 返回结构体
		c.JSON(http.StatusOK, UserInfo{
			Name: "张三",
			Age:  18,
			Addr: "北京",
		})
	})
	r.GET("/jsonp", func(c *gin.Context) {
		ui := UserInfo{
			Name: "张三",
			Age:  18,
			Addr: "北京",
		}
		// http://localhost:8080/jsonp?callback=cb
		// cb({"data":{"name":"张三","age":18,"addr":"北京"},"message":"HelloWorld!"});
		// 主要用来解决跨域问题，通过在JSON中添加回调函数名前缀，来实现跨域调用
		// 可以传入回调函数，调用时会自动添加回调函数名前缀
		c.JSONP(http.StatusOK, gin.H{
			"message": "HelloWorld!",
			"data":    ui,
		})
	})
	r.GET("/html", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title": "HelloWorld!",
		})
	})
	r.Run(":8080")
}

type UserInfo struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
	Addr string `json:"addr"`
}

```

> html接收值有点类似Vue

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
<h1>{{ .title }}</h1>
</body>
</html>
```

> 如果有多级目录的话，需要多定义几个额地方，但是现在基本都是前后端分离了，看看就行

1. 加载模版的时候

```go
r.LoadHTMLGlob("templates/**/*")
```

2. html首行定义属于哪个目录

```html
<!-- deafult就是直接在templates目录下的 -->
{{define "default/index.html"}}
<!--这中间写html的内容-->
{{end}}
```

3. 返回模版的地方

```go
c.HTML(http.StatusOK, "admin/index.html", gin.H{
			"title": "HelloWorld!",
		})
```

