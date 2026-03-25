---
pageClass: api-page
title: Interface
head:
  - - meta
    - name: description
      content: Get PAYG Balance
  - - meta
    - name: keywords
      content: Zenmux, API, payg, balance, credits, management
---

# Get PAYG Balance

```
GET https://zenmux.ai/api/v1/management/payg/balance
```

Returns the Pay As You Go credit balance for the current account, including the total balance and a breakdown by credit source.

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

### data.total_credits `number`

The account's current total PAYG credit balance (USD).

### data.top_up_credits `number`

Credits obtained through direct top-ups (USD).

### data.bonus_credits `number`

Credits obtained through bonuses, gifts, or promotions (USD).

::: info 💡 Balance breakdown
`total_credits` = `top_up_credits` + `bonus_credits` (minor floating-point differences may apply).
:::

::: api-request GET /api/v1/management/payg/balance

```cURL
curl https://zenmux.ai/api/v1/management/payg/balance \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY"
```

```python
import requests

response = requests.get(
    "https://zenmux.ai/api/v1/management/payg/balance",
    headers={"Authorization": f"Bearer {ZENMUX_MANAGEMENT_API_KEY}"}
)
print(response.json())
```

```javascript
const response = await fetch("https://zenmux.ai/api/v1/management/payg/balance", {
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
    "total_credits": 482.74,
    "top_up_credits": 35.00,
    "bonus_credits": 447.74
  }
}
```
