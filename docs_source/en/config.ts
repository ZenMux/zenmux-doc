import { defineLoacaleConfig } from "..";

const docsSidebar = [
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
        collapsed: true,
        items: [
          {
            text: "Data Services",
            link: "/guide/advanced/data-services",
          },
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
            text: "Image Generation - Google Gemini Protocol",
            link: "/guide/advanced/image-generation",
          },
          {
            text: "Image Generation - OpenAI Images Protocol",
            link: "/guide/advanced/openai-image-generation",
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
        text: "Refunds",
        link: "/guide/refund",
      },
      {
        text: "Download Invoices",
        link: "/guide/invoice",
      },
      {
        text: "Observability",
        collapsed: true,
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
        collapsed: true,
        items: [{ text: "Studio-Chat", link: "/guide/studio/studio-chat" }],
      },
      {
        text: "ZenMux Skills",
        link: "/guide/zenmux-skills",
      },
    ],
  },
  {
    text: "Help Center",
    items: [
      { text: "Privacy Policy", link: "/privacy" },
      { text: "Terms of Service", link: "/terms-of-service" },
      { text: "Contact Us", link: "/help/contact" },
    ],
  },
];

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
    sidebar: {
      "/guide/": docsSidebar,
      "/about/": docsSidebar,
      "/help/": docsSidebar,
      "/privacy": docsSidebar,
      "/terms-of-service": docsSidebar,
      "/api/": [
        {
          text: "Model Endpoints",
          items: [
            {
              text: "OpenAI Compatible",
              items: [
                {
                  text: "Create a Chat Completion",
                  link: "/api/openai/create-chat-completion",
                },
                {
                  text: "Create a Model Response",
                  link: "/api/openai/openai-responses",
                },
                {
                  text: "Create an Embedding",
                  link: "/api/openai/create-embeddings",
                },
                {
                  text: "Create image",
                  link: "/api/openai/generate-an-image",
                },
                {
                  text: "Create image edit",
                  link: "/api/openai/create-image-edit",
                },
                {
                  text: "Image generation streaming events",
                  link: "/api/openai/image-generation-streaming-events",
                },
                {
                  text: "Image edit streaming events",
                  link: "/api/openai/image-edit-streaming-events",
                },
                {
                  text: "List Models",
                  link: "/api/openai/openai-list-models",
                },
              ],
            },
            {
              text: "Anthropic Compatible",
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
              text: "Google Vertex AI Compatible",
              items: [
                {
                  text: "Generate Content",
                  link: "/api/vertexai/generate-content",
                },
                {
                  text: "Generate Images",
                  link: "/api/vertexai/generate-images",
                },
                {
                  text: "Generate Videos",
                  link: "/api/vertexai/generate-videos",
                },
                {
                  text: "List Models",
                  link: "/api/vertexai/google-list-models",
                },
              ],
            },
          ],
        },
        {
          text: "Platform API",
          items: [
            { text: "Get Flow Rate", link: "/api/platform/flow-rate" },
            { text: "Get PAYG Balance", link: "/api/platform/payg-balance" },
            {
              text: "Get Subscription Detail",
              link: "/api/platform/subscription-detail",
            },
            { text: "Get Generation", link: "/api/platform/get-generation" },
            {
              text: "Get Statistics Timeseries",
              link: "/api/platform/statistics-timeseries",
            },
            {
              text: "Get Statistics Leaderboard",
              link: "/api/platform/statistics-leaderboard",
            },
            {
              text: "Get Statistics Market Share",
              link: "/api/platform/statistics-market-share",
            },
          ],
        },
      ],
      "/best-practices/": [
        {
          text: "Integrations",
          items: [
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/HTMS2Uv/Property-1Calude.svg" />Claude Code Integration',
              link: "/best-practices/claude-code",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/HTMS2Uv/Property-1Calude.svg" />Claude Desktop Integration',
              link: "/best-practices/claude-desktop",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/3e4UfxM/Property-1Codex.svg" />CodeX Integration',
              link: "/best-practices/codex",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/LksmNgb/Property-1Gemini.svg" />Gemini CLI Integration',
              link: "/best-practices/gemini-cli",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/aJSfGT3/Property-1opencode.svg" />OpenCode Integration',
              link: "/best-practices/opencode",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/ev9eqnc/Property-1cline.svg" />Cline Integration',
              link: "/best-practices/cline",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/aA2YGDk/Property-1cherrystudio.svg" />Cherry Studio Integration',
              link: "/best-practices/cherry-studio",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/e8rAwRd/Property-1obsidian.svg" />Obsidian Integration',
              link: "/best-practices/obsidian",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/J4cCdCL/Property-1Sider.svg" />Sider Integration',
              link: "/best-practices/sider",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/BaUQozX/Property-1openwebui.svg" />Open-WebUI Integration',
              link: "/best-practices/open-webui",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/YziH1Wm/Property-1dify.svg" />Dify Integration',
              link: "/best-practices/dify",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/hVDPe9M/Property-1Neovate.svg" />Neovate Integration',
              link: "/best-practices/neovate-code",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/Tbnm5fx/Property-1githubcopilot.svg" />Github Copilot Integration',
              link: "/best-practices/github-copilot",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/i0H2J7w/Property-1openclaw.svg" />OpenClaw Integration',
              link: "/best-practices/openclaw",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/i0H2J7w/Property-1openclaw.svg" />Deploying OpenClaw on Alibaba Cloud with ZenMux Integration',
              link: "/best-practices/openclaw-alibaba",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/zBEE8Dm/Property-1CC-Switch.svg" />CC-Switch Integration',
              link: "/best-practices/cc-switch",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/cT6lvK5/Property-1Cursor.svg" />Cursor Integration',
              link: "/best-practices/cursor",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/mFIxohk/Property-1RikkaHub.svg" />RikkaHub Integration',
              link: "/best-practices/rikkahub",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/jT0X0zI/Property-1Hermes.svg" />Hermes Agent Integration',
              link: "/best-practices/hermes-agent",
            },
          ],
        },
      ],
      "/cookbook/": [
        {
          text: "Cookbook",
          items: [],
        },
      ],
    },
    search: { provider: "local" },
  },
});
