---
pageClass: api-page
title: 编辑图片（OpenAI Images API）
head:
  - - meta
    - name: description
      content: Create image edit
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, openai, images, edit, image, OpenAI
---

# Create image edit

::: info 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```http
POST https://zenmux.ai/api/v1/images/edits
```

Create image edit 接口兼容 OpenAI 的 [Create image edit](https://developers.openai.com/api/reference/typescript/resources/images/methods/edit) 接口，用于根据一张或多张源图片和提示词，创建编辑后或扩展后的图片。

::: tip 当前支持模型
ZenMux 支持的 OpenAI 图片生成模型会持续更新。请前往 [ZenMux 模型目录](https://zenmux.ai/models?author=openai&sort=newest&output_modalities=image) 查询当前可用模型。
:::

你可以用两种方式调用该接口：

- `multipart/form-data`：通过 `image`（以及可选的 `mask`）上传二进制文件。
- `application/json`：通过 `images`（以及可选的 `mask`）使用 `image_url` 或 `file_id` 引用图片。

请注意，JSON 请求使用 `images` 数组，而不是 multipart 请求中的 `image` 字段。

## Request headers

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer Token 鉴权，格式为 `Bearer $ZENMUX_API_KEY`。

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

请求内容类型。使用图片 URL 或文件 ID 引用时为 `application/json`；使用本地文件上传时为 `multipart/form-data`。

## Request body

### images `array` <span style="color: #FA6062; font-weight: 400">\*</span>

要编辑的输入图片引用。对于 GPT image 模型，最多可以提供 16 张图片。

#### file_id `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

要作为输入使用的已上传图片 File API ID。

#### image_url `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

完整限定 URL 或 base64 编码 data URL。

### prompt `string` <span style="color: #FA6062; font-weight: 400">\*</span>

期望图片编辑结果的文本描述。

### background `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

生成图片输出的背景行为。

可选值：

- `transparent`
- `opaque`
- `auto`

### input_fidelity `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

控制对原始输入图片的保真度。

可选值：

- `high`
- `low`

### mask `object` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

通过 URL 或已上传文件 ID 引用一张输入图片作为蒙版。必须且只能提供 `image_url` 或 `file_id` 其中之一。

#### file_id `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

要作为蒙版使用的已上传图片 File API ID。

#### image_url `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

完整限定 URL 或 base64 编码 data URL。

### model `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

用于图片编辑的模型。请前往 [ZenMux 模型目录](https://zenmux.ai/models?author=openai&sort=newest&output_modalities=image) 查询当前可用模型。

### moderation `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

GPT image 模型的审核级别。

可选值：

- `low`
- `auto`

### n `number` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

要生成的编辑后图片数量。

### output_compression `number` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

`jpeg` 或 `webp` 输出的压缩级别。

### output_format `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

输出图片格式。GPT image 模型支持该参数。

可选值：

- `png`
- `jpeg`
- `webp`

### partial_images `number` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

要生成的部分图片数量。该参数用于返回部分图片的流式响应。取值必须介于 0 到 3 之间。当设置为 0 时，响应会在一个流式事件中返回单张图片。

如果完整图片生成得更快，最终图片可能会在请求的部分图片数量全部生成前就被发送。

### quality `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

GPT image 模型的输出质量。

可选值：

- `low`
- `medium`
- `high`
- `auto`

### size `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

请求的输出图片尺寸。

可选值：

- `auto`
- `1024x1024`
- `1536x1024`
- `1024x1536`

### stream `boolean` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

以事件流形式返回部分图片结果。

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

::: api-response

```json
{
  "created": 0,
  "background": "transparent",
  "data": [
    {
      "b64_json": "b64_json",
      "revised_prompt": "revised_prompt",
      "url": "https://example.com"
    }
  ],
  "output_format": "png",
  "quality": "low",
  "size": "1024x1024",
  "usage": {
    "input_tokens": 0,
    "input_tokens_details": {
      "image_tokens": 0,
      "text_tokens": 0
    },
    "output_tokens": 0,
    "total_tokens": 0,
    "output_tokens_details": {
      "image_tokens": 0,
      "text_tokens": 0
    }
  }
}
```

:::

## Edit image

::: api-request POST /api/v1/images/edits

```bash [cURL]
curl -s -D >(grep -i x-request-id >&2) \
  -o >(jq -r '.data[0].b64_json' | base64 --decode > gift-basket.png) \
  -X POST "https://zenmux.ai/api/v1/images/edits" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -F "model=openai/gpt-image-2" \
  -F "image[]=@body-lotion.png" \
  -F "image[]=@bath-bomb.png" \
  -F "image[]=@incense-kit.png" \
  -F "image[]=@soap.png" \
  -F 'prompt=Create a lovely gift basket with these four items in it'
```

```TypeScript
import fs from "fs";
import OpenAI, { toFile } from "openai";

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  apiKey: process.env.ZENMUX_API_KEY, // [!code highlight]
});

const imageFiles = [
  "bath-bomb.png",
  "body-lotion.png",
  "incense-kit.png",
  "soap.png",
];

const images = await Promise.all(
  imageFiles.map(async (file) =>
    await toFile(fs.createReadStream(file), null, {
      type: "image/png",
    }),
  ),
);

const rsp = await client.images.edit({
  model: "gpt-image-2",
  image: images,
  prompt: "Create a lovely gift basket with these four items in it",
});

// Save the image to a file
const image_base64 = rsp.data[0].b64_json;
const image_bytes = Buffer.from(image_base64, "base64");
fs.writeFileSync("basket.png", image_bytes);
```

```Python
import base64
import os

from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",  # [!code highlight]
    api_key=os.environ["ZENMUX_API_KEY"],  # [!code highlight]
)

prompt = """
Generate a photorealistic image of a gift basket on a white background
labeled 'Relax & Unwind' with a ribbon and handwriting-like font,
containing all the items in the reference pictures.
"""

result = client.images.edit(
    model="gpt-image-2",
    image=[
        open("body-lotion.png", "rb"),
        open("bath-bomb.png", "rb"),
        open("incense-kit.png", "rb"),
        open("soap.png", "rb"),
    ],
    prompt=prompt,
)

image_base64 = result.data[0].b64_json
image_bytes = base64.b64decode(image_base64)

# Save the image to a file
with open("gift-basket.png", "wb") as f:
    f.write(image_bytes)
```

:::
