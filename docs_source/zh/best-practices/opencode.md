# 通过 ZenMux 使用 opencode 指南

OpenCode is an AI coding agent built for the terminal.

## 方式

```bash
# YOLO
curl -fsSL https://opencode.ai/install | bash

# Package managers
npm i -g opencode-ai@latest        # or bun/pnpm/yarn
scoop bucket add extras; scoop install extras/opencode  # Windows
choco install opencode             # Windows
brew install sst/tap/opencode      # macOS and Linux
paru -S opencode-bin               # Arch Linux```
```
更多安装方式见 [opencode](https://opencode.ai/docs/#install)

## 登录

通过命令方式来补充配置信息

step1: 登录并选择 ZenMux 供应商
![login](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/30/PdPJcCv/opencode-login.jpg)

step2: 输入ZenMux的API Key
![key](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/30/nhMPtje/opencode-key.jpg)

Step3: 打开 opencode 并选择 models
```bash
opencode 

/models
```
![model](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/30/p7oX3KY/opencode-models.png)

## 支持的模型
持续更新中...
| 序号 | 模型                        |
| ---- | -------------------------------- |
| 1    | Ling-1T   |
| 2    | Ring-1T   |
| 3    | Claude Haiku 4.5    |
| 4    | Claude Opus 4.1     |
| 5    | Claude Sonnet 4.5     |
| 6    | DeepSeek-V3.2-Exp (Non-thinking Mode)     |
| 7    | Gemini 2.5 Pro                   |
| 8    | KAT-Coder-Pro-V1               |
| 9    | Kimi K2 0905          |
| 10   | GPT-5 Codex          |
| 11   | GPT-5 |
| 12   | Qwen3 Coder Plus         |
| 13   | Grok 4 Fast None Reasoning          |
| 14   | Grok 4 Fast        |
| 15   | Grok 4            |
| 16   | Grok Code Fast 1            |
| 17   | GLM 4.5 Air            |
| 18   | GLM 4.6            |

## 效果
![result](https://cdn.marmot-cloud.com/storage/zenmux/2025/10/30/6oFggTa/opencode-result.jpg)