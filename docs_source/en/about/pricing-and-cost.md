# Pricing and Costs

ZenMux adopts a transparent billing system that ensures every API call is accurately metered and billed. Different models have varying prices, and the same model may have different pricing across different providers.

## Price Viewing

You can view pricing information for each provider on the model details page. Each provider displays detailed billing standards, including input tokens, output tokens, and special feature costs.

![Model details page pricing section](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/zhew65D/model-pricing.png)

## Billing Items Description

ZenMux billing items include the following types:

| Billing Item | Description |
| :--- | :--- |
| `prompt` | Processing cost for input prompts |
| `completion` | Cost for model-generated output content |
| `image` | Cost for image processing or generation |
| `request` | Base cost for API request calls |
| `web_search` | Cost for web search functionality calls |
| `input_cache_read` | Cost for cache read operations |
| `input_cache_write` | Cost for cache write operations |
| `input_cache_write_5_min` | Cost for 5-minute cache write operations |
| `input_cache_write_1_h` | Cost for 1-hour cache write operations |
| `internal_reasoning` | Cost for internal reasoning computation |

::: tip Billing Accuracy Guarantee
We guarantee that every call is accurately metered and billed. You can view detailed cost breakdowns through the console.
:::

## Cost Details Viewing

### Console Activity Interface

You can view cost details for all API calls in the **Activity** interface of the console, including specific costs for each call, token usage, call time, and other information.

![Console Activity interface](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/NYwQvBH/activity-cost.png)

Click on specific call records to view more detailed cost breakdowns:

![Cost details](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/dWtmUoT/cost-details.png)

### Raw Meta Information

In addition to the console interface, you can also understand call cost details through the raw meta information returned by the API. Here is a complete example data:

::: details Cost Details JSON Example
```json
{
  "generationId": "2534CCEDTKJR00217635",
  "accountId": "2533AC0Q5MIe14613672",
  "apiKeyId": "2534AKkA4Nqn14642786",
  "authorSlug": "anthropic",
  "modelSlug": "anthropic/claude-sonnet-4",
  "providerSlug": "anthropic",
  "endpointSlug": "anthropic/ahtnropic_endpoint",
  "appId": null,
  "createdAt": "2025-08-22T02:49:18.000+00:00",
  "generationTime": 3298,
  "latency": 2177,
  "moderationLatency": 2169,
  "streamed": true,
  "cancelled": false,
  "tokensPrompt": 16527,
  "tokensCompletion": 95,
  "tokensReasoning": 0,
  "throughput": "28.81",
  "nativeTokensPrompt": 16527,
  "nativeTokensCompletion": 95,
  "nativeTokensReasoning": 0,
  "nativeFeeTokens": {
    "input_cache_write_5_min": 0,
    "completion": 95,
    "input_cache_read": 0,
    "input_cache_write_1_h": 0,
    "prompt": 16527
  },
  "nativeTokens": {
    "completion_tokens": 95,
    "prompt_tokens": 16527,
    "total_tokens": 16622,
    "completion_tokens_details": { "reasoning_tokens": 0 },
    "prompt_tokens_details": {
      "ephemeral_1h_input_tokens": 0,
      "ephemeral_5m_input_tokens": 0,
      "cached_tokens": 0
    }
  },
  "finishReason": "tool_calls",
  "nativeFinishReason": "tool_calls",
  "origin": null,
  "providerResponses": null,
  "providerApiKeyId": "2533PCgBu07N14613665",
  "byok": false,
  "originAmount": "0.051006",
  "billAmount": "0.051006",
  "discountAmount": "0",
  "realAmount": "0.051006",
  "nonpaymentAmount": "0",
  "ratingResponses": {
    "billAmount": 0.051006,
    "discountAmount": 0,
    "originAmount": 0.051006,
    "priceVersion": "0.0.3",
    "ratingDetails": [
      {
        "billAmount": 0,
        "discountAmount": 0,
        "feeItemCode": "input_cache_write_5_min",
        "originAmount": 0,
        "rate": 3.75
      },
      {
        "billAmount": 0.001425,
        "discountAmount": 0,
        "feeItemCode": "completion",
        "originAmount": 0.001425,
        "rate": 15
      },
      {
        "billAmount": 0,
        "discountAmount": 0,
        "feeItemCode": "input_cache_read",
        "originAmount": 0,
        "rate": 0.3
      },
      {
        "billAmount": 0,
        "discountAmount": 0,
        "feeItemCode": "input_cache_write_1_h",
        "originAmount": 0,
        "rate": 6
      },
      {
        "billAmount": 0.049581,
        "discountAmount": 0,
        "feeItemCode": "prompt",
        "originAmount": 0.049581,
        "rate": 3
      }
    ],
    "serviceCode": "anthropic#anthropic/ahtnropic_endpoint#anthropic/claude-sonnet-4"
  },
  "requestRetryTimes": 0,
  "finalRetry": true,
  "billStatus": 0,
  "bizHour": "2025082202",
  "bizDate": "20250822",
  "bizMonth": "202508",
  "bizWeek": "202534",
  "source": "itboxroutercore",
  "ext": { "traceId": "21d5e62d17558309613841043942", "requestSuccess": true },
  "model": "Anthropic: Claude Sonnet 4"
}
```
:::

### Key Cost Fields Description

Understanding the key cost fields in meta information helps you better analyze and manage call costs:

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `originAmount` | string | Original cost amount (before billing) |
| `billAmount` | string | Actual billed amount |
| `discountAmount` | string | Discount amount |
| `realAmount` | string | Final payment amount |
| `ratingDetails` | array | Detailed cost breakdown, listing costs and rates for each billing item |

::: info Cost Calculation Explanation
The final payment amount calculation formula is: **realAmount = billAmount - discountAmount**

Each `ratingDetails` item contains specific cost breakdown and unit rate information for that billing item.
:::