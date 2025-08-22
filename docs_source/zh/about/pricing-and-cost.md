# 价格与费用

ZenMux 采用透明的计费体系，确保每一笔调用都被精确计量计费。不同模型的价格存在差异，而同一模型在不同供应商下的价格也可能有所不同。

## 价格查看

您可以在模型详情页面查看各个供应商的价格信息。每个供应商都会展示详细的计费标准，包括输入 Token、输出 Token 以及特殊功能的费用。

![模型详情页面价格部分](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/zhew65D/model-pricing.png)

## 计费项目说明

ZenMux 的计费项目包括以下几种类型：

| 计费项                    | 说明                   |
| :------------------------ | :--------------------- |
| `prompt`                  | 输入提示词的处理费用   |
| `completion`              | 模型生成输出内容的费用 |
| `image`                   | 图像处理或生成的费用   |
| `request`                 | API 请求调用的基础费用 |
| `web_search`              | 网络搜索功能调用费用   |
| `input_cache_read`        | 缓存读取操作费用       |
| `input_cache_write`       | 缓存写入操作费用       |
| `input_cache_write_5_min` | 5 分钟缓存写入操作费用 |
| `input_cache_write_1_h`   | 1 小时缓存写入操作费用 |
| `internal_reasoning`      | 内部推理计算费用       |

::: tip 计费精度保证
我们保证每一笔调用都被精确计量计费，您可以通过控制台查看详细的费用明细。
:::

## 费用详情查看

### 控制台 Activity 界面

您可以在控制台的 **Activity** 界面查看所有 API 调用的费用详情，包括每次调用的具体费用、Token 使用量、调用时间等信息。

![控制台-Activity界面](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/NYwQvBH/activity-cost.png)

点击具体的调用记录，可以查看更详细的费用分解：

![费用详情](https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/dWtmUoT/cost-details.png)

### 原始 Meta 信息

除了控制台界面，您还可以通过 API 返回的原始 Meta 信息来了解调用的费用详情。以下是一个完整的示例数据：

::: details 费用详情 JSON 示例

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

### 关键费用字段说明

了解 Meta 信息中的关键费用字段，有助于您更好地分析和管理调用成本：

| 字段名称         | 数据类型 | 说明                                         |
| :--------------- | :------- | :------------------------------------------- |
| `originAmount`   | string   | 原始费用金额（计费前）                       |
| `billAmount`     | string   | 实际计费金额                                 |
| `discountAmount` | string   | 折扣金额                                     |
| `realAmount`     | string   | 最终支付金额                                 |
| `ratingDetails`  | array    | 详细费用分解，按计费项目列出每项的费用和费率 |

::: info 费用计算说明
最终支付金额的计算公式为：**realAmount = billAmount - discountAmount**

每个 `ratingDetails` 项目包含该计费项的具体费用分解和单价费率信息。
:::
