# Using Claude Code with ZenMux Guide

Claude Code is the official command-line tool launched by Anthropic. Through integration with ZenMux, you can access more model options beyond just the official Claude API. This guide will walk you through the complete configuration process.

## Overview

With the ZenMux + Claude Code Proxy combination, you can:

- **Multi-model Support**: Use all large language models available on the ZenMux platform
- **Cost Optimization**: Choose the pricing plan that best fits your needs
- **High Availability**: Enjoy ZenMux's multi-vendor redundancy protection
- **Seamless Experience**: Maintain the original Claude Code user experience

## Installation Steps

### 1. Install Claude Code

First, install the official Claude Code tool from Anthropic:

::: code-group

```bash [npm/pnpm]
# Install using pnpm (recommended)
pnpm install -g @anthropic-ai/claude-code

# Or install using npm
npm install -g @anthropic-ai/claude-code
```

```bash [Launch Command]
# Navigate to your project directory
cd your-awesome-project

# Launch Claude Code
claude
```

:::

::: info Reference Documentation
For detailed features and usage instructions for Claude Code, please refer to the [Claude Code Official Documentation](https://docs.anthropic.com/en/docs/claude-code/overview)
:::

### 2. Install Claude Code Proxy

Claude Code Proxy is an open-source project that can proxy Claude Code requests to the ZenMux platform.

::: tip Open Source Contribution
Thanks to [fuergaosi233](https://github.com/fuergaosi233) for the open-source contribution
:::

::: code-group

```bash [Using UV (Recommended)]
# Clone the proxy repository
git clone https://github.com/anthropic/claude-code-proxy.git
cd claude-code-proxy

# Install dependencies using UV
uv sync
```

```bash [Using pip]
# Clone the proxy repository
git clone https://github.com/anthropic/claude-code-proxy.git
cd claude-code-proxy

# Install dependencies using pip
pip install -r requirements.txt
```

:::

### 3. Configure Environment Variables

Modify the `claude-code-proxy/.env` file to configure your ZenMux API information and preferred models:

```bash
# ZenMux API Key
OPENAI_API_KEY="sk-ai-v1-xxx"  # [!code highlight]

# ZenMux API Base URL
OPENAI_BASE_URL="https://zenmux.ai/api/v1"  # [!code highlight]

# Model mapping configuration (optional)
BIG_MODEL="anthropic/claude-opus-4.1"  # [!code highlight]
MIDDLE_MODEL="anthropic/claude-sonnet-4"  # [!code highlight]
SMALL_MODEL="openai/gpt-4o-mini"  # [!code highlight]
```

::: warning Important Configuration
Please make sure to replace `sk-ai-v1-xxx` with your actual ZenMux API Key. You can obtain your API Key from the [ZenMux Console](https://zenmux.ai/settings/keys)
:::

## Starting the Service

### 1. Start Claude Code Proxy

::: code-group

```bash [UV Launch]
# Enter the project directory
cd claude-code-proxy

# Load environment variables and start the service
source .env
uv run claude-code-proxy
```

```bash [Python Launch]
# Enter the project directory
cd claude-code-proxy

# Load environment variables and start the service
source .env
python -m claude-code-proxy
```

:::

After successful startup, you will see output similar to the following:

![Claude Code Proxy Running Effect](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/FiEgoFH/claude-code-proxy.png)

### 2. Start Claude Code Client

In a new terminal window, use the following command to start the Claude Code client:

```bash
ANTHROPIC_BASE_URL=http://localhost:8082 ANTHROPIC_API_KEY="any-value" claude  # [!code highlight]
```

::: tip Convenient Usage
You can add the above command to your shell configuration file to create a convenient alias:

```bash
# Add to your .bashrc or .zshrc file
alias claude-zenmux='ANTHROPIC_BASE_URL=http://localhost:8082 ANTHROPIC_API_KEY="any-value" claude'
```
:::

## Usage Results

After configuration is complete, you can use all ZenMux models in Claude Code:

![Claude Code Usage Demo](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/KZuymll/claude-code.png)

## Troubleshooting

### Common Issue Solutions

::: details Connection Failure Issues
**Problem**: Claude Code cannot connect to the proxy service

**Solutions**:
- Ensure Claude Code Proxy is running
- Check if port 8082 is occupied
- Verify firewall settings are not blocking local connections
:::

::: details API Key Errors
**Problem**: Invalid or unauthorized API Key error

**Solutions**:
- Check if the ZenMux API Key in the `.env` file is correct
- Confirm the API Key is activated and has sufficient balance
- Verify the API Key format starts with `sk-ai-v1-`
:::

::: details Model Unavailable
**Problem**: Selected model cannot be used

**Solutions**:
- Confirm the model name is correct (case-sensitive)
- Check if the model is available on the ZenMux platform
- Review the model list in the ZenMux console
:::

### Log Viewing

If you encounter issues, you can check the Claude Code Proxy log output to troubleshoot problems. The proxy service will display detailed request and response information to help you quickly locate issues.

## Advanced Configuration

### Custom Model Mapping

You can adjust the model mapping in the `.env` file according to different needs:

::: code-group

```bash [Cost-Optimized Configuration]
# Cost-effective model selection
BIG_MODEL="anthropic/claude-sonnet-4"
MIDDLE_MODEL="openai/gpt-4o"
SMALL_MODEL="openai/gpt-4o-mini"
```

```bash [Performance-First Configuration]
# Performance-focused model selection
BIG_MODEL="anthropic/claude-opus-4.1"
MIDDLE_MODEL="anthropic/claude-sonnet-4"
SMALL_MODEL="anthropic/claude-haiku-4"
```

```bash [Balanced Configuration]
# Balanced performance and cost model selection
BIG_MODEL="anthropic/claude-sonnet-4"
MIDDLE_MODEL="openai/gpt-4o"
SMALL_MODEL="anthropic/claude-haiku-4"
```

:::

This way, you can achieve optimal performance and cost balance in different usage scenarios.

::: info More Models
Check the [ZenMux Model List](https://zenmux.ai/models) to learn about all available models and their detailed information
:::