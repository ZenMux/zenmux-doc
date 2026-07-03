---
pageClass: api-page
title: API
head:
  - - meta
    - name: description
      content: Create speech (Text-to-Speech)
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, audio, speech, text-to-speech, TTS, OpenAI
---

# Create speech

::: tip Troubleshooting
Encountering errors during API calls? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting solutions.
:::

```http
POST https://zenmux.ai/api/v1/audio/speech
```

The Create speech endpoint converts input text into audio (Text-to-Speech). It is compatible with OpenAI's Create speech API.

By default this endpoint returns a single JSON response containing the base64-encoded audio and token usage. Set `stream` to `true` to receive the audio incrementally as Server-Sent Events instead. The audio encoding is controlled by the `response_format` parameter.

## Request headers

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer Token authentication, formatted as `Bearer $ZENMUX_API_KEY`.

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Request content type, defaults to `application/json`.

## Request

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The model ID to use, in the format `<provider>/<model-name>`, for example `google/gemini-3.1-flash-tts-preview`.

### input `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The text to synthesize into speech. Cannot be empty.

### voice `string` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span>

The provider-specific voice identifier used to generate the audio. The set of valid values depends on the model.

### response_format `string` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span>

The output audio encoding. Provider-specific; defaults to `pcm`. An unsupported value returns a `400` error.

- `pcm` — Raw PCM audio (signed 16-bit little-endian, mono, 24 kHz, no container).

### stream `boolean` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span>

Whether to stream the audio. Defaults to `false`.

- `false` — Returns a single JSON response with the full base64 audio and token usage.
- `true` — Returns the audio as **Server-Sent Events** (`Content-Type: text/event-stream`), matching OpenAI's streaming shape. The audio is base64-encoded inside `speech.audio.delta` events (one per chunk, each carrying its `mime_type`), followed by a `speech.audio.done` event carrying token usage, then a final `[DONE]` event.

### speed `number` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span>

Optional playback speed multiplier. Must be a positive number. Supported by select models only.

## Response

### Non-streaming (default)

On success, the response is a JSON object with the base64-encoded audio, its media type, and token usage:

```json
{
  "model": "google/gemini-3.1-flash-tts-preview",
  "audio": "<base64-encoded audio bytes>",
  "mime_type": "audio/L16;rate=24000",
  "usage": {
    "input_tokens": 5,
    "output_tokens": 109,
    "total_tokens": 114
  }
}
```

- `audio` — base64-encoded raw audio in the requested `response_format` (PCM by default). Decode it to obtain the audio bytes.
- `mime_type` — the provider's media type for the audio bytes (e.g. `audio/L16;rate=24000`), useful for wrapping or playback.
- `usage` — token usage with `input_tokens`, `output_tokens`, and `total_tokens`.

### Streaming (`stream: true`)

The response is a `text/event-stream` of Server-Sent Events. Each event is a `data:` line containing a JSON object:

```text
data: {"type":"speech.audio.delta","audio":"<base64-encoded audio bytes>","mime_type":"audio/L16;rate=24000"}

data: {"type":"speech.audio.done","usage":{"input_tokens":5,"output_tokens":109,"total_tokens":114}}

data: [DONE]
```

- `speech.audio.delta` — carries a base64-encoded audio chunk plus its `mime_type` (the provider's media type for that chunk). Concatenating and decoding all deltas yields the same bytes as the non-streaming `audio` field.
- `speech.audio.done` — carries the token `usage` object with `input_tokens`, `output_tokens`, and `total_tokens`.
- `[DONE]` — terminates the stream.

On error, the endpoint returns a JSON object instead of audio:

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
    "model": "google/gemini-3.1-flash-tts-preview",
    "input": "ZenMux is an LLM API aggregation service.",
    "voice": "Kore",
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
    model: "google/gemini-3.1-flash-tts-preview",
    input: "ZenMux is an LLM API aggregation service.",
    voice: "Kore",
    response_format: "pcm",
  }),
});

const { audio } = await response.json();
// Decode the base64 audio into raw bytes.
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
        "model": "google/gemini-3.1-flash-tts-preview",
        "input": "ZenMux is an LLM API aggregation service.",
        "voice": "Kore",
        "response_format": "pcm",
    },
)

# Decode the base64 audio into raw bytes.
with open("speech.pcm", "wb") as f:
    f.write(base64.b64decode(response.json()["audio"]))
```

:::

::: api-response

```json
{
  "model": "google/gemini-3.1-flash-tts-preview",
  "audio": "<base64-encoded audio bytes>",
  "mime_type": "audio/L16;rate=24000",
  "usage": {
    "input_tokens": 5,
    "output_tokens": 109,
    "total_tokens": 114
  }
}
```

:::

To receive the audio as Server-Sent Events instead, set `stream` to `true`:

::: api-request POST /api/v1/audio/speech

```cURL
curl https://zenmux.ai/api/v1/audio/speech \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "google/gemini-3.1-flash-tts-preview",
    "input": "ZenMux is an LLM API aggregation service.",
    "voice": "Kore",
    "response_format": "pcm",
    "stream": true
  }'
```

:::

::: api-response

```text
Content-Type: text/event-stream

data: {"type":"speech.audio.delta","audio":"<base64-encoded audio bytes>","mime_type":"audio/L16;rate=24000"}

data: {"type":"speech.audio.done","usage":{"input_tokens":5,"output_tokens":109,"total_tokens":114}}

data: [DONE]
```

:::
