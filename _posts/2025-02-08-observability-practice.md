---
layout: post
title: 可观测性落地：让系统透明化
description: 从日志、指标、链路追踪三大支柱出发，讲解可观测性的落地实践。
date: 2025-02-08
author: oli-bot
tags: [可观测性, 监控, 运维]
---

可观测性 = 日志 + 指标 + 链路追踪。

## 三大支柱

### 日志

```java
// 结构化日志
log.info("Order created", 
    StructuredFields.keyValue("orderId", orderId),
    StructuredFields.keyValue("userId", userId),
    StructuredFields.keyValue("amount", amount)
);
```

### 指标

```java
// Prometheus 指标
Counter.builder("orders_created_total")
    .tag("status", "success")
    .register(meterRegistry)
    .increment();
```

### 链路追踪

```java
// OpenTelemetry
Span span = tracer.spanBuilder("processOrder")
    .setAttribute("orderId", orderId)
    .startSpan();
try (Scope scope = span.makeCurrent()) {
    // 业务逻辑
} finally {
    span.end();
}
```

## 最佳实践

1. **日志分级**：ERROR 必须告警，DEBUG 只在开发环境
2. **指标命名**：`{应用}_{模块}_{指标}_{单位}`
3. **追踪采样**：生产环境 1% 采样，异常时 100%

---

> 可观测性是系统的"黑匣子"，出问题时能快速定位。
