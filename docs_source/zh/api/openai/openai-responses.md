---
pageClass: api-page
title: Responses 接口（OpenAI Responses API）
head:
  - - meta
    - name: description
      content: Create a Model Response
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, openai, responses, OpenAI, Anthropic
---

# Create a Model Response

```
POST https://zenmux.ai/api/v1/responses
```

Create a Model Response 接口兼容 OpenAI 的 [Create a Model Response](https://platform.openai.com/docs/api-reference/responses/create?lang=curl) 接口，用于创建一次模型响应（支持文本/图片/文件输入；文本或结构化 JSON 输出；支持内置工具与函数调用等）。

下面列出了所有模型可能支持的参数，不同模型的支持参数有所不同，每个模型具体支持的参数请参见各模型详情页。

## Request headers

### Authorization `string` <font color="red">必填</font>

Bearer Token 鉴权

### Content-Type `string` <font color="red">必填</font>

请求内容类型，默认值为 `application/json`

## Request body

### model `string` <font color="red">必选</font>

此次推理调用的模型 ID，格式为 &lt;供应商&gt;/&lt;模型名称&gt;，如 openai/gpt-5，可以从各模型的详情页获得。。

### input `string | array` <font color="gray">可选</font>

输入给模型的内容。

#### `string`

- 作为纯文本输入（等价于一条 `user` 文本输入）。

#### `array`（Input item list：输入项数组）

数组中每个元素是一个 **Item**（上下文项），可包含消息、图片、文件、工具输出、引用等，可能的类型如下：

##### 1.Input message `object`

- type `string` <font color="gray">可选</font>：固定为 `message`
- role `string` <font color="red">必选</font>：`user` / `assistant` / `system` / `developer`
- content `string | array` <font color="red">必选</font>：消息内容
  - 若为 `string`：纯文本
  - 若为 `array`：内容分片列表（见下方 Input content parts）

:::details Input content parts（输入内容分片）可能类型

1. Input text `object`

- type `string` <font color="red">必选</font>：`input_text`
- text `string` <font color="red">必选</font>：文本内容

2. Input image `object`

- type `string`：`input_image` <font color="red">必选</font>
- detail `string`：`high` / `low` / `auto` <font color="red">必选</font>：图像处理细节级别，影响 token 消耗和识别精度
- file_id `string` <font color="gray">可选</font>：已上传文件的 ID
- image_url `string`（URL 或 data URL/base64） <font color="gray">可选</font>：图像的 URL 地址或 base64 编码

3. Input file `object`

- type `string`：`input_file` <font color="red">必选</font>
- file_data `string` <font color="gray">可选</font>：文件的 base64 编码数据
- file_id `string`<font color="gray">可选</font>：已上传文件的 ID
- file_url `string`<font color="gray">可选</font>：文件的 URL 地址
- filename `string`<font color="gray">可选</font>：文件名

:::

##### 2.Item（输入项）可能类型一览

:::details Input message（输入消息）`object`

- type `string` <font color="gray">可选</font>：固定为 `message`
- role `string` <font color="red">必选</font>：`user` / `assistant` / `system` / `developer`
- status `string` <font color="gray">可选</font>：`in_progress` / `completed` / `incomplete` 项目的状态
- content `string | array` <font color="red">必选</font>：消息内容
  - 若为 `string`：纯文本
  - 若为 `array`：内容分片列表，元素可为 `input_text` / `input_image` / `input_file`（同上）

:::

:::details Output message（模型输出消息）`object`

（当你把“模型上次输出的 message item”回填进 `input` 时会用到）

- type `string`<font color="red">必选</font>：`message`
- role `string`<font color="red">必选</font>：固定为 `assistant`
- id `string`<font color="red">必选</font>：output message 的唯一 ID
- status `string`<font color="red">必选</font>：`in_progress` / `completed` / `incomplete`
- content `array`<font color="red">必选</font>：**Output content parts** 列表（见下）

###### Output content parts（输出内容分片）可能类型

- type `string`<font color="red">必选</font>：`output_text`
- text `string`<font color="red">必选</font>：输出文本
- annotations `array`<font color="red">必选</font>：标注（见下）
- logprobs `array`<font color="red">必选</font>：logprobs（见下）

**annotations** 元素可能类型：

- File citation `object`
  - type `string`<font color="red">必选</font>：`file_citation`
  - file_id `string`<font color="red">必选</font>：引用文件的 ID
  - filename `string`<font color="red">必选</font>：引用文件的名称
  - index `integer`<font color="red">必选</font>：在文本中的起始索引位置
- URL citation `object`
  - type `string`<font color="red">必选</font>：`url_citation`
  - start_index `integer`<font color="red">必选</font>：引用在文本中的起始索引位置
  - end_index `integer`<font color="red">必选</font>：引用在文本中的结束索引位置
  - title `string`<font color="red">必选</font>：引用网页的标题
  - url `string`<font color="red">必选</font>：引用网页的 URL 地址
- Container file citation `object`
  - type `string`<font color="red">必选</font>：`container_file_citation`
  - container_id `string`<font color="red">必选</font>：容器文件的 ID
  - file_id `string`<font color="red">必选</font>：实际引用文件的 ID
  - filename `string`<font color="red">必选</font>：引用文件的名称
  - start_index `integer`<font color="red">必选</font>：引用在文本中的起始索引位置
  - end_index `integer`<font color="red">必选</font>：引用在文本中的结束索引位置
- File path `object`
  - type `string`<font color="red">必选</font>：`file_path`
  - file_id `string`<font color="red">必选</font>：文件的 ID
  - index `integer`<font color="red">必选</font>：文件在列表中的索引位置

**logprobs**（每个元素为一个 token 的 logprob 信息，字段层级如下）：

- bytes `array`<font color="red">必选</font>：token 的字节表示
- logprob `number`<font color="red">必选</font>：token 的对数概率值
- token `string`<font color="red">必选</font>：token 的文本内容
- top_logprobs `array`<font color="red">必选</font>：最可能的候选 token 列表（每个元素含 `bytes` / `logprob` / `token`）

2. Refusal `object`

- type `string`<font color="red">必选</font>：`refusal`
- refusal `string`<font color="red">必选</font>：模型拒绝回答的原因说明

:::

:::details Function tool call（函数工具调用）`object`

模型发起对 **function tool** 的调用

- type `string`：`function_call` <font color="red">必选</font>
- call_id `string` <font color="red">必选</font>：函数调用的唯一标识符
- name `string` <font color="red">必选</font>：要调用的函数名称
- arguments `string` <font color="red">必选</font>：JSON 格式的函数参数字符串
- id `string` <font color="gray">可选</font>：调用项的唯一 ID
- status `string` <font color="gray">可选</font>：调用状态，`in_progress` / `completed` / `incomplete`

:::

:::details Function tool call output（函数工具输出回传）`object`

把你执行函数后的结果回传给模型（用于下一步推理）。

- type `string`：`function_call_output` <font color="red">必选</font>
- call_id `string`<font color="red">必选</font>：对应函数调用的唯一标识符
- output `string | array` <font color="red">必选</font>：函数执行结果，可以是字符串或内容列表
- id `string` <font color="gray">可选</font>：输出项的唯一 ID
- status `string` <font color="gray">可选</font>：输出状态，`in_progress` / `completed` / `incomplete`

> `output` 为 `array` 时，元素可为 `input_text` / `input_image` / `input_file`（同上）。

:::

:::details Custom tool call（自定义工具调用）`object`

模型发起对“自定义工具”的调用（你侧需要执行）。

- type `string`：`custom_tool_call`<font color="red">必选</font>
- call_id `string`<font color="red">必选</font>：自定义工具调用的唯一标识符
- name `string`<font color="red">必选</font>：要调用的自定义工具名称
- input `string`<font color="red">必选</font>：传递给工具的输入参数
- id `string` <font color="gray">可选</font>：调用项的唯一 ID

:::

:::details Custom tool call output（自定义工具输出回传）`object`

把自定义工具执行结果回传给模型。

- type `string`：`custom_tool_call_output`<font color="red">必选</font>
- call_id `string`<font color="red">必选</font>：对应自定义工具调用的唯一标识符
- output `string | array`<font color="red">必选</font>：工具执行结果，可以是字符串或内容列表
- id `string`<font color="gray">可选</font>：输出项的唯一 ID

> `output` 为 `array` 时，元素可为 `input_text` / `input_image` / `input_file`（同上）。

:::

:::details Web search tool call（网页搜索工具调用）`object`

- type `string`<font color="red">必选</font>：`web_search_call`
- id `string`<font color="red">必选</font>：web search tool call 的唯一 ID
- status `string`<font color="red">必选</font>
- action `object`<font color="red">必选</font>：描述本次 web 工具“具体做了什么动作”（search/open_page/find）

###### action 可能类型

1. Search action `object`

- type `string`<font color="red">必选</font>：动作类型，固定为`search`
- query `string`<font color="red">必选</font>：搜索查询（已标记为废弃）
- queries `array`<font color="gray">可选</font>：搜索查询列表
- sources `array`<font color="gray">可选</font>：搜索来源列表
  - 每个 source：
    - type `string`<font color="red">必选</font>：`url`
    - url `string`<font color="red">必选</font>：来源 URL 地址

2. Open page action `object`

- type `string`<font color="red">必选</font>：动作类型，固定为`open_page`
- url `string`<font color="red">必选</font>：要打开的网页 URL

3. Find action `object`

- type `string`<font color="red">必选</font>：动作类型，固定为`find`
- url `string`<font color="red">必选</font>：要搜索的页面 URL
- pattern `string`<font color="red">必选</font>：搜索模式或关键词

:::

<!-- :::details File search tool call（文件搜索工具调用）`object`

- type `string`<font color="red">必选</font>：`file_search_call`
- id `string`<font color="red">必选</font>：文件搜索工具调用的唯一 ID
- queries `array`<font color="red">必选</font>：搜索查询字符串列表
- status `string`<font color="red">必选</font>：搜索状态，`in_progress` / `searching` / `incomplete` / `failed`
- results `array`<font color="gray">可选</font>：搜索结果列表

###### results 元素结构 `object`

- attributes `map`<font color="gray">可选</font>：文件的元数据键值对（最多 16 对）
- file_id `string`<font color="gray">可选</font>：搜索到的文件 ID
- filename `string`<font color="gray">可选</font>：搜索到的文件名
- score `number`<font color="gray">可选</font>：相关性评分，范围 0~1，1 表示完全匹配
- text `string`<font color="gray">可选</font>：从文件中检索到的相关文本片段

::: -->

:::details Computer tool call（Computer Use 调用）`object`

模型发起一次 Computer Use 动作（你侧需要执行），执行完再用 `computer_call_output` 回传截图等结果。

- type `string`<font color="red">必选</font>：`computer_call`
- call_id `string` <font color="red">必选</font>：计算机使用调用的唯一标识符
- action `object` <font color="red">必选</font>：具体的计算机操作动作参数（见下方 Action types）
- pending_safety_checks `array` <font color="gray">可选</font>：待用户确认的安全检查列表
  - id `string` <font color="gray">可选</font>：安全检查的唯一标识符
  - code `string` <font color="gray">可选</font>：安全检查的代码标识
  - message `string` <font color="gray">可选</font>：安全检查的提示消息内容
- id `string` <font color="gray">可选</font>：调用项的唯一标识符
- status `string` <font color="gray">可选</font>：调用状态，`in_progress`（进行中）/ `completed`（已完成）/ `incomplete`（未完成）

###### Action types（`action` 动作参数）可能类型一览

###### Click（单击）`object`

- type `string`：`click` <font color="red">必选</font>：动作类型，固定为`click`
- x `number` <font color="red">必选</font>：点击位置的 X 坐标（像素）
- y `number` <font color="red">必选</font>：点击位置的 Y 坐标（像素）
- button `string` <font color="gray">可选</font>：鼠标按键类型，`left`（左键）/ `right`（右键）/ `middle`（中键）

###### Double click（双击）`object`

- type `string`：`double_click` <font color="red">必选</font>：动作类型，固定为`double_click`
- x `integer` <font color="red">必选</font>：双击位置的 X 坐标（像素）
- y `integer` <font color="red">必选</font>：双击位置的 Y 坐标（像素）

###### Move（移动鼠标）`object`

- type `string`：`move` <font color="red">必选</font>：动作类型，固定为`move`
- x `integer` <font color="red">必选</font>：目标位置的 X 坐标（像素）
- y `integer` <font color="red">必选</font>：目标位置的 Y 坐标（像素）

###### Screenshot `object`

- type `screenshot`：`screenshot` <font color="red">必选</font>：动作类型，固定为`screenshot`

###### Drag（拖拽）`object`

- type `string`：`drag` <font color="red">必选</font>：动作类型，固定为`drag`
- path `array` <font color="red">必选</font>：拖拽路径的坐标点列表
  - x `integer` <font color="red">必选</font>：路径点的 X 坐标（像素）
  - y `integer` <font color="red">必选</font>：路径点的 Y 坐标（像素）

###### Scroll（滚动）`object`

- type `string`：`scroll` <font color="red">必选</font>：动作类型，固定为`scroll`
- x `integer` <font color="gray">可选</font>：滚动锚点的 X 坐标（像素，部分实现提供）
- y `integer` <font color="gray">可选</font>：滚动锚点的 Y 坐标（像素）
- scroll_x `integer` <font color="gray">可选</font>：水平滚动距离（像素）
- scroll_y `integer` <font color="gray">可选</font>：垂直滚动距离（像素）

###### Type（输入文本）`object`

- type `string`：`type` <font color="red">必选</font>：动作类型，固定为`type`
- text `string` <font color="red">必选</font>：要输入的文本内容

###### Keypress（按键/组合键）`object`

- type `string`：`keypress` <font color="red">必选</font>：动作类型，固定为`keypress`
- keys `array` <font color="red">必选</font>：要按下的按键组合，如 `["CTRL","L"]` 表示 Ctrl+L

###### Wait（等待）`object`

- type `string`：`wait` <font color="red">必选</font>：动作类型，固定为`wait`

:::

:::details Computer tool call output（Computer Use 输出回传）`object`

- type `string`<font color="red">必选</font>：`computer_call_output`
- call_id `string`<font color="red">必选</font>：对应计算机使用调用的唯一标识符
- output `object`：计算机操作的输出结果（如截图等）
  - type `string`：`computer_screenshot`：输出类型，固定为计算机截图
  - file_id `string`<font color="gray">可选</font>：截图文件的唯一标识符 ID
  - image_url `string`<font color="gray">可选</font>：截图的 URL 访问地址
- acknowledged_safety_checks `array`<font color="gray">可选</font>：已确认的安全检查列表
  - id `string`<font color="gray">可选</font>：已确认安全检查的唯一标识符
  - code `string`<font color="gray">可选</font>：已确认安全检查的代码标识
  - message `string`<font color="gray">可选</font>：已确认安全检查的提示消息
- id `string`<font color="gray">可选</font>：输出项的唯一标识符
- status `string`<font color="gray">可选</font>：输出状态，如`completed`（已完成）/ `failed`（失败）

:::

<!-- :::details Code interpreter tool call（代码解释器调用）`object`

- type `string`<font color="red">必选</font>：`code_interpreter_call`
- id `string`<font color="red">必选</font>：代码解释器调用的唯一 ID
- container_id `string`<font color="red">必选</font>：代码运行的容器环境 ID
- code `string`<font color="red">必选</font>：要执行的代码内容（可能为 null）
- outputs `array`<font color="red">必选</font>：代码执行的输出结果列表（可能为 null）
  - Logs `object`
    - type `string`<font color="red">必选</font>：`logs`
    - logs `string`<font color="red">必选</font>：代码执行产生的日志输出
  - Image `object`
    - type `string`<font color="red">必选</font>：`image`
    - url `string`<font color="red">必选</font>：生成的图片 URL 地址
- status `string`<font color="red">必选</font>：调用状态，`in_progress` / `completed` / `incomplete` / `interpreting` / `failed`

::: -->

<!-- :::details Image generation call（图片生成调用）`object`

- type `string`<font color="red">必选</font>：`image_generation_call`
- id `string`<font color="red">必选</font>：图片生成调用的唯一 ID
- result `string`<font color="red">必选</font>：生成的图片数据（base64 编码格式）
- status `string`<font color="red">必选</font>：调用状态，如`in_progress` / `completed` / `failed`

::: -->

:::details Local shell call（本地 shell 调用）`object`

- type `string`<font color="red">必选</font>：`local_shell_call`
- id `string`<font color="red">必选</font>：本地 shell 调用的唯一 ID
- call_id `string`<font color="red">必选</font>：调用的关联 ID
- status `string`<font color="red">必选</font>：调用状态，如`in_progress` / `completed` / `failed`
- action `object`<font color="red">必选</font>：具体的 shell 执行动作
  - type `string`<font color="red">必选</font>：`exec`
  - command `array`<font color="red">必选</font>：要执行的命令参数列表（数组形式）
  - env `map`<font color="red">必选</font>：命令执行的环境变量键值对
  - timeout_ms `integer`<font color="gray">可选</font>：命令执行的超时时间（毫秒）
  - user `string`<font color="gray">可选</font>：执行命令的系统用户
  - working_directory `string`<font color="gray">可选</font>：命令执行的工作目录路径

:::

:::details Local shell call output `object`

- type `string`<font color="red">必选</font>：`local_shell_call_output`
- id `string`<font color="red">必选</font>：输出项的唯一 ID
- output `string`<font color="red">必选</font>：命令执行结果的 JSON 字符串格式输出
- status `string`<font color="gray">可选</font>：输出状态，如`completed` / `failed`

:::

:::details Shell tool call `object`

- type `string`<font color="red">必选</font>：`shell_call`
- call_id `string`<font color="red">必选</font>：shell 调用的唯一标识符
- id `string`<font color="gray">可选</font>：调用项的唯一 ID
- status `string`<font color="gray">可选</font>：调用状态，`in_progress` / `completed` / `incomplete`
- action `object`<font color="red">必选</font>：shell 命令执行配置
  - commands `array`<font color="red">必选</font>：按顺序执行的 shell 命令列表
  - max_output_length `integer`<font color="gray">可选</font>：捕获输出的最大字符数限制（stdout+stderr UTF-8）
  - timeout_ms `integer`<font color="gray">可选</font>：命令执行的超时时间（毫秒）

:::

:::details Shell tool call output `object`

- type `string`<font color="red">必选</font>：`shell_call_output`
- call_id `string`<font color="red">必选</font>：对应 shell 调用的唯一标识符
- id `string`<font color="gray">可选</font>：输出项的唯一标识符
- max_output_length `integer`<font color="gray">可选</font>：输出内容的最大字符数限制
- output `array`<font color="red">必选</font>：命令执行的输出块列表，每个元素包含：
  - stdout `string`<font color="red">必选</font>：标准输出内容
  - stderr `string`<font color="red">必选</font>：标准错误输出内容
  - outcome `object`<font color="red">必选</font>：命令执行结果状态（联合类型）
    - Timeout outcome `object`
      - type `string`<font color="red">必选</font>：`timeout`：命令执行超时
    - Exit outcome `object`
      - type `string`<font color="red">必选</font>：`exit`：命令正常退出
      - exit_code `integer`<font color="red">必选</font>

:::

:::details Apply patch tool call（补丁应用调用）`object`

用于通过 diff patch 创建/删除/更新文件。

- type `string`<font color="red">必选</font>：`apply_patch_call`
- call_id `string`<font color="red">必选</font>：补丁应用调用的唯一标识符
- id `string`<font color="gray">可选</font>：调用项的唯一标识符
- status `string`<font color="red">必选</font>：调用状态，`in_progress`（进行中）/ `completed`（已完成）
- operation `object`<font color="red">必选</font>：具体的文件操作（联合类型，包含创建/删除/更新）

###### operation 可能类型

1. Create file `object`

- type `string`<font color="red">必选</font>：`create_file`
- path `string`<font color="red">必选</font>：相对于工作区根目录的文件路径
- diff `string`<font color="red">必选</font>：统一格式的 diff 补丁内容

2. Delete file `object`

- type `string`<font color="red">必选</font>：`delete_file`
- path `string`<font color="red">必选</font>：要删除的文件路径

3. Update file `object`

- type `string`<font color="red">必选</font>：`update_file`
- path `string`<font color="red">必选</font>：要更新的文件路径
- diff `string`<font color="red">必选</font>：统一格式的 diff 补丁内容

:::

:::details Apply patch tool call output `object`

- type `string`<font color="red">必选</font>：`apply_patch_call_output`
- call_id `string`<font color="red">必选</font>：对应补丁应用调用的唯一标识符
- id `string`<font color="gray">可选</font>：输出项的唯一标识符
- status `string`<font color="red">必选</font>：输出状态，`completed`（已完成）/ `failed`（失败）
- output `string`<font color="gray">可选</font>：补丁应用的日志信息或错误描述文本

:::

:::details MCP list tools `object`

- type `string`<font color="red">必选</font>：`mcp_list_tools`
- id `string`<font color="red">必选</font>：MCP 工具列表调用的唯一标识符
- server_label `string`<font color="red">必选</font>：MCP 服务器的标签名称
- error `string`<font color="gray">可选</font>：获取工具列表时的错误信息（如果有）
- tools `array`<font color="red">必选</font>：可用工具列表，每个元素包含：
  - name `string`<font color="red">必选</font>：工具名称
  - description `string`<font color="gray">可选</font>：工具功能描述
  - annotations `object`<font color="gray">可选</font>：工具的附加注解信息
  - input_schema `object`<font color="red">必选</font>：工具输入参数的 JSON Schema 定义

:::

:::details MCP approval request `object`

- type `string`<font color="red">必选</font>：`mcp_approval_request`
- id `string`<font color="red">必选</font>：审批请求的唯一标识符 ID
- server_label `string`<font color="red">必选</font>：MCP 服务器的标签名称
- name `string`<font color="red">必选</font>：请求运行的工具名称
- arguments `string`<font color="red">必选</font>：工具参数的 JSON 格式字符串

:::

:::details MCP approval response `object`

- type `string`<font color="red">必选</font>：`mcp_approval_response`
- approval_request_id `string`<font color="red">必选</font>：对应的审批请求唯一标识符
- approve `boolean`<font color="red">必选</font>：是否批准工具调用（true=批准，false=拒绝）
- id `string`<font color="gray">可选</font>：响应项的唯一标识符
- reason `string`<font color="gray">可选</font>：批准或拒绝的原因说明

:::

:::details MCP tool call `object`

- type `string`<font color="red">必选</font>：`mcp_call`
- id `string`<font color="red">必选</font>：MCP 工具调用的唯一标识符
- server_label `string`<font color="red">必选</font>：MCP 服务器的标签名称
- name `string`<font color="red">必选</font>：要调用的工具名称
- arguments `string`<font color="red">必选</font>：工具参数的 JSON 格式字符串
- approval_request_id `string`<font color="gray">可选</font>：关联的审批请求 ID（用于后续审批响应）
- output `string`<font color="gray">可选</font>：工具执行后的输出结果
- error `string`<font color="gray">可选</font>：工具执行的错误信息
- status `string`<font color="gray">可选</font>：调用状态，`in_progress`（进行中）/ `completed`（已完成）/ `incomplete`（不完整）/ `calling`（调用中）/ `failed`（失败）

:::

:::details Reasoning（推理项）`object`

- type `string`<font color="red">必选</font>：`reasoning`
- id `string`<font color="red">必选</font>：推理内容的唯一标识符 ID
- summary `array`<font color="red">必选</font>：推理摘要内容列表
  - Summary text `object`
    - type `string`<font color="red">必选</font>：`summary_text`
    - text `string`<font color="red">必选</font>：推理摘要的具体文本内容
- content `array`<font color="gray">可选</font>：完整推理文本内容列表
  - Reasoning text `object`
    - type `string`<font color="red">必选</font>：`reasoning_text`
    - text `string`<font color="red">必选</font>：完整推理过程的具体文本内容
- encrypted_content `string`<font color="gray">可选</font>：加密的完整推理内容（需要 include 参数启用）
- status `string`<font color="gray">可选</font>：推理状态，`in_progress`（进行中）/ `completed`（已完成）/ `incomplete`（未完成）

:::

:::details Compaction item（压缩项）`object`

由 `v1/responses/compact` 生成，用于把长对话压缩成不透明加密摘要，并可回填进后续 `input`。

- type `string`<font color="red">必选</font>：`compaction`
- id `string`<font color="gray">可选</font>：compaction item ID
- encrypted_content `string`<font color="red">必选</font>：压缩摘要（加密、不透明）

:::

##### 3.Item reference（引用既有项）`object`

用于引用某个已有 item（内部标识）。

- type `string`<font color="red">必选</font>：`item_reference`
- id `string`<font color="gray">可选</font>

### instructions `string` <font color="gray">可选</font>

插入到上下文中的 system/developer 指令；与 `previous_response_id` 同用时，不会继承上一轮的 instructions，便于替换系统提示词。

### previous_response_id `string` <font color="gray">可选</font>

上一轮 Response 的 ID，用于多轮对话续接；**不能与 `conversation` 同时使用**。

### conversation `string | object` <font color="gray">可选</font>（默认 `null`）

将本次响应关联到某个 conversation；conversation 的 items 会被前置到本次输入上下文中，并在本次完成后自动追加本次 input/output 到该 conversation。

- Conversation ID `string`：conversation 的唯一 ID，用于标识和复用对话历史
- Conversation object `object`
  - id `string`<font color="red">必选</font>：conversation 的唯一 ID，用于持久化存储和检索对话

### prompt `object` <font color="gray">可选</font>

引用一个 prompt 模板并传入变量。

- id `string` <font color="red">必选</font>：prompt 模板 ID，用于标识要使用的模板
- variables `object`<font color="gray">可选</font>：模板变量的键值对，用于动态替换模板中的占位符
- version `string`<font color="gray">可选</font>：prompt 模板的版本号，用于指定模板的特定版本

### include `array` <font color="gray">可选</font>

指定在响应中额外包含的输出数据。支持的值包括（字符串枚举）：

- `web_search_call.action.sources`：包含网页搜索调用的来源信息
<!-- - `code_interpreter_call.outputs`：包含代码解释器调用的输出结果 -->
- `computer_call_output.output.image_url`：包含计算机使用工具输出的截图 URL
<!-- - `file_search_call.results`：包含文件搜索调用的搜索结果 -->
- `message.input_image.image_url`：包含输入消息中图片的 URL
- `message.output_text.logprobs`：包含输出文本中每个 token 的对数概率
- `reasoning.encrypted_content`：包含加密的推理内容

### max_output_tokens `integer` <font color="gray">可选</font>

限制本次响应可生成的 token 上限（包含可见输出 token 与 reasoning tokens）。

### max_tool_calls `integer` <font color="gray">可选</font>

限制本次响应内可处理的**内置工具**调用总次数（跨工具累计）。

### parallel_tool_calls `boolean` <font color="gray">可选</font>（默认 `true`）

是否允许并行工具调用。

### reasoning `object` <font color="gray">可选</font>（仅推理模型）

推理模型配置项。

- effort `string` <font color="gray">可选</font>（默认 `medium`）  
  控制推理过程的强度级别，影响推理深度和计算时间。支持：`none` / `minimal` / `low` / `medium` / `high` / `xhigh`
- summary `string` <font color="gray">可选</font>  
  推理摘要级别：`auto` / `concise` / `detailed`
- generate_summary `string`（Deprecated）  
  已废弃：建议用 `summary` 替代

### text `object` <font color="gray">可选</font>

文本输出相关配置（包括结构化输出格式）。

- format `object` <font color="gray">可选</font>：指定输出格式（默认 `{ "type": "text" }`）  
  可能类型：
  1. Text `object`
     - type `string`<font color="red">必选</font>：`text`：普通文本输出格式

  2. JSON schema `object`（Structured Outputs）
     - type `string`<font color="red">必选</font>：`json_schema`：结构化 JSON 输出格式
     - name `string`<font color="red">必选</font>：输出格式的名称标识符
     - schema `object`<font color="red">必选</font>：定义输出结构的 JSON Schema
     - description `string` <font color="gray">可选</font>：输出格式的描述说明
     - strict `boolean` <font color="gray">可选</font>（默认 `false`）：是否严格按 schema 输出，true 时强制验证

  3. JSON object `object`（旧 JSON mode）
     - type `string`<font color="red">必选</font>：`json_object`：JSON 对象输出格式

- verbosity `string` <font color="gray">可选</font>（默认 `medium`）  
  限制模型回应的详细程度。数值越低，回应越简洁；数值越高，回应越详尽。目前支持的参数值：`low` / `medium` / `high`

### temperature `number` <font color="gray">可选</font>（默认 `1`）

采样温度，范围通常为 0~2；建议与 `top_p` 二选一调节。

### top_p `number` <font color="gray">可选</font>（默认 `1`）

核采样参数。

### top_logprobs `integer` <font color="gray">可选</font>

0~20，指定每个位置返回最可能 token 的个数。

### truncation `string` <font color="gray">可选</font>（默认 `disabled`）

上下文截断策略，用于处理超出模型上下文窗口的情况：

- `auto`：当内容超过上下文窗口时，自动从对话开头丢弃最早的 items 以腾出空间
- `disabled`：禁用自动截断，超过上下文窗口时请求将失败（返回 400 错误）

### tools `array` <font color="gray">可选</font>

声明本次请求允许模型调用的工具列表，模型可以根据需要选择调用这些工具来增强其能力。

#### tools[i] 可能类型

以下是支持的工具类型定义，每种工具都有特定的配置参数：

:::details Function tool（函数工具定义）`object`

- type `string`<font color="red">必选</font>：`function`：工具类型，固定为函数工具
- name `string`<font color="red">必选</font>：函数的唯一名称标识符
- parameters `object`<font color="red">必选</font>：函数参数的 JSON Schema 定义，描述参数结构和验证规则
- strict `boolean`<font color="red">必选</font>（默认 `true`）：是否严格验证参数，true 时严格按照 schema 验证
- description `string` <font color="gray">可选</font>：函数功能的详细描述，帮助模型理解何时使用该函数

:::

<!-- :::details File search （文件搜索）`object`

- type `string`<font color="red">必选</font>：`file_search`
- vector_store_ids `array[string]`<font color="red">必选</font>：要搜索的向量存储 ID 列表
- filters `object` <font color="gray">可选</font>：搜索结果的过滤条件
  - Comparison Filter `object`：比较过滤器
    - key `string`<font color="red">必选</font>：要过滤的元数据字段名
    - type `string`<font color="red">必选</font>：`eq` / `ne` / `gt` / `gte` / `lt` / `lte` / `in` / `nin`：比较操作符
    - value `string | number | boolean | array`<font color="red">必选</font>：要比较的值
  - Compound Filter `object`：复合过滤器
    - filters `array[ComparisonFilter | CompoundFilter]`<font color="red">必选</font>：子过滤器列表
    - type `string`<font color="red">必选</font>：`and` / `or`：逻辑操作符
- max_num_results `integer` <font color="gray">可选</font>（1~50）：返回结果的最大数量限制
- ranking_options `object` <font color="gray">可选</font>：搜索结果的排序选项
  - hybrid_search `object` <font color="gray">可选</font>：混合搜索权重配置
    - embedding_weight `number`<font color="red">必选</font>：向量嵌入的权重
    - text_weight `number`<font color="red">必选</font>：文本匹配的权重
  - ranker `string` <font color="gray">可选</font>：使用的排序算法名称

::: -->

:::details Web search（网页搜索，一般可用版本）`object`

- type `string` <font color="red">必选</font>：`web_search` 或 `web_search_2025_08_26`
- filters `object` <font color="gray">可选</font>：搜索结果的过滤条件
  - allowed_domains `array[string]` <font color="gray">可选</font>（默认 `[]`）：允许的域名白名单（允许子域）
- search_context_size `string` <font color="gray">可选</font>（默认 `medium`）：搜索上下文的大小级别
- user_location `object` <font color="gray">可选</font>：用户大致位置信息，用于本地化搜索结果
  - type `string` <font color="red">必选</font>：`approximate`：位置类型，固定为大致位置
  - city `string` <font color="gray">可选</font>：城市名称
  - country `string` <font color="gray">可选</font>：两位 ISO（如 `US`）：国家代码
  - region `string` <font color="gray">可选</font>：地区/州代码
  - timezone `string` <font color="gray">可选</font>：IANA TZ（如 `America/Los_Angeles`）：时区标识符

:::

:::details Web search preview（网页搜索预览版）`object`

- type `string`<font color="red">必选</font>：`web_search_preview` 或 `web_search_preview_2025_03_11`
- search_context_size `string` <font color="gray">可选</font>：`low` / `medium` / `high`：搜索上下文的大小级别
- user_location `object` <font color="gray">可选</font>：用户地理位置信息
  - type `string`<font color="red">必选</font>：`approximate`：位置类型，固定为大致位置
  - city `string` <font color="gray">可选</font>：城市名称
  - country `string` <font color="gray">可选</font>（两位 ISO）：国家代码
  - region `string` <font color="gray">可选</font>：地区/州代码
  - timezone `string` <font color="gray">可选</font>（IANA TZ）：时区标识符

:::

:::details Computer use preview（Computer Use 工具）`object`

- type `string` <font color="red">必选</font>：`computer_use_preview`
- display_width `integer` <font color="red">必选</font>：显示区域宽度（像素）
- display_height `integer` <font color="red">必选</font>：显示区域高度（像素）
- environment `string` <font color="red">必选</font>：环境类型（如 `browser` / `mac` / `windows` / `ubuntu`）

:::

<!-- :::details Code interpreter（代码解释器）`object`

- type `string`<font color="red">必选</font>：`code_interpreter`
- container `string | object`<font color="red">必选</font>：代码执行容器配置
  - `string`：现有容器的 ID
  - `object`：新容器的配置对象
    - type `string`<font color="red">必选</font>：`auto`：容器类型，固定为自动
    - file_ids `array` <font color="gray">可选</font>：关联的文件 ID 列表
    - memory_limit `string` <font color="gray">可选</font>：容器的内存限制

::: -->

:::details Apply patch tool（补丁应用）`object`

- type `string`<font color="red">必选</font>：`apply_patch`

:::

:::details MCP tool（远程 MCP 工具）`object`（若启用）

- type `string` <font color="red">必选</font>：`mcp`
- server_label `string` <font color="red">必选</font>：该 MCP server 的标签（用于 tool call 路由）
- server_url `string` <font color="gray">可选</font>：远程 MCP server
- authorization `string` <font color="gray">可选</font>：OAuth access token（用于 remote MCP server 或服务连接器）
- allowed_tools `array[string] | object` <font color="gray">可选</font>：允许模型调用的工具集合或过滤器
  - **MCP allowed tools** `array[string]`
  - **MCP tool filter** `object`
    - read_only `boolean` <font color="gray">可选</font>：按工具是否只读筛选
    - tool_names `array[string]` <font color="gray">可选</font>：按工具名白名单筛选
- require_approval `string | object` <font color="gray">可选</font>：哪些工具需要审批（示例里为 `never`；也支持更细粒度
  - `string`：`always` / `never`
  - `object`：approval filter（结构见文档片段）

:::

<!--
:::details Image generation（图片生成）`object`

- type `string` <font color="red">必选</font>：`image_generation`
- size `string` <font color="gray">可选</font>：如 `1024x1024` / `1024x1536` / `1536x1024` / `auto`：生成图像的尺寸规格
- quality `string` <font color="gray">可选</font>：`low` / `medium` / `high` / `auto`：生成图像的质量级别
- background `string` <font color="gray">可选</font>：`transparent` / `opaque` / `auto`（透明背景通常配合 png/webp）：背景处理方式
- output_format `string` <font color="gray">可选</font>：输出格式（如 `png` / `jpeg` / `webp`，以图像文档为准）：输出图像的文件格式
- output_compression `integer` <font color="gray">可选</font>：JPEG/WebP 压缩（0~100）：压缩质量
- partial_images `integer` <font color="gray">可选</font>：流式 partial images 张数（文档示例为 1~3）：流式生成时的部分图像数量
- action `string` <font color="gray">可选</font>：`auto` / `generate` / `edit`（某些模型/场景支持）：图像操作类型
- input_image_mask `object` <font color="gray">可选</font>：用于编辑/局部重绘的 mask（示例：用 `file_id`）：遮罩配置
  - file_id `string` <font color="gray">可选</font>：遮罩图像的文件 ID

::: -->

:::details Shell tool（通用 Shell）`object`

- type `string` <font color="red">必选</font>：`shell`

（同样一般不需要额外配置；执行参数在模型输出的 `shell_call.action` 里。）

:::

:::details Local shell tool（旧版本地 Shell）`object`

- type `string` <font color="red">必选</font>：`local_shell`

（官方提示 local shell 已偏旧，新用例更推荐 `shell`。）

:::

:::details Custom tool（自定义工具定义，非 function 的“自由输入/可约束格式”）`object`

- type `string` <font color="red">必选</font>：`custom`
- name `string` <font color="red">必选</font>：工具名
- description `string` <font color="gray">可选</font>：工具描述
- format `object` <font color="gray">可选</font>：输入格式（默认是自由文本）
  - **Text format** `object`
    - type `string` <font color="red">必选</font>：`text`
  - **Grammar format** `object`
    - type `string` <font color="red">必选</font>：`grammar`
    - syntax `string` <font color="red">必选</font>：`lark` / `regex`
    - definition `string` <font color="red">必选</font>：语法定义

:::

### tool_choice `string | object` <font color="gray">可选</font>

控制模型如何选择/是否必须调用工具。

:::details Tool choice mode `string`

- `none`：不调用工具
- `auto`：模型自行决定
- `required`：必须调用 ≥1 个工具

:::

:::details Allowed tools `object`

- type `string`<font color="red">必选</font>：`allowed_tools`
- mode `string`<font color="red">必选</font>：`auto` / `required`
- tools `array`<font color="red">必选</font>：允许的工具集合（示例：`{ "type":"function","name":"get_weather" }` 等

:::

:::details Hosted tool（强制使用某个内置工具）`object`

- type `string`<font color="red">必选</font>：以下之一
  <!-- `file_search`  -->
  / `web_search_preview` / `computer_use_preview` /
  <!-- `code_interpreter`  -->
  <!-- / `image_generation` -->

:::

:::details Function tool（强制调用某个函数）`object`

- type `string`<font color="red">必选</font>：`function`
- name `string`<font color="red">必选</font>

:::

:::details MCP tool（强制调用某 MCP 工具）`object`

- type `string`<font color="red">必选</font>：`mcp`
- server_label `string`<font color="red">必选</font>
- name `string`<font color="gray">可选</font>

:::

:::details Custom tool（强制调用某自定义工具）`object`

- type `string`<font color="red">必选</font>：`custom`
- name `string`<font color="red">必选</font>

:::

:::details Specific apply patch tool choice（强制模型调用 apply_patch 工具） `object`

- type `string`<font color="red">必选</font>：`apply_patch`

:::

:::details Specific shell tool choice（强制模型在需要工具调用时调用 Shell 工具） `object`

- type `string`<font color="red">必选</font>：`shell`

:::

<!-- ### background `boolean` <font color="gray">可选</font>（默认 `false`）

是否后台运行本次响应。 -->

### store `boolean` <font color="gray">可选</font>（默认 `true`）

是否存储本次 Response 以便后续检索。

### stream `boolean` <font color="gray">可选</font>（默认 `false`）

是否启用 SSE 流式输出。

### stream_options `object` <font color="gray">可选</font>（默认 `null`）

流式响应选项。仅当 `stream: true` 时使用。

- include_usage `boolean` <font color="gray">可选</font>：是否在流式输出中包含 usage 信息

<!-- ### metadata `object(map)` <font color="gray">可选</font>

最多 16 个键值对元数据（key ≤ 64 字符；value ≤ 512 字符）。 -->

### prompt_cache_key `string` <font color="gray">可选</font>

用于提升缓存命中率的 key（用于替代旧的 `user` 字段）。

### prompt_cache_retention `string` <font color="gray">可选</font>

提示词缓存保留策略（例如 `24h`）。

### safety_identifier `string` <font color="gray">可选</font>

用于风控/滥用检测的稳定用户标识（建议哈希化）。

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

<!-- ### service_tier `string` <font color="gray">可选</font>（默认 `auto`）

请求服务层级（如 `auto` / `default` / `flex` / `priority` 等）。 -->

<!-- ### user `string`（Deprecated）<font color="gray">可选</font>

已废弃，建议使用 `safety_identifier` 与 `prompt_cache_key`。 -->

### 不支持字段

| 字段名                       | 类型        | 是否支持                                            | 说明                                                                                  |
| ---------------------------- | ----------- | --------------------------------------------------- | ------------------------------------------------------------------------------------- |
| service_tier                 | string      | <span style="white-space: nowrap;">❌ 不支持</span> | 服务等级                                                                              |
| user                         | string      | ❌ 不支持                                           | 旧版的用户标识字段，现已由 `safety_identifier` 和 `prompt_cache_key` 接替其主要作用。 |
| background                   | boolean     | ❌ 不支持                                           | 是否后台运行本次响应                                                                  |
| metadata                     | object(map) | ❌ 不支持                                           | 最多 16 个键值对元数据                                                                |
| tools(Code interpreter)      | object      | ❌ 不支持                                           | 代码解释器                                                                            |
| tools(Image generation tool) | object      | ❌ 不支持                                           | 图像生成工具                                                                          |
| tools(File search)           | object      | ❌ 不支持                                           | 文件搜索                                                                              |

**<font color="red">注意：zenmux不支持tools(Code interpreter)、tools(Image generation tool)、tools(File search)三种工具调用，因此涉及到这三种工具的各种字段都不生效，本文档已过滤对应字段。</font>**

## Response（非流式）

当 `stream: false` 时，返回一个 **Response object**。

### 顶层字段（Response object）

#### background `boolean`

是否在后台运行该 Response，入参不支持，默认为`false`。

#### completed_at `number`

Response 完成时间戳（Unix 秒）；仅当 `status` 为 `completed` 时存在。

#### conversation `object`

该 Response 归属的 conversation；输入/输出项会自动追加到该 conversation。

- id `string`：conversation 的唯一 ID。

#### created_at `number`

Response 创建时间戳（Unix 秒）。

#### error `object | null`

生成失败时的错误对象。

- code `string`：错误码。
- message `string`：错误描述。

#### id `string`

Response 的唯一 ID。

#### incomplete_details `object | null`

Response 未完成的原因信息

- reason `string`：未完成原因（例如达到 `max_output_tokens`）。

#### instructions `string | array`

插入模型上下文的系统/开发者指令。

#### max_output_tokens `integer | null`

生成上限（包含可见输出与 reasoning tokens）。

#### max_tool_calls `integer | null`

内置工具的总调用上限（跨工具累计）。

<!-- #### metadata `object(map)`

最多 16 个 KV；key ≤64、value ≤512。 -->

#### model `string`

生成此 Response 的模型 ID。

#### object `string`

对象类型，固定为 `response`。

#### output `array`

模型输出项数组（顺序/长度由模型决定），详情见下文。

#### output_text `string`（SDK Only）

SDK 便捷字段：聚合所有 `output_text` 文本。

#### parallel_tool_calls `boolean`

是否允许并行工具调用。

#### previous_response_id `string | null`

上一条 Response ID；用于多轮对话（与 `conversation` 互斥）。

#### prompt `object`

引用 prompt 模板及其变量。

- id `string`：prompt 模板 ID。
- version `string`：模板版本（可选）。
- variables `object(map)`：模板变量替换值。

#### prompt_cache_key `string`

用于缓存优化的稳定标识（替代 `user`）。

#### prompt_cache_retention `string`

prompt 缓存保留策略（如 `24h`）。

#### reasoning `object`

推理配置（gpt-5 / o 系列）。

- effort `string | null`：推理强度，前支持的值为 `none`、`minimal`、`low`、`medium`、`high` 和 `xhigh`。
- summary `string | null`：是否生成推理摘要,可选值为 `auto`、`concise` 或 `detailed` 之一。。

#### safety_identifier `string`

安全监测用稳定用户标识（建议哈希化）。

#### service_tier `string`

服务层级，入参不支持，默认返回`default`。

#### **store `boolean`**

是否存储 Response 以供后续检索（示例响应中出现）。

#### status `string`

生成状态：`completed` / `failed` / `in_progress` / `cancelled` / `queued` / `incomplete`。

#### temperature `number`

采样温度（0–2）。

#### text `object`

文本输出配置。

##### text.format `object`

指定模型文本输出格式。默认 `{ type: "text" }`。
text.format 的可选类型：

:::details Text format

- type `string`

固定为 `text`，表示普通文本输出。

:::

:::details JSON Object format

- type `string`

固定为 `json_object`，启用 JSON mode（保证输出是合法 JSON）。

:::

:::details JSON Schema format（Structured Outputs）

- type `string`：固定为 `json_schema`。
- name `string`：格式名称（≤64，字母数字/下划线/短横线）。
- description `string`：描述该输出格式。
- schema `object`：JSON Schema 定义。
- strict `boolean`：严格模式，启用后严格按 schema 输出。

##### ⚠ JSON Schema / JSON Mode 启用方式（Responses API）

- Structured Outputs：  
  `text: { format: { type: "json_schema", strict: true, schema: ... } }`
- JSON mode：  
   `text: { format: { type: "json_object" } }`

:::

##### text.verbosity `string`

限制模型回应的详细程度。数值越低，回应越简洁；数值越高，回应越详尽。目前支持的参数值：`low` / `medium` / `high`

#### tool_choice `string | object`

控制模型是否/如何调用工具。

:::details Tool choice mode`string`

- `none`：不调用工具，直接生成文本
- `auto`：模型可自行决定是否调用一个或多个工具
- `required`：模型必须调用一个或多个工具

:::

:::details Allowed tools`object`

用于**限制可用工具子集**（在 `tools` 给出全量后，允许模型只在 subset 中选）。

- tool_choice.type `string`

固定为 `allowed_tools`。

- tool_choice.mode `string`
  - `auto`：模型可在允许的工具中自由选择或不调用
  - `required`：模型必须调用允许列表中的工具之一

- tool_choice.tools `array`

允许的工具定义列表（可混合 function / mcp 等）。示例：

```json
[
  { "type": "function", "name": "get_weather" },
  { "type": "mcp", "server_label": "deepwiki" }
]
```

:::

:::details Hosted tool choice`object`

强制调用某个**内置工具（Hosted / Built‑in tools）**。

- tool_choice.type `string`

  可选值：
  <!-- - `file_search` -->
  - `web_search_preview`
  - `computer_use_preview`
    <!-- - `code_interpreter` -->
    <!-- - `image_generation` -->

:::

:::details Function tool choice`object`

强制调用指定**自定义函数**。

- tool_choice.type `string`

固定为 `function`。

- tool_choice.name `string`

函数名。

:::

:::details MCP tool choice`object`

强制调用某个**MCP 远程工具**。

- tool_choice.type `string`

固定为 `mcp`。

- tool_choice.server_label `string`

MCP 服务器标识。

- tool_choice.name `string`

要调用的 MCP 工具名。

:::

:::details Custom tool choice`object`

强制调用某个**自定义工具（custom tool）**。

- tool_choice.type `string`

固定为 `custom`。

- tool_choice.name `string`

要调用的 custom tool 名称。

:::

:::details Specific apply_patch tool choice`object`

强制模型调用 **apply_patch** 工具。

- tool_choice.type `string`

固定为 `apply_patch`。

:::

:::details Specific shell tool choice`object`

强制模型调用 **shell** 工具。

- tool_choice.type `string`

固定为 `shell`。

:::

#### tools `array`

可调用工具列表。

#### tools[i] 可能类型

:::details Function tool（函数工具定义）`object`

- type `string`：`function`
- name `string`：函数名称
- parameters `object`（JSON Schema）：函数参数定义
- strict `boolean`（默认 `true`）：是否严格模式
- description `string`：函数描述

:::

<!-- :::details File search tool（文件搜索）`object`

- type `string`：`file_search`
- vector_store_ids `array[string]`：要搜索的向量存储 ID 列表
- filters `object` ：过滤器
  - Comparison Filter `object`：比较过滤器
    - key `string`：要过滤的元数据字段名
    - type `string`：`eq` / `ne` / `gt` / `gte` / `lt` / `lte` / `in` / `nin`：比较操作符
    - value `string | number | boolean | array`：要比较的值
  - Compound Filter `object`：复合过滤器
    - filters `array[ComparisonFilter | CompoundFilter]`：子过滤器列表
    - type `string`：`and` / `or`：逻辑操作符
- max_num_results `integer` （1~50）：返回结果的最大数量限制
- ranking_options `object`：搜索结果的排序选项
  - hybrid_search `object`：混合搜索权重配置
    - embedding_weight `number`：向量嵌入的权重
    - text_weight `number`：文本匹配的权重
  - ranker `string`：使用的排序算法名称

::: -->

:::details Web search（网页搜索，一般可用版本）`object`

- type `string` ：`web_search` 或 `web_search_2025_08_26`
- filters `object` ：搜索过滤器
  - allowed_domains `array[string]` （默认 `[]`）：允许的域名白名单（允许子域）
- search_context_size `string` （默认 `medium`）：`low` / `medium` / `high`：搜索上下文的大小级别
- user_location `object` ：用户大致位置
  - type `string` ：`approximate`：位置类型，固定为大致位置
  - city `string`：城市名称
  - country `string` ：两位 ISO（如 `US`）：国家代码
  - region `string`：地区/州代码
  - timezone `string` ：IANA TZ（如 `America/Los_Angeles`）：时区标识符

:::

:::details Web search preview（网页搜索预览版）`object`

- type `string`：`web_search_preview` 或 `web_search_preview_2025_03_11`
- search_context_size `string` ：`low` / `medium` / `high`：搜索上下文的大小级别
- user_location `object`：用户地理位置信息
  - type `string`：`approximate`：位置类型，固定为大致位置
  - city `string`：城市名称
  - country `string` （两位 ISO）：国家代码
  - region `string`：地区/州代码
  - timezone `string` （IANA TZ）：时区标识符

:::

:::details Computer use preview（Computer Use 工具）`object`

- type `string` ：`computer_use_preview`
- display_width `integer` ：显示区域宽度（像素）
- display_height `integer` ：显示区域高度（像素）
- environment `string` ：环境类型（如 `browser` / `mac` / `windows` / `ubuntu`）

:::

<!-- :::details Code interpreter（代码解释器）`object`

- type `string`：`code_interpreter`：工具类型，固定为代码解释器
- container `string | object`：代码执行容器配置
  - `string`：现有容器的 ID
  - `object`：新容器的配置对象
    - type `string`：`auto`：容器类型，固定为自动
    - file_ids `array`：关联的文件 ID 列表
    - memory_limit `string`：容器的内存限制

::: -->

:::details Apply patch tool（补丁应用）`object`

- type `string`：`apply_patch`

:::

:::details MCP tool（远程 MCP 工具）`object`（若启用）

- type `string` ：`mcp`
- server_label `string` ：该 MCP server 的标签（用于 tool call 路由）
- server_url `string` ：远程 MCP server
- authorization `string` ：OAuth access token（用于 remote MCP server 或服务连接器）
- allowed_tools `array[string] | object` ：允许模型调用的工具集合或过滤器
  - **MCP allowed tools** `array[string]`
  - **MCP tool filter** `object`
    - read_only `boolean` ：按工具是否只读筛选
    - tool_names `array[string]` ：按工具名白名单筛选
- require_approval `string | object` ：哪些工具需要审批（示例里为 `never`；也支持更细粒度
  - `string`：`always` / `never`
  - `object`：approval filter（结构见文档片段）

:::

<!-- :::details Image generation（图片生成）`object`

- type `string` ：`image_generation
- size `string` ：如 `1024x1024` / `1024x1536` / `1536x1024` / `auto`
- quality `string` ：`low` / `medium` / `high` / `auto`
- background `string` ：`transparent` / `opaque` / `auto`（透明背景通常配合 png/webp）
- output_format `string` ：输出格式（如 `png` / `jpeg` / `webp`，以图像文档为准）
- output_compression `integer` ：JPEG/WebP 压缩（0~100）(
- partial_images `integer` ：流式 partial images 张数（文档示例为 1~3）
- action `string` ：`auto` / `generate` / `edit`（某些模型/场景支持）
- input_image_mask `object` ：用于编辑/局部重绘的 mask（示例：用 `file_id`）(
  - file_id `string`

::: -->

:::details Shell tool（通用 Shell）`object`

- type `string` ：`shell`

（同样一般不需要额外配置；执行参数在模型输出的 `shell_call.action` 里。）

:::

:::details Local shell tool（旧版本地 Shell）`object`

- type `string` ：`local_shell`

（官方提示 local shell 已偏旧，新用例更推荐 `shell`。）

:::

:::details Custom tool（自定义工具定义，非 function 的“自由输入/可约束格式”）`object`

- type `string` ：`custom`
- name `string` ：工具名称
- description `string` ：工具描述
- format `object` ：输入格式配置（默认是自由文本）
  - **Text format** `object`：文本格式
    - type `string` ：`text`：格式类型，固定为文本
  - **Grammar format** `object`：语法格式
    - type `string` ：`grammar`：格式类型，固定为语法
    - syntax `string` ：`lark` / `regex`：语法类型
    - definition `string` ：语法定义内容

:::

#### top_logprobs `integer`

返回每个 token 的 top-N 概率（0–20）。

#### top_p `number`

核采样参数（nucleus sampling）。

#### truncation `string`

截断策略：`auto` / `disabled`。

#### usage `object`

Token 用量信息。

- input_tokens `integer`：输入的 token 数量
- input_tokens_details `object`：输入 token 的详细信息
  - cached_tokens `integer`：缓存的 token 数量
- output_tokens `integer`：输出的 token 数量
- output_tokens_details `object`：输出 token 的详细信息
  - reasoning_tokens `integer`：推理过程的 token 数量
- total_tokens `integer`：总 token 数量

#### user `string | null`（Deprecated）

已废弃，默认返回`null`，请使用 `prompt_cache_key` / `safety_identifier` 替代。

### output[i]：Output items（输出项）可能类型

:::details Output message（输出消息）`object`

- type `string`：固定为 `message`。
- id `string`：消息项 ID。
- role `string`：固定为 `assistant`。
- status `string`：`in_progress` / `completed` / `incomplete`。
- content `array`：内容分片列表。

#### message.content[j] 可能类型

A) Output text `object`

- type `string`：固定为 `output_text`。
- text `string`：模型输出文本。
- annotations `array`：引用/注释列表。
- logprobs `array`：token 概率信息（需 include）。

B) Refusal `object`

- type `string`：固定为 `refusal`。
- refusal `string`：拒答说明。

##### Output text.annotations[k] 可能类型

1. File citation `object`

- type `string`：固定为 `file_citation`。
- file_id `string`：文件 ID。
- filename `string`：文件名。
- index `integer`：文件索引。

2. URL citation `object`

- type `string`：固定为 `url_citation`。
- url `string`：网页 URL。
- title `string`：网页标题。
- start_index `integer`：引用起始位置。
- end_index `integer`：引用结束位置。

3. Container file citation `object`

- type `string`：固定为 `container_file_citation`。
- container_id `string`：容器 ID。
- file_id `string`：文件 ID。
- filename `string`：文件名。
- start_index `integer`：引用起始位置。
- end_index `integer`：引用结束位置。

4. File path `object`

- type `string`：固定为 `file_path`。
- file_id `string`：文件 ID。
- index `integer`：文件索引。

##### Output text.logprobs[m]（token logprob 结构）

- token `string`：token 文本。
- logprob `number`：对数概率。
- bytes `array`：字节表示。
- top_logprobs `array`：候选 token 与 logprob。

:::

:::details Reasoning（推理内容项）`object`

- type `string`：固定为 `reasoning`。
- id `string`：推理项 ID。
- summary `array`：推理摘要分片。
  - type `string`：固定为 `summary_text`。
  - text `string`：摘要文本。
- content `array`：可选推理正文分片。
  - type `string`：固定为 `reasoning_text`。
  - text `string`：推理正文文本。
- encrypted_content `string`：加密推理内容（需 include）。
- status `string`：`in_progress` / `completed` / `incomplete`。

:::

:::details Function tool call（函数调用请求）`object`

- type `string`：固定为 `function_call`。
- id `string`：调用项 ID。
- call_id `string`：调用关联 ID。
- name `string`：函数名。
- arguments `string`：JSON 字符串参数。
- status `string`：`in_progress` / `completed` / `incomplete`。

:::

<!-- :::details File search tool call（文件搜索调用结果）`object`

- type `string`：固定为 `file_search_call`。
- id `string`：文件搜索调用 ID。
- queries `array`：搜索查询。
- status `string`：`in_progress` / `searching` / `incomplete` / `failed`。
- results `array`：搜索结果（需 include）。
  - file_id `string`：文件 ID。
  - filename `string`：文件名。
  - score `number`：相关性评分（0–1）。
  - text `string`：命中文本。
  - attributes `object(map)`：文件自定义属性。

::: -->

:::details Web search tool call（网页搜索调用结果）`object`

- type `string`：固定为 `web_search_call`。
- id `string`：搜索调用 ID。
- status `string`：搜索调用状态。
- action `object`：具体动作。
  - Search action `object`
    - type `string`：动作类型（search）。
    - query `string`：查询（已废弃）。
    - queries `array`：查询列表。
    - sources `array`：来源列表（需 include）。
  - Open page action `object`
    - type `string`：`open_page`。
    - url `string`：打开的 URL。
  - Find action `object`
    - type `string`：`find`。
    - url `string`：搜索的页面。
    - pattern `string`：查找模式。

:::

:::details Compaction item（压缩项）`object`

由 `v1/responses/compact` 生成，用于把长对话压缩成不透明加密摘要，并可回填进后续 `input`。

- type `string`：`compaction`
- id `string`：compaction item ID
- encrypted_content `string`：压缩摘要（加密、不透明）
- created_by `string`：创建该项的执行者标识符

:::

<!-- :::details Code interpreter call（代码解释器调用）`object`

- type `string`：固定为 `code_interpreter_call`。
- id `string`：调用 ID。
- code `string | null`：执行代码。
- container_id `string`：容器 ID。
- status `string`：`in_progress` / `completed` / `incomplete` / `interpreting` / `failed`。
- outputs `array | null`：执行输出（需 include）。
  - logs `object`
    - type `string`：`logs`
    - logs `string`：日志文本
  - image `object`
    - type `string`：`image`
    - url `string`：图片 URL

::: -->

:::details Local shell call（本地 shell 调用）`object`

- type `string`：固定为 `local_shell_call`
- id `string`：工具调用的唯一标识符
- call_id `string`：调用 ID
- status `string`：调用状态
- action `object`：执行动作配置
  - type `string`：`exec`：动作类型，固定为执行命令
  - command `array`：要执行的命令（数组形式）
  - env `map`：环境变量配置
  - timeout_ms `integer`：超时时间（毫秒）
  - user `string`：执行命令的用户
  - working_directory `string`：工作目录路径

:::

:::details Computer tool call（Computer Use 调用）`object`

- type `string`：固定为 `computer_call`。
- id `string`：调用 ID。
- call_id `string`：调用关联 ID。
- status `string`：调用状态。
- pending_safety_checks `array`：待确认安全检查。
- action `object`：具体动作。

###### Action types（`action` 动作参数）可能类型一览

###### Click（单击）`object`

- type `string`：`click`
- x `number`
- y `number`
- button `string` ：`left` / `right` / `middle`

###### Double click（双击）`object`

- type `string`：`double_click`
- x `integer`
- y `integer`

###### Move（移动鼠标）`object`

- type `string`：`move`
- x `integer`
- y `integer`

###### Screenshot `object`

- type `screenshot`：`move`

###### Drag（拖拽）`object`

- type `string`：`drag`
- path `array`：`drag`
  - x `integer`
  - y `integer`

###### Scroll（滚动）`object`

- type `string`：`scroll`
- x `integer` （滚动锚点坐标，部分实现会给）
- y `integer`
- scroll_x `integer`
- scroll_y `integer`

###### Type（输入文本）`object`

- type `string`：`type`
- text `string`

###### Keypress（按键/组合键）`object`

- type `string`：`keypress`
- keys `array` （组合键，如 `["CTRL","L"]`）

###### Wait（等待）`object`

- type `string`：`wait`

:::

:::details Shell tool call `object`

- type `string`：`shell_call`
- call_id `string`
- id `string`
- status `string`：`in_progress` / `completed` / `incomplete`
- action `object`：shell commands 与限制
  - commands `array`：按顺序执行的命令列表
  - max_output_length `integer`：最多捕获的 stdout+stderr UTF-8 字符数
  - timeout_ms `integer`：超时毫秒数
- created_by `string`：创建此工具调用的实体 ID

:::

:::details Shell tool call output `object`

- type `string`：固定为 `shell_call_output`
- call_id `string`：调用 ID
- id `string`：输出项的唯一标识符
- max_output_length `integer`：最大输出长度限制
- output `array`：stdout/stderr chunk 列表，每个元素：
  - stdout `string`：标准输出内容
  - stderr `string`：标准错误内容
  - outcome `object`：执行结果（联合类型）
    - Timeout outcome `object`：超时结果
      - type `string`：`timeout`：结果类型，固定为超时
    - Exit outcome `object`：退出结果
      - type `string`：`exit`：结果类型，固定为退出
      - exit_code `integer`：退出码
- created_by `string`：创建该项的执行者标识符

:::

:::details Apply patch tool call（补丁应用调用）`object`

用于通过 diff patch 创建/删除/更新文件。

- type `string`：固定为 `apply_patch_call`
- call_id `string`：调用 ID
- id `string`：调用的唯一标识符
- status `string`：`in_progress` / `completed`：调用状态
- created_by `string`：创建者标识符
- operation `object`：具体操作（联合类型）

###### operation 可能类型

1. Create file `object`：创建文件操作

- type `string`：`create_file`：操作类型，固定为创建文件
- path `string`：相对工作区根路径
- diff `string`：unified diff 内容

2. Delete file `object`：删除文件操作

- type `string`：`delete_file`：操作类型，固定为删除文件
- path `string`：文件路径

3. Update file `object`：更新文件操作

- type `string`：`update_file`：操作类型，固定为更新文件
- path `string`：文件路径
- diff `string`：unified diff 内容

:::

:::details Apply patch tool call output `object`

- type `string`：固定为 `apply_patch_call_output`
- call_id `string`：调用 ID
- id `string`：输出项的唯一标识符
- status `string`：`completed` / `failed`：执行状态
- output `string`：日志/错误等可读文本
- created_by `string`：创建者标识符

:::

<!-- :::details Image generation call（图片生成调用）`object`

- type `string`：固定为 `image_generation_call`。
- id `string`：调用 ID。
- status `string`：调用状态。
- result `string`：生成图片 base64。

::: -->

:::details MCP tool call `object`

- type `string`：固定为 `mcp_call`
- id `string`：工具调用的唯一标识符
- server_label `string`：MCP 服务器标签
- name `string`：工具名称
- arguments `string`：JSON 字符串参数
- approval_request_id `string`：用于后续审批响应的 ID
- output `string`：工具输出结果
- error `string`：错误信息
- status `string`：`in_progress` / `completed` / `incomplete` / `calling` / `failed`：调用状态

:::

:::details MCP list tools `object`

- type `string`：固定为 `mcp_list_tools`
- id `string`：调用的唯一标识符
- server_label `string`：MCP 服务器标签
- error `string`：错误信息
- tools `array`：工具列表，每个元素：
  - name `string`：工具名称
  - description `string`：工具描述
  - annotations `object`：工具注解
  - input_schema `object`：JSON Schema 格式的输入参数定义

:::

:::details MCP approval request `object`

- type `string`：固定为 `mcp_approval_request`
- id `string`：审批请求的唯一 ID
- server_label `string`：MCP 服务器的标签名称
- name `string`：请求运行的工具名称
- arguments `string`：工具参数的 JSON 字符串格式

:::

:::details Custom tool call（自定义工具调用）`object`

模型发起对“自定义工具”的调用（你侧需要执行）。

- type `string`：固定为 `custom_tool_call`
- call_id `string`：调用 ID
- name `string`：工具名称
- input `string`：输入参数
- id `string`：调用的唯一标识符

:::

## Response（流式）

当 `stream: true` 时，`POST /v1/responses` 不会一次性返回完整 Response object，而是通过 **SSE（Server-Sent Events）** 持续推送一系列 **Streaming events**（语义事件）。([platform.openai.com](https://platform.openai.com/docs/guides/streaming-responses))

### 传输层格式（SSE）

- HTTP 响应通常为 `Content-Type: text/event-stream`
- 服务端会按顺序发送多条事件
- 每条事件在“线协议”层面通常长这样（示意）：

```text
data: {"type":"response.output_text.delta","item_id":"msg_123","output_index":0,"content_index":0,"delta":"Hello","sequence_number":12}

```

> 说明：SSE 标准也支持 `event: ...` 行，但在 Responses streaming 的语义层面，事件类型以 JSON 里的 `type` 字段为准；SDK 也会直接把每条事件解析成对象供你消费。([platform.openai.com](https://platform.openai.com/docs/guides/streaming-responses))

### Streaming event 通用说明

- 每条事件都有：
  - `type`：事件类型字符串（如 `response.created`）
  - `sequence_number`：事件序号，用于排序（不同事件示例里可能从 0 或 1 开始）
- 很多事件会携带 `output_index`、`item_id`、`content_index` 等索引/关联字段，用来把“增量事件”精确归并到 `output[]` 的具体 item、以及 item 内的具体 content part。

## Streaming events

> 下文每个事件都按官网 reference 页面展示的字段顺序列出；其中 `response` / `item` / `part` / `annotation` 等对象的**具体结构**与前文「非流式 Response object / output items」一致（或在官网相应 schema 中定义）。

### response.created

响应创建时发出。

字段：

- response `object`：创建出的 Response（就是前文的 Response object）
- sequence_number `integer`：该事件序号
- type `string`：固定为 `response.created`

### response.in_progress

响应生成进行中时发出。

字段：

- response `object`：进行中的 Response
- sequence_number `integer`
- type `string`：固定为 `response.in_progress`

### response.completed

响应完成时发出（会带最终 Response）。

字段：

- response `object`：已完成的 Response（含最终 `output`、`usage` 等）
- sequence_number `integer`
- type `string`：固定为 `response.completed`

### response.failed

响应失败时发出（会带错误信息）。

字段：

- response `object`：失败的 Response（`status="failed"`，`error` 非空）
- sequence_number `integer`
- type `string`：固定为 `response.failed`

### response.incomplete

响应以未完成结束时发出（例如触发上限）。

字段：

- response `object`：未完成的 Response（`status="incomplete"`，`incomplete_details` 可能非空）
- sequence_number `integer`
- type `string`：固定为 `response.incomplete`

### response.output_item.added

新增一个输出项（output item）时发出。

字段：

- item `object`：新增的 output item（可能是 message / tool call / reasoning 等，见前文 `output[i]`）
- output_index `integer`：该 item 在 `response.output[]` 中的索引
- sequence_number `integer`
- type `string`：固定为 `response.output_item.added`

### response.output_item.done

某个输出项结束（done）时发出。

字段：

- item `object`：已完成的 output item
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.output_item.done`

### response.content_part.added

某个 message 的 `content[]` 新增了一个 content part 时发出。

字段：

- content_index `integer`：该 part 在 `message.content[]` 中的索引
- item_id `string`：所属 output item 的 ID（通常是 message item 的 `id`）
- output_index `integer`：所属 output item 的索引
- part `object`：新增的 content part（如 `output_text` / `refusal` 等，结构见前文）
- sequence_number `integer`
- type `string`：固定为 `response.content_part.added`

### response.content_part.done

某个 content part 完成时发出。

字段：

- content_index `integer`
- item_id `string`
- output_index `integer`
- part `object`：完成后的 content part
- sequence_number `integer`
- type `string`：固定为 `response.content_part.done`

### response.output_text.delta

输出文本的增量（delta）事件。

字段：

- content_index `integer`：文本归属的 content part 索引
- delta `string`：新增的文本片段
- item_id `string`：归属的 output item ID
- logprobs `array`：token 概率（需要 include/配置才会出现；结构见你上文的 logprobs 定义）
- output_index `integer`：归属的 output item 索引
- sequence_number `integer`
- type `string`：固定为 `response.output_text.delta`

### response.output_text.done

某段文本最终定稿（done）事件。

字段：

- content_index `integer`
- item_id `string`
- logprobs `array`：token 概率（同上，按需出现）
- output_index `integer`
- sequence_number `integer`
- text `string`：最终完整文本
- type `string`：固定为 `response.output_text.done`

### response.refusal.delta

拒答文本的增量事件。

字段：

- content_index `integer`
- delta `string`：拒答文本增量
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.refusal.delta`

### response.refusal.done

拒答文本最终定稿事件。

字段：

- content_index `integer`
- item_id `string`
- output_index `integer`
- refusal `string`：最终拒答说明
- sequence_number `integer`
- type `string`：固定为 `response.refusal.done`

### response.function_call_arguments.delta

函数调用参数（arguments）的增量事件（arguments 是 JSON 字符串的增量拼接）。

字段：

- delta `string`：arguments 的增量片段
- item_id `string`：function_call item 的 ID
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.function_call_arguments.delta`

### response.function_call_arguments.done

函数调用参数最终定稿事件。

字段：

- arguments `string`：最终 arguments（JSON 字符串）
- item_id `string`
- name `string`：函数名
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.function_call_arguments.done`

<!-- ### response.file_search_call.in_progress

文件搜索 tool call 启动事件。

字段：

- item_id `string`：file_search_call item 的 ID
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.file_search_call.in_progress` -->

<!-- ### response.file_search_call.searching

文件搜索执行中事件。

字段：

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.file_search_call.searching` -->

<!-- ### response.file_search_call.completed

文件搜索完成事件（表示调用完成；如需 results 需 include 对应字段）。

字段：

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.file_search_call.completed` -->

### response.web_search_call.in_progress

网页搜索 tool call 启动事件。

字段：

- item_id `string`：web_search_call item 的 ID
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.web_search_call.in_progress`

### response.web_search_call.searching

网页搜索执行中事件。

字段：

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.web_search_call.searching`

### response.web_search_call.completed

网页搜索完成事件（如需 sources 等需 include 对应字段）。

字段：

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.web_search_call.completed`

### response.reasoning_summary_part.added

新增一段 reasoning summary part 时发出。

字段：

- item_id `string`：reasoning item 的 ID
- output_index `integer`
- part `object`：新增的 summary part（如 `summary_text`）
- sequence_number `integer`
- summary_index `integer`：该 summary part 的索引
- type `string`：固定为 `response.reasoning_summary_part.added`

### response.reasoning_summary_part.done

某段 reasoning summary part 完成时发出。

字段：

- item_id `string`
- output_index `integer`
- part `object`：完成后的 summary part
- sequence_number `integer`
- summary_index `integer`
- type `string`：固定为 `response.reasoning_summary_part.done`

### response.reasoning_summary_text.delta

reasoning summary 文本增量事件。

字段：

- delta `string`：summary 文本增量
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- summary_index `integer`
- type `string`：固定为 `response.reasoning_summary_text.delta`

### response.reasoning_summary_text.done

reasoning summary 文本最终定稿事件。

字段：

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- summary_index `integer`
- text `string`：最终完整 summary 文本
- type `string`：固定为 `response.reasoning_summary_text.done`

### response.reasoning_text.delta

reasoning 正文文本增量事件。

字段：

- content_index `integer`：reasoning content part 索引
- delta `string`
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.reasoning_text.delta`

### response.reasoning_text.done

reasoning 正文文本最终定稿事件。

字段：

- content_index `integer`
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- text `string`：最终完整 reasoning 文本
- type `string`：固定为 `response.reasoning_text.done`

<!-- ### response.image_generation_call.completed

图片生成 tool call 完成事件。

字段：

- item_id `string`：image_generation_call item 的 ID
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.image_generation_call.completed` -->

<!-- ### response.image_generation_call.generating

图片生成进行中（generating）事件。

字段：

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.image_generation_call.generating` -->

<!-- ### response.image_generation_call.in_progress

图片生成 in_progress 事件。

字段：

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.image_generation_call.in_progress` -->

<!-- ### response.image_generation_call.partial_image

图片生成过程中，产生 partial image 的事件。

字段：

- item_id `string`
- output_index `integer`
- partial_image_b64 `string`：base64 的 partial image 数据
- partial_image_index `integer`：partial image 序号（0-based）
- sequence_number `integer`
- type `string`：固定为 `response.image_generation_call.partial_image` -->

### response.mcp_call_arguments.delta

MCP 工具调用参数增量事件（JSON 字符串增量）。

字段：

- delta `string`：arguments 增量（JSON 字符串片段）
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.mcp_call_arguments.delta`

### response.mcp_call_arguments.done

MCP 工具调用参数定稿事件。

字段：

- arguments `string`：最终 arguments（JSON 字符串）
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.mcp_call_arguments.done`

### response.mcp_call.completed

MCP 工具调用成功完成事件。

字段：

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.mcp_call.completed`

### response.mcp_call.failed

MCP 工具调用失败事件。

字段：

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.mcp_call.failed`

### response.mcp_call.in_progress

MCP 工具调用进行中事件。

字段：

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.mcp_call.in_progress`

### response.mcp_list_tools.completed

MCP list tools 成功完成事件。

字段：

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.mcp_list_tools.completed`

### response.mcp_list_tools.failed

MCP list tools 失败事件。

字段：

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.mcp_list_tools.failed`

### response.mcp_list_tools.in_progress

MCP list tools 进行中事件。

字段：

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.mcp_list_tools.in_progress`

<!-- ### response.code_interpreter_call.in_progress

代码解释器 tool call 启动/进行中事件。

字段：

- item_id `string`：code_interpreter_call item 的 ID
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.code_interpreter_call.in_progress` -->

<!-- ### response.code_interpreter_call.interpreting

代码解释器正在解释执行阶段事件。

字段：

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.code_interpreter_call.interpreting` -->

<!-- ### response.code_interpreter_call.completed

代码解释器 tool call 完成事件。

字段：

- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.code_interpreter_call.completed` -->

<!-- ### response.code_interpreter_call_code.delta

代码解释器生成/回传的代码片段增量事件。

字段：

- delta `string`：代码增量片段
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.code_interpreter_call_code.delta` -->

<!-- ### response.code_interpreter_call_code.done

代码解释器代码片段定稿事件。

字段：

- code `string`：最终代码
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.code_interpreter_call_code.done` -->

### response.output_text.annotation.added

文本 output 的 annotations 增量添加事件。

字段：

- annotation `object`：新增的 annotation（具体 annotation 类型结构见前文/官网 annotation schema）
- annotation_index `integer`：该 annotation 在 annotations 数组中的索引
- content_index `integer`
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：固定为 `response.output_text.annotation.added`

### response.queued

响应进入排队状态事件。

字段：

- response `object`：排队中的 Response（结构同 Response object；示例可能仅展示子集字段）
- sequence_number `integer`
- type `string`：固定为 `response.queued`

### response.custom_tool_call_input.delta

自定义工具（custom tool）输入的增量事件。

字段：

- delta `string`：输入增量片段
- item_id `string`：custom_tool_call item 的 ID
- output_index `integer`
- sequence_number `integer`
- type `string`：事件类型标识（固定为 `response.custom_tool_call_input.delta`）

### response.custom_tool_call_input.done

自定义工具输入定稿事件。

字段：

- input `string`：最终完整 input
- item_id `string`
- output_index `integer`
- sequence_number `integer`
- type `string`：事件类型标识（固定为 `response.custom_tool_call_input.done`）

### error

流式过程中出现错误时发出。

字段：

- code `string`：错误码
- message `string`：错误信息
- param `string`：错误参数（可能为 null）
- sequence_number `integer`
- type `string`：固定为 `error`

::: api-request POST /api/v1/responses

```TypeScript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://zenmux.ai/api/v1/responses',
  apiKey: '<ZENMUX_API_KEY>',
});

async function main() {
  const response = await openai.responses.create({
    model: "openai/gpt-5",
    input: "What is the meaning of life?"
  })

  print(response)
}

main();
```

```Python
from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1/responses",
    api_key="<your_ZENMUX_API_KEY>",
)

response = client.responses.create(
    model: "openai/gpt-5",
    input: "What is the meaning of life?"
)

print(response)
```

```cURL
curl https://zenmux.ai/api/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "openai/gpt-5",
    "input": "What is the meaning of life?"
  }'
```

:::

::: api-response

```json
{
  "id": "resp_0140d07a600e72a30069733ecadb508194b7cd84f200b593c7",
  "object": "response",
  "created_at": 1769160394,
  "status": "completed",
  "background": false,
  "content_filters": [
    {
      "blocked": false,
      "source_type": "prompt",
      "content_filter_raw": null,
      "content_filter_results": {},
      "content_filter_offsets": {
        "start_offset": 0,
        "end_offset": 0,
        "check_offset": 0
      }
    },
    {
      "blocked": false,
      "source_type": "completion",
      "content_filter_raw": null,
      "content_filter_results": {},
      "content_filter_offsets": {
        "start_offset": 0,
        "end_offset": 0,
        "check_offset": 0
      }
    }
  ],
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "max_output_tokens": null,
  "max_tool_calls": null,
  "model": "openai/gpt-5",
  "output": [
    {
      "id": "rs_0140d07a600e72a30069733ecbf4c88194b2a1d173c1b500fa",
      "type": "reasoning",
      "summary": []
    },
    {
      "id": "msg_0140d07a600e72a30069733edc988881948160d23b617f9994",
      "type": "message",
      "status": "completed",
      "content": [
        {
          "type": "output_text",
          "annotations": [],
          "logprobs": [],
          "text": "There isn’t a single agreed-on meaning of life. Different lenses offer different answers:\n- Evolutionary: to survive, reproduce, and pass on genes.\n- Religious/spiritual: to know, serve, or unite with the divine.\n- Existential: life has no built-in meaning; we create it through choices.\n- Humanistic/psychological: meaning arises from relationships, growth, and contribution.\n\nFor most people, meaning tends to cluster around a few pillars:\n- Love and connection\n- Growth and mastery\n- Service and impact\n- Curiosity, beauty, and wonder\n\nIf you’re seeking your own, try:\n- Clarify values: list your top 5 and rank them.\n- Track aliveness: note when you feel most engaged and why.\n- Contribute: find a problem you care about and help, even in small ways.\n- Commit: choose a long-term project that matters to you and stick with it.\n\nMeaning is less a destination than a practice. If you share what matters to you, I can help you shape it into a clear life purpose."
        }
      ],
      "role": "assistant"
    }
  ],
  "parallel_tool_calls": true,
  "previous_response_id": null,
  "prompt_cache_key": null,
  "prompt_cache_retention": null,
  "reasoning": {
    "effort": "medium",
    "summary": null
  },
  "safety_identifier": null,
  "service_tier": "default",
  "store": true,
  "temperature": 1,
  "text": {
    "format": {
      "type": "text"
    },
    "verbosity": "medium"
  },
  "tool_choice": "auto",
  "tools": [],
  "top_logprobs": 0,
  "top_p": 1,
  "truncation": "disabled",
  "usage": {
    "input_tokens": 13,
    "input_tokens_details": {
      "cached_tokens": 0,
      "web_search": 0
    },
    "output_tokens": 801,
    "output_tokens_details": {
      "reasoning_tokens": 576
    },
    "total_tokens": 814
  },
  "user": null,
  "metadata": {}
}
```

:::
