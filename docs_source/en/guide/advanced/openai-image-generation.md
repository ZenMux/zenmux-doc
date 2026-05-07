---
head:
  - - meta
    - name: description
      content: OpenAI Images protocol image generation
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, OpenAI Image, image generation, image edit, API
---

# Image Generation - OpenAI Images Protocol

ZenMux supports calling OpenAI image generation models through the OpenAI Images protocol. You can keep using the OpenAI SDK; just point the Base URL to ZenMux and authenticate with your ZenMux API Key.

::: tip 💡 Supported Models
ZenMux continuously updates the OpenAI image generation models it supports. Visit the [ZenMux model catalog](https://zenmux.ai/models?author=openai&sort=newest&output_modalities=image) to check the currently available models.
:::

## Use Cases

The OpenAI Images protocol is suitable for:

- Generating images from text prompts.
- Generating new images from one or more reference images.
- Editing local regions of an image with a mask.
- Receiving partial images through streaming events for a more real-time generation experience.

If you need to call any image generation model through the Google Gemini protocol, see [Image Generation](/guide/advanced/image-generation). OpenAI image models support both the OpenAI Images protocol and the Google Gemini protocol.

## Integration

The OpenAI Images protocol uses the standard OpenAI SDK initialization flow:

::: code-group

```TypeScript [TypeScript]
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1",
  apiKey: process.env.ZENMUX_API_KEY,
});
```

```Python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<ZENMUX_API_KEY>",
)
```

```bash [cURL]
curl https://zenmux.ai/api/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY"
```

:::

## Generate Images

Use `images.generate` to generate images from a text prompt. GPT Image models return `b64_json` by default, which you can decode and save as an image file.

::: code-group

```TypeScript [TypeScript]
import OpenAI from "openai";
import { writeFile } from "fs/promises";

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1",
  apiKey: process.env.ZENMUX_API_KEY,
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

```Python [Python]
import base64
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<ZENMUX_API_KEY>",
)

img = client.images.generate(
    model="gpt-image-2",
    prompt="A cute baby sea otter",
    n=1,
    size="1024x1024",
)

image_bytes = base64.b64decode(img.data[0].b64_json)
with open("output.png", "wb") as f:
    f.write(image_bytes)
```

```bash [cURL]
curl https://zenmux.ai/api/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "A cute baby sea otter",
    "n": 1,
    "size": "1024x1024"
  }' | jq -r '.data[0].b64_json' | base64 --decode > output.png
```

:::

## Edit Images

Use `images.edit` to generate new images from one or more reference images, or combine it with a mask for local edits.

### Generate a New Image from Reference Images

::: code-group

```TypeScript [TypeScript]
import { writeFile } from "fs/promises";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1",
  apiKey: process.env.ZENMUX_API_KEY,
});

const result = await client.images.edit({
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
});

const imageBase64 = result.data[0].b64_json;
const imageBytes = Buffer.from(imageBase64, "base64");
await writeFile("avengers-group.png", imageBytes);
```

```Python [Python]
import base64
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<ZENMUX_API_KEY>",
)

result = client.images.edit(
    model="gpt-image-2",
    images=[
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
    prompt="Turn these reference images into a Marvel Avengers-style group portrait",
)

image_base64 = result.data[0].b64_json
image_bytes = base64.b64decode(image_base64)

with open("avengers-group.png", "wb") as f:
    f.write(image_bytes)
```

```bash [cURL]
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

:::

### Local Edits with a Mask

A mask tells the model which region of the image to edit. The input image and mask should use the same format and dimensions; when using a PNG mask, we recommend including an alpha channel.

::: code-group

```TypeScript [TypeScript]
import fs from "fs";
import OpenAI, { toFile } from "openai";

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1",
  apiKey: process.env.ZENMUX_API_KEY,
});

const rsp = await client.images.edit({
  model: "gpt-image-2",
  image: await toFile(fs.createReadStream("sunlit-lounge.png"), null, {
    type: "image/png",
  }),
  mask: await toFile(fs.createReadStream("mask.png"), null, {
    type: "image/png",
  }),
  prompt: "A sunlit indoor lounge area with a pool containing a flamingo",
});

const imageBase64 = rsp.data[0].b64_json;
const imageBytes = Buffer.from(imageBase64, "base64");
fs.writeFileSync("lounge.png", imageBytes);
```

```Python [Python]
import base64
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<ZENMUX_API_KEY>",
)

result = client.images.edit(
    model="gpt-image-2",
    image=open("sunlit-lounge.png", "rb"),
    mask=open("mask.png", "rb"),
    prompt="A sunlit indoor lounge area with a pool containing a flamingo",
)

image_base64 = result.data[0].b64_json
image_bytes = base64.b64decode(image_base64)

with open("lounge.png", "wb") as f:
    f.write(image_bytes)
```

```bash [cURL]
curl -s -D >(grep -i x-request-id >&2) \
  -o >(jq -r '.data[0].b64_json' | base64 --decode > lounge.png) \
  -X POST "https://zenmux.ai/api/v1/images/edits" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -F "model=gpt-image-2" \
  -F "mask=@mask.png" \
  -F "image[]=@sunlit-lounge.png" \
  -F 'prompt=A sunlit indoor lounge area with a pool containing a flamingo'
```

:::

## Streaming Generation

The OpenAI Images protocol supports returning SSE events with `stream: true`. You can use `partial_images` to control how many intermediate images are returned:

- `partial_images: 0`: return only the final image.
- `partial_images: 1` to `3`: return partial generated images; the final image may complete early.

::: code-group

```TypeScript [TypeScript]
import fs from "fs";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1",
  apiKey: process.env.ZENMUX_API_KEY,
});

const stream = await client.images.generate({
  model: "gpt-image-2",
  prompt: "Draw a river made of white owl feathers through a winter landscape",
  stream: true,
  partial_images: 2,
});

for await (const event of stream) {
  if (event.type === "image_generation.partial_image") {
    const imageBuffer = Buffer.from(event.b64_json, "base64");
    fs.writeFileSync(`river-${event.partial_image_index}.png`, imageBuffer);
  }
}
```

```Python [Python]
import base64
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<ZENMUX_API_KEY>",
)

stream = client.images.generate(
    model="gpt-image-2",
    prompt="Draw a river made of white owl feathers through a winter landscape",
    stream=True,
    partial_images=2,
)

for event in stream:
    if event.type == "image_generation.partial_image":
        image_bytes = base64.b64decode(event.b64_json)
        with open(f"river-{event.partial_image_index}.png", "wb") as f:
            f.write(image_bytes)
```

```bash [cURL]
curl https://zenmux.ai/api/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "Draw a river made of white owl feathers through a winter landscape",
    "stream": true,
    "partial_images": 2
  }' \
  --no-buffer
```

:::

For streaming event formats, see:

- [Image generation streaming events](/api/openai/image-generation-streaming-events)
- [Image edit streaming events](/api/openai/image-edit-streaming-events)

## Output Parameters

Common output parameters include:

| Parameter | Description |
|---|---|
| `size` | Image size, such as `1024x1024`, `1536x1024`, `1024x1536`, or other sizes supported by the model |
| `quality` | Output quality, such as `low`, `medium`, `high`, `auto` |
| `output_format` | Output format, such as `png`, `jpeg`, `webp` |
| `output_compression` | JPEG / WebP compression quality, from 0 to 100 |
| `background` | Background setting, such as `transparent`, `opaque`, `auto`; exact support depends on the model |

For the complete API fields, see:

- [Create image](/api/openai/generate-an-image)
- [Create image edit](/api/openai/create-image-edit)
