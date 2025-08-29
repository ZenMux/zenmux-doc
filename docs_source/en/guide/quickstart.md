# Quick Start

ZenMux provides a unified API that is compatible with OpenAI.

::: tip 💡 Get Started in Three Steps
Just three simple steps to start using ZenMux:
:::

1. Get an API Key: Go to your [User Console > API Keys](https://zenmux.ai/settings/keys) page and create a new API Key.
2. Choose an integration method: We recommend using the OpenAI SDK in compatibility mode, or you can call the ZenMux API directly.
3. Make your first request: Copy the code sample below, replace your API Key, and then run it.

---

## Method 1: Use the OpenAI SDK (Recommended)

::: info Compatibility Notes
ZenMux’s API endpoints are fully compatible with the OpenAI API. You can switch seamlessly by changing just two parameters.
:::

### Code Examples

::: code-group

```python [Python]
from openai import OpenAI

# 1. Initialize the OpenAI client
client = OpenAI(
    # 2. Point the base URL to the ZenMux endpoint
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    # 3. Replace with the API Key from your ZenMux user console
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
)

# 4. Make a request
completion = client.chat.completions.create(
    # 5. Specify the model to use in the format "provider/model-name"
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
  // 3. Replace with the API Key from your ZenMux user console
  apiKey: "<your ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  // 4. Make a request
  const completion = await openai.chat.completions.create({
    // 5. Specify the model to use in the format "provider/model-name"
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

## Method 2: Call the ZenMux API Directly

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

# Send POST request
response = httpx.post(
    "https://zenmux.ai/api/v1/chat/completions", # [!code highlight]
    headers=headers,
    json=payload,
    timeout=httpx.Timeout(60.0)
)

# Check whether the request succeeded (optional)
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

All models supported by ZenMux can be found in the [official model list](https://zenmux.ai/models).

You can set the value of the model parameter by copying the exact model slug as shown below:

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/dbb619aa-9ec4-4be2-8017-9f6c3ebcc36c" 
       alt="Copy Model Slug" 
       style="width: auto; max-width: 400px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); margin: 16px 0;"
       loading="lazy" />
</div>

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/f78ec49e-a91d-49ae-ad4e-66cc7d6b514b" 
       alt="Copy Model Slug" 
       style="width: auto; max-width: 400px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); margin: 16px 0;"
       loading="lazy" />
</div>

---

## Advanced Usage

For more details on advanced usage, see the Advanced Calls section.