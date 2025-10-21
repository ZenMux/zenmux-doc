# 模型兜底机制

您可以通过`provider`中的`fallback`指定当其他供应商的模型都失败时，作为兜底模型。示例:

::: code-group

```json [请求示例]
{
  "model": "anthropic/claude-sonnet-4",
  "messages": [...],
  "provider": { // [!code highlight]
    "routing": { // [!code highlight]
      "type": "priority",
      "primary_factor": "price"
    },
    "fallback": "google/gemini-2.5-flash-lite"
  }
}
```
