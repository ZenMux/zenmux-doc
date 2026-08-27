<script setup lang="ts">
import localSearchIndex from "@localSearchIndex";
import MiniSearch, { type SearchResult } from "minisearch";
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  watch,
} from "vue";
import { useData, useRouter } from "vitepress";
import { openAiAssistant } from "./assistant-events";
import { useBodyScrollLock } from "./composables/use-body-scroll-lock";
import ChatFrame from "./icons/ChatFrame.vue";
import IconSearch from "./icons/IconSearch.vue";

interface SearchDocument {
  title: string;
  titles: string[];
  text?: string;
}

type MobileSearchResult = SearchResult & SearchDocument;

const SEARCH_STORAGE_KEY = "vitepress:local-search-filter";
const MOBILE_QUERY_LIMIT = 5;

const { localeIndex } = useData();
const router = useRouter();
const open = ref(false);
const query = ref("");
const activeIndex = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);
const dialogRef = ref<HTMLElement | null>(null);
const searchIndex = shallowRef<MiniSearch<SearchDocument> | null>(null);
const results = shallowRef<MobileSearchResult[]>([]);
const loading = ref(false);
const loadFailed = ref(false);

let previousFocus: HTMLElement | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let searchSequence = 0;

const isZh = computed(() => localeIndex.value === "zh");
const labels = computed(() => {
  if (isZh.value) {
    return {
      search: "搜索",
      askAssistant: "询问助手",
      documents: "文档结果",
      select: "选择",
      noResults: "没有匹配的文档",
      loading: "正在搜索…",
    };
  }
  return {
    search: "Search",
    askAssistant: "Ask Assistant",
    documents: "Documentation",
    select: "Select",
    noResults: "No matching documents",
    loading: "Searching…",
  };
});

const trimmedQuery = computed(() => query.value.trim());
const assistantQuestion = computed(() => {
  if (!trimmedQuery.value) {
    return "";
  }
  if (isZh.value) {
    return `请介绍一下“${trimmedQuery.value}”。`;
  }
  return `Can you tell me about ${trimmedQuery.value}?`;
});

const selectableCount = computed(() => {
  if (!trimmedQuery.value) {
    return 0;
  }
  return results.value.length + 1;
});

useBodyScrollLock(open);

function isMobileViewport() {
  return window.matchMedia("(max-width: 959px)").matches;
}

async function ensureSearchIndex() {
  if (searchIndex.value) {
    return searchIndex.value;
  }

  const loader = localSearchIndex[localeIndex.value];
  if (!loader) {
    throw new Error("Search index is unavailable for the current locale");
  }

  const module = await loader();
  searchIndex.value = MiniSearch.loadJSON<SearchDocument>(module.default, {
    fields: ["title", "titles", "text"],
    storeFields: ["title", "titles"],
    searchOptions: {
      fuzzy: 0.2,
      prefix: true,
      boost: { title: 4, text: 2, titles: 1 },
    },
  });
  return searchIndex.value;
}

async function updateResults(searchText: string, sequence: number) {
  if (!searchText) {
    results.value = [];
    loading.value = false;
    loadFailed.value = false;
    return;
  }

  loading.value = true;
  loadFailed.value = false;
  try {
    const index = await ensureSearchIndex();
    if (sequence !== searchSequence) {
      return;
    }
    results.value = index
      .search(searchText)
      .slice(0, MOBILE_QUERY_LIMIT) as MobileSearchResult[];
  } catch {
    if (sequence === searchSequence) {
      results.value = [];
      loadFailed.value = true;
    }
  } finally {
    if (sequence === searchSequence) {
      loading.value = false;
    }
  }
}

watch(query, (value) => {
  activeIndex.value = 0;
  searchSequence += 1;
  const sequence = searchSequence;
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(SEARCH_STORAGE_KEY, value);
  }
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    void updateResults(value.trim(), sequence);
  }, 120);
});

watch(localeIndex, () => {
  searchIndex.value = null;
  searchSequence += 1;
  void updateResults(trimmedQuery.value, searchSequence);
});

function openSearch(trigger?: HTMLElement) {
  if (!isMobileViewport()) {
    return;
  }
  previousFocus = trigger || (document.activeElement as HTMLElement | null);
  open.value = true;
  nextTick(() => inputRef.value?.focus());
}

function handleTriggerClick(event: MouseEvent) {
  openSearch(event.currentTarget as HTMLElement);
}

function closeSearch() {
  open.value = false;
  nextTick(() => previousFocus?.focus());
}

async function askAssistant() {
  if (!assistantQuestion.value) {
    return;
  }
  const question = assistantQuestion.value;
  open.value = false;
  await nextTick();
  previousFocus?.focus();
  openAiAssistant({ query: question, autoSend: true });
}

async function openResult(result: MobileSearchResult) {
  open.value = false;
  await router.go(result.id);
}

function activateSelection() {
  if (activeIndex.value === 0) {
    void askAssistant();
    return;
  }
  const result = results.value[activeIndex.value - 1];
  if (result) {
    void openResult(result);
  }
}

function getFocusableElements() {
  if (!dialogRef.value) {
    return [];
  }
  return Array.from(
    dialogRef.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    ),
  );
}

function trapFocus(event: KeyboardEvent) {
  const focusable = getFocusableElements();
  if (!focusable.length) {
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function handleDialogKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    closeSearch();
    return;
  }
  if (event.key === "Tab") {
    trapFocus(event);
    return;
  }
  if (!selectableCount.value) {
    return;
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    activeIndex.value = (activeIndex.value + 1) % selectableCount.value;
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    activeIndex.value =
      (activeIndex.value - 1 + selectableCount.value) % selectableCount.value;
  } else if (event.key === "Enter") {
    event.preventDefault();
    activateSelection();
  }
}

function isEditingContent(event: KeyboardEvent) {
  const element = event.target as HTMLElement | null;
  const tagName = element?.tagName;
  return (
    element?.isContentEditable === true ||
    tagName === "INPUT" ||
    tagName === "SELECT" ||
    tagName === "TEXTAREA"
  );
}

function handleGlobalSearchShortcut(event: KeyboardEvent) {
  if (!isMobileViewport()) {
    return;
  }
  const isCommandK =
    event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);
  const isSlash = event.key === "/" && !isEditingContent(event);
  if (!isCommandK && !isSlash) {
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();
  openSearch();
}

onMounted(() => {
  query.value = sessionStorage.getItem(SEARCH_STORAGE_KEY) || "";
  window.addEventListener("keydown", handleGlobalSearchShortcut, true);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleGlobalSearchShortcut, true);
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});
</script>

<template>
  <button
    class="mobile-search-trigger mobile-floating-action"
    type="button"
    :aria-label="labels.search"
    :title="labels.search"
    @click="handleTriggerClick"
  >
    <IconSearch aria-hidden="true" />
  </button>

  <Teleport to="body">
    <Transition name="mobile-overlay">
      <div
        v-if="open"
        class="mobile-search-overlay"
        @mousedown.self="closeSearch"
      >
        <section
          ref="dialogRef"
          class="mobile-search-dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="labels.search"
          @keydown="handleDialogKeydown"
        >
          <label class="mobile-search-input-shell">
            <IconSearch aria-hidden="true" />
            <input
              ref="inputRef"
              v-model="query"
              type="search"
              autocomplete="off"
              :placeholder="labels.search"
              :aria-activedescendant="
                trimmedQuery ? `mobile-search-option-${activeIndex}` : undefined
              "
            />
          </label>

          <div v-if="trimmedQuery" class="mobile-search-results">
            <p class="mobile-search-section-label">{{ labels.askAssistant }}</p>
            <button
              id="mobile-search-option-0"
              class="mobile-search-option mobile-search-ai-option"
              :class="{ active: activeIndex === 0 }"
              type="button"
              @mouseenter="activeIndex = 0"
              @click="askAssistant"
            >
              <ChatFrame aria-hidden="true" />
              <span>{{ assistantQuestion }}</span>
            </button>

            <template v-if="results.length">
              <p class="mobile-search-section-label mobile-search-doc-label">
                {{ labels.documents }}
              </p>
              <div class="mobile-search-document-results" role="listbox">
                <button
                  v-for="(result, index) in results"
                  :id="`mobile-search-option-${index + 1}`"
                  :key="result.id"
                  class="mobile-search-option mobile-search-document-option"
                  :class="{ active: activeIndex === index + 1 }"
                  type="button"
                  role="option"
                  :aria-selected="activeIndex === index + 1"
                  @mouseenter="activeIndex = index + 1"
                  @click="openResult(result)"
                >
                  <span class="mobile-search-result-title">{{ result.title }}</span>
                  <span v-if="result.titles?.length" class="mobile-search-result-path">
                    {{ result.titles.join(" › ") }}
                  </span>
                </button>
              </div>
            </template>
            <p v-else-if="loading" class="mobile-search-status">
              {{ labels.loading }}
            </p>
            <p v-else-if="!loadFailed" class="mobile-search-status">
              {{ labels.noResults }}
            </p>

            <footer class="mobile-search-footer" aria-hidden="true">
              <span><kbd>↑</kbd><kbd>↓</kbd> {{ labels.select }}</span>
              <span><kbd>↵</kbd> {{ labels.askAssistant }}</span>
            </footer>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mobile-search-trigger {
  bottom: calc(16px + env(safe-area-inset-bottom));
}

.mobile-floating-action {
  position: fixed;
  right: 16px;
  z-index: 28;
  display: none;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 14px;
  border: 0.5px solid var(--zm-border-primary);
  border-radius: 50%;
  color: var(--zm-text-primary);
  background: var(--zm-bg-primary);
  box-shadow: 0 14px 12px rgb(0 0 0 / 5%);
  cursor: pointer;
}

.mobile-floating-action svg {
  width: 20px;
  height: 20px;
}

.mobile-search-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgb(0 0 0 / 60%);
}

.mobile-search-dialog {
  width: min(362px, 100%);
  max-height: min(620px, calc(100dvh - 40px));
  padding: 8px;
  overflow: hidden;
  border-radius: 16px;
  color: var(--zm-text-primary);
  background: var(--zm-bg-primary);
  box-shadow: none;
  font-family:
    "SF Pro",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.mobile-search-input-shell {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 12px;
  border: 0.5px solid var(--zm-border-primary);
  border-radius: 10px;
  color: var(--zm-text-tertiary);
}

.mobile-search-input-shell svg {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
}

.mobile-search-input-shell input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  color: var(--zm-text-primary);
  background: transparent;
  font: inherit;
  font-size: 14px;
}

.mobile-search-input-shell input::-webkit-search-cancel-button {
  display: none;
}

.mobile-search-results {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 16px;
}

.mobile-search-section-label {
  margin: 0;
  padding: 0 12px;
  color: var(--zm-text-tertiary);
  font-size: 14px;
  line-height: 17px;
}

.mobile-search-doc-label {
  margin-top: 8px;
}

.mobile-search-option {
  display: flex;
  width: 100%;
  min-height: 42px;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  overflow: hidden;
  border: 0;
  border-radius: 10px;
  color: var(--zm-text-secondary);
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.mobile-search-option.active {
  color: var(--zm-text-primary);
  background: var(--zm-bg-tertiary);
}

.mobile-search-ai-option {
  padding: 12px;
  color: var(--zm-text-secondary);
  font-size: 15px;
  line-height: normal;
}

.mobile-search-ai-option.active {
  color: var(--zm-text-secondary);
}

.mobile-search-ai-option svg {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
}

.mobile-search-document-results {
  max-height: 230px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.mobile-search-document-option {
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.mobile-search-result-title {
  max-width: 100%;
  overflow: hidden;
  color: inherit;
  font-size: 14px;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-search-result-path {
  max-width: 100%;
  overflow: hidden;
  color: var(--zm-text-tertiary);
  font-size: 12px;
  line-height: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-search-status {
  margin: 0;
  padding: 10px 12px;
  color: var(--zm-text-tertiary);
  font-size: 13px;
}

.mobile-search-footer {
  display: flex;
  gap: 16px;
  margin-top: 4px;
  padding: 8px 4px 0;
  border-top: 0.5px solid var(--zm-border-primary);
  color: var(--zm-text-tertiary);
  font-size: 12px;
  line-height: 14px;
}

.mobile-search-footer span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.mobile-search-footer kbd {
  min-width: 12px;
  padding: 0 2px;
  border: 0;
  border-radius: 2px;
  color: var(--zm-bg-primary);
  background: var(--zm-text-tertiary);
  box-shadow: none;
  font: inherit;
  font-size: 10px;
  text-align: center;
}

.mobile-overlay-enter-active,
.mobile-overlay-leave-active {
  transition: opacity 180ms ease;
}

.mobile-overlay-enter-from,
.mobile-overlay-leave-to {
  opacity: 0;
}

@media (max-width: 959px) {
  .mobile-floating-action {
    display: flex;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mobile-overlay-enter-active,
  .mobile-overlay-leave-active {
    transition: none;
  }
}
</style>
