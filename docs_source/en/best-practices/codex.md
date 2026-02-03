---
head:
  - - meta
    - name: description
      content: Guide to using Codex CLI with ZenMux
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, codex, OpenAI, API
---

# Guide to Using Codex CLI with ZenMux

Codex CLI is an open-source programming assistant from OpenAI that runs in your local terminal. It can read, modify, and run code within a directory you choose. Built with Rust, it is fast and efficient, and is continuously improved on GitHub. By integrating with ZenMux, you gain access to more model options instead of being limited to the official OpenAI API.

::: info Compatibility Notes
OpenAI has explicitly positioned Responses as the next-generation unified interface. Chat Completions is still available, but it is no longer the preferred choice for new projects. Codex will follow this direction as well—treating Chat Completions as a compatibility option and gradually migrating to Responses (the configuration in this article uses Responses).

Note the OpenAI-compatible setting: base_url="https://zenmux.ai/api/v1".
:::

## Configuration Options

### Install Codex CLI

::: code-group

```bash [npm/pnpm]
# Install with pnpm (recommended)
pnpm install -g @openai/codex

# Or install with npm
npm install -g @openai/codex
```

:::

### Configure Environment Variables

Add your ZenMux API Key to your shell configuration file:

```bash
# Edit ~/.zshrc or ~/.bashrc depending on the terminal you use
export ZENMUX_API_KEY="sk-ai-v1-xxx"  # [!code highlight]
```

::: warning Important
Make sure to replace `sk-ai-v1-xxx` with your actual ZenMux API Key. You can obtain an API Key in the [ZenMux Console](https://zenmux.ai/settings/keys).
:::

### Configure Codex

Create or modify the Codex configuration file `~/.codex/config.toml`:

```toml
model_provider = "zenmux"  # [!code highlight]
model = "openai/gpt-5.2-codex"  # [!code highlight]

[model_providers.zenmux]  # [!code highlight]
name = "ZenMux"  # [!code highlight]
base_url = "https://zenmux.ai/api/v1"  # [!code highlight]
env_key = "ZENMUX_API_KEY"  # [!code highlight]
wire_api = "responses"  # [!code highlight]
```

::: tip Configuration Notes

- `model_provider`: Use ZenMux as the model provider
- `model`: The model to use; can be any model supported by ZenMux
- `base_url`: The base URL of the ZenMux API
- `env_key`: The name of the environment variable that stores the API Key
- `wire_api`: Use the Responses protocol (recommended)
  :::

### Start Using It Immediately

After configuration, reload your shell configuration and start Codex:

```bash
# Reload configuration
source ~/.zshrc  # or source ~/.bashrc

# Enter your project directory
cd my-project

# Start Codex CLI
codex  # [!code highlight]
```

::: tip Convenience
After adding the environment variable to your shell configuration file, you won’t need to set it manually each time. The configuration will apply automatically every time you open a new terminal.
:::

## Supported Models

You can freely switch the `model` field in `config.toml` to any model supported by ZenMux.

::: info Get the Model List

- View models available under the Responses protocol via the [ZenMux model list](https://zenmux.ai/models?sort=newest&supported_protocol=responses)
- Use the model slug (e.g., `openai/gpt-5.2-codex`)
- To target a specific provider, see the [Provider Routing documentation](/en/guide/provider-routing)
  :::

Below are some recommended models with strong coding performance:

| #  | Model slug                   | Highlights               |
| -- | ---------------------------- | ------------------------ |
| 1  | `openai/gpt-5.2-codex`        | Coding-optimized         |
| 2  | `openai/gpt-5.2`              | Strong general capability |
| 3  | `anthropic/claude-sonnet-4.5` | Excellent reasoning      |
| 4  | `anthropic/claude-opus-4.1`   | Complex tasks            |
| 5  | `google/gemini-2.5-pro`       | Multimodal support       |
| 6  | `x-ai/grok-code-fast-1`       | Fast responses           |
| 7  | `x-ai/grok-4-fast`            | Efficient coding         |
| 8  | `deepseek/deepseek-chat`      | Cost-effective           |
| 9  | `qwen/qwen3-coder-plus`       | Chinese-friendly coding  |
| 10 | `moonshotai/kimi-k2-0905`     | Long-context support     |
| 11 | `z-ai/glm-4.6`                | Balanced overall         |
| 12 | `inclusionai/ring-1t`         | Strong reasoning         |

For more models, see the [ZenMux model list](https://zenmux.ai/models?sort=newest&supported_protocol=responses).

### Responses-Compatible Models (Fetched on 2026-01-29)

The list below is fetched from the [ZenMux model list (Responses filter)](https://zenmux.ai/models?sort=newest&supported_protocol=responses). Use that link for the latest updates.

::: details Model slug list (Responses)

```
inclusionai/llada2.0-flash-cap
z-ai/glm-4.7
minimax/minimax-m2.1
volcengine/doubao-seed-1.8
google/gemini-3-flash-preview
google/gemini-3-flash-preview-free
xiaomi/mimo-v2-flash
xiaomi/mimo-v2-flash-free
openai/gpt-5.2-codex
openai/gpt-5.2-pro
openai/gpt-5.2
openai/gpt-5.2-chat
z-ai/glm-4.6v
z-ai/glm-4.6v-flash-free
z-ai/glm-4.6v-flash
deepseek/deepseek-v3.2
mistralai/mistral-large-2512
deepseek/deepseek-chat
deepseek/deepseek-reasoner
anthropic/claude-opus-4.5
google/gemini-3-pro-image-preview
x-ai/grok-4.1-fast
x-ai/grok-4.1-fast-non-reasoning
google/gemini-3-pro-preview
openai/gpt-5.1
openai/gpt-5.1-chat
openai/gpt-5.1-codex
openai/gpt-5.1-codex-mini
baidu/ernie-5.0-thinking-preview
volcengine/doubao-seed-code
moonshotai/kimi-k2-thinking
moonshotai/kimi-k2-thinking-turbo
qwen/qwen3-max-preview
inclusionai/ming-flash-omni-preview
minimax/minimax-m2
kuaishou/kat-coder-pro-v1
kuaishou/kat-coder-pro-v1-free
anthropic/claude-haiku-4.5
inclusionai/ring-1t
inclusionai/ling-1t
google/gemini-2.5-flash-image
openai/gpt-5-pro
z-ai/glm-4.6
anthropic/claude-sonnet-4.5
deepseek/deepseek-v3.2-exp
openai/gpt-5-codex
qwen/qwen3-max
qwen/qwen3-vl-plus
x-ai/grok-4-fast
x-ai/grok-4-fast-non-reasoning
inclusionai/ling-flash-2.0
inclusionai/ring-flash-2.0
baidu/ernie-x1.1-preview
moonshotai/kimi-k2-0905
inclusionai/ling-mini-2.0
inclusionai/ring-mini-2.0
x-ai/grok-code-fast-1
deepseek/deepseek-chat-v3.1
volcengine/doubao-seed-1-6-vision
openai/gpt-5
openai/gpt-5-chat
openai/gpt-5-mini
openai/gpt-5-nano
anthropic/claude-opus-4.1
stepfun/step-3
z-ai/glm-4.5
z-ai/glm-4.5-air
qwen/qwen3-coder-plus
google/gemini-2.5-flash-lite
qwen/qwen3-235b-a22b-2507
qwen/qwen3-235b-a22b-thinking-2507
qwen/qwen3-coder
moonshotai/kimi-k2-0711
x-ai/grok-4
google/gemini-2.5-flash
google/gemini-2.5-pro
deepseek/deepseek-r1-0528
anthropic/claude-opus-4
anthropic/claude-sonnet-4
google/gemma-3-12b-it
qwen/qwen3-14b
openai/o4-mini
openai/gpt-4.1
openai/gpt-4.1-mini
openai/gpt-4.1-nano
meta/llama-4-scout-17b-16e-instruct
google/gemini-2.0-flash-lite-001
anthropic/claude-3.7-sonnet
google/gemini-2.0-flash
meta/llama-3.3-70b-instruct
anthropic/claude-3.5-haiku
anthropic/claude-3.5-sonnet
openai/gpt-4o-mini
openai/gpt-4o
```

:::

## Troubleshooting

### Common Issues

::: details API Key Error
**Issue**: You are told the API Key is invalid or unauthorized.

**Solutions**:

- Check whether the environment variable `ZENMUX_API_KEY` is set correctly
- Use `echo $ZENMUX_API_KEY` to verify the environment variable value
- Confirm the API Key is active and that you have sufficient balance
- Verify the API Key format starts with `sk-ai-v1-`
  :::

::: details Connection Failure
**Issue**: Codex CLI cannot connect to the ZenMux service.

**Solutions**:

- Check that your network connection is working
- Verify that `base_url` in `config.toml` is correctly set to `https://zenmux.ai/api/v1`
- Confirm your firewall settings are not blocking outbound connections
- Try `curl https://zenmux.ai/api/v1/models` to test connectivity
  :::

::: details Environment Variable Not Taking Effect
**Issue**: Even after setting the API Key, it still says it is not configured.

**Solutions**:

- Reopen the terminal window, or run `source ~/.zshrc` or `source ~/.bashrc` to reload the configuration
- Confirm the environment variable is set correctly: `echo $ZENMUX_API_KEY`
- Make sure you added it to the correct shell configuration file (`.zshrc` for zsh, `.bashrc` for bash)
  :::

::: details Configuration File Path Issue
**Issue**: Changes to the configuration file do not take effect.

**Solutions**:

- Confirm the configuration file path is `~/.codex/config.toml`
- If the directory does not exist, create it first: `mkdir -p ~/.codex`
- Check that the configuration file syntax is correct (TOML format)
- Use `cat ~/.codex/config.toml` to verify the file contents
  :::

::: details Model Unavailable
**Issue**: A model is reported as unavailable or unsupported.

**Solutions**:

- Visit the [ZenMux model list](https://zenmux.ai/models?sort=newest&supported_protocol=responses) to confirm the model is available
- Check that the model slug is spelled correctly
- Try another recommended model to test
- Confirm your account has permission to access the model
  :::

## Advanced Configuration

### Configure Models of Different Sizes

You can switch between different model sizes in `config.toml` based on your task requirements:

::: code-group

```toml [Balanced Setup]
# Model choice that balances performance and cost
model_provider = "zenmux"
model = "anthropic/claude-sonnet-4.5"

[model_providers.zenmux]
name = "ZenMux"
base_url = "https://zenmux.ai/api/v1"
env_key = "ZENMUX_API_KEY"
wire_api = "responses"
```

```toml [Performance-First Setup]
# Model choice optimized for performance
model_provider = "zenmux"
model = "openai/gpt-5.2-codex"

[model_providers.zenmux]
name = "ZenMux"
base_url = "https://zenmux.ai/api/v1"
env_key = "ZENMUX_API_KEY"
wire_api = "responses"
```

```toml [Cost-Optimized Setup]
# Model choice optimized for cost efficiency
model_provider = "zenmux"
model = "deepseek/deepseek-chat"

[model_providers.zenmux]
name = "ZenMux"
base_url = "https://zenmux.ai/api/v1"
env_key = "ZENMUX_API_KEY"
wire_api = "responses"
```

:::

::: tip Contact Us
If you run into any issues during use, or if you have suggestions or feedback, feel free to contact us via:

- **Official website**: <https://zenmux.ai>
- **Technical support email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business inquiries**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord community**: <http://discord.gg/vHZZzj84Bm>

For more contact methods and details, please visit our [Contact page](/en/help/contact).
:::
