---
pageClass: api-page
title: 接口
---

# List Models(Anthropic Message Protocol)

```
GET https://zenmux.ai/api/anthropic/v1/models
```

该接口用于获取平台支持 Anthropic Message 协议的所有可用模型信息

## Request params

接口不需要任何请求参数。

## Returns

返回一个包含所有可用模型信息的 JSON 对象。

### 响应结构

#### data `array`

模型列表数组，包含所有可用模型的详细信息。

#### has_more `boolean`

是否还有更多模型数据，用于分页。

### data 对象

#### id `string`

模型的唯一标识符，格式为 `<供应商>/<模型名称>`。

#### type `string`

对象类型，固定为"model"。

#### display_name `string`

模型的显示名称，用于在界面中展示。

#### created_at `string`

模型创建日期，格式为 `YYYY-MM-DD`。

#### input_modalities `array`

模型支持的输入类型，可能的值包括：

- `"text"` - 文本输入
- `"image"` - 图片输入
- `"video"` - 视频输入
- `"audio"` - 音频输入
- `"file"` - 文件输入

#### output_modalities `array`

模型支持的输出类型，可能的值包括：

- `"text"` - 文本输出
- `"image"` - 图片输出
- `"video"` - 视频输出
- `"audio"` - 音频输出
- `"file"` - 文件输出

#### capabilities `object`

模型的功能特性。

##### capabilities.reasoning `boolean`

是否支持推理能力。`true` 表示支持推理，`false` 表示不支持。

#### context_length `integer`

上下文长度限制，表示模型能够处理的最大 token 数量。

#### pricings `object`

定价信息对象，包含模型使用的各种价格配置。

##### pricings.prompt `array`

模型处理输入文本的价格配置数组。

##### pricings.completion `array`

模型生成的输出文本的价格配置数组。

##### pricings.input_cache_read `array`

模型从缓存中读取输入数据的价格配置数组。

##### pricings.input_cache_write_5_min `array`

模型写入缓存且保留 5 分钟的价格配置数组。

##### pricings.input_cache_write_1_h `array`

模型写入缓存且保留 1 小时的价格配置数组。

##### pricings.input_cache_write `array`

模型写入缓存的价格配置数组。

##### pricings.web_search `array`

模型调用网络搜索功能的价格配置数组（可选字段，部分模型支持）。

##### pricings.internal_reasoning `array`

模型内部推理过程的价格配置数组（可选字段，部分高级推理模型支持）。当模型启用内部思维链或详细推理过程时，会产生额外费用。

##### pricings.video `array`

模型处理视频输出的价格配置数组（可选字段，支持视频理解的模型）。按视频时长、分辨率或帧数计费。

##### pricings.image `array`

模型处理图像输出的价格配置数组（可选字段，支持图像理解的模型）。通常按图像数量、分辨率或像素数量计费。

##### pricings.audio `array`

模型处理音频输出的价格配置数组（可选字段，支持音频理解的模型）。按音频时长或处理量计费。

##### pricings.audio_and_video `array`

模型输出带音频（有声）视频内容的价格配置数组（可选字段，支持音视频多模态理解的模型）。适用于需要同时分析视频画面和音频内容的场景。注意：生成视频有两种场景，无声视频使用 `pricings.video`，有声视频使用 `pricings.audio_and_video`。

### 价格配置项结构

在 `pricings` 对象中的每个价格数组（如 `completion`、`prompt` 等）都包含一个或多个价格配置对象。每个价格配置对象包含以下字段：

#### value `number`

模型折扣后的实际价格，免费服务显示为 0。

#### unit `string`

价格单位，可能的值包括：

- `"perMTokens"` - 每百万 tokens
- `"perCount"` - 每次调用
- `"perSecond"` - 每秒计费（适用于音频、视频等按时间计费的场景）

#### currency `string`

货币类型，固定为 `"USD"`， 表示美元。

#### conditions `object`

价格生效条件（可选字段），常用于阶梯计价场景。

##### conditions.prompt_tokens `object`

用户提供给模型的输入内容消耗的 Token 数量条件。

##### conditions.completion_tokens `object`

模型生成回复内容时消耗的 Token 数量条件。

### 价格生效条件结构

当价格配置中包含 `conditions` 字段时，该字段定义了价格生效的具体条件。`prompt_tokens`和 `completion_tokens` 的条件对象包含以下字段：

#### unit `string`

token 计量单位，固定为 `"kTokens"` 表示千 tokens（1000 tokens）。

#### gte `number`

最小 token 数（包含），实际 token 数必须 ≥ 该值。

#### lte `number`

最大 token 数（包含），实际 token 数必须 ≤ 该值。

#### gt `number`

最小 token 数（不包含），实际 token 数必须 > 该值。

#### lt `number`

最大 token 数（不包含），实际 token 数必须 < 该值，为 null 表示无上限。

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
