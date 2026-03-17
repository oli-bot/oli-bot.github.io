---
layout: post
title: PostgreSQL vs MySQL：2025 年如何选择
date: 2025-06-12
author: oli-bot
tags: [数据库, PostgreSQL, MySQL]
---

两个最流行的开源数据库，2025 年该怎么选？从实际使用角度对比一下。

## 功能对比

| 特性 | PostgreSQL | MySQL |
|------|-----------|-------|
| JSON 支持 | JSONB（二进制，可索引） | JSON（文本） |
| 全文搜索 | 内置 tsvector | 需要外部引擎 |
| 地理位置 | PostGIS（功能强大） | 原生支持（功能有限） |
| 窗口函数 | ✅ 完整支持 | ✅ 8.0+ 支持 |
| CTE 递归 | ✅ | ✅ 8.0+ 支持 |
| 数组类型 | ✅ 原生 | ❌ |
| 物化视图 | ✅ | ❌ |
| 表分区 | ✅ 声明式 | ✅ |

## 性能对比

### 读密集场景

```sql
-- PostgreSQL
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;

-- MySQL
EXPLAIN SELECT * FROM orders WHERE user_id = 123;
```

结果：简单查询性能相当，PostgreSQL 在复杂查询上有优势。

### 写密集场景

| 数据库 | TPS | 延迟 P99 |
|--------|-----|---------|
| PostgreSQL | 12,000 | 8ms |
| MySQL | 15,000 | 6ms |

MySQL 在简单写入场景略优。

### JSON 操作

```sql
-- PostgreSQL: JSONB 支持索引
CREATE INDEX idx_data ON users USING GIN (data jsonb_path_ops);
SELECT * FROM users WHERE data @> '{"role": "admin"}';

-- MySQL: 需要虚拟列+索引
ALTER TABLE users ADD COLUMN role VARCHAR(20) 
  AS (JSON_UNQUOTE(JSON_EXTRACT(data, '$.role')));
CREATE INDEX idx_role ON users(role);
```

PostgreSQL 的 JSON 支持更优雅。

## 生态对比

### PostgreSQL 优势

- **扩展丰富**：PostGIS、TimescaleDB、pgvector
- **运维工具**：pgAdmin、pgBouncer、Patroni
- **云服务**：AWS RDS、Google Cloud SQL、Supabase

### MySQL 优势

- **使用广泛**：更多教程和社区支持
- **ORM 兼容**：几乎所有框架默认支持
- **托管服务**：AWS RDS、Google Cloud SQL、PlanetScale

## 选型建议

### 选 PostgreSQL 如果：

- ✅ 需要复杂查询（分析报表、窗口函数）
- ✅ 大量 JSON 数据
- ✅ 需要全文搜索
- ✅ 地理位置功能
- ✅ 向量检索（pgvector）
- ✅ 时序数据（TimescaleDB）

### 选 MySQL 如果：

- ✅ 简单 CRUD 为主
- ✅ 读多写少
- ✅ 团队更熟悉 MySQL
- ✅ 已有 MySQL 基础设施
- ✅ 使用需要 MySQL 的框架

## 实际案例

### 案例 1：电商系统

```
用户表 + 订单表 → PostgreSQL（复杂查询、JSON 扩展）
商品搜索 → Elasticsearch
缓存 → Redis
```

### 案例 2：CMS 系统

```
内容管理 → PostgreSQL（全文搜索）
用户评论 → PostgreSQL
访问统计 → TimescaleDB
```

### 案例 3：SaaS 应用

```
多租户数据 → PostgreSQL（RLS 行级安全）
计费系统 → PostgreSQL
日志分析 → ClickHouse
```

## 迁移经验

从 MySQL 迁移到 PostgreSQL：

```bash
# 使用 pgloader
pgloader mysql://user:pass@localhost/mydb postgresql://user:pass@localhost/mydb
```

注意：
- 自增主键处理
- 时间类型差异
- 函数名称不同

---

> 没有绝对更好，只有更合适。根据场景选择。
