"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { authService } from "@/lib/services/auth.service"
import * as tokenStorage from "@/lib/utils/token-storage"
import type { AuthProfile } from "@/lib/auth.types"

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
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string; wasLinked?: boolean }>
  logout: () => void
  updateProfile: (data: Partial<UserProfile>) => void
}

interface RegisterData {
  email: string
  password: string
  dni: string
  nombre: string
  apellido: string
  fechaNacimiento: string
  domicilio: string
  telefono: string
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined)

const REFRESH_INTERVAL_MS = 14 * 60 * 1000 // 14 minutes

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

// Simulated existing students (used only by register flow; login uses real API)
const EXISTING_STUDENTS = [
  { dni: "45123456", nombre: "María", apellido: "González", fechaNacimiento: "2010-05-15", domicilio: "Calle San Martín 123", telefono: "3424567890" },
  { dni: "42987654", nombre: "Juan", apellido: "Pérez", fechaNacimiento: "2008-11-22", domicilio: "Av. Rivadavia 456", telefono: "3426789012" },
  { dni: "38654321", nombre: "Laura", apellido: "Rodríguez", fechaNacimiento: "1995-03-10", domicilio: "Belgrano 789", telefono: "3421234567" },
]

const REGISTERED_USERS: Array<{ email: string; password: string; profile: UserProfile }> = []

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const checkAuth = useCallback(async () => {
    const accessToken = tokenStorage.getAccessToken()
    if (!accessToken || tokenStorage.isTokenExpired(accessToken)) {
      setUser(null)
      setIsLoading(false)
      return
    }
    try {
      const profile = await authService.getProfile()
      setUser(authProfileToUserProfile(profile))
      if (typeof window !== "undefined") {
        localStorage.setItem("liceo_student_user", JSON.stringify(authProfileToUserProfile(profile)))
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
      const profile = await authService.getProfile()
      const mapped = authProfileToUserProfile(profile)
      setUser(mapped)
      if (typeof window !== "undefined") {
        localStorage.setItem("liceo_student_user", JSON.stringify(mapped))
      }
      setupAutoRefresh()
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Credenciales incorrectas"
      return { success: false, error: message }
    }
  }, [setupAutoRefresh])

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string; wasLinked?: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    if (REGISTERED_USERS.find(u => u.email === data.email)) {
      return { success: false, error: "Este email ya está registrado. Intentá iniciar sesión." }
    }
    if (REGISTERED_USERS.find(u => u.profile.dni === data.dni)) {
      return { success: false, error: "Este DNI ya tiene una cuenta asociada. Intentá iniciar sesión." }
    }
    const existingStudent = EXISTING_STUDENTS.find(s => s.dni === data.dni)
    let wasLinked = false
    let profileData: UserProfile
    if (existingStudent) {
      if (existingStudent.nombre.toLowerCase() !== data.nombre.toLowerCase() ||
          existingStudent.apellido.toLowerCase() !== data.apellido.toLowerCase()) {
        return { success: false, error: "Los datos ingresados no coinciden con los registros existentes para este DNI. Verificá nombre y apellido." }
      }
      const fechaNac = new Date(existingStudent.fechaNacimiento)
      const hoy = new Date()
      let edad = hoy.getFullYear() - fechaNac.getFullYear()
      const mes = hoy.getMonth() - fechaNac.getMonth()
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) edad--
      profileData = {
        id: `STU-${Date.now()}`,
        email: data.email,
        dni: existingStudent.dni,
        nombre: existingStudent.nombre,
        apellido: existingStudent.apellido,
        fechaNacimiento: existingStudent.fechaNacimiento,
        domicilio: existingStudent.domicilio,
        telefono: existingStudent.telefono,
        esMenor: edad < 18,
        existiaEnSistema: true,
        createdAt: new Date().toISOString(),
      }
      wasLinked = true
    } else {
      const fechaNac = new Date(data.fechaNacimiento)
      const hoy = new Date()
      let edad = hoy.getFullYear() - fechaNac.getFullYear()
      const mes = hoy.getMonth() - fechaNac.getMonth()
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) edad--
      profileData = {
        id: `STU-${Date.now()}`,
        email: data.email,
        dni: data.dni,
        nombre: data.nombre,
        apellido: data.apellido,
        fechaNacimiento: data.fechaNacimiento,
        domicilio: data.domicilio,
        telefono: data.telefono,
        esMenor: edad < 18,
        existiaEnSistema: false,
        createdAt: new Date().toISOString(),
      }
    }
    REGISTERED_USERS.push({ email: data.email, password: data.password, profile: profileData })
    setUser(profileData)
    if (typeof window !== "undefined") {
      localStorage.setItem("liceo_student_user", JSON.stringify(profileData))
    }
    return { success: true, wasLinked }
  }, [])

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
      const idx = REGISTERED_USERS.findIndex(u => u.profile.id === prev.id)
      if (idx !== -1) REGISTERED_USERS[idx].profile = updated
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
