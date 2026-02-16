"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useUserAuth } from "@/contexts/user-auth-context"

/** Allow only relative paths to avoid open redirect */
function safeRedirect(redirect: string | null): string {
  if (!redirect || typeof redirect !== "string") return "/inscribirse"
  const trimmed = redirect.trim()
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return "/inscribirse"
  return trimmed
}

export default function UserLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, user, isLoading: authLoading } = useUserAuth()
  const [isLoading, setIsLoading] = useState(false)

  // If already logged in, redirect to target or inscribirse
  useEffect(() => {
    if (!authLoading && user) {
      const redirect = searchParams.get("redirect")
      router.replace(safeRedirect(redirect))
    }
  }, [authLoading, user, router, searchParams])
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const username = formData.username?.trim() ?? ""
    const password = formData.password ?? ""
    if (!username || !password) {
      setError("Ingresá usuario y contraseña")
      setIsLoading(false)
      return
    }

    const result = await login(username, password)

    if (result.success) {
      const redirect = searchParams.get("redirect")
      router.push(safeRedirect(redirect))
    } else {
      setError(result.error || "Error al iniciar sesión")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo-muni.png"
              alt="Municipalidad de Santo Tomé"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-sm font-semibold text-foreground">Liceo Municipal</h1>
              <p className="text-xs text-muted-foreground">Sistema de Inscripciones</p>
            </div>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresá con tu cuenta para continuar con la inscripción
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Tu usuario"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">¿No tenés cuenta? </span>
              <Link href="/cuenta/registro" className="font-medium text-primary hover:underline">
                Registrate acá
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
