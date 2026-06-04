---
head:
  - - meta
    - name: description
      content: Example guide for integrating Codex CLI and Codex App with ZenMux
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, codex, codex cli, codex app, OpenAI, API
---

# Codex CLI + Codex App Integration Example

Codex is OpenAI's programming assistant, available in two forms:

- **Codex CLI**: An open-source command-line tool that runs in your local terminal. It can read, modify, and run code within a directory you choose. Built with Rust, it is fast and efficient, and is continuously improved on GitHub.
- **Codex App**: A graphical application (desktop / IDE plugin) that works out of the box—ideal for users who prefer a visual interface. See the [official Codex App page](https://developers.openai.com/codex/app) for details.

**Both share the same configuration approach**: they read the same `~/.codex/config.toml` file and the same environment variables. As a result, the configuration below applies to both Codex CLI and Codex App—configure once and use it on both. By integrating with ZenMux, you gain access to more model options instead of being limited to the official OpenAI API.

::: info Compatibility Notes
OpenAI has explicitly positioned Responses as the next-generation unified interface. Chat Completions is still available, but it is no longer the preferred choice for new projects. Codex will follow this direction as well—treating Chat Completions as a compatibility option and gradually migrating to Responses (the configuration in this article uses Responses).

Note the OpenAI-compatible setting: base_url="https://zenmux.ai/api/v1".
:::

## Configuration Options

::: tip Configure once, use everywhere
Codex CLI and Codex App read the same `~/.codex/config.toml` file and environment variables. Once you complete the steps below, both forms will automatically use ZenMux.
:::

### Install Codex

::: code-group

```bash [Codex CLI]
# Install with pnpm (recommended)
pnpm install -g @openai/codex

# Or install with npm
npm install -g @openai/codex
```

```text [Codex App]
# Download and install Codex App (desktop / IDE plugin) from the official page:
# https://developers.openai.com/codex/app
# No extra setup entry is needed—the App automatically reads the
# ~/.codex/config.toml described below.
```

:::

### Configure Environment Variables

Add your ZenMux API Key to your shell configuration file:

```bash
# Edit ~/.zshrc or ~/.bashrc depending on the terminal you use
export ZENMUX_API_KEY="sk-ai-v1-xxx"  # [!code highlight]
```

::: warning Important
Make sure to replace `sk-ai-v1-xxx` with your actual ZenMux API Key. You can obtain an API Key in the [ZenMux Console](https://zenmux.ai/settings/keys).
:::

### Configure Codex

Create or modify the Codex configuration file `~/.codex/config.toml`:

```toml
model_provider = "zenmux"  # [!code highlight]
model = "gpt-5.2-codex"  # [!code highlight]

[model_providers.zenmux]  # [!code highlight]
name = "ZenMux"  # [!code highlight]
base_url = "https://zenmux.ai/api/v1"  # [!code highlight]
env_key = "ZENMUX_API_KEY"  # [!code highlight]
wire_api = "responses"  # [!code highlight]
```

::: tip Configuration Notes

- `model_provider`: Use ZenMux as the model provider
- `model`: The model to use; can be any model supported by ZenMux. For GPT-series models, we recommend using the native name directly (e.g., `gpt-5.2-codex`)—see the [Supported Models](#supported-models) section below
- `base_url`: The base URL of the ZenMux API
- `env_key`: The name of the environment variable that stores the API Key
- `wire_api`: Use the Responses protocol (recommended)
  :::

### Start Using It Immediately

Once configured, you can start Codex:

::: code-group

```bash [Codex CLI]
# Reload configuration
source ~/.zshrc  # or source ~/.bashrc

# Enter your project directory
cd my-project

# Start Codex CLI
codex  # [!code highlight]
```

```text [Codex App]
# Just open Codex App—it automatically reads ~/.codex/config.toml.
# If the App is already running, restart it once to load the latest configuration.
```

:::

::: tip First launch of Codex App
If Codex App prompts you to enter an API Key on first launch, simply enter your ZenMux API Key (`sk-ai-v1-xxx`), then close the App. Next, edit `~/.codex/config.toml` as described in [Configure Codex](#configure-codex) above, save it, and reopen Codex App for the changes to take effect.
:::

::: tip Convenience
After adding the environment variable to your shell configuration file, you won’t need to set it manually each time. The configuration applies automatically every time you open a new terminal, and both Codex CLI and Codex App will read it.
:::

## Supported Models

You can freely switch the `model` field in `config.toml` to any model supported by ZenMux.

For the complete, continuously updated model list, visit the **[ZenMux model list (Responses protocol) ↗](https://zenmux.ai/models?sort=newest&supported_protocol=responses)**. Just put the model name in the `model` field of `config.toml`.

### Use Native Aliases for GPT-Series Models

For OpenAI GPT-series models, **we recommend using the native name directly** (e.g., `gpt-5.2-codex`, `gpt-5.5`) rather than the prefixed full ZenMux model ID (e.g., `openai/gpt-5.2-codex`, `openai/gpt-5.5`).

```toml
# ✅ Recommended: use the native alias for maximum feature support
model = "gpt-5.2-codex"  # [!code highlight]

# ⚠️ Not recommended: the prefixed full ID may prevent some native features from being enabled
model = "openai/gpt-5.2-codex"
```

::: info Why use the native alias?

Codex validates model names against hardcoded strings to enable the corresponding native features (such as reasoning under the Responses protocol and codex-specific capabilities). When Codex sees a native name like `gpt-5.2-codex`, those features are activated correctly; when it sees a prefixed ID like `openai/gpt-5.2-codex`, validation may fail and the features silently fall back.

ZenMux's model alias feature makes `gpt-5.2-codex` fully equivalent to `openai/gpt-5.2-codex`, so Codex's validation passes and all downstream features work as expected. For the full alias list and more details, see [Model Alias](/guide/advanced/model-alias).

:::

::: tip How to use other models

- GPT series: use the native name directly (e.g., `gpt-5.2-codex`, `gpt-5.5`)
- Models from other providers: use the prefixed full slug (e.g., `anthropic/claude-opus-4-8`, `deepseek/deepseek-v4-pro`); filter for Responses-protocol models in the [ZenMux model list](https://zenmux.ai/models?sort=newest&supported_protocol=responses) and copy their slugs
- To target a specific provider, see the [Provider Routing documentation](/guide/advanced/provider-routing)

:::

## Troubleshooting

### Common Issues

::: details API Key Error
**Issue**: You are told the API Key is invalid or unauthorized.

**Solutions**:

- Check whether the environment variable `ZENMUX_API_KEY` is set correctly
- Use `echo $ZENMUX_API_KEY` to verify the environment variable value
- Confirm the API Key is active and that you have sufficient balance
- Verify the API Key format starts with `sk-ai-v1-`
  :::

::: details Connection Failure
**Issue**: Codex CLI cannot connect to the ZenMux service.

**Solutions**:

- Check that your network connection is working
- Verify that `base_url` in `config.toml` is correctly set to `https://zenmux.ai/api/v1`
- Confirm your firewall settings are not blocking outbound connections
- Try `curl https://zenmux.ai/api/v1/models` to test connectivity
  :::

::: details Environment Variable Not Taking Effect
**Issue**: Even after setting the API Key, it still says it is not configured.

**Solutions**:

- Reopen the terminal window, or run `source ~/.zshrc` or `source ~/.bashrc` to reload the configuration
- Confirm the environment variable is set correctly: `echo $ZENMUX_API_KEY`
- Make sure you added the environment variable to the correct shell configuration file (`.zshrc` for zsh users, `.bashrc` for bash users)
  :::

::: details Configuration File Path Issue
**Issue**: Changes to the configuration file do not take effect.

**Solutions**:

- Confirm the configuration file path is `~/.codex/config.toml`
- If the directory does not exist, create it first: `mkdir -p ~/.codex`
- Check that the configuration file syntax is correct (TOML format)
- Use `cat ~/.codex/config.toml` to verify the file contents
  :::

::: details Model Unavailable
**Issue**: A model is reported as unavailable or unsupported.

**Solutions**:

- Visit the [ZenMux model list](https://zenmux.ai/models?sort=newest&supported_protocol=responses) to confirm the model is available
- Check that the model slug is spelled correctly
- Try another recommended model to test
- Confirm your account has permission to access the model
  :::

## Advanced Configuration

### Configure Different Models

To switch to any model supported by ZenMux, just change the `model` field in `config.toml`—everything else stays the same. The examples below show how to specify different models:

::: code-group

```toml [Claude Opus 4.8]
model_provider = "zenmux"
model = "anthropic/claude-opus-4-8"  # [!code highlight]

[model_providers.zenmux]
name = "ZenMux"
base_url = "https://zenmux.ai/api/v1"
env_key = "ZENMUX_API_KEY"
wire_api = "responses"
```

```toml [DeepSeek V4 Pro]
model_provider = "zenmux"
model = "deepseek/deepseek-v4-pro"  # [!code highlight]

[model_providers.zenmux]
name = "ZenMux"
base_url = "https://zenmux.ai/api/v1"
env_key = "ZENMUX_API_KEY"
wire_api = "responses"
```

```toml [Kimi K2.6]
model_provider = "zenmux"
model = "moonshotai/kimi-k2.6"  # [!code highlight]

[model_providers.zenmux]
name = "ZenMux"
base_url = "https://zenmux.ai/api/v1"
env_key = "ZENMUX_API_KEY"
wire_api = "responses"
```

:::

::: tip Note
Use the actual slug from the [ZenMux model list](https://zenmux.ai/models?sort=newest&supported_protocol=responses) in the `model` field.
:::

<ContactCards>
<ContactCard icon="mail" title="Email">

Technical support: [support@zenmux.ai](mailto:support@zenmux.ai)

Business cooperation: [bd@zenmux.ai](mailto:bd@zenmux.ai)

</ContactCard>
<ContactCard icon="x" title="X / Twitter" link="https://x.com/ZenMuxAI" label="@ZenMuxAI" />
<ContactCard icon="discord" title="Discord" link="https://discord.gg/vHZZzj84Bm" label="@ZenMuxAI" />
</ContactCards>
