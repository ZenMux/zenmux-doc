---
title: Tool Calls
subtitle: Use tools in your prompts
---

# Tool Calls

Provide models with new capabilities and data access so they can follow instructions and respond to prompts.

**Tool calls** (also known as **Function calls**) provide OpenAI models with a powerful and flexible way to interface with external systems and access data beyond their training data. This guide will show how to connect models to data and operations provided by your application. We'll demonstrate how to use function tools (defined by JSON schema) and custom tools that can handle free-form text input and output.

How it Works
--------

Let's first understand several key terms about tool calls. After we have a shared vocabulary understanding of tool calls, we'll walk through some practical examples showing how to implement them.

Tools - capabilities we provide to the model

A **function** or **tool** abstractly refers to a capability we tell the model it can access. When a model generates a response to a prompt, it may decide it needs data or functionality provided by a tool to follow the prompt's instructions.

You can provide the model with access to tools such as:

*   Get today's weather for a location
*   Access account details for a given user ID
*   Issue a refund for a lost order

Or any other operation you want the model to be able to know about or perform when responding to prompts.

When we make an API request to the model containing a prompt, we can include a list of tools the model might consider using. For example, if we want the model to be able to answer questions about the current weather somewhere in the world, we might give it access to a `get_weather` tool that takes `location` as a parameter.

Tool calls - model's requests to use tools

A **function call** or **tool call** refers to a special type of response we get from the model when, after examining a prompt, the model determines that in order to follow the instructions in the prompt, it needs to call one of the tools we've provided it with.

If the model receives a prompt like "What's the weather like in Paris?" in an API request, it can respond with a tool call to the `get_weather` tool with `Paris` as the `location` parameter.

Tool call output - output we generate for the model

**Function call output** or **tool call output** refers to the response a tool generates using the input from the model's tool call. Tool call output can be structured JSON or plain text and should include a reference to the specific model tool call (referenced via `call_id` in subsequent examples).

Completing our weather example:

*   The model can access a `get_weather` **tool** that takes `location` as a parameter.
*   In response to a prompt like "What's the weather like in Paris?", the model returns a **tool call** containing a `location` parameter with the value `Paris`
*   Our **tool call output** might be JSON structure like `{"temperature": "25", "unit": "C"}` indicating the current temperature is 25 degrees.

We then send all the tool definitions, original prompt, model's tool call, and tool call output back to the model together and finally receive a text response like:

```text
The weather in Paris today is 25°C.
```

Functions vs Tools

*   Functions are a specific type of tool defined by JSON schema. Function definitions allow the model to pass data to your application, and your code can access the data or perform actions the model suggests.
*   In addition to function tools, there are custom tools (described in this guide) that can handle free-text input and output.

### Tool Call Flow

Tool calls are a multi-step conversation between your application and the model through the OpenAI API. The tool call flow has five high-level steps:

1.  Make a request to the model, including the tools it can call
2.  Receive tool calls from the model
3.  Execute code on the application side using the tool call inputs
4.  Make a second request to the model, including the tool outputs
5.  Receive the final response from the model (or more tool calls)

![Function calling diagram steps](https://cdn.openai.com/API/docs/images/function-calling-diagram-steps.png)
> Image source: OpenAI

Function Tool Example
------------

Let's look at an end-to-end tool call flow using a `get_horoscope` function to get a daily horoscope for a zodiac sign.

Complete tool call example

::: code-group

```python
from openai import OpenAI
import json

client = OpenAI(
  base_url="https://zenmux.ai/api/v1",
  api_key="<ZENMUX_API_KEY>",
)

# 1. Define a list of callable tools for the model
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_horoscope",
            "description": "Get today's horoscope for a zodiac sign.",
            "parameters": {
                "type": "object",
                "properties": {
                    "sign": {
                        "type": "string",
                        "description": "Zodiac sign name, such as Taurus or Aquarius",
                    },
                },
                "required": ["sign"],
            },
        },
    },
]

# Create a running input list that we'll add to over time
input_list = [
    {"role": "user", "content": "What's my horoscope? I'm an Aquarius."}
]

# 2. Prompt the model with the defined tools
response = client.chat.completions.create(
    model="moonshotai/kimi-k2",
    tools=tools,
    messages=input_list,
)

# Save function call output for subsequent requests
function_call = None
function_call_arguments = None
input_list.append({
  "role": "assistant",
  "content": response.choices[0].message.content,
  "tool_calls": [tool_call.model_dump() for tool_call in response.choices[0].message.tool_calls] if response.choices[0].message.tool_calls else None,
})

for item in response.choices[0].message.tool_calls:
    if item.type == "function":
        function_call = item
        function_call_arguments = json.loads(item.function.arguments)

def get_horoscope(sign):
    return f"{sign}: Next Tuesday you will encounter a small otter."

# 3. Execute the get_horoscope function logic
result = {"horoscope": get_horoscope(function_call_arguments["sign"])}

# 4. Provide function call results to the model
input_list.append({
    "role": "tool",
    "tool_call_id": function_call.id,
    "name": function_call.function.name,
    "content": json.dumps(result),
})

print("Final input:")
print(json.dumps(input_list, indent=2, ensure_ascii=False))

response = client.chat.completions.create(
    model="moonshotai/kimi-k2",
    tools=tools,
    messages=input_list,
)

# 5. The model should now be able to provide a response!
print("Final output:")
print(response.model_dump_json(indent=2))
print("\n" + response.choices[0].message.content)
```

```javascript
import OpenAI from "openai";
const openai = new OpenAI({
  baseURL: 'https://zenmux.ai/api/v1',
  apiKey: '<ZENMUX_API_KEY>',
});

// 1. Define a list of callable tools for the model
const tools = [
  {
    type: "function",
    function: {
      name: "get_horoscope",
      description: "Get today's horoscope for a zodiac sign.",
      parameters: {
        type: "object",
        properties: {
          sign: {
            type: "string",
            description: "Zodiac sign name, such as Taurus or Aquarius",
          },
        },
        required: ["sign"],
      },
    },
  },
];

// Create a running input list that we'll add to over time
let input = [
  { role: "user", content: "What's my horoscope? I'm an Aquarius." },
];

// 2. Prompt the model with the defined tools
let response = await openai.chat.completions.create({
  model: "moonshotai/kimi-k2",
  tools,
  messages: input,
});

// Save function call output for subsequent requests
let functionCall = null;
let functionCallArguments = null;
input = input.concat(response.choices.map((c) => c.message));

response.choices.forEach((item) => {
  if (item.message.tool_calls && item.message.tool_calls.length > 0) {
    functionCall = item.message.tool_calls[0];
    functionCallArguments = JSON.parse(functionCall.function.arguments);
  }
});

// 3. Execute the get_horoscope function logic
function getHoroscope(sign) {
  return sign + " Next Tuesday you will encounter a small otter.";
}
const result = { horoscope: getHoroscope(functionCallArguments.sign) };

// 4. Provide function call results to the model
input.push({
  role: 'tool',
  tool_call_id: functionCall.id,
  name: functionCall.function.name,
  content: JSON.stringify(result),
});
console.log("Final input:");
console.log(JSON.stringify(input, null, 2));

response = await openai.chat.completions.create({
  model: "moonshotai/kimi-k2",
  instructions: "Respond using only the horoscope generated by the tool.",
  tools,
  messages: input,
});

// 5. The model should now be able to provide a response!
console.log("Final output:");
console.log(JSON.stringify(response.choices.map(v => v.message), null, 2));
```

:::

Note that for reasoning models like GPT-5 or o4-mini, any reasoning items returned in model responses that contain tool calls must also be passed back along with the tool call outputs.

Defining Functions
--------

Functions can be set in the `tools` parameter of each API request. Functions are defined by their schema, which tells the model what it does and what input parameters it expects. Function definitions have the following properties:

|Field|Description|
|---|---|
|type|Should always be function|
|function|Tool structure|
|function.name|Function name (e.g., get_weather)|
|function.description|Details about when and how to use this function|
|function.parameters|JSON schema defining the function's input parameters|
|function.strict|Whether to enable strict schema adherence when generating the function call|

Here's an example function definition for a `get_weather` function

```json
{
    "type": "function",
    "function": {
      "name": "get_weather",
      "description": "Retrieve the current weather for a given location.",
      "parameters": {
          "type": "object",
          "properties": {
              "location": {
                  "type": "string",
                  "description": "The city and country, e.g. Bogotá, Colombia"
              },
              "units": {
                  "type": "string",
                  "enum": ["celsius", "fahrenheit"],
                  "description": "The unit to return the temperature in."
              }
          },
          "required": ["location", "units"],
          "additionalProperties": false
      },
      "strict": true
    }
}
```

### Best Practices for Defining Functions

1.  **Write clear, detailed function names, parameter descriptions, and instructions.**
    
    *   **Clearly describe the function's purpose and each parameter** (and its format), and what the output represents.
    *   **Use system prompts to describe when (and when not) to use each function.** In general, tell the model exactly what to do.
    *   **Include examples and edge cases**, especially to correct any recurring failures. (**Note:** Adding examples may impact **reasoning model** performance.)
2.  **Apply software engineering best practices.**
    
    *   **Make functions obvious and intuitive.** ([Principle of least astonishment](https://en.wikipedia.org/wiki/Principle_of_least_astonishment))
    *   **Use enums** and object structures to make invalid states unrepresentable. (e.g., `toggle_light(on: bool, off: bool)` allows invalid calls)
    *   **Intern test.** Could an intern/human use the function correctly with only what you give the model? (If not, what questions would they ask you? Add the answers to the prompt.)
3.  **Offload burden from the model and use code whenever possible.**
    
    *   **Don't make the model fill in parameters you already know.** For example, if you already have the `order_id` from a previous menu, don't have an `order_id` parameter—use a parameter-less `submit_refund()` and pass the `order_id` through code.
    *   **Combine functions that are always called in sequence.** For example, if you always call `mark_location()` after `query_location()`, just move the marking logic into the query function call.
4.  **Keep function count low for higher accuracy.**
    
    *   **Evaluate performance with different numbers of functions**.
    *   **Aim for fewer than 20 functions at any time**, though this is just a soft suggestion.

### Token Usage

Under the hood, functions are injected into the system message in a syntax the model has been trained on. This means functions count towards the model's context limit and are billed as input tokens. If running into token limits, we suggest limiting the number of functions or the length of descriptions you provide for function parameters.

Handling Function Calls
------------

When the model calls a function, you must execute it and return the result. Since a model response might contain zero, one, or multiple calls, best practice is to assume several.

The response's `tool_calls` array contains function call entries (`type` is `function`). Each entry contains the following fields:

- `id`: Unique identifier for subsequently submitting function results
- `function`: Function structure
    - `name`: Function name  
    - `arguments`: JSON-encoded function parameters

Example response containing multiple function calls

```json
[
    {
        "id": "fc_12345xyz",
        "type": "function",
        "function": {
            "name": "get_weather",
            "arguments": "{\"location\":\"Paris, France\"}"
        }
    },
    {
        "id": "fc_67890abc",
        "type": "function",
        "function": {
            "name": "get_weather",
            "arguments": "{\"location\":\"Bogotá, Colombia\"}"
        }
    },
    {
        "id": "fc_99999def",
        "type": "function",
        "function": {
            "name": "send_email",
            "arguments": "{\"to\":\"bob@email.com\",\"body\":\"Hi bob\"}"
        }
    }
]
```

Execute function calls and append results

::: code-group

```python
for choice in response.choices:
    for tool_call in choice.message.tool_calls or []:
        if tool_call.type != "function":
            continue
        
        name = tool_call.function.name
        args = json.loads(tool_call.function.arguments)
        
        result = call_function(name, args)
        input_list.append({
            "role": "tool",
            "name": name,
            "tool_call_id": tool_call.id,
            "content": str(result)
        })
```

```javascript
for (const choice of response.choices) {
  for (const toolCall of choice.tool_calls) {
      if (toolCall.type !== "function") {
          continue;
      }

      const name = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);

      const result = callFunction(name, args);
      input.push({
          role: "tool",
          name: name,
          tool_call_id: toolCall.id,
          content: result.toString()
      });
  }
}
```

:::

In the above example, we have a hypothetical `call_function` to route each call. Here's a possible implementation:

Execute function calls and append results

::: code-group

```python
def call_function(name, args):
    if name == "get_weather":
        return get_weather(**args)
    if name == "send_email":
        return send_email(**args)
```

```javascript
const callFunction = async (name, args) => {
    if (name === "get_weather") {
        return getWeather(args.latitude, args.longitude);
    }
    if (name === "send_email") {
        return sendEmail(args.to, args.body);
    }
};
```

:::

### Formatting Results

Results must be strings, but the format is up to you (JSON, error codes, plain text, etc.). The model will interpret the string as needed.

If your function has no return value (e.g., `send_email`), simply return a string to represent success or failure. (e.g., `"success"`)

### Incorporating Results into Responses

After appending results to your `input`, you can send them back to the model to get a final response.

Send results back to the model

::: code-group

```python
response = client.chat.completions.create(
    model="moonshotai/kimi-k2",
    messages=input_messages,
    tools=tools,
)
```

```javascript
const response = await openai.chat.completions.create({
    model: "moonshotai/kimi-k2",
    messages: input,
    tools,
});
```

:::

Final response

```json
"Paris is about 15°C, Bogotá is about 18°C, and I sent that email to Bob."
```

Additional Configuration
--------

### Tool Choice

By default, the model will determine when and how many tools to use. You can force specific behavior using the `tool_choice` parameter.

1.  **Auto:** (_default_) Call zero, one, or more functions. `tool_choice: "auto"`
2.  **Required:** Call one or more functions. `tool_choice: "required"`

**When to use allowed_tools**

If you want only a subset of tools to be available in a model request, but don't want to modify the tool list you pass in to maximize prompt caching savings, you may want to configure an `allowed_tools` list.

```json
"tool_choice": {
    "type": "allowed_tools",
    "mode": "auto",
    "tools": [
        { "type": "function", "function": { "name": "get_weather" } },
        { "type": "function", "function": { "name": "get_time" } }
    ]
}
```

You can also set `tool_choice` to `"none"` to simulate the behavior of not passing functions.

Streaming
--------

Streaming can show progress by displaying which function is being called and the model filling in its parameters, even showing parameters in real time.

Streaming function calls is very similar to streaming regular responses: you set `stream` to `true` and get different `event` objects.

Streaming function calls

::: code-group

```python
from openai import OpenAI

client = OpenAI(
  base_url="https://zenmux.ai/api/v1",
  api_key="<ZENMUX_API_KEY>",
)

tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get the current temperature for a given location.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and country, e.g. Bogotá, Colombia"
                }
            },
            "required": [
                "location"
            ],
            "additionalProperties": False
        }
    }
}]

stream = client.chat.completions.create(
    model="moonshotai/kimi-k2",
    messages=[{"role": "user", "content": "What's the weather like in Paris today?"}],
    tools=tools,
    stream=True
)

for event in stream:
    print(event.choices[0].delta.model_dump_json())
```

```javascript
import { OpenAI } from "openai";

const openai = new OpenAI({
  baseURL: 'https://zenmux.ai/api/v1',
  apiKey: '<ZENMUX_API_KEY>',
});

const tools = [{
    type: "function",
    function: {
        name: "get_weather",
        description: "Get the current temperature (in Celsius) for provided coordinates.",
        parameters: {
            type: "object",
            properties: {
                latitude: { type: "number" },
                longitude: { type: "number" }
            },
            required: ["latitude", "longitude"],
            additionalProperties: false
        },
        strict: true,
    },
}];

const stream = await openai.chat.completions.create({
    model: "moonshotai/kimi-k2",
    messages: [{ role: "user", content: "What's the weather like in Paris today?" }],
    tools,
    stream: true,
});

for await (const event of stream) {
    console.log(JSON.stringify(event.choices[0].delta));
}
```

:::

Output events

```json
{"content":"I need","role":"assistant"}
{"content":" coordinates","role":"assistant"}
{"content":" for","role":"assistant"}
{"content":" Paris","role":"assistant"}
{"content":" to","role":"assistant"}
{"content":" get","role":"assistant"}
{"content":" the","role":"assistant"}
{"content":" weather","role":"assistant"}
{"content":" information","role":"assistant"}
{"content":".","role":"assistant"}
{"content":" Paris","role":"assistant"}
{"content":" has","role":"assistant"}
{"content":" a","role":"assistant"}
{"content":" latitude","role":"assistant"}
{"content":" of","role":"assistant"}
{"content":" approximately","role":"assistant"}
{"content":" 48","role":"assistant"}
{"content":".","role":"assistant"}
{"content":"856","role":"assistant"}
{"content":"6","role":"assistant"}
{"content":",","role":"assistant"}
{"content":" and","role":"assistant"}
{"content":" longitude","role":"assistant"}
{"content":" is","role":"assistant"}
{"content":" 2","role":"assistant"}
{"content":".","role":"assistant"}
{"content":"352","role":"assistant"}
{"content":"2","role":"assistant"}
{"content":".","role":"assistant"}
{"content":" Let","role":"assistant"}
{"content":" me","role":"assistant"}
{"content":" query","role":"assistant"}
{"content":" Paris","role":"assistant"}
{"content":"'s","role":"assistant"}
{"content":" weather","role":"assistant"}
{"content":" for","role":"assistant"}
{"content":" today","role":"assistant"}
{"content":".","role":"assistant"}
{"content":"","role":"assistant","tool_calls":[{"index":0,"id":"get_weather:0","function":{"arguments":"","name":"get_weather"},"type":"function"}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":"{\""}}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":"latitude"}}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":"\":"}}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":" "}}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":"48"}}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":"."}}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":"856"}}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":"6"}}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":","}}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":" \""}}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":"longitude"}}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":"\":"}}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":" "}}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":"2"}}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":"."}}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":"352"}}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":"2"}}]}
{"content":"","role":"assistant","tool_calls":[{"index":0,"function":{"arguments":"}"}}]}
{"content":"","role":"assistant"}
```

However, instead of aggregating chunks into a single `content` string, you aggregate chunks into an encoded `arguments` JSON object.

When the model calls one or more functions, a `tool_calls.type` of `function` event will be emitted for each function call
```json
{"content":"","role":"assistant","tool_calls":[{"index":0,"id":"get_weather:0","function":{"arguments":"","name":"get_weather"},"type":"function"}]}
```

Here's a code snippet demonstrating how to aggregate `delta` into a final `tool_call` object.

Accumulating `tool_call` content

::: code-group

```python
final_tool_calls = {}

for event in stream:
    delta = event.choices[0].delta
    if delta.tool_calls and len(delta.tool_calls) > 0:
        tool_call = delta.tool_calls[0]
        if tool_call.type == "function":
            final_tool_calls[tool_call.index] = tool_call
        else:
            final_tool_calls[tool_call.index].function.arguments += tool_call.function.arguments

print("Final tool calls:")
for index, tool_call in final_tool_calls.items():
    print(f"Tool Call {index}:")
    print(tool_call.model_dump_json(indent=2))
```

```javascript
const finalToolCalls = [];

for await (const event of stream) {
    const delta = event.choices[0].delta;
    if (delta.tool_calls && delta.tool_calls.length > 0) {
        const toolCall = delta.tool_calls[0];
        if (toolCall.type === "function") {
            finalToolCalls[toolCall.index] = toolCall;
        } else {
            finalToolCalls[toolCall.index].function.arguments += toolCall.function.arguments;
        }
    }
}

console.log("Final tool calls:");
console.log(JSON.stringify(finalToolCalls, null, 2));
```

:::

Accumulated final\_tool\_calls\[0\]

```json
{
    "index": 0,
    "id": "get_weather:0",
    "function": {
        "arguments": "{\"location\": \"Paris, France\"}",
        "name": "get_weather"
    },
    "type": "function"
}
```