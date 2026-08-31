---
head:
  - - meta
    - name: description
      content: ZenMux 模型与供应商
  - - meta
    - name: keywords
      content: ZenMux, 模型, 供应商, Anthropic, API
---

# 模型与供应商

ZenMux 使用多模型、多供应商的冗余架构来提高大语言模型服务的可用性与稳定性，并为开发者提供丰富的模型选择和灵活的调用方式。

## 模型目录

::: tip 快速查看
在网站的[模型页面](https://zenmux.ai/models)可以查看全部支持模型及其基础信息。使用左侧筛选、顶部搜索和排序功能可快速定位目标模型。
:::

## 多供应商架构

### 冗余与故障切换

多数大语言模型已接入多个供应商。当某个供应商发生服务故障时，ZenMux 会自动切换到其他可用供应商，保障调用连续性。有关策略详情，请参阅[供应商路由](/zh/about/provider-routing)。

### 供应商详情

以 `anthropic/claude-sonnet-4` 为例，打开模型卡片即可查看可用供应商：

- **Anthropic**：原厂 API。
- **Vertex AI**：Google Cloud 托管服务。
- **Amazon Bedrock**：AWS 托管服务。

## 供应商对比

模型详情页会展示各供应商的性能、价格、可用性等信息，便于选择最适合业务的调用通道。

| 指标 | 说明 |
| --- | --- |
| 延迟（首 Token 时间） | 从发出请求到收到第一个 Token 的时间。 |
| 吞吐量 | 每分钟可处理的 Token 数量。 |
| 可用性 | 实时服务状态与稳定性。 |
