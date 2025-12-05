// SISTEMA DE RUTEO LOGÍSTICO - PACKAGE FORM MODAL
// Modal para agregar o editar paquetes

"use client"

import type React from "react"

import { useState } from "react"
import { useLogistics, type Package, type Route } from "@/context/logistics-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface PackageFormModalProps {
  package?: Package
  routes: Route[]
  onClose: () => void
}

export default function PackageFormModal({ package: existingPackage, routes, onClose }: PackageFormModalProps) {
  const { addPackage, updatePackage } = useLogistics()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Omit<Package, "id" | "createdAt">>({
    trackingNumber: existingPackage?.trackingNumber || "",
    origin: existingPackage?.origin || "",
    destination: existingPackage?.destination || "",
    weight: existingPackage?.weight || 0,
    status: existingPackage?.status || "pendiente",
    priority: existingPackage?.priority || "media",
    assignedTo: existingPackage?.assignedTo || undefined,
  })

  // MANEJO: Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (existingPackage) {
        await updatePackage({
          ...formData,
          id: existingPackage.id,
          createdAt: existingPackage.createdAt,
        })
      } else {
        await addPackage(formData)
      }
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            {existingPackage ? "Editar Paquete" : "Agregar Nuevo Paquete"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* CAMPO: Número de seguimiento */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Número de Seguimiento</label>
              <input
                type="text"
                value={formData.trackingNumber}
                onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                required
              />
            </div>

            {/* CAMPO: Origen */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Origen</label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                required
              />
            </div>

            {/* CAMPO: Destino */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Destino</label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                required
              />
            </div>

            {/* CAMPO: Peso */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: Number.parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                required
              />
            </div>

            {/* CAMPO: Prioridad */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Prioridad</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            {/* CAMPO: Estado */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_transito">En Tránsito</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            {/* CAMPO: Conductor Asignado */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Conductor Asignado (Opcional)</label>
              <input
                type="text"
                value={formData.assignedTo || ""}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value || undefined })}
                placeholder="ID del conductor"
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
              />
            </div>

            {/* ACCIONES: Botones */}
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Guardando..." : existingPackage ? "Actualizar" : "Agregar"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
