<template>
  <nav v-if="crumbs.length > 1" class="breadcrumb">
    <button
      type="button"
      class="breadcrumb-menu-button"
      :aria-label="sidebarMenuLabel"
      :aria-expanded="isSidebarOpen"
      aria-controls="VPSidebarNav"
      @click="openSidebar"
    >
      <IconCategory class="breadcrumb-category-icon" aria-hidden="true" />
    </button>
    <span v-for="(crumb, i) in crumbs" :key="i" class="breadcrumb-item">
      <span v-if="i > 0" class="breadcrumb-sep"> &rsaquo; </span>
      <a v-if="crumb.link && i < crumbs.length - 1" :href="withBase(crumb.link)">{{
        crumb.text
      }}</a>
      <span v-else>{{ crumb.text }}</span>
    </span>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useData, withBase, type DefaultTheme } from "vitepress";
import IconCategory from "./icons/IconCategory.vue";

const { page, localeIndex, theme } = useData();
const isSidebarOpen = ref(false);
let sidebarTrigger: HTMLButtonElement | null = null;
let sidebarStateObserver: MutationObserver | null = null;

const sidebarMenuLabel = computed(() =>
  localeIndex.value === "zh" ? "打开文档目录" : "Open documentation menu",
);

function syncSidebarState() {
  isSidebarOpen.value = sidebarTrigger?.getAttribute("aria-expanded") === "true";
}

function openSidebar() {
  sidebarTrigger?.click();
}

onMounted(() => {
  sidebarTrigger = document.querySelector<HTMLButtonElement>(
    ".VPLocalNav.has-sidebar .menu",
  );
  if (!sidebarTrigger) return;

  syncSidebarState();
  sidebarStateObserver = new MutationObserver(syncSidebarState);
  sidebarStateObserver.observe(sidebarTrigger, {
    attributes: true,
    attributeFilter: ["aria-expanded"],
  });
});

onUnmounted(() => {
  sidebarStateObserver?.disconnect();
});

const crumbs = computed(() => {
  const isZh = localeIndex.value === "zh";
  // 用 relativePath 派生 base 无关路径（route.path 在浏览器里含 /docs 前缀，
  // 会让与 sidebar 配置（不含 base）的匹配失效）。
  const path =
    "/" + page.value.relativePath.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, "");
  const prefix = isZh ? "/zh" : "";
  const result: { text: string; link?: string }[] = [];

  const isApiPage = path.startsWith(`${prefix}/api/`);
  const isIntegrationsPage = path.startsWith(`${prefix}/best-practices/`);
  const isCookbookPage = path.startsWith(`${prefix}/cookbook`);

  if (isApiPage) {
    result.push({
      text: "API Reference",
      link: `${prefix}/api/openai/create-chat-completion`,
    });
  } else if (isIntegrationsPage) {
    result.push({
      text: isZh ? "集成" : "Integrations",
      link: `${prefix}/best-practices/claude-code`,
    });
  } else if (isCookbookPage) {
    result.push({ text: "Cookbook", link: `${prefix}/cookbook` });
  } else {
    result.push({
      text: isZh ? "文档" : "Docs",
      link: `${prefix}/guide/quickstart`,
    });
  }

  const sidebar = theme.value.sidebar;
  if (!sidebar || Array.isArray(sidebar)) return result;

  const trail: string[] = [];
  for (const [keyPath, groups] of Object.entries(sidebar)) {
    if (!path.startsWith(keyPath.replace(/\/$/, ""))) continue;
    if (!Array.isArray(groups)) continue;
    for (const group of groups) {
      if (!group.items) continue;
      const chain: string[] = [];
      if (findInItems(group.items, path, chain)) {
        trail.push(group.text, ...chain);
        break;
      }
    }
    if (trail.length) break;
  }

  for (const text of trail) {
    if (text !== result[0]?.text) {
      result.push({ text });
    }
  }

  return result;
});

function findInItems(
  items: DefaultTheme.SidebarItem[],
  path: string,
  chain: string[],
): boolean {
  for (const item of items) {
    const itemLink = item.link?.replace(/\.html$/, "");
    if (itemLink && path.startsWith(itemLink)) return true;
    if (item.items) {
      chain.push(item.text);
      if (findInItems(item.items, path, chain)) return true;
      chain.pop();
    }
  }
  return false;
}
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-family: var(--zenmux-nav-font, -apple-system, sans-serif);
  font-size: 13px;
  line-height: 16px;
  color: #999;
  margin-bottom: 16px;
}

.breadcrumb-category-icon {
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
}

.breadcrumb-menu-button {
  display: none;
}

.breadcrumb-item a {
  color: #999;
  text-decoration: none;
  transition: color 0.25s;
}

.breadcrumb-item a:hover {
  color: var(--vp-c-text-1);
}

.breadcrumb-item:last-child {
  color: #333;
}

.breadcrumb-sep {
  margin: 0 4px;
  color: #ccc;
}

.dark .breadcrumb {
  color: var(--zm-text-tertiary);
}

.dark .breadcrumb-item:last-child {
  color: var(--zm-text-secondary);
}

.dark .breadcrumb-item:last-child {
  color: #ccc;
}

.dark .breadcrumb-item a {
  color: var(--zm-text-tertiary);
}

.dark .breadcrumb-sep {
  color: var(--zm-border-primary);
}

@media (max-width: 959px) {
  .breadcrumb {
    gap: 0;
    margin-bottom: 28px;
    font-size: 14px;
    font-weight: 400;
    line-height: normal;
  }

  .breadcrumb-menu-button {
    display: flex;
    width: 40px;
    height: 40px;
    margin: -10px 8px -10px -8px;
    padding: 0 12px 0 8px;
    flex: 0 0 40px;
    align-items: center;
    justify-content: flex-start;
    border: 0;
    background: transparent;
    color: var(--zm-text-tertiary);
    cursor: pointer;
  }
}
</style>
