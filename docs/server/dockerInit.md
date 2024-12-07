:::tip

通过一条命令，来实现服务器代码更新，打包，构建镜像和发布流程。需要有一定的`shell`基础

[docker笔记](/server/docker)

:::

# 1. 原理

1. 首先需要知道当前的操作系统是`ubuntu`还是`centos`，以便使用不同的包管理工具`apt`还是`yum`
2. 判断当前系统是否安装了docker，没有的话自动安装并且设置加速器
3. 安装 jdk git maven 等工具
4. 判断指定目录有没有对应的代码目录，没有的话则执行`git clone`有则`git pull`
5. 执行 `mvn clean package -Dmaven.test.skip=true`打包
6. 编写`Dockerfile`文件
7. 编写`docker-compose.yml`
8. 整合`shell`发布gitlab

> 使用下边的命令即可一键部署一个redis和一个xechat-server服务

```shell
wget https://raw.gitcode.com/qq_42059717/xechat-server/raw/main/autoInstaller.sh && chmod +x autoInstaller.sh && ./autoInstaller.sh
```



# 2. 实现

## 1. Shell脚本编写

### 1. 判断当前操作系统

```shell
#!/bin/bash

# 判断当前系统是Ubuntu还是CentOS
if [ -f /etc/os-release ]; then
   . /etc/os-release
    if [ "$ID" == "ubuntu" ]; then
        PACKAGE_MANAGER="apt"
    elif [ "$ID" == "centos" ]; then
        PACKAGE_MANAGER="yum"
    else
        echo "不支持的操作系统类型"
        exit 1
    fi
    echo "当前使用包管理工具为 $PACKAGE_MANAGER"
else
    echo "/etc/os-release文件不存在，无法判断操作系统类型"
    exit 1
fi
```

### 2. 判断是否已经安装了docker

```shell
# 判断Docker是否已安装
if command -v docker >/dev/null 2>&1; then
    echo "Docker已经安装，无需重复安装"
else
    echo "Docker未安装，开始安装..."
    if [ "$PACKAGE_MANAGER" == "apt" ]; then
        sudo $PACKAGE_MANAGER update
        sudo $PACKAGE_MANAGER install -y curl
        # 设置阿里云源
        curl -fsSL http://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
        # 添加docker软件源
        sudo add-apt-repository "deb [arch=amd64] http://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
        # 安装
        apt-get install docker-ce docker-ce-cli containerd.io
        sudo $PACKAGE_MANAGER install -y docker.io
    elif [ "$PACKAGE_MANAGER" == "yum" ] ; then
        sudo $PACKAGE_MANAGER install -y yum-utils
        sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
        sudo $PACKAGE_MANAGER install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    fi
    echo "Docker安装完成"
    
fi
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
docker -v
```

### 3. 安装工具

```shell
# 判断是否安装了JDK以及版本情况
if command -v java >/dev/null 2>&1; then
    JDK_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | awk -F '.' '{print $1}')
    if [ "$JDK_VERSION" -gt 11 ]; then
        echo "当前安装的JDK版本大于11，准备卸载并安装OpenJDK 11..."
        if [ "$PACKAGE_MANAGER" == "apt" ]; then
            sudo $PACKAGE_MANAGER remove -y --purge $(dpkg -l | grep -i jdk | awk '{print $2}')
        elif [ "$PACKAGE_MANAGER" == "yum" ]; then
            sudo $PACKAGE_MANAGER remove -y $(rpm -qa | grep -i jdk | grep -i java)
        fi
        # 安装OpenJDK 11
        if [ "$PACKAGE_MANAGER" == "apt" ]; then
            sudo $PACKAGE_MANAGER update
            sudo $PACKAGE_MANAGER install -y openjdk-11-jdk
        elif [ "$PACKAGE_MANAGER" == "yum" ]; then
            sudo $PACKAGE_MANAGER install -y java-11-openjdk-devel
        fi
        echo "OpenJDK 11安装完成"
    elif [ "$JDK_VERSION" -lt 8 ]; then
        echo "当前安装的JDK版本低于8，准备卸载并安装OpenJDK 11..."
        if [ "$PACKAGE_MANAGER" == "apt" ]; then
            sudo $PACKAGE_MANAGER remove -y --purge $(dpkg -l | grep -i jdk | awk '{print $2}')
        elif [ "$PACKAGE_MANAGER" == "yum" ]; then
            sudo $PACKAGE_MANAGER remove -y $(rpm -qa | grep -i jdk | grep -i java)
        fi
        # 安装OpenJDK 11
        if [ "$PACKAGE_MANAGER" == "apt" ]; then
            sudo $PACKAGE_MANAGER update
            sudo $PACKAGE_MANAGER install -y openjdk-11-jdk
        elif [ "$PACKAGE_MANAGER" == "yum" ]; then
            sudo $PACKAGE_MANAGER install -y java-11-openjdk-devel
        fi
        echo "OpenJDK 11安装完成"
    else
        echo "已安装的JDK版本在8 - 11之间，无需重新安装OpenJDK 11"
    fi
else
    echo "未安装JDK，开始安装OpenJDK 11..."
    if [ "$PACKAGE_MANAGER" == "apt" ]; then
        sudo $PACKAGE_MANAGER update
        sudo $PACKAGE_MANAGER install -y openjdk-11-jdk
    elif [ "$PACKAGE_MANAGER" == "yum" ]; then
        sudo $PACKAGE_MANAGER install -y java-11-openjdk-devel
    fi
    echo "OpenJDK 11安装完成"
fi
sudo $PACKAGE_MANAGER install -y maven git
```

### 4. 实现自动拉取代码和打包功能

```shell
git_path="https://gitee.com/xxx/xxxx.git"
#项目名称
projectName="xechat-magic"
# 获取源代码
mkdir -p /opt/code
cd /opt/code
pwd
if [ ! -d $projectName ]; then
    # 拉取代码切换分支
    git clone $git_path
    cd /opt/code/$projectName
    git checkout -b pina_dev origin/pina_dev
else
    cd /opt/code/$projectName
    git checkout -b pina_dev origin/pina_dev
    git pull origin
fi
git branch

#打包
cd /opt/code/$projectName/xechat-commons
mvn clean install -Dmaven.test.skip=true
echo 'xechat-commons install success!'
cd /opt/code/$projectName/xechat-server
mvn clean install -Dmaven.test.skip=true
echo 'xechat-server package success!'
```

### 5. 复制打包产物并启动docker compose

```shell
# 开始打包镜像
echo 'starting docker build process'
xeServer=/opt/xeServer
mkdir -p $xeServer
# 复制违禁词和ip
cp -r /opt/code/$projectName/xechat-server/src/main/resources/db $xeServer
# 复制jar包
cp /opt/code/$projectName/xechat-server/target/xechat-server.jar $xeServer
# 复制Dockerfile
cp /opt/code/$projectName/shell/docker/Dockerfile $xeServer
cp /opt/code/$projectName/shell/docker/xechatRunner.sh $xeServer

cd /opt/code/$projectName/shell/docker
pwd
docker compose up -d
```

### 6. 完整的shell

```shell
#!/bin/bash

# 判断当前系统是Ubuntu还是CentOS
if [ -f /etc/os-release ]; then
   . /etc/os-release
    if [ "$ID" == "ubuntu" ]; then
        PACKAGE_MANAGER="apt"
    elif [ "$ID" == "centos" ]; then
        PACKAGE_MANAGER="yum"
    else
        echo "不支持的操作系统类型"
        exit 1
    fi
    echo "当前使用包管理工具为 $PACKAGE_MANAGER"
else
    echo "/etc/os-release文件不存在，无法判断操作系统类型"
    exit 1
fi

# 判断Docker是否已安装
if command -v docker >/dev/null 2>&1; then
    echo "Docker已经安装，无需重复安装"
else
    echo "Docker未安装，开始安装..."
    if [ "$PACKAGE_MANAGER" == "apt" ]; then
        sudo $PACKAGE_MANAGER update
        sudo $PACKAGE_MANAGER install -y curl
        # 设置阿里云源
        curl -fsSL http://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
        # 添加docker软件源
        sudo add-apt-repository "deb [arch=amd64] http://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
        # 安装
        apt-get install docker-ce docker-ce-cli containerd.io
        sudo $PACKAGE_MANAGER install -y docker.io
    elif [ "$PACKAGE_MANAGER" == "yum" ] ; then
        sudo $PACKAGE_MANAGER install -y yum-utils
        sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
        sudo $PACKAGE_MANAGER install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    fi
    echo "Docker安装完成"

fi
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
docker -v

# 判断是否安装了JDK以及版本情况
if command -v java >/dev/null 2>&1; then
    JDK_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | awk -F '.' '{print $1}')
    if [ "$JDK_VERSION" -gt 11 ]; then
        echo "当前安装的JDK版本大于11，准备卸载并安装OpenJDK 11..."
        if [ "$PACKAGE_MANAGER" == "apt" ]; then
            sudo $PACKAGE_MANAGER remove -y --purge $(dpkg -l | grep -i jdk | awk '{print $2}')
        elif [ "$PACKAGE_MANAGER" == "yum" ]; then
            sudo $PACKAGE_MANAGER remove -y $(rpm -qa | grep -i jdk | grep -i java)
        fi
        # 安装OpenJDK 11
        if [ "$PACKAGE_MANAGER" == "apt" ]; then
            sudo $PACKAGE_MANAGER update
            sudo $PACKAGE_MANAGER install -y openjdk-11-jdk
        elif [ "$PACKAGE_MANAGER" == "yum" ]; then
            sudo $PACKAGE_MANAGER install -y java-11-openjdk-devel
        fi
        echo "OpenJDK 11安装完成"
    elif [ "$JDK_VERSION" -lt 8 ]; then
        echo "当前安装的JDK版本低于8，准备卸载并安装OpenJDK 11..."
        if [ "$PACKAGE_MANAGER" == "apt" ]; then
            sudo $PACKAGE_MANAGER remove -y --purge $(dpkg -l | grep -i jdk | awk '{print $2}')
        elif [ "$PACKAGE_MANAGER" == "yum" ]; then
            sudo $PACKAGE_MANAGER remove -y $(rpm -qa | grep -i jdk | grep -i java)
        fi
        # 安装OpenJDK 11
        if [ "$PACKAGE_MANAGER" == "apt" ]; then
            sudo $PACKAGE_MANAGER update
            sudo $PACKAGE_MANAGER install -y openjdk-11-jdk
        elif [ "$PACKAGE_MANAGER" == "yum" ]; then
            sudo $PACKAGE_MANAGER install -y java-11-openjdk-devel
        fi
        echo "OpenJDK 11安装完成"
    else
        echo "已安装的JDK版本在8 - 11之间，无需重新安装OpenJDK 11"
    fi
else
    echo "未安装JDK，开始安装OpenJDK 11..."
    if [ "$PACKAGE_MANAGER" == "apt" ]; then
        sudo $PACKAGE_MANAGER update
        sudo $PACKAGE_MANAGER install -y openjdk-11-jdk
    elif [ "$PACKAGE_MANAGER" == "yum" ]; then
        sudo $PACKAGE_MANAGER install -y java-11-openjdk-devel
    fi
    echo "OpenJDK 11安装完成"
fi
sudo $PACKAGE_MANAGER install -y maven git

git_path="https://gitee.com/username/repo.git"
#项目名称
projectName="xechat-magic"
# 获取源代码
mkdir -p /opt/code
cd /opt/code
pwd
if [ ! -d $projectName ]; then
    # 拉取代码切换分支
    git clone $git_path
    cd /opt/code/$projectName
    git checkout -b pina_dev origin/pina_dev
else
    cd /opt/code/$projectName
    git checkout -b pina_dev origin/pina_dev
    git pull origin
fi
git branch

#打包
cd /opt/code/$projectName/xechat-commons
mvn clean install -Dmaven.test.skip=true
echo 'xechat-commons install success!'
cd /opt/code/$projectName/xechat-server
mvn clean install -Dmaven.test.skip=true
echo 'xechat-server package success!'

# 开始打包镜像
echo 'starting docker build process'
xeServer=/opt/xeServer
mkdir -p $xeServer
# 复制违禁词和ip
cp -r /opt/code/$projectName/xechat-server/src/main/resources/db $xeServer
# 复制jar包
cp /opt/code/$projectName/xechat-server/target/xechat-server.jar $xeServer
# 复制Dockerfile
cp /opt/code/$projectName/shell/docker/Dockerfile $xeServer
cp /opt/code/$projectName/shell/docker/xechatRunner.sh $xeServer

cd /opt/code/$projectName/shell/docker
pwd
docker compose up -d
```

## 2. Dockefile

> 指定jar包所需要的环境配置

```dockerfile
# 基础镜像 jdk11
FROM openjdk:11.0-jre-buster
# 复制jar包
COPY xechat-server.jar /home/xechat-server.jar
# 暴露 1024 1025端口
EXPOSE 1024
EXPOSE 1025
# 切换工作目录
WORKDIR /home
# 程序入口
ENTRYPOINT ["java", "-jar", "xechat-server.jar"]
```

## 3. docker-compose

> 就创建一个`docker-compose.yml`就好了

```yaml
# 版本，现在好像过时了
version: "1.0"
# 服务
services:
  # 容器  
  xechat-server:
    #不指定镜像名称，从Dockerfile构建
    build:
      # dockerfile的目录
      context: /opt/xeServer
      dockerfile: Dockerfile
    # 容器名称  
    container_name: xechat-server
    # 数据卷
    volumes:
      - /opt/xeServer/db:/home/xechat/db
      - /home/xechat/upload:/home/xechat/upload
    # 暴露端口   
    ports:
      - "1024:1024"
      - "1025:1025"
    # 虚拟网络
    networks:
      - xechat
    restart: always
    # 依赖xechat_redis
    depends_on:
      - xechat-redis
  xechat-redis:
    image: redis
    container_name: xechat-redis
    # 给redis添加密码
    command: redis-server --requirepass rightWING.-/+
    environment:
      - TZ=Asia/Shanghai
      - REDIS_PASSWORD=rightWING.-/+
    ports:
      - "6379:6379"
    networks:
      - xechat
    restart: always
# 创建虚拟网络 xechat    
networks:
  xechat:
    name: xechat
```

