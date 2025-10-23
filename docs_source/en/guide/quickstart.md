# Quick Start

Welcome to **[ZenMux](https://docs.zenmux.ai/about/intro.html)**! This guide will help you get started quickly and shows how to call the ZenMux API in three different ways.

::: tip 💡 Get started in 4 steps
You can start using ZenMux in just four simple steps:
:::

1. **Sign in to ZenMux**: Visit the **[ZenMux login page](https://zenmux.ai/login)** and sign in using any of the following:

   - Email
   - GitHub account
   - Google account

2. **Get an API key**: After signing in, go to your **[User Console > API Keys](https://zenmux.ai/settings/keys)** page and create a new API key.

3. **Choose an integration method**: We recommend using the OpenAI SDK or Anthropic SDK in compatibility mode, or you can call the ZenMux API directly.

4. **Make your first request**: Copy the code example below, replace your API key, and run it.

---

::: info How to Obtain Model Slugs
Each model on the ZenMux platform has a unique slug. You can find model slugs on the [Models page](https://zenmux.ai/models):
![model-slug](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/21/AQG0SIr/model-slug.png)
Or on the [model detail page](https://zenmux.ai/anthropic/claude-sonnet-4.5):
![model-slug](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/21/dWYxJnq/model-slug-3.png)
:::

## Method 1: Using the OpenAI SDK

::: info Compatibility
ZenMux endpoints are fully compatible with the OpenAI API. You only need to change two parameters to switch seamlessly.
:::

### Code Examples

::: code-group

```python [Python]
from openai import OpenAI

# 1. Initialize the OpenAI client
client = OpenAI(
    # 2. Point the base URL to the ZenMux endpoint
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    # 3. Replace with the API key from your ZenMux console
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
)

# 4. Make the request
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
  // 3. Replace with the API key from your ZenMux console
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  // 4. Make the request
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
ZenMux fully supports the Anthropic API protocol and integrates seamlessly with tools like Claude Code and Cursor. You only need to change two parameters.

Note: For the Anthropic protocol, use base_url="https://zenmux.ai/api/anthropic".
:::

::: info Anthropic Protocol Model Support
Models compatible with the Anthropic protocol are being adapted in batches. You can view the currently supported models by filtering for Anthropic API Compatible on the [official model list](https://zenmux.ai/models):
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/602FqX9/anthropic-support.png)
You can also check on the [model detail page](https://zenmux.ai/anthropic/claude-haiku-4.5):
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
    # 3. Replace with the API key from your ZenMux console
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
)

# 4. Make the request
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
  // 3. Replace with the API key from your ZenMux console
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  // 4. Make the request
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

# Optionally check whether the request succeeded
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

## Advanced Usage

For more details on advanced usage, refer to the Advanced Usage section.

::: tip Contact Us
If you encounter any issues during use or have suggestions and feedback, feel free to contact us:

- **Official Website**: <https://zenmux.ai>
- **Technical Support**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business Inquiries**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord Community**: <http://discord.gg/vHZZzj84Bm>

For more contact options and details, please visit our [Contact Us page](/help/contact).
:::
