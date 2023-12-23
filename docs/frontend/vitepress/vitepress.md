# 1. 创建VitePress项目

> 确保自己已经安装好了node，我这个笔记用的是node 18.16.0,
> 怎么安装nvm这个可以csdn或者掘金，再或者等我有空了我就更新一下

1. 使用nvm安装node
```shell
# 查看可用版本
nvm list avaliable
# 安装node
nvm install 18.16.0
# 切换node
nvm use 18.16.0 
```
2. 创建vitepress项目
```shell
# 首先全局安装vitepress
npm install -D vitepress 
# 创建一个项目文件夹
mkdir notes
cd notes
# 使用vitepress自带的npx初始化
npx vitepress init
```
3. 配置vitepress
```shell
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./docs
│
◇  Site title:
│  notes（你的项目名称）
│
◇  Site description:
│  后端仔的笔记（你的项目介绍）
│
◇  Theme:
│  Default Theme
│
◇  Use TypeScript for config and theme files?
│  Yes
│
◇  Add VitePress npm scripts to package.json?
│  Yes
│
└  Done! Now run npm run docs:dev and start writing.

```
4. 运行
```shell
npm run docs:dev
```
# 2. 推送项目到github
1. 在GitHub创建一个项目
2. 给当前文件夹配置远程仓库
```shell
# 在项目的根目录初始化git
git init
# 添加远程仓库地址
git remote add origin git@github.com:youname/notes.git
```
3. 在项目根目录创建`.gitignore`文件
```ignore
/node_modules/
/.idea/
```
4. 提交代码到远程仓库
```shell
# 检查文件状态
git status
# 添加文件被git管理
git add *
# 提交
git commit -m 初始化提交
# 推送远程
git push origin
```
# 3. 创建github部署脚本
最终要在GitHub的Pages展示的所以创建一个部署脚本，参考[十分钟使用vitepress+github action+gitee pages 搭建你的专属文档](https://blog.csdn.net/qq_31647491/article/details/134006896?spm=1001.2014.3001.5506)
1. 在项目根目录创建 `.github/workflows`文件夹,然后在这个文件夹下创建`deploy.yml`
**因为我不需要gitee的Pages所以下边的配置就被我删除了**
```shell

name: Deploy VitePress site to Pages

on:
  push:
    # 推送任意tags或者master分支推送的时候触发任务
    tags:
      - '*'
    branches:
      - master

  workflow_dispatch:

jobs:
  deploy-and-sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v4
        with:
          ref: 'master'

      - name: Install yarn
        run: corepack enable

      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install

      - name: Build Site
        run: npm run docs:build

      # 将文档产物提交到gh-pages分支
      - name: Deploy for Github 🚀
        uses: JamesIves/github-pages-deploy-action@v4.4.1
        with:
          branch: gh-pages
          folder: docs/.vitepress/dist
          # enable single-commit to reduce the repo size
          single-commit: true
          clean: true

#      - name: Sync to Gitee
#        uses: wearerequired/git-mirror-action@v1.2.0
#        env:
#          SSH_PRIVATE_KEY: ${{ secrets.GITEE_RSA_PRIVATE_KEY }}
#        with:
#          # GitHub 仓库地址
#          source-repo: git@github.com:chargeduck/notes.git
#          # Gitee 仓库地址
#          destination-repo: git@gitee.com:chargeduck/notes.git
#
#      - name: Build Gitee Pages
#        uses: yanglbme/gitee-pages-action@main
#        with:
#          # 替换为你的 Gitee 用户名
#          gitee-username: chargeduck
#          # 注意在 Settings->Secrets 配置 GITEE_PASSWORD
#          gitee-password: ${{ secrets.GITEE_PASSWORD }}
#          # 注意替换为你的 Gitee 仓库，仓库名严格区分大小写，请准确填写，否则会出错
#          gitee-repo: chargeduck/notes
#          # 要部署的分支，默认是 master，若是其他分支，则需要指定（指定的分支必须存在）
#          branch: gh-pages
```
2. 按照上边的步骤把这个文件提交到github上

# 4. Pages配置
1. 打开github的仓库地址，找到`Settings`,选择`Pages`
2. 在右侧的 `Build and deployment`下边的`Source`选择`Deploy form a branch`
3. 在下边的`Branch`中选择`gh-pages`分支 `/(root)`默认然后保存即可

# 5. 遇到的问题
## 1. 提交之后没有生成`gh-pages`分支
> 第一次是因为 `deploy.yml`没有放到`.github/workflow`文件夹下
## 2. 工作流执行错误记录
> 修改了`deploy.yml`位置正确后还是没有创建`gh-pages`分支
> 点击仓库的`Actions`选项，在页面上的All Workflows中找到失败的job
## 1. Dependencies lock file is not found in /home/runner/work/notes/notes. Supported file patterns: yarn.lock 
> `deploy.yml`中执行了yarn来打包和管理依赖，但是项目里边没有`yarn.lock`文件

1. 执行命令
```shell
yarn install
```
这个时候我的node版本还是`16.0.0`,他报错`vite@5.0.10: The engine "node" is incompatible with this module. Expected version "^18.0.0 || >=20.0.0". Got "16.20.0"`
再执行
```shell
nvm list available
nvm install 18.16.0
nvm use 18.16.0
# 再次执行项目出现 yarn.lock 
yarn install
# 把yarn.lock提交到github上
```
## 2. The deploy step encountered an error: The process '/usr/bin/git' failed with exit code 128 
> 提示我没有权限，按照上边csdn老哥的步骤。
> 
> 在 GitHub 项目的`Settings -> Actions -> General`路径下配置`Fork pull request workflows from outside collaborators`为`Require approval for first-time contributors who are new to GitHub`，
>
> 将`Workflow permissions`配置为`Read and write permissions`。
