:::tip
解决 一对多分页 问题
:::
# 1. 工具类
> 将以前的反射获取变更为通过 lambda 函数式接口获取， 针对两种情况做了特殊处理
> 1. 能够直接通过 Lambda获取到分页值的情况， 如 Entity::getCurrent, 使用方法 `getPage`
> 2. 需要通过 page 分页对象获取到分页数据的， 如 entity.getPage().getCurrent() , 使用方法 `getPageByGetter`


```java
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.PageDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @author eleven
 * @date 2021/3/20-14:31
 * @apiNote 一对多分页工具类
 */
public class PageUtil<T> {
    public IPage<T> getPage(T t, List<T> data, Function<T, ? extends Number> currentGetter, Function<T, ? extends Number> sizeGetter) {
        long currentPage = Long.parseLong(String.valueOf(currentGetter.apply(t)));
        long pageSize = Long.parseLong(String.valueOf(sizeGetter.apply(t)));
        return pagination(data, currentPage, pageSize);
    }

    private static <T> IPage<T> pagination(List<T> data, long currentPage, long pageSize) {
        IPage<T> page = new PageDTO<>();
        long fromIndex = 0;
        //long toIndex = 10;
        long from = (currentPage - 1) * pageSize;
        fromIndex = from > data.size() ? data.size() : from;
        //toIndex = (fromIndex + pageSize) > data.size() ? data.size() : (fromIndex + pageSize);
        page.setCurrent(currentPage);
        page.setSize(pageSize);
        page.setTotal(data.size());
        List<T> records = data.stream()
                .skip(fromIndex)
                .limit(pageSize)
                .collect(Collectors.toList());
        page.setRecords(records);
        return page;
    }

    public IPage<T> getPageByGetter(T t, List<T> data, Getter<T, Long> currentGetter, Getter<T, Long> sizeGetter) {
        long currentPage = currentGetter.apply();
        long pageSize = sizeGetter.apply();
        return pagination(data, currentPage, pageSize);
    }

    @FunctionalInterface
    public interface Getter<T, R> {
        R apply();
    }
}
```
# 2. 测试类
```java
public class PageUtilTest {
    /**
     * 测试实体类，分页参数直接在实体类中能够获取到的情况，这种建议直接使用 getPage 方法
     */
    @Data
    @Accessors(chain = true)
    static class Entity1 {
        private String id;
        private Long current;
        private Long size;
    }

    @Test
    public void getPageTest() {
        // 生成100条数据
        Entity1 cr = null;
        List<Entity1> list = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            cr = new Entity1();
            cr.setId(i + "");
            list.add(cr);
        }
        // 构建查询条件
        Entity1 queryCr = new Entity1().setCurrent(10L).setSize(10L);

        // 分页查询
        PageUtil<Entity1> pageUtil = new PageUtil<>();
        IPage<Entity1> page = pageUtil.getPage(queryCr, list, Entity1::getCurrent, Entity1::getSize);
        printPage(page, Entity1::getId);
    }


    /**
     * 测试 分页条件为 Integer 类型的情况，这种建议直接使用 getPage 方法
     */
    @Data
    @Accessors(chain = true)
    static class Entity2 {
        private String id;
        private Integer current;
        private int size;
    }

    @Test
    public void getPageTest2() {
        // 生成100条数据
        Entity2 cr = null;
        List<Entity2> list = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            cr = new Entity2();
            cr.setId(i + "");
            list.add(cr);
        }
        // 构建查询条件
        Entity2 queryCr = new Entity2().setCurrent(10).setSize(10);

        // 分页查询
        PageUtil<Entity2> pageUtil = new PageUtil<>();
        IPage<Entity2> page = pageUtil.getPage(queryCr, list, Entity2::getCurrent, Entity2::getSize);
        printPage(page, Entity2::getId);
    }

    @Data
    @Accessors(chain = true)
    static class Entity3 {
        private String id;
        // mybatisPlus 分页对象 或者自定义的分页对象
        private PageDTO<Entity3> page;
    }

    @Test
    public void getterTest() {
        // 生成100条数据
        Entity3 cr = null;
        List<Entity3> list = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            cr = new Entity3();
            cr.setId(i + "");
            list.add(cr);
        }
        // 构建查询条件
        Entity3 queryCr = new Entity3();
        PageDTO<Entity3> qrPage = new PageDTO<>();
        qrPage.setCurrent(90).setSize(10);
        queryCr.setPage(qrPage);

        // 分页查询
        PageUtil<Entity3> pageUtil = new PageUtil<>();
        IPage<Entity3> page = pageUtil.getPageByGetter(queryCr, list,
                () -> queryCr.getPage().getCurrent(),
                () -> queryCr.getPage().getSize());
        printPage(page, Entity3::getId);
    }

    private <T> void printPage(IPage<T> page, Function<T, Object> mapper) {
        System.out.println("总条数：" + page.getTotal());
        System.out.println("当前页：" + page.getCurrent());
        System.out.println("每页条数：" + page.getSize());
        System.out.println("总页数：" + page.getPages());
        System.out.println("数据：" + Arrays.toString(page.getRecords().stream().map(mapper).toArray()));
    }
}
```
