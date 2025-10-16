# 通过 ZenMux 使用 Claude Code 指南

Claude Code 是 Anthropic 推出的官方 Coding Agent，通过与 ZenMux 的集成，您可以使用更多模型选择，而不仅仅局限于 Claude 官方 API。

::: info 兼容性说明
ZenMux 完全支持 Anthropic API 协议，可以无缝集成到 Claude Code、Cursor 等工具中。只需修改两个参数即可使用。

注意 Anthropic 协议的 base_url="https://zenmux.ai/api/anthropic"。
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

### 配置环境变量

设置以下环境变量来使用 ZenMux 的 Anthropic API 格式：

```bash
# 设置 ZenMux API 基础 URL（Anthropic 格式）
export ANTHROPIC_BASE_URL="https://zenmux.ai/api/anthropic"   # [!code highlight]

# 设置您的 ZenMux API Key
export ANTHROPIC_AUTH_TOKEN="sk-ai-v1-xxx"  # [!code highlight]

# 指定使用的模型（Claude 系列）
export ANTHROPIC_MODEL="anthropic/claude-sonnet-4.5"  # [!code highlight]
export ANTHROPIC_SMALL_FAST_MODEL="anthropic/claude-haiku-4.5"  # [!code highlight]

```

::: warning 重要配置
请确保将 `sk-ai-v1-xxx` 替换为您的真实 ZenMux API Key。您可以在 [ZenMux 控制台](https://zenmux.ai/settings/keys) 中获取 API Key。
:::

### 直接启动使用

配置好环境变量后，直接进入您的项目目录并启动 Claude Code：

```bash
# 进入项目目录
cd my-project

# 直接启动 Claude Code
claude  # [!code highlight]
```

::: tip 便捷使用
您可以将环境变量配置添加到您的 shell 配置文件中，避免每次手动设置：

```bash
# 添加到 .bashrc 或 .zshrc 文件中
export ANTHROPIC_BASE_URL="https://zenmux.ai/api/anthropic"
export ANTHROPIC_AUTH_TOKEN="sk-ai-v1-xxx"
export ANTHROPIC_MODEL="anthropic/claude-sonnet-4.5"
export ANTHROPIC_SMALL_FAST_MODEL="anthropic/claude-haiku-4.5"
```

:::

### 支持的模型

::: info Anthropic 协议支持模型说明
支持 Anthropic 协议的模型正在分批适配中，当前已支持的模型可以通过[官方模型列表](https://zenmux.ai/models)筛选 Anthropic API Compatible 查看:
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/602FqX9/anthropic-support.png)
或者也可以通过[模型详情页](https://zenmux.ai/anthropic/claude-haiku-4.5)查看:
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/I9JHS8b/detail-anthropic-support.png)
:::

下面是一些推荐使用的编程能力较强的模型模型列表，完整的支持 Anthropic 协议的模型请按照上述方式获取。

| 序号 | 模型 slug                        |
| ---- | -------------------------------- |
| 1    | `anthropic/claude-sonnet-4.5`    |
| 2    | `anthropic/claude-opus-4.1`      |
| 3    | `anthropic/claude-haiku-4.5`     |
| 4    | `google/gemini-2.5-pro`          |
| 5    | `openai/gpt-5-codex`             |
| 6    | `openai/gpt-5`                   |
| 7    | `x-ai/grok-4-fast`               |
| 8    | `x-ai/grok-code-fast-1`          |
| 9    | `x-ai/grok-4-fast-non-reasoning` |
| 10   | `deepseek/deepseek-chat`         |
| 11   | `qwen/qwen3-coder-plus`          |
| 12   | `moonshotai/kimi-k2-0905`        |
| 13   | `z-ai/glm-4.6`                   |
| 14   | `z-ai/glm-4.5-air`               |
| 15   | `inclusionai/ring-1t`            |
| 16   | `inclusionai/ling-1t`            |

更多模型可以通过上述 Anthropic 协议支持模型说明来获取！

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

::: details 环境变量配置不生效
**问题**：设置了模型配置后仍然不生效

**解决方案**：

- 重新打开终端窗口，或者执行 `source ~/.zshrc` 或 `source ~/.bashrc` 来重新加载配置文件
- 确认环境变量已正确设置，可以使用 `echo $ANTHROPIC_MODEL` 验证
  :::

::: details VSCode Claude Code 插件配置
**问题**：在 VSCode 的 Claude Code 插件 GUI 模式下遇到问题

**解决方案**：

您可以通过 VSCode 插件设置直接调整 Claude Code 的模型配置，修改为您配置文件中配置的模型 slug。具体操作方式如下图所示：

![VSCode Claude Code 插件配置](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/alNj8F2/cc-plugin-settings.png)
![VSCode Claude Code 插件配置](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/S7fuYF9/cc-plugin-model.png)
:::

## 进阶配置

### 配置不同规模的模型

您可以根据不同任务需求配置不同规模的模型：

::: code-group

```bash [均衡配置]
# 平衡性能和成本的模型选择
export ANTHROPIC_MODEL=anthropic/claude-sonnet-4.5
export ANTHROPIC_SMALL_FAST_MODEL=anthropic/claude-haiku-4.5
```

```bash [性能优先配置]
# 注重性能表现的模型选择
export ANTHROPIC_MODEL=anthropic/claude-opus-4.1
export ANTHROPIC_SMALL_FAST_MODEL=anthropic/claude-sonnet-4.5
```

```bash [成本优化配置]
# 注重成本效益的模型选择
export ANTHROPIC_MODEL=moonshotai/kimi-k2-0905
export ANTHROPIC_SMALL_FAST_MODEL=deepseek/deepseek-chat
```

:::

通过这种方式，您可以在不同的使用场景下获得最佳的性能和成本平衡。

::: info 更多模型
查看 [ZenMux 模型列表](https://zenmux.ai/models) 了解所有可用模型及其详细信息
:::
