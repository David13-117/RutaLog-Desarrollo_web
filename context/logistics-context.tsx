// SISTEMA DE RUTEO LOGÍSTICO - LOGISTICS CONTEXT
// Contexto para gestionar rutas, paquetes y estado de entregas
// Usa useReducer para manejar estado complejo

"use client"

import { createContext, useContext, useReducer, type ReactNode, useCallback } from "react"

// Tipos de datos para el sistema logístico
export interface Package {
  id: string
  trackingNumber: string
  origin: string
  destination: string
  weight: number
  status: "pendiente" | "en_transito" | "entregado" | "cancelado"
  assignedTo?: string
  priority: "baja" | "media" | "alta"
  createdAt: string
}

export interface Route {
  id: string
  name: string
  startPoint: string
  endPoint: string
  distance: number
  estimatedTime: number
  assignedDriver?: string
  packages: string[]
  status: "activa" | "completada" | "paused"
}

export interface Conductor {
  id: string
  name: string
  email: string
  phone: string
  status: "activo" | "inactivo"
}

export interface LogisticsState {
  packages: Package[]
  routes: Route[]
  conductors: Conductor[]
  isLoading: boolean
  error: string | null
}

type LogisticsAction =
  | { type: "SET_PACKAGES"; payload: Package[] }
  | { type: "SET_ROUTES"; payload: Route[] }
  | { type: "UPDATE_PACKAGE"; payload: Package }
  | { type: "ADD_ROUTE"; payload: Route }
  | { type: "UPDATE_ROUTE"; payload: Route }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_PACKAGE"; payload: Package }
  | { type: "DELETE_PACKAGE"; payload: string }

// Reducer para manejar la lógica de estado
function logisticsReducer(state: LogisticsState, action: LogisticsAction): LogisticsState {
  switch (action.type) {
    case "SET_PACKAGES":
      return { ...state, packages: action.payload }
    case "SET_ROUTES":
      return { ...state, routes: action.payload }
    case "UPDATE_PACKAGE":
      return {
        ...state,
        packages: state.packages.map((p) => (p.id === action.payload.id ? action.payload : p)),
      }
    case "ADD_PACKAGE":
      return {
        ...state,
        packages: [...state.packages, action.payload],
      }
    case "DELETE_PACKAGE":
      return {
        ...state,
        packages: state.packages.filter((p) => p.id !== action.payload),
      }
    case "ADD_ROUTE":
      return { ...state, routes: [...state.routes, action.payload] }
    case "UPDATE_ROUTE":
      return {
        ...state,
        routes: state.routes.map((r) => (r.id === action.payload.id ? action.payload : r)),
      }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    default:
      return state
  }
}

interface LogisticsContextType {
  state: LogisticsState
  fetchPackages: () => Promise<void>
  fetchRoutes: () => Promise<void>
  updatePackageStatus: (packageId: string, status: Package["status"]) => Promise<void>
  assignPackageToDriver: (packageId: string, driverId: string) => Promise<void>
  updateRouteStatus: (routeId: string, status: Route["status"]) => Promise<void>
  addPackage: (pkg: Omit<Package, "id" | "createdAt">) => Promise<void>
  updatePackage: (pkg: Package) => Promise<void>
  deletePackage: (packageId: string) => Promise<void>
}

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined)

export function LogisticsProvider({ children }: { children: ReactNode }) {
  const initialState: LogisticsState = {
    packages: [],
    routes: [],
    conductors: [],
    isLoading: false,
    error: null,
  }

  const [state, dispatch] = useReducer(logisticsReducer, initialState)

  // MOCK API: Simular obtención de paquetes
  const fetchPackages = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockPackages: Package[] = [
        {
          id: "pkg-001",
          trackingNumber: "LOG-2024-001",
          origin: "Centro de Distribución A",
          destination: "Zona Centro - Calle 5",
          weight: 5.2,
          status: "pendiente",
          priority: "alta",
          createdAt: new Date().toISOString(),
        },
        {
          id: "pkg-002",
          trackingNumber: "LOG-2024-002",
          origin: "Centro de Distribución B",
          destination: "Zona Sur - Av. Principal",
          weight: 3.8,
          status: "en_transito",
          assignedTo: "conductor-001",
          priority: "media",
          createdAt: new Date().toISOString(),
        },
        {
          id: "pkg-003",
          trackingNumber: "LOG-2024-003",
          origin: "Centro de Distribución A",
          destination: "Zona Norte - Parque Industrial",
          weight: 7.1,
          status: "en_transito",
          assignedTo: "conductor-001",
          priority: "baja",
          createdAt: new Date().toISOString(),
        },
        {
          id: "pkg-004",
          trackingNumber: "LOG-2024-004",
          origin: "Centro de Distribución C",
          destination: "Zona Centro - Calle 12",
          weight: 2.5,
          status: "en_transito",
          assignedTo: "conductor-001",
          priority: "alta",
          createdAt: new Date().toISOString(),
        },
        {
          id: "pkg-005",
          trackingNumber: "LOG-2024-005",
          origin: "Centro de Distribución A",
          destination: "Zona Norte - Comercial Plaza",
          weight: 4.3,
          status: "en_transito",
          assignedTo: "conductor-001",
          priority: "media",
          createdAt: new Date().toISOString(),
        },
        {
          id: "pkg-006",
          trackingNumber: "LOG-2024-006",
          origin: "Centro de Distribución B",
          destination: "Zona Sur - Centro Comercial",
          weight: 6.8,
          status: "en_transito",
          assignedTo: "conductor-001",
          priority: "baja",
          createdAt: new Date().toISOString(),
        },
        {
          id: "pkg-007",
          trackingNumber: "LOG-2024-007",
          origin: "Centro de Distribución A",
          destination: "Zona Este - Residencial",
          weight: 1.9,
          status: "entregado",
          assignedTo: "conductor-001",
          priority: "baja",
          createdAt: new Date().toISOString(),
        },
        {
          id: "pkg-008",
          trackingNumber: "LOG-2024-008",
          origin: "Centro de Distribución C",
          destination: "Zona Oeste - Oficinas",
          weight: 3.2,
          status: "entregado",
          assignedTo: "conductor-001",
          priority: "media",
          createdAt: new Date().toISOString(),
        },
      ]

      dispatch({ type: "SET_PACKAGES", payload: mockPackages })
      dispatch({ type: "SET_ERROR", payload: null })
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Error al obtener paquetes" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  // MOCK API: Simular obtención de rutas
  const fetchRoutes = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockRoutes: Route[] = [
        {
          id: "route-001",
          name: "Ruta Centro-Norte",
          startPoint: "Almacén Central",
          endPoint: "Zona Norte",
          distance: 45.5,
          estimatedTime: 120,
          assignedDriver: "conductor-001",
          packages: ["pkg-001", "pkg-002", "pkg-003", "pkg-004", "pkg-005"],
          status: "activa",
        },
        {
          id: "route-002",
          name: "Ruta Centro-Sur",
          startPoint: "Almacén Central",
          endPoint: "Zona Sur",
          distance: 52.3,
          estimatedTime: 150,
          assignedDriver: "conductor-001",
          packages: ["pkg-006"],
          status: "paused",
        },
      ]

      dispatch({ type: "SET_ROUTES", payload: mockRoutes })
      dispatch({ type: "SET_ERROR", payload: null })
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Error al obtener rutas" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  // MOCK API: Actualizar estado de paquete
  const updatePackageStatus = useCallback(
    async (packageId: string, status: Package["status"]) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        await new Promise((resolve) => setTimeout(resolve, 600))

        const pkg = state.packages.find((p) => p.id === packageId)
        if (pkg) {
          dispatch({ type: "UPDATE_PACKAGE", payload: { ...pkg, status } })
        }
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.packages],
  )

  // MOCK API: Asignar paquete a conductor
  const assignPackageToDriver = useCallback(
    async (packageId: string, driverId: string) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        await new Promise((resolve) => setTimeout(resolve, 600))

        const pkg = state.packages.find((p) => p.id === packageId)
        if (pkg) {
          dispatch({ type: "UPDATE_PACKAGE", payload: { ...pkg, assignedTo: driverId } })
        }
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.packages],
  )

  // MOCK API: Actualizar estado de ruta
  const updateRouteStatus = useCallback(
    async (routeId: string, status: Route["status"]) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        await new Promise((resolve) => setTimeout(resolve, 600))

        const route = state.routes.find((r) => r.id === routeId)
        if (route) {
          dispatch({ type: "UPDATE_ROUTE", payload: { ...route, status } })
        }
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.routes],
  )

  // MOCK API: Agregar paquete
  const addPackage = useCallback(async (pkg: Omit<Package, "id" | "createdAt">) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))

      const newPackage: Package = {
        ...pkg,
        id: `pkg-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }

      dispatch({ type: "ADD_PACKAGE", payload: newPackage })
      dispatch({ type: "SET_ERROR", payload: null })
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Error al agregar paquete" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  // MOCK API: Actualizar paquete
  const updatePackage = useCallback(async (pkg: Package) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))

      dispatch({ type: "UPDATE_PACKAGE", payload: pkg })
      dispatch({ type: "SET_ERROR", payload: null })
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Error al actualizar paquete" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  // MOCK API: Eliminar paquete
  const deletePackage = useCallback(async (packageId: string) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))

      dispatch({ type: "DELETE_PACKAGE", payload: packageId })
      dispatch({ type: "SET_ERROR", payload: null })
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Error al eliminar paquete" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const value: LogisticsContextType = {
    state,
    fetchPackages,
    fetchRoutes,
    updatePackageStatus,
    assignPackageToDriver,
    updateRouteStatus,
    addPackage,
    updatePackage,
    deletePackage,
  }

  return <LogisticsContext.Provider value={value}>{children}</LogisticsContext.Provider>
}

// Hook personalizado para usar el contexto de logística
export function useLogistics() {
  const context = useContext(LogisticsContext)
  if (context === undefined) {
    throw new Error("useLogistics debe ser usado dentro de LogisticsProvider")
  }
  return context
}
