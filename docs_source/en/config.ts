import { defineLoacaleConfig } from "..";

export default defineLoacaleConfig({
  label: "English",
  lang: "en-US",
  title: "ZenMux",
  description: "zenmux.ai document",
  themeConfig: {
    externalLinkIcon: false,
    nav: [],
    sidebar: [
      {
        text: "About ZenMux",
        collapsed: false,
        items: [
          { text: "Introduction", link: "/about/intro" },
          { text: "Architecture", link: "/about/architecture" },
          { text: "Models & Providers", link: "/about/models-and-providers" },
          { text: "Pricing", link: "/about/pricing" },
          { text: "Smart Routing", link: "/about/smart-routing" }
        ]
      },
      {
        text: "Guides",
        items: [
          { text: "Quickstart", link: "/guide/quickstart" },
          { text: "Token Usage", link: "/guide/token-usage" },
          { text: "Basic Usage", link: "/guide/basic" },
          {
            text: "Advanced",
            items: [
              { text: "Streaming", link: "/guide/advanced/streaming" },
              { text: "Multimodal", link: "/guide/advanced/multimodal" },
              { text: "Structured Output", link: "/guide/advanced/structured-output" },
              { text: "Tool Calling", link: "/guide/advanced/tool-calls" },
              { text: "Prompt Cache", link: "/guide/advanced/prompt-cache" },
              { text: "Reasoning Models", link: "/guide/advanced/reasoning" }
            ]
          }
        ]
      },
      {
        text: "Best Practices",
        items: [
          { text: "Cherry Studio Integration", link: "/best-practices/cherry-studio" },
          { text: "Immersive Translate Integration", link: "/best-practices/immersive-translate" }
        ]
      },
      {
        text: "API Reference",
        items: [
          {
            text: "OpenAI Compatible API",
            items: [{ text: "Chat Completion", link: "/api/openai/chat-completion" }]
          },
          {
            text: "Platform API",
            items: [{ text: "Get a generation", link: "/api/platform/get-generation" }]
          }
        ]
      },
      {
        text: "Help Center",
        items: [
          { text: "FAQ", link: "/help/faq" },
          { text: "Contact Us", link: "/help/contact" },
          { text: "Privacy Policy", link: "/help/privacy" },
          { text: "Terms of Service", link: "/help/terms" }
        ]
      }
    ],
  },
});
