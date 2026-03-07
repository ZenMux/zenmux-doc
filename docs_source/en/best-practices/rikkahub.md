---
head:
  - - meta
    - name: description
      content: Guide to using RikkaHub with ZenMux
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, RikkaHub, OpenAI, API, Android
---

# Guide to Configuring ZenMux in RikkaHub

RikkaHub is a feature-rich Android AI assistant client that supports integration with multiple LLM providers. By integrating with ZenMux, you can access the massive catalog of aggregated models available on the ZenMux platform directly in RikkaHub—enabling more flexible model selection and better pricing.

::: info Compatibility Notes
ZenMux fully supports the OpenAI Chat Completions protocol and can be seamlessly integrated into clients like RikkaHub that support custom OpenAI-compatible endpoints. Simply add ZenMux as a model provider to use any model that supports the OpenAI protocol.
:::

## Configuration Options

### Step 1: Download and Install RikkaHub

Go to [RikkaHub GitHub Releases](https://github.com/rikkahub/rikkahub) to download the latest APK and install it on your Android device.

### Step 2: Add ZenMux as a Model Provider

1. Open RikkaHub and go to **Settings**

2. Tap **providers**, then tap the "+" icon in the top-right corner to add a provider

3. Choose an **OpenAI-compatible** provider type and fill in the following:

   - **Name**: `ZenMux` (or any name you prefer)
   - **API Key**: Enter your ZenMux API Key (Subscription API keys are in the format `sk-ss-v1-xxx`; Pay As You Go API keys are in the format `sk-ai-v1-xxx`)
   - **API Base URL**: `https://zenmux.ai/api/v1`
   - **API Path**: /chat/completions

4. Tap **models** in the bottom-right. You will see an icon with a numeric badge to the left of **add new model** (this indicates the models that have been fetched). If you don’t see it, check your network settings or verify that you configured it as OpenAI-compatible. Tap the icon, search for and add the models you need, then save and go back to start using them.

5. Note: Models fetched via the OpenAI-compatible method do not include Gemini image-generation models. If you don’t need Gemini image-generation models, ignore the steps below.

6. To configure a Gemini image-generation model, tap **add new model** on the **models** page and set the following under **basic settings**:

   - **model ID**: e.g., `googlelgemini-3.1-flash-image-preview` (you can copy the model slug from https://zenmux.ai/models?sort=newest)
   - **model name**: Enter your model name, e.g., nanobanana2 (or any name you prefer)
   - **model type**: Select chat
   - **Input Modality**: Select text and image
   - **Output Modality**: Select text and image
   - **Abilities**: Select reasoni, and do not select tool, otherwise an error will occur

7. Then tap **Advanced Settings** at the top of the page, tap **add provider override**, select **Google** at the top of the page to override the OpenAI protocol, and configure the following:

   - **Name**: `ZenMux` (or any name you prefer)
   - **API Key**: Enter your ZenMux API Key (Subscription API keys are in the format `sk-ss-v1-xxx`; Pay As You Go API keys are in the format `sk-ai-v1-xxx`)
   - **API Base URL**: `https://zenmux.ai/api/vertex-ai/v1beta`  
     Tap **save**, then tap **confirm** again to return and start using it.
   - Note: In the **configure provider override** step, do not check **vertex ai**

::: warning Important Configuration
Make sure to replace `sk-ss-v1-xxx` or `sk-ai-v1-xxx` with your real ZenMux API Key. You can get your API Key in the [ZenMux Console](https://zenmux.ai/platform/pay-as-you-go或者https://zenmux.ai/platform/subscription).
:::

::: tip Configuration Notes

- **API Key**: Your ZenMux API Key, used for authentication and billing
- **API Base URL**: ZenMux OpenAI-compatible endpoint URL or Google-compatible endpoint URL

:::

### Step 3: Select a Model and Start Chatting

After configuration, you can select ZenMux-provided models from the model list in RikkaHub and start chatting.

:::

## FAQ

### What if the connection fails?

1. Confirm your API Key is correct. You can view it in the [ZenMux Console](https://zenmux.ai/settings/keys)
2. Confirm the API Base URL is correct
3. Check whether your device network connection is working properly

### The model list is empty?

Make sure you are connecting in OpenAI-compatible mode. ZenMux returns the list of all available models via the `/v1/models` endpoint.

## Related Links

- [ZenMux Quickstart](/guide/quickstart)
- [ZenMux API Key Management](https://zenmux.ai/settings/keys)