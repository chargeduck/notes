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
@State message: string = 'HelloWorld!';
build(){
    Column() {
        Text(this.message)
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
> 当一段文本中的其中一段内容需要单独定制样式的时候，可以使用 `Span()` 组件
```ts
Text() {
    Span('我已经阅读并同意')
    Span('《B站隐私政策》').fontColor('#3274f6')
    Span('《B站用户服务协议》').fontColor('#3274f6')
    Span('未注册的手机号将自动创建B站账号')
}
.fontSize(12)
.fontColor('#666')
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
> 通过 TextInput() 组件来创建输入框，想要实现变量和输入框的双向绑定，需要在text属性指定的变量前添加`$$`
> 
> <font color=red>输入框的提交事件为onSubmit()</font>

|枚举|    描述    |
|:---:|:--------:|
|InputType.Normal|   无限制    |
|InputType.Password|  密码输入类型  |


```ts
@State content: string = 'Hello World'
build() {
    // 控制组件间的检举
    Column({ space: 10 }) {
      TextInput({
        placeholder: '请输入用户名',
        text: $$this.content
      })
      .onsubmit(() => {
        console.log('submit', this.content)
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
## 7. 轮播图
> Swiper()组件来实现轮播图,当设置多个组件的时候，可以进行轮播展示
>
> 只要在Swiper组件外统一设置样式即可。

```ts
 @State swiperItems: string[] = [
    'https://img2.baidu.com/it/u=2430163735,700302077&fm=253&fmt=auto&app=138&f=JPEG?w=100&h=100',
    'https://img2.baidu.com/it/u=1536541335,1580047643&fm=253&fmt=auto&app=120&f=JPEG?w=664&h=374',
    'https://img1.baidu.com/it/u=1330049678,4187153037&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500'
  ]

build() {
    Swiper(){
        // 这个可以看下边的循环渲染的内容
      ForEach(this.swiperItems, (item: string, index: number) => {
        Image(item)
          .width('100%')
          // 设置宽高比
          .aspectRatio(1)
      })
    }
    .loop(true)
    .autoPlay(true)
    .width('100%')
    .height(400)
    .indicator(Indicator.dot() //小圆点样式
        .itemWidth(20)
        .itemHeight(20)
        .color(Color.Black)
        .selectedItemWidth(100)
        .selectedItemHeight(20)
        .selectedColor(Color.Pink)

    )
}
```
## 8. Scroll
> 滚动组件，通过Scroll()组件来实现滚动
> 1. 通过Scroll组件设置尺寸
> 2. 设置溢出的子组件（只支持一个子组件）
> 3. 滚动方向，支持横向和纵向，默认是纵向
### 1. 核心用法
```ts
Scroll() {
  Column({ space: 10 }) {
    ForEach(Array.from({ length: 100 }), (item: string, index: number) => {
      Text(`测试文本内容${index}`)
        .backgroundColor(Color.Orange)
        .fontSize(30)
        .fontColor(Color.White)
    })
  }
}.width('100%')
.height(400)
```
### 2. 常见属性

| 方法             | 示例                                   | 描述      |
|----------------|--------------------------------------|---------|
| scrollable     | scrollable(ScrollDirection.Vertical) | 设置滚动方向  |
| scrollBar      | scrollBar(BarState.Auto)             | 设置滚动条状态 |
| scrollBarColor | scrollBarColor('#5CBEFE')            | 设置滚动条颜色 |
| scrollBarWidth | scrollBarWidth(2)                    | 设置滚动条宽度 |
| edgeEffect     | edgeEffect(EdgeEffect.Fade)          | 设置滑动效果  |

```ts
.scrollable(ScrollDirection.Vertical)// 设置滚动方向为垂直
.scrollBar(BarState.Auto)// 滚动条状态
.scrollBarColor('#5CBEFE')// 滚动条颜色
.scrollBarWidth(2)
.edgeEffect(EdgeEffect.Fade) //滑动效果 
```
### 3. 控制器
> 通过创建一个Scroller对象，将之与Scroll组件关联起来，可以控制滚动的位置和行为。
```ts
scroller: Scroller = new Scroller()
build() {
    Column() {
      Scroll(this.scroller) {
        Column({ space: 10 }) {
          ForEach(Array.from({ length: 100 }), (item: string, index: number) => {
            Text(`测试文本内容${index}`)
              .backgroundColor(Color.Orange)
              .fontSize(30)
              .fontColor(Color.White)
          })
        }
      }
      .width('100%')
      .height(400)
      Button('控制滚动条位置')
        .margin(20)
        .onClick(() => {
          // 回到顶部
          this.scroller.scrollEdge(Edge.Top)
        })
      Button('滚动距离')
        .onClick(() => {
          AlertDialog.show({
            message: `${this.scroller.currentOffset().yOffset}`
          })
        })
    }
}
```
### 4. 事件
> Scroll组件提供了一些时间，可以让开发者在适当的时候添加事件
```ts
Scroll(this.scroller) {
    Column({ space: 10 }) {
      ForEach(Array.from({ length: 100 }), (item: string, index: number) => {
        Text(`测试文本内容${index}`)
          .backgroundColor(Color.Orange)
          .fontSize(30)
          .fontColor(Color.White)
      })
    }
}
.width('100%')
.height(400)
.onWillScroll((x, y) => {
    console.log(`滑动距离 ${x} : ${y}`)
})

```
## 9. tabs
> 通过Tabs()组件来实现tabs

```ts
@State titles: string[] = ['首页', '关注', '热门', '推荐', '军事', '科技', '生活', '八卦', '美食', '旅行']
build() {
// 控制tabs在顶部还是底部
Tabs({barPosition: BarPosition.Start}) {
  ForEach(this.titles, (item: string) => {
    TabContent(){
      Text(`${item}展示内容`)
    }.tabBar(item)
  })
}
// .vertical(true) // 设置为垂直导航
.scrollable(true)
// 如果tab内容较多，可以设置为滚动导航栏
.barMode(BarMode.Scrollable)
}
```
## 10. List
> 列表组件，感觉比Grid布局要方便一点
```ts
List() {
    ForEach(Array.from({ length: 100 }), (item: number, index: number) => {
      ListItem() {
        Row() {
          Text(`${index}`).fontSize(30)
        }.width('100%')
        .height(100)
        .backgroundColor(Color.Brown)
      }.padding(10)
    })
}
.layoutWeight(1)
.width('100%')
.borderWidth(2)
.backgroundColor(Color.Blue)
// 列表方向    
.listDirection(Axis.Vertical)
// 展示几行几列
.lanes(2, 5)
.scrollBar(BarState.Auto)
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
> 设置 `layoutWeight`的子元素和兄弟元素，会按照 `权重`来分配剩余空间
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
### 4. 登录页
> 可以通过Blank()组件来填充剩余空间
> 
> 使用Span()组件来实现文本的样式
```ts
@Entry
@Component
struct Index {
  @State bLogo: string = 'https://img2.baidu.com/it/u=2430163735,700302077&fm=253&fmt=auto&app=138&f=JPEG?w=100&h=100'

  build() {
    Column({ space: 10 }) {
      // top
      Row() {
        Image($r('app.media.cancel'))
          .width(18)
          .height(18)
        Text('帮助')
          .fontSize(16)
      }.justifyContent(FlexAlign.SpaceBetween)
      .height(20)
      .width('100%')

      // logo
      Image(this.bLogo)
        .width(250)
        .height(250)
      // 国家区域
      Row() {
        Text('国家/地址')
          .layoutWeight(1)
          .fontColor('#666')
        Text('中国(+86)')
          .fontColor('#666')
          .margin({
            right: 5
          })
        Image($r('app.media.right'))
          .width(20)
      }
      .width('100%')
      .height(40)
      .padding({
        left: 15,
        right: 10
      })
      .borderRadius(20)
      .border({
        width: 1,
        color: '#333840'
      })

      // 手机号
      TextInput({
        placeholder: '请输入手机号'
      })
        .placeholderColor('#666')
        .width('100%')
        .height(40)
        .margin({
          top: 20
        })
        .padding({
          left: 15,
        })
        .borderRadius(20)
        .border({
          width: 1,
          color: '#333840'
        })
      // 用户协议
      Row() {
        Checkbox()
          .width(10)
          .margin({
            top: 7
          })
        Text() {
          Span('我已经阅读并同意')
          Span('《B站隐私政策》')
            .fontColor('#3274f6')
          Span('《B站用户服务协议》')
            .fontColor('#3274f6')
          Span('未注册的手机号将自动创建B站账号')
        }.fontSize(12)
        .lineHeight(20)
        .fontColor('#666')
      }.margin({
        top: 20
      }).alignItems(VerticalAlign.Top)
      // 登录按钮
      Button('登录')
        .width('100%')
        .height(50)
        .margin({
          top: 15
        })
        .borderRadius(25)
      // 注册
      Row({space: 25}) {
        Text('新用户注册')
          .fontColor('#666')
          .fontSize(15)
        Text('账户密码登录')
          .fontColor('#666')
          .fontSize(15)
        Text('无法登陆')
          .fontColor('#666')
          .fontSize(15)
      }.margin({
        top: 15
      })
      // 填充空白区域
      Blank()
      Column() {
        Text('其他登录方式')
          .height(22)
          .fontColor('#666')
          .fontSize(14)
          .margin({
            bottom: 15
          })
        Row({space: 50}) {
          Image(this.bLogo).width(34)
          Image(this.bLogo).width(34)
          Image(this.bLogo).width(34)
          Image(this.bLogo).width(34)
        }
      }.width('100%')
      .margin({
        bottom: 30
      })
    }.padding(20)
    .width('100%')
    .height('100%')
  }
}
```
## 2. 弹性布局
> 弹性容器组件 Flex()，可以让子组件按照弹性布局进行排列。默认从左往右排列
```ts
// Flex默认水平往右，垂直从上到下
Flex({
    // 主轴对齐方向
    direction: FlexDirection.Row,
    // 主轴（x）对齐方式
    justifyContent: FlexAlign.SpaceBetween,
    // 交叉轴对齐方式（y）
    alignItems: ItemAlign.Start,
    // 换行方式 Wrap多行 NoWrap 单行
    wrap: FlexWrap.Wrap  
}) {
  Text()
    .width(80)
    .height(60)
    .backgroundColor(Color.Pink)
    .border({
      width: 1,
      color: Color.Black
    })
  Text()
    .width(80)
    .height(60)
    .backgroundColor(Color.Pink)
    .border({
      width: 1,
      color: Color.Black
    })
  Text()
    .width(80)
    .height(60)
    .backgroundColor(Color.Pink)
    .border({
      width: 1,
      color: Color.Black
    })
}
.width('100%')
.height('100%')
.backgroundColor('#5F9A5C')
```
## 3. 绝对定位
> position用来控制组件位置，可以实现层叠效果。
> 
> 参照<font color=red>父组件左上角</font>偏移。绝对定位后的组件，<font color=red>不在占用自身的原有位置</font>

```ts
Column() {
  Text('A')
    .width(80)
    .height(80)
    .backgroundColor(Color.Green)
  Text('B')
    .width(80)
    .height(80)
    .backgroundColor(Color.Yellow)
    .position({
      x: 0,
      y: 0
    })
  Text('C')
    .width(80)
    .height(80)
    .backgroundColor(Color.Gray)
}
.width('100%')
.height('100%')
.backgroundColor('#5F9A5C')
```
## 4. 层叠布局
> 类似下边弹出的抽屉那种效果，使用Stack()组件来实现，代码写的越靠下，展示的时候越靠上

```ts
Stack(){
  Column()
    .width('100%')
    .height('100%')
    .backgroundColor('#aaa')
  Column()
    .width('50%')
    .height('50%')
    .backgroundColor('#999')
  Column()
    .width('25%')
    .height('25%')
    .backgroundColor('#000')

}
```
## 5. 网格布局
> 网格布局(Grid)是一种常见的布局方式，它可以将子组件按照网格的形式排列。
>
> 这个设置行列的方式奇奇怪怪的
```ts
Grid() {
    ForEach([1,2,3,4,5,6,7,8,9,10,11,12], () => {
        GridItem(){
            Column() {

            }.width('100%')
                .height('100%')
                .backgroundColor(Color.Green)
        }
    })
}
// 一行四列fr
.columnsTemplate('1fr 1fr 1fr 1fr')
// 一共三行， 第二行占一半
.rowsTemplate('1fr 2fr 1fr')
// 行列间距
.rowsGap(5)
.columnsGap(5)
```


## 6. 循环渲染
> 使用ForEach方法来遍历数组，将相同的元素一起渲染，类似 `v-for`

```ts
@State category: Array<string> = ['玄幻','奇幻','男频','女频']

build() {
    Column() {
      ForEach(this.category, (item: string, index: number) => {
        Text(item)
          .fontColor(Color.Orange)
          .fontSize(18)
          .margin(10)
      })
    }
}
```

## x. 实现一个抽卡逻辑
```ts

interface Card {
  title: string,
  count: number
}

@Entry
@Component
struct Index {
  // 状态变量，可以更改
  @State bLogo: string = 'https://img2.baidu.com/it/u=2430163735,700302077&fm=253&fmt=auto&app=138&f=JPEG?w=100&h=100'
  @State cardArr: Card[] = [
    { title: '午马', count: 1 },
    { title: '牛马', count: 0 },
    { title: '牛乌', count: 0 },
    { title: '午乌', count: 0 },
    { title: '牛鸟', count: 0 },
    { title: '午鸟', count: 0 }
  ]
  @State randomIndex: number = 0
  /**
   * 这是通过透明度和zIndex来实现的遮罩
   * 当然也可以通过控制两个Column.visibility()来实现
   */
  @State shadowOpacity: number = 0.5
  @State shadowIndex: number = 999

  build() {
    Stack() {
      // 卡池
      Column() {
        Grid() {
          ForEach(this.cardArr, (item: Card, index: number) => {
            GridItem() {
              Column() {
                Badge({
                  count: item.count,
                  position: BadgePosition.RightTop,
                  style: {
                    fontSize: 14,
                    badgeSize: 16,
                    badgeColor: '#FA2A2D'
                  }
                }) {
                  Column() {
                    Image(this.bLogo)
                      .width(100)
                      .height(100)
                    Text(item.title)
                  }
                }
              }
            }
          })
        }
        // 一行四列fr
        .columnsTemplate('1fr 1fr 1fr')
        // 一共三行， 第二行占一半
        .rowsTemplate('1fr 1fr 1fr 1fr')
        // 行列间距
        .rowsGap(1)
        .columnsGap(5)
        .width('100%')
        .height(450)

        Button('立即抽奖')
          .width('80%')
          .height(50)
          .borderRadius(25)
          .margin(20)
          .backgroundColor('#EB417F')
          .onClick(() => {
            this.shadowOpacity = 0.6
            this.shadowIndex = 999
            this.randomIndex = Math.floor(Math.random() * 6)
          })
      }

      // 遮罩层
      Column({ space: 30 }) {
        Text(`恭喜获得生肖卡${this.cardArr[this.randomIndex].title}`)
          .fontColor('#F5EBCF')
          .fontSize(25)
          .fontWeight(FontWeight.Bold)
        Image(this.bLogo)
          .width(200)
          .height(200)
        Button('开心收下')
          .fontColor('#fff')
          .width('60%')
          .height(50)
          .backgroundColor(Color.Transparent)
          .borderWidth(3)
          .borderColor('#fff')
          .borderRadius(25)
          .onClick(() => {
            this.shadowOpacity = 0
            this.shadowIndex = -1
            let randomCard = this.cardArr[this.randomIndex]
            this.cardArr[this.randomIndex] = {
              title: randomCard.title,
              count: ++randomCard.count
            }
            console.log(JSON.stringify(this.cardArr))
          })
      }
      .width('100%')
      .height('100%')
      .backgroundColor('#cc000000')
      .justifyContent(FlexAlign.Center)
      // 透明度
      .opacity(this.shadowOpacity)
      .zIndex(this.shadowIndex)
      // 动画时间
      .animation({
        duration: 1000
      })
    }

  }
}
```

# 4.  样式复用

> 以上的代码中样式代码需要重复书写，可以使用特定的注解来实现样式复用

| 注解       | 描述               | 传递参数 |
|----------|------------------|------|
| @Extend  | 拓展组件（样式，事件)      | 支持   |
| @Styles  | 抽取通用属性，事件        | 不支持  |
| @Builder | 自定义函数，相当于创建一个子组件 | 支持   |

## 1. @Extend
> 通过@Extend注解来实现样式复用,主要针对特定组件
- 原始写法
```ts
Swiper(){
 Text('222')
   .textAlign(TextAlign.Center)
   .backgroundColor(Color.Red)
   .fontColor(Color.White)
   .fontSize(30)
   .onClick(() => {
     AlertDialog.show({
       message: '轮播文字1'
     })
   })
  Text('222222222222')
    .textAlign(TextAlign.Center)
    .backgroundColor(Color.Red)
    .fontColor(Color.White)
    .fontSize(30)
    .onClick(() => {
      AlertDialog.show({
        message: '轮播文字222'
      })
    })
}
```
- @Extend 写法
```ts
@Extend(Text)
function swiperTextStyle(fontColor: ResourceColor, message: string) {
  .textAlign(TextAlign.Center)
  .backgroundColor(Color.Red)
  .fontColor(fontColor)
  .fontSize(30)
  .onClick(() => {
    AlertDialog.show({
      message
    })
  })
}


@Entry
@Component
struct Index {
  build() {
    Swiper() {
      Text('11111111111111111111')
        .swiperTextStyle(Color.Blue, '轮播图11111111')
      Text('222222222222')
        .swiperTextStyle(Color.Orange, '轮播图2222222222222')
    }
    .loop(true)
    .autoPlay(true)
    .width('100%')
    .height(400)
  }
}
```
## 2. @Style
> 侧重于抽取通用的属性或者是事件

```ts
@Styles function outSideStyle() {
  .backgroundColor(Color.Red)
  .height(400)
  .width(300)
}


@Entry
@Component
struct Index {
  // 组件内部定义的样式不用写function
  @Styles insideStyle() {
    .onClick(() => {
      AlertDialog.show({
        message: '被点击了'
      })
    })
  }
  build() {
    Swiper() {
      Text('11111111111111111111')
        .outSideStyle()
        .insideStyle()
      Text('222222222222')
        .outSideStyle()
        .insideStyle()
    }
    .loop(true)
    .autoPlay(true)
    .width('100%')
    .height(400)
  }
}
```
## 3. @Builder
> 这个相当于是抽离个一个组件了

```ts
@Builder
function navItem(imgUrl: string, width: Length) {
  Column() {
    Image(imgUrl)
      .width(width)
  }
}


@Entry
@Component
struct Index {
  @State swiperItems: string[] = [
    'https://img2.baidu.com/it/u=2430163735,700302077&fm=253&fmt=auto&app=138&f=JPEG?w=100&h=100',
    'https://img2.baidu.com/it/u=1536541335,1580047643&fm=253&fmt=auto&app=120&f=JPEG?w=664&h=374',
    'https://img1.baidu.com/it/u=1330049678,4187153037&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500'
  ]

  build() {
    Column() {
      ForEach(this.swiperItems, (item: string, index: number) => {
        navItem(item, 200)
      })
    }.width('100%')
    .height('100%')
  }
}
```

# 5. 自定义组件

## 1. 自定义组件

> 通过`@Component`可以自定义一个组件，供其他页面使用，如果想要预览该组件可以使用`@Preview`修饰

```ts
@Component
struct MyCom {
  @State title: string = '默认标题'
  @State btnStr: string =  '默认按钮'
  btnCallback = () => {
    AlertDialog.show({
      message: '点击了默认按钮'
    })
  }
  sayHi() {
    console.log('Say Hi')
  }
  build() {
    Row() {
      Text(this.title)
      Button(this.btnStr)
        .onClick(this.btnCallback)
    }.width('100%')
    .height(100)
  }
}
export default MyCom
```

```ts
import MyCom from './myCom'
@Entry
@Component
struct Index {
  build() {
      Column() {
        MyCom({
          title: '测试标题',
          btnStr: 'Click',
          btnCallback() {
            AlertDialog.show({
              message: '点击了Click'
            })
          }
        })
        MyCom()
      }
  }
}
```

## 2. @BuilderParam传递UI

> 利用`@BuilderParam`可以让自定义组件允许外部传递UI

```ts
@Component
struct MyCom {
  // 1.定义构建函数
  @BuilderParam contentBuilder: () => void = this.defaultBuilder
  @Builder
  defaultBuilder() {
    Text('默认的内容')
  }

  build() {
    this.contentBuilder()
  }
}
export default MyCom
```

```ts
import MyCom from './myCom'
@Entry
@Component
struct Index {
  build() {
      Column({space: 10}) {
        MyCom() {
          Button('传递的按钮')
        }

        MyCom()
      }
  }
}
```

## 3. 多个`@BuilderParam`的情况

> 这种情况，在父组件给子组件传值的时候指定`@BuilderParam`的名字即可，这个类似于具名插槽。只能通过参数传递

- 子组件

```ts
@Component
struct MyCom {
  // 1.定义构建函数
  @BuilderParam contentBuilder: () => void = this.defaultBuilder
  @Builder
  defaultBuilder() {
    Text('默认的内容')
  }
  @BuilderParam anotherBuilder: () => void = this.aBuilder
  @Builder
  aBuilder() {
    Text('默认内容')
  }
  build() {
    Column(){
      this.contentBuilder()
      this.anotherBuilder()
    }

  }
}
export default MyCom
```

- 父组件

```ts
@Builder
contentBuilder() {
    Button('测试按钮')
}
@Builder
anotherBuilder() {
    Image($r('app.media.like'))
      .width(100)
      .fillColor('#5FEdCE')
}
build() {
  Column({space: 10}) {
    MyCom({
      contentBuilder: this.contentBuilder,
      anotherBuilder: this.anotherBuilder
    })
  }
}
```
# 6. 常用装饰器
> 写了四个常用的装饰器。

| 装饰器         | 描述                           |
|-------------|------------------------------|
| @State      | 状态变量                         |
| @Prop       | 父子组件传值, 子组件不能修改父组件传递过来的值     |
| @Link       | 双向同步，子组件可以修改但是需要逐层传递         |
| @Provide    | 提供数据，只要是当前组件的子组件都可以传递        |
| @Consume    | 消费数据，需要在组件中使用`@Provide`提供的数据 |
| @Observed   | 观察属性，当属性变化时会重新渲染             |
| @ObjectLink | 观察对象，当对象变化时会重新渲染             |


## 1. @Prop 父子组件传值
> 可以通过`@Prop`来实现父组件传递数据给子组件, 子组件中的@prop装饰的变量是可变的，但是变化不会同步传递到父组件
> 
> 下边的这个例子中，点击按钮可以将子组件的`info`数据更改，但是父组件的`info`还是原来的数据

```ts
@Entry
@Component
struct Index {
  @State info: string = '父组件数据'

  build() {
    Row() {
      Son({
        info: this.info
      })
    }.width('100%')
    .height('100%')
    .onClick(() => {
      AlertDialog.show({
        message: this.info
      })
    })
  }
}

@Component
struct Son {
  @Prop info: string

  changeInfo(info: string) {
    this.info = info
  }

  build() {
    Button(`Info is ${this.info}`)
      .onClick(() => {
        this.changeInfo('子组件数据')
      })
  }
}
```
> 如果实在想改的话需要在父组件传入更改的方法，就和`$emit`差不多。思想都是一样的，谁的数据谁负责修改。

```ts
@Entry
@Component
struct Index {
@State info: string = '父组件数据'

    changeInfo(info: string) {
        this.info = info
    }

    build() {
        Row() {
            Son({
                info: this.info,
                changeInfo: (info: string) => {
                    this.changeInfo(info)
                }
            })
            Button('父组件按钮')
                .onClick(() => {
                    this.changeInfo('父组件也修改了数据')
                })
        }.width('100%')
            .aspectRatio(1)
            .onClick(() => {
                AlertDialog.show({
                    message: this.info
                })
            })
    }
}

@Component
struct Son {
@Prop info: string
    changeInfo = (info: string) => {}

    build() {
        Button(`Info is ${this.info}`)
            .onClick(() => {
                this.changeInfo('子组件也要改数据')
            })
    }
}
```

## 2. @Link 双向同步

> 通过`@Link`可以实现父子组件之间的双向同步。

### 1. 基本数据类型
1. 父组件
```ts
import Son from '../components/Son'
import Person from '../entity/Person'

@Entry
@Component
struct Index {
@State count: number = 0
@State person: Person = {
        name: 'zhangsan',
        age: 17
    }
    build() {
        Column({ space: 20 }) {
            Text('Parent').fontSize(30)
            Text(`${this.count}`).fontSize(25)
            Text(JSON.stringify(this.person)).fontSize(25)
            Button('Parent Change')
                .onClick(() => {
                    this.count++
                    this.person.age++
                })
            Son({
                count: this.count,
                person: this.person
            })
        }
    }
}
```
2. 子组件
```ts
import Person from "../entity/Person"

@Component
struct Son{
@Link count: number
@Link person: Person
    build() {
        Column({space: 10}) {
            Text('Son component').fontSize(30)
            Text(`${this.count}`).fontSize(25)
            Text(JSON.stringify(this.person)).fontSize(25)
            Button('Change')
                .onClick(() => {
                    this.count *= 2
                    this.person.age *= 2
                })
        }.width('100%')
            .height(200)
            .margin(40)
            .backgroundColor(Color.Pink)
    }
}
export default Son
```
## 3. @Provide和@Consume
> 这两个注解主要是用来实现跨组件数据共享的，`@Provide`提供数据，`@Consume`消费数据。<font color=red>有点类似于Vue3中的[provide和 inject](/language/vue/vue3/#_9-provide和-inject)</font>
>
> 这种方式的好处是可以实现跨组件数据共享，但是缺点是数据是全局的，所以需要注意数据的命名冲突。

1. 父组件
```ts
@Provide themeColor: ResourceColor = Color.Blue
build() {
    Column() {
        Button('Change').onClick(() => {this.themeColor = Color.Red})
        Son()
    }
}
```
2. Son
```ts
build() {
    Column() {
        GrandSon()
    }
}
```
3. GrandSon
```ts
@Consume themeColor: ResourceColor
build() {
    Column() {
        Text('GrandSon').fontSize(30).fontColor(this.themeColor)
        Button('Change').onClick(() => {this.themeColor = Color.Green})
    }.backgroundColor(this.themeColor)
}
```
## 4. @Observed 和 @ObjectLink
> 用于在设计<font color=red>嵌套对象</font>或者<font color=red>数组</font>的场景中进行双向数据绑定



# 7. 实现一个评论的页面
## 0， 自定义字体实现
1. 在项目的`ets`目录下创建`fonts`文件夹，将从[iconfont](https://www.iconfont.cn/)下载的代码全部复制到这里
2. 在index.ets中注册字体文件
```ts
import font from '@ohos.font'

@Entry
@Component
struct Index {
    aboutToAppear(): void {
        font.registerFont({
            familyName: 'IconFont',
            familySrc: 'fonts/iconfont.ttf'
        })
    }
}
```
3. 使用
```ts
// 
Text('\ue606').fontFamily('iconfont')
```
## 1. 头部全部评论
```ts
@Extend(Button)
function previewBtn(isOn: boolean) {
  .width(46)
  .height(32)
  .fontSize(14)
  .fontColor('#222')
  .padding(5)
  .backgroundColor(isOn ? '#fff' : '#F7F8FA')
  .border({ width: isOn ? 1 : 0, color: '#E4E5E6' })
  .align(Alignment.Center)
}

@Preview
@Component
struct InfoTop {
  @State isOn: boolean = true
  changeOnFlag = (type: number) => {
    this.isOn = !this.isOn
    console.log(`this.isOn ${this.isOn}`)
    this.sortReviewList(type)
  }
  sortReviewList = (type: number) => {
  }

  build() {
    Row() {
      Text('全部评论')
        .fontWeight(FontWeight.Bold)
        .fontSize(18)
      Row() {
        Button('最热')
          .previewBtn(this.isOn)
          .onClick(() => {
            this.changeOnFlag(0)
          })
        Button('最新')
          .previewBtn(!this.isOn)
          .onClick(() => {
            this.changeOnFlag(1)
          })

      }
      .height(32)
      .borderRadius(16)
      .border({ width: 1, color: '#F9FAFB' })
      .backgroundColor('#F7F8FA')
    }
    .width('100%')
    .height(50)
    .justifyContent(FlexAlign.SpaceBetween)
    .padding(10)
  }
}

export default InfoTop
```
## 2. 中间的评论详情
```ts
import Review from '../entity/Review'

@Component
struct ReviewItem {
  @Prop review: Review
  changeLike = (index: number) => {
    let isLike = this.review.isLike
    if (isLike) {
      this.review.likeNum--
    } else {
      this.review.likeNum++
    }
    this.review.isLike = !isLike
  }

  build() {
    Column({ space: 10 }) {
      Row() {
        Image(this.review.avatar)
          .width(30)
          .aspectRatio(1)
          .margin({ top: 5 })
        Text(this.review.nickname)
          .fontSize(13)
          .fontColor(Color.Gray)
          .margin({ top: 5, left: 8 })
        Text(this.review.level)
          .margin({ top: 5, left: 8 })
      }

      Text(this.review.content)
        .fontSize(19)

      Row() {
        Text(this.review.publishTime)
          .fontSize(15)
          .fontColor(Color.Gray)
        Row() {
          Image(this.review.isLike ? $r('app.media.like_blue') : $r('app.media.like'))
            .width(20)
          Text(`${this.review.likeNum}`)
            .fontColor(this.review.isLike ? '#1296DB' : '#000')
        }
        .onClick(() => {
          this.changeLike(this.review.index)
        })
      }.justifyContent(FlexAlign.SpaceBetween)
      .width('100%')
    }
    .alignItems(HorizontalAlign.Start)
    .padding(15)
    .border({
      width: 1,
      color: Color.Black,
      radius: 5
    })
  }
}

export default ReviewItem
```
## 3. 底部的评论
```ts
@Preview
@Component
struct BottomReview {

  @Prop text: string = ''
  submitCallback = (comment: string ) => {

  }
  build() {
    Row() {
      Row() {
        Text('\ue606')
          .fontFamily('iconfont')
          .fontSize(30)
        TextInput({
          placeholder: '写评论...',
          text: $$this.text
        })
          .backgroundColor(Color.Transparent)
          .fontSize(18)
          .onSubmit(() => {
            this.submitCallback(this.text)
            this.text = ''
          })
      }.height(40)
      .backgroundColor('#F5F6F5')
      .layoutWeight(1)
      .borderRadius(20)

      Image($r('app.media.like'))
        .width(30)
        .margin({ left: 6, right: 6 })
      Image($r('app.media.collect'))
        .width(30)
        .margin({ right: 6 })
    }.width('100%')
    .backgroundColor(Color.Pink)
    .height(60)
    .justifyContent(FlexAlign.SpaceBetween)
  }
}

export default BottomReview

```
## 4.首页
```ts
import InfoTop from '../components/InfoTop'
import ReviewItem from '../components/ReviewItem'
import font from '@ohos.font'
import BottomReview from '../components/BottomReview'
import Review, { randomList } from '../entity/Review'

@Entry
@Component
struct Index {
  aboutToAppear(): void {
    font.registerFont({
      familyName: 'iconfont',
      familySrc: '/fonts/iconfont.ttf'
    })
  }

  @State reviewList: Array<Review> = randomList(10)
  changeLike = (index: number) => {
    let review = this.reviewList[index]
    if (review.isLike) {
      review.likeNum--
    } else {
      review.likeNum++
    }
    review.isLike = !review.isLike
    /**
     * 从index的位置删除一个元素，将更新后的review替换到指定的位置。
     * 从而触发页面的更新
     */
    this.reviewList.splice(index, 1, review)
  }
  submitCallback = (content: string) => {
    this.reviewList.unshift({
      index: this.reviewList.length,
      avatar: 'https://img2.baidu.com/it/u=2430163735,700302077&fm=253&fmt=auto&app=138&f=JPEG?w=100&h=100',
      nickname: `黑暗森林${Math.floor(Math.random() * 100)}`,
      level: `Level${Math.floor(Math.random() * 7)}`,
      content,
      publishTime: '一分钟前',
      timestamp: new Date().getTime(),
      likeNum: 0,
      isLike: false
    })
    console.log(`${this.reviewList.length}`)
  }
  sortReviewList = (type: number) => {
    // 最新
    if (type === 1) {
      this.reviewList = this.reviewList.sort((prev, next) => {
        return next.publishTime.localeCompare(prev.publishTime)
      })
    }
    // 最热
    if (type === 0) {
      this.reviewList = this.reviewList.sort((prev, next) => {
        return next.likeNum - prev.likeNum
      })
    }
  }
  build() {
    Column() {
      InfoTop({
        sortReviewList: this.sortReviewList
      })
      List() {
        ForEach(this.reviewList, (review: Review, index: number) => {
          ListItem() {
            ReviewItem({ review, changeLike: this.changeLike })
          }.padding(10)
        })
      }
      .layoutWeight(1)
      .width('100%')
      .listDirection(Axis.Vertical)
      .scrollBar(BarState.Auto)

      BottomReview({
        submitCallback: this.submitCallback
      })
    }.width('100%')
    .height('100%')
  }
}
```
## 5.用到的实体类
```ts
class Review {
  index: number
  avatar: string
  nickname: string
  level: string
  content: string
  publishTime: string
  timestamp: number
  likeNum: number
  isLike: boolean

  constructor(index: number,avatar: string, nickname: string, level: string, content: string, publishTime: string, timestamp: number,
    likeNum: number, isLike: boolean) {
    this.index = index
    this.avatar = avatar
    this.nickname = nickname
    this.level = level
    this.content = content
    this.publishTime = publishTime
    this.timestamp = timestamp
    this.likeNum = likeNum
    this.isLike = isLike
  }

}

export default Review
export function randomList(range: number): Array<Review> {
  const result = []
  for (let index = 0; index < range; index++) {
    result[index] = {
      index: index,
      avatar: 'https://img2.baidu.com/it/u=2430163735,700302077&fm=253&fmt=auto&app=138&f=JPEG?w=100&h=100',
      nickname: `黑暗森林${Math.floor(Math.random() * 100)}`,
      level: `Level${Math.floor(Math.random() * 7)}`,
      content: `这么长一串内容，应该会把这个容器的宽度给撑开的吧，撑不开就有点搞笑了${Math.floor(Math.random() * 999)}`,
      publishTime: `${(Math.floor(Math.random() * 10).toFixed(1))}小时前`,
      timestamp: new Date().getTime(),
      likeNum: Math.floor(Math.random() * 60),
      isLike: Math.random() < 0.5
    }
  }
  return result
}
```
