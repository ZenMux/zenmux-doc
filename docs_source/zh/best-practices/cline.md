---
head:
  - - meta
    - name: description
      content: 通过 ZenMux 使用 Cline 指南
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, cline, OpenAI, API
---

# 通过 ZenMux 使用 Cline 指南

_Cline_ 是一款用于复杂工作的协作式编程智能体，通过与 ZenMux 的集成，您可以获得更多强大模型的支持，提升开发效率。

::: info 兼容性说明
ZenMux 完全支持 OpenAI API 协议，只需简单配置即可使用。

注意 OpenAI 协议的 base_url="https://zenmux.ai/api/v1"。
:::

## 安装 Cline

Cline 支持多种开发工具，如 Visual Studio Code, JetBrains IDEs 等，您可以根据自己的工具选择对应的安装方法.
具体可以参考 Cline 的官方文档

::: tip 参考
[Cline 官方文档](https://docs.cline.bot/getting-started/installing-cline)
:::

## 配置 Cline

1. 点击 VSCode 左侧 Cline 图标, 打开 Cline 面板。
2. 点击面板右上角设置图标 ⚙️。
3. 在 API Configuration 标签页中:

- API Provider 选择 OpenAI Compatible
- Base URL 中填入 https://zenmux.ai/api/v1
- OpenAI Compatible API Key 填入 ZenMux API Key
- Model ID 填入 ZenMux 的模型 slug，如 anthropic/claude-3.7-sonnet

4. 点击右上角 Done 按钮完成配置。

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/11/05/AtyK3Ah/Cline.png"
       alt="Cline 配置"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

## 开始使用

配置完成之后，即可开始使用 Cline。ZenMux 为 Cline 提供了丰富的模型支持，可以在我们的[官网模型列表](https://zenmux.ai/models)选择想要使用的模型填入 Model ID。

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/11/05/z6PG9xI/Cline_chat.png"
       alt="Cline 使用效果"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

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
