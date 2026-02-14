import { apiClient } from "@/lib/api-client"
import * as tokenStorage from "@/lib/utils/token-storage"
import type {
  AuthProfile,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
} from "@/lib/auth.types"

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const body: LoginRequest = { username, password }
    const res = await apiClient.post<LoginResponse>("/api/auth/login", {
      body,
      skipAuth: true,
    })
    tokenStorage.setTokens(res.access_token, res.refresh_token)
    return res
  },

  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken()
    if (refreshToken) {
      try {
        await apiClient.post("/api/auth/logout", {
          body: { refresh_token: refreshToken },
        })
      } catch {
        // Ignore; clear tokens anyway
      }
    }
    tokenStorage.clearTokens()
  },

  async getProfile(): Promise<AuthProfile> {
    return apiClient.get<AuthProfile>("/api/auth/profile")
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const body: RefreshRequest = { refresh_token: refreshToken }
    const res = await apiClient.post<LoginResponse>("/api/auth/refresh", {
      body,
      skipAuth: true,
    })
    tokenStorage.setTokens(res.access_token, res.refresh_token)
    return res
  },
}
