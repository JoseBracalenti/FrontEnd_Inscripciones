"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, ArrowLeft, CheckCircle2, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useUserAuth } from "@/contexts/user-auth-context"

export default function UserRegisterPage() {
  const router = useRouter()
  const { register } = useUserAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<{ message: string; wasLinked: boolean } | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    dni: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    domicilio: "",
    telefono: "",
  })
  const [edad, setEdad] = useState<number | null>(null)

  const calcularEdad = (fechaNacimiento: string) => {
    if (!fechaNacimiento) return null
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    let edadCalc = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edadCalc--
    }
    return edadCalc
  }

  const handleFechaNacimientoChange = (fecha: string) => {
    setFormData(prev => ({ ...prev, fechaNacimiento: fecha }))
    setEdad(calcularEdad(fecha))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(null)
    
    // Validations
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }
    
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }
    
    if (formData.dni.length < 7 || formData.dni.length > 8) {
      setError("El DNI debe tener entre 7 y 8 dígitos")
      setIsLoading(false)
      return
    }
    
    const result = await register({
      email: formData.email,
      password: formData.password,
      dni: formData.dni,
      nombre: formData.nombre,
      apellido: formData.apellido,
      fechaNacimiento: formData.fechaNacimiento,
      domicilio: formData.domicilio,
      telefono: formData.telefono,
    })
    
    if (result.success) {
      setSuccess({
        message: result.wasLinked 
          ? "¡Encontramos tus datos en nuestro sistema! Tu cuenta ha sido vinculada con tus registros anteriores."
          : "¡Cuenta creada exitosamente! Ya podés continuar con tu inscripción.",
        wasLinked: result.wasLinked || false
      })
      setTimeout(() => {
        router.push("/inscribirse")
      }, 2000)
    } else {
      setError(result.error || "Error al crear la cuenta")
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

      <main className="py-8">
        <div className="mx-auto max-w-2xl px-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
              <CardDescription>
                Ingresá tus datos para crear una cuenta y poder inscribirte
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Info alert */}
              <Alert className="mb-6 border-primary/20 bg-primary/5">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle>Información importante</AlertTitle>
                <AlertDescription className="text-sm">
                  Si ya fuiste alumno del Liceo Municipal, ingresá tu DNI y verificaremos tus datos 
                  para vincular tu cuenta con tu historial académico.
                </AlertDescription>
              </Alert>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle>{success.wasLinked ? "Cuenta vinculada" : "Registro exitoso"}</AlertTitle>
                    <AlertDescription>{success.message}</AlertDescription>
                  </Alert>
                )}
                
                {/* Account credentials */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Datos de la cuenta</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      disabled={isLoading || !!success}
                    />
                    <p className="text-xs text-muted-foreground">
                      Usarás este email para iniciar sesión y recibir notificaciones
                    </p>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        required
                        disabled={isLoading || !!success}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Repetí tu contraseña"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        disabled={isLoading || !!success}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Personal data */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Datos personales del alumno</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        placeholder="Tu nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                        required
                        disabled={isLoading || !!success}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido *</Label>
                      <Input
                        id="apellido"
                        placeholder="Tu apellido"
                        value={formData.apellido}
                        onChange={(e) => setFormData(prev => ({ ...prev, apellido: e.target.value }))}
                        required
                        disabled={isLoading || !!success}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dni">DNI (sin puntos) *</Label>
                      <Input
                        id="dni"
                        placeholder="12345678"
                        value={formData.dni}
                        onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value.replace(/\D/g, "") }))}
                        maxLength={8}
                        required
                        disabled={isLoading || !!success}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fechaNacimiento">Fecha de nacimiento *</Label>
                      <Input
                        id="fechaNacimiento"
                        type="date"
                        value={formData.fechaNacimiento}
                        onChange={(e) => handleFechaNacimientoChange(e.target.value)}
                        max={new Date().toISOString().split("T")[0]}
                        required
                        disabled={isLoading || !!success}
                      />
                      {edad !== null && (
                        <p className="text-xs text-muted-foreground">
                          Edad: {edad} años {edad < 18 && "(menor de edad - requerirá datos del tutor al inscribirse)"}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="domicilio">Domicilio *</Label>
                    <Input
                      id="domicilio"
                      placeholder="Calle y número, ciudad"
                      value={formData.domicilio}
                      onChange={(e) => setFormData(prev => ({ ...prev, domicilio: e.target.value }))}
                      required
                      disabled={isLoading || !!success}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono de contacto *</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      placeholder="3424567890"
                      value={formData.telefono}
                      onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                      required
                      disabled={isLoading || !!success}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading || !!success}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Redirigiendo...
                    </>
                  ) : (
                    "Crear Cuenta"
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">¿Ya tenés cuenta? </span>
                <Link href="/cuenta/login" className="font-medium text-primary hover:underline">
                  Iniciá sesión
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
