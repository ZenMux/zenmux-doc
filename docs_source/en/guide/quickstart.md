# Quick Start

ZenMux provides a unified API that is compatible with OpenAI.

::: tip 💡 Get Started in Three Steps
You can start using ZenMux with just three simple steps:
:::

1. **Get API Key**: Go to your **[User Console > API Keys](https://zenmux.ai/settings/keys)** page and create a new API Key.
2. **Choose Integration Method**: We recommend using OpenAI SDK compatibility mode, or you can call the ZenMux API directly.
3. **Make Your First Request**: Copy the code example below, replace with your API Key, and run it.

---

## Method 1: Using OpenAI Compatible Interface (Recommended)

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
    # 3. Replace with your API Key from ZenMux user console
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
)

# 4. Make request
completion = client.chat.completions.create(
    # 5. Specify the model you want to use, format: "provider/model_name"
    model="openai/gpt-5", # [!code highlight]
    messages=[
        {
            "role": "user",
            "content": "What's the meaning of life?" # [!code highlight]
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
  // 3. Replace with your API Key from ZenMux user console
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  // 4. Make request
  const completion = await openai.chat.completions.create({
    // 5. Specify the model you want to use, format: "provider/model_name"
    model: "openai/gpt-5", // [!code highlight]
    messages: [
      {
        role: "user",
        content: "What's the meaning of life?", // [!code highlight]
      },
    ],
  });

  console.log(completion.choices[0].message);
}

main();
```

```js [JavaScript]
import OpenAI from "openai";

// 1. Initialize OpenAI client
const openai = new OpenAI({
  // 2. Point base URL to ZenMux endpoint
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  // 3. Replace with your API Key from ZenMux user console
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
});

// 4. Make request
const completion = await openai.chat.completions.create({
  // 5. Specify the model you want to use, format: "provider/model_name"
  model: "openai/gpt-5", // [!code highlight]
  messages: [
    {
      role: "user",
      content: "What's the meaning of life?", // [!code highlight]
    },
  ],
});

console.log(completion.choices[0].message);
```

```go [Go]
package main

import (
    "context"
    "fmt"
    "github.com/sashabaranov/go-openai"
)

func main() {
    config := openai.DefaultConfig("<你的 ZENMUX_API_KEY>") // [!code highlight]
    config.BaseURL = "https://zenmux.ai/api/v1" // [!code highlight]
    client := openai.NewClientWithConfig(config)

    resp, err := client.CreateChatCompletion(
        context.Background(),
        openai.ChatCompletionRequest{
            Model: "openai/gpt-5", // [!code highlight]
            Messages: []openai.ChatCompletionMessage{
                {
                    Role:    openai.ChatMessageRoleUser,
                    Content: "What's the meaning of life?", // [!code highlight]
                },
            },
        },
    )

    if err != nil {
        fmt.Printf("ChatCompletion error: %v\n", err)
        return
    }

    fmt.Println(resp.Choices[0].Message.Content)
}
```

:::

---

## Method 2: Direct ZenMux API Call

::: code-group

```python [Python (httpx)]
import httpx

# Prepare request data
api_key = "<你的 ZENMUX_API_KEY>" # [!code highlight]
headers = {
    "Authorization": f"Bearer {api_key}", # [!code highlight]
}
payload = {
    "model": "openai/gpt-5", # [!code highlight]
    "messages": [
        {
            "role": "user",
            "content": "What's the meaning of life?" # [!code highlight]
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
fetch("https://zenmux.ai/api/v1/chat/completions", { // [!code highlight]
  method: "POST",
  headers: {
    Authorization: "Bearer <你的 ZENMUX_API_KEY>", // [!code highlight]
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    // Optional. If not specified, ZenMux will enable smart routing to automatically select the best model for you.
    model: "openai/gpt-5", // [!code highlight]
    messages: [
      {
        role: "user",
        content: "What's the meaning of life?", // [!code highlight]
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
        "content": "What's the meaning of life?" 
      }
    ]
  }'
```

```java [Java]
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.util.Map;
import java.util.List;

public class ZenMuxExample {
    public static void main(String[] args) throws Exception {
        String apiKey = "<你的 ZENMUX_API_KEY>"; // [!code highlight]
        
        // Build request body
        Map<String, Object> requestBody = Map.of(
            "model", "openai/gpt-5", // [!code highlight]
            "messages", List.of(
                Map.of(
                    "role", "user",
                    "content", "What's the meaning of life?"// [!code highlight]
                )
            )
        );
        
        ObjectMapper mapper = new ObjectMapper();
        String jsonBody = mapper.writeValueAsString(requestBody);
        
        // Create HTTP request
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://zenmux.ai/api/v1/chat/completions")) // [!code highlight]
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + apiKey) // [!code highlight]
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
            .build();
        
        // Send request
        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        System.out.println(response.body());
    }
}
```

:::

---

## Next Steps

You can now explore more features:

::: details Recommended Reading

- **[Model List](https://zenmux.ai/docs/models)** - Explore all models we support
- **[Advanced Features](https://zenmux.ai/docs/advanced)** - Streaming, function calling, and more
- **[API Reference](https://zenmux.ai/docs/api-reference)** - Get detailed information on all APIs

:::