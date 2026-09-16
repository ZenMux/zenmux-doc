---
head:
  - - meta
    - name: description
      content: ZenMux Token Packs — definition, consumption order, validity, billing visibility, and alerts
  - - meta
    - name: keywords
      content: Zenmux, Token Pack, Token Package, credits, PAYG, consumption order, balance
---

# Token Packs

A **Token Pack** is a fixed-quantity API allowance issued by ZenMux: each pack contains a set amount of tokens (for example, 1M or 10M tokens) and has its own validity period. Under Pay As You Go (PAYG) billing, the tokens consumed by your calls are **deducted from your Token Packs first**; only when a call is not covered by a pack does the charge fall through to your account balance (PAYG Credits).

::: info Naming
The benefit is called **Token Pack** (「Token 包」in Chinese). Some pages may still say Token Package — it refers to the same allowance.
:::

## How Token Packs relate to other credits

There are four kinds of allowance under a ZenMux account, each independent with its own source and consumption rules:

| Allowance | What it is | How you get it | Unit | Validity |
| --- | --- | --- | --- | --- |
| **Token Pack** | Fixed-quantity token allowance | Platform campaigns (see below) | Deducted by token usage | Per-pack validity |
| **Top-Up Credits** | The paid part of your balance | Topping up | USD-denominated | No expiry |
| **Bonus & Compensation Credits** | Top-up bonuses, referrals, insurance payouts | Granted by the platform | USD-denominated | Some sources expire |
| **Subscription quota (Flows)** | Monthly quota of a Builder Plan | Subscribing | Subscription billing | Resets per billing window |

Two related benefits are easy to confuse with Token Packs:

- **Top-up bonus coupons**: discount/bonus vouchers attached to top-ups (e.g., +20% bonus) that apply during the top-up transaction; they do not participate in per-call deduction.
- **Gift Cards**: purchased and given to someone else; after redemption they become the recipient's PAYG Credits. Token Packs, in contrast, are bound to your own account.

## Consumption order (full priority table)

Each API call is billed in the following fixed order — the next tier is only used once the previous one is exhausted:

| Priority | Source | Notes |
| --- | --- | --- |
| 1 | **Subscription quota (Flows)** | Only for subscription-billed requests (subscription API key or Subscription mode in Studio Chat) |
| 2 | **Token Packs** | Consumed first under metered billing (including overage after subscription quota is exhausted); with multiple packs, the **earliest-expiring pack is deducted first** |
| 3 | **Bonus & Compensation Credits** | Used when packs are exhausted or unavailable |
| 4 | **Top-Up Credits** | Consumed last, drawing down your account balance |

::: info Subscription users
Requests on a subscription API key consume the subscription quota first. Once that quota is exhausted and [Extra Usage](/guide/subscription) is enabled, billing switches to the metered order above, which starts with **Token Packs → Bonus Credits → Top-Up Credits**.
:::

If the tier-4 balance is also insufficient, the call fails with `402` (insufficient credit) — see the [error code reference](/guide/advanced/error-codes).

### How a pack is deducted

- **By token usage**: a call deducts its input/output tokens from the pack (prompt cache hit, cache read/write, and web-search fee items are excluded).
- **Whole-request coverage**: when the billable tokens of a call do not exceed the pack's remaining allowance, the entire call is **covered by the pack** (you pay $0, including the call's other fee items).
- **When a call cannot be fully covered**: that call skips the Token Packs and is billed directly from tiers 3 and 4 above; the pack's remaining allowance stays available for later calls.
- **Multiple packs**: deducted in **earliest-expiry-first** order, helping you burn down packs close to expiry.

## Getting and using packs

::: info Current distribution channels
Token Packs are currently issued through **platform campaigns** — for example, limited-time free trial packs for newly launched models, targeted grants to selected users, and campaign-page claims. You can view your packs under **My Coupons** in the **Gift Center**.
:::

- **Effective immediately**: once claimed, a pack is usable right away; subsequent calls deduct it automatically in priority order. No activation or configuration is needed.
- **Bound to your account**: Token Packs cannot be transferred or used across accounts; packs held by an organization member are not shared across the organization.
- **Multiple concurrent packs**: you may hold several valid packs at once; the earliest-expiring one is deducted first automatically.

## Validity and expiry

- Each pack has its **own validity period**, fixed at issue/claim time and shown on the pack card.
- **Expired means forfeited**: after the validity period ends, any remaining allowance in the pack is void — it cannot be extended, redeemed for cash, or converted back into balance.
- With multiple packs, the earliest-expiring one is consumed first, minimizing forfeited allowance.
- If a campaign is stopped by the platform, its unexhausted packs stop participating in deduction; already-consumed allowance is unaffected.

::: warning No refunds
Token Packs are platform-funded campaign benefits, not something you purchased, so the 24-hour PAYG top-up refund policy **does not apply** to them. Packs cannot be withdrawn or exchanged for other credits.
:::

## How packs appear in billing and usage

- **My Coupons (Gift Center → Coupons)**: the pack card shows remaining/total tokens (e.g., 880K / 1M), the usage ratio (x.x% Used), and the expiry date, grouped into Available / Used · Expired.
- **Request logs (Logs)**: each call shows its billing source and pack deduction (e.g., the tokens covered by a pack), with amounts shown both before deduction and as actually paid — a fully covered call pays $0.
- **Usage / Cost analytics**: consistent with the existing PAYG analytics pages; amounts covered by Token Packs do not count as balance consumption.
- Each billed call distinguishes the **pack-covered amount** (paid by the Token Pack) from the **out-of-pocket amount** (paid by PAYG or subscription); total = pack-covered + out-of-pocket.

## Consumption alerts

As a pack approaches exhaustion, ZenMux shows a popup in **Studio Chat** so you know the billing source is about to switch from pack allowance to real balance:

- **90% used**: the popup says your Token Pack is 90% used, with roughly $X remaining. Once it's exhausted, your usage automatically switches to PAYG Credits and is deducted from your account balance; you can check your balance or top up from the alert.
- **100% exhausted**: the popup tells you the pack is fully consumed and subsequent calls are billed from your account balance.
- Each threshold (90% and 100%) is shown once per pack; dismissal persists across sessions and never interrupts your in-progress input.
- Remaining amounts and dates shown in alerts come from server-side live data.
- When you hold multiple packs, the alert identifies **which** pack it refers to (including its expiry date), so you don't top up just to save a soon-to-expire allowance.

::: tip Balance alerts are a separate thing
Exhausting a Token Pack **does not interrupt your calls** — billing simply switches to your PAYG balance. What actually interrupts service is an insufficient balance: set up the [Low Balance Alert](/guide/pay-as-you-go) and top up before it runs out.
:::

## FAQ

### Do I need to configure or activate a Token Pack?

No. Packs take effect as soon as you claim them and are deducted automatically in priority order — no API key or settings changes are required.

### With multiple packs, which one is used first?

The **earliest-expiring pack is deducted first**, reducing the chance that allowance expires unused.

### Will exhausting my Token Pack interrupt my service?

No. Once a pack is exhausted, billing automatically switches to your PAYG balance (bonus credits first, then top-up credits). Calls only fail with a `402` insufficient-credit error when the balance itself is insufficient.

### Can Token Packs be refunded, withdrawn, or transferred?

No. Packs are platform-issued campaign benefits: the 24-hour PAYG top-up refund policy does not apply, and packs cannot be withdrawn or gifted.

### Are Token Pack allowances the same as PAYG Credits?

No. PAYG Credits are USD-denominated account balance (1 credit = $1 worth of API usage); Token Packs are token-denominated, carry their own validity, and are consumed **before** your PAYG balance.

### Where can I check remaining allowance and expiry?

Under **Gift Center → My Coupons**, or watch the allowance display and alert popups in Studio Chat.

## Next steps

- Learn how [Pay As You Go](/guide/pay-as-you-go) balances and top-ups work
- Learn about [Subscription Plans](/guide/subscription), quota (Flows), and Extra Usage
- Visit the [ZenMux Console](https://zenmux.ai/platform/pay-as-you-go) to check your balance and coupon packs

<ContactCards>
<ContactCard icon="mail" title="Email">

Technical support: [support@zenmux.ai](mailto:support@zenmux.ai)

Business cooperation: [bd@zenmux.ai](mailto:bd@zenmux.ai)

</ContactCard>
<ContactCard icon="x" title="X / Twitter" link="https://x.com/ZenMuxAI" label="@ZenMuxAI" />
<ContactCard icon="discord" title="Discord" link="https://discord.gg/vHZZzj84Bm" label="@ZenMuxAI" />
</ContactCards>
