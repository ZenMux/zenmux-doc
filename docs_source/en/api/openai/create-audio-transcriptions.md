---
pageClass: api-page
title: API
head:
  - - meta
    - name: description
      content: Create transcription (Speech-to-Text)
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, audio, transcription, speech-to-text, STT, ASR, OpenAI
---

# Create transcription

::: tip Troubleshooting
Encountering errors during API calls? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting solutions.
:::

```http
POST https://zenmux.ai/api/v1/audio/transcriptions
```

The Create transcription endpoint converts input audio into text (Speech-to-Text).

This endpoint takes a **JSON** request body. The audio is passed inline as base64-encoded bytes (or by URL) in the `input_audio` object. By default it returns a single JSON response with the transcript and token usage. Set `stream` to `true` to receive the transcript incrementally as Server-Sent Events instead.

## Request headers

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer Token authentication, formatted as `Bearer $ZENMUX_API_KEY`.

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Request content type, defaults to `application/json`.

## Request

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The model ID to use, in the format `<provider>/<model-name>`, for example `qwen/qwen3-asr-flash`.

### input_audio `object` <span style="color: #FA6062; font-weight: 400">\*</span>

The audio to transcribe. Provide either `data` or `url` (at least one is required). Contains the following fields:

- `data` `string` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span> — the base64-encoded audio bytes. This is the raw base64 string only, **not** a `data:` URI.
- `url` `string` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span> — a publicly accessible URL to the audio file. Used when `data` is not provided.
- `format` `string` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span> — the audio container format. One of `wav`, `mp3`, `flac`, `m4a`, `ogg`, `webm`, `aac`. Defaults to `wav` when omitted.

### language `string` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span>

The language of the input audio as an ISO-639-1 code (e.g. `en`, `ja`, `zh`). Auto-detected when omitted.

### enable_itn `boolean` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span>

Whether to apply inverse text normalization (e.g. rendering spoken numbers as digits) to the transcript. Uses the model's default when omitted.

### stream `boolean` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span>

Whether to stream the transcript, defaults to `false`.

- `false` — returns a single JSON response with the full transcript and token usage.
- `true` — returns the transcript as **Server-Sent Events** (`Content-Type: text/event-stream`), matching OpenAI's streaming format. The transcript text is delivered in `transcript.text.delta` events (each carrying an incremental `delta`), followed by a `transcript.text.done` event carrying the full `text` and token usage, and finally a `[DONE]` event.

## Response

### Non-streaming (default)

On success, the response is a JSON object with the transcript and token usage:

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

- `text` — the transcribed text.
- `model` — the model slug used to produce the transcription.
- `usage` — token usage with `input_tokens`, `output_tokens`, and `total_tokens`. The optional `seconds` field reports the duration of the transcribed audio in seconds, when the provider returns it.

### Streaming (`stream: true`)

The response is a `text/event-stream` of Server-Sent Events. Each event is a `data:` line containing a JSON object:

```text
data: {"type":"transcript.text.delta","delta":"ZenMux is "}

data: {"type":"transcript.text.delta","delta":"an LLM API aggregation service."}

data: {"type":"transcript.text.done","text":"ZenMux is an LLM API aggregation service.","usage":{"input_tokens":120,"output_tokens":11,"total_tokens":131,"seconds":3}}

data: [DONE]
```

- `transcript.text.delta` — carries an incremental chunk of transcript text in `delta`. Concatenating all deltas yields the same text as the non-streaming `text` field.
- `transcript.text.done` — carries the full `text` and the token `usage` object with `input_tokens`, `output_tokens`, and `total_tokens` (and `seconds` when reported).
- `[DONE]` — marks the end of the stream.

Providers without a native incremental transcription API emit the full transcript as a single `transcript.text.delta` followed by `transcript.text.done`.

On error, the endpoint returns a JSON object instead:

```json
{
  "error": {
    "code": "...",
    "type": "...",
    "message": "..."
  }
}
```

Errors use standard HTTP status codes (e.g. `400` for an invalid request such as a missing `input_audio.data`, `403`, `404`).

::: api-request POST /api/v1/audio/transcriptions

```cURL
# Build the base64 audio from a local file, then POST it as JSON.
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

// Build the base64 audio from a local file.
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

# Build the base64 audio from a local file.
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

To receive the transcript as Server-Sent Events, set `stream` to `true`:

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
