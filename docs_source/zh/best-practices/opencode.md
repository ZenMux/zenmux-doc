# 通过 ZenMux 使用 OpenCode 指南

OpenCode 是一款专为终端设计的 AI 编程智能体，通过与 ZenMux 的集成，您可以获得更多强大模型的支持，提升开发效率。

## 安装 OpenCode

OpenCode 提供多种安装方式，您可以根据自己的系统环境选择合适的方法：

::: code-group

```bash [快速安装]
# 使用安装脚本（推荐）
curl -fsSL https://opencode.ai/install | bash
```

```bash [npm/pnpm/yarn]
# 使用 npm 安装
npm i -g opencode-ai@latest

# 或使用 pnpm 安装
pnpm i -g opencode-ai@latest

# 或使用 yarn 安装
yarn global add opencode-ai@latest

# 或使用 bun 安装
bun i -g opencode-ai@latest
```

```bash [macOS & Linux]
# 使用 Homebrew 安装（macOS 和 Linux）
brew install sst/tap/opencode
```

```bash [Windows]
# 使用 Scoop 安装
scoop bucket add extras
scoop install extras/opencode

# 或使用 Chocolatey 安装
choco install opencode
```

```bash [Arch Linux]
# 使用 paru 安装
paru -S opencode-bin
```

:::

::: tip 更多安装方式
更多详细的安装选项和说明，请参考 [OpenCode 官方文档](https://opencode.ai/docs/#install)
:::

## 配置 OpenCode

### 登录并配置 ZenMux

安装完成后，您需要配置 OpenCode 以使用 ZenMux 的 API。

#### Step 1: 启动 OpenCode 并登录

首次使用时，OpenCode 会提示您进行登录配置：

```bash
opencode auth login
```

在提供商选择界面中选择 **ZenMux**：

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/30/PdPJcCv/opencode-login.jpg"
       alt="OpenCode 登录"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

::: warning 重要提示
请确保选择 **ZenMux** 作为您的 API 提供商，而不是其他供应商。
:::

#### Step 2: 输入 ZenMux API Key

选择 ZenMux 后，系统会提示您输入 API Key。请输入您的 ZenMux API Key（格式为 `sk-ai-v1-xxx`）：

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/30/nhMPtje/opencode-key.jpg"
       alt="输入 API Key"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

::: tip 获取 API Key
您可以在 [ZenMux 控制台](https://zenmux.ai/settings/keys) 中获取或创建您的 API Key。
:::

#### Step 3: 选择模型

配置完成后，使用 `/models` 命令查看和选择可用的模型：

```bash
# 启动 OpenCode
opencode

# 查看可用模型列表
/models
```

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/30/p7oX3KY/opencode-models.png"
       alt="选择模型"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

## 支持的模型

ZenMux 为 OpenCode 提供了丰富的模型选择,以下是当前支持的模型列表（持续更新中）：

::: info 模型更新说明
下表列出的是已验证支持 OpenCode 的推荐模型。如果您需要使用其他模型，欢迎通过页面底部的联系方式与我们反馈，我们会第一时间提供原生支持。
:::

| 序号 | 模型名称                              | 模型 Slug                        |
| ---- | ------------------------------------- | -------------------------------- |
| 1    | Ling-1T                               | `inclusionai/ling-1t`            |
| 2    | Ring-1T                               | `inclusionai/ring-1t`            |
| 3    | Claude Haiku 4.5                      | `anthropic/claude-haiku-4.5`     |
| 4    | Claude Opus 4.1                       | `anthropic/claude-opus-4.1`      |
| 5    | Claude Sonnet 4.5                     | `anthropic/claude-sonnet-4.5`    |
| 6    | DeepSeek-V3.2-Exp (Non-thinking Mode) | `deepseek/deepseek-chat`         |
| 7    | Gemini 2.5 Pro                        | `google/gemini-2.5-pro`          |
| 8    | KAT-Coder-Pro-V1                      | `kat-ai/kat-coder-pro-v1`        |
| 9    | Kimi K2 0905                          | `moonshotai/kimi-k2-0905`        |
| 10   | GPT-5 Codex                           | `openai/gpt-5-codex`             |
| 11   | GPT-5                                 | `openai/gpt-5`                   |
| 12   | Qwen3 Coder Plus                      | `qwen/qwen3-coder-plus`          |
| 13   | Grok 4 Fast Non Reasoning             | `x-ai/grok-4-fast-non-reasoning` |
| 14   | Grok 4 Fast                           | `x-ai/grok-4-fast`               |
| 15   | Grok 4                                | `x-ai/grok-4`                    |
| 16   | Grok Code Fast 1                      | `x-ai/grok-code-fast-1`          |
| 17   | GLM 4.5 Air                           | `z-ai/glm-4.5-air`               |
| 18   | GLM 4.6                               | `z-ai/glm-4.6`                   |

## 使用效果

配置完成后，OpenCode 将为您提供强大的 AI 编程辅助能力：

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/30/6oFggTa/opencode-result.jpg"
       alt="OpenCode 使用效果"
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
- 重新运行 `opencode` 命令并重新配置
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
