---
head:
  - - meta
    - name: description
      content: 使用 OAuth 2.0 Authorization Code + PKCE 将 ZenMux 接入 OpenClaw、Codex、DeepSeek Harness、OpenCode 和 Pi，无需复制 API Key
  - - meta
    - name: keywords
      content: ZenMux, OAuth, PKCE, OpenClaw, Codex, DeepSeek Harness, DSH, OpenCode, Pi, Agent 登录
---

# 使用 OAuth PKCE 登录 ZenMux

ZenMux 支持通过 OAuth 2.0 Authorization Code + PKCE 将账号授权给本地 Agent。使用这种方式时，无需创建、复制或保存 ZenMux API Key：Agent 会打开浏览器完成授权，并使用短期 Access Token 调用模型；插件会在 Token 过期前自动刷新。

目前支持以下 Agent：

| Agent | npm 包 | 登录入口 |
| --- | --- | --- |
| OpenClaw | `@zenmux/openclaw-plugin` | `openclaw models auth login --provider zenmux` |
| Codex CLI / Codex App | `@zenmux/codex-oauth` | `zenmux-codex-auth login` |
| DeepSeek Harness（DSH Web） | `@zenmux/dsh-plugins` | `/zenmux login` |
| OpenCode | `@zenmux/opencode-oauth` | `/connect` 或 `opencode auth login` |
| Pi | `@zenmux/pi-zenmux-oauth` | `/login zenmux` |

::: tip OAuth PKCE 与 API Key 的区别
OAuth PKCE 授权绑定到当前 ZenMux 用户和授权记录，不会向插件分发客户端密钥，也不需要把 API Key 写入 shell 配置。你可以随时在 ZenMux 的已授权应用中撤销访问。
:::

## 授权流程

五个集成使用相同的核心流程：

1. Agent 生成一次性的 PKCE `code_verifier` 和对应的 S256 `code_challenge`。
2. 浏览器打开 ZenMux 授权页，由用户确认账号和授权范围。
3. ZenMux 将一次性 Authorization Code 返回到 `127.0.0.1` 的临时回调端口。
4. 插件使用 Authorization Code 和 `code_verifier` 换取 Access Token 与 Refresh Token。
5. Agent 使用 Access Token 调用 ZenMux，并在过期前自动刷新 Token。

这些官方包默认只请求以下权限：

- `inference:invoke`：调用模型。
- `offline_access`：在 Access Token 过期后刷新登录状态。

## OpenClaw

安装插件并启动登录：

```bash
openclaw plugins install @zenmux/openclaw-plugin
openclaw models auth login --provider zenmux
```

在登录方式中选择 **ZenMux OAuth**，然后在浏览器完成授权。返回 OpenClaw 后，选择一个 `zenmux/...` 模型即可使用。

OpenClaw 会将令牌保存在自己的认证配置中，并自动保存刷新后轮换的 Refresh Token。模型列表会动态发现，并把最近一次有效目录缓存到 `~/.cache/openclaw/zenmux/models.json`。

::: tip 远程服务器或 VPS
OpenClaw 支持将浏览器最终跳转后的完整 Redirect URL 复制回终端，因此即使 OpenClaw 运行在远程服务器，也可以完成登录。
:::

## Codex CLI 与 Codex App

全局安装认证工具：

```bash
npm install -g @zenmux/codex-oauth
```

配置 Codex 并登录：

```bash
zenmux-codex-auth install
zenmux-codex-auth login
```

完成后重启 Codex CLI 或 Codex App。`install` 会将 ZenMux 配置为 Responses Provider，并下载当前支持 Responses 协议的模型目录，但不会修改已有的模型名称。已有 `~/.codex/config.toml` 会先备份。

可以使用以下命令检查或清除登录状态：

```bash
zenmux-codex-auth status
zenmux-codex-auth logout
```

::: warning 不要手动运行 token 命令
`zenmux-codex-auth token` 专供 Codex 的 `auth.command` 调用，会在标准输出中返回有效的 Bearer Token。不要为了排查问题而运行、截图或记录它。
:::

如需完整移除集成，请先恢复 Codex 配置，再卸载 npm 包：

```bash
zenmux-codex-auth uninstall
npm uninstall -g @zenmux/codex-oauth
```

## DeepSeek Harness

将 ZenMux 插件安装到 DSH Web Profile，然后启动 DSH：

```bash
dsh plugin --profile web add @zenmux/dsh-plugins
dsh web
```

在 DSH Web 中执行：

```text
/zenmux login
```

浏览器授权完成并显示 **ZenMux connected** 后，返回 DSH，在模型选择器中选择 **ZenMux · DeepSeek V4 Pro** 或 **ZenMux · DeepSeek V4 Flash**。

登录状态管理命令：

```text
/zenmux status
/zenmux logout
```

::: info DSH 支持范围
当前包面向能够执行 `/zenmux` 命令的交互式 DSH Web。不会消费命令适配器的纯 Headless 或自动化部署无法自行发起浏览器登录，但可以复用同一个 Harness Home 中已经生成的凭据。
:::

## OpenCode

在 OpenCode 配置中添加 OAuth 插件：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@zenmux/opencode-oauth"]
}
```

然后执行：

```bash
opencode auth login -p zenmux -m "ZenMux OAuth (PKCE)"
```

也可以在 OpenCode 中运行 `/connect`，依次选择 **ZenMux** 和 **ZenMux OAuth (PKCE)**。完成授权后运行 `/models`，选择 ZenMux 模型。

OpenCode 会使用自己的凭据存储 Access Token 与 Refresh Token。模型目录按模型匹配 Anthropic Messages、OpenAI Responses 或 Chat Completions，并缓存到 `~/.cache/opencode/zenmux/models.json`。

::: info 版本兼容性
`@zenmux/opencode-oauth` 当前面向稳定版 OpenCode V1 插件 API。OpenCode V2 使用另一套 Beta 插件 API，暂不属于本文支持范围。
:::

## Pi

使用 Pi 安装扩展：

```bash
pi install npm:@zenmux/pi-zenmux-oauth
```

启动 Pi 后登录：

```text
/login zenmux
```

浏览器授权完成后返回 Pi，运行 `/model` 并选择 ZenMux 模型。Pi 会在自己的 Provider 凭据存储中管理 Access Token 与 Refresh Token，并把模型目录缓存到 `~/.pi/agent/models-store.json`。

## 凭据与安全

| Agent | 凭据存储 |
| --- | --- |
| OpenClaw | OpenClaw 自身的 Auth Profile Store |
| Codex | macOS Keychain；其他系统使用权限为 `0600` 的 `~/.config/zenmux/codex-oauth/credentials.json` |
| DeepSeek Harness | DSH `ctx.credentials` 凭据服务 |
| OpenCode | OpenCode 自身的 Credential Store |
| Pi | Pi Provider Credential Store |

- 官方生产环境使用预置的 Native Public Client ID，不在 npm 包中保存 Client Secret。
- 回调监听器只绑定到 `127.0.0.1` 的临时端口，并校验 OAuth `state`。
- Access Token 过期前会自动刷新；服务端返回新的 Refresh Token 时，插件会保存轮换后的 Token。
- 不要把 OAuth Token 手动复制到模型配置、环境变量、日志或截图中。
- 不再使用某个 Agent 时，请同时在 Agent 中退出登录，并在 ZenMux 的已授权应用中撤销授权。

## 常见问题

### 浏览器没有自动打开

先复制终端中显示的授权链接到浏览器。Codex 还可以在启动登录前设置：

```bash
export ZENMUX_OAUTH_NO_BROWSER=1
zenmux-codex-auth login
```

### 浏览器授权后，终端仍在等待

OAuth 回调使用临时的 `127.0.0.1` 端口。确认防火墙没有阻止本地回环连接，并确认授权浏览器能够访问运行 Agent 的回调端口。远程或容器环境不能假设浏览器的 `127.0.0.1` 就是 Agent 所在机器；目前只有 OpenClaw 明确支持复制完整 Redirect URL 回终端。

### 登录成功但看不到 ZenMux 模型

重新打开 Agent 的模型选择器，并确认模型目录接口可访问。OpenClaw、OpenCode 和 Pi 会保留最近一次有效模型缓存；DeepSeek Harness 当前提供两个预置模型入口；Codex 的模型目录由 `zenmux-codex-auth install` 写入，模型目录更新后可以重新执行该命令。
