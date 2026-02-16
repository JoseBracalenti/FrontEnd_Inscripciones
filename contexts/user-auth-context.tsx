"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { authService } from "@/lib/services/auth.service"
import { inscripcionesService } from "@/lib/services/inscripciones.service"
import * as tokenStorage from "@/lib/utils/token-storage"
import type { AuthProfile } from "@/lib/auth.types"
import type {
  AltaAlumnoRequest,
  DatosResponsableDto,
  PerfilAlumnoResponse,
} from "@/lib/inscripciones.types"

export interface UserProfile {
  id: string
  email: string
  dni: string
  nombre: string
  apellido: string
  fechaNacimiento: string
  domicilio: string
  telefono: string
  // Datos de tutor si es menor
  esMenor: boolean
  tutorNombre?: string
  tutorApellido?: string
  tutorDni?: string
  tutorRelacion?: string
  tutorTelefono?: string
  tutorEmail?: string
  // Estado
  existiaEnSistema: boolean
  createdAt: string
}

interface UserAuthContextType {
  user: UserProfile | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<UserProfile>) => void
}

export interface RegisterData {
  username: string
  password: string
  // alumno (DatosAlumnoDto)
  nombre: string
  apellido: string
  numeroDocumento: string
  tipoDocumento?: string
  domicilio: string
  localidad: string
  telefono?: string
  email?: string
  fechaNacimiento: string
  sexo: string
  escuela?: string
  nivelEscolar?: string
  poseeCud?: boolean
  discapacidad?: string
  ocupacion?: string
  // responsable (optional; required for minors)
  responsableNombre?: string
  responsableApellido?: string
  responsableParentesco?: string
  responsableTipoDocumento?: string
  responsableNumeroDocumento?: string
  responsableDomicilio?: string
  responsableLocalidad?: string
  responsableTelefono?: string
  responsableEmail?: string
  responsableSexo?: string
  responsableOcupacion?: string
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined)

const REFRESH_INTERVAL_MS = 14 * 60 * 1000 // 14 minutes

function isMinor(fechaNacimiento: string): boolean {
  if (!fechaNacimiento) return false
  const nac = new Date(fechaNacimiento)
  const hoy = new Date()
  let edad = hoy.getFullYear() - nac.getFullYear()
  const mes = hoy.getMonth() - nac.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--
  return edad < 18
}

function authProfileToUserProfile(profile: AuthProfile): UserProfile {
  return {
    id: profile.id,
    email: profile.email,
    nombre: profile.username || profile.email,
    apellido: "",
    dni: "",
    fechaNacimiento: "",
    domicilio: "",
    telefono: "",
    esMenor: false,
    existiaEnSistema: false,
    createdAt: new Date().toISOString(),
  }
}

function perfilAlumnoToUserProfile(authId: string, perfil: PerfilAlumnoResponse): UserProfile {
  const r = perfil.responsable
  const esMenor = isMinor(perfil.fechaNacimiento)
  return {
    id: authId,
    email: perfil.email ?? "",
    dni: perfil.numeroDocumento ?? "",
    nombre: perfil.nombre,
    apellido: perfil.apellido,
    fechaNacimiento: perfil.fechaNacimiento ?? "",
    domicilio: perfil.domicilio ?? "",
    telefono: perfil.telefono ?? "",
    esMenor,
    tutorNombre: r?.nombre,
    tutorApellido: r?.apellido,
    tutorDni: r?.numeroDocumento ?? undefined,
    tutorRelacion: r?.parentesco ?? undefined,
    tutorTelefono: r?.telefono ?? undefined,
    tutorEmail: r?.email ?? undefined,
    existiaEnSistema: perfil.existedPreviously === true,
    createdAt: new Date().toISOString(),
  }
}

async function fetchFullUserProfile(authProfile: AuthProfile): Promise<UserProfile> {
  try {
    const perfil = await inscripcionesService.getPerfil()
    return perfilAlumnoToUserProfile(authProfile.id, perfil)
  } catch {
    return authProfileToUserProfile(authProfile)
  }
}

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const checkAuth = useCallback(async () => {
    const accessToken = tokenStorage.getAccessToken()
    if (!accessToken || tokenStorage.isTokenExpired(accessToken)) {
      tokenStorage.clearTokens()
      setUser(null)
      setIsLoading(false)
      return
    }
    try {
      const authProfile = await authService.getProfile()
      const fullProfile = await fetchFullUserProfile(authProfile)
      setUser(fullProfile)
      if (typeof window !== "undefined") {
        localStorage.setItem("liceo_student_user", JSON.stringify(fullProfile))
      }
    } catch {
      tokenStorage.clearTokens()
      setUser(null)
      if (typeof window !== "undefined") localStorage.removeItem("liceo_student_user")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const setupAutoRefresh = useCallback(() => {
    if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current)
    refreshIntervalRef.current = setInterval(async () => {
      const accessToken = tokenStorage.getAccessToken()
      const refresh = tokenStorage.getRefreshToken()
      if (!accessToken || !refresh) return
      if (!tokenStorage.isTokenExpired(accessToken)) return
      try {
        await authService.refreshToken(refresh)
        await checkAuth()
      } catch {
        tokenStorage.clearTokens()
        setUser(null)
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current)
          refreshIntervalRef.current = null
        }
      }
    }, REFRESH_INTERVAL_MS)
  }, [checkAuth])

  useEffect(() => {
    checkAuth().then(() => {
      const accessToken = tokenStorage.getAccessToken()
      if (accessToken && !tokenStorage.isTokenExpired(accessToken)) {
        setupAutoRefresh()
      }
    })
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
        refreshIntervalRef.current = null
      }
    }
  }, [checkAuth, setupAutoRefresh])

  const login = useCallback(async (emailOrUsername: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await authService.login(emailOrUsername, password)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Credenciales incorrectas"
      return { success: false, error: message }
    }
    try {
      const authProfile = await authService.getProfile()
      const fullProfile = await fetchFullUserProfile(authProfile)
      setUser(fullProfile)
      if (typeof window !== "undefined") {
        localStorage.setItem("liceo_student_user", JSON.stringify(fullProfile))
      }
      setupAutoRefresh()
      return { success: true }
    } catch {
      tokenStorage.clearTokens()
      return { success: false, error: "Sesión iniciada pero no se pudo cargar tu perfil. Intentá de nuevo." }
    }
  }, [setupAutoRefresh])

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    const alumno = {
      nombre: data.nombre,
      apellido: data.apellido,
      numeroDocumento: data.numeroDocumento,
      domicilio: data.domicilio,
      localidad: data.localidad,
      fechaNacimiento: data.fechaNacimiento,
      sexo: data.sexo,
      ...(data.tipoDocumento && { tipoDocumento: data.tipoDocumento }),
      ...(data.telefono != null && data.telefono !== "" && { telefono: data.telefono }),
      ...(data.email != null && data.email !== "" && { email: data.email }),
      ...(data.escuela != null && data.escuela !== "" && { escuela: data.escuela }),
      ...(data.nivelEscolar != null && data.nivelEscolar !== "" && { nivelEscolar: data.nivelEscolar }),
      ...(data.poseeCud != null && { poseeCud: data.poseeCud }),
      ...(data.discapacidad != null && data.discapacidad !== "" && { discapacidad: data.discapacidad }),
      ...(data.ocupacion != null && data.ocupacion !== "" && { ocupacion: data.ocupacion }),
    }
    let responsable: DatosResponsableDto | undefined
    if (
      data.responsableNombre != null && data.responsableNombre.trim() !== "" &&
      data.responsableApellido != null && data.responsableApellido.trim() !== ""
    ) {
      responsable = {
        nombre: data.responsableNombre.trim(),
        apellido: data.responsableApellido.trim(),
        ...(data.responsableParentesco != null && data.responsableParentesco !== "" && { parentesco: data.responsableParentesco }),
        ...(data.responsableTipoDocumento != null && data.responsableTipoDocumento !== "" && { tipoDocumento: data.responsableTipoDocumento }),
        ...(data.responsableNumeroDocumento != null && data.responsableNumeroDocumento !== "" && { numeroDocumento: data.responsableNumeroDocumento }),
        ...(data.responsableDomicilio != null && data.responsableDomicilio !== "" && { domicilio: data.responsableDomicilio }),
        ...(data.responsableLocalidad != null && data.responsableLocalidad !== "" && { localidad: data.responsableLocalidad }),
        ...(data.responsableTelefono != null && data.responsableTelefono !== "" && { telefono: data.responsableTelefono }),
        ...(data.responsableEmail != null && data.responsableEmail !== "" && { email: data.responsableEmail }),
        ...(data.responsableSexo != null && data.responsableSexo !== "" && { sexo: data.responsableSexo }),
        ...(data.responsableOcupacion != null && data.responsableOcupacion !== "" && { ocupacion: data.responsableOcupacion }),
      }
    }
    const payload: AltaAlumnoRequest = {
      alumno,
      username: data.username,
      password: data.password,
      ...(responsable && { responsable }),
    }
    try {
      const response = await inscripcionesService.registerAlumno(payload)
      try {
        await authService.login(response.username, data.password)
        const authProfile = await authService.getProfile()
        const fullProfile = await fetchFullUserProfile(authProfile)
        if (response.existedPreviously === true) {
          fullProfile.existiaEnSistema = true
        }
        setUser(fullProfile)
        if (typeof window !== "undefined") {
          localStorage.setItem("liceo_student_user", JSON.stringify(fullProfile))
        }
        setupAutoRefresh()
        return { success: true }
      } catch {
        return {
          success: false,
          error: "Cuenta creada pero no se pudo iniciar sesión. Intentá iniciar sesión con tu usuario y contraseña.",
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al crear la cuenta"
      return { success: false, error: message }
    }
  }, [setupAutoRefresh])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    if (typeof window !== "undefined") localStorage.removeItem("liceo_student_user")
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
      refreshIntervalRef.current = null
    }
  }, [])

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return null
      const updated = { ...prev, ...data }
      if (typeof window !== "undefined") {
        localStorage.setItem("liceo_student_user", JSON.stringify(updated))
      }
      return updated
    })
  }, [])

  return (
    <UserAuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </UserAuthContext.Provider>
  )
}

export function useUserAuth() {
  const context = useContext(UserAuthContext)
  if (context === undefined) {
    throw new Error("useUserAuth must be used within a UserAuthProvider")
  }
  return context
}
