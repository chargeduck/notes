:::tip
go-zero框架，[官网 https://go-zero.dev/](https://go-zero.dev/)

| 场景                       | 框架      |
| -------------------------- |---------|
| 简单快速                   | [Gin](/language/golang/gin)    |
| 企业级一站式类似SpringBoot | [GoFrame](/language/golang/goframe)    |
|                            | [GoZero](/language/golang/go-zero)    |
| 微服务云原生               | [Kratos](/language/golang/kratos)    |
|                            | [Hertz](/language/golang/hertz)    |

:::

# 1. 简介

> go-zero是一个集成了各种工程实现的web和rpc框架，通俗的来说，go-zero既是一个web框架，又是一个微服务框架。官网 https://go-zero.dev/
>
> go-zero提供了极简的API定义和强大的代码生成工具goctl，可以大幅提升开发效率，定义好api之后通过goctl可以快速生成工程diamante
>
> go--zero中还内置了微服务治理能力，比如**<font color=blue>限流、熔断、降级、服务发现，负载均衡，链路追踪等微服务治理能力</font>**，无需额外的配置和代码即可使用

## 1. go-zero和Gin的对比

| 维度     | go-zero                       | gin                                    |
| -------- | ----------------------------- | -------------------------------------- |
| 核心定位 | 面向微服务的全栈式框架        | 轻量级Web框架，高性能、简洁易用        |
| 用途     | 构建高性能API接口与微服务     | 构建高性能、Web应用                    |
| 设置     | 工具大于约定，工程化，标准化  | 灵活简洁，高性能路由                   |
| 治理能力 | 内置 （限流 熔断 服务发现等） | 依赖中间件                             |
| 开发效率 | 高（提供goctl工具链生成代码） | 中（灵活但需要手动完成工作）           |
| 协议支持 | 同时支持HTTP和RPC（gRPC)      | 主要支持Http和Https                    |
| 适用场景 | 构建Api和大型复杂的微服务项目 | 快速构建Api或构建需要模板渲染的web应用 |
| 发布日期 | 2020.8                        | 2014                                   |

## 2. goctl生成项目示例

### 1. 生成单体应用

1. 创建api文件

> 创建一个`shop.api`文件，等会用goctl生成项目

```txt
syntax = "v1"

// 定义类型快，
// 轮播图结构
type (
    FocusResp {
        Result []*Focus `json:"result"`
    }
    Focus {
        Id int64 `json:"id"`
        Name string `json:"name"`
        Pic string `json:"pic"`
        Url string `json:"url"`
        Position int32 `json:"position"`
    }
)
// 文章结构
type (
    ArticleResp {
        Result []*Article `json:"result"`
    }
    Article {
        Id int64 `json:"id"`
        Title string `json:"title"`
        Content string `json:"content"`
    }
)
// 服务端定义
@server(
    group: focus
    prefix: /api/focus
)

service shop-api {
    @handler GetFocusList
    get /list returns (FocusResp)
}
// 路由定义
@server(
    group: article
    prefix: /api/article
)
// 详细的路由定义
service shop-api {
    @handler GetArticleList
    get /list returns (ArticleResp)
}

```

2. 使用命令生成项目

```shell
goctl api go --api shop.api --dir .
```

3. 如果提示goctl不是内部或外部命令，就先安装

```shell
go install github.com/zeromicro/go-zero/tools/goctl@latest
# 查看版本
goctl --version
```

4. 生成项目后下载依赖，然后重启

```shel
go mo tidy 
# 使用这个可以热加载
go install github.com/gravityblast/fresh@latest
# 使用安装
fresh
```

5. 目录结构

```text
go_zero_demo
│  .gitignore
│  go.mod
│  go.sum
│  readme.md
│  shop.api -- api定义文件
│  shop.go -- 程序主入口     
├─etc
│      shop-api.yaml --API服务配置寄文件
├─internal
│  ├─config  -- 配置目录
│  │      config.go --配置结构体和加载逻辑
│  ├─handler --services目录 这个目录是自动生成的几乎不用管，只改logic里边的方法就行了
│  │  │  routes.go --路由注册配置
│  │  ├─article	
│  │  │      getarticledetailhandler.go
│  │  │      getarticlelisthandler.go
│  │  └─focus
│  │          getfocuslisthandler.go
│  ├─logic  --生成的业务逻辑都在这里，修改这里的方法就可以了
│  │  ├─article
│  │  │      getarticledetaillogic.go
│  │  │      getarticlelistlogic.go
│  │  └─focus
│  │          getfocuslistlogic.go
│  ├─svc
│  │      servicecontext.go -- 服务上下文
│  └─types
│          types.go 请求响应结构体定义
└─tmp
        runner-build.exe
```

### 2. 生成微服务项目

#### 1. 生成Server端

1. proto文件，用于grpc远程调用

```go
# 用这个命令生成一个用来测试心跳包的proto文件
goctl rpc -o greet.proto
```

```prot
# 这个代码主要就是用来测试心跳的。
syntax = "proto3";

package greet;
option go_package="./greet";

message Request {
  string ping = 1;
}

message Response {
  string pong = 1;
}

service Greet {
  rpc Ping(Request) returns(Response);
}

```

2. 生成gRPC服务端

| 参数       | 描述                                                         |
| ---------- | ------------------------------------------------------------ |
| go_out     | `proto`生成的go代码所在的目录，`proto`自己的参数             |
| go-rpc_out | `proto`生成的grpc代码所在的目录，`proto`自带的参数，**<font color=red>和go_out必须在同一个目录</font>** |
| zrpc_out   | `goctl rpc`自带的命令，go-zero生成的代码所在的目录           |

```shell
goctl rpc protoc greet.proto --go_out=./grpc-server --go-grpc_out=./grpc-server --zrpc_out=./grpc-server
```

3. 生成的yml

```yaml
Name: greet.rpc
ListenOn: 0.0.0.0:8080
# 这下边的是注册中心，直连的话可以把Etcd都注释掉
Etcd:
  Hosts:
  - 127.0.0.1:2379
  Key: greet.rpc
```

#### 2. 创建一个简单的grpc-client

1. 在grpc-server的同级目录创建一个grpc-client目录
2. 把grpc-server里边生成的greet目录复制过去
3. 创建client.go文件

```go
package main

import (
	"context"
	"grpc-client/greet"
	"log"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func main() {
	conn, err := grpc.NewClient("0.0.0.0:8080", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatal(err)
	}
	client := greet.NewGreetClient(conn)
	resp, err := client.Ping(context.Background(), &greet.Request{Ping: "ping"})
	if err != nil {
		log.Fatal(err)
		return
	}
	log.Println(resp)
}
```

4. 初始化并安装依赖

```go
go mod init grpc-client
go mod tidy
```

5. 启动

```shell
fresh
```

# 2. 安装

## 1. 安装goctl

```shel
go install github.com/zeromicro/go-zero/tools/goctl@latest
# 查看版本
goctl --version
```

## 2. 安装protoc

> protoc是一个用于生成代码的工具，它可以根据proto文件生成c++ Java Python Go Php等多种语言的代码，gRPC的代码生成还依赖protoc-gen-go,protoc-gen-go-grpc插件来配合生成go语言的gROC代码

```shell
goctl env check --
```

## 3. 相关命令

1. 创建项目

```shell
# 使用命令创建项目
goctl api new first_demo
# 当然也可以使用.api文件来创建
goctl api go --api sjop.api --dir .
```

2. 生成文档

```shell
goctl api doc --dir . --o ./doc
```

3. 生成对应语言的调用文件

```shell
# 支持 go ts dart java等多种语言，其他语言需要插件
goctl api dart --api shop.api --dir ./dart
goctl api ts --api shop.api --dir ./ts
```



## 4. 配置修改

### 1. 从配置文件中注入

> 在first_demo中添加数据库配置

```yml
Name: shop-api
Host: 0.0.0.0
Port: 8888
Mysql:
  Database: root:dream@tcp(127.0.0.1:3306)/gorm_demo?charset=utf8mb4&parseTime=True&loc=Local
```

> 修改`config/config.go`,这样在其他地方就能用到这个配置了

```go
package config

import "github.com/zeromicro/go-zero/rest"

type Config struct {
	rest.RestConf
	Mysql struct {
		Database string
	}
}
```

```go
func main() {
	flag.Parse()

	var c config.Config
	conf.MustLoad(*configFile, &c)

	server := rest.MustNewServer(c.RestConf)
	defer server.Stop()

	ctx := svc.NewServiceContext(c)
	handler.RegisterHandlers(server, ctx)
    // 例如这样
	fmt.Println(c.Mysql.Database)

	fmt.Printf("Starting server at %s:%d...\n", c.Host, c.Port)
	server.Start()
}
```

### 2. service上下文添加

> 主要是修改`svc/servicecontext.go`

```go
// Code scaffolded by goctl. Safe to edit.
// goctl 1.10.1

package svc

import (
	"go_zero_demo/internal/config"
)
// 修改这个就可以了
type ServiceContext struct {
	Config     config.Config
	DataSource string
}

func NewServiceContext(c config.Config) *ServiceContext {
	return &ServiceContext{
		Config:     c,
		DataSource: c.Mysql.Database,
	}
}
```

```go
func (l *GetArticleListLogic) GetArticleList() (resp *types.ArticleResp, err error) {
	// todo: add your logic here and delete this line
	print(l.svcCtx.DataSource)
	return
}
```



# 3. api语法详解

