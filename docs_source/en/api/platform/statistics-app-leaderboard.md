---
pageClass: api-page
title: Interface
head:
  - - meta
    - name: description
      content: Get App Leaderboard
  - - meta
    - name: keywords
      content: Zenmux, API, statistics, apps, agents, leaderboard, ranking, tokens, cost, management
---

# Get App Leaderboard

::: info Troubleshooting
Encountering errors? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting steps.
:::

```http
GET https://zenmux.ai/api/v1/management/statistics/apps/leaderboard
```

Rank **apps and agents** (clients and gateways that call ZenMux, such as Claude Code, Codex, and LiteLLM) by their usage within a given window, returning the top 10 plus an aggregated "Others" row. Each entry includes the cumulative usage for the window, the period-over-period change, and a 7-day per-day detail series.

The data is identical to the app leaderboard module on the ZenMux [Analytics → App](https://zenmux.ai/analytics/apps) page. The difference from [Get App Trending](/api/platform/statistics-app-trending): this endpoint ranks by **absolute usage**, while the trending endpoint ranks by **momentum**.

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

Which metric to rank by.

- `tokens` — total input + output token count
- `cost` — list-price cost in USD

### period `string`

The statistics window. All windows end on `ending_at` (yesterday, T-1, by default).

- `1d` — the anchor day alone, compared with the day before (default)
- `7d` — sum of the 7 days up to the anchor, compared with the 7 days before that
- `30d` — sum of the 30 days up to the anchor, compared with the 30 days before that
- `total` — cumulative from the data start date `2025-09-29` through the anchor day; **no change is computed** (`growth_rate` is `0` and `growth_label` is an empty string)

### ending_at `string`

Anchor business day (inclusive), formatted as `YYYY-MM-DD` (UTC).

- Default: yesterday (T-1, UTC)
- Must not be later than yesterday (T-1, UTC); data is aggregated daily, so today's data is only available tomorrow
- Must not be earlier than the data start date `2025-09-29`

### limit `integer`

Maximum number of entries to return, between `1` and `11` (top 10 plus the aggregated "Others" row).

- Default: all entries
- A value larger than the number of available entries behaves the same as omitting it; `<= 0` and invalid values are ignored rather than rejected

## Constraints

- The ranking is fixed at the top 10. Entries ranked 11th and below are aggregated into a single row with `app = "__others__"` (`label = "Others"`) so shares still add up to 100%. When nothing falls outside the top 10, this row is omitted.
- The change is aligned with `period` (last 7 days vs. previous 7 days, last 30 days vs. previous 30 days) rather than a fixed single-day comparison.
- `data_points` always covers the 7 days up to the anchor regardless of `period`. With `period=30d` it shows only the final week, not the full window.
- Apps with zero usage in the window are excluded.

## Response

### data.metric `string`

Echo of the requested metric (`"tokens"` or `"cost"`).

### data.period `string`

Echo of the requested window (`"1d"`, `"7d"`, `"30d"`, or `"total"`).

### data.ending_at `string`

The anchor date actually used (`YYYY-MM-DD`). When `ending_at` is omitted this is yesterday (T-1, UTC), so you can always tell which day the data belongs to.

### data.entries `array`

Apps and agents sorted by cumulative usage in the window, descending. Each entry contains:

- `rank` `integer` — 1-based rank
- `app` `string` — app/agent identifier (e.g. `claude-code`); `__others__` for the aggregated row
- `label` `string` — display name, in English
- `description` `string` — short description, in English (may be an empty string)
- `icon_url` `string` — icon URL (empty string when not configured)
- `zenmux_url` `string` — ZenMux integration guide URL (empty string when not configured)
- `official_url` `string` — official website URL (empty string when not configured)
- `value` `number` — cumulative usage within the window
- `growth_rate` `number` — period-over-period change as a **percentage value**, rounded to 2 decimals (`-12.34` means -12.34%); always `0` when the previous period had zero usage or when `period=total`
- `growth_label` `string` — pre-formatted percentage label (e.g. `"+18.20%"`); empty string when the previous period had zero usage or when `period=total`
- `data_points` `array` — per-day detail series for the 7 days up to the anchor, ascending, with missing days filled as 0:
  - `period` `string` — business day in `YYYYMMDD`
  - `value` `number` — metric value for that day

::: api-request GET /api/v1/management/statistics/apps/leaderboard

```cURL
curl -G https://zenmux.ai/api/v1/management/statistics/apps/leaderboard \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  -d metric=cost \
  -d period=7d \
  -d ending_at=2026-08-23
```
:::

::: api-response

```json
{
  "success": true,
  "data": {
    "metric": "cost",
    "period": "7d",
    "ending_at": "2026-08-23",
    "entries": [
      {
        "rank": 1,
        "app": "claude-code",
        "label": "Claude Code",
        "description": "Anthropic's official command-line coding assistant",
        "icon_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/08/17/GxmXP7H/NameClaudeCode.svg",
        "zenmux_url": "https://zenmux.ai/docs/best-practices/claude-code.html",
        "official_url": "https://www.anthropic.com/claude-code",
        "value": 23228.3162,
        "growth_rate": 18.2,
        "growth_label": "+18.20%",
        "data_points": [
          { "period": "20260817", "value": 3102.4412 },
          { "period": "20260818", "value": 3288.1043 },
          { "period": "20260819", "value": 3401.7729 },
          { "period": "20260820", "value": 3355.9018 },
          { "period": "20260821", "value": 3390.2277 },
          { "period": "20260822", "value": 3371.5375 },
          { "period": "20260823", "value": 3318.3308 }
        ]
      },
      {
        "rank": 11,
        "app": "__others__",
        "label": "Others",
        "description": "All remaining apps and agents",
        "icon_url": "",
        "zenmux_url": "",
        "official_url": "",
        "value": 1042.8837,
        "growth_rate": -4.51,
        "growth_label": "-4.51%",
        "data_points": [
          { "period": "20260817", "value": 155.2211 },
          { "period": "20260818", "value": 149.8032 },
          { "period": "20260819", "value": 151.4477 },
          { "period": "20260820", "value": 147.9902 },
          { "period": "20260821", "value": 149.1188 },
          { "period": "20260822", "value": 145.3319 },
          { "period": "20260823", "value": 143.9708 }
        ]
      }
    ]
  }
}
```

:::
