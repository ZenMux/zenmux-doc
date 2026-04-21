import { defineLoacaleConfig } from "..";

export default defineLoacaleConfig({
  label: "简体中文",
  lang: "zh-CN",
  link: "/zh/",
  description: "ZenMux 的文档",
  themeConfig: {
    outline: {
      label: "目录",
      level: [2, 3],
    },
    nav: [
      {
        text: "Studio",
        items: [
          { text: "Chat", link: "https://zenmux.ai/chat", noIcon: true },
          { text: "Video", link: "https://zenmux.ai/video", noIcon: true },
        ],
      },
      { text: "Models", link: "https://zenmux.ai/models", noIcon: true },
      {
        text: "Pricing",
        items: [
          {
            text: "Overview",
            link: "https://zenmux.ai/pricing/overview",
            noIcon: true,
          },
          {
            text: "Pay As You Go",
            link: "https://zenmux.ai/pricing/pay-as-you-go",
            noIcon: true,
          },
          {
            text: "Subscription",
            link: "https://zenmux.ai/pricing/subscription",
            noIcon: true,
          },
          {
            text: "Promotions",
            link: "https://zenmux.ai/pricing/promotions",
            noIcon: true,
          },
        ],
      },
      {
        text: "Developers",
        items: [
          { text: "Docs", link: "/", noIcon: true },
          { text: "Endpoints", link: "javascript:void(0)", noIcon: true },
          { text: "Blog", link: "https://zenmux.ai/blog", noIcon: true },
          {
            text: "Changelog",
            link: "https://zenmux.ai/changelog",
            noIcon: true,
          },
          {
            text: "Roadmap & Feedback",
            link: "https://github.com/orgs/ZenMux/projects/2",
            noIcon: true,
          },
        ],
      },
      { text: "Analytics", link: "https://zenmux.ai/analytics", noIcon: true },
      {
        text: "About Us",
        items: [
          {
            text: "The ZenMux Way",
            link: "https://zenmux.ai/aboutus",
            noIcon: true,
          },
          {
            text: "Supports",
            link: "https://zenmux.ai/supports",
            noIcon: true,
          },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/ZenMux/zenmux-doc" },
    ],
    sidebar: [
      {
        text: "关于 ZenMux",
        items: [{ text: "简介", link: "/zh/about/intro" }],
      },
      {
        text: "使用文档",
        items: [
          { text: "快速开始", link: "/zh/guide/quickstart" },
          {
            text: "高级调用",
            items: [
              {
                text: "供应商路由",
                link: "/zh/guide/advanced/provider-routing",
              },
              { text: "模型路由", link: "/zh/guide/advanced/model-routing" },
              { text: "模型别名", link: "/zh/guide/advanced/model-alias" },
              { text: "兜底模型", link: "/zh/guide/advanced/fallback" },
              { text: "流式", link: "/zh/guide/advanced/streaming" },
              { text: "多模态", link: "/zh/guide/advanced/multimodal" },
              {
                text: "结构化输出",
                link: "/zh/guide/advanced/structured-output",
              },
              { text: "工具调用", link: "/zh/guide/advanced/tool-calls" },
              { text: "推理模型", link: "/zh/guide/advanced/reasoning" },
              { text: "提示词缓存", link: "/zh/guide/advanced/prompt-cache" },
              { text: "图片生成", link: "/zh/guide/advanced/image-generation" },
              { text: "视频生成", link: "/zh/guide/advanced/video-generation" },
              { text: "文本嵌入", link: "/zh/guide/advanced/embeddings" },
              { text: "网络搜索", link: "/zh/guide/advanced/web-search" },
              { text: "1M 长上下文", link: "/zh/guide/advanced/long-context" },
              { text: "错误码参考", link: "/zh/guide/advanced/error-codes" },
            ],
          },
          {
            text: "订阅制套餐",
            link: "/zh/guide/subscription",
          },
          {
            text: "按量计费",
            link: "/zh/guide/pay-as-you-go",
          },
          {
            text: "下载发票",
            link: "/zh/guide/invoice",
          },
          {
            text: "可观测性",
            items: [
              { text: "模型价格", link: "/zh/guide/observability/pricing" },
              { text: "请求日志", link: "/zh/guide/observability/logs" },
              { text: "成本分析", link: "/zh/guide/observability/cost" },
              { text: "用量统计", link: "/zh/guide/observability/usage" },
              { text: "保险补偿", link: "/zh/guide/observability/insurance" },
            ],
          },
          {
            text: "Studio",
            items: [
              { text: "Studio-Chat", link: "/zh/guide/studio/studio-chat" },
            ],
          },
        ],
      },
      {
        text: "最佳实践",
        items: [
          {
            text: "ClaudeCode接入ZenMux指南",
            link: "/zh/best-practices/claude-code",
          },
          { text: "CodeX接入ZenMux指南", link: "/zh/best-practices/codex" },
          {
            text: "Gemini CLI接入ZenMux指南",
            link: "/zh/best-practices/gemini-cli",
          },
          {
            text: "opencode接入ZenMux指南",
            link: "/zh/best-practices/opencode",
          },
          { text: "Cline接入ZenMux指南", link: "/zh/best-practices/cline" },
          {
            text: "CherryStudio接入ZenMux指南",
            link: "/zh/best-practices/cherry-studio",
          },
          {
            text: "Obsidian接入ZenMux指南",
            link: "/zh/best-practices/obsidian",
          },
          { text: "Sider接入ZenMux指南", link: "/zh/best-practices/sider" },
          // { text: "沉浸式翻译接入指南", link: "/zh/best-practices/immersive-translate" }
          {
            text: "Open-WebUI接入ZenMux指南",
            link: "/zh/best-practices/open-webui",
          },
          {
            text: "Dify接入ZenMux指南",
            link: "/zh/best-practices/dify",
          },
          {
            text: "Neovate接入ZenMux指南",
            link: "/zh/best-practices/neovate-code",
          },
          {
            text: "Github Copilot 接入 ZenMux 指南",
            link: "/zh/best-practices/github-copilot",
          },
          {
            text: "OpenClaw 接入 ZenMux 指南",
            link: "/zh/best-practices/openclaw",
          },
          {
            text: "阿里云部署 OpenClaw 并集成 ZenMux 指南",
            link: "/zh/best-practices/openclaw-alibaba",
          },
          {
            text: "CC-Switch 接入 ZenMux 指南",
            link: "/zh/best-practices/cc-switch",
          },
          {
            text: "Cursor 接入 ZenMux 指南",
            link: "/zh/best-practices/cursor",
          },
          {
            text: "RikkaHub 接入 ZenMux 指南",
            link: "/zh/best-practices/rikkahub",
          },
          {
            text: "Hermes Agent 接入 ZenMux 指南",
            link: "/zh/best-practices/hermes-agent",
          },
        ],
      },
      {
        text: "API 参考",
        items: [
          {
            text: "OpenAI Compatible API",
            items: [
              {
                text: "Create Chat Completion",
                link: "/zh/api/openai/create-chat-completion",
              },
              {
                text: "Create a Model Response",
                link: "/zh/api/openai/openai-responses",
              },
              {
                text: "Create Embeddings",
                link: "/zh/api/openai/create-embeddings",
              },
              {
                text: "List Models",
                link: "/zh/api/openai/openai-list-models",
              },
            ],
          },
          {
            text: "Anthropic Compatible API",
            items: [
              {
                text: "Create a Message",
                link: "/zh/api/anthropic/create-messages",
              },
              {
                text: "List Models",
                link: "/zh/api/anthropic/anthropic-list-models",
              },
            ],
          },
          {
            text: "Google Vertex AI Compatible API",
            items: [
              {
                text: "Generate Content",
                link: "/zh/api/vertexai/generate-content",
              },
              {
                text: "List Models",
                link: "/zh/api/vertexai/google-list-models",
              },
            ],
          },
          {
            text: "Platform API",
            items: [
              {
                text: "Get Flow Rate",
                link: "/zh/api/platform/flow-rate",
              },
              {
                text: "Get PAYG Balance",
                link: "/zh/api/platform/payg-balance",
              },
              {
                text: "Get Subscription Detail",
                link: "/zh/api/platform/subscription-detail",
              },
              {
                text: "Get Generation",
                link: "/zh/api/platform/get-generation",
              },
              {
                text: "Get Statistics Timeseries",
                link: "/zh/api/platform/statistics-timeseries",
              },
              {
                text: "Get Statistics Leaderboard",
                link: "/zh/api/platform/statistics-leaderboard",
              },
              {
                text: "Get Statistics Market Share",
                link: "/zh/api/platform/statistics-market-share",
              },
            ],
          },
        ],
      },
      {
        text: "帮助中心",
        items: [
          { text: "隐私政策", link: "/zh/privacy" },
          // { text: "安全合规", link: "/zh/compliance" },
          { text: "服务协议", link: "/zh/terms-of-service" },
          // { text: "常见问题", link: "/zh/help/faq" },
          { text: "联系我们", link: "/zh/help/contact" },
        ],
      },
    ],
    search: { provider: "local" },
  },
});
