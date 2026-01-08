<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { ElMessage, ElSelect, ElOption } from 'element-plus';
import MyIcon from './icon.vue';
import { useData, inBrowser } from 'vitepress';

const { frontmatter, page } = useData();

const isApiRequest = computed(() => frontmatter.value.pageClass === 'api-page');

const requestCodes = ref<Record<string, string>>({});
const responseCodes = ref<Record<string, string>>({});
const currentLang = ref('');
const langOptions = ref<string[]>([]);
const httpMethod = ref('GET');
const requestURL = ref('');

const copiedReq = ref(false);
const copiedResp = ref(false);
const copiedPath = ref(false);

function initRequestData() {
  if (!inBrowser) return;
  const dom = document.querySelector<HTMLElement>('.api-request');
  if (dom) {
    dom.dataset.info
      ?.trim()
      .toUpperCase()
      .split(' ')
      .forEach((part) => {
        if (
          part &&
          ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'].includes(
            part,
          )
        ) {
          httpMethod.value = part;
        } else if (part) {
          requestURL.value = part.toLowerCase();
        }
      });
  }
  dom?.querySelectorAll('.vp-adaptive-theme').forEach((theme) => {
    const pre = theme.querySelector('pre');
    const lang = theme.querySelector('.lang')?.textContent?.trim() || '';
    if (!lang || !pre) return;
    const html = pre.innerHTML; // 含高亮标签
    if (lang === 'json') {
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
    currentLang.value = '';
    langOptions.value = [];
    httpMethod.value = 'GET';
    requestURL.value = '';
    copiedReq.value = false;
    copiedResp.value = false;
    copiedPath.value = false;
    // 重新初始化
    initRequestData();
  },
);

const rendered = computed(() => requestCodes.value[currentLang.value] || '');
const renderedPlain = computed(() => htmlToPlain(rendered.value));
const json = computed(() => responseCodes.value['json'] || '');
const jsonPlain = computed(() => htmlToPlain(json.value));

function htmlToPlain(html: string) {
  if (!html) return '';
  if (!inBrowser) return html.replace(/<[^>]*>/g, ''); // SSR fallback: strip HTML tags
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}

async function copyText(text: string) {
  if (!inBrowser) return; // Skip copy function during SSR
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  } catch (e) {
    console.warn('copy failed', e);
  }
}

async function copyRequest() {
  if (!renderedPlain.value) return;
  await copyText(renderedPlain.value);
  copiedReq.value = true;
  ElMessage.success('Request copied');
  setTimeout(() => (copiedReq.value = false), 2000);
}

async function copyResponse() {
  if (!jsonPlain.value) return;
  await copyText(jsonPlain.value);
  copiedResp.value = true;
  ElMessage.success('Response copied');
  setTimeout(() => (copiedResp.value = false), 2000);
}

async function copyPath() {
  if (!requestURL.value) return;
  await copyText(requestURL.value);
  copiedPath.value = true;
  ElMessage.success('Path copied');
  setTimeout(() => (copiedPath.value = false), 1500);
}
</script>

<template>
  <div v-if="isApiRequest" class="api-float-container">
    <div class="api-request-container">
      <div class="api-header">
        <div class="left">
          <span
            class="http-method"
            :class="httpMethod.toLowerCase()"
            v-text="httpMethod"
          ></span>
          <span
            class="http-path"
            :class="{ copied: copiedPath }"
            v-text="requestURL"
            @click="copyPath"
            title="Click to copy path"
          ></span>
        </div>
        <div class="right">
          <el-select
            v-model="currentLang"
            placeholder="Lang"
            size="small"
            style="width: 120px"
          >
            <el-option
              v-for="l in langOptions"
              :key="l"
              :label="l"
              :value="l"
            />
          </el-select>
          <my-icon
            :name="copiedReq ? 'checkmark-done-circle-outline' : 'copy-outline'"
            :class="{ 'copied-icon': copiedReq }"
            style="margin-left: 16px; cursor: pointer; font-size: 18px"
            :title="copiedReq ? 'Copied' : 'Copy code'"
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
          <my-icon
            :name="
              copiedResp ? 'checkmark-done-circle-outline' : 'copy-outline'
            "
            style="margin-left: 16px; cursor: pointer; font-size: 18px"
            :title="copiedResp ? 'Copied' : 'Copy response'"
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
.api-request {
  display: none;
}

.api-float-container {
  width: 100%;
}

.api-request-container {
  margin: 20px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg);

  pre {
    max-height: calc(50vh - 140px);
  }
}

.api-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-family: monospace;
  font-size: 14px;
  padding: 8px;
  border-bottom: 1px solid var(--vp-c-divider);

  .left {
    display: flex;
    align-items: center;

    .http-method {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      font-weight: 600;
      color: var(--vp-c-success);
      margin-right: 8px;
      text-transform: uppercase;
    }

    span:not(.http-method) {
      color: var(--vp-c-text-1);
      word-break: break-all;
    }

    .reponse-code {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 48px;
      height: 24px;
      padding: 0 10px;
      font-size: 12px;
      font-weight: 600;
      line-height: 1;
      letter-spacing: 0.5px;
      border-radius: 999px;
      background: var(--vp-c-green-3);
      color: #fff;
      border: 1px solid var(--vp-c-green-3);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1),
        0 0 0 1px rgba(255, 255, 255, 0.05) inset;
      user-select: none;
      transition: background 0.25s, box-shadow 0.25s, transform 0.15s;
    }

    .reponse-code:hover {
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.05) inset;
    }

    .reponse-code:active {
      transform: translateY(1px);
    }
  }

  .right {
    .el-select {
      width: 200px;
    }
  }
}

.api-content {
  min-height: 100px;
  border-radius: 4px;
  background-color: var(--vp-c-bg-2);
  overflow: auto;
  width: 100%;
}

.api-content pre {
  margin: 0;
}

.api-content pre code {
  display: block;
  padding: 0 24px;
  width: fit-content;
  min-width: 100%;
  line-height: var(--vp-code-line-height);
  font-size: var(--vp-code-font-size);
  color: var(--vp-code-block-color);
  transition: color 0.5s;
}

.api-header .right .copied-icon {
  color: var(--vp-c-success);
  transition: color 0.25s;
}

.api-header .left .http-path {
  /* updated: add pill padding and stronger radius */
  padding: 2px 8px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
  position: relative;
  transition: background-color 0.2s, color 0.2s, box-shadow 0.25s;
}

.api-header .left .http-path:hover {
  /* updated: softer brand/bg highlight */
  background-color: var(--vp-c-bg-soft, var(--vp-c-bg-2));
  box-shadow: 0 0 0 1px var(--vp-c-divider) inset;
  text-decoration: none;
}

.api-header .left .http-path.copied {
  background-color: var(--vp-c-success);
  color: #fff;
  box-shadow: 0 0 0 1px var(--vp-c-success) inset;
}

.api-header .left .http-path.copied::after {
  /* removed: using ElMessage instead of inline badge */
  content: none;
}

.api-page .VPDoc .content {
  margin-right: min(500px, calc(100vw - 912px));
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
