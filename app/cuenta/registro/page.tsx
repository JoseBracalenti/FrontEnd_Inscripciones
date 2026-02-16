"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, AlertCircle, ArrowLeft, CheckCircle2, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useUserAuth } from "@/contexts/user-auth-context"

const SEXO_OPTIONS = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" },
  { value: "X", label: "Otro / No binario" },
]

const OPTIONAL = "none"
const TIPO_DOC_OPTIONS = [
  { value: OPTIONAL, label: "Seleccionar (opcional)" },
  { value: "DNI", label: "DNI" },
  { value: "LC", label: "LC" },
  { value: "LE", label: "LE" },
  { value: "Otro", label: "Otro" },
]

export default function UserRegisterPage() {
  const router = useRouter()
  const { register } = useUserAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [edad, setEdad] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    nombre: "",
    apellido: "",
    numeroDocumento: "",
    tipoDocumento: "",
    domicilio: "",
    localidad: "",
    telefono: "",
    fechaNacimiento: "",
    sexo: "",
    escuela: "",
    nivelEscolar: "",
    poseeCud: false,
    discapacidad: "",
    ocupacion: "",
    responsableNombre: "",
    responsableApellido: "",
    responsableParentesco: "",
    responsableTipoDocumento: "",
    responsableNumeroDocumento: "",
    responsableDomicilio: "",
    responsableLocalidad: "",
    responsableTelefono: "",
    responsableEmail: "",
    responsableSexo: "",
    responsableOcupacion: "",
  })

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

  const isMinor = edad !== null && edad < 18

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

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
    const username = formData.username.trim()
    if (!username || username.length > 50) {
      setError("El usuario debe tener entre 1 y 50 caracteres")
      setIsLoading(false)
      return
    }
    if (formData.numeroDocumento.length < 7 || formData.numeroDocumento.length > 8) {
      setError("El DNI debe tener entre 7 y 8 dígitos")
      setIsLoading(false)
      return
    }
    if (!formData.localidad.trim()) {
      setError("La localidad es obligatoria")
      setIsLoading(false)
      return
    }
    if (!formData.sexo) {
      setError("El sexo es obligatorio")
      setIsLoading(false)
      return
    }
    if (isMinor) {
      if (!formData.responsableNombre.trim() || !formData.responsableApellido.trim()) {
        setError("Para menores de 18 años son obligatorios el nombre y apellido del responsable")
        setIsLoading(false)
        return
      }
    }

    const result = await register({
      username,
      password: formData.password,
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      numeroDocumento: formData.numeroDocumento.trim(),
      domicilio: formData.domicilio.trim(),
      localidad: formData.localidad.trim(),
      fechaNacimiento: formData.fechaNacimiento,
      sexo: formData.sexo,
      ...(formData.tipoDocumento && formData.tipoDocumento !== OPTIONAL && { tipoDocumento: formData.tipoDocumento }),
      ...(formData.telefono.trim() && { telefono: formData.telefono.trim() }),
      ...(formData.email.trim() && { email: formData.email.trim() }),
      ...(formData.escuela.trim() && { escuela: formData.escuela.trim() }),
      ...(formData.nivelEscolar.trim() && { nivelEscolar: formData.nivelEscolar.trim() }),
      ...(formData.poseeCud && { poseeCud: true }),
      ...(formData.discapacidad.trim() && { discapacidad: formData.discapacidad.trim() }),
      ...(formData.ocupacion.trim() && { ocupacion: formData.ocupacion.trim() }),
      ...(isMinor && {
        responsableNombre: formData.responsableNombre.trim(),
        responsableApellido: formData.responsableApellido.trim(),
        ...(formData.responsableParentesco.trim() && { responsableParentesco: formData.responsableParentesco.trim() }),
        ...(formData.responsableTipoDocumento && { responsableTipoDocumento: formData.responsableTipoDocumento }),
        ...(formData.responsableNumeroDocumento.trim() && { responsableNumeroDocumento: formData.responsableNumeroDocumento.trim() }),
        ...(formData.responsableDomicilio.trim() && { responsableDomicilio: formData.responsableDomicilio.trim() }),
        ...(formData.responsableLocalidad.trim() && { responsableLocalidad: formData.responsableLocalidad.trim() }),
        ...(formData.responsableTelefono.trim() && { responsableTelefono: formData.responsableTelefono.trim() }),
        ...(formData.responsableEmail.trim() && { responsableEmail: formData.responsableEmail.trim() }),
        ...(formData.responsableSexo && { responsableSexo: formData.responsableSexo }),
        ...(formData.responsableOcupacion.trim() && { responsableOcupacion: formData.responsableOcupacion.trim() }),
      }),
    })

    if (result.success) {
      setSuccess(true)
      setTimeout(() => router.push("/inscribirse"), 2000)
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
              <Alert className="mb-6 border-primary/20 bg-primary/5">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle>Información importante</AlertTitle>
                <AlertDescription className="text-sm">
                  Completá todos los datos. Si sos menor de 18 años, también se requieren los datos del responsable.
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
                  <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle>Cuenta creada</AlertTitle>
                    <AlertDescription>Redirigiendo a inscripción...</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Datos de la cuenta</h3>
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuario (para iniciar sesión) *</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="ej. juan.perez"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      maxLength={50}
                      required
                      disabled={isLoading || success}
                    />
                    <p className="text-xs text-muted-foreground">Lo usarás para iniciar sesión (1 a 50 caracteres)</p>
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
                        disabled={isLoading || success}
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
                        disabled={isLoading || success}
                      />
                    </div>
                  </div>
                </div>

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
                        disabled={isLoading || success}
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
                        disabled={isLoading || success}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tipoDocumento">Tipo de documento</Label>
                      <Select
                        value={formData.tipoDocumento || OPTIONAL}
                        onValueChange={(v) => setFormData(prev => ({ ...prev, tipoDocumento: v === OPTIONAL ? "" : v }))}
                        disabled={isLoading || success}
                      >
                        <SelectTrigger id="tipoDocumento">
                          <SelectValue placeholder="Seleccionar (opcional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIPO_DOC_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numeroDocumento">Número de documento (DNI) *</Label>
                      <Input
                        id="numeroDocumento"
                        placeholder="12345678"
                        value={formData.numeroDocumento}
                        onChange={(e) => setFormData(prev => ({ ...prev, numeroDocumento: e.target.value.replace(/\D/g, "") }))}
                        maxLength={8}
                        required
                        disabled={isLoading || success}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fechaNacimiento">Fecha de nacimiento *</Label>
                      <Input
                        id="fechaNacimiento"
                        type="date"
                        value={formData.fechaNacimiento}
                        onChange={(e) => handleFechaNacimientoChange(e.target.value)}
                        max={new Date().toISOString().split("T")[0]}
                        required
                        disabled={isLoading || success}
                      />
                      {edad !== null && (
                        <p className="text-xs text-muted-foreground">
                          Edad: {edad} años {edad < 18 && "(menor — completá datos del responsable más abajo)"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sexo">Sexo *</Label>
                      <Select
                        value={formData.sexo || undefined}
                        onValueChange={(v) => setFormData(prev => ({ ...prev, sexo: v }))}
                        disabled={isLoading || success}
                      >
                        <SelectTrigger id="sexo">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {SEXO_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domicilio">Domicilio *</Label>
                    <Input
                      id="domicilio"
                      placeholder="Calle y número"
                      value={formData.domicilio}
                      onChange={(e) => setFormData(prev => ({ ...prev, domicilio: e.target.value }))}
                      required
                      disabled={isLoading || success}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="localidad">Localidad *</Label>
                    <Input
                      id="localidad"
                      placeholder="Ciudad o localidad"
                      value={formData.localidad}
                      onChange={(e) => setFormData(prev => ({ ...prev, localidad: e.target.value }))}
                      required
                      disabled={isLoading || success}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        type="tel"
                        placeholder="3424567890"
                        value={formData.telefono}
                        onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                        disabled={isLoading || success}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={isLoading || success}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="escuela">Escuela</Label>
                      <Input
                        id="escuela"
                        placeholder="Nombre del establecimiento"
                        value={formData.escuela}
                        onChange={(e) => setFormData(prev => ({ ...prev, escuela: e.target.value }))}
                        disabled={isLoading || success}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nivelEscolar">Nivel escolar</Label>
                      <Input
                        id="nivelEscolar"
                        placeholder="Ej. Primario, Secundario"
                        value={formData.nivelEscolar}
                        onChange={(e) => setFormData(prev => ({ ...prev, nivelEscolar: e.target.value }))}
                        disabled={isLoading || success}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="poseeCud"
                      checked={formData.poseeCud}
                      onCheckedChange={(c) => setFormData(prev => ({ ...prev, poseeCud: c === true }))}
                      disabled={isLoading || success}
                    />
                    <Label htmlFor="poseeCud" className="font-normal">Posee CUD (certificado único de discapacidad)</Label>
                  </div>
                  {formData.poseeCud && (
                    <div className="space-y-2">
                      <Label htmlFor="discapacidad">Discapacidad (descripción)</Label>
                      <Input
                        id="discapacidad"
                        placeholder="Descripción si corresponde"
                        value={formData.discapacidad}
                        onChange={(e) => setFormData(prev => ({ ...prev, discapacidad: e.target.value }))}
                        disabled={isLoading || success}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="ocupacion">Ocupación</Label>
                    <Input
                      id="ocupacion"
                      placeholder="Ej. Estudiante, empleado"
                      value={formData.ocupacion}
                      onChange={(e) => setFormData(prev => ({ ...prev, ocupacion: e.target.value }))}
                      disabled={isLoading || success}
                    />
                  </div>
                </div>

                {isMinor && (
                  <div className="space-y-4 rounded-lg border p-4">
                    <h3 className="font-medium text-foreground">Datos del responsable (menor de 18 años)</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="responsableNombre">Nombre del responsable *</Label>
                        <Input
                          id="responsableNombre"
                          value={formData.responsableNombre}
                          onChange={(e) => setFormData(prev => ({ ...prev, responsableNombre: e.target.value }))}
                          required={isMinor}
                          disabled={isLoading || success}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="responsableApellido">Apellido del responsable *</Label>
                        <Input
                          id="responsableApellido"
                          value={formData.responsableApellido}
                          onChange={(e) => setFormData(prev => ({ ...prev, responsableApellido: e.target.value }))}
                          required={isMinor}
                          disabled={isLoading || success}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsableParentesco">Relación con el alumno (parentesco)</Label>
                      <Input
                        id="responsableParentesco"
                        placeholder="Ej. Madre, Padre, Tutor"
                        value={formData.responsableParentesco}
                        onChange={(e) => setFormData(prev => ({ ...prev, responsableParentesco: e.target.value }))}
                        disabled={isLoading || success}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Tipo de documento</Label>
                        <Select
                          value={formData.responsableTipoDocumento || OPTIONAL}
                          onValueChange={(v) => setFormData(prev => ({ ...prev, responsableTipoDocumento: v === OPTIONAL ? "" : v }))}
                          disabled={isLoading || success}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar (opcional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIPO_DOC_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="responsableNumeroDocumento">Número de documento</Label>
                        <Input
                          id="responsableNumeroDocumento"
                          placeholder="12345678"
                          value={formData.responsableNumeroDocumento}
                          onChange={(e) => setFormData(prev => ({ ...prev, responsableNumeroDocumento: e.target.value.replace(/\D/g, "") }))}
                          maxLength={8}
                          disabled={isLoading || success}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsableDomicilio">Domicilio</Label>
                      <Input
                        id="responsableDomicilio"
                        placeholder="Calle y número"
                        value={formData.responsableDomicilio}
                        onChange={(e) => setFormData(prev => ({ ...prev, responsableDomicilio: e.target.value }))}
                        disabled={isLoading || success}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsableLocalidad">Localidad</Label>
                      <Input
                        id="responsableLocalidad"
                        placeholder="Ciudad"
                        value={formData.responsableLocalidad}
                        onChange={(e) => setFormData(prev => ({ ...prev, responsableLocalidad: e.target.value }))}
                        disabled={isLoading || success}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="responsableTelefono">Teléfono</Label>
                        <Input
                          id="responsableTelefono"
                          type="tel"
                          value={formData.responsableTelefono}
                          onChange={(e) => setFormData(prev => ({ ...prev, responsableTelefono: e.target.value }))}
                          disabled={isLoading || success}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="responsableEmail">Email</Label>
                        <Input
                          id="responsableEmail"
                          type="email"
                          value={formData.responsableEmail}
                          onChange={(e) => setFormData(prev => ({ ...prev, responsableEmail: e.target.value }))}
                          disabled={isLoading || success}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Sexo</Label>
                        <Select
                          value={formData.responsableSexo || undefined}
                          onValueChange={(v) => setFormData(prev => ({ ...prev, responsableSexo: v }))}
                          disabled={isLoading || success}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar (opcional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {SEXO_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="responsableOcupacion">Ocupación</Label>
                        <Input
                          id="responsableOcupacion"
                          value={formData.responsableOcupacion}
                          onChange={(e) => setFormData(prev => ({ ...prev, responsableOcupacion: e.target.value }))}
                          disabled={isLoading || success}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading || success}>
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
