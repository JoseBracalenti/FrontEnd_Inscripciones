"use client"

import { useEffect, useState } from "react"
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
import { adminService } from "@/lib/services/admin.service"
import type { AlumnoPromovidoDto } from "@/lib/admin.types"

const STEPS = [
  { id: 1, name: "Buscar Alumno" },
  { id: 2, name: "Verificar Datos" },
  { id: 3, name: "Selección de Curso" },
  { id: 4, name: "División y Horario" },
  { id: 5, name: "Método de Pago" },
  { id: 6, name: "Confirmación" },
]

export default function AlumnosPromovidosPage() {
  const [alumnosPromovidos, setAlumnosPromovidos] = useState<AlumnoPromovidoDto[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAlumno, setSelectedAlumno] = useState<AlumnoPromovidoDto | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    curso: "",
    division: "",
    horario: "",
    metodoPago: "",
  })

  useEffect(() => {
    adminService.getAlumnosPromovidos().then(setAlumnosPromovidos)
  }, [])

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
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleConfirmar = async () => {
    if (!selectedAlumno) return
    setIsSubmitting(true)
    await adminService.reinscribirAlumno({
      alumnoId: selectedAlumno.id,
      curso: formData.curso,
      division: formData.division,
      horario: formData.horario,
      metodoPago: formData.metodoPago as "contado" | "cuotas",
    })
    setIsSubmitting(false)
    setCurrentStep(1)
    setSelectedAlumno(null)
    setFormData({ curso: "", division: "", horario: "", metodoPago: "" })
  }

  return (
    <AppLayout title="Inscripción de Alumnos Promovidos">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/admin/inscripciones" className="text-muted-foreground hover:text-foreground">
            Inscripciones
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Alumnos Promovidos</span>
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="font-semibold text-blue-900 mb-1">Inscripción de Alumnos Promovidos</h3>
          <p className="text-sm text-blue-800">
            Los alumnos promovidos pueden reinscribirse directamente al siguiente nivel de su curso actual.
            Los datos personales no pueden modificarse, solo la selección de curso y método de pago.
          </p>
        </div>

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
                      <div className={`h-0.5 flex-1 transition-colors ${step.id < currentStep ? "bg-primary" : "bg-muted"}`} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
                    <Button onClick={handleSearch}>Buscar</Button>
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
                        onClick={() => { setSelectedAlumno(alumno); setCurrentStep(2) }}
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
                          <Badge className="bg-green-100 text-green-800">{selectedAlumno.estado}</Badge>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && selectedAlumno && (
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                  Mostrando solo cursos habilitados según correlatividades y promoción
                </div>
                <div className="space-y-2">
                  <Label htmlFor="curso">Curso para Reinscripción *</Label>
                  <Select value={formData.curso} onValueChange={(value) => setFormData({ ...formData, curso: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedAlumno.cursosDisponibles.map((curso) => (
                        <SelectItem key={curso} value={curso}>{curso}</SelectItem>
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

            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
                  Mostrando solo divisiones con cupos disponibles
                </div>
                <div className="space-y-2">
                  <Label>División *</Label>
                  <Select value={formData.division} onValueChange={(value) => setFormData({ ...formData, division: value })}>
                    <SelectTrigger><SelectValue placeholder="Seleccione la división" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">División A — 5 cupos</SelectItem>
                      <SelectItem value="B">División B — 12 cupos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.division && (
                  <div className="space-y-2">
                    <Label>Horario *</Label>
                    <Select value={formData.horario} onValueChange={(value) => setFormData({ ...formData, horario: value })}>
                      <SelectTrigger><SelectValue placeholder="Seleccione el horario" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lunes-miercoles-18">Lunes y Miércoles 18:00 - 19:30</SelectItem>
                        <SelectItem value="martes-jueves-20">Martes y Jueves 20:00 - 21:30</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <Label>Método de Pago *</Label>
                <div className="space-y-3">
                  {[
                    { value: "contado", label: "Pago de Contado", desc: "Pago único por el ciclo lectivo completo", price: "$135,000", note: "Ahorro del 10%" },
                    { value: "cuotas", label: "Pago en Cuotas", desc: "10 cuotas mensuales de marzo a diciembre", price: "$15,000/mes", note: "Total: $150,000" },
                  ].map((opt) => (
                    <div
                      key={opt.value}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${formData.metodoPago === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                      onClick={() => setFormData({ ...formData, metodoPago: opt.value })}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox checked={formData.metodoPago === opt.value} onCheckedChange={() => setFormData({ ...formData, metodoPago: opt.value })} />
                        <div className="flex-1">
                          <h4 className="font-semibold">{opt.label}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{opt.desc}</p>
                          <p className="text-lg font-bold text-primary mt-2">{opt.price}</p>
                          <p className="text-xs text-muted-foreground">{opt.note}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 6 && selectedAlumno && (
              <div className="space-y-6">
                <div className="rounded-lg bg-green-50 p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Revise la Información</h3>
                  <p className="text-sm text-green-800">Verifique que todos los datos sean correctos antes de confirmar la reinscripción</p>
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
                      <p><span className="text-muted-foreground">Horario:</span> {formData.horario.replace(/-/g, " ")}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Método de Pago</h4>
                    <div className="grid gap-2 text-sm">
                      <p><span className="text-muted-foreground">Modalidad:</span> {formData.metodoPago === "contado" ? "Pago de Contado" : "Pago en Cuotas"}</p>
                      <p className="text-lg font-bold text-primary">{formData.metodoPago === "contado" ? "$135,000" : "$15,000/mes"}</p>
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

            {currentStep > 1 && (
              <div className="flex items-center justify-between pt-6 border-t">
                <Button variant="outline" onClick={prevStep}>Anterior</Button>
                {currentStep < STEPS.length ? (
                  <Button onClick={nextStep}>
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                    onClick={handleConfirmar}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Guardando..." : "Confirmar Reinscripción"}
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
