# Claude Code CLI Guide via ZenMux

Claude Code is Anthropic’s official coding agent. Through its integration with ZenMux, you can access more model options beyond the official Claude API.

::: info Compatibility Notes
ZenMux fully supports the Anthropic API protocol and can be seamlessly integrated with tools like Claude Code and Cursor. You only need to modify two parameters.

Note that the Anthropic protocol base_url is "<https://zenmux.ai/api/anthropic>".
:::

## Configuration Guide

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

Claude Code supports using a configuration file to set environment variables. Edit or create the `~/.claude/settings.json` file and add the following configuration:

```bash
# If the .claude directory does not exist, create it first
mkdir -p ~/.claude

# Create or edit the configuration file
nano ~/.claude/settings.json  # Or use other editors like vim, code, etc.
```

Add the following content to the configuration file:

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-ai-v1-xxx",
    "ANTHROPIC_BASE_URL": "https://zenmux.ai/api/anthropic",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "anthropic/claude-haiku-4.5",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "anthropic/claude-sonnet-4.5",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "anthropic/claude-opus-4.5"
  }
}
```

::: warning Important Configuration
Make sure to replace `sk-ai-v1-xxx` with your actual ZenMux API Key. You can obtain the API Key from the [ZenMux Console](https://zenmux.ai/settings/keys).
:::

::: tip Configuration Notes

- `ANTHROPIC_AUTH_TOKEN`: Your ZenMux API Key
- `ANTHROPIC_BASE_URL`: ZenMux Anthropic API endpoint
- `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`: Disable nonessential traffic
- `ANTHROPIC_DEFAULT_HAIKU_MODEL`: Set the default Haiku model (for quick tasks)
- `ANTHROPIC_DEFAULT_SONNET_MODEL`: Set the default Sonnet model (for general tasks)
- `ANTHROPIC_DEFAULT_OPUS_MODEL`: Set the default Opus model (for complex tasks)
  :::

### Start Using Immediately

After configuring `settings.json`, go to your project directory and start Claude Code:

```bash
# Navigate to the project directory
cd my-project

# Start Claude Code
claude  # [!code highlight]
```

::: tip Convenient Usage
Using a configuration file is more convenient—no need to manually set environment variables each time. The configuration will be automatically loaded whenever you start Claude Code.
:::

### Supported Models

::: info Anthropic Protocol Supported Models
Models that support the Anthropic protocol are being adapted in batches. You can view currently supported models by filtering "Anthropic API Compatible" in the [official model list](https://zenmux.ai/models):
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/602FqX9/anthropic-support.png)
Alternatively, check the [model detail page](https://zenmux.ai/anthropic/claude-haiku-4.5):
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/I9JHS8b/detail-anthropic-support.png)
:::

Below is a recommended list of models with strong coding capabilities. For the complete set of models supporting the Anthropic protocol, please use the methods described above.

| 模型 slug                        |
| -------------------------------- |
| `anthropic/claude-sonnet-4.5`    |
| `anthropic/claude-opus-4.5`      |
|`google/gemini-3-pro-preview`|
|`openai/gpt-5.1-codex`|
|`openai/gpt-5.1-codex-mini`|
| `anthropic/claude-opus-4.1`      |
|`baidu/ernie-5.0-thinking-preview`|
|`volcengine/doubao-seed-code`|
|`moonshotai/kimi-k2-thinking`|
|`moonshotai/kimi-k2-thinking-turbo`|
|`minimax/minimax-m2`|
|`kuaishou/kat-coder-pro-v1`|
| `anthropic/claude-haiku-4.5`     |
| `google/gemini-2.5-pro`          |
| `openai/gpt-5-codex`             |
| `openai/gpt-5`                   |
| `x-ai/grok-4-fast`               |
| `x-ai/grok-code-fast-1`          |
| `x-ai/grok-4-fast-non-reasoning` |
| `deepseek/deepseek-chat`         |
| `qwen/qwen3-coder-plus`          |
| `moonshotai/kimi-k2-0905`        |
| `z-ai/glm-4.6`                   |
| `z-ai/glm-4.5-air`               |
| `inclusionai/ring-1t`            |
| `inclusionai/ling-1t`            |

For more models, refer to the Anthropic protocol support notes above!

## Usage Experience

Once configured, you can use ZenMux’s diverse models within Claude Code:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/GxOgGlh/claude-code-v2.png"
       alt="Claude Code"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

You can use the '/model' command to verify the currently active model:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/MOGcIN5/claude-code-v2-model.png"
       alt="Claude Code Model"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

## Troubleshooting

### Common Issues

::: details API Key Error
**Issue**: API Key is reported as invalid or unauthorized

**Solution**:

- Check whether the ZenMux API Key in your environment variables is correct
- Ensure the API Key is active and has sufficient balance
- Verify the API Key format starts with `sk-ai-v1-`
  :::

::: details Model Not Compatible with Anthropic Protocol
**Issue**: When using a model, you are prompted that it does not support the Anthropic protocol

**Solution**:

- Filter "Anthropic API Compatible" in the [ZenMux model list](https://zenmux.ai/models) to see currently supported models
- Or visit the specific model’s detail page to confirm Anthropic protocol support
- Choose a model from the supported list above
  :::

::: details Connection Failure
**Issue**: Claude Code fails to connect to the ZenMux service

**Solution**:

- Check whether your network connection is normal
- Verify `ANTHROPIC_BASE_URL` is correctly set to `https://zenmux.ai/api/anthropic`
- Confirm that firewall settings are not blocking outbound connections
  :::

::: details Configuration File Not Taking Effect
**Issue**: settings.json configuration is set but not applied

**Solution**:

- Confirm the configuration file path is `~/.claude/settings.json`
- Check whether the JSON format is valid (note: the JSON standard does not support comments; remove any comments)
- Use `cat ~/.claude/settings.json` to verify the file contents
- Restart Claude Code to load the latest configuration
  :::

::: details VSCode Claude Code Extension Configuration
**Issue**: Issues encountered in the VSCode Claude Code extension’s GUI mode

**Solution**:

You can configure Claude Code’s model directly in the VSCode extension settings by setting it to the model slug from your configuration file. See the screenshots below:

![VSCode Claude Code Extension Configuration](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/alNj8F2/cc-plugin-settings.png)
![VSCode Claude Code Extension Configuration](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/S7fuYF9/cc-plugin-model.png)
:::

## Advanced Configuration

### Configure Models of Different Sizes

You can configure different model sizes in `~/.claude/settings.json` based on task requirements:

::: code-group

```json [Balanced Configuration]
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-ai-v1-xxx",
    "ANTHROPIC_BASE_URL": "https://zenmux.ai/api/anthropic",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "anthropic/claude-haiku-4.5",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "anthropic/claude-sonnet-4.5",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "anthropic/claude-opus-4.5"
  }
}
```

```json [Performance-First Configuration]
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-ai-v1-xxx",
    "ANTHROPIC_BASE_URL": "https://zenmux.ai/api/anthropic",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "anthropic/claude-sonnet-4.5",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "anthropic/claude-opus-4.5",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "google/gemini-2.5-pro"
  }
}
```

```json [Cost-Optimized Configuration]
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-ai-v1-xxx",
    "ANTHROPIC_BASE_URL": "https://zenmux.ai/api/anthropic",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek/deepseek-chat",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "moonshotai/kimi-k2-0905",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "qwen/qwen3-coder-plus"
  }
}
```

:::

This approach helps you achieve the best balance of performance and cost across different usage scenarios.

::: info More Models
See the [ZenMux model list](https://zenmux.ai/models) for all available models and their details.
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
