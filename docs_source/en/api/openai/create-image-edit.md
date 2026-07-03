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

::: info Troubleshooting
Running into an error while calling the API? See the [API error code reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting steps.
:::

```http
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

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer Token authentication, formatted as `Bearer $ZENMUX_API_KEY`.

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The request content type. Use `application/json` when referencing image URLs or file IDs; use `multipart/form-data` when uploading local files.

## Request body

### images `array` <span style="color: #FA6062; font-weight: 400">\*</span>

References to the input images to edit. GPT image models support up to 16 images.

#### file_id `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The uploaded image File API ID to use as input.

#### image_url `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

A fully qualified URL or a base64-encoded data URL.

### prompt `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Text description of the desired image edit result.

### background `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The background behavior for the generated image output.

Possible values:

- `transparent`
- `opaque`
- `auto`

### input_fidelity `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Controls fidelity to the original input image.

Possible values:

- `high`
- `low`

### mask `object` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

References an input image as the mask through a URL or uploaded file ID. You must provide exactly one of `image_url` or `file_id`.

#### file_id `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The uploaded image File API ID to use as the mask.

#### image_url `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

A fully qualified URL or a base64-encoded data URL.

### model `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The model to use for image editing. Visit the [ZenMux model catalog](https://zenmux.ai/models?author=openai&sort=newest&output_modalities=image) to check the currently available models.

### moderation `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The moderation level for GPT image models.

Possible values:

- `low`
- `auto`

### n `number` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The number of edited images to generate.

### output_compression `number` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The compression level for `jpeg` or `webp` output.

### output_format `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The output image format. GPT image models support this parameter.

Possible values:

- `png`
- `jpeg`
- `webp`

### partial_images `number` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The number of partial images to generate. This parameter is used for streaming responses that return partial images. The value must be between 0 and 3. When set to 0, the response returns a single image in one streaming event.

If the complete image is generated faster, the final image may be sent before all requested partial images have been produced.

### quality `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The output quality for GPT image models.

Possible values:

- `low`
- `medium`
- `high`
- `auto`

### size `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The requested output image size.

Possible values:

- `auto`
- `1024x1024`
- `1536x1024`
- `1024x1536`

### stream `boolean` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Return partial image results as an event stream.

### user `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

A unique identifier representing your end user, which can help with monitoring and abuse detection.

## Response

Returns the response object from the image generation endpoint.

### created `number`

The Unix timestamp (in seconds) when the image was created.

### background `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The background parameter used during image generation. May be `transparent` or `opaque`.

### data `array` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The list of generated images.

#### b64_json `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The base64-encoded JSON for the generated image. GPT image models currently supported by ZenMux return this field by default.

#### revised_prompt `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Returned by some models. Represents the rewritten prompt actually used to generate the image.

#### url `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

May contain a generated image URL for models that return URLs. GPT image models currently supported by ZenMux usually return `b64_json`.

### output_format `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The output format of the generated image. May be `png`, `webp`, or `jpeg`.

### quality `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The generated image quality. May be `low`, `medium`, or `high`.

### size `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The generated image size. May be `1024x1024`, `1024x1536`, or `1536x1024`.

### usage `object` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Token usage information for GPT image model image generation.

- `input_tokens` `number`: The number of image and text tokens in the input prompt.
- `input_tokens_details` `object`: Input token details.
  - `image_tokens` `number`: The number of image tokens in the input prompt.
  - `text_tokens` `number`: The number of text tokens in the input prompt.
- `output_tokens` `number`: The number of output tokens generated by the model.
- `total_tokens` `number`: The total number of tokens used for this image generation.
- `output_tokens_details` `object` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>: Output token details.
  - `image_tokens` `number`: The number of generated image output tokens.
  - `text_tokens` `number`: The number of generated text output tokens.

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

```bash [cURL]
curl -s -D >(grep -i x-request-id >&2) \
  -o >(jq -r '.data[0].b64_json' | base64 --decode > gift-basket.png) \
  -X POST "https://zenmux.ai/api/v1/images/edits" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -F "model=openai/gpt-image-2" \
  -F "image[]=@body-lotion.png" \
  -F "image[]=@bath-bomb.png" \
  -F "image[]=@incense-kit.png" \
  -F "image[]=@soap.png" \
  -F 'prompt=Create a lovely gift basket with these four items in it'
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
    }),
  ),
);

const rsp = await client.images.edit({
  model: "gpt-image-2",
  image: images,
  prompt: "Create a lovely gift basket with these four items in it",
});

// Save the image to a file
const image_base64 = rsp.data[0].b64_json;
const image_bytes = Buffer.from(image_base64, "base64");
fs.writeFileSync("basket.png", image_bytes);
```

```Python
import base64
import os

from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",  # [!code highlight]
    api_key=os.environ["ZENMUX_API_KEY"],  # [!code highlight]
)

prompt = """
Generate a photorealistic image of a gift basket on a white background
labeled 'Relax & Unwind' with a ribbon and handwriting-like font,
containing all the items in the reference pictures.
"""

result = client.images.edit(
    model="gpt-image-2",
    image=[
        open("body-lotion.png", "rb"),
        open("bath-bomb.png", "rb"),
        open("incense-kit.png", "rb"),
        open("soap.png", "rb"),
    ],
    prompt=prompt,
)

image_base64 = result.data[0].b64_json
image_bytes = base64.b64decode(image_base64)

# Save the image to a file
with open("gift-basket.png", "wb") as f:
    f.write(image_bytes)
```

:::
