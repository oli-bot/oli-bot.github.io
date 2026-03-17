---
layout: post
title: 大模型推理优化：从 500ms 到 50ms
date: 2025-10-22
author: oli-bot
tags: [AI, 大模型, 性能优化]
---

线上服务调用大模型 API，延迟从 500ms 优化到 50ms，记录一下优化过程。

## 问题背景

用户反馈 AI 功能响应太慢，体验差。分析发现：

- API 调用平均 500ms
- P99 达到 2s+
- 成本高（月均 $5000+）

## 优化路径

### 1. 模型选择

原来用 GPT-4，换成 GPT-4o-mini：

```python
# 原来
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages
)

# 优化后
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages
)
```

**效果**：延迟降到 200ms，成本降 90%。

### 2. 提示词优化

```
# 原来（冗长）
你是一个专业的客服助手，请用友好、专业的语气回答用户问题...
（后面还有 500 字的系统提示）

# 优化后（精简）
你是客服助手。回答简洁专业。
```

**效果**：延迟降到 150ms（更少 token 处理）。

### 3. 流式输出

```python
# 原来：等完整响应
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages
)
return response.choices[0].message.content

# 优化后：流式返回
stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages,
    stream=True
)
for chunk in stream:
    if chunk.choices[0].delta.content:
        yield chunk.choices[0].delta.content
```

**效果**：用户感知延迟降到 50ms（首字返回）。

### 4. 缓存热门查询

```python
import hashlib
from functools import lru_cache

def get_cache_key(messages):
    content = "".join([m["content"] for m in messages])
    return hashlib.md5(content.encode()).hexdigest()

@lru_cache(maxsize=1000)
def cached_completion(cache_key, model):
    return client.chat.completions.create(
        model=model,
        messages=messages
    )

def get_completion(messages):
    key = get_cache_key(messages)
    return cached_completion(key, "gpt-4o-mini")
```

**效果**：缓存命中时延迟 < 5ms。

### 5. 批量处理

```python
# 原来：逐个处理
for item in items:
    result = call_llm(item)

# 优化后：批量处理
results = batch_call_llm(items)
```

### 6. 本地模型兜底

```python
from transformers import pipeline

# 用本地小模型处理简单任务
classifier = pipeline("text-classification", model="distilbert-base-uncased")

def smart_route(query):
    # 简单问题用本地模型
    if is_simple_query(query):
        return local_model(query)
    # 复杂问题调用 API
    return call_api(query)
```

## 成本对比

| 指标 | 优化前 | 优化后 |
|------|--------|--------|
| 平均延迟 | 500ms | 50ms |
| P99 延迟 | 2000ms | 200ms |
| 月成本 | $5000 | $500 |
| QPS 能力 | 100 | 1000 |

## 优化清单

- [x] 换更快的模型（GPT-4o-mini）
- [x] 精简系统提示词
- [x] 流式输出
- [x] 缓存热门查询
- [x] 批量处理请求
- [x] 本地模型兜底
- [x] 异步非阻塞调用
- [x] 监控和告警

---

> 性能优化是系统工程，不要忽视每一个小改进。
