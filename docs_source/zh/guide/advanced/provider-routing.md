# 供应商路由

如 [模型与供应商](/zh/about/models-and-providers.html) 章节所述，针对同一模型，ZenMux 会智能路由选择合适的供应商进行调用，确保最佳的性能和可用性。通过 ZenMux 调用大模型时，开发者无需关心底层的供应商选择逻辑，只需指定模型名称即可。

## 默认路由策略

ZenMux 采用以下默认路由策略：

::: info 智能路由原则

1. **性能优先**：按照首 Token 延迟（Latency）从低到高排序
2. **智能切换**：如果原厂不可用，自动切换到其他供应商

:::

这种策略在保证性能的同时，最大化了服务的可用性。

## 指定供应商的简单方式

ZenMux 提供了一种简单直接的供应商配置方式——**模型名称后缀语法**。无需使用单独的 `provider` 配置字段，您可以直接在模型名称中指定供应商。

### 语法格式

```text
model_slug:provider_slug
```

### 使用示例

::: info 模型 Slug 获取说明
ZenMux 平台的模型具备唯一 Slug，您可以通过[模型列表页](https://zenmux.ai/models)获取对应模型的 Slug:
![model-slug](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/21/AQG0SIr/model-slug.png)
或者[某个模型的模型详情页](https://zenmux.ai/anthropic/claude-sonnet-4.5)获取对应模型的 Slug:
![model-slug](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/21/dWYxJnq/model-slug-3.png)
:::

::: info 供应商 Slug 获取说明
ZenMux 平台的模型供应商具备唯一 Slug，您可以通过[模型详情页](https://zenmux.ai/anthropic/claude-sonnet-4.5)获取对应模型供应商的 Slug:
![provider-slug](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/21/98Gc7hL/provider-slug.png)
:::

例如，如果要将 Claude 3.7 Sonnet 锁定到 AWS Bedrock 供应商，只需使用：

```text
anthropic/claude-3.7-sonnet:amazon-bedrock
```

`:amazon-bedrock` 后缀告诉 ZenMux 将请求专门路由到指定的供应商，无需额外配置。

::: code-group

```json [JSON 请求]
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
    api_key="<你的_API_密钥>"
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

### 优势特点

| 特点         | 说明                                   |
| ------------ | -------------------------------------- |
| **简洁直观** | 直接在模型名称中指定，无需额外配置字段 |
| **API 兼容** | 完全兼容 OpenAI SDK 的标准参数结构     |
| **快速切换** | 只需修改模型名称即可切换供应商         |
| **清晰明确** | 一目了然地看出正在使用哪个供应商       |

::: tip 💡 最佳实践
对于大多数场景，推荐使用模型名称后缀语法来指定供应商，这是最简单直接的方式。如果需要更复杂的路由策略（如多供应商回退、动态优先级等），可以使用下文介绍的高级路由配置。
:::

## 高级路由配置

对于需要更精细控制的场景，ZenMux 提供了完整的 `provider` 配置能力。

### 按性能指标路由

您可以通过 `provider.routing` 配置，指定按照特定性能维度进行供应商排序。

#### 支持的路由维度

| 维度           | 说明                                            |
| -------------- | ----------------------------------------------- |
| **latency**    | 按照首 Token 延迟（Latency）从低到高排序        |
| **price**      | 按照综合价格（Prompt + Completion）从低到高排序 |
| **throughput** | 按照吞吐量从高到低排序                          |

#### 配置示例

::: code-group

```json [按价格路由]
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

```json [按吞吐量路由]
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

### 指定供应商列表

您可以明确指定供应商列表及其调用顺序，实现自定义的回退机制。

::: code-group

```json [指定供应商顺序]
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

```python [Python SDK 示例]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<你的_API_密钥>"
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

#### 路由行为说明

通过指定 `providers` 列表，ZenMux 的路由行为如下：

- **顺序调用**：按照列表顺序依次尝试调用各个供应商
- **成功即停**：直到某个供应商成功返回结果为止
- **单一供应商**：如果只指定一个供应商，ZenMux 只会调用该供应商
- **错误处理**：如果指定的供应商返回错误，直接返回错误信息

::: warning ⚠️ 注意事项
使用自定义路由策略时，请确保指定的供应商确实支持所选模型，否则可能导致调用失败。
:::

## 使用场景

不同的路由策略适用于不同的业务场景：

| 场景               | 推荐方式               | 说明                               |
| ------------------ | ---------------------- | ---------------------------------- |
| **锁定单一供应商** | 模型名称后缀语法       | 简单直接，适合生产环境固定供应商   |
| **地理位置优化**   | 指定供应商列表         | 选择地理位置更近的供应商以降低延迟 |
| **成本控制**       | 按价格路由             | 优先选择价格更优的供应商           |
| **性能优化**       | 按延迟或吞吐量路由     | 根据性能指标动态选择最佳供应商     |
| **高可用保障**     | 指定供应商列表（多个） | 多供应商回退机制，确保服务连续性   |
| **合规要求**       | 锁定特定供应商         | 选择符合数据合规要求的供应商       |
| **测试验证**       | 灵活切换               | A/B 测试不同供应商的表现           |

::: details 📋 完整示例

```python
import requests

# 示例 1: 使用模型名称后缀语法（推荐）
response_1 = requests.post(
    "https://zenmux.ai/api/v1/chat/completions",
    headers={
        "Authorization": "Bearer <你的_API_密钥>",
        "Content-Type": "application/json"
    },
    json={
        "model": "anthropic/claude-sonnet-4:anthropic",  # [!code highlight]
        "messages": [{"role": "user", "content": "Hello!"}]
    }
)

# 示例 2: 使用高级路由配置
response_2 = requests.post(
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

通过合理配置供应商路由策略，您可以根据具体业务需求优化 API 调用的性能、成本和可靠性。

::: tip 联系我们
如果您在使用过程中遇到任何问题，或有任何建议和反馈，欢迎通过以下方式联系我们：

- **官方网站**：<https://zenmux.ai>
- **技术支持邮箱**：[support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**：[bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**：[@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**：<http://discord.gg/vHZZzj84Bm>

更多联系方式和详细信息，请访问我们的[联系我们页面](/zh/help/contact)。
:::
