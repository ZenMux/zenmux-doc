---
pageClass: api-page
title: Generate Images (Vertex AI Protocol)
head:
  - - meta
    - name: description
      content: Zenmux documentation - generate images via Vertex AI protocol
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, generate, images, imagen, vertex-ai, gpt-image, banana
---

# Google Vertex AI API: Generate Images

::: tip 💡 Troubleshooting
Running into errors? See the [API Error Code Reference](/guide/advanced/error-codes) for a complete list of error types and troubleshooting steps.
:::

```
POST https://zenmux.ai/api/vertex-ai/v1/publishers/{provider}/models/{model}:predict
```

The Generate Images endpoint uses the Google Vertex AI protocol to generate images. ZenMux aggregates multiple image generation models — including Google Imagen, OpenAI GPT Image, Tongyi Wanxiang, Flux, Kling, Hunyuan, and more — all accessible through the unified Vertex AI protocol.

This endpoint corresponds to the `generate_images` (text-to-image) and `edit_image` (image editing) methods in the Google Gen AI SDK. Set the Base URL to `https://zenmux.ai/api/vertex-ai` and authenticate with your ZenMux API Key.

For more usage examples, see the [Image Generation Guide](/guide/advanced/image-generation).

::: tip Supported Models
ZenMux's supported image generation models are continuously updated. Visit the [ZenMux Model Catalog](https://zenmux.ai/models?sort=newest&output_modalities=image) to see all currently available image models that support the Vertex AI protocol.
:::

## Path parameters

### provider `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

The model provider identifier. This is the portion before `/` in the model name — for example, `openai` in `openai/gpt-image-2`.

### model `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

The model name. This is the portion after `/` in the model name — for example, `gpt-image-2` in `openai/gpt-image-2`.

## Authentication Parameters

### api_key `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

Your ZenMux API key for authentication.

### vertexai `boolean` <span style="color: #FA6062; font-weight: 400">&#42;</span>

Must be set to `true` to enable the Vertex AI protocol.

### http_options.base_url `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

ZenMux Vertex AI endpoint: `https://zenmux.ai/api/vertex-ai`.

### http_options.api_version `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

API version. Set to `v1`.

## Generate Images Request Parameters (Text-to-Image)

The following describes the parameters for the `generate_images` / `generateImages` SDK method. The SDK automatically converts these parameters into the Vertex AI REST format (`instances` + `parameters`) before sending them to ZenMux.

### prompt `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

A text description of the image you want to generate. Use clear, specific descriptions for best results.

### model `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

The model to use for image generation, in `{provider}/{model}` format — for example, `openai/gpt-image-2`.

### config `GenerateImagesConfig` <font color="gray">Optional</font>

Image generation configuration object containing the following fields:

#### number_of_images `integer` <font color="gray">Optional</font>

The number of images to generate. Defaults to 1. Maximum limits vary by provider: Google Imagen supports up to 4, OpenAI up to 10, Volcengine up to 15, and Flux/GLM/Hunyuan support only 1.

SDK field name: Python `number_of_images`, TypeScript `numberOfImages`.

> REST equivalent: `parameters.sampleCount`

#### negative_prompt `string` <font color="gray">Optional</font>

A negative prompt describing content you do not want to appear in the image. Supported providers: Google Imagen, Kling, Tongyi Wanxiang (Qwen).

SDK field name: Python `negative_prompt`, TypeScript `negativePrompt`.

> REST equivalent: `parameters.negativePrompt`

#### aspect_ratio `string` <font color="gray">Optional</font>

The image aspect ratio. Supported values vary by provider. Common values include:

- `1:1` (square)
- `4:3` / `3:4`
- `16:9` / `9:16`
- `2:3` / `3:2`
- `21:9`

SDK field name: Python `aspect_ratio`, TypeScript `aspectRatio`.

> REST equivalent: `parameters.aspectRatio`

::: tip 💡 Size Control
`aspect_ratio` controls the aspect ratio, while `sampleImageSize` controls the resolution tier. Use them together for precise output size control. For OpenAI models, use the `imageSize` passthrough parameter to specify dimensions directly.
:::

#### output_mime_type `string` <font color="gray">Optional</font>

The output image format. Defaults to `image/png`.

Possible values:

- `image/png`: Lossless format, ideal for high-fidelity use cases
- `image/jpeg`: General-purpose lossy format

SDK field name: Python `output_mime_type`, TypeScript `outputMimeType`.

> REST equivalent: `parameters.outputOptions.mimeType`

#### output_compression_quality `integer` <font color="gray">Optional</font>

The compression quality of the output image, ranging from 0 to 100. Only applies when `output_mime_type` is `image/jpeg`. Defaults to 100.

SDK field name: Python `output_compression_quality`, TypeScript `outputCompressionQuality`.

> REST equivalent: `parameters.outputOptions.compressionQuality`

#### seed `integer` <font color="gray">Optional</font>

A random seed for reproducible generation results. Supported providers: Google Imagen, Flux, Tongyi Wanxiang, Volcengine.

SDK field name: Python `seed`, TypeScript `seed`.

> REST equivalent: `parameters.seed`

#### enhance_prompt `boolean` <font color="gray">Optional</font>

Whether to enable prompt enhancement/optimization. When enabled, the model automatically expands and refines the prompt to improve generation quality. Supported providers: Flux, Hunyuan, Tongyi Wanxiang.

SDK field name: Python `enhance_prompt`, TypeScript `enhancePrompt`.

> REST equivalent: `parameters.enhancePrompt`

#### person_generation `string` <font color="gray">Optional</font>

Person generation control. Only supported by Google Imagen models.

Possible values:

- `dont_allow`
- `allow_adult`

SDK field name: Python `person_generation`, TypeScript `personGeneration`.

> REST equivalent: `parameters.personGeneration`

#### safety_filter_level `string` <font color="gray">Optional</font>

Safety filter level. Only supported by Google Imagen models.

SDK field name: Python `safety_filter_level`, TypeScript `safetyFilterLevel`.

> REST equivalent: `parameters.safetySetting`

#### include_rai_reason `boolean` <font color="gray">Optional</font>

Whether to include the content moderation reason in the response. Only supported by Google Imagen models.

SDK field name: Python `include_rai_reason`, TypeScript `includeRaiReason`.

> REST equivalent: `parameters.includeRaiReason`

#### add_watermark `boolean` <font color="gray">Optional</font>

Whether to add a watermark. Supported providers: Google Imagen, Volcengine, GLM, Hunyuan, Tongyi Wanxiang, Baidu.

SDK field name: Python `add_watermark`, TypeScript `addWatermark`.

> REST equivalent: `parameters.addWatermark`

#### guidance_scale `number` <font color="gray">Optional</font>

Guidance scale, controlling how closely the model follows the prompt. Only supported by Flux models.

SDK field name: Python `guidance_scale`, TypeScript `guidanceScale`.

> REST equivalent: `parameters.guidanceScale`

### OpenAI Model Passthrough Parameters

The following parameters are passed through via `http_options.extra_body` and only apply to OpenAI-class models (such as `openai/gpt-image-2`).

#### http_options.extra_body.imageSize `string` <font color="gray">Optional</font>

Image dimensions (passthrough parameter). ZenMux forwards this parameter as-is to the underlying OpenAI API.

**Preset sizes:** `1024x1024` (square), `1536x1024` (landscape), `1024x1536` (portrait), `auto`

**Custom sizes** (only `openai/gpt-image-2`): Supports arbitrary custom dimensions with the following constraints:

- Both width and height must be **multiples of 16**
- Maximum **3840px** per side
- Aspect ratio no greater than **3:1**

Common custom size reference:

| Size        | Resolution     | Use Case                                |
| ----------- | -------------- | --------------------------------------- |
| `1920x1080` | 1080p          | Blog covers, web banners                |
| `1080x1920` | 1080p portrait | Phone wallpapers, social media stories  |
| `2560x1440` | 2K QHD         | Desktop wallpapers                      |
| `3840x2160` | 4K UHD         | High-resolution posters, large displays |

SDK field name: Python `http_options=types.HttpOptions(extra_body={"imageSize": "..."})`, TypeScript `httpOptions: { extraBody: { imageSize: "..." } }`.

#### http_options.extra_body.quality `string` <font color="gray">Optional</font>

Image quality (passthrough parameter). ZenMux forwards this parameter as-is to the underlying OpenAI API.

Possible values:

- `low`
- `medium`
- `high`
- `auto` (default)

SDK field name: Python `http_options=types.HttpOptions(extra_body={"quality": "..."})`, TypeScript `httpOptions: { extraBody: { quality: "..." } }`.

### Non-OpenAI Model Resolution Control

#### http_options.extra_body.sampleImageSize `string` <font color="gray">Optional</font>

Resolution tier (passthrough parameter). Applicable to providers such as Volcengine and Baidu.

Possible values:

- `1K`: 1024-level resolution
- `2K`: 2048-level resolution
- `4K`: 4096-level resolution

This parameter works in conjunction with `aspectRatio` — ZenMux calculates the actual output dimensions based on the resolution tier and aspect ratio.

SDK field name: Python `http_options=types.HttpOptions(extra_body={"sampleImageSize": "..."})`, TypeScript `httpOptions: { extraBody: { sampleImageSize: "..." } }`.

::: tip 💡 About Passthrough Parameters
`imageSize`, `quality`, and `sampleImageSize` are passthrough parameters — ZenMux converts or forwards them as needed depending on the target provider. Standard Vertex AI fields (such as `numberOfImages`, `outputMimeType`, and `aspectRatio`) should be placed directly at the top level of `config`.
:::

## Edit Image Request Parameters (Image Editing)

The following describes the parameters for the `edit_image` / `editImage` SDK method, used to modify an existing image.

### prompt `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

A text description of the desired edit. It is recommended to explicitly instruct the model to preserve the original image's shape and composition, and only change the style or specific areas.

### model `string` <span style="color: #FA6062; font-weight: 400">&#42;</span>

The model to use for image editing, in `{provider}/{model}` format — for example, `openai/gpt-image-2`.

### reference_images `array` <span style="color: #FA6062; font-weight: 400">&#42;</span>

A list of reference images, including the source image and an optional mask. Different providers have different limits on the number of reference images: Kling supports up to 1, Flux supports up to 8.

::: details RawReferenceImage (Source Image)

- `reference_id` `integer` <span style="color: #FA6062; font-weight: 400">&#42;</span>
  : An identifier for the reference image.
- `reference_image` `Image` <span style="color: #FA6062; font-weight: 400">&#42;</span>
  : The image object.
  - `image_bytes` `bytes`: The binary image data.
  - `mime_type` `string`: The image MIME type, such as `image/png` or `image/jpeg`.

:::

::: details MaskReferenceImage (Mask, Optional)

- `reference_id` `integer` <span style="color: #FA6062; font-weight: 400">&#42;</span>
  : An identifier for the mask.
- `reference_image` `Image` <span style="color: #FA6062; font-weight: 400">&#42;</span>
  : The mask image object. Transparent regions indicate the areas to be edited.
  - `image_bytes` `bytes`: The binary mask data.
  - `mime_type` `string`: The image MIME type.
- `config` `MaskReferenceConfig` <span style="color: #FA6062; font-weight: 400">&#42;</span>
  : Mask configuration.
  - `mask_mode` `string`: The mask mode. Set to `MASK_MODE_USER_PROVIDED`.

:::

### config `EditImageConfig` <font color="gray">Optional</font>

Image editing configuration object. Supports the same config fields as Generate Images.

## Response

The SDK automatically converts the REST response into a `GenerateImagesResponse` object.

### generated_images `array<GeneratedImage>`

A list of generated images.

#### image `Image`

The image object.

- `image_bytes` `bytes`: Base64-encoded binary image data. Can be saved directly to a file using SDK-provided methods.
- `mime_type` `string`: The MIME type of the image, corresponding to the `output_mime_type` specified in the request.

::: details Raw REST Response Structure

The underlying REST response format received by the SDK:

```json
{
  "predictions": [
    {
      "bytesBase64Encoded": "iVBORw0KGgoAAAANSUhEUg...",
      "mimeType": "image/png"
    }
  ]
}
```

- `bytesBase64Encoded`: Base64-encoded image data
- `mimeType`: Image MIME type
- `gcsUri`: Image URL (returned by some providers)
- `prompt`: Enhanced/revised prompt (returned by some models)
- `raiFilteredReason`: Content moderation block reason (if blocked)

:::

::: api-request POST /api/vertex-ai/v1

```cURL
curl -X POST "https://zenmux.ai/api/vertex-ai/v1/publishers/openai/models/gpt-image-2:predict" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [{
      "prompt": "A cute cat wearing a tiny hat"
    }],
    "parameters": {
      "sampleCount": 1,
      "imageSize": "1024x1024",
      "quality": "high"
    }
  }'
```

```TypeScript
const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: process.env.ZENMUX_API_KEY, // [!code highlight]
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai", // [!code highlight]
    apiVersion: "v1",
  },
});

const response = await client.models.generateImages({
  model: "openai/gpt-image-2",
  prompt: "A cute cat wearing a tiny hat",
  config: {
    numberOfImages: 1,
    httpOptions: {
      extraBody: {
        imageSize: "1024x1024",
        quality: "high",
      },
    },
  },
});

for (const img of response.generatedImages) {
  console.log("Image generated:", img.image.imageBytes.length, "bytes");
}
```

```Python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # [!code highlight]
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai"  # [!code highlight]
    ),
)

response = client.models.generate_images(
    model="openai/gpt-image-2",
    prompt="A cute cat wearing a tiny hat",
    config=types.GenerateImagesConfig(
        number_of_images=1,
        http_options=types.HttpOptions(
            extra_body={
                "imageSize": "1024x1024",
                "quality": "high",
            }
        ),
    )
)

for i, img in enumerate(response.generated_images):
    img.image.save(f"generated_{i}.png")
    print(f"Image saved as generated_{i}.png")
```

:::

::: api-response

```json
{
  "predictions": [
    {
      "bytesBase64Encoded": "iVBORw0KGgoAAAANSUhEUg...",
      "mimeType": "image/png"
    }
  ]
}
```

:::

::: api-request POST /api/vertex-ai/v1

```cURL
curl -X POST "https://zenmux.ai/api/vertex-ai/v1/publishers/openai/models/gpt-image-2:predict" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [{
      "prompt": "Transform this image into watercolor painting style",
      "image": {
        "bytesBase64Encoded": "<BASE64_IMAGE_DATA>",
        "mimeType": "image/png"
      }
    }],
    "parameters": {
      "sampleCount": 1
    }
  }'
```

```TypeScript
const { GoogleGenAI, RawReferenceImage } = require("@google/genai");
const fs = require("fs");

const client = new GoogleGenAI({
  apiKey: process.env.ZENMUX_API_KEY, // [!code highlight]
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai", // [!code highlight]
    apiVersion: "v1",
  },
});

const imageBytes = fs.readFileSync("input_image.png");

const response = await client.models.editImage({
  model: "openai/gpt-image-2",
  prompt: "Transform this image into watercolor painting style",
  referenceImages: [
    new RawReferenceImage({
      referenceId: 1,
      referenceImage: {
        imageBytes: imageBytes,
        mimeType: "image/png",
      },
    }),
  ],
});

for (const img of response.generatedImages) {
  console.log("Edited image:", img.image.imageBytes.length, "bytes");
}
```

```Python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # [!code highlight]
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai"  # [!code highlight]
    ),
)

with open("input_image.png", "rb") as f:
    image_bytes = f.read()

original_image = types.Image(image_bytes=image_bytes, mime_type="image/png")

response = client.models.edit_image(
    model="openai/gpt-image-2",
    prompt="Transform this image into watercolor painting style",
    reference_images=[
        types.RawReferenceImage(
            reference_id=1,
            reference_image=original_image
        )
    ]
)

for i, img in enumerate(response.generated_images):
    img.image.save(f"edited_{i}.png")
    print(f"Edited image saved as edited_{i}.png")
```

:::

::: api-response

```json
{
  "predictions": [
    {
      "bytesBase64Encoded": "iVBORw0KGgoAAAANSUhEUg...",
      "mimeType": "image/png"
    }
  ]
}
```

:::
