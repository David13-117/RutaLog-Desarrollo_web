// SISTEMA DE RUTEO LOGÍSTICO - PROTECTED ROUTE
// Componente HOC para proteger rutas requiriendo autenticación
// Redirige a login si no está autenticado

"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "conductor"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (requiredRole && user?.role !== requiredRole) {
      // Redirigir al dashboard correspondiente si intenta acceder a ruta no autorizada
      router.push(user?.role === "admin" ? "/admin" : "/conductor")
    }
  }, [isAuthenticated, user, requiredRole, router])

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}
