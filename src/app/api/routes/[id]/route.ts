import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { Route } from '@/lib/models/route'
import { connectDB } from '@/lib/db'
import { applyRateLimit } from '@/lib/rate-limit-middleware'
import { RATE_LIMITS } from '@/lib/rate-limit'
import mongoose from 'mongoose'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'ID de ruta inválido' },
        { status: 400 }
      )
    }

    await connectDB()

    // Buscar la ruta
    const route = await Route.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(session.userId)
    }).lean()

    if (!route) {
      return NextResponse.json(
        { message: 'Ruta no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        route: {
          id: route._id.toString(),
          coordinates: route.coordinates,
          stats: route.stats,
          startTime: route.startTime,
          endTime: route.endTime,
          conqueredTerritory: route.conqueredTerritory,
          territoryCoords: route.territoryCoords,
          name: route.name,
          description: route.description,
          createdAt: route.createdAt,
          updatedAt: route.updatedAt
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching route:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'ID de ruta inválido' },
        { status: 400 }
      )
    }

    await connectDB()

    // Buscar y eliminar la ruta
    const route = await Route.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(session.userId)
    })

    if (!route) {
      return NextResponse.json(
        { message: 'Ruta no encontrada' },
        { status: 404 }
      )
    }

    // También eliminar el territorio asociado si existe
    const { Territory } = await import('@/lib/models/territory')
    await Territory.deleteOne({ routeId: route._id })

    return NextResponse.json(
      { message: 'Ruta eliminada exitosamente' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting route:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
