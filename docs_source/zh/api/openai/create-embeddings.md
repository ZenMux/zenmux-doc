---
pageClass: api-page
title: OpenAI 向量嵌入 API
head:
  - - meta
    - name: description
      content: Create an Embedding
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, create, embeddings, OpenAI, vector, text-embedding
---

# Create an Embedding

::: tip 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```http
POST https://zenmux.ai/api/v1/embeddings
```

Create an Embedding 接口兼容 OpenAI 的 [Create an Embedding](https://platform.openai.com/docs/api-reference/embeddings/create) 接口，用于将输入转换为向量表示（embedding）。

## Request headers

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer Token 鉴权

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

请求内容类型，默认值为 `application/json`

## Request

### input `string or array or object` <span style="color: #FA6062; font-weight: 400">\*</span>

要生成 embedding 的输入。如需在单个请求中分别嵌入多段文本，请传递字符串数组。

支持的输入类型：

- `string` — 将被转化为 embedding 的文本字符串
- `array of strings` — 将被转化为 embedding 的文本字符串数组
- `array of integers` — 将被转化为 embedding 的 token 整数数组
- `array of integer arrays` — 将被转化为 embedding 的 token 整数二维数组

- `object` — 包含 `content` 数组的多模态输入对象

::: warning 输入限制

- 单个输入不能超过模型的最大输入 token 数（例如 `text-embedding-3` 系列为 8192 tokens）
- 输入不能为空字符串
- 数组长度不能超过 2048
- 单次请求中所有输入的 token 总数不能超过 300,000
:::

#### 多模态输入

将 `input` 设为包含 `content` 的对象。`content` 至少包含一个内容项，每项用 `type` 指定类型。同一个数组可以组合不同类型的内容，具体支持的模态、格式与大小限制取决于所选模型。

| `type`        | 必填字段                                        | 可选字段                                   |
| ------------- | ----------------------------------------------- | ------------------------------------------ |
| `text`        | `text`，非空文本字符串                          |                                            |
| `image_url`   | `image_url.url`，图片 URL 或 Base64 Data URL    |                                            |
| `input_audio` | `input_audio.data`，音频 URL 或 Base64 Data URL | `input_audio.format`，格式字符串，如 `mp3` |
| `input_video` | `input_video.data`，视频 URL 或 Base64 Data URL | `input_video.format`，格式字符串，如 `mp4` |
| `input_file`  | `input_file.data`，文件 URL 或 Base64 Data URL  | `input_file.format`，格式字符串，如 `pdf`  |

表中所有必填字段的值均为非空字符串。内联媒体使用带 MIME 类型的 Base64 Data URL，例如 `data:video/mp4;base64,…`。

以下请求体使用 `google/gemini-embedding-2` 组合文本和图片。调用前请将示例图片 URL 替换为实际地址，或传入图片的 Base64 Data URL。

```json
{
  "model": "google/gemini-embedding-2",
  "input": {
    "content": [
      { "type": "text", "text": "A mountain lake at sunset" },
      {
        "type": "image_url",
        "image_url": { "url": "https://example.com/lake.jpg" }
      }
    ]
  }
}
```

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

要使用的模型 ID，格式为 `<供应商>/<模型名称>`。

示例 embedding 模型：

- `openai/text-embedding-3-large` — 高精度 embedding 模型，输出维度 3072
- `openai/text-embedding-3-small` — 高效 embedding 模型，输出维度 1536

### encoding_format `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

返回 embedding 的编码格式。

- `float` — 以浮点数数组形式返回（默认）
- `base64` — 以 Base64 编码字符串形式返回

### dimensions `integer` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

输出 embedding 的维度数。仅 `text-embedding-3` 及更新模型支持。

通过指定较小的维度，可以在不显著损失语义表达能力的前提下缩短 embedding 向量，从而降低存储和检索成本。

### user `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

代表终端用户的唯一标识符，可帮助监控和检测滥用行为。

## Response

返回一个包含 embedding 向量列表的 JSON 对象。

### object `string`

对象类型，固定为 `list`。

### data `array`

embedding 对象数组，每个元素包含一个输入的 embedding 结果。

#### data 对象

##### object `string`

对象类型，固定为 `embedding`。

##### embedding `array of float`

embedding 向量，由浮点数列表组成。向量长度取决于所使用的模型及 `dimensions` 参数。

##### index `integer`

该 embedding 在输入列表中对应的索引位置。

### model `string`

生成 embedding 所使用的模型名称。

### usage `object`

本次请求的 token 用量信息。

- `prompt_tokens` `integer` — 输入消耗的 token 数
- `total_tokens` `integer` — 总消耗 token 数

::: api-request POST /api/v1/embeddings

```TypeScript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://zenmux.ai/api/v1', // [!code highlight]
  apiKey: '<ZENMUX_API_KEY>', // [!code highlight]
});

async function main() {
  const embedding = await openai.embeddings.create({
    model: "openai/text-embedding-3-small",
    input: "ZenMux is an LLM API aggregation service.",
    encoding_format: "float",
  });

  console.log(embedding.data[0].embedding);
}

main();
```

```Python
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",  # [!code highlight]
    api_key="<your_ZENMUX_API_KEY>",  # [!code highlight]
)

embedding = client.embeddings.create(
    model="openai/text-embedding-3-small",
    input="ZenMux is an LLM API aggregation service.",
    encoding_format="float",
)

print(embedding.data[0].embedding)
```

```cURL
curl https://zenmux.ai/api/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "openai/text-embedding-3-small",
    "input": "ZenMux is an LLM API aggregation service.",
    "encoding_format": "float"
  }'
```

:::

::: api-response

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "embedding": [
        0.0023064255, -0.009327292, -0.0028842222, 0.018182484, -0.012395813,
        0.0073498537, -0.020456877, 0.0118837105, 0.015375832, -0.0036487724
      ],
      "index": 0
    }
  ],
  "model": "openai/text-embedding-3-small",
  "usage": {
    "prompt_tokens": 9,
    "total_tokens": 9
  }
}
```

:::
