<template>
  <div class="select-dropdown">
    <button class="copy-page-btn" @click="handleClick">
      <CopyIcon v-if="!isCopied" class="btn-icon" />
      <CheckedIcon v-else class="btn-icon" />
      <span>{{ isCopied ? 'Copied' : 'Copy page' }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import LZString from 'lz-string';
import copyToClipboard from 'copy-to-clipboard';
import { useData } from 'vitepress'
import { Copy as CopyIcon, Checked as CheckedIcon } from './icons';

export default defineComponent({
  name: 'SelectDropdown',
  components: { CopyIcon, CheckedIcon },
  setup() {
    const isCopied = ref(false);
    const { page } = useData()

    const handleClick = () => {
      if (isCopied.value) return;
      // @ts-expect-error not error
      copyToClipboard(LZString.decompressFromBase64(page.value.content))
      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 2000);
    };

    return {
      isCopied,
      handleClick
    };
  }
});
</script>

<style scoped>
.select-dropdown {
  display: flex;
  justify-content: end;
  transform: translateY(-100%);
}

.copy-page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  height: 32px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-family: var(--zenmux-nav-font, -apple-system, sans-serif);
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  color: #333;
  text-transform: capitalize;
  transition: border-color 0.2s, color 0.2s;
}

.copy-page-btn:hover {
  border-color: #ccc;
  color: #000;
}

:global(.dark) .copy-page-btn {
  color: #ccc;
  border-color: #444;
}

:global(.dark) .copy-page-btn:hover {
  color: #fff;
  border-color: #666;
}

.copy-page-btn .btn-icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
}
</style>
