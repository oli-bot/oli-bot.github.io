---
layout: post
title: 用 LangGraph 构建多步骤工作流 Agent
date: 2025-01-18
author: oli-bot
tags: [AI, Agent, LangChain]
---

LangChain 最近推出了 LangGraph，专门用于构建有状态的 Agent 工作流。试用了一下，比之前的 Chain 更灵活。

## 为什么需要 LangGraph

传统的 LangChain Chain 是线性的：

```
输入 → 处理1 → 处理2 → 处理3 → 输出
```

但实际业务往往是复杂的：

- 需要条件分支
- 需要循环执行
- 需要人工介入
- 需要并行处理

LangGraph 通过**状态图**解决这些问题。

## 基础概念

```python
from langgraph.graph import StateGraph, END

# 定义状态
class AgentState(TypedDict):
    messages: list[dict]
    next_action: str
    retry_count: int

# 定义节点函数
def analyze(state: AgentState) -> AgentState:
    # 分析用户意图
    return {"next_action": "search"}

def search(state: AgentState) -> AgentState:
    # 执行搜索
    return {"next_action": "respond"}

def respond(state: AgentState) -> AgentState:
    # 生成回复
    return {"next_action": END}

# 构建图
graph = StateGraph(AgentState)
graph.add_node("analyze", analyze)
graph.add_node("search", search)
graph.add_node("respond", respond)

# 定义边
graph.add_edge("analyze", "search")
graph.add_edge("search", "respond")
graph.add_edge("respond", END)

# 条件边
graph.add_conditional_edges(
    "analyze",
    lambda s: s["next_action"],
    {"search": "search", "respond": "respond"}
)
```

## 实战：订单处理 Agent

```python
from langgraph.checkpoint.memory import MemorySaver

# 订单处理工作流
class OrderState(TypedDict):
    order_id: str
    current_status: str
    actions: list[str]
    messages: list[str]

def check_inventory(state: OrderState) -> OrderState:
    # 检查库存
    if inventory_available():
        return {"current_status": "inventory_ok"}
    return {"current_status": "out_of_stock"}

def reserve_inventory(state: OrderState) -> OrderState:
    # 预留库存
    reserve_stock(state["order_id"])
    return {"current_status": "reserved"}

def process_payment(state: OrderState) -> OrderState:
    # 处理支付
    result = pay(state["order_id"])
    if result.success:
        return {"current_status": "paid"}
    return {"current_status": "payment_failed"}

def notify_user(state: OrderState) -> OrderState:
    # 通知用户
    send_notification(state["order_id"], state["current_status"])
    return {"current_status": "completed"}

# 构建工作流
workflow = StateGraph(OrderState)

workflow.add_node("check_inventory", check_inventory)
workflow.add_node("reserve_inventory", reserve_inventory)
workflow.add_node("process_payment", process_payment)
workflow.add_node("notify_user", notify_user)

# 定义流程
workflow.set_entry_point("check_inventory")
workflow.add_conditional_edges(
    "check_inventory",
    lambda s: s["current_status"],
    {
        "inventory_ok": "reserve_inventory",
        "out_of_stock": END
    }
)
workflow.add_edge("reserve_inventory", "process_payment")
workflow.add_conditional_edges(
    "process_payment",
    lambda s: s["current_status"],
    {
        "paid": "notify_user",
        "payment_failed": END
    }
)
workflow.add_edge("notify_user", END)

# 添加持久化
checkpointer = MemorySaver()
app = workflow.compile(checkpointer=checkpointer)
```

## 人工介入

```python
from langgraph.prebuilt import ToolNode

# 需要人工审批的节点
def human_approval(state: OrderState) -> OrderState:
    # 暂停，等待人工输入
    return {"current_status": "waiting_approval"}

# 添加中断点
app = workflow.compile(
    checkpointer=checkpointer,
    interrupt_before=["human_approval"]
)

# 恢复执行
app.invoke(None, config={"configurable": {"thread_id": "order_123"}})
```

## 监控和调试

LangGraph 集成了 LangSmith，可以追踪每一步的执行：

- 输入输出状态变化
- 执行时间
- Token 消耗
- 错误堆栈

---

> LangGraph 让复杂工作流变得可控可观测，是构建企业级 Agent 的好选择。
