# 模型路由

ZenMux支持特殊的model ID来智能的选择模型，示例:

::: code-group

```json [请求示例]
{
  "model": "zenmux/auto",
  "model_routing_config": {
    "available_models": [
      "qwen/qwen3-235b-a22b-thinking-2507",
      "openai/gpt-5",
      "google/gemini-2.5-flash-lite",
      "anthropic/claude-4-sonnet"
    ],
    "preference": "balanced"
  },
  ... // 其他参数
}
```

## zenmux/auto

通过将`model`设置成特殊的`zenmux/auto`, 系统将根据提示词智能选择一个合适的高质量的模型。    
## model_routing_config参数

为了让智能路由能够选出更合适的模型，需要通过`model_routing_config`指定相关信息，包括

### available_models

通过`awailable_models`指定智能路由可以选择的模型列表。

### preference

通过`preference`指定模型智能选择时的偏好，包括`performance`(性能优先)、`price`(价格优先)、`balanced`(均衡模式)，默认`balanced`.
