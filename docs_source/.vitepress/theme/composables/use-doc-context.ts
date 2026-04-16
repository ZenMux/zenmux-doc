import { computed } from 'vue'
import { useData } from 'vitepress'

export function useDocContext() {
  const { lang, page } = useData()
  const isZh = computed(() => lang.value === 'zh-CN' || page.value.filePath?.startsWith('zh/'))
  return { isZh }
}
