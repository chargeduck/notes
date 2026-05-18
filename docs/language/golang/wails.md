:::tip
Wails是一个Go编写的跨平台的Web应用框架，支持Windows、macOS和Linux。<br/>
使用系统自带的webview组件，无需额外安装依赖。相较于Electron来说，安装包更小，启动速度更快。
:::

### 1. 通用的工具类记录

## 1. Log打印工具类

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

