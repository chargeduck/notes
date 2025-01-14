:::tip
用来构建UI界面的地方
:::
# 1. 初步认识
> 在一个build()方法中，只允许有一个布局容器
**组件属性**

|    方法    |       示例       |   描述    |
|:--------:|:--------------:|:-------:|
| width()  | width('100%')  | 设置组件的宽度 |
| height() | height('100%') | 设置组件的高度 |

## 1. 相对容器创建页面
```ts
@Entry
@Component
struct Index {
    @State message: string = title;
    // 构建页面
    build() {
        RelativeContainer() {
            Text(this.message)
                .id('HelloWorld')
                .fontSize(50)
                .fontWeight(FontWeight.Bold)
                .alignRules({
                    center: { anchor: '__container__', align: VerticalAlign.Center },
                    middle: { anchor: '__container__', align: HorizontalAlign.Center }
                })
        }
        .height('100%')
        .width('100%')
    }
}
```
## 2、行列布局
```ts
const title: string = '就是测试数据'

@Entry
@Component
struct Index {
  @State message: string = title;

  build() {
      // 行
    Row() {
        // 列
      Column() {
        Text(this.message)
          .id('message')
          .fontSize(50)
          .fontWeight(FontWeight.Bold)
      }.width('100%')
    }.height('100%')
  }
}
```
# 2. 常用组件

## 1. 文本

> 通过 Text() 组件来创建文本

**文本属性**

|        方法         |                 示例                  |   描述    |
|:-----------------:|:-----------------------------------:|:-------:|
|       id()        |            id('message')            | 设置组件的id |
|    fontSize()     |            fontSize(50)             | 设置字体大小  |
|   fontWeight()    |     fontWeight(FontWeight.Bold)     | 设置字体粗细  |
|      color()      |          color(Color.Red)           | 设置字体颜色  |
| backgroundColor() |     backgroundColor(Color.Blue)     | 设置背景颜色  |
|  textOverflow()   | textOverflow(TextOverflow.Ellipsis) | 设置文本溢出  |
|    maxLines()     |             maxLines(1)             | 设置最大行数  |

> 文本溢出 `textOverFlow()`需要配合 `maxLines()`使用

```ts
build(){
    Column() {
        Text(this.message)
            .id('HelloWorld')
            .fontSize(50)
            // 设置字体粗细 可以是100 - 900的值，默认是 400 加粗是 700
            .fontWeight(FontWeight.Bold)
            .alignRules({
                center: { anchor: '__container__', align: VerticalAlign.Center },
                middle: { anchor: '__container__', align: HorizontalAlign.Center }
            })
            .color(Color.Red)
            .backgroundColor(Color.Blue)
            .textOverflow({
                overflow: TextOverflow.Ellipsis,
            })
            .maxLines(1)    
    }
}
```

## 2. 图片组件
> Image(url) 组件来创建图片，可以指定 本地图片 和 网络图片，
> 
> 使用网络图片直接放地址就可以了，
> 使用本地图片可以使用 `$r('app.media.fileName')`
```ts
build() {
    Column() {
        Image('https://img2.baidu.com/it/u=2430163735,700302077&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500')
            .width('100%')
        // 在 /resources/base/media 目录下创建图片
        Image($r('app.media.bluehair'))
            .width('100%')
    }.width('100%')
}
```
## 3. 输入框和按钮
> 通过 TextInput() 组件来创建输入框，
> 
> 通过 Button() 组件来创建按钮

|枚举|    描述    |
|:---:|:--------:|
|InputType.Normal|   无限制    |
|InputType.Password|  密码输入类型  |


```ts
build() {
    // 控制组件间的检举
    Column({ space: 10 }) {
      TextInput({
        placeholder: '请输入用户名'
      })
      // 通过type指定输入框的类型
      TextInput({
        placeholder: '请输入密码'
      }).type(InputType.Password)
      Button('登录')
        .buttonStyle(ButtonStyleMode.EMPHASIZED)
        .width(100)
    }.width('100%')
  }
}
```
## 4. SVG资源
> 通过 Image() 组件来创建SVG资源，通过`fillColor`来填充颜色
```ts
build() {
    Column() {
        Image($r('app.media.travel'))
           .width('100%')
           .fillColor(Color.Red)
    }.width('100%')
}
```
## 5. 盒子模型
> border padding margin这些东西，和css差不多的
```ts
Text($r('Padding Test'))
  .width('100%')
  .padding({
    left: 10,
    top: 10,
    right: 10,
    bottom: 10
  })
Text('Border')
    .width('100%')
   .border({
    left: 10,
    top: 10,
    right: 10,
    bottom: 10
  })
    .borderRadius({
        topLeft: 10,
        topRight: 10,
        bottomLeft: 10,
        bottomRight: 10
    })
}
```
## 6. backgroudImage
### 1. backgroundImage
> 通过 backgroundImage() 组件来创建背景图片
```ts
Text()
    .width('100%')
    .backgroundImage($r('app.media.travel'))
    .backgroundPosition(Alignment.CENTER)
```
### 2.  backgroundPosition
> 通过 backgroundPosition() 组件来设置背景图片的位置
```ts
Text()
.width('100%') 
.backgroundImage($r('app.media.travel'))
.backgroundPosition(Alignment.CENTER)
```
### 3. backgroundImageSize
> 通过 backgroundImageSize() 组件来设置背景图片的大小
1. 直接指定大小
```ts
Text()
.width('100%')
.backgroundImage($r('app.media.travel'))
.backgroundPosition(Alignment.CENTER)
.backgroundImageSize({
    width: 100,
    height: 100
})
```
2. 指定比例
> 这里有一个枚举类型 ImageSize

|        枚举         | 描述 |
|:-----------------:|:--:|
|  ImageSize.FILL   | 填充 |
| ImageSize.CONTAIN | 包含 |
|  ImageSize.COVER  | 覆盖 |
|  ImageSize.Auto   | 自动 |

```ts
Text()
.width('100%')
.backgroundImage($r('app.media.travel'))
.backgroundPosition(Alignment.CENTER)
.backgroundImageSize(ImageSize.COVER)
```
## x. 实现一个登录页

```ts
@Entry
@Component
struct Index {
  build() {
    Column({ space: 10 }) {
      Image('https://img2.baidu.com/it/u=2430163735,700302077&fm=253&fmt=auto&app=138&f=JPEG?w=100&h=100')
        .width('40%')
        .id('logo')
      TextInput({
        placeholder: '请输入用户名'
      }).id('username')
      TextInput({
        placeholder: '请输入密码'
      }).type(InputType.Password)
        .id('password')
      Button('登录')
        .buttonStyle(ButtonStyleMode.EMPHASIZED)
        .width('100%')
        .id('loginBtn')
      Row({space: 10}) {
        Text('前往注册')
          .id('toReg')
          .fontSize(16)
          .fontColor(Color.Gray)
        Text('忘记密码')
          .id('forgetPwd')
          .fontSize(16)
          .fontColor(Color.Gray)
      }
    }.width('100%')
    .padding(20)
  }
}
```

# 3. 布局
## 1. 线性布局
### 1. 水平垂直对齐
> 线性布局(LinearLayout)是一种常见的布局方式，它可以将子组件按照水平或垂直方向排列。
> 
> 通过线性容器 `Column()垂直方向排列` 和 `Row() 水平方向排列` 来实现
> 
> 可以通过`.justifyContent()`来设置子组件的对齐方式, 包含以下几个枚举值

| 序号 |           枚举           |      描述      |
|:--:|:----------------------:|:------------:|
| 1  |    FlexAlign.Start     |    从顶部开始     |
| 2  |    FlexAlign.Center    |      居中      |
| 3  |     FlexAlign.End      |      底部      |
| 4  | FlexAlign.SpaceBetween |     两端对齐     |
| 5  | FlexAlign.SpaceAround  | 每个子组件两侧的间隔相等 |
| 6  | FlexAlign.SpaceEvenly  | 每个子组件之间的间隔相等 |


```ts
// 可以通过下边这个案例实验一下
Column({ space: 10 }) {
      Text()
        .width(200)
        .height(100)
        .border({ width: 2 })
        .backgroundColor(Color.Gray)
      Text()
        .width(200)
        .height(100)
        .border({ width: 2 })
        .backgroundColor(Color.Gray)
      Text()
        .width(200)
        .height(100)
        .border({ width: 2 })
        .backgroundColor(Color.Gray)
    }.width('100%')
    .height('100%')
    .backgroundColor(Color.Pink)
    .justifyContent(FlexAlign.Start)
```
### 2. 交叉轴对齐
> 交叉轴对齐(alignItems)是指在垂直方向上的对齐方式。
>
> 可以通过`.alignItems()`来设置子组件的对齐方式, 前三个给Row()使用，后三个给Column()使用

| 序号 |           枚举           |  描述  |
|:--:|:----------------------:|:----:|
| 1  |        jus.Top         | 垂直居上 |
| 2  |  VerticalAlign.Center  | 垂直居中 |
| 3  |  VerticalAlign.Bottom  | 垂直居下 |
| 4  | HorizontalAlign.Start  | 水平居左 |
| 5  | HorizontalAlign.Center | 水平居中 |
| 6  |  HorizontalAlign.End   | 水平居右 |

**实现一个列表页的效果**

```ts
Column() {
      Row() {
        Column({space: 10}) {
          Text('玩一玩')
            .fontSize(18)
            .align(Alignment.Start)
            .fontWeight(FontWeight.Bolder)
          Text('签到兑礼 | 超多大奖 超好玩')
            .fontWeight(8)
            .fontColor('#999')
        }.alignItems(HorizontalAlign.Start)
        Row({space: 10}) {
          Image($r('app.media.tree'))
            .backgroundColor('#efefef')
            .width(40)
            .borderRadius(5)
          Image($r('app.media.right'))
            .width(20)
            .margin({
              left: 20
            })
        }.justifyContent(FlexAlign.SpaceBetween)
      }
      .width('100%')
      .height(80)
      .padding(20)
      .justifyContent(FlexAlign.SpaceBetween)
      .borderRadius(20)
      .backgroundColor('#fab')
    }.width('100%')
    .height('100%')
    .backgroundColor('#ccc')
```
### 3. 自适应伸缩
> 设置 `layoutWeight`的子元素和兄弟元素，会按照 `权重`来分配空间
```ts
Row() {
    Text('Left')
        .backgroundColor(Color.Red)
        .layoutWeight(80)
    Text('Right')
        .backgroundColor(Color.Pink)
        .layoutWeight(20)
}
```
