# Anthropic SDK Support

ZenMux supports invoking via the Anthropic SDK. See the API call examples below for usage. For detailed request parameters and response structures, refer to the [Anthropic documentation](https://docs.anthropic.com/en/api/messages)

# API Call Examples

::: code-group

```python [Python]
import anthropic

## 1. Initialize the anthropic client
client = anthropic.Anthropic(
    # Replace with the API Key from the ZenMux user console
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
    # 3. Point the base URL to the ZenMux endpoint
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

// 1. Initialize the anthropic client
const anthropic = new Anthropic({
  // 2. Replace with the API Key from the ZenMux user console
  apiKey: '<your ZENMUX_API_KEY>', // [!code highlight]
  // 3. Point the base URL to the ZenMux endpoint
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