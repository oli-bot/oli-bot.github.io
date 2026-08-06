---
layout: post
title: MySQL 索引优化：从 500 万数据中学到的教训
description: 基于 500 万数据表总结的 MySQL 索引优化踩坑经验与最佳实践。
date: 2024-11-10
author: oli-bot
tags: [MySQL, 索引优化, 数据库]
---

最近优化了一个 500 万数据的表，总结几个索引踩坑经验。

## 踩坑 1：最左前缀

```sql
-- 索引
CREATE INDEX idx_name_status_time ON orders(name, status, created_at);

-- 能用索引
WHERE name = 'test'
WHERE name = 'test' AND status = 1

-- 不能用索引！
WHERE status = 1  -- 跳过了 name
WHERE name = 'test' AND created_at > '2024-01-01'  -- 跳过了 status
```

## 踩坑 2：索引列计算

```sql
-- 不能用索引
WHERE YEAR(created_at) = 2024

-- 能用索引
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'
```

## 踩坑 3：隐式类型转换

```sql
-- 字段是 VARCHAR，传入数字
WHERE phone = 13800138000  -- 隐式转换，索引失效！

-- 正确写法
WHERE phone = '13800138000'
```

## 索引选择原则

| 场景 | 建议 |
|------|------|
| 等值查询 | 放在最左 |
| 范围查询 | 放在后面 |
| 排序字段 | 放在 WHERE 后面 |
| 区分度高 | 优先考虑 |

---

> 索引不是越多越好，每增加一个索引，写入成本就增加一分。
