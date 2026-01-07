---
pageClass: api-response
title: API
---

# List Models — OpenAI Chat Completion

```
GET https://zenmux.ai/api/v1/models
```

This endpoint retrieves the list of OpenAI-compatible models supported by the platform.

## Request params

This endpoint does not require any request parameters.

## Returns

Returns a JSON object containing information about all available models.

#### data `array`

An array of models, including detailed information for each available model.

#### object `string`

The object type. Fixed to `"list"`.

### `data` object

#### id `string`

The model’s unique identifier, in the format `<provider>/<model_name>`.

#### object `string`

The object type. Fixed to `"model"`.

#### display_name `string`

The model’s display name, used for UI presentation.

#### created `integer`

The model creation timestamp (Unix timestamp).

#### owned_by `string`

The model provider.

#### input_modalities `array`

The input modalities supported by the model. Possible values include:

- `"text"` - Text input
- `"image"` - Image input
- `"video"` - Video input
- `"audio"` - Audio input
- `"file"` - File input

#### output_modalities `array`

The output modalities supported by the model. Possible values include:

- `"text"` - Text output
- `"image"` - Image output
- `"video"` - Video output
- `"audio"` - Audio output
- `"file"` - File output

#### capabilities `object`

The model’s capability set.

##### capabilities.reasoning `boolean`

Whether reasoning is supported. `true` means reasoning is supported; `false` means it is not.

#### context_length `integer`

The context length limit, i.e., the maximum number of tokens the model can process.

#### pricings `object`

Pricing information, containing various price configurations for model usage.

##### pricings.prompt `array`

Price configuration array for processing input text.

##### pricings.completion `array`

Price configuration array for generated output text.

##### pricings.input_cache_read `array`

Price configuration array for reading input data from cache.

##### pricings.input_cache_write_5_min `array`

Price configuration array for writing to cache with a 5-minute retention.

##### pricings.input_cache_write_1_h `array`

Price configuration array for writing to cache with a 1-hour retention.

### pricings.input_cache_write `array`

Price configuration array for writing to cache.

##### pricings.web_search `array`

Price configuration array for invoking web search (optional; supported by some models).

##### pricings.internal_reasoning `array`

Price configuration array for the model’s internal reasoning process (optional; supported by some advanced reasoning models). When internal chain-of-thought or detailed reasoning is enabled, additional charges apply.

##### pricings.video `array`

Price configuration array for video output processing (optional; for models that support video understanding). Billed by video duration, resolution, or frame count.

##### pricings.image `array`

Price configuration array for image output processing (optional; for models that support image understanding). Typically billed by image count, resolution, or pixel count.

##### pricings.audio `array`

Price configuration array for audio output processing (optional; for models that support audio understanding). Billed by audio duration or processed volume.

##### pricings.audio_and_video `array`

Price configuration array for generating video content with audio (optional; for models that support audio-video multimodal understanding). Applicable to scenarios requiring analysis of both video frames and audio content. Note: There are two video generation scenarios—silent video uses `pricings.video`, while video with audio uses `pricings.audio_and_video`.

### Price configuration item structure

Each pricing array within the `pricings` object (such as `completion`, `prompt`, etc.) contains one or more pricing configuration objects. Each pricing configuration object includes the following fields:

#### value `number`

The actual discounted price. Free services show `0`.

#### unit `string`

The pricing unit. Possible values include:

- `"perMTokens"` - Per million tokens
- `"perCount"` - Per call
- `"perSecond"` - Per second (for time-based billing scenarios such as audio/video)

#### currency `string`

The currency type. Fixed to `"USD"`, meaning US dollars.

#### conditions `object`

Conditions under which the price applies (optional), commonly used for tiered pricing.

##### conditions.prompt_tokens `object`

Token-count conditions for the user-provided input consumed by the model.

##### conditions.completion_tokens `object`

Token-count conditions for the tokens consumed when the model generates output.

#### Price condition structure

When a pricing configuration includes the `conditions` field, it defines the specific conditions under which the price applies. The condition objects for `prompt_tokens` and `completion_tokens` include the following fields:

##### unit `string`

The token measurement unit. Fixed to `"kTokens"`, meaning thousand tokens (1000 tokens).

##### gte `number`

Minimum token count (inclusive). The actual token count must be ≥ this value.

#### lte `number`

Maximum token count (inclusive). The actual token count must be ≤ this value.

#### gt `number`

Minimum token count (exclusive). The actual token count must be > this value.

##### lt `number`

Maximum token count (exclusive). `null` means no upper limit.

::: api-response

```json
{
  "data": [
    {
      "id": "anthropic/claude-sonnet-4.5",
      "object": "model",
      "display_name": "Anthropic: Claude Sonnet 4.5",
      "created": 1759196009,
      "owned_by": "anthropic",
      "input_modalities": ["text", "image", "file"],
      "output_modalities": ["text"],
      "capabilities": {
        "reasoning": true
      },
      "context_length": 200000,
      "pricings": {
        "completion": [
          {
            "value": 15,
            "unit": "perMTokens",
            "currency": "USD",
            "conditions": {
              "prompt_tokens": {
                "unit": "kTokens",
                "gte": 0,
                "lt": 200
              }
            }
          },
          {
            "value": 22.5,
            "unit": "perMTokens",
            "currency": "USD",
            "conditions": {
              "prompt_tokens": {
                "unit": "kTokens",
                "gte": 200
              }
            }
          }
        ],
        "input_cache_read": [
          {
            "value": 0.3,
            "unit": "perMTokens",
            "currency": "USD",
            "conditions": {
              "prompt_tokens": {
                "unit": "kTokens",
                "gte": 0,
                "lt": 200
              }
            }
          },
          {
            "value": 0.6,
            "unit": "perMTokens",
            "currency": "USD",
            "conditions": {
              "prompt_tokens": {
                "unit": "kTokens",
                "gte": 200
              }
            }
          }
        ],
        "input_cache_write_1_h": [
          {
            "value": 6,
            "unit": "perMTokens",
            "currency": "USD",
            "conditions": {
              "prompt_tokens": {
                "unit": "kTokens",
                "gte": 0,
                "lt": 200
              }
            }
          },
          {
            "value": 12,
            "unit": "perMTokens",
            "currency": "USD",
            "conditions": {
              "prompt_tokens": {
                "unit": "kTokens",
                "gte": 200
              }
            }
          }
        ],
        "input_cache_write_5_min": [
          {
            "value": 3.75,
            "unit": "perMTokens",
            "currency": "USD",
            "conditions": {
              "prompt_tokens": {
                "unit": "kTokens",
                "gte": 0,
                "lt": 200
              }
            }
          },
          {
            "value": 7.5,
            "unit": "perMTokens",
            "currency": "USD",
            "conditions": {
              "prompt_tokens": {
                "unit": "kTokens",
                "gte": 200
              }
            }
          }
        ],
        "prompt": [
          {
            "value": 3,
            "unit": "perMTokens",
            "currency": "USD",
            "conditions": {
              "prompt_tokens": {
                "unit": "kTokens",
                "gte": 0,
                "lt": 200
              }
            }
          },
          {
            "value": 6,
            "unit": "perMTokens",
            "currency": "USD",
            "conditions": {
              "prompt_tokens": {
                "unit": "kTokens",
                "gte": 200
              }
            }
          }
        ],
        "web_search": [
          {
            "value": 0.01,
            "unit": "perCount",
            "currency": "USD"
          }
        ]
      }
    },
    {
      "id": "openai/gpt-5.2",
      "object": "model",
      "display_name": "OpenAI: GPT-5.2",
      "created": 1765438613,
      "owned_by": "openai",
      "input_modalities": ["image", "text", "file"],
      "output_modalities": ["text"],
      "capabilities": {
        "reasoning": true
      },
      "context_length": 400000,
      "pricings": {
        "completion": [
          {
            "value": 14,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_read": [
          {
            "value": 0.175,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "prompt": [
          {
            "value": 1.75,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "web_search": [
          {
            "value": 0.01,
            "unit": "perCount",
            "currency": "USD"
          }
        ]
      }
    }
  ],
  "object": "list"
}
```

:::