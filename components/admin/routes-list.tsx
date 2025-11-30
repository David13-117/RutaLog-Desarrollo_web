// SISTEMA DE RUTEO LOGÍSTICO - ROUTES LIST
// Lista de rutas con distancia, tiempo estimado y paquetes asignados

"use client"

import type { Route } from "@/context/logistics-context"
import { Card } from "@/components/ui/card"

interface RoutesListProps {
  routes: Route[]
}

export default function RoutesList({ routes }: RoutesListProps) {
  // HELPER: Obtener color según estado
  const getRouteStatusColor = (status: Route["status"]) => {
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
          <p className="text-muted-foreground">No hay rutas registradas</p>
        </Card>
      ) : (
        routes.map((route) => (
          <Card key={route.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              {/* INFORMACION: Detalles de la ruta */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground text-lg">{route.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded capitalize ${getRouteStatusColor(route.status)}`}>
                    {route.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <p>
                      <strong>Desde:</strong> {route.startPoint}
                    </p>
                    <p>
                      <strong>Hacia:</strong> {route.endPoint}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Distancia:</strong> {route.distance} km
                    </p>
                    <p>
                      <strong>Tiempo estimado:</strong> {route.estimatedTime} min
                    </p>
                  </div>
                </div>
                {route.assignedDriver && (
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Conductor asignado:</strong> {route.assignedDriver}
                  </p>
                )}
                <div className="mt-2">
                  <p className="text-sm font-medium text-foreground">Paquetes: {route.packages.length}</p>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
