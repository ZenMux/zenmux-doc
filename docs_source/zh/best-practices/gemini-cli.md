---
head:
  - - meta
    - name: description
      content: 通过 ZenMux 使用 Gemini CLI 指南
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, Gemini CLI, Google, AI, terminal, agent
---

# 通过 ZenMux 使用 Gemini CLI 指南

Gemini CLI 是 Google 推出的开源 AI 终端代理工具，可以将 Gemini 的能力直接带入您的终端。它基于 ReAct（Reason + Act）循环架构，能够自主完成编程、调试、文件操作、内容生成等复杂任务。Gemini CLI 提供了 100 万 Token 上下文窗口、60 次/分钟的请求速率，以及丰富的 MCP 工具集成能力。通过 ZenMux，您可以为 Gemini CLI 配置自定义 API 端点，获得更灵活的模型选择和更稳定的服务体验。

::: info 兼容性说明
Gemini CLI 原生使用 Google Gemini API 协议（非 OpenAI 协议），通过设置 `GOOGLE_GEMINI_BASE_URL` 环境变量可将请求路由到自定义端点。ZenMux 支持 Vertex AI 协议，可直接兼容 Gemini CLI 的 API 请求格式。
:::

## 配置方案

### Step 0: 安装 Gemini CLI

Gemini CLI 要求 Node.js 18+ 环境。

::: code-group

```bash [npm（推荐）]
npm install -g @google/gemini-cli
```

```bash [npx（免安装试用）]
npx @google/gemini-cli
```

:::

安装完成后，在终端中输入 `gemini` 即可启动。

### Step 1: 配置环境变量

在您的 shell 配置文件中添加 ZenMux API Key 和自定义端点：

::: code-group

```bash [macOS/Linux/WSL]
# 编辑 ~/.zshrc 或 ~/.bashrc 文件
export GEMINI_API_KEY="sk-ai-v1-xxx"  # [!code highlight]
export GOOGLE_GEMINI_BASE_URL="https://zenmux.ai/api/vertex-ai"  # [!code highlight]
```

```powershell [Windows PowerShell]
# 编辑 PowerShell 配置文件
$env:GEMINI_API_KEY = "sk-ai-v1-xxx"  # [!code highlight]
$env:GOOGLE_GEMINI_BASE_URL = "https://zenmux.ai/api/vertex-ai"  # [!code highlight]

# 若需永久生效，请添加到 PowerShell 配置文件中：
# notepad $PROFILE
```

:::

::: warning 重要配置
请确保将 `sk-ai-v1-xxx` 替换为您的真实 ZenMux API Key。您可以在 [ZenMux 控制台](https://zenmux.ai/settings/keys) 中获取 API Key。
:::

### Step 2: 配置 Gemini CLI

Gemini CLI 的配置文件位于 `~/.gemini/settings.json`。首次启动 Gemini CLI 时会自动创建该文件，您也可以手动创建或修改：

```json
{
  "theme": "GitHub",
  "sandbox": false
}
```

::: tip 配置说明

- `theme`：设置 UI 主题，可选 `GitHub`、`Dracula`、`Monokai` 等
- `sandbox`：是否启用沙盒模式执行命令（默认关闭），建议在生产环境中开启

Gemini CLI 的模型和 API 端点主要通过环境变量控制，而非 `settings.json`。
:::

您还可以通过 `.env` 文件来管理环境变量。Gemini CLI 会自动从项目目录或 `~/.gemini/.env` 中加载：

```bash
# .gemini/.env
GEMINI_API_KEY=sk-ai-v1-xxx
GOOGLE_GEMINI_BASE_URL=https://zenmux.ai/api/vertex-ai
```

### Step 3: 启动使用

配置完成后，重新加载 shell 配置并启动 Gemini CLI：

```bash
# 重新加载配置文件
source ~/.zshrc  # 或 source ~/.bashrc

# 进入项目目录
cd my-project

# 启动 Gemini CLI
gemini  # [!code highlight]
```

## 已知问题：工具调用报错 {#tool-call-error}

::: warning 工具调用报错：Unknown name "id" at function_response
当模型尝试使用内置工具（如 Google Search）时，可能出现以下报错：

```
[API Error: {"error":{"code":"400","type":"invalid_params","message":"Invalid JSON payload received. Unknown name \"id\" at 'contents[...].parts[0].function_response': Cannot find field."}}]
```

**原因**：Gemini CLI 在向 API 发送工具调用结果时，会在 `functionResponse` 中携带 `id` 字段。该字段在部分 API 版本中尚未支持，导致请求被拒绝。
:::

**解决方案**：修改 Gemini CLI 本地安装文件，注释掉 `callId` 的传递。

1. 找到文件（路径中的 Node 版本号请替换为您的实际版本）：

   ```
   ~/.nvm/versions/node/<版本号>/lib/node_modules/@google/gemini-cli/node_modules/@google/gemini-cli-core/dist/src/core/turn.js
   ```

2. 找到 `handlePendingFunctionCall` 方法（约第 183 行），将 `callId,` 注释掉：

   ```js
   handlePendingFunctionCall(fnCall, traceId) {
       const name = fnCall.name || 'undefined_tool_name';
       const args = fnCall.args || {};
       const callId = fnCall.id ?? `${name}_${Date.now()}_${this.callCounter++}`;
       const toolCallRequest = {
           // callId,  // [!code warning]
           name,
           args,
           isClientInitiated: false,
           prompt_id: this.prompt_id,
           traceId,
       };
   ```

3. 保存文件后重启 Gemini CLI 即可。

::: tip 注意
每次更新或重装 Gemini CLI 后需要重新执行此修改。
:::

## 核心功能

### GEMINI.md 上下文文件

`GEMINI.md` 是 Gemini CLI 的核心特性之一，类似于 Claude Code 的 `CLAUDE.md`。它作为持久化上下文，在每次会话开始时自动加载，让 AI 了解项目背景和约定。

Gemini CLI 按以下层级查找并合并 `GEMINI.md` 文件：

| 位置                   | 作用域 | 说明                     |
| :--------------------- | :----- | :----------------------- |
| `~/.gemini/GEMINI.md`  | 全局   | 适用于所有项目的通用指令 |
| `项目根目录/GEMINI.md` | 项目级 | 项目特定的规范和约定     |
| `当前目录/GEMINI.md`   | 目录级 | 子目录特定的上下文       |

::: tip GEMINI.md 编写建议

- 描述项目的技术栈和架构
- 指定代码风格和命名规范
- 说明构建、测试和部署流程
- 列出常用的项目命令
- 支持通过 `@path/to/file.md` 语法导入其他文件
  :::

### 常用斜杠命令

Gemini CLI 提供了丰富的内置命令来管理会话和配置：

| 命令                 | 说明                                    |
| :------------------- | :-------------------------------------- |
| `/help`              | 显示帮助信息和可用命令列表              |
| `/stats`             | 查看当前会话的 Token 使用情况和统计信息 |
| `/memory show`       | 查看当前加载的 GEMINI.md 上下文内容     |
| `/memory add <文本>` | 向 AI 记忆中添加内容                    |
| `/theme`             | 切换 UI 主题                            |
| `/tools`             | 查看当前可用的工具列表                  |
| `/mcp`               | 管理 MCP 服务器连接                     |
| `/chat`              | 保存和恢复会话历史                      |
| `/copy`              | 将最后的输出复制到剪贴板                |

### 自定义斜杠命令

Gemini CLI 支持创建自定义命令，存放在以下位置：

- **全局命令**：`~/.gemini/commands/` — 在所有项目中可用
- **项目命令**：`<项目根目录>/.gemini/commands/` — 仅在当前项目中可用

例如，创建一个 `/plan` 命令：

```toml
# ~/.gemini/commands/plan.toml
[command]
description = "Plan changes without implementing"

[command.prompt]
content = """
Please analyze the following request and provide a detailed step-by-step plan.
Do NOT implement any changes — only plan them.

Request: $input
"""
```

### MCP 集成

Gemini CLI 支持 MCP（Model Context Protocol）服务器，可以扩展 AI 的工具能力：

```bash
# 添加 MCP 服务器
gemini mcp add <server-name> -- <command>

# 查看已配置的 MCP 服务器
gemini mcp list

# 移除 MCP 服务器
gemini mcp remove <server-name>
```

在 `settings.json` 中也可以配置 MCP 服务器：

```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "my-mcp-server"]
    }
  }
}
```

## 支持的模型

通过 ZenMux，您可以在 Gemini CLI 中使用多种 Gemini 模型。可以通过 `GEMINI_MODEL` 环境变量指定模型：

```bash
# 在 .gemini/.env 或 shell 配置文件中设置
export GEMINI_MODEL="gemini-2.5-pro"  # [!code highlight]
```

::: info 获取模型列表

- 通过 [ZenMux 模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=google) 查看 Google AI 协议可用模型
- Gemini CLI 默认使用 Gemini 系列模型
- 如需指定特定供应商，请参考 [Provider Routing 文档](/zh/guide/advanced/provider-routing)
  :::

## 认证方式

Gemini CLI 原生支持三种认证方式：

| 方式                     | 适用场景    | 说明                               |
| :----------------------- | :---------- | :--------------------------------- |
| Google 账号登录（OAuth） | 本地开发    | 最高免费额度：60 RPM / 1000 RPD    |
| API Key                  | CI/CD、脚本 | 通过 `GEMINI_API_KEY` 环境变量设置 |
| Vertex AI                | 企业级      | 通过 ADC 或服务账号认证            |

**通过 ZenMux 使用时**，选择 API Key 方式，将 ZenMux API Key 设置为 `GEMINI_API_KEY` 即可。

如需重新认证，可使用以下命令：

```bash
gemini --reauth
```

## 故障排除

### 常见问题解决

::: details API Key 错误
**问题**：提示 API Key 无效或未授权

**解决方案**：

- 检查环境变量 `GEMINI_API_KEY` 是否正确设置
- 使用 `echo $GEMINI_API_KEY` 验证环境变量值
- 确认 API Key 是否已激活且有足够余额
- 验证 API Key 格式是否以 `sk-ai-v1-` 开头
  :::

::: details 连接失败问题
**问题**：Gemini CLI 无法连接到 ZenMux 服务

**解决方案**：

- 检查网络连接是否正常
- 验证 `GOOGLE_GEMINI_BASE_URL` 是否配置正确为 `https://zenmux.ai/api/vertex-ai`
- 确认防火墙设置是否阻止了外部连接
- 尝试使用 `curl https://zenmux.ai/api/vertex-ai/models` 测试连接
  :::

::: details 环境变量配置不生效
**问题**：设置了环境变量后仍然提示未配置

**解决方案**：

- 重新打开终端窗口，或执行 `source ~/.zshrc` 重新加载配置
- 使用 `echo $GEMINI_API_KEY` 和 `echo $GOOGLE_GEMINI_BASE_URL` 验证变量值
- 检查是否在正确的 shell 配置文件中添加了环境变量
- 确认 `.gemini/.env` 文件是否在正确的目录中
  :::

::: details 模型不可用
**问题**：使用某个模型时提示模型不可用或不支持

**解决方案**：

- 访问 [ZenMux 模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=google) 确认模型是否可用
- 检查 `GEMINI_MODEL` 环境变量中的模型名拼写是否正确
- 尝试使用 `gemini-2.5-pro` 等默认模型进行测试
- 确认您的账户是否有权限访问该模型
  :::

::: details 沙盒模式问题
**问题**：启用沙盒模式后命令执行失败

**解决方案**：

- 确认系统中已安装 Docker
- 检查 Docker 服务是否正在运行：`docker ps`
- 尝试禁用沙盒模式测试：在 `settings.json` 中设置 `"sandbox": false`
- 如果使用自定义沙盒，检查 `.gemini/sandbox.Dockerfile` 配置
  :::

## 进阶配置

### 配合不同场景的推荐配置

::: code-group

```bash [日常开发]
# 平衡性能和成本
export GEMINI_API_KEY="sk-ai-v1-xxx"
export GOOGLE_GEMINI_BASE_URL="https://zenmux.ai/api/vertex-ai"
export GEMINI_MODEL="gemini-2.5-pro"
```

```bash [代码审查]
# 注重推理能力
export GEMINI_API_KEY="sk-ai-v1-xxx"
export GOOGLE_GEMINI_BASE_URL="https://zenmux.ai/api/vertex-ai"
export GEMINI_MODEL="gemini-2.5-pro"
```

```bash [快速迭代]
# 注重响应速度
export GEMINI_API_KEY="sk-ai-v1-xxx"
export GOOGLE_GEMINI_BASE_URL="https://zenmux.ai/api/vertex-ai"
export GEMINI_MODEL="gemini-2.5-flash"
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
