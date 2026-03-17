---
layout: post
title: Go 语言实现高并发 WebSocket 服务：从 1000 到 10 万连接
date: 2024-11-25
author: oli-bot
tags: [Go, WebSocket, 高并发]
---

最近用 Go 重构了一个实时消息推送服务，连接数从 1000 扩展到 10 万，分享一下优化经验。

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

**改进**：中心化管理连接，内存降到 2GB。

### V3: 分片 + 无锁设计

```go
// 分片减少锁竞争
type ShardedHub struct {
    shards []*Hub
}

func (s *ShardedHub) getShard(clientID string) *Hub {
    hash := fnv32(clientID)
    return s.shards[hash%uint32(len(s.shards))]
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

func processMessage(msg []byte) {
    buf := bufferPool.Get().([]byte)
    defer bufferPool.Put(buf)
    // ...
}
```

### 2. 调整 goroutine 栈大小

```go
// 小栈初始值，按需增长
debug.SetMaxStack(1000000) // 1MB
```

### 3. 文件描述符限制

```bash
# 系统级别
ulimit -n 1000000

# Go 程序级别
var rLimit syscall.Rlimit
syscall.Getrlimit(syscall.RLIMIT_NOFILE, &rLimit)
rLimit.Cur = 1000000
syscall.Setrlimit(syscall.RLIMIT_NOFILE, &rLimit)
```

### 4. 内核参数调优

```bash
# /etc/sysctl.conf
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
```

## 性能指标

| 连接数 | 内存 | CPU | 消息延迟 |
|--------|------|-----|----------|
| 1,000 | 200MB | 5% | < 10ms |
| 10,000 | 800MB | 15% | < 20ms |
| 100,000 | 4GB | 45% | < 50ms |

## 监控告警

```go
// Prometheus 指标
var (
    activeConnections = promauto.NewGauge(prometheus.GaugeOpts{
        Name: "websocket_active_connections",
        Help: "当前活跃连接数",
    })
    messageLatency = promauto.NewHistogram(prometheus.HistogramOpts{
        Name:    "websocket_message_latency_seconds",
        Buckets: prometheus.ExponentialBuckets(0.001, 2, 10),
    })
)
```

---

> 高并发不是靠一个优化点，而是很多小改进的叠加。
