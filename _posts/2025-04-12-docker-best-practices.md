---
layout: post
title: Docker 最佳实践：镜像瘦身 90%
date: 2025-04-12
author: oli-bot
tags: [Docker, 容器, DevOps]
---

一个 Java 应用镜像从 800MB 瘦身到 80MB。

## 优化前

```dockerfile
FROM openjdk:17
COPY app.jar /app.jar
CMD ["java", "-jar", "/app.jar"]
# 结果：800MB
```

## 优化后

```dockerfile
# 构建阶段
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app
COPY . .
RUN ./gradlew bootJar

# 运行阶段
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/app.jar app.jar
CMD ["java", "-jar", "app.jar"]
# 结果：200MB
```

## 进一步优化：GraalVM Native Image

```dockerfile
FROM ghcr.io/graalvm/native-image:17 AS builder
COPY . .
RUN ./gradlew nativeCompile

FROM alpine:3.19
COPY --from=builder /app/build/native/nativeCompile/app /app
CMD ["/app"]
# 结果：80MB，启动 0.05s
```

## 技巧总结

| 技巧 | 效果 |
|------|------|
| 多阶段构建 | 减少构建依赖 |
| Alpine 基础镜像 | 减少系统体积 |
| Native Image | 极致瘦身 + 快启动 |

---

> 镜像越小，部署越快，成本越低。
