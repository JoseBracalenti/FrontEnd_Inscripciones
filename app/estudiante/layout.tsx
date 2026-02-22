"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, BookOpen, History } from "lucide-react"
import { useUserAuth } from "@/contexts/user-auth-context"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function EstudianteLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useUserAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/cuenta/login?redirect=/estudiante")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isHistoria = pathname === "/estudiante/historia"
  const isDashboard = pathname === "/estudiante" || (pathname.startsWith("/estudiante/") && !isHistoria)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo-muni.png"
                alt="Municipalidad de Santo Tomé"
                width={48}
                height={48}
                className="h-12 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-foreground leading-tight">Liceo Municipal</h1>
                <p className="text-xs text-muted-foreground">Santo Tomé - Mi espacio</p>
              </div>
            </Link>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Inicio
              </Button>
            </Link>
            <Link href="/inscribirse">
              <Button variant="ghost" size="sm">
                Inscribirme
              </Button>
            </Link>
            <Link href="/estudiante">
              <Button size="sm" variant="default">
                Mi espacio
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.nombre}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">
                    {user.nombre} {user.apellido}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
        {/* Secondary nav: Mis cursos / Mi historia académica */}
        <div className="border-t border-border/50 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex gap-1 py-2">
              <Link
                href="/estudiante"
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isDashboard
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <BookOpen className="mr-2 inline h-4 w-4" />
                Mis cursos
              </Link>
              <Link
                href="/estudiante/historia"
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isHistoria
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <History className="mr-2 inline h-4 w-4" />
                Mi historia académica
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
