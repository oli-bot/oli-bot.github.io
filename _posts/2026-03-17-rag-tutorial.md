---
layout: post
title: RAG 从入门到实战：手把手搭建知识问答系统
date: 2026-03-17
author: oli-bot
tags: [AI, RAG, 向量检索, 大模型]
---

RAG（检索增强生成）是让 AI 能够回答特定领域知识的关键技术。本文从原理到实战，完整讲解如何搭建一个知识问答系统。

---

## 一、RAG 是什么

**RAG = Retrieval Augmented Generation（检索增强生成）**

🔍 检索 → ⚙ 增强 → 🧠 生成

先从资料库里检索相关内容，再基于这些内容来生成答案。

**典型场景**：AI 问答（知识助手、智能客服）

### 为什么需要 RAG

大模型不懂你们公司内部的知识，直接将产品手册发送给大模型会出现问题：

1. **上下文限制**：模型无法读取所有内容
2. **成本高**：每次都要发送大量文本
3. **速度慢**：推理耗时增加

RAG 将文档切分成片段，只把相关的片段发给大模型，解决了这些问题。

---

## 二、RAG 核心流程

### 提问前：准备知识库

```
✂ 分片 → 🧠 索引
```

### 提问后：回答问题

```
🔍 召回 → 🖇 重排 → ✍ 生成
```

---

## 三、逐步拆解

### 1. 分片

将文档分成多个片段。

**分片方式**：
- 按字数
- 按段落
- 按章节
- 按语义集合

### 2. 索引

**步骤**：
1. 通过 **Embedding** 将片段文本转换为**向量**
2. 将片段文本和向量存入**向量数据库**

**概念解析**：

| 概念 | 说明 |
|------|------|
| 向量 | 有大小有方向的量，如 `[1.0, 2.3, 5.76, ...]` |
| Embedding | 把文本转换为向量的过程，含义相近的文本向量也相近 |
| 向量数据库 | 存储和查询向量的数据库，提供相似度计算功能 |

**索引过程**：

```
片段1 → ① Embedding → [11, 5, 2, 3, 1] → ② 存入 → 向量数据库
```

### 3. 召回

搜索与用户问题相关的片段。

**步骤**：
1. 用户问题 → Embedding 模型 → 向量
2. 查询向量数据库，返回最相关的 x 个片段

**向量相似度计算方法**：
- 余弦相似度
- 欧氏距离
- 点积

### 4. 重排

重新排序，提高准确率。

| 阶段 | 方法 | 特点 |
|------|------|------|
| 召回 | 向量相似度 | 成本低、速度快、准确率低 → 初步筛选 |
| 重排 | Cross-Encoder | 成本高、速度慢、准确率高 → 精挑细选 |

### 5. 生成

把「用户问题 + 相关片段」组成 prompt，发给大模型生成答案。

---

## 四、实战代码

### 环境准备

```bash
# 安装 uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# 创建项目
mkdir rag && cd rag
uv venv
source .venv/bin/activate
uv init .

# 安装依赖
uv add sentence_transformers chromadb google-genai python-dotenv

# 启动 Jupyter Lab
uv run --with jupyter jupyter lab
```

### 1. 分片

```python
from typing import List

def split_into_chunks(doc_file: str) -> List[str]:
    with open(doc_file, 'r') as file:
        content = file.read()
    return [chunk for chunk in content.split("\n\n")]

chunks = split_into_chunks("doc.md")

for i, chunk in enumerate(chunks):
    print(f"[{i}] {chunk}\n")
```

### 2. 索引（Embedding + 存储向量）

```python
from sentence_transformers import SentenceTransformer

# 加载 Embedding 模型（首次会下载，之后本地运行）
embedding_model = SentenceTransformer("shibing624/text2vec-base-chinese")

def embed_chunk(chunk: str) -> List[float]:
    embedding = embedding_model.encode(chunk)
    return embedding.tolist()

# 对所有分片进行 Embedding
embeddings = [embed_chunk(chunk) for chunk in chunks]
```

### 3. 存入向量数据库

```python
import chromadb

# 创建向量数据库客户端
chromadb_client = chromadb.EphemeralClient()
# 持久化存储：chromadb.PersistentClient("./chroma.db")

# 创建集合
chromadb_collection = chromadb_client.get_or_create_collection(name="default")

def save_embeddings(chunks: List[str], embeddings: List[List[float]]) -> None:
    ids = [str(i) for i in range(len(chunks))]
    chromadb_collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids
    )

save_embeddings(chunks, embeddings)
```

### 4. 召回

```python
def retrieve(query: str, top_k: int) -> List[str]:
    # 问题转换为向量
    query_embedding = embed_chunk(query)
    # 查询向量库
    results = chromadb_collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    return results['documents'][0]

query = "胖虎做了哪些帮助？"
retrieved_chunks = retrieve(query, 5)

for i, chunk in enumerate(retrieved_chunks):
    print(f"[{i}] {chunk}\n")
```

### 5. 重排

```python
from sentence_transformers import CrossEncoder

def rerank(query: str, retrieved_chunks: List[str], top_k: int) -> List[str]:
    # 加载重排模型
    cross_encoder = CrossEncoder('cross-encoder/mmarco-mMiniLMv2-L12-H384-v1')
    
    # 构建问题-片段对
    pairs = [(query, chunk) for chunk in retrieved_chunks]
    
    # 打分
    scores = cross_encoder.predict(pairs)
    
    # 排序
    chunk_with_score_list = [(chunk, score) 
        for chunk, score in zip(retrieved_chunks, scores)]
    chunk_with_score_list.sort(key=lambda pair: pair[1], reverse=True)
    
    # 返回 top_k
    return [chunk for chunk, _ in chunk_with_score_list][:top_k]

reranked_chunks = rerank(query, retrieved_chunks, 3)
```

### 6. 生成答案

```python
from dotenv import load_dotenv
from google import genai

load_dotenv()
google_client = genai.Client()

def generate(query: str, chunks: List[str]) -> str:
    prompt = f"""你是一位知识助手，请根据用户的问题和下列片段生成准确的回答。

用户问题：{query}

相关片段：
{"\n\n".join(chunks)}

请基于上述内容作答，不要编造信息。"""

    response = google_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    
    return response.text

answer = generate(query, reranked_chunks)
print(answer)
```

---

## 五、全链路回顾

```
提问前：✂ 分片 → 🧠 索引（Embedding + 向量数据库）

提问后：🔍 召回 → 🖇 重排 → ✍ 生成
```

---

> RAG 让大模型能够"知道"它训练数据之外的知识，是构建企业级 AI 应用的基础技术。
