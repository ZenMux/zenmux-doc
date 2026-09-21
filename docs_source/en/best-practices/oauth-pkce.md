---
head:
  - - meta
    - name: description
      content: Connect OpenClaw, Codex, DeepSeek Harness, OpenCode, Pi, and Hermes Agent to ZenMux with OAuth 2.0 Authorization Code + PKCE, without copying an API key
  - - meta
    - name: keywords
      content: ZenMux, OAuth, PKCE, OpenClaw, Codex, DeepSeek Harness, DSH, OpenCode, Pi, Hermes Agent, agent login
---

# Sign in to ZenMux with OAuth PKCE

ZenMux supports connecting local agents through OAuth 2.0 Authorization Code + PKCE. This flow does not require you to create, copy, or store a ZenMux API key. The agent opens a browser for authorization, uses a short-lived access token for model requests, and refreshes the token before it expires.

The following agents are currently supported:

| Agent | Plugin / installation source | Sign-in entry point |
| --- | --- | --- |
| OpenClaw | `@zenmux/openclaw-plugin` | `openclaw models auth login --provider zenmux` |
| Codex CLI / Codex App | `@zenmux/codex-oauth` | `zenmux-codex-auth login` |
| [DeepSeek Harness (DSH Web)](/best-practices/deepseek-harness) | `@zenmux/dsh-plugins` | `/zenmux login` |
| OpenCode | `@zenmux/opencode-oauth` | `/connect` or `opencode auth login` |
| Pi | `@zenmux/pi-zenmux-oauth` | `/login zenmux` |
| [Hermes Agent](/best-practices/hermes-agent) | GitHub: `ZenMux/hermes-plugin`; PyPI: `zenmux-hermes-plugin` | `hermes auth add zenmux` |

::: info Register a new OAuth client
OAuth clients are currently registered by the ZenMux backend. To register a client for a new agent or application, email [support@zenmux.ai](mailto:support@zenmux.ai) with the application name, project or package URL, redirect URI, requested scopes, and contact information.
:::

::: tip OAuth PKCE versus API keys
OAuth PKCE authorization is tied to your ZenMux user and an authorization grant. It does not distribute a client secret to the plugin and does not require writing an API key into your shell configuration. You can revoke access at any time from ZenMux Authorized Apps.
:::

## Authorization flow

These integrations follow the same core flow:

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

For complete installation, proxy, and model configuration details, see [DeepSeek Harness Integration](/best-practices/deepseek-harness).

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

## Hermes Agent

For complete installation, default provider configuration, remote authorization, and troubleshooting, see [Hermes Agent Integration](/best-practices/hermes-agent#oauth-plugin). Source code and alternative installation methods are available at [ZenMux/hermes-plugin](https://github.com/ZenMux/hermes-plugin/blob/main/README.md).

::: warning Hermes version requirement
Hermes must include the declarative OAuth PKCE plugin API (`main` must include commit `3e67877e1b` or later). Update older Hermes installations first. This is not an npm package: installing from GitHub through Hermes is recommended, or install the PyPI package `zenmux-hermes-plugin` in the same Python 3.11+ environment as Hermes.
:::

Install and enable the plugin:

```bash
hermes plugins install ZenMux/hermes-plugin --enable
hermes gateway restart
```

If no Gateway is running, restart Hermes instead. Restart Gateways managed by PM2 or another process manager through that manager.

Sign in and check status:

```bash
hermes auth add zenmux
hermes auth status zenmux
```

On the ZenMux authorization page, select your account and billing option, then approve access. OAuth avoids manually creating an API Key, but model requests are still billed to the selected account and billing option.

After authorization, run `hermes model` and select the plugin's ZenMux provider and a model, or specify them explicitly:

```bash
hermes --provider zenmux -m google/gemini-2.5-flash-lite
```

Send a test message and confirm that the model responds. `zenmux` is the provider name; use the full `vendor/model` slug **without adding a `zenmux/` prefix**. When migrating from an API Key custom endpoint, switch the provider from `custom` to `zenmux` rather than only replacing credentials.

Hermes stores access and refresh tokens in its credential pool and serializes refresh token rotation through credential locks. The plugin reads the live model catalog and filters image-only and video-only generation models. Valid unlisted slugs require Hermes support for `ProviderProfile.model_listing_authoritative`; API permissions and responses remain authoritative.

Manage authentication with:

```bash
hermes auth list zenmux
hermes auth refresh zenmux
hermes auth logout zenmux
```

::: tip Remote servers and headless environments
Run `hermes auth add zenmux --no-browser` in the remote terminal. Forward the callback port printed for that login over SSH from your local machine, then open the current authorization URL in your local browser. Do not reuse old URLs or a fixed example port. Plugin version `0.1.1` and later waits up to 10 minutes. See [Remote authorization](/best-practices/hermes-agent#remote-oauth) for detailed steps.
:::

## Credential storage and security

| Agent | Credential storage |
| --- | --- |
| OpenClaw | OpenClaw authentication profile store |
| Codex | macOS Keychain; other systems use `~/.config/zenmux/codex-oauth/credentials.json` with mode `0600` |
| DeepSeek Harness | DSH `ctx.credentials` service |
| OpenCode | OpenCode credential store |
| Pi | Pi provider credential store |
| Hermes Agent | Hermes credential pool (`credential_pool.zenmux` in `auth.json`), not the plugin directory |

- Production uses bundled native public client IDs. No client secret is stored in the plugin packages.
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

The OAuth callback uses a temporary port on `127.0.0.1`. Confirm that a firewall is not blocking loopback connections and that the authorization browser can reach the callback on the machine running the agent. In remote or container environments, the browser's `127.0.0.1` is not necessarily the agent host. OpenClaw supports pasting the full redirect URL back into the terminal. For Hermes, use `--no-browser` and forward the actual callback port for the current login; see [Remote authorization](/best-practices/hermes-agent#remote-oauth).

### Sign-in succeeds, but ZenMux models are missing

Reopen the agent's model selector and confirm that the model catalog endpoint is reachable. OpenClaw, OpenCode, and Pi preserve the last valid catalog cache. DeepSeek Harness currently provides two bundled model entries. Codex writes its catalog during `zenmux-codex-auth install`; run that command again after the production catalog changes.

Hermes uses the live catalog rather than the disk catalog caches described above. For `Unknown provider`, run `hermes plugins list` to confirm installation and enablement, then restart Hermes / Gateway. If a valid unlisted slug is rejected, update Hermes and the plugin; see [Hermes troubleshooting](/best-practices/hermes-agent#troubleshooting).
