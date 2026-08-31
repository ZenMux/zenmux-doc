---
pageClass: api-page
title: 获取应用趋势
head:
  - - meta
    - name: description
      content: 获取 App / Agent 增长榜
  - - meta
    - name: keywords
      content: Zenmux, API, statistics, 统计, App, Agent, 应用, 增长榜, trending, tokens, cost, management
---

# Get App Trending

::: info 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```http
GET https://zenmux.ai/api/v1/management/statistics/apps/trending
```

按「增长 × 量级」综合分对 **App / Agent**（如 Claude Code、Codex、LiteLLM 等接入 ZenMux 的客户端与网关）排名，返回上升势头最强的 Top 10。每个条目附当前窗口用量、增长率，以及用于绘制 sparkline 的逐日明细序列。

数据与 ZenMux 站内 [Analytics → App](https://zenmux.ai/analytics/apps) 页面的「Trending App Agent」模块完全一致，可用于发现正在爆量的 Agent 生态、构建自己的增长榜。

::: info App / Agent 是如何识别的
ZenMux 通过请求特征（OAuth 客户端标识、User-Agent 等）识别调用来源的 App / Agent，并归一到统一的应用目录。无法识别的来源不计入榜单。
:::

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

用于排名与计算增长率的指标。

- `tokens` — 输入 + 输出 Token 总数
- `cost` — 按标价计算的 USD 成本

### bucket_width `string` <span style="color: #FA6062; font-weight: 400">\*</span>

统计窗口与对比窗口。

- `1d` — 锚点当天单日，对比前一天；明细序列为锚点往前 7 天
- `1w` — 锚点往前 7 天求和，对比再往前 7 天；明细序列为锚点往前 14 天

### ending_at `string`

锚点业务日（含），格式 `YYYY-MM-DD`（UTC）。

- 默认：昨日（T-1，UTC）
- 不得晚于昨日（T-1，UTC）；数据按天聚合，当日数据需次日才可用
- 不得早于数据起始日 `2025-09-29`

### limit `integer`

返回条目数上限，取值 `1` ~ `10`。

- 默认：返回全部（榜单固定取 Top 10）
- 超过实际条目数等同于不传；`<= 0` 或非法值被忽略，不会报错

## 约束

- 榜单固定为 Top 10，不支持翻页；需要完整排名请使用 [Get App Leaderboard](/zh/api/platform/statistics-app-leaderboard)。
- 明细窗口由 `bucket_width` 固定（`1d` → 7 天，`1w` → 14 天），不可自定义。
- 当前窗口用量低于**动态门槛**（当日全体 App 用量的分位数）的 App 不入榜，用于过滤长尾小基数噪声。

## 返回值

### data.metric `string`

请求指标的回显（`"tokens"` 或 `"cost"`）。

### data.bucket_width `string`

请求窗口粒度的回显（`"1d"` 或 `"1w"`）。

### data.ending_at `string`

实际生效的锚点日期（`YYYY-MM-DD`）。不传 `ending_at` 时即为昨日（T-1，UTC），据此可确认拿到的是哪一天的数据。

### data.entries `array`

按综合分（增长 × 量级）降序排列的 App / Agent 数组。每个条目包含：

- `rank` `integer` — 从 1 开始的排名
- `app` `string` — App / Agent 标识（如 `claude-code`、`codex`、`litellm`）
- `label` `string` — 展示名称（英文）
- `description` `string` — 简介（英文，可能为空字符串）
- `icon_url` `string` — 图标 URL（未配置时为空字符串）
- `zenmux_url` `string` — ZenMux 接入指南链接（未配置时为空字符串）
- `official_url` `string` — 官方站点链接（未配置时为空字符串）
- `value` `number` — 当前窗口用量（`1d`：锚点当天；`1w`：锚点往前 7 天求和）
- `growth_rate` `number` — 环比增长率，**百分比数值**，保留 2 位小数（`95.6` 表示 +95.6%）。经加性平滑处理，且首次上量的新 App 会用**动态基线**代替真实上期值，因此与 `(当前 - 上期) / 上期` **不严格相等**，也无法据此反推上期用量
- `growth_label` `string` — 预格式化的百分比标签（如 `"+95.60%"`），与 `growth_rate` 同源，始终非空
- `data_points` `array` — 逐日明细序列（升序，无数据的日期补 0）：
  - `period` `string` — 业务日 `YYYYMMDD`
  - `value` `number` — 当日指标值

::: api-request GET /api/v1/management/statistics/apps/trending

```cURL
curl -G https://zenmux.ai/api/v1/management/statistics/apps/trending \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  -d metric=tokens \
  -d bucket_width=1d \
  -d ending_at=2026-08-23 \
  -d limit=10
```
:::

::: api-response

```json
{
  "success": true,
  "data": {
    "metric": "tokens",
    "bucket_width": "1d",
    "ending_at": "2026-08-23",
    "entries": [
      {
        "rank": 1,
        "app": "litellm",
        "label": "LiteLLM",
        "description": "Unified LLM gateway and proxy",
        "icon_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/08/17/GgJ5jo3/NameLiteLLM.svg",
        "zenmux_url": "",
        "official_url": "",
        "value": 1802240416,
        "growth_rate": 128.44,
        "growth_label": "+128.44%",
        "data_points": [
          { "period": "20260817", "value": 402118773 },
          { "period": "20260818", "value": 511903244 },
          { "period": "20260819", "value": 623440190 },
          { "period": "20260820", "value": 700118231 },
          { "period": "20260821", "value": 742330119 },
          { "period": "20260822", "value": 788771905 },
          { "period": "20260823", "value": 1802240416 }
        ]
      },
      {
        "rank": 2,
        "app": "codex",
        "label": "Codex",
        "description": "OpenAI Codex CLI",
        "icon_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/3e4UfxM/Property-1codex.svg",
        "zenmux_url": "https://zenmux.ai/docs/best-practices/codex.html",
        "official_url": "",
        "value": 1620342892,
        "growth_rate": 95.6,
        "growth_label": "+95.60%",
        "data_points": [
          { "period": "20260817", "value": 690118773 },
          { "period": "20260818", "value": 714903244 },
          { "period": "20260819", "value": 760440190 },
          { "period": "20260820", "value": 791118231 },
          { "period": "20260821", "value": 812330119 },
          { "period": "20260822", "value": 828229905 },
          { "period": "20260823", "value": 1620342892 }
        ]
      }
    ]
  }
}
```

:::
