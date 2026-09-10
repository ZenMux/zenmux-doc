---
pageClass: api-page
title: Get Account Usage
head:
  - - meta
    - name: description
      content: Query personal account Usage, Provider, and Performance analytics
---

# Get Account Usage

Returns personal account Usage, Provider, and Performance analytics with the same query granularity as **Analysis > Usage** in the ZenMux console.

```http
GET https://zenmux.ai/api/v1/management/usage
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
This endpoint accepts only a directly created `sk-mg-v1-*` Management API Key belonging to a personal account. Standard API Keys, OAuth access tokens, and organization Management Keys are not supported.
:::

## Query parameters

| Parameter | Required | Description |
| --- | --- | --- |
| `type` | Yes | `usage`, `provider`, or `performance` |
| `query_dimension` | Yes | `BIZ_MTH`, `BIZ_DT`, or `BIZ_HOUR` |
| `query_time` | Yes | `YYYYMM`, `YYYYMMDD`, or `YYYYMMDDHH`, matching `query_dimension` |
| `api_key_ids` | No | Comma-separated API Key IDs. Empty means all API Keys in the personal account. |
| `model_slugs` | No | Comma-separated model slugs. `provider` requires exactly one model. |
| `bill_types` | No | `metered`: PAYG usage charged to your account balance; `subscription`: usage covered by your subscription quota; `fallbackMetered`: subscription usage that falls back to PAYG billing. Separate multiple values with commas; leave empty for all types. |

For `type=usage` or `type=performance`, omitting `api_key_ids`, `model_slugs`, and `bill_types` (or leaving them empty) returns all summary and grouped statistics for the personal account that owns the Management Key, within the period specified by `query_dimension` and `query_time`.

For `type=provider`, `model_slugs` is still required and must contain exactly one model. `api_key_ids` and `bill_types` can be omitted.

`BIZ_MTH` returns the selected month's daily series, `BIZ_DT` returns the selected day's hourly series, and `BIZ_HOUR` returns the selected hour's minute series. For `BIZ_HOUR`, convert the selected local hour to UTC before creating `query_time`, as the console does.

Whitespace and duplicate CSV values are removed. Unknown query parameters and invalid calendar values return HTTP 400.

`api_key_ids` only accepts IDs of non-deleted inference or subscription API Keys belonging to the authenticated personal account. Passing a Management Key ID, another account's Key ID, or a deleted Key ID returns HTTP 403.

## Returns

### success `boolean`

Whether the request succeeded. Always `true` in a successful response.

### data `object`

Query result whose shape depends on `type`. All totals and grouped data below use the account, time range, and filters from this request.

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

### Usage (`type=usage`)

#### data.tokensTotal `string | null`

Total tokens for the selected filters.

#### data.tokensPrompt `string | null`

Input token count for the selected filters.

#### data.tokensCompletion `string | null`

Output token count for the selected filters.

#### data.requestCounts `string | null`

Total requests for the selected filters.

`tokensByModel`, `tokensByTokenType`, and `tokensByApiKey` are different groupings of the same usage; do not add token counts across these arrays.

#### data.tokensByModel `array`

Grouped by time and model. Each item contains:

- `bizTime` `string` — Time bucket identifier in the format listed above, not an individual request timestamp.
- `modelSlug` `string` — Model identifier, such as `openai/gpt-5`, not its display name.
- `tokenType` `string | null` — Not a token-type grouping; normally `null`.
- `apiKeyId` `string | null` — Not an API Key grouping; normally `null`.
- `tokens` `string | null` — Token count for this group and time bucket.
- `requestCounts` `string | null` — Request count for this group and time bucket.

#### data.tokensByTokenType `array`

Grouped by time and token type. Each item contains:

- `bizTime` `string` — Time bucket identifier in the format listed above, not an individual request timestamp.
- `modelSlug` `string | null` — Not a model grouping; normally `null`.
- `tokenType` `string` — Billable token type, such as `prompt` (input) or `completion` (output).
- `apiKeyId` `string | null` — Not an API Key grouping; normally `null`.
- `tokens` `string | null` — Token count for this group and time bucket.
- `requestCounts` `string | null` — Request counts are normally not returned for this grouping and are `null`.

#### data.tokensByApiKey `array`

Grouped by time and API Key. Each item contains:

- `bizTime` `string` — Time bucket identifier in the format listed above, not an individual request timestamp.
- `modelSlug` `string | null` — Not a model grouping; normally `null`.
- `tokenType` `string | null` — Not a token-type grouping; normally `null`.
- `apiKeyId` `string` — API Key resource ID accepted by `api_key_ids`, not the secret key token.
- `tokens` `string | null` — Token count for this group and time bucket.
- `requestCounts` `string | null` — Request count for this group and time bucket.

#### data.countsByWebSearch `array`

Web Search requests grouped by time and model. Each item contains:

- `bizTime` `string` — Time bucket identifier in the format listed above, not an individual request timestamp.
- `modelSlug` `string` — Model identifier, such as `openai/gpt-5`, not its display name.
- `tokenType` `string | null` — Not a token-type grouping; normally `null`.
- `apiKeyId` `string | null` — Not an API Key grouping; normally `null`.
- `tokens` `string | null` — Web Search is counted in requests; normally `null`, not a token-usage measurement for searches.
- `requestCounts` `string | null` — Web Search request count for this model and time bucket; do not add it to the overall request total.

### Provider (`type=provider`)

`model_slugs` requires exactly one model. `data` returns endpoint statistics for that model within the selected filters:

#### data.fastestEndpointSlug `string | null`

Identifier of the fastest endpoint within the query; may be `null` when unavailable.

#### data.mainEndpointSlug `string | null`

Identifier of the main endpoint with the most requests within the query; may be `null` when unavailable.

#### data.uptime `string | null`

Overall request success rate for the selected model, from `0` to `1`. For example, `"0.9920"` means 99.20%; this is not elapsed uptime.

#### data.endpointCount `string | null`

Number of endpoints within the query, represented as a string.

#### data.endpointUsages `array`

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

### Performance (`type=performance`)

#### data.medianLatency `string | null`

Median request latency for the selected filters, in milliseconds (ms), not mean latency.

#### data.medianThroughput `string | null`

Median throughput for the selected filters, in tokens per second.

Do not compute overall medians by averaging model-level medians.

#### data.modelPerformances `array`

Performance summary grouped by model. Each item contains:

- `modelSlug` `string` — Model identifier, such as `openai/gpt-5`, not its display name.
- `medianLatency` `string | null` — Median request latency for this model, in milliseconds (ms).
- `medianThroughput` `string | null` — Median throughput for this model, in tokens per second.

#### data.latencyDetails `array`

Latency time series grouped by time and model. Each item contains:

- `bizTime` `string` — Time bucket identifier in the format listed above, not an individual request timestamp.
- `modelSlug` `string` — Model identifier, such as `openai/gpt-5`, not its display name.
- `medianLatency` `string | null` — Median request latency for this model and time bucket, in milliseconds (ms).

#### data.throughputDetails `array`

Throughput time series grouped by time and model. Each item contains:

- `bizTime` `string` — Time bucket identifier in the format listed above, not an individual request timestamp.
- `modelSlug` `string` — Model identifier, such as `openai/gpt-5`, not its display name.
- `medianThroughput` `string | null` — Median throughput for this model and time bucket, in tokens per second.

::: api-request GET /api/v1/management/usage

```cURL [Usage | Query usage totals and grouped time series]
curl -G https://zenmux.ai/api/v1/management/usage \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  --data-urlencode "type=usage" \
  --data-urlencode "query_dimension=BIZ_MTH" \
  --data-urlencode "query_time=202609" \
  --data-urlencode "api_key_ids=key_1,key_2" \
  --data-urlencode "model_slugs=openai/gpt-5" \
  --data-urlencode "bill_types=metered,subscription"
```

```json [Usage | Usage response]
{
  "success": true,
  "data": {
    "tokensTotal": "1500000",
    "tokensPrompt": "1000000",
    "tokensCompletion": "500000",
    "requestCounts": "125",
    "tokensByModel": [
      {
        "bizTime": "20260903",
        "modelSlug": "openai/gpt-5",
        "tokenType": null,
        "apiKeyId": null,
        "tokens": "1500000",
        "requestCounts": "125"
      }
    ],
    "tokensByTokenType": [
      {
        "bizTime": "20260903",
        "modelSlug": null,
        "tokenType": "prompt",
        "apiKeyId": null,
        "tokens": "1000000",
        "requestCounts": null
      },
      {
        "bizTime": "20260903",
        "modelSlug": null,
        "tokenType": "completion",
        "apiKeyId": null,
        "tokens": "500000",
        "requestCounts": null
      }
    ],
    "tokensByApiKey": [
      {
        "bizTime": "20260903",
        "modelSlug": null,
        "tokenType": null,
        "apiKeyId": "key_1",
        "tokens": "1000000",
        "requestCounts": "80"
      },
      {
        "bizTime": "20260903",
        "modelSlug": null,
        "tokenType": null,
        "apiKeyId": "key_2",
        "tokens": "500000",
        "requestCounts": "45"
      }
    ],
    "countsByWebSearch": [
      {
        "bizTime": "20260903",
        "modelSlug": "openai/gpt-5",
        "tokenType": null,
        "apiKeyId": null,
        "tokens": null,
        "requestCounts": "3"
      }
    ]
  }
}
```

```cURL [Provider | Query endpoint usage for one model]
curl -G https://zenmux.ai/api/v1/management/usage \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  --data-urlencode "type=provider" \
  --data-urlencode "query_dimension=BIZ_DT" \
  --data-urlencode "query_time=20260903" \
  --data-urlencode "model_slugs=openai/gpt-5"
```

```json [Provider | Provider response]
{
  "success": true,
  "data": {
    "fastestEndpointSlug": "provider-a",
    "mainEndpointSlug": "provider-a",
    "uptime": "0.9920",
    "endpointCount": "2",
    "endpointUsages": [
      {
        "endpointSlug": "provider-a",
        "requestCounts": "100",
        "tokens": "1200000",
        "requestRatio": "0.8000",
        "tokenRatio": "0.8000",
        "medianLatency": "320",
        "medianThroughput": "85.5",
        "billAmount": "9.1234000000",
        "billAmountRatio": "0.7390"
      },
      {
        "endpointSlug": "provider-b",
        "requestCounts": "25",
        "tokens": "300000",
        "requestRatio": "0.2000",
        "tokenRatio": "0.2000",
        "medianLatency": "410",
        "medianThroughput": "76.5",
        "billAmount": "3.2222000000",
        "billAmountRatio": "0.2610"
      }
    ]
  }
}
```

```cURL [Performance | Query model performance and time series]
curl -G https://zenmux.ai/api/v1/management/usage \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY" \
  --data-urlencode "type=performance" \
  --data-urlencode "query_dimension=BIZ_HOUR" \
  --data-urlencode "query_time=2026090312" \
  --data-urlencode "model_slugs=openai/gpt-5,anthropic/claude-sonnet-4"
```

```json [Performance | Performance response]
{
  "success": true,
  "data": {
    "medianThroughput": "82.5",
    "medianLatency": "340",
    "modelPerformances": [
      {
        "modelSlug": "openai/gpt-5",
        "medianLatency": "320",
        "medianThroughput": "85.5"
      },
      {
        "modelSlug": "anthropic/claude-sonnet-4",
        "medianLatency": "360",
        "medianThroughput": "79.5"
      }
    ],
    "latencyDetails": [
      {
        "bizTime": "202609031215",
        "modelSlug": "openai/gpt-5",
        "medianLatency": "320"
      },
      {
        "bizTime": "202609031215",
        "modelSlug": "anthropic/claude-sonnet-4",
        "medianLatency": "360"
      }
    ],
    "throughputDetails": [
      {
        "bizTime": "202609031215",
        "modelSlug": "openai/gpt-5",
        "medianThroughput": "85.5"
      },
      {
        "bizTime": "202609031215",
        "modelSlug": "anthropic/claude-sonnet-4",
        "medianThroughput": "79.5"
      }
    ]
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
| 502 | The Usage/Cost data service failed |
