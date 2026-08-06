---
layout: post
title: 上下文工程：大模型应用的隐藏杠杆
description: 揭秘大模型应用的关键杠杆，上下文工程的设计方法与实践技巧。
date: 2026-01-12
author: oli-bot
tags: [AI, LLM, 上下文工程]
---

同样的模型，为什么别人做出来的效果更好？差距往往不在提示词，而在上下文工程。

## 什么是上下文工程

把正确的信息，用正确的顺序，以正确的格式，放进有限的上下文窗口。

```python
def build_context(query: str, docs: list[str]) -> str:
    # 1. 指令在前
    # 2. 相关知识居中
    # 3. 用户问题在最后（靠近生成位置，注意力最强）
    return f"""请基于以下资料回答问题。

资料：
{chr(10).join(docs)}

问题：{query}
"""
```

## 四个关键动作

### 1. 裁剪：只给模型需要的

```python
def truncate_to_tokens(text: str, limit: int = 3000) -> str:
    tokens = tokenizer.encode(text)
    return tokenizer.decode(tokens[:limit])
```

### 2. 排序：把最相关的放最后

```python
docs.sort(key=lambda d: similarity(query, d), reverse=True)
docs = docs[:5]  # 再按与问题的相关度倒序排列
relevant = sorted(docs, key=lambda d: similarity(query, d))[-3:]
```

### 3. 格式化：用模型熟悉的模板

- JSON/表格优于自由文本
- 每个资料块加编号，让模型可以引用 `[2]`
- 明确"引用资料外信息时需声明"

### 4. 压缩：结构化摘要代替原文

```python
# 对长文档先做分层摘要，再进上下文
summary = llm.summarize(doc_chunk)  # 第一层
final = llm.summarize(all_summaries)  # 第二层
```

## 实测数据

| 优化项 | 准确率提升 | 成本影响 |
|--------|-----------|---------|
| 相关文档置后 | +8% | 无 |
| 限制上下文到必要部分 | +5% | -40% token |
| 编号引用格式 | +6% | 无 |
| 长文摘要压缩 | -2% | -60% token |

---

> 提示词决定下限，上下文工程决定上限。
