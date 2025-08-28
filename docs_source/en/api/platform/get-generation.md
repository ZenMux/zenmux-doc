---
pageClass: api-page
title: API
---

# Get generation

```
GET https://zenmux.ai/api/v1/generation?id=<generation_id>
```

The Get generation endpoint is used to query generation details, such as usage and cost.

## Request parameters

### generate_id `string` <font color="red">Required</font>

The generation ID returned by the [Create chat completion](../openai/create-chat-completion.md) endpoint.

## Returns

### generation_id `string`

The current generation ID.

### model `string`

Model ID.

### created_at `string`

The time the server received the inference request.

### generation_time `integer`

Duration from the first token to completion, in milliseconds.

### latency `integer`

Time to first token, in milliseconds.

### native_tokens `object`

Usage details for this generation.

### streamed `boolean`

Whether the response was streamed.

### finish_reason `string`

The reason the model stopped.

### usage `string`

Credits consumed by this generation.


::: api-request GET /api/v1/generation


```Shell
curl https://zenmux.ai/api/v1/generation?id=<generation_id> \
  -H "Authorization: Bearer $ZENMUX_API_KEY"
```

:::