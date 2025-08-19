import { defineLoacaleConfig } from "..";

export default defineLoacaleConfig({
  label: "简体中文",
  lang: "zh-CN",
  link: "/zh/",
  title: "ZenMux 文档",
  description: "ZenMux 的文档",
  themeConfig: {
    nav: [],
    outline: {
      label: "目录",
      level: [2, 3]
    },
    sidebar: [
      {
        text: "关于 ZenMux",
        collapsed: false,
        items: [
          { text: "简介", link: "/zh/about/intro" },
          { text: "架构", link: "/zh/about/architecture" },
          { text: "模型&供应商", link: "/zh/about/models-and-providers" },
          { text: "价格", link: "/zh/about/pricing" },
          { text: "智能路由", link: "/zh/about/smart-routing" }
        ]
      },
      {
        text: "使用文档",
        items: [
          { text: "快速开始", link: "/zh/guide/quickstart" },
          { text: "令牌使用", link: "/zh/guide/token-usage" },
          { text: "基础调用", link: "/zh/guide/basic" },
          {
            text: "高级调用",
            items: [
              { text: "流式", link: "/zh/guide/advanced/streaming" },
              { text: "多模态", link: "/zh/guide/advanced/multimodal" },
              { text: "结构化输出", link: "/zh/guide/advanced/structured-output" },
              { text: "工具调用", link: "/zh/guide/advanced/tool-calls" },
              { text: "提示词缓存", link: "/zh/guide/advanced/prompt-cache" },
              { text: "推理模型", link: "/zh/guide/advanced/reasoning" }
            ]
          }
        ]
      },
      {
        text: "最佳实践",
        items: [
          { text: "Cherry Studio 接入指南", link: "/zh/best-practices/cherry-studio" },
          { text: "沉浸式翻译接入指南", link: "/zh/best-practices/immersive-translate" }
        ]
      },
      {
        text: "API 参考",
        items: [
          {
            text: "OpenAI Compatible 接口",
            items: [{ text: "Chat Completion", link: "/zh/api/openai/chat-completion" }]
          },
          {
            text: "平台接口",
            items: [{ text: "Get a generation", link: "/zh/api/platform/get-generation" }]
          }
        ]
      },
      {
        text: "帮助中心",
        items: [
          { text: "常见问题", link: "/zh/help/faq" },
          { text: "联系我们", link: "/zh/help/contact" },
          { text: "隐私政策", link: "/zh/help/privacy" },
          { text: "服务条款", link: "/zh/help/terms" }
        ]
      }
    ],
    search: { provider: "local" }
  }
});