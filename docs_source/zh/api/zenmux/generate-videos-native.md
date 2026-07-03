---
pageClass: api-page
title: 视频生成（原生协议）
head:
  - - meta
    - name: description
      content: Zenmux documentation - generate videos via the native protocol
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, generate, videos, native, 原生协议, video generation
---

# ZenMux 原生 API: 视频生成

::: info 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

### 提交生成请求：

```http
POST https://zenmux.ai/api/v1/videos
```

### 轮询任务状态：

```http
GET https://zenmux.ai/api/v1/videos/{jobId}
```

该接口以**原生（原厂）协议**生成视频，请求体直接采用供应商原生的 `content` 数组结构，无需 SDK，使用标准 `Authorization: Bearer` 鉴权。如果你希望通过 Google Vertex AI 协议调用同一批模型，请参考 [Generate Videos（Vertex AI 协议）](/zh/api/vertexai/generate-videos)。

::: warning 异步调用
视频生成是一个**异步过程**，分为三个步骤：

1. **提交请求**（`POST /api/v1/videos`）：返回任务 `id` 与初始 `status`。
2. **轮询状态**（`GET /api/v1/videos/{jobId}`）：定期检查生成状态，建议间隔 **15 秒**。
3. **获取结果**：当 `status` 为 `succeeded` 时，从 `content` 中获取视频。

视频生成通常需要 **30 秒到 3 分钟**，请耐心等待，不要设置过短的轮询间隔。
:::

::: tip 提交后立即轮询
提交成功后即可立即轮询，任务记录会同步落库，`GET /api/v1/videos/{jobId}` 会返回 `queued`（不会因为落库延迟而返回 `404`）。仅当 `jobId` 不存在或已过期时才会返回 `404`。
:::

## 支持的模型

| 模型                            | 分辨率              | 最大时长 | 音频    |
| ------------------------------- | ------------------- | -------- | ------- |
| `bytedance/doubao-seedance-2.0` | 480p / 720p / 1080p | 10s      | ✅ 支持 |

::: info 更多模型
访问 [ZenMux 模型列表](https://zenmux.ai/models) 搜索查看所有可用的视频生成模型。
:::

## 鉴权参数

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

请求头，格式为 `Bearer $ZENMUX_API_KEY`，使用 ZenMux API 密钥进行身份鉴权。

## 提交请求体参数

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

用于视频生成的模型 slug，格式为 `{provider}/{model}`，例如 `bytedance/doubao-seedance-2.0`。

### content `array` <span style="color: #FA6062; font-weight: 400">\*</span>

内容项数组，每一项通过 `type` 区分类型，可包含文本提示词与多种参考媒体。

#### type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

内容项类型，可选值：`text` | `image_url` | `video_url` | `audio_url`。

#### text `string`

当 `type` 为 `text` 时使用，作为视频内容的文本提示词。若传入多个 `text` 项，会按顺序拼接。

#### role `string`

媒体项的角色，按 `type` 取值：

- `image_url`：`first_frame`（首帧，省略 `role` 时的默认值）、`last_frame`（尾帧）、`reference_image`（参考图）。
- `video_url`：`reference_video`（参考视频）。
- `audio_url`：`reference_audio`（参考音频，部分模型支持）。

#### image_url / video_url / audio_url `object`

对应媒体的容器对象，包含单个字段 `url`：

- `url` `string`：媒体地址，支持 http(s) URL，或 `data:<mime>;base64,<data>` 形式的 Data URI。

### resolution `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

视频分辨率，例如 `480p`、`720p`、`1080p`。

### ratio `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

视频宽高比，例如 `16:9`、`9:16`、`adaptive`。

### duration `integer` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

视频时长（秒），例如 `5`。

### seed `integer` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

随机种子，`-1` 表示随机。

### generate_audio `boolean` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

是否同时生成音频轨道。

### callback_url `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

任务完成时回调通知的 URL。

### return_last_frame `boolean` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

是否在结果中返回视频的尾帧（`content.last_frame_url`）。

### tools `array` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

原生工具/能力开关，透传给供应商。

### frames `integer` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

生成的帧数（部分模型/模式支持）。

### watermark `boolean` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

是否为生成的视频添加水印。

::: info 字段透传
上述可选字段以及其它未列出的原生字段都会原样透传给供应商，由供应商按模型/模式校验；不支持的字段会返回原生错误。
:::

## Path 参数（轮询）

### jobId `string` <span style="color: #FA6062; font-weight: 400">\*</span>

提交请求返回的任务 `id`。

## Response

### 提交请求响应

```json
{
  "id": "fff8799f449e4ada8ceebe0079f7c01c",
  "status": "queued",
  "model": "bytedance/doubao-seedance-2.0"
}
```

#### id `string`

任务标识符，用于后续轮询。

#### status `string`

任务状态。提交后通常为 `queued`。

#### model `string`

本次任务使用的模型 slug。

### 轮询响应

`status` 取值为 `queued` | `running` | `succeeded` | `failed`。

**生成中**（`queued` / `running`）：

```json
{
  "id": "fff8799f449e4ada8ceebe0079f7c01c",
  "status": "running",
  "model": "bytedance/doubao-seedance-2.0"
}
```

**生成成功**（`succeeded`）：

```json
{
  "id": "fff8799f449e4ada8ceebe0079f7c01c",
  "status": "succeeded",
  "model": "bytedance/doubao-seedance-2.0",
  "content": {
    "video_url": "https://.../result.mp4",
    "last_frame_url": "https://.../last_frame.jpg"
  }
}
```

- `content.video_url` `string`：生成视频的下载 URL。
- `content.last_frame_url` `string`：视频尾帧的下载 URL（当请求设置了 `return_last_frame` 时返回）。
- `content` 为原样透传的原生结果，除上述字段外还可能包含其它原生字段。

**生成失败**（`failed`）：

```json
{
  "id": "fff8799f449e4ada8ceebe0079f7c01c",
  "status": "failed",
  "model": "bytedance/doubao-seedance-2.0",
  "error": {
    "code": "generation_failed",
    "message": "<失败原因>"
  }
}
```

**任务不存在**（HTTP 404）：

```json
{
  "error": {
    "code": "404",
    "type": "not_found",
    "message": "Video task '<jobId>' not found"
  }
}
```

::: api-request POST /api/v1/videos

```bash [cURL]
# Step 1: 提交视频生成请求
curl -X POST "https://zenmux.ai/api/v1/videos" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/doubao-seedance-2.0",
    "content": [
      { "type": "text", "text": "a cat reading a book under soft morning light" }
    ],
    "resolution": "720p",
    "ratio": "16:9",
    "duration": 5,
    "seed": -1,
    "generate_audio": true
  }'

# 响应中包含任务 id，用于轮询
# {"id": "fff8799f449e4ada8ceebe0079f7c01c", "status": "queued", "model": "bytedance/doubao-seedance-2.0"}

# Step 2: 轮询任务状态（每 15 秒一次）
curl "https://zenmux.ai/api/v1/videos/fff8799f449e4ada8ceebe0079f7c01c" \
  -H "Authorization: Bearer $ZENMUX_API_KEY"
```

```bash [图生视频 / 参考音频]
# 通过 content 数组传入首帧图、参考视频或参考音频
curl -X POST "https://zenmux.ai/api/v1/videos" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/doubao-seedance-2.0",
    "content": [
      { "type": "text", "text": "The singer performs on stage in sync with the music" },
      { "type": "image_url", "role": "first_frame", "image_url": { "url": "https://example.com/first.png" } },
      { "type": "audio_url", "role": "reference_audio", "audio_url": { "url": "https://example.com/ref.mp3" } }
    ],
    "resolution": "720p",
    "ratio": "16:9",
    "duration": 5,
    "generate_audio": true
  }'
```

:::

::: api-response

```json
// 提交请求后返回（生成中）
{
  "id": "fff8799f449e4ada8ceebe0079f7c01c",
  "status": "queued",
  "model": "bytedance/doubao-seedance-2.0"
}

// 轮询完成后返回
{
  "id": "fff8799f449e4ada8ceebe0079f7c01c",
  "status": "succeeded",
  "model": "bytedance/doubao-seedance-2.0",
  "content": {
    "video_url": "https://.../result.mp4",
    "last_frame_url": "https://.../last_frame.jpg"
  }
}
```

:::
