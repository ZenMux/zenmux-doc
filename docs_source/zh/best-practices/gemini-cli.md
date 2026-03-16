---
head:
  - - meta
    - name: description
      content: 通过 ZenMux 使用 Gemini CLI 指南
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, Gemini CLI, Google, Vertex AI, API
---

# 通过 ZenMux 使用 Gemini CLI 指南

Gemini CLI 是 Google 推出的终端 AI 助手工具，可用于代码问答、项目分析和文件读取。通过接入 ZenMux，您可以在无需直接访问 Google API 的情况下使用 Gemini CLI，并将请求转发到 ZenMux 提供的模型网关。

::: info 兼容性说明
ZenMux 当前可与 Gemini CLI 配合完成 **问答** 与 **只读代码分析**。

基于实测：
- 问答与只读文件分析功能完全可用
- **自动改文件 / 自动执行命令 / 复杂工具调用** 因 `function_response` 兼容性限制暂不可用

注意 Vertex AI 协议的 base_url="`https://zenmux.ai/api/vertex-ai`"。
:::

## 前置条件

- Node.js 20 或更高版本
- ZenMux API Key（参见下方 [获取 ZenMux API Key](#获取-zenmux-api-key)）

## 配置方案

当前有两种方式将 Gemini CLI 与 ZenMux 配合使用：

| 方式 | 适用场景 | 推荐度 |
|------|----------|--------|
| [Gemini API 模式](#方式一-gemini-api-模式推荐) | 配置简洁，快速接通问答与只读分析 | 推荐 |
| [Vertex AI 模式](#方式二-vertex-ai-模式备选) | 与 ZenMux `/api/vertex-ai` 端点语义保持一致 | 备选 |

### 安装 Gemini CLI

::: code-group

```bash [npm]
# 使用 npm 全局安装
npm install -g @google/gemini-cli
```

```bash [pnpm]
# 使用 pnpm 全局安装
pnpm install -g @google/gemini-cli
```

:::

验证安装：

```bash
gemini --version
gemini --help
```

### 获取 ZenMux API Key

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

### 方式一: Gemini API 模式（推荐）

配置简洁，仅需 3 个环境变量即可快速接通。

#### Step 1: 创建配置目录

```bash
mkdir -p ~/.gemini
```

#### Step 2: 配置 `~/.gemini/.env`

```env
GEMINI_API_KEY=sk-ss-v1-xxx  # [!code highlight]
GEMINI_MODEL=google/gemini-3.1-pro-preview  # [!code highlight]
GOOGLE_GEMINI_BASE_URL=https://zenmux.ai/api/vertex-ai  # [!code highlight]
```

::: warning 重要配置
请确保将 `sk-ss-v1-xxx` 替换为您的真实 ZenMux API Key。您可以在 [ZenMux 控制台](https://zenmux.ai/settings/keys) 中获取 API Key。
:::

#### Step 3: 配置 `~/.gemini/settings.json`

将认证方式设置为 Gemini API Key，避免 Gemini CLI 启动时要求 Google 登录：

```json
{
  "security": {
    "auth": {
      "selectedType": "gemini-api-key"  // [!code highlight]
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

#### Step 2: 配置 `~/.gemini/.env`

```env
GOOGLE_API_KEY=sk-ss-v1-xxx  # [!code highlight]
GEMINI_MODEL=google/gemini-3.1-pro-preview  # [!code highlight]
GOOGLE_VERTEX_BASE_URL=https://zenmux.ai/api/vertex-ai  # [!code highlight]
GOOGLE_GENAI_USE_VERTEXAI=true  # [!code highlight]
GOOGLE_GENAI_API_VERSION=v1  # [!code highlight]
```

::: warning 关键提示
- `GOOGLE_GENAI_API_VERSION=v1` 是**必需项**。若不设置，Gemini CLI 默认走 `v1beta1` 路径，会返回 404 错误
- `GOOGLE_GENAI_USE_VERTEXAI` 请使用小写 `true`
- 不要同时保留 `GEMINI_API_KEY` 或 `GOOGLE_GEMINI_BASE_URL`，以免与 Gemini API 模式混淆
:::

#### Step 3: 配置 `~/.gemini/settings.json`

```json
{
  "security": {
    "auth": {
      "selectedType": "vertex-ai"  // [!code highlight]
    }
  }
}
```

#### Step 4: 验证连接

```bash
gemini -p "Reply with OK only." --output-format json
```

### 两种模式变量对比

| 配置项 | Gemini API 模式 | Vertex AI 模式 |
|--------|-----------------|----------------|
| API Key 变量 | `GEMINI_API_KEY` | `GOOGLE_API_KEY` |
| Base URL 变量 | `GOOGLE_GEMINI_BASE_URL` | `GOOGLE_VERTEX_BASE_URL` |
| 启用 Vertex AI | 不设置 | `GOOGLE_GENAI_USE_VERTEXAI=true` |
| API 版本 | 不设置 | `GOOGLE_GENAI_API_VERSION=v1` |
| 认证类型 | `gemini-api-key` | `vertex-ai` |
| 所需变量数 | 3 个 | 5 个 |

::: warning 请勿混用两种模式
两种模式的变量集不要混合使用，否则会导致行为不可预测。请根据您选择的模式，仅保留对应的变量。
:::

## 支持的模型

您可以灵活更换 `~/.gemini/.env` 中的 `GEMINI_MODEL` 字段为 ZenMux 支持的模型。

::: info 获取模型列表

- 通过 [ZenMux 模型列表](https://zenmux.ai/models?sort=newest) 查看所有可用模型
- 使用模型的 slug 名称（如 `google/gemini-3.1-pro-preview`）
- 如需指定特定供应商，请参考 [Provider Routing 文档](/zh/guide/provider-routing)
:::

推荐用于 Gemini CLI 的模型：

| 模型名称 | 模型 Slug | 说明 |
|----------|-----------|------|
| Gemini 3.1 Pro Preview | `google/gemini-3.1-pro-preview` | 推荐，链路验证首选 |
| Gemini 2.5 Pro | `google/gemini-2.5-pro` | Google 主力模型 |

::: tip 切换模型
即使模型名可以切换成功，也不代表工具调用会一并可用。当前限制主要来自 ZenMux 对 Gemini CLI Agent 协议的兼容性，而不只是模型本身。
:::

## 当前能力范围

| 场景 | 状态 |
|------|------|
| `gemini -p "..."` 非交互问答 | ✅ 可用 |
| `@文件名` 读取并分析文件 | ✅ 可用 |
| 项目级只读代码理解 | ✅ 可用 |
| 交互式多轮对话 | ✅ 可用 |
| 自动改文件 | ❌ 暂不可用 |
| 自动执行命令 | ❌ 暂不可用 |
| 复杂工具调用 / Agent 工作流 | ❌ 暂不可用 |

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

::: details .env 配置文件不生效
**问题**：在 `~/.gemini/.env` 中设置了变量但未生效

**解决方案**：

- Gemini CLI 的 `.env` 加载遵循就近原则，命中第一份即停止
- 检查当前项目目录下是否已有 `.env` 或 `.gemini/.env`（会覆盖全局配置）
- 检查 Shell 中是否已 `export` 过同名变量：`env | grep -E "GEMINI_|GOOGLE_"`
- 检查父目录中是否存在更早命中的 `.env` 文件
:::

::: details 改文件时报 function_response 相关错误
**问题**：尝试让 Gemini CLI 自动编辑文件时出现类似错误：
```text
Invalid JSON payload received. Unknown name "id" at 'contents[3].parts[0].function_response': Cannot find field.
```

**解决方案**：

- 这是已知限制，ZenMux 对 Gemini CLI 的工具调用协议兼容尚不完整
- 当前请将使用场景限制为问答和只读分析
- 不要依赖 Gemini CLI 完成自动编辑、命令执行等 Agent 操作
- 后续 ZenMux 补齐 function calling 兼容性后将自动支持
:::

::: details 请求偶发超时
**问题**：只读文件分析请求偶尔超时

**解决方案**：

- 重试通常可成功
- 缩小 prompt 和引用文件的范围
- 如频繁超时，尝试换用较小的模型
- 检查网络连接是否稳定
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
    "name": "google/gemini-3.1-pro-preview"
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

### 非交互模式

Gemini CLI 支持非交互调用，适合脚本和 CI 场景：

```bash
# 单次问答，JSON 格式输出
gemini -p "解释什么是 REST API" --output-format json

# 引用文件进行分析
gemini -p "@src/main.ts 这个文件的入口逻辑是什么？" --output-format json
```

### 不同场景的模型配置

::: code-group

```env [推荐配置]
# 使用 Google 最新模型，适合日常开发问答
GEMINI_MODEL=google/gemini-3.1-pro-preview
```

```env [稳定配置]
# 使用成熟稳定的模型
GEMINI_MODEL=google/gemini-2.5-pro
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
