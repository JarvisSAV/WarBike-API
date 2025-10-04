# 🛡️ Rate Limiting - WarBike API

Sistema de rate limiting para proteger las rutas de la API contra ataques de fuerza bruta y abuso.

## 📋 Características

- ✅ Rate limiting basado en memoria (Map)
- ✅ Múltiples niveles de protección (IP + Email)
- ✅ Headers estándar HTTP (X-RateLimit-*)
- ✅ Limpieza automática de entradas expiradas
- ✅ Configuraciones predefinidas por tipo de endpoint
- ✅ Fácil de extender a Redis para producción

## 🔒 Límites Configurados

### 1. Autenticación (Login/Signin)
- **Límite**: 5 intentos cada 15 minutos
- **Por**: IP + Email
- **Mensaje**: "Demasiados intentos de inicio de sesión. Intenta nuevamente en 15 minutos."
- **Uso**: Protege contra ataques de fuerza bruta

### 2. Registro (Signup)
- **Límite**: 3 registros por hora
- **Por**: IP
- **Mensaje**: "Demasiados registros desde esta dirección. Intenta nuevamente en 1 hora."
- **Uso**: Previene spam de cuentas falsas

### 3. API General
- **Límite**: 100 requests cada 15 minutos
- **Por**: IP
- **Mensaje**: "Demasiadas solicitudes. Intenta nuevamente más tarde."
- **Uso**: Protección general de la API

### 4. Recuperación de Contraseña
- **Límite**: 3 intentos por hora
- **Por**: Email
- **Mensaje**: "Demasiadas solicitudes de restablecimiento. Intenta nuevamente en 1 hora."
- **Uso**: Previene abuso del sistema de email

## 🚀 Rutas Protegidas

### Signin (Doble protección)
```typescript
// Rate limit por IP
POST /api/signin
Límite: 5 requests / 15 min

// Rate limit adicional por email
Identificador: signin:{email}
Límite: 5 requests / 15 min
```

### Signup
```typescript
POST /api/signup
Límite: 3 requests / 1 hora por IP
```

## 📊 Headers de Respuesta

Todas las respuestas incluyen headers informativos:

```http
X-RateLimit-Limit: 5              # Número máximo de requests
X-RateLimit-Remaining: 3          # Requests restantes
X-RateLimit-Reset: 2025-10-04T... # Cuando se resetea el contador
```

Cuando se excede el límite:
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 900                  # Segundos para reintentar
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2025-10-04T...
```

## 🧪 Probar Rate Limiting

### 1. Ver estado actual
```bash
curl http://localhost:3000/api/rate-limit-status | jq
```

**Response:**
```json
{
  "clientIp": "172.17.0.1",
  "rateLimits": {
    "auth": {
      "allowed": true,
      "remaining": 5,
      "limit": 5,
      "resetTime": "2025-10-04T04:15:00.000Z"
    },
    "signup": {
      "allowed": true,
      "remaining": 3,
      "limit": 3,
      "resetTime": "2025-10-04T05:00:00.000Z"
    },
    "api": {
      "allowed": true,
      "remaining": 100,
      "limit": 100,
      "resetTime": "2025-10-04T04:15:00.000Z"
    }
  }
}
```

### 2. Probar límite de signin
```bash
# Script para probar el rate limit
for i in {1..6}; do
  echo "Intento $i:"
  curl -X POST http://localhost:3000/api/signin \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' \
    -i | grep -E "(HTTP|X-RateLimit|Retry)"
  echo ""
done
```

### 3. Probar límite de signup
```bash
# Intentar registrar 4 usuarios seguidos
for i in {1..4}; do
  echo "Registro $i:"
  curl -X POST http://localhost:3000/api/signup \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"user$i@test.com\",\"password\":\"Test1234\",\"name\":\"User $i\"}" \
    -i | grep -E "(HTTP|X-RateLimit|message)"
  echo ""
done
```

### 4. Verificar respuesta 429
```bash
# Después de exceder el límite
curl -X POST http://localhost:3000/api/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}' \
  -s | jq
```

**Response:**
```json
{
  "error": "Demasiados intentos de inicio de sesión. Intenta nuevamente en 15 minutos.",
  "retryAfter": 900
}
```

## 💻 Uso en el Código

### Aplicar rate limit manualmente
```typescript
import { applyRateLimit } from '@/lib/rate-limit-middleware'
import { RATE_LIMITS } from '@/lib/rate-limit'

export async function POST(request: Request) {
  // Por IP
  const rateLimit = applyRateLimit(request, RATE_LIMITS.AUTH)
  if (rateLimit) {
    return rateLimit
  }

  // Por identificador personalizado
  const email = 'user@example.com'
  const rateLimitByEmail = applyRateLimit(
    request,
    RATE_LIMITS.AUTH,
    `signin:${email}`
  )
  if (rateLimitByEmail) {
    return rateLimitByEmail
  }

  // Tu lógica aquí...
}
```

### Configuración personalizada
```typescript
import { applyRateLimit } from '@/lib/rate-limit-middleware'

export async function POST(request: Request) {
  const customLimit = applyRateLimit(request, {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minuto
    message: 'Límite personalizado excedido'
  })
  
  if (customLimit) {
    return customLimit
  }

  // Tu lógica...
}
```

### Usar wrapper (más limpio)
```typescript
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { RATE_LIMITS } from '@/lib/rate-limit'

async function handler(request: Request) {
  // Tu lógica aquí
  return NextResponse.json({ success: true })
}

export const POST = withRateLimit(handler, RATE_LIMITS.AUTH)
```

## 🔧 Resetear manualmente

### Resetear por identificador
```typescript
import { rateLimiter } from '@/lib/rate-limit'

// Resetear límite de un usuario específico
rateLimiter.reset('172.17.0.1')
rateLimiter.reset('signin:user@example.com')
```

### Limpiar todos los límites
```typescript
import { rateLimiter } from '@/lib/rate-limit'

rateLimiter.clear()
```

## 🚀 Migrar a Redis (Producción)

Para producción en entornos distribuidos, se recomienda usar Redis:

### 1. Instalar dependencias
```bash
npm install ioredis
npm install -D @types/ioredis
```

### 2. Crear rate limiter con Redis
```typescript
// lib/rate-limit-redis.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export async function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowSeconds: number
): Promise<{
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}> {
  const key = `ratelimit:${identifier}`
  const now = Date.now()
  const windowMs = windowSeconds * 1000

  // Usar comando Redis para atomic increment
  const count = await redis.incr(key)
  
  if (count === 1) {
    await redis.pexpire(key, windowMs)
  }

  const ttl = await redis.pttl(key)
  const resetTime = now + ttl

  if (count <= maxRequests) {
    return {
      allowed: true,
      remaining: maxRequests - count,
      resetTime
    }
  }

  return {
    allowed: false,
    remaining: 0,
    resetTime,
    retryAfter: Math.ceil(ttl / 1000)
  }
}
```

### 3. Usar Upstash (Serverless Redis)
```typescript
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})
```

## 📝 Variables de Entorno

```env
# Opcional: URL de Redis para producción
REDIS_URL=redis://localhost:6379

# O usar Upstash
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

## ⚡ Rendimiento

### Memoria (Actual)
- ~100 bytes por identificador
- Limpieza automática cada 60 segundos
- Ideal para: desarrollo, aplicaciones pequeñas

### Redis (Recomendado para producción)
- Distribuido entre múltiples instancias
- TTL automático (no necesita limpieza)
- Ideal para: aplicaciones en cluster, serverless

## 🛠️ Troubleshooting

### Problema: Rate limit no funciona en desarrollo
**Solución**: Verifica que estés haciendo requests desde diferentes IPs o identifica bien el header `x-forwarded-for`.

### Problema: Rate limit muy estricto en pruebas
**Solución**: 
```typescript
import { rateLimiter } from '@/lib/rate-limit'

// En tests, resetea entre cada test
afterEach(() => {
  rateLimiter.clear()
})
```

### Problema: Headers no aparecen
**Solución**: Asegúrate de que la ruta esté usando `applyRateLimit` o `withRateLimit`.

## 📚 Recursos

- [HTTP Status 429](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)
- [Rate Limiting Best Practices](https://blog.logrocket.com/rate-limiting-node-js/)
- [Upstash Redis](https://upstash.com/)
- [OWASP Rate Limiting](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#rate-limiting)
