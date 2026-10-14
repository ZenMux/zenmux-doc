---
pageClass: api-page
title: Structured Decisions API (Decisions)
head:
  - - meta
    - name: description
      content: Evaluate text and images with OpenAI Decisions to return structured predicates, classifications, scores, and probabilities
  - - meta
    - name: keywords
      content: ZenMux, API, OpenAI, Decisions, gpt-6-luna, structured decisions, classification, scoring, image input
---

# Structured Decisions (Decisions)

::: tip Troubleshooting
Encountering an error? See the [API Error Codes Reference](/guide/advanced/error-codes) for error types and troubleshooting guidance.
:::

```http
POST https://zenmux.ai/api/v1/decisions
```

The Decisions API evaluates `input` (text, images, or both) against your `questions` and returns structured `answers`. A request can contain multiple questions, and answers are returned in the same order as the questions.

Each question can be one of three types:

- **predicate**: Evaluate a yes/no condition and return the probability that it is true.
- **choice**: Select one of the supplied options and return the selected value, per-option probabilities, and confidence.
- **score**: Rate the input against ordered levels and return the probability-weighted average of their indices, per-level probabilities, and confidence.

Request parameters follow the [OpenAI Decisions Create API](https://developers.openai.com/api/reference/typescript/resources/decisions/methods/create). When calling through ZenMux, use your ZenMux API key, the endpoint above, and a model ID with a provider prefix.

This endpoint returns a non-streaming JSON response and does not accept a `stream` parameter. It does not offer parameters such as `reasoning`, `reasoning_effort`, `temperature`, `tools`, or `response_format`. Use the [Responses API](/api/openai/openai-responses) for a custom JSON schema or tool calling.

## Request Headers

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer token authentication, in the form `Bearer <ZENMUX_API_KEY>`.

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The request content type is `application/json`.

## Request Parameters

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The model ID to use. OpenAI currently supports `gpt-6-luna`; specify `openai/gpt-6-luna` in ZenMux.

### input `string or array` <span style="color: #FA6062; font-weight: 400">\*</span>

The shared input evaluated by all questions. Provide a plain text string or an array of user messages containing text and images. A request can include at most 128 images. Files, audio, tool calls, and references to existing input items are not supported.

#### input[] `object`

Each message in the array contains:

- `role` `string` (required) — Always `user`.
- `type` `string` (optional) — Always `message`.
- `content` `string or array` (required) — A text string or an array of the content parts below.

##### input_text `object`

- `type` `string` (required) — Always `input_text`.
- `text` `string` (required) — The text content.

##### input_image `object`

- `type` `string` (required) — Always `input_image`.
- `image_url` `string` (required) — The image location. The current OpenAI Create API reference accepts a Base64 data URL (such as `data:image/png;base64,...`) or a publicly accessible HTTP(S) image URL. `file_id` is not supported.
- `detail` `string or null` (optional) — Image detail level: `low`, `high`, `auto`, or `original`. Defaults to `auto`; processing follows the selected model's image profile.

::: tip Image format
OpenAI's Create API reference and guide currently differ on HTTP(S) image URLs: the reference lists support, while the guide still requires inline Base64 data URLs. We recommend the Base64 format used in this page's image example.
:::

### questions `array` <span style="color: #FA6062; font-weight: 400">\*</span>

An array of 1–200 questions. Question types can differ within a request. Answers are returned in question order.

#### questions[] `object`

All questions share the following fields:

- `type` `string` (required) — `predicate`, `choice`, or `score`.
- `instructions` `string` (required) — What to evaluate and the criteria to apply.
- `name` `string` (optional) — A question name echoed in the response. If omitted, the answer's `name` is `null`. Use unique names to make answers easier to identify.

##### predicate questions

Estimate whether the input satisfies the condition described in `instructions`. No additional options or levels are needed.

##### choice questions

A `choices` array is required and must contain 2–255 options. Each option contains:

- `value` `string or boolean` (required) — The option value. Values must be unique and are distinguished by type: for example, `"true"` and `true` are different values.
- `description` `string` (optional) — What the option means or when it applies.

##### score questions

A `levels` array is required and describes the levels in scoring order. Each level contains:

- `label` `string` (required) — The level's label.
- `description` `string` (optional) — What the level means or its scoring criteria.

Level indices start at 0. The returned `score` is the probability-weighted average of those indices, so it can fall between levels.

### safety_identifier `string or null` <span style="color: #666; font-weight: 400; font-size: 14px">optional</span>

A caller-provided end-user identifier, scoped to the verified organization. It is not an API authentication identity and does not replace `Authorization`.

## Response

Returns a JSON object containing `model`, `answers`, and `usage`. Probabilities and token counts in the example illustrate the response structure; actual values depend on the input and model result.

### model `string`

The model ID used for this evaluation, such as `openai/gpt-6-luna`.

### answers `array`

Answers in the same order as `questions`. Every answer includes `type` and `name`; `name` is the supplied question name, or `null` if none was provided.

#### answers[] `object`

- **predicate answer**
  - `type` `string` — Always `predicate`.
  - `probability` `number` — The estimated probability that the condition is true, from 0 to 1.
- **choice answer**
  - `type` `string` — Always `choice`.
  - `choice` `string or boolean` — The selected option value, preserving its original type.
  - `probabilities` `array` — Each entry contains an option `value` (string or boolean) and its `probability`.
  - `confidence` `number` — Confidence in the answer.
- **score answer**
  - `type` `string` — Always `score`.
  - `score` `number` — The probability-weighted average of the level indices.
  - `probabilities` `array` — Each entry contains the level index `value` (an integer starting at 0), its `label`, and its `probability`.
  - `confidence` `number` — Confidence in the answer.
- **refusal answer**
  - `type` `string` — Always `refusal`.
  - `name` `string or null` — The name of the question that was refused.
  - Any question can return a refusal while other questions in the same request still receive answers. Check `type` before reading a probability, choice, or score.

### usage `object`

Token usage for this request:

- `input_tokens` `integer` — Input token count.
- `input_tokens_details` `object`
  - `cached_tokens` `integer` — Input tokens read from cache.
  - `cache_write_tokens` `integer` — Tokens written to cache.
- `output_tokens` `integer` — Output token count.
- `output_tokens_details` `object`
  - `reasoning_tokens` `integer` — Reasoning token count.
- `total_tokens` `integer` — Total token count.

`reasoning_tokens` is a usage field, not a reasoning switch. Its presence does not mean this endpoint supports configuring reasoning effort. Billing follows the prices published on the [models page](https://zenmux.ai/models).

## Image Input Example

This example reads a local `product.png`, converts it to a Base64 data URL, and checks the product for visible damage. It reads `ZENMUX_API_KEY` from the environment.

```python
import base64
import os
from pathlib import Path
import requests

image_base64 = base64.b64encode(Path("product.png").read_bytes()).decode("ascii")
resp = requests.post(
    "https://zenmux.ai/api/v1/decisions",
    headers={"Authorization": f"Bearer {os.environ['ZENMUX_API_KEY']}"},
    json={
        "model": "openai/gpt-6-luna",
        "input": [{
            "role": "user",
            "content": [
                {"type": "input_text", "text": "Inspect the product in this photo."},
                {"type": "input_image", "image_url": f"data:image/png;base64,{image_base64}"},
            ],
        }],
        "questions": [{
            "type": "predicate",
            "name": "visible_damage",
            "instructions": "Does the product have visible damage, such as a crack, tear, or dent?",
        }],
    },
    timeout=90,
)
resp.raise_for_status()
print(resp.json())
```

See the [OpenAI Create API reference](https://developers.openai.com/api/reference/typescript/resources/decisions/methods/create) and the [Decisions guide](https://developers.openai.com/api/docs/guides/decisions) for the corresponding definitions.

::: api-request POST /api/v1/decisions

```cURL
curl https://zenmux.ai/api/v1/decisions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "openai/gpt-6-luna",
    "input": "The parcel arrived with a torn box and a cracked screen.",
    "questions": [
      {
        "type": "predicate",
        "name": "damaged",
        "instructions": "Does the input describe a damaged product?"
      },
      {
        "type": "choice",
        "name": "action",
        "instructions": "Choose the appropriate action.",
        "choices": [{"value": "replace"}, {"value": "no_action"}]
      },
      {
        "type": "score",
        "name": "severity",
        "instructions": "Rate the damage severity.",
        "levels": [{"label": "minor"}, {"label": "major"}]
      }
    ]
  }'
```

```Python
import os
import requests

resp = requests.post(
    "https://zenmux.ai/api/v1/decisions",
    headers={
        "Authorization": f"Bearer {os.environ['ZENMUX_API_KEY']}",
        "Content-Type": "application/json",
    },
    json={
        "model": "openai/gpt-6-luna",
        "input": "The parcel arrived with a torn box and a cracked screen.",
        "questions": [
            {
                "type": "predicate",
                "name": "damaged",
                "instructions": "Does the input describe a damaged product?",
            },
            {
                "type": "choice",
                "name": "action",
                "instructions": "Choose the appropriate action.",
                "choices": [{"value": "replace"}, {"value": "no_action"}],
            },
            {
                "type": "score",
                "name": "severity",
                "instructions": "Rate the damage severity.",
                "levels": [{"label": "minor"}, {"label": "major"}],
            },
        ],
    },
    timeout=90,
)
resp.raise_for_status()
print(resp.json())
```

```TypeScript
const resp = await fetch("https://zenmux.ai/api/v1/decisions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.ZENMUX_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "openai/gpt-6-luna",
    input: "The parcel arrived with a torn box and a cracked screen.",
    questions: [
      {
        type: "predicate",
        name: "damaged",
        instructions: "Does the input describe a damaged product?",
      },
      {
        type: "choice",
        name: "action",
        instructions: "Choose the appropriate action.",
        choices: [{ value: "replace" }, { value: "no_action" }],
      },
      {
        type: "score",
        name: "severity",
        instructions: "Rate the damage severity.",
        levels: [{ label: "minor" }, { label: "major" }],
      },
    ],
  }),
});

if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
console.log(await resp.json());
```

:::

::: api-response

```json
{
  "model": "openai/gpt-6-luna",
  "answers": [
    { "type": "predicate", "name": "damaged", "probability": 1 },
    {
      "type": "choice",
      "name": "action",
      "choice": "replace",
      "probabilities": [
        { "value": "replace", "probability": 1 },
        { "value": "no_action", "probability": 0 }
      ],
      "confidence": 1
    },
    {
      "type": "score",
      "name": "severity",
      "score": 0.89,
      "probabilities": [
        { "value": 0, "label": "minor", "probability": 0.11 },
        { "value": 1, "label": "major", "probability": 0.89 }
      ],
      "confidence": 0.78
    }
  ],
  "usage": {
    "input_tokens": 373,
    "input_tokens_details": { "cached_tokens": 0, "cache_write_tokens": 0 },
    "output_tokens": 0,
    "output_tokens_details": { "reasoning_tokens": 0 },
    "total_tokens": 373
  }
}
```

:::
