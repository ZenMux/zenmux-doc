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
  activeAccount?: AccountContext
  flags?: {
    subscription?: boolean
    subscriptionInsider?: boolean
    internalMember?: boolean
  }
}

export interface AccountContext {
  accountId: string
  type: string
  displayName: string
  avatarUrl: string
  subscriptionPlanKey?: string | null
  subscriptionExpireAt?: string | null
}

interface AccountContextPayload {
  accountId?: unknown
  type?: unknown
  displayName?: unknown
  avatarUrl?: unknown
  subscriptionPlanKey?: unknown
  subscriptionExpireAt?: unknown
}

interface UserFlagsPayload {
  subscription?: unknown
  subscriptionInsider?: unknown
  internalMember?: unknown
}

interface UserInfoPayload {
  userId?: unknown
  accountId?: unknown
  loginType?: unknown
  avatarUrl?: unknown
  displayName?: unknown
  email?: unknown
  activeAccount?: unknown
  flags?: unknown
}

const user = ref<UserInfo | null>(null)
const isLoading = ref(true)
let fetched = false

function readString(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function readOptionalString(value: unknown) {
  if (typeof value === 'string' || value === null) return value
  return undefined
}

function readOptionalBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : undefined
}

function normalizeAccount(value: unknown): AccountContext | undefined {
  if (typeof value !== 'object' || value === null) return undefined

  const account = value as AccountContextPayload
  return {
    accountId: readString(account.accountId),
    type: readString(account.type),
    displayName: readString(account.displayName),
    avatarUrl: readString(account.avatarUrl),
    subscriptionPlanKey: readOptionalString(account.subscriptionPlanKey),
    subscriptionExpireAt: readOptionalString(account.subscriptionExpireAt),
  }
}

function normalizeFlags(value: unknown): UserInfo['flags'] {
  if (typeof value !== 'object' || value === null) return undefined

  const flags = value as UserFlagsPayload
  return {
    subscription: readOptionalBoolean(flags.subscription),
    subscriptionInsider: readOptionalBoolean(flags.subscriptionInsider),
    internalMember: readOptionalBoolean(flags.internalMember),
  }
}

function normalizeUserInfo(value: unknown): UserInfo | null {
  if (typeof value !== 'object' || value === null) return null

  const payload = value as UserInfoPayload
  return {
    userId: readString(payload.userId),
    accountId: readString(payload.accountId),
    loginType: readString(payload.loginType),
    avatarUrl: readString(payload.avatarUrl),
    displayName: readString(payload.displayName),
    email: readString(payload.email),
    activeAccount: normalizeAccount(payload.activeAccount),
    flags: normalizeFlags(payload.flags),
  }
}

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
    activeAccount: {
      accountId: 'local-preview-account',
      type: 'person',
      avatarUrl: '',
      displayName: 'ZenMux',
      subscriptionPlanKey: 'pro',
    },
    flags: {
      subscription: true,
      subscriptionInsider: true,
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
        user.value = normalizeUserInfo(res.data.data)
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
