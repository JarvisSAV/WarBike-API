import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { Territory } from '@/lib/models/territory'
import { connectDB } from '@/lib/db'
import { applyRateLimit } from '@/lib/rate-limit-middleware'
import { RATE_LIMITS } from '@/lib/rate-limit'
import mongoose from 'mongoose'

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

    // Obtener parámetros de paginación (opcional)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 200)
    const skip = (page - 1) * limit

    // Buscar territorios del usuario
    const [territories, total] = await Promise.all([
      Territory.find({ userId: new mongoose.Types.ObjectId(session.userId) })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .select('coordinates area timestamp name routeId')
        .lean(),
      Territory.countDocuments({ userId: new mongoose.Types.ObjectId(session.userId) })
    ])

    // Calcular área total conquistada
    const totalArea = territories.reduce((sum, territory) => sum + territory.area, 0)

    return NextResponse.json(
      {
        territories: territories.map((territory) => ({
          id: territory._id.toString(),
          routeId: territory.routeId.toString(),
          coordinates: territory.coordinates,
          area: territory.area,
          timestamp: territory.timestamp,
          name: territory.name
        })),
        stats: {
          total: total,
          totalArea: totalArea
        },
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
    console.error('Error fetching territories:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
