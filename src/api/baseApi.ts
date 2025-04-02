import type { AxiosRequestConfig } from 'axios'
import axiosInstance from '../logic/axiosInstance'

// 定义响应数据的基础接口
interface BaseResponse<T = any> {
  code: number
  data: T
  message: string
  timestamp: number
}

// 基础API类
export class BaseApi {
  // GET请求
  static async get<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    const response = await axiosInstance.get(url, { params, ...config })
    return response.data as unknown as BaseResponse<T>
  }

  // POST请求
  static async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    const response = await axiosInstance.post(url, data, config)
    return response.data as unknown as BaseResponse<T>
  }

  // PUT请求
  static async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    const response = await axiosInstance.put(url, data, config)
    return response.data as unknown as BaseResponse<T>
  }

  // DELETE请求
  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    const response = await axiosInstance.delete(url, config)
    return response.data as unknown as BaseResponse<T>
  }

  // 表单提交
  static async submitForm<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    const response = await axiosInstance.postForm(url, formData, config)
    return response.data as unknown as BaseResponse<T>
  }
}

// 导出实例方法
export const { get, post, put, delete: del, submitForm } = BaseApi
