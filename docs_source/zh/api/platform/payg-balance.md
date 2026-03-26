---
pageClass: api-page
title: 接口
head:
  - - meta
    - name: description
      content: 获取 PAYG 余额
  - - meta
    - name: keywords
      content: Zenmux, API, payg, balance, credits, 余额, management
---

# Get PAYG Balance

```
GET https://zenmux.ai/api/v1/management/payg/balance
```

获取当前账号的 Pay As You Go 余额信息，包括总余额及各来源的 credit 明细。

## 鉴权

### Authorization Header <font color="red">必选</font>

```http
Authorization: Bearer <ZENMUX_MANAGEMENT_API_KEY>
```

- **参数名**：`Authorization`
- **格式**：`Bearer <API_KEY>`
- **说明**：Management API Key，在 [ZenMux 控制台](https://zenmux.ai/platform/management) 创建

::: warning ⚠️ 仅支持 Management API Key
本接口仅接受 Management API Key 鉴权，不支持普通 API Key。
:::

## 限流

每个接口独立计数，每分钟最大请求数由平台统一配置。超出限制时返回 `422` 错误。

## 返回值

### data.currency `string`

货币单位，固定为 `"usd"`。

### data.total_credits `number`

账号当前 PAYG 总余额（美元）。

### data.top_up_credits `number`

通过充值获得的余额（美元）。

### data.bonus_credits `number`

通过奖励、赠送等方式获得的余额（美元）。

::: info 💡 余额来源
`total_credits` = `top_up_credits` + `bonus_credits`（可能因浮点精度存在极小误差）。
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

::: api-response

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

:::
