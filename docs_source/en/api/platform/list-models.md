---
pageClass: api-page
title: API
---

# List models

```
GET https://zenmux.ai/api/v1/models
```

The List models API is used to retrieve information about all available models supported by the platform.

## Request params

The List models API does not require any request parameters.

## Returns

Returns a JSON object that contains information about all available models.

### Response format

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

### Field descriptions

| Field    | Type   | Description                          |
| -------- | ------ | ------------------------------------ |
| `data`   | array  | Array of model objects               |
| `object` | string | Object type, always `"list"`         |

#### Model object fields

| Field                    | Type    | Description                                                          |
| ------------------------ | ------- | -------------------------------------------------------------------- |
| `id`                     | string  | Unique identifier of the model                                       |
| `object`                 | string  | Object type, always `"model"`                                        |
| `display_name`           | string  | Display name of the model                                            |
| `created`                | integer | Unix timestamp when the model was created                            |
| `owned_by`               | string  | Model owner                                                          |
| `input_modalities`       | array   | Supported input modalities, e.g. `["text", "image", "video", "file"]` |
| `output_modalities`      | array   | Supported output modalities, e.g. `["text"]`                          |
| `capabilities`           | object  | Model capability configuration                                       |
| `capabilities.reasoning` | boolean | Whether reasoning is supported                                       |
| `context_length`         | integer | Context length limit (number of tokens)                              |
| `pricings`               | object  | Pricing information                                                  |

#### Pricing fields

| Field                        | Type  | Description                                  |
| --------------------------- | ----- | -------------------------------------------- |
| `pricings.completion`       | array | Pricing configuration for generated completions |
| `pricings.input_cache_read` | array | Pricing configuration for input cache reads  |
| `pricings.prompt`           | array | Pricing configuration for prompts            |
| `pricings.web_search`       | array | Pricing configuration for web search (optional) |

#### Pricing items

Each pricing item includes the following fields:

| Field        | Type   | Description                                                                 |
| ------------ | ------ | --------------------------------------------------------------------------- |
| `value`      | number | Price value                                                                 |
| `unit`       | string | Pricing unit, e.g. `"perMTokens"` (per million tokens) or `"perCount"` (per request) |
| `currency`   | string | Currency code, e.g. `"USD"`                                                 |
| `conditions` | object | Conditions under which the price applies (optional)                         |

#### Condition configuration

A condition configuration object defines the specific conditions under which a price applies, and may include the following fields:

| Condition field      | Type   | Description                       | Example                                      |
| ------------------- | ------ | --------------------------------- | -------------------------------------------- |
| `prompt_tokens`     | object | Prompt token count condition      | `{"unit": "kTokens", "gte": 0, "lt": 32}`    |
| `completion_tokens` | object | Completion token count condition  | `{"unit": "kTokens", "gte": 0, "lt": 0.2}`   |

##### Condition object schema

Each condition object (such as `prompt_tokens` or `completion_tokens`) includes the following fields:

| Field  | Type   | Description                     | Notes                                                                 |
| ------ | ------ | ------------------------------- | --------------------------------------------------------------------- |
| `unit` | string | Token measurement unit          | Always `"kTokens"` for thousand tokens (1000 tokens)                  |
| `gte`  | number | Minimum token count (inclusive) | The actual token count must be ≥ this value                           |
| `lt`   | number | Maximum token count (exclusive) | The actual token count must be < this value; `null` means no upper limit |

::: api-request GET /api/v1/models

```Shell
curl https://zenmux.ai/api/v1/models \
  -H "Authorization: Bearer $ZENMUX_API_KEY"
```

:::