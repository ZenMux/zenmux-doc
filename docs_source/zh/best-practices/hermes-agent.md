---
head:
  - - meta
    - name: description
      content: Hermes Agent 接入 ZenMux 使用指南
  - - meta
    - name: keywords
      content: ZenMux, 最佳实践, 集成, Hermes, Hermes Agent, OpenAI, API, AI 代理
---

# Hermes Agent 接入 ZenMux 使用指南

Hermes Agent 是一个功能强大的 AI 代理框架，支持多种工具调用、浏览器自动化、代码执行、文件操作等能力。通过接入 ZenMux，您可以在 Hermes Agent 中使用全球各大厂商的最新大模型，无需分别配置各家 API Key，一个 ZenMux API Key 即可统一调用。

::: info 兼容性说明
ZenMux 完全支持 OpenAI API 协议，可以通过 Hermes Agent 的自定义端点功能与其配合使用。

注意 OpenAI 协议的 base_url 为 `https://zenmux.ai/api/v1`。
:::

## 前置条件

- 操作系统：Linux / macOS / WSL2 / Android（Termux）
- **Git**（唯一的必装前置依赖，安装脚本会自动处理其余一切）
- ZenMux API Key（参见下方[第 0 步](#第-0-步获取-zenmux-api-key)）

::: tip 关于其他依赖
Hermes Agent 的一键安装脚本会自动检测并安装以下依赖，您**无需手动安装**：
- Python 3.11（通过 uv 包管理器安装，无需 sudo）
- Node.js v22（用于浏览器自动化和 WhatsApp 网关）
- ripgrep（快速文件搜索）
- ffmpeg（音频格式转换，用于语音功能）
:::

## 第 0 步：获取 ZenMux API Key

在配置 Hermes Agent 之前，您需要一个 ZenMux API Key。ZenMux 提供两种计费方式：

::: code-group

```text [订阅 API Key（推荐）]
适用场景：个人开发、学习探索
特点：固定月费、成本可预测、5-10 倍价格杠杆
API Key 格式：sk-ss-v1-xxx

获取方式：
1. 访问订阅管理页面：https://zenmux.ai/platform/subscription
2. 选择套餐（Pro $20/月、Max $100/月、Ultra $200/月）
3. 订阅后在页面创建订阅 API Key

详细说明请参阅：订阅套餐指南
https://docs.zenmux.ai/zh/guide/subscription
```

```text [按量付费 API Key]
适用场景：生产环境、商业产品、企业应用
特点：无速率限制、生产级稳定性、按实际用量计费
API Key 格式：sk-ai-v1-xxx

获取方式：
1. 访问按量付费页面：https://zenmux.ai/platform/pay-as-you-go
2. 充值账户（充值自动赠送 20% 额外额度）
3. 在"按量付费 API Keys"区域创建 API Key

详细说明请参阅：按量付费指南
https://docs.zenmux.ai/zh/guide/pay-as-you-go
```

:::

## 第 1 步：安装 Hermes Agent

如果您已经安装了 Hermes Agent，可以跳过此步骤，直接进入[第 2 步](#第-2-步配置-zenmux-供应商)。

在终端中运行以下一键安装命令（支持 Linux / macOS / WSL2 / Android Termux）：

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

安装完成后，重新加载 Shell 配置：

```bash
source ~/.bashrc   # 如果使用 zsh，请运行 source ~/.zshrc
```

::: tip Windows 用户
请先安装 [WSL2](https://learn.microsoft.com/zh-cn/windows/wsl/install)，然后在 WSL2 终端中运行上述安装命令。
:::

更多安装方式请参阅 [Hermes Agent 官方快速开始文档](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)。

## 第 2 步：配置 ZenMux 供应商

在终端中运行 `hermes model` 命令，进入供应商选择界面：

```bash
hermes model
```

您会看到一个供应商列表（使用 ↑↓ 键导航，ENTER 键选择）：

```
Select provider:
  ↑↓ navigate  ENTER/SPACE select  ESC cancel

   (○) OpenRouter (100+ models, pay-per-use)
   (○) Anthropic (Claude models — API key or Claude Code)
   ...
   (○) Custom endpoint (enter URL manually)    ← 首次配置选择此项
   (○) Cancel
```

首次配置 ZenMux，选择 **"Custom endpoint (enter URL manually)"**，然后按提示依次输入：

1. **API Base URL**：`https://zenmux.ai/api/v1`
2. **API Key**：粘贴您的 ZenMux API Key（如 `sk-ss-v1-xxx`）
3. **模型名称**：输入要使用的模型 ID，如 `openai/gpt-5.2`

配置完成后，向导会自动将设置写入 `~/.hermes/config.yaml`，无需手动编辑任何文件。

::: warning 关于模型名称
模型名称就是 ZenMux API 中的原始模型 ID（如 `openai/gpt-5.2`），**不需要**加 `zenmux/` 前缀。Hermes 会将此名称直接发送到配置的 `base_url` 端点。
:::

## 第 3 步：验证配置

启动 Hermes Agent 并发送一条测试消息验证模型可以正常响应：

```bash
hermes
```

```
你好，请只回复"嗨！"
```

如果收到模型回复，说明配置成功。

## 第 4 步：切换模型（可选）

ZenMux 支持多种模型，您可以随时通过 `hermes model` 切换。

在终端中运行：

```bash
hermes model
```

配置完成后，供应商列表中会出现 ZenMux 的命名条目，例如：

```
   ...
   (○) Zenmux.ai (zenmux.ai/api/v1) — openai/gpt-5.2
   (○) Custom endpoint (enter URL manually)
   ...
```

选择 **"Zenmux.ai"** 条目，即可浏览该供应商下的可用模型并选择新的模型。选择完成后，下次启动 Hermes 即会使用新模型，修改会持久化保存。

::: tip 模型名称说明
ZenMux 使用的模型 ID 示例：
- `openai/gpt-5.2` → GPT-5.2
- `anthropic/claude-sonnet-4.5` → Claude Sonnet 4.5
- `deepseek/deepseek-chat` → DeepSeek Chat
- `google/gemini-3-pro-preview` → Gemini 3 Pro

完整的可用模型列表请查看 [ZenMux 模型列表](https://zenmux.ai/models)。
:::

## 使用 ZenMux 模型

配置完成后，您可以通过多种方式使用 ZenMux 模型：

### 通过 CLI 交互对话

```bash
# 启动 Hermes Agent 交互式会话（使用已配置的默认模型）
hermes

# 在对话中直接提问
> 用简单的话解释量子计算
```

## 故障排除

### 常见问题

::: details API Key 错误或认证失败
**问题**：出现 API Key 无效或未授权的错误，如 `401 Unauthorized`

**解决方案**：

1. **检查 API Key 格式**：
   - 订阅 API Key 应以 `sk-ss-v1-` 开头
   - 按量付费 API Key 应以 `sk-ai-v1-` 开头
   - 确保没有多余的空格或换行符

2. **重新运行 `hermes model`**：
   最简单的方式是重新运行向导，重新输入 API Key：
   ```bash
   hermes model
   ```

3. **验证 API Key 有效性**：
   - 订阅：访问[订阅管理页面](https://zenmux.ai/platform/subscription)检查订阅状态和配额
   - 按量付费：访问[按量付费页面](https://zenmux.ai/platform/pay-as-you-go)确保余额充足

4. **使用 config 命令验证**：
   ```bash
   hermes config
   hermes config check
   ```
:::

::: details 模型请求未发送到 ZenMux
**问题**：请求似乎发送到了默认供应商而非 ZenMux

**解决方案**：

1. **重新运行 `hermes model`**：
   重新选择 "Custom endpoint" 并确认 URL 为 `https://zenmux.ai/api/v1`

2. **检查当前配置**：
   ```bash
   hermes config
   ```
   确认 `model` 段的 `provider` 为 `custom`，`base_url` 为 `https://zenmux.ai/api/v1`

3. **注意 base_url 格式**：
   - 正确：`https://zenmux.ai/api/v1`
   - 错误：`https://zenmux.ai/v1`、`https://api.zenmux.ai/v1`
:::

::: details 连接失败或超时
**问题**：Hermes Agent 无法连接到 ZenMux

**解决方案**：

1. **测试网络连通性**：
   ```bash
   curl https://zenmux.ai/api/v1/models
   ```
   如果返回 JSON 模型列表，说明连接正常

2. **检查防火墙和代理**：
   - 确保防火墙没有阻止出站 HTTPS 连接
   - 如需使用代理，在 `~/.hermes/.env` 中设置 `HTTPS_PROXY`

3. **DNS 问题排查**：
   ```bash
   nslookup zenmux.ai
   ```
:::

::: details 模型回复异常或不支持工具调用
**问题**：模型回复不符合预期，或工具调用失败

**解决方案**：

1. **确认模型支持工具调用**：
   - Hermes Agent 依赖模型的原生工具调用（Function Calling）能力
   - 部分较小的模型可能不支持工具调用，导致 Agent 行为异常
   - 推荐使用 GPT-5.x、Claude Sonnet/Opus、Gemini Pro 等支持工具调用的模型

2. **切换到支持工具调用的模型**：
   在终端运行 `hermes model`，选择 ZenMux 供应商后切换到支持工具调用的模型

3. **检查模型名称是否正确**：
   - 使用 ZenMux 原始模型 ID，如 `openai/gpt-5.2`
   - 不要加 `zenmux/` 前缀
   - 查看 [ZenMux 模型列表](https://zenmux.ai/models) 确认模型 ID
:::

::: details 请求 429 速率限制
**问题**：频繁出现 429 Too Many Requests 错误

**解决方案**：

1. **检查套餐配额**：订阅套餐有请求频率限制，考虑升级套餐或切换到按量付费

2. **减少并发请求**：如果同时运行多个辅助模型任务，可以适当减少并发数

3. **联系 ZenMux 支持**：如果持续遇到速率限制问题，请联系 ZenMux 技术支持
:::

## 支持的模型

ZenMux 提供多种模型供选择。以下是 Hermes Agent 的一些热门选项：

| 模型 | ID | 最佳用途 |
| ---- | -- | -------- |
| GPT-5.4 | `openai/gpt-5.4` | 高性能通用、编码 |
| Claude Opus 4.6 | `anthropic/claude-opus-4.6` | 复杂推理、编码 |
| Claude Sonnet 4.6 | `anthropic/claude-sonnet-4.6` | 平衡性能 |
| Gemini 3 Pro | `google/gemini-3.1-pro-preview` | 多模态、长上下文 |
| DeepSeek V3.2 | `deepseek/deepseek-v3.2` | 高性价比通用 |
| Grok 4.2 Fast | `x-ai/grok-4.2-fast` | 快速推理 |
| Qwen3.6 Plus | `qwen/qwen3.6-plus` | 通用推理 |
| GLM 5.1 | `z-ai/glm-5.1` | 中文通用 |
| Kimi 2.5 | `moonshotai/kimi-k2.5` | 长上下文理解 |

完整的支持模型列表，请访问 [ZenMux 模型列表](https://zenmux.ai/models)。

## 联系我们

如果您在使用过程中遇到任何问题，或有建议和反馈，请通过以下渠道联系我们：

::: tip 获取帮助

- **官方网站**：<https://zenmux.ai>
- **技术支持邮箱**：[support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**：[bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**：[@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**：<http://discord.gg/vHZZzj84Bm>

更多联系方式和详情，请访问我们的[联系我们页面](https://docs.zenmux.ai/zh/help/contact)。
:::
