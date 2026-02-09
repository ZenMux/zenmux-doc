---
head:
  - - meta
    - name: description
      content: Anthropic API Messages
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, create, messages, Anthropic, Claude
---

# Anthropic API: Messages

ZenMux supports the Anthropic API. See the API call examples below for usage. For detailed request parameters and response schemas, refer to the [Anthropic documentation](https://docs.anthropic.com/en/api/messages).

## Supported Features

All Anthropic API features are supported except for the following:

1. The header parameter anthropic-version only supports "2023-06-01".
2. The header parameter anthropic-beta does not support "code-execution-2025-08-25", i.e., the code_execution tool is unavailable.

## API Call Examples

When using cURL directly, you must specify anthropic-version: 2023-06-01 (this is the only supported version).

::: code-group

```python [Python]
import anthropic

## 1. Initialize the Anthropic client
client = anthropic.Anthropic(
    # Replace with the API key from your ZenMux console
    api_key="<YOUR ZENMUX_API_KEY>", # [!code highlight]
    # 3. Point the base URL to the ZenMux endpoint
    base_url="https://zenmux.ai/api/anthropic"  # [!code highlight]
)
message = client.messages.create(
    model="anthropic/claude-sonnet-4.5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
)
print(message.content)
```

```ts [TypeScript]
import Anthropic from "@anthropic-ai/sdk";

// 1. Initialize the Anthropic client
const anthropic = new Anthropic({
  // 2. Replace with the API key from your ZenMux console
  apiKey: "<YOUR ZENMUX_API_KEY>", // [!code highlight]
  // 3. Point the base URL to the ZenMux endpoint
  baseURL: "https://zenmux.ai/api/anthropic", // [!code highlight]
});

async function main() {
  const msg = await anthropic.messages.create({
    model: "anthropic/claude-sonnet-4.5",
    max_tokens: 1024,
    messages: [{ role: "user", content: "Hello, Claude" }],
  });
  console.log(msg);
}

main();
```

```bash [cURL]
curl https://zenmux.ai/api/anthropic/v1/messages \
     --header "x-api-key: $ZENMUX_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "anthropic/claude-sonnet-4.5",
    "max_tokens": 1024,
    "messages": [
        {"role": "user", "content": "Hello, world"}
    ]
}'
```

## Claude Code Usage

See [Claude Code Integration](/best-practices/claude-code)
