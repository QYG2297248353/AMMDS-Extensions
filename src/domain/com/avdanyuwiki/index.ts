import type { AuthorMetadata, MovieMetadata } from '../../index'

// 导出AvdanyuWiki域名处理器
export default {
  // 域名匹配函数，支持正则表达式或字符串包含匹配
  matchDomain: (url: string): boolean => {
    try {
      // 域名匹配列表
      const domainList: string[] = [
        'avdanyuwiki.com',
        'baidu.com',
      ]
      // 正则表达式匹配列表
      const regexList: RegExp[] = [
        /^https?:\/\/(?:www\.)?avdanyuwiki\.com\/\w+\/?$/,
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
  getMovieMetadata: async () => {
    try {
      // 示例返回的数据
      const data: MovieMetadata = {
        uniqueid: 'AMMDS',
        originalTitle: 'AMMDS Extension',
      }
      return data
    }
    catch (error) {
      console.error('Error getting data from javbus:', error)
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
      console.error('Error automating javbus:', error)
      throw error
    }
  },
  author: () => {
    // 插件作者信息
    const authorInfo: AuthorMetadata = {
      name: 'AMMDS',
      email: 'ammds@lifebus.top',
      github: 'https://github.com/QYG2297248353/AMMDS-Extensions',
    }
    return authorInfo
  },
  getView: async () => {
    const component = await import('./view/index.vue')
    return component.default
  },
}
