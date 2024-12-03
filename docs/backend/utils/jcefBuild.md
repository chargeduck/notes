# 1. 参考链接

1. [Windows11环境下编译JCEF添加H264支持](https://www.cnblogs.com/ysdyoOo/articles/17896451.html)
2. [官方文档]([chromiumEmbedded / java-cef / wiki / BranchesAndBuilding — Bitbucket](https://bitbucket.org/chromiumembedded/java-cef/wiki/BranchesAndBuilding#markdown-header-building-from-source))
3. [下载 CMake 3.19](https://cmake.org/download/)
4. [记录VS2022自编译JCEF，解决MP4播放问题](https://blog.csdn.net/weixin_40035328/article/details/132362354?spm=1001.2014.3001.5501)

**支持H264的CEF资源包，来源1号参考链接**

[cef_binary_116.0.27+gd8c85ac+chromium-116.0.5845.190_windows64](https://pan.xunlei.com/s/VNlT6LQXuhj8Rxw2JVuivl7BA1#) ，提取码：k3ab

[cef_binary_117.2.5+gda4c36a+chromium-117.0.5938.152_windows64](https://pan.xunlei.com/s/VNlW1Nbj6Mv7qvqPpIgm4YIsA1#) ，提取码：cdc8

[cef_binary_118.7.1+g99817d2+chromium-118.0.5993.119_windows64](https://pan.xunlei.com/s/VNlaB9paRgzDwG3s1r0qO11KA1#) ，提取码：beeg

[cef_binary_119.4.7+g55e15c8+chromium-119.0.6045.199_windows64](https://pan.xunlei.com/s/VNlcckTzMlICR0WHuBPqsGdhA1#)，提取码：8cy5

[cef_binary_120.1.8+ge6b45b0+chromium-120.0.6099.109_windows64](https://pan.xunlei.com/s/VNrFzzyoVz1Cv0SC0ieRdVIpA1#)，提取码：qujx

[cef_binary_121.3.15+g4d3b0b4+chromium-121.0.6167.184_windows64](https://pan.xunlei.com/s/VNuOq4VcK_Mmf9qYF2GyTCbwA1#)，提取码：396n

[cef_binary_122.1.13+gde5b724+chromium-122.0.6261.130_windows64](https://pan.xunlei.com/s/VNuTH6hcrQt39cK9Lxb64VUsA1#)，提取码：92q2

# 2. 编译

> Windows下安装Visual Studio太费劲了，我用的Centos打包的，需要一下环境
>
> - JDK 7-14
> - python 2.6+
> - cmake 3.19+
> - gcc-c++

1. 安装依赖

```shell
yum install -y git
yum install -y gcc-c++
```

2. 下载源码

```shell
cd /opt
git clone https://bitbucket.org/chromiumembedded/java-cef.git
# 创建jcef_build目录
cd java-cef
mkdir jcef_build
cd jcef_build
```

3. 下载cmake

```shell
cd /opt/spftware
wget https://github.com/Kitware/CMake/releases/download/v3.31.0/cmake-3.31.0-linux-x86_64.tar.gz
tar -zxvf cmake-3.31.0-linux-x86_64.tar.gz
```

4. 执行构建命令

```shell
# 这个需要找c++的环境, 指定gcc-c++的路径
export CXX=/usr/bin/g++
cd /opt/java-cef/jcef_build
# 因为我本地的cmake是2.8.12 所以只能用这个了
 /opt/software/cmake-3.31.0-linux-x86_64/bin/cmake -G "Unix Makefiles" -DCMAKE_BUILD_TYPE=Release ..
```

5. 打完包按照参考链接4后续步骤操作就行了

