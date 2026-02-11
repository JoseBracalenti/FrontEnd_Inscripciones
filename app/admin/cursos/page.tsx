"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Eye, 
  Users, 
  Clock,
  BookOpen,
  Music,
  Palette,
  Copy
} from "lucide-react"
import Link from "next/link"

// Mock data for courses
const coursesData = [
  { 
    id: 1, 
    name: "Inglés Básico", 
    category: "idiomas", 
    divisions: 3, 
    totalSpots: 60, 
    enrolledSpots: 55, 
    price: 15000,
    minAge: 12,
    maxAge: 99,
    status: "activo"
  },
  { 
    id: 2, 
    name: "Inglés Intermedio", 
    category: "idiomas", 
    divisions: 2, 
    totalSpots: 40, 
    enrolledSpots: 37, 
    price: 15000,
    minAge: 14,
    maxAge: 99,
    status: "activo"
  },
  { 
    id: 3, 
    name: "Inglés Avanzado", 
    category: "idiomas", 
    divisions: 1, 
    totalSpots: 20, 
    enrolledSpots: 20, 
    price: 18000,
    minAge: 16,
    maxAge: 99,
    status: "completo"
  },
  { 
    id: 4, 
    name: "Francés Básico", 
    category: "idiomas", 
    divisions: 1, 
    totalSpots: 20, 
    enrolledSpots: 12, 
    price: 15000,
    minAge: 15,
    maxAge: 99,
    status: "activo"
  },
  { 
    id: 5, 
    name: "Guitarra Nivel 1", 
    category: "musica", 
    divisions: 2, 
    totalSpots: 24, 
    enrolledSpots: 20, 
    price: 18000,
    minAge: 10,
    maxAge: 99,
    status: "activo"
  },
  { 
    id: 6, 
    name: "Piano Nivel 1", 
    category: "musica", 
    divisions: 3, 
    totalSpots: 18, 
    enrolledSpots: 17, 
    price: 22000,
    minAge: 8,
    maxAge: 99,
    status: "activo"
  },
  { 
    id: 7, 
    name: "Violín", 
    category: "musica", 
    divisions: 1, 
    totalSpots: 12, 
    enrolledSpots: 9, 
    price: 20000,
    minAge: 8,
    maxAge: 99,
    status: "activo"
  },
  { 
    id: 8, 
    name: "Teatro", 
    category: "talleres", 
    divisions: 2, 
    totalSpots: 40, 
    enrolledSpots: 25, 
    price: 12000,
    minAge: 14,
    maxAge: 99,
    status: "activo"
  },
  { 
    id: 9, 
    name: "Pintura", 
    category: "talleres", 
    divisions: 2, 
    totalSpots: 30, 
    enrolledSpots: 22, 
    price: 12000,
    minAge: 10,
    maxAge: 99,
    status: "activo"
  },
  { 
    id: 10, 
    name: "Fotografía", 
    category: "talleres", 
    divisions: 1, 
    totalSpots: 15, 
    enrolledSpots: 9, 
    price: 14000,
    minAge: 16,
    maxAge: 99,
    status: "activo"
  },
]

export default function CursosAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("todos")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [selectedCourse, setSelectedCourse] = useState<typeof coursesData[0] | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "todos" || course.category === categoryFilter
    const matchesStatus = statusFilter === "todos" || course.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "idiomas": return <BookOpen className="h-4 w-4" />
      case "musica": return <Music className="h-4 w-4" />
      case "talleres": return <Palette className="h-4 w-4" />
      default: return null
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "idiomas": return "Idiomas"
      case "musica": return "Música"
      case "talleres": return "Talleres"
      default: return category
    }
  }

  const getAvailability = (total: number, enrolled: number) => {
    const available = total - enrolled
    const percentage = (enrolled / total) * 100
    if (percentage >= 100) return { label: "Completo", color: "bg-red-100 text-red-800" }
    if (percentage >= 80) return { label: `${available} cupos`, color: "bg-amber-100 text-amber-800" }
    return { label: `${available} cupos`, color: "bg-green-100 text-green-800" }
  }

  return (
    <AppLayout title="Gestión de Cursos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Cursos</h2>
            <p className="text-muted-foreground">Gestiona los cursos, divisiones y cupos disponibles</p>
          </div>
          <Link href="/admin/cursos/nuevo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Curso
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{coursesData.length}</p>
                  <p className="text-sm text-muted-foreground">Cursos totales</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-green-100 p-3">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {coursesData.reduce((acc, c) => acc + c.totalSpots, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Cupos totales</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-amber-100 p-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {coursesData.reduce((acc, c) => acc + c.enrolledSpots, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Inscriptos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {coursesData.reduce((acc, c) => acc + (c.totalSpots - c.enrolledSpots), 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar curso..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las categorías</SelectItem>
                  <SelectItem value="idiomas">Idiomas</SelectItem>
                  <SelectItem value="musica">Música</SelectItem>
                  <SelectItem value="talleres">Talleres</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="completo">Completo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Courses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Cursos</CardTitle>
            <CardDescription>
              {filteredCourses.length} curso{filteredCourses.length !== 1 ? "s" : ""} encontrado{filteredCourses.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-center">Divisiones</TableHead>
                  <TableHead className="text-center">Cupos</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => {
                  const availability = getAvailability(course.totalSpots, course.enrolledSpots)
                  return (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{course.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Edad: {course.minAge}{course.maxAge < 99 ? ` - ${course.maxAge}` : "+"} años
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(course.category)}
                          <span>{getCategoryLabel(course.category)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{course.divisions}</TableCell>
                      <TableCell className="text-center">
                        <div>
                          <p className="font-medium">{course.enrolledSpots}/{course.totalSpots}</p>
                          <Badge className={`mt-1 ${availability.color}`}>
                            {availability.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${course.price.toLocaleString()}/mes
                      </TableCell>
                      <TableCell>
                        <Badge variant={course.status === "activo" ? "default" : course.status === "completo" ? "secondary" : "outline"}>
                          {course.status === "activo" ? "Activo" : course.status === "completo" ? "Completo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setSelectedCourse(course); setIsViewDialogOpen(true); }}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Course Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedCourse?.name}</DialogTitle>
              <DialogDescription>
                Información detallada del curso
              </DialogDescription>
            </DialogHeader>
            {selectedCourse && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Categoría</Label>
                    <p className="font-medium">{getCategoryLabel(selectedCourse.category)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Estado</Label>
                    <p className="font-medium capitalize">{selectedCourse.status}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Precio Mensual</Label>
                    <p className="font-medium">${selectedCourse.price.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Edad Requerida</Label>
                    <p className="font-medium">{selectedCourse.minAge} - {selectedCourse.maxAge < 99 ? selectedCourse.maxAge : "Sin límite"} años</p>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-3">Disponibilidad</h4>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{selectedCourse.divisions}</p>
                      <p className="text-sm text-muted-foreground">Divisiones</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{selectedCourse.enrolledSpots}</p>
                      <p className="text-sm text-muted-foreground">Inscriptos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{selectedCourse.totalSpots - selectedCourse.enrolledSpots}</p>
                      <p className="text-sm text-muted-foreground">Disponibles</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Ocupación</span>
                      <span>{Math.round((selectedCourse.enrolledSpots / selectedCourse.totalSpots) * 100)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div 
                        className="h-2 rounded-full bg-primary transition-all" 
                        style={{ width: `${(selectedCourse.enrolledSpots / selectedCourse.totalSpots) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="bg-transparent">
                Cerrar
              </Button>
              <Button>
                <Pencil className="mr-2 h-4 w-4" />
                Editar Curso
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
