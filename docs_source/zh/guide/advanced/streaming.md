# 流式

ZenMux 允许任何模型以流式的方式逐步返回生成结果，而非一次性返回完整响应。流式输出能让用户第一时间看到大模型输出的第一个 Token，减少用户的等待时间。这种方式可以显著提升用户体验，尤其适用于实时对话、长文本生成等场景。

你可以通过在请求中将 `stream` 参数设置为 `true` 的方式来使用流式输出，并获得流式输出的响应。以下是两种调用示例：

## 方法一：使用 OpenAI 兼容接口 (推荐)

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
)

stream = client.chat.completions.create(
    model="openai/gpt-5",
    messages=[
        {
            "role": "user",
            "content": "生命的意义是什么？" 
        }
    ],
    # 通过设置 stream=True 开启流式输出模式
    stream=True, # [!code highlight]
)

# 当启用流式输出模式（stream=True），返回的内容会发生变化。
# 需要通过循环逐个访问返回值中每个单独的块（chunk）
for chunk in stream: # [!code highlight]
	delta = chunk.choices[0].delta # [!code highlight] <-- 使用 delta 字段
 
	if delta.content:
		print(delta.content, end="")
```

```ts [TypeScript]
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1",
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  const stream = await openai.chat.completions.create({
    model: "openai/gpt-5",
    messages: [
      {
        role: "user",
        content: "生命的意义是什么？",
      },
    ],
    // 通过设置 stream=True 开启流式输出模式
    stream: true, // [!code highlight]
  });

  // 当启用流式输出模式（stream=True），返回的内容会发生变化。
  // 需要通过循环逐个访问返回值中每个单独的块（chunk）
  for await (chunk of stream) { // [!code highlight] 
    delta = chunk.choices[0].delta // [!code highlight] <-- 使用 delta 字段
    
    if (delta.content) {
        console.log(delta.content)
    }
  }
}

main();
```

:::

---

## 方法二：直接调用 ZenMux API

::: code-group

```python [Python (httpx)]
import httpx
import json

async def stream_openai_chat_completion():
    api_key = "<你的 ZENMUX_API_KEY>" # [!code highlight]
    headers = {
        "Authorization": f"Bearer {api_key}",
    }
    payload = {
        "model": "openai/gpt-5",
        "messages": [
            {
                "role": "user",
                "content": "生命的意义是什么？"
            }
        ],
        "stream": True # [!code highlight]
    }

    async with httpx.AsyncClient() as client:
        async with client.stream(method="POST", url="https://zenmux.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=None) as response:
            response.raise_for_status()

            async for chunk in response.aiter_bytes():
                decoded_chunk = chunk.decode('utf-8')
                print(decoded_chunk)

if __name__ == "__main__":
    import asyncio
    asyncio.run(stream_openai_chat_completion())

```

```typescript [TypeScript (fetch)]
fetch("https://zenmux.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: "Bearer <你的 ZENMUX_API_KEY>", // [!code highlight]
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "openai/gpt-5", 
    messages: [
      {
        role: "user",
        content: "生命的意义是什么？",
      },
    ],
    stream: true // [!code highlight]
  }),
})
  .then(async (response) => {
    const textDecoder = new TextDecoder();
    for await (const chunk of response.body) {
      const textChunk = textDecoder.decode(chunk);
      console.log(textChunk)
    }
  })

```

```bash [Shell (cURL)]

curl "https://zenmux.ai/api/v1/chat/completions" \
  -H "Content-Type: application/json" \ 
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{  
    "model": "openai/gpt-5", 
    "messages": [ 
      { 
        "role": "user", 
        "content": "生命的意义是什么？" 
      } 
    ], 
    "stream": true
  }'
```
