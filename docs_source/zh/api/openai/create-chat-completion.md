---
pageClass: api-page
title: 接口
---

# Create chat completion

```
POST https://zenmux.ai/api/v1/chat/completions
```

Create chat completions 接口兼容 OpenAI 的 [Create chat completion](https://platform.openai.com/docs/api-reference/chat/create) 接口，用于对话型大语言模型推理调用。


下面列出了所有模型可能支持的参数，不同模型的支持参数有所不同，每个模型具体支持的参数请参见各模型详情页。

## Request body

### messages `array` <font color="red">必选</font>

以对话的消息列表形式输入给大模型的提示词。根据模型的能力不同，支持的消息类型也会有所不同，比如 文本、图片、音频、视频。具体支持的参数，请查看各模型生产商的文档。

messages 里的每个元素表示一条对话消息，每条消息由 role 和 content 组成，详情参见 OpenAI 定义：[messages](https://platform.openai.com/docs/api-reference/chat/create#chat_create-messages)。

### model `string` <font color="red">必选</font>

此次推理调用的模型 ID，格式为 &lt;供应商&gt;/&lt;模型名称&gt;，如 openai/gpt-5，可以从各模型的详情页获得。

### stream `boolean` <font color="gray">可选</font> `默认 false`

指定是否流式响应。只有当显式指定 `stream: true` 时，才会以 Server-Sent Event 协议进行流式响应。否则一次性返回所有生成内容。

### max_completion_tokens `integer` <font color="gray">可选</font> 

限制模型生成内容的长度，包括思考过程。如果不传，会采用模型的默认限制。各模型的最大生成内容长度可以详情页获得。

### temperature `float` <font color="gray">可选</font> `默认 1`

决定样本的 temerature，通常取值范围是 0 到 2，但模型不同，取值范围也会有所不同，比如 Claude 系列的模型取值范围是 0 到 1。值越大，生成内容的随机性就越高。

一般不建议和 top_p 一起使用。

### top_p `float` <font color="gray">可选</font> `默认 1`

截取样本的比例，取值越大，截取样本的数量就越多，生成内容的随机性就越高。

一般不建议和 temperature 一起使用。

### frequency_penalty `float` <font color="gray">可选</font> `默认 0`

取值范围 -2.0 至 2.0，是文本生成模型中用于控制重复词汇使用的参数，通过降低高频词汇的生成概率来提升文本多样性。值越大，重复性就越低。

### presence_penalty `float` <font color="gray">可选</font> `默认 0`

用于减少词汇重复的参数，通过惩罚已出现词汇的生成概率，降低其被再次选中的可能性，从而提升文本多样性。

### seed `integer` <font color="gray">可选</font>

用于控制大模型尽可能根据相同 seed 生成相同的内容。如果不传，每次都会随机使用不同的 seed。

### logit_bias `map` <font color="gray">可选</font> `默认 null`

可以用来调整模型对特定类别的偏好程度，通过增加或减少对某些类别的偏置，可以影响模型的输出结果。

使用方法参见 OpenAI 官方说明：[logit_bias](https://platform.openai.com/docs/api-reference/chat/create#chat_create-logit_bias)。

### logprobs `boolean` <font color="gray">可选</font> `默认 false`

生成过程中返回的每个 token 的概率分布信息，主要用于分析模型生成过程的置信度及调试模型。

### top_logprobs `integer` <font color="gray">可选</font>

一个介于 0 和 20 之间的整数，指定要在每个标记位置返回的最可能标记的数量，每个标记都有一个关联的对数概率。如果使用了此参数，logprobs 必须为 true。

### response_format `object` <font color="gray">可选</font>

用于控制模型输出结构化内容，如果不传默认不使用结构化输出。关于结构化输出详细使用方法参见[结构化输出](../advanced/structured-output.md)。

### stop `string/array` <font color="gray">可选</font> `默认 null`

仅部分模型支持，用于指定终止符，可以是字符串，也可以是字符串数组（指定多个）。模型的返回结果中不会包含终止符。

### tools `array` <font color="gray">可选</font>

大模型可以选择的工具列表，如果不传则不使用工具调用，当前仅支持 function 类型的工具。关于工具调用详细使用方法参见 [工具调用](../advanced/tool-calls.md)

### tool_choice `string/object` <font color="gray">可选</font>

用于控制模型如何选择使用工具，与 tools 参数搭配使用。'none' 表示告诉模型不要使用任何工具，'auto' 表示模型可以自由决定是否使用工具及使用哪几个工具，'required' 表示模型必须选择使用工具。同时也可以传 object 告诉模型必须选择使用指定的模型。

如果 tools 为空，默认为 none，如果 tools 不为空，默认为 auto。

### parallel_tool_calls `boolean` <font color="gray">可选</font> `默认 true`

控制模型是否可以一次选择多个模型。

### stream_options `object` <font color="gray">可选</font>

用于控制流式响应的返回内容，仅当 stream: true 时可用。

### reasoning `object` <font color="gray">可选</font>

用于控制 reasoning 输出，支持同时指定 effort 与 max_tokens，根据模型不同，生效的字段也不同。详情参见 [推理模型](../guide/advanced/reasoning.md)。


## Returns

如果 stream: true，会用 Server-Sent Event 协议响应，响应的每一个内容是 chat completion chunk；如果 stream: false，会响应 JSON 形式表示的 chat completion。

### Chat completion chunk

表示大模型流式响应返回的一个数据分片，当 stream: true 时，会按顺序返回很多个 chat completion chunk。

#### id `string`

表示本次生成的 generation id，全局唯一。可用于通过 [Get generation](../platform/get-generation.md) 接口查询本次生成的信息，如用量和费用等。

#### choices `array`

表示模型的输出，是一个列表，数组中最多只会存在一个元素，与 OpenAI 不同，我们不支持通过 n 来支持同时多个输出。另外，在 stream_option.include_usage: true 时，最后一个 chunk 的 choices 列表将会是空的，里面不会有元素。

choice 属性定义

##### delta `object`

表示模型输出的一个内容片段。

##### content `string`

表示模型正常输出的内容。

##### reasoning `string`

表示模型输出的推理内容。

##### tool_calls `array`

表示模型输出了工具调用。

#### finish_reason `string`

结束生成标记，如果非空表示当前是最后一个内容片段。其取值通常有 stop、length、content_filter 等。具体取值范围请参见各模型厂家官方定义。

#### index `integer`

第几个 choice，与 n 有关，因为我们不支持通过 n 来同时获得多个输出，所以只会有一个 choice，并且 index 值为 0。

#### logprobs `object`

Log probability information for the choice.

#### usage `object`

表示此次生成的用量信息。如果 stream_options.include_usage: true，则会额外输出一个 choices 为空数组的 chunk，这个 chunk 上会包含用量信息。

### Chat Completion

stream: false 时，接口返回的数据结构，会一次性返回所有模型生成的内容，包含用量等信息。

#### id `string`

表示本次生成的 generation id，全局唯一。可用于通过 [Get generation](../platform/get-generation.md) 接口查询本次生成的信息，如用量和费用等。

#### choices `array`

表示模型的输出，是一个列表，数组中最多只会存在一个元素，与 OpenAI 不同，我们不支持通过 n 来支持同时多个输出。

choice 属性定义

##### message `object`

表示模型生成的一条消息。

##### content `string`

表示模型正常输出的内容。

##### reasoning `string`

表示模型输出的推理内容。

##### tool_calls

表示模型输出了工具调用。

#### finish_reason `string`

结束生成的原因，其取值通常有 stop、length、content_filter 等。具体取值范围请参见各模型厂家官方定义。

#### index `integer`

第几个 choice，与 n 有关，因为我们不支持通过 n 来同时获得多个输出，所以只会有一个 choice，并且 index 值为 0。

#### logprobs `object`

Log probability information for the choice.
:::

#### usage `object`

表示此次生成的用量信息。



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