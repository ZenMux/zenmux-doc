---
head:
  - - meta
    - name: description
      content: Guide to Using Cline with ZenMux
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, cline, OpenAI, API
---

# Guide to Using Cline with ZenMux

*Cline* is a collaborative programming agent for complex tasks. By integrating with ZenMux, you can access more powerful models to enhance development efficiency.

::: info Compatibility Note
ZenMux fully supports the OpenAI API protocol and can be used with simple configuration.

Note that the OpenAI protocol base_url is "https://zenmux.ai/api/v1".
:::

## Installing Cline

Cline supports multiple development tools such as Visual Studio Code, JetBrains IDEs, etc. You can choose the corresponding installation method based on your tools. For details, please refer to Cline's official documentation.

::: tip Reference
[Cline Official Documentation](https://docs.cline.bot/getting-started/installing-cline)
:::

## Configuring Cline

1. Click the Cline icon on the left side of VSCode to open the Cline panel.
2. Click the settings icon ⚙️ in the top right corner of the panel.
3. In the API Configuration tab:
  - Select OpenAI Compatible for API Provider
  - Enter https://zenmux.ai/api/v1 in Base URL
  - Enter your ZenMux API Key in OpenAI Compatible API Key
  - Enter the ZenMux model slug in Model ID, such as anthropic/claude-3.7-sonnet
4. Click the Done button in the top right corner to complete the configuration.

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/11/05/AtyK3Ah/Cline.png"
       alt="Cline Configuration"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

## Getting Started

After configuration is complete, you can start using Cline. ZenMux provides rich model support for Cline. You can select the desired model from our [official model list](https://zenmux.ai/models) and enter it in the Model ID field.

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2025/11/05/z6PG9xI/Cline_chat.png"
       alt="Cline Usage Effect"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

## Troubleshooting

### Common Issues

::: details API Key Error
**Issue**: API Key reported as invalid or unauthorized

**Solution**:

- Verify that the ZenMux API Key you entered is correct
- Confirm the API Key is active and has sufficient balance
- Check that the API Key format starts with `sk-ai-v1-`
:::

## Contact Us

If you encounter any issues during use, or have suggestions and feedback, please contact us through the following channels:

::: tip Get Help

- **Official Website**: <https://zenmux.ai>
- **Technical Support Email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business Cooperation Email**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord Community**: <http://discord.gg/vHZZzj84Bm>

For more contacts and details, visit our [Contact Us page](/help/contact).
:::
