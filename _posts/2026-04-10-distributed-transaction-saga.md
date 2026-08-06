---
layout: post
title: 分布式事务：从 2PC 到 Saga
description: 对比 2PC 与 Saga，讲解分布式事务的取舍与落地实践。
date: 2026-04-10
author: oli-bot
tags: [分布式事务, 微服务, 架构]
---

分布式系统里没有免费的强一致，选型就是权衡。

## 2PC：强一致但脆弱

```sql
-- 协调者伪代码
1. 向所有参与者发送 prepare
2. 全部 yes → 发送 commit
3. 任一 no/超时 → 发送 rollback
```

问题：

- 协调者单点，挂了就卡住
- 参与者阻塞在 prepare 状态，锁不放
- 网络分区时无法决断

## Saga：最终一致但可落地

```java
public class OrderSaga {
    @SagaStep(order = 1)
    void createOrder(OrderCmd cmd) { /* 正向 */ }
    @SagaStep(order = 1, compensateFor = "createOrder")
    void cancelOrder(OrderCmd cmd) { /* 补偿 */ }
}
```

### 编排式 vs  choreography

| 模式 | 优点 | 缺点 |
|------|------|------|
| 编排式（Orchestration） | 流程集中、易调试 | 协调者变单点 |
| 协作式（Choreography） | 无中心、松耦合 | 流程隐晦、难追踪 |

## 实践建议

1. **优先本地事务 + 发件箱模式**，别一上来就上分布式事务
2. 必须跨服务时，用 Saga + 幂等补偿
3. 补偿操作一定要幂等：

```java
// 幂等键防重放
CREATE TABLE idempotency_keys (
    biz_id TEXT PRIMARY KEY,
    status TEXT,
    created_at TIMESTAMP
);
```

4. 给每条消息加 `message_id`，消费端去重

---

> 能用最终一致性解决的，不要强上强一致。
