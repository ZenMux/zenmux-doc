---
pageClass: api-page
title: Responses API (OpenAI Responses API)
---

# Create a Model Response

```
POST https://zenmux.ai/api/v1/responses
```

The Create a Model Response endpoint is compatible with OpenAI’s [Create a Model Response](https://platform.openai.com/docs/api-reference/responses/create?lang=curl) endpoint. It is used to create a single model response (supports text/image/file inputs; text or structured JSON outputs; built-in tools and function calling, etc.).

Below is a list of all parameters that may be supported by different models. Parameter support varies by model; for the exact parameters supported by each model, see the model’s detail page.

## Request headers

### Authorization `string` <font color="red">Required</font>

Bearer token authentication.

### Content-Type `string` <font color="red">Required</font>

Request content type. Default is `application/json`.

## Request body

### model `string` <font color="red">Required</font>

The model ID for this inference call, in the format `<provider>/<model_name>`, e.g., openai/gpt-5. You can find it on each model’s detail page.

### input `string | array` <font color="gray">Optional</font>

The content passed to the model.

#### `string`

- Treated as plain-text input (equivalent to a single `user` text input).

#### `array` (Input item list)

Each element in the array is an **Item** (a context item). It can include messages, images, files, tool outputs, references, etc. Possible types include:

##### 1. Input message `object`

- type `string` <font color="gray">Optional</font>: fixed to `message`
- role `string` <font color="red">Required</font>: `user` / `assistant` / `system` / `developer`
- content `string | array` <font color="red">Required</font>: message content
  - If `string`: plain text
  - If `array`: a list of content parts (see Input content parts below)

:::details Input content parts (possible input content part types)

1. Input text `object`

- type `string` <font color="red">Required</font>: `input_text`
- text `string` <font color="red">Required</font>: text content

2. Input image `object`

- type `string`: `input_image` <font color="red">Required</font>
- detail `string`: `high` / `low` / `auto` <font color="red">Required</font>: image processing detail level; affects token usage and recognition accuracy
- file_id `string` <font color="gray">Optional</font>: ID of an uploaded file
- image_url `string` (URL or data URL/base64) <font color="gray">Optional</font>: image URL or base64-encoded data

3. Input file `object`

- type `string`: `input_file` <font color="red">Required</font>
- file_data `string` <font color="gray">Optional</font>: base64-encoded file data
- file_id `string`<font color="gray">Optional</font>: ID of an uploaded file
- file_url `string`<font color="gray">Optional</font>: file URL
- filename `string`<font color="gray">Optional</font>: file name

:::

##### 2. Item types overview

:::details Input message `object`

- type `string` <font color="gray">Optional</font>: fixed to `message`
- role `string` <font color="red">Required</font>: `user` / `assistant` / `system` / `developer`
- status `string` <font color="gray">Optional</font>: `in_progress` / `completed` / `incomplete` item status
- content `string | array` <font color="red">Required</font>: message content
  - If `string`: plain text
  - If `array`: a list of content parts; each element can be `input_text` / `input_image` / `input_file` (same as above)

:::

:::details Output message (model output message) `object`

(Used when you “feed back the model’s previous output message item” into `input`.)

- type `string`<font color="red">Required</font>: `message`
- role `string`<font color="red">Required</font>: fixed to `assistant`
- id `string`<font color="red">Required</font>: unique ID of the output message
- status `string`<font color="red">Required</font>: `in_progress` / `completed` / `incomplete`
- content `array`<font color="red">Required</font>: list of **Output content parts** (see below)

###### Output content parts (possible output content part types)

- type `string`<font color="red">Required</font>: `output_text`
- text `string`<font color="red">Required</font>: output text
- annotations `array`<font color="red">Required</font>: annotations (see below)
- logprobs `array`<font color="red">Required</font>: logprobs (see below)

**annotations** element types:

- File citation `object`
  - type `string`<font color="red">Required</font>: `file_citation`
  - file_id `string`<font color="red">Required</font>: cited file ID
  - filename `string`<font color="red">Required</font>: cited file name
  - index `integer`<font color="red">Required</font>: starting index position in the text
- URL citation `object`
  - type `string`<font color="red">Required</font>: `url_citation`
  - start_index `integer`<font color="red">Required</font>: starting index position of the citation in the text
  - end_index `integer`<font color="red">Required</font>: ending index position of the citation in the text
  - title `string`<font color="red">Required</font>: cited page title
  - url `string`<font color="red">Required</font>: cited page URL
- Container file citation `object`
  - type `string`<font color="red">Required</font>: `container_file_citation`
  - container_id `string`<font color="red">Required</font>: container file ID
  - file_id `string`<font color="red">Required</font>: actual cited file ID
  - filename `string`<font color="red">Required</font>: cited file name
  - start_index `integer`<font color="red">Required</font>: starting index position of the citation in the text
  - end_index `integer`<font color="red">Required</font>: ending index position of the citation in the text
- File path `object`
  - type `string`<font color="red">Required</font>: `file_path`
  - file_id `string`<font color="red">Required</font>: file ID
  - index `integer`<font color="red">Required</font>: index position in the list

**logprobs** (each element is logprob info for one token; field hierarchy below):

- bytes `array`<font color="red">Required</font>: byte representation of the token
- logprob `number`<font color="red">Required</font>: token log probability
- token `string`<font color="red">Required</font>: token text
- top_logprobs `array`<font color="red">Required</font>: most likely candidate tokens (each element includes `bytes` / `logprob` / `token`)

2. Refusal `object`

- type `string`<font color="red">Required</font>: `refusal`
- refusal `string`<font color="red">Required</font>: explanation for why the model refused to answer

:::

:::details Function tool call `object`

The model initiates a call to a **function tool**.

- type `string`: `function_call` <font color="red">Required</font>
- call_id `string` <font color="red">Required</font>: unique identifier for the function call
- name `string` <font color="red">Required</font>: name of the function to call
- arguments `string` <font color="red">Required</font>: function arguments as a JSON string
- id `string` <font color="gray">Optional</font>: unique item ID
- status `string` <font color="gray">Optional</font>: call status, `in_progress` / `completed` / `incomplete`

:::

:::details Function tool call output (function tool output) `object`

Send the result of executing the function back to the model (for the next step of reasoning).

- type `string`: `function_call_output` <font color="red">Required</font>
- call_id `string`<font color="red">Required</font>: corresponding function call identifier
- output `string | array` <font color="red">Required</font>: function execution result, either a string or a list of content parts
- id `string` <font color="gray">Optional</font>: unique output item ID
- status `string` <font color="gray">Optional</font>: output status, `in_progress` / `completed` / `incomplete`

> When `output` is an `array`, elements can be `input_text` / `input_image` / `input_file` (same as above).

:::

:::details Custom tool call `object`

The model initiates a call to a “custom tool” (you must execute it on your side).

- type `string`: `custom_tool_call`<font color="red">Required</font>
- call_id `string`<font color="red">Required</font>: unique identifier for the custom tool call
- name `string`<font color="red">Required</font>: name of the custom tool to call
- input `string`<font color="red">Required</font>: input passed to the tool
- id `string` <font color="gray">Optional</font>: unique item ID

:::

:::details Custom tool call output (custom tool output) `object`

Send the execution result of the custom tool back to the model.

- type `string`: `custom_tool_call_output`<font color="red">Required</font>
- call_id `string`<font color="red">Required</font>: corresponding custom tool call identifier
- output `string | array`<font color="red">Required</font>: tool result, either a string or a list of content parts
- id `string`<font color="gray">Optional</font>: unique output item ID

> When `output` is an `array`, elements can be `input_text` / `input_image` / `input_file` (same as above).

:::

:::details Web search tool call `object`

- type `string`<font color="red">Required</font>: `web_search_call`
- id `string`<font color="red">Required</font>: unique ID for the web search tool call
- status `string`<font color="red">Required</font>
- action `object`<font color="red">Required</font>: describes what the web tool did in this call (search/open_page/find)

###### Possible action types

1. Search action `object`

- type `string`<font color="red">Required</font>: action type, fixed to `search`
- query `string`<font color="red">Required</font>: search query (deprecated)
- queries `array`<font color="gray">Optional</font>: list of search queries
- sources `array`<font color="gray">Optional</font>: list of sources
  - each source:
    - type `string`<font color="red">Required</font>: `url`
    - url `string`<font color="red">Required</font>: source URL

2. Open page action `object`

- type `string`<font color="red">Required</font>: action type, fixed to `open_page`
- url `string`<font color="red">Required</font>: page URL to open

3. Find action `object`

- type `string`<font color="red">Required</font>: action type, fixed to `find`
- url `string`<font color="red">Required</font>: page URL to search
- pattern `string`<font color="red">Required</font>: search pattern or keyword

:::

<!-- :::details File search tool call (file search tool call) `object`

- type `string`<font color="red">Required</font>: `file_search_call`
- id `string`<font color="red">Required</font>: unique ID for the file search tool call
- queries `array`<font color="red">Required</font>: list of query strings
- status `string`<font color="red">Required</font>: search status, `in_progress` / `searching` / `incomplete` / `failed`
- results `array`<font color="gray">Optional</font>: list of results

###### results element schema `object`

- attributes `map`<font color="gray">Optional</font>: file metadata key-value pairs (up to 16 pairs)
- file_id `string`<font color="gray">Optional</font>: matched file ID
- filename `string`<font color="gray">Optional</font>: matched file name
- score `number`<font color="gray">Optional</font>: relevance score, 0~1 (1 = exact match)
- text `string`<font color="gray">Optional</font>: relevant text snippet retrieved from the file

::: -->

:::details Computer tool call (Computer Use call) `object`

The model initiates a Computer Use action (you must execute it on your side). After execution, send results such as screenshots back via `computer_call_output`.

- type `string`<font color="red">Required</font>: `computer_call`
- call_id `string` <font color="red">Required</font>: unique identifier for the computer use call
- action `object` <font color="red">Required</font>: parameters for the specific computer action (see Action types below)
- pending_safety_checks `array` <font color="gray">Optional</font>: list of safety checks pending user confirmation
  - id `string` <font color="gray">Optional</font>: unique safety check identifier
  - code `string` <font color="gray">Optional</font>: safety check code
  - message `string` <font color="gray">Optional</font>: safety check message
- id `string` <font color="gray">Optional</font>: unique item identifier
- status `string` <font color="gray">Optional</font>: call status, `in_progress` (in progress) / `completed` (completed) / `incomplete` (incomplete)

###### Action types (possible `action` variants)

###### Click `object`

- type `string`: `click` <font color="red">Required</font>: action type, fixed to `click`
- x `number` <font color="red">Required</font>: click X coordinate (pixels)
- y `number` <font color="red">Required</font>: click Y coordinate (pixels)
- button `string` <font color="gray">Optional</font>: mouse button, `left` / `right` / `middle`

###### Double click `object`

- type `string`: `double_click` <font color="red">Required</font>: action type, fixed to `double_click`
- x `integer` <font color="red">Required</font>: double-click X coordinate (pixels)
- y `integer` <font color="red">Required</font>: double-click Y coordinate (pixels)

###### Move `object`

- type `string`: `move` <font color="red">Required</font>: action type, fixed to `move`
- x `integer` <font color="red">Required</font>: target X coordinate (pixels)
- y `integer` <font color="red">Required</font>: target Y coordinate (pixels)

###### Screenshot `object`

- type `screenshot`：`screenshot` <font color="red">Required</font>: action type, fixed to `screenshot`

###### Drag `object`

- type `string`: `drag` <font color="red">Required</font>: action type, fixed to `drag`
- path `array` <font color="red">Required</font>: list of coordinates for the drag path
  - x `integer` <font color="red">Required</font>: X coordinate (pixels)
  - y `integer` <font color="red">Required</font>: Y coordinate (pixels)

###### Scroll `object`

- type `string`: `scroll` <font color="red">Required</font>: action type, fixed to `scroll`
- x `integer` <font color="gray">Optional</font>: scroll anchor X (pixels; provided by some implementations)
- y `integer` <font color="gray">Optional</font>: scroll anchor Y (pixels)
- scroll_x `integer` <font color="gray">Optional</font>: horizontal scroll distance (pixels)
- scroll_y `integer` <font color="gray">Optional</font>: vertical scroll distance (pixels)

###### Type `object`

- type `string`: `type` <font color="red">Required</font>: action type, fixed to `type`
- text `string` <font color="red">Required</font>: text to type

###### Keypress `object`

- type `string`: `keypress` <font color="red">Required</font>: action type, fixed to `keypress`
- keys `array` <font color="red">Required</font>: key combo to press, e.g. `["CTRL","L"]` means Ctrl+L

###### Wait `object`

- type `string`: `wait` <font color="red">Required</font>: action type, fixed to `wait`

:::

:::details Computer tool call output (Computer Use output) `object`

- type `string`<font color="red">Required</font>: `computer_call_output`
- call_id `string`<font color="red">Required</font>: corresponding computer use call identifier
- output `object`: output of the computer action (e.g., screenshots)
  - type `string`: `computer_screenshot`: output type, fixed to computer screenshot
  - file_id `string`<font color="gray">Optional</font>: screenshot file ID
  - image_url `string`<font color="gray">Optional</font>: screenshot URL
- acknowledged_safety_checks `array`<font color="gray">Optional</font>: list of acknowledged safety checks
  - id `string`<font color="gray">Optional</font>: acknowledged safety check identifier
  - code `string`<font color="gray">Optional</font>: acknowledged safety check code
  - message `string`<font color="gray">Optional</font>: acknowledged safety check message
- id `string`<font color="gray">Optional</font>: unique output item identifier
- status `string`<font color="gray">Optional</font>: output status, e.g. `completed` / `failed`

:::

<!-- :::details Code interpreter tool call (code interpreter call) `object`

- type `string`<font color="red">Required</font>: `code_interpreter_call`
- id `string`<font color="red">Required</font>: unique ID for the code interpreter call
- container_id `string`<font color="red">Required</font>: container environment ID
- code `string`<font color="red">Required</font>: code to execute (may be null)
- outputs `array`<font color="red">Required</font>: execution outputs (may be null)
  - Logs `object`
    - type `string`<font color="red">Required</font>: `logs`
    - logs `string`<font color="red">Required</font>: log output
  - Image `object`
    - type `string`<font color="red">Required</font>: `image`
    - url `string`<font color="red">Required</font>: generated image URL
- status `string`<font color="red">Required</font>: status, `in_progress` / `completed` / `incomplete` / `interpreting` / `failed`

::: -->

<!-- :::details Image generation call (image generation call) `object`

- type `string`<font color="red">Required</font>: `image_generation_call`
- id `string`<font color="red">Required</font>: unique ID for the image generation call
- result `string`<font color="red">Required</font>: generated image data (base64)
- status `string`<font color="red">Required</font>: status, e.g. `in_progress` / `completed` / `failed`

::: -->

:::details Local shell call (local shell call) `object`

- type `string`<font color="red">Required</font>: `local_shell_call`
- id `string`<font color="red">Required</font>: unique ID for the local shell call
- call_id `string`<font color="red">Required</font>: associated call ID
- status `string`<font color="red">Required</font>: call status, e.g. `in_progress` / `completed` / `failed`
- action `object`<font color="red">Required</font>: specific shell execution action
  - type `string`<font color="red">Required</font>: `exec`
  - command `array`<font color="red">Required</font>: command arguments (array form)
  - env `map`<font color="red">Required</font>: environment variables for execution
  - timeout_ms `integer`<font color="gray">Optional</font>: timeout (ms)
  - user `string`<font color="gray">Optional</font>: system user to run the command as
  - working_directory `string`<font color="gray">Optional</font>: working directory path

:::

:::details Local shell call output `object`

- type `string`<font color="red">Required</font>: `local_shell_call_output`
- id `string`<font color="red">Required</font>: unique ID for the output item
- output `string`<font color="red">Required</font>: command result output as a JSON string
- status `string`<font color="gray">Optional</font>: output status, e.g. `completed` / `failed`

:::

:::details Shell tool call `object`

- type `string`<font color="red">Required</font>: `shell_call`
- call_id `string`<font color="red">Required</font>: unique identifier for the shell call
- id `string`<font color="gray">Optional</font>: unique item ID
- status `string`<font color="gray">Optional</font>: call status, `in_progress` / `completed` / `incomplete`
- action `object`<font color="red">Required</font>: shell command execution config
  - commands `array`<font color="red">Required</font>: list of shell commands to execute in order
  - max_output_length `integer`<font color="gray">Optional</font>: maximum captured output length (stdout+stderr UTF-8)
  - timeout_ms `integer`<font color="gray">Optional</font>: timeout (ms)

:::

:::details Shell tool call output `object`

- type `string`<font color="red">Required</font>: `shell_call_output`
- call_id `string`<font color="red">Required</font>: corresponding shell call identifier
- id `string`<font color="gray">Optional</font>: unique output item identifier
- max_output_length `integer`<font color="gray">Optional</font>: maximum output length limit
- output `array`<font color="red">Required</font>: list of output chunks; each element includes:
  - stdout `string`<font color="red">Required</font>: stdout content
  - stderr `string`<font color="red">Required</font>: stderr content
  - outcome `object`<font color="red">Required</font>: execution outcome (union type)
    - Timeout outcome `object`
      - type `string`<font color="red">Required</font>: `timeout`: command timed out
    - Exit outcome `object`
      - type `string`<font color="red">Required</font>: `exit`: command exited normally
      - exit_code `integer`<font color="red">Required</font>

:::

:::details Apply patch tool call (apply patch call) `object`

Used to create/delete/update files via a diff patch.

- type `string`<font color="red">Required</font>: `apply_patch_call`
- call_id `string`<font color="red">Required</font>: unique identifier for the apply patch call
- id `string`<font color="gray">Optional</font>: unique item identifier
- status `string`<font color="red">Required</font>: call status, `in_progress` / `completed`
- operation `object`<font color="red">Required</font>: specific file operation (union type: create/delete/update)

###### Possible operation types

1. Create file `object`

- type `string`<font color="red">Required</font>: `create_file`
- path `string`<font color="red">Required</font>: file path relative to the workspace root
- diff `string`<font color="red">Required</font>: unified diff patch content

2. Delete file `object`

- type `string`<font color="red">Required</font>: `delete_file`
- path `string`<font color="red">Required</font>: file path to delete

3. Update file `object`

- type `string`<font color="red">Required</font>: `update_file`
- path `string`<font color="red">Required</font>: file path to update
- diff `string`<font color="red">Required</font>: unified diff patch content

:::

:::details Apply patch tool call output `object`

- type `string`<font color="red">Required</font>: `apply_patch_call_output`
- call_id `string`<font color="red">Required</font>: corresponding apply patch call identifier
- id `string`<font color="gray">Optional</font>: unique output item identifier
- status `string`<font color="red">Required</font>: output status, `completed` / `failed`
- output `string`<font color="gray">Optional</font>: apply-patch logs or error description

:::

:::details MCP list tools `object`

- type `string`<font color="red">Required</font>: `mcp_list_tools`
- id `string`<font color="red">Required</font>: unique ID for the MCP list-tools call
- server_label `string`<font color="red">Required</font>: MCP server label
- error `string`<font color="gray">Optional</font>: error message when fetching tools (if any)
- tools `array`<font color="red">Required</font>: available tools; each element includes:
  - name `string`<font color="red">Required</font>: tool name
  - description `string`<font color="gray">Optional</font>: tool description
  - annotations `object`<font color="gray">Optional</font>: additional tool annotations
  - input_schema `object`<font color="red">Required</font>: tool input JSON Schema

:::

:::details MCP approval request `object`

- type `string`<font color="red">Required</font>: `mcp_approval_request`
- id `string`<font color="red">Required</font>: unique ID for the approval request
- server_label `string`<font color="red">Required</font>: MCP server label
- name `string`<font color="red">Required</font>: requested tool name to run
- arguments `string`<font color="red">Required</font>: tool arguments as a JSON string

:::

:::details MCP approval response `object`

- type `string`<font color="red">Required</font>: `mcp_approval_response`
- approval_request_id `string`<font color="red">Required</font>: corresponding approval request ID
- approve `boolean`<font color="red">Required</font>: whether to approve the tool call (true=approve, false=reject)
- id `string`<font color="gray">Optional</font>: unique response item ID
- reason `string`<font color="gray">Optional</font>: reason for approval or rejection

:::

:::details MCP tool call `object`

- type `string`<font color="red">Required</font>: `mcp_call`
- id `string`<font color="red">Required</font>: unique ID for the MCP tool call
- server_label `string`<font color="red">Required</font>: MCP server label
- name `string`<font color="red">Required</font>: tool name to call
- arguments `string`<font color="red">Required</font>: tool arguments as a JSON string
- approval_request_id `string`<font color="gray">Optional</font>: associated approval request ID (for subsequent approval response)
- output `string`<font color="gray">Optional</font>: tool output after execution
- error `string`<font color="gray">Optional</font>: tool execution error message
- status `string`<font color="gray">Optional</font>: call status, `in_progress` / `completed` / `incomplete` / `calling` / `failed`

:::

:::details Reasoning `object`

- type `string`<font color="red">Required</font>: `reasoning`
- id `string`<font color="red">Required</font>: unique ID for the reasoning content
- summary `array`<font color="red">Required</font>: reasoning summary parts
  - Summary text `object`
    - type `string`<font color="red">Required</font>: `summary_text`
    - text `string`<font color="red">Required</font>: summary text
- content `array`<font color="gray">Optional</font>: full reasoning text parts
  - Reasoning text `object`
    - type `string`<font color="red">Required</font>: `reasoning_text`
    - text `string`<font color="red">Required</font>: full reasoning text
- encrypted_content `string`<font color="gray">Optional</font>: encrypted full reasoning content (requires enabling via `include`)
- status `string`<font color="gray">Optional</font>: reasoning status, `in_progress` / `completed` / `incomplete`

:::

:::details Compaction item `object`

Generated by `v1/responses/compact`. Used to compress long conversations into an opaque encrypted summary and can be fed back into later `input`.

- type `string`<font color="red">Required</font>: `compaction`
- id `string`<font color="gray">Optional</font>: compaction item ID
- encrypted_content `string`<font color="red">Required</font>: compressed summary (encrypted, opaque)

:::

##### 3. Item reference `object`

Used to reference an existing item (internal identifier).

- type `string`<font color="red">Required</font>: `item_reference`
- id `string`<font color="gray">Optional</font>

### instructions `string` <font color="gray">Optional</font>

System/developer instructions inserted into the context. When used with `previous_response_id`, it will not inherit the previous round’s instructions, making it easier to replace the system prompt.

### previous_response_id `string` <font color="gray">Optional</font>

ID of the previous Response for continuing multi-turn conversations; **cannot be used together with `conversation`**.

### conversation `string | object` <font color="gray">Optional</font> (default `null`)

Associates this response with a conversation. The conversation’s items will be prepended to this request’s input context, and after completion this request’s input/output will be automatically appended to the conversation.

- Conversation ID `string`: unique conversation ID used to identify and reuse conversation history
- Conversation object `object`
  - id `string`<font color="red">Required</font>: unique conversation ID for persistence and retrieval

### prompt `object` <font color="gray">Optional</font>

Reference a prompt template and pass variables.

- id `string` <font color="red">Required</font>: prompt template ID
- variables `object`<font color="gray">Optional</font>: template variable key-value pairs for placeholder substitution
- version `string`<font color="gray">Optional</font>: prompt template version

### include `array` <font color="gray">Optional</font>

Specifies additional output data to include in the response. Supported values include (string enum):

- `web_search_call.action.sources`: include source info for web search calls
<!-- - `code_interpreter_call.outputs`: include outputs for code interpreter calls -->
- `computer_call_output.output.image_url`: include screenshot URL from Computer Use tool outputs
<!-- - `file_search_call.results`: include file search results -->
- `message.input_image.image_url`: include image URLs in input messages
- `message.output_text.logprobs`: include per-token log probabilities for output text
- `reasoning.encrypted_content`: include encrypted reasoning content

### max_output_tokens `integer` <font color="gray">Optional</font>

Caps the maximum tokens the response can generate (includes visible output tokens and reasoning tokens).

### max_tool_calls `integer` <font color="gray">Optional</font>

Caps the total number of **built-in tool** calls that can be processed within this response (accumulated across tools).

### parallel_tool_calls `boolean` <font color="gray">Optional</font> (default `true`)

Whether to allow parallel tool calls.

### reasoning `object` <font color="gray">Optional</font> (reasoning models only)

Reasoning model configuration.

- effort `string` <font color="gray">Optional</font> (default `medium`)  
  Controls reasoning intensity, affecting reasoning depth and compute time. Supported: `none` / `minimal` / `low` / `medium` / `high` / `xhigh`
- summary `string` <font color="gray">Optional</font>  
  Reasoning summary level: `auto` / `concise` / `detailed`
- generate_summary `string` (Deprecated)  
  Deprecated: use `summary` instead

### text `object` <font color="gray">Optional</font>

Text output configuration (including structured output formats).

- format `object` <font color="gray">Optional</font>: output format (default `{ "type": "text" }`)  
  Possible types:
  1. Text `object`
     - type `string`<font color="red">Required</font>: `text`: plain text output

  2. JSON schema `object` (Structured Outputs)
     - type `string`<font color="red">Required</font>: `json_schema`: structured JSON output
     - name `string`<font color="red">Required</font>: output format name identifier
     - schema `object`<font color="red">Required</font>: JSON Schema defining the output structure
     - description `string` <font color="gray">Optional</font>: description of the output format
     - strict `boolean` <font color="gray">Optional</font> (default `false`): whether to strictly enforce the schema; when true, validation is enforced

  3. JSON object `object` (legacy JSON mode)
     - type `string`<font color="red">Required</font>: `json_object`: JSON object output

- verbosity `string` <font color="gray">Optional</font> (default `medium`)  
  Constrains response verbosity. Lower values produce more concise responses; higher values produce more detailed responses. Supported values: `low` / `medium` / `high`

### temperature `number` <font color="gray">Optional</font> (default `1`)

Sampling temperature, typically 0–2. Prefer tuning either this or `top_p`, not both.

### top_p `number` <font color="gray">Optional</font> (default `1`)

Nucleus sampling parameter.

### top_logprobs `integer` <font color="gray">Optional</font>

0–20. Number of most likely tokens to return at each position.

### truncation `string` <font color="gray">Optional</font> (default `disabled`)

Context truncation strategy for handling prompts that exceed the model’s context window:

- `auto`: when content exceeds the context window, automatically drop the earliest items from the start of the conversation to make room
- `disabled`: disables auto-truncation; requests that exceed the context window will fail (400)

### tools `array` <font color="gray">Optional</font>

Declares the list of tools the model is allowed to call in this request. The model may choose to call these tools as needed to enhance its capabilities.

#### Possible `tools[i]` types

Below are the supported tool type definitions. Each tool type has specific configuration parameters:

:::details Function tool (function tool definition) `object`

- type `string`<font color="red">Required</font>: `function`: tool type, fixed to function tool
- name `string`<font color="red">Required</font>: unique function name identifier
- parameters `object`<font color="red">Required</font>: JSON Schema defining function parameters (structure + validation rules)
- strict `boolean`<font color="red">Required</font> (default `true`): whether to strictly validate parameters against the schema
- description `string` <font color="gray">Optional</font>: detailed function description to help the model decide when to use it

:::

<!-- :::details File search (file search) `object`

- type `string`<font color="red">Required</font>: `file_search`
- vector_store_ids `array[string]`<font color="red">Required</font>: vector store IDs to search
- filters `object` <font color="gray">Optional</font>: result filters
  - Comparison Filter `object`
    - key `string`<font color="red">Required</font>: metadata key to filter on
    - type `string`<font color="red">Required</font>: `eq` / `ne` / `gt` / `gte` / `lt` / `lte` / `in` / `nin`
    - value `string | number | boolean | array`<font color="red">Required</font>: value to compare
  - Compound Filter `object`
    - filters `array[ComparisonFilter | CompoundFilter]`<font color="red">Required</font>: sub-filters
    - type `string`<font color="red">Required</font>: `and` / `or`
- max_num_results `integer` <font color="gray">Optional</font> (1~50): max results
- ranking_options `object` <font color="gray">Optional</font>: ranking options
  - hybrid_search `object` <font color="gray">Optional</font>: hybrid weights
    - embedding_weight `number`<font color="red">Required</font>
    - text_weight `number`<font color="red">Required</font>
  - ranker `string` <font color="gray">Optional</font>: ranker name

::: -->

:::details Web search (generally available) `object`

- type `string` <font color="red">Required</font>: `web_search` or `web_search_2025_08_26`
- filters `object` <font color="gray">Optional</font>: result filters
  - allowed_domains `array[string]` <font color="gray">Optional</font> (default `[]`): allowed domain allowlist (subdomains allowed)
- search_context_size `string` <font color="gray">Optional</font> (default `medium`): search context size level
- user_location `object` <font color="gray">Optional</font>: approximate user location for localized results
  - type `string` <font color="red">Required</font>: `approximate`
  - city `string` <font color="gray">Optional</font>
  - country `string` <font color="gray">Optional</font>: 2-letter ISO (e.g. `US`)
  - region `string` <font color="gray">Optional</font>
  - timezone `string` <font color="gray">Optional</font>: IANA TZ (e.g. `America/Los_Angeles`)

:::

:::details Web search preview `object`

- type `string`<font color="red">Required</font>: `web_search_preview` or `web_search_preview_2025_03_11`
- search_context_size `string` <font color="gray">Optional</font>: `low` / `medium` / `high`
- user_location `object` <font color="gray">Optional</font>: user location
  - type `string`<font color="red">Required</font>: `approximate`
  - city `string` <font color="gray">Optional</font>
  - country `string` <font color="gray">Optional</font> (2-letter ISO)
  - region `string` <font color="gray">Optional</font>
  - timezone `string` <font color="gray">Optional</font> (IANA TZ)

:::

:::details Computer use preview (Computer Use tool) `object`

- type `string` <font color="red">Required</font>: `computer_use_preview`
- display_width `integer` <font color="red">Required</font>: display width (pixels)
- display_height `integer` <font color="red">Required</font>: display height (pixels)
- environment `string` <font color="red">Required</font>: environment type (e.g. `browser` / `mac` / `windows` / `ubuntu`)

:::

<!-- :::details Code interpreter (code interpreter) `object`

- type `string`<font color="red">Required</font>: `code_interpreter`
- container `string | object`<font color="red">Required</font>: container config
  - `string`: existing container ID
  - `object`: new container config
    - type `string`<font color="red">Required</font>: `auto`
    - file_ids `array` <font color="gray">Optional</font>
    - memory_limit `string` <font color="gray">Optional</font>

::: -->

:::details Apply patch tool (apply patch) `object`

- type `string`<font color="red">Required</font>: `apply_patch`

:::

:::details MCP tool (remote MCP tool) `object` (if enabled)

- type `string` <font color="red">Required</font>: `mcp`
- server_label `string` <font color="red">Required</font>: MCP server label (for tool-call routing)
- server_url `string` <font color="gray">Optional</font>: remote MCP server
- authorization `string` <font color="gray">Optional</font>: OAuth access token (for remote MCP server or service connector)
- allowed_tools `array[string] | object` <font color="gray">Optional</font>: allowed tools list or filter
  - **MCP allowed tools** `array[string]`
  - **MCP tool filter** `object`
    - read_only `boolean` <font color="gray">Optional</font>: filter by read-only tools
    - tool_names `array[string]` <font color="gray">Optional</font>: tool name allowlist
- require_approval `string | object` <font color="gray">Optional</font>: which tools require approval (example uses `never`; supports finer granularity)
  - `string`: `always` / `never`
  - `object`: approval filter (schema in docs)

:::

<!--
:::details Image generation (image generation) `object`

- type `string` <font color="red">Required</font>: `image_generation`
- size `string` <font color="gray">Optional</font>: e.g. `1024x1024` / `1024x1536` / `1536x1024` / `auto`
- quality `string` <font color="gray">Optional</font>: `low` / `medium` / `high` / `auto`
- background `string` <font color="gray">Optional</font>: `transparent` / `opaque` / `auto`
- output_format `string` <font color="gray">Optional</font>: e.g. `png` / `jpeg` / `webp`
- output_compression `integer` <font color="gray">Optional</font>: JPEG/WebP compression (0~100)
- partial_images `integer` <font color="gray">Optional</font>: number of streamed partial images
- action `string` <font color="gray">Optional</font>: `auto` / `generate` / `edit`
- input_image_mask `object` <font color="gray">Optional</font>: mask for edits/inpainting
  - file_id `string` <font color="gray">Optional</font>

::: -->

:::details Shell tool (generic Shell) `object`

- type `string` <font color="red">Required</font>: `shell`

(Usually no extra configuration is needed; execution parameters are in the model output’s `shell_call.action`.)

:::

:::details Local shell tool (legacy local Shell) `object`

- type `string` <font color="red">Required</font>: `local_shell`

(The official guidance notes that local shell is legacy; for new use cases, `shell` is recommended.)

:::

:::details Custom tool (custom tool definition; non-function “free input / optionally constrained format”) `object`

- type `string` <font color="red">Required</font>: `custom`
- name `string` <font color="red">Required</font>: tool name
- description `string` <font color="gray">Optional</font>: tool description
- format `object` <font color="gray">Optional</font>: input format (defaults to free text)
  - **Text format** `object`
    - type `string` <font color="red">Required</font>: `text`
  - **Grammar format** `object`
    - type `string` <font color="red">Required</font>: `grammar`
    - syntax `string` <font color="red">Required</font>: `lark` / `regex`
    - definition `string` <font color="red">Required</font>: grammar definition

:::

### tool_choice `string | object` <font color="gray">Optional</font>

Controls how the model selects tools and whether it must call tools.

:::details Tool choice mode `string`

- `none`: do not call tools
- `auto`: let the model decide
- `required`: must call ≥1 tool

:::

:::details Allowed tools `object`

- type `string`<font color="red">Required</font>: `allowed_tools`
- mode `string`<font color="red">Required</font>: `auto` / `required`
- tools `array`<font color="red">Required</font>: allowed tool set (e.g. `{ "type":"function","name":"get_weather" }`, etc.)

:::

:::details Hosted tool (force a built-in tool) `object`

- type `string`<font color="red">Required</font>: one of:
  <!-- `file_search`  -->
  / `web_search_preview` / `computer_use_preview` /
  <!-- `code_interpreter`  -->
  <!-- / `image_generation` -->

:::

:::details Function tool (force a specific function) `object`

- type `string`<font color="red">Required</font>: `function`
- name `string`<font color="red">Required</font>

:::

:::details MCP tool (force a specific MCP tool) `object`

- type `string`<font color="red">Required</font>: `mcp`
- server_label `string`<font color="red">Required</font>
- name `string`<font color="gray">Optional</font>

:::

:::details Custom tool (force a specific custom tool) `object`

- type `string`<font color="red">Required</font>: `custom`
- name `string`<font color="red">Required</font>

:::

:::details Specific apply patch tool choice (force the model to call apply_patch) `object`

- type `string`<font color="red">Required</font>: `apply_patch`

:::

:::details Specific shell tool choice (force the model to call Shell when a tool call is needed) `object`

- type `string`<font color="red">Required</font>: `shell`

:::

<!-- ### background `boolean` <font color="gray">Optional</font> (default `false`)

Whether to run this response in the background. -->

### store `boolean` <font color="gray">Optional</font> (default `true`)

Whether to store this Response for later retrieval.

### stream `boolean` <font color="gray">Optional</font> (default `false`)

Whether to enable SSE streaming output.

### stream_options `object` <font color="gray">Optional</font> (default `null`)

Streaming response options. Used only when `stream: true`.

- include_usage `boolean` <font color="gray">Optional</font>: whether to include usage info in the stream

<!-- ### metadata `object(map)` <font color="gray">Optional</font>

Up to 16 key-value metadata pairs (key ≤ 64 chars; value ≤ 512 chars). -->

### prompt_cache_key `string` <font color="gray">Optional</font>

A key to improve cache hit rate (replaces the legacy `user` field).

### prompt_cache_retention `string` <font color="gray">Optional</font>

Prompt cache retention policy (e.g. `24h`).

### safety_identifier `string` <font color="gray">Optional</font>

A stable user identifier for safety/abuse detection (recommended to hash).

### provider `object` <font color="gray">Optional</font>

Used to configure routing and failover strategies across multiple model providers (e.g., OpenAI, Anthropic, Google) for this request.
If not configured, the project or model’s default routing strategy is used.

#### routing `object` <font color="red">Required</font>

Routing strategy configuration that determines how requests are selected and distributed across multiple providers.

##### type `string` <font color="red">Required</font>

Routing type. Supported values:

- `priority`
  Select providers by priority order: try the first one, then try the next upon failure (can be combined with fallback).
- `round_robin`
  Round-robin distribution: evenly distribute traffic across providers.
- `least_latency`
  Lowest-latency first: choose the provider with the fastest response based on historical/real-time stats.

##### primary_factor `string` <font color="gray">Optional</font>

Primary factor when multiple providers are available. For example:

- `cost`
  Prefer lower-cost providers
- `speed`
  Prefer faster providers
- `quality`
  Prefer higher-quality providers (e.g., stronger models / more stable)

Actual behavior combines with `type`. For example, when `type = "priority"`, `primary_factor` mainly affects how priorities are ordered.

##### providers `array` <font color="red">Required</font>

List of model providers that can participate in routing. Example: `["openai", "anthropic", "google"]`

#### fallback `string` <font color="gray">Optional</font>

Failover strategy. When the currently selected provider fails (e.g., timeout, insufficient quota, service unavailable), how to switch automatically:

`"true"`: enable automatic failover. When the current provider is unavailable, try other available providers according to the routing strategy.

`"false"`: disable failover. If the current provider call fails, return the error directly without trying other providers.

`"<provider_name>"`: explicitly specify a fixed backup provider, e.g. `"anthropic"`:

Use the provider selected by primary routing first  
If it fails, switch to the specified fallback provider  
If both primary and fallback fail, return an error

### model_routing_config `object` <font color="gray">Optional</font>

Used to configure selection and routing among different models **within the same provider** for the current request (e.g., choosing between `gpt-4o`, `gpt-4-turbo`, `claude-3-5-sonnet`).

If not configured, the project or SDK’s default model selection strategy is used (e.g., default model, default task-type mapping).

#### available_models `array` <font color="red">Required</font>

List of **model names** that can be used for routing or fallback.

#### preference `string` <font color="gray">Optional</font>

Preferred model name.

#### task_info `object` <font color="gray">Optional</font>

Task metadata used to determine the model or parameters **based on task type and complexity**.

Internal fields:

##### task_type `string` <font color="red">Required</font>

Task type describing the purpose of the request for routing or automatic parameter selection.

- Example supported values:
  - `"chat"` — conversational tasks (multi-turn chat, assistant Q&A)
  - `"completion"` — general text generation/completion
  - `"embedding"` — vectorization/semantic embeddings
- Usage:
  - Can set different default models or quota strategies per task type
  - Can be combined with `complexity` to decide whether to use a stronger model

##### complexity `string` <font color="gray">Optional</font>

Task complexity indicating the difficulty or importance of the request.

- Supported values:
  - `"low"` — simple tasks (short answers, simple rewrites, etc.)
  - `"medium"` — medium complexity (general Q&A, basic code, standard analysis)
  - `"high"` — high complexity (long document analysis, complex programming, large-scale reasoning)
- Usage:
  - Select different tiers of models by complexity (e.g., cheaper models for low complexity; stronger models for high complexity)
  - Can also be used to control timeouts, retry strategies, etc.

##### additional_properties `object` <font color="gray">Optional</font>

Additional task-related fields as an extensible key-value map.

#### additional_properties `object` <font color="gray">Optional</font>

Additional fields for the model routing config itself, used to attach extra control info beyond the standard structure.

<!-- ### service_tier `string` <font color="gray">Optional</font> (default `auto`)

Request service tier (e.g. `auto` / `default` / `flex` / `priority`). -->

<!-- ### user `string` (Deprecated) <font color="gray">Optional</font>

Deprecated. Use `safety_identifier` and `prompt_cache_key`. -->

### Unsupported fields

| Field name                    | Type        | Supported                                            | Description                                                                                  |
| ---------------------------- | ----------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| service_tier                 | string      | <span style="white-space: nowrap;">❌ Not supported</span> | Service tier                                                                                 |
| user                         | string      | ❌ Not supported                                     | Legacy user identifier; its main role is now replaced by `safety_identifier` and `prompt_cache_key`. |
| background                   | boolean     | ❌ Not supported                                     | Whether to run this response in the background                                               |
| metadata                     | object(map) | ❌ Not supported                                     | Up to 16 key-value metadata pairs                                                            |
| tools(Code interpreter)      | object      | ❌ Not supported                                     | Code interpreter                                                                             |
| tools(Image generation tool) | object      | ❌ Not supported                                     | Image generation tool                                                                        |
| tools(File search)           | object      | ❌ Not supported                                     | File search                                                                                  |

**<font color="red">Note: zenmux does not support three tool types: tools(Code interpreter), tools(Image generation tool), and tools(File search). Therefore, any fields related to these three tool types will not take effect. This document has already filtered out those fields.</font>**

## Response (non-streaming)

When `stream: false`, a **Response object** is returned.

### Top-level fields (Response object)

#### background `boolean`

Whether this Response runs in the background. Not supported as an input; defaults to `false`.

#### completed_at `number`

Response completion timestamp (Unix seconds); present only when `status` is `completed`.

#### conversation `object`

The conversation this Response belongs to; input/output items are automatically appended to that conversation.

- id `string`: unique conversation ID.

#### created_at `number`

Response creation timestamp (Unix seconds).

#### error `object | null`

Error object when generation fails.

- code `string`: error code.
- message `string`: error message.

#### id `string`

Unique Response ID.

#### incomplete_details `object | null`

Reason information for an incomplete Response.

- reason `string`: reason (e.g., reached `max_output_tokens`).

#### instructions `string | array`

System/developer instructions inserted into the model context.

#### max_output_tokens `integer | null`

Generation cap (includes visible output and reasoning tokens).

#### max_tool_calls `integer | null`

Total built-in tool call cap (accumulated across tools).

<!-- #### metadata `object(map)`

Up to 16 KVs; key ≤64, value ≤512. -->

#### model `string`

Model ID that generated this Response.

#### object `string`

Object type, fixed to `response`.

#### output `array`

Array of model output items (order/length determined by the model). See details below.

#### output_text `string` (SDK Only)

SDK convenience field: concatenation of all `output_text` text.

#### parallel_tool_calls `boolean`

Whether parallel tool calls are allowed.

#### previous_response_id `string | null`

Previous Response ID; used for multi-turn conversations (mutually exclusive with `conversation`).

#### prompt `object`

Referenced prompt template and variables.

- id `string`: prompt template ID.
- version `string`: template version (optional).
- variables `object(map)`: variable substitution values.

#### prompt_cache_key `string`

Stable identifier for cache optimization (replaces `user`).

#### prompt_cache_retention `string`

Prompt cache retention policy (e.g. `24h`).

#### reasoning `object`

Reasoning configuration (gpt-5 / o series).

- effort `string | null`: reasoning intensity; supported values: `none`, `minimal`, `low`, `medium`, `high`, `xhigh`.
- summary `string | null`: whether to generate a reasoning summary; one of `auto`, `concise`, or `detailed.

#### safety_identifier `string`

Stable user identifier for safety monitoring (recommended to hash).

#### service_tier `string`

Service tier. Not supported as an input; defaults to `default` in the response.

#### **store `boolean`**

Whether to store the Response for later retrieval (appears in example responses).

#### status `string`

Generation status: `completed` / `failed` / `in_progress` / `cancelled` / `queued` / `incomplete`.

#### temperature `number`

Sampling temperature (0–2).

#### text `object`

Text output configuration.

##### text.format `object`

Specifies the model’s text output format. Default `{ type: "text" }`.
Possible `text.format` types:

:::details Text format

- type `string`

Fixed to `text`, meaning plain text output.

:::

:::details JSON Object format

- type `string`

Fixed to `json_object`, enabling JSON mode (guarantees valid JSON output).

:::

:::details JSON Schema format (Structured Outputs)

- type `string`: fixed to `json_schema`.
- name `string`: format name (≤64, alphanumeric/underscore/hyphen).
- description `string`: format description.
- schema `object`: JSON Schema definition.
- strict `boolean`: strict mode; when enabled, output must strictly follow the schema.

##### ⚠ How to enable JSON Schema / JSON Mode (Responses API)

- Structured Outputs:  
  `text: { format: { type: "json_schema", strict: true, schema: ... } }`
- JSON mode:  
   `text: { format: { type: "json_object" } }`

:::

##### text.verbosity `string`

Constrains response verbosity. Lower values produce more concise responses; higher values produce more detailed responses. Supported values: `low` / `medium` / `high`

#### tool_choice `string | object`

Controls whether/how the model calls tools.

:::details Tool choice mode`string`

- `none`: do not call tools; generate text directly
- `auto`: the model may decide to call one or more tools
- `required`: the model must call one or more tools

:::

:::details Allowed tools`object`

Used to **restrict the available tool subset** (after providing a full set in `tools`, allow the model to choose only within a subset).

- tool_choice.type `string`

Fixed to `allowed_tools`.

- tool_choice.mode `string`
  - `auto`: the model may freely choose among allowed tools or not call tools
  - `required`: the model must call one of the allowed tools

- tool_choice.tools `array`

List of allowed tool definitions (can mix function / mcp, etc.). Example:

```json
[
  { "type": "function", "name": "get_weather" },
  { "type": "mcp", "server_label": "deepwiki" }
]
```

:::

:::details Hosted tool choice`object`

Force a **built-in tool (Hosted / Built‑in tools)** call.

- tool_choice.type `string`

  Allowed values:
  <!-- - `file_search` -->
  - `web_search_preview`
  - `computer_use_preview`
    <!-- - `code_interpreter` -->
    <!-- - `image_generation` -->

:::

:::details Function tool choice`object`

Force a specific **custom function** call.

- tool_choice.type `string`

Fixed to `function`.

- tool_choice.name `string`

Function name.

:::

:::details MCP tool choice`object`

Force a specific **MCP remote tool** call.

- tool_choice.type `string`

Fixed to `mcp`.

- tool_choice.server_label `string`

MCP server identifier.

- tool_choice.name `string`

MCP tool name to call.

:::

:::details Custom tool choice`object`

Force a specific **custom tool** call.

- tool_choice.type `string`

Fixed to `custom`.

- tool_choice.name `string`

Custom tool name to call.

:::

:::details Specific apply_patch tool choice`object`

Force the model to call the **apply_patch** tool.

- tool_choice.type `string`

Fixed to `apply_patch`.

:::

:::details Specific shell tool choice`object`

Force the model to call the **shell** tool.

- tool_choice.type `string`

Fixed to `shell`.

:::

#### tools `array`

List of callable tools.

#### Possible `tools[i]` types

:::details Function tool (function tool definition) `object`

- type `string`: `function`
- name `string`: function name
- parameters `object` (JSON Schema): function parameter definition
- strict `boolean` (default `true`): strict mode
- description `string`: function description

:::

<!-- :::details File search tool (file search) `object`

- type `string`: `file_search`
- vector_store_ids `array[string]`: vector store IDs to search
- filters `object`: filters
  - Comparison Filter `object`
    - key `string`: metadata key to filter on
    - type `string`: `eq` / `ne` / `gt` / `gte` / `lt` / `lte` / `in` / `nin`
    - value `string | number | boolean | array`: value to compare
  - Compound Filter `object`
    - filters `array[ComparisonFilter | CompoundFilter]`: sub-filters
    - type `string`: `and` / `or`
- max_num_results `integer` (1~50): max results
- ranking_options `object`: ranking options
  - hybrid_search `object`: hybrid weights
    - embedding_weight `number`
    - text_weight `number`
  - ranker `string`: ranker name

::: -->

:::details Web search (generally available) `object`

- type `string` : `web_search` or `web_search_2025_08_26`
- filters `object` : search filters
  - allowed_domains `array[string]` (default `[]`): allowed domain allowlist (subdomains allowed)
- search_context_size `string` (default `medium`): `low` / `medium` / `high`: search context size
- user_location `object` : approximate user location
  - type `string` : `approximate`
  - city `string`: city name
  - country `string` : 2-letter ISO (e.g. `US`)
  - region `string`: region/state code
  - timezone `string` : IANA TZ (e.g. `America/Los_Angeles`)

:::

:::details Web search preview `object`

- type `string`: `web_search_preview` or `web_search_preview_2025_03_11`
- search_context_size `string` : `low` / `medium` / `high`
- user_location `object`: user location
  - type `string`: `approximate`
  - city `string`: city name
  - country `string` (2-letter ISO)
  - region `string`: region/state code
  - timezone `string` (IANA TZ)

:::

:::details Computer use preview (Computer Use tool) `object`

- type `string` : `computer_use_preview`
- display_width `integer` : display width (pixels)
- display_height `integer` : display height (pixels)
- environment `string` : environment type (e.g. `browser` / `mac` / `windows` / `ubuntu`)

:::

<!-- :::details Code interpreter (code interpreter) `object`

- type `string`: `code_interpreter`: tool type
- container `string | object`: container config
  - `string`: existing container ID
  - `object`: new container config
    - type `string`: `auto`
    - file_ids `array`
    - memory_limit `string`

::: -->

:::details Apply patch tool (apply patch) `object`

- type `string`: `apply_patch`

:::

:::details MCP tool (remote MCP tool) `object` (if enabled)

- type `string` : `mcp`
- server_label `string` : MCP server label (for tool-call routing)
- server_url `string` : remote MCP server
- authorization `string` : OAuth access token (for remote MCP server or service connector)
- allowed_tools `array[string] | object` : allowed tools list or filter
  - **MCP allowed tools** `array[string]`
  - **MCP tool filter** `object`
    - read_only `boolean` : filter by read-only tools
    - tool_names `array[string]` : tool name allowlist
- require_approval `string | object` : which tools require approval (example uses `never`; supports finer granularity)
  - `string`: `always` / `never`
  - `object`: approval filter (schema in docs)

:::

<!-- :::details Image generation (image generation) `object`

- type `string` : `image_generation
- size `string` : e.g. `1024x1024` / `1024x1536` / `1536x1024` / `auto`
- quality `string` : `low` / `medium` / `high` / `auto`
- background `string` : `transparent` / `opaque` / `auto`
- output_format `string` : output format, e.g. `png` / `jpeg` / `webp`
- output_compression `integer` : JPEG/WebP compression (0~100)
- partial_images `integer` : number of streamed partial images
- action `string` : `auto` / `generate` / `edit`
- input_image_mask `object` : mask for edits/inpainting
  - file_id `string`

::: -->

:::details Shell tool (generic Shell) `object`

- type `string` : `shell`

(Usually no extra configuration is needed; execution parameters are in the model output’s `shell_call.action`.)

:::

:::details Local shell tool (legacy local Shell) `object`

- type `string` : `local_shell`

(The official guidance notes that local shell is legacy; for new use cases, `shell` is recommended.)

:::

:::details Custom tool (custom tool definition; non-function “free input / optionally constrained format”) `object`

- type `string` : `custom`
- name `string` : tool name
- description `string` : tool description
- format `object` : input format config (defaults to free text)
  - **Text format** `object`: text format
    - type `string` : `text`: format type, fixed to text
  - **Grammar format** `object`: grammar format
    - type `string` : `grammar`: format type, fixed to grammar
    - syntax `string` : `lark` / `regex`: grammar syntax
    - definition `string` : grammar definition

:::

#### top_logprobs `integer`

Top-N probabilities for each token (0–20).

#### top_p `number`

Nucleus sampling parameter.

#### truncation `string`

Truncation strategy: `auto` / `disabled`.

#### usage `object`

Token usage information.

- input_tokens `integer`: number of input tokens
- input_tokens_details `object`: input token details
  - cached_tokens `integer`: number of cached tokens
- output_tokens `integer`: number of output tokens
- output_tokens_details `object`: output token details
  - reasoning_tokens `integer`: number of reasoning tokens
- total_tokens `integer`: total number of tokens

#### user `string | null` (Deprecated)

Deprecated. Defaults to `null`. Use `prompt_cache_key` / `safety_identifier` instead.

### output[i]: Possible Output item types

:::details Output message (output message) `object`

- type `string`: fixed to `message`.
- id `string`: message item ID.
- role `string`: fixed to `assistant`.
- status `string`: `in_progress` / `completed` / `incomplete`.
- content `array`: list of content parts.

#### Possible `message.content[j]` types

A) Output text `object`

- type `string`: fixed to `output_text`.
- text `string`: model output text.
- annotations `array`: citation/annotation list.
- logprobs `array`: token probability info (requires include).

B) Refusal `object`

- type `string`: fixed to `refusal`.
- refusal `string`: refusal explanation.

##### Possible `Output text.annotations[k]` types

1. File citation `object`

- type `string`: fixed to `file_citation`.
- file_id `string`: file ID.
- filename `string`: file name.
- index `integer`: file index.

2. URL citation `object`

- type `string`: fixed to `url_citation`.
- url `string`: page URL.
- title `string`: page title.
- start_index `integer`: citation start position.
- end_index `integer`: citation end position.

3. Container file citation `object`

- type `string`: fixed to `container_file_citation`.
- container_id `string`: container ID.
- file_id `string`: file ID.
- filename `string`: file name.
- start_index `integer`: citation start position.
- end_index `integer`: citation end position.

4. File path `object`

- type `string`: fixed to `file_path`.
- file_id `string`: file ID.
- index `integer`: file index.

##### Output text.logprobs[m] (token logprob schema)

- token `string`: token text.
- logprob `number`: log probability.
- bytes `array`: byte representation.
- top_logprobs `array`: candidate tokens and logprobs.

:::

:::details Reasoning (reasoning item) `object`

- type `string`: fixed to `reasoning`.
- id `string`: reasoning item ID.
- summary `array`: reasoning summary parts.
  - type `string`: fixed to `summary_text`.
  - text `string`: summary text.
- content `array`: optional reasoning body parts.
  - type `string`: fixed to `reasoning_text`.
  - text `string`: reasoning body text.
- encrypted_content `string`: encrypted reasoning content (requires include).
- status `string`: `in_progress` / `completed` / `incomplete`.

:::

:::details Function tool call (function call request) `object`

- type `string`: fixed to `function_call`.
- id `string`: call item ID.
- call_id `string`: correlated call ID.
- name `string`: function name.
- arguments `string`: JSON string arguments.
- status `string`: `in_progress` / `completed` / `incomplete`.

:::

<!-- :::details File search tool call (file search call result) `object`

- type `string`: fixed to `file_search_call`.
- id `string`: file search call ID.
- queries `array`: search queries.
- status `string`: `in_progress` / `searching` / `incomplete` / `failed`.
- results `array`: results (requires include).
  - file_id `string`: file ID.
  - filename `string`: file name.
  - score `number`: relevance score (0–1).
  - text `string`: matched text.
  - attributes `object(map)`: custom attributes.

::: -->

:::details Web search tool call (web search call result) `object`

- type `string`: fixed to `web_search_call`.
- id `string`: search call ID.
- status `string`: search call status.
- action `object`: specific action.
  - Search action `object`
    - type `string`: action type (search).
    - query `string`: query (deprecated).
    - queries `array`: query list.
    - sources `array`: source list (requires include).
  - Open page action `object`
    - type `string`: `open_page`.
    - url `string`: opened URL.
  - Find action `object`
    - type `string`: `find`.
    - url `string`: page searched.
    - pattern `string`: find pattern.

:::

:::details Compaction item `object`

Generated by `v1/responses/compact`. Used to compress long conversations into an opaque encrypted summary and can be fed back into later `input`.

- type `string`: `compaction`
- id `string`: compaction item ID
- encrypted_content `string`: compressed summary (encrypted, opaque)
- created_by `string`: identifier of the entity that created this item

:::

<!-- :::details Code interpreter call (code interpreter call) `object`

- type `string`: fixed to `code_interpreter_call`.
- id `string`: call ID.
- code `string | null`: executed code.
- container_id `string`: container ID.
- status `string`: `in_progress` / `completed` / `incomplete` / `interpreting` / `failed`.
- outputs `array | null`: outputs (requires include).
  - logs `object`
    - type `string`: `logs`
    - logs `string`: log text
  - image `object`
    - type `string`: `image`
    - url `string`: image URL

::: -->

:::details Local shell call (local shell call) `object`

- type `string`: fixed to `local_shell_call`
- id `string`: unique identifier for the tool call
- call_id `string`: call ID
- status `string`: call status
- action `object`: execution action config
  - type `string`: `exec`: action type, fixed to executing a command
  - command `array`: command to execute (array form)
  - env `map`: environment variables
  - timeout_ms `integer`: timeout (ms)
  - user `string`: execution user
  - working_directory `string`: working directory path

:::

:::details Computer tool call (Computer Use call) `object`

- type `string`: fixed to `computer_call`.
- id `string`: call ID.
- call_id `string`: correlated call ID.
- status `string`: call status.
- pending_safety_checks `array`: pending safety checks.
- action `object`: specific action.

###### Action types (possible `action` variants)

###### Click `object`

- type `string`: `click`
- x `number`
- y `number`
- button `string` : `left` / `right` / `middle`

###### Double click `object`

- type `string`: `double_click`
- x `integer`
- y `integer`

###### Move `object`

- type `string`: `move`
- x `integer`
- y `integer`

###### Screenshot `object`

- type `screenshot`: `move`

###### Drag `object`

- type `string`: `drag`
- path `array`: `drag`
  - x `integer`
  - y `integer`

###### Scroll `object`

- type `string`: `scroll`
- x `integer` (scroll anchor; some implementations provide it)
- y `integer`
- scroll_x `integer`
- scroll_y `integer`

###### Type `object`

- type `string`: `type`
- text `string`

###### Keypress `object`

- type `string`: `keypress`
- keys `array` (key combo, e.g. `["CTRL","L"]`)

###### Wait `object`

- type `string`: `wait`

:::

:::details Shell tool call `object`

- type `string`: `shell_call`
- call_id `string`
- id `string`
- status `string`: `in_progress` / `completed` / `incomplete`
- action `object`: shell commands and limits
  - commands `array`: list of commands to run in order
  - max_output_length `integer`: max captured stdout+stderr UTF-8 chars
  - timeout_ms `integer`: timeout in ms
- created_by `string`: entity ID that created this tool call

:::

:::details Shell tool call output `object`

- type `string`: fixed to `shell_call_output`
- call_id `string`: call ID
- id `string`: unique identifier for the output item
- max_output_length `integer`: max output length limit
- output `array`: list of stdout/stderr chunks; each element:
  - stdout `string`: stdout content
  - stderr `string`: stderr content
  - outcome `object`: execution outcome (union type)
    - Timeout outcome `object`: timeout outcome
      - type `string`: `timeout`: outcome type, fixed to timeout
    - Exit outcome `object`: exit outcome
      - type `string`: `exit`: outcome type, fixed to exit
      - exit_code `integer`: exit code
- created_by `string`: identifier of the entity that created this item

:::

:::details Apply patch tool call (apply patch call) `object`

Used to create/delete/update files via a diff patch.

- type `string`: fixed to `apply_patch_call`
- call_id `string`: call ID
- id `string`: unique identifier for the call
- status `string`: `in_progress` / `completed`: call status
- created_by `string`: creator identifier
- operation `object`: operation (union type)

###### Possible operation types

1. Create file `object`: create file operation

- type `string`: `create_file`: operation type, fixed to create file
- path `string`: relative to workspace root
- diff `string`: unified diff content

2. Delete file `object`: delete file operation

- type `string`: `delete_file`: operation type, fixed to delete file
- path `string`: file path

3. Update file `object`: update file operation

- type `string`: `update_file`: operation type, fixed to update file
- path `string`: file path
- diff `string`: unified diff content

:::

:::details Apply patch tool call output `object`

- type `string`: fixed to `apply_patch_call_output`
- call_id `string`: call ID
- id `string`: unique identifier for the output item
- status `string`: `completed` / `failed`: execution status
- output `string`: human-readable logs/errors
- created_by `string`: creator identifier

:::

<!-- :::details Image generation call (image generation call) `object`

- type `string`: fixed to `image_generation_call`.
- id `string`: call ID.
- status `string`: call status.
- result `string`: generated image base64.

::: -->

:::details MCP tool call `object`

- type `string`: fixed to `mcp_call`
- id `string`: unique identifier for the tool call
- server_label `string`: MCP server label
- name `string`: tool name
- arguments `string`: JSON string arguments
- approval_request_id `string`: ID for subsequent approval response
- output `string`: tool output
- error `string`: error message
- status `string`: `in_progress` / `completed` / `incomplete` / `calling` / `failed`: call status

:::

:::details MCP list tools `object`

- type `string`: fixed to `mcp_list_tools`
- id `string`: unique identifier for the call
- server_label `string`: MCP server label
- error `string`: error message
- tools `array`: tool list; each element:
  - name `string`: tool name
  - description `string`: tool description
  - annotations `object`: tool annotations
  - input_schema `object`: JSON Schema input parameter definition

:::

:::details MCP approval request `object`

- type `string`: fixed to `mcp_approval_request`
- id `string`: unique approval request ID
- server_label `string`: MCP server label
- name `string`: requested tool name to run
- arguments `string`: tool arguments as a JSON string

:::

:::details Custom tool call (custom tool call) `object`

The model initiates a call to a “custom tool” (you must execute it on your side).

- type `string`: fixed to `custom_tool_call`
- call_id `string`: call ID
- name `string`: tool name
- input `string`: input parameters
- id `string`: unique identifier for the call

:::

## Response (streaming)

When `stream: true`, `POST /v1/responses` does not return the full Response object in one shot. Instead, it continuously pushes a sequence of **Streaming events** via **SSE (Server-Sent Events)**. ([platform.openai.com](https://platform.openai.com/docs/guides/streaming-responses))

### Transport format (SSE)

- HTTP responses are typically `Content-Type: text/event-stream`
- The server sends multiple events in order
- Each event, at the “wire protocol” level, typically looks like this (example):

```text
data: {"type":"response.output_text.delta","item_id":"msg_123","output_index":0,"content_index":0,"delta":"Hello","sequence_number":12}

```

> Note: SSE also supports an `event: ...` line, but in Responses streaming semantics, the event type is determined by the JSON `type` field. SDKs also parse each event directly into an object for consumption. ([platform.openai.com](https://platform.openai.com/docs/guides/streaming-responses))

### General notes on Streaming events

- Each event includes:
  - `type`: event type string (e.g., `response.created`)
  - `sequence_number`: event sequence number for ordering (examples may start from 0 or 1)
- Many events include indexes/association fields such as `output_index`, `item_id`, `content_index` to precisely merge delta events back into the specific item in `output[]` and the specific content part within that item.

## Streaming events

> Below, each event lists fields in the same order as on the official reference page. The **exact structures** of objects like `response` / `item` / `part` / `annotation` match the earlier “non-streaming Response object / output items” section (or the corresponding official schemas).

### response.created

Emitted when the response is created.

Fields:

- response `object`: the created Response (the Response object described above)
- sequence_number `integer`: event sequence number
- type `string`: fixed to `response.created`

### response.in_progress

Emitted while the response is being generated.

Fields:

- response `object`: in-progress Response
- sequence_number `integer`
- type `string`: fixed to `response.in_progress`

### response.completed

Emitted when the response completes (includes the final Response).

Fields:

- response `object`: completed Response (includes final `output`, `usage`, etc.)
- sequence_number `integer`
- type `string`: fixed to `response.completed`

### response.failed

Emitted when the response fails (includes error info).

Fields:

- response `object`: failed Response (`status="failed"`, non-empty `error`)
- sequence_number `integer`
- type `string`: fixed to `response.failed`

### response.incomplete

Emitted when the response ends as incomplete (e.g., hitting a limit).

Fields:

- response `object`: incomplete Response (`status="incomplete"`, `incomplete_details` may be non-empty)
- sequence_number `integer`
- type `string`: fixed to `response.incomplete`

### response.output_item.added

Emitted when a new output item is added.

Fields:

- item `object`: the newly added output item (message / tool call / reasoning, etc.; see `output[i]` above)
- output_index `integer`: index of the item in `response.output[]`
- sequence_number `integer`
- type `string`: fixed to `response.output_item.added`

### response.output_item.done

Emitted when an output item is done.

Fields:

- item `object`: completed output item
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.output_item.done`

### response.content_part.added

Emitted when a message’s `content[]` adds a new content part.

Fields:

- content_index `integer`: index of the part in `message.content[]`
- item_id `string`: ID of the owning output item (usually the message item’s `id`)
- output_index `integer`: owning output item index
- part `object`: newly added content part (e.g., `output_text` / `refusal`; see above)
- sequence_number `integer`
- type `string`: fixed to `response.content_part.added`

### response.content_part.done

Emitted when a content part is done.

Fields:

- content_index `integer`
- item_id `string`
- output_index `integer`
- part `object`: finalized content part
- sequence_number `integer`
- type `string`: fixed to `response.content_part.done`

### response.output_text.delta

Delta event for output text.

Fields:

- content_index `integer`: content part index that owns the text
- delta `string`: newly generated text fragment
- item_id `string`: owning output item ID
- logprobs `array`: token probabilities (appears only with include/config; schema matches the logprobs definition above)
- output_index `integer`: owning output item index
- sequence_number `integer`
- type `string`: fixed to `response.output_text.delta`

### response.output_text.done

Emitted when a text segment is finalized.

Fields:

- content_index `integer`
- item_id `string`
- logprobs `array`: token probabilities (as above; appears as needed)
- output_index `integer`
- sequence_number `integer`
- text `string`: final full text
- type `string`: fixed to `response.output_text.done`

### response.refusal.delta

Delta event for refusal text.

Fields:

- content_index `integer`
- delta `string`: refusal text delta
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.refusal.delta`

### response.refusal.done

Final refusal text event.

Fields:

- content_index `integer`
- item_id `string`
- output_index `integer`
- refusal `string`: final refusal explanation
- sequence_number `integer`
- type `string`: fixed to `response.refusal.done`

### response.function_call_arguments.delta

Delta event for function call `arguments` (arguments is incrementally concatenated as a JSON string).

Fields:

- delta `string`: incremental arguments fragment
- item_id `string`: ID of the function_call item
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.function_call_arguments.delta`

### response.function_call_arguments.done

Final function call arguments event.

Fields:

- arguments `string`: final arguments (JSON string)
- item_id `string`
- name `string`: function name
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.function_call_arguments.done`

<!-- ### response.file_search_call.in_progress

File search tool call start event.

Fields:

- item_id `string`: ID of the file_search_call item
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.file_search_call.in_progress` -->

<!-- ### response.file_search_call.searching

File search in-progress event.

Fields:

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.file_search_call.searching` -->

<!-- ### response.file_search_call.completed

File search completed event (call completed; results require include).

Fields:

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.file_search_call.completed` -->

### response.web_search_call.in_progress

Web search tool call start event.

Fields:

- item_id `string`: ID of the web_search_call item
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.web_search_call.in_progress`

### response.web_search_call.searching

Web search in-progress event.

Fields:

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.web_search_call.searching`

### response.web_search_call.completed

Web search completed event (sources and similar fields require include).

Fields:

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.web_search_call.completed`

### response.reasoning_summary_part.added

Emitted when a new reasoning summary part is added.

Fields:

- item_id `string`: reasoning item ID
- output_index `integer`
- part `object`: newly added summary part (e.g., `summary_text`)
- sequence_number `integer`
- summary_index `integer`: index of the summary part
- type `string`: fixed to `response.reasoning_summary_part.added`

### response.reasoning_summary_part.done

Emitted when a reasoning summary part is done.

Fields:

- item_id `string`
- output_index `integer`
- part `object`: finalized summary part
- sequence_number `integer`
- summary_index `integer`
- type `string`: fixed to `response.reasoning_summary_part.done`

### response.reasoning_summary_text.delta

Delta event for reasoning summary text.

Fields:

- delta `string`: summary text delta
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- summary_index `integer`
- type `string`: fixed to `response.reasoning_summary_text.delta`

### response.reasoning_summary_text.done

Final reasoning summary text event.

Fields:

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- summary_index `integer`
- text `string`: final full summary text
- type `string`: fixed to `response.reasoning_summary_text.done`

### response.reasoning_text.delta

Delta event for reasoning body text.

Fields:

- content_index `integer`: reasoning content part index
- delta `string`
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.reasoning_text.delta`

### response.reasoning_text.done

Final reasoning body text event.

Fields:

- content_index `integer`
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- text `string`: final full reasoning text
- type `string`: fixed to `response.reasoning_text.done`

<!-- ### response.image_generation_call.completed

Image generation tool call completed event.

Fields:

- item_id `string`: ID of the image_generation_call item
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.image_generation_call.completed` -->

<!-- ### response.image_generation_call.generating

Image generation generating event.

Fields:

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.image_generation_call.generating` -->

<!-- ### response.image_generation_call.in_progress

Image generation in_progress event.

Fields:

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.image_generation_call.in_progress` -->

<!-- ### response.image_generation_call.partial_image

Partial image event during image generation.

Fields:

- item_id `string`
- output_index `integer`
- partial_image_b64 `string`: base64 partial image
- partial_image_index `integer`: partial image index (0-based)
- sequence_number `integer`
- type `string`: fixed to `response.image_generation_call.partial_image` -->

### response.mcp_call_arguments.delta

Delta event for MCP tool call arguments (JSON string incremental).

Fields:

- delta `string`: arguments delta (JSON string fragment)
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.mcp_call_arguments.delta`

### response.mcp_call_arguments.done

Final MCP tool call arguments event.

Fields:

- arguments `string`: final arguments (JSON string)
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.mcp_call_arguments.done`

### response.mcp_call.completed

Emitted when an MCP tool call completes successfully.

Fields:

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.mcp_call.completed`

### response.mcp_call.failed

Emitted when an MCP tool call fails.

Fields:

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.mcp_call.failed`

### response.mcp_call.in_progress

Emitted while an MCP tool call is in progress.

Fields:

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.mcp_call.in_progress`

### response.mcp_list_tools.completed

Emitted when MCP list-tools completes successfully.

Fields:

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.mcp_list_tools.completed`

### response.mcp_list_tools.failed

Emitted when MCP list-tools fails.

Fields:

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.mcp_list_tools.failed`

### response.mcp_list_tools.in_progress

Emitted while MCP list-tools is in progress.

Fields:

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.mcp_list_tools.in_progress`

<!-- ### response.code_interpreter_call.in_progress

Code interpreter tool call start/in-progress event.

Fields:

- item_id `string`: ID of the code_interpreter_call item
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.code_interpreter_call.in_progress` -->

<!-- ### response.code_interpreter_call.interpreting

Code interpreter interpreting event.

Fields:

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.code_interpreter_call.interpreting` -->

<!-- ### response.code_interpreter_call.completed

Code interpreter tool call completed event.

Fields:

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.code_interpreter_call.completed` -->

<!-- ### response.code_interpreter_call_code.delta

Delta event for code snippets generated/returned by the code interpreter.

Fields:

- delta `string`: code delta snippet
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.code_interpreter_call_code.delta` -->

<!-- ### response.code_interpreter_call_code.done

Final code snippet event.

Fields:

- code `string`: final code
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.code_interpreter_call_code.done` -->

### response.output_text.annotation.added

Delta event for adding an annotation to a text output’s annotations array.

Fields:

- annotation `object`: newly added annotation (schema matches the annotation types above / official schema)
- annotation_index `integer`: index in the annotations array
- content_index `integer`
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: fixed to `response.output_text.annotation.added`

### response.queued

Emitted when the response enters the queued state.

Fields:

- response `object`: queued Response (same schema as Response object; examples may show only a subset)
- sequence_number `integer`
- type `string`: fixed to `response.queued`

### response.custom_tool_call_input.delta

Delta event for custom tool input.

Fields:

- delta `string`: input delta fragment
- item_id `string`: ID of the custom_tool_call item
- output_index `integer`
- sequence_number `integer`
- type `string`: event type identifier (fixed to `response.custom_tool_call_input.delta`)

### response.custom_tool_call_input.done

Final custom tool input event.

Fields:

- input `string`: final full input
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`: event type identifier (fixed to `response.custom_tool_call_input.done`)

### error

Emitted when an error occurs during streaming.

Fields:

- code `string`: error code
- message `string`: error message
- param `string`: error parameter (may be null)
- sequence_number `integer`
- type `string`: fixed to `error`

::: api-request POST /api/v1/responses

```TypeScript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://zenmux.ai/api/v1/responses',
  apiKey: '<ZENMUX_API_KEY>',
});

async function main() {
  const response = await openai.responses.create({
    model: "openai/gpt-5",
    input: "What is the meaning of life?"
  })

  print(response)
}

main();
```

```Python
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1/responses",
    api_key="<your_ZENMUX_API_KEY>",
)

response = client.responses.create(
    model: "openai/gpt-5",
    input: "What is the meaning of life?"
)

print(response)
```

```cURL
curl https://zenmux.ai/api/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "openai/gpt-5",
    "input": "What is the meaning of life?"
  }'
```

:::

::: api-response

```json
{
  "id": "resp_0140d07a600e72a30069733ecadb508194b7cd84f200b593c7",
  "object": "response",
  "created_at": 1769160394,
  "status": "completed",
  "background": false,
  "content_filters": [
    {
      "blocked": false,
      "source_type": "prompt",
      "content_filter_raw": null,
      "content_filter_results": {},
      "content_filter_offsets": {
        "start_offset": 0,
        "end_offset": 0,
        "check_offset": 0
      }
    },
    {
      "blocked": false,
      "source_type": "completion",
      "content_filter_raw": null,
      "content_filter_results": {},
      "content_filter_offsets": {
        "start_offset": 0,
        "end_offset": 0,
        "check_offset": 0
      }
    }
  ],
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "max_output_tokens": null,
  "max_tool_calls": null,
  "model": "openai/gpt-5",
  "output": [
    {
      "id": "rs_0140d07a600e72a30069733ecbf4c88194b2a1d173c1b500fa",
      "type": "reasoning",
      "summary": []
    },
    {
      "id": "msg_0140d07a600e72a30069733edc988881948160d23b617f9994",
      "type": "message",
      "status": "completed",
      "content": [
        {
          "type": "output_text",
          "annotations": [],
          "logprobs": [],
          "text": "There isn’t a single agreed-on meaning of life. Different lenses offer different answers:\n- Evolutionary: to survive, reproduce, and pass on genes.\n- Religious/spiritual: to know, serve, or unite with the divine.\n- Existential: life has no built-in meaning; we create it through choices.\n- Humanistic/psychological: meaning arises from relationships, growth, and contribution.\n\nFor most people, meaning tends to cluster around a few pillars:\n- Love and connection\n- Growth and mastery\n- Service and impact\n- Curiosity, beauty, and wonder\n\nIf you’re seeking your own, try:\n- Clarify values: list your top 5 and rank them.\n- Track aliveness: note when you feel most engaged and why.\n- Contribute: find a problem you care about and help, even in small ways.\n- Commit: choose a long-term project that matters to you and stick with it.\n\nMeaning is less a destination than a practice. If you share what matters to you, I can help you shape it into a clear life purpose."
        }
      ],
      "role": "assistant"
    }
  ],
  "parallel_tool_calls": true,
  "previous_response_id": null,
  "prompt_cache_key": null,
  "prompt_cache_retention": null,
  "reasoning": {
    "effort": "medium",
    "summary": null
  },
  "safety_identifier": null,
  "service_tier": "default",
  "store": true,
  "temperature": 1,
  "text": {
    "format": {
      "type": "text"
    },
    "verbosity": "medium"
  },
  "tool_choice": "auto",
  "tools": [],
  "top_logprobs": 0,
  "top_p": 1,
  "truncation": "disabled",
  "usage": {
    "input_tokens": 13,
    "input_tokens_details": {
      "cached_tokens": 0,
      "web_search": 0
    },
    "output_tokens": 801,
    "output_tokens_details": {
      "reasoning_tokens": 576
    },
    "total_tokens": 814
  },
  "user": null,
  "metadata": {}
}
```

:::