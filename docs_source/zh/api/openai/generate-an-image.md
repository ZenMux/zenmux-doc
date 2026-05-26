---
pageClass: api-page
title: 生成图片（OpenAI Images API）
head:
  - - meta
    - name: description
      content: Create image
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, openai, images, generate, image, OpenAI
---

# Create image

::: info 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```
POST https://zenmux.ai/api/v1/images/generations
```

Create image 接口兼容 OpenAI 的 [Create image](https://developers.openai.com/api/reference/typescript/resources/images/methods/generate) 接口，用于根据提示词创建图片。

下面列出了所有模型可能支持的参数，不同模型的支持参数有所不同。ZenMux 透传 OpenAI Images API 协议；调用 ZenMux 时，请将 Base URL 设置为 `https://zenmux.ai/api/v1`，并使用 ZenMux API Key 鉴权。

::: tip 当前支持模型
ZenMux 支持的 OpenAI 图片生成模型会持续更新。请前往 [ZenMux 模型目录](https://zenmux.ai/models?author=openai&sort=newest&output_modalities=image) 查询当前可用模型。
:::

## Request headers

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer Token 鉴权，格式为 `Bearer $ZENMUX_API_KEY`。

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

请求内容类型，默认值为 `application/json`。

## Request body

### prompt `string` <span style="color: #FA6062; font-weight: 400">\*</span>

期望生成图片的文本描述。GPT image 模型最大长度为 32000 个字符。

### background `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

设置生成图片的背景透明度。该参数仅 GPT image 模型支持。必须是 `transparent`、`opaque` 或 `auto` 之一，默认值为 `auto`。使用 `auto` 时，模型会自动判断最适合图片的背景。

如果设置为 `transparent`，输出格式需要支持透明度，因此 `output_format` 应设置为 `png`（默认值）或 `webp`。

可选值：

- `transparent`
- `opaque`
- `auto`

### model `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

用于图片生成的模型。请前往 [ZenMux 模型目录](https://zenmux.ai/models?author=openai&sort=newest&output_modalities=image) 查询当前可用模型。

### moderation `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

控制 GPT image 模型生成图片时的内容审核级别。必须是 `low` 或 `auto`（默认值）之一。

可选值：

- `low`
- `auto`

### n `number` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

要生成的图片数量。必须介于 1 到 10 之间。

### output_compression `number` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

生成图片的压缩级别（0-100%）。该参数仅 GPT image 模型在 `webp` 或 `jpeg` 输出格式下支持，默认值为 100。

### output_format `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

生成图片返回时使用的格式。该参数仅 GPT image 模型支持。必须是 `png`、`jpeg` 或 `webp` 之一。

可选值：

- `png`
- `jpeg`
- `webp`

### partial_images `number` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

要生成的部分图片数量。该参数用于返回部分图片的流式响应。取值必须介于 0 到 3 之间。当设置为 0 时，响应会在一个流式事件中返回单张图片。

如果完整图片生成得更快，最终图片可能会在请求的部分图片数量全部生成前就被发送。

### quality `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

要生成图片的质量。ZenMux 当前支持的 OpenAI 生图模型可使用 GPT image 模型质量参数。

- `auto`（默认值）会根据给定模型自动选择最佳质量。
- `high`、`medium` 和 `low` 支持 GPT image 模型。

可选值：

- `low`
- `medium`
- `high`
- `auto`

### response_format `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

生成图片的返回格式。该参数不适用于 ZenMux 当前支持的 GPT image 模型；GPT image 模型始终返回 base64 编码图片。

可选值：

- `url`
- `b64_json`

### size `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

生成图片的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽和高都必须能被 16 整除，请求的宽高比必须介于 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率属于实验能力，最大支持分辨率为 `3840x2160`。请求尺寸还必须满足模型当前的像素和边长限制。

`gpt-image-1.5` 支持标准尺寸 `1024x1024`、`1536x1024` 和 `1024x1536`；支持自动尺寸的模型可使用 `auto`。

常见可选值：

- `auto`
- `1024x1024`
- `1536x1024`
- `1024x1536`

### stream `boolean` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

以流式模式生成图片。默认值为 `false`。该参数仅 GPT image 模型支持。

### style `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

生成图片的风格。该参数不适用于 ZenMux 当前支持的 OpenAI 生图模型。

可选值：

- `vivid`
- `natural`

### user `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

代表终端用户的唯一标识符，可用于监控和检测滥用行为。

## Response

返回图片生成接口的响应对象。

### created `number`

图片创建时的 Unix 时间戳（秒）。

### background `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

图片生成时使用的背景参数。可能为 `transparent` 或 `opaque`。

### data `array` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

生成图片列表。

#### b64_json `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

生成图片的 base64 编码 JSON。ZenMux 当前支持的 GPT image 模型默认返回该字段。

#### revised_prompt `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

在部分模型中返回，表示实际用于生成图片的重写提示词。

#### url `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

使用返回 URL 的模型时可能返回生成图片 URL。ZenMux 当前支持的 GPT image 模型通常返回 `b64_json`。

### output_format `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

图片生成输出格式。可能为 `png`、`webp` 或 `jpeg`。

### quality `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

生成图片质量。可能为 `low`、`medium` 或 `high`。

### size `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

生成图片尺寸。可能为 `1024x1024`、`1024x1536` 或 `1536x1024`。

### usage `object` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

GPT image 模型的图片生成 token 用量信息。

- `input_tokens` `number`：输入提示词中图片和文本的 token 数。
- `input_tokens_details` `object`：输入 token 详情。
  - `image_tokens` `number`：输入提示词中的图片 token 数。
  - `text_tokens` `number`：输入提示词中的文本 token 数。
- `output_tokens` `number`：模型生成的输出 token 数。
- `total_tokens` `number`：本次图片生成使用的总 token 数。
- `output_tokens_details` `object` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>：输出 token 详情。
  - `image_tokens` `number`：生成的图片输出 token 数。
  - `text_tokens` `number`：生成的文本输出 token 数。

::: api-request POST /api/v1/images/generations

```cURL
curl https://zenmux.ai/api/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "A cute baby sea otter",
    "n": 1,
    "size": "1024x1024"
  }'
```

```TypeScript
import OpenAI from "openai";
import { writeFile } from "fs/promises";

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  apiKey: process.env.ZENMUX_API_KEY, // [!code highlight]
});

const img = await client.images.generate({
  model: "gpt-image-2",
  prompt: "A cute baby sea otter",
  n: 1,
  size: "1024x1024",
});

const imageBuffer = Buffer.from(img.data[0].b64_json, "base64");
await writeFile("output.png", imageBuffer);
```

```Python
import base64
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",  # [!code highlight]
    api_key="<ZENMUX_API_KEY>",  # [!code highlight]
)

img = client.images.generate(
    model="gpt-image-2",
    prompt="A cute baby sea otter",
    n=1,
    size="1024x1024"
)

image_bytes = base64.b64decode(img.data[0].b64_json)
with open("output.png", "wb") as f:
    f.write(image_bytes)
```

:::

::: api-response

```json
{
  "created": 1713833628,
  "data": [
    {
      "b64_json": "..."
    }
  ],
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

:::
