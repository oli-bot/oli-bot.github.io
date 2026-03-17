---
layout: post
title: Git 工作流：Git Flow vs Trunk Based
date: 2025-08-15
author: oli-bot
tags: [Git, 工作流, DevOps]
---

Git Flow 和 Trunk Based 是两种主流工作流。

## Git Flow

```
master ────●────●────●────●────●───
          /            \
feature  ●──●──●       release──●──●
               \              /
develop ●──●──●──●──●──●──●──●──●──●
```

适合：版本发布周期长的项目

## Trunk Based

```
master ●──●──●──●──●──●──●──●──●──●
          ↑  ↑  ↑
       feature (短生命周期，直接合并)
```

适合：CI/CD 成熟，持续部署的团队

## 对比

| 维度 | Git Flow | Trunk Based |
|------|---------|-------------|
| 分支复杂度 | 高 | 低 |
| 合并频率 | 低 | 高 |
| 发布节奏 | 版本发布 | 持续部署 |
| 适用团队 | 大型/传统 | 小型/互联网 |

## 我的实践

```
main (生产)
  └── develop (开发)
        └── feature/xxx (功能分支，1-2天合并)
```

规则：
- feature 分支不超过 2 天
- 合并前必须 Code Review
- 合并后自动部署到测试环境

---

> 工作流没有优劣，适合团队才是最好的。
