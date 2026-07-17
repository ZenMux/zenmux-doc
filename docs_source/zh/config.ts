import { defineLoacaleConfig } from "..";

const docsSidebar = [
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
        collapsed: true,
        items: [
          {
            text: "数据服务",
            link: "/zh/guide/advanced/data-services",
          },
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
          {
            text: "图片生成-Google Gemini协议",
            link: "/zh/guide/advanced/image-generation",
          },
          {
            text: "图片生成-OpenAI Image协议",
            link: "/zh/guide/advanced/openai-image-generation",
          },
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
        text: "退款说明",
        link: "/zh/guide/refund",
      },
      {
        text: "下载发票",
        link: "/zh/guide/invoice",
      },
      {
        text: "可观测性",
        collapsed: true,
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
        collapsed: true,
        items: [
          { text: "Studio-Chat", link: "/zh/guide/studio/studio-chat" },
          { text: "Studio-Image", link: "/zh/guide/studio/studio-image" },
          { text: "Studio-Video", link: "/zh/guide/studio/studio-video" },
        ],
      },
      {
        text: "ZenMux Skills",
        link: "/zh/guide/zenmux-skills",
      },
    ],
  },
  {
    text: "帮助中心",
    items: [
      { text: "隐私政策", link: "/zh/privacy" },
      { text: "服务协议", link: "/zh/terms-of-service" },
      { text: "联系我们", link: "/zh/help/contact" },
    ],
  },
];

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
        text: "工作室",
        items: [
          { text: "对话", link: "https://zenmux.ai/chat", noIcon: true },
          { text: "图片", link: "https://zenmux.ai/image", noIcon: true },
          { text: "视频", link: "https://zenmux.ai/video", noIcon: true },
        ],
      },
      { text: "模型", link: "https://zenmux.ai/models", noIcon: true },
      {
        text: "开发者",
        items: [
          { text: "文档", link: "/zh/", noIcon: true },
          { text: "接入点", link: "javascript:void(0)", noIcon: true },
          { text: "博客", link: "https://zenmux.ai/blog", noIcon: true },
          {
            text: "更新日志",
            link: "https://zenmux.ai/changelog",
            noIcon: true,
          },
          {
            text: "路线图与反馈",
            link: "https://github.com/orgs/ZenMux/projects/2",
            noIcon: true,
          },
        ],
      },
      { text: "数据分析", link: "https://zenmux.ai/analytics", noIcon: true },
      {
        text: "定价",
        items: [
          {
            text: "概览",
            link: "https://zenmux.ai/pricing/overview",
            noIcon: true,
          },
          {
            text: "按量付费",
            link: "https://zenmux.ai/pricing/pay-as-you-go",
            noIcon: true,
          },
          {
            text: "订阅",
            link: "https://zenmux.ai/pricing/subscription",
            noIcon: true,
          },
          {
            text: "优惠活动",
            link: "https://zenmux.ai/pricing/promotions",
            noIcon: true,
          },
        ],
      },
      {
        text: "关于我们",
        items: [
          {
            text: "ZenMux 之道",
            link: "https://zenmux.ai/aboutus",
            noIcon: true,
          },
          {
            text: "支持",
            link: "https://zenmux.ai/supports",
            noIcon: true,
          },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/ZenMux/zenmux-doc" },
    ],
    sidebar: {
      "/zh/guide/": docsSidebar,
      "/zh/about/": docsSidebar,
      "/zh/help/": docsSidebar,
      "/zh/privacy": docsSidebar,
      "/zh/terms-of-service": docsSidebar,
      "/zh/api/": [
        {
          text: "模型端点",
          items: [
            {
              text: "协议转换参数兼容性",
              link: "/zh/api/protocol-conversion",
            },
            {
              text: "OpenAI 兼容",
              items: [
                {
                  text: "Create a Chat Completion",
                  link: "/zh/api/openai/create-chat-completion",
                },
                {
                  text: "Create a Model Response",
                  link: "/zh/api/openai/openai-responses",
                },
                {
                  text: "Create an Embedding",
                  link: "/zh/api/openai/create-embeddings",
                },
                {
                  text: "Create Rerank",
                  link: "/zh/api/openai/rerank",
                },
                {
                  text: "Create image",
                  link: "/zh/api/openai/generate-an-image",
                },
                {
                  text: "Create image edit",
                  link: "/zh/api/openai/create-image-edit",
                },
                {
                  text: "Image generation streaming events",
                  link: "/zh/api/openai/image-generation-streaming-events",
                },
                {
                  text: "Image edit streaming events",
                  link: "/zh/api/openai/image-edit-streaming-events",
                },
                {
                  text: "Create speech",
                  link: "/zh/api/openai/create-audio-speech",
                },
                {
                  text: "Create transcription",
                  link: "/zh/api/openai/create-audio-transcriptions",
                },
                {
                  text: "List Models",
                  link: "/zh/api/openai/openai-list-models",
                },
              ],
            },
            {
              text: "Anthropic 兼容",
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
              text: "Google Vertex AI 兼容",
              items: [
                {
                  text: "Generate Content",
                  link: "/zh/api/vertexai/generate-content",
                },
                {
                  text: "Create Interaction",
                  link: "/zh/api/vertexai/create-interaction-native",
                },
                {
                  text: "Generate Images",
                  link: "/zh/api/vertexai/generate-images",
                },
                {
                  text: "Generate Videos",
                  link: "/zh/api/vertexai/generate-videos",
                },
                {
                  text: "List Models",
                  link: "/zh/api/vertexai/google-list-models",
                },
              ],
            },
            {
              text: "ZenMux 原生",
              items: [
                {
                  text: "Generate Videos",
                  link: "/zh/api/zenmux/generate-videos-native",
                },
              ],
            },
          ],
        },
        {
          text: "平台 API",
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
            {
              text: "Get Model Usage",
              link: "/zh/api/platform/statistics-model-usage",
            },
            {
              text: "Get Statistics Trending",
              link: "/zh/api/platform/statistics-trending",
            },
            {
              text: "Get Statistics Performance",
              link: "/zh/api/platform/statistics-performance",
            },
          ],
        },
      ],
      "/zh/best-practices/": [
        {
          text: "最佳实践",
          items: [
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/HTMS2Uv/Property-1Calude.svg" />ClaudeCode接入ZenMux指南',
              link: "/zh/best-practices/claude-code",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/HTMS2Uv/Property-1Calude.svg" />Claude Desktop 接入 ZenMux 指南',
              link: "/zh/best-practices/claude-desktop",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/3e4UfxM/Property-1Codex.svg" />CodeX CLI + Codex APP 接入ZenMux指南',
              link: "/zh/best-practices/codex",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/LksmNgb/Property-1Gemini.svg" />Gemini CLI接入ZenMux指南',
              link: "/zh/best-practices/gemini-cli",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/aJSfGT3/Property-1opencode.svg" />OpenCode 接入ZenMux指南',
              link: "/zh/best-practices/opencode",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/ev9eqnc/Property-1cline.svg" />Cline接入ZenMux指南',
              link: "/zh/best-practices/cline",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/aA2YGDk/Property-1cherrystudio.svg" />CherryStudio接入ZenMux指南',
              link: "/zh/best-practices/cherry-studio",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/e8rAwRd/Property-1obsidian.svg" />Obsidian接入ZenMux指南',
              link: "/zh/best-practices/obsidian",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/J4cCdCL/Property-1Sider.svg" />Sider接入ZenMux指南',
              link: "/zh/best-practices/sider",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/BaUQozX/Property-1openwebui.svg" />Open-WebUI接入ZenMux指南',
              link: "/zh/best-practices/open-webui",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/YziH1Wm/Property-1dify.svg" />Dify接入ZenMux指南',
              link: "/zh/best-practices/dify",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/hVDPe9M/Property-1Neovate.svg" />Neovate接入ZenMux指南',
              link: "/zh/best-practices/neovate-code",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/Tbnm5fx/Property-1githubcopilot.svg" />Github Copilot 接入 ZenMux 指南',
              link: "/zh/best-practices/github-copilot",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/i0H2J7w/Property-1openclaw.svg" />OpenClaw 接入 ZenMux 指南',
              link: "/zh/best-practices/openclaw",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/i0H2J7w/Property-1openclaw.svg" />阿里云部署 OpenClaw 并集成 ZenMux 指南',
              link: "/zh/best-practices/openclaw-alibaba",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/zBEE8Dm/Property-1CC-Switch.svg" />CC-Switch 接入 ZenMux 指南',
              link: "/zh/best-practices/cc-switch",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/cT6lvK5/Property-1Cursor.svg" />Cursor 接入 ZenMux 指南',
              link: "/zh/best-practices/cursor",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/mFIxohk/Property-1RikkaHub.svg" />RikkaHub 接入 ZenMux 指南',
              link: "/zh/best-practices/rikkahub",
            },
            {
              text: '<img src="https://cdn.marmot-cloud.com/storage/zenmux/2026/05/18/jT0X0zI/Property-1Hermes.svg" />Hermes Agent 接入 ZenMux 指南',
              link: "/zh/best-practices/hermes-agent",
            },
          ],
        },
      ],
      "/zh/cookbook/": [
        {
          text: "Cookbook",
          items: [],
        },
      ],
    },
    search: { provider: "local" },
  },
});
