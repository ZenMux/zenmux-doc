---
head:
  - - meta
    - name: description
      content: Sider Integration Guide
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, sider, OpenAI, Anthropic, Claude, API
---

# Sider Integration Guide

Sider is a powerful browser AI assistant extension that provides convenient AI services in a sidebar. It supports multiple AI capabilities, including writing, reading, chatting about any topic, and even generating content summaries. By configuring ZenMux, you can access a broader selection of models beyond the base models provided by Sider.

## Configuration Steps

### 1. Get a ZenMux API Key

Go to the [ZenMux Console](https://zenmux.ai/settings/keys) to create and retrieve your API Key.

### 2. Install the Sider Extension

1. Search for "Sider" in your browser’s extension store
2. Install and enable the extension
3. Open the extension’s Options page

### 3. Configure the OpenAI Service

::: tip Configuration Notes
You only need to configure OpenAI to unlock all ZenMux models.
:::

In Sider settings:

1. Select Custom Key: General -> AI Access -> Service Provider -> [Sider -> Custom API Key]
2. Select Service Provider: choose `OpenAI`, then click Settings
3. Set Key: enter your API Key
::: warning Important
Please ensure you select ZenMux as your API provider, rather than other providers.
:::
4. Set API Base URL: `https://zenmux.ai/api/v1`
5. Check Connection: click “Check” After a few seconds, when “Connection successful” appears, the configuration is complete.

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/11/02/MUzNI3A/sider-openai-setting.png"
       alt="Sider OpenAI Settings"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

6. Usage: In Sider’s model list, select the model you need.
<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/11/04/N1bvDth/sider-result.png"
       alt="Sider OpenAI Settings"
       style="width: 100%; max-width: 400px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px auto;"
       loading="lazy" />
</div>

#### 4. Supported Models
ZenMux provides a wide range of models for Sider. Check the [ZenMux Model List](https://zenmux.ai/models) to see all available models.


## Troubleshooting

### Common Issues

::: details API Key Error
Problem: Connection failed. Please check your API key and proxy settings.

Solution:

- Check whether the ZenMux API Key in your environment variables is correct
- Ensure the API Key is activated and has sufficient balance
- Verify the API Key format starts with `sk-ai-v1-`
:::

::: details Proxy URL Misconfiguration
Problem: Connection failed. Please check your API key and proxy settings.

Recommendation: We recommend selecting OpenAI. Once configured successfully, you can access all models provided by ZenMux without configuring other models separately in Sider.

Solution:
- Confirm that `OpenAI` is selected as the service provider
- Verify the URL is: `https://zenmux.ai/api/v1` 

Other model connections:

We also support connecting to our model service in Sider by configuring certain other model providers. The result is identical to connecting via OpenAI. You need to modify the following settings:

| Model | API Proxy URL | 
|----------|----------|
| **DeepSeek** | `https://zenmux.ai/api/v1`  |
| **Groq** | `https://zenmux.ai/api/v1` | 
| **Google (Gemini)** | `https://zenmux.ai/api/v1` | 
| **Anthropic (Claude)** | `https://zenmux.ai/api` | 

:::

::: details Model List Missing or Incomplete
Problem: The complete ZenMux model list is not visible in Sider.

Solution:

- Re-save the API configuration in Sider settings
- Click “Update list” on the right side of the model list to refresh
- Try clicking the “+” button on the right to add models supported by ZenMux
- Check the ZenMux Console to confirm the API Key’s permissions are valid
- Contact ZenMux to confirm service status

::: tip Models
View all available models via the [ZenMux Model List](https://zenmux.ai/models)
:::




## Contact Us

If you encounter any issues during use, or have any suggestions or feedback, feel free to contact us through the following channels:

::: tip Get Help

- Official Website: <https://zenmux.ai>
- Technical Support Email: [support@zenmux.ai](mailto:support@zenmux.ai)
- Business Inquiries Email: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- Twitter: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- Discord Community: <http://discord.gg/vHZZzj84Bm>

For more contact options and details, please visit our [Contact Us page](/help/contact).
:::
