"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, CheckCircle, ArrowRight, Lock, Check } from "lucide-react"
import Link from "next/link"

// Datos simulados de alumnos promovidos
const alumnosPromovidos = [
  {
    id: 1,
    nombre: "García, María Fernanda",
    dni: "42123456",
    cursoActual: "Inglés Intermedio",
    asistencia: 95,
    promedio: 9.2,
    estado: "Promovida",
    cursosDisponibles: ["Inglés Avanzado", "Francés Básico"],
  },
  {
    id: 2,
    nombre: "Rodríguez, Juan Carlos",
    dni: "41987654",
    cursoActual: "Guitarra Nivel 1",
    asistencia: 88,
    promedio: 8.5,
    estado: "Promovido",
    cursosDisponibles: ["Guitarra Nivel 2", "Piano Nivel 1"],
  },
  {
    id: 3,
    nombre: "López, Ana Sofía",
    dni: "43567890",
    cursoActual: "Piano Nivel 1",
    asistencia: 92,
    promedio: 9.0,
    estado: "Promovida",
    cursosDisponibles: ["Piano Nivel 2"],
  },
]

const STEPS = [
  { id: 1, name: "Buscar Alumno" },
  { id: 2, name: "Verificar Datos" },
  { id: 3, name: "Selección de Curso" },
  { id: 4, name: "División y Horario" },
  { id: 5, name: "Método de Pago" },
  { id: 6, name: "Confirmación" },
]

export default function AlumnosPromovidosPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAlumno, setSelectedAlumno] = useState<typeof alumnosPromovidos[0] | null>(null)
  const [formData, setFormData] = useState({
    curso: "",
    division: "",
    horario: "",
    metodoPago: "",
  })

  const handleSearch = () => {
    const alumno = alumnosPromovidos.find(
      (a) => a.dni.includes(searchTerm) || a.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (alumno) {
      setSelectedAlumno(alumno)
      setCurrentStep(2)
    }
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <AppLayout title="Inscripción de Alumnos Promovidos">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/inscripciones" className="text-muted-foreground hover:text-foreground">
            Inscripciones
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Alumnos Promovidos</span>
        </div>

        {/* Info Alert */}
        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="font-semibold text-blue-900 mb-1">Inscripción de Alumnos Promovidos</h3>
          <p className="text-sm text-blue-800">
            Los alumnos promovidos pueden reinscribirse directamente al siguiente nivel de su curso actual. 
            Los datos personales no pueden modificarse, solo la selección de curso y método de pago.
          </p>
        </div>

        {/* Progress Steps */}
        {currentStep > 1 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                          step.id < currentStep
                            ? "border-primary bg-primary text-primary-foreground"
                            : step.id === currentStep
                            ? "border-primary bg-background text-primary"
                            : "border-muted bg-background text-muted-foreground"
                        }`}
                      >
                        {step.id < currentStep ? <Check className="h-5 w-5" /> : step.id}
                      </div>
                      <span className="mt-2 text-xs font-medium text-center max-w-[100px]">{step.name}</span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 transition-colors ${
                          step.id < currentStep ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Busque el alumno promovido por DNI o nombre"}
              {currentStep === 2 && "Verifique los datos del alumno y su estado de promoción"}
              {currentStep === 3 && "Seleccione el curso para la reinscripción"}
              {currentStep === 4 && "Seleccione la división y horario disponible"}
              {currentStep === 5 && "Seleccione el método de pago"}
              {currentStep === 6 && "Revise y confirme la información"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Buscar Alumno */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Buscar por DNI o Nombre</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Ingrese DNI o nombre del alumno..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <Button onClick={handleSearch}>
                      Buscar
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-4">Alumnos Promovidos Disponibles</h4>
                  <div className="space-y-3">
                    {alumnosPromovidos.map((alumno) => (
                      <div
                        key={alumno.id}
                        className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedAlumno(alumno)
                          setCurrentStep(2)
                        }}
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{alumno.nombre}</p>
                          <p className="text-sm text-muted-foreground">DNI: {alumno.dni}</p>
                          <p className="text-sm text-muted-foreground">Curso Actual: {alumno.cursoActual}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {alumno.estado}
                          </Badge>
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Verificar Datos */}
            {currentStep === 2 && selectedAlumno && (
              <div className="space-y-6">
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900">Alumno Promovido Verificado</h4>
                      <p className="text-sm text-green-800 mt-1">
                        El alumno cumple con los requisitos de asistencia y rendimiento académico para la promoción.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      Datos Personales (No Editables)
                    </h4>
                    <div className="grid gap-3 rounded-lg border bg-muted/30 p-4">
                      <div className="grid gap-1">
                        <Label className="text-xs text-muted-foreground">Nombre Completo</Label>
                        <p className="font-medium">{selectedAlumno.nombre}</p>
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-xs text-muted-foreground">DNI</Label>
                        <p className="font-medium">{selectedAlumno.dni}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Rendimiento Académico</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-muted-foreground">Curso Actual</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-semibold">{selectedAlumno.cursoActual}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-muted-foreground">Promedio</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-semibold text-green-600">{selectedAlumno.promedio}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-muted-foreground">Asistencia</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-semibold text-green-600">{selectedAlumno.asistencia}%</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-muted-foreground">Estado</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge className="bg-green-100 text-green-800">
                            {selectedAlumno.estado}
                          </Badge>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Selección de Curso */}
            {currentStep === 3 && selectedAlumno && (
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                  Mostrando solo cursos habilitados según correlatividades y promoción
                </div>

                <div className="space-y-2">
                  <Label htmlFor="curso">Curso para Reinscripción *</Label>
                  <Select
                    value={formData.curso}
                    onValueChange={(value) => setFormData({ ...formData, curso: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedAlumno.cursosDisponibles.map((curso) => (
                        <SelectItem key={curso} value={curso}>
                          {curso}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.curso && (
                  <div className="mt-4 rounded-lg border bg-card p-4">
                    <h4 className="font-semibold mb-2">Información del Curso</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Duración:</span> Anual (Marzo - Diciembre)</p>
                      <p><span className="font-medium">Frecuencia:</span> 2 clases semanales</p>
                      <p><span className="font-medium">Costo:</span> $15,000/mes</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: División y Horario */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
                  Mostrando solo divisiones con cupos disponibles
                </div>

                <div className="space-y-2">
                  <Label htmlFor="division">División *</Label>
                  <Select
                    value={formData.division}
                    onValueChange={(value) => setFormData({ ...formData, division: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione la división" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">
                        <div className="flex items-center justify-between w-full">
                          <span>División A</span>
                          <Badge variant="secondary" className="ml-2">5 cupos</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="B">
                        <div className="flex items-center justify-between w-full">
                          <span>División B</span>
                          <Badge variant="secondary" className="ml-2">12 cupos</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.division && (
                  <div className="space-y-2">
                    <Label htmlFor="horario">Horario *</Label>
                    <Select
                      value={formData.horario}
                      onValueChange={(value) => setFormData({ ...formData, horario: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el horario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lunes-miercoles-18">Lunes y Miércoles 18:00 - 19:30</SelectItem>
                        <SelectItem value="martes-jueves-20">Martes y Jueves 20:00 - 21:30</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Método de Pago */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Método de Pago *</Label>
                  <div className="space-y-3">
                    <div
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                        formData.metodoPago === "contado"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setFormData({ ...formData, metodoPago: "contado" })}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={formData.metodoPago === "contado"}
                          onCheckedChange={() => setFormData({ ...formData, metodoPago: "contado" })}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">Pago de Contado</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Pago único por el ciclo lectivo completo
                          </p>
                          <p className="text-lg font-bold text-primary mt-2">$135,000</p>
                          <p className="text-xs text-green-600 font-medium">Ahorro del 10%</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                        formData.metodoPago === "cuotas"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setFormData({ ...formData, metodoPago: "cuotas" })}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={formData.metodoPago === "cuotas"}
                          onCheckedChange={() => setFormData({ ...formData, metodoPago: "cuotas" })}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">Pago en Cuotas</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            10 cuotas mensuales de marzo a diciembre
                          </p>
                          <p className="text-lg font-bold text-primary mt-2">$15,000/mes</p>
                          <p className="text-xs text-muted-foreground">Total: $150,000</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Confirmación */}
            {currentStep === 6 && selectedAlumno && (
              <div className="space-y-6">
                <div className="rounded-lg bg-green-50 p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Revise la Información</h3>
                  <p className="text-sm text-green-800">
                    Verifique que todos los datos sean correctos antes de confirmar la reinscripción
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Datos del Alumno</h4>
                    <div className="grid gap-2 text-sm">
                      <p><span className="text-muted-foreground">Nombre:</span> {selectedAlumno.nombre}</p>
                      <p><span className="text-muted-foreground">DNI:</span> {selectedAlumno.dni}</p>
                      <p><span className="text-muted-foreground">Curso Actual:</span> {selectedAlumno.cursoActual}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Nuevo Curso</h4>
                    <div className="grid gap-2 text-sm">
                      <p><span className="text-muted-foreground">Curso:</span> {formData.curso}</p>
                      <p><span className="text-muted-foreground">División:</span> {formData.division}</p>
                      <p><span className="text-muted-foreground">Horario:</span> {formData.horario}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Método de Pago</h4>
                    <div className="grid gap-2 text-sm">
                      <p><span className="text-muted-foreground">Modalidad:</span> {formData.metodoPago === "contado" ? "Pago de Contado" : "Pago en Cuotas"}</p>
                      <p className="text-lg font-bold text-primary">
                        {formData.metodoPago === "contado" ? "$135,000" : "$15,000/mes"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
                  <Checkbox id="terminos" />
                  <label htmlFor="terminos" className="text-sm leading-relaxed cursor-pointer">
                    Confirmo la reinscripción del alumno y acepto que la inscripción quedará en estado 
                    RESERVADA hasta la presentación del comprobante de pago inicial.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep > 1 && (
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                >
                  Anterior
                </Button>

                {currentStep < STEPS.length ? (
                  <Button onClick={nextStep}>
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-2" />
                    Confirmar Reinscripción
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
