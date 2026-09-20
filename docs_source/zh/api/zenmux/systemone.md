---
pageClass: api-page
title: 结构化评估 API（System One）
head:
  - - meta
    - name: description
      content: 针对一组类型化问题评估输入状态，返回结构化答案
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, systemone, System One, 结构化评估, 分类, 打分, 判定, TypeSafe
---

# 结构化评估（System One）

::: tip 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```http
POST https://zenmux.ai/api/v1/systemone
```

System One 接口针对一段 `state`（待评估内容），按你定义的一组类型化 `questions`（问题）进行评估，并为每个问题返回一个结构化 `answer`（答案）。答案与问题通过你自定义的 key 一一对应。

每个问题可以是以下三种类型之一：

- **noul**：是/否判定，返回答案为“是”的概率。
- **choice**：从你定义的选项集合中选择其一，返回选中项及完整概率分布。
- **score**：按你定义的分级标准打分，返回跨各分级的概率加权分值。

## 请求头

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer Token 鉴权。

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

请求内容类型，默认为 `application/json`。

## 请求参数

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

要使用的模型 ID，格式为 `<provider>/<model-name>`，例如 `typesafe/jev-latest`。

### state `string、object 或 array` <span style="color: #FA6062; font-weight: 400">\*</span>

待评估的内容。可以是纯文本 `string`，也可以是结构化数据（`object` / `array`），例如对话记录、业务记录或应用当前状态。

### questions `object` <span style="color: #FA6062; font-weight: 400">\*</span>

一个由类型化问题组成的映射（map）。key 由你自行指定，返回的答案会以相同的 key 归位。key 不会传递给底层模型，也不参与推理。

#### questions.\<question-id\> `object` <span style="color: #FA6062; font-weight: 400">\*</span>

一个类型化问题对象。所有类型都包含 `type` 与 `instructions`；不同类型各自附带自己的 `criteria`。

##### type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

问题类型，取值为 `noul`、`choice` 或 `score`。

##### instructions `string、object 或 array` <span style="color: #FA6062; font-weight: 400">\*</span>

该问题需要模型判断的内容。

##### criteria `object 或 array` <span style="color: #666; font-weight: 400; font-size: 14px"> 视类型而定 </span>

评判标准，其形态取决于 `type`：

- `noul`（可选）：`object`，用 `true` / `false` 分别描述“是”和“否”的含义。
- `choice`（必填）：`object`，将每个选项映射到对应的评判说明；无需额外说明时可置为 `null`。
- `score`（必填）：有序 `array`，按顺序描述各分级；至少包含两个分级。

## 响应

返回包含结构化答案的 JSON 对象。

### model `string`

执行本次评估所使用的模型名称。

### answers `object`

答案映射，key 与请求中 `questions` 使用的 key 相同，每个问题对应一个答案。

#### answers.\<question-id\> `object`

与该问题 `type` 匹配的答案对象。`choice` 与 `score` 类型的答案还会额外返回一个 `confidence`（0 到 1），由答案的概率分布推导得出。

- **noul 答案**
  - `type` `string` — 固定为 `noul`。
  - `noul` `number` — 是/否答案，取值范围 0（否）到 1（是）。
- **choice 答案**
  - `type` `string` — 固定为 `choice`。
  - `choice` `string` — 概率最高的选项。
  - `probabilities` `object` — 每个选项到其概率的映射（各项之和为 1）。
  - `confidence` `number` — 模型的确信度，由概率分布推导得出。
- **score 答案**
  - `type` `string` — 固定为 `score`。
  - `score` `number` — 跨各分级的概率加权分值，可能落在分级之间。
  - `legend` `object` — 各分级序号到其描述的映射。
  - `probabilities` `object` — 各分级（字符串 key）到其概率的映射（各项之和为 1）。
  - `confidence` `number` — 模型的确信度，由概率分布推导得出。

### usage `object`

本次请求的 Token 用量信息。

- `input_tokens` `integer` — 输入消耗的 Token 数。
- `output_tokens` `integer` — 输出消耗的 Token 数。

::: api-request POST /api/v1/systemone

```cURL
curl https://zenmux.ai/api/v1/systemone \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -d '{
    "model": "typesafe/jev-latest",
    "state": "救命！我的账户回款已经连续 3 天失败了。",
    "questions": {
      "is_urgent": {
        "type": "noul",
        "instructions": "这段内容是否传达出紧迫感？"
      },
      "department": {
        "type": "choice",
        "instructions": "应由哪个团队来处理？",
        "criteria": {
          "billing": "支付、开票、退款",
          "technical": "缺陷、故障、集成",
          "sales": "定价、升级、新开户"
        }
      },
      "frustration": {
        "type": "score",
        "instructions": "客户的不满程度如何？",
        "criteria": ["平静", "不满", "非常愤怒"]
      }
    }
  }'
```

```Python
import requests

resp = requests.post(
    "https://zenmux.ai/api/v1/systemone",
    headers={
        "Authorization": "Bearer <your_ZENMUX_API_KEY>",
        "Content-Type": "application/json",
    },
    json={
        "model": "typesafe/jev-latest",
        "state": "救命！我的账户回款已经连续 3 天失败了。",
        "questions": {
            "is_urgent": {
                "type": "noul",
                "instructions": "这段内容是否传达出紧迫感？",
            },
            "department": {
                "type": "choice",
                "instructions": "应由哪个团队来处理？",
                "criteria": {
                    "billing": "支付、开票、退款",
                    "technical": "缺陷、故障、集成",
                    "sales": "定价、升级、新开户",
                },
            },
            "frustration": {
                "type": "score",
                "instructions": "客户的不满程度如何？",
                "criteria": ["平静", "不满", "非常愤怒"],
            },
        },
    },
)

print(resp.json())
```

```TypeScript
const resp = await fetch("https://zenmux.ai/api/v1/systemone", {
  method: "POST",
  headers: {
    Authorization: "Bearer <ZENMUX_API_KEY>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "typesafe/jev-latest",
    state: "救命！我的账户回款已经连续 3 天失败了。",
    questions: {
      is_urgent: {
        type: "noul",
        instructions: "这段内容是否传达出紧迫感？",
      },
      department: {
        type: "choice",
        instructions: "应由哪个团队来处理？",
        criteria: {
          billing: "支付、开票、退款",
          technical: "缺陷、故障、集成",
          sales: "定价、升级、新开户",
        },
      },
      frustration: {
        type: "score",
        instructions: "客户的不满程度如何？",
        criteria: ["平静", "不满", "非常愤怒"],
      },
    },
  }),
});

console.log(await resp.json());
```

:::

::: api-response

```json
{
  "model": "typesafe/jev-latest",
  "answers": {
    "is_urgent": {
      "type": "noul",
      "noul": 0.92
    },
    "department": {
      "type": "choice",
      "choice": "technical",
      "probabilities": { "billing": 0.08, "technical": 0.85, "sales": 0.07 },
      "confidence": 0.82
    },
    "frustration": {
      "type": "score",
      "score": 1.6,
      "legend": { "0": "平静", "1": "不满", "2": "非常愤怒" },
      "probabilities": { "0": 0.05, "1": 0.3, "2": 0.65 },
      "confidence": 0.78
    }
  },
  "usage": { "input_tokens": 312, "output_tokens": 48 }
}
```

:::
