---
pageClass: api-page
title: Interface
---

# Get generation

```
GET https://zenmux.ai/api/v1/generation?id=<generation_id>
```

The Get generation interface is used to query generation information, such as usage and costs.

## Request params

### generate_id `string` <font color="red">Required</font>

The generation id returned by the [Create Chat Completion](../openai/create-chat-completion.md) interface.

## Returns

### generation_id `string`

The current generation id.

### model `string`

Model ID.

### created_at `string`

The time when the server received the inference request.

### generation_time `integer`

The duration of this inference from the first token to completion, in milliseconds.

### latency `integer`

First token latency, in milliseconds.

### native_tokens `object`

Usage information consumed by this inference.

### streamed `boolean`

Whether it is a streaming response.

### finish_reason `string`

The reason why the model stopped inference.

### usage `string`

The credit consumed by this inference

::: api-request GET /api/v1/generation

```cURL
curl https://zenmux.ai/api/v1/generation?id=<generation_id> \
  -H "Authorization: Bearer $ZENMUX_API_KEY"
```

:::
