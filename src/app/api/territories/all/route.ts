import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { Territory } from '@/lib/models/territory'
import { connectDB } from '@/lib/db'
import { applyRateLimit } from '@/lib/rate-limit-middleware'
import { RATE_LIMITS } from '@/lib/rate-limit'

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

    // Obtener parámetros de paginación (opcional, pero para mapa global quizás queramos todo o por región)
    // Por ahora limitamos a 500 para no explotar, ordenados por fecha
    const limit = 500

    // Buscar territorios de todos los usuarios
    const territories = await Territory.find({})
        .sort({ timestamp: -1 })
        .limit(limit)
        .select('userId coordinates timestamp')
        .lean()

    return NextResponse.json(
      {
        territories: territories.map((territory) => ({
          id: territory._id.toString(),
          userId: territory.userId.toString(),
          coordinates: territory.coordinates,
          timestamp: territory.timestamp
        }))
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching global territories:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
