---
head:
  - - meta
    - name: description
      content: Multimodal
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, multimodal, API
---

# Multimodal

ZenMux supports multimodal inputs and can be used via multiple API protocols:

- **OpenAI Chat Completion API**: Uses the `image_url`, `file` (PDF/video), and `input_audio` (audio) content types
- **OpenAI Responses API**: Uses the `input_image` and `input_file` (PDF only) content types
- **Anthropic Messages API**: Uses the `image`, `document`, `audio`, and `video` content types; supports both base64 and URL
- **Google Vertex AI API**: Uses `Part` objects to pass images, files, audio, and video

Supported input types:

- Text input
- Image input
- PDF input
- Audio input
- Video input

## OpenAI Chat Completion API

### Image Input

#### Use an image URL

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
)

response = client.chat.completions.create(
    model="google/gemini-2.5-pro",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please analyze the content of the image."
                },
                {
                    "type": "image_url", # [!code highlight]
                    "image_url": { # [!code highlight]
                        "url": "https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/05/e9445SU/shengchengtupian2025-04-09-19_31.png" # [!code highlight]
                    }
                }
            ]
        }
    ]
)

print(response.choices[0].message.content)
```

```ts [TypeScript]
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
});

const response = await client.chat.completions.create({
  model: "google/gemini-2.5-pro",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Please analyze the content of the image.",
        },
        {
          type: "image_url", // [!code highlight]
          image_url: {
            // [!code highlight]
            url: "https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/05/e9445SU/shengchengtupian2025-04-09-19_31.png", // [!code highlight]
          },
        },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);
```

:::

#### Use Base64-encoded image

::: code-group

```python [Python]
import base64
from openai import OpenAI

def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

client = OpenAI(
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
)

image_path = "path/to/your/image.jpg"
base64_image = encode_image_to_base64(image_path)
data_url = f"data:image/jpeg;base64,{base64_image}"

response = client.chat.completions.create(
    model="google/gemini-2.5-pro",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please analyze the content of the image."
                },
                {
                    "type": "image_url", # [!code highlight]
                    "image_url": { # [!code highlight]
                        "url": data_url # [!code highlight]
                    }
                }
            ]
        }
    ]
)

print(response.choices[0].message.content)
```

```ts [TypeScript]
import OpenAI from "openai";
import * as fs from "fs";

async function encodeImageToBase64(imagePath: string): Promise<string> {
  const imageBuffer = await fs.promises.readFile(imagePath);
  const base64Image = imageBuffer.toString("base64");
  return `data:image/jpeg;base64,${base64Image}`;
}

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
});

const imagePath = "path/to/your/image.jpg";
const base64Image = await encodeImageToBase64(imagePath);

const response = await client.chat.completions.create({
  model: "google/gemini-2.5-pro",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Please analyze the content of the image.",
        },
        {
          type: "image_url", // [!code highlight]
          image_url: {
            // [!code highlight]
            url: base64Image, // [!code highlight]
          },
        },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);
```

:::

### PDF Input

#### Use a PDF URL

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
)

response = client.chat.completions.create(
    model="google/gemini-2.5-pro",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please analyze the main content of the file."
                },
                {
                    "type": "file", # [!code highlight]
                    "file": { # [!code highlight]
                        "filename": "test.pdf", # [!code highlight]
                        "file_data": "https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/06/uyZbd8m/xiaoxingxingzhaopengyou.pdf" # [!code highlight]
                    }
                }
            ]
        }
    ]
)

print(response.choices[0].message.content)
```

```typescript [TypeScript]
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
});

const response = await client.chat.completions.create({
  model: "google/gemini-2.5-pro",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Please analyze the main content of the file.",
        },
        {
          type: "file", // [!code highlight]
          file: {
            // [!code highlight]
            filename: "test.pdf", // [!code highlight]
            file_data:
              "https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/06/uyZbd8m/xiaoxingxingzhaopengyou.pdf", // [!code highlight]
          },
        },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);
```

:::

#### Use Base64-encoded PDF

::: code-group

```python [Python]
import base64
from openai import OpenAI

def encode_pdf_to_base64(pdf_path):
    with open(pdf_path, "rb") as pdf_file:
        return base64.b64encode(pdf_file.read()).decode("utf-8")

client = OpenAI(
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
)

pdf_path = "path/to/your/test.pdf"
base64_pdf = encode_pdf_to_base64(pdf_path)
data_url = f"data:application/pdf;base64,{base64_pdf}"

response = client.chat.completions.create(
    model="google/gemini-2.5-pro",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please analyze the main content of the file."
                },
                {
                    "type": "file", # [!code highlight]
                    "file": { # [!code highlight]
                        "filename": "test.pdf", # [!code highlight]
                        "file_data": data_url # [!code highlight]
                    }
                }
            ]
        }
    ]
)

print(response.choices[0].message.content)
```

```typescript [TypeScript]
import OpenAI from "openai";
import * as fs from "fs";

async function encodePDFToBase64(pdfPath: string): Promise<string> {
  const pdfBuffer = await fs.promises.readFile(pdfPath);
  const base64PDF = pdfBuffer.toString("base64");
  return `data:application/pdf;base64,${base64PDF}`;
}

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
});

const pdfPath = "path/to/your/test.pdf";
const base64PDF = await encodePDFToBase64(pdfPath);

const response = await client.chat.completions.create({
  model: "google/gemini-2.5-pro",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Please analyze the main content of the file.",
        },
        {
          type: "file", // [!code highlight]
          file: {
            // [!code highlight]
            filename: "test.pdf", // [!code highlight]
            file_data: base64PDF, // [!code highlight]
          },
        },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);
```

:::

### Audio Input

Use the `input_audio` type to pass an audio file; Base64 encoding is required.

::: code-group

```python [Python]
import base64
from openai import OpenAI

def encode_audio_to_base64(audio_path):
    with open(audio_path, "rb") as audio_file:
        return base64.b64encode(audio_file.read()).decode("utf-8")

client = OpenAI(
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
)

audio_path = "path/to/your/audio.mp3"
base64_audio = encode_audio_to_base64(audio_path)

response = client.chat.completions.create(
    model="google/gemini-2.5-pro",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please describe the content of this audio clip."
                },
                {
                    "type": "input_audio", # [!code highlight]
                    "input_audio": { # [!code highlight]
                        "data": base64_audio, # [!code highlight]
                        "format": "mp3" # [!code highlight]
                    }
                }
            ]
        }
    ]
)

print(response.choices[0].message.content)
```

```typescript [TypeScript]
import OpenAI from "openai";
import * as fs from "fs";

async function encodeAudioToBase64(audioPath: string): Promise<string> {
  const audioBuffer = await fs.promises.readFile(audioPath);
  return audioBuffer.toString("base64");
}

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
});

const audioPath = "path/to/your/audio.mp3";
const base64Audio = await encodeAudioToBase64(audioPath);

const response = await client.chat.completions.create({
  model: "google/gemini-2.5-pro",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Please describe the content of this audio clip.",
        },
        {
          type: "input_audio", // [!code highlight]
          input_audio: {
            // [!code highlight]
            data: base64Audio, // [!code highlight]
            format: "mp3", // [!code highlight]
          },
        },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);
```

:::

### Video Input

Use the `file` type to pass a video file. Both URL and Base64 encoding are supported.

#### Use a video URL

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
)

response = client.chat.completions.create(
    model="google/gemini-2.5-pro",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please describe the content of this video."
                },
                {
                    "type": "file", # [!code highlight]
                    "file": { # [!code highlight]
                        "filename": "video.mp4", # [!code highlight]
                        "file_data": "https://example.com/video.mp4" # [!code highlight]
                    }
                }
            ]
        }
    ]
)

print(response.choices[0].message.content)
```

```typescript [TypeScript]
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
});

const response = await client.chat.completions.create({
  model: "google/gemini-2.5-pro",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Please describe the content of this video.",
        },
        {
          type: "file", // [!code highlight]
          file: {
            // [!code highlight]
            filename: "video.mp4", // [!code highlight]
            file_data: "https://example.com/video.mp4", // [!code highlight]
          },
        },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);
```

:::

#### Use Base64-encoded video

::: code-group

```python [Python]
import base64
from openai import OpenAI

def encode_video_to_base64(video_path):
    with open(video_path, "rb") as video_file:
        return base64.b64encode(video_file.read()).decode("utf-8")

client = OpenAI(
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
)

video_path = "path/to/your/video.mp4"
base64_video = encode_video_to_base64(video_path)
data_url = f"data:video/mp4;base64,{base64_video}"

response = client.chat.completions.create(
    model="google/gemini-2.5-pro",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please describe the content of this video."
                },
                {
                    "type": "file", # [!code highlight]
                    "file": { # [!code highlight]
                        "filename": "video.mp4", # [!code highlight]
                        "file_data": data_url # [!code highlight]
                    }
                }
            ]
        }
    ]
)

print(response.choices[0].message.content)
```

```typescript [TypeScript]
import OpenAI from "openai";
import * as fs from "fs";

async function encodeVideoToBase64(videoPath: string): Promise<string> {
  const videoBuffer = await fs.promises.readFile(videoPath);
  const base64Video = videoBuffer.toString("base64");
  return `data:video/mp4;base64,${base64Video}`;
}

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
});

const videoPath = "path/to/your/video.mp4";
const base64Video = await encodeVideoToBase64(videoPath);

const response = await client.chat.completions.create({
  model: "google/gemini-2.5-pro",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Please describe the content of this video.",
        },
        {
          type: "file", // [!code highlight]
          file: {
            // [!code highlight]
            filename: "video.mp4", // [!code highlight]
            file_data: base64Video, // [!code highlight]
          },
        },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);
```

:::

## OpenAI Responses API

The Responses API uses the `input_image` and `input_file` content types to handle multimodal inputs.

::: warning Note
The Responses API currently supports image and PDF inputs only, and does not support audio or video. To process audio or video, use the Chat Completion API or the Vertex AI API.
:::

### Image Input

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
)

response = client.responses.create(
    model="openai/gpt-5", # [!code highlight]
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "Please analyze the content of the image."
                },
                {
                    "type": "input_image", # [!code highlight]
                    "image_url": "https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/05/e9445SU/shengchengtupian2025-04-09-19_31.png" # [!code highlight]
                }
            ]
        }
    ]
)

# Extract the response
for item in response.output:
    if item.type == "message":
        for content in item.content:
            if content.type == "output_text":
                print(content.text)
```

```typescript [TypeScript]
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1",
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
});

const response = await client.responses.create({
  model: "openai/gpt-5", // [!code highlight]
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "Please analyze the content of the image.",
        },
        {
          type: "input_image", // [!code highlight]
          image_url:
            "https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/05/e9445SU/shengchengtupian2025-04-09-19_31.png", // [!code highlight]
        },
      ],
    },
  ],
});

// Extract the response
for (const item of response.output) {
  if (item.type === "message") {
    for (const content of item.content) {
      if (content.type === "output_text") {
        console.log(content.text);
      }
    }
  }
}
```

```bash [cURL]
curl https://zenmux.ai/api/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "openai/gpt-5",
    "input": [
      {
        "role": "user",
        "content": [
          {
            "type": "input_text",
            "text": "请分析一下图片的内容"
          },
          {
            "type": "input_image",
            "image_url": "https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/05/e9445SU/shengchengtupian2025-04-09-19_31.png"
          }
        ]
      }
    ]
  }'
```

:::

### Use Base64 encoding

```python
import base64

def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

base64_image = encode_image_to_base64("path/to/image.jpg")

response = client.responses.create(
    model="openai/gpt-5",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "Describe this image."},
                {
                    "type": "input_image",
                    "image_url": f"data:image/jpeg;base64,{base64_image}" # [!code highlight]
                }
            ]
        }
    ]
)
```

### PDF Input

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
)

response = client.responses.create(
    model="openai/gpt-5", # [!code highlight]
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "Please summarize the main content of this document."},
                {
                    "type": "input_file", # [!code highlight]
                    "file_url": "https://www.example.com/document.pdf" # [!code highlight]
                }
            ]
        }
    ]
)

# Extract the response
for item in response.output:
    if item.type == "message":
        for content in item.content:
            if content.type == "output_text":
                print(content.text)
```

```bash [cURL]
curl https://zenmux.ai/api/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "openai/gpt-5",
    "input": [
      {
        "role": "user",
        "content": [
          {
            "type": "input_text",
            "text": "请总结这个文档的主要内容"
          },
          {
            "type": "input_file",
            "file_url": "https://www.example.com/document.pdf"
          }
        ]
      }
    ]
  }'
```

:::

## Anthropic Messages API

The Anthropic Messages API supports multimodal inputs using the `image`, `document`, `audio`, and `video` content types, and supports both base64 encoding and URL input.

::: tip Tip
With ZenMux protocol conversion, the Anthropic protocol can be routed to models that support audio and video (such as Gemini). When using multimodal-capable models, all input types are available.

**Note**: Audio and video inputs must use Google Cloud Storage `gs://` URLs (for example, `gs://cloud-samples-data/generative-ai/audio/pixel.mp3`) to be processed correctly by Gemini models. If you need to use local files or other URLs, we recommend using the Vertex AI API protocol.
:::

### Supported formats

| Type | Supported formats               |
| ---- | ------------------------------ |
| Image | JPEG, PNG, GIF, WebP          |
| Document | PDF                        |
| Audio | WAV, MP3, AIFF, AAC, OGG, FLAC |
| Video | MP4, AVI, MOV, MKV, WEBM, etc. |

### Use an image URL

::: code-group

```python [Python]
import anthropic

client = anthropic.Anthropic(
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
    base_url="https://zenmux.ai/api/anthropic" # [!code highlight]
)

message = client.messages.create(
    model="anthropic/claude-sonnet-4.5", # [!code highlight]
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image", # [!code highlight]
                    "source": { # [!code highlight]
                        "type": "url", # [!code highlight]
                        "url": "https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/05/e9445SU/shengchengtupian2025-04-09-19_31.png" # [!code highlight]
                    }
                },
                {
                    "type": "text",
                    "text": "Please analyze the content of the image."
                }
            ]
        }
    ]
)

print(message.content[0].text)
```

```typescript [TypeScript]
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
  baseURL: "https://zenmux.ai/api/anthropic", // [!code highlight]
});

const message = await client.messages.create({
  model: "anthropic/claude-sonnet-4.5", // [!code highlight]
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "image", // [!code highlight]
          source: {
            // [!code highlight]
            type: "url", // [!code highlight]
            url: "https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/05/e9445SU/shengchengtupian2025-04-09-19_31.png", // [!code highlight]
          },
        },
        {
          type: "text",
          text: "Please analyze the content of the image.",
        },
      ],
    },
  ],
});

console.log(message.content[0].text);
```

```bash [cURL]
curl https://zenmux.ai/api/anthropic/v1/messages \
  -H "x-api-key: $ZENMUX_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-4.5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "image",
            "source": {
              "type": "url",
              "url": "https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/05/e9445SU/shengchengtupian2025-04-09-19_31.png"
            }
          },
          {
            "type": "text",
            "text": "请分析一下图片的内容"
          }
        ]
      }
    ]
  }'
```

:::

### Use Base64 encoding

::: code-group

```python [Python]
import anthropic
import base64

def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

client = anthropic.Anthropic(
    api_key="<your ZENMUX_API_KEY>",
    base_url="https://zenmux.ai/api/anthropic"
)

base64_image = encode_image_to_base64("path/to/image.jpg")

message = client.messages.create(
    model="anthropic/claude-sonnet-4.5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64", # [!code highlight]
                        "media_type": "image/jpeg", # [!code highlight]
                        "data": base64_image # [!code highlight]
                    }
                },
                {
                    "type": "text",
                    "text": "Please analyze the content of the image."
                }
            ]
        }
    ]
)

print(message.content[0].text)
```

```bash [cURL]
# First, encode the image as base64
BASE64_IMAGE=$(base64 -i path/to/image.jpg)

curl https://zenmux.ai/api/anthropic/v1/messages \
  -H "x-api-key: $ZENMUX_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-4.5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "image",
            "source": {
              "type": "base64",
              "media_type": "image/jpeg",
              "data": "'"$BASE64_IMAGE"'"
            }
          },
          {
            "type": "text",
            "text": "请分析一下图片的内容"
          }
        ]
      }
    ]
  }'
```

:::

### Multiple images

Claude supports analyzing multiple images in a single request:

```python
message = client.messages.create(
    model="anthropic/claude-sonnet-4.5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {"type": "url", "url": "https://example.com/image1.jpg"}
                },
                {
                    "type": "image",
                    "source": {"type": "url", "url": "https://example.com/image2.jpg"}
                },
                {
                    "type": "text",
                    "text": "Please compare the similarities and differences between these two images."
                }
            ]
        }
    ]
)
```

### PDF Input

#### Use a PDF URL

::: code-group

```python [Python]
import anthropic

client = anthropic.Anthropic(
    api_key="<your ZENMUX_API_KEY>",
    base_url="https://zenmux.ai/api/anthropic"
)

message = client.messages.create(
    model="anthropic/claude-sonnet-4.5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document", # [!code highlight]
                    "source": { # [!code highlight]
                        "type": "url", # [!code highlight]
                        "url": "https://example.com/document.pdf" # [!code highlight]
                    }
                },
                {
                    "type": "text",
                    "text": "Please summarize the main content of this document."
                }
            ]
        }
    ]
)

print(message.content[0].text)
```

```typescript [TypeScript]
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: "<your ZENMUX_API_KEY>",
  baseURL: "https://zenmux.ai/api/anthropic",
});

const message = await client.messages.create({
  model: "anthropic/claude-sonnet-4.5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "document", // [!code highlight]
          source: {
            // [!code highlight]
            type: "url", // [!code highlight]
            url: "https://example.com/document.pdf", // [!code highlight]
          },
        },
        {
          type: "text",
          text: "Please summarize the main content of this document.",
        },
      ],
    },
  ],
});

console.log(message.content[0].text);
```

```bash [cURL]
curl https://zenmux.ai/api/anthropic/v1/messages \
  -H "x-api-key: $ZENMUX_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-4.5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "document",
            "source": {
              "type": "url",
              "url": "https://example.com/document.pdf"
            }
          },
          {
            "type": "text",
            "text": "请总结这个文档的主要内容"
          }
        ]
      }
    ]
  }'
```

:::

#### Use Base64 encoding

::: code-group

```python [Python]
import anthropic
import base64

def encode_pdf_to_base64(pdf_path):
    with open(pdf_path, "rb") as pdf_file:
        return base64.b64encode(pdf_file.read()).decode("utf-8")

client = anthropic.Anthropic(
    api_key="<your ZENMUX_API_KEY>",
    base_url="https://zenmux.ai/api/anthropic"
)

base64_pdf = encode_pdf_to_base64("path/to/document.pdf")

message = client.messages.create(
    model="anthropic/claude-sonnet-4.5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "base64", # [!code highlight]
                        "media_type": "application/pdf", # [!code highlight]
                        "data": base64_pdf # [!code highlight]
                    }
                },
                {
                    "type": "text",
                    "text": "Please summarize the main content of this document."
                }
            ]
        }
    ]
)

print(message.content[0].text)
```

```bash [cURL]
# First, encode the PDF as base64
BASE64_PDF=$(base64 -i path/to/document.pdf)

curl https://zenmux.ai/api/anthropic/v1/messages \
  -H "x-api-key: $ZENMUX_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-4.5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "document",
            "source": {
              "type": "base64",
              "media_type": "application/pdf",
              "data": "'"$BASE64_PDF"'"
            }
          },
          {
            "type": "text",
            "text": "请总结这个文档的主要内容"
          }
        ]
      }
    ]
  }'
```

:::

### Multiple documents

You can analyze multiple PDF documents in a single request:

```python
message = client.messages.create(
    model="anthropic/claude-sonnet-4.5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {"type": "url", "url": "https://example.com/document1.pdf"}
                },
                {
                    "type": "document",
                    "source": {"type": "url", "url": "https://example.com/document2.pdf"}
                },
                {
                    "type": "text",
                    "text": "Please compare the content of these two documents."
                }
            ]
        }
    ]
)
```

### Audio Input

Supports multiple audio formats: WAV, MP3, AIFF, AAC, OGG, FLAC

::: code-group

```python [Python]
import anthropic

client = anthropic.Anthropic(
    api_key="<your ZENMUX_API_KEY>",
    base_url="https://zenmux.ai/api/anthropic"
)

message = client.messages.create(
    model="google/gemini-2.5-pro", # [!code highlight]
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "audio", # [!code highlight]
                    "source": { # [!code highlight]
                        "type": "url", # [!code highlight]
                        "url": "gs://cloud-samples-data/generative-ai/audio/pixel.mp3" # [!code highlight]
                    }
                },
                {
                    "type": "text",
                    "text": "Please describe the content of this audio clip."
                }
            ]
        }
    ]
)

print(message.content[0].text)
```

```typescript [TypeScript]
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: "<your ZENMUX_API_KEY>",
  baseURL: "https://zenmux.ai/api/anthropic",
});

const message = await client.messages.create({
  model: "google/gemini-2.5-pro", // [!code highlight]
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "audio", // [!code highlight]
          source: {
            // [!code highlight]
            type: "url", // [!code highlight]
            url: "gs://cloud-samples-data/generative-ai/audio/pixel.mp3", // [!code highlight]
          },
        },
        {
          type: "text",
          text: "Please describe the content of this audio clip.",
        },
      ],
    },
  ],
});

console.log(message.content[0].text);
```

```bash [cURL]
curl https://zenmux.ai/api/anthropic/v1/messages \
  -H "x-api-key: $ZENMUX_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/gemini-2.5-pro",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "audio",
            "source": {
              "type": "url",
              "url": "gs://cloud-samples-data/generative-ai/audio/pixel.mp3"
            }
          },
          {
            "type": "text",
            "text": "请描述这段音频的内容"
          }
        ]
      }
    ]
  }'
```

:::

### Video Input

Supports multiple video formats: MP4, AVI, MOV, MKV, WEBM, etc.

::: code-group

```python [Python]
import anthropic

client = anthropic.Anthropic(
    api_key="<your ZENMUX_API_KEY>",
    base_url="https://zenmux.ai/api/anthropic"
)

message = client.messages.create(
    model="google/gemini-2.5-pro", # [!code highlight]
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "video", # [!code highlight]
                    "source": { # [!code highlight]
                        "type": "url", # [!code highlight]
                        "url": "gs://cloud-samples-data/video/animals.mp4" # [!code highlight]
                    }
                },
                {
                    "type": "text",
                    "text": "Please describe the content of this video."
                }
            ]
        }
    ]
)

print(message.content[0].text)
```

```typescript [TypeScript]
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: "<your ZENMUX_API_KEY>",
  baseURL: "https://zenmux.ai/api/anthropic",
});

const message = await client.messages.create({
  model: "google/gemini-2.5-pro", // [!code highlight]
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "video", // [!code highlight]
          source: {
            // [!code highlight]
            type: "url", // [!code highlight]
            url: "gs://cloud-samples-data/video/animals.mp4", // [!code highlight]
          },
        },
        {
          type: "text",
          text: "Please describe the content of this video.",
        },
      ],
    },
  ],
});

console.log(message.content[0].text);
```

```bash [cURL]
curl https://zenmux.ai/api/anthropic/v1/messages \
  -H "x-api-key: $ZENMUX_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/gemini-2.5-pro",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "video",
            "source": {
              "type": "url",
              "url": "gs://cloud-samples-data/video/animals.mp4"
            }
          },
          {
            "type": "text",
            "text": "请描述这段视频的内容"
          }
        ]
      }
    ]
  }'
```

:::

## Google Vertex AI API

Vertex AI’s Gemini models use `Part` objects to pass multimodal content, supporting images, PDFs, videos, and more.

### Supported formats

| Type | Supported formats               |
| ---- | ------------------------------ |
| Image | PNG, JPEG, WebP, HEIC, HEIF   |
| Document | PDF                        |
| Audio | WAV, MP3, AIFF, AAC, OGG, FLAC |
| Video | MP4, AVI, MOV, MKV, WEBM, etc. |

### Image Input

::: code-group

```python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai' # [!code highlight]
    ),
)

# Use an image URL
response = client.models.generate_content(
    model="google/gemini-2.5-pro", # [!code highlight]
    contents=[
        types.Part.from_uri( # [!code highlight]
            file_uri="https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/05/e9445SU/shengchengtupian2025-04-09-19_31.png",
            mime_type="image/png"
        ),
        "Please analyze the content of the image."
    ]
)

print(response.text)
```

```typescript [TypeScript]
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai", // [!code highlight]
    apiVersion: "v1",
  },
});

const response = await client.models.generateContent({
  model: "google/gemini-2.5-pro", // [!code highlight]
  contents: [
    {
      role: "user",
      parts: [
        {
          fileData: {
            // [!code highlight]
            fileUri:
              "https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/05/e9445SU/shengchengtupian2025-04-09-19_31.png", // [!code highlight]
            mimeType: "image/png", // [!code highlight]
          },
        },
        { text: "Please analyze the content of the image." },
      ],
    },
  ],
});

console.log(response.text);
```

```bash [cURL]
curl https://zenmux.ai/api/vertex-ai/v1/projects/PROJECT_ID/locations/LOCATION/publishers/google/models/gemini-2.5-pro:generateContent \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "role": "user",
      "parts": [
        {
          "fileData": {
            "fileUri": "https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/05/e9445SU/shengchengtupian2025-04-09-19_31.png",
            "mimeType": "image/png"
          }
        },
        {"text": "请分析一下图片的内容"}
      ]
    }]
  }'
```

:::

### Use Base64 encoding

```python
import base64
from google import genai
from google.genai import types

def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

client = genai.Client(
    api_key="<your ZENMUX_API_KEY>",
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

base64_image = encode_image_to_base64("path/to/image.jpg")

response = client.models.generate_content(
    model="google/gemini-2.5-pro",
    contents=[
        types.Part.from_bytes( # [!code highlight]
            data=base64.b64decode(base64_image), # [!code highlight]
            mime_type="image/jpeg" # [!code highlight]
        ),
        "Please analyze the content of the image."
    ]
)

print(response.text)
```

### PDF Input

```python
# Use a PDF URL
response = client.models.generate_content(
    model="google/gemini-2.5-pro",
    contents=[
        types.Part.from_uri(
            file_uri="https://example.com/document.pdf",
            mime_type="application/pdf" # [!code highlight]
        ),
        "Please summarize the main content of this document."
    ]
)

print(response.text)
```

### Multiple images

```python
response = client.models.generate_content(
    model="google/gemini-2.5-pro",
    contents=[
        types.Part.from_uri(
            file_uri="https://example.com/image1.jpg",
            mime_type="image/jpeg"
        ),
        types.Part.from_uri(
            file_uri="https://example.com/image2.jpg",
            mime_type="image/jpeg"
        ),
        "Please compare the similarities and differences between these two images."
    ]
)
```

### Audio Input

Gemini supports multiple audio formats: WAV, MP3, AIFF, AAC, OGG, FLAC

::: code-group

```python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="<your ZENMUX_API_KEY>",
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

# Use an audio URL
response = client.models.generate_content(
    model="google/gemini-2.5-pro",
    contents=[
        types.Part.from_uri(
            file_uri="https://example.com/audio.mp3", # [!code highlight]
            mime_type="audio/mp3" # [!code highlight]
        ),
        "Please describe the content of this audio clip."
    ]
)

print(response.text)
```

```bash [cURL]
curl https://zenmux.ai/api/vertex-ai/v1/projects/PROJECT_ID/locations/LOCATION/publishers/google/models/gemini-2.5-pro:generateContent \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "role": "user",
      "parts": [
        {
          "fileData": {
            "fileUri": "https://example.com/audio.mp3",
            "mimeType": "audio/mp3"
          }
        },
        {"text": "请描述这段音频的内容"}
      ]
    }]
  }'
```

:::

### Video Input

Gemini supports multiple video formats: MP4, AVI, MOV, MKV, WEBM, etc.

::: code-group

```python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="<your ZENMUX_API_KEY>",
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

# Use a video URL
response = client.models.generate_content(
    model="google/gemini-2.5-pro",
    contents=[
        types.Part.from_uri(
            file_uri="https://example.com/video.mp4", # [!code highlight]
            mime_type="video/mp4" # [!code highlight]
        ),
        "Please describe the content of this video."
    ]
)

print(response.text)
```

```bash [cURL]
curl https://zenmux.ai/api/vertex-ai/v1/projects/PROJECT_ID/locations/LOCATION/publishers/google/models/gemini-2.5-pro:generateContent \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "role": "user",
      "parts": [
        {
          "fileData": {
            "fileUri": "https://example.com/video.mp4",
            "mimeType": "video/mp4"
          }
        },
        {"text": "请描述这段视频的内容"}
      ]
    }]
  }'
```

:::

## Protocol Comparison

| Feature       | Chat Completion       | Responses API       | Anthropic Messages  | Vertex AI       |
| ----------- | --------------------- | ------------------- | ------------------- | --------------- |
| Image type name  | `image_url`           | `input_image`       | `image`             | `Part`          |
| URL support    | ✅ `url` field         | ✅ `image_url` field | ✅ `type: "url"`    | ✅ `file_uri`   |
| Base64 support | ✅ data URL           | ✅ data URL         | ✅ `type: "base64"` | ✅ `from_bytes` |
| PDF support    | ✅ `file` type        | ✅ `input_file`     | ✅ `document` type  | ✅ `mime_type`  |
| Audio support    | ✅ `input_audio` type | ❌ Not supported           | ✅ `audio` type     | ✅ `audio/*`    |
| Video support    | ✅ `file` type        | ❌ Not supported           | ✅ `video` type     | ✅ `video/*`    |
| Multiple images      | ✅                    | ✅                  | ✅ Up to 100 images      | ✅ Up to 3000 images |