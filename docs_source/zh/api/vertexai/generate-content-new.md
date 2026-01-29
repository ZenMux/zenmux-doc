---
pageClass: api-page
title: Generate Content
head:
  - - meta
    - name: description
      content: Zenmux documentation - generate content new
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, generate, content, new
---

# Google Vertex AI API: Generate Content

### 非流式：

```
POST https://zenmux.ai/api/vertex-ai/v1/publishers/{provider}/models/{model}:generateContent
```

### 流式：

```
POST https://zenmux.ai/api/anthropic/v1/publishers/{provider}/models/{model}:streamGenerateContent
```

ZenMux 支持 Google Vertex AI API，使用 Gen AI SDK，具体请求参数和返回结构详见 [Google Vertex AI 官网](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference)。

## Path parameters

### provider `string` <font color="red">必填</font>

模型提供商（如 google）。

### model `string` <font color="red">必填</font>

模型名称（如 gemini-2.5-pro）。

## Request headers

### Authorization `string` <font color="red">必填</font>

Bearer Token 鉴权

### Content-Type `string` <font color="red">必填</font>

默认：`application/json`

## Request body

请求体为 JSON。

### contents `array<Content>` <font color="red">必填</font>

当前对话内容（单轮/多轮历史 + 本轮输入）。

#### role `string` <font color="gray">可选</font>

内容生产者（默认 user）。

- user：表示消息是由真人发送的，通常是用户生成的消息。
- model：表示消息是由模型生成的。

#### parts `Part[]` <font color="red">必填</font>

至少 1 个 Part。

::: details part

- text `string`<font color="gray">可选</font>

  文本提示或代码段。

- inlineData `Blob`<font color="gray">可选</font>

  原始字节中的内嵌数据。
  - mimeType `string` <font color="gray">可选</font>

        在 data 或 fileUri 字段中指定的文件的媒体类型。可接受的值包括：

    - application/pdf
    - audio/mpeg
    - audio/mp3
    - audio/wav
    - image/png
    - image/jpeg
    - image/webp
    - text/plain
    - video/mov
    - video/mpeg
    - video/mp4
    - video/mpg
    - video/avi
    - video/wmv
    - video/mpegps
    - video/flv
    - video/x-ms-wmv

  - data `bytes` <font color="gray">可选</font>

    原始字节中的内嵌数据。

- fileData `FileData`<font color="gray">可选</font>

  存储在文件中的数据。
  - mimeType `string` <font color="gray">可选</font>
  - fileUri `string` <font color="gray">可选</font>

    要包含在提示中的文件的 URI 或网址。

- functionCall `FunctionCall`<font color="gray">可选</font>

  它包含表示 FunctionDeclaration.name 字段的字符串，以及包含模型预测的函数调用的所有参数的结构化 JSON 对象。
  - name `string` <font color="gray">可选</font>

    要调用的函数名称。

  - args `Record<string,any>` <font color="gray">可选</font>

    以 JSON 对象格式表示的函数参数和值。

- functionResponse `FunctionResponse`<font color="gray">可选</font>

  FunctionCall 的结果输出，其中包含表示 FunctionDeclaration.name 字段的字符串和包含函数调用的任何输出的结构化 JSON 对象。它用作模型的上下文。
  - name `string` <font color="gray">可选</font>

    要调用的函数名称。

  - response `Record<string,any>` <font color="gray">可选</font>

    以 JSON 对象格式表示的函数响应。

- videoMetadata `VideoMetadata` <font color="gray">可选</font>

  对于视频输入，为视频的开始和结束偏移量（采用时长格式），以及视频的帧速率。
  - startOffset `number` <font color="gray">可选</font>

    视频开始偏移量（时长格式）。

  - endOffset `number` <font color="gray">可选</font>

    视频结束偏移量（时长格式）。

  - fps `number` <font color="gray">可选</font>

    视频帧速率。

- mediaResolution `enum`<font color="gray">可选</font>

  控制输入媒体的处理方式。如果指定，则此配置会替换 generationConfig 中的 mediaResolution 设置。 LOW 会减少每个图片/视频的 token 数量，这可能会导致细节丢失，但允许在上下文中包含更长的视频。支持的值：`HIGH`、`MEDIUM`、`LOW`。

:::

### cachedContent `string` <font color="gray">可选</font>

缓存内容资源名（作为上下文使用）：

- `projects/{project}/locations/{location}/cachedContents/{cachedContent}`

### tools `array<Tool>` <font color="gray">可选</font>

工具列表（如函数调用、检索、搜索、代码执行等）。

### toolConfig `ToolConfig` <font color="gray">可选</font>

工具配置（对本次请求里所有 tools 共享）。

<!-- ### labels `Record<string,string>` <font color="gray">可选</font>

用户自定义标签（用于计费与报表等）。 -->

### safetySettings `array<SafetySetting>` <font color="gray">可选</font>

逐请求安全设置（对候选项生效）。

#### category `string` <font color="red">必选</font>

要为其配置阈值的安全类别。

- `HARM_CATEGORY_UNSPECIFIED`： 未指定有害类别。
- `HARM_CATEGORY_HATE_SPEECH`：有害类别为仇恨言论。
- `HARM_CATEGORY_HARASSMENT`：有害类别为骚扰。
- `HARM_CATEGORY_SEXUALLY_EXPLICIT`：有害类别为露骨色情内容。
- `HARM_CATEGORY_DANGEROUS_CONTENT`：有害类别为危险内容。

#### threshold `string` <font color="red">必选</font>

基于概率阻止属于指定安全类别的响应的阈值。

- `OFF`：在所有类别都已停用的情况下关闭安全设置
- `BLOCK_NONE`：全部不屏蔽。
- `BLOCK_ONLY_HIGH`：仅屏蔽高阈值内容（即屏蔽较少的内容）。
- `BLOCK_MEDIUM_AND_ABOVE`：屏蔽中等阈值及以上的内容。
- `BLOCK_LOW_AND_ABOVE`：屏蔽低阈值及以上的内容（即屏蔽较多的内容）。
- `HARM_BLOCK_THRESHOLD_UNSPECIFIED`：未指定的有害屏蔽阈值。

#### method `string` <font color="gray">可选</font>

指定是将阈值用于概率得分还是严重程度得分。如果未指定，则系统会将阈值用于概率得分。

- `HARM_BLOCK_METHOD_UNSPECIFIED`：未指定有害内容屏蔽方法。
- `SEVERITY`：有害内容屏蔽方法同时使用可能性得分和严重程度得分。
- `PROBABILITY`：有害内容屏蔽方法使用概率得分。

### generationConfig `GenerationConfig` <font color="gray">可选</font>

生成参数（控制采样、长度、停止条件、结构化输出、logprobs、音频时间戳、thinking、媒体处理质量等）。

#### temperature `number` <font color="gray">可选</font>

控制输出随机性/发散程度。值越低越确定、越“考试型”；值越高越有创造性/多样性。`0` 倾向总选最高概率 token，因此更接近确定性（但仍可能有少量差异）。如果回复过于模板/过短，可尝试调高；如果出现“无限生成”等异常，也可尝试把温度提高到至少 `0.1`。不同模型范围/默认值可能不同（例如部分 Gemini Flash 系列常见范围 `0.0~2.0`，默认 `1.0`）。

#### topP `number` <font color="gray">可选</font>

核采样（Nucleus sampling）阈值：模型只在“累计概率达到 `topP` 的最小 token 集合”中采样。值越低越保守、越不随机；值越高越发散。范围 `0.0~1.0`（不同模型默认值可能不同）。一般建议 **temperature 与 topP 二选一**做主要调节，不建议两者都大幅调整。

#### candidateCount `integer` <font color="gray">可选</font>

返回候选数（response variations）。**会对所有候选的输出 token 计费**（输入通常只计一次）。多候选通常是预览能力，且一般只支持 `generateContent`（不支持 `streamGenerateContent`），并且不同模型对范围/最大值有约束（例如部分模型支持 `1~8`）。

#### maxOutputTokens `integer` <font color="gray">可选</font>

最大输出 token 数，用于限制回答长度；token 粗略可理解为约 4 个字符（英文场景）。值越小输出越短，值越大允许更长输出。

#### stopSequences `array<string>` <font color="gray">可选</font>

停止序列列表：当模型输出中遇到任意 stop 序列时立即停止，并在首次出现位置截断；**大小写敏感**。列表最多 **5** 个元素。

#### presencePenalty `number` <font color="gray">可选</font>

出现惩罚：对已经在“已生成文本”中出现过的 token 施加惩罚，从而提高生成新内容/多样性的概率。取值范围 `-2.0 ~ <2.0`。

#### frequencyPenalty `number` <font color="gray">可选</font>

频率惩罚：对“重复出现”的 token 施加惩罚，从而降低重复生成的概率。取值范围 `-2.0 ~ <2.0`。

#### seed `integer` <font color="gray">可选</font>

随机种子：固定 seed 时，模型会“尽力”对重复请求给出相同结果，但**不保证完全确定**；模型版本或参数（如 temperature）变化也可能导致差异。不传时默认使用随机 seed。

#### responseMimeType `string` <font color="gray">可选</font>

指定候选输出的 MIME 类型。常见支持：

- `text/plain`（默认）：纯文本输出
- `application/json`：以 JSON 形式输出（用于结构化输出/JSON mode）
- `text/x.enum`：分类任务中按 `responseSchema` 定义输出枚举值

注意：如果你要用 `responseSchema` 约束结构化输出，需要把 `responseMimeType` 设为**非** `text/plain`（例如 `application/json`）。

#### responseSchema `object` <font color="gray">可选</font>

结构化输出的 Schema：约束候选文本必须符合该 schema（用于“控制生成输出/JSON Schema”场景）。使用该字段时，必须把 `responseMimeType` 设为支持的非 `text/plain` 类型。

#### logprobs `integer` <font color="gray">可选</font>

返回每一步生成中 **top 候选 token** 的 log probability（对数概率）。取值范围 `1~20`。**需要同时启用 `responseLogprobs=true` 才能使用该字段**；并且模型选中的 token 不一定等于 top 候选 token。

#### audioTimestamp `boolean` <font color="gray">可选</font>

音频时间戳理解：用于**纯音频文件**的时间戳理解能力（preview）。仅部分模型支持（例如部分 Gemini Flash 系列）。

#### thinkingConfig `object` <font color="gray">可选</font>

Gemini 2.5 及更高版本的 “thinking” 配置。官网给出的字段包括：

- `thinkingBudget` `integer`：thinking 的 token 预算；默认由模型自动控制，上限常见为 `8192` tokens。
- `thinkingLevel` `enum`：控制内部推理强度，常见值 `LOW` / `HIGH`；更高可能提升复杂任务质量，但会增加延迟与成本。

#### mediaResolution `enum` <font color="gray">可选</font>

控制输入媒体（图像/视频）处理方式：`LOW` 会降低每张图/每段视频占用的 token（可能损失细节，但允许更长视频进入上下文）；支持值通常为 `HIGH`、`MEDIUM`、`LOW`。

### systemInstruction `Content` <font color="gray">可选</font>

系统指令（提示模型整体行为；仅建议在 `parts` 里使用 text 且每个 part 单独段落）。

## Response（非流式）

官网给出的响应结构如下：

```ts
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": string
          }
        ]
      },
      "finishReason": enum (FinishReason),
      "safetyRatings": [
        {
          "category": enum (HarmCategory),
          "probability": enum (HarmProbability),
          "blocked": boolean
        }
      ],
      "citationMetadata": {
        "citations": [
          {
            "startIndex": integer,
            "endIndex": integer,
            "uri": string,
            "title": string,
            "license": string,
            "publicationDate": {
              "year": integer,
              "month": integer,
              "day": integer
            }
          }
        ]
      },
      "avgLogprobs": double,
      "logprobsResult": {
        "topCandidates": [
          {
            "candidates": [
              {
                "token": string,
                "logProbability": float
              }
            ]
          }
        ],
        "chosenCandidates": [
          {
            "token": string,
            "logProbability": float
          }
        ]
      }
    }
  ],
  "usageMetadata": {
    "promptTokenCount": integer,
    "candidatesTokenCount": integer,
    "totalTokenCount": integer

    // （可能出现的扩展统计）
    // "cachedContentTokenCount": integer,
    // "thoughtsTokenCount": integer,
    // "toolUsePromptTokenCount": integer,
    // "promptTokensDetails": [...],
    // "candidatesTokensDetails": [...],
    // "toolUsePromptTokensDetails": [...]
  },
  "modelVersion": string,
  "createTime": string,
  "responseId": string
}
```

### candidates `array<Candidate>`

本次生成返回的候选结果列表。

#### Candidate.content `object`

候选内容。

- content.parts `array`  
  内容分块数组。
  - parts[].text `string`  
    生成的文本。

#### Candidate.finishReason `enum (FinishReason)`

模型停止生成 token 的原因；若为空表示尚未停止生成。

常见取值（官网列举）：

- `FINISH_REASON_STOP`：自然停止点或命中 stop 序列
- `FINISH_REASON_MAX_TOKENS`：达到请求指定 token 上限
- `FINISH_REASON_SAFETY`：因安全原因停止（若过滤器阻止输出，则 `Candidate.content` 为空）
- `FINISH_REASON_RECITATION`：因未经授权的引用被标记而停止
- `FINISH_REASON_BLOCKLIST`：包含禁用词
- `FINISH_REASON_PROHIBITED_CONTENT`：包含被禁止内容（例如 CSAM）
- `FINISH_REASON_IMAGE_PROHIBITED_CONTENT`：提示中的图片包含被禁止内容
- `FINISH_REASON_NO_IMAGE`：提示应包含图片但未提供
- `FINISH_REASON_SPII`：包含敏感个人身份信息 (SPII)
- `FINISH_REASON_MALFORMED_FUNCTION_CALL`：函数调用格式错误且不可解析
- `FINISH_REASON_OTHER`：其他原因
- `FINISH_REASON_UNSPECIFIED`：未指定

#### Candidate.safetyRatings `array<SafetyRating>`

安全评分数组。

- safetyRatings[].category `enum (HarmCategory)`  
  安全类别（例如：`HARM_CATEGORY_SEXUALLY_EXPLICIT`、`HARM_CATEGORY_HATE_SPEECH`、`HARM_CATEGORY_HARASSMENT`、`HARM_CATEGORY_DANGEROUS_CONTENT`）。
- safetyRatings[].probability `enum (HarmProbability)`  
  有害概率级别：`NEGLIGIBLE` / `LOW` / `MEDIUM` / `HIGH` 等。
- safetyRatings[].blocked `boolean`  
  指示模型输入或输出是否被阻止。

#### Candidate.citationMetadata `object`

引用信息（当输出包含引用时）。

- citationMetadata.citations `array<Citation>`
  - citations[].startIndex `integer`  
    引用在 `content` 中的起始位置；以 UTF-8 响应的**字节**为单位计算。
  - citations[].endIndex `integer`  
    引用在 `content` 中的结束位置；同样以字节为单位。
  - citations[].uri `string`  
    引用来源网址（官网说明字段为 url/网址；示例结构里该字段名为 `uri`）。
  - citations[].title `string`  
    引用来源标题。
  - citations[].license `string`  
    引用关联的许可。
  - citations[].publicationDate `object`  
    引用发布日期（有效格式：`YYYY` / `YYYY-MM` / `YYYY-MM-DD`）。
    - publicationDate.year `integer`
    - publicationDate.month `integer`
    - publicationDate.day `integer`

#### Candidate.avgLogprobs `double`

候选项的平均对数概率。

#### Candidate.logprobsResult `object`

返回每个步骤中排名靠前的候选 token（`topCandidates`）与实际选择的 token（`chosenCandidates`）。

- logprobsResult.topCandidates `array`
  - topCandidates[].candidates `array`
    - candidates[].token `string`：token（字符/字词/短语等）
    - candidates[].logProbability `float`：该 token 的对数概率（置信度）
- logprobsResult.chosenCandidates `array`
  - chosenCandidates[].token `string`
  - chosenCandidates[].logProbability `float`

### usageMetadata `object`

token 统计信息。

- usageMetadata.promptTokenCount `integer`  
  请求中的 token 数。
- usageMetadata.candidatesTokenCount `integer`  
  响应中的 token 数。
- usageMetadata.totalTokenCount `integer`  
  请求 + 响应的 token 总数。
- （可能出现）thoughtsTokenCount / toolUsePromptTokenCount / cachedContentTokenCount 及各模态明细。

> 注：官网补充说明——出于结算目的，Gemini 3 Pro 及更高版本模型处理“文档输入”消耗的 token 会计为图片 token。

### modelVersion `string`

用于生成的模型与版本（示例：`gemini-2.0-flash-lite-001`）。
下面是 **Vertex AI `streamGenerateContent`（SSE 流式）每个 chunk 的 Response（响应正文）**。  
**要点**：流式时会返回多个 chunk，**每个 chunk 的 JSON 结构仍是 `GenerateContentResponse`**；中间 chunk 往往 `finishReason` 为空，最后一个 chunk 才会给出 `finishReason/finishMessage` 等终止信息。

### createTime `string`

服务端接收请求时间（RFC3339 Timestamp）。

### responseId `string`

响应标识。

## Response（流式：每个 stream chunk 的响应正文）

```ts
{
  "candidates": [
    {
      "index": integer,
      "content": {
        "role": string,
        "parts": [
          {
            "thought": boolean,
            "thoughtSignature": string, // bytes(base64)
            "mediaResolution": {
              "level": enum,
              "numTokens": integer
            },

            // Union field data（以下字段同一 time 只会出现一个）
            "text": string,
            "inlineData": { "mimeType": string, "data": string, "displayName": string },
            "fileData": { "mimeType": string, "fileUri": string, "displayName": string },
            "functionCall": {
              "id": string,
              "name": string,
              "args": object,
              "partialArgs": [
                {
                  "jsonPath": string,
                  "stringValue": string,
                  "numberValue": number,
                  "boolValue": boolean,
                  "nullValue": string,
                  "willContinue": boolean
                }
              ],
              "willContinue": boolean
            },
            "functionResponse": {
              "id": string,
              "name": string,
              "response": object,
              "parts": [
                {
                  "inlineData": { /* bytes blob */ },
                  "fileData": { /* file ref */ }
                }
              ],
              "scheduling": enum,
              "willContinue": boolean
            },
            "executableCode": { "language": enum, "code": string },
            "codeExecutionResult": { "outcome": enum, "output": string },

            // Union field metadata（仅在 inlineData/fileData 为视频时）
            "videoMetadata": {
              "startOffset": string,
              "endOffset": string,
              "fps": number
            }
          }
        ]
      },
      "avgLogprobs": number,
      "logprobsResult": {
        "topCandidates": [
          {
            "candidates": [
              { "token": string, "tokenId": integer, "logProbability": number }
            ]
          }
        ],
        "chosenCandidates": [
          { "token": string, "tokenId": integer, "logProbability": number }
        ]
      },
      "finishReason": enum,
      "safetyRatings": [
        { "category": enum, "probability": enum, "blocked": boolean }
      ],
      "citationMetadata": {
        "citations": [
          {
            "startIndex": integer,
            "endIndex": integer,
            "uri": string,
            "title": string,
            "license": string,
            "publicationDate": { "year": integer, "month": integer, "day": integer }
          }
        ]
      },
      "groundingMetadata": {
        "webSearchQueries": [ string ],
        "retrievalQueries": [ string ],
        "groundingChunks": [
          {
            "web": { "uri": string, "title": string, "domain": string },
            "retrievedContext": object,
            "maps": object
          }
        ],
        "groundingSupports": [ object ],
        "sourceFlaggingUris": [ object ],
        "searchEntryPoint": { "renderedContent": string, "sdkBlob": string },
        "retrievalMetadata": { "googleSearchDynamicRetrievalScore": number },
        "googleMapsWidgetContextToken": string
      },
      "urlContextMetadata": {
        "urlMetadata": [
          { "retrievedUrl": string, "urlRetrievalStatus": enum }
        ]
      },
      "finishMessage": string
    }
  ],
  "modelVersion": string,
  "createTime": string,
  "responseId": string,
  "promptFeedback": {
    "blockReason": enum,
    "blockReasonMessage": string,
    "safetyRatings": [
      { "category": enum, "probability": enum, "blocked": boolean }
    ]
  },
  "usageMetadata": {
    "promptTokenCount": integer,
    "candidatesTokenCount": integer,
    "totalTokenCount": integer

    // （可能出现的扩展统计）
    // "cachedContentTokenCount": integer,
    // "thoughtsTokenCount": integer,
    // "toolUsePromptTokenCount": integer,
    // "promptTokensDetails": [...],
    // "candidatesTokensDetails": [...],
    // "toolUsePromptTokensDetails": [...]
  }
}
```

> `promptFeedback`：**只会在第一个 stream chunk 返回**，并且只在 **因内容违规导致没有生成任何 candidates** 时出现。  
> `finishMessage`：仅当 `finishReason` 有值时才返回。

### candidates `array<Candidate>`

本 chunk 的候选结果列表。

#### Candidate.index `integer`

候选项下标（从 0 开始）。

#### Candidate.content `object`

候选内容（多 part）。

##### content.role `string`

内容生产者角色：通常为 `'user'` 或 `'model'`。

##### content.parts `array<Part>`

内容分块数组；每个 part 是一个“单一类型”的数据块（text / inlineData / functionCall …）。

:::details Part `object`（content.parts[]）

#### Part.thought `boolean`

是否为“thought/推理过程”part。

#### Part.thoughtSignature `string(bytes)`

thought 的可复用签名（base64）。

#### Part.mediaResolution `PartMediaResolution`

输入媒体分辨率（会影响媒体 token 化）。

- mediaResolution.level `enum (PartMediaResolutionLevel)`：LOW / MEDIUM / HIGH / ULTRA_HIGH / UNSPECIFIED。
- mediaResolution.numTokens `integer`：期望媒体 token 序列长度。

#### Part.data（Union）<font color="gray">同一 part 只会出现一个</font>

##### Part.text `string`

文本内容（最常见的流式增量输出就出现在这里）。

##### Part.inlineData `Blob`

内联二进制数据（base64）。

- inlineData.mimeType `string`：IANA MIME Type。
- inlineData.data `string(bytes)`：base64 bytes。
- inlineData.displayName `string`：可选展示名（部分场景才返回）。

##### Part.fileData `FileData`

引用外部文件（如 GCS）。

- fileData.mimeType `string`：IANA MIME Type。
- fileData.fileUri `string`：文件 URI。
- fileData.displayName `string`：可选展示名。

##### Part.functionCall `FunctionCall`

模型预测的函数调用。

- functionCall.id `string`：函数调用 id（用于和 functionResponse 匹配）。
- functionCall.name `string`：函数名。
- functionCall.args `object`：函数参数（JSON object）。
- functionCall.partialArgs `array<PartialArg>`：**流式函数参数增量**（部分 API/模式可用）。
- functionCall.willContinue `boolean`：是否后续还有该 FunctionCall 的增量片段。

###### PartialArg（用于 functionCall.partialArgs）

- jsonPath `string`：指向正在增量传输的参数路径（RFC 9535）。
- stringValue / numberValue / boolValue / nullValue：本次增量的值（四选一）。
- willContinue `boolean`：该 jsonPath 是否还有后续增量。

##### Part.functionResponse `FunctionResponse`

你把工具执行结果回传给模型时用的结构（也可能在某些模式下出现在返回中）。

- functionResponse.id `string`：对应的 functionCall.id。
- functionResponse.name `string`：函数名（与 functionCall.name 匹配）。
- functionResponse.response `object`：函数返回（JSON object；约定 output/error）。
- functionResponse.parts `array<FunctionResponsePart>`：函数响应的多 part 形式（可包含文件/内联数据）。
- functionResponse.scheduling `enum (FunctionResponseScheduling)`：SILENT / WHEN_IDLE / INTERRUPT / …
- functionResponse.willContinue `boolean`：是否还有后续响应片段。

##### Part.executableCode `ExecutableCode`

模型生成、用于代码执行工具的代码。

- executableCode.language `enum (Language)`：如 PYTHON。
- executableCode.code `string`：代码字符串。

##### Part.codeExecutionResult `CodeExecutionResult`

代码执行结果。

- codeExecutionResult.outcome `enum (Outcome)`：OUTCOME_OK / OUTCOME_FAILED / OUTCOME_DEADLINE_EXCEEDED。
- codeExecutionResult.output `string`：stdout 或错误信息。

#### Part.metadata（Union）

##### Part.videoMetadata `VideoMetadata`

仅在 part 携带视频数据时使用的元信息。

- videoMetadata.startOffset `string`：起始偏移。
- videoMetadata.endOffset `string`：结束偏移。
- videoMetadata.fps `number`：帧率。

:::

### Candidate.avgLogprobs `number`

候选项平均 logprob（长度归一化）。

### Candidate.logprobsResult `LogprobsResult`

logprobs 细节。

- logprobsResult.topCandidates `array<LogprobsResultTopCandidates>`：每步 top token 列表。
  - topCandidates[].candidates `array<LogprobsResultCandidate>`：按 logProbability 降序。
- logprobsResult.chosenCandidates `array<LogprobsResultCandidate>`：每步最终采样/选择的 token。
- LogprobsResultCandidate.token / tokenId / logProbability：token、tokenId、对数概率。

### Candidate.finishReason `enum (FinishReason)`

停止生成原因；为空表示“尚未停止”。

常见取值（枚举示例）：

- `STOP` / `MAX_TOKENS` / `SAFETY` / `RECITATION` / `BLOCKLIST` / `PROHIBITED_CONTENT` / `SPII` / `MALFORMED_FUNCTION_CALL` / `OTHER` / `FINISH_REASON_UNSPECIFIED` …

### Candidate.safetyRatings `array<SafetyRating>`

候选输出的安全评分（每个 category 最多一条）。

- safetyRatings[].category `enum (HarmCategory)`：如 HATE_SPEECH / SEXUALLY_EXPLICIT / DANGEROUS_CONTENT / HARASSMENT / CIVIC_INTEGRITY …
- safetyRatings[].probability `enum (HarmProbability)`：NEGLIGIBLE / LOW / MEDIUM / HIGH …
- safetyRatings[].blocked `boolean`：是否因该 rating 被过滤。

> 另外一些 API/SDK 还会给出 probabilityScore / severity / severityScore 等更细粒度字段（不一定在所有 Vertex REST 输出中出现）。

### Candidate.citationMetadata `CitationMetadata`

引用信息。

- citationMetadata.citations `array<Citation>`
  - citations[].startIndex `integer`：引用起始位置
  - citations[].endIndex `integer`：引用结束位置
  - citations[].uri `string`：来源 URL/URI
  - citations[].title `string`：来源标题
  - citations[].license `string`：许可
  - citations[].publicationDate `{year,month,day}`：发布日期

### Candidate.groundingMetadata `GroundingMetadata`

开启 grounding 时返回的检索/证据来源信息。

- groundingMetadata.webSearchQueries `string[]`：用于 Google Search 的 query。
- groundingMetadata.retrievalQueries `string[]`：检索工具实际执行的 query。
- groundingMetadata.groundingChunks `array<GroundingChunk>`：证据片段。
  - groundingChunks[].web `{uri,title,domain}`：网页证据。
  - groundingChunks[].retrievedContext / maps：其他来源证据（对象结构依来源而定）。
- groundingMetadata.searchEntryPoint `{renderedContent,sdkBlob}`：搜索入口信息。
- groundingMetadata.retrievalMetadata `{googleSearchDynamicRetrievalScore}`：检索相关元信息。
- 以及 sourceFlaggingUris / googleMapsWidgetContextToken 等（Google Maps grounding 时出现）。

### Candidate.urlContextMetadata `UrlContextMetadata`

模型使用 `urlContext` 工具时返回的 URL 检索元数据。

- urlContextMetadata.urlMetadata `array<UrlMetadata>`：URL 列表。
  - urlMetadata[].retrievedUrl `string`：实际被检索的 URL。
  - urlMetadata[].urlRetrievalStatus `enum (UrlRetrievalStatus)`：SUCCESS / ERROR / PAYWALL / UNSAFE / UNSPECIFIED。

### Candidate.finishMessage `string`

对 `finishReason` 更详细的解释（仅在 `finishReason` 有值时返回）。

### modelVersion `string`

本次生成所用模型版本。

### createTime `string`

服务端接收请求时间（RFC3339 Timestamp）。

### responseId `string`

响应标识。

### promptFeedback `object`

Prompt 的内容过滤结果：**仅在第一个 stream chunk 且“因违规无任何 candidates”时出现**。

- promptFeedback.blockReason `enum (BlockedReason)`：阻断原因。
- promptFeedback.blockReasonMessage `string`：可读原因（不一定所有环境支持）。
- promptFeedback.safetyRatings `array<SafetyRating>`：prompt 维度安全评分。

### usageMetadata `object`

token 统计。

- usageMetadata.promptTokenCount `integer`：prompt token 数。
- usageMetadata.candidatesTokenCount `integer`：候选输出 token 总数。
- usageMetadata.totalTokenCount `integer`：总 token 数。
- （可能出现）thoughtsTokenCount / toolUsePromptTokenCount / cachedContentTokenCount 及各模态明细。

::: api-request POST /api/vertex-ai/v1

```TypeScript
import { GoogleGenAI } from "@google/genai";

const client = GoogleGenAI({
  apiKey: "$ZENMUX_API_KEY",
  vertexai: true,
  httpOptions: {
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    apiVersion: "v1",
  },
});

const response = await client.models.generateContent({
  model: "google/gemini-2.5-pro",
  contents: "How does AI work?",
});
console.log(response);
```

```Python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",
    vertexai=True,
    http_options=types.HttpOptions(
        api_version='v1',
        base_url='https://zenmux.ai/api/vertex-ai'
    ),
)

response = client.models.generate_content(
    model="google/gemini-2.5-pro",
    contents="How does AI work?"
)
print(response.text)
```

:::

::: api-response

```json
{
  "candidates": [
    {
      "content": {
        "role": "model",
        "parts": [
          {
            "text": "Of course. This is a fantastic question. Let's break down how AI works using a simple analogy and then add the technical details.\n\n### The Simple Analogy: Teaching a Child to Recognize a Cat\n\nImagine you're teaching a very young child what a \"cat\" is. You don't write down a long list of rules like \"a cat has pointy ears, four legs, a tail, and whiskers.\" Why? Because some cats have folded ears, some might be missing a leg, and a dog also fits that description.\n\nInstead, you do this:\n\n1.  **Show Examples:** You show the child hundreds of pictures. You point and say, \"That's a cat.\" \"That's also a cat.\" \"This is *not* a cat; it's a dog.\"\n2.  **Let Them Guess:** You show them a new picture and ask, \"Is this a cat?\"\n3.  **Give Feedback:** If they're right, you say \"Yes, good job!\" If they're wrong, you say \"No, that's a fox.\"\n\nOver time, the child's brain, without being told the specific rules, starts to recognize the *patterns* that make a cat a cat. They build an internal, intuitive understanding.\n\n**AI works in almost the exact same way.** It's a system designed to learn patterns from data without being explicitly programmed with rules.\n\n---\n\n### The Core Components of How AI Works\n\nNow, let's replace the child with a computer program. The process has three key ingredients:\n\n#### 1. Data (The Pictures)\n\nThis is the most critical ingredient. AI is fueled by data. For our example, this would be a massive dataset of thousands or millions of images, each one labeled by a human: \"cat,\" \"dog,\" \"hamster,\" etc.\n\n*   **More Data is Better:** The more examples the AI sees, the better it gets at identifying the patterns.\n*   **Good Data is Crucial:** The data must be accurate and diverse. If you only show it pictures of black cats, it will struggle to recognize a white cat.\n\n#### 2. Model / Algorithm (The Child's Brain)\n\nThis is the mathematical framework that learns from the data. Think of it as the \"engine\" that finds the patterns. When you hear terms like **\"Neural Network,\"** this is what they're referring to.\n\nA neural network is inspired by the human brain. It's made of interconnected digital \"neurons\" organized in layers.\n\n*   **Input Layer:** Takes in the raw data (e.g., the pixels of an image).\n*   **Hidden Layers:** This is where the magic happens. Each layer recognizes increasingly complex patterns. The first layer might learn to spot simple edges and colors. The next might combine those to recognize shapes like ears and tails. A deeper layer might combine those shapes to recognize a \"cat face.\"\n*   **Output Layer:** Gives the final answer (e.g., a probability score: \"95% chance this is a cat, 3% dog, 2% fox\").\n\n#### 3. The Training Process (Learning from Feedback)\n\nThis is where the **Model** learns from the **Data**. It's an automated version of showing pictures and giving feedback.\n\n1.  **Prediction (The Guess):** The model is given an input (an image of a cat) and makes a random guess. Early on, its internal settings are all random, so its guess will be wild—it might say \"50% car, 50% dog.\"\n2.  **Compare (Check the Answer):** The program compares its prediction to the correct label (\"cat\"). It then calculates its \"error\" or \"loss\"—a measure of how wrong it was.\n3.  **Adjust (Learn):** This is the key step. The algorithm uses a mathematical process (often called **\"backpropagation\"** and **\"gradient descent\"**) to slightly adjust the millions of internal connections in the neural network. The adjustments are tiny, but they are specifically designed to make the model's guess *less wrong* the next time it sees that same image.\n4.  **Repeat:** This process is repeated **millions or billions of times** with all the data. Each time, the model gets a little less wrong. Over many cycles, these tiny adjustments cause the network to get incredibly accurate at recognizing the patterns it's being shown.\n\nAfter training is complete, you have a **\"trained model.\"** You can now give it brand new data it has never seen before, and it will be able to make accurate predictions.\n\n---\n\n### Major Types of AI Learning\n\nWhile the above is the most common method, there are three main ways AI learns:\n\n**1. Supervised Learning (Learning with an Answer Key)**\nThis is the \"cat\" example we just used. The AI is \"supervised\" because it's trained on data that is already labeled with the correct answers.\n*   **Examples:** Spam filters (emails labeled \"spam\" or \"not spam\"), predicting house prices (houses with known prices), language translation.\n\n**2. Unsupervised Learning (Finding Patterns on its Own)**\nThis is like giving the AI a giant pile of data with *no labels* and asking it to \"find interesting patterns.\" The AI might group the data into clusters based on hidden similarities.\n*   **Examples:** Customer segmentation (finding groups of customers with similar buying habits), identifying anomalies in a computer network.\n\n**3. Reinforcement Learning (Learning through Trial and Error)**\nThis is how you train an AI to play a game or control a robot. The AI takes an action in an environment and receives a reward or a penalty. Its goal is to maximize its total reward over time.\n*   **Examples:** An AI learning to play chess (it gets a reward for winning the game), a robot learning to walk (it gets a reward for moving forward without falling), self-driving car simulations.\n\n### Summary\n\nSo, \"How does AI work?\"\n\n**At its core, modern AI is a system that learns to recognize incredibly complex patterns by processing vast amounts of data, making guesses, and correcting its errors over and over again until it becomes highly accurate.**\n\nIt's less about being \"intelligent\" in a human sense and more about being a phenomenally powerful pattern-matching machine."
          }
        ]
      },
      "finishReason": "STOP",
      "avgLogprobs": -0.4167558059635994
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 5,
    "candidatesTokenCount": 1353,
    "totalTokenCount": 2794,
    "trafficType": "ON_DEMAND",
    "promptTokensDetails": [
      {
        "modality": "TEXT",
        "tokenCount": 5
      }
    ],
    "candidatesTokensDetails": [
      {
        "modality": "TEXT",
        "tokenCount": 1353
      }
    ],
    "thoughtsTokenCount": 1436
  },
  "modelVersion": "google/gemini-2.5-pro",
  "createTime": "2026-01-29T08:40:38.791866Z",
  "responseId": "Bh17abqqMOSS4_UPqqeqoAc"
}
```

:::
