---
pageClass: api-page
title: 图片生成流式事件（OpenAI Images API）
head:
  - - meta
    - name: description
      content: Image generation streaming events
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, openai, images, streaming, generation, events, OpenAI
---

# Image generation streaming events

::: info 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

图片流式传输可以通过 Server-Sent Events 实时流式返回图片生成和编辑结果。生成图片时，请在 `POST https://zenmux.ai/api/v1/images/generations` 请求体中设置 `stream: true`。

::: api-request POST /api/v1/images/generations

```cURL
curl https://zenmux.ai/api/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "gpt-image-1.5",
    "prompt": "A cute baby sea otter",
    "n": 1,
    "size": "1024x1024",
    "stream": true
  }' \
  --no-buffer
```

```TypeScript
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  apiKey: process.env.ZENMUX_API_KEY, // [!code highlight]
});

const stream = await client.images.generate({
  model: "gpt-image-1.5",
  prompt: "A cute baby sea otter",
  n: 1,
  size: "1024x1024",
  stream: true,
});

for await (const event of stream) {
  console.log(event);
}
```

```Python
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",  # [!code highlight]
    api_key="<ZENMUX_API_KEY>",  # [!code highlight]
)

stream = client.images.generate(
    model="gpt-image-1.5",
    prompt="A cute baby sea otter",
    n=1,
    size="1024x1024",
    stream=True
)

for event in stream:
    print(event)
```

:::

::: api-response

```text
event: image_generation.partial_image
data: {"type":"image_generation.partial_image","b64_json":"...","partial_image_index":0}

event: image_generation.completed
data: {"type":"image_generation.completed","b64_json":"...","usage":{"total_tokens":100,"input_tokens":50,"output_tokens":50,"input_tokens_details":{"text_tokens":10,"image_tokens":40}}}
```

:::

## image_generation.partial_image

在图片生成流式传输过程中，当部分图片可用时触发。

### b64_json `string`

base64 编码的部分图片数据，可直接用于渲染为图片。

### background `string`

请求图片的背景设置。

可选值：

- `transparent`
- `opaque`
- `auto`

### created_at `number`

事件创建时的 Unix 时间戳。

### output_format `string`

请求图片的输出格式。

可选值：

- `png`
- `webp`
- `jpeg`

### partial_image_index `number`

部分图片的 0 基索引（流式）。

### quality `string`

请求图片的质量设置。

可选值：

- `low`
- `medium`
- `high`
- `auto`

### size `string`

请求图片的尺寸。

可选值：

- `1024x1024`
- `1024x1536`
- `1536x1024`
- `auto`

### type `string`

事件类型。始终为 `image_generation.partial_image`。

```json
{
  "type": "image_generation.partial_image",
  "b64_json": "...",
  "created_at": 1620000000,
  "size": "1024x1024",
  "quality": "high",
  "background": "transparent",
  "output_format": "png",
  "partial_image_index": 0
}
```

## image_generation.completed

图片生成完成且最终图片可用时触发。

### b64_json `string`

base64 编码的图片数据，可直接用于渲染为图片。

### background `string`

生成图片的背景设置。

可选值：

- `transparent`
- `opaque`
- `auto`

### created_at `number`

事件创建时的 Unix 时间戳。

### output_format `string`

生成图片的输出格式。

可选值：

- `png`
- `webp`
- `jpeg`

### quality `string`

生成图片的质量设置。

可选值：

- `low`
- `medium`
- `high`
- `auto`

### size `string`

生成图片的尺寸。

可选值：

- `1024x1024`
- `1024x1536`
- `1536x1024`
- `auto`

### type `string`

事件类型。始终为 `image_generation.completed`。

### usage `object`

仅 GPT image 模型返回，表示图片生成 token 用量信息。

#### input_tokens `number`

输入提示词中图片和文本的 token 数。

#### input_tokens_details `object`

图片生成输入 token 详情。

- `image_tokens` `number`：输入提示词中的图片 token 数。
- `text_tokens` `number`：输入提示词中的文本 token 数。

#### output_tokens `number`

输出图片中的图片 token 数。

#### total_tokens `number`

本次图片生成使用的图片和文本总 token 数。

```json
{
  "type": "image_generation.completed",
  "b64_json": "...",
  "created_at": 1620000000,
  "size": "1024x1024",
  "quality": "high",
  "background": "transparent",
  "output_format": "png",
  "usage": {
    "total_tokens": 100,
    "input_tokens": 50,
    "output_tokens": 50,
    "input_tokens_details": {
      "text_tokens": 10,
      "image_tokens": 40
    }
  }
}
```
