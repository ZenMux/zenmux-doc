import { defineLoacaleConfig } from "..";

export default defineLoacaleConfig({
  label: "English",
  lang: "en-US",
  description: "zenmux.ai document",
  themeConfig: {
    logo: 'https://cdn.marmot-cloud.com/storage/tbox-router/2025/08/18/MB5Icka/ZenMux.svg',
    nav: [
      { text: "Models", link: "https://zenmux.ai/models", noIcon: true },
      { text: "Chat", link: "https://zenmux.ai/chat", noIcon: true },
      { text: "Benchmarks", link: "https://zenmux.ai/benchmark", noIcon: true },
      { text: "Docs", link: "/", noIcon: true },
      { text: "About Us", link: "https://zenmux.ai/aboutus", noIcon: true },
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
        items: [
          { text: "Introduction", link: "/about/intro" },
          { text: "Models & Providers", link: "/about/models-and-providers" },
          { text: "Pricing & Cost", link: "/about/pricing-and-cost" },
          { text: "Provider Routing", link: "/about/provider-routing" },
        ],
      },
      {
        text: "User Guide",
        items: [
          { text: "Quickstart", link: "/guide/quickstart" },
          {
            text: "Advanced",
            items: [
              { text: "Streaming", link: "/guide/advanced/streaming" },
              { text: "Multimodal", link: "/guide/advanced/multimodal" },
              {
                text: "Structured Output",
                link: "/guide/advanced/structured-output",
              },
              { text: "Tool Calling", link: "/guide/advanced/tool-calls" },
              { text: "Prompt Cache", link: "/guide/advanced/prompt-cache" },
            ],
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
          { text: "Neovate Integration", link: "/best-practices/neovate-code" },
          // { text: "Cherry Studio Integration", link: "/best-practices/cherry-studio" },
          // { text: "Immersive Translate Integration", link: "/best-practices/immersive-translate" }
        ],
      },
      {
        text: "API Reference",
        items: [
          {
            text: "OpenAI Compatible API",
            items: [
              {
                text: "Create chat completion",
                link: "/api/openai/create-chat-completion",
              },
            ],
          },
          {
            text: "Platform API",
            items: [
              { text: "Get generation", link: "/api/platform/get-generation" },
            ],
          },
          {
            text: "Anthropic API",
            items: [
              {
                text: "Create Messages",
                link: "/zh/api/anthropic/create-messages",
              },
            ],
          },
        ],
      },
      {
        text: "Help Center",
        items: [
          { text: "Privacy Policy", link: "/privacy" },
          { text: "Terms of Service", link: "/terms-of-service" },
          // { text: "FAQ", link: "/help/faq" },
          { text: "Contact Us", link: "/help/contact" },
        ],
      },
    ],
    search: { provider: "local" },
  },
});
