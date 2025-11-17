import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { Session } from '@/lib/models/sessions'
import { connectDB } from '@/lib/db'

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 días

export async function POST() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { message: 'No autenticado o sesión expirada' },
        { status: 401 }
      )
    }

    await connectDB()

    const newExpiresAt = new Date(Date.now() + SESSION_DURATION)
    const now = new Date()

    // Actualizar expiresAt y lastUsed
    await Session.updateOne(
      { sessionId: session.id },
      { 
        $set: { 
          expiresAt: newExpiresAt,
          lastUsed: now
        } 
      }
    )

    return NextResponse.json(
      {
        message: 'Sesión renovada exitosamente',
        expiresAt: newExpiresAt
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error refreshing session:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
