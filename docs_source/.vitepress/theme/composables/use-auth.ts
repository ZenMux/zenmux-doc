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

function fetchUser() {
  if (fetched || !inBrowser) return
  fetched = true
  info()
    .then((res) => {
      if (res.data.success) {
        user.value = res.data.data as any
      }
    })
    .catch(() => {})
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
