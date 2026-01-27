---
head:
  - - meta
    - name: description
      content: 快速开始
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, quickstart, OpenAI, Anthropic, Claude, API
---

# 快速开始

欢迎使用 **[ZenMux](https://docs.zenmux.ai/zh/about/intro.html)**！本指南将帮助你快速上手，展示如何通过三种不同的方法调用 ZenMux API。

::: tip 💡 四步即可开始
只需要四个简单步骤，即可开始使用 ZenMux：
:::

1. **登录 ZenMux**：访问 **[ZenMux 登录页面](https://zenmux.ai/login)**，选择以下任一方式登录：

   - 邮箱登录
   - GitHub 账号登录
   - Google 账号登录

2. **获取 API 密钥**：登录后，前往你的 **[用户控制台 > API Keys](https://zenmux.ai/settings/keys)** 页面，创建一个新的 API Key。

3. **选择调用方式**：我们推荐使用 OpenAI SDK 或 Anthropic SDK 的兼容模式，也可以直接调用 ZenMux API。

4. **发起你的第一个请求**：复制下面的代码示例，替换你的 API Key，即可运行。

---

::: info 模型Slug获取说明
ZenMux平台的模型具备唯一Slug，您可以通过[模型列表页](https://zenmux.ai/models)获取对应模型的Slug:
![model-slug](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/21/AQG0SIr/model-slug.png)
或者[某个模型的模型详情页](https://zenmux.ai/anthropic/claude-sonnet-4.5)获取对应模型的Slug:
![model-slug](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/21/dWYxJnq/model-slug-3.png)
:::

## 方法一：使用 OpenAI SDK

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

:::

---

## 方法二：使用 Anthropic SDK

::: info 兼容性说明
ZenMux 完全支持 Anthropic API 协议，可以无缝集成到 Claude Code、Cursor 等工具中。只需修改两个参数即可使用。

注意 Anthropic 协议的 base_url="https://zenmux.ai/api/anthropic"。
:::

::: info Anthropic协议支持模型说明
支持Anthropic协议的模型正在分批适配中，当前已支持的模型可以通过[官方模型列表](https://zenmux.ai/models)筛选Anthropic API Compatible查看:
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/602FqX9/anthropic-support.png)
或者也可以通过[模型详情页](https://zenmux.ai/anthropic/claude-haiku-4.5)查看:
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/I9JHS8b/detail-anthropic-support.png)
:::

### 代码示例

::: code-group

```python [Python]
from anthropic import Anthropic

# 1. 初始化 Anthropic 客户端
client = Anthropic(
    # 2. 将基础 URL 指向 ZenMux 端点
    base_url="https://zenmux.ai/api/anthropic", # [!code highlight]
    # 3. 替换为你从 ZenMux 用户控制台获取的 API Key
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
)

# 4. 发起请求
message = client.messages.create(
    # 5. 指定你想使用的模型，格式为 "供应商/模型名称"
    model="anthropic/claude-sonnet-4.5", # [!code highlight]
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "生命的意义是什么？" # [!code highlight]
        }
    ]
)

print(message.content[0].text)
```

```ts [TypeScript]
import Anthropic from "@anthropic-ai/sdk";

// 1. 初始化 Anthropic 客户端
const client = new Anthropic({
  // 2. 将基础 URL 指向 ZenMux 端点
  baseURL: "https://zenmux.ai/api/anthropic", // [!code highlight]
  // 3. 替换为你从 ZenMux 用户控制台获取的 API Key
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  // 4. 发起请求
  const message = await client.messages.create({
    // 5. 指定你想使用的模型，格式为 "供应商/模型名称"
    model: "anthropic/claude-sonnet-4.5", // [!code highlight]
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "生命的意义是什么？", // [!code highlight]
      },
    ],
  });

  console.log(message.content[0].text);
}

main();
```

:::

---

## 方法三：直接调用 ZenMux API

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
fetch("https://zenmux.ai/api/v1/chat/completions", {
  // [!code highlight]
  method: "POST",
  headers: {
    Authorization: "Bearer <你的 ZENMUX_API_KEY>", // [!code highlight]
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
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

:::

---

## 高级用法

关于高级用法的详细信息，请参阅高级调用章节的内容。

::: tip 联系我们
如果您在使用过程中遇到任何问题，或有任何建议和反馈，欢迎通过以下方式联系我们：

- **官方网站**：<https://zenmux.ai>
- **技术支持邮箱**：[support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**：[bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**：[@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**：<http://discord.gg/vHZZzj84Bm>

更多联系方式和详细信息，请访问我们的[联系我们页面](/zh/help/contact)。
:::
