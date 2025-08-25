import { defineLoacaleConfig } from "..";

export default defineLoacaleConfig({
  label: "English",
  lang: "en-US",
  title: "ZenMux",
  description: "zenmux.ai document",
  themeConfig: {
    nav: [
      { text: 'API', link: '/api/overview' },
      { text: 'Models', link: 'https://zenmux.ai/models', noIcon: true },
      { text: 'Chat', link: 'https://zenmux.ai/chat', noIcon: true },
      { text: 'Ranking', link: 'https://zenmux.ai/rangking', noIcon: true },
    ],
    outline: {
      level: [2, 3]
    },
    socialLinks: false as any,
    sidebar: [
      {
        text: "About ZenMux",
        items: [
          { text: "Introduction", link: "/about/intro" },
          { text: "Models & Providers", link: "/about/models-and-providers" },
          { text: "Pricing & Cost", link: "/about/pricing-and-cost" },
          { text: "Provider Routing", link: "/about/provider-routing" }
        ]
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
              { text: "Structured Output", link: "/guide/advanced/structured-output" },
              { text: "Tool Calling", link: "/guide/advanced/tool-calls" }
            ]
          }
        ]
      },
      {
        text: "Best Practices",
        items: [
          { text: "Claude Code Integration", link: "/best-practices/claude-code" }
          // { text: "Cherry Studio Integration", link: "/best-practices/cherry-studio" },
          // { text: "Immersive Translate Integration", link: "/best-practices/immersive-translate" }
        ]
      },
      {
        text: "API Reference",
        items: [
          {
            text: "OpenAI Compatible API",
            items: [{ text: "Create chat completion", link: "/api/openai/create-chat-completion" }]
          },
          {
            text: "Platform API",
            items: [{ text: "Get generation", link: "/api/platform/get-generation" }]
          }
        ]
      },
      {
        text: "Help Center",
        items: [
          { text: "FAQ", link: "/help/faq" },
          { text: "Contact Us", link: "/help/contact" }
        ]
      }
    ],
    search: { provider: "local" }
  },
});
