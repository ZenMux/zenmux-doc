---
head:
  - - meta
    - name: description
      content: 1M Token Long Context Window
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, context window, 1M token, long context, Claude, Anthropic, API
---

# 1M Token Long Context Window

Anthropic’s Claude model family supports expanding the context window from the default 200K tokens to **1,000,000 tokens (1M)**—5× the default capacity. With ZenMux, you can enable this capability effortlessly to handle large-scale document analysis, code review, long-running conversations, and more.

::: tip 💡 Key Benefits

- **Massive context**: Process roughly 750,000 English words or thousands of pages in a single request
- **Deep analysis**: Ideal for large codebase reviews, long-form literature analysis, full conversation history, and more
- **Seamless integration**: Enable it via ZenMux’s unified interface by adding a single request header
  :::

## Supported Models

The following Claude models currently support the 1M-token context window:

| Model                 | Default Context Window | Extended Context Window |
| --------------------- | ---------------------- | ----------------------- |
| **Claude Opus 4.6**   | 200K tokens            | 1M tokens               |
| **Claude Sonnet 4.5** | 200K tokens            | 1M tokens               |
| **Claude Sonnet 4**   | 200K tokens            | 1M tokens               |

::: warning Note
The 1M-token context window is currently a Beta feature, and functionality and pricing may change in future versions.
:::

## How to Enable

To use the 1M-token context window, add the request header `anthropic-beta: context-1m-2025-08-07`. If you don’t include this header, the model will use the default 200K-token context window.

### Method 1: Use the OpenAI-Compatible API (Recommended)

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
)

response = client.chat.completions.create(
    model="anthropic/claude-sonnet-4.5",
    messages=[
        {
            "role": "user",
            "content": "Please analyze the core content of the following long document..."
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
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  const response = await openai.chat.completions.create(
    {
      model: "anthropic/claude-sonnet-4.5",
      messages: [
        {
          role: "user",
          content: "Please analyze the core content of the following long document...",
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
        "content": "Please analyze the core content of the following long document..."
      }
    ]
  }'
```

:::

---

### Method 2: Use the Native Anthropic API

::: code-group

```python [Python]
import anthropic

client = anthropic.Anthropic(
    base_url="https://zenmux.ai/api/anthropic",
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
)

response = client.beta.messages.create(
    model="anthropic/claude-sonnet-4.5",
    betas=["context-1m-2025-08-07"], # [!code highlight]
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Please analyze the core content of the following long document..."
        }
    ]
)

print(response.content[0].text)
```

```ts [TypeScript]
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  baseURL: "https://zenmux.ai/api/anthropic",
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  const response = await client.beta.messages.create({
    model: "anthropic/claude-sonnet-4.5",
    betas: ["context-1m-2025-08-07"], // [!code highlight]
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Please analyze the core content of the following long document...",
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
        "content": "Please analyze the core content of the following long document..."
      }
    ]
  }'
```

:::

## Long-Context Pricing

When the number of tokens in a request exceeds 200K, long-context pricing will apply automatically. The multipliers are as follows:

| Pricing Item     | Up to 200K         | Over 200K                |
| ---------------- | ------------------ | ------------------------ |
| **Input tokens** | 1x (standard rate) | 2x (double rate)         |
| **Output tokens** | 1x (standard rate) | 1.5x (1.5× standard rate) |

::: tip 💰 Billing Notes

- Only the portion that **actually exceeds 200K** is billed at the higher multiplier; the portion within 200K is still billed at the standard rate
- The output-token multiplier (1.5x) is lower than the input-token multiplier (2x), keeping the overall cost increase manageable
- We recommend using this together with [Prompt Caching](/guide/advanced/prompt-cache) to significantly reduce costs in long-context scenarios
  :::

## Best Practices

### Recommended Use Cases

::: tip 💡 Scenarios where 1M context is recommended

- **Large-scale code review**: Load an entire repository at once for analysis and refactoring suggestions
- **Long-document analysis**: Process full legal contracts, academic papers, technical specifications, and more
- **Multi-document comparison**: Analyze multiple related documents simultaneously for cross-referencing and comparison
- **Full conversation history**: Preserve complete context in very long conversations to avoid losing information
- **Data analysis**: Process large volumes of structured or unstructured data
  :::

### Optimization Tips

::: tip 💡 Improve long-context request quality

1. **Put critical information first**: Place the most important content at the beginning of the prompt—models pay the most attention to the start
2. **Combine with prompt caching**: For long documents reused repeatedly, cache static content via `cache_control` to save up to 90% of input costs
3. **Control context size wisely**: You don’t need to use the full 1M window every time—load only what’s relevant to the current task
4. **Use structured markup**: Organize long documents with clear XML tags or Markdown headings to help the model locate key information
   :::

## FAQ

### What happens if I don’t add the Beta header?

If you don’t add the `anthropic-beta: context-1m-2025-08-07` header, the model uses the default 200K-token context window. Any content beyond 200K cannot be processed.

### Is the 1M context window stable and production-ready?

This feature is currently in Beta. While it can already be used in production, Anthropic may adjust feature details and pricing in the future.

### Can I use it together with other features?

Yes. The 1M context window can be used together with features such as [Prompt Caching](/guide/advanced/prompt-cache), [Tool Calling](/guide/advanced/tool-calls), and [Streaming](/guide/advanced/streaming). Prompt caching is especially recommended to optimize costs for long-context workloads.