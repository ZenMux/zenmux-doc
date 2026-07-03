---
pageClass: api-page
title: Interface
head:
  - - meta
    - name: description
      content: Get Statistics Trending
  - - meta
    - name: keywords
      content: Zenmux, API, statistics, trending, growth, models, tokens, cost, management
---

# Get Statistics Trending

::: info Troubleshooting
Encountering errors? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting steps.
:::

```http
GET https://zenmux.ai/api/v1/management/statistics/trending
```

Rank models by a combined growth × magnitude score. Returns the top N models with the strongest upward momentum (including brand-new models that just spiked), each with its current/previous comparison values, growth rate, and a per-day detail series for sparkline rendering.

Use this endpoint to surface breakout models, build "Trending" leaderboards, or monitor momentum shifts across the catalog.

Ranking score: `score = log1p(today) × (today + α) / (yesterday_eff + α)`, where `today` is the current-window volume, `yesterday_eff` is the previous-window volume (new models fall back to a dynamic baseline), and `α` is an additive smoothing constant. Multiplying the growth signal by a magnitude weight surfaces models that are both rising and sizable, while suppressing small-base noise.

::: info Data freshness
Statistics data is aggregated on a daily schedule. The most recent available data is from **yesterday (T-1)**. Today's usage will appear in tomorrow's aggregation.
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

Which metric to rank growth by.

- `tokens` — total input + output token count
- `cost` — list-price cost in USD

### bucket_width `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

Comparison window for the growth rate.

- `1d` — `ending_at` vs. the previous day; detail series covers the last 7 days
- `1w` — last 7 days vs. the prior 7 days (both summed); detail series covers the last 14 days

### ending_at `string`

Anchor date (inclusive), the end of the comparison window, in `YYYY-MM-DD` format.

- Default: yesterday (T-1, UTC)
- Must not be later than yesterday (T-1, UTC); data is aggregated daily and the current day becomes available the next day
- Must not be earlier than the data start date `2025-09-29`

### limit `integer`

Top N models to return.

- Default: `10`
- Max: `50`

## Constraints

- Models whose current-window volume falls below a dynamic threshold are excluded, filtering out long-tail small-base noise.
- New models without a previous-window baseline fall back to a dynamic baseline, so they compete fairly on their current magnitude (neither pushed to the top for lack of a baseline, nor excluded outright).
- The detail window is fixed by `bucket_width` (`1d` → 7 days, `1w` → 14 days) and cannot be customized.

## Returns

### data.metric `string`

Echo of the requested metric (`"tokens"` or `"cost"`).

### data.bucket_width `string`

Echo of the requested bucket width (`"1d"` or `"1w"`).

### data.ending_at `string`

Anchor date (`YYYY-MM-DD`).

### data.entries `array`

Models sorted by combined score (growth × magnitude), descending. Each entry contains:

- `rank` `integer` — 1-based rank
- `model` `string` — Model slug (e.g., `qwen/qwen3-coder`)
- `label` `string` — Model display name
- `author` `string` — Author/provider slug (e.g., `qwen`)
- `author_label` `string` — Author display name
- `icon_url` `string` — Model (or author fallback) icon URL
- `value` `number` — Current-window volume (`1d`: anchor-day sum; `1w`: last-7-day sum)
- `total_value` `number` — Total over the display window, identical to `value`. Use this for display.
- `previous_value` `number` — Effective baseline for the previous window: for existing models, the real previous-window volume (`1d`: previous day; `1w`: prior 7 days); for new models, a dynamic fallback baseline (not a real historical value)
- `growth_rate` `number` — Additively smoothed period-over-period growth rate, rounded to 2 decimals. Because of smoothing it is **not strictly equal** to `(value - previous_value) / previous_value`; do not back-derive it
- `growth_label` `string` — Pre-formatted percentage label (e.g., `"+40615.61%"`)
- `data_points` `array` — Per-day detail series (ascending):
  - `period` `string` — Business day `YYYYMMDD`
  - `value` `number` — Metric value for that day

::: api-request GET /api/v1/management/statistics/trending

```bash [cURL]
curl -G https://zenmux.ai/api/v1/management/statistics/trending \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  -d metric=cost \
  -d bucket_width=1d \
  -d ending_at=2026-06-21 \
  -d limit=10
```
:::

::: api-response

```json
{
  "success": true,
  "data": {
    "metric": "cost",
    "bucket_width": "1d",
    "ending_at": "2026-06-21",
    "entries": [
      {
        "rank": 1,
        "model": "qwen/qwen3-coder",
        "label": "Qwen3-Coder",
        "author": "qwen",
        "author_label": "Qwen",
        "icon_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/04/01/qeMamJm/Property-1Qwen.svg",
        "value": 1.63367713,
        "total_value": 1.63367713,
        "previous_value": 0.00401241,
        "growth_rate": 406.16,
        "growth_label": "+40615.61%",
        "data_points": [
          { "period": "20260615", "value": 0.00005835 },
          { "period": "20260616", "value": 0.26396599 },
          { "period": "20260617", "value": 1.44900805 },
          { "period": "20260618", "value": 13.43269683 },
          { "period": "20260619", "value": 16.53876505 },
          { "period": "20260620", "value": 16.87021709 },
          { "period": "20260621", "value": 1.63367713 }
        ]
      }
    ]
  }
}
```

:::
