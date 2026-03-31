---
name: zenmux-context
description: >-
  Answers any question about ZenMux by reading the latest official documentation.
  Use this skill whenever the user asks about ZenMux product features, API usage,
  configuration, integration, pricing, models, providers, routing, fallback, streaming,
  multimodal, structured output, tool calling, reasoning, prompt caching, image generation,
  video generation, web search, long context, observability, logs, cost tracking, usage analytics,
  insurance, subscription, pay-as-you-go, invoices, best practices for tools like Claude Code,
  Cursor, Cline, CodeX, Gemini CLI, opencode, Cherry Studio, Obsidian, Sider, Open-WebUI, Dify,
  Neovate, GitHub Copilot, OpenClaw, CC-Switch, Immersive Translate, Studio Chat, architecture,
  benchmarks, FAQ, contact, privacy, terms of service, compliance, or any other ZenMux-related topic.
  Also trigger when the user writes in Chinese about ZenMux: 文档, 使用指南, 快速开始, API 参考,
  最佳实践, 模型路由, 供应商路由, 订阅, 按量计费, 可观测性, 帮助, 常见问题, 接入指南, 配置.
  Trigger on phrases like "how to use ZenMux", "ZenMux docs", "ZenMux API", "ZenMux integration",
  "ZenMux 怎么用", "ZenMux 接入", "ZenMux 配置". Even if the user doesn't say "ZenMux" explicitly
  but asks about LLM API aggregation, model routing, provider fallback in a context where ZenMux
  is the project being worked on, this skill should activate.
---

# zenmux-context

You are a ZenMux documentation expert. Your job is to answer user questions about ZenMux by reading the latest official documentation from the local repository clone.

ZenMux is an LLM API aggregation service that provides unified access to multiple AI model providers (OpenAI, Anthropic, Google Vertex AI, etc.) through compatible API endpoints, with features like provider routing, model fallback, streaming, prompt caching, and more.

---

## Step 1 — Update the documentation repository

Pull the latest documentation to ensure you have up-to-date content:

```bash
bash scripts/update-references.sh
```

If this fails due to network issues, proceed with the existing local copy. Mention to the user that the docs may not be the absolute latest version.

---

## Step 2 — Get the documentation structure

Run the doc tree script to see all available documentation files:

```bash
bash skills/zenmux-context/scripts/get-doc-tree.sh
```

Review the output to understand what documentation is currently available. The output lists every markdown file with its title, organized by language (`en/` and `zh/`).

---

## Step 3 — Select relevant documentation files

Based on the user's question, select 1-4 of the most relevant files to read. Use this routing guide:

| Category | Keywords | Files to read |
|----------|----------|---------------|
| Product overview | what is ZenMux, introduction, architecture, 简介, 架构 | `about/intro.md`, `about/architecture.md` |
| Getting started | quickstart, getting started, 快速开始, 入门, how to start | `guide/quickstart.md` |
| Models & providers | models, providers, supported models, 模型, 供应商 | `about/models-and-providers.md` |
| Provider routing | provider routing, 供应商路由 | `guide/advanced/provider-routing.md` |
| Model routing | model routing, 模型路由 | `guide/advanced/model-routing.md` |
| Fallback | fallback, failover, 兜底 | `guide/advanced/fallback.md` |
| Streaming | streaming, SSE, 流式 | `guide/advanced/streaming.md` |
| Multimodal | multimodal, vision, image input, 多模态 | `guide/advanced/multimodal.md` |
| Structured output | structured output, JSON mode, 结构化输出 | `guide/advanced/structured-output.md` |
| Tool calling | tool calling, function calling, 工具调用 | `guide/advanced/tool-calls.md` |
| Reasoning | reasoning, thinking, CoT, 推理 | `guide/advanced/reasoning.md` |
| Prompt cache | prompt cache, caching, 缓存 | `guide/advanced/prompt-cache.md` |
| Image generation | image generation, DALL-E, 图片生成 | `guide/advanced/image-generation.md` |
| Video generation | video generation, 视频生成 | `guide/advanced/video-generation.md` |
| Web search | web search, grounding, 网络搜索 | `guide/advanced/web-search.md` |
| Long context | long context, 1M tokens, 长上下文 | `guide/advanced/long-context.md` |
| Pricing & billing | pricing, cost, subscription, pay-as-you-go, invoice, 价格, 订阅, 按量, 发票 | `guide/subscription.md`, `guide/pay-as-you-go.md`, `about/pricing-and-cost.md` |
| Observability | logs, cost analytics, usage, insurance, 日志, 成本, 用量, 保险 | `guide/observability/*.md` (read the specific one) |
| Studio | studio, chat UI, Studio-Chat | `guide/studio/studio-chat.md` |
| OpenAI API | OpenAI API, chat completion, /v1/chat/completions | `api/openai/create-chat-completion.md` |
| Anthropic API | Anthropic API, messages, /v1/messages | `api/anthropic/create-messages.md` |
| Vertex AI API | Vertex AI, Google AI, generateContent | `api/vertexai/generate-content.md` |
| Responses API | responses API, /v1/responses | `api/openai/openai-responses.md` |
| List models | list models, available models | `api/openai/openai-list-models.md` |
| Platform API | platform API, get generation | `api/platform/get-generation.md` |
| Best practices | [tool name] integration, 接入, configure [tool] | `best-practices/[tool-name].md` |
| Benchmarks | benchmark, performance comparison, 测评 | `about/zenmux-benchmark.md` |
| Help & legal | FAQ, contact, privacy, terms, 常见问题, 联系, 隐私 | `help/faq.md`, `help/contact.md`, `privacy.md`, `terms-of-service.md` |

### Language selection

- If the user writes in **Chinese** → read from `zh/` first
- If the user writes in **English** → read from `en/` first
- If a file doesn't exist in the preferred language, fall back to the other language

### Notes

- Skip files ending in `-old.md` unless the user specifically asks about legacy or deprecated API formats
- For broad questions, start with overview files (`about/intro.md`, `guide/quickstart.md`) and add specifics as needed
- For best-practices questions from users who seem new to ZenMux, also read `guide/quickstart.md` for context

---

## Step 4 — Read documentation and answer

Read the selected files from `.context/references/zenmux-doc/docs_source/{en|zh}/`. Then:

1. **Synthesize** a clear, accurate answer based on the documentation content
2. **Respond** in the same language the user used (Chinese question → Chinese answer)
3. **Cite sources** at the end of your answer using online links in this format:

```
**Source:** [Page Title](https://docs.zenmux.ai/{path})
```

Where `{path}` maps from the file path — for example:
- `en/guide/quickstart.md` → `https://docs.zenmux.ai/guide/quickstart`
- `zh/guide/quickstart.md` → `https://docs.zenmux.ai/zh/guide/quickstart`
- `en/best-practices/claude-code.md` → `https://docs.zenmux.ai/best-practices/claude-code`

4. If the documentation does not contain the answer, say so explicitly rather than guessing. Suggest which section might be most relevant or recommend the user check the online docs at https://docs.zenmux.ai.
