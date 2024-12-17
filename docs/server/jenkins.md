:::tip

[当前进度 2/29](https://www.bilibili.com/video/BV1bS4y1471A?spm_id_from=333.788.player.switch&vd_source=d9d3eb78433e98d94cd75ddf5ac0382b&p=2)

:::

# 1. 安装Jenkins和Maven
> [官网地址](https://www.jenkins.io/zh/)

1. 首先先安装个jdk，建议11吧 [参考链接](/server/centosInit.html#_1-jdk安装),
> 最后的支持JDK11的版本是2.361.4, 具体的支持情况可以[参考官网](https://mirrors.jenkins.io/war-stable/)
```shell
# 试了试这个 2.361有很多依赖安装不上 还是安装最新的和 JDK17吧，或者用docker安装
wget https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_linux-x64_bin.tar.gz
# 复制到 /usr/local
tar -zxvf  openjdk-17.0.2_linux-x64_bin.tar.gz
cp jdk-17.0.2/ /usr/local
export JAVA_HOME=/usr/local/jdk-17.0.2
export PATH=$PATH:$JAVA_HOME/bin
source /etc/profile
```



2. [下载jenkins war包](https://www.jenkins.io/zh/doc/pipeline/tour/getting-started/),或者直接使用命令下载
```shell
wget https://mirrors.jenkins.io/war-stable/latest/jenkins.war
```
3. 原神 启动！
```shell
java -jar /opt/jenkins/war
```
```text
启动后可以看到以下内容，当然了访问jenkins也会提示的

Please use the following password to proceed to installation:

4580033262024cc882f736c78d3faf18

This may also be found at: /root/.jenkins/secrets/initialAdminPassword
```

> 启动完成之后，按照默认的安装差件就行了，如果安装不上可以先创建用户。
>
> 等会再`Dashborad --> Manage Jenkins --> Plugin Manager --> Advanced`配置一下新的路径
>
> ```shell
> # 直接访问这个地址也是可以的
> http://192.168.159.138:8080/pluginManager/
> ```
>
> 在`Update Site`中填写地址
>
> ```text
> http://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json
> ```

4. 修改插件安装地址

```shell
cd ~/;jenkins/updates
cp default.json default_bak.json
vim default.json
# 把 https://updates.jenkins.io/download 替换成 http://mirrors.tuna.tsinghua.edu.cn/jenkins
:1,$s/https:\/\/updates.jenkins.io\/download/http:\/\/mirrors.tuna.tsinghua.edu.cn\/jenkins/g
```

5. 推荐的插件有

| 插件                              | 插件                       | 插件                                | 插件                |
| --------------------------------- |--------------------------|-----------------------------------| ------------------- |
| Folders                           | OWASP markup Formatter   | Build Timeout                     | Credentials Binding |
| Timestamper                       | Workspace Cleanup        | Ant                               | Gradle              |
| Pipeline                          | Github Branch Source     | Pipeline: Github Groovy Libraries | Pipeline Graph View |
| Git                               | SSH Build Agents         | Matrix Authorization Strategy     | PAM Authentication  |
| LDAP                              | Email Extension          | Mailer                            | Dark Theme          |
| Localization: Chinese(Simplified) | Maven Integration Plugin | Publish over ssh                  |                     |

6. 安装maven

```shell
sudo yum install -y maven
```

7. 给jenkins安装maven插件

```shell
http://192.168.159.138:8080/manage/pluginManager/available
# 搜索插件
maven integration
```

8. 安装git

```shell
sudo yum install -y git
```



# 2. 新建item

> 安装完插件`maven integration`之后，`new item`的时候就能看到构建maven项目了

1. 创建item选择maven项目

![image-20241210150257610](http://upyuncdn.lesscoding.net/image-20241210150257610.png)

2. 源码管理里边`Git`填上源码地址,私有项目的话填上凭证

![image-20241210154208468](http://upyuncdn.lesscoding.net/image-20241210154208468.png)

3. 下边的Build填写pom的地址，这个pom.xml是相对于git根目录的。

![image-20241210152029023](http://upyuncdn.lesscoding.net/image-20241210152029023.png)

> 出现这个问题不用慌张啊，直接点 `the tool configuration`去配置一下maven路径就好了。
>
> 我用的是yum安装的，所以路径是`usr/share/maven`,如果路径不对的下边会有一行黄色的文字提示的。
>
> ```shell
> # 可以用查看一下maven 的安装位置
> whereis maven
> ```

![image-20241210152825565](http://upyuncdn.lesscoding.net/image-20241210152825565.png)

4. POST Steps 可以在打完包后执行后续操作

# 3. 打包产物自动部署

1. 安装插件

> [http://192.168.159.138:8080/manage/pluginManager/available](http://192.168.159.138:8080/manage/pluginManager/available)搜索 `Publish over SSH`

2. 配置远程服务器

> [http://192.168.159.138:8080/manage/configure](http://192.168.159.138:8080/manage/configure)的SSH Server中配置，密码的话再高级选项第一个。配置完成可是点击 `Test configuration`验证是否正确

| 参数 | 描述 | 示例 |
| ---- | ---- | ---- |
|      |      |      |



3. 修改item配置

> 项目配置里找到`Post Steps`,选择`Add post-build-step`里边的`Send files oe executr commands over SSH`.

| 参数             | 描述                                                         | 示例                                                |
| ---------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| source fils      | 打包产物的位置，以`~/.jenkins/workspace`为基准，支持通配符`*.jar` | `**/java_test/target/*.jar`<br/>`**/java_test*.jar` |
| exec command     | 在目标服务器执行的命令                                       |                                                     |
| remote directory | 传输到的远程目录                                             | `java_test`                                         |
| remove prefix    | 删除远程目录的前缀                                           | `java_test/target`                                  |

> 保存之后，点击Build Now执行构建，提示success但是没有成功传输文件。

```text
SSH: Connecting from host [localhost.localdomain]
SSH: Connecting with configuration [Ubuntu-192.168.159.135] ...
channel stopped
SSH: EXEC: completed after 202 ms
SSH: Disconnecting configuration [Ubuntu-192.168.159.135] ...
SSH: Transferred 0 file(s)
Finished: SUCCESS
```

> 这是因为我配置的哪个`**/java_test/target/*.jar`没有匹配到我的jar包，改成`**/java_test*.jar`就可以了。
