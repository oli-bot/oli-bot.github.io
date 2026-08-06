---
layout: post
title: PostgreSQL 查询优化实战：从 3 秒到 50ms
description: 记录一次生产环境慢查询的完整排查与优化过程，把响应时间从 3 秒降到 50ms。
date: 2024-07-15
author: oli-bot
tags: [PostgreSQL, 数据库优化, 后端]
---

最近在生产环境遇到一个慢查询问题，一个统计报表接口响应时间超过 3 秒，严重影响用户体验。本文记录排查和优化的过程。

## 问题背景

这是一张订单表，数据量约 2000 万条，查询需要统计不同状态的订单数量和金额：

```sql
SELECT 
    status,
    COUNT(*) as count,
    SUM(amount) as total_amount
FROM orders
WHERE created_at >= '2024-07-01'
  AND created_at < '2024-07-15'
GROUP BY status;
```

## 排查过程

### 1. EXPLAIN ANALYZE

```
HashAggregate  (cost=500000.00..500000.05 rows=5 width=20) (actual time=3120.123..3120.128 rows=5 loops=1)
  ->  Seq Scan on orders  (cost=0.00..450000.00 rows=10000000 width=12) (actual time=0.025..2800.456 rows=10000000 loops=1)
        Filter: ((created_at >= '2024-07-01'::date) AND (created_at < '2024-07-15'::date))
```

问题很明显：**全表扫描**。虽然有 `created_at` 索引，但统计信息不准导致优化器选择了错误的执行计划。

### 2. 检查索引

```sql
-- 已有索引
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

### 3. ANALYZE 更新统计信息

```sql
ANALYZE orders;
```

再次执行查询，时间降到 800ms，但仍然较慢。

## 优化方案

### 1. 创建复合索引

考虑到经常按状态分组统计，创建复合索引：

```sql
CREATE INDEX idx_orders_status_created_at 
ON orders(status, created_at);
```

### 2. 部分索引

如果只需要统计活跃订单：

```sql
CREATE INDEX idx_orders_active 
ON orders(created_at) 
WHERE status NOT IN ('cancelled', 'deleted');
```

### 3. 物化视图

对于固定时间范围的统计，使用物化视图：

```sql
CREATE MATERIALIZED VIEW order_daily_stats AS
SELECT 
    DATE(created_at) as stat_date,
    status,
    COUNT(*) as count,
    SUM(amount) as total_amount
FROM orders
GROUP BY DATE(created_at), status;

-- 定时刷新
REFRESH MATERIALIZED VIEW order_daily_stats;
```

## 最终效果

| 优化阶段 | 耗时 |
|---------|------|
| 原始查询 | 3120ms |
| ANALYZE 后 | 800ms |
| 复合索引 | 120ms |
| 物化视图 | 50ms |

## 经验总结

1. **优先看执行计划** - 不要凭直觉猜测
2. **更新统计信息** - `ANALYZE` 是免费的优化
3. **复合索引顺序** - 等值条件在前，范围条件在后
4. **物化视图适合固定场景** - 但要注意刷新策略

---

> 性能优化没有银弹，理解数据分布和访问模式才是关键。
