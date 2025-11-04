# Sider 接入指南

Sider 是一款功能强大的浏览器 AI 助手插件，以侧边栏形式为用户提供便捷的 AI 服务。它支持多种 AI 功能，包括：写作、阅读、关于任何话题的聊天，甚至制作内容摘要。通过配置 ZenMux，可以使用更多模型选择，而不仅仅局限于 Sider 提供的基础模型。

## 配置步骤

### 1. 获取 ZenMux API Key

前往 [ZenMux 控制台](https://zenmux.ai/settings/keys) 中创建并获取您的 API Key。

### 2. 安装 Sider 插件

1. 在浏览器扩展商店搜索 "Sider"
2. 安装扩展并启用
3. 打开扩展“选项”页面

### 3. 配置 OpenAI 服务

::: tip 配置说明
只需要配置 OpenAI ，即可解锁 ZenMux 的所有模型。
:::

在Sider的设置中：

1. **选择自定义密钥**：通用配置 -> AI访问 -> 服务提供商 -> [Sider -> 自定义API密钥]
2. **选择服务提供商**：选择 `OpenAI`，点击设置
3. **设置Key**：输入 API Key
::: warning 重要提示
请确保选择 ZenMux 作为您的 API 提供商，而不是其他供应商。
:::
4. **设置API地址**：`https://zenmux.ai/api/v1`
5. **检查连接**：点击 “检查”，等待数秒后，显示：“连接成功”，配置完成

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/11/02/MUzNI3A/sider-openai-setting.png"
       alt="Sider OpenAI 设置 "
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

6. **使用**：在Sider的模型列表选择您需要的模型即可
<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/11/04/N1bvDth/sider-result.png"
       alt="Sider OpenAI 设置 "
       style="width: 100%; max-width: 400px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px auto;"
       loading="lazy" />
</div>

#### 4. 支持的模型
ZenMux 为 Sider 提供了丰富的模型选择，通过 [ZenMux 模型列表](https://zenmux.ai/models) 查看所有可用模型


## 故障排除

### 常见问题解决

::: details API Key 错误
**问题**：提示 连接失败。请检查您的API密钥和代理设置。

**解决方案**：

- 检查环境变量中的 ZenMux API Key 是否正确
- 确认 API Key 是否已激活且有足够余额
- 验证 API Key 格式是否以 `sk-ai-v1-` 开头
:::

::: details 代理URL设置错误
**问题**：提示 连接失败。请检查您的 API 密钥和代理设置。

**建议**：我们推荐您选择OpenAI，配置成功后您可以获取 ZenMux 能提供的所有模型支持，无需单独在 Sider 中配置其他模型。

**解决方案**：
- 确认是否选择 `OpenAI` 作为服务提供商
- 验证URL是否为： `https://zenmux.ai/api/v1` 

**其他模型连接**：

当然，我们也支持在 Sider 中通过部分其他模型配置以接入我们的模型服务，效果与直接接入 OpenAI 一致，您需要修改以下配置：

| 模型 | API代理URL | 
|----------|----------|
| **DeepSeek** | `https://zenmux.ai/api/v1`  |
| **Groq** | `https://zenmux.ai/api/v1` | 
| **Google (Gemini)** | `https://zenmux.ai/api/v1` | 
| **Anthropic (Claude)** | `https://zenmux.ai/api` | 

:::

::: details 模型列表不显示或不全
**问题**：Sider 中看不到 ZenMux 的完整模型列表

**解决方案**：

- 在 Sider 设置中重新保存 API 配置
- 点击模型列表右侧的 “Update list”，刷新列表
- 尝试点击右侧 “+”，添加 ZenMux 支持的模型
- 检查 ZenMux 控制台，确认 API Key 权限正常
- 联系 ZenMux 确认服务状态

::: tip 模型
通过 [ZenMux 模型列表](https://zenmux.ai/models) 查看所有可用模型
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
