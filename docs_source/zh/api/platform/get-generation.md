---
pageClass: api-page
title: 接口
---

# Get generation

```
GET https://zenmux.ai/api/v1/generation?id=<generation_id>
```

Get generation 接口用于查询生成信息，如用量和费用等。

## Request params

### generate_id `string` <font color="red">必选</font>

[Create Chat Completion](../openai/create-chat-completion.md) 接口返回的 generation id。

## Returns

### api `string`

API 类型，例如 `chat.completions`。

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
