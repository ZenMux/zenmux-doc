---
pageClass: api-reference-page
title: Protocol Conversion Compatibility
head:
  - - meta
    - name: description
      content: Protocol conversion parameter compatibility
  - - meta
    - name: keywords
      content: Zenmux, API, protocol, conversion, compatibility, OpenAI, Anthropic, Gemini, Responses
---

# Protocol Conversion Compatibility

::: info Troubleshooting
Encountering errors? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting steps.
:::

ZenMux lets you call the same model catalog through different API protocols. This page explains how common request parameters, response fields, and streaming events are mapped when requests are converted across protocols, and which fields do not have an equivalent in the target protocol.

This page is based on the conversion behavior in [ZenMux/rosetta-ai](https://github.com/ZenMux/rosetta-ai). rosetta-ai covers all 12 pairwise converters between OpenAI Chat Completions, OpenAI Responses, Anthropic Messages, and Google Gemini.

## Protocol Names

| Short name | Protocol | ZenMux API reference |
| --- | --- | --- |
| Chat Completions | OpenAI Chat Completions | [Create a Chat Completion](/api/openai/create-chat-completion) |
| Responses | OpenAI Responses | [Create a Model Response](/api/openai/openai-responses) |
| Messages | Anthropic Messages | [Create a Message](/api/anthropic/create-messages) |
| Gemini | Google Gemini / Vertex AI Generate Content | [Generate Content](/api/vertexai/generate-content) |

## Support Overview

Read this table from the source protocol perspective. For example, the `Chat Completions` column shows where a field can be converted when your request starts in the OpenAI Chat Completions format.

| Field category | Chat Completions | Messages | Responses | Gemini |
| --- | --- | --- | --- | --- |
| Model `model` | All | All | All | All |
| System / instructions | All | All | All | All |
| `temperature` | All | All | All | All |
| `top_p` | All | All | All | All |
| `top_k` | Not supported | Gemini | Not supported | Messages |
| Max tokens | All | All | All | All |
| Stop sequences | Messages / Gemini | Chat Completions / Gemini | Not supported | Chat Completions / Messages |
| Function tools | All | All | All | All |
| `tool_choice` | All | All | All | All |
| Web search | All | All | All | All |
| Reasoning / thinking | All | All | All | All |
| JSON response format | All | All | All | All |
| Image input | Messages / Gemini | Chat Completions / Gemini | Gemini | Chat Completions / Messages |
| Documents / files | Messages / Gemini | Chat Completions / Gemini | Not supported | Chat Completions / Messages |
| Audio input | Gemini | Not supported | Not supported | Not supported |
| `seed` | Gemini | Not supported | Not supported | Chat Completions |
| `frequency_penalty` | Gemini | Not supported | Not supported | Chat Completions |
| `presence_penalty` | Gemini | Not supported | Not supported | Chat Completions |
| Candidate count `n` / `candidateCount` | Gemini | Not supported | Not supported | Chat Completions |
| Logprobs | Responses / Gemini | Not supported | Gemini | Chat Completions / Responses |
| Parallel tool calls | Messages / Responses | Chat Completions / Responses | Chat Completions / Messages | Not supported |
| Metadata / user | Messages / Responses | Chat Completions / Responses | Messages / Chat Completions | Not supported |
| `service_tier` | Messages / Responses | Chat Completions / Responses | Chat Completions / Messages | Not supported |
| Prompt cache key | Responses | Not supported | Chat Completions | Not supported |
| Streaming | All | All | All | All |

::: warning Model support still applies
Protocol conversion only maps field shapes. It does not guarantee that every model supports the resulting capability. For exact support, check the supported parameters on the model detail page.
:::

## Chat Completions Request Conversion

### Chat Completions → Messages

| Chat Completions field | Messages field | Notes |
| --- | --- | --- |
| `model` | `model` | Passed through |
| `messages` `system` / `developer` | `system` | Joined as text blocks |
| `messages` `user` | `messages[]` user | Text and images are supported; `file` content parts become an unsupported placeholder text |
| `messages` `assistant` | `messages[]` assistant | Text, `tool_use`, and thinking blocks |
| `messages` `tool` | `messages[]` user `tool_result` | Converted to tool result blocks |
| `max_tokens` / `max_completion_tokens` | `max_tokens` | Defaults to `4096` when omitted |
| `temperature` | `temperature` | Passed through |
| `top_p` | `top_p` | Passed through |
| `stop` | `stop_sequences` | String values become arrays |
| `tools` function | `tools` `input_schema` | JSON Schema becomes Anthropic tool schema |
| `web_search_options` | `tools` `web_search_20250305` | Converted to Anthropic web search tool |
| `tool_choice` | `tool_choice` | `auto` / `required` / `none` → `auto` / `any` / `none`; named functions become `tool` choices |
| `parallel_tool_calls` | `tool_choice.disable_parallel_tool_use` | Inverted semantics: `false` → `true` |
| `response_format` `json_schema` | `output_config.format` | JSON Schema output constraint |
| `response_format` `json_object` | `output_config.format` | JSON output format |
| `reasoning_effort` | `thinking` | `none` / `minimal` → disabled; `low` / `medium` / `high` → 2048 / 5120 / 10240 budget tokens |
| `user` | `metadata.user_id` | User identifier |
| `service_tier` | `service_tier` | Only `auto` / `standard_only` are forwarded |
| `stream` | `stream` | Passed through |

Not converted: `frequency_penalty`, `presence_penalty`, `seed`, `n`, `logprobs`, `top_logprobs`, `logit_bias`.

### Chat Completions → Responses

| Chat Completions field | Responses field | Notes |
| --- | --- | --- |
| `model` | `model` | Passed through |
| `messages` | `input` | Converted to Responses input items |
| `max_completion_tokens` | `max_output_tokens` | Max output tokens |
| `temperature` | `temperature` | Passed through |
| `top_p` | `top_p` | Passed through |
| `tools` function | `tools` function | Function tool definitions |
| `web_search_options` | `tools` `web_search` | Converted to Responses web search tool |
| `tool_choice` | `tool_choice` | Supports `auto` / `required` / `none` and named functions |
| `parallel_tool_calls` | `parallel_tool_calls` | Passed through |
| `response_format` | `text.format` | JSON / JSON Schema output format |
| `reasoning_effort` | `reasoning.effort` | Effort is passed through |
| `top_logprobs` | `include` | Requests logprobs-related output |
| `metadata` | `metadata` | Passed through |
| `service_tier` | `service_tier` | Passed through |
| `prompt_cache_key` | `prompt_cache_key` | Passed through |
| `prompt_cache_retention` | `prompt_cache_retention` | Passed through |
| `stream` | `stream` + `stream_options` | Streaming options |

Not converted: `frequency_penalty`, `presence_penalty`, `seed`, `n`, `logprobs`, `stop`.

### Chat Completions → Gemini

| Chat Completions field | Gemini field | Notes |
| --- | --- | --- |
| `model` | `model` | Passed through |
| `messages` `system` / `developer` | `config.systemInstruction` | System instruction |
| `messages` `user` / `assistant` / `tool` | `contents` | `assistant` becomes Gemini `model` role |
| `max_tokens` / `max_completion_tokens` | `config.maxOutputTokens` | Max output tokens |
| `temperature` | `config.temperature` | Passed through |
| `top_p` | `config.topP` | Field rename |
| `stop` | `config.stopSequences` | Stop sequences |
| `seed` | `config.seed` | Passed through |
| `frequency_penalty` | `config.frequencyPenalty` | Field rename |
| `presence_penalty` | `config.presencePenalty` | Field rename |
| `n` | `config.candidateCount` | Candidate count |
| `logprobs` | `config.responseLogprobs` | Whether to return logprobs |
| `top_logprobs` | `config.logprobs` | Number of top logprobs |
| `tools` function | `config.tools[].functionDeclarations` | Uses `parametersJsonSchema` |
| `web_search_options` | `config.tools[].googleSearch` | Converted to Google Search |
| `tool_choice` | `config.toolConfig.functionCallingConfig` | `auto` / `required` / `none` → `AUTO` / `ANY` / `NONE`; named functions use `allowedFunctionNames` |
| `response_format` `json_schema` | `config.responseMimeType` + `config.responseJsonSchema` | `responseMimeType` is `application/json` |
| `response_format` `json_object` | `config.responseMimeType` | `application/json` |
| `reasoning_effort` | `config.thinkingConfig` | `none` / `minimal` → `thinkingBudget: 0`; `low` / `medium` / `high` / `xhigh` → 2048 / 5120 / 10240 / 20480 |
| `image_url` base64 | `inlineData` | Image bytes |
| `image_url` URL | `fileData` | Image URL |
| `file` content part | `inlineData` / `fileData` | File input |
| `input_audio` | `inlineData` | Audio input |

Not converted: `logit_bias`, `user`.

## Messages Request Conversion

### Messages → Chat Completions

| Messages field | Chat Completions field | Notes |
| --- | --- | --- |
| `model` | `model` | Passed through |
| `system` | `messages[]` system | String or `TextBlockParam[]` is joined as text |
| `messages` user | `messages[]` user | Text, image, document, and `tool_result` |
| `messages` assistant | `messages[]` assistant | Text, thinking, and `tool_use` |
| `max_tokens` | `max_completion_tokens` | Uses the newer field for reasoning models |
| `temperature` | `temperature` | Passed through |
| `top_p` | `top_p` | Passed through |
| `stop_sequences` | `stop` | Field rename |
| `tools` `input_schema` | `tools` function | JSON Schema tools |
| `tools` `web_search_20250305` / `web_search_20260209` | `web_search_options` | `max_uses` and `user_location` are mapped where possible |
| `tool_choice` | `tool_choice` + `parallel_tool_calls` | `auto` / `any` / `none` → `auto` / `required` / `none`; `disable_parallel_tool_use: true` → `parallel_tool_calls: false` |
| `output_config.format` | `response_format` | JSON / JSON Schema output format |
| `thinking` | `reasoning_effort` | disabled → `none`; enabled budget ≤2048 / ≤5120 / ≤10240 → `low` / `medium` / `high` |
| `metadata.user_id` | `user` | User identifier |
| `service_tier` | `service_tier` | `standard_only` → `default` |
| `stream` | `stream` + `stream_options` | Includes usage by default |

Document block conversion:

- `source.type: "base64"` / `"url"` → Chat Completions `file` content part
- `source.type: "text"` → text content part
- `source.type: "content"` → nested text / image blocks are unpacked

`tool_result` content conversion:

- `text` is preserved
- `search_result` inner text is flattened
- `tool_reference` keeps the tool name
- Images and documents are skipped because the OpenAI tool role only accepts text content

Not converted: `top_k`, Anthropic-specific metadata fields.

### Messages → Responses

| Messages field | Responses field | Notes |
| --- | --- | --- |
| `model` | `model` | Passed through |
| `system` | `instructions` | Joined text |
| `messages` | `input` | Converted to Responses input items |
| `max_tokens` | `max_output_tokens` | Max output tokens |
| `temperature` | `temperature` | Passed through |
| `top_p` | `top_p` | Passed through |
| `tools` `input_schema` | `tools` function | Tool definitions |
| `tools` web search | `tools` web search | Converted to Responses web search tool |
| `tool_choice` | `tool_choice` + `parallel_tool_calls` | `auto` / `any` / `none` → `auto` / `required` / `none` |
| `thinking` | `reasoning` | Budget is mapped to effort |
| `output_config.format` | `text.format` | JSON Schema output format |
| `metadata.user_id` | `metadata.user_id` | Passed through |
| `service_tier` | `service_tier` | Passed through |
| `stream` | `stream` | Passed through |

Not converted: `stop_sequences`, `top_k`.

### Messages → Gemini

| Messages field | Gemini field | Notes |
| --- | --- | --- |
| `model` | `model` | Passed through |
| `system` | `config.systemInstruction` | String or text blocks |
| `messages` user | `contents[]` user | Text, image, document, and `tool_result` |
| `messages` assistant | `contents[]` model | Text, `tool_use`, and Gemini thought signature |
| `max_tokens` | `config.maxOutputTokens` | Max output tokens |
| `temperature` | `config.temperature` | Passed through |
| `top_p` | `config.topP` | Field rename |
| `top_k` | `config.topK` | Field rename |
| `stop_sequences` | `config.stopSequences` | Stop sequences |
| `tools` `input_schema` | `config.tools[].functionDeclarations` | Uses `parametersJsonSchema` |
| `tools` web search | `config.tools[].googleSearch` | Converted to Google Search |
| `tool_choice` | `config.toolConfig.functionCallingConfig` | `auto` / `any` / `none` → `AUTO` / `ANY` / `NONE`; named tools use `allowedFunctionNames` |
| `thinking` | `config.thinkingConfig` | disabled → `thinkingBudget: 0`; enabled → budget is passed through |
| `output_config.format` | `config.responseMimeType` + `config.responseJsonSchema` | JSON Schema output format |

Not converted: `metadata`.

Document block conversion:

- `source.type: "base64"` → `inlineData`
- `source.type: "url"` → `fileData`
- `source.type: "text"` → `text`
- Other sources → unsupported placeholder text

## Responses Request Conversion

### Responses → Chat Completions

| Responses field | Chat Completions field | Notes |
| --- | --- | --- |
| `model` | `model` | Passed through |
| `instructions` | `messages[]` system | System instruction |
| `input` | `messages` | Converted to Chat Completions messages |
| `max_output_tokens` | `max_completion_tokens` | Max output tokens |
| `temperature` | `temperature` | Passed through |
| `top_p` | `top_p` | Passed through |
| `tools` function | `tools` function | Tool definitions |
| `tools` web search | `web_search_options` | Converted to Chat Completions web search options |
| `tool_choice` | `tool_choice` | Supports `auto` / `required` / `none` and named functions |
| `parallel_tool_calls` | `parallel_tool_calls` | Passed through |
| `reasoning.effort` | `reasoning_effort` | Passed through |
| `text.format` | `response_format` | JSON / JSON Schema output format |
| `text.verbosity` | `verbosity` | Passed as an extension field |
| `metadata` | `metadata` | Passed through |
| `service_tier` | `service_tier` | Passed through |
| `prompt_cache_key` | `prompt_cache_key` | Passed through |
| `prompt_cache_retention` | `prompt_cache_retention` | Passed through |
| `safety_identifier` | `safety_identifier` | Passed through |
| `include` logprobs | `top_logprobs` | Set to `20` |
| `stream` | `stream` + `stream_options` | Streaming options |

Not converted: `previous_response_id`.

### Responses → Messages

| Responses field | Messages field | Notes |
| --- | --- | --- |
| `model` | `model` | Passed through |
| `instructions` | `system` | System instruction |
| `input` | `messages` | Converted to Anthropic messages |
| `max_output_tokens` | `max_tokens` | Defaults to `4096` when omitted |
| `temperature` | `temperature` | Passed through |
| `top_p` | `top_p` | Passed through |
| `tools` function | `tools` `input_schema` | Tool definitions |
| `tools` web search | `tools` `web_search_20250305` | Converted to Anthropic web search tool |
| `tool_choice` + `parallel_tool_calls` | `tool_choice` | `auto` / `required` / `none` → `auto` / `any` / `none`; `parallel_tool_calls: false` → `disable_parallel_tool_use: true` |
| `reasoning.effort` | `thinking` | `low` / `medium` / `high` → 2048 / 5120 / 10240 budget tokens |
| `text.format` `json_schema` | `output_config.format` | JSON Schema output format |
| `metadata.user_id` | `metadata.user_id` | Passed through |
| `service_tier` | `service_tier` | Only `auto` / `standard_only` are forwarded |
| `stream` | `stream` | Passed through |

Not converted: `previous_response_id`, `prompt_cache_key`, `prompt_cache_retention`, `safety_identifier`.

### Responses → Gemini

| Responses field | Gemini field | Notes |
| --- | --- | --- |
| `model` | `model` | Passed through |
| `instructions` | `config.systemInstruction` | System instruction |
| `input` | `contents` | Converted to Gemini contents |
| `max_output_tokens` | `config.maxOutputTokens` | Max output tokens |
| `temperature` | `config.temperature` | Passed through |
| `top_p` | `config.topP` | Field rename |
| `tools` function | `config.tools[].functionDeclarations` | Uses `parametersJsonSchema` |
| `tools` web search | `config.tools[].googleSearch` | Converted to Google Search |
| `tool_choice` | `config.toolConfig.functionCallingConfig` | `auto` / `required` / `none` → `AUTO` / `ANY` / `NONE`; named functions use `allowedFunctionNames` |
| `reasoning.effort` | `config.thinkingConfig` | `low` / `medium` / `high` → 2048 / 5120 / 10240 budget |
| `text.format` | `config.responseMimeType` + `config.responseJsonSchema` | JSON / JSON Schema output format |
| `include` logprobs | `config.responseLogprobs` + `config.logprobs` | Logprobs output |

Not converted: `metadata`, `previous_response_id`, `parallel_tool_calls`, `prompt_cache_key`, `prompt_cache_retention`, `safety_identifier`.

## Gemini Request Conversion

### Gemini → Chat Completions

| Gemini field | Chat Completions field | Notes |
| --- | --- | --- |
| `model` | `model` | Passed through |
| `config.systemInstruction` | `messages[]` system | System instruction |
| `contents` | `messages` | `user` / `model` → `user` / `assistant` |
| `config.maxOutputTokens` | `max_completion_tokens` | Max output tokens |
| `config.temperature` | `temperature` | Passed through |
| `config.topP` | `top_p` | Field rename |
| `config.stopSequences` | `stop` | Stop sequences |
| `config.seed` | `seed` | Passed through |
| `config.frequencyPenalty` | `frequency_penalty` | Field rename |
| `config.presencePenalty` | `presence_penalty` | Field rename |
| `config.candidateCount` | `n` | Candidate count |
| `config.responseLogprobs` | `logprobs` | Whether to return logprobs |
| `config.logprobs` | `top_logprobs` | Number of top logprobs |
| `config.tools[].functionDeclarations` | `tools` function | Tool definitions |
| `config.tools[].googleSearch` | `web_search_options` | Web search options |
| `config.toolConfig` | `tool_choice` | `AUTO` / `ANY` / `NONE` → `auto` / `required` / `none`; single `allowedFunctionNames` becomes a named function |
| `config.responseMimeType` + `responseJsonSchema` | `response_format` | JSON / JSON Schema output format |
| `config.thinkingConfig` | `reasoning_effort` | `thinkingBudget: 0` → `none`; ≤2048 / ≤5120 / >5120 → `low` / `medium` / `high` |

Not converted: `config.safetySettings`, `config.cachedContent`, `config.responseModalities`.

### Gemini → Messages

| Gemini field | Messages field | Notes |
| --- | --- | --- |
| `model` | `model` | Passed through |
| `config.systemInstruction` | `system` | System instruction |
| `contents` | `messages` | `user` / `model` → `user` / `assistant` |
| `config.maxOutputTokens` | `max_tokens` | Defaults to `4096` when omitted |
| `config.temperature` | `temperature` | Passed through |
| `config.topP` | `top_p` | Field rename |
| `config.topK` | `top_k` | Field rename |
| `config.stopSequences` | `stop_sequences` | Stop sequences |
| `config.tools[].functionDeclarations` | `tools` `input_schema` | Tool definitions |
| `config.tools[].googleSearch` | `tools` `web_search_20250305` | Converted to Anthropic web search tool |
| `config.toolConfig` | `tool_choice` | `AUTO` / `ANY` / `NONE` → `auto` / `any` / `none`; single `allowedFunctionNames` becomes a named tool |
| `config.thinkingConfig` | `thinking` | Budget is passed through; `0` means disabled |
| `config.responseMimeType` + `responseJsonSchema` | `output_config` | JSON Schema output format |

Not converted: `config.seed`, `config.frequencyPenalty`, `config.presencePenalty`, `config.candidateCount`, `config.safetySettings`, `config.cachedContent`.

### Gemini → Responses

| Gemini field | Responses field | Notes |
| --- | --- | --- |
| `model` | `model` | Passed through |
| `config.systemInstruction` | `instructions` | System instruction |
| `contents` | `input` | Converted to Responses input items |
| `config.maxOutputTokens` | `max_output_tokens` | Max output tokens |
| `config.temperature` | `temperature` | Passed through |
| `config.topP` | `top_p` | Field rename |
| `config.tools[].functionDeclarations` | `tools` function | Tool definitions |
| `config.tools[].googleSearch` | `tools` `web_search_preview` | Converted to Responses web search tool |
| `config.toolConfig` | `tool_choice` | `AUTO` / `ANY` / `NONE` → `auto` / `required` / `none` |
| `config.thinkingConfig` | `reasoning` | Budget is mapped to effort |
| `config.responseMimeType` + `responseJsonSchema` | `text.format` | JSON / JSON Schema output format |

Not converted: `config.seed`, `config.frequencyPenalty`, `config.presencePenalty`, `config.candidateCount`, `config.safetySettings`, `config.cachedContent`.

## Response Field Conversion

| Source response | Target response | Content field | Tool call field | Reasoning field | Finish reason |
| --- | --- | --- | --- | --- | --- |
| Messages | Chat Completions | `content[]` text → `choices[0].message.content` | `tool_use` → `tool_calls` | `thinking` → `reasoning` + `reasoning_details` | `end_turn` / `tool_use` / `max_tokens` / `refusal` → `stop` / `tool_calls` / `length` / `content_filter` |
| Responses | Chat Completions | `output[]` message output_text → `choices[0].message.content` | `function_call` → `tool_calls` | `reasoning` → `reasoning` + `reasoning_details` | `completed` / `incomplete` / `failed` → `stop` / `length` / `stop`; content filter becomes `content_filter` |
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

## Usage Field Conversion

| Source protocol | Target protocol | Main mapping |
| --- | --- | --- |
| Messages | Chat Completions | `usage.input_tokens` → `prompt_tokens`; `usage.output_tokens` → `completion_tokens`; `cache_read_input_tokens` → `prompt_tokens_details.cached_tokens`; `server_tool_use.web_search_requests` → `prompt_tokens_details.web_search` |
| Responses | Chat Completions | `usage.input_tokens` / `output_tokens` / `total_tokens` are mapped directly; cached tokens and reasoning tokens are mapped to OpenAI-style detail fields |
| Gemini | Chat Completions | `promptTokenCount + toolUsePromptTokenCount` → `prompt_tokens`; `candidatesTokenCount + thoughtsTokenCount` → `completion_tokens`; `cachedContentTokenCount` → cached tokens; `thoughtsTokenCount` → reasoning tokens |
| Chat Completions | Messages | `prompt_tokens` → `input_tokens`; `completion_tokens` → `output_tokens`; cached tokens and web search counts map to Anthropic usage extension fields |
| Responses | Messages | cached tokens → `cache_read_input_tokens`; web search calls are counted in `server_tool_use` |
| Gemini | Messages | `promptTokenCount + toolUsePromptTokenCount` → `input_tokens`; `candidatesTokenCount + thoughtsTokenCount` → `output_tokens`; `cachedContentTokenCount` → `cache_read_input_tokens` |
| Chat Completions | Responses | cached tokens and reasoning tokens are mapped to Responses usage; web search calls are counted |
| Messages | Responses | `input_tokens` / `output_tokens` are mapped directly; `cache_read_input_tokens` → cached tokens |
| Gemini | Responses | Gemini `usageMetadata` is mapped to Responses usage; tool-use prompt tokens and thoughts tokens are folded into the relevant counts |
| Chat Completions | Gemini | cached tokens → `cachedContentTokenCount`; reasoning tokens → `thoughtsTokenCount` |
| Messages | Gemini | `cache_read_input_tokens` → `cachedContentTokenCount` |
| Responses | Gemini | cached tokens → `cachedContentTokenCount`; reasoning tokens → `thoughtsTokenCount` |

## Streaming Conversion

All 12 converters support streaming. Event names differ by protocol, but these content types are preserved where possible:

| Content type | Conversion behavior |
| --- | --- |
| Text deltas | Preserved as the target protocol's text delta |
| Tool call deltas | Tool name, tool call ID, and argument deltas are preserved; when the target protocol has no exact event shape, the closest target event is emitted |
| Reasoning / thinking deltas | `reasoning`, `thinking_delta`, and Gemini thought events are converted |
| Web search / grounding | Responses web search, Anthropic `web_search_tool_result`, Gemini grounding metadata, and Chat Completions annotations are mapped where possible |
| Usage | If upstream streaming includes a trailing usage payload, it is converted into the target protocol's usage event or final chunk fields |

## Common Differences And Notes

- Responses has no direct request field equivalent for `stop` / `stop_sequences`; those fields are not converted when going from Chat Completions or Messages to Responses.
- Gemini does not support `parallel_tool_calls`, `metadata`, `service_tier`, prompt cache keys, or several OpenAI / Anthropic extension parameters.
- Anthropic Messages `top_k` is preserved only when converting to Gemini. It is not converted to Chat Completions or Responses.
- Chat Completions `seed`, `frequency_penalty`, `presence_penalty`, and `n` mainly map to Gemini. They have no equivalent in Messages / Responses.
- `reasoning_effort` and `thinking` are range mappings, not exact token-limit preservation. If you need precise thinking budget control, prefer the target protocol's native parameter.
- Images and documents inside Anthropic `tool_result` blocks are skipped when converting to the Chat Completions tool role because the OpenAI tool role accepts text content only.
- Protocol conversion preserves web search / grounding data where possible, but citation field names and nesting differ across protocols.
