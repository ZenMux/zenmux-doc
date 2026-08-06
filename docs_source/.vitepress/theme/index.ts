// https://vitepress.dev/guide/custom-theme
import {
  h,
  defineAsyncComponent,
  defineComponent,
  ref,
  onMounted,
  nextTick,
} from "vue";
import { inBrowser, type Theme } from "vitepress";

const ClientOnly = defineComponent({
  setup(_, { slots }) {
    const mounted = ref(false);
    onMounted(() => { mounted.value = true; });
    return () => mounted.value ? slots.default?.() : null;
  },
});
import DefaultTheme from "vitepress/theme";
import "virtual:group-icons.css";
import Select from "./select.vue";
import ApiContainerLoader from "./api-container-loader.vue";
import DocTabs from "./doc-tabs.vue";
import Breadcrumb from "./breadcrumb.vue";
import ContactCards from "./contact-cards.vue";
import ContactCard from "./contact-card.vue";
import Accordion from "./accordion.vue";
import AccordionItem from "./accordion-item.vue";
import AsideActions from "./aside-actions.vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "./style.css";
import "./custom.css";

const Login = defineAsyncComponent(() => import("./login.vue"));
const EndpointDrawer = defineAsyncComponent(
  () => import("./endpoint-drawer.vue"),
);
const AiAssistant = defineAsyncComponent(() => import("./ai-assistant.vue"));

declare global {
  interface Window {
    __VP_HASH_MAP__?: Record<string, string>;
    __ZENMUX_OUTLINE_VISIBILITY_OBSERVER__?: MutationObserver;
  }
}

const DOCS_PATH_PREFIX = "/docs";
// 必须与 config.mts 的 assetsDir 保持一致，否则页面 chunk 的 prefetch 全部 404
const DOCS_ASSETS_DIR = "assets";
const prefetchedPageChunks = new Set<string>();

const isDocsHost =
  inBrowser &&
  (location.hostname.startsWith("docs.") ||
    location.hostname.startsWith("localhost") ||
    location.hostname.startsWith("127.0.0.1"));

// Capture ?endpoints=open at module level before VitePress router normalizes the URL
const shouldOpenEndpoints =
  inBrowser &&
  new URLSearchParams(window.location.search).get("endpoints") === "open";

function getDocsLocale(value: string | null) {
  if (!value) {
    return null;
  }
  return value.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function getDocsPathWithoutLocale(pathname: string) {
  const withoutDocs = stripDocsPrefix(pathname);
  return withoutDocs.replace(/^\/zh(?=\/|$)/, "") || "/";
}

function getPathWithDocsLocale(pathname: string, locale: "en" | "zh") {
  const docsPath = getDocsPathWithoutLocale(pathname);
  const localizedPath = locale === "zh" ? `/zh${docsPath}` : docsPath;

  return pathname.startsWith(DOCS_PATH_PREFIX)
    ? `${DOCS_PATH_PREFIX}${localizedPath}`
    : localizedPath;
}

function syncDocsLocaleCookie(locale: "en" | "zh") {
  document.cookie = `locale=${locale === "zh" ? "zh-CN" : "en-US"}; path=/; max-age=31536000`;
}

function syncDocsLocaleFromPath(pathname: string) {
  const currentDocsPath = stripDocsPrefix(pathname);
  syncDocsLocaleCookie(/^\/zh(?=\/|$)/.test(currentDocsPath) ? "zh" : "en");
}

function syncDocsLocaleFromHref(href: string | null) {
  if (!href) {
    return;
  }

  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) {
      return;
    }
    syncDocsLocaleFromPath(url.pathname);
  } catch {
    return;
  }
}

function applyRequestedDocsLocale() {
  if (!inBrowser) {
    return;
  }

  const url = new URL(window.location.href);
  const currentDocsPath = stripDocsPrefix(url.pathname);
  const currentLocale = /^\/zh(?=\/|$)/.test(currentDocsPath) ? "zh" : "en";
  const requestedLocale =
    getDocsLocale(url.searchParams.get("locale")) ||
    getDocsLocale(url.searchParams.get("lang"));

  // An explicit docs URL is authoritative so shared links always open in the
  // language encoded by their path. Query parameters remain an opt-in way for
  // the main site to request a different locale.
  if (!requestedLocale || requestedLocale === currentLocale) {
    url.searchParams.delete("locale");
    url.searchParams.delete("lang");
    syncDocsLocaleCookie(currentLocale);
    if (url.toString() !== window.location.href) {
      window.history.replaceState({}, document.title, url.toString());
    }
    return;
  }

  url.searchParams.delete("locale");
  url.searchParams.delete("lang");
  url.pathname = getPathWithDocsLocale(url.pathname, requestedLocale);
  syncDocsLocaleCookie(requestedLocale);

  if (url.pathname !== window.location.pathname) {
    window.location.replace(url.toString());
    return;
  }

  window.history.replaceState({}, document.title, url.toString());
}

if (shouldOpenEndpoints) {
  const params = new URLSearchParams(window.location.search);
  params.delete("endpoints");
  const newUrl = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  window.history.replaceState({}, document.title, newUrl);
}

console.info("isDocsHost:", isDocsHost);
applyRequestedDocsLocale();

NProgress.configure({
  showSpinner: false,
  speed: 500,
  minimum: 0.3,
});

function stripDocsPrefix(pathname: string) {
  if (pathname === DOCS_PATH_PREFIX) {
    return "/";
  }
  if (pathname.startsWith(`${DOCS_PATH_PREFIX}/`)) {
    return pathname.slice(DOCS_PATH_PREFIX.length);
  }
  return pathname;
}

function normalizeDocsPathname(pathname: string) {
  const normalized = stripDocsPrefix(pathname).replace(/\/index\.html$/, "/");
  return normalized.replace(/\.html$/, "").replace(/\/$/, "") || "/";
}

function isSameDocsPage(a: URL, b: URL) {
  return normalizeDocsPathname(a.pathname) === normalizeDocsPathname(b.pathname);
}

function getPageChunkPath(href: string, siteBase: string) {
  if (!inBrowser || !window.__VP_HASH_MAP__) {
    return null;
  }

  const url = new URL(href, location.href);
  if (url.origin !== location.origin || url.pathname === location.pathname) {
    return null;
  }

  const extMatch = url.pathname.match(/\.\w+$/);
  if (extMatch && extMatch[0] !== ".html") {
    return null;
  }

  let pagePath = stripDocsPrefix(url.pathname).replace(/\.html$/, "");
  try {
    pagePath = decodeURIComponent(pagePath);
  } catch {
    return null;
  }
  pagePath = pagePath.replace(/\/$/, "/index");

  let pageFile = (pagePath.replace(/^\//, "").replace(/\//g, "_") || "index") + ".md";
  let pageHash = window.__VP_HASH_MAP__[pageFile.toLowerCase()];
  if (!pageHash) {
    pageFile = pageFile.endsWith("_index.md")
      ? pageFile.slice(0, -9) + ".md"
      : pageFile.slice(0, -3) + "_index.md";
    pageHash = window.__VP_HASH_MAP__[pageFile.toLowerCase()];
  }
  if (!pageHash) {
    return null;
  }

  return `${siteBase}${DOCS_ASSETS_DIR}/${pageFile}.${pageHash}.js`;
}

function prefetchPageChunk(href: string, siteBase: string) {
  const chunkPath = getPageChunkPath(href, siteBase);
  if (!chunkPath || prefetchedPageChunks.has(chunkPath)) {
    return;
  }

  prefetchedPageChunks.add(chunkPath);
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "script";
  link.href = chunkPath;
  document.head.appendChild(link);
}

function prefetchLinksInside(root: ParentNode | null, siteBase: string) {
  root?.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((anchor) => {
    prefetchPageChunk(anchor.href, siteBase);
  });
}

function rewriteDocsLinks() {
  // base:"/docs/" 后 VitePress 已原生生成带 /docs 前缀的站内链接，无需再在运行时
  // 逐个补前缀。旧逻辑会把指向主站的相对链接（如 /models）误改成 /docs/models，
  // 且服务端 HTML 依赖它才正确 = 正是本次要根治的 SEO 病因。仅保留 logo 指回主站。
  updateLogoLink();
}

const updateLogoLink = () => {
  const logoLink = document.querySelector(
    ".VPNavBarTitle a"
  ) as HTMLAnchorElement | null;
  if (logoLink) {
    logoLink.setAttribute("href", "https://zenmux.ai/");
    logoLink.setAttribute("target", "_self");
    logoLink.setAttribute("rel", "noopener");
  }
};

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    NProgress.start();
  });

  // 双向主题同步：监听 VitePress 主题切换，同步到官网的 zenmux-theme
  const ZENMUX_KEY = "zenmux-theme";
  const VP_KEY = "vitepress-theme-appearance";

  const syncToZenmux = () => {
    const vpTheme = localStorage.getItem(VP_KEY);
    const isDark = document.documentElement.classList.contains("dark");

    let zenmuxValue: string;
    if (vpTheme === "auto") {
      zenmuxValue = "System";
    } else if (isDark) {
      zenmuxValue = "Dark";
    } else {
      zenmuxValue = "Light";
    }

    localStorage.setItem(ZENMUX_KEY, zenmuxValue);
  };

  // 监听 html class 变化（VitePress 切换主题时会修改 dark class）
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        syncToZenmux();
        break;
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      "layout-top": () => h(ClientOnly, null, { default: () => h(DocTabs) }),
      "doc-top": () => h(ClientOnly, null, { default: () => h(ApiContainerLoader) }),
      "doc-before": () => h(ClientOnly, null, { default: () => [h(Breadcrumb), h(Select)] }),
      "aside-bottom": () => h(ClientOnly, null, { default: () => h(AsideActions) }),
      "nav-bar-content-before": () => h(ClientOnly, null, { default: () => h(AiAssistant) }),
      "nav-bar-content-after": () => h(ClientOnly, null, { default: () => [h(Login), h(EndpointDrawer)] }),
    });
  },
  enhanceApp({ app, router, siteData }) {
    const originGo = router.go;
    const siteBase = siteData.value.base || "/";
    // 注：base 已改为 "/docs/"，VitePress 原生按 /docs 前缀生成链接与 history，
    // 因此不再需要旧的 history.pushState 补 /docs 前缀 hack（已删除）。

    router.go = async (href: string = inBrowser ? location.href : "/") => {
      let shouldShowProgress = false;
      if (inBrowser) {
        const currentUrl = new URL(location.href);
        const targetUrl = new URL(href, location.href);
        shouldShowProgress =
          targetUrl.origin === currentUrl.origin &&
          !isSameDocsPage(targetUrl, currentUrl);
        if (shouldShowProgress) {
          prefetchPageChunk(targetUrl.href, siteBase);
          NProgress.start();
        }

        // base:"/docs/" 后 VitePress router 期望的就是带 /docs 前缀的路径，
        // 旧逻辑在此把 /docs/ 剥成 / 会让 router 匹配不到 → URL 被重置 + 404。
      }
      try {
        return await originGo.call(router, href);
      } finally {
        if (shouldShowProgress) {
          NProgress.done();
        }
      }
    };
    if (inBrowser) {
      // Sidebar tooltip for truncated text
      const tooltip = document.createElement('div');
      tooltip.className = 'sidebar-tooltip';
      document.body.appendChild(tooltip);
      let tooltipTimer: ReturnType<typeof setTimeout> | null = null;

      const showTooltip = (el: HTMLElement) => {
        if (el.scrollWidth <= el.clientWidth) return;
        tooltip.textContent = el.textContent || '';
        const rect = el.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 6) + 'px';
        tooltip.classList.add('visible');
      };

      const hideTooltip = () => {
        tooltip.classList.remove('visible');
      };

      document.addEventListener('mouseover', (e) => {
        const text = (e.target as HTMLElement).closest?.('.VPSidebarItem .item .text') as HTMLElement | null;
        if (!text) return;
        if (tooltipTimer) clearTimeout(tooltipTimer);
        tooltipTimer = setTimeout(() => showTooltip(text), 300);
      });

      document.addEventListener('mouseout', (e) => {
        const text = (e.target as HTMLElement).closest?.('.VPSidebarItem .item .text');
        if (!text) return;
        if (tooltipTimer) { clearTimeout(tooltipTimer); tooltipTimer = null; }
        hideTooltip();
      });

      // Keep the active table-of-contents link inside the independently
      // scrollable outline viewport.
      const keepActiveOutlineLinkVisible = (link: HTMLElement) => {
        const content = link.closest(
          ".VPDocAsideOutline .content",
        ) as HTMLElement | null;
        if (!content || content.scrollHeight <= content.clientHeight) return;

        const contentRect = content.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        const visibleTop = contentRect.top + 16;
        const visibleBottom = contentRect.bottom - 64;
        let nextScrollTop = content.scrollTop;

        if (linkRect.top < visibleTop) {
          nextScrollTop += linkRect.top - visibleTop;
        } else if (linkRect.bottom > visibleBottom) {
          nextScrollTop += linkRect.bottom - visibleBottom;
        } else {
          return;
        }

        content.scrollTo({
          top: Math.max(
            0,
            Math.min(
              nextScrollTop,
              content.scrollHeight - content.clientHeight,
            ),
          ),
          behavior: "smooth",
        });
      };

      window.__ZENMUX_OUTLINE_VISIBILITY_OBSERVER__?.disconnect();
      const outlineVisibilityObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          const target = mutation.target;
          if (
            target instanceof HTMLElement &&
            target.matches(".VPDocOutlineItem .outline-link.active")
          ) {
            requestAnimationFrame(() => keepActiveOutlineLinkVisible(target));
            return;
          }
        }
      });
      outlineVisibilityObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
        subtree: true,
      });
      window.__ZENMUX_OUTLINE_VISIBILITY_OBSERVER__ =
        outlineVisibilityObserver;

      const prefetchFromEventTarget = (target: EventTarget | null) => {
        if (!(target instanceof HTMLElement)) return;

        const anchor = target.closest("a") as HTMLAnchorElement | null;
        if (anchor) {
          prefetchPageChunk(anchor.href, siteBase);
        }

        const sidebarSection = target.closest(
          ".VPSidebarItem.collapsible"
        ) as HTMLElement | null;
        if (sidebarSection) {
          prefetchLinksInside(sidebarSection, siteBase);
        }
      };

      document.addEventListener("pointerover", (e) => {
        prefetchFromEventTarget(e.target);
      }, { capture: true, passive: true });
      document.addEventListener("focusin", (e) => {
        prefetchFromEventTarget(e.target);
      }, true);
      document.addEventListener("touchstart", (e) => {
        prefetchFromEventTarget(e.target);
      }, { capture: true, passive: true });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          prefetchFromEventTarget(e.target);
        }
      }, true);

      // Auto-open endpoints drawer if ?endpoints=open was in the initial URL
      if (shouldOpenEndpoints) {
        setTimeout(() => {
          document.dispatchEvent(new CustomEvent("endpoints"));
        }, 100);
      }

      // Use event delegation to capture clicks on "Endpoints" nav item
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a');
        if (anchor?.closest('.VPNavBarTranslations, .VPNavBarExtra')) {
          syncDocsLocaleFromHref(anchor.getAttribute('href'));
        }
        const label = anchor?.textContent?.trim();
        if (anchor && (label === 'Endpoints' || label === '接入点')) {
          e.preventDefault();
          e.stopPropagation();
          document.dispatchEvent(new CustomEvent('endpoints'));
        }
      }, true);

      // Header anchor: copy link on click instead of navigating
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a.header-anchor');
        if (!anchor) return;
        e.preventDefault();
        const href = anchor.getAttribute('href') || '';
        const url = location.origin + location.pathname + href;
        navigator.clipboard.writeText(url).then(() => {
          anchor.classList.add('copied');
          setTimeout(() => anchor.classList.remove('copied'), 1500);
        });
      });

      console.info("isDocsHost:", isDocsHost);
      updateLogoLink();
      if (!isDocsHost) {
        const originAfterRouteChange = router.onAfterRouteChange;
        router.onAfterRouteChange = async (to) => {
          await originAfterRouteChange?.(to);
          // VitePress calls onAfterPageLoad before replacing the route
          // component. Wait until the new sidebar/content has rendered before
          // adding the production /docs prefix to newly-created links.
          await nextTick();
          rewriteDocsLinks();
        };
        window.addEventListener("load", () => {
          rewriteDocsLinks();
        });
        rewriteDocsLinks();
      }
    }
    // ...
    // app.use(ElementPlus);11
    app.component("Login", Login);
    app.component("Copy", Select);
    app.component("ContactCards", ContactCards);
    app.component("ContactCard", ContactCard);
    app.component("Accordion", Accordion);
    app.component("AccordionItem", AccordionItem);
  },
} satisfies Theme;
