# 通过 ZenMux 使用 Claude Code 指南

Claude Code 是 Anthropic 推出的官方 Coding Agent，通过与 ZenMux 的集成，您可以使用更多模型选择，而不仅仅局限于 Claude 官方 API。本指南提供两种使用方案：直接配置方案和代理方案。

## 两种使用方案对比

我们提供两种不同的使用方案，您可以根据具体需求选择：

| 方案特点       | 方法 1：直接配置           | 方法 2：代理方案         |
| -------------- | -------------------------- | ------------------------ |
| **配置复杂度** | 简单，仅需环境变量配置     | 中等，需安装代理服务     |
| **模型支持**   | 目前仅支持 Claude 系列模型 | 支持 ZenMux 平台所有模型 |
| **启动方式**   | 直接启动 Claude Code       | 需先启动代理服务         |
| **资源占用**   | 轻量级                     | 需要额外的代理进程       |
| **适用场景**   | Claude 用户的快速迁移      | 需要多模型选择的用户     |

::: tip 选择建议

- 如果您主要使用 Claude 系列模型，推荐使用**方法 1**，配置更简单
- 如果您需要在多个模型间切换选择，推荐使用**方法 2**，功能更全面
  :::

## 方法 1：直接配置方案（Claude 模型）

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
export ANTHROPIC_BASE_URL=https://zenmux.ai/api/anthropic   # [!code highlight]

# 设置您的 ZenMux API Key
export ANTHROPIC_AUTH_TOKEN=sk-ai-v1-xxx  # [!code highlight]

# 指定使用的模型（Claude 系列）
export ANTHROPIC_MODEL=anthropic/claude-sonnet-4  # [!code highlight]
export ANTHROPIC_SMALL_FAST_MODEL=anthropic/claude-sonnet-4  # [!code highlight]

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
export ANTHROPIC_BASE_URL=https://zenmux.ai/api 
export ANTHROPIC_AUTH_TOKEN=sk-ai-v1-xxx
export ANTHROPIC_MODEL=anthropic/claude-sonnet-4
export ANTHROPIC_SMALL_FAST_MODEL=anthropic/claude-sonnet-4
```

:::

### ZenMux平台目前原生支持Anthropic协议的模型列表如下

| 序号 | 模型slug |
| ---- | ---- |
| 1    | `anthropic/claude-sonnet-4` |
| 2    | `anthropic/claude-opus-4.1` |
| 3    | `deepseek/deepseek-chat` |
| 4    | `qwen/qwen3-coder-plus` |
| 5    | `moonshotai/kimi-k2-0905` |
| 6    | `z-ai/glm-4.5` |
| 7    | `z-ai/glm-4.5-air` |

---

## 方法 2：代理方案（全模型支持）

如果您需要使用 ZenMux 平台上的所有模型（包括 GPT、Gemini 等），可以使用代理方案。

### 安装步骤

#### 1. 安装 Claude Code

首先安装 Anthropic 官方的 Claude Code 工具：

::: code-group

```bash [npm/pnpm]
# 使用 pnpm 安装（推荐）
pnpm install -g @anthropic-ai/claude-code

# 或使用 npm 安装
npm install -g @anthropic-ai/claude-code
```

:::

::: info 参考文档
关于 Claude Code 的详细功能和使用方法，请参考 [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code/overview)
:::

#### 2. 安装 Claude Code Proxy

Claude Code Proxy 是一个开源项目，可以将 Claude Code 的请求代理到 ZenMux 平台。

::: tip 开源贡献
感谢该项目的作者 [fuergaosi233](https://github.com/fuergaosi233)。
:::

::: code-group

```bash [使用 UV（推荐）]
# 克隆代理仓库
git clone https://github.com/fuergaosi233/claude-code-proxy.git
cd claude-code-proxy

# 使用 UV 安装依赖
uv sync
```

```bash [使用 pip]
# 克隆代理仓库
git clone https://github.com/fuergaosi233/claude-code-proxy.git
cd claude-code-proxy

# 使用 pip 安装依赖
pip install -r requirements.txt
```

:::

#### 3. 配置环境变量

修改 claude-code-proxy 项目的`.env`文件，配置您的 ZenMux API 信息和首选模型：

```bash
# 复制.env.example为.env，如果已有.env文件则跳过此步骤
cp .env.example .env

# ZenMux API Key
OPENAI_API_KEY="sk-ai-v1-xxx"  # [!code highlight]

# ZenMux API 基础 URL
OPENAI_BASE_URL="https://zenmux.ai/api/v1"  # [!code highlight]

# 模型映射配置（可选）
BIG_MODEL="anthropic/claude-opus-4.1"  # [!code highlight]
MIDDLE_MODEL="anthropic/claude-sonnet-4"  # [!code highlight]
SMALL_MODEL="openai/gpt-4o-mini"  # [!code highlight]
```

::: warning 重要配置
请确保将 `sk-ai-v1-xxx` 替换为您的真实 ZenMux API Key。您可以在 [ZenMux 控制台](https://zenmux.ai/settings/keys) 中获取 API Key
:::

### 启动服务

#### 1. 启动 Claude Code Proxy

::: code-group

```bash [UV 启动]
# 进入项目目录
cd claude-code-proxy

# 加载环境变量并启动服务
source .env
uv run claude-code-proxy
```

```bash [Python 启动]
# 进入项目目录
cd claude-code-proxy

# 加载环境变量并启动服务
source .env
python -m claude-code-proxy
```

:::

启动成功后，您将看到类似以下的输出：

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/FiEgoFH/claude-code-proxy.png" 
       alt="Claude Code Proxy 运行效果" 
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

#### 2. 启动 Claude Code 客户端

在新的终端窗口中，使用以下命令启动 Claude Code 客户端：

```bash
ANTHROPIC_BASE_URL=http://localhost:8082 ANTHROPIC_API_KEY="any-value" claude  # [!code highlight]
```

::: tip 便捷使用
您可以将上述命令添加到您的 shell 配置文件中，创建一个便捷的别名：

```bash
# 添加到 .bashrc 或 .zshrc 文件中
alias claude-zenmux='ANTHROPIC_BASE_URL=http://localhost:8082 ANTHROPIC_API_KEY="any-value" claude'
```

:::

### 支持的模型

方法 2 通过代理方案支持 ZenMux 平台上的所有模型，包括：

- **Claude 系列**：`anthropic/claude-opus-4.1`、`anthropic/claude-sonnet-4`、`anthropic/claude-haiku-4`
- **GPT 系列**：`openai/gpt-5`、`openai/gpt-4o`、`openai/gpt-4o-mini`、`openai/gpt-5-mini`、`openai/gpt-5-nana`
- **Gemini 系列**：`google/gemini-pro`、`google/gemini-flash`
- **其他模型**：更多模型请查看 [ZenMux 模型列表](https://zenmux.ai/models)

### 使用效果

配置完成后，您就可以在 Claude Code 中使用 ZenMux 的所有模型了：

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/KZuymll/claude-code.png" 
       alt="Claude Code 使用展示" 
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

## 故障排除

### 常见问题解决

::: details 连接失败问题
**问题**：Claude Code 无法连接到代理服务

**解决方案**：

- 确保 Claude Code Proxy 正在运行
- 检查端口 8082 是否被占用
- 验证防火墙设置是否阻止了本地连接
  :::

::: details API Key 错误
**问题**：提示 API Key 无效或未授权

**解决方案**：

- 检查 `.env` 文件中的 ZenMux API Key 是否正确
- 确认 API Key 是否已激活且有足够余额
- 验证 API Key 格式是否以 `sk-ai-v1-` 开头
  :::

### 日志查看

如果遇到问题，您可以查看 Claude Code Proxy 的日志输出来排查问题。代理服务会显示详细的请求和响应信息，帮助您快速定位问题所在。

## 进阶配置

### 自定义模型映射

您可以根据不同需求调整 `.env` 文件中的模型映射：

::: code-group

```bash [成本优化配置]
# 注重成本效益的模型选择
BIG_MODEL="anthropic/claude-sonnet-4"
MIDDLE_MODEL="openai/gpt-5-mini"
SMALL_MODEL="openai/gpt-5-nana"
```

```bash [性能优先配置]
# 注重性能表现的模型选择
BIG_MODEL="anthropic/claude-opus-4.1"
MIDDLE_MODEL="anthropic/claude-sonnet-4"
SMALL_MODEL="openai/gpt-5"
```

```bash [均衡配置]
# 平衡性能和成本的模型选择
BIG_MODEL="anthropic/claude-sonnet-4"
MIDDLE_MODEL="anthropic/claude-sonnet-4"
SMALL_MODEL="openai/gpt-5-mini"
```

:::

通过这种方式，您可以在不同的使用场景下获得最佳的性能和成本平衡。

::: info 更多模型
查看 [ZenMux 模型列表](https://zenmux.ai/models) 了解所有可用模型及其详细信息
:::
