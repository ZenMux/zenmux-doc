---
pageClass: api-page
title: API
---

# Get generation

```
GET https://zenmux.ai/api/v1/generation?id=<generation_id>
```

The Get generation endpoint is used to query generation details, such as usage and cost.

::: tip
This endpoint supports querying generation details for all API protocols, including OpenAI Chat Completions, OpenAI Responses, Anthropic, and Vertex AI.
:::

## Request params

### generate_id `string` <font color="red">Required</font>

The generation ID returned by the ZenMux API, which you can obtain from the following endpoints:

- [Create Chat Completion](../openai/create-chat-completion.md) - OpenAI Chat Completions protocol
- [Create a Model Response](../openai/openai-responses.md) - OpenAI Responses protocol
- [Create Messages](../anthropic/create-messages-new.md) - Anthropic protocol
- [Generate Content](../vertexai/generate-content.md) - Vertex AI protocol

## Returns

### api `string`

The API type. Depending on the protocol used, the possible values are:

- `chat.completions` - OpenAI Chat Completions protocol
- `responses` - OpenAI Responses protocol
- `messages` - Anthropic protocol
- `generateContent` - Vertex AI protocol

### generationId `string`

The current generation ID.

### model `string`

Model ID.

### createAt `string`

The time when the server received the inference request.

### generationTime `integer`

The duration of this inference from the first token to completion, in milliseconds.

### latency `integer`

Time to first token, in milliseconds.

### nativeTokens `object`

Usage details for this inference, including the following fields:

- `completion_tokens` `integer` - Number of tokens consumed by the completion
- `prompt_tokens` `integer` - Number of tokens consumed by the prompt
- `total_tokens` `integer` - Total number of tokens
- `completion_tokens_details` `object` - Detailed completion token information
  - `reasoning_tokens` `integer` - Number of tokens consumed by reasoning
- `prompt_tokens_details` `object` - Detailed prompt token information
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
- `priceVersion` `string` - Price version
- `ratingDetails` `array` - Billing details array. Each item includes:
  - `billAmount` `number` - Billed amount
  - `discountAmount` `number` - Discount amount
  - `feeItemCode` `string` - Fee item code (e.g., `completion`, `prompt`)
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