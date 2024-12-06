::: tip

[笔记来源1/28](https://www.bilibili.com/video/BV1CJ411T7BK?spm_id_from=333.788.player.switch&vd_source=d9d3eb78433e98d94cd75ddf5ac0382b&p=2),这个老师讲的Netty和JUC也不错，



:::

# 1. 概念

> Docker是一个开源的应用容器引擎。
>
> 可以让开发者打包他们的应用以及依赖包到一个轻量级，可移植的容器中。然后发布到任何流行的linux机器中。
>
> 容器完全使用沙箱机制，相互隔离且消耗较低。

## 1. 安装docker

```shell
# 更新yum
yum update
# 安装需要的软件包
# yum-util 提供 yum-config-manager功能，另外两个是devicemapper驱动依赖的
yum install -y yum-utils device-mapper-persistent-data lvm2
# 设置yum源
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
# 安装docker
yum install -y docker-ce docker-ce-cli containerd.io
# 查看docker版本
docker -v
# 设置开机自启动
systemctl enable docker --now
# 设置docker 加速 也可以去阿里云搜 容器镜像服务 镜像工具里边有个镜像加速器
tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.chenby.cn",
    "https://docker.monlor.com",
    "https://docker.kubesre.xyz"
  ]
}
EOF
# 重启docker
sudo systemctl daemon-reload
sudo systemctl restart docker
# 远程
vim /usr/lib/systemd/system/docker.service
```

**错误解决**

1. Job for docker.service failed because the control process exited with error code. See "systemctl status docker.service" and "journalctl -xe" for details.

> 使用`journalctl -xe`查看具体的报错信息

## 2. 架构

![http://upyuncdn.lesscoding.net/image-20241205101832825.png](http://upyuncdn.lesscoding.net/image-20241205101832825.png)

# 2. docker命令

> 常见命令如下，具体查看[官方文档](https://docs.docker.com)

| 序号 | 命令          | 描述                      |
| ---- | ------------- | ------------------------- |
| 1    | docker pull   | 拉取镜像                  |
| 2    | docker images | 查看本地镜像              |
| 3    | docker rmi    | 删除镜像                  |
| 4    | docker build  | 构建镜像 需要写Dockerfile |
| 5    | docker save   | 把镜像保存到本地          |
| 6    | docker load   | 加载打包的镜像            |
| 7    | docker push   | 推到docker仓库            |
| 8    | docker run    | 创建容器运行容器          |
| 9    | docker stop   | 停止容器                  |
| 10   | docker start  | 启动容器内服务            |
| 11   | docker ps     | 查看容器运行状态          |
| 12   | docker rm     | 删除容器                  |
| 13   | docker logs   | 查看容器日志              |
| 14   | docker exec   | 进入容器操作              |

![image-20241206102545984](http://upyuncdn.lesscoding.net/image-20241206102545984.png)

**尝试使用docker拉取nginx镜像**

> 可以去[hub.docker.com](https://hub.docker.com)搜索镜像描述

1. 拉取镜像

```shell
# 不指定版本直接拉最新的
docker pull nginx
```

2. 查看本地的镜像

```shell
docker images
```

3. 保存镜像压缩包

```shell
# 查看帮助
docker save --help
# 保存 -o 指定文件名称 后边加上镜像名称和版本
docker save -o nginx.tar nginx:latest
```

4. 删除镜像

```shell
docker rmi nginx:latest
```

5. 加载本地镜像

```shell
# 查看帮助文档 
docker load --help
# -i 表示要加载的文件 -q 不输出日志
docker load -i nginx.tar
```

6. 创建并运行容器

```shell
# -d 后台运行并打印容器id
# --name 指定容器名称
# -p 端口映射 多次是要用可以映射多个端口 主机端口:容器端口
# 最后指定镜像的名称
docker run -d --name nginx -p 80:80 nginx
# 运行成功会输出容器的id
```

7. 查看容器运行状态

```shell
# 查看运行中二段容器
docker ps
# 查看所有的容器
docker ps -a
# 可以对输出的内容进行格式化
docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}\t{{.Names}}"
```

> 为了简化命令，可以在添加命令别名

```shell
vim ~/.bashrc
# 添加这一行之后，使用 dps既可以边界查看容器了
alias dps='docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}\t{{.Names}}"'
# 刷新别名
source ~/.bashrc
```



8. 停掉容器

```shell
# 使用 容易名称 或者是 容器id 都可以结束容器
docker stop nginx
```

9. 查看日志

```shell
# 可以使用-f滚动查看日志
docker logs nginx
```

10. 进入容器内部

```shell
# -it 表示可交互终端 
# 指定bash作为交互语言
docker exec -it nginx bash
# 退出容器
exit
```

11. 删除容器

```shell
# 先停止再删除
docker stop nginx
docker rm nginx
# 强制删除
docker rm nginx -f
```

# 3. 数据卷

> 容器内只提供了最小化运行的环境，所以想要修改文件有些困难，所有就有了数据卷。
>
> **数据卷(volume)**是一个虚拟目录，是**容器内目录**和**宿主机目录**之间的映射桥梁
>
> 这些数据卷会被创建一个固定目录`/var/lib/docker/volumes`目录下，创建好数据卷数据在`_data`目录下。

| 序号 | 命令                  | 说明                 |
| ---- | --------------------- | -------------------- |
| 1    | docker volume create  | 创建数据卷           |
| 2    | docker volume ls      | 查看所有数据卷       |
| 3    | docker volume rm      | 删除指定数据卷       |
| 4    | docker volume inspect | 查看某个数据卷的详情 |
| 5    | docker volume prune   | 删除未使用的数据卷   |

> 在执行`docker run`命令时，通过指定 `-v 数据卷:容器内目录`可以完成数据卷挂载。
>
> 当创建容器时，如果挂载了数据卷且数据卷不存在，则会自动创建数据卷。
>
> <font color=red>容器创建好之后就没有办法再挂载数据卷了。</font>

## 1. 挂载数据卷(nginx为例)

1. 创建容器并带上数据卷

```shell
docker run -d --name nginx -p 80:80 -v nginxHtml:/usr/share/nginx/html nginx
```

2. 查看数据卷列表

```shell
docker volume ls
```

3. 查看数据卷详情

```shell
# 后续只需要操作nginxHtml里边的内容就行了。
docker volume inspect nginxHtml
```

## 2. 挂载本地目录(mysql为例)

> 使用`docker inspect mysql`可以看到mysql默认挂载了一个匿名数据卷，数据都存储在这个数据卷中。
>
> 通过 `-v 本地目录:容器内目录`来完成本地目录挂载。**<font color=red>本地目录必须以 `/` 或者`./`开头，否则便会被识别成数据卷</font>**
>
> 实现 mysql数据目录 配置文件， 初始化脚本的挂载
>
> 1. 挂载 `/root/mysql/data` 到 容器 `/var/lib/mysql`
> 2. 挂载 `/root/mysql/init` 到 容器 `/docker-entrypoint-initdb.d`
> 3. 挂载`/root/mysql/conf` 到 容器 `/etc/mysql/conf.d`

1. 挂载到指定目录

```shell
docker run -d \
--name mysql \
-p 3306:3306 \
-e TZ=Asia/ShangHai \
-e MYSQL_ROOT_PASSWORD=dream \
-v /root/mysql/data:/var/lib/mysql \
-v /root/mysql/init:/docker-entrypoint-initdb.d \
-v /root/mysql/conf:/etc/mysql/conf.d \
mysql
```

**<font color=red>将数据挂载到本地目录之后，即便是当前的mysql意外挂掉或者被删除了，使用上边的命令创建好容器，数据依旧不会丢失。</font>**

# 4. 自定义镜像

> 镜像就是包含了应用程序，运行环境，运行配置的文件包，构建镜像的过程就是把上述文件打包的过程。
>
> 镜像运行的时候有一个**<font color=red>入口(entrypoint)</font>**,一般是程序的启动脚本和参数
>
> 添加安装包，依赖，配置等，每一次操作都会形成新的一<font color=red>**层(Layer)**</font>, 
>
> 分层的好处在于如果有<font color=red>**基础镜像(BaseImage)**</font>存在，在拉取新的镜像的时候就不需要重复下载了。

**Dockfile介绍**

> Dockfile就是一个文本文件，其中包含了一个个的**指令(instruction)**,用来说明执行什么操作来构建镜像，将来Docker可以根据Dockerfile来构建镜像.

[官方文档地址](https://docs.docker.com/engine/reference/builder)

| 指令                                                         | 描述                                     | 示例                                      |
| ------------------------------------------------------------ | ---------------------------------------- | ----------------------------------------- |
| [ADD](https://docs.docker.com/reference/dockerfile/#add)     | 添加本地或远程文件和目录。               |                                           |
| [ARG](https://docs.docker.com/reference/dockerfile/#arg)     | 使用构建时变量。                         |                                           |
| [CMD](https://docs.docker.com/reference/dockerfile/#cmd)     | 指定默认命令                             |                                           |
| [COPY](https://docs.docker.com/reference/dockerfile/#copy)   | 拷贝本地文件到镜像的指定目录             | COPY ./redis.tar.gz /tmp                  |
| [ENTRYPOINT](https://docs.docker.com/reference/dockerfile/#entrypoint) | 镜像的启动命令，容器运行时调用           | ENTRYPOINT [“java”, “-jar”, “server.jar”] |
| [ENV](https://docs.docker.com/reference/dockerfile/#env)     | 设置环境变量，可在后面指令使用           | ENV key value                             |
| [EXPOSE](https://docs.docker.com/reference/dockerfile/#expose) | 指定容器运行监听的端口，给镜像使用者看的 | EXPOSE 1024                               |
| [FROM](https://docs.docker.com/reference/dockerfile/#from)   | 指定基础镜像                             | FORM centos:6                             |
| [HEALTHCHECK](https://docs.docker.com/reference/dockerfile/#healthcheck) | 检查容器健康状态                         |                                           |
| [LABEL](https://docs.docker.com/reference/dockerfile/#label) | 添加镜像元数据                           |                                           |
| [MAINTAINER](https://docs.docker.com/reference/dockerfile/#maintainer-deprecated) | 指定镜像作者                             |                                           |
| [ONBUILD](https://docs.docker.com/reference/dockerfile/#onbuild) | 指定镜像构建的使用说明                   |                                           |
| [RUN](https://docs.docker.com/reference/dockerfile/#run)     | 执行构建命令                             |                                           |
| [SHELL](https://docs.docker.com/reference/dockerfile/#shell) | 设置镜像默认的shell                      |                                           |
| [STOPSIGNAL](https://docs.docker.com/reference/dockerfile/#stopsignal) | 指定退容器的信号                         |                                           |
| [USER](https://docs.docker.com/reference/dockerfile/#user)   | 设置用户和组id                           |                                           |
| [VOLUME](https://docs.docker.com/reference/dockerfile/#volume) | 创建数据卷                               |                                           |
| [WORKDIR](https://docs.docker.com/reference/dockerfile/#workdir) | 切换工作目录                             |                                           |

1. 尝试编写Dockerfile

> 这么写从最基础的操作系统镜像出发，到安装jdk执行jar结束，有些许繁琐。可以尝试简化。

```dockerfile
# 指定基础镜像
FROM ubuntu:16.04
# 配置环境变量， JDK的安装目录，容器内时区
ENV JAVA_DIR=/usr/local
# 拷贝jdk和jar包
COPY ./jdk.tar.gz $JAVA_DIR/
COPY ./server.jar /tmp/server.jar
# 安装jdk
RUN cd $JAVA_DIR \ && tar -zxvf ./jdk.tar.gz \ && mv ./jdk1.8.0_144 ./java8
# 配置环境变量
ENV JAVA_HOME=$JAVA_DIR/java8
ENV PATH=$PATH:$JAVA_HOME/bin
#入口
ENTRYPOINT ["java", "jar", "/server.jar"]
```

2. 简化dockerfile

```dockerfile
# 基础镜像
FROM openjdk:11.0-jre-buster
# 拷贝jar包
COPY server.jar /tmp/server.jar
# 入口
ENTRYPOINT ["java", "jar", "/server.jar"]
```

编写好Dockerfile之后就可以构建镜像，命令如下

```shell
# -t 给镜像起名字 格式 repository:tag
# 如果不指定tag，默认为 latest
# 最后这个 . 用来指定Dockerfile的目录
docker build -t serverImage:1.0 .
```

# 5. Docker网络

> 默认情况下， 所有的容器都是以 bridge桥接方式连接到Docker的虚拟网桥上的。
>
> docker0 172.17.0.1/16 表示前16位是不动的。
>
> 每个容器都会被自动分配一个ip，依次递增。使用`docker inspect {containerName}`查看
>
> 如果固定了某个容器的ip来访问该服务的话，如果该服务被结束或者重启，ip地址就会发生变化。
>
> 所以需要自定义网络。

**自定义网桥**

> 加入自定义网络的容器可以通过容器名来相互访问，具体命令如下

| 命令                      | 说明                       |
| ------------------------- | -------------------------- |
| docker network create     | 创建一个网络               |
| docker network ls         | 查看所有网络               |
| docker network rm         | 删除指定网络               |
| docker network prune      | 清楚未使用的网络           |
| docker netwoek connect    | 使指定容器连接加入某个网络 |
| docker netwoek disconnect | 使指定容器离开某网络       |
| docker network inspect    | 查看网络详细信息           |

1. 创建网络

```shell
docker network create xechat
```

2. 查看

```shell
docker network ls
```

3. 让mysql连接到新的网桥

```shell
docker network connect xechat mysql
```

4. 创建容器的时候直接连接新的网桥

```shell
docker run -d --name mysql -p 3306:3305 --network xechat  mysql
```

# 6. 前后端部署

## 1. 后端部署

> 这个需要区分不同环境使用不同的ip地址， 如果使用docker部署的话据需要填写容器的名字所以配置文件需要稍微改造一下

- application.yml

```yaml
spring:
  datasource:
	  url: jdbc:mysql://${db.mysql.host}:3306/test?serverTimezone=UTC
	  driver-class-name: com.mysql.cj.jdbc.Driver
	  username: root
	  passowrd: ${db.mysql.pwd}
```

- application-test.yml

```yaml
db:
  mysql:
    host: 127.0.0.1
    pwd: dream
```

- application-prod.yml

```yaml
db:
  mysql:
    #指定容器的名字 mysql
	host: mysql
	pwd: dream
```

## 2. 前端部署

> 使用容器名来替换nginx.conf里边代理的后端ip地址

1. 挂载html目录

```shell
docker run -d \
    --name nginx \
    -p 80:80 \
    -p 443:443 \
    -v /root/nginx/html:/usr/share/html \
    -v /root/nginx/nginx.conf:/etc/nginx/nginx/conf \
    -v /root/nginx/cert:/etc/nginx/cert \
    --netwaork xechat \
    nginx 
```

## 3. Docker compose

> Docker Compose通过一个单独的docker-compose.yml模板文件(YAML格式)来定义一组相关联的应用容器，帮助我们实现多个相互关联的Docker容器的快速部署。

```yaml
version: "3.8"
services: 
  # 指定容器id
  mysql:
    # 指定镜像名
    image: mysql
    # 容器名称
    container_name: mysql
    # 端口
    ports:
      - "3306:3306"
    # 环境变量
    environment:
      TZ: Asia/Shanghai  
      MYSQL_ROOT_PASSWORD: dream
    # 数据卷
    volumes:
      - "/root/mysql/conf:/etc/mysql/conf.d"
      - "/root/mysql/data:/var/lib/mysql"
      - "/root/mysql/init:/docker-entrypoint-initdb.d"
    # 网络
    networks:
      - xechat
  # 指定xechat容器
  xechat:
    # 不指定镜像，自动打包镜像
    build:
      context: /opt/code/dockerTest
      dockerfile: Dockerfile
    container_name: xechat
    ports:
      - "1024:1024"
      - "1025:1025"
    networks:
      - xechat
    # 依赖mysql容器  
    depends_on:
      - mysql
  # 创建nginx容器
  nginx:
    image: nginx
    container_name: nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/root/nginx/nginx.conf:/etc/nginx/nginx.conf" 
      - "/root/nginx/html:/usr/share/nginx/html"
      - "/root/nginx/cert:/usr/share/nginx/cert"
    depends_on:
      - xechat
    networks:
      - xechat
# 创建虚拟网桥
networks:
  xechat:
    name: xechat
```

> 使用Docker compose一键部署

| 类型     | 指令参数 | 描述                        |
| -------- | -------- | --------------------------- |
| Options  | -f       | 指定compose文件的路径和名称 |
|          | -p       | 指定project名称             |
| Commands | up       | 创建并启动所有的service容器 |
|          | down     | 停止并一处所有的容器和网络  |
|          | ps       | 列出所有启动的容器          |
|          | logs     | 查看指定容器的日志          |
|          | stop     | 停止容器                    |
|          | start    | 启动容器                    |
|          | restart  | 重启容器                    |
|          | top      | 查看运行的进程              |
|          | exec     | 在指定运行的容器中执行命令  |

**启动docker compose**

```shell
docker compose up -d
```

