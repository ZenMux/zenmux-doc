<template>
  <span class="login-button">
    <el-button type="primary" @click="handleClick" :disabled="isCopied">
      Login
    </el-button>
  </span>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ElButton } from 'element-plus'
import { useData } from 'vitepress'

export default defineComponent({
  name: 'LoginButton',
  components: {
    ElButton
  },
  setup() {
    const isCopied = ref(false);
    const { theme, page, frontmatter } = useData()

    const handleClick = () => {
      if (isCopied.value) return;
      window.open('https://zenmux.ai/settings/credits', '_blank');
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
.login-button {
  display: flex;
  align-items: center;
  padding: 0 12px;
  line-height: var(--vp-nav-height);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}
</style>
