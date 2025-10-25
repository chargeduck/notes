# 0. 基础使用。

> Echarts的官网地址是[https://echarts.apache.org/zh/index.html](https://echarts.apache.org/zh/index.html)，总得来说一共就是五个步骤

1. 引入Echarts库

```js
<script src="https://cdn.bootcdn.net/ajax/libs/echarts/5.4.0/echarts.min.js"></script>
```

2. 创建一个DOM元素，用于渲染图表。

```html

<div id="chart-container" style="width: 600px; height: 400px;"></div>
```

3. 初始化Echarts实例

```js
const chart = echarts.init(document.getElementById('chart-container'));
```

4. 配置选项

```js
const options = {
  // 图标的标题
  title: {
    text: '周阅读人数统计',
    link: 'https://www.baidu.com',
    textStyle: {
      color: 'red'
    }
  },
  // 是否展示Y轴数据的标签
  legend: {
    show: true,
    top: 'top'
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    name: '在读人数',
    data: [150, 230, 224, 218, 135, 147, 260],
    type: 'bar'
  }, {
    name: '已读人数',
    data: [350, 210, 124, 298, 115, 107, 200],
    type: 'line'
  }]
}
```

5. 给echarts配置配置项

```js
chart.setOption(options);
```

# 1 通用配置

> 任何图标都可以使用的配置

## 1. title 标题

1. 文字样式

```js
const option = {
  title: {
    text: '周阅读人数统计',
    link: 'https://www.baidu.com',
    textStyle: {
      color: 'red'
    }
  }
}
```

2. 标题边框

```js
const option = {
  title: {
    text: '周阅读人数统计',
    link: 'https://www.baidu.com',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5
  }
}
```

3. 标题位置

> left top right bottom

## 2. tooltip 提示

> 提示框组件，用于配值鼠标滑过或者点击图标时的显示框

1. trigger 触发类型

| 触发类型 | 描述         |
|------|------------|
| item | 鼠标滑过图标时触发  |
| axis | 鼠标滑过坐标轴时触发 |

2. triggerOn 触发时机

> 鼠标滑过或者点击图标时触发

| 触发类型      | 描述        |
|-----------|-----------|
| mouseover | 鼠标移过的时候展示 |
| click     | 鼠标点击的时候展示 |

3. formatter 格式化函数

> 用于自定义提示框的内容

```js
const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line'
    },
    triggerOn: 'click',
    formatter: function (args) {
      // 具体参数可以从args中获取
      console.log(args)
      // 格式化提示框的内容
      return `${ args[0].axisValue } 周阅读人数: ${ args[0].value }`;
    }
  }
}
```

## 3. toolbox 工具按钮

> echarts 提供的工具按钮，用于导出图片，数据视图，动态类型切换，数据区域缩放，重置视图等

```js
const option = {
  toolbox: {
    show: true,
    top: 'top',
    left: 'right',
    feature: {
      // 数据视图
      dataView: { show: true, readOnly: false },
      // 动态类型切换
      magicType: { show: true, type: ['line', 'bar'] },
      // 重置
      restore: { show: true },
      // 导出图片
      saveAsImage: {},
      // 区域缩放
      dataZoom: {}
    },
    dataZoom: [
      {
        // 内部缩放
        type: 'inside',

      }
    ],
  }
}
```

## 4. legend 图例

> 用于筛选系列，需要配合series使用

```js
const option = {
  legend: {
    show: true,
    top: 'top',
    data: ['在读人数', '已读人数']
  },
  series: [
    {
      name: '在读人数',
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'bar'
    },
    {
      name: '已读人数',
      data: [350, 210, 124, 298, 115, 107, 200],
      type: 'line'
    }
  ]
}
```

# 2. 坐标系图表类型

> 基于Grid来做的有x轴和y轴的图表

## 1. 柱状图

> series 中的 type 为 bar 即可,常见的效果控制

1. 最大值，最小值，平均值

```js
const markPoint = {
  data: [{
    type: 'max',
    name: '最大值'
  }, {
    type: 'min',
    name: '最小值'
  }]
}
const markLine = {
  data: [{
    type: 'average',
    name: '平均值'
  }]
}
const option = {
  series: [{
    markPoint,
    markLine
  }]
}
```

2. 数据展示

> label控制数据展示，barWidth控制宽度等

```js
const option = {
  series: [{
    label: {
      show: true,
      position: 'top',
      // 旋转角度
      rotate: 60
    },
    barWidth: 20
  }]
}
```

## 2. 折线图

> series 中的 type 为 line 即可。

1. 标记区间。

```js
const option = {
  series: [
    {
      data: [1, 2, 3, 4, 5, 6],
      markArea: {
        data: [
          [{ xAxis: 1 }, { xAxis: 3 }],
          [{ xAxis: 4 }, { xAxis: 5 }]
        ]
      }
    }
  ]
}
```

2. 线条控制 平滑曲线，面积展示

```js
const option = {
  series: [
    {
      data: [1, 2, 3, 4, 5, 6],
      // 平滑曲线
      smooth: true,
      lineStyle: {
        color: 'blue',
        type: 'solid'
      },
      areaStyle: {}
    }
  ]
}
```

3. 首列数据紧挨边缘

```js
const option = {
  xAxis: {
    boundaryGap: false
  }
}
```

4. y轴数据脱离0的比例

```js
const option = {
  yAxis: {
    scale: true
  }
}
```

5. 堆叠图

> 给series设置stack属性即可

```js 
const option = {
  series: [
    {
      name: '在读人数',
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'bar',
      stack: 'a'
    },
    {
      name: '已读人数',
      data: [350, 210, 124, 298, 115, 107, 200],
      type: 'line',
      stack: 'a'
    }
  ]
}
```

## 3. 散点图

> 数据比较特别，是一连串的二维数组，如果都集中在一起的话，可以吧两个轴的scale都打开。

```js
const option = {
  title: {
    text: '散点图'
  },
  xAxis: {
    type: 'value'
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    name: '散点图',
    data: [[100, 200], [200, 100], [300, 400], [180, 200]],
    type: 'scatter'
  }]
}
```

1. 气泡效果

> 给series设置symbolSize属性即可，通过回调函数可以动态设置气泡大小

```js
const option = {
  series: [{
    name: '散点图',
    data: [[100, 200], [200, 100], [300, 400], [180, 200]],
    type: 'scatter',
    // 气泡效果
    symbolSize (params) {
      const bmi = params[1] / params[0] / params[0]
      return bmi > 18 ? 20 : 10
    }
  }]
}
```

2. 气泡不同颜色

> 给series设置itemStyle属性即可，通过回调函数可以动态设置气泡颜色

```js
const option = {
  series: [{
    name: '散点图',
    data: [[100, 200], [200, 100], [300, 400], [180, 200]],
    type: 'scatter',
    // 气泡效果
    symbolSize (params) {
      const bmi = params[1] / params[0] / params[0]
      return bmi > 18 ? 20 : 10
    },
    // 不同颜色
    itemStyle: {
      color (params) {
        const bmi = 10000 * params.data[1] / params.data[0] / params.data[0]
        return bmi > 24 ? 'red' : 'green'
      }
    }
  }]
}
```

3. 涟漪效果

```js
const option = {
  series: [
    {
      type: 'effectScatter',
      showEffectOn: 'emphasis',
      rippleEffect: {
        brushType: 'stroke'
      }
    }
  ]
}
```

## 4.饼图

> series 中的 type 为 pie 即可, 数据类型必须包含 name 和 value

```js
const data = [
  { name: '淘宝', value: 1000000 },
  { name: '京东', value: 2000000 },
  { name: '拼多多', value: 3000000 },
  { name: '唯品会', value: 4000000 },
]
const option = {
  series: [
    {
      type: 'pie',
      data,
    }
  ]
}
```

### 1. 常见效果

1. 文字展示

```js
const option = {
  series: [
    {
      type: 'pie',
      data,
      label: {
        show: true,
        formatter (args) {
          return `${ args.name } ${ args.value } ${ args.percent }%`
        }
      }
    }
  ]
}
```

2. 圆环效果

> 通过redius属性设置， 可以设置为数组，分别设置内半径和外半径

```js
const option = {
  series: [
    {
      type: 'pie',
      data,
      radius: ['50%', '75%'],
    }
  ]
}
```

3. 南丁格尔图

> 南丁格尔图是一种基于半径的饼图，每个扇区的半径表示数据的大小，角度表示数据的比例。

```js
const option = {
  series: [
    {
      type: 'pie',
      data,
      roseType: 'radius',
      // 选中效果 单个选中
      selectedMode: 'single',
      // 选中效果偏移量
      selectedOffset: 20,
    }
  ]
}
```

## 5. 地图

### 1. 矢量地图 GIS

> 通过echarts.registerMap方法注册地图数据

```js
const myChart = echarts.init(document.querySelector('div'))
$.get('../json/map/china.json', function (chinaJson) {
  console.log(chinaJson)
  // 注册地图数据
  echarts.registerMap('chinaMap', chinaJson)
  const option = {
    geo: {
      type: 'map',
      map: 'chinaMap',
      // 允许地图缩放和拖动
      roam: true,
      // 展示省份名字
      label: {
        show: true
      },
      // 原始缩放比例
      zoom: 1,
      // 地图中心点
      center: [116.403874, 39.904989]
    }
  }
  myChart.setOption(option)
})
```

### 2. 特殊效果

1. 展示不同的颜色

```js
const myChart = echarts.init(document.querySelector('div'))
$.get('../json/map/china.json', function (ret) {
  console.log(ret)
  echarts.registerMap('jsonMap', ret)
  /**
   * 1. 显示基本的地图
   * 2. 把数据设置给series
   * 3. 把series跟geo关联起来
   * 4. 结合visualMap展示不同的颜色
   * 
   */
  const airArr = [{ name: '北京', value: 22.5 }, { name: '上海', value: 23.5 }]
  const option = {
    geo: {
      type: 'map',
      map: 'jsonMap',
      roam: true,
      label: {
        show: true
      },
      // 原始缩放比例
      zoom: 1
    },
    series: [
      {
        name: '空气质量',
        type: 'map',
        data: airArr,
        geoIndex: 0
      }
    ],
    visualMap: {
      min: 22.5,
      max: 23.5,
      inRange: {
        color: ['#00ff00', '#ff0000']
      },
      // 开启滑块效果
      calculable: true
    }
  }
  myChart.setOption(option)
}
```

