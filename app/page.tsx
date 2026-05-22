"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  BookOpen,
  Music,
  Palette,
  GraduationCap,
  Clock,
  ChevronRight,
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
                <Link href="/estudiante">
                  <Button size="sm" variant="outline" className="bg-transparent">
                    Mi espacio
                  </Button>
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
      <section className="relative overflow-hidden bg-primary py-10 sm:py-14">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
              Inscripciones Abiertas - Ciclo 2026
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
              Liceo Municipal
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
      <section id="cursos" className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Nuestras Áreas de Formación
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Elegí entre nuestras tres grandes áreas de formación y encontrá el curso ideal para vos
            </p>
          </div>

          <div className="mt-12 mx-auto max-w-2xl flex flex-col gap-4">
            {courseCategories.map((category) => (
              <Card key={category.id} className="transition-all hover:shadow-lg">
                <CardContent className="flex items-center gap-6 p-6">
                  <div className={`shrink-0 inline-flex h-14 w-14 items-center justify-center rounded-xl border ${category.color}`}>
                    <category.icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <CardDescription className="mt-1">{category.description}</CardDescription>
                  </div>
                  <Link href={`/cursos/${category.id}`} className="shrink-0">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Ver cursos
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment Status Check */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="bg-primary p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  Consultá el estado de tu inscripción
                </h3>
                <p className="mt-4 text-white/80">
                  Ingresá a tu cuenta para ver el estado de tus inscripciones, horarios y asistencia
                </p>
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12">
                {user ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Bienvenido/a, <span className="font-medium text-foreground">{user.nombre} {user.apellido}</span>. Podés ver todas tus inscripciones desde tu espacio personal.
                    </p>
                    <Link href="/estudiante">
                      <Button className="w-full sm:w-auto">
                        Ver mis inscripciones
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Iniciá sesión con tu cuenta para consultar el estado de tus inscripciones
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link href="/cuenta/login">
                        <Button className="w-full sm:w-auto">Iniciar sesión</Button>
                      </Link>
                      <Link href="/cuenta/registro">
                        <Button variant="outline" className="w-full bg-transparent sm:w-auto">Crear cuenta</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-muted/50 py-10 sm:py-14">
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
                <p>Castelli 1668</p>
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
