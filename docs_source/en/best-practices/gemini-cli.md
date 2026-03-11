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

Gemini CLI is Google’s open-source AI terminal agent that brings Gemini capabilities directly into your terminal. Built on the ReAct (Reason + Act) loop architecture, it can autonomously handle complex tasks such as coding, debugging, file operations, and content generation. Gemini CLI offers a 1M-token context window, a request rate of 60 requests/minute, and rich MCP tool integration. With ZenMux, you can configure a custom API endpoint for Gemini CLI to gain more flexible model options and a more stable service experience.

::: info Compatibility Notes
Gemini CLI natively uses the Google Gemini API protocol (not the OpenAI protocol). By setting the `GOOGLE_GEMINI_BASE_URL` environment variable, you can route requests to a custom endpoint. ZenMux supports the Vertex AI protocol and is directly compatible with Gemini CLI’s API request format.
:::

## Configuration

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

After installation, type `gemini` in your terminal to launch it.

### Step 1: Set Environment Variables

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

# To make it persistent, add it to your PowerShell profile:
# notepad $PROFILE
```

:::

::: warning Important
Be sure to replace `sk-ai-v1-xxx` with your actual ZenMux API Key. You can obtain your API Key in the [ZenMux Console](https://zenmux.ai/settings/keys).
:::

### Step 2: Configure Gemini CLI

Gemini CLI’s configuration file is located at `~/.gemini/settings.json`. It will be created automatically the first time you launch Gemini CLI, or you can create/modify it manually:

```json
{
  "theme": "GitHub",
  "sandbox": false
}
```

::: tip Configuration Notes

- `theme`: Sets the UI theme. Options include `GitHub`, `Dracula`, `Monokai`, and more.
- `sandbox`: Whether to enable sandboxed command execution (disabled by default). It’s recommended to enable this in production environments.

Gemini CLI primarily controls the model and API endpoint via environment variables, not `settings.json`.
:::

You can also manage environment variables via a `.env` file. Gemini CLI will automatically load it from the project directory or from `~/.gemini/.env`:

```bash
# .gemini/.env
GEMINI_API_KEY=sk-ai-v1-xxx
GOOGLE_GEMINI_BASE_URL=https://zenmux.ai/api/vertex-ai
```

### Step 3: Start Using It

After configuration, reload your shell settings and start Gemini CLI:

```bash
# Reload your shell config
source ~/.zshrc  # or source ~/.bashrc

# Enter your project directory
cd my-project

# Launch Gemini CLI
gemini  # [!code highlight]
```

---

## Core Features

### The GEMINI.md Context File

`GEMINI.md` is one of Gemini CLI’s key features, similar to Claude Code’s `CLAUDE.md`. It serves as persistent context and is automatically loaded at the start of each session, helping the AI understand your project background and conventions.

Gemini CLI searches for and merges `GEMINI.md` files in the following order:

| Location                | Scope     | Description                                  |
| :---------------------- | :-------- | :------------------------------------------- |
| `~/.gemini/GEMINI.md`   | Global    | General instructions for all projects        |
| `project-root/GEMINI.md` | Project   | Project-specific standards and conventions   |
| `current-dir/GEMINI.md` | Directory | Context specific to a given subdirectory     |

::: tip GEMINI.md Writing Tips

- Describe the project’s tech stack and architecture
- Specify coding style and naming conventions
- Explain build, test, and deployment workflows
- List commonly used project commands
- Supports importing other files via `@path/to/file.md`
  :::

### Common Slash Commands

Gemini CLI provides many built-in commands for managing sessions and configuration:

| Command               | Description                                              |
| :-------------------- | :------------------------------------------------------- |
| `/help`               | Show help and a list of available commands               |
| `/stats`              | View token usage and statistics for the current session  |
| `/memory show`        | View the currently loaded GEMINI.md context              |
| `/memory add <text>`  | Add content to the AI’s memory                           |
| `/theme`              | Switch the UI theme                                      |
| `/tools`              | List currently available tools                           |
| `/mcp`                | Manage MCP server connections                            |
| `/chat`               | Save and restore chat history                            |
| `/copy`               | Copy the latest output to the clipboard                  |

### Custom Slash Commands

Gemini CLI supports creating custom commands stored in:

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

Gemini CLI supports MCP (Model Context Protocol) servers to extend the AI’s tool capabilities:

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

---

## Supported Models

With ZenMux, you can use multiple Gemini models in Gemini CLI. Specify a model via the `GEMINI_MODEL` environment variable:

```bash
# Set in .gemini/.env or your shell config
export GEMINI_MODEL="gemini-2.5-pro"  # [!code highlight]
```

::: info Model List

- View available Google AI protocol models via the [ZenMux Model List](https://zenmux.ai/models?sort=newest&supported_protocol=google)
- Gemini CLI uses the Gemini family of models by default
- To target a specific provider, see the [Provider Routing documentation](/guide/advanced/provider-routing)
  :::

---

## Authentication

Gemini CLI natively supports three authentication methods:

| Method                      | Use Case        | Description                                      |
| :-------------------------- | :-------------- | :----------------------------------------------- |
| Google Account Login (OAuth) | Local development | Max free tier: 60 RPM / 1000 RPD                |
| API Key                     | CI/CD, scripts  | Set via the `GEMINI_API_KEY` environment variable |
| Vertex AI                   | Enterprise      | Authenticate via ADC or a service account        |

**When using ZenMux**, choose the API Key method and set your ZenMux API Key as `GEMINI_API_KEY`.

To re-authenticate, run:

```bash
gemini --reauth
```

---

## Troubleshooting

### Common Fixes

::: details API Key Error
**Issue**: You see an “invalid API Key” or “unauthorized” error

**Solutions**:

- Check whether the `GEMINI_API_KEY` environment variable is set correctly
- Verify the value with `echo $GEMINI_API_KEY`
- Confirm the API Key is active and has sufficient balance
- Verify the API Key format starts with `sk-ai-v1-`
  :::

::: details Connection Failure
**Issue**: Gemini CLI cannot connect to the ZenMux service

**Solutions**:

- Check whether your network connection is working
- Verify `GOOGLE_GEMINI_BASE_URL` is correctly set to `https://zenmux.ai/api/vertex-ai`
- Confirm firewall rules are not blocking outbound connections
- Try `curl https://zenmux.ai/api/vertex-ai/models` to test connectivity
  :::

::: details Environment Variables Not Taking Effect
**Issue**: You still see a “not configured” message after setting environment variables

**Solutions**:

- Reopen your terminal, or run `source ~/.zshrc` to reload your configuration
- Use `echo $GEMINI_API_KEY` and `echo $GOOGLE_GEMINI_BASE_URL` to verify the values
- Check that you added the environment variables to the correct shell config file
- Confirm the `.gemini/.env` file is in the correct directory
  :::

::: details Model Not Available
**Issue**: The CLI reports a model is unavailable or unsupported

**Solutions**:

- Check the [ZenMux Model List](https://zenmux.ai/models?sort=newest&supported_protocol=google) to confirm availability
- Verify the model name in the `GEMINI_MODEL` environment variable is spelled correctly
- Try a default model such as `gemini-2.5-pro`
- Confirm your account is permitted to access the model
  :::

::: details Sandbox Mode Issues
**Issue**: Commands fail after enabling sandbox mode

**Solutions**:

- Ensure Docker is installed on your system
- Check whether Docker is running: `docker ps`
- Try disabling sandbox mode to test: set `"sandbox": false` in `settings.json`
- If using a custom sandbox, check the `.gemini/sandbox.Dockerfile` configuration
  :::

---

## Advanced Configuration

### Recommended Setups for Different Scenarios

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
If you encounter any issues during use, or have suggestions or feedback, feel free to reach us via:

- **Official website**: <https://zenmux.ai>
- **Support email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business inquiries**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord community**: <http://discord.gg/vHZZzj84Bm>

For more contact options and details, visit our [Contact page](/help/contact).
:::