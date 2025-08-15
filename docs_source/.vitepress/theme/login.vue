<template>
  <span class="login-button">
    <el-button
      v-if="!user && !isLoading"
      type="primary"
      @click="handleClick"
      :disabled="isCopied"
    >
      Login
    </el-button>
    <my-icon v-else-if="isLoading" className="loading-icon" name="sync-circle" :style="{ animation: 'spin 2s linear infinite' }">
      <el-icon-loading />
    </my-icon>
    <el-dropdown v-else-if="user">
      <template #default>
        <img
          v-if="user.avatarUrl"
          :src="user.avatarUrl"
          alt="avatar"
          class="user-avatar"
        />
        <span
          v-else
          class="user-avatar text-avatar"
        >
          {{ user.displayName ? user.displayName.charAt(0) : '' }}
        </span>
      </template>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="goSettings">Settings</el-dropdown-item>
          <el-dropdown-item @click="goCredits">Credits</el-dropdown-item>
          <el-dropdown-item @click="goApiKeys">API Keys</el-dropdown-item>
          <el-dropdown-item @click="logout">Sign out</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import MyIcon from './icon.vue';
import { useData } from 'vitepress'
import { info } from '../../component/server';

export default defineComponent({
  name: 'LoginButton',
  components: {
    ElButton,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
    MyIcon,
  },
  setup() {
    const isCopied = ref(false);
    const isLoading = ref(true);
    const user = ref<{
      userId: string;
      accountId: string;
      loginType: string;
      avatarUrl: string;
      displayName: string;
      email: string;
    } | null>(null);
    const { theme, page, frontmatter } = useData()

    info().then(res => {
      console.log('User info:', res);
      if (res.data.success) {
        user.value = res.data.data as any;
      }
      isLoading.value = false;
      console.info('User info loaded:', user.value);
    }).catch(err => {
      console.error('Failed to fetch user info:', err);
      isLoading.value = false;
    });

    const handleClick = () => {
      if (isCopied.value) return;
      window.open('https://zenmux.ai/settings/credits', '_blank');
      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 2000);
    };

    const logout = () => {
      user.value = null;
      // 可在此处添加实际的登出逻辑
    };

    const goSettings = () => {
      window.open('https://zenmux.ai/settings', '_blank');
    };
    const goCredits = () => {
      window.open('https://zenmux.ai/settings/credits', '_blank');
    };
    const goApiKeys = () => {
      window.open('https://zenmux.ai/settings/keys', '_blank');
    };

    return {
      user,
      isCopied,
      handleClick,
      logout,
      isLoading,
      goSettings,
      goCredits,
      goApiKeys
    };
  }
});
</script>
<style scoped>
.login-button {
  margin-right: -24px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  line-height: var(--vp-nav-height);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
  cursor: pointer;
}
.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-left: 10px;
  object-fit: cover;
  box-shadow: 0 1px 4px var(--vp-c-gray-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}
.text-avatar {
  background: var(--vp-c-gray-3);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-indigo-1);
  font-size: 16px;
  font-weight: bold;
  object-fit: contain;
}
.loading-icon {
  font-size: 22px;
  margin-left: 10px;
}
</style>
