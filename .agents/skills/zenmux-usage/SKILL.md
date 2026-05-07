---
name: zenmux-usage
description: >-
  Query real-time ZenMux account data via the Management API: subscription
  detail, account status, quota usage (5h/7d/monthly), Flow rate, PAYG balance,
  per-generation cost/tokens, timeseries trends, model leaderboards, and
  provider market share. Use when the user wants current usage, remaining
  quota, credits, balance, bonus credits, Flow rate, generation cost, token/cost
  trends, top models, rankings, or provider share. Trigger on "check my usage",
  "quota left", "my balance", "subscription status", "Flow rate", "generation
  cost", "usage trend", "top models", "leaderboard", "market share",
  "provider breakdown", "查用量", "余额", "配额", "订阅详情", "Flow 汇率",
  "额度还剩多少", "使用趋势", "排行榜", "模型排名", "供应商占比". Do not use for
  docs, setup, top-up, troubleshooting, or code-writing.
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
| Statistics timeseries | `GET /api/v1/management/statistics/timeseries` | Per-model token / cost series, bucketed by day or ISO week |
| Statistics leaderboard | `GET /api/v1/management/statistics/leaderboard` | Top-N model ranking by tokens or cost over a date range |
| Statistics market share | `GET /api/v1/management/statistics/market_share` | Per-provider token / cost series (absolute values — percentages are client-side) |

All endpoints require a **Management API Key** for authentication (`ZENMUX_MANAGEMENT_KEY`).

### Statistics endpoints — shared rules

The three `statistics/*` endpoints share the same contract:

- **Data window**: platform data starts from **2025-09-29**; the most recent available day is **yesterday (T-1)**.
- **`metric`** (required): `tokens` (input + output total) or `cost` (USD at list price).
- **`bucket_width`** (required for timeseries & market_share): `1d` (daily) or `1w` (ISO week aligned to Monday). Leaderboard has no bucket — it aggregates over the whole range.
- **`starting_at` / `ending_at`** (optional, `YYYY-MM-DD`, inclusive): default window is the last 28 buckets for timeseries/market_share, and `2025-09-29 → today` for leaderboard.
- **`limit`** (optional): Top-N (default `10`, max `50`). Anything outside Top-N is aggregated into a single `__others__` entry.
- **Bucket cap**: date range must not exceed **60 buckets** — otherwise the API returns `400`. If the user asks for a larger range, narrow it or switch to `1w`.
- **ISO-week alignment**: with `bucket_width=1w`, the server snaps `starting_at` / `ending_at` to Monday boundaries, so the echoed dates in the response may differ from the request.

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
| Usage / cost trend over time, daily or weekly chart, per-model history | **Statistics Timeseries** |
| Which models are used most, top-N ranking, overall leaderboard | **Statistics Leaderboard** |
| Provider (author) breakdown, market share, OpenAI vs Anthropic vs … over time | **Statistics Market Share** |
| General "check my usage" / "show my account" (broad request) | Call **Subscription Detail** first; if the user has PAYG, also call **PAYG Balance** |

If the user's request is ambiguous, call the Subscription Detail endpoint — it provides the most comprehensive overview and is typically what users want when they say "check my usage".

**Choosing statistics parameters when the user is vague:**
- No metric given → default to `tokens` (cheaper to reason about, model-agnostic). Offer to re-run with `cost` if they want money.
- No date range given → timeseries/market_share default to the last 28 buckets; leaderboard defaults to all-time since `2025-09-29`. Don't pass dates unless the user specified them.
- No bucket width given → `1d` for ranges ≤ 60 days, otherwise `1w`. For "the last few months" or "since launch", use `1w` to stay under the 60-bucket cap.
- No `limit` given → keep the default `10` unless the user asks for more.

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

### Statistics Timeseries

Use `-G` + `-d` so curl URL-encodes params into the query string:

```bash
curl -sG https://zenmux.ai/api/v1/management/statistics/timeseries \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_KEY" \
  -d metric=tokens \
  -d bucket_width=1d \
  -d starting_at=2026-03-01 \
  -d ending_at=2026-04-13 \
  -d limit=10 | jq .
```

Only pass `starting_at`, `ending_at`, `limit` when the user actually specified them — the server defaults are usually what's wanted.

### Statistics Leaderboard

Leaderboard has no `bucket_width` — it's a single aggregation over the date range.

```bash
curl -sG https://zenmux.ai/api/v1/management/statistics/leaderboard \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_KEY" \
  -d metric=cost \
  -d starting_at=2026-04-01 \
  -d ending_at=2026-04-15 \
  -d limit=5 | jq .
```

For "all-time" / "since launch" rankings, omit `starting_at` — it defaults to `2025-09-29`.

### Statistics Market Share

```bash
curl -sG https://zenmux.ai/api/v1/management/statistics/market_share \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_KEY" \
  -d metric=tokens \
  -d bucket_width=1w \
  -d starting_at=2026-01-01 \
  -d ending_at=2026-04-13 | jq .
```

Returns absolute values per provider per bucket. Compute share percentages on the client side (sum each bucket, divide each author's value by the total).

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

### Statistics Timeseries

Lead with the echoed range and bucket width so the user sees what they actually got (especially after ISO-week alignment). Then render one row per bucket, with a compact per-model breakdown.

```
Tokens by day · 2026-04-07 → 2026-04-13 (7 buckets)

Date         Total           Top models
2026-04-07   1.24B           Claude Sonnet 4.6 612M · GPT-4.1 401M · Others 227M
2026-04-08   1.05B           Claude Sonnet 4.6 540M · GPT-4.1 350M · Others 160M
…
```

Formatting rules:
- Sum `value` across each bucket's `models` to get the row total.
- Abbreviate large token counts (`1.24B`, `612M`). Format `cost` as USD with 2 decimals (`$1,234.56`).
- Show at most the top 3 models per row plus `__others__` (labelled "Others") — don't dump all 10.
- If the response's `starting_at` / `ending_at` differs from what the user asked for (ISO-week alignment), call that out in one line.

### Statistics Leaderboard

Render as a numbered ranking with the metric unit in the header.

```
Top models by cost · 2026-04-01 → 2026-04-15

#1  Claude Opus 4.6       (Anthropic)   $15,234.56
#2  GPT-4.1                (OpenAI)      $12,890.12
#3  Claude Sonnet 4.6     (Anthropic)   $ 9,876.54
#4  Gemini 2.5 Pro         (Google)      $ 7,654.32
#5  DeepSeek R1            (DeepSeek)    $ 5,432.10
—   Others                               $ 3,456.78
```

Formatting rules:
- Use `label` and `author_label` for display; fall back to `model` / `author` if the labels are missing.
- Put `__others__` last, rendered as "Others" with no rank number (its API `rank` is `limit + 1` — don't display it as `#11`, it's confusing).
- For `metric=tokens`, format as token counts (`1.24B`, `612M`); for `metric=cost`, format as USD.

### Statistics Market Share

The API returns absolute values — compute percentages before presenting. For each bucket, sum all authors' values and divide.

```
Provider share of tokens · 2026-03-23 → 2026-04-13 (weekly)

Week of       Anthropic   OpenAI    Google    Others   Total
2026-03-23    52.1%       28.4%     15.2%      4.3%    2.31B
2026-03-30    54.8%       26.9%     14.0%      4.3%    2.18B
2026-04-06    55.7%       25.3%     14.5%      4.5%    2.42B
2026-04-13    57.1%       24.1%     14.0%      4.8%    2.35B
```

Formatting rules:
- Compute `pct = value / bucket_total * 100`; guard against `bucket_total == 0`.
- Show the same set of providers as columns across all rows — if an author is missing from some buckets, show `0.0%`.
- Include a "Total" column with absolute units so the user sees both share and scale.
- For a single-bucket request (or `limit=1w` over a short range), you can render as a simple list instead of a table.

---

## Error handling

- **400** on a statistics call: usually date range > 60 buckets, or `starting_at` before `2025-09-29`. Narrow the range or switch `bucket_width` from `1d` to `1w`, then retry.
- **401 / 403**: The Management Key is invalid or expired. Suggest the user check their key at https://zenmux.ai/platform/management.
- **422**: Rate limited. Tell the user to wait a moment and try again.
- **Network error**: Suggest checking their internet connection.
- **Empty `series` / `entries`**: The account has no usage in the requested window. Mention the T-1 lag (today's data isn't aggregated yet) and offer to widen the range.
- **Empty or unexpected response**: Show the raw JSON so the user can inspect it, and suggest checking the ZenMux status page or docs.

---

## Tips

- You can call multiple endpoints in one session if the user asks for a broad overview. For instance, "check everything" could mean calling Subscription Detail + PAYG Balance + Flow Rate.
- The Generation Detail endpoint requires a generation ID. This ID comes from the response header or body of previous API calls (e.g., Chat Completions). If the user doesn't have one handy, explain where to find it.
- Subscription-plan API Keys (starting with `sk-ss-v1-`) cannot query billing info via the Generation endpoint — only PAYG keys or Management keys can.
- Statistics endpoints aggregate at T-1 — the current day is not yet included. If the user asks "how many tokens did I use today", explain the lag and offer yesterday's number instead.
- When a user wants both "the trend" and "the top models", call Timeseries and Leaderboard in parallel rather than sequentially — they're independent.
- Dates in statistics responses are echoed in `data.starting_at` / `data.ending_at`. Always read these back (not the request values) when narrating the result, because ISO-week alignment can shift them.
