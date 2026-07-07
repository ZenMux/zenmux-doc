---
pageClass: api-reference-page
title: 协议转换参数兼容性
head:
  - - meta
    - name: description
      content: Protocol conversion parameter compatibility
  - - meta
    - name: keywords
      content: Zenmux, API, protocol, conversion, compatibility, OpenAI, Anthropic, Gemini, Responses
---

# 协议转换参数兼容性

::: info 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

ZenMux 支持通过不同协议调用同一批模型。本文说明跨协议转发时，常见请求参数、响应字段与流式事件如何映射，以及哪些字段在目标协议中没有等价能力。

本文参考 [ZenMux/rosetta-ai](https://github.com/ZenMux/rosetta-ai) 的协议转换实现编写。rosetta-ai 覆盖 OpenAI Chat Completions、OpenAI Responses、Anthropic Messages 与 Google Gemini 四类协议之间的 12 组双向转换。

## 协议简称

| 简称 | 协议 | ZenMux API 参考 |
| --- | --- | --- |
| Chat Completions | OpenAI Chat Completions | [Create a Chat Completion](/zh/api/openai/create-chat-completion) |
| Responses | OpenAI Responses | [Create a Model Response](/zh/api/openai/openai-responses) |
| Messages | Anthropic Messages | [Create a Message](/zh/api/anthropic/create-messages) |
| Gemini | Google Gemini / Vertex AI Generate Content | [Generate Content](/zh/api/vertexai/generate-content) |

## 支持总览

下表从“请求来源协议”的角度阅读：例如 `Chat Completions` 行表示你使用 OpenAI Chat Completions 协议发起请求时，该字段可以转换到哪些后端协议。

| 字段类别 | Chat Completions | Messages | Responses | Gemini |
| --- | --- | --- | --- | --- |
| 模型 `model` | 全部 | 全部 | 全部 | 全部 |
| 系统指令 / instructions | 全部 | 全部 | 全部 | 全部 |
| `temperature` | 全部 | 全部 | 全部 | 全部 |
| `top_p` | 全部 | 全部 | 全部 | 全部 |
| `top_k` | 不支持 | Gemini | 不支持 | Messages |
| 最大输出 token | 全部 | 全部 | 全部 | 全部 |
| 停止序列 | Messages / Gemini | Chat Completions / Gemini | 不支持 | Chat Completions / Messages |
| 函数工具 | 全部 | 全部 | 全部 | 全部 |
| `tool_choice` | 全部 | 全部 | 全部 | 全部 |
| 网络搜索 | 全部 | 全部 | 全部 | 全部 |
| 推理 / Thinking | 全部 | 全部 | 全部 | 全部 |
| JSON 输出格式 | 全部 | 全部 | 全部 | 全部 |
| 图片输入 | Messages / Gemini | Chat Completions / Gemini | Gemini | Chat Completions / Messages |
| 文档 / 文件输入 | Messages / Gemini | Chat Completions / Gemini | 不支持 | Chat Completions / Messages |
| 音频输入 | Gemini | 不支持 | 不支持 | 不支持 |
| `seed` | Gemini | 不支持 | 不支持 | Chat Completions |
| `frequency_penalty` | Gemini | 不支持 | 不支持 | Chat Completions |
| `presence_penalty` | Gemini | 不支持 | 不支持 | Chat Completions |
| 候选数量 `n` / `candidateCount` | Gemini | 不支持 | 不支持 | Chat Completions |
| Logprobs | Responses / Gemini | 不支持 | Gemini | Chat Completions / Responses |
| 并行工具调用 | Messages / Responses | Chat Completions / Responses | Chat Completions / Messages | 不支持 |
| Metadata / User | Messages / Responses | Chat Completions / Responses | Messages / Chat Completions | 不支持 |
| `service_tier` | Messages / Responses | Chat Completions / Responses | Chat Completions / Messages | 不支持 |
| Prompt Cache Key | Responses | 不支持 | Chat Completions | 不支持 |
| 流式输出 | 全部 | 全部 | 全部 | 全部 |

::: warning 参数支持以模型能力为准
协议转换只解决字段形态差异，不代表所有模型都支持该能力。具体可用参数仍以模型详情页的支持参数为准。
:::

## Chat Completions 请求转换

### Chat Completions → Messages

| Chat Completions 字段 | Messages 字段 | 说明 |
| --- | --- | --- |
| `model` | `model` | 原样传递 |
| `messages` 中的 `system` / `developer` | `system` | 合并为文本块 |
| `messages` 中的 `user` | `messages[]` user | 支持文本、图片；`file` content part 会降级为不支持占位文本 |
| `messages` 中的 `assistant` | `messages[]` assistant | 支持文本、`tool_use`、thinking |
| `messages` 中的 `tool` | `messages[]` user `tool_result` | 转为工具结果块 |
| `max_tokens` / `max_completion_tokens` | `max_tokens` | 未传时默认 `4096` |
| `temperature` | `temperature` | 原样传递 |
| `top_p` | `top_p` | 原样传递 |
| `stop` | `stop_sequences` | 字符串会转为数组 |
| `tools` function | `tools` `input_schema` | JSON Schema 转为 Anthropic 工具 schema |
| `web_search_options` | `tools` `web_search_20250305` | 转为 Anthropic web search 工具 |
| `tool_choice` | `tool_choice` | `auto` / `required` / `none` → `auto` / `any` / `none`；命名函数转为 `tool` |
| `parallel_tool_calls` | `tool_choice.disable_parallel_tool_use` | 语义取反：`false` → `true` |
| `response_format` `json_schema` | `output_config.format` | JSON Schema 输出约束 |
| `response_format` `json_object` | `output_config.format` | 转为 JSON 输出格式 |
| `reasoning_effort` | `thinking` | `none` / `minimal` → disabled；`low` / `medium` / `high` → 2048 / 5120 / 10240 budget tokens |
| `user` | `metadata.user_id` | 用户标识 |
| `service_tier` | `service_tier` | 仅传递 `auto` / `standard_only` |
| `stream` | `stream` | 原样传递 |

不转换：`frequency_penalty`、`presence_penalty`、`seed`、`n`、`logprobs`、`top_logprobs`、`logit_bias`。

### Chat Completions → Responses

| Chat Completions 字段 | Responses 字段 | 说明 |
| --- | --- | --- |
| `model` | `model` | 原样传递 |
| `messages` | `input` | 转为 Responses input item |
| `max_completion_tokens` | `max_output_tokens` | 最大输出 token |
| `temperature` | `temperature` | 原样传递 |
| `top_p` | `top_p` | 原样传递 |
| `tools` function | `tools` function | 工具定义保持 Responses 形态 |
| `web_search_options` | `tools` `web_search` | 转为 Responses 网络搜索工具 |
| `tool_choice` | `tool_choice` | `auto` / `required` / `none` 与命名函数均支持 |
| `parallel_tool_calls` | `parallel_tool_calls` | 原样传递 |
| `response_format` | `text.format` | JSON / JSON Schema 输出格式 |
| `reasoning_effort` | `reasoning.effort` | 原样传递 effort |
| `top_logprobs` | `include` | 请求 logprobs 相关输出 |
| `metadata` | `metadata` | 原样传递 |
| `service_tier` | `service_tier` | 原样传递 |
| `prompt_cache_key` | `prompt_cache_key` | 原样传递 |
| `prompt_cache_retention` | `prompt_cache_retention` | 原样传递 |
| `stream` | `stream` + `stream_options` | 流式配置 |

不转换：`frequency_penalty`、`presence_penalty`、`seed`、`n`、`logprobs`、`stop`。

### Chat Completions → Gemini

| Chat Completions 字段 | Gemini 字段 | 说明 |
| --- | --- | --- |
| `model` | `model` | 原样传递 |
| `messages` 中的 `system` / `developer` | `config.systemInstruction` | 系统指令 |
| `messages` 中的 `user` / `assistant` / `tool` | `contents` | `assistant` 转为 Gemini `model` 角色 |
| `max_tokens` / `max_completion_tokens` | `config.maxOutputTokens` | 最大输出 token |
| `temperature` | `config.temperature` | 原样传递 |
| `top_p` | `config.topP` | 字段名转换 |
| `stop` | `config.stopSequences` | 停止序列 |
| `seed` | `config.seed` | 原样传递 |
| `frequency_penalty` | `config.frequencyPenalty` | 字段名转换 |
| `presence_penalty` | `config.presencePenalty` | 字段名转换 |
| `n` | `config.candidateCount` | 候选数量 |
| `logprobs` | `config.responseLogprobs` | 是否返回 logprobs |
| `top_logprobs` | `config.logprobs` | 返回 top logprobs 数量 |
| `tools` function | `config.tools[].functionDeclarations` | 使用 `parametersJsonSchema` |
| `web_search_options` | `config.tools[].googleSearch` | 转为 Google Search |
| `tool_choice` | `config.toolConfig.functionCallingConfig` | `auto` / `required` / `none` → `AUTO` / `ANY` / `NONE`；命名函数使用 `allowedFunctionNames` |
| `response_format` `json_schema` | `config.responseMimeType` + `config.responseJsonSchema` | `responseMimeType` 为 `application/json` |
| `response_format` `json_object` | `config.responseMimeType` | `application/json` |
| `reasoning_effort` | `config.thinkingConfig` | `none` / `minimal` → `thinkingBudget: 0`；`low` / `medium` / `high` / `xhigh` → 2048 / 5120 / 10240 / 20480 |
| `image_url` base64 | `inlineData` | 图片二进制 |
| `image_url` URL | `fileData` | 图片 URL |
| `file` content part | `inlineData` / `fileData` | 文件输入 |
| `input_audio` | `inlineData` | 音频输入 |

不转换：`logit_bias`、`user`。

## Messages 请求转换

### Messages → Chat Completions

| Messages 字段 | Chat Completions 字段 | 说明 |
| --- | --- | --- |
| `model` | `model` | 原样传递 |
| `system` | `messages[]` system | 字符串或 `TextBlockParam[]` 会合并为文本 |
| `messages` user | `messages[]` user | 支持文本、图片、document、`tool_result` |
| `messages` assistant | `messages[]` assistant | 支持文本、thinking、`tool_use` |
| `max_tokens` | `max_completion_tokens` | 对推理模型使用新字段 |
| `temperature` | `temperature` | 原样传递 |
| `top_p` | `top_p` | 原样传递 |
| `stop_sequences` | `stop` | 字段名转换 |
| `tools` `input_schema` | `tools` function | JSON Schema 工具 |
| `tools` `web_search_20250305` / `web_search_20260209` | `web_search_options` | `max_uses`、`user_location` 会尽量映射 |
| `tool_choice` | `tool_choice` + `parallel_tool_calls` | `auto` / `any` / `none` → `auto` / `required` / `none`；`disable_parallel_tool_use: true` → `parallel_tool_calls: false` |
| `output_config.format` | `response_format` | JSON / JSON Schema 输出格式 |
| `thinking` | `reasoning_effort` | disabled → `none`；enabled budget ≤2048 / ≤5120 / ≤10240 → `low` / `medium` / `high` |
| `metadata.user_id` | `user` | 用户标识 |
| `service_tier` | `service_tier` | `standard_only` → `default` |
| `stream` | `stream` + `stream_options` | 默认包含 usage |

Document block 转换规则：

- `source.type: "base64"` / `"url"` → Chat Completions `file` content part
- `source.type: "text"` → 文本 content part
- `source.type: "content"` → 展开内部文本 / 图片内容块

`tool_result` content 转换规则：

- `text` 保留
- `search_result` 展开内部文本
- `tool_reference` 保留工具名
- 图片 / document 不支持放入 OpenAI tool role，会被跳过

不转换：`top_k`、Anthropic 专属 metadata 字段。

### Messages → Responses

| Messages 字段 | Responses 字段 | 说明 |
| --- | --- | --- |
| `model` | `model` | 原样传递 |
| `system` | `instructions` | 合并为文本 |
| `messages` | `input` | 转为 Responses input item |
| `max_tokens` | `max_output_tokens` | 最大输出 token |
| `temperature` | `temperature` | 原样传递 |
| `top_p` | `top_p` | 原样传递 |
| `tools` `input_schema` | `tools` function | 工具定义 |
| `tools` web search | `tools` web search | 转为 Responses 网络搜索工具 |
| `tool_choice` | `tool_choice` + `parallel_tool_calls` | `auto` / `any` / `none` → `auto` / `required` / `none` |
| `thinking` | `reasoning` | budget 映射为 effort |
| `output_config.format` | `text.format` | JSON Schema 输出格式 |
| `metadata.user_id` | `metadata.user_id` | 原样传递 |
| `service_tier` | `service_tier` | 原样传递 |
| `stream` | `stream` | 原样传递 |

不转换：`stop_sequences`、`top_k`。

### Messages → Gemini

| Messages 字段 | Gemini 字段 | 说明 |
| --- | --- | --- |
| `model` | `model` | 原样传递 |
| `system` | `config.systemInstruction` | 字符串或文本块 |
| `messages` user | `contents[]` user | 文本、图片、document、`tool_result` |
| `messages` assistant | `contents[]` model | 文本、`tool_use`、Gemini thought signature |
| `max_tokens` | `config.maxOutputTokens` | 最大输出 token |
| `temperature` | `config.temperature` | 原样传递 |
| `top_p` | `config.topP` | 字段名转换 |
| `top_k` | `config.topK` | 字段名转换 |
| `stop_sequences` | `config.stopSequences` | 停止序列 |
| `tools` `input_schema` | `config.tools[].functionDeclarations` | 使用 `parametersJsonSchema` |
| `tools` web search | `config.tools[].googleSearch` | 转为 Google Search |
| `tool_choice` | `config.toolConfig.functionCallingConfig` | `auto` / `any` / `none` → `AUTO` / `ANY` / `NONE`；命名工具使用 `allowedFunctionNames` |
| `thinking` | `config.thinkingConfig` | disabled → `thinkingBudget: 0`；enabled → budget 原样传递 |
| `output_config.format` | `config.responseMimeType` + `config.responseJsonSchema` | JSON Schema 输出格式 |

不转换：`metadata`。

Document block 转换规则：

- `source.type: "base64"` → `inlineData`
- `source.type: "url"` → `fileData`
- `source.type: "text"` → `text`
- 其它来源 → 不支持占位文本

## Responses 请求转换

### Responses → Chat Completions

| Responses 字段 | Chat Completions 字段 | 说明 |
| --- | --- | --- |
| `model` | `model` | 原样传递 |
| `instructions` | `messages[]` system | 系统指令 |
| `input` | `messages` | 转为 Chat Completions messages |
| `max_output_tokens` | `max_completion_tokens` | 最大输出 token |
| `temperature` | `temperature` | 原样传递 |
| `top_p` | `top_p` | 原样传递 |
| `tools` function | `tools` function | 工具定义 |
| `tools` web search | `web_search_options` | 转为 Chat Completions 网络搜索参数 |
| `tool_choice` | `tool_choice` | 支持 `auto` / `required` / `none` 与命名函数 |
| `parallel_tool_calls` | `parallel_tool_calls` | 原样传递 |
| `reasoning.effort` | `reasoning_effort` | 原样传递 |
| `text.format` | `response_format` | JSON / JSON Schema 输出格式 |
| `text.verbosity` | `verbosity` | 作为扩展字段传递 |
| `metadata` | `metadata` | 原样传递 |
| `service_tier` | `service_tier` | 原样传递 |
| `prompt_cache_key` | `prompt_cache_key` | 原样传递 |
| `prompt_cache_retention` | `prompt_cache_retention` | 原样传递 |
| `safety_identifier` | `safety_identifier` | 原样传递 |
| `include` logprobs | `top_logprobs` | 设置为 `20` |
| `stream` | `stream` + `stream_options` | 流式配置 |

不转换：`previous_response_id`。

### Responses → Messages

| Responses 字段 | Messages 字段 | 说明 |
| --- | --- | --- |
| `model` | `model` | 原样传递 |
| `instructions` | `system` | 系统指令 |
| `input` | `messages` | 转为 Anthropic messages |
| `max_output_tokens` | `max_tokens` | 未传时默认 `4096` |
| `temperature` | `temperature` | 原样传递 |
| `top_p` | `top_p` | 原样传递 |
| `tools` function | `tools` `input_schema` | 工具定义 |
| `tools` web search | `tools` `web_search_20250305` | 转为 Anthropic web search 工具 |
| `tool_choice` + `parallel_tool_calls` | `tool_choice` | `auto` / `required` / `none` → `auto` / `any` / `none`；`parallel_tool_calls: false` → `disable_parallel_tool_use: true` |
| `reasoning.effort` | `thinking` | `low` / `medium` / `high` → 2048 / 5120 / 10240 budget tokens |
| `text.format` `json_schema` | `output_config.format` | JSON Schema 输出格式 |
| `metadata.user_id` | `metadata.user_id` | 原样传递 |
| `service_tier` | `service_tier` | 仅传递 `auto` / `standard_only` |
| `stream` | `stream` | 原样传递 |

不转换：`previous_response_id`、`prompt_cache_key`、`prompt_cache_retention`、`safety_identifier`。

### Responses → Gemini

| Responses 字段 | Gemini 字段 | 说明 |
| --- | --- | --- |
| `model` | `model` | 原样传递 |
| `instructions` | `config.systemInstruction` | 系统指令 |
| `input` | `contents` | 转为 Gemini contents |
| `max_output_tokens` | `config.maxOutputTokens` | 最大输出 token |
| `temperature` | `config.temperature` | 原样传递 |
| `top_p` | `config.topP` | 字段名转换 |
| `tools` function | `config.tools[].functionDeclarations` | 使用 `parametersJsonSchema` |
| `tools` web search | `config.tools[].googleSearch` | 转为 Google Search |
| `tool_choice` | `config.toolConfig.functionCallingConfig` | `auto` / `required` / `none` → `AUTO` / `ANY` / `NONE`；命名函数使用 `allowedFunctionNames` |
| `reasoning.effort` | `config.thinkingConfig` | `low` / `medium` / `high` → 2048 / 5120 / 10240 budget |
| `text.format` | `config.responseMimeType` + `config.responseJsonSchema` | JSON / JSON Schema 输出格式 |
| `include` logprobs | `config.responseLogprobs` + `config.logprobs` | Logprobs 输出 |

不转换：`metadata`、`previous_response_id`、`parallel_tool_calls`、`prompt_cache_key`、`prompt_cache_retention`、`safety_identifier`。

## Gemini 请求转换

### Gemini → Chat Completions

| Gemini 字段 | Chat Completions 字段 | 说明 |
| --- | --- | --- |
| `model` | `model` | 原样传递 |
| `config.systemInstruction` | `messages[]` system | 系统指令 |
| `contents` | `messages` | `user` / `model` → `user` / `assistant` |
| `config.maxOutputTokens` | `max_completion_tokens` | 最大输出 token |
| `config.temperature` | `temperature` | 原样传递 |
| `config.topP` | `top_p` | 字段名转换 |
| `config.stopSequences` | `stop` | 停止序列 |
| `config.seed` | `seed` | 原样传递 |
| `config.frequencyPenalty` | `frequency_penalty` | 字段名转换 |
| `config.presencePenalty` | `presence_penalty` | 字段名转换 |
| `config.candidateCount` | `n` | 候选数量 |
| `config.responseLogprobs` | `logprobs` | 是否返回 logprobs |
| `config.logprobs` | `top_logprobs` | top logprobs 数量 |
| `config.tools[].functionDeclarations` | `tools` function | 工具定义 |
| `config.tools[].googleSearch` | `web_search_options` | 网络搜索参数 |
| `config.toolConfig` | `tool_choice` | `AUTO` / `ANY` / `NONE` → `auto` / `required` / `none`；单个 `allowedFunctionNames` 转命名函数 |
| `config.responseMimeType` + `responseJsonSchema` | `response_format` | JSON / JSON Schema 输出格式 |
| `config.thinkingConfig` | `reasoning_effort` | `thinkingBudget: 0` → `none`；≤2048 / ≤5120 / >5120 → `low` / `medium` / `high` |

不转换：`config.safetySettings`、`config.cachedContent`、`config.responseModalities`。

### Gemini → Messages

| Gemini 字段 | Messages 字段 | 说明 |
| --- | --- | --- |
| `model` | `model` | 原样传递 |
| `config.systemInstruction` | `system` | 系统指令 |
| `contents` | `messages` | `user` / `model` → `user` / `assistant` |
| `config.maxOutputTokens` | `max_tokens` | 未传时默认 `4096` |
| `config.temperature` | `temperature` | 原样传递 |
| `config.topP` | `top_p` | 字段名转换 |
| `config.topK` | `top_k` | 字段名转换 |
| `config.stopSequences` | `stop_sequences` | 停止序列 |
| `config.tools[].functionDeclarations` | `tools` `input_schema` | 工具定义 |
| `config.tools[].googleSearch` | `tools` `web_search_20250305` | 转为 Anthropic web search 工具 |
| `config.toolConfig` | `tool_choice` | `AUTO` / `ANY` / `NONE` → `auto` / `any` / `none`；单个 `allowedFunctionNames` 转命名工具 |
| `config.thinkingConfig` | `thinking` | budget 原样传递；`0` 表示 disabled |
| `config.responseMimeType` + `responseJsonSchema` | `output_config` | JSON Schema 输出格式 |

不转换：`config.seed`、`config.frequencyPenalty`、`config.presencePenalty`、`config.candidateCount`、`config.safetySettings`、`config.cachedContent`。

### Gemini → Responses

| Gemini 字段 | Responses 字段 | 说明 |
| --- | --- | --- |
| `model` | `model` | 原样传递 |
| `config.systemInstruction` | `instructions` | 系统指令 |
| `contents` | `input` | 转为 Responses input item |
| `config.maxOutputTokens` | `max_output_tokens` | 最大输出 token |
| `config.temperature` | `temperature` | 原样传递 |
| `config.topP` | `top_p` | 字段名转换 |
| `config.tools[].functionDeclarations` | `tools` function | 工具定义 |
| `config.tools[].googleSearch` | `tools` `web_search_preview` | 转为 Responses 网络搜索工具 |
| `config.toolConfig` | `tool_choice` | `AUTO` / `ANY` / `NONE` → `auto` / `required` / `none` |
| `config.thinkingConfig` | `reasoning` | budget 映射为 effort |
| `config.responseMimeType` + `responseJsonSchema` | `text.format` | JSON / JSON Schema 输出格式 |

不转换：`config.seed`、`config.frequencyPenalty`、`config.presencePenalty`、`config.candidateCount`、`config.safetySettings`、`config.cachedContent`。

## 响应字段转换

| 来源响应 | 目标响应 | 内容字段 | 工具调用字段 | 推理字段 | 结束原因 |
| --- | --- | --- | --- | --- | --- |
| Messages | Chat Completions | `content[]` text → `choices[0].message.content` | `tool_use` → `tool_calls` | `thinking` → `reasoning` + `reasoning_details` | `end_turn` / `tool_use` / `max_tokens` / `refusal` → `stop` / `tool_calls` / `length` / `content_filter` |
| Responses | Chat Completions | `output[]` message output_text → `choices[0].message.content` | `function_call` → `tool_calls` | `reasoning` → `reasoning` + `reasoning_details` | `completed` / `incomplete` / `failed` → `stop` / `length` / `stop`；content filter 会转为 `content_filter` |
| Gemini | Chat Completions | `parts[].text` → `choices[0].message.content` | `functionCall` → `tool_calls` | `thought` → `reasoning` + `reasoning_details` | `STOP` / `MAX_TOKENS` / `SAFETY` → `stop` / `length` / `content_filter` |
| Chat Completions | Messages | `message.content` → `content[]` text | `tool_calls` → `tool_use` | `reasoning` → `thinking` | `stop` / `tool_calls` / `length` / `content_filter` → `end_turn` / `tool_use` / `max_tokens` / `refusal` |
| Responses | Messages | `output[]` message → `content[]` text | `function_call` → `tool_use` | `reasoning` → `thinking` | `completed` / `incomplete` / `failed` → `end_turn` / `max_tokens` / `end_turn` |
| Gemini | Messages | `parts[].text` → `content[]` text | `functionCall` → `tool_use` | `thought` → `thinking` | `STOP` / `MAX_TOKENS` / `SAFETY` → `end_turn` / `max_tokens` / `refusal` |
| Chat Completions | Responses | `message.content` → `output[]` message output_text | `tool_calls` → `function_call` | `reasoning` → `output[]` reasoning | `stop` / `tool_calls` / `length` / `content_filter` → `completed` / `completed` / `incomplete` / `failed` |
| Messages | Responses | `content[]` text → `output[]` message output_text | `tool_use` → `function_call` | `thinking` → `output[]` reasoning | `end_turn` / `max_tokens` / `refusal` → `completed` / `incomplete` / `failed` |
| Gemini | Responses | `parts[].text` → `output[]` message output_text | `functionCall` → `function_call` | `thought` → `output[]` reasoning | `STOP` / `MAX_TOKENS` / `SAFETY` → `completed` / `incomplete` / `failed` |
| Chat Completions | Gemini | `message.content` → `parts[].text` | `tool_calls` → `functionCall` | `reasoning` → `parts[].thought` | `stop` / `tool_calls` / `length` / `content_filter` → `STOP` / `STOP` / `MAX_TOKENS` / `SAFETY` |
| Messages | Gemini | `content[]` text → `parts[].text` | `tool_use` → `functionCall` | `thinking` → `parts[].thought` | `end_turn` / `max_tokens` / `refusal` → `STOP` / `MAX_TOKENS` / `SAFETY` |
| Responses | Gemini | `output[]` message output_text → `parts[].text` | `function_call` → `functionCall` | `reasoning` → `parts[].thought` | `completed` / `incomplete` / `failed` → `STOP` / `MAX_TOKENS` / `SAFETY` |

## 用量字段转换

| 来源协议 | 目标协议 | 主要映射 |
| --- | --- | --- |
| Messages | Chat Completions | `usage.input_tokens` → `prompt_tokens`；`usage.output_tokens` → `completion_tokens`；`cache_read_input_tokens` → `prompt_tokens_details.cached_tokens`；`server_tool_use.web_search_requests` → `prompt_tokens_details.web_search` |
| Responses | Chat Completions | `usage.input_tokens` / `output_tokens` / `total_tokens` 对应映射；cached tokens 与 reasoning tokens 会映射到 OpenAI style details |
| Gemini | Chat Completions | `promptTokenCount + toolUsePromptTokenCount` → `prompt_tokens`；`candidatesTokenCount + thoughtsTokenCount` → `completion_tokens`；`cachedContentTokenCount` → cached tokens；`thoughtsTokenCount` → reasoning tokens |
| Chat Completions | Messages | `prompt_tokens` → `input_tokens`；`completion_tokens` → `output_tokens`；cached tokens 与 web search 计数会映射到 Anthropic usage 扩展字段 |
| Responses | Messages | cached tokens → `cache_read_input_tokens`；web search call 会统计到 `server_tool_use` |
| Gemini | Messages | `promptTokenCount + toolUsePromptTokenCount` → `input_tokens`；`candidatesTokenCount + thoughtsTokenCount` → `output_tokens`；`cachedContentTokenCount` → `cache_read_input_tokens` |
| Chat Completions | Responses | cached tokens、reasoning tokens 映射到 Responses usage；web search call 会计数 |
| Messages | Responses | `input_tokens` / `output_tokens` 对应映射；`cache_read_input_tokens` → cached tokens |
| Gemini | Responses | Gemini `usageMetadata` 对应映射；tool-use prompt tokens 与 thoughts tokens 会合并到对应计数 |
| Chat Completions | Gemini | cached tokens → `cachedContentTokenCount`；reasoning tokens → `thoughtsTokenCount` |
| Messages | Gemini | `cache_read_input_tokens` → `cachedContentTokenCount` |
| Responses | Gemini | cached tokens → `cachedContentTokenCount`；reasoning tokens → `thoughtsTokenCount` |

## 流式转换能力

所有 12 组转换都支持流式输出。不同协议的事件名不同，但以下内容会尽量保留：

| 内容类型 | 转换说明 |
| --- | --- |
| 文本增量 | 保留为目标协议的文本 delta |
| 工具调用增量 | 保留工具名、工具调用 ID 与参数增量；目标协议不支持完全等价事件时会合并为最接近的事件 |
| 推理 / Thinking 增量 | `reasoning`、`thinking_delta`、Gemini thought 会互转 |
| 网络搜索 / Grounding | Responses web search、Anthropic `web_search_tool_result`、Gemini grounding metadata 与 Chat Completions annotations 会尽量互转 |
| Usage | 如果上游流式尾包提供 usage，会转换为目标协议的 usage 事件或尾包字段 |

## 常见差异与注意事项

- Responses 没有 `stop` / `stop_sequences` 的直接等价请求字段，从 Chat Completions 或 Messages 转到 Responses 时不会转换停止序列。
- Gemini 不支持 `parallel_tool_calls`、`metadata`、`service_tier`、prompt cache key 等 OpenAI / Anthropic 扩展参数。
- Anthropic Messages 的 `top_k` 只在转 Gemini 时保留；转 Chat Completions 或 Responses 时不会转换。
- Chat Completions 的 `seed`、`frequency_penalty`、`presence_penalty`、`n` 主要可以转 Gemini；转 Messages / Responses 时没有等价字段。
- `reasoning_effort` 与 `thinking` 的映射是区间映射，不是精确 token 上限保真；需要精确控制 thinking budget 时，优先使用目标协议的原生参数。
- 工具结果里的图片 / document 在转 Chat Completions tool role 时会被跳过，因为 OpenAI tool role 只接收文本内容。
- 协议转换会尽量保留 web search / grounding 结果，但不同协议的引用结构不同，字段名与嵌套层级会变化。
