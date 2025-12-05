// SISTEMA DE RUTEO LOGÍSTICO - CONDUCTOR DASHBOARD
// Panel para conductores
// Visualiza rutas asignadas, paquetes a entregar y entregas completadas

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
  const [activeTab, setActiveTab] = useState<"routes" | "deliveries">("routes")
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null)

  // EFFECT: Cargar datos al montar el componente
  useEffect(() => {
    fetchPackages()
    fetchRoutes()
  }, [fetchPackages, fetchRoutes])

  // FILTER: Obtener rutas asignadas al conductor actual
  const assignedRoutes = state.routes.filter((r) => r.assignedDriver === user?.id)

  const activeRoute = activeRouteId
    ? assignedRoutes.find((r) => r.id === activeRouteId)
    : assignedRoutes.find((r) => r.status === "activa")

  const routePackages = activeRoute
    ? state.packages.filter((p) => activeRoute.packages.includes(p.id) && p.assignedTo === user?.id)
    : []

  const activeDeliveries = routePackages.filter((p) => p.status !== "entregado")
  const completedDeliveries = routePackages.filter((p) => p.status === "entregado")

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

          {/* TABS: Navegación entre rutas y entregas */}
          <div className="flex gap-2 mb-6 border-b border-border">
            <Button
              variant={activeTab === "routes" ? "default" : "ghost"}
              onClick={() => setActiveTab("routes")}
              className="rounded-b-none"
            >
              Mis Rutas ({assignedRoutes.length})
            </Button>
            <Button
              variant={activeTab === "deliveries" ? "default" : "ghost"}
              onClick={() => setActiveTab("deliveries")}
              className="rounded-b-none"
            >
              Entregas
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
              {activeTab === "routes" && (
                <ConductorAssignedRoutes
                  routes={assignedRoutes}
                  activeRouteId={activeRouteId}
                  onRouteChange={setActiveRouteId}
                />
              )}
              {activeTab === "deliveries" && (
                <div className="space-y-6">
                  {/* SELECTOR DE RUTA */}
                  {assignedRoutes.length > 0 && (
                    <Card className="p-4 bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-3">Selecciona una ruta:</p>
                      <div className="flex gap-2 flex-wrap">
                        {assignedRoutes.map((route) => (
                          <Button
                            key={route.id}
                            variant={activeRoute?.id === route.id ? "default" : "outline"}
                            onClick={() => setActiveRouteId(route.id)}
                            className="text-sm"
                          >
                            {route.name}
                            <span className="ml-2 text-xs px-2 py-0.5 rounded bg-background/50">{route.status}</span>
                          </Button>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* ENTREGAS ACTIVAS */}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-3">
                      Entregas Activas ({activeDeliveries.length})
                    </h2>
                    <ConductorAssignedPackages packages={activeDeliveries} />
                  </div>

                  {/* ENTREGAS COMPLETADAS */}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-3">
                      Entregas Completadas ({completedDeliveries.length})
                    </h2>
                    {completedDeliveries.length === 0 ? (
                      <Card className="p-8 text-center">
                        <p className="text-muted-foreground">No hay entregas completadas en esta ruta</p>
                      </Card>
                    ) : (
                      <div className="grid gap-3">
                        {completedDeliveries.map((pkg) => (
                          <Card key={pkg.id} className="p-4 bg-green-50 border border-green-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-foreground">{pkg.trackingNumber}</p>
                                <p className="text-sm text-muted-foreground">{pkg.destination}</p>
                              </div>
                              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 font-semibold">
                                ✓ Entregado
                              </span>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
