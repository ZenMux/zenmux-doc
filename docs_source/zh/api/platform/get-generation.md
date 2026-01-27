---
pageClass: api-page
title: 接口
---

# Get generation

```
GET https://zenmux.ai/api/v1/generation?id=<generation_id>
```

Get generation 接口用于查询生成信息，如用量和费用等。

::: tip
本接口支持查询所有 API 协议的生成信息，包括 OpenAI Chat Completions、OpenAI Responses、Anthropic 和 Vertex AI 协议。
:::

::: warning ⚠️ 订阅制限制
本接口仅支持 **Pay As You Go（按量付费）** 的 API Key 查询计费信息。使用订阅制 API Key（以 `sk-ss-v1-` 开头）调用本接口将无法获取计费相关字段（如 `usage`、`ratingResponses` 等）。

如需获取计费信息，请使用 Pay As You Go API Key。详见：
- [Pay As You Go 使用指南](../../guide/pay-as-you-go.md)
- [订阅制使用指南](../../guide/subscription.md)
:::

## 计量与计费信息说明

### 计量信息（Token Usage）

**计量信息**（如 `nativeTokens` 字段中的 token 使用量）会按照不同通信协议原本的方式**随请求同步返回**：

- **OpenAI Chat Completions 协议**：在响应的 `usage` 字段中返回
- **OpenAI Responses 协议**：在响应的 `usage` 字段中返回
- **Anthropic 协议**：在响应的 `usage` 字段中返回
- **Vertex AI 协议**：在响应的 `usageMetadata` 字段中返回

### 计费信息（Billing & Costs）

**计费信息**（如 `usage`、`ratingResponses` 等费用相关字段）**暂不支持随请求同步返回**，需要在请求完成后 **3-5 分钟**通过本接口查询获取。

::: info 💡 功能升级中
我们正在完善升级计费架构，争取早日实现计费信息随请求同步返回，敬请期待！
:::

## Request params

### Authorization Header <font color="red">必选</font>

**请求头参数：**

```http
Authorization: Bearer <ZENMUX_API_KEY>
```

- **参数名**：`Authorization`
- **格式**：`Bearer <API_KEY>`
- **说明**：你的 ZenMux API Key
  - **Pay As You Go API Key**：支持查询完整的计量和计费信息
  - **订阅制 API Key**（以 `sk-ss-v1-` 开头）：仅支持查询计量信息，不支持计费信息

::: tip 💡 获取 API Key
- Pay As You Go API Key：登录 [ZenMux 控制台](https://zenmux.ai/platform/pay-as-you-go) 创建
- 订阅制 API Key：登录 [订阅管理页面](https://zenmux.ai/platform/subscription) 创建
:::

### generate_id `string` <font color="red">必选</font>

**查询参数：**

ZenMux API 接口返回的 generation id，可以从以下接口获得：

- [Create Chat Completion](../openai/create-chat-completion.md) - OpenAI Chat Completions 协议
- [Create a Model Response](../openai/openai-responses.md) - OpenAI Responses 协议
- [Create Messages](../anthropic/create-messages-new.md) - Anthropic 协议
- [Generate Content](../vertexai/generate-content.md) - Vertex AI 协议

## Returns

### api `string`

API 类型，根据调用的协议不同，取值如下：

- `chat.completions` - OpenAI Chat Completions 协议
- `responses` - OpenAI Responses 协议
- `messages` - Anthropic 协议
- `generateContent` - Vertex AI 协议

### generationId `string`

当前的 generation id。

### model `string`

模型 ID。

### createAt `string`

服务端收到推理调用请求的时间。

### generationTime `integer`

本次推理从首字到结束的持续时长，单位毫秒。

### latency `integer`

首字延时，单位毫秒。

### nativeTokens `object`

本次推理消耗的用量信息，包含以下字段：

- `completion_tokens` `integer` - 完成部分消耗的 token 数
- `prompt_tokens` `integer` - 提示部分消耗的 token 数
- `total_tokens` `integer` - 总 token 数
- `completion_tokens_details` `object` - 完成 token 的详细信息
  - `reasoning_tokens` `integer` - 推理部分消耗的 token 数
- `prompt_tokens_details` `object` - 提示 token 的详细信息
  - `cached_tokens` `integer` - 缓存的 token 数

### streamed `boolean`

是否是流式响应。

### finishReason `string`

模型结束推理的原因。

### usage `number`

本次推理消耗的 credit。

### ratingResponses `object`

计费响应信息，包含以下字段：

- `billAmount` `number` - 账单金额
- `discountAmount` `number` - 折扣金额
- `originAmount` `number` - 原始金额
- `priceVersion` `string` - 价格版本
- `ratingDetails` `array` - 计费详情数组，每项包含：
  - `billAmount` `number` - 账单金额
  - `discountAmount` `number` - 折扣金额
  - `feeItemCode` `string` - 费用项目代码（如 `completion`, `prompt`）
  - `originAmount` `number` - 原始金额
  - `rate` `number` - 费率

### requestRetryTimes `integer`

请求重试次数。

### finalRetry `boolean`

是否为最终重试

::: api-request GET /api/v1/generation

```cURL
curl https://zenmux.ai/api/v1/generation?id=<generation_id> \
  -H "Authorization: Bearer $ZENMUX_API_KEY"
```

:::
