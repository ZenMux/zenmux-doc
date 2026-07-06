---
pageClass: api-page
title: Create Interaction (Native Protocol)
head:
  - - meta
    - name: description
      content: Zenmux documentation - create a multi-modal interaction via the native Google Interactions protocol
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, interactions, native, google, multimodal, video generation
---

# ZenMux Native API: Create Interaction

::: info Troubleshooting
Encountering errors? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting solutions.
:::

### Create an interaction:

```http
POST https://zenmux.ai/api/v1/interactions
POST https://zenmux.ai/api/v1beta1/interactions
```

Both paths are equivalent — `/api/v1beta1/interactions` is an alias of `/api/v1/interactions`.

This endpoint calls the **native Google Interactions API v1 protocol** — a stateful, multi-modal generation protocol that accepts text / image / video / file inputs and produces text and video outputs. The request body adopts Google's native Interactions structure directly, no SDK required, authenticated with a standard `Authorization: Bearer` header. Upstream reference: [Google Interactions API v1](https://ai.google.dev/api/interactions-api-v1).

::: tip Model lives in the body
Unlike the [Generate Content (Vertex AI Protocol)](/api/vertexai/generate-content) endpoint — which carries the model on the URL path — the Interactions protocol carries the model in the request **body** as `"model"`, on the flat `POST /api/v1/interactions` (or `/api/v1beta1/interactions`) path.
:::

The request body is forwarded to the upstream provider largely **verbatim**. ZenMux only:

- strips its internal routing fields (`provider`, `model_routing_config`) before forwarding, and
- rewrites the `model` field to the provider's model name upstream, then rewrites the echoed `model` in the response back to the ZenMux model slug.

Any field not listed below is passed through to the provider as-is and validated by the provider per model; unsupported fields return a native error.

## Supported models

| Model                      | Inputs                      | Outputs      |
| -------------------------- | --------------------------- | ------------ |
| `google/gemini-omni-flash` | text / image / video / file | text / video |

::: info More models
Visit the [ZenMux model list](https://zenmux.ai/models) to search all available models.
:::

## Authentication

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Request header in the form `Bearer $ZENMUX_API_KEY`, using your ZenMux API key for authentication.

## Request body

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The model slug used for the interaction, in the form `{provider}/{model}`, e.g. `google/gemini-omni-flash`. ZenMux uses this to resolve and route the request, then rewrites it to the provider's model name before forwarding.

### input `Content | string` <span style="color: #FA6062; font-weight: 400">\*</span>

The user inputs for the interaction. May be a plain string (text prompt) or the native multi-modal `Content` structure carrying text, image, video, or file parts. Supported input modalities: **text**, **image**, **video**, **file**.

### system_instruction `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

System-level guidance that steers the model's behavior.

### tools `array` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Declared tools the model may invoke (e.g. grounding / search tools), passed through to the provider.

### generation_config `object` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Model generation parameters, passed through to the provider. Common fields include:

- `temperature` `number`: output randomness.
- `top_p` `number`: nucleus sampling threshold.
- `max_output_tokens` `integer`: maximum length of the response.
- `thinking_level` `string`: reasoning effort, one of `minimal` | `low` | `medium` | `high`.
- `stop_sequences` `string[]`: sequences that terminate generation.

### response_format `object` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

JSON-schema enforcement for structured output, passed through to the provider.

### stream `boolean` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

When `true`, the response is delivered incrementally as Server-Sent Events (SSE). When omitted or `false`, a single JSON response is returned. Defaults to `false`. Note that streaming support is model-dependent — some models (e.g. `gemini-omni-flash-preview`) do not support streaming and will reject `stream: true`.

::: info Field passthrough
Other native Interactions fields (such as `store`, `background`, etc.) — and any unlisted native fields — are forwarded to the provider as-is. See the [upstream spec](https://ai.google.dev/api/interactions-api-v1) for the full list.
:::

## Response

### Non-streaming response

A single JSON object (native Google Interactions response, passed through with the `model` field rewritten to the ZenMux slug).

```json
{
  "id": "v1_ChdPU0F4YWFtNkFwS2kxZThQZ05lbXdROBIX",
  "model": "google/gemini-omni-flash",
  "object": "interaction",
  "status": "completed",
  "created": "2026-07-03T12:25:15Z",
  "updated": "2026-07-03T12:25:15Z",
  "steps": [
    {
      "type": "model_output",
      "content": [{ "type": "text", "text": "The capital of France is Paris." }]
    }
  ],
  "usage": {
    "total_input_tokens": 7,
    "input_tokens_by_modality": [{ "modality": "text", "tokens": 7 }],
    "total_cached_tokens": 0,
    "total_output_tokens": 10,
    "total_thought_tokens": 0,
    "total_tokens": 17
  }
}
```

#### id `string`

Unique interaction identifier.

#### model `string`

The ZenMux model slug used for the interaction (rewritten from the provider model name).

#### status `string`

Interaction status, one of `in_progress` | `requires_action` | `completed` | `failed` | `cancelled` | `incomplete`.

#### steps `array`

The interaction sequence — user input, model output, tool calls, and tool results. Each step has a `type` and a `content` array whose parts carry the generated `text`, `video`, and other modalities.

#### usage `object`

Token accounting for the interaction:

- `total_input_tokens` `integer`: total prompt tokens.
- `input_tokens_by_modality` `array`: per-modality input breakdown, each entry `{ "modality": string, "tokens": integer }`.
- `total_cached_tokens` `integer`: cached content tokens.
- `total_output_tokens` `integer`: generated response tokens.
- `total_thought_tokens` `integer`: reasoning tokens (thinking models).
- `total_tokens` `integer`: cumulative total.
- `grounding_tool_count` `array`: per-tool grounding invocation counts, each entry `{ "type": string, "count": integer }`.

### Streaming response (SSE)

When `stream: true`, the response is a stream of Server-Sent Events describing the interaction lifecycle:

| Event                       | Trigger          | Key fields                                       |
| --------------------------- | ---------------- | ------------------------------------------------ |
| `interaction.created`       | Stream starts    | `interaction` (partial), `event_id`              |
| `interaction.status_update` | Status changes   | `interaction_id`, `status`                       |
| `step.start`                | A step begins    | `index`, `step`                                  |
| `step.delta`                | Content arrives  | `index`, `delta` (text \| image \| video \| ...) |
| `step.stop`                 | A step completes | `index`                                          |
| `interaction.completed`     | All steps done   | `interaction` (complete)                         |
| `error`                     | A failure occurs | `error` (`code`, `message`)                      |

Each event may carry a `metadata` object with the cumulative `total_usage` (same fields as the non-streaming `usage` block).

## Examples

::: api-request POST /api/v1/interactions

```cURL [Text input | Create an interaction from text]
curl -X POST "https://zenmux.ai/api/v1/interactions" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/gemini-omni-flash",
    "input": "What is the capital of France?",
    "generation_config": { "max_output_tokens": 100 }
  }'
```

```cURL [Multi-modal input | Text + image via native content]
curl -X POST "https://zenmux.ai/api/v1/interactions" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/gemini-omni-flash",
    "input": [
      {
        "role": "user",
        "content": [
          { "type": "text", "text": "Describe this scene, then animate it." },
          { "type": "image", "data": "<base64>", "mime_type": "image/png" }
        ]
      }
    ],
    "system_instruction": "You are a helpful creative assistant.",
    "generation_config": { "temperature": 0.8 }
  }'
```

```cURL [Streaming | Stream interaction events]
curl -N -X POST "https://zenmux.ai/api/v1/interactions" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/gemini-omni-flash",
    "input": "Write a short poem about the sea.",
    "stream": true
  }'
```

:::

::: api-response

```json
// Non-streaming response
{
  "id": "v1_ChdPU0F4YWFtNkFwS2kxZThQZ05lbXdROBIX",
  "model": "google/gemini-omni-flash",
  "object": "interaction",
  "status": "completed",
  "created": "2026-07-03T12:25:15Z",
  "updated": "2026-07-03T12:25:15Z",
  "steps": [
    {
      "type": "model_output",
      "content": [{ "type": "text", "text": "The capital of France is Paris." }]
    }
  ],
  "usage": {
    "total_input_tokens": 7,
    "input_tokens_by_modality": [{ "modality": "text", "tokens": 7 }],
    "total_cached_tokens": 0,
    "total_output_tokens": 10,
    "total_thought_tokens": 0,
    "total_tokens": 17
  }
}
```

```text
// Streaming response (stream: true) — SSE lifecycle events
event: interaction.created
data: {"interaction":{"id":"v1_ChdP...","model":"google/gemini-omni-flash","status":"in_progress"},"event_id":"evt_0"}

event: step.start
data: {"index":0,"step":{"type":"model_output"}}

event: step.delta
data: {"index":0,"delta":{"type":"text","text":"The"}}

event: step.delta
data: {"index":0,"delta":{"type":"text","text":" sea"}}

event: step.stop
data: {"index":0}

event: interaction.completed
data: {"interaction":{"id":"v1_ChdP...","model":"google/gemini-omni-flash","status":"completed","usage":{"total_input_tokens":8,"total_output_tokens":24,"total_tokens":32}}}
```

:::
