:::tip
[之前写的TreeMenuUtil](https://juejin.cn/post/7087400204319588382),之前用反射写的，这次稍微换了换，总的来说还是换汤不换药吧
1. TreeUtil 使用了`stream().filter()`
2. TreeMenuUtil 使用了`stream().collect(Collectors.groupingBy)` 优化获取子节点的方法
:::

# 1. TreeUtil
> 内部判断是否属于root节点使用的是`stream().filter()`
## 1. 工具类
```java
import cn.hutool.core.collection.CollUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * @author eleven
 * @date 2025/1/7 14:47
 * @apiNote 工具类用于将包含父子关系信息的扁平列表转换为树形结构
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class TreeUtil<T> {
    /**
     * 要转化成树状结构的集合
     */
    private List<T> list;

    /**
     * 用于从T类型对象中提取标识节点自身的id的函数，
     */
    private Function<T, ?> idGetter;
    /**
     * 用于从T类型对象中提取标识父节点的parentId的函数
     */
    private Function<T, ?> parentIdGetter;
    /**
     * 用于筛选根节点的条件谓词
     */
    private Predicate<? super T> rootNodeFilter;
    /**
     * 用于设置子节点的方法名
     */
    private String childrenSetter;


    /**
     * 将扁平列表转换为树形结构的主方法
     *
     * @return 转换后的树形结构的根节点列表
     */
    public List<T> list2Tree() {
        // 先找出所有的根节点
        List<T> rootNode = rootNode(list, rootNodeFilter);
        list.removeAll(rootNode);
        // 遍历根节点，为每个根节点设置子节点，构建完整树形结构
        rootNode.forEach(root -> setChildren(root, list));
        return rootNode;
    }

    private void setChildren(T root, List<T> list) {
        List<T> children = list.stream()
                .filter(node -> parentIdGetter.apply(node).equals(idGetter.apply(root)))
                .collect(Collectors.toList());
        if (CollUtil.isNotEmpty(children)) {
            list.removeAll(children);
            try {
                root.getClass()
                        .getMethod(childrenSetter, List.class)
                        .invoke(root, children);
            } catch (Exception e) {
                e.printStackTrace();
            }
            children.forEach(child -> setChildren(child, list));
        }

    }

    /**
     * 根据条件筛选出根节点列表
     *
     * @param list      包含所有节点的扁平列表
     * @param predicate 用于筛选根节点的条件谓词
     * @return 根节点列表
     */
    private static <T> List<T> rootNode(List<T> list, Predicate<? super T> predicate) {
        return list.stream()
                .filter(predicate)
                .collect(Collectors.toList());
    }
}
```

## 2. 使用
```java
List<CollectCategory> list = categoryMapper.list(category);
return new TreeUtil<CollectCategory>()
        // 需要转换的集合
        .setList(list)
        // 获取id的方法
        .setIdGetter(CollectCategory::getId)
        // 获取parentId的方法
        .setParentIdGetter(CollectCategory::getParentId)
        // 筛选顶层节点的filter
        .setRootNodeFilter(item -> StrUtil.equalsIgnoreCase("0", item.getParentId()))
        // 设置chidren属性的方法名
        .setChildrenSetter("setChildren")
        // 转换方法
        .list2Tree();
```
# 2. TreeMenuUtil
> 第一次使用的时候按照parentId直接分组，不用每次都遍历list了，使用的是`stream().collect(Collectors.groupingBy)`

## 1. 工具类
```
import cn.hutool.core.collection.CollUtil;
import lombok.Builder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * @author eleven
 * @date 2025/1/7 16:50
 * @apiNote
 */
@Builder
public class TreeMenuUtil<T> {
    /**
     * 要转化成树状结构的集合
     */
    private List<T> list;

    /**
     * 用于从T类型对象中提取标识节点自身的id的函数，
     */
    private Function<T, ?> idGetter;
    /**
     * 用于从T类型对象中提取标识父节点的parentId的函数
     */
    private Function<T, ?> parentIdGetter;
    /**
     * 用于筛选根节点的条件谓词
     */
    private Predicate<? super T> rootNodeFilter;
    /**
     * 用于设置子节点的方法名
     */
    private String childrenSetter;

    private Object rootParentId;

    public List<T> list2Tree() {
        List<T> rootNodes = new ArrayList<>();
        if (rootParentId == null) {
            rootNodes = list.stream()
                    .filter(item -> Objects.isNull(parentIdGetter.apply(item)))
                    .collect(Collectors.toList());
        }
        Map<?, List<T>> listMap = list.stream()
                .filter(item -> !Objects.isNull(parentIdGetter.apply(item)))
                .collect(Collectors.groupingBy(parentIdGetter));
        if (CollUtil.isEmpty(rootNodes)) {
            rootNodes = listMap.get(rootParentId);
        }
        if (CollUtil.isEmpty(rootNodes)) {
            // 自行处理一下没有根节点的情况，这里直接返回原数组了
            return list;
        }
        rootNodes.forEach(root -> setChildren(root, listMap));
        return rootNodes;
    }

    /**
     * @param parent  根节点
     * @param listMap 包含所有节点的Map
     */
    private void setChildren(T parent, Map<?, List<T>> listMap) {
        Object parentId = idGetter.apply(parent);
        List<T> children = listMap.get(parentId);
        if (CollUtil.isNotEmpty(children)) {
            try {
                parent.getClass()
                        .getMethod(childrenSetter, List.class)
                        .invoke(parent, children);
            } catch (Exception e) {
                e.printStackTrace();
            }
            children.forEach(child -> setChildren(child, listMap));
        }
    }
}
```

## 2. 使用
```
return TreeMenuUtil.<CollectCategory>builder()
                .list(list)
                .idGetter(CollectCategory::getId)
                .parentIdGetter(CollectCategory::getParentId)
                .rootParentId(category.getRootParentId())
                .childrenSetter("setChildren")
                .build()
                .list2Tree();
```
