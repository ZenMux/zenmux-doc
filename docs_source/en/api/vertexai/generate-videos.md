---
pageClass: api-page
title: Generate Videos (Vertex AI Protocol)
head:
  - - meta
    - name: description
      content: Zenmux documentation - generate videos via Vertex AI protocol
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, generate, videos, veo, vertex-ai, seedance, video generation
---

# Google Vertex AI API: Generate Videos

::: info Troubleshooting
Encountering errors? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting solutions.
:::

### Submit a generation request:

```http
POST https://zenmux.ai/api/vertex-ai/v1/publishers/{provider}/models/{model}:predictLongRunning
```

### Poll task status:

```http
POST https://zenmux.ai/api/vertex-ai/v1/publishers/{provider}/models/{model}:fetchPredictOperation
```

The Generate Videos endpoint produces videos via the Google Vertex AI protocol. ZenMux aggregates video generation models from Google Veo, ByteDance Seedance, Alibaba DashScope, SkyReels, and more — all accessible through the unified Vertex AI protocol.

This endpoint corresponds to the `generate_videos` / `generateVideos` method in the Google Gen AI SDK. Set the Base URL to `https://zenmux.ai/api/vertex-ai` and authenticate with your ZenMux API Key.

For more usage examples, see the [Video Generation Guide](/guide/advanced/video-generation).

::: warning Asynchronous Workflow
Video generation is an **asynchronous process** consisting of three steps:

1. **Submit request** (`generate_videos`): Send the video generation request and receive an `Operation` object
2. **Poll status** (`operations.get`): Periodically check generation status; recommended interval is **15 seconds**
3. **Retrieve result**: When `operation.done` is `true`, get the video from `operation.response.generated_videos`

Video generation typically takes **30 seconds to 3 minutes**. Please be patient and avoid setting excessively short polling intervals.
:::

## Supported Models

| Model                                | Description                | Resolution   | Max Duration | Audio        |
| ------------------------------------ | -------------------------- | ------------ | ------------ | ------------ |
| `google/veo-3.1-generate-001`        | Google Veo 3.1             | 720p / 1080p | 8s           | ✅ Supported |
| `volcengine/doubao-seedance-1.5-pro` | ByteDance Seedance 1.5 Pro | 720p / 1080p | 10s          | ✅ Supported |
| `volcengine/doubao-seedance-2`       | ByteDance Seedance 2       | 720p / 1080p | 10s          | ✅ Supported |

::: info More Models
Visit the [ZenMux Models List](https://zenmux.ai/models) to browse all available video generation models.
:::

## Path parameters

### provider `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The model provider identifier. This is the portion before `/` in the model name — for example, `google` in `google/veo-3.1-generate-001`.

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The model name. This is the portion after `/` in the model name — for example, `veo-3.1-generate-001` in `google/veo-3.1-generate-001`.

## Authentication Parameters

### api_key `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Your ZenMux API key for authentication.

### vertexai `boolean` <span style="color: #FA6062; font-weight: 400">\*</span>

Must be set to `true` to enable the Vertex AI protocol.

### http_options.base_url `string` <span style="color: #FA6062; font-weight: 400">\*</span>

ZenMux Vertex AI endpoint: `https://zenmux.ai/api/vertex-ai`.

### http_options.api_version `string` <span style="color: #FA6062; font-weight: 400">\*</span>

API version, set to `v1`.

## Text-to-Video Request Parameters

The following describes the parameters for the `generate_videos` / `generateVideos` SDK method. The SDK automatically converts these parameters to the Vertex AI REST format before sending them to ZenMux.

### prompt `string` <span style="color: #FA6062; font-weight: 400">\*</span>

A text description of the video content. Include details such as subject, actions, environment, and lighting for best results.

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The model to use for video generation. Format: `{provider}/{model}`, e.g., `google/veo-3.1-generate-001`.

### config `GenerateVideosConfig` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Video generation configuration object with the following fields:

#### aspectRatio `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Video aspect ratio. Supported values may vary by provider.

Possible values:

- `16:9` (landscape, default)
- `9:16` (portrait)
- `1:1` (square)

> REST field: `parameters.aspectRatio`

#### resolution `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Video resolution. Only supported by certain models.

Possible values:

- `720p`
- `1080p`

> REST field: `parameters.resolution`

#### durationSeconds `integer` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Video duration in seconds. Google Veo supports 5 or 8 seconds; other providers may support different ranges.

Possible values:

- `5`
- `8`

> REST field: `parameters.durationSeconds`

#### generateAudio `boolean` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Whether to generate an audio track. When set to `true`, the model automatically generates audio that matches the video content.

> REST field: `parameters.generateAudio`

#### negativePrompt `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

A negative prompt describing content you do not want to appear in the video.

> REST field: `parameters.negativePrompt`

#### enhancePrompt `boolean` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Whether to enable prompt enhancement. When enabled, the model automatically refines the prompt to improve video quality.

> REST field: `parameters.enhancePrompt`

#### personGeneration `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Controls human figure generation. Only supported by Google Veo models.

Possible values:

- `dont_allow`
- `allow_adult`

> REST field: `parameters.personGeneration`

#### numberOfVideos `integer` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Number of videos to generate. Defaults to 1.

SDK field name: Python `number_of_videos`, TypeScript `numberOfVideos`.

> REST field: `parameters.sampleCount`

#### seed `integer` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Random seed for reproducible generation results.

> REST field: `parameters.seed`

#### fps `integer` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Video frame rate. Only supported by certain providers.

> REST field: `parameters.fps`

## Image-to-Video Request Parameters

In addition to text-to-video, you can provide an image as the starting frame and/or ending frame, combined with a text prompt to generate video.

### image `Image` <span style="color: #FA6062; font-weight: 400">\*</span>

The starting frame image object.

- `image_bytes` `bytes` <span style="color: #FA6062; font-weight: 400">\*</span>
  : Binary image data.
- `mime_type` `string` <span style="color: #FA6062; font-weight: 400">\*</span>
  : Image MIME type, e.g., `image/png`, `image/jpeg`.

> REST field: `instances[0].image`

### last_frame `Image` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The ending frame image object. When used with the starting frame, the model generates a transition animation from the first frame to the last frame. Same format as `image`.

SDK field name: Python `last_frame`, TypeScript `lastFrame`.

> REST field: `instances[0].lastFrame`

### audio `Audio` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The reference audio object. Only supported by `bytedance/doubao-seedance-2.0` (ByteDance Seedance 2). The model uses the provided audio as a reference, aligning the generated video's pacing, lip movement, or motion with the audio content.

- `bytesBase64Encoded` `string`: Base64-encoded audio data.
- `gcsUri` `string`: URL of the audio file (provide either this or `bytesBase64Encoded`).
- `mimeType` `string`: Audio MIME type, e.g., `audio/mpeg`, `audio/wav`.

> REST field: `audio` (top-level request body field, a sibling of `instances` and `parameters`)

::: warning Seedance 2 reference input constraints

- Reference audio `audio` cannot be combined with the first frame `image`.
- `audio` should be paired with reference images (`referenceImages` with `referenceType` set to `asset`) and/or a reference video `video`.
  :::

### prompt `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

A text prompt describing how the content in the image should move or change.

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Same as text-to-video.

### config `GenerateVideosConfig` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Same as text-to-video configuration.

## Response

### Submit Request Response (Operation Object)

After submitting a video generation request, an `Operation` object is returned to track the generation status.

#### name `string`

The Operation identifier, used for subsequent status polling.

#### done `boolean`

Whether generation is complete. This field may be absent or `false` while generation is in progress.

### Generation Complete Response

When `done` is `true`, the `response` contains the generation results.

#### response.videos `array<Video>`

The list of generated videos.

- `gcsUri` `string`: Video download URL.
- `bytesBase64Encoded` `string`: Base64-encoded video data (returned by some providers).
- `mimeType` `string`: Video MIME type, typically `video/mp4`.

::: info About SDK Responses
The SDK automatically converts the REST response into a `GenerateVideosResponse` object. Access video content via `operation.response.generated_videos[].video`.
:::

#### response.raiMediaFilteredCount `integer`

Number of videos blocked by content moderation.

#### response.raiMediaFilteredReasons `array<string>`

List of reasons for content moderation blocks.

### Generation Failed Response

When generation fails, `raiMediaFilteredCount` is greater than 0 and `raiMediaFilteredReasons` contains the error details.

::: api-request POST /api/vertex-ai/v1

```bash [cURL]
# Step 1: Submit video generation request
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

# Response contains operation name for polling
# {"name": "publishers/google/models/veo-3.1-generate-001/operations/abc123"}

# Step 2: Poll task status (every 15 seconds)
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

// Step 1: Submit video generation request
let operation = await client.models.generateVideos({
  model: "google/veo-3.1-generate-001",
  prompt: "A golden retriever running on the beach at sunset",
  config: {
    aspectRatio: "16:9",
    durationSeconds: 8,
    generateAudio: true,
  },
});

// Step 2: Poll until generation completes
while (!operation.done) {
  await new Promise((r) => setTimeout(r, 15000));
  operation = await client.operations.get(operation);
}

// Step 3: Retrieve generated results
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

# Step 1: Submit video generation request
operation = client.models.generate_videos(
    model="google/veo-3.1-generate-001",
    prompt="A golden retriever running on the beach at sunset",
    config=types.GenerateVideosConfig(
        aspectRatio="16:9",
        durationSeconds=8,
        generateAudio=True,
    ),
)

# Step 2: Poll until generation completes
while not operation.done:
    time.sleep(15)
    operation = client.operations.get(operation)

# Step 3: Retrieve generated results
for video in operation.response.generated_videos:
    print("Video:", video)
```

:::

::: api-response

```json
// Response after submitting request (in progress)
{
  "name": "publishers/google/models/veo-3.1-generate-001/operations/abc123"
}

// Response after polling completes
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

```bash [cURL]
# Step 1: Submit image-to-video request (image passed as base64)
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

# Step 2: Poll task status
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

// Step 1: Submit image-to-video request
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

// Step 2: Poll until generation completes
while (!operation.done) {
  await new Promise((r) => setTimeout(r, 15000));
  operation = await client.operations.get(operation);
}

// Step 3: Retrieve generated results
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

# Step 1: Submit image-to-video request
operation = client.models.generate_videos(
    model="google/veo-3.1-generate-001",
    image=types.Image(image_bytes=image_bytes, mime_type="image/png"),
    prompt="The dog stands up and runs toward the ocean waves",
    config=types.GenerateVideosConfig(
        aspectRatio="16:9",
        durationSeconds=8,
    ),
)

# Step 2: Poll until generation completes
while not operation.done:
    time.sleep(15)
    operation = client.operations.get(operation)

# Step 3: Retrieve generated results
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

## Seedance 2 Reference Audio Example

`bytedance/doubao-seedance-2.0` supports passing reference audio to align the generated video with the audio content. Reference audio is passed via the top-level `audio` field (a sibling of `instances` and `parameters`) and must be paired with reference images (`referenceImages`) and/or a reference video (`video`). It **cannot** be combined with the first frame `image`.

::: api-request POST /api/vertex-ai/v1

```bash [cURL]
# Step 1: Submit a video generation request with reference audio
curl -X POST "https://zenmux.ai/api/vertex-ai/v1/publishers/bytedance/models/doubao-seedance-2.0:predictLongRunning" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [{
      "prompt": "The singer performs on stage in sync with the music",
      "referenceImages": [{
        "image": {
          "bytesBase64Encoded": "<BASE64_IMAGE_DATA>",
          "mimeType": "image/png"
        },
        "referenceType": "asset"
      }]
    }],
    "parameters": {
      "resolution": "720p",
      "durationSeconds": 5
    },
    "audio": {
      "bytesBase64Encoded": "<BASE64_AUDIO_DATA>",
      "mimeType": "audio/mpeg"
    }
  }'

# Step 2: Poll task status
curl -X POST "https://zenmux.ai/api/vertex-ai/v1/publishers/bytedance/models/doubao-seedance-2.0:fetchPredictOperation" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"operationName": "publishers/bytedance/models/doubao-seedance-2.0/operations/aud123"}'
```

:::

::: api-response

```json
{
  "name": "publishers/bytedance/models/doubao-seedance-2.0/operations/aud123",
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
