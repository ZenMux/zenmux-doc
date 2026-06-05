import { defineConfig } from "vitepress";
import container from "markdown-it-container";
import fs from "node:fs";
import { groupIconVitePlugin } from "vitepress-plugin-group-icons";
import { docsIndexPlugin } from "./plugins/docs-index-plugin";
import { locales } from "../config";

const basePath = process.cwd() + "/docs_source/";
const siteOrigin = "https://zenmux.ai";

type DocsHeader = {
  level?: number;
  title?: string;
  slug?: string;
};

type DocsPageData = {
  relativePath: string;
  title?: string;
  description?: string;
  frontmatter?: Record<string, any>;
  headers?: DocsHeader[];
};

type JsonLdObject = Record<string, unknown>;

function extractTitle(info: string, html = false) {
  if (html) {
    return (
      info.replace(/<!--[^]*?-->/g, "").match(/data-title="(.*?)"/)?.[1] || ""
    );
  }
  return info.match(/\[(.*)\]/)?.[1] || extractLang(info) || "txt";
}

function extractLang(info: string) {
  return info
    .trim()
    .replace(/=(\d*)/, "")
    .replace(/:(no-)?line-numbers({| |$|=\d*).*/, "")
    .replace(/(-vue|{| ).*$/, "")
    .replace(/^vue-html$/, "template")
    .replace(/^ansi$/, "");
}

function parseCodeTabTitle(title: string) {
  const [label, ...descriptionParts] = title.split("|");
  return {
    label: label.trim(),
    description: descriptionParts.join("|").trim(),
  };
}

function withDocsSitemapPath(url: string) {
  const normalized = url ? (url.startsWith("/") ? url : `/${url}`) : "/";
  return normalized.startsWith("/docs/") ? normalized : `/docs${normalized}`;
}

function isDeprecatedDocsSitemapUrl(url: string) {
  return /-old\.html$/.test(url) || url === "/docs/zh/sider.html";
}

function withXDefaultLink(links = []) {
  if (!links.length || links.some((link) => link.lang === "x-default" || link.hreflang === "x-default")) {
    return links;
  }

  const defaultLink = links.find((link) => (
    link.lang === "en-US" ||
    link.hreflang === "en-US" ||
    link.lang === "en" ||
    link.hreflang === "en"
  )) || links[0];

  return [
    ...links,
    {
      lang: "x-default",
      url: defaultLink.url,
    },
  ];
}

function canonicalDocsPath(relativePath: string) {
  const htmlPath = relativePath.replace(/\.md$/, ".html");
  const normalizedPath = htmlPath.startsWith("zh/") ? htmlPath : htmlPath.replace(/^en\//, "");
  const canonicalMap = new Map([
    [
      "api/anthropic/create-messages-old.html",
      "api/anthropic/create-messages.html",
    ],
    [
      "zh/api/anthropic/create-messages-old.html",
      "zh/api/anthropic/create-messages.html",
    ],
    [
      "api/openai/create-chat-completion-old.html",
      "api/openai/create-chat-completion.html",
    ],
    [
      "zh/api/openai/create-chat-completion-old.html",
      "zh/api/openai/create-chat-completion.html",
    ],
    [
      "api/vertexai/generate-content-old.html",
      "api/vertexai/generate-content.html",
    ],
    [
      "zh/api/vertexai/generate-content-old.html",
      "zh/api/vertexai/generate-content.html",
    ],
    [
      "zh/sider.html",
      "zh/best-practices/sider.html",
    ],
  ]);

  return canonicalMap.get(normalizedPath) || normalizedPath;
}

function docsCanonicalUrl(relativePath: string) {
  return `${siteOrigin}/docs/${canonicalDocsPath(relativePath)}`;
}

function docsPathSegments(relativePath: string) {
  const canonicalPath = canonicalDocsPath(relativePath)
    .replace(/\.html$/, "")
    .split("/")
    .filter(Boolean);
  if (canonicalPath[0] === "en") {
    canonicalPath.shift();
  }
  return canonicalPath;
}

function humanizeDocsSegment(segment: string) {
  const labels = new Map([
    ["zh", "中文"],
    ["api", "API"],
    ["openai", "OpenAI"],
    ["anthropic", "Anthropic"],
    ["vertexai", "Vertex AI"],
    ["best-practices", "Best Practices"],
    ["guide", "Guide"],
    ["advanced", "Advanced"],
    ["observability", "Observability"],
    ["studio", "Studio"],
    ["help", "Help"],
  ]);
  return labels.get(segment) || segment
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function cleanMarkdownText(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^:::.+$/gm, " ")
    .replace(/^[-*+]\s+/gm, " ")
    .replace(/^>\s?/gm, " ")
    .replace(/[#*_~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripFrontmatter(content: string) {
  return content.replace(/^---[\s\S]*?---\s*/, "");
}

function readDocsMarkdown(relativePath: string) {
  const candidates = [
    `${basePath}${relativePath}`,
    `${basePath}en/${relativePath}`,
  ];
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      return fs.readFileSync(file, "utf-8");
    }
  }
  return "";
}

function cleanFaqQuestion(title: string) {
  return title.replace(/^\d+[.)、]\s*/, "").trim();
}

function docsPageTitle(pageData: DocsPageData) {
  return (
    pageData.frontmatter?.title ||
    pageData.title ||
    humanizeDocsSegment(docsPathSegments(pageData.relativePath).at(-1) || "Docs")
  );
}

function buildJsonLdHead(jsonLd: JsonLdObject) {
  return [
    "script",
    { type: "application/ld+json" },
    JSON.stringify(jsonLd).replace(/<\/script/gi, "<\\/script"),
  ];
}

function buildDocsBreadcrumbJsonLd(pageData: DocsPageData): JsonLdObject {
  const segments = docsPathSegments(pageData.relativePath);
  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${siteOrigin}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Docs",
      item: `${siteOrigin}/docs/`,
    },
  ];
  let path = "/docs";
  segments.forEach((segment, index) => {
    path += `/${segment}`;
    const isLast = index === segments.length - 1;
    itemListElement.push({
      "@type": "ListItem",
      position: index + 3,
      name: isLast ? docsPageTitle(pageData) : humanizeDocsSegment(segment),
      item: isLast ? docsCanonicalUrl(pageData.relativePath) : `${siteOrigin}${path}/`,
    });
  });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

function extractDocsFaqItems(relativePath: string) {
  if (!/(^|\/)help\/faq\.md$/.test(relativePath)) {
    return [];
  }
  const content = stripFrontmatter(readDocsMarkdown(relativePath));
  const headings = [...content.matchAll(/^##\s+(.+)$/gm)].map((match) => ({
    title: cleanFaqQuestion(match[1]),
    index: match.index || 0,
  }));
  return headings.map((heading, index) => {
    const next = headings[index + 1]?.index ?? content.length;
    const rawAnswer = content.slice(heading.index, next).replace(/^##\s+.+$/m, "");
    const answer = cleanMarkdownText(rawAnswer);
    return {
      question: heading.title,
      answer,
    };
  }).filter((item) => item.question && item.answer);
}

function buildDocsFaqJsonLd(pageData: DocsPageData): JsonLdObject | null {
  const faqItems = extractDocsFaqItems(pageData.relativePath);
  if (!faqItems.length) {
    return null;
  }
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function extractDocsHeadings(relativePath: string) {
  const content = stripFrontmatter(readDocsMarkdown(relativePath));
  return [...content.matchAll(/^(#{2,3})\s+(.+)$/gm)]
    .map((match) => ({
      level: match[1].length,
      title: cleanMarkdownText(match[2]),
      slug: match[2]
        .trim()
        .toLowerCase()
        .replace(/[`*_~]/g, "")
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .replace(/\s+/g, "-"),
    }))
    .filter((heading) => heading.title && heading.slug);
}

function isDocsHowToPage(relativePath: string) {
  const normalized = relativePath.replace(/^en\//, "");
  return (
    /^(zh\/)?best-practices\//.test(normalized) ||
    /^(zh\/)?guide\/quickstart\.md$/.test(normalized) ||
    /^(zh\/)?guide\/studio\//.test(normalized)
  );
}

function buildDocsHowToJsonLd(pageData: DocsPageData): JsonLdObject | null {
  if (!isDocsHowToPage(pageData.relativePath)) {
    return null;
  }
  const title = docsPageTitle(pageData);
  const headers = ((pageData.headers || []).length
    ? pageData.headers || []
    : extractDocsHeadings(pageData.relativePath))
    .filter((header) => (header.level || 2) <= 3 && header.title && header.slug)
    .filter((header) => !/faq|常见问题|troubleshooting|故障排除/i.test(header.title || ""))
    .slice(0, 12);
  if (headers.length < 2) {
    return null;
  }
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description: pageData.description || pageData.frontmatter?.description || title,
    step: headers.map((header, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: header.title,
      url: `${docsCanonicalUrl(pageData.relativePath)}#${header.slug}`,
    })),
  };
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  description:
    "Get started with ZenMux quickly. Access our comprehensive developer documentation, guides, and API references to build and scale your applications with ZenMux",
  outDir: "../docs",
  base: "/",
  assetsDir: "docs",
  title: "ZenMux | Documentation",
  ignoreDeadLinks: true,

  transformHtml: (html) => {
    return html.replace(/href="\/vp-icons.css"/g, (_match, p1) => {
      return `href="/docs/vp-icons.css"`;
    });
  },

  sitemap: {
    hostname: "https://zenmux.ai",
    xmlns: {
      news: false,
      video: false,
      xhtml: true,
      image: false,
    },
    transformItems: (items) => {
      return items
        .map((item) => {
          const url = withDocsSitemapPath(item.url);
          const links = withXDefaultLink(
            item.links?.map((link) => ({
              ...link,
              url: withDocsSitemapPath(link.url),
            })),
          );
          return {
            ...item,
            url,
            links,
          };
        })
        .filter((item) => !isDeprecatedDocsSitemapUrl(item.url));
    },
  },

  transformHead: ({ pageData }) => {
    const docsPageData = pageData as DocsPageData;
    const jsonLdItems = [
      buildDocsBreadcrumbJsonLd(docsPageData),
      buildDocsFaqJsonLd(docsPageData),
      buildDocsHowToJsonLd(docsPageData),
    ].filter(Boolean) as JsonLdObject[];
    return [
      ["link", { rel: "canonical", href: docsCanonicalUrl(docsPageData.relativePath) }],
      ...jsonLdItems.map(buildJsonLdHead),
    ];
  },

  head: [
    ["link", { rel: "icon", href: "/docs/favicon.svg" }],
    [
      "script",
      {},
      `
      // 自动重定向：docs.zenmux.ai -> zenmux.ai/docs/
      if (window.location.hostname === 'docs.zenmux.ai') {
        const newUrl = 'https://zenmux.ai/docs' + window.location.pathname + window.location.search + window.location.hash;
        window.location.replace(newUrl);
      }
      `,
    ],
    [
      "script",
      {},
      `
      // 主题同步：从官网 zenmux-theme 同步到 VitePress
      (function() {
        var ZENMUX_KEY = 'zenmux-theme';
        var VP_KEY = 'vitepress-theme-appearance';

        function getSystemDark() {
          return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        function applyTheme(isDark) {
          var html = document.documentElement;
          if (isDark) {
            html.classList.add('dark');
          } else {
            html.classList.remove('dark');
          }
        }

        function syncFromZenmux() {
          var zenmuxTheme = localStorage.getItem(ZENMUX_KEY);
          if (!zenmuxTheme) return false;

          var isDark = false;
          var vpValue = 'auto';

          if (zenmuxTheme === 'Dark') {
            isDark = true;
            vpValue = 'dark';
          } else if (zenmuxTheme === 'Light') {
            isDark = false;
            vpValue = 'light';
          } else if (zenmuxTheme === 'System') {
            isDark = getSystemDark();
            vpValue = 'auto';
          }

          localStorage.setItem(VP_KEY, vpValue);
          applyTheme(isDark);
          return true;
        }

        // 立即同步主题
        syncFromZenmux();

        // 监听 storage 事件（其他标签页的主题变化）
        window.addEventListener('storage', function(e) {
          if (e.key === ZENMUX_KEY) {
            syncFromZenmux();
          }
        });

        // 监听系统主题变化（当使用 System 模式时）
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
          var zenmuxTheme = localStorage.getItem(ZENMUX_KEY);
          if (zenmuxTheme === 'System') {
            applyTheme(getSystemDark());
          }
        });
      })();
      `,
    ],
    [
      "script",
      {
        async: "true",
        src: "https://www.googletagmanager.com/gtag/js?id=G-6FF0RJ6DGB",
      },
    ],
    [
      "script",
      {},
      `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
  
      gtag('config', location.hostname.startsWith('docs.') ? 'G-6FF0RJ6DGB' : 'G-PV8J0P36S8');
      `,
    ],
  ],

  vite: {
    server: {
      host: "127.0.0.1",
      proxy: {
        '/api/docs': {
          target: 'https://pre.zenmux.ai',
          changeOrigin: true,
          secure: true,
        },
      },
    },
    plugins: [
      docsIndexPlugin({ docsRoot: basePath }),
      groupIconVitePlugin({
        customIcon: {
          python: "vscode-icons:file-type-python",
          javascript: "vscode-icons:file-type-js",
          typescript: "vscode-icons:file-type-typescript",
          vue: "vscode-icons:file-type-vue",
          html: "vscode-icons:file-type-html",
          css: "vscode-icons:file-type-css",
          json: "vscode-icons:file-type-json",
          markdown: "vscode-icons:file-type-markdown",
          c: "vscode-icons:file-type-c",
          cpp: "vscode-icons:file-type-cpp",
          java: "vscode-icons:file-type-java",
          go: "vscode-icons:file-type-go",
          ruby: "vscode-icons:file-type-ruby",
          php: "vscode-icons:file-type-php",
          shell: "vscode-icons:file-type-shell",
          bash: "vscode-icons:file-type-shell",
          sql: "vscode-icons:file-type-sql",
          xml: "vscode-icons:file-type-xml",
          yaml: "vscode-icons:file-type-yaml",
          dockerfile: "vscode-icons:file-type-docker",
          kotlin: "vscode-icons:file-type-kotlin",
          swift: "vscode-icons:file-type-swift",
          rust: "vscode-icons:file-type-rust",
          scala: "vscode-icons:file-type-scala",
          perl: "vscode-icons:file-type-perl",
          haskell: "vscode-icons:file-type-haskell",
          elixir: "vscode-icons:file-type-elixir",
          lua: "vscode-icons:file-type-lua",
          r: "vscode-icons:file-type-r",
          matlab: "vscode-icons:file-type-matlab",
          powershell: "vscode-icons:file-type-powershell",
          typescriptreact: "vscode-icons:file-type-tsx",
          javascriptreact: "vscode-icons:file-type-js",
          vuejs: "vscode-icons:file-type-vue",
          svelte: "vscode-icons:file-type-svelte",
          json5: "vscode-icons:file-type-json",
          jsonc: "vscode-icons:file-type-json",
          graphql: "vscode-icons:file-type-graphql",
          markdownlint: "vscode-icons:file-type-markdown",
          vuepress: "vscode-icons:file-type-vue",
          nuxt: "vscode-icons:file-type-nuxt",
          nextjs: "vscode-icons:file-type-nextjs",
          astro: "vscode-icons:file-type-astro",
        },
      }),
    ],
  },

  rewrites: {
    "en/:rest*": ":rest*",
  },

  markdown: {
    config(md) {
      md.use(container, "api-request", {
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            let tabs = "";
            let checked = "checked";
            const info = tokens[idx].info
              .trim()
              .slice("api-request".length)
              .trim();

            for (
              let i = idx + 1;
              !(
                tokens[i].nesting === -1 &&
                tokens[i].type === "container_api-request_close"
              );
              ++i
            ) {
              const isHtml = tokens[i].type === "html_block";

              if (
                (tokens[i].type === "fence" && tokens[i].tag === "code") ||
                isHtml
              ) {
                const title = extractTitle(
                  isHtml ? tokens[i].content : tokens[i].info,
                  isHtml,
                );

                if (title) {
                  const tabTitle = parseCodeTabTitle(title);
                  const tabLabel = md.utils.escapeHtml(tabTitle.label || title);

                  tabs += `<input type="radio" name="group-${idx}" id="tab-${i}" ${checked}><label data-title="${md.utils.escapeHtml(
                    tabTitle.label || title,
                  )}" data-description="${md.utils.escapeHtml(
                    tabTitle.description,
                  )}" for="tab-${i}">${tabLabel}</label>`;

                  if (checked && !isHtml) tokens[i].info += " active";
                  checked = "";
                }
              }
            }

            return `<div class="vp-code-group api-request" data-info="${info}"><div class="tabs">${tabs}</div><div class="blocks">\n`;
          }
          return `</div></div>\n`;
        },
      });

      md.use(container, "api-response", {
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            let tabs = "";
            let checked = "checked";
            const info =
              tokens[idx].info.trim().slice("api-response".length).trim() ||
              "Response";

            for (
              let i = idx + 1;
              !(
                tokens[i].nesting === -1 &&
                tokens[i].type === "container_api-response_close"
              );
              ++i
            ) {
              const isHtml = tokens[i].type === "html_block";

              if (
                (tokens[i].type === "fence" && tokens[i].tag === "code") ||
                isHtml
              ) {
                const title = extractTitle(
                  isHtml ? tokens[i].content : tokens[i].info,
                  isHtml,
                );

                if (title) {
                  const tabTitle = parseCodeTabTitle(title);
                  const tabLabel = md.utils.escapeHtml(tabTitle.label || title);

                  tabs += `<input type="radio" name="group-${idx}" id="tab-${i}" ${checked}><label data-title="${md.utils.escapeHtml(
                    tabTitle.label || title,
                  )}" data-description="${md.utils.escapeHtml(
                    tabTitle.description,
                  )}" for="tab-${i}">${tabLabel}</label>`;

                  if (checked && !isHtml) tokens[i].info += " active";
                  checked = "";
                }
              }
            }

            return `<div class="vp-code-group api-response" data-info="${info}"><div class="tabs">${tabs}</div><div class="blocks">\n`;
          }
          return `</div></div>\n`;
        },
      });
    },
  },

  transformPageData(pageData, ctx) {
    if (pageData.frontmatter.pageClass === "api-page") {
      pageData.frontmatter.aside = false;
    }
  },

  themeConfig: {
    logo: {
      light: "/docs/logo-text-dark.svg",
      dark: "/docs/logo-text-light.svg",
      alt: "ZenMux Logo",
    },
    siteTitle: false,
    search: { provider: "local" },
    logoLink: "https://zenmux.ai",
  },

  // locales: English (root) and Simplified Chinese (zh)
  locales: locales,
});
