---
pageClass: api-response
title: API
---

# List models OpenAI Chat Completion

```
GET https://zenmux.ai/api/v1/models
```

This endpoint is used to retrieve the list of OpenAI-compatible models supported by the platform.

## Request params

This endpoint does not require any request parameters.

## Returns

Returns a JSON object containing information about all available models.

#### data `array`

An array of models, containing detailed information for all available models.

#### object `string`

Object type, fixed as `"list"`.

### data object

#### id `string`

The model’s unique identifier, in the format `<vendor>/<model_name>`.

#### object `string`

Object type, fixed as `"model"`.

#### display_name `string`

The model’s display name, used for UI presentation.

#### created `integer`

The model creation timestamp (Unix timestamp).

#### owned_by `string`

The model provider.

#### input_modalities `array`

Input modalities supported by the model. Possible values include:

- `"text"` - Text input
- `"image"` - Image input
- `"video"` - Video input
- `"audio"` - Audio input
- `"file"` - File input

#### output_modalities `array`

Output modalities supported by the model. Possible values include:

- `"text"` - Text output
- `"image"` - Image output
- `"video"` - Video output
- `"audio"` - Audio output
- `"file"` - File output

#### capabilities `object`

The model’s capability features.

##### capabilities.reasoning `boolean`

Whether reasoning is supported. `true` indicates reasoning is supported; `false` indicates it is not.

#### context_length `integer`

Context length limit, indicating the maximum number of tokens the model can process.

#### pricings `object`

Pricing information object, containing various price configurations for using the model.

##### pricings.prompt `array`

An array of price configurations for processing input text.

##### pricings.completion `array`

An array of price configurations for generated output text.

##### pricings.input_cache_read `array`

An array of price configurations for reading input data from cache.

##### pricings.input_cache_write_5_min `array`

An array of price configurations for writing to cache and retaining it for 5 minutes.

##### pricings.input_cache_write_1_h `array`

An array of price configurations for writing to cache and retaining it for 1 hour.

### pricings.input_cache_write `array`

An array of price configurations for writing to cache.

##### pricings.web_search `array`

An array of price configurations for invoking web search (optional; supported by some models).

##### pricings.internal_reasoning `array`

An array of price configurations for the model’s internal reasoning process (optional; supported by some advanced reasoning models). Additional fees may apply when the model enables internal chain-of-thought or detailed reasoning.

##### pricings.video `array`

An array of price configurations for processing video input (optional; for models that support video understanding). Billed by video duration, resolution, or frame count.

##### pricings.image `array`

An array of price configurations for processing image input (optional; for models that support image understanding). Typically billed by image count, resolution, or pixel count.

##### pricings.audio `array`

An array of price configurations for processing audio input (optional; for models that support audio understanding). Billed by audio duration or processing volume.

##### pricings.audio_and_video `array`

An array of price configurations for processing audio and video together (optional; for models that support audiovisual multimodal understanding). Suitable for scenarios requiring simultaneous analysis of audio and video content.

### Pricing item structure

Each pricing array within the `pricings` object (such as `completion`, `prompt`, etc.) contains one or more pricing configuration objects. Each pricing configuration object includes the following fields:

#### value `number`

The discounted effective price. Free services show 0.

#### unit `string`

Pricing unit. Possible values include:

- `"perMTokens"` - Per million tokens
- `"perCount"` - Per call
- `"perSecond"` - Per second (for time-billed scenarios such as audio and video)

#### currency `string`

Currency type, fixed as `"USD"`, indicating US dollars.

#### conditions `object`

Pricing effective conditions (optional), commonly used for tiered pricing.

##### conditions.prompt_tokens `object`

Token-usage conditions for the input content provided by the user.

##### conditions.completion_tokens `object`

Token-usage conditions for tokens consumed when generating the response.

#### Pricing effective condition structure

When a pricing configuration includes the `conditions` field, it defines the specific conditions under which the price applies. The condition objects for `prompt_tokens` and `completion_tokens` include the following fields:

##### unit `string`

Token measurement unit, fixed as `"kTokens"` meaning thousand tokens (1000 tokens).

##### gte `number`

Minimum number of tokens (inclusive). The actual token count must be ≥ this value.

#### lte `number`

Maximum number of tokens (inclusive). The actual token count must be ≤ this value.

#### gt `number`

Minimum number of tokens (exclusive). The actual token count must be > this value.

##### lt `number`

Maximum number of tokens (exclusive). The actual token count must be < this value. `null` indicates no upper limit.

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