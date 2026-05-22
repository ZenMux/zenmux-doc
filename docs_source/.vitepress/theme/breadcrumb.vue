<template>
  <nav v-if="crumbs.length > 1" class="breadcrumb">
    <span v-for="(crumb, i) in crumbs" :key="i" class="breadcrumb-item">
      <span v-if="i > 0" class="breadcrumb-sep"> &rsaquo; </span>
      <a v-if="crumb.link && i < crumbs.length - 1" :href="crumb.link">{{ crumb.text }}</a>
      <span v-else>{{ crumb.text }}</span>
    </span>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

const { localeIndex, theme } = useData()
const route = useRoute()

const crumbs = computed(() => {
  const isZh = localeIndex.value === 'zh'
  const path = route.path
  const prefix = isZh ? '/zh' : ''
  const result: { text: string; link?: string }[] = []

  const isApiPage = path.startsWith(`${prefix}/api/`)
  const isIntegrationsPage = path.startsWith(`${prefix}/best-practices/`)
  const isCookbookPage = path.startsWith(`${prefix}/cookbook`)

  if (isApiPage) {
    result.push({ text: 'API reference', link: `${prefix}/api/openai/create-chat-completion` })
  } else if (isIntegrationsPage) {
    result.push({ text: isZh ? '集成' : 'Integrations', link: `${prefix}/best-practices/claude-code` })
  } else if (isCookbookPage) {
    result.push({ text: 'Cookbook', link: `${prefix}/cookbook` })
  } else {
    result.push({ text: isZh ? '文档' : 'Docs', link: `${prefix}/guide/quickstart` })
  }

  const sidebar = theme.value.sidebar
  if (!sidebar || Array.isArray(sidebar)) return result

  const trail: string[] = []
  for (const [keyPath, groups] of Object.entries(sidebar)) {
    if (!path.startsWith(keyPath.replace(/\/$/, ''))) continue
    if (!Array.isArray(groups)) continue
    for (const group of groups) {
      if (!group.items) continue
      const chain: string[] = []
      if (findInItems(group.items, path, chain)) {
        trail.push(group.text, ...chain)
        break
      }
    }
    if (trail.length) break
  }

  for (const text of trail) {
    if (text !== result[0]?.text) {
      result.push({ text })
    }
  }

  return result
})

function findInItems(items: any[], path: string, chain: string[]): boolean {
  for (const item of items) {
    const itemLink = item.link?.replace(/\.html$/, '')
    if (itemLink && path.startsWith(itemLink)) return true
    if (item.items) {
      chain.push(item.text)
      if (findInItems(item.items, path, chain)) return true
      chain.pop()
    }
  }
  return false
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

.dark .breadcrumb-item a {
  color: var(--zm-text-tertiary);
}

.dark .breadcrumb-sep {
  color: var(--zm-border-primary);
}
</style>
