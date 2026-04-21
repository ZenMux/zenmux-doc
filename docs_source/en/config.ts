import { defineLoacaleConfig } from "..";

export default defineLoacaleConfig({
  label: "English",
  lang: "en-US",
  description: "zenmux.ai document",
  themeConfig: {
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
    outline: {
      level: [2, 3],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/ZenMux/zenmux-doc" },
    ],
    sidebar: [
      {
        text: "About ZenMux",
        items: [{ text: "Introduction", link: "/about/intro" }],
      },
      {
        text: "User Guide",
        items: [
          { text: "Quickstart", link: "/guide/quickstart" },
          {
            text: "Advanced",
            items: [
              {
                text: "Provider Routing",
                link: "/guide/advanced/provider-routing",
              },
              { text: "Model Routing", link: "/guide/advanced/model-routing" },
              { text: "Model Aliases", link: "/guide/advanced/model-alias" },
              { text: "Fallback Model", link: "/guide/advanced/fallback" },
              { text: "Streaming", link: "/guide/advanced/streaming" },
              { text: "Multimodal", link: "/guide/advanced/multimodal" },
              {
                text: "Structured Output",
                link: "/guide/advanced/structured-output",
              },
              { text: "Tool Calling", link: "/guide/advanced/tool-calls" },
              { text: "Reasoning Models", link: "/guide/advanced/reasoning" },
              { text: "Prompt Cache", link: "/guide/advanced/prompt-cache" },
              {
                text: "Image Generation",
                link: "/guide/advanced/image-generation",
              },
              {
                text: "Video Generation",
                link: "/guide/advanced/video-generation",
              },
              { text: "Embeddings", link: "/guide/advanced/embeddings" },
              { text: "Web Search", link: "/guide/advanced/web-search" },
              { text: "1M Long Context", link: "/guide/advanced/long-context" },
              { text: "Error Codes", link: "/guide/advanced/error-codes" },
            ],
          },
          {
            text: "Subscription Plans",
            link: "/guide/subscription",
          },
          {
            text: "Pay AS You Go",
            link: "/guide/pay-as-you-go",
          },
          {
            text: "Download Invoices",
            link: "/guide/invoice",
          },
          {
            text: "Observability",
            items: [
              { text: "Model Pricing", link: "/guide/observability/pricing" },
              { text: "Request Logs", link: "/guide/observability/logs" },
              { text: "Cost", link: "/guide/observability/cost" },
              { text: "Usage", link: "/guide/observability/usage" },
              { text: "Insurance", link: "/guide/observability/insurance" },
            ],
          },
          {
            text: "Studio",
            items: [{ text: "Studio-Chat", link: "/guide/studio/studio-chat" }],
          },
        ],
      },
      {
        text: "Best Practices",
        items: [
          {
            text: "Claude Code Integration",
            link: "/best-practices/claude-code",
          },
          { text: "CodeX Integration", link: "/best-practices/codex" },
          {
            text: "Gemini CLI Integration",
            link: "/best-practices/gemini-cli",
          },
          { text: "opencode Integration", link: "/best-practices/opencode" },
          { text: "Cline Integration", link: "/best-practices/cline" },
          {
            text: "Cherry Studio Integration",
            link: "/best-practices/cherry-studio",
          },
          { text: "Obsidian Integration", link: "/best-practices/obsidian" },

          { text: "Sider Integration", link: "/best-practices/sider" },
          // { text: "Immersive Translate Integration", link: "/best-practices/immersive-translate" }

          {
            text: "Open-WebUI Integration",
            link: "/best-practices/open-webui",
          },
          { text: "Dify Integration", link: "/best-practices/dify" },
          { text: "Neovate Integration", link: "/best-practices/neovate-code" },
          {
            text: "Github Copilot Integration",
            link: "/best-practices/github-copilot",
          },
          { text: "OpenClaw Integration", link: "/best-practices/openclaw" },
          {
            text: "Deploying OpenClaw on Alibaba Cloud with ZenMux Integration",
            link: "/best-practices/openclaw-alibaba",
          },
          { text: "CC-Switch Integration", link: "/best-practices/cc-switch" },
          {
            text: "Cursor Integration",
            link: "/best-practices/cursor",
          },
          {
            text: "RikkaHub Integration",
            link: "/best-practices/rikkahub",
          },
          {
            text: "Hermes Agent Integration",
            link: "/best-practices/hermes-agent",
          },
        ],
      },
      {
        text: "API Reference",
        items: [
          {
            text: "OpenAI Compatible API",
            items: [
              {
                text: "Create Chat Completion",
                link: "/api/openai/create-chat-completion",
              },
              {
                text: "Create a Model Response",
                link: "/api/openai/openai-responses",
              },
              {
                text: "Create Embeddings",
                link: "/api/openai/create-embeddings",
              },
              {
                text: "List Models",
                link: "/api/openai/openai-list-models",
              },
            ],
          },
          {
            text: "Anthropic Compatible API",
            items: [
              {
                text: "Create a Message",
                link: "/api/anthropic/create-messages",
              },
              {
                text: "List Models",
                link: "/api/anthropic/anthropic-list-models",
              },
            ],
          },
          {
            text: "Google Vertex AI Compatible API",
            items: [
              {
                text: "Generate Content",
                link: "/api/vertexai/generate-content",
              },
              {
                text: "List Models",
                link: "/api/vertexai/google-list-models",
              },
            ],
          },
          {
            text: "Platform API",
            items: [
              { text: "Get Flow Rate", link: "/api/platform/flow-rate" },
              { text: "Get PAYG Balance", link: "/api/platform/payg-balance" },
              { text: "Get Subscription Detail", link: "/api/platform/subscription-detail" },
              { text: "Get Generation", link: "/api/platform/get-generation" },
              { text: "Get Statistics Timeseries", link: "/api/platform/statistics-timeseries" },
              { text: "Get Statistics Leaderboard", link: "/api/platform/statistics-leaderboard" },
              { text: "Get Statistics Market Share", link: "/api/platform/statistics-market-share" },
            ],
          },
        ],
      },
      {
        text: "Help Center",
        items: [
          { text: "Privacy Policy", link: "/privacy" },
          // { text: "Security and Compliance", link: "/compliance" },
          { text: "Terms of Service", link: "/terms-of-service" },
          // { text: "FAQ", link: "/help/faq" },
          { text: "Contact Us", link: "/help/contact" },
        ],
      },
    ],
    search: { provider: "local" },
  },
});
