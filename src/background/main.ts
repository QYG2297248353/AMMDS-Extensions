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
  console.log('[AMMDS Extension] installed')
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
