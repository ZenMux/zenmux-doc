# 快速开始

ZenMux 提供了一个与 OpenAI 兼容的统一 API。

只需三步，即可开始：

1. **获取 API 密钥**：前往你的 **[用户控制台 > API Keys](https://zenmux.ai/settings/keys)** 页面，创建一个新的 API Key。
2. **选择集成方式**：我们推荐使用 OpenAI SDK 的兼容模式，也可以直接调用 ZenMux API。
3. **发起你的第一个请求**：复制下面的代码示例，替换你的 API Key，即可运行。

---

## 方法一：使用 OpenAI 兼容接口 (推荐)

ZenMux 的 API 端点与 OpenAI API 完全兼容，只需修改两个参数即可无缝切换。

### **Python (`openai-python`)**

```python
from openai import OpenAI

# 1. 初始化 OpenAI 客户端
client = OpenAI(
    # 2. 将基础 URL 指向 ZenMux 端点
    base_url="https://zenmux.ai/api/v1",
    # 3. 替换为你从 ZenMux 用户控制台获取的 API Key
    api_key="<你的 ZENMUX_API_KEY>",
)

# 4. 发起请求
completion = client.chat.completions.create(
    # 5. 指定你想使用的模型，格式为 "供应商/模型名称"
    model="openai/gpt-5",
    messages=[
        {
            "role": "user",
            "content": "生命的意义是什么？"
        }
    ]
)

print(completion.choices[0].message.content)
```

#### **TypeScript (`openai-node`)**

```typescript
import OpenAI from "openai";

// 1. 初始化 OpenAI 客户端
const openai = new OpenAI({
  // 2. 将基础 URL 指向 ZenMux 端点
  baseURL: "https://zenmux.ai/api/v1",
  // 3. 替换为你从 ZenMux 用户控制台获取的 API Key
  apiKey: "<你的 ZENMUX_API_KEY>",
});

async function main() {
  // 4. 发起请求
  const completion = await openai.chat.completions.create({
    // 5. 指定你想使用的模型，格式为 "供应商/模型名称"
    model: "openai/gpt-5",
    messages: [
      {
        role: "user",
        content: "生命的意义是什么？",
      },
    ],
  });

  console.log(completion.choices[0].message);
}

main();
```

---

## 方法二：直接调用 ZenMux API

### **Python (`httpx`)**

```python

import httpx

# 准备请求数据
api_key = "<你的 ZENMUX_API_KEY>"
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
    ]
}

# 发送 POST 请求
response = httpx.post(
    "https://zenmux.ai/api/v1/chat/completions",
    headers=headers,
    json=payload
)

# 检查请求是否成功（可选）
response.raise_for_status()

# 打印服务器返回的 JSON 响应
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
    // 可选。若不指定，ZenMux 将启用智能路由为你自动选择最佳模型。
    model: "openai/gpt-5",
    messages: [
      {
        role: "user",
        content: "生命的意义是什么？",
      },
    ],
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### **Shell (`cURL`)**

> **安全提示:** 为避免密钥泄露，建议将 API Key 设置为环境变量。
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
        "content": "生命的意义是什么？"
      }
    ]
  }'
```

---

## 后续步骤

恭喜你！现在你已经成功发起了第一个 API 请求。接下来，你可以：

- **查看 [模型列表](https://zenmux.ai/docs/models)**，探索我们支持的所有模型。
- **探索 [流式传输、函数调用](https://zenmux.ai/docs/advanced)** 等高级功能。
- **查阅完整的 [API 参考文档](https://zenmux.ai/docs/api-reference)** 获取所有 API 的详细信息。
