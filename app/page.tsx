// SISTEMA DE RUTEO LOGÍSTICO - HOME/MAIN DASHBOARD
// Página principal que redirige según el rol del usuario
// Admin → Dashboard de gestión | Conductor → Dashboard de entregas

"use client"

import { useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // REDIRECCION: Enviar a login si no está autenticado
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // REDIRECCION: Enviar al dashboard correspondiente según el rol
    if (user?.role === "admin") {
      router.push("/admin")
    } else if (user?.role === "conductor") {
      router.push("/conductor")
    }
  }, [isAuthenticated, user, router])

  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Redirigiendo...</p>
      </div>
    </ProtectedRoute>
  )
}
