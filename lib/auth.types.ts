/** Login request body */
export interface LoginRequest {
  username: string
  password: string
}

/** Login and refresh response */
export interface LoginResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  role?: string
}

/** Refresh request body */
export interface RefreshRequest {
  refresh_token: string
}

/** Current user profile from GET /api/auth/profile */
export interface AuthProfile {
  id: string
  username: string
  email: string
  roles: string[]
}
