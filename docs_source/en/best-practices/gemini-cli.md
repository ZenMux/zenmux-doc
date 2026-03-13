---
head:
  - - meta
    - name: description
      content: Using Gemini CLI via ZenMux Guide
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, Gemini CLI, Google, AI, terminal, agent
---

# Using Gemini CLI via ZenMux Guide

Gemini CLI is Google’s open-source AI terminal agent that brings Gemini capabilities directly into your terminal. Built on a ReAct (Reason + Act) loop architecture, it can autonomously handle complex tasks such as coding, debugging, file operations, and content generation. Gemini CLI provides a 1M-token context window, a request rate of 60 requests/minute, and rich MCP tool integration. With ZenMux, you can configure a custom API endpoint for Gemini CLI to get more flexible model choices and a more stable service experience.

::: info Compatibility Notes
Gemini CLI natively uses the Google Gemini API protocol (not the OpenAI protocol). By setting the `GOOGLE_GEMINI_BASE_URL` environment variable, you can route requests to a custom endpoint. ZenMux supports the Vertex AI protocol and is directly compatible with Gemini CLI’s API request format.
:::

## Configuration Options

### Step 0: Install Gemini CLI

Gemini CLI requires Node.js 18+.

::: code-group

```bash [npm (recommended)]
npm install -g @google/gemini-cli
```

```bash [npx (try without installing)]
npx @google/gemini-cli
```

:::

After installation, type `gemini` in your terminal to start it.

### Step 1: Configure Environment Variables

Add your ZenMux API Key and custom endpoint to your shell config file:

::: code-group

```bash [macOS/Linux/WSL]
# Edit ~/.zshrc or ~/.bashrc
export GEMINI_API_KEY="sk-ai-v1-xxx"  # [!code highlight]
export GOOGLE_GEMINI_BASE_URL="https://zenmux.ai/api/vertex-ai"  # [!code highlight]
```

```powershell [Windows PowerShell]
# Edit your PowerShell profile
$env:GEMINI_API_KEY = "sk-ai-v1-xxx"  # [!code highlight]
$env:GOOGLE_GEMINI_BASE_URL = "https://zenmux.ai/api/vertex-ai"  # [!code highlight]

# To persist permanently, add to your PowerShell profile:
# notepad $PROFILE
```

:::

::: warning Important
Make sure to replace `sk-ai-v1-xxx` with your real ZenMux API Key. You can get your API Key from the [ZenMux Console](https://zenmux.ai/settings/keys).
:::

### Step 2: Configure Gemini CLI

Gemini CLI’s config file is located at `~/.gemini/settings.json`. It is created automatically the first time you start Gemini CLI, but you can also create or edit it manually:

```json
{
  "theme": "GitHub",
  "sandbox": false
}
```

::: tip Configuration Notes

- `theme`: Sets the UI theme. Options include `GitHub`, `Dracula`, `Monokai`, etc.
- `sandbox`: Whether to run commands in sandbox mode (off by default). It’s recommended to enable this in production environments.

Gemini CLI primarily controls models and API endpoints via environment variables rather than `settings.json`.
:::

You can also manage environment variables via a `.env` file. Gemini CLI automatically loads it from your project directory or from `~/.gemini/.env`:

```bash
# .gemini/.env
GEMINI_API_KEY=sk-ai-v1-xxx
GOOGLE_GEMINI_BASE_URL=https://zenmux.ai/api/vertex-ai
```

### Step 3: Start Using It

After configuration, reload your shell settings and start Gemini CLI:

```bash
# Reload your config
source ~/.zshrc  # or source ~/.bashrc

# Enter your project directory
cd my-project

# Start Gemini CLI
gemini  # [!code highlight]
```

## Known Issue: Tool Call Error {#tool-call-error}

::: warning Tool call error: Unknown name "id" at function_response
When the model attempts to use built-in tools (such as Google Search), you may see the following error:

```
[API Error: {"error":{"code":"400","type":"invalid_params","message":"Invalid JSON payload received. Unknown name \"id\" at 'contents[...].parts[0].function_response': Cannot find field."}}]
```

**Cause**: When Gemini CLI sends tool call results to the API, it includes an `id` field in `functionResponse`. This field is not supported in some API versions yet, causing the request to be rejected.
:::

**Solution**: Modify the locally installed Gemini CLI files and comment out the passing of `callId`.

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

::: tip Note
You must reapply this change after every Gemini CLI update or reinstallation.
:::

## Core Features

### The `GEMINI.md` Context File

`GEMINI.md` is one of Gemini CLI’s core features, similar to Claude Code’s `CLAUDE.md`. It serves as persistent context and is automatically loaded at the start of each session, helping the AI understand project background and conventions.

Gemini CLI searches for and merges `GEMINI.md` files in the following order:

| Location                | Scope     | Description                           |
| :---------------------- | :-------- | :------------------------------------ |
| `~/.gemini/GEMINI.md`   | Global    | General instructions for all projects |
| `project-root/GEMINI.md`| Project   | Project-specific rules and conventions|
| `current-dir/GEMINI.md` | Directory | Context specific to a subdirectory    |

::: tip Recommendations for Writing `GEMINI.md`

- Describe the project’s tech stack and architecture
- Specify code style and naming conventions
- Explain the build, test, and deployment workflow
- List commonly used project commands
- Supports importing other files via the `@path/to/file.md` syntax
  :::

### Common Slash Commands

Gemini CLI provides many built-in commands to manage sessions and configuration:

| Command              | Description                                      |
| :------------------- | :----------------------------------------------- |
| `/help`              | Show help and a list of available commands       |
| `/stats`             | View token usage and statistics for the session  |
| `/memory show`       | Show the currently loaded `GEMINI.md` context    |
| `/memory add <text>` | Add content to the AI’s memory                   |
| `/theme`             | Switch UI theme                                  |
| `/tools`             | Show the list of currently available tools       |
| `/mcp`               | Manage MCP server connections                    |
| `/chat`              | Save and restore chat history                    |
| `/copy`              | Copy the last output to the clipboard            |

### Custom Slash Commands

Gemini CLI supports custom commands stored in the following locations:

- **Global commands**: `~/.gemini/commands/` — available in all projects
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

Gemini CLI supports MCP (Model Context Protocol) servers, which extend the AI’s tool capabilities:

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

## Supported Models

With ZenMux, you can use multiple Gemini models in Gemini CLI. Use the `GEMINI_MODEL` environment variable to specify a model:

```bash
# Set in .gemini/.env or your shell config
export GEMINI_MODEL="gemini-2.5-pro"  # [!code highlight]
```

::: info Get the Model List

- View Google AI protocol-available models via the [ZenMux Model List](https://zenmux.ai/models?sort=newest&supported_protocol=google)
- Gemini CLI uses Gemini-family models by default
- To target a specific provider, see the [Provider Routing docs](/guide/advanced/provider-routing)
  :::

## Authentication

Gemini CLI natively supports three authentication methods:

| Method                      | Use Case        | Description                                  |
| :-------------------------- | :-------------- | :------------------------------------------- |
| Google Account Login (OAuth)| Local development | Max free quota: 60 RPM / 1000 RPD         |
| API Key                     | CI/CD, scripts  | Set via the `GEMINI_API_KEY` environment variable |
| Vertex AI                   | Enterprise      | Authenticate via ADC or a service account     |

**When using ZenMux**, choose the API Key method and set your ZenMux API Key as `GEMINI_API_KEY`.

To re-authenticate, run:

```bash
gemini --reauth
```

## Troubleshooting

### Common Issues

::: details API Key errors
**Issue**: You see an error indicating the API Key is invalid or unauthorized.

**Solution**:

- Check whether the `GEMINI_API_KEY` environment variable is set correctly
- Use `echo $GEMINI_API_KEY` to verify the value
- Confirm the API Key is active and has sufficient balance
- Verify the API Key format starts with `sk-ai-v1-`
  :::

::: details Connection failures
**Issue**: Gemini CLI cannot connect to the ZenMux service.

**Solution**:

- Check that your network connection is working
- Verify `GOOGLE_GEMINI_BASE_URL` is set to `https://zenmux.ai/api/vertex-ai`
- Confirm firewall settings are not blocking outbound connections
- Try `curl https://zenmux.ai/api/vertex-ai/models` to test connectivity
  :::

::: details Environment variables not taking effect
**Issue**: Even after setting environment variables, Gemini CLI still reports they are not configured.

**Solution**:

- Reopen your terminal, or run `source ~/.zshrc` to reload settings
- Use `echo $GEMINI_API_KEY` and `echo $GOOGLE_GEMINI_BASE_URL` to verify values
- Ensure you added the environment variables to the correct shell config file
- Confirm the `.gemini/.env` file is in the correct directory
  :::

::: details Model unavailable
**Issue**: When using a model, Gemini CLI reports that the model is unavailable or unsupported.

**Solution**:

- Check availability via the [ZenMux Model List](https://zenmux.ai/models?sort=newest&supported_protocol=google)
- Confirm the model name in `GEMINI_MODEL` is spelled correctly
- Test with a default model such as `gemini-2.5-pro`
- Confirm your account has access to the model
  :::

::: details Sandbox mode issues
**Issue**: Commands fail to execute after enabling sandbox mode.

**Solution**:

- Ensure Docker is installed on your system
- Check whether Docker is running: `docker ps`
- Try disabling sandbox mode: set `"sandbox": false` in `settings.json`
- If using a custom sandbox, verify the `.gemini/sandbox.Dockerfile` configuration
  :::

## Advanced Configuration

### Recommended Configurations for Different Scenarios

::: code-group

```bash [Daily development]
# Balance performance and cost
export GEMINI_API_KEY="sk-ai-v1-xxx"
export GOOGLE_GEMINI_BASE_URL="https://zenmux.ai/api/vertex-ai"
export GEMINI_MODEL="gemini-2.5-pro"
```

```bash [Code review]
# Prioritize reasoning capability
export GEMINI_API_KEY="sk-ai-v1-xxx"
export GOOGLE_GEMINI_BASE_URL="https://zenmux.ai/api/vertex-ai"
export GEMINI_MODEL="gemini-2.5-pro"
```

```bash [Rapid iteration]
# Prioritize response speed
export GEMINI_API_KEY="sk-ai-v1-xxx"
export GOOGLE_GEMINI_BASE_URL="https://zenmux.ai/api/vertex-ai"
export GEMINI_MODEL="gemini-2.5-flash"
```

:::

::: tip Contact Us
If you run into any issues while using the service, or if you have suggestions or feedback, feel free to contact us via:

- **Official website**: <https://zenmux.ai>
- **Support email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business inquiries**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord community**: <http://discord.gg/vHZZzj84Bm>

For more contact methods and details, please visit our [Contact Us page](/help/contact).
:::