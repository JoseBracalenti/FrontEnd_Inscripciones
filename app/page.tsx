"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  BookOpen, 
  Music, 
  Palette, 
  GraduationCap, 
  Clock, 
  Users, 
  ChevronRight,
  Search,
  Phone,
  MapPin,
  Mail,
  User,
  LogOut,
  Settings
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useUserAuth } from "@/contexts/user-auth-context"

const courseCategories = [
  {
    id: "idiomas",
    name: "Idiomas",
    icon: BookOpen,
    description: "Inglés, Francés, Portugués, Italiano y más",
    courses: 12,
    color: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    id: "musica",
    name: "Música",
    icon: Music,
    description: "Piano, Guitarra, Violín, Canto y más instrumentos",
    courses: 15,
    color: "bg-purple-50 text-purple-700 border-purple-200"
  },
  {
    id: "talleres",
    name: "Talleres",
    icon: Palette,
    description: "Arte, Cerámica, Teatro, Fotografía y otros",
    courses: 8,
    color: "bg-amber-50 text-amber-700 border-amber-200"
  }
]

const featuredCourses = [
  { name: "Inglés Básico", category: "Idiomas", spots: 5, schedule: "Lunes y Miércoles 18:00", age: "Desde 12 años" },
  { name: "Guitarra Nivel 1", category: "Música", spots: 3, schedule: "Martes y Jueves 19:00", age: "Desde 10 años" },
  { name: "Piano Inicial", category: "Música", spots: 2, schedule: "Sábados 10:00", age: "Desde 8 años" },
  { name: "Francés Intermedio", category: "Idiomas", spots: 8, schedule: "Viernes 17:00", age: "Desde 15 años" },
]

export default function PublicPortalPage() {
  const { user, logout } = useUserAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-muni.png"
              alt="Municipalidad de Santo Tomé"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground leading-tight">Liceo Municipal</h1>
              <p className="text-xs text-muted-foreground">Santo Tomé - Inscripciones 2026</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            {user ? (
              <>
                <Link href="/inscribirse">
                  <Button size="sm">Inscribirme</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{user.nombre}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.nombre} {user.apellido}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/cuenta/login">
                  <Button variant="ghost" size="sm">Iniciar Sesión</Button>
                </Link>
                <Link href="/cuenta/registro">
                  <Button variant="outline" size="sm" className="bg-transparent">Registrarse</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-16 sm:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
              Inscripciones Abiertas - Ciclo 2026
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
              Descubrí tu pasión en el Liceo Municipal
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 text-pretty">
              Cursos de idiomas, instrumentos musicales y talleres artísticos para todas las edades. 
              Formación de calidad con docentes especializados.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/inscribirse">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Inscribirme Ahora
                </Button>
              </Link>
              <Link href="#cursos">
                <Button size="lg" variant="ghost" className="w-full text-white hover:bg-white/10 hover:text-white sm:w-auto text-base">
                  Ver Cursos Disponibles
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section id="cursos" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Nuestras Áreas de Formación
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Elegí entre nuestras tres grandes áreas de formación y encontrá el curso ideal para vos
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courseCategories.map((category) => (
              <Card key={category.id} className="group relative overflow-hidden transition-all hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg border ${category.color}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{category.courses} cursos disponibles</span>
                    <Link href={`/inscribirse?categoria=${category.id}`}>
                      <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                        Ver cursos
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="bg-muted/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-3xl font-bold tracking-tight text-foreground">
                Cursos con Cupos Disponibles
              </h3>
              <p className="mt-2 text-muted-foreground">
                Estos cursos todavía tienen lugar, no te quedes afuera
              </p>
            </div>
            <Link href="/inscribirse">
              <Button variant="outline" className="bg-transparent">
                Ver todos los cursos
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCourses.map((course, i) => (
              <Card key={i} className="transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge variant="outline" className={course.spots <= 3 ? "border-destructive text-destructive" : ""}>
                      {course.spots} cupos
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 text-lg">{course.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{course.age}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Enrollment Check */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="bg-primary p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  Consultá el estado de tu inscripción
                </h3>
                <p className="mt-4 text-white/80">
                  Si ya iniciaste el proceso de inscripción, podés verificar su estado ingresando tu número de DNI
                </p>
              </div>
              <div className="p-8 lg:p-12">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dni">Número de DNI</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="dni" 
                        placeholder="Ingresá tu DNI sin puntos" 
                        className="flex-1"
                      />
                      <Button type="submit">
                        <Search className="mr-2 h-4 w-4" />
                        Consultar
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    También podés consultar con el comprobante de inscripción que recibiste por email
                  </p>
                </form>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-muted/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <CardTitle>Horarios de Atención</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Lunes a Viernes: 8:00 a 20:00</p>
                <p>Sábados: 9:00 a 13:00</p>
                <p className="font-medium text-foreground">Inscripciones hasta el 28/02/2026</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <CardTitle>Ubicación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Av. 7 de Marzo 2150</p>
                <p>Santo Tomé, Santa Fe</p>
                <p>Argentina</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <CardTitle>Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  (0342) 474-5500
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  liceo@santotome.gov.ar
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo-muni.png"
                alt="Municipalidad de Santo Tomé"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <div>
                <p className="text-sm font-semibold">Municipalidad de Santo Tomé</p>
                <p className="text-xs text-muted-foreground">Liceo Municipal - Sistema de Inscripciones</p>
              </div>
            </div>
<div className="flex items-center gap-4">
<p className="text-xs text-muted-foreground">
2026 Todos los derechos reservados
</p>
<Link href="/admin/login" className="text-xs text-muted-foreground hover:text-foreground">
Acceso Administrativo
</Link>
</div>
</div>
</div>
</footer>
    </div>
  )
}
