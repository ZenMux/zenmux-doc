# Studio-Chat

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/mBVtF6W/20260205135553.jpg)
Studio-Chat is an intelligent chat tool provided by the ZenMux platform. It supports advanced capabilities such as multi-model conversations, PK mode, Artifact generation, and image generation. This document helps you quickly get up to speed with Studio-Chat’s core features.

## Basic Features

### Start a New Chat

1. Visit [Studio-Chat](https://zenmux.ai/platform/chat?chatId=new_chat)
2. Enter your question in the input box at the bottom of the page
3. Press `Enter` or click the send button to send the message
4. Wait for the AI model to generate a response

### Choose a Model

In the model selector at the top of the chat area, you can:

- Click the model name to open the model list
- Search for and select the AI model you need
- Different models support different capabilities (text, image, audio, etc.)

## PK Mode (Multi-Model Comparison)

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/pHc3z1v/4C415485-BE87-426A-B605-14DFBE6E125F.png)

PK mode lets you chat with multiple AI models at the same time, making it easy to compare the quality of their responses.

### How to Enable PK Mode

1. In the model selection area, click the **PK icon** (➕) to add a new chat window
2. You can add up to **10** models for side-by-side comparison
3. Each window can select a different model independently

### PK Mode Sync

PK mode supports **sync send**:

| Icon    | Status   | Description                                                     |
| ------- | -------- | --------------------------------------------------------------- |
| 🔛 On   | Sync On  | When sending a message, all synced models receive the same prompt |
| 🔚 Off  | Sync Off | This model window runs independently and won’t receive synced sends |

**How to use:**

1. Click the **sync toggle** icon in the model selection area
2. When enabled, any message you send from any input box will be sent to all models with sync enabled
3. When disabled, that model window requires separate input and sending

### Remove a PK Window

Click the **×** button in the model selection area to remove the corresponding chat window.

## Artifacts

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/LSnC3V9/20260205140001.jpg)

Artifacts is a powerful content generation and preview feature. It supports generating interactive code, charts, documents, and more.

### Supported Artifact Types

| Type     | MIME Type                 | Description                  |
| -------- | ------------------------- | ---------------------------- |
| Markdown | `text/markdown`           | Rich-text documents          |
| HTML     | `text/html`               | Interactive web content      |
| SVG      | `image/svg+xml`           | Vector graphics              |
| Mermaid  | `application/vnd.mermaid` | Flowcharts, sequence diagrams, etc. |

### How to Use Artifacts

1. In the input area, click **Skills**, then select **Artifact Mode** (💡 icon), or click the **Artifacts** button in the input area
2. Send your request, for example:
   - "Help me create a project flowchart"
   - "Generate an interactive HTML page"
   - "Draw a logo using SVG"
3. After the AI generates the content, the Artifact preview panel opens automatically

### Artifact Panel Features

- **Content / Preview toggle**: View source or preview the output
- **Copy code**: Copy the generated content with one click
- **Download file**: Save the content as a file in the corresponding format
- **Fullscreen mode**: Expand the preview area

## Web Search

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/1yYx6hi/20260205140326.jpg)

Web Search allows the AI to search the internet for the latest information while answering questions.

### Models That Support Web Search

⚠️ **Note**: Not all models support Web Search.

**How to tell:**

- In the Skills menu, if **Web Search** is clickable (not greyed out), the current model supports it
- If the option is greyed out/disabled, the model does not support it

**Common models that support Web Search:**

- Models that support the `web_search_options` parameter (such as some OpenAI and Google models)

### How to Use Web Search

1. Click **Skills**
2. Enable **Web Search** (🌐 icon)
3. Send your question
4. The AI will search the web and respond based on the latest information

When enabled, responses will include cited sources (grounding chunks) to help you verify the information.

## Image Generation and Editing

### Image Generation Mode

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/6hOdh9V/20260205141003.jpg)

Some models support image generation:

1. Click **Skills**
2. Select **Image Mode** (🖼️ icon)
3. Describe the image you want to generate
4. The AI will generate the corresponding image

**Special configuration for Google Imagen models:**
![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/NESbRjH/20260205140650.jpg)

When using Google’s image generation models, you can configure:

- **Image Aspect Ratio**: Image ratio (1:1, 16:9, 9:16, etc.)
- **Image Resolution**: Image resolution

### Image Editing Mode

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/yraseZ9/20260205140846.jpg)

Models that support image output can also perform image editing:

| Mode           | Description                         |
| -------------- | ----------------------------------- |
| **Basic Edit** | Basic editing to modify image content |
| **Cutout**     | Cutout to remove/replace backgrounds |
| **Upscale**    | Image upscaling (not available yet) |

**Steps:**

1. Upload an image
2. In Skills, select the corresponding editing mode
3. Describe the edit you want
4. The AI will return the edited image

## Voice Input and Output

### Voice Input

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/ZoPtPCi/20260205141116.jpg)

Models that support voice input can receive voice messages:

1. Click the **microphone** icon in the input box to start recording
2. After recording, it will be uploaded automatically
3. When you send the message, the audio will be sent to the AI along with it

### Voice Output

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/EMrPXuS/20260205141146.jpg)

Some models support voice responses:

1. Enable **Audio Mode** (🎵 icon) in Skills
2. Send a message
3. The AI response will include audio content you can play directly

## Advanced Parameters

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/LieLZeb/20260205143826.jpg)

Click the **⚙️ Settings** icon in the model selection area to configure advanced model parameters.

### Configurable Parameters

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/Ks1RA3s/20260205143850.jpg)

| Parameter                 | Description                                   | Range        |
| ------------------------- | --------------------------------------------- | ------------ |
| **Provider**              | Select the model provider                     | Depends on availability |
| **System Prompt**         | System prompt to define the AI’s role/behavior | Text         |
| **Enable Reasoning**      | Enable reasoning mode (chain-of-thought)      | On/Off       |
| **Max Reasoning Tokens**  | Maximum tokens for reasoning                  | 0-100000     |
| **Max Completion Tokens** | Maximum output tokens                         | 0-262144     |
| **Temperature**           | Controls output randomness                    | 0.0-2.0      |
| **Top P**                 | Nucleus sampling                              | 0.0-1.0      |
| **Top K**                 | Consider only the top K most likely tokens    | 0-100        |
| **Frequency Penalty**     | Frequency penalty                             | -2.0 to 2.0  |
| **Presence Penalty**      | Presence penalty                              | -2.0 to 2.0  |
| **Repetition Penalty**    | Repetition penalty                            | 0.0-2.0      |
| **Min P**                 | Minimum probability threshold                 | 0.0-1.0      |
| **Top A**                 | Adaptive sampling parameter                   | 0.0-1.0      |

### Smart Routing Configuration

If you are using an auto-routing model, you can set routing preferences:

- **Performance**: Prefer the highest-performance provider
- **Price**: Prefer the lowest-cost provider
- **Balanced**: Balance performance and price

### Reasoning Mode Notes

- **Must be enabled**: For some models (such as the o1 series), reasoning mode is mandatory
- **Optional**: Some models allow reasoning mode to be toggled
- **Not supported**: Some models do not support reasoning mode

## Billing Mode (PayGo vs Subscription)

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/AV9ykpF/20260205144006.jpg)

ZenMux offers two billing modes that you can choose based on your usage.

### Subscription Mode

| Feature      | Description                 |
| ------------ | --------------------------- |
| 💰 Payment   | Monthly/annual subscription |
| ✅ Best for  | High-frequency users        |
| 📋 Coverage  | Models included in your subscription plan |
| 🔸 Icon      | Yellow subscription icon    |

### Pay As You Go Mode

| Feature      | Description                                  |
| ------------ | -------------------------------------------- |
| 💰 Payment   | Pay based on actual usage                    |
| ✅ Best for  | Low-frequency use or models not covered by subscription |
| 📋 Coverage  | All models                                   |
| 🔸 Icon      | Blue API icon                                |

### How to Switch Billing Mode

1. Click the **billing icon** (yellow/blue) next to the model selection area
2. In the dropdown menu, select:
   - **Subscription Mode** - Use subscription quota
   - **Pay As You Go Mode** - Use account balance

### Notes

- If the current model is not included in your subscription plan, it will automatically switch to Pay As You Go mode
- Some advanced models may require sufficient account balance to use
- The system will automatically detect this and prompt you to top up or upgrade your subscription

## File Upload

Studio-Chat supports uploading multiple file types.

### Supported File Types

| Type      | Formats                 | Description                           |
| --------- | ----------------------- | ------------------------------------- |
| **Images** | jpg, png, gif, webp, etc. | Image understanding and analysis      |
| **Documents** | pdf                | PDF document analysis                 |
| **Text**  | txt, md, json, yaml, etc. | Text file analysis                    |
| **Video** | mp4, etc.               | Video understanding (model-dependent) |
| **Audio** | wav, mp3, etc.          | Speech-to-text (model-dependent)      |

### Upload Methods

1. **Click to upload**: Click the **+** button on the left side of the input box, then select a file type to upload
2. **Drag and drop**: Drag files directly into the input area
3. **Paste to upload**: Copy an image and paste it into the input box

### File Preview

Uploaded files are shown as thumbnails. Click to preview:

- Images: View in full size
- PDF: View PDF content online
- Text: View text content

## Conversation Management

### Conversation List

The left sidebar shows your chat history. It supports:

- **New chat**: Click the "New Chat" button
- **Switch chats**: Click any previous conversation
- **Delete chat**: Right-click a conversation item or click the delete button
- **Rename chat**: Double-click the conversation name to edit it

### Conversation Grouping

Conversations are automatically grouped by time:

- Today
- Yesterday
- Last 7 Days
- Last 30 Days
- Older

### Conversation Saving

- Each turn is saved automatically
- The conversation title defaults to the content of your first message
- You can return at any time to continue a previous conversation

## Shortcuts

| Action        | Shortcut/Method               |
| ------------- | ----------------------------- |
| Send message  | `Enter`                       |
| New line      | `Shift + Enter`               |
| Stop generation | Click the Stop button       |
| Copy response | Click the copy icon below the message |
| Regenerate    | Click the refresh icon below the message |
| View code examples | Click the `</>` icon     |

## FAQ

### Q: Why are some features unavailable?

A: Different models support different features. Make sure the model you selected supports the capability you need.

### Q: How many models does PK mode support?

A: Up to 10 models can be compared at the same time.

### Q: How do I know whether a model supports Web Search?

A: In the Skills menu, if Web Search is clickable, it is supported.

### Q: Can Subscription and Pay As You Go be used at the same time?

A: Yes. Each chat window can choose its billing mode independently.

### Q: Is there a file upload size limit?

A: Yes. The specific limit depends on the file type and what the current model supports.

## Get Help

::: tip Contact Us
If you encounter any issues while using the product, or if you have suggestions or feedback, feel free to contact us via:

- **Official website**: <https://zenmux.ai>
- **Support email**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **Business inquiries**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord community**: <http://discord.gg/vHZZzj84Bm>

For more contact options and details, please visit our [Contact Us page](/help/contact).
:::