import * as tokenStorage from "@/lib/utils/token-storage"
import type { LoginResponse } from "@/lib/auth.types"

const SESSION_EXPIRED_MESSAGE = "Session expired. Please login again."

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"
}

export interface RequestOptions {
  body?: unknown
  skipAuth?: boolean
  headers?: Record<string, string>
}

export class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = getBaseUrl()
  }

  private async refreshToken(): Promise<void> {
    const refresh = tokenStorage.getRefreshToken()
    if (!refresh) {
      tokenStorage.clearTokens()
      throw new Error(SESSION_EXPIRED_MESSAGE)
    }
    const url = `${this.baseUrl}/api/auth/refresh`
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    })
    if (!res.ok) {
      tokenStorage.clearTokens()
      throw new Error(SESSION_EXPIRED_MESSAGE)
    }
    const data = (await res.json()) as LoginResponse
    tokenStorage.setTokens(data.access_token, data.refresh_token)
  }

  private async getAuthHeader(skipAuth: boolean): Promise<string | undefined> {
    if (skipAuth) return undefined
    let accessToken = tokenStorage.getAccessToken()
    if (accessToken && tokenStorage.isTokenExpired(accessToken)) {
      await this.refreshToken()
      accessToken = tokenStorage.getAccessToken()
    }
    if (!accessToken) return undefined
    return `Bearer ${accessToken}`
  }

  async request<T>(
    method: string,
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { body, skipAuth = false, headers: extraHeaders = {} } = options
    const authHeader = await this.getAuthHeader(skipAuth)
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...extraHeaders,
    }
    if (authHeader) headers["Authorization"] = authHeader

    const url = path.startsWith("http") ? path : `${this.baseUrl}${path}`
    let res = await fetch(url, {
      method,
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
    })

    if (res.status === 401 && !skipAuth) {
      await this.refreshToken()
      const retryAuth = await this.getAuthHeader(false)
      const retryHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...extraHeaders,
      }
      if (retryAuth) retryHeaders["Authorization"] = retryAuth
      res = await fetch(url, {
        method,
        headers: retryHeaders,
        body: body != null ? JSON.stringify(body) : undefined,
      })
      if (res.status === 401) {
        tokenStorage.clearTokens()
        throw new Error(SESSION_EXPIRED_MESSAGE)
      }
    }

    if (!res.ok) {
      // Use "Session expired" only for authenticated requests; for skipAuth (e.g. login/register) use body or generic
      let message = res.status === 401 && !skipAuth ? SESSION_EXPIRED_MESSAGE : "Request failed"
      try {
        const text = await res.text()
        if (text) {
          try {
            const errBody = JSON.parse(text)
            if (errBody?.message) message = errBody.message
            else if (errBody?.error) message = errBody.error
          } catch {
            message = text
          }
        }
      } catch {
        // keep default message
      }
      throw new Error(message)
    }

    const contentType = res.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      return res.json() as Promise<T>
    }
    return undefined as unknown as T
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", path, options)
  }

  post<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("POST", path, options)
  }

  put<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("PUT", path, options)
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", path, options)
  }
}

export const apiClient = new ApiClient()
