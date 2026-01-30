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

ZenMux 支持 Anthropic API, 使用方式见 API 调用示例。

> 本文基于官方文档「Create a Message」编写，参数说明与嵌套结构与官网保持一致。

## Request headers

### x-api-key `string` <font color="red">必填</font>

Anthropic API Key，用于鉴权。

示例：

```http
x-api-key: sk-ant-xxxx
```

### anthropic-version `string` <font color="red">必填</font>

Anthropic API 版本号（不是模型版本）。

目前只支持"2023-06-01"

```http
anthropic-version: 2023-06-01
```

### content-type `string` <font color="red">必填</font>

请求体格式，当前仅支持 JSON：

```http
content-type: application/json
```

### anthropic-beta `string` <font color="gray">可选</font>

启用一个或多个 Beta 功能时使用，目前不支持"code-execution-2025-08-25", 即无法使用 code_execution 工具

- 多个 beta 版本可以：
  - 用逗号分隔：`anthropic-beta: files-api-2025-04-14,another-beta`
  - 或重复 header 多次。

## Request Body

请求体为 JSON，对应参数如下

### max_tokens `number` <font color="red">必选</font>

生成内容的 **最大 token 数**，包括普通回答和（若启用）extended thinking 的思考内容。

- 含义：模型最多生成这么多 token，**可能提前自然结束**，但不会超出。
- 每个模型支持的 `max_tokens` 上限不同，详见各模型文档。
- 取值：`>= 1`

### messages `array<Message>` <font color="red">必选</font>

对话历史与本轮用户输入。

- 模型训练时假设 `user` / `assistant` 轮流出现。你在 `messages` 中提供过去的轮次，模型将生成下一条 `assistant` 消息。
- 支持多轮对话；连续多个同角色消息会在内部合并。
- 如果 `messages` 最后一条是 `assistant`，本次回复会**直接接在其 `content` 后继续生成**，可用于「前缀约束」答案。
- 单次请求最多 `100000` 条 message。

数组元素统一结构：

```ts
Message = {
  role: "user" | "assistant",
  content: string | ContentBlock[]
}
```

#### role: `"user" | "assistant"`<font color="red">必选</font>

#### content `string | ContentBlock[]`<font color="red">必选</font>

- 直接写字符串，相当于只有一个 `type: "text"` 的文本块：
  - `{"role":"user","content":"Hello, Claude"}` 等价于  
    `{"role":"user","content":[{"type":"text","text":"Hello, Claude"}]}`
- 使用数组可以混合文本、图片、PDF 文档、工具调用结果等多种内容块。

  常见内容块类型（部分类型仅在特定场景可用）：

::: details TextBlockParam

```ts
{
  type: "text",
  text: string,
  cache_control?: CacheControlEphemeral,
  citations?: TextCitationParam[]
}
```

- text `string` <font color="red">必选</font>  
  文本内容。
- type `string` <font color="red">必选</font>  
  固定为 `"text"`。
- cache_control `CacheControlEphemeral` <font color="gray">可选</font>  
   在该块上创建 **Prompt Cache 断点**（用于 Anthropic 的上下文缓存计费 / 复用）：

  ```ts
  CacheControlEphemeral = {
    type: "ephemeral",
    ttl: "5m" | "1h",
  };
  ```

  - ttl：缓存生存时间，`"5m"` / `"1h"`，默认 5 分钟。

- citations `TextCitationParam[]` <font color="gray">可选</font>  
  用于**标注文本引用来源**（典型场景：把 PDF / 文本文档 / 内容文档作为 document 块输入后，标注「这一段回答来自哪一页 / 哪一段 / 哪个搜索结果」）。  
  `TextCitationParam` 是以下几种之一（取决于被引用内容的类型）：
  - **char_location：按字符区间引用纯文本或内容文档**

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

    字段说明：
    - `type` `string` <font color="red">必选</font>  
      固定为 `"char_location"`，表示该引用是通过**字符位置区间**来定位的。

    - `cited_text` `string` <font color="red">必选</font>  
      被引用的原文文本片段（人读用的展示内容）。  
      一般是 `start_char_index` ~ `end_char_index` 之间的文本截取。

    - `document_index` `number` <font color="red">必选</font>  
      当前请求中被引用文档的索引，**从 0 开始计数**。  
      如果你在本次请求里传了多个 `document` 块（或其它可被引用文档），这里用于指明是第几个。

    - `document_title` `string` <font color="red">必选</font>  
      文档标题或名称，通常来自文件名或你在上游提供的标题，用于在 UI 中展示「来自：xxx 文档」。

    - `start_char_index` `number` <font color="red">必选</font>  
      在该文档的**完整文本**中，被引用片段的起始字符索引，**0 基，包含该位置**。

    - `end_char_index` `number` <font color="red">必选</font>  
      在该文档完整文本中的结束字符索引，**0 基，通常为开区间端点**，即引用区间为 `[start_char_index, end_char_index)`。

  - **page_location：按页号引用 PDF**

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

    字段说明：
    - `type` `string` <font color="red">必选</font>  
      固定为 `"page_location"`，表示引用位置以**页号区间**来描述。

    - `cited_text` `string` <font color="red">必选</font>  
      被引用的 PDF 文本片段（已由系统从 PDF 中解析出来的可读文本）。

    - `document_index` `number` <font color="red">必选</font>  
      被引用的 PDF 文档在当前请求中的索引，**0 基**。

    - `document_title` `string` <font color="red">必选</font>  
      PDF 文档标题或文件名，用于展示。

    - `start_page_number` `number` <font color="red">必选</font>  
      引用内容所在的**起始页号**，**1 基，包含该页**。  
      例如 `5` 表示「从第 5 页开始」。

    - `end_page_number` `number` <font color="red">必选</font>  
      引用内容所在的**结束页号**，通常视为半开区间的右端点：
      - 若 `start_page_number = 5` 且 `end_page_number = 6`，可理解为「引用范围为第 5 页」。
      - 若两者相差大于 1，则表示「跨多页引用」。

  - **content_block_location：按内容块序号引用内容文档**

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

    用于引用以「多内容块形式」提供的文档（例如一个 `document` 的 `source.type = "content"`，内部包含多个 `text`/`image` 等块）。

    字段说明：
    - `type` `string` <font color="red">必选</font>  
      固定为 `"content_block_location"`。

    - `cited_text` `string` <font color="red">必选</font>  
      被引用的原文文本片段（来自对应内容块的文本）。

    - `document_index` `number` <font color="red">必选</font>  
      当前请求中被引用文档的索引，**0 基**。

    - `document_title` `string` <font color="red">必选</font>  
      文档标题或名称。

    - `start_block_index` `number` <font color="red">必选</font>  
      在该文档内部 `content` 数组中的**起始块索引**，0 基。  
      表示「从第几个内容块开始被引用」。

    - `end_block_index` `number` <font color="red">必选</font>  
      在 `content` 数组中的**结束块索引**。  
      实际使用中通常可理解为区间的另一端：
      - 若 `start_block_index === end_block_index`，通常表示仅引用该索引对应的一个内容块。
      - 若不同，则表示跨多个内容块的引用范围。

  - **web_search_result_location：引用 Web 搜索结果**

    ```ts
    {
      type: "web_search_result_location",
      cited_text: string,
      url: string,
      title: string,
      encrypted_index: string
    }
    ```

    当启用了 Anthropic 的 Web Search 工具（server tool），Claude 从某个网页引用内容时使用。

    字段说明：
    - `type` `string` <font color="red">必选</font>  
      固定为 `"web_search_result_location"`，表示本引用来自 Web 搜索结果。

    - `cited_text` `string` <font color="red">必选</font>  
      被引用网页内容的文本片段（通常截断为一小段方便展示），不计入 token 消耗。

    - `url` `string` <font color="red">必选</font>  
      被引用网页的 URL，前端可直接渲染为可点击链接。

    - `title` `string` <font color="red">必选</font>  
      被引用网页的标题（例如 HTML `<title>`），用于 UI 展示「来源：xxx」。

    - `encrypted_index` `string` <font color="red">必选</font>  
      针对该搜索结果的**加密索引标识**，只能原样传回给 Anthropic，用于后续多轮对话中继续引用或检查同一结果。  
      一般不需向终端用户展示，但在你实现多轮对话 / 调试时需要完整保留。

  - **search_result_location：引用自定义检索结果（SearchResultBlock）**

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

    当你通过 `type: "search_result"` 的内容块向 Claude 提供**自有搜索 / RAG 结果**并开启 citations 时，Claude 在回答中引用这些结果会使用该类型。

    字段说明：
    - `type` `string` <font color="red">必选</font>  
      固定为 `"search_result_location"`，表示该引用来自你提供的 SearchResultBlock。

    - `cited_text` `string` <font color="red">必选</font>  
      被引用的精确文本片段，来源于某个 `search_result` 内容块中的文本。

    - `source` `string | null` <font color="red">必选</font>  
      搜索结果来源标识：
      - 通常是一个 URL（例如知识库文档地址）；
      - 也可以是你自定义的字符串 ID；
      - 若你在原始 `search_result` 中未提供，则可能为 `null`。

    - `title` `string | null` <font color="red">必选</font>  
      搜索结果标题，对应输入的 `search_result.title`；  
      若没有标题可用，则为 `null`。

    - `search_result_index` `number` <font color="red">必选</font>  
      在当前 `message.content` 中，**第几个 `type: "search_result"` 块**被引用，0 基索引。  
      无论这些搜索结果是你主动放在 user 消息里，还是通过某个工具返回，都会按出现顺序进行编号。

    - `start_block_index` `number` <font color="red">必选</font>  
      在该 `search_result` 的 `content` 数组中，被引用内容所在的**起始块索引**，0 基。

    - `end_block_index` `number` <font color="red">必选</font>  
      在该 `content` 数组中的**结束块索引**。
      - 若等于 `start_block_index`，通常表示引用的是该索引对应的单个内容块；
      - 否则表示跨多个内容块的引用范围。

:::

::: details ImageBlockParam

```ts
{
  type: "image",
  source: Base64ImageSource | URLImageSource,
  cache_control?: CacheControlEphemeral
}
```

- type `string` <font color="red">必选</font>  
  固定为 `"image"`。
- source `Base64ImageSource | URLImageSource` <font color="red">必选</font> ：
  - Base64ImageSource
    ```ts
    {
      type: "base64",
      media_type: "image/jpeg" | "image/png" | "image/gif" | "image/webp",
      data: string // base64 编码
    }
    ```
  - URLImageSource
    ```ts
    {
      type: "url",
      url: string
    }
    ```
- cache_control `CacheControlEphemeral` <font color="gray">可选</font>：同上，可为图片建立缓存断点。

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

- type `string` <font color="red">必选</font>  
  固定为 `"document"`。
- source `Base64PDFSource | PlainTextSource | ContentBlockSource | URLPDFSource` <font color="red">必选</font> ：
  - Base64PDFSource：base64 PDF

  ```ts
  {
    type: "base64",
    media_type: "application/pdf",
    data: string
  }
  ```

  - PlainTextSource：整段纯文本作为文档
    ```ts
    {
      type: "text",
      media_type: "text/plain",
      data: string
    }
    ```
  - ContentBlockSource：以一组 `ContentBlock` 作为文档内容（可多模态）
    ```ts
    {
      type: "content",
      content: string | ContentBlockSourceContent[]
    }
    ```
  - URLPDFSource：引用远程 PDF
    ```ts
    {
      type: "url",
      url: string
    }
    ```

- cache_control `CacheControlEphemeral` <font color="gray">可选</font>：同上，可为文档建立缓存断点。
- citations `TextCitationParam[]` <font color="gray">可选</font>：同上，用于**标注文本引用来源**（典型场景：把 PDF / 文本文档 / 内容文档作为 document 块输入后，标注「这一段回答来自哪一页 / 哪一段 / 哪个搜索结果」）。
- context `string` <font color="gray">可选</font>：文档上下文。
- title `string` <font color="gray">可选</font>：文档标题。

:::

::: details ToolResultBlockParam

```ts
{
  type: "tool_result",
  tool_use_id: string,          // 与之前 tool_use 块中的 id 对应
  content?: string | (TextBlockParam | ImageBlockParam | SearchResultBlockParam | DocumentBlockParam)[]
  cache_control?: CacheControlEphemeral,
  is_error?: boolean
}
```

- type `string` <font color="red">必选</font>  
  固定为 `"tool_result"`。
- tool_use_id `string` <font color="red">必填</font>，绑定哪次工具调用。
- is_error `boolean` <font color="gray">可选</font>。
- content：可为简单字符串，或多模态块数组（文本 / 图片 / 文档 / 搜索结果）<font color="gray">可选</font>。
- cache_control `CacheControlEphemeral` <font color="gray">可选</font>：同上。

:::

::: details ToolUseBlockParam

```ts
{
  type: "tool_use",
  id: string,                     // 唯一工具调用 ID
  name: string,                   // 对应 tools 中定义的工具名
  input: Record<string, unknown>, // JSON，满足该工具的 input_schema
  cache_control?: CacheControlEphemeral
}
```

字段说明：

- type `string` <font color="red">必选</font>  
  固定为 `"tool_use"`。

- id `string` <font color="red">必选</font>  
  本次工具调用的唯一标识，用来和后续的 `tool_result` 对应。

- name `string` <font color="red">必选</font>  
  要调用的工具名称，**必须与请求中 `tools` 数组里声明的某个 `tool.name` 完全一致**。

- input `object` (Record<string, unknown>) <font color="red">必选</font>

- cache_control `CacheControlEphemeral` <font color="gray">可选</font>：同上，
  为该工具调用块设置缓存行为（Prompt Cache 断点）

:::

::: details ServerToolUseBlockParam

表示 Claude 决定调用某个**服务器端工具**（由 Anthropic 托管，不是你自己实现的 client tool），例如：

```ts
{
  type: "server_tool_use",
  id: string,
  name: string,
  input: Record<string, unknown>,
  cache_control?: CacheControlEphemeral
}
```

字段说明：

- type `string` <font color="red">必选</font>  
  固定为 `"server_tool_use"`，表示这是一次服务器端工具调用请求。

- id `string` <font color="red">必选</font>  
  本次服务器端工具调用的唯一标识 ID，形如 `"srvtoolu_..."`。  
  后续对应的结果块（例如 `web_search_tool_result`）会通过 `tool_use_id` 指向这个 ID。

- name `string` <font color="red">必选</font>  
  要调用的服务器端工具名称，例如：
  - `"web_search"`：Web 搜索工具

- input `object` <font color="gray">可选</font>  
  传给该服务器端工具的参数对象，结构由具体工具定义。

:::

::: details WebSearchToolResultBlockParam

当使用 Web Search 工具时，Claude 会在同一条 `assistant` 消息中返回一个或多个 `web_search_tool_result` 内容块，表示「这次 web_search 的搜索结果或错误」。

```ts
{
  type: "web_search_tool_result",
  tool_use_id: string,
  content: `array | object`,
  cache_control?: CacheControlEphemeral
}
```

字段说明：

- type `string` <font color="red">必选</font>  
  固定为 `"web_search_tool_result"`，表示这是 Web Search 工具的一次结果。

- tool_use_id `string` <font color="red">必选</font>  
  指向前面对应的 `server_tool_use.id`，用于把「搜索请求」和「搜索结果」对应起来。

- cache_control `CacheControlEphemeral` <font color="gray">可选</font>：同上。

- content `array | object` <font color="red">必选</font>  
  Web Search 的执行结果内容：
  - 成功时：为 **`web_search_result` 对象数组**；
  - 失败时：为一个 `web_search_tool_result_error` 对象（见后文错误结构）。

###### `web_search_result` 对象（成功时）

当 `content` 是数组时，数组中每个元素为一个 `web_search_result` 对象：

字段说明：

- type `string` <font color="red">必选</font>  
  固定为 `"web_search_result"`。

- url `string` <font color="red">必选</font>  
  该搜索结果网页的 URL，通常会与 `citations` 里的 `url` 一致。

- title `string` <font color="red">必选</font>  
  网页标题，用于前端展示引用来源。

- encrypted_content `string` <font color="red">必选</font>  
  对页面正文内容进行加密后的字符串。  
  在**多轮对话**中，如果希望 Claude 继续准确引用这条结果，需要原样把此字段随对话一起传回（例如通过后续的 `web_search_result_location` 引用）。该字段本身对你是**不透明、不可解析**的。

- page_age `string` <font color="gray">可选</font>  
  表示站点最后更新或抓取的大致时间，如 `"April 30, 2025"`，主要用于用户展示「数据时效性」。

###### 错误结果结构：`web_search_tool_result_error`

如果 Web Search 工具本身报错（例如超过最大调用次数、请求非法等），`web_search_tool_result` 的 `content` 字段会是一个错误对象：

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

错误对象字段：

- type `string` <font color="red">必选</font>  
  固定为 `"web_search_tool_result_error"`。

- error_code `string` <font color="red">必选</font>  
  错误类型编码，常见值包括：
  - `"too_many_requests"`：搜索工具触发速率限制；
  - `"invalid_input"`：搜索参数非法（如域名过滤不合法等）；
  - `"max_uses_exceeded"`：超过该轮请求配置的 `max_uses` 上限；
  - `"query_too_long"`：生成的搜索 query 过长；
  - `"unavailable"`：搜索服务内部错误或暂不可用。

> 即使发生错误，HTTP 状态码依然是 200，错误仅体现在 `web_search_tool_result` 的 `content` 中，你需要根据 `error_code` 决定如何降级处理或提示用户。

:::

::: details ThinkingBlockParam

```ts
{
  type: "thinking",
  thinking: string,
  signature: string,
}
```

字段说明：

- type `string` <font color="red">必选</font>  
  固定为 `"thinking"`，表示这是一个 Extended Thinking 推理块。

- thinking `string` <font color="red">必选</font>  
  Claude 生成的**可读推理内容**，通常是多行分步骤分析。

- signature `string` <font color="red">必选</font>  
  对完整 thinking 内容做的加密签名字符串，用于在后续多轮对话中验证这些推理块**确实由 Claude 生成且未被篡改**。
  - 这是一个**不透明字段**，你不需要也不应该解析其内容；
  - 当你把带 thinking 的上一轮 `assistant` 消息传回给 API 时，应该**原样带上完整的 `thinking` + `signature`**。

> 在流式模式下：
>
> - `thinking` 文本通过 `content_block_delta` 事件中的 `thinking_delta` 增量输出；
> - `signature` 在该块结束前通过一次 `signature_delta` 事件追加。你需要将所有 `thinking_delta.thinking` 拼接后，再结合最终的 `signature`，视为一个完整的 thinking 块。\

:::

::: details SearchResultBlockParam

用于把你自己的搜索 / RAG 结果作为结构化内容输入给 Claude，便于模型在回答时引用并自动生成 `search_result_location` 类型的 citations。

典型场景：你在后端先对向量库 / 文档库做检索，然后把检索结果按 `search_result` 块的形式放进 `messages[*].content`。

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

字段说明：

- type `string` <font color="red">必选</font>  
  固定为 `"search_result"`，表示这是一个搜索/检索结果内容块。

- source `string` <font color="gray">可选</font>  
  搜索结果的来源标识：
  - 通常是一个 URL（例如知识库文档地址、内部文档查看链接）；
  - 也可以是你自定义的字符串 ID（如文档主键 ID）；
  - 若不方便提供，则可以省略或设为 `null`。  
    Claude 在生成 `search_result_location` citations 时，会把这个字段原样带回，便于你在前端展示「来自：xxx」。

- title `string` <font color="gray">可选</font>  
  搜索结果的标题：
  - 如「API 参考：身份验证」「员工手册 · 请假规则」；
  - 若没有合适标题可用，可以为 `null`。  
    在 citations 中会直接用作引用标题，方便 UI 呈现。

- content `array` <font color="red">必选</font>  
  搜索结果的**实际内容片段列表**，由一个或多个内容块组成，一般是文本块为主，也可以包含图片 / 文档等：

- cache_control `CacheControlEphemeral` <font color="gray">可选</font>：同上。

- citations `object` <font color="gray">可选</font>

  是否开启基于该搜索结果的自动引用标注，一般写法如下：

  ```ts
  citations: {
    enabled: boolean;
  }
  ```

  - enabled `boolean` <font color="red">必选</font>
    - `true`：允许 Claude 在回答中为此 `search_result` 生成 `search_result_location` 类型的 citations；
    - `false`：不对该块内容生成 citations（但模型仍可阅读和使用）。

:::

::: details RedactedThinkingBlockParam

`RedactedThinkingBlockParam` 对应 `type: "redacted_thinking"` 的内容块，是 Extended Thinking 体系的一部分。与普通 `thinking` 块不同，**其中的思考内容是经过加密/脱敏的，不直接以明文呈现**，主要用于保证安全 / 合规，同时让模型在多轮对话中能继续引用自己之前的推理。

你通常只会在模型输出中看到它，并在后续请求中**原样传回**，很少需要自己构造。

```ts
{
  type: "redacted_thinking",
  data: string
}
```

字段说明：

- type `string` <font color="red">必选</font>  
  固定为 `"redacted_thinking"`，表示这是一个**脱敏后的思考块**。
  - 与 `type: "thinking"` 的区别在于：
    - `thinking`：返回的是可读的自然语言推理文本 + 签名；
    - `redacted_thinking`：返回的是**无法直接解读的加密数据**，不包含可读推理内容。

- data `string` <font color="red">必选</font>  
  加密/脱敏后的思考数据字符串，通常是一长串看不出含义的 Base64/密文片段。
  - 你不需要也不能解析这段数据；
  - 关键点是：如果你希望在后续轮次中延续这段思考上下文，应当在新的请求中把整个 `redacted_thinking` 块原样当作过往 `assistant` 的一部分传回去。

:::

### model `string` <font color="red">必选</font>

本次调用使用的模型 ID。

- 是 ZenMux 定义的模型名，例如：
  - `"anthropic/claude-sonnet-4.5"`

> 注意：这与 Anthropic API 风格的 `<model>` 字符串不同。

<!-- ### metadata `object` <font color="gray">可选</font>

请求的业务元信息。

当前官方结构：

```ts
metadata?: {
  user_id?: string
}
```

- user_id `string` <font color="red"></font>
  外部用户的**匿名标识**（uuid / hash / 内部 ID），Anthropic 可能用来做滥用检测。
  不要放真实姓名、邮箱、电话等个人敏感信息。最长 256 字符。 -->

<!-- ### service_tier `"auto" | "standard_only"` <font color="gray">可选</font><font color="red">不支持</font>

控制服务等级与容量路由。

- `"auto"`（默认）：由系统在可用容量中自动选择，必要时可使用优先容量。
- `"standard_only"`：只使用标准容量，不占用优先通道。 -->

### stop_sequences `string[]` <font color="gray">可选</font>

自定义**停止序列**。

- 当模型生成的文本中出现任意一个 stop 序列：
  - 生成立即停止；
  - 响应中的 `stop_reason = "stop_sequence"`；
  - 响应字段 `stop_sequence` 为命中的那个字符串。
- 如果不设置，则模型在自然结束时以 `end_turn` 停止。

常见用法：

- 约定 `"END"` 作为回答结束标记；
- 与「多段输出」协议搭配使用。

### stream `boolean` <font color="gray">可选</font>

是否以 SSE（Server-Sent Events）形式**流式返回**。

- `false`（默认）：一次性返回完整 `message` 对象。
- `true`：以多条事件流形式增量输出（见后文“流式响应”）。

### system `string | TextBlockParam[]` <font color="gray">可选</font>

为本次对话设置**全局指令与角色**的 System Prompt。相当于给 Claude 的「总规则」，会在所有 `messages` 之前生效。

#### 类型形式

- 可以直接用**字符串**（最常见）：

  ```json
  "system": "You are a helpful assistant."
  ```

- 也可以用 **TextBlockParam 数组**，结构同 message：

  ```json
  "system": [
    {
      "type": "text",
      "text": "You are a helpful assistant that answers in Chinese.",
      "cache_control": { "type": "ephemeral", "ttl": "1h" }
    },
    {
      "type": "text",
      "text": "当前日期是 2025-01-15。"
    }
  ]
  ```

> 注意：Messages API **没有 `role: "system"` 的 message**，所有系统级指令统一通过顶层 `system` 字段传入。

### temperature `number` <font color="gray">可选</font>

采样温度，控制输出随机性。

- 默认：`1.0`
- 范围：`0.0 ~ 1.0`
  - 越接近 0：更确定、更「考试型」；适合选择题、严谨推理。
  - 越接近 1：更发散、更有创造性；适合头脑风暴、创意写作。
- 即便是 `0.0` 也不绝对完全确定。

### thinking `object` <font color="gray">可选</font>

Extended Thinking（显式推理过程）配置。

```ts
thinking?:
  | { type: "enabled";  budget_tokens: number }
  | { type: "disabled" }
```

- `type: "enabled"`：
- budget_tokens `number`：
  - 为内部推理过程分配的 token 预算；
  - 必须 `>= 1024` 且 `< max_tokens`；
  - 预算越大，复杂问题上的推理质量通常越高，但也更耗时 / 更贵。
  - 回包中会出现 `type: "thinking"` 的内容块。
- `type: "disabled"`：关闭 extended thinking（默认行为）。

### tool_choice `object` <font color="gray">可选</font>

控制 Claude 如何使用你在 `tools` 中声明的工具。

```ts
tool_choice?:
  | { type: "auto";  disable_parallel_tool_use?: boolean }
  | { type: "any";   disable_parallel_tool_use?: boolean }
  | { type: "tool";  name: string; disable_parallel_tool_use?: boolean }
  | { type: "none" }
```

- `"auto"`（推荐默认）
  - Claude **自行决定**是否调用工具，以及调用哪些工具；
  - `disable_parallel_tool_use?: boolean`：
    - `false`（默认）：允许一次回复中产生多个并行 `tool_use`；
    - `true`：最多只调用 1 个工具。
- `"any"`
  - 表示「可以使用任意工具」；与 `"auto"` 类似，但通常更强地鼓励使用工具；
  - `disable_parallel_tool_use` 含义同上。
- `"tool"`
  - 强制使用指定工具：
    ```ts
    { type: "tool", name: "get_weather" }
    ```
  - `disable_parallel_tool_use` 为 `true` 时，仅这一个工具被调用一次。
- `"none"`
  - 禁止使用工具，仅生成纯文字/多模态回答。

### tools `array<ToolUnion>` <font color="gray">可选</font>

声明本次请求中 Claude 可以使用的**工具列表**。

官方将工具分为：

- **Client tools**：由你在应用中实现（类似 “function calling”）
- **Server tools**：由 Anthropic 托管，如 Web Search、Bash、Text Editor 等

#### 1. 自定义（Client）工具 Tool

最基础的 JSON Schema 工具定义形式：

```ts
{
  type?: "custom",              // 可省略
  name: string,                 // 工具名称（<= 128 字符）
  description?: string,         // 强烈推荐，越详细越好
  input_schema: {
    type: "object",
    properties?: { [key: string]: any },
    required?: string[]
  },
  cache_control?: CacheControlEphemeral
}
```

- name：Claude 在 `tool_use` 块中会用此名称调用你；
- description：用自然语言清楚说明工具用途、参数含义、使用限制，有助于模型正确决定是否调用及如何填参；
- input_schema：工具 `input` 的 JSON Schema 定义；
- cache_control：可针对 tool 定义缓存断点。

Claude 生成的 `tool_use` 块示例：

```json
{
  "type": "tool_use",
  "id": "toolu_01D7FLrfh4G...",
  "name": "get_stock_price",
  "input": { "ticker": "^GSPC" }
}
```

你执行完工具后，再把结果以 `tool_result` 块放入下一条 user 消息返回。

#### 2. 内置 Server Tools（节选）

Messages API 文档列出了若干内置工具类型，典型包括：

- Bash 工具：`type: "bash_20250124"`，`name: "bash"`
- 文本编辑器：`type: "text_editor_2025xxxx"`，`name: "str_replace_editor"` / `"str_replace_based_edit_tool"` 等
  - 某些版本带 `max_characters` 字段，控制返回显示的字符数上限。
- Web Search 工具：  
  `type: "web_search_20250305"`, `name: "web_search"`

  其中可配置：

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
      timezone?: string // IANA 时区 ID
    },
    cache_control?: CacheControlEphemeral
  }
  ```

> 各内置工具的详细语义、调用模式与计费细节，建议查看 Anthropic 对应的[「Server tools」](https://platform.claude.com/docs/en/api/messages/create)单独文档。

### top_k `number` <font color="gray">可选</font>

采样时仅从概率最高的前 K 个 token 中选择。

- 用于裁剪「长尾」低概率 token；
- 推荐仅在高级调参场景使用，一般只需要 `temperature` 即可；
- `>= 0`。

### top_p `number` <font color="gray">可选</font>

Nucleus Sampling（核采样）参数。

- 按概率降序累积，直到累计概率达到 `top_p` 为止，仅在该集合中采样；
- 范围：`0.0 ~ 1.0`；
- 通常与 `temperature` 二选一调节，不建议同时大幅调整。

### 不支持字段

| 字段名       | 类型   | 是否支持  | 说明             |
| ------------ | ------ | --------- | ---------------- |
| metadata     | object | ❌ 不支持 | 请求的业务元信息 |
| service_tier | string | ❌ 不支持 | 服务等级         |

## Response

### 非流式：返回「完整的 message 对象」

当 **`stream: false`（或未传）** 调用 `POST /v1/messages` 时，Anthropic 会一次性返回一个完整的 **Message 对象**。下面按层级逐项说明字段结构。

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

本次消息的唯一 ID。

#### type `"message"`

对象类型，Messages API 固定为 `"message"`。

#### role `"assistant"`

Claude 生成的消息作者角色，永远是 `"assistant"`。

#### model `string`

实际处理本次请求的模型名称（与请求中的 `model` 一致或等价）。

#### content `array<ContentBlock>`

Claude 的回复内容数组，元素类型与前文 ContentBlock 描述一致（text / image / document / tool_use / tool_result / thinking / web_search_result 等）。

> 若你在请求中最后一条 message 的 `role` 为 `"assistant"`，则本次回复的 `content` 会直接接续前一条中的内容，实现前缀约束。

常见返回块示例（文本为主）：

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

模型停止生成的原因。

可能值：

- `"end_turn"`：自然结束，一轮回答完成；
- `"max_tokens"`：达到 `max_tokens` 或模型上限；
- `"stop_sequence"`：生成了自定义 `stop_sequences` 中的某个序列；
- `"tool_use"`：回复中包含（一个或多个）`tool_use` 内容块；
- `"pause_turn"`：针对长时间运行的服务器工具调用，模型暂停，等待你继续传回上下文以接着生成；
- `"refusal"`：安全分类器介入，模型拒绝执行请求。

> 非流式模式下 `stop_reason` 一定非空；流式模式下仅在某些事件中非空。

#### stop_sequence `string | null`

若 `stop_reason = "stop_sequence"`，此字段为命中的字符串，否则为 `null`。

#### usage `object`

本次请求的 token 与工具使用统计信息。

##### usage.cache_creation `object`

本次请求中新写入 Prompt Cache（缓存断点）所消耗的输入 token 细分统计。

- **ephemeral_1h_input_tokens** `number`  
  本次请求中新创建的、TTL 为 **1 小时** 的 ephemeral 缓存断点中，  
  **计入缓存写入的输入 token 数**。  
  通常对应你在 `cache_control: { type: "ephemeral", ttl: "1h" }` 上打断点的部分。

- **ephemeral_5m_input_tokens** `number`  
  本次请求中新创建的、TTL 为 **5 分钟** 的 ephemeral 缓存断点中，  
  **计入缓存写入的输入 token 数**。  
  通常对应 `ttl: "5m"` 的缓存断点。

> 注：这两个字段只统计「写入缓存」的开销，不包含后续复用时的读取消耗。

##### cache_creation_input_tokens `number`

本次请求中，**所有新建缓存断点**（无论 5 分钟还是 1 小时）合计写入的输入 token 数。

- 等于 `cache_creation.ephemeral_1h_input_tokens + cache_creation.ephemeral_5m_input_tokens`；
- 这些 token 既计入本次请求的计费，也会写入缓存，供未来请求复用。

##### cache_read_input_tokens `number`

本次请求中，**从已有 Prompt Cache 中命中并读取的输入 token 数**。

- 这些 token 在本次请求中**不再按正常输入重复计费**（或按缓存计费策略计价），  
  同时也**不占用本次请求的上下文长度配额**（由 Anthropic 内部实现决定）；
- 仅在之前已经有缓存命中时为非零。

##### input_tokens `number`

本次请求中，**实际计入本轮推理的输入 token 数**。

##### output_tokens `number`

本次请求中，Claude **生成的输出 token 数**。

##### server_tool_use `object`

本次请求中，服务器端工具（由 Anthropic 托管的 server tools）使用统计信息。

- **web_search_requests** `number`
  本次请求中，**实际触发 Web Search 工具调用的次数**。
  - 每当 Claude 生成一个 `type: "server_tool_use"` 且 `name: "web_search"` 的调用，并由后端成功执行，  
    就会在这里计数一次；
  - 可用于统计「本次回答为获取实时信息，调用了几次 Web 搜索」。

> 如果本次请求未启用或未触发 Web Search，该值为 `0`。

##### service_tier `"standard" | string`

实际用于处理本次请求的**服务等级 / 容量层级**。

- 对应你在请求中设置的 `service_tier`（如 `"standard_only"`）以及系统的自动路由结果；
- 常见值示例：
  - `"standard"`：标准容量层级；
  - 也可能为其他内部标识字符串，用于区分不同的服务通道或优先级。

### 流式：返回「多次 SSE event 对象」

当你在请求中设置 **`stream: true`** 时，Anthropic 使用 **SSE（Server‑Sent Events）** 持续推送一系列事件，每条事件都是一个 JSON 对象。客户端需要：

1. 按到达顺序读取每个 SSE 事件；
2. 根据 `event: <type>` 判断事件类型；
3. 使用 `data:` 后的 JSON 数据逐步拼接出完整消息。

常见事件类型：

- `message_start`
- `content_block_start`
- `content_block_delta`
- `content_block_stop`
- `message_delta`
- `message_stop`
- `error`

#### 顶层：SSE 事件基本结构

服务端发送的每一行事件类似：

```text
event: content_block_delta
data: { ...JSON 对象... }
```

下面按事件类型逐个说明其 `data` 对象结构。

::: details 1. `message_start` 事件

**含义**：开始一条新的 assistant 消息，会给出消息的基本元数据。

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

事件类型，固定为：

- `"message_start"`

##### message `object`

即将开始流式返回的 Message 基本结构。字段与非流式 Message 顶层基本一致（但此时 `content` 通常为空数组，`output_tokens` 可能为 0）：

- id `string`：消息 ID
- type `string`：固定 `"message"`
- role `string`：固定 `"assistant"`
- model `string`：实际使用的模型名
- content `array`：初始为空；后续由 `content_block_*` 事件增量填充
- stop_reason `string or null`：初始为 null；最终由 `message_delta` 更新
- stop_sequence `string or null`：初始为 null；最终由 `message_delta` 更新
- usage `object`：当前已知的 token 用量（`output_tokens` 起初为 0，最终值在 `message_delta` 中给出）

:::

::: details 2. `content_block_start` 事件

**含义**：开始一个新的内容块（例如一段文本，或一次工具调用）。

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

事件类型，固定为：

- `"content_block_start"`

##### index `integer`

该内容块在整个 `message.content` 数组中的索引（从 0 开始）。  
同一 index 的后续 `content_block_delta` / `content_block_stop` 事件对应同一个块。

##### content_block `object`

内容块的初始结构，与非流式响应中的 `content[i]` 相同，但内容往往是“空壳”，真正的文本或参数通过后续 delta 事件增量补充。

典型示例：

1. 文本内容块起始：

   ```json
   {
     "type": "text",
     "text": ""
   }
   ```

2. 工具调用块起始：

   ```json
   {
     "type": "tool_use",
     "id": "toolu_01H...",
     "name": "get_weather",
     "input": {}
   }
   ```

:::

::: details 3. `content_block_delta` 事件

**含义**：对某个内容块的“增量更新”，主要是追加文本或逐步构建工具调用参数。

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

或对于工具调用参数：

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

事件类型，固定为：

- `"content_block_delta"`

##### index `integer`

本次增量更新对应的内容块索引。  
应与之前收到的某个 `content_block_start.index` 对应。

##### delta `object`

**增量内容对象**。根据目标块的类型不同，其结构也不同。

##### 文本块增量：`type = "text_delta"`

```json
{
  "type": "text_delta",
  "text": "Hello, "
}
```

##### type `string`

- `"text_delta"`

##### text `string`

新增的文本片段。客户端应将同一 `index` 的所有 text_delta 的 `text` 按顺序拼接得到完整文本。

##### 工具调用参数增量：`type = "input_json_delta"`

当 assistant 发起 `tool_use` 时，工具参数 `input` 也可能通过多次 delta 拼装。

```json
{
  "type": "input_json_delta",
  "partial_json": "\"Francisco\", \"unit\": \"celsius\"}"
}
```

##### type `string`

- `"input_json_delta"`

##### partial_json `string`

一段 JSON 片段（字符串），需要与此前/之后的片段拼接，最终组成完整的 `input` 对象。  
在全部 delta 收齐并完成 JSON 解析前，不应直接使用该参数调用你的工具。

:::

::: details 4. `content_block_stop` 事件

**含义**：指示某个内容块的增量生成已经完成。

```json
{
  "type": "content_block_stop",
  "index": 0
}
```

##### type `string`

事件类型，固定为：

- `"content_block_stop"`

##### index `integer`

内容块索引。表明该 `index` 对应的文本或工具调用参数已经生成完毕，不再有新的 delta。

:::

::: details 5. `message_delta` 事件

**含义**：对整个 Message 的元数据进行最终增量更新，比如 `stop_reason`、`usage` 等。

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

事件类型，固定为：

- `"message_delta"`

##### delta `object`

对 `message` 顶层字段的增量更新。常见字段：

###### stop_reason `string or null`

同非流式响应的 `stop_reason`，但只在最终确定时通过 delta 提供：

- `"end_turn"`
- `"max_tokens"`
- `"stop_sequence"`
- `"tool_use"`
- `null`

###### stop_sequence `string or null`

与 `stop_reason = "stop_sequence"` 搭配使用；否则通常为 `null`。

###### usage `object`

仅包含本次增量中新增或更新的用量字段。最常见情况是：

- output_tokens `integer`  
  最终完整输出的 token 数（一般在最后一次 message_delta 给出完整值）。

:::

::: details 6. `message_stop` 事件

**含义**：表示本条流式消息已完全发送结束，不会再有新的事件。

```json
{
  "type": "message_stop"
}
```

##### type `string`

事件类型，固定为：

- `"message_stop"`

该事件不包含其他字段，客户端收到此事件后可以认为：

- 所有 `content_block_*` 事件已结束；
- 所有 `message_delta` 更新已结束；
- 可以将本轮数据组装成最终 Message 对象使用。

:::

::: details 7. `error` 事件（异常情况下）

当请求或生成过程中出现错误时，可能收到 `error` 事件，随后流会终止。

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

事件类型，固定为：

- `"error"`

##### error `object`

错误详情。

- type `string`  
  错误类型，例如：
  - `"invalid_request_error"`
  - `"authentication_error"`
  - `"rate_limit_error"`
  - `"api_error"`
- message `string`  
  人类可读的错误说明文本，便于日志与调试。

:::

::: api-request POST /api/anthropic/v1/messages

```TypeScript
import Anthropic from '@anthropic-ai/sdk';

// 1. 初始化 anthropic 客户端
const anthropic = new Anthropic({
  // 2. 替换为你从 ZenMux 用户控制台获取的 API Key
  apiKey: '<你的 ZENMUX_API_KEY>', // [!code highlight]
  // 3. 将基础 URL 指向 ZenMux 端点
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

## 1. 初始化 anthropic 客户端
client = anthropic.Anthropic(
    # 替换为你从 ZenMux 用户控制台获取的 API Key
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
    # 3. 将基础 URL 指向 ZenMux 端点
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
