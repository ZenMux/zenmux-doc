---
pageClass: api-page
title: API
---

# Create chat completion

```
POST https://zenmux.ai/api/v1/chat/completions
```

The Create chat completions endpoint is compatible with OpenAI’s [Create chat completion](https://platform.openai.com/docs/api-reference/chat/create) endpoint and is used to invoke conversational large language models for inference.

Below are all parameters that models may support. Supported parameters vary by model. Refer to each model’s detail page for the exact set of supported parameters.

## Request body

### messages `array` <font color="red">Required</font>

Provide the prompt to the model as a list of chat messages. Supported message modalities vary by model capability, e.g., text, image, audio, or video. For specifics, consult the documentation from each model vendor.

Each element in messages represents a single chat message with a role and content. For details, see OpenAI’s definition: [messages](https://platform.openai.com/docs/api-reference/chat/create#chat_create-messages).

### model `string` <font color="red">Required</font>

The model ID for this inference call, in the format <vendor>/<model_name>, such as openai/gpt-5. You can find model IDs on each model’s detail page.

### stream `boolean` <font color="gray">Optional</font> `Default false`

Whether to use streaming responses. Streaming via Server-Sent Events is used only when you explicitly set `stream: true`. Otherwise, the full output is returned in a single response.

### max_completion_tokens `integer` <font color="gray">Optional</font> 

Limits the length of the model’s generated content, including reasoning. If omitted, the model’s default limit is used. See each model’s detail page for maximum generation length.

### temperature `float` <font color="gray">Optional</font> `Default 1`

Controls sampling temperature. The typical range is 0 to 2, but the valid range may vary by model (e.g., the Claude family uses 0 to 1). Higher values increase randomness.

Generally, do not use together with top_p.

### top_p `float` <font color="gray">Optional</font> `Default 1`

Controls nucleus sampling by restricting to a proportion of the probability mass. Higher values include more tokens and increase randomness.

Generally, do not use together with temperature.

### frequency_penalty `float` <font color="gray">Optional</font> `Default 0`

Range: -2.0 to 2.0. Penalizes frequent tokens to reduce repetition and improve output diversity. Higher values reduce repetition.

### presence_penalty `float` <font color="gray">Optional</font> `Default 0`

Penalizes tokens that have already appeared to reduce repetition and improve output diversity.

### seed `integer` <font color="gray">Optional</font>

Encourages the model to produce the same output for the same seed where possible. If omitted, a random seed is used for each request.

### logit_bias `map` <font color="gray">Optional</font> `Default null`

Adjusts the model’s preference for specific tokens by increasing or decreasing their bias, which can influence the output.

See OpenAI’s docs for usage: [logit_bias](https://platform.openai.com/docs/api-reference/chat/create#chat_create-logit_bias).

### logprobs `boolean` <font color="gray">Optional</font> `Default false`

Returns the probability distribution for each generated token, primarily for analyzing model confidence and debugging.

### top_logprobs `integer` <font color="gray">Optional</font>

An integer between 0 and 20 specifying how many of the most likely tokens to return at each token position, each with an associated log probability. Requires logprobs to be true.

### response_format `object` <font color="gray">Optional</font>

Controls structured output. If omitted, structured output is not used. For details, see [Structured Output](../advanced/structured-output.md).

### stop `string/array` <font color="gray">Optional</font> `Default null`

Supported by some models only. Specifies stop sequences, either a single string or an array of strings (multiple stop sequences). The stop sequence(s) will not be included in the output.

### tools `array` <font color="gray">Optional</font>

A list of tools the model may call. If omitted, tool calling is disabled. Currently only function-type tools are supported. For details, see [Tool Calls](../advanced/tool-calls.md)

### tool_choice `string/object` <font color="gray">Optional</font>

Controls how the model chooses to use tools and must be used together with tools. 'none' tells the model not to use any tools; 'auto' lets the model decide whether and which tools to use; 'required' forces the model to use a tool. You can also pass an object to force the model to use a specific tool.

If tools is empty, the default is none. If tools is not empty, the default is auto.

### parallel_tool_calls `boolean` <font color="gray">Optional</font> `Default true`

Controls whether the model may select multiple tools at once.

### stream_options `object` <font color="gray">Optional</font>

Controls what is included in streaming responses. Only applicable when stream: true.

### reasoning `object` <font color="gray">Optional</font>

Controls reasoning output. Supports specifying both effort and max_tokens. Effective fields vary by model. See [Reasoning Models](../guide/advanced/reasoning.md).


## Returns

If stream: true, responses use Server-Sent Events and each event is a chat completion chunk. If stream: false, the response is a JSON chat completion.

### Chat completion chunk

Represents one segment in a streamed response. When stream: true, multiple chat completion chunks are returned sequentially.

#### id `string`

The generation id for this request, globally unique. You can query details such as usage and cost via the [Get generation](../platform/get-generation.md) endpoint.

#### choices `array`

The model’s outputs as a list. At most one element will be present. Unlike OpenAI, we do not support multiple outputs via n. Additionally, when stream_options.include_usage: true, the last chunk’s choices list will be empty and contain no elements.

Choice properties

##### delta `object`

A fragment of the model’s output.

##### content `string`

Regular output content from the model.

##### reasoning `string`

Reasoning content output by the model.

##### tool_calls `array`

Indicates the model produced tool calls.

#### finish_reason `string`

Indicates the reason generation finished. If non-empty, the current chunk is the last one. Typical values include stop, length, content_filter, etc. Refer to each vendor’s official definitions for exact values.

#### index `integer`

Which choice this is. Since we do not support multiple outputs via n, there is only one choice and index is 0.

#### logprobs `object`

Log probability information for the choice.

#### usage `object`

Usage information for this generation. If stream_options.include_usage: true, an additional chunk is sent where choices is an empty array and usage is included on that chunk.

### Chat Completion

When stream: false, this is the response structure. All generated content is returned at once, including usage information.

#### id `string`

The generation id for this request, globally unique. You can query details such as usage and cost via the [Get generation](../platform/get-generation.md) endpoint.

#### choices `array`

The model’s outputs as a list. At most one element will be present. Unlike OpenAI, we do not support multiple outputs via n.

Choice properties

##### message `object`

A single message generated by the model.

##### content `string`

Regular output content from the model.

##### reasoning `string`

Reasoning content output by the model.

##### tool_calls

Indicates the model produced tool calls.

#### finish_reason `string`

Reason generation finished. Typical values include stop, length, content_filter, etc. Refer to each vendor’s official definitions for exact values.

#### index `integer`

Which choice this is. Since we do not support multiple outputs via n, there is only one choice and index is 0.

#### logprobs `object`

Log probability information for the choice.
:::

#### usage `object`

Usage information for this generation.



::: api-request POST /api/v1/chat/completions

```TypeScript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://zenmux.ai/api/v1',
  apiKey: '<ZENMUX_API_KEY>',
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "openai/gpt-5", 
    messages: [
      {
        role: "user",
        content: "What is the meaning of life?", 
      },
    ],
  });

  console.log(completion.choices[0].message);
}

main();
```

```Python
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<your_ZENMUX_API_KEY>", 
)

completion = client.chat.completions.create(
    model="openai/gpt-5", 
    messages=[
        {
            "role": "user",
            "content": "What is the meaning of life?"
        }
    ]
)

print(completion.choices[0].message.content)
```

```Shell
curl https://zenmux.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "openai/gpt-5",
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ]
  }'
```

:::