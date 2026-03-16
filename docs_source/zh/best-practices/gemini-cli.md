---
head:
  - - meta
    - name: description
      content: 通过 ZenMux 使用 Gemini CLI 指南
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, Gemini CLI, Google, Vertex AI, AI, terminal, agent
---

# 通过 ZenMux 使用 Gemini CLI 指南

Gemini CLI 是 Google 推出的开源 AI 终端代理工具，可以将 Gemini 的能力直接带入您的终端。它基于 ReAct（Reason + Act）循环架构，能够自主完成编程、调试、文件操作、内容生成等复杂任务。Gemini CLI 提供了 100 万 Token 上下文窗口、60 次/分钟的请求速率，以及丰富的 MCP 工具集成能力。通过 ZenMux，您可以为 Gemini CLI 配置自定义 API 端点，获得更灵活的模型选择和更稳定的服务体验。

## 前置条件

- Node.js 18+ 环境
- ZenMux API Key（参见下方[获取 ZenMux API Key](#获取-zenmux-api-key)）

## 安装 Gemini CLI

::: code-group

```bash [npm（推荐）]
npm install -g @google/gemini-cli
```

```bash [pnpm]
pnpm install -g @google/gemini-cli
```

```bash [npx（免安装试用）]
npx @google/gemini-cli
```

:::

验证安装：

```bash
gemini --version
```

安装完成后，在终端中输入 `gemini` 即可启动。

## 获取 ZenMux API Key

::: code-group

```text [订阅制 API Key（推荐）]
适用场景：个人开发、学习探索、轻量团队协作
特点：固定月费、成本可预测
API Key 格式：sk-ss-v1-xxx

获取方式：
1. 访问 https://zenmux.ai/platform/subscription
2. 选择合适套餐
3. 在控制台创建订阅 API Key
```

```text [按量付费 API Key]
适用场景：生产环境、商业产品、企业应用
特点：按实际使用量计费、便于统一成本核算
API Key 格式：sk-ai-v1-xxx

获取方式：
1. 访问 https://zenmux.ai/platform/pay-as-you-go
2. 充值账户
3. 在控制台创建按量付费 API Key
```

:::

## 配置方案

当前有两种方式将 Gemini CLI 与 ZenMux 配合使用：

| 方式                                            | 适用场景                                    | 推荐度 |
| ----------------------------------------------- | ------------------------------------------- | ------ |
| [Gemini API 模式](#方式一-gemini-api-模式-推荐) | 配置简洁，快速接通问答与只读分析            | 推荐   |
| [Vertex AI 模式](#方式二-vertex-ai-模式-备选)   | 与 ZenMux `/api/vertex-ai` 端点语义保持一致 | 备选   |

### 方式一: Gemini API 模式（推荐）

配置简洁，仅需 3 个环境变量即可快速接通。

#### Step 1: 创建配置目录

```bash
mkdir -p ~/.gemini
```

#### Step 2: 配置环境变量

您可以通过 `~/.gemini/.env` 文件配置环境变量。Gemini CLI 会自动从该文件加载：

```env
GEMINI_API_KEY=sk-ss-v1-xxx  # [!code highlight]
GEMINI_MODEL=google/gemini-2.5-pro  # [!code highlight]
GOOGLE_GEMINI_BASE_URL=https://zenmux.ai/api/vertex-ai  # [!code highlight]
```

也可以在 shell 配置文件中设置：

::: code-group

```bash [macOS/Linux/WSL]
# 编辑 ~/.zshrc 或 ~/.bashrc 文件
export GEMINI_API_KEY="sk-ss-v1-xxx"  # [!code highlight]
export GEMINI_MODEL="google/gemini-2.5-pro"  # [!code highlight]
export GOOGLE_GEMINI_BASE_URL="https://zenmux.ai/api/vertex-ai"  # [!code highlight]
```

```powershell [Windows PowerShell]
# 编辑 PowerShell 配置文件
$env:GEMINI_API_KEY = "sk-ss-v1-xxx"  # [!code highlight]
$env:GEMINI_MODEL = "google/gemini-2.5-pro"  # [!code highlight]
$env:GOOGLE_GEMINI_BASE_URL = "https://zenmux.ai/api/vertex-ai"  # [!code highlight]

# 若需永久生效，请添加到 PowerShell 配置文件中：
# notepad $PROFILE
```

:::

::: warning 重要配置
请确保将 `sk-ss-v1-xxx` 替换为您的真实 ZenMux API Key。您可以在 [ZenMux 控制台](https://zenmux.ai/settings/keys) 中获取 API Key。
:::

#### Step 3: 配置 settings.json

将认证方式设置为 Gemini API Key，避免 Gemini CLI 启动时要求 Google 登录：

```json
{
  "security": {
    "auth": {
      "selectedType": "gemini-api-key" // [!code highlight]
    }
  }
}
```

::: tip 配置说明

- `GEMINI_API_KEY`：您的 ZenMux API Key
- `GEMINI_MODEL`：指定使用的模型，可以是 ZenMux 支持的 Google 模型
- `GOOGLE_GEMINI_BASE_URL`：ZenMux Vertex AI 兼容端点
- `selectedType`：认证方式，设置为 `gemini-api-key` 跳过 Google 登录
  :::

#### Step 4: 验证连接

```bash
# 重新加载配置文件（如使用 shell 配置方式）
source ~/.zshrc  # 或 source ~/.bashrc

# 最小冒烟测试
gemini -p "Reply with OK only." --output-format json  # [!code highlight]
```

如果返回结果中包含 `"response": "OK"`，说明基础链路已通。

继续测试只读文件分析：

```bash
# 进入任意项目目录
cd my-project

# 引用文件进行分析
gemini -p "@README.md Summarize this file in one sentence." --output-format json  # [!code highlight]
```

如果能正确读取文件并返回摘要，说明 ZenMux + Gemini CLI 的只读分析链路可用。

### 方式二: Vertex AI 模式（备选）

与 ZenMux `/api/vertex-ai` 端点语义保持一致，需要额外设置 API 版本。

#### Step 1: 创建配置目录

```bash
mkdir -p ~/.gemini
```

#### Step 2: 配置环境变量

在 `~/.gemini/.env` 中配置：

```env
GOOGLE_API_KEY=sk-ss-v1-xxx  # [!code highlight]
GEMINI_MODEL=google/gemini-2.5-pro  # [!code highlight]
GOOGLE_VERTEX_BASE_URL=https://zenmux.ai/api/vertex-ai  # [!code highlight]
GOOGLE_GENAI_USE_VERTEXAI=true  # [!code highlight]
GOOGLE_GENAI_API_VERSION=v1  # [!code highlight]
```

::: warning 关键提示

- `GOOGLE_GENAI_API_VERSION=v1` 是**必需项**。若不设置，Gemini CLI 默认走 `v1beta1` 路径，会返回 404 错误
- `GOOGLE_GENAI_USE_VERTEXAI` 请使用小写 `true`
- 不要同时保留 `GEMINI_API_KEY` 或 `GOOGLE_GEMINI_BASE_URL`，以免与 Gemini API 模式混淆
  :::

#### Step 3: 配置 settings.json

```json
{
  "security": {
    "auth": {
      "selectedType": "vertex-ai" // [!code highlight]
    }
  }
}
```

#### Step 4: 验证连接

```bash
gemini -p "Reply with OK only." --output-format json
```

### 两种模式变量对比

| 配置项         | Gemini API 模式          | Vertex AI 模式                   |
| -------------- | ------------------------ | -------------------------------- |
| API Key 变量   | `GEMINI_API_KEY`         | `GOOGLE_API_KEY`                 |
| Base URL 变量  | `GOOGLE_GEMINI_BASE_URL` | `GOOGLE_VERTEX_BASE_URL`         |
| 启用 Vertex AI | 不设置                   | `GOOGLE_GENAI_USE_VERTEXAI=true` |
| API 版本       | 不设置                   | `GOOGLE_GENAI_API_VERSION=v1`    |
| 认证类型       | `gemini-api-key`         | `vertex-ai`                      |
| 所需变量数     | 3 个                     | 5 个                             |

::: warning 请勿混用两种模式
两种模式的变量集不要混合使用，否则会导致行为不可预测。请根据您选择的模式，仅保留对应的变量。
:::

## 认证方式

Gemini CLI 原生支持三种认证方式：

| 方式                     | 适用场景    | 说明                               |
| :----------------------- | :---------- | :--------------------------------- |
| Google 账号登录（OAuth） | 本地开发    | 最高免费额度：60 RPM / 1000 RPD    |
| API Key                  | CI/CD、脚本 | 通过 `GEMINI_API_KEY` 环境变量设置 |
| Vertex AI                | 企业级      | 通过 ADC 或服务账号认证            |

**通过 ZenMux 使用时**，选择 API Key 方式或 Vertex AI 方式，将 ZenMux API Key 设置到对应环境变量即可。

如需重新认证，可使用以下命令：

```bash
gemini --reauth
```

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

### 非交互模式

Gemini CLI 支持非交互调用，适合脚本和 CI 场景：

```bash
# 单次问答，JSON 格式输出
gemini -p "解释什么是 REST API" --output-format json

# 引用文件进行分析
gemini -p "@src/main.ts 这个文件的入口逻辑是什么？" --output-format json
```

## 支持的模型

通过 ZenMux，您可以在 Gemini CLI 中使用多种 Gemini 模型。可以通过 `GEMINI_MODEL` 环境变量指定模型：

```bash
# 在 .gemini/.env 或 shell 配置文件中设置
export GEMINI_MODEL="google/gemini-2.5-pro"  # [!code highlight]
```

推荐用于 Gemini CLI 的模型：

| 模型名称         | 模型 Slug                 | 说明                       |
| ---------------- | ------------------------- | -------------------------- |
| Gemini 2.5 Pro   | `google/gemini-2.5-pro`   | Google 主力模型，推荐首选  |
| Gemini 2.5 Flash | `google/gemini-2.5-flash` | 注重响应速度，适合快速迭代 |

::: info 获取模型列表

- 通过 [ZenMux 模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=google) 查看 Google AI 协议可用模型
- 使用模型的 slug 名称（如 `google/gemini-2.5-pro`）
- 如需指定特定供应商，请参考 [Provider Routing 文档](/zh/guide/advanced/provider-routing)
  :::

::: tip 切换模型
即使模型名可以切换成功，也不代表工具调用会一并可用。当前限制主要来自 ZenMux 对 Gemini CLI Agent 协议的兼容性，而不只是模型本身。
:::

## 已知问题：工具调用报错 {#tool-call-error}

::: warning 工具调用报错：Unknown name "id" at function_response
当模型尝试使用内置工具（如 Google Search）时，可能出现以下报错：

```
[API Error: {"error":{"code":"400","type":"invalid_params","message":"Invalid JSON payload received. Unknown name \"id\" at 'contents[...].parts[0].function_response': Cannot find field."}}]
```

**原因**：Gemini CLI 在向 API 发送工具调用结果时，会在 `functionResponse` 中携带 `id` 字段。该字段在部分 API 版本中尚未支持，导致请求被拒绝。
:::

**临时解决方案**：修改 Gemini CLI 本地安装文件，注释掉 `callId` 的传递。

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

- 每次更新或重装 Gemini CLI 后需要重新执行此修改
- 后续 ZenMux 补齐 function calling 兼容性后将自动支持，届时无需此修改
  :::

## 故障排除

### 常见问题解决

::: details Gemini CLI 启动后要求 Google 登录
**问题**：启动 Gemini CLI 时弹出 Google OAuth 登录页面

**解决方案**：

- 检查 `~/.gemini/settings.json` 中的 `selectedType` 是否正确设置
- Gemini API 模式应为 `"gemini-api-key"`，Vertex AI 模式应为 `"vertex-ai"`
- 确认没有混用两种模式的变量
- 使用 `cat ~/.gemini/settings.json` 验证配置内容
  :::

::: details Vertex AI 模式返回 404 错误
**问题**：使用 Vertex AI 模式发送请求时返回 404

**解决方案**：

- 确认 `~/.gemini/.env` 中已设置 `GOOGLE_GENAI_API_VERSION=v1`
- Gemini CLI 默认请求 `v1beta1` 路径，ZenMux 不支持该路径
- 使用 `cat ~/.gemini/.env` 检查变量是否完整
  :::

::: details API Key 错误
**问题**：提示 API Key 无效或未授权

**解决方案**：

- 检查 API Key 是否正确（订阅制以 `sk-ss-v1-` 开头，按量付费以 `sk-ai-v1-` 开头）
- 确认 API Key 已激活且有足够余额
- 在 [ZenMux 控制台](https://zenmux.ai/settings/keys) 中验证 Key 状态
- 注意不同模式使用不同的变量名：`GEMINI_API_KEY`（Gemini API 模式）或 `GOOGLE_API_KEY`（Vertex AI 模式）
  :::

::: details 连接失败问题
**问题**：Gemini CLI 无法连接到 ZenMux 服务

**解决方案**：

- 检查网络连接是否正常
- 验证 Base URL 是否配置正确为 `https://zenmux.ai/api/vertex-ai`
- 确认防火墙设置是否阻止了外部连接
- 尝试使用 `curl https://zenmux.ai/api/vertex-ai/models` 测试连接
  :::

::: details .env 配置文件不生效
**问题**：在 `~/.gemini/.env` 中设置了变量但未生效

**解决方案**：

- Gemini CLI 的 `.env` 加载遵循就近原则，命中第一份即停止
- 检查当前项目目录下是否已有 `.env` 或 `.gemini/.env`（会覆盖全局配置）
- 检查 Shell 中是否已 `export` 过同名变量：`env | grep -E "GEMINI_|GOOGLE_"`
- 检查父目录中是否存在更早命中的 `.env` 文件
- 重新打开终端窗口，或执行 `source ~/.zshrc` 重新加载配置
  :::

::: details 改文件时报 function_response 相关错误
**问题**：尝试让 Gemini CLI 自动编辑文件时出现类似错误：

```text
Invalid JSON payload received. Unknown name "id" at 'contents[3].parts[0].function_response': Cannot find field.
```

**解决方案**：

- 这是已知限制，详见[工具调用报错](#tool-call-error)章节
- 当前请将使用场景限制为问答和只读分析
- 不要依赖 Gemini CLI 完成自动编辑、命令执行等 Agent 操作
- 后续 ZenMux 补齐 function calling 兼容性后将自动支持
  :::

::: details 模型不可用
**问题**：使用某个模型时提示模型不可用或不支持

**解决方案**：

- 访问 [ZenMux 模型列表](https://zenmux.ai/models?sort=newest&supported_protocol=google) 确认模型是否可用
- 检查 `GEMINI_MODEL` 环境变量中的模型名拼写是否正确
- 尝试使用 `google/gemini-2.5-pro` 等默认模型进行测试
- 确认您的账户是否有权限访问该模型
  :::

::: details 请求偶发超时
**问题**：只读文件分析请求偶尔超时

**解决方案**：

- 重试通常可成功
- 缩小 prompt 和引用文件的范围
- 如频繁超时，尝试换用较小的模型（如 `google/gemini-2.5-flash`）
- 检查网络连接是否稳定
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

### 项目级配置

Gemini CLI 支持在项目根目录创建独立配置，覆盖全局设置：

```bash
mkdir -p <project-root>/.gemini
```

::: code-group

```json [项目级 settings.json]
// <project-root>/.gemini/settings.json
{
  "model": {
    "name": "google/gemini-2.5-pro"
  }
}
```

```env [项目级 .env]
# <project-root>/.gemini/.env
GEMINI_MODEL=google/gemini-2.5-pro
```

:::

适用场景：

- 不同项目使用不同模型
- 团队统一默认行为
- 商业项目使用按量付费 Key，个人项目使用订阅 Key

::: warning 安全提示
请不要将包含真实 API Key 的 `.env` 文件提交到版本库。如果需要把配置共享给团队，建议只提交 `settings.json` 模板。
:::

### 会话保留

Gemini CLI 支持会话历史保留，方便回顾之前的对话：

```json
{
  "general": {
    "sessionRetention": {
      "enabled": true,
      "maxAge": "30d"
    }
  }
}
```

会话历史存储在 `~/.gemini/history/` 目录下，可按需调整 `maxAge` 或设为 `false` 关闭。

### 配合不同场景的推荐配置

::: code-group

```bash [日常开发]
# 平衡性能和成本
export GEMINI_API_KEY="sk-ss-v1-xxx"
export GOOGLE_GEMINI_BASE_URL="https://zenmux.ai/api/vertex-ai"
export GEMINI_MODEL="google/gemini-2.5-pro"
```

```bash [代码审查]
# 注重推理能力
export GEMINI_API_KEY="sk-ss-v1-xxx"
export GOOGLE_GEMINI_BASE_URL="https://zenmux.ai/api/vertex-ai"
export GEMINI_MODEL="google/gemini-2.5-pro"
```

```bash [快速迭代]
# 注重响应速度
export GEMINI_API_KEY="sk-ss-v1-xxx"
export GOOGLE_GEMINI_BASE_URL="https://zenmux.ai/api/vertex-ai"
export GEMINI_MODEL="google/gemini-2.5-flash"
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
