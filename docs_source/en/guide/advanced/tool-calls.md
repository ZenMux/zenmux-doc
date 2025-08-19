---
title: Tool Calling
subtitle: Using Tools in Your Prompt
---

# Tool Calling

Tool calls (also known as function calls) enable large language models (LLMs) to access external tools. LLMs do not directly invoke tools; instead, they suggest calling a tool. The user then executes the tool separately and feeds the result back to the LLM. Finally, the LLM organizes the result into an answer to the user's original question.

ZenMux unifies the tool call interfaces across models and providers, making it easy to integrate external tools into any supported model.

**Supported Models**: You can filter for models that support tool calls at [zenmux.ai/models?supported_parameters=tools](https://zenmux.ai/models?supported_parameters=tools).

If you want to learn through a complete end-to-end example, please read on.

## Request Body Example

Using ZenMux for tool calls involves three key steps. Here is the request format for each step:

### Step 1: Inference Request with Tools

```json
{
  "model": "google/gemini-2.0-flash-001",
  "messages": [
    {
      "role": "user",
      "content": "What are the titles of books by James Joyce?"
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "search_gutenberg_books",
        "description": "Search for books in the Gutenberg library",
        "parameters": {
          "type": "object",
          "properties": {
            "search_terms": {
              "type": "array",
              "items": {"type": "string"},
              "description": "List of search terms for finding books"
            }
          },
          "required": ["search_terms"]
        }
      }
    }
  ]
}
```

### Step 2: Tool Execution (Client Side)

After receiving a model response with `tool_calls`, execute the requested tool locally and prepare the result:

```javascript
// The model returns tool_calls; you execute the tool locally
const toolResult = await searchGutenbergBooks(["James", "Joyce"]);
```

### Step 3: Inference Request with Tool Results

```json
{
  "model": "google/gemini-2.0-flash-001",
  "messages": [
    {
      "role": "user",
      "content": "What are the titles of books by James Joyce?"
    },
    {
      "role": "assistant",
      "content": null,
      "tool_calls": [
        {
          "id": "call_abc123",
          "type": "function",
          "function": {
            "name": "search_gutenberg_books",
            "arguments": "{\"search_terms\": [\"James\", \"Joyce\"]}"
          }
        }
      ]
    },
    {
      "role": "tool",
      "tool_call_id": "call_abc123",
      "content": "[{\"id\": 4300, \"title\": \"Ulysses\", \"authors\": [{\"name\": \"Joyce, James\"}]}]"
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "search_gutenberg_books",
        "description": "Search for books in the Gutenberg library",
        "parameters": {
          "type": "object",
          "properties": {
            "search_terms": {
              "type": "array",
              "items": {"type": "string"},
              "description": "List of search terms for finding books"
            }
          },
          "required": ["search_terms"]
        }
      }
    }
  ]
}
```

**Note**: Each request (steps 1 and 3) must include the `tools` parameter so the router can validate the tool schema on every call.

### Tool Call Example

Below is a Python code example showing how to let an LLM call an external API (such as the Gutenberg Project) to search for books.

First, set up the basics:

::: code-group

```python
import json, requests
from openai import OpenAI

ZENMUX_API_KEY = f"<ZENMUX_API_KEY>"

# You can use any model that supports tool calls
MODEL = "google/gemini-2.0-flash-001"

openai_client = OpenAI(
  base_url="https://zenmux.ai/api/v1",
  api_key=ZENMUX_API_KEY,
)

task = "What are the titles of books by James Joyce?"

messages = [
  {
    "role": "system",
    "content": "You are a helpful assistant."
  },
  {
    "role": "user",
    "content": task,
  }
]

```

```typescript
const response = await fetch('https://zenmux.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer <ZENMUX_API_KEY>`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'google/gemini-2.0-flash-001',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      {
        role: 'user',
        content: 'What are the titles of books by James Joyce?',
      },
    ],
  }),
});
```

:::

### Define the Tool

Next, define the tool you want to call. Note that a tool is just a regular function. You also need to write a JSON schema compatible with OpenAI's function call parameters. Pass this schema to the LLM so it knows what tools are available and how to use them. The model will request the tool with parameters when needed. You handle the tool call locally, execute the function, and return the result to the LLM.

::: code-group

```python
def search_gutenberg_books(search_terms):
    search_query = " ".join(search_terms)
    url = "https://gutendex.com/books"
    response = requests.get(url, params={"search": search_query})

    simplified_results = []
    for book in response.json().get("results", []):
        simplified_results.append({
            "id": book.get("id"),
            "title": book.get("title"),
            "authors": book.get("authors")
        })

    return simplified_results

tools = [
  {
    "type": "function",
    "function": {
      "name": "search_gutenberg_books",
      "description": "Search for books in the Gutenberg library using specified search terms",
      "parameters": {
        "type": "object",
        "properties": {
          "search_terms": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "List of search terms for finding books in the Gutenberg library (e.g., ['dickens', 'great'] to find Dickens books with 'great' in the title)"
          }
        },
        "required": ["search_terms"]
      }
    }
  }
]

TOOL_MAPPING = {
    "search_gutenberg_books": search_gutenberg_books
}

```

```typescript
async function searchGutenbergBooks(searchTerms: string[]): Promise<Book[]> {
  const searchQuery = searchTerms.join(' ');
  const url = 'https://gutendex.com/books';
  const response = await fetch(`${url}?search=${searchQuery}`);
  const data = await response.json();

  return data.results.map((book: any) => ({
    id: book.id,
    title: book.title,
    authors: book.authors,
  }));
}

const tools = [
  {
    type: 'function',
    function: {
      name: 'searchGutenbergBooks',
      description:
        'Search for books in the Gutenberg library using specified search terms',
      parameters: {
        type: 'object',
        properties: {
          search_terms: {
            type: 'array',
            items: {
              type: 'string',
            },
            description:
              "List of search terms for finding books in the Gutenberg library (e.g., ['dickens', 'great'] to find Dickens books with 'great' in the title)",
          },
        },
        required: ['search_terms'],
      },
    },
  },
];

const TOOL_MAPPING = {
  searchGutenbergBooks,
};
```

:::

### Using the Tool and Tool Results

Let's make the first ZenMux API call:

::: code-group

```python
request_1 = {
    "model": google/gemini-2.0-flash-001,
    "tools": tools,
    "messages": messages
}

response_1 = openai_client.chat.completions.create(**request_1).message
```

```typescript
const request_1 = await fetch('https://zenmux.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer <ZENMUX_API_KEY>`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'google/gemini-2.0-flash-001',
    tools,
    messages,
  }),
});

const data = await request_1.json();
const response_1 = data.choices[0].message;
```

:::

The model will return `finish_reason` as `tool_calls` and include a `tool_calls` array. In a general LLM response handler, you should check `finish_reason`, but here we assume it's a tool call. Continue processing the tool call:

::: code-group

```python
# Append the response to the messages array to ensure LLM has full context
messages.append(response_1)

# Handle the requested tool call using our book search tool
for tool_call in response_1.tool_calls:
    '''
    Only one tool is provided here, so we know which function to call.
    If there are multiple tools, check `tool_call.function.name` to determine which function to call locally.
    '''
    tool_name = tool_call.function.name
    tool_args = json.loads(tool_call.function.arguments)
    tool_response = TOOL_MAPPING[tool_name](**tool_args)
    messages.append({
      "role": "tool",
      "tool_call_id": tool_call.id,
      "content": json.dumps(tool_response),
    })
```

```typescript
// Append the response to the messages array to ensure LLM has full context
messages.push(response_1);

// Handle the requested tool call using our book search tool
for (const toolCall of response_1.tool_calls) {
  const toolName = toolCall.function.name;
  const { search_params } = JSON.parse(toolCall.function.arguments);
  const toolResponse = await TOOL_MAPPING[toolName](search_params);
  messages.push({
    role: 'tool',
    toolCallId: toolCall.id,
    name: toolName,
    content: JSON.stringify(toolResponse),
  });
}
```

:::

Now the messages array contains:

1. The original request
2. The LLM's response (with tool call request)
3. The result of the tool call (JSON object returned from the Gutenberg API)

You can now make a second ZenMux API call to get the final result!

::: code-group

```python
request_2 = {
  "model": MODEL,
  "messages": messages,
  "tools": tools
}

response_2 = openai_client.chat.completions.create(**request_2)

print(response_2.choices[0].message.content)
```

```typescript
const response = await fetch('https://zenmux.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer <ZENMUX_API_KEY>`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'google/gemini-2.0-flash-001',
    messages,
    tools,
  }),
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

:::

Output example:

```text
Here are some books by James Joyce:

*   *Ulysses*
*   *Dubliners*
*   *A Portrait of the Artist as a Young Man*
*   *Chamber Music*
*   *Exiles: A Play in Three Acts*
```

Done! We've successfully used a tool in the prompt.

## Interleaved Thinking

Interleaved thinking allows the model to reason between tool calls, enabling more complex decision-making after receiving tool results. This feature helps the model chain reasoning across multiple tool calls and make more nuanced judgments based on intermediate results.

**Important Note**: Interleaved thinking increases token usage and response latency. Consider your budget and performance needs when enabling it.

### How Interleaved Thinking Works

With interleaved thinking enabled, the model can:

- Reason based on tool call results before deciding the next step
- Insert reasoning steps between multiple tool calls
- Make more nuanced decisions based on intermediate results
- Transparently show reasoning during tool selection

### Example: Multi-step Research and Reasoning

Here's an example of how a model uses interleaved thinking to research a topic across multiple sources:

**Initial Request:**
```json
{
  "model": "anthropic/claude-3.5-sonnet",
  "messages": [
    {
      "role": "user",
      "content": "Research the environmental impact of electric vehicles and provide a comprehensive analysis."
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "search_academic_papers",
        "description": "Search for academic papers on a topic",
        "parameters": {
          "type": "object",
          "properties": {
            "query": {"type": "string"},
            "field": {"type": "string"}
          },
          "required": ["query"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_latest_statistics",
        "description": "Get the latest statistics on a topic",
        "parameters": {
          "type": "object",
          "properties": {
            "topic": {"type": "string"},
            "year": {"type": "integer"}
          },
          "required": ["topic"]
        }
      }
    }
  ]
}
```

**Model Reasoning and Tool Call Flow:**

1. **Initial Reasoning**: "I need to research the environmental impact of electric vehicles. First, I'll look for academic papers for peer-reviewed studies."
2. **First Tool Call**: `search_academic_papers({"query": "electric vehicle lifecycle environmental impact", "field": "environmental science"})`
3. **Reasoning After First Tool Result**: "The papers show varying impacts during manufacturing. I need the latest statistics to supplement the academic research."
4. **Second Tool Call**: `get_latest_statistics({"topic": "electric vehicle carbon footprint", "year": 2024})`
5. **Reasoning After Second Tool Result**: "Now I have academic research and recent data. I'll look for manufacturing-related studies to fill in gaps."
6. **Third Tool Call**: `search_academic_papers({"query": "electric vehicle battery manufacturing environmental cost", "field": "materials science"})`
7. **Final Analysis**: Integrate all information and provide a comprehensive answer.

### Interleaved Thinking Best Practices

- **Clear Tool Descriptions**: Describe tool usage in detail to help the model decide when to use them
- **Structured Parameters**: Use clear parameter schemas for precise tool calls
- **Context Preservation**: Maintain conversation context during multiple tool interactions
- **Error Handling**: Tools should return meaningful error messages to help the model adjust its strategy

### Implementation Notes

- Response time increases due to added reasoning steps
- Token usage increases
- Reasoning quality depends on model capability
- Some models are better suited for interleaved thinking

## Simple Agentic Loop

In the above example, calls are explicit and sequential. To handle diverse user inputs and tool calls, you can use an agentic loop.

Here's a simple agentic loop example (tools and initial messages are the same as above):

::: code-group

```python

def call_llm(msgs):
    resp = openai_client.chat.completions.create(
        model=google/gemini-2.0-flash-001,
        tools=tools,
        messages=msgs
    )
    msgs.append(resp.choices[0].message.dict())
    return resp

def get_tool_response(response):
    tool_call = response.choices[0].message.tool_calls[0]
    tool_name = tool_call.function.name
    tool_args = json.loads(tool_call.function.arguments)

    # Find the correct tool locally and call it with parameters
    # Easily extend to support more tools without changing the loop
    tool_result = TOOL_MAPPING[tool_name](**tool_args)

    return {
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": tool_result,
    }

max_iterations = 10
iteration_count = 0

while iteration_count < max_iterations:
    iteration_count += 1
    resp = call_llm(_messages)

    if resp.choices[0].message.tool_calls is not None:
        messages.append(get_tool_response(resp))
    else:
        break

if iteration_count >= max_iterations:
    print("Warning: Maximum loop count reached")

print(messages[-1]['content'])

```

```typescript
async function callLLM(messages: Message[]): Promise<Message> {
  const response = await fetch(
    'https://zenmux.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer <ZENMUX_API_KEY>`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        tools,
        messages,
      }),
    },
  );

  const data = await response.json();
  messages.push(data.choices[0].message);
  return data;
}

async function getToolResponse(response: Message): Promise<Message> {
  const toolCall = response.toolCalls[0];
  const toolName = toolCall.function.name;
  const toolArgs = JSON.parse(toolCall.function.arguments);

  // Find the correct tool locally and call it with parameters
  // Easily extend to support more tools without changing the loop
  const toolResult = await TOOL_MAPPING[toolName](toolArgs);

  return {
    role: 'tool',
    toolCallId: toolCall.id,
    content: toolResult,
  };
}

const maxIterations = 10;
let iterationCount = 0;

while (iterationCount < maxIterations) {
  iterationCount++;
  const response = await callLLM(messages);

  if (response.toolCalls) {
    messages.push(await getToolResponse(response));
  } else {
    break;
  }
}

if (iterationCount >= maxIterations) {
  console.warn("Warning: Maximum loop count reached");
}

console.log(messages[messages.length - 1].content);
```

:::

## Best Practices & Advanced Patterns

### Function Definition Guidelines

When defining LLM tools, follow these best practices:

**Clear, Specific Names**:

```json
// Recommended: clear and specific
{ "name": "get_weather_forecast" }
```

```json
// Avoid: too vague
{ "name": "weather" }
```

**Detailed Descriptions**: Provide detailed descriptions to help the model understand when and how to use the tool.

```json
{
  "description": "Get current weather and 5-day forecast for a specified location. Supports city, postal code, and coordinates.",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name, postal code, or coordinates (lat,lng). E.g., 'New York', '10001', '40.7128,-74.0060'"
      },
      "units": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "Temperature unit",
        "default": "celsius"
      }
    },
    "required": ["location"]
  }
}
```

### Tool Call Streaming Response

When using streaming responses, handle different content types correctly:

```typescript
const stream = await fetch('/api/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    messages: messages,
    tools: tools,
    stream: true
  })
});

const reader = stream.body.getReader();
let toolCalls = [];

while (true) {
  const { done, value } = await reader.read();
  if (done) {
    break;
  }

  const chunk = new TextDecoder().decode(value);
  const lines = chunk.split('\n').filter(line => line.trim());

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));

      if (data.choices[0].delta.tool_calls) {
        toolCalls.push(...data.choices[0].delta.tool_calls);
      }

      if (data.choices[0].delta.finish_reason === 'tool_calls') {
        await handleToolCalls(toolCalls);
      } else if (data.choices[0].delta.finish_reason === 'stop') {
        // Normal completion, no tool calls
        break;
      }
    }
  }
}
```

### Tool Selection Configuration

Control tool usage with the `tool_choice` parameter:

```json
// Let the model decide automatically (default)
{ "tool_choice": "auto" }
```

```json
// Disable tool calls
{ "tool_choice": "none" }
```

```json
// Force a specific tool
{
  "tool_choice": {
    "type": "function",
    "function": {"name": "search_database"}
  }
}
```

### Parallel Tool Calls

Control whether multiple tools can be called simultaneously with the `parallel_tool_calls` parameter (most models allow this by default):

```json
// Disable parallel tool calls; tools will be called sequentially
{ "parallel_tool_calls": false }
```

When `parallel_tool_calls` is `false`, the model will request only one tool call at a time, rather than potentially multiple parallel calls.

### Multi-tool Workflows

Design tools that work together:

```json
{
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "search_products",
        "description": "Search for products in the product catalog"
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_product_details",
        "description": "Get detailed information about a specified product"
      }
    },
    {
      "type": "function",
      "function": {
        "name": "check_inventory",
        "description": "Check current inventory for a product"
      }
    }
  ]
}
```

This allows the model to naturally chain operations: search → get details → check inventory.

For more on ZenMux message formats and tool parameters, see the [API Reference](https://docs.zenmux.ai/api-reference/overview).
