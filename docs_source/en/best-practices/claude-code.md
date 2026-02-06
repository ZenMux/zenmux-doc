---
head:
  - - meta
    - name: description
      content: Guide to Using Claude Code CLI with ZenMux
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, claude, code, Anthropic, Claude, GPT, API
---

# Guide to Using Claude Code CLI with ZenMux

::: info Compatibility Notes

Claude Code is Anthropic’s official Coding Agent. With ZenMux integration, you can access a broader set of model options instead of being limited to Anthropic’s official Claude models.

For example, via ZenMux you can use GPT-5.2 series, Claude-4.5 series, Gemini-3 series, Grok 4.1 series, Doubao-Seed-Code, Kimi-K2, Minimax-M2, GLM-4.6, DeepSeek-V3.2, Qwen3-Coder-Plus, and more in Claude Code. For the full list of supported models, see the [official model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages).

ZenMux fully supports the Anthropic API protocol and can be seamlessly integrated into tools like Claude Code and Cursor. You only need to change two parameters to use it.

Note: the Anthropic-compatible `base_url="https://zenmux.ai/api/anthropic"`.
:::

## Configuration Options

### Install Claude Code

::: warning Important Update: npm/pnpm Installation Is Deprecated
The npm/pnpm installation method for Claude Code has been deprecated and is no longer recommended. If you previously installed Claude Code via npm/pnpm, uninstall the old version first, then use the new native installation method.

**Uninstall the old version (if applicable):**

```bash
# Uninstall the npm/pnpm-installed version
npm uninstall -g @anthropic-ai/claude-code
# or
pnpm uninstall -g @anthropic-ai/claude-code

# If you are already on the native install, you can run the migration command directly
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
# Install with Homebrew
brew install --cask claude-code

# Note: Homebrew installs do not auto-update; updates must be run manually
# Update command: brew upgrade claude-code
```

```powershell [WinGet (Windows)]
# Install with WinGet
winget install Anthropic.ClaudeCode

# Note: WinGet installs do not auto-update; updates must be run manually
# Update command: winget upgrade Anthropic.ClaudeCode
```

:::

::: tip 💡 Installation Notes

- **Native install (recommended)**: The script-based installers for macOS/Linux/WSL and Windows auto-update so you always stay on the latest version.
- **Package manager install**: Homebrew and WinGet require you to run the update command manually to get new versions.
- **Full installation docs**: For detailed install options, system requirements, auth methods, and more, see the [official Claude Code installation docs](https://code.claude.com/docs/en/setup).
- **Verify installation**: After installation, run `claude doctor` to check the installation status.

:::

### Configure Claude Code

#### How the Configuration Works

By default, Claude Code connects directly to Anthropic’s official service. However, by configuring environment variables, we can redirect its requests to ZenMux. This provides several benefits:

- **No changes to Claude Code itself**: Switch endpoints using only environment variables
- **Authenticate with a ZenMux API Key**: Replaces Anthropic’s official API key
- **More model choices**: In addition to Claude, you can use GPT, Gemini, Qwen, and more

The core configuration is to set two key environment variables: `ANTHROPIC_BASE_URL` (the ZenMux endpoint) and `ANTHROPIC_AUTH_TOKEN` (your ZenMux API Key), so that all Claude Code requests are proxied through ZenMux.

::: warning Important Change in v2.0.7x
Due to updates in Claude Code v2.0.7x, its **environment-variable loading logic has changed**: the `env` config in `~/.claude/settings.json` **cannot be reliably read** in the following scenarios:

- When **logging in for the first time** in Claude Code
- When logging in again after running **logout**

Therefore, when connecting to ZenMux, it’s recommended to standardize on **shell profile environment variables** to ensure both login and requests go through ZenMux’s Anthropic-compatible endpoint.
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
2. Choose a plan (Pro $20/mo, Max $100/mo, Ultra $200/mo)
3. After subscribing, create a subscription API Key on the page

For details, see: Subscription Plan Guide
📚 https://docs.zenmux.ai/guide/subscription
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
📚 https://docs.zenmux.ai/guide/pay-as-you-go
```

:::

::: warning 💡 Important: Choose the Right API Key Type

- **Personal development / learning** → Use a **Subscription API Key** (`sk-ss-v1-xxx`) for lower, better value cost
- **Production / commercial projects** → Use a **Pay-as-you-go API Key** (`sk-ai-v1-xxx`) for higher stability and no limits

Subscription keys are not allowed for production use. Violations may result in account restrictions.
:::

### Step 1: Configure Shell Environment Variables (Recommended)

This step writes the ZenMux connection configuration into your shell config file so it automatically applies whenever you open a terminal.

::: code-group

```bash [macOS/Linux]
# ============== Steps ==============

# 1. Determine which shell you are using (usually bash or zsh):
#    - If using bash, edit ~/.bashrc
#    - If using zsh, edit ~/.zshrc
#    - If you're not sure, run echo $SHELL

# 2. Append the following to the end of the corresponding config file (replace the API Key)

# ============= ZenMux + Claude Code Configuration =============
# Connect Claude Code to ZenMux instead of Anthropic’s official service

# Core settings: ZenMux endpoint and authentication
export ANTHROPIC_BASE_URL="https://zenmux.ai/api/anthropic"  # ZenMux Anthropic-compatible endpoint
export ANTHROPIC_AUTH_TOKEN="sk-ss-v1-xxx"                   # Replace with your ZenMux API Key (subscription sk-ss-v1-xxx or pay-as-you-go sk-ai-v1-xxx)
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"          # Disable non-essential traffic
export API_TIMEOUT_MS="30000000"                              # API timeout in milliseconds

# Avoid conflicts: if you previously set ANTHROPIC_API_KEY locally, explicitly clear it
export ANTHROPIC_API_KEY=""

# Default model configuration (required): map the Haiku / Sonnet / Opus speed tiers to actual models
export ANTHROPIC_DEFAULT_HAIKU_MODEL="anthropic/claude-haiku-4.5"   # Fast model
export ANTHROPIC_DEFAULT_SONNET_MODEL="anthropic/claude-sonnet-4.5" # Balanced model
export ANTHROPIC_DEFAULT_OPUS_MODEL="anthropic/claude-opus-4.5"     # Most capable model

# 3. Apply the configuration (choose one):
# Option 1: Reload the config file (recommended)
source ~/.bashrc  # if using bash
# or
source ~/.zshrc   # if using zsh

# Option 2: Restart the terminal window
```

```powershell [Windows PowerShell]
# ============== Steps ==============

# On Windows, use the PowerShell Profile to configure environment variables
# PowerShell 7+ is recommended for a better experience

# 1. Check whether the PowerShell Profile exists
Test-Path $PROFILE

# 2. If it returns False, create the Profile file
if (!(Test-Path $PROFILE)) {
    New-Item -Path $PROFILE -ItemType File -Force
}

# 3. Open the Profile file for editing
notepad $PROFILE
# If you use VSCode, you can also run: code $PROFILE

# 4. Append the following to the end of the Profile file (replace the API Key)

# ============= ZenMux + Claude Code Configuration =============
# Connect Claude Code to ZenMux instead of Anthropic’s official service

# Core settings: ZenMux endpoint and authentication
$env:ANTHROPIC_BASE_URL = "https://zenmux.ai/api/anthropic"  # ZenMux Anthropic-compatible endpoint
$env:ANTHROPIC_AUTH_TOKEN = "sk-ss-v1-xxx"                   # Replace with your ZenMux API Key (subscription sk-ss-v1-xxx or pay-as-you-go sk-ai-v1-xxx)
$env:CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = "1"          # Disable non-essential traffic
$env:API_TIMEOUT_MS = "30000000"                              # API timeout in milliseconds

# Avoid conflicts: if you previously set ANTHROPIC_API_KEY locally, explicitly clear it
$env:ANTHROPIC_API_KEY = ""

# Default model configuration (required): map the Haiku / Sonnet / Opus speed tiers to actual models
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "anthropic/claude-haiku-4.5"   # Fast model
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "anthropic/claude-sonnet-4.5" # Balanced model
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "anthropic/claude-opus-4.5"     # Most capable model

# 5. Save the file, then restart PowerShell to apply
# Or run this in the current window: . $PROFILE

# 6. Verify the environment variables were set successfully
Write-Host "ANTHROPIC_BASE_URL: $env:ANTHROPIC_BASE_URL"
Write-Host "ANTHROPIC_AUTH_TOKEN: $env:ANTHROPIC_AUTH_TOKEN"
```

:::

::: warning 🔑 Important: Replace the API Key

Be sure to replace `sk-ss-v1-xxx` or `sk-ai-v1-xxx` in the configuration with your real ZenMux API Key:

**Subscription API Key (recommended for personal development)**

- Format: `sk-ss-v1-xxx`
- Get it from: [Subscription management page](https://zenmux.ai/platform/subscription)
- Detailed guide: [Subscription plan docs](/guide/subscription)

**Pay-as-you-go API Key (production)**

- Format: `sk-ai-v1-xxx`
- Get it from: [Pay-as-you-go page](https://zenmux.ai/platform/pay-as-you-go)
- Detailed guide: [Pay-as-you-go docs](/guide/pay-as-you-go)
:::

::: tip 📋 Environment Variable Reference

| Variable | Purpose | Notes |
|--------|------|------|
| `ANTHROPIC_BASE_URL` | Service endpoint | Redirects Claude Code requests to ZenMux |
| `ANTHROPIC_AUTH_TOKEN` | Auth token | Your ZenMux API Key (subscription or pay-as-you-go) |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | Traffic control | Disables non-essential telemetry to improve privacy |
| `ANTHROPIC_API_KEY` | Conflict avoidance | Clear it to avoid conflicts with existing local Anthropic config |
| `API_TIMEOUT_MS` | API timeout | Sets the API request timeout in milliseconds |
| `ANTHROPIC_DEFAULT_*_MODEL` | Model mapping | Maps Haiku/Sonnet/Opus tiers to actual models |
:::

### Step 2: Launch Claude Code and Complete Authentication

After the environment variables are configured, you can start Claude Code. On first launch, it will automatically authenticate via ZenMux.

**Steps:**

1. Open a **new** terminal window (to ensure the environment variables are loaded)
2. Go to your project directory:

   ```bash
   cd /path/to/your/project
   ```

3. Start Claude Code:

   ```bash
   claude  # [!code highlight]
   ```

4. On first launch, Claude Code will:
   - Automatically read `ANTHROPIC_AUTH_TOKEN` from your environment variables
   - Authenticate via the ZenMux endpoint specified by `ANTHROPIC_BASE_URL`
   - Start working immediately, with no additional login steps

::: tip Tip
If you see an error that the `claude` command cannot be found, confirm that Claude Code is installed globally (see the installation steps above).
:::

### Step 3: Verify the Connection

After launching successfully, it’s recommended to verify that Claude Code is correctly connected to ZenMux.

In the Claude Code prompt, run `/status` and check whether the configuration is correct:

```text
> /status
Auth token: ANTHROPIC_AUTH_TOKEN  # [!code highlight]
Anthropic base URL: https://zenmux.ai/api/anthropic  # [!code highlight]
```

**What to verify:**

- ✅ `Auth token` should display `ANTHROPIC_AUTH_TOKEN` (meaning it’s read from environment variables)
- ✅ `Anthropic base URL` should display `https://zenmux.ai/api/anthropic` (the ZenMux endpoint)

If everything matches, your setup is complete—you can now use Claude Code through ZenMux.

## Switch / Set Default Models

You’ve already configured the default models in your shell profile (**required**). If you want to switch to other models, just update the same set of environment variables:

```bash
export ANTHROPIC_DEFAULT_HAIKU_MODEL="volcengine/doubao-seed-code"
export ANTHROPIC_DEFAULT_SONNET_MODEL="openai/gpt-5.2"
export ANTHROPIC_DEFAULT_OPUS_MODEL="google/gemini-3-pro-preview"
```

After editing, remember to run `source ~/.bashrc` / `source ~/.zshrc` or restart the terminal for changes to take effect.

### Supported Models

::: info Notes on Models Supported by the Anthropic Protocol
Models compatible with the Anthropic protocol are being adapted in batches. You can filter currently supported models via the [official model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages) and select the Anthropic Messages protocol:
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/602FqX9/anthropic-support.png)
Or you can check support on a specific model detail page:
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/I9JHS8b/detail-anthropic-support.png)
:::

## Use the Claude Code Extension in VSCode

In addition to the CLI, Claude Code also provides a VSCode extension, allowing you to use Claude Code directly inside the VSCode editor for AI-assisted programming.

### Step 1: Install the Claude Code Extension

Search for and install **Claude Code Extension** from the VSCode Marketplace:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/02/03/S4ThMGS/cc-vs.png"
       alt="Install Claude Code Extension"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

### Step 2: Open Settings

After installation, click the extension’s **Settings** icon to open the configuration page:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/02/03/lDKDS2r/cc-vs2.png"
       alt="Open Claude Code settings"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

### Step 3: Configure the Model and Environment Variables

Click **Edit in settings.json**, then add or modify the following configuration:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/02/03/w8EeQzh/cc-vs3.png"
       alt="Configure model and environment variables"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

```json
{
  "claude-code.selectedModel": "anthropic/claude-sonnet-4.5",
  "claudeCode.environmentVariables": [
    {
      "name": "ANTHROPIC_BASE_URL",
      "value": "https://zenmux.ai/api/anthropic"
    },
    {
      "name": "ANTHROPIC_AUTH_TOKEN",
      "value": "sk-ss-v1-xxx"
    },
    {
      "name": "API_TIMEOUT_MS",
      "value": "3000000"
    },
    {
      "name": "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC",
      "value": "1"
    },
    {
      "name": "ANTHROPIC_DEFAULT_HAIKU_MODEL",
      "value": "anthropic/claude-haiku-4.5"
    },
    {
      "name": "ANTHROPIC_DEFAULT_SONNET_MODEL",
      "value": "anthropic/claude-sonnet-4.5"
    },
    {
      "name": "ANTHROPIC_DEFAULT_OPUS_MODEL",
      "value": "anthropic/claude-opus-4.5"
    }
  ]
}
```

::: warning 🔑 Important Configuration Notes

1. **Replace the API Key**: Replace `sk-ss-v1-xxx` with your real ZenMux API Key
   - Subscription API Key (`sk-ss-v1-xxx`): best for personal development
   - Pay-as-you-go API Key (`sk-ai-v1-xxx`): best for production

2. **Configuration priority**:
   - If you previously configured shell environment variables in the CLI (`~/.bashrc` / `~/.zshrc` / PowerShell Profile), the VSCode extension will prefer the `settings.json` configuration
   - To avoid conflicts, when using the VSCode extension, configure environment variables only in `settings.json`

3. **Model selection**:
   - `claude-code.selectedModel` sets the model currently in use
   - `ANTHROPIC_DEFAULT_*_MODEL` sets the default models for the three speed tiers
   - You can switch models during a session using the `/model` command

:::

### Step 4: Start Using It

After configuration, you can use the Claude Code extension in VSCode:

1. Click the Claude Code icon in the VSCode sidebar
2. Enter your question or task in the chat panel
3. Claude will automatically read project files and help you

::: tip 💡 Usage Tips

- **Trust the workspace**: On first use, Claude Code will ask you to trust the current workspace—click **Trust This Folder** to allow access to project files.
- **Switch models**: Type `/model` during a conversation to view the current model or switch to another.
- **Check status**: Type `/status` to see the current connection status and configuration.
- **Environment variable conflicts**: If you run into auth issues, confirm `ANTHROPIC_AUTH_TOKEN` and `ANTHROPIC_BASE_URL` are not being overridden by system-level environment variables.

:::

## What It Looks Like

After setup, you can use multiple ZenMux models in Claude Code:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/GxOgGlh/claude-code-v2.png"
       alt="Claude Code"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

You can use the '/model' command to confirm which model is currently in use:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/MOGcIN5/claude-code-v2-model.png"
       alt="Claude Code Model"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

## Troubleshooting

### Common Issues

::: details API Key Error or Authentication Failure
**Issue**: You see messages like “invalid API key,” “unauthorized,” or authentication failed.

**Solution**:

1. **Check the API Key format**:
   - Subscription API keys should start with `sk-ss-v1-`
   - Pay-as-you-go API keys should start with `sk-ai-v1-`
   - Ensure there are no extra spaces or newline characters

2. **Validate the API Key**:
   - Subscription: visit the [subscription management page](https://zenmux.ai/platform/subscription) to check subscription status and quota
   - Pay-as-you-go: visit the [pay-as-you-go page](https://zenmux.ai/platform/pay-as-you-go) to confirm sufficient balance

3. **Confirm environment variables are loaded**:

   ```bash
   # macOS/Linux
   echo $ANTHROPIC_AUTH_TOKEN

   # Windows PowerShell
   echo $env:ANTHROPIC_AUTH_TOKEN
   ```

   If the output is empty, the environment variables were not loaded correctly. Re-run `source ~/.zshrc` or restart the terminal.

4. **Check the API Key status**:
   - Confirm the API key is shown as "Enabled" in the console
   - Check whether the API key has been deleted or disabled

5. **Get a new API Key**:
   - [Subscription API Key guide](/guide/subscription#step-3-manage-your-subscription-and-get-an-api-key)
   - [Pay-as-you-go API Key guide](/guide/pay-as-you-go#create-and-manage-api-keys)
  :::

::: details Authentication Failure When Switching from Another Platform to ZenMux
**Issue**: You previously used a Claude Code official account or another platform (e.g., MiniMax, GLM, etc.). After switching to ZenMux, authentication fails or configuration conflicts occur.

**Solution**:

This usually happens because old config files cached prior authentication info, causing conflicts with the new ZenMux configuration. Clean up and reconfigure as follows:

1. **Delete the old config file**:

   ```bash [macOS/Linux]
   # Delete Claude Code config
   rm -rf ~/.claude/settings.json
   ```

   ```powershell [Windows PowerShell]
   # Delete Claude Code config
   Remove-Item -Path "$env:USERPROFILE\.claude\settings.json" -Force
   ```

2. **Confirm your shell environment variables are configured correctly**:

   Check whether your shell config file (`~/.zshrc` or `~/.bashrc`) contains the full ZenMux configuration. Refer to the [Step 1: Configure Shell Environment Variables](#step-1-configure-shell-environment-variables-recommended) section above, and ensure it includes these key variables:

   ```bash
   export ANTHROPIC_BASE_URL="https://zenmux.ai/api/anthropic"
   export ANTHROPIC_AUTH_TOKEN="sk-ss-v1-xxx"  # Replace with your ZenMux API Key
   export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"
   export API_TIMEOUT_MS="30000000"
   export ANTHROPIC_API_KEY=""  # Clear to avoid conflicts
   export ANTHROPIC_DEFAULT_HAIKU_MODEL="anthropic/claude-haiku-4.5"
   export ANTHROPIC_DEFAULT_SONNET_MODEL="anthropic/claude-sonnet-4.5"
   export ANTHROPIC_DEFAULT_OPUS_MODEL="anthropic/claude-opus-4.5"
   ```

3. **Reload environment variables**:

   ```bash [Using zsh]
   source ~/.zshrc
   ```

   ```bash [Using bash]
   source ~/.bashrc
   ```

   ```powershell [Windows PowerShell]
   . $PROFILE
   ```

4. **Verify environment variables are applied**:

   ```bash [macOS/Linux]
   # Check ZenMux endpoint
   echo $ANTHROPIC_BASE_URL
   # Should output: https://zenmux.ai/api/anthropic

   # Check whether the API Key is set
   echo $ANTHROPIC_AUTH_TOKEN
   # Should output your ZenMux API Key

   # Confirm the old API Key is cleared
   echo $ANTHROPIC_API_KEY
   # Should output empty
   ```

   ```powershell [Windows PowerShell]
   # Check ZenMux endpoint
   Write-Host "ANTHROPIC_BASE_URL: $env:ANTHROPIC_BASE_URL"
   # Should output: https://zenmux.ai/api/anthropic

   # Check whether the API Key is set
   Write-Host "ANTHROPIC_AUTH_TOKEN: $env:ANTHROPIC_AUTH_TOKEN"
   # Should output your ZenMux API Key

   # Confirm the old API Key is cleared
   Write-Host "ANTHROPIC_API_KEY: $env:ANTHROPIC_API_KEY"
   # Should output empty
   ```

5. **Restart Claude Code**:

   ```bash
   # Enter your project directory
   cd /path/to/your/project

   # Start Claude Code
   claude
   ```

6. **Verify the connection**:

   After starting, run `/status` in Claude Code and confirm it shows:

   ```text
   Auth token: ANTHROPIC_AUTH_TOKEN
   Anthropic base URL: https://zenmux.ai/api/anthropic
   ```

:::

::: details The Model Does Not Support the Anthropic Protocol
**Issue**: When using a model, you see a message saying it does not support the Anthropic protocol.

**Solution**:

- Use the [ZenMux model list](https://zenmux.ai/models) and filter by "Anthropic API Compatible" to see currently supported models
- Or open the model’s detail page to confirm Anthropic protocol support
- Choose a model from the supported list above
  :::

::: details Connection Failures
**Issue**: Claude Code cannot connect to the ZenMux service.

**Solution**:

- Check that your network connection is working
- Verify `ANTHROPIC_BASE_URL` is set to `https://zenmux.ai/api/anthropic`
- Confirm your firewall is not blocking outbound connections
  :::

::: details VSCode Claude Code Extension Configuration Issues
**Issue**: In the VSCode Claude Code extension, you encounter issues such as authentication failures or models not working.

**Solution**:

1. **Confirm the environment variables are configured correctly**:
   - Open VSCode Settings (`Cmd/Ctrl + ,`)
   - Search for "Claude Code"
   - Click "Edit in settings.json"
   - Confirm `claudeCode.environmentVariables` includes correct `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN`

2. **Check the model configuration**:
   - Search for "claude-code.selectedModel" in Settings
   - Confirm the model name format is correct (e.g., `anthropic/claude-sonnet-4.5`)
   - Confirm the model supports the Anthropic protocol (check via the [model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages))

3. **Resolve environment variable conflicts**:
   - The VSCode extension’s `settings.json` configuration has higher priority than system environment variables
   - If you previously set environment variables in your shell profile, it’s recommended to keep only one source of configuration
   - Avoid setting `ANTHROPIC_AUTH_TOKEN` in multiple places, which can cause conflicts

4. **Restart VSCode**:
   - After changing configuration, fully quit and relaunch VSCode
   - Reopen the project so the new configuration takes effect

5. **Check extension logs**:
   - Open the Output panel in VSCode (`View > Output`)
   - Select the "Claude Code" channel
   - Review detailed error messages to help diagnose the issue

6. **Verify the connection**:
   - In the Claude Code chat UI, type `/status`
   - Confirm the displayed API endpoint and authentication method are correct

For detailed configuration steps, see the [Use the Claude Code Extension in VSCode](#use-the-claude-code-extension-in-vscode) section above.
:::

::: details Windows PowerShell Script Execution Policy Issue
**Issue**: PowerShell shows: “Cannot load file xxx because running scripts is disabled on this system.”

**Solution**:

This is a Windows PowerShell security mechanism. You need to change the execution policy:

1. Run PowerShell **as Administrator**
2. Execute:

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. Type `Y` to confirm
4. Reopen the PowerShell window

**Execution policy reference**:

- `Restricted` (default): no scripts can run
- `RemoteSigned`: local scripts can run; downloaded scripts require a digital signature
- `Unrestricted`: all scripts can run (not recommended)
:::

::: details Windows: `claude` Command Not Found
**Issue**: After installing Claude Code, PowerShell cannot find the `claude` command.

**Solution**:

This is usually caused by the npm global package path not being added to the PATH environment variable.

1. Check the npm global prefix:

   ```powershell
   npm config get prefix
   ```

2. Check whether that path is in PATH:

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
5. Verify the installation:

   ```powershell
   claude --version
   ```

:::

::: details Windows PowerShell Profile Not Taking Effect
**Issue**: You configured the PowerShell Profile, but the environment variables are not loaded.

**Solution**:

1. Confirm the Profile file path is correct:

   ```powershell
   $PROFILE
   # Should show something like: C:\Users\<YourUsername>\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
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

5. If errors occur, check:
   - Whether the file encoding is UTF-8
   - Whether the PowerShell syntax is correct (note the `$env:` prefix)
   - Whether the execution policy allows scripts (see "PowerShell Script Execution Policy Issue" above)

6. Verify environment variables are loaded:

   ```powershell
   Write-Host "ANTHROPIC_BASE_URL: $env:ANTHROPIC_BASE_URL"
   Write-Host "ANTHROPIC_AUTH_TOKEN: $env:ANTHROPIC_AUTH_TOKEN"
   ```

:::

::: details Windows: Chinese Characters in Environment Variables
**Issue**: Garbled text appears when environment variables contain Chinese paths or values.

**Solution**:

1. Ensure the PowerShell Profile file uses **UTF-8 with BOM** encoding
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
If you run into any issues or have suggestions/feedback, feel free to contact us via:

- **Website**: <https://zenmux.ai>
- **Support**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord**: <http://discord.gg/vHZZzj84Bm>

For more contact options and details, visit our [Contact Us page](/help/contact).
:::
