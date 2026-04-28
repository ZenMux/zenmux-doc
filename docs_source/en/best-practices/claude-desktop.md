---
head:
  - - meta
    - name: description
      content: Guide to using Claude Desktop with ZenMux
  - - meta
    - name: keywords
      content: Zenmux, best practices, integration, Claude Desktop, Claude Cowork, Gateway, Anthropic, API
---

# Guide to Using Claude Desktop with ZenMux

Claude Desktop supports **third-party inference**, which routes model inference requests to a third-party platform. With ZenMux's Anthropic-compatible protocol, you can use the models aggregated by ZenMux in the Claude Desktop Cowork / Code experience instead of relying only on Anthropic's default service.

::: info Compatibility Notes
Claude Desktop's third-party inference configuration is designed for Bedrock, Vertex AI, Azure AI Foundry, or an LLM gateway compatible with `/v1/messages`. ZenMux provides an Anthropic Messages-compatible endpoint and can be connected through Gateway mode.

ZenMux Anthropic-compatible Base URL:

```text
https://zenmux.ai/api/anthropic
```

For more models that support the Anthropic Messages protocol, see the [ZenMux model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages).
:::

::: warning Note
Claude Desktop third-party inference requires a recent desktop client version. Anthropic describes it as a third-party platform / enterprise deployment configuration mode. If your client does not show the relevant menu, update Claude Desktop first.
:::

## Prerequisites

Before you begin, make sure you have:

- The latest [Claude Desktop](https://claude.ai/download) installed
- A ZenMux API Key
- The model slug you want to use, such as `anthropic/claude-sonnet-4.6`

### Get a ZenMux API Key

ZenMux offers two types of API Keys. Choose based on your use case:

::: code-group

```text [Subscription API Key]
Best for: personal development, learning, and Vibe Coding
Key format: sk-ss-v1-xxx
Get it from: https://zenmux.ai/platform/subscription
```

```text [Pay-as-you-go API Key]
Best for: production, commercial products, and enterprise applications
Key format: sk-ai-v1-xxx
Get it from: https://zenmux.ai/platform/pay-as-you-go
```

:::

::: warning API Key Guidance
Subscription API Keys are better suited to personal development and learning. For production, commercial products, or enterprise applications, use a pay-as-you-go API Key.
:::

## Configure Claude Desktop

### Step 1: Sign out or stay signed out

After opening Claude Desktop, sign out of any existing Claude account first, or complete the third-party inference setup while signed out.

According to Claude's official guidance, third-party inference can be configured without logging in to a Claude account. Once configured, Claude Desktop sends inference requests to your configured Gateway.

### Step 2: Enable Developer Mode

In the Claude Desktop menu bar, select:

```text
Help → Troubleshooting → Enable Developer Mode
```

After you confirm, Claude Desktop restarts. Once it relaunches, a **Developer** menu appears in the menu bar.

### Step 3: Open the third-party inference configuration

In the menu bar, select:

```text
Developer → Configure third-party inference
```

This opens Claude Desktop's third-party inference configuration UI.

### Step 4: Configure the Gateway connection

In the **Connection** section, choose **Gateway**, then fill in:

| Field | Value |
| --- | --- |
| Gateway Base URL | `https://zenmux.ai/api/anthropic` |
| Gateway API Key | Your ZenMux API Key |
| Gateway Auth Scheme | `Bearer` |
| Gateway Extra Headers | Usually leave blank. Add values only if your gateway requires tenant routing or enterprise headers. |

::: tip Relationship to Claude Code
If you have configured Claude Code before, this is the same value as `ANTHROPIC_BASE_URL`:

```bash
export ANTHROPIC_BASE_URL="https://zenmux.ai/api/anthropic"
```

Claude Desktop does not require you to manually write shell environment variables. Enter the same Base URL in the third-party inference configuration UI.
:::

### Step 5: Configure the model list

Go to **Identity & Models**, or the model-related configuration section, and add the model slugs you want to use in Claude Desktop.

Examples:

```text
anthropic/claude-sonnet-4.6
anthropic/claude-opus-4.6
openai/gpt-5.5
google/gemini-3.1-pro-preview
```

::: warning Use exact model slugs
Use model slugs from the [ZenMux model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages) that support the Anthropic Messages protocol. If a model name is misspelled, Claude Desktop may fail to start a session or return a model-not-found error at runtime.
:::

### Step 6: Enable 1M Context only when supported

Claude Desktop's model configuration UI may expose advanced options such as `1M Context`. Enable these only when the backend model and provider actually support the corresponding context length.

If you are unsure whether the model supports long context, keep the option disabled first. Complete the basic call verification, then adjust it later.

### Step 7: Apply the configuration and restart

Click **Apply locally** at the bottom of the configuration UI. Claude Desktop writes the local configuration and restarts automatically.

After the restart, you should see entries such as Cowork / Code and the model picker should show the model list you configured. Choose a model to start using Claude Desktop through ZenMux.

## Verify the Setup

Start with a simple message:

```text
Introduce the model you are currently using in one sentence.
```

If the request succeeds, test tasks closer to your real workflow, such as:

- Ask Cowork to summarize a local document
- Ask Code to open a project and explain its directory structure
- Switch between models to compare latency and output quality

You can also check the ZenMux request logs to confirm that the request went through ZenMux.

## Troubleshooting

::: details The Developer menu is missing
Check that:

- Claude Desktop has been updated to a version that supports third-party inference
- You enabled Developer Mode through `Help → Troubleshooting → Enable Developer Mode`
- You fully restarted Claude Desktop after enabling it
:::

::: details Which Base URL should I use?
For ZenMux, use:

```text
https://zenmux.ai/api/anthropic
```

Do not use the OpenAI-compatible endpoint `https://zenmux.ai/api/v1`. Claude Desktop Gateway mode expects an Anthropic Messages-compatible `/v1/messages` interface.
:::

::: details API Key or authentication errors
Check that:

- The API Key was copied completely, without extra spaces or line breaks
- Gateway Auth Scheme is set to `Bearer`
- The API Key is still valid and the account has available quota or balance
- If using a subscription key, the usage fits the subscription scope
:::

::: details Model unavailable or model list is empty
Check that the model slug in Model List is exact and that the model supports the Anthropic Messages protocol.

Copy model slugs from the [ZenMux model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages).
:::

::: details Calls fail after enabling 1M Context
`1M Context` only works for models whose backend explicitly supports long context. If calls fail after enabling it, disable the option first, verify the basic model call, then retest with a model that supports 1M context.
:::

## References

- [Claude: Install and configure Claude Cowork with third-party platforms](https://support.claude.com/en/articles/14680741-install-and-configure-claude-cowork-with-third-party-platforms)
- [ZenMux Anthropic Compatible API](/api/anthropic/create-messages)
- [ZenMux model list](https://zenmux.ai/models?sort=newest&supported_protocol=messages)

::: tip Contact Us
If you encounter any issues while using the platform, or have suggestions and feedback, feel free to contact us:

- **Official website**: <https://zenmux.ai>
- **Technical support**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business inquiries**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord community**: <http://discord.gg/vHZZzj84Bm>

For more contact methods and details, see our [Contact Us page](/help/contact).
:::
