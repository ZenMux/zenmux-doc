---
head:
  - - meta
    - name: description
      content: Video generation
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, video, generation, API, Veo, Seedance
---

# Video Generation

ZenMux supports calling video generation models via the Vertex AI protocol. This guide explains how to generate videos with ZenMux.

::: tip 💡 About Video Generation
Video generation models can automatically produce high-quality video content from text descriptions. ZenMux aggregates leading video generation models such as Google Veo and ByteDance Seedance, allowing you to call them easily through a unified API interface.
:::

## Supported Models

The currently supported video generation models include (continuously updated):

- `google/veo-3.1-generate-001` — Google Veo 3.1, supports high-quality video generation
- `volcengine/doubao-seedance-1.5-pro` — ByteDance Seedance 1.5 Pro
- `volcengine/doubao-seedance-2` — ByteDance Seedance 2, the latest-generation video generation model

::: tip 📚 More Models
Visit the [ZenMux model list](https://zenmux.ai/models) to search and view all available video generation models.
:::

## Text-to-Video

Generate videos directly from a text prompt using an asynchronous workflow: submit a generation request first, then poll until generation completes, and finally retrieve the result.

::: code-group

```Python [Google Veo 3.1]
from google import genai
from google.genai import types
import time

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # Replace with your API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai/v1"
    )
)

# Step 1: Submit a video generation request
operation = client.models.generate_videos(
    model="google/veo-3.1-generate-001",  # [!code highlight]
    prompt="A golden retriever running on the beach at sunset"
)

# Step 2: Poll until generation is complete
while not operation.done:
    time.sleep(15)
    operation = client.operations.get(operation)

# Step 3: Retrieve the generated results
for video in operation.response.generated_videos:
    print(video)
```

```Python [Seedance 1.5 Pro]
from google import genai
from google.genai import types
import time

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # Replace with your API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai/v1"
    )
)

# Step 1: Submit a video generation request
operation = client.models.generate_videos(
    model="volcengine/doubao-seedance-1.5-pro",  # [!code highlight]
    prompt="A golden retriever running on the beach at sunset"
)

# Step 2: Poll until generation is complete
while not operation.done:
    time.sleep(15)
    operation = client.operations.get(operation)

# Step 3: Retrieve the generated results
for video in operation.response.generated_videos:
    print(video)
```

```Python [Seedance 2]
from google import genai
from google.genai import types
import time

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # Replace with your API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai/v1"
    )
)

# Step 1: Submit a video generation request
operation = client.models.generate_videos(
    model="volcengine/doubao-seedance-2",  # [!code highlight]
    prompt="A golden retriever running on the beach at sunset"
)

# Step 2: Poll until generation is complete
while not operation.done:
    time.sleep(15)
    operation = client.operations.get(operation)

# Step 3: Retrieve the generated results
for video in operation.response.generated_videos:
    print(video)
```

:::

## Image-to-Video

In addition to text-to-video, ZenMux also supports passing an image as the starting frame and generating a video using a text prompt. Provide the image data via the `image` parameter.

::: code-group

```Python [Google Veo 3.1]
from google import genai
from google.genai import types
import time

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # Replace with your API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai/v1"
    )
)

# Read a local image
with open("input_image.png", "rb") as f:
    image_bytes = f.read()

# Step 1: Submit an image-to-video request
operation = client.models.generate_videos(
    model="google/veo-3.1-generate-001",  # [!code highlight]
    image=types.Image(image_bytes=image_bytes, mime_type="image/png"),  # [!code highlight]
    prompt="The dog stands up and runs toward the ocean waves"
)

# Step 2: Poll until generation is complete
while not operation.done:
    time.sleep(15)
    operation = client.operations.get(operation)

# Step 3: Retrieve the generated results
for video in operation.response.generated_videos:
    print(video)
```

```Python [Seedance 1.5 Pro]
from google import genai
from google.genai import types
import time

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # Replace with your API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai/v1"
    )
)

# Read a local image
with open("input_image.png", "rb") as f:
    image_bytes = f.read()

# Step 1: Submit an image-to-video request
operation = client.models.generate_videos(
    model="volcengine/doubao-seedance-1.5-pro",  # [!code highlight]
    image=types.Image(image_bytes=image_bytes, mime_type="image/png"),  # [!code highlight]
    prompt="The dog stands up and runs toward the ocean waves"
)

# Step 2: Poll until generation is complete
while not operation.done:
    time.sleep(15)
    operation = client.operations.get(operation)

# Step 3: Retrieve the generated results
for video in operation.response.generated_videos:
    print(video)
```

```Python [Seedance 2]
from google import genai
from google.genai import types
import time

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # Replace with your API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai/v1"
    )
)

# Read a local image
with open("input_image.png", "rb") as f:
    image_bytes = f.read()

# Step 1: Submit an image-to-video request
operation = client.models.generate_videos(
    model="volcengine/doubao-seedance-2",  # [!code highlight]
    image=types.Image(image_bytes=image_bytes, mime_type="image/png"),  # [!code highlight]
    prompt="The dog stands up and runs toward the ocean waves"
)

# Step 2: Poll until generation is complete
while not operation.done:
    time.sleep(15)
    operation = client.operations.get(operation)

# Step 3: Retrieve the generated results
for video in operation.response.generated_videos:
    print(video)
```

:::

::: tip 💡 Image-to-Video Notes

- The `image` parameter is passed via `types.Image`, which supports `image_bytes` (binary data) and `mime_type` (e.g., `image/png`, `image/jpeg`).
- The `prompt` parameter is optional and is used to describe how the content in the image should move or change.
- The image will be used as the starting frame of the video, and the model will generate subsequent animation based on the image content and the prompt.
  :::

## Configuration

### Required Parameters

- **api_key**: Your ZenMux API key
- **vertexai**: Must be set to `true` to enable the Vertex AI protocol
- **base_url**: ZenMux Vertex AI endpoint `https://zenmux.ai/api/vertex-ai/v1`
- **model**: The video generation model name, such as `google/veo-3.1-generate-001`
- **prompt**: A text prompt describing the video content to generate

### Optional Parameters

You can customize video properties such as aspect ratio, duration, and audio via the `config` parameter:

| Parameter         | Type   | Description             | Example Values                |
| ----------------- | ------ | ----------------------- | ----------------------------- |
| `aspectRatio`     | `str`  | Video aspect ratio      | `"16:9"`, `"9:16"`, `"1:1"`   |
| `resolution`      | `str`  | Video resolution        | `"720p"`, `"1080p"`           |
| `durationSeconds` | `int`  | Video duration (seconds) | `5`, `8`, `10`               |
| `generateAudio`   | `bool` | Whether to generate audio | `True`, `False`              |

**Configuration example:**

```python
operation = client.models.generate_videos(
    model="google/veo-3.1-generate-001",
    prompt="A cat playing piano in a cozy room with warm lighting",
    config=types.GenerateVideosConfig(
        aspectRatio="16:9",       # Landscape 16:9  # [!code highlight]
        resolution="720p",        # 720p resolution  # [!code highlight]
        durationSeconds=8,        # 8-second video duration  # [!code highlight]
        generateAudio=True,       # Generate a video with audio  # [!code highlight]
    )
)
```

::: tip 💡 Parameter Support Notes
Support for optional parameters may vary by model. If you pass a parameter value that the model does not support, the API will return an error. We recommend testing with default parameters first, then adjusting gradually.
:::

### Call Flow

Video generation is an asynchronous process with three steps:

1. **Submit request** (`generate_videos`): Send a video generation request and receive an `operation` object
2. **Poll status** (`operations.get`): Check generation status periodically; a 15-second interval is recommended
3. **Retrieve results**: When `operation.done` is `True`, get the videos from `operation.response.generated_videos`

::: warning ⚠️ Generation Time
Video generation typically takes a while (from tens of seconds to several minutes). Please be patient while polling completes, and avoid setting the polling interval too short.
:::

## Best Practices

1. **Prompt optimization**: Use clear, specific scene descriptions, including subject, actions, environment, lighting, and other key elements
2. **Polling interval**: Use a 15-second polling interval to avoid overly frequent requests
3. **Error handling**: Add exception handling and a timeout mechanism to prevent infinite polling
4. **Model selection**: Choose the right model for your needs — Veo 3.1 excels at high-quality general video generation, while the Seedance family has unique strengths in specific scenarios