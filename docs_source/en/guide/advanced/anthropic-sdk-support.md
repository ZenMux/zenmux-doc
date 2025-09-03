# Anthropic SDK Support

ZenMux supports the Anthropic SDK integration. See the API call examples below for usage. For detailed request parameters and response structures, refer to the [Anthropic Documentation](https://docs.anthropic.com/en/api/messages).

# API Call Examples

When using curl directly, you must specify anthropic-version: 2023-06-01 (only this version is supported).

::: code-group

```python [Python]
import anthropic

## 1. Initialize the Anthropic client
client = anthropic.Anthropic(
    # Replace with the API key from the ZenMux user console
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

// 1. Initialize the Anthropic client
const anthropic = new Anthropic({
  // 2. Replace with the API key from the ZenMux user console
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