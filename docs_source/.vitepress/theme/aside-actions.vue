<template>
  <div class="aside-actions">
    <button class="aside-action-item" @click="copyPage">
      <CopyIcon class="action-icon" />
      <span>{{ copyText }}</span>
    </button>
    <button class="aside-action-item" @click="scrollToTop">
      <IconBack_top class="action-icon" />
      <span>Scroll to top</span>
    </button>
    <button class="aside-action-item" @click="askAI">
      <AiIcon class="action-icon" />
      <span>Ask AI about this page</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useData } from "vitepress";
import LZString from "lz-string";
import copyToClipboard from "copy-to-clipboard";
import { Copy as CopyIcon } from "./icons";
import IconBack_top from "./icons/IconBack_top.vue";
import ChatFrame from "./icons/ChatFrame.vue";

const AiIcon = ChatFrame;

const { page } = useData();

const copyText = ref("Copy page");
let copyTimer: ReturnType<typeof setTimeout> | null = null;

function copyPage() {
  if (copyText.value !== "Copy page") return;
  const content = (page.value as any).content;
  if (content) {
    copyToClipboard(LZString.decompressFromBase64(content));
  }
  copyText.value = "Copied!";
  if (copyTimer) clearTimeout(copyTimer);
  copyTimer = setTimeout(() => {
    copyText.value = "Copy page";
  }, 2000);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function askAI() {
  document.dispatchEvent(new CustomEvent("open-ai-assistant"));
}
</script>

<style scoped>
.aside-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  bottom: 0;
  padding: 24px 0 32px;
  background: var(--vp-c-bg);
  z-index: 1;
  padding-left: 14px;
}

.aside-actions::before {
  content: "";
  position: absolute;
  top: -32px;
  left: -16px;
  right: -16px;
  height: 32px;
  background: linear-gradient(to bottom, transparent, var(--vp-c-bg));
  pointer-events: none;
}

.aside-action-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: var(--zenmux-nav-font, -apple-system, sans-serif);
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  color: #666;
  text-decoration: none;
}

.aside-action-item:hover {
  color: #000;
}

.dark .aside-action-item {
  color: var(--zm-text-tertiary);
}

.dark .aside-action-item:hover {
  color: #fff;
}

.action-icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
}
</style>
