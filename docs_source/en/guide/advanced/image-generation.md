---
head:
  - - meta
    - name: description
      content: Image Generation
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, image, generation, API
---

# Image Generation

ZenMux supports invoking image generation models via the Vertex AI protocol. This guide explains how to use ZenMux to generate images and save them locally.

::: tip 💡 About Banana Models
Banana is a series of image generation models from Google that can produce high-quality images from text prompts. You can use these models in ZenMux through the Vertex AI protocol.
:::

## Supported Models

The currently supported image generation models include (continuously updated):

**Google Gemini Series** — Use the `generate_content` API; responses contain both text and images:

- `google/gemini-3-pro-image-preview`
- `google/gemini-3-pro-image-preview-free`
- `google/gemini-2.5-flash-image`
- `google/gemini-2.5-flash-image-free`

**Non-Google Models** — Use the `generate_images` / `edit_image` API; support image generation and editing:

- `openai/gpt-image-1.5`
- `openai/gpt-image-2`
- `qwen/qwen-image-2.0`

::: tip 📚 More Models
Visit the [ZenMux model catalog](https://zenmux.ai/models) to search and view all available image generation models.
:::

## Reference Documentation

This guide only covers basic usage. For detailed configuration and advanced usage, refer to the official documentation below:

- [Vertex AI Official Documentation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference)
- [Vertex AI Nano-Banana Notebook](https://github.com/GoogleCloudPlatform/generative-ai/tree/main/gemini/nano-banana)

## Usage

::: code-group

```Python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # Replace with your API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

# Streaming: generate_content_stream
# Non-streaming: generate_content
prompt = "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"

response = client.models.generate_content(
    model="google/gemini-3-pro-image-preview",
    contents=[prompt],
    config=types.GenerateContentConfig(
        response_modalities=["TEXT", "IMAGE"]
    )
)

# Process text and image responses
for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        # Save the generated image
        image = part.as_image()
        image.save("generated_image.png")
        print("Image saved as generated_image.png")
```

```ts [TypeScript]
const genai = require("@google/genai");

const client = new genai.GoogleGenAI({
  apiKey: "$ZENMUX_API_KEY", // Replace with your API Key
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1",
  },
});

// Streaming: generateContentStream
// Non-streaming: generateContent
const response = await client.models.generateContent({
  model: "google/gemini-3-pro-image-preview",
  contents:
    "Generate an image of the Eiffel tower with fireworks in the background",
  config: {
    responseModalities: ["TEXT", "IMAGE"], // Response modalities must be specified
    // For more configuration options, see the Vertex AI documentation
  },
});

console.log(response);
```

:::

## Non-Google Model Usage

For non-Google models such as `openai/gpt-image-1.5`, `openai/gpt-image-2`, and `qwen/qwen-image-2.0`, use the `generate_images` and `edit_image` APIs.

ZenMux internally translates Vertex AI protocol parameters into the OpenAI image generation API format. The mapping tables below help you understand how to use each feature.

### Supported Parameters

#### generate_images Parameters

The following table maps the [official OpenAI image generation parameters](https://developers.openai.com/api/reference/resources/images/methods/generate) to the ZenMux Vertex AI protocol:

| OpenAI Parameter | Vertex AI Equivalent | Type | Description | Supported |
|---|---|---|---|---|
| `prompt` | `prompt` (passed directly via SDK) | string | Text description (required) | ✅ |
| `model` | `model` (passed directly via SDK) | string | Model name | ✅ |
| `n` | `config.number_of_images` | number | Number of images to generate (1-10) | ✅ |
| `size` | `config.http_options.extra_body.imageSize` | string | Image size: `1024x1024`, `1536x1024` (landscape), `1024x1536` (portrait), `auto` | ✅ |
| `quality` | `config.http_options.extra_body.quality` | string | Image quality: `low` / `medium` / `high` / `auto` | ✅ |
| `output_format` | `config.output_mime_type` | string | Output format: `image/png`, `image/jpeg`, `image/webp` | ✅ |
| `output_compression` | `config.output_compression_quality` | number | Compression quality (0-100), only valid for webp/jpeg | ✅ |
| `background` | — | string | Background transparency setting | ❌ |
| `moderation` | — | string | Content moderation level | ❌ |
| `style` | — | string | DALL-E 3 style parameter | ❌ |
| `response_format` | — | string | Not applicable (always returns base64) | ❌ |

#### edit_image Parameters

The following table maps the [official OpenAI image editing parameters](https://developers.openai.com/api/reference/resources/images/methods/edit) to the ZenMux Vertex AI protocol:

| OpenAI Parameter | Vertex AI Equivalent | Type | Description | Supported |
|---|---|---|---|---|
| `prompt` | `prompt` (passed directly via SDK) | string | Edit description (required) | ✅ |
| `model` | `model` (passed directly via SDK) | string | Model name | ✅ |
| `image` | `reference_images` (with `referenceType` other than MASK) | file/base64 | Reference images, multiple supported | ✅ |
| `mask` | `reference_images` (with `referenceType = REFERENCE_TYPE_MASK`) | file/base64 | Mask image; transparent areas are the editable region | ✅ |
| `n` | `config.number_of_images` | number | Number of images (1-10) | ✅ |
| `size` | `config.http_options.extra_body.imageSize` | string | Image size: `1024x1024`, `1536x1024`, `1024x1536`, `auto` | ✅ |
| `quality` | `config.http_options.extra_body.quality` | string | Image quality: `low` / `medium` / `high` / `auto` | ✅ |
| `output_format` | `config.output_mime_type` | string | Output format | ✅ |
| `output_compression` | `config.output_compression_quality` | number | Compression quality | ✅ |
| `background` | — | — | Not supported | ❌ |

::: tip 💡 About Parameter Passing

Pass OpenAI-specific parameters such as `imageSize` and `quality` through `httpOptions.extraBody` to ensure consistent behavior across the Python and TypeScript SDKs. Standard Vertex AI fields like `numberOfImages`, `outputMimeType`, and `outputCompressionQuality` can be set directly at the top level of `config`.

:::

### Generating Images

::: code-group

```Python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # Replace with your API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

response = client.models.generate_images(
    model="openai/gpt-image-2",  # or qwen/qwen-image-2.0
    prompt="A cat and a dog"
)

# Save the generated images
for i, img in enumerate(response.generated_images):
    img.image.save(f"generated_{i}.png")
    print(f"Image saved as generated_{i}.png")
```

```ts [TypeScript]
const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: "$ZENMUX_API_KEY", // Replace with your API Key
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1",
  },
});

const response = await client.models.generateImages({
  model: "openai/gpt-image-2", // or qwen/qwen-image-2.0
  prompt: "A cat and a dog",
});

console.log(response);
```

:::

### Advanced Parameter Examples

#### Generating High-Resolution Images

Pass `imageSize` and `quality` through `httpOptions.extraBody` to generate high-quality, large-size images:

::: code-group

```Python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

response = client.models.generate_images(
    model="openai/gpt-image-2",
    prompt="A futuristic cityscape at sunset, ultra detailed",
    config=types.GenerateImagesConfig(
        number_of_images=1,                         # Generate 1 image
        http_options=types.HttpOptions(
            extra_body={
                "imageSize": "1536x1024",           # Landscape high resolution
                "quality": "high",                  # High quality
            }
        ),
    )
)

for i, img in enumerate(response.generated_images):
    img.image.save(f"hd_{i}.png")
    print(f"HD image saved as hd_{i}.png")
```

```ts [TypeScript]
const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: "$ZENMUX_API_KEY",
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1",
  },
});

const response = await client.models.generateImages({
  model: "openai/gpt-image-2",
  prompt: "A futuristic cityscape at sunset, ultra detailed",
  config: {
    numberOfImages: 1,                  // Generate 1 image
    httpOptions: {
      extraBody: {
        imageSize: "1536x1024",         // Landscape high resolution
        quality: "high",                // High quality
      },
    },
  },
});

for (const img of response.generatedImages) {
  console.log("Image generated:", img.image.imageBytes.length, "bytes");
}
```

:::

#### Generating 4K Images

`openai/gpt-image-2` supports custom sizes, including 4K resolution:

::: code-group

```Python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

# Generate a 4K landscape image (3840x2160)
response = client.models.generate_images(
    model="openai/gpt-image-2",
    prompt="A breathtaking mountain landscape at golden hour, photorealistic",
    config=types.GenerateImagesConfig(
        number_of_images=1,
        http_options=types.HttpOptions(
            extra_body={
                "imageSize": "3840x2160",   # 4K UHD resolution
                "quality": "high",          # High quality
            }
        ),
    )
)

for i, img in enumerate(response.generated_images):
    img.image.save(f"4k_{i}.png")
    print(f"4K image saved as 4k_{i}.png")
```

```ts [TypeScript]
const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: "$ZENMUX_API_KEY",
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1",
  },
});

// Generate a 4K landscape image (3840x2160)
const response = await client.models.generateImages({
  model: "openai/gpt-image-2",
  prompt: "A breathtaking mountain landscape at golden hour, photorealistic",
  config: {
    numberOfImages: 1,
    httpOptions: {
      extraBody: {
        imageSize: "3840x2160",      // 4K UHD resolution
        quality: "high",             // High quality
      },
    },
  },
});

for (const img of response.generatedImages) {
  console.log("4K image generated:", img.image.imageBytes.length, "bytes");
}
```

:::

::: tip 💡 Size Options

**Preset sizes:** `1024x1024` (square), `1536x1024` (landscape), `1024x1536` (portrait), `auto`

**Custom sizes** (only `openai/gpt-image-2`): any custom size is supported, subject to the following constraints:
- Width and height must each be a **multiple of 16**
- Maximum side length is **3840px**
- Aspect ratio must not exceed **3:1**
- Total pixels must fall between 655,360 and 8,294,400

Common custom sizes for reference:

| Size | Resolution | Use Case |
|---|---|---|
| `1920x1080` | 1080p | Blog covers, web banners |
| `1080x1920` | 1080p portrait | Phone wallpapers, social media stories |
| `2560x1440` | 2K QHD | Desktop wallpapers |
| `3840x2160` | 4K UHD | High-resolution posters, large displays |

Different sizes affect generation time and token cost — larger sizes are more expensive. Sizes above 2560x1440 are experimental and may produce inconsistent results.
:::

#### Specifying Output Format and Compression Quality

Use `output_mime_type` and `output_compression_quality` to control the output format:

::: code-group

```Python [Python]
response = client.models.generate_images(
    model="openai/gpt-image-2",
    prompt="A minimalist logo design",
    config=types.GenerateImagesConfig(
        number_of_images=2,                 # Generate 2 images
        output_mime_type="image/webp",      # WebP format, smaller file size
        output_compression_quality=80,      # 80% compression quality
    )
)

for i, img in enumerate(response.generated_images):
    img.image.save(f"logo_{i}.webp")
```

```ts [TypeScript]
const response = await client.models.generateImages({
  model: "openai/gpt-image-2",
  prompt: "A minimalist logo design",
  config: {
    numberOfImages: 2,                    // Generate 2 images
    outputMimeType: "image/webp",         // WebP format, smaller file size
    outputCompressionQuality: 80,         // 80% compression quality
  },
});
```

:::

::: tip 💡 Output Formats
- `image/png`: lossless format, ideal when high fidelity is needed (default)
- `image/webp`: smaller file size, ideal for web display
- `image/jpeg`: general-purpose lossy format; pair with `output_compression_quality` to control quality
:::

### Editing Images

To modify an existing image, use the `edit_image` API:

::: code-group

```Python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # Replace with your API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

# First, generate an image
generate_response = client.models.generate_images(
    model="openai/gpt-image-2",
    prompt="A cat sitting on a table"
)

# Then edit the generated image
edit_response = client.models.edit_image(
    model="openai/gpt-image-2",
    prompt="Add a robot next to the cat",
    reference_images=[
        types.RawReferenceImage(
            reference_id=1,
            reference_image=generate_response.generated_images[0].image
        )
    ]
)

# Save the edited image
for i, img in enumerate(edit_response.generated_images):
    img.image.save(f"edited_{i}.png")
    print(f"Edited image saved as edited_{i}.png")
```

```ts [TypeScript]
const { GoogleGenAI, RawReferenceImage } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: "$ZENMUX_API_KEY", // Replace with your API Key
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1",
  },
});

// First, generate an image
const generateResponse = await client.models.generateImages({
  model: "openai/gpt-image-2",
  prompt: "A cat sitting on a table",
});

// Then edit the generated image
const editResponse = await client.models.editImage({
  model: "openai/gpt-image-2",
  prompt: "Add a robot next to the cat",
  referenceImages: [
    new RawReferenceImage({
      referenceId: 1,
      referenceImage: generateResponse.generatedImages[0].image,
    }),
  ],
});

console.log(editResponse);
```

:::

#### Editing with a Mask

Use a mask to specify which region of the image should be edited — the transparent areas of the mask define the editable region:

::: code-group

```Python [Python]
import urllib.request

from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

# Load the original image and mask (using the ZenMux Logo as an example)
LOGO_URL = "https://cdn.marmot-cloud.com/storage/zenmux/2026/04/28/74mUf4t/Log-Light.png"
logo_bytes = urllib.request.urlopen(LOGO_URL).read()

original_image = types.Image(image_bytes=logo_bytes, mime_type="image/png")
mask_image = types.Image(image_bytes=logo_bytes, mime_type="image/png")  # Transparent areas are the editable region

edit_response = client.models.edit_image(
    model="openai/gpt-image-2",
    prompt="Replace the background with a beach scene",
    reference_images=[
        types.RawReferenceImage(
            reference_id=1,
            reference_image=original_image
        ),
        types.MaskReferenceImage(
            reference_id=2,
            reference_image=mask_image,
            config=types.MaskReferenceConfig(
                mask_mode="MASK_MODE_USER_PROVIDED",
            )
        )
    ],
    config=types.EditImageConfig(
        number_of_images=1,
        output_mime_type="image/png",
        http_options=types.HttpOptions(
            extra_body={
                "imageSize": "1024x1024",
                "quality": "high",
            }
        ),
    )
)

for i, img in enumerate(edit_response.generated_images):
    img.image.save(f"masked_edit_{i}.png")
```

```ts [TypeScript]
const { GoogleGenAI, RawReferenceImage, MaskReferenceImage } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: "$ZENMUX_API_KEY",
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1",
  },
});

// Load the original image and mask (using the ZenMux Logo as an example)
const LOGO_URL =
  "https://cdn.marmot-cloud.com/storage/zenmux/2026/04/28/74mUf4t/Log-Light.png";
const logoBytes = Buffer.from(await (await fetch(LOGO_URL)).arrayBuffer());

const originalImage = {
  imageBytes: logoBytes,
  mimeType: "image/png",
};
const maskImage = {
  imageBytes: logoBytes, // Transparent areas are the editable region
  mimeType: "image/png",
};

const editResponse = await client.models.editImage({
  model: "openai/gpt-image-2",
  prompt: "Replace the background with a beach scene",
  referenceImages: [
    new RawReferenceImage({
      referenceId: 1,
      referenceImage: originalImage,
    }),
    new MaskReferenceImage({
      referenceId: 2,
      referenceImage: maskImage,
      config: {
        maskMode: "MASK_MODE_USER_PROVIDED",
      },
    }),
  ],
  config: {
    numberOfImages: 1,
    outputMimeType: "image/png",
    httpOptions: {
      extraBody: {
        imageSize: "1024x1024",
        quality: "high",
      },
    },
  },
});

console.log(editResponse);
```

:::

::: tip 💡 API Differences

- **Google Gemini models** use the `generate_content` API with `response_modalities: ["TEXT", "IMAGE"]`; responses contain both text and images.
- **Non-Google models** use the `generate_images` / `edit_image` APIs, which return image objects directly and support image editing.
  :::

## Configuration

### Required Parameters

- **api_key**: Your ZenMux API key
- **vertexai**: Must be set to `true` to enable the Vertex AI protocol
- **base_url**: ZenMux Vertex AI endpoint `https://zenmux.ai/api/vertex-ai`
- **responseModalities**: Response modalities; image generation must include `["TEXT", "IMAGE"]`

### Invocation Modes

ZenMux supports two invocation modes:

- **Streaming** (`generate_content_stream` / `generateContentStream`): suitable for scenarios that need real-time feedback
- **Non-streaming** (`generate_content` / `generateContent`): waits for the full response and returns it at once

::: warning ⚠️ Response Handling
Image generation models may return both text and images in the same response. Iterate over `response.parts` to handle every content part.
:::

## Best Practices

1. **Prompt optimization**: use clear, specific descriptions for better generation results
2. **Error handling**: add exception handling to gracefully handle API failures
3. **Saving images**: the Python SDK provides a convenient `as_image()` method to convert the response into a PIL Image object
4. **Model selection**: choose the right model for your needs — free models are good for testing, paid models offer higher quality
