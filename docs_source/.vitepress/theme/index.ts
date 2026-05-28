// https://vitepress.dev/guide/custom-theme
import { h, defineComponent, ref, onMounted } from "vue";
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
import "element-plus/theme-chalk/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import Select from "./select.vue";
import Login from "./login.vue";
import ApiContainer from "./api-container.vue";
import EndpointDrawer from "./endpoint-drawer.vue";
import AiAssistant from "./ai-assistant.vue";
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

declare global {
  interface Window {
    __VP_HASH_MAP__?: Record<string, string>;
  }
}

const DOCS_PATH_PREFIX = "/docs";
const DOCS_ASSETS_DIR = "docs";
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

if (shouldOpenEndpoints) {
  const params = new URLSearchParams(window.location.search);
  params.delete("endpoints");
  const newUrl = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  window.history.replaceState({}, document.title, newUrl);
}

console.info("isDocsHost:", isDocsHost);

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
  updateLogoLink();
  document.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href?.startsWith("#") || href?.startsWith("http")) {
      return;
    }
    if (href?.startsWith("/") && !href.startsWith("/docs/")) {
      a.setAttribute("href", "/docs" + href);
    }
  });
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
      "doc-top": () => h(ClientOnly, null, { default: () => h(ApiContainer) }),
      "doc-before": () => h(ClientOnly, null, { default: () => [h(Breadcrumb), h(Select)] }),
      "aside-bottom": () => h(ClientOnly, null, { default: () => h(AsideActions) }),
      "nav-bar-content-before": () => h(ClientOnly, null, { default: () => h(AiAssistant) }),
      "nav-bar-content-after": () => h(ClientOnly, null, { default: () => [h(Login), h(EndpointDrawer)] }),
    });
  },
  enhanceApp({ app, router, siteData }) {
    const originGo = router.go;
    const siteBase = siteData.value.base || "/";
    if (inBrowser) {
      if (!isDocsHost) {
        const originPushState = history.pushState;
        const originReplaceState = history.replaceState;
        history.pushState = function (data, title, url) {
          if (inBrowser) {
            // @ts-expect-error not error
            if (url && url.startsWith("https:")) {
              return originPushState.call(this, data, title, url);
            }
            const urlObj = new URL(url as string, location.href);
            if (!urlObj.pathname.startsWith("/docs")) {
              urlObj.pathname = "/docs" + urlObj.pathname;
              url = urlObj.toString();
            }
            // If the resulting path matches the current path (e.g. during
            // VitePress hydration), use replaceState instead of pushState
            // to avoid creating a duplicate history entry.
            if (urlObj.pathname === location.pathname) {
              return originReplaceState.call(this, data, title, url);
            }
          }
          return originPushState.call(this, data, title, url);
        };
      }
    }

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

        const url = new URL(href, location.href);
        if (url.origin === currentUrl.origin) {
          if (url.pathname.startsWith("/docs/")) {
            url.pathname = url.pathname.replace("/docs/", "/");
            href = url.toString();
          }
          if (url.pathname === "/docs") {
            url.pathname = "/";
            href = url.toString();
          }
        }
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
        if (anchor && anchor.textContent?.trim() === 'Endpoints') {
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
        router.onAfterPageLoad = () => {
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
