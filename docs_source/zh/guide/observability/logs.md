# 日志

ZenMux 提供了完善的日志系统，帮助您实时监控和分析所有 API 调用记录。通过日志功能，您可以查看每次请求的详细信息，包括 Token 使用量、费用、性能指标等，从而更好地优化您的应用和控制成本。

## 日志查看

### Logs 界面

在控制台的 **Logs** 页面，您可以查看所有 API 调用的详细记录。界面提供了强大的筛选和分析功能：

**筛选功能：**

- **时间范围筛选**：选择特定的日期范围来查看历史记录
- **API Key 筛选**：按不同的 API Key 过滤日志，便于多项目管理

**日志列表字段：**

| 字段名称        | 说明                                                       |
| :-------------- | :--------------------------------------------------------- |
| `Timestamp`     | 请求发起的时间戳                                           |
| `Model`         | 使用的模型名称（如 anthropic/claude-sonnet-4.5）           |
| `Input Tokens`  | 输入的 Token 数量，点击可查看详细的 Token 分类             |
| `Output Tokens` | 输出的 Token 数量                                          |
| `Cost`          | 本次调用的费用（美元）                                     |
| `Latency`       | 请求响应延迟（毫秒）                                       |
| `Throughput`    | 吞吐量，每秒生成的 Token 数（tokens per second）           |
| `Finish`        | 完成状态（如 `end_turn`、`tool_use`、`stop`、`length` 等） |
| `Action`        | 操作按钮，点击 **Details** 查看完整的请求和响应详情        |

::: tip Token 详情查看
点击 Input Tokens 列的数字，会弹出悬浮窗显示详细的 Token 分类，包括：

- `prompt`：基础输入 Token
- `input_cache_read`：从缓存读取的 Token
- `input_cache_write`：写入缓存的 Token
- `input_cache_write_5_min`：5 分钟缓存写入
- `input_cache_write_1_h`：1 小时缓存写入

这有助于您了解缓存的使用情况和优化缓存策略。
:::

### 请求详情页面

点击任意日志记录的 **Details** 按钮，可以查看该次调用的完整信息。详情页面分为左右两个区域：

#### 左侧：对话内容展示

左侧区域显示完整的请求和响应内容，包括：

- **User 消息**：用户发送的输入内容
- **System 消息**：系统提示词（如果有）
- **Assistant 消息**：模型生成的响应内容
- **工具调用**：如果使用了工具调用功能，会显示工具的输入和输出

**展示模式切换：**

左侧内容支持两种展示模式，可以通过顶部的切换按钮自由切换：

- **Preview 模式（预览模式）**：以格式化、易读的方式展示对话内容，消息按照角色分组显示，代码会进行语法高亮，更便于人工阅读和理解
- **Raw 模式（原始数据模式）**：以 JSON 格式展示完整的原始请求和响应数据，包含所有技术细节，适合开发调试和问题排查

::: tip 切换展示模式
根据您的需求选择合适的展示模式：

- 查看对话内容和分析交互效果时，使用 **Preview 模式**
- 调试 API 集成或排查技术问题时，使用 **Raw 模式**
  :::

#### 右侧：技术指标和元数据

右侧区域显示详细的技术指标和元数据信息：

**模型信息（Model Information）：**

- 模型名称和供应商
- 使用的端点信息

**Token 计数（Token Counting）：**

- 详细的输入和输出 Token 统计
- 各类缓存 Token 的使用情况
- 特殊 Token（如推理 Token）的统计

**性能指标（Performance Metrics）：**

- **First Token Latency（首 Token 延迟）**：从请求发送到接收第一个 Token 的时间
- **Generation Time（生成时间）**：完整响应的生成时间
- **Throughput（吞吐量）**：Token 生成速率

**原始元数据（Raw Metadata）：**

- 完整的请求和响应 JSON 数据
- 计费详情和费率信息
- 调用链路追踪 ID

## 计费透明度

ZenMux 采用透明的计费体系，确保每一笔调用都被精确计量计费。不同模型的价格存在差异，而同一模型在不同供应商下的价格也可能有所不同。

### 价格查看

您可以在模型详情页面查看各个供应商的价格信息。每个供应商都会展示详细的计费标准，包括输入 Token、输出 Token 以及特殊功能的费用。

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/zhew65D/model-pricing.png"
       alt="模型详情页面价格部分"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

### 计费项目说明

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
我们保证每一笔调用都被精确计量计费，您可以在日志详情中查看每次调用的费用明细和详细的费率分解。
:::

## 费用详情

日志系统不仅记录 API 调用信息，还提供了详细的费用分析功能。您可以通过多种方式查看费用详情：

### 在 Logs 界面查看

在 Logs 列表中，每条记录都会显示：

- **Cost 列**：直接显示该次调用的总费用
- 点击 **Details** 按钮查看详细的费用分解，包括每个计费项的具体金额和费率

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/NYwQvBH/activity-cost.png"
       alt="控制台日志界面"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

点击具体的调用记录，可以查看更详细的费用分解：

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/22/dWtmUoT/cost-details.png"
       alt="费用详情"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

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

## 使用建议

### 成本优化

通过日志系统，您可以：

1. **分析 Token 使用模式**

   - 查看不同请求的 Token 消耗情况
   - 识别高成本的调用场景
   - 优化 Prompt 设计以减少 Token 使用

2. **利用缓存功能**

   - 监控 `input_cache_read` 和 `input_cache_write` 的使用情况
   - 合理使用 5 分钟和 1 小时缓存来降低成本
   - 缓存命中可以显著降低输入 Token 的费用

3. **性能监控**
   - 关注 Latency 和 Throughput 指标
   - 比较不同模型和供应商的性能表现
   - 根据性能需求选择合适的模型配置

### 问题排查

日志系统可以帮助您快速定位问题：

- **查看 Finish Reason**：了解请求结束的原因（正常完成、达到长度限制、工具调用等）
- **检查错误日志**：通过筛选功能快速定位失败的请求
- **分析调用链路**：使用 Trace ID 追踪完整的请求处理流程

### 多项目管理

如果您管理多个项目：

- 为不同项目创建独立的 API Key
- 使用 API Key 筛选功能分别查看各项目的日志
- 分析各项目的成本分布和使用模式
