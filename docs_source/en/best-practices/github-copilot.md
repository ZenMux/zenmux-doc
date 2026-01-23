# Guide to Using VSCode Github Copilot with ZenMux

## Overview

Visual Studio Code Copilot is an AI programming assistant from Microsoft integrated into the VS Code editor. It provides intelligent suggestions, auto-completion, and code generation as you write code. With ZenMux, you can use your own API key to power VS Code Copilot, enjoying a more flexible and cost-effective AI programming experience.

:::tip Usage Tips
- Ensure your VS Code version is up to date.
- Have your ZenMux API key ready.
- It is recommended to read the full guide first to understand the detailed configuration steps.
:::

## Quick Start

Start your ZenMux Copilot journey in just a few simple steps:

1.  Install [Visual Studio Code](https://code.visualstudio.com/) version 1.104.0 or higher.
2.  📥 **Install Extension**: Click [here](https://marketplace.visualstudio.com/items?itemName=hugehardzhang.zenmux-copilot) to install the plugin.
3.  💬 **Open Copilot**: Open the GitHub Copilot Chat interface in VS Code.
4.  ⚙️ **Manage Models**: Click the model selector below the chat input box and choose "Manage Models...".
5.  ✅ **Select ZenMux**: Click "Add Models" and select the "ZenMux" provider.
6.  🔑 **Configure Key**: Enter your ZenMux API Key (the key will be securely stored locally).
7.  🎯 **Pick Model**: Select the specific models you wish to use in the model selector.

### Detailed Configuration Instructions

#### 1. Version Requirements

Ensure your VS Code version is 1.104.0 or higher. You can check your current version in the following ways:

1. GUI Method:
   - macOS: Click menu bar **Code** > **About Visual Studio Code**
   - Windows/Linux: Click menu bar **Help** > **About**

2. Command Line Method:
   ```bash
   code --version
   ```

:::warning Version Check
- If the command line shows a version lower than 1.104.0
- Or the GUI shows a version that does not meet the requirements
- Please go to the [VS Code Official Website](https://code.visualstudio.com/) to download the latest version
:::

If you cannot update directly, consider:
- Updating using a package manager (like Homebrew)
- Downloading and manually installing the latest version
- Contacting your IT support team for assistance with the upgrade

#### 2. Install ZenMux Copilot Extension

There are two ways to install:

**Method 1: Via VS Code Marketplace**
1. Open VS Code.
2. Click the Extensions icon in the left activity bar (or use shortcut `Cmd+Shift+X` / `Ctrl+Shift+X`).
3. Type "ZenMux" in the search box.
4. Find the extension published by `hugehardzhang` and click **Install**.

![Search and install ZenMux Copilot extension in VS Code Marketplace](https://cdn.marmot-cloud.com/storage/zenmux/2025/12/20/jNchPhz/zenmux-market.png)

**Method 2: Direct Link Installation**
1. Click [ZenMux Copilot Extension Page](https://marketplace.visualstudio.com/items?itemName=hugehardzhang.zenmux-copilot).
2. Click the **Install** button; the browser will prompt to open VS Code.
3. Confirm installation in VS Code.

#### 3. Open Copilot Chat Interface

After installation, you can open Copilot Chat in any of the following ways:
- Click the Copilot Chat icon in the left activity bar.
- Use shortcut `Cmd+Shift+I` (macOS) or `Ctrl+Shift+I` (Windows/Linux).
- Press `Cmd+Shift+P` / `Ctrl+Shift+P` to open the Command Palette and type "Chat: Focus on Chat View".

![Open VS Code Copilot Chat Interface](https://cdn.marmot-cloud.com/storage/zenmux/2025/12/20/FrPnxs5/select-zenmux-model.jpg)
![Open VS Code Copilot Chat Interface Select manage models](https://cdn.marmot-cloud.com/storage/zenmux/2025/12/20/NUnBhZm/vscode-manager-model.jpg)

#### 4. Manage and Configure Models

In the Copilot Chat interface:
1. Find the **Model Selector** above the chat input box (usually displays the currently selected model name).
2. Click the model selector and choose **"Manage Models..."** from the dropdown menu.
3. In the pop-up model management interface, click the **"Add Models"** button.
4. Find and select **"ZenMux"** from the provider list.

![Manage models in Copilot Chat and add ZenMux provider](https://cdn.marmot-cloud.com/storage/zenmux/2025/12/20/XUB0icf/vscode-manager-select-zenmux.jpg)

#### 5. Configure API Key

1. After selecting ZenMux, you will see an **API Key** input box.
2. Enter your ZenMux API Key (if you don't have one, please visit [https://zenmux.ai](https://zenmux.ai) to register and get one).
3. The API key will be securely encrypted and stored locally; it will not be uploaded to any server.

![Enter ZenMux API Key for configuration](https://cdn.marmot-cloud.com/storage/zenmux/2025/12/20/2AbsJxq/insert-zenmux-apikey.png)

:::tip Security Note
Your API key is stored only in the VS Code configuration on your local computer using an encrypted storage mechanism. Please keep your key safe and do not share it with others.
:::

#### 6. Select Available Models

After configuring the key, you can select the models you want to display in the model selector:
- ✅ Check the models you want to use (multiple selection supported).
- Recommended models include:
  - **gpt-4o**: Excellent comprehensive capabilities, fast response speed.
  - **gpt-4-turbo**: More cost-effective, suitable for daily use.
  - **gemini-pro**: Google's advanced model with strong code understanding capabilities.

![Select ZenMux models to use in Copilot](https://cdn.marmot-cloud.com/storage/zenmux/2025/12/20/FrPnxs5/select-zenmux-model.jpg)
![Select ZenMux models to use in Copilot](https://cdn.marmot-cloud.com/storage/zenmux/2025/12/20/UJGgqnf/chat-select-zenmux-model.png)

#### 7. Start Using

Once configured, you can:
- Switch between different ZenMux models in the model selector.
- Get intelligent completion suggestions while typing code in the editor.
- Use the Chat interface to converse with AI and get programming help.

## Keyboard Shortcuts

:::tip Shortcut Usage Instructions
- Shortcuts can greatly improve your coding efficiency.
- Shortcuts differ slightly between operating systems; please note the distinction.
:::

| Action | macOS | Windows/Linux | Usage Scenario |
|-----|-------|---------------|----------|
| Open Chat | `Cmd+Shift+I` | `Ctrl+Shift+I` | Quickly open the AI chat interface |
| Inline Chat | `Cmd+I` | `Ctrl+I` | Interact with AI directly in the current code line |
| Accept Suggestion | `Tab` | `Tab` | Accept code completion recommended by AI |
| Reject Suggestion | `Esc` | `Esc` | Cancel the current code suggestion |
| Next Suggestion | `Option+]` | `Alt+]` | View the next available code suggestion |
| Previous Suggestion | `Option+[` | `Alt+[` | View the previous available code suggestion |
| Trigger Completion | `Option+\` | `Alt+\` | Manually trigger AI code completion |

:::warning Shortcut Notes
- Some shortcuts may conflict with system or other software shortcuts.
- If conflicts occur, you can customize shortcuts in VS Code settings.
:::

## Resource Links

- [ZenMux Official Website](https://tbox.tech)
- [ZenMux API Documentation](https://docs.tbox.tech)
- [Get API Key](https://tbox.tech)
- [VS Code Copilot Official Documentation](https://code.visualstudio.com/docs/copilot/overview)

## Changelog

If you have questions or suggestions, feel free to provide feedback via [GitHub Issues](https://github.com/zenmux/zenmux/issues).

