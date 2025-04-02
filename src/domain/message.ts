import type { ComponentPublicInstance } from 'vue'
import { createApp } from 'vue'
import Message from '~/contentScripts/components/Message.vue'

let messageInstance: ComponentPublicInstance | null = null

// 单例模式创建message
function createMessage() {
  if (messageInstance)
    return messageInstance

  const container = document.createElement('div')
  container.id = 'message-container'
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container

  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))

  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.appendChild(container)

  const app = createApp(Message)
  messageInstance = app.mount(root) as ComponentPublicInstance
  return messageInstance
}

// Message API
export const message = {
  info: (text: string, duration?: number) => (createMessage() as any).info(text, duration),
  success: (text: string, duration?: number) => (createMessage() as any).success(text, duration),
  warning: (text: string, duration?: number) => (createMessage() as any).warning(text, duration),
  error: (text: string, duration?: number) => (createMessage() as any).error(text, duration),
}
