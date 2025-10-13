# 供应商路由

如 [模型与供应商](https://docs.zenmux.ai/zh/about/models-and-providers.html) 章节所述，针对同一模型，ZenMux 会智能路由选择合适的供应商进行调用，确保最佳的性能和可用性。通过 ZenMux 调用大模型时，开发者无需关心底层的供应商选择逻辑，只需指定模型名称即可。

## 默认路由策略

ZenMux 采用以下默认路由策略：

::: info 智能路由原则

1. **性能排序**：其他供应商按照首 Token 延时（Latency）从低到高排序
2. **智能切换**：如果原厂不可用，自动切换到其他供应商
   :::

这种策略确保了在保证性能的同时，最大化服务的可用性。

## 自定义路由策略

### 根据供应商的时延，价格或吞吐量进行路由

您可以通过在`provider.routing`中指定 `type` 为 `priority`来设置优先按照某个维度进行排序，通过`primary_factor`指定具体的维度，支持`latency`, `price`, `throughput`。维度说明如下:

| 维度             | 说明                                         | 
| ---------------- | -------------------------------------------- |
| **latency**      | 按照首 Token 延时（Latency）从低到高排序     |
| **price**        | 按照prompt和completion的综合价格从低到高排序 |
| **throughput**   | 按照吞吐量从高到低排序                       |

::: code-group

```json [请求示例]
{
  "model": "anthropic/claude-sonnet-4",
  "messages": [...],
  "provider": { // [!code highlight]
    "routing": { // [!code highlight]
      "type": "priority",
      "primary_factor": "price"
    }
  }
}
```

### 指定供应商列表

您可以通过在请求中指定 `provider` 参数来覆盖默认的路由策略：

::: code-group

```json [请求示例]
{
  "model": "anthropic/claude-sonnet-4",
  "messages": [...],
  "provider": { // [!code highlight]
    "routing": { // [!code highlight]
      "type": "order",
      "providers": [
        "anthropic/anthropic_endpoint",
        "google-vertex/VertexAIAnthropic",
        "amazon-bedrock/BedrockAnthropic"
      ]
    }
  }
}
```

:::

### 路由行为说明

通过指定 `providers` 列表，ZenMux 的路由行为如下：

- **顺序调用**：按照列表顺序依次尝试调用各个供应商
- **成功即停**：直到某个供应商成功返回结果为止
- **单一供应商**：如果只指定一个供应商，ZenMux 只会调用该供应商
- **错误处理**：如果指定的供应商返回错误，直接返回错误信息

::: warning 注意事项
使用自定义路由策略时，请确保指定的供应商确实支持所选模型，否则可能导致调用失败。
:::

## 获取供应商标识

要准确指定供应商，您需要获取正确的供应商 slug（标识符）。

### 获取方法

1. 访问 [模型详情页面](https://zenmux.ai/models)
2. 点击供应商名称旁的复制按钮
3. 复制准确的 slug 标识符，如 `anthropic/anthropic_endpoint`

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/j5hXtcH/provider-slug.png" 
       alt="供应商 slug 复制" 
       style="width: auto; max-width: 400px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); margin: 16px 0;"
       loading="lazy" />
</div>

::: tip 提示
确保使用正确的 slug 格式，通常为 `供应商名称/端点标识` 的形式。
:::

## 使用场景

自定义供应商路由策略适用于以下场景：

| 场景             | 说明                               | 示例                             |
| ---------------- | ---------------------------------- | -------------------------------- |
| **地理位置优化** | 选择地理位置更近的供应商以降低延时 | 亚太用户优先选择区域部署的供应商 |
| **成本控制**     | 优先选择价格更优的供应商           | 选择成本更低的第三方供应商       |
| **合规要求**     | 选择符合特定数据合规要求的供应商   | 金融机构选择符合监管要求的供应商 |
| **性能优化**     | 根据历史性能数据选择最佳供应商     | 选择延时更低的供应商             |
| **测试验证**     | 在开发测试中指定特定供应商进行验证 | A/B 测试不同供应商的表现         |

::: details 完整示例

```python
import requests

# 指定特定供应商的请求示例
response = requests.post(
    "https://zenmux.ai/api/v1/chat/completions",
    headers={
        "Authorization": "Bearer <你的_API_密钥>",
        "Content-Type": "application/json"
    },
    json={
        "model": "anthropic/claude-sonnet-4",
        "messages": [{"role": "user", "content": "Hello!"}],
        "provider": {  # [!code highlight]
            "routing": {  # [!code highlight]
                "type": "specified_providers",  # [!code highlight]
                "providers": ["anthropic/anthropic_endpoint"]  # [!code highlight]
            }
        }
    }
)

print(response.json())
```

:::

通过合理配置供应商路由策略，您可以根据具体业务需求优化 API 调用的性能、成本和可靠性。
