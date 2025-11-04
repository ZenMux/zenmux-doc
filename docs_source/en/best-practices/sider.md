# Sider Integration Guide

Sider is a powerful browser AI assistant extension that provides convenient AI services to users in the form of a sidebar. It supports various AI functions including: writing, reading, chatting about any topic, and even creating content summaries. By configuring ZenMux, you can access more model choices beyond the basic models provided by Sider.

## Configuration Steps

### 1. Get Your ZenMux API Key

Go to [ZenMux Console](https://zenmux.ai/settings/keys) to create and obtain your API Key.

### 2. Install Sider Extension

1. Search for "Sider" in your browser's extension store
2. Install the extension and enable it
3. Open the extension's "Options" page

### 3. Configure OpenAI Service

::: tip Configuration Note
You only need to configure OpenAI to unlock all models available through ZenMux.
:::

In Sider's settings:

1. **Select Custom Key**: General Configuration -> AI Access -> Service Provider -> [Sider -> Custom API Key]
2. **Choose Service Provider**: Select `OpenAI`, click Settings
3. **Set Key**: Enter your API Key
::: warning Important Note
Please ensure you select ZenMux as your API provider, not other suppliers.
:::
4. **Set API URL**: `https://zenmux.ai/api/v1`
5. **Test Connection**: Click "Check", wait a few seconds, and you should see: "Connection successful" - configuration complete

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/11/02/MUzNI3A/sider-openai-setting.png"
       alt="Sider OpenAI Settings"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

#### 4. Supported Models
ZenMux provides a rich selection of models for OpenCode. Below is a list of recommended models for use in Sider scenarios (continuously updated):

##### Recommended Models for Sider
| Use Case | Recommended Model | Reason |
|----------|------------------|--------|
| **Code Programming** | GPT-5 Codex, Claude Sonnet 4.5 | Professional code understanding, software engineering optimization |
| **Academic Research** | Claude Opus 4.1, GPT-4.1 | Excellent for complex reasoning and long text processing |
| **Creative Writing** | GPT-5 Pro, Qwen3-Max | Beautiful writing style, rich creativity |
| **Real-time Conversation** | GPT-4.1 Nano, Claude Haiku 4.5 | Fast response |

::: tip All Models
Other models are also supported. View all available models through [ZenMux Model List](https://zenmux.ai/models)
:::

## Troubleshooting

### Common Problem Solutions

::: details API Key Error
**Problem**: Connection failed. Please check your API key and proxy settings.

**Solution**:

- Check if the ZenMux API Key in your environment variables is correct
- Confirm that the API Key is activated and has sufficient balance
- Verify that the API Key format starts with `sk-ai-v1-`
:::

::: details Proxy URL Setting Error
**Problem**: Connection failed. Please check your API key and proxy settings.

**Suggestion**: We recommend selecting OpenAI. After successful configuration, you can access all model support provided by ZenMux without needing to configure other models separately in Sider.

**Solution**:
- Confirm that `OpenAI` is selected as the service provider
- Verify the URL is: `https://zenmux.ai/api/v1`

**Other Model Connections**:

Of course, we also support accessing our model services through some other model configurations in Sider. The effect is the same as directly connecting to OpenAI. You need to modify the following configuration:

| Model | API Proxy URL |
|----------|----------|
| **DeepSeek** | `https://zenmux.ai/api/v1` |
| **Groq** | `https://zenmux.ai/api/v1` |
| **Google (Gemini)** | `https://zenmux.ai/api/v1` |
| **Anthropic (Claude)** | `https://zenmux.ai/api` |

:::

::: details Model List Not Displaying or Incomplete
**Problem**: Cannot see the complete ZenMux model list in Sider

**Solution**:

- Re-save the API configuration in Sider settings
- Click "Update list" on the right side of the model list to refresh
- Try clicking "+" on the right to add ZenMux-supported models
- Check the ZenMux console to confirm API Key permissions are normal
- Contact ZenMux to confirm service status

::: tip Models
View all available models through [ZenMux Model List](https://zenmux.ai/models)
:::

## Contact Us

If you encounter any problems during use, or have any suggestions and feedback, please contact us through the following methods:

::: tip Get Help

- **Official Website**: <https://zenmux.ai>
- **Technical Support Email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business Cooperation Email**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord Community**: <http://discord.gg/vHZZzj84Bm>

For more contact methods and detailed information, please visit our [Contact Us page](/en/help/contact).
:::