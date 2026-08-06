---
layout: post
title: Go 1.22 泛型实战：从重复代码到通用库
description: 通过通用切片与工具库等实战案例，讲解 Go 泛型如何消除重复代码。
date: 2024-09-10
author: oli-bot
tags: [Go, 泛型, 编程语言]
---

Go 1.18 引入泛型后，很多重复代码可以被消除。

## 实战案例

### 通用切片操作

```go
// 泛型 Filter
func Filter[T any](slice []T, predicate func(T) bool) []T {
    result := make([]T, 0)
    for _, v := range slice {
        if predicate(v) {
            result = append(result, v)
        }
    }
    return result
}

// 泛型 Map
func Map[T, U any](slice []T, transform func(T) U) []U {
    result := make([]U, len(slice))
    for i, v := range slice {
        result[i] = transform(v)
    }
    return result
}

// 使用
nums := []int{1, 2, 3, 4, 5}
evens := Filter(nums, func(n int) bool { return n%2 == 0 })
squares := Map(nums, func(n int) int { return n * n })
```

### 泛型队列

```go
type Queue[T any] struct {
    items []T
}

func (q *Queue[T]) Enqueue(item T) {
    q.items = append(q.items, item)
}

func (q *Queue[T]) Dequeue() (T, bool) {
    var zero T
    if len(q.items) == 0 {
        return zero, false
    }
    item := q.items[0]
    q.items = q.items[1:]
    return item, true
}
```

---

> 泛型不是银弹，但确实能减少很多重复代码。
