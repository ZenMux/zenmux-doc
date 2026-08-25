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
        <span class="user-avatar-trigger">
          <span class="user-avatar-wrap">
            <img
              v-if="activeAvatarUrl"
              :src="getAvatarUrl(activeAvatarUrl)"
              :alt="activeDisplayName ? `${activeDisplayName} avatar` : 'avatar'"
              class="user-avatar"
            />
            <span v-else class="user-avatar text-avatar">
              {{ activeDisplayName ? activeDisplayName.charAt(0).toUpperCase() : "" }}
            </span>
            <span v-if="membershipPlanKey" class="avatar-membership-ring-clip" aria-hidden="true">
              <span
                class="avatar-membership-ring"
                :class="membershipPlanClass"
              />
            </span>
            <span
              v-if="membershipPlanKey"
              class="membership-plan-tag"
              :aria-label="`${membershipPlanLabel} member`"
            >
              <span class="membership-plan-icon-wrap">
                <span class="membership-plan-icon-background" />
                <IconSubscriptionColor class="membership-plan-icon" />
              </span>
              <span class="membership-plan-label" :class="membershipPlanClass">
                {{ membershipPlanLabel }}
              </span>
            </span>
          </span>
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
import IconSubscriptionColor from "./icons/IconSubscriptionColor.vue";
import { inBrowser } from "vitepress";
import { useAuth } from "./composables/use-auth";

interface UserMenuItem {
  label: string;
  slug: string;
  icon: Component;
}

const PLAN_STYLE_CLASSES: Record<string, string> = {
  pro: "membership-plan--pro",
  starter: "membership-plan--starter",
  max: "membership-plan--max",
  ultra: "membership-plan--ultra",
};

function formatPlanLabel(planKey: string) {
  return planKey.charAt(0).toUpperCase() + planKey.slice(1);
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
    IconSubscriptionColor,
  },
  setup() {
    const isCopied = ref(false);
    const { user, isLoading, logout } = useAuth();
    const activeAccount = computed(() => user.value?.activeAccount);
    const activeAvatarUrl = computed(
      () => activeAccount.value?.avatarUrl || user.value?.avatarUrl || "",
    );
    const activeDisplayName = computed(
      () => activeAccount.value?.displayName || user.value?.displayName || "",
    );
    const membershipPlanKey = computed(() => {
      const account = activeAccount.value;
      if (
        !user.value?.flags?.subscription ||
        account?.type.toLowerCase() === "organization"
      ) {
        return null;
      }

      const planKey = account?.subscriptionPlanKey?.trim().toLowerCase();
      return planKey && planKey !== "free" ? planKey : null;
    });
    const membershipPlanClass = computed(() => {
      const planKey = membershipPlanKey.value;
      if (!planKey) return "";
      return PLAN_STYLE_CLASSES[planKey] || "membership-plan--free";
    });
    const membershipPlanLabel = computed(() => {
      const planKey = membershipPlanKey.value;
      return planKey ? formatPlanLabel(planKey) : "";
    });
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
      activeAvatarUrl,
      activeDisplayName,
      membershipPlanKey,
      membershipPlanClass,
      membershipPlanLabel,
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

.user-avatar-trigger {
  width: 32px;
  height: 32px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar-wrap {
  position: relative;
  display: block;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
}

.user-avatar {
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  border: 0.5px solid var(--vp-c-divider);
  border-radius: 50%;
  object-fit: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-membership-ring-clip {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  width: 36px;
  height: 36px;
  overflow: hidden;
  clip-path: inset(0 0 20% 0);
  pointer-events: none;
  transform: translate(-50%, -50%);
}

.avatar-membership-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  box-sizing: border-box;
  width: 36px;
  height: 36px;
  border-width: 1.5px;
  border-style: solid;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.membership-plan-tag {
  position: absolute;
  bottom: -6px;
  left: 50%;
  z-index: 2;
  display: flex;
  align-items: center;
  white-space: nowrap;
  transform: translateX(-50%) scale(0.7);
  transform-origin: center bottom;
}

.membership-plan-icon-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  width: 21px;
  height: 21px;
  flex: 0 0 21px;
}

.membership-plan-icon-background {
  position: absolute;
  top: 44%;
  left: 51%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  transform: translate(-50%, -50%);
}

.membership-plan-icon {
  position: relative;
  z-index: 1;
  width: 21px;
  height: 21px;
  color: #fda829;
}

.membership-plan-label {
  box-sizing: border-box;
  height: 16px;
  margin-left: -10px;
  padding: 0 6px 0 12px;
  border-radius: 0 8px 8px 0;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
}

.avatar-membership-ring.membership-plan--pro {
  border-color: #bd5d1a;
}

.membership-plan-label.membership-plan--pro {
  border: 0.5px solid rgba(0, 0, 0, 0.1);
  background: linear-gradient(156.66deg, #ff7402 -6.78%, #cd3100 154.9%);
}

.avatar-membership-ring.membership-plan--starter {
  border-color: #166cde;
}

.membership-plan-label.membership-plan--starter {
  border: 0.5px solid rgba(0, 0, 0, 0.1);
  background: linear-gradient(156.66deg, #267aff -6.78%, #0d4eb8 154.9%);
}

.avatar-membership-ring.membership-plan--max {
  border-color: #3a4777;
}

.membership-plan-label.membership-plan--max {
  border: 0.5px solid rgba(0, 0, 0, 0.1);
  background: linear-gradient(166.04deg, #415a9b 12.32%, #282e4c 179.9%);
  line-height: 15px;
}

.avatar-membership-ring.membership-plan--ultra {
  border-color: #292f36;
}

.membership-plan-label.membership-plan--ultra {
  background: linear-gradient(192.55deg, #4f5c7e -85.39%, #101114 112.86%);
  line-height: 16px;
}

.avatar-membership-ring.membership-plan--free {
  border-color: #e5e5e5;
}

.membership-plan-label.membership-plan--free {
  background: #e5e5e5;
  color: #000;
  line-height: 16px;
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

@media (max-width: 959px) {
  .login-button {
    margin-right: 0;
    padding: 0;
    line-height: 60px;
  }

  .login-button button.el-button {
    min-height: 32px;
    padding: 7px 10px;
    font-size: 13px;
  }

  .user-avatar-trigger {
    width: 40px;
    height: 40px;
    margin-left: 0;
    outline: none;
  }

  .user-avatar-wrap {
    width: 40px;
    height: 40px;
    flex-basis: 40px;
  }

  .user-avatar {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 32px;
    height: 32px;
  }

  .avatar-membership-ring-clip {
    top: 0;
    left: 0;
    width: 40px;
    height: 36px;
    clip-path: none;
    transform: none;
  }

  .avatar-membership-ring {
    top: 20px;
    left: 20px;
    width: 36.5px;
    height: 36.5px;
  }

  .membership-plan-tag {
    bottom: 2px;
    transform: translateX(-50%);
  }

  .membership-plan-icon-wrap,
  .membership-plan-icon {
    width: 13px;
    height: 12px;
    flex-basis: 13px;
  }

  .membership-plan-icon-background {
    display: none;
  }

  .membership-plan-label {
    height: 12px;
    margin-left: -6px;
    padding: 0 4px 0 8px;
    border-radius: 0 20px 20px 0;
    font-size: 9px;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.54px;
  }

  .membership-plan-label.membership-plan--max {
    background: linear-gradient(174.32deg, #465997 12.315%, #292e49 179.9%);
    line-height: normal;
  }

  .loading-icon {
    margin-left: 0;
  }
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
