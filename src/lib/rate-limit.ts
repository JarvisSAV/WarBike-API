// Rate limiter simple basado en memoria
// Para producción, considera usar Redis o Upstash

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry>
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    this.requests = new Map()
    
    // Limpiar entradas expiradas cada 1 minuto
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.requests.entries()) {
      if (entry.resetTime < now) {
        this.requests.delete(key)
      }
    }
  }

  /**
   * Verifica si una request está dentro del límite
   * @param identifier - Identificador único (IP, email, etc.)
   * @param maxRequests - Número máximo de requests permitidas
   * @param windowMs - Ventana de tiempo en milisegundos
   * @returns objeto con información del rate limit
   */
  check(
    identifier: string,
    maxRequests: number,
    windowMs: number
  ): {
    allowed: boolean
    remaining: number
    resetTime: number
    retryAfter?: number
  } {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    // Si no existe o expiró, crear nueva entrada
    if (!entry || entry.resetTime < now) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      })

      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs
      }
    }

    // Si está dentro del límite
    if (entry.count < maxRequests) {
      entry.count++
      return {
        allowed: true,
        remaining: maxRequests - entry.count,
        resetTime: entry.resetTime
      }
    }

    // Excedió el límite
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000)
    }
  }

  /**
   * Resetea el contador para un identificador específico
   */
  reset(identifier: string): void {
    this.requests.delete(identifier)
  }

  /**
   * Limpia todos los contadores
   */
  clear(): void {
    this.requests.clear()
  }

  /**
   * Destruye el rate limiter y limpia los intervalos
   */
  destroy(): void {
    clearInterval(this.cleanupInterval)
    this.clear()
  }
}

// Instancia global del rate limiter
export const rateLimiter = new RateLimiter()

// Configuraciones predefinidas
export const RATE_LIMITS = {
  // Login/Signin: 5 intentos cada 15 minutos
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutos
    message: 'Demasiados intentos de inicio de sesión. Intenta nuevamente en 15 minutos.'
  },
  
  // Signup: 3 registros por hora por IP
  SIGNUP: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hora
    message: 'Demasiados registros desde esta dirección. Intenta nuevamente en 1 hora.'
  },
  
  // API general: 100 requests por 15 minutos
  API: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutos
    message: 'Demasiadas solicitudes. Intenta nuevamente más tarde.'
  },
  
  // Password reset: 3 intentos cada 1 hora
  PASSWORD_RESET: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hora
    message: 'Demasiadas solicitudes de restablecimiento. Intenta nuevamente en 1 hora.'
  }
}

// Helper para obtener la IP del cliente
export function getClientIdentifier(request: Request): string {
  // Intentar obtener la IP real detrás de proxies
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip') // Cloudflare
  
  return (
    cfConnectingIp ||
    realIp ||
    forwarded?.split(',')[0].trim() ||
    'unknown'
  )
}
