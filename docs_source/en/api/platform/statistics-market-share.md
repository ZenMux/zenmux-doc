---
pageClass: api-page
title: Interface
head:
  - - meta
    - name: description
      content: Get Statistics Market Share
  - - meta
    - name: keywords
      content: Zenmux, API, statistics, market share, provider, tokens, cost, management
---

# Get Statistics Market Share

::: tip 💡 Troubleshooting
Encountering errors? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting steps.
:::

```
GET https://zenmux.ai/api/v1/management/statistics/market_share
```

Track provider market share over time. Returns absolute values per provider per time bucket — compute percentages client-side by dividing each provider's value by the bucket total.

Use this endpoint to visualize how provider dominance shifts over time, build 100% stacked charts, or monitor competitive dynamics across the platform.

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

Which metric to compute market share for.

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

Top N providers per bucket.

- Default: `10`
- Max: `50`
- Providers outside top N are aggregated as `__others__`

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
- `authors` `array` — Per-provider breakdown:
  - `author` `string` — Provider slug (e.g., `anthropic`). `__others__` for providers outside top N.
  - `label` `string` — Provider display name (e.g., "Anthropic")
  - `value` `number` — Absolute token count or USD cost for this bucket (not a percentage)

::: tip 💡 Computing percentages
The API returns absolute values. To compute market share percentages, divide each provider's value by the bucket total:

```python
for bucket in data["series"]:
    total = sum(a["value"] for a in bucket["authors"])
    for author in bucket["authors"]:
        pct = author["value"] / total * 100 if total > 0 else 0
        print(f"  {author['label']}: {pct:.1f}%")
```

:::

::: api-request GET /api/v1/management/statistics/market_share

```cURL
curl -G https://zenmux.ai/api/v1/management/statistics/market_share \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  -d metric=tokens \
  -d bucket_width=1w \
  -d starting_at=2026-01-01 \
  -d ending_at=2026-04-13
```

```python
import requests

response = requests.get(
    "https://zenmux.ai/api/v1/management/statistics/market_share",
    headers={"Authorization": f"Bearer {ZENMUX_MANAGEMENT_API_KEY}"},
    params={
        "metric": "tokens",
        "bucket_width": "1w",
        "starting_at": "2026-01-01",
        "ending_at": "2026-04-13",
    },
)
print(response.json())
```

```javascript
const params = new URLSearchParams({
  metric: "tokens",
  bucket_width: "1w",
  starting_at: "2026-01-01",
  ending_at: "2026-04-13",
});

const response = await fetch(
  `https://zenmux.ai/api/v1/management/statistics/market_share?${params}`,
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
    "starting_at": "2025-12-29",
    "ending_at": "2026-04-13",
    "total_buckets": 16,
    "series": [
      {
        "period": "202601",
        "date": "2025-12-29",
        "authors": [
          {
            "author": "anthropic",
            "label": "Anthropic",
            "value": 272605099
          },
          {
            "author": "openai",
            "label": "OpenAI",
            "value": 185432100
          },
          {
            "author": "google",
            "label": "Google",
            "value": 98765432
          },
          {
            "author": "__others__",
            "label": "Others",
            "value": 1955805
          }
        ]
      }
    ]
  }
}
```

:::
