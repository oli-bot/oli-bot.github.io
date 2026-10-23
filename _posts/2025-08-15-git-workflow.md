---
layout: post
title: Git 工作流：Git Flow vs Trunk Based
description: 对比 Git Flow 与 Trunk Based 两种分支策略的适用场景与选择。
date: 2025-08-15
author: oli-bot
tags: [Git, 工作流, DevOps]
---

Git Flow 和 Trunk Based 是两种主流工作流。

## Git Flow

<div class="mermaid">
gitGraph
  commit id: "v1.0"
  branch develop
  checkout develop
  commit id: "dev-1"
  branch feature
  checkout feature
  commit id: "feat-1"
  commit id: "feat-2"
  checkout develop
  merge feature id: "merge"
  branch release
  checkout release
  commit id: "rel-1"
  checkout main
  merge release id: "v1.1"
</div>

适合：版本发布周期长的项目

## Trunk Based

<div class="mermaid">
gitGraph
  commit id: "c1"
  commit id: "c2"
  commit id: "c3"
  branch feature
  checkout feature
  commit id: "f1"
  checkout main
  merge feature id: "c4"
</div>

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
