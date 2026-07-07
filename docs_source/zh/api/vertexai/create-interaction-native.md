---
pageClass: api-page
title: 创建交互（原生协议）
head:
  - - meta
    - name: description
      content: Zenmux documentation - create a multi-modal interaction via the native Google Interactions protocol
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, interactions, native, 原生协议, google, multimodal, video generation
---

# ZenMux 原生 API: 创建交互

::: info 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

### 创建交互：

```http
POST https://zenmux.ai/api/v1/interactions
POST https://zenmux.ai/api/v1beta1/interactions
```

两个路径等价——`/api/v1beta1/interactions` 是 `/api/v1/interactions` 的别名。

该接口调用**原生 Google Interactions API v1 协议**——一个有状态的多模态生成协议，支持文本 / 图像 / 视频 / 文件输入，产出文本与视频。请求体直接采用 Google 原生的 Interactions 结构，无需 SDK，使用标准 `Authorization: Bearer` 鉴权。上游参考：[Google Interactions API v1](https://ai.google.dev/api/interactions-api-v1)。

::: tip 模型写在请求体中
与 [Generate Content（Vertex AI 协议）](/zh/api/vertexai/generate-content) 接口把模型放在 URL 路径上不同，Interactions 协议把模型放在请求**体**里的 `"model"` 字段，路径为扁平的 `POST /api/v1/interactions`（或 `/api/v1beta1/interactions`）。
:::

请求体基本会**原样**转发给上游供应商。ZenMux 仅会：

- 在转发前剥离其内部路由字段（`provider`、`model_routing_config`），并
- 将 `model` 字段改写为上游供应商的模型名，再把响应中回显的 `model` 改写回 ZenMux 的模型标识（slug）。

下文未列出的字段将原样透传给供应商，并由供应商按模型进行校验；不支持的字段会返回原生错误。

## 支持的模型

| 模型                       | 输入                      | 输出        |
| -------------------------- | ------------------------- | ----------- |
| `google/gemini-omni-flash` | 文本 / 图像 / 视频 / 文件 | 文本 / 视频 |

::: info 更多模型
访问 [ZenMux 模型列表](https://zenmux.ai/models) 搜索查看所有可用模型。
:::

## 鉴权参数

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

请求头，格式为 `Bearer $ZENMUX_API_KEY`，使用你的 ZenMux API Key 进行鉴权。

## 请求体

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

用于本次交互的模型标识，格式为 `{provider}/{model}`，例如 `google/gemini-omni-flash`。ZenMux 据此解析并路由请求，随后在转发前将其改写为供应商的模型名。

### input `Content | string` <span style="color: #FA6062; font-weight: 400">\*</span>

交互的用户输入。可以是纯字符串（文本提示词），也可以是承载文本、图像、视频或文件片段的原生多模态 `Content` 结构。支持的输入模态：**文本**、**图像**、**视频**、**文件**。

### system_instruction `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

系统级指令，用于引导模型的行为。

### tools `array` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

声明模型可调用的工具（如 grounding / 搜索工具），透传给供应商。

### generation_config `object` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

模型生成参数，透传给供应商。常见字段包括：

- `temperature` `number`：输出随机性。
- `top_p` `number`：核采样阈值。
- `max_output_tokens` `integer`：响应最大长度。
- `thinking_level` `string`：推理强度，取值 `minimal` | `low` | `medium` | `high`。
- `stop_sequences` `string[]`：终止生成的序列。

### response_format `object` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

用于结构化输出的 JSON Schema 约束，透传给供应商。

### stream `boolean` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

为 `true` 时，响应以 Server-Sent Events（SSE）方式增量返回；省略或为 `false` 时返回单个 JSON。默认为 `false`。注意流式支持因模型而异——部分模型（如 `gemini-omni-flash-preview`）不支持流式，传入 `stream: true` 会被拒绝。

::: info 字段透传
其他原生 Interactions 字段（如 `store`、`background` 等）以及未列出的原生字段都会原样转发给供应商。完整字段列表请参见[上游规范](https://ai.google.dev/api/interactions-api-v1)。
:::

## 响应

### 非流式响应

单个 JSON 对象（原生 Google Interactions 响应，原样透传，仅将 `model` 字段改写为 ZenMux 的 slug）。

```json
{
  "id": "v1_ChdPU0F4YWFtNkFwS2kxZThQZ05lbXdROBIX",
  "model": "google/gemini-omni-flash",
  "object": "interaction",
  "status": "completed",
  "created": "2026-07-03T12:25:15Z",
  "updated": "2026-07-03T12:25:15Z",
  "steps": [
    {
      "type": "model_output",
      "content": [{ "type": "text", "text": "The capital of France is Paris." }]
    }
  ],
  "usage": {
    "total_input_tokens": 7,
    "input_tokens_by_modality": [{ "modality": "text", "tokens": 7 }],
    "total_cached_tokens": 0,
    "total_output_tokens": 10,
    "total_thought_tokens": 0,
    "total_tokens": 17
  }
}
```

#### id `string`

交互的唯一标识。

#### model `string`

本次交互使用的 ZenMux 模型标识（由供应商模型名改写而来）。

#### status `string`

交互状态，取值 `in_progress` | `requires_action` | `completed` | `failed` | `cancelled` | `incomplete`。

#### steps `array`

交互序列——用户输入、模型输出、工具调用与工具结果。每个 step 都有 `type` 与 `content` 数组，其片段承载生成的 `text`、`video` 等模态。

#### usage `object`

本次交互的 Token 计量：

- `total_input_tokens` `integer`：输入 Token 总数。
- `input_tokens_by_modality` `array`：按模态划分的输入明细，每项为 `{ "modality": string, "tokens": integer }`。
- `total_cached_tokens` `integer`：缓存内容 Token 数。
- `total_output_tokens` `integer`：生成的响应 Token 数。
- `total_thought_tokens` `integer`：推理 Token 数（思考型模型）。
- `total_tokens` `integer`：累计总数。
- `grounding_tool_count` `array`：各工具的 grounding 调用次数，每项为 `{ "type": string, "count": integer }`。

### 流式响应（SSE）

当 `stream: true` 时，响应为描述交互生命周期的一串 Server-Sent Events：

| 事件                        | 触发时机       | 关键字段                                          |
| --------------------------- | -------------- | ------------------------------------------------- |
| `interaction.created`       | 流开始         | `interaction`（部分）、`event_id`                 |
| `interaction.status_update` | 状态变化       | `interaction_id`、`status`                        |
| `step.start`                | 某个 step 开始 | `index`、`step`                                   |
| `step.delta`                | 内容到达       | `index`、`delta`（text \| image \| video \| ...） |
| `step.stop`                 | 某个 step 完成 | `index`                                           |
| `interaction.completed`     | 全部完成       | `interaction`（完整）                             |
| `error`                     | 发生错误       | `error`（`code`、`message`）                      |

每个事件都可能带有 `metadata` 对象，其中包含累计的 `total_usage`（字段与非流式的 `usage` 块相同）。

::: api-request POST /api/v1/interactions

```bash
# 非流式：返回单个 JSON
curl -X POST "https://zenmux.ai/api/v1/interactions" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/gemini-omni-flash",
    "input": "What is the capital of France?",
    "generation_config": { "max_output_tokens": 100 }
  }'

# 多模态输入：通过原生 content 结构传入文本 + 图像
curl -X POST "https://zenmux.ai/api/v1/interactions" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/gemini-omni-flash",
    "input": [
      {
        "role": "user",
        "content": [
          { "type": "text", "text": "Describe this scene, then animate it." },
          { "type": "image", "data": "<base64>", "mime_type": "image/png" }
        ]
      }
    ],
    "system_instruction": "You are a helpful creative assistant.",
    "generation_config": { "temperature": 0.8 }
  }'

# 流式：设置 stream: true 以增量接收 Server-Sent Events
curl -N -X POST "https://zenmux.ai/api/v1/interactions" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/gemini-omni-flash",
    "input": "Write a short poem about the sea.",
    "stream": true
  }'
```

:::

::: api-response

```json
// 非流式响应
{
  "id": "v1_ChdPU0F4YWFtNkFwS2kxZThQZ05lbXdROBIX",
  "model": "google/gemini-omni-flash",
  "object": "interaction",
  "status": "completed",
  "created": "2026-07-03T12:25:15Z",
  "updated": "2026-07-03T12:25:15Z",
  "steps": [
    {
      "type": "model_output",
      "content": [{ "type": "text", "text": "The capital of France is Paris." }]
    }
  ],
  "usage": {
    "total_input_tokens": 7,
    "input_tokens_by_modality": [{ "modality": "text", "tokens": 7 }],
    "total_cached_tokens": 0,
    "total_output_tokens": 10,
    "total_thought_tokens": 0,
    "total_tokens": 17
  }
}
```

```text
// 流式响应（stream: true）——SSE 生命周期事件
event: interaction.created
data: {"interaction":{"id":"v1_ChdP...","model":"google/gemini-omni-flash","status":"in_progress"},"event_id":"evt_0"}

event: step.start
data: {"index":0,"step":{"type":"model_output"}}

event: step.delta
data: {"index":0,"delta":{"type":"text","text":"The"}}

event: step.delta
data: {"index":0,"delta":{"type":"text","text":" sea"}}

event: step.stop
data: {"index":0}

event: interaction.completed
data: {"interaction":{"id":"v1_ChdP...","model":"google/gemini-omni-flash","status":"completed","usage":{"total_input_tokens":8,"total_output_tokens":24,"total_tokens":32}}}
```

:::
