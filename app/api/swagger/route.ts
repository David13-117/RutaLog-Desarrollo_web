// SISTEMA DE RUTEO LOGÍSTICO - SWAGGER DOCUMENTATION
// Endpoint que expone la documentación OpenAPI/Swagger de la API
// Define todos los endpoints disponibles en el sistema

export async function GET() {
  const swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "Sistema de Ruteo Logístico API",
      description: "API REST para gestión de rutas, paquetes y entregas logísticas",
      version: "1.0.0",
      contact: {
        name: "Soporte Logístico",
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
        description: "API Server",
      },
    ],
    paths: {
      "/api/auth/login": {
        post: {
          tags: ["Autenticación"],
          summary: "Autenticar usuario",
          description: "Valida credenciales y retorna token de sesión",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string", example: "admin" },
                    password: { type: "string", example: "admin" },
                  },
                  required: ["username", "password"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login exitoso",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      username: { type: "string" },
                      role: { type: "string", enum: ["admin", "conductor"] },
                    },
                  },
                },
              },
            },
            401: { description: "Credenciales inválidas" },
          },
        },
      },
      "/api/packages": {
        get: {
          tags: ["Paquetes"],
          summary: "Obtener todos los paquetes",
          description: "Retorna lista completa de paquetes en el sistema",
          responses: {
            200: {
              description: "Lista de paquetes",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Package",
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/packages/{id}": {
        get: {
          tags: ["Paquetes"],
          summary: "Obtener paquete específico",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Paquete encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Package" },
                },
              },
            },
            404: { description: "Paquete no encontrado" },
          },
        },
        put: {
          tags: ["Paquetes"],
          summary: "Actualizar estado de paquete",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      enum: ["pendiente", "en_transito", "entregado", "cancelado"],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Paquete actualizado" },
            404: { description: "Paquete no encontrado" },
          },
        },
      },
      "/api/routes": {
        get: {
          tags: ["Rutas"],
          summary: "Obtener todas las rutas",
          responses: {
            200: {
              description: "Lista de rutas",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Route" },
                  },
                },
              },
            },
          },
        },
      },
      "/api/routes/{id}": {
        get: {
          tags: ["Rutas"],
          summary: "Obtener ruta específica",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Ruta encontrada",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Route" },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Package: {
          type: "object",
          properties: {
            id: { type: "string", example: "pkg-001" },
            trackingNumber: { type: "string", example: "LOG-2024-001" },
            origin: { type: "string", example: "Centro de Distribución A" },
            destination: { type: "string", example: "Zona Centro" },
            weight: { type: "number", example: 5.2 },
            status: {
              type: "string",
              enum: ["pendiente", "en_transito", "entregado", "cancelado"],
              example: "pendiente",
            },
            priority: {
              type: "string",
              enum: ["baja", "media", "alta"],
              example: "alta",
            },
            assignedTo: { type: "string", example: "conductor-001" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Route: {
          type: "object",
          properties: {
            id: { type: "string", example: "route-001" },
            name: { type: "string", example: "Ruta Centro-Norte" },
            startPoint: { type: "string", example: "Almacén Central" },
            endPoint: { type: "string", example: "Zona Norte" },
            distance: { type: "number", example: 45.5 },
            estimatedTime: { type: "number", example: 120 },
            assignedDriver: { type: "string", example: "conductor-001" },
            packages: {
              type: "array",
              items: { type: "string" },
              example: ["pkg-001", "pkg-002"],
            },
            status: {
              type: "string",
              enum: ["activa", "completada", "paused"],
              example: "activa",
            },
          },
        },
      },
    },
  }

  return new Response(JSON.stringify(swaggerSpec), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}
