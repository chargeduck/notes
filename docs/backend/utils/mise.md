:::tip
一个更好用的各种包管理工具，从npm转换成了volta，然后又进化到了这个mise，可以管理各种各样的语言的不同版本的包
:::

1. 安装
```shell
winget install jdx.mise
```
2. 管理员模式打开 powershell
> 设置mise的工作目录什么的。
```shell
 # 核心配置目录（mise 自身数据）
[Environment]::SetEnvironmentVariable("MISE_CONFIG_HOME", "E:\ide\mise\config", "User")

# 工具安装目录（Node、Python、Go 等都装这里）
[Environment]::SetEnvironmentVariable("MISE_INSTALL_ROOT", "E:\ide\mise\tools", "User")

# 缓存目录
[Environment]::SetEnvironmentVariable("MISE_CACHE_HOME", "E:\ide\mise\cache", "User")
```
3. 检查是否生效
```shell
echo $env:MISE_CONFIG_HOME
echo $env:MISE_INSTALL_ROOT
echo $env:MISE_CACHE_HOME
```
4. 一键更新
```shell
winget upgrade jdx.mise 
```
5. 查看可安装的列表
```shell
mise ls-remote node 
// 一行展示五六个
mise ls-remote node | ForEach-Object -Begin {$cnt=0} -Process {Write-Host -NoNewline "$_  "; $cnt++; if($cnt -ge 6) {Write-Host; $cnt=0}}; Write-Host
```
6. 允许mise修改配置,一定要用powershell执行，不能用cmd
```shell
mise activate pwsh | Out-String | Invoke-Expression
```
7. 安装应用
```shell
mise install node@20
-- 全局默认版本
mise use --global node@18.16.0
node -v 
```