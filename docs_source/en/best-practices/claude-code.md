# Guide: Using Claude Code CLI via ZenMux

::: info Compatibility Notes

Claude Code is Anthropic’s official coding agent. With ZenMux integration, you can access a broader range of models rather than being limited to Anthropic’s official Claude models.

For example, you can use GPT-5.2 series, Claude-4.5 series, Gemini-3 series, Grok 4.1 series, Doubao-Seed-Code, Kimi-K2, Minimax-M2, GLM-4.6, DeepSeek-V3.2, Qwen3-Coder-Plus, and more within Claude Code via ZenMux. For the full list of supported models, see the [Official Model List](https://zenmux.ai/models?sort=newest&supported_protocol=messages).

ZenMux fully supports the Anthropic API protocol and can be seamlessly integrated into tools like Claude Code and Cursor. You only need to modify two parameters.

Note: For the Anthropic protocol, use `base_url="https://zenmux.ai/api/anthropic"`.
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

#### How the Configuration Works

By default, Claude Code connects directly to Anthropic’s official service. By setting environment variables, you can redirect its requests to ZenMux. The benefits include:

- **No changes to Claude Code required**: switch endpoints using environment variables only
- **Authenticate with a ZenMux API Key**: instead of an Anthropic API Key
- **Access more model choices**: beyond Claude, you can use GPT, Gemini, Qwen, and many others

The core setup is to configure two key environment variables—`ANTHROPIC_BASE_URL` (the ZenMux service endpoint) and `ANTHROPIC_AUTH_TOKEN` (your ZenMux API Key)—so all Claude Code requests are forwarded through ZenMux.

::: warning Important change in v2.0.7x
Due to updates in Claude Code v2.0.7x, its **environment variable loading logic has changed**: the `env` configuration in `~/.claude/settings.json` **cannot be reliably read** in the following scenarios:

- When logging in to Claude Code **for the first time**
- When logging in again after running **logout**

Therefore, when connecting to ZenMux, we recommend configuring via **shell profile environment variables** to ensure both login and requests go through ZenMux’s Anthropic-compatible endpoint.
:::

### Step 1: Configure Shell Environment Variables (Recommended)

This step writes the ZenMux connection configuration into your shell config file so it is automatically applied each time you open a terminal.

**Steps:**

1. Determine which shell you’re using (typically bash or zsh):
   - If using bash, edit `~/.bashrc`
   - If using zsh, edit `~/.zshrc`
   - If you’re not sure, run `echo $SHELL`

2. **Append** the following to the end of the corresponding config file (remember to replace the API Key):

```bash
# ============= ZenMux + Claude Code Configuration =============
# Connect Claude Code to ZenMux instead of Anthropic’s official service

# Core configuration: ZenMux endpoint and authentication
export ANTHROPIC_BASE_URL="https://zenmux.ai/api/anthropic"  # ZenMux Anthropic-compatible endpoint
export ANTHROPIC_AUTH_TOKEN="sk-ai-v1-xxx"                   # Replace with your ZenMux API Key
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"          # Disable non-essential traffic

# Avoid conflicts: if you previously set ANTHROPIC_API_KEY locally, explicitly clear it
export ANTHROPIC_API_KEY=""

# Default model configuration (required): map Haiku / Sonnet / Opus speed tiers to actual models
export ANTHROPIC_DEFAULT_HAIKU_MODEL="anthropic/claude-haiku-4.5"   # Fast model
export ANTHROPIC_DEFAULT_SONNET_MODEL="anthropic/claude-sonnet-4.5" # Balanced model
export ANTHROPIC_DEFAULT_OPUS_MODEL="anthropic/claude-opus-4.5"     # High-power model
```

3. Apply the configuration (choose one):
   ```bash
   # Option 1: Reload the config file (recommended)
   source ~/.bashrc  # if using bash
   # or
   source ~/.zshrc   # if using zsh

   # Option 2: Restart your terminal window
   ```

::: warning Critical configuration
Make sure to replace `sk-ai-v1-xxx` with your real ZenMux API Key. You can get your API Key from the [ZenMux Console](https://zenmux.ai/settings/keys).
:::

::: tip Environment variable reference

| Variable | Purpose | Notes |
|----------|---------|-------|
| `ANTHROPIC_BASE_URL` | Service endpoint | Redirects Claude Code requests to ZenMux |
| `ANTHROPIC_AUTH_TOKEN` | Auth token | Your ZenMux API Key (get it in the [Console](https://zenmux.ai/settings/keys)) |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | Traffic control | Disables non-essential telemetry to improve privacy |
| `ANTHROPIC_API_KEY` | Conflict avoidance | Clear it to avoid conflicts with existing local Anthropic config |
| `ANTHROPIC_DEFAULT_*_MODEL` | Model mapping | Maps the Haiku/Sonnet/Opus tiers to specific models |
:::

### Step 2: Start Claude Code and Complete Authentication

After configuring environment variables, you can start Claude Code. On first launch, it will authenticate through ZenMux automatically.

**Steps:**

1. Open a **new** terminal window (to ensure environment variables are loaded)
2. Enter your project directory:
   ```bash
   cd /path/to/your/project
   ```
3. Start Claude Code:
   ```bash
   claude  # [!code highlight]
   ```
4. On first launch, Claude Code will:
   - Automatically read `ANTHROPIC_AUTH_TOKEN` from your environment
   - Authenticate via the ZenMux service specified by `ANTHROPIC_BASE_URL`
   - Require no additional login steps before you can start using it

::: tip Tip
If you see an error that the `claude` command cannot be found, confirm Claude Code is installed globally (see the install steps above).
:::

### Step 3: Verify Connection Status

After a successful launch, verify that Claude Code is correctly connected to ZenMux.

At the Claude Code prompt, run `/status` and confirm the configuration:

```text
> /status
Auth token: ANTHROPIC_AUTH_TOKEN  # [!code highlight]
Anthropic base URL: https://zenmux.ai/api/anthropic  # [!code highlight]
```

**Verification checklist:**
- ✅ `Auth token` should display `ANTHROPIC_AUTH_TOKEN` (meaning it’s being read from environment variables)
- ✅ `Anthropic base URL` should display `https://zenmux.ai/api/anthropic` (the ZenMux endpoint)

If it matches the above, your setup is complete. You can now use Claude Code via ZenMux.

## Switch / Set Default Models

You already configured default models in your shell profile (**required**). If you want to switch to other models, simply modify the same environment variables:

```bash
export ANTHROPIC_DEFAULT_HAIKU_MODEL="volcengine/doubao-seed-code"
export ANTHROPIC_DEFAULT_SONNET_MODEL="openai/gpt-5.2"
export ANTHROPIC_DEFAULT_OPUS_MODEL="google/gemini-3-pro-preview"
```

After editing, remember to run `source ~/.bashrc` / `source ~/.zshrc` or restart your terminal for the changes to take effect.

### Supported Models

::: info Supported models for the Anthropic protocol
Models that support the Anthropic protocol are being rolled out in batches. You can filter the currently supported models via the [Official Model List](https://zenmux.ai/models?sort=newest&supported_protocol=messages) by selecting the Anthropic Messages protocol:
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/602FqX9/anthropic-support.png)
Alternatively, you can check support on a model’s details page (example):
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/I9JHS8b/detail-anthropic-support.png)
:::

## What It Looks Like

After configuration, you can use various ZenMux models in Claude Code:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/GxOgGlh/claude-code-v2.png"
       alt="Claude Code"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

You can use the `/model` command to confirm which model is currently in use:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/MOGcIN5/claude-code-v2-model.png"
       alt="Claude Code Model"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

## Troubleshooting

### Common Issues

::: details API Key error
**Problem**: You see an “invalid API Key” or “unauthorized” message

**Solution**:

- Check whether the ZenMux API Key in your environment variables is correct
- Confirm the API Key is activated and has sufficient balance
- Verify the API Key format starts with `sk-ai-v1-`
  :::

::: details Model does not support the Anthropic protocol
**Problem**: You see a message saying the selected model does not support the Anthropic protocol

**Solution**:

- In the [ZenMux Model List](https://zenmux.ai/models), filter by "Anthropic API Compatible" to see currently supported models
- Or open the model’s details page to confirm whether it supports the Anthropic protocol
- Select a model from the supported list above
  :::

::: details Connection failure
**Problem**: Claude Code cannot connect to the ZenMux service

**Solution**:

- Check whether your network connection is working
- Verify `ANTHROPIC_BASE_URL` is correctly set to `https://zenmux.ai/api/anthropic`
- Confirm your firewall settings are not blocking outbound connections
  :::

::: details Config file not taking effect
**Problem**: You configured settings.json but it still does not take effect

**Solution**:

- Confirm the config file path is `~/.claude/settings.json`
- Check whether the JSON is valid (note: standard JSON does not support comments—remove any comments)
- Use `cat ~/.claude/settings.json` to verify the file contents
- Restart Claude Code to load the latest configuration
  :::

::: details VSCode Claude Code extension configuration
**Problem**: Issues in the Claude Code extension GUI mode in VSCode

**Solution**:

You can adjust Claude Code’s model configuration directly in the VSCode extension settings by changing it to the model slug used in your config. See the screenshots below for the exact steps:

![VSCode Claude Code extension configuration](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/alNj8F2/cc-plugin-settings.png)
![VSCode Claude Code extension configuration](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/S7fuYF9/cc-plugin-model.png)
:::

::: info More models
See the [ZenMux Model List](https://zenmux.ai/models) for all available models and detailed information.
:::

::: tip Contact Us
If you run into any issues during use, or if you have suggestions or feedback, feel free to contact us via:

- **Official website**: <https://zenmux.ai>
- **Technical support email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business inquiries**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord community**: <http://discord.gg/vHZZzj84Bm>

For more contact methods and details, please visit our [Contact page](/help/contact).
::ાયદ