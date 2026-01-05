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

An array of models, including detailed information for each available model.

#### object `string`

Object type, fixed to `"list"`.

### data object

#### id `string`

The model’s unique identifier, in the format `<provider>/<model_name>`.

#### object `string`

Object type, fixed to `"model"`.

#### display_name `string`

The model’s display name, used for UI display.

#### created `integer`

The model’s creation timestamp (Unix timestamp).

#### owned_by `string`

Identifier of the model owner/provider.

#### input_modalities `array`

List of supported input modalities. Possible values include:

- `"text"` - Text input
- `"image"` - Image input
- `"video"` - Video input
- `"file"` - File input

#### output_modalities `array`

List of supported output modalities. Possible values include:

- `"text"` - Text output

#### capabilities `object`

Model capability configuration object.

##### capabilities.reasoning `boolean`

Whether reasoning is supported. `true` indicates reasoning is supported; `false` indicates it is not.

#### context_length `integer`

Context length limit, i.e., the maximum number of tokens the model can process.

#### pricings `object`

Pricing information object, containing various pricing configurations for model usage.

##### pricings.completion `array`

Pricing configuration array for generated completions.

##### pricings.input_cache_read `array`

Pricing configuration array for input cache reads.

##### pricings.prompt `array`

Pricing configuration array for prompts.

##### pricings.web_search `array`

Pricing configuration array for web search (optional; supported by some models).

### Pricing item structure

Each pricing array within the `pricings` object (such as `completion`, `prompt`, etc.) contains one or more pricing configuration objects. Each pricing configuration object includes the following fields:

#### value `number`

Price value.

#### unit `string`

Pricing unit. Possible values include:

- `"perMTokens"` - Per million tokens
- `"perCount"` - Per request

#### currency `string`

Currency type, e.g., `"USD"` for US dollars.

#### conditions `object`

Price applicability conditions (optional), used to define the specific conditions under which the price applies.

##### conditions.prompt_tokens `object`

Prompt token count conditions.

##### conditions.completion_tokens `object`

Completion token count conditions.

#### Condition structure

When a pricing configuration includes the `conditions` field, it defines the specific conditions under which the price applies. The condition object includes the following fields:

##### unit `string`

Token measurement unit, fixed to `"kTokens"` (thousand tokens, i.e., 1000 tokens).

##### gte `number`

Minimum token count (inclusive). The actual token count must be ≥ this value.

##### lt `number`

Maximum token count (exclusive). The actual token count must be < this value. `null` indicates no upper limit.

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
