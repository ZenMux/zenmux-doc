// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import 'virtual:group-icons.css'
import 'element-plus/theme-chalk/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import Select from './select.vue'
import Login from './login.vue'
import ApiRequest from './api-request.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'doc-top': () => h(ApiRequest),
      'nav-bar-content-after': () => h(Login),
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    // app.use(ElementPlus);11
    app.component('Login', Login)
    app.component('Copy', Select)
  }
} satisfies Theme
