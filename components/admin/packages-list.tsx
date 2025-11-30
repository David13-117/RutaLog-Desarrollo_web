// SISTEMA DE RUTEO LOGÍSTICO - PACKAGES LIST
// Lista de paquetes con estado, prioridad y acciones

"use client"

import { useLogistics, type Package } from "@/context/logistics-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface PackagesListProps {
  packages: Package[]
}

export default function PackagesList({ packages }: PackagesListProps) {
  const { updatePackageStatus } = useLogistics()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // MANEJO: Actualizar estado de paquete
  const handleUpdateStatus = async (packageId: string, newStatus: Package["status"]) => {
    setUpdatingId(packageId)
    try {
      await updatePackageStatus(packageId, newStatus)
    } finally {
      setUpdatingId(null)
    }
  }

  // HELPER: Obtener color según estado
  const getStatusColor = (status: Package["status"]) => {
    const colors: Record<Package["status"], string> = {
      pendiente: "bg-yellow-100 text-yellow-800",
      en_transito: "bg-blue-100 text-blue-800",
      entregado: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800",
    }
    return colors[status]
  }

  // HELPER: Obtener color según prioridad
  const getPriorityColor = (priority: Package["priority"]) => {
    const colors: Record<Package["priority"], string> = {
      baja: "text-muted-foreground",
      media: "text-orange-600",
      alta: "text-red-600",
    }
    return colors[priority]
  }

  return (
    <div className="grid gap-4">
      {packages.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No hay paquetes registrados</p>
        </Card>
      ) : (
        packages.map((pkg) => (
          <Card key={pkg.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              {/* INFORMACION: Detalles del paquete */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">{pkg.trackingNumber}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(pkg.status)}`}>
                    {pkg.status.replace("_", " ")}
                  </span>
                  <span className={`text-xs font-semibold capitalize ${getPriorityColor(pkg.priority)}`}>
                    Prioridad: {pkg.priority}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>Origen:</strong> {pkg.origin}
                  </p>
                  <p>
                    <strong>Destino:</strong> {pkg.destination}
                  </p>
                  <p>
                    <strong>Peso:</strong> {pkg.weight} kg
                  </p>
                  {pkg.assignedTo && (
                    <p>
                      <strong>Asignado a:</strong> {pkg.assignedTo}
                    </p>
                  )}
                </div>
              </div>

              {/* ACCIONES: Botones para cambiar estado */}
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pkg.status === "entregado" || updatingId === pkg.id}
                  onClick={() => handleUpdateStatus(pkg.id, "en_transito")}
                >
                  En tránsito
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={updatingId === pkg.id}
                  onClick={() => handleUpdateStatus(pkg.id, "entregado")}
                >
                  Entregar
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
