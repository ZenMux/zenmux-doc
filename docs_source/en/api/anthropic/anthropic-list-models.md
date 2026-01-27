---
pageClass: api-page
title: API
head:
  - - meta
    - name: description
      content: List Models
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, anthropic, list, models, Anthropic, Claude
---

# List Models

```
GET https://zenmux.ai/api/anthropic/v1/models
```

This endpoint retrieves information about all available models on the platform that support the Anthropic Message protocol.

## Request params

This endpoint does not require any request parameters.

## Returns

Returns a JSON object containing information about all available models.

### Response schema

#### data `array`

An array of models, including detailed information for each available model.

#### has_more `boolean`

Whether there are more model records available (used for pagination).

### data object

#### id `string`

The model’s unique identifier, in the format `<provider>/<model_name>`.

#### type `string`

Object type, fixed as `"model"`.

#### display_name `string`

The model’s display name, used for UI presentation.

#### created_at `string`

Model creation date, in `YYYY-MM-DD` format.

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

Model capability features.

##### capabilities.reasoning `boolean`

Whether reasoning is supported. `true` indicates reasoning is supported; `false` indicates it is not.

#### context_length `integer`

The context length limit, i.e., the maximum number of tokens the model can process.

#### pricings `object`

Pricing information, including various pricing configurations for using the model.

##### pricings.prompt `array`

Pricing configuration array for processing input text.

##### pricings.completion `array`

Pricing configuration array for generating output text.

##### pricings.input_cache_read `array`

Pricing configuration array for reading input data from cache.

##### pricings.input_cache_write_5_min `array`

Pricing configuration array for writing to cache with a 5-minute retention.

##### pricings.input_cache_write_1_h `array`

Pricing configuration array for writing to cache with a 1-hour retention.

##### pricings.input_cache_write `array`

Pricing configuration array for writing to cache.

##### pricings.web_search `array`

Pricing configuration array for using the web search feature (optional; supported by some models).

##### pricings.internal_reasoning `array`

Pricing configuration array for the model’s internal reasoning process (optional; supported by some advanced reasoning models). Additional charges apply when the model enables internal chain-of-thought or detailed reasoning processes.

##### pricings.video `array`

Pricing configuration array for video output processing (optional; for models that support video understanding). Billed by video duration, resolution, or frame count.

##### pricings.image `array`

Pricing configuration array for image output processing (optional; for models that support image understanding). Typically billed by image count, resolution, or pixel count.

##### pricings.audio `array`

Pricing configuration array for audio output processing (optional; for models that support audio understanding). Billed by audio duration or processing volume.

##### pricings.audio_and_video `array`

Pricing configuration array for generating video content with audio (optional; for models that support audio-video multimodal understanding). Applies to scenarios that require analyzing both video frames and audio content. Note: There are two scenarios for video generation—silent video uses `pricings.video`, while video with audio uses `pricings.audio_and_video`.

### Pricing item schema

Each pricing array within the `pricings` object (such as `completion`, `prompt`, etc.) contains one or more pricing configuration objects. Each pricing configuration object includes the following fields:

#### value `number`

The effective discounted price. Free services show as 0.

#### unit `string`

Pricing unit. Possible values include:

- `"perMTokens"` - Per million tokens
- `"perCount"` - Per call
- `"perSecond"` - Per second (for time-billed scenarios such as audio and video)

#### currency `string`

Currency type, fixed as `"USD"`.

#### conditions `object`

Conditions under which the price applies (optional), commonly used for tiered pricing.

##### conditions.prompt_tokens `object`

Token-usage condition for the input content provided by the user.

##### conditions.completion_tokens `object`

Token-usage condition for the tokens consumed when generating the model’s response.

### Pricing condition schema

When a pricing configuration includes the `conditions` field, it defines the specific conditions under which that price applies. The condition objects for `prompt_tokens` and `completion_tokens` include the following fields:

#### unit `string`

Token measurement unit, fixed as `"kTokens"` (thousand tokens, i.e., 1000 tokens).

#### gte `number`

Minimum token count (inclusive). The actual token count must be ≥ this value.

#### lte `number`

Maximum token count (inclusive). The actual token count must be ≤ this value.

#### gt `number`

Minimum token count (exclusive). The actual token count must be > this value.

#### lt `number`

Maximum token count (exclusive). The actual token count must be < this value; null indicates no upper limit.

::: api-response

```json
{
  "data": [
    {
      "id": "anthropic/claude-opus-4.5",
      "type": "model",
      "display_name": "Anthropic: Claude Opus 4.5",
      "created_at": "2025-11-24",
      "input_modalities": ["file", "image", "text"],
      "output_modalities": ["text"],
      "capabilities": {
        "reasoning": true
      },
      "context_length": 200000,
      "pricings": {
        "completion": [
          {
            "value": 25,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_read": [
          {
            "value": 0.5,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_write_1_h": [
          {
            "value": 10,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_write_5_min": [
          {
            "value": 6.25,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "prompt": [
          {
            "value": 5,
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
    },
    {
      "id": "anthropic/claude-sonnet-4.5",
      "type": "model",
      "display_name": "Anthropic: Claude Sonnet 4.5",
      "created_at": "2025-09-29",
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
      "id": "anthropic/claude-haiku-4.5",
      "type": "model",
      "display_name": "Anthropic: Claude Haiku 4.5",
      "created_at": "2025-10-15",
      "input_modalities": ["image", "text"],
      "output_modalities": ["text"],
      "capabilities": {
        "reasoning": false
      },
      "context_length": 200000,
      "pricings": {
        "completion": [
          {
            "value": 5,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_read": [
          {
            "value": 0.1,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_write_1_h": [
          {
            "value": 2,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_write_5_min": [
          {
            "value": 1.25,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "prompt": [
          {
            "value": 1,
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
    },
    {
      "id": "anthropic/claude-3.7-sonnet",
      "type": "model",
      "display_name": "Anthropic: Claude 3.7 Sonnet",
      "created_at": "2025-02-24",
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
            "currency": "USD"
          }
        ],
        "input_cache_read": [
          {
            "value": 0.3,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_write_1_h": [
          {
            "value": 6,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_write_5_min": [
          {
            "value": 3.75,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "prompt": [
          {
            "value": 3,
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
    },
    {
      "id": "anthropic/claude-sonnet-4",
      "type": "model",
      "display_name": "Anthropic: Claude Sonnet 4",
      "created_at": "2025-05-22",
      "input_modalities": ["image", "text", "file"],
      "output_modalities": ["text"],
      "capabilities": {
        "reasoning": true
      },
      "context_length": 1000000,
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
      "id": "anthropic/claude-opus-4.1",
      "type": "model",
      "display_name": "Anthropic: Claude Opus 4.1",
      "created_at": "2025-08-05",
      "input_modalities": ["image", "text", "file"],
      "output_modalities": ["text"],
      "capabilities": {
        "reasoning": true
      },
      "context_length": 200000,
      "pricings": {
        "completion": [
          {
            "value": 75,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_read": [
          {
            "value": 1.5,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_write_1_h": [
          {
            "value": 30,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_write_5_min": [
          {
            "value": 18.75,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "prompt": [
          {
            "value": 15,
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
    },
    {
      "id": "anthropic/claude-opus-4",
      "type": "model",
      "display_name": "Anthropic: Claude Opus 4",
      "created_at": "2025-05-22",
      "input_modalities": ["image", "text", "file"],
      "output_modalities": ["text"],
      "capabilities": {
        "reasoning": true
      },
      "context_length": 200000,
      "pricings": {
        "completion": [
          {
            "value": 75,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_read": [
          {
            "value": 1.5,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_write_1_h": [
          {
            "value": 30,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_write_5_min": [
          {
            "value": 18.75,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "prompt": [
          {
            "value": 15,
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
    },
    {
      "id": "anthropic/claude-3.5-sonnet",
      "type": "model",
      "display_name": "Anthropic: Claude 3.5 Sonnet (Retiring Soon)",
      "created_at": "2024-10-22",
      "input_modalities": ["text", "image", "file"],
      "output_modalities": ["text"],
      "capabilities": {
        "reasoning": false
      },
      "context_length": 200000,
      "pricings": {
        "completion": [
          {
            "value": 15,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_read": [
          {
            "value": 0.3,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_write_1_h": [
          {
            "value": 6,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_write_5_min": [
          {
            "value": 3.75,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "prompt": [
          {
            "value": 3,
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
    },
    {
      "id": "anthropic/claude-3.5-haiku",
      "type": "model",
      "display_name": "Anthropic: Claude 3.5 Haiku",
      "created_at": "2024-11-04",
      "input_modalities": ["text", "image"],
      "output_modalities": ["text"],
      "capabilities": {
        "reasoning": false
      },
      "context_length": 200000,
      "pricings": {
        "completion": [
          {
            "value": 4,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_read": [
          {
            "value": 0.08,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_write_1_h": [
          {
            "value": 1.6,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "input_cache_write_5_min": [
          {
            "value": 1,
            "unit": "perMTokens",
            "currency": "USD"
          }
        ],
        "prompt": [
          {
            "value": 0.8,
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
  "has_more": false
}
```

:::

::: api-request GET /api/anthropic/v1/models

```cURL
curl https://zenmux.ai/api/anthropic/v1/models
```

:::
