---
pageClass: api-page
title: 接口
head:
  - - meta
    - name: description
      content: Create Chat Completion
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, create, chat, completion, new, OpenAI, Anthropic
---

# Create Chat Completion

```
POST https://zenmux.ai/api/v1/chat/completions
```

Create Chat Completion 接口兼容 OpenAI 的 [Create Chat Completion](https://platform.openai.com/docs/api-reference/chat/create) 接口，用于对话型大语言模型推理调用。

下面列出了所有模型可能支持的参数，不同模型的支持参数有所不同，每个模型具体支持的参数请参见各模型详情页。

## Request headers

### Authorization `string` <font color="red">必填</font>

Bearer Token 鉴权

### Content-Type `string` <font color="red">必填</font>

请求内容类型，默认值为 `application/json`

## Request

### messages `array` <font color="red">必选</font>

以对话的消息列表形式输入给大模型的提示词。根据模型的能力不同，支持的消息类型也会有所不同，比如 文本、图片、音频、视频。具体支持的参数，请查看各模型生产商的文档。

messages 里的每个元素表示一条对话消息，每条消息由 role 和 content 组成，详情如下：

::: details Developer message `object`
开发者提供的指令，无论用户发送什么消息，模型都应遵循。在 o1 及更新模型中，developer 消息取代了之前的 system 消息。

- content `string or array ` <font color="red">必选</font>

  Developer message 的内容。
  - Text content `string`

    Developer message 的内容。

  - Array of content parts `array`

    具有定义类型的内容部分数组。对于 Developer message，只支持类型 `text`。
    - text `string` <font color="red">必选</font>

      文本内容。

    - type `string` <font color="red">必选</font>

      内容部分的类型。

- role `string` <font color="red">必选</font>

  消息作者的角色，在此情况下为 developer。

- name `string` <font color="gray">可选</font>

  参与者<font color="gray">可选</font>名称。为模型提供区分相同角色参与者的信息。
  :::

::: details System message `object`
开发者提供的指令，无论用户发送什么消息，模型都应遵循。在 o1 及更新模型中，应使用 developer 消息来实现此目的。

- content `string or array ` <font color="red">必选</font>

  System message 的内容。
  - Text content `string`

    System message 的内容。

  - Array of content parts `array`

    具有定义类型的内容部分数组。对于 System message，只支持类型 `text`。
    - text `string` <font color="red">必选</font>

      文本内容。

    - type `string` <font color="red">必选</font>

      内容部分的类型。

- role `string` <font color="red">必选</font>

  消息作者的角色，在此情况下为 system

- name `string` <font color="gray">可选</font>

  参与者<font color="gray">可选</font>名称。为模型提供区分相同角色参与者的信息。
  :::

::: details User message `object`  
终端用户发送给模型的消息，大多数对话场景中你只需要使用此角色。

- content `string or array` <font color="red">必选</font>

  User message 的内容。
  - Text content `string` <font color="red">必选</font>

    纯文本内容，最常见的用法。

  - Array of content parts `array` <font color="red">必选</font>

    多模态内容片段数组。根据模型能力，可以包含文本、图片、音频等类型的内容。常见类型包括：
    - 文本片段
      - type `string` <font color="red">必选</font>，固定为 `text`
      - text `string` <font color="red">必选</font>，文本内容

    - 图片片段（仅多模态模型支持）
      - type `string` <font color="red">必选</font>，为 `image_url`
      - image_url `object` <font color="red">必选</font>
        - url `string` <font color="red">必选</font>，图片 URL 或 base64 Data URL
        - detail `string` <font color="gray">可选</font>，典型取值：`low` / `high` / `auto`，用于控制图像解析精度

    - 音频片段（仅音频输入模型支持）
      - type `string` <font color="red">必选</font>，为 `input_audio`
      - input_audio `object` <font color="red">必选</font>
        - data `string` <font color="red">必选</font>，音频文件 base64 内容
        - format `string` <font color="red">必选</font>，如 `wav`、`mp3`

    - 文件片段（File content part，仅支持文件输入的模型）  
      用于将整份文件作为上下文输入给模型（例如 PDF、Office 文档等）。
      - type `string` <font color="red">必选</font>，固定为 `file`
      - file `object` <font color="red">必选</font>
        - file_id `string` <font color="gray">可选</font>
          - 通过文件上传接口获取的文件 ID，推荐优先使用此方式引用文件
        - file_data `string` <font color="gray">可选</font>
          - base64 编码的文件数据，用于直接在请求体中传文件内容
        - filename `string` <font color="gray">可选</font>
          - 文件名，用于提示模型文件类型或在控制台中展示

- role `string` <font color="red">必选</font>

  消息作者角色，在此情况下为 `user`。

- name `string` <font color="gray">可选</font>

  参与者<font color="gray">可选</font>名称。为模型提供区分相同角色参与者的信息。  
  :::

::: details Assistant message `object`  
模型在对话中发送给用户的回复消息。你可以在新的请求中把这些历史助手消息一并传回，以便模型继续基于完整上下文进行推理。

- content `string or array` 可选

  Assistant message 的内容。**当未设置 `tool_calls` 或（已废弃的）`function_call` 时为必填。**
  - Text content `string`

    助手消息的纯文本内容。

  - Array of content parts `array`

    具有定义类型的内容部分数组。可以包含一个或多个类型为 `text` 的内容部分，或者**恰好一个**类型为 `refusal` 的内容部分。
    - Text content part `object`（文本内容片段）
      - type `string` <font color="red">必选</font>  
        内容片段的类型。

      - text `string` <font color="red">必选</font>  
        文本内容。

    - Refusal content part `object`（拒答内容片段）
      - type `string` <font color="red">必选</font>  
        内容片段的类型。

      - refusal `string` <font color="red">必选</font>  
        模型生成的拒答信息。

- refusal `string or null` 可选

  助手的拒答消息内容。

- role `string` <font color="red">必选</font>

  消息作者角色，在此情况下为 `assistant`。

- name `string` 可选

  参与者可选名称。为模型提供区分相同角色参与者的信息。

- audio `object or null` 可选

  关于**之前某次模型音频回复**的数据，可在后续对话中引用该音频回复。
  - id `string` <font color="red">必选</font>

    之前音频回复的唯一标识符。

- tool_calls `array` 可选
  - 函数工具调用 `object`
    - id `string` <font color="red">必选</font>

      工具调用 ID，用于与后续的 Tool message 中的 `tool_call_id` 对应。

    - type `string` <font color="red">必选</font>

      工具类型，目前仅支持 `function`。

    - function `object` <font color="red">必选</font>
      - name `string` <font color="red">必选</font>

        要调用的函数名。

      - arguments `string` <font color="red">必选</font>

        以 JSON 字符串形式表示的函数调用参数（由模型生成）。  
        注意：模型不保证一定生成完全合法的 JSON，可能会出现未在函数 Schema 中定义的参数，调用前应在业务侧进行校验。

    - 自定义工具调用 `object`
      - id `string` <font color="red">必选</font>

        工具调用 ID，用于与后续的 Tool message 中的 `tool_call_id` 对应。

      - type `string` <font color="red">必选</font>

        工具类型，始终为 `custom`。

      - custom `object` <font color="red">必选</font>
        - name `string` <font color="red">必选</font>

          要调用的函数名。

        - input `string` <font color="red">必选</font>

          由模型生成的自定义工具调用的输入。

- function_call `object or null`（已废弃） 可选

  已被 `tool_calls` 替代，仅为兼容旧版格式保留。表示模型建议调用的函数名称和参数。
  - name `string` <font color="red">必选</font>  
    要调用的函数名。

  - arguments `string` <font color="red">必选</font>  
     以 JSON 字符串形式表示的函数调用参数（由模型生成），同样需要在业务侧校验后再实际

:::

::: details Tool message `object`  
用于把外部工具（函数）调用的执行结果传回给模型的消息。

- content `string or array` <font color="red">必选</font>

  工具执行结果的内容，一般为文本或结构化数据（序列化为字符串）。
  - Text content `string`

    Tool message 的内容。

  - Array of content parts `array`

    具有定义类型的内容部分数组。对于 Tool message，只支持类型 `text`。
    - text `string` <font color="red">必选</font>

      文本内容。

    - type `string` <font color="red">必选</font>

      内容部分的类型。

- role `string` <font color="red">必选</font>

  消息作者角色，在此情况下为 `tool`。

- tool_call_id `string` <font color="red">必选</font>

  对应 assistant 消息中某个 `tool_calls[i].id`，用于将本次工具结果与那次调用对应起来。

- name `string` <font color="gray">可选</font>

  工具名称（通常与声明在 `tools` 中的 function 名称一致）。  
  :::

::: info Function message `object` <font color="red">官方已弃用不支持</font>
:::

### model `string` <font color="red">必选</font>

此次推理调用的模型 ID，格式为 &lt;供应商&gt;/&lt;模型名称&gt;，如 openai/gpt-5，可以从各模型的详情页获得。

### max_completion_tokens `integer or null` <font color="gray">可选</font>

限制模型生成内容的长度，包括思考过程。如果不传，会采用模型的默认限制。各模型的最大生成内容长度可以详情页获得。

### temperature `number` <font color="gray">可选</font>

- 默认：`1`
- zenmux 没有限制范围，建议在 `[0, 2]` 范围内取值。

采样温度，控制随机性：值越高越随机，值越低越稳定。一般与 `top_p` 二选一调节。

### top_p `number` <font color="gray">可选</font>

- 默认：`1`

Nucleus sampling（核采样）参数：只从累积概率质量前 `top_p` 的 token 中采样，如 `top_p = 0.1` 表示只考虑概率质量前 10% 的 token。

### n `integer or null` <font color="gray">可选</font>

返回候选回答数量，目前仅支持 n=1

### frequency_penalty `number or null` <font color="gray">可选</font>

- 默认值：`0`
- 取值范围：`-2.0` ~ `2.0`

对已出现频率较高的 token 施加惩罚。值越大，模型越不愿重复相同内容，可用于减少机械复读。

### presence_penalty `number or null` <font color="gray">可选</font>

- 默认：`0`
- 取值范围：`-2.0` ~ `2.0`

对**是否已出现过**的 token 施加惩罚。值越大，模型越倾向于引入新话题、减少重复讨论相同内容。

### stop `string | array | null` <font color="gray">可选</font>

- 默认：`null`
- 最多可提供 4 个 stop 序列

当生成内容命中任一 stop 序列时，模型会停止继续生成，返回结果中不包含该 stop 序列。最新部分推理模型（如 `o3`、`o4-mini`）不支持该参数。

### logit_bias `object` <font color="gray">可选</font>

- 默认：`null`

用于对指定 token 的采样概率进行微调。键为 tokenizer 中的 token ID（整数），值为 `-100` ~ `100` 之间的偏置

- 正值：提升该 token 被选中的概率
- 负值：降低该 token 被选中的概率
- 极值（如 ±100）：接近于强制禁止或强制选用该 token

### logprobs `boolean or null` <font color="gray">可选</font>

- 默认：`false`

是否在返回结果中包含输出 token 的对数概率信息。

### top_logprobs `integer` <font color="gray">可选</font>

指定每个位置返回的**最高概率 token 个数**（0~20），每个 token 带对应的 logprob。

### tools `array` <font color="gray">可选</font>

用于声明本次对话中模型可以调用的工具列表。每个元素可以是自定义工具或 function 工具（JSON Schema 定义的函数）。

### tool_choice `string or object` <font color="gray">可选</font>

控制模型对工具的使用策略：([platform.openai.com](https://platform.openai.com/docs/api-reference/chat))

- `"none"`：不调用任何工具
- `"auto"`：由模型自行决定是否以及调用哪些工具
- `"required"`：本轮必须调用至少一个工具
- 指定单个工具：`{"type": "function", "function": {"name": "my_function"}}`

### parallel_tool_calls `boolean` <font color="gray">可选</font>

- 默认：`true`

是否允许模型在一次回复中**并行**调用多个工具（函数）。

### reasoning_effort `string` <font color="gray">可选</font>（推理模型）

控制**推理模型**在思考上的投入程度：`none`、`minimal`、`low`、`medium`、`high`、`xhigh` 等。不同模型的默认值与支持范围有所不同。

### verbosity `string` <font color="gray">可选</font>

- 默认：`"medium"`

约束模型输出的详略程度：`low`（简洁）、`medium`（适中）、`high`（更详细）。

### web_search_options `object` <font color="gray">可选</font>

配置**网页搜索工具**的行为，用于让模型在生成回答前主动检索互联网最新信息。

### metadata `object` <font color="gray">可选</font>

允许附带最多 16 个键值对，作为结构化业务元信息保存，便于在日志、检索或管理界面中查询。

### stream `boolean or null` <font color="gray">可选</font>

- 默认：`false`

是否启用**流式输出**（Server-Sent Events）。为 `true` 时，结果以事件流形式分片返回。

### stream_options `object` <font color="gray">可选</font>

仅当 `stream: true` 时有效，用于配置流式行为，例如是否在流结束时附带 usage 信息等。

### provider `object` <font color="gray">可选</font>

用于配置本次请求在多个模型提供商（如 OpenAI、Anthropic、Google 等）之间的路由与故障转移策略。
如果不配置，则使用项目或模型的默认路由策略。

#### routing `object` <font color="red">必选</font>

路由策略配置，决定请求在多个提供商之间如何选择与分发。

##### type `string` <font color="red">必选</font>

路由类型，支持以下取值：

- `priority`
  按优先级顺序选择提供商：优先尝试第一个，失败后再尝试下一个（可配合 fallback 使用）。
- `round_robin`
  轮询分发：在多个提供商之间平均分配请求流量。
- `least_latency`
  最低延迟优先：根据历史/实时统计选择当前响应最快的提供商。

##### primary_factor `string` <font color="gray">可选</font>

当存在多个可用提供商时的主要考量因素。例如：

- `cost`
  优先选择成本更低的提供商
- `speed`
  优先选择响应更快的提供商
- `quality`
  优先选择质量更高（例如更强模型/更稳定）的提供商

实际行为会与 type 联合作用：例如 type = "priority" 时，primary_factor 主要影响优先级排序逻辑

##### providers `array` <font color="red">必选</font>

可参与路由的模型提供商列表。例如：`["openai", "anthropic", "google"]`

#### fallback `string` <font color="gray">可选</font>

故障转移（Failover）策略。当当前选中的提供商出现错误（如超时、额度不足、服务不可用）时，如何进行自动切换：

`"true"`：启用自动故障转移：当当前提供商不可用时，根据路由策略自动尝试列表中其他可用提供商。

`"false"`：禁用故障转移：如果当前提供商调用失败，则直接返回错误，不再尝试其它提供商。

`"<provider_name>"`：显式指定固定的备用提供商，例如 "anthropic"：

优先使用主路由选出的提供商
若失败，则转而使用指定的备用提供商
若主 + 备用都失败，则返回错误

### model_routing_config `object` <font color="gray">可选</font>

用于配置当前请求在**同一提供商内部不同模型之间**的选择与路由策略（如在 `gpt-4o`、`gpt-4-turbo`、`claude-3-5-sonnet` 之间如何选用）。

如果不配置，则使用项目或 SDK 的默认模型选择策略（例如默认模型、默认任务类型映射等）。

#### available_models `array` <font color="red">必选</font>

可参与路由或备选的**模型名称列表**。

#### preference `string` <font color="gray">可选</font>

首选模型名称。

#### task_info `object` <font color="gray">可选</font>

任务元信息，用于**根据任务类型和复杂度**决定具体模型或参数。

内部字段如下：

##### task_type `string` <font color="red">必选</font>

任务类型，用于表达当前请求的用途，以便于路由或自动选择参数。

- 支持值示例：
  - `"chat"` —— 对话类任务（多轮对话、助手问答）
  - `"completion"` —— 通用文本生成/补全
  - `"embedding"` —— 向量化/语义嵌入
- 用途：
  - 可据此为不同任务类型设置不同的默认模型或限额策略
  - 也可与 `complexity` 联动，决定是否启用更强模型

##### complexity `string` <font color="gray">可选</font>

任务复杂度，用于刻画请求的难度或重要程度。

- 支持值：
  - `"low"` —— 简单任务（短回答、简单改写等）
  - `"medium"` —— 中等复杂度（一般问答、基础代码、常规分析）
  - `"high"` —— 高复杂度（长文档分析、复杂编程、大规模推理）
- 用途：
  - 可以根据复杂度选择不同档位的模型（如低复杂度选便宜模型，高复杂度选能力更强的模型）
  - 也可用于控制超时时间、重试策略等

##### additional_properties `object` <font color="gray">可选</font>

任务相关的扩展字段，键值对形式，自由扩展。

#### additional_properties `object` <font color="gray">可选</font>

模型路由配置本身的扩展字段，用于在标准结构之外，附加额外的控制信息。

### reasoning `object` <font color="gray">可选</font>

用于配置**推理过程（chain-of-thought / reasoning trace）**相关行为，包括是否启用、推理深度与长度控制，以及是否对外暴露推理内容。

如果不配置，则由系统或模型使用默认的推理策略。

#### enabled `boolean` <font color="red">必选</font>

是否启用显式推理过程。

- `true`：模型在内部使用并（在允许的情况下）输出更详细的推理步骤
- `false`：模型仅给出结论性回答，不显式展开推理（或尽量少展开）

#### effort `string` <font color="gray">可选</font>

推理投入程度，用于控制模型在**思考深度 / 推理精细程度**与**成本 / 时延**之间的平衡。

- 支持值：
  - `"low"` —— 轻量推理：快速给出答案，较少细节
  - `"medium"` —— 中等推理：在多数任务下的折中选择
  - `"high"` —— 深度推理：更详细的分析过程，更高的 token 消耗与时延
- 典型用法：
  - 对时延敏感的在线服务：倾向 `"low"` 或 `"medium"`
  - 对正确性要求极高的任务：倾向 `"high"`

#### max_tokens `number` <font color="gray">可选</font>

推理过程（而非最终回答）的**最大 token 数上限**。

#### exclude `boolean` <font color="gray">可选</font>

是否**从对用户返回的内容中排除推理过程**。

- `false`：
  - 推理内容可以与最终答案一并返回（例如在调试或工具开发阶段）
- `true`：
  - 推理过程仅在系统内部使用，不向用户暴露（典型的生产环境设置）
- 用途：
  - 满足安全与合规需求（不暴露 chain-of-thought）
  - 在开发 / 调试阶段通过设置为 `false` 观察模型思考过程，便于迭代提示词与策略配置

#### usage `object` <font color="gray">可选</font>

使用统计信息

##### include `boolean` <font color="red">必选</font>

是否在响应中包含使用统计信息

### 不支持字段

| 字段名                 | 类型          | 是否支持                                            | 说明                                                                                  |
| ---------------------- | ------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------- |
| audio                  | object/null   | <span style="white-space: nowrap;">❌ 不支持</span> | 音频输出参数                                                                          |
| modalities             | array         | ❌ 不支持                                           | 输出模态类型                                                                          |
| functions              | array         | ❌ 不支持                                           | 已废弃，不接收此参数                                                                  |
| function_call          | string/object | ❌ 不支持                                           | 已废弃，不接收此参数                                                                  |
| prompt_cache_key       | string        | ❌ 不支持                                           | 提示词缓存 key                                                                        |
| prompt_cache_retention | string        | ❌ 不支持                                           | 缓存保留策略                                                                          |
| safety_identifier      | string        | ❌ 不支持                                           | 安全标识                                                                              |
| store                  | bool/null     | ❌ 不支持                                           | 存储本次对话                                                                          |
| service_tier           | string        | ❌ 不支持                                           | 服务等级                                                                              |
| prediction             | object        | ❌ 不支持                                           | 预测输出配置                                                                          |
| seed                   | int/null      | ❌ 不支持                                           | 为采样过程设置随机种子，已标记为废弃。                                                |
| user                   | string        | ❌ 不支持                                           | 旧版的用户标识字段，现已由 `safety_identifier` 和 `prompt_cache_key` 接替其主要作用。 |
| max_tokens             | int/null      | ❌ 不支持                                           | 已废弃，用 max_completion_tokens 替代                                                 |

## Response

### 非流式：返回「完整的 chat completion object」

当 `stream: false`（或未传）时，接口返回一个完整的 **chat.completion** 对象。字段说明按上文表格顺序展开。

---

### 顶层字段：`choices`

#### choices `array`

聊天补全选项的列表。与请求中的 `n` 一一对应；当前仅支持 `n = 1`，因此通常只包含一个元素。

---

### choices[i] 对象

#### finish_reason `string`

模型停止生成 token 的原因。常见取值包括：

- `stop`：达到自然停止点或命中 stop 序列
- `length`：达到请求中指定的最大 token 数
- `content_filter`：内容被内容过滤器拦截而省略
- `tool_calls`：模型调用了工具（`tool_calls`）
- `function_call`：模型调用了函数（旧版，已弃用）

#### index `integer`

该选项在 `choices` 列表中的索引，从 0 开始。

#### logprobs `object`

该选项的对数概率信息，用于解析每个输出 token 的概率分布。仅在请求中设置了 `logprobs` 相关参数时存在。

---

### choices[i].logprobs.content

#### content `array`

包含带有对数概率信息的「消息内容 token」列表。每个元素描述一个 token 及其候选 token：

- bytes `array`  
  一个整数列表，表示该 token 的 UTF‑8 字节表示。在某些语言或表情符号中，一个字符可能由多个 token 组成，通过合并这些字节可以还原正确文本；如果该 token 没有字节表示，则为 `null`。

- logprob `number`  
  该 token 的对数概率。如果该 token 不在前 20 个最可能的 token 中，则通常使用 `-9999.0` 表示「极不可能」。

- token `string`  
  当前输出 token 的文本表示。

- top_logprobs `array`  
  在该位置最可能的一组候选 token 及其对数概率列表。极少数情况下，实际返回数量可能少于请求的数量。
  - bytes `array`  
    候选 token 的 UTF‑8 字节表示列表；若无字节表示则为 `null`。
  - logprob `number`  
    候选 token 的对数概率。
  - token `string`  
    某个候选 token 的文本。

---

### choices[i].logprobs.refusal

#### refusal `array`

包含带有对数概率信息的「拒绝内容 token」列表。当模型输出拒绝信息时，用于解析拒绝文本对应的 token 概率。

- bytes `array`  
  该拒绝 token 的 UTF‑8 字节表示；如果没有则为 `null`。
- logprob `number`  
  该拒绝 token 的对数概率。不在前 20 名时通常为 `-9999.0`。
- token `string`  
  拒绝内容中某个 token 的文本。
- top_logprobs `array`  
  在该位置最可能的拒绝 token 候选列表。
  - bytes `array`  
    候选拒绝 token 的 UTF‑8 字节表示。
  - logprob `number`  
    候选拒绝 token 的对数概率。
  - token `string`  
    拒绝内容中某个候选 token 的文本。

---

### choices[i].message

#### message `object`

由模型生成的完整聊天补全消息。

---

### choices[i].message 字段

#### reasoning `string` （ZenMux 拓展字段）

推理过程的文本内容，用于展示模型对答案的思考过程或中间分析。实际是否返回取决于模型和请求中的推理配置。

#### reasoning_content `string`（ZenMux 拓展字段）

推理内容的文本主体，通常比 `reasoning` 更完整或更详细，可作为推理链（chain‑of‑thought）的主要承载字段。

#### content `string`

消息的正文内容，一般为模型给用户的自然语言回复文本。某些多模态模型也可能返回结构化内容，但整体遵循 OpenAI chat 格式。

#### refusal `string or null`

如果本轮模型拒绝执行用户请求，这里包含模型生成的拒绝消息文本；否则为 `null`。

#### role `string`

消息作者角色。对于模型回复消息，为 `"assistant"`。

#### annotations `array`

消息的注释列表。在使用 Web 搜索等工具时，用于携带 URL 引用等信息。

- type `string`  
  URL 引用的类型，当前固定为 `url_citation`。
- url_citation `object`  
  使用网页搜索时的 URL 引用详情。
  - end_index `integer`  
    在当前消息 `content` 中，该 URL 引用最后一个字符的索引。
  - start_index `integer`  
    在当前消息 `content` 中，该 URL 引用第一个字符的索引。
  - title `string`  
    网页资源标题。
  - url `string`  
    网页资源的 URL。

#### audio `object`

当请求了音频输出模态时，该对象包含模型音频响应的数据。

- data `string`  
  由模型生成的 Base64 编码音频字节，音频格式由请求中指定。
- expires_at `integer`  
  该音频响应在服务器端不再可用于后续多轮对话的 Unix 时间戳（秒）。
- id `string`  
  此音频响应的唯一标识符。
- transcript `string`  
  对应音频内容的文字记录（转写文本）。

#### function_call `object`

已弃用的函数调用字段，已由 `tool_calls` 取代，仅为兼容旧版调用格式而保留。表示模型建议调用的函数名称与参数。

- arguments `string`  
  以 JSON 字符串形式表示的函数参数。需要注意模型不保证严格生成合法 JSON，也可能包含模式中未定义的字段；业务方需要在调用前进行解析与校验。
- name `string`  
  要调用的函数名称。

#### tool_calls `array`

新版工具调用列表。每个元素描述一次工具调用，可以是「函数工具调用」或「自定义工具调用」。支持模型在一次回复中并行调用多个工具。

- id `string`  
  工具调用的唯一 ID，用于与后续 `tool` 消息中的 `tool_call_id` 对应。
- type `string`  
  工具类型。目前标准为 `function`，ZenMux 可能在扩展中支持 `custom` 等其他类型。
- function `object`  
  当 `type = "function"` 时，表示模型调用的函数。
  - arguments `string`  
    JSON 字符串格式的函数调用参数。模型可能不会始终生成合法 JSON，也可能产生模式中未定义的字段；业务方应在实际调用前进行校验。
  - name `string`  
    要调用的函数名称。

---

### 顶层字段：元数据与用量统计

#### created `integer`

聊天补全创建时的 Unix 时间戳（秒）。

#### id `string`

本次聊天补全的唯一标识符。

#### model `string`

用于完成此次聊天补全的模型标识，例如 `openai/gpt-5`。

#### object `string`

对象类型，非流式响应固定为 `chat.completion`。

#### service_tier `string`

指定用于处理请求的服务类型或服务等级。ZenMux 自身不限定取值，如果上游模型返回该字段则会透传。

#### system_fingerprint `string`

表示本次请求使用的后端配置指纹信息，用于标识底层服务版本或集群。若上游返回则透传。

#### usage `object`

本次请求的使用统计信息，包括 prompt 和 completion 的 token 数。

- completion_tokens `integer`  
  生成的补全部分中使用的 token 数量。
- prompt_tokens `integer`  
  输入提示（messages 等）中使用的 token 数量。
- total_tokens `integer`  
  本次请求中总共使用的 token 数量（`prompt_tokens + completion_tokens`）。

- completion_tokens_details `object`  
  对补全 token 的进一步细分。
  - accepted_prediction_tokens `integer`  
    在使用 Predicted Outputs 时，预测中实际出现在 completion 中的 token 数量。与预测输出能力相关，当前模型一般不会使用该字段。
  - audio_tokens `integer`  
    模型生成的音频输出所占用的 token 数。
  - reasoning_tokens `integer`  
    模型为推理过程生成的 token 数（即使不全部展示给用户，也计入消耗）。
  - rejected_prediction_tokens `integer`  
    使用 Predicted Outputs 时，预测中未出现在 completion 中的 token 数量；这些 token 仍会计入计费和上下文窗口限制。目前与预测输出能力相关，一般不会使用。

- prompt_tokens_details `object`  
  对提示部分 token 的细分说明。
  - audio_tokens `integer`  
    提示中音频输入所占用的 token 数。
  - cached_tokens `integer`  
    提示中通过缓存（Prompt Caching）命中的 token 数。

---

### 流式：返回「多次 chat completion chunk object」

当 `stream: true` 时，接口以 SSE（Server‑Sent Events）形式多次返回 **chat.completion.chunk** 对象，客户端需按顺序消费与拼接。这部分字段说明同样按表格顺序展开。

---

### 顶层字段：`choices`（流式分块）

#### choices `array`

聊天完成选项的列表。如果 `n > 1`，可以包含多个元素。当设置了 `stream_options: {"include_usage": true}` 时，最后一个数据块中 `choices` 可能为空数组，此时只携带 `usage` 信息。

---

### choices[i]（Chunk）对象

#### delta `object`

由流式模型响应生成的增量对话内容，即相较于之前分块「新增」的部分。

- reasoning `string`（ZenMux 拓展字段）  
  推理过程内容的增量文本，用于逐块输出推理信息。
- reasoning_content `string`（ZenMux 拓展字段）  
  推理内容主体的增量片段，通常与 `reasoning` 搭配，用于拼接完整推理文本。
- content `string`  
  本分块的消息正文内容增量。客户端应将各分块的 `content` 依次拼接成完整回复。
- function_call `object`（已弃用）  
  旧版函数调用增量信息，已被 `tool_calls` 取代，仍支持解析。
  - arguments `string`  
    本分块新增的函数参数 JSON 片段，需与前后分块的 `arguments` 拼接后再解析。
  - name `string`  
    要调用的函数名称，一般在该调用的首块中出现。

- refusal `string`  
  本分块新增的拒绝消息片段。
- role `string`  
  本条消息作者的角色，通常在第一块中为 `"assistant"`。
- tool_calls `array`  
  工具调用的增量信息列表。

  对于每个增量工具调用元素：
  - index `integer`  
    该工具调用在 `tool_calls` 数组中的序号。
  - function `object`  
    函数工具调用的增量信息。
    - arguments `string`  
      函数调用参数 JSON 字符串的增量片段，需跨分块拼接再解析。
    - name `string`  
      要调用的函数名，通常在工具调用开始时给出。

  - id `string`  
    工具调用的 ID，通常在首次出现时给出，用于后续 `tool` 消息关联。
  - type `string`  
    工具的类型，当前仅支持 `function`。

#### finish_reason `string or null`

模型在当前分块停止生成的原因：

- `stop`：自然结束或命中 stop 序列
- `length`：达到最大生成 token 上限
- `content_filter`：内容被过滤
- `tool_calls`：触发工具调用
- `function_call`：触发旧版函数调用
- `null`：尚未结束生成，后续仍会有分块

#### index `integer`

该选项在 `choices` 数组中的序号。

#### logprobs `object`

该选项在当前分块的对数概率信息结构，与非流式 `logprobs` 相同，但仅针对「新增」 token。

---

### choices[i].logprobs.content（流式）

#### content `array`

包含当前分块中新生成的「消息内容 token」列表。

- bytes `array`  
  当前 token 的 UTF‑8 字节表示。
- logprob `number`  
  当前 token 的对数概率；若不在前 20 个最可能 token 内，则为 `-9999.0`。
- token `string`  
  当前输出 token 的文本表示。
- top_logprobs `array`  
  本位置最可能的候选 token 列表。
  - bytes `array`  
    候选 token 的 UTF‑8 字节表示。
  - logprob `number`  
    候选 token 的对数概率。
  - token `string`  
    某个候选 token 的文本。

---

### choices[i].logprobs.refusal（流式）

#### refusal `array`

包含当前分块中新生成的「拒绝内容 token」列表。

- bytes `array`  
  拒绝 token 的 UTF‑8 字节表示。
- logprob `number`  
  拒绝 token 的对数概率，低概率时为 `-9999.0`。
- token `string`  
  拒绝内容中某个 token 的文本。
- top_logprobs `array`  
  该位置上最可能的拒绝 token 候选列表。
  - bytes `array`  
    候选拒绝 token 的 UTF‑8 字节表示。
  - logprob `number`  
    候选拒绝 token 的对数概率。
  - token `string`  
    候选拒绝 token 的文本。

---

### 流式顶层其他字段

#### created `integer`

聊天补全创建时的 Unix 时间戳（秒）。同一流中的所有分块该值相同。

#### id `string`

聊天补全的唯一标识符。同一流中的每个分块都共享同一个 `id`。

#### model `string`

用于本次聊天补全的模型名称。

#### object `string`

对象类型，流式响应固定为 `chat.completion.chunk`。

#### service_tier `string`

指定处理请求时所使用的服务类型或服务等级。若上游模型返回该字段，则透传。

#### system_fingerprint `string`

此指纹表示本次请求使用的后端配置。虽然在部分上游已标记为 Deprecated，但 ZenMux 仍会保留并透传该字段。

---

### usage `object`（仅最后一块包含）

当在请求中设置 `stream_options: {"include_usage": true}` 时，最后一个分块会包含 `usage` 对象；其结构与非流式响应一致。

- completion_tokens `integer`  
  生成的补全部分 token 数量。
- prompt_tokens `integer`  
  提示部分 token 数量。
- total_tokens `integer`  
  本次请求中总共使用的 token 数量。

- completion_tokens_details `object`  
  补全 token 细分统计。
  - accepted_prediction_tokens `integer`  
    预测输出中被采纳的 token 数。
  - audio_tokens `integer`  
    模型生成音频相关的 token 数。
  - reasoning_tokens `integer`  
    模型用于推理过程的 token 数。
  - rejected_prediction_tokens `integer`  
    预测输出中未被实际采用但仍计入消耗的 token 数。

- prompt_tokens_details `object`  
  提示 token 细分统计。
  - audio_tokens `integer`  
    提示中音频输入 token 数。
  - cached_tokens `integer`  
    提示中通过缓存命中的 token 数。

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

::: api-response

```json
{
  "id": "dc41ec9a378d43a497ca2daff171ceb0",
  "model": "openai/gpt-5",
  "choices": [
    {
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "content": "There isn’t a single, objective answer. Different traditions offer different meanings, and most people end up constructing their own.\n\n- Religious: To know or serve God, live virtuously, and love others.\n- Existential/humanist: Life has no built‑in meaning; you create it through choices, authenticity, and responsibility.\n- Scientific-naturalist: There’s no cosmic purpose; meaning comes from conscious experience—relationships, curiosity, creativity, and contribution.\n- Eudaimonic (Aristotle): Flourish by developing virtues, using your strengths, and living in accord with reason and values.\n- Eastern philosophies: Reduce suffering, cultivate compassion, and see through the illusion of a separate self.\n\nA practical way to find meaning:\n- Clarify your values (what you’d stand for even if it’s hard).\n- Invest in relationships and service.\n- Learn and create; pursue mastery in something that matters to you.\n- Contribute beyond yourself—help, build, protect, or heal.\n- Savor and be present; cultivate gratitude and awe.\n\nA simple summary many find helpful: Love well, learn continuously, and leave the world a little better than you found it.",
        "refusal": null,
        "annotations": [],
        "reasoning": "**Considering the meaning of life**\n\nI need to answer concisely but thoughtfully. The question is philosophical, so I should present various perspectives: religious, existential, scientific, and personal. It might be useful to suggest a practical framework for finding meaning, focusing on relationships, personal growth, and contributions. While a general response is appropriate, I should clarify that there’s no single objective answer. I can mention common themes like connection, creativity, and love, and propose questions for reflection. A nice one-liner could be about creating meaning through conscious engagement.",
        "reasoning_details": [
          {
            "index": "0",
            "format": "openai-responses-v1",
            "type": "reasoning.summary",
            "summary": "**Considering the meaning of life**\n\nI need to answer concisely but thoughtfully. The question is philosophical, so I should present various perspectives: religious, existential, scientific, and personal. It might be useful to suggest a practical framework for finding meaning, focusing on relationships, personal growth, and contributions. While a general response is appropriate, I should clarify that there’s no single objective answer. I can mention common themes like connection, creativity, and love, and propose questions for reflection. A nice one-liner could be about creating meaning through conscious engagement."
          },
          {
            "id": "rs_0639a0762f01111400696766d7af48819388646c9544e1107c",
            "index": "0",
            "format": "openai-responses-v1",
            "type": "reasoning.encrypted",
            "data": "gAAAAABpZ2br9iURFxvdEjmaRGKcjutfnC2dVpSTQxh8Vjel9pkdkU6b6sX_JjARvh4aU-hI9c4ZfGjWAze2FfWqfvNyGN55ljlnX9wHRTK6OR9VWyezo7PoXDS4uJPV62OjA5DvDrj6KZeMcxUnEo54XORRqgGbqCR6R0Pv1q2YoFfJZh0gVBdakKDTlm4JEb6o5hIEg9b1jh1mNxu-SyCxuIecmE_ZsDYphWyLu3S1jPM-ieNTJ97GLfiefbqk-SostjrIKpiVtrGMU0cHS7FYk01X260lXAAf54jqdMzF8Haw08m0zs0vTABPfP3WK5RCOlHd_EuEsabuZoZXwqyWkAA9G3l0i-0xlXnPNZlXwcUlfqZto6aszy-XPPUDXfpIZqEEpcF2ikXSdTSTOMxAtSb2Q1lUnI4rN45-dOonjJ_VltIHXJCf9c-wbF3d-9ymPDwhib4VnlNTbH03I6SK-_PebVkTF1efcaL5MonE0_lypsNn4ZF-T3wpp1jGTke5mMv8qjChJYUaO5C7eGugmM6pvxnAFBr375Wic-rh1wlBrPEtmXPLVO-TqCGNddB-Vrg0HVblXOphr1gPXcuE8VpGw40PtiT9YqYDaAlZRLZpxJfB9hAxtKDfgqh5f5TqfrXjuUJSeT6sQPgCv4vHulpwSWKNOh5PpCvW5FS1HHvPXW1d5WERDl_dngxRWU4NuIi0MlSLV5kd_oTOOM4AVRSYK0TA4o8YpAZVlVYGVp9b5Vs1rhVl56ga_iOBfiRw16Tb7nO7V-vcwrBQLOYiFixuE0Em5UAEaLp_wxP12QqoRSRezFTHkNT9ietR03Z38H8SzwbPoPB2XiI9pe5KxJGQ2cccdS9s5o4_Btj8kp9q9n2rqFg0Cuv-WChnzhgX8u5zrk1cAqCNhr5uul-RdJLWCz9IH35oOe14umu8ymaN4D1x1VTY5uPef7OrjYyYXqTQa-CMUFqw3qShwBftlZDfF6rLMgKUiEBP93ERFNBIMoBIn-BVEdi5yjImIUkH_q1iVyhtQTEHUh7TMF7_i2vWZUB-NXIPs9Zqt76pH-tKukLWvDrHqeajwvtt9d6X4xks9oGzepnWmL2nyFggLD24R8-59Sc5dco-Ssr91TfUpm8VrJXqUTtcMcWuCoY0i93MT8ty5Bc0hYQ23-vzZdyS0Rm6dO26HDXrvZ9TGL4uW_QXNBX6q51qlQ_xr4m51JU8Wul_You9-M03dO99LkdljtF5nKsnZNdiWGRnF9oFmokdHFAqfBM6KjLZUUkDsVG6hLElejg89t0kymwUJfao21MMCb56E2G6QtUOx4vf8F3myDFhOX3zrAAhoJ-Bw7rK3s2esbnDBn96ZzKoyGOLHm54kQM2_Rs9qQdjflxZ4WKhXoEJwz9H1uHILBMVbrl1aTu_ReYb8xJPVR5oB7Ky_1GPoeG82QntVExCJDZpb4fAqpzFzuV6B7GsVF6Z0cyeyPi3TGEjxSLxYqGWVMBSEsokx8USEET0T7ytiHpVQ4cOr2eimLzDp-hJbZKGEufU6Tnh9RZA2-0Q87X57RaoAydY6brj9S3tTAy2Iz8m_-qEGLXjUr6ffDg3lNMGQhFvN-YAWbdmidbZfCVQR1Oc6A6-ayowaHpyUeff7PxQFXaQ7k3P0W7p1N3VLTjC3lNk2gSPyq_6MvLmxXOlGLj_50Q1OLAFn0bK7knhFf8t7gS7MjOXMQl9PiSbtQL9URHrPeMYKjpQGa84rOnZzC8G9RXvzKatVHB0NpKO02DeTY4hzsMw-Wj73-ZpBSSiyOlTpuVVNxma83krKqMqU_9kX09mNWB6UKrm9v7RxFuOjyVd5x35iodmPUbaXbzqETubPRzVKedLAhaYVTZp1J_qWvLVPoSImyFrM0IPB2Jy5ksqqAbbDjTy3l6Jp3pNu-IhiACVA1JlxRQ67Esb7JaK3ZakR3ExWSPDgxonqX8YvS6dr0UM2tjpOnurQc5NUSYBwo9vHzQxbWVuBATJaSUqe0IrJKPyvErRoEtFGjKZ8CvZagw1-MfD0KTLAmzR3hYAXKADsMRibEXf8-SPUrnuvm4OsRj1Gg7jl4k_ITYjOiRLzBMvVVxxRFfAhR7BFYBC1H0dClGTy4yxPKDNUR9HctiuQFO2-Q4Sw4dEqnTYSwCJS4Zaw5DHvqbDh9JK3AKdatRHHImqOxxtUxiJ8IaQcd2n_CaNbIekuuqUclwnjW8IJquTAPDJX0MhsyBY3nXJMVfeyCFO0D0g8OcvCH_9pFrsGgpTb7DFloDeTfCFUfY0GGGtfuhSL3qDggFAurf9H3cN73dOW5wujFOTGAbWG8aHf2Rok_H06fcg4zJSu5TnHkoJjdyc5n_NIo1RATiKwNkSFHwc_2-RnrnmOVl4125ufyqqrvuENapGWm8xGySQW1Zb39AKdUpBr4zEgU_M3PR6D0ujubsJLncgO8X6DwQ47QlGjPYmnjG_-q3O3plr-ShFJQOZqBvSgtdcqQBu0LK8I3vLXjHkQweUsVRzxlbwOYFMjmYOFWzxq2gP86-4TldrnOsUw0afewm0s_d6N8t2F_mvEgmJ5fPA3KXIQ7Fjaqxt_KUgqZqA4j3wGaAqI89QUc2HwU7bVFrLvLa019bJMj4az7WYmw1ajorD0C8dB2tLMjGdVHul_oEod0vyoCt-7I7qxZhkoW24ULSsmtPpSu0zV_gK0runwxjx1csxkHQP-MeoJry_F_D2jhgEmeJjamddbyT2TcQ7S3FS3uNDQyl6agzXq3rRdX9VlUatq9LpUCqL6U7WrA8JlEyFSJVm9W0pYaqjPiHiP47twkjl3txuKraV-Wkg4TrjlcMM3IqkMcAvySekuZGbIhjRscByTmDL-sESsMVG5dV8NU33HwnL9wLyZZ416JF927SfRTkF7DRrl-PRVX-lLNtmoXXSFCBdMfiUhvfWLR7r44ZxMRJCLacN1dw49XDyzANSfRmQySGmWhYUjUej6bLy9bdL5HP21O1u_9XUFWc_boI0a7tphBlMiUBGV7jAKlN9QrMAJVUBamHM3GmabbmVpFrvnuYd5bD_iJN0BY6cZb9lWDs6P6yHip8SoMO9VM8ykcdTfLOqp_IhlUkD3eZ0cSObuPHPs4HfiFHlG6qLLBtT_ytUeIDc5VMjA_6i0mKm85HhqWdB_MWoqE-aSPpAEtmQTLPUyyxpYrMYtWJ_OUqBxiU3CiV9G1QS8oU2gMq60w0OCDoy1F-oxnOLpJIrDhnDTAXlYnbFlYkEAIb9QDn7UDfitHrPqaUwShDHX7XXVbuYYJMIJs2XXnOViviNn5SbVkSDPyt4xi-UfPKpcTJCmmOSvZn-fs3BdO7oGdZC8UmBM6sVmgxOPL361DcEs6fsLKhqKwVLqDS-CYmT811dqja2CcnTmHIQrO6Wg_hEi5C1YW0iA1stpw461VDh86rHRslJSIn6kDJ9W_X-3vsTUpk62jUs6Bv1KkoyhcojCvgXtDr7ff5mTqTbzX9d76yVwW97xqA86SgntP-N6cNE2GcBKaXea32gjGskvFDV5w7-DGoxeZrNM1Ur5-S3ADFDE-A2mrQCxbm66xcB8KNK181k3QWLrlrKWKNMCZLgkFxuXbD2plxgPDWaqaJxFoDibjHHS94JXhBMu3KB6_CziqK7irU3OHsqEGc7ZDHS4araDurJUlr_UhH4UTsS9pOsxF5XniWdyNBdr6CKSrSC0SIw9YUi39X9CLp5mzWspRssOwUhd1ECVkLgOF8yv5g="
          }
        ]
      },
      "index": 0,
      "logprobs": {
        "content": [],
        "refusal": null
      }
    }
  ],
  "usage": {
    "completion_tokens": 629,
    "prompt_tokens": 13,
    "total_tokens": 642,
    "completion_tokens_details": {
      "reasoning_tokens": 384
    },
    "prompt_tokens_details": {
      "cached_tokens": 0
    }
  },
  "created": 1768384213,
  "object": "chat.completion",
  "service_tier": "default"
}
```

:::
