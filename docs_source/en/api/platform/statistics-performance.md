---
pageClass: api-page
title: Interface
head:
  - - meta
    - name: description
      content: Get Statistics Performance
  - - meta
    - name: keywords
      content: Zenmux, API, statistics, performance, throughput, ttft, latency, cache hit, management
---

# Get Statistics Performance

::: info Troubleshooting
Encountering errors? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting steps.
:::

```http
GET https://zenmux.ai/api/v1/management/statistics/performance
```

Rank the top 10 models by a performance metric over a date range. Supports throughput, time-to-first-token latency, and cache hit rate. Each model entry breaks the metric down by provider so you can compare providers for the same model.

Use this endpoint to build performance leaderboards, pick the fastest provider for a model, or monitor cache efficiency.

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

Which performance metric to rank by.

- `throughput` — median output throughput (tokens/sec), sorted descending
- `ttft` — median time-to-first-token latency (ms), sorted ascending
- `cache_hit` — cache hit rate, sorted descending

### starting_at `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

Start date (inclusive), in `YYYY-MM-DD` format. Clamped to `2025-09-29` (platform data floor).

### ending_at `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

End date (inclusive), in `YYYY-MM-DD` format. Must not be later than today.

## Constraints

- Date range must not exceed **30 days**. Exceeding returns `400`.
- `starting_at` must not be later than `ending_at`.
- For `throughput` / `ttft`, days with no valid samples (median `0`, e.g. embedding/TTS/video models) are excluded, so models without latency/throughput data are not pushed to the top.

## Returns

### data.metric `string`

Echo of the requested metric (`"throughput"`, `"ttft"`, or `"cache_hit"`).

### data.starting_at `string`

Effective start date (`YYYY-MM-DD`).

### data.ending_at `string`

Effective end date (`YYYY-MM-DD`).

### data.entries `array`

Top 10 models. The entry shape depends on `metric`.

**For `throughput` / `ttft`:**

- `rank` `integer` — 1-based rank
- `model` `string` — Model slug
- `label` `string` — Model display name
- `icon_url` `string` — Model (or author fallback) icon URL
- `providers` `array` — Per-provider breakdown (sorted best-first):
  - `provider` `string` — Provider slug
  - `provider_label` `string` — Provider display name
  - `provider_icon_url` `string` — Provider icon URL
  - `value` `number` — Metric value (throughput tokens/sec, or latency ms)
  - `value_label` `string` — Pre-formatted label (e.g., `"152.34"` or `"420ms"`)

**For `cache_hit`:**

- `rank` `integer` — 1-based rank
- `model` `string` — Model slug
- `label` `string` — Model display name
- `icon_url` `string` — Model (or author fallback) icon URL
- `top_provider` `object` — The (provider, api) pair with the highest hit rate:
  - `provider_label` `string` — Provider display name
  - `api` `string` — API surface (e.g., `anthropic`, `openai`)
  - `value` `number` — Hit rate (0–1)
  - `value_label` `string` — Pre-formatted percentage (e.g., `"86.42%"`)
- `providers` `object` — Map keyed by provider slug:
  - `provider_label` `string` — Provider display name
  - `provider_icon_url` `string` — Provider icon URL
  - `apis` `array` — Per-api hit rate (sorted descending):
    - `api` `string` — API surface
    - `value` `number` — Hit rate (0–1)
    - `value_label` `string` — Pre-formatted percentage
    - `cache_tokens` `number` — Cache-read tokens (`input_cache_read`)
    - `prompt_tokens` `number` — Hit-rate denominator tokens (read + prompt + all cache-write tiers)

::: api-request GET /api/v1/management/statistics/performance

```cURL
curl -G https://zenmux.ai/api/v1/management/statistics/performance \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  -d metric=throughput \
  -d starting_at=2026-06-14 \
  -d ending_at=2026-06-21
```
:::

::: api-response

```json
{
  "success": true,
  "data": {
    "metric": "throughput",
    "starting_at": "2026-06-14",
    "ending_at": "2026-06-21",
    "entries": [
      {
        "rank": 1,
        "model": "qwen/qwen3-coder",
        "label": "Qwen3-Coder",
        "icon_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/04/01/qeMamJm/Property-1Qwen.svg",
        "providers": [
          {
            "provider": "alibaba",
            "provider_label": "Alibaba",
            "provider_icon_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/04/01/qeMamJm/Property-1Qwen.svg",
            "value": 152.34,
            "value_label": "152.34"
          }
        ]
      }
    ]
  }
}
```

```json|cache_hit
{
  "success": true,
  "data": {
    "metric": "cache_hit",
    "starting_at": "2026-06-14",
    "ending_at": "2026-06-21",
    "entries": [
      {
        "rank": 1,
        "model": "anthropic/claude-sonnet-4",
        "label": "Claude Sonnet 4",
        "icon_url": "https://cdn.marmot-cloud.com/storage/zenmux/2025/10/15/xxx/Property-1Anthropic.svg",
        "top_provider": {
          "provider_label": "Anthropic",
          "api": "anthropic",
          "value": 0.8642,
          "value_label": "86.42%"
        },
        "providers": {
          "anthropic": {
            "provider_label": "Anthropic",
            "provider_icon_url": "https://cdn.marmot-cloud.com/storage/zenmux/2025/10/15/xxx/Property-1Anthropic.svg",
            "apis": [
              {
                "api": "anthropic",
                "value": 0.8642,
                "value_label": "86.42%",
                "cache_tokens": 128450000,
                "prompt_tokens": 148630000
              }
            ]
          }
        }
      }
    ]
  }
}
```

:::
