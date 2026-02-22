"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ChevronLeft, Calendar, ClipboardList, Loader2, Pencil, Check } from "lucide-react"
import { academicoService } from "@/lib/services/academico.service"
import type { InscripcionResumenDto, LecturaDto, AsistenciaDto, UpdateAsistenciaBody } from "@/lib/academico.types"
import { toast } from "@/hooks/use-toast"

const ANIO_ACTUAL = new Date().getFullYear()

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

/** Normalize date string to YYYY-MM-DD for grouping (same class date = one row). */
function fechaKey(fecha: string | undefined): string {
  if (!fecha) return ""
  try {
    const d = new Date(fecha)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  } catch {
    return fecha
  }
}

/**
 * Deduplicate attendance so we show one row per class. Backend may return multiple
 * rows per class date (e.g. different idAsistencia); we group by idClase or fecha
 * and show a single row with merged values. Edit uses the first row's idAsistencia.
 */
function deduplicateAsistenciaByClass(rows: AsistenciaDto[]): AsistenciaDto[] {
  const byKey = new Map<string, AsistenciaDto[]>()
  for (const row of rows) {
    const key = row.idClase != null ? `clase-${row.idClase}` : `fecha-${fechaKey(row.fecha)}`
    const list = byKey.get(key) ?? []
    list.push(row)
    byKey.set(key, list)
  }
  return Array.from(byKey.values()).map((group) => {
    const first = group[0]
    if (group.length === 1) return first
    return {
      ...first,
      presente: group.some((r) => r.presente),
      justificada: group.some((r) => r.justificada),
      observaciones: group.map((r) => r.observaciones).find(Boolean) ?? first.observaciones,
      puedeEditar: group.some((r) => r.puedeEditar),
    }
  })
}

export default function EstudianteInscripcionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === "string" ? Number(params.id) : NaN

  const [enrollment, setEnrollment] = useState<InscripcionResumenDto | null>(null)
  const [lecturas, setLecturas] = useState<LecturaDto[]>([])
  const [asistencia, setAsistencia] = useState<AsistenciaDto[]>([])
  const [loadingEnrollment, setLoadingEnrollment] = useState(true)
  const [loadingLecturas, setLoadingLecturas] = useState(false)
  const [loadingAsistencia, setLoadingAsistencia] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<AsistenciaDto | null>(null)
  const [editForm, setEditForm] = useState<UpdateAsistenciaBody>({})
  const [saving, setSaving] = useState(false)

  const fetchEnrollment = useCallback(async () => {
    if (!Number.isInteger(id)) {
      setNotFound(true)
      setLoadingEnrollment(false)
      return
    }
    setLoadingEnrollment(true)
    setNotFound(false)
    try {
      const list = await academicoService.getMisInscripciones(ANIO_ACTUAL)
      const found = list.find((i) => i.idInscripcionAcademica === id)
      if (!found) {
        const listPrev = await academicoService.getMisInscripciones(ANIO_ACTUAL - 1)
        const foundPrev = listPrev.find((i) => i.idInscripcionAcademica === id)
        if (foundPrev) {
          setEnrollment(foundPrev)
        } else {
          setEnrollment(null)
          setNotFound(true)
        }
      } else {
        setEnrollment(found)
      }
    } catch {
      setEnrollment(null)
      setNotFound(true)
    } finally {
      setLoadingEnrollment(false)
    }
  }, [id])

  const fetchLecturas = useCallback(async () => {
    if (!Number.isInteger(id)) return
    setLoadingLecturas(true)
    try {
      const data = await academicoService.getLecturasByInscripcion(id)
      setLecturas(data)
    } catch {
      setLecturas([])
    } finally {
      setLoadingLecturas(false)
    }
  }, [id])

  const fetchAsistencia = useCallback(async () => {
    if (!Number.isInteger(id)) return
    setLoadingAsistencia(true)
    try {
      const data = await academicoService.getAsistenciaByInscripcion(id)
      setAsistencia(data)
    } catch {
      setAsistencia([])
    } finally {
      setLoadingAsistencia(false)
    }
  }, [id])

  useEffect(() => {
    fetchEnrollment()
  }, [fetchEnrollment])

  useEffect(() => {
    if (enrollment) {
      fetchLecturas()
      fetchAsistencia()
    }
  }, [enrollment, fetchLecturas, fetchAsistencia])

  const openEditDialog = (row: AsistenciaDto) => {
    setEditingRow(row)
    setEditForm({
      presente: row.presente,
      justificada: row.justificada,
      observaciones: row.observaciones ?? "",
    })
    setEditDialogOpen(true)
  }

  const closeEditDialog = () => {
    setEditDialogOpen(false)
    setEditingRow(null)
    setEditForm({})
  }

  const handleSaveAsistencia = async () => {
    if (!editingRow) return
    setSaving(true)
    try {
      await academicoService.updateAsistencia(editingRow.idAsistencia, {
        presente: editForm.presente,
        justificada: editForm.justificada,
        observaciones: editForm.observaciones !== "" ? editForm.observaciones : undefined,
      })
      toast({
        title: "Asistencia actualizada",
        description: "Los cambios se guardaron correctamente.",
      })
      closeEditDialog()
      fetchAsistencia()
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo actualizar la asistencia."
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loadingEnrollment) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Cargando...</span>
      </div>
    )
  }

  if (notFound || !enrollment) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Inscripción no encontrada.</p>
        <Link href="/estudiante">
          <Button variant="outline">Volver a Mis cursos</Button>
        </Link>
      </div>
    )
  }

  const breadcrumbTitle = `${enrollment.descripcionCurso} - Div. ${enrollment.letraDivision}`

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/estudiante">Mi espacio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{breadcrumbTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-4">
        <Link href="/estudiante">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">{breadcrumbTitle}</h1>
          <p className="text-sm text-muted-foreground">Año {enrollment.anio}</p>
        </div>
      </div>

      <Tabs defaultValue="clases">
        <TabsList>
          <TabsTrigger value="clases">
            <Calendar className="mr-2 h-4 w-4" />
            Clases
          </TabsTrigger>
          <TabsTrigger value="asistencia">
            <ClipboardList className="mr-2 h-4 w-4" />
            Asistencia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clases" className="mt-4">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Fechas de clase</h2>
              <p className="text-sm text-muted-foreground">
                Listado de clases para esta división (solo lectura).
              </p>
            </CardHeader>
            <CardContent>
              {loadingLecturas ? (
                <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Cargando...</span>
                </div>
              ) : lecturas.length === 0 ? (
                <Empty className="py-8">
                  <EmptyMedia variant="icon">
                    <Calendar className="h-6 w-6" />
                  </EmptyMedia>
                  <EmptyHeader>
                    <EmptyTitle>Sin clases cargadas</EmptyTitle>
                    <EmptyDescription>
                      Aún no hay fechas de clase registradas para esta inscripción.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lecturas.map((l) => (
                      <TableRow key={l.idClase}>
                        <TableCell>{formatFecha(l.fecha)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="asistencia" className="mt-4">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Mi asistencia</h2>
              <p className="text-sm text-muted-foreground">
                Podés editar solo las filas de clases de las últimas 24 horas.
              </p>
            </CardHeader>
            <CardContent>
              {loadingAsistencia ? (
                <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Cargando...</span>
                </div>
              ) : asistencia.length === 0 ? (
                <Empty className="py-8">
                  <EmptyMedia variant="icon">
                    <ClipboardList className="h-6 w-6" />
                  </EmptyMedia>
                  <EmptyHeader>
                    <EmptyTitle>Sin registros de asistencia</EmptyTitle>
                    <EmptyDescription>
                      Aún no hay asistencia cargada para esta inscripción.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Presente</TableHead>
                      <TableHead>Justificada</TableHead>
                      <TableHead>Observaciones</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deduplicateAsistenciaByClass(asistencia).map((row) => {
                      const rowKey = row.idClase != null ? row.idClase : fechaKey(row.fecha) || row.idAsistencia
                      return (
                        <TableRow key={rowKey}>
                          <TableCell>{formatFecha(row.fecha)}</TableCell>
                          <TableCell>{row.presente ? "Sí" : "No"}</TableCell>
                          <TableCell>{row.justificada ? "Sí" : "No"}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {row.observaciones ?? "—"}
                          </TableCell>
                          <TableCell>
                            {row.puedeEditar ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(row)}
                                className="text-primary"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            ) : null}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar asistencia</DialogTitle>
            <DialogDescription>
              {editingRow && formatFecha(editingRow.fecha)} — Solo podés modificar dentro de las
              24 horas de la clase.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-presente"
                checked={editForm.presente ?? false}
                onCheckedChange={(c) => setEditForm((p) => ({ ...p, presente: c === true }))}
              />
              <Label htmlFor="edit-presente">Presente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-justificada"
                checked={editForm.justificada ?? false}
                onCheckedChange={(c) => setEditForm((p) => ({ ...p, justificada: c === true }))}
              />
              <Label htmlFor="edit-justificada">Justificada</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-observaciones">Observaciones</Label>
              <Textarea
                id="edit-observaciones"
                value={editForm.observaciones ?? ""}
                onChange={(e) => setEditForm((p) => ({ ...p, observaciones: e.target.value }))}
                placeholder="Opcional"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAsistencia} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Guardar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
