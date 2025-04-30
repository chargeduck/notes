:::tip
使用 useDark 自动判断系统主题，并根据系统主题切换主题。也可支持手动切换主题。
:::

1. 安装 vueUse

```shell
pnpm add @vueuse/core
```

2. 在 `main.js`中引入 `ElementPlus`的css

```shell
// 引入暗黑模式样式
import 'element-plus/theme-chalk/dark/css-vars.css' 
```

3. 创建一个页面使用`el-switch`组件切换主题

```vue
<script setup>
  import { defineOptions, ref, provide, watch } from 'vue'
  import { Moon, Sunny } from '@element-plus/icons-vue'
  import { useDark, usePreferredDark } from '@vueuse/core'

  defineOptions({
    name: 'LayoutIndex'
  })
  // 获取系统主题
  const isSystemDark = usePreferredDark()
  // 定义主题变量
  const theme = ref(isSystemDark.value)
  console.log(isSystemDark.value, 'systemDark')
  // 使用 useDark 检测系统偏好主题
  const isDark = useDark({
    selector: 'html', // 应用到 body 元素
    attribute: 'class', // 使用 class 来切换主题
    valueDark: 'dark', // 暗色主题的 class
    valueLight: '' // 浅色主题的 class
  })
  watch(isSystemDark, (newValue) => {
    isDark.value = newValue
  })
  watch(theme, (newValue) => {
    isDark.value = newValue
  })
  isDark.value = isSystemDark.value
</script>
<template>
  <el-switch
      v-model="theme"
      inline-prompt
      style="float: right"
      :active-icon="Moon"
      :inactive-icon="Sunny"
  />
</template>

```
