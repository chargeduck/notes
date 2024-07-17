:::info

折腾了半上午在windows下使用kraft的方式搭建kafka集群，最终还是失败了。

直接该用vmware下的centos7

参考文档

1. [centos离线安装kafka集群安装(Kraft模式)](https://blog.csdn.net/ql_7256/article/details/131530446)

:::

# 1. 下载安装

1. [下载地址](https://downloads.apache.org/kafka/3.7.0/kafka_2.13-3.7.0.tgz)
2. 确保三台机器都安装好了jdk
3. 上传到centos,用`xshell`和`xftp`更方便

```shell
# 上传文件到第一台服务器
scp kafka_2.13-3.7.0.tgz root@192.168.242.130:/opt/software
# 解压缩
tar -zxvf kafka_2.13-3.7.0
#同样的操作在131 132服务器上都执行一遍
```

# 2. 修改配置文件

1. OS1

```shell
cd kafka_2.13-3.7.0/config/kraft
vim server.properties
```

```properties
controller.quorum.voters=1@192.168.242.130:9093,2@192.168.242.131:9093,3@192.168.242.132:9093
listeners=PLAINTEXT://192.168.242.130:9092,CONTROLLER://192.168.242.130:9093
advertised.listeners=PLAINTEXT://192.168.242.130:9092
log.dirs=/opt/software/kafka_2.13-3.7.0/data/log
```

2. OS2

```shell
vim kafka_2.13-3.7.0/config/kraft/server.properties 
```

```properties
node.id=2
controller.quorum.voters=1@192.168.242.130:9093,2@192.168.242.131:9093,3@192.168.242.132:9093
listeners=PLAINTEXT://192.168.242.131:9092,CONTROLLER://192.168.242.131:9093
advertised.listeners=PLAINTEXT://192.168.242.131:9092
log.dirs=/opt/software/kafka_2.13-3.7.0/data/log
```

3. OS3

```shell
vim kafka_2.13-3.7.0/config/kraft/server.properties 
```

```properties
node.id=3
controller.quorum.voters=1@192.168.242.130:9093,2@192.168.242.131:9093,3@192.168.242.132:9093
listeners=PLAINTEXT://192.168.242.132:9092,CONTROLLER://192.168.242.132:9093
advertised.listeners=PLAINTEXT://192.168.242.132:9092
log.dirs=/opt/software/kafka_2.13-3.7.0/data/log
```

# 3. 配置集群id

1. 在os1下执行生成uuid的命令

```shell
cd /opt/software/kafka_2.13-3.7.0
# 生成集群id
./bin/kafka-storage.sh random-uuid
#记住这个id等一会需要使用
Xlpamcu1SemGxstTUJF98g
```

2.  在三台服务器下分别执行命令，注意这列的uuid需要换成自己的

```shell
./bin/kafka-storage.sh format -t Xlpamcu1SemGxstTUJF98g -c ./config/kraft/server.properties
```

# 4. 启动

1. 开放三台服务器的`9092`、 `9093`端口

```shell
# 开放10911端口
firewall-cmd --zone=public --add-port=9092/tcp --permanent
firewall-cmd --zone=public --add-port=9093/tcp --permanent
# 查看有哪些端口开放
firewall-cmd --zone=public --list-ports
systemctl restart firewalld
```

2. 启动命令

```shell
nohup ./bin/kafka-server-start.sh ./config/kraft/server.properties > nohup.log &
```

3. 使用offsetExplorer.exe连接`192.168.242.130:9092`即可

# 5. UI

1. 使用[offsetExplorer]()
2. 使用[Kraft-UI](https://github.com/provectus/kafka-ui/releases/download/v0.7.2/kafka-ui-api-v0.7.2.jar)