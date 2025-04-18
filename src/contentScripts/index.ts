/* eslint-disable no-console */
import { onMessage } from 'webext-bridge/content-script'
import { createApp } from 'vue'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'
import { registerAllDomainHandlers } from '~/domain'

// 页面注入

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(async () => {
  // 初始化所有域名处理器
  await registerAllDomainHandlers()

  // communication example: send previous tab title from background page
  onMessage('tab-active', ({ data }) => {
    console.log(`[AMMDS] Navigate Tab "${data.url || data.title}"`)
  })

  // mount component to context window
  const container = document.createElement('div')
  container.id = __NAME__
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM
    = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' })
    || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute(
    'href',
    browser.runtime.getURL('dist/contentScripts/style.css'),
  )
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.appendChild(container)
  const app = createApp(App)
  setupApp(app)
  app.mount(root)
})()
