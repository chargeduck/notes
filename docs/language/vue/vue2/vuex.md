:::tip
状态管理模式，集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

Vue3 中使用 [Pinia](/language/vue/vue3/pinia.html) 作为状态管理工具。
:::

# 1. 简介

> Vuex是vue的一个状态管理工具，可以管理vue通用的数据，在多组件中共享数据。
>
> 数据集中化管理，响应式变化，操作简洁是它的优势



1. 安装

```shell
npm i vuex@3 
```

2. 新建store文件夹，新建index.js文件，用来集中管理数据

```js
import Vue from 'vue'
import Vuex from 'docs/language/vue/vue2/vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // state 状态，是所有组件共享的数据
  state: {
    count: 0
  },
})
export default store

```

3. 挂载Vuex

```js
import store from './store'

new Vue({
  el: '#app',
  store
})
```
# 2. 核心概念
## 1. state

> state 是用来存储数据的，所有组件共享的数据都在这里定义。

### 1. 创建和使用state

1. 新建state

```js
const store = new Vuex.Store({
  // state 状态，是所有组件共享的数据
  state: {
    count: 0
  },
})
```

2. 使用state

> 一种是通过this.$store.state.count获取，

```js
this.count = this.$store.state.count
```

### 2. mapState简化

> 另一种是通过mapState映射获取, 将state中的数据映射为计算属性

```js
export default {
  computed: {
    ...mapState(['count'])
  }
}
```

## 2. mutations

### 1. 基本用法

> 单向数据流，只能通过mutations修改state中的数据，组件中不能直接修改state中的数据

```js
new Vuex.Store({
  // 严格模式下，只能通过mutations修改state中的数据，组件中不能直接修改state中的数据
  strict: true,
  state: {
    count: 0xffb
  },
  // mutations 是唯一修改state的地方
  mutations: {
    addCount (state, addNum) {
      state.count += addNum
    }
  }
})
```

> 在组件中使用mutations

```js
this.$store.commit('addCount', 5)
```

### 2. mapMutations简化

> 将mutations中的方法映射为组件中的方法，方便使用。

```vue

<template>
  <div>
    <button @click="addCount(5)">+5</button>
  </div>
</template>
<script>
  import { mapMutations } from 'docs/language/vue/vue2/vuex'

  export default {
    methods: {
      // 相当于直接把addCount方法映射为组件中的方法
      ...mapMutations(['addCount'])
    }
  }
</script>
```

## 3. actions

> actions 是用来异步修改state的，<font color=red>mutations 必须是同步的，便于监测数据变化记录调试</font>

### 1. 基本用法

1. 新建actions

```js
new Vuex.Store({
  state: {
    count: 0
  },
  // actions 是用来异步修改state的
  actions: {
    addCountAsync (context, addNum) {
      setTimeout(() => {
        context.commit('addCount', addNum)
      }, 1000)
    }
  }
})
```

2. 使用

```js
this.$store.dispatch('addCountAsync', 5)
```

### 2. mapActions简化

```js
import { mapActions } from 'docs/language/vue/vue2/vuex'

export default {
  methods: {
    // 相当于直接把addCountAsync方法映射为组件中的方法
    ...mapActions(['addCountAsync'])
  }
}
```

## 4. getter

> getter 类似与computed，用来对state中的数据进行处理。有时候需要从state中派生出一些状态，这些状态依赖于state中的数据，此时可以使用getter。

### 1. 基本用法

> 例如在state定义了一个数组，需要返回里边大于5的数据

1. 创建getter

```js
new Vuex.Store({
  state: {
    list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  // getter 类似与computed，用来对state中的数据进行处理
  getters: {
    filterList (state) {
      return state.list.filter(item => item > 5)
    }
  }
})
```

2. 使用

```js
this.filterList = this.$store.getters.filterList
```

### 2. mapGetters简化

> 将getters中的方法映射为组件中的计算属性，方便使用。

```vue

<template>
  <div>
    <ul>
      <li v-for="item in filterList">{{ item }}</li>
    </ul>
  </div>
</template>
<script>
  import { mapGetters } from 'docs/language/vue/vue2/vuex'

  export default {
    computed: {
      // 相当于直接把filterList方法映射为组件中的计算属性
      ...mapGetters(['filterList'])
    }
  }
</script>
```

## 5. 核心概念总结

| 属性        | 描述                     |
|:----------|:-----------------------|
| state     | 状态，是所有组件共享的数据          |
| mutations | 同步修改state的地方           |
| actions   | 异步修改state的地方，          |
| getters   | 计算属性，是用来对state中的数据进行处理 |

| 方法        | 描述                     |
|:----------|:-----------------------|
| commit    | 提交mutations           |
| dispatch  | 提交actions             |

|辅助函数|描述|
|:----------|:-----------------------|
| mapState | 将state中的数据映射为组件中的计算属性 |
| mapMutations | 将mutations中的方法映射为组件中的方法 |
| mapActions | 将actions中的方法映射为组件中的方法 |
| mapGetters | 将getters中的方法映射为组件中的计算属性 |

# 3. 模块化
> 由于 vuex 使用单一状态树，应用的所有状态会集中到一个比较大的对象。
> 当应用变得非常复杂时store 对象就有可能变得相当臃肿。(当项目变得越来越大的时候，Vuex会变得越来越难以维护)
> 
> 在store下新建modules文件夹，新建各自模块的js文件，每个模块的js文件中定义自己的state、mutations、actions、getters
## 1. 模块化使用
- 创建`store/module/user.js`
```js
const state = {
  userInfo: {
    id: '',
    name: '',
    age: '',
    avatar: ''
  }
}
const mutations = {}
const actions = {}
const getters = {
  upperCaseName (state) {
    return state.userInfo.name.toUpperCase()
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
```
- 改造`store/index.js`
```js
import user from './modules/user'
import setting from './modules/setting'
const store = new Vuex.Store({
  modules: {
    user,
    setting
  }
})
```
## 2. state
> 即便是已经模块化，但是其实子模块的状态还是挂载在根节点上的，所以还是可以通过`this.$store.state.user.userInfo`来访问。
### 1. 原生访问
> 直接通过模块名访问，因为user模块已经挂载在根节点上了。其实和直接访问index.js的方式是一样的
```js
this.$store.state.user.userInfo
```
### 2. 通过mapState访问
1. 直接访问根节点的user数据

```js
import { mapState } from 'docs/language/vue/vue2/vuex'

export default {
  computed: {
    ...mapState(['user'])
  }
}
```
2. 通过命名空间
> 指定命名空间访问，这样就可以直接访问user模块下的userInfo数据了。需要在index.js中开启
> ```js
> export default {
>   namespaced: true,
>   state,
>   mutations,
>   actions,
>   getters
> }
> ```

```vue

<template>
  <div>
    <p>{{ userInfo.name }}</p>
  </div>
</template>
<script>
  import { mapState } from 'docs/language/vue/vue2/vuex'

  export default {
    computed: {
      ...mapState('user', ['userInfo'])
    }
  }
</script>
```
3. 添加映射

```vue

<template>
  <div>
    <p>{{ userInfo.name }}</p>
  </div>
</template>
<script>
  import { mapState } from 'docs/language/vue/vue2/vuex'

  export default {
    computed: {
      ...mapState({
        userInfo: state => state.user.userInfo
      })
    }
  }
</script>
```
## 3. getter
### 1. 原生获取
```vue
<span>{{ $store.getters['user/upperCaseName']  }}</span>
```
### 2. mapGetters

```vue

<template>
  <div>{{ upperCaseName }}</div>
</template>
<script>
  import { mapGetters } from 'docs/language/vue/vue2/vuex'

  export default {
    computed: {
      ...mapGetters(['user/upperCaseName'])
    }
  }
</script>
```
## 4. mutations

### 1. 原生访问
> 通过 `$store.commit('moduleName/mutationName', args)`来提交
```js
this.$store.commit('user/setUserInfo', userInfo)
```
### 2. mapMutations

```vue

<template>
  <div>
    <button @click="setUserInfo(userInfo)">setUserInfo</button>
  </div>
</template>
<script>
  import { mapMutations } from 'docs/language/vue/vue2/vuex'

  export default {
    methods: {
      ...mapMutations('user', ['setUserInfo'])
    }
  }
</script>
```
> mapActions和mapMutations类似,这里就不赘述了。需要注意的是使用辅助函数是，都需要通过`namespaced: true`来指定开启命名空间
