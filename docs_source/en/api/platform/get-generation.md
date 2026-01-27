---
pageClass: api-page
title: Get Generation
---

# Get generation

```
GET https://zenmux.ai/api/v1/generation?id=<generation_id>
```

The Get generation endpoint is used to retrieve generation details, such as usage and cost.

## Request params

### generate_id `string` <font color="red">Required</font>

The generation id returned by the [Create Chat Completion](../openai/create-chat-completion.md) endpoint.

## Returns

### api `string`

The API type, e.g. `chat.completions`.

### generationId `string`

The current generation id.

### model `string`

The model ID.

### createAt `string`

The time when the server received the inference request.

### generationTime `integer`

The duration of this inference from the first token to completion, in milliseconds.

### latency `integer`

Time to first token, in milliseconds.

### nativeTokens `object`

Usage details consumed by this inference, including the following fields:

- `completion_tokens` `integer` - Number of tokens consumed by the completion
- `prompt_tokens` `integer` - Number of tokens consumed by the prompt
- `total_tokens` `integer` - Total number of tokens
- `completion_tokens_details` `object` - Detailed breakdown for completion tokens
  - `reasoning_tokens` `integer` - Number of tokens consumed by reasoning
- `prompt_tokens_details` `object` - Detailed breakdown for prompt tokens
  - `cached_tokens` `integer` - Number of cached tokens

### streamed `boolean`

Whether the response is streamed.

### finishReason `string`

The reason the model stopped generating.

### usage `number`

Credits consumed by this inference.

### ratingResponses `object`

Billing response details, including the following fields:

- `billAmount` `number` - Billed amount
- `discountAmount` `number` - Discount amount
- `originAmount` `number` - Original amount
- `priceVersion` `string` - Pricing version
- `ratingDetails` `array` - Array of billing details; each item includes:
  - `billAmount` `number` - Billed amount
  - `discountAmount` `number` - Discount amount
  - `feeItemCode` `string` - Fee item code (e.g. `completion`, `prompt`)
  - `originAmount` `number` - Original amount
  - `rate` `number` - Rate

### requestRetryTimes `integer`

Number of request retries.

### finalRetry `boolean`

Whether this is the final retry.

::: api-request GET /api/v1/generation

```cURL
curl https://zenmux.ai/api/v1/generation?id=<generation_id> \
  -H "Authorization: Bearer $ZENMUX_API_KEY"
```

:::