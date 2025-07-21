<template>
  <div class="select-dropdown">
    <el-dropdown split-button @click="handleClick">
      <span v-if="!isCopied"><my-icon name="copy"></my-icon> Copy Page</span>
      <span v-else><my-icon name="checkmark"></my-icon> Copied</span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleClick">
            <div class="dropdown-item">
              <div>
                <span v-if="!isCopied">
                  <my-icon name="copy"></my-icon>
                  Copy Page
                </span>
                <span v-else>Copied</span>
              </div>
              <div class="dropdown-item-description">
                Copy this page as Markdown for LLMs
              </div>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'
import copyToClipboard from 'copy-to-clipboard';
import { useData } from 'vitepress'
import MyIcon from './icon.vue';

export default defineComponent({
  name: 'SelectDropdown',
  components: {
    ElButton,
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
    MyIcon
  },
  setup() {
    const isCopied = ref(false);
    const isOpen = ref(false);
    const selected = ref('Select an option');
    const { theme, page, frontmatter } = useData()

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    const selectOption = (option: string) => {
      selected.value = option;
      isOpen.value = false;
    };

    const handleClick = () => {
      if (isCopied.value) return;
      // @ts-expect-error not error
      copyToClipboard(atob(page.value.content))
      console.log('Button clicked!', page.value);
      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 2000);
    };

    return {
      isOpen,
      isCopied,
      selected,
      toggleDropdown,
      selectOption,
      handleClick
    };
  }
});

</script>

<style scoped>
.dropdown-item {
  flex-direction: column;
}

.dropdown-item-description {
  font-size: 12px;
  color: #999;
}

.select-dropdown {
  display: flex;
  justify-content: end;
  transform: translateY(-100%);
}
</style>