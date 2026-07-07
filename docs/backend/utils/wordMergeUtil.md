:::tip
[poi-tl](https://deepoove.com/poi-tl/)是一个导出word的工具类, 相较于easy-poi来说，文档可能是更全乎一点吧。
具体的标签什么的看文档就行了，主要是一个生成多级合并表头的方法。
:::

# 1. 基础用法

## 1. 基础标签介绍

| 标签                      | 描述       | 备注                         |
|:------------------------|:---------|:---------------------------|
| <p v-pre>{{text}}</p>   | 纯文本      |                            |
| <p v-pre>{{?var}}</p>   | 循环块      | 需要配对 <p v-pre>{{/var}}</p> |
| <p v-pre>{{#table}}</p> | 纯代码拼接的表格 | 需要传入一个TableRenderData对象    |

## 2. 使用示例

> Word模板如下

<p v-pre>用户统计：共 {{userCount}}名注册用户</p>
<p v-pre>用户信息块</p>
<pre v-pre>
{{?userList}}
    姓名: {{username}}
    年龄: {{age}}
    性别: {{gender}}
    注册时间: {{registerTime}}
    联系方式如下：
    {{#userPhoneTable}}
{{/userList}}
</pre>

> 测试渲染模板方法

```java
@Slf4j
public class UserTemplateTest {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class User {
        private String username;
        private Integer age;
        private String gender;
        private String registerTime;
        private String phone;
        private String wx;
        private String email;
        private String qq;
    }


    @Test
    public void testExportUserTemplate() {

        // 2. 组装渲染数据
        Map<String, Object> data = buildRenderMap();


        // 4. 加载模板并渲染
        String templatePath = "C:\\Users\\24962\\Desktop\\dept\\user.docx";
        String outputPath = "C:\\Users\\24962\\Desktop\\dept\\user_output.docx";

        try (XWPFTemplate template = XWPFTemplate.compile(templatePath);
             FileOutputStream fos = new FileOutputStream(outputPath)) {
            template.render(data);
            // 使用原生POI清空表格首行缩进
            PoiTlUtil.clearAllTableIndent(template.getXWPFDocument());
            template.write(fos);
            log.info("导出成功，文件路径：{}", outputPath);
        } catch (Exception e) {
            log.error("导出失败：{}", e.getMessage(), e);
        }
    }

    private Map<String, Object> buildRenderMap() {
        List<User> users = buildMockUsers();
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("userCount", users.size());
        resultMap.put("userList", buildUserList(users));
        return resultMap;
    }

    private List<Map<String, Object>> buildUserList(List<User> users) {
        List<Map<String, Object>> resultList = new ArrayList<>();
        Map<String, Object> userMap;
        for (User user : users) {
            userMap = new HashMap<>();
            userMap.put("username", user.getUsername());
            userMap.put("age", user.getAge());
            userMap.put("gender", user.getGender());
            userMap.put("registerTime", user.getRegisterTime());
            userMap.put("userPhoneTable", buildUserPhoneTable(user));
            resultList.add(userMap);
        }
        return resultList;
    }

    private TableRenderData buildUserPhoneTable(User user) {
        RowRenderData tableRow = PoiTlUtil.buildRowRenderDataByArr("手机号", "微信", "邮箱", "QQ");
        RowRenderData mockUserRows = PoiTlUtil.buildRowRenderDataByArr(user.getPhone(), user.getWx(), user.getEmail(), user.getQq());
        TableRenderData tableRenderData = Tables.of(tableRow, mockUserRows).create();
        // 设置表格内文字首行无缩进
        PoiTlUtil.setTableAllCellNoIndentLeft(tableRenderData);
        return tableRenderData;
    }

    private List<User> buildMockUsers() {
        List<User> userList = new ArrayList<>();
        userList.add(new User("张三", 20, "男", "2023-01-01", "13800000000", "123456", "zhangsan@example.com", "123456"));
        userList.add(new User("李四", 21, "女", "2023-01-02", "13800000001", "123457", "lisi@example.com", "123457"));
        userList.add(new User("王五", 22, "男", "2023-01-03", "13800000002", "123458", "wangwu@example.com", "123458"));
        return userList;
    }
}
```

> 消除表格文字首行缩进工具类

```java
import com.deepoove.poi.data.*;
import com.deepoove.poi.data.style.ParagraphStyle;
import org.apache.poi.xwpf.usermodel.*;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTInd;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTP;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTPPr;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author eleven
 * @since 2026/7/2 18:30
 */
public class PoiTlUtil {
    /**
     * 段落样式 首行无缩进 无边距
     */
    private static final ParagraphStyle LEFT_NO_INDENT_STYLE = ParagraphStyle.builder()
            .withAlign(ParagraphAlignment.LEFT)
            .withIndentFirstLineChars(0) // 取消字符首行缩进（核心）
            .withIndentLeftChars(0)    //  整体段落左边距 0
            .build();

    /**
     * 设置word表格无首行缩进
     * @param tableRenderData   表格数据
     */
    public static void setTableAllCellNoIndentLeft(TableRenderData tableRenderData) {

        // 遍历所有行（表头+数据行）
        List<RowRenderData> rows = tableRenderData.getRows();
        for (RowRenderData row : rows) {
            List<CellRenderData> cells = row.getCells();
            for (CellRenderData cell : cells) {
                // 单元格内所有段落统一替换样式
                List<ParagraphRenderData> paragraphs = cell.getParagraphs();
                for (ParagraphRenderData para : paragraphs) {
                    para.setParagraphStyle(LEFT_NO_INDENT_STYLE);
                }
            }
        }
    }

    public static RowRenderData buildRowRenderData(List<String> list) {
        return buildRowRenderDataByArr(list.toArray(new String[]{}));
    }

    public static RowRenderData buildRowRenderDataByArr(String... arr) {
        //return Rows.of(arr).horizontalCenter().center().create();
        return buildRowRenderDataByArr2(arr);
    }
    // 通用构建无缩进单元格工具
    public static CellRenderData buildNoIndentCell(String text) {
        ParagraphRenderData para = new ParagraphRenderData().addText(text);
        para.setParagraphStyle(LEFT_NO_INDENT_STYLE);
        return Cells.of().addParagraph(para).create();
    }

    // 改造表头构建方法
    private static RowRenderData buildRowRenderDataByArr2(String... texts) {
        List<CellRenderData> cells = new ArrayList<>();
        for (String text : texts) {
            cells.add(buildNoIndentCell(text));
        }
        return Rows.of(cells.toArray(new CellRenderData[]{})).create();
    }


    /**
     * 原生POI强制清除文档内所有表格单元格段落首行缩进、整体左缩进
     * @param document poi-tl编译后得到的XWPFDocument
     */
    public static void clearAllTableIndent(XWPFDocument document) {
        // 遍历文档内全部表格
        for (XWPFTable table : document.getTables()) {
            for (XWPFTableRow row : table.getRows()) {
                for (XWPFTableCell cell : row.getTableCells()) {
                    // 单元格内所有段落统一重置
                    for (XWPFParagraph paragraph : cell.getParagraphs()) {
                        // 强制左对齐
                        paragraph.setAlignment(ParagraphAlignment.LEFT);
                        CTP ctp = paragraph.getCTP();
                        CTPPr ppr = ctp.getPPr() == null ? ctp.addNewPPr() : ctp.getPPr();
                        CTInd indent = ppr.isSetInd() ? ppr.getInd() : ppr.addNewInd();
                        // 首行缩进置0（消除2字符缩进）
                        indent.setFirstLine(BigInteger.ZERO);
                        // 段落整体左侧缩进置0
                        indent.setLeft(BigInteger.ZERO);
                    }
                }
            }
        }
    }
}

```

# 2. 全代码生成动态表头

<table>
  <tr>
    <th rowspan="2">姓名</th>
    <th rowspan="2">年龄</th>
    <th colspan="3">联系方式</th>
    <th rowspan="2">性别</th>
    <th rowspan="2">注册时间</th>
  </tr>
  <tr>
    <th>QQ</th>
    <th>微信</th>
    <th>邮箱</th>
  </tr>
</table>

> <p v-pre>word里边写一个{{#userHeader }}标签用来占位就行</p>

```java
import com.deepoove.poi.XWPFTemplate;
import com.deepoove.poi.data.*;
import com.deepoove.poi.data.MergeCellRule.Grid;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * 使用 poi-tl {@link Tables#of} + {@link Tables.TableBuilder#mergeRule} 生成用户固定表头。
 *
 * <pre>
 * 表头结构（2行 × 7列）：
 * ┌──────┬──────┬───────────────┬──────┬──────────┐
 * │ 姓名 │ 年龄 │  联系方式      │ 性别 │ 注册时间  │
 * │      │      ├────┬────┬────┤      │          │
 * │      │      │ qq │微信│邮箱│      │          │
 * └──────┴──────┴────┴────┴────┴──────┴──────────┘
 * </pre>
 *
 * @author eleven
 * @since 2026/7/7
 */
public class UserFixedHeadUtil {

    public static void main(String[] args) throws Exception {
        String outputPath = "userFixedHead.docx";
        String templatePath = "userFixedHeadTemplate.docx";

        // 1. 构建合并规则
        MergeCellRule mergeRule = MergeCellRule.builder()
                // "联系方式" 横向合并 cols 2→4（行0）
                .map(Grid.of(0, 2), Grid.of(0, 4))
                // 左侧列纵向合并（行0→1）
                .map(Grid.of(0, 0), Grid.of(1, 0))  // 姓名
                .map(Grid.of(0, 1), Grid.of(1, 1))  // 年龄
                // 右侧列纵向合并（行0→1）
                .map(Grid.of(0, 5), Grid.of(1, 5))  // 性别
                .map(Grid.of(0, 6), Grid.of(1, 6))  // 注册时间
                .build();

        // 2. 构建表头数据行
        //  行0: 主表头，cols 3~4 为 null（被横向合并覆盖）
        RowRenderData row0 = Rows.of(
                "姓名", "年龄",
                "联系方式", null, null,
                "性别", "注册时间"
        ).center().textBold().create();

        //  行1: 子表头，纵向合并的列填 null
        RowRenderData row1 = Rows.of(
                null, null,
                "qq", "微信", "邮箱",
                null, null
        ).center().textBold().create();

        // 3. 构建表格（注入合并规则）
        TableRenderData headerTable = Tables.of(row0, row1)
                .mergeRule(mergeRule)
                .create();
        Map<String, Object> map = new HashMap<>();
        map.put("userHeader", headerTable);
        try (FileInputStream fis = new FileInputStream(templatePath);
             XWPFTemplate doc = XWPFTemplate.compile(fis);
             FileOutputStream fos = new FileOutputStream(outputPath)) {
            doc.render(map);
            doc.write(fos);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("已生成: " + outputPath);
    }
}
```

# 3. 固定表头根据数据生成表格

> 这种固定表头的就有意思了，需要把循环标签写到循环数据的上一行，有这种合并单元格的写在拆分的上一行。
> word里边就写成下边的表格这样就行了。

<table>
  <tr>
    <th rowspan="2">姓名</th>
    <th rowspan="2">年龄</th>
    <th colspan="3">联系方式</th>
    <th rowspan="2">性别</th>
    <th rowspan="2">注册时间</th>
  </tr>
  <tr>
    <th>QQ</th>
    <th>微信</th>
    <th>邮箱 {{userList}}</th>
  </tr>
<tr>
    <th rowspan="2">[name]</th>
    <th rowspan="2">[age]</th>
    <th colspan="1">[qq]</th>
    <th colspan="1">[wx]</th>
    <th colspan="1">[email]</th>
    <th rowspan="2">[age]</th>
    <th rowspan="2">[regTime]</th>
  </tr>
</table>

> 针对这个表格呢，进行渲染表格的时候就有些不一样了，需要在compile的时候指定config配置

```java
import com.deepoove.poi.XWPFTemplate;
import com.deepoove.poi.config.Configure;
import com.deepoove.poi.plugin.table.LoopRowTableRenderPolicy;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.junit.jupiter.api.Test;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserReportTest {
    @Test
    public void userReportTest() {
        try {
            // 1. 组装业务数据
            List<User> userList = getUserList();

            // 2. 封装模板参数，key 必须和模板 {{userList}} 一致
            Map<String, Object> renderData = new HashMap<>();
            renderData.put("userList", userList);

            // 3. 加载模板并渲染导出
            Map<String, Object> map = new HashMap<>();
            try (FileInputStream fis = new FileInputStream("user_template_hackloop.docx");
                 FileOutputStream fos = new FileOutputStream("output3.docx")) {
                LoopRowTableRenderPolicy policy = new LoopRowTableRenderPolicy();
                Configure config = Configure.builder()
                        .bind("userList", policy)
                        .build();
                XWPFTemplate doc = XWPFTemplate.compile(fis, config);
                map.put("userList", getUserList());
                doc.render(map);
                doc.write(fos);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private List<User> getUserList() {
        List<User> userList = new ArrayList<>();
        return userList;
    }

}

```