# Guide to Using Codex CLI via ZenMux

Codex CLI is an open-source programming assistant tool from OpenAI that runs in your local terminal and can read, modify, and execute code in the directory you choose. Built in Rust, it's fast and efficient, and continuously improved on GitHub. Through integration with ZenMux, you can access a wider selection of models beyond the official OpenAI API.

::: info Compatibility Notes
ZenMux fully supports the OpenAI API protocol and integrates seamlessly with tools like Codex CLI and Cursor. A simple configuration is all you need.

Note that the OpenAI-compatible base_url="https://zenmux.ai/api/v1".
:::

## Configuration

### Install Codex CLI

::: code-group

```bash [npm/pnpm]
# Install with pnpm (recommended)
pnpm install -g @openai/codex

# Or install with npm
npm install -g @openai/codex
```

:::

### Configure environment variables

Add your ZenMux API key in your shell configuration file:

```bash
# Edit ~/.zshrc or ~/.bashrc depending on the terminal you use
export ZENMUX_API_KEY="sk-ai-v1-xxx"  # [!code highlight]
```

::: warning Important Configuration
Make sure to replace `sk-ai-v1-xxx` with your actual ZenMux API key. You can obtain your API key in the [ZenMux Console](https://zenmux.ai/settings/keys).
:::

### Configure Codex

Create or modify the Codex configuration file at `~/.codex/config.toml`:

```toml
model_provider = "zenmux"  # [!code highlight]
model = "openai/gpt-5-codex"  # [!code highlight]

[model_providers.zenmux]  # [!code highlight]
name = "ZenMux"  # [!code highlight]
base_url = "https://zenmux.ai/api/v1"  # [!code highlight]
env_key = "ZENMUX_API_KEY"  # [!code highlight]
```

::: tip Configuration Notes

- `model_provider`: Specify ZenMux as the model provider
- `model`: Set the model to use; it can be any model supported by ZenMux
- `base_url`: The base URL for the ZenMux API
- `env_key`: The name of the API key in your environment variables
  :::

### Start and use directly

After configuration, reload your shell settings and launch Codex:

```bash
# Reload the configuration file
source ~/.zshrc  # or source ~/.bashrc

# Go to your project directory
cd my-project

# Start Codex CLI
codex  # [!code highlight]
```

::: tip Convenient Usage
Once you add the environment variable configuration to your shell configuration file, you won’t need to set it manually each time. The configuration will automatically take effect whenever you open a new terminal.
:::

## Supported Models

You can flexibly change the `model` field in `config.toml` to any model supported by ZenMux.

::: info Get the Model List

- View all available models via the [ZenMux Model List](https://zenmux.ai/models)
- Use the model’s slug name (e.g., `openai/gpt-5-codex`)
- To specify a particular provider, refer to the [Provider Routing documentation](/guide/provider-routing)
  :::

Below are some recommended models with strong coding capabilities:

| No. | Model slug                    | Highlights              |
| --- | ----------------------------- | ----------------------- |
| 1   | `openai/gpt-5-codex`          | Optimized for coding    |
| 2   | `openai/gpt-5`                | Strong generalist       |
| 3   | `anthropic/claude-sonnet-4.5` | Excellent reasoning     |
| 4   | `anthropic/claude-opus-4.1`   | Handles complex tasks   |
| 5   | `google/gemini-2.5-pro`       | Multimodal support      |
| 6   | `x-ai/grok-code-fast-1`       | Fast responses          |
| 7   | `x-ai/grok-4-fast`            | Efficient coding        |
| 8   | `deepseek/deepseek-chat`      | Cost-effective          |
| 9   | `qwen/qwen3-coder-plus`       | Chinese coding-friendly |
| 10  | `moonshotai/kimi-k2-0905`     | Long context support    |
| 11  | `z-ai/glm-4.6`                | Balanced capabilities   |
| 12  | `inclusionai/ring-1t`         | Strong reasoning        |

For more models, visit the [ZenMux Model List](https://zenmux.ai/models)!

## Troubleshooting

### Common issues

::: details API Key Error
**Problem**: API key is invalid or unauthorized

**Solution**:

- Check whether the `ZENMUX_API_KEY` environment variable is correctly set
- Verify the value with `echo $ZENMUX_API_KEY`
- Confirm the API key is active and has sufficient balance
- Ensure the API key format starts with `sk-ai-v1-`
  :::

::: details Connection Failure
**Problem**: Codex CLI cannot connect to the ZenMux service

**Solution**:

- Check your network connectivity
- Verify that `base_url` in `config.toml` is correctly set to `https://zenmux.ai/api/v1`
- Confirm that firewall settings do not block outgoing connections
- Try testing the connection with `curl https://zenmux.ai/api/v1/models`
  :::

::: details Environment Variables Not Taking Effect
**Problem**: API key still reported as not configured after setting it

**Solution**:

- Reopen the terminal window, or run `source ~/.zshrc` or `source ~/.bashrc` to reload the configuration
- Confirm the environment variable is set correctly: `echo $ZENMUX_API_KEY`
- Check that you added the environment variable to the correct shell configuration file (`.zshrc` for zsh users, `.bashrc` for bash users)
  :::

::: details Configuration File Path Issues
**Problem**: Changes to the configuration file are not taking effect

**Solution**:

- Confirm the configuration file path is `~/.codex/config.toml`
- If the directory doesn’t exist, create it first: `mkdir -p ~/.codex`
- Check that the file uses correct TOML syntax
- Verify the file contents with `cat ~/.codex/config.toml`
  :::

::: details Model Unavailable
**Problem**: The selected model is reported as unavailable or unsupported

**Solution**:

- Visit the [ZenMux Model List](https://zenmux.ai/models) to confirm availability
- Check for spelling errors in the model slug
- Try testing with other recommended models
- Confirm your account has permission to access the model
  :::

## Advanced Configuration

### Configure models of different sizes

You can switch between different model profiles in `config.toml` based on task requirements:

::: code-group

```toml [Balanced Configuration]
# Model selection balancing performance and cost
model_provider = "zenmux"
model = "anthropic/claude-sonnet-4.5"

[model_providers.zenmux]
name = "ZenMux"
base_url = "https://zenmux.ai/api/v1"
env_key = "ZENMUX_API_KEY"
```

```toml [Performance-First Configuration]
# Model selection prioritizing performance
model_provider = "zenmux"
model = "openai/gpt-5-codex"

[model_providers.zenmux]
name = "ZenMux"
base_url = "https://zenmux.ai/api/v1"
env_key = "ZENMUX_API_KEY"
```

```toml [Cost-Optimized Configuration]
# Model selection focusing on cost efficiency
model_provider = "zenmux"
model = "deepseek/deepseek-chat"

[model_providers.zenmux]
name = "ZenMux"
base_url = "https://zenmux.ai/api/v1"
env_key = "ZENMUX_API_KEY"
```

:::

::: tip Contact Us
If you encounter any issues during use or have suggestions and feedback, feel free to contact us:

- **Official Website**: <https://zenmux.ai>
- **Technical Support**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business Inquiries**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord Community**: <http://discord.gg/vHZZzj84Bm>

For more contact options and details, please visit our [Contact Us page](/help/contact).
:::
