// SISTEMA DE RUTEO LOGÍSTICO - API DOCUMENTATION
// Página de documentación interactiva de la API REST
// Muestra todos los endpoints disponibles con ejemplos de uso

"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ApiDocsPage() {
  const [swaggerSpec, setSwaggerSpec] = useState<any>(null)

  // EFFECT: Cargar especificación de Swagger
  useEffect(() => {
    fetch("/api/swagger")
      .then((res) => res.json())
      .then((data) => setSwaggerSpec(data))
      .catch((err) => console.error("[v0] Error al cargar Swagger:", err))
  }, [])

  if (!swaggerSpec) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Cargando documentación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">{swaggerSpec.info.title}</h1>
          <p className="text-muted-foreground mb-4">{swaggerSpec.info.description}</p>
          <Link href="/login">
            <Button>Volver a Login</Button>
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <main className="container mx-auto px-4 py-8">
        {/* INFORMACIÓN GENERAL */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Información General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Versión API</p>
              <p className="font-bold text-foreground">{swaggerSpec.info.version}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Base URL</p>
              <p className="font-mono text-sm text-foreground break-all">{swaggerSpec.servers[0].url}</p>
            </Card>
          </div>
        </div>

        {/* ENDPOINTS */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Endpoints Disponibles</h2>
          <div className="space-y-4">
            {Object.entries(swaggerSpec.paths).map(([path, methods]: [string, any]) => (
              <Card key={path} className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-3">{path}</h3>

                {/* METODOS HTTP */}
                <div className="space-y-3">
                  {Object.entries(methods).map(([method, details]: [string, any]) => (
                    <div key={`${path}-${method}`} className="bg-muted/50 rounded p-4">
                      {/* METODO Y DESCRIPCION */}
                      <div className="flex items-start gap-3 mb-2">
                        <span
                          className={`inline-block px-3 py-1 rounded font-bold text-white text-sm ${
                            method === "get"
                              ? "bg-blue-600"
                              : method === "post"
                                ? "bg-green-600"
                                : method === "put"
                                  ? "bg-orange-600"
                                  : method === "delete"
                                    ? "bg-red-600"
                                    : "bg-gray-600"
                          }`}
                        >
                          {method.toUpperCase()}
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{details.summary}</p>
                          <p className="text-sm text-muted-foreground">{details.description}</p>
                        </div>
                      </div>

                      {/* ETIQUETA */}
                      {details.tags && (
                        <p className="text-xs text-muted-foreground mb-2">
                          <strong>Categoría:</strong> {details.tags[0]}
                        </p>
                      )}

                      {/* EJEMPLO DE USO CON CURL */}
                      <div className="bg-background rounded p-3 font-mono text-xs text-foreground mt-3 overflow-x-auto">
                        <p className="text-muted-foreground mb-1">Ejemplo con curl:</p>
                        <code>
                          {method === "get" && `curl -X GET "${swaggerSpec.servers[0].url}${path}"`}
                          {method === "post" &&
                            `curl -X POST "${swaggerSpec.servers[0].url}${path}" \\
  -H "Content-Type: application/json" \\
  -d '{{}}'`}
                          {method === "put" &&
                            `curl -X PUT "${swaggerSpec.servers[0].url}${path}" \\
  -H "Content-Type: application/json" \\
  -d '{{}}'`}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* MODELOS */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Modelos de Datos</h2>
          <div className="space-y-4">
            {Object.entries(swaggerSpec.components.schemas).map(([name, schema]: [string, any]) => (
              <Card key={name} className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-3">{name}</h3>
                <div className="bg-muted/50 rounded p-4 font-mono text-sm text-foreground overflow-x-auto">
                  <pre>{JSON.stringify(schema, null, 2)}</pre>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* NOTAS */}
        <Card className="p-6 bg-blue-50 border border-blue-200 mt-8">
          <p className="text-blue-950 font-semibold mb-2">Nota Importante</p>
          <p className="text-blue-800 text-sm">
            Esta es una API de demostración que utiliza datos simulados en memoria (JSON). Los datos no se persisten
            entre reinicios. Para usar en producción, integra una base de datos real y implementa autenticación con
            tokens JWT.
          </p>
        </Card>
      </main>
    </div>
  )
}
