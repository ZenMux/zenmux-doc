---
title: Quickstart
subtitle: Get started with ZenMux
slug: quickstart
headline: ZenMux Quickstart Guide | Developer Documentation
canonical-url: 'https://zenmux.ai/docs/quickstart'
'og:site_name': ZenMux Documentation
'og:title': ZenMux Quickstart Guide
'og:description': >-
  Get started with ZenMux's unified API for hundreds of AI models. Learn how
  to integrate using OpenAI SDK, direct API calls, or third-party frameworks.
'og:image':
  type: url
  value: >-
    https://zenmux.ai/dynamic-og?pathname=quickstart&title=Quick%20Start&description=Start%20using%20ZenMux%20API%20in%20minutes%20with%20any%20SDK
'og:image:width': 1200
'og:image:height': 630
'twitter:card': summary_large_image
'twitter:site': '@ZenMuxAI'
noindex: false
nofollow: false
---
# Quickstart Quickstart Quickstart Quickstart Quickstart Quickstart Quickstart Quickstart 
<Copy> 
  **asd** 
</Copy>

ZenMux provides a unified API that gives you access to hundreds of AI models through a single endpoint, while automatically handling fallbacks and selecting the most cost-effective options. Get started with just a few lines of code using your preferred SDK or framework.

::: tip
  Looking for information about free models and rate limits? Please see the [FAQ](./markdown-examples.md)
:::

In the examples below, the ZenMux-specific headers are optional. Setting them allows your app to appear on the ZenMux leaderboards. For detailed information about app attribution, see our [App Attribution guide](./markdown-examples.md).

## Using the OpenAI SDK

::: code-group

```python title="Python"
from openai import OpenAI

client = OpenAI(
  base_url="https://zenmux.ai/api/v1",
  api_key="<ZENMUX_API_KEY>",
)

completion = client.chat.completions.create(
  extra_headers={
    "HTTP-Referer": "<YOUR_SITE_URL>", # Optional. Site URL for rankings on zenmux.ai.
    "X-Title": "<YOUR_SITE_NAME>", # Optional. Site title for rankings on zenmux.ai.
  },
  model="openai/gpt-4o",
  messages=[
    {
      "role": "user",
      "content": "What is the meaning of life?"
    }
  ]
)

print(completion.choices[0].message.content)
```

```typescript title="TypeScript"
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://zenmux.ai/api/v1',
  apiKey: '<ZENMUX_API_KEY>',
  defaultHeaders: {
    'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on zenmux.ai.
    'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on zenmux.ai.
  },
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: 'openai/gpt-4o',
    messages: [
      {
        role: 'user',
        content: 'What is the meaning of life?',
      },
    ],
  });

  console.log(completion.choices[0].message);
}

main();
```

:::

## Using the ZenMux API directly

<Tip>
  You can use the interactive [Request Builder](/request-builder) to generate ZenMux API requests in the language of your choice.
</Tip>

::: code-group

```python title="Python"
import requests
import json

response = requests.post(
  url="https://zenmux.ai/api/v1/chat/completions",
  headers={
    "Authorization": "Bearer <ZENMUX_API_KEY>",
    "HTTP-Referer": "<YOUR_SITE_URL>", # Optional. Site URL for rankings on zenmux.ai.
    "X-Title": "<YOUR_SITE_NAME>", # Optional. Site title for rankings on zenmux.ai.
  },
  data=json.dumps({
    "model": "openai/gpt-4o", # Optional
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ]
  })
)
```

```typescript title="TypeScript"
fetch('https://zenmux.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer <ZENMUX_API_KEY>',
    'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on zenmux.ai.
    'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on zenmux.ai.
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'openai/gpt-4o',
    messages: [
      {
        role: 'user',
        content: 'What is the meaning of life?',
      },
    ],
  }),
});
```

```shell title="Shell"
curl https://zenmux.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
  "model": "openai/gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": "What is the meaning of life?"
    }
  ]
}'
```

:::

The API also supports [streaming](./markdown-examples.md).

## Using third-party SDKs

For information about using third-party SDKs and frameworks with ZenMux, please [see our frameworks documentation.](./markdown-examples.md)
