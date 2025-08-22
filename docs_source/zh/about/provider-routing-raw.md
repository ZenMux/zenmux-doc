# 供应商路由

如 [模型与供应商](./models-and-providers.md) 章节所述，针对同一模型，ZenMux 会智能路由选择合适的供应商进行调用，确保最佳的性能和可用性。

## 默认路由策略

ZenMux 采用以下默认路由策略：

1. **优先原厂**：优先选择模型的原开发厂商（如 Claude 优先选择 Anthropic）
2. **智能降级**：如果原厂不可用，自动切换到其他供应商  
3. **性能排序**：其他供应商按照首 Token 延时（Latency）从低到高排序

这种策略确保了在保证性能的同时，最大化服务的可用性。

## 自定义路由策略

### 指定供应商列表

用户可以通过在请求中指定 `provider_routing_strategy` 参数来覆盖默认的路由策略：

```json
{
  "model": "anthropic/claude-sonnet-4",
  "messages": [...],
  "provider_routing_strategy": {
    "type": "specified_providers",
    "providers": [
      "anthropic/ahtnropic_endpoint", 
      "google-vertex/VertexAIAnthropic", 
      "amazon-bedrock/BedrockAnthropic"
    ]
  }
}
```

### 路由行为说明

通过指定 `providers` 列表，ZenMux 的路由行为如下：

- **顺序调用**：按照列表顺序依次尝试调用各个供应商
- **成功即停**：直到某个供应商成功返回结果为止
- **单一供应商**：如果只指定一个供应商，ZenMux 只会调用该供应商
- **错误处理**：如果指定的供应商返回错误，直接返回错误信息

::: warning ⚠️ 注意事项
使用自定义路由策略时，请确保指定的供应商确实支持所选模型，否则可能导致调用失败。
:::

## 获取供应商标识

要准确指定供应商，您需要获取正确的供应商 slug（标识符）。可以通过以下方式获取：

1. 在模型详情页面，点击供应商名称旁的复制按钮
2. 复制准确的 slug 标识符，如 `anthropic/ahtnropic_endpoint`

![供应商 slug 复制](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/j5hXtcH/provider-slug.png)

## 使用场景

自定义供应商路由策略适用于以下场景：

- **地理位置优化**：选择地理位置更近的供应商以降低延时
- **成本控制**：优先选择价格更优的供应商
- **合规要求**：选择符合特定数据合规要求的供应商
- **性能优化**：根据历史性能数据选择最佳供应商
- **测试验证**：在开发测试中指定特定供应商进行验证
