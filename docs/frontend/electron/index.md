:::tip
使用Electron模仿一个QQ音乐的桌面版应用,[Electron官方文档地址](https://www.electronjs.org/zh/docs/latest/tutorial/tutorial-first-app)
:::
# 1. 初始化Electron应用
## 1. 创建原生的Electron项目
1. 初始化项目
```shell
mkdir qqMusic
cd qqMusic
npm init -y
cnpm install electron --save-dev
```
2. 修改`package.json`文件
```yaml
{
  "name": "qqmusic",
  "version": "1.0.0",
  "description": "",
  # 指定入口文件
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    # 新增了启动和打包命令
    "start": "electron .",
    "build": "electron-builder --dir"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "electron": "^33.2.1"
  }
}
```
3. 创建入口文件`main.js`
```js
const {app, BrowserWindow} = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})
// 所有窗口关闭时退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```
4. 创建入口页面`index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QQ音乐</title>
</head>
<body>
  <h1>QQ音乐</h1>
</body>
</html>
```
## 2. 创建electron项目，引入vue和elementui
1. 初始化项目
```shell
npm install -g @vue/cli
vue create fake_qq_music
cd fake_qq_music
npm install
npm install element-plus --save
npm install vue-router --save
npm install vuex --save
npm install electron vue-cli-plugin-electron-builder --save-dev
```
## 3. 使用vite创建
> [参考链接](https://blog.csdn.net/llc18230851423/article/details/140567362)
1. 初始化项目
```shell
# 使用vue模板创建应用
npm create vite@latest fake_qq_music --template vue
# 进入项目目录
cd fake_qq_music 
# 安装依赖
npm install
# 安装 element-plus 和 electron
npm install element-plus --save
npm install electron vite-plugin-electron --save-dev
```
2. 配置element-plus,修改`src/main.js`文件
```js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App);
app.use(ElementPlus)
app.mount('#app')
```
3. 修改`vite.config.js`文件
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from "vite-plugin-electron";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron({
      entry: 'electron/main.js',
    })
  ],
})
```
4. 配置electron,创建`electron/main.js`文件
```js
const {app, BrowserWindow} = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // 假设Vite开发服务器运行在3000端口，后续启动时要对应上
  win.loadURL('http://localhost:5173')
    .then(r => console.log(r));
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  //   app.quit();
  // }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

```
5. 修改`package.json`文件
> 修改入口文件为 electron 的配置，添加新的启动项
```json
{
  "type": "commonjs",
  "main": "electron/main.js",
  "scripts": {
    "electron:dev": "electron ."
  }
}

```
## 3. 直接使用Electron-vue脚手架
1. 安装
```shell
npm install -g @vue/cli 
vue init simulatedgreg/electron-vue qqMusic
```
# 2. 页面修改
## 1. 取消上边的工具栏
```js
 const win = new BrowserWindow({
  // 取消工具来
  frame: false,
});
```
> 取消工具栏之后有一个问题，就是无法拖动窗口了，需要指定允许拖拽的区域,我这里直接添加到body上,
> 不过有一个问题就是整个body都允许拖动的划，页面按钮需要设置为不允许拖动，否则无法触发事件。 [具体文档地址](https://www.electronjs.org/zh/docs/latest/tutorial/custom-window-interactions#custom-draggable-regions)
> 
> 或者就是写在某一个特定的div的内联式样式里边。
```html
<style>
  body {
    app-region: drag;
  }
  button {
    app-region: no-drag;
  }
</style>
```
## 2. 解决页面闪烁问题

```js
function createWindow() {
  const win = new BrowserWindow({
    // 省略其他代码
    show: false
  });
  win.loadURL('http://localhost:5173')
  win.once('ready-to-show', () => {
    win.show()
  })
}
```

