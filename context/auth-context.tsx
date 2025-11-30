// SISTEMA DE RUTEO LOGÍSTICO - AUTH CONTEXT
// Contexto centralizado para gestionar la autenticación de usuarios
// Soporta roles: admin y conductor

"use client"

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// Tipos de usuario disponibles
export type UserRole = "admin" | "conductor"

// Interfaz de usuario autenticado
export interface AuthUser {
  id: string
  username: string
  role: UserRole
}

// Interfaz del contexto de autenticación
interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}

// Crear contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Proveedor de autenticación
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // MOCK DATA: Credenciales de prueba (simulan una base de datos)
  const MOCK_USERS: Record<string, { password: string; role: UserRole; id: string }> = {
    admin: { password: "admin", role: "admin", id: "admin-001" },
    conductor: { password: "conductor", role: "conductor", id: "conductor-001" },
  }

  // Función de login con validación
  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockUser = MOCK_USERS[username]

      if (!mockUser || mockUser.password !== password) {
        throw new Error("Credenciales inválidas")
      }

      // Establecer usuario autenticado
      setUser({
        id: mockUser.id,
        username,
        role: mockUser.role,
      })

      // Guardar en localStorage para persistencia
      localStorage.setItem("auth_user", JSON.stringify({ id: mockUser.id, username, role: mockUser.role }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Función de logout
  const logout = useCallback(() => {
    setUser(null)
    setError(null)
    localStorage.removeItem("auth_user")
  }, [])

  // Verificar si hay usuario en localStorage al cargar
  React.useEffect(() => {
    const storedUser = localStorage.getItem("auth_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("auth_user")
      }
    }
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    login,
    logout,
    isLoading,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider")
  }
  return context
}
