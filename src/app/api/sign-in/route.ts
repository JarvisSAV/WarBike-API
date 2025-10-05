import { NextResponse } from 'next/server'
import argon2 from 'argon2'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models'
import { createSession } from '@/lib/session'
import { applyRateLimit } from '@/lib/rate-limit-middleware'
import { RATE_LIMITS } from '@/lib/rate-limit'
import { z } from 'zod'

// Schema de validación
const signinSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida')
})

export async function POST(request: Request) {
  // Aplicar rate limiting por IP
  const rateLimitByIp = applyRateLimit(request, RATE_LIMITS.AUTH)
  if (rateLimitByIp) {
    return rateLimitByIp
  }
  try {
    const body = await request.json()

    // Validar datos de entrada
    const validation = signinSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          message: 'Datos inválidos',
          errors: validation.error.issues
        },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    // Rate limiting adicional por email (prevenir ataques dirigidos)
    const rateLimitByEmail = applyRateLimit(
      request,
      RATE_LIMITS.AUTH,
      `signin:${email}`
    )
    if (rateLimitByEmail) {
      return rateLimitByEmail
    }

    // Conectar a MongoDB
    await connectDB()

    // Buscar usuario por email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Verificar la contraseña con Argon2
    const isValidPassword = await argon2.verify(user.password, password)

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Crear sesión con el ObjectId del usuario
    await createSession(user._id)

    return NextResponse.json(
      { 
        message: 'Inicio de sesión exitoso',
        user: {
          _id: user._id,
          email: user.email,
          name: user.name
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
