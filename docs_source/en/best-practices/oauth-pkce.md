---
head:
  - - meta
    - name: description
      content: Connect OpenClaw, Codex, DeepSeek Harness, OpenCode, and Pi to ZenMux with OAuth 2.0 Authorization Code + PKCE, without copying an API key
  - - meta
    - name: keywords
      content: ZenMux, OAuth, PKCE, OpenClaw, Codex, DeepSeek Harness, DSH, OpenCode, Pi, agent login
---

# Sign in to ZenMux with OAuth PKCE

ZenMux supports connecting local agents through OAuth 2.0 Authorization Code + PKCE. This flow does not require you to create, copy, or store a ZenMux API key. The agent opens a browser for authorization, uses a short-lived access token for model requests, and refreshes the token before it expires.

The following agents are currently supported:

| Agent | npm package | Sign-in entry point |
| --- | --- | --- |
| OpenClaw | `@zenmux/openclaw-plugin` | `openclaw models auth login --provider zenmux` |
| Codex CLI / Codex App | `@zenmux/codex-oauth` | `zenmux-codex-auth login` |
| DeepSeek Harness (DSH Web) | `@zenmux/dsh-plugins` | `/zenmux login` |
| OpenCode | `@zenmux/opencode-oauth` | `/connect` or `opencode auth login` |
| Pi | `@zenmux/pi-zenmux-oauth` | `/login zenmux` |

::: tip OAuth PKCE versus API keys
OAuth PKCE authorization is tied to your ZenMux user and an authorization grant. It does not distribute a client secret to the plugin and does not require writing an API key into your shell configuration. You can revoke access at any time from ZenMux Authorized Apps.
:::

## Authorization flow

All five integrations follow the same core flow:

1. The agent generates a one-time PKCE `code_verifier` and its S256 `code_challenge`.
2. A browser opens the ZenMux authorization page, where you confirm the account and requested access.
3. ZenMux returns a one-time authorization code to a temporary callback port on `127.0.0.1`.
4. The plugin exchanges the authorization code and `code_verifier` for an access token and refresh token.
5. The agent uses the access token for ZenMux requests and refreshes it before expiration.

The official packages request only these scopes by default:

- `inference:invoke`: invoke models.
- `offline_access`: refresh the sign-in session after the access token expires.

## OpenClaw

Install the plugin and start sign-in:

```bash
openclaw plugins install @zenmux/openclaw-plugin
openclaw models auth login --provider zenmux
```

Select **ZenMux OAuth**, finish authorization in the browser, and then choose a `zenmux/...` model in OpenClaw.

OpenClaw stores tokens in its own authentication profile store and persists rotated refresh tokens automatically. Models are discovered dynamically, with the latest valid catalog cached at `~/.cache/openclaw/zenmux/models.json`.

::: tip Remote servers and VPS hosts
OpenClaw supports copying the full final redirect URL from the browser back into the terminal, allowing sign-in when OpenClaw runs on a remote server.
:::

## Codex CLI and Codex App

Install the authentication tool globally:

```bash
npm install -g @zenmux/codex-oauth
```

Configure Codex and sign in:

```bash
zenmux-codex-auth install
zenmux-codex-auth login
```

Restart Codex CLI or Codex App afterward. `install` configures ZenMux as a Responses provider and downloads the current Responses-compatible model catalog without changing your existing model name. An existing `~/.codex/config.toml` is backed up first.

Inspect or clear the sign-in state with:

```bash
zenmux-codex-auth status
zenmux-codex-auth logout
```

::: warning Do not run the token command manually
`zenmux-codex-auth token` is intended exclusively for Codex `auth.command` calls and prints a live Bearer token to standard output. Do not run, capture, or screenshot it for debugging.
:::

To remove the integration completely, restore the Codex configuration before uninstalling the npm package:

```bash
zenmux-codex-auth uninstall
npm uninstall -g @zenmux/codex-oauth
```

## DeepSeek Harness

Install the ZenMux bundle into the DSH Web profile, then start DSH:

```bash
dsh plugin --profile web add @zenmux/dsh-plugins
dsh web
```

Run this command in DSH Web:

```text
/zenmux login
```

After browser authorization displays **ZenMux connected**, return to DSH and select **ZenMux · DeepSeek V4 Pro** or **ZenMux · DeepSeek V4 Flash** from the model selector.

Manage the sign-in state with:

```text
/zenmux status
/zenmux logout
```

::: info DSH support scope
The current package targets interactive DSH Web deployments that can execute `/zenmux` commands. Pure headless or automated deployments that do not consume command adapters cannot initiate browser sign-in, although they can reuse credentials created under the same Harness home.
:::

## OpenCode

Add the OAuth package to your OpenCode configuration:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@zenmux/opencode-oauth"]
}
```

Then run:

```bash
opencode auth login -p zenmux -m "ZenMux OAuth (PKCE)"
```

Alternatively, run `/connect` in OpenCode, select **ZenMux**, and choose **ZenMux OAuth (PKCE)**. After authorization, run `/models` and select a ZenMux model.

OpenCode keeps access and refresh tokens in its own credential store. The catalog maps each model to Anthropic Messages, OpenAI Responses, or Chat Completions and is cached at `~/.cache/opencode/zenmux/models.json`.

::: info Version compatibility
`@zenmux/opencode-oauth` currently targets the stable OpenCode V1 plugin API. OpenCode V2 uses a separate beta plugin API and is outside the support scope of this guide.
:::

## Pi

Install the extension with Pi:

```bash
pi install npm:@zenmux/pi-zenmux-oauth
```

After starting Pi, sign in with:

```text
/login zenmux
```

When browser authorization finishes, return to Pi, run `/model`, and select a ZenMux model. Pi manages access and refresh tokens through its provider credential store and caches the model catalog at `~/.pi/agent/models-store.json`.

## Credential storage and security

| Agent | Credential storage |
| --- | --- |
| OpenClaw | OpenClaw authentication profile store |
| Codex | macOS Keychain; other systems use `~/.config/zenmux/codex-oauth/credentials.json` with mode `0600` |
| DeepSeek Harness | DSH `ctx.credentials` service |
| OpenCode | OpenCode credential store |
| Pi | Pi provider credential store |

- Production uses bundled native public client IDs. No client secret is stored in the npm packages.
- Callback listeners bind only to temporary ports on `127.0.0.1` and validate OAuth `state`.
- Access tokens are refreshed before expiration. When the server rotates a refresh token, the plugin saves the replacement.
- Never copy OAuth tokens into model settings, environment variables, logs, or screenshots.
- When you stop using an agent, sign out from the agent and revoke its grant from ZenMux Authorized Apps.

## Troubleshooting

### The browser does not open automatically

Copy the authorization URL printed in the terminal into a browser. For Codex, you can also set:

```bash
export ZENMUX_OAUTH_NO_BROWSER=1
zenmux-codex-auth login
```

### The terminal keeps waiting after browser authorization

The OAuth callback uses a temporary port on `127.0.0.1`. Confirm that a firewall is not blocking loopback connections and that the authorization browser can reach the callback on the machine running the agent. In remote or container environments, the browser's `127.0.0.1` is not necessarily the agent host. OpenClaw is currently the only integration in this guide that explicitly supports pasting the full redirect URL back into the terminal.

### Sign-in succeeds, but ZenMux models are missing

Reopen the agent's model selector and confirm that the model catalog endpoint is reachable. OpenClaw, OpenCode, and Pi preserve the last valid catalog cache. DeepSeek Harness currently provides two bundled model entries. Codex writes its catalog during `zenmux-codex-auth install`; run that command again after the production catalog changes.
