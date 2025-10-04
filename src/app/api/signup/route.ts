// ruta para la API de registro
import { NextResponse } from 'next/server'
import argon2 from 'argon2'
import { db } from '@/lib/db'
import { createSession } from '@/lib/session'
import { applyRateLimit } from '@/lib/rate-limit-middleware'
import { RATE_LIMITS } from '@/lib/rate-limit'
import { z } from 'zod'

// Schema de validación
const signupSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres')
})

interface UserRow {
  id: number
  email: string
}

interface InsertResult {
  insertId: number
}

export async function POST(request: Request) {
  // Aplicar rate limiting por IP
  const rateLimitByIp = applyRateLimit(request, RATE_LIMITS.SIGNUP)
  if (rateLimitByIp) {
    return rateLimitByIp
  }

  try {
    const body = await request.json()

    // Validar datos de entrada
    const validation = signupSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          message: 'Datos inválidos',
          errors: validation.error.issues
        },
        { status: 400 }
      )
    }

    const { email, password, name } = validation.data

    // Verificar si el usuario ya existe
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as [UserRow[], unknown]

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: 'El email ya está registrado' },
        { status: 409 }
      )
    }

    // Hashear la contraseña con Argon2
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456, // 19 MiB
      timeCost: 2,
      parallelism: 1
    })

    // Crear el nuevo usuario en la base de datos
    const [result] = await db.query(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    ) as [InsertResult, unknown]

    const userId = result.insertId

    // Crear sesión automáticamente después del registro
    await createSession(userId)

    return NextResponse.json(
      { 
        message: 'Usuario registrado exitosamente',
        user: {
          id: userId,
          email,
          name
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error durante el registro:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
