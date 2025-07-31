import { zhCn } from 'element-plus/es/locales.mjs';
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title: "TboxRouter Documents",
  description: "A tboxrouter document",
  outDir: '../docs',
  base: '/sample-doc/',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // nav: [
    //   { text: 'Home', link: '/' },
    //   { text: 'Examples', link: '/markdown-examples' }
    // ],

    sidebar: [
      {
        text: 'Overview',
        collapsed: false,
        items: [
          { text: '🚀 Quickstart', link: '/' },
          { text: '❓ FAQ?', link: '/api-examples' },
          { text: '🧾 Priciples', link: '/api-examples' }
        ]
      },
      {
        text: 'Overview',
        items: [
          { text: '🚀Quickstart', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    search: {
      provider: 'local'
    },
  },


  // locales: {
  //   root: {
  //     label: 'English',
  //     lang: 'en-US',
  //     title: 'TboxRouter Documents',
  //     description: 'A tboxrouter document',
  //     themeConfig: {
  //       // https://vitepress.dev/reference/default-theme-config
  //       // nav: [
  //       //   { text: 'Home', link: '/' },
  //       //   { text: 'Examples', link: '/markdown-examples' }
  //       // ],

  //       sidebar: [
  //         {
  //           text: 'Overview',
  //           collapsed: false,
  //           items: [
  //             { text: '🚀 Quickstart', link: '/' },
  //             { text: '❓ FAQ?', link: '/api-examples' },
  //             { text: '🧾 Priciples', link: '/api-examples' }
  //           ]
  //         },
  //         {
  //           text: 'Overview',
  //           items: [
  //             { text: '🚀Quickstart', link: '/markdown-examples' },
  //             { text: 'Runtime API Examples', link: '/api-examples' }
  //           ]
  //         }
  //       ],

  //       socialLinks: [
  //         { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
  //       ],

  //       search: {
  //         provider: 'local'
  //       },
  //     },
  //   },
  //   zh: {
  //     label: '简体中文',
  //     lang: 'zh-CN',
  //     link: '/zh/',
  //     title: 'TboxRouter 文档',
  //     description: 'TboxRouter 的文档',
  //     themeConfig: {
  //       nav: [
  //         { text: '首页', link: '/zh/' },
  //         { text: '示例', link: '/zh/markdown-examples' }
  //       ],

  //       sidebar: [
  //         {
  //           text: '示例',
  //           items: [
  //             { text: 'Markdown 示例', link: '/zh/markdown-examples' },
  //             { text: '运行时 API 示例', link: '/zh/api-examples' }
  //           ]
  //         }
  //       ],
  //     },
  //   },
  // },

  postRender(context) {
    // You can modify the context here
    console.log('Post render context:', context);
  },
})
