import { NextResponse } from 'next/server'
import { rateLimiter, getClientIdentifier, RATE_LIMITS } from './rate-limit'

/**
 * Aplica rate limiting a una ruta
 * @param request - Request de Next.js
 * @param config - Configuración del rate limit
 * @param identifier - Identificador opcional (por defecto usa IP)
 * @returns NextResponse si excede el límite, null si está permitido
 */
export function applyRateLimit(
  request: Request,
  config: {
    maxRequests: number
    windowMs: number
    message: string
  },
  identifier?: string
): NextResponse | null {
  const clientId = identifier || getClientIdentifier(request)
  const result = rateLimiter.check(
    clientId,
    config.maxRequests,
    config.windowMs
  )

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: config.message,
        retryAfter: result.retryAfter
      },
      {
        status: 429,
        headers: {
          'Retry-After': result.retryAfter?.toString() || '900',
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(result.resetTime).toISOString()
        }
      }
    )
  }

  return null
}

/**
 * Wrapper para rutas que necesitan rate limiting
 */
export function withRateLimit(
  handler: (_req: Request) => Promise<NextResponse>,
  config: keyof typeof RATE_LIMITS | {
    maxRequests: number
    windowMs: number
    message: string
  },
  options?: {
    identifier?: (_req: Request) => string | Promise<string>
  }
) {
  return async (request: Request): Promise<NextResponse> => {
    try {
      // Obtener configuración
      const rateLimitConfig = typeof config === 'string' 
        ? RATE_LIMITS[config] 
        : config

      // Obtener identificador personalizado o usar IP
      const identifier = options?.identifier 
        ? await options.identifier(request)
        : getClientIdentifier(request)

      // Aplicar rate limit
      const rateLimitResponse = applyRateLimit(
        request,
        rateLimitConfig,
        identifier
      )

      if (rateLimitResponse) {
        return rateLimitResponse
      }

      // Ejecutar el handler
      const response = await handler(request)
      
      // Agregar headers de rate limit a la respuesta exitosa
      const result = rateLimiter.check(
        identifier,
        rateLimitConfig.maxRequests,
        rateLimitConfig.windowMs
      )

      response.headers.set('X-RateLimit-Limit', rateLimitConfig.maxRequests.toString())
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
      response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString())

      return response
    } catch (error) {
      console.error('Error in rate-limited route:', error)
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      )
    }
  }
}
