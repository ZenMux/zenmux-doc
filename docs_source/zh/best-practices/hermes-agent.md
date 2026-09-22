---
head:
  - - meta
    - name: description
      content: Hermes Agent 通过 OAuth 插件或 API Key 接入 ZenMux 的安装、授权和排障指南
  - - meta
    - name: keywords
      content: ZenMux, 最佳实践, 集成, Hermes, Hermes Agent, OAuth, PKCE, OpenAI, API, AI 代理
---

# Hermes Agent 接入 ZenMux 使用指南

Hermes Agent 支持工具调用、浏览器自动化、代码执行和文件操作。接入 ZenMux 后，您可以通过同一个账户使用多个厂商的模型。

本文提供两种接入方式：

| 方式 | 认证方式 | 适用场景 |
| --- | --- | --- |
| [OAuth 插件（推荐）](#oauth-plugin) | 在浏览器中登录并授权，无需手动创建或粘贴 API Key | 支持 OAuth PKCE 插件 API 的 Hermes |
| [API Key 自定义端点](#api-key) | 手动配置 ZenMux API Key | 希望使用 API Key，或暂时无法升级 Hermes |

两种方式均使用 OpenAI 兼容的 Chat Completions 协议，Base URL 为 `https://zenmux.ai/api/v1`。OAuth 是授权方式，不代表免费使用；请求按授权时选择的账户和计费方式结算。

如需了解其他 Agent 的 OAuth 接入与通用安全说明，请参阅 [OAuth PKCE 登录指南](/zh/best-practices/oauth-pkce)。

## 前置条件

- 已有 [ZenMux 账户](https://zenmux.ai)。
- 已安装 Hermes Agent；首次安装可参考 [Hermes 官方快速开始](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)。Windows 用户请使用 WSL2。
- OAuth 插件要求 Hermes 包含声明式 OAuth PKCE 插件 API：`main` 分支至少包含提交 `3e67877e1b`。旧版 Hermes 请先更新，不能仅靠安装插件补齐该能力。
- 通过 PyPI 安装插件时，需要 Python 3.11 或更高版本，且必须与 Hermes 使用同一 Python 环境。
- 首次 OAuth 授权需要浏览器；远程运行请参阅[远程服务器授权](#remote-oauth)。

::: tip 插件来源
本文依据 [ZenMux Hermes 插件 README](https://github.com/ZenMux/hermes-plugin/blob/main/README.zh.md)。插件已内置专用 public OAuth client，使用 OAuth 2.0 Authorization Code + S256 PKCE，不需要配置 client secret。
:::

## 方式一：OAuth 插件（推荐） {#oauth-plugin}

### 1. 安装并启用插件

推荐从 GitHub 安装：

```bash
hermes plugins install ZenMux/hermes-plugin --enable
hermes gateway restart
```

如果没有运行 Gateway，安装后重新启动 Hermes 即可。如果 Gateway 由 PM2 等进程管理器托管，请在对应管理器中重启，例如 `pm2 restart hermes-gateway --update-env`。

::: details 其他安装方式与固定版本
如需可复现安装，从 [Release 页面](https://github.com/ZenMux/hermes-plugin/releases) 获取完整的 40 位 commit，替换下面的占位符：

```bash
hermes plugins install ZenMux/hermes-plugin --ref <40-character-commit> --enable
```

也可以通过 PyPI 安装。以下路径适用于使用默认虚拟环境的 Hermes；自定义安装请替换为实际 Python 路径：

```bash
~/.hermes/hermes-agent/venv/bin/python -m pip install zenmux-hermes-plugin
hermes plugins enable zenmux
hermes gateway restart
```

必须安装到 Hermes 所在的 Python 环境，否则 Hermes 无法发现插件。文件系统 Provider 安装方式见[插件 README](https://github.com/ZenMux/hermes-plugin/blob/main/README.zh.md)。
:::

### 2. 登录并授权

```bash
hermes auth add zenmux
hermes auth status zenmux
```

Hermes 会打开 ZenMux 授权页。选择账户和计费方式，批准授权，然后回到终端查看认证状态。

access token 和 refresh token 由 Hermes 保存在凭据池中，不保存在插件目录；插件中的 `zenmux.json` 只包含 public OAuth client ID。刷新时通过 Hermes 凭据锁串行化 refresh token 轮换。

::: warning 保护登录凭据
不要把 token、authorization code 或完整的认证文件粘贴到聊天、工单或代码仓库。OAuth 插件不要求您手动复制 token 到 API Key 配置中。
:::

### 3. 选择模型并验证

打开模型选择器，选择插件提供的 ZenMux 供应商及所需模型：

```bash
hermes model
```

也可以显式指定 provider 和完整模型 slug，避免沿用之前的自定义端点配置：

```bash
hermes --provider zenmux -m google/gemini-2.5-flash-lite
hermes --provider zenmux -m anthropic/claude-sonnet-4.5
```

在会话中发送一条简短消息，确认能收到模型回复。若要将 ZenMux 设为默认供应商：

```bash
hermes config set model.provider zenmux
hermes config set model.default google/gemini-2.5-flash-lite
hermes config set model.base_url https://zenmux.ai/api/v1
hermes config set model.api_mode chat_completions

hermes -z "Reply with exactly: OK" --safe-mode
```

登录成功只说明授权完成；收到实际模型回复才说明推理链路可用。

### 4. 切换模型与模型目录

在已使用 ZenMux 的聊天或消息机器人中，可以输入：

```text
/model z-ai/glm-5.3-flashx
```

`zenmux` 是 provider 名，不是模型 slug 前缀。应使用完整的 `vendor/model` ID，例如 `z-ai/glm-5.3-flashx`，而不是 `zenmux/glm-5.3-flashx`。

插件实时读取 `https://zenmux.ai/api/v1/models`，保留输出文本的模型，并从对话模型选择器中过滤纯图片、视频生成模型。仅在目录暂时不可用时使用少量 fallback 模型。模型示例不保证对所有账户可用，实际可用性以账户权限和 API 响应为准。

::: info 目录外模型
实时目录用于模型选择和拼写建议，不是账户权限白名单。对于账户专属、灰度或特殊路由 slug，Hermes 需要支持 `ProviderProfile.model_listing_authoritative`，才能允许目录外 slug 继续请求。旧版 Hermes 可能在发送前拒绝，需要先更新 Hermes 和插件。无效或无权访问的 slug 仍会被 ZenMux API 拒绝。
:::

### 远程服务器与无界面环境 {#remote-oauth}

OAuth 回调使用临时 loopback 地址，例如 `http://127.0.0.1:54321/callback`。这里的端口不是固定值。

1. 在远程终端启动登录，获取本次生成的授权 URL 和回调端口：

   ```bash
   hermes auth add zenmux --no-browser
   ```

2. 保持远程登录命令等待，在本机另开终端转发**本次实际显示的端口**（下面仅以 `54321` 为例）：

   ```bash
   ssh -N -L 54321:127.0.0.1:54321 user@remote-host
   ```

3. 在本机浏览器打开本次生成的授权 URL，完成授权，再回到远程终端检查结果。

插件 `0.1.1` 及以上版本最多等待 10 分钟。超时后必须重新登录，使用新 URL 和新端口，不能复用过期 authorization code。不要将回调服务暴露到公网。

对于不能 SSH 转发的托管容器，README 提供了在临时本地 `HERMES_HOME` 授权后、安全合并 `credential_pool.zenmux` 的替代方案。仅迁移该 provider 的凭据，切勿用整个本地 `auth.json` 覆盖远程其他 provider 的凭据；详见[远程环境说明](https://github.com/ZenMux/hermes-plugin/blob/main/README.zh.md#远程与无界面服务器)。

### 认证管理与更新

```bash
# 查看凭据、主动刷新或退出登录
hermes auth list zenmux
hermes auth refresh zenmux
hermes auth logout zenmux
```

按原安装方式更新插件，然后重启 Hermes 或 Gateway：

::: code-group

```bash [GitHub]
hermes plugins install ZenMux/hermes-plugin --force --enable
hermes gateway restart
```

```bash [PyPI]
~/.hermes/hermes-agent/venv/bin/python -m pip install --upgrade zenmux-hermes-plugin
hermes gateway restart
```

:::

停止使用时可先运行 `hermes auth logout zenmux`，再运行 `hermes plugins disable zenmux`。完整卸载步骤见[插件 README](https://github.com/ZenMux/hermes-plugin/blob/main/README.zh.md#卸载)。

## 方式二：API Key 自定义端点 {#api-key}

不使用 OAuth 插件时，仍可沿用 API Key 接入，无需安装插件。

1. 根据需求创建[订阅 API Key](/zh/guide/subscription) 或[按量付费 API Key](/zh/guide/pay-as-you-go)。套餐、价格和配额以对应页面为准。
2. 运行 `hermes model`，选择 **Custom endpoint (enter URL manually)**。
3. 按提示填写：

   | 配置项 | 值 |
   | --- | --- |
   | API Base URL | `https://zenmux.ai/api/v1` |
   | API Key | 您的 ZenMux API Key |
   | 模型名称 | 完整模型 ID，例如 `openai/gpt-5.4` |

4. 运行 `hermes` 并发送测试消息，确认收到模型回复。

::: warning 两种方式不要混用
API Key 自定义端点的 `model.provider` 是 `custom`；OAuth 插件的 provider 是 `zenmux`。从旧方式迁移到 OAuth 后，请重新选择插件供应商，或按上文设置默认 provider。模型 ID 均不需要添加 `zenmux/` 前缀。
:::

## 故障排除

### OAuth 插件问题

::: details Unknown provider 'zenmux'
先确认 Hermes 满足前置版本要求，再检查插件是否已安装、启用：

```bash
hermes plugins list
hermes plugins enable zenmux
hermes gateway restart
```

PyPI 安装还需确认插件位于 Hermes 使用的 Python 环境中。若 Gateway 由其他管理器托管，请在那里重启。
:::

::: details OAuth 超时或授权失败
重新运行 `hermes auth add zenmux`，使用本次新生成的 URL 和端口。远程服务器需按[远程授权步骤](#remote-oauth)建立转发。不要重复使用过期登录流程的 authorization code。

已登录后认证失效，可先运行 `hermes auth status zenmux` 和 `hermes auth refresh zenmux`；如果刷新仍失败，再重新登录。
:::

::: details 已登录，但推理提示没有 endpoint
更新插件并重新运行 `hermes auth add zenmux`。当前插件会在凭据中保存 `base_url=https://zenmux.ai/api/v1`，早期开发版本未保存该字段。
:::

::: details 模型因不在目录中而被拒绝
先检查完整 `vendor/model` slug 是否正确。若是有效的目录外模型，请更新到支持 `ProviderProfile.model_listing_authoritative` 的 Hermes，并更新插件。目录外放行不代表拥有调用权限，最终以 ZenMux API 响应为准。
:::

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
   OAuth 方式选择插件的 ZenMux 供应商；API Key 方式选择 "Custom endpoint"。确认 URL 为 `https://zenmux.ai/api/v1`

2. **检查当前配置**：
   ```bash
   hermes config
   ```
   确认 `model` 段的 `provider`：OAuth 插件应为 `zenmux`，API Key 自定义端点应为 `custom`；`base_url` 应为 `https://zenmux.ai/api/v1`

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
   - 使用标准 `HTTP_PROXY` / `HTTPS_PROXY` 配置代理
   - 如代理会终止 TLS，通过 `SSL_CERT_FILE` / `REQUESTS_CA_BUNDLE` 配置其 CA，不要全局关闭 TLS 校验

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

<ContactCards>
<ContactCard icon="mail" title="邮箱">

技术支持: [support@zenmux.ai](mailto:support@zenmux.ai)

商务合作: [bd@zenmux.ai](mailto:bd@zenmux.ai)

</ContactCard>
<ContactCard icon="x" title="X / Twitter" link="https://x.com/ZenMuxAI" label="@ZenMuxAI" />
<ContactCard icon="discord" title="Discord" link="https://discord.gg/vHZZzj84Bm" label="@ZenMuxAI" />
</ContactCards>
