---
pageClass: api-page
title: Interface
head:
  - - meta
    - name: description
      content: Get Flow Rate
  - - meta
    - name: keywords
      content: Zenmux, API, flow rate, management
---

# Get Flow Rate

::: tip 💡 Troubleshooting
Encountering errors? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting steps.
:::

```
GET https://zenmux.ai/api/v1/management/flow_rate
```

Returns the Flow exchange rate for the current account, including the platform base rate and the account's effective rate.

::: tip 💡 What is a Flow?
A Flow is ZenMux's unified billing unit for measuring AI inference consumption. 1 Flow ≈ the cost of one standard request to a reference model. See [Pricing](https://zenmux.ai/pricing/subscription) for details.
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

## Returns

### data.currency `string`

Currency unit. Always `"usd"`.

### data.base_usd_per_flow `number`

The platform base rate for the current plan — the USD cost per 1 Flow with no account-level adjustments applied.

### data.effective_usd_per_flow `number`

The account's actual effective rate — the USD cost per 1 Flow for this account right now.

- Under normal conditions this equals `base_usd_per_flow`
- May be higher than the base rate if the account has flagged usage anomalies

::: api-request GET /api/v1/management/flow_rate

```cURL
curl https://zenmux.ai/api/v1/management/flow_rate \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY"
```

```python
import requests

response = requests.get(
    "https://zenmux.ai/api/v1/management/flow_rate",
    headers={"Authorization": f"Bearer {ZENMUX_MANAGEMENT_API_KEY}"}
)
print(response.json())
```

```javascript
const response = await fetch("https://zenmux.ai/api/v1/management/flow_rate", {
  headers: { Authorization: `Bearer ${ZENMUX_MANAGEMENT_API_KEY}` },
});
const data = await response.json();
```

:::

## Example Response

```json
{
  "success": true,
  "data": {
    "currency": "usd",
    "base_usd_per_flow": 0.03283,
    "effective_usd_per_flow": 0.03283
  }
}
```
