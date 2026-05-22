import type {
  AsistenciaDto,
  InscripcionResumenDto,
  LecturaDto,
  MiHistoriaAcademicaResponse,
  UpdateAsistenciaBody,
} from "@/lib/academico.types"

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const MOCK_INSCRIPCIONES: InscripcionResumenDto[] = [
  {
    idInscripcionAcademica: 1001,
    idCurso: 1,
    descripcionCurso: "Piano – Nivel Inicial",
    idDivisionHorario: 101,
    letraDivision: "A",
    anio: 2026,
    estadoInscripcion: "ACTIVA",
    horarios: "Lunes y miércoles 10:00–11:00",
  },
]

const MOCK_HISTORIA: MiHistoriaAcademicaResponse = {
  estudiante: { nombre: "María", apellido: "García" },
  inscripciones: [
    {
      idInscripcionAcademica: 1001,
      idCurso: 1,
      descripcionCurso: "Piano – Nivel Inicial",
      idDivisionHorario: 101,
      letraDivision: "A",
      anio: 2026,
      estadoInscripcion: "ACTIVA",
      estadoPromocion: "EN_CURSO",
      calificaciones: [],
      actas: [],
    },
    {
      idInscripcionAcademica: 900,
      idCurso: 1,
      descripcionCurso: "Piano – Nivel Inicial",
      idDivisionHorario: 99,
      letraDivision: "B",
      anio: 2025,
      estadoInscripcion: "FINALIZADA",
      estadoPromocion: "PROMOVIDO",
      calificaciones: [{ periodo: "1er cuatrimestre", nota: 8 }, { periodo: "2do cuatrimestre", nota: 9 }],
      actas: [],
    },
  ],
}

const MOCK_LECTURAS: LecturaDto[] = [
  { idClase: 1, idDivisionHorario: 101, fecha: "2026-03-10", cantidadAsistencias: 8, divisionLetra: "A" },
  { idClase: 2, idDivisionHorario: 101, fecha: "2026-03-12", cantidadAsistencias: 7, divisionLetra: "A" },
  { idClase: 3, idDivisionHorario: 101, fecha: "2026-03-17", cantidadAsistencias: 9, divisionLetra: "A" },
  { idClase: 4, idDivisionHorario: 101, fecha: "2026-03-19", cantidadAsistencias: 8, divisionLetra: "A" },
  { idClase: 5, idDivisionHorario: 101, fecha: "2026-03-24", cantidadAsistencias: 6, divisionLetra: "A" },
  { idClase: 6, idDivisionHorario: 101, fecha: "2026-03-26", cantidadAsistencias: 8, divisionLetra: "A" },
  { idClase: 7, idDivisionHorario: 101, fecha: "2026-04-02", cantidadAsistencias: 9, divisionLetra: "A" },
  { idClase: 8, idDivisionHorario: 101, fecha: "2026-04-07", cantidadAsistencias: 8, divisionLetra: "A" },
  { idClase: 9, idDivisionHorario: 101, fecha: "2026-04-09", cantidadAsistencias: 7, divisionLetra: "A" },
  { idClase: 10, idDivisionHorario: 101, fecha: "2026-04-14", cantidadAsistencias: 8, divisionLetra: "A" },
  { idClase: 11, idDivisionHorario: 101, fecha: "2026-04-16", cantidadAsistencias: 9, divisionLetra: "A" },
  { idClase: 12, idDivisionHorario: 101, fecha: "2026-04-28", cantidadAsistencias: 8, divisionLetra: "A" },
  { idClase: 13, idDivisionHorario: 101, fecha: "2026-04-30", cantidadAsistencias: 7, divisionLetra: "A" },
  { idClase: 14, idDivisionHorario: 101, fecha: "2026-05-05", cantidadAsistencias: 8, divisionLetra: "A" },
  { idClase: 15, idDivisionHorario: 101, fecha: "2026-05-07", cantidadAsistencias: 9, divisionLetra: "A" },
  { idClase: 16, idDivisionHorario: 101, fecha: "2026-05-12", cantidadAsistencias: 8, divisionLetra: "A" },
  { idClase: 17, idDivisionHorario: 101, fecha: "2026-05-14", cantidadAsistencias: 9, divisionLetra: "A" },
  { idClase: 18, idDivisionHorario: 101, fecha: "2026-05-19", cantidadAsistencias: 7, divisionLetra: "A" },
]

// Asistencia para inscripción 1001 — mezcla de presente/ausente, última clase editable (24h)
const MOCK_ASISTENCIA: AsistenciaDto[] = MOCK_LECTURAS.map((l, i) => ({
  idAsistencia: 2000 + i,
  idClase: l.idClase,
  fecha: l.fecha,
  presente: i % 5 !== 3, // ausente en la clase 4, 9, 14
  justificada: i % 5 === 3 && i < 10,
  observaciones: null,
  puedeEditar: i === MOCK_LECTURAS.length - 1, // solo la última es editable
}))

export const academicoServiceMock = {
  async getMisInscripciones(_anio?: number): Promise<InscripcionResumenDto[]> {
    await delay(350)
    return MOCK_INSCRIPCIONES
  },

  async getMiHistoriaAcademica(_anio?: number, _idCurso?: number): Promise<MiHistoriaAcademicaResponse> {
    await delay(400)
    return MOCK_HISTORIA
  },

  async getLecturasByInscripcion(_idInscripcionAcademica: number): Promise<LecturaDto[]> {
    await delay(300)
    return MOCK_LECTURAS
  },

  async getMisLecturas(_anio?: number): Promise<LecturaDto[]> {
    await delay(300)
    return MOCK_LECTURAS
  },

  async getAsistenciaByInscripcion(_idInscripcionAcademica: number): Promise<AsistenciaDto[]> {
    await delay(300)
    return [...MOCK_ASISTENCIA]
  },

  async updateAsistencia(_idAsistencia: number, _body: UpdateAsistenciaBody): Promise<void> {
    await delay(300)
  },
}
