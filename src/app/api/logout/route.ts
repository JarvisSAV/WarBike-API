import { NextResponse } from 'next/server'
import { deleteSession, getSession } from '@/lib/session'

export async function POST() {
  try {
    // Verificar que hay una sesión activa
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { message: 'No hay sesión activa' },
        { status: 401 }
      )
    }

    // Eliminar la sesión
    await deleteSession()

    return NextResponse.json(
      { message: 'Sesión cerrada exitosamente' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error durante el cierre de sesión:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
