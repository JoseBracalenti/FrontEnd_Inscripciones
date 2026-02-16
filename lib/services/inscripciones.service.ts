import { apiClient } from "@/lib/api-client"
import type {
  AltaAlumnoRequest,
  AlumnoResponse,
  CursoDisponibleDto,
  MatriculaRequest,
  MatriculaResponse,
  PerfilAlumnoResponse,
} from "@/lib/inscripciones.types"

export const inscripcionesService = {
  /**
   * POST /api/v1/inscripciones/alumnos — register new student (no auth).
   * 201: AlumnoResponse; 400/409: throws with message from body.
   */
  async registerAlumno(payload: AltaAlumnoRequest): Promise<AlumnoResponse> {
    return apiClient.post<AlumnoResponse>("/api/v1/inscripciones/alumnos", {
      body: payload,
      skipAuth: true,
    })
  },

  /**
   * GET /api/v1/inscripciones/perfil — authenticated student's personal profile.
   * 403 when user is not linked to an alumno.
   */
  async getPerfil(): Promise<PerfilAlumnoResponse> {
    return apiClient.get<PerfilAlumnoResponse>("/api/v1/inscripciones/perfil")
  },

  /**
   * GET /api/v1/inscripciones/cursos-disponibles?anio=<number>
   * Returns courses and divisions available for the authenticated student (filtered by age).
   */
  async getCursosDisponibles(anio: number): Promise<CursoDisponibleDto[]> {
    return apiClient.get<CursoDisponibleDto[]>(
      `/api/v1/inscripciones/cursos-disponibles?anio=${encodeURIComponent(anio)}`
    )
  },

  /**
   * POST /api/v1/inscripciones/matricular — enroll authenticated student in a division.
   * 201: MatriculaResponse or body with message + inscripcionId when cuotas pending.
   */
  async matricular(payload: MatriculaRequest): Promise<MatriculaResponse> {
    return apiClient.post<MatriculaResponse>("/api/v1/inscripciones/matricular", {
      body: payload,
    })
  },
}
