# 快速开始

ZenMux 提供了一个与 OpenAI 兼容的统一 API。

::: tip 💡 三步即可开始
只需要三个简单步骤，即可开始使用 ZenMux：
:::

1. **获取 API 密钥**：前往你的 **[用户控制台 > API Keys](https://zenmux.ai/settings/keys)** 页面，创建一个新的 API Key。
2. **选择集成方式**：我们推荐使用 OpenAI SDK 的兼容模式，也可以直接调用 ZenMux API。
3. **发起你的第一个请求**：复制下面的代码示例，替换你的 API Key，即可运行。

---

## 方法一：使用 OpenAI SDK (推荐)

::: info 兼容性说明
ZenMux 的 API 端点与 OpenAI API 完全兼容，只需修改两个参数即可无缝切换。
:::

### 代码示例

::: code-group

```python [Python]
from openai import OpenAI

# 1. 初始化 OpenAI 客户端
client = OpenAI(
    # 2. 将基础 URL 指向 ZenMux 端点
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    # 3. 替换为你从 ZenMux 用户控制台获取的 API Key
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
)

# 4. 发起请求
completion = client.chat.completions.create(
    # 5. 指定你想使用的模型，格式为 "供应商/模型名称"
    model="openai/gpt-5", # [!code highlight]
    messages=[
        {
            "role": "user",
            "content": "生命的意义是什么？" # [!code highlight]
        }
    ]
)

print(completion.choices[0].message.content)
```

```ts [TypeScript]
import OpenAI from "openai";

// 1. 初始化 OpenAI 客户端
const openai = new OpenAI({
  // 2. 将基础 URL 指向 ZenMux 端点
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  // 3. 替换为你从 ZenMux 用户控制台获取的 API Key
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  // 4. 发起请求
  const completion = await openai.chat.completions.create({
    // 5. 指定你想使用的模型，格式为 "供应商/模型名称"
    model: "openai/gpt-5", // [!code highlight]
    messages: [
      {
        role: "user",
        content: "生命的意义是什么？", // [!code highlight]
      },
    ],
  });

  console.log(completion.choices[0].message);
}

main();
```

```js [JavaScript]
import OpenAI from "openai";

// 1. 初始化 OpenAI 客户端
const openai = new OpenAI({
  // 2. 将基础 URL 指向 ZenMux 端点
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  // 3. 替换为你从 ZenMux 用户控制台获取的 API Key
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
});

// 4. 发起请求
const completion = await openai.chat.completions.create({
  // 5. 指定你想使用的模型，格式为 "供应商/模型名称"
  model: "openai/gpt-5", // [!code highlight]
  messages: [
    {
      role: "user",
      content: "生命的意义是什么？", // [!code highlight]
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
                    Content: "生命的意义是什么？", // [!code highlight]
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

## 方法二：直接调用 ZenMux API

::: code-group

```python [Python (httpx)]
import httpx

# 准备请求数据
api_key = "<你的 ZENMUX_API_KEY>" # [!code highlight]
headers = {
    "Authorization": f"Bearer {api_key}", # [!code highlight]
}
payload = {
    "model": "openai/gpt-5", # [!code highlight]
    "messages": [
        {
            "role": "user",
            "content": "生命的意义是什么？" # [!code highlight]
        }
    ]
}

# 发送 POST 请求
response = httpx.post(
    "https://zenmux.ai/api/v1/chat/completions", # [!code highlight]
    headers=headers,
    json=payload,
    timeout=httpx.Timeout(60.0)
)

# 检查请求是否成功（可选）
response.raise_for_status()

# 打印服务器返回的 JSON 响应
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
    // 可选。若不指定，ZenMux 将启用智能路由为你自动选择最佳模型。
    model: "openai/gpt-5", // [!code highlight]
    messages: [
      {
        role: "user",
        content: "生命的意义是什么？", // [!code highlight]
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
        "content": "生命的意义是什么？" 
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
        
        // 构建请求体
        Map<String, Object> requestBody = Map.of(
            "model", "openai/gpt-5", // [!code highlight]
            "messages", List.of(
                Map.of(
                    "role", "user",
                    "content", "生命的意义是什么？"// [!code highlight]
                )
            )
        );
        
        ObjectMapper mapper = new ObjectMapper();
        String jsonBody = mapper.writeValueAsString(requestBody);
        
        // 创建 HTTP 请求
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://zenmux.ai/api/v1/chat/completions")) // [!code highlight]
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + apiKey) // [!code highlight]
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
            .build();
        
        // 发送请求
        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        System.out.println(response.body());
    }
}
```

:::

---

## 后续步骤

接下来，你可以探索更多功能：

::: details 推荐阅读

- **[模型列表](https://zenmux.ai/docs/models)** - 探索我们支持的所有模型
- **[高级功能](https://zenmux.ai/docs/advanced)** - 流式传输、函数调用等
- **[API 参考文档](https://zenmux.ai/docs/api-reference)** - 获取所有 API 的详细信息

:::
