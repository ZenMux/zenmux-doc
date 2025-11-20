# 图片生成 

ZenMux 中有 Banana 模型，目前支持 vertexAI 协议来生成图片，[Vertex AI 官网文档](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference?hl=zh-cn), [Vertex Ai nano-banana Notebook](https://github.com/GoogleCloudPlatform/generative-ai/tree/main/gemini/nano-banana)

目前支持的模型有,持续更新中：
- google/gemini-2.5-flash-image
- google/gemini-3-pro-image-preview
- google/gemini-3-pro-image-preview-free
- google/gemini-2.5-flash-image-free

更多请到[模型列表](https://zenmux.ai/models) 搜索

## 使用方式

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
# 流式： generate_content_stream
# 非流式 generate_content
response = client.models.generate_content(  
    model="google/gemini-3-pro-image-preview",  
    contents="Generate an image of the Eiffel tower with fireworks in the background?",
    config=types.GenerateContentConfig(
        response_modalities= ["TEXT", "IMAGE"]
    )
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
// 流式：generateContentStream
// 非流式 generateContent
const response = await client.models.generateContent({
  model: "google/gemini-3-pro-image-preview",
  contents: "Generate an image of the Eiffel tower with fireworks in the background?",
  config: {
    // 必须要传
    responseModalities: ["TEXT", "IMAGE"],
    // 更多参数去VertexAI官网
  }
});
console.log(response);
```
