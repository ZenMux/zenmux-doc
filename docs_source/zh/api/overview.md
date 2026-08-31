---
title: API 概览
subtitle: ZenMux API 概览
headline: ZenMux API 参考文档
canonical-url: 'https://zenmux.ai/docs/zh/api/overview.html'
'og:site_name': ZenMux 文档
'og:title': ZenMux API 参考文档
'og:description': ZenMux API 的认证、请求、响应、流式返回与费用查询说明。
noindex: false
nofollow: false
head:
  - - meta
    - name: description
      content: ZenMux API 的认证、请求、响应、流式返回与费用查询说明。
  - - meta
    - name: keywords
      content: ZenMux, API, 文档, OpenAI, GPT
---

# API 概览

ZenMux 的请求和响应结构与 OpenAI Chat API 高度兼容，并在不同模型与供应商之间进行统一。接入方只需学习一套接口即可调用不同模型。

## 请求

### Chat Completions 请求格式

向 `POST /api/v1/chat/completions` 发送 JSON 请求体。完整调用示例请参阅[快速开始](/zh/guide/quickstart)，全部参数请参阅[创建 Chat Completion](/zh/api/openai/create-chat-completion)。

```typescript
type Request = {
  // messages 或 prompt 至少提供一个
  messages?: Message[];
  prompt?: string;
  // 未指定时使用账户默认模型
  model?: string;
  response_format?: { type: 'json_object' };
  stop?: string | string[];
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  tools?: Tool[];
  tool_choice?: ToolChoice;
  seed?: number;
  top_p?: number;
  top_k?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  repetition_penalty?: number;
  logit_bias?: { [key: number]: number };
  prediction?: { type: 'content'; content: string };
  user?: string;
};

type TextContent = { type: 'text'; text: string };
type ImageContentPart = {
  type: 'image_url';
  image_url: { url: string; detail?: string };
};
type Message =
  | { role: 'user' | 'assistant' | 'system'; content: string | (TextContent | ImageContentPart)[]; name?: string }
  | { role: 'tool'; content: string; tool_call_id: string; name?: string };
type Tool = { type: 'function'; function: { name: string; description?: string; parameters: object } };
type ToolChoice = 'none' | 'auto' | { type: 'function'; function: { name: string } };
```

`response_format` 可要求模型输出 JSON 对象，但只有支持该参数的模型与供应商才能使用。请在模型页确认能力，并在供应商偏好中启用 `require_parameters`；路由策略参阅[供应商路由](/zh/guide/advanced/provider-routing)。

### 请求头

`Authorization` 和 `Content-Type` 是必需请求头。`HTTP-Referer` 与 `X-Title` 为可选值，可用于标识接入应用。

```typescript
await fetch('https://zenmux.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer <ZENMUX_API_KEY>',
    'Content-Type': 'application/json',
    'HTTP-Referer': '<YOUR_SITE_URL>',
    'X-Title': '<YOUR_SITE_NAME>',
  },
  body: JSON.stringify({
    model: 'openai/gpt-4o',
    messages: [{ role: 'user', content: 'What is the meaning of life?' }],
  }),
});
```

::: info 模型与流式返回
未传 `model` 时使用账户或付款方默认模型；否则请从[模型页](https://zenmux.ai/models)或[模型列表 API](/zh/api/openai/openai-list-models)选择完整模型 slug。设置 `stream: true` 后，接口通过 SSE 返回流式结果；其中偶尔出现的 comment 事件应忽略。
:::

不支持的可选参数会被忽略，其余参数继续传递给底层模型 API。

### Assistant 预填充

在 `messages` 数组末尾加入 `role: 'assistant'` 的消息，可要求模型续写部分回答：

```typescript
messages: [
  { role: 'user', content: 'What is the meaning of life?' },
  { role: 'assistant', content: "I'm not sure, but my best guess is" },
]
```

## 响应

ZenMux 将不同模型与供应商的响应统一为 OpenAI Chat API 格式。`choices` 始终是数组；非流式响应使用 `message`，流式响应使用 `delta`。

```typescript
type Response = {
  id: string;
  choices: Array<{
    finish_reason: string | null;
    native_finish_reason?: string | null;
    message?: { role: string; content: string | null; tool_calls?: ToolCall[] };
    delta?: { content: string | null; role?: string; tool_calls?: ToolCall[] };
  }>;
  created: number;
  model: string;
  object: 'chat.completion' | 'chat.completion.chunk';
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
};
```

统一后的 `finish_reason` 为 `tool_calls`、`stop`、`length`、`content_filter` 或 `error`。供应商原始结束原因可从 `native_finish_reason` 获取。

## 费用与统计

响应内的 `usage` 在非流式请求中始终返回；流式请求会在末尾通过一个空 `choices` 的事件返回。该 Token 数是统一口径，不一定等于供应商原生 tokenizer 的计数；实际计费使用原生 Token 计数。

如需精确获取原生 Token、费用和完整生成信息，请使用响应中的 `id` 查询生成记录：

```typescript
const generation = await fetch(
  'https://zenmux.ai/api/v1/generation?id=<GENERATION_ID>',
  { headers },
);
const stats = await generation.json();
```

完整字段请参阅[获取生成记录](/zh/api/platform/get-generation)。
