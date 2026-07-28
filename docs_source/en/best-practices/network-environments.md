---
head:
  - - meta
    - name: description
      content: Agent Tool Proxy Configuration Guide — how to configure proxies for Claude Code, Pi, Codex, Gemini CLI, OpenCode, Cline, Cursor, Cherry Studio, Open WebUI, Dify, OpenClaw, and other tools
  - - meta
    - name: keywords
      content: Zenmux, proxy, network, Claude Code, Pi, Codex, Gemini CLI, OpenCode, Cline, Cursor, environment variables, HTTP_PROXY, HTTPS_PROXY
---

# Agent Tool Proxy Configuration Guide

When using Agent tools such as Claude Code, Pi, and Codex, the most common network problem is not that "the proxy is completely off," but rather that the proxy only works for the browser while terminal processes do not inherit it; or that the Agent itself can reach the model, but the `git`, `npm`, `curl` commands it executes still cannot connect to the network.

## Why Agent Tools Need Proxy Configuration

Configuring a proxy is not just about making some website "loadable." In a real development environment, there are typically several categories of reasons:

- **The corporate intranet does not allow devices to access the external network directly.** All internet traffic must go through the company-provided HTTP/HTTPS proxy, where a unified egress performs authentication, domain control, and security auditing.
- **The company needs centralized control over external AI services.** Developers cannot connect to model vendors directly; traffic must go through a security gateway that logs access, restricts target domains, or enforces data loss prevention policies.
- **The corporate network deploys a firewall or TLS inspection.** Even if the target API is reachable, TLS handshake failures or untrusted certificate errors may occur because the company proxy re-signs HTTPS certificates.
- **Local network access to model services is unstable.** DNS resolution, cross-border links, carrier routing, or regional network restrictions may cause connection timeouts, interrupted streaming responses, and frequent retries.
- **The Agent runs in a container, remote server, WSL, or sandbox.** The host browser being able to connect does not mean the Agent's runtime environment has the same network egress.
- **Tools executed by the Agent need external network access.** The Agent itself can converse, but the `git clone`, `npm install`, `pip install`, `curl`, MCP Server, or web scraping tools it invokes may still be unable to connect.

Therefore, a complete proxy configuration must at least answer three questions:

```text
Can the Agent main program connect to the model service?
Can the commands and subprocesses launched by the Agent connect to the external network?
Can add-on services such as login, OAuth, plugin marketplace, and web search be reached?
```

This article covers Claude Code, Pi, Codex, Gemini CLI, OpenCode, Cline, Cursor, GitHub Copilot, Cherry Studio, Open WebUI, Dify, OpenClaw, and other common desktop clients and editor plugins. Different tools implement networking differently, so you cannot mechanically apply the same configuration to all of them.

> This article discusses legal and compliant HTTP/HTTPS outbound proxies, such as corporate network proxies, local debugging proxies, or authorized network egresses. Please comply with local laws, corporate security policies, and service provider terms.

## 1. First, Distinguish Three Easily Confused Concepts

### 1. Network Proxy

The network request is still sent to the original service address; only the traffic is forwarded through a proxy server. The common environment variables are:

```bash
HTTP_PROXY=http://127.0.0.1:7890
HTTPS_PROXY=http://127.0.0.1:7890
NO_PROXY=localhost,127.0.0.1
```

This is the focus of this article.

### 2. API Base URL

A Base URL changes the request destination to another API gateway. For example, sending Anthropic requests to the company's LLM Gateway, or sending OpenAI requests to a compatible gateway.

It is not a network proxy in the traditional sense, nor can it replace a proxy server. Only configure it when the gateway is explicitly compatible with the target API.

### 3. Agent Sandbox Network Permissions

The fact that the Agent can connect to the model does not mean the commands it launches can also access the network. For instance, Codex can converse normally, but running `npm install` inside the sandbox may still fail because command network permission is disabled.

When troubleshooting, verify each separately:

```text
Can the Agent connect to the model service?
Can the Agent's curl, git, and npm connect to the network?
Can browser login or OAuth callbacks complete?
```

## 2. Prepare a Unified Proxy Configuration

The following examples assume the local HTTP proxy listens on `127.0.0.1:7890`. Replace it with your own address and port.

Many proxy tools provide both HTTP and SOCKS5 ports. Here you should fill in the **HTTP proxy port**:

### 1. macOS, Linux: Write Environment Variables Temporarily

Run in a terminal:

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
export http_proxy="$HTTP_PROXY"
export https_proxy="$HTTPS_PROXY"
export NO_PROXY=localhost,127.0.0.1
export no_proxy="$NO_PROXY"
```

These variables only apply to the **current terminal window and the programs launched from this window**. They disappear once the terminal is closed.

You can launch the Agent in the same terminal:

```bash
claude
# or
pi
codex
gemini
opencode
```

### 2. macOS, Linux: Write Environment Variables Permanently

First confirm which shell you are using:

```bash
echo "$SHELL"
```

If the output contains `zsh`, edit `~/.zshrc`:

```bash
nano ~/.zshrc
```

Add the following to the end of the file:

```bash
# AI Agent network proxy
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
export http_proxy="$HTTP_PROXY"
export https_proxy="$HTTPS_PROXY"
export NO_PROXY=localhost,127.0.0.1
export no_proxy="$NO_PROXY"

# Used by newer Node.js Agents such as Pi
export NODE_USE_ENV_PROXY=1
```

After saving, run:

```bash
source ~/.zshrc
```

If you use Bash, write to `~/.bashrc`:

```bash
nano ~/.bashrc
```

Add the same content, then run:

```bash
source ~/.bashrc
```

Some macOS or Linux login shells use `~/.zprofile`, `~/.bash_profile`, or `~/.profile`. If the variables do not appear automatically in a new terminal, check which config file the terminal actually loads.

### 3. Windows PowerShell: Write Environment Variables Temporarily

Run in PowerShell:

```powershell
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
$env:http_proxy = $env:HTTP_PROXY
$env:https_proxy = $env:HTTPS_PROXY
$env:NO_PROXY = "localhost,127.0.0.1"
$env:no_proxy = $env:NO_PROXY
$env:NODE_USE_ENV_PROXY = "1"
```

These variables only apply to the current PowerShell window and its child processes. Then launch the tool directly:

```powershell
claude
# or pi, codex, gemini, opencode
```

### 4. Windows: Write User Environment Variables Permanently

Run in PowerShell:

```powershell
[Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://127.0.0.1:7890", "User")
[Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://127.0.0.1:7890", "User")
[Environment]::SetEnvironmentVariable("http_proxy", "http://127.0.0.1:7890", "User")
[Environment]::SetEnvironmentVariable("https_proxy", "http://127.0.0.1:7890", "User")
[Environment]::SetEnvironmentVariable("NO_PROXY", "localhost,127.0.0.1", "User")
[Environment]::SetEnvironmentVariable("no_proxy", "localhost,127.0.0.1", "User")
[Environment]::SetEnvironmentVariable("NODE_USE_ENV_PROXY", "1", "User")
```

You can also configure it through the graphical interface:

1. Search for "environment variables" in the Start menu.
2. Open "Edit environment variables for your account."
3. In the "User variables" section, create `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY`, and `NODE_USE_ENV_PROXY` one by one.
4. After saving, fully exit and reopen PowerShell, VS Code, Cursor, and other Agent applications.

Do not modify system variables just for convenience; using the current user's environment variables is generally sufficient.

### 5. Windows CMD

For the current CMD window (temporary):

```bat
set HTTP_PROXY=http://127.0.0.1:7890
set HTTPS_PROXY=http://127.0.0.1:7890
set NO_PROXY=localhost,127.0.0.1
set NODE_USE_ENV_PROXY=1
```

To write to the current user permanently:

```bat
setx HTTP_PROXY "http://127.0.0.1:7890"
setx HTTPS_PROXY "http://127.0.0.1:7890"
setx NO_PROXY "localhost,127.0.0.1"
setx NODE_USE_ENV_PROXY "1"
```

`setx` does not modify the currently open CMD window; you need to reopen the terminal after running it.

### 6. Check Whether Environment Variables Take Effect

macOS, Linux:

```bash
env | grep -i proxy
```

Windows PowerShell:

```powershell
Get-ChildItem Env: | Where-Object Name -Match "proxy"
```

Windows CMD:

```bat
set | findstr /I proxy
```

Then test the proxy:

```bash
curl -I --proxy http://127.0.0.1:7890 https://api.openai.com
```

Finally, launch the Agent from the same terminal. Verifying `curl` alone is not enough: if the Agent was launched from the Dock, Start menu, or a desktop icon, it may not have inherited the variables you wrote to the terminal.

Note: Even if the target site is HTTPS, the value of `HTTPS_PROXY` often starts with `http://`. This means the client first connects to the proxy via HTTP `CONNECT`, then establishes a TLS channel to the target site — it does not mean the final access is in plaintext.

First verify the proxy itself with `curl`:

```bash
curl -I --proxy http://127.0.0.1:7890 https://api.anthropic.com
curl -I --proxy http://127.0.0.1:7890 https://api.openai.com
```

Receiving HTTP responses such as `401`, `403`, or `404` is not necessarily a bad sign: it at least indicates that DNS, proxy connection, and the TLS channel have been established. A real network failure typically shows up as timeouts, connection refused, proxy handshake failures, or certificate errors.

## 3. Claude Code Proxy Configuration

Claude Code officially supports configuring an HTTP/HTTPS proxy via `HTTP_PROXY` and `HTTPS_PROXY`:

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890

claude
```

You can also let only a single run use the proxy:

```bash
HTTP_PROXY=http://127.0.0.1:7890 \
HTTPS_PROXY=http://127.0.0.1:7890 \
claude
```

If the proxy requires a username and password:

```bash
export HTTPS_PROXY=http://username:password@proxy.example.com:8080
```

When the username or password contains special characters such as `@`, `:`, `/`, `#`, etc., URL-encode them first. Do not commit real passwords to a Git repository or write them into shared scripts.

Claude Code has two limitations worth noting:

- The official documentation states it currently does not support `NO_PROXY`; once a proxy is configured, its traffic always goes through the proxy.
- The official documentation states it does not support using a SOCKS proxy directly, so you cannot use `socks5://127.0.0.1:7891` as the value of the variables above. You should enable the HTTP proxy port in your proxy software, or add a local HTTP-to-SOCKS conversion layer.

If the corporate proxy decrypts and re-signs HTTPS traffic, you also need to make Claude Code trust the company's root certificate:

```bash
export SSL_CERT_FILE=/path/to/company-ca-bundle.pem
export NODE_EXTRA_CA_CERTS=/path/to/company-ca-bundle.pem

claude
```

Do not "fix" certificate issues this way:

```bash
export NODE_TLS_REJECT_UNAUTHORIZED=0
```

It disables TLS certificate verification, making the connection vulnerable to man-in-the-middle attacks.

Claude Code's official documentation can be found at: [Corporate proxy configuration](https://docs.anthropic.com/en/docs/claude-code/corporate-proxy).

## 4. Pi Coding Agent Proxy Configuration

Here, Pi refers to `@mariozechner/pi-coding-agent`. Pi is a Node.js program, but Pi's official documentation does not currently provide a standalone, stable set of proxy configuration options. Therefore, you cannot simply assume that any Node.js version will automatically read `HTTP_PROXY`.

On Node.js 22.21.0 and above, or Node.js 24.5.0 and above, you can explicitly enable Node's environment proxy support:

```bash
export NODE_USE_ENV_PROXY=1
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
export NO_PROXY=localhost,127.0.0.1

pi
```

Run once:

```bash
NODE_USE_ENV_PROXY=1 \
HTTP_PROXY=http://127.0.0.1:7890 \
HTTPS_PROXY=http://127.0.0.1:7890 \
NO_PROXY=localhost,127.0.0.1 \
pi
```

First check the Node.js version:

```bash
node -v
```

Newer Node.js will read `HTTP_PROXY`, `HTTPS_PROXY`, and `NO_PROXY` at startup. See the [Node.js `--use-env-proxy` documentation](https://nodejs.org/api/cli.html#--use-env-proxy) for the relevant capability and version requirements.

It should be clarified: this is a proxy capability provided by Node.js, not a unified guarantee that Pi makes for all model providers. Pi supports multiple providers, and some individual provider SDKs may create their own network clients or custom agents, thereby bypassing Node's global proxy configuration. If you encounter "Pi can log in but model requests fail" or "one provider works, another doesn't," test each provider separately.

It is recommended to first run:

```bash
NODE_USE_ENV_PROXY=1 \
HTTPS_PROXY=http://127.0.0.1:7890 \
node -e "fetch('https://api.openai.com').then(r => console.log(r.status)).catch(console.error)"
```

If the test succeeds but Pi still fails, the problem is more likely in the specific provider, authentication method, or API address, rather than the basic proxy.

For corporate TLS proxy scenarios, you can additionally add:

```bash
export NODE_EXTRA_CA_CERTS=/path/to/company-ca-bundle.pem
```

## 5. Codex Proxy Configuration

Codex needs to be handled as two separate network links.

### 1. Codex Connecting to OpenAI Itself

Launch Codex from a terminal that already has proxy variables configured:

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
export NO_PROXY=localhost,127.0.0.1

codex
```

Or apply only to the current process:

```bash
HTTP_PROXY=http://127.0.0.1:7890 \
HTTPS_PROXY=http://127.0.0.1:7890 \
NO_PROXY=localhost,127.0.0.1 \
codex
```

If you use a corporate TLS proxy or a private root certificate, Codex officially provides a dedicated variable:

```bash
export CODEX_CA_CERTIFICATE=/path/to/company-root-ca.pem
codex login
```

When `CODEX_CA_CERTIFICATE` is not set, Codex also falls back to reading `SSL_CERT_FILE`. This certificate configuration is used for login, ordinary HTTPS requests, and secure WebSocket connections.

### 2. Commands Executed by Codex Accessing the Network

This is the most easily overlooked layer. When the Codex CLI, IDE extension, or desktop client runs in the `workspace-write` sandbox, command network access may be disabled by default. You can enable it in the user-level `~/.codex/config.toml`:

```toml
[sandbox_workspace_write]
network_access = true
```

You can also write it as a one-time launch:

```bash
codex -c 'sandbox_workspace_write.network_access=true'
```

Codex also provides a `network_proxy` feature used to constrain which domains sandbox commands may access. It is a security policy, not a replacement for the local proxy address:

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

There are three key points here:

- `network_access = true` determines whether sandbox commands can access the network.
- `features.network_proxy` determines which targets are allowed after network access is enabled.
- `allow_upstream_proxy = true` allows the sandbox network to continue using the upstream proxy from the process environment; it is not a proxy server address.

In other words, merely enabling `features.network_proxy` does not automatically grant network permission; merely setting `HTTPS_PROXY` cannot bypass Codex's sandbox policy either.

If the local proxy listens on `127.0.0.1`, the sandbox's local-target restrictions may also affect access. Do not open all intranet addresses right away; prioritize leaving the proxy variables to Codex's upstream proxy mechanism and keep `allow_upstream_proxy = true`. Only when you truly need the Agent to access local services directly should you configure the minimal-scope exceptions for `localhost` or exact IPs.

Codex's network and sandbox documentation can be found at: [Codex Security](https://developers.openai.com/codex/security) and [Codex configuration reference](https://developers.openai.com/codex/config-reference).

### 3. Do Not Treat `openai_base_url` as a Network Proxy

Codex also supports setting in the user-level `~/.codex/config.toml`:

```toml
openai_base_url = "https://gateway.example.com/v1"
```

This changes the API destination address of the OpenAI provider to the specified gateway, suitable for LLM gateways, routing services, or data-residency entry points compatible with the OpenAI API. It is not a general HTTP proxy, and it will not make `git`, `npm`, `curl` automatically go through the proxy.

## 6. Gemini CLI Proxy Configuration

Gemini CLI can use standard proxy environment variables:

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
export NO_PROXY=localhost,127.0.0.1

gemini
```

Gemini CLI also provides a `general.proxy` configuration. The user configuration is usually located at `~/.gemini/settings.json`:

```json
{
  "general": {
    "proxy": "http://127.0.0.1:7890"
  }
}
```

For Gemini CLI's remote Agent/A2A requests, the official documentation explicitly states that it reads `general.proxy` and also supports `HTTP_PROXY` and `HTTPS_PROXY`. Reference: [Gemini CLI Remote Subagents - Proxy support](https://geminicli.com/docs/core/remote-agents/#proxy-support).

If the Gemini CLI sandbox is enabled, you must also distinguish between main-process traffic and in-sandbox command traffic. The official `GEMINI_SANDBOX_PROXY_COMMAND` launches a controlled sandbox proxy; it suits enterprises that want to restrict the sandbox egress by domain, and is not an option that ordinary users must configure. Reference: [Gemini CLI example proxy script](https://geminicli.com/docs/examples/proxy-script/).

Do not mistake the following variables for an ordinary network proxy:

```bash
GOOGLE_GEMINI_BASE_URL=https://gateway.example.com
GOOGLE_VERTEX_BASE_URL=https://gateway.example.com
```

They change the destination address of the Gemini API or Vertex AI, and only apply to compatible gateways for the corresponding protocol.

## 7. OpenCode Proxy Configuration

OpenCode can be configured primarily through startup environment variables:

```bash
HTTP_PROXY=http://127.0.0.1:7890 \
HTTPS_PROXY=http://127.0.0.1:7890 \
NO_PROXY=localhost,127.0.0.1 \
opencode
```

If the currently installed version or a particular provider does not automatically read the proxy, launch OpenCode from a terminal that already has the environment variables set, ensuring the GUI, TUI, and provider subprocesses inherit the same environment.

OpenCode supports multiple model providers. A provider's Base URL configuration only changes the destination address of the corresponding model request; it cannot replace the network proxy, nor does it automatically proxy the Git, MCP, web tools, and shell commands invoked by OpenCode.

When troubleshooting, it is recommended to test separately:

```bash
curl -I https://api.openai.com
curl -I https://api.anthropic.com
opencode
```

If `curl` can access through the proxy but only a specific OpenCode provider reports an error, continue checking that provider's authentication, Base URL, and SDK proxy compatibility.

## 8. Cline Proxy Configuration

Cline needs to be configured separately depending on its form.

### VS Code Extension

The Cline VS Code extension uses VS Code's own proxy settings. Configure in VS Code's `settings.json`:

```json
{
  "http.proxy": "http://127.0.0.1:7890",
  "http.proxySupport": "override",
  "http.proxyStrictSSL": true
}
```

After configuration, fully exit and restart VS Code.

### Cline CLI

```bash
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
export no_proxy=localhost,127.0.0.1,.local

cline start
```

If the corporate proxy uses a custom CA:

```bash
export NODE_EXTRA_CA_CERTS=/path/to/company-ca.pem
cline start
```

Cline official notes: the CLI supports HTTP proxies but not SOCKS, PAC scripts, or complex proxy authentication beyond Basic username/password. The JetBrains plugin should be configured under `Settings > Appearance & Behavior > System Settings > HTTP Proxy`. Reference: [Cline Networking and Proxies](https://docs.cline.bot/troubleshooting/networking-and-proxies).

## 9. Cursor, GitHub Copilot, and Other Editor Plugins

### Cursor

Cursor is based on VS Code and usually prefers the in-app network settings:

1. Open Settings.
2. Search for `proxy`.
3. Fill in `Http: Proxy` with `http://127.0.0.1:7890`.
4. Keep `Http: Proxy Strict SSL` enabled.
5. Fully restart Cursor.

You can also edit the user `settings.json`:

```json
{
  "http.proxy": "http://127.0.0.1:7890",
  "http.proxySupport": "override",
  "http.proxyStrictSSL": true
}
```

If the in-app configuration does not cover a particular extension or terminal Agent, launch Cursor from a terminal that has the proxy variables set:

```bash
HTTP_PROXY=http://127.0.0.1:7890 \
HTTPS_PROXY=http://127.0.0.1:7890 \
cursor .
```

Cursor's built-in Agent, extension host, and integrated terminal may be different processes. When some features work and others don't, check Cursor's main program, extensions, and terminal environment separately.

### GitHub Copilot

GitHub Copilot for VS Code can use VS Code's `http.proxy`; the JetBrains version reads the IDE's HTTP Proxy; the Visual Studio version reads the Windows proxy settings.

VS Code example:

```json
{
  "http.proxy": "http://127.0.0.1:7890",
  "http.proxyStrictSSL": true
}
```

If not configured separately in the editor, Copilot also checks in order:

```text
HTTPS_PROXY
https_proxy
HTTP_PROXY
http_proxy
```

GitHub officially does not currently support proxy URLs starting with `https://`, so you should generally fill in:

```bash
HTTPS_PROXY=http://proxy.company.com:8080
```

rather than:

```bash
HTTPS_PROXY=https://proxy.company.com:8080
```

Copilot can read enterprise certificates from the OS trust store and can also read `NODE_EXTRA_CA_CERTS`. Reference: [GitHub Copilot network settings](https://docs.github.com/zh/copilot/how-tos/configure-personal-settings/configure-network-settings?tool=vscode).

### Obsidian, Sider, and Common VS Code Plugins

Obsidian plugins, the Sider browser extension, and most Agent plugins running in editors or browsers usually do not have an independent, general proxy protocol implementation:

- Browser extensions generally inherit the browser or OS proxy.
- VS Code extensions first check VS Code's `http.proxy`.
- Electron desktop apps usually prefer to inherit the system proxy, and some versions also inherit the launching process's environment variables.

Therefore, configure the host application first, then restart the plugin:

```json
{
  "http.proxy": "http://127.0.0.1:7890",
  "http.proxyStrictSSL": true
}
```

If the plugin itself provides a Provider Base URL, that configuration only handles the model API address and is not equivalent to a network proxy.

## 10. Cherry Studio and Other Desktop Clients

### Cherry Studio

Cherry Studio has a built-in proxy mode; you can fill in the local proxy in the app's general or network settings:

```text
http://127.0.0.1:7890
```

Fill in the HTTP listening port shown by your proxy software. Cherry Studio documentation notes that it primarily uses `http://` proxy addresses; do not fill in `socks5://` directly. Reference: [Cherry Studio General Settings](https://docs.cherry-ai.com/pre-basic/settings/general).

If a model provider allows you to fill in an API Host or Base URL separately, treat it as a model gateway setting. The proxy mode handles the network egress, while the API Host determines the request target — their purposes are different.

### Neovate, CC-Switch, RikkaHub, Hermes Agent

These tools vary greatly across versions and platforms, so you cannot invent a dedicated configuration key that works for all versions. Handle them by the following priority:

1. First check whether the app settings have `Proxy`, `Network`, `HTTP Proxy`, or "follow system proxy".
2. For desktop clients, prefer enabling the system proxy and restarting the app.
3. For CLI or Node.js Agents, launch from a terminal that already has `HTTP_PROXY` and `HTTPS_PROXY` set.
4. Android clients usually inherit the current Wi-Fi, VPN, or system-level network channel; ordinary app environment variables have no effect on them.
5. If the tool only provides a Base URL, it can only connect to a compatible model gateway and cannot be treated as a general network proxy.

CC-Switch is mainly used to manage providers and configurations for tools such as Claude Code and Codex. Even if it can modify the API address, the Claude Code or Codex process itself still needs to configure the network proxy according to the corresponding sections of this article.

## 11. Open WebUI, Dify, and OpenClaw

Such tools typically run in Docker, on a server, or as long-lived services. Proxy variables must be configured in the **container or systemd process that actually runs the service**; merely running `export` in your current SSH terminal often will not affect already-started services.

### Open WebUI

Open WebUI officially supports `http_proxy`, `https_proxy`, and `no_proxy`. Docker Compose example:

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      http_proxy: http://host.docker.internal:7890
      https_proxy: http://host.docker.internal:7890
      no_proxy: localhost,127.0.0.1,ollama
```

In Linux Docker, `host.docker.internal` may need explicit mapping:

```yaml
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

Open WebUI documentation states that capabilities such as web content scraping and HTTP/HTTPS retrieval use these variables. Reference: [Open WebUI Environment Variable Configuration](https://docs.openwebui.com/reference/env-configuration/#proxy-settings).

Note: The Nginx/Caddy "reverse proxy" that the user's browser uses to access Open WebUI is not the same as Open WebUI's "outbound proxy" for accessing model APIs.

### Dify

Dify is usually composed of multiple Docker services. To let the services access external models, the plugin marketplace, or external APIs, you must add the proxy variables to the services that actually initiate requests, not just the host:

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

It may also involve `plugin_daemon`, `sandbox`, or other services; you should confirm who is initiating the request based on the failure logs. `NO_PROXY` must retain the internal Docker service names, otherwise internal traffic such as the database, Redis, and vector store may also be wrongly sent to the proxy.

The Nginx in front of Dify handles user access and is an inbound reverse proxy; here, `HTTP_PROXY`/`HTTPS_PROXY` handle Dify's access to external services and are outbound proxies. Do not confuse the two.

### OpenClaw

The newer OpenClaw provides explicit, ops-oriented proxy configuration, which can be set via command line, configuration, or environment variables. Environment variable example:

```bash
export OPENCLAW_PROXY_URL=http://127.0.0.1:7890
openclaw proxy validate
```

You can also validate a specified proxy directly:

```bash
openclaw proxy validate \
  --proxy-url http://127.0.0.1:7890 \
  --allowed-url https://api.openai.com \
  --allowed-url https://api.anthropic.com
```

If it is a corporate HTTPS proxy endpoint, you can also provide a CA file:

```bash
openclaw proxy validate \
  --proxy-url https://proxy.company.com:8443 \
  --proxy-ca-file /path/to/company-ca.pem
```

OpenClaw's priority order is: the command-line `--proxy-url`, the `proxy.proxyUrl` in configuration, and the `OPENCLAW_PROXY_URL` environment variable. Reference: [OpenClaw Proxy CLI](https://docs.openclaw.ai/cli/proxy).

If OpenClaw runs as a systemd, Docker, or background Gateway, you must write the variables into that service's environment configuration and then restart the service. Setting variables only in the login shell will not change the already-running Gateway.

### OpenClaw Deployed on Alibaba Cloud or Other Cloud Servers

OpenClaw on a cloud server cannot use your personal computer's `127.0.0.1:7890`, because the server's `127.0.0.1` points to the server itself. You need to use a reachable corporate-provided proxy, a proxy deployed on the same intranet, or run a compliant proxy service on the server itself.

systemd can use a separate environment file, for example:

```ini
# /etc/openclaw/proxy.env
OPENCLAW_PROXY_URL=http://proxy.company.internal:8080
HTTP_PROXY=http://proxy.company.internal:8080
HTTPS_PROXY=http://proxy.company.internal:8080
NO_PROXY=localhost,127.0.0.1,metadata.aliyun.com,100.100.100.200
```

Reference it in the OpenClaw service:

```ini
[Service]
EnvironmentFile=/etc/openclaw/proxy.env
```

Then reload and restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart openclaw
sudo systemctl status openclaw
```

Internal services such as the Alibaba Cloud instance metadata address should not go through an external proxy, so put them in `NO_PROXY`. In production, you should also restrict the target domains the proxy can access, and avoid exposing the OpenClaw Gateway directly to the public internet.

## 12. Making the Configuration Persistent

### macOS and Linux

If you use Zsh, write to `~/.zshrc`:

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
export http_proxy="$HTTP_PROXY"
export https_proxy="$HTTPS_PROXY"
export NO_PROXY=localhost,127.0.0.1
export no_proxy="$NO_PROXY"
export NODE_USE_ENV_PROXY=1
```

Then reopen the terminal, or run:

```bash
source ~/.zshrc
```

If you only want the Agent to use the proxy, it is more recommended to create a launch script or shell alias rather than polluting all terminal commands:

```bash
alias pi-proxy='NODE_USE_ENV_PROXY=1 HTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 pi'
alias codex-proxy='HTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 codex'
alias claude-proxy='HTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 claude'
```

### Windows PowerShell

Applies only to the current PowerShell window:

```powershell
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
$env:NO_PROXY = "localhost,127.0.0.1"
$env:NODE_USE_ENV_PROXY = "1"

claude
# or pi, codex
```

Write to the current user's persistent environment variables:

```powershell
[Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://127.0.0.1:7890", "User")
[Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://127.0.0.1:7890", "User")
[Environment]::SetEnvironmentVariable("NO_PROXY", "localhost,127.0.0.1", "User")
[Environment]::SetEnvironmentVariable("NODE_USE_ENV_PROXY", "1", "User")
```

After modification, you need to reopen the terminal and editor. Already-running VS Code, JetBrains IDE, or Agent desktop programs usually will not automatically pick up the new environment variables.

## 13. Why "Works in the Terminal but Not in the IDE"

Environment variables belong to a process and its child processes. When you run `export HTTPS_PROXY=...` in a terminal, it only affects that terminal and the programs launched from it.

If VS Code, the IDE, or a desktop app was opened from the Dock, Start menu, or app launcher, it usually does not inherit the current terminal's variables. You can verify with the simplest method first:

```bash
code .
```

Launch the editor from a terminal that already has the proxy configured, then run the Agent inside the editor. If this works, it means the problem is that the GUI process did not inherit the environment variables, not that the proxy address itself is wrong.

## 14. Common Troubleshooting

### 1. `ECONNREFUSED 127.0.0.1:7890`

The proxy program is not started, the port is wrong, or the Agent runs in Docker, on a remote host, or in WSL. Inside a container, `127.0.0.1` points to the container itself, not the host.

### 2. `ETIMEDOUT` or Constant Retries

Check the proxy rules, the corporate firewall, and the target domain whitelist. Also confirm that the login domain, API domain, and telemetry domain used by the Agent are all reachable.

### 3. `certificate verify failed`, `unable to get local issuer certificate`

This is usually caused by the corporate proxy performing TLS inspection. The correct approach is to import and specify the company root certificate:

```bash
# Claude Code / Node.js tools
export NODE_EXTRA_CA_CERTS=/path/to/company-ca.pem

# Codex
export CODEX_CA_CERTIFICATE=/path/to/company-ca.pem
```

Do not disable TLS verification.

### 4. Agent Can Converse, but `npm install` or `git clone` Fails

This usually indicates different network policies between the Agent main process and the tool subprocesses. For Codex, check the sandbox's `network_access` and domain policy; for container or remote development environments, configure the proxy in the environment where commands actually execute.

Git and npm can also be checked individually:

```bash
git config --global --get http.proxy
npm config get proxy
npm config get https-proxy
```

### 5. Proxy Variables Are Set, but Pi Still Connects Directly

Check:

```bash
node -v
echo "$NODE_USE_ENV_PROXY"
echo "$HTTPS_PROXY"
```

The Node.js used by Pi must support environment proxies, and `NODE_USE_ENV_PROXY=1` must already be present at startup. If you are on an older Node version, upgrade first rather than assuming that setting `HTTPS_PROXY` is definitely effective.

## 15. A Most Practical Minimal Configuration

If this is a personal computer, a local HTTP proxy, and a macOS/Linux terminal, you can start with this set of configurations:

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
export http_proxy="$HTTP_PROXY"
export https_proxy="$HTTPS_PROXY"
export NO_PROXY=localhost,127.0.0.1
export no_proxy="$NO_PROXY"
export NODE_USE_ENV_PROXY=1
```

Then launch separately:

```bash
claude
pi
codex
```

If only the commands executed by Codex cannot connect, add:

```toml
# ~/.codex/config.toml
[sandbox_workspace_write]
network_access = true
```

Finally, remember a guiding principle: **A proxy decides "where the traffic goes," a Base URL decides "who the request is sent to," and sandbox permission decides "whether the command can connect."** Troubleshoot these three layers separately, and most Agent network problems will become clear.