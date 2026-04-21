---
pageClass: api-page
title: Interface
head:
  - - meta
    - name: description
      content: Get Statistics Timeseries
  - - meta
    - name: keywords
      content: Zenmux, API, statistics, timeseries, tokens, cost, management
---

# Get Statistics Timeseries

::: tip 💡 Troubleshooting
Encountering errors? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting steps.
:::

```
GET https://zenmux.ai/api/v1/management/statistics/timeseries
```

Retrieve token consumption or cost over time, broken down by model. Returns platform-wide aggregated data available from **2025-09-29** onward.

Use this endpoint to build stacked bar charts of model usage, track spending trends, or export historical data to CSV.

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

Which metric to retrieve.

- `tokens` — total input + output token count
- `cost` — list-price cost in USD

### bucket_width `string` <font color="red">Required</font>

Time bucket size.

- `1d` — daily buckets
- `1w` — ISO week buckets (Monday-aligned)

### starting_at `string`

Start date (inclusive), in `YYYY-MM-DD` format.

- Default: 28 buckets before `ending_at`
- Clamped to `2025-09-29` (platform data floor)

### ending_at `string`

End date (inclusive), in `YYYY-MM-DD` format.

- Default: today

### limit `integer`

Top N models per bucket.

- Default: `10`
- Max: `50`
- Models outside top N are aggregated as `__others__`

## Constraints

- Date range must not exceed **60 buckets**. Exceeding returns `400`.
- When `bucket_width=1w`, dates are **snapped to ISO week boundaries** (Monday). The response echoes the snapped dates, ensuring complete weeks with no truncated data.

## Returns

### data.metric `string`

Echo of the requested metric (`"tokens"` or `"cost"`).

### data.bucket_width `string`

Echo of the requested bucket width (`"1d"` or `"1w"`).

### data.starting_at `string`

Effective start date (`YYYY-MM-DD`). May differ from the requested value when weekly snapping applies.

### data.ending_at `string`

Effective end date (`YYYY-MM-DD`).

### data.total_buckets `integer`

Total number of time buckets in the response.

### data.series `array`

Array of time buckets. Each bucket contains:

- `period` `string` — Raw period key: `YYYYMMDD` for daily, `YYYYWW` for weekly
- `date` `string` — `YYYY-MM-DD` date. For weekly buckets, this is the Monday of the ISO week.
- `models` `array` — Per-model breakdown:
  - `model` `string` — Model slug (e.g., `anthropic/claude-sonnet-4-6`). `__others__` for models outside top N.
  - `label` `string` — Display name (e.g., "Claude Sonnet 4.6")
  - `value` `number` — Token count or USD cost for this bucket

::: api-request GET /api/v1/management/statistics/timeseries

```cURL
curl -G https://zenmux.ai/api/v1/management/statistics/timeseries \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  -d metric=tokens \
  -d bucket_width=1w \
  -d starting_at=2026-03-01 \
  -d ending_at=2026-04-13
```

```python
import requests

response = requests.get(
    "https://zenmux.ai/api/v1/management/statistics/timeseries",
    headers={"Authorization": f"Bearer {ZENMUX_MANAGEMENT_API_KEY}"},
    params={
        "metric": "tokens",
        "bucket_width": "1w",
        "starting_at": "2026-03-01",
        "ending_at": "2026-04-13",
    },
)
print(response.json())
```

```javascript
const params = new URLSearchParams({
  metric: "tokens",
  bucket_width: "1w",
  starting_at: "2026-03-01",
  ending_at: "2026-04-13",
});

const response = await fetch(
  `https://zenmux.ai/api/v1/management/statistics/timeseries?${params}`,
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
    "metric": "tokens",
    "bucket_width": "1w",
    "starting_at": "2026-02-23",
    "ending_at": "2026-04-13",
    "total_buckets": 8,
    "series": [
      {
        "period": "202609",
        "date": "2026-02-23",
        "models": [
          {
            "model": "anthropic/claude-sonnet-4-6",
            "label": "Claude Sonnet 4.6",
            "value": 89234567890
          },
          {
            "model": "openai/gpt-4.1",
            "label": "GPT-4.1",
            "value": 45678901234
          },
          {
            "model": "__others__",
            "label": "Others",
            "value": 12345678
          }
        ]
      }
    ]
  }
}
```

:::

::: tip 💡 ISO week snapping
In the example above, `starting_at` in the response is `2026-02-23` (Monday), not `2026-03-01` as requested, because `bucket_width=1w` snaps to ISO week boundaries.
:::
