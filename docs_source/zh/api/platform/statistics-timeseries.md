---
pageClass: api-page
title: 接口
head:
  - - meta
    - name: description
      content: 获取统计时间序列
  - - meta
    - name: keywords
      content: Zenmux, API, statistics, 统计, 时间序列, tokens, cost, management
---

# Get Statistics Timeseries

::: tip 💡 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```
GET https://zenmux.ai/api/v1/management/statistics/timeseries
```

获取按模型维度拆分的 Token 消耗量或成本时间序列数据。返回平台范围内从 **2025-09-29** 起的聚合数据。

可用于构建堆叠柱状图、追踪消费趋势，或将历史数据导出为 CSV。

::: info ℹ️ 数据时效性
统计数据按天聚合。最新可用数据为**昨日（T-1）**，当天的用量将在次日聚合后可见。
:::

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

## 参数

### metric `string` <font color="red">必选</font>

要获取的指标类型。

- `tokens` — 输入 + 输出 Token 总数
- `cost` — 按标价计算的 USD 成本

### bucket_width `string` <font color="red">必选</font>

时间桶粒度。

- `1d` — 按天
- `1w` — 按 ISO 周（以周一对齐）

### starting_at `string`

起始日期（含），格式为 `YYYY-MM-DD`。

- 默认：`ending_at` 前 28 个桶
- 最早不超过 `2025-09-29`（平台数据起始日）

### ending_at `string`

结束日期（含），格式为 `YYYY-MM-DD`。

- 默认：当天

### limit `integer`

每个时间桶内返回的 Top N 模型数。

- 默认：`10`
- 最大：`50`
- Top N 之外的模型聚合为 `__others__`

## 约束

- 日期范围不得超过 **60 个桶**，超出返回 `400`。
- 当 `bucket_width=1w` 时，日期会**对齐到 ISO 周边界**（周一）。响应中的日期反映对齐后的实际范围，确保返回完整的周数据。

## 返回值

### data.metric `string`

请求指标的回显（`"tokens"` 或 `"cost"`）。

### data.bucket_width `string`

请求桶粒度的回显（`"1d"` 或 `"1w"`）。

### data.starting_at `string`

实际起始日期（`YYYY-MM-DD`）。使用周粒度时可能与请求值不同。

### data.ending_at `string`

实际结束日期（`YYYY-MM-DD`）。

### data.total_buckets `integer`

响应中包含的时间桶总数。

### data.series `array`

时间桶数组，每个桶包含：

- `period` `string` — 原始周期标识：按天为 `YYYYMMDD`，按周为 `YYYYWW`
- `date` `string` — `YYYY-MM-DD` 日期。按周粒度时为该 ISO 周的周一。
- `models` `array` — 按模型拆分：
  - `model` `string` — 模型标识（如 `anthropic/claude-sonnet-4-6`）。Top N 之外的为 `__others__`。
  - `label` `string` — 展示名称（如 "Claude Sonnet 4.6"）
  - `value` `number` — 该桶内的 Token 数或 USD 成本

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

::: tip 💡 ISO 周对齐
上例中，响应的 `starting_at` 为 `2026-02-23`（周一），而非请求的 `2026-03-01`，这是因为 `bucket_width=1w` 会自动对齐到 ISO 周边界。
:::
