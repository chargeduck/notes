# 1. 概述

> [当前进度 68/157](https://www.bilibili.com/video/BV1py4y1E7oA?p=68)
>
> Netty是一个异步的，基于事件驱动的网络应用框架，用于速开发可维护、高性能的网络服务器和客户端。

## 1. 实现客户端

> 首先需要添加maven依赖
>
> ```xml
> <dependency>
>  <groupId>io.netty</groupId>
>  <artifactId>netty-all</artifactId>
>  <version>4.1.96.Final</version>
> </dependency>
> ```
>
> 使用`CountDownLatch`来实现阻塞等待。在服务启动后，主线程会等待，直到`latch`的计数器减为 0。这样可以确保服务有足够的时间运行并接受连接。
>
> <font color=red>如果用的是 main 方法 就不用这么操作了。</font>

> 
>
> - 把 `channel` 理解为数据的通道
> - 把 `msg` 理解为流动的数据，最开始输入是 `ByteBuf`，但经过 `pipeline(流水线)` 的加工，会变成其它类型对象，最后输出又变成 `ByteBuf`
> - 把 `handler` 理解为数据的处理工序
>
>   - 工席有多道，合在一起就是` pipeline`，`pipeline` 负责发布事件(读、读取完成..)传播`handler`， `handler`对自己感兴趣的事件进行处理(重写了相应事件处理方法)
>
>   - `handler` 分 `Inbound` 和 `Outbound` 两类
> - 把 `eventLoop` 理解为处理数据的工人
>     - 工人可以管理多个 `channel` 的 IO 操作，并且一旦工人负责了某个 `channel`，就要负责到底(绑定)。
>     - 工人既可以执行 IO 操作，也可以进行任务处理，每位工人有任务队列，队列里可以堆放多个channel 的待处理任务，任务分为普通任务、定时任务
>     -  工人按照 pipeline 顺序，依次按照 handler 的规划(代码)处理数据，可以为每道工序指定不同的工人

```java
@Slf4j
public class ServerTest {

    @Test
    public void simpleServerTest() throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(1);
        // 1. 启动器，负责组装netty组件，启动服务
        new ServerBootstrap()
                // 2. 添加事件循环组   BossEventLoop, WorkerEventLoop(selector, thread)
                .group(new NioEventLoopGroup())
                // 3. 选择服务器的ServerSocketChannel的实现类
                .channel(NioServerSocketChannel.class)
                // 4. boss处理链接请求 worker处理读写操作,
                // 4.1 ChannelInitializer 是一个特殊的handler，用于初始化channel 添加别的handler
                .childHandler(new ChannelInitializer<NioSocketChannel>() {
                    @Override
                    protected void initChannel(NioSocketChannel channel) throws Exception {
                        channel.pipeline()
                                // 将 ByteBuf 转换成字符串
                                .addLast(new StringDecoder())
                                // 自定义handler, 处理业务逻辑
                                .addLast(new ChannelInboundHandlerAdapter() {
                                    @Override
                                    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                                        log.debug("channel Read : {}", msg);
                                        super.channelRead(ctx, msg);
                                    }
                                })
                        ;
                    }
                })
                // 5. 绑定端口
                .bind(8080)
                .sync()
        ;
        latch.await();
    }
}
```

## 2. 实现客户端

```java
@Slf4j
public class ClientTest {

    @Test
    public void simpleClientTest() throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(1);
        // 1. 启动器，负责组装netty组件，启动服务
        new Bootstrap()
                // 2. 添加事件循环组   BossEventLoop, WorkerEventLoop(selector, thread)
                .group(new NioEventLoopGroup())
                // 3. 选择服务器的ServerSocketChannel的实现类
                .channel(NioSocketChannel.class)
                // 4. 添加处理器
                .handler(new ChannelInitializer<NioSocketChannel>() {
                    // 5. 在连接建立后被调用
                    @Override
                    protected void initChannel(NioSocketChannel channel) throws Exception {
                        channel.pipeline()
                                .addLast(new StringEncoder());
                    }
                })
                // 6. 连接服务器
                .connect(new InetSocketAddress("localhost", 8080))
                // 7. 阻塞等待连接建立
                .sync()
                // 8. 获取channel
                .channel()
                // 9. 向服务器发送数据
                .writeAndFlush("hello, chat")
        ;
        latch.await();
    }

}
```

# 2. 组件

## 1. EventLoop

### 1. 简介

==事件循环对象==

`EventLoop` 本质是一个单线程执行器(同时维护了一个`Selector`)，里面有 `run` 方法处理 `Channel` 上源源不断的IO 事件。
	它的继承关系比较复杂

- 一条线是继承自`j.u.c.ScheduledExecutorService` 因此包含了线程池中所有的方法。

- 另一条线是继承自 `netty`自己的 `OrderedEventExecutor`
  - 提供了 `boolean inEventLoop(Thread thread)`方法判断一个线程是否属于此 `EventLoop`。
  - 提供了 `parent`方法来看看自己属于哪个 `EventLoopGroup`
  

==时间循环组==

`EventLoopGroup`是一组 `EventLoop`，`Channel` 一股会调用 `EventLoopGroup`的`register` 方法来绑定其中一个`EventLoop`，后续这个 `Channel` 上的 IO 事件都由此 `EventLoop` 来处理(保证了 IO 事件处理时的线程全)

继承自 `netty` 自己的 `EventExecutorGroup`

- 实现了 `lterable` 接口提供遍历 `EventLoop` 的能力
- 另有 `next` 方法获取集合中下一个 `EventLoop `

### 2. 代码示例

```java
@Test
public void eventLoopTest() throws InterruptedException {
    // 1. 创建EventLoopGroup IO事件，普通任务和定时任务
    EventLoopGroup group = new NioEventLoopGroup(2);
    // 默认的是EventLoopGroup
    //EventLoopGroup defaultGroup = new DefaultEventLoopGroup();
    // 2. 获取下一个EventLoop
    System.out.println(group.next());
    System.out.println(group.next());
    System.out.println(group.next());

    // 普通任务
    group.next().submit(() -> log.info("Sub Thread run"));
    // 定时任务 一秒后执行
    group.next().scheduleAtFixedRate(() -> log.info(" Schedule Sub Thread run"), 0, 1, TimeUnit.SECONDS);
    log.info("Main Thread run ");
    CountDownLatch countDownLatch = new CountDownLatch(1);
    countDownLatch.await();
}
```

- 细分时间组，bossGroup只处理accept workerGroup只处理SocketChannel读写，耗时长的channel使用单独的group处理

```java
@Slf4j
public class EventLoopServerTest {
    /**
     * 事件循环组服务端测试
     *
     * 1. 在添加 group 的时候 细分 两个 EventLoopGroup
     *        bossGroup 只负责 Accept
     *        workerGroup 只负责 SocketChannel 的读写
     * 2. 如果有某些操作耗时眼中，可以再细分一个 专门负责耗时操作的 DefaultEventLoop
     *      在last方法指定这个耗时长的group执行， 这样可以避免耗时操作阻塞整个线程组
     *      通过 ctx.fireChannelRead 方法 可以将数据传递给下一个handler处理
     *
     * @param args
     * @throws InterruptedException
     */
    public static void main(String[] args) throws InterruptedException {
        // 1. 创建EventLoopGroup
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        EventLoopGroup slowlyGroup = new DefaultEventLoopGroup();
        new ServerBootstrap()
                // bossGroup只负责Accept , workerGroup(默认CPU核心数*2)只负责SocketChannel的读写
                .group(bossGroup, workerGroup)
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<NioSocketChannel>() {
                    @Override
                    protected void initChannel(NioSocketChannel channel) throws Exception {
                        channel.pipeline()
                                .addLast("WorkerGroup",new ChannelInboundHandlerAdapter() {
                                    @Override
                                    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                                        ByteBuf byteBuf = (ByteBuf) msg;
                                        log.debug("{}",byteBuf.toString(StandardCharsets.UTF_8));
                                        super.channelRead(ctx, msg);
                                        ctx.fireChannelRead(msg);
                                    }
                                })
                                .addLast(slowlyGroup, "SlowlyGroup", new ChannelInboundHandlerAdapter() {
                                    @Override
                                    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                                        log.debug("耗时操作");
                                        ByteBuf byteBuf = (ByteBuf) msg;
                                        log.debug("Slowly Group : {}",byteBuf.toString(StandardCharsets.UTF_8));
                                        super.channelRead(ctx, msg);
                                    }
                                });
                    }
                })
                .bind(1024)
        ;
        //new CountDownLatch(1).await();
    }
}
```

### 3. handler执行过程中切换Worker

> 关键代码 `io.netty.channel.AbstractChannelHandlerContext#invokeChannelRead()`

```java
static void invokeChannelRead(final AbstractChannelHandlerContext next, Object msg) {
    final Object m = next.pipeline.touch(ObjectUtil.checkNotNull(msg, "msg"), next);
    // 下一个handler的事件循环是否与当前事件循环是同一个线程
    EventExecutor executor = next.executor();
    // 是的话直接调用
    if (executor.inEventLoop()) {
        next.invokeChannelRead(m);
    } else {
        // 不是 将要执行的代码作为任务提交给下一个事件循环处理
        executor.execute(new Runnable() {
            public void run() {
                next.invokeChannelRead(m);
            }
        });
    }

}
```

## 2. channel

### 1.  常用方法

| 方法名            | 作用                                                         |
| ----------------- | ------------------------------------------------------------ |
| `close()`         | 关闭`channel`                                                |
| `closeFutuer()`   | 处理`channel`的关闭 <br>`sync`方法同步等待`channel`关闭<br>`addListener`是一步等待关闭 |
| `pipeline()`      | 添加处理器                                                   |
| `write()`         | 写入数据                                                     |
| `writeAndFlush()` | 写入并刷出                                                   |

```java
@Test
public void listenerTest() {
    NioEventLoopGroup group = new NioEventLoopGroup();
    ChannelFuture channelFuture = new Bootstrap()
            // 2. 添加事件循环组   BossEventLoop, WorkerEventLoop(selector, thread)
            .group(group)
            // 3. 选择服务器的ServerSocketChannel的实现类
            .channel(NioSocketChannel.class)
            // 4. 添加处理器
            .handler(new ChannelInitializer<NioSocketChannel>() {
                // 5. 在连接建立后被调用
                @Override
                protected void initChannel(NioSocketChannel channel) throws Exception {
                    channel.pipeline()
                            .addLast(new StringEncoder());
                }
            })
            // 6. 连接服务器
            /**
             * 异步非阻塞， main发起调用， 真正执行 connect 的是 nio 线程
             * 连接后返回 ChannelFuture， 
             * 可以使用 sync() 阻塞线程获取channel 
             * 或者添加监听器， 连接建立后执行回调方法
             */
            .connect(new InetSocketAddress("localhost", 1024));
    // 添加监听器，实现方法里的ChannelFuture就是调用的这个channelFuture
    channelFuture.addListener(new ChannelFutureListener() {
        @Override
        public void operationComplete(ChannelFuture future) throws Exception {
            Channel channel = future.channel();
            channel.writeAndFlush("hello, chat!看看支不支持中文啊");
        }
    });
    // 使用lambda的简化写法
    channelFuture.addListener((ChannelFutureListener) future -> {
        Channel channel = future.channel();
        channel.writeAndFlush("hello, chat!看看支不支持中文啊");
    });
}
```

### 2. 关闭ChannelFutuer

1. 使用sync同步关闭

```java
Channel channel = channelFuture.sync().channel();
ChannelFuture closeFuture = channel.closeFuture();
log.info("waiting close....");
closeFuture.sync();
log.info("后续处理");
```

2. 添加监听器关闭

```java
closeFuture.addListener(new ChannelFutureListener() {
    @Override
    public void operationComplete(ChannelFuture future) throws Exception {
        log.info("关闭后续处理");
        // 关闭channel之后关闭主线程，会在处理完所有请求之后才关闭主线程
        group.shutdownGracefully();
    }
});
// lambds操作
closeFuture.addListener((ChannelFutureListener) future -> log.info("关闭后执行"));
```



