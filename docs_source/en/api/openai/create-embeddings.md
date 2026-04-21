---
pageClass: api-page
title: API
head:
  - - meta
    - name: description
      content: Create Embeddings
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, create, embeddings, OpenAI, vector, text-embedding
---

# Create Embeddings

::: tip 💡 Troubleshooting
Encountering errors during API calls? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting solutions.
:::

```
POST https://zenmux.ai/api/v1/embeddings
```

The Create Embeddings endpoint is compatible with OpenAI's [Create Embeddings](https://platform.openai.com/docs/api-reference/embeddings/create) API, used to convert input text into vector representations (embeddings).

## Request headers

### Authorization `string` <font color="red">Required</font>

Bearer Token authentication

### Content-Type `string` <font color="red">Required</font>

Request content type, defaults to `application/json`

## Request

### input `string or array` <font color="red">Required</font>

The input text to generate embeddings for. Can be a string or an array of strings. To embed multiple inputs in a single request, pass an array of strings.

Supported input types:

- `string` — A text string to be embedded
- `array of strings` — An array of text strings to be embedded
- `array of integers` — An array of token integers to be embedded
- `array of integer arrays` — A 2D array of token integers to be embedded

::: warning Input Limitations
- A single input cannot exceed the model's maximum input token limit (e.g., 8192 tokens for the `text-embedding-3` series)
- Input cannot be an empty string
- Array length cannot exceed 2048
- Total token count across all inputs in a single request cannot exceed 300,000
:::

### model `string` <font color="red">Required</font>

The model ID to use, in the format `<provider>/<model-name>`.

Currently supported embedding model:

- `openai/text-embedding-3-small` — Efficient embedding model with 1536 output dimensions

### encoding_format `string` <font color="gray">Optional</font>

The encoding format for the returned embeddings.

- `float` — Returns as an array of floating-point numbers (default)
- `base64` — Returns as a Base64-encoded string

### dimensions `integer` <font color="gray">Optional</font>

The number of dimensions for the output embeddings. Only supported by `text-embedding-3` and newer models.

By specifying fewer dimensions, you can shorten the embedding vector without significantly losing semantic expressiveness, thereby reducing storage and retrieval costs.

### user `string` <font color="gray">Optional</font>

A unique identifier representing the end user, which can help monitor and detect abuse.

## Response

Returns a JSON object containing a list of embedding vectors.

### object `string`

The object type, always `list`.

### data `array`

An array of embedding objects, each corresponding to the embedding result of an input text.

---

#### data object

##### object `string`

The object type, always `embedding`.

##### embedding `array of float`

The embedding vector, consisting of a list of floating-point numbers. The vector length depends on the model used and the `dimensions` parameter.

##### index `integer`

The index position of this embedding in the input list.

---

### model `string`

The name of the model used to generate the embeddings.

### usage `object`

Token usage information for this request.

- `prompt_tokens` `integer` — Number of tokens consumed by the input
- `total_tokens` `integer` — Total number of tokens consumed

::: api-request POST /api/v1/embeddings

```TypeScript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://zenmux.ai/api/v1', // [!code highlight]
  apiKey: '<ZENMUX_API_KEY>', // [!code highlight]
});

async function main() {
  const embedding = await openai.embeddings.create({
    model: "openai/text-embedding-3-small",
    input: "ZenMux is an LLM API aggregation service.",
    encoding_format: "float",
  });

  console.log(embedding.data[0].embedding);
}

main();
```

```Python
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",  # [!code highlight]
    api_key="<your_ZENMUX_API_KEY>",  # [!code highlight]
)

embedding = client.embeddings.create(
    model="openai/text-embedding-3-small",
    input="ZenMux is an LLM API aggregation service.",
    encoding_format="float",
)

print(embedding.data[0].embedding)
```

```cURL
curl https://zenmux.ai/api/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "openai/text-embedding-3-small",
    "input": "ZenMux is an LLM API aggregation service.",
    "encoding_format": "float"
  }'
```

:::

::: api-response

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "embedding": [
        0.0023064255,
        -0.009327292,
        -0.0028842222,
        0.018182484,
        -0.012395813,
        0.0073498537,
        -0.020456877,
        0.0118837105,
        0.015375832,
        -0.0036487724
      ],
      "index": 0
    }
  ],
  "model": "openai/text-embedding-3-small",
  "usage": {
    "prompt_tokens": 9,
    "total_tokens": 9
  }
}
```

:::
