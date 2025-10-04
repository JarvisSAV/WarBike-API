# 📚 Documentación WarBike API

Bienvenido a la documentación técnica de WarBike API.

---

## 📖 Guías de Usuario

### 🔐 Autenticación
**[README-AUTH.md](./README-AUTH.md)**
- Sistema completo de registro y login
- Ejemplos de uso con curl y JavaScript
- Validaciones y seguridad
- Gestión de sesiones

### 🐳 Docker & Base de Datos
**[README-DOCKER.md](./README-DOCKER.md)**
- Configuración de MySQL con Docker
- Comandos útiles
- Backup y restauración
- Troubleshooting

### 🛡️ Rate Limiting
**[README-RATE-LIMIT.md](./README-RATE-LIMIT.md)**
- Protección contra fuerza bruta
- Configuración de límites
- Ejemplos de uso
- Migración a Redis

---

## 🔧 Documentación Técnica

### 📝 Implementaciones

**[IMPLEMENTACION-AUTH.md](./IMPLEMENTACION-AUTH.md)**
- Detalles de la implementación de autenticación
- Decisiones de diseño
- Pruebas realizadas

**[IMPLEMENTACION-RATE-LIMIT.md](./IMPLEMENTACION-RATE-LIMIT.md)**
- Detalles de la implementación de rate limiting
- Algoritmos utilizados
- Benchmarks y rendimiento

**[IMPLEMENTACION-RESUMEN.md](./IMPLEMENTACION-RESUMEN.md)**
- Resumen general del proyecto
- Stack tecnológico
- Próximos pasos

### 🚀 Guías de Migración

**[REDIS-MIGRATION.md](./REDIS-MIGRATION.md)**
- Cuándo migrar a Redis
- Opciones de configuración
- Guía paso a paso

---

## 🗂️ Estructura de Documentos

```
docs/
├── README.md                          # Este archivo (índice)
│
├── 📘 Guías de Usuario
│   ├── README-AUTH.md                 # Autenticación
│   ├── README-DOCKER.md               # Docker & MySQL
│   └── README-RATE-LIMIT.md           # Rate Limiting
│
├── 🔧 Documentación Técnica
│   ├── IMPLEMENTACION-AUTH.md         # Implementación de auth
│   ├── IMPLEMENTACION-RATE-LIMIT.md   # Implementación de rate limit
│   └── IMPLEMENTACION-RESUMEN.md      # Resumen general
│
└── 🚀 Guías de Migración
    └── REDIS-MIGRATION.md             # Migrar a Redis
```

---

## 🎯 Navegación Rápida

### Por Categoría

#### 🔐 Seguridad
- [Autenticación](./README-AUTH.md)
- [Rate Limiting](./README-RATE-LIMIT.md)

#### 🏗️ Infraestructura
- [Docker & MySQL](./README-DOCKER.md)
- [Migración a Redis](./REDIS-MIGRATION.md)

#### 📊 Implementación
- [Resumen General](./IMPLEMENTACION-RESUMEN.md)
- [Auth Técnico](./IMPLEMENTACION-AUTH.md)
- [Rate Limit Técnico](./IMPLEMENTACION-RATE-LIMIT.md)

---

## 🚀 Inicio Rápido

### Para empezar:
1. Lee el [README principal](../README.md)
2. Configura [Docker](./README-DOCKER.md)
3. Prueba la [Autenticación](./README-AUTH.md)

### Para desarrollo:
1. [Implementación de Auth](./IMPLEMENTACION-AUTH.md)
2. [Implementación de Rate Limit](./IMPLEMENTACION-RATE-LIMIT.md)
3. [Resumen Técnico](./IMPLEMENTACION-RESUMEN.md)

### Para producción:
1. Revisa el [Resumen](./IMPLEMENTACION-RESUMEN.md)
2. Considera [Redis](./REDIS-MIGRATION.md) para rate limiting
3. Revisa configuraciones de seguridad en [Auth](./README-AUTH.md)

---

## 💡 Convenciones

### Prefijos de archivos
- `README-*` → Guías de usuario y tutoriales
- `IMPLEMENTACION-*` → Documentación técnica de implementación
- Sin prefijo → Guías especiales (migración, etc.)

### Emojis
- 📖 Guías y tutoriales
- 🔧 Documentación técnica
- 🚀 Guías de migración/deployment
- ✅ Features implementados
- 🧪 Testing y pruebas
- 🔒 Seguridad

---

## 📝 Contribuir a la Documentación

Si encuentras errores o quieres mejorar la documentación:

1. Los archivos están en formato Markdown
2. Incluye ejemplos prácticos cuando sea posible
3. Mantén la estructura y convenciones existentes
4. Actualiza este índice si agregas nuevos documentos

---

## ❓ Preguntas Frecuentes

### ¿Por qué Argon2 en lugar de bcrypt?
Ver [README-AUTH.md](./README-AUTH.md#-seguridad)

### ¿Cuándo debo usar Redis?
Ver [REDIS-MIGRATION.md](./REDIS-MIGRATION.md#cuándo-migrar-a-redis)

### ¿Cómo configuro Docker?
Ver [README-DOCKER.md](./README-DOCKER.md#configuración)

### ¿Cómo funciona el rate limiting?
Ver [README-RATE-LIMIT.md](./README-RATE-LIMIT.md)

---

**Última actualización**: Octubre 4, 2025
