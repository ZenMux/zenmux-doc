# 结构化输出
ZenMux 提供结构化输出功能，确保模型响应严格遵循您定义的[JSON Schema](https://json-schema.org/)格式。
当您有固定的结构化数据需求时，您可以用到此功能！
# 参数
**response_format**
- 设置{ "type": "json_object" }, 输出是有效的JSON格式，但不保证特定的结构或字段。
- 设置{ "type": "json_schema", "json_schema": {...} }, 更严格的控制 JSON 输出结构, 提供更强的类型和结构保证

1. 设置 json_object 模式 

输入结构：
```json
{
    "response_format": {
        "type": "json_object"
    }
}
```
输出结构: content 会返回有效的 JSON 格式内容 
```json
{
    "model": "openai/gpt-5-nano",
    "choices": [
        {
            "message": {
                // 实际content为json字符串，这个为了可读性，展示为json
                "content": {
                    "description": "I am ChatGPT, an AI assistant built by OpenAI. I help answer questions, brainstorm ideas, draft text, explain concepts, debug code, and learn topics. I use patterns from training data to generate helpful, clear responses while recognizing limits and inviting follow-up questions. I adapt tone and detail to your needs."
                }
            }
            ....
        }
    ]
    ....
}
```
2. 设置 json_schema 模式 

输入按照标准的 [JSON Schema](https://json-schema.org/) 格式定义好
```json
{
    "response_format": {
        "type": "json_schema",
        // 标准的json_schema数据
        "json_schema": {
            "name": "role",
            "description": "Introduce yourself",
            "schema": {
                "type": "object",
                "description": "Your messages",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "your name"
                    },
                    "city": {
                        "type": "string",
                        "description": "where your city"
                    },
                    "desc": {
                        "type": "string",
                        "description": "description"
                    }
                },
                "required": ["name", "city", "desc"],
                "additionalProperties": false
            }
        }
    }
}
```
输出的 content 会按照指定的schema格式返回 JSON 数据
```json
{
    "model": "openai/gpt-5-nano",
    "choices": [
        {
            "message": {
                // 实际content为json字符串，这个为了可读性，展示为json
                "content": {
                    "name": "ChatGPT",
                    "city": "Internet",
                    "desc": "I am ChatGPT, an AI language model created by OpenAI. I help with questions, ideas, writing, and problem-solving. I learn from patterns in text and aim to be helpful, accurate, and respectful. I don't have personal experiences, but I strive to understand your needs and respond clearly and kindly today."
                }
                ...
            }
        }
    ],
    ...
}
```
# 支持的模型

在模型卡片页面找到对应供应商，查看支持参数中是否有 response_format, 如下图所示：

![img](https://github-production-user-asset-6210df.s3.amazonaws.com/20706012/480308753-96820a8f-5e82-4dee-bcf3-e3ef5940af8f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250821%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250821T033651Z&X-Amz-Expires=300&X-Amz-Signature=d399221580848ee73df01cf6c3552ad216d9daaa72bd7cc652da7d0cbfb296df&X-Amz-SignedHeaders=host)

# API 调用示例

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
            "content": "Hi, who are you? Describe yourself using about 50 words. Use JSON response format?" # [!code highlight]
        }
    ],
    # 方式一、
    # response_format = {
    #      "type": "json_object"
    #  }
    # 方式二、
    response_format = { # [!code highlight]
        "type": "json_schema", # [!code highlight]
        "json_schema": {
            "name": "role",
            "description": "Introduce yourself",
            "schema": {
                "type": "object",
                "description": "Your messages",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "your name"
                    },
                    "city": {
                        "type": "string",
                        "description": "where your city"
                    },
                    "desc": {
                        "type": "string",
                        "description": "description"
                    }
                },
                "required": ["name", "city", "desc"],
                "additionalProperties": False
            }
        }
    }
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
    api_key="<你的 ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
    // 4. 发起请求
    const completion = await openai.chat.completions.create({
        // 5. 指定你想使用的模型，格式为 "供应商/模型名称"
        model: "openai/gpt-5",
        messages: [
            {
                "role": "user",
                "content": "Hi, who are you? Describe yourself using about 50 words. Use JSON response format?"
            }
        ],
        // 方式一、
        // response_format: {
        //     "type": "json_object"
        // }
        // 方式二、
        response_format: {
            type: "json_schema", // [!code highlight]
            json_schema: {       // [!code highlight]
                name: "role",
                description: "Introduce yourself",
                schema: {
                    type: "object",
                    description: "Your messages",
                    properties: {
                        name: {
                            type: "string",
                            description: "your name"
                        },
                        city: {
                            type: "string",
                            description: "where your city"
                        },
                        desc: {
                            type: "string",
                            description: "description"
                        }
                    },
                    required: ["name", "city", "desc"],
                    additionalProperties: false
                }
            }
        }
    });

    console.log(completion.choices[0].message.content);
}

main();```