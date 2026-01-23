# Using Claude Code CLI via ZenMux: A Guide

::: info Compatibility Notes

Claude Code is Anthropic’s official coding agent. With ZenMux integration, you can use a wider range of models instead of being limited to Anthropic’s Claude models.

For example, via ZenMux you can use the GPT-5.2 series, Claude-4.5 series, Gemini-3 series, Grok 4.1 series, Doubao-Seed-Code, Kimi-K2, Minimax-M2, GLM-4.6, DeepSeek-V3.2, Qwen3-Coder-Plus, and more in Claude Code. For the full list of supported models, see the [official model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages).

ZenMux fully supports the Anthropic API protocol and can be seamlessly integrated into tools like Claude Code and Cursor. You only need to change two parameters.

Note: the Anthropic-compatible base_url is `"https://zenmux.ai/api/anthropic"`.
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

#### How the configuration works

By default, Claude Code connects directly to Anthropic’s official service. By setting environment variables, you can redirect requests to ZenMux instead. This has several benefits:

- **No need to modify Claude Code itself**: switch endpoints using only environment variables
- **Authenticate with a ZenMux API Key**: replaces the official Anthropic API Key
- **Access more model options**: in addition to Claude, you can use GPT, Gemini, Qwen, and more

The core configuration is to set two key environment variables: `ANTHROPIC_BASE_URL` (the ZenMux endpoint) and `ANTHROPIC_AUTH_TOKEN` (your ZenMux API Key), so that all Claude Code requests are proxied through ZenMux.

::: warning Important change in v2.0.7x
Due to updates in Claude Code v2.0.7x, its **environment variable loading logic has changed**: the `env` configuration in `~/.claude/settings.json` **cannot be reliably read** in the following scenarios:

- When you **log in for the first time** in Claude Code
- When you log in again after running **logout**

Therefore, when connecting to ZenMux, we recommend using **shell profile environment variables** for a consistent setup, ensuring both login and requests go through ZenMux’s Anthropic-compatible endpoint.
:::

### Step 0: Get a ZenMux API Key

Before configuring Claude Code, you need to obtain a ZenMux API Key. ZenMux provides two billing options—choose based on your use case:

::: code-group

```text [Subscription API Key (Recommended)]
✅ Best for: personal development, learning/exploration, Vibe Coding
✅ Features: fixed monthly fee, predictable costs, 5–10x pricing leverage
✅ API Key format: sk-ss-v1-xxx

How to get it:
1. Visit the subscription management page: https://zenmux.ai/platform/subscription
2. Choose a plan (Pro $20/month, Max $100/month, Ultra $200/month)
3. After subscribing, create a Subscription API Key on the page

For details, see: Subscription Plan Guide
📚 https://docs.zenmux.ai/zh/guide/subscription
```

```text [Pay-as-you-go API Key]
✅ Best for: production, commercial products, enterprise applications
✅ Features: no rate limits, production-grade stability, billed by actual usage
✅ API Key format: sk-ai-v1-xxx

How to get it:
1. Visit the pay-as-you-go page: https://zenmux.ai/platform/pay-as-you-go
2. Top up your account (top-ups automatically include a 20% bonus credit)
3. Create an API Key in the "Pay As You Go API Keys" section

For details, see: Pay-as-you-go Guide
📚 https://docs.zenmux.ai/zh/guide/pay-as-you-go
```

:::

::: warning 💡 Important: Choose the correct API Key type

- **Personal development/learning** → use a **Subscription API Key** (`sk-ss-v1-xxx`) for lower cost and better value
- **Production/commercial projects** → use a **Pay-as-you-go API Key** (`sk-ai-v1-xxx`) for higher stability and no limits

Subscription keys must not be used in production. Violations may result in account restrictions.
:::

### Step 1: Configure shell environment variables (recommended)

This step writes the ZenMux connection settings into your shell config file so they take effect automatically each time you open a terminal.

::: code-group

```bash [macOS/Linux]
# ============== Steps ==============

# 1. Identify which shell you use (usually bash or zsh):
#    - If bash, edit ~/.bashrc
#    - If zsh, edit ~/.zshrc
#    - If unsure, run echo $SHELL

# 2. Append the following to the end of the corresponding config file (replace the API Key)

# ============= ZenMux + Claude Code Configuration =============
# Point Claude Code to ZenMux instead of Anthropic's official service

# Core settings: ZenMux endpoint and authentication
export ANTHROPIC_BASE_URL="https://zenmux.ai/api/anthropic"  # ZenMux Anthropic-compatible endpoint
export ANTHROPIC_AUTH_TOKEN="sk-ss-v1-xxx"                   # Replace with your ZenMux API Key (subscription sk-ss-v1-xxx or pay-as-you-go sk-ai-v1-xxx)
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"          # Disable non-essential traffic

# Avoid conflicts: if ANTHROPIC_API_KEY was previously set on your machine, explicitly clear it
export ANTHROPIC_API_KEY=""

# Default model configuration (required): map Haiku / Sonnet / Opus tiers to specific models
export ANTHROPIC_DEFAULT_HAIKU_MODEL="anthropic/claude-haiku-4.5"   # Fast model
export ANTHROPIC_DEFAULT_SONNET_MODEL="anthropic/claude-sonnet-4.5" # Balanced model
export ANTHROPIC_DEFAULT_OPUS_MODEL="anthropic/claude-opus-4.5"     # Most capable model

# 3. Apply the configuration (choose one):
# Option 1: reload the config file (recommended)
source ~/.bashrc  # if using bash
# or
source ~/.zshrc   # if using zsh

# Option 2: restart your terminal window
```

```powershell [Windows PowerShell]
# ============== Steps ==============

# On Windows, use the PowerShell Profile to set environment variables
# PowerShell 7+ is recommended for a better experience

# 1. Check whether the PowerShell Profile exists
Test-Path $PROFILE

# 2. If it returns False, create the Profile file
if (!(Test-Path $PROFILE)) {
    New-Item -Path $PROFILE -ItemType File -Force
}

# 3. Open the Profile file for editing
notepad $PROFILE
# If you use VSCode, you can also use: code $PROFILE

# 4. Append the following to the end of the Profile file (replace the API Key)

# ============= ZenMux + Claude Code Configuration =============
# Point Claude Code to ZenMux instead of Anthropic's official service

# Core settings: ZenMux endpoint and authentication
$env:ANTHROPIC_BASE_URL = "https://zenmux.ai/api/anthropic"  # ZenMux Anthropic-compatible endpoint
$env:ANTHROPIC_AUTH_TOKEN = "sk-ss-v1-xxx"                   # Replace with your ZenMux API Key (subscription sk-ss-v1-xxx or pay-as-you-go sk-ai-v1-xxx)
$env:CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = "1"          # Disable non-essential traffic

# Avoid conflicts: if ANTHROPIC_API_KEY was previously set on your machine, explicitly clear it
$env:ANTHROPIC_API_KEY = ""

# Default model configuration (required): map Haiku / Sonnet / Opus tiers to specific models
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "anthropic/claude-haiku-4.5"   # Fast model
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "anthropic/claude-sonnet-4.5" # Balanced model
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "anthropic/claude-opus-4.5"     # Most capable model

# 5. Save the file, then restart PowerShell for changes to take effect
# Or run in the current session: . $PROFILE

# 6. Verify that the environment variables are set
Write-Host "ANTHROPIC_BASE_URL: $env:ANTHROPIC_BASE_URL"
Write-Host "ANTHROPIC_AUTH_TOKEN: $env:ANTHROPIC_AUTH_TOKEN"
```

:::

::: warning 🔑 Important: Replace the API Key

Be sure to replace `sk-ss-v1-xxx` or `sk-ai-v1-xxx` with your real ZenMux API Key:

**Subscription API Key (recommended for personal development)**

- Format: `sk-ss-v1-xxx`
- Where to get it: [Subscription management page](https://zenmux.ai/platform/subscription)
- Detailed guide: [Subscription plan docs](/guide/subscription)

**Pay-as-you-go API Key (for production)**

- Format: `sk-ai-v1-xxx`
- Where to get it: [Pay-as-you-go page](https://zenmux.ai/platform/pay-as-you-go)
- Detailed guide: [Pay-as-you-go docs](/guide/pay-as-you-go)
:::

::: tip 📋 Environment variable reference

| Variable | Purpose | Notes |
|--------|------|------|
| `ANTHROPIC_BASE_URL` | Service endpoint | Redirects Claude Code requests to ZenMux |
| `ANTHROPIC_AUTH_TOKEN` | Auth token | Your ZenMux API Key (subscription or pay-as-you-go) |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | Traffic control | Disables non-essential telemetry for better privacy |
| `ANTHROPIC_API_KEY` | Conflict avoidance | Clear it to prevent conflicts with existing local Anthropic settings |
| `ANTHROPIC_DEFAULT_*_MODEL` | Model mapping | Maps Haiku/Sonnet/Opus tiers to actual models |
:::

### Step 2: Start Claude Code and complete authentication

After configuring the environment variables, you can start Claude Code. On first launch, it will authenticate automatically through ZenMux.

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
   - Automatically read `ANTHROPIC_AUTH_TOKEN` from the environment
   - Authenticate via the ZenMux service specified by `ANTHROPIC_BASE_URL`
   - Let you start using it without any additional login steps

::: tip Tip
If you see an error saying the `claude` command cannot be found, confirm that Claude Code has been installed globally (see the installation steps above).
:::

### Step 3: Verify the connection status

After a successful start, it’s recommended to verify that Claude Code is correctly connected to ZenMux.

At the Claude Code prompt, run `/status` to verify the configuration:

```text
> /status
Auth token: ANTHROPIC_AUTH_TOKEN  # [!code highlight]
Anthropic base URL: https://zenmux.ai/api/anthropic  # [!code highlight]
```

**What to check:**

- ✅ `Auth token` should display `ANTHROPIC_AUTH_TOKEN` (meaning it was read from the environment)
- ✅ `Anthropic base URL` should display `https://zenmux.ai/api/anthropic` (the ZenMux endpoint)

If everything matches the above, your setup is complete—you can now use Claude Code via ZenMux.

## Change/specify the default model

You’ve already configured default models in your shell profile above (**this is required**). If you want to switch to other models, simply update the same environment variables:

```bash
export ANTHROPIC_DEFAULT_HAIKU_MODEL="volcengine/doubao-seed-code"
export ANTHROPIC_DEFAULT_SONNET_MODEL="openai/gpt-5.2"
export ANTHROPIC_DEFAULT_OPUS_MODEL="google/gemini-3-pro-preview"
```

After updating, remember to run `source ~/.bashrc` / `source ~/.zshrc` or restart your terminal for the changes to take effect.

### Supported models

::: info Notes on models supported via the Anthropic protocol
Models compatible with the Anthropic protocol are being adapted in batches. You can filter the currently supported models in the [official model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages) by selecting the Anthropic Messages protocol:
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/602FqX9/anthropic-support.png)
You can also check support on a specific model page, for example:
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

You can use the `/model` command to confirm which model is currently in use:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/MOGcIN5/claude-code-v2-model.png"
       alt="Claude Code Model"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

## Troubleshooting

### Common issues

::: details API Key error or authentication failure
**Issue**: You see “invalid API key”, “unauthorized”, or authentication failed.

**Solution**:

1. **Check the API Key format**:
   - Subscription keys should start with `sk-ss-v1-`
   - Pay-as-you-go keys should start with `sk-ai-v1-`
   - Make sure there are no extra spaces or line breaks

2. **Verify the API Key is valid**:
   - Subscription: visit the [subscription management page](https://zenmux.ai/platform/subscription) to check subscription status and quotas
   - Pay-as-you-go: visit the [pay-as-you-go page](https://zenmux.ai/platform/pay-as-you-go) to ensure your balance is sufficient

3. **Confirm environment variables are loaded**:

   ```bash
   # macOS/Linux
   echo $ANTHROPIC_AUTH_TOKEN

   # Windows PowerShell
   echo $env:ANTHROPIC_AUTH_TOKEN
   ```

   If the output is empty, the variables weren’t loaded correctly—run `source ~/.zshrc` again or restart your terminal.

4. **Check the API Key status**:
   - Ensure the API Key shows as "Enabled" in the console
   - Confirm it hasn’t been deleted or disabled

5. **Get a new API Key**:
   - [Subscription API Key guide](/guide/subscription#step-3-manage-your-subscription-and-get-an-api-key)
   - [Pay-as-you-go API Key guide](/guide/pay-as-you-go#create-and-manage-api-keys)
  :::

::: details The model does not support the Anthropic protocol
**Issue**: When using a model, you’re told it doesn’t support the Anthropic protocol.

**Solution**:

- In the [ZenMux model list](https://zenmux.ai/models), filter for "Anthropic API Compatible" to see currently supported models
- Or open the model’s detail page to confirm Anthropic protocol support
- Use a model from the supported list
  :::

::: details Connection failure
**Issue**: Claude Code can’t connect to the ZenMux service.

**Solution**:

- Check whether your network connection is working
- Verify that `ANTHROPIC_BASE_URL` is correctly set to `https://zenmux.ai/api/anthropic`
- Confirm your firewall isn’t blocking outbound connections
  :::

::: details VSCode Claude Code plugin configuration
**Issue**: You run into issues in the VSCode Claude Code plugin GUI mode.

**Solution**:

You can adjust Claude Code’s model configuration directly in the VSCode plugin settings by changing it to the model slug you configured in your config file. See the screenshots below:

![VSCode Claude Code Plugin Configuration](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/alNj8F2/cc-plugin-settings.png)
![VSCode Claude Code Plugin Model](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/S7fuYF9/cc-plugin-model.png)
:::

::: details Windows PowerShell script execution policy
**Issue**: PowerShell says: "Cannot load file xxx because running scripts is disabled on this system."

**Solution**:

This is a Windows PowerShell security mechanism. You need to change the execution policy:

1. Run PowerShell **as Administrator**
2. Execute:

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. Enter `Y` to confirm
4. Reopen your PowerShell window

**Execution policy notes**:

- `Restricted` (default): no scripts are allowed
- `RemoteSigned`: local scripts can run; downloaded scripts require a digital signature
- `Unrestricted`: allows all scripts (not recommended)
:::

::: details Windows cannot find the `claude` command
**Issue**: After installing Claude Code, PowerShell cannot find the `claude` command.

**Solution**:

This usually happens because the npm global package path is not added to your PATH environment variable.

1. Check the npm global prefix:

   ```powershell
   npm config get prefix
   ```

2. Check whether it’s in PATH:

   ```powershell
   $env:PATH -split ";" | Select-String "npm"
   ```

3. If it isn’t, add it manually (choose one):

   **Option 1: Temporary (current session only)**

   ```powershell
   $env:PATH += ";C:\Users\<YourUsername>\AppData\Roaming\npm"
   ```

   **Option 2: Permanent (recommended)**

   ```powershell
   [Environment]::SetEnvironmentVariable(
       "Path",
       [Environment]::GetEnvironmentVariable("Path", "User") + ";C:\Users\<YourUsername>\AppData\Roaming\npm",
       "User"
   )
   ```

4. Close and reopen PowerShell
5. Verify installation:

   ```powershell
   claude --version
   ```

:::

::: details Windows PowerShell Profile not taking effect
**Issue**: You configured the PowerShell Profile, but the environment variables are not loaded.

**Solution**:

1. Confirm the Profile path is correct:

   ```powershell
   $PROFILE
   # You should see something like:
   # C:\Users\<YourUsername>\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
   ```

2. Confirm the Profile file exists:

   ```powershell
   Test-Path $PROFILE
   # Should return True
   ```

3. Confirm the Profile file content is correct:

   ```powershell
   Get-Content $PROFILE
   ```

4. Manually load the Profile (to test for syntax errors):

   ```powershell
   . $PROFILE
   ```

5. If you see errors, check:
   - Whether the file encoding is UTF-8
   - Whether the PowerShell syntax is correct (note the `$env:` prefix)
   - Whether your execution policy allows scripts to run (see "PowerShell script execution policy" above)

6. Verify the environment variables are loaded:

   ```powershell
   Write-Host "ANTHROPIC_BASE_URL: $env:ANTHROPIC_BASE_URL"
   Write-Host "ANTHROPIC_AUTH_TOKEN: $env:ANTHROPIC_AUTH_TOKEN"
   ```

:::

::: details Chinese characters in Windows environment variables
**Issue**: Garbled text appears when environment variables include Chinese paths or values.

**Solution**:

1. Ensure your PowerShell Profile file is encoded as **UTF-8 with BOM**
2. Set the correct encoding in PowerShell:

   ```powershell
   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
   ```

3. If the issue persists, avoid using Chinese characters in environment variable values
:::

::: info More models
See the [ZenMux model list](https://zenmux.ai/models) for all available models and details.
:::

::: tip Contact us
If you encounter any issues during usage, or have suggestions and feedback, feel free to contact us via:

- **Website**：<https://zenmux.ai>
- **Support**：[support@zenmux.ai](mailto:support@zenmux.ai)
- **Business**：[bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**：[@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord**：<http://discord.gg/vHZZzj84Bm>

For more contact methods and details, visit our [Contact Us page](/help/contact).
:::