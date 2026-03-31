# 🚀 ZenMux 接入 Cursor 指南

## 注意事项

请注意，随着 Cursor 官方的版本更新和策略调整，**目前在 Cursor 中配置和使用自定义模型（Custom Models）及第三方 API（如 ZenMux），通常需要开通 Cursor Pro 订阅。**

如果您在配置完成后依然不断提示升级 Pro 或只能使用 `auto`，这并非您的 ZenMux 配置有误，而是 Cursor 官方客户端的强制商业化限制。

## 第一步：准备你的 ZenMux API Key

1. 登录 [ZenMux 控制台](https://zenmux.ai/platform/pay-as-you-go)。
2. 生成并复制你的 API Key（注意：ZenMux 的密钥格式通常是以 `sk-ai-v1-` 开头的）。

## 第二步：配置 Cursor 基础设置（最关键的一步）

1. 打开 Cursor，点击右上角（或右下角）的齿轮 ⚙️ 进入 **Settings (设置)**。
2. 在左侧菜单点击 **Models (模型)**。
3. 向下滚动到 **OpenAI API Key** 区域：
   - 打开开关（变成绿色）。
   - 在输入框里粘贴你的 ZenMux API Key（`sk-ai-v1-...`）。
4. 向下滚动到 **Override OpenAI Base URL** 区域：
   - 打开开关（变成绿色）。
   - 在输入框里严格填入：`https://zenmux.ai/api/v1`

## 第三步：添加 ZenMux 专属模型名称

1. 还在 **Models** 页面，找到 `+ Add Custom Model`（添加自定义模型）。
2. 根据 ZenMux 文档推荐，添加你需要的模型名称
3. 添加完成后，确保这几个新模型**右侧的开关是打开的（变成绿色）**。

## 第四步：在聊天框中测试

1. 关闭设置，按快捷键 `Ctrl + L` (Windows) 或 `Cmd + L` (Mac) 打开右侧聊天面板。
2. 在输入框下方（或上方）的模型选择下拉菜单中，**选择你刚刚添加的完整名称**
3. 发送一句测试消息，例如：“你好，请告诉我你是什么模型？”。

---

### ❓ 常见故障排除 (Troubleshooting)

- **问题 1：发消息后报错，提示 API Key 错误或连不上？**
  - **检查 Key**：确保密钥是完整的 `sk-ai-v1-...`，没有复制多余的空格。
  - **检查 URL**：确保 Base URL 后面没有多加斜杠，严格是 `https://zenmux.ai/api/v1`。
- **问题 2：提示模型不存在 (Model not found)？**
  - **解决**：说明该模型名称拼写错误，或者 ZenMux 暂时下线了该模型。请访问 [ZenMux 官方模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=responses) 复制最新的可用模型 slug 名称。
- **问题 3：GPT 系列模型报错 `Parameter messages is required`？**
  - **现象**：调用 `openai/gpt-*` 系列模型时，返回 `400` 错误：`{"error":{"code":"400","type":"invalid_params","message":"Parameter messages is required"}}`。
  - **原因**：Cursor 会使用 OpenAI 的 **Responses API** 格式数据发送到标准的 **Chat Completion API** 接口，导致请求体格式不符合预期。
  - 目前该问题暂无有效的解决方法。建议关注 Cursor 的更新公告，等待兼容性修复或暂时使用其他模型作为替代。
- **问题 4：Claude 系列模型报错 `unsupported tool definition`？**
  - **现象**：调用 `anthropic/claude-*` 系列模型时，返回 `400` 错误：`{"error":{"code":"400","type":"invalid_params","message":"unsupported tool definition"}}`。
  - **原因**：Cursor 在所有模式（包括 Ask 模式和 Agent 模式）下都会向模型传递工具定义（Tool Definition），这与**Chat Completion API** 接口的工具格式规范不符。
  - 目前该问题暂无有效的解决方法。建议关注 Cursor 的更新公告，等待兼容性修复或暂时使用其他模型作为替代。

::: tip 联系我们
如果您在使用过程中遇到任何问题，或有任何建议和反馈，欢迎通过以下方式联系我们：

- **官方网站**：<https://zenmux.ai>
- **技术支持邮箱**：[support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**：[bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**：[@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**：<http://discord.gg/vHZZzj84Bm>

更多联系方式和详细信息，请访问我们的[联系我们页面](/zh/help/contact)。
:::
