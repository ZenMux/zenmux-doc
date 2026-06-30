---
pageClass: api-page
title: API
head:
  - - meta
    - name: description
      content: 根据查询对文档进行相关性重排序
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, rerank, 重排序, 检索, 相关性, 多模态, Qwen
---

# 文档重排序（Rerank）

::: tip 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```http
POST https://zenmux.ai/api/v1/rerank
```

Rerank 接口根据文档与查询的相关性对一组文档重新排序，并为每个文档返回相关性分数。常用于检索增强生成（RAG）流程中，对一阶段召回的结果进行精排后再传递给模型。

接口同时支持**文本**和**多模态**（文本 / 图片 / 视频）重排序模型，可用的模态取决于所选模型。

## 请求头

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer Token 鉴权。

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

请求内容类型，默认为 `application/json`。

## 请求参数

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

要使用的模型 ID，格式为 `<provider>/<model-name>`，例如 `alibaba/gte-rerank-v2`。

### input `object` <span style="color: #FA6062; font-weight: 400">\*</span>

重排序输入，包含查询以及待排序的文档列表。

#### input.query `string 或 object` <span style="color: #FA6062; font-weight: 400">\*</span>

用于对文档进行相关性排序的查询。

- 文本重排序模型：传入纯 `string`。
- 多模态重排序模型：可传入内容对象，如 `{ "text": "..." }`、`{ "image": "<url-或-base64>" }`、`{ "video": "<url-或-base64>" }`。

#### input.documents `array` <span style="color: #FA6062; font-weight: 400">\*</span>

待排序的文档数组，不能为空。每个元素的形式与 `query` 相同：

- 文本重排序传入纯 `string`，或
- 多模态重排序传入内容对象（`{ "text": ... }` / `{ "image": ... }` / `{ "video": ... }`）。

::: warning 多模态输入
图片和视频内容可以通过公网可访问的 URL 或 Base64 编码数据传入。支持较大的 Base64 数据，请求体大小限制以平台配置为准。
:::

### parameters `object` <span style="color: #666; font-weight: 400; font-size: 14px"> 可选 </span>

额外的重排序选项。

#### parameters.top_n `integer` <span style="color: #666; font-weight: 400; font-size: 14px"> 可选 </span>

返回相关性排名前 N 的文档数量。不传时返回全部文档，并按相关性排序。

#### parameters.return_documents `boolean` <span style="color: #666; font-weight: 400; font-size: 14px"> 可选 </span>

是否在每条结果中返回原始文档内容。默认遵循供应商的行为（通常为 `false`）。

#### parameters.instruct `string` <span style="color: #666; font-weight: 400; font-size: 14px"> 可选 </span>

可选的指令，用于引导模型在本次请求中如何判定相关性。

#### parameters.fps `number` <span style="color: #666; font-weight: 400; font-size: 14px"> 可选 </span>

视频输入的抽帧帧率（fps）。仅对支持视频内容的多模态重排序模型生效。

## 响应

返回包含排序结果的 JSON 对象。

### object `string`

对象类型，固定为 `list`。

### model `string`

执行重排序所使用的模型名称。

### results `array`

排序结果数组，按相关性从高到低排列。

#### results object

##### index `integer`

该文档在原始 `input.documents` 数组中的下标。

##### relevance_score `number`

文档与查询的相关性分数，数值越大表示越相关。

##### document `string 或 object`

原始文档内容。仅当 `parameters.return_documents` 为 `true` 时返回。

### usage `object`

本次请求的 Token 用量信息。

- `prompt_tokens` `integer` — 输入消耗的 Token 数。
- `total_tokens` `integer` — 总消耗的 Token 数。
- `image_tokens` `integer` — 图片输入消耗的 Token 数。仅在包含图片的多模态请求中返回。

::: api-request POST /api/v1/rerank

```cURL
curl https://zenmux.ai/api/v1/rerank \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "alibaba/gte-rerank-v2",
    "input": {
      "query": "中国的首都是哪里？",
      "documents": [
        "北京是中国的首都。",
        "上海是中国最大的城市。",
        "长城是中国著名的地标。"
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
        "model": "alibaba/gte-rerank-v2",
        "input": {
            "query": "中国的首都是哪里？",
            "documents": [
                "北京是中国的首都。",
                "上海是中国最大的城市。",
                "长城是中国著名的地标。",
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
    model: "alibaba/gte-rerank-v2",
    input: {
      query: "中国的首都是哪里？",
      documents: ["北京是中国的首都。", "上海是中国最大的城市。", "长城是中国著名的地标。"],
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
  "model": "alibaba/gte-rerank-v2",
  "results": [
    {
      "index": 0,
      "relevance_score": 0.98,
      "document": "北京是中国的首都。"
    },
    {
      "index": 2,
      "relevance_score": 0.42,
      "document": "长城是中国著名的地标。"
    }
  ],
  "usage": {
    "prompt_tokens": 32,
    "total_tokens": 32
  }
}
```

:::

## 多模态重排序示例

多模态重排序模型可以将图片或视频文档与文本查询进行相关性排序。此时 `query` 和/或 `documents` 需传入内容对象，而非纯字符串。

::: api-request POST /api/v1/rerank

```cURL
curl https://zenmux.ai/api/v1/rerank \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "alibaba/gte-multimodal-rerank",
    "input": {
      "query": { "text": "一只猫在玩球" },
      "documents": [
        { "image": "https://example.com/cat.jpg" },
        { "image": "https://example.com/dog.jpg" },
        { "text": "一只猫在房间里追逐一个红色的球。" }
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
