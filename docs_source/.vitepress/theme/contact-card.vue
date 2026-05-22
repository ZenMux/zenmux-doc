<template>
  <div class="contact-card">
    <div class="contact-card-icon">
      <component :is="iconComponent" v-if="iconComponent" class="card-icon" />
    </div>
    <div class="contact-card-body">
      <div class="contact-card-title">{{ title }}</div>
      <div v-if="link" class="contact-card-link">
        <a :href="link" target="_blank" rel="noopener">{{ label }}</a>
        <ExternalOpenIcon class="external-icon" />
      </div>
      <div v-else class="contact-card-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IconMail from './icons/IconMail.vue'
import IconX from './icons/IconX.vue'
import IconDiscord from './icons/IconDiscord.vue'
import { ExternalOpen as ExternalOpenIcon } from './icons'

const props = defineProps<{
  icon: string
  title: string
  link?: string
  label?: string
}>()

const iconMap: Record<string, any> = {
  mail: IconMail,
  x: IconX,
  discord: IconDiscord,
}

const iconComponent = computed(() => iconMap[props.icon] || null)
</script>

<style scoped>
.contact-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 28px;
  min-width: 0;
  flex: 1;
  background: rgba(255, 255, 255, 0.7);
  border: 0.5px solid #e6e6e6;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
}

.contact-card:first-child {
  flex: 1.4;
}

.dark .contact-card {
  background: var(--zm-bg-secondary);
  border-color: var(--zm-border-primary);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.contact-card-icon {
  width: 24px;
  height: 24px;
  color: #000;
}

.dark .contact-card-icon {
  color: #fff;
}

.card-icon {
  width: 24px;
  height: 24px;
}

.contact-card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-card-title {
  font-family: var(--zenmux-nav-font, -apple-system, sans-serif);
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  color: #000;
}

.dark .contact-card-title {
  color: #fff;
}

.contact-card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-card-content :deep(p) {
  font-family: var(--zenmux-nav-font, -apple-system, sans-serif);
  font-size: 12px !important;
  font-weight: 400;
  line-height: 18px !important;
  color: #999 !important;
  margin: 0 !important;
}

.contact-card-content :deep(a) {
  color: #999 !important;
  text-decoration: underline;
}

.contact-card-link {
  display: flex;
  align-items: center;
  gap: 6px;
}

.contact-card-link a {
  font-family: var(--zenmux-nav-font, -apple-system, sans-serif);
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: #000;
  text-decoration: underline;
}

.dark .contact-card-link a {
  color: #fff;
}

.external-icon {
  width: 14px;
  height: 14px;
  color: #000;
  flex-shrink: 0;
}

.dark .external-icon {
  color: #fff;
}
</style>
