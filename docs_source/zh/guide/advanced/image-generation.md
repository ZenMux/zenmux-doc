---
head:
  - - meta
    - name: description
      content: 图片生成
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, image, generation, API
---

# 图片生成

ZenMux 支持通过 Vertex AI 协议调用图片生成模型。本指南将介绍如何使用 ZenMux 生成图片并保存到本地。

::: tip 💡 关于 Banana 模型
Banana 是 Google 推出的图片生成模型系列,能够根据文本描述生成高质量图片。您可以通过 Vertex AI 协议在 ZenMux 中使用这些模型。
:::

## 支持的模型

目前支持的图片生成模型包括(持续更新中):

**Google Gemini 系列** — 使用 `generate_content` 接口,响应中同时包含文本和图片:

- `google/gemini-3-pro-image-preview`
- `google/gemini-3-pro-image-preview-free`
- `google/gemini-2.5-flash-image`
- `google/gemini-2.5-flash-image-free`

**非 Google 模型** — 使用 `generate_images` / `edit_image` 接口,支持图片生成与编辑:

- `openai/gpt-image-1.5`
- `openai/gpt-image-2`
- `qwen/qwen-image-2.0`

::: tip 📚 更多模型
访问 [ZenMux 模型列表](https://zenmux.ai/models) 搜索查看所有可用的图片生成模型。
:::

## 参考文档

本指南只列出了基本的使用方法,更多详细配置和其他高级用法请参考以下官方文档:

- [Vertex AI 官方文档](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference)
- [Vertex AI Nano-Banana Notebook](https://github.com/GoogleCloudPlatform/generative-ai/tree/main/gemini/nano-banana)

## 使用方式

::: code-group

```Python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # 替换为你的 API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

# 流式调用: generate_content_stream
# 非流式调用: generate_content
prompt = "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"

response = client.models.generate_content(
    model="google/gemini-3-pro-image-preview",
    contents=[prompt],
    config=types.GenerateContentConfig(
        response_modalities=["TEXT", "IMAGE"]
    )
)

# 处理文本和图片响应
for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        # 保存生成的图片
        image = part.as_image()
        image.save("generated_image.png")
        print("Image saved as generated_image.png")
```

```ts [TypeScript]
const genai = require("@google/genai");

const client = new genai.GoogleGenAI({
  apiKey: "$ZENMUX_API_KEY", // 替换为你的 API Key
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1",
  },
});

// 流式调用: generateContentStream
// 非流式调用: generateContent
const response = await client.models.generateContent({
  model: "google/gemini-3-pro-image-preview",
  contents:
    "Generate an image of the Eiffel tower with fireworks in the background",
  config: {
    responseModalities: ["TEXT", "IMAGE"], // 必须指定响应模态
    // 更多配置参数请参考 Vertex AI 官方文档
  },
});

console.log(response);
```

:::

## 非 Google 模型使用方式

对于 `openai/gpt-image-1.5`、`openai/gpt-image-2`、`qwen/qwen-image-2.0` 等非 Google 模型,请使用 `generate_images` 和 `edit_image` 接口。

ZenMux 内部将 Vertex AI 协议的参数转换为 OpenAI 图片生成 API 格式,下面的参数对照表可以帮助你理解如何使用各项功能。

### 支持的参数

#### generate_images 参数

以下是 [OpenAI 官方图片生成参数](https://developers.openai.com/api/reference/resources/images/methods/generate) 与 ZenMux Vertex AI 协议的对照:

| OpenAI 参数 | Vertex AI 对应写法 | 类型 | 说明 | 支持 |
|---|---|---|---|---|
| `prompt` | `prompt`（SDK 直传） | string | 文本描述（必填） | ✅ |
| `model` | `model`（SDK 直传） | string | 模型名称 | ✅ |
| `n` | `config.number_of_images` | number | 生成图片数量（1-10） | ✅ |
| `size` | `config.http_options.extra_body.imageSize` | string | 图片尺寸：`1024x1024`、`1536x1024`（横版）、`1024x1536`（竖版）、`auto` | ✅ |
| `quality` | `config.http_options.extra_body.quality` | string | 图片质量：`low` / `medium` / `high` / `auto` | ✅ |
| `output_format` | `config.output_mime_type` | string | 输出格式：`image/png`、`image/jpeg`、`image/webp` | ✅ |
| `output_compression` | `config.output_compression_quality` | number | 压缩质量（0-100）,仅 webp/jpeg 有效 | ✅ |
| `background` | — | string | 背景透明度设置 | ❌ |
| `moderation` | — | string | 内容审核级别 | ❌ |
| `style` | — | string | DALL-E 3 风格参数 | ❌ |
| `response_format` | — | string | 不适用（统一返回 base64） | ❌ |

#### edit_image 参数

以下是 [OpenAI 官方图片编辑参数](https://developers.openai.com/api/reference/resources/images/methods/edit) 与 ZenMux Vertex AI 协议的对照:

| OpenAI 参数 | Vertex AI 对应写法 | 类型 | 说明 | 支持 |
|---|---|---|---|---|
| `prompt` | `prompt`（SDK 直传） | string | 编辑描述（必填） | ✅ |
| `model` | `model`（SDK 直传） | string | 模型名称 | ✅ |
| `image` | `reference_images`（`referenceType` 非 MASK） | file/base64 | 参考图片,支持多张 | ✅ |
| `mask` | `reference_images`（`referenceType = REFERENCE_TYPE_MASK`） | file/base64 | 蒙版图片,透明区域为编辑区域 | ✅ |
| `n` | `config.number_of_images` | number | 生成数量（1-10） | ✅ |
| `size` | `config.http_options.extra_body.imageSize` | string | 图片尺寸：`1024x1024`、`1536x1024`、`1024x1536`、`auto` | ✅ |
| `quality` | `config.http_options.extra_body.quality` | string | 图片质量：`low` / `medium` / `high` / `auto` | ✅ |
| `output_format` | `config.output_mime_type` | string | 输出格式 | ✅ |
| `output_compression` | `config.output_compression_quality` | number | 压缩质量 | ✅ |
| `background` | — | — | 不支持 | ❌ |

::: tip 💡 关于参数传递

`imageSize`、`quality` 等 OpenAI 特有参数,请通过 `httpOptions.extraBody` 透传,以确保在 Python 与 TypeScript SDK 中行为一致;`numberOfImages`、`outputMimeType`、`outputCompressionQuality` 等标准 Vertex AI 字段直接放在 `config` 顶层即可。

:::

### 生成图片

::: code-group

```Python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # 替换为你的 API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

response = client.models.generate_images(
    model="openai/gpt-image-2",  # 或 qwen/qwen-image-2.0
    prompt="A cat and a dog"
)

# 保存生成的图片
for i, img in enumerate(response.generated_images):
    img.image.save(f"generated_{i}.png")
    print(f"Image saved as generated_{i}.png")
```

```ts [TypeScript]
const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: "$ZENMUX_API_KEY", // 替换为你的 API Key
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1",
  },
});

const response = await client.models.generateImages({
  model: "openai/gpt-image-2", // 或 qwen/qwen-image-2.0
  prompt: "A cat and a dog",
});

console.log(response);
```

:::

### 高级参数示例

#### 生成高清大尺寸图片

通过 `httpOptions.extraBody` 透传 `imageSize` 与 `quality` 参数,生成高质量大尺寸图片:

::: code-group

```Python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

response = client.models.generate_images(
    model="openai/gpt-image-2",
    prompt="A futuristic cityscape at sunset, ultra detailed",
    config=types.GenerateImagesConfig(
        number_of_images=1,                         # 生成 1 张
        http_options=types.HttpOptions(
            extra_body={
                "imageSize": "1536x1024",           # 横版高分辨率
                "quality": "high",                  # 高质量
            }
        ),
    )
)

for i, img in enumerate(response.generated_images):
    img.image.save(f"hd_{i}.png")
    print(f"HD image saved as hd_{i}.png")
```

```ts [TypeScript]
const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: "$ZENMUX_API_KEY",
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1",
  },
});

const response = await client.models.generateImages({
  model: "openai/gpt-image-2",
  prompt: "A futuristic cityscape at sunset, ultra detailed",
  config: {
    numberOfImages: 1,                  // 生成 1 张
    httpOptions: {
      extraBody: {
        imageSize: "1536x1024",         // 横版高分辨率
        quality: "high",                // 高质量
      },
    },
  },
});

for (const img of response.generatedImages) {
  console.log("Image generated:", img.image.imageBytes.length, "bytes");
}
```

:::

#### 生成 4K 图片

`openai/gpt-image-2` 支持自定义尺寸,可以生成 4K 分辨率的图片:

::: code-group

```Python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

# 生成 4K 横版图片（3840x2160）
response = client.models.generate_images(
    model="openai/gpt-image-2",
    prompt="A breathtaking mountain landscape at golden hour, photorealistic",
    config=types.GenerateImagesConfig(
        number_of_images=1,
        http_options=types.HttpOptions(
            extra_body={
                "imageSize": "3840x2160",   # 4K UHD 分辨率
                "quality": "high",          # 高质量
            }
        ),
    )
)

for i, img in enumerate(response.generated_images):
    img.image.save(f"4k_{i}.png")
    print(f"4K image saved as 4k_{i}.png")
```

```ts [TypeScript]
const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: "$ZENMUX_API_KEY",
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1",
  },
});

// 生成 4K 横版图片（3840x2160）
const response = await client.models.generateImages({
  model: "openai/gpt-image-2",
  prompt: "A breathtaking mountain landscape at golden hour, photorealistic",
  config: {
    numberOfImages: 1,
    httpOptions: {
      extraBody: {
        imageSize: "3840x2160",      // 4K UHD 分辨率
        quality: "high",             // 高质量
      },
    },
  },
});

for (const img of response.generatedImages) {
  console.log("4K image generated:", img.image.imageBytes.length, "bytes");
}
```

:::

::: tip 💡 尺寸选项

**预设尺寸:** `1024x1024`（正方形）、`1536x1024`（横版）、`1024x1536`（竖版）、`auto`（自动）

**自定义尺寸**（仅 `openai/gpt-image-2`）: 支持传入任意自定义尺寸,需满足以下条件:
- 宽和高都必须是 **16 的倍数**
- 单边最大 **3840px**
- 宽高比不超过 **3:1**
- 总像素在 655,360 ~ 8,294,400 之间

常用自定义尺寸参考:

| 尺寸 | 分辨率 | 适用场景 |
|---|---|---|
| `1920x1080` | 1080p | 博客封面、网页横幅 |
| `1080x1920` | 1080p 竖版 | 手机壁纸、社交媒体故事 |
| `2560x1440` | 2K QHD | 桌面壁纸 |
| `3840x2160` | 4K UHD | 高清海报、大屏展示 |

不同尺寸会影响生成耗时和 token 消耗,尺寸越大费用越高。超过 2560x1440 的尺寸为实验性功能,生成结果可能存在不稳定性。
:::

#### 指定输出格式和压缩质量

通过 `output_mime_type` 和 `output_compression_quality` 控制输出格式:

::: code-group

```Python [Python]
response = client.models.generate_images(
    model="openai/gpt-image-2",
    prompt="A minimalist logo design",
    config=types.GenerateImagesConfig(
        number_of_images=2,                 # 生成 2 张
        output_mime_type="image/webp",      # WebP 格式,体积更小
        output_compression_quality=80,      # 80% 压缩质量
    )
)

for i, img in enumerate(response.generated_images):
    img.image.save(f"logo_{i}.webp")
```

```ts [TypeScript]
const response = await client.models.generateImages({
  model: "openai/gpt-image-2",
  prompt: "A minimalist logo design",
  config: {
    numberOfImages: 2,                    // 生成 2 张
    outputMimeType: "image/webp",         // WebP 格式,体积更小
    outputCompressionQuality: 80,         // 80% 压缩质量
  },
});
```

:::

::: tip 💡 输出格式
- `image/png`: 无损格式,适合需要高保真的场景（默认）
- `image/webp`: 体积更小,适合 Web 展示
- `image/jpeg`: 通用有损格式,可配合 `output_compression_quality` 控制质量
:::

### 编辑图片

在已有图片的基础上进行修改,使用 `edit_image` 接口:

::: code-group

```Python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # 替换为你的 API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

# 先生成一张图片
generate_response = client.models.generate_images(
    model="openai/gpt-image-2",
    prompt="A cat sitting on a table"
)

# 基于生成的图片进行编辑
edit_response = client.models.edit_image(
    model="openai/gpt-image-2",
    prompt="Add a robot next to the cat",
    reference_images=[
        types.RawReferenceImage(
            reference_id=1,
            reference_image=generate_response.generated_images[0].image
        )
    ]
)

# 保存编辑后的图片
for i, img in enumerate(edit_response.generated_images):
    img.image.save(f"edited_{i}.png")
    print(f"Edited image saved as edited_{i}.png")
```

```ts [TypeScript]
const { GoogleGenAI, RawReferenceImage } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: "$ZENMUX_API_KEY", // 替换为你的 API Key
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1",
  },
});

// 先生成一张图片
const generateResponse = await client.models.generateImages({
  model: "openai/gpt-image-2",
  prompt: "A cat sitting on a table",
});

// 基于生成的图片进行编辑
const editResponse = await client.models.editImage({
  model: "openai/gpt-image-2",
  prompt: "Add a robot next to the cat",
  referenceImages: [
    new RawReferenceImage({
      referenceId: 1,
      referenceImage: generateResponse.generatedImages[0].image,
    }),
  ],
});

console.log(editResponse);
```

:::

#### 使用蒙版编辑图片

通过蒙版（Mask）指定图片中需要编辑的区域,蒙版的透明区域即为编辑区域:

::: code-group

```Python [Python]
import urllib.request

from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

# 加载原图和蒙版（这里以 ZenMux Logo 作为示例）
LOGO_URL = "https://cdn.marmot-cloud.com/storage/zenmux/2026/04/28/74mUf4t/Log-Light.png"
logo_bytes = urllib.request.urlopen(LOGO_URL).read()

original_image = types.Image(image_bytes=logo_bytes, mime_type="image/png")
mask_image = types.Image(image_bytes=logo_bytes, mime_type="image/png")  # 透明区域为需要编辑的部分

edit_response = client.models.edit_image(
    model="openai/gpt-image-2",
    prompt="Replace the background with a beach scene",
    reference_images=[
        types.RawReferenceImage(
            reference_id=1,
            reference_image=original_image
        ),
        types.MaskReferenceImage(
            reference_id=2,
            reference_image=mask_image,
            config=types.MaskReferenceConfig(
                mask_mode="MASK_MODE_USER_PROVIDED",
            )
        )
    ],
    config=types.EditImageConfig(
        number_of_images=1,
        output_mime_type="image/png",
        http_options=types.HttpOptions(
            extra_body={
                "imageSize": "1024x1024",
                "quality": "high",
            }
        ),
    )
)

for i, img in enumerate(edit_response.generated_images):
    img.image.save(f"masked_edit_{i}.png")
```

```ts [TypeScript]
const { GoogleGenAI, RawReferenceImage, MaskReferenceImage } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: "$ZENMUX_API_KEY",
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1",
  },
});

// 加载原图和蒙版（这里以 ZenMux Logo 作为示例）
const LOGO_URL =
  "https://cdn.marmot-cloud.com/storage/zenmux/2026/04/28/74mUf4t/Log-Light.png";
const logoBytes = Buffer.from(await (await fetch(LOGO_URL)).arrayBuffer());

const originalImage = {
  imageBytes: logoBytes,
  mimeType: "image/png",
};
const maskImage = {
  imageBytes: logoBytes, // 透明区域为需要编辑的部分
  mimeType: "image/png",
};

const editResponse = await client.models.editImage({
  model: "openai/gpt-image-2",
  prompt: "Replace the background with a beach scene",
  referenceImages: [
    new RawReferenceImage({
      referenceId: 1,
      referenceImage: originalImage,
    }),
    new MaskReferenceImage({
      referenceId: 2,
      referenceImage: maskImage,
      config: {
        maskMode: "MASK_MODE_USER_PROVIDED",
      },
    }),
  ],
  config: {
    numberOfImages: 1,
    outputMimeType: "image/png",
    httpOptions: {
      extraBody: {
        imageSize: "1024x1024",
        quality: "high",
      },
    },
  },
});

console.log(editResponse);
```

:::

::: tip 💡 接口区别

- **Google Gemini 模型**使用 `generate_content` 接口,需要指定 `response_modalities: ["TEXT", "IMAGE"]`,响应中同时包含文本和图片。
- **非 Google 模型**使用 `generate_images` / `edit_image` 接口,直接返回图片对象,支持图片编辑功能。
  :::

## 配置说明

### 必需参数

- **api_key**: 你的 ZenMux API 密钥
- **vertexai**: 必须设置为 `true` 以启用 Vertex AI 协议
- **base_url**: ZenMux Vertex AI 端点 `https://zenmux.ai/api/vertex-ai`
- **responseModalities**: 响应模态,图片生成必须包含 `["TEXT", "IMAGE"]`

### 调用模式

ZenMux 支持两种调用模式:

- **流式调用** (`generate_content_stream` / `generateContentStream`): 适合需要实时反馈的场景
- **非流式调用** (`generate_content` / `generateContent`): 等待完整响应后一次性返回

::: warning ⚠️ 响应处理
图片生成模型的响应可能同时包含文本和图片。请遍历 `response.parts` 以处理所有内容部分。
:::

## 最佳实践

1. **提示词优化**: 使用清晰、具体的描述以获得更好的生成效果
2. **错误处理**: 建议添加异常处理逻辑,处理 API 调用失败的情况
3. **图片保存**: Python SDK 提供了便捷的 `as_image()` 方法将响应转换为 PIL Image 对象
4. **模型选择**: 根据需求选择合适的模型,免费模型适合测试,付费模型提供更高质量
