---
pageClass: api-page
title: 接口
head:
  - - meta
    - name: description
      content: 获取统计排行榜
  - - meta
    - name: keywords
      content: Zenmux, API, statistics, 统计, 排行榜, leaderboard, tokens, cost, management
---

# Get Statistics Leaderboard

::: tip 💡 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```
GET https://zenmux.ai/api/v1/management/statistics/leaderboard
```

按 Token 消耗量或成本对模型进行排名。返回 Top N 模型及一条聚合的 "Others" 条目。

可用于了解平台流量最大的模型、对比各供应商的消费情况，或构建排行榜可视化。

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

排名依据的指标类型。

- `tokens` — 输入 + 输出 Token 总数
- `cost` — 按标价计算的 USD 成本

### starting_at `string`

起始日期（含），格式为 `YYYY-MM-DD`。

- 默认：`2025-09-29`（平台数据起始日，等同于全量排名）

### ending_at `string`

结束日期（含），格式为 `YYYY-MM-DD`。

- 默认：当天

### limit `integer`

返回的 Top N 模型数。

- 默认：`10`
- 最大：`50`
- Top N 之外的模型聚合为一条 `__others__` 条目

## 返回值

### data.metric `string`

请求指标的回显（`"tokens"` 或 `"cost"`）。

### data.starting_at `string`

实际起始日期（`YYYY-MM-DD`）。

### data.ending_at `string`

实际结束日期（`YYYY-MM-DD`）。

### data.entries `array`

排名列表，每条记录包含：

- `rank` `number` — 从 1 开始的排名。`__others__` 的排名为 `limit + 1`。
- `model` `string` — 模型标识（如 `anthropic/claude-opus-4-6`）。聚合条目为 `__others__`。
- `label` `string` — 展示名称（如 "Claude Opus 4.6"）
- `author` `string` — 供应商标识（如 `anthropic`、`openai`）。`__others__` 为空。
- `author_label` `string` — 供应商展示名称（如 "Anthropic"）。`__others__` 为空。
- `value` `number` — 日期范围内的 Token 总数或 USD 总成本

::: api-request GET /api/v1/management/statistics/leaderboard

```cURL
curl -G https://zenmux.ai/api/v1/management/statistics/leaderboard \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  -d metric=cost \
  -d starting_at=2026-04-01 \
  -d ending_at=2026-04-15 \
  -d limit=5
```

```python
import requests

response = requests.get(
    "https://zenmux.ai/api/v1/management/statistics/leaderboard",
    headers={"Authorization": f"Bearer {ZENMUX_MANAGEMENT_API_KEY}"},
    params={
        "metric": "cost",
        "starting_at": "2026-04-01",
        "ending_at": "2026-04-15",
        "limit": 5,
    },
)
print(response.json())
```

```javascript
const params = new URLSearchParams({
  metric: "cost",
  starting_at: "2026-04-01",
  ending_at: "2026-04-15",
  limit: "5",
});

const response = await fetch(
  `https://zenmux.ai/api/v1/management/statistics/leaderboard?${params}`,
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
    "metric": "cost",
    "starting_at": "2026-04-01",
    "ending_at": "2026-04-15",
    "entries": [
      {
        "rank": 1,
        "model": "anthropic/claude-opus-4-6",
        "label": "Claude Opus 4.6",
        "author": "anthropic",
        "author_label": "Anthropic",
        "value": 15234.56
      },
      {
        "rank": 2,
        "model": "openai/gpt-4.1",
        "label": "GPT-4.1",
        "author": "openai",
        "author_label": "OpenAI",
        "value": 12890.12
      },
      {
        "rank": 3,
        "model": "anthropic/claude-sonnet-4-6",
        "label": "Claude Sonnet 4.6",
        "author": "anthropic",
        "author_label": "Anthropic",
        "value": 9876.54
      },
      {
        "rank": 4,
        "model": "google/gemini-2.5-pro",
        "label": "Gemini 2.5 Pro",
        "author": "google",
        "author_label": "Google",
        "value": 7654.32
      },
      {
        "rank": 5,
        "model": "deepseek/deepseek-r1",
        "label": "DeepSeek R1",
        "author": "deepseek",
        "author_label": "DeepSeek",
        "value": 5432.10
      },
      {
        "rank": 6,
        "model": "__others__",
        "label": "Others",
        "author": "",
        "author_label": "",
        "value": 3456.78
      }
    ]
  }
}
```

:::

::: tip 💡 全量排名
省略 `starting_at` 参数，默认从 `2025-09-29`（平台上线日）开始，即可获取全量排名数据。
:::
