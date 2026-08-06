---
layout: post
title: Kubernetes 故障排查：Pod 一直 Pending 怎么办
description: 记录 Kubernetes Pod 一直处于 Pending 状态的排查步骤与常用命令。
date: 2024-09-20
author: oli-bot
tags: [Kubernetes, 云原生, 运维]
---

最近在 K8s 集群部署服务时遇到 Pod 一直处于 Pending 状态，排查过程记录一下。

## 现象

```bash
$ kubectl get pods
NAME                      READY   STATUS    RESTARTS   AGE
my-app-7d8f9c5b4-xk2m8    0/1     Pending   0          5m
```

## 排查步骤

### 1. 查看事件

```bash
$ kubectl describe pod my-app-7d8f9c5b4-xk2m8

Events:
  Type     Reason            Age   From               Message
  ----     ------            ----  ----               -------
  Warning  FailedScheduling  5m    default-scheduler  0/3 nodes are available: 3 Insufficient cpu.
```

**原因**：CPU 资源不足。

### 2. 检查节点资源

```bash
$ kubectl describe nodes | grep -A 5 "Allocated resources"

Allocated resources:
  CPU Requests     CPU Limits     Memory Requests     Memory Limits
  ------------     ----------     ---------------     -------------
  3500m (87%)      4000m (100%)   6Gi (75%)           8Gi (100%)
```

**问题确认**：节点 CPU 已经分配满，但 Pod 请求了 500m。

## 解决方案

### 方案一：调整资源请求

```yaml
resources:
  requests:
    cpu: "100m"    # 降低请求
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"
```

### 方案二：扩展节点

```bash
# 添加新节点后，调度器会自动分配
$ kubectl get nodes
NAME           STATUS   ROLES    AGE   VERSION
node-1         Ready    <none>   30d   v1.28.0
node-2         Ready    <none>   30d   v1.28.0
node-3         Ready    <none>   1m    v1.28.0  # 新节点
```

### 方案三：优先级和抢占

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
---
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  priorityClassName: high-priority
  # ...
```

## 其他常见 Pending 原因

| 原因 | 排查命令 |
|------|---------|
| 资源不足 | `kubectl describe node <node>` |
| 存储挂载失败 | `kubectl get pvc` |
| 节点选择器不匹配 | `kubectl get nodes --show-labels` |
| 污点容忍配置 | `kubectl describe node <node> \| grep Taints` |

## 调度失败速查表

```
0/N nodes are available: N Insufficient cpu     → CPU 不够
0/N nodes are available: N Insufficient memory  → 内存不够
0/N nodes are available: N node(s) had taints   → 污点问题
0/N nodes are available: N node(s) didn't match node selector  → 标签不匹配
```

---

> K8s 调度问题，describe pod 通常是第一步。
