---
pageClass: api-page
title: API
head:
  - - meta
    - name: description
      content: Create Chat Completion
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, create, chat, completion, new, OpenAI, Anthropic
---

# Create Chat Completion

```
POST https://zenmux.ai/api/v1/chat/completions
```

The Create Chat Completion endpoint is compatible with OpenAI’s [Create Chat Completion](https://platform.openai.com/docs/api-reference/chat/create) API, and is used to run inference for conversational LLMs.

The parameters below list all options that *may* be supported by different models. Parameter support varies by model; for the exact parameters supported by a given model, see that model’s detail page.

## Request headers

### Authorization `string` <font color="red">Required</font>

Bearer Token authentication

### Content-Type `string` <font color="red">Required</font>

The request content type. The default is `application/json`.

## Request

### messages `array` <font color="red">Required</font>

Prompts provided to the model as a list of chat messages. Depending on model capabilities, supported message modalities may differ (e.g., text, images, audio, video). For details, refer to each model provider’s documentation.

Each element in `messages` represents one chat message and consists of `role` and `content`:

::: details Developer message `object`
Instructions provided by the developer. The model should follow these instructions regardless of what the user says. In o1 and newer models, the `developer` message replaces the previous `system` message.

- content `string or array ` <font color="red">Required</font>

  The content of the Developer message.
  - Text content `string`

    The content of the Developer message.

  - Array of content parts `array`

    An array of content parts with defined types. For Developer messages, only the `text` type is supported.
    - text `string` <font color="red">Required</font>

      Text content.

    - type `string` <font color="red">Required</font>

      The type of the content part.

- role `string` <font color="red">Required</font>

  The role of the message author; in this case, `developer`.

- name `string` <font color="gray">Optional</font>

  An optional participant name. Helps the model distinguish between participants with the same role.
  :::

::: details System message `object`
Instructions provided by the developer. The model should follow these instructions regardless of what the user says. In o1 and newer models, you should use `developer` messages for this purpose.

- content `string or array ` <font color="red">Required</font>

  The content of the System message.
  - Text content `string`

    The content of the System message.

  - Array of content parts `array`

    An array of content parts with defined types. For System messages, only the `text` type is supported.
    - text `string` <font color="red">Required</font>

      Text content.

    - type `string` <font color="red">Required</font>

      The type of the content part.

- role `string` <font color="red">Required</font>

  The role of the message author; in this case, `system`.

- name `string` <font color="gray">Optional</font>

  An optional participant name. Helps the model distinguish between participants with the same role.
  :::

::: details User message `object`  
A message sent to the model by the end user. In most chat scenarios, this is the only role you need.

- content `string or array` <font color="red">Required</font>

  The content of the User message.
  - Text content `string` <font color="red">Required</font>

    Plain text content (the most common usage).

  - Array of content parts `array` <font color="red">Required</font>

    An array of multimodal content parts. Depending on model capabilities, it can include content types such as text, images, audio, etc. Common types include:
    - Text part
      - type `string` <font color="red">Required</font>, always `text`
      - text `string` <font color="red">Required</font>, the text content

    - Image part (multimodal models only)
      - type `string` <font color="red">Required</font>, `image_url`
      - image_url `object` <font color="red">Required</font>
        - url `string` <font color="red">Required</font>, an image URL or a base64 Data URL
        - detail `string` <font color="gray">Optional</font>, typical values: `low` / `high` / `auto`, used to control image parsing fidelity

    - Audio part (audio-input models only)
      - type `string` <font color="red">Required</font>, `input_audio`
      - input_audio `object` <font color="red">Required</font>
        - data `string` <font color="red">Required</font>, base64-encoded audio file content
        - format `string` <font color="red">Required</font>, e.g. `wav`, `mp3`

    - File part (File content part; models that support file input only)  
      Used to provide an entire file as context to the model (e.g., PDF, Office documents).
      - type `string` <font color="red">Required</font>, always `file`
      - file `object` <font color="red">Required</font>
        - file_id `string` <font color="gray">Optional</font>
          - The file ID obtained via the file upload endpoint. This is the recommended way to reference a file.
        - file_data `string` <font color="gray">Optional</font>
          - Base64-encoded file data, for sending file content directly in the request body
        - filename `string` <font color="gray">Optional</font>
          - The filename, used to hint the file type to the model or to display it in the console

- role `string` <font color="red">Required</font>

  The author role of the message; in this case, `user`.

- name `string` <font color="gray">Optional</font>

  An optional participant name. Helps the model distinguish between participants with the same role.  
  :::

::: details Assistant message `object`  
A reply message sent to the user by the model during the conversation. You can include these historical assistant messages in new requests so the model can continue reasoning with the full context.

- content `string or array` Optional

  The content of the Assistant message. **Required when `tool_calls` or the (deprecated) `function_call` is not set.**
  - Text content `string`

    Plain-text assistant message content.

  - Array of content parts `array`

    An array of content parts with defined types. It can contain one or more `text` parts, or **exactly one** `refusal` part.
    - Text content part `object` (text content part)
      - type `string` <font color="red">Required</font>  
        The type of the content part.

      - text `string` <font color="red">Required</font>  
        Text content.

    - Refusal content part `object` (refusal content part)
      - type `string` <font color="red">Required</font>  
        The type of the content part.

      - refusal `string` <font color="red">Required</font>  
        The refusal message generated by the model.

- refusal `string or null` Optional

  The assistant’s refusal message content.

- role `string` <font color="red">Required</font>

  The author role of the message; in this case, `assistant`.

- name `string` Optional

  Optional participant name. Helps the model distinguish between participants with the same role.

- audio `object or null` Optional

  Data about a **previous model audio response**, which can be referenced in subsequent turns.
  - id `string` <font color="red">Required</font>

    The unique identifier of the previous audio response.

- tool_calls `array` Optional
  - Function tool call `object`
    - id `string` <font color="red">Required</font>

      The tool call ID, used to match `tool_call_id` in subsequent Tool messages.

    - type `string` <font color="red">Required</font>

      The tool type. Currently only `function` is supported.

    - function `object` <font color="red">Required</font>
      - name `string` <font color="red">Required</font>

        The name of the function to call.

      - arguments `string` <font color="red">Required</font>

        Function call arguments as a JSON string (generated by the model).  
        Note: The model is not guaranteed to generate strictly valid JSON and may include parameters not defined in the function schema. Validate on the application side before invoking.

    - Custom tool call `object`
      - id `string` <font color="red">Required</font>

        The tool call ID, used to match `tool_call_id` in subsequent Tool messages.

      - type `string` <font color="red">Required</font>

        The tool type. Always `custom`.

      - custom `object` <font color="red">Required</font>
        - name `string` <font color="red">Required</font>

          The name of the function to call.

        - input `string` <font color="red">Required</font>

          The input for the custom tool call, generated by the model.

- function_call `object or null` (deprecated) Optional

  Replaced by `tool_calls` and retained only for backward compatibility. Indicates the function name and arguments the model suggests calling.
  - name `string` <font color="red">Required</font>  
    The name of the function to call.

  - arguments `string` <font color="red">Required</font>  
     Function call arguments as a JSON string (generated by the model). You must still validate on the application side before actually invoking.

- reasoning `string` Optional

  The assistant message’s reasoning text. When reasoning is enabled, the model’s reasoning content will appear in this field. In multi-turn conversations, you can pass this back to maintain continuity.

- reasoning_details `array` Optional (**required for multi-turn tool-calling scenarios**)

  An array with detailed reasoning information. **In multi-turn tool-calling scenarios with reasoning enabled, you must pass this field back in full—especially the `signature` field—otherwise subsequent turns will not work properly.**

  Each element includes:
  - type `string` <font color="red">Required</font>

    The reasoning content type, e.g. `reasoning.text`.

  - text `string` <font color="red">Required</font>

    The reasoning text content.

  - signature `string` <font color="red">Required</font>

    A signed credential for the reasoning content. **This is the key field for maintaining reasoning context across turns and must be passed back unchanged.** The signature is generated by the model to verify integrity and continuity.

  - format `string` <font color="gray">Optional</font>

    Signature format identifier, e.g. `anthropic-claude-v1`.

  - index `number` <font color="gray">Optional</font>

    Index of the reasoning segment.

:::

::: details Tool message `object`  
A message used to return the execution result of an external tool (function) call back to the model.

- content `string or array` <font color="red">Required</font>

  The content of the tool execution result, typically text or structured data (serialized to a string).
  - Text content `string`

    The content of the Tool message.

  - Array of content parts `array`

    An array of content parts with defined types. For Tool messages, only the `text` type is supported.
    - text `string` <font color="red">Required</font>

      Text content.

    - type `string` <font color="red">Required</font>

      The type of the content part.

- role `string` <font color="red">Required</font>

  The author role of the message; in this case, `tool`.

- tool_call_id `string` <font color="red">Required</font>

  Corresponds to an `assistant` message’s `tool_calls[i].id`, used to associate this tool result with that call.

- name `string` <font color="gray">Optional</font>

  The tool name (usually matches the function name declared in `tools`).  
  :::

::: info Function message `object` <font color="red">Deprecated by the official spec and not supported</font>
:::

### model `string` <font color="red">Required</font>

The model ID for this inference request, in the format `<provider>/<model_name>`, e.g. openai/gpt-5. You can find it on each model’s detail page.

### max_completion_tokens `integer or null` <font color="gray">Optional</font>

Limits the length of the model’s generated content, including reasoning. If omitted, the model’s default limit is used. The maximum generation length for each model is available on its detail page.

### temperature `number` <font color="gray">Optional</font>

- Default: `1`
- ZenMux does not enforce a range; values in `[0, 2]` are recommended.

Sampling temperature to control randomness: higher values yield more randomness; lower values yield more deterministic output. Typically tuned as an alternative to `top_p`.

### top_p `number` <font color="gray">Optional</font>

- Default: `1`

Nucleus sampling parameter: only sample from tokens whose cumulative probability mass is within `top_p`. For example, `top_p = 0.1` means only consider tokens in the top 10% probability mass.

### n `integer or null` <font color="gray">Optional</font>

Number of candidate responses to return. Currently only `n=1` is supported.

### frequency_penalty `number or null` <font color="gray">Optional</font>

- Default: `0`
- Range: `-2.0` to `2.0`

Penalizes tokens that have appeared frequently. Higher values reduce repetition and can help avoid mechanical echoing.

### presence_penalty `number or null` <font color="gray">Optional</font>

- Default: `0`
- Range: `-2.0` to `2.0`

Penalizes tokens based on whether they have appeared at all. Higher values encourage introducing new topics and reduce repeatedly discussing the same content.

### stop `string | array | null` <font color="gray">Optional</font>

- Default: `null`
- Up to 4 stop sequences

When the generated output matches any stop sequence, the model stops generating and the stop sequence is not included in the response. Some newer reasoning models (e.g. `o3`, `o4-mini`) do not support this parameter.

### logit_bias `object` <font color="gray">Optional</font>

- Default: `null`

Used to fine-tune sampling probabilities for specific tokens. Keys are token IDs (integers) from the tokenizer; values are biases between `-100` and `100`.

- Positive: increase the chance of selecting the token
- Negative: decrease the chance of selecting the token
- Extreme values (e.g. ±100): approximate forcing a token off/on

### logprobs `boolean or null` <font color="gray">Optional</font>

- Default: `false`

Whether to include log probabilities for output tokens in the response.

### top_logprobs `integer` <font color="gray">Optional</font>

Specifies the **number of most likely tokens** to return at each position (0–20), each with its logprob.

### tools `array` <font color="gray">Optional</font>

Declares a list of tools the model can call in this conversation. Each element can be a custom tool or a function tool (a function defined via JSON Schema).

### tool_choice `string or object` <font color="gray">Optional</font>

Controls the model’s tool-usage strategy: ([platform.openai.com](https://platform.openai.com/docs/api-reference/chat))

- `"none"`: do not call any tools
- `"auto"`: let the model decide whether and which tools to call
- `"required"`: the model must call at least one tool in this turn
- Specify a single tool: `{"type": "function", "function": {"name": "my_function"}}`

### parallel_tool_calls `boolean` <font color="gray">Optional</font>

- Default: `true`

Whether to allow the model to call multiple tools (functions) **in parallel** within a single response.

### reasoning_effort `string` <font color="gray">Optional</font> (reasoning models)

Controls how much effort a **reasoning model** puts into thinking: `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, etc. Defaults and supported ranges vary by model.

### verbosity `string` <font color="gray">Optional</font>

- Default: `"medium"`

Constrains output verbosity: `low` (concise), `medium` (balanced), `high` (more detailed).

### web_search_options `object` <font color="gray">Optional</font>

Configures the behavior of the **web search tool**, enabling the model to proactively retrieve up-to-date information from the internet before answering.

### metadata `object` <font color="gray">Optional</font>

Allows up to 16 key-value pairs as structured business metadata for logging, retrieval, or querying in management UIs.

### stream `boolean or null` <font color="gray">Optional</font>

- Default: `false`

Whether to enable **streaming output** (Server-Sent Events). When `true`, results are returned as an event stream in chunks.

### stream_options `object` <font color="gray">Optional</font>

Only effective when `stream: true`, used to configure streaming behavior, such as whether to include usage information at the end of the stream.

### provider `object` <font color="gray">Optional</font>

Used to configure routing and failover across multiple model providers (e.g., OpenAI, Anthropic, Google) for this request.  
If not specified, the project’s or model’s default routing strategy is used.

#### routing `object` <font color="red">Required</font>

Routing policy configuration that determines how requests are selected and distributed among multiple providers.

##### type `string` <font color="red">Required</font>

Routing type. Supported values:

- `priority`
  Select providers by priority order: try the first, then the next on failure (can be used with fallback).
- `round_robin`
  Round-robin distribution: evenly distribute request traffic across providers.
- `least_latency`
  Lowest-latency first: choose the currently fastest provider based on historical/real-time stats.

##### primary_factor `string` <font color="gray">Optional</font>

The primary consideration when multiple providers are available. For example:

- `cost`
  Prefer lower-cost providers
- `speed`
  Prefer faster-responding providers
- `quality`
  Prefer higher-quality providers (e.g., stronger models / more stable service)

Actual behavior works in conjunction with `type`. For example, when `type = "priority"`, `primary_factor` mainly affects the priority sorting logic.

##### providers `array` <font color="red">Required</font>

The list of model providers that can participate in routing. Example: `["openai", "anthropic", "google"]`

#### fallback `string` <font color="gray">Optional</font>

Failover strategy. When the currently selected provider fails (e.g., timeout, insufficient quota, service unavailable), how to automatically switch:

`"true"`: Enable automatic failover. When the current provider is unavailable, automatically try other available providers in the list according to the routing policy.

`"false"`: Disable failover. If the current provider call fails, return an error immediately without trying other providers.

`"<provider_name>"`: Explicitly specify a fixed fallback provider, e.g. `"anthropic"`:

Use the provider selected by the primary routing policy first  
If it fails, switch to the specified fallback provider  
If both primary + fallback fail, return an error

### model_routing_config `object` <font color="gray">Optional</font>

Used to configure selection and routing across different models **within the same provider** for this request (e.g., how to choose among `gpt-4o`, `gpt-4-turbo`, `claude-3-5-sonnet`).

If not specified, the project or SDK default model selection strategy is used (e.g., default model, default task-type mapping, etc.).

#### available_models `array` <font color="red">Required</font>

A list of **model names** available for routing or as candidates.

#### preference `string` <font color="gray">Optional</font>

Preferred model name.

#### task_info `object` <font color="gray">Optional</font>

Task metadata used to decide the specific model or parameters **based on task type and complexity**.

Fields:

##### task_type `string` <font color="red">Required</font>

Task type, expressing what the request is for, to support routing or automatic parameter selection.

- Example supported values:
  - `"chat"` — conversational tasks (multi-turn chat, assistant Q&A)
  - `"completion"` — general text generation/completion
  - `"embedding"` — vectorization/semantic embedding
- Purpose:
  - Set different default models or quota policies by task type
  - Work with `complexity` to decide whether to use stronger models

##### complexity `string` <font color="gray">Optional</font>

Task complexity, describing the difficulty or importance of the request.

- Supported values:
  - `"low"` — simple tasks (short answers, simple rewrites)
  - `"medium"` — moderate complexity (general Q&A, basic code, routine analysis)
  - `"high"` — high complexity (long-document analysis, complex programming, large-scale reasoning)
- Purpose:
  - Choose models at different tiers based on complexity (e.g., cheaper models for low complexity; stronger models for high complexity)
  - Also used to control timeouts, retry strategies, etc.

##### additional_properties `object` <font color="gray">Optional</font>

Task-related extension fields, as free-form key-value pairs.

#### additional_properties `object` <font color="gray">Optional</font>

Extension fields for the model routing configuration itself, used to attach extra control information beyond the standard structure.

### reasoning `object` <font color="gray">Optional</font>

Used to configure behaviors related to the reasoning process (chain-of-thought / reasoning trace), including whether to enable it, depth/length controls, and whether to expose reasoning content externally.

If not specified, the system or model uses its default reasoning strategy.

#### enabled `boolean` <font color="red">Required</font>

Whether to enable explicit reasoning.

- `true`: the model uses (and, when allowed, outputs) more detailed reasoning steps
- `false`: the model provides only a conclusion (or minimizes explicit reasoning)

#### effort `string` <font color="gray">Optional</font>

Reasoning effort level, balancing **depth / granularity** against **cost / latency**.

- Supported values:
  - `"low"` — lightweight reasoning: faster answers, fewer details
  - `"medium"` — moderate reasoning: a balanced choice for most tasks
  - `"high"` — deep reasoning: more detailed analysis, higher token usage and latency
- Typical usage:
  - Latency-sensitive online services: prefer `"low"` or `"medium"`
  - Mission-critical correctness: prefer `"high"`

#### max_tokens `number` <font color="gray">Optional</font>

Maximum token limit for the reasoning process (not the final answer).

#### exclude `boolean` <font color="gray">Optional</font>

Whether to **exclude reasoning content from the user-visible response**.

- `false`:
  - Reasoning can be returned alongside the final answer (e.g., during debugging/tool development)
- `true`:
  - Reasoning is used internally only and not exposed to the user (typical production setting)
- Purpose:
  - Meet security/compliance requirements (do not expose chain-of-thought)
  - In development/debugging, set to `false` to observe the model’s reasoning and iterate on prompts/policies

#### usage `object` <font color="gray">Optional</font>

Usage statistics

##### include `boolean` <font color="red">Required</font>

Whether to include usage statistics in the response

### response_format `object` <font color="gray">Optional</font>

An object that specifies the required output format for the model.

Set to `{ "type": "json_schema", "json_schema": {...} }` to enable structured outputs and ensure the model matches the JSON Schema you provide.

Set to `{ "type": "json_object" }` to enable legacy JSON mode and ensure the generated message is valid JSON. For models that support it, `json_schema` is preferred.

:::details Text `object`

- type `string` <font color="red">Required</font>
  The type of the response format being defined. Always `text`.

:::

:::details JSON schema `object`

- json_schema `object` <font color="red">Required</font>
  The JSON Schema that defines the response format.
  - name `string` <font color="red">Required</font>
    The name of the response format. Must be a-z, A-Z, 0-9, or contain underscores and dashes; maximum length is 64.
  - schema `object` <font color="gray">Optional</font>
    The schema for the response format, described as a JSON Schema object.
  - strict `boolean` <font color="gray">Optional</font>
    Whether to strictly follow the JSON schema.
  - description `string` <font color="gray">Optional</font>
    A description of the response format’s purpose. The model uses this description to determine how to respond in that format.
- type `string` <font color="red">Required</font>
  The type of the response format being defined. Always `json_schema`.

:::

:::details JSON object `object`

- type `string` <font color="red">Required</font>
  The type of the response format being defined. Always `json_object`.

:::

### Unsupported fields

| Field name              | Type          | Supported                                            | Description                                                                                              |
| ----------------------- | ------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| audio                   | object/null   | <span style="white-space: nowrap;">❌ Not supported</span> | Audio output parameters                                                                                  |
| modalities              | array         | ❌ Not supported                                     | Output modality types                                                                                    |
| functions               | array         | ❌ Not supported                                     | Deprecated; this parameter is not accepted                                                               |
| function_call           | string/object | ❌ Not supported                                     | Deprecated; this parameter is not accepted                                                               |
| prompt_cache_key        | string        | ❌ Not supported                                     | Prompt cache key                                                                                         |
| prompt_cache_retention  | string        | ❌ Not supported                                     | Cache retention policy                                                                                   |
| safety_identifier       | string        | ❌ Not supported                                     | Safety identifier                                                                                        |
| store                   | bool/null     | ❌ Not supported                                     | Store this conversation                                                                                  |
| service_tier            | string        | ❌ Not supported                                     | Service tier                                                                                             |
| prediction              | object        | ❌ Not supported                                     | Predicted outputs configuration                                                                          |
| seed                    | int/null      | ❌ Not supported                                     | Random seed for sampling; deprecated                                                                     |
| user                    | string        | ❌ Not supported                                     | Legacy user identifier; now primarily replaced by `safety_identifier` and `prompt_cache_key`.            |
| max_tokens              | int/null      | ❌ Not supported                                     | Deprecated; replaced by `max_completion_tokens`                                                          |

## Response

### Non-streaming: returns a “complete chat completion object”

When `stream: false` (or omitted), the endpoint returns a complete **chat.completion** object. Field descriptions follow the same order as the table above.

---

### Top-level field: `choices`

#### choices `array`

A list of chat completion choices. It corresponds one-to-one with `n` in the request. Currently only `n = 1` is supported, so it typically contains a single element.

---

### choices[i] object

#### finish_reason `string`

The reason the model stopped generating tokens. Common values include:

- `stop`: reached a natural stopping point or hit a stop sequence
- `length`: reached the maximum token limit specified in the request
- `content_filter`: content was omitted due to a content filter
- `tool_calls`: the model called a tool (`tool_calls`)
- `function_call`: the model called a function (legacy, deprecated)

#### index `integer`

The index of this choice in the `choices` array, starting from 0.

#### logprobs `object`

Log probability information for this choice, used to inspect the probability distribution for each output token. Present only when `logprobs`-related parameters are set in the request.

---

### choices[i].logprobs.content

#### content `array`

A list of “message content tokens” with log probability information. Each element describes a token and its candidate tokens:

- bytes `array`  
  A list of integers representing the UTF‑8 bytes for the token. In some languages or for emojis, a character may consist of multiple tokens; merging these bytes reconstructs the correct text. If the token has no byte representation, this is `null`.

- logprob `number`  
  The log probability of the token. If the token is not among the top 20 most likely tokens, `-9999.0` is typically used to indicate “extremely unlikely”.

- token `string`  
  The text representation of the current output token.

- top_logprobs `array`  
  A list of the most likely candidate tokens and their log probabilities at this position. In rare cases, the returned count may be smaller than requested.
  - bytes `array`  
    UTF‑8 bytes for the candidate token; `null` if not available.
  - logprob `number`  
    The log probability of the candidate token.
  - token `string`  
    The text of the candidate token.

---

### choices[i].logprobs.refusal

#### refusal `array`

A list of “refusal content tokens” with log probability information. When the model outputs a refusal, this is used to inspect token probabilities for the refusal text.

- bytes `array`  
  UTF‑8 bytes for the refusal token; `null` if not available.
- logprob `number`  
  Log probability of the refusal token; typically `-9999.0` when not in the top 20.
- token `string`  
  The text of a token within the refusal content.
- top_logprobs `array`  
  The most likely candidate refusal tokens at this position.
  - bytes `array`  
    UTF‑8 bytes for the candidate refusal token.
  - logprob `number`  
    The log probability of the candidate refusal token.
  - token `string`  
    The text of the candidate token within the refusal content.

---

### choices[i].message

#### message `object`

The complete chat completion message generated by the model.

---

### choices[i].message fields

#### reasoning `string` (ZenMux extension)

Reasoning text content, used to display the model’s thought process or intermediate analysis. Whether it is actually returned depends on the model and the reasoning configuration in the request.

#### reasoning_details `string` (ZenMux extension)

The main body of the reasoning text, typically more complete or detailed than `reasoning`, and can serve as the primary carrier for chain-of-thought.

#### content `string`

The main message content, typically the model’s natural-language reply to the user. Some multimodal models may return structured content, but overall it follows the OpenAI chat format.

#### refusal `string or null`

If the model refuses to fulfill the user request in this turn, this contains the refusal message text; otherwise `null`.

#### role `string`

The author role. For a model reply, it is `"assistant"`.

#### annotations `array`

A list of annotations. When using tools such as web search, it can carry URL citations and similar references.

- type `string`  
  The type of URL citation; currently always `url_citation`.
- url_citation `object`  
  URL citation details when using web search.
  - end_index `integer`  
    The index of the last character of this citation within the message `content`.
  - start_index `integer`  
    The index of the first character of this citation within the message `content`.
  - title `string`  
    The title of the web resource.
  - url `string`  
    The URL of the web resource.

#### audio `object`

When audio output modality is requested, this object contains the model’s audio response data.

- data `string`  
  Base64-encoded audio bytes generated by the model, in the requested format.
- expires_at `integer`  
  Unix timestamp (seconds) after which this audio response is no longer available on the server for subsequent multi-turn conversations.
- id `string`  
  The unique identifier of this audio response.
- transcript `string`  
  The transcript (transcribed text) corresponding to the audio content.

#### function_call `object`

Deprecated function-call field, replaced by `tool_calls` and retained only for backward compatibility. Indicates the function name and parameters the model suggests calling.

- arguments `string`  
  Function arguments as a JSON string. Note that the model is not guaranteed to produce strictly valid JSON and may include fields not defined in the schema; you should parse and validate before invocation.
- name `string`  
  The function name to call.

#### tool_calls `array`

The new tool-call list. Each element describes one tool call, which can be a “function tool call” or a “custom tool call”. Models may call multiple tools in parallel within a single response.

- id `string`  
  Unique ID of the tool call, used to match `tool_call_id` in subsequent `tool` messages.
- type `string`  
  Tool type. The current standard is `function`; ZenMux may support other types such as `custom` in extensions.
- function `object`  
  When `type = "function"`, indicates the function the model calls.
  - arguments `string`  
    Function call arguments as a JSON string. The model may not always generate valid JSON and may include fields not defined in the schema; validate before invocation.
  - name `string`  
    The function name to call.

---

### Top-level fields: metadata and usage

#### created `integer`

Unix timestamp (seconds) when the chat completion was created.

#### id `string`

Unique identifier of this chat completion.

#### model `string`

Model identifier used for this completion, e.g. `openai/gpt-5`.

#### object `string`

Object type. For non-streaming responses, this is always `chat.completion`.

#### service_tier `string`

The service tier/type used to process the request. ZenMux does not constrain values; if the upstream model returns this field, it will be passed through.

#### system_fingerprint `string`

Backend configuration fingerprint for this request, used to identify the underlying service version or cluster. Passed through if provided upstream.

#### usage `object`

Usage statistics for this request, including token counts for prompts and completions.

- completion_tokens `integer`  
  Number of tokens used in the generated completion.
- prompt_tokens `integer`  
  Number of tokens used in the input prompt (messages, etc.).
- total_tokens `integer`  
  Total tokens used (`prompt_tokens + completion_tokens`).

- completion_tokens_details `object`  
  Further breakdown of completion tokens.
  - accepted_prediction_tokens `integer`  
    When using Predicted Outputs, the number of predicted tokens that actually appeared in the completion. Typically unused by current models.
  - audio_tokens `integer`  
    Tokens consumed by audio output generated by the model.
  - reasoning_tokens `integer`  
    Tokens generated for the reasoning process (even if not fully shown to the user).
  - rejected_prediction_tokens `integer`  
    When using Predicted Outputs, the number of predicted tokens that did not appear in the completion; these tokens still count toward billing and context-window limits. Typically unused.

- prompt_tokens_details `object`  
  Breakdown of prompt tokens.
  - audio_tokens `integer`  
    Tokens consumed by audio input in the prompt.
  - cached_tokens `integer`  
    Tokens matched via prompt caching.

---

### Streaming: returns multiple “chat completion chunk objects”

When `stream: true`, the endpoint returns **chat.completion.chunk** objects multiple times via SSE (Server-Sent Events). Clients should consume and concatenate chunks in order. Field descriptions follow the same order as the table above.

---

### Top-level field: `choices` (streamed chunks)

#### choices `array`

A list of completion choices. If `n > 1`, it can contain multiple elements. When `stream_options: {"include_usage": true}` is set, the final chunk may have an empty `choices` array and carry only `usage` information.

---

### choices[i] (Chunk) object

#### delta `object`

Incremental content produced by the streaming model response—i.e., what is “new” compared to previous chunks.

- reasoning `string` (ZenMux extension)  
  Incremental reasoning text, used to stream reasoning information chunk by chunk.
- reasoning_content `string` (ZenMux extension)  
  Incremental fragment of the reasoning main body, typically used with `reasoning` to reconstruct the full reasoning text.
- content `string`  
  Incremental message content for this chunk. The client should concatenate `content` across chunks to build the full reply.
- function_call `object` (deprecated)  
  Legacy incremental function-call information, replaced by `tool_calls` but still parseable.
  - arguments `string`  
    Incremental JSON fragment of function arguments; must be concatenated across chunks before parsing.
  - name `string`  
    The function name to call; typically appears in the first chunk of the call.

- refusal `string`  
  Incremental refusal message fragment for this chunk.
- role `string`  
  The author role for this message, typically `"assistant"` in the first chunk.
- tool_calls `array`  
  Incremental tool-call information list.

  For each incremental tool-call element:
  - index `integer`  
    The position of this tool call within the `tool_calls` array.
  - function `object`  
    Incremental information for a function tool call.
    - arguments `string`  
      Incremental fragment of the JSON string for function-call arguments; must be concatenated across chunks before parsing.
    - name `string`  
      The function name to call; typically provided at the start of the tool call.

  - id `string`  
    The tool call ID; typically provided on first appearance for later association with `tool` messages.
  - type `string`  
    The tool type; currently only `function` is supported.

#### finish_reason `string or null`

Why generation stopped for this chunk:

- `stop`: natural end or hit a stop sequence
- `length`: reached the maximum generation token limit
- `content_filter`: content was filtered
- `tool_calls`: tool call triggered
- `function_call`: legacy function call triggered
- `null`: not finished yet; more chunks will follow

#### index `integer`

The index of this choice in the `choices` array.

#### logprobs `object`

Log probability structure for the current chunk, same as non-streaming `logprobs`, but only for the “new” tokens.

---

### choices[i].logprobs.content (streaming)

#### content `array`

A list of “message content tokens” newly generated in the current chunk.

- bytes `array`  
  UTF‑8 bytes for the current token.
- logprob `number`  
  Log probability for the current token; `-9999.0` if not in the top 20 most likely tokens.
- token `string`  
  Text representation of the current output token.
- top_logprobs `array`  
  Candidate tokens most likely at this position.
  - bytes `array`  
    UTF‑8 bytes for the candidate token.
  - logprob `number`  
    Log probability for the candidate token.
  - token `string`  
    Text of the candidate token.

---

### choices[i].logprobs.refusal (streaming)

#### refusal `array`

A list of “refusal content tokens” newly generated in the current chunk.

- bytes `array`  
  UTF‑8 bytes for the refusal token.
- logprob `number`  
  Log probability for the refusal token; `-9999.0` for low-probability cases.
- token `string`  
  Text of a token within the refusal content.
- top_logprobs `array`  
  Candidate refusal tokens most likely at this position.
  - bytes `array`  
    UTF‑8 bytes for the candidate refusal token.
  - logprob `number`  
    Log probability for the candidate refusal token.
  - token `string`  
    Text of the candidate token.

---

### Other top-level streaming fields

#### created `integer`

Unix timestamp (seconds) when the chat completion was created. The value is the same for all chunks in a stream.

#### id `string`

Unique identifier of the chat completion. All chunks in the same stream share the same `id`.

#### model `string`

Model name used for this completion.

#### object `string`

Object type. For streaming responses, this is always `chat.completion.chunk`.

#### service_tier `string`

The service tier/type used to process the request. Passed through if provided upstream.

#### system_fingerprint `string`

Fingerprint of the backend configuration used for this request. Although marked Deprecated by some upstream providers, ZenMux still preserves and passes through this field.

---

### usage `object` (included only in the final chunk)

When `stream_options: {"include_usage": true}` is set, the final chunk includes the `usage` object; its structure is the same as the non-streaming response.

- completion_tokens `integer`  
  Number of tokens used in the completion.
- prompt_tokens `integer`  
  Number of tokens used in the prompt.
- total_tokens `integer`  
  Total tokens used in this request.

- completion_tokens_details `object`  
  Completion token breakdown.
  - accepted_prediction_tokens `integer`  
    Number of predicted tokens accepted in the completion.
  - audio_tokens `integer`  
    Tokens related to model-generated audio.
  - reasoning_tokens `integer`  
    Tokens used by the model for reasoning.
  - rejected_prediction_tokens `integer`  
    Number of predicted tokens not used but still counted toward usage.

- prompt_tokens_details `object`  
  Prompt token breakdown.
  - audio_tokens `integer`  
    Audio input tokens in the prompt.
  - cached_tokens `integer`  
    Tokens matched via caching.

::: api-request POST /api/v1/chat/completions

```TypeScript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://zenmux.ai/api/v1',
  apiKey: '<ZENMUX_API_KEY>',
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "openai/gpt-5",
    messages: [
      {
        role: "user",
        content: "What is the meaning of life?",
      },
    ],
  });

  console.log(completion.choices[0].message);
}

main();
```

```Python
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<your_ZENMUX_API_KEY>",
)

completion = client.chat.completions.create(
    model="openai/gpt-5",
    messages=[
        {
            "role": "user",
            "content": "What is the meaning of life?"
        }
    ]
)

print(completion.choices[0].message.content)
```

```cURL
curl https://zenmux.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "openai/gpt-5",
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ]
  }'
```

:::

::: api-response

```json
{
  "id": "dc41ec9a378d43a497ca2daff171ceb0",
  "model": "openai/gpt-5",
  "choices": [
    {
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "content": "There isn’t a single, objective answer. Different traditions offer different meanings, and most people end up constructing their own.\n\n- Religious: To know or serve God, live virtuously, and love others.\n- Existential/humanist: Life has no built‑in meaning; you create it through choices, authenticity, and responsibility.\n- Scientific-naturalist: There’s no cosmic purpose; meaning comes from conscious experience—relationships, curiosity, creativity, and contribution.\n- Eudaimonic (Aristotle): Flourish by developing virtues, using your strengths, and living in accord with reason and values.\n- Eastern philosophies: Reduce suffering, cultivate compassion, and see through the illusion of a separate self.\n\nA practical way to find meaning:\n- Clarify your values (what you’d stand for even if it’s hard).\n- Invest in relationships and service.\n- Learn and create; pursue mastery in something that matters to you.\n- Contribute beyond yourself—help, build, protect, or heal.\n- Savor and be present; cultivate gratitude and awe.\n\nA simple summary many find helpful: Love well, learn continuously, and leave the world a little better than you found it.",
        "refusal": null,
        "annotations": [],
        "reasoning": "**Considering the meaning of life**\n\nI need to answer concisely but thoughtfully. The question is philosophical, so I should present various perspectives: religious, existential, scientific, and personal. It might be useful to suggest a practical framework for finding meaning, focusing on relationships, personal growth, and contributions. While a general response is appropriate, I should clarify that there’s no single objective answer. I can mention common themes like connection, creativity, and love, and propose questions for reflection. A nice one-liner could be about creating meaning through conscious engagement.",
        "reasoning_details": [
          {
            "index": "0",
            "format": "openai-responses-v1",
            "type": "reasoning.summary",
            "summary": "**Considering the meaning of life**\n\nI need to answer concisely but thoughtfully. The question is philosophical, so I should present various perspectives: religious, existential, scientific, and personal. It might be useful to suggest a practical framework for finding meaning, focusing on relationships, personal growth, and contributions. While a general response is appropriate, I should clarify that there’s no single objective answer. I can mention common themes like connection, creativity, and love, and propose questions for reflection. A nice one-liner could be about creating meaning through conscious engagement."
          },
          {
            "id": "rs_0639a0762f01111400696766d7af48819388646c9544e1107c",
            "index": "0",
            "format": "openai-responses-v1",
            "type": "reasoning.encrypted",
            "data": "gAAAAABpZ2br9iURFxvdEjmaRGKcjutfnC2dVpSTQxh8Vjel9pkdkU6b6sX_JjARvh4aU-hI9c4ZfGjWAze2FfWqfvNyGN55ljlnX9wHRTK6OR9VWyezo7PoXDS4uJPV62OjA5DvDrj6KZeMcxUnEo54XORRqgGbqCR6R0Pv1q2YoFfJZh0gVBdakKDTlm4JEb6o5hIEg9b1jh1mNxu-SyCxuIecmE_ZsDYphWyLu3S1jPM-ieNTJ97GLfiefbqk-SostjrIKpiVtrGMU0cHS7FYk01X260lXAAf54jqdMzF8Haw08m0zs0vTABPfP3WK5RCOlHd_EuEsabuZoZXwqyWkAA9G3l0i-0xlXnPNZlXwcUlfqZto6aszy-XPPUDXfpIZqEEpcF2ikXSdTSTOMxAtSb2Q1lUnI4rN45-dOonjJ_VltIHXJCf9c-wbF3d-9ymPDwhib4VnlNTbH03I6SK-_PebVkTF1efcaL5MonE0_lypsNn4ZF-T3wpp1jGTke5mMv8qjChJYUaO5C7eGugmM6pvxnAFBr375Wic-rh1wlBrPEtmXPLVO-TqCGNddB-Vrg0HVblXOphr1gPXcuE8VpGw40PtiT9YqYDaAlZRLZpxJfB9hAxtKDfgqh5f5TqfrXjuUJSeT6sQPgCv4vHulpwSWKNOh5PpCvW5FS1HHvPXW1d5WERDl_dngxRWU4NuIi0MlSLV5kd_oTOOM4AVRSYK0TA4o8YpAZVlVYGVp9b5Vs1rhVl56ga_iOBfiRw16Tb7nO7V-vcwrBQLOYiFixuE0Em5UAEaLp_wxP12QqoRSRezFTHkNT9ietR03Z38H8SzwbPoPB2XiI9pe5KxJGQ2cccdS9s5o4_Btj8kp9q9n2rqFg0Cuv-WChnzhgX8u5zrk1cAqCNhr5uul-RdJLWCz9IH35oOe14umu8ymaN4D1x1VTY5uPef7OrjYyYXqTQa-CMUFqw3qShwBftlZDfF6rLMgKUiEBP93ERFNBIMoBIn-BVEdi5yjImIUkH_q1iVyhtQTEHUh7TMF7_i2vWZUB-NXIPs9Zqt76pH-tKukLWvDrHqeajwvtt9d6X4xks9oGzepnWmL2nyFggLD24R8-59Sc5dco-Ssr91TfUpm8VrJXqUTtcMcWuCoY0i93MT8ty5Bc0hYQ23-vzZdyS0Rm6dO26HDXrvZ9TGL4uW_QXNBX6q51qlQ_xr4m51JU8Wul_You9-M03dO99LkdljtF5nKsnZNdiWGRnF9oFmokdHFAqfBM6KjLZUUkDsVG6hLElejg89t0kymwUJfao21MMCb56E2G6QtUOx4vf8F3myDFhOX3zrAAhoJ-Bw7rK3s2esbnDBn96ZzKoyGOLHm54kQM2_Rs9qQdjflxZ4WKhXoEJwz9H1uHILBMVbrl1aTu_ReYb8xJPVR5oB7Ky_1GPoeG82QntVExCJDZpb4fAqpzFzuV6B7GsVF6Z0cyeyPi3TGEjxSLxYqGWVMBSEsokx8USEET0T7ytiHpVQ4cOr2eimLzDp-hJbZKGEufU6Tnh9RZA2-0Q87X57RaoAydY6brj9S3tTAy2Iz8m_-qEGLXjUr6ffDg3lNMGQhFvN-YAWbdmidbZfCVQR1Oc6A6-ayowaHpyUeff7PxQFXaQ7k3P0W7p1N3VLTjC3lNk2gSPyq_6MvLmxXOlGLj_50Q1OLAFn0bK7knhFf8t7gS7MjOXMQl9PiSbtQL9URHrPeMYKjpQGa84rOnZzC8G9RXvzKatVHB0NpKO02DeTY4hzsMw-Wj73-ZpBSSiyOlTpuVVNxma83krKqMqU_9kX09mNWB6UKrm9v7RxFuOjyVd5x35iodmPUbaXbzqETubPRzVKedLAhaYVTZp1J_qWvLVPoSImyFrM0IPB2Jy5ksqqAbbDjTy3l6Jp3pNu-IhiACVA1JlxRQ67Esb7JaK3ZakR3ExWSPDgxonqX8YvS6dr0UM2tjpOnurQc5NUSYBwo9vHzQxbWVuBATJaSUqe0IrJKPyvErRoEtFGjKZ8CvZagw1-MfD0KTLAmzR3hYAXKADsMRibEXf8-SPUrnuvm4OsRj1Gg7jl4k_ITYjOiRLzBMvVVxxRFfAhR7BFYBC1H0dClGTy4yxPKDNUR9HctiuQFO2-Q4Sw4dEqnTYSwCJS4Zaw5DHvqbDh9JK3AKdatRHHImqOxxtUxiJ8IaQcd2n_CaNbIekuuqUclwnjW8IJquTAPDJX0MhsyBY3nXJMVfeyCFO0D0g8OcvCH_9pFrsGgpTb7DFloDeTfCFUfY0GGGtfuhSL3qDggFAurf9H3cN73dOW5wujFOTGAbWG8aHf2Rok_H06fcg4zJSu5TnHkoJjdyc5n_NIo1RATiKwNkSFHwc_2-RnrnmOVl4125ufyqqrvuENapGWm8xGySQW1Zb39AKdUpBr4zEgU_M3PR6D0ujubsJLncgO8X6DwQ47QlGjPYmnjG_-q3O3plr-ShFJQOZqBvSgtdcqQBu0LK8I3vLXjHkQweUsVRzxlbwOYFMjmYOFWzxq2gP86-4TldrnOsUw0afewm0s_d6N8t2F_mvEgmJ5fPA3KXIQ7Fjaqxt_KUgqZqA4j3wGaAqI89QUc2HwU7bVFrLvLa019bJMj4az7WYmw1ajorD0C8dB2tLMjGdVHul_oEod0vyoCt-7I7qxZhkoW24ULSsmtPpSu0zV_gK0runwxjx1csxkHQP-MeoJry_F_D2jhgEmeJjamddbyT2TcQ7S3FS3uNDQyl6agzXq3rRdX9VlUatq9LpUCqL6U7WrA8JlEyFSJVm9W0pYaqjPiHiP47twkjl3txuKraV-Wkg4TrjlcMM3IqkMcAvySekuZGbIhjRscByTmDL-sESsMVG5dV8NU33HwnL9wLyZZ416JF927SfRTkF7DRrl-PRVX-lLNtmoXXSFCBdMfiUhvfWLR7r44ZxMRJCLacN1dw49XDyzANSfRmQySGmWhYUjUej6bLy9bdL5HP21O1u_9XUFWc_boI0a7tphBlMiUBGV7jAKlN9QrMAJVUBamHM3GmabbmVpFrvnuYd5bD_iJN0BY6cZb9lWDs6P6yHip8SoMO9VM8ykcdTfLOqp_IhlUkD3eZ0cSObuPHPs4HfiFHlG6qLLBtT_ytUeIDc5VMjA_6i0mKm85HhqWdB_MWoqE-aSPpAEtmQTLPUyyxpYrMYtWJ_OUqBxiU3CiV9G1QS8oU2gMq60w0OCDoy1F-oxnOLpJIrDhnDTAXlYnbFlYkEAIb9QDn7UDfitHrPqaUwShDHX7XXVbuYYJMIJs2XXnOViviNn5SbVkSDPyt4xi-UfPKpcTJCmmOSvZn-fs3BdO7oGdZC8UmBM6sVmgxOPL361DcEs6fsLKhqKwVLqDS-CYmT811dqja2CcnTmHIQrO6Wg_hEi5C1YW0iA1stpw461VDh86rHRslJSIn6kDJ9W_X-3vsTUpk62jUs6Bv1KkoyhcojCvgXtDr7ff5mTqTbzX9d76yVwW97xqA86SgntP-N6cNE2GcBKaXea32gjGskvFDV5w7-DGoxeZrNM1Ur5-S3ADFDE-A2mrQCxbm66xcB8KNK181k3QWLrlrKWKNMCZLgkFxuXbD2plxgPDWaqaJxFoDibjHHS94JXhBMu3KB6_CziqK7irU3OHsqEGc7ZDHS4araDurJUlr_UhH4UTsS9pOsxF5XniWdyNBdr6CKSrSC0SIw9YUi39X9CLp5mzWspRssOwUhd1ECVkLgOF8yv5g="
          }
        ]
      },
      "index": 0,
      "logprobs": {
        "content": [],
        "refusal": null
      }
    }
  ],
  "usage": {
    "completion_tokens": 629,
    "prompt_tokens": 13,
    "total_tokens": 642,
    "completion_tokens_details": {
      "reasoning_tokens": 384
    },
    "prompt_tokens_details": {
      "cached_tokens": 0
    }
  },
  "created": 1768384213,
  "object": "chat.completion",
  "service_tier": "default"
}
```

:::

## Multi-turn tool-calling scenarios: pass back reasoning_details and signature

When using Anthropic models such as Claude Opus 4.5 with `reasoning` enabled, in multi-turn tool-calling scenarios you **must pass back the previous turn’s `reasoning_details` (including the `signature` field) in full**, otherwise subsequent turns will not work properly.

::: warning Important

- **Background**: Claude Opus 4.5 natively uses the Anthropic Messages protocol, and Zenmux converts the Chat Completion protocol to the Messages protocol.
- **Issue**: When reasoning is enabled, the second turn in a tool-calling conversation must include the reasoning `signature` to verify the integrity and continuity of the reasoning content.
- **Solution**: Pass back the previous assistant message’s `reasoning` and `reasoning_details` fields in full.
  :::

### Request example

```json
{
  "model": "anthropic/claude-sonnet-4.5",
  "messages": [
    {
      "content": "今天是2025年8月15日，上海今天天气怎么样",
      "role": "user"
    },
    {
      "role": "assistant",
      "tool_calls": [
        {
          "function": {
            "name": "search_city_weather",
            "arguments": "{\"city\":\"上海\"}"
          },
          "id": "toolu_bdrk_01S7xyqV3GYLJYrvBC5SwtPP",
          "type": "function"
        }
      ],
      "content": "",
      "reasoning": "用户想知道2025年8月15日上海的天气情况。我需要使用search_city_weather函数来查询。\n\n参数：\n- city: \"上海\"\n- date: \"2025-08-15\"",
      "reasoning_details": [
        {
          "type": "reasoning.text",
          "text": "用户想知道2025年8月15日上海的天气情况。我需要使用search_city_weather函数来查询。\n\n参数：\n- city: \"上海\"\n- date: \"2025-08-15\"",
          "signature": "EscCCkgICxABGAIqQF3ngnbIR+15nndalNEqnr7vq0v0Hyvle+twPh2SCMpMmNKf1oXiRPsjZG6Z46M69x06wks+4jm4N4FO3RH2mkgSDLChkfyKfk3ZndjatxoMi+H4ghd4hlGd+MRVIjBLKGRIcRwXS09pK50C2/ygvhnTlVMPkcARYG3nXV2ZWr2IPRHzY9XAK6QBJeVrmcsqrAGoL7TTMBUsMqMkfXlcRYABi+OPDht/9BOPKnV1k0RIWnnqzLfx4MQ/WSvTALBchQkYbXtO2v1nn5EhG/b9FZ+ZjUK0pAObWxv8aAIK47N1cTK+OB+iByPvlFb2vi0gX7xVOQXrmR5FLH03/JzmtqLpjgX/uYCYHddOvZzTx65STtajQ94FVKS35XkmHlbOIXqi4j1FIAioP4oqvDXqlZOMh8IKMJypT2I3vF2eGAE=",
          "format": "anthropic-claude-v1",
          "index": 0
        }
      ]
    },
    {
      "role": "tool",
      "tool_call_id": "toolu_bdrk_01S7xyqV3GYLJYrvBC5SwtPP",
      "content": "{\"city\":\"上海市\",\"date\":\"2025-08-15\",\"week\":\"1\",\"dayweather\":\"多云\",\"nightweather\":\"多云\",\"daywind\":\"东南\",\"nightwind\":\"东南\",\"daypower\":\"1-3\",\"nightpower\":\"1-3\",\"daytemp_float\":\"35.0\",\"nighttemp_float\":\"28.0\"}"
    }
  ],
  "stream": false,
  "tools": [
    {
      "function": {
        "name": "search_city_weather",
        "description": "搜索城市天气",
        "parameters": {
          "type": "object",
          "properties": {
            "city": {
              "type": "string",
              "description": "城市名称"
            },
            "date": {
              "type": "string",
              "description": "yyyy-mm-dd格式的日期"
            }
          },
          "required": ["city", "date"],
          "additionalProperties": false
        }
      },
      "type": "function"
    }
  ],
  "reasoning": {
    "enabled": true
  }
}
```

### Key field notes

| Field                             | Description                                                                 |
| --------------------------------- | --------------------------------------------------------------------------- |
| `reasoning`                       | Reasoning text in the assistant message; optionally passed back             |
| `reasoning_details`               | **Must be passed back in full**, containing the detailed reasoning array    |
| `reasoning_details[].signature`   | **Most critical field**; the reasoning signature credential; pass unchanged |
| `reasoning_details[].format`      | Signature format identifier, e.g. `anthropic-claude-v1`                     |
| `reasoning_details[].type`        | Reasoning content type, e.g. `reasoning.text`                               |

### Workflow

1. **First request**: The user asks a question; the model returns an assistant message containing `tool_calls`, as well as `reasoning` and `reasoning_details` (including `signature`)
2. **Execute tools**: Your application executes the tool call and obtains the result
3. **Second request**: Pass back the previous assistant message (**including `reasoning` and `reasoning_details`**) together with the tool execution result (tool message)
4. **Model response**: The model generates the final answer based on the complete context