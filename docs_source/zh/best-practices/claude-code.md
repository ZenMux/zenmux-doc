---
head:
  - - meta
    - name: description
      content: 通过 ZenMux 使用 Claude Code CLI 指南
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, claude, code, Anthropic, Claude, GPT, API
---

# 通过 ZenMux 使用 Claude Code CLI 指南

::: info 兼容性说明

Claude Code 是 Anthropic 推出的官方 Coding Agent，通过与 ZenMux 的集成，您可以使用更多模型选择，而不仅仅局限于 Claude 官方模型。

例如，您可以通过 ZenMux 在 Claude Code 中使用 GPT-5.2系列、Claude-4.5系列、Gemini-3系列、Grok 4.1系列、Doubao-Seed-Code、Kimi-K2、Minimax-M2、GLM-4.6、DeepSeek-V3.2、Qwen3-Coder-Plus等模型，更多支持的模型请见[官方模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=messages)。

ZenMux 完全支持 Anthropic API 协议，可以无缝集成到 Claude Code、Cursor 等工具中。只需修改两个参数即可使用。

注意 Anthropic 协议的 base_url="<https://zenmux.ai/api/anthropic"。>
:::

## 配置方案

### 安装 Claude Code

::: code-group

```bash [npm/pnpm]
# 使用 pnpm 安装（推荐）
pnpm install -g @anthropic-ai/claude-code

# 或使用 npm 安装
npm install -g @anthropic-ai/claude-code
```

:::

### 配置 Claude Code

#### 配置原理说明

Claude Code 默认直接连接到 Anthropic 官方服务，但通过配置环境变量，我们可以将其请求重定向到 ZenMux 服务。这样做的好处是：

- **无需修改 Claude Code 本身**：仅通过环境变量即可切换服务端点
- **使用 ZenMux API Key 认证**：替代 Anthropic 官方 API Key
- **访问更多模型选择**：除 Claude 系列外，还可使用 GPT、Gemini、Qwen 等多种模型

配置的核心是设置两个关键环境变量：`ANTHROPIC_BASE_URL`（ZenMux 服务地址）和 `ANTHROPIC_AUTH_TOKEN`（您的 ZenMux API Key），从而让 Claude Code 的所有请求都通过 ZenMux 转发。

::: warning v2.0.7x 版本重要变更
由于 Claude Code v2.0.7x 的更新，其**环境变量加载逻辑发生改变**：`~/.claude/settings.json` 中的 `env` 配置在以下场景**无法可靠读取**：

- **首次登录** Claude Code 时
- 执行 **logout** 后再次登录时

因此，连接 ZenMux 时建议统一使用 **shell profile 环境变量** 的方式进行配置，以确保登录与请求都走 ZenMux 的 Anthropic 兼容端点。
:::

### 步骤 1：配置 Shell 环境变量（推荐方式）

本步骤将把 ZenMux 连接配置写入您的 shell 配置文件中，使其在每次打开终端时自动生效。

**操作步骤：**

1. 确定您使用的 shell 类型（通常是 bash 或 zsh）：
   - 如果使用 bash，编辑 `~/.bashrc`
   - 如果使用 zsh，编辑 `~/.zshrc`
   - 不确定的话可以运行 `echo $SHELL` 查看

2. 将以下内容**追加**到对应的配置文件末尾（注意替换 API Key）：

```bash
# ============= ZenMux + Claude Code 配置 =============
# 将 Claude Code 连接到 ZenMux 服务，而非 Anthropic 官方服务

# 核心配置：ZenMux 服务端点和认证
export ANTHROPIC_BASE_URL="https://zenmux.ai/api/anthropic"  # ZenMux Anthropic 兼容端点
export ANTHROPIC_AUTH_TOKEN="sk-ai-v1-xxx"                   # 替换为您的 ZenMux API Key
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"          # 禁用非必要流量

# 避免冲突：如果您本机曾设置过 ANTHROPIC_API_KEY，建议显式置空
export ANTHROPIC_API_KEY=""

# 默认模型配置（必需）：定义 Haiku / Sonnet / Opus 三个速度档位对应的模型
export ANTHROPIC_DEFAULT_HAIKU_MODEL="anthropic/claude-haiku-4.5"   # 快速模型
export ANTHROPIC_DEFAULT_SONNET_MODEL="anthropic/claude-sonnet-4.5" # 平衡模型
export ANTHROPIC_DEFAULT_OPUS_MODEL="anthropic/claude-opus-4.5"     # 强力模型
```

3. 使配置生效（二选一）：
   ```bash
   # 方式 1：重新加载配置文件（推荐）
   source ~/.bashrc  # 如果使用 bash
   # 或
   source ~/.zshrc   # 如果使用 zsh

   # 方式 2：重启终端窗口
   ```

::: warning 重要配置
请确保将 `sk-ai-v1-xxx` 替换为您的真实 ZenMux API Key。您可以在 [ZenMux 控制台](https://zenmux.ai/settings/keys) 中获取 API Key。
:::

::: tip 环境变量说明

| 变量名 | 作用 | 说明 |
|--------|------|------|
| `ANTHROPIC_BASE_URL` | 服务端点地址 | 将 Claude Code 的请求重定向到 ZenMux 服务 |
| `ANTHROPIC_AUTH_TOKEN` | 认证密钥 | 您的 ZenMux API Key（在[控制台](https://zenmux.ai/settings/keys)获取） |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | 流量控制 | 禁用非必要的数据上报，提升隐私性 |
| `ANTHROPIC_API_KEY` | 冲突避免 | 置空以避免与本机已有 Anthropic 配置冲突 |
| `ANTHROPIC_DEFAULT_*_MODEL` | 模型映射 | 定义 Haiku/Sonnet/Opus 档位对应的实际模型 |
:::

### 步骤 2：启动 Claude Code 并完成认证

配置完环境变量后，就可以启动 Claude Code 了。首次启动时会自动通过 ZenMux 完成认证。

**操作步骤：**

1. 打开一个**新的**终端窗口（确保环境变量已加载）
2. 进入您的项目目录：
   ```bash
   cd /path/to/your/project
   ```
3. 启动 Claude Code：
   ```bash
   claude  # [!code highlight]
   ```
4. 首次启动时，Claude Code 会：
   - 自动读取环境变量中的 `ANTHROPIC_AUTH_TOKEN`
   - 通过 `ANTHROPIC_BASE_URL` 指向的 ZenMux 服务完成认证
   - 无需额外登录步骤，即可开始使用

::: tip 提示
如果启动时提示找不到 `claude` 命令，请确认已全局安装 Claude Code（参见上方的安装步骤）。
:::

### 步骤 3：验证连接状态

启动成功后，建议验证 Claude Code 是否正确连接到 ZenMux 服务。

在 Claude Code 提示符下输入 `/status` 命令，检查配置是否正确：

```text
> /status
Auth token: ANTHROPIC_AUTH_TOKEN  # [!code highlight]
Anthropic base URL: https://zenmux.ai/api/anthropic  # [!code highlight]
```

**验证要点：**
- ✅ `Auth token` 应显示为 `ANTHROPIC_AUTH_TOKEN`（表示从环境变量读取）
- ✅ `Anthropic base URL` 应显示为 `https://zenmux.ai/api/anthropic`（ZenMux 服务地址）

如果显示的信息符合上述要求，说明配置成功！您现在可以通过 ZenMux 使用 Claude Code 了。

## 更换/指定默认模型

上面我们已经在 shell profile 中配置了默认模型（**不可或缺**）。如果您希望切换到其他模型，只需要修改同一组环境变量即可：

```bash
export ANTHROPIC_DEFAULT_HAIKU_MODEL="volcengine/doubao-seed-code"
export ANTHROPIC_DEFAULT_SONNET_MODEL="openai/gpt-5.2"
export ANTHROPIC_DEFAULT_OPUS_MODEL="google/gemini-3-pro-preview"
```

修改后记得 `source ~/.bashrc` / `source ~/.zshrc` 或重启终端使其生效。

### 支持的模型

::: info Anthropic 协议支持模型说明
支持 Anthropic 协议的模型正在分批适配中，当前已支持的模型可以通过[官方模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=messages)筛选 Anthropic Messages 协议查看:
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/602FqX9/anthropic-support.png)
或者也可以通过[模型详情页](https://zenmux.ai/anthropic/claude-haiku-4.5)查看:
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/I9JHS8b/detail-anthropic-support.png)
:::

## 使用效果

配置完成后，您就可以在 Claude Code 中使用 ZenMux 的多种模型了：

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/GxOgGlh/claude-code-v2.png"
       alt="Claude Code"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

您可以通过'/model'命令来确定当前使用的模型：

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/MOGcIN5/claude-code-v2-model.png"
       alt="Claude Code Model"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

## 故障排除

### 常见问题解决

::: details API Key 错误
**问题**：提示 API Key 无效或未授权

**解决方案**：

- 检查环境变量中的 ZenMux API Key 是否正确
- 确认 API Key 是否已激活且有足够余额
- 验证 API Key 格式是否以 `sk-ai-v1-` 开头
  :::

::: details 模型不支持 Anthropic 协议
**问题**：使用某个模型时提示不支持 Anthropic 协议

**解决方案**：

- 请通过 [ZenMux 模型列表](https://zenmux.ai/models) 筛选 "Anthropic API Compatible" 查看当前支持的模型
- 或访问具体模型的详情页确认是否支持 Anthropic 协议
- 选择上述支持列表中的模型进行使用
  :::

::: details 连接失败问题
**问题**：Claude Code 无法连接到 ZenMux 服务

**解决方案**：

- 检查网络连接是否正常
- 验证 `ANTHROPIC_BASE_URL` 是否配置正确为 `https://zenmux.ai/api/anthropic`
- 确认防火墙设置是否阻止了外部连接
  :::

::: details VSCode Claude Code 插件配置
**问题**：在 VSCode 的 Claude Code 插件 GUI 模式下遇到问题

**解决方案**：

您可以通过 VSCode 插件设置直接调整 Claude Code 的模型配置，修改为您配置文件中配置的模型 slug。具体操作方式如下图所示：

![VSCode Claude Code 插件配置](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/alNj8F2/cc-plugin-settings.png)
![VSCode Claude Code 插件配置](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/S7fuYF9/cc-plugin-model.png)
:::

::: info 更多模型
查看 [ZenMux 模型列表](https://zenmux.ai/models) 了解所有可用模型及其详细信息
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
