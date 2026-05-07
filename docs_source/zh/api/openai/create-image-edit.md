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

::: tip 💡 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```
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

### Authorization `string` <font color="red">必填</font>

Bearer Token 鉴权，格式为 `Bearer $ZENMUX_API_KEY`。

### Content-Type `string` <font color="red">必填</font>

请求内容类型。使用图片 URL 或文件 ID 引用时为 `application/json`；使用本地文件上传时为 `multipart/form-data`。

## Request body

### images `array` <font color="red">必选</font>

要编辑的输入图片引用。对于 GPT image 模型，最多可以提供 16 张图片。

#### file_id `string` <font color="gray">可选</font>

要作为输入使用的已上传图片 File API ID。

#### image_url `string` <font color="gray">可选</font>

完整限定 URL 或 base64 编码 data URL。

### prompt `string` <font color="red">必选</font>

期望图片编辑结果的文本描述。

### background `string` <font color="gray">可选</font>

生成图片输出的背景行为。

可选值：

- `transparent`
- `opaque`
- `auto`

### input_fidelity `string` <font color="gray">可选</font>

控制对原始输入图片的保真度。

可选值：

- `high`
- `low`

### mask `object` <font color="gray">可选</font>

通过 URL 或已上传文件 ID 引用一张输入图片作为蒙版。必须且只能提供 `image_url` 或 `file_id` 其中之一。

#### file_id `string` <font color="gray">可选</font>

要作为蒙版使用的已上传图片 File API ID。

#### image_url `string` <font color="gray">可选</font>

完整限定 URL 或 base64 编码 data URL。

### model `string` <font color="gray">可选</font>

用于图片编辑的模型。请前往 [ZenMux 模型目录](https://zenmux.ai/models?author=openai&sort=newest&output_modalities=image) 查询当前可用模型。

### moderation `string` <font color="gray">可选</font>

GPT image 模型的审核级别。

可选值：

- `low`
- `auto`

### n `number` <font color="gray">可选</font>

要生成的编辑后图片数量。

### output_compression `number` <font color="gray">可选</font>

`jpeg` 或 `webp` 输出的压缩级别。

### output_format `string` <font color="gray">可选</font>

输出图片格式。GPT image 模型支持该参数。

可选值：

- `png`
- `jpeg`
- `webp`

### partial_images `number` <font color="gray">可选</font>

要生成的部分图片数量。该参数用于返回部分图片的流式响应。取值必须介于 0 到 3 之间。当设置为 0 时，响应会在一个流式事件中返回单张图片。

如果完整图片生成得更快，最终图片可能会在请求的部分图片数量全部生成前就被发送。

### quality `string` <font color="gray">可选</font>

GPT image 模型的输出质量。

可选值：

- `low`
- `medium`
- `high`
- `auto`

### size `string` <font color="gray">可选</font>

请求的输出图片尺寸。

可选值：

- `auto`
- `1024x1024`
- `1536x1024`
- `1024x1536`

### stream `boolean` <font color="gray">可选</font>

以事件流形式返回部分图片结果。

### user `string` <font color="gray">可选</font>

代表终端用户的唯一标识符，可用于监控和检测滥用行为。

## Response

返回图片生成接口的响应对象。

### created `number`

图片创建时的 Unix 时间戳（秒）。

### background `string` <font color="gray">可选</font>

图片生成时使用的背景参数。可能为 `transparent` 或 `opaque`。

### data `array` <font color="gray">可选</font>

生成图片列表。

#### b64_json `string` <font color="gray">可选</font>

生成图片的 base64 编码 JSON。ZenMux 当前支持的 GPT image 模型默认返回该字段。

#### revised_prompt `string` <font color="gray">可选</font>

在部分模型中返回，表示实际用于生成图片的重写提示词。

#### url `string` <font color="gray">可选</font>

使用返回 URL 的模型时可能返回生成图片 URL。ZenMux 当前支持的 GPT image 模型通常返回 `b64_json`。

### output_format `string` <font color="gray">可选</font>

图片生成输出格式。可能为 `png`、`webp` 或 `jpeg`。

### quality `string` <font color="gray">可选</font>

生成图片质量。可能为 `low`、`medium` 或 `high`。

### size `string` <font color="gray">可选</font>

生成图片尺寸。可能为 `1024x1024`、`1024x1536` 或 `1536x1024`。

### usage `object` <font color="gray">可选</font>

GPT image 模型的图片生成 token 用量信息。

- `input_tokens` `number`：输入提示词中图片和文本的 token 数。
- `input_tokens_details` `object`：输入 token 详情。
  - `image_tokens` `number`：输入提示词中的图片 token 数。
  - `text_tokens` `number`：输入提示词中的文本 token 数。
- `output_tokens` `number`：模型生成的输出 token 数。
- `total_tokens` `number`：本次图片生成使用的总 token 数。
- `output_tokens_details` `object` <font color="gray">可选</font>：输出 token 详情。
  - `image_tokens` `number`：生成的图片输出 token 数。
  - `text_tokens` `number`：生成的文本输出 token 数。

::: api-request POST /api/v1/images/edits

```cURL
curl https://zenmux.ai/api/v1/images/edits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "images": [
      {
        "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cFBSepW/gold.png"
      },
      {
        "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/kMzPjuF/silver.png"
      },
      {
        "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cdTgazq/diamond.png"
      }
    ],
    "prompt": "将这几个参考图片做成一个漫威复仇者联盟风格的大合照",
    "background": "transparent",
    "model": "gpt-image-2",
    "moderation": "auto",
    "n": 1,
    "output_compression": 100,
    "output_format": "png",
    "partial_images": 1,
    "quality": "high",
    "size": "1024x1024",
    "user": "user-1234"
  }'
```

```TypeScript
import { writeFile } from "fs/promises";

const response = await fetch("https://zenmux.ai/api/v1/images/edits", { // [!code highlight]
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.ZENMUX_API_KEY}`, // [!code highlight]
  },
  body: JSON.stringify({
    model: "gpt-image-2",
    images: [
      {
        image_url: "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cFBSepW/gold.png",
      },
      {
        image_url: "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/kMzPjuF/silver.png",
      },
      {
        image_url: "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cdTgazq/diamond.png",
      },
    ],
    prompt: "将这几个参考图片做成一个漫威复仇者联盟风格的大合照",
  }),
});

const result = await response.json();
const imageBase64 = result.data[0].b64_json;
const imageBytes = Buffer.from(imageBase64, "base64");
await writeFile("avengers-group.png", imageBytes);
```

```Python
import base64
import os
import requests

response = requests.post(
    "https://zenmux.ai/api/v1/images/edits",  # [!code highlight]
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.environ['ZENMUX_API_KEY']}",  # [!code highlight]
    },
    json={
        "model": "gpt-image-2",
        "images": [
            {
                "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cFBSepW/gold.png"
            },
            {
                "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/kMzPjuF/silver.png"
            },
            {
                "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cdTgazq/diamond.png"
            },
        ],
        "prompt": "将这几个参考图片做成一个漫威复仇者联盟风格的大合照",
    },
)

result = response.json()
image_base64 = result["data"][0]["b64_json"]
image_bytes = base64.b64decode(image_base64)

with open("avengers-group.png", "wb") as f:
    f.write(image_bytes)
```

:::

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

```cURL
curl -s -D >(grep -i x-request-id >&2) \
  -o >(jq -r '.data[0].b64_json' | base64 --decode > avengers-group.png) \
  -X POST "https://zenmux.ai/api/v1/images/edits" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "gpt-image-2",
    "images": [
      {
        "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cFBSepW/gold.png"
      },
      {
        "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/kMzPjuF/silver.png"
      },
      {
        "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cdTgazq/diamond.png"
      }
    ],
    "prompt": "将这几个参考图片做成一个漫威复仇者联盟风格的大合照"
  }'
```

```TypeScript
import { writeFile } from "fs/promises";

const response = await fetch("https://zenmux.ai/api/v1/images/edits", { // [!code highlight]
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.ZENMUX_API_KEY}`, // [!code highlight]
  },
  body: JSON.stringify({
    model: "gpt-image-2",
    images: [
      {
        image_url: "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cFBSepW/gold.png",
      },
      {
        image_url: "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/kMzPjuF/silver.png",
      },
      {
        image_url: "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cdTgazq/diamond.png",
      },
    ],
    prompt: "将这几个参考图片做成一个漫威复仇者联盟风格的大合照",
  }),
});

const result = await response.json();
const imageBase64 = result.data[0].b64_json;
const imageBytes = Buffer.from(imageBase64, "base64");
await writeFile("avengers-group.png", imageBytes);
```

```Python
import base64
import os
import requests

response = requests.post(
    "https://zenmux.ai/api/v1/images/edits",  # [!code highlight]
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.environ['ZENMUX_API_KEY']}",  # [!code highlight]
    },
    json={
        "model": "gpt-image-2",
        "images": [
            {
                "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cFBSepW/gold.png"
            },
            {
                "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/kMzPjuF/silver.png"
            },
            {
                "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cdTgazq/diamond.png"
            },
        ],
        "prompt": "将这几个参考图片做成一个漫威复仇者联盟风格的大合照",
    },
)

result = response.json()
image_base64 = result["data"][0]["b64_json"]
image_bytes = base64.b64decode(image_base64)

with open("avengers-group.png", "wb") as f:
    f.write(image_bytes)
```

:::
