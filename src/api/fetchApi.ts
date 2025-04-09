import { clients } from '~/logic/storage'

// 客户端列表
export interface Client {
  // 名称 || AMMDS
  name: string
  // 地址 http(s)://host:port
  url: string
  // 密钥
  secret: string
  // 启用
  enbled: boolean
  // 默认
  preferred: boolean

  // 状态
  status?: boolean
  // 其他属性...
  [key: string]: any
}

// 获取客户端列表
export function getClientList(): Client[] {
  try {
    const clientList: Client[] = clients.value
    const enabledClientList = clientList.filter(client => client.enbled)
    return enabledClientList
  }
  catch (error) {
    console.error('[AMMDS Extension] Error getting client list:', error)
    throw error
  }
}

// 获取默认客户端
export function getDefaultClient(): Client | undefined {
  try {
    const clientList: Client[] = clients.value
    const enabledClientList = clientList.filter(client => client.enbled && client.preferred)
    if (enabledClientList.length === 0)
      return undefined
    return enabledClientList[0]
  }
  catch (error) {
    console.error('[AMMDS Extension] Error getting default client:', error)
    throw error
  }
}

/**
 * 添加客户端
 *
 * @param name 名称 || AMMDS
 * @param url 地址 || http(s)://host:port
 * @param secret 密钥
 * @param enbled 启用 || true
 */
export function addClient(name: string = 'AMMDS', url: string, secret: string, enbled: boolean = true, preferred: boolean = false) {
  try {
    const clientList: Client[] = clients.value
    const newClient: Client = {
      name,
      url,
      secret,
      enbled,
      preferred,
    }
    clientList.push(newClient)
    clients.value = clientList
  }
  catch (error) {
    console.error('[AMMDS Extension] Error adding client:', error)
    throw error
  }
}

/**
 * 删除客户端
 *
 * @param url 地址 || http(s)://host:port
 */
export function deleteClient(url: string) {
  try {
    const clientList: Client[] = clients.value
    const updatedClientList = clientList.filter(client => client.url !== url)
    clients.value = updatedClientList
  }
  catch (error) {
    console.error('[AMMDS Extension] Error deleting client:', error)
    throw error
  }
}

/**
 * 设为默认客户端
 * @param url 地址 || http(s)://host:port
 */
export function setDefaultClient(url: string) {
  try {
    const clientList: Client[] = clients.value
    clientList.forEach((client) => {
      client.preferred = client.url === url
    })
    clients.value = clientList
  }
  catch (error) {
    console.error('[AMMDS Extension] Error setting default client:', error)
    throw error
  }
}

/**
 * 获取指定客户端
 * @param url 地址 || http(s)://host:port
 * @returns Client
 */
export function getClient(url: string): Client | undefined {
  try {
    const clientList: Client[] = clients.value
    const client = clientList.find(client => client.url === url)
    return client
  }
  catch (error) {
    console.error('[AMMDS Extension] Error getting client:', error)
    throw error
  }
}

// 请求配置
interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  isForm?: boolean
  validateStatus?: (status: number) => boolean
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer'
  retryTimes?: number
  retryDelay?: number
}

// 请求错误
interface RequestError extends Error {
  status?: number
  statusText?: string
  data?: any
  config?: RequestConfig
  response?: Response
  isNetworkError?: boolean
  isTimeout?: boolean
}

// 请求封装工具
export class RequestHelper {
  private static baseUrl: string = ''
  private static secret: string = ''
  private static readonly DEFAULT_TIMEOUT = 30000

  // 初始化
  public static init(client: Client) {
    this.baseUrl = client.url
    this.secret = client.secret
  }

  // 通用请求方法
  private static async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    config: RequestConfig = {},
  ): Promise<T> {
    const {
      retryTimes = 0,
      retryDelay = 1000,
    } = config

    // 检查是否初始化
    if (endpoint.startsWith('/') && !this.baseUrl) {
      const client = getDefaultClient()
      if (client) {
        this.init(client)
      }
      else {
        console.error('[AMMDS Extension] 请添加默认客户端')
        throw new Error('[AMMDS Extension] 请添加默认客户端')
      }
    }

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      ...config.headers,
      'Content-Type': 'application/json',
    }

    if (this.secret)
      headers['x-api-key'] = this.secret

    try {
      // 使用background脚本发送请求，避免CORS限制
      const result = await this.requestViaBackground<T>(url, method, data, headers, config)
      return result
    }
    catch (error) {
      const requestError = error instanceof Error ? error : new Error('[AMMDS Extension] 网络请求失败')
      const typedError = requestError as RequestError

      // 重试逻辑
      if (retryTimes > 0 && (typedError.isTimeout || typedError.isNetworkError)) {
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        return this.request<T>(method, endpoint, data, {
          ...config,
          retryTimes: retryTimes - 1,
        })
      }

      throw typedError
    }
  }

  // 将 File 转 base64
  private static fileToBase64(file: File): Promise<{ name: string, type: string, base64: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]
        resolve({ name: file.name, type: file.type, base64 })
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // 构造 JSON-safe 的 FormData 数据（仅传输用，不是真正的 FormData）
  private static async serializeFormData(data: any): Promise<Record<string, any>> {
    const result: Record<string, any> = {}

    for (const key in data) {
      if (!Object.prototype.hasOwnProperty.call(data, key))
        continue
      const value = data[key]

      if (value instanceof File) {
        const file = await this.fileToBase64(value)
        result[key] = { __isFile: true, ...file }
      }
      else if (Array.isArray(value) && value.length && value[0] instanceof File) {
        result[key] = await Promise.all(value.map((f: File) => this.fileToBase64(f)))
        result[key].forEach((item: any) => item.__isFile = true)
      }
      else if (typeof value === 'object') {
        result[key] = JSON.stringify(value)
      }
      else {
        result[key] = value
      }
    }

    return result
  }

  // 通过background脚本发送请求
  private static async requestViaBackground<T>(
    url: string,
    method: string,
    data?: any,
    headers?: Record<string, string>,
    config?: RequestConfig,
  ): Promise<T> {
    try {
      // 导入sendMessage，用于发送消息到background脚本
      const { sendMessage } = await import('webext-bridge/content-script')

      // 准备请求体
      let body: Record<string, any> | string | undefined

      if (data) {
        if (config?.isForm) {
          // FormData 请求
          headers = { ...headers, 'Content-Type': 'multipart/form-data' }
          body = await RequestHelper.serializeFormData(data)
        }
        else {
          // JSON 请求
          headers = { ...headers, 'Content-Type': 'application/json' }
          body = data
        }
      }

      // 发送消息到background脚本
      const response = await sendMessage('fetch-api', {
        url,
        method: method as 'GET' | 'POST' | 'PUT' | 'DELETE',
        headers,
        body,
      })

      if (!response.success) {
        const error = new Error(response.error || '[AMMDS Extension] 请求失败') as RequestError
        error.isNetworkError = true
        throw error
      }

      // 根据responseType处理返回数据
      const responseType = config?.responseType || 'json'
      if (responseType === 'json' || typeof response.data === 'object') {
        return response.data as T
      }
      else if (responseType === 'text' && typeof response.data === 'string') {
        return response.data as unknown as T
      }
      else {
        return response.data as T
      }
    }
    catch (error) {
      const requestError = error instanceof Error ? error : new Error('[AMMDS Extension] 网络请求失败')
      const typedError = requestError as RequestError

      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          typedError.isTimeout = true
          typedError.message = `[AMMDS Extension] 请求超时 (${config?.timeout || this.DEFAULT_TIMEOUT}ms)`
        }
        else {
          typedError.isNetworkError = true
        }
      }

      throw typedError
    }
  }

  // GET 请求
  public static async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, config)
  }

  // GET 请求 (参数)
  public static async getParams<T>(endpoint: string, params: Record<string, string>, config: RequestConfig = {}): Promise<T> {
    const queryString = new URLSearchParams(params).toString()
    return this.request<T>('GET', `${endpoint}?${queryString}`, undefined, config)
  }

  // POST 请求（JSON）
  public static async post<T>(endpoint: string, data: any, config: RequestConfig = {}): Promise<T> {
    return this.request<T>('POST', endpoint, data, config)
  }

  // POST 表单请求
  public static async postForm<T>(endpoint: string, data: any, config: RequestConfig = {}): Promise<T> {
    return this.request<T>('POST', endpoint, data, { ...config, isForm: true })
  }

  // PUT 请求
  public static async put<T>(endpoint: string, data: any, config: RequestConfig = {}): Promise<T> {
    return this.request<T>('PUT', endpoint, data, config)
  }

  // DELETE 请求
  public static async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, config)
  }
}
