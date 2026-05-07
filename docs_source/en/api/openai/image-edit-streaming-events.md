---
pageClass: api-page
title: Image edit streaming events (OpenAI Images API)
head:
  - - meta
    - name: description
      content: Image edit streaming events
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, openai, images, streaming, edit, events, OpenAI
---

# Image edit streaming events

::: tip 💡 Troubleshooting
Running into an error while calling the API? See the [API error code reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting steps.
:::

Image streaming can return image generation and editing results in real time through Server-Sent Events. When editing images, set `stream: true` in the request body for `POST https://zenmux.ai/api/v1/images/edits`.

::: api-request POST /api/v1/images/edits

```cURL
curl -s -N -X POST "https://zenmux.ai/api/v1/images/edits" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -F "model=gpt-image-1.5" \
  -F "image[]=@body-lotion.png" \
  -F "image[]=@bath-bomb.png" \
  -F "image[]=@incense-kit.png" \
  -F "image[]=@soap.png" \
  -F 'prompt=Create a lovely gift basket with these four items in it' \
  -F "stream=true"
```

```TypeScript
import fs from "fs";
import OpenAI, { toFile } from "openai";

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  apiKey: process.env.ZENMUX_API_KEY, // [!code highlight]
});

const imageFiles = [
  "bath-bomb.png",
  "body-lotion.png",
  "incense-kit.png",
  "soap.png",
];

const images = await Promise.all(
  imageFiles.map(async (file) =>
    await toFile(fs.createReadStream(file), null, {
      type: "image/png",
    })
  )
);

const stream = await client.images.edit({
  model: "gpt-image-1.5",
  image: images,
  prompt: "Create a lovely gift basket with these four items in it",
  stream: true,
});

for await (const event of stream) {
  console.log(event);
}
```

```Python
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",  # [!code highlight]
    api_key="<ZENMUX_API_KEY>",  # [!code highlight]
)

prompt = """
Generate a photorealistic image of a gift basket on a white background
labeled 'Relax & Unwind' with a ribbon and handwriting-like font,
containing all the items in the reference pictures.
"""

stream = client.images.edit(
    model="gpt-image-1.5",
    image=[
        open("body-lotion.png", "rb"),
        open("bath-bomb.png", "rb"),
        open("incense-kit.png", "rb"),
        open("soap.png", "rb"),
    ],
    prompt=prompt,
    stream=True
)

for event in stream:
    print(event)
```

:::

::: api-response

```text
event: image_edit.partial_image
data: {"type":"image_edit.partial_image","b64_json":"...","partial_image_index":0}

event: image_edit.completed
data: {"type":"image_edit.completed","b64_json":"...","usage":{"total_tokens":100,"input_tokens":50,"output_tokens":50,"input_tokens_details":{"text_tokens":10,"image_tokens":40}}}
```

:::

## image_edit.partial_image

Triggered during image edit streaming when a partial image is available.

### b64_json `string`

Base64-encoded partial image data, which can be rendered directly as an image.

### background `string`

The requested background setting for the image edit.

Possible values:

- `transparent`
- `opaque`
- `auto`

### created_at `number`

The Unix timestamp when the event was created.

### output_format `string`

The requested output format for the image edit.

Possible values:

- `png`
- `webp`
- `jpeg`

### partial_image_index `number`

The zero-based index of the partial image (streaming).

### quality `string`

The requested quality setting for the image edit.

Possible values:

- `low`
- `medium`
- `high`
- `auto`

### size `string`

The requested size for the image edit.

Possible values:

- `1024x1024`
- `1024x1536`
- `1536x1024`
- `auto`

### type `string`

The event type. Always `image_edit.partial_image`.

```json
{
  "type": "image_edit.partial_image",
  "b64_json": "...",
  "created_at": 1620000000,
  "size": "1024x1024",
  "quality": "high",
  "background": "transparent",
  "output_format": "png",
  "partial_image_index": 0
}
```

## image_edit.completed

Triggered when the image edit has completed and the final image is available.

### b64_json `string`

Base64-encoded final edited image data, which can be rendered directly as an image.

### background `string`

The background setting for the edited image.

Possible values:

- `transparent`
- `opaque`
- `auto`

### created_at `number`

The Unix timestamp when the event was created.

### output_format `string`

The output format of the edited image.

Possible values:

- `png`
- `webp`
- `jpeg`

### quality `string`

The quality setting for the edited image.

Possible values:

- `low`
- `medium`
- `high`
- `auto`

### size `string`

The size of the edited image.

Possible values:

- `1024x1024`
- `1024x1536`
- `1536x1024`
- `auto`

### type `string`

The event type. Always `image_edit.completed`.

### usage `object`

Returned only by GPT image models. Indicates token usage information for image generation.

#### input_tokens `number`

The number of image and text tokens in the input prompt.

#### input_tokens_details `object`

Input token details for image generation.

- `image_tokens` `number`: The number of image tokens in the input prompt.
- `text_tokens` `number`: The number of text tokens in the input prompt.

#### output_tokens `number`

The number of image tokens in the output image.

#### total_tokens `number`

The total number of image and text tokens used for this image generation.

```json
{
  "type": "image_edit.completed",
  "b64_json": "...",
  "created_at": 1620000000,
  "size": "1024x1024",
  "quality": "high",
  "background": "transparent",
  "output_format": "png",
  "usage": {
    "total_tokens": 100,
    "input_tokens": 50,
    "output_tokens": 50,
    "input_tokens_details": {
      "text_tokens": 10,
      "image_tokens": 40
    }
  }
}
```
