"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Users, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function InscripcionesPage() {
  return (
    <AppLayout title="Inscripciones">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Inscripciones</h2>
          <p className="text-muted-foreground">
            Seleccione el tipo de inscripción que desea realizar
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Nueva Inscripción */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <UserPlus className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">Alumno Nuevo</CardTitle>
              </div>
              <CardDescription>
                Registrar un alumno que ingresa por primera vez al Liceo Municipal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Registro completo de datos personales</p>
                <p>✓ Datos de tutor o responsable</p>
                <p>✓ Selección de curso según edad</p>
                <p>✓ Elección de división y horario</p>
                <p>✓ Método de pago (contado o cuotas)</p>
              </div>
              <Link href="/admin/inscripciones/nueva" className="block">
                <Button className="w-full" size="lg">
                  Iniciar Inscripción Nueva
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Alumno Promovido */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">Alumno Promovido</CardTitle>
              </div>
              <CardDescription>
                Reinscribir un alumno que aprobó su curso actual y pasa al siguiente nivel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Datos personales ya registrados</p>
                <p>✓ Validación automática de promoción</p>
                <p>✓ Cursos habilitados según correlatividades</p>
                <p>✓ Proceso simplificado y rápido</p>
                <p>✓ Método de pago (contado o cuotas)</p>
              </div>
              <Link href="/admin/inscripciones/promovidos" className="block">
                <Button className="w-full bg-transparent" size="lg" variant="outline">
                  Inscribir Alumno Promovido
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información Importante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Estados de Inscripción</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong className="text-blue-600">Reservada:</strong> Cupo reservado por 5 días hábiles</li>
                  <li><strong className="text-green-600">Confirmada:</strong> Pago inicial recibido, cupo asignado</li>
                  <li><strong className="text-red-600">Cancelada:</strong> Vencimiento del plazo sin pago</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Métodos de Pago</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>Contado:</strong> $135,000 (ahorro del 10%)</li>
                  <li><strong>Cuotas:</strong> 10 cuotas de $15,000 (total $150,000)</li>
                </ul>
              </div>
            </div>
            
            <div className="rounded-lg bg-amber-50 p-4 border border-amber-200">
              <h4 className="font-semibold text-amber-900 mb-1">Importante</h4>
              <p className="text-sm text-amber-800">
                La inscripción quedará en estado RESERVADA hasta la confirmación del pago inicial. 
                El comprobante debe presentarse en administración dentro de los 5 días hábiles posteriores 
                a la inscripción. Pasado este plazo, la inscripción será cancelada automáticamente.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">342</p>
                <p className="text-sm text-muted-foreground mt-1">Inscripciones Totales</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-600">28</p>
                <p className="text-sm text-muted-foreground mt-1">Pendientes de Confirmación</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">298</p>
                <p className="text-sm text-muted-foreground mt-1">Confirmadas</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
