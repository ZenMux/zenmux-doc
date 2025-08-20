# Structured Output
ZenMux supports structured output from models, with responses following specific [JSON Schema](https://json-schema.org/) formats.
When you have fixed structured data requirements, you can use this feature!

# Parameters
**response_format**
- Setting { "type": "json_object" } only guarantees the output is valid JSON format, without guaranteeing specific structure or fields.
- Setting { "type": "json_schema", "json_schema": {...} } provides stricter control over JSON output structure, offering stronger type and structure guarantees.

1. Setting json_object mode 

Input structure:
```json
{
    "response_format": {
        "type": "json_object"
    }
}
```
Output structure: content will return valid JSON format content 
```json
{
    "model": "openai/gpt-5-nano",
    "choices": [
        {
            "message": {
                // Actual content is a json string, displayed as json here for readability
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

2. Setting json_schema mode 

Input follows standard [JSON Schema](https://json-schema.org/) format definition
```json
{
    "response_format": {
        "type": "json_schema",
        // Standard json_schema data
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
The output content will return JSON data according to the specified schema format
```json
{
    "model": "openai/gpt-5-nano",
    "choices": [
        {
            "message": {
                // Actual content is a json string, displayed as json here for readability
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

# Supported Models

Find the corresponding provider on the model card page and check if response_format is included in the supported parameters, as shown below:

![img](https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/20/cpP9tfy/format1.jpg)

# API Call Examples

::: code-group
```python [Python]
from openai import OpenAI

# 1. Initialize OpenAI client
client = OpenAI(
    # 2. Point base URL to ZenMux endpoint
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    # 3. Replace with your API Key obtained from ZenMux user console
    api_key="<你的 ZENMUX_API_KEY>", # [!code highlight]
)

# 4. Make request
completion = client.chat.completions.create(
    # 5. Specify the model you want to use, format: "provider/model-name"
    model="openai/gpt-5", # [!code highlight]
    messages=[
        {
            "role": "user",
            "content": "Hi, who are you? Describe yourself using about 50 words. Use JSON response format?" # [!code highlight]
        }
    ],
    # Method 1:
    # response_format = {
    #      "type": "json_object"
    #  }
    # Method 2:
    response_format = { # [!code highlight]
        "type": "json_schema", # [!code highlight]
        "json_schema": {
            "name": "role",
            "description": "介绍自己",
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
                        "description": "详细介绍"
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

// 1. Initialize OpenAI client
const openai = new OpenAI({
    // 2. Point base URL to ZenMux endpoint
    baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
    // 3. Replace with your API Key obtained from ZenMux user console
    api_key="<你的 ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
    // 4. Make request
    const completion = await openai.chat.completions.create({
        // 5. Specify the model you want to use, format: "provider/model-name"
        model: "openai/gpt-5",
        messages: [
            {
                "role": "user",
                "content": "Hi, who are you? Describe yourself using about 50 words. Use JSON response format?"
            }
        ],
        // Method 1:
        // response_format: {
        //     "type": "json_object"
        // }
        // Method 2:
        response_format: {
            type: "json_schema", // [!code highlight]
            json_schema: {       // [!code highlight]
                name: "role",
                description: "介绍自己",
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
                            description: "详细介绍"
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

main();
```