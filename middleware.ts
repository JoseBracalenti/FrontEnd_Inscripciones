import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ADMIN_DEMO_ENABLED } from "@/lib/feature-flags"

const LOGIN_PATH = "/cuenta/login"

function isPublicRoute(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname.startsWith("/cuenta/login") ||
    pathname === "/" ||
    pathname.startsWith("/cuenta/registro")
  )
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const authCookie = request.cookies.get("auth_token")

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/")

  // Prototipo mock /admin: 404 salvo que el flag de build esté prendido (PUF-97)
  if (isAdminRoute && !ADMIN_DEMO_ENABLED) {
    return new NextResponse("Not Found", { status: 404 })
  }

  // Always allow login page to load so user can clear stale session and sign in
  // (admin has its own auth and layout, so it skips the student cookie check)
  if (isAdminRoute || isPublicRoute(pathname)) {
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
