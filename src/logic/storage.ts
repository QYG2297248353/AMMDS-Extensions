import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'
import type { StateExtension } from '~/domain'

export const storageDemo = useWebExtensionStorage('webext-demo', 'Storage Demo')

export const stateExtension = useWebExtensionStorage('ammds-state', {
  enbled: false,
  url: '',
  isFavorited: false,
  isSubscribed: false,
} as StateExtension)
