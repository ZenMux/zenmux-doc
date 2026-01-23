# Reasoning Models

ZenMux provides fine-grained control over model reasoning behavior in the Create Chat Completion endpoint. With the two configuration options, `reasoning_effort` and `reasoning`, you can flexibly adjust reasoning depth and resource allocation based on task complexity.

## Parameters

### reasoning_effort

A reasoning intensity parameter compliant with the OpenAI specification, used to control the model’s reasoning depth.

Optional values:

- `low`: Low-intensity reasoning, suitable for simple tasks
- `medium`: Medium-intensity reasoning (default)
- `high`: High-intensity reasoning, suitable for complex tasks
- `minimal`: Minimal reasoning intensity

::: tip Default behavior
If this parameter is not provided, the system defaults to the `medium` level.
:::

### reasoning

The `reasoning` parameter provides more granular control and supports the following fields:

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

Equivalent to the `reasoning_effort` parameter, for models that only support `reasoning_effort`. The optional values are the same as `reasoning_effort`.

#### max_tokens

Limits the maximum number of tokens used for reasoning, for models that support a thinking budget. This allows you to precisely control the number of tokens consumed during the reasoning phase.

#### enabled

Controls whether reasoning is enabled. The default is `true`. Set to `false` to disable reasoning.

## Parameter Precedence and Auto-Calculation

ZenMux automatically derives and supplements required parameters based on your inputs to ensure optimal reasoning performance.

### Default Parameter Completion

When neither `reasoning_effort` nor `reasoning` is provided, the system applies the following defaults:

```json
{
  "reasoning_effort": "medium",
  "reasoning": {
    "effort": "medium"
  }
}
```

### Auto-Calculating max_tokens

When the user specifies `max_completion_tokens`, or the model has an inherent `max_completion_tokens` limit, the system automatically calculates `reasoning.max_tokens` based on `reasoning.effort`.

Computation rules:

```
low:    20% of max_completion_tokens
medium: 50% of max_completion_tokens
high:   80% of max_completion_tokens
```

### Inferring effort from max_tokens

When `max_tokens` is provided but `effort` is not, the system infers `effort` as follows:

1. Compute the ratio: `reasoning.max_tokens / max_completion_tokens`
2. Compare the ratio to the standard levels (20%, 50%, 80%)
3. Select the closest level as the `effort` value

Example: If `reasoning.max_tokens / max_completion_tokens = 30%`, the system will automatically set `effort` to `low`.

## Usage

### OpenAI Python SDK (basic usage)

Use the native OpenAI Python SDK and pass the `reasoning_effort` parameter directly:

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

::: warning Limitations of basic usage
When using the OpenAI SDK’s native `reasoning_effort` parameter, you cannot precisely control the number of reasoning tokens. This method only supports controlling the reasoning intensity level (low/medium/high) and does not support precise `max_tokens` settings. For finer control, use the advanced usage.
:::

### OpenAI Python SDK (advanced usage)

Use the `extra_body` parameter for more granular reasoning control:

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

### cURL

#### Using the reasoning parameter

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

### Extracting Reasoning Results

Retrieve the model’s reasoning trace to understand how it arrived at the final answer:

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

# Check whether reasoning content is present
if hasattr(message, 'reasoning') and message.reasoning:
    print("Reasoning:")
    print(message.reasoning)
    print("\nFinal answer:")
    print(message.content)
else:
    print("Direct answer:")
    print(message.content)
```

::: tip Best practices

- For simple factual questions, use `low` or `medium` reasoning intensity
- For tasks requiring complex logical deduction (e.g., math problems, code generation), use `high` reasoning intensity
- Use the `max_tokens` parameter to control costs while maintaining reasoning quality
  :::
