---
head:
  - - meta
    - name: description
      content: OpenAI Image 协议图片生成
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, OpenAI Image, image generation, image edit, API
---

# 图片生成-OpenAI Image 协议

ZenMux 支持通过 OpenAI Image 协议调用 OpenAI 系列图片生成模型。你可以继续使用 OpenAI SDK，只需要把 Base URL 指向 ZenMux，并使用 ZenMux API Key。

::: tip 💡 支持模型
ZenMux 支持的 OpenAI 图片生成模型会持续更新。请前往 [ZenMux 模型目录](https://zenmux.ai/models?author=openai&sort=newest&output_modalities=image) 查询当前可用模型。
:::

## 适用场景

OpenAI Image 协议适合以下场景：

- 根据文本提示词生成图片。
- 基于一张或多张参考图生成新图片。
- 使用 mask 对图片局部区域进行编辑。
- 通过流式事件获取 partial image，做更实时的生成体验。

如果你需要使用 Google Gemini 协议调用任意图片生成模型，请参考 [图片生成](/zh/guide/advanced/image-generation)。OpenAI 系列图片模型同时支持 OpenAI Image 协议和 Google Gemini 协议。

## 接入方式

OpenAI Image 协议使用 OpenAI SDK 初始化方式：

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

## 生成图片

使用 `images.generate` 根据文本提示词生成图片。GPT Image 模型默认返回 `b64_json`，你可以将其解码后保存为图片文件。

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

## 编辑图片

使用 `images.edit` 可以基于一张或多张参考图片生成新图片，也可以配合 mask 做局部编辑。

### 使用参考图生成新图片

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
  prompt: "将这几个参考图片做成一个漫威复仇者联盟风格的大合照",
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
    prompt="将这几个参考图片做成一个漫威复仇者联盟风格的大合照",
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
    "prompt": "将这几个参考图片做成一个漫威复仇者联盟风格的大合照"
  }'
```

:::

### 使用 mask 局部编辑

mask 用来告诉模型图片中需要编辑的区域。输入图片和 mask 应保持相同格式与尺寸；使用 PNG mask 时，建议包含 alpha channel。

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

## 流式生成

OpenAI Image 协议支持通过 `stream: true` 返回 SSE 事件。你可以使用 `partial_images` 控制中间图数量：

- `partial_images: 0`：只返回最终图片。
- `partial_images: 1` 到 `3`：返回部分生成图，最终图可能提前完成。

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

流式事件格式可参考：

- [图片生成流式事件](/zh/api/openai/image-generation-streaming-events)
- [图片编辑流式事件](/zh/api/openai/image-edit-streaming-events)

## 输出参数

常用输出参数包括：

| 参数 | 说明 |
|---|---|
| `size` | 图片尺寸，例如 `1024x1024`、`1536x1024`、`1024x1536` 或模型支持的其他尺寸 |
| `quality` | 输出质量，例如 `low`、`medium`、`high`、`auto` |
| `output_format` | 输出格式，例如 `png`、`jpeg`、`webp` |
| `output_compression` | JPEG / WebP 压缩质量，取值 0-100 |
| `background` | 背景设置，例如 `transparent`、`opaque`、`auto`，具体支持情况取决于模型 |

完整接口字段请参考：

- [Create image](/zh/api/openai/generate-an-image)
- [Create image edit](/zh/api/openai/create-image-edit)
