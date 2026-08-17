---
head:
  - - meta
    - name: description
      content: Connect Pi Coding Agent to ZenMux with a standard API key or the @zenmux/pi-zenmux-oauth OAuth PKCE extension
  - - meta
    - name: keywords
      content: ZenMux, Pi Coding Agent, API key, OAuth, PKCE, coding agent, models.json
---

# Pi Coding Agent Integration

Pi Coding Agent supports two ways to connect to ZenMux:

| Method | Extension required | Best for |
| --- | --- | --- |
| Standard API key configuration | No | Users who already have a ZenMux API key and want to configure specific models manually |
| OAuth PKCE | `@zenmux/pi-zenmux-oauth` | Users who prefer browser sign-in, automatic token refresh, and dynamic model discovery |

## Install Pi Coding Agent

Pi now uses the official `@earendil-works/pi-coding-agent` package and requires Node.js 22.19.0 or later:

```bash
npm install -g @earendil-works/pi-coding-agent
```

Verify the installation:

```bash
pi --version
```

::: warning Migrating from the old package
The former `@mariozechner/pi-coding-agent` package is deprecated. If it is still installed, uninstall it before installing the current package:

```bash
npm uninstall -g @mariozechner/pi-coding-agent
npm install -g @earendil-works/pi-coding-agent
```
:::

## Configure a standard API key

This method uses Pi's native custom-provider support and does not install the ZenMux OAuth extension.

First, set your ZenMux API key:

```bash
export ZENMUX_API_KEY="sk-ai-v1-xxx"
```

Then add a `zenmux` provider to `~/.pi/agent/models.json`:

```json
{
  "providers": {
    "zenmux": {
      "baseUrl": "https://zenmux.ai/api/v1",
      "api": "openai-completions",
      "apiKey": "$ZENMUX_API_KEY",
      "models": [
        {
          "id": "deepseek-v4-flash",
          "name": "DeepSeek V4 Flash"
        }
      ]
    }
  }
}
```

If `models.json` already contains other providers, merge the `zenmux` entry into the existing `providers` object instead of replacing the file. Add more entries to `models` when you want to use other ZenMux model IDs.

Start Pi, run `/model`, and select `zenmux/deepseek-v4-flash`. You can also select it at startup:

```bash
pi --provider zenmux --model deepseek-v4-flash
```

`apiKey` contains an environment-variable reference, not the API key itself. For persistent use, add the export command to the startup file for your active shell, such as `~/.zshrc` or `~/.bashrc`, and then open a new terminal.

::: tip Why models must be listed here
Pi's standard custom-provider configuration does not automatically import the ZenMux model catalog. Each model used through this method must be present in `models.json`. Use the OAuth method below if you want Pi to discover the current catalog automatically.
:::

## Use OAuth PKCE

The official `@zenmux/pi-zenmux-oauth` extension opens ZenMux in your browser for authorization. It does not require a ZenMux API key and refreshes OAuth tokens automatically.

Install the extension with Pi:

```bash
pi install npm:@zenmux/pi-zenmux-oauth
```

Start Pi and sign in:

```text
/login zenmux
```

Approve the request in the browser. After the callback page confirms the connection, return to Pi, run `/model`, and select a ZenMux model.

The extension:

- Discovers the current ZenMux model catalog and caches the last valid catalog at `~/.pi/agent/models-store.json`.
- Selects Anthropic Messages, OpenAI Responses, or Chat Completions for each model according to the protocols advertised by ZenMux.
- Stores access and refresh tokens in Pi's provider credential store and saves rotated refresh tokens.
- Requests only `inference:invoke` and `offline_access` scopes.

To sign out, run `/logout` in Pi and select ZenMux. You can also revoke the authorization from ZenMux Authorized Apps.

For details about the authorization flow and credential security, see [OAuth PKCE Integration Guide](/best-practices/oauth-pkce).

## Choose between the two methods

| Capability | Standard API key | OAuth PKCE |
| --- | --- | --- |
| Authentication | `ZENMUX_API_KEY` | Browser authorization |
| Extra extension | Not required | `@zenmux/pi-zenmux-oauth` |
| Model setup | Add model IDs to `models.json` | Discover models automatically |
| Protocol selection | Defined by `api` in `models.json` | Selected per model from the ZenMux catalog |
| Credential lifecycle | Managed by the user | Access-token refresh and rotation handled automatically |

## Troubleshooting

### The ZenMux model does not appear

For standard API key configuration, confirm that:

- `~/.pi/agent/models.json` is valid JSON.
- The provider contains `baseUrl`, `api`, and at least one model ID.
- `ZENMUX_API_KEY` is available in the same terminal that starts Pi.

Check the loaded model directly:

```bash
pi --list-models zenmux
```

For OAuth, confirm that the extension is installed:

```bash
pi list
```

If necessary, update it and sign in again:

```bash
pi update npm:@zenmux/pi-zenmux-oauth
```

### The browser opens but authorization does not finish

The OAuth callback uses a temporary port on `127.0.0.1`. The browser and Pi must reach the same machine's loopback address. Remote servers, containers, SSH sessions, and browser proxies may require port forwarding or a local Pi session.

### Requests return 401

- Standard API key: verify that `ZENMUX_API_KEY` is current and was exported before Pi started.
- OAuth: run `/login zenmux` again. If the problem remains, revoke the old grant from ZenMux Authorized Apps and authorize again.

Never paste an API key or OAuth token into prompts, project files, logs, or screenshots.
