/**
 * Types for /api/v1/academico student self-service API.
 * Student is always inferred from JWT; no student id is sent.
 */

export type EstadoInscripcion = "ACTIVA" | "FINALIZADA" | "ABANDONADA" | "SUSPENDIDA"

/** GET /api/v1/academico/mis-inscripciones?anio= */
export interface InscripcionResumenDto {
  idInscripcionAcademica: number
  idCurso: number
  descripcionCurso: string
  idDivisionHorario: number
  letraDivision: string
  anio: number
  estadoInscripcion: EstadoInscripcion
  /** Schedule for that division (e.g. days/times). */
  horarios?: string
}

/** GET /api/v1/academico/mis-inscripciones/{id}/lecturas */
/** GET /api/v1/academico/mis-lecturas?anio= (items include divisionLetra) */
export interface LecturaDto {
  idClase: number
  idDivisionHorario: number
  fecha: string
  cantidadAsistencias: number
  divisionLetra?: string | null
}

/** GET /api/v1/academico/mis-inscripciones/{id}/asistencia */
export interface AsistenciaDto {
  idAsistencia: number
  idClase?: number
  fecha?: string
  presente: boolean
  justificada: boolean
  observaciones?: string | null
  puedeEditar: boolean
}

/** PATCH /api/v1/academico/asistencia/{id} body */
export interface UpdateAsistenciaBody {
  presente?: boolean
  justificada?: boolean
  observaciones?: string
}

/** Promotion status per enrollment (null when cierre not yet calculated). */
export type EstadoPromocion =
  | "PROMOVIDO"
  | "DEBE_RENDIR_EXAMEN"
  | "RECURSA"
  | "EN_CURSO"

/** GET /api/v1/academico/mi-historia-academica - calificaciones / actas shape is backend-defined */
export interface CalificacionItem {
  [key: string]: unknown
}

export interface InscripcionHistoriaDto {
  idInscripcionAcademica?: number
  idCurso?: number
  descripcionCurso?: string
  idDivisionHorario?: number
  letraDivision?: string
  anio?: number
  estadoInscripcion?: string
  /** Promotion status: PROMOVIDO, DEBE_RENDIR_EXAMEN, RECURSA, EN_CURSO; null when no cierre yet. */
  estadoPromocion?: EstadoPromocion | null
  calificaciones?: CalificacionItem[]
  estadoAcademico?: string
  actas?: unknown[]
  [key: string]: unknown
}

export interface MiHistoriaAcademicaResponse {
  estudiante?: { nombre?: string; apellido?: string; [key: string]: unknown }
  inscripciones?: InscripcionHistoriaDto[]
  [key: string]: unknown
}
