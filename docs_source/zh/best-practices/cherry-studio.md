---
head:
  - - meta
    - name: description
      content: 通过 ZenMux 使用 Cherry Studio 指南
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, cherry, studio, OpenAI, API
---

# 通过 ZenMux 使用 Cherry Studio 指南

Cherry Studio 是一款优雅的跨平台 AI 桌面客户端,支持多种主流大语言模型服务。通过与 ZenMux 的集成,您可以在 Cherry Studio 中访问 ZenMux 平台上聚合的海量模型资源,享受更灵活的模型选择和更优惠的价格。

::: info 兼容性说明
ZenMux 完全支持 OpenAI Chat Completions 协议,可以无缝集成到 Cherry Studio 等支持自定义 OpenAI 兼容端点的客户端中。只需添加 ZenMux 作为模型提供商,即可使用所有支持 OpenAI 协议的模型。

注意 OpenAI 协议的 base_url 为 `https://zenmux.ai/api/v1/`。
:::

## 配置方案

### 步骤 1：下载并安装 Cherry Studio

前往 [Cherry Studio 官网](https://www.cherry-ai.com) 下载适合您操作系统的版本并完成安装。

### 步骤 2：添加 ZenMux 模型提供商

1. 打开 Cherry Studio,进入 **Settings → Model Provider** 界面

2. 点击 **Add** 按钮添加新的模型提供商

3. 在弹出的配置窗口中填写以下信息:

   - **Provider Name**: `ZenMux` (或您偏好的名称)
   - **Provider Type**: 选择 `OpenAI`
   - **API Key**: 填入您的 ZenMux API Key (格式为 `sk-ai-v1-xxx`)
   - **API Host**: `https://zenmux.ai/api/v1/`

![添加 ZenMux 提供商](https://github.com/user-attachments/assets/fee04a31-9f24-4c42-9ba6-6f0e1df03f92)
![填写提供商信息](https://github.com/user-attachments/assets/6cd9c0fa-2c79-4c7e-8b6d-7438437ad8cb)
![拉取模型列表](https://github.com/user-attachments/assets/01e220cf-a9c0-4b35-95a8-e20609a92d8e)
::: warning 重要配置
请确保将 `sk-ai-v1-xxx` 替换为您的真实 ZenMux API Key。您可以在 [ZenMux 控制台](https://zenmux.ai/settings/keys) 中获取 API Key。
:::

::: tip 配置说明

- **Provider Name**: 自定义名称,建议使用 `ZenMux` 便于识别
- **Provider Type**: 必须选择 `OpenAI`,因为 ZenMux 支持 OpenAI Chat Completions 协议
- **API Key**: 您的 ZenMux API Key,用于身份认证和计费
- **API Host**: ZenMux OpenAI 兼容端点地址,必须以 `/` 结尾

:::

### 步骤 3：拉取可用模型列表

配置完成后,点击 **Manager** 按钮,Cherry Studio 会自动从 ZenMux 拉取所有支持 OpenAI Chat Completions 协议的模型列表。

::: info 模型发现
Cherry Studio 会通过 ZenMux 的 `/v1/models` API 端点自动发现所有可用模型,无需手动添加。
:::

### 步骤 4：添加需要使用的模型

从拉取到的模型列表中,选择您需要使用的模型并添加到您的模型库中。

![添加模型](https://github.com/user-attachments/assets/b5a8cb9a-9d20-47f3-8b86-9a79855a819c)

::: tip 模型推荐
建议添加不同能力和价格层级的模型,以适应不同使用场景:

- **高性能模型**: `openai/gpt-5`、`anthropic/claude-sonnet-4.5`
- **均衡模型**: `google/gemini-2.5-pro`、`x-ai/grok-4-fast`
- **高性价比模型**: `deepseek/deepseek-chat`、`qwen/qwen3-coder-plus`

:::

### 步骤 5：开始对话

前往聊天界面,选择 ZenMux 提供商下的任意模型,即可开始使用。

![选择模型开始对话](https://github.com/user-attachments/assets/7c4086fc-ee7a-4e04-9a57-f702b5d7d3e4)

::: info 模型切换
您可以在对话过程中随时切换不同的模型,Cherry Studio 会保留对话历史,方便您比较不同模型的表现。
:::

## 支持的模型

::: info OpenAI 协议支持模型说明
ZenMux 平台上支持 OpenAI Chat Completions 协议的模型数量众多且持续增加。您可以通过以下方式查看完整的支持列表:

- 访问 [ZenMux 模型列表](https://zenmux.ai/models) 并筛选 "OpenAI API Compatible"
- 或访问具体模型的详情页面,查看其协议支持情况

:::

::: tip 查看更多模型
访问 [ZenMux 模型列表](https://zenmux.ai/models) 了解所有可用模型及其详细信息,包括定价、上下文长度、功能特性等。
:::

## 使用效果

配置完成后,您可以在 Cherry Studio 中无缝使用 ZenMux 的多种模型:

- 统一的对话界面,无需在不同客户端间切换
- 实时切换模型,比较不同模型的回答质量
- 完整的对话历史管理和导出功能
- 支持文件上传、多模态输入等高级功能

::: info 功能支持
不同模型支持的功能可能有所差异,例如视觉理解、函数调用等。请参考具体模型的详情页面了解其支持的功能特性。
:::

## 故障排除

### 常见问题解决

::: details API Key 错误
**问题**: 添加提供商时提示 API Key 无效或未授权

**解决方案**:

- 检查 API Key 是否正确复制,注意不要包含多余的空格或换行
- 确认 API Key 格式是否以 `sk-ai-v1-` 开头
- 验证 API Key 是否已激活且账户有足够余额
- 登录 [ZenMux 控制台](https://zenmux.ai/settings/keys) 确认 API Key 状态

:::

::: details 无法拉取模型列表
**问题**: 点击 Manager 按钮后无法获取模型列表

**解决方案**:

- 检查 API Host 配置是否正确为 `https://zenmux.ai/api/v1/`(注意结尾的斜杠)
- 验证网络连接是否正常,尝试在浏览器访问 `https://zenmux.ai`
- 确认防火墙或代理设置未阻止对 ZenMux 服务器的访问
- 检查 Cherry Studio 版本是否为最新,旧版本可能存在兼容性问题

:::

::: details 模型调用失败
**问题**: 选择模型发送消息后返回错误

**解决方案**:

- 确认所选模型仍在 ZenMux 平台上可用(部分模型可能下线)
- 检查账户余额是否充足
- 验证模型是否支持您的请求参数(如 temperature、max_tokens 等)
- 查看错误信息中的具体提示,根据提示调整请求参数
- 尝试切换到其他模型测试,排查是否为特定模型的问题

:::

::: details 响应速度慢
**问题**: 模型响应时间过长或卡顿

**解决方案**:

- 检查网络连接质量,使用网络测速工具诊断
- 尝试切换到标注为 "fast" 的模型(如 `x-ai/grok-4-fast`)
- 减少单次请求的 token 数量,降低 `max_tokens` 参数
- 避免在高峰时段使用,或选择负载较低的模型
- 如持续出现问题,联系 ZenMux 技术支持获取帮助

:::

::: tip 联系我们
如果您在使用过程中遇到任何问题,或有任何建议和反馈,欢迎通过以下方式联系我们:

- **官方网站**: <https://zenmux.ai>
- **技术支持邮箱**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**: <http://discord.gg/vHZZzj84Bm>

更多联系方式和详细信息,请访问我们的[联系我们页面](/zh/help/contact)。
:::
