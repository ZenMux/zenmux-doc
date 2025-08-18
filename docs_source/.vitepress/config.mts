import { defineConfig } from "vitepress";
import container from 'markdown-it-container';
import fs from "node:fs";
import LZString from 'lz-string';
import { locales } from '../config';

const basePath = process.cwd() + '/docs_source/';

function extractTitle(info: string, html = false) {
  if (html) {
    return (
      info.replace(/<!--[^]*?-->/g, '').match(/data-title="(.*?)"/)?.[1] || ''
    )
  }
  return info.match(/\[(.*)\]/)?.[1] || extractLang(info) || 'txt'
}

function extractLang(info: string) {
  return info
    .trim()
    .replace(/=(\d*)/, '')
    .replace(/:(no-)?line-numbers({| |$|=\d*).*/, '')
    .replace(/(-vue|{| ).*$/, '')
    .replace(/^vue-html$/, 'template')
    .replace(/^ansi$/, '')
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "ZenMux",
  description: "zenmux.ai document",
  outDir: "../docs",
  base: "/",
  ignoreDeadLinks: true,

  head: [['link', { rel: 'icon', href: '/favicon.svg' }]],

  vite: {
    server: {
      host: '127.0.0.1'
    },
  },

  rewrites: {
    'en/:rest*': ':rest*'
  },

  markdown: {
    config(md) {
      md.use(container, 'api-request', {
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            let tabs = ''
            let checked = 'checked'
            const info = tokens[idx].info.trim().slice('api-request'.length).trim()

            for (
              let i = idx + 1;
              !(
                tokens[i].nesting === -1 &&
                tokens[i].type === 'container_api-request_close'
              );
              ++i
            ) {
              const isHtml = tokens[i].type === 'html_block'

              if (
                (tokens[i].type === 'fence' && tokens[i].tag === 'code') ||
                isHtml
              ) {
                const title = extractTitle(
                  isHtml ? tokens[i].content : tokens[i].info,
                  isHtml
                )

                if (title) {
                  tabs += `<input type="radio" name="group-${idx}" id="tab-${i}" ${checked}><label data-title="${md.utils.escapeHtml(title)}" for="tab-${i}">${title}</label>`

                  if (checked && !isHtml) tokens[i].info += ' active'
                  checked = ''
                }
              }
            }

            return `<div class="vp-code-group api-request" data-info="${info}"><div class="tabs">${tabs}</div><div class="blocks">\n`
          }
          return `</div></div>\n`
        },
      })
    },
  },

  transformPageData(pageData, ctx) {
    // @ts-expect-error not error
    pageData.content = LZString.compressToBase64(fs.readFileSync(basePath + pageData.filePath).toString().replace(/<Copy \/>/g, ''));
  },

  themeConfig: {
    search: { provider: "local" },
  },

  // locales: English (root) and Simplified Chinese (zh)
  locales: locales,
});
