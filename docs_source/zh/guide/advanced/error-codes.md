---
head:
  - - meta
    - name: description
      content: ZenMux API 错误码参考手册
  - - meta
    - name: keywords
      content: Zenmux, guide, error codes, API, troubleshooting, 错误码
---

# API 错误码参考

本文档描述 ZenMux 平台接口所有可能返回的错误响应，包括错误原因及排查解决方案。

## 错误响应格式
所有错误均遵循统一的 JSON 结构：

```json
{
  "error": {
    "code": "429",
    "type": "rate_limit",
    "message": "Rate limit exceeded"
  }
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `code` | string | HTTP 状态码（字符串形式） |
| `type` | string | 错误类型 |
| `message` | string | 错误描述 |


## 错误速查表
| HTTP 状态码 | 错误类型 | 简述 |
| --- | --- | --- |
| 400 | `invalid_params` | 请求参数错误 |
| 402 | `insufficient_credit` | 账户欠费 |
| 402 | `reject_no_credit` | 余额不足 |
| 402 | `quote_exceeded` | 订阅配额用尽 |
| 403 | `access_denied` | API Key 无效或缺失 |
| 403 | `safety_check_failed` | 上游安全策略拦截 |
| 404 | `model_not_available` | 模型不包含在当前订阅计划中 |
| 404 | `invalid_model` | 模型不存在 |
| 404 | `model_not_supported` | 模型不支持该 API |
| 413 | `invalid_params` | 提示词过长 |
| 422 | `provider_unprocessable_entity_error` | 上游无法处理请求 |
| 429 | `rate_limit` | 请求频率超限 |
| 500 | `internal_server_error` | 平台内部错误 |
| 500 | `provider_api_error` | 上游供应商接口返回了错误 |
| 500 | `provider_error` | 上游供应商服务出现错误 |
| 502 | `no_provider_available` | 无可用上游服务商 |
| 520 | `provider_internal_server_error` | 无法与供应商正常通讯 |
| 524 | `provider_internal_server_error` | 供应商超时无响应 |


## 详细错误说明

### 认证与授权错误

#### HTTP 403 — `access_denied`
```json
{
  "error": {
    "code": "403",
    "type": "access_denied",
    "message": "You have no permission to access this resource"
  }
}
```

**原因：** 请求中提供的 API Key 无效、已过期或缺失。

**排查步骤：**

1. 检查是否通过 `Authorization: Bearer <key>`、`x-api-key` 或 `x-goog-api-key` 头部正确传递了 API Key。
2. 登录 [ZenMux 控制台](https://zenmux.ai/platform) 确认 API Key 未被撤销或过期。 
3. 确认复制 API Key 时没有多余的空格或换行符。

#### HTTP 403 — `safety_check_failed`
表示输入内容被上游安全策略拦截。

**排查步骤：**

1. 调整提示词、图片、文件或工具输入内容
2. 减少可能触发安全规则的描述
3. 必要时切换模型

### 参数校验错误

#### HTTP 400 — `invalid_params`
当请求参数未通过校验时返回。具体场景如下：

| 错误信息 | 原因 | 解决方法 |
| --- | --- | --- |
| `Parameter model is required` | 缺少 `model` 字段或值为空 | 在请求体中添加有效的 `model` 值 |
| `Model {model} is not valid` | 指定的模型标识不存在 | 查阅[模型列表](https://zenmux.ai/models)获取有效模型名称 |
| `Parameter messages is required` | 缺少 `messages` 字段 | 在请求体中包含 `messages` 数组 |
| `Parameter messages can not be empty` | `messages` 为空数组 | 至少提供一条消息 |
| `Parameter messages can not contain null elements` | `messages` 中存在 `null` 元素 | 移除消息数组中的 null 项 |
| `Parameter messages can not contain elements without content` | 消息对象缺少 `content` 字段 | 确保每条消息都包含 `content` 值 |
| `Parameter stream_options is not supported while stream is false` | 设置了 `stream_options` 但 `stream` 为 `false` 或未设置 | 设置 `stream: true` 或移除 `stream_options` |
| `Parameter n grater than 1 is not supported` | `n` 值大于 1 | 将 `n` 设为 1 或不传该参数 |
| `Parameter temperature is not valid` | `temperature` 为负数 | 使用 ≥ 0 的 `temperature` 值 |
| `Parameter stream_options.include_usage conflict with usage.include` | `stream_options.include_usage` 与 `usage.include` 取值冲突 | 仅使用其中一个参数 |
| `Parameter include_reasoning conflict with reasoning.exclude` | `include_reasoning` 与 `reasoning.exclude` 冲突 | 仅使用其中一个参数 |
| `Parameter type of provider.routing is not valid` | Provider 路由类型无效 | 参阅 Provider 路由文档 |
| `Parameter providers of provider.routing is not valid` | Provider 路由列表为空 | 指定至少一个 Provider |


#### HTTP 413 — `invalid_params`（提示词过长）
```json
{
  "error": {
    "code": "413",
    "type": "invalid_params",
    "message": "Prompt is too long"
  }
}
```

**原因：** 请求体（包含所有消息）超出了模型的最大上下文长度。

**排查步骤：**

1. 减少 `messages` 数组中消息的数量或长度。
2. 考虑使用支持更大上下文窗口的模型。
3. 对较早的对话轮次进行摘要，而不是包含完整历史。

#### HTTP 422 — `provider_unprocessable_entity_error`
**原因：** 请求在平台侧通过，但上游模型服务商无法处理该请求，通常是上游模型服务商对字段结构、工具、格式化输出或多模态输入有更严格要求。

**排查步骤：**

1. 查看响应中 `message` 字段的具体描述。
2. 检查所有参数是否与所选模型兼容。
3. 移除可选/高级参数后用最小请求重试。

### 计费与订阅错误

#### HTTP 402 — `insufficient_credit`（账户欠费）
```json
{
  "error": {
    "code": "402",
    "type": "insufficient_credit",
    "message": "Account overdue. To prevent abuse, a non-negative balance is required for all models (including free tiers)."
  }
}
```

**原因：** 账户余额为负（欠费状态）。

**排查步骤：**

1. 前往 [ZenMux 计费页面](https://zenmux.ai/platform) 充值。

#### HTTP 402 — `reject_no_credit`（余额不足）
```json
{
  "error": {
    "code": "402",
    "type": "reject_no_credit",
    "message": "Credit required. To prevent abuse, a positive balance is required for this model."
  }
}
```

**原因：** 账户余额为零或极低，而请求的模型要求正余额。

**排查步骤：**

1. 充值账户余额。
2. 切换到允许低余额访问的模型或套餐

#### HTTP 402 — `quote_exceeded`（订阅配额用尽）
```json
{
  "error": {
    "code": "402",
    "type": "quote_exceeded",
    "message": "You have reached your subscription quota limit. Please wait for automatic quota refresh in the rolling time window, upgrade to a higher plan, or use a Pay-As-You-Go API Key for unlimited access. Learn more: https://zenmux.ai/docs/guide/subscription.html"
  }
}
```

**原因：** 已耗尽当前订阅计划包含的配额。

**解决方案：**

1. **等待刷新** — 配额会在滚动时间窗口内自动恢复。
2. **升级计划** — 切换到更高级别的订阅以获得更大配额。
3. **按量付费** — 创建 Pay-As-You-Go API Key，享受无限量使用（按 Token 计费）。

### 模型可用性错误

#### HTTP 404 — `model_not_available`（模型不在订阅计划中）
```json
{
  "error": {
    "code": "404",
    "type": "model_not_available",
    "message": "The requested model is not included in your subscription plan. Please create a Pay-As-You-Go API Key to access this model, or check available models for your plan at https://zenmux.ai/docs/guide/subscription.html"
  }
}
```

**原因：** 请求的模型存在，但不包含在当前订阅计划中。

**排查步骤：**

1. 查阅[订阅指南](https://zenmux.ai/docs/guide/subscription.html)确认当前计划支持的模型列表。
2. 升级订阅计划以包含目标模型。
3. 使用 Pay-As-You-Go API Key 访问计划外的模型。

#### HTTP 404 — `invalid_model`（模型不存在）
**原因：** 指定的模型标识与所有已知模型均不匹配。

**排查步骤：**

1. 检查模型名称是否有拼写错误。
2. 参考[模型列表](https://zenmux.ai/models)获取有效的模型标识。

#### HTTP 404 — `model_not_supported`（模型不支持该 API）
**原因：** 模型存在但不支持当前调用的接口。

**排查步骤：**

1. 查看模型详情页面确认其支持的 API 接口。
2. 切换到支持当前接口的模型。

### 限流错误

#### HTTP 429 — `rate_limit`
```json
{
  "error": {
    "code": "429",
    "type": "rate_limit",
    "message": "Rate limit exceeded"
  }
}
```

**原因：** 请求频率超出允许上限。可能来自平台限流或上游模型服务商限流。

**排查步骤：**

1. **降低请求频率** — 在请求之间添加延迟或使用指数退避策略。
2. **分散高峰调用**

### 服务端与上游错误

#### HTTP 500 — `internal_server_error`（平台内部错误）
**原因：** 服务器发生意外错误，可能由以下情况导致：

+ 平台的瞬时故障。
+ 上游错误被平台统一收敛为内部错误。

**排查步骤：**

1. **退避重试** — 大多数 500 错误是瞬时的，使用指数退避重试即可。
2. 持续复现时提供响应头中的 `X-ZenMux-RequestId` 联系支持。

#### HTTP 500 — `provider_error`、`provider_api_error`
**原因：** 表示请求已经到达上游，大概率是上游供应商出现了问题。

**排查步骤：**

1. **退避重试**
2. 持续复现时提供响应头中的 `X-ZenMux-RequestId` 联系支持。

#### HTTP 502 — `no_provider_available` — 上游服务商不可用
**原因：** 当前没有可用的上游服务商处理请求，可能由以下情况导致：

+ 参数所指定的供应商不存在。
+ 该模型所有配置的上游服务商均出现故障。
+ 多次重试后所有服务商均失败。

**排查步骤：**

1. 放宽或取消指定供应商的规则。
2. 短暂等待后重试。

### 流式请求特殊情况
使用 `stream: true` 时，错误的表现形式可能有所不同：

#### 流中错误
如果在流式传输开始后发生错误，不会统一回退成标准 JSON 错误体返回，流将终止或流内补发失败事件。

客户端在流式场景下应同时具备：

+ HTTP 状态码判断
+ 事件流完整性判断
+ 业务结束标志判断
+ 流中错误事件解析能力

#### SSE 保活注释
在长时间运行的请求中，您可能会收到如下 SSE 注释：

```plain
: ZENMUX PROCESSING
```

这**不是错误** — 这是每 10 秒发送一次的保活信号，用于防止连接超时。根据 SSE 规范，您的客户端解析器应忽略以 `:` 开头的行。

#### 流中断
如果客户端主动断开连接（如取消请求），服务端将清理进行中的流并释放资源。客户端主动中断不会产生错误响应。

## 错误处理最佳实践

1. **始终根据 `type` 字段进行程序化处理** — `type` 用于代码逻辑判断，`message` 仅用于展示。
2. **对可重试错误实现重试逻辑：**

```plain
可重试：    429、500、502、503、504
不可重试：  400、402、403、404、413、422
```

3. **保存响应头中的 `X-ZenMux-RequestId`** — 联系技术支持时附上此 ID 可加速问题定位。
4. **妥善处理流式响应** — 使用 `stream: true` 时，始终处理不完整响应和连接中断的情况。
5. **使用指数退避重试** — 重试时逐步增加间隔（如 1s → 2s → 4s → 8s），并加入随机抖动以避免"惊群效应"。

## 常见问题

**Q：账户明明有余额，为什么还会收到 402 错误？**

A：请区分 API Key 类型。订阅类 API Key 有独立的配额限制，与账户余额是两套机制。订阅配额耗尽时即使余额充足也会返回 402（`quote_exceeded`）。建议检查：

+ 当前订阅计划的配额使用情况
+ 是否使用了正确类型的 API Key

**Q：同一个请求对某些模型正常，对另一些模型返回 404。**

A：不同订阅计划包含的模型列表不同。当前计划未包含的模型会返回 `model_not_available`。解决方案：

+ 查阅订阅计划的模型清单
+ 升级到包含目标模型的计划
+ 使用 Pay-As-You-Go API Key 按量访问

**Q：偶尔出现 500 错误，是否需要担心？**

A：在分布式系统中偶发的 500 错误属于正常现象。建议：

+ 实现自动重试机制（带指数退避）
+ 如果错误率持续偏高，请联系技术支持

**Q：我的 API Key 有什么样的频率限制？**

A：频率限制取决于您的订阅计划级别。登录 [ZenMux 控制台](https://zenmux.ai/platform) 查看当前计划详情。

**Q：如何知道请求被路由到了哪个上游服务商？**

A：出于安全和抽象层考虑，响应中的服务商信息已被脱敏。如需追踪请求链路，请将响应头中的`X-ZenMux-RequestId` 提供给技术支持团队。

**Q：流式请求中途收到 `ZENMUX PROCESSING` 是什么意思？**

A：这是 SSE 保活注释（以 `:` 开头），每 10 秒发送一次，表示请求仍在处理中。这不是错误，您的 SSE 客户端应按规范自动忽略注释行。
