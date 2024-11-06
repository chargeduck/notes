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

export default {
  /**
   * 前端分页
   * @param srcList        源数据
   * @param current        当前页
   * @param pageSize       每页条数
   * @returns pageList    当前页数据
   * @returns total        总条数
   * @returns pageNum      总页数
   */
  sliceList(srcList, current, pageSize) {
    const formIndex = (current - 1) * pageSize;
    const toIndex = current * pageSize;
    const rows = srcList.slice(formIndex, Math.min(toIndex, srcList.length));
    const total = srcList.length;
    return {rows, total}
  },
  /**
   * 过滤列表
   * @param srcList       源数据
   * @param filterMap      过滤条件
   *  <pre>
   *    如果是post请求的直接传入对象，然后内部会转换成map
   *    如果是get请求，就使用MockParamsUtil.getUrlParamsExcludePageField()获取
   *  </pre>
   * @param ignoreField
   * @returns {Array}   过滤后的数据
   */
  filterList(srcList, filterMap, ...ignoreField) {
    if (ignoreField.length > 0) {
      ignoreField.forEach(item => {
        filterMap.delete(item)
      })
    }
    if (filterMap.size === 0) {
      return srcList
    }
    filterMap.forEach((value, key) => {

      srcList = srcList.filter(item => {
        if (typeof item[key] =='string') {
          return item[key].indexOf(value) !== -1
        }
        return item[key] == value
      })
    })
    return srcList
  }
}
```

## 2. 创建获取参数的工具类

```javascript
export default {
  /**
   * 获取get请求的参数
   * @param url
   * @param name
   * @returns {string}
   */
  getUrlParam(url, name) {
    let result = ''
    url.split('?')[1].split('&').forEach(item => {
      if (item.split('=')[0] === name) {
        result = item.split('=')[1]
      }
    })
    return result
  },
  /**
   * 获取get请求的参数Map
   * @param url                 url
   * @returns {Map<any, any>}   参数Map
   */
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
  },
  /**
   * 获取get请求的参数Map，忽略某些字段
   * @param url                 url
   * @param ignoreField         忽略的字段
   * @returns {Map<any, any>}   参数Map
   */
  getUrlParamsAndIgnoreField(url, ...ignoreField) {
    let allParams = this.getUrlParams(url);
    let filteredParams = new Map();
    allParams.forEach((value, key) => {
      if (!ignoreField.includes(key)) {
        filteredParams.set(key, value);
      }
    });
    return filteredParams;
  },
  /**
   * 获取get请求的参数Map，忽略分页字段
   * @param url                 url
   * @returns {Map<any, any>}   参数Map
   */
  getUrlParamsExcludePageField(url) {
    return this.getUrlParamsAndIgnoreField(url, 'page')
  },
  /**
   * 获取路径参数
   * eg: /systemParam/detail/123456    =>  123456
   * @param url
   * @return {*}    参数
   *
   */
  getPathUrlParams(url) {
    return url.split("/").pop()
  }
}

```

## 3. 创建MockJs

```js
import Mock from "mockjs";
import MockParamsUtil from "@/utils/MockParamsUtil";
import MockPageUtil from "@/utils/MockPageUtil";


let {gatewayInfoList} = Mock.mock({
  "gatewayInfoList|1-50": [
    {
      id: "@increment(1)",
      gatewayCode: "@word(5)",
      gatewaySerial: "@guid()",
      gatewayBrand: "@word(5)",
      gatewayMode: "@word(5)",
      equipModelId: "@word(5)",
      createBy: "@cname(3)",
      createTime: "@datetime(yyyy-MM-dd hh:mm:ss)",
      updateBy: "@cname(3)",
      updateTime: "@datetime(yyyy-MM-dd hh:mm:ss)"

    }
  ]
})
Mock.mock(new RegExp("/gatewayInfo/all*"), 'get', () => {
  return {
    code: 200,
    msg:'success',
    data: gatewayInfoList
  }
})
/**
 * 分页查询数据
 * @param params    参数
 */
Mock.mock(new RegExp("/gatewayInfo/list*"), 'get', (options) => {
  let paramsMap = MockParamsUtil.getUrlParams(options.url)
  const pageNum = paramsMap.get('pageNum')
  const pageSize = paramsMap.get('pageSize')
  let resultArr = [...gatewayInfoList]
  // 过滤查询条件
  resultArr = MockPageUtil.filterList(resultArr, paramsMap, 'pageNum', 'pageSize');
  // 分页
  const data = MockPageUtil.sliceList(resultArr, pageNum, pageSize);
  return {
    code: 200,
    msg: 'success',
    ...data
  }
})
// 新增
Mock.mock(new RegExp('/gatewayInfo/addGateway*'), 'post', (options) => {
  debugger
  const body = JSON.parse(options.body)
  gatewayInfoList = [
    Mock.mock({
      ...body,
      id: "@increment(1)",
      createBy: "@cname(3)",
      createTime: "@now()",
      updateBy: "@cname(3)",
      updateTime: "@now()"
    }),
    ...gatewayInfoList
  ]
  return {
    code: 200,
    msg: 'success',
    data: '添加成功'
  }
})
// 删除
Mock.mock(new RegExp('/gatewayInfo/*'), 'delete', (options) => {
  debugger
  const id = MockParamsUtil.getPathUrlParams(options.url)
  gatewayInfoList = gatewayInfoList.filter(item => item.id != id)
  return {
    code: 200,
    msg: 'success',
    data: '删除成功'
  }
})
// 获取详情
Mock.mock(new RegExp('/gatewayInfo/*'), 'get', (options) => {
  debugger
  const id = MockParamsUtil.getPathUrlParams(options.url)
  const data = gatewayInfoList.find(item => item.id == id)
  return {
    code: 200,
    msg: 'success',
    data
  }
})
// 编辑
Mock.mock(new RegExp('/gatewayInfo/editGateway*'), 'put', (options) => {
  const body = JSON.parse(options.body)
  if (body.id) {
    gatewayInfoList = gatewayInfoList.map(item => {
      if (item.id == body.id) {
        return body
      }
      return item
    })
    return {
      code: 200,
      msg: 'success',
      data: '编辑成功'
    }
  } else {
    gatewayInfoList = [
      Mock.mock({
        id: "@increment(1)",
        createBy: "@cname(3)",
        createTime: "@now()",
        updateBy: "@cname(3)",
        updateTime: "@now()",
        ...body
      }),
      ...gatewayInfoList
    ]
    return {
      code: 200,
      msg: 'success',
      data: '添加成功'
    }
  }

})

```

## 4. 创建页面

```vue
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="编号" prop="gatewayCode">
        <el-input
          v-model="queryParams.gatewayCode"
          placeholder="请输入编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="序列号" prop="gatewaySerial">
        <el-input
          v-model="queryParams.gatewaySerial"
          placeholder="请输入序列号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="品牌" prop="gatewayBrand">
        <el-input
          v-model="queryParams.gatewayBrand"
          placeholder="请输入品牌"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['common:gatewayInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['common:gatewayInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['common:gatewayInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['common:gatewayInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gatewayInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" width="55" label="序号" />
      <el-table-column label="编号" align="center" prop="gatewayCode" show-overflow-tooltip/>
      <el-table-column label="序列号" align="center" prop="gatewaySerial" show-overflow-tooltip/>
      <el-table-column label="品牌" align="center" prop="gatewayBrand" show-overflow-tooltip/>
      <el-table-column label="型号" align="center" prop="gatewayMode" show-overflow-tooltip/>
      <el-table-column label="设备模型" align="center" prop="equipModelId" show-overflow-tooltip/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-view"
                  @click="handleDetail(scope.row)"
                  v-hasPermi="['common:gatewayInfo:edit']"
                >详情</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['common:gatewayInfo:edit']"
                >修改</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['common:gatewayInfo:remove']"
                >删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改网关信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="编号" prop="gatewayCode">
              <el-input v-model="form.gatewayCode" placeholder="请输入编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="序列号" prop="gatewaySerial">
              <el-input v-model="form.gatewaySerial" placeholder="请输入序列号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌" prop="gatewayBrand">
              <el-input v-model="form.gatewayBrand" placeholder="请输入品牌" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号" prop="gatewayMode">
              <el-input v-model="form.gatewayMode" placeholder="请输入型号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备模型" prop="equipModelId">
              <el-input v-model="form.equipModelId" placeholder="请输入设备模型" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-show="showSaveBtn">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listGatewayInfo, getGatewayInfo, delGatewayInfo, addGatewayInfo, updateGatewayInfo } from "@/api/common/gatewayInfo";

export default {
  name: "GatewayInfo",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 网关信息表格数据
      gatewayInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示保存按钮
      showSaveBtn: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        gatewayCode: null,
        gatewaySerial: null,
        gatewayBrand: null,
        gatewayMode: null,
        equipModelId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询网关信息列表 */
    getList() {
      this.loading = true;
      listGatewayInfo(this.queryParams).then(response => {
        this.gatewayInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        gatewayCode: null,
        gatewaySerial: null,
        gatewayBrand: null,
        gatewayMode: null,
        equipModelId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加网关信息";
      this.showSaveBtn = true
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.reset()
      const id = row.id || this.ids
      getGatewayInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "网关信息详情";
        this.showSaveBtn = false
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGatewayInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改网关信息";
        this.showSaveBtn = true
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGatewayInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGatewayInfo(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除网关信息编号为"' + ids + '"的数据项？').then(function() {
        return delGatewayInfo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('common/gatewayInfo/export', {
        ...this.queryParams
      }, `gatewayInfo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
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

# 6. 常用的生成模板

## 1. velocity

```velocity

import Mock from "mockjs";
import MockParamsUtil from "@/utils/MockParamsUtil";
import MockPageUtil from "@/utils/MockPageUtil";


let {${businessName}List} = Mock.mock({
    "${businessName}List|1-50": [
        {
            id: "@increment(1)",
            #foreach($column in $columns)
                #if($column.javaField != 'id' &&
                    $column.javaField != 'createBy' &&
                    $column.javaField!= 'createTime' &&
                    $column.javaField!= 'updateBy' &&
                    $column.javaField!= 'updateTime'
                )
                    #if(${column.javaType} == 'String')
            ${column.javaField}: "@cword(3,6)",
                    #end
                    #if(${column.javaType} == 'Integer' ||
                        ${column.javaType} == 'Long'
                    )
            ${column.javaField}: "@integer(0,100)",
                    #end
                    #if(${column.javaType} == 'Double')
            ${column.javaField}: "@integer(0,100).@ingeter(0,9))",
                    #end
                    #if(${column.javaType} == 'Date')
            ${column.javaField}: "@datetime(yyyy-MM-dd hh:mm:ss)",
                    #end
                #end
            #end
            createBy: "@cname(3)",
            createTime: "@datetime(yyyy-MM-dd hh:mm:ss)",
            updateBy: "@cname(3)",
            updateTime: "@datetime(yyyy-MM-dd hh:mm:ss)"

        }
    ]
})

/**
 * 分页查询数据
 * @param params    参数
 */
Mock.mock(new RegExp("/${businessName}/list*"), 'get', (options) => {
    let paramsMap = MockParamsUtil.getUrlParams(options.url)
    const pageNum = paramsMap.get('pageNum')
    const pageSize = paramsMap.get('pageSize')
    let resultArr = [...${businessName}List]
    // 过滤查询条件
    resultArr = MockPageUtil.filterList(resultArr, paramsMap, 'pageNum', 'pageSize');
    // 分页
    const data = MockPageUtil.sliceList(resultArr, pageNum, pageSize);
    return {
        code: 200,
        msg: 'success',
        ...data
    }
})
// 新增
Mock.mock(new RegExp('/${businessName}/add${BusinessName}*'), 'post', (options) => {
    const body = JSON.parse(options.body)
        ${businessName}List = [
        Mock.mock({
            ...body,
            id: "@increment(1)",
            createBy: "@cname(3)",
            createTime: "@now()",
            updateBy: "@cname(3)",
            updateTime: "@now()"
        }),
        ...${businessName}List
    ]
    return {
        code: 200,
        msg: 'success',
        data: '添加成功'
    }
})
// 删除
Mock.mock(new RegExp('/${businessName}/*'), 'delete', (options) => {
    const id = MockParamsUtil.getPathUrlParams(options.url)
    ${businessName}List = ${businessName}List.filter(item => item.id != id)
    return {
        code: 200,
        msg: 'success',
        data: '删除成功'
    }
})
// 获取详情
Mock.mock(new RegExp('/${businessName}/*'), 'get', (options) => {
    const id = MockParamsUtil.getPathUrlParams(options.url)
    const data = ${businessName}List.find(item => item.id == id)
    return {
        code: 200,
        msg: 'success',
        data
    }
})
// 编辑
Mock.mock(new RegExp('/${businessName}/edit${BusinessName}*'), 'put', (options) => {
    const body = JSON.parse(options.body)
    if (body.id) {
        ${businessName}List = ${businessName}List.map(item => {
            if (item.id == body.id) {
                return body
            }
            return item
        })
        return {
            code: 200,
            msg: 'success',
            data: '编辑成功'
        }
    } else {
        ${businessName}List = [
            Mock.mock({
                ...body,
                id: "@increment(1)",
                createBy: "@cname(3)",
                createTime: "@now()",
                updateBy: "@cname(3)",
                updateTime: "@now()"
            }),
            ...${businessName}List
        ]
        return {
            code: 200,
            msg: 'success',
            data: '添加成功'
        }
    }

})
```

## 2. ejs 

```e
import Mock from "mockjs";
import MockParamsUtil from "@/utils/MockParamsUtil";
import MockPageUtil from "@/utils/MockPageUtil";


let {<%= table.firstLowerClassName %>List} = Mock.mock({
  "<%= table.firstLowerClassName %>List|1-10": [
    {
      <% columnList.forEach(function (item) { %>
        <%= item.field %>: "@word(5)",
      <% }) %>
    }
  ]
})
/** get请求分页 */
Mock.mock(new RegExp("/<%= table.firstLowerClassName %>/page*"), 'get', (options) => {
  let paramsMap = MockParamsUtil.getUrlParams(options.url)
    const pageNum = paramsMap.get('pageNum')
    const pageSize = paramsMap.get('pageSize')
    let resultArr = [...<%= table.firstLowerClassName %>List]
  // 过滤查询条件
  resultArr = MockPageUtil.filterList(resultArr, dataJson);
  // 分页
  const data = MockPageUtil.sliceList( resultArr, pageNum, pageSize);
  return {
    code: 200,
    msg: 'success',
    data
  }
})

/**
 * 分页查询数据
 * @param params    参数
 */
Mock.mock(new RegExp("/<%= table.firstLowerClassName %>/page*"), 'post', (options) => {
  const dataJson = JSON.parse(options.body);
  console.log(dataJson, 'dataJson')
  const page = dataJson.page
  // 过滤查询条件
  <%= table.firstLowerClassName %>List = MockPageUtil.filterList(<%= table.firstLowerClassName %>List, dataJson);
  // 分页
  const data = MockPageUtil.sliceList(<%= table.firstLowerClassName %>List, page.current, page.pageSize);
  return {
    code: 200,
    msg: 'success',
    data
  }
})
// 新增
Mock.mock(new RegExp('/<%= table.firstLowerClassName %>/add*'), 'post', (options) => {
  debugger
  const body = JSON.parse(options.body)
  <%= table.firstLowerClassName %>List = [
    Mock.mock({
      ...body,
      id: "@increment(1)",
      createBy: "@cname(3)",
      createTime: "@now()",
      updateBy: "@cname(3)",
      updateTime: "@now()"
    }),
    ...<%= table.firstLowerClassName %>List
  ]
  return {
    code: 200,
    msg: 'success',
    data: '添加成功'
  }
})
// 删除
Mock.mock(new RegExp('/<%= table.firstLowerClassName %>/*'), 'delete', (options) => {
  debugger
  const id = MockParamsUtil.getPathUrlParams(options.url)
  <%= table.firstLowerClassName %>List = <%= table.firstLowerClassName %>List.filter(item => item.id != id)
  return {
    code: 200,
    msg: 'success',
    data: '删除成功'
  }
})
// 获取详情
Mock.mock(new RegExp('/<%= table.firstLowerClassName %>/*'), 'get', (options) => {
  debugger
  const id = MockParamsUtil.getPathUrlParams(options.url)
  const data = <%= table.firstLowerClassName %>List.find(item => item.id == id)
  return {
    code: 200,
    msg: 'success',
    data
  }
})
// 编辑
Mock.mock(new RegExp('/<%= table.firstLowerClassName %>/edit*'), 'post', (options) => {
  const body = JSON.parse(options.body)
  if (body.id) {
    <%= table.firstLowerClassName %>List = <%= table.firstLowerClassName %>List.map(item => {
      if (item.id == body.id) {
        return body
      }
      return item
    })
   return {
   	code: 200,
   	msg: 'success',
   	data: '编辑成功'
   } 
  } else {
    <%= table.firstLowerClassName %>List = [
      Mock.mock({
        ...body,
        id: "@increment(1)",
        createBy: "@cname(3)",
        createTime: "@now()",
        updateBy: "@cname(3)",
        updateTime: "@now()",
      }),
      ...<%= table.firstLowerClassName %>List
    ]
    return {
      code: 200,
      msg: 'success',
      data: '添加成功'
    }
  }

})    
```

