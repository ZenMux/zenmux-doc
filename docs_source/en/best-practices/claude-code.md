# Guide to Using Claude Code via ZenMux

Claude Code is Anthropic’s official command-line tool. Through its integration with ZenMux, you can use a wider selection of models beyond the official Claude API. This guide will walk you through the complete configuration process.

## Overview

With the ZenMux + Claude Code Proxy combination, you can:

- Multiple model support: use all large language models available on the ZenMux platform
- Cost optimization: choose the pricing plan that best fits your needs
- High availability: benefit from ZenMux’s multi-vendor redundancy
- Seamless experience: retain the original Claude Code user experience

## Installation Steps

### 1. Install Claude Code

First, install Anthropic’s official Claude Code tool:

::: code-group

```bash [npm/pnpm]
# Install with pnpm (recommended)
pnpm install -g @anthropic-ai/claude-code

# Or install with npm
npm install -g @anthropic-ai/claude-code
```

:::

::: info Reference Docs
For detailed features and usage of Claude Code, see the [Official Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code/overview)
:::

### 2. Install Claude Code Proxy

Claude Code Proxy is an open-source project that proxies Claude Code requests to the ZenMux platform.

::: tip Open-source Contribution
Thanks to the project author [fuergaosi233](https://github.com/fuergaosi233).
:::

::: code-group

```bash [Using UV (recommended)]
# Clone the proxy repository
git clone https://github.com/fuergaosi233/claude-code-proxy.git
cd claude-code-proxy

# Install dependencies with UV
uv sync
```

```bash [Using pip]
# Clone the proxy repository
git clone https://github.com/fuergaosi233/claude-code-proxy.git
cd claude-code-proxy

# Install dependencies with pip
pip install -r requirements.txt
```

:::

### 3. Configure environment variables

Edit the `claude-code-proxy/.env` file to configure your ZenMux API information and preferred models:

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
Be sure to replace `sk-ai-v1-xxx` with your actual ZenMux API Key. You can obtain an API key from the [ZenMux Console](https://zenmux.ai/settings/keys)
:::

## Start the service

### 1. Start Claude Code Proxy

::: code-group

```bash [Start with UV]
# Change into the project directory
cd claude-code-proxy

# Load environment variables and start the service
source .env
uv run claude-code-proxy
```

```bash [Start with Python]
# Change into the project directory
cd claude-code-proxy

# Load environment variables and start the service
source .env
python -m claude-code-proxy
```

:::

After a successful start, you will see output similar to the following:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/FiEgoFH/claude-code-proxy.png" 
       alt="Claude Code Proxy running output" 
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

### 2. Start the Claude Code client

In a new terminal window, start the Claude Code client with:

```bash
ANTHROPIC_BASE_URL=http://localhost:8082 ANTHROPIC_API_KEY="any-value" claude  # [!code highlight]
```

::: tip Quick Access
You can add the following command to your shell configuration file to create a convenient alias:

```bash
# Add to your .bashrc or .zshrc
alias claude-zenmux='ANTHROPIC_BASE_URL=http://localhost:8082 ANTHROPIC_API_KEY="any-value" claude'
```

:::

## Usage

After configuration, you can use all models from ZenMux within Claude Code:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/KZuymll/claude-code.png" 
       alt="Claude Code usage demonstration" 
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

## Troubleshooting

### Common issues

::: details Connection failure
Issue: Claude Code cannot connect to the proxy service

Solution:

- Ensure the Claude Code Proxy is running
- Check whether port 8082 is occupied
- Verify that your firewall settings are not blocking local connections
  :::

::: details API Key error
Issue: API key is invalid or unauthorized

Solution:

- Check whether the ZenMux API key in the `.env` file is correct
- Confirm the API key is active and has sufficient balance
- Verify that the API key format starts with `sk-ai-v1-`
  :::

### Viewing logs

If you encounter issues, you can review the Claude Code Proxy’s log output for troubleshooting. The proxy service displays detailed request and response information to help you quickly locate the problem.

## Advanced configuration

### Customize model mapping

You can adjust the model mapping in the `.env` file based on your needs:

::: code-group

```bash [Cost-optimized configuration]
# Model choices focused on cost-effectiveness
BIG_MODEL="anthropic/claude-sonnet-4"
MIDDLE_MODEL="openai/gpt-5-mini"
SMALL_MODEL="openai/gpt-5-nana"
```

```bash [Performance-first configuration]
# Model choices focused on performance
BIG_MODEL="anthropic/claude-opus-4.1"
MIDDLE_MODEL="anthropic/claude-sonnet-4"
SMALL_MODEL="openai/gpt-5"
```

```bash [Balanced configuration]
# Model choices balancing performance and cost
BIG_MODEL="anthropic/claude-sonnet-4"
MIDDLE_MODEL="anthropic/claude-sonnet-4"
SMALL_MODEL="openai/gpt-5-mini"
```

:::

This approach allows you to achieve the best balance between performance and cost for different usage scenarios.

::: info More models
See the [ZenMux model list](https://zenmux.ai/models) for all available models and their details
:::