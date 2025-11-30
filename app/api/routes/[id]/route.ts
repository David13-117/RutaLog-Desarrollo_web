// SISTEMA DE RUTEO LOGÍSTICO - ROUTE DETAIL API
// Endpoint para obtener detalles de una ruta específica

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

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  // ENDPOINT: GET /api/routes/[id] - Obtiene ruta específica
  try {
    const { id } = await params
    const route = MOCK_ROUTES.find((r) => r.id === id)

    if (!route) {
      return new Response(JSON.stringify({ success: false, error: "Ruta no encontrada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ success: true, data: route }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Error al obtener ruta" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
