<template>
  <div class="select-dropdown">
    <div ref="dropdownRef" class="copy-page-split">
      <button class="copy-page-cta" type="button" @click="handleClick">
        <CopyIcon v-if="!isCopied" class="btn-icon" />
        <CheckedIcon v-else class="btn-icon" />
        <span>{{ isCopied ? "Copied" : "Copy Page" }}</span>
      </button>
      <button
        class="copy-page-arrow"
        type="button"
        :aria-expanded="isOpen"
        aria-label="More copy actions"
        @click.stop="toggleMenu"
      >
        <IconChevronTop class="arrow-icon" />
      </button>

      <div v-if="isOpen" class="copy-page-menu">
        <button class="copy-page-menu-item" type="button" @click="copyMarkdown">
          <CopyIcon class="menu-icon" />
          <span>Copy page as Markdown</span>
        </button>
        <button class="copy-page-menu-item" type="button" @click="openMarkdown">
          <ExternalOpenIcon class="menu-icon" />
          <span>Open Markdown</span>
        </button>
        <button class="copy-page-menu-item" type="button" @click="chatInZenMux">
          <ChatIcon class="menu-icon" />
          <span>Chat in ZenMux.ai</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import copyToClipboard from "copy-to-clipboard";
import { useData } from "vitepress";
import {
  Chat as ChatIcon,
  Checked as CheckedIcon,
  Copy as CopyIcon,
  ExternalOpen as ExternalOpenIcon,
  IconChevron_top as IconChevronTop,
} from "./icons";
import { fetchPageContent, getRawPageUrl } from "./use-page-content";

defineOptions({ name: "SelectDropdown" });

const { page } = useData();
const isCopied = ref(false);
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

let copiedTimer: ReturnType<typeof setTimeout> | null = null;

const markdownUrl = computed(() => {
  return getRawPageUrl(page.value.filePath);
});

async function copyCurrentMarkdown() {
  const content = await fetchPageContent(page.value.filePath);
  if (content) copyToClipboard(content);
}

function showCopiedState() {
  isCopied.value = true;
  if (copiedTimer) clearTimeout(copiedTimer);
  copiedTimer = setTimeout(() => {
    isCopied.value = false;
  }, 2000);
}

async function handleClick() {
  if (isCopied.value) return;
  isOpen.value = false;
  await copyCurrentMarkdown();
  showCopiedState();
}

function toggleMenu() {
  isOpen.value = !isOpen.value;
}

async function copyMarkdown() {
  await copyCurrentMarkdown();
  showCopiedState();
  isOpen.value = false;
}

function openMarkdown() {
  window.open(markdownUrl.value, "_blank", "noopener,noreferrer");
  isOpen.value = false;
}

function chatInZenMux() {
  const chatUrl = new URL("https://zenmux.ai/platform/chat");
  chatUrl.searchParams.set("chatId", "newChat");
  chatUrl.searchParams.set("source", "docs");
  chatUrl.searchParams.set("url", window.location.href);
  chatUrl.searchParams.set("title", page.value.title || document.title);
  window.open(chatUrl.toString(), "_blank", "noopener,noreferrer");
  isOpen.value = false;
}

function handleOutsideClick(event: MouseEvent) {
  if (!dropdownRef.value?.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("click", handleOutsideClick);
  document.removeEventListener("keydown", handleKeydown);
  if (copiedTimer) clearTimeout(copiedTimer);
});
</script>

<style scoped>
.select-dropdown {
  position: relative;
  z-index: 20;
  display: flex;
  justify-content: end;
  transform: translateY(-100%);
}

.copy-page-split {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 144px;
  height: 32px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: transparent;
  color: #333;
}

.copy-page-cta,
.copy-page-arrow,
.copy-page-menu-item {
  box-sizing: border-box;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-family: var(--zenmux-nav-font, -apple-system, sans-serif);
}

.copy-page-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 110px;
  align-self: stretch;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px 0 0 8px;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  color: inherit;
  text-transform: capitalize;
  white-space: nowrap;
}

.copy-page-arrow {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 32px;
  align-self: stretch;
  padding: 8px 9px;
  border-left: 1px solid #e5e5e5;
  border-radius: 0 8px 8px 0;
  color: #c8c8c8;
}

.copy-page-split:hover {
  border-color: #ccc;
  color: #000;
}

.copy-page-cta:hover {
  background: #fafafa;
}

.copy-page-arrow:hover {
  background: transparent;
}

.copy-page-arrow::before {
  content: "";
  position: absolute;
  inset: 1px 1px 1px 0;
  border-radius: 0 7px 7px 0;
  pointer-events: none;
}

.copy-page-arrow:hover::before {
  background: #fafafa;
}

.copy-page-arrow[aria-expanded="true"] .arrow-icon {
  transform: rotate(0deg);
}

.copy-page-menu {
  position: absolute;
  top: 40px;
  right: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  width: 220px;
  padding: 4px;
  border-radius: 12px;
  background: #fff;
  box-shadow:
    0 0 1px rgba(0, 0, 0, 0.17),
    0 14px 14px rgba(0, 0, 0, 0.05);
}

.copy-page-menu-item {
  display: flex;
  align-items: center;
  align-self: stretch;
  gap: 8px;
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  color: #000;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  text-align: left;
}

.copy-page-menu-item:hover {
  background: #f5f5f5;
}

.copy-page-menu-item span {
  flex: 1;
}

.btn-icon,
.arrow-icon {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  transform: rotate(180deg);
}

.menu-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

</style>

<style>
.dark .copy-page-split {
  color: var(--zm-text-tertiary) !important;
  border-color: var(--zm-border-primary) !important;
}

.dark .copy-page-split:hover {
  color: var(--zm-text-secondary) !important;
  border-color: var(--zm-text-tertiary) !important;
}

.dark .copy-page-arrow {
  border-left-color: var(--zm-border-primary) !important;
  color: var(--zm-text-tertiary) !important;
}

.dark .copy-page-cta:hover {
  background: var(--zm-bg-hover) !important;
}

.dark .copy-page-arrow:hover::before {
  background: var(--zm-bg-hover) !important;
}

.dark .copy-page-menu {
  background: var(--zm-bg-secondary) !important;
  box-shadow:
    0 0 1px rgba(0, 0, 0, 0.3),
    0 14px 14px rgba(0, 0, 0, 0.2) !important;
}

.dark .copy-page-menu-item {
  color: var(--zm-text-primary) !important;
}

.dark .copy-page-menu-item:hover {
  background: var(--zm-bg-hover) !important;
}
</style>
