import { ref } from 'vue'

const MAX_IMAGES = 4
const MAX_SIZE_BYTES = 10 * 1024 * 1024
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp']

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function useImageAttach() {
  const pendingImages = ref<string[]>([])
  const errorMessage = ref('')
  let errorTimer: ReturnType<typeof setTimeout> | null = null

  function setError(msg: string) {
    errorMessage.value = msg
    if (errorTimer) clearTimeout(errorTimer)
    errorTimer = setTimeout(() => { errorMessage.value = '' }, 4000)
  }

  async function addFiles(files: FileList | File[]) {
    errorMessage.value = ''
    for (const file of Array.from(files)) {
      if (pendingImages.value.length >= MAX_IMAGES) {
        setError(`Maximum ${MAX_IMAGES} images per message`)
        break
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Only PNG, JPG, GIF, and WebP images are supported')
        continue
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError('Image must be under 10MB')
        continue
      }
      const dataUrl = await fileToDataUrl(file)
      pendingImages.value = [...pendingImages.value, dataUrl]
    }
  }

  function removeImage(index: number) {
    pendingImages.value = pendingImages.value.filter((_, i) => i !== index)
  }

  function clearImages() {
    pendingImages.value = []
    errorMessage.value = ''
  }

  return { pendingImages, errorMessage, addFiles, removeImage, clearImages }
}
