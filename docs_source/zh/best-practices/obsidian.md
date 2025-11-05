# 通过 ZenMux 使用 Obsidian Copilot 指南

Obsidian Copilot 是一个强大的 AI 助手插件,通过与 ZenMux 的集成,您可以在 Obsidian 笔记中使用多种先进的 AI 模型,获得更智能的写作和思考体验。

::: info 兼容性说明
ZenMux 完全支持 OpenAI API 协议,可以无缝集成到 Obsidian Copilot 插件中。只需简单配置即可使用。

注意 OpenAI 协议的 base_url="https://zenmux.ai/api/v1"。
:::

## 安装和配置

### 1. 安装 Obsidian

前往 [Obsidian 官网](https://obsidian.md) 下载并安装 Obsidian 桌面应用。

::: tip 系统支持
Obsidian 支持 Windows、macOS 和 Linux 系统,选择适合您系统的版本即可。
:::

### 2. 安装 Copilot 插件

1. 打开 Obsidian 应用
2. 点击左下角的设置图标（齿轮图标）
3. 在设置页面中找到 **Community plugins（社区插件）**
4. 点击 **Browse（浏览）** 按钮进入插件社区

![浏览社区插件](https://github.com/user-attachments/assets/f451933a-66c9-433b-a8e2-4f42e5449e09)
![社区插件搜索](https://github.com/user-attachments/assets/094a4a7a-dae7-413e-bcab-d66241a08db7)

1. 在搜索框中输入 **copilot**
2. 找到 **Obsidian Copilot** 插件,点击 **Install（安装）** 按钮

![安装 Copilot 插件](https://github.com/user-attachments/assets/de363fa9-1d14-487a-992c-fa71659e3c8a)

1. 安装完成后,点击 **Enable（启用）** 激活插件

### 3. 配置 ZenMux 模型

#### 获取 ZenMux API Key

::: warning 重要配置
在配置之前,您需要先获取 ZenMux API Key。请访问 [ZenMux 控制台](https://zenmux.ai/settings/keys) 创建或查看您的 API Key。
:::

#### 添加自定义模型

1. 进入 Obsidian 设置页面
2. 在左侧菜单中找到 **Community plugins** → **Copilot** 插件设置
3. 点击 **Models** 标签页
4. 点击 **Add model（添加模型）** 按钮

![添加模型按钮](https://github.com/user-attachments/assets/d511c698-c837-4759-8001-979b9abbdf4b)

#### 填写模型配置

在弹出的配置表单中,按照以下说明填写:

![模型列表页面](https://github.com/user-attachments/assets/d17f7e8f-c500-4bad-909b-377b4387a551)

- **Provider（提供商）**: 选择 `OpenAI`
- **Base URL**: 填写 `https://zenmux.ai/api/v1`
- **API Key**: 填写您的 ZenMux API Key（以 `sk-ai-v1-` 开头）
- **Model ID**: 填写 ZenMux 上支持 OpenAI Chat-Completion 协议的模型 slug

### 4. 测试模型连接

配置完成后,点击 **Test（测试）** 按钮验证模型连通性:

如果配置正确,您将看到成功提示。如果连接失败,请参考[故障排除](#故障排除)章节。

## 使用 Copilot

### 启动聊天界面

配置完成后,您可以通过以下方式使用 Copilot:

1. 点击左侧边栏的 Copilot 图标（机器人图标）
2. 进入聊天界面
3. 在模型选择器中选择您配置的 ZenMux 模型

![使用 Copilot 聊天](https://github.com/user-attachments/assets/a0cec736-e2e7-4b55-8c79-4dd653d7b5f4)
![选择模型](https://github.com/user-attachments/assets/1da9b79f-c45e-4aae-b116-a9bc8c896aa2)

## 故障排除

### 常见问题解决

::: details API Key 错误
**问题**: 提示 API Key 无效或认证失败

**解决方案**:

- 检查 API Key 是否正确复制,确保没有多余的空格
- 验证 API Key 格式是否以 `sk-ai-v1-` 开头
- 确认 API Key 是否已激活且有足够余额
- 在 [ZenMux 控制台](https://zenmux.ai/settings/keys) 查看 API Key 状态
  :::

::: details 连接失败问题
**问题**: Copilot 无法连接到 ZenMux 服务

**解决方案**:

- 检查网络连接是否正常
- 验证 Base URL 是否配置为 `https://zenmux.ai/api/v1`（注意是 `/v1` 而不是 `/anthropic`）
- 确认防火墙或代理设置没有阻止连接
- 尝试在浏览器中访问 <https://zenmux.ai> 确认服务可访问
  :::

::: details 模型不可用
**问题**: 提示模型不存在或不支持 OpenAI 协议

**解决方案**:

- 检查 Model ID 是否正确,注意大小写和拼写
- 常见错误: `anthropic/claude-hiku-4.5-sonnet` 应该是 `anthropic/claude-haiku-4.5`（haiku 不是 hiku）
- 访问 [ZenMux 模型列表](https://zenmux.ai/models) 筛选 "OpenAI API Compatible" 查看可用模型
- 确认所选模型支持 OpenAI Chat-Completion 协议
  :::

::: details 测试成功但使用时失败
**问题**: 测试连接成功,但实际使用时报错

**解决方案**:

- 检查 API Key 余额是否充足
- 验证模型能力配置是否正确（Chat、Streaming 等）
- 查看 Obsidian 开发者控制台（`Ctrl/Cmd + Shift + I`）获取详细错误信息
- 尝试切换到其他模型测试是否为模型特定问题
  :::

::: details 响应速度慢或超时
**问题**: AI 响应时间过长或请求超时

**解决方案**:

- 检查网络连接质量
- 尝试使用更快的模型,如 `anthropic/claude-haiku-4.5` 或 `deepseek/deepseek-chat`
- 减少单次对话的文本长度
- 在 Copilot 设置中调整超时时间参数
  :::

::: details 插件配置丢失
**问题**: 重启 Obsidian 后配置丢失

**解决方案**:

- 确认 Copilot 插件已正确启用
- 检查 Obsidian 仓库（Vault）的 `.obsidian/plugins/obsidian-copilot/` 目录权限
- 尝试重新安装 Copilot 插件
- 备份重要配置,避免意外丢失
  :::

::: tip 联系我们
如果您在使用过程中遇到任何问题,或有任何建议和反馈,欢迎通过以下方式联系我们:

- **官方网站**: <https://zenmux.ai>
- **技术支持邮箱**: [support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**: [bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**: [@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**: <http://discord.gg/vHZZzj84Bm>

更多联系方式和详细信息,请访问我们的[联系我们页面](/zh/help/contact)。
:::
