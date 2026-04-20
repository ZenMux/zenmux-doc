---
pageClass: api-page
title: Interface
head:
  - - meta
    - name: description
      content: Get Statistics Leaderboard
  - - meta
    - name: keywords
      content: Zenmux, API, statistics, leaderboard, ranking, tokens, cost, management
---

# Get Statistics Leaderboard

::: tip 💡 Troubleshooting
Encountering errors? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting steps.
:::

```
GET https://zenmux.ai/api/v1/management/statistics/leaderboard
```

Rank models by total token consumption or cost over a date range. Returns the top N models plus an aggregated "Others" entry for the remainder.

Use this endpoint to see which models dominate platform traffic, compare spending across providers, or build leaderboard visualizations.

::: info ℹ️ Data freshness
Statistics data is aggregated on a daily schedule. The most recent available data is from **yesterday (T-1)**. Today's usage will appear in tomorrow's aggregation.
:::

## Authentication

### Authorization Header <font color="red">Required</font>

```http
Authorization: Bearer <ZENMUX_MANAGEMENT_API_KEY>
```

- **Name**: `Authorization`
- **Format**: `Bearer <API_KEY>`
- **Description**: A Management API Key created in the [ZenMux Console](https://zenmux.ai/platform/management)

::: warning ⚠️ Management API Key required
This endpoint only accepts Management API Keys. Standard API Keys are not supported.
:::

## Rate Limiting

Each endpoint has its own independent rate limit counter. The maximum number of requests per minute is configured at the platform level. Exceeding the limit returns a `422` error.

## Parameters

### metric `string` <font color="red">Required</font>

Which metric to rank by.

- `tokens` — total input + output token count
- `cost` — list-price cost in USD

### starting_at `string`

Start date (inclusive), in `YYYY-MM-DD` format.

- Default: `2025-09-29` (platform data floor — equivalent to all-time)

### ending_at `string`

End date (inclusive), in `YYYY-MM-DD` format.

- Default: today

### limit `integer`

Top N models to return.

- Default: `10`
- Max: `50`
- Models outside top N are aggregated as a single `__others__` entry

## Returns

### data.metric `string`

Echo of the requested metric (`"tokens"` or `"cost"`).

### data.starting_at `string`

Effective start date (`YYYY-MM-DD`).

### data.ending_at `string`

Effective end date (`YYYY-MM-DD`).

### data.entries `array`

Ranked list of models. Each entry contains:

- `rank` `number` — 1-based rank. The `__others__` entry has rank = `limit + 1`.
- `model` `string` — Model slug (e.g., `anthropic/claude-opus-4-6`). `__others__` for the aggregate.
- `label` `string` — Display name (e.g., "Claude Opus 4.6")
- `author` `string` — Provider slug (e.g., `anthropic`, `openai`). Empty for `__others__`.
- `author_label` `string` — Provider display name (e.g., "Anthropic"). Empty for `__others__`.
- `value` `number` — Total token count or USD cost over the date range

::: api-request GET /api/v1/management/statistics/leaderboard

```cURL
curl -G https://zenmux.ai/api/v1/management/statistics/leaderboard \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  -d metric=cost \
  -d starting_at=2026-04-01 \
  -d ending_at=2026-04-15 \
  -d limit=5
```

```python
import requests

response = requests.get(
    "https://zenmux.ai/api/v1/management/statistics/leaderboard",
    headers={"Authorization": f"Bearer {ZENMUX_MANAGEMENT_API_KEY}"},
    params={
        "metric": "cost",
        "starting_at": "2026-04-01",
        "ending_at": "2026-04-15",
        "limit": 5,
    },
)
print(response.json())
```

```javascript
const params = new URLSearchParams({
  metric: "cost",
  starting_at: "2026-04-01",
  ending_at: "2026-04-15",
  limit: "5",
});

const response = await fetch(
  `https://zenmux.ai/api/v1/management/statistics/leaderboard?${params}`,
  { headers: { Authorization: `Bearer ${ZENMUX_MANAGEMENT_API_KEY}` } }
);
const data = await response.json();
```

:::

::: api-response

```json
{
  "success": true,
  "data": {
    "metric": "cost",
    "starting_at": "2026-04-01",
    "ending_at": "2026-04-15",
    "entries": [
      {
        "rank": 1,
        "model": "anthropic/claude-opus-4-6",
        "label": "Claude Opus 4.6",
        "author": "anthropic",
        "author_label": "Anthropic",
        "value": 15234.56
      },
      {
        "rank": 2,
        "model": "openai/gpt-4.1",
        "label": "GPT-4.1",
        "author": "openai",
        "author_label": "OpenAI",
        "value": 12890.12
      },
      {
        "rank": 3,
        "model": "anthropic/claude-sonnet-4-6",
        "label": "Claude Sonnet 4.6",
        "author": "anthropic",
        "author_label": "Anthropic",
        "value": 9876.54
      },
      {
        "rank": 4,
        "model": "google/gemini-2.5-pro",
        "label": "Gemini 2.5 Pro",
        "author": "google",
        "author_label": "Google",
        "value": 7654.32
      },
      {
        "rank": 5,
        "model": "deepseek/deepseek-r1",
        "label": "DeepSeek R1",
        "author": "deepseek",
        "author_label": "DeepSeek",
        "value": 5432.10
      },
      {
        "rank": 6,
        "model": "__others__",
        "label": "Others",
        "author": "",
        "author_label": "",
        "value": 3456.78
      }
    ]
  }
}
```

:::

::: tip 💡 All-time leaderboard
Omit `starting_at` to default to `2025-09-29` (platform launch date), giving you the all-time leaderboard.
:::
