# 模型与供应商

ZenMux 采用多模型、多供应商的冗余架构，确保大语言模型服务的高可用性和稳定性。我们整合了业界顶尖的大语言模型，为开发者提供丰富的选择和灵活的使用体验。

## 模型列表

::: tip 快速查看
在官网的 **Models** 界面可查看所有支持的模型及其基本信息，可通过左侧的筛选条件、顶部的搜索框、排序选项等快速定位所需模型。
:::

![模型列表页面](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/21/iAG4cry/models-page.png)

## 多供应商架构

### 冗余保障

大多数大语言模型都配置了多家供应商接入，当某个供应商出现服务异常时，ZenMux 会自动切换到其他可用供应商，确保服务连续性。

供应商路由的详细策略请参考 [供应商路由文档](https://docs.zenmux.ai/zh/about/provider-routing.html)

### 供应商详情

以 `anthropic/claude-sonnet-4` 模型为例，点击模型卡片可查看详细信息：

**支持的供应商：**

- **Anthropic** - 原厂官方接口
- **Vertex AI** - Google Cloud 托管服务
- **Amazon Bedrock** - AWS 托管服务

![模型详情页面](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/21/vrmIq6I/model-details.png)

## 供应商对比信息

在模型详情页面可对比查看各供应商的详细信息，包括性能指标、价格、可用性等方面。

### 性能指标说明

| 指标              | 说明                            |
| ----------------- | ------------------------------- |
| **首 Token 延时** | 从请求到返回第一个 Token 的时间 |
| **吞吐量**        | 每分钟处理的 Token 数量         |
| **可用性**        | 实时服务状态和稳定性            |
