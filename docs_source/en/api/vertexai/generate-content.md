# Google Vertex AI API: Generate Content

ZenMux supports the Google Vertex AI API using the Generative AI SDK. For detailed request parameters and response structures, see the [Google Vertex AI official documentation](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference).

## SDK
- [Python SDK](https://googleapis.github.io/python-genai/)
```bash
pip install google-genai
```
- [TypeScript SDK](https://github.com/googleapis/js-genai)
```bash
npm install @google/genai
```

## Examples

::: code-group
```Python [Python]
from google import genai  
from google.genai import types  
  
client = genai.Client(  
    api_key="$ZENMUX_API_KEY",  
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
  apiKey: "$ZENMUX_API_KEY",
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

## Supported Models
::: info Supported Models for the Google Vertex AI Protocol
Models compatible with the Google Vertex AI protocol are being onboarded in batches. You can view currently supported models by filtering for Vertex AI API Compatible in the [official model list](https://zenmux.ai/models):
![VertexAI-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/29/eD1abKu/vertexai-support.png)
You can also check via the [model detail page](https://zenmux.ai/google/gemini-2.5-flash-image):
![VertexAI-support](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/29/mlmpIst/detail-vertexai-support.png)
:::