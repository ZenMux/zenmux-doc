---
head:
  - - meta
    - name: description
      content: 多模态
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, multimodal, API
---

# 多模态

ZenMux 支持多模态输入，可通过多种 API 协议使用：

- **OpenAI Chat Completion API**：使用 `image_url`、`file`（PDF/视频）和 `input_audio`（音频）内容类型
- **OpenAI Responses API**：使用 `input_image` 和 `input_file`（仅 PDF）内容类型
- **Anthropic Messages API**：使用 `image`、`document`、`audio` 和 `video` 内容类型，支持 base64 和 URL
- **Google Vertex AI API**：使用 `Part` 对象传递图片、文件、音频和视频

支持的输入类型：

- 文本输入
- 图片输入
- PDF 输入
- 音频输入
- 视频输入

## OpenAI Chat Completion API

### 图片输入

#### 使用图片链接

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
)

response = client.chat.completions.create(
    model="google/gemini-2.5-pro",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "请分析一下图片的内容"
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
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
});

const response = await client.chat.completions.create({
  model: "google/gemini-2.5-pro",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "请分析一下图片的内容",
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

#### 使用图片 Base64 编码

::: code-group

```python [Python]
import base64
from openai import OpenAI

def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

client = OpenAI(
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
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
                    "text": "请分析一下图片的内容"
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
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
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
          text: "请分析一下图片的内容",
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

### PDF 输入

#### 使用 PDF 链接

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
)

response = client.chat.completions.create(
    model="google/gemini-2.5-pro",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "请分析一下文件的主要内容"
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
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
});

const response = await client.chat.completions.create({
  model: "google/gemini-2.5-pro",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "请分析一下文件的主要内容",
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

#### 使用 PDF Base64 编码

::: code-group

```python [Python]
import base64
from openai import OpenAI

def encode_pdf_to_base64(pdf_path):
    with open(pdf_path, "rb") as pdf_file:
        return base64.b64encode(pdf_file.read()).decode("utf-8")

client = OpenAI(
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
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
                    "text": "请分析一下文件的主要内容"
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
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
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
          text: "请分析一下文件的主要内容",
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

### 音频输入

使用 `input_audio` 类型传递音频文件，需要使用 Base64 编码。

::: code-group

```python [Python]
import base64
from openai import OpenAI

def encode_audio_to_base64(audio_path):
    with open(audio_path, "rb") as audio_file:
        return base64.b64encode(audio_file.read()).decode("utf-8")

client = OpenAI(
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
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
                    "text": "请描述这段音频的内容"
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
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
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
          text: "请描述这段音频的内容",
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

### 视频输入

使用 `file` 类型传递视频文件，支持 URL 和 Base64 编码两种方式。

#### 使用视频链接

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
)

response = client.chat.completions.create(
    model="google/gemini-2.5-pro",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "请描述这段视频的内容"
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
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
});

const response = await client.chat.completions.create({
  model: "google/gemini-2.5-pro",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "请描述这段视频的内容",
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

#### 使用视频 Base64 编码

::: code-group

```python [Python]
import base64
from openai import OpenAI

def encode_video_to_base64(video_path):
    with open(video_path, "rb") as video_file:
        return base64.b64encode(video_file.read()).decode("utf-8")

client = OpenAI(
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
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
                    "text": "请描述这段视频的内容"
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
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
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
          text: "请描述这段视频的内容",
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

Responses API 使用 `input_image` 和 `input_file` 内容类型处理多模态输入。

::: warning 注意
当前 Responses API 仅支持图片和 PDF 文件输入，不支持音频和视频输入。如需处理音频或视频，请使用 Chat Completion API 或 Vertex AI API。
:::

### 图片输入

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
)

response = client.responses.create(
    model="openai/gpt-5", # [!code highlight]
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "请分析一下图片的内容"
                },
                {
                    "type": "input_image", # [!code highlight]
                    "image_url": "https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/05/e9445SU/shengchengtupian2025-04-09-19_31.png" # [!code highlight]
                }
            ]
        }
    ]
)

# 提取回答
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
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
});

const response = await client.responses.create({
  model: "openai/gpt-5", // [!code highlight]
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "请分析一下图片的内容",
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

// 提取回答
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

### 使用 Base64 编码

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
                {"type": "input_text", "text": "描述这张图片"},
                {
                    "type": "input_image",
                    "image_url": f"data:image/jpeg;base64,{base64_image}" # [!code highlight]
                }
            ]
        }
    ]
)
```

### PDF 输入

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
)

response = client.responses.create(
    model="openai/gpt-5", # [!code highlight]
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "请总结这个文档的主要内容"},
                {
                    "type": "input_file", # [!code highlight]
                    "file_url": "https://www.example.com/document.pdf" # [!code highlight]
                }
            ]
        }
    ]
)

# 提取回答
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

Anthropic Messages API 支持使用 `image`、`document`、`audio` 和 `video` 内容类型处理多模态输入，支持 base64 编码和 URL 两种方式。

::: tip 提示
通过 ZenMux 的协议转换功能，Anthropic 协议可以路由到支持音频和视频的模型（如 Gemini）。使用支持多模态的模型时，所有输入类型都可用。

**注意**：音频和视频输入需要使用 Google Cloud Storage 的 `gs://` URL 格式（例如 `gs://cloud-samples-data/generative-ai/audio/pixel.mp3`）才能被 Gemini 模型正确处理。如果需要使用本地文件或其他 URL，建议使用 Vertex AI API 协议。
:::

### 支持的格式

| 类型 | 支持的格式                     |
| ---- | ------------------------------ |
| 图片 | JPEG、PNG、GIF、WebP           |
| 文档 | PDF                            |
| 音频 | WAV、MP3、AIFF、AAC、OGG、FLAC |
| 视频 | MP4、AVI、MOV、MKV、WEBM 等    |

### 使用图片 URL

::: code-group

```python [Python]
import anthropic

client = anthropic.Anthropic(
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
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
                    "text": "请分析一下图片的内容"
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
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
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
          text: "请分析一下图片的内容",
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

### 使用 Base64 编码

::: code-group

```python [Python]
import anthropic
import base64

def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

client = anthropic.Anthropic(
    api_key="<你的 ZENMUX_API_KEY>",
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
                    "text": "请分析一下图片的内容"
                }
            ]
        }
    ]
)

print(message.content[0].text)
```

```bash [cURL]
# 先将图片编码为 base64
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

### 多张图片

Claude 支持在单次请求中分析多张图片：

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
                    "text": "请比较这两张图片的异同"
                }
            ]
        }
    ]
)
```

### PDF 输入

#### 使用 PDF 链接

::: code-group

```python [Python]
import anthropic

client = anthropic.Anthropic(
    api_key="<你的 ZENMUX_API_KEY>",
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
                    "text": "请总结这个文档的主要内容"
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
  apiKey: "<你的 ZENMUX_API_KEY>",
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
          text: "请总结这个文档的主要内容",
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

#### 使用 Base64 编码

::: code-group

```python [Python]
import anthropic
import base64

def encode_pdf_to_base64(pdf_path):
    with open(pdf_path, "rb") as pdf_file:
        return base64.b64encode(pdf_file.read()).decode("utf-8")

client = anthropic.Anthropic(
    api_key="<你的 ZENMUX_API_KEY>",
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
                    "text": "请总结这个文档的主要内容"
                }
            ]
        }
    ]
)

print(message.content[0].text)
```

```bash [cURL]
# 先将 PDF 编码为 base64
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

### 多个文档

支持在单次请求中分析多个 PDF 文档：

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
                    "text": "请比较这两个文档的内容"
                }
            ]
        }
    ]
)
```

### 音频输入

支持多种音频格式：WAV、MP3、AIFF、AAC、OGG、FLAC

::: code-group

```python [Python]
import anthropic

client = anthropic.Anthropic(
    api_key="<你的 ZENMUX_API_KEY>",
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
                    "text": "请描述这段音频的内容"
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
  apiKey: "<你的 ZENMUX_API_KEY>",
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
          text: "请描述这段音频的内容",
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

### 视频输入

支持多种视频格式：MP4、AVI、MOV、MKV、WEBM 等

::: code-group

```python [Python]
import anthropic

client = anthropic.Anthropic(
    api_key="<你的 ZENMUX_API_KEY>",
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
                    "text": "请描述这段视频的内容"
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
  apiKey: "<你的 ZENMUX_API_KEY>",
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
          text: "请描述这段视频的内容",
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

Vertex AI 的 Gemini 模型使用 `Part` 对象传递多模态内容，支持图片、PDF、视频等多种格式。

### 支持的格式

| 类型 | 支持的格式                     |
| ---- | ------------------------------ |
| 图片 | PNG、JPEG、WebP、HEIC、HEIF    |
| 文档 | PDF                            |
| 音频 | WAV、MP3、AIFF、AAC、OGG、FLAC |
| 视频 | MP4、AVI、MOV、MKV、WEBM 等    |

### 图片输入

::: code-group

```python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai' # [!code highlight]
    ),
)

# 使用图片 URL
response = client.models.generate_content(
    model="google/gemini-2.5-pro", # [!code highlight]
    contents=[
        types.Part.from_uri( # [!code highlight]
            file_uri="https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/05/e9445SU/shengchengtupian2025-04-09-19_31.png",
            mime_type="image/png"
        ),
        "请分析一下图片的内容"
    ]
)

print(response.text)
```

```typescript [TypeScript]
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
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
        { text: "请分析一下图片的内容" },
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

### 使用 Base64 编码

```python
import base64
from google import genai
from google.genai import types

def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

client = genai.Client(
    api_key="<你的 ZENMUX_API_KEY>",
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
        "请分析一下图片的内容"
    ]
)

print(response.text)
```

### PDF 输入

```python
# 使用 PDF URL
response = client.models.generate_content(
    model="google/gemini-2.5-pro",
    contents=[
        types.Part.from_uri(
            file_uri="https://example.com/document.pdf",
            mime_type="application/pdf" # [!code highlight]
        ),
        "请总结这个文档的主要内容"
    ]
)

print(response.text)
```

### 多张图片

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
        "请比较这两张图片的异同"
    ]
)
```

### 音频输入

Gemini 支持多种音频格式：WAV、MP3、AIFF、AAC、OGG、FLAC

::: code-group

```python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="<你的 ZENMUX_API_KEY>",
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

# 使用音频 URL
response = client.models.generate_content(
    model="google/gemini-2.5-pro",
    contents=[
        types.Part.from_uri(
            file_uri="https://example.com/audio.mp3", # [!code highlight]
            mime_type="audio/mp3" # [!code highlight]
        ),
        "请描述这段音频的内容"
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

### 视频输入

Gemini 支持多种视频格式：MP4、AVI、MOV、MKV、WEBM 等

::: code-group

```python [Python]
from google import genai
from google.genai import types

client = genai.Client(
    api_key="<你的 ZENMUX_API_KEY>",
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

# 使用视频 URL
response = client.models.generate_content(
    model="google/gemini-2.5-pro",
    contents=[
        types.Part.from_uri(
            file_uri="https://example.com/video.mp4", # [!code highlight]
            mime_type="video/mp4" # [!code highlight]
        ),
        "请描述这段视频的内容"
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

## 协议对比

| 特性        | Chat Completion       | Responses API       | Anthropic Messages  | Vertex AI       |
| ----------- | --------------------- | ------------------- | ------------------- | --------------- |
| 图片类型名  | `image_url`           | `input_image`       | `image`             | `Part`          |
| URL 支持    | ✅ `url` 字段         | ✅ `image_url` 字段 | ✅ `type: "url"`    | ✅ `file_uri`   |
| Base64 支持 | ✅ data URL           | ✅ data URL         | ✅ `type: "base64"` | ✅ `from_bytes` |
| PDF 支持    | ✅ `file` 类型        | ✅ `input_file`     | ✅ `document` 类型  | ✅ `mime_type`  |
| 音频支持    | ✅ `input_audio` 类型 | ❌ 不支持           | ✅ `audio` 类型     | ✅ `audio/*`    |
| 视频支持    | ✅ `file` 类型        | ❌ 不支持           | ✅ `video` 类型     | ✅ `video/*`    |
| 多图片      | ✅                    | ✅                  | ✅ 最多 100 张      | ✅ 最多 3000 张 |
