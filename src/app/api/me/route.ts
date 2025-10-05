import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/user'

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

    // Conectar a MongoDB
    await connectDB()

    // Obtener datos del usuario por ObjectId
    const user = await User.findById(session.userId).select('-password')

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt
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
