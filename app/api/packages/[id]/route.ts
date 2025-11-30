// SISTEMA DE RUTEO LOGÍSTICO - PACKAGE DETAIL API
// Endpoint para obtener y actualizar paquete específico
// Soporta GET para obtener y PUT para actualizar estado

// MOCK DATA: Base de datos en memoria
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

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  // ENDPOINT: GET /api/packages/[id] - Obtiene paquete específico
  try {
    const { id } = await params
    const pkg = MOCK_PACKAGES.find((p) => p.id === id)

    if (!pkg) {
      return new Response(JSON.stringify({ success: false, error: "Paquete no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ success: true, data: pkg }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Error al obtener paquete" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // ENDPOINT: PUT /api/packages/[id] - Actualiza estado del paquete
  try {
    const { id } = await params
    const body = await request.json()

    const pkg = MOCK_PACKAGES.find((p) => p.id === id)
    if (!pkg) {
      return new Response(JSON.stringify({ success: false, error: "Paquete no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    // ACTUALIZACION: Actualizar propiedades del paquete
    if (body.status) {
      pkg.status = body.status
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: pkg,
        message: "Paquete actualizado correctamente",
      }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Error al actualizar paquete" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
