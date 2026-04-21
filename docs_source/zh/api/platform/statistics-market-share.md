---
pageClass: api-page
title: 接口
head:
  - - meta
    - name: description
      content: 获取统计市场份额
  - - meta
    - name: keywords
      content: Zenmux, API, statistics, 统计, 市场份额, market share, tokens, cost, management
---

# Get Statistics Market Share

::: tip 💡 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```
GET https://zenmux.ai/api/v1/management/statistics/market_share
```

获取供应商市场份额的时间序列数据。接口返回每个时间桶内各供应商的绝对值，百分比由客户端自行计算。

可用于构建 100% 堆叠面积图、追踪供应商占比变化，或分析平台内的竞争格局。

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

计算市场份额所使用的指标。

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

每个时间桶内返回的 Top N 供应商数。

- 默认：`10`
- 最大：`50`
- Top N 之外的供应商聚合为 `__others__`

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
- `authors` `array` — 按供应商拆分：
  - `author` `string` — 供应商标识（如 `anthropic`）。Top N 之外的为 `__others__`。
  - `label` `string` — 供应商展示名称（如 "Anthropic"）
  - `value` `number` — 该桶内的 Token 绝对数或 USD 绝对成本（非百分比）

::: tip 💡 计算百分比
接口返回绝对值。要计算市场份额百分比，将每个供应商的值除以该桶的总值：

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
