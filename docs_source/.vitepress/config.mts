import { defineConfig } from "vitepress";

import { locales } from '../config';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "ZenMux",
  description: "zenmux.ai document",
  outDir: "../docs",
  base: "/",
  ignoreDeadLinks: true,

  rewrites: {
    'en/:rest*': ':rest*'
  },

  themeConfig: {
    search: { provider: "local" }
  },

  // locales: English (root) and Simplified Chinese (zh)
  locales: locales,
});
