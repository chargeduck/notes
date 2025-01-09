:::tip
[pinia](https://pinia.web3doc.top/introduction.html)
是Vue的最新的状态管理工具，用来替代Vuex。[Vuex快速入门](/language/vue/vue2/vuex.html) <br/> pinia特点如下

1. 提供了更简单的API，去掉了 mutations
2. 支持TypeScript
3. 去掉了modules的概念，每一个store都是一个独立的模块
4. 提供组合式风格API，更适配于Vue3
   :::

# 1. 安装Pinia

1. 安装pinia

```shell
npm install pinia
```

2. main.js 挂载 pinia

```shell
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
 
```

# 2. 基本用法

## 1. 定义Store

```js
import { defineStore } from 'pinia'
// 使用 defineStore 定义一个 Store
// 第一个参数是你的应用中 Store 的唯一 id , 类似是Vuex中的modules的概念
export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0 }
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
})
```

## 2. 使用setup当时定义store

> 在这种情况下， 创建的属性就是store, 方法就是actions, 计算属性就是getters

```js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0)
  // getters
  const doubleCount = computed(() => count.value * 2)

  // actions
  function increment () {
    count.value++
  }

  return { count, doubleCount, increment }
})

```

## 3. 使用

```vue

<script setup>
  import { useCounterStore } from '@/stores/counter'

  const counter = useCounterStore()
  console.log(counter)
</script>

<template>
  <h1>App ROot Element</h1>
  {{ counter.count }}
  <button @click="counter.increment">Increment</button>
  {{ counter.doubleCount }}
</template>
```

# 3. actions 异步实现

```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useChannelsStore = defineStore('channels', () => {
  const channels = ref([])

  const fetchChannels = async () => {
    const res = await axios.get('http://geek.itheima.net/v1_0/channels')
    channels.value = res.data.data.channels
  }

  const channelsName = computed(() => {
    return channels.value.map(item => item.name)
  })

  return {
    channels,
    fetchChannels,
    channelsName
  }
})
```

# 4. storeToRefs

> 如果直接对store进行结构，会丢失响应式，使用storeToRefs可以保持响应式,
>
> state 和 getters 都可以使用storeToRefs保持响应式，actions直接解构行了
>
> 或者直接用store.xxx 来获取

```vue

<script setup>
  import { useChannelsStore } from '@/stores/channels.js'
  import { storeToRefs } from 'pinia'

  const channelsStore = useChannelsStore()
  const { channels, channelsName } = storeToRefs(channelsStore)
</script>

<template>
  <div v-for="channel in channels" :key="channel.id">
    {{ channel.id }} ==> {{ channel.name }}
  </div>
  <button @click="channelsStore.fetchChannels">获取Channels</button>
  {{ channelsName }}
</template>
```

# 5. 持久化
## 1. 简单使用
> 在Vuex中，使用LocalStorage来实现持久化，在pinia中使用[pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/)来实现持久化,需要保证pinia>=2.0.0

1. 安装插件

```shell
npm install pinia-plugin-persistedstate 
```

2. main.js中使用

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import persist from 'pinia-plugin-persistedstate'

createApp(App)
  .use(createPinia().use(persist))
  .mount('#app')

```

3. store仓库中开启

```js
export const useChannelsStore = defineStore('channels',
  () => {
  },
  {
    persist: true
  }
)
```
## 2. 个性化定制
> 1. 这个插件默认使用的是`localStorage`存储数据，
> 2. 使用`store.$id`当做key值
> 3. 使用`JSON.stringify`序列化数据，`Json.parse`反序列化
> 4. 整个state都会被持久化

```js
export const useChannelsStore = defineStore('channels',
  () => {
  },
  {
    persist: {
      key: 'channels',
      storage: sessionStorage,
      // 指定存储哪些数据
      paths: ['channels']
    }
  }
)
```
