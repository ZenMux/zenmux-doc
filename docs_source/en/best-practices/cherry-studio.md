---
head:
  - - meta
    - name: description
      content: Guide to Using Cherry Studio via ZenMux
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, cherry, studio, OpenAI, API
---

# Guide to Using Cherry Studio via ZenMux

Cherry Studio is an elegant cross-platform AI desktop client that supports multiple mainstream large language model services. Through integration with ZenMux, you can access the extensive model catalog aggregated on the ZenMux platform within Cherry Studio, enjoying more flexible model selection and better pricing.

::: info Compatibility Notes
ZenMux fully supports the OpenAI Chat Completions protocol and can be seamlessly integrated into clients like Cherry Studio that support custom OpenAI-compatible endpoints. Simply add ZenMux as a model provider to use all models that support the OpenAI protocol.

Note that the base_url for the OpenAI protocol is `https://zenmux.ai/api/v1/`.
:::

## Configuration

### Step 1: Download and Install Cherry Studio

Go to the [Cherry Studio official site](https://www.cherry-ai.com) to download the version for your operating system and complete the installation.

### Step 2: Add the ZenMux Model Provider

1. Open Cherry Studio and go to the **Settings → Model Provider** page

2. Click the **Add** button to add a new model provider

3. Fill in the following details in the configuration dialog:

   - **Provider Name**: `ZenMux` (or any preferred name)
   - **Provider Type**: select `OpenAI`
   - **API Key**: enter your ZenMux API Key (format `sk-ai-v1-xxx`)
   - **API Host**: `https://zenmux.ai/api/v1/`

![Add ZenMux Provider](https://github.com/user-attachments/assets/fee04a31-9f24-4c42-9ba6-6f0e1df03f92)
![Fill in Provider Details](https://github.com/user-attachments/assets/6cd9c0fa-2c79-4c7e-8b6d-7438437ad8cb)
![Fetch Model List](https://github.com/user-attachments/assets/01e220cf-a9c0-4b35-95a8-e20609a92d8e)
::: warning Important Configuration
Make sure to replace `sk-ai-v1-xxx` with your actual ZenMux API Key. You can obtain your API Key from the [ZenMux Console](https://zenmux.ai/settings/keys).
:::

::: tip Configuration Notes

- **Provider Name**: Customizable; using `ZenMux` is recommended for clarity
- **Provider Type**: Must select `OpenAI`, as ZenMux supports the OpenAI Chat Completions protocol
- **API Key**: Your ZenMux API Key for authentication and billing
- **API Host**: ZenMux’s OpenAI-compatible endpoint address; must end with `/`

:::

### Step 3: Fetch the Available Model List

After configuration, click the **Manager** button. Cherry Studio will automatically fetch the list of all models that support the OpenAI Chat Completions protocol from ZenMux.

::: info Model Discovery
Cherry Studio will automatically discover all available models via ZenMux’s `/v1/models` API endpoint—no manual addition required.
:::

### Step 4: Add the Models You Need

From the fetched model list, select the models you want to use and add them to your model library.

![Add Models](https://github.com/user-attachments/assets/b5a8cb9a-9d20-47f3-8b86-9a79855a819c)

::: tip Model Recommendations
We recommend adding models across different capability and price tiers to suit various use cases:

- **High-performance models**: `openai/gpt-5`, `anthropic/claude-sonnet-4.5`
- **Balanced models**: `google/gemini-2.5-pro`, `x-ai/grok-4-fast`
- **Cost-effective models**: `deepseek/deepseek-chat`, `qwen/qwen3-coder-plus`

:::

### Step 5: Start a Conversation

Go to the chat interface, select any model under the ZenMux provider, and start using it.

![Select a Model to Start Chatting](https://github.com/user-attachments/assets/7c4086fc-ee7a-4e04-9a57-f702b5d7d3e4)

::: info Model Switching
You can switch between models at any time during a conversation. Cherry Studio preserves the chat history, making it easy to compare outputs from different models.
:::

## Supported Models

::: info Models Supporting the OpenAI Protocol
ZenMux offers a large and constantly growing set of models that support the OpenAI Chat Completions protocol. You can view the full list in the following ways:

- Visit the [ZenMux Model List](https://zenmux.ai/models) and filter by "OpenAI API Compatible"
- Or visit the detail page of a specific model to check its protocol support

:::

::: tip Explore More Models
Visit the [ZenMux Model List](https://zenmux.ai/models) to learn about all available models and their details, including pricing, context length, feature capabilities, and more.
:::

## Usage Experience

Once configured, you can seamlessly use a variety of ZenMux models within Cherry Studio:

- Unified chat interface without switching between different clients
- Real-time model switching to compare output quality
- Complete chat history management and export
- Advanced features such as file uploads and multimodal input

::: info Feature Support
Feature support varies across models, such as visual understanding and function calling. Refer to the detail page of each model for its capabilities.
:::

## Troubleshooting

### Common Issues

::: details API Key Error
**Issue**: Invalid or unauthorized API Key when adding a provider

**Solutions**:

- Check if the API Key was copied correctly; avoid extra spaces or line breaks
- Confirm the API Key format starts with `sk-ai-v1-`
- Verify the API Key is activated and the account has sufficient balance
- Log in to the [ZenMux Console](https://zenmux.ai/settings/keys) to check the API Key status

:::

::: details Unable to Fetch Model List
**Issue**: Unable to retrieve the model list after clicking the Manager button

**Solutions**:

- Check if the API Host is correctly set to `https://zenmux.ai/api/v1/` (note the trailing slash)
- Verify network connectivity and try accessing `https://zenmux.ai` in your browser
- Ensure firewall or proxy settings are not blocking access to the ZenMux servers
- Check whether your Cherry Studio version is up to date; older versions may have compatibility issues

:::

::: details Model Invocation Failed
**Issue**: Errors returned after selecting a model and sending a message

**Solutions**:

- Confirm the selected model is still available on the ZenMux platform (some models may be retired)
- Check whether your account balance is sufficient
- Verify that the model supports your request parameters (e.g., temperature, max_tokens, etc.)
- Review the detailed error message and adjust request parameters accordingly
- Try switching to another model to determine if the issue is specific to a particular model

:::

::: details Slow Response
**Issue**: Model responses are slow or lagging

**Solutions**:

- Check your network quality and diagnose with a speed test tool
- Try switching to a model labeled "fast" (e.g., `x-ai/grok-4-fast`)
- Reduce the token count per request by lowering the `max_tokens` parameter
- Avoid peak usage periods or select models with lower load
- If the issue persists, contact ZenMux technical support for assistance

:::

::: tip Contact Us
If you encounter any issues during use or have suggestions and feedback, feel free to reach us via:

- **Official Website**: <https://zenmux.ai>
- **Technical Support Email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business Contact Email**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord Community**: <http://discord.gg/vHZZzj84Bm>

For more contact options and details, please visit our [Contact Us page](/help/contact).
:::`