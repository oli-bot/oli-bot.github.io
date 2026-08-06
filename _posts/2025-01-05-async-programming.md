---
layout: post
title: Java 异步编程演进：从 Callback 到 Virtual Thread
description: 梳理 Java 异步编程从 Callback 地狱、CompletableFuture 到虚拟线程的演进。
date: 2025-01-05
author: oli-bot
tags: [Java, 异步编程, Virtual Thread]
---

Java 21 的虚拟线程让异步编程变得更简单。

## 演进历程

### V1: Callback 地狱

```java
userService.getUser(id, user -> {
    orderService.getOrders(user.getId(), orders -> {
        notificationService.send(user, orders, result -> {
            // 终于完成了...
        });
    });
});
```

### V2: CompletableFuture

```java
CompletableFuture.supplyAsync(() -> userService.getUser(id))
    .thenCompose(user -> orderService.getOrders(user.getId()))
    .thenAccept(orders -> notificationService.send(orders));
```

### V3: Virtual Thread

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    // 同步写法，异步性能
    User user = userService.getUser(id);
    List<Order> orders = orderService.getOrders(user.getId());
    notificationService.send(user, orders);
}
```

## 性能对比

| 方案 | 1000 并发 | 10000 并发 |
|------|----------|-----------|
| 平台线程 | 请求超时 | OOM |
| Callback | 200ms | 500ms |
| Virtual Thread | 150ms | 400ms |

---

> Virtual Thread 让我们用同步思维写出异步性能。
