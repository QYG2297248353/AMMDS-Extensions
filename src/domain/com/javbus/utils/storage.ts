import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

// 今日新增
export const todayAdd = useWebExtensionStorage('ammds-javbus-today', {
  today: '',
  url: [],
})
