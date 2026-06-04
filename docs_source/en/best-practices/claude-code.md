---
head:
  - - meta
    - name: description
      content: Guide to using the Claude Code CLI through ZenMux
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, claude, code, Anthropic, Claude, GPT, API
---

# Using the Claude Code CLI Through ZenMux

::: info Compatibility
Claude Code is Anthropic's official coding agent. By integrating it with ZenMux, you gain access to a much wider range of models—not just Anthropic's own Claude lineup.

For example, through ZenMux you can use models like the GPT-5.2 series, Claude-4.5 series, Gemini-3 series, Grok 4.1 series, Doubao-Seed-Code, Kimi-K2, Minimax-M2, GLM-4.6, DeepSeek-V3.2, and Qwen3-Coder-Plus directly inside Claude Code. For the full list of supported models, see the [official model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages).

ZenMux fully supports the Anthropic API protocol, so it integrates seamlessly into tools like Claude Code and Cursor. Just change two parameters to get started.

Note that the base_url for the Anthropic protocol is `https://zenmux.ai/api/anthropic`.
:::

## Configuration

### Installing Claude Code

::: warning Important: the npm/pnpm install method is deprecated
The npm/pnpm install method for Claude Code is deprecated and no longer recommended. If you previously installed Claude Code via npm/pnpm, uninstall the old version first, then use the new native installation method.

**Uninstall the old version (if applicable):**

```bash
# Uninstall the npm/pnpm-installed version
npm uninstall -g @anthropic-ai/claude-code
# or
pnpm uninstall -g @anthropic-ai/claude-code

# If you're already on a native install, you can run the migration command directly
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

# Note: Homebrew installs do not auto-update; update manually
# Update command: brew upgrade claude-code
```

```powershell [WinGet (Windows)]
# Install with WinGet
winget install Anthropic.ClaudeCode

# Note: WinGet installs do not auto-update; update manually
# Update command: winget upgrade Anthropic.ClaudeCode
```

:::

::: info Installation notes

- **Native install (recommended)**: The script-based installs for macOS/Linux/WSL and Windows auto-update, keeping you on the latest version.
- **Package manager install**: The Homebrew and WinGet methods require you to run the update command manually to get new versions.
- **Full installation docs**: For detailed install options, system requirements, authentication methods, and more, see the [official Claude Code installation docs](https://code.claude.com/docs/en/setup).
- **Verify the install**: After installation, run `claude doctor` to check the installation status.

:::

### Configuring Claude Code

#### How the configuration works

By default, Claude Code connects directly to Anthropic's official service. By setting a few environment variables, we can redirect its requests to ZenMux instead. The benefits are:

- **No changes to Claude Code itself**: You switch the service endpoint purely through environment variables.
- **Authenticate with a ZenMux API Key**: Used in place of an official Anthropic API Key.
- **Access more models**: Beyond the Claude series, you can also use GPT, Gemini, Qwen, and many others.

The core of the setup is two key environment variables: `ANTHROPIC_BASE_URL` (the ZenMux service endpoint) and `ANTHROPIC_AUTH_TOKEN` (your ZenMux API Key). Together they route all of Claude Code's requests through ZenMux.

::: warning Important change in v2.0.7x
Because of an update in Claude Code v2.0.7x, its **environment-variable loading logic has changed**: the `env` configuration in `~/.claude/settings.json` **cannot be reliably read** in the following scenarios:

- On the **first login** to Claude Code
- When logging in again after a **logout**

For this reason, when connecting to ZenMux we recommend configuring everything via **shell profile environment variables**, ensuring that both login and requests go through ZenMux's Anthropic-compatible endpoint.
:::

### Step 0: Get a ZenMux API Key

Before configuring Claude Code, you need a ZenMux API Key. ZenMux offers two billing plans—choose based on your use case:

::: code-group

```text [Subscription API Key (recommended)]
✅ Best for: personal development, learning, vibe coding
✅ Highlights: fixed monthly fee, predictable cost, 5–10x price leverage
✅ API Key format: sk-ss-v1-xxx

How to get it:
1. Go to the subscription management page: https://zenmux.ai/platform/subscription
2. Choose a plan that fits (Pro $20/mo, Max $100/mo, Ultra $200/mo)
3. After subscribing, create a subscription API Key on the page

For details, see the subscription plan guide:
📚 https://docs.zenmux.ai/guide/subscription
```

```text [Pay-as-you-go API Key]
✅ Best for: production environments, commercial products, enterprise apps
✅ Highlights: no rate limit, production-grade stability, billed by actual usage
✅ API Key format: sk-ai-v1-xxx

How to get it:
1. Go to the pay-as-you-go page: https://zenmux.ai/platform/pay-as-you-go
2. Top up your account
3. Create an API Key in the "Pay As You Go API Keys" section

For details, see the pay-as-you-go guide:
📚 https://docs.zenmux.ai/guide/pay-as-you-go
```

:::

::: warning Important: choose the right API Key type

- **Personal development / learning** → use a **subscription API Key** (`sk-ss-v1-xxx`) for lower, more cost-effective pricing.
- **Production / commercial projects** → use a **pay-as-you-go API Key** (`sk-ai-v1-xxx`) for higher stability and no limits.

Subscription keys must not be used in production; misuse may result in account restrictions.
:::

### Step 1: Configure shell environment variables (recommended)

This step writes the ZenMux connection settings into your shell config file so they take effect automatically every time you open a terminal.

::: code-group

```bash [macOS/Linux]
# ============== Steps ==============

# 1. Determine which shell you use (usually bash or zsh):
#    - If you use bash, edit ~/.bashrc
#    - If you use zsh, edit ~/.zshrc
#    - If unsure, run echo $SHELL to check

# 2. Append the following to the end of the appropriate config file (remember to replace the API Key)

# ============= ZenMux + Claude Code configuration =============
# Connect Claude Code to ZenMux instead of Anthropic's official service

# Core configuration: ZenMux service endpoint and authentication
export ANTHROPIC_BASE_URL="https://zenmux.ai/api/anthropic"  # ZenMux Anthropic-compatible endpoint
export ANTHROPIC_AUTH_TOKEN="sk-ss-v1-xxx"                   # Replace with your ZenMux API Key (subscription sk-ss-v1-xxx or pay-as-you-go sk-ai-v1-xxx)
# Avoid conflicts: if ANTHROPIC_API_KEY was ever set on this machine, explicitly clear it
export ANTHROPIC_API_KEY=""

# Performance (strongly recommended): disable beta features to avoid long routing times on non-first-party Anthropic providers (see the explanation below)
export CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS="1"            # Disable experimental beta features
export CLAUDE_CODE_ATTRIBUTION_HEADER="0"                    # Turn off the attribution header
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"          # Disable non-essential telemetry traffic

# Optional settings
export API_TIMEOUT_MS="30000000"                             # API request timeout (milliseconds)

# Note: the core variables above are sufficient. If you don't set model-related variables,
#       Claude Code uses its built-in default models (Anthropic's official Claude series).
#       To customize models, see the "Changing / specifying the default model" section below.

# 3. Apply the configuration (pick one):
# Option 1: Reload the config file (recommended)
source ~/.bashrc  # if you use bash
# or
source ~/.zshrc   # if you use zsh

# Option 2: Restart the terminal window
```

```powershell [Windows PowerShell]
# ============== Steps ==============

# On Windows, configure environment variables via the PowerShell profile
# PowerShell 7+ is recommended for the best experience

# 1. Check whether a PowerShell profile exists
Test-Path $PROFILE

# 2. If it returns False, create the profile file
if (!(Test-Path $PROFILE)) {
    New-Item -Path $PROFILE -ItemType File -Force
}

# 3. Open the profile file for editing
notepad $PROFILE
# If you use VSCode, you can also run: code $PROFILE

# 4. Append the following to the end of the profile file (remember to replace the API Key)

# ============= ZenMux + Claude Code configuration =============
# Connect Claude Code to ZenMux instead of Anthropic's official service

# Core configuration: ZenMux service endpoint and authentication
$env:ANTHROPIC_BASE_URL = "https://zenmux.ai/api/anthropic"  # ZenMux Anthropic-compatible endpoint
$env:ANTHROPIC_AUTH_TOKEN = "sk-ss-v1-xxx"                   # Replace with your ZenMux API Key (subscription sk-ss-v1-xxx or pay-as-you-go sk-ai-v1-xxx)
# Avoid conflicts: if ANTHROPIC_API_KEY was ever set on this machine, explicitly clear it
$env:ANTHROPIC_API_KEY = ""

# Performance (strongly recommended): disable beta features to avoid long routing times on non-first-party Anthropic providers (see the explanation below)
$env:CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS = "1"           # Disable experimental beta features
$env:CLAUDE_CODE_ATTRIBUTION_HEADER = "0"                   # Turn off the attribution header
$env:CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = "1"         # Disable non-essential telemetry traffic

# Optional settings
$env:API_TIMEOUT_MS = "30000000"                            # API request timeout (milliseconds)

# Note: the core variables above are sufficient. If you don't set model-related variables,
#       Claude Code uses its built-in default models (Anthropic's official Claude series).
#       To customize models, see the "Changing / specifying the default model" section below.

# 5. Save the file, then restart the PowerShell window to apply the configuration
# Or run this in the current window: . $PROFILE

# 6. Verify the environment variables were set successfully
Write-Host "ANTHROPIC_BASE_URL: $env:ANTHROPIC_BASE_URL"
Write-Host "ANTHROPIC_AUTH_TOKEN: $env:ANTHROPIC_AUTH_TOKEN"
```

:::

::: warning Important: replace the API Key

Be sure to replace `sk-ss-v1-xxx` or `sk-ai-v1-xxx` in the configuration with your real ZenMux API Key:

**Subscription API Key (recommended for personal development)**

- Format: `sk-ss-v1-xxx`
- Where to get it: [Subscription management page](https://zenmux.ai/platform/subscription)
- Detailed guide: [Subscription plan docs](/guide/subscription)

**Pay-as-you-go API Key (production)**

- Format: `sk-ai-v1-xxx`
- Where to get it: [Pay-as-you-go page](https://zenmux.ai/platform/pay-as-you-go)
- Detailed guide: [Pay-as-you-go docs](/guide/pay-as-you-go)
:::

::: info Environment variable reference

| Variable                                   | Required    | Purpose            | Description                                                                              |
| ------------------------------------------ | ----------- | ------------------ | ---------------------------------------------------------------------------------------- |
| `ANTHROPIC_BASE_URL`                       | ✅           | Service endpoint   | Redirects Claude Code's requests to ZenMux                                               |
| `ANTHROPIC_AUTH_TOKEN`                     | ✅           | Authentication key | Your ZenMux API Key (subscription or pay-as-you-go)                                      |
| `ANTHROPIC_API_KEY`                        | ✅           | Conflict avoidance | Set to `""` to avoid conflicts with an existing Anthropic config                         |
| `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS`   | Recommended | Performance        | Disables experimental beta features to avoid long routing on non-first-party providers   |
| `CLAUDE_CODE_ATTRIBUTION_HEADER`           | Recommended | Performance        | Turns off the attribution header, reducing unnecessary request overhead                  |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | Recommended | Traffic control    | Disables non-essential reporting, improving privacy and response speed                   |
| `API_TIMEOUT_MS`                           |             | API timeout        | Sets the API request timeout (milliseconds)                                              |
| `ANTHROPIC_DEFAULT_*_MODEL`                |             | Model mapping      | Defines the Haiku/Sonnet/Opus tiers. Leave unset to use Claude Code's built-in default Claude |

:::

::: tip Why disable beta features? (Faster and more stable)

Claude models on ZenMux are served by multiple providers (such as the `anthropic` first party, `amazon-bedrock`, `azure`, and others). Among them, **only the Anthropic first party has solid support for Claude Code's experimental beta features**; the other providers often don't support them.

When Claude Code sends requests with beta features enabled by default, ZenMux **repeatedly tries to route to a provider that supports those features** in order to match capabilities, which significantly increases request latency and time-to-first-token.

Setting the following three environment variables turns off these non-essential features, allowing requests to be routed quickly to any available provider—**dramatically improving both speed and experience**:

```bash
export CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS="1"   # Disable experimental beta features
export CLAUDE_CODE_ATTRIBUTION_HEADER="0"           # Turn off the attribution header
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1" # Disable non-essential telemetry traffic
```

:::

### Step 2: Launch Claude Code and authenticate

Once the environment variables are set, you can start Claude Code. On first launch, it authenticates automatically through ZenMux.

**Steps:**

1. Open a **new** terminal window (to ensure the environment variables are loaded).
2. Go to your project directory:

   ```bash
   cd /path/to/your/project
   ```

3. Launch Claude Code:

   ```bash
   claude  # [!code highlight]
   ```

4. On first launch, Claude Code will:
   - Automatically read `ANTHROPIC_AUTH_TOKEN` from the environment variables
   - Authenticate via the ZenMux service pointed to by `ANTHROPIC_BASE_URL`
   - Be ready to use with no extra login steps

::: tip Tip
If you get a "command not found" error for `claude` at launch, make sure Claude Code is installed globally (see the installation steps above).
:::

### Step 3: Verify the connection

Once it launches successfully, it's a good idea to verify that Claude Code is correctly connected to ZenMux.

At the Claude Code prompt, type the `/status` command to check the configuration:

```text
> /status
Auth token: ANTHROPIC_AUTH_TOKEN  # [!code highlight]
Anthropic base URL: https://zenmux.ai/api/anthropic  # [!code highlight]
```

**What to check:**

- ✅ `Auth token` should show as `ANTHROPIC_AUTH_TOKEN` (indicating it's read from the environment variable).
- ✅ `Anthropic base URL` should show as `https://zenmux.ai/api/anthropic` (the ZenMux service address).

If the displayed information matches the above, the setup is successful! You can now use Claude Code through ZenMux.

## Changing / specifying the default model

Configuring a default model is **optional**. If you don't set `ANTHROPIC_DEFAULT_*_MODEL`, Claude Code uses its built-in default models—Anthropic's official Claude series.

### Using official Claude models (recommended: aliases)

For official Claude models, we recommend the **Claude model alias** form (e.g., `claude-opus-4-7`, `claude-sonnet-4-6`, `claude-haiku-4-5`) rather than the full ZenMux model ID (`anthropic/claude-sonnet-4.6`).

```bash
# ✅ Recommended: aliases enable all of Claude Code's native features (1M context, effort control, etc.)
export ANTHROPIC_DEFAULT_HAIKU_MODEL="claude-haiku-4-5"    # Fast tier
export ANTHROPIC_DEFAULT_SONNET_MODEL="claude-sonnet-4-6"  # Balanced tier
export ANTHROPIC_DEFAULT_OPUS_MODEL="claude-opus-4-7"      # Powerful tier
```

::: info Why use aliases?

Claude Code validates model names against hardcoded strings to enable features like the **1M context window** and **effort-based reasoning control**. When the validator sees `claude-sonnet-4-6`, those features are activated; when it sees `anthropic/claude-sonnet-4.6`, validation fails and the features silently break.

ZenMux's model alias feature makes `claude-sonnet-4-6` fully equivalent to `anthropic/claude-sonnet-4.6`, so Claude Code's validation passes and all downstream features work correctly. For the full alias list and more details, see [Model Aliases](/guide/advanced/model-alias).

:::

### Using non-Claude models

When switching to a non-Claude model in Claude Code (such as GPT, Gemini, or Doubao), you must use the **full ZenMux model ID**—aliases only cover the native Claude series:

```bash
export ANTHROPIC_DEFAULT_HAIKU_MODEL="volcengine/doubao-seed-code"
export ANTHROPIC_DEFAULT_SONNET_MODEL="openai/gpt-5.2"
export ANTHROPIC_DEFAULT_OPUS_MODEL="google/gemini-3-pro-preview"
```

After making changes, remember to run `source ~/.bashrc` / `source ~/.zshrc` or restart your terminal for them to take effect.

### Supported models

::: info Models supporting the Anthropic protocol
Support for the Anthropic protocol is being rolled out in batches. You can view the currently supported models by filtering for the Anthropic Messages protocol in the [official model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages):
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/602FqX9/anthropic-support.png)
You can also check on a [model detail page](https://zenmux.ai/anthropic/claude-haiku-4.5):
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/I9JHS8b/detail-anthropic-support.png)
:::

## Using the Claude Code extension in VSCode

In addition to the command-line version, Claude Code also offers a VSCode extension, letting you use Claude Code for AI-assisted coding directly inside the VSCode editor.

### Step 1: Install the Claude Code extension

Search for and install the **Claude Code Extension** in the VSCode marketplace:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/02/03/S4ThMGS/cc-vs.png"
       alt="Install the Claude Code Extension"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

### Step 2: Open the settings

After installation, click the extension's **settings** icon to open the configuration screen:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/02/03/lDKDS2r/cc-vs2.png"
       alt="Open Claude Code settings"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

### Step 3: Configure the model and environment variables

Click **Edit in settings.json** and add or modify the following in the config file:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/02/03/w8EeQzh/cc-vs3.png"
       alt="Configure the model and environment variables"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

```json
{
  // Optional: the model the editor currently uses. Leave empty to use Claude Code's default model.
  // For official Claude models, use the alias form (e.g., "claude-sonnet-4-6")
  // so that Claude Code's 1M context, effort control, and other features are enabled correctly.
  "claudeCode.selectedModel": "claude-sonnet-4-6",
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
      // Performance (recommended): disable beta features to avoid long routing on non-first-party providers
      "name": "CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS",
      "value": "1"
    },
    {
      "name": "CLAUDE_CODE_ATTRIBUTION_HEADER",
      "value": "0"
    },
    {
      "name": "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC",
      "value": "1"
    }
    // Note: ANTHROPIC_DEFAULT_*_MODEL is optional. If you don't configure it, Claude Code uses its
    // built-in default Claude models. To customize, add them here, and use aliases for official Claude
    // (claude-haiku-4-5 / claude-sonnet-4-6 / claude-opus-4-7).
    // See the model alias guide: /guide/advanced/model-alias
  ]
}
```

::: warning Important configuration notes

1. **Replace the API Key**: Replace `sk-ss-v1-xxx` with your real ZenMux API Key.
   - Subscription API Key (`sk-ss-v1-xxx`): suited for personal development
   - Pay-as-you-go API Key (`sk-ai-v1-xxx`): suited for production

2. **Configuration priority**:
   - If you previously configured shell environment variables on the command line (`~/.bashrc` / `~/.zshrc` / PowerShell profile), the VSCode extension prioritizes the configuration in `settings.json`.
   - To avoid conflicts, when using the VSCode extension we recommend configuring environment variables only in `settings.json`.

3. **Model selection**:
   - `claudeCode.selectedModel` sets the currently used model.
   - `ANTHROPIC_DEFAULT_*_MODEL` sets the default models for the three speed tiers.
   - You can switch models mid-conversation with the `/model` command.

:::

### Step 4: Start using it

Once configured, you can use the Claude Code extension in VSCode:

1. Click the Claude Code icon in the VSCode sidebar.
2. Enter your question or task in the chat interface.
3. Claude will automatically read your project files and help out.

::: info Usage tips

- **Trust the workspace**: On first use, Claude Code asks you to trust the current workspace. Click **Trust This Folder** to allow it to access your project files.
- **Switch models**: Type `/model` mid-conversation to see the current model or switch to another one.
- **Check status**: Type `/status` to view the current connection status and configuration.
- **Environment variable conflicts**: If you run into authentication issues, make sure the `ANTHROPIC_AUTH_TOKEN` and `ANTHROPIC_BASE_URL` environment variables aren't being overridden by system-level environment variables.

:::

## The result

Once configured, you can use ZenMux's many models within Claude Code:

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
**Problem**: You see errors saying the API Key is invalid, unauthorized, or that authentication failed.

**Solution**:

1. **Check the API Key format**:
   - Subscription API Keys should start with `sk-ss-v1-`
   - Pay-as-you-go API Keys should start with `sk-ai-v1-`
   - Make sure there are no extra spaces or line breaks

2. **Verify the API Key is valid**:
   - Subscription: visit the [subscription management page](https://zenmux.ai/platform/subscription) to check subscription status and quota
   - Pay-as-you-go: visit the [pay-as-you-go page](https://zenmux.ai/platform/pay-as-you-go) to check that your balance is sufficient

3. **Confirm the environment variables are loaded**:

   ```bash
   # macOS/Linux
   echo $ANTHROPIC_AUTH_TOKEN

   # Windows PowerShell
   echo $env:ANTHROPIC_AUTH_TOKEN
   ```

   If the output is empty, the environment variables aren't loaded correctly—run `source ~/.zshrc` again or restart your terminal.

4. **Check the API Key status**:
   - Confirm the API Key shows as "Enabled" in the console
   - Check whether the API Key has been deleted or disabled

5. **Get a new API Key**:
   - [Subscription API Key guide](/guide/subscription#step-3-manage-your-subscription-and-get-an-api-key)
   - [Pay-as-you-go API Key guide](/guide/pay-as-you-go#creating-and-managing-api-keys)
:::

::: details Authentication fails when switching to ZenMux from another platform
**Problem**: You previously used an official Claude Code account or another platform (such as MiniMax or GLM), and after switching to ZenMux you hit authentication failures or configuration conflicts.

**Solution**:

This usually happens because the old config file cached previous authentication info that conflicts with your new ZenMux config. Follow these steps to clean up and reconfigure:

1. **Delete the old config file**:

   ```bash [macOS/Linux]
   # Delete the Claude Code config file
   rm -rf ~/.claude/settings.json
   ```

   ```powershell [Windows PowerShell]
   # Delete the Claude Code config file
   Remove-Item -Path "$env:USERPROFILE\.claude\settings.json" -Force
   ```

2. **Confirm your shell environment variables are correct**:

   Check that your shell config file (`~/.zshrc` or `~/.bashrc`) contains the complete ZenMux configuration. Refer to the [Step 1: Configure shell environment variables](#step-1-configure-shell-environment-variables-recommended) section above and make sure it includes these key environment variables:

   ```bash
   export ANTHROPIC_BASE_URL="https://zenmux.ai/api/anthropic"
   export ANTHROPIC_AUTH_TOKEN="sk-ss-v1-xxx"  # Replace with your ZenMux API Key
   export ANTHROPIC_API_KEY=""                 # Clear to avoid conflicts
   export CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS="1"   # Disable beta features for faster routing
   export CLAUDE_CODE_ATTRIBUTION_HEADER="0"           # Turn off the attribution header
   export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"
   export API_TIMEOUT_MS="30000000"
   # ANTHROPIC_DEFAULT_*_MODEL is optional—leave it unset to use Claude Code's built-in default Claude models.
   # To customize Claude models, use aliases so features like 1M context are enabled correctly. See:
   # /guide/advanced/model-alias
   ```

3. **Reload the environment variables**:

   ```bash [zsh]
   source ~/.zshrc
   ```

   ```bash [bash]
   source ~/.bashrc
   ```

   ```powershell [Windows PowerShell]
   . $PROFILE
   ```

4. **Verify the environment variables took effect**:

   ```bash [macOS/Linux]
   # Check the ZenMux service address
   echo $ANTHROPIC_BASE_URL
   # Should output: https://zenmux.ai/api/anthropic

   # Check that the API Key is set
   echo $ANTHROPIC_AUTH_TOKEN
   # Should output your ZenMux API Key

   # Confirm the old API Key is cleared
   echo $ANTHROPIC_API_KEY
   # Should output nothing
   ```

   ```powershell [Windows PowerShell]
   # Check the ZenMux service address
   Write-Host "ANTHROPIC_BASE_URL: $env:ANTHROPIC_BASE_URL"
   # Should output: https://zenmux.ai/api/anthropic

   # Check that the API Key is set
   Write-Host "ANTHROPIC_AUTH_TOKEN: $env:ANTHROPIC_AUTH_TOKEN"
   # Should output your ZenMux API Key

   # Confirm the old API Key is cleared
   Write-Host "ANTHROPIC_API_KEY: $env:ANTHROPIC_API_KEY"
   # Should output nothing
   ```

5. **Restart Claude Code**:

   ```bash
   # Go to your project directory
   cd /path/to/your/project

   # Launch Claude Code
   claude
   ```

6. **Verify the connection**:

   After it launches successfully, type the `/status` command in Claude Code and confirm it shows:

   ```text
   Auth token: ANTHROPIC_AUTH_TOKEN
   Anthropic base URL: https://zenmux.ai/api/anthropic
   ```

:::

::: details Model doesn't support the Anthropic protocol
**Problem**: Using a particular model gives an error that the Anthropic protocol isn't supported.

**Solution**:

- In the [ZenMux model list](https://zenmux.ai/models), filter for "Anthropic API Compatible" to see the currently supported models.
- Or open a specific model's detail page to confirm whether it supports the Anthropic protocol.
- Choose a model from the supported list above.
:::

::: details Connection failures
**Problem**: Claude Code can't connect to the ZenMux service.

**Solution**:

- Check that your network connection is working.
- Verify that `ANTHROPIC_BASE_URL` is correctly set to `https://zenmux.ai/api/anthropic`.
- Confirm that your firewall isn't blocking outbound connections.
:::

::: details VSCode Claude Code extension configuration issues
**Problem**: You encounter authentication failures, models that won't work, or similar issues in the VSCode Claude Code extension.

**Solution**:

1. **Confirm the environment variables are configured correctly**:
   - Open VSCode settings (`Cmd/Ctrl + ,`)
   - Search for "Claude Code"
   - Click "Edit in settings.json"
   - Confirm that `claudeCode.environmentVariables` contains the correct `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN`

2. **Check the model configuration**:
   - Search for "claudeCode.selectedModel" in settings
   - For official Claude models, use an alias (e.g., `claude-sonnet-4-6`) to enable native features like 1M context; for non-Claude models, use the full ZenMux model ID
   - Confirm the model supports the Anthropic protocol (check the [model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages))

3. **Resolve environment variable conflicts**:
   - The VSCode extension's `settings.json` configuration takes priority over system environment variables.
   - If you previously configured environment variables in a shell profile, keep the configuration in only one place.
   - Avoid setting `ANTHROPIC_AUTH_TOKEN` in multiple places, which can cause conflicts.

4. **Restart VSCode**:
   - After changing the configuration, fully quit and restart VSCode.
   - Reopen your project after restarting to let the new configuration take effect.

5. **Check the extension logs**:
   - Open the Output panel in VSCode (`View > Output`).
   - Select the "Claude Code" channel.
   - Review the detailed error messages to pinpoint the problem.

6. **Verify the connection**:
   - Type `/status` in the Claude Code chat interface.
   - Confirm that the displayed API endpoint and authentication method are correct.

For detailed configuration steps, see the [Using the Claude Code extension in VSCode](#using-the-claude-code-extension-in-vscode) section above.
:::

::: details Windows PowerShell script execution policy issue
**Problem**: PowerShell reports "cannot be loaded because running scripts is disabled on this system."

**Solution**:

This is a Windows PowerShell security mechanism. You need to change the execution policy:

1. Run PowerShell **as Administrator**.
2. Run the following command:

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. Enter `Y` to confirm the change.
4. Reopen the PowerShell window.

**About execution policies**:

- `Restricted` (default): no scripts are allowed to run
- `RemoteSigned`: local scripts can run; remotely downloaded scripts require a digital signature
- `Unrestricted`: all scripts are allowed to run (not recommended)
:::

::: details Windows can't find the claude command
**Problem**: After installing Claude Code, PowerShell reports that the `claude` command can't be found.

**Solution**:

This is usually caused by the npm global package path not being added to the PATH environment variable.

1. View the npm global package path:

   ```powershell
   npm config get prefix
   ```

2. Check whether that path is in PATH:

   ```powershell
   $env:PATH -split ";" | Select-String "npm"
   ```

3. If it isn't, add it manually (choose one of the two methods below):

   **Method 1: Temporary (current session only)**

   ```powershell
   $env:PATH += ";C:\Users\<YourUsername>\AppData\Roaming\npm"
   ```

   **Method 2: Permanent (recommended)**

   ```powershell
   [Environment]::SetEnvironmentVariable(
       "Path",
       [Environment]::GetEnvironmentVariable("Path", "User") + ";C:\Users\<YourUsername>\AppData\Roaming\npm",
       "User"
   )
   ```

4. Close and reopen the PowerShell window.
5. Verify the installation:

   ```powershell
   claude --version
   ```

:::

::: details Windows PowerShell profile not taking effect
**Problem**: You configured a PowerShell profile, but the environment variables aren't loaded.

**Solution**:

1. Confirm the profile file path is correct:

   ```powershell
   $PROFILE
   # Should show something like: C:\Users\<YourUsername>\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
   ```

2. Confirm the profile file exists:

   ```powershell
   Test-Path $PROFILE
   # Should return True
   ```

3. Confirm the profile file contents are correct:

   ```powershell
   Get-Content $PROFILE
   ```

4. Load the profile manually (to test for syntax errors):

   ```powershell
   . $PROFILE
   ```

5. If errors appear, check:
   - Whether the file encoding is UTF-8
   - Whether the PowerShell syntax is correct (note the `$env:` prefix)
   - Whether the execution policy allows running scripts (see "Windows PowerShell script execution policy issue" above)

6. Verify the environment variables are loaded:

   ```powershell
   Write-Host "ANTHROPIC_BASE_URL: $env:ANTHROPIC_BASE_URL"
   Write-Host "ANTHROPIC_AUTH_TOKEN: $env:ANTHROPIC_AUTH_TOKEN"
   ```

:::

::: details How to enable the 1M context window (and other Claude Code native features)
**Problem**: When using model IDs like `anthropic/claude-opus-4.6` or `anthropic/claude-sonnet-4.6`, the 1M context window, effort control, and other features won't enable.

**Cause**: Claude Code validates model names against hardcoded strings to decide whether to enable these features. Model IDs with the `anthropic/` prefix don't match, so the features silently fall back to default behavior.

**Solution**: Switch to the **Claude model alias** form—the alias is exactly the string Claude Code expects:

```bash
# ❌ Won't enable 1M context (full ZenMux ID)
export ANTHROPIC_DEFAULT_SONNET_MODEL="anthropic/claude-sonnet-4.6"
export ANTHROPIC_DEFAULT_OPUS_MODEL="anthropic/claude-opus-4.6"

# ✅ Enables 1M context correctly (alias form)
export ANTHROPIC_DEFAULT_SONNET_MODEL="claude-sonnet-4-6"  # [!code highlight]
export ANTHROPIC_DEFAULT_OPUS_MODEL="claude-opus-4-6"      # [!code highlight]
```

After making changes, remember to reload the config (`source ~/.zshrc` or `source ~/.bashrc`), then restart Claude Code.

For the full alias list and background, see the [Model Alias guide](/guide/advanced/model-alias).
:::

::: details What to do if Opus 4.7 won't work
**Problem**: After specifying `claude-opus-4-7` or `anthropic/claude-opus-4.7` in Claude Code, you get errors or it won't run.

**Solution**:

1. **Upgrade Claude Code to the latest version**: Opus 4.7 is only officially supported starting from **v2.1.111**. Run `claude --version` first to check your version number; if it's below that value, upgrade (see the [Installing Claude Code](#installing-claude-code) section above; native installs auto-update, while Homebrew / WinGet require running the upgrade command manually).

2. **Configure the model name correctly**: Claude Code does hardcoded validation for Opus 4.7, so the model identifier must match exactly what it expects. Choose one of the following:

   - **Option A (recommended): use a model alias**. Following the [Model Alias guide](/guide/advanced/model-alias) above, set the model name to `claude-opus-4-7`:

     ```bash
     export ANTHROPIC_DEFAULT_OPUS_MODEL="claude-opus-4-7"  # [!code highlight]
     ```

   - **Option B: don't configure model variables**. Comment out or remove `ANTHROPIC_DEFAULT_*_MODEL` to use Claude Code's default model mapping, which also avoids triggering the validation error.

After making changes, reload the config (`source ~/.zshrc` or `source ~/.bashrc`) and restart Claude Code.
:::

::: details Chinese characters in Windows environment variables
**Problem**: Garbled text appears when an environment variable contains a Chinese path or value.

**Solution**:

1. Make sure the PowerShell profile file uses **UTF-8 with BOM** encoding.
2. Set the correct encoding in PowerShell:

   ```powershell
   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
   ```

3. If the problem persists, avoid using Chinese characters in environment variable values.
:::

::: info More models
See the [ZenMux model list](https://zenmux.ai/models) for all available models and their details.
:::

<ContactCards>
<ContactCard icon="mail" title="Email">

Technical support: [support@zenmux.ai](mailto:support@zenmux.ai)

Business inquiries: [bd@zenmux.ai](mailto:bd@zenmux.ai)

</ContactCard>
<ContactCard icon="x" title="X / Twitter" link="https://x.com/ZenMuxAI" label="@ZenMuxAI" />
<ContactCard icon="discord" title="Discord" link="https://discord.gg/vHZZzj84Bm" label="@ZenMuxAI" />
</ContactCards>
