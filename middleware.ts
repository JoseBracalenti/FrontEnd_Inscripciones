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

  if (isPublicRoute(pathname)) {
    if (pathname.startsWith("/cuenta/login") && authCookie?.value) {
      const redirect = request.nextUrl.searchParams.get("redirect")
      const target = redirect?.startsWith("/") && !redirect.startsWith("//")
        ? redirect
        : DEFAULT_AFTER_LOGIN
      return NextResponse.redirect(new URL(target, request.url))
    }
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
