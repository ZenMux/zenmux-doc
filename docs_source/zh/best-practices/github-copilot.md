# 通过 ZenMux 使用 VSCode Github Copilot 指南

## 概述

Visual Studio Code Copilot 是微软推出的 AI 编程助手，它集成在 VS Code 编辑器中，能够在您编写代码时提供智能建议、自动补全和代码生成功能。通过 ZenMux，您可以使用自己的 API 密钥来驱动 VS Code Copilot，享受更灵活、更经济的 AI 编程体验。

:::tip 使用提示
- 确保您的 VS Code 版本为最新
- 准备好您的 ZenMux API 密钥
- 建议先阅读完整指南，了解详细配置步骤
:::

## 快速开始

只需简单几步，即可开启您的 ZenMux Copilot 之旅：

1.  安装 [Visual Studio Code](https://code.visualstudio.com/) 1.104.0 以上版本
2.  📥 **安装扩展**：点击 [这里](https://marketplace.visualstudio.com/items?itemName=hugehardzhang.zenmux-copilot) 安装插件。
3.  💬 **打开 Copilot**：在 VS Code 中打开 GitHub Copilot Chat 界面。
4.  ⚙️ **管理模型**：点击聊天输入框下方的模型选择器，选择 "Manage Models..."（管理模型）。
5.  ✅ **选择 ZenMux**：点击 "Add Models" (添加模型)，然后选择 "ZenMux" 提供方。
6.  🔑 **配置密钥**：输入您的 ZenMux API Key（密钥将安全地保存在本地）。
7.  🎯 **挑选模型**：选择您希望在模型选择器中使用的具体模型。

### 详细配置说明

#### 1. 版本要求

确保您的 VS Code 版本在 1.104.0 或以上。您可以通过以下方式查看当前版本：

1. 图形界面方式：
   - macOS：点击菜单栏 **Code** > **关于 Visual Studio Code**
   - Windows/Linux：点击菜单栏 **帮助** > **关于**

2. 命令行方式：
   ```bash
   code --version
   ```

:::warning 版本检查
- 如果命令行显示的版本低于 1.104.0
- 或图形界面显示版本不符合要求
- 请前往 [VS Code 官网](https://code.visualstudio.com/) 下载最新版本
:::

如果您无法直接更新，可以考虑：
- 使用包管理器（如 Homebrew）更新
- 下载并手动安装最新版本
- 联系您的 IT 支持团队协助升级

#### 2. 安装 ZenMux Copilot 扩展

有两种安装方式：

**方式一：通过 VS Code 扩展市场**
1. 打开 VS Code
2. 点击左侧活动栏的扩展图标（或使用快捷键 `Cmd+Shift+X` / `Ctrl+Shift+X`）
3. 在搜索框中输入 "ZenMux"
4. 找到由 `hugehardzhang` 发布的扩展，点击 **安装**

![在 VS Code 扩展市场搜索并安装 ZenMux Copilot 扩展](https://cdn.marmot-cloud.com/storage/zenmux/2025/12/20/jNchPhz/zenmux-market.png)

**方式二：通过链接直接安装**
1. 点击 [ZenMux Copilot 扩展页面](https://marketplace.visualstudio.com/items?itemName=hugehardzhang.zenmux-copilot)
2. 点击 **Install** 按钮，浏览器会提示打开 VS Code
3. 在 VS Code 中确认安装

#### 3. 打开 Copilot Chat 界面

安装完成后，您可以通过以下任一方式打开 Copilot Chat：
- 点击左侧活动栏的 Copilot Chat 图标
- 使用快捷键 `Cmd+Shift+I`（macOS）或 `Ctrl+Shift+I`（Windows/Linux）
- 按 `Cmd+Shift+P` / `Ctrl+Shift+P` 打开命令面板，输入 "Chat: Focus on Chat View"

![打开 VS Code Copilot Chat 界面](https://cdn.marmot-cloud.com/storage/zenmux/2025/12/20/FrPnxs5/select-zenmux-model.jpg)
![打开 VS Code Copilot Chat 界面 选择 manager models](https://cdn.marmot-cloud.com/storage/zenmux/2025/12/20/NUnBhZm/vscode-manager-model.jpg)

#### 4. 管理和配置模型

在 Copilot Chat 界面中：
1. 找到聊天输入框上方的 **模型选择器**（通常显示当前选中的模型名称）
2. 点击模型选择器，在下拉菜单中选择 **"Manage Models..."**（管理模型）
3. 在弹出的模型管理界面中，点击 **"Add Models"**（添加模型）按钮
4. 从提供商列表中找到并选择 **"ZenMux"**

![在 Copilot Chat 中管理模型并添加 ZenMux 提供商](https://cdn.marmot-cloud.com/storage/zenmux/2025/12/20/XUB0icf/vscode-manager-select-zenmux.jpg)

#### 5. 配置 API 密钥

1. 选择 ZenMux 后，您会看到 **API Key** 输入框
2. 输入您的 ZenMux API 密钥（如果还没有密钥，请访问 [https://zenmux.ai](https://zenmux.ai) 注册并获取）
3. API 密钥会被安全地加密存储在本地，不会被上传到任何服务器

![输入 ZenMux API Key 进行配置](https://cdn.marmot-cloud.com/storage/zenmux/2025/12/20/2AbsJxq/insert-zenmux-apikey.png)

:::tip 安全提示
您的 API 密钥仅存储在本地计算机的 VS Code 配置中，使用加密存储机制。请妥善保管您的密钥，不要分享给他人。
:::

#### 6. 选择可用模型

配置密钥后，您可以选择希望在模型选择器中显示的模型：
- ✅ 勾选您想要使用的模型（支持多选）
- 推荐的模型包括：
  - **gpt-4o**：综合能力优秀，响应速度快
  - **gpt-4-turbo**：成本更优，适合日常使用
  - **gemini-pro**：Google 的先进模型，代码理解能力强

![选择要在 Copilot 中使用的 ZenMux 模型](https://cdn.marmot-cloud.com/storage/zenmux/2025/12/20/FrPnxs5/select-zenmux-model.jpg)
![选择要在 Copilot 中使用的 ZenMux 模型](https://cdn.marmot-cloud.com/storage/zenmux/2025/12/20/UJGgqnf/chat-select-zenmux-model.png)

#### 7. 开始使用

配置完成后，您可以：
- 在模型选择器中切换不同的 ZenMux 模型
- 在编辑器中输入代码时获得智能补全建议
- 使用 Chat 界面与 AI 对话，获取编程帮助

## 键盘快捷键

:::tip 快捷键使用说明
- 快捷键可以大大提高您的编码效率
- 不同操作系统的快捷键略有不同，请注意区分
:::

| 操作 | macOS | Windows/Linux | 使用场景 |
|-----|-------|---------------|----------|
| 打开 Chat | `Cmd+Shift+I` | `Ctrl+Shift+I` | 快速打开 AI 聊天界面 |
| Inline Chat | `Cmd+I` | `Ctrl+I` | 在当前代码行直接与 AI 交互 |
| 接受建议 | `Tab` | `Tab` | 接受 AI 推荐的代码补全 |
| 拒绝建议 | `Esc` | `Esc` | 取消当前的代码建议 |
| 下一个建议 | `Option+]` | `Alt+]` | 查看下一个可选的代码建议 |
| 上一个建议 | `Option+[` | `Alt+[` | 查看上一个可选的代码建议 |
| 触发补全 | `Option+\` | `Alt+\` | 手动触发 AI 代码补全 |

:::warning 快捷键注意事项
- 某些快捷键可能与系统或其他软件的快捷键冲突
- 如遇到冲突，可在 VS Code 设置中自定义快捷键
:::

## 资源链接

- [ZenMux 官网](https://tbox.tech)
- [ZenMux API 文档](https://docs.tbox.tech)
- [获取 API 密钥](https://tbox.tech)
- [VS Code Copilot 官方文档](https://code.visualstudio.com/docs/copilot/overview)

## 更新日志

如有问题或建议，欢迎通过 [GitHub Issues](https://github.com/zenmux/zenmux/issues) 反馈。

