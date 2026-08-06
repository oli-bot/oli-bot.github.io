---
layout: post
title: 性能测试实战：从 k6 到 Grafana
description: 使用 k6 进行压测并结合 Grafana 可视化的性能测试实战流程。
date: 2025-06-20
author: oli-bot
tags: [性能测试, k6, DevOps]
---

上线前不做性能测试，就是在生产环境测试。

## k6 脚本

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 100 },   // 预热
    { duration: '3m', target: 500 },   // 压测
    { duration: '1m', target: 0 },     // 降温
  ],
  thresholds: {
    http_req_duration: ['p(99)<500'], // 99% 请求 < 500ms
    http_req_failed: ['rate<0.01'],   // 错误率 < 1%
  },
};

export default function () {
  let res = http.get('https://api.example.com/users');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  sleep(1);
}
```

## 运行测试

```bash
k6 run --out influxdb=http://localhost:8086/k6 script.js
```

## Grafana Dashboard

导入 k6 官方 Dashboard，可视化：
- 请求速率
- 响应时间分布
- 错误率
- 系统资源

## 常见问题定位

| 现象 | 可能原因 |
|------|---------|
| 响应时间随并发增长 | 线程池/连接池不足 |
| 错误率突增 | 服务限流或熔断 |
| 内存持续增长 | 内存泄漏 |
| CPU 飙升 | 热点代码或 GC |

---

> 性能问题越早发现，修复成本越低。
