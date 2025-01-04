:::tip
之前学过Vue2的，这个视屏是Vue2和VUe3一起讲解的，所以就记录一下吧，反正没啥事。
[视频地址](https://www.bilibili.com/video/BV1HV4y1a7n4?spm_id_from=333.788.player.switch&vd_source=d9d3eb78433e98d94cd75ddf5ac0382b&p=3),<br/>
[Vue基本语法看这个之前的笔记就行了](https://blog.csdn.net/qq_42059717/article/details/107282984?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522750802377012c1cba3a690577fe95151%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=750802377012c1cba3a690577fe95151&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_ecpm_v1~rank_v31_ecpm-1-107282984-null-null.nonecase&utm_term=vue&spm=1018.2226.3001.4450)
:::

# 1. TodoList

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale = 1.0">
  <title>To-Do List</title>
  <!-- 引入Vue 2.7.14的CDN -->
  <script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js"></script>
  <style>
    /* CSS样式 */
    .todo-list {
      width: 600px;
      margin: 50px auto;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 20px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }

    .input-container {
      display: flex;
      margin-bottom: 20px;
    }

    .input-container input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px 0 0 5px;
    }

    button {
      background-color: #f44336;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 0 5px 5px 0;
      cursor: pointer;
      float: right;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    ul li {
      padding: 10px 0;
      border-bottom: 1px solid #ccc;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }

    .footer button {
      background-color: #2196F3;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
    }
  </style>
</head>

<body>
<div id="app">
  <div class="todo-list">
    <div class="input-container">
      <input v-model="newTask" placeholder="输入任务"/>
      <button @click="addTask">添加任务</button>
    </div>
    <ul>
      <li v-for="(task, index) in tasks" :key="index">
        {{ index + 1 }}. {{ task }}
        <button @click="del(index)">删除任务</button>
      </li>
    </ul>
    <div class="footer">
      <span>合计: {{ tasks.length }}</span>
      <button @click="clearTasks">清空任务</button>
    </div>
  </div>
</div>

<script>
  // 创建Vue实例
  new Vue({
    el: '#app',
    data: {
      newTask: "",
      tasks: ["跑步一 公里", "游泳100米"]
    },
    methods: {
      addTask() {
        if (this.newTask) {
          this.tasks.push(this.newTask);
          this.newTask = "";
        }
      },
      clearTasks() {
        this.tasks = [];
      },
      del(index) {
        this.tasks.splice(index, 1);
      }
    }
  });
</script>
</body>

</html>
```

# 2. 前端工程化

## 1. 创建脚手架

```shell
# 全局安装 npm i -g @vue/cli
yarn global add @vue/cli
# 查看vue版本
vue --version
# 创建项目
vue create vue-project
# 进入项目
cd vue-project
# 启动项目
yarn serve 

```
## 2. 使用VueCli自定义创建项目脚手架
```shell
# 使用vue脚手架创建
vue create customer-project
# 选择第三个
Manually select features
# 选择一些常用的组件行了
Babel, Router, Vuex, CSS Pre-processors, Linter / Formatter, 
# 规范可以用第三个
ESLint + Standard config
```

# 3. 关键字和语法糖

## 1. v-model

> v-model本质上是一个语法糖，它可以简化表单输入的绑定。它可以自动根据表单元素的类型来选择正确的绑定方式。
>
> 在输入框上就相当于<font color=red>是`:value`和`@input`的简写。</font>
> ，在父子组件传值时，子组件无法直接修改父组件的数据，需要使用`v-model`来实现。

- 父组件

```vue

<template>
  <my-tag v-model="tagTxt"></my-tag>
</template>
<script>
  export default {
    data() {
      return {
        tagTxt: ""
      }
    }
  }
</script>
```

- 子组件

```vue

<template>
  <div>
    <input :value="value" @input="handleInput">
  </div>
</template>
<script>
  export default {
    props: {
      value: String
    },
    methods: {
      handleInput(event) {
        this.$emit('input', event.target.value);
      }
    }
  }
</script>
```

## 2. sync修饰符

> 用来实现父子组件的通信， 可以实现子组件和父组件的双向数据绑定。本质上是`:属性名`和`@update:属性名`的合写
> <font color=red>适用于弹窗类的基础组件， visible 属性的显示隐藏</font>

- 父组件

```vue

<BaseDialog :visible.sync="showFlag"/>
<!--原版写法-->
<BaseDialog :visible="showFlag" @update:visible="showFlag = $event"/>
```

- 子组件

```vue

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleClose() {
        this.$emit('update:visible', false);
      }
    }
  }
</script>
```

# 4. 自定义指令

> 封装一些常用的DOM操作，提高代码的复用性。

## 1. 自动获取焦点

- 在main.js中全局注册一个自定义指令

```js
Vue.directive('focus', {
  inserted(el) {
    // 当元素被插入到DOM中时，自动获取焦点
    el.focus();
  }
});
```

- 局部注册

```vue

<script>
  export default {
    directives: {
      focus: {
        inserted(el) {
          el.focus();
        }
      }
    }
  }
</script> 
```

- 使用

```vue

<template>
  <input v-focus/>
</template>
```

## 2. 自定义指令传值

- 注册组件,使用`binding.value`获取传值

```js
Vue.directive('color', {
  bind(el, binding) {
    el.style.color = binding.value
  }
})
```

- 使用

```vue

<template>
  <div>
    <p v-color="red">红色</p>
    <p v-color="blue">蓝色</p>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        red: 'red',
        blue: 'blue'
      }
    }
  }
</script>
```

## 3. v-loading实现loading效果

- css

```css
.loading {
    content: '';
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    background: #fff url(../assets/loading.gif) no-repeat center;
}
```

- 自定义指定

```js
Vue.directive('loading', {
  inserted(el, binding) {
    binding.value ? el.classList.add('loading') : el.classList.remove('loading')
  },
  update(el, binding) {
    binding.value ? el.classList.add('loading') : el.classList.remove('loading')
  }
})
```

- 使用

```vue

<template>
  <div v-loading="loading">
    <p>loading...</p>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: false
      }
    },
    mounted() {
      setTimeout(() => {
        this.loading = true;
      }, 2000);
    }
  }
</script>
```

# 5. 插槽

> 插槽是Vue组件的一种特殊的特性，它允许父组件向子组件传递内容。插槽可以分为默认插槽、具名插槽。<br/>
> <font color=red>作用域插槽是插槽的一个传参语法，不是新的类别</font>

|  类型  |    描述     |
|:----:|:---------:|
| 默认插槽 | 组件内定义一处结构 |
| 具名插槽 | 组件内定义多处结构 |

## 1. 默认插槽

> 在组件内使用`<slot>`插槽占位符，在组件使用时，使用`<template>`标签包裹要渲染的内容，这样就可以实现组件的复用。

- 弹窗组件

```vue

<template>
  <div class="dialog">
    <div class="dialog-header">
      <h3>友情提示</h3>
      <span class="close">✖️</span>
    </div>

    <div class="dialog-content">
      <!-- 1. 在需要定制的位置，使用slot占位 -->
      <slot></slot>
    </div>
    <div class="dialog-footer">
      <button>取消</button>
      <button>确认</button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    }
  }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }

  .dialog {
    width: 470px;
    height: 230px;
    padding: 0 25px;
    background-color: #ffffff;
    margin: 40px auto;
    border-radius: 5px;
  }

  .dialog-header {
    height: 70px;
    line-height: 70px;
    font-size: 20px;
    border-bottom: 1px solid #ccc;
    position: relative;
  }

  .dialog-header .close {
    position: absolute;
    right: 0px;
    top: 0px;
    cursor: pointer;
  }

  .dialog-content {
    height: 80px;
    font-size: 18px;
    padding: 15px 0;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }

  .dialog-footer button {
    width: 65px;
    height: 35px;
    background-color: #ffffff;
    border: 1px solid #e1e3e9;
    cursor: pointer;
    outline: none;
    margin-left: 10px;
    border-radius: 3px;
  }

  .dialog-footer button:last-child {
    background-color: #007acc;
    color: #fff;
  }
</style>
```

- 使用

```vue

<template>
  <div>
    <my-dialog>退出测试已</my-dialog>
    <my-dialog>退出测试2</my-dialog>
  </div>
</template>
```

## 2. 插槽后备内容

> 插槽后备内容是指在插槽没有被填充时，显示的默认内容。

```vue

<template>
  <div>
    <slot>默认提示信息</slot>
  </div>
</template>
```

## 3. 具名插槽

> 当一个组件内有多个插槽时，需要使用具名插槽来区分。

- 组件定义

```vue

<template>
  <div>
    <slot name="header">默认头部提示信息</slot>
    <slot name="content">默认内容提示信息</slot>
    <slot name="footer">默认地步提示信息</slot>
  </div>
</template>
```

- 使用

```vue

<my-dialog>
  <template v-slot:header>
    自定义头部提示信息
  </template>
  <!-- 简写写法 -->
  <template #content>
    自定义内容提示信息
  </template>
  <template #footer>
    自定义底部提示信息
  </template>
</my-dialog>
```

## 4. 作用域插槽

- 组件编写

```vue

<template>
  <table class="my-table">
    <thead>
    <tr>
      <th>序号</th>
      <th>姓名</th>
      <th>年纪</th>
      <th>操作</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item, index) in data" :key="item.id">
      <td>{{ index + 1 }}</td>
      <td>{{ item.name }}</td>
      <td>{{ item.age }}</td>
      <td>
        <!-- 1. 给slot标签，添加属性的方式传值 -->
        <slot :row="item" msg="测试文本"></slot>

        <!-- 2. 将所有的属性，添加到一个对象中 -->
        <!-- 
           {
             row: { id: 2, name: '孙大明', age: 19 },
             msg: '测试文本'
           }
         -->
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    props: {
      data: Array
    }
  }
</script>

<style scoped>
  .my-table {
    width: 450px;
    text-align: center;
    border: 1px solid #ccc;
    font-size: 24px;
    margin: 30px auto;
  }

  .my-table thead {
    background-color: #1f74ff;
    color: #fff;
  }

  .my-table thead th {
    font-weight: normal;
  }

  .my-table thead tr {
    line-height: 40px;
  }

  .my-table th,
  .my-table td {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }

  .my-table td:last-child {
    border-right: none;
  }

  .my-table tr:last-child td {
    border-bottom: none;
  }

  .my-table button {
    width: 65px;
    height: 35px;
    font-size: 18px;
    border: 1px solid #ccc;
    outline: none;
    border-radius: 3px;
    cursor: pointer;
    background-color: #ffffff;
    margin-left: 5px;
  }
</style>
```

- 使用

```vue

<template>
  <div>
    <MyTable :data="list">
      <!-- 3. 通过template #插槽名="变量名" 接收 -->
      <template #default="obj">
        <button @click="del(obj.row.id)">
          删除
        </button>
      </template>
    </MyTable>

    <MyTable :data="list2">
      <template #default="{ row }">
        <button @click="show(row)">查看</button>
      </template>
    </MyTable>
  </div>
</template>
<script>
  import MyTable from '@/components/MyTable.vue'

  export default {
    components: {
      MyTable
    },
    data() {
      return {
        list: [
          {id: 1, name: '小明', age: 18},
          {id: 2, name: '孙大明', age: 19},
          {id: 3, name: '小芳', age: 17}
        ],
        list2: [
          {id: 1, name: '小明', age: 18},
          {id: 2, name: '孙大明', age: 19},
          {id: 3, name: '小芳', age: 17}
        ]
      }
    },
    methods: {
      del(id) {
        this.list = this.list.filter(item => item.id !== id);
      },
      show(row) {
        alert(JSON.stringify(row))
      }
    }
  }
</script>
```

# 6. VueRouter

> 版本对应关系

| Vue  |  VueRouter   |  Vuex   |
|:----:|:------------:|:-------:|
| Vue2 | VueRouter3.x | Vuex3.x |
| Vue3 | VueRouter4.x | Vuex4.x |

## 1. SPA简介

> Single Page Application 单页面应用程序, 整个应用只有一个完整的页面, 所有的内容都在一个页面中显示, 页面之间的跳转是通过JS来实现的,
> 不需要重新加载页面。

|  区分  |                单页面                 |               多页面               |
|:----:|:----------------------------------:|:-------------------------------:|
| 实现方式 |              一个html页面              |            多个html页面             |
| 页面性能 | <font color=green>按需更新，性能较高</font> | <font color=red>整页更新，性能低</font> |
| 开发效率 |     <font color=green>高</font>     |               适中                |
| 用户体验 |     <font color=green>好</font>     |               一般                |
| 学习成本 |      <font color=red>高</font>      |               适中                |
| 首屏加载 |      <font color=red>慢</font>      |   <font color=green>快</font>    |
| SEO  |      <font color=red>差</font>      |   <font color=green>优</font>    |
| 应用场景 |         系统类网站/内部网站/文档/移动站点         |         企业网站/电商网站/门户网站          |

## 2 安装VueRouter和使用

### 1. 安装VueRouter

1. 安装依赖

```shell
npm i vue-router@3.6.5
```

2. 在`main.js`引入

```js
import VueRouter from 'vue-router'
```

3. 全局注册

```js
Vue.use(VueRouter)
```

4. 创建路由实例

```js
const router = new VueRouter()
```

5. 关联Vue实例

```js
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
```

### 2. 使用步骤

1. 创建页面组件，配置路由规则

```js
import Find from '@/views/Find.vue'
import My from '@/views/My.vue'
import Friend from '@/views/Friend.vue'

const router = new VueRouter({
  routes: [
    {path: '/find', component: Find},
    {path: '/my', component: My},
    {path: '/friend', component: Friend}
  ]
})
```

也可以简写成下边的内容

```js
const router = new VueRouter({
  routes: [
    {path: '/my', component: () => import('./views/my.vue')},
    {path: '/friend', component: () => import('./views/friend.vue')},
    {path: '/find', component: () => import('./views/find.vue')},
  ]
})
```

2. 配置导航，配置路由出口

```html

<div class="footer_wrap">
  <!-- 配置导航 后边可以用 router-link 替换 -->
  <a href="#/find">发现音乐</a>
  <a href="#/my">我的音乐</a>
  <a href="#/friend">朋友</a>
</div>
<div class="top">
  <!-- 路由页面会加载到这里 -->
  <router-view/>
</div>
```

## 3 路由封装抽离

> 将路由抽离到一个单独的文件中，方便管理

- `src/router/index.js`

```js
import VueRouter from "vue-router";

const router = new VueRouter({
  routes: [
    {path: '/my', component: () => import('@/views/My.vue')},
    {path: '/friend', component: () => import('@/views/Friend.vue')},
    {path: '/find', component: () => import('@/views/Find.vue')},
  ]
})
export default router;
```

- main.js

```js
// 引入路由替换掉原来的
import router from '@/router'
```

## 4 router-link

> 切换到对应的路由之后，router-link 会自动添加高亮效果，添加了两个高亮的类名 `router-link-active`
> 和 `router-link-exact-active`。
> 具体的css还是要自己写，具体匹配的规则如下

|            类名            |  描述  |    路由    |             匹配              |
|:------------------------:|:----:|:--------:|:---------------------------:|
|    router-link-active    | 模糊匹配 | to="/my" | `/my` `/my/like` 以`/my`开头就行 |
| router-link-exact-active | 精确匹配 | to="/my" |            `/my`            |

```html

<div>
  <router-link to="/find">发现音乐</router-link>
  <router-link to="/my">我的音乐</router-link>
  <router-link to="/friend">朋友</router-link>
</div>
<style>
  .router-link-active {
    color: red;
  }
</style>
```

> 如果觉得这两个自带的类名太长了，可以在创建VueRouter实例的时候添加配置项

```js
const router = new VueRouter({
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
  routes: []
})
```

```css
.active {
    color: red;
}
```

## 5. 跳转传参

### 1. 查询参数传参

1. 直接写在路由参数中

```html

<router-link to="/my?id=1">我的音乐</router-link>
```

2. 获取参数

```js
const id = this.$route.query.id
```

### 2. 动态路由传参

1. 配置动态路由

```js
const router = new VueRouter({
  routes: [
    {path: '/search/:keywords', component: () => import('@/views/Serach.vue')},
  ]
})
```

2. 使用

```html

<router-link to="/search/如何日入十万">如何日入十万？</router-link>
```

3. 获取参数

```js
const keywords = this.$route.params.keywords
```

> 当前存在一个问题，如果不传参数的话，页面会展示空白页，所以需要配置后边的动态参数为可选的。
> 只需要在最后加一个 `?`即可,应该就是正则匹配的，?代表0或1个

```js
{
  path: '/search/:keywords?', component
:
  () => import('@/views/Serach.vue')
}
,
```

## 6. 路由重定向和404

### 1. 路由重定向

> 网页初次打开的时候， url是默认的/ 未匹配到任何组件，会出现空白，所以需要重定向到某个页面

```js
const router = new VueRouter({
  routes: [
    {path: '/', redirect: '/home'},
  ]
})
```

### 2. 404页面

> 当访问的路由不存在的时候，会出现404页面，需要配置404页面, <font color=red>需要配置在路由的最后，用通配符“*”命中</font>

```js
const router = new VueRouter({
  routes: [
    {path: '/', redirect: '/home'},
    {path: '/friend', component: () => import('@/views/Friend.vue')},
    {path: '*', component: () => import('@/views/404.vue')}
  ]
})
```

## 7. 路由模式

> 路由模式有两种，一种是hash模式(路径带#)，一种是history模式。

|    模式     |            示例            |
|:---------:|:------------------------:|
|  hash路由   | https://localhost/#/home |
| history路由 |  https://localhost/home  |

> 当然也可以通过vite.config.js来设置路由模式

```js
const router = new VueRouter({
  // 设置路由模式
  mode: 'history',
  routes: []
})
```

## 8.路由跳转

### 1. path路由跳转

```js
this.$router.push('/my');
this.$router.push({path: '/my'});
```

### 2. name路由跳转

> 适用于path有点长的时候，用name简单点

```js
const router = new VueRouter({
  routes: [
    {path: '/my', name: 'my', component: () => import('@/views/My.vue')},
  ]
})
```

```js
this.$router.push({name: 'my'});
```

### 3. 路由跳转传参

> 两种方式好像对query和params都支持，但是我懒得写了，就这样吧

1. path跳转使用query传参

```js
this.$router.push({
  path: '/my',
  query: {
    id: 1
  }
});
```

2. name跳转使用params传参

```js
this.$router.push({
  name: 'my',
  params: {
    id: 1
  }
})
```

3. name 动态路由传参有些不同

```javascript
const router = new VueRouter({
  routes: [
    {path: '/my/:id', name: 'my', component: () => import('@/views/My.vue')},
  ]
})
```

```js
this.$router.push({
  name: 'my',
  params: {
    // 这里需要跟路由配置的参数一致
    id: 1
  }
})
```

## 9. 二级路由

> 配置多级路由的时候使用children填入数组即可。<br/>
> 不过需要注意的事，Layout.vue需要配置一个路由出口，也就是需要一个`<router-view />`标签

```js
import VueRouter from "vue-router"
import Layout from "@/views/Layout.vue";

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '/article',
          component: () => import('@/views/Article.vue'),
        },
        {
          path: '/collect',
          component: () => import('@/views/Collect.vue'),
        },
        {
          path: '/like',
          component: () => import('@/views/Like.vue'),
        },
        {
          path: '/user',
          component: () => import('@/views/User.vue'),
        }
      ]
    },
    {
      path: '/detail',
      component: () => import('@/views/ArticleDetail.vue'),
    }
  ]
})
export default router;

```

2. Layout.vue

```vue
<template>
  <div class="h5-wrapper">
    <div class="content">
      <router-view />
    </div>
  </div>
</template>
```
## 10. 组件缓存 keep-alive
> keep-alive是一个内置组件，用于缓存组件的状态，避免组件的重复渲染。用它包裹动态组件时，
> 会缓存不活动的组件实例，而不是销毁它们。
> 
> 该组件是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在父组件链中。
> 
> **在组件切换过程中，把切换出去的组件保存在内存中，防止重复渲染DOM，减少加载时间及性能消耗，提高用户体验**

```vue
<template>
  <div class="content-wrapper">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>
```
> keep-alive有三个属性，分别是include、exclude、max,<br/>
> 被缓存的组件会多两个生命周期函数 activated 和 deactivated, 一旦组件被缓存了，就不会触发 created mounted destroyed 等生命周期函数，
>
> activated在组件被激活的时候触发，deactivated在组件失活的时候（也就是缓存之后跳转到其他页面时）触发。

|属性| 描述                  |
|--|---------------------|
|include| 需要缓存的组件名称数组，以逗号分隔   |
|exclude| 不需要缓存的组件名称数组，以逗号分隔  |
|max| 缓存的组件数量，超过数量的组件会被销毁 |
```vue
<template>
  <!--这里用的是组件名， 也就是组件里边的name属性，如果没有配置才会找文件名-->
  <div class="content-wrapper" >
    <keep-alive :include="['LayoutPage']">
      <router-view />
    </keep-alive>
  </div>
</template>
```
