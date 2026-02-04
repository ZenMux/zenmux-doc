---
head:
  - - meta
    - name: description
      content: 请求日志
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, logs, Anthropic, Claude, API
---

# 请求日志

ZenMux 提供了完善的日志系统，帮助您实时监控和分析所有 API 调用记录。通过日志功能，您可以查看每次请求的详细信息，包括 Token 使用量、费用、性能指标等，从而更好地优化您的应用和控制成本。

## 日志查看

### Logs 界面

![logs](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/04/hRufjb7/C1924254-C6BA-4BE9-A8EA-37ED8DA28955.png)

在控制台的 **Logs** 页面，您可以查看所有 API 调用的详细记录。界面提供了强大的筛选和分析功能：

**筛选功能：**

- **时间范围筛选（Time）**：选择特定的日期范围来查看历史记录
- **API Key 筛选（API Keys）**：按不同的 API Key 过滤日志，便于多项目管理
- **Request ID 搜索（Request）**：输入请求 ID 快速定位特定请求
- **Provider 筛选（Provider）**：按供应商过滤，如 Anthropic、OpenAI 等
- **Model 筛选（Model）**：按模型过滤，快速查找特定模型的调用记录
- **Finish Reason 筛选（Finish Reason）**：按完成原因过滤，如 `stop`、`end_turn`、`max_tokens` 等

**日志列表字段：**

| 字段名称        | 说明                                                                     |
| :-------------- | :----------------------------------------------------------------------- |
| `Timestamp`     | 请求发起的时间戳                                                         |
| `Model`         | 使用的模型名称（如 openai/gpt-5.2、anthropic/claude-opus-4.5）           |
| `Input Tokens`  | 输入的 Token 数量，点击可查看详细的 Token 分类                           |
| `Output Tokens` | 输出的 Token 数量                                                        |
| `Cost`          | 本次调用的费用（美元）                                                   |
| `Latency`       | 请求响应延迟（毫秒）                                                     |
| `Throughput`    | 吞吐量，每秒生成的 Token 数（tokens per second）                         |
| `Finish`        | 完成状态（如 `end_turn`、`tool_use`、`stop`、`max_tokens`、`length` 等） |
| `Action`        | 操作按钮，点击 **Details** 查看完整的请求和响应详情                      |

::: tip Token 详情查看

![logs](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/04/oB9QNOh/20260204163548.jpg)

点击 Input Tokens 列的数字，会弹出悬浮窗显示详细的 Token 分类，包括：

- `prompt`：基础输入 Token
- `input_cache_read`：从缓存读取的 Token
- `input_cache_write`：写入缓存的 Token
- `input_cache_write_5_min`：5 分钟缓存写入
- `input_cache_write_1_h`：1 小时缓存写入

这有助于您了解缓存的使用情况和优化缓存策略。

:::

::: tip 扣费详情查看

鼠标悬停在 Cost 列的数字上，会弹出悬浮窗显示扣费详情。根据您的账户类型，显示内容会有所不同：

**按量付费用户（Pay As You Go）：**
![logs](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/04/sxs9R74/20260204163702.jpg)

显示详细的扣费钱包分类和结算状态：

- `Purchased Credits`：用户充值的金额，当 Reward Credits 余额不足时使用
- `Reward Credits`：如充值赠送、保险赔偿等，优先使用此余额扣费
- 状态标签（如 `Settled`）表示该笔费用已结算完成

**订阅用户（Subscription）：**
![logs](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/04/LsEH46N/20260204163622.jpg)
显示提示信息：`Included in your subscription usage - no separate charge.`（已包含在您的订阅用量中，无需额外付费）

:::

### 请求详情页面

![logs](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/04/z7KBWgU/20260204163740.jpg)

点击任意日志记录的 **Details** 按钮，可以查看该次调用的完整信息。详情页面分为左右两个区域：

#### 左侧：对话内容展示

左侧区域显示完整的请求和响应内容，分为 **Request**（请求）和 **Response**（响应）两个部分，每个部分包括：

- **User 消息**：用户发送的输入内容
- **System 消息**：系统提示词（如果有）
- **Assistant 消息**：模型生成的响应内容
- **工具调用**：如果使用了工具调用功能，会显示工具的输入和输出

**展示模式切换：**

左侧内容支持两种展示模式，可以通过顶部的 Tab 切换：

- **Pretty 模式（格式化模式）**：以格式化、易读的方式展示对话内容，消息按照角色分组显示，代码会进行语法高亮，更便于人工阅读和理解
- **JSON 模式（原始数据模式）**：以 JSON 格式展示完整的原始请求和响应数据，包含所有技术细节，适合开发调试和问题排查

**JSON 模式下的数据源切换：**

在 JSON 模式下，您可以进一步选择查看不同阶段的数据：

- **Request（请求数据）**：
  - `User -> ZenMux`：用户发送给 ZenMux 的原始请求
  - `ZenMux -> Origin`：ZenMux 转发给上游供应商的请求
- **Response（响应数据）**：
  - `ZenMux -> User`：ZenMux 返回给用户的响应
  - `Origin -> ZenMux`：上游供应商返回给 ZenMux 的原始响应

::: tip 切换展示模式
根据您的需求选择合适的展示模式：

- 查看对话内容和分析交互效果时，使用 **Pretty 模式**
- 调试 API 集成或排查技术问题时，使用 **JSON 模式**，并根据需要切换数据源查看请求/响应在不同阶段的详细内容
  :::

#### 右侧：技术指标和元数据

右侧区域显示详细的技术指标和元数据信息：

**模型信息（Model Information）：**

- **Model**：使用的模型名称
- **Provider**：模型供应商

**Token 计数（Token Counting）：**

- **Input Tokens（输入 Token）**：
  - `prompt`：提示词 Token 数
  - `input_cache_write`：写入缓存的 Token 数
  - `input_cache_write_5_min`：5 分钟缓存写入 Token 数
  - `input_cache_write_1_h`：1 小时缓存写入 Token 数
  - `input_cache_read`：从缓存读取的 Token 数
- **Output Tokens（输出 Token）**：
  - `completion`：生成内容 Token 数
  - `internal_reasoning`：内部推理 Token 数
  - `audio`：音频 Token 数

**请求计数（Requests Counting）：**

- `web_search`：网页搜索请求次数

**多模态计数（Multimodalities Counting）：**

- `image`：图片处理数量

**性能指标（Performance Metrics）：**

- **First Token Latency (ms)**：从请求发送到接收第一个 Token 的时间（毫秒）
- **Generation Time (ms)**：完整响应的生成时间（毫秒）
- **Throughput (tps)**：Token 生成速率（每秒 Token 数）

**原始元数据（Raw Metadata）：**

- 以 JSON 格式展示完整的请求元数据
- 支持一键复制 JSON 数据

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
