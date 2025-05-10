:::tip
Vue3 使用，暂时还没开始学，vue2马上了
:::

# 1. 简介

> 相较于VUE2来说， Vue3有以下特点：

| 特性      | 描述                                 |
|---------|------------------------------------|
| 更快的编译速度 | 重写diff算法<br/> 模板编译优化<br/>更高效的组件初始化 |
| 更好的性能   | 更快的数据响应式 proxy                     |
| 更小的打包体积 | tree-shaking<br/> 按需导入             |
| 更易维护    | 组合式API<br/> Typescript支持           |

> 同样一个点击按钮，让数字加1的例子，Vue2和Vue3的代码如下：

- Vue2

```vue

<script>
  export default {
    data () {
      return {
        count: 0
      }
    },
    methods: {
      add () {
        this.count++
      }
    }
  }
</script> 
```

- Vue3

```vue

<script setup>
  import { ref } from 'vue'

  const count = ref(0)
  const addCount = () => count.value++
</script> 
```

# 2. 创建vue3项目

## 1. 使用create-vue创建

> 使用这个工具本地的node需要 >=16.0.0,

1. 初始化脚手架

```shell
npm init vue@latest
# 根据提示选择想要的东西就行了
```` 

## 2. 项目变更

1. vue.config.js => vite.config.js
2. package.json 中 vue2 改为 vue3 和 vite
3. main.js 中由 new Vue() 改为 createApp()
4. app.vue 中 `template 不在要求唯一根元素`, `script 标签添加setup 支持组合式API`, `script和template位置循序调整`

# 3. 组合式API

## 1. setup选项

> setup是一个特殊的选项，它是在组件实例创建之前被调用的。有以下特点
> 1. setup的执行时机比beforeCreate早
> 2. 在setup中无法使用this, this返回undefined
> 3. setup中的变量和函数，需要在最后return出去，才能在模板中使用

### 1. 普通写法

```vue

<script>
  export default {
    setup () {
      return {
        msg: 'Hello World!'
      }
    },
    beforeCreate () {
    }
  }
</script>
<template>
  <div>{{ msg }}</div>
</template>
```

### 2. 语法糖写法

> 直接在script标签上添加setup选项，本质上通过sfc包裹住return的

```vue

<script setup>
  const msg = 'Hello World!'
  const logMessage = () => {
    console.log(msg)
  }
</script>
<template>
  {{ msg }}
</template>
```

## 2. reactive 和 ref 函数

### 1. reactive函数

> reactive()接受对象类型数据的参数，返回一个响应式的代理对象。

```js
// 1. 从vue中引入reactive函数
import { reactive } from 'vue'
// 2. 执行reactive函数，使用变量接收
const msg = reactive({})
```

### 2. ref函数

> 可以接受简单类型或者是对象类型的参数，返回一个响应式的代理对象。
>
> 传入简单类型的时候，会在外层包裹一层对象，然后再借助reactive函数返回一个响应式的代理对象。
> 访问简单对象的时候，需要使用.value来访问。在`template`标签中中不需要使用.value来访问。

```vue

<script setup>
  import { ref } from 'vue'

  const count = ref(0)
  const addOne = () => {
    count.value++
  }
</script>
<template>
  <div>
    Count: {{ count }}
  </div>
  <button @click="addOne">Count++</button>
</template>
```

## 3. toRefs 和 toRef 函数
### 1. toRefs
> 如果直接对 reactive() 函数返回的响应式对象进行解构赋值时，会丢失响应式。需要使用toRefs函数来解决。
```js
const person = reactive({
  name: '张三',
  age: 18
})
// 这样会导致响应式丢失
// const { name, age } = person
const { name, age } = toRefs(person)
function changeName () {
  name.value = '李四'
}
```
### 2. toRef
> toRef函数可以将一个响应式对象的某个属性，返回一个响应式的ref对象。

```js
const person = reactive({
  name: '张三',
  age: 18
})
const name = toRef(person, 'name')
```

## 4. computed

> 基本思想和Vue2中的computed一样，都是计算属性，但是在Vue3中，computed是一个函数，需要在setup中引入。
>
> 1. 计算属性中不应该有副作用，例如异步发送请求，修改DOM
> 2. 应当避免直接修改计算属性的值，计算属性应该是只读的，特殊情况需要配置 get set

```vue

<script setup>
  import { computed } from 'vue'

  const arr = [1, 2, 3, 4, 5]
  const computedState = computed(() => {
    return arr.reduce((acc, cur) => acc + cur, 0)
  })
</script>
<template>
  <div>
    Count: {{ computedState }}
  </div>
</template>
```

## 5. watch

> 监听一个或多个数据的变化，数据变化时，执行回调函数。
>
> 比Vue2中多了个参数，immediate表示是否立即执行回调函数。

### 1. 监听ref对象变化

```vue

<script setup>
  import { ref, watch } from 'vue'

  const count = ref(60)
  const nickname = ref('张三')
  const changeCount = () => {
    count.value++
  }
  const changeNickname = () => {
    nickname.value = '法外狂徒'
  }
  // 监听单个ref对象的变化
  watch(count, (newVal, oldVal) => {
    console.log(newVal, oldVal)
  })
  // 监听多个ref对象的变化
  watch([count, nickname], (newArr, oldArr) => {
    console.log(newArr, oldArr)
  })
</script>
<template>
  <div>
    Count: {{ count }}
    <button @click="changeCount">ChangeCount</button>
    Nickname: {{ nickname }}
    <button @click="changeNickname">changeNickname</button>
  </div>
</template>
```

### 2. immediate函数

> 在监听器创建时立即执行回调函数。响应式数据变化后继续执行回调

```js
const count = ref(0)
watch(count, (newVal, oldVal) => {
  console.log(newVal, oldVal)
}, {
  immediate: true
})
```

### 3. deep

> 深度监听，当对象中的属性变化时，也会触发回调函数。

```vue

<script setup>
  import { ref, watch } from 'vue'

  const userinfo = ref({
    name: '张三',
    age: 17
  })
  const changeUserinfo = () => {
    userinfo.value.name = '李四'
    userinfo.value.age = 18
  }
  // 监听单个ref对象的变化
  watch(userinfo, (newVal, oldVal) => {
    console.log(newVal, oldVal)
  }, {
    immediate: true,
    deep: true
  })
</script>
<template>
  <div>
    userInfo: {{ userinfo }}
    <button @click="changeUserinfo">changeUserinfo</button>
  </div>
</template>
```

### 4. 精确监听对象的某个属性

> 在不开启`deep:true`的情况下，监听属性变化执行回调函数。

```js
watch(() => userinfo.value.name, (newVal, oldVal) => {
  console.log(newVal, oldVal)
})
```

## 6. 生命周期函数

| 选项式API                                      | 组合式API                                 |
|---------------------------------------------|----------------------------------------|
| <font color=red>beforeCreate/created</font> | <font color=red>setup</font>           |
| beforeMount                                 | onBeforeMount                          |
| mounted                                     | onMounted                              |
| beforeUpdate                                | onBeforeUpdate                         |
| updated                                     | onUpdated                              |
| <font color=red>beforeUnmount  </font>      | <font color=red>onBeforeUnmount</font> |
| <font color=red>unmounted </font>           | <font color=red>onUnmounted</font>     |

```vue
<script setup>
  import { onMounted } from 'vue';
  //beforeCreate 和 created 的相关代码//一律放在 setup 中执行
  const getList = () => {
    // doSomething
  }
  //一进入页面的请求
  getList()
  //如果有些代码需要在mounted生命周期中执行
  onMounted(() => {
    console.log('mounted生命周期函数-逻辑1')
  })

  //写成函数的调用方式，可以调用多次
  onMounted(() => {
    console.log('mounted生命周期函数-逻辑2')
  })
</script>
```

## 7. 父子通信

### 1 通过props父传子

> 父组件向子组件绑定属性， 子组件通过props接收属性，子组件通过emit触发事件，父组件通过v-on监听事件。

- Parent.vue

```vue
<script setup>
  import { ref } from 'vue'

  const message = ref('Hello World!')
</script>
<template>
  <son :message="message"></son>
</template> 
```

- Son.vue

```vue
<script setup>
  const props = defineProps({
    message: String
  })
</script>
```

### 2. 通过emit子传父

> 父组件中通过<font color=red>@ 绑定事件</font>
>
> 子组件中通过<font color=red>emit触发事件</font>

- Parent.vue

```vue
<script setup>
  import { ref } from 'vue'
  import son from '@/components/son.vue'

  const message = ref('Props Message')
  const changeMessage = () => {
    message.value = 'Props Message Change'
  }
</script>
<template>
  <son :message="message" @changeMessage="changeMessage"/>
</template>

```

- son.vue

```vue
<script setup>
  const props = defineProps({
    message: String,
  })
  const emit = defineEmits(['changeMessage'])
  const change = () => {
    emit('changeMessage')
  }
</script>
<template>
  {{ message }}
  <button @click="change">Change</button>
</template>

```
## 8. 模板引入和 defineExpose宏函数
### 1. 模板引入
> 通过 ref 标识 获取真实的dom对象或者组件实例对象

```vue

<script setup>
  import { onMounted, ref } from 'vue'
  const inpRef = ref(null)
  // 在dom渲染完通过 .value 获取
  onMounted(() => {
    inpRef.value.focus()
  })
</script>
<template>
  <input ref="inpRef"/>
</template>
```
### 2. defineExpose
> 在 vue3 的 `<script setup>`语法糖下，组件内部的属性和方法默认是私有的，不开放给父组件使用。
> 
> 可以通过 defineExpose 宏函数将内部的属性和方法暴露给父组件使用。

```vue
<script setup>
  const sayHi = () => {
    console.log('hi')
  }
  const count = 999
  defineExpose({
    count,
    sayHi
  })
</script>
```
## 9. provide和 inject
> 顶层组件想任意的底层组件传递数据和方法，实现跨组件通信
>
> 顶层组件通过provide暴露数据和方法 底层组件通过inject接收数据和方法

- top.vue

```vue
<script setup>
  import { provide, ref } from 'vue'
  import Middle from '@/components/middle.vue'
  const count =  ref(100)
  provide('theme.color', 'blue')
  provide('count', count)
  provide('changeCount', (changeCount) => {
    count.value = changeCount
  } )
  setInterval(() => {
    count.value += 10
  }, 1000)
</script>
<template>
  <h1>顶层组件</h1>
  <middle />
</template>

```
- middle.vue
```vue
<script setup>
  import Buttom from '@/components/buttom.vue'
</script>
<template>
  <h2>中间组件</h2>
  <buttom />
</template>
```

- buttom.vue

```vue
<script setup>
  import { inject } from 'vue'
  const themeColor = inject('theme.color')
  const count = inject('count')
  const changeCount = inject('changeCount')
</script>
<template>
  <h3>底层组件</h3>
  {{ themeColor }} - {{ count }}
  <button @click="changeCount(100)">reset to 100</button>
</template>

```
## 10 watchEffect
> watchEffect和watch相比，不需要指定监听的属性，会自动推断出需要监听的属性。直接使用就行。
> 
> 例如下面这个例子，当 temp > 60 或者 height > 30 时发送请求的逻辑。

```vue
<script setup>
defineOptions({
  name: 'App'
})
import { ref, watch, watchEffect } from 'vue'

const temp = ref(10)
const height = ref(5)
const changeTemp = () => {
  temp.value += 10
}
const changeHeight = () => {
  height.value += 5
}

watch([temp, height], (value) => {
  console.log(value)
  const [newTemp, newHeight ] = value
  if (newTemp > 60 || newHeight > 30) {
    console.log('水温过高, 或高度过高')
  }
}, {
  immediate: true,
  deep: true
})
watchEffect(() => {
  if (temp.value > 60 || height.value > 30) {
    console.log('水温过高', 'watchEffect')
  }
})
</script>

<template>
  水温: {{ temp }}
  <el-button @click="changeTemp">加10</el-button>
  <br>
  高度: {{ height }}
  <el-button @click="changeHeight">加5</el-button>
</template>
```


# 4. Vue 3.3新特性
>有 `<script setup>`之前，如果要定义 props，emits 可以轻而易举地添加一个与 setup 平级的属性。 但是用了 `<script setup>`后，就没法这么干了 setup 属性已经没有了，自然无法添加与其平级的属性。
> 
> 为了解决这一问题，引入了 defineProps 与 defineEmits 这两个宏。但这只解决了 props 与 emits 这两个属性。如果我们要定义组件的 name 或其他自定义的属性，还是得回到最原始的用法, 再添加一个普通的 `<script>` 标签这样就会存在两个`<script>`标签。让人无法接受。

- <Vue3.3
```vue
<script>
  export default {
    name: 'HomePage'
  }
</script>
<script setup>
  // somethings
</script>
```
## 1. defineOptions
> Vue 3.3 中新引入了 defineOptions 宏。顾名思义，主要是用来定义 0ptions API的选项。
> 可以用defineOptions 定义任意的选项， props,emits,expose,slots 除外(因为这些可以使用 defineXXX 来做到)
```vue
<script setup>
  import { defineOptions } from 'vue'
  defineOptions({
    name: 'HomePage'
  })
</script>
```
## 2. defineModel
> vue3中，自定义组件使用 v-model 相当于传递一个modelValue属性和一个 update:modelValue事件。这样使用起来会有很多重复代码
>
> 

### 1. props和emit写法

- parent.vue

```vue
<son :modelValue="isVisible" @update:modelValue="isVisible = $event"/>
```
- son.vue
```vue
 <script setup>
  defineProps({
    modelValue: String
  })
  const emit = defineEmit(['update:modelValue'])
</script>
<template>
  <input type="text" :value="modelValue" @input="emit('update:modelValue', $event.target.value)"/>
</template>
```
### 2. definModel

> 通过defineModel 宏函数，可以简化上述代码<br/>
> **<font color=red>注意一定要在父组件里边使用`v-model:`来绑定，如果直接使用`:attr`是单向绑定的，从子组件不能改变父组件的值</font>**

1. 首先开启defineModel, 修改`vite.config.js`
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      defineModel: true,
    })
  ]
})

```
2. 使用v-model直接绑定父组件的数据

```vue
<script setup>
const theme = ref('black')
const showEdit = ref(boolean)
</script>
<template>
	<son v-model="theme" />
	<!--如果绑定多个参数，可以按下下边的方式-->
	<son v-model:theme="theme" v-model:showEdit="showEdit" />
</template>
```



3. 修改son.vue

```vue
 <script setup>
     
  const modelValue = defineModel()
  // 多个参数可以指定参数名称
  const theme = defineModel('theme')
</script>
<template>
  <input type="text" v-model="theme"/>
</template>
```
# 5. VueRouter
> Vue3中使用VueRouter4,与之前[Vue2中的使用VueRouter](/language/vue/vue2/#_6-vuerouter)有略微的区别

## 1. 创建路由对象
> Vue3中使用声明式API之后，创建router对象的方式有所变化
```js
import {createRouter, createWebHistory} from 'vue-router'

// createRouter 创建路由实例
// 配置 history 模式  
// 1.history模式:createWebHistory 地址栏不带 #
// 2.hash模式: createWebHashHistory 地址栏带 #
// vite 中的环境境变量 import.meta.env.BASE URL 默认 /
// 具体配置需要再vite.config.ts中配置 base: '/'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
})

export default router
```

## 2. 页面使用变更
> 如果是在template标签中使用，还是和之前一样用 `$router.push`就行
> 
> 但是在script标签中使用，因为this的值为undefined,所以需要使用`useRouter``useRoute`这两个函数来获取`router`和`route`

```vue
<scripe setup>
  import { useRouter, useRoute } from 'vue-router'
  const router = useRouter()
  const route = useRoute()
  const gotoList = () => {
    router.push('/list')
  }
</scripe>
<template>
  <button @click="$router.push('/home')"></button>
  <button @click="gotoList"></button>
</template>
```
## 3. 全局路由守卫
> 使用了Pinia之后，全局路由守卫的写法也有所变化
```js
import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/layout/index.vue'
import { useUserInfoStore } from '@/stores/userInfo'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
})
router.beforeEach((to, from, next) => {
  // 一定要卸载这里，否则这个useUserInfoStore会报错，因为还没安装好store
  const userInfoStore = useUserInfoStore()
  const token = userInfoStore.token
  if (to.path === '/login') {
    next()
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})
export default router

```

# 6. 按需导入
> 安装`unplugin-vue-components` `unplugin-auto-import`这两个插件以后就再也不用写 import xxx form '@/xxx/xxx.vue'了, 以ElementPlus为例
1. 安装
```shell
pnpm add -D unplugin-vue-components unplugin-auto-import 
pnpm add element-plus
```
2. 在vite.config.js引入
```shell
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5174
  },
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})

```

3. 如果用的是 ts 的话，建议在 `tsconfig.json` 中(也可能是`tsconfig.app.json`)添加以下配置
```json
{
  "includes": [
    "auto-imports.d.ts",
    "components.d.ts"
  ]
}
```
