// SISTEMA DE RUTEO LOGÍSTICO - ADMIN DASHBOARD
// Panel de gestión para administradores
// Gestión de paquetes, rutas y monitoreo en tiempo real

"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useLogistics } from "@/context/logistics-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import AdminHeader from "@/components/admin/admin-header"
import PackagesList from "@/components/admin/packages-list"
import RoutesList from "@/components/admin/routes-list"
import StatsOverview from "@/components/admin/stats-overview"

export default function AdminDashboard() {
  const { user } = useAuth()
  const { state, fetchPackages, fetchRoutes } = useLogistics()
  const [activeTab, setActiveTab] = useState<"packages" | "routes" | "stats">("packages")

  // EFFECT: Cargar datos al montar el componente
  useEffect(() => {
    fetchPackages()
    fetchRoutes()
  }, [fetchPackages, fetchRoutes])

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        {/* HEADER: Encabezado con navegación */}
        <AdminHeader />

        {/* MAIN CONTENT: Contenedor principal */}
        <main className="container mx-auto px-4 py-6">
          {/* TITULO: Bienvenida */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Panel de Administración</h1>
            <p className="text-muted-foreground">Bienvenido, {user?.username}. Gestiona rutas, paquetes y entregas.</p>
          </div>

          {/* TABS: Navegación entre secciones */}
          <div className="flex gap-2 mb-6 border-b border-border">
            <Button
              variant={activeTab === "packages" ? "default" : "ghost"}
              onClick={() => setActiveTab("packages")}
              className="rounded-b-none"
            >
              Paquetes ({state.packages.length})
            </Button>
            <Button
              variant={activeTab === "routes" ? "default" : "ghost"}
              onClick={() => setActiveTab("routes")}
              className="rounded-b-none"
            >
              Rutas ({state.routes.length})
            </Button>
            <Button
              variant={activeTab === "stats" ? "default" : "ghost"}
              onClick={() => setActiveTab("stats")}
              className="rounded-b-none"
            >
              Estadísticas
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
              {activeTab === "packages" && <PackagesList packages={state.packages} />}
              {activeTab === "routes" && <RoutesList routes={state.routes} />}
              {activeTab === "stats" && <StatsOverview packages={state.packages} routes={state.routes} />}
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
