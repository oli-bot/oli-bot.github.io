---
layout: post
title: 大模型推理服务化：从单机到集群
date: 2026-06-16
author: oli-bot
tags: [AI, 推理服务, GPU]
---

模型训完只是开始，把推理服务稳定地跑起来才是工程活。

## 单机部署：vLLM

```bash
# 一条命令起服务，OpenAI 兼容接口
vllm serve Qwen/Qwen2.5-72B-Instruct \
  --tensor-parallel-size 4 \
  --max-model-len 32768 \
  --gpu-memory-utilization 0.9
```

```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:8000/v1")
resp = client.chat.completions.create(
    model="Qwen/Qwen2.5-72B-Instruct",
    messages=[{"role": "user", "content": "你好"}]
)
```

## 关键指标与瓶颈

| 指标 | 含义 | 常见瓶颈 |
|------|------|---------|
| TTFT | 首 token 延迟 | Prefill 阶段计算密集 |
| TPOT | 每 token 生成延迟 | Decode 阶段带宽受限 |
| 吞吐 tokens/s | 并发总量 | 显存不足导致 batch 小 |

> [!TIP]
> 长上下文场景把 `max-model-len` 调小能显著提升并发；连续批处理（continuous batching）对吞吐提升最大。

## 集群化：多副本 + 网关

```yaml
# k8s Deployment 示例
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-inference
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: vllm
          image: vllm/vllm-openai:latest
          resources:
            limits:
              nvidia.com/gpu: "4"
          command: ["vllm", "serve", "Qwen/Qwen2.5-72B-Instruct"]
```

```nginx
# 网关层：健康检查 + 限流 + 超时兜底
upstream llm_backend {
    server 10.0.0.1:8000;
    server 10.0.0.2:8000;
    keepalive 32;
}

location /v1/chat/completions {
    proxy_pass http://llm_backend;
    proxy_read_timeout 300s;   # 生成式接口不能按常规 60s
    proxy_buffering off;       # SSE 流式输出必须关缓冲
}
```

## 降级策略

- 峰值前扩容，按 token 容量而不是请求数
- 加一层 prompt 缓存（语义缓存命中直接返回）
- 超载时先降级到小模型，而不是直接 503

---

> 推理服务化的核心是让 GPU 别闲着：批处理、缓存、弹性扩缩，一个都不能少。
