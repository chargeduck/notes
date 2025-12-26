:::tip
记录一下自己遇到的Css的问题
:::
# 1. ElementPlus 组件的样式覆盖
## 1. El-table空状态设置背景色

```scss
:deep .el-table__empty-block {
  background: #003a70 !important;
}
```
## 2. El-description 空状态设置背景色
```scss
:deep(.el-descriptions),
:deep(.el-descriptions__body),
:deep(.el-descriptions__cell) {
  background: transparent !important;
}

:deep(.el-descriptions__title),
:deep(.el-descriptions__label),
:deep(.el-descriptions__content) {
  color: #fff !important;
}
```
