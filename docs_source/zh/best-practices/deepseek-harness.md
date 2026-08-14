---
head:
  - - meta
    - name: description
      content: 使用普通 API Key 或 @zenmux/dsh-plugins OAuth PKCE 将 DeepSeek Harness 接入 ZenMux
  - - meta
    - name: keywords
      content: ZenMux, DeepSeek Harness, DSH, API Key, OAuth, PKCE, DeepSeek V4, Agent
---

# DeepSeek Harness 接入 ZenMux

DeepSeek Harness（DSH）支持两种方式接入 ZenMux：

| 方式 | 是否需要插件 | 适用场景 |
| --- | --- | --- |
| 普通 API Key 配置 | 不需要 | 已有 ZenMux API Key，希望直接使用 DSH 内置 DeepSeek Provider |
| OAuth PKCE | 需要 `@zenmux/dsh-plugins` | 希望通过浏览器登录，不复制或长期保存 API Key |

## 安装 DeepSeek Harness

使用 npm 全局安装官方 `@deepseek-ai/dsh` 包：

```bash
npm i -g @deepseek-ai/dsh
```

安装完成后检查命令是否可用：

```bash
dsh --version
```

如果终端提示找不到 `dsh`，请重新打开终端，并确认 npm 全局可执行文件目录已加入 `PATH`。

## 使用普通 API Key 配置

普通配置直接复用 DSH 内置的 `deepseek-official` Provider，不需要安装 ZenMux PKCE 插件。

先设置 ZenMux API Key：

```bash
export ZENMUX_API_KEY="sk-ai-v1-xxx"
```

然后编辑 `$DSH_HOME/settings.yaml`；如果未设置 `DSH_HOME`，默认路径为 `~/.dsh/settings.yaml`：

```yaml
llm-deepseek:
  apiKeyEnv: ZENMUX_API_KEY
  baseURL: https://zenmux.ai/api/v1
```

启动 DSH，并在模型选择器中选择内置的 **DeepSeek-V4-Flash** 或其他 ZenMux 支持的 DeepSeek 模型：

```bash
dsh web
```

`apiKeyEnv` 只保存环境变量名称，API Key 本身不会写入 `settings.yaml`。DSH 已内置默认模型列表，因此普通配置不需要重复填写模型；只有使用其他模型或自定义显示名称时才需要增加 `models`。

如果需要让 API Key 长期生效，请根据当前 Shell 将 `export ZENMUX_API_KEY="..."` 写入 `~/.zshrc` 或 `~/.bashrc`，然后重新打开终端。

如果终端必须通过代理访问 ZenMux，Node.js 24 可以这样启动：

```bash
HTTPS_PROXY="http://127.0.0.1:7890" NODE_OPTIONS="--use-env-proxy" dsh web
```

::: tip 已验证配置
以上最小配置已使用 DSH `0.1.0-rc.6` 和其内置的 `deepseek-v4-flash` 发起真实请求并获得正常响应。测试使用独立的临时 `$DSH_HOME`，没有修改用户已有配置，也没有安装 PKCE 插件。
:::

## 使用 OAuth PKCE

官方 npm 包 `@zenmux/dsh-plugins` 使用 OAuth 2.0 Authorization Code + PKCE 完成浏览器授权，无需创建或复制 ZenMux API Key，并会在 Access Token 到期前自动刷新登录状态。

当前 PKCE 集成面向交互式 DSH Web，提供以下能力：

- `/zenmux login`、`/zenmux status` 和 `/zenmux logout` 命令。
- 通过浏览器完成 ZenMux OAuth PKCE 授权。
- 自动保存并轮换 Access Token 与 Refresh Token。
- 预置 ZenMux DeepSeek V4 Pro 和 DeepSeek V4 Flash 模型。
- 通过 Anthropic Messages 协议使用提示词缓存与思考预算。

### 安装插件

将插件安装到 DSH Web Profile：

```bash
dsh plugin --profile web add @zenmux/dsh-plugins
```

然后启动 DSH Web：

```bash
dsh web
```

安装包会自动挂载 ZenMux OAuth 控制器，并在 DSH 已有的 `pi-ai` Adapter 中加入 ZenMux Provider。它不会替换 DSH 内置的 DeepSeek 路由，也不会自动切换已有对话的 Provider。

### 登录 ZenMux

在 DSH Web 中执行：

```text
/zenmux login
```

DSH Web 会在新标签页打开 ZenMux 授权页，同时显示一个 **打开 ZenMux 登录** 的备用链接。确认账号和授权范围后，等待回调页面显示 **ZenMux connected**，然后返回 DSH。

插件只请求以下权限：

- `inference:invoke`：调用 ZenMux 模型。
- `offline_access`：在 Access Token 过期后刷新登录状态。

OAuth 回调使用一次性的 `127.0.0.1:<临时端口>/callback`。监听器会校验 `state`，并在成功接收一次响应或登录超时后关闭。

### 选择模型

登录成功后，在模型选择器中选择：

- **ZenMux · DeepSeek V4 Pro**
- **ZenMux · DeepSeek V4 Flash**

这两个预置模型通过 ZenMux 的 Anthropic Messages 端点调用，以便 DSH/pi-ai 使用 Anthropic 提示词缓存和思考预算。

::: info 模型不会自动刷新
当前 DSH 自动模型发现只支持 OpenAI 兼容的 `/models` 路由，还不能为 `anthropic-messages` Provider 自动发现模型。因此插件提供两个可直接使用的初始模型，不显示无效的模型刷新入口。
:::

如需使用其他 ZenMux 模型，可以在 **设置 → 模型** 中编辑 ZenMux Provider 的 `models` 数组。请填写 ZenMux 模型 ID，并根据模型能力配置推理等级。不要把 OAuth Token 粘贴到模型配置中。

### 管理登录状态

查看当前连接状态和到期时间：

```text
/zenmux status
```

退出登录：

```text
/zenmux logout
```

退出时，插件会尝试在 ZenMux 撤销 Refresh Token，然后清除 DSH 中保存的 OAuth 凭据。还可以前往 ZenMux 的已授权应用页面撤销该授权。

### 代理与网络配置

OAuth Discovery、Token 和 Revocation 请求默认直接连接 ZenMux。如果 DSH 所在环境必须使用代理，可以在 DSH Profile 中配置 `proxyUrl`，或在启动前设置 `HTTPS_PROXY`：

```bash
export HTTPS_PROXY="http://127.0.0.1:7890"
dsh web
```

插件支持 HTTP、HTTPS、`socks4a://` 和 `socks5h://` 代理。DSH Profile 中显式配置的 `proxyUrl` 优先于环境变量。

::: warning 浏览器与 DSH 网络相互独立
浏览器需要能够访问 ZenMux 授权页，并将回调发送到运行 DSH 的临时 Loopback 端口。远程服务器、容器或浏览器不在同一台机器时，浏览器中的 `127.0.0.1` 不一定指向 DSH 主机。
:::

如果企业代理使用本地 CA 重新签发 TLS 证书，应在 Node.js 启动前加载 CA：

```bash
NODE_EXTRA_CA_CERTS=/absolute/path/to/ca.pem dsh web
```

不要使用 `NODE_TLS_REJECT_UNAUTHORIZED=0`。关闭 TLS 校验可能暴露 Authorization Code 和 Refresh Token。

### 可选环境变量

生产环境通常不需要额外配置。以下变量主要用于代理环境、开发环境或自托管服务：

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `ZENMUX_OAUTH_ORIGIN` | `https://zenmux.ai` | OAuth 授权服务器地址 |
| `ZENMUX_OAUTH_CLIENT_ID` | 随包 Public Client | 覆盖 OAuth Public Client ID |
| `ZENMUX_OAUTH_SCOPES` | `inference:invoke offline_access` | 登录请求的权限范围 |
| `ZENMUX_API_BASE_URL` | `https://zenmux.ai/api/v1` | ZenMux API 基础地址 |
| `ZENMUX_ANTHROPIC_BASE_URL` | 从 API Base URL 派生 | 覆盖 Anthropic Messages 端点 |
| `ZENMUX_OAUTH_NO_BROWSER` | 未设置 | 设为 `1` 时不自动打开浏览器 |
| `HTTPS_PROXY` / `https_proxy` | 未设置 | OAuth 请求使用的网络代理 |

### 支持范围与限制

- 当前包面向能够执行 `/zenmux` 命令的交互式 DSH Web。
- 不消费 `ctx.commands` 的纯 Headless 或自动化部署不能自行发起浏览器登录。
- Headless 部署可以复用同一个 Harness Home 中由交互式 DSH Web 创建的凭据。
- 插件不会把 OAuth 状态、Token 或到期时间加入模型输入或对话历史。
- 代理不可用时登录与刷新会失败，不会静默回退到其他网络路径。

需要了解所有支持 OAuth PKCE 的 Agent，请参阅[使用 OAuth PKCE 登录 ZenMux](/zh/best-practices/oauth-pkce)。
