:::tip
Centos服务器，java开发环境初始化搭建 [NAT永久服务器购买链接 4C2G100M30G](https://ipxr.cn/aff/ULDEKNUV)

1. [JDK安装](#_1-jdk安装)
2. [Mysql安装](#_2-mysql8安装)
3. [Redis安装](#_3-redis安装)
4. [Nginx安装](#_4-nginx安装)
   :::

# 1. JDK安装

1. 查询系统安装的jdk

```shell
rpm -qa|grep  jdk
```

2. 卸载

```shell
sudo yum -y remove java-1.8.0-openjdk-1.8.0.262.b10-1.el7.x86_64
sudo yum -y remove java-1.8.0-openjdk-headless-1.8.0.262.b10-1.el7.x86_64
sudo yum -y remove javapackages-tools-3.4.1-11.el7.noarch
sudo yum -y remove python-javapackages-3.4.1-11.el7.noarch
sudo yum -y remove tzdata-java-2020a-1.el7.noarch
```

3. 安装jdk11

```shell
yum install java-11-openjdk
```

4. 查看安装信息

```shell
yum list installed | grep java-11-openjdk
```

5. 查询安装位置

```shell
rpm -ql java-11-openjdk.aarch64
```

6. 查看java版本

```shell
java -version
```

7. 提示问题`-bash: jps: command not found`

```shell
yum install -y  java-11-openjdk-devel.x86_64
```

# 2. Mysql8安装

> 相关链接
>
> 1. [最新 CentOS7 上使用 yum 安装 MySQL8 超详细教程](https://blog.csdn.net/zp8126/article/details/137084854)
> 2. [MySQL给root开启远程访问权限(MySQL 8)](https://www.wgstart.com/help/docs67.html)
> 3. [centos8使用yum源安装mysql8](https://juejin.cn/post/7108893345203617806)
> 4. [centOS8 安装MySQL8（亲测）](https://juejin.cn/post/6937209625192333349)
> 5. [记录CentOS7 Linux下安装MySQL8](https://blog.csdn.net/weixin_40019326/article/details/131577598)
>

## 1. 使用Yum安装

> 本来好使，写完这个笔记我重装了一下系统，发现我的服务器连不上`dev.mysql.com`了

1. 查看是否安装Mysql

```shell
rpm -qa|grep mysql
```

2. 卸载已经安装的数据

```shell
sudo yum -y remove mysql-community-icu-data-files-8.0.37-1.el7.x86_64
sudo yum -y remove mysql-community-server-8.0.37-1.el7.x86_64
sudo yum -y remove mysql-community-client-plugins-8.0.37-1.el7.x86_64
sudo yum -y remove mysql-community-client-8.0.37-1.el7.x86_64
sudo yum -y remove mysql80-community-release-el7-11.noarch
sudo yum -y remove mysql-community-common-8.0.37-1.el7.x86_64
sudo yum -y remove mysql-community-libs-8.0.37-1.el7.x86_64
sudo yum -y remove mysql-community-libs-compat-8.0.37-1.el7.x86_64
```

3. 下载mysql的源

```shell
# 如果没有wget先安装
yum install wget

# 实在现在不下来，就先下载到本地，再上传到服务器
sudo wget https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
```

4. 安装mysql源

```shell
sudo rpm -ivh mysql80-community-release-el7-3.noarch.rpm

# 上传到服务器的话就使用绝对路径,
# 写笔记之前还好使呢，重装系统之后不好用了，真难受啊
sudo rpm -ivh /etc/yun.repo.d/mysql80-community-release-el7-3.noarch.rpm
```

5. 安装mysql

```shell
sudo yum install mysql-community-server
```

6. 启动mysql

```shell
sudo systemctl start mysqld
```

7. 查看默认的密码

```shell
sudo grep 'temporary password' /var/log/mysqld.log
```

8. 设置开启自启动

```shell
sudo systemctl enable mysqld
```

9. 更新默认密码

```shell
# 登录
mysql -u root -p
# 切换数据库
use mysql
# 变更密码
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
# 变更访问权限
update user set host='%' where user='root' and host='localhost';
# 刷新权限
flush privileges;
select host,user from user where user='root';
alter user 'root'@'%' identified with mysql_native_password by '123456';
flush privileges;
```

## 2. 使用wget下载安装

### 1. 安装过程

1. 下载mysql数据

```shell

wget https://cdn.mysql.com//Downloads/MySQL-8.4/mysql-8.4.1-1.el7.x86_64.rpm-bundle.tar
```

2. 解压缩

```shell
tar -xvf mysql-8.4.1-1.el7.x86_64.rpm-bundle.tar 
```

3. 安装服务

```shell
rpm -ivh mysql-community-common-8.4.1-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-plugins-8.4.1-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-8.4.1-1.el7.x86_64.rpm 
rpm -ivh mysql-community-client-8.4.1-1.el7.x86_64.rpm
rpm -ivh mysql-community-icu-data-files-8.4.1-1.el7.x86_64.rpm 
rpm -ivh mysql-community-server-8.4.1-1.el7.x86_64.rpm
```
4. 查询是否安装
```shell
rpm -qa|grep mysql|grep -v grep 
```
5. 初始化

```shell
# 安装openssl

mysqld --initialize;
chown mysql:mysql /var/lib/mysql -R;
systemctl start mysqld.service;
systemctl enable mysqld;
```

### 1. 遇到的问题

1. `mysqld: /lib64/libcrypto.so.10: version OPENSSL_1.0.2 not found (required by mysqld)`

> 缺少`openssl`，执行命令`yum install openssl`安装ssl。
>
> 参考链接[# linux下openssl版本问题 /lib64/libcrypto.so.10: version `OPENSSL_1.0.2‘ not found](https://blog.csdn.net/xiongben0102/article/details/121649828)



# 3. Redis安装

1. 安装redis源

```shell
sudo yum install epel-release 
```

2.

# 4. Nginx安装

# 5. 问题

1. Another app is currently holding the yum lock; waiting for it to exit..

```shell
ps -ef|grep yum|grep -v grep
kill -9 3909
```

2. rpmdb: BDB0113 Thread/process 3909/139803472811840 failed: BDB1507 Thread died in Berkeley DB library

```shell
rm -f /var/lib/rpm/__db*
rpm --rebuilddb
```

