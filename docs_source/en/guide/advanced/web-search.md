---
head:
  - - meta
    - name: description
      content: ZenMux Web Search Guide - Enable AI models to access real-time web information via Chat Completions, Messages, Responses, and Vertex AI protocols
  - - meta
    - name: keywords
      content: Zenmux, Web Search, API, OpenAI, Anthropic, Claude, GPT, Vertex AI, Google Search, real-time search, grounding
---

# Web Search

This document explains how to use the Web Search feature on the ZenMux platform. ZenMux supports invoking Web Search via multiple compatible protocols, including Chat Completions, Messages, Responses, and Vertex AI.

## Overview

Web Search allows an AI model to access real-time web information while generating an answer, enabling more accurate and up-to-date responses. This feature is particularly useful for:

- Querying breaking news and current events
- Getting the latest product information and pricing
- Looking up dynamic data such as weather and stock quotes
- Accessing the latest technical documentation and resources

## Supported Protocols

| Protocol                             | Endpoint                     | Web Search Parameter                 |
| ------------------------------------ | ---------------------------- | ------------------------------------ |
| Chat Completions (OpenAI-compatible) | `/api/v1/chat/completions`   | `web_search_options`                 |
| Messages (Anthropic-compatible)      | `/api/anthropic/v1/messages` | `web_search_20250305` within `tools` |
| Responses (OpenAI Responses)         | `/api/v1/responses`          | `web_search` family within `tools`   |
| Vertex AI (Google-compatible)        | `/api/vertex-ai/v1/...`      | `googleSearch` within `tools`        |

## 1. Chat Completions API

The Chat Completions API enables Web Search via the `web_search_options` parameter.

### Parameters

| Parameter                                   | Type   | Required | Description                                     |
| ------------------------------------------- | ------ | -------- | ----------------------------------------------- |
| `web_search_options`                        | object | No       | Web search configuration                        |
| `web_search_options.search_context_size`    | string | No       | Search context size: `low` / `medium` / `high`  |
| `web_search_options.user_location`          | object | No       | User location info for localized search results |
| `web_search_options.user_location.type`     | string | Yes      | Location type, fixed as `approximate`           |
| `web_search_options.user_location.city`     | string | No       | City name                                       |
| `web_search_options.user_location.country`  | string | No       | Country code (2-letter ISO, e.g. `CN`, `US`)    |
| `web_search_options.user_location.region`   | string | No       | Region/province                                 |
| `web_search_options.user_location.timezone` | string | No       | Timezone (IANA format, e.g. `Asia/Shanghai`)    |

### Example

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
        "content": "How is the weather in Beijing today?"
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
  baseURL: "https://zenmux.ai/api/v1",
});

async function chatWithWebSearch() {
  const response = await client.chat.completions.create({
    model: "openai/gpt-5.2",
    messages: [
      {
        role: "user",
        content: "How is the weather in Beijing today?",
      },
    ],
    // @ts-ignore - web_search_options is a ZenMux extension parameter
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

  // Check whether there are URL citations
  const annotations = response.choices[0].message.annotations;
  if (annotations) {
    console.log("\nCitations:");
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
    base_url="https://zenmux.ai/api/v1"
)

response = client.chat.completions.create(
    model="openai/gpt-5.2",
    messages=[
        {
            "role": "user",
            "content": "How is the weather in Beijing today?"
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

# Check whether there are URL citations
if hasattr(response.choices[0].message, 'annotations'):
    annotations = response.choices[0].message.annotations
    if annotations:
        print("\nCitations:")
        for annotation in annotations:
            if annotation.get("type") == "url_citation":
                citation = annotation.get("url_citation", {})
                print(f"- {citation.get('title')}: {citation.get('url')}")
```

:::

## 2. Messages API (Anthropic-compatible)

The Messages API enables Web Search using the `web_search_20250305` type within the `tools` parameter.

### Parameters

| Parameter                        | Type   | Required | Description                                |
| -------------------------------- | ------ | -------- | ------------------------------------------ |
| `tools[].type`                   | string | Yes      | Tool type, fixed as `web_search_20250305`  |
| `tools[].name`                   | string | Yes      | Tool name, fixed as `web_search`           |
| `tools[].allowed_domains`        | array  | No       | Allowlist of domains to search             |
| `tools[].blocked_domains`        | array  | No       | Blocklist of domains to exclude            |
| `tools[].max_uses`               | number | No       | Max number of searches in a single request |
| `tools[].user_location`          | object | No       | User location info                         |
| `tools[].user_location.type`     | string | Yes      | Location type, fixed as `approximate`      |
| `tools[].user_location.city`     | string | No       | City name                                  |
| `tools[].user_location.country`  | string | No       | Country code (ISO 3166-1 alpha-2)          |
| `tools[].user_location.region`   | string | No       | Region                                     |
| `tools[].user_location.timezone` | string | No       | Timezone (IANA format)                     |

### Example

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
        "content": "Please search for recent AI news"
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
  baseURL: "https://zenmux.ai/api/anthropic",
});

async function messageWithWebSearch() {
  const response = await client.messages.create({
    model: "anthropic/claude-sonnet-4.5",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Please search for recent AI news",
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

  // Process response content
  for (const block of response.content) {
    if (block.type === "text") {
      console.log(block.text);
    } else if (block.type === "web_search_tool_result") {
      console.log("\nSearch results:");
      if (Array.isArray(block.content)) {
        block.content.forEach((result: any) => {
          console.log(`- ${result.title}: ${result.url}`);
        });
      }
    }
  }

  // View Web Search usage stats
  if (response.usage?.server_tool_use) {
    console.log(
      `\nWeb Search request count: ${response.usage.server_tool_use.web_search_requests}`,
    );
  }
}

messageWithWebSearch();
```

```python
import anthropic

client = anthropic.Anthropic(
    api_key="YOUR_API_KEY",
    base_url="https://zenmux.ai/api/anthropic"
)

response = client.messages.create(
    model="anthropic/claude-sonnet-4.5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Please search for recent AI news"
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

# Process response content
for block in response.content:
    if block.type == "text":
        print(block.text)
    elif block.type == "web_search_tool_result":
        print("\nSearch results:")
        if isinstance(block.content, list):
            for result in block.content:
                print(f"- {result.get('title')}: {result.get('url')}")

# View Web Search usage stats
if hasattr(response.usage, 'server_tool_use') and response.usage.server_tool_use:
    print(f"\nWeb Search request count: {response.usage.server_tool_use.get('web_search_requests', 0)}")
```

:::

## 3. Responses API (OpenAI Responses)

The Responses API enables Web Search using the `web_search` family of types within the `tools` parameter.

### Supported Web Search Types

| Type                            | Description                      |
| ------------------------------- | -------------------------------- |
| `web_search`                    | Web search (generally available) |
| `web_search_2025_08_26`         | Web search 2025 version          |
| `web_search_preview`            | Web search preview               |
| `web_search_preview_2025_03_11` | Web search preview 2025 version  |

### Parameters

| Parameter                         | Type   | Required | Description                                    |
| --------------------------------- | ------ | -------- | ---------------------------------------------- |
| `tools[].type`                    | string | Yes      | Web Search type                                |
| `tools[].search_context_size`     | string | No       | Search context size: `low` / `medium` / `high` |
| `tools[].filters`                 | object | No       | Search filters (only for `web_search` type)    |
| `tools[].filters.allowed_domains` | array  | No       | Allowlist of domains                           |
| `tools[].user_location`           | object | No       | User location info                             |
| `tools[].user_location.type`      | string | Yes      | Location type, fixed as `approximate`          |
| `tools[].user_location.city`      | string | No       | City name                                      |
| `tools[].user_location.country`   | string | No       | Country code (2-letter ISO)                    |
| `tools[].user_location.region`    | string | No       | Region/state code                              |
| `tools[].user_location.timezone`  | string | No       | Timezone (IANA format)                         |

### Example

::: code-group

```cURL
curl -X POST "https://zenmux.ai/api/v1/responses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "openai/gpt-5.2",
    "input": "What is the latest iPhone model this year? What new features does it have?",
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
    "input": "What are the most important tech news today?",
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
  baseURL: "https://zenmux.ai/api/v1",
});

async function responsesWithWebSearch() {
  // Non-streaming request
  const response = await client.responses.create({
    model: "openai/gpt-5.2",
    input:
      "What is the latest iPhone model this year? What new features does it have?",
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

  // Process output
  for (const item of response.output) {
    if (item.type === "message") {
      for (const content of item.content) {
        if (content.type === "output_text") {
          console.log(content.text);

          // Print citations
          if (content.annotations) {
            console.log("\nCitations:");
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
      console.log(`\nWeb Search status: ${item.status}`);
    }
  }
}

// Streaming request
async function responsesWithWebSearchStream() {
  const stream = await client.responses.create({
    model: "openai/gpt-5.2",
    input: "What are the most important tech news today?",
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
      console.log("🔍 Searching...");
    } else if (event.type === "response.web_search_call.searching") {
      console.log("🔎 Searching...");
    } else if (event.type === "response.web_search_call.completed") {
      console.log("✅ Search completed");
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
    base_url="https://zenmux.ai/api/v1"
)

# Non-streaming request
response = client.responses.create(
    model="openai/gpt-5.2",
    input="What is the latest iPhone model this year? What new features does it have?",
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

# Process output
for item in response.output:
    if item.type == "message":
        for content in item.content:
            if content.type == "output_text":
                print(content.text)

                # Print citations
                if hasattr(content, 'annotations') and content.annotations:
                    print("\nCitations:")
                    for annotation in content.annotations:
                        if annotation.type == "url_citation":
                            print(f"- {annotation.url_citation.title}: {annotation.url_citation.url}")
    elif item.type == "web_search_call":
        print(f"\nWeb Search status: {item.status}")


# Streaming request
def responses_with_web_search_stream():
    stream = client.responses.create(
        model="openai/gpt-5.2",
        input="What are the most important tech news today?",
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
            print("🔍 Searching...")
        elif event.type == "response.web_search_call.searching":
            print("🔎 Searching...")
        elif event.type == "response.web_search_call.completed":
            print("✅ Search completed")
        elif event.type == "response.output_text.delta":
            print(event.delta, end="", flush=True)

responses_with_web_search_stream()
```

:::

## 4. Vertex AI API (Google-compatible)

The Vertex AI API enables Google Search Grounding via `googleSearch` in the `tools` parameter.

<!-- ::: warning Note
Vertex AI Web Search may be unavailable or only supported by certain models. Use the SDK approach and confirm model support.
::: -->

### Parameters

In Vertex AI, Web Search is enabled via the `googleSearch` tool, and source information is returned in `groundingMetadata` in the response.

| Parameter              | Type   | Required | Description                                              |
| ---------------------- | ------ | -------- | -------------------------------------------------------- |
| `tools[].googleSearch` | object | Yes      | Google Search configuration (an empty object enables it) |

### Grounding Information in the Response

| Field                                            | Type   | Description             |
| ------------------------------------------------ | ------ | ----------------------- |
| `groundingMetadata.webSearchQueries`             | array  | Executed search queries |
| `groundingMetadata.groundingChunks`              | array  | Evidence chunks         |
| `groundingMetadata.groundingChunks[].web.uri`    | string | Source URL              |
| `groundingMetadata.groundingChunks[].web.title`  | string | Source title            |
| `groundingMetadata.groundingChunks[].web.domain` | string | Source domain           |

### Example

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
            "text": "Please tell me today's top tech news headlines"
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
            "text": "What are the recent major developments in AI?"
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

// Use the ZenMux proxy
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
    contents: "Please tell me today's top tech news headlines",
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });

  // Get generated text
  console.log("Answer:", response.text);

  // Get Grounding info
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  if (groundingMetadata) {
    console.log("\nSearch queries:", groundingMetadata.webSearchQueries);

    if (groundingMetadata.groundingChunks) {
      console.log("\nCitations:");
      groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          console.log(`- ${chunk.web.title}: ${chunk.web.uri}`);
        }
      });
    }
  }
}

// Streaming request
async function generateWithGoogleSearchStream() {
  const response = await client.models.generateContentStream({
    model: "google/gemini-2.0-flash",
    contents: "What are the recent major developments in AI?",
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  console.log("Answer:");
  for await (const chunk of response) {
    if (chunk.text) {
      process.stdout.write(chunk.text);
    }

    // The final chunk may include groundingMetadata
    const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata?.groundingChunks) {
      console.log("\n\nCitations:");
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

# Configure to use the ZenMux proxy
client = genai.Client(
    api_key="YOUR_API_KEY",
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

# Non-streaming request
def generate_with_google_search():
    response = client.models.generate_content(
        model="google/gemini-2.0-flash",
        contents="Please tell me today's top tech news headlines",
        config=types.GenerateContentConfig(
            tools=[types.Tool(google_search=types.GoogleSearch())],
            temperature=0.7,
            max_output_tokens=2048
        )
    )

    # Get generated text
    print("Answer:", response.text)

    # Get Grounding info
    if response.candidates and response.candidates[0].grounding_metadata:
        metadata = response.candidates[0].grounding_metadata

        if metadata.web_search_queries:
            print("\nSearch queries:", metadata.web_search_queries)

        if metadata.grounding_chunks:
            print("\nCitations:")
            for chunk in metadata.grounding_chunks:
                if chunk.web:
                    print(f"- {chunk.web.title}: {chunk.web.uri}")

# Streaming request
def generate_with_google_search_stream():
    response = client.models.generate_content_stream(
        model="google/gemini-2.0-flash",
        contents="What are the recent major developments in AI?",
        config=types.GenerateContentConfig(
            tools=[types.Tool(google_search=types.GoogleSearch())]
        )
    )

    print("Answer:")
    for chunk in response:
        if chunk.text:
            print(chunk.text, end="", flush=True)

        # The final chunk may include grounding_metadata
        if chunk.candidates and chunk.candidates[0].grounding_metadata:
            metadata = chunk.candidates[0].grounding_metadata
            if metadata.grounding_chunks:
                print("\n\nCitations:")
                for c in metadata.grounding_chunks:
                    if c.web:
                        print(f"- {c.web.title}: {c.web.uri}")

generate_with_google_search()
```

:::

## Response Format Comparison

### Chat Completions Response

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Based on the search results...",
        "annotations": [
          {
            "type": "url_citation",
            "url_citation": {
              "title": "Source Title",
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

### Messages Response

```json
{
  "content": [
    {
      "type": "text",
      "text": "Based on the search results..."
    },
    {
      "type": "web_search_tool_result",
      "tool_use_id": "...",
      "content": [
        {
          "type": "web_search_result",
          "title": "Source Title",
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

### Responses Response

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
          "text": "Based on the search results...",
          "annotations": [
            {
              "type": "url_citation",
              "url_citation": {
                "title": "Source Title",
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

### Vertex AI Response

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Based on the search results..."
          }
        ]
      },
      "groundingMetadata": {
        "webSearchQueries": ["Tech news today"],
        "groundingChunks": [
          {
            "web": {
              "uri": "https://example.com/article",
              "title": "Source Title",
              "domain": "example.com"
            }
          }
        ]
      }
    }
  ]
}
```

## Streaming Events (Responses API)

When using streaming mode with the Responses API, you may receive the following Web Search-related events:

| Event Type                             | Description             |
| -------------------------------------- | ----------------------- |
| `response.web_search_call.in_progress` | Web Search call started |
| `response.web_search_call.searching`   | Search in progress      |
| `response.web_search_call.completed`   | Search completed        |

## Best Practices

### 1. Choose the Right Search Context Size

- `low`: Suitable for simple queries; faster responses and lower cost
- `medium`: Balanced choice for most scenarios
- `high`: Suitable for complex questions that require deeper research

### 2. Provide User Location Information

To get more relevant localized results, provide user location information:

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

### 3. Use Domain Filtering Appropriately

In the Messages API, you can use `allowed_domains` or `blocked_domains` to control the search scope:

```json
{
  "type": "web_search_20250305",
  "name": "web_search",
  "allowed_domains": ["wikipedia.org", "github.com"],
  "blocked_domains": ["spam-site.com"]
}
```

### 4. Limit the Number of Searches

In the Messages API, use `max_uses` to control the maximum number of searches per request to manage cost:

```json
{
  "type": "web_search_20250305",
  "name": "web_search",
  "max_uses": 3
}
```

### 5. Handle Citation Information

Always check and display citation information in responses to help users verify the reliability of the sources.

## Notes

1. **Billing**: Web Search incurs additional charges; see the pricing documentation for details.
2. **Latency**: Enabling Web Search increases response latency because a real-time search must be performed.
3. **Availability**: Not all models support Web Search; confirm support for your target model.
4. **Result Accuracy**: Web Search results come from the live web; accuracy depends on the search engine and source websites.

## FAQ

### Q: How can I tell whether the model performed a Web Search?

A: You can determine this in the following ways:

- Chat Completions: Check for `url_citation` in `message.annotations`
- Messages: Check `usage.server_tool_use.web_search_requests`
- Responses: Look for `web_search_call` items in `output`
- Vertex AI: Check whether `groundingMetadata` exists

### Q: Why are there sometimes no search results returned?

A: Possible reasons include:

1. The question does not require real-time information; the model decides not to search
2. Search results are not relevant to the question and are filtered by the model
3. Network issues cause the search to fail

### Q: How can I optimize search performance?

A: Recommendations:

1. Ask clear, specific questions
2. Use an appropriate search context size
3. Provide user location information to get localized results
4. Use domain filtering in the Messages API to focus the search scope
