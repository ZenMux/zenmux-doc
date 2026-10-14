---
pageClass: api-page
title: Interface
head:
  - - meta
    - name: description
      content: Get Subscription Detail
  - - meta
    - name: keywords
      content: Zenmux, API, subscription, quota, management
---

# Get Subscription Detail

::: info Troubleshooting
Encountering errors? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting steps.
:::

```http
GET https://zenmux.ai/api/v1/management/subscription/detail
```

Returns the current account's subscription details, including plan information, Flow rates, account status, and quota usage across all time windows.

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

## Returns

### data.plan `object`

Current subscription plan details:

- `tier` `string` — Plan tier: `"free"` / `"pro"` / `"max"` / `"ultra"`
- `amount_usd` `number` — Monthly plan price (USD)
- `interval` `string` — Billing cycle, always `"month"`
- `expires_at` `string` — Current subscription period expiry time (ISO 8601)

### data.currency `string`

Currency unit. Always `"usd"`.

### data.base_usd_per_flow `number`

The platform base rate for the current plan (USD per Flow).

### data.effective_usd_per_flow `number`

The account's actual effective rate (USD per Flow). Normally equals the base rate; may be higher when usage anomalies are detected.

### data.account_status `string`

The account's current status:

| Value       | Description                                       |
| ----------- | ------------------------------------------------- |
| `healthy`   | Normal                                            |
| `monitored` | Usage anomaly detected; service remains available |
| `abusive`   | Abusive usage detected; restrictions applied      |
| `suspended` | Account suspended                                 |
| `banned`    | Account banned                                    |

### data.quota_5_hour `object`

5-hour rolling window quota (high-frequency protection):

- `usage_percentage` `number` — Fraction of the window consumed (0–1), to 4 decimal places
- `resets_at` `string | null` — Natural window reset time (ISO 8601); `null` if the window has not yet started
- `remaining_resets` `integer` — Early 5-hour window resets remaining in the current subscription cycle, shared by manual and automatic resets. Always a nonnegative integer; `0` when there is no valid subscription, the plan has no reset entitlement, or all attempts have been used
- `max_flows` `number` — Maximum Flows available in this window
- `used_flows` `number` — Flows consumed so far
- `remaining_flows` `number` — Flows remaining
- `used_value_usd` `number` — USD value of consumed Flows
- `max_value_usd` `number` — USD value of the total window quota

### data.quota_7_day `object`

7-day rolling window quota. It shares the Flow usage, value, and natural reset time fields with `quota_5_hour`, but does not include `remaining_resets`.

### data.quota_monthly `object`

Monthly subscription cycle quota (upper limits only; no real-time usage data):

- `max_flows` `number` — Maximum Flows available in the current billing cycle
- `max_value_usd` `number` — USD value of the total monthly quota

### Early Reset Attempts

`remaining_resets` uses the same entitlement source as the subscription management page. It counts attempts remaining across the subscription cycle, rather than Flows remaining in the current 5-hour window or time until its natural reset.

- After a successful manual or automatic reset has been recorded, subsequent queries reflect the consumed attempt. Toggling automatic resets alone does not consume an attempt.
- A natural 5-hour window reset does not consume an early reset attempt. A valid subscription may have remaining attempts even when its window has not started and `resets_at` is `null`.
- When a new subscription cycle takes effect, attempts are recalculated from the current entitlement; unused attempts do not carry over. Plan changes use the effective plan, cycle, and recorded consumption. A scheduled plan change does not affect the current entitlement before it takes effect.
- Canceling renewal preserves remaining attempts until the current entitlement expires. Missing, free, or expired subscriptions return `0`, rather than `null` or an omitted field.
- A positive count does not guarantee that a reset can currently be performed; other window quotas and account restrictions still apply. Entitlement query failures return an error rather than a fallback count of `0`.

::: info Quota behavior

- `quota_5_hour` and `quota_7_day` are **rolling windows** that update in real time after each request.
- `quota_monthly` is a fixed cap for the current billing cycle and does not include real-time usage.
- All three windows are enforced simultaneously — hitting any one of them will rate-limit further requests.
:::

::: api-request GET /api/v1/management/subscription/detail

```cURL
curl https://zenmux.ai/api/v1/management/subscription/detail \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY"
```
:::

::: api-response

```json
{
  "success": true,
  "data": {
    "plan": {
      "tier": "ultra",
      "amount_usd": 200,
      "interval": "month",
      "expires_at": "2026-04-12T08:26:56.000Z"
    },
    "currency": "usd",
    "base_usd_per_flow": 0.03283,
    "effective_usd_per_flow": 0.03283,
    "account_status": "healthy",
    "quota_5_hour": {
      "usage_percentage": 0.0715,
      "resets_at": "2026-03-24T08:35:09.000Z",
      "remaining_resets": 1,
      "max_flows": 800,
      "used_flows": 57.2,
      "remaining_flows": 742.8,
      "used_value_usd": 1.88,
      "max_value_usd": 26.27
    },
    "quota_7_day": {
      "usage_percentage": 0.0673,
      "resets_at": "2026-03-26T02:15:05.000Z",
      "max_flows": 6182,
      "used_flows": 416.11,
      "remaining_flows": 5765.89,
      "used_value_usd": 13.66,
      "max_value_usd": 202.99
    },
    "quota_monthly": {
      "max_flows": 34560,
      "max_value_usd": 1134.33
    }
  }
}
```

:::
