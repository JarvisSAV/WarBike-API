import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { Session } from '@/lib/models/sessions'
import { connectDB } from '@/lib/db'
import { applyRateLimit } from '@/lib/rate-limit-middleware'
import { RATE_LIMITS } from '@/lib/rate-limit'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: sessionIdToDelete } = await params

    // Prevenir que el usuario cierre su sesión actual
    if (sessionIdToDelete === session.id) {
      return NextResponse.json(
        { message: 'No puedes cerrar tu sesión actual. Usa el endpoint de sign-out.' },
        { status: 400 }
      )
    }

    await connectDB()

    // Verificar que la sesión a eliminar pertenezca al usuario
    const sessionToDelete = await Session.findOne({
      sessionId: sessionIdToDelete
    })

    if (!sessionToDelete) {
      return NextResponse.json(
        { message: 'Sesión no encontrada' },
        { status: 404 }
      )
    }

    if (sessionToDelete.userId.toString() !== session.userId) {
      return NextResponse.json(
        { message: 'No tienes permiso para cerrar esta sesión' },
        { status: 403 }
      )
    }

    // Eliminar la sesión
    await Session.deleteOne({ sessionId: sessionIdToDelete })

    return NextResponse.json(
      { message: 'Sesión cerrada exitosamente' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
