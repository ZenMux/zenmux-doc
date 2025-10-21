# 供应商路由

ZenMux 采用**多供应商**架构，针对同一模型配置多家供应商接入，通过智能路由选择合适的供应商进行调用，确保最佳的性能和可用性。通过 ZenMux 调用大模型时，开发者无需关心底层的供应商选择逻辑，只需指定模型名称即可。

## 为什么需要多供应商架构

在企业级 AI 应用中，单一供应商的架构存在诸多风险：

- **服务中断风险**：供应商故障导致业务停摆
- **性能波动问题**：不同供应商的延迟和吞吐量差异显著
- **成本优化困难**：缺乏灵活的供应商选择机制
- **地理位置限制**：单一供应商可能无法覆盖全球市场
- **合规性要求**：不同地区对数据存储和处理有不同规定

ZenMux 的多供应商架构从根本上解决这些问题，为您的 AI 应用提供企业级保障。

## 核心优势

### 高可用性保障

当某个供应商出现服务异常或容量不足时，ZenMux 会自动切换到其他可用供应商，确保服务连续性，无需人工干预。

**保障机制：**

- **实时健康检测**：持续监控所有供应商的服务状态
- **智能故障转移**：毫秒级切换到备用供应商
- **透明切换过程**：用户无感知的故障恢复
- **多层冗余设计**：主流模型配备 2-3 家供应商

详细的故障转移和模型兜底策略，请参考 [模型兜底文档](/zh/guide/advanced/fallback.html)。

### 性能优化

不同供应商在不同地理位置、不同时段的性能表现各异。ZenMux 通过智能路由策略，为每个请求选择最优供应商。

**性能优势：**

- **延迟优化**：首 Token 延迟作为重要权重进行供应商选择
- **吞吐量保障**：在高负载时动态调整供应商分配
- **全球加速**：结合 Cloudflare 边缘网络实现全球低延迟
- **实时监控**：持续跟踪性能指标，动态优化路由策略

### 成本控制灵活性

通过多供应商架构，您可以根据预算和性能需求灵活选择最合适的供应商。

**成本优化方式：**

- **价格对比透明**：实时展示各供应商的价格信息
- **灵活切换**：轻松在不同供应商之间切换以优化成本
- **按需路由**：通过供应商路由配置实现成本控制

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

```json [按首Token时延路由]
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
      "primary_factor": "latency" // [!code highlight]
    }
  }
}
```

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

## 如何查看供应商信息

### 模型详情页

点击任意模型卡片可进入该模型的详情页，在详情页中您可以查看：

- **供应商列表**：该模型支持的所有供应商
- **性能对比**：不同供应商的首 Token 延迟、吞吐量等性能指标
- **价格对比**：各供应商的所有计费项的详细价格
- **参数对比**：各供应商支持的参数
- **支持协议**：各供应商支持的调用协议（OpenAI API、Anthropic API 等）
- **可用性状态**：实时显示各供应商的服务状态
- **供应商 Slug**：用于供应商路由配置的标识符

::: info 模型详情页示例
例如访问 [Claude Sonnet 4 详情页](https://zenmux.ai/anthropic/claude-sonnet-4)，可以看到该模型在 Anthropic、Google Vertex、Amazon Bedrock 等供应商的完整对比信息。
:::

![Model Details](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/21/nYt8yU9/model-details.png)

### 供应商详情页

此外，您还可以通过供应商详情页查看该供应商支持的所有模型：

- **模型列表**：该供应商接入的所有模型
- **用量统计**：该供应商的接入所有模型的用量统计数据

::: info 供应商详情页示例
例如访问 [Anthropic 供应商页面](https://zenmux.ai/providers/anthropic)，可以看到该供应商提供的所有 Claude 模型及其详细信息。
:::

![Provider Details](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/21/iYwxXFg/provider-analysis.png)

通过模型详情页和供应商详情页，您可以全面了解各个模型和供应商的特性，做出最适合您业务需求的选择。

## 常见问题

### Q: 如何查看某次调用使用了哪个供应商？

A: 在 [ZenMux 控制台](https://zenmux.ai/settings/activity)的调用日志中可以查看每次请求的详细信息，包括使用的模型和供应商。

![调用日志示例](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/21/EClzQU6/logs-provider-model.png)

### Q: 自动切换供应商会影响输出一致性吗？

A: 同一模型在不同供应商的输出通常是一致的，因为它们使用相同的底层模型权重。但某些供应商可能有轻微的响应时间差异。

### Q: 多供应商架构会增加延迟吗？

A: 不会。ZenMux 的路由决策在毫秒级完成，对总体延迟的影响可以忽略不计。反而通过智能选择低延迟供应商，可以降低总体响应时间。

::: tip 联系我们
如果您在使用过程中遇到任何问题，或有任何建议和反馈，欢迎通过以下方式联系我们：

- **官方网站**：<https://zenmux.ai>
- **技术支持邮箱**：[support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**：[bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**：[@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**：<http://discord.gg/vHZZzj84Bm>

更多联系方式和详细信息，请访问我们的[联系我们页面](/zh/help/contact)。
:::
