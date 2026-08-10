---
head:
  - - meta
    - name: description
      content: "ZenMux Builder Plan subscriptions: four fixed-monthly-fee tiers (Free / Starter / Max / Ultra) that give you one API Key for every model on the platform, covering coding, image generation, video generation, and chat."
  - - meta
    - name: keywords
      content: Zenmux, subscription, Builder Plan, Starter, Max, Ultra, Flows, fixed monthly fee, OpenAI, Anthropic, Claude, GPT, Gemini, API
---

# Subscription Plans

The ZenMux **Builder Plan** gives individual developers a fixed monthly fee and predictable access to AI models. A single subscription lets you tap into the platform's top models, so you can focus on building instead of worrying about the cost of every API call.

::: tip How this page relates to the pricing page
The Builder Plan's **model list, Flow exchange rate, and quota figures** are all **live data** that change as new models launch and market conditions shift.

- **This document** covers the rules and mechanics: how Flows are calculated, how quotas refresh, how to subscribe, and how to use your key in developer tools.
- **The [subscription pricing page](https://zenmux.ai/pricing/subscription)** provides the live data: the **complete model list** for each plan, the current Flow/USD rate, and remaining spots.

For that reason, this page **no longer enumerates individual model names**. Use the steps in [Viewing the models included in a plan](#supported-models) to look up the current list at any time.
:::

## Plan Overview

The Builder Plan comes in four tiers. The main differences are **quota size** and **model coverage**.

<img src="https://static.zenmux.ai/public/images/doc/02-plan-cards.png" alt="Comparison of the four ZenMux Builder Plan tiers" >

| Plan        | Monthly fee | 5-hour quota | Model coverage                              | Bonus window resets | API access          |
| ----------- | ----------- | ------------ | ------------------------------------------- | ------------------- | ------------------- |
| **Free**    | $0          | 5 Flows      | Basic models                                | —                   | ❌ Studio Chat only |
| **Starter** | $20/mo      | 50 Flows     | Basic models + **limited-time** premium models | 4 / month           | ✅                   |
| **Max**     | $100/mo     | 300 Flows    | Basic + premium models                      | 3 / month           | ✅                   |
| **Ultra**   | $200/mo     | 800 Flows    | All models                                  | 2 / month           | ✅                   |

::: warning The Free plan does not support API calls
The Free plan can only be used in **[Studio Chat](https://zenmux.ai/chat)** on the web (roughly 5 conversations per 5 hours) and provides **no API Request access**. To call models with an API Key from tools like Claude Code, Cursor, or CodeX, choose **Starter** or above.
:::

::: info Limited spots
The top of the pricing page shows **SPOTS REMAINING**. The Builder Plan is currently released in limited batches — once spots sell out, you'll need to wait for the next batch.
:::

## Viewing the models included in a plan {#supported-models}

The ZenMux model list changes continuously: new models launch, limited-time premium models rotate in and out, and some models move between plans. **Any model list hard-coded into documentation goes stale quickly**, so always treat the pricing page as the source of truth.

### Look up the live list in three steps

1. Open the **[subscription pricing page](https://zenmux.ai/pricing/subscription)** and scroll down to the plan cards
2. In the plan card you're interested in, find the model row and click the **View** button on the right
3. Browse, search, or filter by type in the **Supported models** dialog that opens

**Step 2 — click the View button on the plan card:**

<img src="https://static.zenmux.ai/public/images/doc/03-click-view-button.png" alt="Click the View button on a plan card to see its model list" style="width:320px; border-radius:8px; box-shadow: 0 4px 12px rgba(0,0,0,0.12);">

**Step 3 — review the full list in the Supported models dialog:**

<img src="https://static.zenmux.ai/public/images/doc/04-models-modal-starter.png" alt="The Supported models dialog listing available models" style="width:480px; border-radius:8px; box-shadow: 0 4px 12px rgba(0,0,0,0.12);">

### What you can do in the dialog

| Control                        | What it does                                                                 |
| ------------------------------ | ---------------------------------------------------------------------------- |
| **Search models**              | Search by model or provider keyword to confirm whether a specific model is included |
| **Newest**                     | Change the sort order so the most recently launched models appear first      |
| **All / Text / Image / Video** | Filter by modality: everything, text, image generation, or video generation  |
| Click any model                | See that model's pricing, context length, max output, and available providers |

<img src="https://static.zenmux.ai/public/images/doc/05-models-modal-starter-image.png" alt="Filtering the model list by the Image type" style="width:480px; border-radius:8px; box-shadow: 0 4px 12px rgba(0,0,0,0.12);">

::: tip What the model badges mean
Some models in the list carry badges such as **Limited-Time Offer** (available for a limited period), **Free** (free model), **Rate Limit** (subject to an additional rate limit), and **PAYG Only** (available on pay-as-you-go only). Badges change with platform policy, so treat what's shown on the page as authoritative.
:::

## Plan details

The sections below describe how each plan is positioned and what its model coverage looks like. **For the exact model list, use the View button on the corresponding card** — this section deliberately does not name individual models.

### Free — Try it out {#free}

For users getting to know ZenMux, offering a zero-cost way to explore the platform's AI capabilities.

- **Quota** — 5 Flows per 5 hours (roughly 5 conversations)
- **Model coverage** — Basic models
- **How to use it** — **[Studio Chat](https://zenmux.ai/chat) on the web only; no API access**

### Starter — The everyday choice {#starter}

The go-to plan for daily Vibe Working, well suited to product managers, marketers, operators, and lighter development work.

- **Quota** — 50 Flows per 5 hours
- **Model coverage** — Basic models plus premium models on a **rotating, limited-time** basis
- **Plan benefits** — Studio Chat and API access, 4 bonus window resets per month, priority technical support

::: warning Limited-time models rotate
Starter's premium model list works on a **rotating, limited-time** basis and is refreshed periodically. Before subscribing, click **View** on the card to confirm the model you depend on is currently included. If that model is essential to your workflow, choose Max or Ultra instead.
:::

### Max — High-intensity development {#max-high-intensity-development}

A high-value plan for developers starting their Vibe Coding journey.

- **Quota** — 300 Flows per 5 hours (6× Starter)
- **Model coverage** — Basic plus premium models, covering the vast majority of mainstream flagship models
- **Plan benefits** — 3 bonus window resets per month, early access to new features, and everything in Starter

### Ultra — Professional-grade flagship {#ultra-professional-flagship}

Purpose-built for intensive Vibe Coding and professional-grade development.

- **Quota** — 800 Flows per 5 hours (16× Starter)
- **Model coverage** — All models
- **Plan benefits** — 2 bonus window resets per month, early access to new features, and everything in Max

::: info Choosing between Max and Ultra
Max and Ultra currently cover nearly identical model lists. The real difference is **quota size** (800 vs 300 Flows per 5 hours), not model selection.

- If **usage** is your bottleneck (you regularly hit the 5-hour limit) → choose Ultra
- If **model selection** is your only concern → Max is usually enough

Always confirm against the actual list in the pricing page's **View** dialog.
:::

## What Are Flows?

**Flow** is the composite billing unit for ZenMux subscriptions, accounting for both token consumption and API call overhead.

Think of it as a currency: just as different goods carry different dollar prices, different AI models consume different numbers of Flows per request. Unlike pay-as-you-go Credits (fixed at 1 Credit = 1 USD), **a Flow's USD-equivalent value floats** — it reflects the real dollar value of the API usage behind it.

::: details Why use Flows instead of pricing directly in USD?
Flows help the platform balance token load, keeping subscriptions sustainable over the long term while maintaining reliable service quality.
:::

### Real-time Flow/USD exchange rate

<img src="https://static.zenmux.ai/public/images/doc/06-flow-usd-rate.png" alt="Real-time Flow/USD exchange rate and historical trend" >

The pricing page provides a **rate converter** along with **1-week, 1-month, and 1-year** historical charts. As of 2026-08-04, the rate is anchored at **1 Flow ≈ $0.03283** (about 30 Flows = $1).

::: warning The rate is adjusted periodically
This rate may be adjusted based on market conditions and model pricing changes, so **the figure above is only a snapshot from when the screenshot was taken**. The latest rate is always published in real time on the [pricing page](https://zenmux.ai/pricing/subscription).
:::

::: danger Abuse policy
Accounts found to be violating the Builder Plan terms of service — through automated abuse, resource hoarding, multi-account pooling, unauthorized resale, and similar behavior — will have their effective Flow value **reduced below the standard rate**, meaning each Flow is worth less in USD-equivalent terms. Please use your subscription responsibly.
:::

## Quotas and limits

### Quota comparison across plans

<img src="https://static.zenmux.ai/public/images/doc/07-plan-comparison-table.png" alt="Plan quota comparison: 5-hour, weekly, and monthly max Flows with equivalent USD value" >

The table below is a **snapshot from 2026-08-04**, intended to convey the relative scale of each tier:

| Plan        | Monthly fee | 5-hour quota | Weekly max Flows | Monthly max Flows | Equivalent USD value | Value leverage |
| ----------- | ----------- | ------------ | ---------------- | ----------------- | -------------------- | -------------- |
| **Free**    | $0/mo       | 5 Flows      | 38.64 Flows      | 165.6 Flows       | $5.44                | —              |
| **Starter** | $20/mo      | 50 Flows     | 213.293 Flows    | 914.112 Flows     | $30.01               | 1.50x          |
| **Max**     | $100/mo     | 300 Flows    | 1,280.22 Flows   | 5,486.659 Flows   | $180.15              | 1.80x          |
| **Ultra**   | $200/mo     | 800 Flows    | 3,413.921 Flows  | 14,631.091 Flows  | $480.40              | 2.40x          |

- **Equivalent USD value (Worth)** — the **theoretical maximum monthly API value** included in the plan, based on equivalent pay-as-you-go pricing.
- **Value leverage** — equivalent USD value ÷ monthly fee, showing how many times your subscription cost you get back in API value.

::: tip Defer to the pricing page
All Flow and USD figures above are **calculated dynamically** and move with the Flow exchange rate. Treat the live values on the [pricing page](https://zenmux.ai/pricing/subscription) as authoritative.
:::

::: tip Bonus Flow value for Insider members
The standard Flow value applies to all regular subscribers. Early **Insider members** who maintain an **active, uninterrupted subscription** receive a higher USD-equivalent value per Flow as a loyalty reward — the same Flow stretches further.
:::

### Rate limits and quota windows

| Item             | Rule                                     |
| ---------------- | ---------------------------------------- |
| **Rate limit**   | 10–15 RPM (requests per minute)          |
| **Quota window** | Rolling 5-hour window, refreshed automatically |
| **Weekly limit** | Resets on a rolling 7-day window         |

Both windows are **rolling**: the clock starts with your first request and resets automatically 5 hours or 7 days later. You can check remaining quota and reset times in real time on the [subscription management page](https://zenmux.ai/platform/subscription).

### Window resets

Within each billing cycle, subscribers get a set number of **5-hour window resets**. When your 5-hour quota is nearly exhausted, you can reset the window manually to restore your quota immediately instead of waiting for the rolling reset.

<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/06/11/ahFja9m/20260611202440.jpg" alt="The window reset feature" >

| Plan        | Bonus resets per month |
| ----------- | ---------------------- |
| **Starter** | 4                      |
| **Max**     | 3                      |
| **Ultra**   | 2                      |

::: tip How to use it
The [subscription management page](https://zenmux.ai/platform/subscription) shows how many resets you have left; click "Reset window" to refresh your 5-hour quota immediately. You can also enable **auto-reset**, which spends one reset automatically whenever your quota runs out — no manual action required.

Resets are counted per subscription cycle (for example, June 3 to July 3) and **do not roll over**. The number of resets per plan may change with platform policy, so treat the subscription management page as authoritative.
:::

## Usage guidelines

<img src="https://static.zenmux.ai/public/images/doc/08-usage-guidelines.png" alt="Builder Plan usage guidelines: allowed and prohibited use cases" >

Subscription plans are designed for non-production scenarios such as **personal development, learning, and Vibe Coding**.

::: tip Allowed use cases

- Personal development and learning
- Vibe Coding and rapid prototyping
- Technical exploration and experiments
- Personal projects and non-commercial apps
:::

::: danger Prohibited use cases

- Live production environments
- Commercial products or services
- End-user facing applications
- Multi-account pooling, rotation, and similar abuse
- **Multiple users sharing a single account**
:::

::: warning Going to production?
If your project is launching or already commercial, switch to [Pay As You Go](./pay-as-you-go) for stronger SLA guarantees, more stable service quality, more flexible scaling, and professional commercial support.
:::

## Why choose the Builder Plan?

### Key benefits

| Pain point                              | How subscriptions solve it                              |
| --------------------------------------- | ------------------------------------------------------- |
| **Worrying about cost while Vibe Coding** | A fixed fee from $20/month, so you can code freely      |
| **Learning new tech is too expensive**  | Explore a wide range of AI models cheaply               |
| **Juggling accounts across platforms**  | One API Key for every model                             |
| **Diverse use cases**                   | Coding + image + video + chat, all covered              |

### Three core values

**1. Coverage for every scenario**

The Builder Plan spans text, image generation, and video generation models. Whether you're a developer, designer, product manager, or marketer, one subscription covers the full range of Vibe Builder needs — Claude Code for coding, NanoBanana for images, and the GPT series for chat.

**2. An all-star model matrix**

One subscription gives you 100+ top models worldwide (the Claude, GPT, Gemini, GLM, Kimi, and MiniMax families, among others), with the newest flagships available immediately. [Check the pricing page](#supported-models) for the current list.

**3. Seamless agent integration**

Native support for the OpenAI, Anthropic, and Google protocols means no tool lock-in. A single subscription API Key works with Claude Code, CodeX, Open Code, OpenClaw, Cline, VS Code Copilot, and other popular community tools.

### Compared with a Claude Code subscription

<img src="https://static.zenmux.ai/public/images/doc/09-vs-claude-code.png" alt="ZenMux Builder Plan compared with a Claude Code subscription" >

For the same $20 per month, ZenMux lets you:

- Use **100+ models** instead of being limited to a single vendor
- Cover **coding, image generation, video generation, and chat** all at once
- Move seamlessly between Claude Code, Codex, and other tools with **one API Key**

## How to subscribe

### Step 1: Review plan details

Visit the [subscription pricing page](https://zenmux.ai/pricing/subscription) to see live pricing, quotas, and model lists for every plan.

<img src="https://static.zenmux.ai/public/images/doc/01-builder-plan-hero.png" alt="The ZenMux Builder Plan subscription pricing page" >

### Step 2: Choose and subscribe

1. Pick the plan that fits your needs on the pricing page
2. Click **Get Starter**, **Get Max**, or **Get Ultra** (existing subscribers see **Change Plan**)
3. Complete payment

::: tip Supported payment methods
Stripe credit cards and Alipay.
:::

### Step 3: Manage your subscription and get an API Key

Once subscribed, head to the [subscription management page](https://zenmux.ai/platform/subscription):

<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/01/20/4I6M3by/dingyuezhi-gerenguanliyemian2.png" alt="The subscription management page" >

- **Review usage** — current 5-hour window usage and time remaining, weekly totals, and a Flow consumption breakdown
- **Get a subscription API Key** — create subscription-specific keys, manage and rotate existing keys, and check last-used timestamps
- **Manage your subscription** — view your current plan, upgrade or downgrade, and review billing history

### Step 4: Use it in developer tools

Subscription API Keys work **exactly like** [pay-as-you-go](./pay-as-you-go.md) keys, supporting the OpenAI SDK, the Anthropic SDK, and direct HTTP calls.

The **only difference** is that you use a subscription-specific API Key (prefixed with `sk-ss-v1-`), and calls draw Flows from your subscription quota instead of charging your account balance.

::: tip API examples
For complete code samples, see the [quickstart guide](./quickstart.md) — just swap in your subscription API Key.
:::

#### Integrate with mainstream tools

**AI coding tools**

- [Claude Code integration guide](/best-practices/claude-code) - Anthropic's official CLI
- [CodeX integration guide](/best-practices/codex) - OpenAI's official coding assistant
- [Cline integration guide](/best-practices/cline) - VS Code AI assistant extension
- [VS Code Copilot integration guide](/best-practices/github-copilot) - A GitHub Copilot alternative
- [Neovate integration guide](/best-practices/neovate-code) - A modern AI coding tool
- [OpenCode integration guide](/best-practices/opencode) - Open-source AI coding assistant

**Knowledge management and chat tools**

- [Cherry Studio integration guide](/best-practices/cherry-studio) - Desktop AI chat app
- [Obsidian integration guide](/best-practices/obsidian) - AI plugin for the knowledge base tool
- [Sider integration guide](/best-practices/sider) - Browser sidebar AI assistant

**AI application platforms**

- [Dify integration guide](/best-practices/dify) - LLM application development platform
- [Open WebUI integration guide](/best-practices/open-webui) - Self-hosted AI chat interface

::: info More integrations
Additional integration guides are published regularly. If you need help, join the [Discord community](http://discord.gg/vHZZzj84Bm) or contact technical support.
:::

## Extra Usage - Automatic overage switching

When enabled, hitting your 5-hour or weekly subscription limit automatically switches traffic to a designated pay-as-you-go API Key so your work isn't interrupted; once quota recovers, calls switch back to your subscription key.

### Key benefits

- **Seamless switching** — falls back to pay-as-you-go automatically, with no manual key swap
- **Uninterrupted workflow** — your development, coding, and chat sessions keep running
- **Automatic recovery** — returns to subscription billing as soon as quota is restored
- **Full control** — enable or disable it at any time

### Setup steps

Go to the [subscription management page](https://zenmux.ai/platform/subscription) and follow these steps:

**Step 1: Enable Extra Usage**

Find the **Extra Usage** section and click the toggle on the right.

<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/02/03/8Ed42do/extra-1.png" alt="Enable Extra Usage" >

**Step 2: Select a pay-as-you-go API Key**

In the **Select a Key** dialog that appears:

- Choose an existing pay-as-you-go API Key from the dropdown
- Or click **Create new key** to create a new pay-as-you-go API Key

<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/02/03/iJZufsS/extra-2.png" alt="Select an API Key" >

Click **Select** to confirm.

**Step 3: Configuration complete**

Once enabled, the page shows details for the selected key, including its name and secret, status, creation and last-used timestamps, the amount spent so far, and an option to switch to a different key.

<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/02/03/7ivqY3m/extra-3.png" alt="Extra Usage enabled" >

### How it works

1. **Normal usage** — subscription quota (Flows) is consumed first
2. **Quota exhausted** — when the 5-hour or weekly window hits its limit, traffic switches to the designated pay-as-you-go API Key
3. **Metered billing** — calls during this period are charged to your account balance
4. **Automatic recovery** — once the subscription window resets, billing returns to your subscription

::: warning Billing reminder
With Extra Usage enabled, exhausting your subscription quota automatically draws from your pay-as-you-go balance. Keep that balance funded and monitor it to avoid service interruptions or unexpected charges. To switch backup keys, click **Reselect**.
:::

## Using subscriptions in Studio Chat

Beyond using an API Key in developer tools, you can spend subscription quota directly in **[ZenMux Studio Chat](https://zenmux.ai/chat)** on the web.

<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/02/03/l48igiH/studio-chat-mode.png" alt="Switching billing modes in Studio Chat" >

Under **Billing Mode** in the conversation settings, you can choose:

- **Subscription** — uses subscription quota (Flows) without touching your account balance
- **Pay As You Go** — charges your account balance based on actual usage

::: tip Switch freely
The two modes can be switched at any time and don't affect each other. For example, use Subscription for everyday development, learning, and prototyping; use Pay As You Go for production testing and commercial project validation.
:::

::: warning Shared quota
Studio Chat and API calls **share the same subscription quota pool**. Conversations in Studio Chat consume subscription Flows too, so budget accordingly.
:::

## Upgrades & Downgrades {#upgrades-and-downgrades}

You can switch plans at any time during a subscription:

- **Upgrades** (for example, Starter → Max) **take effect immediately**, prorated against the time remaining in the current billing cycle
- **Downgrades** take effect at the end of the current cycle at no extra cost

### Upgrade proration

When you upgrade, you only pay the price difference for the time remaining in the current cycle — not a full month's difference.

| Symbol  | Meaning                                       |
| ------- | --------------------------------------------- |
| `P_old` | Current plan's monthly fee (USD)              |
| `P_new` | Target plan's monthly fee (USD)               |
| `T`     | Total length of the current billing cycle (usually 1 month) |
| `T_rem` | Time remaining until the end of the cycle     |
| `Δ`     | Amount due for the upgrade                    |

```text
Δ = max(0, (P_new − P_old) × (T_rem / T))
```

In other words: **amount due = plan price difference × share of the cycle remaining**. If `P_new ≤ P_old` (not an upgrade), the amount due is 0.

**Example** — upgrading from Starter ($20/mo) to Max ($100/mo) with 15 days left in a 30-day cycle:

```text
Δ = (100 − 20) × (15 / 30) = 80 × 0.5 = $40
```

You pay only the **$40** difference to upgrade; when the new cycle starts, Max bills at its normal $100/month.

::: tip Your billing cycle stays the same
Upgrading **does not reset** your billing cycle — your next renewal date stays exactly where it was, which avoids being double-charged by an "upgrade equals renewal" effect.
:::

## ZenMux AI Insurance

<img src="https://static.zenmux.ai/public/images/doc/11-ai-insurance.png" alt="ZenMux AI Insurance for output quality" >

ZenMux is the first platform in the industry to insure **AI output quality**. The following situations are detected and compensated automatically:

| Scenario                | Description                                      |
| ----------------------- | ------------------------------------------------ |
| **Poor output quality** | Model output falls significantly short of expectations |
| **Hallucination**       | The model produces false or incorrect information |
| **High latency**        | Response time exceeds the normal range           |

**How it works**: daily automatic detection → problematic requests identified → credit compensation issued automatically the next day.

::: tip Data flywheel value
Bad cases surfaced by the insurance algorithms can feed directly into optimizing your own AI products.
:::

## Refunds

To request a refund, see the [refund policy](./refund) for eligibility, calculation methods, and the request process.

## FAQ

### What's the difference between subscriptions and pay-as-you-go?

| Aspect                  | Subscription (Builder Plan)   | Pay As You Go                   |
| ----------------------- | ----------------------------- | ------------------------------- |
| **Billing model**       | Fixed monthly fee             | Charged by actual usage         |
| **Best for**            | Personal development, learning | Production, commercial apps     |
| **Cost predictability** | High (fixed monthly fee)      | Medium (varies with usage)      |
| **Rate limit**          | 10–15 RPM                     | Higher, configurable            |
| **SLA**                 | Standard                      | Stronger                        |
| **Value leverage**      | 1.50–2.40x                    | Standard API pricing            |

### When does the quota reset?

Both windows are rolling:

- **5-hour window** — starts counting from your first request and resets every 5 hours
- **Weekly limit** — starts counting from your first request and resets every 7 days

You can check remaining quota and reset times in real time on the [subscription management page](https://zenmux.ai/platform/subscription).

### Can I upgrade or downgrade my plan?

Yes, at any time from the console. **Upgrades take effect immediately** (prorated for the remainder of the cycle), and **downgrades take effect at the end of the current billing cycle**. See [Upgrades & Downgrades](#upgrades-and-downgrades) for details.

### Can I use a subscription for production?

No. Subscriptions are intended only for non-production scenarios such as personal development, learning, and Vibe Coding. For production workloads, use [Pay As You Go](./pay-as-you-go) for better SLA, stability, and scalability.

### Do Studio Chat and API calls share the same quota?

Yes. Studio Chat on the web and API calls draw from the same subscription quota pool, so plan your usage accordingly.

### What payment methods are supported?

Stripe credit cards and Alipay.

### Can I use multiple plans at the same time?

No. Only one subscription plan can be active per account. If you need a larger quota, upgrade to Max or Ultra.

### Is a specific model included in my plan?

Go to the [subscription pricing page](https://zenmux.ai/pricing/subscription), click **View** on the relevant plan card, and search for the model name in the dialog. See [Viewing the models included in a plan](#supported-models) for the full walkthrough.

## Next Steps

- Read the [quickstart guide](./quickstart) for detailed API usage
- Follow the [best practices](/best-practices/claude-code) to wire your subscription API Key into developer tools
- Learn about [Pay As You Go](./pay-as-you-go), the billing model for production
- Visit [usage analytics](./observability/usage) to monitor subscription quota in real time
- Check [cost analysis](./observability/cost) to learn how to optimize spend

<ContactCards>
<ContactCard icon="mail" title="Email">

Technical support: [support@zenmux.ai](mailto:support@zenmux.ai)

Business inquiries: [bd@zenmux.ai](mailto:bd@zenmux.ai)

</ContactCard>
<ContactCard icon="x" title="X / Twitter" link="https://x.com/ZenMuxAI" label="@ZenMuxAI" />
<ContactCard icon="discord" title="Discord" link="https://discord.gg/vHZZzj84Bm" label="@ZenMuxAI" />
</ContactCards>
