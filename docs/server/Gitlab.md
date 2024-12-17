:::tip
这个是看Jenkins的时候附带的gitlab教程，反正是没有自己安装过，看看也没啥影响，[教程地址](https://www.bilibili.com/video/BV1bS4y1471A?spm_id_from=333.788.player.switch&vd_source=d9d3eb78433e98d94cd75ddf5ac0382b&p=5)

GitLab需要启动的服务比较多，建议<font color=red>最少需要配置6GB内存。</font>
:::
> [官网网址](https://about.gitlab.com),或者访问国内的[极狐gitlab](https://gitlab.cn).
> 官方的[安装文档地址](https://gitlab.cn/install/?version=ce)

# 1. sh方式安装
## 1. 安装依赖

```shell
yum install -y curl policycoreutils-pyythod openssh-server perl
sudo systemctl enable sshd
sudo systemctl start sshd
```

## 2. 配置镜像

```shell
curl -fssL https://packages.gitlab.cn/repository/raw/scripts/setup.sh | /bin/bash
```

## 3. 安装

> 不指定自定义密码的划，会在`/etc/gitlab/initial_root_password`随机生成一个，**<font color=red>该文件会在24小时后删除</font>**，因此建议安装完成后立即修改密码。

```shell
sudo EXTERNAL_URL="http://192.168.159.134" yum install -y gitlab-jh
```

## 4. 常用命令

| 序号 | 命令                      | 描述                 |
| ---- | ------------------------- | -------------------- |
| 1    | gitlab-ctl start          | 启动所有的gitlab组件 |
| 2    | gitlab-ctl stop           | 停止                 |
| 3    | gitlab-ctl restart        | 重启                 |
| 4    | gitlab-ctl status         | 查看状态             |
| 5    | gitlab-ctl reconfigure    | 启动拂去             |
| 6    | gitlab-ctl tail           | 查看日志             |
| 7    | vim /etc/gitlab/gitlab.rb | 修改配置文件         |
# 2. Docker安装

## 1. 安装Docker
> [参考链接](/server/docker)

```shell
# 更新yum
sudo yum update
# 安装依赖 
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
# 配置阿里云镜像
yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
# 查看可用的版本
list docker-ce --showduplicates | sort -r
# 安装
yum install -y docker
# 配置开机启动
systemctl start docker
systemctl enable docker
docker -v
```
## 2. 安装
```shell
# 设置环境变量
export GITLAB_HOME=/srv/gitlab

sudo docker run --detach \
  --hostname 192.168.159.137 \
  --publish 443:443 --publish 80:80 \
  --name gitlab \
  --restart always \
  --volume $GITLAB_HOME/config:/etc/gitlab \
  --volume $GITLAB_HOME/logs:/var/log/gitlab \
  --volume $GITLAB_HOME/data:/var/opt/gitlab \
  --shm-size 256m \
  registry.gitlab.cn/omnibus/gitlab-jh:latest
```

### 1. 权限错误
> Preparing services...
Starting services...
/opt/gitlab/embedded/bin/runsvdir-start: line 24: ulimit: pending signals: cannot modify limit: Operation not permitted
/opt/gitlab/embedded/bin/runsvdir-start: line 37: /proc/sys/fs/file-max: Read-only file system
Configuring GitLab package...
Configuring GitLab...

================================================================================
Error executing action `run` on resource 'ruby_block[directory resource: /var/opt/gitlab/git-data/repositories]'
================================================================================

```shell
sudo chmod 2770 /srv/gitlab/data/git-data/repositories
```
