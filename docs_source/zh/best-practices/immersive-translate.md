---
head:
  - - meta
    - name: description
      content: 沉浸式翻译接入指南
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, immersive, translate, OpenAI, API
---

# 沉浸式翻译接入指南

沉浸式翻译（Immersive Translate）是一款优秀的双语对照翻译扩展，支持网页、PDF、EPub 等多种格式的翻译。通过配置 ZenMux，您可以使用我们聚合的高质量翻译模型来提升翻译体验。

## 配置步骤

### 1. 获取 ZenMux API Key

前往 [ZenMux 控制台](https://zenmux.ai/console) 注册账户并获取您的 API Key。

::: tip 快速开始
仅需几分钟即可完成配置，立即体验高质量的多模型翻译服务
:::

### 2. 安装沉浸式翻译

1. 在浏览器扩展商店搜索"沉浸式翻译"
2. 安装扩展并启用
3. 打开扩展设置页面

### 3. 配置 OpenAI 服务

在沉浸式翻译的设置中：

1. **选择翻译服务**：选择"OpenAI"
2. **填写配置信息**：

| 配置项              | 值                                                      |
| ------------------- | ------------------------------------------------------- |
| **API Key**         | 您的 ZenMux API Key                                     |
| **自定义 API 地址** | `https://zenmux.ai/api/v1`                              |
| **模型**            | `anthropic/claude-3-5-sonnet-20241022` 或其他支持的模型 |