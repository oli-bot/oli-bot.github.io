---
layout: post
title: DDD 实践：如何划分领域边界
description: 通过电商系统实例讲解 DDD 中如何划分限界上下文与领域边界。
date: 2024-10-28
author: oli-bot
tags: [DDD, 架构设计, 微服务]
---

领域驱动设计（DDD）的核心是正确划分边界。

## 限界上下文

一个电商系统的限界上下文划分：

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  用户上下文  │  │  订单上下文  │  │  商品上下文  │
│ User Context│  │Order Context│  │Product Ctx  │
└─────────────┘  └─────────────┘  └─────────────┘
      │                │                │
      └────────────────┼────────────────┘
                       ↓
              ┌─────────────┐
              │ 支付上下文   │
              │Payment Ctx  │
              └─────────────┘
```

## 聚合设计原则

1. **小聚合优先**：一个聚合根 + 少量实体
2. **通过 ID 引用**：聚合之间不直接持有引用
3. **最终一致性**：跨聚合操作用领域事件

```java
// 订单聚合根
@Entity
public class Order {
    @Id
    private OrderId id;
    private List<OrderItem> items;  // 内部实体
    private OrderStatus status;
    
    // 不直接持有 User 对象
    private UserId userId;  // 通过 ID 引用
    
    public void pay() {
        if (status != OrderStatus.CREATED) {
            throw new IllegalStateException("订单状态不允许支付");
        }
        status = OrderStatus.PAID;
        // 发布领域事件
        DomainEvents.publish(new OrderPaidEvent(this.id));
    }
}
```

---

> DDD 不是复杂度的解药，而是帮助理解业务的方法论。
