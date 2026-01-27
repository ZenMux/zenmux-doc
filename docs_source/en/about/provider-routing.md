---
head:
  - - meta
    - name: description
      content: Provider Routing
  - - meta
    - name: keywords
      content: Zenmux, about, provider, routing, Anthropic, Claude, API
---

# Provider Routing

As described in [Models and Providers](https://docs.zenmux.ai/zh/about/models-and-providers.html), for the same model, ZenMux intelligently routes requests to the most suitable provider to ensure optimal performance and availability. When invoking LLMs through ZenMux, developers don’t need to worry about the underlying provider selection logic—simply specify the model name.

## Default Routing Strategy

ZenMux uses the following default routing strategy:

::: info Intelligent Routing Principles

1. Priority to the original: Prefer the model’s original developer (e.g., Claude prefers Anthropic)
2. Smart failover: If the original is unavailable, automatically switch to other providers
3. Performance ordering: Other providers are sorted by first-token latency from low to high
   :::

This strategy ensures maximum service availability while maintaining optimal performance.

## Custom Routing Strategy

### Specify Provider List

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

When you provide a `providers` list, ZenMux routes as follows:

- Sequential attempts: Try providers in the listed order
- Stop on first success: Stop as soon as a provider returns successfully
- Single provider: If only one provider is specified, ZenMux will only call that provider
- Error handling: If a specified provider returns an error, the error is returned directly

::: warning Notes
When using a custom routing strategy, ensure that the specified providers actually support the chosen model; otherwise, the call may fail.
:::

## Get Provider Identifier

To specify a provider accurately, you need the correct provider slug (identifier).

### How to find it

1. Visit the [Model Details page](https://zenmux.ai/models)
2. Click the copy button next to the provider name
3. Copy the exact slug identifier, such as `anthropic/anthropic_endpoint`

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/j5hXtcH/provider-slug.png" 
       alt="Copy provider slug" 
       style="width: auto; max-width: 400px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); margin: 16px 0;"
       loading="lazy" />
</div>

::: tip Tip
Make sure you use the correct slug format, typically `provider-name/endpoint-identifier`.
:::

## Use Cases

A custom provider routing strategy is suitable for the following scenarios:

| Scenario              | Description                                  | Example                                   |
| --------------------- | -------------------------------------------- | ----------------------------------------- |
| Geographic optimization | Choose geographically closer providers to reduce latency | APAC users prefer regionally deployed providers |
| Cost control          | Prefer providers with better pricing         | Choose lower-cost third-party providers   |
| Compliance requirements | Choose providers that meet specific data compliance needs | Financial institutions selecting compliant providers |
| Performance optimization | Choose the best provider based on historical performance data | Choose providers with lower latency       |
| Testing and validation | Specify certain providers during development/testing | A/B test the performance of different providers |

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

By properly configuring the provider routing strategy, you can optimize API call performance, cost, and reliability to meet your specific business needs.