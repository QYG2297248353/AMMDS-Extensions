/* eslint-disable regexp/no-super-linear-backtracking */
/**
 * JavBus网站解析工具函数
 * 提供从JavBus HTML页面中提取数据的专用方法
 */
import { extractRuntime, getFullImageUrl } from './dom-parser'

/**
 * 从meta标签中提取关键词
 * @param document DOM文档
 * @returns 提取的关键词数组
 */
export function extractKeywords(document: Document): string[] {
  const metaKeywords = document.querySelector('meta[name="keywords"]')
  if (!metaKeywords)
    return []

  const content = metaKeywords.getAttribute('content')
  if (!content)
    return []

  return content.split(',').map(keyword => keyword.trim())
}

/**
 * 从meta标签中提取描述信息
 * @param document DOM文档
 * @returns 提取的描述信息
 */
export function extractDescription(document: Document): string | undefined {
  const metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription)
    return undefined

  return metaDescription.getAttribute('content') || undefined
}

/**
 * 从标题中提取番号和标题
 * @param document DOM文档
 * @returns 提取的番号和标题
 */
export function extractTitleInfo(document: Document): { uniqueid: string, originalTitle: string } | undefined {
  const titleElement = document.querySelector('title')
  if (!titleElement || !titleElement.textContent)
    return undefined

  const titleText = titleElement.textContent

  // 尝试匹配标准格式：ZMAR-132 まるっと！新井リマ - JavBus
  const standardMatch = titleText.match(/([A-Z0-9]+-[A-Z0-9]+)\s+(.+?)\s+-\s+JavBus/)
  if (standardMatch) {
    return {
      uniqueid: standardMatch[1],
      originalTitle: standardMatch[2],
    }
  }

  // 尝试匹配数字格式：032225_001 PtoMセックス 藤野りん - JavBus
  const numberMatch = titleText.match(/(\d+_\d+)\s+(.+?)\s+-\s+JavBus/)
  if (numberMatch) {
    return {
      uniqueid: numberMatch[1],
      originalTitle: numberMatch[2],
    }
  }

  // 尝试从页面内容中提取
  const idElement = document.querySelector('span.header:contains("識別碼") + span')
  if (idElement && idElement.textContent) {
    const id = idElement.textContent.trim()
    const h3Element = document.querySelector('h3')
    if (h3Element && h3Element.textContent) {
      const title = h3Element.textContent.replace(id, '').trim()
      return {
        uniqueid: id,
        originalTitle: title,
      }
    }
  }

  return undefined
}

/**
 * 提取电影详细信息
 * @param document DOM文档
 * @returns 电影详细信息对象
 */
export function extractMovieInfo(document: Document): Record<string, string | string[] | object> {
  const result: Record<string, string | string[] | object> = {}

  // 查找所有header元素
  const headerElements = document.querySelectorAll('span.header')

  // 遍历所有header元素，根据内容提取相应信息
  headerElements.forEach((header) => {
    const headerText = header.textContent?.trim()
    if (!headerText)
      return

    // 获取父元素的文本内容
    const getParentElementText = (el: Element): string | undefined => {
      const parentEl = el.parentElement
      return parentEl?.textContent?.trim()
    }

    // 获取下一个兄弟元素的文本内容
    // const getNextElementText = (el: Element): string | undefined => {
    //   const nextEl = el.nextElementSibling
    //   return nextEl?.textContent?.trim()
    // }

    // 获取下一个兄弟元素中的链接元素
    const getNextElementLink = (el: Element): Element | null => {
      const nextEl = el.nextElementSibling
      return nextEl?.querySelector('a') || nextEl
    }

    // 根据header文本提取不同类型的信息
    if (headerText.includes('識別碼')) {
      const nextSpan = header.nextElementSibling
      if (nextSpan && nextSpan.textContent) {
        result.uniqueid = nextSpan.textContent.trim()
      }
    }
    else if (headerText.includes('發行日期')) {
      const text = getParentElementText(header)
      if (text) {
        const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})/)
        if (dateMatch)
          result.premiered = dateMatch[1]
      }
    }
    else if (headerText.includes('長度')) {
      const text = getParentElementText(header)
      if (text) {
        const runtime = extractRuntime(text)
        if (runtime)
          result.runtime = String(runtime)
      }
    }
    else if (headerText.includes('製作商')) {
      const link = getNextElementLink(header)
      if (link && link.textContent) {
        result.studio = [link.textContent.trim()]
      }
    }
    else if (headerText.includes('發行商')) {
      const link = getNextElementLink(header)
      if (link && link.textContent) {
        result.issueStudio = [link.textContent.trim()]
      }
    }
    else if (headerText.includes('系列')) {
      const link = getNextElementLink(header)
      if (link && link.textContent) {
        result.series = [{
          name: link.textContent.trim(),
        }]
      }
    }
  })

  // 提取类型/标签
  const genreElements = document.querySelectorAll('span.genre a')
  if (genreElements.length > 0) {
    const genres: string[] = []
    genreElements.forEach((element) => {
      if (element.textContent)
        genres.push(element.textContent.trim())
    })
    result.genres = genres
  }

  // 提取演员信息
  const actorElements = document.querySelectorAll('div.star-name a')
  if (actorElements.length > 0) {
    const actors: Array<{ name: string, role?: string }> = []
    actorElements.forEach((element) => {
      if (element.textContent) {
        actors.push({
          name: element.textContent.trim(),
          role: '女优',
        })
      }
    })
    result.actors = actors
  }

  // 提取封面图
  const coverElement = document.querySelector('a.bigImage')
  if (coverElement) {
    const href = coverElement.getAttribute('href')
    if (href) {
      result.posterUrl = [getFullImageUrl(href) || '']
    }
  }

  return result
}

/**
 * 提取磁力链接信息
 * @param document DOM文档
 * @returns 磁力链接信息数组
 */
export function extractMagnets(document: Document): Array<{ name: string, url: string, size: number }> {
  const magnets: Array<{ name: string, url: string, size: number }> = []

  // 查找磁力链接表格行
  const magnetRows = document.querySelectorAll('#magnet-table tr')

  // 如果没有找到磁力链接表格行，尝试查找所有包含磁力链接的行
  if (magnetRows.length <= 1) {
    // 查找所有包含磁力链接的元素
    const allMagnetLinks = document.querySelectorAll('a[href^="magnet:"]')
    allMagnetLinks.forEach((link) => {
      const url = link.getAttribute('href')
      if (!url)
        return

      // 尝试从父元素或周围元素获取名称和大小信息
      let name = '未命名'
      let size = 0

      // 获取链接文本作为名称
      if (link.textContent && link.textContent.trim()) {
        name = link.textContent.trim()
      }

      // 尝试从周围元素获取大小信息
      const parentRow = link.closest('tr')
      if (parentRow) {
        const sizeText = parentRow.textContent || ''
        const sizeMatch = sizeText.match(/(\d+(\.\d+)?)(\s*)(GB|MB|KB)/i)
        if (sizeMatch) {
          const value = Number.parseFloat(sizeMatch[1])
          const unit = sizeMatch[4].toUpperCase()

          // 转换为字节
          if (unit === 'KB')
            size = value * 1024
          else if (unit === 'MB')
            size = value * 1024 * 1024
          else if (unit === 'GB')
            size = value * 1024 * 1024 * 1024
        }
      }

      magnets.push({ name, url, size })
    })

    return magnets
  }

  // 标准表格处理
  magnetRows.forEach((row) => {
    const linkElement = row.querySelector('a[href^="magnet:"]')
    if (!linkElement)
      return

    const url = linkElement.getAttribute('href')
    if (!url)
      return

    // 尝试获取名称，首先查找专用的name类元素，如果没有则使用链接文本
    const nameElement = row.querySelector('a.name')
    const name = nameElement?.textContent?.trim() || linkElement.textContent?.trim() || '未命名'

    // 提取大小信息
    let size = 0
    const sizeElementAll = row.querySelectorAll('a[href^="magnet:"]')
    // 3个
    if (sizeElementAll.length === 3) {
      const sizeElement = sizeElementAll[1]
      if (sizeElement && sizeElement.textContent) {
        const sizeText = sizeElement.textContent.trim()
        const sizeMatch = sizeText.match(/(\d+(\.\d+)?)(\s*)(GB|MB|KB)/i)
        if (sizeMatch) {
          const value = Number.parseFloat(sizeMatch[1])
          const unit = sizeMatch[4].toUpperCase()

          // 转换为字节
          if (unit === 'KB')
            size = value * 1024
          else if (unit === 'MB')
            size = value * 1024 * 1024
          else if (unit === 'GB')
            size = value * 1024 * 1024 * 1024
        }
      }
    }

    magnets.push({ name, url, size })
  })

  return magnets
}

/**
 * 提取相关影片信息
 * @param document DOM文档
 * @returns 相关影片信息数组
 */
export function extractRelatedMovies(document: Document): Array<{ title: string, url: string, imageUrl: string }> {
  const relatedMovies: Array<{ title: string, url: string, imageUrl: string }> = []

  // 查找相关影片区域
  const relatedWaterfall = document.querySelector('#related-waterfall')
  if (!relatedWaterfall)
    return relatedMovies

  // 查找所有影片框
  const movieBoxes = relatedWaterfall.querySelectorAll('a.movie-box')
  movieBoxes.forEach((box) => {
    const title = box.getAttribute('title') || ''
    const url = box.getAttribute('href') || ''

    // 查找图片
    const imgElement = box.querySelector('img')
    const imageUrl = imgElement ? getFullImageUrl(imgElement.getAttribute('src')) || '' : ''

    if (title && url) {
      relatedMovies.push({ title, url, imageUrl })
    }
  })

  return relatedMovies
}

/**
 * 提取剧照信息
 * @param document DOM文档
 * @returns 剧照信息数组
 */
export function extractExtraFanart(document: Document): string[] {
  const extraFanart: string[] = []
  const extraFanartContainer = document.querySelector('#sample-waterfall')
  if (!extraFanartContainer)
    return extraFanart
  const sampleBoxes = extraFanartContainer.querySelectorAll('.sample-box')
  sampleBoxes.forEach((box) => {
    const href = box.getAttribute('href')
    if (href && (href.endsWith('.jpg') || href.endsWith('.png') || href.endsWith('.jpeg') || href.endsWith('.webp'))) {
      extraFanart.push(getFullImageUrl(href) || '')
    }
  })
  return extraFanart
}
