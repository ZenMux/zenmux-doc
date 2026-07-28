---
head:
  - - meta
    - name: description
      content: Agent 工具代理配置指南 —— Claude Code、Pi、Codex、Gemini CLI、OpenCode、Cline、Cursor、Cherry Studio、Open WebUI、Dify、OpenClaw 等工具的代理配置方法
  - - meta
    - name: keywords
      content: Zenmux, 代理, 网络, Claude Code, Pi, Codex, Gemini CLI, OpenCode, Cline, Cursor, 环境变量, HTTP_PROXY, HTTPS_PROXY
---

# Agent 工具代理配置指南

使用 Claude Code、Pi、Codex 这类 Agent 工具时，最常见的网络问题不是“代理完全没开”，而是代理只对浏览器生效，终端进程并没有继承；或者 Agent 本身能访问模型，但它执行的 `git`、`npm`、`curl` 等命令仍然无法联网。

## 为什么 Agent 工具需要配置代理

配置代理并不只是为了处理某个网站“打不开”。在真实的开发环境中，通常有以下几类原因：

- **公司内网不允许设备直接访问外网。** 所有互联网流量必须经过公司提供的 HTTP/HTTPS 代理，由统一出口完成身份认证、域名控制和安全审计。
- **公司需要对外部 AI 服务进行集中管控。** 研发人员不能直接连接模型厂商，需要经过安全网关记录访问日志、限制目标域名，或者执行数据防泄漏策略。
- **公司网络部署了防火墙或 TLS 检查。** 即使目标 API 可以访问，也可能因为公司代理重新签发 HTTPS 证书，出现证书不受信任、TLS 握手失败等问题。
- **本地网络访问模型服务不稳定。** DNS 解析、跨境链路、运营商路由或地域网络限制可能导致连接超时、流式响应中断和频繁重试。
- **Agent 运行在容器、远程服务器、WSL 或沙箱中。** 宿主机浏览器能够联网，不代表 Agent 所在的运行环境也拥有同样的网络出口。
- **需要让 Agent 执行的工具访问外网。** Agent 本身能够对话，但它调用的 `git clone`、`npm install`、`pip install`、`curl`、MCP Server 或网页抓取工具可能仍然无法连接网络。

因此，一套完整的代理配置至少需要回答三个问题：

```text
Agent 主程序能否连接模型服务？
Agent 启动的命令和子进程能否连接外网？
登录、OAuth、插件市场、网页搜索等附加服务能否访问？
```

这篇文章覆盖 Claude Code、Pi、Codex、Gemini CLI、OpenCode、Cline、Cursor、GitHub Copilot、Cherry Studio、Open WebUI、Dify、OpenClaw，以及其他常见桌面端和编辑器插件。不同工具的网络实现并不相同，所以不能把同一份配置机械地套到所有工具上。

> 本文讨论的是合法、合规的 HTTP/HTTPS 出站代理，例如公司网络代理、本机调试代理或已获授权的网络出口。请遵守所在地法律、公司安全制度和服务商条款。

## 一、先分清三个容易混淆的概念

### 1. 网络代理

网络请求仍然发往原来的服务地址，只是流量经过一个代理服务器转发。常用环境变量是：

```bash
HTTP_PROXY=http://127.0.0.1:7890
HTTPS_PROXY=http://127.0.0.1:7890
NO_PROXY=localhost,127.0.0.1
```

这是本文的重点。

### 2. API Base URL

Base URL 是把请求目的地改成另一个 API 网关。例如把 Anthropic 请求发到公司的 LLM Gateway，或把 OpenAI 请求发到兼容网关。

它不是传统意义上的网络代理，也不能替代代理服务器。只有当网关明确兼容目标 API 时才应该配置。

### 3. Agent 沙箱的网络权限

Agent 自己能连接模型，不代表它启动的命令也能联网。比如 Codex 可以正常对话，但在沙箱里执行 `npm install` 仍可能失败，因为命令网络权限被关闭了。

排查时应分别验证：

```text
Agent 能否连接模型服务？
Agent 执行的 curl、git、npm 能否联网？
浏览器登录或 OAuth 回调能否完成？
```

## 二、准备一个统一的代理配置

以下示例假设本机 HTTP 代理监听在 `127.0.0.1:7890`。请替换成自己的地址和端口。

很多代理软件同时提供 HTTP 和 SOCKS5 端口。这里应填写 **HTTP 代理端口**：

### 1. macOS、Linux：临时写入环境变量

在终端中执行：

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
export http_proxy="$HTTP_PROXY"
export https_proxy="$HTTPS_PROXY"
export NO_PROXY=localhost,127.0.0.1
export no_proxy="$NO_PROXY"
```

这些变量只对**当前终端窗口以及从这个窗口启动的程序**生效。关闭终端后就会失效。

可以在同一个终端中启动 Agent：

```bash
claude
# 或者
pi
codex
gemini
opencode
```

### 2. macOS、Linux：永久写入环境变量

先确认自己使用的 Shell：

```bash
echo "$SHELL"
```

如果输出包含 `zsh`，编辑 `~/.zshrc`：

```bash
nano ~/.zshrc
```

把下面内容添加到文件末尾：

```bash
# AI Agent network proxy
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
export http_proxy="$HTTP_PROXY"
export https_proxy="$HTTPS_PROXY"
export NO_PROXY=localhost,127.0.0.1
export no_proxy="$NO_PROXY"

# Pi 等新版 Node.js Agent 使用
export NODE_USE_ENV_PROXY=1
```

保存后执行：

```bash
source ~/.zshrc
```

如果使用 Bash，则写入 `~/.bashrc`：

```bash
nano ~/.bashrc
```

添加相同内容，然后执行：

```bash
source ~/.bashrc
```

部分 macOS 或 Linux 登录 Shell 使用 `~/.zprofile`、`~/.bash_profile` 或 `~/.profile`。如果新开终端后变量没有自动出现，应检查终端实际加载的是哪个配置文件。

### 3. Windows PowerShell：临时写入环境变量

在 PowerShell 中执行：

```powershell
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
$env:http_proxy = $env:HTTP_PROXY
$env:https_proxy = $env:HTTPS_PROXY
$env:NO_PROXY = "localhost,127.0.0.1"
$env:no_proxy = $env:NO_PROXY
$env:NODE_USE_ENV_PROXY = "1"
```

这些变量只对当前 PowerShell 窗口及其子进程生效。随后直接启动工具：

```powershell
claude
# 或 pi、codex、gemini、opencode
```

### 4. Windows：永久写入用户环境变量

在 PowerShell 中执行：

```powershell
[Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://127.0.0.1:7890", "User")
[Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://127.0.0.1:7890", "User")
[Environment]::SetEnvironmentVariable("http_proxy", "http://127.0.0.1:7890", "User")
[Environment]::SetEnvironmentVariable("https_proxy", "http://127.0.0.1:7890", "User")
[Environment]::SetEnvironmentVariable("NO_PROXY", "localhost,127.0.0.1", "User")
[Environment]::SetEnvironmentVariable("no_proxy", "localhost,127.0.0.1", "User")
[Environment]::SetEnvironmentVariable("NODE_USE_ENV_PROXY", "1", "User")
```

也可以通过图形界面配置：

1. 在开始菜单中搜索“环境变量”。
2. 打开“编辑账户的环境变量”。
3. 在“用户变量”区域逐个新建 `HTTP_PROXY`、`HTTPS_PROXY`、`NO_PROXY` 和 `NODE_USE_ENV_PROXY`。
4. 保存后，完整退出并重新打开 PowerShell、VS Code、Cursor 以及其他 Agent 应用。

不要为了方便直接修改系统变量；一般使用当前用户的环境变量就足够了。

### 5. Windows CMD

当前 CMD 窗口临时生效：

```bat
set HTTP_PROXY=http://127.0.0.1:7890
set HTTPS_PROXY=http://127.0.0.1:7890
set NO_PROXY=localhost,127.0.0.1
set NODE_USE_ENV_PROXY=1
```

永久写入当前用户：

```bat
setx HTTP_PROXY "http://127.0.0.1:7890"
setx HTTPS_PROXY "http://127.0.0.1:7890"
setx NO_PROXY "localhost,127.0.0.1"
setx NODE_USE_ENV_PROXY "1"
```

`setx` 不会修改当前已经打开的 CMD 窗口，执行后需要重新打开终端。

### 6. 检查环境变量是否生效

macOS、Linux：

```bash
env | grep -i proxy
```

Windows PowerShell：

```powershell
Get-ChildItem Env: | Where-Object Name -Match "proxy"
```

Windows CMD：

```bat
set | findstr /I proxy
```

然后测试代理：

```bash
curl -I --proxy http://127.0.0.1:7890 https://api.openai.com
```

最后从同一个终端启动 Agent。只验证 `curl` 还不够：如果 Agent 是从 Dock、开始菜单或桌面图标启动的，它可能没有继承刚才写入终端的变量。

注意：即使目标网站是 HTTPS，`HTTPS_PROXY` 的值也经常以 `http://` 开头。这表示客户端先通过 HTTP `CONNECT` 连接代理，然后建立到目标站点的 TLS 通道，并不表示最终访问是明文的。

先用 `curl` 验证代理本身：

```bash
curl -I --proxy http://127.0.0.1:7890 https://api.anthropic.com
curl -I --proxy http://127.0.0.1:7890 https://api.openai.com
```

收到 `401`、`403`、`404` 等 HTTP 响应并不一定是坏事：它至少说明 DNS、代理连接和 TLS 通道已经建立。真正的网络失败通常表现为超时、连接拒绝、代理握手失败或证书错误。

## 三、Claude Code 的代理配置

Claude Code 官方支持通过 `HTTP_PROXY` 和 `HTTPS_PROXY` 配置 HTTP/HTTPS 代理：

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890

claude
```

也可以只让一次运行使用代理：

```bash
HTTP_PROXY=http://127.0.0.1:7890 \
HTTPS_PROXY=http://127.0.0.1:7890 \
claude
```

如果代理需要用户名和密码：

```bash
export HTTPS_PROXY=http://username:password@proxy.example.com:8080
```

用户名或密码包含 `@`、`:`、`/`、`#` 等特殊字符时，需要先进行 URL 编码。不要把真实密码直接提交到 Git 仓库或写进共享脚本。

Claude Code 有两个需要特别注意的限制：

- 官方文档说明它目前不支持 `NO_PROXY`，配置代理后，其流量都会经过代理。
- 官方文档说明它不支持直接使用 SOCKS 代理，因此不能把 `socks5://127.0.0.1:7891` 当成上述变量的值。应在代理软件中开启 HTTP 代理端口，或在本地增加一层 HTTP-to-SOCKS 转换。

如果公司代理会解密并重新签发 HTTPS 流量，还需要让 Claude Code 信任公司的根证书：

```bash
export SSL_CERT_FILE=/path/to/company-ca-bundle.pem
export NODE_EXTRA_CA_CERTS=/path/to/company-ca-bundle.pem

claude
```

不要用下面这种方式“解决”证书问题：

```bash
export NODE_TLS_REJECT_UNAUTHORIZED=0
```

它会关闭 TLS 证书校验，使连接容易遭受中间人攻击。

Claude Code 的官方说明可参考：[Corporate proxy configuration](https://docs.anthropic.com/en/docs/claude-code/corporate-proxy)。

## 四、Pi Coding Agent 的代理配置

这里的 Pi 指 `@mariozechner/pi-coding-agent`。Pi 是 Node.js 程序，但 Pi 官方文档目前没有提供一套独立、稳定的代理配置项。因此，不能简单假设任意 Node.js 版本都会自动读取 `HTTP_PROXY`。

在 Node.js 22.21.0 及以上版本，或者 Node.js 24.5.0 及以上版本，可以显式开启 Node 的环境代理支持：

```bash
export NODE_USE_ENV_PROXY=1
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
export NO_PROXY=localhost,127.0.0.1

pi
```

一次性运行：

```bash
NODE_USE_ENV_PROXY=1 \
HTTP_PROXY=http://127.0.0.1:7890 \
HTTPS_PROXY=http://127.0.0.1:7890 \
NO_PROXY=localhost,127.0.0.1 \
pi
```

先检查 Node.js 版本：

```bash
node -v
```

新版 Node.js 会在启动时读取 `HTTP_PROXY`、`HTTPS_PROXY` 和 `NO_PROXY`。对应能力及版本要求见 [Node.js `--use-env-proxy` 文档](https://nodejs.org/api/cli.html#--use-env-proxy)。

需要说明的是：这是 Node.js 提供的代理能力，不是 Pi 对所有模型 Provider 作出的统一保证。Pi 支持多个 Provider，而个别 Provider SDK 可能创建自己的网络客户端或自定义 Agent，从而绕过 Node 的全局代理配置。如果出现“Pi 能登录但模型请求失败”或“某个 Provider 可用、另一个不可用”的情况，应按 Provider 分别测试。

建议先执行：

```bash
NODE_USE_ENV_PROXY=1 \
HTTPS_PROXY=http://127.0.0.1:7890 \
node -e "fetch('https://api.openai.com').then(r => console.log(r.status)).catch(console.error)"
```

如果测试成功而 Pi 仍失败，问题更可能位于具体 Provider、认证方式或 API 地址，而不是基础代理。

公司 TLS 代理场景可再增加：

```bash
export NODE_EXTRA_CA_CERTS=/path/to/company-ca-bundle.pem
```

## 五、Codex 的代理配置

Codex 要分成两条网络链路处理。

### 1. Codex 自己连接 OpenAI

从已配置代理变量的终端启动 Codex：

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
export NO_PROXY=localhost,127.0.0.1

codex
```

或者只对当前进程生效：

```bash
HTTP_PROXY=http://127.0.0.1:7890 \
HTTPS_PROXY=http://127.0.0.1:7890 \
NO_PROXY=localhost,127.0.0.1 \
codex
```

如果使用公司 TLS 代理或私有根证书，Codex 官方提供了专用变量：

```bash
export CODEX_CA_CERTIFICATE=/path/to/company-root-ca.pem
codex login
```

未设置 `CODEX_CA_CERTIFICATE` 时，Codex 还会回退读取 `SSL_CERT_FILE`。该证书配置同时用于登录、普通 HTTPS 请求和安全 WebSocket 连接。

### 2. Codex 执行的命令访问网络

这是最容易漏掉的一层。Codex CLI、IDE 扩展或桌面端在 `workspace-write` 沙箱中运行时，命令网络访问默认可能关闭。可以在用户级 `~/.codex/config.toml` 中开启：

```toml
[sandbox_workspace_write]
network_access = true
```

一次性启动也可以写成：

```bash
codex -c 'sandbox_workspace_write.network_access=true'
```

Codex 还提供 `network_proxy` 功能，用于约束沙箱命令可以访问的域名。它是一层安全策略，不是用来替代本机代理地址的：

```toml
[sandbox_workspace_write]
network_access = true

[features.network_proxy]
enabled = true
domains = {
  "api.openai.com" = "allow",
  "api.anthropic.com" = "allow",
  "github.com" = "allow",
  "*.githubusercontent.com" = "allow",
  "registry.npmjs.org" = "allow"
}
allow_upstream_proxy = true
```

这里有三个关键点：

- `network_access = true` 决定沙箱命令是否可以联网。
- `features.network_proxy` 决定联网后允许访问哪些目标。
- `allow_upstream_proxy = true` 允许沙箱网络继续使用进程环境中的上游代理；它不是代理服务器地址。

也就是说，仅仅打开 `features.network_proxy` 不会自动赋予网络权限；仅仅设置 `HTTPS_PROXY` 也不能绕过 Codex 沙箱策略。

如果本机代理监听在 `127.0.0.1`，沙箱的本地目标限制也可能影响访问。不要一上来就开放所有内网地址；优先把代理变量留给 Codex 的上游代理机制，并保持 `allow_upstream_proxy = true`。只有确实需要让 Agent 直接访问本地服务时，再为 `localhost` 或精确 IP 配置最小范围的例外。

Codex 的网络与沙箱说明可参考：[Codex Security](https://developers.openai.com/codex/security) 和 [Codex configuration reference](https://developers.openai.com/codex/config-reference)。

### 3. 不要把 `openai_base_url` 当成网络代理

Codex 还支持在用户级 `~/.codex/config.toml` 中设置：

```toml
openai_base_url = "https://gateway.example.com/v1"
```

这会把 OpenAI Provider 的 API 目的地址改成指定网关，适用于兼容 OpenAI API 的 LLM Gateway、路由服务或数据驻留入口。它不是通用 HTTP 代理，也不会让 `git`、`npm`、`curl` 自动走代理。

## 六、Gemini CLI 的代理配置

Gemini CLI 可以使用标准代理环境变量：

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
export NO_PROXY=localhost,127.0.0.1

gemini
```

Gemini CLI 还提供 `general.proxy` 配置。用户配置通常位于 `~/.gemini/settings.json`：

```json
{
  "general": {
    "proxy": "http://127.0.0.1:7890"
  }
}
```

对于 Gemini CLI 的远程 Agent/A2A 请求，官方文档明确说明会读取 `general.proxy`，也支持 `HTTP_PROXY` 和 `HTTPS_PROXY`。参考：[Gemini CLI Remote Subagents - Proxy support](https://geminicli.com/docs/core/remote-agents/#proxy-support)。

如果启用了 Gemini CLI 沙箱，还要区分主进程流量与沙箱内命令流量。官方提供 `GEMINI_SANDBOX_PROXY_COMMAND`，用于启动受控的沙箱代理；它适合企业希望按域名限制沙箱出口的场景，并不是普通用户必须配置的选项。参考：[Gemini CLI example proxy script](https://geminicli.com/docs/examples/proxy-script/)。

不要把下面的变量误认为普通网络代理：

```bash
GOOGLE_GEMINI_BASE_URL=https://gateway.example.com
GOOGLE_VERTEX_BASE_URL=https://gateway.example.com
```

它们改变的是 Gemini API 或 Vertex AI 的目标地址，只适用于对应协议的兼容网关。

## 七、OpenCode 的代理配置

OpenCode 可以优先通过启动环境变量配置：

```bash
HTTP_PROXY=http://127.0.0.1:7890 \
HTTPS_PROXY=http://127.0.0.1:7890 \
NO_PROXY=localhost,127.0.0.1 \
opencode
```

若当前安装版本或某个 Provider 没有自动读取代理，可以从已经设置好环境变量的终端启动 OpenCode，确保 GUI、TUI 和 Provider 子进程继承相同环境。

OpenCode 支持多个模型 Provider。某个 Provider 的 Base URL 配置只会改变对应模型请求的目标地址，不能替代网络代理，也不会自动代理 OpenCode 调用的 Git、MCP、网页工具和 shell 命令。

排查时建议分别测试：

```bash
curl -I https://api.openai.com
curl -I https://api.anthropic.com
opencode
```

如果 `curl` 可以通过代理访问，但只有某个 OpenCode Provider 报错，应继续检查该 Provider 的认证、Base URL 和 SDK 代理兼容性。

## 八、Cline 的代理配置

Cline 需要根据运行形态分别配置。

### VS Code 扩展

Cline 的 VS Code 扩展会使用 VS Code 自身的代理设置。在 VS Code 的 `settings.json` 中配置：

```json
{
  "http.proxy": "http://127.0.0.1:7890",
  "http.proxySupport": "override",
  "http.proxyStrictSSL": true
}
```

配置完成后应完整退出并重新启动 VS Code。

### Cline CLI

```bash
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
export no_proxy=localhost,127.0.0.1,.local

cline start
```

如果公司代理使用自定义 CA：

```bash
export NODE_EXTRA_CA_CERTS=/path/to/company-ca.pem
cline start
```

Cline 官方说明：CLI 支持 HTTP 代理，但不支持 SOCKS、PAC 脚本，以及 Basic 用户名密码之外的复杂代理认证。JetBrains 插件则应在 `Settings > Appearance & Behavior > System Settings > HTTP Proxy` 中配置。参考：[Cline Networking and Proxies](https://docs.cline.bot/troubleshooting/networking-and-proxies)。

## 九、Cursor、GitHub Copilot 与其他编辑器插件

### Cursor

Cursor 基于 VS Code，通常优先使用应用内的网络设置：

1. 打开 Settings。
2. 搜索 `proxy`。
3. 在 `Http: Proxy` 中填写 `http://127.0.0.1:7890`。
4. 保持 `Http: Proxy Strict SSL` 开启。
5. 完整重启 Cursor。

也可以编辑用户 `settings.json`：

```json
{
  "http.proxy": "http://127.0.0.1:7890",
  "http.proxySupport": "override",
  "http.proxyStrictSSL": true
}
```

如果应用内配置没有覆盖某个扩展或终端 Agent，可从带有代理变量的终端启动 Cursor：

```bash
HTTP_PROXY=http://127.0.0.1:7890 \
HTTPS_PROXY=http://127.0.0.1:7890 \
cursor .
```

Cursor 自带 Agent、扩展宿主和集成终端可能是不同进程。出现部分功能可用、部分不可用时，要分别检查 Cursor 主程序、扩展和终端环境。

### GitHub Copilot

GitHub Copilot for VS Code 可使用 VS Code 的 `http.proxy`；JetBrains 版本读取 IDE 的 HTTP Proxy；Visual Studio 版本读取 Windows 代理设置。

VS Code 示例：

```json
{
  "http.proxy": "http://127.0.0.1:7890",
  "http.proxyStrictSSL": true
}
```

如果编辑器中没有单独配置，Copilot 还会按顺序检查：

```text
HTTPS_PROXY
https_proxy
HTTP_PROXY
http_proxy
```

GitHub 官方目前不支持代理 URL 使用 `https://` 开头，因此一般应填写：

```bash
HTTPS_PROXY=http://proxy.company.com:8080
```

而不是：

```bash
HTTPS_PROXY=https://proxy.company.com:8080
```

Copilot 可从操作系统信任库读取企业证书，也能读取 `NODE_EXTRA_CA_CERTS`。参考：[GitHub Copilot 网络设置](https://docs.github.com/zh/copilot/how-tos/configure-personal-settings/configure-network-settings?tool=vscode)。

### Obsidian、Sider 和常见 VS Code 插件

Obsidian 插件、Sider 浏览器扩展，以及大多数运行在编辑器或浏览器中的 Agent 插件，通常没有独立的通用代理协议实现：

- 浏览器扩展一般继承浏览器或操作系统代理。
- VS Code 扩展优先检查 VS Code 的 `http.proxy`。
- Electron 桌面应用通常优先继承系统代理，部分版本也会继承启动进程环境变量。

因此，应先配置宿主应用，再重启插件：

```json
{
  "http.proxy": "http://127.0.0.1:7890",
  "http.proxyStrictSSL": true
}
```

如果插件本身提供 Provider Base URL，该配置只负责模型 API 地址，不等同于网络代理。

## 十、Cherry Studio 与其他桌面客户端

### Cherry Studio

Cherry Studio 自带代理模式，可在应用设置的常规设置或网络设置中填写本地代理：

```text
http://127.0.0.1:7890
```

应填写代理软件显示的 HTTP 监听端口。Cherry Studio 文档提示主要使用 `http://` 代理地址，不要直接填写 `socks5://`。参考：[Cherry Studio 常规设置](https://docs.cherry-ai.com/pre-basic/settings/general)。

如果模型 Provider 可以单独填写 API Host 或 Base URL，应把它理解为模型网关设置。代理模式负责网络出口，API Host 决定请求目标，两者用途不同。

### Neovate、CC-Switch、RikkaHub、Hermes Agent

这些工具的版本和运行平台差异较大，不能编造一个所有版本都支持的专用配置键。可以按下面的优先级处理：

1. 先检查应用设置中是否有 `Proxy`、`Network`、`HTTP Proxy` 或“跟随系统代理”。
2. 桌面端优先开启系统代理并重启应用。
3. CLI 或 Node.js Agent 从已经设置 `HTTP_PROXY`、`HTTPS_PROXY` 的终端启动。
4. Android 客户端通常继承当前 Wi-Fi、VPN 或系统级网络通道；普通 App 环境变量对它无效。
5. 如果工具只提供 Base URL，则它只能接入兼容模型网关，不能视为通用网络代理。

CC-Switch 主要用于管理 Claude Code、Codex 等工具的 Provider 和配置。即使它能修改 API 地址，Claude Code 或 Codex 进程本身仍需按照本文对应章节配置网络代理。

## 十一、Open WebUI、Dify 和 OpenClaw

这类工具通常运行在 Docker、服务器或长期驻留服务中。代理变量必须配置在**实际运行服务的容器或 systemd 进程中**，只在当前 SSH 终端执行 `export` 往往不会影响已经启动的服务。

### Open WebUI

Open WebUI 官方支持 `http_proxy`、`https_proxy` 和 `no_proxy`。Docker Compose 示例：

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      http_proxy: http://host.docker.internal:7890
      https_proxy: http://host.docker.internal:7890
      no_proxy: localhost,127.0.0.1,ollama
```

在 Linux Docker 中，`host.docker.internal` 可能需要显式映射：

```yaml
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

Open WebUI 文档说明网页内容抓取、HTTP/HTTPS 检索等能力会使用这些变量。参考：[Open WebUI Environment Variable Configuration](https://docs.openwebui.com/reference/env-configuration/#proxy-settings)。

需要注意：用户浏览器访问 Open WebUI 时使用的 Nginx/Caddy“反向代理”，与 Open WebUI 访问模型 API 的“出站代理”不是一回事。

### Dify

Dify 通常由多个 Docker 服务组成。若要让服务访问外部模型、插件市场或外部 API，需要把代理变量加入实际发起请求的服务，而不是只配置宿主机：

```yaml
services:
  api:
    environment:
      HTTP_PROXY: http://host.docker.internal:7890
      HTTPS_PROXY: http://host.docker.internal:7890
      NO_PROXY: localhost,127.0.0.1,db,redis,weaviate,sandbox,plugin_daemon

  worker:
    environment:
      HTTP_PROXY: http://host.docker.internal:7890
      HTTPS_PROXY: http://host.docker.internal:7890
      NO_PROXY: localhost,127.0.0.1,db,redis,weaviate,sandbox,plugin_daemon
```

具体还可能涉及 `plugin_daemon`、`sandbox` 或其他服务，应根据失败日志确认谁在发起请求。`NO_PROXY` 必须保留 Docker 内部服务名，否则数据库、Redis、向量库等内网流量也可能被错误发送到代理。

Dify 前面的 Nginx 负责用户访问，是入站反向代理；这里的 `HTTP_PROXY`/`HTTPS_PROXY` 负责 Dify 访问外部服务，是出站代理。不要混淆。

### OpenClaw

新版 OpenClaw 提供了面向运维的显式代理配置，可以通过命令行、配置或环境变量设置。环境变量示例：

```bash
export OPENCLAW_PROXY_URL=http://127.0.0.1:7890
openclaw proxy validate
```

也可以直接验证指定代理：

```bash
openclaw proxy validate \
  --proxy-url http://127.0.0.1:7890 \
  --allowed-url https://api.openai.com \
  --allowed-url https://api.anthropic.com
```

如果是公司 HTTPS 代理端点，还可提供 CA 文件：

```bash
openclaw proxy validate \
  --proxy-url https://proxy.company.com:8443 \
  --proxy-ca-file /path/to/company-ca.pem
```

OpenClaw 的优先级是命令行 `--proxy-url`、配置中的 `proxy.proxyUrl`、环境变量 `OPENCLAW_PROXY_URL`。参考：[OpenClaw Proxy CLI](https://docs.openclaw.ai/cli/proxy)。

如果 OpenClaw 作为 systemd、Docker 或后台 Gateway 运行，必须把变量写入该服务的环境配置后重启服务。只在登录 shell 中设置变量，不会改变已经运行的 Gateway。

### OpenClaw 部署在阿里云或其他云服务器

云服务器上的 OpenClaw 不能使用你个人电脑的 `127.0.0.1:7890`，因为服务器的 `127.0.0.1` 指向服务器自己。需要使用公司提供的可达代理、部署在同一内网的代理，或在服务器本机运行合规的代理服务。

systemd 可以使用单独的环境文件，例如：

```ini
# /etc/openclaw/proxy.env
OPENCLAW_PROXY_URL=http://proxy.company.internal:8080
HTTP_PROXY=http://proxy.company.internal:8080
HTTPS_PROXY=http://proxy.company.internal:8080
NO_PROXY=localhost,127.0.0.1,metadata.aliyun.com,100.100.100.200
```

在 OpenClaw 服务中引用：

```ini
[Service]
EnvironmentFile=/etc/openclaw/proxy.env
```

然后重新加载并重启：

```bash
sudo systemctl daemon-reload
sudo systemctl restart openclaw
sudo systemctl status openclaw
```

阿里云实例元数据地址等内部服务不应经过外部代理，所以要放进 `NO_PROXY`。生产环境还应限制代理可访问的目标域名，并避免将 OpenClaw Gateway 直接暴露到公网。

## 十二、让配置长期生效

### macOS 与 Linux

如果使用 Zsh，可写入 `~/.zshrc`：

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
export http_proxy="$HTTP_PROXY"
export https_proxy="$HTTPS_PROXY"
export NO_PROXY=localhost,127.0.0.1
export no_proxy="$NO_PROXY"
export NODE_USE_ENV_PROXY=1
```

然后重新打开终端，或者执行：

```bash
source ~/.zshrc
```

如果只希望 Agent 使用代理，更推荐创建启动脚本或 shell alias，而不是污染所有终端命令：

```bash
alias pi-proxy='NODE_USE_ENV_PROXY=1 HTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 pi'
alias codex-proxy='HTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 codex'
alias claude-proxy='HTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 claude'
```

### Windows PowerShell

仅对当前 PowerShell 窗口生效：

```powershell
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
$env:NO_PROXY = "localhost,127.0.0.1"
$env:NODE_USE_ENV_PROXY = "1"

claude
# 或 pi、codex
```

写入当前用户的持久环境变量：

```powershell
[Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://127.0.0.1:7890", "User")
[Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://127.0.0.1:7890", "User")
[Environment]::SetEnvironmentVariable("NO_PROXY", "localhost,127.0.0.1", "User")
[Environment]::SetEnvironmentVariable("NODE_USE_ENV_PROXY", "1", "User")
```

修改后需要重新打开终端和编辑器。已经运行的 VS Code、JetBrains IDE 或 Agent 桌面程序通常不会自动获得新的环境变量。

## 十三、为什么“终端里能用，IDE 里不能用”

环境变量属于进程及其子进程。你在终端中执行 `export HTTPS_PROXY=...`，只会影响这个终端以及从它启动的程序。

如果 VS Code、IDE 或桌面 App 是从 Dock、开始菜单或应用启动器打开的，它通常不会继承当前终端的变量。可以先用最简单的方法验证：

```bash
code .
```

从已经配置代理的终端启动编辑器，再在编辑器中运行 Agent。如果这样可用，就说明问题是 GUI 进程没有继承环境变量，而不是代理地址本身错误。

## 十四、常见故障排查

### 1. `ECONNREFUSED 127.0.0.1:7890`

代理程序没有启动、端口填错，或者 Agent 运行在 Docker、远程主机、WSL 中。容器里的 `127.0.0.1` 指向容器自身，不是宿主机。

### 2. `ETIMEDOUT` 或一直重试

检查代理规则、公司防火墙和目标域名白名单。也要确认 Agent 所用的登录域名、API 域名和遥测域名是否都能访问。

### 3. `certificate verify failed`、`unable to get local issuer certificate`

通常是公司代理进行了 TLS 检查。正确做法是导入并指定公司根证书：

```bash
# Claude Code / Node.js 工具
export NODE_EXTRA_CA_CERTS=/path/to/company-ca.pem

# Codex
export CODEX_CA_CERTIFICATE=/path/to/company-ca.pem
```

不要关闭 TLS 校验。

### 4. Agent 能对话，但 `npm install` 或 `git clone` 失败

这通常是 Agent 主进程和工具子进程的网络策略不同。对 Codex，应检查沙箱的 `network_access` 和域名策略；对容器或远程开发环境，应在实际执行命令的环境中配置代理。

Git 和 npm 还可以单独检查：

```bash
git config --global --get http.proxy
npm config get proxy
npm config get https-proxy
```

### 5. 代理变量已经设置，但 Pi 仍然直连

检查：

```bash
node -v
echo "$NODE_USE_ENV_PROXY"
echo "$HTTPS_PROXY"
```

Pi 所使用的 Node.js 需要支持环境代理，并且启动时 `NODE_USE_ENV_PROXY=1` 已经存在。若使用旧版 Node，应先升级，而不是假设设置 `HTTPS_PROXY` 就一定有效。

## 十五、一份最实用的最小配置

如果是个人电脑、本地 HTTP 代理、macOS/Linux 终端，可以先从下面这组配置开始：

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
export http_proxy="$HTTP_PROXY"
export https_proxy="$HTTPS_PROXY"
export NO_PROXY=localhost,127.0.0.1
export no_proxy="$NO_PROXY"
export NODE_USE_ENV_PROXY=1
```

然后分别启动：

```bash
claude
pi
codex
```

如果只有 Codex 执行的命令不能联网，再增加：

```toml
# ~/.codex/config.toml
[sandbox_workspace_write]
network_access = true
```

最后记住一个判断原则：**代理解决“流量走哪里”，Base URL 决定“请求发给谁”，沙箱权限决定“命令能不能联网”。** 把这三层分开排查，大多数 Agent 网络问题都会变得很清楚。