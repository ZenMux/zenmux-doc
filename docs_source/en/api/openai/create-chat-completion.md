---
pageClass: api-page
title: API Reference
head:
  - - meta
    - name: description
      content: Create Chat Completion
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, create, chat, completion, OpenAI, Claude
---

# Create Chat Completion

```
POST https://zenmux.ai/api/v1/chat/completions
```

The Create Chat Completion interface is compatible with OpenAI's [Create Chat Completion](https://platform.openai.com/docs/api-reference/chat/create) interface, designed for conversational large language model inference calls.

Below are all parameters that models may support. Different models support different parameters. Please refer to each model's detail page for specific supported parameters.

## Request body

### messages `array` <font color="red">Required</font>

Prompts input to the large model in the form of a conversation message list. Depending on the model's capabilities, supported message types may vary, including text, images, audio, and video. For specific supported parameters, please check each model provider's documentation.

Each element in messages represents a conversation message, consisting of role and content. For details, refer to OpenAI's definition: [messages](https://platform.openai.com/docs/api-reference/chat/create#chat_create-messages).

### model `string` <font color="red">Required</font>

The model ID for this inference call, formatted as &lt;provider&gt;/&lt;model_name&gt;, such as openai/gpt-5. This can be obtained from each model's detail page.

### stream `boolean` <font color="gray">Optional</font> `Default false`

Specifies whether to use streaming response. Only when explicitly specifying `stream: true` will the response be streamed using the Server-Sent Event protocol. Otherwise, all generated content is returned at once.

### max_completion_tokens `integer` <font color="gray">Optional</font>

Limits the length of model-generated content, including the reasoning process. If not provided, the model's default limit will be used. The maximum generation length for each model can be found on the detail page.

### temperature `float` <font color="gray">Optional</font> `Default 1`

Determines the sampling temperature, typically ranging from 0 to 2, but different models may have different ranges. For example, Claude series models range from 0 to 1. Higher values increase the randomness of generated content.

It is generally not recommended to use together with top_p.

### top_p `float` <font color="gray">Optional</font> `Default 1`

The proportion of samples to truncate. Higher values result in more samples being included, increasing the randomness of generated content.

It is generally not recommended to use together with temperature.

### frequency_penalty `float` <font color="gray">Optional</font> `Default 0`

Ranges from -2.0 to 2.0, used in text generation models to control repetitive vocabulary usage by reducing the generation probability of high-frequency words to enhance text diversity. Higher values result in less repetition.

### presence_penalty `float` <font color="gray">Optional</font> `Default 0`

Parameter for reducing vocabulary repetition by penalizing the generation probability of words that have already appeared, reducing their likelihood of being selected again, thereby enhancing text diversity.

### seed `integer` <font color="gray">Optional</font>

Used to control the large model to generate the same content as much as possible based on the same seed. If not provided, a different random seed will be used each time.

### logit_bias `map` <font color="gray">Optional</font> `Default null`

Can be used to adjust the model's preference for specific categories. By increasing or decreasing bias for certain categories, it can influence the model's output results.

For usage, refer to OpenAI's official documentation: [logit_bias](https://platform.openai.com/docs/api-reference/chat/create#chat_create-logit_bias).

### logprobs `boolean` <font color="gray">Optional</font> `Default false`

Probability distribution information for each token returned during generation, primarily used for analyzing confidence in the model generation process and debugging the model.

### top_logprobs `integer` <font color="gray">Optional</font>

An integer between 0 and 20, specifying the number of most likely tokens to return at each token position, each with an associated log probability. If this parameter is used, logprobs must be true.

### response_format `object` <font color="gray">Optional</font>

Used to control model output of structured content. If not provided, structured output is not used by default. For detailed usage of structured output, see [Structured Output](../advanced/structured-output.md).

### stop `string/array` <font color="gray">Optional</font> `Default null`

Supported by some models only, used to specify stop sequences. Can be a string or an array of strings (to specify multiple). The model's response will not include the stop sequences.

### tools `array` <font color="gray">Optional</font>

List of tools available to the large model. If not provided, tool calling is not used. Currently only supports function-type tools. For detailed usage of tool calling, see [Tool Calls](../advanced/tool-calls.md)

### tool_choice `string/object` <font color="gray">Optional</font>

Used to control how the model chooses to use tools, used in conjunction with the tools parameter. 'none' tells the model not to use any tools, 'auto' allows the model to freely decide whether to use tools and which ones, 'required' means the model must choose to use tools. You can also pass an object to tell the model it must choose to use a specified tool.

If tools is empty, defaults to none. If tools is not empty, defaults to auto.

### parallel_tool_calls `boolean` <font color="gray">Optional</font> `Default true`

Controls whether the model can select multiple tools at once.

### stream_options `object` <font color="gray">Optional</font>

Used to control the content returned in streaming responses, only available when stream: true.

### reasoning `object` <font color="gray">Optional</font>

Used to control reasoning output, supports specifying both effort and max_tokens simultaneously. Different models may have different effective fields. For details, see [Reasoning Models](../guide/advanced/reasoning.md).

## Returns

If stream: true, responds using Server-Sent Event protocol, where each response content is a chat completion chunk. If stream: false, responds with JSON-formatted chat completion.

### Chat completion chunk

Represents a data fragment returned by the large model's streaming response. When stream: true, many chat completion chunks are returned in sequence.

#### id `string`

Represents the generation id for this generation, globally unique. Can be used to query information about this generation, such as usage and cost, through the [Get generation](../platform/get-generation.md) interface.

#### choices `array`

Represents the model's output as a list. The array will contain at most one element. Unlike OpenAI, we do not support multiple simultaneous outputs through n. Additionally, when stream_option.include_usage: true, the choices list of the last chunk will be empty.

choice property definition

##### delta `object`

Represents a content fragment of the model's output.

##### content `string`

Represents the normal output content from the model.

##### reasoning `string`

Represents the reasoning content output by the model.

##### tool_calls `array`

Represents tool calls output by the model.

#### finish_reason `string`

Generation end marker. If non-empty, indicates this is the last content fragment. Values typically include stop, length, content_filter, etc. For specific value ranges, please refer to each model provider's official definition.

#### index `integer`

Which choice this is, related to n. Since we don't support multiple simultaneous outputs through n, there will only be one choice with index value 0.

#### logprobs `object`

Log probability information for the choice.

#### usage `object`

Represents usage information for this generation. If stream_options.include_usage: true, an additional chunk with an empty choices array will be output, containing usage information.

### Chat Completion

Data structure returned by the interface when stream: false, returning all model-generated content at once, including usage information.

#### id `string`

Represents the generation id for this generation, globally unique. Can be used to query information about this generation, such as usage and cost, through the [Get generation](../platform/get-generation.md) interface.

#### choices `array`

Represents the model's output as a list. The array will contain at most one element. Unlike OpenAI, we do not support multiple simultaneous outputs through n.

choice property definition

##### message `object`

Represents a message generated by the model.

##### content `string`

Represents the normal output content from the model.

##### reasoning `string`

Represents the reasoning content output by the model.

##### tool_calls

Represents tool calls output by the model.

#### finish_reason `string`

Reason for ending generation. Values typically include stop, length, content_filter, etc. For specific value ranges, please refer to each model provider's official definition.

#### index `integer`

Which choice this is, related to n. Since we don't support multiple simultaneous outputs through n, there will only be one choice with index value 0.

#### logprobs `object`

Log probability information for the choice.
:::

#### usage `object`

Represents usage information for this generation.

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

```cURL
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
