import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'
import type { StateExtension } from '~/domain'
import type { Client } from '~/api/fetchApi'

// 快捷按钮状态
export const stateExtension = useWebExtensionStorage('ammds-state', {
  enbled: false,
  url: '',
  activateTabId: 0,
  previousTabId: 0,
  windowId: 0,
  isFavorited: false,
  isSubscribed: false,
} as StateExtension)

// 后台客户端存储
export const clients = useWebExtensionStorage('ammds-clients', [] as Client[])
