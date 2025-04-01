:::tip
自己的小网站又一个发送邮件验证码的功能，使用的是Hutool的工具类，这个东西以前是好好的，
但是现在突然就会报错，之前是好像是因为JDK没有开启TLS V1.3，记录一下怎么解决
:::

# 1. 具体报错信息如下
```plantext
Caused by: javax.mail.MessagingException: Could not connect to SMTP host: smtp.qq.com, port: 465
	at com.sun.mail.smtp.SMTPTransport.openServer(SMTPTransport.java:1961) ~[mail-1.4.7.jar!/:1.4.7]
	at com.sun.mail.smtp.SMTPTransport.protocolConnect(SMTPTransport.java:654) ~[mail-1.4.7.jar!/:1.4.7]
	at javax.mail.Service.connect(Service.java:317) ~[mail-1.4.7.jar!/:1.4.7]
	at javax.mail.Service.connect(Service.java:176) ~[mail-1.4.7.jar!/:1.4.7]
	at javax.mail.Service.connect(Service.java:125) ~[mail-1.4.7.jar!/:1.4.7]
	at javax.mail.Transport.send0(Transport.java:194) ~[mail-1.4.7.jar!/:1.4.7]
	at javax.mail.Transport.send(Transport.java:124) ~[mail-1.4.7.jar!/:1.4.7]
	at cn.hutool.extra.mail.Mail.doSend(Mail.java:412) ~[hutool-all-5.8.15.jar!/:5.8.15]
	at cn.hutool.extra.mail.Mail.send(Mail.java:390) ~[hutool-all-5.8.15.jar!/:5.8.15]
	... 121 common frames omitted
Caused by: javax.net.ssl.SSLHandshakeException: No appropriate protocol (protocol is disabled or cipher suites are inappropriate)
	at java.base/sun.security.ssl.HandshakeContext.<init>(HandshakeContext.java:170) ~[na:na]
	at java.base/sun.security.ssl.ClientHandshakeContext.<init>(ClientHandshakeContext.java:103) ~[na:na]
	at java.base/sun.security.ssl.TransportContext.kickstart(TransportContext.java:235) ~[na:na]
	at java.base/sun.security.ssl.SSLSocketImpl.startHandshake(SSLSocketImpl.java:449) ~[na:na]
	at java.base/sun.security.ssl.SSLSocketImpl.startHandshake(SSLSocketImpl.java:427) ~[na:na]
	at com.sun.mail.util.SocketFetcher.configureSSLSocket(SocketFetcher.java:549) ~[mail-1.4.7.jar!/:1.4.7]
	at com.sun.mail.util.SocketFetcher.createSocket(SocketFetcher.java:354) ~[mail-1.4.7.jar!/:1.4.7]
	at com.sun.mail.util.SocketFetcher.getSocket(SocketFetcher.java:211) ~[mail-1.4.7.jar!/:1.4.7]
	at com.sun.mail.smtp.SMTPTransport.openServer(SMTPTransport.java:1927) ~[mail-1.4.7.jar!/:1.4.7]
	... 129 common frames omitted
```
# 2. 查看当前支持的TLS版本
> 如果有 `TLSV1`, `TLSV1.1` 就需要删除掉，只保留 `TLSV1.2` 和 `TLSV1.3`
1.  创建要编辑的文件 
```shell
vim TLSVersionTest.java
```
2.  输入以下代码
```java
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import java.io.IOException;

public class TLSVersionTest {
    public static void main(String[] args) throws IOException {
        // 创建 SSLSocketFactory 实例
        SSLSocketFactory factory = (SSLSocketFactory) SSLSocketFactory.getDefault();
        // 创建一个未连接的 SSLSocket 实例
        SSLSocket socket = (SSLSocket) factory.createSocket();

        // 获取支持的协议
        String[] supportedProtocols = socket.getSupportedProtocols();
        System.out.println("支持的 TLS 协议版本:");
        for (String protocol : supportedProtocols) {
            System.out.println(protocol);
        }

        // 获取启用的协议
        String[] enabledProtocols = socket.getEnabledProtocols();
        System.out.println("\n当前启用的 TLS 协议版本:");
        for (String protocol : enabledProtocols) {
            System.out.println(protocol);
        }
    }
}  
```
3.  编译并运行代码
```shell
# JDK 11之前
javac TLSVersionTest.java
java TLSVersionTest
# JDK 11之后
javac TLSVersionTest.java
```
# 3. 修改 jdk的 java.security 文件
1. 查找 java.security 文件的路径
```shell
 sudo find /usr/lib/jvm -name "java.security"
 # cd进入之后发现是个文件夹，最终路径如下
 cd /etc/java-11-openjdk/security
```
2. 先复制一份再编辑
```shell
cp java.security java.security.bak
vim java.security
```
3. 在vim中搜索内容
```shell
?disabledAlgorithms=
# 我的在737行
:737
```
4. 注释当前行，然后复制到下一行，删除掉 `TLSV1` 和 `TLSV1.1` 保存
```shell
#jdk.tls.disabledAlgorithms=SSLv3, TLSv1, TLSv1.1, DTLSv1.0, RC4, DES, \
jdk.tls.disabledAlgorithms=SSLv3, DTLSv1.0, RC4, DES, \ 
```
5. 保存并退出，然后重启代码
