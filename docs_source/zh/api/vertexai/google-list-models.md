---
pageClass: api-page
title: 接口
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

该接口用于获取平台支持 Google Vertex AI API 协议的可用模型信息。

## Request params

接口不需要任何请求参数。

## Returns

返回一个包含所有可用模型信息的 JSON 对象。

#### models `array`

模型列表数组，包含所有可用模型的详细信息。

### models 对象

#### name `string`

模型的唯一标识符，格式为 `<供应商>/<模型名称>`。

#### displayName `string`

模型的显示名称，用于在界面中展示。

#### description `string`

模型的说明。

#### inputTokenLimit `integer`

此模型允许的最大输入 token 数。

#### outputTokenLimit `integer`

此模型可用的最大输出 token 数。

#### thinking `boolean`

是否支持推理能力。`true` 表示支持推理，`false` 表示不支持。

#### inputModalities `array`

模型支持的输入类型，可能的值包括：

- `"text"` - 文本输入
- `"image"` - 图片输入
- `"video"` - 视频输入
- `"audio"` - 音频输入
- `"file"` - 文件输入

#### outputModalities `array`

模型支持的输出类型，可能的值包括：

- `"text"` - 文本输出
- `"image"` - 图片输出
- `"video"` - 视频输出
- `"audio"` - 音频输出
- `"file"` - 文件输出

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

#### 价格生效条件结构

当价格配置中包含 `conditions` 字段时，该字段定义了价格生效的具体条件。`prompt_tokens`和 `completion_tokens` 的条件对象包含以下字段：

##### unit `string`

token 计量单位，固定为 `"kTokens"` 表示千 tokens（1000 tokens）。

##### gte `number`

最小 token 数（包含），实际 token 数必须 ≥ 该值。

#### lte `number`

最大 token 数（包含），实际 token 数必须 ≤ 该值。

#### gt `number`

最小 token 数（不包含），实际 token 数必须 > 该值。

##### lt `number`

最大 token 数（不包含），实际 token 数必须 < 该值，为 null 表示无上限。

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
