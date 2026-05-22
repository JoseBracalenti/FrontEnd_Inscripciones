"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, CheckCircle, BookOpen, Search, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { adminService } from "@/lib/services/admin.service"
import type { DashboardStatsDto } from "@/lib/admin.types"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStatsDto | null>(null)

  useEffect(() => {
    adminService.getDashboardStats().then(setStats)
  }, [])

  return (
    <AppLayout title="Panel de Administración">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Panel de administración del sistema de inscripciones</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Inscripciones Totales"
            value={stats ? String(stats.totalInscripciones) : "—"}
            subtitle="Ciclo lectivo 2026"
            icon={Users}
          />
          <StatsCard
            title="Inscripciones Pendientes"
            value={stats ? String(stats.inscripcionesPendientes) : "—"}
            subtitle="Esperando confirmación"
            icon={Clock}
            iconColor="text-amber-600"
          />
          <StatsCard
            title="Inscripciones Confirmadas"
            value={stats ? String(stats.inscripcionesConfirmadas) : "—"}
            subtitle="Con pago inicial"
            icon={CheckCircle}
            iconColor="text-green-600"
          />
          <StatsCard
            title="Cursos Activos"
            value={stats ? String(stats.cursosActivos) : "—"}
            subtitle="Con cupos disponibles"
            icon={BookOpen}
            iconColor="text-blue-600"
          />
        </div>

        {stats && stats.inscripcionesPorVencer > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-center gap-4 py-4">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
              <div className="flex-1">
                <p className="font-semibold text-amber-800">
                  Atención: {stats.inscripcionesPorVencer} inscripciones por vencer
                </p>
                <p className="text-sm text-amber-700">
                  Hay inscripciones reservadas que vencen en las próximas 24 horas
                </p>
              </div>
              <Link href="/admin/inscripciones?estado=pendiente">
                <Button variant="outline" size="sm" className="border-amber-300 bg-transparent hover:bg-amber-100">
                  Ver detalles
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Búsqueda Rápida de Alumnos</CardTitle>
              <CardDescription>Buscar por DNI, Apellido, Nombre o Nro. de Matrícula</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Buscar alumno..." className="pl-9" />
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

        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Disponibilidad de Cursos</CardTitle>
              <CardDescription>Resumen de cupos por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {stats.disponibilidadCursos.map((cat) => {
                  const disponibles = cat.cuposTotales - cat.ocupados
                  const pct = Math.round((cat.ocupados / cat.cuposTotales) * 100)
                  const color = pct >= 90 ? "text-amber-600" : "text-green-600"
                  return (
                    <div key={cat.categoria} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{cat.categoria}</h4>
                        <Badge variant="secondary">{cat.totalCursos} cursos</Badge>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cupos totales</span>
                          <span className="font-medium">{cat.cuposTotales}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Ocupados</span>
                          <span className="font-medium">{cat.ocupados}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={color}>Disponibles</span>
                          <span className={`font-medium ${color}`}>{disponibles}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas inscripciones registradas en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.actividadReciente.map((activity, i) => (
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
        )}
      </div>
    </AppLayout>
  )
}
