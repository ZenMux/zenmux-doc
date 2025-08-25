# Reasoning Models

ZenMux supports controlling model reasoning behavior through the `reasoning_effort` parameter and `reasoning` parameter in the Create chat completion interface.

## Parameter Definitions

**reasoning_effort**

Follows the OpenAI protocol, with optional values: minimal, low, medium, high. If not provided, the default is medium.

**reasoning**

Example of parameters supported by reasoning:

```json
{
    "reasoning": {
        "effort": "medium",
        "max_tokens": 1024,
        "enabled": true
    }
}
```

**effort**

Equivalent to reasoning_effort, consumed by models that only support reasoning_effort.

**max_tokens**

Used to limit reasoning token length, consumed by models that support thinking budget.

**enabled**

If not provided, defaults to true, can be used to disable reasoning.

## Parameter Priority Rules

ZenMux automatically calculates/supplements the parameters needed by the model based on user-provided parameters, with the following calculation rules:

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

* About max_tokens calculation

When the user specifies max_completion_tokens, or when the model itself has max_completion_tokens limitations, reasoning.max_tokens will be calculated based on reasoning.effort, with the following calculation rules:

```
minimal: 5%, low: 20%, medium: 50%, high: 80%
```

* If max_tokens is provided but effort is not

When the user specifies max_completion_tokens, or when the model itself has max_completion_tokens limitations, effort will be calculated based on max_tokens. The calculation rule is reasoning.max_tokens / max_completion_tokens to get the ratio, which is then compared with minimal: 5%, low: 20%, medium: 50%, high: 80%, and the closest tier is selected as the effort. For example, if reasoning.max_tokens / max_completion_tokens = 30%, the effort would be low.