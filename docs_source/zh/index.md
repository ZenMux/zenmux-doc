---
title: ZenMux - AI 模型聚合平台
subtitle: 数百种 AI 模型的统一 API
slug: home
headline: ZenMux - 企业级 AI 模型聚合平台
canonical-url: "https://zenmux.ai/"
"og:site_name": ZenMux
"og:title": ZenMux - AI 模型聚合平台
"og:description": >-
  ZenMux 提供数百种 AI 模型的统一 API 访问,具备智能路由、
  自动故障转移和 AI 输出质量保险。
"og:image":
  type: url
  value: >-
    https://zenmux.ai/dynamic-og?title=ZenMux&description=Enterprise%20AI%20Model%20Aggregation%20Platform
"og:image:width": 1200
"og:image:height": 630
"twitter:card": summary_large_image
"twitter:site": "@ZenMuxAI"
noindex: false
nofollow: false
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  // 重定向到简介页面
  router.go('/zh/about/intro')
})
</script>

::: info 欢迎来到 ZenMux 文档
关于 ZenMux 的详细信息，请访问我们的[简介页面](/zh/about/intro)，其中包含详细的产品概述、功能特性和 Beta 申请信息。
:::

## 快速导航

### 关于 ZenMux

- [简介](/zh/about/intro) - 全面的产品概述和 Beta 申请
- [模型&供应商](/zh/about/models-and-providers) - 支持的模型和供应商
- [价格&费用](/zh/about/pricing-and-cost) - 价格信息和费用

### 使用文档

- [快速开始](/zh/guide/quickstart) - 几分钟内开始使用 ZenMux

### 高级调用

- [供应商路由](/zh/guide/advanced/provider-routing) - 供应商路由机制
- [模型路由](/zh/guide/advanced/model-routing) - 模型智能路由机制
- [兜底模型](/zh/guide/advanced/fallback) - 兜底模型机制
- [流式](/zh/guide/advanced/streaming) - 实时流式响应
- [多模态](/zh/guide/advanced/multimodal) - 文本、图像和音频处理
- [结构化输出](/zh/guide/advanced/structured-output) - JSON 和结构化响应
- [工具调用](/zh/guide/advanced/tool-calls) - 函数调用能力
- [提示词缓存](/zh/guide/advanced/prompt-cache) - 提示词缓存功能
- [推理模型](/zh/guide/advanced/reasoning) - 推理模型使用
  
### 最佳实践

- [ClaudeCode接入ZenMux指南](/zh/best-practices/claude-code) - 如何将Claude接入ZenMux自定义模型使用

### API 参考

- [Chat Completion](/zh/api/openai/chat-completion) - OpenAI 兼容聊天 API
- [Get a generation](/zh/api/platform/get-generation) - ZenMux 平台特定 API
- [Message](/zh/api/anthropic/create-messages) - Anthropic API

---

::: tip 准备开始了吗？
通过阅读我们的[简介](/zh/about/intro)开始您的 ZenMux 之旅，然后按照[快速开始](/zh/guide/quickstart)进行您的第一次 API 调用。
:::
