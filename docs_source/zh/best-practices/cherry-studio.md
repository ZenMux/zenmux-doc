# Cherry Studio 接入指南

Cherry Studio 是一款优秀的 AI 对话客户端，支持多种 AI 模型提供商。通过配置 ZenMux，您可以在 Cherry Studio 中使用我们聚合的所有大语言模型。

## 准备工作

### 获取 ZenMux API Key

::: tip 获取 API Key
访问 [ZenMux 控制台](https://zenmux.ai/console) 注册账户并获取您的 API Key
:::

## 配置步骤

### 1. 打开 Cherry Studio 设置

1. 启动 Cherry Studio 客户端
2. 进入**设置页面**
3. 选择**模型提供商**选项
4. 点击**添加提供商**按钮

### 2. 配置 ZenMux 提供商

在提供商配置界面填写以下信息：

| 配置项 | 值 |
|-------|-----|
| **提供商名称** | ZenMux |
| **API 端点** | `https://zenmux.ai/api/v1` |
| **API Key** | 您的 ZenMux API Key |
| **模型格式** | OpenAI Compatible |

::: warning 注意事项
请确保 API Key 填写正确，并保持网络连接稳定
:::

### 3. 验证配置

配置完成后，Cherry Studio 将自动获取 ZenMux 支持的模型列表。您可以在模型选择器中看到以下类型的模型：

**Claude 系列**
- `anthropic/claude-sonnet-4`
- `anthropic/claude-haiku-3.5`

**GPT 系列**
- `openai/gpt-4o`
- `openai/gpt-4-turbo`

**Gemini 系列**
- `google/gemini-2.5-pro`
- `google/gemini-1.5-flash`

**其他模型**
- `meta-llama/llama-3.3-70b-instruct`

## 功能支持

### 完全支持

- **基础对话**：所有模型的文本对话功能
- **流式响应**：实时显示生成内容
- **上下文记忆**：支持多轮对话
- **模型切换**：可在对话中随时切换模型
- **参数调节**：温度、最大 Token 等参数自定义

### 部分支持

- **多模态输入**：支持图片上传（Claude、GPT-4V 等模型）
- **工具调用**：Function Calling 功能
- **结构化输出**：JSON 模式输出

## 使用建议

### 模型选择策略

::: tip 推荐配置
**日常对话**：`anthropic/claude-haiku-3.5` - 响应快速，成本较低  
**复杂任务**：`anthropic/claude-sonnet-4` - 推理能力强，输出质量高  
**代码开发**：`anthropic/claude-sonnet-4` 或 `openai/gpt-4o`  
**多模态任务**：`google/gemini-2.5-pro` - 图像理解能力出色
:::

### 成本优化建议

1. **合理选择模型**：根据任务复杂度选择合适的模型
2. **参数调优**：使用温度参数控制输出的创意性
3. **Token 限制**：设置合理的最大 Token 限制
4. **用量监控**：定期在 [ZenMux 控制台](https://zenmux.ai/console) 查看使用情况

## 故障排除

### 模型列表为空

**可能原因：**
- API Key 配置错误
- 网络连接问题
- API 端点地址填写错误

**解决方案：**
- 检查 API Key 是否正确
- 确认网络连接正常
- 验证 API 端点地址：`https://zenmux.ai/api/v1`

### 模型显示不可用

**可能原因：**
- 模型正在维护
- 账户余额不足
- 地区访问限制

**解决方案：**
- 访问 [ZenMux 控制台](https://zenmux.ai/console/usage) 查看账户状态
- 尝试切换到其他可用模型
- 联系技术支持获取帮助

### 获取详细错误信息

1. **Cherry Studio 日志**：查看客户端内的错误日志
2. **ZenMux 控制台**：访问 [API 调用详情](https://zenmux.ai/console/usage) 页面
3. **网络诊断**：检查网络连接和防火墙设置

## 获取支持

如果您在使用过程中遇到问题，可以通过以下方式获取支持：

- **邮件支持**：[support@zenmux.ai](mailto:support@zenmux.ai)
- **问题反馈**：[GitHub Issues](https://github.com/ZenMux/zenmux/issues)
- **帮助文档**：[常见问题解答](/zh/help/faq)

::: details 相关资源
- [ZenMux API 文档](/zh/api-reference)
- [模型支持列表](/zh/models)
- [定价说明](/zh/pricing)
:::