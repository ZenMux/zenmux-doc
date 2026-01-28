---
head:
  - - meta
    - name: description
      content: ZenMux 网络搜索功能指南 - 通过 Chat Completions、Messages、Responses、Vertex AI 等协议调用 Web Search，让 AI 模型访问实时网络信息
  - - meta
    - name: keywords
      content: Zenmux, Web Search, 网络搜索, API, OpenAI, Anthropic, Claude, GPT, Vertex AI, Google Search, 实时搜索
---

# 网络搜索

本文档介绍如何在 ZenMux 平台中使用 Web Search 功能。ZenMux 支持通过多种兼容协议调用 Web Search，包括 Chat Completions、Messages、Responses 以及 Vertex AI。

## 概述

Web Search 功能允许 AI 模型在生成回答时访问实时网络信息，从而提供更准确、更及时的答案。该功能特别适用于：

- 查询实时新闻和事件
- 获取最新的产品信息和价格
- 查询天气、股票等动态数据
- 获取最新的技术文档和资料

## 支持的协议

| 协议                           | 端点                         | Web Search 参数                    |
| ------------------------------ | ---------------------------- | ---------------------------------- |
| Chat Completions (OpenAI 兼容) | `/api/v1/chat/completions`   | `web_search_options`               |
| Messages (Anthropic 兼容)      | `/api/anthropic/v1/messages` | `tools` 中的 `web_search_20250305` |
| Responses (OpenAI Responses)   | `/api/v1/responses`          | `tools` 中的 `web_search` 系列     |
| Vertex AI (Google 兼容)        | `/api/vertex-ai/v1/...`      | `tools` 中的 `googleSearch`        |

## 1. Chat Completions API

Chat Completions API 使用 `web_search_options` 参数启用 Web Search 功能。

### 参数说明

| 参数                                        | 类型   | 必填 | 说明                                      |
| ------------------------------------------- | ------ | ---- | ----------------------------------------- |
| `web_search_options`                        | object | 否   | Web 搜索配置                              |
| `web_search_options.search_context_size`    | string | 否   | 搜索上下文大小：`low` / `medium` / `high` |
| `web_search_options.user_location`          | object | 否   | 用户位置信息，用于本地化搜索结果          |
| `web_search_options.user_location.type`     | string | 是   | 位置类型，固定为 `approximate`            |
| `web_search_options.user_location.city`     | string | 否   | 城市名称                                  |
| `web_search_options.user_location.country`  | string | 否   | 国家代码（两位 ISO，如 `CN`、`US`）       |
| `web_search_options.user_location.region`   | string | 否   | 地区/省份                                 |
| `web_search_options.user_location.timezone` | string | 否   | 时区（IANA 格式，如 `Asia/Shanghai`）     |

### 示例

::: code-group

```cURL
curl -X POST "https://zenmux.ai/api/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "openai/gpt-5.2",
    "messages": [
      {
        "role": "user",
        "content": "今天北京的天气怎么样？"
      }
    ],
    "web_search_options": {
      "search_context_size": "medium",
      "user_location": {
        "type": "approximate",
        "city": "Beijing",
        "country": "CN",
        "region": "Beijing",
        "timezone": "Asia/Shanghai"
      }
    }
  }'
```

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "YOUR_API_KEY",
  baseURL: "https://zenmux.ai/api/v1/chat/completions",
});

async function chatWithWebSearch() {
  const response = await client.chat.completions.create({
    model: "openai/gpt-5.2",
    messages: [
      {
        role: "user",
        content: "今天北京的天气怎么样？",
      },
    ],
    // @ts-ignore - web_search_options 是 ZenMux 扩展参数
    web_search_options: {
      search_context_size: "medium",
      user_location: {
        type: "approximate",
        city: "Beijing",
        country: "CN",
        region: "Beijing",
        timezone: "Asia/Shanghai",
      },
    },
  });

  console.log(response.choices[0].message.content);

  // 检查是否有 URL 引用
  const annotations = response.choices[0].message.annotations;
  if (annotations) {
    console.log("\n引用来源:");
    annotations.forEach((annotation: any) => {
      if (annotation.type === "url_citation") {
        console.log(
          `- ${annotation.url_citation.title}: ${annotation.url_citation.url}`,
        );
      }
    });
  }
}

chatWithWebSearch();
```

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://zenmux.ai/api/v1/chat/completions"
)

response = client.chat.completions.create(
    model="openai/gpt-5.2",
    messages=[
        {
            "role": "user",
            "content": "今天北京的天气怎么样？"
        }
    ],
    extra_body={
        "web_search_options": {
            "search_context_size": "medium",
            "user_location": {
                "type": "approximate",
                "city": "Beijing",
                "country": "CN",
                "region": "Beijing",
                "timezone": "Asia/Shanghai"
            }
        }
    }
)

print(response.choices[0].message.content)

# 检查是否有 URL 引用
if hasattr(response.choices[0].message, 'annotations'):
    annotations = response.choices[0].message.annotations
    if annotations:
        print("\n引用来源:")
        for annotation in annotations:
            if annotation.get("type") == "url_citation":
                citation = annotation.get("url_citation", {})
                print(f"- {citation.get('title')}: {citation.get('url')}")
```

:::

## 2. Messages API (Anthropic 兼容)

Messages API 使用 `tools` 参数中的 `web_search_20250305` 类型启用 Web Search 功能。

### 参数说明

| 参数                             | 类型   | 必填 | 说明                                   |
| -------------------------------- | ------ | ---- | -------------------------------------- |
| `tools[].type`                   | string | 是   | 工具类型，固定为 `web_search_20250305` |
| `tools[].name`                   | string | 是   | 工具名称，固定为 `web_search`          |
| `tools[].allowed_domains`        | array  | 否   | 允许搜索的域名白名单                   |
| `tools[].blocked_domains`        | array  | 否   | 禁止搜索的域名黑名单                   |
| `tools[].max_uses`               | number | 否   | 单次请求中最大搜索次数                 |
| `tools[].user_location`          | object | 否   | 用户位置信息                           |
| `tools[].user_location.type`     | string | 是   | 位置类型，固定为 `approximate`         |
| `tools[].user_location.city`     | string | 否   | 城市名称                               |
| `tools[].user_location.country`  | string | 否   | 国家代码（ISO 3166-1 alpha-2）         |
| `tools[].user_location.region`   | string | 否   | 地区                                   |
| `tools[].user_location.timezone` | string | 否   | 时区（IANA 格式）                      |

### 示例

::: code-group

```cURL
curl -X POST "https://zenmux.ai/api/anthropic/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "anthropic/claude-sonnet-4.5",
    "max_tokens": 4096,
    "messages": [
      {
        "role": "user",
        "content": "请帮我搜索一下最近的人工智能新闻"
      }
    ],
    "tools": [
      {
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 3,
        "user_location": {
          "type": "approximate",
          "country": "CN",
          "timezone": "Asia/Shanghai"
        }
      }
    ]
  }'
```

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: "YOUR_API_KEY",
  baseURL: "https://zenmux.ai/api/anthropic/v1/messages",
});

async function messageWithWebSearch() {
  const response = await client.messages.create({
    model: "anthropic/claude-sonnet-4.5",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "请帮我搜索一下最近的人工智能新闻",
      },
    ],
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 3,
        user_location: {
          type: "approximate",
          country: "CN",
          timezone: "Asia/Shanghai",
        },
      } as any,
    ],
  });

  // 处理响应内容
  for (const block of response.content) {
    if (block.type === "text") {
      console.log(block.text);
    } else if (block.type === "web_search_tool_result") {
      console.log("\n搜索结果:");
      if (Array.isArray(block.content)) {
        block.content.forEach((result: any) => {
          console.log(`- ${result.title}: ${result.url}`);
        });
      }
    }
  }

  // 查看 Web Search 使用统计
  if (response.usage?.server_tool_use) {
    console.log(
      `\nWeb Search 调用次数: ${response.usage.server_tool_use.web_search_requests}`,
    );
  }
}

messageWithWebSearch();
```

```python
import anthropic

client = anthropic.Anthropic(
    api_key="YOUR_API_KEY",
    base_url="https://zenmux.ai/api/anthropic/v1/messages"
)

response = client.messages.create(
    model="anthropic/claude-sonnet-4.5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "请帮我搜索一下最近的人工智能新闻"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3,
            "user_location": {
                "type": "approximate",
                "country": "CN",
                "timezone": "Asia/Shanghai"
            }
        }
    ]
)

# 处理响应内容
for block in response.content:
    if block.type == "text":
        print(block.text)
    elif block.type == "web_search_tool_result":
        print("\n搜索结果:")
        if isinstance(block.content, list):
            for result in block.content:
                print(f"- {result.get('title')}: {result.get('url')}")

# 查看 Web Search 使用统计
if hasattr(response.usage, 'server_tool_use') and response.usage.server_tool_use:
    print(f"\nWeb Search 调用次数: {response.usage.server_tool_use.get('web_search_requests', 0)}")
```

:::

## 3. Responses API (OpenAI Responses)

Responses API 使用 `tools` 参数中的 `web_search` 系列类型启用 Web Search 功能。

### 支持的 Web Search 类型

| 类型                            | 说明                     |
| ------------------------------- | ------------------------ |
| `web_search`                    | 网页搜索（一般可用版本） |
| `web_search_2025_08_26`         | 网页搜索 2025 版本       |
| `web_search_preview`            | 网页搜索预览版           |
| `web_search_preview_2025_03_11` | 网页搜索预览版 2025      |

### 参数说明

| 参数                              | 类型   | 必填 | 说明                                      |
| --------------------------------- | ------ | ---- | ----------------------------------------- |
| `tools[].type`                    | string | 是   | Web Search 类型                           |
| `tools[].search_context_size`     | string | 否   | 搜索上下文大小：`low` / `medium` / `high` |
| `tools[].filters`                 | object | 否   | 搜索过滤器（仅 `web_search` 类型）        |
| `tools[].filters.allowed_domains` | array  | 否   | 允许的域名白名单                          |
| `tools[].user_location`           | object | 否   | 用户位置信息                              |
| `tools[].user_location.type`      | string | 是   | 位置类型，固定为 `approximate`            |
| `tools[].user_location.city`      | string | 否   | 城市名称                                  |
| `tools[].user_location.country`   | string | 否   | 国家代码（两位 ISO）                      |
| `tools[].user_location.region`    | string | 否   | 地区/州代码                               |
| `tools[].user_location.timezone`  | string | 否   | 时区（IANA 格式）                         |

### 示例

::: code-group

```cURL
curl -X POST "https://zenmux.ai/api/v1/responses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "openai/gpt-5.2",
    "input": "今年最新的iPhone型号是什么？有什么新功能？",
    "tools": [
      {
        "type": "web_search",
        "search_context_size": "high",
        "user_location": {
          "type": "approximate",
          "country": "CN",
          "timezone": "Asia/Shanghai"
        }
      }
    ]
  }'
```

```流式cURL
curl -X POST "https://zenmux.ai/api/v1/responses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "openai/gpt-5.2",
    "input": "今天有什么重要的科技新闻？",
    "stream": true,
    "tools": [
      {
        "type": "web_search_preview",
        "search_context_size": "medium"
      }
    ]
  }'
```

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "YOUR_API_KEY",
  baseURL: "https://zenmux.ai/api/v1/responses",
});

async function responsesWithWebSearch() {
  // 非流式请求
  const response = await client.responses.create({
    model: "openai/gpt-5.2",
    input: "今年最新的iPhone型号是什么？有什么新功能？",
    tools: [
      {
        type: "web_search",
        search_context_size: "high",
        user_location: {
          type: "approximate",
          country: "CN",
          timezone: "Asia/Shanghai",
        },
      },
    ],
  } as any);

  // 处理输出
  for (const item of response.output) {
    if (item.type === "message") {
      for (const content of item.content) {
        if (content.type === "output_text") {
          console.log(content.text);

          // 打印引用
          if (content.annotations) {
            console.log("\n引用来源:");
            content.annotations.forEach((annotation: any) => {
              if (annotation.type === "url_citation") {
                console.log(
                  `- ${annotation.url_citation.title}: ${annotation.url_citation.url}`,
                );
              }
            });
          }
        }
      }
    } else if (item.type === "web_search_call") {
      console.log(`\nWeb Search 状态: ${item.status}`);
    }
  }
}

// 流式请求
async function responsesWithWebSearchStream() {
  const stream = await client.responses.create({
    model: "openai/gpt-5.2",
    input: "今天有什么重要的科技新闻？",
    stream: true,
    tools: [
      {
        type: "web_search_preview",
        search_context_size: "medium",
      },
    ],
  } as any);

  for await (const event of stream) {
    if (event.type === "response.web_search_call.in_progress") {
      console.log("🔍 正在搜索...");
    } else if (event.type === "response.web_search_call.searching") {
      console.log("🔎 搜索中...");
    } else if (event.type === "response.web_search_call.completed") {
      console.log("✅ 搜索完成");
    } else if (event.type === "response.output_text.delta") {
      process.stdout.write(event.delta);
    }
  }
}

responsesWithWebSearch();
```

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://zenmux.ai/api/v1/responses"
)

# 非流式请求
response = client.responses.create(
    model="openai/gpt-5.2",
    input="今年最新的iPhone型号是什么？有什么新功能？",
    tools=[
        {
            "type": "web_search",
            "search_context_size": "high",
            "user_location": {
                "type": "approximate",
                "country": "CN",
                "timezone": "Asia/Shanghai"
            }
        }
    ]
)

# 处理输出
for item in response.output:
    if item.type == "message":
        for content in item.content:
            if content.type == "output_text":
                print(content.text)

                # 打印引用
                if hasattr(content, 'annotations') and content.annotations:
                    print("\n引用来源:")
                    for annotation in content.annotations:
                        if annotation.type == "url_citation":
                            print(f"- {annotation.url_citation.title}: {annotation.url_citation.url}")
    elif item.type == "web_search_call":
        print(f"\nWeb Search 状态: {item.status}")


# 流式请求
def responses_with_web_search_stream():
    stream = client.responses.create(
        model="openai/gpt-5.2",
        input="今天有什么重要的科技新闻？",
        stream=True,
        tools=[
            {
                "type": "web_search_preview",
                "search_context_size": "medium"
            }
        ]
    )

    for event in stream:
        if event.type == "response.web_search_call.in_progress":
            print("🔍 正在搜索...")
        elif event.type == "response.web_search_call.searching":
            print("🔎 搜索中...")
        elif event.type == "response.web_search_call.completed":
            print("✅ 搜索完成")
        elif event.type == "response.output_text.delta":
            print(event.delta, end="", flush=True)

responses_with_web_search_stream()
```

:::

## 4. Vertex AI API (Google 兼容)

Vertex AI API 使用 `tools` 参数中的 `googleSearch` 启用 Google Search Grounding 功能。

<!-- ::: warning 注意
Vertex AI 的 Web Search 功能目前可能不可用或仅支持部分模型，请使用 SDK 方式调用并确认模型支持情况。
::: -->

### 参数说明

在 Vertex AI 中，Web Search 通过 `googleSearch` 工具启用，并通过响应中的 `groundingMetadata` 返回搜索来源信息。

| 参数                   | 类型   | 必填 | 说明                                 |
| ---------------------- | ------ | ---- | ------------------------------------ |
| `tools[].googleSearch` | object | 是   | Google Search 配置（空对象即可启用） |

### 响应中的 Grounding 信息

| 字段                                             | 类型   | 说明           |
| ------------------------------------------------ | ------ | -------------- |
| `groundingMetadata.webSearchQueries`             | array  | 执行的搜索查询 |
| `groundingMetadata.groundingChunks`              | array  | 证据片段       |
| `groundingMetadata.groundingChunks[].web.uri`    | string | 来源 URL       |
| `groundingMetadata.groundingChunks[].web.title`  | string | 来源标题       |
| `groundingMetadata.groundingChunks[].web.domain` | string | 来源域名       |

### 示例

::: code-group

<!-- ```cURL
curl -X POST "https://zenmux.ai/api/vertex-ai/v1/publishers/google/models/gemini-2.0-flash:generateContent" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "contents": [
      {
        "role": "user",
        "parts": [
          {
            "text": "请告诉我今天的科技新闻头条"
          }
        ]
      }
    ],
    "tools": [
      {
        "googleSearch": {}
      }
    ],
    "generationConfig": {
      "temperature": 0.7,
      "maxOutputTokens": 2048
    }
  }'
``` -->

<!-- ```流式cURL
curl -X POST "https://zenmux.ai/api/vertex-ai/v1/publishers/google/models/gemini-2.0-flash:streamGenerateContent?alt=sse" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "contents": [
      {
        "role": "user",
        "parts": [
          {
            "text": "最近有什么重要的AI领域进展？"
          }
        ]
      }
    ],
    "tools": [
      {
        "googleSearch": {}
      }
    ]
  }'
``` -->

```typescript
import { GoogleGenAI } from "@google/genai";

// 使用 ZenMux 代理
const client = new GoogleGenAI({
  apiKey: "YOUR_API_KEY",
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1",
  },
});

async function generateWithGoogleSearch() {
  const response = await client.models.generateContent({
    model: "google/gemini-2.0-flash",
    contents: "请告诉我今天的科技新闻头条",
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });

  // 获取生成的文本
  console.log("回答:", response.text);

  // 获取 Grounding 信息
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  if (groundingMetadata) {
    console.log("\n搜索查询:", groundingMetadata.webSearchQueries);

    if (groundingMetadata.groundingChunks) {
      console.log("\n引用来源:");
      groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          console.log(`- ${chunk.web.title}: ${chunk.web.uri}`);
        }
      });
    }
  }
}

// 流式请求
async function generateWithGoogleSearchStream() {
  const response = await client.models.generateContentStream({
    model: "google/gemini-2.0-flash",
    contents: "最近有什么重要的AI领域进展？",
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  console.log("回答:");
  for await (const chunk of response) {
    if (chunk.text) {
      process.stdout.write(chunk.text);
    }

    // 最后一个 chunk 可能包含 groundingMetadata
    const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata?.groundingChunks) {
      console.log("\n\n引用来源:");
      groundingMetadata.groundingChunks.forEach((c: any) => {
        if (c.web) {
          console.log(`- ${c.web.title}: ${c.web.uri}`);
        }
      });
    }
  }
}

generateWithGoogleSearch();
```

```python
from google import genai
from google.genai import types

# 配置使用 ZenMux 代理
client = genai.Client(
    api_key="YOUR_API_KEY",
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

# 非流式请求
def generate_with_google_search():
    response = client.models.generate_content(
        model="google/gemini-2.0-flash",
        contents="请告诉我今天的科技新闻头条",
        config=types.GenerateContentConfig(
            tools=[types.Tool(google_search=types.GoogleSearch())],
            temperature=0.7,
            max_output_tokens=2048
        )
    )

    # 获取生成的文本
    print("回答:", response.text)

    # 获取 Grounding 信息
    if response.candidates and response.candidates[0].grounding_metadata:
        metadata = response.candidates[0].grounding_metadata

        if metadata.web_search_queries:
            print("\n搜索查询:", metadata.web_search_queries)

        if metadata.grounding_chunks:
            print("\n引用来源:")
            for chunk in metadata.grounding_chunks:
                if chunk.web:
                    print(f"- {chunk.web.title}: {chunk.web.uri}")

# 流式请求
def generate_with_google_search_stream():
    response = client.models.generate_content_stream(
        model="google/gemini-2.0-flash",
        contents="最近有什么重要的AI领域进展？",
        config=types.GenerateContentConfig(
            tools=[types.Tool(google_search=types.GoogleSearch())]
        )
    )

    print("回答:")
    for chunk in response:
        if chunk.text:
            print(chunk.text, end="", flush=True)

        # 最后一个 chunk 可能包含 grounding_metadata
        if chunk.candidates and chunk.candidates[0].grounding_metadata:
            metadata = chunk.candidates[0].grounding_metadata
            if metadata.grounding_chunks:
                print("\n\n引用来源:")
                for c in metadata.grounding_chunks:
                    if c.web:
                        print(f"- {c.web.title}: {c.web.uri}")

generate_with_google_search()
```

:::

## 响应格式对比

### Chat Completions 响应

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "根据搜索结果...",
        "annotations": [
          {
            "type": "url_citation",
            "url_citation": {
              "title": "来源标题",
              "url": "https://example.com/article",
              "start_index": 0,
              "end_index": 0
            }
          }
        ]
      }
    }
  ]
}
```

### Messages 响应

```json
{
  "content": [
    {
      "type": "text",
      "text": "根据搜索结果..."
    },
    {
      "type": "web_search_tool_result",
      "tool_use_id": "...",
      "content": [
        {
          "type": "web_search_result",
          "title": "来源标题",
          "url": "https://example.com/article"
        }
      ]
    }
  ],
  "usage": {
    "input_tokens": 100,
    "output_tokens": 200,
    "server_tool_use": {
      "web_search_requests": 2
    }
  }
}
```

### Responses 响应

```json
{
  "output": [
    {
      "type": "web_search_call",
      "id": "ws_...",
      "status": "completed"
    },
    {
      "type": "message",
      "content": [
        {
          "type": "output_text",
          "text": "根据搜索结果...",
          "annotations": [
            {
              "type": "url_citation",
              "url_citation": {
                "title": "来源标题",
                "url": "https://example.com/article"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### Vertex AI 响应

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "根据搜索结果..."
          }
        ]
      },
      "groundingMetadata": {
        "webSearchQueries": ["科技新闻 今天"],
        "groundingChunks": [
          {
            "web": {
              "uri": "https://example.com/article",
              "title": "来源标题",
              "domain": "example.com"
            }
          }
        ]
      }
    }
  ]
}
```

## 流式事件 (Responses API)

使用 Responses API 的流式模式时，会收到以下 Web Search 相关事件：

| 事件类型                               | 说明                |
| -------------------------------------- | ------------------- |
| `response.web_search_call.in_progress` | Web Search 调用开始 |
| `response.web_search_call.searching`   | 正在执行搜索        |
| `response.web_search_call.completed`   | 搜索完成            |

## 最佳实践

### 1. 选择合适的搜索上下文大小

- `low`：适用于简单查询，响应更快，成本更低
- `medium`：平衡选择，适用于大多数场景
- `high`：适用于需要深入研究的复杂问题

### 2. 使用用户位置信息

为获得更相关的本地化结果，建议提供用户位置信息：

```json
{
  "user_location": {
    "type": "approximate",
    "city": "Shanghai",
    "country": "CN",
    "timezone": "Asia/Shanghai"
  }
}
```

### 3. 合理使用域名过滤

在 Messages API 中，可以使用 `allowed_domains` 或 `blocked_domains` 来控制搜索范围：

```json
{
  "type": "web_search_20250305",
  "name": "web_search",
  "allowed_domains": ["wikipedia.org", "github.com"],
  "blocked_domains": ["spam-site.com"]
}
```

### 4. 限制搜索次数

在 Messages API 中，使用 `max_uses` 控制单次请求的最大搜索次数，以控制成本：

```json
{
  "type": "web_search_20250305",
  "name": "web_search",
  "max_uses": 3
}
```

### 5. 处理引用信息

始终检查并展示响应中的引用信息，这有助于用户验证信息来源的可靠性。

## 注意事项

1. **计费**：Web Search 功能会产生额外费用，具体请参考定价文档
2. **延迟**：启用 Web Search 会增加响应延迟，因为需要执行实时搜索
3. **可用性**：并非所有模型都支持 Web Search，请确认目标模型的支持情况
4. **结果准确性**：Web Search 结果来自实时网络，信息准确性取决于搜索引擎和来源网站

## 常见问题

### Q: 如何知道模型是否执行了 Web Search？

A: 可以通过以下方式判断：

- Chat Completions：检查 `message.annotations` 中的 `url_citation`
- Messages：查看 `usage.server_tool_use.web_search_requests`
- Responses：查看 `output` 中的 `web_search_call` 项
- Vertex AI：检查 `groundingMetadata` 是否存在

### Q: 为什么有时候没有返回搜索结果？

A: 可能的原因包括：

1. 问题不需要实时信息，模型判断无需搜索
2. 搜索结果与问题不相关，被模型过滤
3. 网络问题导致搜索失败

### Q: 如何优化搜索效果？

A: 建议：

1. 提供清晰、具体的问题
2. 使用适当的搜索上下文大小
3. 提供用户位置信息以获取本地化结果
4. 在 Messages API 中使用域名过滤聚焦搜索范围
