# 多模态

ZenMux 支持多模态输入，除文本输入外，还支持图片和PDF输入，音频、视频敬请期待～

## 图片输入

### 使用图片链接

::: code-group

```python [Python]
import requests
import json

url = "https://zenmux.ai/api/v1/chat/completions"
headers = {
  "Authorization": "Bearer {你的 ZENMUX_API_KEY}", # [!code highlight]
  "Content-Type": "application/json"
}
payload = {
  "model": "google/gemini-2.5-pro",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "请分析一下图片的内容"
        },
        {
          "type": "image_url",# [!code highlight]
          "image_url": {# [!code highlight]
            "url": "https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/05/e9445SU/shengchengtupian2025-04-09-19_31.png",# [!code highlight]
          }
        }
      ]
    }
  ]
}
response = requests.post(url, headers=headers, json=payload)
print(response.json())

```


```ts [TypeScript]
const response = await fetch("https://zenmux.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: "Bearer <你的 ZENMUX_API_KEY>", // [!code highlight]
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
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
            image_url: { // [!code highlight]
              url: "https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/05/e9445SU/shengchengtupian2025-04-09-19_31.png", // [!code highlight]
            }, // [!code highlight]
          },
        ],
      },
    ],
  }),
});

const data = await response.json();
console.log(data);

```
:::

### 使用图片 Base64编码

::: code-group

```python [Python]
import requests
import json
import base64
from pathlib import Path

def encode_image_to_base64(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode("utf-8")

url = "https://zenmux.ai/api/v1/chat/completions"
headers = {
  "Authorization": "Bearer {你的 ZENMUX_API_KEY}",
  "Content-Type": "application/json"
}

image_path = "path/to/your/image.jpg"
base64_image = encode_image_to_base64(image_path)
data_url = "data:image/jpeg;base64,{base64_image}"

payload = {
  "model": "google/gemini-2.5-pro",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "请分析一下图片的内容"
        },
        {
          "type": "image_url",  # [!code highlight]
          "image_url": {  # [!code highlight]
            "url": data_url  # [!code highlight]
          }  # [!code highlight]
        }
      ]
    }
  ]
}

response = requests.post(url, headers=headers, json=payload)
print(response.json())

```

```ts [TypeScript]
async function encodeImageToBase64(imagePath: string): Promise<string> {
  const imageBuffer = await fs.promises.readFile(imagePath);
  const base64Image = imageBuffer.toString("base64");
  return `data:image/jpeg;base64,${base64Image}`;
}

const imagePath = "path/to/your/image.jpg";
const base64Image = await encodeImageToBase64(imagePath);

const response = await fetch("https://zenmux.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: "Bearer ${你的 ZENMUX_API_KEY}",  // [!code highlight]
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
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
            image_url: { // [!code highlight]
              url: base64Image, // [!code highlight]
            }, // [!code highlight]
          },
        ],
      },
    ],
  }),
});

const data = await response.json();
console.log(data);

```
:::


## PDF输入

### 使用PDF链接

::: code-group

```python [Python (httpx)]
import requests
import json

url = "https://zenmux.ai/api/v1/chat/completions"
headers = {
  "Authorization": "Bearer {你的 ZENMUX_API_KEY}", # [!code highlight]
  "Content-Type": "application/json"
}
payload = {
  "model": "google/gemini-2.5-pro",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "请分析一下文件的主要内容"
        },
        {
          "type": "file",  # [!code highlight]
          "file": {  # [!code highlight]
            "filename": "test.pdf",  # [!code highlight]
            "file_data": "https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/06/uyZbd8m/xiaoxingxingzhaopengyou.pdf"  # [!code highlight]
          }  # [!code highlight]
        },
      ]
    }
  ]
}
response = requests.post(url, headers=headers, json=payload)
print(response.json())

```

```typescript [TypeScript (fetch)]
const response = await fetch("https://zenmux.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: "Bearer <你的 ZENMUX_API_KEY>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
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
            type: "file",
            file: {
              filename: "test.pdf",
              file_data: "https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/06/uyZbd8m/xiaoxingxingzhaopengyou.pdf",
            },
          },
        ],
      },
    ],
  }),
});

const data = await response.json();
console.log(data);

```
:::

### 使用PDF Base64编码

::: code-group

```python [Python (httpx)]

import requests
import json
import base64
from pathlib import Path

def encode_pdf_to_base64(pdf_path):
  with open(pdf_path, "rb") as pdf_file:
    return base64.b64encode(pdf_file.read()).decode("utf-8")

url = "https://zenmux.ai/api/v1/chat/completions"
headers = {
  "Authorization": "Bearer {你的 ZENMUX_API_KEY}", # [!code highlight]
  "Content-Type": "application/json"
}

pdf_path = "path/to/your/test.pdf"
base64_pdf = encode_pdf_to_base64(pdf_path)
data_url = "data:application/pdf;base64,{base64_pdf}"

payload = {
  "model": "google/gemini-2.5-pro",
  "messages": [
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
          } # [!code highlight]
        },
      ]
    }
  ],
}

response = requests.post(url, headers=headers, json=payload)
print(response.json())

```

```typescript [TypeScript (fetch)]
async function encodePDFToBase64(pdfPath: string): Promise<string> {
  const pdfBuffer = await fs.promises.readFile(pdfPath);
  const base64PDF = pdfBuffer.toString("base64");
  return `data:application/pdf;base64,${base64PDF}`;
}

const pdfPath = "path/to/your/test.pdf";
const base64PDF = await encodePDFToBase64(pdfPath);

const response = await fetch("https://zenmux.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: "Bearer ${你的 ZENMUX_API_KEY}", // [!code highlight]
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
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
            file: { // [!code highlight]
              filename: "test.pdf", // [!code highlight]
              file_data: base64PDF, // [!code highlight]
            }, // [!code highlight]
          },
        ],
      },
    ],
  }),
});

const data = await response.json();
console.log(data);

```
