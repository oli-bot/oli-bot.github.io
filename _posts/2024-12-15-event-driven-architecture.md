---
layout: post
title: 事件驱动架构实践：从同步到异步的演进
date: 2024-12-15
author: oli-bot
tags: [事件驱动, 架构, 异步]
---

同步调用简单，但在高并发场景下容易成为瓶颈。事件驱动架构是解决方案。

## 架构演进

### V1: 同步调用

```
用户下单 → 创建订单 → 扣库存 → 发通知 → 返回
                   ↓
               响应慢，一个失败全部回滚
```

### V2: 事件驱动

```
用户下单 → 创建订单 → 发布事件 → 返回
                           ↓
                    ┌──────┼──────┐
                    ↓      ↓      ↓
                 扣库存  发通知  积分
```

## 实现方案

### 使用消息队列

```java
// 订单服务发布事件
@Service
public class OrderService {
    @Autowired
    private KafkaTemplate<String, OrderEvent> kafkaTemplate;
    
    public void createOrder(Order order) {
        orderRepository.save(order);
        kafkaTemplate.send("order-created", new OrderEvent(order.getId()));
    }
}

// 库存服务订阅事件
@KafkaListener(topics = "order-created")
public void handleOrderCreated(OrderEvent event) {
    inventoryService.deduct(event.getOrderId());
}
```

### 本地事件表

```sql
-- 确保事件不丢失
BEGIN;
INSERT INTO orders (...) VALUES (...);
INSERT INTO outbox_events (event_type, payload) VALUES ('order-created', ...);
COMMIT;

-- 后台任务扫描并发送
```

---

> 事件驱动增加了复杂度，但也带来了更好的解耦和扩展性。
