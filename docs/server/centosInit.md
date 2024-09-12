:::tip
Centos服务器，java开发环境初始化搭建 <br/>
[NAT永久服务器购买链接 4C2G100M30G](https://ipxr.cn/aff/ULDEKNUV)
1. [JDK安装](#_1-jdk安装)
2. [Mysql安装](#_2-mysql8安装)
3. [Redis安装](#_3-redis安装)
4. [Nginx安装](#_4-nginx安装)
   :::

# 0。 Centos换源
> 由于CentOs官方已全面停止维护CentOs Linux项目，
> 公告指出CentOs 7和8在2024年6月30日停止技术服务支持，
> 详情见CentOs官方公告。导致CentOs系统源已全面失效，
> 比如安装宝塔等等会出现网络不可达等报错，解决方案是更换系统源。
> 输入以下命令:
> 
```shell
bash <(curl -sSL https://linuxmirrors.cn/main.sh)
```
然后选择中国科技大学或者清华大学，一直按回车不要按Y，源更换完成就可以正常安装软件了

如果提示下边的错误
```text
http://mirrors.ustc.edu.cn/epel/7/x86_64/repodata/repomd.xml: [Errno 14] HTTP Error 404 - Not Found
Trying other mirror.
To address this issue please refer to the below wiki article 

https://wiki.centos.org/yum-errors

If above article doesn't help to resolve this issue please use https://bugs.centos.org/.



 One of the configured repositories failed (Extra Packages for Enterprise Linux 7 - x86_64),
 and yum doesn't have enough cached data to continue. At this point the only
 safe thing yum can do is fail. There are a few ways to work "fix" this:

     1. Contact the upstream for the repository and get them to fix the problem.

     2. Reconfigure the baseurl/etc. for the repository, to point to a working
        upstream. This is most often useful if you are using a newer
        distribution release than is supported by the repository (and the
        packages for the previous distribution release still work).

     3. Run the command with the repository temporarily disabled
            yum --disablerepo=epel ...

     4. Disable the repository permanently, so yum won't use it by default. Yum
        will then just ignore the repository until you permanently enable it
        again or use --enablerepo for temporary usage:

            yum-config-manager --disable epel
        or
            subscription-manager repos --disable=epel

     5. Configure the failing repository to be skipped, if it is unavailable.
        Note that yum will try to contact the repo. when it runs most commands,
        so will have to try and fail each time (and thus. yum will be be much
        slower). If it is a very temporary problem though, this is often a nice
        compromise:

            yum-config-manager --save --setopt=epel.skip_if_unavailable=true
```
则执行下边的命令就可以了
```shell
yum-config-manager --disable epel
```
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
# 6. 最近腾讯云天天被攻击，写了个脚本方便以后用
1. autoInstaller.sh
> 自动安装jdk 11 jps redis mysql nginx 
>
> 安装redis的时候有点问题重新启动一下就好了
```shell
 #!/bin/bash

# 打印欢迎信息
echo "欢迎使用软件安装脚本！"
# 获取当前工作目录
current_dir=$(pwd)

# 判断是否在 /opt/software 目录下
if [ "$current_dir" = "/opt/software" ]; then
    echo "当前在 /opt/software 目录"
else
    # 判断是否存在 /opt/software 目录
    if [! -d "/opt/software" ]; then
        mkdir -p /opt/software
        echo "创建了 /opt/software 目录"
    fi
    cd /opt/software
    echo "已切换到 /opt/software 目录"
fi

# 安装 JDK
# 提示用户是否安装 JDK
echo "是否要安装 JDK？(输入 y 表示安装，输入其他表示跳过)"
read install_jdk

if [ "$install_jdk" = "y" ]; then
    # 输出当前系统中与 jdk 相关的软件包信息
    jdk_info=$(rpm -qa | grep jdk)
    echo "当前系统中与 jdk 相关的软件包信息: $jdk_info"
    # 卸载预装的 JDK
    sudo yum -y remove $(rpm -qa | grep jdk)
    # 安装特定版本的 JDK
    sudo yum install java-11-openjdk
    # 安装 JDK 相关组件
    sudo yum install -y java-11-openjdk-devel.x86_64
else
    # 输出跳过 JDK 安装的提示
    echo "您选择跳过 JDK 安装"
fi

# 安装 MySQL
# 提示用户是否安装 MySQL
echo "是否要安装 MySQL？(输入 y 表示安装，输入其他表示跳过)"
read install_mysql
if [ "$install_mysql" = "y" ]; then
    # 获取系统版本
    system_version=$(cat /etc/redhat-release | grep -oE '[0-9]+')
    # 输出当前系统中与 mariadb 相关的软件包信息
    mariadb_info=$(rpm -qa | grep mariadb | grep -v grep)
    echo "当前系统中与 mariadb 相关的软件包信息: $mariadb_info"
    # 卸载默认的 MariaDB
    sudo yum -y remove $(rpm -qa | grep mariadb)
    # 输出安装后的 MySQL 相关软件包信息
    mysql_info=$(rpm -qa | grep mysql | grep -v grep)
    echo "当前系统中与 mysql 相关的软件包信息: $mysql_info"
    sudo yum -y remove $(rpm -qa | grep mysql | grep -v grep)
    # 安装相关依赖和进行其他安装操作
    sudo yum install wget
    mkdir mysql
    cd mysql
    if [ "$system_version" = "8" ]; then
        # 如果是 CentOS 8，执行以下安装步骤
        wget http://repo.mysql.com/mysql80-community-release-el7-3.noarch.rpm
        rpm -ivh mysql80-community-release-el7-3.noarch.rpm
        yum install mysql-server -y
        service mysqld start
        service mysqld status
        systemctl enable mysqld.service
    else
        wget https://cdn.mysql.com//Downloads/MySQL-8.4/mysql-8.4.1-1.el7.x86_64.rpm-bundle.tar
        tar -xvf mysql-8.4.1-1.el7.x86_64.rpm-bundle.tar
        rpm -ivh mysql-community-common-8.4.1-1.el7.x86_64.rpm
        rpm -ivh mysql-community-client-plugins-8.4.1-1.el7.x86_64.rpm
        rpm -ivh mysql-community-libs-8.4.1-1.el7.x86_64.rpm
        rpm -ivh mysql-community-client-8.4.1-1.el7.x86_64.rpm
        rpm -ivh mysql-community-icu-data-files-8.4.1-1.el7.x86_64.rpm
        rpm -ivh mysql-community-server-8.4.1-1.el7.x86_64.rpm
        sudo yum install -y openssl
        sudo yum install -y libaio.so.1
        sudo yum install -y libaio
        sudo yum install -y perl-Module-Install.noarch

        mysqld --initialize
        chown mysql:mysql /var/lib/mysql -R
        systemctl start mysqld.service
        systemctl enable mysqld
        sudo systemctl start mysqld
    fi    
    cd ../
else
    # 输出跳过 MySQL 安装的提示
    echo "您选择跳过 MySQL 安装"
fi

# 安装 Redis
# 提示用户是否安装 Redis
echo "是否要安装 Redis？(输入 y 表示安装，输入其他表示跳过)"
read install_redis

if [ "$install_redis" = "y" ]; then
    mkdir redis
    cd redis
    wget http://download.redis.io/releases/redis-7.2.5.tar.gz
    tar -zxvf redis-7.2.5.tar.gz
    cd redis-7.2.5
    yum install -y gcc
    yum install -y tcl
    yum install -y python3
    make MALLOC=libc
    echo "是否执行make test测试能否安装？(输入 y 表示安装，输入其他表示跳过)"
    read make_test
    if [ "$make_test" = "y" ]; then
        make test
    else
        cd src && make install
        mkdir /etc/redis/
        cd ../
        pwd
        cp redis.conf /etc/redis/6379.conf
        file_path="/etc/redis/6379.conf"
        # 先设置终端输入模式，允许删除和回退
        sed -i '/daemonize no/daemonize yes/g' "$file_path"
        sed -i '/bind 127.0.0.1 -::1/#bind 127.0.0.1 -::1/g' "$file_path"
        sed -i '1044s/requirepass.*/requirepass '$password'/' "$file_path"
        cp utils/redis_init_script /etc/init.d/redisd
        chmod +x /etc/init.d/redisd
        chkconfig --add redisd
        systemctl start redisd
        systemctl status redisd
        echo "修改密码请到 /etc/redis/6379.conf修改 1044行 reuirepass youer_password"
    fi    
    cd ../
else
    # 输出跳过 Redis 安装的提示
    echo "您选择跳过 Redis 安装"
fi

# 安装 Nginx
# 提示用户是否安装 Nginx
echo "是否要安装 Nginx？(输入 y 表示安装，输入其他表示跳过)"
read install_nginx

if [ "$install_nginx" = "y" ]; then
    mkdir nginx
    cd nginx
    wget http://nginx.org/download/nginx-1.27.0.tar.gz
    tar -zxvf nginx.tar.gz
    yum -y install pcre-devel
    yum -y install openssl openssl-devel
    yum -y install zlib-devel
    ./configure --prefix=/usr/local/nginx --with-http_ssl_module
    make
    make install
    whereis nginx
    cd /usr/local/nginx/sbin
    ./nginx

else
    # 输出跳过 Nginx 安装的提示
    echo "您选择跳过 Nginx 安装"
fi

# 输出安装了哪些软件
installed_software=""
if [ "$install_jdk" = "y" ]; then
    installed_software="$installed_software JDK"
fi
if [ "$install_mysql" = "y" ]; then
    installed_software="$installed_software MySQL"
fi
if [ "$install_redis" = "y" ]; then
    installed_software="$installed_software Redis"
fi
if [ "$install_nginx" = "y" ]; then
    installed_software="$installed_software Nginx"
fi
cd /opt
# 输出最终安装的软件列表
echo "安装了以下软件: $installed_software"
echo "请执行 chmod +x openPorts.sh提升权限,并执行openPorts.sh来开放端口"
```
2. openPorts.sh
> 自动安装firewalld，批量开放端口

```shell
#!/bin/bash

# 检查 firewalld 是否安装
if rpm -q firewalld >/dev/null; then
    sudo systemctl start firewalld
    sudo systemctl enable firewalld
else
    # 未安装则进行安装
    sudo yum install firewalld -y
    sudo systemctl start firewalld
    sudo systemctl enable firewalld
fi

# 提示用户输入端口号
echo "请输入您想要打开的端口号，用空格隔开："
# 先设置终端输入模式，允许删除和回退
stty erase ^H
read ports
# 恢复终端输入模式为默认
stty sane

# 拆分用户输入的端口号
IFS=' ' read -ra port_array <<<"$ports"

# 开启端口
for port in "${port_array[@]}"; do
    sudo firewall-cmd --add-port="$port"/tcp --permanent
done

sudo systemctl restart firewalld
echo "重启firewall成功, 当前服务器开放端口为"
sudo firewall-cmd --list-ports

```
