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

# 3. .sync修饰符

> 用来实现父子组件的通信， 可以实现子组件和父组件的双向数据绑定。本质上是`:属性名`和`@update:属性名`的合写
> <font color=red>适用于弹窗类的基础组件， visible 属性的显示隐藏</font>

- 父组件

```vue

<BaseDialog :visible.sync="showFlag"/>

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

## 3. 实现一个v-loading指令，实现一个loading效果

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
