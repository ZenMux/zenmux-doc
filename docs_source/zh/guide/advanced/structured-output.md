---
head:
  - - meta
    - name: description
      content: 结构化输出
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, structured, output, OpenAI, GPT, API
---

# 结构化输出

ZenMux 提供结构化输出功能，确保模型响应严格遵循您定义的[JSON Schema](https://json-schema.org/)格式。
当您有固定的结构化数据需求时，您可以用到此功能！

ZenMux 支持多种 API 协议的结构化输出：

- **OpenAI Chat Completion API**：使用 `response_format` 参数
- **OpenAI Responses API**：使用 `text.format` 参数
- **Anthropic Messages API**：使用 `output_config.format` 参数（推荐）或工具调用
- **Google Vertex AI API**：使用 `responseMimeType` + `responseSchema` 参数

## OpenAI Chat Completion API

### 参数说明

**response_format**

- 设置{ "type": "json_object" }, 输出是有效的 JSON 格式，但不保证特定的结构或字段。
- 设置{ "type": "json_schema", "json_schema": {...} }, 更严格的控制 JSON 输出结构, 提供更强的类型和结构保证

1. 设置 json_object 模式

输入结构：

```json
{
  "response_format": {
    "type": "json_object"
  }
}
```

输出结构: content 会返回有效的 JSON 格式内容

```json
{
    "model": "openai/gpt-5-nano",
    "choices": [
        {
            "message": {
                // 实际content为json字符串，这个为了可读性，展示为json
                "content": {
                    "description": "I am ChatGPT, an AI assistant built by OpenAI. I help answer questions, brainstorm ideas, draft text, explain concepts, debug code, and learn topics. I use patterns from training data to generate helpful, clear responses while recognizing limits and inviting follow-up questions. I adapt tone and detail to your needs."
                }
            }
            ....
        }
    ]
    ....
}
```

2. 设置 json_schema 模式

输入按照标准的 [JSON Schema](https://json-schema.org/) 格式定义好

```json
{
  "response_format": {
    "type": "json_schema",
    // 标准的json_schema数据
    "json_schema": {
      "name": "role",
      "description": "Introduce yourself",
      "schema": {
        "type": "object",
        "description": "Your messages",
        "properties": {
          "name": {
            "type": "string",
            "description": "your name"
          },
          "city": {
            "type": "string",
            "description": "where your city"
          },
          "desc": {
            "type": "string",
            "description": "description"
          }
        },
        "required": ["name", "city", "desc"],
        "additionalProperties": false
      }
    }
  }
}
```

输出的 content 会按照指定的 schema 格式返回 JSON 数据

```json
{
    "model": "openai/gpt-5-nano",
    "choices": [
        {
            "message": {
                // 实际content为json字符串，这个为了可读性，展示为json
                "content": {
                    "name": "ChatGPT",
                    "city": "Internet",
                    "desc": "I am ChatGPT, an AI language model created by OpenAI. I help with questions, ideas, writing, and problem-solving. I learn from patterns in text and aim to be helpful, accurate, and respectful. I don't have personal experiences, but I strive to understand your needs and respond clearly and kindly today."
                }
                ...
            }
        }
    ],
    ...
}
```

### API 调用示例

::: code-group

```python [Python]
from openai import OpenAI

# 1. 初始化 OpenAI 客户端
client = OpenAI(
    # 2. 将基础 URL 指向 ZenMux 端点
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    # 3. 替换为你从 ZenMux 用户控制台获取的 API Key
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
)

# 4. 发起请求
completion = client.chat.completions.create(
    # 5. 指定你想使用的模型，格式为 "供应商/模型名称"
    model="openai/gpt-5", # [!code highlight]
    messages=[
        {
            "role": "user",
            "content": "Hi, who are you? Describe yourself using about 50 words. Use JSON response format?" # [!code highlight]
        }
    ],
    # 方式一: 输出是有效的JSON格式，但不保证特定的结构或字段。
    # response_format = {
    #      "type": "json_object"
    #  }
    # 方式二: 更严格地控制 JSON 输出结构，提供更强的类型和结构保证
    response_format = { # [!code highlight]
        "type": "json_schema", # [!code highlight]
        "json_schema": {
            "name": "role",
            "description": "Introduce yourself",
            "schema": {
                "type": "object",
                "description": "Your messages",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "your name"
                    },
                    "city": {
                        "type": "string",
                        "description": "where your city"
                    },
                    "desc": {
                        "type": "string",
                        "description": "description"
                    }
                },
                "required": ["name", "city", "desc"],
                "additionalProperties": False
            }
        }
    }
)

print(completion.choices[0].message.content)
```

```ts [TypeScript]
import OpenAI from "openai";

// 1. 初始化 OpenAI 客户端
const openai = new OpenAI({
  // 2. 将基础 URL 指向 ZenMux 端点
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  // 3. 替换为你从 ZenMux 用户控制台获取的 API Key
  apiKey = "<你的 ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  // 4. 发起请求
  const completion = await openai.chat.completions.create({
    // 5. 指定你想使用的模型，格式为 "供应商/模型名称"
    model: "openai/gpt-5",
    messages: [
      {
        role: "user",
        content:
          "Hi, who are you? Describe yourself using about 50 words. Use JSON response format?",
      },
    ],
    // 方式一: 输出是有效的JSON格式，但不保证特定的结构或字段。
    // response_format: {
    //     "type": "json_object"
    // }
    // 方式二: 更严格地控制 JSON 输出结构，提供更强的类型和结构保证
    response_format: {
      type: "json_schema", // [!code highlight]
      json_schema: {
        // [!code highlight]
        name: "role",
        description: "Introduce yourself",
        schema: {
          type: "object",
          description: "Your messages",
          properties: {
            name: {
              type: "string",
              description: "your name",
            },
            city: {
              type: "string",
              description: "where your city",
            },
            desc: {
              type: "string",
              description: "description",
            },
          },
          required: ["name", "city", "desc"],
          additionalProperties: false,
        },
      },
    },
  });

  console.log(completion.choices[0].message.content);
}

main();
```

:::

## OpenAI Responses API

OpenAI Responses API 使用 `text.format` 参数来控制结构化输出，而非 `response_format`。

### 参数说明

**text.format**

- 设置 `{ "type": "text" }`：普通文本输出（默认）
- 设置 `{ "type": "json_object" }`：JSON mode，保证输出是合法 JSON
- 设置 `{ "type": "json_schema", "json_schema": {...} }`：Structured Outputs，严格按照 JSON Schema 输出

### API 调用示例

::: code-group

```python [Python]
from openai import OpenAI

# 1. 初始化 OpenAI 客户端
client = OpenAI(
    # 2. 将基础 URL 指向 ZenMux 端点
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    # 3. 替换为你从 ZenMux 用户控制台获取的 API Key
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
)

# 4. 使用 Responses API 发起请求
response = client.responses.create(
    # 5. 指定你想使用的模型
    model="openai/gpt-5", # [!code highlight]
    input="Hi, who are you? Describe yourself using about 50 words.",
    # 方式一: JSON mode
    # text={
    #     "format": { "type": "json_object" }
    # }
    # 方式二: Structured Outputs（推荐）
    text={ # [!code highlight]
        "format": { # [!code highlight]
            "type": "json_schema", # [!code highlight]
            "name": "role",
            "description": "Introduce yourself",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "your name"
                    },
                    "city": {
                        "type": "string",
                        "description": "where your city"
                    },
                    "desc": {
                        "type": "string",
                        "description": "description"
                    }
                },
                "required": ["name", "city", "desc"],
                "additionalProperties": False
            }
        }
    }
)

# 获取输出文本
for item in response.output:
    if item.type == "message":
        for content in item.content:
            if content.type == "output_text":
                print(content.text)
```

```ts [TypeScript]
import OpenAI from "openai";

// 1. 初始化 OpenAI 客户端
const openai = new OpenAI({
  // 2. 将基础 URL 指向 ZenMux 端点
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  // 3. 替换为你从 ZenMux 用户控制台获取的 API Key
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  // 4. 使用 Responses API 发起请求
  const response = await openai.responses.create({
    // 5. 指定你想使用的模型
    model: "openai/gpt-5", // [!code highlight]
    input: "Hi, who are you? Describe yourself using about 50 words.",
    // 方式一: JSON mode
    // text: {
    //   format: { type: "json_object" }
    // }
    // 方式二: Structured Outputs（推荐）
    text: {
      // [!code highlight]
      format: {
        // [!code highlight]
        type: "json_schema", // [!code highlight]
        name: "role",
        description: "Introduce yourself",
        strict: true,
        schema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "your name",
            },
            city: {
              type: "string",
              description: "where your city",
            },
            desc: {
              type: "string",
              description: "description",
            },
          },
          required: ["name", "city", "desc"],
          additionalProperties: false,
        },
      },
    },
  });

  // 获取输出文本
  for (const item of response.output) {
    if (item.type === "message") {
      for (const content of item.content) {
        if (content.type === "output_text") {
          console.log(content.text);
        }
      }
    }
  }
}

main();
```

```bash [cURL]
curl https://zenmux.ai/api/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "openai/gpt-5",
    "input": "Hi, who are you? Describe yourself using about 50 words.",
    "text": {
      "format": {
        "type": "json_schema",
        "name": "role",
        "description": "Introduce yourself",
        "strict": true,
        "schema": {
          "type": "object",
          "properties": {
            "name": { "type": "string", "description": "your name" },
            "city": { "type": "string", "description": "where your city" },
            "desc": { "type": "string", "description": "description" }
          },
          "required": ["name", "city", "desc"],
          "additionalProperties": false
        }
      }
    }
  }'
```

:::

## Anthropic Messages API

Anthropic Claude 模型支持两种结构化输出方式：

1. **JSON 输出（推荐）**：使用 `output_config.format` 参数直接指定 JSON Schema
2. **工具调用**：通过定义工具并强制调用来获取结构化数据

### 方式一：JSON 输出（output_config）

这是 Anthropic 推荐的结构化输出方式，通过 `output_config.format` 参数直接控制 Claude 的响应格式。

**参数说明**

- `output_config.format.type`：设置为 `"json_schema"`
- `output_config.format.schema`：定义输出结构的 JSON Schema

::: code-group

```python [Python]
import anthropic

# 1. 初始化 Anthropic 客户端
client = anthropic.Anthropic(
    # 2. 替换为你从 ZenMux 用户控制台获取的 API Key
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
    # 3. 将基础 URL 指向 ZenMux 端点
    base_url="https://zenmux.ai/api/anthropic" # [!code highlight]
)

# 4. 发起请求，使用 output_config 指定结构化输出
message = client.messages.create(
    model="anthropic/claude-sonnet-4.5", # [!code highlight]
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Hi, who are you? Describe yourself using about 50 words."
        }
    ],
    output_config={ # [!code highlight]
        "format": { # [!code highlight]
            "type": "json_schema", # [!code highlight]
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "your name"
                    },
                    "city": {
                        "type": "string",
                        "description": "where your city"
                    },
                    "desc": {
                        "type": "string",
                        "description": "description about yourself"
                    }
                },
                "required": ["name", "city", "desc"],
                "additionalProperties": False
            }
        }
    }
)

# 5. 直接获取结构化 JSON
import json
result = json.loads(message.content[0].text)
print(result)
```

```ts [TypeScript]
import Anthropic from "@anthropic-ai/sdk";

// 1. 初始化 Anthropic 客户端
const anthropic = new Anthropic({
  // 2. 替换为你从 ZenMux 用户控制台获取的 API Key
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
  // 3. 将基础 URL 指向 ZenMux 端点
  baseURL: "https://zenmux.ai/api/anthropic", // [!code highlight]
});

async function main() {
  // 4. 发起请求，使用 output_config 指定结构化输出
  const message = await anthropic.messages.create({
    model: "anthropic/claude-sonnet-4.5", // [!code highlight]
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "Hi, who are you? Describe yourself using about 50 words.",
      },
    ],
    output_config: {
      // [!code highlight]
      format: {
        // [!code highlight]
        type: "json_schema", // [!code highlight]
        schema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "your name",
            },
            city: {
              type: "string",
              description: "where your city",
            },
            desc: {
              type: "string",
              description: "description about yourself",
            },
          },
          required: ["name", "city", "desc"],
          additionalProperties: false,
        },
      },
    },
  });

  // 5. 直接获取结构化 JSON
  const result = JSON.parse(message.content[0].text);
  console.log(result);
}

main();
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
        "content": "Hi, who are you? Describe yourself using about 50 words."
      }
    ],
    "output_config": {
      "format": {
        "type": "json_schema",
        "schema": {
          "type": "object",
          "properties": {
            "name": { "type": "string", "description": "your name" },
            "city": { "type": "string", "description": "where your city" },
            "desc": { "type": "string", "description": "description about yourself" }
          },
          "required": ["name", "city", "desc"],
          "additionalProperties": false
        }
      }
    }
  }'
```

:::

**输出示例**

响应会在 `response.content[0].text` 中返回有效的 JSON：

```json
{
  "name": "Claude",
  "city": "San Francisco",
  "desc": "I am Claude, an AI assistant made by Anthropic. I help with analysis, writing, coding, and answering questions. I aim to be helpful, harmless, and honest in all interactions."
}
```

### 方式二：工具调用（Tool Use）

通过定义一个工具并强制模型调用它，也可以获得符合指定 JSON Schema 的结构化数据。

**实现原理**

1. 定义一个工具，其 `input_schema` 描述你期望的输出结构
2. 设置 `tool_choice` 为 `{"type": "tool", "name": "工具名"}` 强制模型调用该工具
3. 从返回的 `tool_use` 内容块中提取结构化数据

::: code-group

```python [Python]
import anthropic

# 1. 初始化 Anthropic 客户端
client = anthropic.Anthropic(
    # 2. 替换为你从 ZenMux 用户控制台获取的 API Key
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
    # 3. 将基础 URL 指向 ZenMux 端点
    base_url="https://zenmux.ai/api/anthropic" # [!code highlight]
)

# 4. 定义工具来描述期望的输出结构
tools = [
    {
        "name": "introduce_yourself", # [!code highlight]
        "description": "Introduce yourself with structured information",
        "strict": True, # 启用严格模式，保证参数类型正确
        "input_schema": { # [!code highlight]
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "your name"
                },
                "city": {
                    "type": "string",
                    "description": "where your city"
                },
                "desc": {
                    "type": "string",
                    "description": "description about yourself"
                }
            },
            "required": ["name", "city", "desc"],
            "additionalProperties": False
        }
    }
]

# 5. 发起请求，强制调用工具
message = client.messages.create(
    model="anthropic/claude-sonnet-4.5", # [!code highlight]
    max_tokens=1024,
    tools=tools,
    tool_choice={"type": "tool", "name": "introduce_yourself"}, # [!code highlight]
    messages=[
        {
            "role": "user",
            "content": "Hi, who are you? Describe yourself using about 50 words."
        }
    ]
)

# 6. 提取结构化输出
for block in message.content:
    if block.type == "tool_use":
        print(block.input)  # 结构化 JSON 数据
```

```ts [TypeScript]
import Anthropic from "@anthropic-ai/sdk";

// 1. 初始化 Anthropic 客户端
const anthropic = new Anthropic({
  // 2. 替换为你从 ZenMux 用户控制台获取的 API Key
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
  // 3. 将基础 URL 指向 ZenMux 端点
  baseURL: "https://zenmux.ai/api/anthropic", // [!code highlight]
});

async function main() {
  // 4. 定义工具来描述期望的输出结构
  const tools = [
    {
      name: "introduce_yourself", // [!code highlight]
      description: "Introduce yourself with structured information",
      strict: true, // 启用严格模式，保证参数类型正确
      input_schema: {
        // [!code highlight]
        type: "object" as const,
        properties: {
          name: {
            type: "string",
            description: "your name",
          },
          city: {
            type: "string",
            description: "where your city",
          },
          desc: {
            type: "string",
            description: "description about yourself",
          },
        },
        required: ["name", "city", "desc"],
        additionalProperties: false,
      },
    },
  ];

  // 5. 发起请求，强制调用工具
  const message = await anthropic.messages.create({
    model: "anthropic/claude-sonnet-4.5", // [!code highlight]
    max_tokens: 1024,
    tools: tools,
    tool_choice: { type: "tool", name: "introduce_yourself" }, // [!code highlight]
    messages: [
      {
        role: "user",
        content: "Hi, who are you? Describe yourself using about 50 words.",
      },
    ],
  });

  // 6. 提取结构化输出
  for (const block of message.content) {
    if (block.type === "tool_use") {
      console.log(block.input); // 结构化 JSON 数据
    }
  }
}

main();
```

```bash [cURL]
curl https://zenmux.ai/api/anthropic/v1/messages \
  -H "x-api-key: $ZENMUX_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-4.5",
    "max_tokens": 1024,
    "tools": [
      {
        "name": "introduce_yourself",
        "description": "Introduce yourself with structured information",
        "strict": true,
        "input_schema": {
          "type": "object",
          "properties": {
            "name": { "type": "string", "description": "your name" },
            "city": { "type": "string", "description": "where your city" },
            "desc": { "type": "string", "description": "description about yourself" }
          },
          "required": ["name", "city", "desc"],
          "additionalProperties": false
        }
      }
    ],
    "tool_choice": { "type": "tool", "name": "introduce_yourself" },
    "messages": [
      {
        "role": "user",
        "content": "Hi, who are you? Describe yourself using about 50 words."
      }
    ]
  }'
```

:::

### 两种方式对比

| 特性     | JSON 输出 (output_config) | 工具调用 (Tool Use)                 |
| -------- | ------------------------- | ----------------------------------- |
| 参数位置 | `output_config.format`    | `tools` + `tool_choice`             |
| 输出位置 | `content[0].text`         | `content[x].input` (tool_use block) |
| 适用场景 | 直接获取结构化响应        | 需要同时调用工具的场景              |
| 复杂度   | 更简洁                    | 需要处理工具调用逻辑                |
| 推荐程度 | ✅ 推荐                   | 特定场景使用                        |

## Google Vertex AI API

Google Vertex AI（Gemini 模型）通过 `config` 中的 `responseMimeType` 和 `responseSchema` 参数实现结构化输出。

### 参数说明

**config.responseMimeType**

- `text/plain`（默认）：纯文本输出
- `application/json`：JSON 格式输出

**config.responseSchema**

- 定义输出结构的 JSON Schema（需配合 `responseMimeType: "application/json"` 使用）

### API 调用示例

::: code-group

```python [Python]
from google import genai
from google.genai import types

# 1. 初始化 GenAI 客户端
client = genai.Client(
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai' # [!code highlight]
    ),
)

# 2. 定义输出结构 Schema
response_schema = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "your name"
        },
        "city": {
            "type": "string",
            "description": "where your city"
        },
        "desc": {
            "type": "string",
            "description": "description"
        }
    },
    "required": ["name", "city", "desc"]
}

# 3. 发起请求
response = client.models.generate_content(
    model="google/gemini-2.5-pro", # [!code highlight]
    contents="Hi, who are you? Describe yourself using about 50 words.",
    config=types.GenerateContentConfig(
        response_mime_type="application/json", # [!code highlight]
        response_schema=response_schema # [!code highlight]
    )
)

print(response.text)
```

```ts [TypeScript]
import { GoogleGenAI } from "@google/genai";

// 1. 初始化 GenAI 客户端
const client = new GoogleGenAI({
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai", // [!code highlight]
    apiVersion: "v1",
  },
});

async function main() {
  // 2. 定义输出结构 Schema
  const responseSchema = {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "your name",
      },
      city: {
        type: "string",
        description: "where your city",
      },
      desc: {
        type: "string",
        description: "description",
      },
    },
    required: ["name", "city", "desc"],
  };

  // 3. 发起请求
  const response = await client.models.generateContent({
    model: "google/gemini-2.5-pro", // [!code highlight]
    contents: "Hi, who are you? Describe yourself using about 50 words.",
    config: {
      responseMimeType: "application/json", // [!code highlight]
      responseSchema: responseSchema, // [!code highlight]
    },
  });

  console.log(response.text);
}

main();
```

:::

### 使用枚举类型

Vertex AI 还支持 `text/x.enum` MIME 类型，用于分类任务，输出会是 Schema 中定义的枚举值之一：

```python
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

# 枚举类型 Schema
sentiment_schema = {
    "type": "string",
    "enum": ["positive", "negative", "neutral"]
}

response = client.models.generate_content(
    model="google/gemini-2.5-flash",
    contents="Analyze the sentiment: 'I love this product!'",
    config=types.GenerateContentConfig(
        response_mime_type="text/x.enum", # [!code highlight]
        response_schema=sentiment_schema
    )
)

print(response.text)  # 输出: positive
```

<!-- ### 支持的模型

在模型卡片页面找到对应供应商，查看支持参数中是否有 response_format,
如下图所示：

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/21/1Hj7emo/res_format.jpg"
       alt="img"
       style="width: 100%; max-width: 700px; border-radius: 6px; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); margin: 18px 0;"
       loading="lazy" />
</div> -->
