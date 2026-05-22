export type AdminInscripcionEstado = "Confirmada" | "Reservada" | "Cancelada"
export type AdminCursoCategoria = "idiomas" | "musica" | "talleres"
export type AdminCursoEstado = "activo" | "completo" | "inactivo"

export interface AdminInscripcionDto {
  id: number
  alumno: string
  dni: string
  curso: string
  division: string
  horario: string
  estado: AdminInscripcionEstado
  metodoPago: string
  fecha: string
  tutor: string
}

export interface AlumnoPromovidoDto {
  id: number
  nombre: string
  dni: string
  cursoActual: string
  asistencia: number
  promedio: number
  estado: string
  cursosDisponibles: string[]
}

export interface AdminCursoDto {
  id: number
  name: string
  category: AdminCursoCategoria
  divisions: number
  totalSpots: number
  enrolledSpots: number
  price: number
  minAge: number
  maxAge: number
  status: AdminCursoEstado
}

export interface ActividadRecienteDto {
  name: string
  course: string
  status: string
  date: string
  type: "Nueva" | "Promovido"
}

export interface DisponibilidadCategoriaDto {
  categoria: string
  totalCursos: number
  cuposTotales: number
  ocupados: number
}

export interface DashboardStatsDto {
  totalInscripciones: number
  inscripcionesPendientes: number
  inscripcionesConfirmadas: number
  cursosActivos: number
  inscripcionesPorVencer: number
  actividadReciente: ActividadRecienteDto[]
  disponibilidadCursos: DisponibilidadCategoriaDto[]
}

export interface NuevaInscripcionAdminRequest {
  nombre: string
  apellido: string
  dni: string
  fechaNacimiento: string
  domicilio: string
  telefono: string
  email: string
  esMenor: boolean
  tutorNombre?: string
  tutorApellido?: string
  tutorDni?: string
  tutorRelacion?: string
  tutorTelefono?: string
  tutorEmail?: string
  emergenciaNombre?: string
  emergenciaTelefono?: string
  tipoCurso: string
  curso: string
  division: string
  horario: string
  metodoPago: "contado" | "cuotas"
}

export interface ReinscripcionAdminRequest {
  alumnoId: number
  curso: string
  division: string
  horario: string
  metodoPago: "contado" | "cuotas"
}
