---
title: cc-switch — 一键切换 Claude Code 订阅与 API 配置
titleTemplate: false
description: cc-switch 是一款免费、开源的跨平台桌面应用，可一键切换 Claude Code 的 Anthropic 订阅与 ZenMux 等 API 供应商配置。
seo:
  type: article
  keywords: Zenmux, best practices, integration, CC-Switch, cc-switch, Claude Code, Codex, Gemini CLI, OpenCode, 模型切换, provider
  image: https://cdn.marmot-cloud.com/storage/zenmux/2026/06/12/y4TPMcW/single.png
  imageWidth: 1200
  imageHeight: 630
  imageType: image/png
  imageAlt: ZenMux — 统一接入 100+ AI 模型
  ogLocale: zh_CN
  twitterDescription: cc-switch 是一款免费、开源的跨平台桌面应用，可一键切换 Claude Code 的 Anthropic 订阅与 ZenMux 等 API 供应商配置。
  faq: true
  howTo: false
  article:
    headline: cc-switch — 切换 Claude Code 订阅与 API 配置的开源工具
    datePublished: "2026-02-09"
    dateModified: "2026-07-17"
    about:
      - type: SoftwareApplication
        name: cc-switch
      - type: Thing
        name: Claude Code
      - type: Thing
        name: API 供应商切换
---

# cc-switch — 切换 Claude Code 订阅与 API 配置的开源工具

## 什么是 cc-switch？

[cc-switch](https://github.com/farion1231/cc-switch) 是一款免费、开源的桌面应用，用于统一管理 AI 编码工具配置。开发者无需手动编辑环境变量或 JSON 文件，就能在 Claude Code 的 Anthropic 订阅与 ZenMux 等 API 供应商之间切换。该应用支持 macOS、Windows 和 Linux。

## 为什么使用 cc-switch？

- **订阅额度用完后继续工作**：切换到按 API 用量计费的 ZenMux 配置，无需等待订阅额度重置。
- **管理多套供应商配置**：将工作、个人和实验配置隔离保存，需要时再启用。
- **按任务选择不同模型**：把 Claude Code 的模型档位映射到 ZenMux 上兼容的模型。
- **统一管理多个编码工具**：用相同的可视化流程管理 Claude Code、Claude Desktop、Codex、Gemini CLI、OpenCode、OpenClaw 和 Hermes Agent。

## cc-switch 如何工作？

在标准供应商切换模式下，cc-switch 会把配置保存在本地 SQLite 数据库，并将当前启用的配置写入编码工具的实时配置文件。Claude Code 目前支持无需重启即可切换供应商数据；多数其他 CLI 工具需要新开终端或重新启动应用，才能读取更新后的配置。

cc-switch 还提供可选的 **Proxy & Failover** 模式。启用后，本地代理可以提供热切换、协议转换、健康检查和故障转移；未启用代理模式时，请求会由编码工具直接发送到所配置的供应商端点。

::: info 兼容性说明
cc-switch 支持管理 **Claude Code**、**Claude Desktop**、**Codex**、**Gemini CLI**、**OpenCode**、**OpenClaw** 和 **Hermes Agent**。本文提供经过验证的 Claude Code、Codex、Gemini CLI 和 OpenCode 的 ZenMux 配置。通过这些集成，您可以：

- **可视化管理**：告别手动编辑环境变量和配置文件，通过图形界面完成所有配置
- **一键切换**：从应用或系统托盘启用 ZenMux 或其他已保存配置
- **统一配置**：一次配置 ZenMux，同步到多个编码工具
- **可选故障转移**：需要健康检查和自动兜底时启用本地代理
- **可选用量监控**：通过代理模式的仪表盘查看请求、Token 和预估成本

CC-Switch 支持 Anthropic 协议和 OpenAI 协议，均可与 ZenMux 无缝集成。
:::

## 快速开始：安装并配置 cc-switch

### macOS

::: code-group

```bash [Homebrew (推荐)]
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

```text [手动安装]
1. 前往 CC-Switch Release 页面下载最新的 macOS DMG（推荐）或 ZIP 包：
   https://github.com/farion1231/cc-switch/releases

2. 打开安装包并将 CC-Switch.app 移入 Applications 文件夹
```

:::

### Windows

::: code-group

```text [MSI 安装包 (推荐)]
1. 前往 CC-Switch Release 页面下载最新的 .msi 安装包：
   https://github.com/farion1231/cc-switch/releases

2. 双击 .msi 文件，按提示完成安装
```

```text [便携版]
1. 前往 CC-Switch Release 页面下载最新的 .zip 便携版：
   https://github.com/farion1231/cc-switch/releases

2. 解压到任意目录，双击 CC-Switch.exe 运行
```

:::

### Linux

::: code-group

```bash [Debian/Ubuntu (.deb)]
# 从 Release 页面下载 .deb 包后执行
sudo dpkg -i cc-switch_*.deb
```

```text [AppImage]
1. 从 Release 页面下载 .AppImage 文件
2. 添加可执行权限：chmod +x CC-Switch_*.AppImage
3. 双击运行或在终端执行：./CC-Switch_*.AppImage
```

:::

## 获取 ZenMux API Key

在配置 CC-Switch 之前，您需要先获取 ZenMux API Key。ZenMux 提供两种计费方案，请根据使用场景选择：

::: code-group

```text [订阅制 API Key (推荐)]
✅ 适用场景：个人开发、学习探索、Vibe Coding
✅ 特点：固定月费、可预测成本、5-10倍价格杠杆
✅ API Key 格式：sk-ss-v1-xxx

获取方式：
1. 访问订阅管理页面：https://zenmux.ai/platform/subscription
2. 选择适合的套餐（Pro $20/月、Max $100/月、Ultra $200/月）
3. 完成订阅后，在页面中创建订阅制 API Key

详细说明请参考：订阅制套餐指南
📚 https://docs.zenmux.ai/zh/guide/subscription
```

```text [按量付费 API Key]
✅ 适用场景：生产环境、商业化产品、企业级应用
✅ 特点：无 Rate Limit、生产级稳定、按实际消耗计费
✅ API Key 格式：sk-ai-v1-xxx

获取方式：
1. 访问按量付费页面：https://zenmux.ai/platform/pay-as-you-go
2. 充值账户
3. 在 "Pay As You Go API Keys" 区域创建 API Key

详细说明请参考：按量付费指南
📚 https://docs.zenmux.ai/zh/guide/pay-as-you-go
```

:::

::: warning 重要提示：选择正确的 API Key 类型

- **个人开发/学习场景** → 使用 **订阅制 API Key**（`sk-ss-v1-xxx`），成本更低、更划算
- **生产环境/商业化项目** → 使用 **按量付费 API Key**（`sk-ai-v1-xxx`），稳定性更高、无限制

订阅制禁止用于生产环境，违规使用将导致账号受限。
:::

## 支持的工具与供应商

cc-switch 支持 Claude Code、Claude Desktop、Codex、Gemini CLI、OpenCode、OpenClaw 和 Hermes Agent，内置 50 多个供应商预设，同时支持自定义端点。只要工具接受 Anthropic、OpenAI 兼容或 Vertex AI 协议，就可以配置对应的 ZenMux 端点。

供应商配置决定每个工具使用的端点、API 凭证和模型映射。Universal Provider 可以在 Claude Code、Codex 和 Gemini CLI 之间共享兼容设置，各工具的专属字段仍独立保存。

## 通过 ZenMux 切换 Claude Code 订阅与 API

这是最常见的 cc-switch 使用方式：平时保留 Anthropic 官方订阅配置，需要按 API 用量计费或使用其他兼容模型时，再启用 ZenMux API 配置。

1. 按上面的方式创建 ZenMux API Key。
2. 在 cc-switch 中选择 **Claude Code**，点击**添加供应商**，新建名为 `ZenMux` 的配置。
3. 将 **Base URL** 设置为 `https://zenmux.ai/api/anthropic`，并填写 ZenMux API Key。
4. 从 [ZenMux 模型目录](https://zenmux.ai/models?sort=newest&supported_protocol=messages)中选择当前支持 Anthropic API 的模型，映射到 Haiku、Sonnet 和 Opus 档位。
5. 保存并点击**启用**。需要切回订阅时，启用 Anthropic 官方配置，并按提示完成登录。

Claude Code 支持供应商数据热切换。如果已有会话仍使用旧凭证，请先新开一个 Claude Code 会话，再排查供应商配置。

## 配置 ZenMux 供应商

### 步骤 1：打开供应商管理

![cc-switch](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/09/uswXpro/20260209164412.jpg)

启动 CC-Switch 后，在头部导航栏中选择您要配置的编码工具（如 **Claude Code**），进入供应商管理页面。

::: info 首次启动
CC-Switch 首次启动时会自动导入您本机已有的 Claude Code / Codex / Gemini CLI / OpenCode 配置作为默认供应商，无需手动迁移。
:::

### 步骤 2：添加 ZenMux 供应商

![cc-switch](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/09/T5cWxov/20260209164503.jpg)

点击添加供应商按钮，填写以下配置信息：

#### Claude Code 配置（Anthropic 协议）

| 配置项            | 值                                | 说明                      |
| ----------------- | --------------------------------- | ------------------------- |
| **Provider Name** | `ZenMux`                          | 自定义名称，便于识别      |
| **Base URL**      | `https://zenmux.ai/api/anthropic` | ZenMux Anthropic 兼容端点 |
| **API Key**       | `sk-ss-v1-xxx` 或 `sk-ai-v1-xxx`  | 您的 ZenMux API Key       |

配置模型映射（Model Mapping），将 Claude Code 的三个速度档位映射到 ZenMux 上的模型：

| 档位               | 推荐模型                      | 说明                     |
| ------------------ | ----------------------------- | ------------------------ |
| **Haiku（快速）**  | `anthropic/claude-haiku-4.5`  | 适合快速补全、简单任务   |
| **Sonnet（平衡）** | `anthropic/claude-sonnet-4.6` | 日常开发推荐，性价比最优 |
| **Opus（强力）**   | `anthropic/claude-opus-4.8`   | 复杂架构设计、大规模重构 |

::: info 模型选择灵活
通过 ZenMux，您不仅可以使用 Claude 系列模型，还可以映射到其他供应商的模型。例如：

- Haiku 档位 → `volcengine/doubao-seed-code`（豆包编码模型）
- Sonnet 档位 → `openai/gpt-5.2`（GPT-5.2）
- Opus 档位 → `google/gemini-3-pro-preview`（Gemini 3 Pro）

更多支持 Anthropic 协议的模型，请查看 [ZenMux 模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=messages)。
:::

##### 配置JSON示例（可直接复制）

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "<ZENMUX_API_KEY>",
    "ANTHROPIC_BASE_URL": "https://zenmux.ai/api/anthropic",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "anthropic/claude-haiku-4.5",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "anthropic/claude-opus-4.8",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "anthropic/claude-sonnet-4.6",
    "ANTHROPIC_MODEL": "anthropic/claude-opus-4.8",
    "API_TIMEOUT_MS": "30000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

![cc-switch](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/09/kkTHUGK/20260209164546.jpg)
将上述代码复制粘贴到 Claude Code 的配置文件中，保存后即可完成配置。

#### Codex

| 配置项            | 值                               | 说明                   |
| ----------------- | -------------------------------- | ---------------------- |
| **Provider Name** | `ZenMux`                         | 自定义名称，便于识别   |
| **Base URL**      | `https://zenmux.ai/api/v1`       | ZenMux OpenAI 兼容端点 |
| **API Key**       | `sk-ss-v1-xxx` 或 `sk-ai-v1-xxx` | 您的 ZenMux API Key    |

##### 配置config.toml示例（可直接复制）

```toml
model_provider = "zenmux"
model = "openai/gpt-5.2-codex"

[model_providers.zenmux]
name = "ZenMux"
base_url = "https://zenmux.ai/api/v1"
wire_api = "responses"
```

![cc-switch](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/09/eOrFLVY/20260209164614.jpg)
将上述代码复制粘贴到 Codex 的配置文件中，保存后即可完成配置。

#### Gemini CLI 配置（Vertex AI 协议）

| 配置项            | 值                                | 说明                      |
| ----------------- | --------------------------------- | ------------------------- |
| **Provider Name** | `ZenMux`                          | 自定义名称，便于识别      |
| **Base URL**      | `https://zenmux.ai/api/vertex-ai` | ZenMux Vertex AI 兼容端点 |
| **API Key**       | `sk-ss-v1-xxx` 或 `sk-ai-v1-xxx`  | 您的 ZenMux API Key       |

##### 配置环境变量示例（可直接复制）

```env
GOOGLE_GEMINI_BASE_URL=https://zenmux.ai/api/vertex-ai
GEMINI_API_KEY=<ZENMUX_API_KEY>
GEMINI_MODEL=google/gemini-3-flash-preview
```

![cc-switch](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/09/erTlGCt/20260209164639.jpg)
将上述代码复制粘贴到 Gemini CLI 的配置文件中，保存后即可完成配置。

#### OpenCode 配置（OpenAI 协议）

| 配置项            | 值                               | 说明                   |
| ----------------- | -------------------------------- | ---------------------- |
| **Provider Name** | `ZenMux`                         | 自定义名称，便于识别   |
| **Base URL**      | `https://zenmux.ai/api/v1`       | ZenMux OpenAI 兼容端点 |
| **API Key**       | `sk-ss-v1-xxx` 或 `sk-ai-v1-xxx` | 您的 ZenMux API Key    |

##### 配置JSON示例（可直接复制）

```json
{
  "models": {
    "openai/gpt-5.2": {
      "name": "gpt-5.2 (via ZenMux)"
    }
  },
  "npm": "@ai-sdk/openai-compatible",
  "options": {
    "apiKey": "<ZENMUX_API_KEY>",
    "baseURL": "https://zenmux.ai/api/v1"
  }
}
```

![cc-switch](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/09/48cGZ8v/20260209164702.jpg)
将上述代码复制粘贴到 OpenCode 的配置文件中，保存后即可完成配置。

::: warning 重要：替换 API Key
请确保将配置中的 `<ZENMUX_API_KEY>` 替换为您的真实 ZenMux API Key：

**订阅制 API Key（推荐个人开发）**

- 格式：`sk-ss-v1-xxx`
- 获取位置：[订阅管理页面](https://zenmux.ai/platform/subscription)
- 详细指南：[订阅制套餐文档](/zh/guide/subscription)

**按量付费 API Key（生产环境）**

- 格式：`sk-ai-v1-xxx`
- 获取位置：[按量付费页面](https://zenmux.ai/platform/pay-as-you-go)
- 详细指南：[按量付费文档](/zh/guide/pay-as-you-go)
:::

### 步骤 3：切换到 ZenMux 供应商

添加完成后，在供应商列表中点击 **ZenMux** 条目旁的切换按钮，即可将当前编码工具的请求切换到 ZenMux。

::: info 热切换支持
Claude Code 目前支持供应商数据热切换，因此新启用的配置可以在不重启终端的情况下生效。多数其他工具需要新开终端或重启应用来重新读取配置。若启用 cc-switch 的可选本地代理，Proxy & Failover 功能还会提供另一套热切换机制。
:::

### 步骤 4：跨应用共享配置（可选）

如果您同时使用多个编码工具，CC-Switch 支持将同一个供应商配置同步到所有管理的应用。这对于像 ZenMux 这样支持多协议的 API 网关尤为方便：

1. 在供应商配置中启用 **跨应用共享**（Universal Provider）
2. 为每个应用分别设置默认模型映射
3. 保存后，该供应商会自动同步到 Claude Code、Codex、Gemini CLI 和 OpenCode

## 支持的模型

::: info Anthropic 协议支持模型说明
支持 Anthropic 协议的模型正在分批适配中，当前已支持的模型可以通过[官方模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=messages)筛选 Anthropic Messages 协议查看。

OpenAI 协议支持的模型数量更为丰富，可通过[模型列表](https://zenmux.ai/models)筛选 "OpenAI API Compatible" 查看。
:::

## 常见故障排除

::: details API Key 错误或认证失败
**问题**：配置供应商后提示 API Key 无效或未授权

**解决方案**：

1. **检查 API Key 格式**：
   - 订阅制 API Key 应以 `sk-ss-v1-` 开头
   - 按量付费 API Key 应以 `sk-ai-v1-` 开头
   - 确认没有多余的空格或换行符

2. **验证 API Key 有效性**：
   - 订阅制：访问 [订阅管理页面](https://zenmux.ai/platform/subscription) 检查订阅状态和配额
   - 按量付费：访问 [按量付费页面](https://zenmux.ai/platform/pay-as-you-go) 检查余额是否充足

3. **确认 Base URL 配置正确**：
   - Claude Code（Anthropic 协议）：`https://zenmux.ai/api/anthropic`
   - Codex / OpenCode（OpenAI 协议）：`https://zenmux.ai/api/v1`
   - Gemini CLI（Vertex AI 协议）：`https://zenmux.ai/api/vertex-ai`
:::

::: details macOS 阻止打开应用
**问题**：macOS 阻止打开已下载的应用

**解决方案**：

当前 cc-switch 版本已经过代码签名和 Apple 公证。请先从官方 GitHub Releases 页面下载最新 DMG；如果 macOS 仍然阻止打开：

1. 前往 **系统设置** → **隐私与安全性**
2. 在页面底部找到被阻止的 CC-Switch 提示
3. 点击 **仍然打开**
4. 在弹出的确认对话框中点击 **打开**

请避免使用第三方下载站提供的未签名安装包。
:::

::: details 切换供应商后编码工具无响应
**问题**：在 CC-Switch 中切换到 ZenMux 后，编码工具的请求没有变化

**解决方案**：

1. 确认 CC-Switch 是否处于运行状态（系统托盘图标应可见）
2. 检查 CC-Switch 中对应编码工具的供应商是否已正确切换（当前生效的供应商会高亮显示）
3. 尝试在编码工具中发起新的请求，确认是否走 ZenMux 通道
4. 如果仍不生效，尝试重启编码工具后再测试
:::

::: details 模型不支持 Anthropic 协议
**问题**：在 Claude Code 中使用某个模型时提示不支持 Anthropic 协议

**解决方案**：

- 请通过 [ZenMux 模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=messages) 筛选 "Anthropic API Compatible" 查看当前支持的模型
- 确保模型映射中填写的模型 ID 正确（如 `anthropic/claude-sonnet-4.6`，而非 `claude-sonnet-4.6`）
- 选择上述支持列表中的模型进行使用
:::

## 常见问题

### cc-switch 是什么，可以做什么？

cc-switch 是一款免费、开源的桌面应用，用于管理 Claude Code 等 AI 编码工具的配置。它可以在 Anthropic 订阅配置和 ZenMux 等 API 供应商之间切换，无需手动编辑配置文件。

### cc-switch 可以免费使用吗？

可以。cc-switch 采用 MIT 许可证，可免费安装和使用。Anthropic、ZenMux 或其他供应商的订阅费和 API 用量费用需要另外支付。

### cc-switch 只支持 macOS，还是也支持 Windows 和 Linux？

cc-switch 支持 macOS、Windows 和 Linux。安装包可从官方 GitHub Releases 页面下载，macOS 还支持通过 Homebrew 安装。

### Claude Code 订阅和 API 配置可以同时使用吗？

可以在 cc-switch 中同时保存两种配置并随时切换，但一套 Claude Code 配置在同一时间只会启用一个供应商。需要切回订阅时，请启用 Anthropic 官方配置，并在需要时完成登录。

### Claude Code 订阅额度用完后，cc-switch 有什么帮助？

启用 ZenMux API 配置后，可以改用按 API 用量计费的方式继续工作，无需等待订阅额度重置。请从 ZenMux 当前模型目录中选择支持 Anthropic Messages 协议的模型；可用性和价格取决于所选模型及计费方式。

### cc-switch 会代理或记录我的 API 请求吗？

标准供应商切换只会把所选配置写入编码工具，工具将直接连接该供应商端点。只有主动启用 cc-switch 的本地 Proxy & Failover 模式时，代理才会进入请求链路，并可提供请求和用量统计。启用前请检查 cc-switch 的代理设置。

## 相关资源

- [如何获取 Anthropic API Key](https://zenmux.ai/blog/how-to-get-your-anthropic-api-key-a-step-by-step-guide)
- [Claude Code 接入 ZenMux 最佳实践](/zh/best-practices/claude-code)
- [通过 ZenMux 使用 Claude Agent SDK](https://zenmux.ai/blog/claude-agent-sdk)
- [ZenMux 上的 Claude Opus 4.8 API](https://zenmux.ai/anthropic/claude-opus-4.8)
- [浏览 ZenMux 上的 Anthropic 模型](https://zenmux.ai/anthropic)
- [从 OpenRouter 切换到 ZenMux](https://zenmux.ai/blog/openrouter-alternatives-you-should-try-cheaper-faster-and-more-flexible-options)

<ContactCards>
<ContactCard icon="mail" title="邮箱">

技术支持: [support@zenmux.ai](mailto:support@zenmux.ai)

商务合作: [bd@zenmux.ai](mailto:bd@zenmux.ai)

</ContactCard>
<ContactCard icon="x" title="X / Twitter" link="https://x.com/ZenMuxAI" label="@ZenMuxAI" />
<ContactCard icon="discord" title="Discord" link="https://discord.gg/vHZZzj84Bm" label="@ZenMuxAI" />
</ContactCards>
