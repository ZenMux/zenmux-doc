# Using Claude Code CLI with ZenMux: A Complete Guide

::: info Compatibility Notes

Claude Code is Anthropic’s official coding agent. With ZenMux integration, you can use a wider range of models instead of being limited to Anthropic’s official Claude models.

For example, in Claude Code you can use models such as the GPT-5.2 series, Claude-4.5 series, Gemini-3 series, Grok 4.1 series, Doubao-Seed-Code, Kimi-K2, Minimax-M2, GLM-4.6, DeepSeek-V3.2, Qwen3-Coder-Plus, and more via ZenMux. For the full list of supported models, see the [official model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages).

ZenMux fully supports the Anthropic API protocol and can be seamlessly integrated into tools like Claude Code and Cursor. You only need to modify two parameters to use it.

Note: For the Anthropic protocol, use `base_url="https://zenmux.ai/api/anthropic"`.
:::

## Configuration

### Install Claude Code

::: warning Important Update: npm/pnpm Installation Is Deprecated
The npm/pnpm installation method for Claude Code has been deprecated and is no longer recommended. If you previously installed Claude Code via npm/pnpm, uninstall the old version first, then use the new native installation method.

**Uninstall the old version (if applicable):**

```bash
# Uninstall the npm/pnpm-installed version
npm uninstall -g @anthropic-ai/claude-code
# or
pnpm uninstall -g @anthropic-ai/claude-code

# If you already use the native installation, you can run the migration command directly
claude install
```

:::

**Recommended installation (native install):**

::: code-group

```bash [macOS/Linux/WSL]
# One-line install script (recommended)
curl -fsSL https://claude.ai/install.sh | bash
```

```powershell [Windows PowerShell]
# PowerShell install script
irm https://claude.ai/install.ps1 | iex
```

```batch [Windows CMD]
# CMD install script
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

```bash [Homebrew (macOS)]
# Install via Homebrew
brew install --cask claude-code

# Note: Homebrew installs do not auto-update; you must update manually
# Update command: brew upgrade claude-code
```

```powershell [WinGet (Windows)]
# Install via WinGet
winget install Anthropic.ClaudeCode

# Note: WinGet installs do not auto-update; you must update manually
# Update command: winget upgrade Anthropic.ClaudeCode
```

:::

::: tip 💡 Installation Notes

- **Native install (recommended)**: The script-based installs for macOS/Linux/WSL and Windows auto-update, keeping you on the latest version.
- **Package manager install**: Homebrew and WinGet require running the update command manually to get new versions.
- **Full installation docs**: For detailed installation options, system requirements, authentication methods, and more, see the [official Claude Code installation docs](https://code.claude.com/docs/en/setup).
- **Verify installation**: After installation, you can run `claude doctor` to check the installation status.

:::

### Configure Claude Code

#### How the Configuration Works

By default, Claude Code connects directly to Anthropic’s official service. By configuring environment variables, you can redirect its requests to ZenMux. Benefits include:

- **No changes to Claude Code itself**: Switch endpoints using only environment variables.
- **Authenticate with a ZenMux API Key**: Replaces Anthropic’s official API Key.
- **Access more model choices**: In addition to Claude models, you can use GPT, Gemini, Qwen, and more.

The core setup is to configure two key environment variables: `ANTHROPIC_BASE_URL` (the ZenMux service endpoint) and `ANTHROPIC_AUTH_TOKEN` (your ZenMux API Key). This makes all Claude Code requests route through ZenMux.

::: warning Important Change in v2.0.7x
Due to updates in Claude Code v2.0.7x, its **environment variable loading logic has changed**: the `env` configuration in `~/.claude/settings.json` **cannot be reliably read** in the following scenarios:

- During the **first login** to Claude Code
- When logging in again after running **logout**

Therefore, when connecting to ZenMux, we recommend using **shell profile environment variables** for a consistent setup, ensuring both login and requests go through ZenMux’s Anthropic-compatible endpoint.
:::

### Step 0: Get a ZenMux API Key

Before configuring Claude Code, you need a ZenMux API Key. ZenMux offers two billing options—choose based on your use case:

::: code-group

```text [Subscription API Key (Recommended)]
✅ Best for: personal development, learning/exploration, Vibe Coding
✅ Features: fixed monthly fee, predictable cost, 5–10x price leverage
✅ API Key format: sk-ss-v1-xxx

How to get it:
1. Visit the subscription management page: https://zenmux.ai/platform/subscription
2. Choose a plan (Pro $20/month, Max $100/month, Ultra $200/month)
3. After subscribing, create a subscription API Key on the page

For details, see: Subscription Plan Guide
📚 https://docs.zenmux.ai/guide/subscription
```

```text [Pay-as-you-go API Key]
✅ Best for: production environments, commercial products, enterprise apps
✅ Features: no rate limits, production-grade stability, billed by actual usage
✅ API Key format: sk-ai-v1-xxx

How to get it:
1. Visit the pay-as-you-go page: https://zenmux.ai/platform/pay-as-you-go
2. Top up your account (top-ups automatically include a 20% bonus credit)
3. Create an API Key in the "Pay As You Go API Keys" section

For details, see: Pay-as-you-go Guide
📚 https://docs.zenmux.ai/guide/pay-as-you-go
```

:::

::: warning 💡 Important: Choose the Correct API Key Type

- **Personal development/learning** → Use a **Subscription API Key** (`sk-ss-v1-xxx`) for lower cost and better value.
- **Production/commercial projects** → Use a **Pay-as-you-go API Key** (`sk-ai-v1-xxx`) for higher stability and no limits.

Subscription keys are not allowed for production use. Violations may result in account restrictions.
:::

### Step 1: Configure Shell Environment Variables (Recommended)

This step writes the ZenMux connection settings into your shell configuration file, so they apply automatically every time you open a terminal.

::: code-group

```bash [macOS/Linux]
# ============== Steps ==============

# 1. Determine which shell you are using (usually bash or zsh):
#    - If bash, edit ~/.bashrc
#    - If zsh, edit ~/.zshrc
#    - If unsure, run echo $SHELL

# 2. Append the following to the end of the corresponding config file (replace the API Key)

# ============= ZenMux + Claude Code Configuration =============
# Point Claude Code to ZenMux instead of Anthropic’s official service

# Core config: ZenMux endpoint and authentication
export ANTHROPIC_BASE_URL="https://zenmux.ai/api/anthropic"  # ZenMux Anthropic-compatible endpoint
export ANTHROPIC_AUTH_TOKEN="sk-ss-v1-xxx"                   # Replace with your ZenMux API Key (subscription sk-ss-v1-xxx or pay-as-you-go sk-ai-v1-xxx)
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"          # Disable non-essential traffic

# Avoid conflicts: if you previously set ANTHROPIC_API_KEY locally, explicitly clear it
export ANTHROPIC_API_KEY=""

# Default model configuration (required): map the Haiku / Sonnet / Opus speed tiers to actual models
export ANTHROPIC_DEFAULT_HAIKU_MODEL="anthropic/claude-haiku-4.5"   # Fast model
export ANTHROPIC_DEFAULT_SONNET_MODEL="anthropic/claude-sonnet-4.5" # Balanced model
export ANTHROPIC_DEFAULT_OPUS_MODEL="anthropic/claude-opus-4.5"     # Powerful model

# 3. Apply the changes (choose one):
# Option 1: reload the config file (recommended)
source ~/.bashrc  # if you use bash
# or
source ~/.zshrc   # if you use zsh

# Option 2: restart the terminal window
```

```powershell [Windows PowerShell]
# ============== Steps ==============

# On Windows, use your PowerShell Profile to configure environment variables
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
# Point Claude Code to ZenMux instead of Anthropic’s official service

# Core config: ZenMux endpoint and authentication
$env:ANTHROPIC_BASE_URL = "https://zenmux.ai/api/anthropic"  # ZenMux Anthropic-compatible endpoint
$env:ANTHROPIC_AUTH_TOKEN = "sk-ss-v1-xxx"                   # Replace with your ZenMux API Key (subscription sk-ss-v1-xxx or pay-as-you-go sk-ai-v1-xxx)
$env:CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = "1"          # Disable non-essential traffic

# Avoid conflicts: if you previously set ANTHROPIC_API_KEY locally, explicitly clear it
$env:ANTHROPIC_API_KEY = ""

# Default model configuration (required): map the Haiku / Sonnet / Opus speed tiers to actual models
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "anthropic/claude-haiku-4.5"   # Fast model
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "anthropic/claude-sonnet-4.5" # Balanced model
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "anthropic/claude-opus-4.5"     # Powerful model

# 5. Save the file, then restart PowerShell for the changes to take effect
# Or run: . $PROFILE

# 6. Verify that the environment variables are set correctly
Write-Host "ANTHROPIC_BASE_URL: $env:ANTHROPIC_BASE_URL"
Write-Host "ANTHROPIC_AUTH_TOKEN: $env:ANTHROPIC_AUTH_TOKEN"
```

:::

::: warning 🔑 Important: Replace the API Key

Make sure you replace `sk-ss-v1-xxx` or `sk-ai-v1-xxx` in the config with your real ZenMux API Key:

**Subscription API Key (recommended for personal development)**

- Format: `sk-ss-v1-xxx`
- Where to get it: [Subscription management page](https://zenmux.ai/platform/subscription)
- Detailed guide: [Subscription plan docs](/guide/subscription)

**Pay-as-you-go API Key (for production)**

- Format: `sk-ai-v1-xxx`
- Where to get it: [Pay-as-you-go page](https://zenmux.ai/platform/pay-as-you-go)
- Detailed guide: [Pay-as-you-go docs](/guide/pay-as-you-go)
:::

::: tip 📋 Environment Variable Reference

| Variable | Purpose | Notes |
|--------|------|------|
| `ANTHROPIC_BASE_URL` | Service endpoint | Redirects Claude Code requests to ZenMux |
| `ANTHROPIC_AUTH_TOKEN` | Auth token | Your ZenMux API Key (subscription or pay-as-you-go) |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | Traffic control | Disables non-essential telemetry to improve privacy |
| `ANTHROPIC_API_KEY` | Conflict avoidance | Clear it to avoid conflicts with existing local Anthropic settings |
| `ANTHROPIC_DEFAULT_*_MODEL` | Model mapping | Maps Haiku/Sonnet/Opus tiers to actual models |
:::

### Step 2: Launch Claude Code and Complete Authentication

After setting the environment variables, you can start Claude Code. On first launch, it will automatically authenticate via ZenMux.

**Steps:**

1. Open a **new** terminal window (to ensure the environment variables are loaded).
2. Go to your project directory:

   ```bash
   cd /path/to/your/project
   ```

3. Start Claude Code:

   ```bash
   claude  # [!code highlight]
   ```

4. On first launch, Claude Code will:
   - Automatically read `ANTHROPIC_AUTH_TOKEN` from the environment
   - Authenticate through the ZenMux endpoint specified by `ANTHROPIC_BASE_URL`
   - Start working without any additional login steps

::: tip Tip
If you see an error that the `claude` command cannot be found, confirm that Claude Code is installed globally (see the installation steps above).
:::

### Step 3: Verify the Connection

After you start successfully, it’s recommended to verify that Claude Code is connected to ZenMux.

At the Claude Code prompt, run `/status` and check whether the configuration is correct:

```text
> /status
Auth token: ANTHROPIC_AUTH_TOKEN  # [!code highlight]
Anthropic base URL: https://zenmux.ai/api/anthropic  # [!code highlight]
```

**What to check:**

- ✅ `Auth token` should show `ANTHROPIC_AUTH_TOKEN` (meaning it’s read from environment variables)
- ✅ `Anthropic base URL` should show `https://zenmux.ai/api/anthropic` (the ZenMux endpoint)

If the output matches the above, your setup is complete. You can now use Claude Code via ZenMux.

## Change/Set the Default Model

You’ve already configured the default models in your shell profile (**required**). If you want to switch to other models, simply modify the same set of environment variables:

```bash
export ANTHROPIC_DEFAULT_HAIKU_MODEL="volcengine/doubao-seed-code"
export ANTHROPIC_DEFAULT_SONNET_MODEL="openai/gpt-5.2"
export ANTHROPIC_DEFAULT_OPUS_MODEL="google/gemini-3-pro-preview"
```

After editing, remember to run `source ~/.bashrc` / `source ~/.zshrc` or restart your terminal for changes to take effect.

### Supported Models

::: info Anthropic Protocol Model Support Notes
Support for the Anthropic protocol is being rolled out in batches. You can filter currently supported models via the [official model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages) by selecting the Anthropic Messages protocol:
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/602FqX9/anthropic-support.png)
You can also check support via a model’s detail page:
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/I9JHS8b/detail-anthropic-support.png)
:::

## What It Looks Like

Once configured, you can use a variety of ZenMux models inside Claude Code:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/GxOgGlh/claude-code-v2.png"
       alt="Claude Code"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

You can use the `/model` command to confirm the model currently in use:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/MOGcIN5/claude-code-v2-model.png"
       alt="Claude Code Model"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

## Troubleshooting

### Common Issues and Fixes

::: details API Key Error or Authentication Failure
**Issue**: You see an error indicating the API Key is invalid, unauthorized, or authentication failed

**Solutions**:

1. **Check the API Key format**:
   - Subscription API Keys should start with `sk-ss-v1-`
   - Pay-as-you-go API Keys should start with `sk-ai-v1-`
   - Make sure there are no extra spaces or newlines

2. **Validate the API Key**:
   - Subscription: visit the [Subscription management page](https://zenmux.ai/platform/subscription) to check subscription status and quotas
   - Pay-as-you-go: visit the [Pay-as-you-go page](https://zenmux.ai/platform/pay-as-you-go) to ensure you have sufficient balance

3. **Confirm the environment variables are loaded**:

   ```bash
   # macOS/Linux
   echo $ANTHROPIC_AUTH_TOKEN

   # Windows PowerShell
   echo $env:ANTHROPIC_AUTH_TOKEN
   ```

   If the output is empty, the environment variables were not loaded correctly. Run `source ~/.zshrc` again or restart the terminal.

4. **Check the API Key status**:
   - Confirm the API Key shows as "Enabled" in the console
   - Check whether the API Key was deleted or disabled

5. **Create a new API Key**:
   - [Subscription API Key guide](/guide/subscription#step-3-manage-your-subscription-and-get-an-api-key)
   - [Pay-as-you-go API Key guide](/guide/pay-as-you-go#create-and-manage-api-keys)
  :::

::: details The Model Does Not Support the Anthropic Protocol
**Issue**: You see an error that a model does not support the Anthropic protocol

**Solutions**:

- In the [ZenMux model list](https://zenmux.ai/models), filter by "Anthropic API Compatible" to view currently supported models
- Or open the model’s detail page to confirm whether it supports the Anthropic protocol
- Use a model from the supported list above
  :::

::: details Connection Failure
**Issue**: Claude Code cannot connect to the ZenMux service

**Solutions**:

- Check that your network connection is working
- Verify `ANTHROPIC_BASE_URL` is correctly set to `https://zenmux.ai/api/anthropic`
- Ensure your firewall is not blocking outbound connections
  :::

::: details VSCode Claude Code Extension Configuration
**Issue**: Problems occur in the VSCode Claude Code extension GUI mode

**Solutions**:

You can adjust Claude Code’s model configuration directly in the VSCode extension settings by changing it to the model slug specified in your config file. See the screenshots below:

![VSCode Claude Code extension configuration](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/alNj8F2/cc-plugin-settings.png)
![VSCode Claude Code extension configuration](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/S7fuYF9/cc-plugin-model.png)
:::

::: details Windows PowerShell Script Execution Policy
**Issue**: PowerShell shows: "Cannot load file xxx because running scripts is disabled on this system"

**Solutions**:

This is a Windows PowerShell security mechanism. You need to change the execution policy:

1. Run PowerShell **as Administrator**
2. Execute:

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. Enter `Y` to confirm
4. Reopen the PowerShell window

**Execution policy reference**:

- `Restricted` (default): no scripts are allowed to run
- `RemoteSigned`: local scripts can run; scripts downloaded from the internet require a digital signature
- `Unrestricted`: all scripts can run (not recommended)
:::

::: details Windows: `claude` Command Not Found
**Issue**: After installing Claude Code, PowerShell reports it cannot find the `claude` command

**Solutions**:

This is usually because the npm global package path is not added to your PATH environment variable.

1. Check the npm global prefix:

   ```powershell
   npm config get prefix
   ```

2. Check whether that path is in PATH:

   ```powershell
   $env:PATH -split ";" | Select-String "npm"
   ```

3. If not, add it manually (choose one):

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

::: details Windows: PowerShell Profile Not Taking Effect
**Issue**: You configured the PowerShell Profile, but the environment variables are not loaded

**Solutions**:

1. Confirm the Profile path:

   ```powershell
   $PROFILE
   # It should look like: C:\Users\<YourUsername>\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
   ```

2. Confirm the Profile file exists:

   ```powershell
   Test-Path $PROFILE
   # Should return True
   ```

3. Confirm the file contents are correct:

   ```powershell
   Get-Content $PROFILE
   ```

4. Manually load the Profile (to test for syntax errors):

   ```powershell
   . $PROFILE
   ```

5. If errors occur, check:
   - File encoding is UTF-8
   - PowerShell syntax is correct (especially the `$env:` prefix)
   - The execution policy allows scripts to run (see "PowerShell Script Execution Policy" above)

6. Verify environment variables are loaded:

   ```powershell
   Write-Host "ANTHROPIC_BASE_URL: $env:ANTHROPIC_BASE_URL"
   Write-Host "ANTHROPIC_AUTH_TOKEN: $env:ANTHROPIC_AUTH_TOKEN"
   ```

:::

::: details Windows: Garbled Chinese Characters in Environment Variables
**Issue**: Environment variables containing Chinese paths or values appear garbled

**Solutions**:

1. Ensure the PowerShell Profile file is saved with **UTF-8 with BOM** encoding
2. Set the correct encoding in PowerShell:

   ```powershell
   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
   ```

3. If the issue persists, avoid using Chinese characters in environment variable values
:::

::: info More Models
See the [ZenMux model list](https://zenmux.ai/models) for all available models and detailed information.
:::

::: tip Contact Us
If you encounter any issues while using the service, or if you have suggestions or feedback, feel free to contact us via:

- **Website**: <https://zenmux.ai>
- **Support Email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business Email**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord Community**: <http://discord.gg/vHZZzj84Bm>

For more contact methods and details, please visit our [Contact Us page](/help/contact).
:::
