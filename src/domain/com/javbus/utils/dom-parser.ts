/**
 * DOM解析工具函数
 * 提供从HTML页面中提取数据的通用方法
 */

/**
 * 从文本中提取数字
 * @param text 包含数字的文本
 * @returns 提取的数字，如果没有找到则返回undefined
 */
export function extractNumber(text: string | null | undefined): number | undefined {
  if (!text)
    return undefined
  const match = text.match(/(\d+(\.\d+)?)/)
  return match ? Number.parseFloat(match[1]) : undefined
}

/**
 * 从文本中提取日期
 * @param text 包含日期的文本 (格式: YYYY-MM-DD)
 * @returns 标准格式的日期字符串，如果没有找到则返回undefined
 */
export function extractDate(text: string | null | undefined): string | undefined {
  if (!text)
    return undefined
  const match = text.match(/(\d{4}-\d{2}-\d{2})/)
  return match ? match[1] : undefined
}

/**
 * 从文本中提取时长（分钟）
 * @param text 包含时长的文本
 * @returns 分钟数，如果没有找到则返回undefined
 */
export function extractRuntime(text: string | null | undefined): number | undefined {
  if (!text)
    return undefined
  const match = text.match(/(\d+)分鐘/)
  return match ? Number.parseInt(match[1], 10) : undefined
}

/**
 * 从URL中提取ID
 * @param url 包含ID的URL
 * @returns 提取的ID，如果没有找到则返回undefined
 */
export function extractIdFromUrl(url: string | null | undefined): string | undefined {
  if (!url)
    return undefined
  const match = url.match(/\/([^/]+)\/?$/)
  return match ? match[1] : undefined
}

/**
 * 清理文本（移除多余空格、换行等）
 * @param text 需要清理的文本
 * @returns 清理后的文本
 */
export function cleanText(text: string | null | undefined): string | undefined {
  if (!text)
    return undefined
  return text.trim().replace(/\s+/g, ' ')
}

/**
 * 从图片URL中提取完整URL
 * @param url 可能是相对路径的URL
 * @returns 完整的URL
 */
export function getFullImageUrl(url: string | null | undefined): string | undefined {
  if (!url)
    return undefined
  // 如果已经是完整URL则直接返回
  if (url.startsWith('http'))
    return url
  // 否则添加域名前缀
  return `https://www.javbus.com${url}`
}
