import { onMessage, sendMessage } from 'webext-bridge/background'
import type { Tabs } from 'webextension-polyfill'

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
  console.log('Extension installed')
})

let previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId
    return
  }

  let tab: Tabs.Tab

  try {
    tab = await browser.tabs.get(previousTabId)
    previousTabId = tabId
  }
  catch {
    return
  }

  // eslint-disable-next-line no-console
  console.log('previous tab', tab)
  sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
})

onMessage('get-current-tab', async () => {
  try {
    const tab = await browser.tabs.get(previousTabId)
    return {
      title: tab?.title,
    }
  }
  catch {
    return {
      title: undefined,
    }
  }
})

interface FetchRequest {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: Record<string, any> | string
}

onMessage('fetch-api', async (message) => {
  const data = message.data as FetchRequest | null
  if (!data || !data.url) {
    return { success: false, error: 'Invalid request data' }
  }

  try {
    const options: RequestInit = {
      method: data.method || 'GET',
      headers: data.headers || {},
    }

    // 根据请求方法设置 body
    if (['POST', 'PUT', 'DELETE'].includes(options.method as string) && data.body) {
      if (data.headers && data.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        options.body = new URLSearchParams(data.body as Record<string, string>).toString()
      }
      else if (data.headers && data.headers['Content-Type'] === 'multipart/form-data') {
        const formData = new FormData()
        Object.entries(data.body as Record<string, any>).forEach(([key, value]) => {
          formData.append(key, value)
        })
        options.body = formData
        delete (options.headers as Record<string, string>)['Content-Type']
      }
      else {
        options.headers = { ...options.headers, 'Content-Type': 'application/json' }
        options.body = JSON.stringify(data.body)
      }
    }

    const response = await fetch(data.url, options)
    const contentType = response.headers.get('content-type')
    let responseData
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json()
    }
    else {
      responseData = await response.text()
    }

    return { success: true, data: responseData }
  }
  catch (error) {
    return { success: false, error: (error as Error).message }
  }
})
