---
head:
  - - meta
    - name: description
      content: 通过 ZenMux 集成 Codex CLI 与 Codex App 的示例指南
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, codex, codex cli, codex app, OpenAI, API
---

# Codex CLI + Codex App 的集成示例

Codex 是 OpenAI 推出的编程助手，提供两种使用形态：

- **Codex CLI**：开源命令行工具，可在本地终端运行，能够在您选择的目录中读取、修改和运行代码。它使用 Rust 构建，速度快、效率高，并在 GitHub 上持续改进。
- **Codex App**：图形界面应用（桌面端 / IDE 插件），开箱即用，适合偏好可视化交互的用户。详见 [Codex App 官方介绍](https://developers.openai.com/codex/app)。

**两者共享同一套配置方式**：均读取 `~/.codex/config.toml` 配置文件与同一份环境变量。因此下文的配置对 Codex CLI 和 Codex App 同时生效，配置一次即可在两端使用。通过与 ZenMux 的集成，您可以使用更多模型选择，而不仅仅局限于 OpenAI 官方 API。

::: info 兼容性说明
OpenAI 已明确将 Responses 作为新一代统一接口，Chat Completions 仍可使用但不再是新项目首选；Codex 也将顺应这一方向，把 Chat Completions 视为兼容选项并逐步迁移到 Responses（本文配置即按 Responses 给出）。

注意 OpenAI 协议的 base_url="https://zenmux.ai/api/v1"。
:::

## 配置方案

::: tip 一次配置，两端通用
Codex CLI 与 Codex App 读取相同的 `~/.codex/config.toml` 配置文件和环境变量。下方步骤完成后，两种形态都会自动使用 ZenMux。
:::

### 安装 Codex

::: code-group

```bash [Codex CLI]
# 使用 pnpm 安装（推荐）
pnpm install -g @openai/codex

# 或使用 npm 安装
npm install -g @openai/codex
```

```text [Codex App]
# 前往 Codex App 官方页面下载安装（桌面端 / IDE 插件）：
# https://developers.openai.com/codex/app
# 安装后无需额外配置入口，App 会自动读取下文的 ~/.codex/config.toml
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
model = "gpt-5.2-codex"  # [!code highlight]

[model_providers.zenmux]  # [!code highlight]
name = "ZenMux"  # [!code highlight]
base_url = "https://zenmux.ai/api/v1"  # [!code highlight]
env_key = "ZENMUX_API_KEY"  # [!code highlight]
wire_api = "responses"  # [!code highlight]
```

::: tip 配置说明

- `model_provider`: 指定使用 ZenMux 作为模型提供商
- `model`: 设置要使用的模型，可以是 ZenMux 支持的任何模型。对于 GPT 系列推荐直接使用原厂名称（如 `gpt-5.2-codex`），详见下方 [支持的模型](#支持的模型) 章节
- `base_url`: ZenMux API 的基础 URL
- `env_key`: 环境变量中 API Key 的名称
- `wire_api`: 指定使用 Responses 协议（推荐）
:::

### 直接启动使用

配置完成后即可启动 Codex：

::: code-group

```bash [Codex CLI]
# 重新加载配置文件
source ~/.zshrc  # 或 source ~/.bashrc

# 进入项目目录
cd my-project

# 直接启动 Codex CLI
codex  # [!code highlight]
```

```text [Codex App]
# 直接打开 Codex App 即可，它会自动读取 ~/.codex/config.toml
# 若 App 已在运行，重启一次以加载最新配置
```

:::

::: tip Codex App 首次启动提示
若第一次打开 Codex App 时引导您填写 API Key，可直接填入您的 ZenMux API Key（`sk-ai-v1-xxx`），随后关闭 App；再按上文 [配置 Codex](#配置-codex) 修改 `~/.codex/config.toml`，保存后重新打开 Codex App 即可生效。
:::

::: tip 便捷使用
将环境变量配置添加到 shell 配置文件后，就无需每次手动设置。配置会在每次打开新终端时自动生效，Codex CLI 与 Codex App 均会读取该配置。
:::

## 支持的模型

您可以灵活更换 `config.toml` 中的 `model` 字段为 ZenMux 支持的任何模型。

完整且持续更新的模型列表请访问 **[ZenMux 模型列表（Responses 协议）↗](https://zenmux.ai/models?sort=newest&supported_protocol=responses)** 查看，将模型名称填入 `config.toml` 的 `model` 字段即可。

### GPT 系列模型推荐使用原厂别名

对于 OpenAI GPT 系列模型，**推荐直接使用其原厂名称**（如 `gpt-5.2-codex`、`gpt-5.5`），而不是带前缀的完整 ZenMux 模型 ID（如 `openai/gpt-5.2-codex`、`openai/gpt-5.5`）。

```toml
# ✅ 推荐：使用原厂别名，可获得最大特性支持
model = "gpt-5.2-codex"  # [!code highlight]

# ⚠️ 不推荐：带前缀的完整 ID 可能导致部分原生特性无法启用
model = "openai/gpt-5.2-codex"
```

::: info 为什么要用原厂别名？

Codex 通过硬编码字符串校验模型名称，以启用对应的原生特性（如 Responses 协议下的 reasoning、codex 专属能力等）。当 Codex 看到 `gpt-5.2-codex` 这类原厂名称时，相应功能会被正确激活；而看到 `openai/gpt-5.2-codex` 这类带前缀的 ID 时校验可能失败，特性会静默回退。

ZenMux 的模型别名功能让 `gpt-5.2-codex` 与 `openai/gpt-5.2-codex` 完全等效，Codex 的校验得以通过，所有下游特性都能正常工作。完整别名列表与更多说明请见 [模型别名](/zh/guide/advanced/model-alias)。

:::

::: tip 其他模型的使用方式

- GPT 系列：直接使用原厂名称（如 `gpt-5.2-codex`、`gpt-5.5`）
- 其他厂商模型：使用带前缀的完整 slug（如 `anthropic/claude-opus-4-8`、`deepseek/deepseek-v4-pro`），可在 [ZenMux 模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=responses) 中筛选支持 Responses 协议的模型并复制其 slug
- 如需指定特定供应商，请参考 [Provider Routing 文档](/zh/guide/advanced/provider-routing)

:::

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

- 访问 [ZenMux 模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=responses) 确认模型是否可用
- 检查模型 slug 拼写是否正确
- 尝试使用其他推荐的模型进行测试
- 确认您的账户是否有权限访问该模型
:::

## 进阶配置

### 配置不同模型

您只需修改 `config.toml` 中的 `model` 字段，即可切换到 ZenMux 支持的任意模型，其余配置保持不变。以下示例展示了如何指定不同模型：

::: code-group

```toml [Claude Opus 4.8]
model_provider = "zenmux"
model = "anthropic/claude-opus-4-8"  # [!code highlight]

[model_providers.zenmux]
name = "ZenMux"
base_url = "https://zenmux.ai/api/v1"
env_key = "ZENMUX_API_KEY"
wire_api = "responses"
```

```toml [DeepSeek V4 Pro]
model_provider = "zenmux"
model = "deepseek/deepseek-v4-pro"  # [!code highlight]

[model_providers.zenmux]
name = "ZenMux"
base_url = "https://zenmux.ai/api/v1"
env_key = "ZENMUX_API_KEY"
wire_api = "responses"
```

```toml [Kimi K2.6]
model_provider = "zenmux"
model = "moonshotai/kimi-k2.6"  # [!code highlight]

[model_providers.zenmux]
name = "ZenMux"
base_url = "https://zenmux.ai/api/v1"
env_key = "ZENMUX_API_KEY"
wire_api = "responses"
```

:::

::: tip 提示
请以 [ZenMux 模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=responses) 中的实际 slug 为准，将其填入 `model` 字段即可。
:::

<ContactCards>
<ContactCard icon="mail" title="邮箱">

技术支持: [support@zenmux.ai](mailto:support@zenmux.ai)

商务合作: [bd@zenmux.ai](mailto:bd@zenmux.ai)

</ContactCard>
<ContactCard icon="x" title="X / Twitter" link="https://x.com/ZenMuxAI" label="@ZenMuxAI" />
<ContactCard icon="discord" title="Discord" link="https://discord.gg/vHZZzj84Bm" label="@ZenMuxAI" />
</ContactCards>
