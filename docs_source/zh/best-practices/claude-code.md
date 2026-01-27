# 通过 ZenMux 使用 Claude Code CLI 指南

::: info 兼容性说明

Claude Code 是 Anthropic 推出的官方 Coding Agent，通过与 ZenMux 的集成，您可以使用更多模型选择，而不仅仅局限于 Claude 官方模型。

例如，您可以通过 ZenMux 在 Claude Code 中使用 GPT-5.2系列、Claude-4.5系列、Gemini-3系列、Grok 4.1系列、Doubao-Seed-Code、Kimi-K2、Minimax-M2、GLM-4.6、DeepSeek-V3.2、Qwen3-Coder-Plus等模型，更多支持的模型请见[官方模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=messages)。

ZenMux 完全支持 Anthropic API 协议，可以无缝集成到 Claude Code、Cursor 等工具中。只需修改两个参数即可使用。

注意 Anthropic 协议的 base_url="<https://zenmux.ai/api/anthropic"。>
:::

## 配置方案

### 安装 Claude Code

::: warning 重要更新：npm/pnpm 安装方式已废弃
Claude Code 的 npm/pnpm 安装方式已经废弃，不再推荐使用。如果您之前通过 npm/pnpm 安装过 Claude Code，请先卸载旧版本，然后使用新的原生安装方式。

**卸载旧版本（如果适用）：**

```bash
# 卸载 npm/pnpm 安装的版本
npm uninstall -g @anthropic-ai/claude-code
# 或
pnpm uninstall -g @anthropic-ai/claude-code

# 如果已经是原生安装，可以直接运行迁移命令
claude install
```

:::

**推荐安装方式（原生安装）：**

::: code-group

```bash [macOS/Linux/WSL]
# 一键安装脚本（推荐）
curl -fsSL https://claude.ai/install.sh | bash
```

```powershell [Windows PowerShell]
# PowerShell 安装脚本
irm https://claude.ai/install.ps1 | iex
```

```batch [Windows CMD]
# CMD 安装脚本
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

```bash [Homebrew (macOS)]
# 使用 Homebrew 安装
brew install --cask claude-code

# 注意：Homebrew 安装不会自动更新，需要手动更新
# 更新命令：brew upgrade claude-code
```

```powershell [WinGet (Windows)]
# 使用 WinGet 安装
winget install Anthropic.ClaudeCode

# 注意：WinGet 安装不会自动更新，需要手动更新
# 更新命令：winget upgrade Anthropic.ClaudeCode
```

:::

::: tip 💡 安装说明

- **原生安装（推荐）**：macOS/Linux/WSL 和 Windows 的脚本安装方式会自动更新，保持您始终使用最新版本
- **包管理器安装**：Homebrew 和 WinGet 方式需要手动运行更新命令来获取新版本
- **完整安装文档**：如需了解详细的安装选项、系统要求、认证方式等信息，请参考 [Claude Code 官方安装文档](https://code.claude.com/docs/en/setup)
- **安装验证**：安装完成后可以运行 `claude doctor` 检查安装状态

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

### 步骤 0：获取 ZenMux API Key

在配置 Claude Code 之前，您需要先获取 ZenMux API Key。ZenMux 提供两种计费方案，请根据使用场景选择：

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

### 步骤 1：配置 Shell 环境变量（推荐方式）

本步骤将把 ZenMux 连接配置写入您的 shell 配置文件中，使其在每次打开终端时自动生效。

::: code-group

```bash [macOS/Linux]
# ============== 操作步骤 ==============

# 1. 确定您使用的 shell 类型（通常是 bash 或 zsh）：
#    - 如果使用 bash，编辑 ~/.bashrc
#    - 如果使用 zsh，编辑 ~/.zshrc
#    - 不确定的话可以运行 echo $SHELL 查看

# 2. 将以下内容追加到对应的配置文件末尾（注意替换 API Key）

# ============= ZenMux + Claude Code 配置 =============
# 将 Claude Code 连接到 ZenMux 服务，而非 Anthropic 官方服务

# 核心配置：ZenMux 服务端点和认证
export ANTHROPIC_BASE_URL="https://zenmux.ai/api/anthropic"  # ZenMux Anthropic 兼容端点
export ANTHROPIC_AUTH_TOKEN="sk-ss-v1-xxx"                   # 替换为您的 ZenMux API Key（订阅制 sk-ss-v1-xxx 或按量付费 sk-ai-v1-xxx）
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"          # 禁用非必要流量

# 避免冲突：如果您本机曾设置过 ANTHROPIC_API_KEY，建议显式置空
export ANTHROPIC_API_KEY=""

# 默认模型配置（必需）：定义 Haiku / Sonnet / Opus 三个速度档位对应的模型
export ANTHROPIC_DEFAULT_HAIKU_MODEL="anthropic/claude-haiku-4.5"   # 快速模型
export ANTHROPIC_DEFAULT_SONNET_MODEL="anthropic/claude-sonnet-4.5" # 平衡模型
export ANTHROPIC_DEFAULT_OPUS_MODEL="anthropic/claude-opus-4.5"     # 强力模型

# 3. 使配置生效（二选一）：
# 方式 1：重新加载配置文件（推荐）
source ~/.bashrc  # 如果使用 bash
# 或
source ~/.zshrc   # 如果使用 zsh

# 方式 2：重启终端窗口
```

```powershell [Windows PowerShell]
# ============== 操作步骤 ==============

# Windows 系统使用 PowerShell Profile 配置环境变量
# 推荐使用 PowerShell 7+ 以获得更好的体验

# 1. 检查 PowerShell Profile 是否存在
Test-Path $PROFILE

# 2. 如果返回 False，创建 Profile 文件
if (!(Test-Path $PROFILE)) {
    New-Item -Path $PROFILE -ItemType File -Force
}

# 3. 打开 Profile 文件进行编辑
notepad $PROFILE
# 如果您使用 VSCode，也可以用：code $PROFILE

# 4. 将以下内容追加到 Profile 文件末尾（注意替换 API Key）

# ============= ZenMux + Claude Code 配置 =============
# 将 Claude Code 连接到 ZenMux 服务，而非 Anthropic 官方服务

# 核心配置：ZenMux 服务端点和认证
$env:ANTHROPIC_BASE_URL = "https://zenmux.ai/api/anthropic"  # ZenMux Anthropic 兼容端点
$env:ANTHROPIC_AUTH_TOKEN = "sk-ss-v1-xxx"                   # 替换为您的 ZenMux API Key（订阅制 sk-ss-v1-xxx 或按量付费 sk-ai-v1-xxx）
$env:CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = "1"          # 禁用非必要流量

# 避免冲突：如果您本机曾设置过 ANTHROPIC_API_KEY，建议显式置空
$env:ANTHROPIC_API_KEY = ""

# 默认模型配置（必需）：定义 Haiku / Sonnet / Opus 三个速度档位对应的模型
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "anthropic/claude-haiku-4.5"   # 快速模型
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "anthropic/claude-sonnet-4.5" # 平衡模型
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "anthropic/claude-opus-4.5"     # 强力模型

# 5. 保存文件后，重启 PowerShell 窗口使配置生效
# 或者在当前窗口执行：. $PROFILE

# 6. 验证环境变量是否设置成功
Write-Host "ANTHROPIC_BASE_URL: $env:ANTHROPIC_BASE_URL"
Write-Host "ANTHROPIC_AUTH_TOKEN: $env:ANTHROPIC_AUTH_TOKEN"
```

:::

::: warning 🔑 重要：替换 API Key

请确保将配置中的 `sk-ss-v1-xxx` 或 `sk-ai-v1-xxx` 替换为您的真实 ZenMux API Key：

**订阅制 API Key（推荐个人开发）**

- 格式：`sk-ss-v1-xxx`
- 获取位置：[订阅管理页面](https://zenmux.ai/platform/subscription)
- 详细指南：[订阅制套餐文档](/zh/guide/subscription)

**按量付费 API Key（生产环境）**

- 格式：`sk-ai-v1-xxx`
- 获取位置：[按量付费页面](https://zenmux.ai/platform/pay-as-you-go)
- 详细指南：[按量付费文档](/zh/guide/pay-as-you-go)
:::

::: tip 📋 环境变量说明

| 变量名 | 作用 | 说明 |
|--------|------|------|
| `ANTHROPIC_BASE_URL` | 服务端点地址 | 将 Claude Code 的请求重定向到 ZenMux 服务 |
| `ANTHROPIC_AUTH_TOKEN` | 认证密钥 | 您的 ZenMux API Key（订阅制或按量付费） |
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

::: details API Key 错误或认证失败
**问题**：提示 API Key 无效、未授权或认证失败

**解决方案**：

1. **检查 API Key 格式**：
   - 订阅制 API Key 应以 `sk-ss-v1-` 开头
   - 按量付费 API Key 应以 `sk-ai-v1-` 开头
   - 确认没有多余的空格或换行符

2. **验证 API Key 有效性**：
   - 订阅制：访问 [订阅管理页面](https://zenmux.ai/platform/subscription) 检查订阅状态和配额
   - 按量付费：访问 [按量付费页面](https://zenmux.ai/platform/pay-as-you-go) 检查余额是否充足

3. **确认环境变量已加载**：

   ```bash
   # macOS/Linux
   echo $ANTHROPIC_AUTH_TOKEN

   # Windows PowerShell
   echo $env:ANTHROPIC_AUTH_TOKEN
   ```

   如果输出为空，说明环境变量未正确加载，请重新执行 `source ~/.zshrc` 或重启终端。

4. **检查 API Key 状态**：
   - 确认 API Key 在控制台中显示为 "Enabled" 状态
   - 检查 API Key 是否已被删除或禁用

5. **获取新的 API Key**：
   - [订阅制 API Key 获取指南](/zh/guide/subscription#第-3-步管理订阅和获取-api-key)
   - [按量付费 API Key 获取指南](/zh/guide/pay-as-you-go#创建和管理-api-key)
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

::: details Windows PowerShell 脚本执行策略问题
**问题**：PowerShell 提示"无法加载文件 xxx，因为在此系统上禁止运行脚本"

**解决方案**：

这是 Windows PowerShell 的安全机制。需要修改执行策略：

1. 以**管理员身份**运行 PowerShell
2. 执行以下命令：

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. 输入 `Y` 确认修改
4. 重新打开 PowerShell 窗口

**执行策略说明**：

- `Restricted`（默认）：不允许运行任何脚本
- `RemoteSigned`：本地脚本可运行，远程下载的脚本需要数字签名
- `Unrestricted`：允许运行所有脚本（不推荐）
:::

::: details Windows 找不到 claude 命令
**问题**：安装 Claude Code 后，PowerShell 提示找不到 `claude` 命令

**解决方案**：

这通常是 npm 全局包路径未添加到 PATH 环境变量导致的。

1. 查看 npm 全局包路径：

   ```powershell
   npm config get prefix
   ```

2. 检查该路径是否在 PATH 中：

   ```powershell
   $env:PATH -split ";" | Select-String "npm"
   ```

3. 如果不在，手动添加（以下两种方式任选其一）：

   **方式 1：临时添加（仅当前会话有效）**

   ```powershell
   $env:PATH += ";C:\Users\<YourUsername>\AppData\Roaming\npm"
   ```

   **方式 2：永久添加（推荐）**

   ```powershell
   [Environment]::SetEnvironmentVariable(
       "Path",
       [Environment]::GetEnvironmentVariable("Path", "User") + ";C:\Users\<YourUsername>\AppData\Roaming\npm",
       "User"
   )
   ```

4. 关闭并重新打开 PowerShell 窗口
5. 验证安装：

   ```powershell
   claude --version
   ```

:::

::: details Windows PowerShell Profile 未生效
**问题**：配置了 PowerShell Profile，但环境变量未加载

**解决方案**：

1. 确认 Profile 文件路径是否正确：

   ```powershell
   $PROFILE
   # 应显示类似：C:\Users\<YourUsername>\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
   ```

2. 确认 Profile 文件是否存在：

   ```powershell
   Test-Path $PROFILE
   # 应返回 True
   ```

3. 确认 Profile 文件内容是否正确：

   ```powershell
   Get-Content $PROFILE
   ```

4. 手动加载 Profile（测试是否有语法错误）：

   ```powershell
   . $PROFILE
   ```

5. 如果出现错误，检查：
   - 文件编码是否为 UTF-8
   - PowerShell 语法是否正确（注意 `$env:` 前缀）
   - 执行策略是否允许运行脚本（参见上方"PowerShell 脚本执行策略问题"）

6. 验证环境变量是否加载：

   ```powershell
   Write-Host "ANTHROPIC_BASE_URL: $env:ANTHROPIC_BASE_URL"
   Write-Host "ANTHROPIC_AUTH_TOKEN: $env:ANTHROPIC_AUTH_TOKEN"
   ```

:::

::: details Windows 环境变量中的中文字符问题
**问题**：环境变量中包含中文路径或值时出现乱码

**解决方案**：

1. 确保 PowerShell Profile 文件使用 **UTF-8 with BOM** 编码
2. 在 PowerShell 中设置正确的编码：

   ```powershell
   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
   ```

3. 如果问题持续，建议避免在环境变量值中使用中文字符
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
