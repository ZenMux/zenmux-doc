---
head:
  - - meta
    - name: description
      content: Use ZenMux with OpenClaw via the published ClawHub plugin — one install command unlocks 135+ models with dynamic discovery
  - - meta
    - name: keywords
      content: Zenmux, OpenClaw, ClawHub, plugin, integration, AI gateway, GPT-5.4, Claude Opus 4.7, Grok 4.3, Gemini 3.1, model aggregation
---

# Guide to Using OpenClaw with ZenMux

[OpenClaw](https://github.com/openclaw/openclaw) is a personal AI assistant that runs on your own machine and answers you on the channels you already use (terminal TUI, web dashboard, WhatsApp, Telegram, Discord, Slack, Signal, iMessage, and more). With the published [`@zenmux/openclaw-zenmux-provider`](https://clawhub.ai/plugins/@zenmux/openclaw-zenmux-provider) plugin on ClawHub, a single install command gives OpenClaw access to **all 135+ ZenMux models** — GPT, Claude, Gemini, Grok, DeepSeek, Qwen, and more — with on-demand dynamic resolution and a one-time per-host catalog cache.

::: info Compatibility
The plugin requires **OpenClaw `>= 2026.4.14`**. If you're on an older release, upgrade with `npm i -g openclaw@latest` before installing.

The plugin uses the canonical OpenClaw provider pattern: a small static catalog plus `resolveDynamicModel` + `prepareDynamicModel` hooks. You don't need to enumerate models manually — any `zenmux/<id>` from the live catalog works on demand.

ZenMux's API is OpenAI-compatible at `https://zenmux.ai/api/v1`.
:::

## Prerequisites

- Node.js 22 or later
- OpenClaw `>= 2026.4.14` (`openclaw --version`)
- A ZenMux API key — see [Step 0](#step-0-get-a-zenmux-api-key) below

## Step 0: Get a ZenMux API Key

ZenMux offers two billing options. Either works with this plugin.

::: code-group

```text [Subscription API Key (Recommended)]
Best for: personal development, learning/exploration
Features: fixed monthly fee, predictable cost, 5-10x price leverage
API Key format: sk-ss-v1-xxx

How to get it:
1. Visit the subscription page: https://zenmux.ai/platform/subscription
2. Choose a plan (Pro $20/month, Max $100/month, Ultra $200/month)
3. After subscribing, create a subscription API Key on the page

For details, see: Subscription Plan Guide
https://docs.zenmux.ai/guide/subscription
```

```text [Pay-as-you-go API Key]
Best for: production environments, commercial products, enterprise apps
Features: no rate limits, production-grade stability, billed by actual usage
API Key format: sk-ai-v1-xxx

How to get it:
1. Visit the pay-as-you-go page: https://zenmux.ai/platform/pay-as-you-go
2. Top up your account
3. Create an API Key in the "Pay As You Go API Keys" section

For details, see: Pay-as-you-go Guide
https://docs.zenmux.ai/guide/pay-as-you-go
```

:::

## Quick Start (3 commands)

If you already have OpenClaw and your API key set, this is the entire setup:

```bash
export ZENMUX_API_KEY=sk-ss-v1-...

openclaw plugins install clawhub:@zenmux/openclaw-zenmux-provider
openclaw onboard --zenmux-api-key "$ZENMUX_API_KEY" --auth-choice zenmux-api-key \
  --flow manual --accept-risk --non-interactive
openclaw gateway install && openclaw gateway start
```

Then `openclaw chat` to start chatting. The default model is `zenmux/openai/gpt-5.4`; switch to any other ZenMux model in chat with `/model zenmux/<id>`.

The detailed walkthrough below explains each step and how to verify it.

## Method 1: Install via ClawHub plugin (Recommended)

### Step 1: Verify or upgrade OpenClaw

```bash
openclaw --version            # expect: OpenClaw 2026.4.14 or newer
```

If older, upgrade:

```bash
npm i -g openclaw@latest
openclaw --version            # confirm >= 2026.4.14
```

If `npm i -g` errors with permissions, you're on system Node — switch to a Node version manager (nvm/volta/fnm) or prefix with `sudo`.

### Step 2: Set your ZenMux API key

```bash
export ZENMUX_API_KEY=sk-ss-v1-...
```

### Step 3: Install the plugin from ClawHub

```bash
openclaw plugins install clawhub:@zenmux/openclaw-zenmux-provider
```

You'll see output similar to:

```text
ClawHub code-plugin @zenmux/openclaw-zenmux-provider@0.2.1 channel=community verification=source-linked
ClawHub package "@zenmux/openclaw-zenmux-provider" is community; review source and verification before enabling.
Downloading plugin @zenmux/openclaw-zenmux-provider@0.2.1 from ClawHub…
Installing to ~/.openclaw/extensions/zenmux…
Installed plugin: zenmux
Restart the gateway to load plugins.
```

The "community plugin" notice is a standard advisory for any non-bundled plugin and is expected.

### Step 4: Onboard with your API key (do this **before** starting the gateway)

This step writes the gateway mode, the provider config, and the auth profile. The OpenClaw gateway daemon refuses to start without `gateway.mode` set, so onboard must run first.

```bash
openclaw onboard \
  --zenmux-api-key "$ZENMUX_API_KEY" \
  --auth-choice zenmux-api-key \
  --flow manual \
  --accept-risk \
  --non-interactive
```

Expected output:

```text
Updated ~/.openclaw/openclaw.json
Workspace OK: ~/.openclaw/workspace
Sessions OK: ~/.openclaw/agents/main/sessions
Gateway did not become reachable at ws://127.0.0.1:18789.
```

The `Gateway did not become reachable` line is informational — onboard ran a post-write health check; the gateway will be installed in the next step.

### Step 5: Install + start the gateway service

```bash
openclaw gateway install
openclaw gateway start
sleep 5
openclaw gateway status | grep -E "Runtime:|Listening|Connectivity probe|Capability"
```

Expected:

```text
Runtime: running (pid …)
Listening: 127.0.0.1:18789
Connectivity probe: ok
Capability: admin-capable
```

### Step 6: Verify the configuration

```bash
node -e "
const c = require(require('os').homedir() + '/.openclaw/openclaw.json');
const p = require(require('os').homedir() + '/.openclaw/extensions/zenmux/package.json');
console.log('plugin name    :', p.name);
console.log('plugin version :', p.version);
console.log('primary model  :', c.agents?.defaults?.model?.primary);
console.log('allowlist      :', JSON.stringify(c.agents?.defaults?.models));
console.log('zenmux api     :', c.models?.providers?.zenmux?.api);
console.log('zenmux baseUrl :', c.models?.providers?.zenmux?.baseUrl);
console.log('plugin enabled :', c.plugins?.entries?.zenmux?.enabled);
console.log('gateway.mode   :', c.gateway?.mode);
console.log('auth profile   :', c.auth?.profiles?.['zenmux:default']?.mode);
"
```

Expected output:

```text
plugin name    : @zenmux/openclaw-zenmux-provider
plugin version : 0.2.1
primary model  : zenmux/openai/gpt-5.4
allowlist      : {}
zenmux api     : openai-completions
zenmux baseUrl : https://zenmux.ai/api/v1
plugin enabled : true
gateway.mode   : local
auth profile   : api_key
```

The empty `allowlist: {}` is the key signal — any `zenmux/<id>` is selectable, no manual pinning required.

### Step 7: Smoke test through three vendors

```bash
# Default model — fast, no cache fetch needed
openclaw infer model run --gateway --model zenmux/openai/gpt-5.4 \
  --prompt "Reply with: DEFAULT_OK"

# Anthropic via ZenMux — first call triggers a one-time ~1-2s catalog fetch
openclaw infer model run --gateway --model zenmux/anthropic/claude-opus-4.7 \
  --prompt "Reply with: FREE_PICK"

# xAI via ZenMux — cache is now warm, instant
openclaw infer model run --gateway --model zenmux/x-ai/grok-4.3 \
  --prompt "Reply with: GROK_OK"
```

Each should print `provider: zenmux`, the model id, and a short reply. No `model not allowed` errors.

### Step 8: Open chat

```bash
openclaw chat                 # local terminal UI
# or
openclaw dashboard            # web UI in browser
```

You're done. Day-to-day usage is below.

## Using ZenMux models in chat

### Switching models on the fly

In both the terminal TUI (`openclaw chat`) and the web dashboard chat input, type a slash directive:

```text
/model zenmux/anthropic/claude-opus-4.7    switch to Claude Opus 4.7
/model zenmux/x-ai/grok-4.3                switch to Grok 4.3
/model zenmux/deepseek/deepseek-v4-pro     switch to DeepSeek v4 Pro
/model zenmux/qwen/qwen3.6-max-preview     switch to Qwen 3.6 Max
/model status                              show current model + endpoint
```

Any of the 135+ ZenMux models works directly — no need to pre-pin. The first call to a previously-unused model triggers a one-time ~1-2s catalog warmup; subsequent calls hit the disk cache at `~/.openclaw/cache/zenmux-models.json` and are instant.

### Listing available models

```bash
# All ZenMux models from the live catalog
curl -s https://zenmux.ai/api/v1/models | python3 -c "
import sys, json
for m in json.load(sys.stdin)['data']: print(m['id'])
"

# Or browse via the official model list page
open https://zenmux.ai/models
```

### One-shot CLI inference

```bash
openclaw infer model run --gateway --model zenmux/anthropic/claude-opus-4.7 \
  --prompt "Summarize the README in 3 bullets"
```

### Pinning favorites in the dashboard dropdown (optional)

The dashboard chat-header dropdown shows only your saved aliases. To populate it with a few favorites:

```bash
openclaw models aliases add Opus  zenmux/anthropic/claude-opus-4.7
openclaw models aliases add GPT55 zenmux/openai/gpt-5.5-pro
openclaw models aliases add Grok  zenmux/x-ai/grok-4.3
openclaw gateway restart
```

::: warning Trade-off
Once `agents.defaults.models` (the underlying alias map) is non-empty, OpenClaw treats it as the agent **allowlist** — only pinned models can be selected. Models not pinned will show "model not allowed". To regain free-form switching, either bulk-pin everything or clear the map (see [Troubleshooting](#troubleshooting)).
:::

## Method 2: Manual configuration (fallback)

::: warning When to use this
Use Method 2 only if you can't reach ClawHub (offline / firewalled / corporate-restricted environment). It's strictly more verbose than Method 1 and **does not get dynamic model discovery** — you'll only have access to whatever models you explicitly list in the config.
:::

### Step 1: Install OpenClaw

```bash
npm install -g openclaw@latest
openclaw setup --mode local --non-interactive   # writes baseline config
```

### Step 2: Edit `~/.openclaw/openclaw.json`

Add the ZenMux provider with the models you want:

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "zenmux": {
        "baseUrl": "https://zenmux.ai/api/v1",
        "apiKey": "sk-ss-v1-your-api-key-here",
        "api": "openai-completions",
        "models": [
          {
            "id": "openai/gpt-5.4",
            "name": "GPT-5.4 via ZenMux",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 200000,
            "maxTokens": 8192
          },
          {
            "id": "anthropic/claude-opus-4.7",
            "name": "Claude Opus 4.7 via ZenMux",
            "reasoning": true,
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 200000,
            "maxTokens": 8192
          },
          {
            "id": "google/gemini-3.1-pro-preview",
            "name": "Gemini 3.1 Pro via ZenMux",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 1048576,
            "maxTokens": 8192
          },
          {
            "id": "deepseek/deepseek-v4-pro",
            "name": "DeepSeek v4 Pro via ZenMux",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 128000,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "zenmux/openai/gpt-5.4"
      }
    }
  }
}
```

::: warning
Replace `sk-ss-v1-your-api-key-here` with your real ZenMux API key.
:::

### Step 3: Start the gateway

```bash
openclaw gateway install
openclaw gateway restart
```

### Step 4: Verify

```bash
openclaw infer model providers --json | python3 -c "
import sys, json
ps = json.load(sys.stdin)
print(next((p for p in ps if p.get('provider')=='zenmux'), None))
"

openclaw infer model run --gateway --model zenmux/openai/gpt-5.4 \
  --prompt "Reply: OK"
```

### Adding more models

Add entries to the `models` array. Field reference:

| Field | Description |
|---|---|
| `id` | Model id as shown at [zenmux.ai/models](https://zenmux.ai/models) (e.g. `openai/gpt-5.4`) |
| `name` | Display name |
| `reasoning` | Whether the model supports reasoning |
| `input` | `["text"]` or `["text", "image"]` |
| `cost` | Set to all 0 for subscription plans |
| `contextWindow` | Max context window in tokens |
| `maxTokens` | Max output tokens |

After editing, restart the gateway.

::: tip Why Method 1 is preferred
Method 1's plugin uses OpenClaw's `resolveDynamicModel` + `prepareDynamicModel` hooks, which automatically resolve **any** `zenmux/<id>` against the live `/api/v1/models` endpoint and cache the metadata. Method 2 requires you to manually list every model you want to use, and you have to update the config whenever ZenMux ships new models.
:::

## Troubleshooting

::: details Gateway start blocked: existing config is missing `gateway.mode`
**Cause**: `openclaw gateway start` ran before `openclaw onboard`. The daemon refuses to launch when it can't find `gateway.mode` in the config.

**Fix**: Run onboard first, then start the gateway:

```bash
openclaw onboard --zenmux-api-key "$ZENMUX_API_KEY" --auth-choice zenmux-api-key \
  --flow manual --accept-risk --non-interactive
openclaw gateway start
```
:::

::: details `Model override "zenmux/..." is not allowed for agent "main"`
**Cause**: The agent allowlist (`agents.defaults.models`) is non-empty — usually because you're on plugin version `< 0.1.3`, or you previously pinned aliases that openclaw turned into an allowlist.

**Fix A — update the plugin** (most common):

```bash
openclaw plugins update zenmux       # pulls 0.2.0+
openclaw plugins inspect zenmux | grep Version
```

**Fix B — clear the allowlist** (if you're already on the latest plugin but a stale entry remains):

```bash
node -e "
const fs=require('fs');
const path=require('os').homedir()+'/.openclaw/openclaw.json';
const c=JSON.parse(fs.readFileSync(path,'utf8'));
if (c.agents?.defaults) c.agents.defaults.models = {};
fs.writeFileSync(path, JSON.stringify(c, null, 2));
"
openclaw gateway restart
```

After clearing, **open a new chat session** — existing chat sessions cache the allowlist as it was at session-start.
:::

::: details `openclaw infer model providers` shows `count: 1` for zenmux
**This is by design.** The plugin uses the canonical OpenClaw provider pattern: a small static catalog (1 model — the default) plus `resolveDynamicModel` for everything else. The `count` reflects only the static catalog. The other 134+ ZenMux models are still freely selectable via `/model zenmux/<id>` or `--model zenmux/<id>` — they just don't appear in the count until OpenClaw has resolved them at least once.

This matches how the bundled OpenRouter provider works (it reports `count: 2` despite supporting 274+ models).
:::

::: details First chat takes 2-3 seconds longer than expected
**Cause**: One-time `prepareDynamicModel` cache warmup against `https://zenmux.ai/api/v1/models`.

**Fix**: Nothing to do — subsequent calls hit the disk cache at `~/.openclaw/cache/zenmux-models.json` and are instant. The cache survives gateway restarts.
:::

::: details API key error or authentication failure
**Solutions**:

1. **Check the API key format**:
   - Subscription keys start with `sk-ss-v1-`
   - Pay-as-you-go keys start with `sk-ai-v1-`
   - No leading/trailing whitespace

2. **Validate the key**:
   - Subscription: visit the [Subscription page](https://zenmux.ai/platform/subscription) to check status and quotas
   - Pay-as-you-go: visit the [Pay-as-you-go page](https://zenmux.ai/platform/pay-as-you-go) to confirm balance

3. **Re-onboard**: `openclaw onboard --zenmux-api-key "$ZENMUX_API_KEY" --auth-choice zenmux-api-key --flow manual --accept-risk --non-interactive`
:::

::: details Connection failure / timeout
**Solutions**:

- Verify network connectivity: `curl https://zenmux.ai/api/v1/models | head`
- Confirm `baseUrl` is `https://zenmux.ai/api/v1`
- Check firewall / corporate proxy isn't blocking outbound HTTPS to `zenmux.ai`
:::

::: details Plugin doesn't load (`Status: missing` or wrong version)
**Diagnose**:

```bash
openclaw plugins inspect zenmux
# Status should be "loaded"
# Source should be "clawhub"
# Recorded version should be 0.2.1 (or newer)
```

**Fix**: Reinstall the plugin:

```bash
openclaw plugins uninstall zenmux
openclaw plugins install clawhub:@zenmux/openclaw-zenmux-provider
openclaw gateway restart
```
:::

## Supported Models

ZenMux provides access to 135+ models. Some popular options:

| Model | Model ID (use as `zenmux/<id>`) | Best For |
|---|---|---|
| GPT-5.4 (default) | `openai/gpt-5.4` | General purpose, balanced cost |
| GPT-5.5 / GPT-5.5 Pro | `openai/gpt-5.5`, `openai/gpt-5.5-pro` | Flagship reasoning |
| Claude Opus 4.7 | `anthropic/claude-opus-4.7` | Best-in-class reasoning, complex tasks |
| Claude Sonnet 4.6 | `anthropic/claude-sonnet-4.6` | Balanced performance/cost |
| Claude Haiku 4.5 | `anthropic/claude-haiku-4.5` | Fastest Claude tier |
| Gemini 3.1 Pro | `google/gemini-3.1-pro-preview` | Multimodal, long-context |
| Grok 4.3 | `x-ai/grok-4.3` | Fast multimodal, current-events |
| DeepSeek v4 Pro | `deepseek/deepseek-v4-pro` | Cost-effective coding |
| Qwen 3.6 Max | `qwen/qwen3.6-max-preview` | Coding, long-context |

For the live full list, visit [zenmux.ai/models](https://zenmux.ai/models). New models that ZenMux adds are usable the moment they ship — `/model zenmux/<new-id>` works without a plugin update.

## Contact Us

If you encounter any issues during use, or have suggestions and feedback, please contact us through the following channels:

::: tip Get Help

- **Official Website**: <https://zenmux.ai>
- **Technical Support Email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business Cooperation Email**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord Community**: <http://discord.gg/vHZZzj84Bm>

For more contacts and details, visit our [Contact Us page](/help/contact).
:::
