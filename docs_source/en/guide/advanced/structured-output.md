---
head:
  - - meta
    - name: description
      content: Structured Output
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, structured, output, OpenAI, GPT, API
---

# Structured Output

ZenMux provides structured output to ensure model responses strictly follow your defined [JSON Schema](https://json-schema.org/) format.
Use this feature whenever you need fixed, structured data!

# Parameters

**response_format**

- Set { "type": "json_object" } to produce valid JSON output, without guarantees about specific structure or fields.
- Set { "type": "json_schema", "json_schema": {...} } to strictly constrain the JSON output structure with stronger type and shape guarantees.

1. Enable json_object mode

Input structure:

```json
{
  "response_format": {
    "type": "json_object"
  }
}
```

Output structure: content returns a valid JSON payload

```json
{
    "model": "openai/gpt-5-nano",
    "choices": [
        {
            "message": {
                // The actual content is a JSON string; shown as JSON here for readability
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

2. Enable json_schema mode

Define the input according to the standard [JSON Schema](https://json-schema.org/) format:

```json
{
  "response_format": {
    "type": "json_schema",
    // Standard json_schema payload
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

The returned content will be JSON conforming to the specified schema:

```json
{
    "model": "openai/gpt-5-nano",
    "choices": [
        {
            "message": {
                // The actual content is a JSON string; shown as JSON here for readability
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

On the model card page, find the corresponding provider and check whether response_format is listed among the supported parameters, as shown below:

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/08/21/1Hj7emo/res_format.jpg" 
       alt="img" 
       style="width: 100%; max-width: 700px; border-radius: 6px; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); margin: 18px 0;"
       loading="lazy" />
</div>

# API Call Examples

::: code-group

```python [Python]
from openai import OpenAI

# 1. Initialize the OpenAI client
client = OpenAI(
    # 2. Point the base URL to the ZenMux endpoint
    base_url="https://zenmux.ai/api/v1", # [!code highlight]
    # 3. Replace with the API Key from your ZenMux user console
    api_key="<your ZENMUX_API_KEY>", # [!code highlight]
)

# 4. Send a request
completion = client.chat.completions.create(
    # 5. Specify the model you want to use, in the format "provider/model_name"
    model="openai/gpt-5", # [!code highlight]
    messages=[
        {
            "role": "user",
            "content": "Hi, who are you? Describe yourself using about 50 words. Use JSON response format?" # [!code highlight]
        }
    ],
    # Option 1: Output is valid JSON, but without guarantees about specific structure or fields.
    # response_format = {
    #      "type": "json_object"
    #  }
    # Option 2: Strictly enforce the JSON output structure with stronger type and shape guarantees
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

// 1. Initialize the OpenAI client
const openai = new OpenAI({
  // 2. Point the base URL to the ZenMux endpoint
  baseURL: "https://zenmux.ai/api/v1", // [!code highlight]
  // 3. Replace with the API Key from your ZenMux user console
  apiKey = "<your ZENMUX_API_KEY>", // [!code highlight]
});

async function main() {
  // 4. Send a request
  const completion = await openai.chat.completions.create({
    // 5. Specify the model you want to use, in the format "provider/model_name"
    model: "openai/gpt-5",
    messages: [
      {
        role: "user",
        content:
          "Hi, who are you? Describe yourself using about 50 words. Use JSON response format?",
      },
    ],
    # Option 1: Output is valid JSON, but without guarantees about specific structure or fields.
    // response_format: {
    //     "type": "json_object"
    // }
    // Option 2: Strictly enforce the JSON output structure with stronger type and shape guarantees
    response_format: {
      type: "json_schema", // [!code highlight]
      json_schema: {
        // [!code highlight]
        name: "role",
        description: "Introduce yourself",
        schema: {
          type: "object",
          description: "Your messages",
          properties: {
            name: {
              type: "string",
              description: "your name",
            },
            city: {
              type: "string",
              description: "where your city",
            },
            desc: {
              type: "string",
              description: "description",
            },
          },
          required: ["name", "city", "desc"],
          additionalProperties: false,
        },
      },
    },
  });

  console.log(completion.choices[0].message.content);
}

main();
```