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

[Create chat completion](../openai/create-chat-completion.md) 接口返回的 generation id。

## Returns

### generationId `string`

当前的 generation id。

### modelSlug `string`

模型 ID。

### createdAt `string`

服务端收到推理调用请求的时间。

### generationTime `integer`

本次推理从首字到结束的持续时长，单位耗秒。

### latency `integer`

首字延时，单位耗秒。

### throughput `string`

生成速度，单位 tokens/秒。

### nativeTokens `object`

本次推理消耗的用量信息。

### streamed `boolean`

是否是流式响应。

### finishReason `string`

模型结束推理的原因。

### realAmount `string`

本次推理消耗的 credit


::: api-request GET /api/v1/generations


```Shell
curl https://zenmux.ai/api/v1/generation?id=<generation_id> \
  -H "Authorization: Bearer $ZENMUX_API_KEY"
```

:::