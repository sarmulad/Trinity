/**
 * API Client Service
 * Centralized API client with error handling, retries, and type safety
 * Enterprise-grade HTTP client for Tago.io and internal APIs
 */

import type { Well, DashboardMetrics, Alert } from '@/types'

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

interface RequestConfig extends RequestInit {
  retry?: number
  timeout?: number
}

/**
 * Base API client with retry logic and timeout handling
 */
class APIClient {
  private baseURL: string
  private defaultTimeout = 30000 // 30 seconds

  constructor(baseURL: string = '') {
    this.baseURL = baseURL
  }

  private async fetchWithTimeout(
    url: string,
    config: RequestConfig = {}
  ): Promise<Response> {
    const { timeout = this.defaultTimeout, ...fetchConfig } = config
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new APIError('Request timeout', 408, 'TIMEOUT')
      }
      throw error
    }
  }

  private async fetchWithRetry(
    url: string,
    config: RequestConfig = {}
  ): Promise<Response> {
    const { retry = 3, ...fetchConfig } = config
    let lastError: Error | null = null

    for (let i = 0; i < retry; i++) {
      try {
        const response = await this.fetchWithTimeout(url, fetchConfig)
        
        // Only retry on 5xx errors or network failures
        if (response.ok || response.status < 500) {
          return response
        }
        
        lastError = new APIError(
          `Server error: ${response.status}`,
          response.status
        )
      } catch (error) {
        lastError = error as Error
      }

      // Exponential backoff
      if (i < retry - 1) {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000))
      }
    }

    throw lastError || new Error('Request failed after retries')
  }

  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getAuthToken()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...config.headers,
    }

    try {
      const response = await this.fetchWithRetry(url, {
        ...config,
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new APIError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData.code
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }
      throw new APIError(
        error instanceof Error ? error.message : 'Unknown error',
        500,
        'NETWORK_ERROR'
      )
    }
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  // Convenience methods
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  async post<T>(endpoint: string, data: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }
}

// Export singleton instance
export const apiClient = new APIClient('/api')

/**
 * API Service Functions
 * Type-safe wrappers for specific endpoints
 */

export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post<{ success: boolean; token: string; user: any }>(
      '/auth/login',
      { email, password }
    ),

  signup: (data: { name: string; email: string; password: string; phone: string }) =>
    apiClient.post<{ success: boolean; token: string; user: any }>(
      '/auth/signup',
      data
    ),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  },
}

export const dashboardAPI = {
  getMetrics: () =>
    apiClient.get<DashboardMetrics>('/dashboard/metrics'),

  getAlerts: () =>
    apiClient.get<{ alerts: Alert[] }>('/dashboard/alerts'),
}

export const wellsAPI = {
  getAll: (params?: { region?: string; status?: string }) => {
    const queryParams = new URLSearchParams(params as any).toString()
    const endpoint = queryParams ? `/wells?${queryParams}` : '/wells'
    return apiClient.get<{ wells: Well[]; total: number }>(endpoint)
  },

  getById: (id: string) =>
    apiClient.get<{ well: Well }>(`/wells/${id}`),

  create: (data: Partial<Well>) =>
    apiClient.post<{ success: boolean; well: Well }>('/wells', data),

  update: (id: string, data: Partial<Well>) =>
    apiClient.put<{ success: boolean; well: Well }>(`/wells/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<{ success: boolean }>(`/wells/${id}`),
}

export const productionAPI = {
  getHistory: (params?: { wellId?: string; range?: string }) => {
    const queryParams = new URLSearchParams(params as any).toString()
    const endpoint = queryParams ? `/production/history?${queryParams}` : '/production/history'
    return apiClient.get<{ data: any[] }>(endpoint)
  },
}
