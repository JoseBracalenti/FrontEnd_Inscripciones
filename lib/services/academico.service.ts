import { apiClient } from "@/lib/api-client"
import type {
  AsistenciaDto,
  InscripcionResumenDto,
  LecturaDto,
  MiHistoriaAcademicaResponse,
  UpdateAsistenciaBody,
} from "@/lib/academico.types"
import { academicoServiceMock } from "@/lib/mocks/academico.mock"

const PREFIX = "/api/v1/academico"

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value))
    }
  }
  const q = search.toString()
  return q ? `?${q}` : ""
}

const academicoServiceReal = {
  /**
   * GET /api/v1/academico/mis-inscripciones?anio=
   * Omit anio or leave empty to use current year.
   */
  async getMisInscripciones(anio?: number): Promise<InscripcionResumenDto[]> {
    const query = buildQuery({ anio })
    return apiClient.get<InscripcionResumenDto[]>(`${PREFIX}/mis-inscripciones${query}`)
  },

  /**
   * GET /api/v1/academico/mi-historia-academica?anio=&idCurso=
   * Omit both for all years and courses.
   */
  async getMiHistoriaAcademica(anio?: number, idCurso?: number): Promise<MiHistoriaAcademicaResponse> {
    const query = buildQuery({ anio, idCurso })
    return apiClient.get<MiHistoriaAcademicaResponse>(`${PREFIX}/mi-historia-academica${query}`)
  },

  /**
   * GET /api/v1/academico/mis-inscripciones/{idInscripcionAcademica}/lecturas
   */
  async getLecturasByInscripcion(idInscripcionAcademica: number): Promise<LecturaDto[]> {
    return apiClient.get<LecturaDto[]>(
      `${PREFIX}/mis-inscripciones/${idInscripcionAcademica}/lecturas`
    )
  },

  /**
   * GET /api/v1/academico/mis-lecturas?anio=
   * Omit anio for current year.
   */
  async getMisLecturas(anio?: number): Promise<LecturaDto[]> {
    const query = buildQuery({ anio })
    return apiClient.get<LecturaDto[]>(`${PREFIX}/mis-lecturas${query}`)
  },

  /**
   * GET /api/v1/academico/mis-inscripciones/{idInscripcionAcademica}/asistencia
   */
  async getAsistenciaByInscripcion(idInscripcionAcademica: number): Promise<AsistenciaDto[]> {
    return apiClient.get<AsistenciaDto[]>(
      `${PREFIX}/mis-inscripciones/${idInscripcionAcademica}/asistencia`
    )
  },

  /**
   * PATCH /api/v1/academico/asistencia/{idAsistencia}
   * Allowed only if row belongs to current student and lecture date is within 24h.
   */
  async updateAsistencia(idAsistencia: number, body: UpdateAsistenciaBody): Promise<void> {
    return apiClient.patch<void>(`${PREFIX}/asistencia/${idAsistencia}`, { body })
  },
}

export const academicoService =
  process.env.NEXT_PUBLIC_USE_MOCKS === "true" ? academicoServiceMock : academicoServiceReal
