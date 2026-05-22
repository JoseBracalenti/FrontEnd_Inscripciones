import { apiClient } from "@/lib/api-client"
import type {
  AdminInscripcionDto,
  AlumnoPromovidoDto,
  AdminCursoDto,
  DashboardStatsDto,
  NuevaInscripcionAdminRequest,
  ReinscripcionAdminRequest,
} from "@/lib/admin.types"
import { adminServiceMock } from "@/lib/mocks/admin.mock"

const PREFIX = "/api/v1/admin"

const adminServiceReal = {
  async getDashboardStats(): Promise<DashboardStatsDto> {
    return apiClient.get<DashboardStatsDto>(`${PREFIX}/dashboard`)
  },

  async getInscripciones(): Promise<AdminInscripcionDto[]> {
    return apiClient.get<AdminInscripcionDto[]>(`${PREFIX}/inscripciones`)
  },

  async getAlumnosPromovidos(): Promise<AlumnoPromovidoDto[]> {
    return apiClient.get<AlumnoPromovidoDto[]>(`${PREFIX}/alumnos-promovidos`)
  },

  async getCursos(): Promise<AdminCursoDto[]> {
    return apiClient.get<AdminCursoDto[]>(`${PREFIX}/cursos`)
  },

  async crearInscripcion(data: NuevaInscripcionAdminRequest): Promise<void> {
    return apiClient.post<void>(`${PREFIX}/inscripciones`, { body: data })
  },

  async reinscribirAlumno(data: ReinscripcionAdminRequest): Promise<void> {
    return apiClient.post<void>(`${PREFIX}/reinscripciones`, { body: data })
  },

  async confirmarPago(id: number): Promise<void> {
    return apiClient.patch<void>(`${PREFIX}/inscripciones/${id}/confirmar-pago`)
  },

  async cancelarInscripcion(id: number): Promise<void> {
    return apiClient.patch<void>(`${PREFIX}/inscripciones/${id}/cancelar`)
  },
}

export const adminService =
  process.env.NEXT_PUBLIC_USE_MOCKS === "true" ? adminServiceMock : adminServiceReal
