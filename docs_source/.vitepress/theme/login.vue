<template>
  <span class="login-button">
    <el-button
      v-if="!user && !isLoading"
      type="primary"
      @click="handleClick"
      :disabled="isCopied"
    >
      {{ labels.login }}
    </el-button>
    <my-icon
      v-else-if="isLoading"
      className="loading-icon"
      name="sync-circle"
      :style="{ animation: 'spin 2s linear infinite' }"
    >
      <el-icon-loading />
    </my-icon>
    <el-dropdown
      v-else-if="user"
      trigger="hover"
      placement="bottom-end"
      popper-class="docs-user-dropdown-popper"
    >
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
          <el-dropdown-item
            v-for="item in menuItems"
            :key="item.label"
            class="user-dropdown-item"
            @click="() => handleAction(item.slug)"
          >
            <span class="user-menu-row">
              <component :is="item.icon" class="user-menu-icon" />
              <span class="user-menu-label">{{ item.label }}</span>
            </span>
          </el-dropdown-item>
          <el-dropdown-item
            class="user-dropdown-item user-dropdown-item--signout"
            divided
            @click="goLogout"
          >
            <span class="user-menu-row">
              <ShutdownIcon class="user-menu-icon" />
              <span class="user-menu-label">{{ labels.signOut }}</span>
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent, ref, type Component } from "vue";
import "element-plus/theme-chalk/base.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/theme-chalk/el-button.css";
import "element-plus/theme-chalk/el-dropdown.css";
import "element-plus/theme-chalk/el-dropdown-menu.css";
import "element-plus/theme-chalk/el-dropdown-item.css";
import {
  ElButton,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
} from "element-plus";
import MyIcon from "./icon.vue";
import {
  Chat as ChatIcon,
  Costs as CostsIcon,
  IconKeychain as IconKeychainIcon,
  IconPay_as_you_go as IconPayAsYouGoIcon,
  IconSetting_01 as IconSettingIcon,
  IconSubscriptionWallet as IconSubscriptionWalletIcon,
  IconVideo as IconVideoIcon,
  Insurance as InsuranceIcon,
  Logs as LogsIcon,
  Shutdown as ShutdownIcon,
  Usage as UsageIcon,
} from "./icons";
import IconBillingIcon from "./icons/IconBilling.vue";
import { inBrowser } from "vitepress";
import { useAuth } from "./composables/use-auth";

interface UserMenuItem {
  label: string;
  slug: string;
  icon: Component;
}

export default defineComponent({
  name: "LoginButton",
  components: {
    ElButton,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
    MyIcon,
    ShutdownIcon,
  },
  setup() {
    const isCopied = ref(false);
    const { user, isLoading, logout } = useAuth();
    const labels = computed(() => {
      const isZh =
        inBrowser &&
        window.location.pathname.replace(/^\/docs/, "").startsWith("/zh");
      return isZh
        ? {
            login: "登录",
            signOut: "退出登录",
            chat: "对话",
            video: "视频",
            logs: "日志",
            cost: "费用",
            usage: "用量",
            insurance: "保险",
            paygApi: "PAYG API",
            subscriptionApi: "订阅 API",
            platformApi: "平台 API",
            billing: "账单",
            settings: "设置",
          }
        : {
            login: "Login",
            signOut: "Sign out",
            chat: "Chat",
            video: "Video",
            logs: "Logs",
            cost: "Cost",
            usage: "Usage",
            insurance: "Insurance",
            paygApi: "PAYG API",
            subscriptionApi: "Subscription API",
            platformApi: "Platform API",
            billing: "Billing",
            settings: "Settings",
          };
    });

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

    const menuItems = computed<UserMenuItem[]>(() => {
      const items: Array<UserMenuItem & { visible?: boolean }> = [
        {
          label: labels.value.chat,
          slug: "platform/chat",
          icon: ChatIcon,
        },
        {
          label: labels.value.video,
          slug: "platform/video",
          icon: IconVideoIcon,
          visible: Boolean(user.value?.flags?.internalMember),
        },
        {
          label: labels.value.logs,
          slug: "platform/logs",
          icon: LogsIcon,
        },
        {
          label: labels.value.cost,
          slug: "platform/cost",
          icon: CostsIcon,
        },
        {
          label: labels.value.usage,
          slug: "platform/usage",
          icon: UsageIcon,
        },
        {
          label: labels.value.insurance,
          slug: "platform/insurance",
          icon: InsuranceIcon,
        },
        {
          label: labels.value.paygApi,
          slug: "platform/pay-as-you-go",
          icon: IconPayAsYouGoIcon,
        },
        {
          label: labels.value.subscriptionApi,
          slug: "platform/subscription",
          icon: IconSubscriptionWalletIcon,
        },
        {
          label: labels.value.platformApi,
          slug: "platform/management",
          icon: IconKeychainIcon,
        },
        {
          label: labels.value.billing,
          slug: "platform/billing",
          icon: IconBillingIcon,
        },
        {
          label: labels.value.settings,
          slug: "platform/settings",
          icon: IconSettingIcon,
        },
      ];

      return items.filter((item) => item.visible !== false);
    });

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
      labels,
      menuItems,
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
  margin-right: -16px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  line-height: var(--vp-nav-height);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
  cursor: pointer;

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
  width: 32px;
  height: 32px;
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

.user-menu-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 32px;
  min-width: 0;
}

.user-menu-icon {
  width: 14px;
  height: 14px;
  flex: 0 0 14px;
  color: #858585;
}

.user-menu-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: #333;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:global(.docs-user-dropdown-popper.el-popper) {
  z-index: 9999;
}

:global(.docs-user-dropdown-popper.el-popper.is-light) {
  border: none;
  border-radius: 12px;
  background: transparent;
  box-shadow: none;
}

:global(.docs-user-dropdown-popper .el-popper__arrow) {
  display: none;
}

:global(.docs-user-dropdown-popper .el-scrollbar) {
  border-radius: 12px;
}

:global(.docs-user-dropdown-popper .el-dropdown-menu) {
  min-width: 200px;
  padding: 4px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  background: #fff;
  box-shadow:
    0 0 1px rgba(0, 0, 0, 0.17),
    0 14px 14px rgba(0, 0, 0, 0.05);
}

:global(.docs-user-dropdown-popper .el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  color: #333;
  line-height: 32px;
}

:global(.docs-user-dropdown-popper .el-dropdown-menu__item:hover),
:global(.docs-user-dropdown-popper .el-dropdown-menu__item:focus) {
  background: #f5f5f5;
  color: #333;
}

:global(.docs-user-dropdown-popper .el-dropdown-menu__item--divided) {
  margin-top: 4px;
  border-top: 1px solid #ededed;
}

:global(.docs-user-dropdown-popper .el-dropdown-menu__item--divided::before) {
  display: none;
}

:global(.dark .docs-user-dropdown-popper .el-dropdown-menu) {
  border-color: #3a3a3a;
  background: #1f1f1f;
  box-shadow:
    0 0 1px rgba(0, 0, 0, 0.5),
    0 14px 14px rgba(0, 0, 0, 0.22);
}

:global(.dark .docs-user-dropdown-popper .el-dropdown-menu__item:hover),
:global(.dark .docs-user-dropdown-popper .el-dropdown-menu__item:focus) {
  background: #2a2a2a;
}

:global(.dark .docs-user-dropdown-popper .el-dropdown-menu__item--divided) {
  border-top-color: #333;
}

:global(.dark .docs-user-dropdown-popper .user-menu-label) {
  color: #f2f2f2;
}
</style>
