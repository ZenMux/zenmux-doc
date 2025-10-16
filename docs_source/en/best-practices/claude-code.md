# Guide to Using Claude Code via ZenMux

Claude Code is Anthropic’s official coding agent. With its integration into ZenMux, you can choose from many more models, not just those available through the official Claude API.

::: info Compatibility Notes
ZenMux fully supports the Anthropic API protocol and can be seamlessly integrated into tools like Claude Code and Cursor. You only need to change two parameters to start using it.

Note: for the Anthropic protocol, base_url="https://zenmux.ai/api/anthropic".
:::

## Configuration

### Install Claude Code

::: code-group

```bash [npm/pnpm]
# Install with pnpm (recommended)
pnpm install -g @anthropic-ai/claude-code

# Or install with npm
npm install -g @anthropic-ai/claude-code
```

:::

### Configure Environment Variables

Set the following environment variables to use ZenMux with the Anthropic API format:

```bash
# Set ZenMux API base URL (Anthropic format)
export ANTHROPIC_BASE_URL="https://zenmux.ai/api/anthropic"   # [!code highlight]

# Set your ZenMux API key
export ANTHROPIC_AUTH_TOKEN="sk-ai-v1-xxx"  # [!code highlight]

# Specify the models to use (Claude series)
export ANTHROPIC_MODEL="anthropic/claude-sonnet-4.5"  # [!code highlight]
export ANTHROPIC_SMALL_FAST_MODEL="anthropic/claude-haiku-4.5"  # [!code highlight]

```

::: warning Important Configuration
Be sure to replace `sk-ai-v1-xxx` with your actual ZenMux API key. You can obtain an API key from the [ZenMux Console](https://zenmux.ai/settings/keys).
:::

### Start Using It

After configuring your environment variables, navigate to your project directory and start Claude Code:

```bash
# Go to your project directory
cd my-project

# Start Claude Code
claude  # [!code highlight]
```

::: tip Quick Setup
You can add the environment variables to your shell profile to avoid setting them manually each time:

```bash
# Add to your .bashrc or .zshrc file
export ANTHROPIC_BASE_URL="https://zenmux.ai/api/anthropic"
export ANTHROPIC_AUTH_TOKEN="sk-ai-v1-xxx"
export ANTHROPIC_MODEL="anthropic/claude-sonnet-4.5"
export ANTHROPIC_SMALL_FAST_MODEL="anthropic/claude-haiku-4.5"
```

:::

### Supported Models

::: info Anthropic Protocol Supported Models
Models that support the Anthropic protocol are being adapted in batches. You can view currently supported models by filtering for Anthropic API Compatible in the [official model list](https://zenmux.ai/models):
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/602FqX9/anthropic-support.png)
Alternatively, you can check the [model detail page](https://zenmux.ai/anthropic/claude-haiku-4.5):
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/I9JHS8b/detail-anthropic-support.png)
:::

Below is a list of recommended models with strong coding capabilities. For the full list of models compatible with the Anthropic protocol, use the methods described above.

| No. | Model slug                        |
| --- | --------------------------------- |
| 1   | `anthropic/claude-sonnet-4.5`    |
| 2   | `anthropic/claude-opus-4.1`      |
| 3   | `anthropic/claude-haiku-4.5`     |
| 4   | `google/gemini-2.5-pro`          |
| 5   | `openai/gpt-5-codex`             |
| 6   | `openai/gpt-5`                   |
| 7   | `x-ai/grok-4-fast`               |
| 8   | `x-ai/grok-code-fast-1`          |
| 9   | `x-ai/grok-4-fast-non-reasoning` |
| 10  | `deepseek/deepseek-chat`         |
| 11  | `qwen/qwen3-coder-plus`          |
| 12  | `moonshotai/kimi-k2-0905`        |
| 13  | `z-ai/glm-4.6`                   |
| 14  | `z-ai/glm-4.5-air`               |
| 15  | `inclusionai/ring-1t`            |
| 16  | `inclusionai/ling-1t`            |

For more models, refer to the Anthropic protocol support instructions above.

## Usage

Once configured, you can use ZenMux’s variety of models within Claude Code:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/GxOgGlh/claude-code-v2.png"
       alt="Claude Code"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

You can use the '/model' command to identify the currently selected model:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/MOGcIN5/claude-code-v2-model.png"
       alt="Claude Code Model"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

## Troubleshooting

### Common Issues

::: details API Key Error
**Issue**: API key invalid or unauthorized

**Solution**:

- Check whether the ZenMux API key in your environment variables is correct
- Confirm the API key is active and has sufficient balance
- Verify the API key format starts with `sk-ai-v1-`
  :::

::: details Model Not Compatible with the Anthropic Protocol
**Issue**: When using a model, you are told it does not support the Anthropic protocol

**Solution**:

- Filter for "Anthropic API Compatible" in the [ZenMux model list](https://zenmux.ai/models) to see currently supported models
- Or visit the specific model’s detail page to confirm Anthropic protocol support
- Choose a model from the supported list above
  :::

::: details Connection Failures
**Issue**: Claude Code cannot connect to the ZenMux service

**Solution**:

- Check that your network connection is normal
- Verify `ANTHROPIC_BASE_URL` is set correctly to `https://zenmux.ai/api/anthropic`
- Confirm your firewall settings are not blocking outbound connections
  :::

::: details Environment Variables Not Taking Effect
**Issue**: Model configuration remains inactive after setting environment variables

**Solution**:

- Reopen your terminal window, or run `source ~/.zshrc` or `source ~/.bashrc` to reload the profile
- Confirm the environment variables are set correctly with `echo $ANTHROPIC_MODEL`
  :::

::: details VSCode Claude Code Extension Configuration
**Issue**: Issues in GUI mode with the Claude Code VSCode extension

**Solution**:

You can adjust the model configuration directly in the VSCode extension settings, changing it to the model slugs configured in your profile. The operation is shown in the images below:

![VSCode Claude Code Extension Configuration](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/alNj8F2/cc-plugin-settings.png)
![VSCode Claude Code Extension Configuration](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/S7fuYF9/cc-plugin-model.png)
:::

## Advanced Configuration

### Configure Models of Different Scales

You can configure models of different scales based on your task requirements:

::: code-group

```bash [Balanced]
# Model choices balancing performance and cost
export ANTHROPIC_MODEL=anthropic/claude-sonnet-4.5
export ANTHROPIC_SMALL_FAST_MODEL=anthropic/claude-haiku-4.5
```

```bash [Performance-first]
# Model choices prioritizing performance
export ANTHROPIC_MODEL=anthropic/claude-opus-4.1
export ANTHROPIC_SMALL_FAST_MODEL=anthropic/claude-sonnet-4.5
```

```bash [Cost-optimized]
# Model choices prioritizing cost-effectiveness
export ANTHROPIC_MODEL=moonshotai/kimi-k2-0905
export ANTHROPIC_SMALL_FAST_MODEL=deepseek/deepseek-chat
```

:::

This approach helps you achieve the best balance of performance and cost across different usage scenarios.

::: info More Models
See the [ZenMux model list](https://zenmux.ai/models) for all available models and their details.
:::