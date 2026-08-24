---
head:
  - - meta
    - name: description
      content: Connect DeepSeek Harness to ZenMux with a standard API key or @zenmux/dsh-plugins OAuth PKCE
  - - meta
    - name: keywords
      content: ZenMux, DeepSeek Harness, DSH, API key, OAuth, PKCE, DeepSeek V4, agent
---

# DeepSeek Harness Integration

DeepSeek Harness (DSH) supports two ways to connect to ZenMux:

| Method | Plugin required | Best for |
| --- | --- | --- |
| Standard API key configuration | No | Users who already have a ZenMux API key and want to use DSH's built-in DeepSeek provider |
| OAuth PKCE | `@zenmux/dsh-plugins` | Users who prefer browser sign-in without copying or persistently storing an API key |

## Install DeepSeek Harness

Install the official `@deepseek-ai/dsh` package globally with npm:

```bash
npm i -g @deepseek-ai/dsh
```

Verify that the command is available:

```bash
dsh --version
```

If the terminal cannot find `dsh`, open a new terminal and confirm that npm's global executable directory is included in `PATH`.

## Configure a standard API key

The standard configuration reuses DSH's built-in `deepseek-official` provider and does not require the ZenMux PKCE plugin.

First, set your ZenMux API key:

```bash
export ZENMUX_API_KEY="sk-ai-v1-xxx"
```

Then edit `$DSH_HOME/settings.yaml`. If `DSH_HOME` is not set, the default path is `~/.dsh/settings.yaml`:

```yaml
llm-deepseek:
  apiKeyEnv: ZENMUX_API_KEY
  baseURL: https://zenmux.ai/api/v1
```

Start DSH and select the built-in **DeepSeek-V4-Flash** entry or another DeepSeek model supported by ZenMux:

```bash
dsh web
```

`apiKeyEnv` stores only the environment-variable name; the API key itself is not written to `settings.yaml`. DSH already provides a default model catalog, so the standard configuration does not need to repeat model entries. Add `models` only when using another model or a custom display name.

For a persistent setup, add `export ZENMUX_API_KEY="..."` to `~/.zshrc` or `~/.bashrc`, depending on the active shell, and then open a new terminal.

### Configure a proxy for DeepSeek Harness

DeepSeek Harness (`dsh`) runs on Node.js under the hood. Because the Node.js runtime does not read system `http_proxy` or `https_proxy` environment variables by default, you need to explicitly enable proxy support and inject environment variables before starting DSH:

::: code-group
```bash [Temporary (current shell)]
# Enable Node.js proxy support; replace 7890 with your actual proxy port
export NODE_USE_ENV_PROXY="1"
export HTTPS_PROXY="http://127.0.0.1:7890"
export HTTP_PROXY="http://127.0.0.1:7890"

dsh web
```

```bash [Single line command]
# Replace 7890 with your actual proxy port
NODE_USE_ENV_PROXY="1" HTTPS_PROXY="http://127.0.0.1:7890" dsh web
```

```bash [Persistent (~/.zshrc or ~/.bashrc)]
# Enable Node.js to read system proxy environment variables (replace 7890 with your actual proxy port)
export NODE_USE_ENV_PROXY="1"
export HTTPS_PROXY="http://127.0.0.1:7890"
export HTTP_PROXY="http://127.0.0.1:7890"
```
:::

::: tip Note: Proxy ports vary by client
The port `7890` in the examples is for illustration purposes. Different proxy clients use different default local listening ports (e.g., Clash defaults to `7890`, v2ray / Qv2ray typically uses `10809`, Surge defaults to `6152`, etc.). Replace `7890` with the actual port configured in your proxy software.
:::

::: tip How it works
The Node.js runtime (built-in `fetch` / `undici`) ignores system `http_proxy` variables by default. Setting `NODE_USE_ENV_PROXY="1"` (or passing `--use-env-proxy` in `NODE_OPTIONS`) explicitly enables Node.js environment proxy support, allowing it to honor `HTTP_PROXY`, `HTTPS_PROXY`, and `NO_PROXY`.
:::

::: tip Verified configuration
This minimal configuration was tested with DSH `0.1.0-rc.6` and its built-in `deepseek-v4-flash` model. The test used a separate temporary `$DSH_HOME`, did not modify the user's existing configuration, and did not install the PKCE plugin.
:::

## Use OAuth PKCE

The official `@zenmux/dsh-plugins` npm package uses OAuth 2.0 Authorization Code + PKCE for browser authorization, so no ZenMux API key needs to be created or copied. It also refreshes the sign-in session before the access token expires.

The current PKCE integration targets interactive DSH Web and provides:

- `/zenmux login`, `/zenmux status`, and `/zenmux logout` commands.
- Browser-based ZenMux OAuth PKCE authorization.
- Automatic access-token and refresh-token persistence and rotation.
- Bundled ZenMux DeepSeek V4 Pro and DeepSeek V4 Flash models.
- Anthropic Messages routing for prompt caching and thinking budgets.

### Install the plugin

Install the package into the DSH Web profile:

```bash
dsh plugin --profile web add @zenmux/dsh-plugins
```

Then start DSH Web:

```bash
dsh web
```

The package automatically mounts the ZenMux OAuth controller and adds a ZenMux provider to DSH's existing `pi-ai` adapter. It does not replace the built-in DeepSeek route or silently switch existing conversations to a different provider.

### Sign in to ZenMux

Run this command in DSH Web:

```text
/zenmux login
```

DSH Web opens the ZenMux authorization page in a new tab and also displays an **Open ZenMux login** fallback link. Confirm the account and requested access, wait for the callback page to display **ZenMux connected**, and then return to DSH.

The plugin requests only these scopes:

- `inference:invoke`: invoke ZenMux models.
- `offline_access`: refresh the session after the access token expires.

OAuth uses a one-time `127.0.0.1:<ephemeral-port>/callback`. The listener validates `state` and closes after one accepted response or a login timeout.

### Select a model

After sign-in, select one of these entries from the model selector:

- **ZenMux · DeepSeek V4 Pro**
- **ZenMux · DeepSeek V4 Flash**

These bundled models use the ZenMux Anthropic Messages endpoint so DSH/pi-ai can apply Anthropic prompt caching and thinking budgets.

::: info Models are not discovered automatically
Current DSH model discovery supports OpenAI-compatible `/models` routes but cannot discover models for an `anthropic-messages` provider. The plugin therefore includes two ready-to-use model entries instead of showing a model refresh action that cannot work.
:::

To use other ZenMux models, edit the ZenMux provider's `models` array under **Settings → Models**. Enter ZenMux model IDs and configure reasoning levels according to each model's capabilities. Never paste an OAuth token into the model configuration.

### Manage the sign-in state

Check the current connection and expiration time:

```text
/zenmux status
```

Sign out:

```text
/zenmux logout
```

On logout, the plugin attempts to revoke the refresh token at ZenMux and then clears the stored DSH OAuth credentials. You can also revoke the grant from ZenMux Authorized Apps.

### Proxy and network configuration

OAuth discovery, token, and revocation requests connect directly to ZenMux by default. If the DSH environment requires a proxy, note that the underlying Node.js runtime does not read system `http_proxy` variables by default. Enable proxy support and inject the environment variables before startup (replace `7890` with your actual proxy port):

```bash
# Replace 7890 with your actual proxy port
export NODE_USE_ENV_PROXY="1"
export HTTPS_PROXY="http://127.0.0.1:7890"
export HTTP_PROXY="http://127.0.0.1:7890"

dsh web
```

Alternatively, configure `proxyUrl` directly in the DSH profile (explicit `proxyUrl` in the DSH profile takes priority over environment variables). The plugin supports HTTP, HTTPS, `socks4a://`, and `socks5h://` proxies.

::: warning Browser and DSH networking are separate
The browser must reach the ZenMux authorization page and send the callback to the temporary loopback port on the DSH host. When DSH runs on a remote server or in a container, or when the browser is on another machine, the browser's `127.0.0.1` may not refer to the DSH host.
:::

If a corporate proxy reissues TLS certificates through a local CA, load that CA before Node.js starts:

```bash
NODE_EXTRA_CA_CERTS=/absolute/path/to/ca.pem dsh web
```

Do not use `NODE_TLS_REJECT_UNAUTHORIZED=0`. Disabling TLS verification can expose authorization codes and refresh tokens.

### Optional environment variables

Production normally requires no additional configuration. These variables are primarily for proxies, development, or self-hosted environments:

| Variable | Default | Purpose |
| --- | --- | --- |
| `ZENMUX_OAUTH_ORIGIN` | `https://zenmux.ai` | OAuth authorization-server origin |
| `ZENMUX_OAUTH_CLIENT_ID` | Bundled public client | Override the OAuth public client ID |
| `ZENMUX_OAUTH_SCOPES` | `inference:invoke offline_access` | Scopes requested during sign-in |
| `ZENMUX_API_BASE_URL` | `https://zenmux.ai/api/v1` | ZenMux API base URL |
| `ZENMUX_ANTHROPIC_BASE_URL` | Derived from the API base URL | Override the Anthropic Messages endpoint |
| `ZENMUX_OAUTH_NO_BROWSER` | Unset | Set to `1` to suppress automatic browser opening |
| `HTTPS_PROXY` / `https_proxy` | Unset | Network proxy for OAuth requests |

### Support scope and limitations

- The current package targets interactive DSH Web deployments that can execute `/zenmux` commands.
- Pure headless and automated deployments that do not consume `ctx.commands` cannot initiate browser sign-in.
- A headless deployment can reuse credentials created by interactive DSH Web under the same Harness home.
- The plugin does not add OAuth state, tokens, or expiration data to model input or conversation history.
- If a configured proxy is unavailable, sign-in and refresh fail instead of silently using another network path.

For the full list of agents that support OAuth PKCE, see [Sign in to ZenMux with OAuth PKCE](/best-practices/oauth-pkce).
