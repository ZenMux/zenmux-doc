---
head:
  - - meta
    - name: description
      content: Embeddings
  - - meta
    - name: keywords
      content: Zenmux, guide, embeddings, vector, text-embedding, semantic search, RAG
---

# Embeddings

Text embeddings convert text into numerical vectors that capture semantic meaning. Texts with similar meanings are positioned close together in the vector space. By calculating the distance between vectors (typically using cosine similarity), you can quantify the semantic relevance between texts.

ZenMux is compatible with OpenAI's Embeddings API, allowing you to call it directly using the OpenAI SDK.

## Currently Supported Model

| Model | Output Dimensions | Max Input Tokens |
| --- | --- | --- |
| `openai/text-embedding-3-small` | 1536 (customizable) | 8191 |

::: tip 💡 About Dimensions
`text-embedding-3-small` outputs 1536-dimensional vectors by default. You can specify lower dimensions (e.g., 512, 256) via the `dimensions` parameter to reduce storage and retrieval costs with minimal loss in semantic expressiveness.
:::

## Quick Start

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",  # [!code highlight]
    api_key="<your_ZENMUX_API_KEY>",  # [!code highlight]
)

response = client.embeddings.create(
    model="openai/text-embedding-3-small",  # [!code highlight]
    input="ZenMux is an LLM API aggregation service.",
)

embedding = response.data[0].embedding
print(f"Dimensions: {len(embedding)}")
print(f"First 5 values: {embedding[:5]}")
```

```ts [TypeScript]
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1",  // [!code highlight]
  apiKey: "<your_ZENMUX_API_KEY>",  // [!code highlight]
});

const response = await client.embeddings.create({
  model: "openai/text-embedding-3-small",  // [!code highlight]
  input: "ZenMux is an LLM API aggregation service.",
});

const embedding = response.data[0].embedding;
console.log(`Dimensions: ${embedding.length}`);
console.log(`First 5 values: ${embedding.slice(0, 5)}`);
```

```bash [cURL]
curl https://zenmux.ai/api/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "openai/text-embedding-3-small",
    "input": "ZenMux is an LLM API aggregation service."
  }'
```

:::

## Batch Embedding

You can pass multiple texts in a single request to generate multiple vectors at once:

::: code-group

```python [Python]
texts = [
    "How to reset my password?",
    "I forgot my password.",
    "How to change my login email?",
]

response = client.embeddings.create(
    model="openai/text-embedding-3-small",
    input=texts,  # [!code highlight]
)

for i, item in enumerate(response.data):
    print(f"Text {i}: {len(item.embedding)} dimensions")
```

```ts [TypeScript]
const texts = [
  "How to reset my password?",
  "I forgot my password.",
  "How to change my login email?",
];

const response = await client.embeddings.create({
  model: "openai/text-embedding-3-small",
  input: texts,  // [!code highlight]
});

response.data.forEach((item, i) => {
  console.log(`Text ${i}: ${item.embedding.length} dimensions`);
});
```

:::

::: warning Batch Limits
- Array length cannot exceed 2048
- Total token count across all inputs in a single request cannot exceed 300,000
:::

## Custom Dimensions

Use the `dimensions` parameter to control the output vector size. Lower dimensions mean smaller storage and faster retrieval, ideal for performance-sensitive scenarios:

```python
# Default 1536 dimensions
response_full = client.embeddings.create(
    model="openai/text-embedding-3-small",
    input="Semantic search example",
)

# Reduced to 512 dimensions
response_short = client.embeddings.create(
    model="openai/text-embedding-3-small",
    input="Semantic search example",
    dimensions=512,  # [!code highlight]
)

print(f"Default: {len(response_full.data[0].embedding)}")   # 1536
print(f"Custom: {len(response_short.data[0].embedding)}")    # 512
```

## Common Use Cases

### Semantic Search

Split documents into paragraphs and generate vectors. When querying, convert the user's question into a vector as well, then find the most relevant paragraphs using cosine similarity:

```python
import numpy as np

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# 1. Prepare document vectors
docs = [
    "ZenMux supports API aggregation across multiple LLM providers",
    "Provider routing lets you specify a particular model provider",
    "The fallback model feature automatically switches when the primary model is unavailable",
    "Flow is ZenMux's unified billing unit",
]

doc_response = client.embeddings.create(
    model="openai/text-embedding-3-small",
    input=docs,
)
doc_embeddings = [item.embedding for item in doc_response.data]

# 2. Query
query = "What happens when a model goes down?"
query_response = client.embeddings.create(
    model="openai/text-embedding-3-small",
    input=query,
)
query_embedding = query_response.data[0].embedding

# 3. Calculate similarity and rank
similarities = [cosine_similarity(query_embedding, doc_emb) for doc_emb in doc_embeddings]
ranked = sorted(enumerate(similarities), key=lambda x: x[1], reverse=True)

for idx, score in ranked:
    print(f"[{score:.4f}] {docs[idx]}")
```

### RAG (Retrieval-Augmented Generation)

Combine semantic search with LLMs — retrieve relevant context first, then let the model answer based on that context:

```python
# 1. Retrieve the most relevant document paragraphs (continued from above)
top_docs = [docs[idx] for idx, _ in ranked[:2]]
context = "\n".join(top_docs)

# 2. Pass retrieved results as context to the LLM
chat_response = client.chat.completions.create(
    model="openai/gpt-4.1-mini",
    messages=[
        {
            "role": "system",
            "content": f"Answer the user's question based on the following reference:\n\n{context}"
        },
        {
            "role": "user",
            "content": "What happens when a model goes down?"
        }
    ]
)

print(chat_response.choices[0].message.content)
```

### Text Classification

Use embedding similarity to classify text by comparing it against label vectors:

```python
# Define classification labels
labels = ["Technical Issue", "Billing Issue", "Feature Request"]

label_response = client.embeddings.create(
    model="openai/text-embedding-3-small",
    input=labels,
)
label_embeddings = [item.embedding for item in label_response.data]

# Classify a user message
message = "My API calls keep returning 429 errors"
msg_response = client.embeddings.create(
    model="openai/text-embedding-3-small",
    input=message,
)
msg_embedding = msg_response.data[0].embedding

# Find the best matching label
similarities = [cosine_similarity(msg_embedding, label_emb) for label_emb in label_embeddings]
best_idx = np.argmax(similarities)
print(f"Classification: {labels[best_idx]} (similarity: {similarities[best_idx]:.4f})")
```

### Clustering

Use algorithms like K-Means to cluster embedding vectors and discover topic distributions:

```python
from sklearn.cluster import KMeans

# Assuming you already have embedding vectors for a large set of texts
# embeddings = [...]

kmeans = KMeans(n_clusters=3, random_state=42)
clusters = kmeans.fit_predict(embeddings)

for i, cluster_id in enumerate(clusters):
    print(f"Text {i} → Cluster {cluster_id}")
```

### Anomaly Detection

Identify outliers by calculating each data point's distance from its cluster center:

```python
from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(embeddings)

# Calculate each point's distance to its cluster center
distances = kmeans.transform(embeddings).min(axis=1)

# Points with the largest distances may be anomalies
threshold = np.percentile(distances, 95)
anomalies = [i for i, d in enumerate(distances) if d > threshold]
print(f"Detected {len(anomalies)} anomalous data points")
```

## Best Practices

::: tip 💡 Recommendations

**Text Preprocessing**
- Clean excess whitespace and special characters before generating embeddings
- For long documents, split by semantic paragraphs rather than fixed-length chunks

**Choosing Dimensions**
- Best accuracy: use the default 1536 dimensions
- Balanced accuracy and cost: use 512 dimensions
- Maximum compression: reduce to 256 dimensions, but test the impact on your use case

**Performance Optimization**
- Use batch requests instead of individual calls to reduce network overhead
- Cache embedding results for static documents to avoid redundant computation
- Build indexes in your vector database for faster retrieval
:::

## API Reference

For the complete parameter reference of the Create Embeddings endpoint, see [Create Embeddings API Reference](/api/openai/create-embeddings).
