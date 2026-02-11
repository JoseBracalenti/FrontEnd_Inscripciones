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
import { useUserAuth, type UserProfile } from "@/contexts/user-auth-context"

const STEPS = [
  { id: 1, name: "Verificar Datos" },
  { id: 2, name: "Tutor/Responsable" },
  { id: 3, name: "Selección de Curso" },
  { id: 4, name: "División y Horario" },
  { id: 5, name: "Método de Pago" },
  { id: 6, name: "Confirmación" },
]

// Simulated course data with availability
const coursesData = {
  idiomas: [
    { id: "ingles-basico", name: "Inglés Básico", minAge: 12, maxAge: 99, price: 15000, spots: 5 },
    { id: "ingles-intermedio", name: "Inglés Intermedio", minAge: 14, maxAge: 99, price: 15000, spots: 3 },
    { id: "ingles-avanzado", name: "Inglés Avanzado", minAge: 16, maxAge: 99, price: 18000, spots: 0 },
    { id: "frances-basico", name: "Francés Básico", minAge: 15, maxAge: 99, price: 15000, spots: 8 },
    { id: "italiano-basico", name: "Italiano Básico", minAge: 15, maxAge: 99, price: 15000, spots: 10 },
  ],
  instrumentos: [
    { id: "guitarra-1", name: "Guitarra Nivel 1", minAge: 10, maxAge: 99, price: 18000, spots: 4 },
    { id: "guitarra-2", name: "Guitarra Nivel 2", minAge: 12, maxAge: 99, price: 18000, spots: 2 },
    { id: "piano-1", name: "Piano Nivel 1", minAge: 8, maxAge: 99, price: 22000, spots: 1 },
    { id: "piano-2", name: "Piano Nivel 2", minAge: 10, maxAge: 99, price: 22000, spots: 0 },
    { id: "violin", name: "Violín", minAge: 8, maxAge: 99, price: 20000, spots: 3 },
  ],
  talleres: [
    { id: "teatro", name: "Teatro", minAge: 14, maxAge: 99, price: 12000, spots: 15 },
    { id: "pintura", name: "Pintura", minAge: 10, maxAge: 99, price: 12000, spots: 8 },
    { id: "fotografia", name: "Fotografía", minAge: 16, maxAge: 99, price: 14000, spots: 6 },
    { id: "danza", name: "Danza Contemporánea", minAge: 12, maxAge: 99, price: 12000, spots: 10 },
  ],
}

const divisionsData: Record<string, Array<{ id: string; name: string; schedule: string; spots: number }>> = {
  "ingles-basico": [
    { id: "A", name: "División A", schedule: "Lunes y Miércoles 18:00 - 19:30", spots: 3 },
    { id: "B", name: "División B", schedule: "Martes y Jueves 19:00 - 20:30", spots: 2 },
  ],
  "ingles-intermedio": [
    { id: "A", name: "División A", schedule: "Lunes y Miércoles 19:30 - 21:00", spots: 3 },
  ],
  "frances-basico": [
    { id: "A", name: "División A", schedule: "Viernes 17:00 - 19:00", spots: 8 },
  ],
  "italiano-basico": [
    { id: "A", name: "División A", schedule: "Martes 18:00 - 20:00", spots: 10 },
  ],
  "guitarra-1": [
    { id: "A", name: "División A", schedule: "Martes y Jueves 18:00 - 19:00", spots: 2 },
    { id: "B", name: "División B", schedule: "Sábados 10:00 - 12:00", spots: 2 },
  ],
  "guitarra-2": [
    { id: "A", name: "División A", schedule: "Miércoles y Viernes 18:00 - 19:00", spots: 2 },
  ],
  "piano-1": [
    { id: "A", name: "División A", schedule: "Miércoles 16:00 - 17:00", spots: 1 },
  ],
  "violin": [
    { id: "A", name: "División A", schedule: "Lunes 17:00 - 18:30", spots: 3 },
  ],
  "teatro": [
    { id: "A", name: "División A", schedule: "Viernes 18:00 - 20:00", spots: 10 },
    { id: "B", name: "División B", schedule: "Sábados 15:00 - 17:00", spots: 5 },
  ],
  "pintura": [
    { id: "A", name: "División A", schedule: "Jueves 16:00 - 18:00", spots: 8 },
  ],
  "fotografia": [
    { id: "A", name: "División A", schedule: "Sábados 10:00 - 13:00", spots: 6 },
  ],
  "danza": [
    { id: "A", name: "División A", schedule: "Martes y Jueves 19:00 - 20:30", spots: 10 },
  ],
}

export default function InscribirsePage() {
  const router = useRouter()
  const { user, isLoading: authLoading, logout, updateProfile } = useUserAuth()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [inscriptionComplete, setInscriptionComplete] = useState(false)
  const [inscriptionNumber, setInscriptionNumber] = useState("")
  const [formData, setFormData] = useState({
    // Tutor/Responsable (for minors)
    tutorNombre: "",
    tutorApellido: "",
    tutorDni: "",
    tutorRelacion: "",
    tutorTelefono: "",
    tutorEmail: "",
    
    // Emergency contact
    emergenciaNombre: "",
    emergenciaTelefono: "",
    
    // Course selection
    tipoCurso: "",
    curso: "",
    cursoNombre: "",
    division: "",
    divisionNombre: "",
    horario: "",
    precio: 0,
    
    // Payment
    metodoPago: "",
    aceptaTerminos: false,
  })
  
  const [edad, setEdad] = useState<number | null>(null)
  const [availableCourses, setAvailableCourses] = useState<typeof coursesData.idiomas>([])
  const [availableDivisions, setAvailableDivisions] = useState<typeof divisionsData["ingles-basico"]>([])

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
      
      // Pre-fill tutor data if exists
      if (user.tutorNombre) {
        setFormData(prev => ({
          ...prev,
          tutorNombre: user.tutorNombre || "",
          tutorApellido: user.tutorApellido || "",
          tutorDni: user.tutorDni || "",
          tutorRelacion: user.tutorRelacion || "",
          tutorTelefono: user.tutorTelefono || "",
          tutorEmail: user.tutorEmail || "",
        }))
      }
    }
  }, [user])

  // Filter courses by age when category changes
  useEffect(() => {
    if (formData.tipoCurso && edad !== null) {
      const courses = coursesData[formData.tipoCurso as keyof typeof coursesData] || []
      const filtered = courses.filter(c => edad >= c.minAge && edad <= c.maxAge && c.spots > 0)
      setAvailableCourses(filtered)
    }
  }, [formData.tipoCurso, edad])

  // Load divisions when course changes
  useEffect(() => {
    if (formData.curso) {
      const divisions = divisionsData[formData.curso] || []
      setAvailableDivisions(divisions.filter(d => d.spots > 0))
    }
  }, [formData.curso])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleNext = () => {
    // Skip tutor step if adult
    if (currentStep === 1 && edad && edad >= 18) {
      setCurrentStep(3)
    } else if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    // Skip tutor step if adult
    if (currentStep === 3 && edad && edad >= 18) {
      setCurrentStep(1)
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCourseSelect = (courseId: string) => {
    const allCourses = [...coursesData.idiomas, ...coursesData.instrumentos, ...coursesData.talleres]
    const course = allCourses.find(c => c.id === courseId)
    setFormData(prev => ({
      ...prev,
      curso: courseId,
      cursoNombre: course?.name || "",
      precio: course?.price || 0,
      division: "",
      divisionNombre: "",
      horario: "",
    }))
  }

  const handleDivisionSelect = (divisionId: string) => {
    const division = availableDivisions.find(d => d.id === divisionId)
    setFormData(prev => ({
      ...prev,
      division: divisionId,
      divisionNombre: division?.name || "",
      horario: division?.schedule || "",
    }))
  }

  const handleSubmit = () => {
    // Save tutor data to user profile if minor
    if (user?.esMenor && formData.tutorNombre) {
      updateProfile({
        tutorNombre: formData.tutorNombre,
        tutorApellido: formData.tutorApellido,
        tutorDni: formData.tutorDni,
        tutorRelacion: formData.tutorRelacion,
        tutorTelefono: formData.tutorTelefono,
        tutorEmail: formData.tutorEmail,
      })
    }
    
    // Generate inscription number
    const numero = `INS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`
    setInscriptionNumber(numero)
    setInscriptionComplete(true)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true // Just verify data
      case 2:
        return !user?.esMenor || (
          formData.tutorNombre && 
          formData.tutorApellido && 
          formData.tutorDni && 
          formData.tutorRelacion &&
          formData.tutorTelefono &&
          formData.emergenciaNombre &&
          formData.emergenciaTelefono
        )
      case 3:
        return formData.curso !== ""
      case 4:
        return formData.division !== ""
      case 5:
        return formData.metodoPago !== "" && formData.aceptaTerminos
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
                      {formData.metodoPago === "contado" ? "Contado (10% desc.)" : "Cuotas mensuales"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total a pagar</span>
                    <span className="text-primary">
                      ${formData.metodoPago === "contado" 
                        ? Math.round(formData.precio * 0.9).toLocaleString() 
                        : formData.precio.toLocaleString()}/mes
                    </span>
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
              {STEPS.filter(step => {
                // Hide tutor step for adults
                if (step.id === 2 && edad && edad >= 18) return false
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
                {currentStep === 3 && "Seleccioná el tipo de curso y el curso específico según tu edad"}
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

              {/* Step 2: Tutor Data (for minors) */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Requerido para menores</AlertTitle>
                    <AlertDescription className="text-amber-700 text-sm">
                      Como el alumno es menor de edad, es necesario completar los datos del tutor o responsable legal.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <h3 className="font-medium">Datos del Tutor/Responsable</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="tutorNombre">Nombre *</Label>
                        <Input
                          id="tutorNombre"
                          value={formData.tutorNombre}
                          onChange={(e) => setFormData(prev => ({ ...prev, tutorNombre: e.target.value }))}
                          placeholder="Nombre del tutor"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tutorApellido">Apellido *</Label>
                        <Input
                          id="tutorApellido"
                          value={formData.tutorApellido}
                          onChange={(e) => setFormData(prev => ({ ...prev, tutorApellido: e.target.value }))}
                          placeholder="Apellido del tutor"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tutorDni">DNI *</Label>
                        <Input
                          id="tutorDni"
                          value={formData.tutorDni}
                          onChange={(e) => setFormData(prev => ({ ...prev, tutorDni: e.target.value.replace(/\D/g, "") }))}
                          placeholder="DNI sin puntos"
                          maxLength={8}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tutorRelacion">Relación con el alumno *</Label>
                        <Select
                          value={formData.tutorRelacion}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, tutorRelacion: value }))}
                        >
                          <SelectTrigger id="tutorRelacion">
                            <SelectValue placeholder="Seleccionar relación" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="madre">Madre</SelectItem>
                            <SelectItem value="padre">Padre</SelectItem>
                            <SelectItem value="tutor">Tutor Legal</SelectItem>
                            <SelectItem value="otro">Otro familiar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tutorTelefono">Teléfono *</Label>
                        <Input
                          id="tutorTelefono"
                          type="tel"
                          value={formData.tutorTelefono}
                          onChange={(e) => setFormData(prev => ({ ...prev, tutorTelefono: e.target.value }))}
                          placeholder="Teléfono de contacto"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tutorEmail">Email</Label>
                        <Input
                          id="tutorEmail"
                          type="email"
                          value={formData.tutorEmail}
                          onChange={(e) => setFormData(prev => ({ ...prev, tutorEmail: e.target.value }))}
                          placeholder="Email del tutor (opcional)"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Contacto de Emergencia</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="emergenciaNombre">Nombre completo *</Label>
                        <Input
                          id="emergenciaNombre"
                          value={formData.emergenciaNombre}
                          onChange={(e) => setFormData(prev => ({ ...prev, emergenciaNombre: e.target.value }))}
                          placeholder="Nombre del contacto de emergencia"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergenciaTelefono">Teléfono *</Label>
                        <Input
                          id="emergenciaTelefono"
                          type="tel"
                          value={formData.emergenciaTelefono}
                          onChange={(e) => setFormData(prev => ({ ...prev, emergenciaTelefono: e.target.value }))}
                          placeholder="Teléfono de emergencia"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Course Selection */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Tipo de Curso</Label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { id: "idiomas", name: "Idiomas", desc: "Inglés, Francés, Italiano..." },
                        { id: "instrumentos", name: "Instrumentos", desc: "Guitarra, Piano, Violín..." },
                        { id: "talleres", name: "Talleres", desc: "Teatro, Pintura, Fotografía..." },
                      ].map((tipo) => (
                        <Card
                          key={tipo.id}
                          className={`cursor-pointer transition-all hover:border-primary ${
                            formData.tipoCurso === tipo.id ? "border-primary bg-primary/5" : ""
                          }`}
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            tipoCurso: tipo.id, 
                            curso: "", 
                            cursoNombre: "",
                            division: "",
                            divisionNombre: "",
                            horario: "",
                            precio: 0
                          }))}
                        >
                          <CardContent className="p-4">
                            <h4 className="font-medium">{tipo.name}</h4>
                            <p className="text-xs text-muted-foreground">{tipo.desc}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {formData.tipoCurso && (
                    <div className="space-y-4">
                      <Label>Curso Disponible (para tu edad: {edad} años)</Label>
                      {availableCourses.length === 0 ? (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            No hay cursos disponibles en esta categoría para tu edad o todos los cupos están completos.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {availableCourses.map((course) => (
                            <Card
                              key={course.id}
                              className={`cursor-pointer transition-all hover:border-primary ${
                                formData.curso === course.id ? "border-primary bg-primary/5" : ""
                              }`}
                              onClick={() => handleCourseSelect(course.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-medium">{course.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      ${course.price.toLocaleString()}/mes
                                    </p>
                                  </div>
                                  <Badge variant={course.spots <= 3 ? "destructive" : "secondary"}>
                                    {course.spots} cupos
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Division and Schedule */}
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
                              formData.division === division.id ? "border-primary bg-primary/5" : ""
                            }`}
                            onClick={() => handleDivisionSelect(division.id)}
                          >
                            <CardContent className="flex items-center justify-between p-4">
                              <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                  <span className="font-bold text-primary">{division.id}</span>
                                </div>
                                <div>
                                  <h4 className="font-medium">{division.name}</h4>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>{division.schedule}</span>
                                  </div>
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
                      <span className="text-muted-foreground">Precio mensual</span>
                      <span className="font-medium">${formData.precio.toLocaleString()}</span>
                    </div>
                  </div>

                  <RadioGroup
                    value={formData.metodoPago}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, metodoPago: value }))}
                    className="space-y-3"
                  >
                    <Card className={`cursor-pointer transition-all ${formData.metodoPago === "contado" ? "border-primary" : ""}`}>
                      <CardContent className="flex items-center gap-4 p-4">
                        <RadioGroupItem value="contado" id="contado" />
                        <div className="flex-1">
                          <Label htmlFor="contado" className="cursor-pointer font-medium">
                            Pago de contado (año completo)
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            10% de descuento abonando el año completo
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            ${Math.round(formData.precio * 10 * 0.9).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground line-through">
                            ${(formData.precio * 10).toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={`cursor-pointer transition-all ${formData.metodoPago === "cuotas" ? "border-primary" : ""}`}>
                      <CardContent className="flex items-center gap-4 p-4">
                        <RadioGroupItem value="cuotas" id="cuotas" />
                        <div className="flex-1">
                          <Label htmlFor="cuotas" className="cursor-pointer font-medium">
                            Cuotas mensuales
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            10 cuotas iguales (marzo a diciembre)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            ${formData.precio.toLocaleString()}/mes
                          </p>
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

                    {user.esMenor && formData.tutorNombre && (
                      <div className="rounded-lg border p-4 space-y-3">
                        <h3 className="font-medium">Tutor/Responsable</h3>
                        <div className="grid gap-2 text-sm sm:grid-cols-2">
                          <div>
                            <span className="text-muted-foreground">Nombre: </span>
                            <span className="font-medium">{formData.tutorNombre} {formData.tutorApellido}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">DNI: </span>
                            <span className="font-medium">{formData.tutorDni}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Relación: </span>
                            <span className="font-medium capitalize">{formData.tutorRelacion}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Teléfono: </span>
                            <span className="font-medium">{formData.tutorTelefono}</span>
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
                          {formData.metodoPago === "contado" ? "Pago de contado (10% desc.)" : "Cuotas mensuales"}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span className="font-medium">Total</span>
                        <span className="font-bold text-primary">
                          {formData.metodoPago === "contado" 
                            ? `$${Math.round(formData.precio * 10 * 0.9).toLocaleString()}`
                            : `$${formData.precio.toLocaleString()}/mes`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
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
                  <Button onClick={handleSubmit} disabled={!canProceed()}>
                    <Check className="mr-2 h-4 w-4" />
                    Confirmar Inscripción
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
