---
pageClass: api-page
title: 接口
head:
  - - meta
    - name: description
      content: 获取统计增长榜
  - - meta
    - name: keywords
      content: Zenmux, API, statistics, 统计, 增长榜, trending, 增长率, tokens, cost, management
---

# Get Statistics Trending

::: info 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```http
GET https://zenmux.ai/api/v1/management/statistics/trending
```

按「增长 × 量级」综合分对模型排名，返回上升势头最强的 Top N 模型（含首次爆量的新模型）。每个模型附当前/对比窗口的数值、增长率，以及用于绘制 sparkline 的逐日明细序列。

可用于发现爆发式增长的模型、构建「Trending」增长榜，或追踪模型目录内的势头变化。

排序分：`score = log1p(today) × (today + α) / (yesterday_eff + α)`。其中 `today` 为当前窗口量、`yesterday_eff` 为对比窗口量（新模型用动态基线兜底），`α` 为加性平滑常数。增长信号与量级权重相乘，使「既在上升、量级又大」的模型靠前，并压制小基数噪声。

::: info 数据时效性
统计数据按天聚合。最新可用数据为**昨日（T-1）**，当天的用量将在次日聚合后可见。
:::

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

## 参数

### metric `string` <span style="color: #FA6062; font-weight: 400">\*</span>

用于计算增长率的指标。

- `tokens` — 输入 + 输出 Token 总数
- `cost` — 按标价计算的 USD 成本

### bucket_width `string` <span style="color: #FA6062; font-weight: 400">\*</span>

计算增长率的对比窗口。

- `1d` — `ending_at` 当天对比前一天；明细序列为近 7 天
- `1w` — 近 7 天对比前 7 天（均为求和）；明细序列为近 14 天

### ending_at `string`

锚点日期（含），即对比窗口的结束日，格式为 `YYYY-MM-DD`。

- 默认：昨日（T-1，UTC）
- 不得晚于昨日（T-1，UTC）；数据按天聚合，当日数据需次日才可用
- 不得早于数据起始日 `2025-09-29`

### limit `integer`

返回的 Top N 模型数。

- 默认：`10`
- 最大：`50`

## 约束

- 当前窗口量级低于动态门槛的模型不入榜，以过滤长尾小基数噪声。
- 无对比窗口基准的新模型会用动态基线兜底，使其凭借首日量级公平参与排名（不会因无基准被无脑顶到榜首，也不会被直接剔除）。
- 明细窗口由 `bucket_width` 固定（`1d` → 7 天，`1w` → 14 天），不可自定义。

## 返回值

### data.metric `string`

请求指标的回显（`"tokens"` 或 `"cost"`）。

### data.bucket_width `string`

请求桶粒度的回显（`"1d"` 或 `"1w"`）。

### data.ending_at `string`

锚点日期（`YYYY-MM-DD`）。

### data.entries `array`

按综合分（增长 × 量级）降序排列的模型数组。每个条目包含：

- `rank` `integer` — 从 1 开始的排名
- `model` `string` — 模型标识（如 `qwen/qwen3-coder`）
- `label` `string` — 模型展示名称
- `author` `string` — 作者/供应商标识（如 `qwen`）
- `author_label` `string` — 作者展示名称
- `icon_url` `string` — 模型图标 URL（缺失时回退到作者图标）
- `value` `number` — 当前窗口量（`1d`：锚点当天求和；`1w`：近 7 天求和）
- `total_value` `number` — 展示窗口的总量，与 `value` 相同。前端展示请使用此字段。
- `previous_value` `number` — 对比窗口的有效基线：老模型为真实对比窗口量（`1d`：前一天；`1w`：前 7 天）；新模型为动态兜底基线（非真实历史值）
- `growth_rate` `number` — 加性平滑后的环比增长率，保留 2 位小数。经平滑处理，与 `(value - previous_value) / previous_value` **不严格相等**，请勿据此反推
- `growth_label` `string` — 预格式化的百分比标签（如 `"+40615.61%"`）
- `data_points` `array` — 逐日明细序列（升序）：
  - `period` `string` — 业务日 `YYYYMMDD`
  - `value` `number` — 当日指标值

::: api-request GET /api/v1/management/statistics/trending

```cURL
curl -G https://zenmux.ai/api/v1/management/statistics/trending \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  -d metric=cost \
  -d bucket_width=1d \
  -d ending_at=2026-06-21 \
  -d limit=10
```
:::

::: api-response

```json
{
  "success": true,
  "data": {
    "metric": "cost",
    "bucket_width": "1d",
    "ending_at": "2026-06-21",
    "entries": [
      {
        "rank": 1,
        "model": "qwen/qwen3-coder",
        "label": "Qwen3-Coder",
        "author": "qwen",
        "author_label": "Qwen",
        "icon_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/04/01/qeMamJm/Property-1Qwen.svg",
        "value": 1.63367713,
        "total_value": 1.63367713,
        "previous_value": 0.00401241,
        "growth_rate": 406.16,
        "growth_label": "+40615.61%",
        "data_points": [
          { "period": "20260615", "value": 0.00005835 },
          { "period": "20260616", "value": 0.26396599 },
          { "period": "20260617", "value": 1.44900805 },
          { "period": "20260618", "value": 13.43269683 },
          { "period": "20260619", "value": 16.53876505 },
          { "period": "20260620", "value": 16.87021709 },
          { "period": "20260621", "value": 1.63367713 }
        ]
      }
    ]
  }
}
```

:::
