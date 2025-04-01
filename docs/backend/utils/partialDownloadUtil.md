:::tip
实现一个分片下载的工具类, 主要思路就是通过判断请求头中是否包含有range字段, 如果有, 则返回206状态码,
并在响应头中添加Content-Range字段, 否则返回200状态码
:::

# 1. 分片下载工具类
> 提供了基于 NIO Channel 和 OutputStream 的两种方式下载文件, 
> 
> 如果请求头没有携带 Range 字段, 则会返回整个文件, Channel的方式也会通过OutputStream下载，这里有需求可以自己更改
```java
package net.lesscoding.utils;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author eleven
 * @date 2025/4/1 17:11
 * @apiNote 分片文件下载工具类
 */
@Component
public class PartialFileDownloadUtil {
    // 假设这是文件存储的基础路径，可根据实际情况修改
    private static final String FILE_STORAGE_PATH = "D:/__easyHelper__/";

    /**
     * 使用 NIO 通道下载文件，支持分片下载。
     *
     * @param fileName  要下载的文件名
     * @param request   HttpServletRequest 对象，用于获取请求信息
     * @param response  HttpServletResponse 对象，用于设置响应信息
     * @throws IOException 如果在文件操作或网络传输过程中出现错误
     */
    public void downloadFileByChannel(String fileName, HttpServletRequest request, HttpServletResponse response) throws IOException {
        File file = checkFileIsExists(fileName);
        long fileLength = file.length();
        String rangeHeader = request.getHeader("Range");
        if (rangeHeader != null) {
            // 处理 Range 请求
            handleRangeRequest(file, rangeHeader, fileLength, response);
        } else {
            // 完整文件下载
            handleFullFileDownload(file, fileLength, response);
        }
    }

    private File checkFileIsExists(String fileName) throws FileNotFoundException {
        File file = getFile(fileName);
        if (!file.exists()) {
            throw new FileNotFoundException("File not found: " + fileName);
        }
        return file;
    }

    /**
     * 普通方式下载文件，支持分片下载。
     *
     * @param fileName  要下载的文件名
     * @param request   HttpServletRequest 对象，用于获取请求信息
     * @param response  HttpServletResponse 对象，用于设置响应信息
     * @throws IOException 如果在文件操作或网络传输过程中出现错误
     */
    public void downloadFileByOutputStream(String fileName, HttpServletRequest request, HttpServletResponse response) throws IOException {
        File file = checkFileIsExists(fileName);
        long fileLength = file.length();
        String rangeHeader = request.getHeader("Range");
        if (rangeHeader != null) {
            // 处理 Range 请求
            handleRangeRequestWithRandomAccessFile(file, rangeHeader, fileLength, response);
        } else {
            // 完整文件下载
            handleFullFileDownload(file, fileLength, response);
        }
    }

    /**
     * 根据文件名获取文件对象。
     * 实际业务中需要换成 OSS 或者 文件服务器 获取
     * @param fileName 文件名
     * @return 文件对象
     */
    private File getFile(String fileName) {
        return new File(FILE_STORAGE_PATH + fileName);
    }

    /**
     * 处理 Range 请求，使用 NIO 通道进行文件传输。
     *
     * @param file        要下载的文件
     * @param rangeHeader Range 请求头
     * @param fileLength  文件总长度
     * @param response    HttpServletResponse 对象，用于设置响应信息
     * @throws IOException 如果在文件操作或网络传输过程中出现错误
     */
    private void handleRangeRequest(File file, String rangeHeader, long fileLength, HttpServletResponse response) throws IOException {
        Pattern pattern = Pattern.compile("bytes=(\\d+)-(\\d*)");
        Matcher matcher = pattern.matcher(rangeHeader);
        if (matcher.matches()) {
            long start = Long.parseLong(matcher.group(1));
            long end = matcher.group(2).isEmpty() ? fileLength - 1 : Long.parseLong(matcher.group(2));

            setPartialContentHeaders(response, start, end, fileLength, file.getName());

            try (FileInputStream fis = new FileInputStream(file);
                 FileChannel fileChannel = fis.getChannel()) {
                OutputStream outputStream = response.getOutputStream();
                ByteBuffer buffer = ByteBuffer.allocate(4096);
                fileChannel.position(start);
                long remaining = end - start + 1;
                while (remaining > 0) {
                    int read = fileChannel.read(buffer);
                    if (read == -1) {
                        break;
                    }
                    buffer.flip();
                    int length = (int) Math.min(read, remaining);
                    byte[] bytes = new byte[length];
                    buffer.get(bytes, 0, length);
                    outputStream.write(bytes);
                    buffer.clear();
                    remaining -= length;
                }
            }
        }
    }

    /**
     * 处理 Range 请求，使用 RandomAccessFile 进行文件传输。
     *
     * @param file        要下载的文件
     * @param rangeHeader Range 请求头
     * @param fileLength  文件总长度
     * @param response    HttpServletResponse 对象，用于设置响应信息
     * @throws IOException 如果在文件操作或网络传输过程中出现错误
     */
    private void handleRangeRequestWithRandomAccessFile(File file, String rangeHeader, long fileLength, HttpServletResponse response) throws IOException {
        Pattern pattern = Pattern.compile("bytes=(\\d+)-(\\d*)");
        Matcher matcher = pattern.matcher(rangeHeader);
        if (matcher.matches()) {
            long start = Long.parseLong(matcher.group(1));
            long end = matcher.group(2).isEmpty() ? fileLength - 1 : Long.parseLong(matcher.group(2));

            setPartialContentHeaders(response, start, end, fileLength, file.getName());

            try (RandomAccessFile randomAccessFile = new RandomAccessFile(file, "r")) {
                randomAccessFile.seek(start);
                OutputStream outputStream = response.getOutputStream();
                byte[] buffer = new byte[4096];
                int bytesRead;
                long remaining = end - start + 1;
                while (remaining > 0 && (bytesRead = randomAccessFile.read(buffer, 0, (int) Math.min(buffer.length, remaining))) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                    remaining -= bytesRead;
                }
            }
        }
    }

    /**
     * 处理完整文件下载。
     *
     * @param file        要下载的文件
     * @param fileLength  文件总长度
     * @param response    HttpServletResponse 对象，用于设置响应信息
     * @throws IOException 如果在文件操作或网络传输过程中出现错误
     */
    private void handleFullFileDownload(File file, long fileLength, HttpServletResponse response) throws IOException {
        setFullContentHeaders(response, fileLength, file.getName());

        try (FileInputStream fis = new FileInputStream(file)) {
            OutputStream outputStream = response.getOutputStream();
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
        }
    }

    /**
     * 设置完整文件下载的响应头。
     *
     * @param response  HttpServletResponse 对象，用于设置响应信息
     * @param fileLength 文件总长度
     * @param fileName  文件名
     */
    private void setFullContentHeaders(HttpServletResponse response, long fileLength, String fileName) {
        response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"");
        response.setHeader(HttpHeaders.CONTENT_LENGTH, String.valueOf(fileLength));
    }

    /**
     * 设置分片下载的响应头。
     *
     * @param response  HttpServletResponse 对象，用于设置响应信息
     * @param start     分片开始位置
     * @param end       分片结束位置
     * @param fileLength 文件总长度
     * @param fileName  文件名
     */
    private void setPartialContentHeaders(HttpServletResponse response, long start, long end, long fileLength, String fileName) {
        response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);
        response.setHeader(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + fileLength);
        response.setHeader(HttpHeaders.CONTENT_LENGTH, String.valueOf(end - start + 1));
        response.setHeader(HttpHeaders.ACCEPT_RANGES, "bytes");
        response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"");
    }
}

```
