---
pageClass: api-response
title: 接口
---

# List models OpenAI Chat Completion

```
GET https://zenmux.ai/api/v1/models
```

该接口用于获取平台支持的 OpenAI 可用模型信息。

## Request params

接口不需要任何请求参数。

## Returns

返回一个包含所有可用模型信息的 JSON 对象。

#### data `array`

模型列表数组，包含所有可用模型的详细信息。

#### object `string`

对象类型，固定为"list"。

### data 对象

#### id `string`

模型的唯一标识符，格式为 `<供应商>/<模型名称>`。

#### object `string`

对象类型，固定为"model"。

#### display_name `string`

模型的显示名称，用于在界面中展示。

#### created `integer`

模型创建时间的时间戳（Unix timestamp）。

#### owned_by `string`

模型所有者或提供方的标识符。

#### input_modalities `array`

模型支持的输入类型，可能的值包括：

- `"text"` - 文本输入
- `"image"` - 图片输入
- `"video"` - 视频输入
- `"file"` - 文件输入

#### output_modalities `array`

模型支持的输出类型，通常包括：

- `"text"` - 文本输出

#### capabilities `object`

模型的功能特性。

##### capabilities.reasoning `boolean`

是否支持推理能力。`true` 表示支持推理，`false` 表示不支持。

#### context_length `integer`

上下文长度限制，表示模型能够处理的最大 token 数量。

#### pricings `object`

定价信息对象，包含模型使用的各种价格配置。

##### pricings.completion `array`

模型生成的输出文本的价格配置数组。

##### pricings.input_cache_read `array`

模型从缓存中读取输入数据的价格配置数组。

##### pricings.input_cache_write_1_h `array`

模型写入缓存且保留 1 小时的价格配置数组。

##### pricings.input_cache_write_5_min `array`

模型写入缓存且保留 5 分钟的价格配置数组。

##### pricings.prompt `array`

模型处理输入文本的价格配置数组。

##### pricings.web_search `array`

模型调用网络搜索功能的价格配置数组（可选字段，部分模型支持）。

### 价格配置项结构

在 `pricings` 对象中的每个价格数组（如 `completion`、`prompt` 等）都包含一个或多个价格配置对象。每个价格配置对象包含以下字段：

#### value `number`

价格数值。

#### unit `string`

价格单位，可能的值包括：

- `"perMTokens"` - 每百万 tokens
- `"perCount"` - 每次调用

#### currency `string`

货币类型，如 `"USD"` 表示美元。

#### conditions `object`

价格生效条件（可选字段），用于定义价格适用的具体条件。

##### conditions.prompt_tokens `object`

用户提供给模型的输入内容消耗的 Token 数量条件。

##### conditions.completion_tokens `object`

模型根据输入生成回复内容消耗的 Token 数量条件。

#### 价格生效条件结构

当价格配置中包含 `conditions` 字段时，该字段定义了价格生效的具体条件。`prompt_tokens`和 `completion_tokens` 的条件对象包含以下字段：

##### unit `string`

token 计量单位，固定为 `"kTokens"` 表示千 tokens（1000 tokens）。

##### gte `number`

最小 token 数（包含），实际 token 数必须 ≥ 该值。

##### lt `number`

最大 token 数（不包含），实际 token 数必须 < 该值，为 null 表示无上限。

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
