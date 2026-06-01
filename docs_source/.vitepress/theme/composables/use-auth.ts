import { ref } from 'vue'
import { inBrowser } from 'vitepress'
import { info, logout as logoutApi } from '../../../component/server'

export interface UserInfo {
  userId: string
  accountId: string
  loginType: string
  avatarUrl: string
  displayName: string
  email: string
  flags?: {
    subscription?: boolean
    internalMember?: boolean
  }
}

const user = ref<UserInfo | null>(null)
const isLoading = ref(true)
let fetched = false

function isLocalPreview() {
  return (
    inBrowser &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')
  )
}

function useLocalPreviewUser() {
  user.value = {
    userId: 'local-preview-user',
    accountId: 'local-preview-account',
    loginType: 'local',
    avatarUrl: '',
    displayName: 'ZenMux',
    email: 'local-preview@zenmux.ai',
    flags: {
      subscription: true,
      internalMember: true,
    },
  }
}

function fetchUser() {
  if (fetched || !inBrowser) return
  fetched = true
  info()
    .then((res) => {
      if (res.data.success) {
        user.value = res.data.data as any
      } else if (isLocalPreview()) {
        useLocalPreviewUser()
      }
    })
    .catch(() => {
      if (isLocalPreview()) {
        useLocalPreviewUser()
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}

function logout() {
  user.value = null
  if (inBrowser) {
    logoutApi()
  }
}

export function useAuth() {
  fetchUser()
  return { user, isLoading, logout }
}
