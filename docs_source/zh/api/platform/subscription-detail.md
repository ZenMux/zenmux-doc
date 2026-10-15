---
pageClass: api-page
title: 获取订阅详情
head:
  - - meta
    - name: description
      content: 获取订阅详情
  - - meta
    - name: keywords
      content: Zenmux, API, subscription, quota, 订阅, 用量, management
---

# Get Subscription Detail

::: info 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```http
GET https://zenmux.ai/api/v1/management/subscription/detail
```

获取当前账号的订阅详情，包括套餐信息、Flow 汇率、账号状态及各时间窗口的用量配额。

## 鉴权

### Authorization Header <span style="color: #FA6062; font-weight: 400">\*</span>

```http
Authorization: Bearer <ZENMUX_MANAGEMENT_API_KEY>
```

- **参数名**：`Authorization`
- **格式**：`Bearer <API_KEY>`
- **说明**：Management API Key，在 [ZenMux 控制台](https://zenmux.ai/platform/management) 创建

::: warning 仅支持 Management API Key
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

| 值          | 说明                           |
| ----------- | ------------------------------ |
| `healthy`   | 正常                           |
| `monitored` | 监控中，用量异常但仍可正常使用 |
| `abusive`   | 滥用，已触发限制               |
| `suspended` | 已暂停                         |
| `banned`    | 已封禁                         |

### data.quota_5_hour `object`

5 小时滚动窗口配额（高频保护机制）：

- `usage_percentage` `number` — 当前周期已用百分比（0–1），精确到 4 位小数
- `resets_at` `string | null` — 当前窗口自然重置时间（ISO 8601）；窗口未开始时为 `null`
- `remaining_resets` `integer` — 本订阅周期内剩余的 5 小时窗口提前重置次数，手动和自动触发共用；始终返回非负整数，无有效订阅、套餐无此权益或次数用尽时为 `0`
- `max_flows` `number` — 窗口内最大可用 Flow 数
- `used_flows` `number` — 已使用 Flow 数
- `remaining_flows` `number` — 剩余可用 Flow 数
- `used_value_usd` `number` — 已使用对应的美元价值
- `max_value_usd` `number` — 窗口总额度对应的美元价值

### data.quota_7_day `object`

7 天滚动窗口配额，包含与 `quota_5_hour` 相同的 Flow 用量、价值和自然重置时间字段，不包含 `remaining_resets`。

### data.quota_monthly `object`

当月订阅周期总配额（仅含上限，无实时用量）：

- `max_flows` `number` — 当月最大可用 Flow 数
- `max_value_usd` `number` — 当月总额度对应的美元价值

### 提前重置次数

`remaining_resets` 使用与官网订阅管理页相同的实际权益来源。它统计整个订阅周期内的剩余机会，不表示当前 5 小时窗口的剩余 Flow，也不表示自然重置的倒计时。

- 手动或自动重置成功并完成记账后，后续查询反映次数扣减；仅切换自动重置开关不会扣次数。
- 5 小时窗口自然滚动重置不消耗提前重置机会。有效订阅尚未开始窗口时，`resets_at` 可以为 `null`，但剩余次数仍可大于 `0`。
- 新订阅周期生效后按当前权益重新计算，未使用次数不累计。套餐变更按当前生效套餐、周期和实际消费记录计算；预约下周期的变更在生效前不影响当前权益。
- 取消续费但权益尚未到期时，仍返回当前周期剩余次数。无订阅、免费套餐或权益已失效时固定返回 `0`，不返回 `null` 或省略字段。
- 剩余次数大于 `0` 不保证当前可以重置；其他窗口额度和账号限制仍然生效。权益查询失败时返回错误，不用 `0` 代替失败。

::: info 配额说明

- `quota_5_hour` 和 `quota_7_day` 均为**滚动窗口**，每次请求后实时更新
- `quota_monthly` 为固定的订阅周期上限，不含实时用量数据
- 三个维度同时生效，任一维度超限均会限制请求
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
