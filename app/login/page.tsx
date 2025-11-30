// SISTEMA DE RUTEO LOGÍSTICO - LOGIN PAGE
// Página de autenticación con imagen de fondo de almacén oscurecida al 15%
// Soporta dos tipos de usuario: admin y conductor

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [localError, setLocalError] = useState("")
  const { login, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  // REDIRECCION: Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  // MANEJO DE SUBMIT: Procesar login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    try {
      await login(username, password)
      router.push("/")
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Error de autenticación")
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* FONDO: Imagen de almacén logístico con opacidad al 15% */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{
          backgroundImage: "url(/logistics-background.jpg)",
        }}
      />

      <div className="absolute inset-0 bg-background/40" />

      {/* CONTENEDOR PRINCIPAL: Tarjeta de login */}
      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="p-8 shadow-2xl border-2 border-primary">
          {/* HEADER: Título del sistema */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Sistema de Ruteo Logístico</h1>
            <p className="text-muted-foreground">Ingresa tus credenciales para continuar</p>
          </div>

          {/* FORMULARIO: Login */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* INPUT: Usuario */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Usuario</label>
              <Input
                type="text"
                placeholder="admin o conductor"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            {/* INPUT: Contraseña */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Contraseña</label>
              <Input
                type="password"
                placeholder="contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            {/* ERROR: Mostrar mensaje de error si existe */}
            {localError && (
              <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded text-sm">
                {localError}
              </div>
            )}

            {/* BOTÓN: Submit - usa color primario azul */}
            <Button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Autenticando..." : "Ingresar"}
            </Button>
          </form>

          {/* AYUDA: Credenciales de prueba */}
          <div className="mt-6 p-4 bg-muted/50 rounded border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Credenciales de prueba:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <strong>Admin:</strong> usuario: admin | contraseña: admin
              </p>
              <p>
                <strong>Conductor:</strong> usuario: conductor | contraseña: conductor
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
