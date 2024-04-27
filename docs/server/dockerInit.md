# 1. 安装Docker

1. 检查centos版本
```shell
# centos 低于3.X版本会安装失败
uname -r
```
2. 下载以前安装的docker
```shell
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine

```
3. 安装yum源
```shell
yum install -y yum-utils
```
4. 设置国内的阿里云景象
```shell
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```
5. 更新yum源索引
```shell
yum makecache fast
```
6. 安装最新的docker
```shell
sudo yum install -y docker-ce docker-ce-cli containerd.io
```
7. 验证docker版本
```shell
docker version

Client: Docker Engine - Community
 Version:           26.1.0
 API version:       1.45
 Go version:        go1.21.9
 Git commit:        9714adc
 Built:             Mon Apr 22 17:09:57 2024
 OS/Arch:           linux/amd64
 Context:           default
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?

```
8. 查看docker信息
```docker
docker info
```
9. 启动docker并设置为自启动
```shell
systemctl start docker
# 设为开机自启动
systemctl enable docker

```

# 2. 设置docker加速

1. 添加[阿里云加速链接](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)
2. 执行下列命令创建`deamon.josn`
```shell
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://<YOUR_ID>.mirror.aliyuncs.com"],
  "dns":["8.8.8.8", "8.8.4.4", "114.114.114.114"]
}
EOF
```
3. 加载docker-deamon
```shell
sudo systemctl daemon-reload
```
4. 重启docker
```shell
sudo systemctl restart docker
```
5. 配置Docker-compose
```shell
# 官方文档地址 https://docs.docker.com/compose/install/#compose-install

# 下载docker-compose
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose 

chmod +x /usr/local/bin/docker-compose
# 查看安装好的版本
docker-compose --version

```

# 3. 安装软件及使用教程

## 1. 基本使用
```shell
# 查询软件
docker search mysql
# 安装
docker pull mysql
# 查询镜像
docker images
# 查看运行的镜像
docker ps
# 打开dokcer内部的命令行
docker exec -it image_name bash
```

## 2. 安装jdk
```shell
#安装openjdk11
docker pull openjdk:11-jdk
# 运行jdk
docker run -d it --name openjdk11 openjdk:11-jdk
```


## 3. 安装mysql
```shell
# 安装指定版本
docker pull mysql:5.7
# 不指定版本就是最新版的
docker pull mysql
# 映射linux与docker的端口
docker run -p 3306:3306 --name mysql8 -e MYSQL_ROOT_PASSWORD=dream -d mysql
# 在docker内部使用mysql命令行
docker exec -it mysql8 bash
# 登录mysql 
mysql -u root -p 
```
