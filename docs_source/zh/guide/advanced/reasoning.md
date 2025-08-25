# 推理模型

ZenMux 支持在 Create chat completion 接口里通过 reasoning_effort 参数和 reasoning 参数控制模型的推理行为。

## 参数定义

**reasoning_effort**

遵循 OpenAI 协议，可选值有：minimal, low, medium, high。如果不传，默认是 medium。

**reasoning**

reasoning 支持的参数的示例如下：

```json
{
    "reasoning": {
        "effort": "medium",
        "max_tokens": 1024,
        "enabled": true
    }
}
```
:::

**effort**

等价于 reasoning_effort，供仅支持 reasoning_effort 的模型消费。

**max_tokens**

用于限制 reasoning token 长度，供支持 thinking budget 的模型消费。

**enabled**

如果不传，默认是 true，可以用于关闭 reasoning。
:::

## 参数优先级说明

ZenMux 会根据用户传递的参数自动计算/补充模型需要的参数，计算规则如下：

* 如果 reasoning_effort 和 reasoning 都不传

等价于
```json
{
    "reasoning_effort": "medium",
    "reasoning": {
        "effort": "medium"
    }
}
```

* 关于 max_tokens 的计算

当用户指定了 max_completion_tokens 时，或者模型本身有 max_completion_tokens 限制时，会根据 reasoning.effort 计算 reasoning.max_tokens，计算的规则如下：

```
minimal: 5%, low: 20%, medium: 50%, high: 80%
```

* 如果传了 max_tokens 但没有传 effort 时

当用户指定了 max_completion_tokens 时，或者模型本身有 max_completion_tokens 限制时，会根据 max_tokens 计算 effort，计算的规则是 reasoning.max_tokens / max_completion_tokens 得到占比，分别与 minimal: 5%, low: 20%, medium: 50%, high: 80% 比较，取最接近的档位作为 effort。假如 reasoning.max_tokens / max_completion_tokens = 30%，effort 为 low。