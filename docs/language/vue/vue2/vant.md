::: tip
[项目视频地址](https://www.bilibili.com/video/BV1HV4y1a7n4?spm_id_from=333.788.videopod.episodes&vd_source=d9d3eb78433e98d94cd75ddf5ac0382b&p=105)
使用vant搭建一个电商项目，学习掌握以下内容

| 完整的购物车功能| 组件库vant的使用(全部导入和按需导入)| 移动端vw适配|
|:--:|:--:|:--:|
|request请求方法封装|storage存储模块封装| api请求模块封装|
|请求响应拦截器| 嵌套路由配置| 路由导航守卫|
| 路由跳转传参| vuex分模块管理数据| 项目打包和优化|
:::

# 1. 创建项目
```shell
# 创建项目
vue create vant_shopping
# 选择自定义
Manually select features
# 选择依赖
Babel Router Vuex Css Linter
# 大差不差的反正是
```
# 2. 安装Vant
> 视频教程里没用 ElementUI, 学学VantUI也不错 [Vant2官网地址](https://vant-ui.github.io/vant/v2/#/zh-CN/),这个框架更适合移动端一点
> PC端还是 ElementUI 、ElementPlus 、Ant Designer
> 
> Vant3 Vant4都是支持Vue3的

1. 安装
```shell
npm i vant@latest-v2 -S 
```
2. 全部导入, 在`main.js`注册
```js
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)
```
3. 按需导入
> 配置babel
```shell
# 安装 babel-plugin-import 
npm i babel-plugin-import -D 
# 在babel.config.js中添加
module.exports =  {
  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
    ]
  ]
}
```
> 使用哪个组件导入哪个就行,用的太多了可以直接写个新的js，然后再main.js引入就行了
```js
import {Button, Search} from 'vant'
Vue.use(Button, Search)
```
# 3. vw适配
1. 安装插件
```shell
npm i postcss-px-to-viewport  
```
2. 项目根目录创建配置文件`postcss.config.js`
3. 添加如下配置
```js
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 375
    }
  }
}
```
# 4. 路由配置
1. 配置`router/index.js`
```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/layout'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/layout/home.vue')
        },
        {
          path: '/category',
          name: 'category',
          component: () => import('@/views/layout/category.vue')
        },
        {
          path: '/cart',
          name: 'cart',
          component: () => import('@/views/layout/cart.vue')
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('@/views/layout/user.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/search')
    },
    {
      path: '/searchList',
      name: 'searchList',
      component: () => import('@/views/search/list.vue')
    },
    {
      path: '/prodetail/:id',
      name: 'prodetail',
      component: () => import('@/views/prodetail')
    },
    {
      path: '/pay',
      name: 'pay',
      component: () => import('@/views/pay')
    },
    {
      path: '/myorder',
      name: 'myorder',
      component: () => import('@/views/myorder')
    }
  ]
})

export default router

```
2. 配置`layout/index.vue`
```vue
<template>
  <div>
    <keep-alive>
      <router-view />
    </keep-alive>
    <van-tabbar v-model="active" route active-color="#ee0a24" inactive-color="#000">
      <van-tabbar-item icon="wap-home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o" to="/category">分类</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart-o" to="/cart">购物车</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  name: 'LayoutIndex',
  data () {
    return {
      active: 0
    }
  }
}
</script>
<style></style>
```
# 5. 封装axios
> 视频的[测试文档地址](https://apifox.com/apidoc/shared-12ab6b18-adc2-444c-ad11-0e60f5693f66/doc-2221080) 
## 1. 创建 `utils/request.js`
```js
import store from '@/store'
import axios from 'axios'
import { Toast } from 'vant'

// 创建 axios 实例，将来对创建出来的实例，进行自定义配置
// 好处：不会污染原始的 axios 实例
const instance = axios.create({
  baseURL: 'http://cba.itlike.com/public/index.php?s=/api/',
  timeout: 5000
})

// 自定义配置 - 请求/响应 拦截器
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 开启loading，禁止背景点击 (节流处理，防止多次无效触发)
  Toast.loading({
    message: '加载中...',
    forbidClick: true, // 禁止背景点击
    loadingType: 'spinner', // 配置loading图标
    duration: 0 // 不会自动消失
  })

  // 只要有token，就在请求时携带，便于请求需要授权的接口
  const token = store.getters.token
  if (token) {
    config.headers['Access-Token'] = token
    config.headers.platform = 'H5'
  }

  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么 (默认axios会多包装一层data，需要响应拦截器中处理一下)
  const res = response.data
  if (res.status !== 200) {
    // 给错误提示, Toast 默认是单例模式，后面的 Toast调用了，会将前一个 Toast 效果覆盖
    // 同时只能存在一个 Toast
    Toast(res.message)
    // 抛出一个错误的promise
    return Promise.reject(res.message)
  } else {
    // 正确情况，直接走业务核心逻辑，清除loading效果
    Toast.clear()
  }
  return res
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 导出配置好的实例
export default instance

```
# 6. vuex持久化存储
> 就是存到localStorage中
# 7. 全局前置守卫
> 对于需要登录鉴权的页面，需要做拦截处理，访客如果访问需要登录的页面需要跳转登录页面
> 
> 所有的路由匹配到都要先经过全局的前置守卫，只有前置守卫放行了才能解析渲染组件，在`router/index.js`添加以下内容
```js
import user from '@/store/modules/user'
const authList = ['/pay', 'myorder']
/**
 * 全局路由守卫
 * @param to 到哪里去，完整的路由信息(路径， 参数)
 * @param from 从哪里来， 完整的路由信息(路径， 参数)
 * @param next 是否放行
 *  - next() 直接放行
 *  - next(path) 进行拦截， 跳转到指定的path
 */
router.beforeEach((to, from, next) => {
  if (!authList.includes(to.path)) {
    next()
    return
  }
  // 1. 获取token
  const token = user.userInfo.token
  debugger
  // 2. 判断是否登录
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
```
[当前进度](https://www.bilibili.com/video/BV1HV4y1a7n4?spm_id_from=333.788.player.switch&vd_source=d9d3eb78433e98d94cd75ddf5ac0382b&p=122)
