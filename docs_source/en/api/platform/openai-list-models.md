---
pageClass: api-response
title: API
---

# List models OpenAI Chat Completion

```
GET https://zenmux.ai/api/v1/models
```

This endpoint is used to retrieve information about the OpenAI-compatible models supported by the platform.

## Request params

This endpoint does not require any request parameters.

## Returns

Returns a JSON object containing information about all available models.

#### data `array`

An array of models, containing detailed information for each available model.

#### object `string`

The object type. Fixed as `"list"`.

### data object

#### id `string`

The model’s unique identifier, in the format `<provider>/<model_name>`.

#### object `string`

The object type. Fixed as `"model"`.

#### display_name `string`

The model’s display name, used for UI presentation.

#### created `integer`

The model creation timestamp (Unix timestamp).

#### owned_by `string`

The identifier of the model owner or provider.

#### input_modalities `array`

The input modalities supported by the model. Possible values include:

- `"text"` - Text input
- `"image"` - Image input
- `"video"` - Video input
- `"file"` - File input

#### output_modalities `array`

The output modalities supported by the model, typically including:

- `"text"` - Text output

#### capabilities `object`

The model’s capabilities.

##### capabilities.reasoning `boolean`

Whether reasoning is supported. `true` indicates supported; `false` indicates not supported.

#### context_length `integer`

The context length limit, i.e., the maximum number of tokens the model can process.

#### pricings `object`

Pricing information, containing the various price configurations for model usage.

##### pricings.completion `array`

An array of pricing configurations for generated output text.

##### pricings.input_cache_read `array`

An array of pricing configurations for reading input data from cache.

##### pricings.input_cache_write_1_h `array`

An array of pricing configurations for writing to cache with a 1-hour retention.

##### pricings.input_cache_write_5_min `array`

An array of pricing configurations for writing to cache with a 5-minute retention.

##### pricings.prompt `array`

An array of pricing configurations for processing input text.

##### pricings.web_search `array`

An array of pricing configurations for invoking the web search capability (optional; supported by some models).

### Pricing item schema

Each pricing array within the `pricings` object (such as `completion`, `prompt`, etc.) contains one or more pricing configuration objects. Each pricing configuration object includes the following fields:

#### value `number`

The price value.

#### unit `string`

The pricing unit. Possible values include:

- `"perMTokens"` - Per million tokens
- `"perCount"` - Per call

#### currency `string`

The currency, e.g., `"USD"` for US dollars.

#### conditions `object`

Pricing conditions (optional), used to define the specific conditions under which the price applies.

##### conditions.prompt_tokens `object`

A token-count condition for tokens consumed by the user-provided input.

##### conditions.completion_tokens `object`

A token-count condition for tokens consumed by the model-generated output.

#### Pricing conditions schema

When a pricing configuration includes the `conditions` field, it defines the specific conditions under which the price applies. The condition objects for `prompt_tokens` and `completion_tokens` include the following fields:

##### unit `string`

The token measurement unit. Fixed as `"kTokens"` for thousand tokens (1000 tokens).

##### gte `number`

The minimum token count (inclusive). The actual token count must be ≥ this value.

##### lt `number`

The maximum token count (exclusive). The actual token count must be < this value. `null` indicates no upper limit.

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