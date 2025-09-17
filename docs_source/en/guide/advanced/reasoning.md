# Reasoning Models

ZenMux supports controlling a model’s reasoning behavior in the Create chat completion API via the reasoning_effort and reasoning parameters.

## Parameter Definitions

**reasoning_effort**

Follows the OpenAI spec. Allowed values: low, medium, high. If omitted, the default is medium. For OpenAI models, minimal is also accepted.

**reasoning**

An example of supported parameters for reasoning is as follows:

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

Equivalent to reasoning_effort; used for models that only support reasoning_effort.

**max_tokens**

Used to cap the reasoning token length; for models that support a thinking budget.

**enabled**

If omitted, the default is true; can be used to disable reasoning.
:::

## Parameter Priority

ZenMux automatically derives/supplements the parameters required by the model based on what the user provides. The rules are as follows:

* If neither reasoning_effort nor reasoning is provided

Equivalent to:
```json
{
    "reasoning_effort": "medium",
    "reasoning": {
        "effort": "medium"
    }
}
```

* Computing max_tokens

When the user specifies max_completion_tokens, or the model itself has a max_completion_tokens limit, reasoning.max_tokens is computed based on reasoning.effort using the following rules:

```
low: 20%, medium: 50%, high: 80%
```

* If max_tokens is provided but effort is not

When the user specifies max_completion_tokens, or the model itself has a max_completion_tokens limit, effort is computed from max_tokens. The rule is to take the ratio reasoning.max_tokens / max_completion_tokens, compare it with low: 20%, medium: 50%, high: 80%, and choose the closest tier as effort. For example, if reasoning.max_tokens / max_completion_tokens = 30%, the effort is low.