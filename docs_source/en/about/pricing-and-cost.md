# Pricing and Fees

ZenMux uses a transparent billing system to ensure every call is precisely measured and billed. Pricing varies by model, and the same model may be priced differently across providers.

## View Pricing

You can view provider-specific pricing on the model details page. Each provider displays a detailed pricing schedule, including costs for input tokens, output tokens, and special features.

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/zhew65D/model-pricing.png" 
       alt="Pricing section on the model details page" 
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

## Billing Items

The billing items include the following types:

| Billing Item              | Description                                  |
| :------------------------ | :------------------------------------------- |
| `prompt`                  | Cost for processing input prompts            |
| `completion`              | Cost for model-generated outputs             |
| `image`                   | Cost for image processing or generation      |
| `request`                 | Base fee per API request                     |
| `web_search`              | Fee for invoking web search                  |
| `input_cache_read`        | Cost for cache read operations               |
| `input_cache_write`       | Cost for cache write operations              |
| `input_cache_write_5_min` | Cost for 5-minute cache write operations     |
| `input_cache_write_1_h`   | Cost for 1-hour cache write operations       |
| `internal_reasoning`      | Cost for internal reasoning computation      |

::: tip Billing Precision Guarantee
We ensure that every call is precisely metered and billed. You can review detailed cost breakdowns in the console page.
:::

## Viewing Cost Details

### Console Activity Page

On the console's **Activity** page, you can view cost details for all API calls, including the specific cost of each call, token usage, call time, and more.

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/NYwQvBH/activity-cost.png" 
       alt="Console - Activity page" 
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

Click a specific call record to view a more detailed cost breakdown:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/dWtmUoT/cost-details.png" 
       alt="Cost details" 
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

### Raw Meta Information

In addition to the console, you can inspect the raw Meta information returned by the API to understand call costs. Below is a complete sample payload:

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

### Key Cost Fields

Understanding the key cost fields in the Meta information helps you analyze and manage call costs:

| Field Name       | Data Type | Description                                                          |
| :--------------- | :-------- | :------------------------------------------------------------------- |
| `originAmount`   | string    | Original amount (before billing adjustments)                         |
| `billAmount`     | string    | Billed amount                                                        |
| `discountAmount` | string    | Discount amount                                                      |
| `realAmount`     | string    | Final payable amount                                                 |
| `ratingDetails`  | array     | Detailed cost breakdown by billing item, including per-unit rates   |

::: info Cost Calculation
The final payable amount is calculated as: realAmount = billAmount - discountAmount

Each `ratingDetails` entry includes the itemized cost and per-unit rate for that billing item.
:::