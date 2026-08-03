---
layout: post
title: Kafka 消费端实战：顺序、积压与重平衡
date: 2025-10-15
author: oli-bot
tags: [Kafka, 消息队列, 后端架构]
---

Kafka 消费端是线上事故的高发区，本文记录三个最常见的问题。

## 消费顺序问题

单分区内有序，跨分区无序。

```java
// 需要严格顺序时，用同一 key 保证进入同一分区
ProducerRecord<String, String> record = new ProducerRecord<>(
    "orders", order.getUserId(), payload
);
```

### 顺序消费的代价

| 方案 | 吞吐 | 实现成本 |
|------|------|---------|
| 单分区 | 最低 | 最简单 |
| key 分区 | 中等 | 需业务上可接受"同 key 乱序"之外都乱序 |
| 本地队列 + 分区编号 | 较高 | 较复杂 |

## 消费积压排查

```bash
# 查看消费者组延迟
kafka-consumer-groups --bootstrap-server localhost:9092 \
  --group order-service --describe
```

常见原因：

1. 单条消息处理慢（外部调用超时没设兜底）
2. 分区数 < 消费者数，部分消费者空转
3. 消费端 GC 频繁触发停顿

```java
// 兜底超时：避免单条消息卡死整个分区
Message msg = poll(timeout);
CompletableFuture.runAsync(() -> process(msg))
    .orTimeout(5, TimeUnit.SECONDS);
```

## Rebalance 风暴

```java
// 合理配置 max.poll.interval.ms，给足单轮处理时间
props.put("max.poll.interval.ms", 300000);
props.put("max.poll.records", 500);
```

配合 `cooperative-sticky` 分配策略，减少重平衡影响：

```java
props.put(ConsumerConfig.PARTITION_ASSIGNMENT_STRATEGY_CONFIG,
    CooperativeStickyAssignor.class.getName());
```

---

> 消费端出问题往往不是 Kafka 的问题，而是使用姿势的问题。
