---
pageClass: api-page
title: 接口
head:
  - - meta
    - name: description
      content: Create speech (Text-to-Speech)
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, audio, speech, text-to-speech, TTS, OpenAI
---

# Create speech

::: tip 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```http
POST https://zenmux.ai/api/v1/audio/speech
```

Create speech 接口将输入文本转换为音频（文本转语音，Text-to-Speech），兼容 OpenAI 的 Create speech 接口。

本接口默认返回一个 JSON 响应，包含 base64 编码的音频和 token 用量。将 `stream` 设为 `true` 可改为以 Server-Sent Events 形式增量接收音频。音频编码由 `response_format` 参数控制。

## Request headers

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer Token 鉴权，格式为 `Bearer $ZENMUX_API_KEY`。

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

请求内容类型，默认值为 `application/json`。

## Request

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

要使用的模型 ID，格式为 `<供应商>/<模型名称>`。

### input `string` <span style="color: #FA6062; font-weight: 400">\*</span>

要合成为语音的文本，不能为空。

### voice `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

供应商特定的音色标识符，用于生成音频。可取的值取决于具体模型。

### response_format `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

输出音频编码，因供应商而异，默认值为 `pcm`。不支持的取值将返回 `400` 错误。

- `pcm` — 裸 PCM 音频（有符号 16 位小端序，单声道，24 kHz，无容器封装）。

### stream `boolean` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

是否流式返回音频，默认值为 `false`。

- `false` — 返回单个 JSON 响应，包含完整的 base64 音频和 token 用量。
- `true` — 以 **Server-Sent Events** 形式返回音频（`Content-Type: text/event-stream`），与 OpenAI 的流式格式一致。音频以 base64 编码包含在 `speech.audio.delta` 事件中（每个音频块一个，并各自携带 `mime_type`），随后是携带 token 用量的 `speech.audio.done` 事件，最后是 `[DONE]` 事件。

### speed `number` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

可选的播放速度倍率，必须为正数。仅部分模型支持。

## Response

### 非流式（默认）

请求成功时，响应为一个 JSON 对象，包含 base64 编码的音频、其媒体类型和 token 用量：

```json
{
  "model": "<provider>/<model-name>",
  "audio": "<base64 编码的音频字节>",
  "mime_type": "audio/L16;rate=24000",
  "usage": {
    "input_tokens": 5,
    "output_tokens": 109,
    "total_tokens": 114
  }
}
```

- `audio` — base64 编码的裸音频，格式为所请求的 `response_format`（默认 PCM）。解码后即得到音频字节。
- `mime_type` — 供应商返回的音频媒体类型（如 `audio/L16;rate=24000`），便于封装或播放。
- `usage` — token 用量，包含 `input_tokens`、`output_tokens` 和 `total_tokens`。

### 流式（`stream: true`）

响应为 `text/event-stream` 的 Server-Sent Events 流。每个事件是一行 `data:`，内含一个 JSON 对象：

```text
data: {"type":"speech.audio.delta","audio":"<base64 编码的音频字节>","mime_type":"audio/L16;rate=24000"}

data: {"type":"speech.audio.done","usage":{"input_tokens":5,"output_tokens":109,"total_tokens":114}}

data: [DONE]
```

- `speech.audio.delta` — 携带一个 base64 编码的音频块及其 `mime_type`（供应商返回的该块媒体类型）。将所有 delta 拼接并解码后，即得到与非流式 `audio` 字段相同的字节。
- `speech.audio.done` — 携带 token `usage` 对象，包含 `input_tokens`、`output_tokens` 和 `total_tokens`。
- `[DONE]` — 标志流结束。

发生错误时，接口返回 JSON 对象而非音频：

```json
{
  "error": {
    "code": "...",
    "type": "...",
    "message": "..."
  }
}
```

::: api-request POST /api/v1/audio/speech

```cURL
curl https://zenmux.ai/api/v1/audio/speech \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "<provider>/<model-name>",
    "input": "ZenMux is an LLM API aggregation service.",
    "voice": "<voice>",
    "response_format": "pcm"
  }'
```

```TypeScript
const response = await fetch("https://zenmux.ai/api/v1/audio/speech", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.ZENMUX_API_KEY}`, // [!code highlight]
  },
  body: JSON.stringify({
    model: "<provider>/<model-name>",
    input: "ZenMux is an LLM API aggregation service.",
    voice: "<voice>",
    response_format: "pcm",
  }),
});

const { audio } = await response.json();
// 将 base64 音频解码为裸字节。
const bytes = Buffer.from(audio, "base64");
await import("node:fs/promises").then(fs => fs.writeFile("speech.pcm", bytes));
```

```Python
import base64
import os
import requests

response = requests.post(
    "https://zenmux.ai/api/v1/audio/speech",
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.environ['ZENMUX_API_KEY']}",  # [!code highlight]
    },
    json={
        "model": "<provider>/<model-name>",
        "input": "ZenMux is an LLM API aggregation service.",
        "voice": "<voice>",
        "response_format": "pcm",
    },
)

# 将 base64 音频解码为裸字节。
with open("speech.pcm", "wb") as f:
    f.write(base64.b64decode(response.json()["audio"]))
```

:::

::: api-response

```json
{
  "model": "<provider>/<model-name>",
  "audio": "<base64 编码的音频字节>",
  "mime_type": "audio/L16;rate=24000",
  "usage": {
    "input_tokens": 5,
    "output_tokens": 109,
    "total_tokens": 114
  }
}
```

:::

若希望以 Server-Sent Events 形式接收音频，将 `stream` 设为 `true`：

::: api-request POST /api/v1/audio/speech

```cURL
curl https://zenmux.ai/api/v1/audio/speech \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "<provider>/<model-name>",
    "input": "ZenMux is an LLM API aggregation service.",
    "voice": "<voice>",
    "response_format": "pcm",
    "stream": true
  }'
```

:::

::: api-response

```text
Content-Type: text/event-stream

data: {"type":"speech.audio.delta","audio":"<base64 编码的音频字节>","mime_type":"audio/L16;rate=24000"}

data: {"type":"speech.audio.done","usage":{"input_tokens":5,"output_tokens":109,"total_tokens":114}}

data: [DONE]
```

:::
