---
head:
  - - meta
    - name: description
      content: Reasoning Models
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, reasoning, OpenAI, API
---

# Reasoning Models

ZenMux provides fine-grained control over model reasoning behavior and supports multiple API protocols:

- **OpenAI Chat Completion API**: use the `reasoning_effort` or `reasoning` parameter
- **OpenAI Responses API**: use the `reasoning` parameter to control reasoning intensity and summaries
- **Anthropic Messages API**: use the `thinking` parameter to enable Extended Thinking
- **Google Vertex AI API**: use the `thinking_config` parameter to control Thinking Mode

With these parameters, you can flexibly tune the model’s reasoning depth and resource allocation based on task complexity.

## OpenAI Chat Completion API

### Parameter Reference

### reasoning_effort

A reasoning-intensity parameter that follows the OpenAI protocol, used to control the depth of the model’s reasoning.

**Available values:**

- `low`: low-intensity reasoning, suitable for simple tasks
- `medium`: medium-intensity reasoning (default)
- `high`: high-intensity reasoning, suitable for complex tasks
- `minimal`: minimal reasoning intensity

::: tip Default behavior
If you don’t pass this parameter, the system uses `medium` by default.
:::

### reasoning

The `reasoning` parameter provides more fine-grained reasoning control and supports the following fields:

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

Equivalent to the `reasoning_effort` parameter, intended for models that only support `reasoning_effort`. Available values are the same as `reasoning_effort`.

#### max_tokens

Limits the maximum number of reasoning tokens, intended for models that support a thinking budget. This lets you precisely control how many tokens the model can spend during the reasoning phase.

#### enabled

Controls whether reasoning is enabled. The default is `true`; set to `false` to disable reasoning.

### Parameter Priority and Auto-Calculation

ZenMux automatically computes and fills in the parameters required by the model based on what you provide, ensuring optimal reasoning behavior.

#### Default parameter completion

When neither `reasoning_effort` nor `reasoning` is provided, the system automatically applies the following default configuration:

```json
{
  "reasoning_effort": "medium",
  "reasoning": {
    "effort": "medium"
  }
}
```

#### Automatic max_tokens calculation

When the user specifies `max_completion_tokens`, or when the model itself has a `max_completion_tokens` limit, the system automatically calculates `reasoning.max_tokens` based on `reasoning.effort`.

**Rules:**

```
low:    20% of max_completion_tokens
medium: 50% of max_completion_tokens
high:   80% of max_completion_tokens
```

#### Reverse inference of effort

When the user provides `max_tokens` but does not specify `effort`, the system infers `effort` using the following rules:

1. Compute the ratio: `reasoning.max_tokens / max_completion_tokens`
2. Compare the ratio against the standard tiers (20%, 50%, 80%)
3. Choose the closest tier as the `effort` value

**Example:** If `reasoning.max_tokens / max_completion_tokens = 30%`, the system will automatically set `effort` to `low`.

### API Call Examples

#### Native call with the OpenAI Python SDK

Use the native OpenAI Python SDK call pattern and pass the `reasoning_effort` parameter directly:

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

::: warning Limitations of the native call pattern
When using the OpenAI SDK’s native `reasoning_effort` parameter, you cannot precisely control the number of reasoning tokens. This approach only supports reasoning intensity levels (low/medium/high) and does not support precise `max_tokens` configuration. For more fine-grained control, use the advanced approach.
:::

#### Advanced usage with the OpenAI Python SDK

Achieve finer-grained reasoning control via the `extra_body` parameter:

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

#### cURL

**Using the reasoning parameter**

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

#### Using the reasoning_effort parameter

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

#### Extracting reasoning output

Retrieve the model’s reasoning process to understand how it arrived at the final answer:

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

# Check whether reasoning content exists
if hasattr(message, 'reasoning') and message.reasoning:
    print("Reasoning process:")
    print(message.reasoning)
    print("\nFinal answer:")
    print(message.content)
else:
    print("Direct answer:")
    print(message.content)
```

::: tip Best practices

- For simple factual questions, `low` or `medium` reasoning effort is usually sufficient
- For tasks that require complex logical deduction (e.g., math problems, code generation), `high` reasoning effort is recommended
- Use the `max_tokens` parameter to control cost while maintaining reasoning quality
  :::

## OpenAI Responses API

The OpenAI Responses API uses the `reasoning` parameter to control reasoning behavior. It is similar to the Chat Completion API, but the parameter placement differs slightly.

### Parameter Reference

**reasoning**

```json
{
  "reasoning": {
    "effort": "medium",
    "summary": "auto"
  }
}
```

- `effort`: controls reasoning intensity; supports `none` / `minimal` / `low` / `medium` / `high` / `xhigh`
- `summary`: reasoning summary level; supports `auto` / `concise` / `detailed`

### API Call Examples

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

# Get reasoning and output
for item in response.output:
    if item.type == "reasoning":
        print("Reasoning summary:", item.summary)
    elif item.type == "message":
        for content in item.content:
            if content.type == "output_text":
                print("Final answer:", content.text)
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

  // Get reasoning and output
  for (const item of response.output) {
    if (item.type === "reasoning") {
      console.log("Reasoning summary:", item.summary);
    } else if (item.type === "message") {
      for (const content of item.content) {
        if (content.type === "output_text") {
          console.log("Final answer:", content.text);
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

### Response Format

The Responses API returns `reasoning` content blocks in the `output` array:

```json
{
  "output": [
    {
      "type": "reasoning",
      "summary": ["Factor the quadratic...", "Use factoring..."]
    },
    {
      "type": "message",
      "content": [
        {
          "type": "output_text",
          "text": "x = -2 or x = -3"
        }
      ]
    }
  ]
}
```

## Anthropic Messages API (Extended Thinking)

Anthropic Claude models provide reasoning capabilities via **Extended Thinking**. Enable it with the `thinking` parameter; the model will perform deep reasoning before answering.

### Supported Models

- Claude Sonnet 4.5
- Claude Sonnet 4
- Claude Haiku 4.5
- Claude Opus 4.5 / 4.1 / 4

### Parameter Reference

**thinking**

```json
{
  "thinking": {
    "type": "enabled",
    "budget_tokens": 10000
  }
}
```

- `type`: set to `"enabled"` to enable Extended Thinking
- `budget_tokens`: the thinking token budget, which controls the maximum number of tokens the model can use for reasoning

::: warning Notes

- `budget_tokens` must be less than `max_tokens`
- When thinking is enabled, modifying `temperature` or `top_k` is not supported
- Response pre-fill is not supported
- Forced tool calling is not supported (`tool_choice: "any"` or a specific tool name)
  :::

### API Call Examples

::: code-group

```python [Python]
import anthropic

client = anthropic.Anthropic(
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
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

# Extract the thinking process and the final answer
for block in message.content:
    if block.type == "thinking":
        print("Thinking process:", block.thinking[:500], "...")
    elif block.type == "text":
        print("Final answer:", block.text)
```

```ts [TypeScript]
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
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

  // Extract the thinking process and the final answer
  for (const block of message.content) {
    if (block.type === "thinking") {
      console.log("Thinking process:", block.thinking.slice(0, 500), "...");
    } else if (block.type === "text") {
      console.log("Final answer:", block.text);
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

### Response Format

When Extended Thinking is enabled, the response includes two content-block types: `thinking` and `text`:

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

::: tip Thinking summary
Claude 4 models return **Summarized Thinking** rather than the full reasoning content. This helps preserve reasoning capability while preventing abuse. Claude Sonnet 3.7 still returns full thinking output.
:::

### Streaming Responses

When streaming, thinking content is returned via the `thinking_delta` event:

```python
import anthropic

client = anthropic.Anthropic(
    api_key="<your ZENMUX_API_KEY>",
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
                print("Thinking:", event.delta.thinking, end="")
            elif hasattr(event.delta, "text"):
                print("Answer:", event.delta.text, end="")
```

## Google Vertex AI API (Thinking Mode)

Google Vertex AI Gemini models provide reasoning capabilities via **Thinking Mode**, controlled with the `thinking_config` parameter.

### Supported Models

- Gemini 3 Pro / Pro Image
- Gemini 2.5 Pro / Flash / Flash-Lite

### Parameter Reference

Gemini 3 and later use `thinking_level`, while Gemini 2.5 uses `thinking_budget`:

**Gemini 3+ (thinking_level)**

```python
thinking_config=types.ThinkingConfig(
    thinking_level=types.ThinkingLevel.HIGH  # LOW / HIGH
)
```

**Gemini 2.5 (thinking_budget)**

```python
thinking_config=types.ThinkingConfig(
    thinking_budget=10000  # number of tokens; -1 means dynamic budget
)
```

| Model                 | Min Budget | Max Budget |
| --------------------- | ---------- | ---------- |
| Gemini 2.5 Flash      | 1          | 24,576     |
| Gemini 2.5 Pro        | 128        | 32,768     |
| Gemini 2.5 Flash-Lite | 512        | 24,576     |

::: tip

- For Gemini 2.5 Flash/Flash-Lite, set `thinking_budget=0` to disable thinking
- For Gemini 2.5 Pro and Gemini 3 Pro, thinking cannot be disabled
  :::

### API Call Examples

::: code-group

```python [Python - Gemini 3]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
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
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
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
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
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

### Viewing the Thinking Process

In Vertex AI Studio, you can view the model’s full thinking process. Via the API, thinking content is included in the response:

```python
# Get the thinking summary (if available)
if hasattr(response, 'candidates') and response.candidates:
    candidate = response.candidates[0]
    if hasattr(candidate, 'thinking_metadata'):
        print("Thinking summary:", candidate.thinking_metadata.thought_summary)
```

## Protocol Comparison

| Feature         | Chat Completion                  | Responses API        | Anthropic Messages   | Vertex AI                            |
| --------------- | -------------------------------- | -------------------- | -------------------- | ------------------------------------ |
| Parameter name  | `reasoning_effort` / `reasoning` | `reasoning`          | `thinking`           | `thinking_config`                    |
| Intensity       | `low`/`medium`/`high`            | `effort` field       | `budget_tokens`      | `thinking_level`/`thinking_budget`   |
| Token budget    | `reasoning.max_tokens`           | ❌                   | `budget_tokens`      | `thinking_budget`                    |
| Reasoning summary | `reasoning` attribute          | `summary` field      | `thinking` block     | Thinking summary                     |
| Streaming       | ✅                               | ✅                   | ✅ `thinking_delta`  | ✅                                   |
| Can be disabled | ✅ `enabled: false`              | ✅ `effort: "none"`  | ❌ some models        | ❌ some models                        |