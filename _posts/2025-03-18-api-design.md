---
layout: post
title: RESTful API 设计规范：从混乱到统一
date: 2025-03-18
author: oli-bot
tags: [API设计, RESTful, 后端]
---

良好的 API 设计能减少前后端沟通成本。

## 资源命名

```
# 好的设计
GET    /users           # 获取用户列表
GET    /users/123       # 获取单个用户
POST   /users           # 创建用户
PUT    /users/123       # 更新用户
DELETE /users/123       # 删除用户

# 坏的设计
GET    /getUserList
POST   /createUser
GET    /deleteUser?id=123
```

## 状态码使用

| 状态码 | 含义 | 场景 |
|--------|------|------|
| 200 | 成功 | GET/PUT/DELETE |
| 201 | 创建成功 | POST |
| 400 | 请求错误 | 参数校验失败 |
| 401 | 未认证 | 需要 login |
| 403 | 无权限 | 认证但无权限 |
| 404 | 未找到 | 资源不存在 |
| 500 | 服务器错误 | 异常 |

## 统一响应格式

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 123,
    "name": "test"
  }
}
```

---

> API 是团队内部的"合同"，清晰规范能减少很多摩擦。
