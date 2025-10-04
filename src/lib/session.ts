import 'server-only'
import { cookies } from 'next/headers'
import { db } from './db'
import crypto from 'crypto'

// Duración de la sesión: 7 días
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

export interface SessionData {
  id: string
  userId: number
  expiresAt: Date
}

interface SessionRow {
  id: string
  user_id: number
  expires_at: Date
}

// Generar un ID de sesión seguro
function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Crear una nueva sesión en la base de datos
export async function createSession(userId: number): Promise<string> {
  try {
    const sessionId = generateSessionId()
    const expiresAt = new Date(Date.now() + SESSION_DURATION)

    // Insertar sesión en la base de datos
    await db.query(
      'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
      [sessionId, userId, expiresAt]
    )

    // Establecer cookie
    const cookieStore = await cookies()
    cookieStore.set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value

    if (!sessionId) {
      return null
    }

    // Buscar sesión en la base de datos
    const [rows] = await db.query(
      'SELECT id, user_id, expires_at FROM sessions WHERE id = ? AND expires_at > NOW()',
      [sessionId]
    ) as [SessionRow[], unknown]

    if (rows.length === 0) {
      // Sesión no encontrada o expirada
      await deleteSession()
      return null
    }

    const session = rows[0]
    return {
      id: session.id,
      userId: session.user_id,
      expiresAt: new Date(session.expires_at)
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

    // Actualizar en la base de datos
    await db.query(
      'UPDATE sessions SET expires_at = ? WHERE id = ?',
      [newExpiresAt, session.id]
    )

    // Actualizar cookie
    const cookieStore = await cookies()
    cookieStore.set('session', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value

    if (sessionId) {
      // Eliminar de la base de datos
      await db.query('DELETE FROM sessions WHERE id = ?', [sessionId])
    }

    // Eliminar cookie
    cookieStore.delete('session')
  } catch (error) {
    console.error('Error deleting session:', error)
  }
}

// Limpiar sesiones expiradas (ejecutar periódicamente)
export async function cleanupExpiredSessions(): Promise<void> {
  try {
    await db.query('DELETE FROM sessions WHERE expires_at < NOW()')
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error)
  }
}
