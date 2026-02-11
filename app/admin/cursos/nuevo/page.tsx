"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2, Save, Clock } from "lucide-react"
import Link from "next/link"

interface Division {
  id: string
  name: string
  schedule: string
  spots: number
}

export default function NuevoCursoPage() {
  const [divisions, setDivisions] = useState<Division[]>([
    { id: "1", name: "División A", schedule: "", spots: 20 }
  ])
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    minAge: "",
    maxAge: "",
    duration: "anual",
    frequency: "2",
    isActive: true,
  })

  const addDivision = () => {
    const newId = String(divisions.length + 1)
    const divisionLetter = String.fromCharCode(65 + divisions.length) // A, B, C...
    setDivisions([...divisions, { id: newId, name: `División ${divisionLetter}`, schedule: "", spots: 20 }])
  }

  const removeDivision = (id: string) => {
    if (divisions.length > 1) {
      setDivisions(divisions.filter(d => d.id !== id))
    }
  }

  const updateDivision = (id: string, field: keyof Division, value: string | number) => {
    setDivisions(divisions.map(d => d.id === id ? { ...d, [field]: value } : d))
  }

  const totalSpots = divisions.reduce((acc, d) => acc + d.spots, 0)

  return (
    <AppLayout title="Nuevo Curso">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/admin/cursos" className="text-muted-foreground hover:text-foreground">
            Cursos
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Nuevo Curso</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Crear Nuevo Curso</h2>
            <p className="text-muted-foreground">Completá la información del curso y sus divisiones</p>
          </div>
          <Link href="/admin/cursos">
            <Button variant="outline" className="bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>

        {/* Form */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>Datos básicos del curso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Curso *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Inglés Básico"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="idiomas">Idiomas</SelectItem>
                        <SelectItem value="musica">Música</SelectItem>
                        <SelectItem value="talleres">Talleres</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio Mensual *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="price"
                        type="number"
                        className="pl-7"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="15000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción del curso, objetivos, contenidos..."
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="minAge">Edad Mínima *</Label>
                    <Input
                      id="minAge"
                      type="number"
                      value={formData.minAge}
                      onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
                      placeholder="12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAge">Edad Máxima</Label>
                    <Input
                      id="maxAge"
                      type="number"
                      value={formData.maxAge}
                      onChange={(e) => setFormData({ ...formData, maxAge: e.target.value })}
                      placeholder="Sin límite (dejar vacío)"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración</Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) => setFormData({ ...formData, duration: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anual">Anual (Marzo - Diciembre)</SelectItem>
                        <SelectItem value="semestral">Semestral</SelectItem>
                        <SelectItem value="cuatrimestral">Cuatrimestral</SelectItem>
                        <SelectItem value="bimestral">Bimestral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Clases por Semana</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 clase semanal</SelectItem>
                        <SelectItem value="2">2 clases semanales</SelectItem>
                        <SelectItem value="3">3 clases semanales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Divisions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Divisiones y Horarios</CardTitle>
                    <CardDescription>Configurá las divisiones disponibles para este curso</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={addDivision} className="bg-transparent">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar División
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {divisions.map((division, index) => (
                  <div key={division.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">{division.name}</h4>
                      {divisions.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeDivision(division.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Horario *</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            value={division.schedule}
                            onChange={(e) => updateDivision(division.id, "schedule", e.target.value)}
                            placeholder="Ej: Lunes y Miércoles 18:00 - 19:30"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Cupos Disponibles *</Label>
                        <Input
                          type="number"
                          value={division.spots}
                          onChange={(e) => updateDivision(division.id, "spots", parseInt(e.target.value) || 0)}
                          placeholder="20"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Divisiones</span>
                  <span className="font-medium">{divisions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cupos totales</span>
                  <span className="font-medium">{totalSpots}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio mensual</span>
                  <span className="font-medium">
                    {formData.price ? `$${parseInt(formData.price).toLocaleString()}` : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ingreso potencial</span>
                  <span className="font-bold text-primary">
                    {formData.price ? `$${(parseInt(formData.price) * totalSpots).toLocaleString()}/mes` : "-"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Curso Activo</Label>
                    <p className="text-xs text-muted-foreground">
                      El curso estará visible para inscripciones
                    </p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button className="w-full" size="lg">
                <Save className="mr-2 h-4 w-4" />
                Guardar Curso
              </Button>
              <Link href="/admin/cursos" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Cancelar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
