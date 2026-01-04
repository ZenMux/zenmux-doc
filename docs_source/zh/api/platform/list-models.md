---
pageClass: api-page
title: 接口
---

# List models

```
GET https://zenmux.ai/api/v1/models
```

List models 接口用于获取平台支持的所有可用模型信息。

## Request params

List models 接口不需要任何请求参数。

## Returns

返回一个包含所有可用模型信息的 JSON 对象。

### 响应格式

```json
{
    "data": [
        {
            "id": "kuaishou/kat-coder-pro-v1-free",
            "object": "model",
            "display_name": "KwaiKAT: KAT-Coder-Pro-V1 Free",
            "created": 1767146192,
            "owned_by": "kuaishou",
            "input_modalities": ["text"],
            "output_modalities": ["text"],
            "capabilities": {
                "reasoning": false
            },
            "context_length": 256000,
            "pricings": {
                "completion": [...],
                "input_cache_read": [...],
                "prompt": [...]
            }
        }
    ],
    "object": "list"
}
```

### 字段说明

| 字段名   | 类型   | 描述                   |
| -------- | ------ | ---------------------- |
| `data`   | array  | 模型列表数组           |
| `object` | string | 对象类型，固定为"list" |

#### 模型对象字段

| 字段名                   | 类型    | 描述                                                 |
| ------------------------ | ------- | ---------------------------------------------------- |
| `id`                     | string  | 模型的唯一标识符                                     |
| `object`                 | string  | 对象类型，固定为"model"                              |
| `display_name`           | string  | 模型的显示名称                                       |
| `created`                | integer | 模型创建时间的时间戳                                 |
| `owned_by`               | string  | 模型所有者                                           |
| `input_modalities`       | array   | 支持的输入模态，如["text", "image", "video", "file"] |
| `output_modalities`      | array   | 支持的输出模态，如["text"]                           |
| `capabilities`           | object  | 模型能力配置                                         |
| `capabilities.reasoning` | boolean | 是否支持推理能力                                     |
| `context_length`         | integer | 上下文长度限制（token 数）                           |
| `pricings`               | object  | 定价信息                                             |

#### 定价信息字段

| 字段名                      | 类型  | 描述                       |
| --------------------------- | ----- | -------------------------- |
| `pricings.completion`       | array | 生成补全的价格配置         |
| `pricings.input_cache_read` | array | 输入缓存读取的价格配置     |
| `pricings.prompt`           | array | 提示词的价格配置           |
| `pricings.web_search`       | array | 网络搜索的价格配置（可选） |

#### 价格配置项

每个价格配置项包含以下字段：

| 字段名       | 类型   | 描述                                                          |
| ------------ | ------ | ------------------------------------------------------------- |
| `value`      | number | 价格数值                                                      |
| `unit`       | string | 价格单位，如"perMTokens"（每百万 tokens）或"perCount"（每次） |
| `currency`   | string | 货币类型，如"USD"                                             |
| `conditions` | object | 价格生效条件（可选）                                          |

#### 条件配置

条件配置对象用于定义价格生效的具体条件，包含以下可能的字段：

| 条件字段            | 类型   | 描述                  | 示例                                       |
| ------------------- | ------ | --------------------- | ------------------------------------------ |
| `prompt_tokens`     | object | 提示词 token 数量条件 | `{"unit": "kTokens", "gte": 0, "lt": 32}`  |
| `completion_tokens` | object | 补全 token 数量条件   | `{"unit": "kTokens", "gte": 0, "lt": 0.2}` |

##### 条件对象结构

每个条件对象（如 `prompt_tokens` 或 `completion_tokens`）包含以下字段：

| 字段名 | 类型   | 描述                    | 取值说明                                        |
| ------ | ------ | ----------------------- | ----------------------------------------------- |
| `unit` | string | token 计量单位          | 固定为 `"kTokens"` 表示千 tokens（1000 tokens） |
| `gte`  | number | 最小 token 数（包含）   | 实际 token 数必须 ≥ 该值                        |
| `lt`   | number | 最大 token 数（不包含） | 实际 token 数必须 < 该值，为 null 表示无上限    |

::: api-request GET /api/v1/models

```Shell
curl https://zenmux.ai/api/v1/models \
  -H "Authorization: Bearer $ZENMUX_API_KEY"
```

:::
