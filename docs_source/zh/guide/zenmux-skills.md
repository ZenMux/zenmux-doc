---
head:
  - - meta
    - name: description
      content: ZenMux Skills 是 ZenMux 官方发布的一组 Skills，遵循 Skills 开放标准，支持 45+ 主流 Agent（Claude Code、Cursor、Cline、Codex、Gemini CLI、Copilot、Amp、OpenCode、Warp…），让你直接在常用 Agent 里查用量、配工具、看状态、提反馈。
  - - meta
    - name: keywords
      content: ZenMux, Skills, Claude Code, Cursor, Cline, Codex, Gemini CLI, GitHub Copilot, Amp, OpenCode, Warp, Agent, 扩展, 状态栏, 文档助手, 用量查询, 接入配置, 反馈, zenmux-context, zenmux-setup, zenmux-usage, zenmux-feedback, zenmux-statusline
---

# ZenMux Skills

**ZenMux Skills** 是 ZenMux 官方发布的一组 [Skills](https://agentskills.io)。它们遵循 **Skills 开放标准**，可以被 **45+ 主流 AI Agent** 识别与调用 —— 无论你常用的是 **Claude Code、Cursor、Cline、Codex、Gemini CLI、GitHub Copilot、Amp、OpenCode、Warp、Antigravity、Kimi Code CLI、Deep Agents、Firebender** 还是其他受支持的 Agent，一键安装后都能直接：

- 🔍 **问文档**：用自然语言询问 ZenMux 的任何特性，由 Agent 基于**最新官方文档**作答并附出处
- 🛠 **配工具**：一步步引导把 Cursor / Cline / Claude Code / Cherry Studio 等工具接入 ZenMux
- 📊 **查用量**：随时查配额余量、订阅详情、钱包余额、单次请求成本
- 💬 **提反馈**：用对话的方式提交 Bug / Feature Request，自动创建 GitHub Issue
- 📟 **看状态**：在 Claude Code 底部状态栏常驻显示订阅套餐、配额使用率、钱包余额

::: tip 💡 什么是 Skills？
Skills 是 [Agent Skills 开放标准](https://agentskills.io) 定义的一种扩展机制。每个 Skill 就是一个带 YAML 元信息的 `SKILL.md` 文件；安装之后：

- 你可以用 `/skill-name` **主动调用**；
- Agent 也会在识别到相关意图时**自动触发**（由每个 Skill 自己的 `description` 字段决定何时被唤起）。

因为标准开放，同一份 Skill 可以被多种 Agent（Claude Code、Cursor、Cline、Codex、Copilot 等）加载。
:::

---

## 前置条件

- 至少有一个受支持的 AI Agent（[见下方列表](#支持的-agent)）
- 拥有 [ZenMux 账号](https://zenmux.ai/login)
- 本机具备 Node.js 环境（`npx` 可用）

---

## 一键安装

推荐一次性安装全部 Skills：

```bash
npx skills add ZenMux/skills
```

运行后会进入交互式选择界面：先勾选要安装的 Skills，再勾选要把它们装进哪些 Agent。

<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/04/21/Qvoo1yw/skills.png" alt="npx skills add ZenMux/skills 的交互式选择界面" style="border-radius:5px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">

工具会根据你的选择，把每个 Skill 拷贝到对应 Agent 的 Skills 目录（例如 Claude Code → `~/.claude/skills/`、Cursor/Cline/Codex 等共享 → `~/.agents/skills/`、Augment → `~/.augment/skills/`，依此类推）。之后这些 Agent 在下次会话里就能识别并调用 Skills。

也可以按需只装单个 Skill：

```bash
# 文档助手
npx skills add https://github.com/zenmux/skills --skill zenmux-context

# 接入配置助手
npx skills add https://github.com/zenmux/skills --skill zenmux-setup

# 用量查询助手
npx skills add https://github.com/zenmux/skills --skill zenmux-usage

# 反馈提交助手
npx skills add https://github.com/zenmux/skills --skill zenmux-feedback

# 账户状态栏（仅适用于 Claude Code）
npx skills add https://github.com/zenmux/skills --skill zenmux-statusline
```

::: info 📍 关于 Skills 安装位置
不同 Agent 的约定不同，`npx skills add` 会自动写到各自目录。多数 Agent 支持**热更新**——新增或修改 Skill 无需重启，下次会话即可生效（具体以你使用的 Agent 为准）。
:::

---

## 支持的 Agent

`npx skills add` 目前已适配 **45+ 个 Agent**，分两类：

### Universal（`.agents/skills`，共享目录，始终包含）

这些 Agent 都读取同一份 `.agents/skills`，一次安装即可对全部生效：

| Agent | Agent | Agent |
|------|------|------|
| [Amp](https://ampcode.com/) | [Antigravity](https://antigravity.google/) | [Cline](https://cline.bot/) |
| [Codex](https://github.com/openai/codex) | [Cursor](https://cursor.sh/) | [Deep Agents](https://deepagents.ai/) |
| [Firebender](https://firebender.com/) | [Gemini CLI](https://github.com/google-gemini/gemini-cli) | [GitHub Copilot](https://github.com/features/copilot) |
| [Kimi Code CLI](https://platform.moonshot.cn/) | [OpenCode](https://opencode.ai/) | [Warp](https://www.warp.dev/) |

### Additional（各自独立目录，按需选择）

每个 Agent 使用自己的 Skills 目录，在交互界面里勾选后才会安装：

- **Augment**（`.augment/skills`）
- **IBM Bob**（`.bob/skills`）
- **Claude Code**（`.claude/skills`）
- **OpenClaw**（`skills`）
- **CodeBuddy**（`.codebuddy/skills`）
- **Command Code**（`.commandcode/skills`）
- **Continue**（`.continue/skills`）
- **Cortex Code**（`.cortex/skills`）
- ……以及 **23+** 个其他 Agent

::: tip 💡 实际支持列表以 CLI 为准
Agent 列表会持续扩充，最新名单以执行 `npx skills add ZenMux/skills` 时展示的交互界面为准。
:::

---

## Skills 一览

| Skill | 一句话介绍 | 典型触发语 |
| ----- | --------- | --------- |
| [**zenmux-context**](#zenmux-context-文档助手) | 基于最新 ZenMux 官方文档回答问题 | "ZenMux 怎么做模型路由？" |
| [**zenmux-setup**](#zenmux-setup-接入配置助手) | 手把手引导工具接入 ZenMux | "帮我把 Cursor 接入 ZenMux" |
| [**zenmux-usage**](#zenmux-usage-用量查询助手) | 查账户用量、余额、订阅、单次成本 | "我还剩多少 Flow？" |
| [**zenmux-feedback**](#zenmux-feedback-反馈提交助手) | 用对话提交 GitHub Issue | "我想给 ZenMux 提个 Bug" |
| [**zenmux-statusline**](#zenmux-statusline-账户状态栏) | 在 Claude Code 状态栏显示账户信息（Claude Code 专属） | "帮我配置 ZenMux 状态栏" |

---

### zenmux-context — 文档助手

**做什么**：基于 **ZenMux 最新的官方文档**回答问题，并在回答中附上文档出处。支持中英文。

**什么时候触发**：你询问 ZenMux 任何与产品、API、配置、模型路由、供应商路由、订阅制、按量计费、多模态、工具调用、可观测性、最佳实践相关的问题时，Agent 会自动调用它。

**示例对话**：

```text
你：ZenMux 的模型路由和供应商路由有什么区别？
Agent：[拉取最新文档后作答，附出处链接]

你：/zenmux-context 介绍一下 Prompt Caching
Agent：[基于 prompt-cache 文档作答]
```

**它帮你解决的问题**：不必切出 Agent 去翻网页，也不用担心模型训练数据过时。

---

### zenmux-setup — 接入配置助手

**做什么**：以交互方式引导你把 **Base URL、API Key、模型 Slug** 填对，把任意工具或 SDK 接入 ZenMux。

**什么时候触发**：你说"怎么配置"、"base url 填什么"、"接入 ZenMux"、"配置 API Key"，或提到具体工具名（Cursor / Cline / Claude Code / Cherry Studio / Obsidian / Sider / Codex / Gemini CLI / opencode 等）时。

**示例对话**：

```text
你：我想把 Cursor 配置成走 ZenMux，一步步告诉我
Agent：[调用 zenmux-setup]
        好，先确认一下：你是订阅制还是 Pay As You Go？
        ……（继续引导你填每一个字段，并给出验证方法）
```

**它帮你解决的问题**：避免 Base URL 写错、API Key 类型选错、模型 Slug 拼错等常见配置陷阱。

---

### zenmux-usage — 用量查询助手

**做什么**：实时调用 [ZenMux Management API](/zh/guide/quickstart#platform-api) 拉取：

- 订阅套餐详情（Tier、金额、计费周期）
- 5 小时 / 7 天 / 月度配额用量
- 账户健康状态
- Flow 汇率
- Pay As You Go 钱包余额（充值余额 + 奖励余额）
- 单次 Generation 的成本、Token 分解、延迟
- 平台统计数据（时序趋势、模型排行榜、供应商市场份额）

**什么时候触发**：你说"我还剩多少额度"、"余额还有多少"、"上一次请求花了多少"、"查用量"、"订阅详情"、"Flow 汇率"等。

**前置条件**：需要 `ZENMUX_MANAGEMENT_KEY` 环境变量，前往 [Management 控制台](https://zenmux.ai/platform/management) 创建。

**示例对话**：

```text
你：我这周用了多少 Flow？还剩多少？
Agent：[调用 zenmux-usage]
        7 天配额：6182 Flows，已用 416.11（6.7%），还剩 5765.89。

你：/zenmux-usage 查一下最近一次生成花了多少
Agent：[返回 generation id、token 分解、成本明细]
```

**它帮你解决的问题**：配额焦虑、余额不透明、请求成本看不见。

---

### zenmux-feedback — 反馈提交助手

**做什么**：通过自然对话收集 Bug / Feature Request / 产品建议，整理完善后调用 `gh` CLI **自动在 ZenMux 仓库创建 GitHub Issue**。

**什么时候触发**：你说"我想给 ZenMux 提 Bug"、"反馈一下问题"、"建议新增一个功能"等。

**前置条件**：本机已安装并登录 [GitHub CLI (`gh`)](https://cli.github.com/)。

**示例对话**：

```text
你：我想反馈一个 Bug，Anthropic 协议调某些模型偶尔返回 500
Agent：[调用 zenmux-feedback，对话式采集信息]
        好，我帮你整理一下：
        1. 具体是哪个模型？
        2. 错误出现的频率？
        3. 有 generation id 可以提供吗？
        ……（整理后自动创建 Issue，并返回 Issue 链接）
```

**它帮你解决的问题**：反馈链路冗长、信息采集不完整、无需手动填写 Issue 模板。

---

### zenmux-statusline — 账户状态栏

::: warning ⚠️ 仅适用于 Claude Code
该 Skill 依赖 Claude Code 的 **statusLine** 机制，目前只在 Claude Code 里生效。如果你用的是其它 Agent，可跳过本节，选用 `zenmux-usage` 交互式查账户数据即可。
:::

**做什么**：在 Claude Code 底部安装一个**双行状态栏**，同时展示会话指标和 ZenMux 账户信息。

```text
[claude-opus-4-7[1m]] 📁 skills | 🌿 main* | ████░░░░░░ 42% ctx | 💾 r72.0k w5.0k
⚡ ZenMux Ultra | 🔑 Sub sk-ss-...6e6 | 5h █░░░░ 19% · 7d █░░░░ 24% | 💳 Bal $492.74
```

::: tip 💡 安装后需要激活一次
`npx skills add` 仅把 Skill 拷贝到本地。首次使用时需要在 **Claude Code** 里主动调用一次：

```text
/zenmux-statusline
```

Claude Code 会帮你把状态栏脚本写入配置、补齐依赖（`curl`、`jq`），并提示你设置 `ZENMUX_MANAGEMENT_KEY`。之后它会常驻状态栏，无需再次调用。
:::

#### 第一行 · 会话信息（由 Claude Code 注入）

| 区段 | 示例 | 说明 |
|------|------|------|
| **模型** | `[claude-opus-4-7[1m]]` | 当前使用的模型 Slug |
| **目录** | `📁 skills` | 当前工作目录名 |
| **Git** | `🌿 main*` | 分支名；`*` 表示有未提交改动 |
| **上下文** | `████░░░░░░ 42% ctx` | 上下文窗口使用率，<70% 绿、70-89% 黄、≥90% 红 |
| **缓存** | `💾 r72.0k w5.0k` | 上一次 API 调用的 Prompt Cache：`r` 命中、`w` 新增。首次 API 调用前隐藏 |

#### 第二行 · ZenMux 账户

| 区段 | 示例 | 说明 |
|------|------|------|
| **套餐** | `⚡ ZenMux Ultra` | 订阅套餐名；账户异常时带 `⚠` 后缀 |
| **API Key** | `🔑 Sub sk-ss-...6e6` | 密钥类型（`Sub` = 订阅，`PAYG` = 按量）+ 脱敏 Key。未设置 `ZENMUX_API_KEY` 时隐藏 |
| **5 小时配额** | `5h █░░░░ 19%` | 5 小时滚动窗口用量；100% 时显示 `⏳ Xh Ym` 倒计时至重置 |
| **7 天配额** | `7d █░░░░ 24%` | 7 天滚动窗口用量，颜色与重置逻辑同上 |
| **PAYG 余额** | `💳 Bal $492.74` | 可用钱包余额（充值 + 奖励）；无 PAYG 余额时隐藏 |

#### 降级行为

| 情况 | 行为 |
|------|------|
| 未设置 `ZENMUX_MANAGEMENT_KEY` | 第二行提示：`⚙ Set ZENMUX_MANAGEMENT_KEY to display account data` |
| 未设置 `ZENMUX_API_KEY` | 隐藏 API Key 区段，其他正常展示 |
| API 调用失败 | 优先使用缓存；无缓存则暂时隐藏第二行 |

#### 刷新频率

| 数据 | 刷新间隔 | 来源 |
|------|---------|------|
| 会话信息（模型、上下文、缓存） | 实时 | Claude Code 每次助手响应后注入 statusLine |
| Git 分支 | 5 秒 | 会话内缓存 |
| ZenMux 账户（套餐、配额、PAYG） | 120 秒 | 全局共享缓存（跨会话） |

#### 环境依赖

- 本机已安装 `curl` 与 `jq`（macOS：`brew install jq`）
- 已设置 `ZENMUX_MANAGEMENT_KEY` 环境变量（[Management 控制台](https://zenmux.ai/platform/management)）

---

## 环境变量一览

这些 Skills 用到的环境变量：

| 变量 | 用途 | 在哪里创建 |
|------|------|-----------|
| `ZENMUX_API_KEY` | 通用 API Key；`zenmux-statusline` 用于识别密钥类型 | [订阅管理](https://zenmux.ai/platform/subscription) 或 [PAYG 管理](https://zenmux.ai/platform/pay-as-you-go) |
| `ZENMUX_MANAGEMENT_KEY` | Management API Key；`zenmux-usage` 与 `zenmux-statusline` 用来拉取账户数据 | [Management 控制台](https://zenmux.ai/platform/management) |

写入 Shell 启动文件（`~/.zshrc` 或 `~/.bashrc`）：

```bash
export ZENMUX_API_KEY="<你的 ZenMux API Key>"
export ZENMUX_MANAGEMENT_KEY="<你的 Management API Key>"
```

应用配置：

```bash
source ~/.zshrc   # 或 source ~/.bashrc
```

---

## 如何调用一个 Skill

每个 Skill 都支持两种触发方式（具体交互形式以你使用的 Agent 为准）：

1. **自动触发**：你用自然语言描述意图时，Agent 依据 Skill 的 `description` 判断是否调用。
2. **显式调用**：多数 Agent 支持输入 `/` 后在菜单里选择，或直接输入 `/skill-name [参数]`。

同一个需求两种写法都可以：

```text
# 自动触发
我还剩多少 Flow 额度？

# 显式调用
/zenmux-usage 5 小时配额
```

::: tip 💡 没按预期触发怎么办？
如果 Agent 没有自动调用你想要的 Skill，直接用 `/skill-name` 显式调用即可；也可以换一种更直白的表达（例如明确提到"配额"、"余额"、"状态栏"等关键词）。不同 Agent 的 Skills 识别策略会有差异，显式调用通常是最可靠的方式。
:::

---

## 常见问题

### 1. 安装失败 / 找不到 `npx` 命令

确认 Node.js 已安装：

```bash
node -v
```

如果没有版本号输出，前往 [nodejs.org](https://nodejs.org/) 安装即可。`npx` 随 Node.js 分发，无需单独安装。

### 2. Skill 没被自动触发

- 你的表达可能没有匹配到 Skill 描述中的关键词 —— 用 `/skill-name` 显式调用即可；
- 安装时没勾选当前 Agent —— 重新运行 `npx skills add ZenMux/skills` 并在交互界面里补上对应 Agent；
- 对应 Skill 还没装 —— 运行 `npx skills add ZenMux/skills` 一键安装。

### 3. `zenmux-usage` / `zenmux-statusline` 拉不到账户数据

先确认 Management Key 已生效：

```bash
echo $ZENMUX_MANAGEMENT_KEY
```

有输出说明已设置；若为空，前往 [Management 控制台](https://zenmux.ai/platform/management) 创建后写入 Shell 启动文件，再 `source` 一下。

### 4. `zenmux-feedback` 创建 Issue 失败

```bash
gh --version     # 确认已安装
gh auth status   # 确认已登录
```

如未登录，运行 `gh auth login` 按引导完成 GitHub 授权。

### 5. 装了 `zenmux-statusline` 但状态栏没变化

首先确认使用的是 **Claude Code**（该 Skill 仅适配 Claude Code 的 statusLine 机制）。另外，`npx skills add` 只是下载了 Skill，还需要在 Claude Code 里显式调用一次 `/zenmux-statusline`，它才会把脚本写入 Claude Code 配置、完成状态栏注册。

---

## 相关资源

- **Skills 仓库**：<https://github.com/ZenMux/skills>
- **Agent Skills 开放标准**：<https://agentskills.io>
- **Claude Code Skills 官方文档**：<https://docs.claude.com/en/docs/claude-code/skills>
- **ZenMux 快速开始**：[快速开始](/zh/guide/quickstart)
- **各 Agent 接入 ZenMux 指南**：查看[最佳实践](/zh/best-practices/claude-code)中的 Claude Code、Cursor、Cline、Codex、Gemini CLI、Copilot 等接入文档
- **ZenMux 管理控制台**：
  - [订阅管理](https://zenmux.ai/platform/subscription)
  - [按量付费管理](https://zenmux.ai/platform/pay-as-you-go)
  - [Management API Key](https://zenmux.ai/platform/management)

::: tip 联系我们
如果你在使用 ZenMux Skills 过程中有问题或建议，欢迎：

- 直接用 **`/zenmux-feedback`** 提交反馈（最快）
- 访问 [GitHub Issues](https://github.com/ZenMux/skills/issues)
- 邮件：[support@zenmux.ai](mailto:support@zenmux.ai)
- Discord 社区：<http://discord.gg/vHZZzj84Bm>
:::
