<template>
  <div class="select-dropdown">
    <el-dropdown @click="handleClick">
      <el-button-group>
        <el-button @click="handleClick">
          <span v-if="!isCopied"><my-icon name="lucide/copy"></my-icon> Copy Page </span>
          <span v-else><my-icon name="lucide/copy-check"></my-icon> Copied</span>
        </el-button>
        <el-button class="button-with-caret">
          <my-icon name="lucide/chevron-down"></my-icon>
        </el-button>
      </el-button-group>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleClick">
            <div class="dropdown-item">
              <div>
                <span v-if="!isCopied">
                  <my-icon name="lucide/copy"></my-icon>
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
import LZString from 'lz-string';
import { ElButton, ElButtonGroup, ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'
import copyToClipboard from 'copy-to-clipboard';
import { useData } from 'vitepress'
import MyIcon from './icon.vue';

export default defineComponent({
  name: 'SelectDropdown',
  components: {
    ElButton,
    ElButtonGroup,
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
      console.log('Button clicked!', page.value);
      // @ts-expect-error not error
      copyToClipboard(LZString.decompressFromBase64(page.value.content))
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
.button-with-caret {
  padding: 0 8px;
}

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