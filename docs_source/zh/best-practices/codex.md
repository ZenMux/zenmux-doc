---
head:
  - - meta
    - name: description
      content: 通过 ZenMux 使用 Codex CLI 指南
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, codex, OpenAI, API
---

# 通过 ZenMux 使用 Codex CLI 指南

Codex CLI 是 OpenAI 推出的开源编程助手工具，可以在本地终端运行，能够在您选择的目录中读取、修改和运行代码。它使用 Rust 构建，速度快、效率高，并在 GitHub 上持续改进。通过与 ZenMux 的集成，您可以使用更多模型选择，而不仅仅局限于 OpenAI 官方 API。

::: info 兼容性说明
ZenMux 完全支持 OpenAI API 协议，可以无缝集成到 Codex CLI、Cursor 等工具中。只需简单配置即可使用。

注意 OpenAI 协议的 base_url="https://zenmux.ai/api/v1"。
:::

## 配置方案

### 安装 Codex CLI

::: code-group

```bash [npm/pnpm]
# 使用 pnpm 安装（推荐）
pnpm install -g @openai/codex

# 或使用 npm 安装
npm install -g @openai/codex
```

:::

### 配置环境变量

在您的 shell 配置文件中添加 ZenMux API Key：

```bash
# 编辑 ~/.zshrc 或 ~/.bashrc 文件，根据您实际使用的终端来选择
export ZENMUX_API_KEY="sk-ai-v1-xxx"  # [!code highlight]
```

::: warning 重要配置
请确保将 `sk-ai-v1-xxx` 替换为您的真实 ZenMux API Key。您可以在 [ZenMux 控制台](https://zenmux.ai/settings/keys) 中获取 API Key。
:::

### 配置 Codex

创建或修改 Codex 配置文件 `~/.codex/config.toml`：

```toml
model_provider = "zenmux"  # [!code highlight]
model = "openai/gpt-5-codex"  # [!code highlight]

[model_providers.zenmux]  # [!code highlight]
name = "ZenMux"  # [!code highlight]
base_url = "https://zenmux.ai/api/v1"  # [!code highlight]
env_key = "ZENMUX_API_KEY"  # [!code highlight]
```

::: tip 配置说明

- `model_provider`: 指定使用 ZenMux 作为模型提供商
- `model`: 设置要使用的模型，可以是 ZenMux 支持的任何模型
- `base_url`: ZenMux API 的基础 URL
- `env_key`: 环境变量中 API Key 的名称
  :::

### 直接启动使用

配置完成后，重新加载 shell 配置并启动 Codex：

```bash
# 重新加载配置文件
source ~/.zshrc  # 或 source ~/.bashrc

# 进入项目目录
cd my-project

# 直接启动 Codex CLI
codex  # [!code highlight]
```

::: tip 便捷使用
将环境变量配置添加到 shell 配置文件后，就无需每次手动设置。配置会在每次打开新终端时自动生效。
:::

## 支持的模型

您可以灵活更换 `config.toml` 中的 `model` 字段为 ZenMux 支持的任何模型。

::: info 获取模型列表

- 通过 [ZenMux 模型列表](https://zenmux.ai/models) 查看所有可用模型
- 使用模型的 slug 名称（如 `openai/gpt-5-codex`）
- 如需指定特定供应商，请参考 [Provider Routing 文档](/zh/guide/provider-routing)
  :::

下面是一些推荐使用的编程能力较强的模型：

| 序号 | 模型 slug                     | 特点         |
| ---- | ----------------------------- | ------------ |
| 1    | `openai/gpt-5-codex`          | 专为编程优化 |
| 2    | `openai/gpt-5`                | 通用能力强   |
| 3    | `anthropic/claude-sonnet-4.5` | 推理能力出色 |
| 4    | `anthropic/claude-opus-4.1`   | 复杂任务处理 |
| 5    | `google/gemini-2.5-pro`       | 多模态支持   |
| 6    | `x-ai/grok-code-fast-1`       | 快速响应     |
| 7    | `x-ai/grok-4-fast`            | 高效编程     |
| 8    | `deepseek/deepseek-chat`      | 成本效益高   |
| 9    | `qwen/qwen3-coder-plus`       | 中文编程友好 |
| 10   | `moonshotai/kimi-k2-0905`     | 长上下文支持 |
| 11   | `z-ai/glm-4.6`                | 综合能力均衡 |
| 12   | `inclusionai/ring-1t`         | 推理能力强   |

更多模型请访问 [ZenMux 模型列表](https://zenmux.ai/models) 查看！

## 故障排除

### 常见问题解决

::: details API Key 错误
**问题**：提示 API Key 无效或未授权

**解决方案**：

- 检查环境变量 `ZENMUX_API_KEY` 是否正确设置
- 使用 `echo $ZENMUX_API_KEY` 验证环境变量值
- 确认 API Key 是否已激活且有足够余额
- 验证 API Key 格式是否以 `sk-ai-v1-` 开头
  :::

::: details 连接失败问题
**问题**：Codex CLI 无法连接到 ZenMux 服务

**解决方案**：

- 检查网络连接是否正常
- 验证 `config.toml` 中的 `base_url` 是否配置正确为 `https://zenmux.ai/api/v1`
- 确认防火墙设置是否阻止了外部连接
- 尝试使用 `curl https://zenmux.ai/api/v1/models` 测试连接
  :::

::: details 环境变量配置不生效
**问题**：设置了 API Key 后仍然提示未配置

**解决方案**：

- 重新打开终端窗口，或执行 `source ~/.zshrc` 或 `source ~/.bashrc` 重新加载配置
- 确认环境变量已正确设置：`echo $ZENMUX_API_KEY`
- 检查是否在正确的 shell 配置文件中添加了环境变量（zsh 用户使用 `.zshrc`，bash 用户使用 `.bashrc`）
  :::

::: details 配置文件路径问题
**问题**：修改配置文件后不生效

**解决方案**：

- 确认配置文件路径为 `~/.codex/config.toml`
- 如果目录不存在，需要先创建：`mkdir -p ~/.codex`
- 检查配置文件语法是否正确（TOML 格式）
- 使用 `cat ~/.codex/config.toml` 验证文件内容
  :::

::: details 模型不可用
**问题**：使用某个模型时提示模型不可用或不支持

**解决方案**：

- 访问 [ZenMux 模型列表](https://zenmux.ai/models) 确认模型是否可用
- 检查模型 slug 拼写是否正确
- 尝试使用其他推荐的模型进行测试
- 确认您的账户是否有权限访问该模型
  :::

## 进阶配置

### 配置不同规模的模型

您可以根据不同任务需求在 `config.toml` 中切换不同规模的模型：

::: code-group

```toml [均衡配置]
# 平衡性能和成本的模型选择
model_provider = "zenmux"
model = "anthropic/claude-sonnet-4.5"

[model_providers.zenmux]
name = "ZenMux"
base_url = "https://zenmux.ai/api/v1"
env_key = "ZENMUX_API_KEY"
```

```toml [性能优先配置]
# 注重性能表现的模型选择
model_provider = "zenmux"
model = "openai/gpt-5-codex"

[model_providers.zenmux]
name = "ZenMux"
base_url = "https://zenmux.ai/api/v1"
env_key = "ZENMUX_API_KEY"
```

```toml [成本优化配置]
# 注重成本效益的模型选择
model_provider = "zenmux"
model = "deepseek/deepseek-chat"

[model_providers.zenmux]
name = "ZenMux"
base_url = "https://zenmux.ai/api/v1"
env_key = "ZENMUX_API_KEY"
```

:::

::: tip 联系我们
如果您在使用过程中遇到任何问题，或有任何建议和反馈，欢迎通过以下方式联系我们：

- **官方网站**：<https://zenmux.ai>
- **技术支持邮箱**：[support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**：[bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**：[@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**：<http://discord.gg/vHZZzj84Bm>

更多联系方式和详细信息，请访问我们的[联系我们页面](/zh/help/contact)。
:::
