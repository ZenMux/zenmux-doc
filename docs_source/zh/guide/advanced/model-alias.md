---
head:
  - - meta
    - name: description
      content: ZenMux 模型别名——在 Claude Code、Codex 等 Coding Agent 中直接使用 Claude 原生模型名（如 claude-sonnet-4-6）
  - - meta
    - name: keywords
      content: Zenmux, 模型别名, model alias, Claude Code, Codex, Coding Agent, claude-sonnet-4-6, claude-opus-4-7, effort, 1M 上下文
---

# 模型别名

ZenMux 上线了**模型别名**功能。Claude Code、Codex 等 Coding Agent 接入 ZenMux 后，无需再单独设置模型名称——别名让每个 ZenMux 模型在下游工具侧以它本来期待的 ID 出现。

## 对你意味着什么

以 Claude Code 为例：

1. **无需手动改写模型 ID**：不用再专门写 `anthropic/claude-sonnet-4.6` 去迁就 Claude Code。
2. **effort 调节正常生效**：预算控制、思考强度（`effort`）等调节能力恢复正常。
3. **无需维护额外映射层**：下游工具里不用再维护一层模型名称映射表。

## 为什么之前不行

Claude Code 内部通过校验硬编码的模型名称来启用特定功能。以 effort 调节为例：触发条件是检测到模型名为 `claude-sonnet-4-6`，而 ZenMux 之前的模型标识是 `anthropic/claude-sonnet-4.6`，两者不匹配，功能会静默失效。

**1M 上下文窗口** 也一样——如果名字不是 Claude Code 期待的那一串，扩展窗口永远不会激活，直接退回到默认的 200K tokens。

## 别名如何解决这个问题

别名让 `claude-sonnet-4-6` 与 `anthropic/claude-sonnet-4.6` **完全等效**。Claude Code 的校验器看到它想要的字符串，校验通过，`effort`、1M 上下文、所有原本依赖模型名的特性都按设计工作。

Claude 官方系列常用别名对照：

| 别名                | 完整 ZenMux 模型 ID              |
| ------------------- | -------------------------------- |
| `claude-opus-4-7`   | `anthropic/claude-opus-4.7`      |
| `claude-sonnet-4-6` | `anthropic/claude-sonnet-4.6`    |
| `claude-haiku-4-5`  | `anthropic/claude-haiku-4.5`     |

::: tip 💡 使用原则

- **在官方 Coding 工具里使用原生模型**（如在 Claude Code 里跑 Claude 系列）：**不用单独指定模型名**——Claude Code 的内置默认已经对齐 ZenMux 的别名。
- **在官方 Coding 工具里使用其他模型**（如在 Claude Code 里试用 `gpt-5.3-codex`）：仍需手动配置完整的 ZenMux 模型 ID，因为工具内部没有预设别名可匹配。

:::

## 如何查看某个模型的别名

每个模型在 ZenMux 的详情页上都会列出它当前支持的别名。打开模型详情页，查看 **Aliases** 区块即可：

<div style="text-align: center;">
  <img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/04/21/TXTlCD4/alias.png"
       alt="ZenMux 模型详情页展示的别名"
       style="width: 100%; max-width: 800px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;"
       loading="lazy" />
</div>

别名由 ZenMux 官方统一维护。如有其他别名需求，欢迎通过 [联系我们](/zh/help/contact) 页面提建议。

## 示例：Claude Code

```bash
# ✅ 使用别名以启用 Claude Code 的 1M 上下文、effort 调节等原生特性
export ANTHROPIC_DEFAULT_HAIKU_MODEL="claude-haiku-4-5"
export ANTHROPIC_DEFAULT_SONNET_MODEL="claude-sonnet-4-6"
export ANTHROPIC_DEFAULT_OPUS_MODEL="claude-opus-4-7"
```

修改后重新加载 shell（`source ~/.zshrc` 或 `source ~/.bashrc`），然后重启 Claude Code。

Claude Code 的完整接入流程请见 [Claude Code 集成指南](/zh/best-practices/claude-code)。

::: info 相关阅读

- [Claude Code 集成](/zh/best-practices/claude-code)
- [1M 超长上下文窗口](/zh/guide/advanced/long-context)
- [推理模型](/zh/guide/advanced/reasoning)

:::
