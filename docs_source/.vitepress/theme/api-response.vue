<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import MyIcon from './icon.vue';
import { useData, inBrowser } from 'vitepress';

const { frontmatter, page } = useData();

const isApiResponse = computed(
  () => frontmatter.value.pageClass === 'api-page',
);

const responseCodes = ref<Record<string, string>>({});
const currentLang = ref('');
const langOptions = ref<string[]>([]);
const responseTitle = ref('Response');

const copied = ref(false);

function initResponseData() {
  if (!inBrowser) return;
  const dom = document.querySelector<HTMLElement>('.api-response');
  if (dom) {
    responseTitle.value = dom.dataset.info || 'Response';
  }

  dom?.querySelectorAll('.vp-adaptive-theme').forEach((theme) => {
    const pre = theme.querySelector('pre');
    const lang = theme.querySelector('.lang')?.textContent?.trim() || '';
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
    currentLang.value = '';
    langOptions.value = [];
    responseTitle.value = 'Response';
    copied.value = false;
    initResponseData();
  },
);

const rendered = computed(() => responseCodes.value[currentLang.value] || '');
const renderedPlain = computed(() => htmlToPlain(rendered.value));

function htmlToPlain(html: string) {
  if (!html) return '';
  if (!inBrowser) return html.replace(/<[^>]*>/g, '');
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}

async function copyText(text: string) {
  if (!inBrowser) return;
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

async function copyResponse() {
  if (!renderedPlain.value) return;
  await copyText(renderedPlain.value);
  copied.value = true;
  ElMessage.success('Response copied');
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
            :name="copied ? 'checkmark-done-circle-outline' : 'copy-outline'"
            :class="{ 'copied-icon': copied }"
            style="margin-left: 16px; cursor: pointer; font-size: 18px"
            :title="copied ? 'Copied' : 'Copy response'"
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
.api-response {
  display: none;
}

.api-response-float-container {
  width: 100%;
}

.api-response-container {
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

    .response-title {
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
      background: var(--vp-c-brand-3);
      color: #fff;
      border: 1px solid var(--vp-c-brand-3);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1),
        0 0 0 1px rgba(255, 255, 255, 0.05) inset;
      user-select: none;
      transition: background 0.25s, box-shadow 0.25s, transform 0.15s;
    }

    .response-title:hover {
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.05) inset;
    }

    .response-title:active {
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

@media (max-width: 1280px) {
  .VPDoc {
    padding-right: 20px;
  }
}
</style>
