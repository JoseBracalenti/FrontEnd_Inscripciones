import type {
  AltaAlumnoRequest,
  AlumnoResponse,
  CursoDisponibleDto,
  MatriculaRequest,
  MatriculaResponse,
  PerfilAlumnoResponse,
} from "@/lib/inscripciones.types"

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const MOCK_PERFIL: PerfilAlumnoResponse = {
  nombre: "María",
  apellido: "García",
  tipoDocumento: "DNI",
  numeroDocumento: "38.456.789",
  domicilio: "Av. Corrientes 1234",
  localidad: "Buenos Aires",
  telefono: "11-4567-8901",
  escuela: "Colegio Nacional Buenos Aires",
  nivelEscolar: "Secundario completo",
  email: "maria.garcia@ejemplo.com",
  fechaNacimiento: "2000-03-15",
  poseeCud: false,
  sexo: "F",
  ocupacion: "Estudiante",
  responsable: null,
  existedPreviously: false,
}

const MOCK_CURSOS: CursoDisponibleDto[] = [
  {
    id: 1,
    descripcion: "Piano – Nivel Inicial",
    edadMinima: 6,
    edadMaxima: 99,
    carreraId: 1,
    carreraNombre: "Piano",
    montoMatricula: 15000,
    divisiones: [
      {
        id: 101,
        letra: "A",
        horarios: "Lunes y miércoles 10:00–11:00",
        cupo: 10,
        cantidadInscriptos: 4,
        instrumentoDescripcion: null,
      },
      {
        id: 102,
        letra: "B",
        horarios: "Martes y jueves 18:00–19:00",
        cupo: 10,
        cantidadInscriptos: 9,
        instrumentoDescripcion: null,
      },
    ],
  },
  {
    id: 2,
    descripcion: "Guitarra – Nivel Inicial",
    edadMinima: 8,
    edadMaxima: 99,
    carreraId: 2,
    carreraNombre: "Guitarra",
    montoMatricula: 12000,
    divisiones: [
      {
        id: 201,
        letra: "A",
        horarios: "Sábados 09:00–10:30",
        cupo: 12,
        cantidadInscriptos: 6,
        instrumentoDescripcion: "Guitarra clásica",
      },
    ],
  },
  {
    id: 3,
    descripcion: "Coro – Nivel Inicial",
    edadMinima: 6,
    edadMaxima: 99,
    carreraId: 3,
    carreraNombre: "Coro",
    montoMatricula: 8000,
    divisiones: [
      {
        id: 301,
        letra: "A",
        horarios: "Viernes 17:00–18:30",
        cupo: 20,
        cantidadInscriptos: 12,
        instrumentoDescripcion: null,
      },
    ],
  },
  {
    id: 4,
    descripcion: "Violín – Nivel Inicial",
    edadMinima: 6,
    edadMaxima: 99,
    carreraId: 4,
    carreraNombre: "Violín",
    montoMatricula: 18000,
    divisiones: [
      {
        id: 401,
        letra: "A",
        horarios: "Lunes 15:00–16:00",
        cupo: 8,
        cantidadInscriptos: 8,
        instrumentoDescripcion: "Violín 4/4",
      },
    ],
  },
]

export const inscripcionesServiceMock = {
  async registerAlumno(payload: AltaAlumnoRequest): Promise<AlumnoResponse> {
    await delay(600)
    return {
      id: 42,
      nombre: payload.alumno.nombre,
      apellido: payload.alumno.apellido,
      tipoDocumento: payload.alumno.tipoDocumento ?? "DNI",
      numeroDocumento: payload.alumno.numeroDocumento,
      domicilio: payload.alumno.domicilio,
      localidad: payload.alumno.localidad,
      telefono: payload.alumno.telefono ?? null,
      escuela: payload.alumno.escuela ?? null,
      nivelEscolar: payload.alumno.nivelEscolar ?? null,
      email: payload.alumno.email ?? null,
      fechaNacimiento: payload.alumno.fechaNacimiento,
      poseeCud: payload.alumno.poseeCud ?? false,
      discapacidad: payload.alumno.discapacidad ?? null,
      username: payload.username,
      existedPreviously: false,
    }
  },

  async getPerfil(): Promise<PerfilAlumnoResponse> {
    await delay(300)
    return MOCK_PERFIL
  },

  async getCursosDisponibles(_anio: number): Promise<CursoDisponibleDto[]> {
    await delay(400)
    return MOCK_CURSOS
  },

  async matricular(payload: MatriculaRequest): Promise<MatriculaResponse> {
    await delay(500)
    return {
      idInscripcionAcademica: 1001,
      iduInscripcionPublic: 2001,
      idDivisionHorario: payload.idDivisionHorario,
      idCurso: MOCK_CURSOS.find((c) =>
        c.divisiones.some((d) => d.id === payload.idDivisionHorario)
      )?.id ?? 1,
      anio: new Date().getFullYear(),
    }
  },
}
