import { NextResponse } from 'next/server'
import { rateLimiter, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit'

export async function GET(request: Request) {
  try {
    const clientIp = getClientIdentifier(request)
    
    // Obtener estado de los diferentes rate limits
    const authLimit = rateLimiter.check(clientIp, RATE_LIMITS.AUTH.maxRequests, RATE_LIMITS.AUTH.windowMs)
    const signupLimit = rateLimiter.check(clientIp, RATE_LIMITS.SIGNUP.maxRequests, RATE_LIMITS.SIGNUP.windowMs)
    const apiLimit = rateLimiter.check(clientIp, RATE_LIMITS.API.maxRequests, RATE_LIMITS.API.windowMs)

    return NextResponse.json({
      clientIp,
      rateLimits: {
        auth: {
          allowed: authLimit.allowed,
          remaining: authLimit.remaining,
          limit: RATE_LIMITS.AUTH.maxRequests,
          resetTime: new Date(authLimit.resetTime).toISOString(),
          retryAfter: authLimit.retryAfter
        },
        signup: {
          allowed: signupLimit.allowed,
          remaining: signupLimit.remaining,
          limit: RATE_LIMITS.SIGNUP.maxRequests,
          resetTime: new Date(signupLimit.resetTime).toISOString(),
          retryAfter: signupLimit.retryAfter
        },
        api: {
          allowed: apiLimit.allowed,
          remaining: apiLimit.remaining,
          limit: RATE_LIMITS.API.maxRequests,
          resetTime: new Date(apiLimit.resetTime).toISOString(),
          retryAfter: apiLimit.retryAfter
        }
      }
    })
  } catch (error) {
    console.error('Error checking rate limit status:', error)
    return NextResponse.json(
      { error: 'Error al verificar estado del rate limit' },
      { status: 500 }
    )
  }
}
