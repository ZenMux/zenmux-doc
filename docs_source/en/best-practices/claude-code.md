# Using Claude Code with ZenMux Guide

Claude Code is the official command-line tool from Anthropic. Through integration with ZenMux, you can access more model options beyond just the official Claude API. This guide will help you complete the full configuration process.

## Overview

With the ZenMux + Claude Code Proxy combination, you can:

- **Multi-model Support**: Use all large language models available on the ZenMux platform
- **Cost Optimization**: Choose the pricing plan that best fits your needs
- **High Availability**: Enjoy ZenMux's multi-provider redundancy guarantees
- **Seamless Experience**: Maintain the original Claude Code user experience

## Installation Steps

### 1. Install Claude Code

First, install Anthropic's official Claude Code tool:

::: code-group

```bash [npm/pnpm]
# Install with pnpm (recommended)
pnpm install -g @anthropic-ai/claude-code

# Or install with npm
npm install -g @anthropic-ai/claude-code
```

:::

::: info Reference Documentation
For detailed features and usage of Claude Code, please refer to the [Claude Code Official Documentation](https://docs.anthropic.com/en/docs/claude-code/overview)
:::

### 2. Install Claude Code Proxy

Claude Code Proxy is an open-source project that can proxy Claude Code requests to the ZenMux platform.

::: tip Open Source Contribution
Thanks to the project author [fuergaosi233](https://github.com/fuergaosi233).
:::

::: code-group

```bash [Using UV (Recommended)]
# Clone the proxy repository
git clone https://github.com/fuergaosi233/claude-code-proxy.git
cd claude-code-proxy

# Install dependencies using UV
uv sync
```

```bash [Using pip]
# Clone the proxy repository
git clone https://github.com/fuergaosi233/claude-code-proxy.git
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
Please ensure to replace `sk-ai-v1-xxx` with your actual ZenMux API Key. You can obtain your API Key from the [ZenMux Console](https://zenmux.ai/settings/keys)
:::

## Starting the Service

### 1. Start Claude Code Proxy

::: code-group

```bash [UV Launch]
# Enter project directory
cd claude-code-proxy

# Load environment variables and start service
source .env
uv run claude-code-proxy
```

```bash [Python Launch]
# Enter project directory
cd claude-code-proxy

# Load environment variables and start service
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
# Add to .bashrc or .zshrc file
alias claude-zenmux='ANTHROPIC_BASE_URL=http://localhost:8082 ANTHROPIC_API_KEY="any-value" claude'
```

:::

## Usage Effect

After configuration is complete, you can use all ZenMux models in Claude Code:

![Claude Code Usage Demonstration](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/KZuymll/claude-code.png)

## Troubleshooting

### Common Issue Solutions

::: details Connection Failure Issues
**Issue**: Claude Code cannot connect to the proxy service

**Solution**:

- Ensure Claude Code Proxy is running
- Check if port 8082 is occupied
- Verify firewall settings are not blocking local connections
:::

::: details API Key Error
**Issue**: Invalid or unauthorized API Key prompt

**Solution**:

- Check if the ZenMux API Key in the `.env` file is correct
- Confirm if the API Key is activated and has sufficient balance
- Verify the API Key format starts with `sk-ai-v1-`
:::

### Log Viewing

If you encounter issues, you can check the Claude Code Proxy log output to troubleshoot problems. The proxy service displays detailed request and response information to help you quickly locate issues.

## Advanced Configuration

### Custom Model Mapping

You can adjust the model mapping in the `.env` file according to different needs:

::: code-group

```bash [Cost-Optimized Configuration]
# Cost-effective model selection
BIG_MODEL="anthropic/claude-sonnet-4"
MIDDLE_MODEL="openai/gpt-5-mini"
SMALL_MODEL="openai/gpt-5-nana"
```

```bash [Performance-First Configuration]
# Performance-focused model selection
BIG_MODEL="anthropic/claude-opus-4.1"
MIDDLE_MODEL="anthropic/claude-sonnet-4"
SMALL_MODEL="openai/gpt-5"
```

```bash [Balanced Configuration]
# Balanced performance and cost model selection
BIG_MODEL="anthropic/claude-sonnet-4"
MIDDLE_MODEL="anthropic/claude-sonnet-4"
SMALL_MODEL="openai/gpt-5-mini"
```

:::

This way, you can achieve the best balance of performance and cost in different usage scenarios.

::: info More Models
Check the [ZenMux Model List](https://zenmux.ai/models) for all available models and their detailed information
:::