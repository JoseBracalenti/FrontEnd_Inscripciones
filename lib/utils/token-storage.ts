/**
 * Browser-only token storage (localStorage + auth cookie for middleware).
 * All functions no-op when typeof window === 'undefined'.
 */

const ACCESS_TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"
const AUTH_COOKIE_NAME = "auth_token"
const AUTH_COOKIE_DAYS = 7

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (!isBrowser()) return
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  const expires = new Date()
  expires.setDate(expires.getDate() + AUTH_COOKIE_DAYS)
  document.cookie = `${AUTH_COOKIE_NAME}=true; path=/; expires=${expires.toUTCString()}; SameSite=Lax`
}

export function clearTokens(): void {
  if (!isBrowser()) return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

/** JWT payload exp is in seconds. Treat as expired 1 minute before. */
const EXPIRY_BUFFER_MS = 60 * 1000

function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch {
    return null
  }
}

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true
  const payload = decodeJwtPayload(token)
  if (!payload || payload.exp == null) return true
  const expMs = payload.exp * 1000
  return Date.now() >= expMs - EXPIRY_BUFFER_MS
}

export function getTokenExpiration(token: string | null): number | null {
  if (!token) return null
  const payload = decodeJwtPayload(token)
  if (!payload || payload.exp == null) return null
  return payload.exp * 1000
}
