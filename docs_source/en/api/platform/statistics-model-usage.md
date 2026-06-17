---
pageClass: api-page
title: Interface
head:
  - - meta
    - name: description
      content: Get daily model usage for a single model over a time range
  - - meta
    - name: keywords
      content: Zenmux, API, statistics, model usage, tokens, cost, management
---

# Get Model Usage

::: info Troubleshooting
Encountering errors? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting steps.
:::

```
GET https://zenmux.ai/api/v1/management/statistics/model_usage
```

Retrieve the token consumption or cost of a **specific model** over a time range, **returned as daily data**, together with an aggregate value for the entire range. Useful for single-model bill reconciliation, daily usage trend charts, and similar scenarios.

Returns platform-wide aggregated data available from **2025-09-29** onward.

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

### model `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

The model identifier (slug) to query, e.g. `anthropic/claude-sonnet-4-6`.

- Free variants (the `-free` suffix) are **merged into** their corresponding paid model. For example, querying `stepfun/step-3.7-flash` also includes usage from `stepfun/step-3.7-flash-free`.
- If the model has no usage within the specified range, `value` returns `0` and `series` returns an empty array.

### metric `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

Which metric to retrieve.

- `tokens` — total input + output token count
- `cost` — list-price cost in USD

### starting_at `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

Start date (inclusive), in `YYYY-MM-DD` format.

- No earlier than `2025-09-29` (platform data floor)

### ending_at `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

End date (inclusive), in `YYYY-MM-DD` format.

- No later than today

## Constraints

- Both `starting_at` and `ending_at` are **required**. Omitting either returns `400`.
- Data is aggregated and returned **per day**, and **a single request must not span more than 30 days**. Exceeding returns `400`.
- `starting_at` must not be later than `ending_at`; otherwise returns `400`.
- `starting_at` must not be earlier than `2025-09-29`, and `ending_at` must not be later than today; otherwise returns `400`.

## Returns

### data.model `string`

Echo of the requested model identifier (the original `model` parameter value).

### data.label `string`

Model display name (e.g. `Claude Sonnet 4.6`). Falls back to the slug itself if the slug is not found in the model catalog.

### data.metric `string`

Echo of the requested metric (`"tokens"` or `"cost"`).

### data.starting_at `string`

Echo of the start date (`YYYY-MM-DD`).

### data.ending_at `string`

Echo of the end date (`YYYY-MM-DD`).

### data.value `number`

The aggregate metric value for the model across the **entire range** (equal to the sum of each day's `value` in `series`):

- For `metric=tokens`, the total token count (integer).
- For `metric=cost`, the USD cost.

### data.series `array`

Array broken down by day (sorted in ascending date order). Each element contains:

- `date` `string` — date, in `YYYY-MM-DD` format
- `value` `number` — token count or USD cost for that day. Days with no data do not appear in the series.

::: api-request GET /api/v1/management/statistics/model_usage

```cURL
curl -G https://zenmux.ai/api/v1/management/statistics/model_usage \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  -d model=anthropic/claude-sonnet-4-6 \
  -d metric=tokens \
  -d starting_at=2026-04-10 \
  -d ending_at=2026-04-13
```

```python
import requests

response = requests.get(
    "https://zenmux.ai/api/v1/management/statistics/model_usage",
    headers={"Authorization": f"Bearer {ZENMUX_MANAGEMENT_API_KEY}"},
    params={
        "model": "anthropic/claude-sonnet-4-6",
        "metric": "tokens",
        "starting_at": "2026-04-10",
        "ending_at": "2026-04-13",
    },
)
print(response.json())
```

```javascript
const params = new URLSearchParams({
  model: "anthropic/claude-sonnet-4-6",
  metric: "tokens",
  starting_at: "2026-04-10",
  ending_at: "2026-04-13",
});

const response = await fetch(
  `https://zenmux.ai/api/v1/management/statistics/model_usage?${params}`,
  { headers: { Authorization: `Bearer ${ZENMUX_MANAGEMENT_API_KEY}` } },
);
const data = await response.json();
```

:::

::: api-response

```json
{
  "success": true,
  "data": {
    "model": "anthropic/claude-sonnet-4-6",
    "label": "Claude Sonnet 4.6",
    "metric": "tokens",
    "starting_at": "2026-04-10",
    "ending_at": "2026-04-13",
    "value": 89234567890,
    "series": [
      {
        "date": "2026-04-10",
        "value": 21345678901
      },
      {
        "date": "2026-04-11",
        "value": 23456789012
      },
      {
        "date": "2026-04-12",
        "value": 19876543210
      },
      {
        "date": "2026-04-13",
        "value": 24555556767
      }
    ]
  }
}
```

:::

::: info Querying cost
Set `metric` to `cost` to retrieve the USD cost for the same model over the same range. The response structure is identical; in this case `value` and `series[].value` represent cost amounts.
:::
