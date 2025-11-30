// SISTEMA DE RUTEO LOGÍSTICO - CONDUCTOR ASSIGNED PACKAGES
// Lista de paquetes asignados al conductor con opciones de entrega

"use client"

import { useLogistics, type Package } from "@/context/logistics-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ConductorAssignedPackagesProps {
  packages: Package[]
}

export default function ConductorAssignedPackages({ packages }: ConductorAssignedPackagesProps) {
  const { updatePackageStatus } = useLogistics()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // MANEJO: Marcar paquete como entregado
  const handleDeliverPackage = async (packageId: string) => {
    setUpdatingId(packageId)
    try {
      await updatePackageStatus(packageId, "entregado")
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

  return (
    <div className="grid gap-4">
      {packages.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No tienes entregas asignadas en este momento</p>
        </Card>
      ) : (
        packages.map((pkg) => (
          <Card key={pkg.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              {/* INFORMACION: Detalles del paquete */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <h3 className="font-bold text-foreground text-lg">{pkg.trackingNumber}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(pkg.status)}`}>
                    {pkg.status.replace("_", " ")}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      pkg.priority === "alta"
                        ? "bg-red-100 text-red-800"
                        : pkg.priority === "media"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {pkg.priority.toUpperCase()}
                  </span>
                </div>

                {/* DETALLES: Origen y destino */}
                <div className="bg-muted/50 rounded p-3 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Recoger en</p>
                      <p className="font-semibold text-foreground">{pkg.origin}</p>
                    </div>
                    <div className="text-muted-foreground">→</div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-xs mb-1">Entregar en</p>
                      <p className="font-semibold text-foreground">{pkg.destination}</p>
                    </div>
                  </div>
                </div>

                {/* DATOS: Peso y otros */}
                <div className="flex gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Peso</p>
                    <p className="font-semibold text-foreground">{pkg.weight} kg</p>
                  </div>
                </div>
              </div>

              {/* ACCIONES: Botón de entregar */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => handleDeliverPackage(pkg.id)}
                  disabled={pkg.status === "entregado" || updatingId === pkg.id}
                  className="whitespace-nowrap"
                >
                  {updatingId === pkg.id ? "Procesando..." : "Marcar como Entregado"}
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
