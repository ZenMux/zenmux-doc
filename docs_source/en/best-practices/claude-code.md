# Guide to Using Claude Code via ZenMux

Claude Code is Anthropic’s official coding agent. Through its integration with ZenMux, you can access a wider range of models beyond the official Claude API. This guide provides two usage patterns: a direct configuration approach and a proxy-based approach.

## Comparison of the Two Approaches

We provide two different approaches. Choose based on your specific needs:

| Feature         | Method 1: Direct Configuration | Method 2: Proxy-based Approach |
| --------------- | ------------------------------ | ------------------------------ |
| Complexity      | Simple, environment variables only | Moderate, requires proxy service installation |
| Model Support   | Currently supports Claude family only | Supports all models on the ZenMux platform |
| How to Start    | Launch Claude Code directly    | Start the proxy first          |
| Resource Usage  | Lightweight                    | Requires an additional proxy process |
| Use Case        | Fast migration for Claude users | Users who need multiple model options |

::: tip Recommendations

- If you primarily use the Claude family, we recommend Method 1 for simpler configuration.
- If you need to switch among multiple models, we recommend Method 2 for broader capabilities.
  :::

## Method 1: Direct Configuration (Claude Models)

### Install Claude Code

::: code-group

```bash [npm/pnpm]
# Install with pnpm (recommended)
pnpm install -g @anthropic-ai/claude-code

# Or install with npm
npm install -g @anthropic-ai/claude-code
```

:::

### Configure Environment Variables

Set the following environment variables to use ZenMux in the Anthropic API format:

```bash
# Set ZenMux API base URL (Anthropic format)
export ANTHROPIC_BASE_URL=https://zenmux.ai/api   # [!code highlight]

# Set your ZenMux API Key
export ANTHROPIC_AUTH_TOKEN=sk-ai-v1-xxx  # [!code highlight]

# Specify the model to use (Claude family)
export ANTHROPIC_MODEL=anthropic/claude-sonnet-4  # [!code highlight]
export ANTHROPIC_SMALL_FAST_MODEL=anthropic/claude-sonnet-4  # [!code highlight]

```

::: warning Important Configuration
Be sure to replace `sk-ai-v1-xxx` with your actual ZenMux API key. You can obtain your API key in the [ZenMux Console](https://zenmux.ai/settings/keys).
:::

### Start Directly

After configuring the environment variables, navigate to your project directory and start Claude Code:

```bash
# Go to your project directory
cd my-project

# Start Claude Code directly
claude  # [!code highlight]
```

::: tip Convenient Usage
You can add the environment variable configuration to your shell profile to avoid setting them every time:

```bash
# Add to your .bashrc or .zshrc
export ANTHROPIC_BASE_URL=https://zenmux.ai/api 
export ANTHROPIC_AUTH_TOKEN=sk-ai-v1-xxx
export ANTHROPIC_MODEL=anthropic/claude-sonnet-4
export ANTHROPIC_SMALL_FAST_MODEL=anthropic/claude-sonnet-4
```

:::

### Recommended Models

We recommend the following Claude models:

- `anthropic/claude-opus-4.1` - Highest performance but the most expensive; mind your usage costs.
- `anthropic/claude-sonnet-4` - Balanced performance and speed (recommended).
- `anthropic/claude-3.5-haiku` - Fastest lightweight model.

---

## Method 2: Proxy-based Approach (Full Model Support)

If you need to use all models available on the ZenMux platform (including GPT, Gemini, etc.), use the proxy-based approach.

### Installation Steps

#### 1. Install Claude Code

First, install Anthropic’s official Claude Code tool:

::: code-group

```bash [npm/pnpm]
# Install with pnpm (recommended)
pnpm install -g @anthropic-ai/claude-code

# Or install with npm
npm install -g @anthropic-ai/claude-code
```

:::

::: info Reference
For Claude Code’s detailed features and usage, see the [official Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code/overview).
:::

#### 2. Install Claude Code Proxy

Claude Code Proxy is an open-source project that proxies Claude Code requests to the ZenMux platform.

::: tip Open Source Acknowledgement
Thanks to the project author [fuergaosi233](https://github.com/fuergaosi233).
:::

::: code-group

```bash [Using UV (Recommended)]
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

#### 3. Configure Environment Variables

Edit the `.env` file in the claude-code-proxy project to configure your ZenMux API info and preferred models:

```bash
# Copy .env.example to .env; skip if .env already exists
cp .env.example .env

# ZenMux API Key
OPENAI_API_KEY="sk-ai-v1-xxx"  # [!code highlight]

# ZenMux API base URL
OPENAI_BASE_URL="https://zenmux.ai/api/v1"  # [!code highlight]

# Model mapping (optional)
BIG_MODEL="anthropic/claude-opus-4.1"  # [!code highlight]
MIDDLE_MODEL="anthropic/claude-sonnet-4"  # [!code highlight]
SMALL_MODEL="openai/gpt-4o-mini"  # [!code highlight]
```

::: warning Important Configuration
Be sure to replace `sk-ai-v1-xxx` with your actual ZenMux API key. You can obtain your API key in the [ZenMux Console](https://zenmux.ai/settings/keys)
:::

### Start the Services

#### 1. Start Claude Code Proxy

::: code-group

```bash [Start with UV]
# Enter the project directory
cd claude-code-proxy

# Load environment variables and start the service
source .env
uv run claude-code-proxy
```

```bash [Start with Python]
# Enter the project directory
cd claude-code-proxy

# Load environment variables and start the service
source .env
python -m claude-code-proxy
```

:::

Upon successful startup, you will see output similar to the following:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/FiEgoFH/claude-code-proxy.png" 
       alt="Claude Code Proxy runtime output" 
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

#### 2. Start the Claude Code Client

In a new terminal window, start the Claude Code client with:

```bash
ANTHROPIC_BASE_URL=http://localhost:8082 ANTHROPIC_API_KEY="any-value" claude  # [!code highlight]
```

::: tip Convenient Usage
You can add the command above to your shell profile to create a handy alias:

```bash
# Add to your .bashrc or .zshrc
alias claude-zenmux='ANTHROPIC_BASE_URL=http://localhost:8082 ANTHROPIC_API_KEY="any-value" claude'
```

:::

### Supported Models

Method 2, via the proxy approach, supports all models on the ZenMux platform, including:

- Claude family: `anthropic/claude-opus-4.1`, `anthropic/claude-sonnet-4`, `anthropic/claude-haiku-4`
- GPT family: `openai/gpt-5`, `openai/gpt-4o`, `openai/gpt-4o-mini`, `openai/gpt-5-mini`, `openai/gpt-5-nana`
- Gemini family: `google/gemini-pro`, `google/gemini-flash`
- Other models: See the [ZenMux model list](https://zenmux.ai/models) for more

### Usage

After configuration, you can use all ZenMux models inside Claude Code:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/KZuymll/claude-code.png" 
       alt="Claude Code usage demo" 
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

## Troubleshooting

### Common Issues

::: details Connection failure
Problem: Claude Code cannot connect to the proxy service.

Solution:

- Ensure Claude Code Proxy is running.
- Check whether port 8082 is occupied.
- Verify that firewall settings are not blocking local connections.
  :::

::: details API Key errors
Problem: API key is reported as invalid or unauthorized.

Solution:

- Check whether the ZenMux API key in your `.env` file is correct.
- Confirm the API key is active and has sufficient balance.
- Verify the API key format starts with `sk-ai-v1-`.
  :::

### Viewing Logs

If you encounter issues, check the Claude Code Proxy’s log output for troubleshooting. The proxy service displays detailed request and response information to help you quickly locate the problem.

## Advanced Configuration

### Custom Model Mapping

You can adjust the model mapping in the `.env` file as needed:

::: code-group

```bash [Cost-optimized]
# Model choices focused on cost-effectiveness
BIG_MODEL="anthropic/claude-sonnet-4"
MIDDLE_MODEL="openai/gpt-5-mini"
SMALL_MODEL="openai/gpt-5-nana"
```

```bash [Performance-first]
# Model choices focused on performance
BIG_MODEL="anthropic/claude-opus-4.1"
MIDDLE_MODEL="anthropic/claude-sonnet-4"
SMALL_MODEL="openai/gpt-5"
```

```bash [Balanced]
# Model choices balancing performance and cost
BIG_MODEL="anthropic/claude-sonnet-4"
MIDDLE_MODEL="anthropic/claude-sonnet-4"
SMALL_MODEL="openai/gpt-5-mini"
```

:::

This lets you achieve the best balance of performance and cost in different usage scenarios.

::: info More Models
See the [ZenMux model list](https://zenmux.ai/models) for all available models and details.
:::