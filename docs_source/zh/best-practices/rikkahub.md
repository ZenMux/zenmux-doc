---
head:
  - - meta
    - name: description
      content: 通过 ZenMux 使用 RikkaHub 指南
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, RikkaHub, OpenAI, API, Android
---

# 在RikkaHub配置zenmux指南

RikkaHub 是一款功能丰富的 Android AI 助手客户端，支持多种大语言模型服务商的接入。通过与 ZenMux 的集成，您可以在 RikkaHub 中访问 ZenMux 平台上聚合的海量模型资源，享受更灵活的模型选择和更优惠的价格。

::: info 兼容性说明
ZenMux 完全支持 OpenAI Chat Completions 协议，可以无缝集成到 RikkaHub 等支持自定义 OpenAI 兼容端点的客户端中。只需添加 ZenMux 作为模型提供商，即可使用所有支持 OpenAI 协议的模型。


:::

## 配置方案

### 步骤 1：下载并安装 RikkaHub

前往 [RikkaHub GitHub Releases](https://github.com/rikkahub/rikkahub) 下载最新版本的 APK 并安装到您的 Android 设备上。

### 步骤 2：添加 ZenMux 模型提供商

1. 打开 RikkaHub，进入 **设置** 

2. 点击**providers**，点击右上方"+"添加provider

3. 选择添加一个 **OpenAI 兼容** 类型的提供商，并填写以下信息：

   - **名称**: `ZenMux`（或您偏好的名称）
   - **API Key**: 填入您的 ZenMux API Key（订阅制api格式为 `sk-ss-v1-xxx`,Pay As You Go API Key格式为`sk-ai-v1-xxx`）
   - **API Base URL**: `https://zenmux.ai/api/v1`
   - **API Path**:/chat/completions

4. 点击右下角的models，会发现在下方的add new model的左侧有个图标显示有数字角标（代表拉取过来的模型，如果没有，请检查网络设置或者是按照openai兼容来配置），点击该图标，搜索并添加所需要的模型，保存后返回即可使用

5. 注意通过openai兼容格式拉取模型不包含gemini生图模型，如若不想配置gemini生图模型，请忽略如下几步

6. 为了配置gemini生图模型，请点击models页面的add new model，在basic settings配置如下：

   - **model ID**: 例如`googlelgemini-3.1-flash-image-preview`（模型id可到https://zenmux.ai/models?sort=newest去复制相应的模型slug）
   - **model name**: 填入您的模型名称，例如nanobanana2（或者您偏好的名称）
   - **model type**: 选择chat
   - **Input Modality**:选择text和image
   - **Output Modality**:选择text和image
   - **Abilities**:选择reasoni，不要选择tool，否则会报错

7.随后点击页面上方的Advanced Settings,点击add provider override，页面上方选择Google，以此来覆盖openai协议，配置如下：

   - **名称**: `ZenMux`（或您偏好的名称）
   - **API Key**: 填入您的 ZenMux API Key（订阅制api格式为 `sk-ss-v1-xxx`,Pay As You Go API Key格式为`sk-ai-v1-xxx`）
   - **API Base URL**: `https://zenmux.ai/api/vertex-ai/v1beta`，点击save后，再次点击confirm即可返回使用
   - 注意在configure provider override这一步中，vertex ai不要打对钩


::: warning 重要配置
请确保将 `sk-ss-v1-xxx`或者`sk-ai-v1-xxx` 替换为您的真实 ZenMux API Key。您可以在 [ZenMux 控制台](https://zenmux.ai/platform/pay-as-you-go或者https://zenmux.ai/platform/subscription) 中获取 API Key。
:::

::: tip 配置说明

- **API Key**: 您的 ZenMux API Key，用于身份认证和计费
- **API Base URL**: ZenMux OpenAI 兼容端点地址或者Google 兼容端点地址

:::

### 步骤 3：选择模型并开始对话

配置完成后，您可以在 RikkaHub 的模型列表中选择 ZenMux 提供的模型，开始对话。


:::

## 常见问题

### 连接失败怎么办？

1. 确认 API Key 是否正确，可以在 [ZenMux 控制台](https://zenmux.ai/settings/keys) 中查看
2. 确认 API Base URL是否正确
3. 检查设备的网络连接是否正常

### 模型列表为空？

请确认您使用的是 OpenAI 兼容模式接入，ZenMux 会通过 `/v1/models` 端点返回所有可用模型列表。

## 相关链接

- [ZenMux 快速开始](/zh/guide/quickstart)
- [ZenMux API Key 管理](https://zenmux.ai/settings/keys)
