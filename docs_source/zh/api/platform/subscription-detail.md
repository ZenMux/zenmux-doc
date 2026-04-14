---
pageClass: api-page
title: 接口
head:
  - - meta
    - name: description
      content: 获取订阅详情
  - - meta
    - name: keywords
      content: Zenmux, API, subscription, quota, 订阅, 用量, management
---

# Get Subscription Detail

::: tip 💡 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```
GET https://zenmux.ai/api/v1/management/subscription/detail
```

获取当前账号的订阅详情，包括套餐信息、Flow 汇率、账号状态及各时间窗口的用量配额。

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

### data.plan `object`

当前套餐信息：

- `tier` `string` — 套餐等级，如 `"free"` / `"pro"` / `"max"` / `"ultra"`
- `amount_usd` `number` — 套餐月费（美元）
- `interval` `string` — 计费周期，固定为 `"month"`
- `expires_at` `string` — 当前订阅周期到期时间（ISO 8601）

### data.currency `string`

货币单位，固定为 `"usd"`。

### data.base_usd_per_flow `number`

当前套餐的平台基准汇率（美元/Flow）。

### data.effective_usd_per_flow `number`

账号实际有效汇率（美元/Flow）。正常情况下与基准汇率相同，存在异常时可能更高。

### data.account_status `string`

账号当前状态，枚举值：

| 值 | 说明 |
|---|---|
| `healthy` | 正常 |
| `monitored` | 监控中，用量异常但仍可正常使用 |
| `abusive` | 滥用，已触发限制 |
| `suspended` | 已暂停 |
| `banned` | 已封禁 |

### data.quota_5_hour `object`

5 小时滚动窗口配额（高频保护机制）：

- `usage_percentage` `number` — 当前周期已用百分比（0–1），精确到 4 位小数
- `resets_at` `string | null` — 当前窗口重置时间（ISO 8601）；窗口未开始时为 `null`
- `max_flows` `number` — 窗口内最大可用 Flow 数
- `used_flows` `number` — 已使用 Flow 数
- `remaining_flows` `number` — 剩余可用 Flow 数
- `used_value_usd` `number` — 已使用对应的美元价值
- `max_value_usd` `number` — 窗口总额度对应的美元价值

### data.quota_7_day `object`

7 天滚动窗口配额，字段结构与 `quota_5_hour` 相同。

### data.quota_monthly `object`

当月订阅周期总配额（仅含上限，无实时用量）：

- `max_flows` `number` — 当月最大可用 Flow 数
- `max_value_usd` `number` — 当月总额度对应的美元价值

::: info 💡 配额说明
- `quota_5_hour` 和 `quota_7_day` 均为**滚动窗口**，每次请求后实时更新
- `quota_monthly` 为固定的订阅周期上限，不含实时用量数据
- 三个维度同时生效，任一维度超限均会限制请求
:::

::: api-request GET /api/v1/management/subscription/detail

```cURL
curl https://zenmux.ai/api/v1/management/subscription/detail \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY"
```

```python
import requests

response = requests.get(
    "https://zenmux.ai/api/v1/management/subscription/detail",
    headers={"Authorization": f"Bearer {ZENMUX_MANAGEMENT_API_KEY}"}
)
print(response.json())
```

```javascript
const response = await fetch("https://zenmux.ai/api/v1/management/subscription/detail", {
  headers: { Authorization: `Bearer ${ZENMUX_MANAGEMENT_API_KEY}` },
});
const data = await response.json();
```

:::

## 响应示例

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
