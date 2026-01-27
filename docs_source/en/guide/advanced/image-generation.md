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

- `google/gemini-3-pro-image-preview`
- `google/gemini-3-pro-image-preview-free`
- `google/gemini-2.5-flash-image`
- `google/gemini-2.5-flash-image-free`

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
  apiKey: "$ZENMUX_API_KEY",  // Replace with your API key
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1"
  }
});

// Streaming call: generateContentStream
// Non-streaming call: generateContent
const response = await client.models.generateContent({
  model: "google/gemini-3-pro-image-preview",
  contents: "Generate an image of the Eiffel tower with fireworks in the background",
  config: {
    responseModalities: ["TEXT", "IMAGE"],  // Response modalities must be specified
    // For more configuration options, refer to the Vertex AI official documentation
  }
});

console.log(response);
```

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