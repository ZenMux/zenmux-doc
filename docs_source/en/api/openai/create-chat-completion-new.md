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

The Create Chat Completion endpoint is compatible with OpenAI’s [Create Chat Completion](https://platform.openai.com/docs/api-reference/chat/create) API, and is used to run inference with chat-based LLMs.

All parameters that *may* be supported by models are listed below. Parameter support varies by model; for the exact parameters supported by each model, see the model’s details page.

## Request headers

### Authorization `string` <font color="red">Required</font>

Bearer Token authentication

### Content-Type `string` <font color="red">Required</font>

Request payload content type. The default is `application/json`.

## Request

### messages `array` <font color="red">Required</font>

Prompts provided to the model as a list of conversation messages. Depending on the model’s capabilities, supported message content types may vary (e.g., text, images, audio, video). For the exact supported parameters, refer to each model provider’s documentation.

Each element in `messages` represents one conversation message. Each message consists of `role` and `content`, as detailed below:

::: details Developer message `object`
Instructions provided by the developer that the model should follow regardless of what the user says. In `o1` and newer models, `developer` messages replace the previous `system` messages.

- content `string or array ` <font color="red">Required</font>

  The content of the Developer message.
  - Text content `string`

    The content of the Developer message.

  - Array of content parts `array`

    An array of typed content parts. For Developer messages, only the `text` type is supported.
    - text `string` <font color="red">Required</font>

      Text content.

    - type `string` <font color="red">Required</font>

      The type of the content part.

- role `string` <font color="red">Required</font>

  The role of the message author, which is `developer` in this case.

- name `string` <font color="gray">Optional</font>

  An optional participant name. Provides the model with information to distinguish between participants with the same role.
  :::

::: details System message `object`
Instructions provided by the developer that the model should follow regardless of what the user says. In `o1` and newer models, you should use `developer` messages for this purpose.

- content `string or array ` <font color="red">Required</font>

  The content of the System message.
  - Text content `string`

    The content of the System message.

  - Array of content parts `array`

    An array of typed content parts. For System messages, only the `text` type is supported.
    - text `string` <font color="red">Required</font>

      Text content.

    - type `string` <font color="red">Required</font>

      The type of the content part.

- role `string` <font color="red">Required</font>

  The role of the message author, which is `system` in this case.

- name `string` <font color="gray">Optional</font>

  An optional participant name. Provides the model with information to distinguish between participants with the same role.
  :::

::: details User message `object`  
A message sent to the model by the end user. In most chat scenarios, this is the only role you need.

- content `string or array` <font color="red">Required</font>

  The content of the User message.
  - Text content `string` <font color="red">Required</font>

    Plain text content, the most common usage.

  - Array of content parts `array` <font color="red">Required</font>

    An array of multimodal content parts. Depending on the model’s capabilities, it may include text, images, audio, and more. Common types include:
    - Text part
      - type `string` <font color="red">Required</font>, fixed to `text`
      - text `string` <font color="red">Required</font>, the text content

    - Image part (multimodal models only)
      - type `string` <font color="red">Required</font>, set to `image_url`
      - image_url `object` <font color="red">Required</font>
        - url `string` <font color="red">Required</font>, an image URL or a base64 Data URL
        - detail `string` <font color="gray">Optional</font>, typical values: `low` / `high` / `auto`, used to control image analysis fidelity

    - Audio part (audio-input models only)
      - type `string` <font color="red">Required</font>, set to `input_audio`
      - input_audio `object` <font color="red">Required</font>
        - data `string` <font color="red">Required</font>, base64 audio file content
        - format `string` <font color="red">Required</font>, e.g. `wav`, `mp3`

    - File part (File content part; models that support file input only)  
      Used to provide an entire file as context to the model (e.g., PDF, Office documents).
      - type `string` <font color="red">Required</font>, fixed to `file`
      - file `object` <font color="red">Required</font>
        - file_id `string` <font color="gray">Optional</font>
          - The file ID obtained from the file upload endpoint. This is the recommended way to reference a file.
        - file_data `string` <font color="gray">Optional</font>
          - Base64-encoded file data, used to include the file content directly in the request body.
        - filename `string` <font color="gray">Optional</font>
          - File name, used to hint the file type to the model or display it in the console.

- role `string` <font color="red">Required</font>

  The role of the message author, which is `user` in this case.

- name `string` <font color="gray">Optional</font>

  An optional participant name. Provides the model with information to distinguish between participants with the same role.  
  :::

::: details Assistant message `object`  
A reply message sent by the model to the user. You can include these historical assistant messages in new requests so the model can continue reasoning with the full context.

- content `string or array` Optional

  The content of the Assistant message. **Required when `tool_calls` or the (deprecated) `function_call` is not set.**
  - Text content `string`

    Plain-text assistant message content.

  - Array of content parts `array`

    An array of typed content parts. It may include one or more content parts of type `text`, or **exactly one** content part of type `refusal`.
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

  The role of the message author, which is `assistant` in this case.

- name `string` Optional

  An optional participant name. Provides the model with information to distinguish between participants with the same role.

- audio `object or null` Optional

  Data about a **previous model audio reply**, which can be referenced in subsequent turns.
  - id `string` <font color="red">Required</font>

    The unique identifier of the previous audio reply.

- tool_calls `array` Optional
  - Function tool call `object`
    - id `string` <font color="red">Required</font>

      Tool call ID, used to match `tool_call_id` in a subsequent Tool message.

    - type `string` <font color="red">Required</font>

      Tool type. Currently only `function` is supported.

    - function `object` <font color="red">Required</font>
      - name `string` <font color="red">Required</font>

        The function name to call.

      - arguments `string` <font color="red">Required</font>

        Function call arguments as a JSON string (generated by the model).  
        Note: the model does not guarantee strictly valid JSON, and may include parameters not defined in the function schema. Validate on the application side before calling.

    - Custom tool call `object`
      - id `string` <font color="red">Required</font>

        Tool call ID, used to match `tool_call_id` in a subsequent Tool message.

      - type `string` <font color="red">Required</font>

        Tool type, always `custom`.

      - custom `object` <font color="red">Required</font>
        - name `string` <font color="red">Required</font>

          The function name to call.

        - input `string` <font color="red">Required</font>

          The input for the custom tool call generated by the model.

- function_call `object or null` (Deprecated) Optional

  Superseded by `tool_calls` and kept only for compatibility with the legacy format. Indicates the function name and arguments that the model suggests calling.
  - name `string` <font color="red">Required</font>  
    The function name to call.

  - arguments `string` <font color="red">Required</font>  
     Function call arguments as a JSON string (generated by the model); likewise, this must be validated on the application side before actual execution.

:::

::: details Tool message `object`  
A message used to pass the execution result of an external tool (function) call back to the model.

- content `string or array` <font color="red">Required</font>

  The tool execution result content, usually text or structured data (serialized as a string).
  - Text content `string`

    The content of the Tool message.

  - Array of content parts `array`

    An array of typed content parts. For Tool messages, only the `text` type is supported.
    - text `string` <font color="red">Required</font>

      Text content.

    - type `string` <font color="red">Required</font>

      The type of the content part.

- role `string` <font color="red">Required</font>

  The role of the message author, which is `tool` in this case.

- tool_call_id `string` <font color="red">Required</font>

  Corresponds to `tool_calls[i].id` in an assistant message, used to associate this tool result with that call.

- name `string` <font color="gray">Optional</font>

  The tool name (usually consistent with the function name declared in `tools`).  
  :::

::: info Function message `object` <font color="red">Deprecated by the official API and not supported</font>
:::

### model `string` <font color="red">Required</font>

The model ID for this inference call, in the format `<provider>/<model_name>`, e.g. `openai/gpt-5`. You can obtain it from each model’s details page.

### max_completion_tokens `integer or null` <font color="gray">Optional</font>

Limits the length of the generated output, including the reasoning process. If omitted, the model’s default limit is used. Each model’s maximum output length can be found on its details page.

### temperature `number` <font color="gray">Optional</font>

- Default: `1`
- ZenMux does not enforce a range; values in `[0, 2]` are recommended.

Sampling temperature controlling randomness: higher values increase randomness; lower values make outputs more deterministic. Typically tune either this or `top_p`.

### top_p `number` <font color="gray">Optional</font>

- Default: `1`

Nucleus sampling parameter: sampling is restricted to tokens with cumulative probability mass up to `top_p`. For example, `top_p = 0.1` means only the top 10% probability mass is considered.

### n `integer or null` <font color="gray">Optional</font>

Number of candidate completions to return. Currently only `n=1` is supported.

### frequency_penalty `number or null` <font color="gray">Optional</font>

- Default: `0`
- Range: `-2.0` ~ `2.0`

Penalizes tokens that appear frequently. Larger values make the model less likely to repeat the same content, which can reduce repetitive output.

### presence_penalty `number or null` <font color="gray">Optional</font>

- Default: `0`
- Range: `-2.0` ~ `2.0`

Penalizes tokens based on whether they have **appeared at all**. Larger values encourage introducing new topics and reduce repeatedly discussing the same content.

### stop `string | array | null` <font color="gray">Optional</font>

- Default: `null`
- Up to 4 stop sequences can be provided.

When any stop sequence is generated, the model stops and the returned result does not include the stop sequence. Some newer reasoning models (e.g., `o3`, `o4-mini`) do not support this parameter.

### logit_bias `object` <font color="gray">Optional</font>

- Default: `null`

Used to fine-tune the sampling probability of specified tokens. Keys are token IDs (integers) from the tokenizer; values are biases from `-100` to `100`.

- Positive values: increase the likelihood the token is selected
- Negative values: decrease the likelihood the token is selected
- Extreme values (e.g., ±100): close to forcibly banning or forcing the token

### logprobs `boolean or null` <font color="gray">Optional</font>

- Default: `false`

Whether to include log probability information for output tokens in the response.

### top_logprobs `integer` <font color="gray">Optional</font>

Specifies the **number of highest-probability tokens** returned per position (0–20), each with its logprob.

### tools `array` <font color="gray">Optional</font>

Declares the list of tools the model may call in this conversation. Each element may be a custom tool or a function tool (a JSON-Schema-defined function).

### tool_choice `string or object` <font color="gray">Optional</font>

Controls the model’s tool usage strategy: ([platform.openai.com](https://platform.openai.com/docs/api-reference/chat))

- `"none"`: do not call any tools
- `"auto"`: the model decides whether to call tools and which tools to call
- `"required"`: the model must call at least one tool in this turn
- Specify a single tool: `{"type": "function", "function": {"name": "my_function"}}`

### parallel_tool_calls `boolean` <font color="gray">Optional</font>

- Default: `true`

Whether to allow the model to call multiple tools (functions) **in parallel** within a single response.

### reasoning_effort `string` <font color="gray">Optional</font> (Reasoning models)

Controls how much effort a **reasoning model** invests in thinking: `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, etc. Default values and supported ranges vary by model.

### verbosity `string` <font color="gray">Optional</font>

- Default: `"medium"`

Constrains the verbosity of the model output: `low` (concise), `medium` (balanced), `high` (more detailed).

### web_search_options `object` <font color="gray">Optional</font>

Configures the behavior of the **web search tool**, allowing the model to proactively retrieve the latest information from the internet before generating an answer.

### metadata `object` <font color="gray">Optional</font>

Allows up to 16 key-value pairs to be attached as structured business metadata for easier querying in logs, search, or management UIs.

### stream `boolean or null` <font color="gray">Optional</font>

- Default: `false`

Whether to enable **streaming output** (Server-Sent Events). When `true`, the result is returned in chunks as an event stream.

### stream_options `object` <font color="gray">Optional</font>

Only effective when `stream: true`. Used to configure streaming behavior, such as including usage information at the end of the stream.

### provider `object` <font color="gray">Optional</font>

Used to configure routing and failover for this request across multiple model providers (e.g., OpenAI, Anthropic, Google).
If not provided, the project or model’s default routing policy is used.

#### routing `object` <font color="red">Required</font>

Routing policy configuration, determining how to select and distribute requests across multiple providers.

##### type `string` <font color="red">Required</font>

Routing type. Supported values:

- `priority`
  Select providers in priority order: try the first; if it fails, try the next (can be used with fallback).
- `round_robin`
  Round-robin distribution: evenly distribute traffic across providers.
- `least_latency`
  Lowest-latency first: select the currently fastest provider based on historical/real-time statistics.

##### primary_factor `string` <font color="gray">Optional</font>

The primary factor when multiple providers are available. For example:

- `cost`
  Prefer lower-cost providers
- `speed`
  Prefer faster-response providers
- `quality`
  Prefer higher-quality providers (e.g., stronger models / more stable service)

Actual behavior is combined with `type`. For example, when `type = "priority"`, `primary_factor` mainly influences priority ordering.

##### providers `array` <font color="red">Required</font>

List of model providers that can participate in routing. Example: `["openai", "anthropic", "google"]`

#### fallback `string` <font color="gray">Optional</font>

Failover policy. When the selected provider returns an error (e.g., timeout, insufficient quota, service unavailable), this controls how automatic switching occurs:

`"true"`: enable automatic failover. When the current provider is unavailable, automatically try other available providers according to the routing policy.

`"false"`: disable failover. If the current provider call fails, return the error directly and do not try other providers.

`"<provider_name>"`: explicitly specify a fixed fallback provider, e.g. `"anthropic"`:

Prefer the provider selected by the primary routing policy
If it fails, switch to the specified fallback provider
If both primary + fallback fail, return an error

### model_routing_config `object` <font color="gray">Optional</font>

Used to configure selection and routing within **different models under the same provider** for this request (e.g., how to choose among `gpt-4o`, `gpt-4-turbo`, `claude-3-5-sonnet`).

If not provided, the project or SDK default model selection policy is used (e.g., default model, default task-type mapping, etc.).

#### available_models `array` <font color="red">Required</font>

A list of **model names** that can participate in routing or be considered as candidates.

#### preference `string` <font color="gray">Optional</font>

Preferred model name.

#### task_info `object` <font color="gray">Optional</font>

Task metadata used to determine the specific model or parameters **based on task type and complexity**.

Internal fields:

##### task_type `string` <font color="red">Required</font>

Task type, used to express the purpose of the request for routing or automatic parameter selection.

- Example values:
  - `"chat"` — conversational tasks (multi-turn chat, assistant Q&A)
  - `"completion"` — general text generation/completion
  - `"embedding"` — vectorization/semantic embedding
- Uses:
  - Set different default models or quota policies per task type
  - Combine with `complexity` to decide whether to use a stronger model

##### complexity `string` <font color="gray">Optional</font>

Task complexity, describing the difficulty or importance of the request.

- Supported values:
  - `"low"` — simple tasks (short answers, simple rewrites)
  - `"medium"` — medium complexity (general Q&A, basic code, routine analysis)
  - `"high"` — high complexity (long-document analysis, complex programming, large-scale reasoning)
- Uses:
  - Select different tiers of models (e.g., cheaper models for low complexity, stronger models for high complexity)
  - Control timeouts, retry policies, etc.

##### additional_properties `object` <font color="gray">Optional</font>

Additional task-related fields as a freely extensible key-value map.

#### additional_properties `object` <font color="gray">Optional</font>

Additional fields for the model routing configuration itself, used to attach extra control information beyond the standard structure.

### reasoning `object` <font color="gray">Optional</font>

Used to configure behavior related to the **reasoning process (chain-of-thought / reasoning trace)**, including whether it’s enabled, depth/length controls, and whether reasoning content is exposed.

If not provided, the system or model uses the default reasoning policy.

#### enabled `boolean` <font color="red">Required</font>

Whether to enable an explicit reasoning process.

- `true`: the model uses (and, when allowed, outputs) more detailed reasoning steps
- `false`: the model provides only a conclusion-level answer without explicitly expanding reasoning (or expands as little as possible)

#### effort `string` <font color="gray">Optional</font>

Reasoning effort level, used to balance **thinking depth / reasoning granularity** against **cost / latency**.

- Supported values:
  - `"low"` — lightweight reasoning: faster answers with fewer details
  - `"medium"` — moderate reasoning: a balanced choice for most tasks
  - `"high"` — deep reasoning: more detailed analysis, higher token usage and latency
- Typical usage:
  - Latency-sensitive online services: prefer `"low"` or `"medium"`
  - High-accuracy tasks: prefer `"high"`

#### max_tokens `number` <font color="gray">Optional</font>

Maximum token limit for the reasoning process (not the final answer).

#### exclude `boolean` <font color="gray">Optional</font>

Whether to **exclude the reasoning process from the user-facing output**.

- `false`:
  - Reasoning content may be returned together with the final answer (e.g., during debugging or tool development)
- `true`:
  - Reasoning content is used internally only and not exposed to the user (typical production setting)
- Uses:
  - Meet safety and compliance requirements (do not expose chain-of-thought)
  - During development/debugging, set to `false` to observe model reasoning and iterate on prompts and policies

#### usage `object` <font color="gray">Optional</font>

Usage statistics

##### include `boolean` <font color="red">Required</font>

Whether to include usage statistics in the response.

### response_format `object` <font color="gray">Optional</font>

An object that specifies a required output format for the model.

Set to `{ "type": "json_schema", "json_schema": {...} }` to enable structured outputs and ensure the model matches your provided JSON schema.

Set to `{ "type": "json_object" }` to enable legacy JSON mode and ensure the model generates valid JSON. For models that support it, `json_schema` is preferred.

:::details Text `object`

- type `string` <font color="red">Required</font>
  The type of the response format being defined. Always `text`.

:::

:::details JSON schema `object`

- json_schema `object` <font color="red">Required</font>
  The JSON schema that defines the response format.
  - name `string` <font color="red">Required</font>
    The name of the response format. Must be a-z, A-Z, 0-9, or include underscores and hyphens; max length is 64.
  - schema `object` <font color="gray">Optional</font>
    The response format schema, described as a JSON Schema object.
  - strict `boolean` <font color="gray">Optional</font>
    Whether to strictly follow the JSON schema.
  - description `string` <font color="gray">Optional</font>
    A description of the response format’s purpose; the model uses it to determine how to respond in that format.
- type `string` <font color="red">Required</font>
  The type of the response format being defined. Always `json_schema`.

:::

:::details JSON object `object`

- type `string` <font color="red">Required</font>
  The type of the response format being defined. Always `json_object`.

:::

### Unsupported fields

| Field name              | Type          | Supported                                           | Notes                                                                                  |
| ----------------------- | ------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------- |
| audio                   | object/null   | <span style="white-space: nowrap;">❌ Not supported</span> | Audio output parameters                                                                 |
| modalities              | array         | ❌ Not supported                                    | Output modalities                                                                       |
| functions               | array         | ❌ Not supported                                    | Deprecated; not accepted                                                                |
| function_call           | string/object | ❌ Not supported                                    | Deprecated; not accepted                                                                |
| prompt_cache_key        | string        | ❌ Not supported                                    | Prompt cache key                                                                        |
| prompt_cache_retention  | string        | ❌ Not supported                                    | Cache retention policy                                                                  |
| safety_identifier       | string        | ❌ Not supported                                    | Safety identifier                                                                       |
| store                   | bool/null     | ❌ Not supported                                    | Store this conversation                                                                 |
| service_tier            | string        | ❌ Not supported                                    | Service tier                                                                            |
| prediction              | object        | ❌ Not supported                                    | Predicted output configuration                                                          |
| seed                    | int/null      | ❌ Not supported                                    | Sets a random seed for sampling; marked deprecated.                                     |
| user                    | string        | ❌ Not supported                                    | Legacy user identifier field, largely replaced by `safety_identifier` and `prompt_cache_key`. |
| max_tokens              | int/null      | ❌ Not supported                                    | Deprecated; replaced by `max_completion_tokens`                                         |

## Response

### Non-streaming: returns a “full chat completion object”

When `stream: false` (or omitted), the API returns a complete **chat.completion** object. Field descriptions are expanded in the same order as the table above.

---

### Top-level field: `choices`

#### choices `array`

A list of chat completion choices. Corresponds 1:1 to the request’s `n`. Currently only `n = 1` is supported, so it typically contains just one element.

---

### choices[i] object

#### finish_reason `string`

The reason the model stopped generating tokens. Common values:

- `stop`: reached a natural stopping point or hit a stop sequence
- `length`: reached the maximum token limit specified in the request
- `content_filter`: content was omitted due to a content filter
- `tool_calls`: the model invoked tools (`tool_calls`)
- `function_call`: the model invoked a function (legacy, deprecated)

#### index `integer`

The index of this choice in the `choices` array, starting from 0.

#### logprobs `object`

Log probability information for this choice, used to analyze probability distributions for each output token. Present only when `logprobs`-related parameters are set in the request.

---

### choices[i].logprobs.content

#### content `array`

A list of “message content tokens” with log probability information. Each element describes a token and its candidate tokens:

- bytes `array`  
  A list of integers representing the UTF‑8 byte representation of the token. In some languages or for emoji, a character may span multiple tokens; combining these bytes can reconstruct the correct text. If the token has no byte representation, this is `null`.

- logprob `number`  
  The log probability of the token. If it is not among the top 20 most likely tokens, `-9999.0` is commonly used to indicate “extremely unlikely”.

- token `string`  
  The text representation of the current output token.

- top_logprobs `array`  
  A list of the most likely candidate tokens at this position and their log probabilities. In rare cases, the actual number returned may be less than requested.
  - bytes `array`  
    The UTF‑8 byte representation of the candidate token; `null` if not available.
  - logprob `number`  
    The candidate token’s log probability.
  - token `string`  
    The text of a candidate token.

---

### choices[i].logprobs.refusal

#### refusal `array`

A list of “refusal content tokens” with log probability information. Used to analyze token probabilities when the model outputs a refusal message.

- bytes `array`  
  The UTF‑8 byte representation of the refusal token; `null` if not available.
- logprob `number`  
  The refusal token’s log probability. If it is not among the top 20, it is typically `-9999.0`.
- token `string`  
  The text of a token in the refusal content.
- top_logprobs `array`  
  A list of the most likely refusal token candidates at this position.
  - bytes `array`  
    The UTF‑8 byte representation of a candidate refusal token.
  - logprob `number`  
    The candidate refusal token’s log probability.
  - token `string`  
    The text of a candidate token in the refusal content.

---

### choices[i].message

#### message `object`

The full chat completion message generated by the model.

---

### choices[i].message fields

#### reasoning `string` (ZenMux extension)

Text of the reasoning process, used to show the model’s thought process or intermediate analysis. Whether it is returned depends on the model and the reasoning configuration in the request.

#### reasoning_content `string` (ZenMux extension)

The main body of the reasoning content, usually more complete or detailed than `reasoning`, and can serve as the primary carrier for chain-of-thought.

#### content `string`

The main content of the message, typically the model’s natural-language reply to the user. Some multimodal models may return structured content, but overall it follows the OpenAI chat format.

#### refusal `string or null`

If the model refuses to perform the user request in this turn, this contains the refusal message text generated by the model; otherwise it is `null`.

#### role `string`

The author role of the message. For model reply messages, it is `"assistant"`.

#### annotations `array`

A list of annotations for the message. When using tools such as web search, it is used to carry URL citations and similar information.

- type `string`  
  The type of URL citation. Currently fixed to `url_citation`.
- url_citation `object`  
  URL citation details when using web search.
  - end_index `integer`  
    The index of the last character of the URL citation in the message `content`.
  - start_index `integer`  
    The index of the first character of the URL citation in the message `content`.
  - title `string`  
    Title of the web resource.
  - url `string`  
    The URL of the web resource.

#### audio `object`

When an audio output modality is requested, this object contains the model’s audio response data.

- data `string`  
  Base64-encoded audio bytes generated by the model; the format is specified in the request.
- expires_at `integer`  
  Unix timestamp (seconds) after which the audio response is no longer available server-side for subsequent multi-turn conversations.
- id `string`  
  Unique identifier for this audio response.
- transcript `string`  
  The transcript (text) corresponding to the audio content.

#### function_call `object`

Deprecated function-call field. Replaced by `tool_calls` and retained only for compatibility with legacy formats. Indicates the function name and arguments the model suggests calling.

- arguments `string`  
  Function arguments as a JSON string. Note that the model does not guarantee strictly valid JSON and may include fields not defined in the schema; you must parse and validate before calling.
- name `string`  
  The function name to call.

#### tool_calls `array`

New tool call list. Each element describes a tool call, which can be a “function tool call” or a “custom tool call”. Models may call multiple tools in parallel in a single response.

- id `string`  
  Unique ID for the tool call, used to match `tool_call_id` in subsequent `tool` messages.
- type `string`  
  Tool type. The current standard is `function`; ZenMux may support other types such as `custom` via extensions.
- function `object`  
  When `type = "function"`, represents the function the model calls.
  - arguments `string`  
    Function call arguments as a JSON string. The model may not always generate valid JSON and may produce fields not defined in the schema; validate before calling.
  - name `string`  
    The function name to call.

---

### Top-level fields: metadata and usage

#### created `integer`

Unix timestamp (seconds) when the chat completion was created.

#### id `string`

Unique identifier for this chat completion.

#### model `string`

The model identifier used to generate this completion, e.g. `openai/gpt-5`.

#### object `string`

Object type. For non-streaming responses, this is always `chat.completion`.

#### service_tier `string`

The service type/tier used to handle the request. ZenMux does not restrict values; if the upstream model returns this field, it will be passed through.

#### system_fingerprint `string`

A fingerprint of the backend configuration used for this request, used to identify the underlying service version or cluster. Passed through if provided upstream.

#### usage `object`

Usage statistics for this request, including prompt and completion token counts.

- completion_tokens `integer`  
  Number of tokens used in the generated completion.
- prompt_tokens `integer`  
  Number of tokens used in the input prompt (messages, etc.).
- total_tokens `integer`  
  Total tokens used in the request (`prompt_tokens + completion_tokens`).

- completion_tokens_details `object`  
  Further breakdown of completion tokens.
  - accepted_prediction_tokens `integer`  
    When using Predicted Outputs, the number of predicted tokens that actually appear in the completion. This field is generally not used by current models.
  - audio_tokens `integer`  
    Number of tokens consumed by the model’s audio output.
  - reasoning_tokens `integer`  
    Number of tokens generated for reasoning (even if not fully displayed to the user, they still count toward usage).
  - rejected_prediction_tokens `integer`  
    When using Predicted Outputs, the number of predicted tokens that did not appear in the completion; these tokens still count toward billing and context window limits. Generally not used by current models.

- prompt_tokens_details `object`  
  Breakdown of prompt tokens.
  - audio_tokens `integer`  
    Number of tokens consumed by audio inputs in the prompt.
  - cached_tokens `integer`  
    Number of tokens in the prompt that were served from cache (Prompt Caching).

---

### Streaming: returns multiple “chat completion chunk object” events

When `stream: true`, the API returns **chat.completion.chunk** objects multiple times via SSE (Server‑Sent Events). The client must consume and concatenate them in order. Field descriptions below are also expanded in the same order as the table.

---

### Top-level field: `choices` (streaming chunks)

#### choices `array`

A list of chat completion choices. If `n > 1`, it may contain multiple elements. When `stream_options: {"include_usage": true}` is set, the final chunk may have an empty `choices` array and include only `usage` information.

---

### choices[i] (Chunk) object

#### delta `object`

Incremental conversational content generated by the streaming response—i.e., what is “new” relative to previous chunks.

- reasoning `string` (ZenMux extension)  
  Incremental text for the reasoning process, streamed chunk by chunk.
- reasoning_content `string` (ZenMux extension)  
  Incremental fragments of the reasoning body, typically used together with `reasoning` to assemble full reasoning text.
- content `string`  
  Incremental message body content for this chunk. Clients should concatenate `content` across chunks to form the full reply.
- function_call `object` (Deprecated)  
  Incremental legacy function-call information. Replaced by `tool_calls`, but still parseable.
  - arguments `string`  
    Incremental JSON fragment for function arguments; must be concatenated across chunks before parsing.
  - name `string`  
    The function name to call, typically present in the first chunk of the call.

- refusal `string`  
  Incremental refusal message fragment for this chunk.
- role `string`  
  The author role for this message, usually `"assistant"` in the first chunk.
- tool_calls `array`  
  List of incremental tool-call information.

  For each incremental tool-call element:
  - index `integer`  
    The position of this tool call in the `tool_calls` array.
  - function `object`  
    Incremental function tool-call info.
    - arguments `string`  
      Incremental fragment of the JSON string for function arguments; concatenate across chunks before parsing.
    - name `string`  
      The function name to call, typically provided at the start of the tool call.

  - id `string`  
    Tool call ID, typically provided on first occurrence for later association with `tool` messages.
  - type `string`  
    Tool type. Currently only `function` is supported.

#### finish_reason `string or null`

The reason generation stopped in the current chunk:

- `stop`: natural end or hit a stop sequence
- `length`: reached the maximum token limit
- `content_filter`: content was filtered
- `tool_calls`: triggered tool calling
- `function_call`: triggered legacy function calling
- `null`: generation has not finished; more chunks will follow

#### index `integer`

The index of this choice in the `choices` array.

#### logprobs `object`

Log probability information for this choice in the current chunk. Same structure as non-streaming `logprobs`, but only for newly generated tokens.

---

### choices[i].logprobs.content (streaming)

#### content `array`

A list of newly generated “message content tokens” in the current chunk.

- bytes `array`  
  UTF‑8 byte representation of the current token.
- logprob `number`  
  Log probability of the current token; `-9999.0` if not among the top 20 most likely tokens.
- token `string`  
  Text representation of the current output token.
- top_logprobs `array`  
  List of the most likely candidate tokens at this position.
  - bytes `array`  
    UTF‑8 byte representation of a candidate token.
  - logprob `number`  
    Log probability of the candidate token.
  - token `string`  
    Text of a candidate token.

---

### choices[i].logprobs.refusal (streaming)

#### refusal `array`

A list of newly generated “refusal content tokens” in the current chunk.

- bytes `array`  
  UTF‑8 byte representation of the refusal token.
- logprob `number`  
  Log probability of the refusal token; `-9999.0` for low probability.
- token `string`  
  Text of a token in the refusal content.
- top_logprobs `array`  
  List of the most likely candidate refusal tokens at this position.
  - bytes `array`  
    UTF‑8 byte representation of a candidate refusal token.
  - logprob `number`  
    Log probability of the candidate refusal token.
  - token `string`  
    Text of a candidate refusal token.

---

### Other top-level streaming fields

#### created `integer`

Unix timestamp (seconds) when the chat completion was created. This value is the same across all chunks in the same stream.

#### id `string`

Unique identifier for the chat completion. All chunks in the same stream share the same `id`.

#### model `string`

The model name used for this chat completion.

#### object `string`

Object type. For streaming responses, this is always `chat.completion.chunk`.

#### service_tier `string`

Service type/tier used to process the request. Passed through if returned by the upstream model.

#### system_fingerprint `string`

Fingerprint of the backend configuration used for this request. Although some upstreams mark it as deprecated, ZenMux still preserves and passes through this field.

---

### usage `object` (included only in the final chunk)

When `stream_options: {"include_usage": true}` is set in the request, the final chunk will include a `usage` object with the same structure as the non-streaming response.

- completion_tokens `integer`  
  Number of completion tokens.
- prompt_tokens `integer`  
  Number of prompt tokens.
- total_tokens `integer`  
  Total tokens used in the request.

- completion_tokens_details `object`  
  Breakdown of completion tokens.
  - accepted_prediction_tokens `integer`  
    Number of accepted predicted output tokens.
  - audio_tokens `integer`  
    Number of audio-related tokens generated by the model.
  - reasoning_tokens `integer`  
    Number of tokens used by the model for reasoning.
  - rejected_prediction_tokens `integer`  
    Number of predicted output tokens not used but still counted toward usage.

- prompt_tokens_details `object`  
  Breakdown of prompt tokens.
  - audio_tokens `integer`  
    Number of audio input tokens in the prompt.
  - cached_tokens `integer`  
    Number of cached tokens in the prompt.

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