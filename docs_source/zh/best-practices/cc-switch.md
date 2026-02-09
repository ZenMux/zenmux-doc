---
head:
  - - meta
    - name: description
      content: 通过 CC-Switch 管理 ZenMux 与 Claude Code / Codex / Gemini CLI / OpenCode 的集成配置
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, CC-Switch, cc-switch, Claude Code, Codex, Gemini CLI, OpenCode, 模型切换, provider
---

# 通过 ZenMux 使用 CC-Switch 指南

[CC-Switch](https://github.com/farion1231/cc-switch) 是一款开源的跨平台桌面工具，专为统一管理 AI 编码助手的配置而设计。它支持同时管理 Claude Code、Codex、Gemini CLI 和 OpenCode 四大编码工具的供应商配置，让您无需手动编辑环境变量或 JSON 文件，即可通过可视化界面一键切换不同的 API 供应商。

::: info 兼容性说明
CC-Switch 支持管理 **Claude Code**、**Codex**、**Gemini CLI** 和 **OpenCode** 四种编码工具。通过在 CC-Switch 中配置 ZenMux 作为供应商，您可以：

- **可视化管理**：告别手动编辑环境变量和配置文件，通过图形界面完成所有配置
- **一键切换**：在 ZenMux 与其他供应商之间即时切换，无需重启终端
- **统一配置**：一次配置 ZenMux，同步到多个编码工具
- **自动故障切换**：当主供应商异常时，自动切换到备用供应商
- **请求监控**：实时查看请求日志和用量统计

CC-Switch 支持 Anthropic 协议和 OpenAI 协议，均可与 ZenMux 无缝集成。
:::

## 安装 CC-Switch

### macOS

::: code-group

```bash [Homebrew (推荐)]
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

```text [手动安装]
1. 前往 CC-Switch Release 页面下载最新的 macOS ZIP 包：
   https://github.com/farion1231/cc-switch/releases

2. 解压后将 CC-Switch.app 拖入 Applications 文件夹

3. 首次打开可能提示"无法验证开发者"，前往：
   系统设置 → 隐私与安全性 → 点击"仍然打开"
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

::: tip 💡 Web UI（无头/SSH 环境）
CC-Switch 还提供了 Web UI 版本，适用于无图形界面的服务器或 SSH 远程环境。从 Release 页面下载 Linux x64 的 tar.gz 包，解压后运行即可，默认端口为 17666。
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
2. 充值账户（充值自动赠送 20% 额外积分）
3. 在 "Pay As You Go API Keys" 区域创建 API Key

详细说明请参考：按量付费指南
📚 https://docs.zenmux.ai/zh/guide/pay-as-you-go
```

:::

::: warning 💡 重要提示：选择正确的 API Key 类型

- **个人开发/学习场景** → 使用 **订阅制 API Key**（`sk-ss-v1-xxx`），成本更低、更划算
- **生产环境/商业化项目** → 使用 **按量付费 API Key**（`sk-ai-v1-xxx`），稳定性更高、无限制

订阅制禁止用于生产环境，违规使用将导致账号受限。
:::

## 配置 ZenMux 供应商

### 步骤 1：打开供应商管理

![cc-switch](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/09/uswXpro/20260209164412.jpg)

启动 CC-Switch 后，在头部导航栏中选择您要配置的编码工具（如 **Claude Code**），进入供应商管理页面。

::: tip 💡 首次启动
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
| **Sonnet（平衡）** | `anthropic/claude-sonnet-4.5` | 日常开发推荐，性价比最优 |
| **Opus（强力）**   | `anthropic/claude-opus-4.5`   | 复杂架构设计、大规模重构 |

::: tip 💡 模型选择灵活
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
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "anthropic/claude-opus-4.5",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "anthropic/claude-sonnet-4.5",
    "ANTHROPIC_MODEL": "anthropic/claude-opus-4.5",
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

| 配置项            | 值                                | 说明                      |
| ----------------- | --------------------------------- | ------------------------- |
| **Provider Name** | `ZenMux`                          | 自定义名称，便于识别      |
| **Base URL**      | `https://zenmux.ai/api/vertex-ai` | ZenMux Vertex AI 兼容端点 |
| **API Key**       | `sk-ss-v1-xxx` 或 `sk-ai-v1-xxx`  | 您的 ZenMux API Key       |

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

::: warning 🔑 重要：替换 API Key
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
CC-Switch 支持热切换供应商，**无需重启终端或编码工具**。切换后，新的请求会立即通过 ZenMux 转发，已有的对话上下文不受影响。
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

## 故障排除

### 常见问题解决

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
   - Gemini CLI（Vertex AI 协议）：`https://zenmux.ai/api/vertexai`
     :::

::: details macOS 提示"无法验证开发者"
**问题**：首次打开 CC-Switch 时提示"无法验证开发者"

**解决方案**：

由于开发者暂未获得 Apple Developer 签名，macOS 会拦截首次运行。

1. 前往 **系统设置** → **隐私与安全性**
2. 在页面底部找到被阻止的 CC-Switch 提示
3. 点击 **仍然打开**
4. 在弹出的确认对话框中点击 **打开**

后续启动将不再出现此提示。
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
- 确保模型映射中填写的模型 ID 正确（如 `anthropic/claude-sonnet-4.5`，而非 `claude-sonnet-4.5`）
- 选择上述支持列表中的模型进行使用
  :::

::: tip 联系我们
如果您在使用过程中遇到任何问题，或有任何建议和反馈，欢迎通过以下方式联系我们：

- **官方网站**：<https://zenmux.ai>
- **技术支持邮箱**：[support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**：[bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**：[@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**：<http://discord.gg/vHZZzj84Bm>

更多联系方式和详细信息，请访问我们的[联系我们页面](/zh/help/contact)。

CC-Switch 项目相关问题，请前往 [CC-Switch GitHub Issues](https://github.com/farion1231/cc-switch/issues) 反馈。
:::
