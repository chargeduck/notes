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

# 3.  动态传参

1. get参数

```http
GET http://localhost:8080?username=zhangsan&age=18
```

```go
r.GET("/", func(c *gin.Context) {
    username := c.Query("username")
	// 带默认值的
    age := c.DeafultQuery("age", 18)
    c.JSON(http.StatusOK, gin.H{
        "username": username,
        "age":      age,
    })
})
```

2. 动态路由传参

```http
GET http://localhost:8080/user/20
```

```go
r.GET("/user/:id", func(c *gin.Context) {
    id := c.Param("id")
    c.JSON(http.StatusOK, gin.H{
        "id": id,
    })
})
```

3. post表单传过来的数据

```http
POST http://localhost:8080/user
```

```go
r.POST("/user/add", func(c *gin.Context) {
    username := c.PostForm("username")
    age := c.DefaultPostForm("age")
})
```

4. get post参数绑定到结构体

> 结构体必须有`form tag`

```go
type UserInfo struct {
	Username string `json:"username" form:"username"`
	Age      int    `json:"age" form:"age"`
}
r.GET("/getUser", func(c *gin.Context) {
		user := &UserInfo{}
		if err := c.ShouldBind(&user); err == nil {
			fmt.Printf("%#v\n", user)
			c.JSON(http.StatusOK, user)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
		}
	})
```

5. post json参数

> 结构体必须有json标签

```go
r.POST("/getUser", func(c *gin.Context) {
    var user UserInfo

    // 3. 绑定 JSON：使用 ShouldBindJSON
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "msg":  "参数错误",
            "error": err.Error(),
        })
        return
    }

    // 4. 正常处理业务
    c.JSON(http.StatusOK, gin.H{
        "msg":  "成功接收 JSON",
        "data": user,
    })
})
```

6. 接受文件

```go
r.POST("/upload", func(c *gin.Context) {
    // 1. 获取文件（file 是前端传的字段名）
    file, err := c.FormFile("file")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "msg": "获取文件失败",
        })
        return
    }

    // 2. 保存文件到本地
    // 第二个参数是保存路径 + 文件名
    err = c.SaveUploadedFile(file, "./"+file.Filename)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "msg": "保存文件失败",
        })
        return
    }

    // 3. 返回成功
    c.JSON(http.StatusOK, gin.H{
        "msg":     "上传成功",
        "文件名":  file.Filename,
        "大小":    file.Size,
    })
})
```

# 4. 路由分组

> 如果都写在一个文件里这个文件会比较乱，所以需要进行路由分组和文件抽离，这样单独维护路由文件夹就好了

1. 分组

> 通过`r.Group()`方法进行分组

```go
r := gin.Default()
defaultRouters := r.Group("/")
{
    defaultRouters.GET("/", func(c *gin.Context) {
        // todo
    })
}
apiRouters := r.Group("/api")
{
    apiRouters.GET("/api/userList", func(c *gin.Context){
        // todo
    })
}
r.Run()
```

2. 路由文件抽离

> 在根目录创建 `routers` 和 `controller`两个目录

```go
// adminController.go
package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Login(context *gin.Context) {
	context.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "登录成功",
	})
}
```

```go
// adminRouter.go
package routers

import (
	"gin_demo/demo04/controller"

	"github.com/gin-gonic/gin"
)

func AdminRoutersInit(router *gin.Engine) {
	adminRouter := router.Group("/admin")
	{
		adminRouter.GET("/login", controller.Login)
	}
}
```

```go
// main.go
package main

import (
	"gin_demo/demo04/routers"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	routers.AdminRoutersInit(r)
	routers.ApiRoutersInit(r)
	routers.DefaultRoutersInit(r)
	r.Run(":8080")
}
```

> 还有一种就是给结构体添加方法，这样用起来会比较简单

```go
package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ApiController struct {}

func (ctrl ApiController) UserList(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "获取用户列表成功",
	})
}
```

```go
// apiRouters.go
package routers

import (
	"gin_demo/demo04/controller"

	"github.com/gin-gonic/gin"
)

func ApiRoutersInit(router *gin.Engine) {
	apiRouter := router.Group("/api")
	{
		apiRouter.GET("/api/userList", controller.ApiController{}.UserList)
	}
}
```

# 5. 路由中间件

> 我感觉这个相当于是一个拦截器之类的吧，但是教程里说是Gin中间件

```go
func ApiRoutersInit(router *gin.Engine) {
	apiRouter := router.Group("/api")
	{
		apiRouter.GET("/api/userList", routerInterceptor, controller.ApiController{}.UserList)
	}
}
func routerInterceptor(c *gin.Context)  {
	fmt.Println("routerInterceptor")
    // 继续执行下一个中间件
	c.Next()
}
```

```go
// 终止调用该请求的后续中间件。
c.About()

// 全局使用
r.Use(routerInterceptor)

// 单独一个分组使用
apiRouter := router.Group("/api", routerInterceptor)
{
    
}

// 中间件传值用 ctx.Set ctx.Get获取值
ctx.Set("username", 123)
username := ctx.Get("username")

// 中间件使用goroutine不能直接使用上下文，应该用只读副本。
cCopy := ctx.Copy()
go func(){
    path := cCopy.Request.URL.Path
}
```

