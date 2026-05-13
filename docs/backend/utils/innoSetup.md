:::tip
免费的打包制作程序[Inno Setup](https://jrsoftware.org/isinfo.php)
:::

1. 下载安装之后直接安装即可[https://jrsoftware.org/isdl.php](https://jrsoftware.org/isdl.php),汉化版本 https://share.weiyun.com/Ob5N3A8C（密码：Usbw）
2. 选择 `Create a new script file using the Script Wizard`向导模式
3. 直接Next下一步，不要勾选创建新的空白配置文件
4. 填写应用信息,填写完直接Next就行

| 标题                    | 描述   | 示例                 |
|:----------------------|:-----|:-------------------|
| Application name      | 应用名称 | 一键部署测试程序           |
| Application version   | 应用版本 | 0.0.1              |
| Application publisher | 发布者  | eleven             |
| Application website   | 官网   | http://example.com |

5. 设置文件安装目录

| 选项                                        | 作用说明                                                     | 描述                                                         |
| ------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Application destination base folder         | 软件的默认安装根目录，会安装到 `C:\Program Files\` 下        | 保持默认，这是最标准、最兼容的路径                           |
| Application folder name                     | 软件在 `Program Files` 下的文件夹名，最终路径会是 `C:\Program Files\走航软件一键部署程序\` | 你这个命名没问题，也可以改成更简短的英文，比如 `HangSoftware` |
| Allow user to change the application folder | 允许用户在安装时修改安装路径                                 | 建议保持勾选，用户体验更好                                   |
| The application doesn't need a folder       | 不创建独立文件夹，直接把文件扔到根目录                       | 千万别勾！会导致文件混乱、卸载不干净                         |
