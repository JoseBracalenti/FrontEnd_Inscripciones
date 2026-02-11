"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

const STEPS = [
  { id: 1, name: "Datos Personales" },
  { id: 2, name: "Tutor/Responsable" },
  { id: 3, name: "Selección de Curso" },
  { id: 4, name: "División y Horario" },
  { id: 5, name: "Método de Pago" },
  { id: 6, name: "Confirmación" },
]

export default function NuevaInscripcionPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: "",
    apellido: "",
    dni: "",
    fechaNacimiento: "",
    domicilio: "",
    telefono: "",
    email: "",
    
    // Tutor/Responsable
    esMenor: true,
    tutorNombre: "",
    tutorApellido: "",
    tutorDni: "",
    tutorRelacion: "",
    tutorTelefono: "",
    tutorEmail: "",
    
    // Contacto de emergencia
    emergenciaNombre: "",
    emergenciaTelefono: "",
    
    // Curso
    tipoCurso: "",
    curso: "",
    division: "",
    horario: "",
    
    // Pago
    metodoPago: "",
  })
  
  const [edad, setEdad] = useState<number | null>(null)

  const calcularEdad = (fechaNacimiento: string) => {
    if (!fechaNacimiento) return null
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    return edad
  }

  const handleFechaNacimientoChange = (fecha: string) => {
    setFormData({ ...formData, fechaNacimiento: fecha })
    const edadCalculada = calcularEdad(fecha)
    setEdad(edadCalculada)
    setFormData(prev => ({ ...prev, esMenor: edadCalculada ? edadCalculada < 18 : true }))
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
    <AppLayout title="Nueva Inscripción">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/admin/inscripciones" className="text-muted-foreground hover:text-foreground">
            Inscripciones
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Nueva Inscripción</span>
        </div>

        {/* Progress Steps */}
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

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Ingrese los datos personales del alumno"}
              {currentStep === 2 && "Ingrese los datos del tutor o contacto responsable"}
              {currentStep === 3 && "Seleccione el tipo de curso y nivel"}
              {currentStep === 4 && "Seleccione la división y horario disponible"}
              {currentStep === 5 && "Seleccione el método de pago"}
              {currentStep === 6 && "Revise y confirme la información"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Datos Personales */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Ingrese el nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido *</Label>
                    <Input
                      id="apellido"
                      value={formData.apellido}
                      onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                      placeholder="Ingrese el apellido"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dni">DNI *</Label>
                    <Input
                      id="dni"
                      value={formData.dni}
                      onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                      placeholder="12345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                    <Input
                      id="fechaNacimiento"
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={(e) => handleFechaNacimientoChange(e.target.value)}
                    />
                    {edad !== null && (
                      <p className="text-sm text-muted-foreground">Edad: {edad} años</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domicilio">Domicilio *</Label>
                  <Input
                    id="domicilio"
                    value={formData.domicilio}
                    onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })}
                    placeholder="Calle, Número, Ciudad"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="(342) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alumno@ejemplo.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Tutor/Responsable */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {formData.esMenor && (
                  <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                    El alumno es menor de edad. Se requieren datos del padre, madre o tutor responsable.
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-semibold">
                    {formData.esMenor ? "Datos del Tutor Responsable" : "Contacto Responsable"}
                  </h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tutorNombre">Nombre *</Label>
                      <Input
                        id="tutorNombre"
                        value={formData.tutorNombre}
                        onChange={(e) => setFormData({ ...formData, tutorNombre: e.target.value })}
                        placeholder="Ingrese el nombre"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tutorApellido">Apellido *</Label>
                      <Input
                        id="tutorApellido"
                        value={formData.tutorApellido}
                        onChange={(e) => setFormData({ ...formData, tutorApellido: e.target.value })}
                        placeholder="Ingrese el apellido"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tutorDni">DNI *</Label>
                      <Input
                        id="tutorDni"
                        value={formData.tutorDni}
                        onChange={(e) => setFormData({ ...formData, tutorDni: e.target.value })}
                        placeholder="12345678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tutorRelacion">Relación *</Label>
                      <Select
                        value={formData.tutorRelacion}
                        onValueChange={(value) => setFormData({ ...formData, tutorRelacion: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="padre">Padre</SelectItem>
                          <SelectItem value="madre">Madre</SelectItem>
                          <SelectItem value="tutor">Tutor Legal</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tutorTelefono">Teléfono *</Label>
                      <Input
                        id="tutorTelefono"
                        value={formData.tutorTelefono}
                        onChange={(e) => setFormData({ ...formData, tutorTelefono: e.target.value })}
                        placeholder="(342) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tutorEmail">Email *</Label>
                      <Input
                        id="tutorEmail"
                        type="email"
                        value={formData.tutorEmail}
                        onChange={(e) => setFormData({ ...formData, tutorEmail: e.target.value })}
                        placeholder="tutor@ejemplo.com"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Contacto de Emergencia</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="emergenciaNombre">Nombre Completo *</Label>
                      <Input
                        id="emergenciaNombre"
                        value={formData.emergenciaNombre}
                        onChange={(e) => setFormData({ ...formData, emergenciaNombre: e.target.value })}
                        placeholder="Nombre del contacto de emergencia"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergenciaTelefono">Teléfono *</Label>
                      <Input
                        id="emergenciaTelefono"
                        value={formData.emergenciaTelefono}
                        onChange={(e) => setFormData({ ...formData, emergenciaTelefono: e.target.value })}
                        placeholder="(342) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Selección de Curso */}
            {currentStep === 3 && (
              <div className="space-y-4">
                {edad !== null && (
                  <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                    Mostrando cursos disponibles para {edad} años
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="tipoCurso">Tipo de Curso *</Label>
                  <Select
                    value={formData.tipoCurso}
                    onValueChange={(value) => setFormData({ ...formData, tipoCurso: value, curso: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo de curso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idiomas">Idiomas</SelectItem>
                      <SelectItem value="instrumentos">Instrumentos Musicales</SelectItem>
                      <SelectItem value="talleres">Talleres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.tipoCurso === "idiomas" && (
                  <div className="space-y-2">
                    <Label htmlFor="curso">Curso de Idioma *</Label>
                    <Select
                      value={formData.curso}
                      onValueChange={(value) => setFormData({ ...formData, curso: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el curso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ingles-basico">Inglés Básico</SelectItem>
                        <SelectItem value="ingles-intermedio">Inglés Intermedio</SelectItem>
                        <SelectItem value="ingles-avanzado">Inglés Avanzado</SelectItem>
                        <SelectItem value="frances-basico">Francés Básico</SelectItem>
                        <SelectItem value="frances-intermedio">Francés Intermedio</SelectItem>
                        <SelectItem value="italiano-basico">Italiano Básico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.tipoCurso === "instrumentos" && (
                  <div className="space-y-2">
                    <Label htmlFor="curso">Instrumento Musical *</Label>
                    <Select
                      value={formData.curso}
                      onValueChange={(value) => setFormData({ ...formData, curso: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el instrumento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guitarra-1">Guitarra Nivel 1</SelectItem>
                        <SelectItem value="guitarra-2">Guitarra Nivel 2</SelectItem>
                        <SelectItem value="piano-1">Piano Nivel 1</SelectItem>
                        <SelectItem value="piano-2">Piano Nivel 2</SelectItem>
                        <SelectItem value="violin">Violín</SelectItem>
                        <SelectItem value="bateria">Batería</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.tipoCurso === "talleres" && (
                  <div className="space-y-2">
                    <Label htmlFor="curso">Taller *</Label>
                    <Select
                      value={formData.curso}
                      onValueChange={(value) => setFormData({ ...formData, curso: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el taller" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teatro">Teatro</SelectItem>
                        <SelectItem value="pintura">Pintura</SelectItem>
                        <SelectItem value="fotografia">Fotografía</SelectItem>
                        <SelectItem value="danza">Danza</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.curso && (
                  <div className="mt-4 rounded-lg border bg-card p-4">
                    <h4 className="font-semibold mb-2">Información del Curso</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Duración:</span> Anual (Marzo - Diciembre)</p>
                      <p><span className="font-medium">Frecuencia:</span> 2 clases semanales</p>
                      <p><span className="font-medium">Costo:</span> $15,000/mes</p>
                      <p><span className="font-medium">Edad mínima:</span> 12 años</p>
                      <p><span className="font-medium">Edad máxima:</span> Sin límite</p>
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
                      <SelectItem value="C">
                        <div className="flex items-center justify-between w-full">
                          <span>División C</span>
                          <Badge variant="secondary" className="ml-2">8 cupos</Badge>
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
                        <SelectItem value="martes-jueves-18">Martes y Jueves 18:00 - 19:30</SelectItem>
                        <SelectItem value="martes-jueves-20">Martes y Jueves 20:00 - 21:30</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.division && formData.horario && (
                  <div className="mt-4 rounded-lg border bg-card p-4">
                    <h4 className="font-semibold mb-2">Resumen de Selección</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">División:</span> {formData.division}</p>
                      <p><span className="font-medium">Horario:</span> {formData.horario.replace(/-/g, ' ')}</p>
                      <p><span className="font-medium">Cupos disponibles:</span> 5</p>
                    </div>
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

                {formData.metodoPago && (
                  <div className="mt-4 rounded-lg border bg-amber-50 p-4">
                    <h4 className="font-semibold text-amber-900 mb-2">Importante</h4>
                    <p className="text-sm text-amber-800">
                      La inscripción quedará en estado <strong>RESERVADA</strong> por 5 días hábiles. 
                      Para confirmarla, deberá realizar el pago inicial y presentar el comprobante en 
                      administración. De lo contrario, la inscripción será cancelada automáticamente.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Confirmación */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="rounded-lg bg-green-50 p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Revise la Información</h3>
                  <p className="text-sm text-green-800">
                    Verifique que todos los datos sean correctos antes de confirmar la inscripción
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Datos del Alumno</h4>
                    <div className="grid gap-2 text-sm">
                      <p><span className="text-muted-foreground">Nombre:</span> {formData.nombre} {formData.apellido}</p>
                      <p><span className="text-muted-foreground">DNI:</span> {formData.dni}</p>
                      <p><span className="text-muted-foreground">Fecha de Nacimiento:</span> {formData.fechaNacimiento} ({edad} años)</p>
                      <p><span className="text-muted-foreground">Teléfono:</span> {formData.telefono}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Tutor Responsable</h4>
                    <div className="grid gap-2 text-sm">
                      <p><span className="text-muted-foreground">Nombre:</span> {formData.tutorNombre} {formData.tutorApellido}</p>
                      <p><span className="text-muted-foreground">DNI:</span> {formData.tutorDni}</p>
                      <p><span className="text-muted-foreground">Relación:</span> {formData.tutorRelacion}</p>
                      <p><span className="text-muted-foreground">Email:</span> {formData.tutorEmail}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Curso Seleccionado</h4>
                    <div className="grid gap-2 text-sm">
                      <p><span className="text-muted-foreground">Tipo:</span> {formData.tipoCurso}</p>
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
                    Acepto los términos y condiciones del Liceo Municipal y confirmo que la información 
                    proporcionada es correcta. Entiendo que la inscripción quedará en estado RESERVADA 
                    hasta la presentación del comprobante de pago inicial.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
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
                  Confirmar Inscripción
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
