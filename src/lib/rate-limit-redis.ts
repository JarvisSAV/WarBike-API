// // Rate limiter con Redis para producción
// // Instalar: npm install ioredis
// // Configurar: REDIS_URL=redis://localhost:6379

// import Redis from 'ioredis'

// let redis: Redis | null = null

// // Inicializar Redis solo si está configurado
// if (process.env.REDIS_URL) {
//   redis = new Redis(process.env.REDIS_URL, {
//     maxRetriesPerRequest: 3,
//     retryStrategy(times) {
//       const delay = Math.min(times * 50, 2000)
//       return delay
//     }
//   })

//   redis.on('error', (err) => {
//     console.error('Redis connection error:', err)
//   })

//   redis.on('connect', () => {
//     console.log('✅ Connected to Redis for rate limiting')
//   })
// }

// interface RateLimitResult {
//   allowed: boolean
//   remaining: number
//   resetTime: number
//   retryAfter?: number
// }

// /**
//  * Rate limiter con Redis usando algoritmo sliding window
//  */
// export class RedisRateLimiter {
//   private redis: Redis

//   constructor(redisInstance?: Redis) {
//     if (redisInstance) {
//       this.redis = redisInstance
//     } else if (redis) {
//       this.redis = redis
//     } else {
//       throw new Error('Redis not configured. Set REDIS_URL environment variable.')
//     }
//   }

//   /**
//    * Verifica el rate limit usando sliding window counter
//    */
//   async check(
//     identifier: string,
//     maxRequests: number,
//     windowMs: number
//   ): Promise<RateLimitResult> {
//     const key = `ratelimit:${identifier}`
//     const now = Date.now()
//     const windowStart = now - windowMs

//     try {
//       // Pipeline para operaciones atómicas
//       const pipeline = this.redis.pipeline()

//       // Remover entradas antiguas fuera de la ventana
//       pipeline.zremrangebyscore(key, 0, windowStart)

//       // Contar requests en la ventana actual
//       pipeline.zcard(key)

//       // Agregar la request actual
//       pipeline.zadd(key, now, `${now}-${Math.random()}`)

//       // Establecer expiración de la key
//       pipeline.pexpire(key, windowMs)

//       const results = await pipeline.exec()

//       if (!results) {
//         throw new Error('Pipeline execution failed')
//       }

//       // El resultado del ZCARD está en results[1]
//       const count = (results[1][1] as number) || 0
//       const currentCount = count + 1 // +1 porque acabamos de agregar una

//       const resetTime = now + windowMs

//       if (currentCount <= maxRequests) {
//         return {
//           allowed: true,
//           remaining: maxRequests - currentCount,
//           resetTime
//         }
//       }

//       // Si excedió el límite, remover la request que acabamos de agregar
//       await this.redis.zrem(key, `${now}-${Math.random()}`)

//       return {
//         allowed: false,
//         remaining: 0,
//         resetTime,
//         retryAfter: Math.ceil(windowMs / 1000)
//       }
//     } catch (error) {
//       console.error('Redis rate limit error:', error)
//       // En caso de error de Redis, permitir la request (fail open)
//       return {
//         allowed: true,
//         remaining: maxRequests,
//         resetTime: now + windowMs
//       }
//     }
//   }

//   /**
//    * Resetea el contador para un identificador
//    */
//   async reset(identifier: string): Promise<void> {
//     const key = `ratelimit:${identifier}`
//     await this.redis.del(key)
//   }

//   /**
//    * Limpia todos los rate limits (cuidado en producción)
//    */
//   async clear(): Promise<void> {
//     const keys = await this.redis.keys('ratelimit:*')
//     if (keys.length > 0) {
//       await this.redis.del(...keys)
//     }
//   }

//   /**
//    * Obtiene estadísticas de uso
//    */
//   async getStats(identifier: string): Promise<{
//     count: number
//     ttl: number
//   }> {
//     const key = `ratelimit:${identifier}`
//     const [count, ttl] = await Promise.all([
//       this.redis.zcard(key),
//       this.redis.pttl(key)
//     ])

//     return { count, ttl }
//   }

//   /**
//    * Cierra la conexión Redis
//    */
//   async disconnect(): Promise<void> {
//     await this.redis.quit()
//   }
// }

// // Instancia global para uso con Redis
// export const redisRateLimiter = redis ? new RedisRateLimiter(redis) : null

// /**
//  * Rate limiter híbrido: usa Redis si está disponible, sino usa memoria
//  */
// export async function hybridRateLimit(
//   identifier: string,
//   maxRequests: number,
//   windowMs: number
// ): Promise<RateLimitResult> {
//   if (redisRateLimiter) {
//     return await redisRateLimiter.check(identifier, maxRequests, windowMs)
//   }

//   // Fallback a rate limiter en memoria
//   const { rateLimiter } = await import('./rate-limit')
//   return rateLimiter.check(identifier, maxRequests, windowMs)
// }
