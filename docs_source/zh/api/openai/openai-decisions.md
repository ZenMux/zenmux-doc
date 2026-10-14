---
pageClass: api-page
title: 结构化决策 API（Decisions）
head:
  - - meta
    - name: description
      content: 使用 OpenAI Decisions 对文本和图片进行判定、分类与评分，返回结构化答案及概率
  - - meta
    - name: keywords
      content: ZenMux, API, OpenAI, Decisions, gpt-6-luna, 结构化决策, 分类, 评分, 图片输入
---

# 结构化决策（Decisions）

::: tip 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取错误类型说明与排查方案。
:::

```http
POST https://zenmux.ai/api/v1/decisions
```

Decisions 接口针对一段 `input`（文本、图片或二者组合），按你定义的 `questions`（问题）进行评估，并返回结构化的 `answers`（答案）。一个请求可以包含多个问题，答案顺序与问题顺序一致。

每个问题可以是以下三种类型之一：

- **predicate**：是/否判定，返回条件成立的概率。
- **choice**：从指定选项中选择一项，返回选中项、各选项的概率及确信度。
- **score**：按有序等级评分，返回等级序号的概率加权平均值、各等级的概率及确信度。

请求参数与 [OpenAI Decisions 创建接口](https://developers.openai.com/api/reference/typescript/resources/decisions/methods/create) 保持一致；通过 ZenMux 调用时，使用 ZenMux API Key、上述接口地址和带供应商前缀的模型 ID。

该接口返回非流式 JSON，不接受 `stream` 参数。它不提供 `reasoning`、`reasoning_effort`、`temperature`、`tools` 或 `response_format` 等参数。需要自定义 JSON Schema 或工具调用时，请使用 [Responses API](/zh/api/openai/openai-responses)。

## 请求头

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer Token 鉴权，格式为 `Bearer <ZENMUX_API_KEY>`。

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

请求内容类型为 `application/json`。

## 请求参数

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

要使用的模型 ID。OpenAI 当前支持 `gpt-6-luna`，在 ZenMux 中填写 `openai/gpt-6-luna`。

### input `string 或 array` <span style="color: #FA6062; font-weight: 400">\*</span>

所有问题共同评估的输入。可以是纯文本字符串，也可以是包含文本和图片的用户消息数组。整个请求最多包含 128 张图片，不支持文件、音频、工具调用或已有输入项引用。

#### input[] `object`

消息数组中的每一项包含：

- `role` `string`（必填）— 固定为 `user`。
- `type` `string`（可选）— 固定为 `message`。
- `content` `string 或 array`（必填）— 文本字符串，或由以下内容片段组成的数组。

##### input_text `object`

- `type` `string`（必填）— 固定为 `input_text`。
- `text` `string`（必填）— 文本内容。

##### input_image `object`

- `type` `string`（必填）— 固定为 `input_image`。
- `image_url` `string`（必填）— 图片地址。当前 OpenAI 创建接口定义接受 Base64 data URL（例如 `data:image/png;base64,...`）或公开可访问的 HTTP(S) 图片 URL；不支持 `file_id`。
- `detail` `string 或 null`（可选）— 图片细节级别，可选 `low`、`high`、`auto`、`original`，默认 `auto`，具体处理方式由模型的图片配置决定。

::: tip 图片格式
OpenAI 的创建接口参考与指南目前对 HTTP(S) 图片 URL 的说明不一致：接口参考列出支持，指南仍要求内联 Base64 data URL。建议使用本页图片示例中的 Base64 格式。
:::

### questions `array` <span style="color: #FA6062; font-weight: 400">\*</span>

包含 1–200 个问题，每个问题的类型可以不同。答案按问题顺序返回。

#### questions[] `object`

所有问题包含以下公共字段：

- `type` `string`（必填）— `predicate`、`choice` 或 `score`。
- `instructions` `string`（必填）— 要模型判断的内容及判断标准。
- `name` `string`（可选）— 问题名称，响应会原样返回；省略时，对应答案的 `name` 为 `null`。建议使用唯一名称，便于关联答案。

##### predicate 问题

估计输入是否满足 `instructions` 描述的条件，不需要额外的选项或等级字段。

##### choice 问题

必须提供 `choices` 数组，包含 2–255 个选项。每个选项包含：

- `value` `string 或 boolean`（必填）— 选项值，各项必须唯一。字符串与布尔值按类型区分，例如 `"true"` 与 `true` 是不同的值。
- `description` `string`（可选）— 选项的含义或适用条件。

##### score 问题

必须提供 `levels` 数组，按评分顺序描述各个等级。每个等级包含：

- `label` `string`（必填）— 等级标签。
- `description` `string`（可选）— 等级的含义或评分标准。

等级序号从 0 开始。`score` 是这些序号按概率加权后的平均值，可以落在两个等级之间。

### safety_identifier `string 或 null` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

由调用方提供的终端用户标识，在已验证的组织范围内生效。它不是 API 鉴权身份，不替代 `Authorization`。

## 响应

返回包含 `model`、`answers` 和 `usage` 的 JSON 对象。示例中的概率和 Token 数用于展示结构，实际值随输入和模型结果变化。

### model `string`

执行本次评估所使用的模型 ID，例如 `openai/gpt-6-luna`。

### answers `array`

与 `questions` 顺序一致的答案数组。每个答案包含 `type` 和 `name`；`name` 为请求中的问题名称，未指定时为 `null`。

#### answers[] `object`

- **predicate 答案**
  - `type` `string` — 固定为 `predicate`。
  - `probability` `number` — 条件成立的估计概率，取值为 0 到 1。
- **choice 答案**
  - `type` `string` — 固定为 `choice`。
  - `choice` `string 或 boolean` — 选中的选项值，保留原始类型。
  - `probabilities` `array` — 每项包含选项 `value`（字符串或布尔值）和 `probability`（概率）。
  - `confidence` `number` — 答案的确信度。
- **score 答案**
  - `type` `string` — 固定为 `score`。
  - `score` `number` — 等级序号的概率加权平均值。
  - `probabilities` `array` — 每项包含等级序号 `value`（从 0 开始的整数）、`label` 和 `probability`。
  - `confidence` `number` — 答案的确信度。
- **refusal 答案**
  - `type` `string` — 固定为 `refusal`。
  - `name` `string 或 null` — 被拒答的问题名称。
  - 任意问题都可能返回拒答，同一请求中的其他问题仍可正常返回答案。读取概率、选项或评分前，应先检查 `type`。

### usage `object`

本次请求的 Token 用量信息：

- `input_tokens` `integer` — 输入 Token 数。
- `input_tokens_details` `object`
  - `cached_tokens` `integer` — 命中缓存的输入 Token 数。
  - `cache_write_tokens` `integer` — 写入缓存的 Token 数。
- `output_tokens` `integer` — 输出 Token 数。
- `output_tokens_details` `object`
  - `reasoning_tokens` `integer` — 推理 Token 数。
- `total_tokens` `integer` — 总 Token 数。

`reasoning_tokens` 是用量统计字段，不是推理开关；其存在不表示接口支持配置推理强度。计费以 [模型页面](https://zenmux.ai/models) 公布的价格为准。

## 图片输入示例

以下示例读取本地 `product.png`，转换成 Base64 data URL 后判断产品是否有可见损伤。`ZENMUX_API_KEY` 从环境变量读取。

```python
import base64
import os
from pathlib import Path
import requests

image_base64 = base64.b64encode(Path("product.png").read_bytes()).decode("ascii")
resp = requests.post(
    "https://zenmux.ai/api/v1/decisions",
    headers={"Authorization": f"Bearer {os.environ['ZENMUX_API_KEY']}"},
    json={
        "model": "openai/gpt-6-luna",
        "input": [{
            "role": "user",
            "content": [
                {"type": "input_text", "text": "Inspect the product in this photo."},
                {"type": "input_image", "image_url": f"data:image/png;base64,{image_base64}"},
            ],
        }],
        "questions": [{
            "type": "predicate",
            "name": "visible_damage",
            "instructions": "Does the product have visible damage, such as a crack, tear, or dent?",
        }],
    },
    timeout=90,
)
resp.raise_for_status()
print(resp.json())
```

相关定义请参阅 [OpenAI 创建接口](https://developers.openai.com/api/reference/typescript/resources/decisions/methods/create) 和 [Decisions 指南](https://developers.openai.com/api/docs/guides/decisions)。

::: api-request POST /api/v1/decisions

```cURL
curl https://zenmux.ai/api/v1/decisions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "openai/gpt-6-luna",
    "input": "The parcel arrived with a torn box and a cracked screen.",
    "questions": [
      {
        "type": "predicate",
        "name": "damaged",
        "instructions": "Does the input describe a damaged product?"
      },
      {
        "type": "choice",
        "name": "action",
        "instructions": "Choose the appropriate action.",
        "choices": [{"value": "replace"}, {"value": "no_action"}]
      },
      {
        "type": "score",
        "name": "severity",
        "instructions": "Rate the damage severity.",
        "levels": [{"label": "minor"}, {"label": "major"}]
      }
    ]
  }'
```

```Python
import os
import requests

resp = requests.post(
    "https://zenmux.ai/api/v1/decisions",
    headers={
        "Authorization": f"Bearer {os.environ['ZENMUX_API_KEY']}",
        "Content-Type": "application/json",
    },
    json={
        "model": "openai/gpt-6-luna",
        "input": "The parcel arrived with a torn box and a cracked screen.",
        "questions": [
            {
                "type": "predicate",
                "name": "damaged",
                "instructions": "Does the input describe a damaged product?",
            },
            {
                "type": "choice",
                "name": "action",
                "instructions": "Choose the appropriate action.",
                "choices": [{"value": "replace"}, {"value": "no_action"}],
            },
            {
                "type": "score",
                "name": "severity",
                "instructions": "Rate the damage severity.",
                "levels": [{"label": "minor"}, {"label": "major"}],
            },
        ],
    },
    timeout=90,
)
resp.raise_for_status()
print(resp.json())
```

```TypeScript
const resp = await fetch("https://zenmux.ai/api/v1/decisions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.ZENMUX_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "openai/gpt-6-luna",
    input: "The parcel arrived with a torn box and a cracked screen.",
    questions: [
      {
        type: "predicate",
        name: "damaged",
        instructions: "Does the input describe a damaged product?",
      },
      {
        type: "choice",
        name: "action",
        instructions: "Choose the appropriate action.",
        choices: [{ value: "replace" }, { value: "no_action" }],
      },
      {
        type: "score",
        name: "severity",
        instructions: "Rate the damage severity.",
        levels: [{ label: "minor" }, { label: "major" }],
      },
    ],
  }),
});

if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
console.log(await resp.json());
```

:::

::: api-response

```json
{
  "model": "openai/gpt-6-luna",
  "answers": [
    { "type": "predicate", "name": "damaged", "probability": 1 },
    {
      "type": "choice",
      "name": "action",
      "choice": "replace",
      "probabilities": [
        { "value": "replace", "probability": 1 },
        { "value": "no_action", "probability": 0 }
      ],
      "confidence": 1
    },
    {
      "type": "score",
      "name": "severity",
      "score": 0.89,
      "probabilities": [
        { "value": 0, "label": "minor", "probability": 0.11 },
        { "value": 1, "label": "major", "probability": 0.89 }
      ],
      "confidence": 0.78
    }
  ],
  "usage": {
    "input_tokens": 373,
    "input_tokens_details": { "cached_tokens": 0, "cache_write_tokens": 0 },
    "output_tokens": 0,
    "output_tokens_details": { "reasoning_tokens": 0 },
    "total_tokens": 373
  }
}
```

:::
