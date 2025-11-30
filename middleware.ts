// SISTEMA DE RUTEO LOGÍSTICO - MIDDLEWARE
// Middleware para manejo de rutas y cookies
// Próximamente: validación de tokens JWT

import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // RUTA: Obtener ruta actual
  const { pathname } = request.nextUrl

  // PROTECCION: Rutas que requieren autenticación
  const protectedRoutes = ["/admin", "/conductor"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // LOGUEO: Registrar acceso a rutas
  console.log(`[v0] Acceso a ruta: ${pathname}`)

  return NextResponse.next()
}

export const config = {
  // MATCHER: Aplicar middleware a rutas específicas
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
