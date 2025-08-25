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

The generation id returned by the [Create chat completion](../openai/create-chat-completion.md) interface.

## Returns

### generationId `string`

The current generation id.

### modelSlug `string`

Model ID.

### createdAt `string`

The time when the server received the inference call request.

### generationTime `integer`

The duration from the first token to completion for this inference, in milliseconds.

### latency `integer`

First token latency, in milliseconds.

### throughput `string`

Generation speed, in tokens/second.

### nativeTokens `object`

Usage information consumed by this inference.

### streamed `boolean`

Whether it is a streaming response.

### finishReason `string`

The reason why the model finished inference.

### realAmount `string`

The credits consumed by this inference.


::: api-request GET /api/v1/generations


```Shell
curl https://zenmux.ai/api/v1/generation?id=<generation_id> \
  -H "Authorization: Bearer $ZENMUX_API_KEY"
```

:::