---
pageClass: api-page
title: OpenAI Embeddings API
head:
  - - meta
    - name: description
      content: Create an Embedding
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, create, embeddings, OpenAI, vector, text-embedding
---

# Create an Embedding

::: tip Troubleshooting
Encountering errors during API calls? See the [API Error Codes Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting solutions.
:::

```http
POST https://zenmux.ai/api/v1/embeddings
```

The Create an Embedding endpoint is compatible with OpenAI's [Create an Embedding](https://platform.openai.com/docs/api-reference/embeddings/create) API and converts inputs into vector representations (embeddings).

## Request headers

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer Token authentication

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Request content type, defaults to `application/json`

## Request

### input `string or array or object` <span style="color: #FA6062; font-weight: 400">\*</span>

The input to embed. To embed multiple pieces of text separately in a single request, pass an array of strings.

Supported input types:

- `string` — A text string to be embedded
- `array of strings` — An array of text strings to be embedded
- `array of integers` — An array of token integers to be embedded
- `array of integer arrays` — A 2D array of token integers to be embedded

- `object` — A multimodal input object containing a `content` array

::: warning Input Limitations

- A single input cannot exceed the model's maximum input token limit (e.g., 8192 tokens for the `text-embedding-3` series)
- Input cannot be an empty string
- Array length cannot exceed 2048
- Total token count across all inputs in a single request cannot exceed 300,000
:::

#### Multimodal input

Set `input` to an object with a `content` array containing at least one part. Each part has a `type` field. You can combine different part types in the same array. Supported modalities, formats, and size limits depend on the selected model.

| `type`        | Required field                                      | Optional field                                      |
| ------------- | --------------------------------------------------- | --------------------------------------------------- |
| `text`        | `text`, a non-empty text string                     |                                                     |
| `image_url`   | `image_url.url`, an image URL or Base64 data URL    |                                                     |
| `input_audio` | `input_audio.data`, an audio URL or Base64 data URL | `input_audio.format`, a format string such as `mp3` |
| `input_video` | `input_video.data`, a video URL or Base64 data URL  | `input_video.format`, a format string such as `mp4` |
| `input_file`  | `input_file.data`, a file URL or Base64 data URL    | `input_file.format`, a format string such as `pdf`  |

All required fields in the table take non-empty strings. For inline media, use a Base64 data URL with a MIME type, such as `data:audio/mpeg;base64,…`.

This request body combines text and an image with `google/gemini-embedding-2`. Before sending the request, replace the example image URL with an actual address or the image's Base64 data URL.

```json
{
  "model": "google/gemini-embedding-2",
  "input": {
    "content": [
      { "type": "text", "text": "A mountain lake at sunset" },
      {
        "type": "image_url",
        "image_url": { "url": "https://example.com/lake.jpg" }
      }
    ]
  }
}
```

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The model ID to use, in the format `<provider>/<model-name>`.

Example embedding models:

- `openai/text-embedding-3-large` — High-accuracy embedding model with 3072 output dimensions
- `openai/text-embedding-3-small` — Efficient embedding model with 1536 output dimensions

### encoding_format `string` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span>

The encoding format for the returned embeddings.

- `float` — Returns as an array of floating-point numbers (default)
- `base64` — Returns as a Base64-encoded string

### dimensions `integer` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span>

The number of dimensions for the output embeddings. Only supported by `text-embedding-3` and newer models.

By specifying fewer dimensions, you can shorten the embedding vector without significantly losing semantic expressiveness, thereby reducing storage and retrieval costs.

### user `string` <span style="color: #666; font-weight: 400; font-size: 14px"> Optional </span>

A unique identifier representing the end user, which can help monitor and detect abuse.

## Response

Returns a JSON object containing a list of embedding vectors.

### object `string`

The object type, always `list`.

### data `array`

An array of embedding objects, each containing an embedding for an input.

#### data object

##### object `string`

The object type, always `embedding`.

##### embedding `array of float`

The embedding vector, consisting of a list of floating-point numbers. The vector length depends on the model used and the `dimensions` parameter.

##### index `integer`

The index position of this embedding in the input list.

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
        0.0023064255, -0.009327292, -0.0028842222, 0.018182484, -0.012395813,
        0.0073498537, -0.020456877, 0.0118837105, 0.015375832, -0.0036487724
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
