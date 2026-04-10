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

- `google/gemini-3-pro-image-preview`
- `google/gemini-3-pro-image-preview-free`
- `google/gemini-2.5-flash-image`
- `google/gemini-2.5-flash-image-free`

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
        base_url='https://zenmux.ai/api/vertex-ai/v1'
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
  apiKey: "$ZENMUX_API_KEY",  // 替换为你的 API Key
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai/v1",
    apiVersion: "v1"
  }
});

// 流式调用: generateContentStream
// 非流式调用: generateContent
const response = await client.models.generateContent({
  model: "google/gemini-3-pro-image-preview",
  contents: "Generate an image of the Eiffel tower with fireworks in the background",
  config: {
    responseModalities: ["TEXT", "IMAGE"],  // 必须指定响应模态
    // 更多配置参数请参考 Vertex AI 官方文档
  }
});

console.log(response);
```

:::

## 配置说明

### 必需参数

- **api_key**: 你的 ZenMux API 密钥
- **vertexai**: 必须设置为 `true` 以启用 Vertex AI 协议
- **base_url**: ZenMux Vertex AI 端点 `https://zenmux.ai/api/vertex-ai/v1`
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
