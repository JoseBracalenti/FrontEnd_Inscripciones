import * as tokenStorage from "@/lib/utils/token-storage"
import type { AuthProfile, LoginResponse } from "@/lib/auth.types"

// Valid JWT with exp=9999999999 (year 2286) — passes isTokenExpired() check
const MOCK_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjo5OTk5OTk5OTk5fQ.mocksignature"
const MOCK_REFRESH_TOKEN = "mock_refresh_token"

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export const authServiceMock = {
  async login(username: string, _password: string): Promise<LoginResponse> {
    await delay(400)
    tokenStorage.setTokens(MOCK_ACCESS_TOKEN, MOCK_REFRESH_TOKEN)
    return {
      access_token: MOCK_ACCESS_TOKEN,
      refresh_token: MOCK_REFRESH_TOKEN,
      expires_in: 3600,
      role: "ROLE_ADMIN",
    }
  },

  async logout(): Promise<void> {
    await delay(150)
    tokenStorage.clearTokens()
  },

  async getProfile(): Promise<AuthProfile> {
    await delay(200)
    return {
      id: "1",
      username: "estudiante01",
      email: "maria.garcia@ejemplo.com",
      roles: ["ROLE_ADMIN"],
    }
  },

  async refreshToken(_refreshToken: string): Promise<LoginResponse> {
    await delay(200)
    tokenStorage.setTokens(MOCK_ACCESS_TOKEN, MOCK_REFRESH_TOKEN)
    return {
      access_token: MOCK_ACCESS_TOKEN,
      refresh_token: MOCK_REFRESH_TOKEN,
      expires_in: 3600,
    }
  },
}
