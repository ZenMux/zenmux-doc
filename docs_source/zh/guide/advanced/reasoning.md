# 推理模型

ZenMux 在 Create chat completion 接口中提供了对模型推理行为的精细控制能力。通过 `reasoning_effort` 和 `reasoning` 两种参数配置方式,您可以根据任务复杂度灵活调整模型的推理深度和资源分配。

## 参数说明

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

## 参数优先级与自动计算

ZenMux 会根据您传递的参数自动计算和补充模型所需的参数,确保最佳的推理效果。

### 默认参数补充

当 `reasoning_effort` 和 `reasoning` 都不传递时,系统自动应用以下默认配置:

```json
{
  "reasoning_effort": "medium",
  "reasoning": {
    "effort": "medium"
  }
}
```

### max_tokens 自动计算

当用户指定了 `max_completion_tokens`,或模型本身具有 `max_completion_tokens` 限制时,系统会根据 `reasoning.effort` 自动计算 `reasoning.max_tokens`。

**计算规则:**

```
low:    20% 的 max_completion_tokens
medium: 50% 的 max_completion_tokens
high:   80% 的 max_completion_tokens
```

### effort 反向推算

当用户传递了 `max_tokens` 但未指定 `effort` 时,系统会根据以下规则反向推算 `effort`:

1. 计算占比: `reasoning.max_tokens / max_completion_tokens`
2. 将占比与标准档位(20%, 50%, 80%)进行比较
3. 选择最接近的档位作为 `effort` 值

**示例:** 如果 `reasoning.max_tokens / max_completion_tokens = 30%`,系统将自动设置 `effort` 为 `low`。

## 使用方式

### OpenAI Python SDK 原生调用

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

### OpenAI Python SDK 高级用法

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

### cURL 调用方式

#### 使用 reasoning 参数

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

### 推理结果提取

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
