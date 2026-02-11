"use client"

import { AppLayout } from "@/components/app-layout"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, CheckCircle, XCircle, Search, BookOpen, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  return (
    <AppLayout title="Panel de Administración">
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Panel de administración del sistema de inscripciones</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Inscripciones Totales"
            value="342"
            subtitle="Ciclo lectivo 2026"
            icon={Users}
          />
          <StatsCard
            title="Inscripciones Pendientes"
            value="28"
            subtitle="Esperando confirmación"
            icon={Clock}
            iconColor="text-amber-600"
          />
          <StatsCard
            title="Inscripciones Confirmadas"
            value="298"
            subtitle="Con pago inicial"
            icon={CheckCircle}
            iconColor="text-green-600"
          />
          <StatsCard
            title="Cursos Activos"
            value="35"
            subtitle="Con cupos disponibles"
            icon={BookOpen}
            iconColor="text-blue-600"
          />
        </div>

        {/* Alerts */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-4 py-4">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
            <div className="flex-1">
              <p className="font-semibold text-amber-800">Atención: 5 inscripciones por vencer</p>
              <p className="text-sm text-amber-700">Hay inscripciones reservadas que vencen en las próximas 24 horas</p>
            </div>
            <Link href="/admin/inscripciones?estado=pendiente">
              <Button variant="outline" size="sm" className="border-amber-300 bg-transparent hover:bg-amber-100">
                Ver detalles
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Search */}
          <Card>
            <CardHeader>
              <CardTitle>Búsqueda Rápida de Alumnos</CardTitle>
              <CardDescription>Buscar por DNI, Apellido, Nombre o Nro. de Matrícula</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar alumno..."
                    className="pl-9"
                  />
                </div>
                <Button>Buscar</Button>
              </div>
              <Link href="/admin/consultas">
                <Button variant="outline" className="w-full bg-transparent">
                  Búsqueda Avanzada
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Course Management */}
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Cursos</CardTitle>
              <CardDescription>Administrar cursos, divisiones y cupos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/cursos" className="block">
                <Button className="w-full" size="lg">
                  Ver Todos los Cursos
                </Button>
              </Link>
              <Link href="/admin/cursos/nuevo" className="block">
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  Crear Nuevo Curso
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Course Availability Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Disponibilidad de Cursos</CardTitle>
            <CardDescription>Resumen de cupos por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Idiomas</h4>
                  <Badge variant="secondary">12 cursos</Badge>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cupos totales</span>
                    <span className="font-medium">180</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ocupados</span>
                    <span className="font-medium">142</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Disponibles</span>
                    <span className="font-medium text-green-600">38</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "79%" }} />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Música</h4>
                  <Badge variant="secondary">15 cursos</Badge>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cupos totales</span>
                    <span className="font-medium">120</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ocupados</span>
                    <span className="font-medium">108</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-600">Disponibles</span>
                    <span className="font-medium text-amber-600">12</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "90%" }} />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Talleres</h4>
                  <Badge variant="secondary">8 cursos</Badge>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cupos totales</span>
                    <span className="font-medium">160</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ocupados</span>
                    <span className="font-medium">92</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Disponibles</span>
                    <span className="font-medium text-green-600">68</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "58%" }} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas inscripciones registradas en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "García, María Fernanda", course: "Inglés Intermedio", status: "Confirmada", date: "Hoy, 14:23", type: "Nueva" },
                { name: "Rodríguez, Juan Carlos", course: "Guitarra Nivel 1", status: "Pendiente", date: "Hoy, 12:45", type: "Nueva" },
                { name: "López, Ana Sofía", course: "Francés Básico", status: "Confirmada", date: "Ayer, 16:30", type: "Promovido" },
                { name: "Martínez, Pedro", course: "Piano Avanzado", status: "Reservada", date: "Ayer, 10:15", type: "Nueva" },
                { name: "González, Laura", course: "Teatro", status: "Cancelada", date: "Hace 2 días", type: "Nueva" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{activity.name}</p>
                      <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.course}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={
                      activity.status === "Confirmada" 
                        ? "bg-green-100 text-green-800 hover:bg-green-100" 
                        : activity.status === "Pendiente"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        : activity.status === "Cancelada"
                        ? "bg-red-100 text-red-800 hover:bg-red-100"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    }>
                      {activity.status}
                    </Badge>
                    <p className="mt-1 text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
