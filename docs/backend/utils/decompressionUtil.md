:::tip
昨天接了一个需求，需要前端上传图片压缩包，后端解压图片然后上传到OSS，然后写了这么个工具类。
:::

## 1. 引入项目依赖

> **注意，使用这个工具的时候, 如果使用Hutool-all的ExcelUtil导出数据时，会报错**
>
> `Caused by: java.lang.NoSuchMethodError: org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream.putArchiveEntry(Lorg/apache/commons/compress/archivers/zip/ZipArchiveEntry;)V`
>
> 原因是因为 hutool导出是需要使用 `poi-ooxml`, 然后这个依赖里边用了一个`commons-compress`, 然后可能就有冲突了。
> 如果用了hutool的话就不要添加`commons-compress`依赖了。

```xml
<!-- Zip直接用JDK自带的就行了 -->
<!-- Apache Commons Compress 用于处理 tar、gz 、7z等格式 -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-compress</artifactId>
    <version>1.23.0</version>
</dependency>
<!-- 7z 需要的 用于处理 xz 格式 -->
<dependency>
    <groupId>org.tukaani</groupId>
    <artifactId>xz</artifactId>
    <version>1.9</version>
</dependency>
<!-- junrar 用于处理 rar 格式 -->
<dependency>
    <groupId>com.github.junrar</groupId>
    <artifactId>junrar</artifactId>
    <version>7.4.0</version>
</dependency>
```
# 2. 创建策略类
> 提供一个抽象的策略类，具体的策略类继承这个抽象类，实现具体的解压逻辑。

## 1. 解压缩策略
> 提供一个接收 `MultipartFile` 文件的方法，返回一个 `List<MultipartFile>` 文件列表。
> 
> 提供一个将 `InputStream` 转换为 `MultipartFile` 的方法。 

```java
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * @author eleven
 * @date 2025/2/7 10:17
 * @apiNote
 */
@Slf4j
public abstract class DecompressionStrategy {
    public abstract List<MultipartFile> decompression(MultipartFile file) throws Exception;

    public static MultipartFile convertInputStreamToMultipartFile(InputStream inputStream, String fileName) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        byte[] buffer = new byte[4096];
        int bytesRead;
        while ((bytesRead = inputStream.read(buffer)) != -1) {
            outputStream.write(buffer, 0, bytesRead);
        }
        byte[] fileContent = outputStream.toByteArray();

        // 这里使用 Apache Commons FileUpload 来创建 FileItem，需要引入相关依赖
        FileItem fileItem = new DiskFileItem(
                fileName, null, false, fileName, fileContent.length, null);
        fileItem.getOutputStream().write(fileContent);

        return new CommonsMultipartFile(fileItem);
    }
}
```
## 2. 策略工厂
> 通过判断 file 的后缀名，来获取具体的策略类。

```java
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * @author eleven
 * @date 2025/2/7 10:12
 * @apiNote
 */
public class DecompressionStrategyContext {
    public static Map<String, DecompressionStrategy> strategyMap = new HashMap<>();
    static {
        strategyMap.put("rar", new RarDecompressionStrategy());
        strategyMap.put("zip", new ZipDecompressionStrategy());
        strategyMap.put("7z", new SevenZipDecompressionStrategy());
        strategyMap.put("tar", new TarDecompressionStrategy());
        strategyMap.put("gz", new GzDecompressionStrategy());
    }
    public static DecompressionStrategy getStrategy(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        if (fileName != null) {
            String extension = getFileExtension(fileName).toLowerCase();
            return strategyMap.get(extension);
        }
        return null;
    }

    private static String getFileExtension(String fileName) {
        int lastIndex = fileName.lastIndexOf('.');
        return lastIndex == -1 ? "" : fileName.substring(lastIndex + 1);
    }
}
```
## 3. Zip解压缩策略
```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * @author eleven
 * @date 2025/2/7 10:18
 * @apiNote
 */
@Slf4j
public class ZipDecompressionStrategy extends DecompressionStrategy {

    @Override
    public List<MultipartFile> decompression(MultipartFile file) throws Exception {
        List<MultipartFile> multipartFiles = new ArrayList<>();
        try (InputStream inputStream = file.getInputStream();
             ZipInputStream zipIn = new ZipInputStream(inputStream)) {
            // 遍历压缩文件中的每个条目
            ZipEntry entry;
            while ((entry = zipIn.getNextEntry()) != null) {
                if (!entry.isDirectory()) {
                    // 调用转换方法将当前 ZipEntry 的输入流转换为 MultipartFile
                    MultipartFile multipartFile = convertInputStreamToMultipartFile(zipIn, entry.getName());
                    multipartFiles.add(multipartFile);
                }
                zipIn.closeEntry();
            }
        } catch (Exception e) {
            log.error("解压 zip 文件失败", e);
        }
        return multipartFiles;
    }
}
```

## 4. 7z解压缩策略
```java
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.compress.archivers.sevenz.SevenZArchiveEntry;
import org.apache.commons.compress.archivers.sevenz.SevenZFile;
import org.apache.commons.compress.utils.SeekableInMemoryByteChannel;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

/**
 * @author eleven
 * @date 2025/2/7 10:20
 * @apiNote
 */
@Slf4j
public class SevenZipDecompressionStrategy extends DecompressionStrategy {
    @Override
    public List<MultipartFile> decompression(MultipartFile file) {
        List<MultipartFile> multipartFiles = new ArrayList<>();
        try (SevenZFile sevenZFile = new SevenZFile(new SeekableInMemoryByteChannel(file.getBytes()));) {
            SevenZArchiveEntry entry;
            while ((entry = sevenZFile.getNextEntry()) != null) {
                if (!entry.isDirectory()) {
                    multipartFiles.add(convertInputStreamToMultipartFile(sevenZFile.getInputStream(entry), entry.getName()));
                }
            }
        } catch (Exception e) {
            log.error("7z文件解压失败", e);
        }
        return multipartFiles;
    }
}
```

## 5. Rar解压缩策略
```java
import com.github.junrar.Archive;
import com.github.junrar.rarfile.FileHeader;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

/**
 * @author eleven
 * @date 2025/2/7 10:19
 * @apiNote
 */
@Slf4j
public class RarDecompressionStrategy extends DecompressionStrategy{
    @Override
    public List<MultipartFile> decompression(MultipartFile file) throws Exception {
        List<MultipartFile> multipartFiles = new ArrayList<>();
        try (Archive archive = new Archive(file.getInputStream())) {
            FileHeader fileHeader = archive.nextFileHeader();
            while (fileHeader != null) {
                if (!fileHeader.isDirectory()) {
                    MultipartFile multipartFile = convertInputStreamToMultipartFile(archive.getInputStream(fileHeader), fileHeader.getFileNameString());
                    multipartFiles.add(multipartFile);
                }
                fileHeader = archive.nextFileHeader();
            }
        } catch (Exception e) {
            log.error("解压 rar 文件失败", e);
        }
        return multipartFiles;
    }
}
```
## 6. Gz解压缩策略
> 使用的是Apache Commons Compress库中的GzipCompressorInputStream类来解压缩gz文件。
> 
> 需要针对 .gz 和 .tar.gz 格式进行判断。

```java
import org.apache.commons.compress.compressors.gzip.GzipCompressorInputStream;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * @author eleven
 * @date 2025/2/7 10:21
 * @apiNote
 */
public class GzDecompressionStrategy extends DecompressionStrategy {
    private final TarDecompressionStrategy tarStrategy = new TarDecompressionStrategy();

    @Override
    public List<MultipartFile> decompression(MultipartFile file) throws Exception {
        String fileName = file.getOriginalFilename();
        if (fileName != null && fileName.endsWith(".tar.gz")) {
            return handleTarGz(file);
        } else {
            return handleGz(file);
        }
    }

    private List<MultipartFile> handleTarGz(MultipartFile file) throws Exception {
        try (InputStream inputStream = file.getInputStream();
             GzipCompressorInputStream gzIn = new GzipCompressorInputStream(inputStream);
             ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = gzIn.read(buffer)) != -1) {
                bos.write(buffer, 0, bytesRead);
            }
            byte[] tarContent = bos.toByteArray();
            try (ByteArrayInputStream bis = new ByteArrayInputStream(tarContent)) {
                // 创建一个模拟的 MultipartFile 来表示解压缩后的 tar 文件
                MultipartFile tarFile = convertInputStreamToMultipartFile(bis, removeExtension(Objects.requireNonNull(file.getOriginalFilename())));
                return tarStrategy.decompression(tarFile);
            }
        }
    }

    private List<MultipartFile> handleGz(MultipartFile file) throws Exception {
        List<MultipartFile> result = new ArrayList<>();
        try (InputStream inputStream = file.getInputStream();
             GzipCompressorInputStream gzIn = new GzipCompressorInputStream(inputStream);
             ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = gzIn.read(buffer)) != -1) {
                bos.write(buffer, 0, bytesRead);
            }
            byte[] decompressedContent = bos.toByteArray();
            try (ByteArrayInputStream bis = new ByteArrayInputStream(decompressedContent)) {
                MultipartFile multipartFile = convertInputStreamToMultipartFile(bis, removeExtension(Objects.requireNonNull(file.getOriginalFilename())));
                result.add(multipartFile);
            }
        }
        return result;
    }

    private String removeExtension(String fileName) {
        int lastIndex = fileName.lastIndexOf('.');
        return lastIndex == -1 ? fileName : fileName.substring(0, lastIndex);
    }
}
```

## 7. Tar解压缩策略
> 这个实际上是一个归档文件，不算是压缩文件

```java
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * @author eleven
 * @date 2025/2/7 10:20
 * @apiNote
 */
@Slf4j
public class TarDecompressionStrategy extends DecompressionStrategy {
    @Override
    public List<MultipartFile> decompression(MultipartFile file) throws Exception {
        List<MultipartFile> result = new ArrayList<>();
        // 实现Tar文件的解压逻辑
        try (TarArchiveInputStream tarIn = new TarArchiveInputStream(file.getInputStream())) {
            TarArchiveEntry entry;
            while ((entry = tarIn.getNextTarEntry()) != null) {
                if (!entry.isDirectory()) {
                    try (ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
                        byte[] buffer = new byte[4096];
                        int bytesRead;
                        while ((bytesRead = tarIn.read(buffer)) != -1) {
                            bos.write(buffer, 0, bytesRead);
                        }
                        try (ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray())) {
                            MultipartFile multipartFile = convertInputStreamToMultipartFile(bis, entry.getName());
                            result.add(multipartFile);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Tar文件解压失败", e);
        }
        // 将解压后的文件添加到result列表中
        return result;
    }
}
```
# 3. 创建一个工具类测试
## 1. 工具类
```java
public class DecompressionUtil {
    public static List<MultipartFile> decompression(MultipartFile file) throws Exception {
        DecompressionStrategy strategy = DecompressionStrategyContext.getStrategy(file);
        if (strategy != null) {
            return strategy.decompression(file);
        }
        throw new IllegalArgumentException("Unsupported file format");
    }

    public static void main(String[] args) {
        String path = "C:/Users/24962/Desktop/CSWL.tar.gz";
        String name = path.substring(path.lastIndexOf("/") + 1);
        try (FileInputStream fis = new FileInputStream(path)){
            List<MultipartFile> decompression = decompression(DecompressionStrategy.convertInputStreamToMultipartFile(fis, name));
            System.out.println(decompression);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
```
