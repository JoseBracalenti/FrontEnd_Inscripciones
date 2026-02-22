"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { Badge } from "@/components/ui/badge"
import { History, Loader2 } from "lucide-react"
import { academicoService } from "@/lib/services/academico.service"
import type {
  CalificacionItem,
  EstadoPromocion,
  InscripcionHistoriaDto,
  MiHistoriaAcademicaResponse,
} from "@/lib/academico.types"

const ANIO_ACTUAL = new Date().getFullYear()
const ANIOS = [ANIO_ACTUAL, ANIO_ACTUAL - 1, ANIO_ACTUAL - 2]
const TODOS_ANIOS = "todos"

/** Format date string for display (student-facing, no raw ISO). */
function formatFecha(s: string | undefined): string {
  if (!s) return "—"
  try {
    return new Date(s).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  } catch {
    return s
  }
}

/** Render estadoAcademico only when it's a plain string; never expose [object Object] or internal structure. */
function formatEstadoAcademico(value: unknown): string | null {
  if (value == null) return null
  if (typeof value === "string") return value.trim() || null
  if (typeof value === "object" && value !== null && "descripcion" in value) {
    const d = (value as { descripcion?: unknown }).descripcion
    return typeof d === "string" ? d.trim() || null : null
  }
  return null
}

/** Student-facing labels for grade types. */
const TIPO_EVALUACION_LABELS: Record<string, string> = {
  PARCIAL: "Parcial",
  FINAL: "Final",
  RECUPERATORIO: "Recuperatorio",
  PROMEDIO: "Promedio",
}

/** Fields we show for each grade; internal IDs and timestamps are omitted. */
const CALIFICACION_DISPLAY: Record<string, { label: string; format?: (v: unknown) => string }> = {
  tipo: { label: "Evaluación", format: (v) => (typeof v === "string" ? TIPO_EVALUACION_LABELS[v] ?? v : String(v ?? "—")) },
  nota: { label: "Nota", format: (v) => (v != null && v !== "" ? String(v) : "—") },
  fechaCalificacion: { label: "Fecha", format: (v) => formatFecha(typeof v === "string" ? v : undefined) },
  observaciones: { label: "Observaciones", format: (v) => (v != null && v !== "" ? String(v) : "—") },
}

function formatCalificacionForStudent(cal: CalificacionItem): { label: string; value: string }[] {
  return Object.entries(CALIFICACION_DISPLAY)
    .filter(([key]) => cal[key] !== undefined)
    .map(([key, { label, format }]) => ({
      label,
      value: format ? format(cal[key]) : String(cal[key] ?? "—"),
    }))
    .filter(({ value }) => value !== "—")
}

/** Student-facing promotion status labels and badge variant. */
const ESTADO_PROMOCION: Record<
  EstadoPromocion,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  PROMOVIDO: { label: "Promovido", variant: "default" },
  DEBE_RENDIR_EXAMEN: { label: "Debe rendir examen", variant: "secondary" },
  RECURSA: { label: "Recursa", variant: "destructive" },
  EN_CURSO: { label: "En curso", variant: "outline" },
}

export default function EstudianteHistoriaPage() {
  const [anioParam, setAnioParam] = useState<string>(String(ANIO_ACTUAL))
  const [data, setData] = useState<MiHistoriaAcademicaResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const anio = anioParam === TODOS_ANIOS ? undefined : Number(anioParam)

  useEffect(() => {
    setLoading(true)
    setError(null)
    academicoService
      .getMiHistoriaAcademica(anio)
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Error al cargar la historia académica")
      )
      .finally(() => setLoading(false))
  }, [anio])

  const inscripciones = data?.inscripciones ?? []
  const estudiante = data?.estudiante

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Mi historia académica
          </h1>
          <p className="text-muted-foreground">Calificaciones y estado por curso</p>
        </div>
        <Select value={anioParam} onValueChange={setAnioParam}>
          <SelectTrigger className="w-[160px]" size="default">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS_ANIOS}>Todos los años</SelectItem>
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
          <span>Cargando historia académica...</span>
        </div>
      ) : !data || inscripciones.length === 0 ? (
        <Card>
          <Empty className="py-12">
            <EmptyMedia variant="icon">
              <History className="h-6 w-6" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No hay historia académica para los filtros seleccionados</EmptyTitle>
              <EmptyDescription>
                Cambiá el año en el selector o consultá con administración si deberías ver datos.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Card>
      ) : (
        <div className="space-y-6">
          {estudiante && (
            <Card>
              <CardHeader className="pb-2">
                <h2 className="text-lg font-semibold">Estudiante</h2>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {[estudiante.nombre, estudiante.apellido].filter(Boolean).join(" ") || "—"}
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Inscripciones</h2>
            {inscripciones.map((insc: InscripcionHistoriaDto, index: number) => (
              <Card key={insc.idInscripcionAcademica ?? index}>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">
                      {insc.descripcionCurso ?? `Curso ${insc.idCurso ?? "—"}`}
                    </span>
                    {insc.letraDivision && (
                      <Badge variant="outline">Div. {insc.letraDivision}</Badge>
                    )}
                    {insc.anio != null && (
                      <Badge variant="secondary">{insc.anio}</Badge>
                    )}
                    {insc.estadoInscripcion && (
                      <Badge variant="outline">{insc.estadoInscripcion}</Badge>
                    )}
                    {insc.estadoPromocion != null && ESTADO_PROMOCION[insc.estadoPromocion as EstadoPromocion] && (
                      <Badge variant={ESTADO_PROMOCION[insc.estadoPromocion as EstadoPromocion].variant}>
                        {ESTADO_PROMOCION[insc.estadoPromocion as EstadoPromocion].label}
                      </Badge>
                    )}
                    {formatEstadoAcademico(insc.estadoAcademico) && (
                      <span className="text-sm text-muted-foreground">
                        Estado: {formatEstadoAcademico(insc.estadoAcademico)}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {insc.calificaciones && insc.calificaciones.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Calificaciones
                      </h3>
                      <ul className="space-y-3 text-sm">
                        {insc.calificaciones.map((cal, i) => {
                          if (typeof cal !== "object" || cal === null) {
                            return <li key={i}>{String(cal)}</li>
                          }
                          const display = formatCalificacionForStudent(cal as CalificacionItem)
                          return (
                            <li key={i} className="rounded-md border bg-muted/40 p-3">
                              <div className="grid gap-1 sm:grid-cols-2 sm:gap-2">
                                {display.map(({ label, value }) => (
                                  <div key={label}>
                                    <span className="text-muted-foreground">{label}: </span>
                                    <span className="font-medium">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                  {insc.actas && insc.actas.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Actas</h3>
                      <p className="text-sm">{insc.actas.length} acta(s) registrada(s)</p>
                    </div>
                  )}
                  {(!insc.calificaciones || insc.calificaciones.length === 0) &&
                    (!insc.actas || insc.actas.length === 0) && (
                      <p className="text-sm text-muted-foreground">
                        Sin calificaciones ni actas cargadas para esta inscripción.
                      </p>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
