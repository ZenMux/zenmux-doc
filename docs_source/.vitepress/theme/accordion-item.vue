<template>
  <div class="accordion-item" :class="{ open }">
    <button class="accordion-header" @click="open = !open">
      <TriangleRight class="accordion-arrow" :class="{ rotated: open }" />
      <span class="accordion-title">{{ title }}</span>
    </button>
    <div v-show="open" class="accordion-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TriangleRight } from './icons'

const props = defineProps<{
  title: string
  defaultOpen?: boolean
}>()

const open = ref(props.defaultOpen ?? false)
</script>

<style scoped>
.accordion-item {
  border-bottom: 1px solid #e6e6e6;
}

.accordion-item:last-child {
  border-bottom: none;
}

.dark .accordion-item {
  border-bottom-color: #333;
}

.accordion-header {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 20px 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.accordion-header:hover {
  background: rgba(0, 0, 0, 0.02);
}

.dark .accordion-header:hover {
  background: rgba(255, 255, 255, 0.03);
}

.accordion-arrow {
  flex-shrink: 0;
  color: #999;
  transition: transform 0.2s ease;
}

.accordion-arrow.rotated {
  transform: rotate(90deg);
}

.accordion-title {
  font-family: var(--zenmux-nav-font, -apple-system, sans-serif);
  font-size: 16px;
  font-weight: 510;
  line-height: 19px;
  color: #000;
}

.open .accordion-title {
  font-weight: 700;
}

.dark .accordion-title {
  color: #fff;
}

.accordion-body {
  padding: 0 24px 20px 44px;
}

.accordion-body :deep(p) {
  font-size: 14px;
  line-height: 17px;
  color: #666;
  margin: 0 0 16px;
}

.accordion-body :deep(p:last-child) {
  margin-bottom: 0;
}

.accordion-body :deep(strong) {
  font-weight: 510;
  color: #000;
}

.dark .accordion-body :deep(strong) {
  color: #fff;
}

.accordion-body :deep(ol),
.accordion-body :deep(ul) {
  margin: 0 0 16px;
  padding-left: 0;
}

.accordion-body :deep(li) {
  font-size: 14px;
  line-height: 28px;
  color: #666;
}

.accordion-body :deep(code) {
  font-family: 'SF Mono', monospace;
  font-size: 12px;
  line-height: 14px;
  color: #666;
  background: #f5f5f5;
  border: 0.5px solid #e6e6e6;
  border-radius: 4px;
  padding: 2px 6px;
}

.dark .accordion-body :deep(code) {
  background: #2a2a2a;
  border-color: #444;
  color: #ccc;
}

.accordion-body :deep(a) {
  color: #000;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.dark .accordion-body :deep(a) {
  color: #fff;
}
</style>
