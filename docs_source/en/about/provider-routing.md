# Provider Routing

As described in the [Models and Providers](./models-and-providers.md) section, for the same model, ZenMux intelligently routes and selects appropriate providers for calls, ensuring optimal performance and availability.

## Default Routing Strategy

ZenMux adopts the following default routing strategy:

::: info Smart Routing Principles
1. **Original Provider Priority**: Prioritize the original model developer (e.g., Claude prioritizes Anthropic)
2. **Smart Fallback**: If the original provider is unavailable, automatically switch to other providers
3. **Performance Ranking**: Other providers are ranked by Time to First Token (Latency) from low to high
:::

This strategy ensures maximum service availability while maintaining performance.

## Custom Routing Strategy

### Specifying Provider List

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

### Routing Behavior

By specifying the `providers` list, ZenMux's routing behavior is as follows:

- **Sequential Calls**: Attempts to call providers in the order specified in the list
- **Stop on Success**: Continues until a provider successfully returns a result
- **Single Provider**: If only one provider is specified, ZenMux will only call that provider
- **Error Handling**: If a specified provider returns an error, the error message is returned directly

::: warning Important Notes
When using custom routing strategies, ensure that the specified providers actually support the selected model, otherwise calls may fail.
:::

## Getting Provider Identifiers

To accurately specify providers, you need to obtain the correct provider slug (identifier).

### How to Get Provider Slugs

1. Visit the [Model Details page](./models-and-providers.md)
2. Click the copy button next to the provider name
3. Copy the exact slug identifier, such as `anthropic/anthropic_endpoint`

![Provider slug copy](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/j5hXtcH/provider-slug.png)

::: tip Tip
Ensure you use the correct slug format, typically in the form of `provider_name/endpoint_identifier`.
:::

## Use Cases

Custom provider routing strategies are suitable for the following scenarios:

| Scenario | Description | Example |
|----------|-------------|---------|
| **Geographic Optimization** | Select geographically closer providers to reduce latency | Asia-Pacific users prioritize regionally deployed providers |
| **Cost Control** | Prioritize providers with better pricing | Choose lower-cost third-party providers |
| **Compliance Requirements** | Select providers that meet specific data compliance requirements | Financial institutions choose providers meeting regulatory requirements |
| **Performance Optimization** | Choose optimal providers based on historical performance data | Select providers with lower latency |
| **Testing and Validation** | Specify particular providers for validation during development testing | A/B test performance of different providers |

::: details Complete Example
```python
import requests

# Request example specifying a particular provider
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

By properly configuring provider routing strategies, you can optimize the performance, cost, and reliability of API calls according to your specific business requirements.