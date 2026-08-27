---
pageClass: api-page
title: Interface
head:
  - - meta
    - name: description
      content: Get App Trending
  - - meta
    - name: keywords
      content: Zenmux, API, statistics, apps, agents, trending, growth, tokens, cost, management
---

# Get App Trending

::: info Troubleshooting
Encountering errors? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting steps.
:::

```http
GET https://zenmux.ai/api/v1/management/statistics/apps/trending
```

Rank **apps and agents** (clients and gateways that call ZenMux, such as Claude Code, Codex, and LiteLLM) by a combined growth × magnitude score, returning the top 10 with the strongest upward momentum. Each entry includes its current-window usage, growth rate, and a per-day detail series for sparkline rendering.

The data is identical to the "Trending App Agent" module on the ZenMux [Analytics → App](https://zenmux.ai/analytics/apps) page. Use it to spot apps that are breaking out, or to build your own trending board.

::: info How apps and agents are identified
ZenMux identifies the calling app or agent from request characteristics (OAuth client identity, User-Agent, and more) and normalizes it into a unified app catalog. Unidentified traffic is excluded from the rankings.
:::

::: info Data freshness
Statistics data is aggregated on a daily schedule. The most recent available data is from **yesterday (T-1, UTC)**. Today's usage will appear in tomorrow's aggregation.
:::

## Authentication

### Authorization Header <span style="color: #FA6062; font-weight: 400">&#42;</span>

```http
Authorization: Bearer <ZENMUX_MANAGEMENT_API_KEY>
```

- **Name**: `Authorization`
- **Format**: `Bearer <API_KEY>`
- **Description**: A Management API Key created in the [ZenMux Console](https://zenmux.ai/platform/management)

::: warning Management API Key required
This endpoint only accepts Management API Keys. Standard API Keys are not supported.
:::

## Rate Limiting

Each endpoint has its own independent rate limit counter. The maximum number of requests per minute is configured at the platform level. Exceeding the limit returns a `422` error.

## Parameters

### metric `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

Which metric to rank and compute growth by.

- `tokens` — total input + output token count
- `cost` — list-price cost in USD

### bucket_width `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

The current window and its comparison window.

- `1d` — the anchor day alone, compared with the day before; detail series covers the 7 days up to the anchor
- `1w` — sum of the 7 days up to the anchor, compared with the 7 days before that; detail series covers the 14 days up to the anchor

### ending_at `string`

Anchor business day (inclusive), formatted as `YYYY-MM-DD` (UTC).

- Default: yesterday (T-1, UTC)
- Must not be later than yesterday (T-1, UTC); data is aggregated daily, so today's data is only available tomorrow
- Must not be earlier than the data start date `2025-09-29`

### limit `integer`

Maximum number of entries to return, between `1` and `10`.

- Default: all entries (the ranking is always computed as a top 10)
- A value larger than the number of available entries behaves the same as omitting it; `<= 0` and invalid values are ignored rather than rejected

## Constraints

- The ranking is fixed at the top 10 and cannot be paginated. For a full ranking, use [Get App Leaderboard](/api/platform/statistics-app-leaderboard).
- The detail window is determined by `bucket_width` (`1d` → 7 days, `1w` → 14 days) and cannot be customized.
- Apps whose current-window usage falls below a **dynamic threshold** (a quantile of that day's usage across all apps) are excluded, filtering out small-base long-tail noise.

## Response

### data.metric `string`

Echo of the requested metric (`"tokens"` or `"cost"`).

### data.bucket_width `string`

Echo of the requested window granularity (`"1d"` or `"1w"`).

### data.ending_at `string`

The anchor date actually used (`YYYY-MM-DD`). When `ending_at` is omitted this is yesterday (T-1, UTC), so you can always tell which day the data belongs to.

### data.entries `array`

Apps and agents sorted by the combined growth × magnitude score, descending. Each entry contains:

- `rank` `integer` — 1-based rank
- `app` `string` — app/agent identifier (e.g. `claude-code`, `codex`, `litellm`)
- `label` `string` — display name, in English
- `description` `string` — short description, in English (may be an empty string)
- `icon_url` `string` — icon URL (empty string when not configured)
- `zenmux_url` `string` — ZenMux integration guide URL (empty string when not configured)
- `official_url` `string` — official website URL (empty string when not configured)
- `value` `number` — usage in the current window (`1d`: the anchor day; `1w`: sum of the 7 days up to the anchor)
- `growth_rate` `number` — period-over-period growth as a **percentage value**, rounded to 2 decimals (`95.6` means +95.6%). It is additively smoothed, and apps ramping up for the first time fall back to a **dynamic baseline** instead of a real previous value, so it is **not strictly equal** to `(current - previous) / previous` and cannot be used to reverse-engineer the previous usage
- `growth_label` `string` — pre-formatted percentage label (e.g. `"+95.60%"`), derived from `growth_rate`; always non-empty
- `data_points` `array` — per-day detail series, ascending, with missing days filled as 0:
  - `period` `string` — business day in `YYYYMMDD`
  - `value` `number` — metric value for that day

::: api-request GET /api/v1/management/statistics/apps/trending

```cURL
curl -G https://zenmux.ai/api/v1/management/statistics/apps/trending \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  -d metric=tokens \
  -d bucket_width=1d \
  -d ending_at=2026-08-23 \
  -d limit=10
```
:::

::: api-response

```json
{
  "success": true,
  "data": {
    "metric": "tokens",
    "bucket_width": "1d",
    "ending_at": "2026-08-23",
    "entries": [
      {
        "rank": 1,
        "app": "litellm",
        "label": "LiteLLM",
        "description": "Unified LLM gateway and proxy",
        "icon_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/08/17/GgJ5jo3/NameLiteLLM.svg",
        "zenmux_url": "",
        "official_url": "",
        "value": 1802240416,
        "growth_rate": 128.44,
        "growth_label": "+128.44%",
        "data_points": [
          { "period": "20260817", "value": 402118773 },
          { "period": "20260818", "value": 511903244 },
          { "period": "20260819", "value": 623440190 },
          { "period": "20260820", "value": 700118231 },
          { "period": "20260821", "value": 742330119 },
          { "period": "20260822", "value": 788771905 },
          { "period": "20260823", "value": 1802240416 }
        ]
      },
      {
        "rank": 2,
        "app": "codex",
        "label": "Codex",
        "description": "OpenAI Codex CLI",
        "icon_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/3e4UfxM/Property-1codex.svg",
        "zenmux_url": "https://zenmux.ai/docs/best-practices/codex.html",
        "official_url": "",
        "value": 1620342892,
        "growth_rate": 95.6,
        "growth_label": "+95.60%",
        "data_points": [
          { "period": "20260817", "value": 690118773 },
          { "period": "20260818", "value": 714903244 },
          { "period": "20260819", "value": 760440190 },
          { "period": "20260820", "value": 791118231 },
          { "period": "20260821", "value": 812330119 },
          { "period": "20260822", "value": 828229905 },
          { "period": "20260823", "value": 1620342892 }
        ]
      }
    ]
  }
}
```

:::
