// SISTEMA DE RUTEO LOGÍSTICO - CONDUCTOR ASSIGNED ROUTES
// Muestra las rutas asignadas al conductor con detalles de navegación
// Permite cambiar entre rutas activa y paused

"use client"

import { useLogistics, type Route } from "@/context/logistics-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ConductorAssignedRoutesProps {
  routes: Route[]
  activeRouteId?: string | null
  onRouteChange?: (routeId: string) => void
}

export default function ConductorAssignedRoutes({
  routes,
  activeRouteId,
  onRouteChange,
}: ConductorAssignedRoutesProps) {
  const { updateRouteStatus } = useLogistics()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleToggleRouteStatus = async (routeId: string, currentStatus: Route["status"]) => {
    setUpdatingId(routeId)
    try {
      const newStatus: Route["status"] = currentStatus === "activa" ? "paused" : "activa"
      await updateRouteStatus(routeId, newStatus)
      if (newStatus === "activa" && onRouteChange) {
        onRouteChange(routeId)
      }
    } finally {
      setUpdatingId(null)
    }
  }

  // HELPER: Obtener color según estado
  const getStatusColor = (status: Route["status"]) => {
    const colors: Record<Route["status"], string> = {
      activa: "bg-green-100 text-green-800",
      completada: "bg-blue-100 text-blue-800",
      paused: "bg-yellow-100 text-yellow-800",
    }
    return colors[status]
  }

  return (
    <div className="grid gap-4">
      {routes.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No tienes rutas asignadas en este momento</p>
        </Card>
      ) : (
        routes.map((route) => (
          <Card
            key={route.id}
            className={`p-6 cursor-pointer transition-all ${
              activeRouteId === route.id ? "border-primary border-2 bg-primary/5" : ""
            }`}
            onClick={() => route.status !== "completada" && onRouteChange?.(route.id)}
          >
            <div className="flex items-start justify-between gap-4">
              {/* INFORMACION: Detalles de la ruta */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-foreground text-xl">{route.name}</h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full capitalize font-semibold ${getStatusColor(route.status)}`}
                  >
                    {route.status}
                  </span>
                </div>

                {/* DETALLES: Información de origen y destino */}
                <div className="bg-muted/50 rounded p-3 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Punto de partida</p>
                      <p className="font-semibold text-foreground">{route.startPoint}</p>
                    </div>
                    <div className="text-muted-foreground">→</div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-xs mb-1">Destino</p>
                      <p className="font-semibold text-foreground">{route.endPoint}</p>
                    </div>
                  </div>
                </div>

                {/* METRICAS: Distancia y tiempo */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-primary/10 rounded p-3">
                    <p className="text-xs text-muted-foreground mb-1">Distancia</p>
                    <p className="font-bold text-foreground">{route.distance} km</p>
                  </div>
                  <div className="bg-primary/10 rounded p-3">
                    <p className="text-xs text-muted-foreground mb-1">Tiempo estimado</p>
                    <p className="font-bold text-foreground">{route.estimatedTime} min</p>
                  </div>
                  <div className="bg-primary/10 rounded p-3">
                    <p className="text-xs text-muted-foreground mb-1">Paquetes</p>
                    <p className="font-bold text-foreground">{route.packages.length}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  className="whitespace-nowrap"
                  disabled={route.status === "completada" || updatingId === route.id}
                >
                  {route.status === "activa" ? "En Progreso" : "Ver Detalles"}
                </Button>
                <Button
                  variant="outline"
                  className="whitespace-nowrap bg-transparent"
                  disabled={route.status === "completada" || updatingId === route.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleRouteStatus(route.id, route.status)
                  }}
                >
                  {route.status === "activa" ? "Pausar" : "Reanudar"}
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
