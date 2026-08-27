import { onUnmounted, watch, type Ref } from "vue";

const activeLocks = new Set<symbol>();

function syncBodyLock() {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle(
    "zenmux-mobile-overlay-open",
    activeLocks.size > 0,
  );
}

export function useBodyScrollLock(active: Ref<boolean>) {
  const lockId = Symbol("body-scroll-lock");

  watch(
    active,
    (isActive) => {
      if (isActive) {
        activeLocks.add(lockId);
      } else {
        activeLocks.delete(lockId);
      }
      syncBodyLock();
    },
    { immediate: true },
  );

  onUnmounted(() => {
    activeLocks.delete(lockId);
    syncBodyLock();
  });
}
