<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { useData } from "vitepress";
import { useRequestVariant } from "./composables/use-request-variant";

const { variants, currentVariant } = useRequestVariant();
const { lang } = useData();
const root = ref<HTMLElement>();

function onTabKeydown(event: KeyboardEvent, index: number) {
  let next = index;
  if (event.key === "ArrowRight") next = (index + 1) % variants.value.length;
  else if (event.key === "ArrowLeft") {
    next = (index + variants.value.length - 1) % variants.value.length;
  } else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = variants.value.length - 1;
  else return;

  event.preventDefault();
  currentVariant.value = variants.value[next];
  root.value?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
}

async function revealHashTarget() {
  let id: string;
  try {
    id = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return;
  }
  const target = document.getElementById(id);
  if (!target || !root.value?.contains(target)) return;

  const variantId = target.closest<HTMLElement>("[data-request-variant]")
    ?.dataset.requestVariant;
  const variant = variants.value.find((item) => item.id === variantId);
  if (variant) currentVariant.value = variant;
  await nextTick();

  // A shared field can also live inside the multipart request's details panel.
  let parent = target.parentElement;
  while (parent && parent !== root.value) {
    if (parent instanceof HTMLDetailsElement) parent.open = true;
    parent = parent.parentElement;
  }
  target.scrollIntoView({ block: "start" });
}

onMounted(() => {
  revealHashTarget();
  window.addEventListener("hashchange", revealHashTarget);
});
onUnmounted(() => window.removeEventListener("hashchange", revealHashTarget));
</script>

<template>
  <section v-if="currentVariant" ref="root" class="request-body">
    <div
      class="request-body-tabs"
      role="tablist"
      :aria-label="lang.startsWith('zh') ? '请求方式' : 'Request format'"
    >
      <button
        v-for="(variant, index) in variants"
        :id="`request-body-tab-${variant.id}`"
        :key="variant.id"
        type="button"
        role="tab"
        :aria-selected="variant.id === currentVariant.id"
        :aria-controls="`request-body-panel-${currentVariant.id}`"
        :tabindex="variant.id === currentVariant.id ? 0 : -1"
        @click="currentVariant = variant"
        @keydown="onTabKeydown($event, index)"
      >
        {{ variant.label }}
      </button>
    </div>
    <div
      :id="`request-body-panel-${currentVariant.id}`"
      role="tabpanel"
      :aria-labelledby="`request-body-tab-${currentVariant.id}`"
      tabindex="0"
    >
      <slot :variant="currentVariant.id" />
    </div>
  </section>
</template>

<style scoped>
.request-body :deep([id]) {
  scroll-margin-top: calc(
    var(--vp-nav-height) + var(--zenmux-doc-tabs-height, 48px) + 24px
  );
}
.request-body-tabs {
  display: flex;
  gap: 24px;
  margin: 20px 0 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.request-body-tabs button {
  padding: 8px 2px 12px;
  border-bottom: 2px solid transparent;
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.request-body-tabs button[aria-selected="true"] {
  border-bottom-color: var(--vp-c-text-1);
  color: var(--vp-c-text-1);
  font-weight: 600;
}
.request-body-tabs button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}
.request-body :deep(.request-fields.is-nested) {
  margin: 16px 0 24px;
  padding: 0 16px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
.request-body :deep(.request-fields.is-nested:not([open])) {
  padding-bottom: 0;
}
.request-body :deep(.request-fields summary) {
  padding: 12px 0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.request-body :deep(.request-fields.is-nested h3) {
  margin-top: 20px;
  font-size: 16px;
}
.request-body :deep(.request-fields.is-nested h4),
.request-body :deep(.request-fields.is-nested h5) {
  font-size: 14px;
}
</style>
