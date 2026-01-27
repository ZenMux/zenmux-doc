---
pageClass: api-page
title: API
---

# Get generation

```
GET https://zenmux.ai/api/v1/generation?id=<generation_id>
```

The Get generation endpoint is used to retrieve generation details, such as usage and costs.

::: tip
This endpoint supports retrieving generation details for all API protocols, including OpenAI Chat Completions, OpenAI Responses, Anthropic, and Vertex AI.
:::

::: warning ⚠️ Subscription Plan Limitations
This endpoint only supports billing queries for **Pay As You Go** API keys. If you call this endpoint with a subscription-plan API key (prefixed with `sk-ss-v1-`), billing-related fields (such as `usage`, `ratingResponses`, etc.) will not be returned.

To retrieve billing information, please use a Pay As You Go API key. See:
- [Pay As You Go Guide](../../guide/pay-as-you-go.md)
- [Subscription Guide](../../guide/subscription.md)
:::

## Metering and Billing Information

### Metering (Token Usage)

**Metering data** (e.g., token usage in the `nativeTokens` field) is returned **synchronously with the request** in the protocol’s native format:

- **OpenAI Chat Completions protocol**: returned in the response `usage` field
- **OpenAI Responses protocol**: returned in the response `usage` field
- **Anthropic protocol**: returned in the response `usage` field
- **Vertex AI protocol**: returned in the response `usageMetadata` field

### Billing (Billing & Costs)

**Billing data** (cost-related fields such as `usage`, `ratingResponses`, etc.) is **not currently returned synchronously** with the request. After the request completes, you must query it via this endpoint **3–5 minutes** later.

::: info 💡 Billing upgrade in progress
We’re improving and upgrading our billing architecture to enable synchronous billing data in responses as soon as possible. Stay tuned!
:::

## Request params

### Authorization Header <font color="red">Required</font>

**Header parameters:**

```http
Authorization: Bearer <ZENMUX_API_KEY>
```

- **Name**: `Authorization`
- **Format**: `Bearer <API_KEY>`
- **Description**: Your ZenMux API key
  - **Pay As You Go API key**: supports querying full metering and billing information
  - **Subscription API key** (prefixed with `sk-ss-v1-`): supports metering only; billing information is not supported

::: tip 💡 Get an API key
- Pay As You Go API key: create one in the [ZenMux Console](https://zenmux.ai/platform/pay-as-you-go)
- Subscription API key: create one in the [Subscription Management](https://zenmux.ai/platform/subscription)
:::

### generate_id `string` <font color="red">Required</font>

**Query parameters:**

The generation id returned by ZenMux API endpoints. You can obtain it from:

- [Create Chat Completion](../openai/create-chat-completion.md) - OpenAI Chat Completions protocol
- [Create a Model Response](../openai/openai-responses.md) - OpenAI Responses protocol
- [Create Messages](../anthropic/create-messages-new.md) - Anthropic protocol
- [Generate Content](../vertexai/generate-content.md) - Vertex AI protocol

## Returns

### api `string`

API type. Values vary by protocol:

- `chat.completions` - OpenAI Chat Completions protocol
- `responses` - OpenAI Responses protocol
- `messages` - Anthropic protocol
- `generateContent` - Vertex AI protocol

### generationId `string`

The current generation id.

### model `string`

Model ID.

### createAt `string`

The time when the server received the inference request.

### generationTime `integer`

Total duration of this inference from first token to completion, in milliseconds.

### latency `integer`

Time to first token, in milliseconds.

### nativeTokens `object`

Usage information consumed by this inference, including:

- `completion_tokens` `integer` - Tokens used for the completion
- `prompt_tokens` `integer` - Tokens used for the prompt
- `total_tokens` `integer` - Total tokens
- `completion_tokens_details` `object` - Completion token details
  - `reasoning_tokens` `integer` - Tokens used for reasoning
- `prompt_tokens_details` `object` - Prompt token details
  - `cached_tokens` `integer` - Cached tokens

### streamed `boolean`

Whether the response is streamed.

### finishReason `string`

The reason the model stopped generating.

### usage `number`

Credits consumed by this inference.

### ratingResponses `object`

Billing response details, including:

- `billAmount` `number` - Billed amount
- `discountAmount` `number` - Discount amount
- `originAmount` `number` - Original amount
- `priceVersion` `string` - Price version
- `ratingDetails` `array` - Billing detail items, each containing:
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