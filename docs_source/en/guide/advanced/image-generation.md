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

For non-Google models like `openai/gpt-image-1.5` and `qwen/qwen-image-2.0`, use the `generate_images` and `edit_image` APIs.

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
const genai = require("@google/genai");

const client = new genai.GoogleGenAI({
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
const genai = require("@google/genai");

const client = new genai.GoogleGenAI({
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
    {
      referenceId: 1,
      referenceImage: generateResponse.generatedImages[0].image,
    },
  ],
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
