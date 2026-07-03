---
pageClass: api-page
title: Generate Videos (Native Protocol)
head:
  - - meta
    - name: description
      content: Zenmux documentation - generate videos via the native protocol
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, generate, videos, native, video generation
---

# ZenMux Native API: Generate Videos

::: info Troubleshooting
Encountering errors? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting solutions.
:::

### Submit a generation request:

```http
POST https://zenmux.ai/api/v1/videos
```

### Poll task status:

```http
GET https://zenmux.ai/api/v1/videos/{jobId}
```

This endpoint generates videos using the **native (original-vendor) protocol**: the request body adopts the vendor's native `content` array structure directly — no SDK required, authenticated with a standard `Authorization: Bearer` header. If you'd rather call the same models through the Google Vertex AI protocol, see [Generate Videos (Vertex AI Protocol)](/api/vertexai/generate-videos).

::: warning Asynchronous calls
Video generation is an **asynchronous process** with three steps:

1. **Submit** (`POST /api/v1/videos`): returns the task `id` and initial `status`.
2. **Poll** (`GET /api/v1/videos/{jobId}`): check the status periodically, recommended every **15 seconds**.
3. **Retrieve result**: when `status` is `succeeded`, read the video from `content`.

Video generation usually takes **30 seconds to 3 minutes** — be patient and don't poll too frequently.
:::

::: tip Polling right after submit
You can poll immediately after submit — the task record is persisted synchronously, so `GET /api/v1/videos/{jobId}` returns `queued` (it will not `404` due to write lag). A `404` is only returned for an unknown or expired `jobId`.
:::

## Supported models

| Model                           | Resolution          | Max duration | Audio        |
| ------------------------------- | ------------------- | ------------ | ------------ |
| `bytedance/doubao-seedance-2.0` | 480p / 720p / 1080p | 10s          | ✅ Supported |

::: info More models
Visit the [ZenMux model list](https://zenmux.ai/models) to search all available video generation models.
:::

## Authentication

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Request header in the form `Bearer $ZENMUX_API_KEY`, using your ZenMux API key for authentication.

## Submit request body

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The model slug used for generation, in the form `{provider}/{model}`, e.g. `bytedance/doubao-seedance-2.0`.

### content `array` <span style="color: #FA6062; font-weight: 400">\*</span>

An array of content items. Each item is distinguished by `type` and may contain a text prompt and various reference media.

#### type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Content item type. One of: `text` | `image_url` | `video_url` | `audio_url`.

#### text `string`

Used when `type` is `text`; the text prompt describing the video. Multiple `text` items are concatenated in order.

#### role `string`

Role of the media item, by `type`:

- `image_url`: `first_frame` (the default when `role` is omitted), `last_frame`, or `reference_image`.
- `video_url`: `reference_video`.
- `audio_url`: `reference_audio` (supported by some models).

#### image_url / video_url / audio_url `object`

Container object for the corresponding media, with a single field `url`:

- `url` `string`: the media address. Accepts an http(s) URL, or a `data:<mime>;base64,<data>` Data URI.

### resolution `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Video resolution, e.g. `480p`, `720p`, `1080p`.

### ratio `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Aspect ratio, e.g. `16:9`, `9:16`, `adaptive`.

### duration `integer` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Video duration in seconds, e.g. `5`.

### seed `integer` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Random seed; `-1` means random.

### generate_audio `boolean` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Whether to also generate an audio track.

### callback_url `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

URL notified via callback when the task finishes.

### return_last_frame `boolean` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Whether to also return the video's last frame in the result (`content.last_frame_url`).

### tools `array` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Native tools / capability toggles, passed through to the provider.

### frames `integer` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Number of frames to generate (supported by some models/modes).

### watermark `boolean` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Whether to add a watermark to the generated video.

::: info Field passthrough
These optional fields — and any other unlisted native fields — are passed through to the provider as-is and validated by the provider per model/mode; unsupported fields return a native error.
:::

## Path parameters (poll)

### jobId `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The task `id` returned by the submit request.

## Response

### Submit response

```json
{
  "id": "fff8799f449e4ada8ceebe0079f7c01c",
  "status": "queued",
  "model": "bytedance/doubao-seedance-2.0"
}
```

#### id `string`

Task identifier, used for subsequent polling.

#### status `string`

Task status. Usually `queued` right after submit.

#### model `string`

The model slug used for this task.

### Poll response

`status` is one of `queued` | `running` | `succeeded` | `failed`.

**In progress** (`queued` / `running`):

```json
{
  "id": "fff8799f449e4ada8ceebe0079f7c01c",
  "status": "running",
  "model": "bytedance/doubao-seedance-2.0"
}
```

**Succeeded** (`succeeded`):

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

- `content.video_url` `string`: download URL of the generated video.
- `content.last_frame_url` `string`: download URL of the video's last frame (returned when `return_last_frame` was set).
- `content` is the native result passed through as-is and may include additional native fields beyond those above.

**Failed** (`failed`):

```json
{
  "id": "fff8799f449e4ada8ceebe0079f7c01c",
  "status": "failed",
  "model": "bytedance/doubao-seedance-2.0",
  "error": {
    "code": "generation_failed",
    "message": "<reason>"
  }
}
```

**Task not found** (HTTP 404):

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
# Step 1: Submit a video generation request
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

# The response contains the task id, used for polling
# {"id": "fff8799f449e4ada8ceebe0079f7c01c", "status": "queued", "model": "bytedance/doubao-seedance-2.0"}

# Step 2: Poll task status (every 15 seconds)
curl "https://zenmux.ai/api/v1/videos/fff8799f449e4ada8ceebe0079f7c01c" \
  -H "Authorization: Bearer $ZENMUX_API_KEY"
```

```bash [Image-to-video / reference audio]
# Pass a first-frame image, reference video, or reference audio via the content array
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
// Returned after submit (in progress)
{
  "id": "fff8799f449e4ada8ceebe0079f7c01c",
  "status": "queued",
  "model": "bytedance/doubao-seedance-2.0"
}

// Returned after polling completes
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
