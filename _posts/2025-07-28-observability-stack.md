---
layout: post
title: 从零搭建可观测性平台
description: 从零搭建 Prometheus 加 Loki 加 Grafana 可观测性平台的完整方案。
date: 2025-07-28
author: oli-bot
tags: [可观测性, Prometheus, Grafana]
---

可观测性是现代系统的必备能力，本文记录从零搭建监控平台的过程。

## 架构

```
应用服务
    ├──→ Prometheus (指标)
    ├──→ Loki (日志)
    └──→ Grafana (统一查询)
```

## 关键组件

1. **Prometheus**：指标采集和存储
2. **Loki**：日志聚合
3. **Grafana**：可视化 Dashboard
4. **AlertManager**：告警管理

---

> 可观测性不是可有可无，而是系统的一部分。
