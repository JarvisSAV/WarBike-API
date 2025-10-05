import 'server-only'
import { cookies } from 'next/headers'
import { connectDB } from './db'
import crypto from 'crypto'
import mongoose, { type ObjectId } from 'mongoose'
import { Session } from './models/sessions'
import { config } from '@/utils/config'

// Duración de la sesión: 7 días
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

export interface SessionData {
  id: string
  userId: string
  expiresAt: Date
}

// Generar un ID de sesión seguro
function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Crear una nueva sesión en la base de datos
export async function createSession(userId: string | ObjectId): Promise<string> {
  try {
    await connectDB()

    const sessionId = generateSessionId()
    const expiresAt = new Date(Date.now() + SESSION_DURATION)

    // Crear sesión en MongoDB
    await Session.create({
      sessionId,
      userId: typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId,
      expiresAt
    })

    // Establecer cookie
    const cookieStore = await cookies()
    cookieStore.set('session', sessionId, {
      httpOnly: true,
      secure: config.env === 'production',
      expires: expiresAt,
      sameSite: 'lax',
      path: '/'
    })

    return sessionId
  } catch (error) {
    console.error('Error creating session:', error)
    throw new Error('Failed to create session')
  }
}

// Obtener sesión desde la base de datos
export async function getSession(): Promise<SessionData | null> {
  try {
    await connectDB()

    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value

    if (!sessionId) {
      return null
    }

    // Buscar sesión en MongoDB
    const session = await Session.findOne({
      sessionId,
      expiresAt: { $gt: new Date() }
    })

    if (!session) {
      // Sesión no encontrada o expirada
      await deleteSession()
      return null
    }

    return {
      id: session.sessionId,
      userId: session.userId.toString(),
      expiresAt: session.expiresAt
    }
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

// Actualizar la expiración de una sesión
export async function updateSession(): Promise<void> {
  try {
    const session = await getSession()

    if (!session) {
      return
    }

    const newExpiresAt = new Date(Date.now() + SESSION_DURATION)

    // Actualizar en MongoDB
    await Session.updateOne(
      { sessionId: session.id },
      { $set: { expiresAt: newExpiresAt } }
    )

    // Actualizar cookie
    const cookieStore = await cookies()
    cookieStore.set('session', session.id, {
      httpOnly: true,
      secure: config.env === 'production',
      expires: newExpiresAt,
      sameSite: 'lax',
      path: '/'
    })
  } catch (error) {
    console.error('Error updating session:', error)
  }
}

// Eliminar sesión
export async function deleteSession(): Promise<void> {
  try {
    await connectDB()

    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value

    if (sessionId) {
      // Eliminar de MongoDB
      await Session.deleteOne({ sessionId })
    }

    // Eliminar cookie
    cookieStore.delete('session')
  } catch (error) {
    console.error('Error deleting session:', error)
  }
}

// Limpiar sesiones expiradas (MongoDB lo hace automáticamente con TTL index)
export async function cleanupExpiredSessions(): Promise<void> {
  try {
    await connectDB()
    // MongoDB elimina automáticamente con el TTL index
    // Pero podemos forzar la limpieza si es necesario
    await Session.deleteMany({ expiresAt: { $lt: new Date() } })
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error)
  }
}
