/* eslint-disable regexp/no-super-linear-backtracking */
import type { AuthorMetadata, MovieMetadata } from '../../index'
import { extractDescription, extractKeywords, extractMagnets, extractMovieInfo, extractRelatedMovies, extractTitleInfo } from './utils/javbus-parser'

/**
 * 当前页面是否存在匹配的元素
 *
 * @returns {boolean} 是否匹配
 */
export function isMatchElement(): boolean {
  try {
    // 检查是否存在电影信息容器
    const movieContainer = document.querySelector('div.movie')
    if (!movieContainer)
      return false

    // 检查是否存在识别码
    const headerElements = document.querySelectorAll('span.header')
    let hasIdElement = false
    for (const el of Array.from(headerElements)) {
      if (el.textContent?.includes('識別碼')) {
        hasIdElement = true
        break
      }
    }
    if (!hasIdElement)
      return false

    // 检查是否存在标题
    const titleElement = document.querySelector('title')
    if (!titleElement || !titleElement.textContent)
      return false

    // 支持更多格式的标题匹配
    // 1. 标准格式：ZMAR-132 まるっと！新井リマ - JavBus
    // 2. 数字格式：032225_001 PtoMセックス 藤野りん - JavBus
    const titleText = titleElement.textContent
    const standardMatch = titleText.match(/([A-Z0-9]+-[A-Z0-9]+)\s+(.+?)\s+-\s+JavBus/)
    const numberMatch = titleText.match(/(\d+_\d+)\s+(.+?)\s+-\s+JavBus/)

    if (!standardMatch && !numberMatch)
      return false

    return true
  }
  catch (error) {
    console.error('[AMMDS Extension] Error checking match element:', error)
    return false
  }
}

/**
 * 等待指定时间
 * @param ms 等待的毫秒数
 * @returns Promise
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 等待页面元素加载完成
 * @param selector 元素选择器
 * @param maxWaitTime 最大等待时间（毫秒）
 * @param checkInterval 检查间隔（毫秒）
 * @returns 是否找到元素
 */
async function waitForElement(selector: string, maxWaitTime = 3000, checkInterval = 300): Promise<boolean> {
  const startTime = Date.now()
  while (Date.now() - startTime < maxWaitTime) {
    const element = document.querySelector(selector)
    if (element)
      return true
    await sleep(checkInterval)
  }
  return false
}

/**
 * 从页面中提取数据
 *
 * @returns {MovieMetadata | null} 提取的数据
 */
export async function getDataFromPage(): Promise<MovieMetadata | null> {
  try {
    // 等待磁力链接表格加载完成
    await waitForElement('#magnet-table')

    // 等待相关影片加载完成
    await waitForElement('#related-waterfall')

    // 提取标题信息
    const titleInfo = extractTitleInfo(document)
    if (!titleInfo)
      return null

    // 提取电影详细信息
    const movieInfo = extractMovieInfo(document)

    // 提取关键词作为标签
    const keywords = extractKeywords(document)
    if (keywords.length > 0 && !movieInfo.tags) {
      movieInfo.tags = keywords
    }

    // 提取描述信息作为简介
    const description = extractDescription(document)
    if (description && !movieInfo.plot) {
      movieInfo.plot = description
    }

    // 提取磁力链接
    const magnets = extractMagnets(document)
    if (magnets.length > 0) {
      movieInfo.magnets = magnets.map(magnet => magnet.url)
    }

    // 提取相关影片/剧照
    const relatedMovies = extractRelatedMovies(document)
    if (relatedMovies.length > 0) {
      movieInfo.relatedMovies = relatedMovies.map(movie => movie.url)
    }

    // 构建完整的电影元数据
    const metadata: MovieMetadata = {
      uniqueid: titleInfo.uniqueid || movieInfo.uniqueid as string,
      originalTitle: titleInfo.originalTitle,
      ...movieInfo,
      // 添加数据源链接
      links: [{
        name: 'JavBus',
        url: window.location.href,
      }],
    }

    return metadata
  }
  catch (error) {
    console.error('[AMMDS Extension] Error extracting data from page:', error)
    return null
  }
}

// 导出javbus域名处理器
export default {
  // 域名匹配函数，支持正则表达式或字符串包含匹配
  matchDomain: (url: string): boolean => {
    try {
      // 域名匹配列表
      const domainList: string[] = ['javbus.com']
      // 正则表达式匹配列表
      const regexList: RegExp[] = [
        /^https?:\/\/(?:www\.)?javbus\.com\/\w+\/?$/,
      ]

      // 解析URL获取域名部分
      const urlObj = new URL(url)
      const hostname = urlObj.hostname

      // 域名数组匹配
      if (domainList.length > 0) {
        for (const domain of domainList) {
          // 检查完全匹配或子域名匹配
          if (hostname === domain || hostname.endsWith(`.${domain}`)) {
            return true
          }
        }
      }

      // 正则表达式匹配
      if (regexList.length > 0) {
        for (const regex of regexList) {
          if (regex.test(url)) {
            return true
          }
        }
      }

      return false
    }
    catch (error) {
      console.error('[AMMDS Extension] Error matching domain:', error)
      return false
    }
  },

  // 获取数据函数
  getMovieMetadata: async (): Promise<MovieMetadata> => {
    try {
      // 检查当前页面中是否有匹配的元素
      if (!isMatchElement()) {
        console.warn('[AMMDS Extension] No matching element found on the page')
        throw new Error('No matching element found on the page')
      }

      // 提取页面数据
      const data = await getDataFromPage()
      if (!data) {
        console.warn('[AMMDS Extension] Failed to extract data from the page')
        throw new Error('Failed to extract data from the page')
      }

      // eslint-disable-next-line no-console
      console.log('[AMMDS Extension] Data extracted from javbus:', data)

      // 返回数据
      return data
    }
    catch (error) {
      console.error('[AMMDS Extension] Error getting data from javbus:', error)
      throw error
    }
  },

  // 自动化处理函数
  automate: async (callback: (data: MovieMetadata) => Promise<void>) => {
    try {
      // 示例返回的数据
      const data: MovieMetadata = {
        uniqueid: 'AMMDS',
        originalTitle: 'AMMDS Extension',
      }
      callback(data)
    }
    catch (error) {
      console.error('[AMMDS Extension] Error automating javbus:', error)
      throw error
    }
  },

  // 插件作者信息
  author: (): AuthorMetadata => {
    const authorInfo: AuthorMetadata = {
      name: 'AMMDS',
      email: 'ammds@lifebus.top',
      github: 'https://github.com/QYG2297248353/AMMDS-Extensions',
      description: 'AMMDS Official Extension',
      website: 'https://ammds.lifebus.top',
      telegram: 'https://t.me/+OgCuWhS93zczZjhl',
      twitter: 'https://x.com/MS2297248353',
    }
    return authorInfo
  },

  // 获取视图组件
  getView: async () => {
    const component = await import('./view/index.vue')
    return component.default
  },
}
