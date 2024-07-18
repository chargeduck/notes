:::tip
Centos服务器，java开发环境初始化搭建 <br/>
[NAT永久服务器购买链接 4C2G100M30G](https://ipxr.cn/aff/ULDEKNUV)
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
yun install openssl
mysqld --initialize;
chown mysql:mysql /var/lib/mysql -R;
systemctl start mysqld.service;
systemctl enable mysqld;
```

### 2. 遇到的问题

1. `mysqld: /lib64/libcrypto.so.10: version OPENSSL_1.0.2 not found (required by mysqld)`

> 缺少`openssl`，执行命令`yum install openssl`安装ssl。
>
> 参考链接[# linux下openssl版本问题 /lib64/libcrypto.so.10: version `OPENSSL_1.0.2‘ not found](https://blog.csdn.net/xiongben0102/article/details/121649828)

2. mysqld: error while loading shared libraries: libaio.so.1: cannot open shared object file: No such file or directory

> 缺少`libaio.so.1`
>
> ```shell
> yum install -y libaio.so.1
> yum install -y libaio
> ```

3. /usr/bin/perl is needed by mysql-community-server-8.4.1-1.el7.x86_64
   	perl(Getopt::Long) is needed by mysql-community-server-8.4.1-1.el7.x86_64
   	perl(strict) is needed by mysql-community-server-8.4.1-1.el7.x86_64

> ```shell
> yum install -y perl-Module-Install.noarch
> ```
>
> 

4. Plugin 'mysql_native_password' is not loaded

> 需要修改my.cnf
>
> ```ini
> [mysqld]
> default_authentication_plugin=mysql_native_password
> ```



# 3. Redis安装

## 1. 安装redis

> 参考链接
>
> 1. [CentOS(Linux)离线安装Redis详细教程（亲测可行）](https://blog.csdn.net/a342874650/article/details/133750053)

1. 直接下载源文件

```shell
# 使用wget下载或者下载到本地然后使用xftp或者scp命令上传到服务器
wget http://download.redis.io/releases/redis-7.2.5.tar.gz
```

2. 解压缩

```shell
tar -zxvf redis-7.2.5.tar.gz
```

3. 进入目录编译

```shell
cd redis-7.2.5
# 如果有了的话就不许要安装了
yum install gcc
make MALLOC=libc
```

执行完可以尝试一下安装

```shell
# 测试是否可以安装
make test
# 提示 缺什么就用yum安装就行了
cd src && make test
which: no python3 in (/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin)
make[1]: Entering directory `/opt/software/redis-7.2.5/src'
    CC Makefile.dep
make[1]: Leaving directory `/opt/software/redis-7.2.5/src'
which: no python3 in (/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin)
make[1]: Entering directory `/opt/software/redis-7.2.5/src'
You need tcl 8.5 or newer in order to run the Redis test
make[1]: *** [test] Error 1
make[1]: Leaving directory `/opt/software/redis-7.2.5/src'
make: *** [test] Error 2
# 我这个就需要安装tcl python3
yum install tcl
yum install python3
```

没问题就执行安装

```shell
cd src && make install
# 提示信息
Hint: It's a good idea to run 'make test' ;)

    INSTALL redis-server
    INSTALL redis-benchmark
    INSTALL redis-cli

```

4. 运行

```shell
./redis-server
```

## 2. 设置redis自启动

1. 创建目录

```shell
mkdir /etc/redis/
```

2. 复制配置文件

```shell
cd ../
# /opt/software/redis-7.2.5 这个要看你具体放的位置
cp redis.conf /etc/redis/6379.conf
```

3. 修改配置

```shell
vim /etc/redis/6379.conf
# 可以使用搜索 ?daemonize 或者 /daemonize
# 如果是我这个版本可以直接跳转
# 设置行号
:set nu
# 跳转
: 309
# 309行
daemonize yes
# 87行 注释掉
#bind 127.0.0.1 -::1
# 1044行开启密码
requirepass your_password
```

4. 复制启动文件

```shell
cp utils/redis_init_script /etc/init.d/redisd
chmod +x /etc/init.d/redisd
```

5. 增加系统服务

```shell
chkconfig --add redisd
```

6. 开放防火墙

```shell
firewall-cmd --add-port=6379/tcp --permanent
systemctl restart firewalld
# 查看有哪些端口开放
firewall-cmd --zone=public --list-ports
```

7. 启动

```shell
service redisd start
# 或者
systemctl start redisd
# 查询状态
systemctl status redisd
```

8. 连接测试

```shell
cd /opt/software/redi-7.2.5/src
./redis-cli
# 认证，没开密码就算了
AUTH your_password
```

# 4. Nginx安装

参考我的已有文章

1. [Centos安装Nginx错误集锦](https://juejin.cn/post/7094622494060986381)
2. [nginx安装、前后端分离部署流程](https://juejin.cn/post/7095261381259165733)
3. [Nginx安装部署SSl证书搭建HTTPS](https://juejin.cn/post/7158444709411553310)

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

