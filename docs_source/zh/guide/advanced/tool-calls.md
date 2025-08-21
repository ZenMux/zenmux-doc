---
title: 工具调用
subtitle: 在你的 prompt 中使用工具
---

# 工具调用

为模型提供新的功能和数据访问权限，以便它们能够遵循指令并响应提示。

**工具调用**（也称为**函数调用**）为 OpenAI 模型提供了一种强大而灵活的方式来与外部系统接口并访问其训练数据之外的数据。本指南将展示如何将模型连接到应用程序提供的数据和操作。我们将展示如何使用函数工具（由 JSON schema 定义）和自定义工具，它们可以处理自由格式的文本输入和输出。

工作原理
--------

让我们首先理解关于工具调用的几个关键术语。在我们对工具调用有了共同的词汇理解后，我们将通过一些实际示例来展示如何实现。

工具 - 我们为模型提供的功能

**函数**或**工具**抽象地指代我们告诉模型它可以访问的一项功能。当模型生成对提示的响应时，它可能决定需要工具提供的数据或功能来遵循提示的指令。

你可以为模型提供以下工具的访问权限：

*   获取某个位置的今日天气
*   访问给定用户 ID 的账户详情
*   为丢失订单发放退款

或者任何其他你希望模型在响应提示时能够知道或执行的操作。

当我们向模型发出包含提示的 API 请求时，我们可以包含一个模型可能考虑使用的工具列表。例如，如果我们希望模型能够回答世界某个地方当前天气的问题，我们可能会给它访问一个 `get_weather` 工具，该工具以 `location` 作为参数。

工具调用 - 模型使用工具的请求

**函数调用**或**工具调用**指的是我们从模型获得的一种特殊响应，当模型检查提示后，确定为了遵循提示中的指令，需要调用我们为其提供的工具之一。

如果模型在 API 请求中收到类似"巴黎的天气如何？"的提示，它可以响应一个对 `get_weather` 工具的工具调用，以 `Paris` 作为 `location` 参数。

工具调用输出 - 我们为模型生成的输出

**函数调用输出**或**工具调用输出**指的是工具使用模型工具调用的输入生成的响应。工具调用输出可以是结构化的 JSON 或纯文本，并且应该包含对特定模型工具调用的引用（在后续示例中通过 `call_id` 引用）。

完成我们的天气示例：

*   模型可以访问一个 `get_weather` **工具**，该工具以 `location` 作为参数。
*   响应类似"巴黎的天气如何？"的提示时，模型返回一个**工具调用**，包含值为 `Paris` 的 `location` 参数
*   我们的**工具调用输出**可能是类似 `{"temperature": "25", "unit": "C"}` 的 JSON 结构，表示当前温度为 25 度。

然后我们将所有工具定义、原始提示、模型的工具调用和工具调用输出一起发送回模型，最终收到如下文本响应：

```text
巴黎今天的天气是 25°C。
```

函数与工具

*   函数是一种特定类型的工具，由 JSON schema 定义。函数定义允许模型向您的应用程序传递数据，您的代码可以访问数据或执行模型建议的操作。
*   除了函数工具外，还有自定义工具（在本指南中描述），它们可以处理自由文本输入和输出。
*   还有作为 OpenAI 平台一部分的[内置工具](/docs/guides/tools)。这些工具使模型能够[搜索网络](/docs/guides/tools-web-search)、[执行代码](/docs/guides/tools-code-interpreter)、访问 [MCP 服务器](/docs/guides/tools-remote-mcp)的功能等等。

### 工具调用流程

工具调用是您的应用程序和模型通过 OpenAI API 进行的多步对话。工具调用流程有五个高级步骤：

1.  向模型发出请求，包含它可以调用的工具
2.  从模型接收工具调用
3.  在应用程序端使用工具调用的输入执行代码
4.  向模型发出第二次请求，包含工具输出
5.  从模型接收最终响应（或更多工具调用）

![函数调用图表步骤](https://cdn.openai.com/API/docs/images/function-calling-diagram-steps.png)

函数工具示例
------------

让我们看一个端到端的工具调用流程，使用 `get_horoscope` 函数获取星座的每日运势。

完整的工具调用示例

::: code-group

```python
from openai import OpenAI
import json

client = OpenAI(
  base_url="https://zenmux.ai/api/v1",
  api_key="<ZENMUX_API_KEY>",
)

# 1. 为模型定义可调用工具列表
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_horoscope",
            "description": "获取某个星座的今日运势。",
            "parameters": {
                "type": "object",
                "properties": {
                    "sign": {
                        "type": "string",
                        "description": "星座名称，如金牛座或水瓶座",
                    },
                },
                "required": ["sign"],
            },
        },
    },
]

# 创建一个运行中的输入列表，我们将随时间添加到其中
input_list = [
    {"role": "user", "content": "我的运势如何？我是水瓶座。"}
]

# 2. 使用定义的工具提示模型
response = client.chat.completions.create(
    model="moonshotai/kimi-k2",
    tools=tools,
    messages=input_list,
)

# 保存函数调用输出以供后续请求使用
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
    return f"{sign}：下周二你将结识一只小水獺。"

# 3. 执行 get_horoscope 的函数逻辑
result = {"horoscope": get_horoscope(function_call_arguments["sign"])}

# 4. 向模型提供函数调用结果
input_list.append({
    "role": "tool",
    "tool_call_id": function_call.id,
    "name": function_call.function.name,
    "content": json.dumps(result),
})

print("最终输入:")
print(json.dumps(input_list, indent=2, ensure_ascii=False))

response = client.chat.completions.create(
    model="moonshotai/kimi-k2",
    tools=tools,
    messages=input_list,
)

# 5. 模型现在应该能够给出响应！
print("最终输出:")
print(response.model_dump_json(indent=2))
print("\n" + response.choices[0].message.content)
```

```javascript
import OpenAI from "openai";
const openai = new OpenAI({
  baseURL: 'https://zenmux.ai/api/v1',
  apiKey: '<ZENMUX_API_KEY>',
});

// 1. 为模型定义可调用工具列表
const tools = [
  {
    type: "function",
    function: {
      name: "get_horoscope",
      description: "获取某个星座的今日运势。",
      parameters: {
        type: "object",
        properties: {
          sign: {
            type: "string",
            description: "星座名称，如金牛座或水瓶座",
          },
        },
        required: ["sign"],
      },
    },
  },
];

// 创建一个运行中的输入列表，我们将随时间添加到其中
let input = [
  { role: "user", content: "我的运势如何？我是水瓶座。" },
];

// 2. 使用定义的工具提示模型
let response = await openai.chat.completions.create({
  model: "moonshotai/kimi-k2",
  tools,
  messages: input,
});

// 保存函数调用输出以供后续请求使用
let functionCall = null;
let functionCallArguments = null;
input = input.concat(response.choices.map((c) => c.message));

response.choices.forEach((item) => {
  if (item.message.tool_calls && item.message.tool_calls.length > 0) {
    functionCall = item.message.tool_calls[0];
    functionCallArguments = JSON.parse(functionCall.function.arguments);
  }
});

// 3. 执行 get_horoscope 的函数逻辑
function getHoroscope(sign) {
  return sign + " 下周二你将结识一只小水獺。";
}
const result = { horoscope: getHoroscope(functionCallArguments.sign) };

// 4. 向模型提供函数调用结果
input.push({
  role: 'tool',
  tool_call_id: functionCall.id,
  name: functionCall.function.name,
  content: JSON.stringify(result),
});
console.log("最终输入:");
console.log(JSON.stringify(input, null, 2));

response = await openai.chat.completions.create({
  model: "moonshotai/kimi-k2",
  instructions: "仅使用工具生成的运势进行响应。",
  tools,
  messages: input,
});

// 5. 模型现在应该能够给出响应！
console.log("最终输出:");
console.log(JSON.stringify(response.choices.map(v => v.message), null, 2));
```

:::

注意，对于像 GPT-5 或 o4-mini 这样的推理模型，任何在包含工具调用的模型响应中返回的推理项目也必须与工具调用输出一起传递回去。

定义函数
--------

函数可以在每个 API 请求的 `tools` 参数中设置。函数通过其 schema 定义，该 schema 告诉模型它的作用以及期望的输入参数。函数定义具有以下属性：

|字段|描述|
|---|---|
|type|应该始终为 function|
|function|工具结构体|
|function.name|函数名称（例如 get_weather）|
|function.description|何时以及如何使用该函数的详细信息|
|function.parameters|定义函数输入参数的 JSON schema|
|function.strict|是否在生成函数调用时启用严格的模式遵循|

以下是 `get_weather` 函数的示例函数定义

```json
{
    "type": "function",
    "function": {
      "name": "get_weather",
      "description": "检索给定位置的当前天气。",
      "parameters": {
          "type": "object",
          "properties": {
              "location": {
                  "type": "string",
                  "description": "城市和国家，例如 波哥大, 哥伦比亚"
              },
              "units": {
                  "type": "string",
                  "enum": ["celsius", "fahrenheit"],
                  "description": "返回温度的单位。"
              }
          },
          "required": ["location", "units"],
          "additionalProperties": false
      },
      "strict": true
    }
}
```

### 定义函数的最佳实践

1.  **编写清晰详细的函数名称、参数描述和指令。**
    
    *   **明确描述函数的目的和每个参数**（及其格式），以及输出代表什么。
    *   **使用系统提示描述何时（以及何时不）使用每个函数。** 通常，准确告诉模型要做什么。
    *   **包含示例和边界情况**，特别是用于纠正任何反复出现的失败。（**注意：** 添加示例可能会影响**推理模型**的性能。）
2.  **应用软件工程最佳实践。**
    
    *   **使函数显而易见且直观**。([最小惊讶原则](https://en.wikipedia.org/wiki/Principle_of_least_astonishment))
    *   **使用枚举**和对象结构使无效状态无法表示。（例如 `toggle_light(on: bool, off: bool)` 允许无效调用）
    *   **通过实习生测试。** 实习生/人类仅凭你给模型的内容能否正确使用该函数？（如果不能，他们会问你什么问题？将答案添加到提示中。）
3.  **从模型中卸载负担，尽可能使用代码。**
    
    *   **不要让模型填充你已经知道的参数。** 例如，如果你根据之前的菜单已经有了 `order_id`，不要有 `order_id` 参数——而是使用无参数的 `submit_refund()` 并通过代码传递 `order_id`。
    *   **组合总是按顺序调用的函数。** 例如，如果你总是在 `query_location()` 之后调用 `mark_location()`，只需将标记逻辑移到查询函数调用中。
4.  **保持函数数量较少以获得更高的准确性。**
    
    *   **评估不同函数数量的性能**。
    *   **目标是任何时候少于 20 个函数**，尽管这只是一个软性建议。

### Token 使用

在底层，函数以模型已训练的语法注入到系统消息中。这意味着函数会计入模型的上下文限制，并作为输入 token 计费。如果遇到 token 限制，我们建议限制函数数量或为函数参数提供的描述长度。

处理函数调用
------------

当模型调用函数时，您必须执行它并返回结果。由于模型响应可能包含零个、一个或多个调用，最佳实践是假设有几个。

响应的 `tool_calls` 数组包含函数调用条目（`type` 为 `function`）。每个条目包含以下字段：

- `id`：用于后续提交函数结果的唯一标识符
- `function`: 函数结构体
    - `name`：函数名称  
    - `arguments`：JSON 编码的函数参数

包含多个函数调用的示例响应

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

执行函数调用并附加结果

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

在上面的示例中，我们有一个假设的 `call_function` 来路由每个调用。以下是可能的实现：

执行函数调用并附加结果

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

### 格式化结果

结果必须是字符串，但格式由您决定（JSON、错误代码、纯文本等）。模型将根据需要解释该字符串。

如果您的函数没有返回值（例如 `send_email`），只需返回一个字符串来表示成功或失败。（例如 `"success"`）

### 将结果合并到响应中

将结果附加到您的 `input` 后，您可以将它们发送回模型以获得最终响应。

将结果发送回模型

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

最终响应

```json
"巴黎约为 15°C，波哥大约为 18°C，我已经给 Bob 发送了那封邮件。"
```

其他配置
--------

### 工具选择

默认情况下，模型将确定何时以及使用多少工具。您可以使用 `tool_choice` 参数强制特定行为。

1.  **Auto：**（_默认_）调用零个、一个或多个函数。`tool_choice: "auto"`
2.  **Required：** 调用一个或多个函数。`tool_choice: "required"`

**何时使用 allowed\_tools**

如果您希望在模型请求中仅使用工具的子集可用，但不修改您传入的工具列表，以便最大化提示缓存的节省，您可能希望配置 `allowed_tools` 列表。

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

您也可以将 `tool_choice` 设置为 `"none"` 来模拟不传递函数的行为。

流式传输
--------

流式传输可以通过显示调用哪个函数以及模型填充其参数，甚至实时显示参数来显示进度。

流式函数调用与流式常规响应非常相似：您将 `stream` 设置为 `true` 并获得不同的 `event` 对象。

流式函数调用

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
        "description": "获取给定位置的当前温度。",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "城市和国家，例如 波哥大, 哥伦比亚"
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
    messages=[{"role": "user", "content": "巴黎今天的天气怎么样？"}],
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
        description: "获取提供坐标的当前温度（摄氏度）。",
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
    messages: [{ role: "user", content: "巴黎今天的天气怎么样？" }],
    tools,
    stream: true,
});

for await (const event of stream) {
    console.log(JSON.stringify(event.choices[0].delta));
}
```

:::

输出事件

```json
{"content":"我需要","role":"assistant"}
{"content":"巴黎","role":"assistant"}
{"content":"的","role":"assistant"}
{"content":"坐标","role":"assistant"}
{"content":"才能","role":"assistant"}
{"content":"获取","role":"assistant"}
{"content":"天气","role":"assistant"}
{"content":"信息","role":"assistant"}
{"content":"。","role":"assistant"}
{"content":"巴黎","role":"assistant"}
{"content":"的","role":"assistant"}
{"content":"纬度","role":"assistant"}
{"content":"大约是","role":"assistant"}
{"content":"48","role":"assistant"}
{"content":".","role":"assistant"}
{"content":"856","role":"assistant"}
{"content":"6","role":"assistant"}
{"content":"，","role":"assistant"}
{"content":"经","role":"assistant"}
{"content":"度","role":"assistant"}
{"content":"是","role":"assistant"}
{"content":"2","role":"assistant"}
{"content":".","role":"assistant"}
{"content":"352","role":"assistant"}
{"content":"2","role":"assistant"}
{"content":"。","role":"assistant"}
{"content":"让我","role":"assistant"}
{"content":"为您","role":"assistant"}
{"content":"查询","role":"assistant"}
{"content":"巴黎","role":"assistant"}
{"content":"今天的","role":"assistant"}
{"content":"天气","role":"assistant"}
{"content":"。","role":"assistant"}
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

然而，您不是将块聚合到单个 `content` 字符串中，而是将块聚合到编码的 `arguments` JSON 对象中。

当模型调用一个或多个函数时，将为每个函数调用发出 `tool_calls.type` 为 `function` 事件
```json
{"content":"","role":"assistant","tool_calls":[{"index":0,"id":"get_weather:0","function":{"arguments":"","name":"get_weather"},"type":"function"}]}
```

以下是一个代码片段，演示如何将 `delta` 聚合为最终的 `tool_call` 对象。

累积 `tool_call` 内容

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

print("最终工具调用:")
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

console.log("最终工具调用:");
console.log(JSON.stringify(finalToolCalls, null, 2));
```

:::

累积的 final\_tool\_calls\[0\]

```json
{
    "index": 0,
    "id": "get_weather:0",
    "function": {
        "arguments": "{\"location\": \"巴黎, 法国\"}",
        "name": "get_weather"
    },
    "type": "function"
}
```
