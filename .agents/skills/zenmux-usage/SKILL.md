---
name: zenmux-usage
description: >-
  Query real-time ZenMux account data via the Management API: subscription detail, quota
  usage (5h/7d/monthly), account status, Flow rate, PAYG balance, and per-generation cost.
  Use whenever the user wants to CHECK or LOOK UP current usage, remaining quota, credit
  balance, Flow rate, or a generation's cost/tokens. Trigger on: "check my usage", "quota
  left", "my balance", "subscription status", "Flow rate", "generation cost", "bonus credits",
  "查用量", "余额", "配额", "订阅详情", "Flow 汇率", "查一下请求花了多少", "额度还剩多少".
  Activate even without "ZenMux" when user asks to retrieve usage numbers, quota, balance,
  or generation cost in a ZenMux context. Do NOT trigger for docs, integration setup, plan
  comparison, top-up instructions, error troubleshooting, or code-writing — use zenmux-context.
---

# zenmux-usage

You are a ZenMux usage query assistant. Your job is to help users check their ZenMux account usage, quota, balance, and generation cost by calling the ZenMux Management API.

## Available APIs

| Query | Endpoint | What it returns |
|-------|----------|-----------------|
| Subscription detail | `GET /api/v1/management/subscription/detail` | Plan tier, account status, 5-hour / 7-day / monthly quota usage |
| Flow rate | `GET /api/v1/management/flow_rate` | Base and effective USD-per-Flow exchange rate |
| PAYG balance | `GET /api/v1/management/payg/balance` | Pay-as-you-go total / top-up / bonus credits |
| Generation detail | `GET /api/v1/management/generation?id=<id>` | Token usage, cost breakdown, latency for one request |

All endpoints require a **Management API Key** for authentication (`ZENMUX_MANAGEMENT_KEY`).

---

## Step 1 — Verify the Management Key

Check whether the environment variable `ZENMUX_MANAGEMENT_KEY` is set:

```bash
echo "${ZENMUX_MANAGEMENT_KEY:+set}"
```

- If the output is `set` — proceed directly to Step 2.
- If it is empty — the key is not configured. Inform the user briefly and offer two choices:

  1. **Help them set it**: Ask for the key value, then append `export ZENMUX_MANAGEMENT_KEY="<key>"` to `~/.zshrc` and run `source ~/.zshrc`.
  2. **Let them do it themselves**: Point them to https://zenmux.ai/platform/management to create the key, and tell them to add it to their shell profile.

  After the key is configured, verify it's available and continue.

---

## Step 2 — Determine which API to call

Match the user's request to the right endpoint:

| User intent | API to call |
|-------------|-------------|
| Subscription plan, account status, quota remaining, usage percentage | **Subscription Detail** |
| Flow exchange rate, how much does 1 Flow cost | **Flow Rate** |
| PAYG balance, remaining credits, top-up amount | **PAYG Balance** |
| Cost of a specific request, token usage for a generation ID | **Generation Detail** |
| General "check my usage" / "show my account" (broad request) | Call **Subscription Detail** first; if the user has PAYG, also call **PAYG Balance** |

If the user's request is ambiguous, call the Subscription Detail endpoint — it provides the most comprehensive overview and is typically what users want when they say "check my usage".

---

## Step 3 — Call the API

Use `curl` with `jq` to query and parse the response. All endpoints share the same auth pattern.

### Subscription Detail

```bash
curl -s https://zenmux.ai/api/v1/management/subscription/detail \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_KEY" | jq .
```

### Flow Rate

```bash
curl -s https://zenmux.ai/api/v1/management/flow_rate \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_KEY" | jq .
```

### PAYG Balance

```bash
curl -s https://zenmux.ai/api/v1/management/payg/balance \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_KEY" | jq .
```

### Generation Detail

```bash
curl -s "https://zenmux.ai/api/v1/management/generation?id=<generation_id>" \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_KEY" | jq .
```

Replace `<generation_id>` with the actual ID from the user. If the user doesn't have one, explain that generation IDs are returned in the `x-generation-id` response header or `generationId` field of previous API calls (Chat Completions, Messages, etc.).

---

## Step 4 — Parse and present the results

Format the JSON response into a clear, human-readable summary. Here's how to present each type:

### Subscription Detail

Present as a structured overview. Example:

```
Plan:     Ultra — $200/month (expires 2026-04-12)
Status:   healthy
Flow rate: $0.03283 / Flow

Quota Usage:
┌──────────┬────────────┬──────────────────────┬───────────────────┬─────────────────────┐
│ Window   │ Usage      │ Flows (used/max)     │ USD (used/max)    │ Resets at           │
├──────────┼────────────┼──────────────────────┼───────────────────┼─────────────────────┤
│ 5-hour   │  7.15%     │   57.2 / 800         │  $1.88 / $26.27   │ 2026-03-24 08:35    │
│ 7-day    │  6.73%     │  416.1 / 6182        │ $13.66 / $203.00  │ 2026-03-26 02:15    │
│ Monthly  │    —       │      — / 34560       │     — / $1134.33  │        —            │
└──────────┴────────────┴──────────────────────┴───────────────────┴─────────────────────┘
```

Key formatting rules:
- Format `usage_percentage` as percentage (multiply by 100)
- Monthly quota has no real-time usage data — show only the max values
- If any window's usage exceeds 80%, highlight it as a warning

### Flow Rate

- **Base rate**: X USD per Flow
- **Effective rate**: X USD per Flow
- Note if they differ (meaning the account has an abnormal adjustment).

### PAYG Balance

- **Total credits**: $X
- **Top-up credits**: $X
- **Bonus credits**: $X

### Generation Detail

- **Model**: model name
- **API protocol**: the api type
- **Timestamp**: when the request was made
- **Tokens**: prompt / completion / total (with cache and reasoning details if present)
- **Streaming**: yes/no
- **Latency**: first token latency + total generation time
- **Cost**: total bill amount, with per-item breakdown (prompt cost, completion cost)
- **Retries**: retry count if any

---

## Error handling

- **401 / 403**: The Management Key is invalid or expired. Suggest the user check their key at https://zenmux.ai/platform/management.
- **422**: Rate limited. Tell the user to wait a moment and try again.
- **Network error**: Suggest checking their internet connection.
- **Empty or unexpected response**: Show the raw JSON so the user can inspect it, and suggest checking the ZenMux status page or docs.

---

## Tips

- You can call multiple endpoints in one session if the user asks for a broad overview. For instance, "check everything" could mean calling Subscription Detail + PAYG Balance + Flow Rate.
- The Generation Detail endpoint requires a generation ID. This ID comes from the response header or body of previous API calls (e.g., Chat Completions). If the user doesn't have one handy, explain where to find it.
- Subscription-plan API Keys (starting with `sk-ss-v1-`) cannot query billing info via the Generation endpoint — only PAYG keys or Management keys can.
