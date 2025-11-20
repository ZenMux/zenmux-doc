# Google Vertex AI API: Generate Content

ZenMux 支持 Google Vertex AI API，使用 Gen AI SDK，具体请求参数和返回结构详见，具体请求参数和返回结构详见 [Google Vertex AI 官网](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference)。

## SDK
- [Python SDK](https://googleapis.github.io/python-genai/)
```bash
pip install google-genai
```
- [TypeScript SDK](https://github.com/googleapis/js-genai)
```bash
npm install @google/genai
```

## 示例

::: code-group
```Python [Python]
from google import genai  
from google.genai import types  

client = genai.Client(
    api_key="$ZenMux_API_KEY",
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

response = client.models.generate_content(  
    model="google/gemini-2.5-pro",  
    contents="How does AI work?"  
)
print(response.text)
```
```ts [TypeScript]
const genai = require("@google/genai");

const client = new genai.GoogleGenAI({
  apiKey: "$ZenMux_API_KEY",
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1"
  }
});

const response = await client.models.generateContent({
  model: "google/gemini-2.5-pro",
  contents: "How does AI work?",
});
console.log(response);
```

## 支持的模型
::: info Google Vertex AI 协议支持模型说明
支持 Google Vertex AI 协议的模型正在分批适配中，当前已支持的模型可以通过[官方模型列表](https://zenmux.ai/models)筛选 VextexAI API Compatible 查看:
![VertexAI-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/29/eD1abKu/vertexai-support.png)
或者也可以通过[模型详情页](https://zenmux.ai/google/gemini-2.5-flash-image)查看:
![VertexAI-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/29/mlmpIst/detail-vertexai-support.png)
:::