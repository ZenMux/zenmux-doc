# Claude Code CLI Guide with ZenMux

Claude Code is Anthropic’s official coding agent. With ZenMux integration, you can use a broader range of models instead of being limited to Anthropic’s official Claude models.

For example, via ZenMux you can use models such as the GPT-5.2 series, Claude-4.5 series, Gemini-3 series, Grok 4.1 series, Doubao-Seed-Code, Kimi-K2, Minimax-M2, GLM-4.6, DeepSeek-V3.2, Qwen3-Coder-Plus, and more in Claude Code. For the full list of supported models, see the [official model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages).

::: info Compatibility
ZenMux fully supports the Anthropic API protocol and can be seamlessly integrated into tools like Claude Code and Cursor. You only need to change two parameters.

Note that the Anthropic protocol base_url is `https://zenmux.ai/api/anthropic`.
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

### Configure Claude Code

::: warning Important changes in v2.0.7x
Due to updates in Claude Code v2.0.7x, its **environment variable loading logic has changed**: the `env` configuration in `~/.claude/settings.json` **cannot be reliably read** in the following scenarios:

- When you **log in** to Claude Code for the first time
- When you log in again after running **logout**

Therefore, when connecting to ZenMux, we recommend consistently configuring via **shell profile environment variables** to ensure that both login and requests go through ZenMux’s Anthropic-compatible endpoint.
:::

### Step 1: Add environment variables to your shell profile (recommended)

Append the following to `~/.bashrc` or `~/.zshrc` (choose the one for your shell):

```bash
# Set these in your shell (e.g., ~/.bashrc, ~/.zshrc)
export ANTHROPIC_BASE_URL="https://zenmux.ai/api/anthropic"
export ANTHROPIC_AUTH_TOKEN="sk-ai-v1-xxx"
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"

# Important: If ANTHROPIC_API_KEY was previously set on your machine, we recommend explicitly emptying it to avoid conflicts
export ANTHROPIC_API_KEY=""

# Default models (required): correspond to Haiku / Sonnet / Opus tiers respectively
export ANTHROPIC_DEFAULT_HAIKU_MODEL="anthropic/claude-haiku-4.5"
export ANTHROPIC_DEFAULT_SONNET_MODEL="anthropic/claude-sonnet-4.5"
export ANTHROPIC_DEFAULT_OPUS_MODEL="anthropic/claude-opus-4.5"
```

After saving, run `source ~/.bashrc` or `source ~/.zshrc` to apply changes, or simply restart your terminal.

::: warning Critical configuration
Make sure to replace `sk-ai-v1-xxx` with your real ZenMux API Key. You can obtain your API Key from the [ZenMux Console](https://zenmux.ai/settings/keys).
:::

::: tip Variable reference

- `ANTHROPIC_BASE_URL`: ZenMux Anthropic API endpoint (overrides Claude Code’s login/request endpoint)
- `ANTHROPIC_AUTH_TOKEN`: Your ZenMux API Key
- `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`: Disable non-essential traffic
- `ANTHROPIC_API_KEY`: Recommended to explicitly set to empty to prevent Claude Code from using any existing local Anthropic configuration
:::

### Step 2: Start Claude Code

Enter your project directory and start Claude Code:

```bash
cd my-project
claude  # [!code highlight]
```

### Step 3: Verify the connection

Run `/status` in Claude Code and confirm the base URL points to ZenMux:

```text
> /status
Auth token: ANTHROPIC_AUTH_TOKEN
Anthropic base URL: https://zenmux.ai/api/anthropic
```

## Switching / specifying default models

Above, we configured default models in the shell profile (**required**). If you want to switch to other models, simply modify the same set of environment variables:

```bash
export ANTHROPIC_DEFAULT_HAIKU_MODEL="anthropic/claude-haiku-4.5"
export ANTHROPIC_DEFAULT_SONNET_MODEL="anthropic/claude-sonnet-4.5"
export ANTHROPIC_DEFAULT_OPUS_MODEL="anthropic/claude-opus-4.5"
```

After updating, remember to run `source ~/.bashrc` / `source ~/.zshrc` or restart the terminal for changes to take effect.

### Supported models

::: info Notes on models supported by the Anthropic protocol
Models that support the Anthropic protocol are being adapted in batches. You can filter the currently supported models via the [official model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages) by selecting the Anthropic Messages protocol:
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/602FqX9/anthropic-support.png)
You can also check the [model detail page](https://zenmux.ai/anthropic/claude-haiku-4.5):
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/I9JHS8b/detail-anthropic-support.png)
:::

## What it looks like

After configuration, you can use a variety of ZenMux models in Claude Code:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/GxOgGlh/claude-code-v2.png"
       alt="Claude Code"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

You can use the '/model' command to determine the current model in use:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/MOGcIN5/claude-code-v2-model.png"
       alt="Claude Code Model"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

## Troubleshooting

### Common issues

::: details API Key error
**Issue**: It says the API Key is invalid or unauthorized

**Solution**:

- Check whether the ZenMux API Key in your environment variables is correct
- Confirm the API Key is activated and has sufficient balance
- Verify the API Key format starts with `sk-ai-v1-`
  :::

::: details Model does not support the Anthropic protocol
**Issue**: When using a model, it indicates the Anthropic protocol is not supported

**Solution**:

- In the [ZenMux model list](https://zenmux.ai/models), filter by "Anthropic API Compatible" to view currently supported models
- Or visit the model detail page to confirm whether it supports the Anthropic protocol
- Use a model from the supported list above
  :::

::: details Connection failure
**Issue**: Claude Code cannot connect to the ZenMux service

**Solution**:

- Check whether your network connection is working
- Verify `ANTHROPIC_BASE_URL` is correctly set to `https://zenmux.ai/api/anthropic`
- Confirm firewall settings are not blocking outbound connections
  :::

::: details Configuration file not taking effect
**Issue**: settings.json is configured, but it still doesn’t take effect

**Solution**:

- Confirm the configuration file path is `~/.claude/settings.json`
- Check that the JSON format is valid (note that standard JSON does not support comments—remove them if present)
- Use `cat ~/.claude/settings.json` to verify the file contents
- Restart Claude Code to load the latest configuration
  :::

::: details VSCode Claude Code extension configuration
**Issue**: Issues when using the Claude Code extension in VSCode (GUI mode)

**Solution**:

You can adjust Claude Code’s model configuration directly in the VSCode extension settings by changing it to the model slug specified in your configuration file. See the screenshots below:

![VSCode Claude Code extension configuration](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/alNj8F2/cc-plugin-settings.png)
![VSCode Claude Code extension configuration](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/S7fuYF9/cc-plugin-model.png)
:::

## Advanced configuration

### Configure models of different sizes

You can configure models of different sizes in `~/.claude/settings.json` based on your task requirements:

::: code-group

```json [Balanced configuration]
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-ai-v1-xxx",
    "ANTHROPIC_BASE_URL": "https://zenmux.ai/api/anthropic",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "anthropic/claude-haiku-4.5",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "anthropic/claude-sonnet-4.5",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "anthropic/claude-opus-4.5"
  }
}
```

```json [Performance-first configuration]
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-ai-v1-xxx",
    "ANTHROPIC_BASE_URL": "https://zenmux.ai/api/anthropic",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "anthropic/claude-sonnet-4.5",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "anthropic/claude-opus-4.5",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "google/gemini-2.5-pro"
  }
}
```

```json [Cost-optimized configuration]
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-ai-v1-xxx",
    "ANTHROPIC_BASE_URL": "https://zenmux.ai/api/anthropic",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek/deepseek-chat",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "moonshotai/kimi-k2-0905",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "qwen/qwen3-coder-plus"
  }
}
```

:::

With this approach, you can achieve the best balance of performance and cost across different usage scenarios.

::: info More models
See the [ZenMux model list](https://zenmux.ai/models) for all available models and detailed information.
:::

::: tip Contact us
If you encounter any issues during use, or have any suggestions or feedback, feel free to contact us via:

- **Official website**: <https://zenmux.ai>
- **Technical support email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business inquiries**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord community**: <http://discord.gg/vHZZzj84Bm>

For more contact methods and details, please visit our [Contact Us page](/help/contact).
:::
