# Request Logs

ZenMux provides a comprehensive logging system that helps you monitor and analyze all API call records in real time. With the logging feature, you can view detailed information for each request, including token usage, cost, performance metrics, and more, enabling you to better optimize your application and control expenses.

## Viewing Logs

### Logs Interface

![logs](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/23/mztJndv/logs-1.png)

On the console's **Logs** page, you can view detailed records of all API calls. The interface offers powerful filtering and analysis capabilities:

**Filter Options:**

- **Time Range Filter**: Select a specific date range to view historical records
- **API Key Filter**: Filter logs by different API keys for multi-project management

**Log List Fields:**

| Field Name      | Description                                                        |
| :-------------- | :----------------------------------------------------------------- |
| `Timestamp`     | The timestamp when the request was initiated                       |
| `Model`         | The model name used (e.g., anthropic/claude-sonnet-4.5)            |
| `Input Tokens`  | Number of input tokens; click to view detailed token types         |
| `Output Tokens` | Number of output tokens                                            |
| `Cost`          | Cost for this call (USD)                                           |
| `Latency`       | Request response latency (milliseconds)                            |
| `Throughput`    | Throughput in tokens per second                                    |
| `Finish`        | Completion status (e.g., `end_turn`, `tool_use`, `stop`, `length`) |
| `Action`        | Action button; click **Details** to view full request/response     |

::: tip View Token Details

![logs](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/23/l7x9hSz/logs-3.png)

Click the number in the Input Tokens column to open a popover showing detailed token categories, including:

- `prompt`: Base input tokens
- `input_cache_read`: Tokens read from cache
- `input_cache_write`: Tokens written to cache
- `input_cache_write_5_min`: 5-minute cache writes
- `input_cache_write_1_h`: 1-hour cache writes

This helps you understand cache utilization and optimize caching strategies.

:::

::: tip Billing Wallet Details

![logs](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/23/euBJCl9/logs-2.png)

Click the number in the Cost column to open a popover showing detailed billing wallet categories, including:

- `Top-up Wallet`: User-recharged funds; used when the Bonus Wallet balance is insufficient
- `Bonus Wallet`: Funds from promotions or compensation; charged first

:::

### Request Details Page

![logs](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/21/EClzQU6/logs-provider-model.png)

Click the **Details** button on any log record to view complete information for that call. The details page is split into left and right sections:

#### Left: Conversation Content

The left section displays the full request and response content, including:

- **User messages**: The input content sent by the user
- **System messages**: System prompts (if any)
- **Assistant messages**: The model-generated response
- **Tool calls**: If tool calling was used, the tool inputs and outputs are shown

**Display Mode Switch:**

The left section supports two display modes, which you can switch via the toggle at the top:

- **Preview mode**: Displays the conversation in a formatted, readable layout with messages grouped by role and syntax highlighting for code, making it easier for human review
- **Raw mode**: Shows the complete raw request and response data in JSON format, including all technical details, suitable for development and troubleshooting

::: tip Switch Display Modes
Choose the appropriate display mode based on your needs:

- Use **Preview mode** to review conversation content and analyze interaction quality
- Use **Raw mode** to debug API integrations or troubleshoot technical issues
  :::

#### Right: Technical Metrics and Metadata

The right section shows detailed technical metrics and metadata:

**Model Information:**

- Model name and provider
- Endpoint information used

**Token Counting:**

- Detailed counts of input and output tokens
- Usage of various cache token types
- Special tokens (e.g., reasoning tokens) statistics

**Performance Metrics:**

- **First Token Latency**: Time from request sent to receiving the first token
- **Generation Time**: Time to generate the complete response
- **Throughput**: Token generation rate

**Raw Metadata:**

- Full request and response JSON data
- Billing breakdown and rate information
- Call trace ID

## Cost Details

The logging system not only records API call information but also provides detailed cost analysis. You can view cost details in multiple ways:

### View in the Logs Interface

In the Logs list, each record displays:

- **Cost column**: Shows the total cost for the call and deductions from different wallets

![logs](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/23/euBJCl9/logs-2.png)
Click a specific call record to see a more detailed cost breakdown:

### Raw Meta Information

Beyond the console, you can also inspect the raw meta information returned by the API to understand cost details for a call. Below is a complete sample payload:

::: details Cost Details JSON Example

```json
{
  "generationId": "2534CCEDTKJR00217635",
  "accountId": "2533AC0Q5MIe14613672",
  "model": "Anthropic: Claude Sonnet 4",
  "modelSlug": "anthropic/claude-sonnet-4",
  "apiKeyId": "2534AKkA4Nqn14642786",
  "providerSlug": "anthropic",
  "createdAt": "2025-08-22T02:49:18.000+00:00",
  "generationTime": 3298,
  "latency": 2177,
  "moderationLatency": 2169,
  "streamed": true,
  "cancelled": false,
  "throughput": "28.81",
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
  "finalRetry": true
}
```

:::

::: tip Contact Us
If you encounter any issues during use or have suggestions and feedback, feel free to contact us:

- **Official Website**: <https://zenmux.ai>
- **Technical Support**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business Inquiries**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord Community**: <http://discord.gg/vHZZzj84Bm>

For more contact options and details, please visit our [Contact Us page](/help/contact).
:::
