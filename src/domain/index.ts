/* eslint-disable unused-imports/no-unused-vars */
import { message } from './message'
import { stateExtension } from '~/logic/storage'

// 插件作者信息元数据类型
export interface AuthorMetadata {
  // 作者姓名 (昵称, 用户名)
  name: string
  // GitHub 插件仓库链接
  github: string
  // 插件简介 (可选)
  description?: string
  // 头像链接 (可选)
  avatar?: string
  // 邮箱 (可选)
  email?: string
  // 社交链接 (可选, 个人主页)
  website?: string
  // 社交链接 (可选, Telegram)
  telegram?: string
  // 社交链接 (可选, Twitter)
  twitter?: string
}

// 影视元数据类型
export interface MovieMetadata {
  // 番号 (唯一标识、识别码)
  uniqueid: string
  // 其他番号
  numbers?: string[]
  // 影视源标题
  originalTitle: string
  // 影视中文标题
  titleCn?: string
  // 简介
  plot?: string
  // 中文简介
  plotCn?: string
  // 标语 (tagline)
  tagline?: string
  // 大纲 (outline)
  outline?: string
  // 评分 (10分制)
  rating?: number
  // 发行日期 (标准格式 YYYY-MM-DD)
  premiered?: string
  // 封面图 (文件列表 - 推荐)
  poster?: File[]
  // 封面图 (链接列表 - 可选)
  posterUrl?: string[]
  // 背景图 (文件列表 - 推荐)
  fanart?: File[]
  // 背景图 (链接列表 - 可选)
  fanartUrl?: string[]
  // 缩略图 (文件列表 - 推荐)
  thumb?: File[]
  // 缩略图 (链接列表 - 可选)
  thumbUrl?: string[]
  // 剧照 (文件列表 - 推荐)
  extrafanart?: File[]
  // 剧照 (链接列表 - 可选)
  extrafanartUrl?: string[]
  // 类型
  genres?: string[]
  // 标签
  tags?: string[]
  // 制作商
  studio?: string[]
  // 发行商
  issueStudio?: string[]
  // 时长 (分钟)
  runtime?: number
  // 语言
  languages?: string
  // 国家
  country?: string
  // 导演
  director?: string[]
  // 马赛克 (有码-true/无码-false)
  mosaic?: boolean
  // 系列
  series?: {
    // 系列名称
    name: string
    // 系列描述
    overview?: string
  }[]
  // 演员
  actors?: {
    // 演员名称
    name: string
    // 角色名称 (男优/女优 - 推荐)
    role?: string
    // 演员头像 (文件列表 - 推荐)
    thumb?: File[]
    // 演员头像 (链接列表 - 可选)
    thumbUrl?: string[]
  }[]
  // 链接 (数据源地址)
  links?: {
    // 链接名称
    name: string
    // 链接地址
    url: string
  }[]
  // 磁力链
  magnets?: {
    // 磁链名称
    name: string
    // 磁链地址
    url: string
    // 磁链大小 (字节 - 建议进行转换为字节)
    size: number
    // 磁链哈希 (便于去重)
    hash?: string
  }[]
}

// 定义域名处理器接口
export interface DomainHandler {
  // 插件作者信息
  author: () => AuthorMetadata
  // 定义域名匹配函数
  matchDomain: (url: string) => boolean
  // 定义获取数据函数
  getMovieMetadata: () => MovieMetadata
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
  isFavorited: boolean
  isSubscribed: boolean
}

// 是否显示插件
export function isEnabled(): boolean {
  return stateExtension.value.enbled
}

// 处理收藏操作
export async function handleFavorite(url: string): Promise<void> {
  const handler = await findMatchingHandler(url)
  if (!handler) {
    message.warning('数据解析失败')
    console.warn('[AMMDS Extension] No matching domain handler found for:', url)
    return
  }

  try {
    const data = handler.getMovieMetadata()
    stateExtension.value.isFavorited = !stateExtension.value.isFavorited
    // 这里可以添加数据持久化逻辑
  }
  catch (error) {
    console.error('[AMMDS Extension] Error handling favorite:', error)
  }
}

// 处理订阅操作
export async function handleSubscribe(url: string): Promise<void> {
  const handler = await findMatchingHandler(url)
  if (!handler) {
    message.warning('数据解析失败')
    console.warn('[AMMDS Extension] No matching domain handler found for:', url)
    return
  }

  try {
    const data = handler.getMovieMetadata()
    stateExtension.value.isSubscribed = !stateExtension.value.isSubscribed
    // 这里可以添加数据持久化逻辑
  }
  catch (error) {
    console.error('[AMMDS Extension] Error handling subscribe:', error)
  }
}

// 处理导入操作
export async function handleImport(url: string): Promise<void> {
  const handler = await findMatchingHandler(url)
  if (!handler) {
    message.warning('数据解析失败')
    console.warn('[AMMDS Extension] No matching domain handler found for:', url)
    return
  }

  try {
    const data = handler.getMovieMetadata()
    // 这里可以添加导入相关的逻辑
  }
  catch (error) {
    console.error('[AMMDS Extension] Error handling import:', error)
  }
}

// 处理自动化操作
export async function handleAutomation(url: string): Promise<void> {
  const handler = await findMatchingHandler(url)
  if (!handler) {
    message.warning('数据解析失败')
    console.warn('[AMMDS Extension] No matching domain handler found for:', url)
    return
  }
  try {
    handler.automate((data) => {
      // 这里可以添加自动化相关的逻辑
      return Promise.resolve()
    })
  }
  catch (error) {
    console.error('[AMMDS Extension] Error handling automation:', error)
  }
}

export { message } from './message'
