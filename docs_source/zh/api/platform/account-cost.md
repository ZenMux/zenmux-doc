---
pageClass: api-page
title: Get Account Cost
head:
  - - meta
    - name: description
      content: 查询个人账户 Cost 和 Provider Cost 数据
---

# Get Account Cost

查询 ZenMux 控制台 **Analysis > Cost** 展示的个人账户 Cost 和 Provider Cost。

```http
GET https://zenmux.ai/api/v1/management/cost
```

## 鉴权

### Authorization Header <span style="color: #FA6062; font-weight: 400">\*</span>

```http
Authorization: Bearer <ZENMUX_MANAGEMENT_API_KEY>
```

- **参数名**：`Authorization`
- **格式**：`Bearer <API_KEY>`
- **说明**：Management API Key，使用个人账户在 [ZenMux 控制台](https://zenmux.ai/platform/management) 创建

::: warning 仅支持 Management API Key
仅接受个人账户直接创建的 `sk-mg-v1-*` Management API Key。普通 API Key、OAuth access token 和组织 Management Key 均会被拒绝。
:::

## 查询参数

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `type` | 是 | `cost` 或 `provider_cost` |
| `query_dimension` | 是 | `BIZ_MTH`、`BIZ_DT` 或 `BIZ_HOUR` |
| `query_time` | 是 | 与查询维度对应的 `YYYYMM`、`YYYYMMDD` 或 `YYYYMMDDHH` |
| `api_key_ids` | 否 | API Key ID，多个值用逗号分隔；为空表示个人账户全部 API Key |
| `model_slugs` | 否 | 模型 slug，多个值用逗号分隔；`provider_cost` 必须且只能传一个模型 |
| `bill_types` | 否 | `metered`：按量付费，扣账户余额；`subscription`：使用订阅额度；`fallbackMetered`：订阅转按量付费的兜底用量。多个值用逗号分隔，留空查询全部类型 |

`type=cost` 时，若不传 `api_key_ids`、`model_slugs` 和 `bill_types`（或留空），将查询当前 Management Key 所属个人账户在 `query_dimension`、`query_time` 指定周期内的全部汇总和分组统计数据。

`type=provider_cost` 仍必须通过 `model_slugs` 指定且仅指定一个模型；`api_key_ids` 和 `bill_types` 可以省略。

时间格式与页面完全一致：按月、按日、按小时分别使用 `BIZ_MTH + YYYYMM`、`BIZ_DT + YYYYMMDD`、`BIZ_HOUR + YYYYMMDDHH`；小时值为 UTC。

`api_key_ids` 仅支持当前个人账户下未删除的推理或订阅 API Key ID；传入 Management Key ID、其他账户的 Key ID 或已删除的 Key ID，将返回 403。

## 返回值

### success `boolean`

请求是否成功。成功响应中固定为 `true`。

### data `object`

查询结果。`cost` 和 `provider_cost` 都包含 `summary`（费用汇总）与 `analysis`（分组分析），`analysis` 的结构由 `type` 决定。

::: info 费用口径
Flow 是 ZenMux Builder 计划的计费单位，其美元等价价值会浮动；PAYG 积分（Credits）则固定为 **1 积分 = 1 美元**。

对于 `subscription` 用量，返回的花费仅为 USD 参考价格，不代表实际扣款金额或订阅套餐费用。`metered` 和 `fallbackMetered` 按 PAYG 计费；混合查询订阅与 PAYG 用量时，汇总花费不能直接视为实际扣款金额。
:::

金额、Token 数、计数、比例和性能指标的非空值均为十进制字符串，而非 JSON 数字。`null` 表示没有可用统计值或当前分组不使用该字段，不等同于 `"0"`。无数据时仍可返回成功响应，数组为空，汇总字段可能为 `null`。

时间序列中的 `bizTime` 按 `query_dimension` 使用以下格式：

| `query_dimension` | 每条记录的粒度 | `bizTime` 格式 | 示例 |
| --- | --- | --- | --- |
| `BIZ_MTH` | 日 | `YYYYMMDD` | `"20260903"` |
| `BIZ_DT` | 小时 | `YYYYMMDDHH` | `"2026090312"` |
| `BIZ_HOUR` | 分钟 | `YYYYMMDDHHmm` | `"202609031215"` |

### data.summary `object`

当前筛选范围内的费用汇总。`cost` 和 `provider_cost` 使用相同结构：

- `totalCost` `string | null` — 当前筛选范围内的总费用，单位 USD。
- `inputCost` `string | null` — 输入 Token 的费用，单位 USD。
- `outputCost` `string | null` — 输出 Token 的费用，单位 USD。
- `otherCost` `string | null` — 未归入输入或输出 Token 的其他费用，单位 USD。
- `requestCounts` `string | null` — 当前筛选范围内的请求总数，不是金额。
- `requestAvgCost` `string | null` — 平均每次请求的费用，单位 USD/请求。
- `totalTokens` `string | null` — 当前筛选范围内的 Token 总数，不是金额。
- `millionTokenAvgCost` `string | null` — 折算为每百万 Token 的平均费用，单位 USD/百万 Token，不是该模型的标价。

### Cost (`type=cost`)

#### data.analysis `object`

包含以下三组费用时间序列。它们是同一费用的不同拆分方式，不应将三个数组的金额再次相加。

#### data.analysis.costByModel `array`

按时间和模型分组。每个元素包含：

- `bizTime` `string` — 统计时间桶标识，格式见上方时间表，不是单次请求的发生时间。
- `modelSlug` `string` — 模型标识，例如 `openai/gpt-5`，不是模型展示名称。
- `tokenType` `string | null` — 当前分组不按 Token 类型拆分，通常为 `null`。
- `apiKeyId` `string | null` — 当前分组不按 API Key 拆分，通常为 `null`。
- `billAmount` `string | null` — 该分组在当前时间桶内的费用，单位 USD。
- `requestCounts` `string | null` — 该分组在当前时间桶内的请求数。

#### data.analysis.costByApiKey `array`

按时间和 API Key 分组。每个元素包含：

- `bizTime` `string` — 统计时间桶标识，格式见上方时间表，不是单次请求的发生时间。
- `modelSlug` `string | null` — 当前分组不按模型拆分，通常为 `null`。
- `tokenType` `string | null` — 当前分组不按 Token 类型拆分，通常为 `null`。
- `apiKeyId` `string` — API Key 的资源 ID，与 `api_key_ids` 使用的值相同，不是密钥 token。
- `billAmount` `string | null` — 该分组在当前时间桶内的费用，单位 USD。
- `requestCounts` `string | null` — 该分组在当前时间桶内的请求数。

#### data.analysis.costByTokenType `array`

按时间和 Token 类型分组。每个元素包含：

- `bizTime` `string` — 统计时间桶标识，格式见上方时间表，不是单次请求的发生时间。
- `modelSlug` `string | null` — 当前分组不按模型拆分，通常为 `null`。
- `tokenType` `string` — 计费 Token 类型，例如 `prompt`（输入）或 `completion`（输出）。
- `apiKeyId` `string | null` — 当前分组不按 API Key 拆分，通常为 `null`。
- `billAmount` `string | null` — 该分组在当前时间桶内的费用，单位 USD。
- `requestCounts` `string | null` — 该分组通常不返回请求数，此时为 `null`。

### Provider Cost (`type=provider_cost`)

`model_slugs` 必须且只能包含一个模型。`data.summary` 沿用上方费用汇总字段。

#### data.analysis `object`

所选模型的 Endpoint 统计，字段如下。

#### data.analysis.fastestEndpointSlug `string | null`

当前查询范围内响应最快的 Endpoint 标识；无法确定时可为 `null`。

#### data.analysis.mainEndpointSlug `string | null`

当前查询范围内请求量最大的主要 Endpoint 标识；无法确定时可为 `null`。

#### data.analysis.uptime `string | null`

所选模型的整体请求成功率，范围 `0`～`1`。例如 `"0.9920"` 表示 99.20%，不是运行时长。

#### data.analysis.endpointCount `string | null`

当前查询范围内的 Endpoint 数量，以字符串表示。

#### data.analysis.endpointUsages `array`

按 Endpoint 拆分的统计。每个元素包含：

- `endpointSlug` `string` — 接入点标识，用于区分所选模型实际使用的 Endpoint。
- `requestCounts` `string | null` — 该 Endpoint 的请求总数。
- `tokens` `string | null` — 该 Endpoint 的 Token 总数。
- `requestRatio` `string | null` — 该 Endpoint 的请求数占当前查询请求总数的比例，范围 `0`～`1`；`"0.8"` 表示 80%。
- `tokenRatio` `string | null` — 该 Endpoint 的 Token 数占当前查询 Token 总数的比例，范围 `0`～`1`。
- `medianLatency` `string | null` — 该 Endpoint 的请求延迟中位数，单位毫秒（ms），不是平均延迟。
- `medianThroughput` `string | null` — 该 Endpoint 的吞吐量中位数，单位 Token/秒。
- `billAmount` `string | null` — 该 Endpoint 对应的费用，单位 USD。
- `billAmountRatio` `string | null` — 该 Endpoint 的费用占当前查询总费用的比例，范围 `0`～`1`。

::: api-request GET /api/v1/management/cost

```cURL [Cost | 查询费用汇总和分组时间序列]
curl -G https://zenmux.ai/api/v1/management/cost \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  --data-urlencode "type=cost" \
  --data-urlencode "query_dimension=BIZ_MTH" \
  --data-urlencode "query_time=202609" \
  --data-urlencode "api_key_ids=key_1,key_2" \
  --data-urlencode "model_slugs=openai/gpt-5" \
  --data-urlencode "bill_types=metered,subscription"
```

```json [Cost | Cost 响应]
{
  "success": true,
  "data": {
    "summary": {
      "totalCost": "12.3456000000",
      "inputCost": "8.0000000000",
      "outputCost": "4.3456000000",
      "otherCost": "0",
      "requestCounts": "125",
      "requestAvgCost": "0.0987648000",
      "totalTokens": "1500000",
      "millionTokenAvgCost": "8.2304000000"
    },
    "analysis": {
      "costByModel": [
        {
          "bizTime": "20260903",
          "modelSlug": "openai/gpt-5",
          "tokenType": null,
          "apiKeyId": null,
          "billAmount": "12.3456000000",
          "requestCounts": "125"
        }
      ],
      "costByApiKey": [
        {
          "bizTime": "20260903",
          "modelSlug": null,
          "tokenType": null,
          "apiKeyId": "key_1",
          "billAmount": "8.0000000000",
          "requestCounts": "80"
        },
        {
          "bizTime": "20260903",
          "modelSlug": null,
          "tokenType": null,
          "apiKeyId": "key_2",
          "billAmount": "4.3456000000",
          "requestCounts": "45"
        }
      ],
      "costByTokenType": [
        {
          "bizTime": "20260903",
          "modelSlug": null,
          "tokenType": "prompt",
          "apiKeyId": null,
          "billAmount": "8.0000000000",
          "requestCounts": null
        },
        {
          "bizTime": "20260903",
          "modelSlug": null,
          "tokenType": "completion",
          "apiKeyId": null,
          "billAmount": "4.3456000000",
          "requestCounts": null
        }
      ]
    }
  }
}
```

```cURL [Provider Cost | 查询指定模型的 Endpoint 费用]
curl -G https://zenmux.ai/api/v1/management/cost \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  --data-urlencode "type=provider_cost" \
  --data-urlencode "query_dimension=BIZ_DT" \
  --data-urlencode "query_time=20260903" \
  --data-urlencode "model_slugs=openai/gpt-5"
```

```json [Provider Cost | Provider Cost 响应]
{
  "success": true,
  "data": {
    "summary": {
      "totalCost": "12.3456000000",
      "inputCost": "8.0000000000",
      "outputCost": "4.3456000000",
      "otherCost": "0",
      "requestCounts": "125",
      "requestAvgCost": "0.0987648000",
      "totalTokens": "1500000",
      "millionTokenAvgCost": "8.2304000000"
    },
    "analysis": {
      "fastestEndpointSlug": "provider-a",
      "mainEndpointSlug": "provider-a",
      "uptime": "0.9990",
      "endpointCount": "2",
      "endpointUsages": [
        {
          "endpointSlug": "provider-a",
          "requestCounts": "100",
          "tokens": "1200000",
          "billAmount": "9.1234000000",
          "billAmountRatio": "0.7391"
        }
      ]
    }
  }
}
```

:::

## 限流与错误

个人 Usage 和 Cost 两条接口按账户共享每分钟 60 次请求。第 61 次返回 429，并携带 `Retry-After: 60`。平台现有 Management API 限流仍然生效。

| 状态码 | 含义 |
| --- | --- |
| 400 | 查询参数缺失、格式错误、不支持或互相不匹配 |
| 401 | 缺少 Authorization |
| 403 | 凭证类型、账户类型或 API Key ID 无权访问 |
| 429 | Usage/Cost 共享限流超限 |
| 502 | Usage/Cost 数据服务调用失败；Cost 不返回部分结果 |
