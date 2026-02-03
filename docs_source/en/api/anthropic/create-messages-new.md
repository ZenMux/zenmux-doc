---
pageClass: api-page
title: Create a Message
head:
  - - meta
    - name: description
      content: Create a Message
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, create, messages, new, Anthropic, Claude
---

# Create a Message

```
POST https://zenmux.ai/api/anthropic/v1/messages
```

ZenMux supports the Anthropic API. See the API call examples for how to use it.

> This article is based on the official “Create a Message” documentation. Parameter descriptions and nested structures remain consistent with the official docs.

## Request headers

### x-api-key `string` <font color="red">Required</font>

Anthropic API Key, used for authentication.

Example:

```http
x-api-key: sk-ant-xxxx
```

### anthropic-version `string` <font color="red">Required</font>

Anthropic API version (not the model version).

Currently, only `"2023-06-01"` is supported.

```http
anthropic-version: 2023-06-01
```

### content-type `string` <font color="red">Required</font>

Request body format. Currently, only JSON is supported:

```http
content-type: application/json
```

### anthropic-beta `string` <font color="gray">Optional</font>

Used to enable one or more Beta features. `"code-execution-2025-08-25"` is not supported at the moment, meaning the `code_execution` tool cannot be used.

- For multiple beta versions, you can:
  - Separate them with commas: `anthropic-beta: files-api-2025-04-14,another-beta`
  - Or repeat the header multiple times.

## Request Body

The request body is JSON. Parameters are as follows.

### max_tokens `number` <font color="red">Required</font>

The **maximum number of tokens** to generate, including both the normal response and (if enabled) the thinking content from extended thinking.

- Meaning: the model will generate at most this many tokens; it **may end naturally earlier**, but will not exceed this limit.
- The maximum supported `max_tokens` varies by model. See each model’s documentation for details.
- Value: `>= 1`

### messages `array<Message>` <font color="red">Required</font>

Conversation history and the current user input.

- During training, the model assumes `user` / `assistant` alternate. You provide prior turns in `messages`, and the model generates the next `assistant` message.
- Multi-turn conversations are supported; consecutive messages with the same role are merged internally.
- If the last entry in `messages` is `assistant`, the reply will **continue directly after its `content`**, which can be used for “prefix-constrained” answers.
- Up to `100000` messages per request.

All array elements share the same structure:

```ts
Message = {
  role: "user" | "assistant",
  content: string | ContentBlock[]
}
```

#### role: `"user" | "assistant"`<font color="red">Required</font>

#### content `string | ContentBlock[]`<font color="red">Required</font>

- If you provide a string directly, it is equivalent to a single text block with `type: "text"`:
  - `{"role":"user","content":"Hello, Claude"}` is equivalent to  
    `{"role":"user","content":[{"type":"text","text":"Hello, Claude"}]}`
- Using an array lets you mix multiple content block types, such as text, images, PDFs, tool results, etc.

  Common content block types (some are only available in specific scenarios):

::: details TextBlockParam

```ts
{
  type: "text",
  text: string,
  cache_control?: CacheControlEphemeral,
  citations?: TextCitationParam[]
}
```

- text `string` <font color="red">Required</font>  
  Text content.
- type `string` <font color="red">Required</font>  
  Must be `"text"`.
- cache_control `CacheControlEphemeral` <font color="gray">Optional</font>  
   Creates a **Prompt Cache breakpoint** on this block (for Anthropic context-caching billing / reuse):

  ```ts
  CacheControlEphemeral = {
    type: "ephemeral",
    ttl: "5m" | "1h",
  };
  ```

  - ttl: cache TTL, `"5m"` / `"1h"`, default is 5 minutes.

- citations `TextCitationParam[]` <font color="gray">Optional</font>  
  Used to **attribute the source of quoted text** (typical scenario: when you pass a PDF / text document / content document as a `document` block input and want to mark “which page / which section / which search result this part of the answer comes from”).  
  `TextCitationParam` is one of the following (depending on the cited content type):
  - **char_location: cite plain text or content documents by character range**

    ```ts
    {
      type: "char_location",
      cited_text: string,
      document_index: number,
      document_title: string,
      start_char_index: number,
      end_char_index: number
    }
    ```

    Field details:
    - `type` `string` <font color="red">Required</font>  
      Must be `"char_location"`, meaning the citation is located by a **character index range**.

    - `cited_text` `string` <font color="red">Required</font>  
      The cited original text snippet (for human display).  
      Typically extracted from the text between `start_char_index` and `end_char_index`.

    - `document_index` `number` <font color="red">Required</font>  
      The index of the cited document in the current request, **0-based**.  
      If you provide multiple `document` blocks (or other citeable documents) in this request, this indicates which one.

    - `document_title` `string` <font color="red">Required</font>  
      The document’s title/name, usually derived from the filename or a title you provided upstream, used for UI display such as “From: xxx”.

    - `start_char_index` `number` <font color="red">Required</font>  
      The starting character index (0-based, inclusive) of the cited snippet in the document’s **full text**.

    - `end_char_index` `number` <font color="red">Required</font>  
      The ending character index (0-based, typically the right endpoint of a half-open interval), so the cited range is `[start_char_index, end_char_index)`.

  - **page_location: cite PDFs by page range**

    ```ts
    {
      type: "page_location",
      cited_text: string,
      document_index: number,
      document_title: string,
      start_page_number: number,
      end_page_number: number
    }
    ```

    Field details:
    - `type` `string` <font color="red">Required</font>  
      Must be `"page_location"`, meaning the location is described by a **page number range**.

    - `cited_text` `string` <font color="red">Required</font>  
      The cited PDF text snippet (readable text parsed from the PDF by the system).

    - `document_index` `number` <font color="red">Required</font>  
      The index of the cited PDF in the current request, **0-based**.

    - `document_title` `string` <font color="red">Required</font>  
      The PDF title or filename, for display.

    - `start_page_number` `number` <font color="red">Required</font>  
      The **starting page number** of the cited content, **1-based**, inclusive.  
      For example, `5` means “starting from page 5”.

    - `end_page_number` `number` <font color="red">Required</font>  
      The **ending page number**, usually treated as the right endpoint of a half-open interval:
      - If `start_page_number = 5` and `end_page_number = 6`, it can be interpreted as “page 5”.
      - If the difference is greater than 1, it indicates a multi-page citation range.

  - **content_block_location: cite content documents by content-block index range**

    ```ts
    {
      type: "content_block_location",
      cited_text: string,
      document_index: number,
      document_title: string,
      start_block_index: number,
      end_block_index: number
    }
    ```

    Used to cite documents provided as “multiple content blocks” (e.g., a `document` with `source.type = "content"` that contains multiple `text`/`image` blocks).

    Field details:
    - `type` `string` <font color="red">Required</font>  
      Must be `"content_block_location"`.

    - `cited_text` `string` <font color="red">Required</font>  
      The cited original text snippet (from the corresponding content block).

    - `document_index` `number` <font color="red">Required</font>  
      The index of the cited document in the current request, **0-based**.

    - `document_title` `string` <font color="red">Required</font>  
      The document’s title/name.

    - `start_block_index` `number` <font color="red">Required</font>  
      The starting block index (0-based) within the document’s internal `content` array.  
      Indicates “starting from which content block”.

    - `end_block_index` `number` <font color="red">Required</font>  
      The ending block index within the `content` array.  
      In practice, this is usually interpreted as the other endpoint of the range:
      - If `start_block_index === end_block_index`, it typically indicates citing a single block.
      - If they differ, it indicates a citation range spanning multiple blocks.

  - **web_search_result_location: cite Web search results**

    ```ts
    {
      type: "web_search_result_location",
      cited_text: string,
      url: string,
      title: string,
      encrypted_index: string
    }
    ```

    Used when Anthropic’s Web Search tool (server tool) is enabled and Claude cites content from a webpage.

    Field details:
    - `type` `string` <font color="red">Required</font>  
      Must be `"web_search_result_location"`, meaning this citation comes from Web search results.

    - `cited_text` `string` <font color="red">Required</font>  
      A snippet of cited webpage text (usually truncated for display) and does not count toward token usage.

    - `url` `string` <font color="red">Required</font>  
      The cited webpage URL, which the frontend can render as a clickable link.

    - `title` `string` <font color="red">Required</font>  
      The cited webpage title (e.g., HTML `<title>`), for UI display such as “Source: xxx”.

    - `encrypted_index` `string` <font color="red">Required</font>  
      An **encrypted index identifier** for this search result. It must be returned to Anthropic verbatim for follow-up turns to continue citing or inspecting the same result.  
      You typically don’t need to show it to end users, but you must preserve it for multi-turn conversations / debugging.

  - **search_result_location: cite custom retrieval results (SearchResultBlock)**

    ```ts
    {
      type: "search_result_location",
      cited_text: string,
      source: string | null,
      title: string | null,
      search_result_index: number,
      start_block_index: number,
      end_block_index: number
    }
    ```

    When you provide your own **search / RAG results** to Claude via a `type: "search_result"` content block and enable citations, Claude will use this type when citing those results in its answer.

    Field details:
    - `type` `string` <font color="red">Required</font>  
      Must be `"search_result_location"`, meaning the citation comes from a SearchResultBlock you provided.

    - `cited_text` `string` <font color="red">Required</font>  
      The exact cited text snippet, sourced from the text in a `search_result` content block.

    - `source` `string | null` <font color="red">Required</font>  
      The source identifier of the search result:
      - Usually a URL (e.g., a knowledge base document link);
      - Or a custom string ID you define;
      - May be `null` if you did not provide it in the original `search_result`.

    - `title` `string | null` <font color="red">Required</font>  
      The search result title, corresponding to `search_result.title`;  
      If no title is available, it is `null`.

    - `search_result_index` `number` <font color="red">Required</font>  
      The 0-based index of the **`type: "search_result"` block** being cited within the current `message.content`.  
      Whether you place these results in a user message or they are returned by a tool, they are numbered by appearance order.

    - `start_block_index` `number` <font color="red">Required</font>  
      The 0-based starting block index of the cited content within that `search_result`’s `content` array.

    - `end_block_index` `number` <font color="red">Required</font>  
      The ending block index within that `content` array.
      - If it equals `start_block_index`, it typically means a single content block is cited.
      - Otherwise, it indicates a citation range spanning multiple blocks.

:::

::: details ImageBlockParam

```ts
{
  type: "image",
  source: Base64ImageSource | URLImageSource,
  cache_control?: CacheControlEphemeral
}
```

- type `string` <font color="red">Required</font>  
  Must be `"image"`.
- source `Base64ImageSource | URLImageSource` <font color="red">Required</font> :
  - Base64ImageSource
    ```ts
    {
      type: "base64",
      media_type: "image/jpeg" | "image/png" | "image/gif" | "image/webp",
      data: string // base64-encoded
    }
    ```
  - URLImageSource
    ```ts
    {
      type: "url",
      url: string
    }
    ```
- cache_control `CacheControlEphemeral` <font color="gray">Optional</font>: same as above; you can create a cache breakpoint for images.

:::

::: details DocumentBlockParam

```ts
{
  type: "document",
  source: Base64PDFSource | PlainTextSource | ContentBlockSource | URLPDFSource,
  cache_control?: CacheControlEphemeral,
  citations?: TextCitationParam[],
  context?: string,
  title?: string
}
```

- type `string` <font color="red">Required</font>  
  Must be `"document"`.
- source `Base64PDFSource | PlainTextSource | ContentBlockSource | URLPDFSource` <font color="red">Required</font> :
  - Base64PDFSource: base64 PDF

  ```ts
  {
    type: "base64",
    media_type: "application/pdf",
    data: string
  }
  ```

  - PlainTextSource: a full plain-text document
    ```ts
    {
      type: "text",
      media_type: "text/plain",
      data: string
    }
    ```
  - ContentBlockSource: provide a set of `ContentBlock`s as the document content (multimodal)
    ```ts
    {
      type: "content",
      content: string | ContentBlockSourceContent[]
    }
    ```
  - URLPDFSource: reference a remote PDF
    ```ts
    {
      type: "url",
      url: string
    }
    ```

- cache_control `CacheControlEphemeral` <font color="gray">Optional</font>: same as above; you can create a cache breakpoint for documents.
- citations `TextCitationParam[]` <font color="gray">Optional</font>: same as above; used to **attribute the source of quoted text** (typical scenario: provide PDFs / text documents / content documents as `document` blocks and mark “which page / which paragraph / which search result this part of the answer comes from”).
- context `string` <font color="gray">Optional</font>: document context.
- title `string` <font color="gray">Optional</font>: document title.

:::

::: details ToolResultBlockParam

```ts
{
  type: "tool_result",
  tool_use_id: string,          // Corresponds to the id in the previous tool_use block
  content?: string | (TextBlockParam | ImageBlockParam | SearchResultBlockParam | DocumentBlockParam)[]
  cache_control?: CacheControlEphemeral,
  is_error?: boolean
}
```

- type `string` <font color="red">Required</font>  
  Must be `"tool_result"`.
- tool_use_id `string` <font color="red">Required</font>, binds to the specific tool invocation.
- is_error `boolean` <font color="gray">Optional</font>.
- content: either a simple string or an array of multimodal blocks (text / images / documents / search results) <font color="gray">Optional</font>.
- cache_control `CacheControlEphemeral` <font color="gray">Optional</font>: same as above.

:::

::: details ToolUseBlockParam

```ts
{
  type: "tool_use",
  id: string,                     // Unique tool invocation ID
  name: string,                   // Tool name defined in tools
  input: Record<string, unknown>, // JSON matching the tool's input_schema
  cache_control?: CacheControlEphemeral
}
```

Field details:

- type `string` <font color="red">Required</font>  
  Must be `"tool_use"`.

- id `string` <font color="red">Required</font>  
  The unique identifier for this tool invocation, used to match the subsequent `tool_result`.

- name `string` <font color="red">Required</font>  
  The tool name to call. It **must exactly match** a `tool.name` declared in the request’s `tools` array.

- input `object` (Record<string, unknown>) <font color="red">Required</font>

- cache_control `CacheControlEphemeral` <font color="gray">Optional</font>: same as above,
  sets caching behavior (Prompt Cache breakpoint) for this tool invocation block.

:::

::: details ServerToolUseBlockParam

Indicates that Claude decides to call a **server-side tool** (hosted by Anthropic, not a client tool you implement), for example:

```ts
{
  type: "server_tool_use",
  id: string,
  name: string,
  input: Record<string, unknown>,
  cache_control?: CacheControlEphemeral
}
```

Field details:

- type `string` <font color="red">Required</font>  
  Must be `"server_tool_use"`, indicating this is a server-side tool call request.

- id `string` <font color="red">Required</font>  
  The unique ID for this server tool invocation, like `"srvtoolu_..."`.  
  Subsequent result blocks (e.g., `web_search_tool_result`) will reference this ID via `tool_use_id`.

- name `string` <font color="red">Required</font>  
  The server tool name to call, for example:
  - `"web_search"`: Web Search tool

- input `object` <font color="gray">Optional</font>  
  Parameters passed to the server tool. The structure is defined by the specific tool.

:::

::: details WebSearchToolResultBlockParam

When using the Web Search tool, Claude will return one or more `web_search_tool_result` content blocks within the same `assistant` message, representing “the web_search results or error for this call”.

```ts
{
  type: "web_search_tool_result",
  tool_use_id: string,
  content: `array | object`,
  cache_control?: CacheControlEphemeral
}
```

Field details:

- type `string` <font color="red">Required</font>  
  Must be `"web_search_tool_result"`, indicating a Web Search tool result.

- tool_use_id `string` <font color="red">Required</font>  
  References the corresponding prior `server_tool_use.id`, used to associate the “search request” and the “search results”.

- cache_control `CacheControlEphemeral` <font color="gray">Optional</font>: same as above.

- content `array | object` <font color="red">Required</font>  
  The execution result of Web Search:
  - On success: an array of **`web_search_result` objects**;
  - On failure: a `web_search_tool_result_error` object (see the error structure below).

###### `web_search_result` object (on success)

When `content` is an array, each element is a `web_search_result` object:

Field details:

- type `string` <font color="red">Required</font>  
  Must be `"web_search_result"`.

- url `string` <font color="red">Required</font>  
  The URL of the result page, typically consistent with the `url` in `citations`.

- title `string` <font color="red">Required</font>  
  The page title, used for frontend display of the citation source.

- encrypted_content `string` <font color="red">Required</font>  
  An encrypted string of the page’s main content.  
  In **multi-turn conversations**, if you want Claude to continue citing this result accurately, you need to return this field verbatim as part of the conversation (e.g., via a later `web_search_result_location` citation). This field is **opaque and not parseable** to you.

- page_age `string` <font color="gray">Optional</font>  
  An approximate last-update or crawl time, such as `"April 30, 2025"`, mainly for user display of “data freshness”.

###### Error result structure: `web_search_tool_result_error`

If the Web Search tool itself errors (e.g., exceeds max uses, invalid request, etc.), the `content` field of `web_search_tool_result` will be an error object:

```jsonc
{
  "type": "web_search_tool_result",
  "tool_use_id": "servertoolu_a93jad",
  "content": {
    "type": "web_search_tool_result_error",
    "error_code": "max_uses_exceeded",
  },
}
```

Error object fields:

- type `string` <font color="red">Required</font>  
  Must be `"web_search_tool_result_error"`.

- error_code `string` <font color="red">Required</font>  
  Error type code. Common values include:
  - `"too_many_requests"`: the search tool hit a rate limit;
  - `"invalid_input"`: invalid search parameters (e.g., invalid domain filters);
  - `"max_uses_exceeded"`: exceeded the `max_uses` limit configured for this request;
  - `"query_too_long"`: the generated search query is too long;
  - `"unavailable"`: an internal error or temporary unavailability of the search service.

> Even when an error occurs, the HTTP status code is still 200. The error is only reflected in the `content` of `web_search_tool_result`. You should decide how to degrade gracefully or notify users based on `error_code`.

:::

::: details ThinkingBlockParam

```ts
{
  type: "thinking",
  thinking: string,
  signature: string,
}
```

Field details:

- type `string` <font color="red">Required</font>  
  Must be `"thinking"`, indicating an Extended Thinking reasoning block.

- thinking `string` <font color="red">Required</font>  
  Claude’s **human-readable reasoning content**, typically a multi-line step-by-step analysis.

- signature `string` <font color="red">Required</font>  
  An encrypted signature of the full thinking content, used in subsequent turns to verify that these reasoning blocks **were generated by Claude and have not been tampered with**.
  - This is an **opaque field**; you do not need to and should not parse it.
  - When you send back a previous `assistant` message that includes thinking to the API, you should include the full `thinking` + `signature` **verbatim**.

> In streaming mode:
>
> - `thinking` text is emitted incrementally via `thinking_delta` in `content_block_delta` events;
> - `signature` is appended once via a `signature_delta` event before the block ends. You must concatenate all `thinking_delta.thinking` pieces, and then combine with the final `signature` as a complete thinking block.\

:::

::: details SearchResultBlockParam

Used to provide your own search / RAG results as structured content to Claude, making it easier for the model to cite them in its response and automatically generate `search_result_location` citations.

Typical scenario: you retrieve from a vector DB / document store on the backend, then place results into `messages[*].content` as `search_result` blocks.

```ts
{
  type: "search_result",
  source?: string,
  title?: string,
  content: Array<TextBlockParam | ImageBlockParam | DocumentBlockParam>,
  cache_control?: CacheControlEphemeral,
  citations?: {
    enabled: boolean
  }
}
```

Field details:

- type `string` <font color="red">Required</font>  
  Must be `"search_result"`, indicating a search/retrieval result content block.

- source `string` <font color="gray">Optional</font>  
  A source identifier for the search result:
  - Usually a URL (e.g., knowledge base doc link, internal doc viewer link);
  - Or a custom string ID (e.g., document primary key);
  - If inconvenient to provide, you can omit it or set it to `null`.  
    When Claude generates `search_result_location` citations, it will return this field verbatim so you can display “From: xxx” in the UI.

- title `string` <font color="gray">Optional</font>  
  The title of the search result:
  - Such as “API Reference: Authentication” or “Employee Handbook · Leave Policy”;
  - If no suitable title is available, it can be `null`.  
    In citations, it is used directly as the citation title for UI rendering.

- content `array` <font color="red">Required</font>  
  The **actual content snippets** of the search result, consisting of one or more content blocks, typically text-heavy but can include images / documents, etc.

- cache_control `CacheControlEphemeral` <font color="gray">Optional</font>: same as above.

- citations `object` <font color="gray">Optional</font>

  Whether to enable automatic citation attribution based on this search result. Typical usage:

  ```ts
  citations: {
    enabled: boolean;
  }
  ```

  - enabled `boolean` <font color="red">Required</font>
    - `true`: allow Claude to generate `search_result_location` citations for this `search_result` in the response;
    - `false`: do not generate citations for this block (the model can still read and use it).

:::

::: details RedactedThinkingBlockParam

`RedactedThinkingBlockParam` corresponds to a `type: "redacted_thinking"` content block and is part of the Extended Thinking system. Unlike a normal `thinking` block, **its reasoning content is encrypted/redacted and not presented in plain text**, mainly for safety/compliance while still allowing the model to reference its prior reasoning across turns.

You will typically only see it in model outputs and return it **verbatim** in subsequent requests; you rarely need to construct it yourself.

```ts
{
  type: "redacted_thinking",
  data: string
}
```

Field details:

- type `string` <font color="red">Required</font>  
  Must be `"redacted_thinking"`, indicating a **redacted thinking block**.
  - Compared with `type: "thinking"`:
    - `thinking`: returns readable natural-language reasoning text + signature;
    - `redacted_thinking`: returns **unreadable encrypted data** and does not include readable reasoning content.

- data `string` <font color="red">Required</font>  
  The encrypted/redacted thinking data string, usually a long Base64/ciphertext-like blob.
  - You cannot and do not need to parse this data.
  - Key point: to carry this thinking context forward into later turns, include the entire `redacted_thinking` block verbatim in a new request as part of the prior `assistant` messages.

:::

### model `string` <font color="red">Required</font>

The model ID used for this call.

- This is a ZenMux-defined model name, for example:
  - `"anthropic/claude-sonnet-4.5"`

> Note: This differs from the Anthropic API-style `<model>` string.

<!-- ### metadata `object` <font color="gray">Optional</font>

Business metadata for the request.

Current official structure:

```ts
metadata?: {
  user_id?: string
}
```

- user_id `string` <font color="red"></font>
  An **anonymous identifier** for the external user (uuid / hash / internal ID), which Anthropic may use for abuse detection.
  Do not include real names, email addresses, phone numbers, or other sensitive personal information. Max 256 characters. -->

<!-- ### service_tier `"auto" | "standard_only"` <font color="gray">Optional</font><font color="red">Not supported</font>

Controls service tier and capacity routing.

- `"auto"` (default): automatically chosen from available capacity; may use priority capacity when needed.
- `"standard_only"`: use standard capacity only and do not use priority lanes. -->

### output_config `object` <font color="gray">Optional</font>

Configuration options for model output, such as output format.

- format `object` a schema used to specify Claude’s response output format.
  - schema `Record<string, unknown>` the JSON schema for the format
  - type `string` must be `"json_schema"`

### stop_sequences `string[]` <font color="gray">Optional</font>

Custom **stop sequences**.

- When the generated text contains any stop sequence:
  - Generation stops immediately;
  - `stop_reason = "stop_sequence"` in the response;
  - `stop_sequence` is set to the matched string.
- If not set, the model stops at natural completion with `end_turn`.

Common usage:

- Use `"END"` as an end-of-answer marker;
- Combine with “multi-part output” protocols.

### stream `boolean` <font color="gray">Optional</font>

Whether to return results **as a stream** via SSE (Server-Sent Events).

- `false` (default): return a complete `message` object in one response.
- `true`: incrementally stream output via multiple events (see “Streaming Response” below).

### system `string | TextBlockParam[]` <font color="gray">Optional</font>

A System Prompt that sets **global instructions and roles** for the conversation. This is equivalent to Claude’s “overall rules” and takes effect before all `messages`.

#### Type formats

- You can provide a **string** directly (most common):

  ```json
  "system": "You are a helpful assistant."
  ```

- Or you can provide an array of **TextBlockParam**, with the same structure as message:

  ```json
  "system": [
    {
      "type": "text",
      "text": "You are a helpful assistant that answers in Chinese.",
      "cache_control": { "type": "ephemeral", "ttl": "1h" }
    },
    {
      "type": "text",
      "text": "The current date is 2025-01-15."
    }
  ]
  ```

> Note: The Messages API **does not have a `role: "system"` message**. All system-level instructions are passed via the top-level `system` field.

### temperature `number` <font color="gray">Optional</font>

Sampling temperature, controlling output randomness.

- Default: `1.0`
- Range: `0.0 ~ 1.0`
  - Closer to 0: more deterministic, more “exam-like”; suitable for multiple-choice questions and rigorous reasoning.
  - Closer to 1: more diverse and creative; suitable for brainstorming and creative writing.
- Even `0.0` is not absolutely deterministic.

### thinking `object` <font color="gray">Optional</font>

Extended Thinking (explicit reasoning process) configuration.

```ts
thinking?:
  | { type: "enabled";  budget_tokens: number }
  | { type: "disabled" }
```

- `type: "enabled"`:
- budget_tokens `number`:
  - Token budget allocated for internal reasoning;
  - Must be `>= 1024` and `< max_tokens`;
  - Larger budgets typically improve reasoning quality for complex problems, but increase latency/cost.
  - The response will include content blocks with `type: "thinking"`.
- `type: "disabled"`: disables extended thinking (default behavior).

### tool_choice `object` <font color="gray">Optional</font>

Controls how Claude uses tools declared in `tools`.

```ts
tool_choice?:
  | { type: "auto";  disable_parallel_tool_use?: boolean }
  | { type: "any";   disable_parallel_tool_use?: boolean }
  | { type: "tool";  name: string; disable_parallel_tool_use?: boolean }
  | { type: "none" }
```

- `"auto"` (recommended default)
  - Claude decides **whether** to use tools and **which** tools to use;
  - `disable_parallel_tool_use?: boolean`:
    - `false` (default): allow multiple parallel `tool_use` blocks in a single response;
    - `true`: call at most 1 tool.
- `"any"`
  - Means “any tool may be used”; similar to `"auto"` but typically more strongly encourages tool usage;
  - `disable_parallel_tool_use` has the same meaning as above.
- `"tool"`
  - Forces the use of a specific tool:
    ```ts
    { type: "tool", name: "get_weather" }
    ```
  - If `disable_parallel_tool_use` is `true`, only this tool is called once.
- `"none"`
  - Disables tool usage; generate text/multimodal output only.

### tools `array<ToolUnion>` <font color="gray">Optional</font>

Declares the list of **tools** Claude can use in this request.

Officially, tools are divided into:

- **Client tools**: implemented by you in your application (similar to “function calling”)
- **Server tools**: hosted by Anthropic, such as Web Search, Bash, Text Editor, etc.

#### 1. Custom (Client) Tool

The most basic JSON Schema tool definition:

```ts
{
  type?: "custom",              // Optional
  name: string,                 // Tool name (<= 128 chars)
  description?: string,         // Strongly recommended; the more detailed the better
  input_schema: {
    type: "object",
    properties?: { [key: string]: any },
    required?: string[]
  },
  cache_control?: CacheControlEphemeral
}
```

- name: Claude uses this name to call your tool in a `tool_use` block;
- description: clearly explain the tool purpose, parameter meanings, and usage constraints in natural language; this helps the model decide whether to call it and how to fill parameters correctly;
- input_schema: JSON Schema for the tool `input`;
- cache_control: define cache breakpoints for the tool.

Example `tool_use` block generated by Claude:

```json
{
  "type": "tool_use",
  "id": "toolu_01D7FLrfh4G...",
  "name": "get_stock_price",
  "input": { "ticker": "^GSPC" }
}
```

After you run the tool, return the result in a `tool_result` block in the next user message.

#### 2. Built-in Server Tools (selected)

The Messages API docs list several built-in tool types, typical examples include:

- Bash tool: `type: "bash_20250124"`, `name: "bash"`
- Text editor: `type: "text_editor_2025xxxx"`, `name: "str_replace_editor"` / `"str_replace_based_edit_tool"` etc.
  - Some versions include a `max_characters` field to cap the number of characters returned for display.
- Web Search tool:  
  `type: "web_search_20250305"`, `name: "web_search"`

  Configuration options include:

  ```ts
  {
    name: "web_search",
    type: "web_search_20250305",
    allowed_domains?: string[],
    blocked_domains?: string[],
    max_uses?: number,
    user_location?: {
      type: "approximate",
      city?: string,
      country?: string, // ISO 3166-1 alpha-2
      region?: string,
      timezone?: string // IANA time zone ID
    },
    cache_control?: CacheControlEphemeral
  }
  ```

> For detailed semantics, invocation patterns, and billing details of each built-in tool, refer to Anthropic’s separate [“Server tools”](https://platform.claude.com/docs/en/api/messages/create) documentation.

### top_k `number` <font color="gray">Optional</font>

During sampling, choose only from the top K tokens with the highest probabilities.

- Used to truncate low-probability “long tail” tokens;
- Recommended only for advanced tuning; in most cases, `temperature` alone is sufficient;
- `>= 0`.

### top_p `number` <font color="gray">Optional</font>

Nucleus sampling parameter.

- Accumulate probability mass in descending order until the total reaches `top_p`, and sample only from that set;
- Range: `0.0 ~ 1.0`;
- Typically used as an alternative to `temperature`; not recommended to adjust both significantly at the same time.

### Unsupported fields

| Field name    | Type   | Supported     | Description                     |
| ------------- | ------ | ------------- | ------------------------------- |
| metadata      | object | ❌ Not supported | Business metadata for the request |
| service_tier  | string | ❌ Not supported | Service tier                    |

## Response

### Non-streaming: returns a “complete message object”

When calling `POST /v1/messages` with **`stream: false` (or omitted)**, Anthropic returns a complete **Message object** in one response. The following describes the field structure layer by layer.

```json
{
  "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
  "type": "message",
  "role": "assistant",
  "model": "claude-sonnet-4-5-20250929",
  "content": [ ... ],
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": { ... }
}
```

#### id `string`

The unique ID of this message.

#### type `"message"`

Object type. Fixed to `"message"` for the Messages API.

#### role `"assistant"`

The author role of the message generated by Claude. Always `"assistant"`.

#### model `string`

The model name that actually processed this request (same as or equivalent to the `model` in the request).

#### content `array<ContentBlock>`

Claude’s response content array. Element types match the ContentBlock descriptions above (text / image / document / tool_use / tool_result / thinking / web_search_result, etc.).

> If the last message in your request has `role: "assistant"`, this reply’s `content` will continue directly after that previous content, implementing prefix constraints.

Common returned block example (text-only):

```json
{
  "content": [
    {
      "type": "text",
      "text": "Hi! My name is Claude.",
      "citations": [ ... ]
    }
  ]
}
```

#### stop_reason `string`

Why the model stopped generating.

Possible values:

- `"end_turn"`: natural completion; one answer is finished;
- `"max_tokens"`: reached `max_tokens` or the model limit;
- `"stop_sequence"`: hit a sequence in `stop_sequences`;
- `"tool_use"`: the response includes one or more `tool_use` content blocks;
- `"pause_turn"`: for long-running server tool calls, the model pauses and waits for you to send back context to continue generating;
- `"refusal"`: safety classifier intervened and the model refused the request.

> In non-streaming mode, `stop_reason` is always non-null; in streaming mode, it is non-null only in certain events.

#### stop_sequence `string | null`

If `stop_reason = "stop_sequence"`, this is the matched string; otherwise it is `null`.

#### usage `object`

Token usage and tool usage statistics for this request.

##### usage.cache_creation `object`

A breakdown of input tokens consumed to create new Prompt Cache entries (cache breakpoints) in this request.

- **ephemeral_1h_input_tokens** `number`  
  Input tokens counted toward cache writes for newly created ephemeral cache breakpoints with a **1-hour** TTL.  
  Typically corresponds to parts where you set `cache_control: { type: "ephemeral", ttl: "1h" }`.

- **ephemeral_5m_input_tokens** `number`  
  Input tokens counted toward cache writes for newly created ephemeral cache breakpoints with a **5-minute** TTL.  
  Typically corresponds to cache breakpoints with `ttl: "5m"`.

> Note: These fields only account for the “cache write” cost, not the “read” cost when reused later.

##### cache_creation_input_tokens `number`

The total number of input tokens written for **all newly created cache breakpoints** (both 5 minutes and 1 hour) in this request.

- Equals `cache_creation.ephemeral_1h_input_tokens + cache_creation.ephemeral_5m_input_tokens`;
- These tokens are billed as part of this request and are also written into cache for future reuse.

##### cache_read_input_tokens `number`

The number of input tokens **read from existing Prompt Cache hits** in this request.

- These tokens are **not billed again as normal input** in this request (or billed under cache pricing policy),  
  and they also **do not count against the context-length quota** (depending on Anthropic’s internal implementation);
- Non-zero only when cache hits occur.

##### input_tokens `number`

The number of input tokens that are **actually counted toward inference** for this request.

##### output_tokens `number`

The number of output tokens **generated by Claude** in this request.

##### server_tool_use `object`

Server tool usage statistics in this request (server tools hosted by Anthropic).

- **web_search_requests** `number`
  The number of times the Web Search tool was **actually invoked** in this request.
  - Each time Claude emits a `type: "server_tool_use"` with `name: "web_search"` and it is successfully executed by the backend, this counter increments by 1;
  - Useful for tracking how many Web searches were used to obtain real-time information in the answer.

> If Web Search is not enabled or not triggered in this request, this value is `0`.

##### service_tier `"standard" | string`

The **service tier / capacity layer** actually used to process the request.

- Corresponds to your requested `service_tier` (e.g., `"standard_only"`) and the system’s routing result;
- Common examples:
  - `"standard"`: standard capacity tier;
  - Or other internal identifier strings for different service channels or priorities.

### Streaming: returns multiple SSE event objects

When you set **`stream: true`** in the request, Anthropic continuously pushes a series of events via **SSE (Server‑Sent Events)**. Each event is a JSON object. The client should:

1. Read each SSE event in arrival order;
2. Determine the event type via `event: <type>`;
3. Incrementally assemble the complete message from the JSON in `data:`.

Common event types:

- `message_start`
- `content_block_start`
- `content_block_delta`
- `content_block_stop`
- `message_delta`
- `message_stop`
- `error`

#### Top level: basic SSE event format

Each event line sent by the server looks like:

```text
event: content_block_delta
data: { ...JSON object... }
```

Below is the `data` object structure by event type.

::: details 1. `message_start` event

**Meaning**: starts a new assistant message and provides the message’s basic metadata.

```json
{
  "type": "message_start",
  "message": {
    "id": "msg_01ExampleID",
    "type": "message",
    "role": "assistant",
    "model": "claude-3-5-sonnet-20241022",
    "content": [],
    "stop_reason": null,
    "stop_sequence": null,
    "usage": {
      "input_tokens": 25,
      "output_tokens": 0
    }
  }
}
```

##### type `string`

Event type, fixed to:

- `"message_start"`

##### message `object`

The basic structure of the Message that is about to be streamed. Fields largely match the non-streaming Message top level (but `content` is usually an empty array and `output_tokens` may be 0 at this point):

- id `string`: message ID
- type `string`: fixed `"message"`
- role `string`: fixed `"assistant"`
- model `string`: actual model name used
- content `array`: initially empty; filled incrementally by subsequent `content_block_*` events
- stop_reason `string or null`: initially null; updated later via `message_delta`
- stop_sequence `string or null`: initially null; updated later via `message_delta`
- usage `object`: currently known token usage (`output_tokens` starts at 0; final value is provided in `message_delta`)

:::

::: details 2. `content_block_start` event

**Meaning**: starts a new content block (e.g., a segment of text, or a tool invocation).

```json
{
  "type": "content_block_start",
  "index": 0,
  "content_block": {
    "type": "text",
    "text": ""
  }
}
```

##### type `string`

Event type, fixed to:

- `"content_block_start"`

##### index `integer`

The index of this block in the overall `message.content` array (0-based).  
Subsequent `content_block_delta` / `content_block_stop` events with the same index refer to the same block.

##### content_block `object`

The initial structure of the content block. Same as `content[i]` in non-streaming responses, but often an “empty shell”; the real text or parameters are added incrementally through subsequent delta events.

Typical examples:

1. Text block start:

   ```json
   {
     "type": "text",
     "text": ""
   }
   ```

2. Tool invocation block start:

   ```json
   {
     "type": "tool_use",
     "id": "toolu_01H...",
     "name": "get_weather",
     "input": {}
   }
   ```

:::

::: details 3. `content_block_delta` event

**Meaning**: an “incremental update” to a content block, mainly appending text or progressively building tool invocation parameters.

```json
{
  "type": "content_block_delta",
  "index": 0,
  "delta": {
    "type": "text_delta",
    "text": "Hello, "
  }
}
```

Or for tool invocation parameters:

```json
{
  "type": "content_block_delta",
  "index": 1,
  "delta": {
    "type": "input_json_delta",
    "partial_json": "{\"location\": \"San "
  }
}
```

##### type `string`

Event type, fixed to:

- `"content_block_delta"`

##### index `integer`

The content block index this delta applies to.  
Must match a previously received `content_block_start.index`.

##### delta `object`

The **incremental payload**. Its structure depends on the target block type.

##### Text block delta: `type = "text_delta"`

```json
{
  "type": "text_delta",
  "text": "Hello, "
}
```

##### type `string`

- `"text_delta"`

##### text `string`

The new text fragment. The client should concatenate `text` from all `text_delta` events for the same `index` in order to form the full text.

##### Tool invocation parameter delta: `type = "input_json_delta"`

When the assistant initiates `tool_use`, the tool parameters `input` may also be assembled via multiple deltas.

```json
{
  "type": "input_json_delta",
  "partial_json": "\"Francisco\", \"unit\": \"celsius\"}"
}
```

##### type `string`

- `"input_json_delta"`

##### partial_json `string`

A JSON fragment (string) that must be concatenated with earlier/later fragments to form the complete `input` object.  
You should not use this parameter to call your tool until all deltas are received and the JSON is fully parsed.

:::

::: details 4. `content_block_stop` event

**Meaning**: indicates that incremental generation for a content block has completed.

```json
{
  "type": "content_block_stop",
  "index": 0
}
```

##### type `string`

Event type, fixed to:

- `"content_block_stop"`

##### index `integer`

The content block index. Indicates that the text or tool parameters for this `index` are complete and no further deltas will be sent.

:::

::: details 5. `message_delta` event

**Meaning**: final incremental updates to the Message metadata, such as `stop_reason`, `usage`, etc.

```json
{
  "type": "message_delta",
  "delta": {
    "stop_reason": "end_turn",
    "stop_sequence": null,
    "usage": {
      "output_tokens": 73
    }
  }
}
```

##### type `string`

Event type, fixed to:

- `"message_delta"`

##### delta `object`

Incremental updates to top-level `message` fields. Common fields:

###### stop_reason `string or null`

Same as `stop_reason` in non-streaming responses, but provided via delta only when finalized:

- `"end_turn"`
- `"max_tokens"`
- `"stop_sequence"`
- `"tool_use"`
- `null`

###### stop_sequence `string or null`

Used with `stop_reason = "stop_sequence"`; otherwise usually `null`.

###### usage `object`

Contains only usage fields added/updated in this delta. Most commonly:

- output_tokens `integer`  
  The final total output token count (usually provided as a complete value in the last `message_delta`).

:::

::: details 6. `message_stop` event

**Meaning**: indicates that the stream for this message has fully ended and no more events will be sent.

```json
{
  "type": "message_stop"
}
```

##### type `string`

Event type, fixed to:

- `"message_stop"`

This event contains no other fields. After receiving it, the client can assume:

- All `content_block_*` events have ended;
- All `message_delta` updates have ended;
- The data can be assembled into a final Message object.

:::

::: details 7. `error` event (in exceptional cases)

If an error occurs during the request or generation, you may receive an `error` event and then the stream will terminate.

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "Your request is malformed."
  }
}
```

##### type `string`

Event type, fixed to:

- `"error"`

##### error `object`

Error details.

- type `string`  
  Error type, for example:
  - `"invalid_request_error"`
  - `"authentication_error"`
  - `"rate_limit_error"`
  - `"api_error"`
- message `string`  
  A human-readable error description for logging and debugging.

:::

::: api-request POST /api/anthropic/v1/messages

```TypeScript
import Anthropic from '@anthropic-ai/sdk';

// 1. Initialize the Anthropic client
const anthropic = new Anthropic({
  // 2. Replace with the API Key you obtained from the ZenMux user console
  apiKey: '<YOUR ZENMUX_API_KEY>', // [!code highlight]
  // 3. Point the base URL to the ZenMux endpoint
  baseURL: "https://zenmux.ai/api/anthropic", // [!code highlight]
});

async function main () {
    const msg = await anthropic.messages.create({
        model: "anthropic/claude-sonnet-4.5",
        max_tokens: 1024,
        messages: [{ role: "user", content: "Hello, Claude" }],
    });
    console.log(msg);
}

main();
```

```Python
import anthropic

## 1. Initialize the Anthropic client
client = anthropic.Anthropic(
    # Replace with the API Key you obtained from the ZenMux user console
    api_key="<YOUR ZENMUX_API_KEY>", # [!code highlight]
    # 3. Point the base URL to the ZenMux endpoint
    base_url="https://zenmux.ai/api/anthropic"  # [!code highlight]
)
message = client.messages.create(
    model="anthropic/claude-sonnet-4.5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
)
print(message.content)
```

```cURL
curl https://zenmux.ai/api/anthropic/v1/messages/v1/messages \
     --header "x-api-key: $ZENMUX_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "anthropic/claude-sonnet-4.5",
    "max_tokens": 1024,
    "messages": [
        {"role": "user", "content": "Hello, world"}
    ]
}'
```

:::

::: api-response

```json
{
  "model": "anthropic/claude-sonnet-4.5",
  "id": "d0558ffe17be44268a7506db5f0ded62",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello! How can I help you today?"
    }
  ],
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 10,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "cache_creation": {
      "ephemeral_5m_input_tokens": 0,
      "ephemeral_1h_input_tokens": 0
    },
    "output_tokens": 12,
    "service_tier": "standard"
  }
}
```

:::