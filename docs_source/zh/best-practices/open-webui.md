---
head:
  - - meta
    - name: description
      content: 通过 ZenMux 使用 Open WebUI 指南
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, open, webui, OpenAI, API
---

# 通过 ZenMux 使用 Open WebUI 指南

Open WebUI 是一款可扩展、功能丰富且用户友好的自托管人工智能平台，专为完全离线运行而设计。该平台支持 Ollama 及 OpenAI 兼容 API 等多种大语言模型运行器，并内置 RAG 推理引擎，是功能强大的 AI 部署解决方案。

::: info 兼容性说明
ZenMux 完全支持 OpenAI API 协议，只需简单配置即可使用。

注意 OpenAI 协议的 base_url="https://zenmux.ai/api/v1"。
:::

## 配置方案

### 安装 Open WebUI

::: tip 参考
[OpenWebUI 官方文档](https://docs.openwebui.com/getting-started/quick-start/)
:::


### 配置外部链接

1. 点击 **⚙️ 管理员设置**
2. 前往 **设置** > **外部链接** > **OpenAI API** > **管理 OpenAI API 连接**
3. 点击 **➕** 新建外部链接
4. 输入 **URL**："https://zenmux.ai/api/v1"
5. 输入 **API 秘钥**：ZenMux API Key
6. 点击 **保存**

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/11/04/MLVhRJM/OpenWebUI.jpg" 
       alt="Cost details" 
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

### 开始使用

1. 点击新对话
2. 左上角选择模型
3. 开始对话

::: tip 模型选择
Open WebUI 自动同步所有 ZenMux 模型，并且默认选中其中一个
:::

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/11/04/SbjC2PU/OpenWebUI_chat.jpg" 
       alt="Cost details" 
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>
