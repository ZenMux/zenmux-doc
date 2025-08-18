# Quick Start

ZenMux provides a unified API that is compatible with OpenAI.

Get started in just three steps:

1. **Get API Key**: Go to your **[User Console > API Keys](https://zenmux.ai/settings/keys)** page and create a new API Key.
2. **Choose Integration Method**: We recommend using OpenAI SDK's compatible mode, or you can directly call the ZenMux API.
3. **Make Your First Request**: Copy the code examples below, replace with your API Key, and run.

---

## Method 1: Using OpenAI Compatible Interface (Recommended)

ZenMux's API endpoints are fully compatible with the OpenAI API - you only need to modify two parameters for seamless switching.

### **Python (`openai-python`)**

```python
from openai import OpenAI

# 1. Initialize OpenAI client
client = OpenAI(
    # 2. Point base URL to ZenMux endpoint
    base_url="https://zenmux.ai/api/v1",
    # 3. Replace with your API Key obtained from ZenMux user console
    api_key="<你的 ZENMUX_API_KEY>",
)

# 4. Make request
completion = client.chat.completions.create(
    # 5. Specify the model you want to use, format: "provider/model-name"
    model="openai/gpt-5",
    messages=[
        {
            "role": "user",
            "content": "What's the meaning of life?"
        }
    ]
)

print(completion.choices[0].message.content)
```

#### **TypeScript (`openai-node`)**

```typescript
import OpenAI from "openai";

// 1. Initialize OpenAI client
const openai = new OpenAI({
  // 2. Point base URL to ZenMux endpoint
  baseURL: "https://zenmux.ai/api/v1",
  // 3. Replace with your API Key obtained from ZenMux user console
  apiKey: "<你的 ZENMUX_API_KEY>",
});

async function main() {
  // 4. Make request
  const completion = await openai.chat.completions.create({
    // 5. Specify the model you want to use, format: "provider/model-name"
    model: "openai/gpt-5",
    messages: [
      {
        role: "user",
        content: "What's the meaning of life?",
      },
    ],
  });

  console.log(completion.choices[0].message);
}

main();
```

---

## Method 2: Direct ZenMux API Call

### **Python (`httpx`)**

```python

import httpx

# Prepare request data
api_key = "<你的 ZENMUX_API_KEY>"
headers = {
    "Authorization": f"Bearer {api_key}",
}
payload = {
    "model": "openai/gpt-5",
    "messages": [
        {
            "role": "user",
            "content": "What's the meaning of life?"
        }
    ]
}

# Send POST request
response = httpx.post(
    "https://zenmux.ai/api/v1/chat/completions",
    headers=headers,
    json=payload
)

# Check if request was successful (optional)
response.raise_for_status()

# Print server JSON response
print(response.json())

```

### **TypeScript (`fetch`)**

```typescript
fetch("https://zenmux.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: "Bearer <你的 ZENMUX_API_KEY>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    // Optional. If not specified, ZenMux will enable smart routing to automatically select the best model for you.
    model: "openai/gpt-5",
    messages: [
      {
        role: "user",
        content: "What's the meaning of life?",
      },
    ],
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### **Shell (`cURL`)**

> **Security Tip:** To avoid key exposure, we recommend setting the API Key as an environment variable.
> `export ZENMUX_API_KEY="<你的_ZENMUX_API_KEY>"`

```shell
curl https://zenmux.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "openai/gpt-5",
    "messages": [
      {
        "role": "user",
        "content": "What's the meaning of life?"
      }
    ]
  }'
```

---

## Next Steps

Congratulations! You have successfully made your first API request. Next, you can:

- **View [Model List](https://zenmux.ai/docs/models)** to explore all the models we support.
- **Explore advanced features** like **[streaming, function calling](https://zenmux.ai/docs/advanced)**.
- **Check the complete [API Reference Documentation](https://zenmux.ai/docs/api-reference)** for detailed information on all APIs.