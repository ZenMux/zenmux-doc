---
head:
  - - meta
    - name: description
      content: ZenMux 供应商路由
  - - meta
    - name: keywords
      content: ZenMux, 供应商, 路由, Anthropic, Claude, API
---

# 供应商路由

同一个模型可能由多个供应商提供。ZenMux 会在这些供应商之间智能路由，以兼顾可用性与性能；调用时通常只需指定模型名称。有关模型与供应商的关系，请参阅[模型与供应商](/zh/about/models-and-providers)。

## 默认路由策略

ZenMux 的默认策略遵循以下原则：

1. **优先原厂**：优先使用模型原始开发者的服务，例如 Claude 优先 Anthropic。
2. **自动故障切换**：原厂不可用时自动尝试其他可用供应商。
3. **性能排序**：其他供应商按首 Token 延迟从低到高排序。

该策略在尽可能维持性能的同时提高调用可用性。

## 自定义路由策略

如需覆盖默认策略，可在请求中指定 `provider_routing_strategy`：

::: code-group

```json [请求示例]
{
  "model": "anthropic/claude-sonnet-4",
  "messages": [...],
  "provider_routing_strategy": {
    "type": "specified_providers",
    "providers": [
      "anthropic/anthropic_endpoint",
      "google-vertex/VertexAIAnthropic",
      "amazon-bedrock/BedrockAnthropic"
    ]
  }
}
```

:::

指定 `providers` 后，ZenMux 将按数组顺序依次尝试供应商，在第一个成功响应后停止。仅指定一个供应商时只会调用该供应商；指定供应商返回错误时，错误会直接返回。

::: warning 注意
请确认指定的供应商支持所选模型，否则请求可能失败。
:::

## 获取供应商标识

自定义路由需要使用准确的 provider slug：

1. 打开 [模型详情页](https://zenmux.ai/models)。
2. 点击供应商名称旁的复制按钮。
3. 使用复制出的完整标识，例如 `anthropic/anthropic_endpoint`。

通常 slug 的格式为 `provider-name/endpoint-identifier`。

## 适用场景

| 场景 | 说明 |
| --- | --- |
| 地域优化 | 优先选择离用户更近的部署区域以降低延迟。 |
| 成本控制 | 优先指定价格更合适的供应商。 |
| 合规要求 | 选择满足数据合规要求的供应商。 |
| 性能优化 | 根据历史延迟和吞吐量选择供应商。 |
| 测试验证 | 在开发或 A/B 测试时固定调用目标供应商。 |

::: details 完整 Python 示例

```python
import requests

response = requests.post(
    "https://zenmux.ai/api/v1/chat/completions",
    headers={
        "Authorization": "Bearer <your_api_key>",
        "Content-Type": "application/json",
    },
    json={
        "model": "anthropic/claude-sonnet-4",
        "messages": [{"role": "user", "content": "Hello!"}],
        "provider_routing_strategy": {
            "type": "specified_providers",
            "providers": ["anthropic/anthropic_endpoint"],
        },
    },
)

print(response.json())
```

:::
