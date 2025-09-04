# Anthropic API: Messages

ZenMux 支持 Anthropic API, 使用方式见 API 调用示例，具体请求参数和返回结构详见[Anthropic 官网](https://docs.anthropic.com/en/api/messages)

## 支持情况

支持 Anthropic API 所有功能，除了以下几个功能：
1. header 参数 anthropic-version 只支持"2023-06-01"
2. header 参数 anthropic-beta 不支持"code-execution-2025-08-25", 即无法使用code_execution工具

## API 调用示例

直接使用 curl 需要指定 anthropic-version: 2023-06-01 （仅支持该版本）。 

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

```bash [Curl]
curl https://zenmux.ai/api/v1/messages \
     --header "x-api-key: $ZENMUX_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "anthropic/claude-3.5-sonnet",
    "max_tokens": 1024,
    "messages": [
        {"role": "user", "content": "Hello, world"}
    ]
}'
```

## Claude code 使用方式

见[Claude Code Integration](/zh/best-practices/claude-code)
