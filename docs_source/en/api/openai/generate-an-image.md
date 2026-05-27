---
pageClass: api-page
title: Create image (OpenAI Images API)
head:
  - - meta
    - name: description
      content: Create image
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, openai, images, generate, image, OpenAI
---

# Create image

::: info Troubleshooting
Running into an error while calling the API? See the [API error code reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting steps.
:::

```
POST https://zenmux.ai/api/v1/images/generations
```

The Create image endpoint is compatible with OpenAI's [Create image](https://developers.openai.com/api/reference/typescript/resources/images/methods/generate) endpoint and creates images from prompts.

The parameters below cover what different models may support. Support varies by model. ZenMux passes through the OpenAI Images API protocol; when calling ZenMux, set the Base URL to `https://zenmux.ai/api/v1` and authenticate with your ZenMux API Key.

::: tip Currently Supported Models
ZenMux continuously updates the OpenAI image generation models it supports. Visit the [ZenMux model catalog](https://zenmux.ai/models?author=openai&sort=newest&output_modalities=image) to check the currently available models.
:::

## Request headers

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer Token authentication, formatted as `Bearer $ZENMUX_API_KEY`.

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

The request content type. Defaults to `application/json`.

## Request body

### prompt `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Text description of the image to generate. GPT image models support a maximum length of 32,000 characters.

### background `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Sets the background transparency of the generated image. This parameter is only supported by GPT image models. Must be one of `transparent`, `opaque`, or `auto`; defaults to `auto`. With `auto`, the model automatically determines the most suitable background for the image.

If set to `transparent`, the output format must support transparency, so `output_format` should be set to `png` (default) or `webp`.

Possible values:

- `transparent`
- `opaque`
- `auto`

### model `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The model to use for image generation. Visit the [ZenMux model catalog](https://zenmux.ai/models?author=openai&sort=newest&output_modalities=image) to check the currently available models.

### moderation `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Controls the content moderation level for GPT image model generation. Must be one of `low` or `auto` (default).

Possible values:

- `low`
- `auto`

### n `number` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The number of images to generate. Must be between 1 and 10.

### output_compression `number` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The compression level for generated images (0-100%). This parameter is only supported by GPT image models with `webp` or `jpeg` output formats, and defaults to 100.

### output_format `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The format used to return generated images. This parameter is only supported by GPT image models. Must be one of `png`, `jpeg`, or `webp`.

Possible values:

- `png`
- `jpeg`
- `webp`

### partial_images `number` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The number of partial images to generate. This parameter is used for streaming responses that return partial images. The value must be between 0 and 3. When set to 0, the response returns a single image in one streaming event.

If the complete image is generated faster, the final image may be sent before all requested partial images have been produced.

### quality `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The quality of the generated image. ZenMux currently supports GPT image model quality parameters for OpenAI image generation models.

- `auto` (default) automatically selects the best quality for the given model.
- `high`, `medium`, and `low` are supported by GPT image models.

Possible values:

- `low`
- `medium`
- `high`
- `auto`

### response_format `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The return format for the generated image. This parameter does not apply to the GPT image models currently supported by ZenMux; GPT image models always return base64-encoded images.

Possible values:

- `url`
- `b64_json`

### size `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The size of the generated image. For `gpt-image-2` and `gpt-image-2-2026-04-21`, arbitrary `WIDTHxHEIGHT` strings are supported, such as `1536x864`. Both width and height must be divisible by 16, and the requested aspect ratio must be between 1:3 and 3:1. Resolutions above `2560x1440` are experimental, with a maximum supported resolution of `3840x2160`. Requested sizes must also satisfy the model's current pixel and side-length limits.

`gpt-image-1.5` supports the standard sizes `1024x1024`, `1536x1024`, and `1024x1536`; models that support automatic sizing may use `auto`.

Common possible values:

- `auto`
- `1024x1024`
- `1536x1024`
- `1024x1536`

### stream `boolean` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

Generate the image in streaming mode. Defaults to `false`. This parameter is only supported by GPT image models.

### style `string` <span style="color: #666; font-weight: 400; font-size: 14px">Optional</span>

The style of the generated image. This parameter does not apply to the OpenAI image generation models currently supported by ZenMux.

Possible values:

- `vivid`
- `natural`

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

::: api-request POST /api/v1/images/generations

```cURL
curl https://zenmux.ai/api/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "A cute baby sea otter",
    "n": 1,
    "size": "1024x1024"
  }'
```

```TypeScript
import OpenAI from "openai";
import { writeFile } from "fs/promises";

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  apiKey: process.env.ZENMUX_API_KEY, // [!code highlight]
});

const img = await client.images.generate({
  model: "gpt-image-2",
  prompt: "A cute baby sea otter",
  n: 1,
  size: "1024x1024",
});

const imageBuffer = Buffer.from(img.data[0].b64_json, "base64");
await writeFile("output.png", imageBuffer);
```

```Python
import base64
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",  # [!code highlight]
    api_key="<ZENMUX_API_KEY>",  # [!code highlight]
)

img = client.images.generate(
    model="gpt-image-2",
    prompt="A cute baby sea otter",
    n=1,
    size="1024x1024"
)

image_bytes = base64.b64decode(img.data[0].b64_json)
with open("output.png", "wb") as f:
    f.write(image_bytes)
```

:::

::: api-response

```json
{
  "created": 1713833628,
  "data": [
    {
      "b64_json": "..."
    }
  ],
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

:::
