:::tip
在 SpringBoot 中， HttpServletRequest通常只能够读取一次，<br/>
但是有的需求需要对请求参数做处理，所以就需要对HttpServletRequest做封装<br/>
可以使用 HttpServletRequestWrapper 来包装 HttpServletRequest，从而实现多次读取的功能。
:::

# 1. HttpServletRequest包装类

> 将只能读取一次的`HttpServletRequest`包装成可重复读的`request`

```java
import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.*;

/**
 *  introduction:
 *
 *
 *      由于流只能读取一次，所以使用此包装类对HttpServletRequest对象进行包装，读取完之后再将
 *      内容塞回去，不影响后续springmvc的参数处理。
 */
public class RequestWrapper extends HttpServletRequestWrapper {
    private String body;
    public RequestWrapper(HttpServletRequest request) {
        super(request);
        if (request.getHeader("Content-Type") != null
                && request.getHeader("Content-Type").contains("multipart/form-data")){
            try{
                request.getParts();
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        StringBuilder stringBuilder = new StringBuilder();
        try (InputStream inputStream = request.getInputStream();
             BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream))){
                char[] charBuffer = new char[128];
                int bytesRead = -1;
                while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
                    stringBuilder.append(charBuffer, 0, bytesRead);
                }
                
        }catch (NullPointerException ex){
            stringBuilder.append("");
        } catch (Exception ex) {

        }
        body = stringBuilder.toString();
    }

    @Override
    public ServletInputStream getInputStream() throws IOException {
        final ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(body.getBytes());
        ServletInputStream servletInputStream = new ServletInputStream() {
            @Override
            public boolean isFinished() {
                return false;
            }
            @Override
            public boolean isReady() {
                return false;
            }
            @Override
            public void setReadListener(ReadListener readListener) {
            }
            @Override
            public int read() throws IOException {
                return byteArrayInputStream.read();
            }
        };
        return servletInputStream;

    }

    @Override
    public BufferedReader getReader() throws IOException {
        return new BufferedReader(new InputStreamReader(this.getInputStream()));
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
}
```

# 2.使用Filter对request传递下去

```java
import com.rrswl.iwms.rf.interceptor.RequestWrapper;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * @author eleven
 * @date 2021/11/25 13:26
 * @apiNote 传递request的过滤器
 */
public class RepeatedlyReadFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        ServletRequest requestWrapper = null;
        if(request instanceof HttpServletRequest){
            requestWrapper = new RequestWrapper((HttpServletRequest) request);
        }
        chain.doFilter( requestWrapper == null ? request : requestWrapper,response );
    }

    @Override
    public void destroy() {

    }
}
```
