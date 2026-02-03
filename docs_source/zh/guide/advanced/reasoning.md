---
head:
  - - meta
    - name: description
      content: 推理模型
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, reasoning, OpenAI, API
---

# 推理模型

ZenMux 提供了对模型推理行为的精细控制能力，支持多种 API 协议：

- **OpenAI Chat Completion API**：使用 `reasoning_effort` 或 `reasoning` 参数
- **OpenAI Responses API**：使用 `reasoning` 参数控制推理强度和摘要
- **Anthropic Messages API**：使用 `thinking` 参数启用 Extended Thinking（扩展思维）
- **Google Vertex AI API**：使用 `thinking_config` 参数控制 Thinking Mode（思考模式）

通过这些参数，您可以根据任务复杂度灵活调整模型的推理深度和资源分配。

## OpenAI Chat Completion API

### 参数说明

### reasoning_effort

遵循 OpenAI 协议的推理强度参数,用于控制模型的推理深度。

**可选值:**

- `low`: 低强度推理,适合简单任务
- `medium`: 中等强度推理(默认值)
- `high`: 高强度推理,适合复杂任务
- `minimal`: 最小推理强度

::: tip 默认行为
如果不传递该参数,系统默认使用 `medium` 级别。
:::

### reasoning

`reasoning` 参数提供了更精细的推理控制能力,支持以下字段:

```json
{
  "reasoning": {
    "effort": "medium",
    "max_tokens": 1024,
    "enabled": true
  }
}
```

#### effort

等价于 `reasoning_effort` 参数,供仅支持 `reasoning_effort` 的模型使用。可选值与 `reasoning_effort` 相同。

#### max_tokens

用于限制推理 token 的最大长度,供支持 thinking budget 的模型使用。通过该参数可以精确控制模型在推理阶段消耗的 token 数量。

#### enabled

控制是否启用推理功能。默认值为 `true`,设置为 `false` 可关闭推理行为。

### 参数优先级与自动计算

ZenMux 会根据您传递的参数自动计算和补充模型所需的参数,确保最佳的推理效果。

#### 默认参数补充

当 `reasoning_effort` 和 `reasoning` 都不传递时,系统自动应用以下默认配置:

```json
{
  "reasoning_effort": "medium",
  "reasoning": {
    "effort": "medium"
  }
}
```

#### max_tokens 自动计算

当用户指定了 `max_completion_tokens`,或模型本身具有 `max_completion_tokens` 限制时,系统会根据 `reasoning.effort` 自动计算 `reasoning.max_tokens`。

**计算规则:**

```
low:    20% 的 max_completion_tokens
medium: 50% 的 max_completion_tokens
high:   80% 的 max_completion_tokens
```

#### effort 反向推算

当用户传递了 `max_tokens` 但未指定 `effort` 时,系统会根据以下规则反向推算 `effort`:

1. 计算占比: `reasoning.max_tokens / max_completion_tokens`
2. 将占比与标准档位(20%, 50%, 80%)进行比较
3. 选择最接近的档位作为 `effort` 值

**示例:** 如果 `reasoning.max_tokens / max_completion_tokens = 30%`,系统将自动设置 `effort` 为 `low`。

### API 调用示例

#### OpenAI Python SDK 原生调用

使用 OpenAI Python SDK 的原生调用方式,直接传递 `reasoning_effort` 参数:

```python
from openai import OpenAI
import os

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key=os.getenv("ZENMUX_API_KEY"),
)

completion = client.chat.completions.create(
    model="qwen/qwen3-max-preview",
    reasoning_effort="high",
    messages=[
        {
          "role": "user",
          "content": "What is the meaning of life?"
        }
    ]
)
print(completion.choices[0])
```

::: warning 原生调用方式的限制
使用 OpenAI SDK 的原生 `reasoning_effort` 参数时,无法精确控制推理 token 的数量。该方式仅支持推理强度级别的控制(low/medium/high),不支持 `max_tokens` 的精确设置。若需要更精细的控制,请使用高级用法。
:::

#### OpenAI Python SDK 高级用法

通过 `extra_body` 参数实现更精细的推理控制:

```python
from openai import OpenAI
import os

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key=os.getenv("ZENMUX_API_KEY"),
)

response = client.chat.completions.create(
    model="qwen/qwen3-max-preview",
    messages=[
        {"role": "user", "content": "How would you build the world's tallest skyscraper?"}
    ],
    extra_body={
        "reasoning": {
            "effort": "high",
            "max_tokens": 2048
        }
    },
)

msg = response.choices[0].message
print(getattr(msg, "reasoning", None))
print(msg.content)
```

#### cURL 调用方式

**使用 reasoning 参数**

```bash
curl https://zenmux.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "qwen/qwen3-max-preview",
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ],
    "reasoning": {
      "effort": "high",
      "max_tokens": 1024
    }
  }'
```

#### 使用 reasoning_effort 参数

```bash
curl https://zenmux.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "qwen/qwen3-max-preview",
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ],
    "reasoning_effort": "high"
  }'
```

#### 推理结果提取

获取模型的推理过程,了解模型如何得出最终答案:

```python
from openai import OpenAI
import os

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key=os.getenv("ZENMUX_API_KEY"),
)

response = client.chat.completions.create(
    model="qwen/qwen3-max-preview",
    messages=[
        {"role": "user", "content": "Solve this math problem: 2x + 5 = 15"}
    ],
    reasoning_effort="high",
)

message = response.choices[0].message

# 检查是否有推理内容
if hasattr(message, 'reasoning') and message.reasoning:
    print("推理过程:")
    print(message.reasoning)
    print("\n最终答案:")
    print(message.content)
else:
    print("直接回答:")
    print(message.content)
```

::: tip 最佳实践

- 对于简单的事实性问题,使用 `low` 或 `medium` 推理强度即可
- 对于需要复杂逻辑推导的任务(如数学问题、代码生成),建议使用 `high` 推理强度
- 使用 `max_tokens` 参数可以在保证推理质量的同时控制成本
  :::

## OpenAI Responses API

OpenAI Responses API 使用 `reasoning` 参数来控制推理行为，与 Chat Completion API 类似但参数位置略有不同。

### 参数说明

**reasoning**

```json
{
  "reasoning": {
    "effort": "medium",
    "summary": "auto"
  }
}
```

- `effort`：控制推理强度，支持 `none` / `minimal` / `low` / `medium` / `high` / `xhigh`
- `summary`：推理摘要级别，支持 `auto` / `concise` / `detailed`

### API 调用示例

::: code-group

```python [Python]
from openai import OpenAI
import os

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key=os.getenv("ZENMUX_API_KEY"),
)

response = client.responses.create(
    model="openai/gpt-5", # [!code highlight]
    input="Solve this math problem: If x^2 + 5x + 6 = 0, what are the values of x?",
    reasoning={ # [!code highlight]
        "effort": "high", # [!code highlight]
        "summary": "detailed"
    }
)

# 获取推理和输出
for item in response.output:
    if item.type == "reasoning":
        print("推理摘要:", item.summary)
    elif item.type == "message":
        for content in item.content:
            if content.type == "output_text":
                print("最终答案:", content.text)
```

```ts [TypeScript]
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1",
  apiKey: process.env.ZENMUX_API_KEY,
});

async function main() {
  const response = await openai.responses.create({
    model: "openai/gpt-5", // [!code highlight]
    input:
      "Solve this math problem: If x^2 + 5x + 6 = 0, what are the values of x?",
    reasoning: {
      // [!code highlight]
      effort: "high", // [!code highlight]
      summary: "detailed",
    },
  });

  // 获取推理和输出
  for (const item of response.output) {
    if (item.type === "reasoning") {
      console.log("推理摘要:", item.summary);
    } else if (item.type === "message") {
      for (const content of item.content) {
        if (content.type === "output_text") {
          console.log("最终答案:", content.text);
        }
      }
    }
  }
}

main();
```

```bash [cURL]
curl https://zenmux.ai/api/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "openai/gpt-5",
    "input": "Solve this math problem: If x^2 + 5x + 6 = 0, what are the values of x?",
    "reasoning": {
      "effort": "high",
      "summary": "detailed"
    }
  }'
```

:::

### 响应格式

Responses API 会在 `output` 数组中返回 `reasoning` 类型的内容块：

```json
{
  "output": [
    {
      "type": "reasoning",
      "summary": ["分解二次方程...", "使用因式分解法..."]
    },
    {
      "type": "message",
      "content": [
        {
          "type": "output_text",
          "text": "x = -2 或 x = -3"
        }
      ]
    }
  ]
}
```

## Anthropic Messages API (Extended Thinking)

Anthropic Claude 模型通过 **Extended Thinking（扩展思维）** 功能提供推理能力。使用 `thinking` 参数启用，模型会在回答前进行深度推理。

### 支持的模型

- Claude Sonnet 4.5
- Claude Sonnet 4
- Claude Haiku 4.5
- Claude Opus 4.5 / 4.1 / 4

### 参数说明

**thinking**

```json
{
  "thinking": {
    "type": "enabled",
    "budget_tokens": 10000
  }
}
```

- `type`：设置为 `"enabled"` 启用扩展思维
- `budget_tokens`：思维 token 预算，控制模型用于推理的最大 token 数量

::: warning 注意事项

- `budget_tokens` 必须小于 `max_tokens`
- 启用思维功能时不支持 `temperature` 或 `top_k` 修改
- 不能预填充响应（pre-fill）
- 不支持强制工具调用（`tool_choice: "any"` 或指定工具名）
  :::

### API 调用示例

::: code-group

```python [Python]
import anthropic

client = anthropic.Anthropic(
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
    base_url="https://zenmux.ai/api/anthropic" # [!code highlight]
)

message = client.messages.create(
    model="anthropic/claude-sonnet-4.5", # [!code highlight]
    max_tokens=16000,
    thinking={ # [!code highlight]
        "type": "enabled", # [!code highlight]
        "budget_tokens": 10000 # [!code highlight]
    },
    messages=[
        {
            "role": "user",
            "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?"
        }
    ]
)

# 提取思维过程和最终答案
for block in message.content:
    if block.type == "thinking":
        print("思维过程:", block.thinking[:500], "...")
    elif block.type == "text":
        print("最终答案:", block.text)
```

```ts [TypeScript]
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
  baseURL: "https://zenmux.ai/api/anthropic", // [!code highlight]
});

async function main() {
  const message = await anthropic.messages.create({
    model: "anthropic/claude-sonnet-4.5", // [!code highlight]
    max_tokens: 16000,
    thinking: {
      // [!code highlight]
      type: "enabled", // [!code highlight]
      budget_tokens: 10000, // [!code highlight]
    },
    messages: [
      {
        role: "user",
        content:
          "Are there an infinite number of prime numbers such that n mod 4 == 3?",
      },
    ],
  });

  // 提取思维过程和最终答案
  for (const block of message.content) {
    if (block.type === "thinking") {
      console.log("思维过程:", block.thinking.slice(0, 500), "...");
    } else if (block.type === "text") {
      console.log("最终答案:", block.text);
    }
  }
}

main();
```

```bash [cURL]
curl https://zenmux.ai/api/anthropic/v1/messages \
  -H "x-api-key: $ZENMUX_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-4.5",
    "max_tokens": 16000,
    "thinking": {
      "type": "enabled",
      "budget_tokens": 10000
    },
    "messages": [
      {
        "role": "user",
        "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?"
      }
    ]
  }'
```

:::

### 响应格式

启用扩展思维后，响应会包含 `thinking` 和 `text` 两种内容块：

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me analyze this step by step...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve..."
    },
    {
      "type": "text",
      "text": "Based on my analysis..."
    }
  ]
}
```

::: tip 思维摘要
Claude 4 模型返回的是**总结后的思维过程**（Summarized Thinking），而非完整的推理内容。这样可以在保持推理能力的同时防止滥用。Claude Sonnet 3.7 仍返回完整的思维输出。
:::

### 流式响应

流式传输时，思维内容通过 `thinking_delta` 事件返回：

```python
import anthropic

client = anthropic.Anthropic(
    api_key="<你的 ZENMUX_API_KEY>",
    base_url="https://zenmux.ai/api/anthropic"
)

with client.messages.stream(
    model="anthropic/claude-sonnet-4.5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[
        {"role": "user", "content": "What is 27 * 453?"}
    ]
) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            if hasattr(event.delta, "thinking"):
                print("思维:", event.delta.thinking, end="")
            elif hasattr(event.delta, "text"):
                print("回答:", event.delta.text, end="")
```

## Google Vertex AI API (Thinking Mode)

Google Vertex AI 的 Gemini 模型通过 **Thinking Mode（思考模式）** 提供推理能力，使用 `thinking_config` 参数控制。

### 支持的模型

- Gemini 3 Pro / Pro Image
- Gemini 2.5 Pro / Flash / Flash-Lite

### 参数说明

Gemini 3 及更高版本使用 `thinking_level`，Gemini 2.5 使用 `thinking_budget`：

**Gemini 3+ (thinking_level)**

```python
thinking_config=types.ThinkingConfig(
    thinking_level=types.ThinkingLevel.HIGH  # LOW / HIGH
)
```

**Gemini 2.5 (thinking_budget)**

```python
thinking_config=types.ThinkingConfig(
    thinking_budget=10000  # token 数量，-1 表示动态预算
)
```

| 模型                  | 最小预算 | 最大预算 |
| --------------------- | -------- | -------- |
| Gemini 2.5 Flash      | 1        | 24,576   |
| Gemini 2.5 Pro        | 128      | 32,768   |
| Gemini 2.5 Flash-Lite | 512      | 24,576   |

::: tip

- Gemini 2.5 Flash/Flash-Lite 设置 `thinking_budget=0` 可关闭思考功能
- Gemini 2.5 Pro 和 Gemini 3 Pro 无法关闭思考功能
  :::

### API 调用示例

::: code-group

```python [Python - Gemini 3]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai' # [!code highlight]
    ),
)

response = client.models.generate_content(
    model="google/gemini-3-pro", # [!code highlight]
    contents="Find the race condition in this multi-threaded code snippet...",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
            thinking_level=types.ThinkingLevel.HIGH # [!code highlight]
        )
    ),
)

print(response.text)
```

```python [Python - Gemini 2.5]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai' # [!code highlight]
    ),
)

response = client.models.generate_content(
    model="google/gemini-2.5-pro", # [!code highlight]
    contents="Solve the equation: x^3 - 6x^2 + 11x - 6 = 0",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
            thinking_budget=16000 # [!code highlight]
        )
    ),
)

print(response.text)
```

```ts [TypeScript]
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai", // [!code highlight]
    apiVersion: "v1",
  },
});

async function main() {
  const response = await client.models.generateContent({
    model: "google/gemini-2.5-pro", // [!code highlight]
    contents: "Solve the equation: x^3 - 6x^2 + 11x - 6 = 0",
    generationConfig: {
      thinkingConfig: {
        thinkingBudget: 16000, // [!code highlight]
      },
    },
  });

  console.log(response.text);
}

main();
```

:::

### 查看思考过程

在 Vertex AI Studio 中，您可以查看模型的完整思考过程。通过 API，思考内容会包含在响应中：

```python
# 获取思考总结（如果可用）
if hasattr(response, 'candidates') and response.candidates:
    candidate = response.candidates[0]
    if hasattr(candidate, 'thinking_metadata'):
        print("思考总结:", candidate.thinking_metadata.thought_summary)
```

## 协议对比

| 特性       | Chat Completion                  | Responses API       | Anthropic Messages  | Vertex AI                          |
| ---------- | -------------------------------- | ------------------- | ------------------- | ---------------------------------- |
| 参数名     | `reasoning_effort` / `reasoning` | `reasoning`         | `thinking`          | `thinking_config`                  |
| 强度控制   | `low`/`medium`/`high`            | `effort` 字段       | `budget_tokens`     | `thinking_level`/`thinking_budget` |
| Token 预算 | `reasoning.max_tokens`           | ❌                  | `budget_tokens`     | `thinking_budget`                  |
| 推理摘要   | `reasoning` 属性                 | `summary` 字段      | `thinking` 内容块   | 思考总结                           |
| 流式支持   | ✅                               | ✅                  | ✅ `thinking_delta` | ✅                                 |
| 可关闭     | ✅ `enabled: false`              | ✅ `effort: "none"` | ❌ 部分模型         | ❌ 部分模型                        |
