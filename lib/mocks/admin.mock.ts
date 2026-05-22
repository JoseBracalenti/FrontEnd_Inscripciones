import type {
  AdminInscripcionDto,
  AlumnoPromovidoDto,
  AdminCursoDto,
  DashboardStatsDto,
  NuevaInscripcionAdminRequest,
  ReinscripcionAdminRequest,
} from "@/lib/admin.types"

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const INSCRIPCIONES: AdminInscripcionDto[] = [
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

const ALUMNOS_PROMOVIDOS: AlumnoPromovidoDto[] = [
  {
    id: 1,
    nombre: "García, María Fernanda",
    dni: "42123456",
    cursoActual: "Inglés Intermedio",
    asistencia: 95,
    promedio: 9.2,
    estado: "Promovida",
    cursosDisponibles: ["Inglés Avanzado", "Francés Básico"],
  },
  {
    id: 2,
    nombre: "Rodríguez, Juan Carlos",
    dni: "41987654",
    cursoActual: "Guitarra Nivel 1",
    asistencia: 88,
    promedio: 8.5,
    estado: "Promovido",
    cursosDisponibles: ["Guitarra Nivel 2", "Piano Nivel 1"],
  },
  {
    id: 3,
    nombre: "López, Ana Sofía",
    dni: "43567890",
    cursoActual: "Piano Nivel 1",
    asistencia: 92,
    promedio: 9.0,
    estado: "Promovida",
    cursosDisponibles: ["Piano Nivel 2"],
  },
]

const CURSOS: AdminCursoDto[] = [
  { id: 1, name: "Inglés Básico", category: "idiomas", divisions: 3, totalSpots: 60, enrolledSpots: 55, price: 15000, minAge: 12, maxAge: 99, status: "activo" },
  { id: 2, name: "Inglés Intermedio", category: "idiomas", divisions: 2, totalSpots: 40, enrolledSpots: 37, price: 15000, minAge: 14, maxAge: 99, status: "activo" },
  { id: 3, name: "Inglés Avanzado", category: "idiomas", divisions: 1, totalSpots: 20, enrolledSpots: 20, price: 18000, minAge: 16, maxAge: 99, status: "completo" },
  { id: 4, name: "Francés Básico", category: "idiomas", divisions: 1, totalSpots: 20, enrolledSpots: 12, price: 15000, minAge: 15, maxAge: 99, status: "activo" },
  { id: 5, name: "Guitarra Nivel 1", category: "musica", divisions: 2, totalSpots: 24, enrolledSpots: 20, price: 18000, minAge: 10, maxAge: 99, status: "activo" },
  { id: 6, name: "Piano Nivel 1", category: "musica", divisions: 3, totalSpots: 18, enrolledSpots: 17, price: 22000, minAge: 8, maxAge: 99, status: "activo" },
  { id: 7, name: "Violín", category: "musica", divisions: 1, totalSpots: 12, enrolledSpots: 9, price: 20000, minAge: 8, maxAge: 99, status: "activo" },
  { id: 8, name: "Teatro", category: "talleres", divisions: 2, totalSpots: 40, enrolledSpots: 25, price: 12000, minAge: 14, maxAge: 99, status: "activo" },
  { id: 9, name: "Pintura", category: "talleres", divisions: 2, totalSpots: 30, enrolledSpots: 22, price: 12000, minAge: 10, maxAge: 99, status: "activo" },
  { id: 10, name: "Fotografía", category: "talleres", divisions: 1, totalSpots: 15, enrolledSpots: 9, price: 14000, minAge: 16, maxAge: 99, status: "activo" },
]

const DASHBOARD_STATS: DashboardStatsDto = {
  totalInscripciones: 342,
  inscripcionesPendientes: 28,
  inscripcionesConfirmadas: 298,
  cursosActivos: 35,
  inscripcionesPorVencer: 5,
  actividadReciente: [
    { name: "García, María Fernanda", course: "Inglés Intermedio", status: "Confirmada", date: "Hoy, 14:23", type: "Nueva" },
    { name: "Rodríguez, Juan Carlos", course: "Guitarra Nivel 1", status: "Pendiente", date: "Hoy, 12:45", type: "Nueva" },
    { name: "López, Ana Sofía", course: "Francés Básico", status: "Confirmada", date: "Ayer, 16:30", type: "Promovido" },
    { name: "Martínez, Pedro", course: "Piano Avanzado", status: "Reservada", date: "Ayer, 10:15", type: "Nueva" },
    { name: "González, Laura", course: "Teatro", status: "Cancelada", date: "Hace 2 días", type: "Nueva" },
  ],
  disponibilidadCursos: [
    { categoria: "Idiomas", totalCursos: 12, cuposTotales: 180, ocupados: 142 },
    { categoria: "Música", totalCursos: 15, cuposTotales: 120, ocupados: 108 },
    { categoria: "Talleres", totalCursos: 8, cuposTotales: 160, ocupados: 92 },
  ],
}

export const adminServiceMock = {
  async getDashboardStats(): Promise<DashboardStatsDto> {
    await delay(300)
    return { ...DASHBOARD_STATS }
  },

  async getInscripciones(): Promise<AdminInscripcionDto[]> {
    await delay(300)
    return [...INSCRIPCIONES]
  },

  async getAlumnosPromovidos(): Promise<AlumnoPromovidoDto[]> {
    await delay(300)
    return [...ALUMNOS_PROMOVIDOS]
  },

  async getCursos(): Promise<AdminCursoDto[]> {
    await delay(300)
    return [...CURSOS]
  },

  async crearInscripcion(_data: NuevaInscripcionAdminRequest): Promise<void> {
    await delay(800)
  },

  async reinscribirAlumno(_data: ReinscripcionAdminRequest): Promise<void> {
    await delay(800)
  },

  async confirmarPago(_id: number): Promise<void> {
    await delay(400)
  },

  async cancelarInscripcion(_id: number): Promise<void> {
    await delay(400)
  },
}
