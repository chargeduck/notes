# 1. 简介

> 
>
> 用来生成随机数据，拦截Ajax请求，在后端没有开发完成的时候模拟返回数据
>
> - 采用`json`数据模拟，生成数据比较繁琐且不支持增删改查，
> - 采用`mockjs`模拟，可以模拟各种场景的接口，随机生成条数支持增删改查

# 2. 使用 MockJs

1. 创建vue项目

```shell
# vuecli创建
npm i -g @vue/cli
vue create mockjs_demo
# vite创建
npm init vite@latest
```

2. 安装mockjs依赖

```shell
npm i mockjs
```

3. 创建文件`src/mock/index.js`

```shell
import Mock from'mockjs'

console.log(Mock, 'MockJS')
```

4. 在`main.js`中引入

```java
import './mock/index'
```

5. 启动项目查看控制台

# 3. Mock语法

> [Mock文档地址](http://mockjs.com/examples.html),**<font color=red>方法名以 c 开头就是生成中文，否则英文</font>**

注意事项

- **特别注意`@image`方法，现在生成访问会提示`Too big of an image!`,改用`Mock.Randonm.image()`,还有一点就是第一个参数里边是小写的`x`而不是`*`**
- **如果存在@date 会把后边带格式的@date也强制转换成 yyyy-MM-dd注意不要混用**

| 方法            | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| `@word`         | 生成文本，使用`@cword()`生成中文,                            |
| `@cword(5)`     | 指定生成长度5的中文，                                        |
| `@cword(1-100)` | 随机长度1-100的中文，下边所有的方法都以此类推                |
| `@title`        | 生成英文标题                                                 |
| `@sentence`     | 生成英文句子                                                 |
| `@paragraph`    | 生成段落                                                     |
| `@increment(1)` | 增量id                                                       |
| `@cname()`      | 姓名                                                         |
| `@id()`         | 身份证号                                                     |
| `@city()`       | 城市 后边加true显示省份，不加只展示市                        |
| `@image()`      | 随机生成图片<br>第一个参数是图片大小，第二个是背景色，第三个是字体颜色，第四个是图片格式，第五个是文字 |
| `@date()`       | 生成日期                                                     |

## 1. 生成字符串

```javascript
const randomStr = Mock.mock({
  'string|1-10':'a', // 1-10个a
  'string|4': 'a' // 4个a
});
console.log(randomStr, 'randomStr');
```

## 2. 生成文本

```javascript
const randomWords = Mock.mock({
  string: "@cword()", //随机字符串
  str: "@cword(1)", // 随机字符串长度1
  str1: "@cword(1, 10)" // 随机字符串长度1-10
});
console.log(randomWords, 'randomWords');
```

## 3. 生成标题和句子

```javascript
const title = Mock.mock({
  title: "@ctitle",
  content: "@csentence",
  titleRange: "@ctitle(1, 10)",
  contentRange: "@csentence(50, 100)"
});
console.log(title, 'title');
```

## 4. 生成段落

```javascript
const content = Mock.mock({
  content: "@cparagraph",
  contentRange: "@paragraph(1, 100)"
});
console.log(content, 'content');
```

## 5. 生成数字

```js
const number = Mock.mock({
  // "number|80": 1, //生成指定数字80，跟后边的没关系
  "number|1-80": 1 // 生成1-80的数字
});
console.log(number, 'number');
```

## 6. 名字 身份证号 地址

```js
const data = Mock.mock({
  id: "@id()",
  name: "@cname()",
  "age|18-28": 1,    
  "sex|1": ["男", "女"], // 男或女
  address: "@city(true)"
});
console.log(data, 'data');
```

## 7. 自增id和数组

```javascript
const id = Mock.mock({
    // 生成一个2-10的id数组，自增步数为1
  "array|2-10": [
    {
      id: "@increment(1)"
    }
  ]
});
```

## 8. 生成图片

```javascript
/**
 * 随机生成头像
 * 第一个参数是图片大小，第二个是背景色，第三个是字体颜色，第四个是图片格式，第五个是文字
 * 图片格式有png、jpg、jpeg、webp、gif、bmp、svg，默认png，文字默认是头像的第一个字母
 * image()方法不怎么好用访问会出现 Too big of an image!
 * 使用 Mock.Random.image()方法
 * @type {*|{valid: *, XHR: *, RE: *, _mocked: {}, Random: *, toJSONSchema: *, Handler: *, setup: function(*): *, Util: *, heredoc: *}}
 */
const avatar = Mock.mock({
  avatar: Mock.Random.image('200x100', '#894FC4', '#FFF', 'png', '测试图片'),
  avatar1: "image('200x100', '#894FC4', '#FFF', 'png', '测试图片')"
});
console.log(avatar, 'avatar');
```

## 9.生成日期

```javascript
/**
 * 如果存在@date 会把后边带格式的也强制转换成 yyyy-MM-dd注意不要混用
 */
const date = Mock.mock({
  date: "@date",
  date1: "@date('yyyy-MM-dd')",
  date2: "@date('yyyy-MM-dd hh:mm:ss')",
  datetime: "@datetime()",
  time: "@time()",
  now: "@now()"
})
console.log(date, 'date');
```

# 4. Mock拦截请求

## 1. 定义Get请求

- 定义Mockjs

```javascript
Mock.mock('/sys/user', 'get', {
  code: 200,
  message: "success",
  data: Mock.mock({
    "array|1-50": [
      {
        id: "@increment(1)",
        name: "@cname",
        "age|18-28": 1,
        "sex|1": ["男", "女"],
        address: "@city(true)"
      }
    ]
  }).array
})
```

- 调用

```javascript
import axios from "axios";
export default {
  created() {
    axios.get("/sys/user").then((res) => {
      this.msg = res.data
      console.log(res, 'res')
    })
  }
}
```

## 2. 定义Post请求

> 一样的，把 get 改成 post 就行了

# 5. 实现增删改查

## 1. 创建分页工具类

```javascript
/**
 * 前端分页
 * @param srcList        源数据
 * @param current        当前页
 * @param pageSize       每页条数
 * @returns pageList    当前页数据
 * @returns total        总条数
 * @returns pageNum      总页数
 *
 */
export default {
  sliceList(srcList, current, pageSize) {
    const formIndex = (current - 1) * pageSize;
    const toIndex = current * pageSize;
    const records = srcList.slice(formIndex, Math.min(toIndex, srcList.length));
    const pageNum = Math.ceil(srcList.length / pageSize);
    const total = srcList.length;
    return {records, total, pageNum}
  },
  filterList(srcList, filterMap) {
    filterMap.forEach((value, key) => {
      srcList = srcList.filter(item => {
        return item[key].indexOf(value) !== -1
      })
    })
    return srcList
  }
}
```

## 2. 创建获取参数的工具类

```javascript
export default {
  getUrlParam(url, name) {
    let result = ''
    url.split('?')[1].split('&').forEach(item => {
      if (item.split('=')[0] === name) {
        result = item.split('=')[1]
      }
    })
    return result
  },

  getUrlParams(url) {
    let result = new Map()
    const split = url.split('?');
    if (split.length < 2) {
      return result
    }
    split[1].split('&').forEach(item => {
      result.set(item.split('=')[0], item.split('=')[1])
    })
    return result
  }
}
```

## 3. 创建MockJs

```vue
import Mock from "mockjs";
import PageUtil from "@/utils/PageUtil";
import ParamsUtil from "@/utils/ParamsUtil";

let {newsList} = Mock.mock({
  "newsList|1-20": [
    {
      id: "@increment",
      title: '@ctitle',
      content: '@cparagraph(5,10)',
      createTime: '@date(yyyy-MM-dd hh:mm:ss)',
      // image: 'https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/web/static/image/logo-icon-white-bg.dc28fd5e.png'
      image: Mock.Random.image('50x50', '#4A7BF7', '#FFF', 'png', '@word(5,10)')
    }
  ]
})
Mock.mock(new RegExp('/mock/news/page*'), 'get', (options) => {
  const urlParamsMap = ParamsUtil.getUrlParams(options.url);
  console.log(urlParamsMap, 'urlParams')
  const current = urlParamsMap.get('current') || 1;
  const pageSize = urlParamsMap.get('pageSize') || 10;
  urlParamsMap.delete('current')
  urlParamsMap.delete('pageSize')
  if (urlParamsMap.size > 0) {
    newsList = PageUtil.filterList(newsList, urlParamsMap)
  }
  const data = PageUtil.sliceList(newsList, current, pageSize)
  return {
    code: 200,
    message: 'success',
    data
  }
})

Mock.mock(new RegExp('/mock/news/page*'), 'post', (options) => {
  const body = JSON.parse(options.body)
  const searchMap = new Map(Object.entries(body.searchForm));
  if (searchMap.size > 0) {
    newsList = PageUtil.filterList(newsList, searchMap)
  }
  const data = PageUtil.sliceList(newsList, body.page.current, body.page.pageSize)
  return {
    code: 200,
    message: 'success',
    data
  }
})

Mock.mock(new RegExp('/mock/news/add*'), 'post', (options) => {
  const body = JSON.parse(options.body)
  newsList = [
    Mock.mock({
      id: '@increment',
      title: body.title,
      content: body.content,
      createTime: '@now()',
      image: Mock.Random.image('50x50', '#4A7BF7', '#FFF', 'png', '@word(5,10)')
    }),
    ...newsList
  ]
  return {
    code: 200,
    message:'success',
    data: '添加成功'
  }
})

Mock.mock(new RegExp('/mock/news/del/*'), 'delete', (options) => {
  const id = options.url.split('/').pop()
  newsList = newsList.filter(item => item.id != id)
  return {
    code: 200,
    message:'success',
    data: '删除成功'
  }
})

Mock.mock(new RegExp('/mock/news/detail/*'), 'get', (options) => {
  const id = options.url.split('/').pop()
  const data = newsList.find(item => item.id == id)
  return {
    code: 200,
    message:'success',
    data
  }
})

Mock.mock(new RegExp('/mock/news/edit*'), 'put', (options) => {
  const body = JSON.parse(options.body)
  newsList = newsList.map(item => {
    if (item.id == body.id) {
      return {
       ...item,
        title: body.title,
        content: body.content
      }
    }
    return item
  })
})
```

## 4. 创建页面

```vue
<template>
  <div>
    <el-form :model="searchForm" inline style="float: left">
      <el-form-item label="标题" prop="title">
        <el-input v-model="searchForm.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="searchForm.content"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="add">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border stripe>
      <el-table-column type="index" label="序号" width="50"/>
      <el-table-column prop="image" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.image" alt="" width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题"/>
      <el-table-column prop="content" label="内容" width="1200"/>
      <el-table-column prop="createTime" label="日期"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="detail(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page.current"
        :page-sizes="[10, 20, 30, 40, 5]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
    </el-pagination>
    <el-dialog :visible.sync="dialogVisible" title="编辑">
      <el-form :model="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内容" prop="content">
              <el-input v-model="form.content"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图片" prop="image">
              <el-input v-model="form.image" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期" prop="createTime">
              <el-input v-model="form.createTime" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="edit">确定</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HelloWorld',
  data() {
    return {
      searchForm: {
        title: '',
        content: ''
      },
      tableData: [],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      dialogVisible: false,
      form: {
        title: '',
        content: '',
        id: '',
        image: '',
        createTime: ''
      }
    }
  },
  created() {
    this.fetchDataPost()
  },
  methods: {
    fetchDataPost() {
      axios.post('/mock/news/page', {
        page: this.page,
        searchForm: this.searchForm
      }).then(resp => {
        this.tableData = resp.data.data.records
        this.page.total = resp.data.data.total
      })
    },
    fetchData() {
      axios.get('/mock/news/page', {
        params: {
          current: this.page.current,
          pageSize: this.page.pageSize,
          title: this.searchForm.title,
          content: this.searchForm.content
        }
      }).then(resp => {
        this.tableData = resp.data.data.records
        this.page.total = resp.data.data.total
      })
    },
    search() {
      this.fetchDataPost()
    },
    add() {
      axios.post('/mock/news/add', {
        title: this.searchForm.title,
        content: this.searchForm.content
      }).then(resp => {
        this.searchForm = {}
        this.fetchDataPost()
        this.$message.success(resp.data)
      })
    },
    detail(id) {
      this.dialogVisible = true
      axios.get(`/mock/news/detail/${id}`)
          .then(resp => {
            this.form = resp.data.data
          })
    },
    edit() {
      this.dialogVisible = false
      axios.put('/mock/news/edit', this.form)
          .then(resp => {
            this.fetchDataPost()
            this.$message.success(resp.data)
          })
    },
    del(id) {
      axios.delete(`/mock/news/del/${id}`)
          .then(resp => {
            this.fetchDataPost()
            this.$message.success(resp.data)
          })
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.fetchDataPost()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.fetchDataPost()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

```

## 5. 引入MockJs

> 在main.js中引入

```javascript
import Vue from 'vue'
import App from './App.vue'
import './mock/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  render: h => h(App),
}).$mount('#app')
```



