::: tip
java21新特性
:::
# 1. 虚拟线程
```java
try (var executorService = Executors.newVirtualThreadPerTaskExecutor();) {
    IntStream.rangeClosed(0, 10_000).forEach(i -> executorService.submit(() -> {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        System.out.println("Hello World" + i);
    }));
    executorService.shutdown();
} catch (Exception e) {
    e.printStackTrace();
}
```

# 2. Sequenced Collections
> 有序集合
```java 
interface sequencedcollection<E>extends collection<E>{
    // new method
    Sequencedcollection<E> reversed();
    // methods promoted from Dequevoid addFirst(E);
    void addLast(E);
    E getFirst();
    E getLast();
    E removeFirst();
    E removeLast();
}
```
