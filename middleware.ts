import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const LOGIN_PATH = "/cuenta/login"
const DEFAULT_AFTER_LOGIN = "/inscribirse"

function isPublicRoute(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname.startsWith("/cuenta/login") ||
    pathname === "/" ||
    pathname.startsWith("/cuenta/registro") ||
    pathname.startsWith("/admin") // admin has its own auth and layout
  )
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const authCookie = request.cookies.get("auth_token")

  // Always allow login page to load so user can clear stale session and sign in
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  if (!authCookie?.value) {
    const loginUrl = new URL(LOGIN_PATH, request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Only run on page routes; skip _next/static, _next/image, favicon, and other static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
