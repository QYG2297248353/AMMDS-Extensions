/* eslint-disable unused-imports/no-unused-vars */
import { message } from './message'
import type { AuthorMetadata, MovieMetadata } from './types'
import { getDefaultClient } from '~/api/fetchApi'
import { importMovie } from '~/api/ammds'
import { stateExtension } from '~/logic/storage'

// 定义域名处理器接口
export interface DomainHandler {
  // 插件作者信息
  author: () => AuthorMetadata
  // 定义域名匹配函数
  matchDomain: (url: string) => boolean
  // 定义获取数据函数
  getMovieMetadata: () => Promise<MovieMetadata>
  // 自动化操作
  automate: (callback: (data: MovieMetadata) => Promise<void>) => void
  // 获取视图组件
  getView: () => Promise<any>
}

// 定义域名处理器注册表
const domainHandlers: DomainHandler[] = []

// 注册域名处理器
export function registerDomainHandler(handler: DomainHandler) {
  domainHandlers.push(handler)
}

// 定义Vite动态导入模块的类型
type GlobModule = () => Promise<{ default: any }>
type GlobModules = Record<string, GlobModule>

// 自动注册所有域名处理器
export async function registerAllDomainHandlers() {
  const modules = import.meta.glob('./**/index.ts') as GlobModules
  for (const path in modules) {
    try {
      const module = await modules[path]()
      if (module.default && typeof module.default === 'object' && 'matchDomain' in module.default) {
        registerDomainHandler(module.default as DomainHandler)
      }
      else {
        console.warn(`[AMMDS Extension] Invalid domain handler in ${path}: missing required properties`)
      }
    }
    catch (error) {
      console.error(`[AMMDS Extension] Error loading domain handler from ${path}:`, error)
    }
  }
}

// 根据URL查找匹配的域名处理器
export async function findMatchingHandler(url: string): Promise<DomainHandler | null> {
  if (!domainHandlers || domainHandlers.length === 0) {
    await registerAllDomainHandlers()
  }
  // 查找匹配的处理器
  for (const handler of domainHandlers) {
    try {
      const matches = handler.matchDomain(url)
      if (matches)
        return handler
    }
    catch (error) {
      console.error('[AMMDS Extension] Error in matchDomain:', error)
    }
  }
  return null
}

// 状态管理
export interface StateExtension {
  enbled: boolean
  url: string
  activateTabId: number
  previousTabId?: number
  windowId?: number
  isFavorited: boolean
  isSubscribed: boolean
}

// 是否显示插件
export function isEnabled(): boolean {
  return stateExtension.value.enbled
}

// 处理收藏操作
export async function handleFavorite(url: string): Promise<void> {
  const client = getDefaultClient()
  if (!client) {
    message.warning('请添加客户端')
    return
  }
  const handler = await findMatchingHandler(url)
  if (!handler) {
    message.warning('数据解析失败')
    console.warn('[AMMDS Extension] No matching domain handler found for:', url)
    return
  }

  try {
    const data = await handler.getMovieMetadata()
    stateExtension.value.isFavorited = !stateExtension.value.isFavorited
    data.favorite = true
    await importMovie(data).then((res) => {
      if (res) {
        message.success('导入并收藏成功')
      }
      else {
        message.error('收藏失败')
      }
    }).catch((error) => {
      message.error(error)
    })
  }
  catch (error) {
    console.error('[AMMDS Extension] Error handling favorite:', error)
  }
}

// 处理订阅操作
export async function handleSubscribe(url: string): Promise<void> {
  const client = getDefaultClient()
  if (!client) {
    message.warning('请添加客户端')
    return
  }
  const handler = await findMatchingHandler(url)
  if (!handler) {
    message.warning('数据解析失败')
    console.warn('[AMMDS Extension] No matching domain handler found for:', url)
    return
  }

  try {
    const data = await handler.getMovieMetadata()
    stateExtension.value.isSubscribed = !stateExtension.value.isSubscribed
    data.subscribe = true
    await importMovie(data).then((res) => {
      if (res) {
        message.success('导入并订阅成功')
      }
      else {
        message.error('订阅失败')
      }
    }).catch((error) => {
      message.error(error)
    })
  }
  catch (error) {
    console.error('[AMMDS Extension] Error handling subscribe:', error)
  }
}

// 处理导入操作
export async function handleImport(url: string): Promise<void> {
  const client = getDefaultClient()
  if (!client) {
    message.warning('请添加客户端')
    return
  }
  const handler = await findMatchingHandler(url)
  if (!handler) {
    message.warning('数据解析失败')
    console.warn('[AMMDS Extension] No matching domain handler found for:', url)
    return
  }

  try {
    const data = await handler.getMovieMetadata()
    await importMovie(data).then((res) => {
      if (res) {
        message.success('导入成功')
      }
      else {
        message.error('导入失败')
      }
    }).catch((error) => {
      message.error(error)
    })
  }
  catch (error) {
    console.error('[AMMDS Extension] Error handling import:', error)
  }
}

// 处理自动化操作
export async function handleAutomation(url: string): Promise<void> {
  const client = getDefaultClient()
  if (!client) {
    message.warning('请添加客户端')
    return
  }
  const handler = await findMatchingHandler(url)
  if (!handler) {
    message.warning('数据解析失败')
    console.warn('[AMMDS Extension] No matching domain handler found for:', url)
    return
  }
  try {
    handler.automate((data) => {
      // 这里可以添加自动化相关的逻辑
      message.info('敬请期待')
      return Promise.resolve()
    })
  }
  catch (error) {
    console.error('[AMMDS Extension] Error handling automation:', error)
  }
}

export { message } from './message'
