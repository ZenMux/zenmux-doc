---
pageClass: api-page
title: Get Account Cost
head:
  - - meta
    - name: description
      content: Query personal account Cost and Provider Cost analytics
---

# Get Account Cost

Returns the Cost and Provider Cost shown under **Analysis > Cost** in the ZenMux console.

```http
GET https://zenmux.ai/api/v1/management/cost
```

## Authentication

### Authorization Header <span style="color: #FA6062; font-weight: 400">&#42;</span>

```http
Authorization: Bearer <ZENMUX_MANAGEMENT_API_KEY>
```

- **Name**: `Authorization`
- **Format**: `Bearer <API_KEY>`
- **Description**: A Management API Key created using your personal account in the [ZenMux Console](https://zenmux.ai/platform/management)

::: warning Management API Key required
Only a directly created `sk-mg-v1-*` Management API Key belonging to a personal account is accepted. Standard API Keys, OAuth access tokens, and organization Management Keys are rejected.
:::

## Query parameters

| Parameter | Required | Description |
| --- | --- | --- |
| `type` | Yes | `cost` or `provider_cost` |
| `query_dimension` | Yes | `BIZ_MTH`, `BIZ_DT`, or `BIZ_HOUR` |
| `query_time` | Yes | `YYYYMM`, `YYYYMMDD`, or `YYYYMMDDHH`, matching `query_dimension` |
| `api_key_ids` | No | Comma-separated API Key IDs. Empty means all API Keys in the personal account. |
| `model_slugs` | No | Comma-separated model slugs. `provider_cost` requires exactly one model. |
| `bill_types` | No | `metered`: PAYG usage charged to your account balance; `subscription`: usage covered by your subscription quota; `fallbackMetered`: subscription usage that falls back to PAYG billing. Separate multiple values with commas; leave empty for all types. |

For `type=cost`, omitting `api_key_ids`, `model_slugs`, and `bill_types` (or leaving them empty) returns all summary and grouped statistics for the personal account that owns the Management Key, within the period specified by `query_dimension` and `query_time`.

For `type=provider_cost`, `model_slugs` is still required and must contain exactly one model. `api_key_ids` and `bill_types` can be omitted.

The dimension and time formats exactly match the console: month/day/hour queries use `BIZ_MTH + YYYYMM`, `BIZ_DT + YYYYMMDD`, and `BIZ_HOUR + YYYYMMDDHH`. Hour values are UTC.

`api_key_ids` only accepts IDs of non-deleted inference or subscription API Keys belonging to the authenticated personal account. Passing a Management Key ID, another account's Key ID, or a deleted Key ID returns HTTP 403.

## Returns

### success `boolean`

Whether the request succeeded. Always `true` in a successful response.

### data `object`

Query result. Both `cost` and `provider_cost` contain `summary` (cost totals) and `analysis` (grouped analysis). The shape of `analysis` depends on `type`.

::: info Cost interpretation
Flow is the billing unit for the ZenMux Builder Plan, and its USD-equivalent value fluctuates. PAYG Credits, in contrast, are fixed at **1 Credit = 1 USD**.

For `subscription` usage, returned costs are USD reference prices, not actual charges or subscription fees. `metered` and `fallbackMetered` usage is billed on a PAYG basis. When subscription and PAYG usage are queried together, the combined cost should not be treated as the actual amount charged.
:::

Non-null amounts, token counts, counts, ratios, and performance metrics are decimal strings, not JSON numbers. `null` means no statistic is available or the field is not used for that grouping; it is not equivalent to `"0"`. A successful response may contain empty arrays and `null` summary fields when no data is available.

Time series use the following `bizTime` formats according to `query_dimension`:

| `query_dimension` | Record granularity | `bizTime` format | Example |
| --- | --- | --- | --- |
| `BIZ_MTH` | Day | `YYYYMMDD` | `"20260903"` |
| `BIZ_DT` | Hour | `YYYYMMDDHH` | `"2026090312"` |
| `BIZ_HOUR` | Minute | `YYYYMMDDHHmm` | `"202609031215"` |

### data.summary `object`

Cost summary for the selected filters. Both `cost` and `provider_cost` use the same structure:

- `totalCost` `string | null` — Total cost for the selected filters, in USD.
- `inputCost` `string | null` — Input token cost, in USD.
- `outputCost` `string | null` — Output token cost, in USD.
- `otherCost` `string | null` — Other costs not classified as input or output token costs, in USD.
- `requestCounts` `string | null` — Total request count for the selected filters, not a monetary amount.
- `requestAvgCost` `string | null` — Average cost per request, in USD/request.
- `totalTokens` `string | null` — Total token count for the selected filters, not a monetary amount.
- `millionTokenAvgCost` `string | null` — Average cost normalized to one million tokens, in USD/million tokens, not the model’s list price.

### Cost (`type=cost`)

#### data.analysis `object`

Contains the three cost time series below. They are different breakdowns of the same costs; do not add the amounts across these arrays.

#### data.analysis.costByModel `array`

Grouped by time and model. Each item contains:

- `bizTime` `string` — Time bucket identifier in the format listed above, not an individual request timestamp.
- `modelSlug` `string` — Model identifier, such as `openai/gpt-5`, not its display name.
- `tokenType` `string | null` — Not a token-type grouping; normally `null`.
- `apiKeyId` `string | null` — Not an API Key grouping; normally `null`.
- `billAmount` `string | null` — Cost for this group and time bucket, in USD.
- `requestCounts` `string | null` — Request count for this group and time bucket.

#### data.analysis.costByApiKey `array`

Grouped by time and API Key. Each item contains:

- `bizTime` `string` — Time bucket identifier in the format listed above, not an individual request timestamp.
- `modelSlug` `string | null` — Not a model grouping; normally `null`.
- `tokenType` `string | null` — Not a token-type grouping; normally `null`.
- `apiKeyId` `string` — API Key resource ID accepted by `api_key_ids`, not the secret key token.
- `billAmount` `string | null` — Cost for this group and time bucket, in USD.
- `requestCounts` `string | null` — Request count for this group and time bucket.

#### data.analysis.costByTokenType `array`

Grouped by time and token type. Each item contains:

- `bizTime` `string` — Time bucket identifier in the format listed above, not an individual request timestamp.
- `modelSlug` `string | null` — Not a model grouping; normally `null`.
- `tokenType` `string` — Billable token type, such as `prompt` (input) or `completion` (output).
- `apiKeyId` `string | null` — Not an API Key grouping; normally `null`.
- `billAmount` `string | null` — Cost for this group and time bucket, in USD.
- `requestCounts` `string | null` — Request counts are normally not returned for this grouping and are `null`.

### Provider Cost (`type=provider_cost`)

`model_slugs` requires exactly one model. `data.summary` uses the cost summary fields above.

#### data.analysis `object`

Endpoint statistics for the selected model, with the fields below.

#### data.analysis.fastestEndpointSlug `string | null`

Identifier of the fastest endpoint within the query; may be `null` when unavailable.

#### data.analysis.mainEndpointSlug `string | null`

Identifier of the main endpoint with the most requests within the query; may be `null` when unavailable.

#### data.analysis.uptime `string | null`

Overall request success rate for the selected model, from `0` to `1`. For example, `"0.9920"` means 99.20%; this is not elapsed uptime.

#### data.analysis.endpointCount `string | null`

Number of endpoints within the query, represented as a string.

#### data.analysis.endpointUsages `array`

Statistics grouped by endpoint. Each item contains:

- `endpointSlug` `string` — Endpoint identifier distinguishing the endpoints used for the selected model.
- `requestCounts` `string | null` — Total requests for this endpoint.
- `tokens` `string | null` — Total tokens for this endpoint.
- `requestRatio` `string | null` — Share of requests served by this endpoint within the query, from `0` to `1`; `"0.8"` means 80%.
- `tokenRatio` `string | null` — Share of tokens served by this endpoint within the query, from `0` to `1`.
- `medianLatency` `string | null` — Median request latency for this endpoint, in milliseconds (ms), not mean latency.
- `medianThroughput` `string | null` — Median throughput for this endpoint, in tokens per second.
- `billAmount` `string | null` — Cost for this endpoint, in USD.
- `billAmountRatio` `string | null` — Share of the query’s total cost attributable to this endpoint, from `0` to `1`.

::: api-request GET /api/v1/management/cost

```cURL [Cost | Query cost totals and grouped time series]
curl -G https://zenmux.ai/api/v1/management/cost \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  --data-urlencode "type=cost" \
  --data-urlencode "query_dimension=BIZ_MTH" \
  --data-urlencode "query_time=202609" \
  --data-urlencode "api_key_ids=key_1,key_2" \
  --data-urlencode "model_slugs=openai/gpt-5" \
  --data-urlencode "bill_types=metered,subscription"
```

```json [Cost | Cost response]
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

```cURL [Provider Cost | Query endpoint costs for one model]
curl -G https://zenmux.ai/api/v1/management/cost \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  --data-urlencode "type=provider_cost" \
  --data-urlencode "query_dimension=BIZ_DT" \
  --data-urlencode "query_time=20260903" \
  --data-urlencode "model_slugs=openai/gpt-5"
```

```json [Provider Cost | Provider Cost response]
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

## Rate limits and errors

Account Usage and Cost endpoints share a limit of 60 requests per minute for each personal account. Request 61 returns HTTP 429 and `Retry-After: 60`. Existing platform-wide Management API limits also apply.

| Status | Meaning |
| --- | --- |
| 400 | Missing, malformed, unsupported, or mismatched query parameter |
| 401 | Authorization header is missing |
| 403 | Invalid credential type, organization account, or inaccessible API Key ID |
| 429 | Shared Usage/Cost rate limit exceeded |
| 502 | The Usage/Cost data service failed; no partial Cost response is returned |
