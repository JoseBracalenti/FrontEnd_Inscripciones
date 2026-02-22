"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { BookOpen, ChevronRight, Loader2, Clock } from "lucide-react"
import { academicoService } from "@/lib/services/academico.service"
import type { InscripcionResumenDto, EstadoInscripcion } from "@/lib/academico.types"

const ANIO_ACTUAL = new Date().getFullYear()
const ANIOS = [ANIO_ACTUAL, ANIO_ACTUAL - 1, ANIO_ACTUAL - 2]

function estadoBadgeVariant(estado: EstadoInscripcion): "default" | "secondary" | "destructive" | "outline" {
  switch (estado) {
    case "ACTIVA":
      return "default"
    case "FINALIZADA":
      return "secondary"
    case "ABANDONADA":
    case "SUSPENDIDA":
      return "destructive"
    default:
      return "outline"
  }
}

export default function EstudianteDashboardPage() {
  const [anio, setAnio] = useState<number>(ANIO_ACTUAL)
  const [inscripciones, setInscripciones] = useState<InscripcionResumenDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    academicoService
      .getMisInscripciones(anio)
      .then(setInscripciones)
      .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar inscripciones"))
      .finally(() => setLoading(false))
  }, [anio])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Mis cursos</h1>
          <p className="text-muted-foreground">Inscripciones por año lectivo</p>
        </div>
        <Select
          value={String(anio)}
          onValueChange={(v) => setAnio(Number(v))}
        >
          <SelectTrigger className="w-[140px]" size="default">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {ANIOS.map((a) => (
              <SelectItem key={a} value={String(a)}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando inscripciones...</span>
        </div>
      ) : inscripciones.length === 0 ? (
        <Card>
          <Empty className="py-12">
            <EmptyMedia variant="icon">
              <BookOpen className="h-6 w-6" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No tenés inscripciones para este año</EmptyTitle>
              <EmptyDescription>
                Cambiá el año en el selector o inscribite a un curso desde la página principal.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inscripciones.map((insc) => (
            <Link
              key={insc.idInscripcionAcademica}
              href={`/estudiante/inscripcion/${insc.idInscripcionAcademica}`}
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {insc.descripcionCurso}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        División {insc.letraDivision} · {insc.anio}
                      </p>
                      {insc.horarios && (
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          <span>{insc.horarios}</span>
                        </p>
                      )}
                    </div>
                    <Badge variant={estadoBadgeVariant(insc.estadoInscripcion)}>
                      {insc.estadoInscripcion}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="inline-flex items-center text-sm font-medium text-primary">
                    Ver clases y asistencia
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
