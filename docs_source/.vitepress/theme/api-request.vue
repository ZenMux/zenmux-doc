<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { ElMessage, ElSelect, ElOption } from "element-plus";
import { Copy as CopyIcon, Checked as CheckedIcon } from "./icons";
import { useData, inBrowser } from "vitepress";

const { frontmatter, page } = useData();

const isApiRequest = computed(() => frontmatter.value.pageClass === "api-page");

const requestCodes = ref<Record<string, string>>({});
const responseCodes = ref<Record<string, string>>({});
const currentLang = ref("");
const langOptions = ref<string[]>([]);
const httpMethod = ref("GET");
const requestURL = ref("");

const copiedReq = ref(false);
const copiedResp = ref(false);
const copiedPath = ref(false);
const langSelectRef = ref();

function onLangWrapperClick(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest(".el-select")) {
    langSelectRef.value?.$el?.querySelector(".el-select__wrapper")?.click();
  }
}

function initRequestData() {
  if (!inBrowser) return;
  const dom = document.querySelector<HTMLElement>(".api-request");
  if (dom) {
    dom.dataset.info
      ?.trim()
      .toUpperCase()
      .split(" ")
      .forEach((part) => {
        if (
          part &&
          ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"].includes(
            part,
          )
        ) {
          httpMethod.value = part;
        } else if (part) {
          requestURL.value = part.toLowerCase();
        }
      });
  }
  dom?.querySelectorAll(".vp-adaptive-theme").forEach((theme) => {
    const pre = theme.querySelector("pre");
    const lang = theme.querySelector(".lang")?.textContent?.trim() || "";
    if (!lang || !pre) return;
    const html = pre.innerHTML; // 含高亮标签
    if (lang === "json") {
      responseCodes.value[lang] = html;
    } else {
      requestCodes.value[lang] = html;
      if (!langOptions.value.includes(lang)) langOptions.value.push(lang);
      if (!currentLang.value) currentLang.value = lang;
    }
  });
}

onMounted(() => {
  initRequestData();
});

watch(
  () => page.value.filePath,
  () => {
    // 清空旧数据
    requestCodes.value = {};
    responseCodes.value = {};
    currentLang.value = "";
    langOptions.value = [];
    httpMethod.value = "GET";
    requestURL.value = "";
    copiedReq.value = false;
    copiedResp.value = false;
    copiedPath.value = false;
    // 重新初始化
    initRequestData();
  },
);

const rendered = computed(() => requestCodes.value[currentLang.value] || "");
const renderedPlain = computed(() => htmlToPlain(rendered.value));
const json = computed(() => responseCodes.value["json"] || "");
const jsonPlain = computed(() => htmlToPlain(json.value));

function htmlToPlain(html: string) {
  if (!html) return "";
  if (!inBrowser) return html.replace(/<[^>]*>/g, ""); // SSR fallback: strip HTML tags
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}

async function copyText(text: string) {
  if (!inBrowser) return; // Skip copy function during SSR
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

async function copyRequest() {
  if (!renderedPlain.value) return;
  await copyText(renderedPlain.value);
  copiedReq.value = true;
  ElMessage.success("Request copied");
  setTimeout(() => (copiedReq.value = false), 2000);
}

async function copyResponse() {
  if (!jsonPlain.value) return;
  await copyText(jsonPlain.value);
  copiedResp.value = true;
  ElMessage.success("Response copied");
  setTimeout(() => (copiedResp.value = false), 2000);
}

async function copyPath() {
  if (!requestURL.value) return;
  await copyText(requestURL.value);
  copiedPath.value = true;
  ElMessage.success("Path copied");
  setTimeout(() => (copiedPath.value = false), 1500);
}
</script>

<template>
  <div v-if="isApiRequest" class="api-float-container">
    <div class="api-request-container">
      <div class="api-header">
        <div class="left"></div>
        <div class="right">
          <div
            class="lang-select-wrapper"
            v-if="langOptions.length > 1"
            @click="onLangWrapperClick"
          >
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
                stroke="currentColor"
                stroke-width="1.33"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <CheckedIcon
            v-if="copiedReq"
            class="copy-action-icon copied-icon"
            title="Copied"
            @click="copyRequest"
          />
          <CopyIcon
            v-else
            class="copy-action-icon"
            title="Copy code"
            @click="copyRequest"
          />
        </div>
      </div>
      <div class="api-content">
        <pre class="vp-code" v-html="rendered"></pre>
      </div>
    </div>

    <div class="api-request-container" v-if="json">
      <div class="api-header">
        <div class="left">
          <span class="reponse-code">200</span>
        </div>
        <div class="right">
          <CheckedIcon
            v-if="copiedResp"
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
        <pre class="vp-code" v-html="json"></pre>
      </div>
    </div>
  </div>
</template>

<style>
/* ===== Hide markdown-rendered version ===== */
.api-request {
  display: none;
}

.api-float-container {
  width: 100%;
}

/* ===== Request / Response Container ===== */
.api-float-container .api-request-container {
  margin: 20px 0;
  background: #fafafa;
  border: 0.5px solid #e6e6e6;
  border-radius: 12px;
  overflow: hidden;
}

.dark .api-float-container .api-request-container {
  background: var(--zm-bg-primary);
  border-color: var(--zm-border-primary);
}

.api-float-container .api-request-container pre {
  max-height: none;
  height: auto;
}

/* ===== Header Bar (44px) ===== */
.api-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  padding: 10px 8px 10px 20px;
  border-bottom: 0.5px solid #e6e6e6;
  margin-bottom: 0;
  gap: 12px;
}

.dark .api-header {
  border-bottom-color: var(--zm-border-primary);
}

/* Left: method badge + path */
.api-header .left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.api-header .left .http-method {
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
  text-transform: capitalize;
  flex-shrink: 0;
}

.dark .api-header .left .http-method {
  background: var(--zm-bg-tertiary);
  border-color: var(--zm-border-primary);
  color: var(--zm-text-secondary);
}

.api-header .left .http-path {
  font-family: "SF Mono", monospace;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  color: #666;
  cursor: pointer;
  padding: 0;
  border-radius: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s;
}

.api-header .left .http-path:hover {
  color: #333;
  background: transparent;
  box-shadow: none;
  text-decoration: none;
}

.dark .api-header .left .http-path {
  color: var(--zm-text-tertiary);
}

.dark .api-header .left .http-path:hover {
  color: var(--zm-text-secondary);
}

.api-header .left .http-path.copied {
  color: #52c41a;
  background: transparent;
  box-shadow: none;
}

.api-header .left .http-path.copied::after {
  content: none;
}

/* Response code badge */
.api-header .left .reponse-code {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  background: #fff;
  border: 0.5px solid #e6e6e6;
  border-radius: 4px;
  font-family: "SF Mono", monospace;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  color: #52c41a;
  flex-shrink: 0;
  box-shadow: none;
  min-width: auto;
  height: auto;
  letter-spacing: normal;
  user-select: none;
}

.dark .api-header .left .reponse-code {
  background: var(--zm-bg-tertiary);
  border-color: var(--zm-border-primary);
}

/* Right: dropdown + copy */
.api-header .right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: auto;
}

/* ===== Copy Icon ===== */
.copy-action-icon {
  width: 12px;
  height: 12px;
  padding: 6px;
  box-sizing: content-box;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  flex-shrink: 0;
  transition: background-color 0.2s;
}

.copy-action-icon:hover {
  background-color: #e6e6e6;
  color: #666;
}

.dark .copy-action-icon {
  color: var(--zm-text-secondary);
}

.dark .copy-action-icon:hover {
  background-color: var(--zm-bg-hover);
}

.copy-action-icon.copied-icon {
  color: #52c41a;
}

/* ===== Language Dropdown (el-select overrides for Element Plus 2.13) ===== */
.api-header .el-select {
  --el-select-width: auto;
  --el-select-input-focus-border-color: transparent;
  width: auto !important;
  display: inline-flex !important;
}

.api-header .el-select .el-select__wrapper {
  background-color: transparent !important;
  box-shadow: none !important;
  min-height: 24px !important;
  padding: 0 !important;
  gap: 0 !important;
  cursor: pointer;
}

.api-header .el-select .el-select__wrapper:hover,
.api-header .el-select .el-select__wrapper.is-hovering,
.api-header .el-select .el-select__wrapper.is-focused {
  box-shadow: none !important;
}

.api-header .el-select .el-select__selection {
  gap: 0 !important;
  min-width: 0;
}

.api-header .el-select .el-select__placeholder {
  position: relative !important;
  z-index: auto !important;
  transform: none !important;
  top: auto !important;
  font-family:
    "SF Pro",
    -apple-system,
    sans-serif;
  font-size: 13px !important;
  line-height: 24px !important;
  color: #666 !important;
}

.api-header .el-select .el-select__placeholder.is-transparent {
  color: #999 !important;
}

.dark .api-header .el-select .el-select__placeholder {
  color: var(--zm-text-tertiary) !important;
}

.dark .api-header .el-select .el-select__placeholder.is-transparent {
  color: var(--zm-text-tertiary) !important;
}

.api-header .el-select .el-select__suffix {
  display: none !important;
}

.api-header .el-select .el-select__input-wrapper {
  display: none !important;
}

/* Lang select wrapper: text + chevron inline */
.lang-select-wrapper {
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

.lang-select-wrapper:hover {
  background: rgba(0, 0, 0, 0.04);
}

.dark .lang-select-wrapper:hover {
  background: var(--zm-bg-hover);
}

.lang-select-wrapper .el-select {
  position: static;
}

.lang-select-wrapper .chevron-updown {
  flex-shrink: 0;
  pointer-events: none;
  color: #999;
}

.dark .lang-select-wrapper .chevron-updown {
  color: var(--zm-text-tertiary);
}

/* Dropdown popup */
.api-lang-dropdown {
  background: #fff !important;
  border: 0.5px solid #e6e6e6 !important;
  border-radius: 12px !important;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08) !important;
  padding: 4px !important;
}

.dark .api-lang-dropdown,
.api-lang-dropdown.is-dark {
  background: var(--zm-bg-secondary) !important;
  border-color: var(--zm-border-primary) !important;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.3) !important;
}

.api-lang-dropdown .el-select-dropdown {
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.api-lang-dropdown .el-select-dropdown__wrap {
  max-height: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.api-lang-dropdown .el-select-dropdown__list {
  padding: 0 !important;
}

.api-lang-dropdown .el-select-dropdown__item {
  height: 36px;
  line-height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  font-family: var(--zenmux-nav-font);
  font-size: 14px;
  font-weight: 400;
  color: rgba(102, 102, 102, 0.88);
}

.dark .api-lang-dropdown .el-select-dropdown__item,
.api-lang-dropdown.is-dark .el-select-dropdown__item {
  color: var(--zm-text-secondary);
}

.api-lang-dropdown .el-select-dropdown__item.is-selected,
.api-lang-dropdown .el-select-dropdown__item.hover,
.api-lang-dropdown .el-select-dropdown__item:hover {
  background: #f5f5f5;
  color: #000;
  font-weight: 400;
}

.dark .api-lang-dropdown .el-select-dropdown__item.is-selected,
.dark .api-lang-dropdown .el-select-dropdown__item.hover,
.dark .api-lang-dropdown .el-select-dropdown__item:hover,
.api-lang-dropdown.is-dark .el-select-dropdown__item.is-selected,
.api-lang-dropdown.is-dark .el-select-dropdown__item.hover,
.api-lang-dropdown.is-dark .el-select-dropdown__item:hover {
  background: var(--zm-bg-hover);
  color: var(--zm-text-primary);
}

.api-lang-dropdown .el-popper__arrow {
  display: none;
}

/* ===== Code Area (scoped under .api-float-container for specificity) ===== */
.api-float-container .api-content {
  min-height: auto;
  max-height: none;
  height: auto;
  background: transparent;
  overflow: visible;
  width: 100%;
  border-radius: 0;
}

.api-float-container .api-content pre {
  margin: 0;
  padding: 16px 20px;
  counter-reset: line-number;
}

.api-float-container .api-content pre code {
  display: block;
  padding: 0 !important;
  width: fit-content;
  min-width: 100%;
  font-family: "SF Mono", monospace;
  font-size: 0 !important;
  line-height: 0 !important;
  color: #000;
}

.dark .api-float-container .api-content pre code {
  color: var(--zm-text-primary);
}

/* Line numbers via CSS counters */
.api-float-container .api-content pre .line {
  display: block;
  font-size: 13px;
  line-height: 24px;
}

.api-float-container .api-content pre .line::before {
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

.dark .api-float-container .api-content pre .line::before {
  color: rgba(255, 255, 255, 0.2);
}

/* ===== Layout on API pages ===== */
.api-page .VPDoc .content {
  margin-right: min(400px, calc(100vw - 912px));
}

@media (min-width: 1520px) {
  .api-page .VPDoc .content {
    margin-right: min(554px, calc(100vw - 758px));
  }
  html.ai-panel-open .api-page .VPDoc .content {
    margin-right: min(400px, calc(100vw - 912px));
  }
}

@media (max-width: 1280px) {
  .api-page .VPDoc .content {
    margin-right: 0;
  }

  .VPDoc {
    padding-right: 20px;
  }
}
</style>
