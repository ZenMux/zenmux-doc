# 请求日志

ZenMux 提供了完善的日志系统，帮助您实时监控和分析所有 API 调用记录。通过日志功能，您可以查看每次请求的详细信息，包括 Token 使用量、费用、性能指标等，从而更好地优化您的应用和控制成本。

## 日志查看

### Logs 界面

![logs](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/23/mztJndv/logs-1.png)

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

![logs](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/23/l7x9hSz/logs-3.png)

点击 Input Tokens 列的数字，会弹出悬浮窗显示详细的 Token 分类，包括：

- `prompt`：基础输入 Token
- `input_cache_read`：从缓存读取的 Token
- `input_cache_write`：写入缓存的 Token
- `input_cache_write_5_min`：5 分钟缓存写入
- `input_cache_write_1_h`：1 小时缓存写入

这有助于您了解缓存的使用情况和优化缓存策略。

:::

::: tip 扣费钱包 详情查看

![logs](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/23/euBJCl9/logs-2.png)

点击 Cost 列的数字，会弹出悬浮窗显示详细的扣费钱包分类，包括：

- `充值钱包`：用户充值的金额，当赠送钱包余额不足时，使用充值钱包扣费
- `赠送钱包`：如充值赠送、保险赔偿等，优先使用赠送钱包扣费

:::

### 请求详情页面

![logs](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/21/EClzQU6/logs-provider-model.png)

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

## 费用详情

日志系统不仅记录 API 调用信息，还提供了详细的费用分析功能。您可以通过多种方式查看费用详情：

### 在 Logs 界面查看

在 Logs 列表中，每条记录都会显示：

- **Cost 列**：直接显示该次调用的总费用以及不同钱包的扣费费用

![logs](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/23/euBJCl9/logs-2.png)
点击具体的调用记录，可以查看更详细的费用分解：

### 原始 Meta 信息

除了控制台界面，您还可以通过 API 返回的原始 Meta 信息来了解调用的费用详情。以下是一个完整的示例数据：

::: details 费用详情 JSON 示例

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

::: tip 联系我们
如果您在使用过程中遇到任何问题，或有任何建议和反馈，欢迎通过以下方式联系我们：

- **官方网站**：<https://zenmux.ai>
- **技术支持邮箱**：[support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**：[bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**：[@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**：<http://discord.gg/vHZZzj84Bm>

更多联系方式和详细信息，请访问我们的[联系我们页面](/zh/help/contact)。
:::
