# Quick Start

Welcome to **[ZenMux](https://docs.zenmux.ai/about/intro.html)**! This guide helps you get started quickly and shows how to call the ZenMux API using three different methods.

::: tip 💡 Get started in four steps
You only need four simple steps to start using ZenMux:
:::

1. **Log in to ZenMux**: Visit the **[ZenMux login page](https://zenmux.ai/login)** and choose one of the following login methods:

   - Email login
   - GitHub account login
   - Google account login

2. **Get an API Key**: After logging in, go to your **[User Console > API Keys](https://zenmux.ai/settings/keys)** page and create a new API Key.

3. **Choose an integration method**: We recommend using the OpenAI SDK or the Anthropic SDK compatibility mode. You can also call the ZenMux API directly.

4. **Send your first request**: Copy the code examples below, replace your API Key, and run.

---

## Method 1: Using the OpenAI SDK

::: info Compatibility
ZenMux API endpoints are fully compatible with the OpenAI API. You only need to change two parameters to switch seamlessly.
:::

### Code Examples

::: code-group

```python [Python]
from openai import OpenAI

# 1. Initialize the OpenAI client
client = OpenAI(
    # 2. Point the base URL to the ZenMux endpoint
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    # 3. Replace with the API Key from your ZenMux User Console
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
)

# 4. Send a request
completion = client.chat.completions.create(
    # 5. Specify the model you want to use in the format "provider/model-name"
    model="openai/gpt-5", # [!code highlight]
    messages=[
        {
            "role": "user",
            "content": "What is the meaning of life?" # [!code highlight]
        }
    ]
)

print(completion.choices[0].message.content)
```

```ts [TypeScript]
import OpenAI from "openai";

// 1. Initialize the OpenAI client
const openai = new OpenAI({
  // 2. Point the base URL to the ZenMux endpoint
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  // 3. Replace with the API Key from your ZenMux User Console
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  // 4. Send a request
  const completion = await openai.chat.completions.create({
    // 5. Specify the model you want to use in the format "provider/model-name"
    model: "openai/gpt-5", // [!code highlight]
    messages: [
      {
        role: "user",
        content: "What is the meaning of life?", // [!code highlight]
      },
    ],
  });

  console.log(completion.choices[0].message);
}

main();
```

:::

---

## Method 2: Using the Anthropic SDK

::: info Compatibility
ZenMux fully supports the Anthropic API protocol and can be seamlessly integrated into tools like Claude Code and Cursor. You only need to change two parameters.

Note that for the Anthropic protocol use base_url="https://zenmux.ai/api/anthropic".
:::

::: info Anthropic Protocol Model Support
Models compatible with the Anthropic protocol are being adapted in batches. You can view currently supported models by filtering Anthropic API Compatible on the [Official Model List](https://zenmux.ai/models):
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/602FqX9/anthropic-support.png)
Alternatively, check the [model detail page](https://zenmux.ai/anthropic/claude-haiku-4.5):
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/I9JHS8b/detail-anthropic-support.png)
:::

### Code Examples

::: code-group

```python [Python]
from anthropic import Anthropic

# 1. Initialize the Anthropic client
client = Anthropic(
    # 2. Point the base URL to the ZenMux endpoint
    base_url="https://zenmux.ai/api/anthropic", # [!code highlight]
    # 3. Replace with the API Key from your ZenMux User Console
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
)

# 4. Send a request
message = client.messages.create(
    # 5. Specify the model you want to use in the format "provider/model-name"
    model="anthropic/claude-sonnet-4.5", # [!code highlight]
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "What is the meaning of life?" # [!code highlight]
        }
    ]
)

print(message.content[0].text)
```

```ts [TypeScript]
import Anthropic from "@anthropic-ai/sdk";

// 1. Initialize the Anthropic client
const client = new Anthropic({
  // 2. Point the base URL to the ZenMux endpoint
  baseURL: "https://zenmux.ai/api/anthropic", // [!code highlight]
  // 3. Replace with the API Key from your ZenMux User Console
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  // 4. Send a request
  const message = await client.messages.create({
    // 5. Specify the model you want to use in the format "provider/model-name"
    model: "anthropic/claude-sonnet-4.5", // [!code highlight]
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "What is the meaning of life?", // [!code highlight]
      },
    ],
  });

  console.log(message.content[0].text);
}

main();
```

:::

---

## Method 3: Calling the ZenMux API Directly

::: code-group

```python [Python (httpx)]
import httpx

# Prepare request data
api_key = "<your ZENMUX_API_KEY>" # [!code highlight]
headers = {
    "Authorization": f"Bearer {api_key}", # [!code highlight]
}
payload = {
    "model": "openai/gpt-5", # [!code highlight]
    "messages": [
        {
            "role": "user",
            "content": "What is the meaning of life?" # [!code highlight]
        }
    ]
}

# Send a POST request
response = httpx.post(
    "https://zenmux.ai/api/v1/chat/completions", # [!code highlight]
    headers=headers,
    json=payload,
    timeout=httpx.Timeout(60.0)
)

# Check if the request succeeded (optional)
response.raise_for_status()

# Print the JSON response returned by the server
print(response.json())
```

```typescript [TypeScript (fetch)]
fetch("https://zenmux.ai/api/v1/chat/completions", {
  // [!code highlight]
  method: "POST",
  headers: {
    Authorization: "Bearer <your ZENMUX_API_KEY>", // [!code highlight]
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "openai/gpt-5", // [!code highlight]
    messages: [
      {
        role: "user",
        content: "What is the meaning of life?", // [!code highlight]
      },
    ],
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

```bash [Shell (cURL)]

curl https://zenmux.ai/api/v1/chat/completions # [!code highlight]
  -H "Content-Type: application/json"
  -H "Authorization: Bearer $ZENMUX_API_KEY" # [!code highlight]
  -d '{
    "model": "openai/gpt-5",
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ]
  }'
```

:::

---

## Model Selection

You can find the full list of models supported by ZenMux on the [Official Model List](https://zenmux.ai/models).

The value of the `model` parameter can be obtained by copying the exact model slug as shown below:

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/dbb619aa-9ec4-4be2-8017-9f6c3ebcc36c" 
       alt="Copy model slug" 
       style="width: auto; max-width: 400px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); margin: 16px 0;"
       loading="lazy" />
</div>

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/f78ec49e-a91d-49ae-ad4e-66cc7d6b514b" 
       alt="Copy model slug" 
       style="width: auto; max-width: 400px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); margin: 16px 0;"
       loading="lazy" />
</div>

---

## Advanced Usage

For details on advanced usage, see the Advanced Usage section.