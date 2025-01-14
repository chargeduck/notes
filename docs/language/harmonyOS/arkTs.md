:::tip
算是支持一下国产吧，[笔记来源，黑马程序员 HarmonyOS 星河版](https://www.bilibili.com/video/BV14t421W7pA?spm_id_from=333.788.player.switch&vd_source=d9d3eb78433e98d94cd75ddf5ac0382b&p=2)
,据说这个版本已经不支持安卓APP了。
开发工具是从开源版idea魔改的，下载链接：[DevEco Server](https://developer.huawei.com/consumer/cn/download/)
:::

# 1. 基本语法

> 和 Ts js差不多的，会前端学这个ArkTs超集还是比较简单的

## 1. 数据类型和变量，常量

> 嗯，和TS一模一样吧，现在的语言都是差不多类似了，kotlin也是这样的

| 类型      | 说明                      |
|---------|-------------------------|
| number  | 数字                      |
| string  | 字符串                     |
| boolean | 布尔值                     |
| bigint  | 大整数(用来处理超过number范围的大整数) |

```ts
let title: string = "Hello World"
let flag: boolean = true
// 不知道为啥我老想写成下边这种形式, 奇奇怪怪
// const price :number = 100
```

## 2. 数组

```ts
let arr: number[] = [1, 2, 3]
arr.push(4)
console.log(arr.pop())
arr.slice(1, 3)
console.log(arr[0])
```

```ts
let arr: Array<number> = [1, 2, 3]
arr.push(6)
```

## 3. 函数
> 返回类型可以省略，会自动推断
- 普通函数
```ts
function add (a: number, b: number): number {
    return a + b
}

log(add(1, 2))
```    
- 箭头函数
```ts
const addNum = (a: number, b: number) => {
  return a + b
  }

console.log(addNum(100, 100) + '')
```
## 4. interface 接口
> 用来描述一个抽象的物体的特征和行为，这个不用多说吧,
```ts
interface Person {
    // 这个后边加不加 , 都可以的
    name: string
    age: number
    weight: number
    sayHello: (msg: string) => void
}
const his: Person = {
    name: '张三',
    age: 10,
    weight: 55,
    sayHello(msg: string) {
        console.log(`${this.name}: ${msg}`)
    }
}
console.log(JSON.stringify(his))
console.log('his', his)
his.sayHello('逆子， 说话！！！')
```
## 5. Class 类
```js
class Animal{
  private age: number
  private name: string

  public constructor(age: number, name: string) {
    this.age = age
    this.name = name
  }
  public say(msg: string) {
    console.log(`${this.name}: ${msg}`)
  }
}
const cat = new Animal(1, '七月一')
console.log(JSON.stringify(cat))
cat.say('喵喵')
```
## 6. Enum 枚举
> 枚举是一种特殊的类，用来表示一组相关的值
```ts
enum Gender {
  MAN = 'man',
  WOMAN = 'woman',
  SECRET = 'secret'
}
```

## 7. 联合类型
> 一个变量可以是多种类型中的一种，应该是类似 Union吧
```ts
let age: number| string = 0
console.log('age', age)
console.log('age type', typeof age)

age = '10'
console.log('age', age)
console.log('age type', typeof age)
```
> 也可以规定变量只能在指定范围内选择 或者是从枚举中取
```ts
let gender: 'man' | 'woman' | 'secret' = 'secret'
let gender2: Gender = Gender.MAN
```

