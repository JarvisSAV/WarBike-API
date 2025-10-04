import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

interface UserRow {
  id: number
  email: string
  name: string
  created_at: Date
}

export async function GET() {
  try {
    // Verificar sesión
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { message: 'No autenticado' },
        { status: 401 }
      )
    }

    // Obtener datos del usuario
    const [users] = await db.query(
      'SELECT id, email, name, created_at FROM users WHERE id = ?',
      [session.userId]
    ) as [UserRow[], unknown]

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const user = users[0]

    return NextResponse.json(
      { 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.created_at
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error al obtener perfil:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
