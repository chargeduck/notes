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
>
> **注意：**想要正确的处理 `time.Time` ，您需要带上 `parseTime` 参数，

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

## 3. CURD操作

### 1. 查询

1. 查询所有数据

```go
func GetStudentList(c *gin.Context) {
	var studentList []models.Student
	models.DB.Find(&studentList)
	c.JSON(http.StatusOK, studentList)
}
```

2. 添加where条件

```go
// 获取成年的用户列表
func GetAdultUserList(c *gin.Context) {
	var adultUserList []models.User
	models.DB.Where("age >= ?", 18).Find(&adultUserList)
	c.JSON(http.StatusOK, adultUserList)
}
```

3. 条件查询

```go
func GetUserById(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 0, 64)
	user := models.User{ID: int(id)}
	dbResult := models.DB.First(&user)
	if dbResult.Error == gorm.ErrRecordNotFound {
		c.JSON(http.StatusBadRequest, gin.H{"error": "用户不存在"})
		return
	}
	c.JSON(http.StatusOK, user)
}
```

4. in

```go
user := models.User{}
models.DB.Where("id in (?)", []int{3,5,6}).Find(&user)
```

5. 返回自定义字段

```go
models.DB.Select("id", "age").Find(&user)
```

6. 排序

```go
models.DB.Order("id desc").Find(&userList)
```

7. 分页

```go
models.DB.Offset(2).Limit(10).Find(&userList)
```

8. 统计数量

```go
var num int
models.DB.Find(&userList).count(&num)
```

### 2. 新增

```go
func AddUser(c *gin.Context) {
	user := []models.User{}
	c.ShouldBind(&user)
	user.AddTime = utils.CustomTime{time.Now()}
	models.DB.Create(&user)
	c.JSON(http.StatusOK, user)
}
```

### 3. 修改

1. 使用Save修改所有的字段

```go
func EditUser(c *gin.Context) {
	user := models.User{}

	// 1. 参数绑定 + 错误判断
	if err := c.ShouldBind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误: " + err.Error()})
		return
	}

	// 2. 必须先查用户是否存在
	dbResult := models.DB.Where("id = ?", user.ID).First(&user)

	// 3. 正确判断：用户不存在
	if dbResult.Error == gorm.ErrRecordNotFound {
		c.JSON(http.StatusBadRequest, gin.H{"error": "用户不存在"})
		return
	}

	// 4. 其他数据库错误（如连接失败）
	if dbResult.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询失败"})
		return
	}

	// 5. 更新用户（推荐用 Updates，只更新非零字段）
	models.DB.Model(&user).Updates(&user)

	// 返回
	c.JSON(http.StatusOK, user)
}
```

2. 修改部分字段

```go
user := models.User{}
models.Db.Model(&user)
.Where("id = ?", 6)
.Update("name", "test")
```

### 4. 删除

```go
func DeleteUser(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 0, 64)
	user := models.User{ID: int(id)}
	dbResult := models.DB.Delete(&user)
	if dbResult.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}
```

### 5. 使用原生SQL

```go
var user models.User
models.DB.Raw("select * from user where id = ?", 6).Scan(&user)
models.DB.Exec("delete from user where id = ?", 6)
```

## 4. 表关联查询

### 1. 一对一

### 2. 一对多

### 3. 多对多

# X. 遇到的一些问题

## 1. Error #01: json: unsupported type: func() time.Time

> 官方说了如果数据库类型是`datetime`类型的话，需要开启`parseTime=True`,然后我的代码还是有这个问题。

```go
// 这是有问题的代码
func GetStudentList(c *gin.Context) {
	studentList := models.DB.Find(&models.Student{})
	c.JSON(http.StatusOK, studentList)
}
// 解决的方法是先创建一个切片,然后再查询，这样就不会
func GetStudentList(c *gin.Context) {
	var studentList []models.Student
	models.DB.Find(&studentList)
	c.JSON(http.StatusOK, studentList)
}
```

## 2. time.Time类型格式化

> 原版的直接输出给前端的格式不对`2026-05-18T21:56:15+08:00`，需要添加一个自定义的时间类，这样方便控制时间格式

```go
package utils

import (
	"database/sql/driver"
	"encoding/json"
	"time"
)

// CustomTime 自定义时间类型，用于 JSON 序列化和数据库交互
type CustomTime struct {
	time.Time
}

// MarshalJSON 实现 json.Marshaler 接口，格式化时间为 yyyy-MM-dd HH:mm:ss
func (ct CustomTime) MarshalJSON() ([]byte, error) {
	return json.Marshal(ct.Format("2006-01-02 15:04:05"))
}

// UnmarshalJSON 实现 json.Unmarshaler 接口，解析时间字符串
func (ct *CustomTime) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}
	t, err := time.Parse("2006-01-02 15:04:05", s)
	if err != nil {
		return err
	}
	ct.Time = t
	return nil
}

// Value 实现 driver.Valuer 接口，用于数据库写入
func (ct CustomTime) Value() (driver.Value, error) {
	if ct.Time.IsZero() {
		return nil, nil
	}
	return ct.Time, nil
}

// Scan 实现 sql.Scanner 接口，用于数据库读取
func (ct *CustomTime) Scan(value interface{}) error {
	if value == nil {
		ct.Time = time.Time{}
		return nil
	}
	switch v := value.(type) {
	case time.Time:
		ct.Time = v
	case []byte:
		t, err := time.Parse("2006-01-02 15:04:05", string(v))
		if err != nil {
			return err
		}
		ct.Time = t
	case string:
		t, err := time.Parse("2006-01-02 15:04:05", v)
		if err != nil {
			return err
		}
		ct.Time = t
	}
	return nil
}
```

```go
type User struct {
    AddTime utils.CustomTime `gorm:"column:add_time"`
}
```

