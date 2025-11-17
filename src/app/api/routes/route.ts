import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { Route } from '@/lib/models/route'
import { Territory } from '@/lib/models/territory'
import { connectDB } from '@/lib/db'
import { applyRateLimit } from '@/lib/rate-limit-middleware'
import { RATE_LIMITS } from '@/lib/rate-limit'
import { z } from 'zod'
import mongoose from 'mongoose'

// Schema de validación para coordenadas
const coordinateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
})

// Schema de validación para la ruta
const routeSchema = z.object({
  coordinates: z.array(coordinateSchema).min(2, 'Debe haber al menos 2 coordenadas'),
  stats: z.object({
    distance: z.number().min(0),
    duration: z.number().min(0),
    avgSpeed: z.number().min(0),
    maxSpeed: z.number().min(0).optional(),
    calories: z.number().min(0).optional()
  }),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  conqueredTerritory: z.number().min(0).optional(),
  territoryCoords: z.array(coordinateSchema).optional(),
  name: z.string().max(100).optional(),
  description: z.string().max(500).optional()
})

export async function POST(request: Request) {
  // Aplicar rate limiting
  const rateLimitResponse = applyRateLimit(request, RATE_LIMITS.API)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { message: 'No autenticado o sesión expirada' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validar datos de entrada
    const validation = routeSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          message: 'Datos inválidos',
          errors: validation.error.issues
        },
        { status: 400 }
      )
    }

    const data = validation.data

    // Validar que endTime sea posterior a startTime
    const startTime = new Date(data.startTime)
    const endTime = new Date(data.endTime)

    if (endTime <= startTime) {
      return NextResponse.json(
        { message: 'La hora de fin debe ser posterior a la hora de inicio' },
        { status: 400 }
      )
    }

    await connectDB()

    // Crear la ruta
    const newRoute = await Route.create({
      userId: new mongoose.Types.ObjectId(session.userId),
      coordinates: data.coordinates,
      stats: data.stats,
      startTime,
      endTime,
      conqueredTerritory: data.conqueredTerritory,
      territoryCoords: data.territoryCoords,
      name: data.name,
      description: data.description
    })

    // Si hay territorio conquistado, crear entrada en territories
    if (data.territoryCoords && data.territoryCoords.length >= 3 && data.conqueredTerritory) {
      await Territory.create({
        userId: new mongoose.Types.ObjectId(session.userId),
        routeId: newRoute._id,
        coordinates: data.territoryCoords,
        area: data.conqueredTerritory,
        timestamp: endTime,
        name: data.name
      })
    }

    return NextResponse.json(
      {
        message: 'Ruta guardada exitosamente',
        route: {
          id: newRoute._id.toString(),
          stats: newRoute.stats,
          distance: newRoute.stats.distance,
          duration: newRoute.stats.duration,
          conqueredTerritory: newRoute.conqueredTerritory,
          createdAt: newRoute.createdAt
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving route:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  // Aplicar rate limiting
  const rateLimitResponse = applyRateLimit(request, RATE_LIMITS.API)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { message: 'No autenticado o sesión expirada' },
        { status: 401 }
      )
    }

    await connectDB()

    // Obtener parámetros de paginación
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
    const skip = (page - 1) * limit

    // Buscar rutas del usuario con paginación
    const [routes, total] = await Promise.all([
      Route.find({ userId: new mongoose.Types.ObjectId(session.userId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('stats startTime endTime conqueredTerritory name description createdAt')
        .lean(),
      Route.countDocuments({ userId: new mongoose.Types.ObjectId(session.userId) })
    ])

    return NextResponse.json(
      {
        routes: routes.map((route) => ({
          id: route._id.toString(),
          stats: route.stats,
          startTime: route.startTime,
          endTime: route.endTime,
          conqueredTerritory: route.conqueredTerritory,
          name: route.name,
          description: route.description,
          createdAt: route.createdAt
        })),
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching routes:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
