:::tip
GORM是一个Go编写的ORM框架，支持MySQL, PostgreSQL, GaussDB, SQLite, SQL Server TiDB, and Oracle
[官方文档地址](https://gorm.io/zh_CN/docs/index.html)
:::    

# 1. 安装

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

