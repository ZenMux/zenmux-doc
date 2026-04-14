---
head:
  - - meta
    - name: description
      content: API Error Codes Reference
  - - meta
    - name: keywords
      content: Zenmux, guide, error codes, API, troubleshooting
---

# API Error Codes Reference

This document describes all possible error responses returned by ZenMux platform APIs, including root causes and troubleshooting steps.

## Error Response Format

All errors follow a unified JSON structure:

```json
{
  "error": {
    "code": "429",
    "type": "rate_limit",
    "message": "Rate limit exceeded"
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `code` | string | HTTP status code (as a string) |
| `type` | string | Error type |
| `message` | string | Error description |


## Error Quick Reference

| HTTP Status | Error Type | Description |
| --- | --- | --- |
| 400 | `invalid_params` | Invalid request parameters |
| 402 | `insufficient_credit` | Account overdue |
| 402 | `reject_no_credit` | Insufficient balance |
| 402 | `quote_exceeded` | Subscription quota exhausted |
| 403 | `access_denied` | Invalid or missing API Key |
| 403 | `safety_check_failed` | Upstream safety policy triggered |
| 404 | `model_not_available` | Model not included in current subscription plan |
| 404 | `invalid_model` | Model does not exist |
| 404 | `model_not_supported` | Model does not support this API |
| 413 | `invalid_params` | Prompt too long |
| 422 | `provider_unprocessable_entity_error` | Upstream cannot process the request |
| 429 | `rate_limit` | Rate limit exceeded |
| 500 | `internal_server_error` | Platform internal error |
| 500 | `provider_api_error` | Upstream provider API returned an error |
| 500 | `provider_error` | Upstream provider service error |
| 502 | `no_provider_available` | No upstream provider available |
| 520 | `provider_internal_server_error` | Unable to communicate with provider |
| 524 | `provider_internal_server_error` | Provider timed out |


## Detailed Error Descriptions

### Authentication & Authorization Errors

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

**Cause:** The API Key provided in the request is invalid, expired, or missing.

**Troubleshooting:**

1. Verify that the API Key is correctly passed via the `Authorization: Bearer <key>`, `x-api-key`, or `x-goog-api-key` header.
2. Log in to the [ZenMux Console](https://zenmux.ai/platform) to confirm that the API Key has not been revoked or expired.
3. Ensure there are no extra spaces or line breaks when copying the API Key.

#### HTTP 403 — `safety_check_failed`
Indicates that the input content was blocked by an upstream safety policy.

**Troubleshooting:**

1. Adjust the prompt, images, files, or tool input content.
2. Reduce descriptions that may trigger safety rules.
3. Switch to a different model if necessary.

### Parameter Validation Errors

#### HTTP 400 — `invalid_params`
Returned when request parameters fail validation. Specific scenarios are listed below:

| Error Message | Cause | Solution |
| --- | --- | --- |
| `Parameter model is required` | Missing or empty `model` field | Add a valid `model` value to the request body |
| `Model {model} is not valid` | Specified model identifier does not exist | Refer to the [model list](https://zenmux.ai/models) for valid model names |
| `Parameter messages is required` | Missing `messages` field | Include a `messages` array in the request body |
| `Parameter messages can not be empty` | `messages` is an empty array | Provide at least one message |
| `Parameter messages can not contain null elements` | `messages` contains `null` elements | Remove null items from the messages array |
| `Parameter messages can not contain elements without content` | Message object is missing the `content` field | Ensure every message includes a `content` value |
| `Parameter stream_options is not supported while stream is false` | `stream_options` is set but `stream` is `false` or unset | Set `stream: true` or remove `stream_options` |
| `Parameter n grater than 1 is not supported` | `n` value is greater than 1 | Set `n` to 1 or omit the parameter |
| `Parameter temperature is not valid` | `temperature` is negative | Use a `temperature` value ≥ 0 |
| `Parameter stream_options.include_usage conflict with usage.include` | `stream_options.include_usage` conflicts with `usage.include` | Use only one of the two parameters |
| `Parameter include_reasoning conflict with reasoning.exclude` | `include_reasoning` conflicts with `reasoning.exclude` | Use only one of the two parameters |
| `Parameter type of provider.routing is not valid` | Invalid provider routing type | Refer to the Provider Routing documentation |
| `Parameter providers of provider.routing is not valid` | Provider routing list is empty | Specify at least one provider |


#### HTTP 413 — `invalid_params` (Prompt Too Long)
```json
{
  "error": {
    "code": "413",
    "type": "invalid_params",
    "message": "Prompt is too long"
  }
}
```

**Cause:** The request body (including all messages) exceeds the model's maximum context length.

**Troubleshooting:**

1. Reduce the number or length of messages in the `messages` array.
2. Consider using a model that supports a larger context window.
3. Summarize earlier conversation turns instead of including the full history.

#### HTTP 422 — `provider_unprocessable_entity_error`
**Cause:** The request passed platform-side validation, but the upstream model provider was unable to process it. This typically occurs when the upstream provider has stricter requirements for field structure, tools, formatted output, or multimodal inputs.

**Troubleshooting:**

1. Review the specific description in the `message` field of the response.
2. Check that all parameters are compatible with the selected model.
3. Remove optional/advanced parameters and retry with a minimal request.

### Billing & Subscription Errors

#### HTTP 402 — `insufficient_credit` (Account Overdue)
```json
{
  "error": {
    "code": "402",
    "type": "insufficient_credit",
    "message": "Account overdue. To prevent abuse, a non-negative balance is required for all models (including free tiers)."
  }
}
```

**Cause:** The account balance is negative (overdue).

**Troubleshooting:**

1. Go to the [ZenMux Billing page](https://zenmux.ai/platform) to top up your balance.

#### HTTP 402 — `reject_no_credit` (Insufficient Balance)
```json
{
  "error": {
    "code": "402",
    "type": "reject_no_credit",
    "message": "Credit required. To prevent abuse, a positive balance is required for this model."
  }
}
```

**Cause:** The account balance is zero or extremely low, and the requested model requires a positive balance.

**Troubleshooting:**

1. Top up your account balance.
2. Switch to a model or plan that allows low-balance access.

#### HTTP 402 — `quote_exceeded` (Subscription Quota Exhausted)
```json
{
  "error": {
    "code": "402",
    "type": "quote_exceeded",
    "message": "You have reached your subscription quota limit. Please wait for automatic quota refresh in the rolling time window, upgrade to a higher plan, or use a Pay-As-You-Go API Key for unlimited access. Learn more: https://zenmux.ai/docs/guide/subscription.html"
  }
}
```

**Cause:** The quota included in your current subscription plan has been exhausted.

**Solutions:**

1. **Wait for refresh** — Quotas automatically replenish within the rolling time window.
2. **Upgrade your plan** — Switch to a higher-tier subscription for a larger quota.
3. **Pay-As-You-Go** — Create a Pay-As-You-Go API Key for unlimited usage (billed per token).

### Model Availability Errors

#### HTTP 404 — `model_not_available` (Model Not in Subscription Plan)
```json
{
  "error": {
    "code": "404",
    "type": "model_not_available",
    "message": "The requested model is not included in your subscription plan. Please create a Pay-As-You-Go API Key to access this model, or check available models for your plan at https://zenmux.ai/docs/guide/subscription.html"
  }
}
```

**Cause:** The requested model exists but is not included in your current subscription plan.

**Troubleshooting:**

1. Check the [Subscription Guide](https://zenmux.ai/docs/guide/subscription.html) to confirm which models are supported by your current plan.
2. Upgrade your subscription plan to include the target model.
3. Use a Pay-As-You-Go API Key to access models outside your plan.

#### HTTP 404 — `invalid_model` (Model Does Not Exist)
**Cause:** The specified model identifier does not match any known model.

**Troubleshooting:**

1. Check for typos in the model name.
2. Refer to the [model list](https://zenmux.ai/models) for valid model identifiers.

#### HTTP 404 — `model_not_supported` (Model Does Not Support This API)
**Cause:** The model exists but does not support the API being called.

**Troubleshooting:**

1. Check the model's detail page to confirm which APIs it supports.
2. Switch to a model that supports the current API.

### Rate Limiting Errors

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

**Cause:** The request rate has exceeded the allowed limit. This may originate from platform-level rate limiting or upstream provider rate limiting.

**Troubleshooting:**

1. **Reduce request frequency** — Add delays between requests or use an exponential backoff strategy.
2. **Spread peak traffic** — Distribute calls more evenly over time.

### Server & Upstream Errors

#### HTTP 500 — `internal_server_error` (Platform Internal Error)
**Cause:** An unexpected server error occurred, possibly due to:

+ A transient platform failure.
+ An upstream error being consolidated into an internal error by the platform.

**Troubleshooting:**

1. **Retry with backoff** — Most 500 errors are transient and can be resolved with exponential backoff retries.
2. If the issue persists, contact support with the `X-ZenMux-RequestId` from the response headers.

#### HTTP 500 — `provider_error` / `provider_api_error`
**Cause:** The request reached the upstream provider, and the issue most likely originated on the provider's side.

**Troubleshooting:**

1. **Retry with backoff**
2. If the issue persists, contact support with the `X-ZenMux-RequestId` from the response headers.

#### HTTP 502 — `no_provider_available` — No Upstream Provider Available
**Cause:** No upstream provider is currently available to handle the request, possibly due to:

+ The specified provider does not exist.
+ All configured upstream providers for this model are experiencing failures.
+ All providers failed after multiple retries.

**Troubleshooting:**

1. Relax or remove provider-specific routing rules.
2. Wait briefly and retry.

### Streaming Request Edge Cases

When using `stream: true`, errors may manifest differently:

#### Errors During Streaming
If an error occurs after streaming has started, it will not fall back to a standard JSON error body. Instead, the stream will terminate or emit a failure event within the stream.

Clients should handle the following in streaming scenarios:

+ HTTP status code evaluation
+ Event stream completeness checks
+ Business-level end markers
+ In-stream error event parsing

#### SSE Keep-Alive Comments
During long-running requests, you may receive SSE comments like:

```plain
: ZENMUX PROCESSING
```

This is **not an error** — it is a keep-alive signal sent every 10 seconds to prevent connection timeouts. Per the SSE specification, your client parser should ignore lines starting with `:`.

#### Stream Disconnection
If the client disconnects voluntarily (e.g., cancels the request), the server will clean up the in-progress stream and release resources. Client-initiated disconnections do not produce error responses.

## Error Handling Best Practices

1. **Always handle errors programmatically based on the `type` field** — Use `type` for code logic; `message` is for display only.
2. **Implement retry logic for retryable errors:**

```plain
Retryable:      429, 500, 502, 503, 504
Non-retryable:  400, 402, 403, 404, 413, 422
```

3. **Save the `X-ZenMux-RequestId` from response headers** — Including this ID when contacting support helps expedite issue resolution.
4. **Handle streaming responses gracefully** — When using `stream: true`, always handle incomplete responses and connection interruptions.
5. **Use exponential backoff for retries** — Gradually increase the interval between retries (e.g., 1s → 2s → 4s → 8s), and add random jitter to avoid the "thundering herd" effect.

## FAQ

**Q: I have a positive balance, so why am I getting a 402 error?**

A: Check your API Key type. Subscription API Keys have independent quota limits that are separate from your account balance. When subscription quotas are exhausted, a 402 (`quote_exceeded`) error is returned even if your balance is sufficient. Check:

+ Your current subscription plan's quota usage
+ Whether you are using the correct API Key type

**Q: The same request works for some models but returns 404 for others.**

A: Different subscription plans include different model lists. Models not included in your current plan will return `model_not_available`. Solutions:

+ Review the model list for your subscription plan
+ Upgrade to a plan that includes the target model
+ Use a Pay-As-You-Go API Key for on-demand access

**Q: I occasionally see 500 errors. Should I be concerned?**

A: Occasional 500 errors are normal in distributed systems. We recommend:

+ Implementing automatic retry mechanisms (with exponential backoff)
+ Contacting support if the error rate remains consistently high

**Q: What rate limits apply to my API Key?**

A: Rate limits depend on your subscription plan tier. Log in to the [ZenMux Console](https://zenmux.ai/platform) to view your current plan details.

**Q: How can I tell which upstream provider handled my request?**

A: For security and abstraction purposes, provider information in responses is anonymized. If you need to trace the request path, provide the `X-ZenMux-RequestId` from the response headers to the support team.

**Q: What does `ZENMUX PROCESSING` mean during a streaming request?**

A: This is an SSE keep-alive comment (prefixed with `:`), sent every 10 seconds to indicate the request is still being processed. It is not an error — your SSE client should automatically ignore comment lines per the specification.
