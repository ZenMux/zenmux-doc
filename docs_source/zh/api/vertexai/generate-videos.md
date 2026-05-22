---
pageClass: api-page
title: 生成视频（Vertex AI 协议）
head:
  - - meta
    - name: description
      content: Zenmux documentation - generate videos via Vertex AI protocol
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, generate, videos, veo, vertex-ai, seedance, video generation
---

# Google Vertex AI API: Generate Videos

::: tip 💡 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

### 提交生成请求：

```
POST https://zenmux.ai/api/vertex-ai/v1/publishers/{provider}/models/{model}:predictLongRunning
```

### 轮询任务状态：

```
POST https://zenmux.ai/api/vertex-ai/v1/publishers/{provider}/models/{model}:fetchPredictOperation
```

Generate Videos 接口通过 Google Vertex AI 协议生成视频。ZenMux 聚合了 Google Veo、字节跳动 Seedance、阿里 DashScope、SkyReels 等视频生成模型，均可通过统一的 Vertex AI 协议调用。

本接口对应 Google Gen AI SDK 中的 `generate_videos` / `generateVideos` 方法。调用时请将 Base URL 设置为 `https://zenmux.ai/api/vertex-ai`，并使用 ZenMux API Key 鉴权。

更多使用示例请参考 [视频生成使用指南](/zh/guide/advanced/video-generation)。

::: warning ⚠️ 异步调用
视频生成是一个**异步过程**，分为三个步骤：

1. **提交请求**（`generate_videos`）：发送视频生成请求，返回一个 `Operation` 对象
2. **轮询状态**（`operations.get`）：定期检查生成状态，建议间隔 **15 秒**
3. **获取结果**：当 `operation.done` 为 `true` 时，从 `operation.response.generated_videos` 获取视频

视频生成通常需要 **30 秒到 3 分钟**，请耐心等待，不要设置过短的轮询间隔。
:::

## 支持的模型

| 模型                                 | 说明                      | 分辨率       | 最大时长 | 音频    |
| ------------------------------------ | ------------------------- | ------------ | -------- | ------- |
| `google/veo-3.1-generate-001`        | Google Veo 3.1            | 720p / 1080p | 8s       | ✅ 支持 |
| `volcengine/doubao-seedance-1.5-pro` | 字节跳动 Seedance 1.5 Pro | 720p / 1080p | 10s      | ✅ 支持 |
| `volcengine/doubao-seedance-2`       | 字节跳动 Seedance 2       | 720p / 1080p | 10s      | ✅ 支持 |

::: tip 📚 更多模型
访问 [ZenMux 模型列表](https://zenmux.ai/models) 搜索查看所有可用的视频生成模型。
:::

## Path parameters

### provider `string` <font color="FA6062">必填</font>

模型供应商标识。对应模型名称中 `/` 前的部分，例如 `google/veo-3.1-generate-001` 中的 `google`。

### model `string` <font color="FA6062">必填</font>

模型名称。对应模型名称中 `/` 后的部分，例如 `google/veo-3.1-generate-001` 中的 `veo-3.1-generate-001`。

## 鉴权参数

### api_key `string` <font color="FA6062">必填</font>

ZenMux API 密钥，用于身份鉴权。

### vertexai `boolean` <font color="FA6062">必填</font>

必须设置为 `true` 以启用 Vertex AI 协议。

### http_options.base_url `string` <font color="FA6062">必填</font>

ZenMux Vertex AI 端点：`https://zenmux.ai/api/vertex-ai`。

### http_options.api_version `string` <font color="FA6062">必填</font>

API 版本，设置为 `v1`。

## 文生视频请求参数

以下为 `generate_videos` / `generateVideos` SDK 方法的参数说明。SDK 会自动将这些参数转换为 Vertex AI REST 格式发送给 ZenMux。

### prompt `string` <font color="FA6062">必选</font>

视频内容的文本描述。建议包含主体、动作、环境和光线等要素，使用清晰具体的描述。

### model `string` <font color="FA6062">必选</font>

用于视频生成的模型。格式为 `{provider}/{model}`，例如 `google/veo-3.1-generate-001`。

### config `GenerateVideosConfig` <font color="gray">可选</font>

视频生成配置对象，包含以下字段：

#### aspectRatio `string` <font color="gray">可选</font>

视频宽高比。不同供应商支持的值可能不同。

可选值：

- `16:9`（横屏，默认）
- `9:16`（竖屏）
- `1:1`（正方形）

> REST 对应字段：`parameters.aspectRatio`

#### resolution `string` <font color="gray">可选</font>

视频分辨率。仅部分模型支持。

可选值：

- `720p`
- `1080p`

> REST 对应字段：`parameters.resolution`

#### durationSeconds `integer` <font color="gray">可选</font>

视频时长（秒）。Google Veo 支持 5 或 8 秒，其他供应商支持范围可能不同。

可选值：

- `5`
- `8`

> REST 对应字段：`parameters.durationSeconds`

#### generateAudio `boolean` <font color="gray">可选</font>

是否生成音频轨道。设置为 `true` 时，模型会根据视频内容自动生成配套音频。

> REST 对应字段：`parameters.generateAudio`

#### negativePrompt `string` <font color="gray">可选</font>

负面提示词，描述不希望出现在视频中的内容。

> REST 对应字段：`parameters.negativePrompt`

#### enhancePrompt `boolean` <font color="gray">可选</font>

是否启用提示词增强。开启后模型会自动优化提示词以提升视频质量。

> REST 对应字段：`parameters.enhancePrompt`

#### personGeneration `string` <font color="gray">可选</font>

人物生成控制。仅 Google Veo 模型支持。

可选值：

- `dont_allow`
- `allow_adult`

> REST 对应字段：`parameters.personGeneration`

#### numberOfVideos `integer` <font color="gray">可选</font>

要生成的视频数量。默认为 1。

SDK 字段名：Python `number_of_videos`，TypeScript `numberOfVideos`。

> REST 对应字段：`parameters.sampleCount`

#### seed `integer` <font color="gray">可选</font>

随机种子，用于复现生成结果。

> REST 对应字段：`parameters.seed`

#### fps `integer` <font color="gray">可选</font>

视频帧率。仅部分供应商支持。

> REST 对应字段：`parameters.fps`

## 图生视频请求参数

除文生视频外，还支持传入图片作为起始帧/结束帧，结合文本提示词生成视频。

### image `Image` <font color="FA6062">必选</font>

起始帧图片对象。

- `image_bytes` `bytes` <font color="FA6062">必选</font>：图片的二进制数据。
- `mime_type` `string` <font color="FA6062">必选</font>：图片 MIME 类型，如 `image/png`、`image/jpeg`。

> REST 对应字段：`instances[0].image`

### last_frame `Image` <font color="gray">可选</font>

结束帧图片对象。与起始帧配合使用，模型会生成从起始帧到结束帧的过渡动画。格式同 `image`。

SDK 字段名：Python `last_frame`，TypeScript `lastFrame`。

> REST 对应字段：`instances[0].lastFrame`

### prompt `string` <font color="gray">可选</font>

描述图片中的内容应如何运动或变化的文本提示词。

### model `string` <font color="FA6062">必选</font>

同文生视频。

### config `GenerateVideosConfig` <font color="gray">可选</font>

同文生视频配置。

## Response

### 提交请求响应（Operation 对象）

提交视频生成请求后，返回一个 `Operation` 对象，用于追踪生成状态。

#### name `string`

Operation 标识符，用于后续轮询状态。

#### done `boolean`

生成是否完成。未完成时此字段可能不存在或为 `false`。

### 生成完成响应

当 `done` 为 `true` 时，`response` 中包含生成结果。

#### response.videos `array<Video>`

生成的视频列表。

- `gcsUri` `string`：视频下载 URL。
- `bytesBase64Encoded` `string`：视频的 base64 编码数据（部分供应商返回）。
- `mimeType` `string`：视频 MIME 类型，通常为 `video/mp4`。

::: tip 💡 关于 SDK 响应
SDK 会自动将 REST 响应转换为 `GenerateVideosResponse` 对象，通过 `operation.response.generated_videos[].video` 访问视频内容。
:::

#### response.raiMediaFilteredCount `integer`

被内容审核拦截的视频数量。

#### response.raiMediaFilteredReasons `array<string>`

内容审核拦截的原因列表。

### 生成失败响应

当生成失败时，`raiMediaFilteredCount` 大于 0，`raiMediaFilteredReasons` 中包含错误信息。

::: api-request POST /api/vertex-ai/v1

```cURL
# Step 1: 提交视频生成请求
curl -X POST "https://zenmux.ai/api/vertex-ai/v1/publishers/google/models/veo-3.1-generate-001:predictLongRunning" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [{
      "prompt": "A golden retriever running on the beach at sunset"
    }],
    "parameters": {
      "aspectRatio": "16:9",
      "durationSeconds": 8,
      "generateAudio": true
    }
  }'

# 响应中包含 operation name，用于轮询
# {"name": "publishers/google/models/veo-3.1-generate-001/operations/abc123"}

# Step 2: 轮询任务状态（每 15 秒一次）
curl -X POST "https://zenmux.ai/api/vertex-ai/v1/publishers/google/models/veo-3.1-generate-001:fetchPredictOperation" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"operationName": "publishers/google/models/veo-3.1-generate-001/operations/abc123"}'
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

// Step 1: 提交视频生成请求
let operation = await client.models.generateVideos({
  model: "google/veo-3.1-generate-001",
  prompt: "A golden retriever running on the beach at sunset",
  config: {
    aspectRatio: "16:9",
    durationSeconds: 8,
    generateAudio: true,
  },
});

// Step 2: 轮询等待生成完成
while (!operation.done) {
  await new Promise((r) => setTimeout(r, 15000));
  operation = await client.operations.get(operation);
}

// Step 3: 获取生成结果
for (const video of operation.response.generatedVideos) {
  console.log("Video URL:", video.video.uri);
}
```

```Python
from google import genai
from google.genai import types
import time

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # [!code highlight]
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai"  # [!code highlight]
    ),
)

# Step 1: 提交视频生成请求
operation = client.models.generate_videos(
    model="google/veo-3.1-generate-001",
    prompt="A golden retriever running on the beach at sunset",
    config=types.GenerateVideosConfig(
        aspectRatio="16:9",
        durationSeconds=8,
        generateAudio=True,
    ),
)

# Step 2: 轮询等待生成完成
while not operation.done:
    time.sleep(15)
    operation = client.operations.get(operation)

# Step 3: 获取生成结果
for video in operation.response.generated_videos:
    print("Video:", video)
```

:::

::: api-response

```json
// 提交请求后返回（生成中）
{
  "name": "publishers/google/models/veo-3.1-generate-001/operations/abc123"
}

// 轮询完成后返回
{
  "name": "publishers/google/models/veo-3.1-generate-001/operations/abc123",
  "done": true,
  "response": {
    "videos": [
      {
        "bytesBase64Encoded": "AAAAIGZ0eXBpc29t...",
        "mimeType": "video/mp4"
      }
    ]
  }
}
```

:::

::: api-request POST /api/vertex-ai/v1

```cURL
# Step 1: 提交图生视频请求（图片以 base64 编码传入）
curl -X POST "https://zenmux.ai/api/vertex-ai/v1/publishers/google/models/veo-3.1-generate-001:predictLongRunning" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [{
      "prompt": "The dog stands up and runs toward the ocean waves",
      "image": {
        "bytesBase64Encoded": "<BASE64_IMAGE_DATA>",
        "mimeType": "image/png"
      }
    }],
    "parameters": {
      "aspectRatio": "16:9",
      "durationSeconds": 8
    }
  }'

# Step 2: 轮询任务状态
curl -X POST "https://zenmux.ai/api/vertex-ai/v1/publishers/google/models/veo-3.1-generate-001:fetchPredictOperation" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"operationName": "publishers/google/models/veo-3.1-generate-001/operations/xyz789"}'
```

```TypeScript
const { GoogleGenAI } = require("@google/genai");
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

// Step 1: 提交图生视频请求
let operation = await client.models.generateVideos({
  model: "google/veo-3.1-generate-001",
  image: {
    imageBytes: imageBytes,
    mimeType: "image/png",
  },
  prompt: "The dog stands up and runs toward the ocean waves",
  config: {
    aspectRatio: "16:9",
    durationSeconds: 8,
  },
});

// Step 2: 轮询等待生成完成
while (!operation.done) {
  await new Promise((r) => setTimeout(r, 15000));
  operation = await client.operations.get(operation);
}

// Step 3: 获取生成结果
for (const video of operation.response.generatedVideos) {
  console.log("Video URL:", video.video.uri);
}
```

```Python
from google import genai
from google.genai import types
import time

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

# Step 1: 提交图生视频请求
operation = client.models.generate_videos(
    model="google/veo-3.1-generate-001",
    image=types.Image(image_bytes=image_bytes, mime_type="image/png"),
    prompt="The dog stands up and runs toward the ocean waves",
    config=types.GenerateVideosConfig(
        aspectRatio="16:9",
        durationSeconds=8,
    ),
)

# Step 2: 轮询等待生成完成
while not operation.done:
    time.sleep(15)
    operation = client.operations.get(operation)

# Step 3: 获取生成结果
for video in operation.response.generated_videos:
    print("Video:", video)
```

:::

::: api-response

```json
{
  "name": "publishers/google/models/veo-3.1-generate-001/operations/xyz789",
  "done": true,
  "response": {
    "videos": [
      {
        "bytesBase64Encoded": "AAAAIGZ0eXBpc29t...",
        "mimeType": "video/mp4"
      }
    ]
  }
}
```

:::
