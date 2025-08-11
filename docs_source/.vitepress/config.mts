import { zhCn } from "element-plus/es/locales.mjs";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "ZenMux",
  description: "zenmux.ai document",
  outDir: "../docs",
  base: "/",

  ignoreDeadLinks: true,

  themeConfig: {
    externalLinkIcon: false,
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "API", link: "/api/overview" },
      { text: "Models", link: "https://zenmux.ai/models", noIcon: true },
      { text: "Chat", link: "https://zenmux.ai/chat", noIcon: true },
      { text: "Ranking", link: "https://zenmux.ai/ranking", noIcon: true },
      { component: "Login" },
    ],

    sidebar: [
      {
        text: "Overview",
        collapsed: false,
        items: [{ text: "🚀 Quickstart", link: "/" }],
      },
      {
        text: "Api Reference",
        items: [{ text: "Overview", link: "/api/overview" }],
      },
    ],

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress', ariaLabel: 'GitHub' }
    // ],

    search: {
      provider: "local",
    },
  },

  // Enable locales for English (root) and Simplified Chinese (zh)
  locales: {
    root: {
      label: "English",
      lang: "en-US",
      title: "ZenMux",
      description: "zenmux.ai document",
      // Use the global themeConfig for root; override only if necessary
    },
    zh: {
      label: "简体中文",
      lang: "zh-CN",
      link: "/zh/",
      title: "ZenMux 文档",
      description: "ZenMux 的文档",
      themeConfig: {
        nav: [
          { text: "API 概览", link: "/api/overview" },
          { text: "模型", link: "https://zenmux.ai/models", noIcon: true },
          { text: "聊天", link: "https://zenmux.ai/chat", noIcon: true },
          { text: "Ranking", link: "https://zenmux.ai/ranking", noIcon: true },
          { component: "Login" },
        ],
        sidebar: [
          {
            text: "概览",
            collapsed: false,
            items: [
              { text: "🚀 快速开始", link: "/zh/getting-started" },
              { text: "Markdown 示例", link: "/zh/markdown-examples" },
              { text: "运行时 API 示例", link: "/zh/api-examples" },
            ],
          },
          {
            text: "API 参考",
            items: [
              // 暂无中文版本，先指向英文 Overview
              { text: "Overview", link: "/api/overview" },
            ],
          },
        ],
        search: { provider: "local" },
      },
    },
  },

  postRender(context) {
    // You can modify the context here
    console.log("Post render context:", context);
  },
});
