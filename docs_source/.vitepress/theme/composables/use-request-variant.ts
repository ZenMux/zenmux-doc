import { computed, inject, type InjectionKey, type Ref } from "vue";
import { useData } from "vitepress";

export interface RequestVariant {
  id: string;
  label: string;
  example: string;
}

export interface RequestVariantSelection {
  page: string;
  id: string;
}

// Provided per app so selections are neither shared across SSR requests nor
// applied to a different page when navigating through the documentation.
export const requestVariantKey: InjectionKey<Ref<RequestVariantSelection | null>> =
  Symbol("request-variant");

export function useRequestVariant() {
  const { page, frontmatter } = useData();
  const selection = inject(requestVariantKey)!;
  const variants = computed<RequestVariant[]>(
    () => frontmatter.value.requestVariants || [],
  );
  const currentVariant = computed({
    get: () =>
      variants.value.find(
        (variant) =>
          selection.value?.page === page.value.filePath &&
          variant.id === selection.value.id,
      ) || variants.value[0],
    set: (variant: RequestVariant | undefined) => {
      if (variant && variants.value.some((item) => item.id === variant.id)) {
        selection.value = { page: page.value.filePath, id: variant.id };
      }
    },
  });

  return { variants, currentVariant };
}
