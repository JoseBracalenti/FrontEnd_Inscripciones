/**
 * GET /api/v1/inscripciones/cursos-disponibles?anio=<number>
 */

export interface DivisionHorarioDto {
  id: number
  letra: string
  horarios: string
  cupo: number
  cantidadInscriptos: number
  instrumentoDescripcion?: string | null
}

export interface CursoDisponibleDto {
  id: number
  descripcion: string
  edadMinima: number
  edadMaxima: number
  carreraId: number
  carreraNombre: string
  /** Enrollment cost for this course in the cycle; null if not defined */
  montoMatricula?: number | null
  divisiones: DivisionHorarioDto[]
}

/**
 * POST /api/v1/inscripciones/matricular
 */

export interface MatriculaRequest {
  idDivisionHorario: number
  tipoPago: "CONTADO" | "FINANCIADO"
}

export interface MatriculaResponse {
  idInscripcionAcademica: number
  iduInscripcionPublic: number
  idDivisionHorario: number
  idCurso: number
  anio: number
}

/** 201 with cuotas pending (optional body shape) */
export interface CuotasPendienteBody {
  message: string
  inscripcionId: number
}

/**
 * POST /api/v1/inscripciones/alumnos — register new student (alta alumno).
 */

export interface DatosAlumnoDto {
  nombre: string
  apellido: string
  tipoDocumento?: string | null
  numeroDocumento: string
  domicilio: string
  localidad: string
  telefono?: string | null
  escuela?: string | null
  nivelEscolar?: string | null
  email?: string | null
  fechaNacimiento: string
  poseeCud?: boolean | null
  discapacidad?: string | null
  sexo: string
  ocupacion?: string | null
}

export interface DatosResponsableDto {
  nombre: string
  apellido: string
  tipoDocumento?: string | null
  numeroDocumento?: string | null
  parentesco?: string | null
  domicilio?: string | null
  localidad?: string | null
  telefono?: string | null
  email?: string | null
  sexo?: string | null
  ocupacion?: string | null
}

export interface AltaAlumnoRequest {
  alumno: DatosAlumnoDto
  username: string
  password: string
  responsable?: DatosResponsableDto
}

export interface AlumnoResponse {
  id: number
  nombre: string
  apellido: string
  tipoDocumento?: string | null
  numeroDocumento: string
  domicilio: string
  localidad: string
  telefono?: string | null
  escuela?: string | null
  nivelEscolar?: string | null
  email?: string | null
  fechaNacimiento: string
  poseeCud?: boolean | null
  discapacidad?: string | null
  username: string
  /** true when a student record with the same document already existed and was updated/linked; false when created from scratch */
  existedPreviously?: boolean
}

/**
 * GET /api/v1/inscripciones/perfil — authenticated student's personal profile.
 */

export interface ResponsablePerfilDto {
  nombre: string
  apellido: string
  tipoDocumento?: string | null
  numeroDocumento?: string | null
  parentesco?: string | null
  domicilio?: string | null
  localidad?: string | null
  telefono?: string | null
  email?: string | null
  sexo?: string | null
  ocupacion?: string | null
}

export interface PerfilAlumnoResponse {
  nombre: string
  apellido: string
  tipoDocumento?: string | null
  numeroDocumento: string
  domicilio: string
  localidad: string
  telefono?: string | null
  escuela?: string | null
  nivelEscolar?: string | null
  email?: string | null
  fechaNacimiento: string
  poseeCud?: boolean | null
  discapacidad?: string | null
  sexo: string
  ocupacion?: string | null
  responsable?: ResponsablePerfilDto | null
  /** true when student data already existed in the system (e.g. linked from previous record); false when new */
  existedPreviously?: boolean
}
