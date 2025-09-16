# Cherry Studio Integration Guide

Cherry Studio is a powerful AI chat client that supports multiple AI model providers. By configuring ZenMux, you can use all large language models aggregated by us within Cherry Studio.

## Preparation

### Get a ZenMux API Key

::: tip Get an API Key
Visit the [ZenMux Console](https://zenmux.ai/settings/keys) to sign up and obtain your API Key
:::

## Configuration Steps

### 1. Open Cherry Studio Settings

1. Launch the Cherry Studio client
2. Go to the **Settings** page
3. Select the **Model Providers** option
4. Click the **Add Provider** button

### 2. Configure the ZenMux Provider

Fill in the following information on the provider configuration screen:

| Field            | Value                      |
| ---------------- | -------------------------- |
| **Provider Name** | ZenMux                     |
| **API Endpoint** | `https://zenmux.ai/api/v1` |
| **API Key**      | Your ZenMux API Key        |
| **Model Format** | OpenAI Compatible          |

::: warning Important
Make sure the API Key is correct and your network connection is stable
:::

### 3. Verify the Configuration

After configuration, Cherry Studio will automatically fetch the list of models supported by ZenMux. You will see the following types of models in the model selector:

**Claude Series**

- `anthropic/claude-sonnet-4`
- `anthropic/claude-haiku-3.5`

**GPT Series**

- `openai/gpt-4o`
- `openai/gpt-4-turbo`

**Gemini Series**

- `google/gemini-2.5-pro`
- `google/gemini-1.5-flash`

**Other Models**

- `meta-llama/llama-3.3-70b-instruct`

## Feature Support

### Fully Supported

- **Basic chat**: Text conversation for all models
- **Streaming responses**: Real-time content generation
- **Conversation memory**: Supports multi-turn conversations
- **Model switching**: Switch models at any time within a conversation
- **Parameter tuning**: Customize parameters such as temperature and max tokens

### Partially Supported

- **Multimodal input**: Supports image upload (models such as Claude, GPT-4V, etc.)
- **Tool calling**: Function Calling capability
- **Structured output**: JSON mode output

## Usage Recommendations

### Model Selection Strategy

::: tip Recommended Setup
**Everyday conversations**: `anthropic/claude-haiku-3.5` — fast responses, lower cost  
**Complex tasks**: `anthropic/claude-sonnet-4` — strong reasoning, high-quality output  
**Code development**: `anthropic/claude-sonnet-4` or `openai/gpt-4o`  
**Multimodal tasks**: `google/gemini-2.5-pro` — excellent image understanding
:::

### Cost Optimization Tips

1. **Choose the right model**: Select a model based on task complexity
2. **Parameter tuning**: Use the temperature parameter to control creativity
3. **Token limits**: Set an appropriate max tokens limit
4. **Usage monitoring**: Regularly check usage in the [ZenMux Console](https://zenmux.ai/console)

## Troubleshooting

### Model list is empty

**Possible causes:**

- Incorrect API Key configuration
- Network connectivity issues
- Incorrect API endpoint address

**Solutions:**

- Verify that the API Key is correct
- Ensure your network connection is working
- Validate the API endpoint address: `https://zenmux.ai/api/v1`

### A model shows as unavailable

**Possible causes:**

- Model under maintenance
- Insufficient account balance
- Regional access restrictions

**Solutions:**

- Visit the [ZenMux Console](https://zenmux.ai/console/usage) to check your account status
- Try switching to another available model
- Contact technical support for assistance

### Get detailed error information

1. **Cherry Studio logs**: Check the client’s error logs
2. **ZenMux Console**: Visit the [API Call Details](https://zenmux.ai/console/usage) page
3. **Network diagnostics**: Check your network connection and firewall settings

## Get Support

If you encounter issues while using the service, you can get support through:

- **Email support**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Issue reporting**: [GitHub Issues](https://github.com/ZenMux/zenmux/issues)
- **Help docs**: [FAQ](/zh/help/faq)

::: details Related Resources

- [ZenMux API Documentation](/zh/api-reference)
- [Model Support List](/zh/models)
- [Pricing](/zh/pricing)
  :::