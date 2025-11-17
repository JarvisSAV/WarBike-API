import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { Session } from '@/lib/models/sessions'
import { connectDB } from '@/lib/db'
import { applyRateLimit } from '@/lib/rate-limit-middleware'
import { RATE_LIMITS } from '@/lib/rate-limit'
import mongoose from 'mongoose'

export async function GET(request: Request) {
  // Aplicar rate limiting
  const rateLimitResponse = applyRateLimit(request, RATE_LIMITS.AUTH)
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

    // Buscar todas las sesiones activas del usuario
    const sessions = await Session.find({
      userId: new mongoose.Types.ObjectId(session.userId),
      expiresAt: { $gt: new Date() }
    })
      .sort({ lastUsed: -1 })
      .select('sessionId deviceName deviceType deviceModel lastUsed createdAt expiresAt')

    // Marcar la sesión actual
    const sessionsWithCurrent = sessions.map(s => ({
      id: s.sessionId,
      deviceName: s.deviceName || 'Dispositivo desconocido',
      deviceType: s.deviceType || 'unknown',
      deviceModel: s.deviceModel || 'Modelo desconocido',
      lastUsed: s.lastUsed,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrent: s.sessionId === session.id
    }))

    return NextResponse.json(
      {
        sessions: sessionsWithCurrent,
        total: sessionsWithCurrent.length
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
