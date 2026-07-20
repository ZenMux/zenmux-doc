---
pageClass: api-page
title: 接口
head:
  - - meta
    - name: description
      content: Create transcription (Speech-to-Text)
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, audio, transcription, speech-to-text, STT, ASR, OpenAI
---

# Create transcription

::: tip 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```http
POST https://zenmux.ai/api/v1/audio/transcriptions
```

Create transcription 接口将输入音频转换为文本（语音转文本，Speech-to-Text）。

本接口使用 **JSON** 请求体。音频以 base64 编码的字节（或通过 URL）内联在 `input_audio` 对象中传入。本接口默认返回单个 JSON 响应，包含转写文本和 token 用量。将 `stream` 设为 `true` 可改为以 Server-Sent Events 形式增量接收转写文本。

## Request headers

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer Token 鉴权，格式为 `Bearer $ZENMUX_API_KEY`。

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

请求内容类型，默认值为 `application/json`。

## Request

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

要使用的模型 ID，格式为 `<供应商>/<模型名称>`。

### input_audio `object` <span style="color: #FA6062; font-weight: 400">\*</span>

要转写的音频。`data` 与 `url` 至少提供其一。包含以下字段：

- `data` `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span> — base64 编码的音频字节。仅为原始 base64 字符串，**不是** `data:` URI。
- `url` `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span> — 可公开访问的音频文件 URL。当未提供 `data` 时使用。
- `format` `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span> — 音频容器格式，取值为 `wav`、`mp3`、`flac`、`m4a`、`ogg`、`webm`、`aac` 之一。省略时默认值为 `wav`。

### language `string` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

输入音频的语言，使用 ISO-639-1 代码（例如 `en`、`ja`、`zh`）。省略时自动检测。

### enable_itn `boolean` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

是否对转写结果应用逆文本归一化（例如将口述数字渲染为阿拉伯数字）。省略时使用模型的默认值。

### stream `boolean` <span style="color: #666; font-weight: 400; font-size: 14px">可选</span>

是否流式返回转写文本，默认值为 `false`。

- `false` — 返回单个 JSON 响应，包含完整的转写文本和 token 用量。
- `true` — 以 **Server-Sent Events** 形式返回转写文本（`Content-Type: text/event-stream`），与 OpenAI 的流式格式一致。转写文本以 `transcript.text.delta` 事件增量下发（每个事件携带一段 `delta`），随后是携带完整 `text` 和 token 用量的 `transcript.text.done` 事件，最后是 `[DONE]` 事件。

## Response

### 非流式（默认）

请求成功时，响应为一个 JSON 对象，包含转写文本和 token 用量：

```json
{
  "text": "ZenMux is an LLM API aggregation service.",
  "model": "qwen/qwen3-asr-flash",
  "usage": {
    "input_tokens": 120,
    "output_tokens": 11,
    "total_tokens": 131,
    "seconds": 3
  }
}
```

- `text` — 转写得到的文本。
- `model` — 用于生成转写结果的模型 slug。
- `usage` — token 用量，包含 `input_tokens`、`output_tokens` 和 `total_tokens`。可选的 `seconds` 字段表示被转写音频的时长（秒），在供应商返回该值时提供。

### 流式（`stream: true`）

响应为 `text/event-stream` 的 Server-Sent Events 流。每个事件是一行 `data:`，内含一个 JSON 对象：

```text
data: {"type":"transcript.text.delta","delta":"ZenMux is "}

data: {"type":"transcript.text.delta","delta":"an LLM API aggregation service."}

data: {"type":"transcript.text.done","text":"ZenMux is an LLM API aggregation service.","usage":{"input_tokens":120,"output_tokens":11,"total_tokens":131,"seconds":3}}

data: [DONE]
```

- `transcript.text.delta` — 携带一段增量转写文本 `delta`。将所有 delta 拼接后，即得到与非流式 `text` 字段相同的文本。
- `transcript.text.done` — 携带完整 `text` 和 token `usage` 对象，包含 `input_tokens`、`output_tokens` 和 `total_tokens`（供应商返回时还包含 `seconds`）。
- `[DONE]` — 标志流结束。

对于没有原生增量转写接口的供应商，会将完整转写文本作为单个 `transcript.text.delta` 下发，随后是 `transcript.text.done`。

发生错误时，接口返回 JSON 对象：

```json
{
  "error": {
    "code": "...",
    "type": "...",
    "message": "..."
  }
}
```

错误使用标准 HTTP 状态码（例如请求无效时返回 `400`，如缺少 `input_audio.data`；以及 `403`、`404` 等）。

::: api-request POST /api/v1/audio/transcriptions

```cURL
# 从本地文件构建 base64 音频，然后以 JSON 形式 POST。
AUDIO_B64=$(base64 -w 0 speech.wav)

curl https://zenmux.ai/api/v1/audio/transcriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "qwen/qwen3-asr-flash",
    "input_audio": {
      "data": "'"$AUDIO_B64"'",
      "format": "wav"
    },
    "language": "en"
  }'
```

```TypeScript
import { readFile } from "node:fs/promises";

// 从本地文件构建 base64 音频。
const data = (await readFile("speech.wav")).toString("base64");

const response = await fetch("https://zenmux.ai/api/v1/audio/transcriptions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.ZENMUX_API_KEY}`, // [!code highlight]
  },
  body: JSON.stringify({
    model: "qwen/qwen3-asr-flash",
    input_audio: {
      data,
      format: "wav",
    },
    language: "en",
  }),
});

const { text } = await response.json();
console.log(text);
```

```Python
import base64
import os
import requests

# 从本地文件构建 base64 音频。
with open("speech.wav", "rb") as f:
    data = base64.b64encode(f.read()).decode("utf-8")

response = requests.post(
    "https://zenmux.ai/api/v1/audio/transcriptions",
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.environ['ZENMUX_API_KEY']}",  # [!code highlight]
    },
    json={
        "model": "qwen/qwen3-asr-flash",
        "input_audio": {
            "data": data,
            "format": "wav",
        },
        "language": "en",
    },
)

print(response.json()["text"])
```

:::

::: api-response

```json
{
  "text": "ZenMux is an LLM API aggregation service.",
  "model": "qwen/qwen3-asr-flash",
  "usage": {
    "input_tokens": 120,
    "output_tokens": 11,
    "total_tokens": 131,
    "seconds": 3
  }
}
```

:::

若希望以 Server-Sent Events 形式接收转写文本，将 `stream` 设为 `true`：

::: api-request POST /api/v1/audio/transcriptions

```cURL
curl https://zenmux.ai/api/v1/audio/transcriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "qwen/qwen3-asr-flash",
    "input_audio": {
      "url": "https://example.com/speech.mp3",
      "format": "mp3"
    },
    "stream": true
  }'
```

:::

::: api-response

```text
Content-Type: text/event-stream

data: {"type":"transcript.text.delta","delta":"ZenMux is "}

data: {"type":"transcript.text.delta","delta":"an LLM API aggregation service."}

data: {"type":"transcript.text.done","text":"ZenMux is an LLM API aggregation service.","usage":{"input_tokens":120,"output_tokens":11,"total_tokens":131,"seconds":3}}

data: [DONE]
```

:::
