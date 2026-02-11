"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Filter, Eye, Download, CheckCircle, Clock, XCircle } from "lucide-react"

// Datos simulados
const inscripciones = [
  {
    id: 1,
    alumno: "García, María Fernanda",
    dni: "42123456",
    curso: "Inglés Intermedio",
    division: "A",
    horario: "Lunes y Miércoles 18:00-19:30",
    estado: "Confirmada",
    metodoPago: "Cuotas",
    fecha: "2026-01-15",
    tutor: "García, Roberto",
  },
  {
    id: 2,
    alumno: "Rodríguez, Juan Carlos",
    dni: "41987654",
    curso: "Guitarra Nivel 1",
    division: "B",
    horario: "Martes y Jueves 18:00-19:30",
    estado: "Reservada",
    metodoPago: "Contado",
    fecha: "2026-01-20",
    tutor: "Rodríguez, Ana",
  },
  {
    id: 3,
    alumno: "López, Ana Sofía",
    dni: "43567890",
    curso: "Francés Básico",
    division: "A",
    horario: "Lunes y Miércoles 20:00-21:30",
    estado: "Confirmada",
    metodoPago: "Cuotas",
    fecha: "2026-01-18",
    tutor: "López, Carlos",
  },
  {
    id: 4,
    alumno: "Martínez, Pedro",
    dni: "40123789",
    curso: "Piano Avanzado",
    division: "C",
    horario: "Martes y Jueves 20:00-21:30",
    estado: "Cancelada",
    metodoPago: "Cuotas",
    fecha: "2026-01-10",
    tutor: "Martínez, Laura",
  },
  {
    id: 5,
    alumno: "Fernández, Lucía",
    dni: "44789012",
    curso: "Inglés Avanzado",
    division: "B",
    horario: "Lunes y Miércoles 18:00-19:30",
    estado: "Reservada",
    metodoPago: "Cuotas",
    fecha: "2026-01-22",
    tutor: "Fernández, Miguel",
  },
]

export default function ConsultasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("todos")
  const [filterCurso, setFilterCurso] = useState("todos")
  const [selectedInscripcion, setSelectedInscripcion] = useState<typeof inscripciones[0] | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredInscripciones = inscripciones.filter((insc) => {
    const matchSearch = 
      insc.alumno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insc.dni.includes(searchTerm) ||
      insc.curso.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchEstado = filterEstado === "todos" || insc.estado === filterEstado
    const matchCurso = filterCurso === "todos" || insc.curso.includes(filterCurso)
    
    return matchSearch && matchEstado && matchCurso
  })

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Confirmada":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />{estado}</Badge>
      case "Reservada":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Clock className="h-3 w-3 mr-1" />{estado}</Badge>
      case "Cancelada":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="h-3 w-3 mr-1" />{estado}</Badge>
      default:
        return <Badge variant="secondary">{estado}</Badge>
    }
  }

  const handleViewDetails = (inscripcion: typeof inscripciones[0]) => {
    setSelectedInscripcion(inscripcion)
    setDialogOpen(true)
  }

  return (
    <AppLayout title="Consulta de Inscripciones">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Consulta de Inscripciones</h2>
          <p className="text-muted-foreground">Busque y gestione las inscripciones registradas</p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Búsqueda Avanzada de Inscripciones
            </CardTitle>
            <CardDescription>Buscar por DNI, Apellido, Nombre o Curso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="search">Búsqueda</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="DNI, Nombre, Apellido..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filterEstado">Estado</Label>
                <Select value={filterEstado} onValueChange={setFilterEstado}>
                  <SelectTrigger id="filterEstado">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Confirmada">Confirmada</SelectItem>
                    <SelectItem value="Reservada">Reservada</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filterCurso">Tipo de Curso</Label>
                <Select value={filterCurso} onValueChange={setFilterCurso}>
                  <SelectTrigger id="filterCurso">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Inglés">Inglés</SelectItem>
                    <SelectItem value="Francés">Francés</SelectItem>
                    <SelectItem value="Guitarra">Guitarra</SelectItem>
                    <SelectItem value="Piano">Piano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">
                {filteredInscripciones.length} resultado(s) encontrado(s)
              </p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar Resultados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados de Búsqueda</CardTitle>
            <CardDescription>Lista de inscripciones que coinciden con los criterios de búsqueda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alumno</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>División</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInscripciones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No se encontraron inscripciones que coincidan con los criterios de búsqueda
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInscripciones.map((inscripcion) => (
                      <TableRow key={inscripcion.id}>
                        <TableCell className="font-medium">{inscripcion.alumno}</TableCell>
                        <TableCell>{inscripcion.dni}</TableCell>
                        <TableCell>{inscripcion.curso}</TableCell>
                        <TableCell>{inscripcion.division}</TableCell>
                        <TableCell>{getEstadoBadge(inscripcion.estado)}</TableCell>
                        <TableCell>{new Date(inscripcion.fecha).toLocaleDateString('es-AR')}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(inscripcion)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles de Inscripción</DialogTitle>
              <DialogDescription>
                Información completa de la inscripción
              </DialogDescription>
            </DialogHeader>
            
            {selectedInscripcion && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">ID de Inscripción</p>
                    <p className="text-lg font-semibold">#{selectedInscripcion.id.toString().padStart(6, '0')}</p>
                  </div>
                  {getEstadoBadge(selectedInscripcion.estado)}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-3">Datos del Alumno</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Nombre:</span> {selectedInscripcion.alumno}</p>
                      <p><span className="text-muted-foreground">DNI:</span> {selectedInscripcion.dni}</p>
                      <p><span className="text-muted-foreground">Tutor:</span> {selectedInscripcion.tutor}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Datos del Curso</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Curso:</span> {selectedInscripcion.curso}</p>
                      <p><span className="text-muted-foreground">División:</span> {selectedInscripcion.division}</p>
                      <p><span className="text-muted-foreground">Horario:</span> {selectedInscripcion.horario}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Información de Pago</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Método:</span> {selectedInscripcion.metodoPago}</p>
                    <p><span className="text-muted-foreground">Monto:</span> {selectedInscripcion.metodoPago === "Contado" ? "$135,000" : "$15,000/mes"}</p>
                    <p><span className="text-muted-foreground">Fecha de Inscripción:</span> {new Date(selectedInscripcion.fecha).toLocaleDateString('es-AR')}</p>
                  </div>
                </div>

                {selectedInscripcion.estado === "Reservada" && (
                  <div className="rounded-lg bg-amber-50 p-4">
                    <p className="text-sm text-amber-800">
                      <strong>Atención:</strong> Esta inscripción está pendiente de confirmación. 
                      El alumno debe presentar el comprobante de pago inicial antes del {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR')}.
                    </p>
                  </div>
                )}

                <div className="flex gap-2 justify-end pt-4 border-t">
                  {selectedInscripcion.estado === "Reservada" && (
                    <>
                      <Button variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                        Cancelar Inscripción
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Confirmar Pago
                      </Button>
                    </>
                  )}
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Comprobante
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
