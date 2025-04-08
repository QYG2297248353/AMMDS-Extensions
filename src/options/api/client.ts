import { RequestHelper } from '~/api/fetchApi'

/**
 * 健康检查
 * @param url 主机地址
 * @returns Promise<boolean>
 */
export async function healthCheck(url: string): Promise<boolean> {
  if (!url)
    return Promise.resolve(false)
  if (!url.startsWith('http')) {
    return Promise.resolve(false)
  }
  if (url.endsWith('/')) {
    return Promise.resolve(false)
  }
  const uri = `${url}/v1/health/check`
  const response = await RequestHelper.get<boolean>(uri)
  return response
}
