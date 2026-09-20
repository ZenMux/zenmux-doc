---
pageClass: api-page
title: Structured Evaluation API (System One)
head:
  - - meta
    - name: description
      content: Evaluate an input state against a set of typed questions and get back structured answers
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, systemone, System One, structured evaluation, classification, scoring, judgment, TypeSafe
---

# Structured Evaluation (System One)

::: tip Troubleshooting
Run into an error? See the [API Error Code Reference](/guide/advanced/error-codes) for a full description of error types and how to resolve them.
:::

```http
POST https://zenmux.ai/api/v1/systemone
```

The System One endpoint evaluates a piece of `state` (the content to evaluate) against a set of typed `questions` that you define, and returns one structured `answer` per question. Answers map back to questions by the keys you choose.

Each question is one of three types:

- **noul**: a yes/no judgment; returns the probability that the answer is yes.
- **choice**: picks one option from a set you define; returns the chosen option and the full probability distribution.
- **score**: rates along a rubric you define; returns a probability-weighted value across the levels.

## Request Headers

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer Token authentication.

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Request content type, defaults to `application/json`.

## Request Parameters

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The model ID to use, in the format `<provider>/<model-name>`, for example `typesafe/jev-latest`.

### state `string, object, or array` <span style="color: #FA6062; font-weight: 400">\*</span>

The content to evaluate. It can be plain text (`string`) or structured data (`object` / `array`), such as a chat log, a business record, or the current state of your application.

### questions `object` <span style="color: #FA6062; font-weight: 400">\*</span>

A map of typed questions. You choose each key, and the returned answers come back under the same keys. The keys are not sent to the underlying model and are not used in inference.

#### questions.\<question-id\> `object` <span style="color: #FA6062; font-weight: 400">\*</span>

A typed question object. All types share `type` and `instructions`; each type adds its own `criteria`.

##### type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The question type, one of `noul`, `choice`, or `score`.

##### instructions `string, object, or array` <span style="color: #FA6062; font-weight: 400">\*</span>

What the model should decide for this question.

##### criteria `object or array` <span style="color: #666; font-weight: 400; font-size: 14px"> depends on type </span>

The evaluation criteria, whose shape depends on `type`:

- `noul` (optional): an `object` describing what a yes and a no mean via `true` / `false`.
- `choice` (required): an `object` mapping each option to its rubric description; use `null` when an option needs no extra detail.
- `score` (required): an ordered `array` describing the levels in order; include at least two levels.

## Response

Returns a JSON object containing the structured answers.

### model `string`

The model that performed the evaluation.

### answers `object`

A map of answers, keyed by the same keys used in the request `questions`, with one answer per question.

#### answers.\<question-id\> `object`

The answer object whose `type` matches its question. `choice` and `score` answers also carry a `confidence` (0 to 1), derived from the answer's probability distribution.

- **noul answer**
  - `type` `string` — always `noul`.
  - `noul` `number` — the yes/no answer on a scale from 0 (no) to 1 (yes).
- **choice answer**
  - `type` `string` — always `choice`.
  - `choice` `string` — the highest-probability option.
  - `probabilities` `object` — every option mapped to its probability (floats that sum to 1).
  - `confidence` `number` — how certain the model is, derived from the probabilities.
- **score answer**
  - `type` `string` — always `score`.
  - `score` `number` — the probability-weighted value across the levels; can land between levels.
  - `legend` `object` — each level number mapped back to its description.
  - `probabilities` `object` — each level (string key) mapped to its probability (floats that sum to 1).
  - `confidence` `number` — how certain the model is, derived from the probabilities.

### usage `object`

Token usage for this request.

- `input_tokens` `integer` — the number of tokens consumed by the input.
- `output_tokens` `integer` — the number of tokens consumed by the output.

::: api-request POST /api/v1/systemone

```cURL
curl https://zenmux.ai/api/v1/systemone \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "typesafe/jev-latest",
    "state": "Help! My payouts have been failing for 3 days.",
    "questions": {
      "is_urgent": {
        "type": "noul",
        "instructions": "Does this convey urgency?"
      },
      "department": {
        "type": "choice",
        "instructions": "Which team should handle this?",
        "criteria": {
          "billing": "Payments, invoicing, refunds",
          "technical": "Bugs, outages, integrations",
          "sales": "Pricing, upgrades, new accounts"
        }
      },
      "frustration": {
        "type": "score",
        "instructions": "How frustrated is the customer?",
        "criteria": ["Calm", "Frustrated", "Very angry"]
      }
    }
  }'
```

```Python
import requests

resp = requests.post(
    "https://zenmux.ai/api/v1/systemone",
    headers={
        "Authorization": "Bearer <your_ZENMUX_API_KEY>",
        "Content-Type": "application/json",
    },
    json={
        "model": "typesafe/jev-latest",
        "state": "Help! My payouts have been failing for 3 days.",
        "questions": {
            "is_urgent": {
                "type": "noul",
                "instructions": "Does this convey urgency?",
            },
            "department": {
                "type": "choice",
                "instructions": "Which team should handle this?",
                "criteria": {
                    "billing": "Payments, invoicing, refunds",
                    "technical": "Bugs, outages, integrations",
                    "sales": "Pricing, upgrades, new accounts",
                },
            },
            "frustration": {
                "type": "score",
                "instructions": "How frustrated is the customer?",
                "criteria": ["Calm", "Frustrated", "Very angry"],
            },
        },
    },
)

print(resp.json())
```

```TypeScript
const resp = await fetch("https://zenmux.ai/api/v1/systemone", {
  method: "POST",
  headers: {
    Authorization: "Bearer <ZENMUX_API_KEY>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "typesafe/jev-latest",
    state: "Help! My payouts have been failing for 3 days.",
    questions: {
      is_urgent: {
        type: "noul",
        instructions: "Does this convey urgency?",
      },
      department: {
        type: "choice",
        instructions: "Which team should handle this?",
        criteria: {
          billing: "Payments, invoicing, refunds",
          technical: "Bugs, outages, integrations",
          sales: "Pricing, upgrades, new accounts",
        },
      },
      frustration: {
        type: "score",
        instructions: "How frustrated is the customer?",
        criteria: ["Calm", "Frustrated", "Very angry"],
      },
    },
  }),
});

console.log(await resp.json());
```

:::

::: api-response

```json
{
  "model": "typesafe/jev-latest",
  "answers": {
    "is_urgent": {
      "type": "noul",
      "noul": 0.92
    },
    "department": {
      "type": "choice",
      "choice": "technical",
      "probabilities": { "billing": 0.08, "technical": 0.85, "sales": 0.07 },
      "confidence": 0.82
    },
    "frustration": {
      "type": "score",
      "score": 1.6,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.05, "1": 0.3, "2": 0.65 },
      "confidence": 0.78
    }
  },
  "usage": { "input_tokens": 312, "output_tokens": 48 }
}
```

:::
