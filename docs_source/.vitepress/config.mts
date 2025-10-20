import { defineConfig } from "vitepress";
import container from 'markdown-it-container';
import fs from "node:fs";
import LZString from 'lz-string';
import {
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'
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
  description: "zenmux.ai document",
  outDir: "../docs",
  base: "/",
  ignoreDeadLinks: true,

  head: [['link', { rel: 'icon', href: '/favicon.svg' }]],

  vite: {
    server: {
      host: '127.0.0.1'
    },
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          'python': 'vscode-icons:file-type-python',
          'javascript': 'vscode-icons:file-type-js',
          'typescript': 'vscode-icons:file-type-typescript',
          'vue': 'vscode-icons:file-type-vue',
          'html': 'vscode-icons:file-type-html',
          'css': 'vscode-icons:file-type-css',
          'json': 'vscode-icons:file-type-json',
          'markdown': 'vscode-icons:file-type-markdown',
          'c': 'vscode-icons:file-type-c',
          'cpp': 'vscode-icons:file-type-cpp',
          'java': 'vscode-icons:file-type-java',
          'go': 'vscode-icons:file-type-go',
          'ruby': 'vscode-icons:file-type-ruby',
          'php': 'vscode-icons:file-type-php',
          'shell': 'vscode-icons:file-type-shell',
          'bash': 'vscode-icons:file-type-shell',
          'sql': 'vscode-icons:file-type-sql',
          'xml': 'vscode-icons:file-type-xml',
          'yaml': 'vscode-icons:file-type-yaml',
          'dockerfile': 'vscode-icons:file-type-docker',
          'kotlin': 'vscode-icons:file-type-kotlin',
          'swift': 'vscode-icons:file-type-swift',
          'rust': 'vscode-icons:file-type-rust',
          'scala': 'vscode-icons:file-type-scala',
          'perl': 'vscode-icons:file-type-perl',
          'haskell': 'vscode-icons:file-type-haskell',
          'elixir': 'vscode-icons:file-type-elixir',
          'lua': 'vscode-icons:file-type-lua',
          'r': 'vscode-icons:file-type-r',
          'matlab': 'vscode-icons:file-type-matlab',
          'powershell': 'vscode-icons:file-type-powershell',
          'typescriptreact': 'vscode-icons:file-type-tsx',
          'javascriptreact': 'vscode-icons:file-type-js',
          'vuejs': 'vscode-icons:file-type-vue',
          'svelte': 'vscode-icons:file-type-svelte',
          'json5': 'vscode-icons:file-type-json',
          'jsonc': 'vscode-icons:file-type-json',
          'graphql': 'vscode-icons:file-type-graphql',
          'markdownlint': 'vscode-icons:file-type-markdown',
          'vuepress': 'vscode-icons:file-type-vue',
          'nuxt': 'vscode-icons:file-type-nuxt',
          'nextjs': 'vscode-icons:file-type-nextjs',
          'astro': 'vscode-icons:file-type-astro',
        },
      }),
    ]
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
    if (pageData.frontmatter.pageClass === 'api-page') {
      pageData.frontmatter.aside = false;
    }
    // @ts-expect-error not error
    pageData.content = LZString.compressToBase64(fs.readFileSync(basePath + pageData.filePath).toString().replace(/<Copy \/>/g, ''));
  },

  themeConfig: {
    siteTitle: '\u200B',
    search: { provider: "local" },
    logoLink: "https://zenmux.ai",
  },

  // locales: English (root) and Simplified Chinese (zh)
  locales: locales,
});
