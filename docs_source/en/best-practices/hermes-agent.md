---
head:
  - - meta
    - name: description
      content: Install, authorize, and troubleshoot Hermes Agent with ZenMux using the OAuth plugin or an API Key
  - - meta
    - name: keywords
      content: ZenMux, best practices, integration, Hermes, Hermes Agent, OAuth, PKCE, OpenAI, API, AI agent
---

# Hermes Agent Integration with ZenMux

Hermes Agent supports tool calling, browser automation, code execution, and file operations. Connect it to ZenMux to access models from multiple providers through one account.

This guide covers two integration options:

| Option | Authentication | Best for |
| --- | --- | --- |
| [OAuth plugin (recommended)](#oauth-plugin) | Sign in and authorize in a browser, without manually creating or pasting an API Key | Hermes with the OAuth PKCE plugin API |
| [API Key custom endpoint](#api-key) | Configure a ZenMux API Key manually | API Key users or installations that cannot upgrade Hermes yet |

Both options use the OpenAI-compatible Chat Completions protocol at `https://zenmux.ai/api/v1`. OAuth is an authorization method, not free access; requests are billed to the account and billing option selected during authorization.

For OAuth integration with other agents and shared security guidance, see [Sign in with OAuth PKCE](/best-practices/oauth-pkce).

## Prerequisites

- A [ZenMux account](https://zenmux.ai).
- Hermes Agent installed. See the [official quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart) for installation. Windows users should use WSL2.
- The OAuth plugin requires Hermes with the declarative OAuth PKCE plugin API: `main` must include commit `3e67877e1b` or later. Update older Hermes installations first; installing the plugin alone cannot add this capability.
- PyPI installation requires Python 3.11 or later, in the same Python environment as Hermes.
- A browser for initial OAuth authorization. For remote installations, see [Remote authorization](#remote-oauth).

::: tip Plugin Source
This guide follows the [ZenMux Hermes plugin README](https://github.com/ZenMux/hermes-plugin/blob/main/README.md). The plugin includes a dedicated public OAuth client and uses OAuth 2.0 Authorization Code + S256 PKCE. No client secret is required.
:::

## Option 1: OAuth Plugin (Recommended) {#oauth-plugin}

### 1. Install and Enable the Plugin

Installing from GitHub is recommended:

```bash
hermes plugins install ZenMux/hermes-plugin --enable
hermes gateway restart
```

If no Gateway is running, simply restart Hermes after installation. If your Gateway is managed by PM2 or another process manager, restart it there instead, for example with `pm2 restart hermes-gateway --update-env`.

::: details Alternative Installation and Version Pinning
For reproducible installation, get a full 40-character commit from the [Releases page](https://github.com/ZenMux/hermes-plugin/releases) and replace the placeholder:

```bash
hermes plugins install ZenMux/hermes-plugin --ref <40-character-commit> --enable
```

You can also install from PyPI. The following path assumes the default Hermes virtual environment; use your actual Python path for custom installations:

```bash
~/.hermes/hermes-agent/venv/bin/python -m pip install zenmux-hermes-plugin
hermes plugins enable zenmux
hermes gateway restart
```

The plugin must be installed in the same Python environment as Hermes to be discovered. See the [plugin README](https://github.com/ZenMux/hermes-plugin/blob/main/README.md) for filesystem provider installation.
:::

### 2. Sign In and Authorize

```bash
hermes auth add zenmux
hermes auth status zenmux
```

Hermes opens the ZenMux authorization page. Select your account and billing option, approve access, then return to the terminal to check authentication status.

Hermes stores access and refresh tokens in its credential pool, not in the plugin directory. The plugin's `zenmux.json` contains only the public OAuth client ID. Refresh token rotation is serialized through Hermes credential locks.

::: warning Protect Your Credentials
Do not paste tokens, authorization codes, or complete authentication files into chats, tickets, or repositories. The OAuth plugin does not require copying tokens into an API Key configuration.
:::

### 3. Select a Model and Verify

Open the model selector and choose the plugin's ZenMux provider and your desired model:

```bash
hermes model
```

Alternatively, explicitly specify the provider and full model slug to avoid reusing a previous custom endpoint configuration:

```bash
hermes --provider zenmux -m google/gemini-2.5-flash-lite
hermes --provider zenmux -m anthropic/claude-sonnet-4.5
```

Send a short message and confirm that the model responds. To make ZenMux the default provider:

```bash
hermes config set model.provider zenmux
hermes config set model.default google/gemini-2.5-flash-lite
hermes config set model.base_url https://zenmux.ai/api/v1
hermes config set model.api_mode chat_completions

hermes -z "Reply with exactly: OK" --safe-mode
```

Successful login confirms authorization only; an actual model response verifies that inference works.

### 4. Switch Models and Understand the Catalog

In a chat or messaging bot already using ZenMux, enter:

```text
/model z-ai/glm-5.3-flashx
```

`zenmux` is the provider name, not a model slug prefix. Use the full `vendor/model` ID, such as `z-ai/glm-5.3-flashx`, not `zenmux/glm-5.3-flashx`.

The plugin reads the live catalog at `https://zenmux.ai/api/v1/models`. It keeps text-output models and filters image-only and video-only generation models out of the chat selector. A small fallback list is used only when the catalog is temporarily unavailable. Example models are not guaranteed to be available to every account; account permissions and API responses determine actual availability.

::: info Models Outside the Catalog
The live catalog supports model selection and spelling suggestions; it is not an account permission allowlist. For account-specific, staged, or special-routing slugs, Hermes must support `ProviderProfile.model_listing_authoritative` to allow requests for unlisted slugs. Older Hermes versions may reject them before sending a request; update Hermes and the plugin first. Invalid or unauthorized slugs are still rejected by the ZenMux API.
:::

### Remote Servers and Headless Environments {#remote-oauth}

OAuth uses a temporary loopback callback such as `http://127.0.0.1:54321/callback`. The port is not fixed.

1. Start login in the remote terminal to obtain the current authorization URL and callback port:

   ```bash
   hermes auth add zenmux --no-browser
   ```

2. Leave the remote login command waiting. Open another terminal on your local machine and forward **the port actually shown for this login** (`54321` is only an example):

   ```bash
   ssh -N -L 54321:127.0.0.1:54321 user@remote-host
   ```

3. Open the current authorization URL in your local browser, approve access, and check the result in the remote terminal.

Plugin version `0.1.1` and later waits up to 10 minutes. After a timeout, restart login and use the new URL and port; expired authorization codes cannot be reused. Do not expose the callback server to the public internet.

For hosted containers without SSH forwarding, the README describes authorizing with a temporary local `HERMES_HOME` and securely merging only `credential_pool.zenmux`. Transfer only that provider's credentials; never overwrite other remote provider credentials with an entire local `auth.json`. See the [remote environment instructions](https://github.com/ZenMux/hermes-plugin/blob/main/README.md#remote-and-headless-hosts).

### Manage Authentication and Update

```bash
# Inspect credentials, refresh explicitly, or log out
hermes auth list zenmux
hermes auth refresh zenmux
hermes auth logout zenmux
```

Update using your original installation method, then restart Hermes or the Gateway:

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

To stop using the plugin, run `hermes auth logout zenmux`, then `hermes plugins disable zenmux`. See the [plugin README](https://github.com/ZenMux/hermes-plugin/blob/main/README.md#uninstall) for complete removal instructions.

## Option 2: API Key Custom Endpoint {#api-key}

You can still connect with an API Key without installing the OAuth plugin.

1. Create a [Subscription API Key](/guide/subscription) or [Pay-As-You-Go API Key](/guide/pay-as-you-go). Refer to those pages for current plans, pricing, and quotas.
2. Run `hermes model` and select **Custom endpoint (enter URL manually)**.
3. Enter the following values:

   | Setting | Value |
   | --- | --- |
   | API Base URL | `https://zenmux.ai/api/v1` |
   | API Key | Your ZenMux API Key |
   | Model name | A full model ID, such as `openai/gpt-5.4` |

4. Run `hermes` and send a test message to confirm that the model responds.

::: warning Keep the Two Methods Separate
API Key custom endpoints use `model.provider: custom`; the OAuth plugin uses provider `zenmux`. When migrating from the old method, select the plugin provider again or set the default provider as shown above. Neither method adds a `zenmux/` prefix to model IDs.
:::

## Troubleshooting

### OAuth Plugin Issues

::: details Unknown provider 'zenmux'
First confirm that Hermes meets the version requirement, then check that the plugin is installed and enabled:

```bash
hermes plugins list
hermes plugins enable zenmux
hermes gateway restart
```

For PyPI installations, also check that the plugin is in the Python environment used by Hermes. Restart externally managed Gateways through their process manager.
:::

::: details OAuth Timeout or Authorization Failure
Run `hermes auth add zenmux` again and use the newly generated URL and port. Remote servers require forwarding as described in [Remote authorization](#remote-oauth). Do not reuse authorization codes from expired login attempts.

If authentication fails after login, check `hermes auth status zenmux` and try `hermes auth refresh zenmux`. Sign in again if refreshing still fails.
:::

::: details Logged In, but Inference Reports a Missing Endpoint
Update the plugin and run `hermes auth add zenmux` again. The current plugin saves `base_url=https://zenmux.ai/api/v1` with credentials; early development versions did not save this field.
:::

::: details Model Rejected Because It Is Not in the Catalog
Check the full `vendor/model` slug first. For a valid unlisted model, update Hermes to a version supporting `ProviderProfile.model_listing_authoritative`, then update the plugin. Allowing an unlisted slug does not grant access; the ZenMux API response remains authoritative.
:::

### Common Issues

::: details API Key Error or Authentication Failure
**Problem**: An invalid API Key or unauthorized error appears, such as `401 Unauthorized`

**Solution**:

1. **Check the API Key format**:
   - Subscription keys start with `sk-ss-v1-`
   - Pay-As-You-Go keys start with `sk-ai-v1-`
   - Make sure there are no extra spaces or line breaks

2. **Re-run `hermes model`**:
   The easiest fix is to re-run the wizard and re-enter your API Key:
   ```bash
   hermes model
   ```

3. **Verify the key is still valid**:
   - Subscription: Visit the [Subscription page](https://zenmux.ai/platform/subscription) to check your status and quota
   - Pay-As-You-Go: Visit the [Pay-As-You-Go page](https://zenmux.ai/platform/pay-as-you-go) to confirm your balance

4. **Inspect the current config**:
   ```bash
   hermes config
   hermes config check
   ```
:::

::: details Requests Not Reaching ZenMux
**Problem**: Requests seem to go to the default provider rather than ZenMux

**Solution**:

1. **Re-run `hermes model`**:
   For OAuth, select the plugin's ZenMux provider; for API Keys, select "Custom endpoint". Confirm the URL is `https://zenmux.ai/api/v1`

2. **Check the current configuration**:
   ```bash
   hermes config
   ```
   In the `model` section, verify that `provider` is `zenmux` for the OAuth plugin or `custom` for an API Key custom endpoint. The `base_url` should be `https://zenmux.ai/api/v1`

3. **Double-check the base_url format**:
   - Correct: `https://zenmux.ai/api/v1`
   - Wrong: `https://zenmux.ai/v1`, `https://api.zenmux.ai/v1`
:::

::: details Connection Failure or Timeout
**Problem**: Hermes Agent cannot connect to ZenMux

**Solution**:

1. **Test network connectivity**:
   ```bash
   curl https://zenmux.ai/api/v1/models
   ```
   If this returns a JSON model list, the connection is fine

2. **Check firewalls and proxies**:
   - Make sure your firewall isn't blocking outbound HTTPS connections
   - Configure proxies with standard `HTTP_PROXY` / `HTTPS_PROXY` variables
   - If the proxy terminates TLS, configure its CA with `SSL_CERT_FILE` / `REQUESTS_CA_BUNDLE`; do not globally disable TLS verification

3. **DNS troubleshooting**:
   ```bash
   nslookup zenmux.ai
   ```
:::

::: details Unexpected Responses or Tool Calling Failures
**Problem**: The model produces unexpected output or tool calls fail

**Solution**:

1. **Confirm the model supports tool calling**:
   - Hermes Agent relies on the model's native function calling capability
   - Some smaller models may not support tool calling, causing the agent to behave unpredictably
   - Recommended: GPT-5.x, Claude Sonnet/Opus, Gemini Pro, or other models with tool calling support

2. **Switch to a tool-calling-capable model**:
   Run `hermes model`, select the ZenMux provider, and choose a model that supports tool calling

3. **Verify the model name**:
   - Use the raw ZenMux model ID, e.g., `openai/gpt-5.2`
   - Do not add a `zenmux/` prefix
   - Confirm the ID on the [ZenMux Models page](https://zenmux.ai/models)
:::

::: details 429 Rate Limit Errors
**Problem**: Frequent `429 Too Many Requests` errors

**Solution**:

1. **Check your plan quota**: Subscription plans have request rate limits — consider upgrading or switching to Pay-As-You-Go

2. **Reduce concurrency**: If you're running multiple model tasks in parallel, try lowering the concurrency

3. **Contact ZenMux support**: If rate limiting persists, reach out to ZenMux technical support
:::

## Supported Models

ZenMux offers a wide selection of models. Here are some popular picks for Hermes Agent:

| Model | ID | Best For |
| ----- | -- | -------- |
| GPT-5.4 | `openai/gpt-5.4` | High-performance general use, coding |
| Claude Opus 4.6 | `anthropic/claude-opus-4.6` | Complex reasoning, coding |
| Claude Sonnet 4.6 | `anthropic/claude-sonnet-4.6` | Balanced performance |
| Gemini 3 Pro | `google/gemini-3.1-pro-preview` | Multimodal, long context |
| DeepSeek V3.2 | `deepseek/deepseek-v3.2` | Cost-effective general use |
| Grok 4.2 Fast | `x-ai/grok-4.2-fast` | Fast inference |
| Qwen3.6 Plus | `qwen/qwen3.6-plus` | General reasoning |
| GLM 5.1 | `z-ai/glm-5.1` | Chinese-language general use |
| Kimi 2.5 | `moonshotai/kimi-k2.5` | Long context comprehension |

For the complete list, visit the [ZenMux Models page](https://zenmux.ai/models).

## Contact Us

<ContactCards>
<ContactCard icon="mail" title="Email">

Technical support: [support@zenmux.ai](mailto:support@zenmux.ai)

Business cooperation: [bd@zenmux.ai](mailto:bd@zenmux.ai)

</ContactCard>
<ContactCard icon="x" title="X / Twitter" link="https://x.com/ZenMuxAI" label="@ZenMuxAI" />
<ContactCard icon="discord" title="Discord" link="https://discord.gg/vHZZzj84Bm" label="@ZenMuxAI" />
</ContactCards>
