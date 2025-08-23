# Quick Start

ZenMux provides a unified API compatible with OpenAI.

::: tip 💡 Get Started in Three Steps
You can start using ZenMux with just three simple steps:
:::

1. **Get API Key**: Go to your **[User Console > API Keys](https://zenmux.ai/settings/keys)** page and create a new API Key.
2. **Choose Integration Method**: We recommend using OpenAI SDK compatibility mode, or you can directly call ZenMux API.
3. **Make Your First Request**: Copy the code examples below, replace with your API Key, and run.

---

## Method 1: Using OpenAI SDK (Recommended)

::: info Compatibility Note
ZenMux's API endpoints are fully compatible with OpenAI API - you only need to modify two parameters for seamless switching.
:::

### Code Examples

::: code-group

```python [Python]
from openai import OpenAI

# 1. Initialize OpenAI client
client = OpenAI(
    # 2. Point base URL to ZenMux endpoint
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    # 3. Replace with your API Key obtained from ZenMux user console
    api_key="<your_ZENMUX_API_KEY>", # [!code highlight]
)

# 4. Make request
completion = client.chat.completions.create(
    # 5. Specify the model you want to use, format: "provider/model_name"
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

// 1. Initialize OpenAI client
const openai = new OpenAI({
  // 2. Point base URL to ZenMux endpoint
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  // 3. Replace with your API Key obtained from ZenMux user console
  apiKey: "<your_ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  // 4. Make request
  const completion = await openai.chat.completions.create({
    // 5. Specify the model you want to use, format: "provider/model_name"
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

## Method 2: Direct ZenMux API Call

::: code-group

```python [Python (httpx)]
import httpx

# Prepare request data
api_key = "<your_ZENMUX_API_KEY>" # [!code highlight]
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

# Send POST request
response = httpx.post(
    "https://zenmux.ai/api/v1/chat/completions", # [!code highlight]
    headers=headers,
    json=payload,
    timeout=httpx.Timeout(60.0)
)

# Check if request was successful (optional)
response.raise_for_status()

# Print JSON response from server
print(response.json())
```

```typescript [TypeScript (fetch)]
fetch("https://zenmux.ai/api/v1/chat/completions", {
  // [!code highlight]
  method: "POST",
  headers: {
    Authorization: "Bearer <your_ZENMUX_API_KEY>", // [!code highlight]
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

All models supported by ZenMux can be viewed from the [Official Model List](https://zenmux.ai/models).

The value for the `model` parameter can be obtained by copying the accurate model Slug through the following methods:

![Copy Model Slug](https://github.com/user-attachments/assets/dbb619aa-9ec4-4be2-8017-9f6c3ebcc36c)

![Copy Model Slug](https://github.com/user-attachments/assets/f78ec49e-a91d-49ae-ad4e-66cc7d6b514b)

---

## Advanced Usage

For detailed information about advanced usage, please refer to the Advanced Calling chapter.