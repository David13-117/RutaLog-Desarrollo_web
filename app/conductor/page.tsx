// SISTEMA DE RUTEO LOGÍSTICO - CONDUCTOR DASHBOARD
// Panel para conductores
// Visualiza rutas asignadas, paquetes a entregar y estado de entregas

"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useLogistics } from "@/context/logistics-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import AdminHeader from "@/components/admin/admin-header"
import ConductorAssignedRoutes from "@/components/conductor/conductor-assigned-routes"
import ConductorAssignedPackages from "@/components/conductor/conductor-assigned-packages"

export default function ConductorDashboard() {
  const { user } = useAuth()
  const { state, fetchPackages, fetchRoutes } = useLogistics()
  const [activeTab, setActiveTab] = useState<"routes" | "packages">("routes")

  // EFFECT: Cargar datos al montar el componente
  useEffect(() => {
    fetchPackages()
    fetchRoutes()
  }, [fetchPackages, fetchRoutes])

  // FILTER: Obtener rutas asignadas al conductor actual
  const assignedRoutes = state.routes.filter((r) => r.assignedDriver === user?.id)

  // FILTER: Obtener paquetes asignados al conductor actual
  const assignedPackages = state.packages.filter((p) => p.assignedTo === user?.id)

  return (
    <ProtectedRoute requiredRole="conductor">
      <div className="min-h-screen bg-background">
        {/* HEADER: Encabezado con navegación */}
        <AdminHeader />

        {/* MAIN CONTENT: Contenedor principal */}
        <main className="container mx-auto px-4 py-6">
          {/* TITULO: Bienvenida conductor */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Panel del Conductor</h1>
            <p className="text-muted-foreground">
              Bienvenido, {user?.username}. Aquí puedes ver tus rutas y entregas asignadas.
            </p>
          </div>

          {/* TABS: Navegación entre rutas y paquetes */}
          <div className="flex gap-2 mb-6 border-b border-border">
            <Button
              variant={activeTab === "routes" ? "default" : "ghost"}
              onClick={() => setActiveTab("routes")}
              className="rounded-b-none"
            >
              Mis Rutas ({assignedRoutes.length})
            </Button>
            <Button
              variant={activeTab === "packages" ? "default" : "ghost"}
              onClick={() => setActiveTab("packages")}
              className="rounded-b-none"
            >
              Mis Entregas ({assignedPackages.length})
            </Button>
          </div>

          {/* CONTENT: Contenido dinámico según tab activo */}
          {state.isLoading ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Cargando datos...</p>
            </Card>
          ) : state.error ? (
            <Card className="p-4 bg-destructive/10 border border-destructive">
              <p className="text-destructive">{state.error}</p>
            </Card>
          ) : (
            <>
              {activeTab === "routes" && <ConductorAssignedRoutes routes={assignedRoutes} />}
              {activeTab === "packages" && <ConductorAssignedPackages packages={assignedPackages} />}
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
