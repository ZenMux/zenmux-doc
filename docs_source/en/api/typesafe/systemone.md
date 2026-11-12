---
pageClass: api-page
requestVariants:
  - id: json
    label: application/json
    example: application/json
  - id: multipart
    label: multipart/form-data
    example: multipart/form-data
title: Structured Evaluation API (System One)
head:
  - - meta
    - name: description
      content: Evaluate text, structured data, and uploaded images with System One to receive Noul, Choice, Score, or Box answers.
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, systemone, System One, structured evaluation, TypeSafe, multipart/form-data, image upload, Box
---

# Structured Evaluation (System One)

::: tip Troubleshooting
Run into an error? See the [API Error Code Reference](/guide/advanced/error-codes) for a full description of error types and how to resolve them.
:::

```http
POST https://zenmux.ai/api/v1/systemone
```

The System One endpoint evaluates a piece of `state` (the content to evaluate) against a set of typed `questions` that you define, and returns one structured `answer` per question. Answers map back to questions by the keys you choose.

The semantics of `state`, `questions`, and `assets` follow the [TypeSafe System One API](https://docs.typesafe.ai/api/system-one). When calling through ZenMux, use the endpoint above, a ZenMux API key, and a ZenMux model ID.

Each question is one of four types, and you can mix them in the same request:

- **noul**: a yes/no judgment; returns the probability that the answer is yes.
- **choice**: picks one option from a set you define; returns the chosen option and the full probability distribution.
- **score**: rates along a rubric you define; returns a probability-weighted value across the levels.
- **box**: locates one target in an image and returns its bounding box coordinates.

Use `application/json` for text and structured data. To upload images, use `multipart/form-data`, with the JSON parameters in a `request` part and each image in a separate file part.

## Request Headers

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer Token authentication, in the form `Bearer $ZENMUX_API_KEY`.

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Use `application/json` for text requests and `multipart/form-data; boundary=...` for image uploads.

## Request Parameters

<ApiRequestBody v-slot="{ variant }">

<div v-show="variant === 'json'" data-request-variant="json">

Send these parameters directly in a JSON request body to evaluate text or structured data. To upload images, select **multipart/form-data**.

</div>

<div v-show="variant === 'multipart'" data-request-variant="multipart">

Send the complete JSON as the first part, named `request`, followed by the image files. Do not send `model`, `state`, or `questions` as separate form fields.

### request `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The serialized JSON parameters, including `model`, `state`, `questions`, and `assets`. This must be the first form part, with its own Content-Type set to `application/json`.

</div>

<details class="request-fields" :class="{ 'is-nested': variant === 'multipart' }" :open="variant === 'json'">
<summary v-show="variant === 'multipart'">Show JSON parameters inside request</summary>

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The model ID to use, in the format `<provider>/<model-name>`, for example `typesafe/jev-latest`.

### state `string, object, or array` <span style="color: #FA6062; font-weight: 400">\*</span>

The content to evaluate. It can be plain text (`string`) or structured data (`object` / `array`), such as a chat log, a business record, or the current state of your application.

<div v-show="variant === 'multipart'" data-request-variant="multipart">

For images, use an `assets` reference key in a string value. For example, `"state": {"photo": "<image-reference>"}` links to the uploaded file through `assets`.

</div>

### questions `object` <span style="color: #FA6062; font-weight: 400">\*</span>

A non-empty map of typed questions. You choose each key, and the returned answers come back under the same keys. The keys are not sent to the underlying model and are not used in inference.

#### questions.\<question-id\> `object` <span style="color: #FA6062; font-weight: 400">\*</span>

A typed question object. Use `type` to select the question type and `instructions` to describe the task. The requirements for `criteria` depend on the type.

##### type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The question type, one of `noul`, `choice`, `score`, or `box`.

##### instructions `string, object, or array` <span style="color: #FA6062; font-weight: 400">\*</span>

What the model should decide for this question.

<div v-show="variant === 'multipart'" data-request-variant="multipart">

For Box, name the target and the image in `instructions`, for example ``the red rectangle in `photo` ``. In a request with several images, distinguish them by field path, such as ``the person in `frames[0].photo` ``.

</div>

##### criteria `object or array` <span style="color: #666; font-weight: 400; font-size: 14px"> depends on type </span>

The evaluation criteria, whose shape depends on `type`:

- `noul` (optional): an `object` describing what a yes and a no mean via `true` / `false`.
- `choice` (required): an `object` mapping each option to its rubric description; use `null` when an option needs no extra detail.
- `score` (required): an ordered `array` describing the levels in order; include at least two levels.
- `box`: does not use `criteria`.

<div v-show="variant === 'multipart'" data-request-variant="multipart">

### assets `object` <span style="color: #666; font-weight: 400; font-size: 14px"> for image requests </span>

A map of image assets, keyed by reference string. Use a UUID for each image. References can appear in `state`, question `instructions`, or `criteria`, as a whole string or within a longer string. Object keys are not replaced.

#### assets.\<reference\>.type `string`

The asset type. Set it to `image`.

#### assets.\<reference\>.part `string`

The file part name for this image. It must exactly match the form-data field used to upload the image, such as `photo-file`. This name and the reference key in `assets` are two different identifiers.

Every asset must be referenced in a string value in `state`, `instructions`, or `criteria`. Upload an image once and reuse its reference key wherever needed. References are matched as text, so avoid short words such as `cat` that could accidentally match other content.

</div>

</details>

<div v-show="variant === 'multipart'" data-request-variant="multipart">

### \<image-part\> `file` <span style="color: #666; font-weight: 400; font-size: 14px"> image file </span>

A PNG or JPEG image, with one part per file. The field name is specified by `assets.<reference>.part`, such as `photo-file`. Each file part must correspond to exactly one asset.

Prefer a Content-Type of `image/png` or `image/jpeg`. Place image parts after `request`.

With cURL `-F`, Python `requests` with `files`, or JavaScript `FormData`, let the client generate the outer Content-Type and boundary. Explicitly set the Content-Type of the `request` part itself to `application/json`.

For form-data requests through ZenMux, you do not need to set `TypeSafe-Danger-Zone-Images: true` yourself. ZenMux adds it to the request sent to TypeSafe.

::: info Images and Box
TypeSafe currently labels images and Box as experimental (Dreamer-ready). Formats, limits, and accuracy may change as the upstream service evolves. Box requires a vision model that supports it; the image examples below use `typesafe/jev-1.14`.
:::

### Form-data Upload Rules

- Part names must be unique, non-empty, and contain no control characters. `request` is reserved for the JSON part.
- Each image part must be referenced by exactly one asset's `part`. Missing files, unreferenced file parts, or multiple assets pointing to the same part return `400`.
- Image parts also accept `image/jpg`, `application/octet-stream`, or no Content-Type. The actual file must still be PNG or JPEG.
- Compressed multipart requests are currently unsupported. Do not set a compression encoding such as `Content-Encoding: gzip`; it returns `415`.

### Image and Request Size Limits

The following limits come from the [TypeSafe image specification](https://docs.typesafe.ai/images#limits). ZenMux checks individual upload sizes and the full multipart request body size. TypeSafe validates image decoding, dimensions, reference expansion, and other upstream limits.

| Item | Limit |
| --- | --- |
| Image format | Still PNG or JPEG; animated PNG is unsupported |
| Each image file | Up to 16 MiB |
| Width and height | 280–1568 pixels each |
| Total pixels | 78,400–2,458,624 |
| Full request body | Up to 32 MiB, including JSON, files, multipart boundaries, and part headers; excludes outer HTTP headers |
| All distinct images after upstream processing | Up to 32 MiB combined; re-encoding may make them larger than the uploaded files |
| Expanded request | Up to 32 MiB for text, questions, structure, and images combined; every use of an image reference counts |
| Image reference keys | Up to 1,024 bytes each and 65,536 bytes combined, measured in UTF-8; cannot be empty or whitespace-only |

1 MiB = 1,048,576 bytes. Ranges include both endpoints. The upstream service does not resize images to fit these limits. Resize before uploading and rotate the pixels upright rather than relying only on EXIF orientation. If any image is rejected, the whole request fails.

When several questions use the same image, reference it once in `state` and use its field path in the questions to reduce repeated expansion and input token usage.

::: warning Current limitation
32 MiB is the request body size ceiling. Requests with large amounts of `state` text or structured data may currently fail due to memory limits even below this ceiling. Reduce the content or split the request. A successful request consisting mostly of images does not guarantee that every 32 MiB request composition will succeed.
:::

</div>

</ApiRequestBody>

## Response

Returns a JSON object containing the structured answers.

### model `string`

The model that performed the evaluation.

### answers `object`

A map of answers, keyed by the same keys used in the request `questions`, with one answer per question.

#### answers.\<question-id\> `object`

The answer object whose `type` matches its question. The `confidence` (0 to 1) for `choice` and `score` is derived from the answer's probability distribution. Box confidence describes how certain the model is about the location.

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
- **box answer**
  - `type` `string` — always `box`.
  - `box` `object` — contains `top`, `bottom`, `left`, and `right`, each a normalized coordinate from 0 to 1.
  - `confidence` `number | null` — confidence in the location, from 0 to 1; `null` when the model does not provide it.

Coordinates start at the top-left corner. `top` and `bottom` are fractions of image height; `left` and `right` are fractions of image width. To convert to pixels, multiply horizontal coordinates by the width and vertical coordinates by the height.

Each Box question returns one box. **Box returns coordinates even when the target is absent; there is no dedicated "not found" result.** Ask a companion Noul question to check whether the target is present, and ignore the box when that probability is low. A returned box alone does not establish that the target exists. Tune confidence thresholds on your own images.

### usage `object`

Token usage for this request.

- `input_tokens` `integer` — the number of tokens consumed by the input.
- `output_tokens` `integer` — the number of tokens consumed by the output.

Image usage is included in `input_tokens`. Refer to the model's pricing in the [ZenMux model catalog](https://zenmux.ai/models).

## Examples

The examples cover JSON text requests and image uploads. The image example follows TypeSafe's `request` + file part structure and asks both Noul and Box questions. Prepare a `photo.png` containing a red rectangle within the image limits above, and set the `ZENMUX_API_KEY` environment variable. The TypeScript image example uses `fetch`, `FormData`, and `Blob` in Node.js 20+; Python uses `requests`. Response values are illustrative and will vary.

::: api-request POST /api/v1/systemone

```cURL [application/json | Evaluate text with JSON]
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

```Python [application/json | Evaluate text with JSON]
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

```TypeScript [application/json | Evaluate text with JSON]
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


```json [application/json | Evaluate text with JSON]
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

```cURL [multipart/form-data | Upload an image and locate a target]
curl https://zenmux.ai/api/v1/systemone \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -F 'request={
  "model": "typesafe/jev-1.14",
  "state": {
    "photo": "0b719304-319a-4f83-a84e-55a9fb3e16b8"
  },
  "assets": {
    "0b719304-319a-4f83-a84e-55a9fb3e16b8": {
      "type": "image",
      "part": "photo-file"
    }
  },
  "questions": {
    "has_red_rectangle": {
      "type": "noul",
      "instructions": "Does the image in `photo` contain a red rectangle?"
    },
    "red_rectangle_location": {
      "type": "box",
      "instructions": "the red rectangle in `photo`"
    }
  }
};type=application/json' \
  -F 'photo-file=@photo.png;type=image/png'
```

```Python [multipart/form-data | Upload an image and locate a target]
import json
import os

import requests

body = {
  "model": "typesafe/jev-1.14",
  "state": {
    "photo": "0b719304-319a-4f83-a84e-55a9fb3e16b8"
  },
  "assets": {
    "0b719304-319a-4f83-a84e-55a9fb3e16b8": {
      "type": "image",
      "part": "photo-file"
    }
  },
  "questions": {
    "has_red_rectangle": {
      "type": "noul",
      "instructions": "Does the image in `photo` contain a red rectangle?"
    },
    "red_rectangle_location": {
      "type": "box",
      "instructions": "the red rectangle in `photo`"
    }
  }
}

with open("photo.png", "rb") as image:
    resp = requests.post(
        "https://zenmux.ai/api/v1/systemone",
        headers={"Authorization": f"Bearer {os.environ['ZENMUX_API_KEY']}"},
        files=[
            ("request", (None, json.dumps(body), "application/json")),
            ("photo-file", ("photo.png", image, "image/png")),
        ],
        timeout=60,
    )

resp.raise_for_status()
print(resp.json())
```

```TypeScript [multipart/form-data | Upload an image and locate a target]
import { readFile } from "node:fs/promises";

const body = {
  "model": "typesafe/jev-1.14",
  "state": {
    "photo": "0b719304-319a-4f83-a84e-55a9fb3e16b8"
  },
  "assets": {
    "0b719304-319a-4f83-a84e-55a9fb3e16b8": {
      "type": "image",
      "part": "photo-file"
    }
  },
  "questions": {
    "has_red_rectangle": {
      "type": "noul",
      "instructions": "Does the image in `photo` contain a red rectangle?"
    },
    "red_rectangle_location": {
      "type": "box",
      "instructions": "the red rectangle in `photo`"
    }
  }
};

const form = new FormData();
form.append(
  "request",
  new Blob([JSON.stringify(body)], { type: "application/json" }),
  "request.json",
);
form.append(
  "photo-file",
  new Blob([await readFile("photo.png")], { type: "image/png" }),
  "photo.png",
);

const resp = await fetch("https://zenmux.ai/api/v1/systemone", {
  method: "POST",
  headers: { Authorization: `Bearer ${process.env.ZENMUX_API_KEY}` },
  body: form,
});

if (!resp.ok) {
  throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
}
console.log(await resp.json());
```

```json [multipart/form-data | Upload an image and locate a target]
{
  "model": "typesafe/jev-1.14",
  "answers": {
    "has_red_rectangle": {
      "type": "noul",
      "noul": 0.98
    },
    "red_rectangle_location": {
      "type": "box",
      "box": {
        "top": 0.26,
        "bottom": 0.74,
        "left": 0.22,
        "right": 0.78
      },
      "confidence": 0.94
    }
  },
  "usage": {
    "input_tokens": 1162,
    "output_tokens": 40
  }
}
```

:::
