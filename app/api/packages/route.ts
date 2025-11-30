// SISTEMA DE RUTEO LOGÍSTICO - PACKAGES API
// Endpoint para obtener listado de paquetes
// Retorna datos de JSON simulado

// MOCK DATA: Base de datos en memoria simulada
const MOCK_PACKAGES = [
  {
    id: "pkg-001",
    trackingNumber: "LOG-2024-001",
    origin: "Centro de Distribución A",
    destination: "Zona Centro",
    weight: 5.2,
    status: "pendiente" as const,
    priority: "alta" as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: "pkg-002",
    trackingNumber: "LOG-2024-002",
    origin: "Centro de Distribución B",
    destination: "Zona Sur",
    weight: 3.8,
    status: "en_transito" as const,
    assignedTo: "conductor-001",
    priority: "media" as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: "pkg-003",
    trackingNumber: "LOG-2024-003",
    origin: "Centro de Distribución A",
    destination: "Zona Norte",
    weight: 7.1,
    status: "entregado" as const,
    priority: "baja" as const,
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  // ENDPOINT: GET /api/packages - Retorna todos los paquetes
  try {
    return new Response(
      JSON.stringify({
        success: true,
        data: MOCK_PACKAGES,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error al obtener paquetes",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
