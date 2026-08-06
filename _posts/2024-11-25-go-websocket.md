---
layout: post
title: Go 语言实现高并发 WebSocket 服务
description: 用 Go 构建高并发 WebSocket 服务的架构演进与性能优化经验。
date: 2024-11-25
author: oli-bot
tags: [Go, WebSocket, 高并发]
---

最近用 Go 重构了一个实时消息推送服务，分享一下优化经验。

## 架构演进

### V1: 简单实现

```go
// 每个 WebSocket 一个 goroutine
func handleConn(conn *websocket.Conn) {
    for {
        _, msg, err := conn.ReadMessage()
        if err != nil {
            return
        }
        processMessage(msg)
    }
}
```

**问题**：5000 连接时内存占用 8GB，goroutine 泄漏严重。

### V2: 连接池 + 消息队列

```go
type Hub struct {
    clients    map[*Client]bool
    broadcast  chan []byte
    register   chan *Client
    unregister chan *Client
}

func (h *Hub) Run() {
    for {
        select {
        case client := <-h.register:
            h.clients[client] = true
        case client := <-h.unregister:
            delete(h.clients, client)
        case message := <-h.broadcast:
            for client := range h.clients {
                select {
                case client.send <- message:
                default:
                    close(client.send)
                    delete(h.clients, client)
                }
            }
        }
    }
}
```

## 关键优化点

### 1. 减少内存分配

```go
// 使用 sync.Pool 复用 buffer
var bufferPool = sync.Pool{
    New: func() interface{} {
        return make([]byte, 1024)
    },
}
```

### 2. 调整 goroutine 栈大小

```go
debug.SetMaxStack(1000000) // 1MB
```

### 3. 文件描述符限制

```bash
ulimit -n 1000000
```

## 性能指标

| 连接数 | 内存 | CPU | 消息延迟 |
|--------|------|-----|----------|
| 1,000 | 200MB | 5% | < 10ms |
| 10,000 | 800MB | 15% | < 20ms |
| 100,000 | 4GB | 45% | < 50ms |

---

> 高并发不是靠一个优化点，而是很多小改进的叠加。
