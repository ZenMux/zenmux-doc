import { defineLoacaleConfig } from "..";

export default defineLoacaleConfig({
  label: "English",
  lang: "en-US",
  description: "zenmux.ai document",
  themeConfig: {
    nav: [
      { text: "Models", link: "https://zenmux.ai/models", noIcon: true },
      { text: "Chat", link: "https://zenmux.ai/chat", noIcon: true },
      { text: "Benchmarks", link: "https://zenmux.ai/benchmark", noIcon: true },
      { text: "Docs", link: "/", noIcon: true },
      { text: "Blog", link: "https://zenmux.ai/blog", noIcon: true },
      { text: "Changelog", link: "https://zenmux.ai/changelog", noIcon: true },
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
              { text: "Fallback Model", link: "/guide/advanced/fallback" },
              { text: "Streaming", link: "/guide/advanced/streaming" },
              { text: "Multimodal", link: "/guide/advanced/multimodal" },
              { text: "Image Generation", link: "/guide/advanced/image-generation" },
              {
                text: "Structured Output",
                link: "/guide/advanced/structured-output",
              },
              { text: "Tool Calling", link: "/guide/advanced/tool-calls" },
              { text: "Reasoning Models", link: "/guide/advanced/reasoning" },
              { text: "Prompt Cache", link: "/guide/advanced/prompt-cache" },
            ],
          },
          {
            text: "Observability",
            items: [
              { text: "Model Pricing", link: "/guide/observability/pricing" },
              { text: "Request Logs", link: "/guide/observability/logs" },
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
          { text: "CodeX Integration", link: "/best-practices/codex" },
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
                link: "/api/anthropic/create-messages",
              },
            ],
          },
          {
            text: "Google Vertex AI API",
            items: [
              {
                text: "Generate Content",
                link: "/api/vertexai/generate-content",
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
