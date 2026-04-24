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
    <my-icon
      v-else-if="isLoading"
      className="loading-icon"
      name="sync-circle"
      :style="{ animation: 'spin 2s linear infinite' }"
    >
      <el-icon-loading />
    </my-icon>
    <el-dropdown v-else-if="user">
      <template #default>
        <img
          v-if="user.avatarUrl"
          :src="getAvatarUrl(user.avatarUrl)"
          alt="avatar"
          class="user-avatar"
        />
        <span v-else class="user-avatar text-avatar">
          {{ user.displayName ? user.displayName.charAt(0) : "" }}
        </span>
      </template>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="() => handleAction('platform/chat')"
            >Chat</el-dropdown-item
          >
          <el-dropdown-item
            v-if="user?.flags?.internalMember"
            @click="() => handleAction('platform/video')"
            >Video</el-dropdown-item
          >
          <el-dropdown-item @click="() => handleAction('platform/logs')"
            >Logs</el-dropdown-item
          >
          <el-dropdown-item @click="() => handleAction('platform/cost')"
            >Cost</el-dropdown-item
          >
          <el-dropdown-item @click="() => handleAction('platform/usage')"
            >Usage</el-dropdown-item
          >
          <el-dropdown-item @click="() => handleAction('platform/insurance')"
            >Insurance</el-dropdown-item
          >
          <el-dropdown-item
            @click="() => handleAction('platform/pay-as-you-go')"
            >PAYG API</el-dropdown-item
          >
          <el-dropdown-item
            @click="() => handleAction('platform/subscription')"
            >Subscription API</el-dropdown-item
          >
          <el-dropdown-item @click="() => handleAction('platform/management')"
            >Platform API</el-dropdown-item
          >
          <el-dropdown-item @click="() => handleAction('platform/settings')"
            >Settings</el-dropdown-item
          >
          <el-dropdown-item @click="goLogout">Sign out</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  ElButton,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
} from "element-plus";
import MyIcon from "./icon.vue";
import { inBrowser } from "vitepress";
import { useAuth } from "./composables/use-auth";

export default defineComponent({
  name: "LoginButton",
  components: {
    ElButton,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
    MyIcon,
  },
  setup() {
    const isCopied = ref(false);
    const { user, isLoading, logout } = useAuth();

    const handleClick = () => {
      if (isCopied.value || !inBrowser) return;
      window.open("https://zenmux.ai/settings/credits", "_blank");
      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 2000);
    };

    const goLogout = () => {
      logout();
    };

    const goSettings = () => {
      if (inBrowser) {
        window.open("https://zenmux.ai/settings", "_blank");
      }
    };
    const goCredits = () => {
      if (inBrowser) {
        window.open("https://zenmux.ai/settings/credits", "_blank");
      }
    };
    const goApiKeys = () => {
      if (inBrowser) {
        window.open("https://zenmux.ai/settings/keys", "_blank");
      }
    };
    const goChat = () => {
      if (inBrowser) {
        window.open("https://zenmux.ai/settings/chat", "_blank");
      }
    };
    const goLogs = () => {
      if (inBrowser) {
        window.open("https://zenmux.ai/settings/activity", "_blank");
      }
    };

    const handleAction = (slug: string) => {
      if (inBrowser) {
        window.open("https://zenmux.ai/" + slug, "_blank");
      }
    };

    const getAvatarUrl = (url: string) => {
      if (!url) return "";
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
      }
      return `https://zenmux.ai/api/frontend/public/image/${url.replace(
        /^\/+/,
        "",
      )}`;
    };

    return {
      user,
      isCopied,
      handleClick,
      goLogout,
      isLoading,
      goSettings,
      goCredits,
      goApiKeys,
      goChat,
      goLogs,
      handleAction,
      getAvatarUrl,
    };
  },
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
  margin-left: 16px;

  button.el-button {
    background-color: #000;
    border: none;
    border-radius: 6px;

    &:hover {
      background-color: #333;
    }
  }
}

.dark .login-button button.el-button {
  background-color: #f2f2f2;
  border: none;
  color: #000;

  &:hover {
    background-color: #ccc;
  }
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
