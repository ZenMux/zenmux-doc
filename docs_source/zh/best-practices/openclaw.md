---
head:
  - - meta
    - name: description
      content: 通过已发布的 ClawHub 插件在 OpenClaw 中接入 ZenMux —— 一条命令解锁 135+ 模型,支持动态发现
  - - meta
    - name: keywords
      content: Zenmux, OpenClaw, ClawHub, 插件, 集成, AI 网关, GPT-5.4, Claude Opus 4.7, Grok 4.3, Gemini 3.1, 模型聚合
---

# OpenClaw 接入 ZenMux 使用指南

[OpenClaw](https://github.com/openclaw/openclaw) 是一款运行在你自己机器上的个人 AI 助手,支持你日常使用的多种渠道(终端 TUI、网页 Dashboard、WhatsApp、Telegram、Discord、Slack、Signal、iMessage 等)。借助发布在 ClawHub 上的 [`@zenmux/openclaw-zenmux-provider`](https://clawhub.ai/plugins/@zenmux/openclaw-zenmux-provider) 插件,**一条安装命令**即可让 OpenClaw 访问 **135+ 个 ZenMux 模型** —— GPT、Claude、Gemini、Grok、DeepSeek、Qwen 等,支持按需动态解析,并在每台主机上保留一次性的目录缓存。

::: info 兼容性说明
该插件要求 **OpenClaw `>= 2026.4.14`**。如果你使用的是更早版本,请先运行 `npm i -g openclaw@latest` 升级再安装。

插件采用 OpenClaw 官方推荐的 Provider 模式:小型静态目录 + `resolveDynamicModel` + `prepareDynamicModel` Hook。你无需手动列举模型,任意 `zenmux/<id>` 都可按需使用。

ZenMux 的 API 兼容 OpenAI 协议,base URL 为 `https://zenmux.ai/api/v1`。
:::

## 前置条件

- Node.js 22 或更高版本
- OpenClaw `>= 2026.4.14`(`openclaw --version` 确认)
- 一个 ZenMux API Key —— 见下方[第 0 步](#第-0-步获取-zenmux-api-key)

## 第 0 步:获取 ZenMux API Key

ZenMux 提供两种计费方式,均与该插件兼容。

::: code-group

```text [订阅 API Key(推荐)]
适用场景:个人开发、学习探索
特点:固定月费、成本可预测、5-10 倍价格杠杆
API Key 格式:sk-ss-v1-xxx

获取方式:
1. 访问订阅管理页面:https://zenmux.ai/platform/subscription
2. 选择套餐(Pro $20/月、Max $100/月、Ultra $200/月)
3. 订阅后在页面创建订阅 API Key

详细说明请参阅:订阅套餐指南
https://docs.zenmux.ai/zh/guide/subscription
```

```text [按量付费 API Key]
适用场景:生产环境、商业产品、企业应用
特点:无速率限制、生产级稳定性、按实际用量计费
API Key 格式:sk-ai-v1-xxx

获取方式:
1. 访问按量付费页面:https://zenmux.ai/platform/pay-as-you-go
2. 充值账户
3. 在"按量付费 API Keys"区域创建 API Key

详细说明请参阅:按量付费指南
https://docs.zenmux.ai/zh/guide/pay-as-you-go
```

:::

## 快速开始(3 条命令)

如果你已经装好 OpenClaw 并设置好 API Key,这就是全部步骤:

```bash
export ZENMUX_API_KEY=sk-ss-v1-...

openclaw plugins install clawhub:@zenmux/openclaw-zenmux-provider
openclaw onboard --zenmux-api-key "$ZENMUX_API_KEY" --auth-choice zenmux-api-key \
  --flow manual --accept-risk --non-interactive
openclaw gateway install && openclaw gateway start
```

接着运行 `openclaw chat` 即可开始对话。默认模型是 `zenmux/openai/gpt-5.4`;在对话中使用 `/model zenmux/<id>` 切换到任意其他 ZenMux 模型。

下方的详细步骤会逐项说明并给出验证方法。

## 方式一:通过 ClawHub 插件安装(推荐)

### 第 1 步:确认或升级 OpenClaw

```bash
openclaw --version            # 期望:OpenClaw 2026.4.14 或更新
```

如果版本过旧,请升级:

```bash
npm i -g openclaw@latest
openclaw --version            # 确认 >= 2026.4.14
```

如果 `npm i -g` 报权限错误,你正在使用系统 Node —— 切换到 Node 版本管理器(nvm/volta/fnm)或在命令前加 `sudo`。

### 第 2 步:设置 ZenMux API Key

```bash
export ZENMUX_API_KEY=sk-ss-v1-...
```

### 第 3 步:从 ClawHub 安装插件

```bash
openclaw plugins install clawhub:@zenmux/openclaw-zenmux-provider
```

输出类似:

```text
ClawHub code-plugin @zenmux/openclaw-zenmux-provider@0.2.1 channel=community verification=source-linked
ClawHub package "@zenmux/openclaw-zenmux-provider" is community; review source and verification before enabling.
Downloading plugin @zenmux/openclaw-zenmux-provider@0.2.1 from ClawHub…
Installing to ~/.openclaw/extensions/zenmux…
Installed plugin: zenmux
Restart the gateway to load plugins.
```

"community plugin"提示是所有非内置插件的标准告示,属于正常现象。

### 第 4 步:执行 onboard 写入配置(必须在启动网关**之前**完成)

这一步会写入网关运行模式、Provider 配置和认证 Profile。OpenClaw 网关守护进程在配置中没有 `gateway.mode` 时拒绝启动,所以必须先 onboard 再启动网关。

```bash
openclaw onboard \
  --zenmux-api-key "$ZENMUX_API_KEY" \
  --auth-choice zenmux-api-key \
  --flow manual \
  --accept-risk \
  --non-interactive
```

预期输出:

```text
Updated ~/.openclaw/openclaw.json
Workspace OK: ~/.openclaw/workspace
Sessions OK: ~/.openclaw/agents/main/sessions
Gateway did not become reachable at ws://127.0.0.1:18789.
```

`Gateway did not become reachable` 那行是提示性的 —— onboard 在写完配置后做了一次网关健康检查;网关将在下一步安装。

### 第 5 步:安装并启动网关服务

```bash
openclaw gateway install
openclaw gateway start
sleep 5
openclaw gateway status | grep -E "Runtime:|Listening|Connectivity probe|Capability"
```

预期:

```text
Runtime: running (pid …)
Listening: 127.0.0.1:18789
Connectivity probe: ok
Capability: admin-capable
```

### 第 6 步:验证配置

```bash
node -e "
const c = require(require('os').homedir() + '/.openclaw/openclaw.json');
const p = require(require('os').homedir() + '/.openclaw/extensions/zenmux/package.json');
console.log('plugin name    :', p.name);
console.log('plugin version :', p.version);
console.log('primary model  :', c.agents?.defaults?.model?.primary);
console.log('allowlist      :', JSON.stringify(c.agents?.defaults?.models));
console.log('zenmux api     :', c.models?.providers?.zenmux?.api);
console.log('zenmux baseUrl :', c.models?.providers?.zenmux?.baseUrl);
console.log('plugin enabled :', c.plugins?.entries?.zenmux?.enabled);
console.log('gateway.mode   :', c.gateway?.mode);
console.log('auth profile   :', c.auth?.profiles?.['zenmux:default']?.mode);
"
```

预期输出:

```text
plugin name    : @zenmux/openclaw-zenmux-provider
plugin version : 0.2.1
primary model  : zenmux/openai/gpt-5.4
allowlist      : {}
zenmux api     : openai-completions
zenmux baseUrl : https://zenmux.ai/api/v1
plugin enabled : true
gateway.mode   : local
auth profile   : api_key
```

`allowlist: {}` 为空是关键信号 —— 任意 `zenmux/<id>` 都可以选用,不需要手动 pin。

### 第 7 步:跨厂商烟雾测试

```bash
# 默认模型 —— 不需要拉取目录,响应快
openclaw infer model run --gateway --model zenmux/openai/gpt-5.4 \
  --prompt "Reply with: DEFAULT_OK"

# 通过 ZenMux 调 Anthropic —— 第一次会触发一次 ~1-2 秒的目录拉取
openclaw infer model run --gateway --model zenmux/anthropic/claude-opus-4.7 \
  --prompt "Reply with: FREE_PICK"

# 通过 ZenMux 调 xAI —— 缓存已就绪,瞬时返回
openclaw infer model run --gateway --model zenmux/x-ai/grok-4.3 \
  --prompt "Reply with: GROK_OK"
```

每一条都应输出 `provider: zenmux`、模型 id 和短回复。不应出现 `model not allowed` 错误。

### 第 8 步:开始对话

```bash
openclaw chat                 # 终端 TUI
# 或者
openclaw dashboard            # 浏览器 Web Dashboard
```

至此安装完成。日常使用方式见下文。

## 在对话中使用 ZenMux 模型

### 即时切换模型

终端 TUI(`openclaw chat`)和 Web Dashboard 的对话输入框都支持斜杠指令:

```text
/model zenmux/anthropic/claude-opus-4.7    切换到 Claude Opus 4.7
/model zenmux/x-ai/grok-4.3                切换到 Grok 4.3
/model zenmux/deepseek/deepseek-v4-pro     切换到 DeepSeek v4 Pro
/model zenmux/qwen/qwen3.6-max-preview     切换到 Qwen 3.6 Max
/model status                              查看当前模型 + 接入点
```

任意 135+ 个 ZenMux 模型都可以直接使用,无需事先 pin。第一次调用未缓存的模型会触发一次 ~1-2 秒的目录预热;后续访问会直接读取磁盘缓存 `~/.openclaw/cache/zenmux-models.json`,瞬时返回。

### 列出所有可用模型

```bash
# 从 ZenMux 实时目录拉取
curl -s https://zenmux.ai/api/v1/models | python3 -c "
import sys, json
for m in json.load(sys.stdin)['data']: print(m['id'])
"

# 或者直接浏览官方模型列表页
open https://zenmux.ai/models
```

### 一次性 CLI 调用

```bash
openclaw infer model run --gateway --model zenmux/anthropic/claude-opus-4.7 \
  --prompt "用三点总结 README"
```

### 在 Dashboard 下拉框中固定常用模型(可选)

Dashboard 顶部的模型下拉框只展示你已保存的别名。要让常用模型出现在下拉框中:

```bash
openclaw models aliases add Opus  zenmux/anthropic/claude-opus-4.7
openclaw models aliases add GPT55 zenmux/openai/gpt-5.5-pro
openclaw models aliases add Grok  zenmux/x-ai/grok-4.3
openclaw gateway restart
```

::: warning 注意权衡
一旦 `agents.defaults.models`(底层别名映射)非空,OpenClaw 就把它当作 Agent 的**白名单** —— 只有被 pin 的模型才能选择。未 pin 的模型会提示 `model not allowed`。要恢复自由切换,要么把所有模型一次性 pin,要么把整个 map 清空(参见[故障排查](#故障排查))。
:::

## 方式二:手动配置(备用)

::: warning 何时使用
仅在你**无法访问 ClawHub**(离线 / 防火墙 / 内网受限环境)时才使用方式二。它比方式一冗长得多,而且**没有动态模型发现** —— 你只能使用配置文件里显式列出的模型。
:::

### 第 1 步:安装 OpenClaw

```bash
npm install -g openclaw@latest
openclaw setup --mode local --non-interactive   # 写入基线配置
```

### 第 2 步:编辑 `~/.openclaw/openclaw.json`

把 ZenMux Provider 加到配置文件中,模型自行罗列:

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "zenmux": {
        "baseUrl": "https://zenmux.ai/api/v1",
        "apiKey": "sk-ss-v1-your-api-key-here",
        "api": "openai-completions",
        "models": [
          {
            "id": "openai/gpt-5.4",
            "name": "GPT-5.4 via ZenMux",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 200000,
            "maxTokens": 8192
          },
          {
            "id": "anthropic/claude-opus-4.7",
            "name": "Claude Opus 4.7 via ZenMux",
            "reasoning": true,
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 200000,
            "maxTokens": 8192
          },
          {
            "id": "google/gemini-3.1-pro-preview",
            "name": "Gemini 3.1 Pro via ZenMux",
            "reasoning": false,
            "input": ["text", "image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 1048576,
            "maxTokens": 8192
          },
          {
            "id": "deepseek/deepseek-v4-pro",
            "name": "DeepSeek v4 Pro via ZenMux",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 128000,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "zenmux/openai/gpt-5.4"
      }
    }
  }
}
```

::: warning
请把 `sk-ss-v1-your-api-key-here` 替换为你自己的真实 ZenMux API Key。
:::

### 第 3 步:启动网关

```bash
openclaw gateway install
openclaw gateway restart
```

### 第 4 步:验证

```bash
openclaw infer model providers --json | python3 -c "
import sys, json
ps = json.load(sys.stdin)
print(next((p for p in ps if p.get('provider')=='zenmux'), None))
"

openclaw infer model run --gateway --model zenmux/openai/gpt-5.4 \
  --prompt "Reply: OK"
```

### 增加更多模型

往 `models` 数组追加更多条目即可。字段说明:

| 字段 | 说明 |
|---|---|
| `id` | [zenmux.ai/models](https://zenmux.ai/models) 上展示的模型 id(例如 `openai/gpt-5.4`) |
| `name` | 显示名称 |
| `reasoning` | 模型是否支持推理模式 |
| `input` | `["text"]` 或 `["text", "image"]` |
| `cost` | 订阅套餐填全 0 即可 |
| `contextWindow` | 最大上下文窗口(token 数) |
| `maxTokens` | 最大输出 token 数 |

修改后重启网关。

::: tip 为什么推荐方式一
方式一的插件使用 OpenClaw 的 `resolveDynamicModel` + `prepareDynamicModel` Hook,会自动针对 `zenmux/<id>` 在线请求 `/api/v1/models` 接口并缓存元数据。方式二需要你手动罗列每一个想用的模型,且每当 ZenMux 上线新模型都得改配置。
:::

## 故障排查

::: details 网关启动被拒:`existing config is missing gateway.mode`
**原因**:`openclaw gateway start` 在 `openclaw onboard` 之前执行了。守护进程在配置里找不到 `gateway.mode` 时拒绝启动。

**解决**:先 onboard 再启动网关:

```bash
openclaw onboard --zenmux-api-key "$ZENMUX_API_KEY" --auth-choice zenmux-api-key \
  --flow manual --accept-risk --non-interactive
openclaw gateway start
```
:::

::: details `Model override "zenmux/..." is not allowed for agent "main"`
**原因**:Agent 的白名单(`agents.defaults.models`)非空 —— 通常是因为你的插件版本 `< 0.1.3`,或者你之前 pin 过别名导致 OpenClaw 把它当成白名单。

**修复 A —— 升级插件**(最常见):

```bash
openclaw plugins update zenmux       # 拉取 0.2.0+
openclaw plugins inspect zenmux | grep Version
```

**修复 B —— 清空白名单**(当你已经在最新版本但仍残留旧条目时):

```bash
node -e "
const fs=require('fs');
const path=require('os').homedir()+'/.openclaw/openclaw.json';
const c=JSON.parse(fs.readFileSync(path,'utf8'));
if (c.agents?.defaults) c.agents.defaults.models = {};
fs.writeFileSync(path, JSON.stringify(c, null, 2));
"
openclaw gateway restart
```

清空之后,**新开一个对话会话** —— 已存在的会话会缓存创建时的白名单状态。
:::

::: details `openclaw infer model providers` 显示 `count: 1`(zenmux)
**这是设计如此。** 插件采用 OpenClaw 官方推荐的 Provider 模式:小型静态目录(只放 1 个默认模型)+ `resolveDynamicModel` 处理其他模型。`count` 只反映静态目录的大小。其他 134+ 个 ZenMux 模型仍可通过 `/model zenmux/<id>` 或 `--model zenmux/<id>` 自由选用 —— 它们在被解析过至少一次之前不计入 count。

这与 OpenClaw 自带的 OpenRouter Provider 行为一致(它支持 274+ 模型,但 `count` 只显示 2)。
:::

::: details 第一次对话比预期慢 2-3 秒
**原因**:对 `https://zenmux.ai/api/v1/models` 的一次性 `prepareDynamicModel` 缓存预热。

**修复**:无需任何操作 —— 后续调用会读取磁盘缓存 `~/.openclaw/cache/zenmux-models.json`,瞬时完成。该缓存在网关重启后依然保留。
:::

::: details API Key 错误或认证失败
**解决方案**:

1. **检查 API Key 格式**:
   - 订阅 Key 以 `sk-ss-v1-` 开头
   - 按量付费 Key 以 `sk-ai-v1-` 开头
   - 不要有前后空白

2. **校验 Key**:
   - 订阅:访问[订阅管理页面](https://zenmux.ai/platform/subscription)检查订阅状态和配额
   - 按量付费:访问[按量付费页面](https://zenmux.ai/platform/pay-as-you-go)确认余额充足

3. **重新 onboard**:`openclaw onboard --zenmux-api-key "$ZENMUX_API_KEY" --auth-choice zenmux-api-key --flow manual --accept-risk --non-interactive`
:::

::: details 连接失败 / 超时
**解决方案**:

- 验证网络连通性:`curl https://zenmux.ai/api/v1/models | head`
- 确认 `baseUrl` 是 `https://zenmux.ai/api/v1`
- 检查防火墙 / 公司代理是否阻止了到 `zenmux.ai` 的出站 HTTPS
:::

::: details 插件未加载(`Status: missing` 或版本错误)
**诊断**:

```bash
openclaw plugins inspect zenmux
# Status 应该是 "loaded"
# Source 应该是 "clawhub"
# Recorded version 应该是 0.2.1(或更新)
```

**修复**:重新安装插件:

```bash
openclaw plugins uninstall zenmux
openclaw plugins install clawhub:@zenmux/openclaw-zenmux-provider
openclaw gateway restart
```
:::

## 支持的模型

ZenMux 提供 135+ 个模型。以下是常用选项:

| 模型 | 模型 ID(用作 `zenmux/<id>`) | 适用场景 |
|---|---|---|
| GPT-5.4(默认) | `openai/gpt-5.4` | 通用、性价比均衡 |
| GPT-5.5 / GPT-5.5 Pro | `openai/gpt-5.5`、`openai/gpt-5.5-pro` | 旗舰推理 |
| Claude Opus 4.7 | `anthropic/claude-opus-4.7` | 顶级推理、复杂任务 |
| Claude Sonnet 4.6 | `anthropic/claude-sonnet-4.6` | 性能/成本均衡 |
| Claude Haiku 4.5 | `anthropic/claude-haiku-4.5` | Claude 最快档 |
| Gemini 3.1 Pro | `google/gemini-3.1-pro-preview` | 多模态、超长上下文 |
| Grok 4.3 | `x-ai/grok-4.3` | 多模态、时事问答 |
| DeepSeek v4 Pro | `deepseek/deepseek-v4-pro` | 高性价比编程 |
| Qwen 3.6 Max | `qwen/qwen3.6-max-preview` | 编程、长上下文 |

完整实时列表请访问 [zenmux.ai/models](https://zenmux.ai/models)。ZenMux 上线的新模型可立即使用 —— `/model zenmux/<新-id>` 无需更新插件即可生效。

## 联系我们

如果您在使用过程中遇到任何问题,或有建议和反馈,请通过以下渠道联系我们:

::: tip 获取帮助

- **官方网站**:<https://zenmux.ai>
- **技术支持邮箱**:[support@zenmux.ai](mailto:support@zenmux.ai)
- **商务合作邮箱**:[bd@zenmux.ai](mailto:bd@zenmux.ai)
- **Twitter**:[@ZenMuxAI](https://twitter.com/ZenMuxAI)
- **Discord 社区**:<http://discord.gg/vHZZzj84Bm>

更多联系方式和详情,请访问我们的[联系我们页面](/zh/help/contact)。
:::
