# Studio-Chat

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/mBVtF6W/20260205135553.jpg)
Studio-Chat 是 ZenMux 平台提供的智能对话工具，支持多模型对话、PK 模式、Artifacts 生成、图像生成等多种高级功能。本文档将帮助您快速掌握 Studio-Chat 的核心功能。

## 基础功能

### 开始新对话

1. 访问 [Studio-Chat](https://zenmux.ai/platform/chat?chatId=new_chat)
2. 在页面底部的输入框中输入您的问题
3. 按 `Enter` 键或点击发送按钮发送消息
4. 等待 AI 模型生成回复

### 选择模型

在对话区域顶部的模型选择器中，您可以：

- 点击模型名称打开模型列表
- 搜索并选择您需要的 AI 模型
- 不同模型支持不同的能力（文本、图像、语音等）

## PK 模式（多模型对比）

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/pHc3z1v/4C415485-BE87-426A-B605-14DFBE6E125F.png)

PK 模式允许您同时与多个 AI 模型对话，方便对比不同模型的回答质量。

### 如何开启 PK 模式

1. 在模型选择区域，点击 **PK 图标** (➕) 添加新的对话窗口
2. 最多可以同时添加 **10 个** 模型进行对比
3. 每个窗口可以独立选择不同的模型

### PK 模式同步功能

PK 模式支持 **同步发送** 功能：

| 图标    | 状态     | 说明                                           |
| ------- | -------- | ---------------------------------------------- |
| 🔛 开启 | Sync On  | 发送消息时，所有开启同步的模型同时收到相同问题 |
| 🔚 关闭 | Sync Off | 该模型窗口独立运行，不参与同步发送             |

**使用方法：**

1. 点击模型选择区域的 **同步开关** 图标
2. 开启状态下，您在任一输入框发送的消息会同步发送给所有已开启同步的模型
3. 关闭状态下，该模型窗口需要单独输入和发送

### 移除 PK 窗口

点击模型选择区域的 **×** 按钮可以移除对应的对话窗口。

## Artifacts 功能

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/LSnC3V9/20260205140001.jpg)

Artifacts 是一个强大的内容生成和预览功能，支持生成可交互的代码、图表、文档等内容。

### 支持的 Artifact 类型

| 类型     | MIME Type                 | 说明             |
| -------- | ------------------------- | ---------------- |
| Markdown | `text/markdown`           | 富文本文档       |
| HTML     | `text/html`               | 可交互的网页内容 |
| SVG      | `image/svg+xml`           | 矢量图形         |
| Mermaid  | `application/vnd.mermaid` | 流程图、时序图等 |

### 如何使用 Artifacts

1. 在输入框区域点击 **Skills** 按钮，选择 **Artifact Mode**（💡 图标）或者在输入框区域点击 **Artifacts** 按钮
2. 发送您的需求，例如：
   - "帮我创建一个项目流程图"
   - "生成一个交互式的 HTML 页面"
   - "用 SVG 画一个 logo"
3. AI 生成内容后，会自动打开 Artifact 预览面板

### Artifact 面板功能

- **Content / Preview 切换**：查看源代码或预览效果
- **复制代码**：一键复制生成的内容
- **下载文件**：将内容保存为对应格式的文件
- **全屏模式**：放大预览区域

## Web Search 网络搜索

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/1yYx6hi/20260205140326.jpg)

Web Search 功能允许 AI 在回答问题时搜索互联网获取最新信息。

### 支持 Web Search 的模型

⚠️ **注意**：并非所有模型都支持 Web Search 功能。

**判断方法：**

- 在 Skills 菜单中，如果 **Web Search** 选项可点击（非灰色），表示当前模型支持该功能
- 如果选项呈灰色/禁用状态，表示当前模型不支持

**常见支持 Web Search 的模型：**

- 支持 `web_search_options` 参数的模型（如部分 OpenAI、Google 模型）

### 如何使用 Web Search

1. 点击 **Skills** 按钮
2. 启用 **Web Search**（🌐 图标）
3. 发送您的问题
4. AI 会搜索网络并基于最新信息回答

启用后，回复中会包含引用来源（grounding chunks），方便您验证信息。

## 图像生成与编辑

### 图像生成模式

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/6hOdh9V/20260205141003.jpg)

部分模型支持生成图像：

1. 点击 **Skills** 按钮
2. 选择 **Image Mode**（🖼️ 图标）
3. 描述您想要生成的图像
4. AI 将生成对应的图片

**Google Imagen 模型特殊配置：**
![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/NESbRjH/20260205140650.jpg)

使用 Google 的图像生成模型时，可以配置：

- **Image Aspect Ratio**：图像比例（1:1, 16:9, 9:16 等）
- **Image Resolution**：图像分辨率

### 图像编辑模式

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/yraseZ9/20260205140846.jpg)

支持图像输出的模型还可以进行图像编辑：

| 模式           | 功能说明                |
| -------------- | ----------------------- |
| **Basic Edit** | 基础编辑，修改图像内容  |
| **Cutout**     | 抠图功能，移除/替换背景 |
| **Upscale**    | 图像放大（暂未开放）    |

**使用步骤：**

1. 上传一张图片
2. 在 Skills 中选择对应的编辑模式
3. 描述您想要的编辑效果
4. AI 将返回编辑后的图像

## 语音输入与输出

### 语音输入

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/ZoPtPCi/20260205141116.jpg)

支持语音输入的模型可以接收语音消息：

1. 点击输入框中的 **麦克风** 图标开始录音
2. 录音完成后会自动上传
3. 发送消息时语音会被一并发送给 AI

### 语音输出

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/EMrPXuS/20260205141146.jpg)

部分模型支持语音回复：

1. 在 Skills 中启用 **Audio Mode**（🎵 图标）
2. 发送消息
3. AI 的回复将包含语音内容，可直接播放

## 高级参数设定

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/LieLZeb/20260205143826.jpg)

点击模型选择区域的 **⚙️ 设置** 图标，可以配置模型的高级参数。

### 可配置参数

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/Ks1RA3s/20260205143850.jpg)

| 参数                      | 说明                             | 范围         |
| ------------------------- | -------------------------------- | ------------ |
| **Provider**              | 选择模型提供商                   | 根据模型可用 |
| **System Prompt**         | 系统提示词，设定 AI 的角色和行为 | 文本         |
| **Enable Reasoning**      | 启用推理模式（思维链）           | 开/关        |
| **Max Reasoning Tokens**  | 推理时最大 token 数              | 0-100000     |
| **Max Completion Tokens** | 最大输出 token 数                | 0-262144     |
| **Temperature**           | 温度，控制输出随机性             | 0.0-2.0      |
| **Top P**                 | 累积概率采样                     | 0.0-1.0      |
| **Top K**                 | 只考虑概率最高的 K 个 token      | 0-100        |
| **Frequency Penalty**     | 频率惩罚                         | -2.0 to 2.0  |
| **Presence Penalty**      | 存在惩罚                         | -2.0 to 2.0  |
| **Repetition Penalty**    | 重复惩罚                         | 0.0-2.0      |
| **Min P**                 | 最小概率阈值                     | 0.0-1.0      |
| **Top A**                 | 自适应采样参数                   | 0.0-1.0      |

### 智能路由配置

如果使用自动路由模型，可以设置路由偏好：

- **Performance**：优先选择性能最佳的提供商
- **Price**：优先选择价格最低的提供商
- **Balanced**：平衡性能与价格

### 推理模式说明

- **必须开启**：某些模型（如 o1 系列）推理模式是强制开启的
- **可选开启**：部分模型支持选择性开启推理模式
- **不支持**：部分模型不支持推理模式

## 计费模式选择（PayGo vs Subscription）

![studio-Chat](https://cdn.marmot-cloud.com/storage/zenmux/2026/02/05/AV9ykpF/20260205144006.jpg)

ZenMux 提供两种计费模式，您可以根据使用情况灵活选择。

### Subscription Mode（订阅模式）

| 特点        | 说明                 |
| ----------- | -------------------- |
| 💰 付费方式 | 月度/年度订阅        |
| ✅ 适用场景 | 高频使用用户         |
| 📋 覆盖范围 | 订阅计划内包含的模型 |
| 🔸 图标     | 黄色订阅图标         |

### Pay As You Go Mode（按量付费）

| 特点        | 说明                               |
| ----------- | ---------------------------------- |
| 💰 付费方式 | 按实际使用量付费                   |
| ✅ 适用场景 | 低频使用或需要使用订阅不覆盖的模型 |
| 📋 覆盖范围 | 所有模型                           |
| 🔸 图标     | 蓝色 API 图标                      |

### 如何切换计费模式

1. 点击模型选择区域旁边的 **计费图标**（黄色/蓝色）
2. 在下拉菜单中选择：
   - **Subscription Mode** - 使用订阅额度
   - **Pay As You Go Mode** - 使用账户余额

### 注意事项

- 如果当前模型不在您的订阅计划内，将自动切换到 Pay As You Go 模式
- 部分高级模型可能需要账户有足够余额才能使用
- 系统会自动检测并提示您充值或升级订阅

## 文件上传功能

Studio-Chat 支持多种类型的文件上传。

### 支持的文件类型

| 类型     | 格式                   | 说明                     |
| -------- | ---------------------- | ------------------------ |
| **图片** | jpg, png, gif, webp 等 | 图像理解和分析           |
| **文档** | pdf                    | PDF 文档分析             |
| **文本** | txt, md, json, yaml 等 | 文本文件分析             |
| **视频** | mp4 等                 | 视频理解（需模型支持）   |
| **音频** | wav, mp3 等            | 语音转文字（需模型支持） |

### 上传方式

1. **点击上传**：点击输入框左侧的 **+** 按钮，选择文件类型后上传
2. **拖拽上传**：直接将文件拖拽到输入区域
3. **粘贴上传**：复制图片后在输入框中粘贴

### 文件预览

上传的文件会显示缩略图，点击可以预览：

- 图片：查看大图
- PDF：在线查看 PDF 内容
- 文本：查看文本内容

## 会话管理

### 会话列表

页面左侧边栏显示您的历史会话列表，支持：

- **新建会话**：点击 "New Chat" 按钮
- **切换会话**：点击任意历史会话
- **删除会话**：在会话项上右键或点击删除按钮
- **重命名会话**：双击会话名称进行修改

### 会话分组

会话按时间自动分组：

- Today（今天）
- Yesterday（昨天）
- Last 7 Days（最近 7 天）
- Last 30 Days（最近 30 天）
- Older（更早）

### 会话保存

- 每轮对话会自动保存
- 会话名称默认使用您第一条消息的内容
- 可以随时返回继续之前的对话

## 快捷操作

| 操作         | 快捷键/方式            |
| ------------ | ---------------------- |
| 发送消息     | `Enter`                |
| 换行         | `Shift + Enter`        |
| 停止生成     | 点击 Stop 按钮         |
| 复制回复     | 点击消息下方的复制图标 |
| 重新生成     | 点击消息下方的刷新图标 |
| 查看代码示例 | 点击 `</>` 图标        |

## 常见问题

### Q: 为什么某些功能不可用？

A: 不同模型支持的功能不同，请确保选择的模型支持您需要的功能。

### Q: PK 模式最多支持几个模型？

A: 最多支持 10 个模型同时对比。

### Q: 如何知道模型是否支持 Web Search？

A: 在 Skills 菜单中，如果 Web Search 选项可点击，表示支持。

### Q: 订阅模式和按量付费可以同时使用吗？

A: 可以，每个对话窗口可以独立选择计费模式。

### Q: 文件上传有大小限制吗？

A: 有，具体限制取决于文件类型和当前模型的支持情况。

## 获取帮助

::: tip 联系我们
如果您在使用过程中遇到任何问题，或有任何建议和反馈，欢迎通过以下方式联系我们：

- **官方网站**：<https://zenmux.ai>
- **技术支持邮箱**：[support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**：[bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**：[@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**：<http://discord.gg/vHZZzj84Bm>

更多联系方式和详细信息，请访问我们的[联系我们页面](/zh/help/contact)。
:::
