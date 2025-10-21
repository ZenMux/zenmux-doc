# Provider Routing

As described in the [Models and Providers](/about/models-and-providers.html) section, ZenMux intelligently routes requests to the appropriate provider for the same model to ensure optimal performance and availability. When invoking LLMs through ZenMux, developers do not need to care about the underlying provider selection logic—just specify the model name.

## Default Routing Strategy

ZenMux uses the following default routing strategy:

::: info Intelligent Routing Principles

1. Performance First: Sort by first-token latency from low to high
2. Smart Switching: Automatically fall back to alternative providers if the origin provider is unavailable

:::

This strategy maximizes service availability while ensuring performance.

## Simple Way to Specify a Provider

ZenMux offers a straightforward provider configuration method—model name suffix syntax. Without using a separate `provider` configuration field, you can directly specify the provider in the model name.

### Syntax

```text
model_slug:provider_slug
```

### Usage Example

::: info How to Obtain Model Slugs
Models on the ZenMux platform have unique slugs. You can get the model slug from the [Models page](https://zenmux.ai/models):
![model-slug](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/21/AQG0SIr/model-slug.png)
Or from a specific model's detail page, e.g., [Claude Sonnet 4.5](https://zenmux.ai/anthropic/claude-sonnet-4.5):
![model-slug](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/21/dWYxJnq/model-slug-3.png)
:::

::: info How to Obtain Provider Slugs
Model providers on the ZenMux platform have unique slugs. You can get the provider slug from the [model detail page](https://zenmux.ai/anthropic/claude-sonnet-4.5):
![provider-slug](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/21/98Gc7hL/provider-slug.png)
:::

For example, to lock Claude 3.7 Sonnet to the AWS Bedrock provider, simply use:

```text
anthropic/claude-3.7-sonnet:amazon-bedrock
```

The `:amazon-bedrock` suffix tells ZenMux to route the request specifically to the designated provider—no extra configuration needed.

::: code-group

```json [JSON Request]
{
  "model": "anthropic/claude-3.7-sonnet:amazon-bedrock", // [!code highlight]
  "messages": [
    {
      "role": "user",
      "content": "Hello, Claude!"
    }
  ]
}
```

```python [OpenAI Python SDK]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<your_api_key>"
)

response = client.chat.completions.create(
    model="anthropic/claude-3.7-sonnet:amazon-bedrock",  # [!code highlight]
    messages=[
        {"role": "user", "content": "Hello, Claude!"}
    ]
)

print(response.choices[0].message.content)
```

:::

### Key Advantages

| Feature           | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| Simple & Intuitive | Specify directly in the model name—no extra config fields    |
| API-Compatible    | Fully compatible with the standard parameter structure of the OpenAI SDK |
| Fast Switching    | Change the provider by modifying the model name              |
| Clear & Explicit  | Instantly see which provider is being used                   |

::: tip 💡 Best Practices
For most scenarios, we recommend using the model name suffix syntax to specify the provider—it's the simplest and most direct approach. If you need more complex routing (e.g., multi-provider fallback, dynamic prioritization), use the advanced routing configuration described below.
:::

## Advanced Routing Configuration

For scenarios requiring finer control, ZenMux provides comprehensive `provider` configuration capabilities.

### Route by Performance Metrics

You can use the `provider.routing` configuration to specify how providers are sorted by a particular performance dimension.

#### Supported Routing Factors

| Factor        | Description                                           |
| ------------- | ----------------------------------------------------- |
| latency       | Sort by first-token latency from low to high         |
| price         | Sort by total price (Prompt + Completion) from low to high |
| throughput    | Sort by throughput from high to low                  |

#### Configuration Examples

::: code-group

```json [Route by Price]
{
  "model": "anthropic/claude-sonnet-4",
  "messages": [
    {
      "role": "user",
      "content": "Hello!"
    }
  ],
  "provider": {
    // [!code highlight]
    "routing": {
      // [!code highlight]
      "type": "priority", // [!code highlight]
      "primary_factor": "price" // [!code highlight]
    }
  }
}
```

```json [Route by Throughput]
{
  "model": "anthropic/claude-sonnet-4",
  "messages": [
    {
      "role": "user",
      "content": "Hello!"
    }
  ],
  "provider": {
    // [!code highlight]
    "routing": {
      // [!code highlight]
      "type": "priority", // [!code highlight]
      "primary_factor": "throughput" // [!code highlight]
    }
  }
}
```

:::

### Specify Provider List

You can explicitly specify the provider list and invocation order to implement a custom fallback mechanism.

::: code-group

```json [Specify Provider Order]
{
  "model": "anthropic/claude-sonnet-4",
  "messages": [
    {
      "role": "user",
      "content": "Hello!"
    }
  ],
  "provider": {
    // [!code highlight]
    "routing": {
      // [!code highlight]
      "type": "order", // [!code highlight]
      "providers": [
        // [!code highlight]
        "anthropic/anthropic_endpoint", // [!code highlight]
        "google-vertex/VertexAIAnthropic", // [!code highlight]
        "amazon-bedrock/BedrockAnthropic" // [!code highlight]
      ]
    }
  }
}
```

```python [Python SDK Example]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<your_api_key>"
)

response = client.chat.completions.create(
    model="anthropic/claude-sonnet-4",
    messages=[
        {"role": "user", "content": "Hello!"}
    ],
    extra_body={
        "provider": {
            "routing": {
                "type": "order",
                "providers": [
                    "anthropic/anthropic_endpoint",
                    "google-vertex/VertexAIAnthropic",
                    "amazon-bedrock/BedrockAnthropic"
                ]
            }
        }
    }
)
```

:::

#### Routing Behavior

When a `providers` list is specified, ZenMux's routing behaves as follows:

- Sequential Attempts: Try each provider in the order listed
- Stop on Success: Stop as soon as a provider returns a successful result
- Single Provider: If only one provider is specified, ZenMux will call only that provider
- Error Handling: If the specified provider returns an error, the error is returned directly

::: warning ⚠️ Cautions
When using custom routing strategies, ensure the specified providers truly support the selected model; otherwise, the call may fail.
:::

## Use Cases

Different routing strategies fit different business scenarios:

| Scenario             | Recommended Method         | Description                                      |
| -------------------- | -------------------------- | ------------------------------------------------ |
| Lock to a Single Provider | Model name suffix syntax   | Simple and direct; ideal for production with a fixed provider |
| Geographic Optimization | Specify provider list      | Choose providers closer to your region to reduce latency |
| Cost Control         | Route by price             | Prefer providers with better pricing             |
| Performance Optimization | Route by latency or throughput | Dynamically select the best provider based on performance metrics |
| High Availability    | Specify multiple providers  | Multi-provider fallback to ensure service continuity |
| Compliance Requirements | Lock to a specific provider | Choose providers that meet data compliance requirements |
| Testing and Validation | Flexible switching         | A/B test provider performance                    |

::: details 📋 Complete Examples

```python
import requests

# Example 1: Model name suffix syntax (recommended)
response_1 = requests.post(
    "https://zenmux.ai/api/v1/chat/completions",
    headers={
        "Authorization": "Bearer <your_api_key>",
        "Content-Type": "application/json"
    },
    json={
        "model": "anthropic/claude-sonnet-4:anthropic",  # [!code highlight]
        "messages": [{"role": "user", "content": "Hello!"}]
    }
)

# Example 2: Advanced routing configuration
response_2 = requests.post(
    "https://zenmux.ai/api/v1/chat/completions",
    headers={
        "Authorization": "Bearer <your_api_key>",
        "Content-Type": "application/json"
    },
    json={
        "model": "anthropic/claude-sonnet-4",
        "messages": [{"role": "user", "content": "Hello!"}],
        "provider": {  # [!code highlight]
            "routing": {  # [!code highlight]
                "type": "order",  # [!code highlight]
                "providers": [  # [!code highlight]
                    "anthropic/anthropic_endpoint",  # [!code highlight]
                    "amazon-bedrock/BedrockAnthropic"  # [!code highlight]
                ]  # [!code highlight]
            }
        }
    }
)

print(response_1.json())
print(response_2.json())
```

:::

By configuring provider routing strategies appropriately, you can optimize API call performance, cost, and reliability according to your specific business needs.

::: tip Contact Us
If you encounter any issues during use or have suggestions and feedback, feel free to reach us via:

- Official Website: <https://zenmux.ai>
- Technical Support Email: [support@zenmux.ai](mailto:support@zenmux.ai)
- Business Cooperation Email: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- Twitter: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- Discord Community: <http://discord.gg/vHZZzj84Bm>

For more contact methods and details, please visit our [Contact Us page](/help/contact).
:::