---
head:
  - - meta
    - name: description
      content: 视频生成
  - - meta
    - name: keywords
      content: Zenmux, guide, tutorial, video, generation, API, Veo, Seedance
---

# 视频生成

ZenMux 支持通过 Vertex AI 协议调用视频生成模型。本指南将介绍如何使用 ZenMux 生成视频。

::: tip 💡 关于视频生成
视频生成模型能够根据文本描述自动生成高质量视频内容。ZenMux 聚合了 Google Veo 和字节跳动 Seedance 等主流视频生成模型，让您通过统一的 API 接口轻松调用。
:::

## 支持的模型

目前支持的视频生成模型包括（持续更新中）：

- `google/veo-3.1-generate-001` — Google Veo 3.1，支持高质量视频生成
- `volcengine/doubao-seedance-1.5-pro` — 字节跳动 Seedance 1.5 Pro
- `volcengine/doubao-seedance-2` — 字节跳动 Seedance 2，最新一代视频生成模型

::: tip 📚 更多模型
访问 [ZenMux 模型列表](https://zenmux.ai/models) 搜索查看所有可用的视频生成模型。
:::

## 文生视频

通过文本提示词直接生成视频，采用异步方式调用：先提交生成请求，然后轮询等待生成完成，最后获取结果。

::: code-group

```Python [Google Veo 3.1]
from google import genai
from google.genai import types
import time

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # 替换为你的 API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai"
    )
)

# Step 1: 提交视频生成请求
operation = client.models.generate_videos(
    model="google/veo-3.1-generate-001",  # [!code highlight]
    prompt="A golden retriever running on the beach at sunset"
)

# Step 2: 轮询等待生成完成
while not operation.done:
    time.sleep(15)
    operation = client.operations.get(operation)

# Step 3: 获取生成结果
for video in operation.response.generated_videos:
    print(video)
```

```Python [Seedance 1.5 Pro]
from google import genai
from google.genai import types
import time

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # 替换为你的 API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai"
    )
)

# Step 1: 提交视频生成请求
operation = client.models.generate_videos(
    model="volcengine/doubao-seedance-1.5-pro",  # [!code highlight]
    prompt="A golden retriever running on the beach at sunset"
)

# Step 2: 轮询等待生成完成
while not operation.done:
    time.sleep(15)
    operation = client.operations.get(operation)

# Step 3: 获取生成结果
for video in operation.response.generated_videos:
    print(video)
```

```Python [Seedance 2]
from google import genai
from google.genai import types
import time

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # 替换为你的 API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai"
    )
)

# Step 1: 提交视频生成请求
operation = client.models.generate_videos(
    model="volcengine/doubao-seedance-2",  # [!code highlight]
    prompt="A golden retriever running on the beach at sunset"
)

# Step 2: 轮询等待生成完成
while not operation.done:
    time.sleep(15)
    operation = client.operations.get(operation)

# Step 3: 获取生成结果
for video in operation.response.generated_videos:
    print(video)
```

:::

## 图生视频

除了文生视频，还支持传入一张图片作为起始帧，结合文本提示词生成视频。通过 `image` 参数传入图片数据即可。

::: code-group

```Python [Google Veo 3.1]
from google import genai
from google.genai import types
import time

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # 替换为你的 API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai"
    )
)

# 读取本地图片
with open("input_image.png", "rb") as f:
    image_bytes = f.read()

# Step 1: 提交图生视频请求
operation = client.models.generate_videos(
    model="google/veo-3.1-generate-001",  # [!code highlight]
    image=types.Image(image_bytes=image_bytes, mime_type="image/png"),  # [!code highlight]
    prompt="The dog stands up and runs toward the ocean waves"
)

# Step 2: 轮询等待生成完成
while not operation.done:
    time.sleep(15)
    operation = client.operations.get(operation)

# Step 3: 获取生成结果
for video in operation.response.generated_videos:
    print(video)
```

```Python [Seedance 1.5 Pro]
from google import genai
from google.genai import types
import time

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # 替换为你的 API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai"
    )
)

# 读取本地图片
with open("input_image.png", "rb") as f:
    image_bytes = f.read()

# Step 1: 提交图生视频请求
operation = client.models.generate_videos(
    model="volcengine/doubao-seedance-1.5-pro",  # [!code highlight]
    image=types.Image(image_bytes=image_bytes, mime_type="image/png"),  # [!code highlight]
    prompt="The dog stands up and runs toward the ocean waves"
)

# Step 2: 轮询等待生成完成
while not operation.done:
    time.sleep(15)
    operation = client.operations.get(operation)

# Step 3: 获取生成结果
for video in operation.response.generated_videos:
    print(video)
```

```Python [Seedance 2]
from google import genai
from google.genai import types
import time

client = genai.Client(
    api_key="$ZENMUX_API_KEY",  # 替换为你的 API Key
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai"
    )
)

# 读取本地图片
with open("input_image.png", "rb") as f:
    image_bytes = f.read()

# Step 1: 提交图生视频请求
operation = client.models.generate_videos(
    model="volcengine/doubao-seedance-2",  # [!code highlight]
    image=types.Image(image_bytes=image_bytes, mime_type="image/png"),  # [!code highlight]
    prompt="The dog stands up and runs toward the ocean waves"
)

# Step 2: 轮询等待生成完成
while not operation.done:
    time.sleep(15)
    operation = client.operations.get(operation)

# Step 3: 获取生成结果
for video in operation.response.generated_videos:
    print(video)
```

:::

::: tip 💡 图生视频说明

- `image` 参数通过 `types.Image` 传入，支持 `image_bytes`（二进制数据）和 `mime_type`（如 `image/png`、`image/jpeg`）
- `prompt` 参数为可选，用于描述图片中的内容应如何运动或变化
- 图片将作为视频的起始帧，模型会基于图片内容和提示词生成后续动画
  :::

## 配置说明

### 必需参数

- **api_key**: 你的 ZenMux API 密钥
- **vertexai**: 必须设置为 `true` 以启用 Vertex AI 协议
- **base_url**: ZenMux Vertex AI 端点 `https://zenmux.ai/api/vertex-ai`
- **model**: 视频生成模型名称，如 `google/veo-3.1-generate-001`
- **prompt**: 描述要生成的视频内容的文本提示词

### 可选参数

通过 `config` 参数可以自定义视频的尺寸、时长、音频等属性：

| 参数              | 类型   | 说明           | 示例值                      |
| ----------------- | ------ | -------------- | --------------------------- |
| `aspectRatio`     | `str`  | 视频宽高比     | `"16:9"`、`"9:16"`、`"1:1"` |
| `resolution`      | `str`  | 视频分辨率     | `"720p"`、`"1080p"`         |
| `durationSeconds` | `int`  | 视频时长（秒） | `5`、`8`、`10`              |
| `generateAudio`   | `bool` | 是否生成音频   | `True`、`False`             |

**配置示例：**

```python
operation = client.models.generate_videos(
    model="google/veo-3.1-generate-001",
    prompt="A cat playing piano in a cozy room with warm lighting",
    config=types.GenerateVideosConfig(
        aspectRatio="16:9",       # 横屏 16:9  # [!code highlight]
        resolution="720p",        # 720p 分辨率  # [!code highlight]
        durationSeconds=8,        # 视频时长 8 秒  # [!code highlight]
        generateAudio=True,       # 生成带音频的视频  # [!code highlight]
    )
)
```

::: tip 💡 参数支持说明
不同模型对可选参数的支持范围可能有所不同。如果传入了模型不支持的参数值，API 将返回错误信息。建议先使用默认参数测试，再逐步调整。
:::

### 调用流程

视频生成是一个异步过程，分为三个步骤：

1. **提交请求** (`generate_videos`): 发送视频生成请求，返回一个 `operation` 对象
2. **轮询状态** (`operations.get`): 定期检查生成状态，建议间隔 15 秒
3. **获取结果**: 当 `operation.done` 为 `True` 时，从 `operation.response.generated_videos` 获取视频

::: warning ⚠️ 生成耗时
视频生成通常需要较长时间（几十秒到几分钟不等），请耐心等待轮询完成，不要设置过短的轮询间隔。
:::

## 最佳实践

1. **提示词优化**: 使用清晰、具体的视频场景描述，包含主体、动作、环境和光线等要素
2. **轮询间隔**: 建议设置 15 秒的轮询间隔，避免过于频繁的请求
3. **错误处理**: 建议添加异常处理和超时机制，防止无限轮询
4. **模型选择**: 根据需求选择合适的模型 — Veo 3.1 擅长高质量通用视频，Seedance 系列在特定场景下有独特优势
