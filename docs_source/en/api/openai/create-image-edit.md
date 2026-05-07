---
pageClass: api-page
title: Create image edit (OpenAI Images API)
head:
  - - meta
    - name: description
      content: Create image edit
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, openai, images, edit, image, OpenAI
---

# Create image edit

::: tip 💡 Troubleshooting
Running into an error while calling the API? See the [API error code reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting steps.
:::

```
POST https://zenmux.ai/api/v1/images/edits
```

The Create image edit endpoint is compatible with OpenAI's [Create image edit](https://developers.openai.com/api/reference/typescript/resources/images/methods/edit) endpoint and creates edited or extended images from one or more source images and a prompt.

::: tip Currently Supported Models
ZenMux continuously updates the OpenAI image generation models it supports. Visit the [ZenMux model catalog](https://zenmux.ai/models?author=openai&sort=newest&output_modalities=image) to check the currently available models.
:::

You can call this endpoint in two ways:

- `multipart/form-data`: upload binary files through `image` and, optionally, `mask`.
- `application/json`: reference images through `images` and, optionally, `mask`, using `image_url` or `file_id`.

Note that JSON requests use the `images` array, not the `image` field used by multipart requests.

## Request headers

### Authorization `string` <font color="red">Required</font>

Bearer Token authentication, formatted as `Bearer $ZENMUX_API_KEY`.

### Content-Type `string` <font color="red">Required</font>

The request content type. Use `application/json` when referencing image URLs or file IDs; use `multipart/form-data` when uploading local files.

## Request body

### images `array` <font color="red">Required</font>

References to the input images to edit. GPT image models support up to 16 images.

#### file_id `string` <font color="gray">Optional</font>

The uploaded image File API ID to use as input.

#### image_url `string` <font color="gray">Optional</font>

A fully qualified URL or a base64-encoded data URL.

### prompt `string` <font color="red">Required</font>

Text description of the desired image edit result.

### background `string` <font color="gray">Optional</font>

The background behavior for the generated image output.

Possible values:

- `transparent`
- `opaque`
- `auto`

### input_fidelity `string` <font color="gray">Optional</font>

Controls fidelity to the original input image.

Possible values:

- `high`
- `low`

### mask `object` <font color="gray">Optional</font>

References an input image as the mask through a URL or uploaded file ID. You must provide exactly one of `image_url` or `file_id`.

#### file_id `string` <font color="gray">Optional</font>

The uploaded image File API ID to use as the mask.

#### image_url `string` <font color="gray">Optional</font>

A fully qualified URL or a base64-encoded data URL.

### model `string` <font color="gray">Optional</font>

The model to use for image editing. Visit the [ZenMux model catalog](https://zenmux.ai/models?author=openai&sort=newest&output_modalities=image) to check the currently available models.

### moderation `string` <font color="gray">Optional</font>

The moderation level for GPT image models.

Possible values:

- `low`
- `auto`

### n `number` <font color="gray">Optional</font>

The number of edited images to generate.

### output_compression `number` <font color="gray">Optional</font>

The compression level for `jpeg` or `webp` output.

### output_format `string` <font color="gray">Optional</font>

The output image format. GPT image models support this parameter.

Possible values:

- `png`
- `jpeg`
- `webp`

### partial_images `number` <font color="gray">Optional</font>

The number of partial images to generate. This parameter is used for streaming responses that return partial images. The value must be between 0 and 3. When set to 0, the response returns a single image in one streaming event.

If the complete image is generated faster, the final image may be sent before all requested partial images have been produced.

### quality `string` <font color="gray">Optional</font>

The output quality for GPT image models.

Possible values:

- `low`
- `medium`
- `high`
- `auto`

### size `string` <font color="gray">Optional</font>

The requested output image size.

Possible values:

- `auto`
- `1024x1024`
- `1536x1024`
- `1024x1536`

### stream `boolean` <font color="gray">Optional</font>

Return partial image results as an event stream.

### user `string` <font color="gray">Optional</font>

A unique identifier representing your end user, which can help with monitoring and abuse detection.

## Response

Returns the response object from the image generation endpoint.

### created `number`

The Unix timestamp (in seconds) when the image was created.

### background `string` <font color="gray">Optional</font>

The background parameter used during image generation. May be `transparent` or `opaque`.

### data `array` <font color="gray">Optional</font>

The list of generated images.

#### b64_json `string` <font color="gray">Optional</font>

The base64-encoded JSON for the generated image. GPT image models currently supported by ZenMux return this field by default.

#### revised_prompt `string` <font color="gray">Optional</font>

Returned by some models. Represents the rewritten prompt actually used to generate the image.

#### url `string` <font color="gray">Optional</font>

May contain a generated image URL for models that return URLs. GPT image models currently supported by ZenMux usually return `b64_json`.

### output_format `string` <font color="gray">Optional</font>

The output format of the generated image. May be `png`, `webp`, or `jpeg`.

### quality `string` <font color="gray">Optional</font>

The generated image quality. May be `low`, `medium`, or `high`.

### size `string` <font color="gray">Optional</font>

The generated image size. May be `1024x1024`, `1024x1536`, or `1536x1024`.

### usage `object` <font color="gray">Optional</font>

Token usage information for GPT image model image generation.

- `input_tokens` `number`: The number of image and text tokens in the input prompt.
- `input_tokens_details` `object`: Input token details.
  - `image_tokens` `number`: The number of image tokens in the input prompt.
  - `text_tokens` `number`: The number of text tokens in the input prompt.
- `output_tokens` `number`: The number of output tokens generated by the model.
- `total_tokens` `number`: The total number of tokens used for this image generation.
- `output_tokens_details` `object` <font color="gray">Optional</font>: Output token details.
  - `image_tokens` `number`: The number of generated image output tokens.
  - `text_tokens` `number`: The number of generated text output tokens.

::: api-request POST /api/v1/images/edits

```cURL
curl https://zenmux.ai/api/v1/images/edits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "images": [
      {
        "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cFBSepW/gold.png"
      },
      {
        "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/kMzPjuF/silver.png"
      },
      {
        "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cdTgazq/diamond.png"
      }
    ],
    "prompt": "Turn these reference images into a Marvel Avengers-style group portrait",
    "background": "transparent",
    "model": "gpt-image-2",
    "moderation": "auto",
    "n": 1,
    "output_compression": 100,
    "output_format": "png",
    "partial_images": 1,
    "quality": "high",
    "size": "1024x1024",
    "user": "user-1234"
  }'
```

```TypeScript
import { writeFile } from "fs/promises";

const response = await fetch("https://zenmux.ai/api/v1/images/edits", { // [!code highlight]
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.ZENMUX_API_KEY}`, // [!code highlight]
  },
  body: JSON.stringify({
    model: "gpt-image-2",
    images: [
      {
        image_url: "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cFBSepW/gold.png",
      },
      {
        image_url: "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/kMzPjuF/silver.png",
      },
      {
        image_url: "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cdTgazq/diamond.png",
      },
    ],
    prompt: "Turn these reference images into a Marvel Avengers-style group portrait",
  }),
});

const result = await response.json();
const imageBase64 = result.data[0].b64_json;
const imageBytes = Buffer.from(imageBase64, "base64");
await writeFile("avengers-group.png", imageBytes);
```

```Python
import base64
import os
import requests

response = requests.post(
    "https://zenmux.ai/api/v1/images/edits",  # [!code highlight]
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.environ['ZENMUX_API_KEY']}",  # [!code highlight]
    },
    json={
        "model": "gpt-image-2",
        "images": [
            {
                "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cFBSepW/gold.png"
            },
            {
                "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/kMzPjuF/silver.png"
            },
            {
                "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cdTgazq/diamond.png"
            },
        ],
        "prompt": "Turn these reference images into a Marvel Avengers-style group portrait",
    },
)

result = response.json()
image_base64 = result["data"][0]["b64_json"]
image_bytes = base64.b64decode(image_base64)

with open("avengers-group.png", "wb") as f:
    f.write(image_bytes)
```

:::

::: api-response

```json
{
  "created": 0,
  "background": "transparent",
  "data": [
    {
      "b64_json": "b64_json",
      "revised_prompt": "revised_prompt",
      "url": "https://example.com"
    }
  ],
  "output_format": "png",
  "quality": "low",
  "size": "1024x1024",
  "usage": {
    "input_tokens": 0,
    "input_tokens_details": {
      "image_tokens": 0,
      "text_tokens": 0
    },
    "output_tokens": 0,
    "total_tokens": 0,
    "output_tokens_details": {
      "image_tokens": 0,
      "text_tokens": 0
    }
  }
}
```

:::

## Edit image

::: api-request POST /api/v1/images/edits

```cURL
curl -s -D >(grep -i x-request-id >&2) \
  -o >(jq -r '.data[0].b64_json' | base64 --decode > avengers-group.png) \
  -X POST "https://zenmux.ai/api/v1/images/edits" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "gpt-image-2",
    "images": [
      {
        "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cFBSepW/gold.png"
      },
      {
        "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/kMzPjuF/silver.png"
      },
      {
        "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cdTgazq/diamond.png"
      }
    ],
    "prompt": "Turn these reference images into a Marvel Avengers-style group portrait"
  }'
```

```TypeScript
import { writeFile } from "fs/promises";

const response = await fetch("https://zenmux.ai/api/v1/images/edits", { // [!code highlight]
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.ZENMUX_API_KEY}`, // [!code highlight]
  },
  body: JSON.stringify({
    model: "gpt-image-2",
    images: [
      {
        image_url: "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cFBSepW/gold.png",
      },
      {
        image_url: "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/kMzPjuF/silver.png",
      },
      {
        image_url: "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cdTgazq/diamond.png",
      },
    ],
    prompt: "Turn these reference images into a Marvel Avengers-style group portrait",
  }),
});

const result = await response.json();
const imageBase64 = result.data[0].b64_json;
const imageBytes = Buffer.from(imageBase64, "base64");
await writeFile("avengers-group.png", imageBytes);
```

```Python
import base64
import os
import requests

response = requests.post(
    "https://zenmux.ai/api/v1/images/edits",  # [!code highlight]
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.environ['ZENMUX_API_KEY']}",  # [!code highlight]
    },
    json={
        "model": "gpt-image-2",
        "images": [
            {
                "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cFBSepW/gold.png"
            },
            {
                "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/kMzPjuF/silver.png"
            },
            {
                "image_url": "https://cdn.marmot-cloud.com/storage/zenmux/2026/05/07/cdTgazq/diamond.png"
            },
        ],
        "prompt": "Turn these reference images into a Marvel Avengers-style group portrait",
    },
)

result = response.json()
image_base64 = result["data"][0]["b64_json"]
image_bytes = base64.b64decode(image_base64)

with open("avengers-group.png", "wb") as f:
    f.write(image_bytes)
```

:::
