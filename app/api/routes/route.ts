// SISTEMA DE RUTEO LOGÍSTICO - ROUTES API
// Endpoint para obtener todas las rutas del sistema

// MOCK DATA: Base de datos en memoria
const MOCK_ROUTES = [
  {
    id: "route-001",
    name: "Ruta Centro-Norte",
    startPoint: "Almacén Central",
    endPoint: "Zona Norte",
    distance: 45.5,
    estimatedTime: 120,
    assignedDriver: "conductor-001",
    packages: ["pkg-001", "pkg-002"],
    status: "activa" as const,
  },
  {
    id: "route-002",
    name: "Ruta Centro-Sur",
    startPoint: "Almacén Central",
    endPoint: "Zona Sur",
    distance: 52.3,
    estimatedTime: 150,
    packages: ["pkg-003"],
    status: "completada" as const,
  },
]

export async function GET() {
  // ENDPOINT: GET /api/routes - Retorna todas las rutas
  try {
    return new Response(
      JSON.stringify({
        success: true,
        data: MOCK_ROUTES,
        timestamp: new Date().toISOString(),
      }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Error al obtener rutas" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
