# 🚀 Migrar Rate Limiting a Redis (Producción)

Este archivo está preparado para cuando quieras migrar a Redis. Por ahora usamos memoria (Map).

## ¿Cuándo migrar a Redis?

- ✅ **Múltiples instancias**: Cuando tengas más de 1 servidor
- ✅ **Serverless**: Lambda, Vercel, etc.
- ✅ **Alta carga**: Miles de requests por segundo
- ✅ **Persistencia**: Necesitas que los límites sobrevivan a reinicios

## 📦 Instalación (cuando lo necesites)

```bash
npm install ioredis
npm install -D @types/ioredis
```

## 🔧 Configuración

### Opción 1: Redis local (desarrollo)
```bash
# Con Docker
docker run -d --name redis -p 6379:6379 redis:7-alpine

# Variables de entorno
echo "REDIS_URL=redis://localhost:6379" >> .env
```

### Opción 2: Upstash (producción serverless)
1. Crear cuenta en [Upstash](https://upstash.com)
2. Crear base de datos Redis
3. Copiar credenciales:

```bash
# .env
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

### Opción 3: Redis Cloud (producción)
```bash
REDIS_URL=redis://username:password@host:port
```

## 💻 Uso

El archivo `src/lib/rate-limit-redis.ts` ya está preparado pero no se usa todavía.

### Activar Redis:
```typescript
// Descomentar en rate-limit-middleware.ts
import { redisRateLimiter } from './rate-limit-redis'

export function applyRateLimit(request: Request, config: any, identifier?: string) {
  // Usar Redis si está disponible
  if (redisRateLimiter) {
    return redisRateLimiter.check(...)
  }
  
  // Fallback a memoria
  return rateLimiter.check(...)
}
```

## 🎯 Beneficios de Redis

| Característica | Memoria (actual) | Redis |
|---------------|------------------|-------|
| Multi-instancia | ❌ | ✅ |
| Persistencia | ❌ | ✅ |
| Escalabilidad | Limitada | Alta |
| Serverless | ❌ | ✅ |
| Complejidad | Baja | Media |
| Costo | $0 | $0-10/mes |

## 📝 Notas

- **Desarrollo**: Memoria es suficiente
- **Producción pequeña**: Memoria puede funcionar
- **Producción escalable**: Redis es necesario

El archivo Redis ya está creado y listo para usar cuando lo necesites.
