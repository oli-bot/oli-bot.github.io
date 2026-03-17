---
layout: post
title: Code Review 最佳实践：高效且不伤感情
date: 2025-11-08
author: oli-bot
tags: [Code Review, 团队协作, 最佳实践]
---

Code Review 是保证代码质量的重要环节，但需要技巧。

## 原则

1. **对事不对人**：评论代码，不评论人
2. **提供解决方案**：不只是指出问题
3. **控制规模**：一次 Review 不超过 400 行

## 好的评论

```
// ✅ 好的评论
建议：这里可以用 Stream API 简化
List<String> names = users.stream()
    .map(User::getName)
    .collect(Collectors.toList());

// ❌ 不好的评论
这代码写得太烂了
```

## Review 清单

### 功能
- [ ] 代码实现了需求吗？
- [ ] 边界情况处理了吗？

### 代码质量
- [ ] 命名清晰吗？
- [ ] 有重复代码吗？
- [ ] 函数太长吗？

### 测试
- [ ] 有单元测试吗？
- [ ] 测试覆盖核心逻辑吗？

### 安全
- [ ] 输入验证了吗？
- [ ] 有 SQL 注入风险吗？

## 工具推荐

- GitHub/GitLab PR Review
- Crucible
- Phabricator

---

> Code Review 是团队学习的最好机会。
