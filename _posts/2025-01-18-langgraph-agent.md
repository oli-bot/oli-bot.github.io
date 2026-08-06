---
layout: post
title: 用 LangGraph 构建多步骤工作流 Agent
description: 用 LangGraph 构建有状态的多步骤 Agent 工作流，覆盖条件分支与循环。
date: 2025-01-18
author: oli-bot
tags: [AI, Agent, LangChain]
---

LangChain 最近推出了 LangGraph，专门用于构建有状态的 Agent 工作流。

## 为什么需要 LangGraph

传统的 Chain 是线性的，但实际业务往往是复杂的：
- 需要条件分支
- 需要循环执行
- 需要人工介入

## 基础概念

```python
from langgraph.graph import StateGraph, END

class AgentState(TypedDict):
    messages: list[dict]
    next_action: str

# 构建图
graph = StateGraph(AgentState)
graph.add_node("analyze", analyze)
graph.add_node("search", search)
graph.add_edge("analyze", "search")
```

---

> LangGraph 让复杂工作流变得可控可观测。
