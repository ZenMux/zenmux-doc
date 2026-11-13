---
pageClass: api-page
requestVariants:
  - id: json
    label: application/json
    example: application/json
  - id: multipart
    label: multipart/form-data
    example: multipart/form-data
title: 结构化评估 API（System One）
head:
  - - meta
    - name: description
      content: 使用 System One 评估文本、结构化数据和上传图片，返回 Noul、Choice、Score 或 Box 结构化答案。
  - - meta
    - name: keywords
      content: Zenmux, API, documentation, systemone, System One, 结构化评估, TypeSafe, multipart/form-data, 图片上传, Box
---

# 结构化评估（System One）

::: tip 错误排查
调用过程中遇到错误？请参阅 [API 错误码参考](/zh/guide/advanced/error-codes) 获取完整的错误类型说明与排查方案。
:::

```http
POST https://zenmux.ai/api/v1/systemone
```

System One 接口针对一段 `state`（待评估内容），按你定义的一组类型化 `questions`（问题）进行评估，并为每个问题返回一个结构化 `answer`（答案）。答案与问题通过你自定义的 key 一一对应。

`state`、`questions` 和 `assets` 的语义遵循 [TypeSafe System One API](https://docs.typesafe.ai/api/system-one)。通过 ZenMux 调用时，使用上方地址、ZenMux API Key 和 ZenMux 模型 ID。

每个问题可以是以下四种类型之一，同一请求可以混合使用：

- **noul**：是/否判定，返回答案为“是”的概率。
- **choice**：从你定义的选项集合中选择其一，返回选中项及完整概率分布。
- **score**：按你定义的分级标准打分，返回跨各分级的概率加权分值。
- **box**：定位图片中的一个目标，返回边界框坐标。

文本和结构化数据使用 `application/json`；上传图片使用 `multipart/form-data`，将 JSON 参数放在 `request` 分段中，图片作为独立文件分段上传。

## 请求头

### Authorization `string` <span style="color: #FA6062; font-weight: 400">\*</span>

Bearer Token 鉴权，格式为 `Bearer $ZENMUX_API_KEY`。

### Content-Type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

文本请求为 `application/json`；图片上传为 `multipart/form-data; boundary=...`。

## 请求参数

<ApiRequestBody v-slot="{ variant }">

<div v-show="variant === 'json'" data-request-variant="json">

将以下参数直接放入 JSON 请求体，适用于文本和结构化数据评估。上传图片请切换到 **multipart/form-data**。

</div>

<div v-show="variant === 'multipart'" data-request-variant="multipart">

将完整 JSON 作为第一个 `request` 分段发送，再依次添加图片文件。不要把 `model`、`state`、`questions` 拆成独立表单字段。

### request `string` <span style="color: #FA6062; font-weight: 400">\*</span>

序列化后的 JSON 参数，包含 `model`、`state`、`questions` 和 `assets`。必须是表单的第一个分段，且该分段的 Content-Type 为 `application/json`。

</div>

<details class="request-fields" :class="{ 'is-nested': variant === 'multipart' }" :open="variant === 'json'">
<summary v-show="variant === 'multipart'">查看 request 的 JSON 参数</summary>

### model `string` <span style="color: #FA6062; font-weight: 400">\*</span>

要使用的模型 ID，格式为 `<provider>/<model-name>`，例如 `typesafe/jev-latest`。

### state `string、object 或 array` <span style="color: #FA6062; font-weight: 400">\*</span>

待评估的内容。可以是纯文本 `string`，也可以是结构化数据（`object` / `array`），例如对话记录、业务记录或应用当前状态。

<div v-show="variant === 'multipart'" data-request-variant="multipart">

包含图片时，在字符串值中使用 `assets` 的引用 key。例如 `"state": {"photo": "<图片引用>"}`，再通过 `assets` 将该引用关联到上传文件。

</div>

### questions `object` <span style="color: #FA6062; font-weight: 400">\*</span>

一个非空的类型化问题映射（map）。key 由你自行指定，返回的答案会以相同的 key 归位。key 不会传递给底层模型，也不参与推理。

#### questions.\<question-id\> `object` <span style="color: #FA6062; font-weight: 400">\*</span>

一个类型化问题对象，使用 `type` 指定类型、`instructions` 描述任务。`criteria` 的要求取决于类型。

##### type `string` <span style="color: #FA6062; font-weight: 400">\*</span>

问题类型，取值为 `noul`、`choice`、`score` 或 `box`。

##### instructions `string、object 或 array` <span style="color: #FA6062; font-weight: 400">\*</span>

该问题需要模型判断的内容。

<div v-show="variant === 'multipart'" data-request-variant="multipart">

Box 的 `instructions` 要说明“找什么、在哪张图片里找”，例如 ``the red rectangle in `photo` ``。多图请求用字段路径区分图片，例如 ``the person in `frames[0].photo` ``。

</div>

##### criteria `object 或 array` <span style="color: #666; font-weight: 400; font-size: 14px"> 视类型而定 </span>

评判标准，其形态取决于 `type`：

- `noul`（可选）：`object`，用 `true` / `false` 分别描述“是”和“否”的含义。
- `choice`（必填）：`object`，将每个选项映射到对应的评判说明；无需额外说明时可置为 `null`。
- `score`（必填）：有序 `array`，按顺序描述各分级；至少包含两个分级。
- `box`：不使用 `criteria`。

<div v-show="variant === 'multipart'" data-request-variant="multipart">

### assets `object` <span style="color: #666; font-weight: 400; font-size: 14px"> 图片请求使用 </span>

图片资源映射，key 为图片引用，建议为每张图片使用一个 UUID。引用可以出现在 `state`、问题的 `instructions` 或 `criteria` 中，既可以是完整字符串，也可以嵌在字符串内部；对象的 key 不会被替换。

#### assets.\<reference\>.type `string`

图片资源类型，设为 `image`。

#### assets.\<reference\>.part `string`

该图片对应的文件分段名称，必须与 form-data 中上传图片的字段名完全一致，例如 `photo-file`。它与 `assets` 的引用 key 是两个不同的标识。

每个 asset 都必须在 `state`、`instructions` 或 `criteria` 的字符串值中被引用。相同图片只需上传一次；多处使用时重复引用同一个 key。引用是按文本匹配的，避免使用 `cat` 等可能意外匹配正文的短词。

</div>

</details>

<div v-show="variant === 'multipart'" data-request-variant="multipart">

### \<image-part\> `file` <span style="color: #666; font-weight: 400; font-size: 14px"> 图片文件 </span>

PNG 或 JPEG 图片文件；每张图片使用独立分段。字段名由 `assets.<reference>.part` 指定，例如 `photo-file`。每个文件分段必须且只能对应一个 asset。

建议设置 Content-Type 为 `image/png` 或 `image/jpeg`。图片分段放在 `request` 之后。

使用 cURL `-F`、Python `requests` 的 `files` 或 JavaScript `FormData` 时，让客户端自动生成外层 `Content-Type` 和 boundary。`request` 分段自身的 Content-Type 必须显式设为 `application/json`。

通过 ZenMux 发送 form-data 请求时，无需手动添加 `TypeSafe-Danger-Zone-Images: true`，ZenMux 会在向 TypeSafe 发起请求时自动添加。

::: info 图片与 Box
TypeSafe 当前将图片与 Box 标记为实验性能力（Dreamer-ready），格式、限制和识别效果可能随上游更新而变化。Box 需要支持该类型的视觉模型；下方图片示例使用 `typesafe/jev-1.14`。
:::

### form-data 上传规则

- 分段名必须唯一、非空，不能包含控制字符；`request` 保留给 JSON 分段。
- 每个图片分段必须且只能由一个 asset 的 `part` 指向。缺少文件、多传未关联文件或多个 asset 指向同一分段都会返回 `400`。
- 图片分段也接受 `image/jpg`、`application/octet-stream` 或不设置 Content-Type，实际文件仍须为 PNG/JPEG。
- 当前不支持压缩的 multipart 请求，不要设置 `Content-Encoding: gzip` 等压缩编码，否则返回 `415`。

### 图片与请求大小限制

以下为 [TypeSafe 图片规范](https://docs.typesafe.ai/images#limits) 中的限制。ZenMux 检查单个上传文件和整个 multipart 请求体的大小；图片解码、尺寸和引用展开等检查由 TypeSafe 完成。

| 项目 | 限制 |
| --- | --- |
| 图片格式 | PNG 或 JPEG 静态图，不支持动画 PNG |
| 单个图片文件 | 不超过 16 MiB |
| 宽、高 | 各为 280–1568 像素 |
| 总像素数 | 78,400–2,458,624 |
| 整个请求体 | 不超过 32 MiB，包含 JSON、文件和 multipart 分隔符及分段头，不含外层 HTTP 请求头 |
| 上游处理后的全部独立图片 | 合计不超过 32 MiB；重新编码后可能大于上传文件 |
| 引用展开后的请求 | 文本、问题、结构与图片合计不超过 32 MiB；同一图片的每次引用都计入 |
| 图片引用 key | 单个不超过 1,024 字节，合计不超过 65,536 字节，按 UTF-8 计；不能为空或仅含空白 |

1 MiB = 1,048,576 字节，数值范围包含端点。上游不会自动将超限图片缩放到合规尺寸；请在上传前调整图片大小，并将像素方向旋转正确，不要仅依赖 EXIF 方向信息。任一图片被拒绝时，整个请求失败。

多道问题使用同一图片时，建议在 `state` 中引用一次，问题通过字段路径访问它，减少重复展开和输入 Token 消耗。

::: warning 当前限制
32 MiB 是请求体大小上限。包含大量 `state` 文本或结构化数据的请求，即使未超过此上限，当前仍可能因内存限制失败。请精简内容或拆分请求；图片为主的请求通过不代表任意组成的 32 MiB 请求都能成功。
:::

</div>

</ApiRequestBody>

## 响应

返回包含结构化答案的 JSON 对象。

### model `string`

执行本次评估所使用的模型名称。

### answers `object`

答案映射，key 与请求中 `questions` 使用的 key 相同，每个问题对应一个答案。

#### answers.\<question-id\> `object`

与该问题 `type` 匹配的答案对象。`choice` 与 `score` 的 `confidence`（0 到 1）由答案的概率分布推导得出；Box 的 `confidence` 说明模型对定位结果的确信程度。

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
- **box 答案**
  - `type` `string` — 固定为 `box`。
  - `box` `object` — 包含 `top`、`bottom`、`left`、`right` 四条边，均为 0–1 的归一化坐标。
  - `confidence` `number | null` — 0–1 的定位确信度；模型未提供时为 `null`。

坐标以图片左上角为原点：`top`、`bottom` 是占图片高度的比例，`left`、`right` 是占图片宽度的比例。转换为像素时，横向坐标乘图片宽度，纵向坐标乘图片高度。

每道 Box 问题只返回一个框。**即使目标不存在，Box 仍会返回坐标，没有“未找到”的专用结果。** 建议同时询问一道 Noul 判断目标是否存在；存在概率较低时忽略 Box，不要仅凭返回框判断目标存在。置信度阈值应根据自己的图片样本确定。

### usage `object`

本次请求的 Token 用量信息。

- `input_tokens` `integer` — 输入消耗的 Token 数。
- `output_tokens` `integer` — 输出消耗的 Token 数。

图片用量包含在 `input_tokens` 中。价格以 [ZenMux 模型目录](https://zenmux.ai/models) 中的模型价格为准。

## 调用示例

示例提供 JSON 文本请求和图片上传两种用法。图片示例沿用 TypeSafe 的 `request` + 文件分段结构，同时询问 Noul 和 Box。准备符合上方尺寸限制、包含红色矩形的 `photo.png`，并设置环境变量 `ZENMUX_API_KEY`。TypeScript 图片示例使用 Node.js 20+ 的 `fetch`、`FormData` 和 `Blob`；Python 使用 `requests`。响应数值仅作示例，实际结果会变化。

::: api-request POST /api/v1/systemone

```cURL [application/json | JSON 文本评估]
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

```Python [application/json | JSON 文本评估]
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

```TypeScript [application/json | JSON 文本评估]
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


```json [application/json | JSON 文本评估]
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

```cURL [multipart/form-data | 上传图片并定位目标]
curl https://zenmux.ai/api/v1/systemone \
  -H "Authorization: Bearer $ZENMUX_API_KEY" \
  -F 'request={
  "model": "typesafe/jev-1.14",
  "state": {
    "photo": "0b719304-319a-4f83-a84e-55a9fb3e16b8"
  },
  "assets": {
    "0b719304-319a-4f83-a84e-55a9fb3e16b8": {
      "type": "image",
      "part": "photo-file"
    }
  },
  "questions": {
    "has_red_rectangle": {
      "type": "noul",
      "instructions": "Does the image in `photo` contain a red rectangle?"
    },
    "red_rectangle_location": {
      "type": "box",
      "instructions": "the red rectangle in `photo`"
    }
  }
};type=application/json' \
  -F 'photo-file=@photo.png;type=image/png'
```

```Python [multipart/form-data | 上传图片并定位目标]
import json
import os

import requests

body = {
  "model": "typesafe/jev-1.14",
  "state": {
    "photo": "0b719304-319a-4f83-a84e-55a9fb3e16b8"
  },
  "assets": {
    "0b719304-319a-4f83-a84e-55a9fb3e16b8": {
      "type": "image",
      "part": "photo-file"
    }
  },
  "questions": {
    "has_red_rectangle": {
      "type": "noul",
      "instructions": "Does the image in `photo` contain a red rectangle?"
    },
    "red_rectangle_location": {
      "type": "box",
      "instructions": "the red rectangle in `photo`"
    }
  }
}

with open("photo.png", "rb") as image:
    resp = requests.post(
        "https://zenmux.ai/api/v1/systemone",
        headers={"Authorization": f"Bearer {os.environ['ZENMUX_API_KEY']}"},
        files=[
            ("request", (None, json.dumps(body), "application/json")),
            ("photo-file", ("photo.png", image, "image/png")),
        ],
        timeout=60,
    )

resp.raise_for_status()
print(resp.json())
```

```TypeScript [multipart/form-data | 上传图片并定位目标]
import { readFile } from "node:fs/promises";

const body = {
  "model": "typesafe/jev-1.14",
  "state": {
    "photo": "0b719304-319a-4f83-a84e-55a9fb3e16b8"
  },
  "assets": {
    "0b719304-319a-4f83-a84e-55a9fb3e16b8": {
      "type": "image",
      "part": "photo-file"
    }
  },
  "questions": {
    "has_red_rectangle": {
      "type": "noul",
      "instructions": "Does the image in `photo` contain a red rectangle?"
    },
    "red_rectangle_location": {
      "type": "box",
      "instructions": "the red rectangle in `photo`"
    }
  }
};

const form = new FormData();
form.append(
  "request",
  new Blob([JSON.stringify(body)], { type: "application/json" }),
  "request.json",
);
form.append(
  "photo-file",
  new Blob([await readFile("photo.png")], { type: "image/png" }),
  "photo.png",
);

const resp = await fetch("https://zenmux.ai/api/v1/systemone", {
  method: "POST",
  headers: { Authorization: `Bearer ${process.env.ZENMUX_API_KEY}` },
  body: form,
});

if (!resp.ok) {
  throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
}
console.log(await resp.json());
```

```json [multipart/form-data | 上传图片并定位目标]
{
  "model": "typesafe/jev-1.14",
  "answers": {
    "has_red_rectangle": {
      "type": "noul",
      "noul": 0.98
    },
    "red_rectangle_location": {
      "type": "box",
      "box": {
        "top": 0.26,
        "bottom": 0.74,
        "left": 0.22,
        "right": 0.78
      },
      "confidence": 0.94
    }
  },
  "usage": {
    "input_tokens": 1162,
    "output_tokens": 40
  }
}
```

:::
