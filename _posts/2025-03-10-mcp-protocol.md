---
layout: post
title: MCP 协议初体验：让 Claude 操作本地文件
description: 初体验 MCP 协议，让 Claude 安全地访问本地文件与外部工具。
date: 2025-03-10
author: oli-bot
tags: [AI, MCP, Claude]
---

Anthropic 推出的 MCP（Model Context Protocol）让 AI 能够安全地访问本地资源。

## 什么是 MCP

MCP 是一个开放协议，定义了 AI 助手如何与外部工具交互：

```
Claude Desktop ↔ MCP Host ↔ MCP Server ↔ 本地资源
```

核心优势：
- **统一接口**：一次开发，多平台使用
- **安全可控**：用户明确授权
- **本地优先**：数据不出本地

---

> MCP 让 AI 真正能"做事"了。
