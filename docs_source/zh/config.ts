import { defineLoacaleConfig } from "..";

export default defineLoacaleConfig({
  label: "简体中文",
  lang: "zh-CN",
  link: "/zh/",
  description: "ZenMux 的文档",
  themeConfig: {
    outline: {
      label: "目录",
      level: [2, 3]
    },
    nav: [
      { text: "Models", link: "https://zenmux.ai/models", noIcon: true },
      { text: "Chat", link: "https://zenmux.ai/chat", noIcon: true },
      { text: "Benchmarks", link: "https://zenmux.ai/benchmark", noIcon: true },
      { text: "Blog", link: "https://zenmux.ai/blog", noIcon: true },
      { text: "Docs", link: "/", noIcon: true },
      { text: "About Us", link: "https://zenmux.ai/aboutus", noIcon: true },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ZenMux/zenmux-doc' }
    ],
    sidebar: [
      {
        text: "关于 ZenMux",
        items: [
          { text: "简介", link: "/zh/about/intro" }
        ]
      },
      {
        text: "使用文档",
        items: [
          { text: "快速开始", link: "/zh/guide/quickstart" },
          {
            text: "高级调用",
            items: [
              { text: "供应商路由", link: "/zh/guide/advanced/provider-routing" },
              { text: "模型路由", link: "/zh/guide/advanced/model-routing" },
              { text: "兜底模型", link: "/zh/guide/advanced/fallback" },
              { text: "流式", link: "/zh/guide/advanced/streaming" },
              { text: "多模态", link: "/zh/guide/advanced/multimodal" },
              { text: "结构化输出", link: "/zh/guide/advanced/structured-output" },
              { text: "工具调用", link: "/zh/guide/advanced/tool-calls" },
              { text: "推理模型", link: "/zh/guide/advanced/reasoning" },
              { text: "提示词缓存", link: "/zh/guide/advanced/prompt-cache" }
            ]
          },
          {
            text: "可观测性",
            items: [
              { text: "模型价格", link: "/zh/guide/observability/pricing" },
              { text: "请求日志", link: "/zh/guide/observability/logs" }
            ]
          }
        ]
      },
      {
        text: "最佳实践",
        items: [
          { text: "ClaudeCode接入ZenMux指南", link: "/zh/best-practices/claude-code" },
          { text: "CodeX接入ZenMux指南", link: "/zh/best-practices/codex" },
          { text: "opencode接入ZenMux指南", link: "/zh/best-practices/opencode" },
          { text: "Neovate接入ZenMux指南", link: "/zh/best-practices/neovate-code" }
          // { text: "Cherry Studio 接入指南", link: "/zh/best-practices/cherry-studio" },
          // { text: "沉浸式翻译接入指南", link: "/zh/best-practices/immersive-translate" }
        ]
      },
      {
        text: "API 参考",
        items: [
          {
            text: "OpenAI Compatible API",
            items: [{ text: "Create chat completion", link: "/zh/api/openai/create-chat-completion" }]
          },
          {
            text: "Platform API",
            items: [{ text: "Get generation", link: "/zh/api/platform/get-generation" }]
          },
          {
            text: "Anthropic API",
            items: [{ text: "Create Messages", link: "/zh/api/anthropic/create-messages" }]
          }
        ]
      },
      {
        text: "帮助中心",
        items: [
          { text: "隐私政策", link: "/zh/privacy" },
          { text: "服务协议", link: "/zh/terms-of-service" },
          // { text: "常见问题", link: "/zh/help/faq" },
          { text: "联系我们", link: "/zh/help/contact" }
        ]
      }
    ],
    search: { provider: "local" }
  }
});
