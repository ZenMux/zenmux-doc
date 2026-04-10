---
head:
  - - meta
    - name: description
      content: 快速开始
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, quickstart, OpenAI, Anthropic, Claude, Gemini, Vertex AI, API
---

# 快速开始

欢迎使用 **[ZenMux](https://docs.zenmux.ai/zh/about/intro.html)**！本指南将帮助你快速上手，从注册到发起第一个 API 请求，一步步引导你使用 ZenMux 的全部能力。

::: tip 💡 四步即可开始
只需要四个简单步骤，即可开始使用 ZenMux：
:::

1. **登录 ZenMux**：访问 **[ZenMux 登录页面](https://zenmux.ai/login)**，选择以下任一方式登录：

   - 邮箱登录
   - GitHub 账号登录
   - Google 账号登录

2. **选择使用方式**：根据你的使用场景，选择 [Pay As You Go（按量付费）](#选择使用方式) 或 [Builder Plan（订阅制）](#选择使用方式)。

3. **获取 API 密钥**：登录后，在对应的管理页面创建 API Key。

4. **发起你的第一个请求**：选择你熟悉的 [API 协议](#支持的-api-协议)，复制下面的代码示例，替换你的 API Key，即可运行。

---

## 选择使用方式

ZenMux 提供两种使用方式，适配不同的使用场景：

### Pay As You Go（按量付费）

**适用场景**：生产环境、商业化产品、高并发应用

Pay As You Go 采用**预充值 + 按实际消耗扣费**的模式，专为生产环境打造：

- **无 Rate Limit 限制**，支持高并发调用
- **按 Token 精确计费**，成本透明可控
-

前往 **[Pay As You Go 管理页面](https://zenmux.ai/platform/pay-as-you-go)** 充值并创建 API Key。

<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/01/19/rsGoojf/pay-as-you-go.png" alt="Pay As You Go 管理页面" style="border-radius:5px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">

::: info 📚 详细指南
完整的使用说明请参考 [Pay As You Go 使用指南](/zh/guide/pay-as-you-go)。
:::

### Builder Plan（订阅制）

**适用场景**：个人开发、学习探索、Vibe Coding、快速原型

Builder Plan 提供固定月费、可预测的 AI 模型调用方案：

- **固定月费**，$20/月起
- **全明星模型矩阵**，一个订阅调度全球 100+ 顶尖模型
- **全场景覆盖**，Coding + 生图 + 生视频 + 对话一站式搞定

前往 **[Pricing 页面](https://zenmux.ai/pricing/subscription)** 了解套餐详情并订阅。

<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/01/28/iszJOqe/ss-1.png" alt="订阅制套餐对比" style="border-radius:5px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">

::: info 📚 详细指南
完整的使用说明请参考 [订阅制套餐指南](/zh/guide/subscription)。
:::

### 两种方式对比

| 对比维度 | Pay As You Go（按量付费） | Builder Plan（订阅制） |
|---------|--------------------------|----------------------|
| **适用场景** | 生产环境、商业化产品 | 个人开发、学习探索 |
| **计费方式** | 按实际消耗精准计费 | 固定月费 |
| **Rate Limit** | 无限制 | 10-15 RPM |
| **并发限制** | 无限制 | 有 Weekly Limit |
| **使用限制** | 无特殊限制 | 禁止生产环境使用 |

::: warning ⚠️ 重要提示
如果你的项目已经上线或即将商业化，**必须使用 Pay As You Go 方案**。订阅制仅限个人开发和学习场景，禁止用于生产环境。
:::

---

::: info 模型 Slug 获取说明
ZenMux 平台的模型具备唯一 Slug，您可以通过[模型列表页](https://zenmux.ai/models)获取对应模型的 Slug：
![model-slug](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/21/AQG0SIr/model-slug.png)
或者[某个模型的模型详情页](https://zenmux.ai/google/gemini-3.1-pro-preview)获取对应模型的 Slug：
![model-slug](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/21/dWYxJnq/model-slug-3.png)
:::

---

## 支持的 API 协议

ZenMux 支持四种主流 API 协议，你可以使用最熟悉的 SDK 调用 ZenMux 上的所有模型：

| 协议 | Base URL | 兼容 SDK | 说明 |
|------|----------|----------|------|
| **OpenAI Chat Completions** | `https://zenmux.ai/api/v1` | OpenAI SDK | 最广泛使用的 Chat API |
| **OpenAI Responses** | `https://zenmux.ai/api/v1` | OpenAI SDK | OpenAI 新一代 Responses API |
| **Anthropic Messages** | `https://zenmux.ai/api/anthropic` | Anthropic SDK | Claude 系列原生协议 |
| **Google Gemini** | `https://zenmux.ai/api/vertex-ai/v1` | Google GenAI SDK | Gemini 系列原生协议 |

::: tip 💡 跨协议调用
ZenMux 的核心优势之一是**协议无关性**——你可以通过任意支持的协议调用任意模型。例如，用 OpenAI SDK 调用 Claude 模型，或用 Anthropic SDK 调用 Gemini 模型。
:::

---

### 协议一：OpenAI Chat Completions

::: info 兼容性说明
ZenMux 的 API 端点与 OpenAI Chat Completions API 完全兼容，只需修改 `base_url` 和 `api_key` 两个参数即可无缝切换。
:::

::: code-group

```python [Python]
from openai import OpenAI

# 1. 初始化 OpenAI 客户端
client = OpenAI(
    # 2. 将基础 URL 指向 ZenMux 端点
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    # 3. 替换为你从 ZenMux 获取的 API Key
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
)

# 4. 发起 Chat Completion 请求
completion = client.chat.completions.create(
    # 5. 指定模型，格式为 "供应商/模型名称"
    model="openai/gpt-5", # [!code highlight]
    messages=[
        {
            "role": "user",
            "content": "生命的意义是什么？"
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
  // 3. 替换为你从 ZenMux 获取的 API Key
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  // 4. 发起 Chat Completion 请求
  const completion = await openai.chat.completions.create({
    // 5. 指定模型，格式为 "供应商/模型名称"
    model: "openai/gpt-5", // [!code highlight]
    messages: [
      {
        role: "user",
        content: "生命的意义是什么？",
      },
    ],
  });

  console.log(completion.choices[0].message.content);
}

main();
```

```bash [cURL]
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

:::

---

### 协议二：OpenAI Responses

::: info 兼容性说明
ZenMux 同样兼容 OpenAI 新一代 Responses API。Base URL 与 Chat Completions 相同，调用方式更加简洁。
:::

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
)

# 使用 Responses API 发起请求
response = client.responses.create(
    model="openai/gpt-5", # [!code highlight]
    input="生命的意义是什么？" # [!code highlight]
)

print(response.output_text)
```

```ts [TypeScript]
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  const response = await openai.responses.create({
    model: "openai/gpt-5", // [!code highlight]
    input: "生命的意义是什么？", // [!code highlight]
  });

  console.log(response.output_text);
}

main();
```

```bash [cURL]
curl https://zenmux.ai/api/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "openai/gpt-5",
    "input": "生命的意义是什么？"
  }'
```

:::

---

### 协议三：Anthropic Messages

::: info 兼容性说明
ZenMux 完全支持 Anthropic Messages 协议，可以无缝集成到 Claude Code、Cursor 等工具中。

注意 Anthropic 协议的 `base_url` 为 `https://zenmux.ai/api/anthropic`，与 OpenAI 协议不同。
:::

::: info Anthropic 协议支持模型说明
支持 Anthropic 协议的模型正在分批适配中，当前已支持的模型可以通过[官方模型列表](https://zenmux.ai/models)筛选 Anthropic API Compatible 查看：
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/602FqX9/anthropic-support.png)
或者也可以通过[模型详情页](https://zenmux.ai/anthropic/claude-haiku-4.5)查看：
![anthropic-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/16/I9JHS8b/detail-anthropic-support.png)
:::

::: code-group

```python [Python]
from anthropic import Anthropic

# 1. 初始化 Anthropic 客户端
client = Anthropic(
    # 2. 将基础 URL 指向 ZenMux 端点
    base_url="https://zenmux.ai/api/anthropic", # [!code highlight]
    # 3. 替换为你从 ZenMux 获取的 API Key
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
)

# 4. 发起 Messages 请求
message = client.messages.create(
    model="google/gemini-3.1-pro-preview", # [!code highlight]
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "生命的意义是什么？"
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
  // 3. 替换为你从 ZenMux 获取的 API Key
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  // 4. 发起 Messages 请求
  const message = await client.messages.create({
    model: "google/gemini-3.1-pro-preview", // [!code highlight]
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "生命的意义是什么？",
      },
    ],
  });

  console.log(message.content[0].text);
}

main();
```

```bash [cURL]
curl https://zenmux.ai/api/anthropic/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ZENMUX_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "google/gemini-3.1-pro-preview",
    "max_tokens": 1024,
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

### 协议四：Google Gemini

::: info 兼容性说明
ZenMux 支持 Google Gemini（Vertex AI）协议，可以使用 Google GenAI SDK 直接调用。

Base URL 为 `https://zenmux.ai/api/vertex-ai/v1`，需要设置 `vertexai=True` 和自定义 `http_options`。
:::

::: code-group

```python [Python]
from google import genai
from google.genai import types

# 1. 初始化 Google GenAI 客户端
client = genai.Client(
    # 2. 替换为你从 ZenMux 获取的 API Key
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
    vertexai=True, # [!code highlight]
    # 3. 将 base_url 指向 ZenMux 端点
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai/v1' # [!code highlight]
    )
)

# 4. 发起 generateContent 请求
response = client.models.generate_content(
    model="google/gemini-3.1-pro-preview", # [!code highlight]
    contents="生命的意义是什么？"
)

print(response.text)
```

```ts [TypeScript]
import { GoogleGenAI } from "@google/genai";

// 1. 初始化 Google GenAI 客户端
const ai = new GoogleGenAI({
  // 2. 替换为你从 ZenMux 获取的 API Key
  apiKey: "<你的 ZENMUX_API_KEY>", // [!code highlight]
  vertexai: true, // [!code highlight]
  // 3. 将 base_url 指向 ZenMux 端点
  httpOptions: {
    apiVersion: "v1",
    baseUrl: "https://zenmux.ai/api/vertex-ai/v1", // [!code highlight]
  },
});

async function main() {
  // 4. 发起 generateContent 请求
  const response = await ai.models.generateContent({
    model: "google/gemini-3.1-pro-preview", // [!code highlight]
    contents: "生命的意义是什么？",
  });

  console.log(response.text);
}

main();
```

:::

---

## Platform API

ZenMux 提供一组 Platform Management API，让你能够通过编程方式查询账户用量、余额、订阅状态等信息，方便集成到你的监控和管理系统中。

::: warning ⚠️ Management API Key
Platform API 需要使用 **Management API Key** 鉴权（部分接口也支持普通 API Key）。前往 **[ZenMux 控制台 > Management](https://zenmux.ai/platform/management)** 创建 Management API Key。
:::

### 查询 Generation 详情

查询某次 API 调用的详细信息，包括 Token 用量、耗时、计费明细等。

```
GET https://zenmux.ai/api/v1/management/generation?id=<generation_id>
```

每次 API 调用会返回一个 `generation_id`，使用该 ID 即可查询本次调用的完整信息：

```bash
curl https://zenmux.ai/api/v1/management/generation?id=gen_01abc123def456 \
  -H "Authorization: Bearer $ZENMUX_API_KEY"
```

返回示例（部分字段）：

```json
{
  "api": "chat.completions",
  "generationId": "gen_01abc123def456",
  "model": "openai/gpt-4o",
  "generationTime": 3200,
  "latency": 500,
  "nativeTokens": {
    "completion_tokens": 128,
    "prompt_tokens": 32,
    "total_tokens": 160
  },
  "usage": 0.0052
}
```

::: tip 💡 计费信息延迟
计费信息（如 `usage`、`ratingResponses`）需要在请求完成后 **3-5 分钟** 才能查询到。Token 计量信息则会随请求同步返回。
:::

::: info 📚 完整文档
详细参数说明请参考 [Get Generation API 文档](/zh/api/platform/get-generation)。
:::

---

### 查询 PAYG 余额

获取当前账号的 Pay As You Go 余额信息。

```
GET https://zenmux.ai/api/v1/management/payg/balance
```

```bash
curl https://zenmux.ai/api/v1/management/payg/balance \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY"
```

返回示例：

```json
{
  "success": true,
  "data": {
    "currency": "usd",
    "total_credits": 482.74,
    "top_up_credits": 35.00,
    "bonus_credits": 447.74
  }
}
```

::: info 📚 完整文档
详细参数说明请参考 [Get PAYG Balance API 文档](/zh/api/platform/payg-balance)。
:::

---

### 查询订阅详情

获取当前账号的订阅信息，包括套餐等级、Flow 汇率、配额用量等。

```
GET https://zenmux.ai/api/v1/management/subscription/detail
```

```bash
curl https://zenmux.ai/api/v1/management/subscription/detail \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY"
```

返回示例（部分字段）：

```json
{
  "success": true,
  "data": {
    "plan": {
      "tier": "ultra",
      "amount_usd": 200,
      "interval": "month"
    },
    "account_status": "healthy",
    "quota_5_hour": {
      "max_flows": 800,
      "used_flows": 57.2,
      "remaining_flows": 742.8,
      "usage_percentage": 0.0715
    },
    "quota_7_day": {
      "max_flows": 6182,
      "used_flows": 416.11,
      "remaining_flows": 5765.89
    }
  }
}
```

::: info 📚 完整文档
详细参数说明请参考 [Get Subscription Detail API 文档](/zh/api/platform/subscription-detail)。
:::

---

### 查询 Flow 汇率

获取当前账号的 Flow 汇率信息。

```
GET https://zenmux.ai/api/v1/management/flow_rate
```

```bash
curl https://zenmux.ai/api/v1/management/flow_rate \
  -H "Authorization: Bearer $ZENMUX_MANAGEMENT_API_KEY"
```

返回示例：

```json
{
  "success": true,
  "data": {
    "currency": "usd",
    "base_usd_per_flow": 0.03283,
    "effective_usd_per_flow": 0.03283
  }
}
```

::: info 📚 完整文档
详细参数说明请参考 [Get Flow Rate API 文档](/zh/api/platform/flow-rate)。
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
