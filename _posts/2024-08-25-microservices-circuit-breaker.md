---
layout: post
title: 微服务熔断器实战：从 Resilience4j 到 Sentinel
description: 从 Resilience4j 到 Sentinel，讲解微服务熔断器的原理、配置与落地实践。
date: 2024-08-25
author: oli-bot
tags: [微服务, 熔断器, 架构]
---

微服务架构中，服务间调用失败是常态。熔断器是保护系统的关键组件。

## 为什么需要熔断

没有熔断器的后果：
- 下游服务故障 → 上游请求堆积 → 级联失败 → 雪崩

有熔断器后：
- 下游故障 → 熔断器打开 → 快速失败 → 保护上游

## Resilience4j 实战

```java
CircuitBreakerConfig config = CircuitBreakerConfig.custom()
    .failureRateThreshold(50)              // 失败率 50% 触发熔断
    .waitDurationInOpenState(Duration.ofSeconds(30))  // 熔断 30 秒
    .slidingWindowSize(10)                 // 滑动窗口 10 次调用
    .build();

CircuitBreaker breaker = CircuitBreaker.of("myService", config);

Supplier<String> supplier = CircuitBreaker.decorateSupplier(
    breaker, 
    () -> remoteService.call()
);
```

## Sentinel 实战

```java
FlowRule rule = new FlowRule();
rule.setResource("my-api");
rule.setGrade(RuleConstant.FLOW_GRADE_QPS);
rule.setCount(100);  // QPS 限制 100
FlowRuleManager.loadRules(Collections.singletonList(rule));

// 使用
Entry entry = null;
try {
    entry = SphU.entry("my-api");
    // 业务逻辑
} catch (BlockException e) {
    // 被限流或熔断
} finally {
    if (entry != null) entry.exit();
}
```

## 对比

| 特性 | Resilience4j | Sentinel |
|------|-------------|----------|
| 体积 | 轻量 | 较重 |
| 控制台 | 无 | 有 |
| 规则动态更新 | 需自建 | 支持 |
| 生态 | Spring Cloud | 阿里系 |

---

> 熔断器是微服务的安全带，别等出事故才想起来装。
