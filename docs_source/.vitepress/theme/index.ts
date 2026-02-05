// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import { inBrowser, type Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "virtual:group-icons.css";
import "element-plus/theme-chalk/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import Select from "./select.vue";
import Login from "./login.vue";
import ApiContainer from "./api-container.vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "./style.css";
import "./custom.css";

const isDocsHost =
  inBrowser &&
  (location.hostname.startsWith("docs.") ||
    location.hostname.startsWith("localhost") ||
    location.hostname.startsWith("127.0.0.1"));

console.info("isDocsHost:", isDocsHost);

NProgress.configure({
  showSpinner: false,
  speed: 500,
  minimum: 0.3,
});

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
      "doc-top": () => h(ApiContainer),
      "doc-before": () => h(Select),
      "nav-bar-content-after": () => h(Login),
    });
  },
  enhanceApp({ app, router, siteData }) {
    const originGo = router.go;
    if (inBrowser) {
      if (!isDocsHost) {
        const originPushState = history.pushState;
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
          }
          return originPushState.call(this, data, title, url);
        };
      }
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
    router.go = async (href: string = inBrowser ? location.href : "/") => {
      if (inBrowser) {
        if (href.startsWith("https:")) {
          const url = new URL(href);
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
      const ret = await originGo.call(router, href);
      return ret;
    };
    if (inBrowser) {
      console.info("isDocsHost:", isDocsHost);
      updateLogoLink();
      if (!isDocsHost) {
        router.onAfterPageLoad = () => {
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
        };
        window.addEventListener("load", () => {
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
        });
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
    }
    // ...
    // app.use(ElementPlus);11
    app.component("Login", Login);
    app.component("Copy", Select);
  },
} satisfies Theme;
