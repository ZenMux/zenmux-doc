---
pageClass: api-page
title: 接口
head:
  - - meta
    - name: description
      content: 获取 App / Agent 排行榜
  - - meta
    - name: keywords
      content: Zenmux, API, statistics, 统计, App, Agent, 应用, 排行榜, leaderboard, tokens, requests, cost, management
---

# Get App Leaderboard

::: info 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```http
GET https://zenmux.ai/api/v1/management/statistics/apps/leaderboard
```

按指定统计窗口内的用量对 **App / Agent**（如 Claude Code、Codex、LiteLLM 等接入 ZenMux 的客户端与网关）排名，返回 Top 10 及聚合后的「其他」。每个条目附窗口累计用量、与上一周期的涨跌幅，以及近 7 天的逐日明细序列。

数据与 ZenMux 站内 [Analytics → App](https://zenmux.ai/analytics/apps) 页面的 App 排行榜模块完全一致。与 [Get App Trending](/zh/api/platform/statistics-app-trending) 的区别：本接口按**绝对用量**排名，趋势榜按**增长势头**排名。

::: info 数据时效性
统计数据按天聚合。最新可用数据为**昨日（T-1，UTC）**，当天的用量将在次日聚合后可见。
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

用于排名的指标。

- `tokens` — 输入 + 输出 Token 总数
- `requests` — 归属于该 App / Agent 的请求总次数
- `cost` — 按标价计算的 USD 成本

### period `string`

统计窗口，均以 `ending_at`（缺省为昨日 T-1）为结束日。

- `1d` — 锚点当天单日，涨跌幅对比前一天（默认）
- `7d` — 锚点往前 7 天求和，涨跌幅对比再往前 7 天
- `30d` — 锚点往前 30 天求和，涨跌幅对比再往前 30 天
- `total` — 从数据起始日 `2025-09-29` 到锚点当天的累计，**不计算涨跌幅**（`growth_rate` 为 `0`，`growth_label` 为空字符串）

### ending_at `string`

锚点业务日（含），格式 `YYYY-MM-DD`（UTC）。

- 默认：昨日（T-1，UTC）
- 不得晚于昨日（T-1，UTC）；数据按天聚合，当日数据需次日才可用
- 不得早于数据起始日 `2025-09-29`

### limit `integer`

返回条目数上限，取值 `1` ~ `11`（Top 10 + 「其他」聚合行）。

- 默认：返回全部
- 超过实际条目数等同于不传；`<= 0` 或非法值被忽略，不会报错

## 约束

- 榜单固定为 Top 10；第 11 名及之后会被聚合成一条 `app = "__others__"`（`label = "Others"`）的兜底行，便于还原 100% 占比。当没有超出 Top 10 的 App 时，不会出现这一行。
- 涨跌幅与 `period` 对齐（近 7 天比前 7 天、近 30 天比前 30 天），不是固定的单日对比。
- `data_points` 固定为锚点往前 7 天，与 `period` 无关；`period=30d` 时它只是最后一周的走势，不覆盖整个统计窗口。
- 统计窗口内用量为 0 的 App 不入榜。

## 返回值

### data.metric `string`

请求指标的回显（`"tokens"`、`"requests"` 或 `"cost"`）。

### data.period `string`

请求统计窗口的回显（`"1d"`、`"7d"`、`"30d"` 或 `"total"`）。

### data.ending_at `string`

实际生效的锚点日期（`YYYY-MM-DD`）。不传 `ending_at` 时即为昨日（T-1，UTC），据此可确认拿到的是哪一天的数据。

### data.entries `array`

按窗口累计用量降序排列的 App / Agent 数组。每个条目包含：

- `rank` `integer` — 从 1 开始的排名
- `app` `string` — App / Agent 标识（如 `claude-code`）；聚合行为 `__others__`
- `label` `string` — 展示名称（英文）
- `description` `string` — 简介（英文，可能为空字符串）
- `icon_url` `string` — 图标 URL（未配置时为空字符串）
- `zenmux_url` `string` — ZenMux 接入指南链接（未配置时为空字符串）
- `official_url` `string` — 官方站点链接（未配置时为空字符串）
- `value` `number` — 统计窗口内的累计用量
- `growth_rate` `number` — 与上一周期相比的涨跌幅，**百分比数值**，保留 2 位小数（`-12.34` 表示 -12.34%）；上一周期用量为 0 或 `period=total` 时恒为 `0`
- `growth_label` `string` — 预格式化的百分比标签（如 `"+18.20%"`）；上一周期用量为 0 或 `period=total` 时为空字符串
- `data_points` `array` — 锚点往前 7 天的逐日明细序列（升序，无数据的日期补 0）：
  - `period` `string` — 业务日 `YYYYMMDD`
  - `value` `number` — 当日指标值

::: api-request GET /api/v1/management/statistics/apps/leaderboard

```cURL
curl -G https://zenmux.ai/api/v1/management/statistics/apps/leaderboard \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  -d metric=cost \
  -d period=7d \
  -d ending_at=2026-08-23
```
:::

::: api-response

```json
{
  "success": true,
  "data": {
    "metric": "cost",
    "period": "7d",
    "ending_at": "2026-08-23",
    "entries": [
      {
        "rank": 1,
        "app": "claude-code",
        "label": "Claude Code",
        "description": "Anthropic's official command-line coding assistant",
        "icon_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/08/17/GxmXP7H/NameClaudeCode.svg",
        "zenmux_url": "https://zenmux.ai/docs/best-practices/claude-code.html",
        "official_url": "https://www.anthropic.com/claude-code",
        "value": 23228.3162,
        "growth_rate": 18.2,
        "growth_label": "+18.20%",
        "data_points": [
          { "period": "20260817", "value": 3102.4412 },
          { "period": "20260818", "value": 3288.1043 },
          { "period": "20260819", "value": 3401.7729 },
          { "period": "20260820", "value": 3355.9018 },
          { "period": "20260821", "value": 3390.2277 },
          { "period": "20260822", "value": 3371.5375 },
          { "period": "20260823", "value": 3318.3308 }
        ]
      },
      {
        "rank": 11,
        "app": "__others__",
        "label": "Others",
        "description": "All remaining apps and agents",
        "icon_url": "",
        "zenmux_url": "",
        "official_url": "",
        "value": 1042.8837,
        "growth_rate": -4.51,
        "growth_label": "-4.51%",
        "data_points": [
          { "period": "20260817", "value": 155.2211 },
          { "period": "20260818", "value": 149.8032 },
          { "period": "20260819", "value": 151.4477 },
          { "period": "20260820", "value": 147.9902 },
          { "period": "20260821", "value": 149.1188 },
          { "period": "20260822", "value": 145.3319 },
          { "period": "20260823", "value": 143.9708 }
        ]
      }
    ]
  }
}
```

:::
