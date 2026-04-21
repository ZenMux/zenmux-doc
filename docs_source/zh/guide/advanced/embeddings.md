---
head:
  - - meta
    - name: description
      content: 文本嵌入
  - - meta
    - name: keywords
      content: Zenmux, guide, embeddings, vector, text-embedding, 向量, 嵌入, 语义搜索, RAG
---

# 文本嵌入

文本嵌入（Embedding）是一种将文本转换为数值向量的技术。这些向量能够捕捉文本的语义信息，使得语义相近的文本在向量空间中彼此接近。通过计算向量之间的距离（通常使用余弦相似度），可以量化文本之间的语义相关性。

ZenMux 兼容 OpenAI 的 Embeddings API，你可以使用 OpenAI SDK 直接调用。

## 当前支持的模型

| 模型 | 输出维度 | 最大输入 Token |
| --- | --- | --- |
| `openai/text-embedding-3-small` | 1536（可自定义） | 8191 |

::: tip 💡 关于维度
`text-embedding-3-small` 默认输出 1536 维向量。你可以通过 `dimensions` 参数指定更低的维度（如 512、256），在几乎不损失语义表达能力的前提下降低存储和检索成本。
:::

## 快速开始

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",  # [!code highlight]
    api_key="<你的 ZENMUX_API_KEY>",  # [!code highlight]
)

response = client.embeddings.create(
    model="openai/text-embedding-3-small",  # [!code highlight]
    input="ZenMux 是一个 LLM API 聚合服务。",
)

embedding = response.data[0].embedding
print(f"向量维度: {len(embedding)}")
print(f"前 5 个值: {embedding[:5]}")
```

```ts [TypeScript]
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1",  // [!code highlight]
  apiKey: "<你的 ZENMUX_API_KEY>",  // [!code highlight]
});

const response = await client.embeddings.create({
  model: "openai/text-embedding-3-small",  // [!code highlight]
  input: "ZenMux 是一个 LLM API 聚合服务。",
});

const embedding = response.data[0].embedding;
console.log(`向量维度: ${embedding.length}`);
console.log(`前 5 个值: ${embedding.slice(0, 5)}`);
```

```bash [cURL]
curl https://zenmux.ai/api/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "openai/text-embedding-3-small",
    "input": "ZenMux 是一个 LLM API 聚合服务。"
  }'
```

:::

## 批量嵌入

你可以在单个请求中传入多段文本，一次性生成多个向量：

::: code-group

```python [Python]
texts = [
    "如何重置密码？",
    "忘记密码怎么办？",
    "修改登录邮箱的方法",
]

response = client.embeddings.create(
    model="openai/text-embedding-3-small",
    input=texts,  # [!code highlight]
)

for i, item in enumerate(response.data):
    print(f"文本 {i}: 维度 {len(item.embedding)}")
```

```ts [TypeScript]
const texts = [
  "如何重置密码？",
  "忘记密码怎么办？",
  "修改登录邮箱的方法",
];

const response = await client.embeddings.create({
  model: "openai/text-embedding-3-small",
  input: texts,  // [!code highlight]
});

response.data.forEach((item, i) => {
  console.log(`文本 ${i}: 维度 ${item.embedding.length}`);
});
```

:::

::: warning 批量限制
- 数组长度不超过 2048
- 单次请求所有输入的 token 总数不超过 300,000
:::

## 自定义维度

通过 `dimensions` 参数可以控制输出向量的维度。较低的维度意味着更小的存储空间和更快的检索速度，适合对性能敏感的场景：

```python
# 默认 1536 维
response_full = client.embeddings.create(
    model="openai/text-embedding-3-small",
    input="语义搜索示例",
)

# 缩减到 512 维
response_short = client.embeddings.create(
    model="openai/text-embedding-3-small",
    input="语义搜索示例",
    dimensions=512,  # [!code highlight]
)

print(f"默认维度: {len(response_full.data[0].embedding)}")   # 1536
print(f"自定义维度: {len(response_short.data[0].embedding)}") # 512
```

## 常见应用场景

### 语义搜索

将文档切分为段落并生成向量，查询时将用户问题也转换为向量，通过余弦相似度找到最相关的段落：

```python
import numpy as np

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# 1. 准备文档向量
docs = [
    "ZenMux 支持多种 LLM 供应商的 API 聚合",
    "通过供应商路由可以指定特定的模型提供商",
    "兜底模型功能可以在主模型不可用时自动切换",
    "Flow 是 ZenMux 的统一计费单位",
]

doc_response = client.embeddings.create(
    model="openai/text-embedding-3-small",
    input=docs,
)
doc_embeddings = [item.embedding for item in doc_response.data]

# 2. 查询
query = "模型挂了怎么办？"
query_response = client.embeddings.create(
    model="openai/text-embedding-3-small",
    input=query,
)
query_embedding = query_response.data[0].embedding

# 3. 计算相似度并排序
similarities = [cosine_similarity(query_embedding, doc_emb) for doc_emb in doc_embeddings]
ranked = sorted(enumerate(similarities), key=lambda x: x[1], reverse=True)

for idx, score in ranked:
    print(f"[{score:.4f}] {docs[idx]}")
```

### RAG（检索增强生成）

将语义搜索与大语言模型结合，先检索相关上下文，再让模型基于上下文回答问题：

```python
# 1. 检索最相关的文档段落（接上例）
top_docs = [docs[idx] for idx, _ in ranked[:2]]
context = "\n".join(top_docs)

# 2. 将检索结果作为上下文传给 LLM
chat_response = client.chat.completions.create(
    model="openai/gpt-4.1-mini",
    messages=[
        {
            "role": "system",
            "content": f"根据以下参考资料回答用户问题：\n\n{context}"
        },
        {
            "role": "user",
            "content": "模型挂了怎么办？"
        }
    ]
)

print(chat_response.choices[0].message.content)
```

### 文本分类

利用 embedding 向量的相似度对文本进行分类，将待分类文本与各个类别标签的向量进行比较：

```python
# 定义分类标签
labels = ["技术问题", "账单问题", "功能建议"]

label_response = client.embeddings.create(
    model="openai/text-embedding-3-small",
    input=labels,
)
label_embeddings = [item.embedding for item in label_response.data]

# 对用户消息进行分类
message = "我的 API 调用一直返回 429 错误"
msg_response = client.embeddings.create(
    model="openai/text-embedding-3-small",
    input=message,
)
msg_embedding = msg_response.data[0].embedding

# 找到最匹配的标签
similarities = [cosine_similarity(msg_embedding, label_emb) for label_emb in label_embeddings]
best_idx = np.argmax(similarities)
print(f"分类结果: {labels[best_idx]}（相似度: {similarities[best_idx]:.4f}）")
```

### 聚类分析

使用 K-Means 等算法对大量文本的 embedding 向量进行聚类，发现文本中的主题分布：

```python
from sklearn.cluster import KMeans

# 假设已有大量文本的 embedding 向量
# embeddings = [...]

kmeans = KMeans(n_clusters=3, random_state=42)
clusters = kmeans.fit_predict(embeddings)

for i, cluster_id in enumerate(clusters):
    print(f"文本 {i} → 聚类 {cluster_id}")
```

### 异常检测

通过计算每个数据点与所在聚类中心的距离，识别远离聚类中心的异常数据：

```python
from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(embeddings)

# 计算每个点到其聚类中心的距离
distances = kmeans.transform(embeddings).min(axis=1)

# 距离最大的点可能是异常数据
threshold = np.percentile(distances, 95)
anomalies = [i for i, d in enumerate(distances) if d > threshold]
print(f"检测到 {len(anomalies)} 个异常数据点")
```

## 最佳实践

::: tip 💡 使用建议

**文本预处理**
- 在生成 embedding 前清理文本中的多余空白和特殊字符
- 对于长文档，按语义段落切分，而非简单按固定长度切割

**维度选择**
- 追求最佳精度：使用默认的 1536 维
- 平衡精度和成本：使用 512 维
- 极致压缩场景：可降至 256 维，但需测试对业务精度的影响

**性能优化**
- 使用批量请求而非逐条调用，减少网络开销
- 对静态文档的 embedding 结果进行缓存，避免重复计算
- 在向量数据库中建立索引以加速检索
:::

## 接口参考

如需了解 Create Embeddings 接口的完整参数说明，请参阅 [Create Embeddings API 参考](/zh/api/openai/create-embeddings)。
