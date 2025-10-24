# 使用 LiteLLM 调用 ZenMux 模型平台

ZenMux是一个OpenAI兼容的模型平台，支持40+主流模型的快速调用。LiteLLM 是一个轻量级的开源库，为开发者提供了统一、标准化的接口来调用各类大语言模型服务。它原生支持 OpenAI API 协议，并可无缝对接任何 **OpenAI 兼容的推理端点**。
本文将指导您如何使用 LiteLLM 的官方Python SDK，访问ZenMux平台上的大语言模型。

---

## 准备工作

### 获取 ZenMux API Key

::: tip 获取 API Key
访问 [ZenMux 控制台](https://zenmux.ai/settings/keys) 注册账户并获取您的 API Key
:::

---

## 配置 LiteLLM 调用 ZenMux 模型

ZenMux平台提供的模型调用方式是OpenAI兼容的，在使用LiteLLM调用ZenMux时，可直接复用调用原生OpenAI模型的方式，只需把base_url、api_key 和 model替换为ZenMux平台对应的值即可，以下为详细步骤：

### 安装 LiteLLM

使用 pip 安装 LiteLLM：

```bash
pip install litellm
```

### 设置环境变量（推荐）

首先通过环境变量指定调用ZenMux平台时的base_url和api_key：

```bash
export OPENAI_API_BASE="https://zenmux.ai/api/v1"
export OPENAI_API_KEY="your-api-key"  
```

> 🔒 安全建议：请勿将 API 密钥硬编码在代码中，优先使用环境变量或密钥管理服务。

### 调用模型

使用LiteLLM python SDK 的`completion()` 函数调用ZenMux平台的大模型

*非流式调用*

```python
from litellm import completion

response = completion(
    model="openai/inclusionai/ling-1t",  
    # 格式形如 openai/<model name>，其中'openai'固定，代表 OpenAI 格式兼容的协议
    # <model name>为ZenMux平台模型名称，示例中使用的是inclusionai/ling-1t
    messages=[{"role": "user", "content": "Hello!"}],
    api_base="https://zenmux.ai/api/v1",    # 可选，若已设置环境变量，此处可省略
    api_key="your-api-key"  # 可选，若已设置环境变量，此处可省略
)
print(response.choices[0].message.content)
```
*流式调用*
```python
from litellm import completion

response = completion(
    model="openai/inclusionai/ling-1t",  
    # 格式形如 openai/<model name>，其中的openai代表 OpenAI 格式兼容的模型
    # 此处的inclusionai/ling-1t为ZenMux平台的模型名称
    messages=[{"role": "user", "content": "Hello!"}],
    api_base="https://zenmux.ai/api/v1",    # 可选，若已设置环境变量，此处可省略
    api_key="your-api-key",  # 可选，若已设置环境变量，此处可省略
    stream=True
)

for chunk in response:
    print(chunk["choices"][0]["delta"].get("content", ""), end="", flush=True)
```
---

## 参考资源

- LiteLLM 官方文档：https://docs.litellm.ai/
- OpenAI API 兼容性规范：https://platform.openai.com/docs/api-reference
- LiteLLM GitHub：https://github.com/BerriAI/litellm
---