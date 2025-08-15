# 快速开始

ZenMux 为您提供统一的 API 接口，让您通过单一端点访问数百个 AI 模型，同时自动处理故障转移、智能路由和成本优化。使用您喜欢的 SDK 或框架，只需几行代码即可开始使用。

> **💡 提示**
>
> 想了解免费模型和速率限制信息？请查看 [常见问题](/docs/faq#速率限制如何计算)

在下面的示例中，ZenMux 特定的请求头是可选的。设置这些请求头可以让您的应用出现在 ZenMux 排行榜上。有关应用归属的详细信息，请参阅我们的 [应用归属指南](/docs/features/app-attribution)。

## 使用 OpenAI SDK

### Python

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<ZENMUX_API_KEY>",
)

completion = client.chat.completions.create(
    extra_headers={
        "HTTP-Referer": "<YOUR_SITE_URL>",  # 可选。用于在 zenmux.ai 排行榜显示的网站URL
        "X-Title": "<YOUR_SITE_NAME>",      # 可选。用于在 zenmux.ai 排行榜显示的网站名称
    },
    model="openai/gpt-4o",
    messages=[
        {
            "role": "user",
            "content": "什么是人工智能的未来发展趋势？"
        }
    ]
)

print(completion.choices[0].message.content)
```

### TypeScript

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1",
  apiKey: "<ZENMUX_API_KEY>",
  defaultHeaders: {
    "HTTP-Referer": "<YOUR_SITE_URL>", // 可选。用于在 zenmux.ai 排行榜显示的网站URL
    "X-Title": "<YOUR_SITE_NAME>", // 可选。用于在 zenmux.ai 排行榜显示的网站名称
  },
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "openai/gpt-4o",
    messages: [
      {
        role: "user",
        content: "什么是人工智能的未来发展趋势？",
      },
    ],
  });

  console.log(completion.choices[0].message);
}

main();
```

## 直接使用 ZenMux API

> **💡 提示**
>
> 您可以使用交互式 [请求构建器](/request-builder) 生成您选择语言的 ZenMux API 请求。

### Python

```python
import requests
import json

response = requests.post(
    url="https://zenmux.ai/api/v1/chat/completions",
    headers={
        "Authorization": "Bearer <ZENMUX_API_KEY>",
        "HTTP-Referer": "<YOUR_SITE_URL>",  # 可选。用于在 zenmux.ai 排行榜显示的网站URL
        "X-Title": "<YOUR_SITE_NAME>",      # 可选。用于在 zenmux.ai 排行榜显示的网站名称
        "Content-Type": "application/json",
    },
    data=json.dumps({
        "model": "openai/gpt-4o",  # 可选，不指定时使用智能路由
        "messages": [
            {
                "role": "user",
                "content": "什么是人工智能的未来发展趋势？"
            }
        ]
    })
)

print(response.json())
```

### TypeScript

```typescript
fetch("https://zenmux.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: "Bearer <ZENMUX_API_KEY>",
    "HTTP-Referer": "<YOUR_SITE_URL>", // 可选。用于在 zenmux.ai 排行榜显示的网站URL
    "X-Title": "<YOUR_SITE_NAME>", // 可选。用于在 zenmux.ai 排行榜显示的网站名称
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "openai/gpt-4o",
    messages: [
      {
        role: "user",
        content: "什么是人工智能的未来发展趋势？",
      },
    ],
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Shell (cURL)

```bash
curl https://zenmux.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -H "HTTP-Referer: <YOUR_SITE_URL>" \
  -H "X-Title: <YOUR_SITE_NAME>" \
  -d '{
    "model": "openai/gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "什么是人工智能的未来发展趋势？"
      }
    ]
  }'
```

## 启用智能路由

如果您想使用 ZenMux 的智能路由功能，只需在请求中省略 `model` 参数或设置为 `"auto"`：

```python
completion = client.chat.completions.create(
    model="auto",  # 或者完全省略此参数
    messages=[
        {
            "role": "user",
            "content": "帮我写一首关于春天的诗"
        }
    ]
)
```

智能路由将根据您的请求内容、成本优化目标和质量要求，自动选择最适合的模型。

## 启用承保服务

要使用 ZenMux 独有的承保服务，请在请求头中添加以下参数：

```python
completion = client.chat.completions.create(
    extra_headers={
        "X-Enable-Insurance": "true",        # 启用承保服务
        "X-Quality-Threshold": "0.8",        # 质量阈值 (0-1)
        "X-Retry-On-Failure": "true",        # 失败时自动重试
    },
    model="openai/gpt-4o",
    messages=[
        {
            "role": "user",
            "content": "请分析这份财务报表的关键指标"
        }
    ]
)
```

## 流式响应

ZenMux API 完全支持 [流式响应](/docs/api-reference/streaming)，让您能够实时获取生成的内容。

```python
stream = client.chat.completions.create(
    model="openai/gpt-4o",
    messages=[
        {
            "role": "user",
            "content": "请详细解释机器学习的基本概念"
        }
    ],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")
```

## 使用第三方 SDK

关于在 ZenMux 中使用第三方 SDK 和框架的信息，请查看我们的 [框架集成文档](/docs/community/frameworks-overview)。

## 下一步

- 查看 [模型&供应商](/docs/models) 了解可用的模型
- 阅读 [智能路由](/docs/smart-routing) 了解自动模型选择
- 探索 [高级调用](/docs/advanced) 学习更多高级功能
- 访问 [API 参考](/docs/api-reference) 获取完整的 API 文档
