# Reasoning Models

ZenMux allows you to control model reasoning behavior in the Create chat completion endpoint via the reasoning_effort parameter and the reasoning parameter.

## Parameter Definitions

**reasoning_effort**

Follows the OpenAI protocol. Allowed values: minimal, low, medium, high. If omitted, the default is medium.

**reasoning**

An example of supported parameters in reasoning:

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

Equivalent to reasoning_effort, for consumption by models that only support reasoning_effort.

**max_tokens**

Used to limit the length of reasoning tokens, for consumption by models that support a thinking budget.

**enabled**

If omitted, the default is true. Can be used to disable reasoning.
:::

## Parameter Precedence

ZenMux automatically computes/fills in the parameters required by the model based on what you pass. The rules are:

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

* About computing max_tokens

When the user specifies max_completion_tokens, or the model itself has a max_completion_tokens limit, reasoning.max_tokens will be computed based on reasoning.effort. The rules are:

```
minimal: 5%, low: 20%, medium: 50%, high: 80%
```

* If max_tokens is provided but effort is not

When the user specifies max_completion_tokens, or the model itself has a max_completion_tokens limit, effort will be inferred from max_tokens. The rule is to compute reasoning.max_tokens / max_completion_tokens to obtain the ratio, compare it against minimal: 5%, low: 20%, medium: 50%, high: 80%, and select the closest tier as effort. For example, if reasoning.max_tokens / max_completion_tokens = 30%, effort is low.