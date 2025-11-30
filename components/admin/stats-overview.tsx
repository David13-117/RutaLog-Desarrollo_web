// SISTEMA DE RUTEO LOGÍSTICO - STATS OVERVIEW
// Panel de estadísticas y resumen de la operación

"use client"

import type { Package, Route } from "@/context/logistics-context"
import { Card } from "@/components/ui/card"

interface StatsOverviewProps {
  packages: Package[]
  routes: Route[]
}

export default function StatsOverview({ packages, routes }: StatsOverviewProps) {
  // CALCULOS: Estadísticas derivadas
  const stats = {
    totalPackages: packages.length,
    pendingPackages: packages.filter((p) => p.status === "pendiente").length,
    inTransitPackages: packages.filter((p) => p.status === "en_transito").length,
    deliveredPackages: packages.filter((p) => p.status === "entregado").length,
    highPriorityPackages: packages.filter((p) => p.priority === "alta").length,
    totalRoutes: routes.length,
    activeRoutes: routes.filter((r) => r.status === "activa").length,
    completedRoutes: routes.filter((r) => r.status === "completada").length,
    totalDistance: routes.reduce((sum, r) => sum + r.distance, 0),
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* STAT: Paquetes totales */}
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-1">Paquetes Totales</p>
        <p className="text-3xl font-bold text-foreground">{stats.totalPackages}</p>
      </Card>

      {/* STAT: Pendientes */}
      <Card className="p-4 border-yellow-200 bg-yellow-50">
        <p className="text-sm text-yellow-800 font-medium mb-1">Pendientes</p>
        <p className="text-3xl font-bold text-yellow-900">{stats.pendingPackages}</p>
      </Card>

      {/* STAT: En tránsito */}
      <Card className="p-4 border-blue-200 bg-blue-50">
        <p className="text-sm text-blue-800 font-medium mb-1">En Tránsito</p>
        <p className="text-3xl font-bold text-blue-900">{stats.inTransitPackages}</p>
      </Card>

      {/* STAT: Entregados */}
      <Card className="p-4 border-green-200 bg-green-50">
        <p className="text-sm text-green-800 font-medium mb-1">Entregados</p>
        <p className="text-3xl font-bold text-green-900">{stats.deliveredPackages}</p>
      </Card>

      {/* STAT: Alta prioridad */}
      <Card className="p-4 border-red-200 bg-red-50">
        <p className="text-sm text-red-800 font-medium mb-1">Alta Prioridad</p>
        <p className="text-3xl font-bold text-red-900">{stats.highPriorityPackages}</p>
      </Card>

      {/* STAT: Rutas activas */}
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-1">Rutas Activas</p>
        <p className="text-3xl font-bold text-foreground">
          {stats.activeRoutes} / {stats.totalRoutes}
        </p>
      </Card>

      {/* STAT: Rutas completadas */}
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-1">Rutas Completadas</p>
        <p className="text-3xl font-bold text-foreground">{stats.completedRoutes}</p>
      </Card>

      {/* STAT: Distancia total */}
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-1">Distancia Total</p>
        <p className="text-3xl font-bold text-foreground">{stats.totalDistance.toFixed(1)} km</p>
      </Card>
    </div>
  )
}
