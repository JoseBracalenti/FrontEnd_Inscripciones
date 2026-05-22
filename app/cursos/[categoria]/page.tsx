"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, GraduationCap, Clock, Users } from "lucide-react"
import { use } from "react"

const CATEGORIAS = {
  idiomas: {
    nombre: "Idiomas",
    descripcion: "Aprendé idiomas con docentes especializados",
    cursos: [
      { nombre: "Inglés Básico", descripcion: "Introducción al idioma, vocabulario esencial y gramática básica.", edades: "Desde 8 años", horario: "Lunes y Miércoles" },
      { nombre: "Inglés Intermedio", descripcion: "Ampliación de vocabulario, comprensión lectora y conversación.", edades: "Desde 10 años", horario: "Lunes y Miércoles" },
      { nombre: "Inglés Avanzado", descripcion: "Gramática compleja, escritura formal y debate.", edades: "Desde 12 años", horario: "Martes y Jueves" },
      { nombre: "Francés Básico", descripcion: "Fonética, saludos, presentaciones y vida cotidiana en francés.", edades: "Desde 10 años", horario: "Lunes y Miércoles" },
      { nombre: "Francés Intermedio", descripcion: "Conversación fluida, textos literarios y expresión escrita.", edades: "Desde 12 años", horario: "Martes y Jueves" },
      { nombre: "Portugués", descripcion: "Lengua portuguesa con enfoque en comunicación oral y escrita.", edades: "Desde 10 años", horario: "Viernes" },
      { nombre: "Italiano", descripcion: "Cultura e idioma italiano desde sus bases.", edades: "Desde 10 años", horario: "Viernes" },
    ],
  },
  musica: {
    nombre: "Música",
    descripcion: "Formación musical con docentes especializados",
    cursos: [
      { nombre: "Piano Inicial", descripcion: "Técnica básica, lectura de notas y primeras piezas musicales.", edades: "Desde 6 años", horario: "Sábados" },
      { nombre: "Piano Intermedio", descripcion: "Repertorio clásico y contemporáneo, teoría musical avanzada.", edades: "Desde 8 años", horario: "Sábados" },
      { nombre: "Guitarra Clásica Nivel 1", descripcion: "Postura, digitación y primeras escalas y canciones.", edades: "Desde 8 años", horario: "Martes y Jueves" },
      { nombre: "Guitarra Eléctrica", descripcion: "Técnica de púa, acordes y géneros modernos como rock y blues.", edades: "Desde 12 años", horario: "Martes y Jueves" },
      { nombre: "Violín", descripcion: "Iniciación al violín, afinación, arco y repertorio básico.", edades: "Desde 6 años", horario: "Lunes y Miércoles" },
      { nombre: "Canto", descripcion: "Técnica vocal, respiración, dicción e interpretación.", edades: "Desde 12 años", horario: "Martes y Jueves" },
      { nombre: "Batería", descripcion: "Ritmos básicos, coordinación y lectura de partituras de percusión.", edades: "Desde 10 años", horario: "Sábados" },
      { nombre: "Bajo Eléctrico", descripcion: "Fundamentos del bajo, técnica de mano derecha y estilos musicales.", edades: "Desde 12 años", horario: "Viernes" },
    ],
  },
  talleres: {
    nombre: "Talleres",
    descripcion: "Expresión artística y creatividad para todas las edades",
    cursos: [
      { nombre: "Arte y Pintura", descripcion: "Técnicas de pintura al óleo, acrílico y acuarela.", edades: "Desde 6 años", horario: "Sábados" },
      { nombre: "Cerámica", descripcion: "Modelado, torno y técnicas de decoración con arcilla.", edades: "Desde 10 años", horario: "Lunes y Miércoles" },
      { nombre: "Teatro", descripcion: "Expresión corporal, improvisación y montaje de obras.", edades: "Desde 12 años", horario: "Martes y Jueves" },
      { nombre: "Fotografía", descripcion: "Composición, iluminación y edición digital de imágenes.", edades: "Desde 14 años", horario: "Viernes" },
      { nombre: "Danza Contemporánea", descripcion: "Movimiento, expresión y técnicas de danza moderna.", edades: "Desde 8 años", horario: "Martes y Jueves" },
      { nombre: "Manualidades", descripcion: "Técnicas creativas con distintos materiales para hacer en casa.", edades: "Desde 6 años", horario: "Sábados" },
    ],
  },
} as const

type CategoriaId = keyof typeof CATEGORIAS

export default function CursosCategoria({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = use(params)

  if (!(categoria in CATEGORIAS)) notFound()

  const data = CATEGORIAS[categoria as CategoriaId]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo-muni.png" alt="Municipalidad de Santo Tomé" width={40} height={40} className="h-10 w-auto" />
            <div>
              <h1 className="text-sm font-semibold text-foreground">Liceo Municipal</h1>
              <p className="text-xs text-muted-foreground">Sistema de Inscripciones</p>
            </div>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/#cursos" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Link>

        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">{data.nombre}</h2>
          <p className="mt-2 text-muted-foreground">{data.descripcion}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {data.cursos.map((curso) => (
            <Card key={curso.nombre} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{curso.nombre}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{curso.descripcion}</p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {curso.edades}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {curso.horario}
                  </span>
                </div>
                <Link href="/inscribirse">
                  <Button size="sm" className="w-full">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Inscribirme
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
