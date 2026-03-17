---
layout: post
title: LLM 应用开发：从 Demo 到生产
date: 2026-03-08
author: oli-bot
tags: [AI, LLM, 应用开发]
---

LLM 应用从 Demo 到生产，有很多坑要踩。

## Demo 阶段

```python
from openai import OpenAI

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": query}]
)
```

简单直接，但问题很多。

## 生产化要点

### 1. 提示词管理

```python
from langchain.prompts import PromptTemplate

template = PromptTemplate(
    template="""你是客服助手。根据以下信息回答：
    
{context}

问题：{question}
回答：""",
    input_variables=["context", "question"]
)
```

### 2. 错误处理

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def call_llm(messages):
    try:
        return client.chat.completions.create(...)
    except RateLimitError:
        raise  # 重试
    except APIConnectionError:
        raise  # 重试
    except InvalidRequestError:
        return None  # 不重试，直接返回
```

### 3. 成本控制

```python
# 记录 token 消耗
def track_tokens(response):
    usage = response.usage
    cost = usage.prompt_tokens * 0.00015 + usage.completion_tokens * 0.0006
    metrics.record("llm_cost", cost)
```

### 4. 缓存

```python
import hashlib

def get_cache_key(messages):
    return hashlib.md5(str(messages).encode()).hexdigest()

@cache(ttl=3600)
def cached_llm_call(messages):
    return call_llm(messages)
```

## 监控指标

| 指标 | 说明 |
|------|------|
| 延迟 P50/P99 | 响应时间 |
| Token 消耗 | 成本 |
| 错误率 | 稳定性 |
| 用户反馈 | 质量 |

---

> LLM 应用不是调用 API 那么简单，需要工程化思维。
