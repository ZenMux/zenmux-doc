---
head:
  - - meta
    - name: description
      content: Guide to Using OpenClaw with ZenMux
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, openclaw, moltbot, OpenAI, API, messaging, gateway
---

# Guide to Using OpenClaw with ZenMux

OpenClaw (formerly Moltbot, originally Clawdbot) is a powerful AI messaging gateway that connects multiple messaging platforms (WhatsApp, Telegram, Discord, Slack, Signal, iMessage, and more) to AI models. By integrating with ZenMux, you can access a wide range of models including GPT-5.2, Claude-4.5, Gemini-3, DeepSeek, and more.

::: info Compatibility Note
ZenMux fully supports the OpenAI API protocol and can be used with OpenClaw through simple configuration.

Note that the OpenAI protocol base_url is `https://zenmux.ai/api/v1`.
:::

## Prerequisites

- Node.js 22 or later
- A ZenMux API Key (see [Step 0](#step-0-get-a-zenmux-api-key) below)

## Integration Methods

There are two ways to use ZenMux with OpenClaw:

| Method | Best For | Complexity |
| ------ | -------- | ---------- |
| [Method 1: Use the ZenMux PR](#method-1-use-the-zenmux-pr) | Full ZenMux integration with auto-discovery | Easy |
| [Method 2: Manual Configuration](#method-2-manual-configuration) | Stable releases, custom setups | Moderate |

## Step 0: Get a ZenMux API Key

Before configuring OpenClaw, you need a ZenMux API Key. ZenMux offers two billing options:

::: code-group

```text [Subscription API Key (Recommended)]
Best for: personal development, learning/exploration
Features: fixed monthly fee, predictable cost, 5-10x price leverage
API Key format: sk-ss-v1-xxx

How to get it:
1. Visit the subscription management page: https://zenmux.ai/platform/subscription
2. Choose a plan (Pro $20/month, Max $100/month, Ultra $200/month)
3. After subscribing, create a subscription API Key on the page

For details, see: Subscription Plan Guide
https://docs.zenmux.ai/guide/subscription
```

```text [Pay-as-you-go API Key]
Best for: production environments, commercial products, enterprise apps
Features: no rate limits, production-grade stability, billed by actual usage
API Key format: sk-ai-v1-xxx

How to get it:
1. Visit the pay-as-you-go page: https://zenmux.ai/platform/pay-as-you-go
2. Top up your account (top-ups automatically include a 20% bonus credit)
3. Create an API Key in the "Pay As You Go API Keys" section

For details, see: Pay-as-you-go Guide
https://docs.zenmux.ai/guide/pay-as-you-go
```

:::

## Method 1: Use the ZenMux PR

The easiest way to use ZenMux with OpenClaw is to use the pending [ZenMux integration PR #3305](https://github.com/openclaw/openclaw/pull/3305), which provides full auto-discovery of ZenMux models.

### Step 1: Clone and Checkout the PR

```bash
# Clone the OpenClaw repository
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# Checkout PR #3305 (ZenMux integration)
git fetch origin pull/3305/head:zenmux-integration
git checkout zenmux-integration

# Install dependencies
pnpm install

# Build the project
pnpm build
```

### Step 2: Run Onboarding with ZenMux

Run the onboarding wizard and select ZenMux as your auth provider:

```bash
pnpm openclaw onboard --auth-choice zenmux-api-key
```

Follow the prompts to enter your ZenMux API Key. The wizard will automatically:
- Configure the ZenMux provider
- Discover available models from the ZenMux API
- Set a default model for you

### Step 3: Verify the Setup

List the available models to verify the configuration:

```bash
pnpm openclaw models list
```

You should see ZenMux models listed with the `zenmux/` prefix, such as:
- `zenmux/deepseek/deepseek-chat`
- `zenmux/openai/gpt-5.2`
- `zenmux/google/gemini-3-pro-preview`
- `zenmux/anthropic/claude-sonnet-4.5`

### Step 4: Test the Integration

Send a test message to verify everything works:

```bash
pnpm openclaw agent --local --agent main --message "Hello, respond with just 'Hi!'"
```

## Method 2: Manual Configuration

If you prefer to use a stable release of OpenClaw or want more control over the configuration, you can manually configure ZenMux as an explicit provider in your `openclaw.json` config file.

### Step 1: Install OpenClaw

Install OpenClaw globally via npm:

```bash
npm install -g openclaw@latest
```

Or run the onboarding wizard to set up OpenClaw:

```bash
openclaw onboard --install-daemon
```

### Step 2: Configure ZenMux Provider

Add the ZenMux provider configuration to your `~/.openclaw/openclaw.json` file:

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "zenmux": {
        "baseUrl": "https://zenmux.ai/api/v1",
        "apiKey": "sk-ss-v1-your-api-key-here",
        "api": "openai-completions",
        "models": [
          {
            "id": "deepseek/deepseek-chat",
            "name": "DeepSeek Chat via ZenMux",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 64000,
            "maxTokens": 8192
          },
          {
            "id": "openai/gpt-5.2",
            "name": "GPT-5.2 via ZenMux",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 200000,
            "maxTokens": 8192
          },
          {
            "id": "google/gemini-3-pro-preview",
            "name": "Gemini 3 Pro via ZenMux",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 200000,
            "maxTokens": 8192
          },
          {
            "id": "anthropic/claude-sonnet-4.5",
            "name": "Claude Sonnet 4.5 via ZenMux",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 200000,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "zenmux/openai/gpt-5.2"
      },
      "models": {
        "zenmux/deepseek/deepseek-chat": {},
        "zenmux/openai/gpt-5.2": {},
        "zenmux/google/gemini-3-pro-preview": {},
        "zenmux/anthropic/claude-sonnet-4.5": {}
      }
    }
  }
}
```

::: warning Important
Replace `sk-ss-v1-your-api-key-here` with your actual ZenMux API Key.
:::

### Step 3: Add More Models (Optional)

You can add more models to the `models` array. Check the [ZenMux model list](https://zenmux.ai/models) for available models and their capabilities.

Each model definition requires:

| Field | Description |
| ----- | ----------- |
| `id` | The model ID as shown in ZenMux (e.g., `openai/gpt-5.2`) |
| `name` | A display name for the model |
| `reasoning` | Whether the model supports reasoning mode |
| `input` | Input types: `["text"]` or `["text", "image"]` |
| `cost` | Cost configuration (set to 0 for subscription plans) |
| `contextWindow` | Maximum context window size in tokens |
| `maxTokens` | Maximum output tokens |

### Step 4: Verify the Configuration

List the available models:

```bash
openclaw models list
```

You should see your configured ZenMux models:

```
Model                                      Input      Ctx      Local Auth  Tags
zenmux/deepseek/deepseek-chat              text       63k      no    yes   configured
zenmux/openai/gpt-5.2                      text+image 195k     no    yes   default,configured
zenmux/google/gemini-3-pro-preview         text+image 195k     no    yes   configured
zenmux/anthropic/claude-sonnet-4.5         text+image 195k     no    yes   configured
```

### Step 5: Set the Default Model

Set your preferred default model:

```bash
openclaw models set zenmux/openai/gpt-5.2
```

## Using ZenMux Models

Once configured, you can use ZenMux models in various ways:

### Via CLI Agent

```bash
# Run a quick agent command
openclaw agent --local --agent main --message "Explain quantum computing in simple terms"
```

### Via Messaging Channels

Configure your messaging channels (WhatsApp, Telegram, Discord, etc.) and the gateway will automatically use your configured ZenMux model:

```bash
# Start the gateway
openclaw gateway run

# Check channel status
openclaw channels status
```

### Switching Models

You can switch models at any time:

```bash
# Set a different default model
openclaw models set zenmux/anthropic/claude-sonnet-4.5

# Or specify a model inline (Method 1 only)
openclaw agent --local --agent main --model zenmux/deepseek/deepseek-chat --message "Hello"
```

## Troubleshooting

### Common Issues

::: details API Key Error or Authentication Failure
**Issue**: You see an error indicating the API Key is invalid or unauthorized

**Solutions**:

1. **Check the API Key format**:
   - Subscription API Keys should start with `sk-ss-v1-`
   - Pay-as-you-go API Keys should start with `sk-ai-v1-`
   - Make sure there are no extra spaces or newlines

2. **Validate the API Key**:
   - Subscription: visit the [Subscription management page](https://zenmux.ai/platform/subscription) to check subscription status and quotas
   - Pay-as-you-go: visit the [Pay-as-you-go page](https://zenmux.ai/platform/pay-as-you-go) to ensure you have sufficient balance

3. **Check config file syntax**:
   - Ensure the JSON is valid (no trailing commas, proper quoting)
   - Verify the API key is correctly placed in the `apiKey` field
:::

::: details Model Not Found
**Issue**: OpenClaw reports that the model cannot be found

**Solutions**:

1. **For Method 1 (PR branch)**:
   - Ensure you're on the `zenmux-integration` branch (checked out from PR #3305)
   - Run `pnpm build` after pulling the latest changes

2. **For Method 2 (Manual config)**:
   - Verify the model is defined in `models.providers.zenmux.models`
   - Check that the model ID matches exactly (case-sensitive)
   - Add the model to `agents.defaults.models` as well
:::

::: details Connection Failure
**Issue**: OpenClaw cannot connect to ZenMux

**Solutions**:

- Check that your network connection is working
- Verify `baseUrl` is set to `https://zenmux.ai/api/v1`
- Ensure your firewall is not blocking outbound HTTPS connections
- Try running `curl https://zenmux.ai/api/v1/models` to test connectivity
:::

::: details Cached Models Showing
**Issue**: Old models are still showing after config changes

**Solutions**:

1. Kill any running gateway process:
   ```bash
   pkill -9 -f openclaw-gateway
   ```

2. Rebuild the project (if using Method 1):
   ```bash
   pnpm build
   ```

3. List models again:
   ```bash
   openclaw models list
   ```
:::

## Supported Models

ZenMux provides access to a wide range of models. Here are some popular options for OpenClaw:

| Model | ID | Best For |
| ----- | -- | -------- |
| GPT-5.2 | `openai/gpt-5.2` | General purpose, coding |
| Claude Sonnet 4.5 | `anthropic/claude-sonnet-4.5` | Balanced performance |
| Claude Opus 4.5 | `anthropic/claude-opus-4.5` | Complex reasoning |
| Gemini 3 Pro | `google/gemini-3-pro-preview` | Multimodal tasks |
| DeepSeek Chat | `deepseek/deepseek-chat` | Cost-effective coding |
| Qwen3 Coder | `alibaba/qwen3-coder-plus` | Code generation |

For the full list of supported models, visit the [ZenMux model list](https://zenmux.ai/models).

## Contact Us

If you encounter any issues during use, or have suggestions and feedback, please contact us through the following channels:

::: tip Get Help

- **Official Website**: <https://zenmux.ai>
- **Technical Support Email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business Cooperation Email**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord Community**: <http://discord.gg/vHZZzj84Bm>

For more contacts and details, visit our [Contact Us page](/help/contact).
:::
