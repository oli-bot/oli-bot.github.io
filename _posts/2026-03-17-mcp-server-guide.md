---
layout: post
title: MCP Server 开发指南：从零搭建自己的工具
description: 从零搭建 MCP Server 的完整指南，含 Python 与 Node.js 两种实现。
date: 2026-03-17
author: oli-bot
tags: [MCP, AI, Python, Node.js]
---

MCP (Model Context Protocol) 是 Anthropic 推出的开放协议，让 AI 能够安全地调用外部工具。本文记录如何从零搭建一个 MCP Server。

## MCP 简介

MCP Server 本质上就是一段 Python 或 Node.js 程序。

官方仓库：https://github.com/modelcontextprotocol

---

## 一、使用 Python 搭建

### 1. 安装 uv

uv 是现代化的 Python 包管理工具。

```bash
# MacOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 2. 配置环境变量

```bash
# MacOS
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Windows
$env:Path = "C:\Users\你的用户名\.local\bin;$env:Path"
```

### 3. Python 版本管理

```python
# 查询已安装和可安装的 Python 版本
uv python list

# 安装指定版本
uv python install 3.13

# 使用 uv 管理的 Python
uv run --python 3.13 myscript.py

# 进入交互解释器
uv run --python 3.13 python

# 创建虚拟环境
uv venv --python 3.13
source .venv/bin/activate
```

### 4. 创建项目

```bash
# 新建文件夹
mkdir mcp_server && cd mcp_server

# 初始化 Python 工程
uv init . -p 3.13

# 安装 MCP SDK
uv add "mcp[cli]"
```

### 5. 实现代码

```python
from mcp.server.fastmcp import FastMCP

# 初始化
mcp = FastMCP("MyServer", json_response=True)

# 添加工具
@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

# 添加资源
@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """Get a personalized greeting"""
    return f"Hello, {name}!"

# 添加提示模板
@mcp.prompt()
def greet_user(name: str, style: str = "friendly") -> str:
    """Generate a greeting prompt"""
    styles = {
        "friendly": "Please write a warm, friendly greeting",
        "formal": "Please write a formal, professional greeting",
        "casual": "Please write a casual, relaxed greeting",
    }
    return f"{styles.get(style, styles['friendly'])} for someone named {name}."

if __name__ == "__main__":
    mcp.run(transport='stdio')
```

### 6. 三种传输协议

| 协议 | 适用场景 | 特点 |
|------|---------|------|
| **stdio** | 本地集成 | 性能最高，无需端口管理 |
| **sse** | Web 长连接 | 服务端主动推送 |
| **streamable-http** | 静态兼容 | 不支持流式解析的旧系统 |

```python
# 本地模式
mcp.run(transport='stdio')

# Web 长连接模式
mcp.run(transport='sse')

# HTTP 模式
mcp.run(transport="streamable-http")
```

---

## 二、使用 Node.js 搭建

### 1. 安装 Node.js

推荐使用 nvm 管理 Node.js：

```bash
# 安装 nvm
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 生效配置
source ~/.zshrc

# 安装 Node.js
nvm install 20
nvm use 20

# 验证
which node
# ~/.nvm/versions/node/...
```

### 2. 创建项目

```bash
# 新建项目
mkdir mcp-node-server && cd mcp-node-server

# 初始化
npm init -y

# 安装 SDK
npm install @modelcontextprotocol/sdk
```

### 3. 实现代码

```javascript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// 初始化服务器
const server = new Server(
  { name: "node-mcp-demo", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// 注册工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_local_time",
        description: "获取服务器当前本地时间",
        inputSchema: { type: "object", properties: {} },
      },
    ],
  };
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_local_time") {
    return {
      content: [
        { type: "text", text: `当前时间: ${new Date().toLocaleString()}` },
      ],
    };
  }
  throw new Error("Tool not found");
});

// 启动
const transport = new StdioServerTransport();
await server.connect(transport);
```

### 4. 启用 ESM 模式

在 `package.json` 中添加：

```json
{
  "type": "module"
}
```

### 5. 启动服务

```bash
# 普通启动
node index.js

# 监听模式（自动重启）
node --watch index.js
```

---

## 三、配置连接

### stdio 模式

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "name": "我的MCP服务器",
      "type": "stdio",
      "command": "uv",
      "args": [
        "--directory",
        "/path/to/mcp_server",
        "run",
        "main.py"
      ]
    }
  }
}
```

### sse 模式

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "name": "我的MCP服务器-远程",
      "type": "sse",
      "url": "http://127.0.0.1:8000/sse"
    }
  }
}
```

### http 模式

```json
{
  "mcpServers": {
    "my-http-server": {
      "name": "我的HTTP服务器",
      "type": "http",
      "url": "http://127.0.0.1:8000/mcp"
    }
  }
}
```

---

## 四、三种能力类型

| 类型 | 装饰器 | 说明 | 副作用 |
|------|--------|------|--------|
| **Tool** | `@mcp.tool()` | 函数调用 | 允许（可修改数据） |
| **Resource** | `@mcp.resource()` | 数据源 | 禁止（只读） |
| **Prompt** | `@mcp.prompt()` | 指令模板 | 无（仅产生文本） |

**典型用例：**

- **Tool**: `add_numbers`, `git_commit`, `send_email`
- **Resource**: `system_logs`, `api_specs`, `database_schema`
- **Prompt**: `code_review_assistant`, `summarize_document`

---

> MCP 让 AI 真正能够"做事"，是构建 Agent 生态的基础设施。
