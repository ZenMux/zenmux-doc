---
head:
  - - meta
    - name: description
      content: Guide to integrating Hermes Agent with ZenMux
  - - meta
    - name: keywords
      content: ZenMux, best practices, integration, Hermes, Hermes Agent, OpenAI, API, AI agent
---

# Hermes Agent Integration with ZenMux

Hermes Agent is a powerful AI agent framework with support for tool calling, browser automation, code execution, file operations, and more. By connecting it to ZenMux, you get unified access to the latest models from every major provider — no need to juggle separate API keys. One ZenMux API Key covers them all.

::: info Compatibility
ZenMux is fully compatible with the OpenAI API protocol, so it works out of the box with Hermes Agent's custom endpoint feature.

The OpenAI-compatible base URL is `https://zenmux.ai/api/v1`.
:::

## Prerequisites

- Operating system: Linux / macOS / WSL2 / Android (Termux)
- **Git** (the only dependency you need to install manually — the install script handles everything else)
- A ZenMux API Key (see [Step 0](#step-0-get-a-zenmux-api-key) below)

::: tip About Other Dependencies
The Hermes Agent one-line installer automatically detects and installs the following — **no manual setup required**:
- Python 3.11 (via the uv package manager, no sudo needed)
- Node.js v22 (for browser automation and the WhatsApp gateway)
- ripgrep (fast file search)
- ffmpeg (audio format conversion for voice features)
:::

## Step 0: Get a ZenMux API Key

Before configuring Hermes Agent, you need a ZenMux API Key. ZenMux offers two billing options:

::: code-group

```text [Subscription API Key (Recommended)]
Best for:   Personal development, learning, exploration
Highlights: Fixed monthly fee, predictable costs, 5–10× price leverage
Key format: sk-ss-v1-xxx

How to get one:
1. Visit the Subscription page: https://zenmux.ai/platform/subscription
2. Pick a plan (Pro $20/mo, Max $100/mo, Ultra $200/mo)
3. After subscribing, create a Subscription API Key on the page

For details, see the Subscription Plans guide:
https://docs.zenmux.ai/guide/subscription
```

```text [Pay-As-You-Go API Key]
Best for:   Production environments, commercial products, enterprise use
Highlights: No rate limits, production-grade reliability, usage-based billing
Key format: sk-ai-v1-xxx

How to get one:
1. Visit the Pay-As-You-Go page: https://zenmux.ai/platform/pay-as-you-go
2. Top up your account (top-ups include a 20% bonus credit)
3. Create an API Key in the "Pay-As-You-Go API Keys" section

For details, see the Pay-As-You-Go guide:
https://docs.zenmux.ai/guide/pay-as-you-go
```

:::

## Step 1: Install Hermes Agent

If Hermes Agent is already installed, skip ahead to [Step 2](#step-2-configure-the-zenmux-provider).

Run the one-line installer in your terminal (works on Linux / macOS / WSL2 / Android Termux):

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

After installation, reload your shell configuration:

```bash
source ~/.bashrc   # If you use zsh, run: source ~/.zshrc
```

::: tip Windows Users
Install [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) first, then run the command above inside a WSL2 terminal.
:::

For additional installation methods, see the [Hermes Agent official quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart).

## Step 2: Configure the ZenMux Provider

Run `hermes model` to open the provider selection screen:

```bash
hermes model
```

You'll see a provider list (↑↓ to navigate, ENTER to select):

```
Select provider:
  ↑↓ navigate  ENTER/SPACE select  ESC cancel

   (○) OpenRouter (100+ models, pay-per-use)
   (○) Anthropic (Claude models — API key or Claude Code)
   ...
   (○) Custom endpoint (enter URL manually)    ← Select this for first-time setup
   (○) Cancel
```

Choose **"Custom endpoint (enter URL manually)"** and fill in the prompts:

1. **API Base URL**: `https://zenmux.ai/api/v1`
2. **API Key**: Paste your ZenMux API Key (e.g., `sk-ss-v1-xxx`)
3. **Model name**: The model ID you want to use, e.g., `openai/gpt-5.2`

The wizard saves everything to `~/.hermes/config.yaml` automatically — no manual file editing needed.

::: warning About Model Names
Use the raw ZenMux model ID (e.g., `openai/gpt-5.2`). You do **not** need a `zenmux/` prefix — Hermes sends the name directly to the configured `base_url` endpoint.
:::

## Step 3: Verify the Configuration

Start Hermes Agent and send a quick test message to make sure the model responds:

```bash
hermes
```

```
Hello, please reply with just "Hi!"
```

If you get a response, the setup is complete.

## Step 4: Switch Models (Optional)

ZenMux supports many models, and you can switch between them at any time with `hermes model`.

```bash
hermes model
```

Once configured, the provider list will show a named ZenMux entry:

```
   ...
   (○) Zenmux.ai (zenmux.ai/api/v1) — openai/gpt-5.2
   (○) Custom endpoint (enter URL manually)
   ...
```

Select the **"Zenmux.ai"** entry to browse available models and pick a new one. The change is persisted and takes effect the next time you launch Hermes.

::: tip Model ID Examples
Some example model IDs on ZenMux:
- `openai/gpt-5.2` → GPT-5.2
- `anthropic/claude-sonnet-4.5` → Claude Sonnet 4.5
- `deepseek/deepseek-chat` → DeepSeek Chat
- `google/gemini-3-pro-preview` → Gemini 3 Pro

For the full list, see the [ZenMux Models page](https://zenmux.ai/models).
:::

## Using ZenMux Models

With configuration complete, you can use ZenMux models in several ways:

### Interactive CLI Chat

```bash
# Start an interactive Hermes Agent session (uses the configured default model)
hermes

# Ask questions directly in the conversation
> Explain quantum computing in simple terms
```

## Troubleshooting

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
   Select "Custom endpoint" again and confirm the URL is `https://zenmux.ai/api/v1`

2. **Check the current configuration**:
   ```bash
   hermes config
   ```
   Verify that `provider` is `custom` and `base_url` is `https://zenmux.ai/api/v1` in the `model` section

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
   - If you need a proxy, set `HTTPS_PROXY` in `~/.hermes/.env`

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

If you run into any issues or have suggestions and feedback, reach out through any of these channels:

::: tip Get Help

- **Website**: <https://zenmux.ai>
- **Technical Support**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business Inquiries**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord Community**: <http://discord.gg/vHZZzj84Bm>

For more contact options, visit our [Contact Us page](https://docs.zenmux.ai/help/contact).
:::
