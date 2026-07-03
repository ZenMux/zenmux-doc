---
pageClass: api-page
title: API
head:
  - - meta
    - name: description
      content: Rerank documents by relevance to a query
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, rerank, reranker, retrieval, relevance, multimodal, Qwen
---

# Rerank Documents

::: tip Troubleshooting
Encountering errors during API calls? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting solutions.
:::

```http
POST https://zenmux.ai/api/v1/rerank
```

The Rerank endpoint reorders a list of documents by their relevance to a query, returning a relevance score for each document. It is commonly used in retrieval-augmented generation (RAG) pipelines to refine the results of a first-stage retriever before passing them to a model.

Both **text** and **multimodal** (text / image / video) rerank models are supported. The available modalities depend on the model you select.

## Request headers

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer Token authentication.

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Request content type, defaults to `application/json`.

## Request

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The model ID to use, in the format `<provider>/<model-name>`, for example `qwen/qwen3-rerank`.

### input `object` <span style="color: #FA6062; font-weight: 400">\*</span>

The rerank input, containing the query and the documents to be ranked against it.

#### input.query `string or object` <span style="color: #FA6062; font-weight: 400">\*</span>

The query to rank documents against.

- For text rerank models, pass a plain `string`.
- For multimodal rerank models, you may pass a content object such as `{ "text": "..." }`, `{ "image": "<url-or-base64>" }`, or `{ "video": "<url-or-base64>" }`.

#### input.documents `array` <span style="color: #FA6062; font-weight: 400">\*</span>

A non-empty array of documents to rank. Each element follows the same form as `query`:

- A plain `string` for text rerank, or
- A content object (`{ "text": ... }` / `{ "image": ... }` / `{ "video": ... }`) for multimodal rerank.

::: warning Multimodal input
Image and video content may be provided as a publicly accessible URL or as Base64-encoded data. Large Base64 payloads are supported; the request body limit applies per the platform configuration.
:::

### parameters `object` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span>

Additional rerank options.

#### parameters.top_n `integer` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span>

The number of top-ranked documents to return. When omitted, all documents are returned, ordered by relevance.

#### parameters.return_documents `boolean` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span>

Whether to include the original document content in each result. Defaults to the provider's behavior (typically `false`).

#### parameters.instruct `string` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span>

An optional instruction that guides the model on how to judge relevance for this request.

#### parameters.fps `number` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span>

Frames-per-second sampling rate for video inputs. Only applies to multimodal rerank models that accept video content.

## Response

Returns a JSON object containing the ranked results.

### object `string`

The object type, always `list`.

### model `string`

The name of the model used to perform the rerank.

### results `array`

An array of ranked result objects, ordered from most to least relevant.

#### results object

##### index `integer`

The index of the document in the original `input.documents` array.

##### relevance_score `number`

The relevance score of the document with respect to the query. Higher values indicate greater relevance.

##### document `string or object`

The original document content. Present only when `parameters.return_documents` is `true`.

### usage `object`

Token usage information for this request.

- `prompt_tokens` `integer` — Number of tokens consumed by the input.
- `total_tokens` `integer` — Total number of tokens consumed.
- `image_tokens` `integer` — Number of tokens consumed by image inputs. Present only for multimodal requests that include images.

::: api-request POST /api/v1/rerank

```bash [cURL]curl https://zenmux.ai/api/v1/rerank \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "qwen/qwen3-rerank",
    "input": {
      "query": "What is the capital of China?",
      "documents": [
        "Beijing is the capital of China.",
        "Shanghai is the largest city in China.",
        "The Great Wall is a famous landmark in China."
      ]
    },
    "parameters": {
      "top_n": 2,
      "return_documents": true
    }
  }'
```

```Python
import requests

resp = requests.post(
    "https://zenmux.ai/api/v1/rerank",
    headers={
        "Authorization": "Bearer <your_ZENMUX_API_KEY>",
        "Content-Type": "application/json",
    },
    json={
        "model": "qwen/qwen3-rerank",
        "input": {
            "query": "What is the capital of China?",
            "documents": [
                "Beijing is the capital of China.",
                "Shanghai is the largest city in China.",
                "The Great Wall is a famous landmark in China.",
            ],
        },
        "parameters": {"top_n": 2, "return_documents": True},
    },
)

print(resp.json())
```

```TypeScript
const resp = await fetch("https://zenmux.ai/api/v1/rerank", {
  method: "POST",
  headers: {
    Authorization: "Bearer <ZENMUX_API_KEY>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "qwen/qwen3-rerank",
    input: {
      query: "What is the capital of China?",
      documents: [
        "Beijing is the capital of China.",
        "Shanghai is the largest city in China.",
        "The Great Wall is a famous landmark in China.",
      ],
    },
    parameters: { top_n: 2, return_documents: true },
  }),
});

console.log(await resp.json());
```

:::

::: api-response

```json
{
  "object": "list",
  "model": "qwen/qwen3-rerank",
  "results": [
    {
      "index": 0,
      "relevance_score": 0.98,
      "document": "Beijing is the capital of China."
    },
    {
      "index": 2,
      "relevance_score": 0.42,
      "document": "The Great Wall is a famous landmark in China."
    }
  ],
  "usage": {
    "prompt_tokens": 32,
    "total_tokens": 32
  }
}
```

:::

## Multimodal Rerank Example

Multimodal rerank models can rank image or video documents against a text query. Pass content objects instead of plain strings for `query` and/or `documents`.

::: api-request POST /api/v1/rerank

```bash [cURL]curl https://zenmux.ai/api/v1/rerank \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "alibaba/gte-multimodal-rerank",
    "input": {
      "query": { "text": "a cat playing with a ball" },
      "documents": [
        { "image": "https://example.com/cat.jpg" },
        { "image": "https://example.com/dog.jpg" },
        { "text": "A cat is chasing a red ball across the room." }
      ]
    },
    "parameters": {
      "top_n": 2
    }
  }'
```

:::

::: api-response

```json
{
  "object": "list",
  "model": "alibaba/gte-multimodal-rerank",
  "results": [
    { "index": 0, "relevance_score": 0.91 },
    { "index": 2, "relevance_score": 0.77 }
  ],
  "usage": {
    "prompt_tokens": 18,
    "total_tokens": 1042,
    "image_tokens": 1024
  }
}
```

:::
