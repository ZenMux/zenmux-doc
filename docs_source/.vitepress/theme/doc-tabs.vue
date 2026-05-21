<template>
  <nav class="doc-tabs-bar">
    <div class="doc-tabs-content">
      <a
        v-for="tab in tabs"
        :key="tab.text"
        :href="tab.link"
        :class="['doc-tab-item', { active: tab.active }]"
        @click.prevent="navigate(tab.link)"
        >{{ tab.text }}</a
      >
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useData, useRoute, useRouter } from "vitepress";

const router = useRouter();
function navigate(href: string) {
  router.go(href);
}

const { localeIndex } = useData();
const route = useRoute();

const tabs = computed(() => {
  const isZh = localeIndex.value === "zh";
  const path = route.path;
  const prefix = isZh ? "/zh" : "";

  const isApiPage = path.startsWith(`${prefix}/api/`);
  const isIntegrationsPage = path.startsWith(`${prefix}/best-practices/`);
  const isDocsPage = !isApiPage && !isIntegrationsPage;

  return [
    {
      text: isZh ? "文档" : "Docs",
      link: `${prefix}/guide/quickstart`,
      active: isDocsPage,
    },
    {
      text: "API reference",
      link: `${prefix}/api/openai/create-chat-completion`,
      active: isApiPage,
    },
    {
      text: isZh ? "集成" : "Integrations",
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
  border-bottom: 1px solid var(--vp-c-divider);
  z-index: 25;
  display: none;
  align-items: center;
}

@media (min-width: 960px) {
  .doc-tabs-bar {
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
    padding: 0 20px 0 calc(var(--vp-sidebar-width, 210px) + 24px);
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
  font-weight: 600;
}
</style>
