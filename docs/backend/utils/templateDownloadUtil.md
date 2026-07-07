:::tip
基于 poi 的一个excel导出工具类，如果是要导出的excel里边有从数据库查询出来的下拉列表，
需要做动态下拉，甚至是二级 三级下拉的话，可以考虑用这个工具类。
:::

# 1. 相关工具类
## 1. 表头相关工具类
> 用来写写表头文字，还有就是对应每一列的值怎么从实体类获取也就是对应的getter 

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@Accessors(chain = true)
public class ExcelHeaderVo<T> {
    /**
     * 单元格列索引
     */
    private Integer cellIndex;
    /**
     * 表头文本
     */
    private String headerText;
    /**
     * 从实体类获取值的getter
     */
    private Function<T, ?> getter;
}
```
## 2. 隐藏sheet页实体类
> 往隐藏的sheet页添加数据，写入的数据用来给下拉的表格列做数据支撑。
> 写入的顺序由添加的`mapperList`的顺序决定

```java 
@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class HiddenSheetVo<T> {
    /**
     * sheet名称
     */
    private String sheetName;
    /**
     * 写入的数据列表
     */
    private List<T> dataList;
    /**
     * 从实体类获取值的getter列表
     */
    private List<Function<T, ?>> mapperList;

    @SafeVarargs
    public final HiddenSheetVo<T> setMapperList(Function<T, ?>... mapperList) {
        if (mapperList == null || mapperList.length <= 0) {
            throw new IllegalArgumentException(StrUtil.format("{} sheet设置getter失败", sheetName));

        }
        this.mapperList = Arrays.asList(mapperList);
        return this;
    }
}
```

## 3. Excel公式

```java 
@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class ExcelFormula {
    // 第几列
    private Integer cellIndex;
    // 公式
    private String formulaStr;
    // 是否是公式
    private Boolean byFormula;
    // 确定的数据
    private List<String> dataList;
    // 获取数据的列 导入的时候直接获取这一列的值就行了
    // 不需要再次从数据库字典项获取id code之类的了
    private Integer simpleCellIndex;
    // 简易的表头
    private String simpleHeader;
    // 名称管理器
    private String nameManager;
    // 简单列获取公式 
    private String simpleCellFormula;
    // 隐藏列从名称管理器中获取的列
    private Integer simpleCellDataCell;
    // 特殊的公式，如果没有特殊要求的话，就用通用公式了
    private String specialCellFormula;

    public String getSimpleCellFormula() {
        String commonFormula = "IF(INDIRECT(\"{}\"&ROW())=\"\",\"\",IFERROR(VLOOKUP(INDIRECT(\"{}\"&ROW()),{},{},FALSE),\"\"))";
        String indexLetter = TemplateUtil.getLetterByIndex(getCellIndex(), true);
        if (StrUtil.isBlank(getNameManager())) {
            throw new IllegalArgumentException("隐藏列名称管理器不能为空");
        }
        if (simpleCellDataCell == null) {
            throw new IllegalArgumentException("隐藏列从名称管理器中获取的列不能为空");
        }
        return StrUtil.format(commonFormula, indexLetter, indexLetter, getNameManager(), getSimpleCellDataCell());
    }

```
## 4. TemplateUtil工具类
> 真正的工具类，所有的模板，数据导出都可以直接用这个方法

```java 
@Slf4j
public class TemplateUtil {

    private static final int TEMPLATE_ROW = 1000;
    private static final int WIDTH_RATE = 5;

    /**
     * 设置 xlsx 的响应头
     *
     * @param response 客户端响应
     * @param fileName 文件名（支持中文，自动转 UTF-8 编码）
     */
    public static void setResponseHeader(HttpServletResponse response, String fileName) {
        try {
            response.setHeader("Content-Disposition", "attachment;fileName=" + URLEncoder.encode(fileName, "UTF-8"));
            response.setContentType("application/vnd.ms-excel");
        } catch (Exception e) {
            log.error("设置响应头出错 {}", e.getMessage(), e);
        }
    }

    /**
     * 设置响应头
     *
     * @param response   客户端响应
     * @param fileName   文件名称
     * @param addTimeStr 是否添加时间字符串
     */
    public static void setResponseHeader(HttpServletResponse response, String fileName, Boolean addTimeStr) {
        if (addTimeStr) {
            String[] split = fileName.split("\\.");
            fileName = StrUtil.format("{}_{}.{}",
                    split[0],
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")),
                    split[1]);
        }
        setResponseHeader(response, fileName);
    }

    /**
     * 写入隐藏列并设置名称管理器
     *
     * @param workbook   工作薄
     * @param sheetName  隐藏sheet页名称
     * @param dataList   隐藏sheet页要导入的数据
     * @param mapperList 获取值的mapper
     */
    @SafeVarargs
    public static <T, R> void writeHiddenSheet(Workbook workbook, String sheetName,
                                               List<T> dataList, Function<T, R>... mapperList) {
        writeHiddenSheet(workbook, sheetName, dataList, Arrays.asList(mapperList));
    }

    /**
     * 写入隐藏列兵设置名称管理器
     *
     * @param workbook   工作簿
     * @param sheetName  sheet名称
     * @param dataList   数据集合
     * @param mapperList 获取数据集合的get方法
     * @param <T>        数据泛型
     * @param <?>        getter获取到的类型
     */
    public static <T> void writeHiddenSheet(Workbook workbook, String sheetName,
                                               List<T> dataList, List<Function<T, ?>> mapperList) {
        if (CollUtil.isEmpty(dataList)) {
            return;
        }
        String nameMangerName = getSheetNameManagerName(sheetName);
        // 创建sheet页
        Sheet sheet = workbook.createSheet(sheetName);
        // 将当前的sheet
        workbook.setSheetHidden(workbook.getSheetIndex(sheet), true);
        Row row;
        Function<T, ?> mapper;
        T data;
        for (int rowIndex = 0; rowIndex < dataList.size(); rowIndex++) {
            row = sheet.createRow(rowIndex);
            data = dataList.get(rowIndex);
            for (int cellIndex = 0; cellIndex < mapperList.size(); cellIndex++) {
                mapper = mapperList.get(cellIndex);
                row.createCell(cellIndex).setCellValue(String.valueOf(mapper.apply(data)));
            }
        }
        createNameManager(workbook, nameMangerName, StrUtil.format("{}!$A$1:${}${}",
                sheetName,
                calcCellLetter(mapperList.size()),
                dataList.size()));
        sheet.protectSheet("protected");
    }


    public static void writeHiddenSheets(Workbook workbook, List<HiddenSheetVo> hiddenSheetVoList) {
        if (CollUtil.isNotEmpty(hiddenSheetVoList)) {
            hiddenSheetVoList.forEach(item -> {
                writeHiddenSheet(workbook,
                        item.getSheetName(),
                        item.getDataList(),
                        item.getMapperList());
            });
        }
    }

    public static void writeHiddenSheets(Workbook workbook, HiddenSheetVo... hiddenSheetVoList) {
        writeHiddenSheets(workbook, Arrays.asList(hiddenSheetVoList));
    }

    /**
     * 创建名称管理器
     *
     * @param workbook  工作簿
     * @param nameName  名称管理器名称
     * @param reference 数据引用范围
     */
    private static void createNameManager(Workbook workbook, String nameName, String reference) {
        if (workbook instanceof XSSFWorkbook) {
            XSSFName name = ((XSSFWorkbook) workbook).createName();
            name.setNameName(nameName);
            name.setRefersToFormula(reference);
        }
    }

    /**
     * 根据传入的数字，计算 Excel 列字母
     * eg: 1 → A, 26 → Z, 27 → AA, 30 → AD
     *
     * @param count 列序号（从 1 开始）
     * @return Excel 列字母
     */
    private static String calcCellLetter(Integer count) {
        if (count == null || count <= 0) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        while (count > 0) {
            count--;
            sb.insert(0, (char) ('A' + count % 26));
            count /= 26;
        }
        return sb.toString();
    }

    /**
     * 创建sheet并且写入表头
     *
     * @param workbook  工作薄
     * @param sheetName sheetName
     * @param header    表头
     * @return {@link  Sheet} sheet表格
     */
    public static Sheet createSheetAndSetHeaders(Workbook workbook, String sheetName, List<String> header) {
        Sheet sheet = workbook.createSheet(sheetName);
        Row row = sheet.createRow(0);
        IntStream.range(0, header.size()).forEach(i -> row.createCell(i).setCellValue(header.get(i)));
        return sheet;
    }

    public static String getSheetNameManagerName(String sheetName) {
        return StrUtil.format("{}{}", sheetName, "Name");
    }

    /**
     * 写入导出数据
     *
     * @param workbook          工作簿
     * @param sheetName         sheet名称
     * @param excelHeaderVoList 表头
     * @param dataList          数据
     * @param excelFormulaList  公式集合
     * @param <T>               导出泛型
     */
    public static <T> void writeDataSheet(Workbook workbook, String sheetName,
                                          List<ExcelHeaderVo<T>> excelHeaderVoList,
                                          List<T> dataList,
                                          List<ExcelFormula> excelFormulaList) {
        Sheet sheet = workbook.createSheet(sheetName);
        Row headerRow = sheet.createRow(0);
        Map<Integer, ExcelFormula> excelFormulaMap = new HashMap<>();
        List<String> headerList = excelHeaderVoList.stream()
                .map(ExcelHeaderVo::getHeaderText)
                .collect(Collectors.toList());
        Map<Integer, ExcelHeaderVo<T>> getterMap = excelHeaderVoList.stream()
                .collect(Collectors.toMap(ExcelHeaderVo::getCellIndex, Function.identity()));
        if (CollUtil.isNotEmpty(excelFormulaList)) {
            List<String> simpleHeaders = excelFormulaList.stream()
                    .map(ExcelFormula::getSimpleHeader)
                    .filter(StrUtil::isNotBlank)
                    .collect(Collectors.toList());
            if (CollUtil.isNotEmpty(simpleHeaders)) {
                headerList.addAll(simpleHeaders);
            }
            excelFormulaMap = excelFormulaList.stream()
                    .collect(Collectors.toMap(ExcelFormula::getCellIndex, Function.identity()));
        }
        for (int i = 0; i < headerList.size(); i++) {
            headerRow.createCell(i).setCellValue(headerList.get(i));
        }
        XSSFDataValidationHelper dvHelper = new XSSFDataValidationHelper((XSSFSheet) sheet);
        int rowIndex = 1;
        Row row;
        Cell cell;
        T data = null;
        Object apply;
        int templateEndRow = CollUtil.isNotEmpty(dataList) ? dataList.size() : TEMPLATE_ROW;
        Map<Integer, ExcelFormula> simpleCellExcelFormulaMap = excelFormulaList.stream()
                .collect(Collectors.toMap(ExcelFormula::getSimpleCellIndex, Function.identity()));
        for (int i = 0; i < templateEndRow; i++) {
            row = sheet.createRow(rowIndex++);
            if (i < dataList.size()) {
                data = dataList.get(i);
            }
            for (int cellIndex = 0; cellIndex < headerList.size(); cellIndex++) {
                cell = row.createCell(cellIndex);
                if (getterMap.containsKey(cellIndex) && data != null) {
                    apply = getterMap.get(cellIndex).getGetter().apply(data);
                    cell.setCellValue(Objects.nonNull(apply) ?
                            String.valueOf(apply) : "");
                }
                if (simpleCellExcelFormulaMap.containsKey(cellIndex)) {
                    cell.setCellFormula(simpleCellExcelFormulaMap.get(cellIndex).getSimpleCellFormula());
                }
            }
        }
        // 设置自适应宽度
        for (int cellIndex = 0; cellIndex < headerList.size(); cellIndex++) {
            // 风险后果长度变更多一些
            int columnWidth = headerList.get(cellIndex).length() * WIDTH_RATE * 256;
            columnWidth = Math.max(columnWidth, WIDTH_RATE * 256);
            sheet.setColumnWidth(cellIndex, columnWidth);
        }
        // 设置公式下拉
        ExcelFormula excelFormula;
        CellRangeAddressList nameManagerRange;
        String dropdownFormula;
        XSSFDataValidationConstraint nameManagerConstraint;
        DataValidationConstraint listConstraint;
        CellRangeAddressList listRange;
        XSSFDataValidation nameManagerValidation;
        DataValidation listValidation;
        for (Integer formulaIndex : excelFormulaMap.keySet()) {
            excelFormula = excelFormulaMap.get(formulaIndex);
            // 如果是从公式获取呢就写入公式
            if (excelFormula.getByFormula()) {
                nameManagerRange = new CellRangeAddressList(1, templateEndRow,
                        excelFormula.getCellIndex(), excelFormula.getCellIndex());
                dropdownFormula = excelFormula.getFormulaStr();
                nameManagerConstraint = (XSSFDataValidationConstraint) dvHelper.createFormulaListConstraint(dropdownFormula);
                nameManagerValidation = (XSSFDataValidation) dvHelper.createValidation(nameManagerConstraint, nameManagerRange);
                nameManagerValidation.setSuppressDropDownArrow(true);
                nameManagerValidation.setShowErrorBox(true);
                nameManagerValidation.setErrorStyle(DataValidation.ErrorStyle.STOP);
                nameManagerValidation.createErrorBox("输入错误", "请从下拉列表中选择数据，不要手动输入");
                sheet.addValidationData(nameManagerValidation);
            } else {
                // 从数据中写入数据
                listConstraint = dvHelper.createExplicitListConstraint(excelFormula.getDataList().toArray(new String[]{}));
                listRange = new CellRangeAddressList(1, templateEndRow, excelFormula.getCellIndex(), excelFormula.getCellIndex());
                listValidation = dvHelper.createValidation(listConstraint, listRange);
                // 弹窗提示、禁止输入非法值
                listValidation.setShowErrorBox(true);
                listValidation.setShowPromptBox(true);
                sheet.addValidationData(listValidation);
            }
        }

        // 设置列隐藏
        if (CollUtil.isNotEmpty(excelFormulaList)) {
            for (ExcelFormula formula : excelFormulaList) {
                if (formula.getSimpleCellIndex() != null) {
                    sheet.setColumnHidden(formula.getSimpleCellIndex(), true);
                }
            }
        }
        // 计算公式强制计算
        FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();
        evaluator.evaluateAll();

    }

    /**
     * 根据数组下标(从0开始)获取Excel列字母
     * 例：0→A，25→Z，26→AA，51→AZ，52→BA
     *
     * @param index    数组下标(从0开始)
     * @param plusFlag 是否加1
     * @return Excel列名
     */
    public static String getLetterByIndex(Integer index, Boolean plusFlag) {
        if (index == null || index < 0) {
            throw new IllegalArgumentException("下标不能为负数或空");
        }

        // Excel列是从1开始计数，先转为1起始
        int num = plusFlag ? index + 1 : index;
        StringBuilder sb = new StringBuilder();

        while (num > 0) {
            // 取余，映射 A-Z
            int remainder = (num - 1) % 26;
            sb.append((char) ('A' + remainder));
            // 进位，减1消除无0进制问题
            num = (num - 1) / 26;
        }

        // 逆序拼接结果
        return sb.reverse().toString();
    }


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InnerDict {
        private String code;
        private String name;

        public List<InnerDict> trueAndFalseList() {
            return Arrays.asList(
                    new InnerDict("1", "是"),
                    new InnerDict("0", "否")
            );
        }
    }
}

```

# 2. 使用工具类
## 1. 导出模板和导出数据
```java
// 导出数据库数据到excel
public void export2Excel(HttpServletResponse response) {
    TemplateUtil.setResponseHeader(response, "测试导出数据.xlsx", true);
    List<ExcelHeaderVo<Goods>> excelHeaderVos = excelHeaderList();
    downloadExcel(response, goodsMapper.allGoods(), excelHeaderVos);
}

// 下载导出模板 
public void downloadTemplate(HttpServletResponse response) {
    TemplateUtil.setResponseHeader(response, "测试导入模板.xlsx");
    downloadExcel(response, new ArrayList<>(), excelHeaderList());
}
```
> 主要的方法 `downloadExcel`如下，可以做到模板和数据库数据一块导出的，模板下载的数据填空数据就可以了。

```java
/**
 * 下载excel
 *
 * @param response        客户端响应
 * @param dataList        数据集合
 * @param excelHeaderList excel表头
 */
private void downloadExcel(HttpServletResponse response, List<Goods> dataList, List<ExcelHeaderVo<Goods>> excelHeaderList) {
    try (ServletOutputStream outputStream = response.getOutputStream();
         Workbook workbook = new XSSFWorkbook();) {
         // 商品分类隐藏sheet
        String categoryTypeSheetName = "category";
        String categoryTypeSheetNameManager = TemplateUtil.getSheetNameManagerName(categoryTypeSheetName);
        // 商品单位隐藏sheet
        String unitSheetName = "unit";
        String unitSheetNameManager = TemplateUtil.getSheetNameManagerName(unitSheetName);
        // 设置隐藏sheet页面
        TemplateUtil.writeHiddenSheets(workbook,
                // 写入商品分类隐藏sheet数据
                new HiddenSheetVo<GoodsCategory>()
                        .setSheetName(categoryTypeSheetName)
                        .setDataList(goodsCategoryMapper.allCategory())
                        .setMapperList(GoodsCategory::getName, GoodsCategory::getId),
                // 写入商品单位字典项        
                new HiddenSheetVo<SysDict>()
                        .setSheetName(unitSheetName)
                        .setDataList(getDictList(DictTypeConsts.GOODS_UNIT))
                        .setMapperList(SysDict::getName, SysDict::getCode)
        );
        // 设置下拉获取公式
        List<ExcelFormula> excelFormulaList = Stream.of(
                new ExcelFormula()
                        .setCellIndex(1)
                        .setByFormula(true)
                        .setNameManager(categoryTypeSheetName)
                        // excel固定公式 从名称管理器中取数据
                        // INDEX(categoryTypeSheetName, 0, 1)
                        // INDEX() excel函数
                        // categoryTypeSheetName 名称管理器名称
                        // 0 可填空，写0代表从整个名称管理器索引数据中获取数据
                        // 1 从第几列获取数据， 这个是从1开始的，不是从0开始的
                        // 以上公式等价于 INDEX(categoryTypeSheetName, , 1)
                        .setFormulaStr(StrUtil.format("INDEX({},0,1)", categoryTypeSheetName))
                        .setSimpleCellIndex(excelHeaderList.size())
                        .setSimpleHeader("商品分类id")
                        // 从名称管理器的第几列获取数据 比如这个商品分类的第一列是名称 第二列就是id
                        // 当前的默认公式规则是 
                        // 1. 先从当前的cellIndex获取值，
                        // 2. 根据第一步获取的值去 categoryTypeSheetName 这个名称管理器获取 第 simpleCellDataCell列的值
                        // 3. 将第二步的值写入到simpleCellIndex这一列
                        .setSimpleCellDataCell(2)
                       
                ,
                new ExcelFormula()
                        .setCellIndex(2)
                        .setByFormula(true)
                        .setNameManager(unitSheetName)
                        .setFormulaStr(StrUtil.format("INDEX({},0,1)", unitSheetName))
                        .setSimpleCellIndex(excelHeaderList.size() + 1)
                        .setSimpleHeader("商品单位字典Code")
                        .setSimpleCellDataCell(2)
        ).collect(Collectors.toList());

        // 写入数据
        TemplateUtil.writeDataSheet(
                workbook,
                "测试商品",
                excelHeaderList,
                dataList,
                excelFormulaList
        );

        workbook.write(outputStream);
    } catch (Exception e) {
        log.info("下载导入模板失败 {}", e.getMessage(), e);
    }
}
/**
 * 获取表头
 *
 * @return
 */
private List<ExcelHeaderVo<Goods>> excelHeaderList() {
    return Stream.of(
            new ExcelHeaderVo<>(0, "商品名称", Goods::getName),
            new ExcelHeaderVo<>(1, "商品分类", Goods::getCategoryStr),
            new ExcelHeaderVo<>(2, "单位", Goods::getUnit),
            new ExcelHeaderVo<>(3, "单价", Goods::getPreice),
            new ExcelHeaderVo<>(4, "备注", Goods::getRemark)
    ).collect(Collectors.toList());
} 
```