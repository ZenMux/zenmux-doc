---
pageClass: api-page
title: 生成图片（Vertex AI 协议）
head:
  - - meta
    - name: description
      content: Zenmux documentation - generate images via Vertex AI protocol
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, generate, images, imagen, vertex-ai, gpt-image, banana
---

# Google Vertex AI API: Generate Images

::: tip 💡 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```
POST https://zenmux.ai/api/vertex-ai/v1/publishers/{provider}/models/{model}:predict
```

Generate Images 接口通过 Google Vertex AI 协议生成图片。ZenMux 聚合了 Google Imagen、OpenAI GPT Image、通义万象、Flux、可灵、混元等多种图片生成模型，均可通过统一的 Vertex AI 协议调用。

本接口对应 Google Gen AI SDK 中的 `generate_images`（文生图）和 `edit_image`（图片编辑）方法。调用时请将 Base URL 设置为 `https://zenmux.ai/api/vertex-ai`，并使用 ZenMux API Key 鉴权。

更多使用示例请参考 [图片生成使用指南](/zh/guide/advanced/image-generation)。

::: tip 当前支持模型
ZenMux 支持的图片生成模型会持续更新。请前往 [ZenMux 模型列表](https://zenmux.ai/models?sort=newest&output_modalities=image) 查看当前所有支持 Vertex AI 协议的图片模型。
:::

## Path parameters

### provider `string` <span style="color: #FA6062; font-weight: 400">\*</span>

模型供应商标识。对应模型名称中 `/` 前的部分，例如 `openai/gpt-image-2` 中的 `openai`。

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

模型名称。对应模型名称中 `/` 后的部分，例如 `openai/gpt-image-2` 中的 `gpt-image-2`。

## 鉴权参数

### api_key `string` <span style="color: #FA6062; font-weight: 400">\*</span>

ZenMux API 密钥，用于身份鉴权。

### vertexai `boolean` <span style="color: #FA6062; font-weight: 400">\*</span>

必须设置为 `true` 以启用 Vertex AI 协议。

### http_options.base_url `string` <span style="color: #FA6062; font-weight: 400">\*</span>

ZenMux Vertex AI 端点：`https://zenmux.ai/api/vertex-ai`。

### http_options.api_version `string` <span style="color: #FA6062; font-weight: 400">\*</span>

API 版本，设置为 `v1`。

## Generate Images 请求参数（文生图）

以下为 `generate_images` / `generateImages` SDK 方法的参数说明。SDK 会自动将这些参数转换为 Vertex AI REST 格式（`instances` + `parameters`）发送给 ZenMux。

### prompt `string` <span style="color: #FA6062; font-weight: 400">\*</span>

期望生成图片的文本描述。建议使用清晰、具体的描述以获得更好的生成效果。

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

用于图片生成的模型。格式为 `{provider}/{model}`，例如 `openai/gpt-image-2`。

### config `GenerateImagesConfig` <span style="color: #666; font-weight: 400">可选</span>

图片生成配置对象，包含以下字段：

#### number_of_images `integer` <span style="color: #666; font-weight: 400">可选</span>

要生成的图片数量，默认为 1。不同供应商的上限不同：Google Imagen 最多 4 张，OpenAI 最多 10 张，火山引擎最多 15 张，Flux/GLM/混元仅支持 1 张。

SDK 字段名：Python `number_of_images`，TypeScript `numberOfImages`。

> REST 对应字段：`parameters.sampleCount`

#### negative_prompt `string` <span style="color: #666; font-weight: 400">可选</span>

负面提示词，描述不希望出现在图片中的内容。支持的供应商：Google Imagen、可灵（Kling）、通义万象（Qwen）。

SDK 字段名：Python `negative_prompt`，TypeScript `negativePrompt`。

> REST 对应字段：`parameters.negativePrompt`

#### aspect_ratio `string` <span style="color: #666; font-weight: 400">可选</span>

图片宽高比。不同供应商支持的值有所不同，常见值包括：

- `1:1`（正方形）
- `4:3` / `3:4`
- `16:9` / `9:16`
- `2:3` / `3:2`
- `21:9`

SDK 字段名：Python `aspect_ratio`，TypeScript `aspectRatio`。

> REST 对应字段：`parameters.aspectRatio`

::: tip 💡 尺寸控制
`aspect_ratio` 控制宽高比，`sampleImageSize` 控制分辨率档位，两者配合使用可精确控制输出尺寸。对于 OpenAI 模型，请改用 `imageSize` 透传参数直接指定尺寸。
:::

#### output_mime_type `string` <span style="color: #666; font-weight: 400">可选</span>

输出图片格式。默认为 `image/png`。

可选值：

- `image/png`：无损格式，适合需要高保真的场景
- `image/jpeg`：通用有损格式

SDK 字段名：Python `output_mime_type`，TypeScript `outputMimeType`。

> REST 对应字段：`parameters.outputOptions.mimeType`

#### output_compression_quality `integer` <span style="color: #666; font-weight: 400">可选</span>

输出图片的压缩质量，取值范围 0-100。仅在 `output_mime_type` 为 `image/jpeg` 时有效，默认值为 100。

SDK 字段名：Python `output_compression_quality`，TypeScript `outputCompressionQuality`。

> REST 对应字段：`parameters.outputOptions.compressionQuality`

#### seed `integer` <span style="color: #666; font-weight: 400">可选</span>

随机种子，用于复现生成结果。支持的供应商：Google Imagen、Flux、通义万象、火山引擎。

SDK 字段名：Python `seed`，TypeScript `seed`。

> REST 对应字段：`parameters.seed`

#### enhance_prompt `boolean` <span style="color: #666; font-weight: 400">可选</span>

是否启用提示词增强/优化。开启后模型会自动扩展和改进提示词以提升生成质量。支持的供应商：Flux、混元、通义万象。

SDK 字段名：Python `enhance_prompt`，TypeScript `enhancePrompt`。

> REST 对应字段：`parameters.enhancePrompt`

#### person_generation `string` <span style="color: #666; font-weight: 400">可选</span>

人物生成控制。仅 Google Imagen 模型支持。

可选值：

- `dont_allow`
- `allow_adult`

SDK 字段名：Python `person_generation`，TypeScript `personGeneration`。

> REST 对应字段：`parameters.personGeneration`

#### safety_filter_level `string` <span style="color: #666; font-weight: 400">可选</span>

安全过滤级别。仅 Google Imagen 模型支持。

SDK 字段名：Python `safety_filter_level`，TypeScript `safetyFilterLevel`。

> REST 对应字段：`parameters.safetySetting`

#### include_rai_reason `boolean` <span style="color: #666; font-weight: 400">可选</span>

是否在响应中包含内容审核原因。仅 Google Imagen 模型支持。

SDK 字段名：Python `include_rai_reason`，TypeScript `includeRaiReason`。

> REST 对应字段：`parameters.includeRaiReason`

#### add_watermark `boolean` <span style="color: #666; font-weight: 400">可选</span>

是否添加水印。支持的供应商：Google Imagen、火山引擎、GLM、混元、通义万象、百度。

SDK 字段名：Python `add_watermark`，TypeScript `addWatermark`。

> REST 对应字段：`parameters.addWatermark`

#### guidance_scale `number` <span style="color: #666; font-weight: 400">可选</span>

引导强度，控制模型对提示词的遵循程度。仅 Flux 模型支持。

SDK 字段名：Python `guidance_scale`，TypeScript `guidanceScale`。

> REST 对应字段：`parameters.guidanceScale`

### OpenAI 模型专用透传参数

以下参数通过 `http_options.extra_body` 透传，仅适用于 OpenAI 类模型（如 `openai/gpt-image-2`）。

#### http_options.extra_body.imageSize `string` <span style="color: #666; font-weight: 400">可选</span>

图片尺寸（透传参数）。ZenMux 将该参数原样转发到底层 OpenAI API。

**预设尺寸：** `1024x1024`（正方形）、`1536x1024`（横版）、`1024x1536`（竖版）、`auto`（自动）

**自定义尺寸**（仅 `openai/gpt-image-2`）：支持任意自定义尺寸，需满足以下条件：

- 宽和高都必须是 **16 的倍数**
- 单边最大 **3840px**
- 宽高比不超过 **3:1**

常用自定义尺寸参考：

| 尺寸        | 分辨率     | 适用场景               |
| ----------- | ---------- | ---------------------- |
| `1920x1080` | 1080p      | 博客封面、网页横幅     |
| `1080x1920` | 1080p 竖版 | 手机壁纸、社交媒体故事 |
| `2560x1440` | 2K QHD     | 桌面壁纸               |
| `3840x2160` | 4K UHD     | 高清海报、大屏展示     |

SDK 字段名：Python `http_options=types.HttpOptions(extra_body={"imageSize": "..."})`，TypeScript `httpOptions: { extraBody: { imageSize: "..." } }`。

#### http_options.extra_body.quality `string` <span style="color: #666; font-weight: 400">可选</span>

图片质量（透传参数）。ZenMux 将该参数原样转发到底层 OpenAI API。

可选值：

- `low`
- `medium`
- `high`
- `auto`（默认值）

SDK 字段名：Python `http_options=types.HttpOptions(extra_body={"quality": "..."})`，TypeScript `httpOptions: { extraBody: { quality: "..." } }`。

### 非 OpenAI 模型分辨率控制

#### http_options.extra_body.sampleImageSize `string` <span style="color: #666; font-weight: 400">可选</span>

分辨率档位（透传参数）。适用于火山引擎、百度等供应商。

可选值：

- `1K`：1024 级别分辨率
- `2K`：2048 级别分辨率
- `4K`：4096 级别分辨率

该参数与 `aspectRatio` 配合使用，ZenMux 会根据分辨率档位和宽高比计算实际输出尺寸。

SDK 字段名：Python `http_options=types.HttpOptions(extra_body={"sampleImageSize": "..."})`，TypeScript `httpOptions: { extraBody: { sampleImageSize: "..." } }`。

::: tip 💡 关于透传参数
`imageSize`、`quality`、`sampleImageSize` 属于透传参数——ZenMux 会根据目标供应商的需要转换或原样转发。标准 Vertex AI 字段（如 `numberOfImages`、`outputMimeType`、`aspectRatio`）直接放在 `config` 顶层即可。
:::

## Edit Image 请求参数（图片编辑）

以下为 `edit_image` / `editImage` SDK 方法的参数说明，用于在已有图片基础上进行修改。

### prompt `string` <span style="color: #FA6062; font-weight: 400">\*</span>

图片编辑的文本描述。建议在提示词中明确要求保留原图的形状/构图，只改变风格或局部内容。

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

用于图片编辑的模型。格式为 `{provider}/{model}`，例如 `openai/gpt-image-2`。

### reference_images `array` <span style="color: #FA6062; font-weight: 400">\*</span>

参考图片列表，包含原图和蒙版（可选）。不同供应商对参考图片数量有限制：可灵（Kling）最多 1 张，Flux 最多 8 张。

::: details RawReferenceImage（原图）

- `reference_id` `integer` <span style="color: #FA6062; font-weight: 400">\*</span>：参考图片的标识 ID。
- `reference_image` `Image` <span style="color: #FA6062; font-weight: 400">\*</span>：图片对象。
  - `image_bytes` `bytes`：图片的二进制数据。
  - `mime_type` `string`：图片 MIME 类型，如 `image/png`、`image/jpeg`。

:::

::: details MaskReferenceImage（蒙版，可选）

- `reference_id` `integer` <span style="color: #FA6062; font-weight: 400">\*</span>：蒙版的标识 ID。
- `reference_image` `Image` <span style="color: #FA6062; font-weight: 400">\*</span>：蒙版图片对象，透明区域为编辑区域。
  - `image_bytes` `bytes`：蒙版的二进制数据。
  - `mime_type` `string`：图片 MIME 类型。
- `config` `MaskReferenceConfig` <span style="color: #FA6062; font-weight: 400">\*</span>：蒙版配置。
  - `mask_mode` `string`：蒙版模式，设置为 `MASK_MODE_USER_PROVIDED`。

:::

### config `EditImageConfig` <span style="color: #666; font-weight: 400">可选</span>

图片编辑配置对象，支持与 Generate Images 相同的 config 字段。

## Response

SDK 会自动将 REST 响应转换为 `GenerateImagesResponse` 对象。

### generated_images `array<GeneratedImage>`

生成的图片列表。

#### image `Image`

图片对象。

- `image_bytes` `bytes`：图片的 base64 编码二进制数据。可通过 SDK 提供的方法直接保存为文件。
- `mime_type` `string`：图片的 MIME 类型，对应请求中的 `output_mime_type`。

::: details REST 原始响应结构

SDK 底层接收的 REST 响应格式如下：

```json
{
  "predictions": [
    {
      "bytesBase64Encoded": "iVBORw0KGgoAAAANSUhEUg...",
      "mimeType": "image/png"
    }
  ]
}
```

- `bytesBase64Encoded`：base64 编码的图片数据
- `mimeType`：图片 MIME 类型
- `gcsUri`：图片 URL（部分供应商返回）
- `prompt`：增强/修改后的提示词（部分模型返回）
- `raiFilteredReason`：内容审核拦截原因（如被拦截）

:::

::: api-request POST /api/vertex-ai/v1

```cURL
curl -X POST "https://zenmux.ai/api/vertex-ai/v1/publishers/openai/models/gpt-image-2:predict" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [{
      "prompt": "A cute cat wearing a tiny hat"
    }],
    "parameters": {
      "sampleCount": 1,
      "imageSize": "1024x1024",
      "quality": "high"
    }
  }'
```

```TypeScript
const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: process.env.ZENMUX_API_KEY, // [!code highlight]
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai", // [!code highlight]
    apiVersion: "v1",
  },
});

const response = await client.models.generateImages({
  model: "openai/gpt-image-2",
  prompt: "A cute cat wearing a tiny hat",
  config: {
    numberOfImages: 1,
    httpOptions: {
      extraBody: {
        imageSize: "1024x1024",
        quality: "high",
      },
    },
  },
});

for (const img of response.generatedImages) {
  console.log("Image generated:", img.image.imageBytes.length, "bytes");
}
```

```Python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # [!code highlight]
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai"  # [!code highlight]
    ),
)

response = client.models.generate_images(
    model="openai/gpt-image-2",
    prompt="A cute cat wearing a tiny hat",
    config=types.GenerateImagesConfig(
        number_of_images=1,
        http_options=types.HttpOptions(
            extra_body={
                "imageSize": "1024x1024",
                "quality": "high",
            }
        ),
    )
)

for i, img in enumerate(response.generated_images):
    img.image.save(f"generated_{i}.png")
    print(f"Image saved as generated_{i}.png")
```

:::

::: api-response

```json
{
  "predictions": [
    {
      "bytesBase64Encoded": "iVBORw0KGgoAAAANSUhEUg...",
      "mimeType": "image/png"
    }
  ]
}
```

:::

::: api-request POST /api/vertex-ai/v1

```cURL
curl -X POST "https://zenmux.ai/api/vertex-ai/v1/publishers/openai/models/gpt-image-2:predict" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [{
      "prompt": "Transform this image into watercolor painting style",
      "image": {
        "bytesBase64Encoded": "<BASE64_IMAGE_DATA>",
        "mimeType": "image/png"
      }
    }],
    "parameters": {
      "sampleCount": 1
    }
  }'
```

```TypeScript
const { GoogleGenAI, RawReferenceImage } = require("@google/genai");
const fs = require("fs");

const client = new GoogleGenAI({
  apiKey: process.env.ZENMUX_API_KEY, // [!code highlight]
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai", // [!code highlight]
    apiVersion: "v1",
  },
});

const imageBytes = fs.readFileSync("input_image.png");

const response = await client.models.editImage({
  model: "openai/gpt-image-2",
  prompt: "Transform this image into watercolor painting style",
  referenceImages: [
    new RawReferenceImage({
      referenceId: 1,
      referenceImage: {
        imageBytes: imageBytes,
        mimeType: "image/png",
      },
    }),
  ],
});

for (const img of response.generatedImages) {
  console.log("Edited image:", img.image.imageBytes.length, "bytes");
}
```

```Python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # [!code highlight]
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai"  # [!code highlight]
    ),
)

with open("input_image.png", "rb") as f:
    image_bytes = f.read()

original_image = types.Image(image_bytes=image_bytes, mime_type="image/png")

response = client.models.edit_image(
    model="openai/gpt-image-2",
    prompt="Transform this image into watercolor painting style",
    reference_images=[
        types.RawReferenceImage(
            reference_id=1,
            reference_image=original_image
        )
    ]
)

for i, img in enumerate(response.generated_images):
    img.image.save(f"edited_{i}.png")
    print(f"Edited image saved as edited_{i}.png")
```

:::

::: api-response

```json
{
  "predictions": [
    {
      "bytesBase64Encoded": "iVBORw0KGgoAAAANSUhEUg...",
      "mimeType": "image/png"
    }
  ]
}
```

:::
