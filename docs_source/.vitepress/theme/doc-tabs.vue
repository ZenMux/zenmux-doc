<template>
  <nav :class="['doc-tabs-bar', `doc-tabs-${variant}`]">
    <div class="doc-tabs-content">
      <a
        v-for="tab in tabs"
        :key="tab.text"
        :href="withBase(tab.link)"
        :class="['doc-tab-item', { active: tab.active }]"
        @click.prevent="navigate(tab.link)"
        >{{ variant === "sidebar" ? tab.sidebarText || tab.text : tab.text }}</a
      >
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useData, useRouter, withBase } from "vitepress";

withDefaults(
  defineProps<{
    variant?: "bar" | "sidebar";
  }>(),
  {
    variant: "bar",
  },
);

const router = useRouter();
function navigate(href: string) {
  // base:"/docs/" 后 router.go / 渲染的 href 都必须含 base 前缀，
  // 否则 VitePress 的 pathToFile 会错误地 slice(base.length) → 404。
  router.go(withBase(href));
}

const { page, localeIndex } = useData();

const tabs = computed(() => {
  const isZh = localeIndex.value === "zh";
  // 用 relativePath 派生 base 无关路径。route.path 在浏览器里含 /docs 前缀，
  // 会让下面的 startsWith 段匹配失效；relativePath 不含 base、保留 zh/（en 已被 rewrite 去掉）。
  const path =
    "/" + page.value.relativePath.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, "");
  const prefix = isZh ? "/zh" : "";

  const isApiPage = path.startsWith(`${prefix}/api/`);
  const isIntegrationsPage = path.startsWith(`${prefix}/best-practices/`);
  const isDocsPage = !isApiPage && !isIntegrationsPage;

  return [
    {
      text: isZh ? "文档" : "Docs",
      sidebarText: "",
      link: `${prefix}/guide/quickstart`,
      active: isDocsPage,
    },
    {
      text: "API Reference",
      sidebarText: "API reference",
      link: `${prefix}/api/openai/create-chat-completion`,
      active: isApiPage,
    },
    {
      text: isZh ? "集成" : "Integrations",
      sidebarText: "",
      link: `${prefix}/best-practices/claude-code`,
      active: isIntegrationsPage,
    },
  ];
});
</script>

<style scoped>
.doc-tabs-bar {
  position: fixed;
  top: var(--vp-nav-height);
  left: 0;
  right: 0;
  height: var(--zenmux-doc-tabs-height, 48px);
  background-color: var(--vp-c-bg);
  border-bottom: 0.5px solid var(--vp-c-divider);
  z-index: 25;
  display: none;
  align-items: center;
}

.doc-tabs-sidebar {
  position: static;
  display: none;
  width: 100%;
  height: 46px;
  margin-bottom: 28px;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.doc-tabs-sidebar .doc-tabs-content {
  gap: 16px;
  padding: 0;
}

.doc-tabs-sidebar .doc-tab-item {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 46px;
  padding: 12px 0;
  overflow: hidden;
  border: 0;
  border-radius: 0;
  color: rgb(102 102 102 / 88%);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-overflow: ellipsis;
}

.doc-tabs-sidebar .doc-tab-item.active {
  border-bottom: 2px solid var(--zm-text-primary);
  color: var(--zm-text-primary);
  font-weight: 700;
  background: transparent;
  box-shadow: none;
}

@media (max-width: 959px) {
  .doc-tabs-sidebar {
    display: flex;
  }
}

@media (min-width: 960px) {
  .doc-tabs-bar:not(.doc-tabs-sidebar) {
    display: flex;
  }
}

.doc-tabs-content {
  display: flex;
  align-items: center;
  gap: 32px;
  width: 100%;
  padding: 0 174px;
  height: 100%;
}

@media (max-width: 1519px) {
  .doc-tabs-content {
    padding-left: 20px;
  }
}

.doc-tab-item {
  font-size: 14px;
  font-weight: 400;
  color: var(--vp-c-text-2);
  text-decoration: none;
  line-height: var(--zenmux-doc-tabs-height, 48px);
  transition: color 0.25s;
  white-space: nowrap;
}

.doc-tab-item:hover {
  color: var(--vp-c-text-1);
}

.doc-tab-item.active {
  color: var(--vp-c-text-1);
  font-weight: 700;
  border-bottom: 2px solid var(--vp-c-text-1);
}
</style>
