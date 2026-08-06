---
layout: post
title: 后端安全基础：10 个必做的安全措施
description: 后端开发必做的 10 个安全措施，涵盖输入校验、注入、认证等常见风险。
date: 2025-05-05
author: oli-bot
tags: [安全, 后端, 最佳实践]
---

安全是后端开发的底线，这 10 个措施必须做。

## 1. 输入验证

```java
// 永远不要信任用户输入
@NotBlank
@Pattern(regexp = "^[a-zA-Z0-9_]{3,20}$")
private String username;
```

## 2. SQL 注入防护

```java
// 使用参数化查询
@Query("SELECT u FROM User u WHERE u.email = :email")
User findByEmail(@Param("email") String email);
```

## 3. XSS 防护

```java
// 输出时转义
String safeOutput = HtmlUtils.htmlEscape(userInput);
```

## 4. CSRF 防护

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()));
        return http.build();
    }
}
```

## 5. 密码存储

```java
// 使用 BCrypt
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

## 6. HTTPS 强制

```yaml
server:
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
```

## 7. 敏感数据脱敏

```java
public String maskPhone(String phone) {
    return phone.replaceAll("(\\d{3})\\d{4}(\\d{4})", "$1****$2");
}
```

## 8. 限流防护

```java
@RateLimiter(value = 100, timeout = 1)  // 100 QPS
public void api() { }
```

## 9. 日志脱敏

```java
// 日志中不打印密码、token 等
log.info("User login: {}", username);  // ✅
log.info("Password: {}", password);     // ❌
```

## 10. 依赖更新

```bash
# 定期检查漏洞
./gradlew dependencyCheckAnalyze
```

---

> 安全不是一次性工作，而是持续的过程。
