---
head:
  - - meta
    - name: description
      content: Moltbot 接入 ZenMux 使用指南
  - - meta
    - name: keywords
      content: Zenmux, 最佳实践, 集成, moltbot, OpenAI, API, 消息网关
---

# Moltbot 接入 ZenMux 使用指南

Moltbot 是一个强大的 AI 消息网关，可以将多个消息平台（WhatsApp、Telegram、Discord、Slack、Signal、iMessage 等）连接到 AI 模型。通过接入 ZenMux，您可以使用包括 GPT-5.2、Claude-4.5、Gemini-3、DeepSeek 等在内的多种模型。

::: info 兼容性说明
ZenMux 完全支持 OpenAI API 协议，可以通过简单配置与 Moltbot 配合使用。

注意 OpenAI 协议的 base_url 为 `https://zenmux.ai/api/v1`。
:::

## 前置条件

- Node.js 22 或更高版本
- ZenMux API Key（参见下方[第 0 步](#第-0-步获取-zenmux-api-key)）

## 接入方式

有两种方式将 ZenMux 与 Moltbot 配合使用：

| 方式 | 适用场景 | 复杂度 |
| ---- | -------- | ------ |
| [方式一：使用 ZenMux PR](#方式一使用-zenmux-pr) | 完整的 ZenMux 集成，自动发现模型 | 简单 |
| [方式二：手动配置](#方式二手动配置) | 稳定版本、自定义设置 | 中等 |

## 第 0 步：获取 ZenMux API Key

在配置 Moltbot 之前，您需要一个 ZenMux API Key。ZenMux 提供两种计费方式：

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

## 方式一：使用 ZenMux PR

使用 ZenMux 与 Moltbot 最简单的方式是使用待合并的 ZenMux 集成 PR，它提供了完整的 ZenMux 模型自动发现功能。

### 第 1 步：克隆并切换到 PR 分支

```bash
# 克隆 Moltbot 仓库
git clone https://github.com/moltbot/moltbot.git
cd moltbot

# 切换到 ZenMux 功能分支
git checkout feat/zenmux

# 安装依赖
pnpm install

# 构建项目
pnpm build
```

### 第 2 步：使用 ZenMux 运行引导程序

运行引导向导并选择 ZenMux 作为认证提供商：

```bash
pnpm moltbot onboard --auth-choice zenmux-api-key
```

按照提示输入您的 ZenMux API Key。向导将自动：
- 配置 ZenMux 提供商
- 从 ZenMux API 发现可用模型
- 为您设置默认模型

### 第 3 步：验证设置

列出可用模型以验证配置：

```bash
pnpm moltbot models list
```

您应该看到带有 `zenmux/` 前缀的 ZenMux 模型，例如：
- `zenmux/deepseek/deepseek-chat`
- `zenmux/openai/gpt-5.2`
- `zenmux/google/gemini-3-pro-preview`
- `zenmux/anthropic/claude-sonnet-4.5`

### 第 4 步：测试集成

发送测试消息以验证一切正常：

```bash
pnpm moltbot agent --local --agent main --message "你好，请只回复'嗨！'"
```

## 方式二：手动配置

如果您希望使用 Moltbot 的稳定版本或需要更多配置控制，可以在 `moltbot.json` 配置文件中手动将 ZenMux 配置为显式提供商。

### 第 1 步：安装 Moltbot

通过 npm 全局安装 Moltbot：

```bash
npm install -g moltbot
```

或运行引导向导设置 Moltbot：

```bash
moltbot onboard
```

### 第 2 步：配置 ZenMux 提供商

将 ZenMux 提供商配置添加到您的 `~/.clawdbot/moltbot.json`（或 `~/.moltbot/moltbot.json`）文件：

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "zenmux": {
        "baseUrl": "https://zenmux.ai/api/v1",
        "apiKey": "sk-ss-v1-your-api-key-here",
        "api": "openai-completions",
        "models": [
          {
            "id": "deepseek/deepseek-chat",
            "name": "DeepSeek Chat via ZenMux",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 64000,
            "maxTokens": 8192
          },
          {
            "id": "openai/gpt-5.2",
            "name": "GPT-5.2 via ZenMux",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 200000,
            "maxTokens": 8192
          },
          {
            "id": "google/gemini-3-pro-preview",
            "name": "Gemini 3 Pro via ZenMux",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 200000,
            "maxTokens": 8192
          },
          {
            "id": "anthropic/claude-sonnet-4.5",
            "name": "Claude Sonnet 4.5 via ZenMux",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 200000,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "zenmux/openai/gpt-5.2"
      },
      "models": {
        "zenmux/deepseek/deepseek-chat": {},
        "zenmux/openai/gpt-5.2": {},
        "zenmux/google/gemini-3-pro-preview": {},
        "zenmux/anthropic/claude-sonnet-4.5": {}
      }
    }
  }
}
```

::: warning 重要提示
请将 `sk-ss-v1-your-api-key-here` 替换为您的实际 ZenMux API Key。
:::

### 第 3 步：添加更多模型（可选）

您可以在 `models` 数组中添加更多模型。请查看 [ZenMux 模型列表](https://zenmux.ai/models) 了解可用模型及其功能。

每个模型定义需要：

| 字段 | 说明 |
| ---- | ---- |
| `id` | ZenMux 中显示的模型 ID（例如 `openai/gpt-5.2`） |
| `name` | 模型的显示名称 |
| `reasoning` | 模型是否支持推理模式 |
| `input` | 输入类型：`["text"]` 或 `["text", "image"]` |
| `cost` | 成本配置（订阅套餐设为 0） |
| `contextWindow` | 最大上下文窗口大小（token 数） |
| `maxTokens` | 最大输出 token 数 |

### 第 4 步：验证配置

列出可用模型：

```bash
moltbot models list
```

您应该看到已配置的 ZenMux 模型：

```
Model                                      Input      Ctx      Local Auth  Tags
zenmux/deepseek/deepseek-chat              text       63k      no    yes   configured
zenmux/openai/gpt-5.2                      text+image 195k     no    yes   default,configured
zenmux/google/gemini-3-pro-preview         text+image 195k     no    yes   configured
zenmux/anthropic/claude-sonnet-4.5         text+image 195k     no    yes   configured
```

### 第 5 步：设置默认模型

设置您偏好的默认模型：

```bash
moltbot models set zenmux/openai/gpt-5.2
```

## 使用 ZenMux 模型

配置完成后，您可以通过多种方式使用 ZenMux 模型：

### 通过 CLI Agent

```bash
# 运行快速 agent 命令
moltbot agent --local --agent main --message "用简单的话解释量子计算"
```

### 通过消息通道

配置您的消息通道（WhatsApp、Telegram、Discord 等），网关将自动使用您配置的 ZenMux 模型：

```bash
# 启动网关
moltbot gateway run

# 检查通道状态
moltbot channels status
```

### 切换模型

您可以随时切换模型：

```bash
# 设置不同的默认模型
moltbot models set zenmux/anthropic/claude-sonnet-4.5

# 或在命令中指定模型（仅方式一）
moltbot agent --local --agent main --model zenmux/deepseek/deepseek-chat --message "你好"
```

## 故障排除

### 常见问题

::: details API Key 错误或认证失败
**问题**：出现 API Key 无效或未授权的错误

**解决方案**：

1. **检查 API Key 格式**：
   - 订阅 API Key 应以 `sk-ss-v1-` 开头
   - 按量付费 API Key 应以 `sk-ai-v1-` 开头
   - 确保没有多余的空格或换行符

2. **验证 API Key**：
   - 订阅：访问[订阅管理页面](https://zenmux.ai/platform/subscription)检查订阅状态和配额
   - 按量付费：访问[按量付费页面](https://zenmux.ai/platform/pay-as-you-go)确保余额充足

3. **检查配置文件语法**：
   - 确保 JSON 格式正确（无尾随逗号、正确引号）
   - 验证 API Key 正确放置在 `apiKey` 字段中
:::

::: details 模型未找到
**问题**：Moltbot 报告找不到模型

**解决方案**：

1. **方式一（PR 分支）**：
   - 确保您在 `feat/zenmux` 分支上
   - 拉取最新更改后运行 `pnpm build`

2. **方式二（手动配置）**：
   - 验证模型已在 `models.providers.zenmux.models` 中定义
   - 检查模型 ID 是否完全匹配（区分大小写）
   - 同时将模型添加到 `agents.defaults.models`
:::

::: details 连接失败
**问题**：Moltbot 无法连接到 ZenMux

**解决方案**：

- 检查网络连接是否正常
- 验证 `baseUrl` 设置为 `https://zenmux.ai/api/v1`
- 确保防火墙没有阻止出站 HTTPS 连接
- 尝试运行 `curl https://zenmux.ai/api/v1/models` 测试连通性
:::

::: details 显示缓存的旧模型
**问题**：配置更改后仍显示旧模型

**解决方案**：

1. 终止运行中的网关进程：
   ```bash
   pkill -9 -f moltbot-gateway
   ```

2. 重新构建项目（如果使用方式一）：
   ```bash
   pnpm build
   ```

3. 再次列出模型：
   ```bash
   moltbot models list
   ```
:::

## 支持的模型

ZenMux 提供多种模型供选择。以下是 Moltbot 的一些热门选项：

| 模型 | ID | 最佳用途 |
| ---- | -- | -------- |
| GPT-5.2 | `openai/gpt-5.2` | 通用、编码 |
| Claude Sonnet 4.5 | `anthropic/claude-sonnet-4.5` | 平衡性能 |
| Claude Opus 4.5 | `anthropic/claude-opus-4.5` | 复杂推理 |
| Gemini 3 Pro | `google/gemini-3-pro-preview` | 多模态任务 |
| DeepSeek Chat | `deepseek/deepseek-chat` | 高性价比编码 |
| Qwen3 Coder | `alibaba/qwen3-coder-plus` | 代码生成 |

完整的支持模型列表，请访问 [ZenMux 模型列表](https://zenmux.ai/models)。

## 联系我们

如果您在使用过程中遇到任何问题，或有建议和反馈，请通过以下渠道联系我们：

::: tip 获取帮助

- **官方网站**：<https://zenmux.ai>
- **技术支持邮箱**：[support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**：[bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**：[@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**：<http://discord.gg/vHZZzj84Bm>

更多联系方式和详情，请访问我们的[联系我们页面](/zh/help/contact)。
:::
