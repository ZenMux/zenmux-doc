<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { ElMessage, ElSelect, ElOption } from "element-plus";
import { Copy as CopyIcon, Checked as CheckedIcon } from "./icons";
import { useData, inBrowser } from "vitepress";

const { frontmatter, page } = useData();

const isApiResponse = computed(
  () => frontmatter.value.pageClass === "api-page",
);

const responseCodes = ref<Record<string, string>>({});
const currentLang = ref("");
const langOptions = ref<string[]>([]);
const responseTitle = ref("Response");

const copied = ref(false);
const langSelectRef = ref();

function onLangWrapperClick(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest(".el-select")) {
    langSelectRef.value?.$el?.querySelector(".el-select__wrapper")?.click();
  }
}

function initResponseData() {
  if (!inBrowser) return;
  const dom = document.querySelector<HTMLElement>(".api-response");
  if (dom) {
    responseTitle.value = dom.dataset.info || "Response";
  }

  dom?.querySelectorAll(".vp-adaptive-theme").forEach((theme) => {
    const pre = theme.querySelector("pre");
    const lang = theme.querySelector(".lang")?.textContent?.trim() || "";
    if (!lang || !pre) return;
    const html = pre.innerHTML;
    responseCodes.value[lang] = html;
    if (!langOptions.value.includes(lang)) langOptions.value.push(lang);
    if (!currentLang.value) currentLang.value = lang;
  });
}

onMounted(() => {
  initResponseData();
});

watch(
  () => page.value.filePath,
  () => {
    responseCodes.value = {};
    currentLang.value = "";
    langOptions.value = [];
    responseTitle.value = "Response";
    copied.value = false;
    initResponseData();
  },
);

const rendered = computed(() => responseCodes.value[currentLang.value] || "");
const renderedPlain = computed(() => htmlToPlain(rendered.value));

function htmlToPlain(html: string) {
  if (!html) return "";
  if (!inBrowser) return html.replace(/<[^>]*>/g, "");
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}

async function copyText(text: string) {
  if (!inBrowser) return;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  } catch (e) {
    console.warn("copy failed", e);
  }
}

async function copyResponse() {
  if (!renderedPlain.value) return;
  await copyText(renderedPlain.value);
  copied.value = true;
  ElMessage.success("Response copied");
  setTimeout(() => (copied.value = false), 2000);
}
</script>

<template>
  <div
    v-if="isApiResponse && Object.keys(responseCodes).length > 0"
    class="api-response-float-container"
  >
    <div class="api-response-container">
      <div class="api-header">
        <div class="left">
          <span class="response-title" v-text="responseTitle"></span>
        </div>
        <div class="right">
          <div class="lang-select-wrapper" v-if="langOptions.length > 1" @click="onLangWrapperClick">
            <el-select
              ref="langSelectRef"
              v-model="currentLang"
              placeholder="Lang"
              size="small"
              popper-class="api-lang-dropdown"
            >
              <el-option
                v-for="l in langOptions"
                :key="l"
                :label="l"
                :value="l"
              />
            </el-select>
            <svg
              class="chevron-updown"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.33 6L8 3.33 10.67 6M5.33 10L8 12.67 10.67 10"
                stroke="#999"
                stroke-width="1.33"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <CheckedIcon
            v-if="copied"
            class="copy-action-icon copied-icon"
            title="Copied"
            @click="copyResponse"
          />
          <CopyIcon
            v-else
            class="copy-action-icon"
            title="Copy response"
            @click="copyResponse"
          />
        </div>
      </div>
      <div class="api-content">
        <pre class="vp-code" v-html="rendered"></pre>
      </div>
    </div>
  </div>
</template>

<style>
/* ===== Hide markdown-rendered version ===== */
.api-response {
  display: none;
}

.api-response-float-container {
  width: 100%;
}

/* ===== Response Container ===== */
.api-response-float-container .api-response-container {
  margin: 20px 0;
  background: #f5f5f5;
  border: 0.5px solid #e6e6e6;
  border-radius: 12px;
  overflow: hidden;
}

.dark .api-response-float-container .api-response-container {
  background: var(--zm-bg-primary);
  border-color: var(--zm-border-primary);
}

.api-response-float-container .api-response-container pre {
  max-height: none;
  height: auto;
}

/* ===== Response Title Badge ===== */
.api-response-float-container .response-title {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 2px 6px;
  background: #fff;
  border: 0.5px solid #e6e6e6;
  border-radius: 4px;
  font-family: "SF Mono", monospace;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  color: #666;
  flex-shrink: 0;
  user-select: none;
}

.dark .api-response-float-container .response-title {
  background: var(--zm-bg-tertiary);
  border-color: var(--zm-border-primary);
  color: var(--zm-text-secondary);
}

/* ===== Lang Select Wrapper ===== */
.api-response-float-container .lang-select-wrapper {
  display: flex;
  align-items: center;
  gap: 0;
  height: 24px;
  padding: 0 8px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;
}

.api-response-float-container .lang-select-wrapper:hover {
  background: rgba(0, 0, 0, 0.04);
}

.dark .api-response-float-container .lang-select-wrapper:hover {
  background: var(--zm-bg-hover);
}

.api-response-float-container .lang-select-wrapper .el-select {
  position: static;
}

.api-response-float-container .lang-select-wrapper .chevron-updown {
  flex-shrink: 0;
  pointer-events: none;
}

/* ===== El-Select Overrides ===== */
.api-response-float-container .el-select {
  --el-select-width: auto;
  --el-select-input-focus-border-color: transparent;
  width: auto !important;
  display: inline-flex !important;
}

.api-response-float-container .el-select .el-select__wrapper {
  background-color: transparent !important;
  box-shadow: none !important;
  min-height: 24px !important;
  padding: 0 !important;
  gap: 0 !important;
  cursor: pointer;
}

.api-response-float-container .el-select .el-select__wrapper:hover,
.api-response-float-container .el-select .el-select__wrapper.is-hovering,
.api-response-float-container .el-select .el-select__wrapper.is-focused {
  box-shadow: none !important;
}

.api-response-float-container .el-select .el-select__selection {
  gap: 0 !important;
  min-width: 0;
}

.api-response-float-container .el-select .el-select__placeholder {
  position: relative !important;
  z-index: auto !important;
  transform: none !important;
  top: auto !important;
  font-family: "SF Pro", -apple-system, sans-serif;
  font-size: 13px !important;
  line-height: 24px !important;
  color: #666 !important;
}

.api-response-float-container .el-select .el-select__placeholder.is-transparent {
  color: #999 !important;
}

.dark .api-response-float-container .el-select .el-select__placeholder {
  color: var(--zm-text-tertiary) !important;
}

.api-response-float-container .el-select .el-select__suffix {
  display: none !important;
}

.api-response-float-container .el-select .el-select__input-wrapper {
  display: none !important;
}

/* ===== Code Area ===== */
.api-response-float-container .api-content {
  min-height: auto;
  max-height: none;
  height: auto;
  background: transparent;
  overflow: visible;
  width: 100%;
  border-radius: 0;
}

.api-response-float-container .api-content pre {
  margin: 0;
  padding: 16px 20px;
  counter-reset: line-number;
}

.api-response-float-container .api-content pre code {
  display: block;
  padding: 0 !important;
  width: fit-content;
  min-width: 100%;
  font-family: "SF Mono", monospace;
  font-size: 0 !important;
  line-height: 0 !important;
  color: #000;
}

.dark .api-response-float-container .api-content pre code {
  color: var(--zm-text-primary);
}

/* Line numbers via CSS counters */
.api-response-float-container .api-content pre .line {
  display: block;
  font-size: 13px;
  line-height: 24px;
}

.api-response-float-container .api-content pre .line::before {
  counter-increment: line-number;
  content: counter(line-number);
  display: inline-block;
  width: 2ch;
  margin-right: 12px;
  text-align: right;
  color: #ccc;
  font-family: "SF Mono", monospace;
  font-size: 13px;
  line-height: 24px;
  user-select: none;
}

.dark .api-response-float-container .api-content pre .line::before {
  color: rgba(255, 255, 255, 0.2);
}
</style>
