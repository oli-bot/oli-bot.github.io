---
layout: post
title: Redis 缓存穿透、击穿、雪崩的实战防护
description: 总结 Redis 缓存穿透、击穿、雪崩三大经典问题的成因与实战解决方案。
date: 2024-08-08
author: oli-bot
tags: [Redis, 缓存, 后端架构]
---

缓存是后端系统的重要组成部分，但使用不当会带来一系列问题。本文总结缓存三大经典问题及解决方案。

## 三大问题

| 问题 | 原因 | 后果 |
|------|------|------|
| **穿透** | 查询不存在的数据 | 请求直达数据库 |
| **击穿** | 热点 key 过期 | 瞬时大量请求打垮数据库 |
| **雪崩** | 大量 key 同时过期 | 数据库压力骤增 |

## 缓存穿透

### 场景

用户恶意查询 `-1` 这类不存在的 ID，缓存没数据，请求全部打到数据库。

### 解决方案

#### 1. 缓存空值

```java
public Object get(String key) {
    Object value = redis.get(key);
    if (value != null) {
        return "NULL".equals(value) ? null : value;
    }
    
    value = db.query(key);
    if (value == null) {
        redis.setex(key, 60, "NULL"); // 缓存空值，短过期
    } else {
        redis.setex(key, 3600, value);
    }
    return value;
}
```

#### 2. 布隆过滤器

```java
// 初始化时预热所有有效 ID
BloomFilter<Long> bloomFilter = BloomFilter.create(
    Funnels.longFunnel(), 
    1000000,  // 预期元素数量
    0.01      // 误判率
);

// 查询前先判断
if (!bloomFilter.mightContain(id)) {
    return null; // 一定不存在
}
```

## 缓存击穿

### 场景

某个热点商品缓存过期瞬间，大量请求涌入。

### 解决方案

#### 1. 互斥锁

```java
public Object getWithLock(String key) {
    Object value = redis.get(key);
    if (value == null) {
        String lockKey = "lock:" + key;
        try {
            // 尝试获取锁
            if (redis.setnx(lockKey, "1", 10)) {
                value = db.query(key);
                redis.setex(key, 3600, value);
            } else {
                Thread.sleep(50);
                return getWithLock(key); // 重试
            }
        } finally {
            redis.del(lockKey);
        }
    }
    return value;
}
```

#### 2. 永不过期

```java
// 物理不过期，逻辑过期
public Object getWithLogicalExpire(String key) {
    Object value = redis.get(key);
    if (value != null) {
        CacheData data = (CacheData) value;
        if (data.isExpired()) {
            // 异步刷新
            executor.submit(() -> refreshCache(key));
        }
        return data.getValue();
    }
    return null;
}
```

## 缓存雪崩

### 场景

批量预热数据时设置了相同过期时间，某一时刻全部失效。

### 解决方案

#### 1. 随机过期时间

```java
int baseExpire = 3600;
int randomExpire = ThreadLocalRandom.current().nextInt(0, 300);
redis.setex(key, baseExpire + randomExpire, value);
```

#### 2. 多级缓存

```
请求 → 本地缓存 → Redis → 数据库
```

```java
public Object getWithMultiLevel(String key) {
    // L1: 本地缓存
    Object value = localCache.get(key);
    if (value != null) return value;
    
    // L2: Redis
    value = redis.get(key);
    if (value != null) {
        localCache.put(key, value, 60);
        return value;
    }
    
    // L3: 数据库
    value = db.query(key);
    redis.setex(key, 3600, value);
    localCache.put(key, value, 60);
    return value;
}
```

## 总结

| 问题 | 最佳实践 |
|------|---------|
| 穿透 | 布隆过滤器 + 缓存空值 |
| 击穿 | 互斥锁或逻辑过期 |
| 雪崩 | 随机过期 + 多级缓存 |

---

> 缓存不是万能药，设计时要考虑各种边界情况。
