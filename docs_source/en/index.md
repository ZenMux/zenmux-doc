---
title: ZenMux - AI Model Aggregation Platform
subtitle: A Unified API for Hundreds of AI Models
slug: home
headline: ZenMux - Enterprise-Grade AI Model Aggregation Platform
canonical-url: "https://zenmux.ai/"
"og:site_name": ZenMux
"og:title": ZenMux - AI Model Aggregation Platform
"og:description": >-
  ZenMux provides unified API access to hundreds of AI models, with intelligent routing,
  automatic failover, and AI output quality assurance.
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
head:
  - - meta
    - name: description
      content: const router = useRouter()...
  - - meta
    - name: keywords
      content: Zenmux, index, OpenAI, Anthropic, Claude, API
  - - script
    - {}
    - |
      (function() {
        var h = location.hostname;
        var isDocsHost = h.startsWith('docs.') || h === 'localhost' || h === '127.0.0.1';
        var path = isDocsHost ? '/about/intro' : '/docs/about/intro';
        location.replace(path);
      })();
---

::: info Welcome to the ZenMux Documentation
For more information about ZenMux, please visit our [Introduction page](/about/intro), which includes a detailed product overview, key features, and Beta application information.
:::

## Quick Navigation

### About ZenMux

- [Introduction](/about/intro) - Comprehensive product overview and Beta application
- [Models & Providers](/about/models-and-providers) - Supported models and providers
- [Pricing & Costs](/about/pricing-and-cost) - Pricing information and costs

### Documentation

- [Quickstart](/guide/quickstart) - Get started with ZenMux in minutes

### Advanced Usage

- [Provider Routing](/guide/advanced/provider-routing) - Provider routing mechanism
- [Model Routing](/guide/advanced/model-routing) - Intelligent model routing mechanism
- [Fallback Models](/guide/advanced/fallback) - Fallback model mechanism
- [Streaming](/guide/advanced/streaming) - Real-time streaming responses
- [Multimodal](/guide/advanced/multimodal) - Text, image, and audio processing
- [Structured Output](/guide/advanced/structured-output) - JSON and structured responses
- [Tool Calls](/guide/advanced/tool-calls) - Function calling capabilities
- [Prompt Caching](/guide/advanced/prompt-cache) - Prompt caching feature
- [Reasoning Models](/guide/advanced/reasoning) - Using reasoning models
  
### Best Practices

- [ClaudeCode Integration Guide for ZenMux](/best-practices/claude-code) - How to integrate Claude with ZenMux as a custom model

### API Reference

- [Chat Completion](/api/openai/chat-completion) - OpenAI-compatible Chat API
- [Get a generation](/api/platform/get-generation) - ZenMux platform-specific API
- [Message](/api/anthropic/create-messages) - Anthropic API
- [VertexAI](/api/vertexai/generate-content) - Google Vertex AI API

---

::: tip Ready to get started?
Start your ZenMux journey by reading our [Introduction](/about/intro), then follow the [Quickstart](/guide/quickstart) to make your first API call.
:::