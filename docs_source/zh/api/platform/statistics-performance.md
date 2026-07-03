---
pageClass: api-page
title: 接口
head:
  - - meta
    - name: description
      content: 获取统计性能榜
  - - meta
    - name: keywords
      content: Zenmux, API, statistics, 统计, 性能榜, performance, 吞吐, 延迟, 缓存命中率, management
---

# Get Statistics Performance

::: info 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```http
GET https://zenmux.ai/api/v1/management/statistics/performance
```

按性能指标对模型排名，返回区间内 Top 10 模型。支持吞吐量、首 Token 延迟、缓存命中率三类指标。每个模型按供应商拆分，便于在同一模型下对比不同供应商。

可用于构建性能排行榜、为某个模型挑选最快的供应商，或监控缓存效率。

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

用于排名的性能指标。

- `throughput` — 输出吞吐量中位数（token/秒），降序排列
- `ttft` — 首 Token 延迟中位数（毫秒），升序排列
- `cache_hit` — 缓存命中率，降序排列

### starting_at `string` <span style="color: #FA6062; font-weight: 400">\*</span>

起始日期（含），格式为 `YYYY-MM-DD`。最早不超过 `2025-09-29`（平台数据起始日）。

### ending_at `string` <span style="color: #FA6062; font-weight: 400">\*</span>

结束日期（含），格式为 `YYYY-MM-DD`。不得晚于当天。

## 约束

- 日期范围不得超过 **30 天**，超出返回 `400`。
- `starting_at` 不得晚于 `ending_at`。
- `throughput` / `ttft` 会剔除无有效样本的日（中位数为 `0`，如 embedding/TTS/视频类模型），避免无数据模型被顶到榜首。

## 返回值

### data.metric `string`

请求指标的回显（`"throughput"`、`"ttft"` 或 `"cache_hit"`）。

### data.starting_at `string`

实际起始日期（`YYYY-MM-DD`）。

### data.ending_at `string`

实际结束日期（`YYYY-MM-DD`）。

### data.entries `array`

Top 10 模型。条目结构取决于 `metric`。

**当 `metric` 为 `throughput` / `ttft` 时：**

- `rank` `integer` — 从 1 开始的排名
- `model` `string` — 模型标识
- `label` `string` — 模型展示名称
- `icon_url` `string` — 模型图标 URL（缺失时回退到作者图标）
- `providers` `array` — 按供应商拆分（最优在前）：
  - `provider` `string` — 供应商标识
  - `provider_label` `string` — 供应商展示名称
  - `provider_icon_url` `string` — 供应商图标 URL
  - `value` `number` — 指标值（吞吐量 token/秒，或延迟毫秒）
  - `value_label` `string` — 预格式化标签（如 `"152.34"` 或 `"420ms"`）

**当 `metric` 为 `cache_hit` 时：**

- `rank` `integer` — 从 1 开始的排名
- `model` `string` — 模型标识
- `label` `string` — 模型展示名称
- `icon_url` `string` — 模型图标 URL（缺失时回退到作者图标）
- `top_provider` `object` — 命中率最高的 (provider, api) 对：
  - `provider_label` `string` — 供应商展示名称
  - `api` `string` — API 类型（如 `anthropic`、`openai`）
  - `value` `number` — 命中率（0–1）
  - `value_label` `string` — 预格式化百分比（如 `"86.42%"`）
- `providers` `object` — 以供应商标识为 key 的映射：
  - `provider_label` `string` — 供应商展示名称
  - `provider_icon_url` `string` — 供应商图标 URL
  - `apis` `array` — 各 api 命中率（降序）：
    - `api` `string` — API 类型
    - `value` `number` — 命中率（0–1）
    - `value_label` `string` — 预格式化百分比
    - `cache_tokens` `number` — 缓存读取 token（`input_cache_read`）
    - `prompt_tokens` `number` — 命中率分母 token（读取 + prompt + 各档缓存写入）

::: api-request GET /api/v1/management/statistics/performance

```bash [cURL]
curl -G https://zenmux.ai/api/v1/management/statistics/performance \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  -d metric=throughput \
  -d starting_at=2026-06-14 \
  -d ending_at=2026-06-21
```
:::

::: api-response

```json
{
  "success": true,
  "data": {
    "metric": "throughput",
    "starting_at": "2026-06-14",
    "ending_at": "2026-06-21",
    "entries": [
      {
        "rank": 1,
        "model": "qwen/qwen3-coder",
        "label": "Qwen3-Coder",
        "icon_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/04/01/qeMamJm/Property-1Qwen.svg",
        "providers": [
          {
            "provider": "alibaba",
            "provider_label": "Alibaba",
            "provider_icon_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/04/01/qeMamJm/Property-1Qwen.svg",
            "value": 152.34,
            "value_label": "152.34"
          }
        ]
      }
    ]
  }
}
```

```json|cache_hit
{
  "success": true,
  "data": {
    "metric": "cache_hit",
    "starting_at": "2026-06-14",
    "ending_at": "2026-06-21",
    "entries": [
      {
        "rank": 1,
        "model": "anthropic/claude-sonnet-4",
        "label": "Claude Sonnet 4",
        "icon_url": "https://cdn.marmot-cloud.com/storage/zenmux/2025/10/15/xxx/Property-1Anthropic.svg",
        "top_provider": {
          "provider_label": "Anthropic",
          "api": "anthropic",
          "value": 0.8642,
          "value_label": "86.42%"
        },
        "providers": {
          "anthropic": {
            "provider_label": "Anthropic",
            "provider_icon_url": "https://cdn.marmot-cloud.com/storage/zenmux/2025/10/15/xxx/Property-1Anthropic.svg",
            "apis": [
              {
                "api": "anthropic",
                "value": 0.8642,
                "value_label": "86.42%",
                "cache_tokens": 128450000,
                "prompt_tokens": 148630000
              }
            ]
          }
        }
      }
    ]
  }
}
```

:::
