# Anthropic SDK 支持

ZenMux 支持 Anthropic SDK 的调用方式, 使用方式见API调用示例，具体请求参数和返回结构详见[Anthropic 官网](https://docs.anthropic.com/en/api/messages)

# API 调用示例

::: code-group

```python [Python]
import anthropic

## 1. 初始化 anthropic 客户端
client = anthropic.Anthropic(
    # 替换为你从 ZenMux 用户控制台获取的 API Key
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
    # 3. 将基础 URL 指向 ZenMux 端点
    base_url="https://zenmux.ai/api"  # [!code highlight]
)
message = client.messages.create(
    model="anthropic/claude-3.5-sonnet",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
)
print(message.content)
```

```ts [TypeScript]
import Anthropic from '@anthropic-ai/sdk';

// 1. 初始化 anthropic 客户端
const anthropic = new Anthropic({
  // 2. 替换为你从 ZenMux 用户控制台获取的 API Key
  apiKey: '<你的 ZENMUX_API_KEY>', // [!code highlight]
  // 3. 将基础 URL 指向 ZenMux 端点
  baseURL: "https://zenmux.ai/api", // [!code highlight]
});

async function main () {
    const msg = await anthropic.messages.create({
        model: "anthropic/claude-3.5-sonnet",
        max_tokens: 1024,
        messages: [{ role: "user", content: "Hello, Claude" }],
    });
    console.log(msg);
}

main();
```
