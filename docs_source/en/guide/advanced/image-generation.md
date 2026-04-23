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
    api_key="$ZENMUX_API_KEY",  # Replace with your API key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

# Streaming call: generate_content_stream
# Non-streaming call: generate_content
prompt = "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"

response = client.models.generate_content(
    model="google/gemini-3-pro-image-preview",
    contents=[prompt],
    config=types.GenerateContentConfig(
        response_modalities=["TEXT", "IMAGE"]
    )
)

# Handle text and image responses
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
  apiKey: "$ZENMUX_API_KEY", // Replace with your API key
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1",
  },
});

// Streaming call: generateContentStream
// Non-streaming call: generateContent
const response = await client.models.generateContent({
  model: "google/gemini-3-pro-image-preview",
  contents:
    "Generate an image of the Eiffel tower with fireworks in the background",
  config: {
    responseModalities: ["TEXT", "IMAGE"], // Response modalities must be specified
    // For more configuration options, refer to the Vertex AI official documentation
  },
});

console.log(response);
```

:::

## Non-Google Models Usage

For non-Google models like `openai/gpt-image-1.5`, `openai/gpt-image-2`, and `qwen/qwen-image-2.0`, use the `generate_images` and `edit_image` APIs.

ZenMux internally converts Vertex AI protocol parameters to the OpenAI image generation API format. The parameter mapping tables below help you understand how to use each feature.

### Supported Parameters

#### generate_images Parameters

The following maps [OpenAI's official image generation parameters](https://developers.openai.com/api/reference/resources/images/methods/generate) to ZenMux's Vertex AI protocol:

| OpenAI Parameter | Vertex AI Equivalent | Type | Description | Supported |
|---|---|---|---|---|
| `prompt` | `prompt` (SDK direct) | string | Text description (required) | ✅ |
| `model` | `model` (SDK direct) | string | Model name | ✅ |
| `n` | `config.number_of_images` | number | Number of images to generate (1-10) | ✅ |
| `size` | `config.image_size` | string | Image size: `1024x1024`, `1536x1024` (landscape), `1024x1536` (portrait), `auto` | ✅ |
| `quality` | `config.quality` | string | Image quality: `low` / `medium` / `high` / `auto` (TypeScript SDK only) | ✅ |
| `output_format` | `config.output_mime_type` | string | Output format: `image/png`, `image/jpeg`, `image/webp` | ✅ |
| `output_compression` | `config.output_compression_quality` | number | Compression quality (0-100), only for webp/jpeg | ✅ |
| `background` | — | string | Background transparency | ❌ |
| `moderation` | — | string | Content moderation level | ❌ |
| `style` | — | string | DALL-E 3 style parameter | ❌ |
| `response_format` | — | string | Not applicable (always returns base64) | ❌ |

#### edit_image Parameters

The following maps [OpenAI's official image editing parameters](https://developers.openai.com/api/reference/resources/images/methods/edit) to ZenMux's Vertex AI protocol:

| OpenAI Parameter | Vertex AI Equivalent | Type | Description | Supported |
|---|---|---|---|---|
| `prompt` | `prompt` (SDK direct) | string | Edit description (required) | ✅ |
| `model` | `model` (SDK direct) | string | Model name | ✅ |
| `image` | `reference_images` (`referenceType` is not MASK) | file/base64 | Reference images, supports multiple | ✅ |
| `mask` | `reference_images` (`referenceType = REFERENCE_TYPE_MASK`) | file/base64 | Mask image, transparent areas are edit regions | ✅ |
| `n` | `config.number_of_images` | number | Number of images to generate (1-10) | ✅ |
| `size` | `config.image_size` | string | Image size: `1024x1024`, `1536x1024`, `1024x1536`, `auto` | ✅ |
| `quality` | `config.quality` | string | Image quality: `low` / `medium` / `high` / `auto` (TypeScript SDK only) | ✅ |
| `output_format` | `config.output_mime_type` | string | Output format | ✅ |
| `output_compression` | `config.output_compression_quality` | number | Compression quality | ✅ |
| `background` | — | — | Not supported | ❌ |

### Generate Images

::: code-group

```Python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # Replace with your API key
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

# Save generated images
for i, img in enumerate(response.generated_images):
    img.image.save(f"generated_{i}.png")
    print(f"Image saved as generated_{i}.png")
```

```ts [TypeScript]
const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: "$ZENMUX_API_KEY", // Replace with your API key
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

#### Generate HD Large Images

Use `image_size` and `quality` parameters to generate high-quality large images:

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
        number_of_images=1,          # Generate 1 image
        image_size="1536x1024",      # Landscape high resolution
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
    numberOfImages: 1,          // Generate 1 image
    imageSize: "1536x1024",     // Landscape high resolution
    quality: "high",            // High quality (TypeScript SDK only)
  },
});

for (const img of response.generatedImages) {
  console.log("Image generated:", img.image.imageBytes.length, "bytes");
}
```

:::

#### Generate 4K Images

`openai/gpt-image-2` supports custom sizes, enabling 4K resolution image generation:

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
        image_size="3840x2160",      # 4K UHD resolution
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
    imageSize: "3840x2160",          // 4K UHD resolution
    quality: "high",                 // High quality (TypeScript SDK only)
  },
});

for (const img of response.generatedImages) {
  console.log("4K image generated:", img.image.imageBytes.length, "bytes");
}
```

:::

::: tip 💡 Size Options

**Preset sizes:** `1024x1024` (square), `1536x1024` (landscape), `1024x1536` (portrait), `auto` (automatic)

**Custom sizes** (`openai/gpt-image-2` only): Supports any custom size with the following constraints:
- Width and height must be **multiples of 16**
- Maximum edge length: **3840px**
- Aspect ratio no greater than **3:1**
- Total pixels between 655,360 and 8,294,400

Common custom size reference:

| Size | Resolution | Use Case |
|---|---|---|
| `1920x1080` | 1080p | Blog covers, web banners |
| `1080x1920` | 1080p portrait | Phone wallpapers, social media stories |
| `2560x1440` | 2K QHD | Desktop wallpapers |
| `3840x2160` | 4K UHD | High-res posters, large displays |

Larger sizes increase generation time and token consumption. Sizes above 2560x1440 are experimental and may produce less stable results.
:::

#### Specify Output Format and Compression

Control the output format with `output_mime_type` and `output_compression_quality`:

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
- `image/png`: Lossless format, ideal for high-fidelity scenarios (default)
- `image/webp`: Smaller file size, ideal for web display
- `image/jpeg`: Common lossy format, use with `output_compression_quality` to control quality
:::

### Edit Images

Modify an existing image using the `edit_image` API:

::: code-group

```Python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # Replace with your API key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

# First generate an image
generate_response = client.models.generate_images(
    model="openai/gpt-image-2",
    prompt="A cat sitting on a table"
)

# Edit the generated image
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

# Save edited images
for i, img in enumerate(edit_response.generated_images):
    img.image.save(f"edited_{i}.png")
    print(f"Edited image saved as edited_{i}.png")
```

```ts [TypeScript]
const { GoogleGenAI, RawReferenceImage } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: "$ZENMUX_API_KEY", // Replace with your API key
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1",
  },
});

// First generate an image
const generateResponse = await client.models.generateImages({
  model: "openai/gpt-image-2",
  prompt: "A cat sitting on a table",
});

// Edit the generated image
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

#### Edit Images with Mask

Use a mask to specify the editable region of an image. The transparent areas of the mask define where edits will be applied:

::: code-group

```Python [Python]
from google import genai
from google.genai import types
from PIL import Image
import io

client = genai.Client(
    api_key="$ZENMUX_API_KEY",
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

# Load original image and mask
original_image = types.Image.from_file("original.png")
mask_image = types.Image.from_file("mask.png")  # Transparent areas are editable regions

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
    )
)

for i, img in enumerate(edit_response.generated_images):
    img.image.save(f"masked_edit_{i}.png")
```

```ts [TypeScript]
import * as fs from "fs";
const { GoogleGenAI, RawReferenceImage, MaskReferenceImage } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: "$ZENMUX_API_KEY",
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1",
  },
});

// Load original image and mask
const originalImage = {
  imageBytes: fs.readFileSync("original.png"),
  mimeType: "image/png",
};
const maskImage = {
  imageBytes: fs.readFileSync("mask.png"), // Transparent areas are editable regions
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
  },
});

console.log(editResponse);
```

:::

::: tip 💡 API Differences

- **Google Gemini models** use the `generate_content` API and require `response_modalities: ["TEXT", "IMAGE"]`; responses contain both text and images.
- **Non-Google models** use the `generate_images` / `edit_image` API, returning image objects directly with support for image editing.
  :::

## Configuration

### Required Parameters

- **api_key**: Your ZenMux API key
- **vertexai**: Must be set to `true` to enable the Vertex AI protocol
- **base_url**: ZenMux Vertex AI endpoint `https://zenmux.ai/api/vertex-ai`
- **responseModalities**: Response modalities; image generation must include `["TEXT", "IMAGE"]`

### Invocation Modes

ZenMux supports two invocation modes:

- **Streaming** (`generate_content_stream` / `generateContentStream`): Ideal for scenarios requiring real-time feedback
- **Non-streaming** (`generate_content` / `generateContent`): Returns the complete response at once after processing

::: warning ⚠️ Response Handling
Responses from image generation models may contain both text and images. Iterate over `response.parts` to process all content parts.
:::

## Best Practices

1. Prompt Engineering: Use clear and specific descriptions to achieve better generation quality.
2. Error Handling: Add exception handling to manage potential API call failures.
3. Image Saving: The Python SDK provides a convenient `as_image()` method to convert a response part into a PIL Image object.
4. Model Selection: Choose the appropriate model based on your needs; free models are suitable for testing, while paid models provide higher quality.
