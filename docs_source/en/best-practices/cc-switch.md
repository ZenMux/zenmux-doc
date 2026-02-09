---
head:
  - - meta
    - name: description
      content: Manage ZenMux integration settings for Claude Code / Codex / Gemini CLI / OpenCode via CC-Switch
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, CC-Switch, cc-switch, Claude Code, Codex, Gemini CLI, OpenCode, model switching, provider
---

# Using ZenMux with CC-Switch: A Guide

[CC-Switch](https://github.com/farion1231/cc-switch) is an open-source, cross-platform desktop tool designed to centrally manage configuration for AI coding assistants. It can manage provider settings for four major coding tools—Claude Code, Codex, Gemini CLI, and OpenCode—so you can switch API providers with a single click in a visual UI, without manually editing environment variables or JSON files.

::: info Compatibility Notes
CC-Switch supports managing **Claude Code**, **Codex**, **Gemini CLI**, and **OpenCode**. By configuring ZenMux as a provider in CC-Switch, you can:

- **Visual management**: Stop editing environment variables and config files by hand—do everything in a GUI
- **One-click switching**: Switch instantly between ZenMux and other providers without restarting your terminal
- **Unified configuration**: Configure ZenMux once and sync it across multiple coding tools
- **Automatic failover**: Automatically switch to a backup provider when the primary provider fails
- **Request monitoring**: View request logs and usage statistics in real time

CC-Switch supports both the Anthropic protocol and the OpenAI protocol, both of which integrate seamlessly with ZenMux.
:::

## Install CC-Switch

### macOS

::: code-group

```bash [Homebrew (Recommended)]
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

```text [Manual Installation]
1. Download the latest macOS ZIP from the CC-Switch Releases page:
   https://github.com/farion1231/cc-switch/releases

2. Unzip it and drag CC-Switch.app into the Applications folder

3. On first launch, you may see “Developer cannot be verified”. Go to:
   System Settings → Privacy & Security → click “Open Anyway”
```

:::

### Windows

::: code-group

```text [MSI Installer (Recommended)]
1. Download the latest .msi installer from the CC-Switch Releases page:
   https://github.com/farion1231/cc-switch/releases

2. Double-click the .msi file and follow the prompts to complete installation
```

```text [Portable Version]
1. Download the latest portable .zip from the CC-Switch Releases page:
   https://github.com/farion1231/cc-switch/releases

2. Extract to any folder and double-click CC-Switch.exe to run
```

:::

### Linux

::: code-group

```bash [Debian/Ubuntu (.deb)]
# After downloading the .deb package from the Releases page, run:
sudo dpkg -i cc-switch_*.deb
```

```text [AppImage]
1. Download the .AppImage file from the Releases page
2. Make it executable: chmod +x CC-Switch_*.AppImage
3. Double-click to run or execute in a terminal: ./CC-Switch_*.AppImage
```

:::

::: tip 💡 Web UI (Headless/SSH environments)
CC-Switch also provides a Web UI version for servers without a graphical interface or for SSH-based remote environments. Download the Linux x64 tar.gz package from the Releases page, extract it, and run it. The default port is 17666.
:::

## Get a ZenMux API Key

Before configuring CC-Switch, you’ll need a ZenMux API Key. ZenMux offers two billing options—choose the one that fits your use case:

::: code-group

```text [Subscription API Key (Recommended)]
✅ Use cases: personal development, learning/exploration, vibe coding
✅ Features: fixed monthly fee, predictable cost, 5–10x pricing leverage
✅ API Key format: sk-ss-v1-xxx

How to get it:
1. Visit the subscription management page: https://zenmux.ai/platform/subscription
2. Choose a plan (Pro $20/mo, Max $100/mo, Ultra $200/mo)
3. After subscribing, create a subscription API key on the page

For details, see: Subscription Plan Guide
📚 https://docs.zenmux.ai/guide/subscription
```

```text [Pay-as-you-go API Key]
✅ Use cases: production environments, commercial products, enterprise apps
✅ Features: no rate limits, production-grade stability, billed by actual usage
✅ API Key format: sk-ai-v1-xxx

How to get it:
1. Visit the pay-as-you-go page: https://zenmux.ai/platform/pay-as-you-go
2. Top up your account (top-ups automatically get 20% bonus credits)
3. Create an API key in the "Pay As You Go API Keys" section

For details, see: Pay-as-you-go Guide
📚 https://docs.zenmux.ai/guide/pay-as-you-go
```

:::

::: warning 💡 Important: Choose the Correct API Key Type

- **Personal development/learning** → Use a **Subscription API Key** (`sk-ss-v1-xxx`) for lower cost and better value
- **Production/commercial projects** → Use a **Pay-as-you-go API Key** (`sk-ai-v1-xxx`) for higher stability and no limits

Subscription keys are prohibited for production use. Violations may result in account restrictions.
:::

## Configure the ZenMux Provider

### Step 1: Open Provider Management

After launching CC-Switch, select the coding tool you want to configure in the top navigation bar (for example, **Claude Code**) to open the provider management page.

::: tip 💡 First Launch
On first launch, CC-Switch automatically imports your existing local Claude Code / Codex / Gemini CLI / OpenCode configuration as the default provider—no manual migration needed.
:::

### Step 2: Add the ZenMux Provider

Click **Add Provider** and fill in the following configuration:

#### Claude Code (Anthropic protocol)

| Setting           | Value                             | Notes                          |
| ----------------- | --------------------------------- | ------------------------------ |
| **Provider Name** | `ZenMux`                          | Custom name for identification |
| **Base URL**      | `https://zenmux.ai/api/anthropic` | ZenMux Anthropic-compatible endpoint |
| **API Key**       | `sk-ss-v1-xxx` or `sk-ai-v1-xxx`  | Your ZenMux API key            |

Configure **Model Mapping** by mapping Claude Code’s three speed tiers to models on ZenMux:

| Tier                | Recommended model              | Notes                                  |
| ------------------- | ----------------------------- | ------------------------------------- |
| **Haiku (Fast)**    | `anthropic/claude-haiku-4.5`  | Fast completion, simple tasks         |
| **Sonnet (Balanced)** | `anthropic/claude-sonnet-4.5` | Recommended for daily dev, best value |
| **Opus (Powerful)** | `anthropic/claude-opus-4.5`   | Complex architecture, large refactors |

::: tip 💡 Flexible model selection
With ZenMux, you can map not only to Claude-family models, but also to models from other providers. For example:

- Haiku tier → `volcengine/doubao-seed-code` (Doubao coding model)
- Sonnet tier → `openai/gpt-5.2` (GPT-5.2)
- Opus tier → `google/gemini-3-pro-preview` (Gemini 3 Pro)

For more Anthropic-protocol models, see the [ZenMux model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages).
:::

##### JSON configuration example (copy-paste ready)

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "<ZENMUX_API_KEY>",
    "ANTHROPIC_BASE_URL": "https://zenmux.ai/api/anthropic",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "anthropic/claude-haiku-4.5",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "anthropic/claude-opus-4.5",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "anthropic/claude-sonnet-4.5",
    "ANTHROPIC_MODEL": "anthropic/claude-opus-4.5",
    "API_TIMEOUT_MS": "30000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

#### Codex

| Setting           | Value                             | Notes                     |
| ----------------- | --------------------------------- | ------------------------- |
| **Provider Name** | `ZenMux`                          | Custom name for identification |
| **Base URL**      | `https://zenmux.ai/api/v1`        | ZenMux OpenAI-compatible endpoint |
| **API Key**       | `sk-ss-v1-xxx` or `sk-ai-v1-xxx`  | Your ZenMux API key       |

##### config.toml example (copy-paste ready)

```toml
model_provider = "zenmux"
model = "openai/gpt-5.2-codex"

[model_providers.zenmux]
name = "ZenMux"
base_url = "https://zenmux.ai/api/v1"
wire_api = "responses"
```

#### Gemini CLI (Vertex AI protocol)

| Setting           | Value                              | Notes                          |
| ----------------- | ---------------------------------- | ------------------------------ |
| **Provider Name** | `ZenMux`                           | Custom name for identification |
| **Base URL**      | `https://zenmux.ai/api/vertex-ai`  | ZenMux Vertex AI-compatible endpoint |
| **API Key**       | `sk-ss-v1-xxx` or `sk-ai-v1-xxx`   | Your ZenMux API key            |

##### Environment variables example (copy-paste ready)

```env
GOOGLE_GEMINI_BASE_URL=https://zenmux.ai/api/vertex-ai
GEMINI_API_KEY=<ZENMUX_API_KEY>
GEMINI_MODEL=google/gemini-3-flash-preview
```

#### OpenCode (OpenAI protocol)

| Setting           | Value                              | Notes                          |
| ----------------- | ---------------------------------- | ------------------------------ |
| **Provider Name** | `ZenMux`                           | Custom name for identification |
| **Base URL**      | `https://zenmux.ai/api/vertex-ai`  | ZenMux Vertex AI-compatible endpoint |
| **API Key**       | `sk-ss-v1-xxx` or `sk-ai-v1-xxx`   | Your ZenMux API key            |

##### JSON configuration example (copy-paste ready)

```json
{
  "models": {
    "openai/gpt-5.2": {
      "name": "gpt-5.2 (via ZenMux)"
    }
  },
  "npm": "@ai-sdk/openai-compatible",
  "options": {
    "apiKey": "<ZENMUX_API_KEY>",
    "baseURL": "https://zenmux.ai/api/v1"
  }
}
```

::: warning 🔑 Important: Replace the API Key
Make sure you replace `sk-ss-v1-xxx` or `sk-ai-v1-xxx` in the configuration with your real ZenMux API key:

**Subscription API Key (recommended for personal development)**

- Format: `sk-ss-v1-xxx`
- Where to get it: [Subscription management page](https://zenmux.ai/platform/subscription)
- Detailed guide: [Subscription plan docs](/guide/subscription)

**Pay-as-you-go API Key (production environments)**

- Format: `sk-ai-v1-xxx`
- Where to get it: [Pay-as-you-go page](https://zenmux.ai/platform/pay-as-you-go)
- Detailed guide: [Pay-as-you-go docs](/guide/pay-as-you-go)
  :::

### Step 3: Switch to the ZenMux Provider

After adding it, click the switch button next to **ZenMux** in the provider list to route the current coding tool’s requests through ZenMux.

::: info Hot switching
CC-Switch supports hot switching providers—**no need to restart your terminal or coding tool**. After switching, new requests are immediately forwarded through ZenMux, and existing conversation context is not affected.
:::

### Step 4: Share configuration across apps (Optional)

If you use multiple coding tools, CC-Switch can sync the same provider configuration to all managed apps. This is especially convenient for an API gateway like ZenMux that supports multiple protocols:

1. Enable **Universal Provider** in the provider configuration
2. Set the default model mapping for each app
3. Save—this provider will be automatically synced to Claude Code, Codex, Gemini CLI, and OpenCode

## Supported Models

::: info Supported models for the Anthropic protocol
Models that support the Anthropic protocol are being onboarded in batches. You can filter currently supported models via the [official model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages) by selecting the Anthropic Messages protocol.

There are many more models available for the OpenAI protocol—see the [model list](https://zenmux.ai/models) and filter by "OpenAI API Compatible".
:::

## Troubleshooting

### Common Issues

::: details API key error or authentication failure
**Issue**: After configuring the provider, you see “Invalid API key” or “Unauthorized”

**Solution**:

1. **Check the API key format**:
   - Subscription API keys should start with `sk-ss-v1-`
   - Pay-as-you-go API keys should start with `sk-ai-v1-`
   - Ensure there are no extra spaces or newline characters

2. **Verify the API key is active**:
   - Subscription: visit the [Subscription management page](https://zenmux.ai/platform/subscription) to check subscription status and quota
   - Pay-as-you-go: visit the [Pay-as-you-go page](https://zenmux.ai/platform/pay-as-you-go) to ensure you have sufficient balance

3. **Confirm the Base URL is correct**:
   - Claude Code (Anthropic protocol): `https://zenmux.ai/api/anthropic`
   - Codex / OpenCode (OpenAI protocol): `https://zenmux.ai/api/v1`
   - Gemini CLI (Vertex AI protocol): `https://zenmux.ai/api/vertexai`
     :::

::: details macOS shows “Developer cannot be verified”
**Issue**: When opening CC-Switch for the first time, macOS shows “Developer cannot be verified”

**Solution**:

Because the developer has not yet obtained an Apple Developer signature, macOS blocks the first run.

1. Go to **System Settings** → **Privacy & Security**
2. Find the blocked CC-Switch message at the bottom
3. Click **Open Anyway**
4. In the confirmation dialog, click **Open**

This prompt will not appear on subsequent launches.
:::

::: details Coding tool does not respond after switching providers
**Issue**: After switching to ZenMux in CC-Switch, the coding tool’s requests don’t change

**Solution**:

1. Confirm CC-Switch is running (the system tray icon should be visible)
2. Check that the provider for the corresponding coding tool has been switched correctly in CC-Switch (the active provider is highlighted)
3. Send a new request in the coding tool and confirm it’s routed through ZenMux
4. If it still doesn’t work, restart the coding tool and test again
   :::

::: details Model does not support the Anthropic protocol
**Issue**: In Claude Code, a model reports that it does not support the Anthropic protocol

**Solution**:

- Use the [ZenMux model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages) and filter for "Anthropic API Compatible" to see currently supported models
- Ensure the model ID in your mapping is correct (e.g., `anthropic/claude-sonnet-4.5`, not `claude-sonnet-4.5`)
- Use a model from the supported list above
  :::

::: tip Contact Us
If you run into any issues or have suggestions or feedback, feel free to contact us via:

- **Official website**: <https://zenmux.ai>
- **Support email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business inquiries**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord community**: <http://discord.gg/vHZZzj84Bm>

For more contact options and details, visit our [Contact page](/help/contact).

For CC-Switch project issues, please report them via [CC-Switch GitHub Issues](https://github.com/farion1231/cc-switch/issues).
:::