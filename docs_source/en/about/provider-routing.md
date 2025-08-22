# Provider Routing

As described in the [Models and Providers](https://docs.zenmux.ai/en/about/models-and-providers.html) section, for the same model, ZenMux intelligently routes and selects appropriate providers for calls, ensuring optimal performance and availability. When calling large language models through ZenMux, developers don't need to worry about the underlying provider selection logic—they only need to specify the model name.

## Default Routing Strategy

ZenMux employs the following default routing strategy:

::: info Smart Routing Principles

1. **Prioritize Original Provider**: Prioritize the model's original developer (e.g., Claude prioritizes Anthropic)
2. **Smart Fallback**: If the original provider is unavailable, automatically switch to other providers
3. **Performance Ranking**: Other providers are ranked by first token latency from low to high
   :::

This strategy ensures maximum service availability while maintaining performance.

## Custom Routing Strategy

### Specifying Provider Lists

You can override the default routing strategy by specifying the `provider_routing_strategy` parameter in your request:

::: code-group

```json [Request Example]
{
  "model": "anthropic/claude-sonnet-4",
  "messages": [...],
  "provider_routing_strategy": { // [!code highlight]
    "type": "specified_providers", // [!code highlight]
    "providers": [ // [!code highlight]
      "anthropic/anthropic_endpoint",
      "google-vertex/VertexAIAnthropic",
      "amazon-bedrock/BedrockAnthropic"
    ]
  }
}
```

:::

### Routing Behavior Explanation

By specifying a `providers` list, ZenMux's routing behavior is as follows:

- **Sequential Calls**: Attempt to call providers in list order
- **Success Stop**: Stop once a provider successfully returns a result
- **Single Provider**: If only one provider is specified, ZenMux will only call that provider
- **Error Handling**: If a specified provider returns an error, return the error message directly

::: warning Important Notes
When using custom routing strategies, ensure that the specified providers actually support the selected model, otherwise it may result in call failures.
:::

## Getting Provider Identifiers

To accurately specify providers, you need to obtain the correct provider slug (identifier).

### How to Get Identifiers

1. Visit the [Model Details page](./models-and-providers.md)
2. Click the copy button next to the provider name
3. Copy the accurate slug identifier, such as `anthropic/anthropic_endpoint`

![Provider slug copy](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/j5hXtcH/provider-slug.png)

::: tip Tip
Make sure to use the correct slug format, typically in the form of `provider_name/endpoint_identifier`.
:::

## Use Cases

Custom provider routing strategies are suitable for the following scenarios:

| Scenario | Description | Example |
| ---------------- | ---------------------------------- | -------------------------------- |
| **Geographic Optimization** | Select providers closer geographically to reduce latency | APAC users prioritize regionally deployed providers |
| **Cost Control** | Prioritize more cost-effective providers | Choose lower-cost third-party providers |
| **Compliance Requirements** | Select providers that meet specific data compliance requirements | Financial institutions choose providers meeting regulatory requirements |
| **Performance Optimization** | Select optimal providers based on historical performance data | Choose providers with lower latency |
| **Testing Validation** | Specify particular providers for validation in development testing | A/B testing different provider performance |

::: details Complete Example

```python
import requests

# Request example specifying a specific provider
response = requests.post(
    "https://zenmux.ai/api/v1/chat/completions",
    headers={
        "Authorization": "Bearer <your_api_key>",
        "Content-Type": "application/json"
    },
    json={
        "model": "anthropic/claude-sonnet-4",
        "messages": [{"role": "user", "content": "Hello!"}],
        "provider_routing_strategy": {  # [!code highlight]
            "type": "specified_providers",  # [!code highlight]
            "providers": ["anthropic/anthropic_endpoint"]  # [!code highlight]
        }
    }
)

print(response.json())
```

:::

By properly configuring provider routing strategies, you can optimize API call performance, cost, and reliability according to specific business requirements.