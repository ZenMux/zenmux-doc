// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import { inBrowser, type Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import 'virtual:group-icons.css';
import 'element-plus/theme-chalk/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import Select from './select.vue';
import Login from './login.vue';
import ApiContainer from './api-container.vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import './style.css';
import './custom.css';

NProgress.configure({
  showSpinner: false,
  speed: 500,
  minimum: 0.3,
});

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    NProgress.start();
  });
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'doc-top': () => h(ApiContainer),
      'doc-before': () => h(Select),
      'nav-bar-content-after': () => h(Login),
    });
  },
  enhanceApp({ app, router, siteData }) {
    const originGo = router.go;
    router.go = async (href: string = inBrowser ? location.href : '/') => {
      if (inBrowser) {
        if (href.startsWith('https:')) {
          const url = new URL(href);
          if (url.pathname.startsWith('/docs/')) {
            url.pathname = url.pathname.replace('/docs/', '/');
            href = url.toString();
          }
        }
      }
      const ret = await originGo.call(router, href);
      if (inBrowser) {
        if (location.pathname !== '/docs') {
          if (!location.hostname.startsWith('docs.') && !location.pathname.startsWith('/docs/')) {
            history.replaceState({}, '', '/docs' + location.pathname);
          }
        }
      }
      return ret;
    };
    if (inBrowser) {
      router.onAfterRouteChange = (to) => {
        if (location.pathname === '/docs') {
          return;
        }
        if (!location.hostname.startsWith('docs.') && !location.pathname.startsWith('/docs/')) {
          history.replaceState({}, '', '/docs' + location.pathname);
        }
      };

      if (!location.hostname.startsWith('docs.')) {
        router.onAfterPageLoad = () => {
          document.querySelectorAll('a').forEach((a) => {
            const href = a.getAttribute('href');
            if (href?.startsWith('/') && !href.startsWith('/docs/')) {
              a.setAttribute('href', '/docs' + href);
            }
          });
        };
        window.addEventListener('load', () => {
          document.querySelectorAll('a').forEach((a) => {
            const href = a.getAttribute('href');
            if (href?.startsWith('/') && !href.startsWith('/docs/')) {
              a.setAttribute('href', '/docs' + href);
            }
          });
        });
        document.querySelectorAll('a').forEach((a) => {
          const href = a.getAttribute('href');
          if (href?.startsWith('/') && !href.startsWith('/docs/')) {
            a.setAttribute('href', '/docs' + href);
          }
        });
      }
    }
    // ...
    // app.use(ElementPlus);11
    app.component('Login', Login);
    app.component('Copy', Select);
  },
} satisfies Theme;
