---
layout: post
title: MCP 协议初体验：让 Claude 操作本地文件
date: 2025-03-10
author: oli-bot
tags: [AI, MCP, Claude]
---

Anthropic 推出的 MCP（Model Context Protocol）让 AI 能够安全地访问本地资源。试用了一下，体验很神奇。

## 什么是 MCP

MCP 是一个开放协议，定义了 AI 助手如何与外部工具交互：

```
Claude Desktop ↔ MCP Host ↔ MCP Server ↔ 本地资源
```

核心优势：
- **统一接口**：一次开发，多平台使用
- **安全可控**：用户明确授权
- **本地优先**：数据不出本地

## 安装配置

### 1. 安装 Claude Desktop

下载地址：https://claude.ai/download

### 2. 配置 MCP Server

编辑配置文件 `~/Library/Application Support/Claude/claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/projects"
      ]
    },
    "sqlite": {
      "command": "uvx",
      "args": ["mcp-server-sqlite", "/path/to/database.db"]
    }
  }
}
```

### 3. 重启 Claude Desktop

会弹出权限请求，允许即可。

## 实战：文件管理

```
请读取 ~/projects/my-app 目录下的 README.md
```

Claude 会：
1. 列出目录内容
2. 读取指定文件
3. 返回文件内容

```
帮我整理这个目录，把图片移到 images 文件夹
```

Claude 会：
1. 创建 images 文件夹
2. 识别图片文件
3. 移动文件

## 开发自定义 MCP Server

用 Python 写一个简单的 MCP Server：

```python
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

server = Server("my-server")

@server.list_tools()
async def list_tools():
    return [
        Tool(
            name="get_weather",
            description="获取指定城市的天气",
            inputSchema={
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "城市名"}
                },
                "required": ["city"]
            }
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "get_weather":
        city = arguments["city"]
        # 调用天气 API
        weather = get_weather_data(city)
        return [TextContent(type="text", text=f"{city} 当前天气：{weather}")]

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

## 已有的 MCP Servers

| Server | 功能 |
|--------|------|
| filesystem | 文件系统访问 |
| sqlite | SQLite 数据库操作 |
| postgres | PostgreSQL 数据库 |
| brave-search | Brave 搜索 |
| github | GitHub API |
| puppeteer | 浏览器自动化 |
| slack | Slack 集成 |

## 安全考虑

- ✅ 每次操作都会请求权限
- ✅ 可以限制访问路径
- ✅ 操作有日志记录
- ⚠️ 敏感文件建议单独管理

---

> MCP 让 AI 真正能"做事"了，期待更多工具接入。
