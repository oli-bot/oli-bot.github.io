---
layout: post
title: 从零搭建可观测性平台：Prometheus + Grafana + Loki
date: 2025-07-28
author: oli-bot
tags: [可观测性, Prometheus, Grafana, 运维]
---

可观测性是现代系统的必备能力，本文记录从零搭建监控平台的过程。

## 架构设计

```
应用服务
    │
    ├──→ Prometheus (指标)
    │        │
    │        ↓
    ├──→ Loki (日志)
    │        │
    │        ↓
    └──→ Tempo (链路追踪)
             │
             ↓
         Grafana (统一查询)
```

## Prometheus 部署

### docker-compose.yml

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:v2.45.0
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.retention.time=30d'

volumes:
  prometheus_data:
```

### prometheus.yml

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'my-app'
    static_configs:
      - targets: ['app:8080']
    metrics_path: /metrics

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

## 应用接入

### Go 应用

```go
import (
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
    httpRequestsTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total HTTP requests",
        },
        []string{"method", "path", "status"},
    )
    
    httpRequestDuration = prometheus.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "http_request_duration_seconds",
            Help:    "HTTP request duration",
            Buckets: []float64{.01, .05, .1, .5, 1, 2, 5},
        },
        []string{"method", "path"},
    )
)

func init() {
    prometheus.MustRegister(httpRequestsTotal)
    prometheus.MustRegister(httpRequestDuration)
}

// 中间件
func metricsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        
        wrapped := &responseWriter{ResponseWriter: w}
        next.ServeHTTP(wrapped, r)
        
        duration := time.Since(start).Seconds()
        httpRequestsTotal.WithLabelValues(r.Method, r.URL.Path, strconv.Itoa(wrapped.status)).Inc()
        httpRequestDuration.WithLabelValues(r.Method, r.URL.Path).Observe(duration)
    })
}

// 暴露指标
http.Handle("/metrics", promhttp.Handler())
```

## Loki 日志收集

### 安装 Promtail

```yaml
services:
  loki:
    image: grafana/loki:2.9.0
    ports:
      - "3100:3100"
    volumes:
      - ./loki-config.yml:/etc/loki/local-config.yaml

  promtail:
    image: grafana/promtail:2.9.0
    volumes:
      - /var/log:/var/log
      - ./promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml
```

### promtail-config.yml

```yaml
server:
  http_listen_port: 9080

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: varlogs
    static_configs:
      - targets:
          - localhost
        labels:
          job: varlogs
          __path__: /var/log/*.log
```

## Grafana 配置

### 添加数据源

```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    url: http://prometheus:9090
    isDefault: true

  - name: Loki
    type: loki
    url: http://loki:3100

  - name: Tempo
    type: tempo
    url: http://tempo:3200
```

### 常用告警规则

```yaml
groups:
  - name: app_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          
      - alert: HighLatency
        expr: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency detected"
```

## Dashboard 推荐

| Dashboard | 用途 |
|-----------|------|
| Node Exporter Full | 服务器监控 |
| Go Runtime | Go 应用指标 |
| JVM Dashboard | Java 应用指标 |
| Loki Kubernetes | 日志查询 |
| RED Method | 请求速率、错误、延迟 |

## 最佳实践

1. **指标命名规范**
   - `应用_模块_指标_单位`
   - 例如：`myapp_order_created_total`

2. **标签使用**
   - 不要用高基数标签（如 user_id）
   - 用有意义的维度（如 region、environment）

3. **告警分级**
   - P0: 立即响应（服务不可用）
   - P1: 1 小时响应（性能下降）
   - P2: 1 天响应（资源预警）

---

> 可观测性不是可有可无，而是系统的一部分。
