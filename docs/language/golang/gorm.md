:::tip
GORM是一个Go编写的ORM框架，支持MySQL, PostgreSQL, GaussDB, SQLite, SQL Server TiDB, and Oracle
[官方文档地址](https://gorm.io/zh_CN/docs/index.html)
:::    

# 1. 简单使用

## 1. 安装

```shell
import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)
func main() {
  // 参考 https://github.com/go-sql-driver/mysql#dsn-data-source-name 获取详情
  dsn := "user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
  db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
}
```

## 2. 创建连接类

> 首先创建`models`目录用来存放数据库连接和实体类

- 数据库连接类

```go
package models

import (
	"go.uber.org/zap"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB
var err error
var log *zap.SugaredLogger

func InitDBConnection() {
	dsn := "root:dream@tcp(127.0.0.1:3306)/gorm_demo?charset=utf8mb4&parseTime=True&loc=Local"
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Errorf("数据库连接失败: %v", err)
	}
}

```

- 自定义的Log输出类

```go
package utils

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
)

// 全局日志
var log *zap.Logger

func InitLog() {
	// 日志文件切割（logback 效果）
	fileWriter := &lumberjack.Logger{
		Filename:   "app.log",
		MaxSize:    128,
		MaxBackups: 10,
		MaxAge:     30,
		Compress:   true,
	}

	// 同时输出到：控制台 + 文件
	core := zapcore.NewTee(
		// 控制台输出（你能看到）
		zapcore.NewCore(
			zapcore.NewConsoleEncoder(zap.NewDevelopmentEncoderConfig()),
			zapcore.AddSync(os.Stdout),
			zap.DebugLevel, // 关键：开 Debug 才会打印所有日志
		),
		// 文件输出（JSON格式）
		zapcore.NewCore(
			zapcore.NewJSONEncoder(zap.NewProductionEncoderConfig()),
			zapcore.AddSync(fileWriter),
			zap.InfoLevel,
		),
	)

	// 初始化日志
	log = zap.New(core, zap.AddCaller())
}
```

- 库表实体类

> 1. 结构体名称首字母必须大写
>
> 2. 字段首字母必须大写，且是大驼峰
>
> 3. 默认的表名是结构体名称的复数，结构体定义的是User则操作的是users表，如果想要改变结构体的默认表名，需要添加以下方法
>
>    ```go
>    func (User) TableName() string{
>        return "user"
>    }
>    ```

```go
package models

import "time"

type User struct {
	Id       int
	Username string
	Age      int
	Email    string
	AddTime  time.Time
}

// 修改默认表名 user
func (User) TableName() string {
	return "user"
}
```

