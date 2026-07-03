---
pageClass: api-page
title: 接口
head:
  - - meta
    - name: description
      content: 查询单个模型在时间段内的按天用量
  - - meta
    - name: keywords
      content: Zenmux, API, statistics, 统计, 模型用量, tokens, cost, management
---

# Get Model Usage

::: info 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```
GET https://zenmux.ai/api/v1/management/statistics/model_usage
```

查询**指定模型**在某个时间段内的 Token 消耗量或成本，**按天返回每日数据**，同时给出整个区间的汇总值。适合做单模型账单核对、每日用量趋势图等场景。

返回平台范围内从 **2025-09-29** 起的聚合数据。

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

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

要查询的模型标识（slug），如 `anthropic/claude-opus-4.8`。

- 免费变体（`-free` 后缀）会与对应的付费模型**合并统计**。例如查询 `stepfun/step-3.7-flash` 会同时包含 `stepfun/step-3.7-flash-free` 的用量。
- 若该模型在指定区间内无任何用量，`value` 返回 `0`，`series` 返回空数组。

### metric `string` <span style="color: #FA6062; font-weight: 400">\*</span>

要获取的指标类型。

- `tokens` — 输入 + 输出 Token 总数
- `cost` — 按标价计算的 USD 成本

### starting_at `string` <span style="color: #FA6062; font-weight: 400">\*</span>

起始日期（含），格式为 `YYYY-MM-DD`。

- 最早不超过 `2025-09-29`（平台数据起始日）

### ending_at `string` <span style="color: #FA6062; font-weight: 400">\*</span>

结束日期（含），格式为 `YYYY-MM-DD`。

- 不得晚于当天

## 约束

- `starting_at` 与 `ending_at` 均为**必传**，缺失任一返回 `400`。
- 数据**按天**聚合返回，**单次请求时间跨度不得超过 30 天**，超出返回 `400`。
- `starting_at` 必须不晚于 `ending_at`，否则返回 `400`。
- `starting_at` 不得早于 `2025-09-29`，`ending_at` 不得晚于当天，否则返回 `400`。

## 返回值

### data.model `string`

请求模型标识的回显（`model` 参数原值）。

### data.label `string`

模型展示名称（如 `Claude Opus 4.8`）。若模型库中无该 slug，则回退为 slug 本身。

### data.metric `string`

请求指标的回显（`"tokens"` 或 `"cost"`）。

### data.starting_at `string`

起始日期的回显（`YYYY-MM-DD`）。

### data.ending_at `string`

结束日期的回显（`YYYY-MM-DD`）。

### data.value `number`

该模型在**整个区间**内的指标汇总值（等于 `series` 中各天 `value` 之和）：

- `metric=tokens` 时为 Token 总数（整数）。
- `metric=cost` 时为 USD 成本。

### data.series `array`

按天拆分的数组（按日期升序），每个元素包含：

- `date` `string` — 日期，格式 `YYYY-MM-DD`
- `value` `number` — 当天的 Token 数或 USD 成本。无数据的日期不会出现在序列中。

::: api-request GET /api/v1/management/statistics/model_usage

```bash [cURL]curl -G https://zenmux.ai/api/v1/management/statistics/model_usage \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  -d model=anthropic/claude-opus-4.8 \
  -d metric=tokens \
  -d starting_at=2026-06-13 \
  -d ending_at=2026-06-16
```
:::

::: api-response

```json
{
  "success": true,
  "data": {
    "model": "anthropic/claude-opus-4.8",
    "label": "Claude Opus 4.8",
    "metric": "tokens",
    "starting_at": "2026-06-13",
    "ending_at": "2026-06-16",
    "value": 39861207125,
    "series": [
      {
        "date": "2026-06-13",
        "value": 7761156540
      },
      {
        "date": "2026-06-14",
        "value": 6342332731
      },
      {
        "date": "2026-06-15",
        "value": 13925770233
      },
      {
        "date": "2026-06-16",
        "value": 11831947621
      }
    ]
  }
}
```

:::

::: info 查询成本
将 `metric` 改为 `cost` 即可查询同一模型同一区间的 USD 成本，响应结构相同，`value` 与 `series[].value` 此时为成本金额。
:::
