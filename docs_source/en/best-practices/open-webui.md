---
head:
  - - meta
    - name: description
      content: Guide to Using Open WebUI with ZenMux
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, open, webui, OpenAI, API
---

# Guide to Using Open WebUI with ZenMux

Open WebUI is an extensible, feature-rich, and user-friendly self-hosted AI platform designed to run fully offline. It supports multiple large language model runtimes such as Ollama and OpenAI-compatible APIs, and includes a built-in RAG inference engine, making it a powerful solution for AI deployment.

::: info Compatibility Notes
ZenMux fully supports the OpenAI API protocol and can be used with minimal configuration.

Note the OpenAI protocol base_url="https://zenmux.ai/api/v1".
:::

## Configuration

### Install Open WebUI

::: tip Reference
[OpenWebUI Official Documentation](https://docs.openwebui.com/getting-started/quick-start/)
:::

### Configure External Links

1. Click **⚙️ Admin Panel**
2. Go to **Settings** > **Connections** > **OpenAI API** > **Manage OpenAI API Connections**
3. Click **➕** Create New External Link
4. Enter **URL**: "https://zenmux.ai/api/v1"
5. Enter **API Key**: ZenMux API Key
6. Click **Save**

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/11/04/dYay14D/OpenWebUI_en.jpg" 
       alt="Cost details" 
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

### Get Started

1. Click New Chat
2. Select a model from the top-left
3. Start chatting

::: tip Model Selection
Open WebUI automatically syncs all ZenMux models and selects one by default.
:::

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/11/04/lP1UBK1/OpenWebUI_chat_en.jpg" 
       alt="Cost details" 
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>