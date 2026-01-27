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
POST https://zenmux.ai/api/anthropic
```

ZenMux supports the Anthropic API. See the API call examples below for usage.

> This document is written based on the official “Create a Message” docs. The parameter descriptions and nested structures are kept consistent with the official documentation.

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

Used when enabling one or more Beta features. `"code-execution-2025-08-25"` is not supported at the moment, so the `code_execution` tool cannot be used.

- Multiple beta versions can be specified by:
  - separating with commas: `anthropic-beta: files-api-2025-04-14,another-beta`
  - or repeating the header multiple times.

## Request Body

The request body is JSON. Parameters are as follows.

### max_tokens `number` <font color="red">Required</font>

The **maximum number of tokens** to generate, including normal responses and the thinking content from extended thinking (if enabled).

- Meaning: the model will generate up to this many tokens, **and may stop naturally earlier**, but will not exceed it.
- The maximum supported `max_tokens` varies by model; see each model’s documentation.
- Value: `>= 1`

### messages `array<Message>` <font color="red">Required</font>

Conversation history and the current user input.

- During training, the model assumes `user` / `assistant` alternate. You provide prior turns in `messages`, and the model generates the next `assistant` message.
- Multi-turn conversations are supported; consecutive messages with the same role will be merged internally.
- If the last item in `messages` is an `assistant` message, the reply will **continue generating directly after its `content`**, which can be used for “prefix-constrained” answers.
- Up to `100000` messages per request.

Unified structure for each array element:

```ts
Message = {
  role: "user" | "assistant",
  content: string | ContentBlock[]
}
```

#### role: `"user" | "assistant"`<font color="red">Required</font>

#### content `string | ContentBlock[]`<font color="red">Required</font>

- If you pass a string directly, it is equivalent to a single text block with `type: "text"`:
  - `{"role":"user","content":"Hello, Claude"}` is equivalent to  
    `{"role":"user","content":[{"type":"text","text":"Hello, Claude"}]}`
- Using an array lets you mix multiple content block types such as text, images, PDFs, tool results, and more.

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
   Create a **Prompt Cache breakpoint** on this block (for Anthropic context caching billing / reuse):

  ```ts
  CacheControlEphemeral = {
    type: "ephemeral",
    ttl: "5m" | "1h",
  };
  ```

  - ttl: Cache lifetime, `"5m"` / `"1h"`, default is 5 minutes.

- citations `TextCitationParam[]` <font color="gray">Optional</font>  
  Used to **attribute text citations** (typical scenario: after providing a PDF / text document / content document as a `document` block, annotate “which page/section/search result this part of the answer comes from”).  
  `TextCitationParam` is one of the following (depending on the cited content type):

  - **char_location: cite plain text or a content document by character range**

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

    Field descriptions:

    - `type` `string` <font color="red">Required</font>  
      Must be `"char_location"`, meaning the citation is located by a **character range**.

    - `cited_text` `string` <font color="red">Required</font>  
      The cited original text snippet (for human-readable display).  
      Typically the slice between `start_char_index` and `end_char_index`.

    - `document_index` `number` <font color="red">Required</font>  
      The index of the cited document in the current request, **0-based**.  
      If you passed multiple `document` blocks (or other citable documents), this indicates which one.

    - `document_title` `string` <font color="red">Required</font>  
      The document title or name, usually from the filename or an upstream title you provided, used to display “From: xxx”.

    - `start_char_index` `number` <font color="red">Required</font>  
      The start character index of the cited span in the document’s **full text**, **0-based, inclusive**.

    - `end_char_index` `number` <font color="red">Required</font>  
      The end character index of the cited span in the document’s full text, **0-based, typically exclusive**, i.e. `[start_char_index, end_char_index)`.

  - **page_location: cite a PDF by page range**

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

    Field descriptions:

    - `type` `string` <font color="red">Required</font>  
      Must be `"page_location"`, meaning the location is described by a **page range**.

    - `cited_text` `string` <font color="red">Required</font>  
      The cited PDF text snippet (readable text parsed from the PDF by the system).

    - `document_index` `number` <font color="red">Required</font>  
      The index of the cited PDF document in the current request, **0-based**.

    - `document_title` `string` <font color="red">Required</font>  
      The PDF title or filename, used for display.

    - `start_page_number` `number` <font color="red">Required</font>  
      The **starting page number** of the cited content, **1-based, inclusive**.  
      For example, `5` means “starting from page 5”.

    - `end_page_number` `number` <font color="red">Required</font>  
      The **ending page number** of the cited content, typically treated as the right endpoint of a half-open interval:
      - If `start_page_number = 5` and `end_page_number = 6`, you can interpret it as “the cited range is page 5”.
      - If the difference is greater than 1, it indicates a multi-page citation.

  - **content_block_location: cite a content document by content-block indices**

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

    Used to cite documents provided in “multi-content-block form” (for example, a `document` with `source.type = "content"` that contains multiple `text`/`image` blocks).

    Field descriptions:

    - `type` `string` <font color="red">Required</font>  
      Must be `"content_block_location"`.

    - `cited_text` `string` <font color="red">Required</font>  
      The cited original text snippet (from the corresponding content block’s text).

    - `document_index` `number` <font color="red">Required</font>  
      The index of the cited document in the current request, **0-based**.

    - `document_title` `string` <font color="red">Required</font>  
      The document title or name.

    - `start_block_index` `number` <font color="red">Required</font>  
      The **starting block index** in the document’s internal `content` array, 0-based.  
      Meaning “starting from which content block”.

    - `end_block_index` `number` <font color="red">Required</font>  
      The **ending block index** in the `content` array.  
      In practice, treat this as the other end of the range:
      - If `start_block_index === end_block_index`, it usually means only the single content block at that index is cited.
      - If different, it means a citation range spanning multiple blocks.

  - **web_search_result_location: cite a Web search result**

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

    Field descriptions:

    - `type` `string` <font color="red">Required</font>  
      Must be `"web_search_result_location"`, meaning this citation comes from Web search results.

    - `cited_text` `string` <font color="red">Required</font>  
      The cited webpage text snippet (typically truncated for display), not counted toward token usage.

    - `url` `string` <font color="red">Required</font>  
      The cited webpage URL, which the frontend can render as a clickable link.

    - `title` `string` <font color="red">Required</font>  
      The cited webpage title (e.g., HTML `<title>`), used to display “Source: xxx”.

    - `encrypted_index` `string` <font color="red">Required</font>  
      An **encrypted index identifier** for this search result. It must be passed back to Anthropic unchanged for future turns to continue citing or checking the same result.  
      Usually you don’t need to show it to end users, but you must preserve it fully for multi-turn conversations / debugging.

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

    When you provide your own search / RAG results to Claude using a `type: "search_result"` content block and enable citations, Claude uses this type to cite those results in its answer.

    Field descriptions:

    - `type` `string` <font color="red">Required</font>  
      Must be `"search_result_location"`, meaning this citation comes from the SearchResultBlock you provided.

    - `cited_text` `string` <font color="red">Required</font>  
      The exact cited text snippet, sourced from text in a `search_result` content block.

    - `source` `string | null` <font color="red">Required</font>  
      Search result source identifier:

      - Usually a URL (e.g., knowledge base document link);
      - Can also be a custom string ID;
      - May be `null` if not provided in the original `search_result`.

    - `title` `string | null` <font color="red">Required</font>  
      Search result title, corresponding to `search_result.title`;  
      `null` if no title is available.

    - `search_result_index` `number` <font color="red">Required</font>  
      Within the current `message.content`, which **`type: "search_result"` block** is being cited, 0-based.  
      Whether you put these search results in a user message or returned them via a tool, they are numbered in appearance order.

    - `start_block_index` `number` <font color="red">Required</font>  
      In the cited `search_result`’s `content` array, the **starting block index** of the cited content, 0-based.

    - `end_block_index` `number` <font color="red">Required</font>  
      The **ending block index** in that `content` array.
      - If equal to `start_block_index`, it usually means a single content block is cited;
      - Otherwise it indicates a citation range spanning multiple blocks.

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
- cache_control `CacheControlEphemeral` <font color="gray">Optional</font>: Same as above; can create a cache breakpoint for images.

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
  - PlainTextSource: an entire plain-text passage as the document
    ```ts
    {
      type: "text",
      media_type: "text/plain",
      data: string
    }
    ```
  - ContentBlockSource: a set of `ContentBlock`s as the document content (multimodal)
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
- cache_control `CacheControlEphemeral` <font color="gray">Optional</font>: Same as above; can create a cache breakpoint for documents.
- citations `TextCitationParam[]` <font color="gray">Optional</font>: Same as above; used to **attribute text citations** (typical scenario: provide PDF / text document / content document as a document block input, then annotate “which page/section/search result this part comes from”).
- context `string` <font color="gray">Optional</font>: Document context.
- title `string` <font color="gray">Optional</font>: Document title.

:::

::: details ToolResultBlockParam

```ts
{
  type: "tool_result",
  tool_use_id: string,          // Matches the id in a previous tool_use block
  content?: string | (TextBlockParam | ImageBlockParam | SearchResultBlockParam | DocumentBlockParam)[]
  cache_control?: CacheControlEphemeral,
  is_error?: boolean
}
```

- type `string` <font color="red">Required</font>  
  Must be `"tool_result"`.
- tool_use_id `string` <font color="red">Required</font>, binds to a specific tool call.
- is_error `boolean` <font color="gray">Optional</font>.
- content: can be a simple string, or a multimodal block array (text / image / document / search results) <font color="gray">Optional</font>.
- cache_control `CacheControlEphemeral` <font color="gray">Optional</font>: Same as above.

:::

::: details ToolUseBlockParam

```ts
{
  type: "tool_use",
  id: string,                     // Unique tool call ID
  name: string,                   // Tool name as defined in tools
  input: Record<string, unknown>, // JSON that conforms to the tool's input_schema
  cache_control?: CacheControlEphemeral
}
```

Field descriptions:

- type `string` <font color="red">Required</font>  
  Must be `"tool_use"`.

- id `string` <font color="red">Required</font>  
  A unique identifier for this tool call, used to match subsequent `tool_result`.

- name `string` <font color="red">Required</font>  
  The tool name to call. **It must exactly match a `tool.name` declared in the request’s `tools` array**.

- input `object` (Record<string, unknown>) <font color="red">Required</font>

- cache_control `CacheControlEphemeral` <font color="gray">Optional</font>: Same as above,  
  sets caching behavior (Prompt Cache breakpoint) for this tool call block.

:::

::: details ServerToolUseBlockParam

Indicates Claude decided to call a **server-side tool** (hosted by Anthropic, not a client tool you implement), for example:

```ts
{
  type: "server_tool_use",
  id: string,
  name: string,
  input: Record<string, unknown>,
  cache_control?: CacheControlEphemeral
}
```

Field descriptions:

- type `string` <font color="red">Required</font>  
  Must be `"server_tool_use"`, indicating a server-side tool invocation request.

- id `string` <font color="red">Required</font>  
  Unique ID for this server tool call, like `"srvtoolu_..."`.  
  Subsequent result blocks (e.g., `web_search_tool_result`) will reference this ID via `tool_use_id`.

- name `string` <font color="red">Required</font>  
  The server tool name, for example:

  - `"web_search"`: Web Search tool

- input `object` <font color="gray">Optional</font>  
  Parameters passed to the server tool, with structure defined by the specific tool.

:::

::: details WebSearchToolResultBlockParam

When using the Web Search tool, Claude will return one or more `web_search_tool_result` content blocks in the same `assistant` message, indicating “the search results or an error for this web_search run”.

```ts
{
  type: "web_search_tool_result",
  tool_use_id: string,
  content: `array | object`,
  cache_control?: CacheControlEphemeral
}
```

Field descriptions:

- type `string` <font color="red">Required</font>  
  Must be `"web_search_tool_result"`, indicating a Web Search tool result.

- tool_use_id `string` <font color="red">Required</font>  
  Points to the corresponding `server_tool_use.id`, used to match “search request” with “search result”.

- cache_control `CacheControlEphemeral` <font color="gray">Optional</font>: Same as above.

- content `array | object` <font color="red">Required</font>  
  The Web Search execution result:
  - On success: an array of **`web_search_result` objects**;
  - On failure: a `web_search_tool_result_error` object (see the error structure below).

###### `web_search_result` object (on success)

When `content` is an array, each element is a `web_search_result` object:

Field descriptions:

- type `string` <font color="red">Required</font>  
  Must be `"web_search_result"`.

- url `string` <font color="red">Required</font>  
  The URL of this search result page; typically matches the `url` in `citations`.

- title `string` <font color="red">Required</font>  
  The page title, used to display citation sources in the UI.

- encrypted_content `string` <font color="red">Required</font>  
  An encrypted string of the page’s main content.  
  In **multi-turn conversations**, if you want Claude to continue accurately citing this result, you must pass this field back unchanged (e.g., via a later `web_search_result_location` citation). This field is **opaque and not parseable** to you.

- page_age `string` <font color="gray">Optional</font>  
  The approximate last update/crawl time, e.g. `"April 30, 2025"`, mainly for displaying “data freshness”.

###### Error structure: `web_search_tool_result_error`

If the Web Search tool itself errors (e.g., max calls exceeded, invalid request), the `content` field of `web_search_tool_result` will be an error object:

```jsonc
{
  "type": "web_search_tool_result",
  "tool_use_id": "servertoolu_a93jad",
  "content": {
    "type": "web_search_tool_result_error",
    "error_code": "max_uses_exceeded"
  }
}
```

Error object fields:

- type `string` <font color="red">Required</font>  
  Must be `"web_search_tool_result_error"`.

- error_code `string` <font color="red">Required</font>  
  Error code. Common values include:
  - `"too_many_requests"`: the search tool hit a rate limit;
  - `"invalid_input"`: invalid search parameters (e.g., invalid domain filters);
  - `"max_uses_exceeded"`: exceeded the `max_uses` limit configured for this turn;
  - `"query_too_long"`: generated search query is too long;
  - `"unavailable"`: internal error or temporary unavailability.

> Even when an error occurs, the HTTP status code is still 200. The error is only reflected in the `content` of `web_search_tool_result`. You should degrade gracefully or notify users based on `error_code`.

:::

::: details ThinkingBlockParam

```ts
{
  type: "thinking",
  thinking: string,
  signature: string,
}
```

Field descriptions:

- type `string` <font color="red">Required</font>  
  Must be `"thinking"`, indicating an Extended Thinking reasoning block.

- thinking `string` <font color="red">Required</font>  
  Claude’s **readable reasoning content**, typically multi-line step-by-step analysis.

- signature `string` <font color="red">Required</font>  
  An encrypted signature over the full thinking content, used in later multi-turn conversations to verify the reasoning blocks **were generated by Claude and not tampered with**.
  - This is an **opaque field**; you do not need to and should not parse it.
  - When you pass a previous `assistant` message containing thinking back to the API, you should include the full `thinking` + `signature` **unchanged**.

> In streaming mode:
>
> - the `thinking` text is emitted incrementally via `thinking_delta` within `content_block_delta` events;
> - the `signature` is appended via a single `signature_delta` event before the block ends. You need to concatenate all `thinking_delta.thinking` segments and combine with the final `signature` as a complete thinking block.\

:::

::: details SearchResultBlockParam

Used to provide your own search / RAG results to Claude as structured input, enabling the model to cite them in its answer and automatically generate `search_result_location` citations.

Typical scenario: you first query a vector store / document store in your backend, then insert the retrieved results into `messages[*].content` as `search_result` blocks.

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

Field descriptions:

- type `string` <font color="red">Required</font>  
  Must be `"search_result"`, indicating a search/retrieval result content block.

- source `string` <font color="gray">Optional</font>  
  The source identifier of the search result:

  - Usually a URL (e.g., knowledge base document link, internal doc viewer link);
  - Can also be a custom string ID (e.g., a document primary key);
  - If inconvenient to provide, you can omit it or set it to `null`.  
    When Claude generates `search_result_location` citations, it will return this field unchanged, which helps your frontend display “From: xxx”.

- title `string` <font color="gray">Optional</font>  
  The title of the search result:

  - e.g., “API Reference: Authentication”, “Employee Handbook · Leave Policy”;
  - If no suitable title is available, it can be `null`.  
    In citations, it is used directly as the citation title for UI rendering.

- content `array` <font color="red">Required</font>  
  The list of **actual content snippets** for the search result, consisting of one or more content blocks—typically mostly text, but may include images / documents, etc.

- cache_control `CacheControlEphemeral` <font color="gray">Optional</font>: Same as above.

- citations `object` <font color="gray">Optional</font>

  Whether to enable automatic citations for this search result. Typical form:

  ```ts
  citations: {
    enabled: boolean;
  }
  ```

  - enabled `boolean` <font color="red">Required</font>
    - `true`: allow Claude to generate `search_result_location` citations for this `search_result` in its answer;
    - `false`: do not generate citations for this block (the model can still read and use it).

:::

::: details RedactedThinkingBlockParam

`RedactedThinkingBlockParam` corresponds to the content block with `type: "redacted_thinking"` and is part of the Extended Thinking system. Unlike a regular `thinking` block, **its reasoning content is encrypted/redacted and not presented in plaintext**, primarily for safety/compliance while still allowing the model to reference its earlier reasoning in multi-turn conversations.

You typically only see it in model outputs and pass it back **unchanged** in subsequent requests; you rarely need to construct it yourself.

```ts
{
  type: "redacted_thinking",
  data: string
}
```

Field descriptions:

- type `string` <font color="red">Required</font>  
  Must be `"redacted_thinking"`, indicating a **redacted thinking block**.

  - Compared with `type: "thinking"`:
    - `thinking`: returns readable natural-language reasoning text + a signature;
    - `redacted_thinking`: returns **encrypted data that cannot be directly interpreted**, without readable reasoning.

- data `string` <font color="red">Required</font>  
  The encrypted/redacted thinking data string, typically a long Base64/ciphertext-looking blob.
  - You do not need to and cannot parse this data;
  - Key point: if you want to continue this thinking context in later turns, you must include the entire `redacted_thinking` block unchanged as part of the previous `assistant` history in the new request.

:::

### model `string` <font color="red">Required</font>

The model ID used for this call.

- This is a ZenMux-defined model name, for example:
  - `"anthropic/claude-sonnet-4.5"`

> Note: This differs from Anthropic API-style `<model>` strings.

<!-- ### metadata `object` <font color="gray">Optional</font>

Business metadata for the request.

Current official structure:

```ts
metadata?: {
  user_id?: string
}
```

- user_id `string` <font color="red"></font>
  An **anonymous identifier** for the external user (uuid / hash / internal ID). Anthropic may use it for abuse detection.
  Do not include real names, emails, phone numbers, or other sensitive personal information. Max length 256 characters. -->

<!-- ### service_tier `"auto" | "standard_only"` <font color="gray">Optional</font><font color="red">Not supported</font>

Controls the service tier and capacity routing.

- `"auto"` (default): automatically selects among available capacity; may use priority capacity if needed.
- `"standard_only"`: use only standard capacity; does not use the priority lane. -->

### stop_sequences `string[]` <font color="gray">Optional</font>

Custom **stop sequences**.

- When the model-generated text contains any stop sequence:
  - generation stops immediately;
  - `stop_reason = "stop_sequence"` in the response;
  - response field `stop_sequence` is the matched string.
- If not set, the model stops with `end_turn` on natural completion.

Common uses:

- Use `"END"` as an end-of-answer marker;
- Use together with a “multi-part output” protocol.

### stream `boolean` <font color="gray">Optional</font>

Whether to return results **streaming** via SSE (Server-Sent Events).

- `false` (default): returns the complete `message` object in one response.
- `true`: outputs incrementally as a stream of events (see “Streaming response” below).

### system `string | TextBlockParam[]` <font color="gray">Optional</font>

Sets the System Prompt—**global instructions and role** for this conversation. This is the “overall rule set” for Claude and takes effect before all `messages`.

#### Forms

- A **string** (most common):

  ```json
  "system": "You are a helpful assistant."
  ```

- Or a **TextBlockParam array**, structured like message content:

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

> Note: The Messages API **does not have a `role: "system"` message**. All system-level instructions must be provided via the top-level `system` field.

### temperature `number` <font color="gray">Optional</font>

Sampling temperature, controlling output randomness.

- Default: `1.0`
- Range: `0.0 ~ 1.0`
  - Closer to 0: more deterministic, more “exam-style”; suitable for multiple-choice questions and rigorous reasoning.
  - Closer to 1: more divergent and creative; suitable for brainstorming and creative writing.
- Even `0.0` is not absolutely deterministic.

### thinking `object` <font color="gray">Optional</font>

Extended Thinking (explicit reasoning process) configuration.

```ts
thinking?:
  | { type: "enabled";  budget_tokens: number }
  | { type: "disabled" }
```

- `type: "enabled"`：
- budget_tokens `number`：
  - Token budget allocated to the internal reasoning process;
  - Must be `>= 1024` and `< max_tokens`;
  - A larger budget typically improves reasoning quality on complex problems, but increases latency/cost.
  - The response will include content blocks with `type: "thinking"`.
- `type: "disabled"`: disables extended thinking (default behavior).

### tool_choice `object` <font color="gray">Optional</font>

Controls how Claude uses the tools declared in `tools`.

```ts
tool_choice?:
  | { type: "auto";  disable_parallel_tool_use?: boolean }
  | { type: "any";   disable_parallel_tool_use?: boolean }
  | { type: "tool";  name: string; disable_parallel_tool_use?: boolean }
  | { type: "none" }
```

- `"auto"` (recommended default)
  - Claude **decides on its own** whether to call tools and which tools to call;
  - `disable_parallel_tool_use?: boolean`：
    - `false` (default): allows multiple parallel `tool_use` blocks in a single response;
    - `true`: calls at most 1 tool.
- `"any"`
  - Means “any tool may be used”; similar to `"auto"` but usually more strongly encourages tool use;
  - `disable_parallel_tool_use` has the same meaning.
- `"tool"`
  - Forces using a specific tool:
    ```ts
    { type: "tool", name: "get_weather" }
    ```
  - When `disable_parallel_tool_use` is `true`, only this tool is called once.
- `"none"`
  - Disallows tool usage; only generates plain text/multimodal responses.

### tools `array<ToolUnion>` <font color="gray">Optional</font>

Declares the list of **tools** Claude can use in this request.

Officially, tools are categorized as:

- **Client tools**: implemented by you in your application (similar to “function calling”)
- **Server tools**: hosted by Anthropic, such as Web Search, Bash, Text Editor, etc.

#### 1. Custom (Client) Tool

The most basic JSON Schema tool definition:

```ts
{
  type?: "custom",              // Can be omitted
  name: string,                 // Tool name (<= 128 characters)
  description?: string,         // Strongly recommended; the more detailed, the better
  input_schema: {
    type: "object",
    properties?: { [key: string]: any },
    required?: string[]
  },
  cache_control?: CacheControlEphemeral
}
```

- name: Claude will call you using this name in a `tool_use` block;
- description: clearly describe what the tool does, parameter meanings, and constraints; helps the model decide whether to call it and how to fill parameters;
- input_schema: JSON Schema definition for the tool’s `input`;
- cache_control: can define cache breakpoints for the tool.

Example `tool_use` block generated by Claude:

```json
{
  "type": "tool_use",
  "id": "toolu_01D7FLrfh4G...",
  "name": "get_stock_price",
  "input": { "ticker": "^GSPC" }
}
```

After executing the tool, you then return the result as a `tool_result` block in the next user message.

#### 2. Built-in Server Tools (excerpt)

The Messages API docs list several built-in tool types, typically including:

- Bash tool: `type: "bash_20250124"`, `name: "bash"`
- Text editor: `type: "text_editor_2025xxxx"`, `name: "str_replace_editor"` / `"str_replace_based_edit_tool"` etc.
  - Some versions include a `max_characters` field to limit the number of characters returned/displayed.
- Web Search tool:  
  `type: "web_search_20250305"`, `name: "web_search"`

  Configurable fields include:

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
      timezone?: string // IANA timezone ID
    },
    cache_control?: CacheControlEphemeral
  }
  ```

> For detailed semantics, calling patterns, and billing details for each built-in tool, refer to Anthropic’s dedicated [“Server tools”](https://platform.claude.com/docs/en/api/messages/create) documentation.

### top_k `number` <font color="gray">Optional</font>

During sampling, choose only from the top K tokens by probability.

- Used to prune the long tail of low-probability tokens;
- Recommended only for advanced tuning; typically `temperature` alone is sufficient;
- `>= 0`.

### top_p `number` <font color="gray">Optional</font>

Nucleus sampling parameter.

- Accumulate tokens by descending probability until cumulative probability reaches `top_p`, then sample only within that set;
- Range: `0.0 ~ 1.0`;
- Usually tune either this or `temperature`; not recommended to significantly adjust both.

### Unsupported fields

| Field name   | Type   | Supported | Description                       |
| ------------ | ------ | --------- | --------------------------------- |
| metadata     | object | ❌ No     | Business metadata for the request |
| service_tier | string | ❌ No     | Service tier                      |

## Response

### Non-streaming: returns the “full message object”

When calling `POST /v1/messages` with **`stream: false` (or omitted)**, Anthropic returns a complete **Message object** in one response. Below is a hierarchical field breakdown.

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

Unique ID for this message.

#### type `"message"`

Object type. For the Messages API it is always `"message"`.

#### role `"assistant"`

The author role of the message generated by Claude; always `"assistant"`.

#### model `string`

The actual model name used to process the request (same as or equivalent to the requested `model`).

#### content `array<ContentBlock>`

Claude’s reply content array. Element types match the ContentBlock descriptions above (text / image / document / tool_use / tool_result / thinking / web_search_result, etc.).

> If the last message in the request has `role: "assistant"`, the reply `content` will continue directly from the previous message’s content, enabling prefix constraints.

Common returned block example (mostly text):

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

- `"end_turn"`: natural completion; a full turn is done;
- `"max_tokens"`: reached `max_tokens` or the model limit;
- `"stop_sequence"`: generated a sequence from custom `stop_sequences`;
- `"tool_use"`: the reply contains one or more `tool_use` blocks;
- `"pause_turn"`: for long-running server tool calls, the model pauses and waits for you to send back context to continue;
- `"refusal"`: the safety classifier intervened and the model refused the request.

> In non-streaming mode, `stop_reason` is always non-null; in streaming mode it is only non-null in some events.

#### stop_sequence `string | null`

If `stop_reason = "stop_sequence"`, this is the matched string; otherwise `null`.

#### usage `object`

Token and tool usage statistics for the request.

##### usage.cache_creation `object`

A breakdown of input tokens consumed by newly written Prompt Cache (cache breakpoints) within this request.

- **ephemeral_1h_input_tokens** `number`  
  Input tokens **counted toward cache writes** for newly created ephemeral cache breakpoints with a **1-hour** TTL.  
  Typically corresponds to content where you set `cache_control: { type: "ephemeral", ttl: "1h" }`.

- **ephemeral_5m_input_tokens** `number`  
  Input tokens **counted toward cache writes** for newly created ephemeral cache breakpoints with a **5-minute** TTL.  
  Typically corresponds to `ttl: "5m"`.

> Note: these fields only cover the “cache write” cost, not the read cost for later reuse.

##### cache_creation_input_tokens `number`

Total input tokens written for **all newly created cache breakpoints** (both 5 minutes and 1 hour) in this request.

- Equals `cache_creation.ephemeral_1h_input_tokens + cache_creation.ephemeral_5m_input_tokens`;
- These tokens are billed in this request and also stored in cache for future reuse.

##### cache_read_input_tokens `number`

Input tokens **read from existing Prompt Cache hits** in this request.

- These tokens are **not billed again as normal input** in this request (or are billed per caching policy),  
  and also **do not count against this request’s context length quota** (as determined by Anthropic’s internal implementation);
- Non-zero only when a cache hit occurs.

##### input_tokens `number`

Input tokens **actually used for reasoning** in this request.

##### output_tokens `number`

Output tokens **generated by Claude** in this request.

##### server_tool_use `object`

Usage statistics for server-side tools (server tools hosted by Anthropic) in this request.

- **web_search_requests** `number`
  The number of times a Web Search tool call was **actually triggered** in this request.

  - Each time Claude generates a `type: "server_tool_use"` with `name: "web_search"` and the backend successfully executes it, this counter increments by 1;
  - Useful for tracking “how many web searches were used to fetch up-to-date info in this answer”.

> If Web Search is not enabled or not triggered in this request, this value is `0`.

##### service_tier `"standard" | string`

The **service tier / capacity tier** actually used to process the request.

- Corresponds to the `service_tier` you set in the request (e.g., `"standard_only"`) and the system’s routing outcome;
- Example values:
  - `"standard"`: standard capacity tier;
  - Or other internal identifier strings used to distinguish channels or priorities.

### Streaming: returns “multiple SSE event objects”

When you set **`stream: true`** in the request, Anthropic continuously pushes a sequence of events via **SSE (Server‑Sent Events)**. Each event is a JSON object. The client should:

1. Read each SSE event in arrival order;
2. Determine the event type from `event: <type>`;
3. Incrementally assemble the full message using the JSON after `data:`.

Common event types:

- `message_start`
- `content_block_start`
- `content_block_delta`
- `content_block_stop`
- `message_delta`
- `message_stop`
- `error`

#### Top-level: basic SSE event structure

Each event line sent by the server looks like:

```text
event: content_block_delta
data: { ...JSON object... }
```

Below are the `data` object structures by event type.

::: details 1. `message_start` event

**Meaning**: starts a new assistant message and provides basic metadata.

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

Event type, fixed as:

- `"message_start"`

##### message `object`

The base structure of the Message about to stream. Fields match the top-level Message fields in the non-streaming response (but `content` is usually an empty array at this point, and `output_tokens` may be 0):

- id `string`: message ID
- type `string`: fixed `"message"`
- role `string`: fixed `"assistant"`
- model `string`: actual model name used
- content `array`: initially empty; later filled incrementally via `content_block_*` events
- stop_reason `string or null`: initially null; updated by `message_delta` at the end
- stop_sequence `string or null`: initially null; updated by `message_delta` at the end
- usage `object`: token usage known so far (`output_tokens` starts at 0; final value is provided in `message_delta`)

:::

::: details 2. `content_block_start` event

**Meaning**: starts a new content block (e.g., a text segment or a tool invocation).

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

Event type, fixed as:

- `"content_block_start"`

##### index `integer`

The index of this block within the `message.content` array (starting at 0).  
Subsequent `content_block_delta` / `content_block_stop` events with the same index correspond to the same block.

##### content_block `object`

Initial skeleton structure of the content block, same as `content[i]` in non-streaming responses, but usually an “empty shell”; the actual text/parameters are provided incrementally via delta events.

Typical examples:

1. Text block start:

   ```json
   {
     "type": "text",
     "text": ""
   }
   ```

2. Tool call block start:

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

**Meaning**: an “incremental update” to a content block, mainly appending text or progressively building tool input parameters.

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

Or for tool input parameters:

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

Event type, fixed as:

- `"content_block_delta"`

##### index `integer`

The content block index this delta applies to.  
It should match a previously received `content_block_start.index`.

##### delta `object`

**Incremental content object**. Its structure depends on the target block type.

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

New text fragment. The client should concatenate `text` from all `text_delta` events with the same `index` in order to form the full text.

##### Tool input delta: `type = "input_json_delta"`

When the assistant initiates a `tool_use`, the tool `input` may also be assembled across multiple deltas.

```json
{
  "type": "input_json_delta",
  "partial_json": "\"Francisco\", \"unit\": \"celsius\"}"
}
```

##### type `string`

- `"input_json_delta"`

##### partial_json `string`

A JSON fragment (string) that must be concatenated with previous/following fragments to form the complete `input` object.  
Do not call your tool using this parameter until all deltas are received and the JSON is fully parsed.

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

Event type, fixed as:

- `"content_block_stop"`

##### index `integer`

The content block index. Indicates that no further deltas will be sent for this block.

:::

::: details 5. `message_delta` event

**Meaning**: final incremental updates to Message metadata, such as `stop_reason`, `usage`, etc.

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

Event type, fixed as:

- `"message_delta"`

##### delta `object`

Incremental updates to top-level fields of `message`. Common fields:

###### stop_reason `string or null`

Same as `stop_reason` in non-streaming responses, but only provided via delta when finalized:

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
  Final total output token count (usually provided in the last `message_delta`).

:::

::: details 6. `message_stop` event

**Meaning**: indicates that the full streaming message has finished; no more events will follow.

```json
{
  "type": "message_stop"
}
```

##### type `string`

Event type, fixed as:

- `"message_stop"`

This event contains no other fields. After receiving it, the client can assume:

- all `content_block_*` events have finished;
- all `message_delta` updates have finished;
- the data can be assembled into the final Message object for use.

:::

::: details 7. `error` event (on exceptions)

If an error occurs during the request or generation, an `error` event may be received and the stream will terminate afterward.

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

Event type, fixed as:

- `"error"`

##### error `object`

Error details.

- type `string`  
  Error type, e.g.:
  - `"invalid_request_error"`
  - `"authentication_error"`
  - `"rate_limit_error"`
  - `"api_error"`
- message `string`  
  Human-readable error message for logging and debugging.

:::

::: api-request POST /api/anthropic

```TypeScript
import Anthropic from '@anthropic-ai/sdk';

// 1. Initialize the anthropic client
const anthropic = new Anthropic({
  // 2. Replace with the API Key from the ZenMux user console
  apiKey: '<your ZENMUX_API_KEY>', // [!code highlight]
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

## 1. Initialize the anthropic client
client = anthropic.Anthropic(
    # Replace with the API Key from the ZenMux user console
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
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
curl https://zenmux.ai/api/anthropic/v1/messages \
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
