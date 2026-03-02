# 阿里云部署 OpenClaw 并集成 ZenMux 实践

> 通过 [ZenMux](https://zenmux.ai/)，你可以第一时间体验到：
>
> - **OpenAI GPT-5.2** —— 通用大模型，代码生成和逻辑推理能力顶尖
> - **Anthropic Claude Sonnet 4.6** —— 超长上下文，复杂文档处理利器
> - **Google Gemini 3.1 Pro** —— 原生多模态支持，图文理解能力强
>
> 💡 **无需分别注册 OpenAI、Google、Anthropic 等海外平台**，一个 ZenMux 账号全搞定，告别复杂的信用卡绑定和区域限制。
>
> ⚠️ **安全警告**：按照当前[《OpenClaw 安全使用规范》](https://s.antgroup-inc.cn/home/talk/articleDetail?regionId=100001&id=20900001)要求，ZenMux 背后属于外部模型服务，内部办公环境**禁止直接使用**。如需体验，请使用**非办公环境**部署，例如：阿里云服务器、个人 Mac mini 等。

## 部署 OpenClaw

> 部署 OpenClaw 本身不复杂，如果没有闲置的Mac，可以考虑云服务器，云服务器优点 24 小时在线，不怕断电，不占你电脑资源，各大云服务厂商也推出了各种 OpenClaw 的一键部署方案，这里用的阿里云，只要 ~~68 元/年~~（当前活动好像结束了，可按月购买体验）

[部署 OpenClaw 镜像并构建钉钉 AI 员工](https://help.aliyun.com/zh/simple-application-server/use-cases/quickly-deploy-and-use-openclaw)

参照阿里云提供的文档，部署基本可以快速搞定，注意文档里的钉钉不是蚂蚁钉，目前蚂蚁钉申请应用的流程比较麻烦，可以先按照文档使用钉钉接入（用自己的个人钉钉账号创建一个企业，再访问钉钉开放平台就可以）

> **阿里云默认接入百炼 API Key**，有一定免费额度，调通 Web UI 和钉钉足够了

## 配置 ZenMux

### 前置条件

1. OpenClaw 已在服务器上完成部署并正常运行
2. 已注册 ZenMux 账号并获取 API 密钥

---

### 第 1 步：获取 ZenMux API Key

1. 登录 [ZenMux 控制台](https://zenmux.ai)
2. 进入「API 密钥」页面
3. 点击「创建新密钥」
4. 复制生成的密钥（格式：`sk-ss-v1-xxxx` 或 `sk-ai-v1-xxxx`）

> 说明：
>
> - `sk-ss-v1-` 开头：订阅版（按月付费）
> - `sk-ai-v1-` 开头：按量付费版

---

### 第 2 步：编辑 OpenClaw 配置

登录到服务器，编辑 `~/.openclaw/openclaw.json`（阿里云服务器默认路径为 `/home/admin/.openclaw`），修改 `models` 和 `agents` 节点：

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "zenmux": {
        "baseUrl": "https://zenmux.ai/api/v1",
        "apiKey": "sk-ss-v1-换成自己的 zenmux api key",
        "api": "openai-completions",
        "models": [
          {
            "id": "openai/gpt-5.2",
            "name": "GPT-5.2 via ZenMux",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": {
              "input": 0,
              "output": 0,
              "cacheRead": 0,
              "cacheWrite": 0
            },
            "contextWindow": 200000,
            "maxTokens": 8192
          },
          {
            "id": "google/gemini-3.1-pro-preview",
            "name": "Gemini 3.1 Pro via ZenMux",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": {
              "input": 0,
              "output": 0,
              "cacheRead": 0,
              "cacheWrite": 0
            },
            "contextWindow": 200000,
            "maxTokens": 8192
          },
          {
            "id": "anthropic/claude-sonnet-4.6",
            "name": "Claude Sonnet 4.6 via ZenMux",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": {
              "input": 0,
              "output": 0,
              "cacheRead": 0,
              "cacheWrite": 0
            },
            "contextWindow": 200000,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "zenmux/openai/gpt-5.2"
      },
      "models": {
        "zenmux/openai/gpt-5.2": {},
        "zenmux/google/gemini-3.1-pro-preview": {},
        "zenmux/anthropic/claude-sonnet-4.6": {}
      }
    }
  }
}
```

---

### 第 3 步：验证配置

在服务器执行：

```bash
# 查看可用模型列表
openclaw models list
```

验证成功的标志：列表中出现 `zenmux/openai/gpt-5.2` 等 ZenMux 模型。

示例输出：

```
NAME                                PROVIDER    ID
openai/gpt-5.2                      zenmux      openai/gpt-5.2
google/gemini-3.1-pro-preview       zenmux      google/gemini-3.1-pro-preview
anthropic/claude-sonnet-4.6         zenmux      anthropic/claude-sonnet-4.6
```

继续执行：

```bash
# 设置默认模型
openclaw models set zenmux/openai/gpt-5.2

# 测试对话
openclaw agent --local --agent main --message "你好，测试一下"
```

---

## 额外配置

以下配置强烈建议完成：联网搜索 & Browser。

> 有一些理论上也可以通过对话让 OpenClaw 自己安装，不过个人尝试下来会出现 OpenClaw 自己把自己改挂了的情况 😅，最后服务器上装了一个 Claude Code 来帮我调试 OpenClaw，下面是 ~~古法~~ 手动配置的流程

---

### 联网搜索配置（Tavily）

阿里云 OpenClaw 应用镜像默认内置基于 SearXNG 的联网搜索 Skill，实际使用下来经常出现超时或者搜不到的情况。官方推荐的 Brave 注册成本比较高，这里推荐使用 **Tavily**，注册简单且每月免费 1000 次。

#### 第 1 步：注册并获取 API Key

访问 [Tavily 官网](https://tavily.com) 注册账号，进入控制台获取 API Key。

![openclaw-alibaba](https://cdn.marmot-cloud.com/storage/zenmux/2026/03/02/UGt4JSE/1772423318928-3482a147-3fbc-49a1-9f83-02dfdf87d68b.png)

> 提示：也可以直接点击「Generate MCP Link」，将生成的链接发给 OpenClaw 让它自动添加 MCP 服务

#### 第 2 步：安装 Tavily 插件

```bash
openclaw plugins install openclaw-tavily
```

#### 第 3 步：重启网关

```bash
openclaw gateway restart
```

#### 第 4 步：配置插件

编辑 `~/.openclaw/openclaw.json`，新增：

```json
{
  "plugins": {
    "entries": {
      "openclaw-tavily": {
        "enabled": true,
        "config": {
          "apiKey": "tvly-..."
        }
      }
    }
  }
}
```

#### 第 5 步：验证配置

告诉 OpenClaw 后续联网搜索优先使用 Tavily 即可。

![openclaw-alibaba](https://cdn.marmot-cloud.com/storage/zenmux/2026/03/02/BhcI5qH/1772430910203-4eb0b758-ccb1-4428-a326-af8cc7aba537.png)

---

### Browser 配置

Browser 工具允许 OpenClaw 直接操作浏览器，进行网页访问、截图、自动化操作等。

> 以下步骤仅适用于 CentOS/OpenCloudOS 环境（阿里云 ECS 默认系统）

#### 第 1 步：安装 Google Chrome

```bash
sudo yum install -y wget
sudo yum install -y https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
```

若安装失败，先装依赖：

```bash
sudo yum install -y nss atk cups-libs libdrm libXcomposite libXdamage libXrandr libgbm alsa-lib pango gtk3
sudo yum install -y liberation-fonts xdg-utils google-noto-sans-cjk-fonts
```

#### 第 2 步：安装中文字体

```bash
sudo yum install -y fontconfig freetype
sudo yum install -y google-noto-sans-cjk-fonts
sudo yum install -y wqy-microhei
sudo fc-cache -f -v
```

验证字体：

```bash
fc-list | grep -i -E "noto|cjk|wqy|wenquanyi" | head
```

#### 第 3 步：配置 Browser 选项

```bash
openclaw config set browser.executablePath "/usr/bin/google-chrome"
openclaw config set browser.defaultProfile "openclaw"
openclaw config set browser.headless true
openclaw config set browser.noSandbox true
```

#### 第 4 步：重启 Gateway

```bash
openclaw gateway restart
```

#### 第 5 步：验证配置

```bash
openclaw browser status
```

预期输出：`running: true`，不再显示 `browser: unknown`
用 OpenClaw browser 截图打开任意中文站点（如百度），若中文正常显示即成功。

![openclaw-alibaba](https://cdn.marmot-cloud.com/storage/zenmux/2026/03/02/9vNTPwc/1772430228612-c38c93c8-ff1f-4821-b3cf-de8eb555810f.png)

---

### 钉钉 AI 卡片配置

OpenClaw 支持钉钉 AI 互动卡片，可实现流式输出、思考过程展示等效果。

> 前置条件：已完成钉钉应用和机器人的基础配置

#### 第 1 步：创建 AI 卡片模板

1. 访问 [钉钉卡片平台](https://open-dev.dingtalk.com/fe/card)
2. 新建模板 → 选择「AI 卡片」类型 → 关联自己的钉钉应用

![openclaw-alibaba](https://cdn.marmot-cloud.com/storage/zenmux/2026/03/02/cmiFDG7/1772432608573-a92e03aa-200b-4736-ba3b-8e26fd2b75c5.png)

3. 不做任何修改，直接保存并发布

![openclaw-alibaba](https://cdn.marmot-cloud.com/storage/zenmux/2026/03/02/OpcRPhn/1772432662944-52728c1a-f849-490a-9244-3f3da247d747.png)

4. 记录模板 ID，后续配置需要

![openclaw-alibaba](https://cdn.marmot-cloud.com/storage/zenmux/2026/03/02/IecBwbz/1772433308898-862ed747-c3a5-4f2c-b780-2f97336e5d82.png)

#### 第 2 步：开启卡片权限

进入钉钉[应用开发](https://open-dev.dingtalk.com/fe/app)页面，选择对应应用，在权限管理中开启：

| 权限                    | 说明                |
| ----------------------- | ------------------- |
| ✅ Card.Instance.Write  | 创建和投放卡片实例  |
| ✅ Card.Streaming.Write | AI 卡片流式更新权限 |

![openclaw-alibaba](https://cdn.marmot-cloud.com/storage/zenmux/2026/03/02/5rf8dbJ/1772433461434-c8358115-1984-4f53-b133-a67f7327e645.png)

#### 第 3 步：配置 OpenClaw

编辑 `~/.openclaw/openclaw.json`，修改 `channels.dingtalk`：

```json
{
  "channels": {
    "dingtalk": {
      "enabled": true,
      "clientId": "dingxxxxxx",
      "clientSecret": "your-app-secret",
      "robotCode": "dingxxxxxx",
      "messageType": "card",
      "cardTemplateId": "xxxxxx",
      "cardTemplateKey": "content",
      "dmPolicy": "open",
      "groupPolicy": "open"
    }
  }
}
```

#### 关键配置参数说明

| 参数            | 必填 | 说明                                       |
| --------------- | ---- | ------------------------------------------ |
| clientId        | ✅   | 钉钉应用的 AppKey                          |
| clientSecret    | ✅   | 钉钉应用的 AppSecret                       |
| messageType     | ❌   | `markdown`（默认）或 `card`                |
| cardTemplateId  | ❌   | AI 卡片模板 ID                             |
| cardTemplateKey | ❌   | 卡片内容字段，默认 `content`               |
| dmPolicy        | ❌   | 私聊策略：`open` / `pairing` / `allowlist` |
| groupPolicy     | ❌   | 群聊策略：`open` / `allowlist`             |

#### 第 4 步：重启并验证

```bash
openclaw gateway restart
```

在钉钉进行对话测试，若看到卡片式交互界面即配置成功。

## 实践场景

### 定时任务场景：ZenMux 新模型监控

配置一个定时任务，每天检查 ZenMux 是否有新模型上线，第一时间体验最新模型能力。

![openclaw-alibaba](https://cdn.marmot-cloud.com/storage/zenmux/2026/03/02/FUtNPv7/1772435933384-652b08f3-896f-4c0a-b7ad-9ad547f2a97c.png)

在 Web UI 中可以看到配置的定时任务，可手动触发任务，验证逻辑正确性。

![openclaw-alibaba](https://cdn.marmot-cloud.com/storage/zenmux/2026/03/02/pgABFg0/1772436961965-e1695579-508d-48a8-af26-a2ae3c073d40.png)

实际执行效果：机器人将自动推送新模型公告到钉钉群。

![openclaw-alibaba](https://cdn.marmot-cloud.com/storage/zenmux/2026/03/02/wSMhI1h/1772436081263-513f638e-086d-4313-aa08-4df49058a693.png)

## 相关资源

- [ZenMux 官方文档](https://zenmux.ai/docs/zh/best-practices/openclaw.html)
- [OpenClaw 官方文档](https://openclaw.io/docs)
- [OpenClaw GitHub](https://github.com/openclaw)
- [Tavily 官网](https://tavily.com)

## 联系我们

如果您在使用过程中遇到任何问题，或有建议和反馈，请通过以下渠道联系我们：

::: tip 获取帮助

- **官方网站**：<https://zenmux.ai>
- **技术支持邮箱**：[support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**：[bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**：[@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**：<http://discord.gg/vHZZzj84Bm>

更多联系方式和详情，请访问我们的[联系我们页面](/zh/help/contact)。
:::
