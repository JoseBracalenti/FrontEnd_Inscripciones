"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Download, 
  Printer, 
  Home, 
  Clock, 
  Users, 
  AlertCircle, 
  LogOut,
  User,
  Info,
  CheckCircle2,
  Loader2
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useUserAuth } from "@/contexts/user-auth-context"
import { inscripcionesService } from "@/lib/services/inscripciones.service"
import type { CursoDisponibleDto, DivisionHorarioDto } from "@/lib/inscripciones.types"

const STEPS = [
  { id: 1, name: "Verificar Datos" },
  { id: 2, name: "Tutor/Responsable" },
  { id: 3, name: "Selección de Curso" },
  { id: 4, name: "División y Horario" },
  { id: 5, name: "Método de Pago" },
  { id: 6, name: "Confirmación" },
]

const ANIO = new Date().getFullYear()

function formatPesos(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "A confirmar en administración"
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n)
}

export default function InscribirsePage() {
  const router = useRouter()
  const { user, isLoading: authLoading, logout } = useUserAuth()

  const [currentStep, setCurrentStep] = useState(1)
  const [inscriptionComplete, setInscriptionComplete] = useState(false)
  const [inscriptionNumber, setInscriptionNumber] = useState("")
  const [formData, setFormData] = useState({
    curso: "" as number | "",
    cursoNombre: "",
    idDivisionHorario: null as number | null,
    divisionNombre: "",
    horario: "",
    metodoPago: "",
    aceptaTerminos: false,
  })

  const [edad, setEdad] = useState<number | null>(null)
  const [cursosDisponibles, setCursosDisponibles] = useState<CursoDisponibleDto[]>([])
  const [cursosLoading, setCursosLoading] = useState(false)
  const [cursosError, setCursosError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate age from user profile
  useEffect(() => {
    if (user?.fechaNacimiento) {
      const hoy = new Date()
      const nacimiento = new Date(user.fechaNacimiento)
      let edadCalc = hoy.getFullYear() - nacimiento.getFullYear()
      const mes = hoy.getMonth() - nacimiento.getMonth()
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edadCalc--
      }
      setEdad(edadCalc)
    }
  }, [user])

  // Fetch available courses when user and age are ready
  useEffect(() => {
    if (!user || edad === null) return
    setCursosLoading(true)
    setCursosError(null)
    inscripcionesService
      .getCursosDisponibles(ANIO)
      .then(setCursosDisponibles)
      .catch((err) => setCursosError(err instanceof Error ? err.message : "Error al cargar cursos"))
      .finally(() => setCursosLoading(false))
  }, [user, edad])

  // Courses available for current age (API already filters by age; we only filter by having at least one division with cupo)
  const availableCourses = cursosDisponibles.filter((c) => {
    if (edad === null) return false
    if (edad < c.edadMinima || edad > c.edadMaxima) return false
    const withCupo = c.divisiones.filter((d) => d.cupo > d.cantidadInscriptos)
    return withCupo.length > 0
  })

  // Divisions for selected course with available spots
  const selectedCourse = formData.curso !== "" ? cursosDisponibles.find((c) => c.id === formData.curso) : null
  // Course that contains the selected division (for montoMatricula on payment step)
  const courseForSelectedDivision =
    formData.idDivisionHorario != null
      ? cursosDisponibles.find((c) => c.divisiones.some((d) => d.id === formData.idDivisionHorario))
      : null
  const montoMatricula = courseForSelectedDivision?.montoMatricula ?? null
  const cuotaMensual = montoMatricula != null ? montoMatricula / 10 : null
  const availableDivisions = selectedCourse
    ? selectedCourse.divisiones
        .filter((d) => d.cupo > d.cantidadInscriptos)
        .map((d) => ({ ...d, spots: d.cupo - d.cantidadInscriptos }))
    : []

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleNext = () => {
    if (currentStep === 1 && edad != null && edad >= 18) {
      setCurrentStep(3)
    } else if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep === 3 && edad != null && edad >= 18) {
      setCurrentStep(1)
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCourseSelect = (courseId: number) => {
    const course = cursosDisponibles.find((c) => c.id === courseId)
    setFormData((prev) => ({
      ...prev,
      curso: courseId,
      cursoNombre: course?.descripcion ?? "",
      idDivisionHorario: null,
      divisionNombre: "",
      horario: "",
    }))
  }

  const handleDivisionSelect = (division: DivisionHorarioDto & { spots: number }) => {
    setFormData((prev) => ({
      ...prev,
      idDivisionHorario: division.id,
      divisionNombre: `División ${division.letra}`,
      horario: division.horarios,
    }))
  }

  const handleSubmit = async () => {
    if (formData.idDivisionHorario == null || !formData.metodoPago) return
    setSubmitError(null)
    setIsSubmitting(true)
    const tipoPago = formData.metodoPago === "contado" ? "CONTADO" : "FINANCIADO"
    try {
      const res = await inscripcionesService.matricular({
        idDivisionHorario: formData.idDivisionHorario,
        tipoPago,
      })
      setInscriptionNumber(String(res.iduInscripcionPublic ?? res.idInscripcionAcademica))
      setInscriptionComplete(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al confirmar la inscripción")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true
      case 2:
        return (
          !!user?.tutorNombre &&
          !!user?.tutorApellido &&
          !!user?.tutorDni &&
          !!user?.tutorTelefono
        )
      case 3:
        return formData.curso !== ""
      case 4:
        return formData.idDivisionHorario != null
      case 5:
        return formData.metodoPago !== "" && formData.aceptaTerminos
      case 6:
        return true
      default:
        return true
    }
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
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
          </div>
        </header>

        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Iniciá sesión para inscribirte</CardTitle>
              <CardDescription>
                Necesitás una cuenta para poder realizar tu inscripción al Liceo Municipal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/cuenta/login" className="block">
                <Button className="w-full" size="lg">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/cuenta/registro" className="block">
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  Crear una cuenta
                </Button>
              </Link>
              <div className="pt-4 text-center">
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="mr-1 inline h-4 w-4" />
                  Volver al inicio
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // Show completion screen
  if (inscriptionComplete) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
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
          </div>
        </header>

        <main className="py-12">
          <div className="mx-auto max-w-2xl px-4">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-700">Inscripción Reservada</CardTitle>
                <CardDescription>
                  Tu inscripción ha sido registrada correctamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-sm text-muted-foreground">Número de inscripción</p>
                  <p className="text-2xl font-bold text-foreground">{inscriptionNumber}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Alumno</span>
                    <span className="font-medium">{user.nombre} {user.apellido}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">DNI</span>
                    <span className="font-medium">{user.dni}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Curso</span>
                    <span className="font-medium">{formData.cursoNombre}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">División / Horario</span>
                    <span className="font-medium">{formData.divisionNombre} - {formData.horario}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Método de pago</span>
                    <span className="font-medium">
                      {formData.metodoPago === "contado" ? "Contado" : "Cuotas mensuales"}
                    </span>
                  </div>
                  {formData.metodoPago === "cuotas" && cuotaMensual != null && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cuota mensual</span>
                      <span className="font-medium">{formatPesos(cuotaMensual)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total</span>
                    <span className="text-primary">{formatPesos(montoMatricula)}</span>
                  </div>
                </div>

                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">Próximos pasos</AlertTitle>
                  <AlertDescription className="text-amber-700 text-sm">
                    Tu inscripción está en estado <strong>RESERVADA</strong>. Para confirmarla, debés 
                    acercarte a las oficinas del Liceo Municipal con la documentación requerida dentro 
                    de los próximos 5 días hábiles.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Comprobante
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                  </Button>
                </div>

                <Link href="/" className="block">
                  <Button variant="ghost" className="w-full">
                    <Home className="mr-2 h-4 w-4" />
                    Volver al inicio
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
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
          <div className="flex items-center gap-3">
            <div className="text-right text-sm">
              <p className="font-medium">{user.nombre} {user.apellido}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Cerrar sesión">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="mx-auto max-w-4xl px-4">
          {/* Back link */}
          <Link href="/" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Nueva Inscripción</h1>
            <p className="mt-2 text-muted-foreground">
              Completá los pasos para inscribirte en el curso que desees
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.filter((step) => {
                if (step.id === 2 && edad != null && edad >= 18) return false
                return true
              }).map((step, index, filteredSteps) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                        currentStep > step.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : currentStep === step.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-muted bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span className="mt-2 text-xs text-muted-foreground hidden sm:block">
                      {step.name}
                    </span>
                  </div>
                  {index < filteredSteps.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 w-12 sm:w-24 ${
                        currentStep > step.id ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Verificá tus datos personales"}
                {currentStep === 2 && "Datos del Tutor/Responsable"}
                {currentStep === 3 && "Seleccioná el curso"}
                {currentStep === 4 && "Elegí división y horario"}
                {currentStep === 5 && "Método de pago"}
                {currentStep === 6 && "Confirmación de inscripción"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Revisá que tus datos sean correctos antes de continuar"}
                {currentStep === 2 && "Completá los datos del tutor o responsable legal (requerido para menores)"}
                {currentStep === 3 && "Seleccioná el curso según tu edad"}
                {currentStep === 4 && "Elegí la división y el horario que mejor se adapte a tu disponibilidad"}
                {currentStep === 5 && "Seleccioná cómo querés realizar el pago"}
                {currentStep === 6 && "Revisá todos los datos antes de confirmar"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Verify Personal Data */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {user.existiaEnSistema && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">Datos recuperados del sistema</AlertTitle>
                      <AlertDescription className="text-green-700 text-sm">
                        Encontramos tus datos de inscripciones anteriores. Verificá que sean correctos.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nombre</Label>
                      <Input value={user.nombre} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>Apellido</Label>
                      <Input value={user.apellido} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>DNI</Label>
                      <Input value={user.dni} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha de nacimiento</Label>
                      <Input 
                        value={new Date(user.fechaNacimiento).toLocaleDateString("es-AR")} 
                        disabled 
                        className="bg-muted" 
                      />
                      {edad !== null && (
                        <p className="text-xs text-muted-foreground">
                          Edad: {edad} años {edad < 18 && "(menor - se requerirán datos del tutor)"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Domicilio</Label>
                      <Input value={user.domicilio} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>Teléfono</Label>
                      <Input value={user.telefono} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={user.email} disabled className="bg-muted" />
                    </div>
                  </div>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Si necesitás modificar algún dato, podés hacerlo desde tu perfil o contactando a la administración del Liceo.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Step 2: Tutor Data (for minors) — read-only from perfil */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Datos del tutor o responsable</AlertTitle>
                    <AlertDescription className="text-amber-700 text-sm">
                      Verificá los datos del tutor o responsable legal. Si necesitás modificarlos, hacelo desde tu perfil o contactando a la administración del Liceo.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <h3 className="font-medium">Tutor/Responsable</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input value={user.tutorNombre ?? ""} disabled className="bg-muted" />
                      </div>
                      <div className="space-y-2">
                        <Label>Apellido</Label>
                        <Input value={user.tutorApellido ?? ""} disabled className="bg-muted" />
                      </div>
                      <div className="space-y-2">
                        <Label>DNI</Label>
                        <Input value={user.tutorDni ?? ""} disabled className="bg-muted" />
                      </div>
                      <div className="space-y-2">
                        <Label>Relación con el alumno</Label>
                        <Input value={user.tutorRelacion ?? ""} disabled className="bg-muted" />
                      </div>
                      <div className="space-y-2">
                        <Label>Teléfono</Label>
                        <Input value={user.tutorTelefono ?? ""} disabled className="bg-muted" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={user.tutorEmail ?? ""} disabled className="bg-muted" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Course Selection (from API) */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {cursosLoading ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Cargando cursos disponibles...</span>
                    </div>
                  ) : cursosError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{cursosError}</AlertDescription>
                    </Alert>
                  ) : availableCourses.length === 0 ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No hay cursos disponibles para tu edad ({edad} años) o todos los cupos están completos.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Año lectivo {ANIO}. Seleccioná un curso (para tu edad: {edad} años).
                      </p>
                      {Array.from(new Set(availableCourses.map((c) => c.carreraNombre))).map((carrera) => (
                        <div key={carrera} className="space-y-3">
                          <Label className="text-muted-foreground">{carrera}</Label>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {availableCourses
                              .filter((c) => c.carreraNombre === carrera)
                              .map((course) => {
                                const totalCupos = course.divisiones.filter(
                                  (d) => d.cupo > d.cantidadInscriptos
                                ).length
                                return (
                                  <Card
                                    key={course.id}
                                    className={`cursor-pointer transition-all hover:border-primary ${
                                      formData.curso === course.id ? "border-primary bg-primary/5" : ""
                                    }`}
                                    onClick={() => handleCourseSelect(course.id)}
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex items-start justify-between gap-2">
                                        <div>
                                          <h4 className="font-medium">{course.descripcion}</h4>
                                          <p className="text-xs text-muted-foreground">
                                            {course.edadMinima}–{course.edadMaxima} años · {totalCupos}{" "}
                                            división{totalCupos !== 1 ? "es" : ""} con cupo
                                          </p>
                                          {course.montoMatricula != null && (
                                            <p className="text-sm font-medium text-primary mt-1">
                                              {formatPesos(course.montoMatricula)}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )
                              })}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* Step 4: Division and Schedule (from API) */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">Curso seleccionado</p>
                    <p className="font-medium">{formData.cursoNombre}</p>
                  </div>

                  <div className="space-y-4">
                    <Label>Seleccioná una división y horario</Label>
                    {availableDivisions.length === 0 ? (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          No hay divisiones con cupos disponibles para este curso.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-3">
                        {availableDivisions.map((division) => (
                          <Card
                            key={division.id}
                            className={`cursor-pointer transition-all hover:border-primary ${
                              formData.idDivisionHorario === division.id ? "border-primary bg-primary/5" : ""
                            }`}
                            onClick={() => handleDivisionSelect(division)}
                          >
                            <CardContent className="flex items-center justify-between p-4">
                              <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                  <span className="font-bold text-primary">{division.letra}</span>
                                </div>
                                <div>
                                  <h4 className="font-medium">División {division.letra}</h4>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>{division.horarios}</span>
                                  </div>
                                  {division.instrumentoDescripcion && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {division.instrumentoDescripcion}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <Badge variant={division.spots <= 2 ? "destructive" : "secondary"}>
                                  {division.spots} cupos
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Payment Method */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="rounded-lg bg-muted p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Curso</span>
                      <span className="font-medium">{formData.cursoNombre}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">División</span>
                      <span className="font-medium">{formData.divisionNombre}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Matrícula (año)</span>
                      <span className="font-medium">{formatPesos(montoMatricula)}</span>
                    </div>
                  </div>

                  <RadioGroup
                    value={formData.metodoPago}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, metodoPago: value }))}
                    className="space-y-3"
                  >
                    <Card
                      role="button"
                      tabIndex={0}
                      className={`cursor-pointer transition-all ${formData.metodoPago === "contado" ? "border-primary" : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, metodoPago: "contado" }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          setFormData((prev) => ({ ...prev, metodoPago: "contado" }))
                        }
                      }}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <RadioGroupItem value="contado" id="contado" />
                        <div className="flex-1">
                          <span className="font-medium">Pago de contado (año completo)</span>
                          <p className="text-sm text-muted-foreground">
                            Pago único por el año completo
                          </p>
                          {montoMatricula != null && (
                            <p className="text-sm font-medium text-primary mt-1">
                              Total: {formatPesos(montoMatricula)}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      role="button"
                      tabIndex={0}
                      className={`cursor-pointer transition-all ${formData.metodoPago === "cuotas" ? "border-primary" : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, metodoPago: "cuotas" }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          setFormData((prev) => ({ ...prev, metodoPago: "cuotas" }))
                        }
                      }}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <RadioGroupItem value="cuotas" id="cuotas" />
                        <div className="flex-1">
                          <span className="font-medium">Cuotas mensuales (financiado)</span>
                          <p className="text-sm text-muted-foreground">
                            10 cuotas mensuales (matrícula / 10 por pago)
                          </p>
                          {cuotaMensual != null && (
                            <p className="text-sm font-medium text-primary mt-1">
                              {formatPesos(cuotaMensual)} por mes · Total: {formatPesos(montoMatricula ?? undefined)}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </RadioGroup>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terminos"
                      checked={formData.aceptaTerminos}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, aceptaTerminos: checked === true }))
                      }
                    />
                    <Label htmlFor="terminos" className="text-sm leading-relaxed cursor-pointer">
                      Acepto los términos y condiciones de inscripción del Liceo Municipal, incluyendo 
                      el reglamento interno y las políticas de pago y asistencia.
                    </Label>
                  </div>
                </div>
              )}

              {/* Step 6: Confirmation */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Revisá los datos antes de confirmar</AlertTitle>
                    <AlertDescription>
                      Una vez confirmada la inscripción, recibirás un comprobante por email.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="rounded-lg border p-4 space-y-3">
                      <h3 className="font-medium">Datos del Alumno</h3>
                      <div className="grid gap-2 text-sm sm:grid-cols-2">
                        <div>
                          <span className="text-muted-foreground">Nombre: </span>
                          <span className="font-medium">{user.nombre} {user.apellido}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">DNI: </span>
                          <span className="font-medium">{user.dni}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email: </span>
                          <span className="font-medium">{user.email}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Teléfono: </span>
                          <span className="font-medium">{user.telefono}</span>
                        </div>
                      </div>
                    </div>

                    {user.esMenor && user.tutorNombre && (
                      <div className="rounded-lg border p-4 space-y-3">
                        <h3 className="font-medium">Tutor/Responsable</h3>
                        <div className="grid gap-2 text-sm sm:grid-cols-2">
                          <div>
                            <span className="text-muted-foreground">Nombre: </span>
                            <span className="font-medium">{user.tutorNombre} {user.tutorApellido}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">DNI: </span>
                            <span className="font-medium">{user.tutorDni}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Relación: </span>
                            <span className="font-medium capitalize">{user.tutorRelacion}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Teléfono: </span>
                            <span className="font-medium">{user.tutorTelefono}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="rounded-lg border p-4 space-y-3">
                      <h3 className="font-medium">Curso Seleccionado</h3>
                      <div className="grid gap-2 text-sm sm:grid-cols-2">
                        <div>
                          <span className="text-muted-foreground">Curso: </span>
                          <span className="font-medium">{formData.cursoNombre}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">División: </span>
                          <span className="font-medium">{formData.divisionNombre}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-muted-foreground">Horario: </span>
                          <span className="font-medium">{formData.horario}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4 space-y-3">
                      <h3 className="font-medium">Pago</h3>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Método de pago</span>
                        <span className="font-medium">
                          {formData.metodoPago === "contado" ? "Pago de contado" : "Cuotas mensuales"}
                        </span>
                      </div>
                      {formData.metodoPago === "cuotas" && cuotaMensual != null && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cuota mensual (10 pagos)</span>
                          <span className="font-medium">{formatPesos(cuotaMensual)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg">
                        <span className="font-medium">Total</span>
                        <span className="font-bold text-primary">{formatPesos(montoMatricula)}</span>
                      </div>
                    </div>
                  </div>

                  {submitError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="bg-transparent"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                {currentStep < 6 ? (
                  <Button onClick={handleNext} disabled={!canProceed()}>
                    Siguiente
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Confirmando...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Confirmar Inscripción
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
