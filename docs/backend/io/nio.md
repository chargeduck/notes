# 0. 简介
> 还是从[B站尚硅谷](https://www.bilibili.com/video/BV1E64y1h7Z4)看的视频 

# 1. 概述

> Java NIO(NewlO或 Non Blocking lO)是从 Java 1.4 版本开始引入的一个新的IO API，可以替代标准的 Java IO API。NIO 支持面向缓冲区的、基于通道的 IO 操作。NIO 将以更加高效的方式进行文件的读写操作。

## 1阻塞IO

通常在进行同步 I/O操作时，如果读取数据，代码会阻塞直至有可供读取的数据。同样，写入调用将会阻塞直至数据能够写入。

传统的Server/Client模式会基于TPR(Thread per Request),服务器会为每个客户端请求建立一个线程，由该线程单独负责处理一个客户请求。

这种模式带来的一个问题就是线程数量的剧增，大量的线程会增大服务器的开销。

大多数的实现为了避免这个问题，都采用了线程池模型，并设置线程池线程的最大数量，这由带来了新的问题.

如果线程池中有100个线程，而有100 个用户都在进行大文件下载，会导致第101个用户的请求无法及时处理，即便第101个用户只想请求一个几 KB 大小的页面。

## 2 非阻塞IO （NIO）

NIO 中非阻塞 I/O 采用了基于 Reactor 模式的工作方式，I/O 调用不会被阻塞，相反是注册感兴趣的特定 I/O 事件，如可读数据到达，新的套接字连接等等，在发生特定事件时，系统再通知我们。NIO 中实现非阻塞I/O的核心对象就是Selector。

非阻塞指的是 IO 事件本身不阻塞,但是获取 IO 事件的 select()方法是需要阻塞等待的区别是阻塞的 IO 会阻塞在 IO 操作上, NIO 阻塞在事件获取上,没有事件就没有 IO,从高层次看 IO 就不阻塞了.也就是说只有 IO 已经发生那么我们才评估 IO 是否阻塞,但是select()阻塞的时候 IO 还没有发生,何谈 IO 的阻塞呢?NIO 的本质是延迟 IO 操作到真正发生 IO 的时候,而不是以前的只要 IO 流打开了就一直等待 IO 操作。

| IO                      | NIO                         |
| ----------------------- | --------------------------- |
| 面向流(Stream oriented) | 面向缓冲区(Buffer Oriented) |
| 阻塞IO                  | 非阻塞                      |
|                         | 选择器 Selectors            |

## 3 NIO 概述

NIO由三个核心组成`Channels`,`Buffers`,`Selectors`

虽然 Java NIO 中除此之外还有很多类和组件，但 Channel，Buffer 和 Selector 构成了核心的 API。其它组件，如 Ppe和 FileLock，只不过是与三个核心组件共同使用的工具类。

### 1. Channels

Channel，可以翻译成“通道”。Channel和IO中的 Stream(流)是差不多一个等级的。只不过 Stream是单向的，譬如:InputStream,OutputStream.而Channel是双向的，既可以用来进行读操作，又可以用来进行写操作。
NI0 中的 Channel 的主要实现有:FileChannel、DatagramChannel.SocketChannel和 ServerSocketChannel，这里看名字就可以猜出个所以然来:分别可以对应文件10、UDP和TCP(Server和Client)。

### 2. Buffer

NIO 中的关键 Buffer 实现有:ByteBuffer, CharBuffer, DoubleBuffer, FloatBufferIntBuffer, LongBuffer, ShortBuffer，分别对应基本数据类型: byte, char, double,float, int, long, short。

### 3. Selector

Selector 运行单线程处理多个 ChannelT如果你的应用打开了多个通道，但每个连接的流量都很低，使用 Selector就会很方便。例如在一个聊天服务器中。要使用Selector, 得向 Selector 注册 Channel，然后调用它的 select()方法。这个方法会一直阻塞到某个注册的通道有事件就绪。一旦这个方法返回，线程就可以处理这些事件事件的例子有如新的连接进来、数据接收等

# 2. Channel

## 1. 概述

Channel是一个通道，可以通过它读取和写入数据，它就像水管一样，网络数据通过Channel读取和写入。通道与流的不同之处在于通道是双向的，流只是在一个方向上移动(一个流必须是InputStream 或者 OutputStream 的子类)，而且通道可以用于读、写或者同时用于读写。因为 Channel是全双工的，所以它可以比流更好地映射底层操作系统的 API。

NIO 中通过 channel 封装了对数据源的操作，通过 channel 我们可以操作数据源，又不必关心数据源的具体物理结构。这个数据源可能是多种的。比如，可以是文件也可以是网络 socket。在大多数应用中，channel与文件描述符或者 socket是--对应的。Channel用于在字节缓冲区和位于通道另一侧的实体(通常是一个文件或套接字)之间有效地传输数据。

与缓冲区不同，通道 API主要由接口指定。不同的操作系统上通道实现(ChannelImplementation)会有根本性的差异，所以通道 AP仅仅描述了可以做什么。因此很自然地，通道实现经常使用操作系统的本地代码。通道接口允许您以一种受控且可移植的方式来访问底层的 I/O 服务。

Channel是一个对象，可以通过它读取和写入数据。拿 NIO与原来的 I/O做个比较，通道就像是流。所有数据都通过 Buffer 对象来处理。您永远不会将字节直接写入通道中，相反，您是将数据写入包含一个或者多个字节的缓冲区。同样，您不会直接从通道中读取字节，而是将数据从通道读入缓冲区，再从缓冲区获取这个字节。

NIO中的通道类似流但是又有所不同

1. 既可以从通道中读取数据，又可以写数据到通道。但流的读写通常是单向的
2. 通道可以异步地读写
3. 通道中的数据总是要先读到一个 Buffer，或者总是要从一个 Buffer 中写入

## 2.  实现

> 通道覆盖了UDP TCP 网络IO 和文件IO

| Channel实现         | 描述                                                         |
| ------------------- | ------------------------------------------------------------ |
| FileChannel         | 从文件中读写数据                                             |
| DatagramChannel     | 通过UDP读写网络数据                                          |
| SocketChannel       | 通过TCP读写网络数据                                          |
| ServerSocketChannel | 监听新的TCP链接，像WEB服务器那样<br/>对每一个新链接创建一个SocketChannel |

## 3. FileChannel

> FileChannel类可以实现常用的 read，write 以及 scatter/gather 操作，同时它也提供了很多专用于文件的新方法。这些方法中的许多都是我们所熟悉的文件操作。

| 方法                         | 描述                                         |
| ---------------------------- | -------------------------------------------- |
| int read(ByteBuffer dst)     | 从 Channel 中读取数据到 ByteBuffer           |
| long read(ByteBuffer[] dsts) | 将Channel 中的数据“分散”到 ByteBuffer[]      |
| int write(ByteBuffer src)    | 将 ByteBuffer 中的数据写入到 Channel         |
| long write(ByteBuffer,srcs)  | 将 ByteBuffer[]中的数据“聚集”到 Channel      |
| long position()              | 返回此通道的文件位置                         |
| FileChannel position(long p) | 设置此通道的文件位置                         |
| long size()                  | 返回此通道的文件的当前大小                   |
| FileChannel truncate(long s) | 将此通道的文件截取为给定大小                 |
| void force(boolean metalata) | 强制将所有对此通道的文件更新写入到存储设备中 |

### 1. 使用FileChannel读取数据到Buffer的示例

> `RandomAccessFile`是 Java 中用于随机访问文件的类，支持以下四种模式操作文件
>
> | 模式 | 描述                                           | 特点                                                         | 使用场景                                                     |
> | ---- | ---------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
> | r    | 只读模式                                       | 以只读方式打开文件。只能进行读取操作，不能进行写入操作。如果试图进行写操作，会抛出异常。<br/>文件必须存在，否则会抛出异常 | 当只需要读取文件内容而不进行任何修改时使用。比如读取配置文件、文本文件进行分析等 |
> | rw   | 读写模式                                       | 以读写方式打开文件。如果文件不存在，会尝试创建新文件。 <br/>可以进行读取和写入操作，允许在文件的任意位置进行数据的读取和修改。 | 适用于需要对文件进行随机读写操作的情况。例如，数据库文件的更新、日志文件的追加和修改等。 |
> | rws  | 读写模式，同步文件内容和元数据的更新到存储设备 | 也可进行读写操作。<br/>不仅同步文件内容的修改，还同步文件的元数据（如文件大小、修改时间等）的更新到存储设备。同样，这种同步操作可能会对性能产生较大影响 | 在对文件的完整性和一致性要求非常高的情况下可以使用。但通常情况下，“rws” 模式的性能开销较大，只有在确实需要这种高可靠性时才考虑使用。 |
> | rwd  | 读写模式，同步文件内容的更新到存储设备         | 与 “rw” 模式类似，可以进行读写操作。<br/>对文件内容的任何修改都会立即同步到存储设备，确保数据的持久性。这种同步操作可能会影响性能 | 对于关键数据文件，需要确保数据在发生系统故障时不会丢失，可以使用这个模式。但由于同步操作可能会降低性能，所以应谨慎使用 |

- 示例代码

```java
package net.lesscoding.test.nio.channel;

import lombok.extern.slf4j.Slf4j;
import org.junit.Test;

import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.StandardCharsets;

/**
 * @author eleven
 * @date 2024/9/18 13:19
 * @apiNote
 */
@Slf4j
public class FileChannelTest {

    private final String filePath = "D:/raf.txt";

    @Test
    public void readFile() {
        // 1. 创建FileChannel
        try (RandomAccessFile randomAccessFile = new RandomAccessFile(filePath, "rw");
             FileChannel channel = randomAccessFile.getChannel()) {
            // 2. 创建Buffer
            ByteBuffer byteBuffer = ByteBuffer.allocate(1024);
            // 3. 读取数据到Buffer中
            int read = channel.read(byteBuffer);
            while (read != -1) {
                log.info("读取了: {}", (char) read);
                byteBuffer.flip();
                // 判断buffer的缓冲区是否有数据
                while (byteBuffer.hasRemaining()) {
                    log.info("当前数据 {}", byteBuffer.get());
                }
                // 使用clear或者compact方法清除缓冲区内容
                byteBuffer.clear();
                read = channel.read(byteBuffer);
            }
        } catch (Exception e) {
            log.info("读取文件失败 {}", e.getMessage());
        }
    }

    @Test
    public void chineseTest() {
        String content = "";
        try (RandomAccessFile randomAccessFile = new RandomAccessFile("D:/raf.txt", "rw");
             FileChannel channel = randomAccessFile.getChannel()) {
            ByteBuffer byteBuffer = ByteBuffer.allocate(1024);
            int read;
            while ((read = channel.read(byteBuffer)) != -1) {
                byteBuffer.flip();
                byte[] bytes = new byte[byteBuffer.remaining()];
                byteBuffer.get(bytes);
                byteBuffer.clear();
                content = new String(bytes, StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            log.info("读取文件失败 {}", e.getMessage());
        }
        // 读取完所有数据后打印字符串内容
        log.info("文件内容：{}", content);
    }
}
```

### 2. FileChannel详解

1. 打开FileChannel

> 使用FileChannel之前必须先打开，无法直接打开FileChannel。
>
> 必须使用`InputStream`,`OutputStream`,`RandomAccessFile`来打开一个FileChannel

```java
try (RandomAccessFile randomAccessFile = new RandomAccessFile("D:/raf.txt", "rw");
             FileChannel channel = randomAccessFile.getChannel()) {
    
} catch (Exception e) {
    
}
```

```java
try(FileInputStream fis = new FileInputStream(filePath);
    FileChannel channel = fis.getChannel()) {

}catch (IOException e) {

}
```

2. 从FileChannel读取数据

> 首先，分配一个 Buffer。从 FileChannel中读取的数据将被读到 Buffer 中。然后，调用 FileChannel.read()方法。该方法将数据从 FileChannel读取到 Buffer 中。read()方法返回的 int 值表示了有多少字节被读到了 Buffer 中。如果返回-1，表示到了文件末尾。
>
> 有多个重载的read方法，这只是其中一个

```java
ByteBuffer buf = ByteBuffer.allocate(512);
int bytesRead = channel.read(buf);
```

3. 向FileChannel写入数据

> 注意 FileChannel.write()是在 while 循环中调用的。因为无法保证 write()方法一次能向 FileChannel写入多少字节，因此需要重复调用 write()方法，直到 Buffer 中已经没有尚未写入通道的字节。

```java
@Test
public void writeTest() {
    try (RandomAccessFile accessFile = new RandomAccessFile(filePath, "rw");
         FileChannel channel = accessFile.getChannel()){
        ByteBuffer byteBuffer = ByteBuffer.allocate(1024);
        String newData = "测试新写入的数据";
        byteBuffer.clear();
        byteBuffer.put(newData.getBytes(StandardCharsets.UTF_8));
        byteBuffer.flip();
        while (byteBuffer.hasRemaining()) {
            channel.write(byteBuffer);
        }
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
}

/**
 * 追加写入
 */
@Test
public void appendWriteTest() {
    try (RandomAccessFile accessFile = new RandomAccessFile(filePath, "rw");
         FileChannel channel = accessFile.getChannel()){
        ByteBuffer byteBuffer = ByteBuffer.allocate(1024);
        String newData = "测试追加写入的数据";
        byteBuffer.clear();
        byteBuffer.put(newData.getBytes(StandardCharsets.UTF_8));
        byteBuffer.flip();
        while (byteBuffer.hasRemaining()) {
            channel.position(channel.size());
            channel.write(byteBuffer);
        }

    } catch (IOException e) {
        throw new RuntimeException(e);
    }
}
```

4. 关闭FileChannel

> FileChannel是继承了AutoCloseable接口的，直接在twr语句里写不用手动关闭

5. position方法

> 有时可能需要在 FileChannel 的某个特定位置进行数据的读/写操作。可以通过调用position()方法获取 FileChannel的当前位置。也可以通过调用 position(long pos)方法设置 FileChannel 的当前位置.
>
> 如果将位置设置在文件结束符之后，然后试图从文件通道中读取数据，读方法将返回
> 1(文件结束标志)。
>
> 如果将位置设置在文件结束符之后，然后向通道中写数据，文件将撑大到当前位置并写入数据。这可能导致“文件空洞“磁盘上物理文件中写入的数据间有空隙。“

6. truncate

> 可以使用 FileChannel.truncate()方法截取一个文件。截取文件时，文件将中指定长度后面的部分将被删除。这个例子截取文件的前 1024 个字节。
>
> ```java
> channel.truncate(1024);
> ```

7. force

> FileChannel.force()方法将通道里尚未写入磁盘的数据强制写到磁盘上。出于性能方面的考虑，操作系统会将数据缓存在内存中，所以无法保证写入到 FileChannel里的数据一定会即时写到磁盘上。要保证这一点，需要调用force()方法。force()方法有一个 boolean 类型的参数，指明是否同时将文件元数据(权限信息等)写到磁盘上。

8. transferFrom

> 如果有两个通道中有一个是FileChannel,则可以直接将数据从一个channel传输到另外一个Channel。
>
> FileChannel 的 transferFrom()方法可以将数据从源通道传输到 FileChannel中(译者注:这个方法在 JDK文档中的解释为将字节从给定的可读取字节通道传输到此通道的文件中)。

```java
@Test
public void transferFormTest() {
    try(FileChannel fromChannel = new RandomAccessFile(filePath, "rw").getChannel();
    FileChannel toChannel = new RandomAccessFile(filePath2, "rw").getChannel()) {
        // 从from传输到to
        long position = 0;
        long size = fromChannel.size();
        toChannel.transferFrom(fromChannel, position, size);
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
}
```

9. transferTo

```java
@Test
public void transferToTest() {
    try(FileChannel fromChannel = new RandomAccessFile(filePath, "rw").getChannel();
        FileChannel toChannel = new RandomAccessFile(filePath2, "rw").getChannel()) {
        // 从from传输到to
        long position = 0;
        long size = fromChannel.size();
        fromChannel.transferTo(position, size, toChannel);
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
}
```

## 4. SocketChannel

### 1. 简介

1. 新的 socket 通道类可以运行非阻塞模式并且是可选择的，可以激活大程序(如网络服务器和中间件组件)巨大的可伸缩性和灵活性。避免了管理大量线程所需的上下文交换开销。借助新的 NIO 类，一个或几个线程就可以管理成百上千的活动 socket 连接了并且只有很少甚至可能没有性能损失。所有的 socket通道类(DatagramChannel、SocketChannel和ServerSocketChannel)都继承了位于java.nio.channels.spi包中的 AbstractSelectableChannel。这意味着我们可以用一个Selector 对象来执行socket通道的就绪选择(readiness selection)。

2. 注意 DatagramChannel和 SocketChannel 实现定义读和写功能的接口而ServerSocketChanne!不实现。ServerSocketChannel负责监听传入的连接和创建新的 SocketChanne!对象，它本身从不传输数据。

3. 通道是一个连接 I/O服务导管并提供与该服务交互的方法。就某个 socket 而言，它不会再次实现与之对应的 socket 通道类中的 socket 协议 API，而java.net 中已经存在的 socket 通道都可以被大多数协议操作重复使用。
   全部 socket通道类(DatagramChannel、SocketChannel和ServerSocketChannel)在被实例化时都会创建一个对等socket 对象。这些是我们所熟悉的来自java.net的类(Socket、ServerSocket和DatagramSocket)，它们已经被更新以识别通道。对等 socket 可以通过调用socket( )方法从一个通道上获取。此外，这三个java.net 类现在都有 getChannel()方法。

4. 要把一个 socket 通道置于非阻塞模式，我们要依靠所有 socket通道类的公有超级类:`SelectableChannel`。就绪选择(readiness selection)是一种可以用来查询通道的机制，该查询可以判断通道是否准备好执行一个目标操作，如读或写。非阻塞 I/O 和可选择性是紧密相连的，那也正是管理阻塞模式的 API代码要在SelectableChannel超级类中定义的原因。

   设置或重新设置一个通道的阻塞模式是很简单的，只要调用configureBlocking()方法即可，传递参数值为 true 则设为阻塞模式，参数值为 false 值设为非阻塞模式。可以通过调用 isBlocking()方法来判断某个 socket 通道当前处于哪种模式



### 2.  ServerSocketChannel

> ServerSocketChannel是一个基于通道的 socket 监听器。它同我们所熟悉的java.net.ServerSocket执行相同的任务，不过它增加了通道语义，因此能够在非阻塞模式下运行
>
> 由于 ServerSocketChannel没有 bind()方法，因此有必要取出对等的 socket 并使用它来绑定到一个端口以开始监听连接。我们也是使用对等 ServerSocket的 API 来根据需要设置其他的 socket 选项
>
> 同java.net.ServerSocket一样，ServerSocketChannel 也有 accept( )方法。一旦创建了一个 ServerSocketChannel 并用对等 socket 绑定了它，然后就可以在其中一个上调用 accept()。如果选择在 ServerSocket 上调用 accept( )方法，那么它会同任何其他的 ServerSocket 表现一样的行为:总是阻塞并返回一个java.net.Socket 对象。如果您选择在 ServerSocketChannel上调用 accept()方法则会返回SocketChannel类型的对象，返回的对象能够在非阻塞模式下运行。

> - ServerSocketChannel的accept()方法会返回SocketChannel类型对象
> - SocketChannel可以在非阻塞模式下运行。
> - 其它 Socket的 accept()方法会阻塞返回一个 Socket 对象。如果ServerSocketChannel以非阻塞模式被调用，当没有传入连接在等待时ServerSocketChannel.accept()会立即返回 null。正是这种检查连接而不阻塞的能力实现了可伸缩性并降低了复杂性。可选择性也因此得到实现。可以使用一个选择器实例来注册 ServerSocketChannel对象以实现新连接到达时自动通知的功能

```java
package net.lesscoding.test.nio.channel;

import lombok.extern.slf4j.Slf4j;
import org.junit.Test;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.nio.charset.StandardCharsets;

/**
 * @author eleven
 * @date 2024/9/18 17:06
 * @apiNote
 */
@Slf4j
public class ServerSocketChannelTest {
    int port = 888;
	 //  启动后打开浏览器访问localhost:888就能看到有链接了
    @Test
    public void createTes() {
        ByteBuffer buffer = ByteBuffer.wrap("124".getBytes(StandardCharsets.UTF_8));
        try (ServerSocketChannel serverSocketChannel = ServerSocketChannel.open()) {
            // 绑定端口号
            serverSocketChannel.bind(new InetSocketAddress(port));
            // 非阻塞模式
            serverSocketChannel.configureBlocking(false);
            // 监听是否有新的
            while (true) {
                log.info("Waiting for new connections...");
                SocketChannel socketChannel = serverSocketChannel.accept();
                if (socketChannel == null) {
                    log.info("没有新的连接");
                    Thread.sleep(2000);
                } else {
                    log.info("有新的连接 {}", socketChannel.getRemoteAddress());
                    buffer.rewind();
                    socketChannel.write(buffer);
                    socketChannel.close();
                }

            }
        } catch (IOException e) {
            log.error("error", e);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

}
```

### 3. SocketChannel

> 1. 对于已经存在的 socket 不能创建 SocketChannel
> 2. SocketChannel中提供的 open 接口创建的 Channel并没有进行网络级联，需要使用 connect 接口连接到指定地址
> 3. 未进行连接的 SocketChannle.执行 I/O 操作时，会抛出NotYetConnectedException
> 4. SocketChannel 支持两种 I/O 模式:阻塞式和非阻塞式
> 5. SocketChannel支持异步关闭。如果SocketChanne!在一个线程上read 阻塞，另一个线程对该 SocketChanne!调用 shutdownlnput，则读阻塞的线程将返回-1 表示没有读取任何数据;如果 SocketChanne!在一个线程上 write 阻塞，另一个线程对该SocketChannel 调用 shutdownWrite，则写阻塞的线程将抛出AsynchronousCloseException

==可设置的参数==

| 参数         | 描述                                                 |
| ------------ | ---------------------------------------------------- |
| SO_SNDBUF    | 套接字发送缓冲区大小                                 |
| SO_RCVBUF    | 套接字接收缓冲区大小                                 |
| SO_KEEPALIVE | 保活连接                                             |
| O_REUSEADDR  | 复用地址                                             |
| SO_LINGER    | 有数据传输时延缓关闭 Channel(只有在非阻塞模式下有用) |
| TCP_NODELAY  | 禁用 Nagle 算法                                      |



```java
package net.lesscoding.test.nio.channel;

import lombok.extern.slf4j.Slf4j;
import org.junit.Test;

import java.net.InetSocketAddress;
import java.nio.channels.SocketChannel;

/**
 * @author eleven
 * @date 2024/9/18 17:17
 * @apiNote
 */
@Slf4j
public class SocketChannelTest {
    @Test
    public void createTest() {
        InetSocketAddress remote = new InetSocketAddress("www.baidu.com", 443);
        try (SocketChannel socketChannel = SocketChannel.open(remote)){
            socketChannel.configureBlocking(false);
            log.info("SocketChannel 是否正在进行链接 {}", socketChannel.isConnectionPending());
            log.info("SocketChannel open {}", socketChannel.isOpen());
            log.info("SocketChannel 是否已被链接 {}", socketChannel.isConnected());
            log.info("SocketChannel 是否已经完成连接 {}", socketChannel.finishConnect());
        } catch (Exception e) {
            log.error("error {}", e.getMessage());
        }
        /**
         * 先打开通道在连接
         */
        try (SocketChannel socketChannel = SocketChannel.open()){
            socketChannel.connect(remote);
        } catch (Exception e) {

        }
    }
}
```

### 4. DatagramChannel

> 正如SocketChannel对应Socket,ServerSocketChannel对应ServerSocket，每一个 DatagramChannel对象也有一个关联的 DatagrmSocket 对象。正如SocketChannel模拟连接导向的流协议(如TCP/IP)，DatagramChannel则模拟包导向的无连接协议(如 UDP/IP)。DatagramChannel是无连接的，每个数据报(datagram)都是一个自包含的实体，拥有它自己的目的地址及不依赖其他数据报的数据负载。与面向流的的 socket不同，DatagramChannel可以发送单独的数据报给不同的目的地址。同样，DatagramChannel对象也可以接收来自任意地址的数据包。每个到达的数据报都含有关于它来自何处的信息(源地址)“

# 3. Buffer

# 4. Selector

# 5. Pipe和FileLock

# 6. 其他
