---
head:
  - - meta
    - name: description
      content: 通过 ZenMux 使用 Claude Desktop 指南
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, Claude Desktop, Claude Cowork, Gateway, Anthropic, API
---

# 通过 ZenMux 使用 Claude Desktop 指南

Claude Desktop 支持通过 **Third-party inference** 将模型推理请求转发到第三方推理平台。通过 ZenMux 的 Anthropic 兼容协议，您可以在 Claude Desktop 的 Cowork / Code 体验中使用 ZenMux 聚合的模型，而不必只依赖 Anthropic 官方默认服务。

::: info 兼容性说明
Claude Desktop 的第三方推理配置面向 Bedrock、Vertex AI、Azure AI Foundry 或兼容 `/v1/messages` 的 LLM Gateway。ZenMux 提供 Anthropic Messages 兼容端点，可以按 Gateway 方式接入。

ZenMux Anthropic 兼容 Base URL：

```text
https://zenmux.ai/api/anthropic
```

更多支持 Anthropic Messages 协议的模型，请查看 [ZenMux 模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=messages)。
:::

::: warning 注意
Claude Desktop 的第三方推理能力依赖较新的客户端版本，并且官方文档将其描述为面向第三方平台 / 企业部署的配置模式。若您的客户端没有相关菜单，请先升级 Claude Desktop。
:::

## 准备工作

开始前，请确认您已经准备好：

- 已安装最新版 [Claude Desktop](https://claude.ai/download)
- 已拥有 ZenMux API Key
- 已确认要使用的模型 slug，例如 `anthropic/claude-sonnet-4.6`

### 获取 ZenMux API Key

ZenMux 提供两类 API Key，请按使用场景选择：

::: code-group

```text [订阅制 API Key]
适用场景：个人开发、学习探索、Vibe Coding
Key 格式：sk-ss-v1-xxx
获取位置：https://zenmux.ai/platform/subscription
```

```text [按量付费 API Key]
适用场景：生产环境、商业化产品、企业应用
Key 格式：sk-ai-v1-xxx
获取位置：https://zenmux.ai/platform/pay-as-you-go
```

:::

::: warning API Key 使用建议
订阅制 API Key 更适合个人开发和学习场景；生产环境、商业化产品或企业应用建议使用按量付费 API Key。
:::

## 配置 Claude Desktop

### 步骤 1：退出登录或保持未登录状态

打开 Claude Desktop 后，建议先退出已有账号登录，或在未登录状态下完成第三方推理配置。

根据 Claude 官方说明，第三方推理模式可以在未登录 Claude 账号的情况下配置。配置完成后，Claude Desktop 会将推理请求发送到您指定的 Gateway。

### 步骤 2：启用 Developer Mode

在 Claude Desktop 菜单栏中依次选择：

```text
Help → Troubleshooting → Enable Developer Mode
```

确认启用后，Claude Desktop 会重启。重启完成后，菜单栏中会出现 **Developer** 菜单。

### 步骤 3：打开第三方推理配置

在菜单栏中选择：

```text
Developer → Configure third-party inference
```

这会打开 Claude Desktop 的第三方推理配置界面。

### 步骤 4：配置 Gateway 连接

在配置界面的 **Connection** 区域中，选择 **Gateway**，然后填写：

| 字段 | 填写内容 |
| --- | --- |
| Gateway Base URL | `https://zenmux.ai/api/anthropic` |
| Gateway API Key | 您的 ZenMux API Key |
| Gateway Auth Scheme | `Bearer` |
| Gateway Extra Headers | 通常留空；如需租户路由或企业额外头，再按网关要求填写 |

::: tip 与 Claude Code 配置的关系
如果您之前配置过 Claude Code，可以参考其中的 `ANTHROPIC_BASE_URL`：

```bash
export ANTHROPIC_BASE_URL="https://zenmux.ai/api/anthropic"
```

Claude Desktop 不需要您手动写 shell 环境变量；在第三方推理配置界面中填写相同的 Base URL 即可。
:::

### 步骤 5：配置模型列表

进入 **Identity & Models** 或模型相关配置区域，在 Model List 中添加您希望在 Claude Desktop 中使用的模型 slug。

示例：

```text
anthropic/claude-sonnet-4.6
anthropic/claude-opus-4.6
openai/gpt-5.5
google/gemini-3.1-pro-preview
```

::: warning 模型 slug 必须准确
请以 [ZenMux 模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=messages) 中支持 Anthropic Messages 协议的模型 slug 为准。若模型名称拼写错误，Claude Desktop 可能无法启动会话或在调用时返回模型不存在。
:::

### 步骤 6：按需开启 1M Context

Claude Desktop 的模型配置界面可能会提供 `1M Context` 等高级开关。只有当后端模型和供应商确实支持对应上下文长度时，才建议开启。

如果不确定模型是否支持超长上下文，请先保持关闭，完成基础调用验证后再调整。

### 步骤 7：应用配置并重启

点击配置界面底部的 **Apply locally**。Claude Desktop 会写入本地配置并自动重启。

重启后，您应该可以看到 Cowork / Code 等入口，并在模型选择器中看到刚刚配置的模型列表。选择其中一个模型后，即可开始通过 ZenMux 使用 Claude Desktop。

## 验证配置

建议先发送一条简单消息验证链路：

```text
请用一句话介绍你当前使用的模型。
```

如果请求成功，可以继续测试更接近真实场景的任务，例如：

- 让 Cowork 总结一份本地文档
- 让 Code 打开一个项目并解释目录结构
- 切换不同模型，对比响应速度和质量

也可以在 ZenMux 控制台的请求日志中查看调用记录，确认请求已经经过 ZenMux。

## 常见问题

::: details 找不到 Developer 菜单
请先确认：

- Claude Desktop 已升级到支持 third-party inference 的版本
- 已通过 `Help → Troubleshooting → Enable Developer Mode` 启用 Developer Mode
- 启用后已完全重启 Claude Desktop
:::

::: details Base URL 应该填什么？
使用 ZenMux 时填写：

```text
https://zenmux.ai/api/anthropic
```

不要填写 OpenAI 兼容端点 `https://zenmux.ai/api/v1`。Claude Desktop 的 Gateway 模式需要兼容 Anthropic Messages 的 `/v1/messages` 接口。
:::

::: details API Key 报错或鉴权失败
请检查：

- API Key 是否完整复制，没有多余空格或换行
- Gateway Auth Scheme 是否选择 `Bearer`
- API Key 是否仍有效且账户有可用额度
- 使用订阅制 Key 时，是否符合订阅制使用范围
:::

::: details 模型不可用或模型列表为空
请检查 Model List 中的模型 slug 是否准确，并确认模型支持 Anthropic Messages 协议。

可从 [ZenMux 模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=messages) 复制模型 slug。
:::

::: details 开启 1M Context 后调用失败
`1M Context` 只适用于后端明确支持超长上下文的模型。如果开启后失败，请先关闭该选项，确认基础模型调用正常后，再选择支持 1M 上下文的模型重新测试。
:::

## 参考资料

- [Claude 官方：Install and configure Claude Cowork with third-party platforms](https://support.claude.com/en/articles/14680741-install-and-configure-claude-cowork-with-third-party-platforms)
- [ZenMux Anthropic Compatible API](/zh/api/anthropic/create-messages)
- [ZenMux 模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=messages)

::: tip 联系我们
如果您在使用过程中遇到任何问题，或有任何建议和反馈，欢迎通过以下方式联系我们：

- **官方网站**：<https://zenmux.ai>
- **技术支持邮箱**：[support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**：[bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**：[@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**：<http://discord.gg/vHZZzj84Bm>

更多联系方式和详细信息，请访问我们的[联系我们页面](/zh/help/contact)。
:::
