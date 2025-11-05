# Guide to Using Obsidian Copilot via ZenMux

Obsidian Copilot is a powerful AI assistant plugin. Through its integration with ZenMux, you can use multiple advanced AI models within your Obsidian notes for a smarter writing and thinking experience.

::: info Compatibility Note
ZenMux fully supports the OpenAI API protocol and can be seamlessly integrated into the Obsidian Copilot plugin. Minimal configuration is required.

Note that the OpenAI protocol base_url="https://zenmux.ai/api/v1".
:::

## Installation and Configuration

### 1. Install Obsidian

Go to the [Obsidian website](https://obsidian.md) to download and install the Obsidian desktop app.

::: tip System Support
Obsidian supports Windows, macOS, and Linux. Choose the version appropriate for your system.
:::

### 2. Install the Copilot Plugin

1. Open the Obsidian app
2. Click the Settings icon (gear icon) in the bottom-left corner
3. In the Settings page, find **Community plugins**
4. Click the **Browse** button to open the plugin community

![Browse community plugins](https://github.com/user-attachments/assets/f451933a-66c9-433b-a8e2-4f42e5449e09)
![Search community plugins](https://github.com/user-attachments/assets/094a4a7a-dae7-413e-bcab-d66241a08db7)

1. Enter **copilot** in the search box
2. Find the **Obsidian Copilot** plugin and click **Install**

![Install Copilot plugin](https://github.com/user-attachments/assets/de363fa9-1d14-487a-992c-fa71659e3c8a)

1. After installation, click **Enable** to activate the plugin

### 3. Configure ZenMux Models

#### Get Your ZenMux API Key

::: warning Important Configuration
Before configuration, you need to obtain a ZenMux API Key. Visit the [ZenMux Console](https://zenmux.ai/settings/keys) to create or view your API Key.
:::

#### Add a Custom Model

1. Open the Obsidian Settings page
2. In the left menu, find **Community plugins** → **Copilot** plugin settings
3. Click the **Models** tab
4. Click the **Add model** button

![Add model button](https://github.com/user-attachments/assets/d511c698-c837-4759-8001-979b9abbdf4b)

#### Fill in the Model Configuration

In the pop-up configuration form, fill in the fields as follows:

![Model list page](https://github.com/user-attachments/assets/d17f7e8f-c500-4bad-909b-377b4387a551)

- **Provider**: Select `OpenAI`
- **Base URL**: Enter `https://zenmux.ai/api/v1`
- **API Key**: Enter your ZenMux API Key (starts with `sk-ai-v1-`)
- **Model ID**: Enter the model slug on ZenMux that supports the OpenAI Chat-Completion protocol

### 4. Test the Model Connection

After configuration, click the **Test** button to verify connectivity:

If configured correctly, you will see a success message. If the connection fails, see the [Troubleshooting](#troubleshooting) section.

## Using Copilot

### Launch the Chat Interface

After configuration, you can use Copilot in the following way:

1. Click the Copilot icon (robot icon) in the left sidebar
2. Open the chat interface
3. Select your configured ZenMux model in the model selector

![Use Copilot chat](https://github.com/user-attachments/assets/a0cec736-e2e7-4b55-8c79-4dd653d7b5f4)
![Select model](https://github.com/user-attachments/assets/1da9b79f-c45e-4aae-b116-a9bc8c896aa2)

## Troubleshooting

### Common Issue Resolution

::: details API Key Error
**Issue**: API Key is invalid or authentication failed

**Solution**:

- Check whether the API Key was copied correctly and ensure there are no extra spaces
- Verify the API Key format starts with `sk-ai-v1-`
- Confirm the API Key is active and has sufficient balance
- Check the API Key status in the [ZenMux Console](https://zenmux.ai/settings/keys)
  :::

::: details Connection Failure
**Issue**: Copilot cannot connect to the ZenMux service

**Solution**:

- Check if your network connection is working properly
- Verify the Base URL is configured as `https://zenmux.ai/api/v1` (note it is `/v1` and not `/anthropic`)
- Confirm your firewall or proxy settings are not blocking the connection
- Try accessing <https://zenmux.ai> in a browser to confirm the service is reachable
  :::

::: details Model Unavailable
**Issue**: The model is reported as non-existent or does not support the OpenAI protocol

**Solution**:

- Check that the Model ID is correct, paying attention to case and spelling
- Common mistake: `anthropic/claude-hiku-4.5-sonnet` should be `anthropic/claude-haiku-4.5` (haiku, not hiku)
- Visit the [ZenMux Model List](https://zenmux.ai/models) and filter by "OpenAI API Compatible" to view available models
- Confirm the selected model supports the OpenAI Chat-Completion protocol
  :::

::: details Test Succeeds but Fails During Use
**Issue**: Connection test succeeds, but errors occur during actual use

**Solution**:

- Check that your API Key has sufficient balance
- Verify the model capability settings are correct (Chat, Streaming, etc.)
- Open the Obsidian Developer Console (`Ctrl/Cmd + Shift + I`) for detailed error messages
- Try switching to another model to test whether it is a model-specific issue
  :::

::: details Slow Response or Timeout
**Issue**: AI responses take too long or requests time out

**Solution**:

- Check your network connection quality
- Try faster models such as `anthropic/claude-haiku-4.5` or `deepseek/deepseek-chat`
- Reduce the text length per conversation
- Adjust timeout parameters in Copilot settings
  :::

::: details Plugin Configuration Lost
**Issue**: Configuration is lost after restarting Obsidian

**Solution**:

- Ensure the Copilot plugin is properly enabled
- Check permissions for the `.obsidian/plugins/obsidian-copilot/` directory in your Obsidian vault
- Try reinstalling the Copilot plugin
- Back up important configurations to avoid accidental loss
  :::

::: tip Contact Us
If you encounter any issues during use, or have suggestions and feedback, feel free to contact us:

- **Official Website**: <https://zenmux.ai>
- **Technical Support Email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business Cooperation Email**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord Community**: <http://discord.gg/vHZZzj84Bm>

For more contact methods and details, please visit our [Contact Us page](/help/contact).
:::