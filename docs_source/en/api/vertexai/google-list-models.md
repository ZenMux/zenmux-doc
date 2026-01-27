---
pageClass: api-page
title: API
head:
  - - meta
    - name: description
      content: List Models
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, google, list, models
---

# List Models

```
GET https://zenmux.ai/api/vertex-ai/v1beta/models
```

This endpoint retrieves information about the available models on the platform that are compatible with the Google Vertex AI API protocol.

## Request params

This endpoint does not require any request parameters.

## Returns

Returns a JSON object containing information about all available models.

#### models `array`

An array of models, containing detailed information for all available models.

### models object

#### name `string`

The model’s unique identifier, in the format `<provider>/<model_name>`.

#### displayName `string`

The model’s display name, used for UI display.

#### description `string`

A description of the model.

#### inputTokenLimit `integer`

The maximum number of input tokens allowed for this model.

#### outputTokenLimit `integer`

The maximum number of output tokens available for this model.

#### thinking `boolean`

Whether reasoning capability is supported. `true` means supported, `false` means not supported.

#### inputModalities `array`

The input modalities supported by the model. Possible values include:

- `"text"` - Text input
- `"image"` - Image input
- `"video"` - Video input
- `"audio"` - Audio input
- `"file"` - File input

#### outputModalities `array`

The output modalities supported by the model. Possible values include:

- `"text"` - Text output
- `"image"` - Image output
- `"video"` - Video output
- `"audio"` - Audio output
- `"file"` - File output

#### pricings `object`

A pricing information object that contains various price configurations for model usage.

##### pricings.prompt `array`

An array of price configurations for processing input text.

##### pricings.completion `array`

An array of price configurations for generated output text.

##### pricings.input_cache_read `array`

An array of price configurations for reading input data from cache.

##### pricings.input_cache_write_5_min `array`

An array of price configurations for writing to cache with a 5-minute retention period.

##### pricings.input_cache_write_1_h `array`

An array of price configurations for writing to cache with a 1-hour retention period.

##### pricings.input_cache_write `array`

An array of price configurations for writing to cache.

##### pricings.web_search `array`

An array of price configurations for invoking web search (optional; supported by some models).

##### pricings.internal_reasoning `array`

An array of price configurations for the model’s internal reasoning process (optional; supported by some advanced reasoning models). When the model enables an internal chain-of-thought or detailed reasoning process, additional charges apply.

##### pricings.video `array`

An array of price configurations for processing video output (optional; for models that support video understanding). Billed by video duration, resolution, or frame count.

##### pricings.image `array`

An array of price configurations for processing image output (optional; for models that support image understanding). Typically billed by image count, resolution, or pixel count.

##### pricings.audio `array`

An array of price configurations for processing audio output (optional; for models that support audio understanding). Billed by audio duration or processing volume.

##### pricings.audio_and_video `array`

An array of price configurations for generating video content with audio (optional; for models that support audio-video multimodal understanding). Applicable to scenarios that require analyzing both video frames and audio content. Note: there are two video generation scenarios—silent video uses `pricings.video`, while video with audio uses `pricings.audio_and_video`.

### Pricing item structure

Each pricing array in the `pricings` object (such as `completion`, `prompt`, etc.) contains one or more pricing configuration objects. Each pricing configuration object includes the following fields:

#### value `number`

The effective discounted price for the model; free services show as 0.

#### unit `string`

The pricing unit. Possible values include:

- `"perMTokens"` - Per million tokens
- `"perCount"` - Per call
- `"perSecond"` - Per second (for time-based billing scenarios such as audio/video)

#### currency `string`

The currency type, fixed as `"USD"`, meaning US dollars.

#### conditions `object`

Pricing effective conditions (optional), commonly used for tiered pricing.

##### conditions.prompt_tokens `object`

A token-count condition for the input content provided by the user.

##### conditions.completion_tokens `object`

A token-count condition for tokens consumed by the model when generating the response.

#### Pricing condition structure

When a pricing configuration includes the `conditions` field, it defines the specific conditions under which the price takes effect. The condition objects for `prompt_tokens` and `completion_tokens` include the following fields:

##### unit `string`

The token measurement unit, fixed as `"kTokens"` meaning thousand tokens (1000 tokens).

##### gte `number`

Minimum token count (inclusive). The actual token count must be ≥ this value.

#### lte `number`

Maximum token count (inclusive). The actual token count must be ≤ this value.

#### gt `number`

Minimum token count (exclusive). The actual token count must be > this value.

##### lt `number`

Maximum token count (exclusive). The actual token count must be < this value; null means no upper limit.

::: api-response

```json
{
  "models": [
    {
      "name": "google/gemini-2.5-flash-lite",
      "displayName": "Google: Gemini 2.5 Flash Lite",
      "description": "Gemini 2.5 Flash-Lite is a lightweight reasoning model in the Gemini 2.5 family, optimized for ultra-low latency and cost efficiency. It offers improved throughput, faster token generation, and better performance across common benchmarks compared to earlier Flash models. By default, \"thinking\" (i.e. multi-pass reasoning) is disabled to prioritize speed, but developers can enable it via the [Reasoning API parameter](https://openrouter.ai/docs/use-cases/reasoning-tokens) to selectively trade off cost for intelligence. ",
      "inputTokenLimit": 1048576,
      "outputTokenLimit": 65535,
      "thinking": true,
      "inputModalities": ["file", "image", "text", "audio"],
      "outputModalities": ["text"],
      "pricings": {
        "completion": [
          {
            "value": 1,
            "unit": "perMTokens",
            "currency": "USD",
            "conditions": {
              "prompt_tokens": {
                "unit": "kTokens",
                "gte": 0
              }
            }
          }
        ],
        "prompt": [
          {
            "value": 1,
            "unit": "perMTokens",
            "currency": "USD",
            "conditions": {
              "prompt_tokens": {
                "unit": "kTokens",
                "gte": 0
              }
            }
          }
        ]
      }
    }
  ]
}
```

:::

::: api-request GET /api/vertex-ai/v1beta/models

```cURL
curl https://zenmux.ai/api/vertex-ai/v1beta/models
```

:::