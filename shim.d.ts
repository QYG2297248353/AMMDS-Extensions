import type { ProtocolWithReturn } from 'webext-bridge'

declare module 'webext-bridge' {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    'tab-active': { title: string | undefined, url: string | undefined }
    'get-tab': ProtocolWithReturn<{ tabId: number }, { title: string | undefined, url: string | undefined }>
    'get-active-tab': ProtocolWithReturn<{ tabId?: number }, { title: string | undefined, url: string | undefined }>
    'fetch-api': ProtocolWithReturn<{
      url: string
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
      headers?: Record<string, string>
      body?: Record<string, any> | string
    }, { success: boolean, data?: any, error?: string }>
  }
}
