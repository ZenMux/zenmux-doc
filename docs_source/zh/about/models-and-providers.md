# 模型与供应商

ZenMux 采用多模型、多供应商的冗余架构，确保大语言模型服务的高可用性和稳定性。我们整合了业界顶尖的大语言模型，为开发者提供丰富的选择和灵活的使用体验。

## 模型列表

::: tip 快速查看
在控制台的 **Models** 界面可查看所有支持的模型及其基本信息
:::

控制台模型页面展示了以下关键信息：
- 模型名称和版本
- 支持的供应商数量
- 性能指标概览
- 实时可用状态

![模型列表页面](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/21/iAG4cry/models-page.png)

## 多供应商架构

### 冗余保障

每个大语言模型都配置了多家供应商接入，当某个供应商出现服务异常时，ZenMux 会自动切换到其他可用供应商，确保服务连续性。

### 供应商详情

以 `anthropic/claude-sonnet-4` 模型为例，点击模型卡片可查看详细信息：

**支持的供应商：**
- **Anthropic** - 原厂官方接口
- **Vertex AI** - Google Cloud 托管服务
- **Amazon Bedrock** - AWS 托管服务

![模型详情页面](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/21/vrmIq6I/model-details.png)

## 供应商对比信息

::: warning 注意差异
同一模型的不同供应商在配置、性能和服务质量方面可能存在差异，会影响实际使用体验
:::

在模型详情页面可对比查看各供应商的详细信息：

### 基本参数
- **上下文窗口**：支持的最大 Token 长度
- **功能支持**：工具调用、多模态等特性
- **API 兼容性**：OpenAI 格式兼容程度

### 性能指标
| 指标 | 说明 |
|-----|------|
| **首 Token 延时** | 从请求到返回第一个 Token 的时间 |
| **吞吐量** | 每分钟处理的 Token 数量 |
| **可用性** | 实时服务状态和稳定性 |

### 价格对比
- **输入 Token** 费用
- **输出 Token** 费用  
- **特殊功能** 额外收费（如图像理解、工具调用等）

::: details 查看定价详情
完整的价格信息请参考 [定价页面](https://zenmux.ai/pricing)
:::

## 智能路由机制

### 自动选择最优供应商

ZenMux 会根据以下因素自动选择最适合的供应商：

1. **实时性能**：延时和吞吐量指标
2. **服务状态**：供应商可用性
3. **负载均衡**：分散请求压力
4. **成本优化**：在满足性能要求下选择性价比最高的选项

### 透明化体验

开发者无需关心底层的供应商选择逻辑，只需指定模型名称即可：

::: code-group

```python [Python]
response = client.chat.completions.create(
    model="anthropic/claude-sonnet-4",  # [!code highlight]
    messages=[{"role": "user", "content": "Hello!"}]
)
```

```curl [cURL]
curl https://zenmux.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

:::

::: info 高级配置
如需指定特定供应商或自定义路由策略，请参考 [供应商路由](./provider-routing.md) 文档
:::