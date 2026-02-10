---
head:
  - - meta
    - name: description
      content: 1M Token 长上下文窗口
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, context window, 1M token, long context, Claude, Anthropic, API
---

# 1M Token 长上下文窗口

Anthropic Claude 系列模型支持将上下文窗口从默认的 200K token 扩展至 **1,000,000 token（1M）**，这是默认容量的 5 倍。通过 ZenMux，你可以轻松开启这一能力，处理超大规模的文档分析、代码审查、长对话等场景。

::: tip 💡 核心优势

- **超大上下文**: 单次请求可处理约 750,000 个英文单词或数千页文档
- **深度分析**: 适用于大规模代码库审查、长篇文献分析、完整对话历史等场景
- **无缝集成**: 通过 ZenMux 统一接口调用，只需添加一个请求头即可开启
  :::

## 支持的模型

目前以下 Claude 模型支持 1M token 上下文窗口：

| 模型                  | 默认上下文窗口 | 扩展上下文窗口 |
| --------------------- | -------------- | -------------- |
| **Claude Opus 4.6**   | 200K tokens    | 1M tokens      |
| **Claude Sonnet 4.5** | 200K tokens    | 1M tokens      |
| **Claude Sonnet 4**   | 200K tokens    | 1M tokens      |

::: warning 注意
1M token 上下文窗口目前为 Beta 功能，可能会在未来版本中调整功能和定价。
:::

## 开启方法

要使用 1M token 上下文窗口，需要在请求中添加 `anthropic-beta: context-1m-2025-08-07` 请求头。不添加该请求头时，模型默认使用 200K token 上下文窗口。

### 方法一：使用 OpenAI 兼容接口（推荐）

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
)

response = client.chat.completions.create(
    model="anthropic/claude-sonnet-4.5",
    messages=[
        {
            "role": "user",
            "content": "请分析以下长文档的核心内容..."
        }
    ],
    extra_headers={
        "anthropic-beta": "context-1m-2025-08-07" # [!code highlight]
    }
)

print(response.choices[0].message.content)
```

```ts [TypeScript]
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1",
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  const response = await openai.chat.completions.create(
    {
      model: "anthropic/claude-sonnet-4.5",
      messages: [
        {
          role: "user",
          content: "请分析以下长文档的核心内容...",
        },
      ],
    },
    {
      headers: {
        "anthropic-beta": "context-1m-2025-08-07", // [!code highlight]
      },
    },
  );

  console.log(response.choices[0].message.content);
}

main();
```

```bash [Shell (cURL)]
curl "https://zenmux.ai/api/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "anthropic-beta: context-1m-2025-08-07" \
  -d '{
    "model": "anthropic/claude-sonnet-4.5",
    "messages": [
      {
        "role": "user",
        "content": "请分析以下长文档的核心内容..."
      }
    ]
  }'
```

:::

---

### 方法二：使用 Anthropic 原生接口

::: code-group

```python [Python]
import anthropic

client = anthropic.Anthropic(
    base_url="https://zenmux.ai/api/anthropic",
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
)

response = client.beta.messages.create(
    model="anthropic/claude-sonnet-4.5",
    betas=["context-1m-2025-08-07"], # [!code highlight]
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "请分析以下长文档的核心内容..."
        }
    ]
)

print(response.content[0].text)
```

```ts [TypeScript]
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  baseURL: "https://zenmux.ai/api/anthropic",
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  const response = await client.beta.messages.create({
    model: "anthropic/claude-sonnet-4.5",
    betas: ["context-1m-2025-08-07"], // [!code highlight]
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "请分析以下长文档的核心内容...",
      },
    ],
  });

  console.log(response.content[0].text);
}

main();
```

```bash [Shell (cURL)]
curl "https://zenmux.ai/api/anthropic/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $ZENMUX_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: context-1m-2025-08-07" \
  -d '{
    "model": "anthropic/claude-sonnet-4.5",
    "max_tokens": 4096,
    "messages": [
      {
        "role": "user",
        "content": "请分析以下长文档的核心内容..."
      }
    ]
  }'
```

:::

## 长上下文定价

当请求的 token 数量超过 200K 时，将自动按照长上下文定价计费。具体倍率如下：

| 定价项目       | 200K 以内      | 超过 200K          |
| -------------- | -------------- | ------------------ |
| **输入 token** | 1x（标准价格） | 2x（双倍价格）     |
| **输出 token** | 1x（标准价格） | 1.5x（1.5 倍价格） |

::: tip 💰 计费说明

- 只有**实际超过 200K 的部分**才会按照高倍率计费，200K 以内的部分仍按标准价格计费
- 输出 token 的定价倍率（1.5x）低于输入 token（2x），整体成本增加可控
- 建议结合[提示词缓存](/zh/guide/advanced/prompt-cache)功能使用，可以大幅降低长上下文场景下的成本
  :::

## 最佳实践

### 适用场景

::: tip 💡 推荐使用 1M 上下文窗口的场景

- **大规模代码审查**: 一次性加载整个代码库进行分析和重构建议
- **长文档分析**: 处理完整的法律合同、学术论文、技术规范等
- **多文档对比**: 同时分析多个相关文档，进行交叉引用和对比
- **完整对话历史**: 在超长对话中保持完整的上下文，避免信息丢失
- **数据分析**: 处理大量结构化或非结构化数据
  :::

### 优化建议

::: tip 💡 提升长上下文请求效果

1. **重要信息前置**: 将最关键的内容放在提示词开头，模型对开头部分的关注度最高
2. **结合提示词缓存**: 对于重复使用的长文档，使用 `cache_control` 缓存静态内容，可节省高达 90% 的输入成本
3. **合理控制上下文**: 不必总是使用满 1M 的窗口，只加载与当前任务相关的内容
4. **使用结构化标记**: 用清晰的 XML 标签或 Markdown 标题组织长文档，帮助模型定位关键信息
   :::

## 常见问题

### 不添加 Beta 请求头会怎样？

不添加 `anthropic-beta: context-1m-2025-08-07` 请求头时，模型默认使用 200K token 的上下文窗口。超过 200K 的内容将无法被处理。

### 1M 上下文窗口是否稳定可用？

该功能目前处于 Beta 阶段。虽然已经可以在生产环境中使用，但 Anthropic 可能会在未来调整功能细节和定价策略。

### 可以和其他功能同时使用吗？

可以。1M 上下文窗口可以与[提示词缓存](/zh/guide/advanced/prompt-cache)、[工具调用](/zh/guide/advanced/tool-calls)、[流式输出](/zh/guide/advanced/streaming)等功能同时使用。特别推荐结合提示词缓存使用，以优化长上下文场景下的成本。
