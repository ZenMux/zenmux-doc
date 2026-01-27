---
head:
  - - meta
    - name: description
      content: Dify 接入指南
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, dify, OpenAI, API
---

# Dify 接入指南

Dify 是一款开源的大语言模型（LLM）应用开发平台。它融合了后端即服务（Backend as Service）和 LLMOps 的理念，使开发者可以快速搭建生产级的生成式 AI 应用。通过配置 ZenMux，可以使用更多模型选择，而不仅仅局限于 Dify 提供的基础模型。

## 配置步骤

### 1. 获取 ZenMux API Key

前往 [ZenMux 控制台](https://zenmux.ai/settings/keys) 中创建并获取您的 API Key。

### 2. 打开 Dify 官网

1. 打开 [Dify 官网](https://dify.ai)
2. 点击 Get Started 按钮并登陆
3. 点击右上角个人头像，选择 Settings -> Model Provider

### 3. 配置 OpenAI-API-compatible 服务

::: tip 配置说明
只需要配置 OpenAI-API-compatible ，即可解锁 ZenMux 的所有模型。
:::

在 Dify 的设置中：

1. **选择 OpenAI-API-compatible**：搜索并选择 OpenAI-API-compatible

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/11/05/SLSYOoV/dify2.png"
       alt=""
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

2. **添加模型**：点击 Add Model，添加您想要的模型，并输入相关信息

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/11/05/QPFcKXA/dify1.png"
       alt=""
       style="width: 100%; max-width: 400px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

3. **新建 Chatbot**：新建 Chatbot，并在右上角模型列表选择您需要的模型即可
<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/11/05/4N1gOdB/dify4.png"
       alt=""
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

#### 4. 支持的模型

ZenMux 为 Dify 提供了丰富的模型选择，通过 [ZenMux 模型列表](https://zenmux.ai/models) 查看所有可用模型

## 故障排除

### 常见问题解决

::: details API Key 错误
**问题**：提示 API Key 无效或未授权

**解决方案**：

- 检查您输入的 ZenMux API Key 是否正确
- 确认 API Key 是否已激活且有足够余额
- 验证 API Key 格式是否以 `sk-ai-v1-` 开头
  :::

## 联系我们

如果您在使用过程中遇到任何问题，或有任何建议和反馈，欢迎通过以下方式联系我们：

::: tip 获取帮助

- **官方网站**：<https://zenmux.ai>
- **技术支持邮箱**：[support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**：[bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**：[@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**：<http://discord.gg/vHZZzj84Bm>

更多联系方式和详细信息，请访问我们的[联系我们页面](/zh/help/contact)。
:::
