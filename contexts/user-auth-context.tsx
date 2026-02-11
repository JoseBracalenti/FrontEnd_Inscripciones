"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

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

// Simulated existing students in the system (from previous enrollments)
const EXISTING_STUDENTS = [
  { 
    dni: "45123456", 
    nombre: "María", 
    apellido: "González", 
    fechaNacimiento: "2010-05-15",
    domicilio: "Calle San Martín 123",
    telefono: "3424567890"
  },
  { 
    dni: "42987654", 
    nombre: "Juan", 
    apellido: "Pérez", 
    fechaNacimiento: "2008-11-22",
    domicilio: "Av. Rivadavia 456",
    telefono: "3426789012"
  },
  { 
    dni: "38654321", 
    nombre: "Laura", 
    apellido: "Rodríguez", 
    fechaNacimiento: "1995-03-10",
    domicilio: "Belgrano 789",
    telefono: "3421234567"
  },
]

// Simulated registered users
const REGISTERED_USERS: Array<{ email: string; password: string; profile: UserProfile }> = []

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("liceo_student_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("liceo_student_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const foundUser = REGISTERED_USERS.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      setUser(foundUser.profile)
      localStorage.setItem("liceo_student_user", JSON.stringify(foundUser.profile))
      return { success: true }
    }
    
    return { success: false, error: "Email o contraseña incorrectos" }
  }, [])

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string; wasLinked?: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Check if email already registered
    if (REGISTERED_USERS.find(u => u.email === data.email)) {
      return { success: false, error: "Este email ya está registrado. Intentá iniciar sesión." }
    }
    
    // Check if DNI already has an account
    if (REGISTERED_USERS.find(u => u.profile.dni === data.dni)) {
      return { success: false, error: "Este DNI ya tiene una cuenta asociada. Intentá iniciar sesión." }
    }
    
    // Check if person exists in the system
    const existingStudent = EXISTING_STUDENTS.find(s => s.dni === data.dni)
    
    let wasLinked = false
    let profileData: UserProfile
    
    if (existingStudent) {
      // Link to existing student - verify name matches
      if (existingStudent.nombre.toLowerCase() !== data.nombre.toLowerCase() ||
          existingStudent.apellido.toLowerCase() !== data.apellido.toLowerCase()) {
        return { 
          success: false, 
          error: "Los datos ingresados no coinciden con los registros existentes para este DNI. Verificá nombre y apellido." 
        }
      }
      
      // Calculate if minor
      const fechaNac = new Date(existingStudent.fechaNacimiento)
      const hoy = new Date()
      let edad = hoy.getFullYear() - fechaNac.getFullYear()
      const mes = hoy.getMonth() - fechaNac.getMonth()
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--
      }
      
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
      // Create new student
      const fechaNac = new Date(data.fechaNacimiento)
      const hoy = new Date()
      let edad = hoy.getFullYear() - fechaNac.getFullYear()
      const mes = hoy.getMonth() - fechaNac.getMonth()
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--
      }
      
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
    
    REGISTERED_USERS.push({
      email: data.email,
      password: data.password,
      profile: profileData,
    })
    
    setUser(profileData)
    localStorage.setItem("liceo_student_user", JSON.stringify(profileData))
    
    return { success: true, wasLinked }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("liceo_student_user")
  }, [])

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return null
      const updated = { ...prev, ...data }
      localStorage.setItem("liceo_student_user", JSON.stringify(updated))
      
      // Update in registered users
      const userIndex = REGISTERED_USERS.findIndex(u => u.profile.id === prev.id)
      if (userIndex !== -1) {
        REGISTERED_USERS[userIndex].profile = updated
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
