// SISTEMA DE RUTEO LOGÍSTICO - ADMIN HEADER
// Encabezado de navegación con opciones de usuario y logout

"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AdminHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  // MANEJO: Logout del usuario
  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* LOGO: Nombre de la aplicación */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold">SRL</span>
          </div>
          <span className="text-lg font-bold text-foreground">Sistema Logístico</span>
        </div>

        {/* INFO Y ACCIONES: Información del usuario y opciones */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user?.username}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role === "admin" ? "Administrador" : "Conductor"}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  )
}
