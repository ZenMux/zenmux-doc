---
head:
  - - meta
    - name: description
      content: Guide to Using Gemini CLI with ZenMux
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, Gemini CLI, Google, AI, terminal, agent
---

# Guide to Using Gemini CLI with ZenMux

Gemini CLI is an open-source AI terminal agent tool released by Google that brings Gemini’s capabilities directly into your terminal. Built on the ReAct (Reason + Act) loop architecture, it can autonomously handle complex tasks such as coding, debugging, file operations, and content generation. Gemini CLI offers a 1M-token context window, a request rate limit of 60 requests/minute, and rich MCP tool integration. With ZenMux, you can configure a custom API endpoint for Gemini CLI, enabling more flexible model selection and a more stable service experience.

## Prerequisites

- Node.js 18+
- ZenMux API Key (see [Get a ZenMux API Key](#get-a-zenmux-api-key) below)

## Install Gemini CLI

::: code-group

```bash [npm (Recommended)]
npm install -g @google/gemini-cli
```

```bash [pnpm]
pnpm install -g @google/gemini-cli
```

```bash [npx (Try without installing)]
npx @google/gemini-cli
```

:::

Verify the installation:

```bash
gemini --version
```

After installation, type `gemini` in your terminal to start it.

## Get a ZenMux API Key

::: code-group

```text [Subscription API Key (Recommended)]
Use cases: personal development, learning/exploration, lightweight team collaboration
Features: fixed monthly fee, predictable cost
API Key format: sk-ss-v1-xxx

How to get:
1. Visit https://zenmux.ai/platform/subscription
2. Choose a plan
3. Create a subscription API Key in the console
```

```text [Pay-as-you-go API Key]
Use cases: production, commercial products, enterprise applications
Features: billed by actual usage, convenient for centralized cost accounting
API Key format: sk-ai-v1-xxx

How to get:
1. Visit https://zenmux.ai/platform/pay-as-you-go
2. Top up your account
3. Create a pay-as-you-go API Key in the console
```

:::

## Configuration

A simple setup—connect in minutes with just 3 environment variables.

#### Step 1: Create the config directory

```bash
mkdir -p ~/.gemini
```

#### Step 2: Configure environment variables

You can configure environment variables in `~/.gemini/.env`. Gemini CLI will automatically load them from this file:

```env
GEMINI_API_KEY=sk-ss-v1-xxx  # [!code highlight]
GEMINI_MODEL=google/gemini-2.5-pro  # [!code highlight]
GOOGLE_GEMINI_BASE_URL=https://zenmux.ai/api/vertex-ai/v1  # [!code highlight]
```

Alternatively, set them in your shell profile:

::: code-group

```bash [macOS/Linux/WSL]
# Edit ~/.zshrc or ~/.bashrc
export GEMINI_API_KEY="sk-ss-v1-xxx"  # [!code highlight]
export GEMINI_MODEL="google/gemini-2.5-pro"  # [!code highlight]
export GOOGLE_GEMINI_BASE_URL="https://zenmux.ai/api/vertex-ai/v1"  # [!code highlight]
```

```powershell [Windows PowerShell]
# Edit your PowerShell profile
$env:GEMINI_API_KEY = "sk-ss-v1-xxx"  # [!code highlight]
$env:GEMINI_MODEL = "google/gemini-2.5-pro"  # [!code highlight]
$env:GOOGLE_GEMINI_BASE_URL = "https://zenmux.ai/api/vertex-ai/v1"  # [!code highlight]

# To make it persistent, add it to your PowerShell profile:
# notepad $PROFILE
```

:::

::: warning Important
Be sure to replace `sk-ss-v1-xxx` with your real ZenMux API Key. You can get your API Key in the [ZenMux Console](https://zenmux.ai/settings/keys).
:::

#### Step 3: Configure settings.json

Set the auth method to Gemini API Key to avoid being prompted to sign in with Google when Gemini CLI starts:

```json
{
  "security": {
    "auth": {
      "selectedType": "gemini-api-key" // [!code highlight]
    }
  }
}
```

::: tip Configuration Notes

- `GEMINI_API_KEY`: your ZenMux API Key
- `GEMINI_MODEL`: the model to use (any ZenMux-supported Google model)
- `GOOGLE_GEMINI_BASE_URL`: ZenMux Vertex AI–compatible endpoint
- `selectedType`: auth type—set to `gemini-api-key` to skip Google sign-in
  :::

#### Step 4: Verify connectivity

```bash
# Reload your profile (if you configured via shell profile)
source ~/.zshrc  # or source ~/.bashrc

# Minimal smoke test
gemini -p "Reply with OK only." --output-format json  # [!code highlight]
```

If the response contains `"response": "OK"`, the basic connection is working.

Next, test read-only file analysis:

```bash
# Go to any project directory
cd my-project

# Reference a file for analysis
gemini -p "@README.md Summarize this file in one sentence." --output-format json  # [!code highlight]
```

If it can read the file and return a summary, ZenMux + Gemini CLI read-only analysis is working.

## Authentication

Gemini CLI natively supports multiple authentication methods:

| Method                    | Use Case     | Notes                                  |
| :------------------------ | :----------- | :------------------------------------- |
| Google Account (OAuth)    | Local dev    | Highest free tier: 60 RPM / 1000 RPD   |
| API Key                   | CI/CD, scripts | Set via the `GEMINI_API_KEY` env var |

**When using ZenMux**, choose the API Key method and set your ZenMux API Key in the `GEMINI_API_KEY` environment variable.

To re-authenticate, run:

```bash
gemini --reauth
```

## Core Features

### GEMINI.md Context File

`GEMINI.md` is one of Gemini CLI’s core features, similar to Claude Code’s `CLAUDE.md`. It serves as persistent context that is automatically loaded at the start of each session, helping the AI understand the project background and conventions.

Gemini CLI searches for and merges `GEMINI.md` files in the following order:

| Location                | Scope     | Description                          |
| :---------------------- | :-------- | :----------------------------------- |
| `~/.gemini/GEMINI.md`   | Global    | General instructions for all projects |
| `<project-root>/GEMINI.md` | Project | Project-specific rules and conventions |
| `<current-dir>/GEMINI.md`  | Directory | Subdirectory-specific context        |

::: tip GEMINI.md Writing Tips

- Describe the project’s tech stack and architecture
- Specify coding style and naming conventions
- Document build, test, and deployment workflows
- List commonly used project commands
- Support importing other files via `@path/to/file.md`
  :::

### Common Slash Commands

Gemini CLI provides many built-in commands to manage sessions and configuration:

| Command              | Description                                      |
| :------------------- | :----------------------------------------------- |
| `/help`              | Show help and the list of available commands     |
| `/stats`             | View token usage and statistics for the session  |
| `/memory show`       | Show the currently loaded GEMINI.md context      |
| `/memory add <text>` | Add content to the AI’s memory                   |
| `/theme`             | Switch the UI theme                              |
| `/tools`             | List currently available tools                   |
| `/mcp`               | Manage MCP server connections                    |
| `/chat`              | Save and restore chat history                    |
| `/copy`              | Copy the latest output to the clipboard          |

### Custom Slash Commands

Gemini CLI supports custom commands stored in:

- **Global commands**: `~/.gemini/commands/` — available across all projects
- **Project commands**: `<project-root>/.gemini/commands/` — available only in the current project

For example, create a `/plan` command:

```toml
# ~/.gemini/commands/plan.toml
[command]
description = "Plan changes without implementing"

[command.prompt]
content = """
Please analyze the following request and provide a detailed step-by-step plan.
Do NOT implement any changes — only plan them.

Request: $input
"""
```

### MCP Integration

Gemini CLI supports MCP (Model Context Protocol) servers to extend tool capabilities:

```bash
# Add an MCP server
gemini mcp add <server-name> -- <command>

# List configured MCP servers
gemini mcp list

# Remove an MCP server
gemini mcp remove <server-name>
```

You can also configure MCP servers in `settings.json`:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "my-mcp-server"]
    }
  }
}
```

### Non-Interactive Mode

Gemini CLI supports non-interactive usage, suitable for scripts and CI:

```bash
# One-off Q&A with JSON output
gemini -p "Explain what a REST API is" --output-format json

# Reference a file for analysis
gemini -p "@src/main.ts What is this file’s entry-point logic?" --output-format json
```

## Supported Models

With ZenMux, you can use multiple Gemini models in Gemini CLI. Use the `GEMINI_MODEL` environment variable to specify a model:

```bash
# Set in .gemini/.env or your shell profile
export GEMINI_MODEL="google/gemini-2.5-pro"  # [!code highlight]
```

Recommended models for Gemini CLI:

| Model Name       | Model Slug                | Notes                               |
| ---------------- | ------------------------- | ----------------------------------- |
| Gemini 2.5 Pro   | `google/gemini-2.5-pro`   | Google’s flagship model (recommended) |
| Gemini 2.5 Flash | `google/gemini-2.5-flash` | Faster responses; ideal for rapid iteration |

::: info Get the model list

- View available Google AI protocol models via the [ZenMux model list](https://zenmux.ai/models?sort=newest&supported_protocol=google)
- Use the model slug (e.g., `google/gemini-2.5-pro`)
- To route to a specific provider, see the [Provider Routing docs](/guide/advanced/provider-routing)
  :::

::: tip Switching models
Even if a model name switch works, it does not guarantee tool calling will work as well. Current limitations mainly come from ZenMux’s compatibility with the Gemini CLI Agent protocol, not just the model itself.
:::

## Known Issue: Tool Calls Error {#tool-call-error}

::: warning Tool call error: Unknown name "id" at function_response
When the model tries to use built-in tools (such as Google Search), you may see the following error:

```
[API Error: {"error":{"code":"400","type":"invalid_params","message":"Invalid JSON payload received. Unknown name \"id\" at 'contents[...].parts[0].function_response': Cannot find field."}}]
```

**Cause**: When Gemini CLI sends tool call results to the API, it includes an `id` field in `functionResponse`. This field is not yet supported in some API versions, causing the request to be rejected.
:::

**Temporary workaround**: Modify the locally installed Gemini CLI file and comment out passing `callId`.

1. Locate the file (replace the Node version in the path with your actual version):

   ```
   ~/.nvm/versions/node/<version>/lib/node_modules/@google/gemini-cli/node_modules/@google/gemini-cli-core/dist/src/core/turn.js
   ```

2. Find the `handlePendingFunctionCall` method (around line 183) and comment out `callId,`:

   ```js
   handlePendingFunctionCall(fnCall, traceId) {
       const name = fnCall.name || 'undefined_tool_name';
       const args = fnCall.args || {};
       const callId = fnCall.id ?? `${name}_${Date.now()}_${this.callCounter++}`;
       const toolCallRequest = {
           // callId,  // [!code warning]
           name,
           args,
           isClientInitiated: false,
           prompt_id: this.prompt_id,
           traceId,
       };
   ```
3. Save the file and restart Gemini CLI.

::: tip Notes

- You must re-apply this change after each Gemini CLI update or reinstall
- Once ZenMux completes function calling compatibility, this will be supported automatically and you won’t need this modification
  :::

## Troubleshooting

### Common Issues and Fixes

::: details Gemini CLI prompts for Google sign-in after startup
**Issue**: A Google OAuth sign-in page opens when starting Gemini CLI.

**Solution**:

- Check whether `selectedType` in `~/.gemini/settings.json` is correctly set to `"gemini-api-key"`
- Verify the config using `cat ~/.gemini/settings.json`
  :::

::: details API Key error
**Issue**: The API Key is reported as invalid or unauthorized.

**Solution**:

- Check that the API Key is correct (subscription keys start with `sk-ss-v1-`, pay-as-you-go keys start with `sk-ai-v1-`)
- Ensure the API Key is active and has sufficient balance
- Verify the key status in the [ZenMux Console](https://zenmux.ai/settings/keys)
  :::

::: details Connection failure
**Issue**: Gemini CLI cannot connect to ZenMux.

**Solution**:

- Check your network connection
- Verify the Base URL is set to `https://zenmux.ai/api/vertex-ai/v1`
- Check whether firewall settings are blocking outbound connections
- Try `curl https://zenmux.ai/api/vertex-ai/v1/models` to test connectivity
  :::

::: details .env file not taking effect
**Issue**: Variables set in `~/.gemini/.env` do not take effect.

**Solution**:

- Gemini CLI loads `.env` using a nearest-first rule; once it finds the first one, it stops
- Check whether there is already a `.env` or `.gemini/.env` in the current project directory (it will override the global config)
- Check whether the same variables were already `export`ed in your shell: `env | grep -E "GEMINI_|GOOGLE_"`
- Check whether an earlier `.env` file exists in a parent directory that is being matched first
- Reopen the terminal window, or run `source ~/.zshrc` to reload your profile
  :::

::: details function_response-related errors when editing files
**Issue**: When attempting to have Gemini CLI edit files automatically, you see errors like:

```text
Invalid JSON payload received. Unknown name "id" at 'contents[3].parts[0].function_response': Cannot find field.
```

**Solution**:

- This is a known limitation—see the [Tool Calls Error](#tool-call-error) section
- For now, limit usage to Q&A and read-only analysis
- Do not rely on Gemini CLI for agent actions such as auto-editing or command execution
- Once ZenMux completes function calling compatibility, this will be supported automatically
  :::

::: details Model unavailable
**Issue**: A model is reported as unavailable or unsupported.

**Solution**:

- Check availability via the [ZenMux model list](https://zenmux.ai/models?sort=newest&supported_protocol=google)
- Verify the spelling of the model name in the `GEMINI_MODEL` environment variable
- Try a default model such as `google/gemini-2.5-pro`
- Confirm your account has access to the model
  :::

::: details Occasional request timeouts
**Issue**: Read-only file analysis requests occasionally time out.

**Solution**:

- Retrying usually works
- Reduce the size of the prompt and referenced files
- If timeouts are frequent, try a smaller model (e.g., `google/gemini-2.5-flash`)
- Check that your network connection is stable
  :::

::: details Sandbox mode issues
**Issue**: Command execution fails after enabling sandbox mode.

**Solution**:

- Ensure Docker is installed
- Check that Docker is running: `docker ps`
- Try disabling sandbox mode to test: set `"sandbox": false` in `settings.json`
- If using a custom sandbox, check the `.gemini/sandbox.Dockerfile` configuration
  :::

## Advanced Configuration

### Project-Level Configuration

Gemini CLI supports creating a separate configuration in the project root to override global settings:

```bash
mkdir -p <project-root>/.gemini
```

::: code-group

```json [Project-level settings.json]
// <project-root>/.gemini/settings.json
{
  "model": {
    "name": "google/gemini-2.5-pro"
  }
}
```

```env [Project-level .env]
# <project-root>/.gemini/.env
GEMINI_MODEL=google/gemini-2.5-pro
```

:::

Use cases:

- Different projects use different models
- Teams standardize default behavior
- Commercial projects use pay-as-you-go keys, personal projects use subscription keys

::: warning Security Notice
Do not commit `.env` files containing real API keys to your repository. If you need to share configuration with your team, consider committing only a `settings.json` template.
:::

### Session Retention

Gemini CLI supports retaining session history for reviewing previous conversations:

```json
{
  "general": {
    "sessionRetention": {
      "enabled": true,
      "maxAge": "30d"
    }
  }
}
```

Session history is stored in `~/.gemini/history/`. Adjust `maxAge` as needed, or set it to `false` to disable retention.

### Recommended Configurations for Different Scenarios

::: code-group

```bash [Daily Development]
# Balance performance and cost
export GEMINI_API_KEY="sk-ss-v1-xxx"
export GOOGLE_GEMINI_BASE_URL="https://zenmux.ai/api/vertex-ai/v1"
export GEMINI_MODEL="google/gemini-2.5-pro"
```

```bash [Code Review]
# Prioritize reasoning capability
export GEMINI_API_KEY="sk-ss-v1-xxx"
export GOOGLE_GEMINI_BASE_URL="https://zenmux.ai/api/vertex-ai/v1"
export GEMINI_MODEL="google/gemini-2.5-pro"
```

```bash [Rapid Iteration]
# Prioritize response speed
export GEMINI_API_KEY="sk-ss-v1-xxx"
export GOOGLE_GEMINI_BASE_URL="https://zenmux.ai/api/vertex-ai/v1"
export GEMINI_MODEL="google/gemini-2.5-flash"
```

:::

::: tip Contact Us
If you run into any issues while using the service, or if you have suggestions and feedback, feel free to reach out through:

- **Official website**: <https://zenmux.ai>
- **Support email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business inquiries**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord community**: <http://discord.gg/vHZZzj84Bm>

For more contact channels and details, visit our [Contact Us page](/help/contact).
:::