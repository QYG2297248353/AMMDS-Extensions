import { onMessage, sendMessage } from 'webext-bridge/background'
import type { Tabs } from 'webextension-polyfill'
import { stateExtension } from '~/logic/storage'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

// remove or turn this off if you don't use side panel
const USE_SIDE_PANEL = true

// to toggle the sidepanel with the action button in chromium:
if (USE_SIDE_PANEL) {
  // @ts-expect-error missing types
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: unknown) => console.error(error))
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('[AMMDS Extension] installed')
})

// 数据更新
function handleTabUpdate(tab: Tabs.Tab) {
  if (!tab || !tab.url)
    return

  stateExtension.value.activateTabId = tab.id || 0
  stateExtension.value.url = tab.url || ''
  stateExtension.value.windowId = tab.windowId || 0
  sendMessage('tab-active', { title: tab.title, url: tab.url }, { context: 'content-script', tabId: tab.id! })
}

/**
 * 监听选项卡激活事件
 *
 * 切换选项卡时触发
 *
 * @param tabId 选项卡 ID
 * @param windowId 窗口 ID
 */
browser.tabs.onActivated.addListener(async ({ tabId, windowId }) => {
  stateExtension.value.windowId = windowId
  let tab: Tabs.Tab

  try {
    tab = await browser.tabs.get(tabId)
    handleTabUpdate(tab)
  }
  catch {
  }
})

/**
 * 监听激活选项卡更新事件
 *
 * 地址栏变动、加载新页面时触发
 *
 * @param tabId 选项卡 ID
 * @param changeInfo 选项卡更新信息
 * @param tab 选项卡对象
 */
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tabId === stateExtension.value.activateTabId && changeInfo.url) {
    handleTabUpdate(tab)
  }
})

/**
 * 窗口焦点变化事件
 *
 * 切换窗口时触发
 *
 * @param windowId 窗口 ID
 */
browser.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === stateExtension.value.windowId)
    return

  const tabs = await browser.tabs.query({ active: true, windowId })
  if (tabs.length === 0)
    return
  handleTabUpdate(tabs[0])
})

interface TabId {
  tabId: number
}

/**
 * 获取指定选项卡
 * @returns 指定选项卡
 */
onMessage('get-tab', async (message) => {
  try {
    const data = message.data as TabId | null
    if (!data || !data.tabId) {
      return {
        title: undefined,
        url: undefined,
      }
    }
    const tab = await browser.tabs.get(data.tabId)
    return {
      title: tab?.title,
      url: tab?.url,
    }
  }
  catch {
    return {
      title: undefined,
      url: undefined,
    }
  }
})

/**
 * 获取当前选项卡
 * @returns 指定选项卡
 */
onMessage('get-current-tab', async () => {
  try {
    const tab = await browser.tabs.getCurrent()
    return {
      title: tab?.title,
      url: tab?.url,
    }
  }
  catch {
    return {
      title: undefined,
      url: undefined,
    }
  }
})

/**
 * 获取激活的选项卡
 * @returns 激活的选项卡
 */
onMessage('get-active-tab', async () => {
  try {
    const tab = await browser.tabs.get(stateExtension.value.activateTabId)
    return {
      title: tab?.title,
      url: tab?.url,
    }
  }
  catch {
    return {
      title: undefined,
      url: undefined,
    }
  }
})

/**
 * 更新当前选项卡的 URL
 */
onMessage('update-current-tab', async () => {
  let tab: Tabs.Tab

  try {
    tab = await browser.tabs.get(stateExtension.value.activateTabId)
    if (!tab)
      return
    // 存储当前激活的选项卡
    stateExtension.value.activateTabId = tab.id || 0
    stateExtension.value.url = tab.url || ''
  }
  catch {
    return
  }

  sendMessage('tab-active', { title: tab.title, url: tab.url }, { context: 'content-script', tabId: tab.id || 0 })
})

interface FetchRequest {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: Record<string, any> | string
}

function base64ToBlob(base64: string, mime = ''): Blob {
  const byteChars = atob(base64)
  const byteNums: number[] = Array.from({ length: byteChars.length })
  for (let i = 0; i < byteChars.length; i++) {
    byteNums[i] = byteChars.charCodeAt(i)
  }
  return new Blob([new Uint8Array(byteNums)], { type: mime })
}

onMessage('fetch-api', async (message) => {
  const data = message.data as FetchRequest | null
  if (!data || !data.url) {
    return { success: false, error: 'Invalid request data' }
  }

  try {
    const method = (data.method || 'GET').toUpperCase()
    const headers = { ...(data.headers || {}) }
    const isForm = headers['Content-Type'] === 'multipart/form-data'

    const options: RequestInit = {
      method,
      headers,
    }

    if (['POST', 'PUT', 'DELETE'].includes(method) && data.body) {
      if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        options.body = new URLSearchParams(data.body as Record<string, string>).toString()
      }
      else if (isForm) {
        const formData = new FormData()
        const body = data.body as Record<string, any>

        for (const [key, value] of Object.entries(body)) {
          if (Array.isArray(value) && value.length && value[0]?.__isFile) {
            value.forEach((file) => {
              const blob = base64ToBlob(file.base64, file.type)
              const fileObj = new File([blob], file.name, { type: file.type })
              formData.append(key, fileObj)
            })
          }
          else if (value?.__isFile) {
            const blob = base64ToBlob(value.base64, value.type)
            const fileObj = new File([blob], value.name, { type: value.type })
            formData.append(key, fileObj)
          }
          else {
            formData.append(key, value)
          }
        }

        options.body = formData
        if (options.headers)
          delete (options.headers as Record<string, string>)['Content-Type']
      }
      else {
        options.headers = {
          ...options.headers,
          'Content-Type': 'application/json',
        }
        options.body = JSON.stringify(data.body)
      }
    }

    const response = await fetch(data.url, options)

    const contentType = response.headers.get('content-type') || ''
    const responseData = contentType.includes('application/json')
      ? await response.json()
      : await response.text()

    return { success: true, data: responseData }
  }
  catch (error) {
    return { success: false, error: (error as Error).message }
  }
})
