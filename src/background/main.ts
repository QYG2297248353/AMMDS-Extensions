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

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async ({ tabId, previousTabId, windowId }) => {
  stateExtension.value.previousTabId = previousTabId
  stateExtension.value.windowId = windowId
  let tab: Tabs.Tab

  try {
    tab = await browser.tabs.get(tabId)
    stateExtension.value.activateTabId = tab.id || 0
    stateExtension.value.url = tab.url || ''
  }
  catch {
    return
  }

  sendMessage('tab-active', { title: tab.title, url: tab.url }, { context: 'content-script', tabId })
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
