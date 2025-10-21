# Model Routing

Model routing is an intelligent capability of ZenMux that helps you automatically select the most suitable model among many large language models. The system intelligently balances performance and cost based on request content, task characteristics, and your preference settings.

::: tip Intelligent Model Selection
No need to manually compare model performance and pricing—ZenMux automatically matches the best model for each request so you can focus on your business logic.
:::

## Why Model Routing Is Needed

In real-world applications, different tasks have different requirements for models:

- Simple conversations: Using a high-performance model can waste cost
- Complex reasoning: Using a budget model may not meet quality requirements
- Production environments: You need to balance quality, cost, and speed
- Model selection challenges: There are dozens of models on the market; manual selection is time-consuming and labor-intensive

Model routing solves these problems through automated decision-making, intelligently matching the optimal model for each request.

## Key Advantages

| Advantage      | Description                                      |
| -------------- | ------------------------------------------------ |
| Intelligent decisions | Automatically analyzes request content and task characteristics to select the most suitable model |
| Cost optimization | Prioritizes better cost-performance models while ensuring quality |
| Flexible configuration | Supports custom model pools and preference strategies to fit different business scenarios |
| Transparent and controllable | Returns information about the actual model used for easy monitoring and optimization |
| Continuous improvement | Continuously optimizes routing strategies based on historical data to improve decision quality |

## Quick Start

### Basic Usage

Using model routing is simple—set the `model` parameter to `zenmux/auto`, and specify the candidate model pool via `model_routing_config`. If you do not provide `model_routing_config.available_models`, the system will use the platform-wide [model pool](https://zenmux.ai/models).

::: code-group

```json [cURL Request]
{
  "model": "zenmux/auto",
  "model_routing_config": {
    "available_models": [
      "anthropic/claude-4-sonnet",
      "openai/gpt-5",
      "google/gemini-2.5-flash-lite"
    ],
    "preference": "balanced"
  },
  "messages": [
    {
      "role": "user",
      "content": "Explain what quantum computing is"
    }
  ]
}
```

```python [OpenAI Python SDK]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<your ZENMUX_API_KEY>"  # [!code highlight]
)

response = client.chat.completions.create(
    model="zenmux/auto",  # [!code highlight]
    extra_body={  # [!code highlight]
        "model_routing_config": {  # [!code highlight]
            "available_models": [  # [!code highlight]
                "anthropic/claude-4-sonnet",  # [!code highlight]
                "openai/gpt-5",  # [!code highlight]
                "google/gemini-2.5-flash-lite"  # [!code highlight]
            ],  # [!code highlight]
            "preference": "balanced"  # [!code highlight]
        }  # [!code highlight]
    },  # [!code highlight]
    messages=[
        {"role": "user", "content": "Explain what quantum computing is"}
    ]
)

print(f"Selected model: {response.model}")
print(f"Answer: {response.choices[0].message.content}")
```

:::

::: info Actual Model Used
The `model` field in the response returns the model actually selected by intelligent routing, enabling you to monitor and analyze routing behavior.
:::

## How It Works

### `zenmux/auto` Model

`zenmux/auto` is a special model identifier in ZenMux. When you specify this model, the system enables intelligent routing.

Routing Decision Process:

1. Request analysis: Parse prompt content, context length, task type, and other features
2. Model evaluation: Score each model in the candidate pool
3. Comprehensive decision: Balance performance, price, and availability according to the `preference` strategy
4. Model selection: Choose the optimal model and forward the request
5. Result return: Indicate the actual model used in the response

::: details Factors Considered in Routing Decisions

- Task complexity: Simple conversation vs. complex reasoning
- Context length: Short dialogues vs. long document analysis
- Model performance: Accuracy, response speed, creativity
- Model price: Input/output token unit price
- Model availability: Real-time load, regional restrictions
- User preference: performance / balanced / price

:::

## Configuration Parameters

### `model_routing_config` Object

Configure intelligent routing behavior using the `model_routing_config` parameter:

| Parameter           | Type       | Required | Description                       |
| ------------------- | ---------- | -------- | --------------------------------- |
| `available_models`  | `string[]` | Yes      | List of candidate models to choose from |
| `preference`        | `string`   | No       | Routing preference strategy, default is `balanced` |

### `available_models` - Candidate Model Pool

Specify the list of models that intelligent routing can select from. It is recommended to include 3–5 models across different performance and price tiers.

::: warning Notes

- The model list must include at least 2 models
- Mix models with different price tiers to achieve optimal balance

:::

### `preference` - Routing Preference Strategy

Specify the priority strategy used by intelligent routing during decision-making:

#### `balanced` - Balanced Mode (Default)

Seeks the best balance between performance and cost; suitable for most applications.

Features:

- Prefers budget-friendly models for simple tasks
- Automatically upgrades to high-performance models for complex tasks
- Balances quality and cost

Use cases:

- General applications in production environments
- Mixed scenarios like conversational assistants and content generation
- Situations that require cost control without sacrificing quality

#### `performance` - Performance-First Mode

Prefers the most powerful models; suitable for scenarios with extremely high quality requirements.

Features:

- Tends to select top-tier flagship models
- Ensures the highest response quality and accuracy
- Higher cost

Use cases:

- Critical business decision support
- Professional content creation (legal, medical, finance, etc.)
- Complex code generation and debugging
- Academic research and data analysis

#### `price` - Price-First Mode

Prefers models with the best cost-effectiveness; suitable for large-scale, cost-sensitive applications.

Features:

- Prefers the cheapest models
- Upgrades to more expensive models only when necessary
- Maximizes cost efficiency

Use cases:

- High-concurrency simple conversation applications
- Internal tools and testing environments
- Education and learning scenarios
- Budget-constrained startup projects

### Preference Strategy Comparison

| Strategy       | Performance | Cost       | Use Cases             |
| -------------- | ----------- | ---------- | --------------------- |
| `balanced`     | ⭐⭐⭐⭐   | ⭐⭐⭐     | Production, general apps |
| `performance`  | ⭐⭐⭐⭐⭐ | ⭐⭐       | Critical business, professional content |
| `price`        | ⭐⭐⭐     | ⭐⭐⭐⭐⭐ | High concurrency, cost-sensitive |

## Best Practices

### 1. Properly Configure the Candidate Model Pool

Follow these principles when selecting candidate models:

Recommended:

- Include 3–5 models across different tiers
- Mix flagship, mid-range, and budget models
- Consider each model’s strengths (creativity, reasoning, speed, etc.)
- Ensure all models have the necessary API keys configured

Avoid:

- Choosing only models from the same tier (loses routing advantages)
- Including too many models (increases decision complexity)

## FAQ

### Q: How much latency does intelligent routing add?

A: Routing decisions typically complete within 50–100 ms, which is negligible for most applications. Actual response time mainly depends on the selected model’s processing speed.

### Q: How many models should the candidate pool include?

A: We recommend 3–5 models. Too few won’t leverage routing advantages; too many increase decision complexity with diminishing returns.

### Q: What factors does intelligent routing consider?

A: The routing system considers multiple factors:

- Prompt content and length
- Task type (conversation, creation, reasoning, etc.)
- Model performance metrics (accuracy, speed)
- Model pricing
- Current load and availability
- Your `preference` setting

### Q: Can I see detailed routing decision logs?

A: The response returns the model actually used (`response.model`). You can also check call logs and routing details for each request in the [ZenMux user console](https://zenmux.ai/settings/activity).

::: tip Contact Us
If you encounter any issues or have suggestions and feedback, feel free to reach us via:

- Official website: <https://zenmux.ai>
- Technical support: [support@zenmux.ai](mailto:support@zenmux.ai)
- Business inquiries: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- Twitter: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- Discord community: <http://discord.gg/vHZZzj84Bm>

For more contact methods and details, visit our [Contact Us page](/help/contact).
:::