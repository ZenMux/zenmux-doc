# 🚀 ZenMux Guide to Integrating with Cursor

## Notes

Please note that as Cursor continues to update its official releases and adjust its policies, **configuring and using Custom Models and third-party APIs (such as ZenMux) in Cursor typically requires an active Cursor Pro subscription.**

If, after completing the configuration, you are still repeatedly prompted to upgrade to Pro or can only use `auto`, this does not indicate an issue with your ZenMux configuration—it is an enforced commercialization restriction in the official Cursor client.

## Step 1: Prepare Your ZenMux API Key

1. Sign in to the [ZenMux Console](https://zenmux.ai/platform/pay-as-you-go).
2. Generate and copy your API Key (note: ZenMux keys typically start with `sk-ai-v1-`).

## Step 2: Configure Cursor Base Settings (Most Important Step)

1. Open Cursor, click the gear icon ⚙️ in the top-right (or bottom-right) to enter **Settings**.
2. In the left menu, click **Models**.
3. Scroll down to the **OpenAI API Key** section:
   - Turn on the toggle (it turns green).
   - Paste your ZenMux API Key (`sk-ai-v1-...`) into the input box.
4. Scroll down to the **Override OpenAI Base URL** section:
   - Turn on the toggle (it turns green).
   - Enter exactly: `https://zenmux.ai/api/v1`

## Step 3: Add ZenMux-Specific Model Names

1. Still on the **Models** page, find `+ Add Custom Model`.
2. Based on the recommended model names in the ZenMux documentation, add the models you need.
3. After adding them, make sure the toggles **to the right of these new models are enabled (green)**.

## Step 4: Test in the Chat Panel

1. Close Settings, then press `Ctrl + L` (Windows) or `Cmd + L` (Mac) to open the chat panel on the right.
2. In the model selection dropdown below (or above) the input box, **select the exact full name you just added**.
3. Send a test message, for example: “Hello, which model are you?”

---

### ❓ Troubleshooting

- **Issue 1: Errors after sending a message—API Key invalid or cannot connect?**
  - **Check the Key**: Make sure the key is the complete `sk-ai-v1-...` with no extra spaces.
  - **Check the URL**: Ensure there is no extra trailing slash. It must be exactly `https://zenmux.ai/api/v1`.
- **Issue 2: `Model not found`?**
  - **Fix**: This indicates the model name is misspelled, or ZenMux has temporarily taken the model offline. Please visit the [ZenMux official model list](https://zenmux.ai/models?sort=newest&supported_protocol=responses) and copy the latest available model slug.
- **Issue 3: GPT-series models error with `Parameter messages is required`?**
  - **Symptom**: When calling `openai/gpt-*` models, a `400` error is returned: `{"error":{"code":"400","type":"invalid_params","message":"Parameter messages is required"}}`.
  - **Cause**: Cursor sends requests in the OpenAI **Responses API** format to the standard **Chat Completion API** endpoint, causing the request body format to be incompatible.
  - There is currently no effective workaround. Consider following Cursor’s release notes for a compatibility fix, or temporarily using other models as alternatives.
- **Issue 4: Claude-series models error with `unsupported tool definition`?**
  - **Symptom**: When calling `anthropic/claude-*` models, a `400` error is returned: `{"error":{"code":"400","type":"invalid_params","message":"unsupported tool definition"}}`.
  - **Cause**: Cursor passes tool definitions (Tool Definition) to the model in all modes (including Ask mode and Agent mode), which does not match the tool format specification expected by the **Chat Completion API** endpoint.
  - There is currently no effective workaround. Consider following Cursor’s release notes for a compatibility fix, or temporarily using other models as alternatives.

::: tip Contact Us
If you encounter any issues during use, or have suggestions and feedback, feel free to contact us via:

- **Official Website**: <https://zenmux.ai>
- **Technical Support Email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business Inquiries Email**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord Community**: <http://discord.gg/vHZZzj84Bm>

For more contact methods and details, please visit our [Contact Us page](/help/contact).
:::